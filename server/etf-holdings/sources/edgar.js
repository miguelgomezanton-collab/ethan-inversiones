// server/etf-holdings/sources/edgar.js
// Adaptador universal SEC EDGAR NPORT-P (Prioridad 3 — Fallback regulatorio)
//
// ⚠️  IMPORTANTE: Los datos de este adaptador son posiciones regulatorias del
//     formulario NPORT-P (mensual), con un retraso típico de 30-60 días.
//     NO deben presentarse como holdings en tiempo real.
//     Siempre se etiquetan con la fecha efectiva de las posiciones y la
//     advertencia de antigüedad.
//
// ETFs cubiertos (Fase 2 — completo 2026-11):
//
//   Invesco Exchange-Traded Fund Trust II (CIK 1378872):
//     KBWB  — Invesco KBW Bank ETF                    (Series S000034530)
//     TAN   — Invesco Solar ETF                        (Series S000060822)
//
//   Invesco Exchange-Traded Fund Trust I (CIK 1209466):
//     PHO   — Invesco Water Resources ETF              (Series S000003048)
//     PBS   — Invesco Dynamic Media ETF                (Series S000003029)
//     PEJ   — Invesco Dynamic Leisure and Entertainment ETF (Series S000003028)
//     PSP   — Invesco Global Listed Private Equity ETF (Series S000013789)
//     PBJ   — Invesco Dynamic Food & Beverage ETF      (Series S000003027)
//
//   SPDR Series Trust (CIK 1064642):
//     KIE   — SPDR S&P Insurance ETF                  (Series S000006979)
//     KCE   — SPDR S&P Capital Markets ETF            (Series S000006978)
//
//   ALPS ETF Trust (CIK 1414040):
//     AMLP  — Alerian MLP ETF
//
//   ETF Series Solutions (CIK 1540305):
//     QTUM  — Defiance Quantum ETF
//
//   Amplify ETF Trust (CIK 1633061):
//     IBUY  — Amplify Online Retail ETF
//
// Fuente: SEC EDGAR EFTS + NPORT-P XML
//   Búsqueda EFTS: https://efts.sec.gov/LATEST/search-index?q=%22{TICKER}%22&forms=NPORT-P&dateRange=custom&startdt={90daysago}
//   Submissions:   https://data.sec.gov/submissions/CIK{cik_padded}.json
//   Filing index:  https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type=NPORT-P&dateb=&owner=include&count=10&search_text=
// ─────────────────────────────────────────────────────────────────────────────

import https from 'https';

