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
 * DIAGNÓSTICO TEMPORAL: Retorna texto extraído del PDF sin parsear holdings.
 * Usado para depurar el parser cuando falla.
 * DELETE antes de ir a producción.
 */
export async function debugPdfText(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const indexTickers = ETF_TO_INDEX[ticker];
  if (!indexTickers) throw new Error(`ticker no soportado: ${ticker}`);

  const indexTicker = indexTickers[0];
  const url = `https://www.nasdaq.com/docs/${indexTicker}`;
  const rawBuffer = await fetchRawBuffer(url, ticker);

  const magic = rawBuffer.slice(0, 8).toString('ascii');
  const isPdf = magic.startsWith('%PDF');

  if (!isPdf) {
    const text = rawBuffer.toString('utf-8');
    return { isPdf: false, magic, size: rawBuffer.length, textSample: text.slice(0, 2000) };
  }

  // Buscar streams y extraer samples
  const STREAM_MARKER    = Buffer.from('stream');
  const ENDSTREAM_MARKER = Buffer.from('endstream');
  const FLATEDECODE      = Buffer.from('FlateDecode');

  const streamSamples = [];
  let searchPos = 0;
  while (searchPos < rawBuffer.length && streamSamples.length < 3) {
    const streamIdx = rawBuffer.indexOf(STREAM_MARKER, searchPos);
    if (streamIdx === -1) break;

    const lookback = rawBuffer.slice(Math.max(0, streamIdx - 500), streamIdx);
    const hasFlateDecode = lookback.indexOf(FLATEDECODE) !== -1;

    let dataStart = streamIdx + 6;
    if (rawBuffer[dataStart] === 0x0D) dataStart++;
    if (rawBuffer[dataStart] === 0x0A) dataStart++;
    else { searchPos = dataStart; continue; }

    const endIdx = rawBuffer.indexOf(ENDSTREAM_MARKER, dataStart);
    if (endIdx === -1) { searchPos = dataStart; continue; }

    const streamBytes = rawBuffer.slice(dataStart, endIdx);

    let decompressed = null;
    let method = '';
    const syncFns = [['inflate', zlib.inflateSync], ['inflateRaw', zlib.inflateRawSync], ['gunzip', zlib.gunzipSync]];
    for (const [name, fn] of syncFns) {
      try { decompressed = fn(streamBytes); method = name; break; } catch (_) {}
    }

    if (decompressed) {
      const text = decompressed.toString('latin1');
      // Extraer primeras hex strings
      const hexMatches = [...text.matchAll(/<([0-9A-Fa-f]{4,})>\s*(?:Tj|'|"|\[)/g)].slice(0, 5);
      const hexSamples = hexMatches.map(m => m[1].slice(0, 40));
      streamSamples.push({
        idx: streamSamples.length,
        hasFlateDecode,
        method,
        compressedSize: streamBytes.length,
        decompressedSize: decompressed.length,
        textSample: text.slice(0, 300),
        hexSamples,
      });
    }

    searchPos = endIdx + 9;
  }

  // También texto completo extraído
  const fullText = await extractPdfText(rawBuffer, ticker);

  return {
    isPdf: true,
    magic,
    size: rawBuffer.length,
    streamSamples,
    extractedTextLength: fullText.length,
    extractedTextSample: fullText.slice(0, 1000),
  };
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
  // ── Estrategia 1: texto de PDF comprimido con espacios múltiples (una línea) ──
  // El extractor PDF une todo el texto de una página con espacios.
  // Formato observado: "... Name     Symbol     COMPANY NAME   TICKER   WEIGHT   COMPANY2 ..."
  // Ejemplo real: "A10 NETWORKS, INC.   ATEN   0.33   ACCENTURE PLC   ACN   1.87..."
  const headerMatch = text.match(/Name\s+Symbol\s+/i);
  if (headerMatch) {
    const afterHeader = text.slice(headerMatch.index + headerMatch[0].length);
    const result1 = parseHoldingsFromInlineText(afterHeader, etfTicker);
    if (result1.holdings.length > 5) {
      console.log(`[NasdaqIndex] ${etfTicker}: Estrategia 1 (PDF inline) → ${result1.holdings.length} holdings`);
      return result1;
    }
  }

  // ── Estrategia 2: texto multilínea (cada holding en su propia línea) ──
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if ((lower.includes('name') && lower.includes('symbol') && lower.includes('weight')) ||
        (lower.includes('name') && lower.includes('symbol') && lower.includes('%'))) {
      startIdx = i + 1;
      break;
    }
  }
  if (startIdx === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (/[A-Z]{2,6}\s+[\d.]+\s*$/.test(lines[i]) || /[A-Z]{2,6}\s+[\d.]+%/.test(lines[i])) {
        startIdx = i;
        break;
      }
    }
  }
  if (startIdx === -1) {
    throw new Error(
      `NasdaqIndex ${etfTicker}/${indexTicker}: no se encontró sección de holdings en el texto. ` +
      `Primeras 500 chars: ${text.slice(0, 500)}`
    );
  }

  console.log(`[NasdaqIndex] ${etfTicker}: Estrategia 2 (multilínea) desde línea ${startIdx}`);
  const holdings = [];
  let cashRows = 0;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('*') || line.startsWith('©') || line.startsWith('All content') ||
        line.startsWith('Unauthorized') || line.toLowerCase().startsWith('source:') ||
        line.toLowerCase().startsWith('note:') || line.toLowerCase().startsWith('total')) {
      break;
    }
    const m = line.match(/^(.*?)\s+([A-Z0-9]{1,8})\s+([\d.]+)\s*%?\s*$/);
    if (!m) continue;
    const rawName = m[1].trim(), rawTicker = m[2].trim(), weight = parseFloat(m[3]) || 0;
    if (!rawTicker || !/^[A-Z0-9]+$/.test(rawTicker) || weight <= 0) continue;
    const isCash = /cash|money market|collateral/i.test(rawName) || rawTicker === 'CASH' || rawTicker === 'USD';
    if (isCash) { cashRows++; continue; }
    holdings.push({ ticker: (INTL_TICKER_MAP[rawTicker] || rawTicker).toUpperCase(), name: rawName, weight: parseFloat(weight.toFixed(4)), shares: null });
  }
  return { holdings, cashRows };
}

