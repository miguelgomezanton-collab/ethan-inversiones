// server/etf-holdings/sources/vaneck.js
// Adapter para VanEck
//
// ETFs soportados: SMH, GDX, SIL, XME, REMX, GDXJ
//
// Fuente: vaneck.com/offshore/en/ — versión que sirve HTML estático con tabla de holdings.
// La URL /us/en/ usa React SSR y no incluye la tabla en el HTML crudo del servidor.
// La URL /offshore/en/ sí incluye la tabla completa en el HTML inicial.
//
//   SMH:  https://www.vaneck.com/offshore/en/investments/semiconductor-etf-smh/holdings/
//   GDX:  https://www.vaneck.com/offshore/en/investments/gold-miners-etf-gdx/holdings/
//   SIL:  https://www.vaneck.com/offshore/en/investments/silver-miners-etf-sil/holdings/
//   REMX: https://www.vaneck.com/offshore/en/investments/mvis-us-listed-rare-earth-critical-minerals-etf-remx/holdings/
//   XME:  https://www.vaneck.com/offshore/en/investments/mvis-us-listed-rare-earth-critical-minerals-etf-remx/holdings/
//   GDXJ: https://www.vaneck.com/offshore/en/investments/junior-gold-miners-etf-gdxj/holdings/
//
// CONDICIÓN #5: Normalizar tickers internacionales para Yahoo Finance
//               Formato OTC: "NST AU" → "NST.AX", "EDV LN" → "EDV.L"
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

// Map de tickers VanEck → slug de URL en vaneck.com/offshore/en/
const VANECK_URL_MAP = {
  SMH:  'semiconductor-etf-smh',
  GDX:  'gold-miners-etf-gdx',
  SIL:  'silver-miners-etf-sil',
  REMX: 'mvis-us-listed-rare-earth-critical-minerals-etf-remx',
  XME:  'mvis-us-listed-rare-earth-critical-minerals-etf-remx',  // usa misma página que REMX
  GDXJ: 'junior-gold-miners-etf-gdxj',
};

const VANECK_TICKERS = new Set(Object.keys(VANECK_URL_MAP));

