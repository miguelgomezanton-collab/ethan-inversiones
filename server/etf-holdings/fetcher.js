// server/etf-holdings/fetcher.js
// Orquestador de fuentes de holdings ETF
//
// Selecciona el adapter correcto según el ticker y gestora,
// delega la descarga, y coordina con el caché Firestore.
//
// GESTORAS SOPORTADAS (fase 2 — 63 subsectores):
//   SPDR/State Street: XBI, KRE, XOP, XAR, FSTA, XRT + 11 sectores
//   First Trust:       CIBR, AIQ, SKYY, JETS, PAVE, FDN, AIRR, FIW, FCG, GRID, CARZ
//   VanEck (genuinos): GDX, GDXJ, OIH, SLX, MOO, BIZD
//                      REMX, NLR, ESPO → VanEck primario + EDGAR fallback automático
//   iShares:           SOXX, IGV, IBB, IHE, IHI, IHF, ITA, IYT, ITB, IYG, IYZ, REET, REM, ICLN + piloto
//   Global X:          BOTZ, FINX, LIT, SOCL, URA, DTCR
//                      SIL, COPX → movidos a edgar.js (eran Global X, no VanEck)
//   ARK Invest:        ARKG
//   Vanguard:          VNQ
//   SEC EDGAR NPORT-P: KBWB, KIE, KCE, TAN, PHO, PEJ, PSP, PBS, PBJ, AMLP, IBUY, QTUM
//                      + XME (SPDR), SIL, COPX (Global X), GUNR (FlexShares)
//                      + REMX, NLR, ESPO (VanEck, fallback)
//                      (Prioridad 3 — datos regulatorios, 30-60 días de retraso)
//
// PENDIENTE: ninguno — cobertura completa 63/63
//
// Arquitectura desacoplada: cada gestora tiene su adapter independiente.
// El screener ETHAN no se modifica. Solo se cambia fetchETFHoldings() en el frontend.
// ─────────────────────────────────────────────────────────────────────────────────

import * as spdrAdapter       from './sources/spdr.js';
import * as firstTrustAdapter from './sources/firsttrust.js';
import * as vaneckAdapter     from './sources/vaneck.js';
import * as iSharesAdapter    from './sources/ishares.js';
import * as globalxAdapter    from './sources/globalx.js';
import * as arkAdapter        from './sources/ark.js';
import * as vanguardAdapter   from './sources/vanguard.js';
import * as edgarAdapter      from './sources/edgar.js';
import { getCached, setCached } from './cache.js';

// Registro de adapters en orden de prioridad de verificación
// EDGAR va al final (Prioridad 3 — fallback regulatorio)
const ADAPTERS = [
  spdrAdapter,
  firstTrustAdapter,
  vaneckAdapter,
  iSharesAdapter,
  globalxAdapter,
  arkAdapter,
  vanguardAdapter,
  edgarAdapter,       // Prioridad 3: SEC EDGAR NPORT-P (datos históricos, 30-60 días retraso)
];

// Tickers pendientes (bloqueados/sin implementar)
// NOTA: KBWB, KIE, KCE, TAN, PHO, PEJ, PSP, PBS, PBJ, AMLP, IBUY, QTUM
//       ahora están cubiertos por el adaptador SEC EDGAR NPORT-P (edgarAdapter).
//       Este mapa solo contiene tickers genuinamente sin cobertura.
const PENDING_TICKERS = {};

/**
 * Obtiene los holdings de un ETF.
 * Prioridad: caché Firestore → adapter oficial
 *
 * @param {string} ticker         — Ticker del ETF
 * @param {boolean} forceRefresh  — Ignorar caché y forzar descarga fresca
 * @returns {Promise<HoldingsResponse>}
 */
