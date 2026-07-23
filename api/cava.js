// /api/cava.js — José Luis Cava · Resumen de vídeos
// Sin dependencias externas — fetch nativo para transcripción

const CHANNEL_ID = 'UCjTfnOFcGW3n3M0WKXpZS0Q';

async function getLatestVideos(n = 5) {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/xml' },
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`YouTube RSS: ${r.status}`);
  const xml = await r.text();
  const videos = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null && videos.length < n) {
    const entry = m[1];
    const id        = (/<yt:videoId>([^<]+)/.exec(entry)?.[1] || '').trim();
    const title     = (/<title>([^<]+)/.exec(entry)?.[1] || '').trim();
    const published = (/<published>([^<]+)/.exec(entry)?.[1] || '').slice(0,10);
    if (id && title) videos.push({
      id, title, published,
      thumb: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      url:   `https://www.youtube.com/watch?v=${id}`,
    });
  }
  return videos;
}

async function getTranscript(videoId) {
  try {
    // Obtener la página del vídeo para extraer el endpoint de subtítulos
    const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const r = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const html = await r.text();

    // Extraer URL de captions del playerResponse
    const captionsMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
    if (!captionsMatch) return null;

    const tracks = JSON.parse(captionsMatch[1].replace(/\\u0026/g,'&').replace(/\\\\/g,'\\'));
    // Preferir español, luego cualquier idioma
    const track = tracks.find(t => t.languageCode === 'es') ||
                  tracks.find(t => t.languageCode?.startsWith('es')) ||
                  tracks[0];
    if (!track?.baseUrl) return null;

    // Descargar los subtítulos
    const sr = await fetch(track.baseUrl, { signal: AbortSignal.timeout(8000) });
    if (!sr.ok) return null;
    const xml = await sr.text();

    // Parsear XML de subtítulos
    const texts = [];
    const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
    let tm;
    while ((tm = textRegex.exec(xml)) !== null) {
      const text = tm[1]
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&quot;/g,'"').replace(/&#39;/g,"'")
        .replace(/<[^>]+>/g,'').trim();
      if (text) texts.push(text);
    }
    return texts.join(' ').slice(0, 8000);
  } catch { return null; }
}

async function summarize(title, transcript, apiKey) {
  const content = transcript
    ? `Título: ${title}\n\nTranscripción:\n${transcript}`
    : `Título del vídeo de José Luis Cava: "${title}"\n\nNo hay transcripción disponible. Basa el análisis solo en el título.`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: `Eres un asistente de trading. Analiza este contenido de José Luis Cava y extrae 5 tips o puntos clave de su análisis.

${content}

Responde SOLO con JSON sin markdown:
{"tips":["tip 1","tip 2","tip 3","tip 4","tip 5"],"resumen":"Una frase resumen del análisis"}

Tips concretos: niveles de precio, sectores, tendencias, señales técnicas.` }],
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok) throw new Error(`Claude: ${r.status}`);
  const data = await r.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '{}';
  const clean = text.replace(/```json\n?|```\n?/g,'').trim();
  try { return JSON.parse(clean); }
  catch { const m = clean.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {}; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const videos = await getLatestVideos(5);
    if (!videos.length) return res.status(200).json({ videos: [], error: 'Sin vídeos' });

    const results = await Promise.all(videos.map(async (v, i) => {
      if (i >= 3) return { ...v, tips: [], resumen: '', hasTranscript: false };
      const transcript = await getTranscript(v.id);
      if (!apiKey) return { ...v, tips: [], resumen: '', hasTranscript: !!transcript };
      const summary = await summarize(v.title, transcript, apiKey).catch(() => ({ tips: [], resumen: '' }));
      return { ...v, tips: summary.tips || [], resumen: summary.resumen || '', hasTranscript: !!transcript };
    }));

    return res.status(200).json({ videos: results, timestamp: new Date().toISOString() });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
