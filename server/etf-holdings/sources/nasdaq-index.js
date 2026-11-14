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
import zlib from 'zlib';
import { promisify } from 'util';

const inflateRaw = promisify(zlib.inflateRaw);
const inflate    = promisify(zlib.inflate);
const gunzip     = promisify(zlib.gunzip);

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
 * Extrae texto de un PDF binario sin dependencias externas.
 * Estrategia:
 *  1. Buscar streams FlateDecode comprimidos con zlib → descomprimir → extraer operadores PDF texto
 *  2. Buscar strings de texto en objetos no comprimidos (BT...ET, Tj, TJ operators)
 *  3. Reconstruir el texto en orden de aparición
 *
 * Los PDFs de Nasdaq son generados por acrobat con estructura simple,
 * sin cifrado, con texto en streams FlateDecode estándar.
 */
async function extractPdfText(pdfBuffer, ticker) {
  const pdf = pdfBuffer;
  let allText = '';

  // ── Estrategia 1: extraer y descomprimir streams FlateDecode ──────────
  // Patrón: << ... /Filter /FlateDecode ... >> stream\r\n<bytes>\r\nendstream
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const filterRegex  = /\/Filter\s*\/FlateDecode/;

  // Encontrar objetos con FlateDecode: buscar la secuencia completa
  const objRegex = /(\d+\s+\d+\s+obj[\s\S]*?endobj)/g;
  let objMatch;
  while ((objMatch = objRegex.exec(pdf.toString('latin1'))) !== null) {
    const objText = objMatch[1];
    if (!filterRegex.test(objText)) continue;

    // Localizar el stream dentro del objeto
    const streamStart = objText.indexOf('stream');
    if (streamStart === -1) continue;

    // Encontrar inicio del contenido (después de \n)
    const contentStart = objText.indexOf('\n', streamStart) + 1;
    const contentEnd   = objText.lastIndexOf('endstream');
    if (contentStart <= 0 || contentEnd <= contentStart) continue;

    // Obtener los bytes reales del buffer (latin1 → offset correcto)
    const objOffset   = objMatch.index;
    const rawStart    = objOffset + contentStart;
    const rawEnd      = objOffset + contentEnd;
    const streamBytes = pdf.slice(rawStart, rawEnd);

    // Intentar descomprimir con inflate/inflateRaw
    let decompressed = null;
    for (const decomp of [inflate, inflateRaw, gunzip]) {
      try {
        decompressed = await decomp(streamBytes);
        break;
      } catch (_) { /* intentar siguiente */ }
    }

    if (!decompressed) continue;

    // Extraer texto del stream PDF descomprimido
    const streamText = decompressed.toString('latin1');
    const extracted  = extractTextFromPdfStream(streamText);
    if (extracted) allText += extracted + '\n';
  }

  // ── Estrategia 2: texto en literales sin comprimir (objetos simples) ──
  // Buscar cadenas entre paréntesis en contexto de texto PDF: ( ... ) Tj
  // y arrays de texto: [( ... ) ... ] TJ
  if (allText.length < 200) {
    const pdfStr = pdf.toString('latin1');
    const litRegex = /\(([^)]{1,200})\)\s*(?:Tj|'|")/g;
    let m;
    while ((m = litRegex.exec(pdfStr)) !== null) {
      const decoded = m[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\');
      allText += decoded + ' ';
    }
  }

  console.log(`[NasdaqIndex] ${ticker}: PDF → ${allText.length} chars extraídos`);
  return allText;
}

/**
 * Extrae el texto visible de un stream PDF descomprimido.
 * El stream contiene instrucciones como: BT ... (texto) Tj ... ET
 */
function extractTextFromPdfStream(stream) {
  let result = '';
  let inText = false;

  // BT / ET delimitan bloques de texto
  const parts = stream.split(/\b(BT|ET)\b/);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === 'BT') { inText = true; continue; }
    if (part === 'ET') { inText = false; continue; }
    if (!inText) continue;

    // Dentro de BT...ET: extraer strings de texto
    // Formato 1: (texto) Tj
    // Formato 2: (texto) ' o "
    // Formato 3: [(texto) n (texto) n ...] TJ
    const tjRegex = /\(([^)]*)\)\s*(?:Tj|'|")/g;
    let m;
    while ((m = tjRegex.exec(part)) !== null) {
      const decoded = m[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, ' ')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\');
      result += decoded + ' ';
    }

    // Formato TJ: [(t1) n1 (t2) n2 ...] TJ
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
    while ((m = tjArrayRegex.exec(part)) !== null) {
      const inner = m[1];
      const strRegex = /\(([^)]*)\)/g;
      let sm;
      while ((sm = strRegex.exec(inner)) !== null) {
        const decoded = sm[1]
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\');
        result += decoded;
      }
      result += ' ';
    }
  }

  return result;
}

/**
 * Descarga el documento desde nasdaq.com/docs/
 * Detecta automáticamente si es PDF o HTML/texto y extrae el texto.
 * Funciona desde IPs de datacenter (sin bloqueo IP).
 *
 * @returns {Promise<string>} — texto limpio extraído del documento
 */
async function fetchTextPage(url, ticker) {
  const rawBuffer = await fetchRawBuffer(url, ticker);

  // Detectar si es PDF por magic bytes (%PDF)
  const magic = rawBuffer.slice(0, 4).toString('ascii');
  if (magic === '%PDF') {
    console.log(`[NasdaqIndex] ${ticker}: respuesta es PDF (${rawBuffer.length} bytes), extrayendo texto`);
    try {
      const text = await extractPdfText(rawBuffer, ticker);
      if (!text || text.trim().length < 100) {
        throw new Error(`NasdaqIndex ${ticker}: PDF extraído vacío o demasiado corto (${text?.length || 0} chars)`);
      }
      return text;
    } catch (pdfErr) {
      throw new Error(`NasdaqIndex ${ticker}: error parsing PDF — ${pdfErr.message}`);
    }
  }

  // HTML o texto plano
  const text = rawBuffer.toString('utf-8');
  const cleaned = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+|\s+$/gm, '')
    ;
  if (!cleaned || cleaned.trim().length < 100) {
    throw new Error(`NasdaqIndex ${ticker}: respuesta vacía o demasiado corta desde ${url}`);
  }
  console.log(`[NasdaqIndex] ${ticker}: ${cleaned.length} chars (HTML/texto) recibidos de ${url}`);
  return cleaned;
}

/**
 * Descarga los bytes raw desde una URL con headers de browser.
 * Sigue redirecciones (máx 3 saltos).
 */
function fetchRawBuffer(url, ticker, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 3) {
      reject(new Error(`NasdaqIndex ${ticker}: demasiadas redirecciones desde ${url}`));
      return;
    }

    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'application/pdf,text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Connection':      'keep-alive',
      },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        const location = res.headers.location;
        if (!location) {
          reject(new Error(`NasdaqIndex: redirect sin Location desde ${url}`));
          return;
        }
        const absUrl = location.startsWith('http') ? location : `https://www.nasdaq.com${location}`;
        fetchRawBuffer(absUrl, ticker, redirects + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        // Leer body para diagnóstico
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const preview = Buffer.concat(chunks).slice(0, 200).toString('utf-8').replace(/[\x00-\x1F]/g, '?');
          reject(new Error(`NasdaqIndex ${ticker}: HTTP ${res.statusCode} desde ${url}. Body preview: ${preview}`));
        });
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
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
