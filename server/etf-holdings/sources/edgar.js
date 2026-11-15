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
//   VanEck ETF Trust (CIK 1137360):
//     REMX  — VanEck Rare Earth/Strategic Metals ETF   (Series S000030045)
//     NLR   — VanEck Uranium and Nuclear ETF            (Series S000018475)
//     ESPO  — VanEck Video Gaming and eSports ETF       (Series S000062930)
//
//     ⚠️  Estos tres ETFs usan vaneck.js como fuente primaria.
//         EDGAR es el fallback cuando vaneck.com devuelve HTTP 502
//         (bloqueado desde IPs de datacenter de Vercel).
//
//   FlexShares Trust (CIK 1491978):
//     GUNR  — FlexShares Morningstar Global Upstream Natural Resources Index Fund
//             (Series S000033315)
//             ⚠️  Erróneamente asignado a vaneck.js — pertenece a Northern Trust FlexShares.
//
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

// NOTA: https module eliminado — usamos Web API fetch() para compatibilidad con Vercel Serverless
// (https.get() puede tener comportamiento diferente en el sandbox de Vercel)
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// ── Caché Firestore CUSIP→ticker ───────────────────────────────────────────────
// Colección: cusip_ticker_cache / Documento: {cusip}
// Evita consultas repetidas a OpenFIGI para los mismos CUSIPs.
// TTL: 90 días (los tickers de acciones domésticas US son muy estables).
const COL_CUSIP = 'cusip_ticker_cache';
const CUSIP_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 días

function getDB() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

/**
 * Lee el caché de CUSIP→ticker desde Firestore.
 * @param {string[]} cusips
 * @returns {Promise<Map<string,string>>} cusip → ticker
 */
async function getCachedCusips(cusips) {
  const result = new Map();
  if (!cusips.length) return result;
  try {
    const db  = getDB();
    const col = db.collection(COL_CUSIP);
    // Firestore permite hasta 30 docs en getAll
    const BATCH = 30;
    for (let i = 0; i < cusips.length; i += BATCH) {
      const slice = cusips.slice(i, i + BATCH);
      const refs  = slice.map(c => col.doc(c));
      const snaps = await db.getAll(...refs);
      for (const snap of snaps) {
        if (!snap.exists) continue;
        const data = snap.data();
        const age  = Date.now() - (data.cachedAt || 0);
        if (age < CUSIP_TTL_MS && data.ticker) {
          result.set(snap.id, data.ticker);
        }
      }
    }
    if (result.size > 0) {
      console.log(`[edgar/cusip-cache] ${result.size}/${cusips.length} CUSIPs resueltos desde caché Firestore`);
    }
  } catch (err) {
    console.warn(`[edgar/cusip-cache] Error leyendo caché: ${err.message} — continuando sin caché`);
  }
  return result;
}

/**
 * Guarda resoluciones CUSIP→ticker en Firestore.
 * @param {Map<string,string>} cusipToTicker
 */
