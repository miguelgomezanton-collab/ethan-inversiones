// server/etf-holdings/sources/vanguard.js
// Adapter para Vanguard ETFs
//
// ETFs soportados (Fase 2 — 63 subsectores):
//   VNQ  — Vanguard Real Estate ETF
//
// Fuente primaria: CSV de Vanguard (institutional portal)
//   https://advisors.vanguard.com/pub/Pdf/ETFS_Holdings_VNQ.csv
//   O bien: https://www.vanguard.com/us/portal/content/ivgfm/research/fs/etf/HOLDINGS/VNQ/holdings.csv
//
// Fuente alternativa: SEC EDGAR NPORT-P
//   SEC CIK de Vanguard Real Estate Index Fund: 0000804239
//   https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000804239&type=NPORT-P
//
// NOTA: El CSV de Vanguard tiene formato:
//   "Vanguard Real Estate ETF","VNQ","Holdings as of 12/01/2024"
//   Ticker,Name,% of Fund,Shares Held,Mkt. Value ($ mm)
//   WELL,"Welltower Inc.",7.52%,8521000,5260
//
// ─────────────────────────────────────────────────────────────────────────────────

import https from 'https';

const VANGUARD_TICKERS = new Set(['VNQ']);

// CIK de Vanguard Real Estate Index Fund en SEC EDGAR
const EDGAR_CIK = {
  VNQ: '0000804239',
};

/** Verifica si este adapter soporta el ticker dado */
export function supports(ticker) {
  return VANGUARD_TICKERS.has(ticker.toUpperCase());
}

/**
 * Descarga y parsea los holdings del ETF desde Vanguard.
 *
 * @param {string} etfTicker  — Ticker del ETF (ej. "VNQ")
 * @returns {Promise<HoldingsResult>}
 */
export async function fetchHoldings(etfTicker) {
  const ticker = etfTicker.toUpperCase();

  // ── Intentar CSV de Vanguard ──────────────────────────────────────
  const csvEndpoints = [
    `https://advisors.vanguard.com/pub/Pdf/ETFS_Holdings_${ticker}.csv`,
    `https://www.vanguard.com/us/portal/content/ivgfm/research/fs/etf/HOLDINGS/${ticker}/holdings.csv`,
    `https://www.vanguard.com/pub/Pdf/ETFS_Holdings_${ticker}.csv`,
  ];

  for (const url of csvEndpoints) {
    try {
      console.log(`[Vanguard] ${ticker}: intentando ${url}`);
      const { statusCode, body } = await httpGet(url, {
        'Accept':  'text/csv,application/csv,*/*;q=0.9',
        'Referer': `https://investor.vanguard.com/etf/profile/${ticker}`,
      });

      if (statusCode !== 200 || !body || body.length < 200) continue;
      if (!body.includes(',') || !body.toLowerCase().includes('ticker')) continue;

      const result = parseCsv(body, ticker, url);
      if (result.holdings.length > 0) {
        console.log(`[Vanguard] ${ticker}: ${result.holdings.length} holdings desde CSV`);
        return result;
      }
    } catch (err) {
      console.warn(`[Vanguard] ${ticker}: CSV ${url} fallido — ${err.message}`);
    }
  }

  // ── Fallback: SEC EDGAR NPORT-P ───────────────────────────────────
  console.warn(`[Vanguard] ${ticker}: todos los CSV fallaron, usando SEC EDGAR`);
  return fetchFromEdgar(ticker);
}

// ── Parseo del CSV de Vanguard ────────────────────────────────────────

