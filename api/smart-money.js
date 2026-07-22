// /api/smart-money.js
// Insider Trading (SEC EDGAR Form 4 con detalle) + Short Interest + Institutional (Yahoo)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const T = ticker.toUpperCase();
  const results = { insiders: [], shortInterest: null, institutional: null, errors: [] };

  // ── 1. SHORT INTEREST + INSTITUTIONAL — Yahoo Finance ──────────
  try {
    const modules = 'defaultKeyStatistics,majorHoldersBreakdown,institutionOwnership';
    const r = await fetch(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${T}?modules=${modules}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }, signal: AbortSignal.timeout(12000) }
    );
    if (r.ok) {
      const data = await r.json();
      const result = data?.quoteSummary?.result?.[0];
      const stats   = result?.defaultKeyStatistics;
      const holders = result?.majorHoldersBreakdown;
      const instOwn = result?.institutionOwnership;
      if (stats) {
        results.shortInterest = {
          shortFloat:  stats.shortPercentOfFloat?.raw ?? null,
          daysTocover: stats.shortRatio?.raw ?? null,
          shortVolume: stats.sharesShort?.raw ?? null,
          source: 'Yahoo Finance',
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
    } else {
      results.errors.push(`Yahoo HTTP ${r.status}`);
    }
  } catch(e) { results.errors.push('Yahoo: ' + e.message); }

  // ── 2. INSIDER TRADING — SEC EDGAR + detalle de cada filing ────
  try {
    // Obtener lista de Form 4 recientes via SEC EDGAR RSS
    const rssUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=&CIK=${T}&type=4&dateb=&owner=include&count=10&search_text=&output=atom`;
    const r = await fetch(rssUrl, {
      headers: { 'User-Agent': 'ETHAN-Research contact@ethan.com', 'Accept': 'application/atom+xml' },
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) throw new Error(`SEC RSS HTTP ${r.status}`);
    const xml = await r.text();

    // Extraer accession numbers de los filings
    const filingLinks = [];
    const linkRegex = /<accession-number>(.*?)<\/accession-number>|href="([^"]+\/Archives\/[^"]+\.txt)"/g;

    // Método alternativo: extraer URLs de los índices de filing
    const indexRegex = /href="(\/Archives\/edgar\/data\/\d+\/\d+\/-index\.htm)"/g;
    let m;
    while ((m = indexRegex.exec(xml)) !== null && filingLinks.length < 6) {
      filingLinks.push('https://www.sec.gov' + m[1]);
    }

    // Si no encontramos índices, extraer de los links de la entrada
    if (filingLinks.length === 0) {
      const linkRegex2 = /<link[^>]+href="(https:\/\/www\.sec\.gov\/Archives\/[^"]+)"/g;
      while ((m = linkRegex2.exec(xml)) !== null && filingLinks.length < 6) {
        filingLinks.push(m[1]);
      }
    }

    // Parsear cada filing para obtener tipo y cantidad
    const insiderPromises = filingLinks.slice(0, 5).map(async (link) => {
      try {
        const fr = await fetch(link, {
          headers: { 'User-Agent': 'ETHAN-Research contact@ethan.com' },
          signal: AbortSignal.timeout(6000),
        });
        if (!fr.ok) return null;
        const html = await fr.text();

        // Extraer datos básicos del Form 4
        const dateMatch = html.match(/Period of Report[:\s<>\/td]*(\d{4}-\d{2}-\d{2})/i);
        const nameMatch = html.match(/Reporting Owner[:\s\S]{0,200}?<td[^>]*>([^<]{3,50})<\/td>/i) ||
                         html.match(/<reportingOwnerId>[\s\S]*?<rptOwnerName>(.*?)<\/rptOwnerName>/i);
        const titleMatch= html.match(/Officer Title[:\s<>\/td]*<td[^>]*>([^<]{2,50})<\/td>/i) ||
                         html.match(/<officerTitle>(.*?)<\/officerTitle>/i);

        // Detectar tipo de transacción
        const isBuy  = /P\b|Purchase|Acquisition/i.test(html);
        const isSell = /S\b|Sale|Disposition/i.test(html) && !isBuy;

        // Cantidad y precio
        const qtyMatch   = html.match(/(\d[\d,]+)\s*<\/td>[\s\S]{0,100}?(?:Common Stock|Ordinary Share)/i);
        const priceMatch = html.match(/\$\s*([\d.]+)/);

        return {
          date:    dateMatch?.[1] || '',
          insider: nameMatch?.[1]?.trim() || '—',
          title:   titleMatch?.[1]?.trim() || '—',
          type:    isBuy ? 'Compra' : isSell ? 'Venta' : '—',
          qty:     qtyMatch ? parseInt(qtyMatch[1].replace(/,/g,'')) : null,
          price:   priceMatch ? '$'+priceMatch[1] : '—',
          value:   '—',
        };
      } catch { return null; }
    });

    const parsed = (await Promise.all(insiderPromises)).filter(Boolean);

    // Fallback: usar datos del RSS si no pudimos parsear los filings
    if (parsed.length === 0) {
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      while ((m = entryRegex.exec(xml)) !== null && results.insiders.length < 8) {
        const entry = m[1];
        const title   = (/<title>([\s\S]*?)<\/title>/.exec(entry)?.[1]||'').replace(/<[^>]+>/g,'').trim();
        const updated = (/<updated>(.*?)<\/updated>/.exec(entry)?.[1]||'').slice(0,10);
        // Limpiar CIK del nombre
        const cleanName = title.replace(/\s*\(CIK.*?\)/g,'').trim();
        if (cleanName && updated) {
          results.insiders.push({ date: updated, insider: cleanName, title: '—', type: '—', qty: null, price: '—', value: '—' });
        }
      }
    } else {
      results.insiders = parsed.filter(p => p.date);
    }

  } catch(e) { results.errors.push('SEC: ' + e.message); }

  return res.status(200).json({
    ticker: T,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
