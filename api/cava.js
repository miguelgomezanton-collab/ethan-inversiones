// /api/cava.js — José Luis Cava · Resumen de vídeos via transcripción + Claude
// GET /api/cava → últimos 5 vídeos con tips extraídos de la transcripción

import { YoutubeTranscript } from 'youtube-transcript';

const CHANNEL_ID = 'UCjTfnOFcGW3n3M0WKXpZS0Q'; // @JoseLuisCavatv
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Obtener últimos vídeos via RSS de YouTube
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
    const id      = (/<yt:videoId>([^<]+)/.exec(entry)?.[1] || '').trim();
    const title   = (/<title>([^<]+)/.exec(entry)?.[1] || '').trim();
    const published = (/<published>([^<]+)/.exec(entry)?.[1] || '').slice(0,10);
    const thumb   = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    const url     = `https://www.youtube.com/watch?v=${id}`;
    if (id && title) videos.push({ id, title, published, thumb, url });
  }
  return videos;
}

// Obtener transcripción de un vídeo
async function getTranscript(videoId) {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'es' });
    return segments.map(s => s.text).join(' ').slice(0, 8000); // max 8000 chars
  } catch {
    // Fallback: intentar en inglés
    try {
      const segments = await YoutubeTranscript.fetchTranscript(videoId);
      return segments.map(s => s.text).join(' ').slice(0, 8000);
    } catch(e) {
      return null;
    }
  }
}

// Resumir con Claude
async function summarize(title, transcript) {
  if (!ANTHROPIC_KEY) throw new Error('Sin ANTHROPIC_API_KEY');
  const content = transcript
    ? `Título: ${title}\n\nTranscripción:\n${transcript}`
    : `Título del vídeo de José Luis Cava: ${title}\n\nNo hay transcripción disponible.`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Eres un asistente de trading. Analiza este vídeo de José Luis Cava y extrae exactamente 5 tips o puntos clave de su análisis de mercado.

${content}

Responde SOLO con JSON sin markdown:
{"tips":["tip 1 concreto","tip 2 concreto","tip 3 concreto","tip 4 concreto","tip 5 concreto"],"resumen":"Una frase de resumen general del análisis de Cava en este vídeo"}

Los tips deben ser concretos y accionables — niveles de precio, sectores, tendencias, señales técnicas que menciona Cava.`
      }],
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
  res.setHeader('Cache-Control', 's-maxage=1800'); // cache 30 min

  try {
    const videos = await getLatestVideos(5);
    if (!videos.length) return res.status(200).json({ videos: [], error: 'Sin vídeos' });

    // Procesar los 3 más recientes (los otros 2 solo metadata)
    const results = await Promise.all(videos.map(async (v, i) => {
      if (i >= 3) return { ...v, tips: [], resumen: '' }; // solo metadata
      const transcript = await getTranscript(v.id);
      const summary = await summarize(v.title, transcript).catch(() => ({ tips: [], resumen: '' }));
      return {
        ...v,
        tips:    summary.tips    || [],
        resumen: summary.resumen || '',
        hasTranscript: !!transcript,
      };
    }));

    return res.status(200).json({ videos: results, timestamp: new Date().toISOString() });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
