// server/etf-holdings/sources/globalx.js
// Adapter para Global X ETFs (Mirae Asset)
//
// ETFs soportados (Fase 2 — 63 subsectores):
//   BOTZ  — Robotics & Artificial Intelligence ETF
//   FINX  — FinTech ETF
//   LIT   — Lithium & Battery Tech ETF
//   SOCL  — Social Media ETF
//   URA   — Uranium ETF
//   DTCR  — Data Center REITs & Digital Infrastructure ETF (antes: DTCR)
//
// Fuente: JSON API interna de globalxetfs.com
//   GET https://www.globalxetfs.com/api/fund-data/?tickers={TICKER}&fields=holdings
//   Respuesta: JSON con array de holdings {symbol, name, weight, ...}
//
// FALLBACK: SEC EDGAR NPORT (si la API está bloqueada)
//   La SEC publica NPORT-P trimestralmente para todos los fondos registrados en EE.UU.
//   EDGAR full-text search: https://efts.sec.gov/LATEST/search-index?q={TICKER}&dateRange=custom&startdt={DATE}&forms=NPORT-P
//
// NOTA sobre DTCR:
//   Global X Data Center & Digital Infrastructure ETF — ticker DTCR.
//   Renombrado de VPN en 2024. Sigue siendo Global X.
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

const GLOBALX_TICKERS = new Set([
  'BOTZ', 'FINX', 'LIT', 'SOCL', 'URA', 'DTCR',
]);

// Mapa de ticker → slug del fondo (para User-Agent y diagnóstico)
const GLOBALX_FUND_NAMES = {
  BOTZ: 'robotics-artificial-intelligence-etf',
  FINX: 'fintech-etf',
  LIT:  'lithium-battery-tech-etf',
  SOCL: 'social-media-etf',
  URA:  'uranium-etf',
  DTCR: 'data-center-reits-digital-infrastructure-etf',
};

/** Verifica si este adapter soporta el ticker dado */
export function supports(ticker) {
  return GLOBALX_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde Global X.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "BOTZ")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();

  // ── Intentar API JSON de Global X ────────────────────────────────
  try {
    const result = await fetchFromGlobalXApi(ticker);
    if (result && result.holdings.length > 0) {
      return result;
    }
  } catch (apiErr) {
    console.warn(`[GlobalX] ${ticker}: API JSON fallida (${apiErr.message}), intentando página HTML`);
  }

  // ── Fallback: scraping de página del fondo ────────────────────────
  try {
    const result = await fetchFromHtmlPage(ticker);
    if (result && result.holdings.length > 0) {
      return result;
    }
  } catch (htmlErr) {
    console.warn(`[GlobalX] ${ticker}: scraping HTML fallido (${htmlErr.message}), intentando SEC EDGAR`);
  }

  // ── Fallback final: SEC EDGAR NPORT-P ────────────────────────────
  return fetchFromEdgar(ticker);
}

// ── API JSON interna de globalxetfs.com ──────────────────────────────