// Mapa completo: ticker → { cik, seriesId?, entityName }
// CIKs verificados contra SEC EDGAR (noviembre 2026)
// seriesId: SEC Series Identifier — permite filtrar el fondo correcto dentro
//           de un trust que contiene múltiples ETFs
const EDGAR_ETF_MAP = {
  // ── Invesco Exchange-Traded Fund Trust II (CIK 1378872) ──────────────────
  KBWB: { cik: '1378872', seriesId: 'S000034530', name: 'Invesco KBW Bank ETF' },
  TAN:  { cik: '1378872', seriesId: 'S000060822', name: 'Invesco Solar ETF' },

  // ── Invesco Exchange-Traded Fund Trust I (CIK 1209466) ───────────────────
  PHO:  { cik: '1209466', seriesId: 'S000003048', name: 'Invesco Water Resources ETF' },
  PBS:  { cik: '1209466', seriesId: 'S000003029', name: 'Invesco Dynamic Media ETF' },
  PEJ:  { cik: '1209466', seriesId: 'S000003028', name: 'Invesco Dynamic Leisure and Entertainment ETF' },
  PSP:  { cik: '1209466', seriesId: 'S000013789', name: 'Invesco Global Listed Private Equity ETF' },
  PBJ:  { cik: '1209466', seriesId: 'S000003027', name: 'Invesco Dynamic Food & Beverage ETF' },

  // ── SPDR Series Trust (CIK 1064642) ─────────────────────────────────────
  KIE:  { cik: '1064642', seriesId: 'S000006979', name: 'SPDR S&P Insurance ETF' },
  KCE:  { cik: '1064642', seriesId: 'S000006978', name: 'SPDR S&P Capital Markets ETF' },

  // ── ALPS ETF Trust (CIK 1414040) ─────────────────────────────────────────
  AMLP: { cik: '1414040', seriesId: null, name: 'Alerian MLP ETF' },

  // ── ETF Series Solutions (CIK 1540305) ───────────────────────────────────
  QTUM: { cik: '1540305', seriesId: null, name: 'Defiance Quantum ETF' },

  // ── Amplify ETF Trust (CIK 1633061) ──────────────────────────────────────
  IBUY: { cik: '1633061', seriesId: null, name: 'Amplify Online Retail ETF' },

  // ── Global X Funds (CIK 1432353) ─────────────────────────────────────────
  // Series IDs verificados en SEC EDGAR (noviembre 2026).
  // Reemplaza el fallback buggy en globalx.js (usaba period_of_report como accessionNo).
  BOTZ: { cik: '1432353', seriesId: 'S000054693', name: 'Global X Robotics & Artificial Intelligence ETF' },
  URA:  { cik: '1432353', seriesId: 'S000029442', name: 'Global X Uranium ETF' },
  LIT:  { cik: '1432353', seriesId: 'S000029441', name: 'Global X Lithium & Battery Tech ETF' },
  FINX: { cik: '1432353', seriesId: 'S000054691', name: 'Global X FinTech ETF' },
  DTCR: { cik: '1432353', seriesId: 'S000069709', name: 'Global X Data Center & Digital Infrastructure ETF' },
  SOCL: { cik: '1432353', seriesId: 'S000034155', name: 'Global X Social Media ETF' },

  // ── ARK ETF Trust (CIK 1579982) ──────────────────────────────────────────
  // CSV directo en ark-funds.com devuelve HTTP 403 (bloqueado desde servidor).
  // Cobertura via EDGAR NPORT-P (CIK verificado en SEC EDGAR nov-2026).
  ARKG: { cik: '1579982', seriesId: 'S000042975', name: 'ARK Genomic Revolution ETF' },

  // ── Vanguard Specialized Funds (CIK 734383) ──────────────────────────────
  // vanguard.js devuelve HTTP 403 en el índice EDGAR. Se mueve aquí con CIK+seriesId
  // para usar la ruta submissions JSON que evita el problema de rate-limit.
  VNQ:  { cik: '734383',  seriesId: 'S000002924', name: 'Vanguard Real Estate Index Fund' },

  // ── Fidelity Covington Trust (CIK 945908) ────────────────────────────────
  // FSTA es de Fidelity (no SSGA). La URL de SPDR/SSGA devuelve 404.
  // CIK y seriesId verificados en SEC EDGAR (noviembre 2026).
  FSTA: { cik: '945908',  seriesId: 'S000042572', name: 'Fidelity MSCI Consumer Staples Index ETF' },

  // ── Global X Funds (CIK 1432353) — continuación Fase 2 ───────────────────
  // AIQ y PAVE estaban incorrectamente en firsttrust.js. Movidos aquí 2026-11.
  // Series IDs verificados en EDGAR filing index (accession 0000930413-26-002360, etc.)
  AIQ:  { cik: '1432353', seriesId: 'S000061326', name: 'Global X Artificial Intelligence & Technology ETF' },
  PAVE: { cik: '1432353', seriesId: 'S000056509', name: 'Global X U.S. Infrastructure Development ETF' },

  // ── ETF Series Solutions (CIK 1540305) — continuación Fase 2 ─────────────
  // JETS estaba incorrectamente en firsttrust.js. Movido aquí 2026-11.
  // Serie verificada en EDGAR N-PX filing index (accession 0001437749-24-027812).
  JETS: { cik: '1540305', seriesId: 'S000048544', name: 'U.S. Global Jets ETF' },

  // ── First Trust Exchange-Traded Fund (I) (CIK 1329377) ───────────────────
  // ftportfolios.com es SPA — HTTP 0 bytes desde servidor. Se mueven a EDGAR 2026-11.
  // CIKs y Series IDs verificados en EDGAR NPORT-P filing indexes.
  FDN:  { cik: '1329377', seriesId: 'S000012479', name: 'First Trust Dow Jones Internet Index Fund' },
  FCG:  { cik: '1329377', seriesId: 'S000017177', name: 'First Trust Natural Gas ETF' },
  FIW:  { cik: '1329377', seriesId: 'S000017178', name: 'First Trust Water ETF' },

  // ── First Trust Exchange-Traded Fund II (CIK 1364608) ────────────────────
  SKYY: { cik: '1364608', seriesId: 'S000033237', name: 'First Trust Cloud Computing ETF' },
  CARZ: { cik: '1364608', seriesId: 'S000032974', name: 'First Trust S-Network Future Vehicles & Technology ETF' },
  GRID: { cik: '1364608', seriesId: 'S000026919', name: 'First Trust NASDAQ Clean Edge Smart Grid Infrastructure Index Fund' },

  // ── First Trust Exchange-Traded Fund VI (CIK 1552740) ────────────────────
  AIRR: { cik: '1552740', seriesId: 'S000044209', name: 'First Trust RBA American Industrial Renaissance ETF' },
};