/**
 * Parsea holdings desde texto en una sola línea con espacios múltiples como separadores.
 * Formato: "COMPANY NAME   TICKER   WEIGHT   COMPANY2   TICK2   WEIGHT2 ..."
 * Los separadores son 2+ espacios entre columnas.
 */
function parseHoldingsFromInlineText(text, etfTicker) {
  const holdings = [];
  let cashRows = 0;

  // Dividir por 2+ espacios: cada "token" es un campo
  // Luego agrupar en triplas: [name, ticker, weight]
  const tokens = text.split(/\s{2,}/).map(t => t.trim()).filter(t => t.length > 0);

  // Recorrer los tokens buscando patrón: ...NAME  TICKER  WEIGHT...
  // TICKER: 1-8 chars alfanuméricos mayúsculas
  // WEIGHT: número decimal (ej. 0.33, 1.87, 15.2)
  // NAME: todo lo anterior al TICKER en el grupo actual
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];

    // ¿Es este token un TICKER? (1-8 chars A-Z0-9, sin puntuación)
    if (/^[A-Z][A-Z0-9]{0,7}$/.test(tok)) {
      const nextTok = tokens[i + 1];
      // ¿El siguiente token es un WEIGHT? (número decimal)
      if (nextTok && /^[\d]+\.[\d]+$/.test(nextTok)) {
        const rawTicker = tok;
        const weight    = parseFloat(nextTok);

        // El nombre está en el token ANTERIOR a este TICKER
        const prevTok = tokens[i - 1] || '';
        const rawName = prevTok;

        // Validaciones básicas
        if (weight > 0 && weight <= 25 &&
            !['NAME', 'SYMBOL', 'WEIGHT', 'INDEX', 'DATA', 'NOTES', 'TOTAL'].includes(rawTicker)) {

          const isCash = /cash|money market|collateral/i.test(rawName) ||
                         rawTicker === 'CASH' || rawTicker === 'USD';
          if (isCash) {
            cashRows++;
          } else {
            holdings.push({
              ticker: (INTL_TICKER_MAP[rawTicker] || rawTicker).toUpperCase(),
              name:   rawName,
              weight: parseFloat(weight.toFixed(4)),
              shares: null,
            });
          }
        }
        i += 2; // saltar TICKER y WEIGHT
        continue;
      }
    }
    i++;
  }

  return { holdings, cashRows };
}

/**
 * Extrae texto de un PDF binario sin dependencias externas.
 *
 * Estrategia robusta:
 *  1. Encontrar objetos PDF que declaran /Filter /FlateDecode buscando
 *     las posiciones de bytes exactas de "stream\n" y "endstream" en el Buffer
 *  2. Descomprimir los streams con zlib
 *  3. Extraer texto de los streams descomprimidos (operadores BT/ET, Tj, TJ)
 *
 * Trabaja con offsets de bytes del Buffer directamente para evitar
 * problemas de codificación al convertir a string.
 */
