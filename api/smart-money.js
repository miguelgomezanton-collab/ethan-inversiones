// /api/smart-money.js — Smart Money Intelligence
// Insider trading (SEC EDGAR Form 4) + Short Interest (FINRA) + Institutional ownership
// GET /api/smart-money?ticker=AAPL

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const results = {};
  const errors = [];

  // ── 1. INSIDER TRADING — SEC EDGAR Form 4 ──────────────────────
  try {
    // Buscar CIK del ticker en SEC EDGAR
    const searchUrl = `https://efts.sec.gov/LATEST/search-index?q=%22${ticker}%22&dateRange=custom&startdt=${getDateDaysAgo(180)}&enddt=${getDateToday()}&forms=4`;
    const r = await fetch(searchUrl, {
      headers: { 'User-Agent': 'ETHAN-Mercados research@ethan.com', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const data = await r.json();
      const hits = data.hits?.hits || [];
      const insiders = hits.slice(0, 10).map(h => {
        const src = h._source || {};
        return {
          date: src.period_of_report || src.file_date || '',
          filer: src.display_names?.[0] || src.entity_name || 'Unknown',
          type: src.form_type || 'Form 4',
          description: src.file_date || '',
        };
      });
      results.insiders = insiders;
    }
  } catch(e) { errors.push('Insiders: ' + e.message); results.insiders = []; }

  // ── 2. INSIDER TRADING — OpenInsider (más fiable) ──────────────
  try {
    const url = `https://openinsider.com/screener?s=${ticker}&fd=180&td=0&tc=1&isoDateFrom=&isoDateTo=&ownerName=&type=4&action=submit&submit=+Screener+`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research bot)' },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const html = await r.text();
      // Parse tabla de transacciones
      const rows = [];
      const trRegex = /<tr[^>]*class="[^"]*(?:odd|even)[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
      let match;
      while ((match = trRegex.exec(html)) !== null && rows.length < 8) {
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells = [];
        let td;
        while ((td = tdRegex.exec(match[1])) !== null) {
          cells.push(td[1].replace(/<[^>]+>/g, '').trim());
        }
        if (cells.length >= 10) {
          const qty = parseInt(cells[7]?.replace(/[^0-9-]/g,'')) || 0;
          rows.push({
            date:    cells[2] || '',
            ticker:  cells[3] || ticker,
            company: cells[4] || '',
            insider: cells[5] || '',
            title:   cells[6] || '',
            type:    qty > 0 ? 'Compra' : 'Venta',
            qty:     Math.abs(qty),
            price:   cells[8] || '',
            value:   cells[9] || '',
          });
        }
      }
      if (rows.length > 0) results.insiders = rows;
    }
  } catch(e) { errors.push('OpenInsider: ' + e.message); }

  // ── 3. SHORT INTEREST — FINRA ──────────────────────────────────
  try {
    const url = `https://api.finra.org/data/group/OTCMarket/name/consolidatedShortInterest?limit=5&filters=[{"fieldName":"symbolCode","fieldValue":"${ticker}","compareType":"EQUAL"}]`;
    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const data = await r.json();
      const latest = data?.[0];
      if (latest) {
        results.shortInterest = {
          date:         latest.settlementDate || '',
          shortVolume:  latest.totalShortInterest || 0,
          avgDailyVol:  latest.averageDailyVolume || 0,
          daysTocover:  latest.daysToCover || 0,
          shortFloat:   latest.shortInterestRatio || 0,
        };
      }
    }
  } catch(e) { errors.push('Short Interest FINRA: ' + e.message); }

  // ── 4. SHORT INTEREST — fallback via Yahoo (SI%) ───────────────
  if (!results.shortInterest) {
    try {
      const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`;
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) {
        const data = await r.json();
        const stats = data?.quoteSummary?.result?.[0]?.defaultKeyStatistics;
        if (stats) {
          results.shortInterest = {
            date:        'Yahoo Finance',
            shortFloat:  stats.shortPercentOfFloat?.raw,
            daysTocover: stats.shortRatio?.raw,
            shortVolume: stats.sharesShort?.raw,
            sharesOut:   stats.sharesOutstanding?.raw,
          };
        }
      }
    } catch(e) { errors.push('Short Yahoo: ' + e.message); }
  }

  // ── 5. INSTITUTIONAL OWNERSHIP — Yahoo ────────────────────────
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=institutionOwnership,majorHoldersBreakdown`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const data = await r.json();
      const result = data?.quoteSummary?.result?.[0];
      const holders = result?.majorHoldersBreakdown;
      const inst = result?.institutionOwnership?.ownershipList?.slice(0,5) || [];
      if (holders) {
        results.institutional = {
          pctInsiders:     holders.insidersPercentHeld?.raw,
          pctInstitutions: holders.institutionsPercentHeld?.raw,
          topHolders: inst.map(h => ({
            name:    h.organization,
            pct:     h.pctHeld?.raw,
            shares:  h.position?.raw,
            value:   h.value?.raw,
            change:  h.pctChange?.raw,
          })),
        };
      }
    }
  } catch(e) { errors.push('Institutional: ' + e.message); }

  return res.status(200).json({
    ticker: ticker.toUpperCase(),
    timestamp: new Date().toISOString(),
    insiders:     results.insiders     || [],
    shortInterest: results.shortInterest || null,
    institutional: results.institutional || null,
    errors,
  });
}

function getDateToday() {
  return new Date().toISOString().slice(0,10);
}
function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0,10);
}
