// /api/smart-money.js — Smart Money via Claude AI + web search
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const T = ticker.toUpperCase();

  const prompt = `Busca datos actuales de Smart Money para la acción ${T}. Necesito exactamente estos datos en JSON:

1. insiders: últimas 5-8 transacciones de insider trading (Form 4 SEC) con: date (YYYY-MM-DD), insider (nombre), title (cargo), type ("Compra" o "Venta"), qty (número de acciones, integer), price (precio por acción como string "$XX.XX"), value (valor total como string "$XXM" o "$XXK")

2. shortInterest: { shortFloat (decimal 0-1, ej 0.035 para 3.5%), daysTocover (número), shortVolume (integer), source: "datos más recientes disponibles" }

3. institutional: { pctInsiders (decimal), pctInstitutions (decimal), topHolders: array de 5 con { name, pct (decimal), shares (integer), change (decimal positivo/negativo) } }

Responde SOLO con JSON válido, sin texto adicional, sin markdown. Formato exacto:
{"insiders":[...],"shortInterest":{...},"institutional":{...}}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: 'API error: ' + err.slice(0,200) });
    }

    const data = await r.json();
    const textBlock = data.content?.find(b => b.type === 'text');
    const raw = textBlock?.text || '{}';

    // Limpiar y parsear JSON
    const clean = raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // Intentar extraer JSON con regex
      const match = clean.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    return res.status(200).json({
      ticker: T,
      timestamp: new Date().toISOString(),
      insiders:     parsed.insiders     || [],
      shortInterest: parsed.shortInterest || null,
      institutional: parsed.institutional || null,
      errors: [],
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
