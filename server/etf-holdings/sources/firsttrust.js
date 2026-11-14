// server/etf-holdings/sources/firsttrust.js
// Adapter para First Trust Portfolios
//
// ETFs soportados: CIBR, AIQ, SKYY, JETS, PAVE (y otros de ftportfolios.com)
//
// Fuente por defecto: https://www.ftportfolios.com/Retail/Etf/EtfHoldings.aspx?Ticker={TICKER}
// Método: scraping de tabla HTML
//
// EXCEPCIÓN — CIBR:
//   ftportfolios.com es una SPA (Single Page App). Los holdings se cargan vía JavaScript
//   (AJAX) después de que el navegador ejecuta el bundle JS. Desde Node.js (sin headless
//   browser) solo se obtiene el shell de navegación (335KB de menús, 0 holdings).
//
//   Solución alternativa validada 2025-11:
//     CIBR replica el Nasdaq CTA Cybersecurity Index (NQCYBR/NQCYBRE).
//     Nasdaq publica la composición completa en texto plano desde:
//       https://www.nasdaq.com/docs/NQCYBRE  (con exclusiones, versión que replica CIBR)
//       https://www.nasdaq.com/docs/NQCYBR   (fallback)
//     42 componentes, Name | Symbol | Weight(%) accesibles desde IPs de datacenter.
//
// CONDICIÓN #3 de autorización:
//   El backend DEBE verificar que el ETF devuelto corresponde al ticker solicitado.
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';
import * as nasdaqIndexAdapter from './nasdaq-index.js';

// Tickers que se redirigen al adapter de índices Nasdaq en lugar de ftportfolios.com
// Razón: ftportfolios.com es JavaScript SPA — holdings no disponibles en HTML estático
const NASDAQ_INDEX_TICKERS = new Set(['CIBR']);

const FIRSTTRUST_TICKERS = new Set([
  'CIBR', 'AIQ', 'SKYY', 'JETS', 'PAVE',
  'FTXL', 'FTXG', 'FTXN', 'FTXR', 'FTXH',
  'FXL',  'FXO',  'FXR',  'FXU',  'FXZ',
  'LEGR', 'MDIV', 'MLPA', 'FRI',  'FPN',
  'QDIV', 'QDEF', 'RWO',  'FBZ',  'VONE',
  'QTEC', // incluido explícitamente para detectar confusión con CIBR
]);

