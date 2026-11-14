// server/etf-holdings/sources/edgar.js
// Adaptador universal SEC EDGAR NPORT-P (Prioridad 3 — Fallback regulatorio)
//
// ⚠️  IMPORTANTE: Los datos de este adaptador son posiciones regulatorias del
//     formulario NPORT-P (mensual), con un retraso típico de 30-60 días.
//     NO deben presentarse como holdings en tiempo real.
//     Siempre se etiquetan con la fecha efectiva de las posiciones y la
//     advertencia de antigüedad.
//
// ETFs cubiertos (Fase 2 — 12 pendientes):
//   Invesco ETF Trust II (CIK 1378872):
//     KBWB  — Invesco KBW Bank ETF
//     KIE   — Invesco KBW Insurance ETF
//     KCE   — Invesco KBW Capital Markets ETF
//     TAN   — Invesco Solar ETF
//     PHO   — Invesco Water Resources ETF
//     PEJ   — Invesco Dynamic Leisure and Entertainment ETF
//     PSP   — Invesco Global Listed Private Equity ETF
//     PBS   — Invesco Dynamic Media ETF
//     PBJ   — Invesco Dynamic Food & Beverage ETF
//
//   ALPS ETF Trust (CIK 1414040):
//     AMLP  — Alerian MLP ETF
//
//   ETF Series Solutions (CIK 1540305):
//     QTUM  — Defiance Quantum ETF
//
//   Amplify ETF Trust (CIK 1633061):
//     IBUY  — Amplify Online Retail ETF (serie S000052601)
//
// Fuente: SEC EDGAR EFTS + NPORT-P XML
//   Búsqueda: https://efts.sec.gov/LATEST/search-index?q=%22{TICKER}%22&forms=NPORT-P&dateRange=custom&startdt={90daysago}
//   Submissions: https://data.sec.gov/submissions/CIK{cik_padded}.json
//   Filing: https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{filename}.xml
// ─────────────────────────────────────────────────────────────────────────────

import https from 'https';

// CIK conocidos (trust/issuer, no fondo individual)
// El adaptador usa EFTS para encontrar el filing más reciente por ticker
const KNOWN_CIKS = {
  // Invesco Exchange-Traded Fund Trust II
  KBWB: '1378872',
  KIE:  '1378872',
  KCE:  '1378872',
  TAN:  '1378872',
  PHO:  '1378872',
  PEJ:  '1378872',
  PSP:  '1378872',
  PBS:  '1378872',
  PBJ:  '1378872',
  // ALPS ETF Trust
  AMLP: '1414040',
  // ETF Series Solutions
  QTUM: '1540305',
  // Amplify ETF Trust
  IBUY: '1633061',
};

const EDGAR_TICKERS = new Set(Object.keys(KNOWN_CIKS));

/** Verifica si este adapter soporta el ticker */
export function supports(ticker) {
  return EDGAR_TICKERS.has(ticker.toUpperCase());
}

/**
 * Obtiene holdings vía SEC EDGAR NPORT-P.
 * Estrategia: EFTS full-text search → accession number → parsing XML
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "KBWB")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  if (!EDGAR_TICKERS.has(ticker)) {
    throw new Error(`EDGAR: ticker no soportado: ${ticker}`);
  }

  const cik = KNOWN_CIKS[ticker];

  // 1. Buscar el NPORT-P más reciente para este ticker vía EFTS
  const filing = await findLatestNportP(ticker, cik);
  if (!filing) {
    throw new Error(`EDGAR: no se encontró NPORT-P reciente para ${ticker} (CIK ${cik})`);
  }

  // 2. Descargar y parsear el XML del filing
  const holdings = await parseNportPFiling(filing, ticker, cik);
  return holdings;
}

/**
 * Busca el NPORT-P más reciente para el ticker dado.
 * Usa EFTS full-text search primero; fallback a submissions JSON.
 */