async function extractPdfText(pdfBuffer, ticker) {
  let allText = '';
  let streamsFound = 0;
  let streamsDecompressed = 0;

  // Buscar todas las posiciones de "stream\n" o "stream\r\n" en el buffer
  const STREAM_MARKER    = Buffer.from('stream');
  const ENDSTREAM_MARKER = Buffer.from('endstream');
  const FLATEDECODE      = Buffer.from('FlateDecode');

  let searchPos = 0;
  while (searchPos < pdfBuffer.length) {
    // Buscar siguiente "stream"
    const streamIdx = indexOfBuffer(pdfBuffer, STREAM_MARKER, searchPos);
    if (streamIdx === -1) break;

    // Verificar que antes del stream hay /FlateDecode (en los últimos ~500 bytes)
    const lookbackStart = Math.max(0, streamIdx - 500);
    const lookback      = pdfBuffer.slice(lookbackStart, streamIdx);
    if (indexOfBuffer(lookback, FLATEDECODE, 0) === -1) {
      searchPos = streamIdx + 6;
      continue;
    }

    streamsFound++;

    // El stream empieza después de "stream\n" o "stream\r\n"
    let dataStart = streamIdx + 6; // longitud de "stream"
    if (pdfBuffer[dataStart] === 0x0D) dataStart++; // \r
    if (pdfBuffer[dataStart] === 0x0A) dataStart++; // \n
    else { searchPos = dataStart; continue; }

    // Buscar endstream
    const endIdx = indexOfBuffer(pdfBuffer, ENDSTREAM_MARKER, dataStart);
    if (endIdx === -1) { searchPos = dataStart; continue; }

    // Recortar posible \r\n antes de endstream
    let dataEnd = endIdx;
    if (pdfBuffer[dataEnd - 1] === 0x0A) dataEnd--;
    if (pdfBuffer[dataEnd - 1] === 0x0D) dataEnd--;

    const streamBytes = pdfBuffer.slice(dataStart, dataEnd);

    // Intentar descomprimir
    let decompressed = null;
    for (const decomp of [inflate, inflateRaw, gunzip]) {
      try {
        decompressed = await decomp(streamBytes);
        break;
      } catch (_) { /* intentar siguiente */ }
    }

    if (decompressed) {
      streamsDecompressed++;
      const streamText = decompressed.toString('latin1');
      const extracted  = extractTextFromPdfStream(streamText);
      if (extracted && extracted.trim().length > 10) {
        allText += extracted + '\n';
      }
    }

    searchPos = endIdx + 9; // saltar "endstream"
  }

  console.log(`[NasdaqIndex] ${ticker}: PDF → streams encontrados:${streamsFound} descomprimidos:${streamsDecompressed} texto:${allText.length} chars`);

  // DEBUG TEMPORAL: loguear primeras 2000 chars del texto extraído para diagnóstico
  if (allText.length > 0) {
    console.log(`[NasdaqIndex] ${ticker}: PDF texto extraído (primeros 500 chars): ${JSON.stringify(allText.slice(0, 500))}`);
  }

  // Fallback: buscar texto en literales directos (sin comprimir) si poco texto extraído
  if (allText.length < 200) {
    console.warn(`[NasdaqIndex] ${ticker}: poco texto desde FlateDecode, intentando fallback literal`);
    const pdfStr = pdfBuffer.toString('latin1');
    const litRegex = /\(([^)]{1,200})\)\s*(?:Tj|'|")/g;
    let m;
    while ((m = litRegex.exec(pdfStr)) !== null) {
      const decoded = m[1]
        .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, ' ')
        .replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
      allText += decoded + ' ';
    }
    console.log(`[NasdaqIndex] ${ticker}: fallback literal → ${allText.length} chars`);
  }

  return allText;
}

/**
 * Busca un Buffer (needle) dentro de otro Buffer (haystack) desde pos.
 * Usa Buffer.indexOf() nativo de Node.js (mucho más eficiente).
 */
function indexOfBuffer(haystack, needle, fromIndex = 0) {
  return haystack.indexOf(needle, fromIndex);
}

/**
 * Extrae el texto visible de un stream PDF descomprimido.
 * Soporta:
 *  - Strings literales: (texto) Tj/'/"|[(texto)] TJ
 *  - Strings hexadecimales: <4865> Tj / [<4865>] TJ
 *  - Td/TD/Tm para detectar saltos de línea implícitos
 */
