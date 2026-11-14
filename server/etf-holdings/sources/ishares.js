// server/etf-holdings/sources/ishares.js
// Adapter para iShares (BlackRock)
//
// ETFs soportados: SOXX, IWM, IJR, IJH, EFA, EEM, HYG, LQD
//
// Fuente: CSV directo desde la URL /latest-holdings.csv de iShares
// URL patrón: https://www.ishares.com/us/products/{id}/{slug}/latest-holdings.csv
//
// Estructura CSV real (verificado Nov 2026):
//   Fila 0: nombre del fondo  ("iShares Semiconductor ETF")
//   Fila 1: fecha             ("Fund Holdings as of,\"Nov 12, 2026\"")
//   Filas 2-5: metadatos      (Inception Date, Shares Outstanding, Stock, Bond, Cash, Other)
//   Fila 6: cabecera          ("Ticker,Name,Sector,Asset Class,Market Value,Weight (%),...")
//   Filas 7+: datos
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

// Map de tickers → configuración de URL iShares
const ISHARES_CONFIG = {
  SOXX: { id: '239705', slug: 'ishares-semiconductor-etf' },
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
  const csvUrl = `https://www.ishares.com/us/products/${config.id}/${config.slug}/latest-holdings.csv`;
  const csvText = await fetchCsv(csvUrl, ticker);

  // ── Parsear CSV ────────────────────────────────────────────────────
  const rows = parseCsv(csvText);

  if (rows.length < 3) {
    throw new Error(`iShares ${ticker}: CSV demasiado corto (${rows.length} filas)`);
  }

  // ── Extraer fecha de referencia ─────────────────────────────────────
  // Formato numérico: "11/12/2026"  → fila 1: "Fund Holdings as of,11/12/2026,..."
  // Formato textual:  "Nov 12, 2026" → fila 1: "Fund Holdings as of,\"Nov 12, 2026\",..."
  let referenceDate = new Date().toISOString().split('T')[0];
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    const joined = row.join(' ');
    // Intento 1: formato numérico MM/DD/YYYY
    const m1 = joined.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m1) {
      try {
        const d = new Date(`${m1[3]}-${m1[1].padStart(2,'0')}-${m1[2].padStart(2,'0')}`);
        if (!isNaN(d)) { referenceDate = d.toISOString().split('T')[0]; break; }
      } catch {}
    }
    // Intento 2: formato textual "Mon DD, YYYY"
    const m2 = joined.match(/([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})/);
    if (m2) {
      try {
        const d = new Date(`${m2[1]} ${m2[2]}, ${m2[3]}`);
        if (!isNaN(d)) { referenceDate = d.toISOString().split('T')[0]; break; }
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

    // Ignorar filas de disclaimer legal que iShares append al final del CSV
    // (textos legales, advertencias, etc. — no son holdings reales)
    const rawNameUpper = rawName.toUpperCase();
    const isDisclaimer = rawName.includes('©') ||
                         rawNameUpper.includes('CAREFULLY CONSIDER') ||
                         rawNameUpper.includes('BLACKROCK INVESTMENTS') ||
                         rawNameUpper.includes('NOT SPONSORED') ||
                         rawNameUpper.includes('FOR ILLUSTRATIVE') ||
                         rawNameUpper.includes('SHOULD NOT BE RELIED') ||
                         rawNameUpper.includes('INVESTMENT OBJECTIVES') ||
                         rawNameUpper.includes('GENERALLY REPRESENT') ||
                         rawNameUpper.includes('PRICING VENDOR') ||
                         rawNameUpper.includes('NET ASSET VALUE') ||
                         // Textos muy largos que no pueden ser nombres de empresa
                         rawName.length > 80;
    if (isDisclaimer) continue;

    // Ignorar tickers que no son accionarios (derivados, futuros, etc.)
    // iShares usa "Equity" para acciones; otros asset classes son cash/futures/etc.
    if (assetCls && assetCls !== 'equity' &&
        !assetCls.includes('stock') &&
        !assetCls.includes('depositary receipt') &&
        !assetCls.includes('real estate') &&
        assetCls !== '') {
      // Solo excluir si el assetClass está claramente definido como no-equity
      if (assetCls === 'futures' || assetCls === 'forward' ||
          assetCls === 'options' || assetCls === 'rights') {
        cashRows++;
        continue;
      }
    }

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
        'Referer':         `https://www.ishares.com/us/products/${url.split('/products/')[1]?.split('/')[0] || ''}/${url.split('/products/')[1]?.split('/')[1] || ''}`,
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
