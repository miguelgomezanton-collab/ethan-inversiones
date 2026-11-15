// Endpoint de diagnóstico temporal para verificar acceso a sec.gov desde Vercel
// NO usar en producción

export default async function handler(req, res) {
  const url = 'https://www.sec.gov/robots.txt';
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ETHAN-Mercados/2.0 contact@ethan-inversiones.app' },
      signal: AbortSignal.timeout(10000),
    });
    
    const body = await response.text();
    return res.status(200).json({
      ok: true,
      status: response.status,
      bodyLength: body.length,
      bodyFirst100: body.substring(0, 100),
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      error: err.message,
      type: err.constructor.name,
    });
  }
}