function extractTextFromPdfStream(stream) {
  let result = '';

  // Tokenizar todo el stream de una vez (dentro y fuera de BT/ET)
  // ya que algunos PDFs no usan estrictamente BT/ET pero sí Tj/TJ
  const lines = stream.split(/\r?\n/);

  // DEBUG TEMPORAL: loguear primeras hex strings encontradas en el stream
  const hexSamples = [];
  for (const line of lines.slice(0, 200)) {
    const h1 = line.match(/<([0-9A-Fa-f]{4,})>\s*(?:Tj|'|")/);
    if (h1) hexSamples.push(`HEX_Tj: ${h1[1].slice(0,40)}`);
    const h2 = line.match(/\[.*<([0-9A-Fa-f]{4,})>.*\]\s*TJ/);
    if (h2) hexSamples.push(`HEX_TJ_arr: ${h2[1].slice(0,40)}`);
  }
  if (hexSamples.length > 0) {
    console.log(`[NasdaqIndex] PDF hex samples (first 5): ${hexSamples.slice(0,5).join(' | ')}`);
  }

  for (const line of lines) {
    // Detectar Td o T* (nueva línea) → añadir newline al resultado
    if (/^\s*T[d*]\s*$/.test(line) || /[-\d.]+\s+[-\d.]+\s+Td/.test(line)) {
      if (result.length > 0 && result[result.length - 1] !== '\n') {
        result += '\n';
      }
      continue;
    }

    // Formato 1: (texto) Tj o (texto) ' o (texto) "
    const tjLit = line.match(/\(([^)]*)\)\s*(?:Tj|'|")\s*$/);
    if (tjLit) {
      result += decodePdfString(tjLit[1]) + ' ';
      continue;
    }

    // Formato 2: [(texto) kern (texto)] TJ
    const tjArr = line.match(/\[([^\]]*)\]\s*TJ\s*$/);
    if (tjArr) {
      const inner = tjArr[1];
      // extraer partes literales (texto) y hexadecimales <hex>
      const parts = [...inner.matchAll(/\(([^)]*)\)|<([0-9A-Fa-f]*)>/g)];
      for (const p of parts) {
        if (p[1] !== undefined) result += decodePdfString(p[1]);
        else if (p[2] !== undefined) result += hexToText(p[2]);
      }
      result += ' ';
      continue;
    }

    // Formato 3: <hex> Tj (string hexadecimal directo)
    const tjHex = line.match(/<([0-9A-Fa-f]*)>\s*(?:Tj|'|")\s*$/);
    if (tjHex) {
      result += hexToText(tjHex[1]) + ' ';
      continue;
    }
  }

  // Si no se encontró texto line-by-line, intentar regex global en el stream completo
  if (result.trim().length < 10) {
    const globalTj = [...stream.matchAll(/\(([^)]{0,200})\)\s*(?:Tj|'|")/g)];
    for (const m of globalTj) result += decodePdfString(m[1]) + ' ';
    const globalTjHex = [...stream.matchAll(/<([0-9A-Fa-f]{2,})>\s*(?:Tj|'|")/g)];
    for (const m of globalTjHex) result += hexToText(m[1]) + ' ';
  }

  return result;
}

/** Decodifica un string literal PDF (escapes \n \r \( \) \\) */
function decodePdfString(s) {
  return s
    .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

/**
 * Convierte hex string PDF a texto.
 * Los PDFs modernos con CIDFont usan UTF-16BE (2 bytes por carácter),
 * por eso cada 4 hex chars = 1 carácter. También soporta Latin-1 (2 hex = 1 char).
 */
function hexToText(hex) {
  if (!hex || hex.length < 2) return '';
  // Pad a longitud par
  if (hex.length % 2 !== 0) hex = '0' + hex;

  // Detectar si es UTF-16BE: BOM 0xFEFF al inicio o si tiene muchos bytes nulos
  const isUtf16 = hex.startsWith('FEFF') || hex.startsWith('feff') ||
    // Heurística: si muchos pares son '00' (byte alto de ASCII en UTF-16BE)
    (hex.length >= 8 && (hex.slice(0,2) === '00' || hex.slice(2,4) === '00'));

  if (isUtf16) {
    // UTF-16BE: cada 4 hex chars = 1 codepoint de 2 bytes
    const start = hex.startsWith('FEFF') || hex.startsWith('feff') ? 4 : 0;
    let result = '';
    for (let i = start; i < hex.length - 2; i += 4) {
      const code = parseInt(hex.slice(i, i + 4), 16);
      if (code >= 32) result += String.fromCharCode(code);
      else if (code === 0x000A || code === 0x000D) result += '\n';
    }
    return result;
  }

  // Latin-1 / Windows-1252: cada 2 hex chars = 1 byte
  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    if (code >= 32 && code < 127) result += String.fromCharCode(code);
    else if (code === 0) continue;
    else result += ' ';
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