async function findLatestNportP(ticker, cik) {
  // Calcular fecha de inicio: 90 días atrás
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  const startdt = startDate.toISOString().slice(0, 10);

  // Intentar EFTS full-text search
  try {
    const eftsUrl = `https://efts.sec.gov/LATEST/search-index?q=%22${ticker}%22&forms=NPORT-P&dateRange=custom&startdt=${startdt}&_source=period_of_report,file_date,accession_no,entity_name,period_of_report`;
    const eftsData = await fetchJson(eftsUrl);

    if (eftsData?.hits?.hits?.length > 0) {
      // Ordenar por fecha descendente y tomar el más reciente
      const hits = eftsData.hits.hits
        .filter(h => h._source?.accession_no)
        .sort((a, b) => {
          const da = a._source?.period_of_report || a._source?.file_date || '';
          const db = b._source?.period_of_report || b._source?.file_date || '';
          return db.localeCompare(da);
        });

      if (hits.length > 0) {
        const hit = hits[0]._source;
        return {
          accessionNo: hit.accession_no,
          periodOfReport: hit.period_of_report || hit.file_date,
          entityName: hit.entity_name,
          cik,
          source: 'efts',
        };
      }
    }
  } catch (err) {
    // EFTS falló, intentar submissions
    console.warn(`EDGAR EFTS falló para ${ticker}: ${err.message} — intentando submissions JSON`);
  }

  // Fallback: submissions JSON del CIK
  return findLatestNportPFromSubmissions(ticker, cik);
}

/**
 * Busca el NPORT-P más reciente desde el submissions JSON del CIK.
 */
async function findLatestNportPFromSubmissions(ticker, cik) {
  const paddedCik = cik.padStart(10, '0');
  const submissionsUrl = `https://data.sec.gov/submissions/CIK${paddedCik}.json`;
  const data = await fetchJson(submissionsUrl);

  if (!data?.filings?.recent) {
    throw new Error(`EDGAR: no se encontraron filings para CIK ${cik}`);
  }

  const { form, accessionNumber, reportDate, filingDate } = data.filings.recent;
  if (!form || !accessionNumber) {
    throw new Error(`EDGAR: estructura de submissions inesperada para CIK ${cik}`);
  }

  // Buscar el NPORT-P más reciente
  for (let i = 0; i < form.length; i++) {
    if (form[i] === 'NPORT-P') {
      return {
        accessionNo: accessionNumber[i],
        periodOfReport: reportDate?.[i] || filingDate?.[i],
        entityName: data.name,
        cik,
        source: 'submissions',
      };
    }
  }

  throw new Error(`EDGAR: no se encontró NPORT-P en submissions para CIK ${cik}`);
}

/**
 * Descarga el índice del filing y parsea el XML de posiciones.
 */
