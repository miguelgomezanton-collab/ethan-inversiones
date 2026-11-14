// server/etf-holdings/cache.js
// Capa de caché Firestore para holdings de ETF
//
// Colección: etf_holdings_cache
// Documento: {ticker}  (ej. "XBI", "CIBR", "SMH", "GDX")
//
// Campos almacenados (Condición #6):
//   ticker         — Ticker del ETF
//   source         — Nombre de la gestora (ej. "SPDR/SSGA")
//   sourceUrl      — URL de la fuente oficial
//   referenceDate  — Fecha a la que corresponden los datos (ISO 8601)
//   downloadedAt   — Timestamp de la descarga (Firestore ServerTimestamp)
//   fetchedAt      — Timestamp numérico Unix ms (para TTL client-side)
//   totalHoldings  — Nº de posiciones accionarias
//   cashRows       — Nº de posiciones no-accionarias detectadas (excluidas)
//   totalWeight    — Suma de pesos de posiciones incluidas
//   integrityOk    — boolean: pesos suman >80% (heurística de integridad)
//   integrityNote  — Nota de integridad (ej. "43/45 posiciones, peso 97.3%")
//   holdings       — Array de { ticker, name, weight, shares, originalTicker? }
//   stale          — true si los datos superan el TTL (añadido al leer, no persisted)
//
// TTL: 7 días (Condición #6, mismo que TTL anterior en frontend)
// Al expirar: se preserva la última composición válida + se añade advertencia stale
// ─────────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';

const COL_CACHE = 'etf_holdings_cache';
const TTL_MS    = 7 * 24 * 60 * 60 * 1000; // 7 días

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
 * Lee el caché de Firestore para un ticker.
 * Devuelve null si no existe.
 * El campo `stale` se calcula dinámicamente al leer.
 *
 * @param {string} ticker
 * @returns {Promise<CachedHoldings|null>}
 */
export async function getCached(ticker) {
  try {
    const db  = getDB();
    const doc = await db.collection(COL_CACHE).doc(ticker.toUpperCase()).get();
    if (!doc.exists) return null;

    const data = doc.data();
    const stale = (Date.now() - (data.fetchedAt || 0)) > TTL_MS;

    return {
      ...data,
      stale,
    };
  } catch (err) {
    console.error(`[cache] Error leyendo caché para ${ticker}:`, err.message);
    return null;
  }
}

/**
 * Guarda los holdings en Firestore.
 * Calcula y persiste metadatos de integridad.
 *
 * @param {string} ticker
 * @param {object} holdingsResult  — Objeto devuelto por los adapters
 * @returns {Promise<void>}
 */
export async function setCached(ticker, holdingsResult) {
  const {
    source, sourceUrl, referenceDate,
    totalHoldings, cashRows, totalWeight, holdings,
  } = holdingsResult;

  // Calcular integridad (Condición #7)
  const integrityOk   = totalWeight > 80; // composición accionaria >80% indica datos completos
  const integrityNote = buildIntegrityNote(totalHoldings, cashRows, totalWeight, source);

  const doc = {
    ticker:        ticker.toUpperCase(),
    source,
    sourceUrl,
    referenceDate,
    downloadedAt:  FieldValue.serverTimestamp(),
    fetchedAt:     Date.now(),
    totalHoldings,
    cashRows,
    totalWeight,
    integrityOk,
    integrityNote,
    holdings,
  };

  try {
    const db = getDB();
    await db.collection(COL_CACHE).doc(ticker.toUpperCase()).set(doc);
    console.log(`[cache] Guardado ${ticker}: ${totalHoldings} posiciones, peso ${totalWeight.toFixed(1)}%, integridad: ${integrityOk ? 'OK' : 'WARN'}`);
  } catch (err) {
    // No relanzar — el caché es best-effort. El endpoint puede devolver datos aunque no persistan.
    console.error(`[cache] Error guardando caché para ${ticker}:`, err.message);
  }
}

/**
 * Construye la nota de integridad para mostrar en la UI.
 * Incluye información sobre posiciones excluidas (cash/non-equity).
 */
function buildIntegrityNote(totalHoldings, cashRows, totalWeight, source) {
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
 * Elimina el caché de un ticker (útil para forzar refetch).
 */
export async function clearCached(ticker) {
  try {
    const db = getDB();
    await db.collection(COL_CACHE).doc(ticker.toUpperCase()).delete();
    console.log(`[cache] Eliminado caché de ${ticker}`);
  } catch (err) {
    console.error(`[cache] Error eliminando caché para ${ticker}:`, err.message);
  }
}