/** Verifica si este adapter soporta el ticker */
export function supports(ticker) {
  return VANECK_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde vaneck.com.
 * Incluye normalización de tickers internacionales para Yahoo Finance.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "SMH", "GDX")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker  = etfTicker.toUpperCase();
  const urlSlug = VANECK_URL_MAP[ticker];
  if (!urlSlug) {
    throw new Error(`VanEck: no hay URL configurada para ${ticker}`);
  }

  // /offshore/en/ sirve HTML estático con tabla; /us/en/ requiere JS (React SSR)
  const pageUrl = `https://www.vaneck.com/offshore/en/investments/${urlSlug}/holdings/`;
  const html    = await fetchPage(pageUrl, ticker);

  // ── Extraer fecha de referencia ───────────────────────────────────
  const referenceDate = extractReferenceDate(html, ticker);

  // ── Parsear tabla de holdings ──────────────────────────────────────
  const { holdings: rawHoldings, cashRows } = parseHoldingsTable(html, ticker, pageUrl);

  if (rawHoldings.length === 0) {
    throw new Error(`VanEck ${ticker}: 0 posiciones extraídas de la tabla HTML`);
  }

  // ── Normalizar tickers internacionales (Condición #5) ─────────────
  const holdings = rawHoldings.map(h => ({
    ...h,
    ticker:        normalizeInternationalTicker(h.ticker, ticker),
    originalTicker: h.ticker,          // preservar ticker original para trazabilidad
  }));

  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

  return {
    source:        'VanEck',
    sourceUrl:     pageUrl,
    referenceDate,
    totalHoldings: holdings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

// ── Normalización de tickers internacionales ──────────────────────────
// Condición #5: GDX tiene ~40% de posiciones con sufijos de bolsa
// internacional que no son reconocidos directamente por Yahoo Finance.
// Formato VanEck: "NST AU" (AuSE), "EDV LN" (LSE), "LUG CN" (TSX), etc.
// Yahoo Finance usa: "NST.AX", "EDV.L", "LUG.TO"

const EXCHANGE_SUFFIX_MAP = {
  // VanEck suffix → Yahoo Finance suffix
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

// Tickers mexicanos con sufijo especial (BMV)
// VanEck usa "PE&OLES* MM" → no tiene Yahoo Finance directo en USD
// Map manual para casos conocidos en GDX
const MANUAL_TICKER_MAP = {
  'PE&OLES* MM': null,         // Industrias Peñoles — no tiene ADR/Yahoo accesible
  'DRD SJ':      'DRD.JO',    // DRDGold (alternativa a .JO)
  'BTG':         'BTG',        // B2Gold — ya es ticker US
  'AU':          'AU',         // AngloGold — ya es ticker US (NYSE)
  'AEM':         'AEM',        // Agnico Eagle — ya es ticker US (NYSE)
  'NEM':         'NEM',        // Newmont — ya es ticker US (NYSE)
  'WPM':         'WPM',        // Wheaton Precious — ya es ticker US (NYSE)
  'GFI SJ':      'GFI',        // Gold Fields tiene ADR (NYSE: GFI)
  'HMY SJ':      'HMY',        // Harmony Gold tiene ADR (NYSE: HMY)
  'ANG SJ':      'AU',         // AngloGold Ashanti (NYSE: AU)
  'ANGJ SJ':     'AU',         // AngloGold Ashanti (NYSE: AU)
};

/**
 * Convierte un ticker en formato VanEck al formato Yahoo Finance.
 * Preserva tickers US sin modificar.
 *
 * @param {string} rawTicker  — Ticker como aparece en VanEck (ej. "NST AU")
 * @param {string} etfTicker  — ETF padre (para logging)
 * @returns {string}  — Ticker Yahoo Finance (ej. "NST.AX") o null si no mappeable
 */
export function normalizeInternationalTicker(rawTicker, etfTicker = '') {
  const t = rawTicker.trim();

  // Comprobar mapa manual primero
  if (MANUAL_TICKER_MAP.hasOwnProperty(t)) {
    const mapped = MANUAL_TICKER_MAP[t];
    if (!mapped) {
      console.warn(`[VanEck] ${etfTicker}: ticker sin equivalente Yahoo: ${t}`);
    }
    return mapped; // puede ser null — el screener lo excluirá
  }

  // Tickers US simples (sin espacio, 1-5 chars alfanuméricos)
  if (/^[A-Z]{1,5}$/.test(t)) return t;

  // Formato "BASE SUFFIX" (con espacio)
  const spaceMatch = t.match(/^([A-Z0-9&.*]+)\s+([A-Z]{2,3})$/);
  if (spaceMatch) {
    const base   = spaceMatch[1];
    const suffix = spaceMatch[2];

    // Comprobar mapa de sufijos de bolsa
    if (EXCHANGE_SUFFIX_MAP[suffix]) {
      return `${base}${EXCHANGE_SUFFIX_MAP[suffix]}`;
    }

    // Sufijo desconocido — loguear y devolver como está por si Yahoo lo acepta
    console.warn(`[VanEck] ${etfTicker}: sufijo de bolsa desconocido "${suffix}" para ticker "${t}"`);
    return t;
  }

  // Formato "TICKER.SUFFIX" (ya podría ser Yahoo-compatible)
  if (/^[A-Z0-9]+\.[A-Z]{1,2}$/.test(t)) return t;

  // Formato con número HK: "1234 HK"
  const hkMatch = t.match(/^(\d{4})\s+HK$/);
  if (hkMatch) return `${hkMatch[1]}.HK`;

  // No reconocido
  console.warn(`[VanEck] ${etfTicker}: ticker con formato desconocido: ${t}`);
  return t;
}

// ── Helpers ──────────────────────────────────────────────────────────

function extractReferenceDate(html, ticker) {
  const patterns = [
    /as\s+of\s+(\w+\s+\d{1,2},\s+\d{4})/i,     // "as of November 1, 2024"
    /as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i, // "as of 11/01/2024"
    /Holdings\s+Date[^<]*[>:]\s*([^<\n]{6,20})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const dateStr = m[1].trim();
      // Intentar parsear la fecha
      try {
        const d = new Date(dateStr);
        if (!isNaN(d)) return d.toISOString().split('T')[0];
      } catch {}
    }
  }

  console.warn(`[VanEck] ${ticker}: no se encontró fecha de referencia`);
  return new Date().toISOString().split('T')[0];
}

/**
 * Parsea la tabla de holdings del HTML de VanEck.
 *
 * VanEck usa tablas con clases de React-rendered. Las columnas típicas son:
 * Company Name | Ticker | ISIN | Shares/Contracts | Net Assets %
 *
 * Como fallback: buscar cualquier tabla con columna de peso/porcentaje.
 */
function parseHoldingsTable(html, ticker, pageUrl) {
  const tableMatches = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];

  if (tableMatches.length === 0) {
    throw new Error(
      `VanEck ${ticker}: no se encontró tabla en ${pageUrl}. ` +
      `La página puede requerir JS para renderizar. HTML length: ${html.length}`
    );
  }

  let holdingsTable = null;
  let headerCols    = null;

  for (const match of tableMatches) {
    const tableHtml = match[1];
    const thMatches = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
    const ths = thMatches.map(m => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().toLowerCase());

    // Buscar tabla con columnas de holdings
    const hasWeight = ths.some(h => h.includes('net asset') || h.includes('weight') || h.includes('%'));
    const hasTicker = ths.some(h => h === 'ticker' || h.includes('symbol') || h === 'cusip' || h.includes('sedol'));

    if (hasWeight && (hasTicker || ths.some(h => h.includes('company') || h.includes('name')))) {
      holdingsTable = tableHtml;
      headerCols    = ths;
      break;
    }
  }

  if (!holdingsTable || !headerCols) {
    // Intentar con la tabla más larga (heurística)
    const longestTable = tableMatches.reduce((a, b) => a[1].length > b[1].length ? a : b);
    const thMatches    = [...longestTable[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
    headerCols         = thMatches.map(m => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().toLowerCase());

    if (headerCols.length > 0) {
      holdingsTable = longestTable[1];
      console.warn(`[VanEck] ${ticker}: usando tabla más larga como fallback. Columnas: ${headerCols.join(', ')}`);
    } else {
      throw new Error(
        `VanEck ${ticker}: no se pudo identificar tabla de holdings. ` +
        `Tablas encontradas: ${tableMatches.length}. ` +
        `La página puede ser dinámica (JS-rendered).`
      );
    }
  }

  const colName   = headerCols.findIndex(h => h.includes('company') || h === 'name' || h.includes('security'));
  const colTicker = headerCols.findIndex(h => h === 'ticker' || h === 'symbol');
  const colWeight = headerCols.findIndex(h => h.includes('net asset') || h.includes('weight') || (h.includes('%') && !h.includes('ytd')));
  const colShares = headerCols.findIndex(h => h.includes('shares') || h.includes('contracts'));

  if (colWeight === -1) {
    throw new Error(`VanEck ${ticker}: columna de peso no encontrada. Columnas: ${headerCols.join(', ')}`);
  }

  const rowMatches = [...holdingsTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const holdings   = [];
  let cashRows     = 0;

  for (const rowMatch of rowMatches) {
    const tdMatches = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells     = tdMatches.map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/,/g, '').trim());

    if (cells.length <= colWeight) continue;

    const rawWeight  = cells[colWeight] || '0';
    const weight     = parseFloat(rawWeight.replace('%', '')) || 0;

    // Intentar obtener ticker de la columna dedicada, o del nombre
    let rawTicker = '';
    if (colTicker >= 0 && cells[colTicker]) {
      rawTicker = cells[colTicker].trim();
    }

    const rawName = colName >= 0 ? (cells[colName] || '') : rawTicker;

    if (!rawTicker && !rawName) continue;
    if (weight === 0 && !rawTicker) continue;

    // Detectar cash/collateral
    const nameLC  = rawName.toLowerCase();
    const isCash  = nameLC.includes('cash') ||
                    nameLC.includes('money market') ||
                    nameLC.includes('collateral') ||
                    nameLC.includes('receivable') ||
                    (!rawTicker && weight < 0.001);

    if (isCash) {
      cashRows++;
      continue;
    }

    // Si no hay ticker pero hay nombre, usar nombre como identifier temporal
    const effectiveTicker = rawTicker || rawName.substring(0, 10).toUpperCase().replace(/\s/g, '');

    holdings.push({
      ticker: effectiveTicker,
      name:   rawName || effectiveTicker,
      weight: parseFloat(weight.toFixed(4)),
      shares: colShares >= 0 ? (parseFloat(cells[colShares] || '0') || null) : null,
    });
  }

  return { holdings, cashRows };
}

async function fetchPage(url, ticker) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',  // offshore/en sirve mejor con en-GB
        'Connection':      'keep-alive',
        'Cache-Control':   'no-cache',
      },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const loc = res.headers.location;
        const abs = loc.startsWith('http') ? loc : `https://${reqUrl.hostname}${loc}`;
        fetchPage(abs, ticker).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`VanEck ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf-8');
        if (!html || html.length < 500) {
          reject(new Error(`VanEck ${ticker}: respuesta HTML vacía (${html.length} bytes)`));
          return;
        }
        resolve(html);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`VanEck ${ticker}: timeout descargando página`));
    });
    req.end();
  });
}
