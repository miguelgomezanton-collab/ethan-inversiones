// /api/smart-13f.js — 13F Tracker via SEC EDGAR
const WORKER = 'https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=';
const UA     = 'ETHAN-Mercados contact@ethan-inversiones.vercel.app';

const FUNDS = {
  berkshire:  { name:'Berkshire Hathaway',     manager:'Warren Buffett', cik:'1067983', style:'Value concentrado',    color:'#40d9c0' },
  bridgewater:{ name:'Bridgewater Associates',  manager:'Ray Dalio',     cik:'1350694', style:'Macro global',         color:'#5fa8e0' },
  pershing:   { name:'Pershing Square',         manager:'Bill Ackman',   cik:'1336528', style:'Activista concentrado',color:'#a78bfa' },
  thirdpoint: { name:'Third Point',             manager:'Dan Loeb',      cik:'1040273', style:'Activista tech',        color:'#fbbf24' },
  scion:      { name:'Scion Asset Mgmt',        manager:'Michael Burry', cik:'1649339', style:'Contrarian extremo',   color:'#f47174' },
  baupost:    { name:'Baupost Group',            manager:'Seth Klarman',  cik:'1061768', style:'Value profundo',       color:'#4ade80' },
  fidelity:   { name:'Fidelity (FMR LLC)',       manager:'Will Danoff',   cik:'315066',  style:'Growth americano',     color:'#fb923c' },
};

async function efetch(url) {
  const headers = { 'User-Agent': UA, 'Accept': '*/*' };
  for (const fn of [u => u, u => WORKER + encodeURIComponent(u)]) {
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(fn(url), { headers, signal: ctrl.signal });
      if (r.ok) return r;
    } catch {}
  }
  throw new Error(`Sin acceso: ${url.slice(-50)}`);
}

async function getLatest13F(cik) {
  const paddedCik = cik.padStart(10, '0');

  // 1. Submissions JSON
  const subR    = await efetch(`https://data.sec.gov/submissions/CIK${paddedCik}.json`);
  const subData = await subR.json();
  const filings = subData.filings?.recent;
  if (!filings) throw new Error('Sin filings');

  const idx = filings.form.findIndex(f => f === '13F-HR');
  if (idx === -1) throw new Error('Sin 13F-HR');

  const accNum   = filings.accessionNumber[idx];
  const accClean = accNum.replace(/-/g, '');
  const period   = filings.reportDate?.[idx] || '';
  const filed    = filings.filingDate[idx]   || '';

  // 2. Leer índice HTML para encontrar nombre exacto del XML
  // Probamos .htm y .html ya que EDGAR usa ambos
  let xmlFile = null;
  for (const idxExt of ['-index.htm', '-index.html']) {
    try {
      const idxUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accClean}/${accNum}${idxExt}`;
      const idxR   = await efetch(idxUrl);
      const html   = await idxR.text();
      // Extraer todos los nombres de .xml que aparezcan en el HTML
      const allXml = [...html.matchAll(/([\w\-\.]+\.xml)/gi)].map(m => m[1]);
      // El archivo de holdings es cualquier .xml que no sea primary_doc
      xmlFile = allXml.find(n =>
        !n.toLowerCase().includes('primary') &&
        !n.toLowerCase().startsWith('xsl') &&
        n.endsWith('.xml')
      );
      if (xmlFile) break;
    } catch {}
  }

  if (!xmlFile) throw new Error('No encontrado XML de holdings en el índice');

  // 3. Descargar XML — para archivos grandes, usar stream parcial o txt completo
  const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accClean}/${xmlFile}`;

  let xml = null;
  try {
    const xr = await efetch(xmlUrl);
    // Leer solo los primeros 500KB para no sobrecargar el worker
    const reader = xr.body?.getReader();
    if (reader) {
      let chunks = '';
      let bytes  = 0;
      while (bytes < 500000) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks += new TextDecoder().decode(value);
        bytes  += value.length;
        // Si ya tenemos bastantes infoTable, parar
        const count = (chunks.match(/<infoTable>/gi) || []).length;
        if (count >= 20) break;
      }
      reader.cancel();
      xml = chunks;
    } else {
      xml = await xr.text();
    }
  } catch {}

  if (!xml?.includes('infoTable')) throw new Error('XML sin datos de holdings');

  // 4. Parsear
  return parseXML(xml, period, filed);
}

function parseXML(xml, period, filed) {
  const holdings = [];
  const rowRegex = /<infoTable>([\s\S]*?)<\/infoTable>/gi;
  let m;
  while ((m = rowRegex.exec(xml)) !== null) {
    const row  = m[1];
    const get  = tag => new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, 'i').exec(row)?.[1]?.trim() || '';
    const name   = get('nameOfIssuer');
    const value  = parseInt(get('value'))    || 0;
    const shares = parseInt(get('sshPrnamt')) || 0;
    if (name && value > 0) holdings.push({ name, value: value * 1000, shares });
  }
  holdings.sort((a, b) => b.value - a.value);
  const total = holdings.reduce((s, h) => s + h.value, 0);
  const top15 = holdings.slice(0, 15).map(h => ({
    ...h, pct: total > 0 ? parseFloat((h.value / total * 100).toFixed(1)) : 0,
  }));
  return { period, filed, holdings: top15, totalPositions: holdings.length, totalValue: total };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=7200');
  const { fund, ticker } = req.query;
  try {
    if (fund) {
      const f = FUNDS[fund.toLowerCase()];
      if (!f) return res.status(400).json({ error: `Fondo '${fund}' no reconocido` });
      const data = await getLatest13F(f.cik);
      return res.status(200).json({ fund: f, ...data });
    } else if (ticker) {
      const t       = ticker.toUpperCase();
      const results = [];
      await Promise.all(Object.entries(FUNDS).map(async ([key, f]) => {
        try {
          const data = await getLatest13F(f.cik);
          const pos  = data.holdings.find(h => {
            const n = h.name.toUpperCase();
            return n === t || n.startsWith(t + ' ') || n.startsWith(t + ',') ||
                   n.includes(' ' + t + ' ') || n.endsWith(' ' + t);
          });
          if (pos) results.push({ key, fund: f, position: pos, period: data.period });
        } catch {}
      }));
      results.sort((a, b) => b.position.value - a.position.value);
      return res.status(200).json({ ticker: t, funds: results });
    } else {
      return res.status(200).json({ funds: Object.entries(FUNDS).map(([key, f]) => ({ key, ...f })) });
    }
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
