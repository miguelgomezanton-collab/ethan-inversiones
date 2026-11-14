// server/etf-holdings/sources/ishares.js
// Adapter para iShares (BlackRock)
//
// ETFs soportados: SOXX, IWM, IJR, IJH, QQQ (y otros iShares con URL conocida)
//
// Fuente: CSV directo desde la API de iShares
// URL patrón: https://www.ishares.com/us/products/{id}/{slug}/1467271812596.ajax?tab=holdings&fileType=csv
//
// Estructura CSV (cabecera en fila 0, datos desde fila 2):
//   Name, Ticker, Asset Class, Market Value, Weight (%), Notional Value, Shares, CUSIP, ISIN, ...
//
// La fila 0 es el título con la fecha: "iShares Semiconductor ETF,,,..."
// La fila 1 es la fecha: "Fund Holdings as of,11/13/2026,..."
// La fila 2 es la cabecera: "Name,Ticker,Asset Class,Market Value,Weight (%),..."
// Las filas 3+ son los datos
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

// Map de tickers → configuración de URL iShares
const ISHARES_CONFIG = {
  SOXX: { id: '239705', slug: 'ishares-phlx-semiconductor-etf' },
  IWM:  { id: '239710', slug: 'ishares-russell-2000-etf' },
  IJR:  { id: '239714', slug: 'ishares-core-sp-small-cap-etf' },
  IJH:  { id: '239763', slug: 'ishares-core-sp-mid-cap-etf' },
  EFA:  { id: '239623', slug: 'ishares-msci-eafe-etf' },
  EEM:  { id: '239637', slug: 'ishares-msci-emerging-markets-etf' },
  HYG:  { id: '239565', slug: 'ishares-iboxx-high-yield-corporate-bond-etf' },
  LQD:  { id: '239566', slug: 'ishares-iboxx-investment-grade-corporate-bond-etf' },
};

const ISHARES_TICKERS = new Set(Object.keys(ISHARES_CONFIG));

/** Verifica si este adapter soporta el ticker */
export function supports(ticker) {
  return ISHARES_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde el CSV de iShares.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "SOXX")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const config = ISHARES_CONFIG[ticker];
  if (!config) {
    throw new Error(`iShares: no hay URL configurada para ${ticker}`);
  }

  // URL del CSV público de iShares (sin autenticación, funciona desde servidores)
  const csvUrl = `https://www.ishares.com/us/products/${config.id}/${config.slug}/1467271812596.ajax?tab=holdings&fileType=csv`;
  const csvText = await fetchCsv(csvUrl, ticker);

  // ── Parsear CSV ────────────────────────────────────────────────────
  const rows = parseCsv(csvText);

  if (rows.length < 3) {
    throw new Error(`iShares ${ticker}: CSV demasiado corto (${rows.length} filas)`);
  }

  // ── Extraer fecha de referencia (fila 1: "Fund Holdings as of,MM/DD/YYYY,...")
  let referenceDate = new Date().toISOString().split('T')[0];
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    const joined = row.join(' ');
    const m = joined.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) {
      try {
        const d = new Date(`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`);
        if (!isNaN(d)) {
          referenceDate = d.toISOString().split('T')[0];
          break;
        }
      } catch {}
    }
  }

  // ── Encontrar fila de cabecera (contiene "Ticker" o "Name") ───────
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i];
    if (row.some(cell => cell.trim().toLowerCase() === 'ticker')) {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) {
    throw new Error(`iShares ${ticker}: no se encontró fila de cabecera en el CSV`);
  }

  const headers = rows[headerRowIdx].map(h => h.trim().toLowerCase());
  const colName    = headers.findIndex(h => h === 'name');
  const colTicker  = headers.findIndex(h => h === 'ticker');
  const colClass   = headers.findIndex(h => h === 'asset class');
  const colWeight  = headers.findIndex(h => h.includes('weight'));
  const colShares  = headers.findIndex(h => h === 'shares' || h === 'quantity' || h === 'units outstanding');

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(
      `iShares ${ticker}: columnas no encontradas. Headers: ${headers.join(', ')}`
    );
  }

  // ── Iterar filas de datos ──────────────────────────────────────────
  const holdings = [];
  let cashRows = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3 || row.every(cell => !cell || cell.trim() === '')) continue;

    const rawTicker = (row[colTicker] || '').trim();
    const rawName   = colName >= 0 ? (row[colName]  || '').trim() : rawTicker;
    const rawWeight = (row[colWeight] || '0').replace('%', '').trim();
    const assetCls  = colClass >= 0 ? (row[colClass] || '').toLowerCase() : '';

    const weight = parseFloat(rawWeight) || 0;

    // Ignorar filas sin ticker ni nombre
    if (!rawTicker && !rawName) continue;
    if (rawTicker === '-') continue;

    // Detectar cash/collateral/derivados
    const nameLC = rawName.toLowerCase();
    const isCash = assetCls === 'cash' ||
                   assetCls.includes('money market') ||
                   nameLC.includes('cash') ||
                   nameLC.includes('money market') ||
                   nameLC.includes('collateral') ||
                   nameLC.includes('blackrock cash') ||
                   rawTicker === 'USD' ||
                   (!rawTicker && weight < 0.01);

    if (isCash) {
      cashRows++;
      continue;
    }

    // Parsear shares
    let shares = null;
    if (colShares >= 0 && row[colShares]) {
      const sharesNum = parseFloat(String(row[colShares]).replace(/,/g, ''));
      if (!isNaN(sharesNum) && sharesNum > 0) shares = sharesNum;
    }

    holdings.push({
      ticker: rawTicker || rawName.substring(0, 10).toUpperCase().replace(/\s/g, ''),
      name:   rawName || rawTicker,
      weight: parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`iShares ${ticker}: 0 posiciones extraídas del CSV`);
  }

  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

  return {
    source:        'iShares',
    sourceUrl:     csvUrl,
    referenceDate,
    totalHoldings: holdings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Parser de CSV simple que maneja comillas y comas dentro de campos.
 */
function parseCsv(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let inQuotes = false;
    let cell = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        row.push(cell);
        cell = '';
      } else {
        cell += ch;
      }
    }
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/**
 * Descarga texto CSV desde una URL HTTPS con timeout de 8s.
 */
async function fetchCsv(url, ticker) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'text/csv,application/csv,text/plain,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection':      'keep-alive',
        'Referer':         `https://www.ishares.com/us/products/${url.split('/products/')[1]?.split('/')[0] || ''}/`,
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (!loc) { reject(new Error(`iShares ${ticker}: redirección sin Location`)); return; }
        const absUrl = loc.startsWith('http') ? loc : `https://${reqUrl.hostname}${loc}`;
        fetchCsv(absUrl, ticker).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`iShares ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf-8');
        if (!text || text.length < 100) {
          reject(new Error(`iShares ${ticker}: respuesta vacía (${text.length} bytes)`));
          return;
        }
        resolve(text);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`iShares ${ticker}: timeout descargando CSV (8s)`));
    });
    req.end();
  });
}
