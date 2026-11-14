// server/etf-holdings/sources/spdr.js
// Adapter para SPDR/State Street Global Advisors
//
// ETFs soportados: XBI, KRE, XOP, XAR, FSTA, FSTA, XRT, XLC, XLE, XLF,
//   XLK, XLV, XLY, XLP, XLI, XLB, XLU, XLRE, XLC
//
// Fuente oficial: ssga.com holdings XLSX diario
// URL patrón: https://www.ssga.com/library-content/products/fund-data/etfs/us/holdings-daily-us-en-{ticker}.xlsx
//
// NOTA: State Street ofrece descarga XLSX directa sin autenticación.
// Los ficheros se actualizan diariamente en días hábiles.
// ─────────────────────────────────────────────────────────────────────

import https from 'https';
import { Readable } from 'stream';

// Tickers gestionados por SPDR/State Street
const SPDR_TICKERS = new Set([
  'XBI', 'KRE', 'XOP', 'XAR', 'FSTA', 'XRT',
  'GLD', 'SPY', 'MDY', 'SLY',
  // Sectoriales SPDR
  'XLK', 'XLF', 'XLV', 'XLE', 'XLY', 'XLP', 'XLI', 'XLB', 'XLU', 'XLRE', 'XLC',
]);

/**
 * Verifica si este adapter soporta el ticker dado.
 */
export function supports(ticker) {
  return SPDR_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde ssga.com.
 * Devuelve array de { ticker, name, weight, shares } o lanza error.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "XBI")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const url = `https://www.ssga.com/library-content/products/fund-data/etfs/us/holdings-daily-us-en-${ticker.toLowerCase()}.xlsx`;

  const rawBuffer = await downloadBuffer(url, ticker);

  // Parsear XLSX en Node.js (xlsx package)
  const XLSX = await importXLSX();
  const workbook = XLSX.read(rawBuffer, { type: 'buffer', cellDates: true });

  const sheetName = workbook.SheetNames[0];
  const sheet     = workbook.Sheets[sheetName];

  // El XLSX de SSGA tiene encabezados en la primera fila con columnas:
  // Name, Ticker, Identifier (CUSIP), SEDOL, Weight, Shares Held, Local Currency
  // Hay filas de cabecera antes de los datos (nombre del fondo, fecha, etc.)
  // Buscar la fila con "Ticker" o "Name" como encabezado
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Encontrar la fila de encabezado
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(20, rows.length); i++) {
    const row = rows[i];
    if (!row) continue;
    const rowStr = row.map(c => String(c || '').toLowerCase()).join('|');
    if (rowStr.includes('ticker') && rowStr.includes('weight')) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    throw new Error(`SPDR ${ticker}: no se encontró fila de encabezado en el XLSX`);
  }

  const headers = rows[headerRowIdx].map(h => String(h || '').trim().toLowerCase());
  const colName    = headers.findIndex(h => h === 'name');
  const colTicker  = headers.findIndex(h => h === 'ticker');
  const colWeight  = headers.findIndex(h => h === 'weight');
  const colShares  = headers.findIndex(h => h.includes('shares'));

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(`SPDR ${ticker}: columnas Ticker/Weight no encontradas. Encabezados: ${headers.join(', ')}`);
  }

  // Buscar fecha de referencia (suele estar en filas previas al header)
  let referenceDate = null;
  for (let i = 0; i < headerRowIdx; i++) {
    const row = rows[i];
    if (!row) continue;
    for (const cell of row) {
      if (cell instanceof Date) {
        referenceDate = cell.toISOString().split('T')[0];
        break;
      }
      if (typeof cell === 'string' && /\d{1,2}\/\d{1,2}\/\d{4}/.test(cell)) {
        const parts = cell.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (parts) {
          referenceDate = `${parts[3]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
          break;
        }
      }
    }
    if (referenceDate) break;
  }
  if (!referenceDate) referenceDate = new Date().toISOString().split('T')[0];

  const holdings = [];
  let totalWeight = 0;
  let cashRows = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[colTicker]) continue;

    const rawTicker = String(row[colTicker] || '').trim();
    const rawName   = colName >= 0 ? String(row[colName] || '').trim() : rawTicker;
    const rawWeight = row[colWeight];

    // Saltar filas vacías, cash, y totales
    if (!rawTicker || rawTicker === '-') continue;

    const weight = parseFloat(rawWeight) || 0;

    // Detectar posiciones no-accionarias (cash, etc.)
    const isCash = rawTicker.length > 10 || rawName.toLowerCase().includes('cash') ||
                   rawName.toLowerCase().includes('collateral') ||
                   rawTicker.includes(' ');

    if (isCash) {
      cashRows++;
      continue; // excluir cash del screener pero contabilizar
    }

    holdings.push({
      ticker: rawTicker,
      name:   rawName,
      weight: parseFloat(weight.toFixed(4)),
      shares: colShares >= 0 ? (parseFloat(row[colShares]) || null) : null,
    });
    totalWeight += weight;
  }

  if (holdings.length === 0) {
    throw new Error(`SPDR ${ticker}: 0 posiciones accionarias extraídas del XLSX`);
  }

  return {
    source:        'SPDR/SSGA',
    sourceUrl:     url,
    referenceDate,
    totalHoldings: holdings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Descarga una URL y devuelve el contenido como Buffer.
 * Verifica que la respuesta sea un fichero XLSX válido.
 */
async function downloadBuffer(url, ticker) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ETF-Holdings-Fetcher/1.0)',
        'Accept':     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
        'Referer':    'https://www.ssga.com/',
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Seguir redirección
        const redirectUrl = res.headers.location;
        downloadBuffer(redirectUrl, ticker).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`SPDR ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        // Verificar magic bytes XLSX (PK = 0x50 0x4B)
        if (buf.length < 4 || buf[0] !== 0x50 || buf[1] !== 0x4B) {
          reject(new Error(`SPDR ${ticker}: la respuesta no es un XLSX válido (${buf.length} bytes, magic: ${buf[0]?.toString(16)} ${buf[1]?.toString(16)})`));
          return;
        }
        resolve(buf);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`SPDR ${ticker}: timeout descargando XLSX`));
    });
    req.end();
  });
}

/** Importa xlsx dinámicamente (evita problemas con bundlers) */
async function importXLSX() {
  try {
    const mod = await import('xlsx');
    return mod.default || mod;
  } catch {
    throw new Error('Librería xlsx no disponible. Instalar: npm install xlsx');
  }
}
