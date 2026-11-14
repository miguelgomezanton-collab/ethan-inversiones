// server/etf-holdings/sources/nasdaq-index.js
// Adapter para ETFs que replican índices Nasdaq CTA publicados en nasdaq.com/docs/
//
// Fuente primaria: https://www.nasdaq.com/docs/{INDEX_TICKER}
//   Devuelve texto plano con columnas: Name | Symbol | Weight(%)
//   Accesible desde IPs de datacenter (sin bloqueo de Vercel/AWS).
//
// ETFs soportados:
//   CIBR → NQCYBRE (Nasdaq CTA Cybersecurity Exclusions Index, versión real de CIBR)
//
// IMPORTANTE: CIBR replica NQCYBRE (Exclusions), no NQCYBR (base).
// La diferencia: NQCYBRE excluye ciertas compañías por criterios ESG/exclusión.
// Usamos NQCYBR como fallback si NQCYBRE no está disponible.
//
// Limitación conocida: la URL /docs/NQCYBR puede servir datos con retraso
// de hasta un mes (ej. datos de 05/01/2026 cuando ya es noviembre).
// Para ETHAN esto es aceptable — los holdings cambian poco entre rebalanceos.
// ─────────────────────────────────────────────────────────────────────────────

import https from 'https';

// Mapa ETF ticker → índice Nasdaq que replica
const ETF_TO_INDEX = {
  CIBR: ['NQCYBRE', 'NQCYBR'], // NQCYBRE primero (Exclusions = versión de CIBR), NQCYBR fallback
};

// Tickers internacionales conocidos y su equivalente en mercados ETHAN-analizables
// Nasdaq usa tickers locales (ej. 4704 para Trend Micro en Tokio, HO para Thales en París)
const INTL_TICKER_MAP = {
  '4704': 'TMICF', // Trend Micro — OTC US
  'HO':   'THLEF', // Thales S.A. — OTC US (HO es el ticker de París)
  'ATO':  'ASTOF', // Atos — OTC US
  'OTEX': 'OTEX',  // Open Text — cotiza en Nasdaq (ticker correcto)
  'BB':   'BB',    // BlackBerry — cotiza en NYSE (ticker correcto)
};

