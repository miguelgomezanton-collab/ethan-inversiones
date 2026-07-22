// /api/smart-money.js
// Insider Trading (SEC EDGAR) + Short Interest + Institutional (Yahoo)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const T = ticker.toUpperCase();
  const results = { insiders: [], shortInterest: null, institutional: null, errors: [] };

  // ── 1. SHORT INTEREST + INSTITUTIONAL — Yahoo Finance ──────────
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${T}?modules=defaultKeyStatistics,majorHoldersBreakdown,institutionOwnership`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) }
    );
    if (r.ok) {
      const data = await r.json();
      const result = data?.quoteSummary?.result?.[0];
      const stats  = result?.defaultKeyStatistics;
      const holders = result?.majorHoldersBreakdown;
      const instOwn = result?.institutionOwnership;

      if (stats) {
        results.shortInterest = {
          date:        'Yahoo Finance',
          shortFloat:  stats.shortPercentOfFloat?.raw ?? null,
          daysTocover: stats.shortRatio?.raw ?? null,
          shortVolume: stats.sharesShort?.raw ?? null,
          sharesOut:   stats.sharesOutstanding?.raw ?? null,
        };
      }
      if (holders) {
        results.institutional = {
          pctInsiders:     holders.insidersPercentHeld?.raw ?? null,
          pctInstitutions: holders.institutionsPercentHeld?.raw ?? null,
          topHolders: (instOwn?.ownershipList || []).slice(0,5).map(h => ({
            name:   h.organization,
            pct:    h.pctHeld?.raw ?? null,
            shares: h.position?.raw ?? null,
            value:  h.value?.raw ?? null,
            change: h.pctChange?.raw ?? null,
          })),
        };
      }
    }
  } catch(e) { results.errors.push('Yahoo: ' + e.message); }

  // ── 2. INSIDER TRADING — SEC EDGAR full-text search ────────────
  try {
    // Buscar filings Form 4 del ticker en SEC EDGAR
    const url = `https://efts.sec.gov/LATEST/search-index?q=%22${T}%22&forms=4&dateRange=custom&startdt=${daysAgo(180)}&enddt=${today()}`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'ETHAN-Research contact@ethan.com',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const data = await r.json();
      const hits = data.hits?.hits || [];
      results.insiders = hits.slice(0, 8).map(h => {
        const s = h._source || {};
        return {
          date:    s.period_of_report || s.file_date || '',
          insider: s.display_names?.[0] || s.entity_name || '—',
          title:   '—',
          type:    '—',
          qty:     null,
          price:   '—',
          value:   '—',
          fileUrl: s.file_date ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4&dateb=&owner=include&count=10&search_text=` : '',
        };
      });
    }
  } catch(e) { results.errors.push('SEC EDGAR search: ' + e.message); }

  // ── 3. INSIDER TRADING — SEC EDGAR por CIK ─────────────────────
  if (results.insiders.length === 0) {
    try {
      // Primero obtener el CIK del ticker
      const cikRes = await fetch(
        `https://www.sec.gov/cgi-bin/browse-edgar?company=&CIK=${T}&type=4&dateb=&owner=include&count=10&search_text=&action=getcompany&output=atom`,
        { headers: { 'User-Agent': 'ETHAN-Research contact@ethan.com' }, signal: AbortSignal.timeout(8000) }
      );
      if (cikRes.ok) {
        const xml = await cikRes.text();
        // Extraer entradas del feed Atom
        const entries = [];
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;
        while ((match = entryRegex.exec(xml)) !== null && entries.length < 6) {
          const entry = match[1];
          const title  = (/<title>([\s\S]*?)<\/title>/.exec(entry)?.[1] || '').replace(/<[^>]+>/g,'').trim();
          const updated= (/<updated>(.*?)<\/updated>/.exec(entry)?.[1] || '').slice(0,10);
          const link   = (/<link[^>]+href="([^"]+)"/.exec(entry)?.[1] || '');
          if (title && updated) entries.push({ date: updated, insider: title, type: 'Form 4', title2: '', qty: null, price: '—', value: '—', fileUrl: link });
        }
        if (entries.length > 0) results.insiders = entries;
      }
    } catch(e) { results.errors.push('SEC CIK: ' + e.message); }
  }

  return res.status(200).json({
    ticker: T,
    timestamp: new Date().toISOString(),
    ...results,
  });
}

function today() { return new Date().toISOString().slice(0,10); }
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate()-n);
  return d.toISOString().slice(0,10);
}
