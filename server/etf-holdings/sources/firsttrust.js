// server/etf-holdings/sources/firsttrust.js
// Adapter para First Trust Portfolios
//
// ETFs soportados: CIBR, AIQ, SKYY, JETS, PAVE (y otros de ftportfolios.com)
//
// Fuente: https://www.ftportfolios.com/Retail/Etf/EtfHoldings.aspx?Ticker={TICKER}
// Método: scraping de tabla HTML (no hay descarga CSV directa disponible)
//
// CONDICIÓN #3 de autorización:
//   El backend DEBE verificar que el ETF devuelto corresponde al ticker solicitado.
//   Incidencia conocida: proxy de sesión retornó datos de QTEC en lugar de CIBR.
//   Fix: verificar el título de la página y/o la cabecera "Fund Name" del HTML.
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

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
 * Descarga y parsea los holdings del ETF desde ftportfolios.com.
 * Incluye verificación de identidad: lanza error si los datos corresponden
 * a un ETF diferente al solicitado.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "CIBR")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const url = `https://www.ftportfolios.com/Retail/Etf/EtfHoldings.aspx?Ticker=${ticker}`;

  const html = await fetchPage(url, ticker);

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
    // Buscar la tabla que tiene encabezados de holdings
    const thMatches = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
    const ths = thMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim().toLowerCase());

    if (ths.some(h => h.includes('ticker')) && ths.some(h => h.includes('weight'))) {
      holdingsTable = tableHtml;
      headerCols    = ths;
      break;
    }
  }

  if (!holdingsTable || !headerCols) {
    throw new Error(
      `First Trust ${ticker}: no se encontró tabla con columnas Ticker/Weight. ` +
      `¿Cambió la estructura de la página?`
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
 * Descarga una página HTML desde ftportfolios.com.
 * Usa cookies mínimas para evitar redirecciones a página de selección de región.
 */
async function fetchPage(url, ticker) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',         // evitar gzip para simplificar chunks
        'Connection':      'keep-alive',
        'Referer':         'https://www.ftportfolios.com/',
        'DNT':             '1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control':   'no-cache',
        'Pragma':          'no-cache',
      },
      timeout: 25000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const redirectUrl = res.headers.location;
        const absRedirect = redirectUrl.startsWith('http') ? redirectUrl : `https://${reqUrl.hostname}${redirectUrl}`;
        fetchPage(absRedirect, ticker).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`First Trust ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf-8');
        if (!html || html.length < 500) {
          reject(new Error(`First Trust ${ticker}: respuesta HTML vacía o demasiado corta (${html.length} bytes)`));
          return;
        }
        // Detectar páginas de error o redirección JS (sin tabla de datos)
        if (html.length < 5000 && !html.includes('Holdings')) {
          reject(new Error(
            `First Trust ${ticker}: respuesta demasiado corta y sin tabla de holdings ` +
            `(${html.length} bytes). Posible bloqueo de sesión/cookie. ` +
            `URL: ${url}`
          ));
          return;
        }
        resolve(html);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`First Trust ${ticker}: timeout descargando página HTML (${options.timeout}ms). URL: ${url}`));
    });
    req.end();
  });
}