async function fetchFromGlobalXApi(ticker) {
  // Dos formatos de endpoint conocidos para Global X
  const endpoints = [
    `https://www.globalxetfs.com/api/fund-data/?tickers=${ticker}&fields=holdings`,
    `https://www.globalxetfs.com/wp-json/gx/v1/holdings/${ticker}`,
  ];

  for (const url of endpoints) {
    try {
      const { statusCode, body } = await httpGet(url, {
        'Accept': 'application/json',
        'Referer': `https://www.globalxetfs.com/funds/${ticker.toLowerCase()}/`,
      });

      if (statusCode !== 200) continue;

      const data = JSON.parse(body);

      // Formato 1: { holdings: [{symbol, name, weight_pct, ...}] }
      const rawHoldings = data.holdings || data[ticker]?.holdings || data?.data?.holdings;
      if (!rawHoldings || !Array.isArray(rawHoldings)) continue;

      const holdings = rawHoldings
        .filter(h => h.symbol && h.symbol !== 'CASH' && !isCash(h.symbol, h.name || ''))
        .map(h => ({
          ticker: (h.symbol || h.ticker || '').toUpperCase(),
          name:   h.name || h.company_name || h.security_name || h.symbol,
          weight: parseFloat((h.weight_pct || h.weight || h.percent_weight || 0).toString().replace('%', '')),
          shares: h.shares_held || h.shares || null,
        }))
        .filter(h => h.ticker && h.weight > 0);

      if (holdings.length === 0) continue;

      const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);
      const dateField   = data.as_of_date || data.date || data.asOfDate;

      return {
        source:        'Global X ETFs',
        sourceUrl:     url,
        referenceDate: parseDate(dateField),
        totalHoldings: holdings.length,
        cashRows:      0,
        totalWeight:   parseFloat(totalWeight.toFixed(4)),
        holdings,
      };
    } catch (_) {
      // continuar con el siguiente endpoint
    }
  }

  throw new Error(`Global X API: ningún endpoint devolvió datos para ${ticker}`);
}

// ── Scraping de página HTML de globalxetfs.com ───────────────────────

async function fetchFromHtmlPage(ticker) {
  const url = `https://www.globalxetfs.com/funds/${ticker.toLowerCase()}/`;

  const { statusCode, body } = await httpGet(url, {
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
    'Referer': 'https://www.globalxetfs.com/explore/',
  });

  if (statusCode !== 200) {
    throw new Error(`Global X HTML: HTTP ${statusCode} para ${url}`);
  }

  // La página inyecta los holdings en un bloque JSON (window.__INITIAL_STATE__ o similar)
  // Patrón 1: JSON en script tag
  const jsonPatterns = [
    /"holdings"\s*:\s*(\[[\s\S]+?\])\s*[,}]/,
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]+?});/,
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]+?)<\/script>/,
  ];

  for (const pattern of jsonPatterns) {
    const m = body.match(pattern);
    if (!m) continue;

    try {
      const rawData = JSON.parse(m[1]);
      const holdingsArray = Array.isArray(rawData) ? rawData
        : rawData?.holdings || rawData?.props?.pageProps?.holdings;

      if (!holdingsArray || !Array.isArray(holdingsArray)) continue;

      const holdings = holdingsArray
        .filter(h => !isCash(h.symbol || h.ticker || '', h.name || ''))
        .map(h => ({
          ticker: (h.symbol || h.ticker || '').toUpperCase(),
          name:   h.name || h.company_name || h.symbol,
          weight: parseFloat((h.weight_pct || h.weight || 0).toString().replace('%', '')),
          shares: h.shares_held || null,
        }))
        .filter(h => h.ticker && h.weight > 0);

      if (holdings.length === 0) continue;

      const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

      return {
        source:        'Global X ETFs (HTML)',
        sourceUrl:     url,
        referenceDate: new Date().toISOString().split('T')[0],
        totalHoldings: holdings.length,
        cashRows:      0,
        totalWeight:   parseFloat(totalWeight.toFixed(4)),
        holdings,
      };
    } catch (_) {
      // continuar
    }
  }

  throw new Error(`Global X HTML: no se encontró JSON de holdings en la página ${url}`);
}

// ── Fallback SEC EDGAR NPORT-P ────────────────────────────────────────