export async function getHoldings(ticker, forceRefresh = false) {
  const t = ticker.toUpperCase();

  // ── Comprobar si el ticker está pendiente de integración ──────────
  if (PENDING_TICKERS[t]) {
    return {
      ok:      false,
      ticker:  t,
      error:   `Holdings no disponibles: ${PENDING_TICKERS[t]}`,
      pending: true,
    };
  }

  // ── Comprobar caché Firestore ─────────────────────────────────────
  if (!forceRefresh) {
    const cached = await getCached(t);
    if (cached && !cached.stale) {
      console.log(`[fetcher] ${t}: sirviendo desde caché (${cached.referenceDate})`);
      return {
        ok:        true,
        ticker:    t,
        fromCache: true,
        stale:     false,
        ...extractPublicFields(cached),
      };
    }

    // Caché expirado: servirlo con advertencia mientras se refresca
    if (cached && cached.stale) {
      console.log(`[fetcher] ${t}: caché expirado (${cached.referenceDate}), intentando refrescar`);
      // Intentar descarga fresca; si falla, devolver caché stale
      try {
        const fresh = await downloadFromSource(t);
        await setCached(t, fresh);
        return {
          ok:        true,
          ticker:    t,
          fromCache: false,
          stale:     false,
          ...extractPublicFields(fresh),
        };
      } catch (freshErr) {
        console.warn(`[fetcher] ${t}: fallo al refrescar, sirviendo caché stale. Error: ${freshErr.message}`);
        return {
          ok:        true,
          ticker:    t,
          fromCache: true,
          stale:     true,
          staleWarning: `Datos de ${cached.referenceDate} — actualización fallida: ${freshErr.message}`,
          ...extractPublicFields(cached),
        };
      }
    }
  }

  // ── Sin caché o forceRefresh: descargar desde fuente ─────────────
  try {
    const result = await downloadFromSource(t);
    await setCached(t, result);
    return {
      ok:        true,
      ticker:    t,
      fromCache: false,
      stale:     false,
      ...extractPublicFields(result),
    };
  } catch (err) {
    // ── Fallback: devolver caché expirado si existe ───────────────
    const cached = await getCached(t);
    if (cached) {
      console.warn(`[fetcher] ${t}: fallo descarga, devolviendo caché stale (${cached.referenceDate}). Error: ${err.message}`);
      return {
        ok:          true,
        ticker:      t,
        fromCache:   true,
        stale:       true,
        staleWarning: `Datos de ${cached.referenceDate} — última descarga fallida: ${err.message}`,
        ...extractPublicFields(cached),
      };
    }

    // Sin caché y sin descarga → error
    return {
      ok:     false,
      ticker: t,
      error:  err.message,
    };
  }
}

/**
 * Descarga los holdings desde la fuente oficial del ETF.
 * Selecciona el adapter correcto por ticker.
 * Calcula integrityOk/integrityNote aquí para que estén disponibles
 * tanto en respuestas fresh como en las cacheadas.
 *
 * @param {string} ticker
 * @returns {Promise<HoldingsResult>}
 */
// Tickers que tienen VanEck como fuente primaria pero EDGAR como fallback
// cuando vaneck.com devuelve HTTP 502 (bloqueado desde IPs de datacenter de Vercel)
const VANECK_WITH_EDGAR_FALLBACK = new Set(['REMX', 'NLR', 'ESPO']);

async function downloadFromSource(ticker) {
  // Buscar adapter que soporte este ticker
  const adapter = ADAPTERS.find(a => a.supports(ticker));

  if (!adapter) {
    throw new Error(
      `No hay adapter disponible para ${ticker}. ` +
      `Gestoras implementadas: SPDR/SSGA, First Trust, VanEck, iShares, Global X, ARK Invest, Vanguard, SEC EDGAR.`
    );
  }

  // ── Intentar fuente primaria ──────────────────────────────────────
  let primaryError = null;
  try {
    console.log(`[fetcher] ${ticker}: descargando desde fuente primaria`);
    const raw = await adapter.fetchHoldings(ticker);
    if (raw && raw.holdings && raw.holdings.length > 0) {
      return await _finalizeResult(raw, ticker);
    }
    primaryError = new Error(`${ticker}: fuente primaria devolvió 0 holdings`);
  } catch (err) {
    primaryError = err;
  }

  // ── Fallback EDGAR para REMX, NLR, ESPO cuando VanEck falla ──────
  if (VANECK_WITH_EDGAR_FALLBACK.has(ticker) && edgarAdapter.supports(ticker)) {
    console.warn(`[fetcher] ${ticker}: fuente primaria VanEck falló (${primaryError.message}), intentando EDGAR NPORT-P como fallback`);
    try {
      const edgarRaw = await edgarAdapter.fetchHoldings(ticker);
      if (edgarRaw && edgarRaw.holdings && edgarRaw.holdings.length > 0) {
        console.log(`[fetcher] ${ticker}: EDGAR fallback exitoso (${edgarRaw.totalHoldings} holdings, fecha: ${edgarRaw.referenceDate})`);
        const edgarFinal = await _finalizeResult(edgarRaw, ticker);
        return {
          ...edgarFinal,
          dataAgeWarning: `Fuente primaria VanEck no disponible. Datos EDGAR NPORT-P de ${edgarRaw.referenceDate} (retraso 30-60 días).`,
        };
      }
    } catch (edgarErr) {
      console.error(`[fetcher] ${ticker}: EDGAR fallback también falló: ${edgarErr.message}`);
      throw new Error(`${ticker}: VanEck falló (${primaryError.message}) y EDGAR fallback falló (${edgarErr.message})`);
    }
  }

  // Si llegamos aquí, la fuente primaria falló y no hay fallback disponible
  throw primaryError;
}

