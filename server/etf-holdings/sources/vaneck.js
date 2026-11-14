// server/etf-holdings/sources/vaneck.js
// Adapter para VanEck
//
// ETFs soportados: SMH, GDX, SIL, XME, REMX, GDXJ
//
// Fuente: vaneck.com/us/en/etf/equity/{ticker}/holdings/download/xlsx/
// Descarga directa del XLSX de holdings — rápida y fiable desde Vercel.
//
// Estructura XLSX (fila 0 = título, fila 1 = vacía, fila 2 = cabecera):
//   Number | Ticker | Holding Name | Identifier (FIGI) | Shares | Asset Class
//           | Market Value (US$) | Notional Value | % of Net Assets
//
// CONDICIÓN #5: Normalizar tickers internacionales para Yahoo Finance
//               Formato OTC: "NST AU" → "NST.AX", "EDV LN" → "EDV.L"
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

async function importXLSX() {
  const mod = await import('xlsx');
  return mod.default ?? mod;
}

// Patrón de URL XLS: /us/en/etf/equity/{ticker-lower}/holdings/download/xlsx/
// Se confirma que funciona para SMH y GDX (verificado 2026-11-14)
const VANECK_TICKERS_SUPPORTED = new Set(['SMH', 'GDX', 'SIL', 'REMX', 'XME', 'GDXJ']);

// Map de tickers a slug en la URL XLS (en minúsculas tal como aparece en la URL)
// Si el ticker en minúsculas no funciona, añadir aquí el slug correcto
const VANECK_XLS_SLUG = {
  SMH:  'smh',
  GDX:  'gdx',
  SIL:  'sil',
  REMX: 'remx',
  XME:  'xme',
  GDXJ: 'gdxj',
};

/** Verifica si este adapter soporta el ticker */
export function supports(ticker) {
  return VANECK_TICKERS_SUPPORTED.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde el XLSX de VanEck.
 * Incluye normalización de tickers internacionales para Yahoo Finance.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "SMH", "GDX")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const slug   = VANECK_XLS_SLUG[ticker];
  if (!slug) {
    throw new Error(`VanEck: no hay URL configurada para ${ticker}`);
  }

  const xlsUrl = `https://www.vaneck.com/us/en/etf/equity/${slug}/holdings/download/xlsx/`;
  const buffer = await downloadBuffer(xlsUrl, ticker);

  // ── Parsear XLSX ───────────────────────────────────────────────────
  const XLSX = await importXLSX();
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];

  // Leer como array de arrays (fila 0 = título, fila 2 = cabecera, fila 3+ = datos)
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // ── Extraer fecha de referencia del título (fila 0) ───────────────
  const titleRow = (rows[0] || [])[0] || '';
  const referenceDate = extractDateFromTitle(titleRow, ticker);

  // ── Encontrar fila de cabecera ────────────────────────────────────
  // Fila 2 debería ser la cabecera, pero buscamos dinámicamente por si varía
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    if (row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('ticker'))) {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) {
    throw new Error(`VanEck ${ticker}: no se encontró fila de cabecera en el XLSX`);
  }

  const headers = rows[headerRowIdx].map(h => String(h).toLowerCase().trim());
  const colTicker  = headers.findIndex(h => h === 'ticker');
  const colName    = headers.findIndex(h => h === 'holding name' || h.includes('holding'));
  const colWeight  = headers.findIndex(h => h.includes('% of net') || h.includes('net asset'));
  const colShares  = headers.findIndex(h => h === 'shares');
  const colClass   = headers.findIndex(h => h.includes('asset class'));

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(
      `VanEck ${ticker}: columnas no encontradas. Headers: ${headers.join(', ')}`
    );
  }

  // ── Iterar filas de datos ──────────────────────────────────────────
  const holdings = [];
  let cashRows = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(cell => cell === '' || cell === null || cell === undefined)) continue;

    const rawTicker = String(row[colTicker] || '').trim();
    const rawName   = colName   >= 0 ? String(row[colName]   || '').trim() : rawTicker;
    const rawWeight = String(row[colWeight] || '0').replace('%', '').trim();
    const assetCls  = colClass  >= 0 ? String(row[colClass]  || '').toLowerCase() : '';

    const weight = parseFloat(rawWeight) || 0;

    if (!rawTicker && !rawName) continue;
    if (weight === 0 && !rawTicker) continue;

    // Detectar cash/collateral
    const nameLC = rawName.toLowerCase();
    const isCash = assetCls.includes('cash') ||
                   nameLC.includes('cash') ||
                   nameLC.includes('money market') ||
                   nameLC.includes('collateral') ||
                   nameLC.includes('receivable') ||
                   rawTicker === 'CASH' ||
                   rawTicker === 'USD';

    if (isCash) {
      cashRows++;
      continue;
    }

    // Parsear shares (puede ser "66,457,749" con comas)
    let shares = null;
    if (colShares >= 0 && row[colShares]) {
      const sharesStr = String(row[colShares]).replace(/,/g, '');
      const sharesNum = parseFloat(sharesStr);
      if (!isNaN(sharesNum) && sharesNum > 0) shares = sharesNum;
    }

    holdings.push({
      ticker:         rawTicker,
      name:           rawName || rawTicker,
      weight:         parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`VanEck ${ticker}: 0 posiciones extraídas del XLSX`);
  }

  // ── Normalizar tickers internacionales (Condición #5) ─────────────
  const normalizedHoldings = holdings.map(h => ({
    ...h,
    ticker:         normalizeInternationalTicker(h.ticker, ticker),
    originalTicker: h.ticker,
  }));

  const totalWeight = normalizedHoldings.reduce((sum, h) => sum + h.weight, 0);

  return {
    source:        'VanEck',
    sourceUrl:     xlsUrl,
    referenceDate,
    totalHoldings: normalizedHoldings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings:      normalizedHoldings,
  };
}