async function setCachedCusips(cusipToTicker) {
  if (!cusipToTicker.size) return;
  try {
    const db    = getDB();
    const batch = db.batch();
    for (const [cusip, ticker] of cusipToTicker) {
      const ref = db.collection(COL_CUSIP).doc(cusip);
      batch.set(ref, {
        ticker,
        cachedAt:    Date.now(),
        updatedAt:   FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await batch.commit();
    console.log(`[edgar/cusip-cache] ${cusipToTicker.size} CUSIPs guardados en caché Firestore`);
  } catch (err) {
    console.warn(`[edgar/cusip-cache] Error guardando caché: ${err.message}`);
  }
}

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
  // XME erróneamente asignado a vaneck.js — es SPDR Series Trust (State Street)
  // CIK 1064642, Series S000012333 verificados en EDGAR (noviembre 2026)
  XME:  { cik: '1064642', seriesId: 'S000012333', name: 'SPDR S&P Metals & Mining ETF' },

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
  // SIL y COPX erróneamente asignados a vaneck.js — son fondos de Global X (Mirae Asset)
  // CIK 1432353, Series IDs verificados en SEC EDGAR (noviembre 2026)
  SIL:  { cik: '1432353', seriesId: 'S000028730', name: 'Global X Silver Miners ETF' },
  COPX: { cik: '1432353', seriesId: 'S000028727', name: 'Global X Copper Miners ETF' },

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

  // ── VanEck ETF Trust (CIK 1137360) — EDGAR fallback ─────────────────────
  // Fuente primaria: vaneck.js (XLSX directo). EDGAR se usa cuando vaneck.com
  // devuelve HTTP 502 desde IPs de datacenter (Vercel).
  // CIK y Series IDs verificados en SEC EDGAR (noviembre 2026).
  REMX: { cik: '1137360', seriesId: 'S000030045', name: 'VanEck Rare Earth/Strategic Metals ETF' },
  NLR:  { cik: '1137360', seriesId: 'S000018475', name: 'VanEck Uranium and Nuclear ETF' },
  ESPO: { cik: '1137360', seriesId: 'S000062930', name: 'VanEck Video Gaming and eSports ETF' },

  // ── FlexShares Trust (CIK 1491978) ───────────────────────────────────────
  // GUNR erróneamente asignado a vaneck.js — es FlexShares (Northern Trust).
  // CIK 1491978, Series S000033315 verificados en EDGAR + equibles.com (noviembre 2026).
  GUNR: { cik: '1491978', seriesId: 'S000033315', name: 'FlexShares Morningstar Global Upstream Natural Resources Index Fund' },

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
 *
 * Estrategia en orden de precisión:
 *   1. EFTS search por seriesId (90 días) → resultado exacto para la serie
 *   2. EFTS search extendida (180 días) → misma precisión pero ventana mayor
 *   3. Submissions JSON con validación de seriesId en el XML
 */
async function findLatestNportP(ticker, meta) {
  const { cik, seriesId } = meta;

  // ── Intentar EFTS full-text search (preciso, filtra por seriesId) ────────
  for (const daysBack of [90, 180]) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startdt = startDate.toISOString().slice(0, 10);

    try {
      // Búsqueda EFTS: si tenemos seriesId, buscarlo directamente para evitar
      // cruces con otras series del mismo trust (crítico para Invesco Trust I/II)
      const query = seriesId ? `%22${seriesId}%22` : `%22${ticker}%22`;
      // NOTA: El campo _source.accession_no NO existe en la API EFTS de SEC EDGAR.
      // El accessionNo está en:
      //   - _source.adsh  (formato: 0001234567-YY-NNNNNN)
      //   - _id           (formato: 0001234567-YY-NNNNNN:primary_doc.xml)
      // Solicitamos 'adsh' en _source para obtenerlo directamente.
      // También solicitamos 'period_ending' (el campo correcto para la fecha del periodo).
      const eftsUrl = `https://efts.sec.gov/LATEST/search-index?q=${query}&forms=NPORT-P&dateRange=custom&startdt=${startdt}&entity=${cik}&_source=adsh,period_ending,file_date,display_names`;

      const eftsData = await fetchJson(eftsUrl);

      if (eftsData?.hits?.hits?.length > 0) {
        // Extraer accessionNo desde _source.adsh o desde _id (antes del ":")
        const hits = eftsData.hits.hits
          .map(h => ({
            ...h,
            _accessionNo: h._source?.adsh || (h._id ? h._id.split(':')[0] : null),
          }))
          .filter(h => h._accessionNo)
          .sort((a, b) => {
            const da = a._source?.period_ending || a._source?.file_date || '';
            const db = b._source?.period_ending || b._source?.file_date || '';
            return db.localeCompare(da);
          });

        if (hits.length > 0) {
          const hit = hits[0];
          return {
            accessionNo:    hit._accessionNo,
            periodOfReport: hit._source?.period_ending || hit._source?.file_date,
            entityName:     (hit._source?.display_names?.[0] || meta.name),
            cik,
            seriesId,
            source: 'efts',
          };
        }
      }
    } catch (err) {
      console.warn(`EDGAR EFTS (${daysBack}d) falló para ${ticker}: ${err.message}`);
    }
  }

  console.warn(`EDGAR EFTS sin resultados para ${ticker} — intentando submissions JSON`);

  // ── Fallback: submissions JSON del CIK ───────────────────────────────────
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

  // ── Caso 1: submissions incluye array 'series' por filing ──────────────────
  // La mayoría de trusts multi-serie incluyen el seriesId por filing.
  // Si está disponible, filtrar directamente.
  if (seriesArr) {
    for (let i = 0; i < form.length; i++) {
      if (form[i] !== 'NPORT-P') continue;
      if (seriesId && seriesArr[i] && seriesArr[i] !== seriesId) continue;

      return {
        accessionNo:    accessionNumber[i],
        periodOfReport: reportDate?.[i] || filingDate?.[i],
        entityName:     data.name,
        cik,
        seriesId,
        source: 'submissions',
      };
    }
  }

  // ── Caso 2: submissions NO incluye 'series' por filing ────────────────────
  // Ocurre en algunos trusts que presentan NPORT-P consolidados (un filing por trust).
  // En ese caso el índice del filing apunta a un XML que contiene TODAS las series.
  // Necesitamos encontrar el filing más reciente y confiar en que parseNportXml
  // filtrará por seriesId al aislar el bloque correcto del XML.
  if (!seriesArr && seriesId) {
    console.warn(`[edgar] ${ticker}: submissions sin array 'series' — CIK ${cik} usa NPORT-P consolidado. Usando primer filing (parseNportXml filtrará por ${seriesId}).`);
    for (let i = 0; i < form.length; i++) {
      if (form[i] !== 'NPORT-P') continue;
      return {
        accessionNo:    accessionNumber[i],
        periodOfReport: reportDate?.[i] || filingDate?.[i],
        entityName:     data.name,
        cik,
        seriesId,
        source: 'submissions-consolidated',
      };
    }
  }

  // Sin seriesId: devolver primer NPORT-P (trusts de single-series)
  if (!seriesId) {
    for (let i = 0; i < form.length; i++) {
      if (form[i] !== 'NPORT-P') continue;
      return {
        accessionNo:    accessionNumber[i],
        periodOfReport: reportDate?.[i] || filingDate?.[i],
        entityName:     data.name,
        cik,
        seriesId: null,
        source: 'submissions',
      };
    }
  }

  throw new Error(`EDGAR: no se encontró NPORT-P en submissions para ${ticker} (CIK ${cik}, serie ${seriesId || 'N/A'})`);
}

/**
 * Descarga el índice del filing y parsea el XML de posiciones.
 * async porque parseNportXml resuelve tickers vía OpenFIGI.
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
    // Preferir la versión con estilo xslFormNPORT-P_X01 si existe, si no la raíz
    const xmlMatchStyled = indexHtml.match(/href="([^"]*xslFormNPORT[^"]*\.xml)"/i);
    const xmlMatchPlain  = indexHtml.match(/href="([^"]*\.xml)"/i);
    const xmlMatch = xmlMatchStyled || xmlMatchPlain;
    if (xmlMatch) {
      // FIX (2026-11-15): el href puede ser una ruta absoluta del servidor (empieza con '/')
      // ej: /Archives/edgar/data/1658645/000119312526322938/xslFormNPORT-P_X01/primary_doc.xml
      // En ese caso, construir la URL completa directamente desde sec.gov
      const href = xmlMatch[1];
      xmlFilename = href.startsWith('/') ? href : href;
    }
  } catch {
    // Continuar con nombre canónico
  }

  // URL del XML
  // Si xmlFilename empieza con '/', es ruta absoluta → usar sec.gov como base
  const xmlUrl = xmlFilename
    ? (xmlFilename.startsWith('/')
        ? `https://www.sec.gov${xmlFilename}`
        : `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/${xmlFilename}`)
    : `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionFormatted}/primary_doc.xml`;

  const xmlText = await fetchText(xmlUrl);
  return parseNportXml(xmlText, ticker, periodOfReport, entityName || meta.name, accessionNo, meta);
}

/**
 * Parsea el XML de NPORT-P y extrae holdings.
 * El XML de NPORT-P contiene elementos <invstOrSec> con los valores de posición.
 *
 * ESTRATEGIA DE RESOLUCIÓN DE TICKERS (crítico para el screener):
 *   1. Extraer el <ticker> del bloque <identifiers> si existe en el XML
 *   2. Si no hay ticker en XML, resolver CUSIP → ticker vía OpenFIGI API (batch)
 *   3. Si OpenFIGI no resuelve, dejar ticker: null (el frontend lo filtrará)
 *
 * IMPORTANTE: NPORT-P usa <identifiers><ticker> (anidado), no <ticker> directo.
 * El regex de extractXmlField lo captura igualmente por ser búsqueda en texto completo.
 *
 * Para trusts con múltiples series en un mismo filing XML, busca primero
 * la sección correspondiente al seriesId correcto.
 */
async function parseNportXml(xmlText, ticker, periodOfReport, entityName, accessionNo, meta) {
  // Si el XML contiene múltiples series (Invesco Trust I/II), intentar aislar la sección
  // del fondo correcto usando el nombre del ETF o el seriesId
  let workingXml = xmlText;

  if (meta.seriesId) {
    // FIX (2026-11-15): El regex anterior capturaba solo el bloque hasta el próximo <seriesId>,
    // que para fondos individuales es la sección de genInfo/fundInfo, ANTES de los holdings.
    // Resultado: 0 holdings en Vercel para todos los ETFs con seriesId.
    //
    // Para fondos individuales (un solo <seriesId> en el XML), no es necesario filtrar —
    // todo el XML corresponde a esta serie. Solo filtramos en multi-series trusts (Invesco Trust I/II)
    // donde el XML contiene holdings de varios fondos y hay que aislar el bloque correcto.
    const seriesIdCount = (xmlText.match(/<seriesId>/gi) || []).length;

    if (seriesIdCount > 1) {
      // Multi-series: buscar el bloque <invstOrSecs> que sigue a nuestro seriesId.
      // El patrón captura desde nuestro seriesId hasta el final del bloque <invstOrSecs>.
      const seriesPattern = new RegExp(
        `<seriesId>[^<]*${meta.seriesId}[^<]*<\\/seriesId>[\\s\\S]*?<invstOrSecs>[\\s\\S]*?<\\/invstOrSecs>`,
        'i'
      );
      const seriesMatch = xmlText.match(seriesPattern);
      if (seriesMatch) {
        workingXml = seriesMatch[0];
      }
      // Si no hay match, workingXml sigue siendo xmlText → el regex principal lo intentará
    }
    // Si seriesIdCount === 1 (fondo individual), workingXml = xmlText (ya asignado arriba)
    // No hace falta filtrar: el único <invstOrSecs> del XML ya corresponde a esta serie.
  }

  const rawHoldings = [];
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

    // NPORT-P puede incluir <ticker> dentro de <identifiers> o directamente.
    // extractXmlField busca en todo el bloque, así que lo captura en ambos casos.
    const holdingTicker = extractXmlField(block, 'ticker') || '';

    if (!name) continue;
    if (pctVal === 0 && valUSD === 0) continue;

    rawHoldings.push({
      ticker: holdingTicker ? holdingTicker.toUpperCase() : null,
      name,
      weight:   pctVal,
      value:    valUSD,
      cusip,
      isin,
      lei,
    });
  }

  if (rawHoldings.length === 0) {
    throw new Error(`EDGAR: no se encontraron posiciones en el XML para ${ticker} (accession: ${accessionNo})`);
  }

  // ── Resolver tickers faltantes vía caché Firestore + OpenFIGI ──────────────
  // Holdings sin ticker pero con CUSIP válido se resuelven en dos etapas:
  //   1. Caché Firestore (COL_CUSIP) → resolución instantánea, sin coste de API
  //   2. OpenFIGI para los CUSIPs no cacheados → guarda resultado en caché
  //
  // Holdings sin CUSIP US válido (internacionales, bonds, cash) quedan con
  // ticker:null y se contabilizan en unresolvedHoldings. NO se eliminan.
  const holdings = await resolveTickersViaOpenFIGI(rawHoldings);

  const effectiveDate = periodOfReport || 'desconocida';
  const ageWarning = buildAgeWarning(effectiveDate);
  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  // ── Separar holdings con y sin ticker para contabilidad transparente ──────
  // Los holdings sin ticker permanecen en el array completo para trazabilidad.
  // El frontend filtrará los que no pueda analizar; aquí los contabilizamos.
  const resolvedHoldings   = holdings.filter(h => h.ticker);
  const unresolvedHoldings = holdings.filter(h => !h.ticker).map(h => ({
    name:   h.name,
    weight: h.weight,
    cusip:  h.cusip  || null,
    isin:   h.isin   || null,
    reason: h.cusip && !isValidUSCusip(h.cusip)
      ? 'CUSIP no-US (internacional/bond)'
      : !h.cusip
        ? 'Sin identificador CUSIP'
        : 'CUSIP no resuelto por OpenFIGI',
  }));

  if (unresolvedHoldings.length > 0) {
    console.warn(
      `[edgar] ${ticker}: ${unresolvedHoldings.length}/${holdings.length} holdings sin ticker ` +
      `(internacionales/cash/no resueltos) — se contabilizan como pendientes`
    );
  }

  return {
    ticker,
    holdings,                                // Array completo — el frontend filtra por ticker
    totalWeight:          Math.round(totalWeight * 100) / 100,
    totalHoldings:        holdings.length,          // Total posiciones en el NPORT-P
    resolvedHoldings:     resolvedHoldings.length,  // Con ticker → analizables por ETHAN
    unresolvedHoldings,                             // Sin ticker → pendientes de resolución
    source:               'SEC EDGAR NPORT-P',
    sourceUrl:            `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${meta.cik}&type=NPORT-P&dateb=&owner=include&count=10`,
    isHistorical:         true,
    referenceDate:        effectiveDate,
    dataAgeWarning:       ageWarning,
    entityName,
    accessionNo,
    seriesId:             meta.seriesId || null,
  };
}

// ── OpenFIGI ticker resolution ─────────────────────────────────────────────────

/**
 * Resuelve tickers de acciones domésticas US a partir de CUSIPs vía OpenFIGI.
 * API pública, sin API key: máx 10 items/request, ~1 req/seg.
 * Con API key: 25 items/request, mayor rate limit.
 *
 * Solo se resuelven CUSIPs que:
 *   - No tienen ticker en el XML
 *   - Son CUSIPs US válidos (9 chars, no '000000000')
 *   - Corresponden a acciones (assetClass: 'Common Stock' en resultado)
 *
 * @param {Array} rawHoldings  — holdings con ticker posiblemente null
 * @returns {Promise<Array>}   — holdings con tickers rellenados donde fue posible
 */
async function resolveTickersViaOpenFIGI(rawHoldings) {
  // Holdings que necesitan resolución: sin ticker, con CUSIP US válido
  const needsResolution = rawHoldings
    .map((h, idx) => ({ h, idx }))
    .filter(({ h }) => !h.ticker && isValidUSCusip(h.cusip));

  if (needsResolution.length === 0) {
    return rawHoldings;
  }

  // Deduplicar CUSIPs (un CUSIP puede aparecer varias veces en el portfolio)
  const uniqueCusips = [...new Set(needsResolution.map(({ h }) => h.cusip))];

  // ── Etapa 1: Caché Firestore ───────────────────────────────────────────────
  const cachedMap = await getCachedCusips(uniqueCusips);
  const stillNeeded = uniqueCusips.filter(c => !cachedMap.has(c));

  // ── Etapa 2: OpenFIGI para CUSIPs no cacheados ────────────────────────────
  const freshMap = new Map();
  if (stillNeeded.length > 0) {
    console.log(`[edgar/openfigi] Resolviendo ${stillNeeded.length} CUSIPs vía OpenFIGI (${cachedMap.size} ya en caché)...`);

    // OpenFIGI: máx 10 items por request sin API key (25 con key)
    const BATCH_SIZE = process.env.OPENFIGI_API_KEY ? 25 : 10;
    for (let i = 0; i < stillNeeded.length; i += BATCH_SIZE) {
      const batch = stillNeeded.slice(i, i + BATCH_SIZE);
      const payload = batch.map(c => ({
        idType:       'ID_CUSIP',
        idValue:      c,
        exchCode:     'US',
        marketSecDes: 'Equity',
      }));

      try {
        const results = await fetchOpenFIGI(payload);
        for (let j = 0; j < batch.length; j++) {
          const cusip  = batch[j];
          const result = results[j];
          if (result?.data?.length > 0) {
            const best = result.data.find(r => r.securityType === 'Common Stock') || result.data[0];
            if (best?.ticker) {
              freshMap.set(cusip, best.ticker.toUpperCase());
            }
          }
        }
        // Pausa entre batches para respetar rate limit (~1 req/seg sin key)
        if (i + BATCH_SIZE < stillNeeded.length) {
          await new Promise(r => setTimeout(r, process.env.OPENFIGI_API_KEY ? 200 : 1100));
        }
      } catch (err) {
        console.warn(`[edgar/openfigi] batch ${Math.floor(i/BATCH_SIZE) + 1} falló: ${err.message} — continuando`);
      }
    }

    // Persistir nuevas resoluciones en Firestore
    if (freshMap.size > 0) {
      await setCachedCusips(freshMap);
    }
    console.log(`[edgar/openfigi] ${freshMap.size}/${stillNeeded.length} CUSIPs nuevos resueltos`);
  }

  // ── Combinar caché + fresh ─────────────────────────────────────────────────
  const allResolved = new Map([...cachedMap, ...freshMap]);

  // Aplicar a los holdings
  const resolved = rawHoldings.map(h => {
    if (h.ticker) return h;
    if (!h.cusip || !allResolved.has(h.cusip)) return h;
    return { ...h, ticker: allResolved.get(h.cusip) };
  });

  const nResolved = resolved.filter((h, i) => !rawHoldings[i].ticker && h.ticker).length;
  console.log(`[edgar/openfigi] Total resueltos: ${nResolved}/${needsResolution.length} (${cachedMap.size} caché + ${freshMap.size} nuevos)`);

  return resolved;
}

/** Verifica si un CUSIP es de acción doméstica US válida */
function isValidUSCusip(cusip) {
  if (!cusip || cusip.length !== 9) return false;
  if (cusip === '000000000') return false;  // cash/collateral placeholder
  if (cusip.startsWith('9')) return false;  // CUSIPs que comienzan con 9 son típicamente bonds/options
  // CUSIPs US válidos comienzan con dígito 0-8
  return /^[0-8][A-Z0-9]{8}$/.test(cusip);
}

/** Llama a OpenFIGI /v3/mapping con un batch de idType/idValue */
async function fetchOpenFIGI(payload) {
  // NOTA: https module eliminado — usamos Web API fetch() para compatibilidad con Vercel Serverless
  const headers = {
    'Content-Type': 'application/json',
  };
  if (process.env.OPENFIGI_API_KEY) {
    headers['X-OPENFIGI-APIKEY'] = process.env.OPENFIGI_API_KEY;
  }

  let res;
  try {
    res = await fetch('https://api.openfigi.com/v3/mapping', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new Error(`OpenFIGI timeout/red: ${err.message}`);
  }

  if (res.status === 429) {
    throw new Error('OpenFIGI rate limit — esperar antes de reintentar');
  }
  if (!res.ok) {
    throw new Error(`OpenFIGI HTTP ${res.status}`);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error(`OpenFIGI parse error: ${e.message}`);
  }
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

// ── Helpers HTTP (Web API fetch — compatible con Vercel Serverless) ───────────
// IMPORTANTE: Se usa fetch() (Web API, Node 18+) en lugar de https.get()
// porque https.get() puede tener comportamiento diferente en el sandbox de Vercel.

const EDGAR_HEADERS = {
  'User-Agent': 'ETHAN-Mercados/2.0 contact@ethan-inversiones.app',
};

async function fetchJson(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: { ...EDGAR_HEADERS, 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new Error(`EDGAR fetchJson timeout/red: ${err.message} (${url})`);
  }
  if (!res.ok) {
    throw new Error(`EDGAR fetchJson HTTP ${res.status} para ${url}`);
  }
  try {
    return await res.json();
  } catch (e) {
    throw new Error(`EDGAR fetchJson parse error: ${e.message}`);
  }
}

async function fetchText(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: { ...EDGAR_HEADERS, 'Accept': 'application/xml, text/html, text/plain' },
      signal: AbortSignal.timeout(20000),
      redirect: 'follow', // fetch() sigue redirects automáticamente
    });
  } catch (err) {
    throw new Error(`EDGAR fetchText timeout/red: ${err.message} (${url})`);
  }
  if (!res.ok) {
    throw new Error(`EDGAR fetchText HTTP ${res.status} para ${url}`);
  }
  return res.text();
}