/**
 * Calcula los campos de integridad y retorna el resultado final.
 * Factorizado para evitar duplicación entre la ruta primaria y el fallback EDGAR.
 * @internal Solo se usa dentro de downloadFromSource
 */
async function _finalizeResult(result, ticker) {
  if (!result || !result.holdings || result.holdings.length === 0) {
    throw new Error(`${ticker}: adapter devolvió 0 holdings`);
  }

  // ── Calcular integridad aquí para que extractPublicFields() siempre lo tenga ──
  const tw = result.totalWeight ?? 0;
  const integrityOk   = tw > 80;
  const integrityNote = buildIntegrityNoteInline(
    result.totalHoldings ?? result.holdings.length,
    result.cashRows ?? 0,
    tw,
    result.source ?? 'unknown'
  );

  return { ...result, integrityOk, integrityNote };
}

/** Calcula la nota de integridad sin depender de cache.js */
function buildIntegrityNoteInline(totalHoldings, cashRows, totalWeight, source) {
  const parts = [`${totalHoldings} posiciones accionarias`];
  if (cashRows > 0) {
    parts.push(`${cashRows} posición${cashRows > 1 ? 'es' : ''} no-accionaria${cashRows > 1 ? 's' : ''} excluida${cashRows > 1 ? 's' : ''} (cash/collateral)`);
  }
  parts.push(`peso total: ${totalWeight.toFixed(1)}%`);
  parts.push(`fuente: ${source}`);
  if (totalWeight < 95) {
    parts.push(`⚠️ peso <95% — posible liquidez retenida o posiciones con peso <0.01%`);
  }
  if (totalWeight > 100.5) {
    parts.push(`⚠️ peso >100% — posible solapamiento en la fuente`);
  }
  return parts.join(' · ');
}

/**
 * Extrae los campos públicos para la respuesta al cliente.
 * Siempre recalcula integrityOk/integrityNote para garantizar
 * que valores stale del caché (calculados antes de fixes) se
 * corrijan automáticamente sin necesidad de invalidar el caché.
 */
function extractPublicFields(data) {
  const tw = data.totalWeight ?? 0;
  // Recalcular siempre para corregir valores stale del caché
  const integrityOk   = tw > 80;
  const integrityNote = data.integrityNote
    || buildIntegrityNoteInline(
         data.totalHoldings ?? (data.holdings?.length ?? 0),
         data.cashRows ?? 0,
         tw,
         data.source ?? 'unknown'
       );

  return {
    source:              data.source,
    sourceUrl:           data.sourceUrl,
    referenceDate:       data.referenceDate,
    fetchedAt:           data.fetchedAt,
    totalHoldings:       data.totalHoldings,
    resolvedHoldings:    data.resolvedHoldings,     // con ticker → analizables por ETHAN
    unresolvedHoldings:  data.unresolvedHoldings,   // sin ticker → pendientes (internacionales/bonds)
    cashRows:            data.cashRows,
    totalWeight:         data.totalWeight,
    integrityOk,
    integrityNote,
    holdings:            data.holdings,
  };
}

/**
 * Lista los tickers soportados por los adapters actuales.
 * Útil para diagnóstico.
 */
export function getSupportedTickers() {
  const supported = [];
  const tickers = [
    // SPDR/State Street
    'XBI', 'KRE', 'XOP', 'XAR', 'FSTA', 'XRT',
    'XLK', 'XLF', 'XLV', 'XLE', 'XLY', 'XLP', 'XLI', 'XLB', 'XLU', 'XLRE', 'XLC',
    // First Trust
    'CIBR', 'AIQ', 'SKYY', 'JETS', 'PAVE', 'FDN', 'AIRR', 'FIW', 'FCG', 'GRID',
    // VanEck
    'GDX', 'SIL', 'REMX', 'XME', 'GDXJ', 'OIH', 'SLX', 'COPX', 'NLR', 'MOO', 'ESPO', 'GUNR', 'BIZD',
    // iShares
    'SOXX', 'IWM', 'IJR', 'IJH', 'EFA', 'EEM', 'HYG', 'LQD',
    'IGV', 'IBB', 'IHE', 'IHI', 'IHF', 'ITA', 'IYT', 'ITB', 'IYG', 'IYZ', 'REET', 'REM', 'ICLN',
    // Global X
    'BOTZ', 'FINX', 'LIT', 'SOCL', 'URA', 'DTCR',
    // ARK Invest
    'ARKG', 'CARZ',
    // Vanguard
    'VNQ',
    // Pendientes
    ...Object.keys(PENDING_TICKERS),
  ];

  for (const t of tickers) {
    const adapter = ADAPTERS.find(a => a.supports(t));
    supported.push({
      ticker: t,
      status: PENDING_TICKERS[t] ? 'pending' : adapter ? 'supported' : 'unknown',
      note:   PENDING_TICKERS[t] || null,
    });
  }

  return supported;
}