async function parseNportPFiling(filing, ticker, cik) {
  const { accessionNo, periodOfReport, entityName } = filing;

  // Construir URL del índice del filing
  const accessionFormatted = accessionNo.replace(/-/g, '');
  const indexUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/${accessionNo}-index.htm`;

  // Obtener el nombre del archivo XML principal
  let xmlFilename;
  try {
    const indexHtml = await fetchText(indexUrl);
    // Buscar el archivo .xml del NPORT-P (suele llamarse nport*.xml o similar)
    const xmlMatch = indexHtml.match(/href="([^"]*\.xml)"/i);
    if (xmlMatch) {
      xmlFilename = xmlMatch[1].split('/').pop();
    }
  } catch {
    // Si el índice falla, intentar nombre canónico
    xmlFilename = null;
  }

  // Si no encontramos el nombre, construir URL alternativa
  let xmlUrl;
  if (xmlFilename) {
    xmlUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/${xmlFilename}`;
  } else {
    // Muchos NPORT-P tienen el accession number como nombre base
    xmlUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/primary_doc.xml`;
  }

  const xmlText = await fetchText(xmlUrl);
  return parseNportXml(xmlText, ticker, periodOfReport, entityName, accessionNo);
}

/**
 * Parsea el XML de NPORT-P y extrae holdings.
 * El XML de NPORT-P contiene elementos <invstOrSec> con los valores de posición.
 */
function parseNportXml(xmlText, ticker, periodOfReport, entityName, accessionNo) {
  const holdings = [];

  // Extraer elementos <invstOrSec> (investment or security)
  const invstRegex = /<invstOrSec>([\s\S]*?)<\/invstOrSec>/gi;
  let match;

  while ((match = invstRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const name     = extractXmlField(block, 'name') || extractXmlField(block, 'issuerName') || '';
    const cusip    = extractXmlField(block, 'cusip') || '';
    const isin     = extractXmlField(block, 'isin') || '';
    const lei      = extractXmlField(block, 'lei') || '';
    const pctVal   = parseFloat(extractXmlField(block, 'pctVal') || '0');
    const valUSD   = parseFloat(extractXmlField(block, 'valUSD') || extractXmlField(block, 'val') || '0');
    // ticker del holding (puede no existir para todos los valores)
    const holdingTicker = extractXmlField(block, 'ticker') || extractXmlField(block, 'identifiers/ticker') || '';

    if (!name) continue;
    if (pctVal === 0 && valUSD === 0) continue;

    holdings.push({
      ticker:   holdingTicker.toUpperCase() || null,
      name,
      weight:   pctVal,          // % del portfolio
      value:    valUSD,          // valor en USD
      cusip,
      isin,
      lei,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`EDGAR: no se encontraron posiciones en el XML para ${ticker} (accession: ${accessionNo})`);
  }

  // Calcular fecha efectiva y advertencia de antigüedad
  const effectiveDate = periodOfReport || 'desconocida';
  const ageWarning = buildAgeWarning(effectiveDate);

  // Suma total de pesos (debería ser ~100%)
  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    ticker,
    holdings,
    totalWeight: Math.round(totalWeight * 100) / 100,
    holdingsCount: holdings.length,
    source: 'SEC EDGAR NPORT-P',
    sourceUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${KNOWN_CIKS[ticker]}&type=NPORT-P&dateb=&owner=include&count=10`,
    isHistorical: true,
    effectiveDate,
    dataAgeWarning: ageWarning,
    entityName,
    accessionNo,
  };
}

/** Extrae el texto de un tag XML simple */
function extractXmlField(xml, tag) {
  // Manejar tanto <tag> como <ns:tag>
  const pattern = new RegExp(`<(?:[^:>]+:)?${tag}[^>]*>([^<]*)<\\/(?:[^:>]+:)?${tag}>`, 'i');
  const m = xml.match(pattern);
  return m ? m[1].trim() : null;
}

/** Construye el mensaje de advertencia de antigüedad de los datos */
function buildAgeWarning(effectiveDate) {
  let ageStr = '';
  try {
    const eff = new Date(effectiveDate);
    const now = new Date();
    const diffDays = Math.round((now - eff) / (1000 * 60 * 60 * 24));
    if (!isNaN(diffDays) && diffDays > 0) {
      ageStr = ` (hace ${diffDays} días)`;
    }
  } catch {
    // ignore
  }
  return `⚠️ Datos regulatorios NPORT-P — fecha efectiva: ${effectiveDate}${ageStr}. Pueden tener entre 30 y 60 días de antigüedad. No son posiciones en tiempo real.`;
}

// ── Helpers HTTP ───────────────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'ETHAN-Mercados/2.0 contact@ethan-inversiones.app',
        'Accept': 'application/json',
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`EDGAR fetchJson HTTP ${res.statusCode} para ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`EDGAR fetchJson parse error: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`EDGAR fetchJson timeout: ${url}`)); });
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'ETHAN-Mercados/2.0 contact@ethan-inversiones.app',
        'Accept': 'application/xml, text/html, text/plain',
      },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Seguir redirect
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`EDGAR fetchText HTTP ${res.statusCode} para ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`EDGAR fetchText timeout: ${url}`)); });
  });
}
