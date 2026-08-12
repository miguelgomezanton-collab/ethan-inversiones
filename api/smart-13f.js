// /api/smart-13f.js — 13F Tracker via SEC EDGAR
// GET /api/smart-13f?fund=berkshire  → posiciones del fondo
// GET /api/smart-13f?ticker=AAPL    → qué fondos tienen este ticker
// GET /api/smart-13f                 → lista de fondos

const FUNDS = {
  berkshire:  { name:'Berkshire Hathaway',    manager:'Warren Buffett', cik:'1067983', style:'Value concentrado',    color:'#40d9c0' },
  bridgewater:{ name:'Bridgewater Associates', manager:'Ray Dalio',     cik:'1350694', style:'Macro global',         color:'#5fa8e0' },
  pershing:   { name:'Pershing Square',        manager:'Bill Ackman',   cik:'1336528', style:'Activista concentrado',color:'#a78bfa' },
  thirdpoint: { name:'Third Point',            manager:'Dan Loeb',      cik:'1040273', style:'Activista tech',        color:'#fbbf24' },
  scion:      { name:'Scion Asset Mgmt',       manager:'Michael Burry', cik:'1649339', style:'Contrarian extremo',   color:'#f47174' },
  baupost:    { name:'Baupost Group',           manager:'Seth Klarman',  cik:'1061768', style:'Value profundo',       color:'#4ade80' },
  fidelity:   { name:'Fidelity (FMR LLC)',      manager:'Will Danoff',   cik:'315066',  style:'Growth americano',     color:'#fb923c' },
};

async function getLatest13F(cik) {
  const paddedCik = cik.padStart(10, '0');
  const subUrl = `https://data.sec.gov/submissions/CIK${paddedCik}.json`;

  const r = await fetch(subUrl, {
    headers: { 'User-Agent': 'ETHAN-Mercados admin@ethan-inversiones.vercel.app' },
    signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 15000); return c.signal; })()
  });
  if (!r.ok) throw new Error(`EDGAR: ${r.status}`);
  const data = await r.json();

  const filings = data.filings?.recent;
  if (!filings) throw new Error('Sin filings EDGAR');

  // Buscar el último 13F-HR
  const idx = filings.form.findIndex(f => f === '13F-HR');
  if (idx === -1) throw new Error('Sin 13F-HR disponible');

  const accNum  = filings.accessionNumber[idx].replace(/-/g, '');
  const period  = filings.reportDate?.[idx] || '';
  const filed   = filings.filingDate[idx] || '';

  // Obtener el índice del filing para encontrar infotable
  const idxUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accNum}/${accNum}-index.json`;
  let infotableFile = 'infotable.xml';

  try {
    const ir = await fetch(idxUrl, {
      headers: { 'User-Agent': 'ETHAN-Mercados admin@ethan-inversiones.vercel.app' },
      signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 8000); return c.signal; })()
    });
    if (ir.ok) {
      const idxData = await ir.json();
      const items = idxData.directory?.item || [];
      const found = items.find(f =>
        f.name?.toLowerCase().includes('infotable') ||
        f.name?.toLowerCase().includes('information')
      );
      if (found) infotableFile = found.name;
    }
  } catch {}

  const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accNum}/${infotableFile}`;
  const xr = await fetch(xmlUrl, {
    headers: { 'User-Agent': 'ETHAN-Mercados admin@ethan-inversiones.vercel.app' },
    signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 15000); return c.signal; })()
  });
  if (!xr.ok) throw new Error(`Holdings XML: ${xr.status}`);
  const xml = await xr.text();

  // Parsear holdings
  const holdings = [];
  const rowRegex = /<infoTable>([\s\S]*?)<\/infoTable>/gi;
  let m;
  while ((m = rowRegex.exec(xml)) !== null) {
    const row = m[1];
    const get = tag => new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i').exec(row)?.[1]?.trim() || '';
    const name   = get('nameOfIssuer');
    const value  = parseInt(get('value')) || 0;
    const shares = parseInt(get('sshPrnamt')) || 0;
    if (name && value > 0) holdings.push({ name, value: value * 1000, shares });
  }

  holdings.sort((a, b) => b.value - a.value);
  const total = holdings.reduce((s, h) => s + h.value, 0);
  const top15 = holdings.slice(0, 15).map(h => ({
    ...h,
    pct: total > 0 ? parseFloat((h.value / total * 100).toFixed(1)) : 0
  }));

  return { period, filed, holdings: top15, totalPositions: holdings.length, totalValue: total };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const { fund, ticker } = req.query;

  try {
    if (fund) {
      const f = FUNDS[fund.toLowerCase()];
      if (!f) return res.status(400).json({ error: `Fondo '${fund}' no reconocido` });
      const data = await getLatest13F(f.cik);
      return res.status(200).json({ fund: f, ...data });

    } else if (ticker) {
      const results = [];
      const t = ticker.toUpperCase();
      await Promise.all(Object.entries(FUNDS).map(async ([key, f]) => {
        try {
          const data = await getLatest13F(f.cik);
          const pos = data.holdings.find(h => {
            const n = h.name.toUpperCase();
            return n.startsWith(t) || n.includes(' ' + t + ' ') || n.includes(' ' + t);
          });
          if (pos) results.push({ key, fund: f, position: pos, period: data.period });
        } catch {}
      }));
      results.sort((a, b) => b.position.value - a.position.value);
      return res.status(200).json({ ticker: t, funds: results });

    } else {
      return res.status(200).json({
        funds: Object.entries(FUNDS).map(([key, f]) => ({ key, ...f }))
      });
    }
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