/** Verifica si este adapter soporta el ticker dado */
export function supports(ticker) {
  return Object.prototype.hasOwnProperty.call(ETF_TO_INDEX, ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde la API de composición de índices de Nasdaq.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "CIBR")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker     = etfTicker.toUpperCase();
  const indexTickers = ETF_TO_INDEX[ticker];
  if (!indexTickers) throw new Error(`nasdaq-index: ticker no soportado: ${ticker}`);

  let lastError = null;

  // Intentar cada índice en orden (primario, fallback)
  for (const indexTicker of indexTickers) {
    try {
      const result = await fetchFromNasdaqIndex(ticker, indexTicker);
      return result;
    } catch (err) {
      console.warn(`[NasdaqIndex] ${ticker}: índice ${indexTicker} falló — ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error(`nasdaq-index: todos los índices fallaron para ${ticker}`);
}

/**
 * Descarga composición de un índice Nasdaq desde nasdaq.com/docs/{INDEX_TICKER}
 */
async function fetchFromNasdaqIndex(etfTicker, indexTicker) {
  const url = `https://www.nasdaq.com/docs/${indexTicker}`;
  console.log(`[NasdaqIndex] ${etfTicker}: descargando índice ${indexTicker} desde ${url}`);

  const text = await fetchTextPage(url, etfTicker);

  // ── Extraer fecha de referencia ───────────────────────────────────
  const referenceDate = extractDate(text, etfTicker);

  // ── Parsear holdings ──────────────────────────────────────────────
  const { holdings, cashRows } = parseIndexText(text, etfTicker, indexTicker);

  if (holdings.length === 0) {
    throw new Error(`NasdaqIndex ${etfTicker}/${indexTicker}: 0 posiciones extraídas`);
  }

  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

  return {
    source:        `Nasdaq Index (${indexTicker})`,
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
 * Extrae la fecha del texto del documento.
 * Formato típico: "Data as of: MM/DD/YYYY" o "Data as of MM/DD/YYYY"
 */
function extractDate(text, ticker) {
  const patterns = [
    /Data\s+as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const parts = m[1].match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (parts) {
        return `${parts[3]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
      }
    }
  }
  console.warn(`[NasdaqIndex] ${ticker}: no se encontró fecha en el texto`);
  return new Date().toISOString().split('T')[0];
}

/**
 * Parsea el texto del documento de índice Nasdaq.
 *
 * Formato típico:
 *   Name  Symbol  Weight  (%)
 *   A10 NETWORKS, INC.  ATEN  0.55
 *   AKAMAI TECHNOLOGIES  AKAM  5.14
 *   ...
 *
 * También puede estar en formato HTML con tabla.
 * El texto viene como texto plano extraído de PDF/HTML.
 */
function parseIndexText(text, etfTicker, indexTicker) {
  const holdings = [];
  let cashRows = 0;

  // Buscar sección de holdings: desde la línea que tiene "Name Symbol Weight" o similar
  // hasta el final o hasta una línea de pie de página
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Encontrar índice de inicio de datos (después de cabecera)
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if ((lower.includes('name') && lower.includes('symbol') && lower.includes('weight')) ||
        (lower.includes('name') && lower.includes('symbol') && lower.includes('%'))) {
      startIdx = i + 1;
      break;
    }
  }

  // Si no encontramos cabecera explícita, buscar desde la primera línea con ticker + peso
  if (startIdx === -1) {
    for (let i = 0; i < lines.length; i++) {
      // Buscar línea con patrón: texto <espacio> TICKER <espacio> número%
      if (/[A-Z]{2,6}\s+[\d.]+\s*$/.test(lines[i]) || /[A-Z]{2,6}\s+[\d.]+%/.test(lines[i])) {
        startIdx = i;
        break;
      }
    }
  }

  if (startIdx === -1) {
    throw new Error(
      `NasdaqIndex ${etfTicker}/${indexTicker}: no se encontró sección de holdings en el texto. ` +
      `Primeras 10 líneas: ${lines.slice(0, 10).join(' | ')}`
    );
  }

  console.log(`[NasdaqIndex] ${etfTicker}: parsing desde línea ${startIdx}, total líneas: ${lines.length}`);

  // Parsear cada línea de datos
  // Formato esperado: "COMPANY NAME  TICKER  WEIGHT" o "COMPANY NAME TICKER WEIGHT%"
  // El ticker es la penúltima columna, el peso es la última
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    // Parar en líneas de pie de página o notas
    if (line.startsWith('*') || line.startsWith('©') || line.startsWith('All content') ||
        line.startsWith('Unauthorized') || line.toLowerCase().startsWith('source:') ||
        line.toLowerCase().startsWith('note:') || line.toLowerCase().startsWith('total')) {
      break;
    }

    // Intentar parsear: "NAME ... TICKER WEIGHT"
    // La línea termina en "TICKER  WEIGHT" o "TICKER WEIGHT%"
    const weightPattern = /^(.*?)\s+([A-Z0-9]{1,8})\s+([\d.]+)\s*%?\s*$/;
    const m = line.match(weightPattern);
    if (!m) continue;

    const rawName   = m[1].trim();
    const rawTicker = m[2].trim();
    const rawWeight = m[3].trim();

    // Validar que parece un ticker real (1-8 chars alfanuméricos)
    if (!rawTicker || rawTicker.length > 8 || !/^[A-Z0-9]+$/.test(rawTicker)) continue;

    const weight = parseFloat(rawWeight) || 0;
    if (weight <= 0) continue;

    // Detectar cash/collateral
    const isCash = rawName.toLowerCase().includes('cash') ||
                   rawName.toLowerCase().includes('money market') ||
                   rawName.toLowerCase().includes('collateral') ||
                   rawTicker === 'CASH' || rawTicker === 'USD';
    if (isCash) {
      cashRows++;
      continue;
    }

    // Normalizar ticker internacional si tiene mapeado
    const normalizedTicker = INTL_TICKER_MAP[rawTicker] || rawTicker;

    holdings.push({
      ticker: normalizedTicker.toUpperCase(),
      name:   rawName,
      weight: parseFloat(weight.toFixed(4)),
      shares: null,
    });
  }

  return { holdings, cashRows };
}

/**
 * Descarga una página de texto desde nasdaq.com/docs/
 * Funciona desde IPs de datacenter (sin bloqueo).
 */
function fetchTextPage(url, ticker) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Connection':      'keep-alive',
      },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      // Seguir redirecciones
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        if (!location) {
          reject(new Error(`NasdaqIndex: redirect sin Location desde ${url}`));
          return;
        }
        const absUrl = location.startsWith('http') ? location : `https://www.nasdaq.com${location}`;
        fetchTextPage(absUrl, ticker).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`NasdaqIndex ${ticker}: HTTP ${res.statusCode} desde ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf-8');
        // Limpiar HTML si es necesario
        const cleaned = text
          .replace(/<[^>]+>/g, ' ')          // quitar tags HTML
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#\d+;/g, ' ')
          .replace(/\s{2,}/g, ' ')            // espacios múltiples → uno
          .replace(/^\s+|\s+$/gm, '')         // trim por línea
          ;
        if (!cleaned || cleaned.trim().length < 100) {
          reject(new Error(`NasdaqIndex ${ticker}: respuesta vacía o demasiado corta desde ${url}`));
          return;
        }
        console.log(`[NasdaqIndex] ${ticker}: ${cleaned.length} chars recibidos de ${url}`);
        resolve(cleaned);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`NasdaqIndex ${ticker}: timeout 20000ms desde ${url}`));
    });
    req.end();
  });
}
