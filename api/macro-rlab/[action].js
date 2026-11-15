// api/macro-rlab/[action].js — Vercel Serverless (función dinámica única)
//
// Dispatcher para todos los endpoints de Macro R-LAB.
// Una sola función Vercel → no consume slots adicionales del plan Hobby.
//
// URLs públicas mantenidas:
//   GET  /api/macro-rlab/data
//   GET|POST|PUT|DELETE /api/macro-rlab/research
//   POST /api/macro-rlab/execute
//   GET  /api/macro-rlab/results
//   POST /api/macro-rlab/close
//   GET  /api/macro-rlab/etf-holdings?ticker=XBI[&refresh=1]
//
// La lógica vive en server/macro-rlab/*.js (fuera de /api para que Vercel
// no los cuente como funciones adicionales).
// ─────────────────────────────────────────────────────────────────────────────

// Importaciones estáticas: Vercel las bundlea en el momento del deploy.
// Las rutas son relativas al fichero [action].js dentro de api/macro-rlab/.
import dataHandler        from '../../server/macro-rlab/data.js';
import researchHandler    from '../../server/macro-rlab/research.js';
import executeHandler     from '../../server/macro-rlab/execute.js';
import resultsHandler     from '../../server/macro-rlab/results.js';
import closeHandler       from '../../server/macro-rlab/close.js';
import etfHoldingsHandler from '../../server/etf-holdings/handler.js';

// Métodos HTTP permitidos por acción
const ALLOWED_METHODS = {
  data:            ['GET'],
  research:        ['GET', 'POST', 'PUT', 'DELETE'],
  execute:         ['POST'],
  results:         ['GET'],
  close:           ['POST'],
  'etf-holdings':  ['GET'],
};

const HANDLERS = {
  data:            dataHandler,
  research:        researchHandler,
  execute:         executeHandler,
  results:         resultsHandler,
  close:           closeHandler,
  'etf-holdings':  etfHoldingsHandler,
};

export default async function handler(req, res) {
  // CORS global
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;

  // edgar-ping: diagnóstico de acceso a sec.gov y api.openfigi.com desde Vercel
  if (action === 'edgar-ping') {
    const results = {};
    // Test sec.gov
    try {
      const r = await fetch('https://www.sec.gov/robots.txt', {
        headers: { 'User-Agent': 'ETHAN-Mercados/2.0 contact@ethan-inversiones.app' },
        signal: AbortSignal.timeout(10000),
      });
      const body = await r.text();
      results.edgar = { ok: true, status: r.status, bodyLength: body.length };
    } catch (err) {
      results.edgar = { ok: false, error: err.message };
    }
    // Test api.openfigi.com
    try {
      const r = await fetch('https://api.openfigi.com/v3/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ idType: 'ID_CUSIP', idValue: '17275R102', exchCode: 'US', marketSecDes: 'Equity' }]),
        signal: AbortSignal.timeout(10000),
      });
      const data = await r.json();
      const ticker = data?.[0]?.data?.[0]?.ticker || null;
      results.openfigi = { ok: r.ok, status: r.status, ticker, testCusip: '17275R102 (Cisco)' };
    } catch (err) {
      results.openfigi = { ok: false, error: err.message };
    }
    return res.status(200).json(results);
  }

  // 1. Acción desconocida → 404
  if (!action || !HANDLERS[action]) {
    return res.status(404).json({
      error: `Acción desconocida: '${action}'`,
      available: Object.keys(HANDLERS),
    });
  }

  // 2. Método no permitido → 405
  const allowed = ALLOWED_METHODS[action];
  if (!allowed.includes(req.method)) {
    res.setHeader('Allow', allowed.join(', '));
    return res.status(405).json({
      error: `Método ${req.method} no permitido para '${action}'`,
      allowed,
    });
  }

  // 3. Delegar al handler correspondiente
  try {
    return await HANDLERS[action](req, res);
  } catch (err) {
    // Captura de último recurso: el handler interno ya debería gestionar sus errores
    console.error(`[macro-rlab/${action}] Error no capturado:`, err);
    return res.status(500).json({ error: err.message ?? 'Error interno' });
  }
}