// ── Normalización de tickers internacionales ──────────────────────────
// Condición #5: GDX tiene ~40% de posiciones con sufijos de bolsa
// internacional que no son reconocidos directamente por Yahoo Finance.
// Formato VanEck: "NST AU" (AuSE), "EDV LN" (LSE), "LUG CN" (TSX), etc.
// Yahoo Finance usa: "NST.AX", "EDV.L", "LUG.TO"

const EXCHANGE_SUFFIX_MAP = {
  'AU': '.AX',   // Australian Securities Exchange
  'LN': '.L',    // London Stock Exchange
  'CN': '.TO',   // Toronto Stock Exchange (Canada)
  'HK': '.HK',   // Hong Kong Stock Exchange
  'NO': '.OL',   // Oslo Stock Exchange (Euronext Oslo)
  'GR': '.DE',   // Deutsche Börse (Frankfurt)
  'FP': '.PA',   // Euronext Paris
  'SM': '.MC',   // Bolsa de Madrid
  'IM': '.MI',   // Borsa Italiana (Milan)
  'NA': '.AS',   // Euronext Amsterdam
  'SS': '.ST',   // Nasdaq Stockholm
  'SW': '.SW',   // SIX Swiss Exchange
  'JT': '.T',    // Tokyo Stock Exchange
  'SP': '.SI',   // Singapore Exchange
  'SJ': '.JO',   // JSE (Johannesburg)
  'PL': '.LS',   // Euronext Lisbon
  'AT': '.AT',   // Athens Stock Exchange
  'AV': '.VI',   // Vienna Stock Exchange (Wiener Börse)
  'BB': '.BR',   // Euronext Brussels
  'ID': '.IR',   // Euronext Dublin (Ireland)
  'NZ': '.NZ',   // NZX (New Zealand)
};