const EDGAR_TICKERS = new Set(Object.keys(EDGAR_ETF_MAP));

/** Verifica si este adapter soporta el ticker */
export function supports(ticker) {
  return EDGAR_TICKERS.has(ticker.toUpperCase());
}

/**
 * Obtiene holdings vía SEC EDGAR NPORT-P.
 * Estrategia:
 *   1. EFTS full-text search filtrado por seriesId (si disponible)
 *   2. Fallback: submissions JSON del CIK → primer NPORT-P que coincida
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "KBWB")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();
  const meta = EDGAR_ETF_MAP[ticker];
  if (!meta) {
    throw new Error(`EDGAR: ticker no soportado: ${ticker}`);
  }

  // 1. Buscar el NPORT-P más reciente para este ticker/serie
  const filing = await findLatestNportP(ticker, meta);
  if (!filing) {
    throw new Error(`EDGAR: no se encontró NPORT-P reciente para ${ticker} (CIK ${meta.cik})`);
  }

  // 2. Descargar y parsear el XML del filing
  return parseNportPFiling(filing, ticker, meta);
}

/**
 * Busca el NPORT-P más reciente para el ticker dado.
 * Para trusts con múltiples ETFs, filtra por seriesId para obtener el fondo correcto.
 */
async function findLatestNportP(ticker, meta) {
  const { cik, seriesId } = meta;

  // Calcular fecha de inicio: 90 días atrás
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  const startdt = startDate.toISOString().slice(0, 10);

  // Intentar EFTS full-text search
  // Si tenemos seriesId, filtramos directamente por él para evitar cruces entre fondos del mismo trust
  try {
    let eftsUrl;
    if (seriesId) {
      // Filtro preciso: buscar el seriesId exacto en filings NPORT-P de este CIK
      eftsUrl = `https://efts.sec.gov/LATEST/search-index?q=%22${seriesId}%22&forms=NPORT-P&dateRange=custom&startdt=${startdt}&entity=${cik}&_source=period_of_report,file_date,accession_no,entity_name,period_of_report,series_id`;
    } else {
      // Fallback: buscar por ticker en texto del filing
      eftsUrl = `https://efts.sec.gov/LATEST/search-index?q=%22${ticker}%22&forms=NPORT-P&dateRange=custom&startdt=${startdt}&entity=${cik}&_source=period_of_report,file_date,accession_no,entity_name,period_of_report,series_id`;
    }

    const eftsData = await fetchJson(eftsUrl);

    if (eftsData?.hits?.hits?.length > 0) {
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
          entityName: hit.entity_name || meta.name,
          cik,
          seriesId,
          source: 'efts',
        };
      }
    }
  } catch (err) {
    console.warn(`EDGAR EFTS falló para ${ticker}: ${err.message} — intentando submissions JSON`);
  }

  // Fallback: submissions JSON del CIK
  return findLatestNportPFromSubmissions(ticker, meta);
}

/**
 * Busca el NPORT-P más reciente desde el submissions JSON del CIK.
 * Para trusts con múltiples series, intenta filtrar por seriesId en los reportes.
 */
async function findLatestNportPFromSubmissions(ticker, meta) {
  const { cik, seriesId } = meta;
  const paddedCik = cik.padStart(10, '0');
  const submissionsUrl = `https://data.sec.gov/submissions/CIK${paddedCik}.json`;
  const data = await fetchJson(submissionsUrl);

  if (!data?.filings?.recent) {
    throw new Error(`EDGAR: no se encontraron filings para CIK ${cik}`);
  }

  const { form, accessionNumber, reportDate, filingDate, series: seriesArr } = data.filings.recent;
  if (!form || !accessionNumber) {
    throw new Error(`EDGAR: estructura de submissions inesperada para CIK ${cik}`);
  }

  // Si tenemos seriesId, buscar el NPORT-P de esa serie concreta
  for (let i = 0; i < form.length; i++) {
    if (form[i] !== 'NPORT-P') continue;

    // Verificar si el filing corresponde a nuestra serie
    if (seriesId && seriesArr && seriesArr[i] && seriesArr[i] !== seriesId) {
      continue; // Pertenece a otra serie del mismo trust
    }

    return {
      accessionNo: accessionNumber[i],
      periodOfReport: reportDate?.[i] || filingDate?.[i],
      entityName: data.name,
      cik,
      seriesId,
      source: 'submissions',
    };
  }

  throw new Error(`EDGAR: no se encontró NPORT-P en submissions para ${ticker} (CIK ${cik}, serie ${seriesId || 'N/A'})`);
}

