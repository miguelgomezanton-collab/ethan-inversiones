// api/etf-holdings.js — Vercel Serverless (función fija)
//
// Endpoint: GET /api/etf-holdings?ticker=XBI
//           GET /api/etf-holdings?ticker=XBI&refresh=1   (fuerza re-descarga)
//           GET /api/etf-holdings?ticker=supported        (lista tickers soportados)
//
// NOTA sobre Vercel Hobby (12 funciones máx):
//   Se usa ruta fija + query param en lugar de ruta dinámica ([ticker].js)
//   para no consumir un slot adicional. El comportamiento es idéntico.
//
// Devuelve los holdings del ETF con metadatos de fuente e integridad.
// Sirve desde caché Firestore (TTL 7 días) o descarga fresca de la gestora.
//
// Respuesta exitosa:
//   { ok: true, ticker, source, sourceUrl, referenceDate, fetchedAt,
//     totalHoldings, cashRows, totalWeight, integrityOk, integrityNote,
//     fromCache, stale, staleWarning?, holdings: [{ticker, name, weight, shares}] }
//
// Respuesta de error:
//   { ok: false, ticker, error, pending? }
// ─────────────────────────────────────────────────────────────────────────────────────

import { getHoldings, getSupportedTickers } from '../server/etf-holdings/fetcher.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido. Use GET.' });
  }

  const rawTicker = req.query.ticker;

  // ── Endpoint de diagnóstico: GET /api/etf-holdings/supported ─────
  if (rawTicker === 'supported') {
    return res.status(200).json({
      ok:       true,
      tickers:  getSupportedTickers(),
    });
  }

  // ── Validar ticker ────────────────────────────────────────────────
  if (!rawTicker || !/^[A-Z0-9]{1,10}$/i.test(rawTicker)) {
    return res.status(400).json({
      ok:    false,
      error: `Ticker inválido: "${rawTicker}". Debe ser alfanumérico, máx. 10 caracteres.`,
    });
  }

  const ticker       = rawTicker.toUpperCase();
  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';

  console.log(`[etf-holdings] GET /${ticker}${forceRefresh ? ' (force refresh)' : ''}`);

  // ── Obtener holdings (caché o descarga) ───────────────────────────
  let result;
  try {
    result = await getHoldings(ticker, forceRefresh);
  } catch (err) {
    console.error(`[etf-holdings] Error inesperado para ${ticker}:`, err);
    return res.status(500).json({
      ok:     false,
      ticker,
      error:  `Error interno: ${err.message}`,
    });
  }

  if (!result.ok) {
    // Ticker pendiente o sin adapter → 404 con mensaje descriptivo
    if (result.pending) {
      return res.status(404).json(result);
    }
    // Error de descarga sin caché → 502
    return res.status(502).json(result);
  }

  // ── Respuesta exitosa ─────────────────────────────────────────────
  // Cache-Control: stale permite al cliente mostrar dato mientras refresca
  const cacheHeader = result.stale
    ? 'public, max-age=0, stale-while-revalidate=3600'
    : 'public, max-age=3600, stale-while-revalidate=86400';

  res.setHeader('Cache-Control', cacheHeader);
  res.setHeader('X-Holdings-Source', result.source || 'unknown');
  res.setHeader('X-Holdings-Date',   result.referenceDate || 'unknown');
  res.setHeader('X-Holdings-Count',  String(result.totalHoldings || 0));
  res.setHeader('X-From-Cache',      result.fromCache ? '1' : '0');
  res.setHeader('X-Stale',           result.stale ? '1' : '0');

  return res.status(200).json(result);
}