function parseCsv(csv, ticker, sourceUrl) {
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 3) {
    throw new Error(`Vanguard ${ticker}: CSV con menos de 3 líneas`);
  }

  // Buscar la línea de cabecera (contiene 'ticker' o 'symbol')
  let headerIndex = -1;
  let headers     = [];

  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const cols = parseCsvLine(lines[i]).map(c => c.toLowerCase().replace(/['"]/g, '').trim());
    if ((cols.includes('ticker') || cols.includes('symbol')) &&
        cols.some(c => c.includes('weight') || c.includes('% of fund') || c.includes('percent'))) {
      headerIndex = i;
      headers     = cols;
      break;
    }
  }

  if (headerIndex === -1) {
    // Si no hay columna Ticker, buscar por patrones alternativos de Vanguard
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const cols = parseCsvLine(lines[i]).map(c => c.toLowerCase().replace(/['"]/g, '').trim());
      if (cols.some(c => c === 'ticker' || c === 'fund holdings' || c === 'holding ticker symbol')) {
        headerIndex = i;
        headers     = cols;
        break;
      }
    }
  }

  if (headerIndex === -1) {
    throw new Error(`Vanguard ${ticker}: no se encontró cabecera en CSV. Primeras líneas: ${lines.slice(0,5).join(' | ')}`);
  }

  const colTicker = headers.findIndex(h => h === 'ticker' || h === 'symbol' || h.includes('ticker symbol'));
  const colName   = headers.findIndex(h => h === 'name' || h === 'holding name' || h.includes('security name'));
  const colWeight = headers.findIndex(h => h.includes('% of fund') || h.includes('weight') || h.includes('percent'));
  const colShares = headers.findIndex(h => h.includes('shares'));

  if (colTicker === -1 || colWeight === -1) {
    throw new Error(`Vanguard ${ticker}: columnas Ticker/Weight no localizadas. Cabeceras: ${headers.join(', ')}`);
  }

  // Extraer fecha de referencia de las primeras líneas
  let referenceDate = '';
  for (let i = 0; i < Math.min(headerIndex, 5); i++) {
    const line = lines[i];
    const dateMatch = line.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      referenceDate = `${dateMatch[3]}-${dateMatch[1].padStart(2,'0')}-${dateMatch[2].padStart(2,'0')}`;
      break;
    }
  }

  const holdings = [];
  let cashRows   = 0;

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]).map(c => c.replace(/^["']|["']$/g, '').trim());
    if (cells.length <= Math.max(colTicker, colWeight)) continue;

    const rawTicker = cells[colTicker] || '';
    const rawName   = colName >= 0 ? (cells[colName] || '') : rawTicker;
    const rawWeight = cells[colWeight] || '0';

    if (!rawTicker || rawTicker === '-' || rawTicker === 'N/A') continue;

    if (isCash(rawTicker, rawName)) {
      cashRows++;
      continue;
    }

    const weight = parseFloat(rawWeight.replace('%', '').replace(',', '.')) || 0;
    if (weight <= 0) continue;

    const shares = colShares >= 0
      ? (parseFloat((cells[colShares] || '0').replace(/[,\s]/g, '')) || null)
      : null;

    holdings.push({
      ticker: rawTicker.toUpperCase(),
      name:   rawName,
      weight: parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`Vanguard ${ticker}: 0 holdings extraídos del CSV`);
  }

  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    source:        'Vanguard',
    sourceUrl,
    referenceDate: referenceDate || new Date().toISOString().split('T')[0],
    totalHoldings: holdings.length,
    cashRows,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

// ── Fallback SEC EDGAR NPORT-P ────────────────────────────────────────

async function fetchFromEdgar(ticker) {
  const cik = EDGAR_CIK[ticker];
  if (!cik) throw new Error(`Vanguard EDGAR: no hay CIK configurado para ${ticker}`);

  // Buscar las últimas presentaciones NPORT-P
  const indexUrl = `https://data.sec.gov/submissions/CIK${cik}.json`;

  const { statusCode: s1, body: b1 } = await httpGet(indexUrl, {
    'Accept': 'application/json',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research; ethan-inversiones@gmail.com)',
  });

  if (s1 !== 200) throw new Error(`EDGAR submissions: HTTP ${s1} para CIK ${cik}`);

  const subData = JSON.parse(b1);
  const filings = subData.filings?.recent;

  if (!filings) throw new Error(`EDGAR: no hay filings recientes para CIK ${cik}`);

  // Encontrar la última NPORT-P
  const nportIndex = filings.form?.findIndex(f => f === 'NPORT-P');
  if (nportIndex === -1) throw new Error(`EDGAR: no se encontró NPORT-P para ${ticker} (CIK ${cik})`);

  const accNo     = filings.accessionNumber?.[nportIndex]?.replace(/-/g, '');
  const filingDate = filings.filingDate?.[nportIndex] || '';

  if (!accNo) throw new Error(`EDGAR: accession number vacío para ${ticker}`);

  // Construir URL del índice del filing
  const filingIndexUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${accNo}/index.json`;

  const { statusCode: s2, body: b2 } = await httpGet(filingIndexUrl, {
    'Accept': 'application/json',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research)',
  });

  if (s2 !== 200) throw new Error(`EDGAR filing index: HTTP ${s2}`);

  const indexData = JSON.parse(b2);
  const xmlFile   = indexData?.directory?.item?.find(
    f => f.name?.toLowerCase().endsWith('.xml') &&
         (f.name?.toLowerCase().includes('nport') || f.name?.toLowerCase().startsWith('primary'))
  );

  if (!xmlFile) throw new Error(`EDGAR: XML de NPORT-P no encontrado en índice ${filingIndexUrl}`);

  const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${accNo}/${xmlFile.name}`;

  const { statusCode: s3, body: xmlBody } = await httpGet(xmlUrl, {
    'Accept': 'application/xml',
    'User-Agent': 'ETHAN-Inversiones/2.0 (research)',
  });

  if (s3 !== 200) throw new Error(`EDGAR XML: HTTP ${s3}`);

  return parseNportXml(xmlBody, ticker, xmlUrl, filingDate);
}

function parseNportXml(xml, ticker, sourceUrl, filingDate) {
  const holdings = [];

  const dateMatch = xml.match(/<repPdDate>([\d-]+)<\/repPdDate>/);
  const referenceDate = dateMatch ? dateMatch[1] : (filingDate || new Date().toISOString().split('T')[0]);

  const invSecPattern = /<invstOrSec>([\s\S]+?)<\/invstOrSec>/g;
  let m;

  while ((m = invSecPattern.exec(xml)) !== null) {
    const sec = m[1];

    const nameM   = sec.match(/<name>([\s\S]+?)<\/name>/);
    const tickerM = sec.match(/<ticker>([\s\S]+?)<\/ticker>/);
    const pctM    = sec.match(/<pctVal>([\s\S]+?)<\/pctVal>/);
    const sharesM = sec.match(/<units>([\s\S]+?)<\/units>/);

    const secTicker = tickerM?.[1]?.trim() || '';
    const secName   = nameM?.[1]?.trim() || secTicker;
    const weight    = parseFloat(pctM?.[1] || '0');
    const shares    = parseFloat(sharesM?.[1] || '0') || null;

    if (!secTicker || isCash(secTicker, secName) || weight <= 0) continue;

    holdings.push({
      ticker: secTicker.toUpperCase(),
      name:   secName,
      weight: parseFloat(weight.toFixed(4)),
      shares,
    });
  }

  if (holdings.length === 0) {
    throw new Error(`EDGAR NPORT: 0 holdings parseados del XML para ${ticker}`);
  }

  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);

  return {
    source:        'SEC EDGAR NPORT-P (Vanguard fallback)',
    sourceUrl,
    referenceDate,
    totalHoldings: holdings.length,
    cashRows:      0,
    totalWeight:   parseFloat(totalWeight.toFixed(4)),
    holdings,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

function isCash(ticker, name) {
  const t = ticker.toLowerCase();
  const n = name.toLowerCase();
  return t === 'cash' || t === 'usd' || t.startsWith('vrtpx') ||
         n.includes('cash') || n.includes('money market') ||
         n.includes('collateral') || n.includes('repo') ||
         n.includes('index fund') || // excluir fondos internos de Vanguard
         ticker.length > 12;
}

function parseCsvLine(line) {
  const result = [];
  let current  = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const BROWSER_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Connection':      'keep-alive',
};

function httpGet(url, extraHeaders = {}, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path:     reqUrl.pathname + reqUrl.search,
      method:   'GET',
      headers:  { ...BROWSER_HEADERS, ...extraHeaders },
      timeout,
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`timeout ${timeout}ms — ${url}`)); });
    req.end();
  });
}
