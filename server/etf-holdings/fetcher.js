// server/etf-holdings/fetcher.js
// Orquestador de fuentes de holdings ETF
//
// Selecciona el adapter correcto según el ticker y gestora,
// delega la descarga, y coordina con el caché Firestore.
//
// GESTORAS SOPORTADAS (fase piloto):
//   SPDR/State Street: XBI, KRE, XOP, XAR, FSTA, XRT, XLK, XLF...
//   First Trust:       CIBR, AIQ, SKYY, JETS, PAVE
//   VanEck:            SMH, GDX, SIL, REMX, XME
//
// PENDIENTE (Condición #9 — KBWB):
//   Invesco: KBWB, KIE — URL bloqueada por proxy; pendiente de resolución por IT
//
// Arquitectura desacoplada: cada gestora tiene su adapter independiente.
// El screener ETHAN no se modifica. Solo se cambia fetchETFHoldings() en el frontend.
// ─────────────────────────────────────────────────────────────────────────────────

import * as spdrAdapter       from './sources/spdr.js';
import * as firstTrustAdapter from './sources/firsttrust.js';
import * as vaneckAdapter     from './sources/vaneck.js';
import { getCached, setCached } from './cache.js';

// Registro de adapters en orden de prioridad de verificación
const ADAPTERS = [
  spdrAdapter,
  firstTrustAdapter,
  vaneckAdapter,
];

// Tickers pendientes (bloqueados/sin implementar)
const PENDING_TICKERS = {
  KBWB: 'Invesco — URL no accesible desde servidor; pendiente resolución por IT',
  KIE:  'Invesco — URL no accesible desde servidor; pendiente resolución por IT',
};

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
 *
 * @param {string} ticker
 * @returns {Promise<HoldingsResult>}
 */
async function downloadFromSource(ticker) {
  // Buscar adapter que soporte este ticker
  const adapter = ADAPTERS.find(a => a.supports(ticker));

  if (!adapter) {
    throw new Error(
      `No hay adapter disponible para ${ticker}. ` +
      `Gestoras implementadas: SPDR/SSGA, First Trust, VanEck. ` +
      `Pendientes: Invesco (KBWB, KIE), iShares, Global X.`
    );
  }

  console.log(`[fetcher] ${ticker}: descargando desde ${adapter.constructor?.name || 'adapter'}`);
  const result = await adapter.fetchHoldings(ticker);

  if (!result || !result.holdings || result.holdings.length === 0) {
    throw new Error(`${ticker}: adapter devolvió 0 holdings`);
  }

  return result;
}

/**
 * Extrae los campos públicos para la respuesta al cliente.
 * No expone datos internos del adapter.
 */
function extractPublicFields(data) {
  return {
    source:        data.source,
    sourceUrl:     data.sourceUrl,
    referenceDate: data.referenceDate,
    fetchedAt:     data.fetchedAt,
    totalHoldings: data.totalHoldings,
    cashRows:      data.cashRows,
    totalWeight:   data.totalWeight,
    integrityOk:   data.integrityOk,
    integrityNote: data.integrityNote,
    holdings:      data.holdings,
  };
}

/**
 * Lista los tickers soportados por los adapters actuales.
 * Útil para diagnóstico.
 */
export function getSupportedTickers() {
  const supported = [];
  const tickers = [
    // SPDR
    'XBI', 'KRE', 'XOP', 'XAR', 'FSTA', 'XRT',
    'XLK', 'XLF', 'XLV', 'XLE', 'XLY', 'XLP', 'XLI', 'XLB', 'XLU', 'XLRE', 'XLC',
    // First Trust
    'CIBR', 'AIQ', 'SKYY', 'JETS', 'PAVE',
    // VanEck
    'SMH', 'GDX', 'SIL', 'REMX', 'XME', 'GDXJ',
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
