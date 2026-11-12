// server/etf-holdings/handler.js — Handler Vercel para ETF Holdings
//
// Integrado en api/macro-rlab/[action].js como acción "etf-holdings".
// URL pública: GET /api/macro-rlab/etf-holdings?ticker=XBI
//              GET /api/macro-rlab/etf-holdings?ticker=XBI&refresh=1
//              GET /api/macro-rlab/etf-holdings?ticker=supported
//
// Separado de la lógica de caché/descarga (fetcher.js) para mantener
// la arquitectura desacoplada. Este fichero solo gestiona HTTP.
// ─────────────────────────────────────────────────────────────────────────────

import { getHoldings, getSupportedTickers } from './fetcher.js';

export default async function etfHoldingsHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido. Use GET.' });
  }

  const rawTicker = req.query.ticker;

  // ── Endpoint de diagnóstico: GET ?ticker=supported ────────────────
  if (rawTicker === 'supported') {
    return res.status(200).json({
      ok:      true,
      tickers: getSupportedTickers(),
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