const MANUAL_TICKER_MAP = {
  'PE&OLES* MM': null,
  'DRD SJ':      'DRD.JO',
  'BTG':         'BTG',
  'AU':          'AU',
  'AEM':         'AEM',
  'NEM':         'NEM',
  'WPM':         'WPM',
  'GFI SJ':      'GFI',
  'HMY SJ':      'HMY',
  'ANG SJ':      'AU',
  'ANGJ SJ':     'AU',
};

/**
 * Convierte un ticker en formato VanEck al formato Yahoo Finance.
 */
export function normalizeInternationalTicker(rawTicker, etfTicker = '') {
  const t = rawTicker.trim();

  if (MANUAL_TICKER_MAP.hasOwnProperty(t)) {
    const mapped = MANUAL_TICKER_MAP[t];
    if (!mapped) {
      console.warn(`[VanEck] ${etfTicker}: ticker sin equivalente Yahoo: ${t}`);
    }
    return mapped;
  }

  if (/^[A-Z]{1,5}$/.test(t)) return t;

  const spaceMatch = t.match(/^([A-Z0-9&.*]+)\s+([A-Z]{2,3})$/);
  if (spaceMatch) {
    const base   = spaceMatch[1];
    const suffix = spaceMatch[2];
    if (EXCHANGE_SUFFIX_MAP[suffix]) {
      return `${base}${EXCHANGE_SUFFIX_MAP[suffix]}`;
    }
    console.warn(`[VanEck] ${etfTicker}: sufijo de bolsa desconocido "${suffix}" para ticker "${t}"`);
    return t;
  }

  if (/^[A-Z0-9]+\.[A-Z]{1,2}$/.test(t)) return t;

  const hkMatch = t.match(/^(\d{4})\s+HK$/);
  if (hkMatch) return `${hkMatch[1]}.HK`;

  console.warn(`[VanEck] ${etfTicker}: ticker con formato desconocido: ${t}`);
  return t;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Extrae la fecha de la fila de título del XLSX.
 * Ejemplo: "Daily Holdings (%)  11/12/2026"
 */
function extractDateFromTitle(titleStr, ticker) {
  if (!titleStr) return new Date().toISOString().split('T')[0];

  // Formato MM/DD/YYYY
  const m1 = titleStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m1) {
    try {
      const d = new Date(`${m1[3]}-${m1[1].padStart(2,'0')}-${m1[2].padStart(2,'0')}`);
      if (!isNaN(d)) return d.toISOString().split('T')[0];
    } catch {}
  }

  // Formato "Month DD, YYYY"
  const m2 = titleStr.match(/(\w+\s+\d{1,2},\s*\d{4})/i);
  if (m2) {
    try {
      const d = new Date(m2[1]);
      if (!isNaN(d)) return d.toISOString().split('T')[0];
    } catch {}
  }

  console.warn(`[VanEck] ${ticker}: no se encontró fecha en título "${titleStr}"`);
  return new Date().toISOString().split('T')[0];
}

/**
 * Descarga un buffer binario desde una URL HTTPS con timeout de 8s.
 * Sigue redirecciones automáticamente (máx 3).
 */
async function downloadBuffer(url, ticker, redirectCount = 0) {
  if (redirectCount > 3) {
    throw new Error(`VanEck ${ticker}: demasiadas redirecciones (${url})`);
  }

  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection':      'keep-alive',
        'Cache-Control':   'no-cache',
        'Referer':         `https://www.vaneck.com/us/en/investments/`,
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      // Seguir redirecciones
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307) {
        const loc = res.headers.location;
        if (!loc) {
          reject(new Error(`VanEck ${ticker}: redirección sin Location header`));
          return;
        }
        const absUrl = loc.startsWith('http') ? loc : `https://${reqUrl.hostname}${loc}`;
        downloadBuffer(absUrl, ticker, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`VanEck ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (!buffer || buffer.length < 100) {
          reject(new Error(`VanEck ${ticker}: respuesta vacía (${buffer.length} bytes)`));
          return;
        }
        resolve(buffer);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`VanEck ${ticker}: timeout descargando XLSX (8s)`));
    });
    req.end();
  });
}