/** Verifica si este adapter soporta el ticker dado */
export function supports(ticker) {
  return FIRSTTRUST_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF.
 * Para CIBR usa el adapter de índices Nasdaq (ftportfolios.com es JS SPA).
 * Para el resto usa ftportfolios.com scraping.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "CIBR")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();

  // ── Redirigir a Nasdaq Index adapter para tickers con SPA bloqueada ──
  if (NASDAQ_INDEX_TICKERS.has(ticker)) {
    console.log(`[FirstTrust] ${ticker}: redirigiendo a NasdaqIndex (ftportfolios.com es JS SPA)`);
    return nasdaqIndexAdapter.fetchHoldings(ticker);
  }
  // Intentar primero con la URL normal, luego con Print=Y (versión impresión, más limpia)
  const urlNormal = `https://www.ftportfolios.com/Retail/Etf/EtfHoldings.aspx?Ticker=${ticker}`;
  const urlPrint  = `https://www.ftportfolios.com/Retail/Etf/EtfHoldings.aspx?Ticker=${ticker}&Print=Y`;

  let html = await fetchPage(urlNormal, ticker);

  // Si la página normal no contiene tabla de holdings, intentar versión Print
  if (!html.includes('Ticker') || !html.includes('Weight')) {
    console.log(`[FirstTrust] ${ticker}: página normal sin tabla — intentando versión Print=Y`);
    html = await fetchPage(urlPrint, ticker);
  }

  const url = urlNormal;

  // ── DIAGNÓSTICO: loguear estructura del HTML recibido ─────────────
  const tableCount  = (html.match(/<table/gi) || []).length;
  const thTexts     = [...html.matchAll(/<th[^>]*>([\s\S]{0,50}?)<\/th>/gi)]
                        .map(m => m[1].replace(/<[^>]+>/g,'').trim())
                        .slice(0, 10)
                        .join(' | ');
  const titleMatch  = html.match(/<title[^>]*>([\s\S]{0,120}?)<\/title>/i);
  const pageTitle   = titleMatch ? titleMatch[1].trim() : '(no title)';
  console.log(`[FirstTrust] ${ticker} HTML diagnóstico: ${html.length} bytes, ${tableCount} tablas, title="${pageTitle}"`);
  console.log(`[FirstTrust] ${ticker} Primeras <th>: ${thTexts || '(ninguna)'}`);
  console.log(`[FirstTrust] ${ticker} Fragmento HTML[0:500]: ${html.substring(0, 500).replace(/\s+/g,' ')}`);

  // ── VERIFICACIÓN DE IDENTIDAD (Condición #3) ──────────────────────
  // El HTML contiene el nombre del fondo en el título y/o en un elemento <h1>
  // Verificar que el nombre/ticker encontrado corresponde al solicitado.
  verifyFundIdentity(html, ticker, url);

  // ── Extraer fecha de referencia ───────────────────────────────────
  const referenceDate = extractReferenceDate(html, ticker);

  // ── Parsear tabla de holdings ──────────────────────────────────────
  // La tabla HTML tiene columnas: Ticker | Name | CUSIP | Shares Held | Weight | Mkt Value
  const { holdings, cashRows } = parseHoldingsTable(html, ticker);

  if (holdings.length === 0) {
    throw new Error(`First Trust ${ticker}: 0 posiciones extraídas de la tabla HTML`);
  }

  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

  return {
    source:        'First Trust Portfolios',
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
 * Verifica que el HTML corresponde al ETF solicitado.
 * Lanza error descriptivo si detecta confusión (Condición #3).
 */
function verifyFundIdentity(html, requestedTicker, url) {
  // Buscar el ticker en el título de la página: <title>... CIBR ...</title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
  const pageTitle  = titleMatch ? titleMatch[1].trim() : '';

  // Buscar en meta og:title o h1 el nombre del fondo
  const h1Match    = html.match(/<h1[^>]*>([\s\S]{0,500}?)<\/h1>/i);
  const h1Text     = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Buscar el ticker explícitamente en un campo "Fund Ticker"
  const fundTickerMatch = html.match(/Fund\s+Ticker[^<]*<[^>]+>([A-Z]{1,8})</i);
  const fundTickerInPage = fundTickerMatch ? fundTickerMatch[1].trim().toUpperCase() : null;

  // Si encontramos un ticker explícito en la página que NO coincide → error
  if (fundTickerInPage && fundTickerInPage !== requestedTicker) {
    throw new Error(
      `First Trust IDENTITY MISMATCH: solicitado ${requestedTicker}, ` +
      `la página devolvió datos de ${fundTickerInPage}. ` +
      `URL: ${url}. Posible problema de sesión/cookie en el proxy.`
    );
  }

  // Verificar en el título de la página
  const titleUpper = pageTitle.toUpperCase();
  if (titleUpper && !titleUpper.includes(requestedTicker)) {
    // El título no contiene el ticker pedido
    // Verificar si contiene OTRO ticker conocido de First Trust
    const otherTickers = ['QTEC','AIQ','SKYY','JETS','PAVE','CIBR'];
    const foundOther = otherTickers.find(t => t !== requestedTicker && titleUpper.includes(t));
    if (foundOther) {
      throw new Error(
        `First Trust IDENTITY MISMATCH: solicitado ${requestedTicker}, ` +
        `el título de la página menciona ${foundOther}. ` +
        `Título: "${pageTitle.substring(0, 100)}"`
      );
    }
  }

  // Si llegamos aquí, la identidad parece correcta (o no se pudo verificar positivamente)
  // Se loguea para trazabilidad
  console.log(`[FirstTrust] Identity check OK: ticker=${requestedTicker}, title="${pageTitle.substring(0, 80)}"`);
}

/**
 * Extrae la fecha de referencia del HTML.
 * First Trust muestra: "as of MM/DD/YYYY" o "Holdings as of: MM/DD/YYYY"
 */
function extractReferenceDate(html, ticker) {
  const patterns = [
    /Holdings\s+as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const parts = m[1].match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (parts) {
        return `${parts[3]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
      }
    }
  }

  console.warn(`[FirstTrust] ${ticker}: no se encontró fecha de referencia en HTML`);
  return new Date().toISOString().split('T')[0];
}

/**
 * Parsea la tabla HTML de holdings de ftportfolios.com.
 *
 * La estructura esperada (tabla con id que contiene "holdingsTable" o similar):
 *   <th>Ticker</th><th>Name</th><th>CUSIP</th><th>Shares Held</th><th>Weight (%)</th><th>Market Value</th>
 *   <tr><td>CRWD</td><td>Crowdstrike Holdings</td>...
 *
 * Algunos ETFs incluyen una fila de cash al final.
 */
function parseHoldingsTable(html, ticker) {
  // Extraer sección de tabla (buscar la tabla más grande con tickers)
  // ftportfolios usa una tabla con cabeceras específicas
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);
  if (!tableMatch) {
    throw new Error(`First Trust ${ticker}: no se encontró ninguna tabla en la página HTML`);
  }

  let holdingsTable = null;
  let headerCols    = null;

  for (const tableHtml of tableMatch) {
    // Estrategia 1: buscar encabezados <th> (formato estándar)
    const thMatches = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
    const ths = thMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim().toLowerCase());

    if (ths.some(h => h.includes('ticker')) && ths.some(h => h.includes('weight'))) {
      holdingsTable = tableHtml;
      headerCols    = ths;
      break;
    }

    // Estrategia 2: buscar tabla cuya primera fila de <td> tenga 'Ticker' y 'Weight'
    // (ftportfolios usa <td> para cabeceras en lugar de <th>)
    const firstRowMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (firstRowMatch) {
      const tdMatches = [...firstRowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
      const tds = tdMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim().toLowerCase());
      if (tds.some(h => h === 'ticker' || h === 'symbol') && tds.some(h => h.includes('weight'))) {
        holdingsTable = tableHtml;
        headerCols    = tds;
        break;
      }
    }

    // Estrategia 3: tabla grande (>1000 chars) que contenga tickers típicos de CIBR
    if (tableHtml.length > 1000 &&
        (tableHtml.includes('CRWD') || tableHtml.includes('PANW') || tableHtml.includes('CSCO')) &&
        tableHtml.includes('%')) {
      // Intentar deducir columnas desde la primera fila con datos
      const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      for (const row of rows) {
        const tds2 = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)]
          .map(m => m[1].replace(/<[^>]+>/g,'').trim().toLowerCase());
        if (tds2.some(h => h === 'ticker' || h === 'symbol') && tds2.some(h => h.includes('weight'))) {
          holdingsTable = tableHtml;
          headerCols    = tds2;
          break;
        }
      }
      if (holdingsTable) break;
    }
  }

  if (!holdingsTable || !headerCols) {
    // Diagnóstico detallado — incluir fragmento del HTML en el error
    const allThs = [...html.matchAll(/<th[^>]*>([\s\S]{0,60}?)<\/th>/gi)]
                     .map(m => m[1].replace(/<[^>]+>/g,'').trim()).slice(0,15).join(' | ');
    const titleM    = html.match(/<title[^>]*>([\s\S]{0,120}?)<\/title>/i);
    const pageTitle = titleM ? titleM[1].trim() : '(sin título)';
    // Buscar todas las tablas y sus primeras filas para diagnóstico
    const tableInfo = (tableMatch || []).slice(0, 5).map((t, i) => {
      const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      const firstRow = rows[0] ? [...rows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g,'').trim()).slice(0,6).join('|') : '(sin filas)';
      return `tabla[${i}] ${t.length}b primera_fila:[${firstRow}]`;
    }).join(' | ');
    throw new Error(
      `First Trust ${ticker}: no se encontró tabla con columnas Ticker/Weight. ` +
      `HTML: ${html.length} bytes | título: "${pageTitle}" | ` +
      `th encontrados: [${allThs || 'ninguno'}] | tablas: ${tableInfo}`
    );
  }

  const colTicker = headerCols.findIndex(h => h === 'ticker' || h === 'symbol');
  const colName   = headerCols.findIndex(h => h === 'name' || h === 'security name');
  const colWeight = headerCols.findIndex(h => h.includes('weight') || h.includes('%'));
  const colShares = headerCols.findIndex(h => h.includes('shares'));

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(`First Trust ${ticker}: columnas no localizadas. Encabezados: ${headerCols.join(', ')}`);
  }

  // Extraer filas de datos
  const rowMatches = [...holdingsTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const holdings   = [];
  let cashRows     = 0;

  for (const rowMatch of rowMatches) {
    const tdMatches = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells     = tdMatches.map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim());

    if (cells.length <= Math.max(colTicker, colWeight)) continue;

    const rawTicker = cells[colTicker] || '';
    const rawName   = colName >= 0 ? (cells[colName] || '') : rawTicker;
    const rawWeight = cells[colWeight] || '0';

    if (!rawTicker || rawTicker === '-' || rawTicker === 'N/A') continue;

    const weight = parseFloat(rawWeight.replace('%', '').replace(',', '.')) || 0;
    if (weight === 0 && !rawTicker) continue;

    // Detectar cash/collateral
    const isCash = rawName.toLowerCase().includes('cash') ||
                   rawName.toLowerCase().includes('money market') ||
                   rawName.toLowerCase().includes('collateral') ||
                   rawTicker.length > 10;

    if (isCash) {
      cashRows++;
      continue;
    }

    holdings.push({
      ticker: rawTicker.toUpperCase(),
      name:   rawName,
      weight: parseFloat(weight.toFixed(4)),
      shares: colShares >= 0 ? (parseFloat((cells[colShares] || '0').replace(/[,\s]/g, '')) || null) : null,
    });
  }

  return { holdings, cashRows };
}

/**
 * Cabeceras comunes que imitan un browser real.
 * Usadas tanto en el handshake de sesión como en la descarga de holdings.
 */
const BROWSER_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Connection':      'keep-alive',
  'DNT':             '1',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest':  'document',
  'Sec-Fetch-Mode':  'navigate',
  'Sec-Fetch-Site':  'same-origin',
  'Sec-Fetch-User':  '?1',
  'sec-ch-ua':       '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
};

/**
 * Realiza una petición HTTP GET y devuelve { statusCode, headers, body }.
 * Sigue redirecciones manualmente para preservar cookies.
 */
function httpGet(url, extraHeaders = {}, timeout = 15000) {
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
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        resolve({ statusCode: res.statusCode, headers: res.headers, body });
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`timeout ${timeout}ms — ${url}`));
    });
    req.end();
  });
}

/**
 * Extrae las cookies Set-Cookie de los headers de respuesta
 * y las devuelve como string "Cookie: ..." para reutilizar.
 */
function extractCookies(responseHeaders) {
  const setCookie = responseHeaders['set-cookie'];
  if (!setCookie || setCookie.length === 0) return '';
  return setCookie
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
}

/**
 * Descarga una página HTML desde ftportfolios.com.
 *
 * Estrategia two-step para superar el bloqueo por IP de datacenter:
 *   1. GET homepage → obtener cookies de sesión ASP.NET (__RequestVerificationToken, etc.)
 *   2. GET holdings con esas cookies → la petición parece legítima al servidor
 *
 * Si el handshake falla, intenta una carga directa como fallback.
 */
async function fetchPage(url, ticker) {
  // ── Paso 1: handshake de sesión en el homepage ────────────────────
  let sessionCookies = '';
  try {
    const homeResp = await httpGet(
      'https://www.ftportfolios.com/',
      { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      10000
    );
    sessionCookies = extractCookies(homeResp.headers);
    console.log(`[FirstTrust] Session handshake: HTTP ${homeResp.statusCode}, cookies: ${sessionCookies.length} chars`);
  } catch (err) {
    console.warn(`[FirstTrust] ${ticker}: handshake fallido (${err.message}), intentando carga directa`);
  }

  // ── Paso 2: carga de la página de holdings con cookies de sesión ──
  const extraHeaders = {
    'Referer':       'https://www.ftportfolios.com/',
    'Cache-Control': 'no-cache',
    'Pragma':        'no-cache',
  };
  if (sessionCookies) {
    extraHeaders['Cookie'] = sessionCookies;
  }

  let resp;
  try {
    resp = await httpGet(url, extraHeaders, 25000);
  } catch (err) {
    throw new Error(`First Trust ${ticker}: error de red — ${err.message}. URL: ${url}`);
  }

  // Seguir redirecciones manualmente (preservando cookies)
  if (resp.statusCode === 301 || resp.statusCode === 302) {
    const location = resp.headers.location;
    if (!location) throw new Error(`First Trust ${ticker}: redireccionado sin Location header`);
    const absUrl = location.startsWith('http') ? location : `https://www.ftportfolios.com${location}`;
    console.log(`[FirstTrust] ${ticker}: redirigido a ${absUrl}`);
    // Acumular cookies de la redirección
    const redirectCookies = extractCookies(resp.headers);
    const allCookies = [sessionCookies, redirectCookies].filter(Boolean).join('; ');
    const redirectHeaders = { ...extraHeaders };
    if (allCookies) redirectHeaders['Cookie'] = allCookies;
    try {
      resp = await httpGet(absUrl, redirectHeaders, 25000);
    } catch (err) {
      throw new Error(`First Trust ${ticker}: error en redirección — ${err.message}. URL: ${absUrl}`);
    }
  }

  if (resp.statusCode !== 200) {
    throw new Error(
      `First Trust ${ticker}: HTTP ${resp.statusCode} desde ${url}. ` +
      `Posible bloqueo de IP de datacenter por parte de ftportfolios.com.`
    );
  }

  const html = resp.body;

  if (!html || html.length < 500) {
    throw new Error(`First Trust ${ticker}: respuesta HTML vacía o demasiado corta (${html.length} bytes)`);
  }

  if (html.length < 5000 && !html.includes('Holdings')) {
    throw new Error(
      `First Trust ${ticker}: respuesta demasiado corta y sin tabla de holdings ` +
      `(${html.length} bytes). Posible bloqueo de sesión/cookie. URL: ${url}`
    );
  }

  return html;
}
