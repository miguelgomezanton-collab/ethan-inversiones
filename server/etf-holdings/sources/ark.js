// server/etf-holdings/sources/ark.js
// Adapter para ARK Invest ETFs
//
// ETFs soportados (Fase 2 — 63 subsectores):
//   ARKG  — ARK Genomic Revolution ETF
//   CARZ  — ARK Autonomous Technology & Robotics ETF
//           (antes ARK era CARZ; ahora CARZ es de Global X — ver nota)
//
// NOTA sobre CARZ:
//   ARK lanzó CARZ como "ARK Autonomous Technology & Robotics" pero
//   el ticker CARZ en nuestro SUBSECTORS_CONFIG corresponde al
//   "Global X Autonomous & Electric Vehicles ETF" (ticker DRIV fue
//   renombrado; en la config CARZ = Global X). Verificar en
//   rv-sectores.js — si CARZ es ARK, usar este adapter; si es Global X,
//   agregar a globalx.js.
//
// Fuente primaria: CSV directo en ark-funds.com
//   ARKG: https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_GENOMIC_REVOLUTION_ETF_ARKG_HOLDINGS.csv
//
// El CSV de ARK tiene la siguiente estructura:
//   date,fund,company,ticker,cusip,shares,market value ($),weight (%)
//   "12/01/2024","ARKG","Twist Bioscience Corp","TWST","90184D100",2500000,135000000,10.5
//
// ARK actualiza holdings diariamente después del cierre de mercado.
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

const ARK_TICKERS = new Set(['ARKG', 'CARZ']);

// Mapa de ticker → nombre del fondo para construir la URL del CSV
const ARK_CSV_NAMES = {
  ARKG: 'ARK_GENOMIC_REVOLUTION_ETF_ARKG',
  CARZ: 'ARK_AUTONOMOUS_TECHNOLOGY_ROBOTICS_ETF_CARZ',
};

/** Verifica si este adapter soporta el ticker dado */
export function supports(ticker) {
  return ARK_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde ARK Invest.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "ARKG")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const csvName = ARK_CSV_NAMES[ticker];

  if (!csvName) {
    throw new Error(`ARK adapter: ticker ${ticker} no tiene mapping CSV configurado`);
  }

  const csvUrl = `https://ark-funds.com/wp-content/uploads/funds-etf-csv/${csvName}_HOLDINGS.csv`;

  console.log(`[ARK] ${ticker}: descargando CSV desde ${csvUrl}`);

  const { statusCode, body } = await httpGet(csvUrl, {
    'Accept':  'text/csv,application/csv,*/*;q=0.9',
    'Referer': `https://ark-funds.com/funds/${ticker.toLowerCase()}/`,
  });

  if (statusCode !== 200) {
    throw new Error(`ARK ${ticker}: HTTP ${statusCode} desde ${csvUrl}`);
  }

  if (!body || body.length < 100) {
    throw new Error(`ARK ${ticker}: respuesta CSV vacía o demasiado corta (${body.length} bytes)`);
  }

  return parseCsv(body, ticker, csvUrl);
}

// ── Parseo del CSV de ARK ─────────────────────────────────────────────

function parseCsv(csv, ticker, sourceUrl) {
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 3) {
    throw new Error(`ARK ${ticker}: CSV con menos de 3 líneas`);
  }

  // Encontrar la línea de cabecera (contiene 'date' y 'fund')
  let headerIndex = -1;
  let headers     = [];

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const cols = parseCsvLine(lines[i]).map(c => c.toLowerCase().trim());
    if (cols.includes('date') && (cols.includes('fund') || cols.includes('ticker'))) {
      headerIndex = i;
      headers     = cols;
      break;
    }
  }

  if (headerIndex === -1) {
    throw new Error(`ARK ${ticker}: no se encontró línea de cabecera en el CSV`);
  }

  const colDate   = headers.indexOf('date');
  const colTicker = headers.findIndex(h => h === 'ticker' || h === 'symbol');
  const colName   = headers.findIndex(h => h === 'company' || h === 'name');
  const colWeight = headers.findIndex(h => h.includes('weight'));
  const colShares = headers.indexOf('shares');

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(`ARK ${ticker}: columnas Ticker/Weight no encontradas. Cabeceras: ${headers.join(', ')}`);
  }

  const holdings  = [];
  let cashRows    = 0;
  let referenceDate = '';

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.length <= Math.max(colTicker, colWeight)) continue;

    const rawTicker = cells[colTicker]?.trim() || '';
    const rawName   = colName >= 0 ? (cells[colName]?.trim() || '') : rawTicker;
    const rawWeight = cells[colWeight]?.trim() || '0';
    const rawDate   = colDate >= 0 ? (cells[colDate]?.trim() || '') : '';

    if (!rawTicker || rawTicker === '-' || rawTicker === 'N/A') continue;

    // Capturar la fecha de referencia de la primera fila
    if (!referenceDate && rawDate) {
      referenceDate = parseDate(rawDate);
    }

    // Detectar cash/collateral
    if (isCash(rawTicker, rawName)) {
      cashRows++;
      continue;
    }

    const weight = parseFloat(rawWeight.replace('%', '').replace(',', '.')) || 0;
    if (weight <= 0) continue;

    const shares = colShares >= 0
      ? (parseFloat((cells[colShares] || '0').replace(/[,\s]/g, '')) || null)
      : null;

    holdings.push({
      ticker: rawTicker.toUpperCase(),
      name:   rawName,
      weight: parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`ARK ${ticker}: 0 holdings extraídos del CSV`);
  }

  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    source:        'ARK Invest',
    sourceUrl,
    referenceDate: referenceDate || new Date().toISOString().split('T')[0],
    totalHoldings: holdings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

/** Parsea una línea CSV respetando campos entre comillas */
function parseCsvLine(line) {
  const result = [];
  let current  = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// ── Helpers ──────────────────────────────────────────────────────────

function isCash(ticker, name) {
  const t = ticker.toLowerCase();
  const n = name.toLowerCase();
  return t === 'cash' || t === 'usd' || t.startsWith('xtsla') ||
         n.includes('cash') || n.includes('money market') ||
         n.includes('collateral') || n.includes('repo') ||
         ticker.length > 12;
}

function parseDate(raw) {
  if (!raw) return new Date().toISOString().split('T')[0];
  // Formato MM/DD/YYYY
  const mdyMatch = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mdyMatch) {
    return `${mdyMatch[3]}-${mdyMatch[1].padStart(2,'0')}-${mdyMatch[2].padStart(2,'0')}`;
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

const BROWSER_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Connection':      'keep-alive',
};

function httpGet(url, extraHeaders = {}, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers:  { ...BROWSER_HEADERS, ...extraHeaders },
      timeout,
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`timeout ${timeout}ms — ${url}`)); });
    req.end();
  });
}