/**
 * Descarga el índice del filing y parsea el XML de posiciones.
 */
async function parseNportPFiling(filing, ticker, meta) {
  const { accessionNo, periodOfReport, entityName } = filing;
  const { cik } = meta;

  // Construir URL del índice del filing
  const accessionFormatted = accessionNo.replace(/-/g, '');

  // Obtener el nombre del archivo XML principal desde el índice
  let xmlFilename = null;
  try {
    const indexUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/${accessionNo}-index.htm`;
    const indexHtml = await fetchText(indexUrl);
    // Buscar archivos XML en el índice (NPORT-P suele llamarse primary_doc.xml o similar)
    const xmlMatch = indexHtml.match(/href="([^"]*\.xml)"/i);
    if (xmlMatch) {
      xmlFilename = xmlMatch[1].split('/').pop();
    }
  } catch {
    // Continuar con nombre canónico
  }

  // URL del XML
  const xmlUrl = xmlFilename
    ? `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/${xmlFilename}`
    : `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/primary_doc.xml`;

  const xmlText = await fetchText(xmlUrl);
  return parseNportXml(xmlText, ticker, periodOfReport, entityName || meta.name, accessionNo, meta);
}

/**
 * Parsea el XML de NPORT-P y extrae holdings.
 * El XML de NPORT-P contiene elementos <invstOrSec> con los valores de posición.
 *
 * Para trusts con múltiples series en un mismo filing XML, busca primero
 * la sección correspondiente al seriesId correcto.
 */
function parseNportXml(xmlText, ticker, periodOfReport, entityName, accessionNo, meta) {
  // Si el XML contiene múltiples series (Invesco Trust I/II), intentar aislar la sección
  // del fondo correcto usando el nombre del ETF o el seriesId
  let workingXml = xmlText;

  if (meta.seriesId) {
    // Intentar localizar el bloque <seriesInfo> o <series> para esta serie
    // y limitar el parsing al bloque de invstOrSec siguiente
    const seriesPattern = new RegExp(
      `<seriesId>[^<]*${meta.seriesId}[^<]*<\\/seriesId>[\\s\\S]*?(?=<seriesId>|$)`,
      'i'
    );
    const seriesMatch = xmlText.match(seriesPattern);
    if (seriesMatch) {
      workingXml = seriesMatch[0];
    }
  }

  const holdings = [];
  const invstRegex = /<invstOrSec>([\s\S]*?)<\/invstOrSec>/gi;
  let match;

  while ((match = invstRegex.exec(workingXml)) !== null) {
    const block = match[1];
    const name     = extractXmlField(block, 'name') || extractXmlField(block, 'issuerName') || '';
    const cusip    = extractXmlField(block, 'cusip') || '';
    const isin     = extractXmlField(block, 'isin') || '';
    const lei      = extractXmlField(block, 'lei') || '';
    const pctVal   = parseFloat(extractXmlField(block, 'pctVal') || '0');
    const valUSD   = parseFloat(extractXmlField(block, 'valUSD') || extractXmlField(block, 'val') || '0');
    const holdingTicker = extractXmlField(block, 'ticker') || '';

    if (!name) continue;
    if (pctVal === 0 && valUSD === 0) continue;

    holdings.push({
      ticker:   holdingTicker.toUpperCase() || null,
      name,
      weight:   pctVal,
      value:    valUSD,
      cusip,
      isin,
      lei,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`EDGAR: no se encontraron posiciones en el XML para ${ticker} (accession: ${accessionNo})`);
  }

  const effectiveDate = periodOfReport || 'desconocida';
  const ageWarning = buildAgeWarning(effectiveDate);
  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    ticker,
    holdings,
    totalWeight: Math.round(totalWeight * 100) / 100,
    holdingsCount: holdings.length,
    source: 'SEC EDGAR NPORT-P',
    sourceUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${meta.cik}&type=NPORT-P&dateb=&owner=include&count=10`,
    isHistorical: true,
    effectiveDate,
    dataAgeWarning: ageWarning,
    entityName,
    accessionNo,
    seriesId: meta.seriesId || null,
  };
}

/** Extrae el texto de un tag XML simple */
function extractXmlField(xml, tag) {
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