async function fetchFromEdgar(ticker) {
  // Buscar la última presentación NPORT-P del fondo en EDGAR full-text search
  const searchUrl = `https://efts.sec.gov/LATEST/search-index?q=%22${ticker}%22&forms=NPORT-P&dateRange=custom&startdt=${getDateMonthsAgo(4)}&enddt=${getToday()}`;

  const { statusCode: s1, body: b1 } = await httpGet(searchUrl, {
    'Accept': 'application/json',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research; contact via ethan-inversiones@gmail.com)',
  });

  if (s1 !== 200) {
    throw new Error(`EDGAR search: HTTP ${s1} para ${ticker}`);
  }

  const searchData = JSON.parse(b1);
  const hits = searchData?.hits?.hits;
  if (!hits || hits.length === 0) {
    throw new Error(`EDGAR: no se encontraron presentaciones NPORT-P para ${ticker}`);
  }

  // Tomar la más reciente
  const latestHit = hits[0];
  const accNo = latestHit._source?.period_of_report || latestHit._id;
  const filingUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${ticker}&type=NPORT-P&dateb=&owner=include&count=1&search_text=&output=atom`;

  // Usar el índice de la presentación para obtener el XML
  const nportXmlUrl = latestHit._source?.file_date
    ? `https://www.sec.gov/Archives/edgar/${accNo?.replace(/-/g, '/')}/index.json`
    : null;

  if (!nportXmlUrl) {
    throw new Error(`EDGAR: no se pudo construir URL de NPORT-P para ${ticker}`);
  }

  const { statusCode: s2, body: b2 } = await httpGet(nportXmlUrl, {
    'Accept': 'application/json',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research)',
  });

  if (s2 !== 200) throw new Error(`EDGAR index: HTTP ${s2}`);

  const indexData = JSON.parse(b2);
  const xmlFile = indexData?.directory?.item?.find(f => f.name?.endsWith('.xml') && f.name?.includes('nport'));

  if (!xmlFile) throw new Error(`EDGAR: no se encontró XML de NPORT-P en el índice`);

  const xmlUrl = `https://www.sec.gov/Archives/edgar/${accNo?.replace(/-/g, '/')}/${xmlFile.name}`;
  const { statusCode: s3, body: xmlBody } = await httpGet(xmlUrl, {
    'Accept': 'application/xml',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research)',
  });

  if (s3 !== 200) throw new Error(`EDGAR XML: HTTP ${s3}`);

  return parseNportXml(xmlBody, ticker, xmlUrl);
}

/** Parsea el XML de NPORT-P de la SEC */
function parseNportXml(xml, ticker, sourceUrl) {
  const holdings = [];

  // Extraer fecha de referencia
  const dateMatch = xml.match(/<repPdDate>([\d-]+)<\/repPdDate>/);
  const referenceDate = dateMatch ? dateMatch[1] : getToday();

  // Extraer invSecs (investment securities)
  const invSecPattern = /<invstOrSec>([\s\S]+?)<\/invstOrSec>/g;
  let m;

  while ((m = invSecPattern.exec(xml)) !== null) {
    const sec = m[1];

    const nameM   = sec.match(/<name>([\s\S]+?)<\/name>/);
    const tickerM = sec.match(/<ticker>([\s\S]+?)<\/ticker>/);
    const pctM    = sec.match(/<pctVal>([\s\S]+?)<\/pctVal>/);
    const sharesM = sec.match(/<units>([\s\S]+?)<\/units>/);

    const secTicker = tickerM?.[1]?.trim() || '';
    const secName   = nameM?.[1]?.trim() || secTicker;
    const weight    = parseFloat(pctM?.[1] || '0');
    const shares    = parseFloat(sharesM?.[1] || '0') || null;

    if (!secTicker || isCash(secTicker, secName) || weight <= 0) continue;

    holdings.push({
      ticker: secTicker.toUpperCase(),
      name:   secName,
      weight: parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`EDGAR NPORT: 0 holdings parseados del XML para ${ticker}`);
  }

  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    source:        'SEC EDGAR NPORT-P (Global X fallback)',
    sourceUrl,
    referenceDate,
    totalHoldings: holdings.length,
    cashRows:      0,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
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
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getDateMonthsAgo(months) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().split('T')[0];
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
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks).toString('utf-8'), headers: res.headers }));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`timeout ${timeout}ms — ${url}`)); });
    req.end();
  });
}
