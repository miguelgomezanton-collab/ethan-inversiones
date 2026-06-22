// ═══════════════════════════════════════════════
// /api/fundamental.js — Vercel Serverless Function
// ═══════════════════════════════════════════════
// Recibe ?ticker=AAPL, llama a Yahoo Finance quoteSummary
// (endpoint interno no oficial, sin API key), extrae los datos
// financieros y calcula los 3 scores ETHAN:
//   Fundamental (60% Solidez + 40% Momentum)
//   Greenblatt  (50% ROIC + 50% EV/EBITDA)
//   Lynch       (50% PER  + 50% PEG)
//
// Sin variables de entorno requeridas. Cubre cualquier ticker
// cotizado en Yahoo Finance (NYSE, NASDAQ, BME, XETRA, etc.)

const YF_CRUMB_URL = 'https://query1.finance.yahoo.com/v1/test/getcrumb';
const YF_CONSENT_URL = 'https://finance.yahoo.com';
const YF_BASE = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary';
const YF_BASE2 = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary';
const YF_MODULES = [
  'incomeStatementHistory',
  'balanceSheetHistory',
  'cashflowStatementHistory',
  'defaultKeyStatistics',
  'summaryDetail',
  'financialData',
  'price'
].join(',');

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Origin': 'https://finance.yahoo.com',
  'Referer': 'https://finance.yahoo.com/'
};

// Obtiene el crumb + cookie necesarios para llamadas server-side a Yahoo
async function getYahooCrumb() {
  // 1. Visitar la home de Yahoo Finance para obtener cookies de sesión
  const homeRes = await fetch(YF_CONSENT_URL, {
    headers: { ...BASE_HEADERS, 'Accept': 'text/html' },
    redirect: 'follow'
  });
  const cookie = homeRes.headers.get('set-cookie') || '';

  // 2. Obtener el crumb usando las cookies de sesión
  const crumbRes = await fetch(YF_CRUMB_URL, {
    headers: { ...BASE_HEADERS, 'Cookie': cookie }
  });
  if (!crumbRes.ok) throw new Error(`Crumb: HTTP ${crumbRes.status}`);
  const crumb = await crumbRes.text();
  if (!crumb || crumb.length < 5) throw new Error('Crumb inválido');

  return { crumb: crumb.trim(), cookie };
}

async function fetchYahoo(ticker) {
  const { crumb, cookie } = await getYahooCrumb();

  const tryFetch = async (base) => {
    const url = `${base}/${encodeURIComponent(ticker)}?modules=${YF_MODULES}&crumb=${encodeURIComponent(crumb)}`;
    const res = await fetch(url, {
      headers: { ...BASE_HEADERS, 'Cookie': cookie }
    });
    if (!res.ok) throw new Error(`Yahoo Finance: HTTP ${res.status}`);
    const json = await res.json();
    if (json.quoteSummary?.error) throw new Error(`Yahoo Finance: ${json.quoteSummary.error.description}`);
    const result = json.quoteSummary?.result?.[0];
    if (!result) throw new Error(`Yahoo Finance: sin datos para ${ticker}`);
    return result;
  };

  try {
    return await tryFetch(YF_BASE);
  } catch (e1) {
    return await tryFetch(YF_BASE2);
  }
}

// ───────────────────────────────────────────────
// Scoring — fórmulas exactas del sistema ETHAN
// ───────────────────────────────────────────────
function scoreCrecingresos(pct) {
  if (pct === null) return null;
  if (pct >= 10) return 5;
  if (pct >= 5)  return 2.5 + ((pct - 5) / 5) * 2.5;
  return Math.max(0, pct / 5 * 2.5);
}
function scoreCrecEBITDA(pct) {
  if (pct === null) return null;
  if (pct >= 15) return 5;
  if (pct >= 8)  return 4;
  if (pct >= 0)  return 3;
  return 2;
}
function scoreMargenes(opPct, netPct) {
  if (opPct === null || netPct === null) return null;
  if (opPct > 20 && netPct > 10) return 4.5;
  if (opPct > 15 && netPct > 8)  return 4;
  if (opPct > 10 && netPct > 5)  return 3;
  return 2;
}
function scoreFCFIngresos(pct) {
  if (pct === null) return null;
  if (pct >= 10) return 5;
  if (pct >= 5)  return 3 + ((pct - 5) / 5) * 2;
  return Math.max(0, pct / 5 * 3);
}
function scorePFCF(x) {
  if (x === null || x <= 0) return null;
  if (x < 10)  return 5;
  if (x < 15)  return 4;
  if (x < 20)  return 3;
  return 2;
}
function scoreROE(pct) {
  if (pct === null) return null;
  if (pct > 20)  return 4.5;
  if (pct > 15)  return 4;
  if (pct > 10)  return 3;
  return 2;
}
function scoreDeuda(ratio) {
  if (ratio === null) return null;
  if (ratio < 1) return 5;
  if (ratio < 2) return 4;
  if (ratio < 4) return 2.5;
  return 1;
}
function scoreROIC(pct) {
  if (pct === null) return null;
  if (pct >= 25) return 5;
  if (pct >= 20) return 4.5;
  if (pct >= 15) return 4;
  if (pct >= 10) return 3;
  return 2;
}
function scoreEVEBITDA(x) {
  if (x === null || x <= 0) return null;
  if (x < 4)  return 5;
  if (x < 8)  return 4.5;
  if (x < 12) return 4;
  if (x < 15) return 3;
  return 2.5;
}
function scorePER(x) {
  if (x === null || x <= 0) return null;
  if (x < 10)  return 5;
  if (x < 15)  return 4.5;
  if (x < 20)  return 4;
  if (x < 25)  return 3.5;
  return 3;
}
function scorePEG(x) {
  if (x === null || x <= 0) return null;
  if (x < 0.5) return 5;
  if (x < 1)   return 4;
  if (x < 1.5) return 3;
  if (x < 2)   return 2;
  return 1;
}

function classify(score, map) {
  for (const [min, label] of map) {
    if (score >= min) return label;
  }
  return map[map.length - 1][1];
}

const FUND_MAP  = [[4.5,'Premium'],[4,'Calidad'],[3,'Aceptable'],[2,'Débil'],[0,'Problemática']];
const GREEN_MAP = [[4.5,'Atractiva'],[4,'Interesante'],[3,'Neutral'],[2,'Poco Atractiva'],[0,'Desfavorable']];
const LYNCH_MAP = [[4.5,'Ganga'],[4,'Atractiva'],[3,'Razonable'],[2,'Cara'],[0,'Muy Cara / Evitar']];
const FINAL_MAP = [[4.5,'COMPRA FUERTE'],[4,'COMPRA'],[3.5,'INTERESANTE'],[3,'ACEPTABLE'],[2.5,'DÉBIL'],[0,'EVITAR']];

// Helper para extraer valores de los módulos de Yahoo (que vienen
// como {raw: number, fmt: string} o directamente como number)
function val(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj === 'number') return obj;
  if (typeof obj.raw === 'number') return obj.raw;
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ticker = (req.query.ticker || '').toUpperCase().trim();
  if (!ticker) return res.status(400).json({ error: 'Parámetro ticker requerido' });

  try {
    const data = await fetchYahoo(ticker);

    const inc  = data.incomeStatementHistory?.incomeStatementHistory || [];
    const bal  = data.balanceSheetHistory?.balanceSheetHistory || [];
    const cf   = data.cashflowStatementHistory?.cashflowStatementHistory || [];
    const stats = data.defaultKeyStatistics || {};
    const summ  = data.summaryDetail || {};
    const fin   = data.financialData || {};
    const price = data.price || {};

    // ── Extracción de datos financieros ─────────────
    // financialData = datos TTM actualizados con nombres consistentes
    // incomeStatementHistory = histórico anual para crecimientos YoY
    // balanceSheetHistory = balance para equity, deuda
    // cashflowStatementHistory = FCF
    // defaultKeyStatistics = ratios de mercado (PER, PEG, EPS)

    const incCur  = inc[0] || {};
    const incPrev = inc[1] || {};
    const balCur  = bal[0] || {};
    const cfCur   = cf[0]  || {};

    // ── Datos P&L — priorizar financialData (TTM) ──
    const revenue   = val(fin.totalRevenue) || val(incCur.totalRevenue);
    const revPrev   = val(incPrev.totalRevenue);
    const ebitda    = val(fin.ebitda);
    const ebit      = val(fin.ebit) || val(incCur.ebit) ||
                      val(incCur.operatingIncome);
    const netIncome = val(fin.netIncomeToCommon) || val(incCur.netIncome) ||
                      val(incCur.netIncomeApplicableToCommonShares);

    // EBITDA año anterior para crecimiento YoY (aproximado)
    const ebitPrev   = val(incPrev.ebit) || val(incPrev.operatingIncome);
    const daPrev     = val(incPrev.depreciationAndAmortization) || 0;
    const ebitdaPrev = ebitPrev !== null ? ebitPrev + daPrev : null;

    // ── Márgenes — priorizar % directos de financialData ──
    const opMarginPct  = val(fin.operatingMargins);  // ya viene en decimal (ej. 0.285)
    const netMarginPct = val(fin.profitMargins);
    const opMargin  = opMarginPct !== null ? opMarginPct * 100
                      : (revenue && ebit ? (ebit / revenue) * 100 : null);
    const netMargin = netMarginPct !== null ? netMarginPct * 100
                      : (revenue && netIncome ? (netIncome / revenue) * 100 : null);

    // ── FCF — priorizar financialData ──
    const fcf = val(fin.freeCashflow) ||
                val(cfCur.freeCashFlow) ||
                (val(cfCur.totalCashFromOperatingActivities) !== null && val(cfCur.capitalExpenditures) !== null
                  ? val(cfCur.totalCashFromOperatingActivities) + val(cfCur.capitalExpenditures)
                  : null);

    // ── Balance — Yahoo da equity solo en balanceSheetHistory ──
    const equityBal = val(balCur.totalStockholderEquity) ||
                      val(balCur.stockholdersEquity);
    const equityFin = equityBal;

    const totalDebt = val(fin.totalDebt) ||
                      ((val(balCur.longTermDebt) || 0) + (val(balCur.shortLongTermDebt) || val(balCur.currentPortionOfLongTermDebt) || 0));
    const cash      = val(fin.totalCash) ||
                      val(balCur.cash) || val(balCur.cashAndCashEquivalents) || 0;

    // ── Ratios de mercado ──
    const marketCap = val(price.marketCap) || val(summ.marketCap);
    const priceVal  = val(price.regularMarketPrice) || val(summ.regularMarketPrice);
    const eps       = val(stats.trailingEps);
    const per       = val(summ.trailingPE) || val(fin.trailingPe) ||
                      (priceVal && eps && eps > 0 ? priceVal / eps : null);
    const pegRatio  = val(stats.pegRatio);

    // ── Cálculos derivados ──
    const fcfPct      = revenue && fcf ? (fcf / revenue) * 100 : null;
    const roe         = equityFin && netIncome && equityFin > 0 ? (netIncome / equityFin) * 100 : null;
    const deudaEquity = equityFin && totalDebt && equityFin > 0 ? totalDebt / equityFin : null;
    const pfcf        = marketCap && fcf && fcf > 0 ? marketCap / fcf : null;

    const crecIngresos = revenue && revPrev && revPrev > 0
      ? ((revenue - revPrev) / Math.abs(revPrev)) * 100 : null;

    // Para crecimiento EBITDA: si tenemos ebitda TTM y ebitdaPrev del historial
    const crecEBITDA = ebitda && ebitdaPrev && ebitdaPrev > 0
      ? ((ebitda - ebitdaPrev) / Math.abs(ebitdaPrev)) * 100 : null;

    // EV/EBITDA
    const ev       = (marketCap || 0) + (totalDebt || 0) - (cash || 0);
    const evEbitda = ev > 0 && ebitda && ebitda > 0 ? ev / ebitda : null;

    // ROIC
    const nopat  = ebit ? ebit * 0.75 : null;
    const capInv = (equityFin || 0) + (totalDebt || 0);
    const roic   = nopat && capInv > 0 ? (nopat / capInv) * 100 : null;

    const peg     = pegRatio || null;
    const crecBPA = peg && per && peg > 0 ? per / peg : null;

    // ── INDICADOR FUNDAMENTAL ───────────────────────
    const sc_crecIng    = scoreCrecingresos(crecIngresos);
    const sc_crecEBITDA = scoreCrecEBITDA(crecEBITDA);
    const sc_margenes   = scoreMargenes(opMargin, netMargin);
    const sc_fcf        = scoreFCFIngresos(fcfPct);
    const sc_pfcf       = scorePFCF(pfcf);
    const sc_roe        = scoreROE(roe);
    const sc_deuda      = scoreDeuda(deudaEquity);

    const solidezInputs = [
      { score: sc_crecIng,    w: 0.167 },
      { score: sc_crecEBITDA, w: 0.167 },
      { score: sc_margenes,   w: 0.167 },
      { score: sc_fcf,        w: 0.167 },
      { score: sc_pfcf,       w: 0.167 },
      { score: sc_roe,        w: 0.100 },
      { score: sc_deuda,      w: 0.065 }
    ];
    const validSolidez = solidezInputs.filter(x => x.score !== null);
    const totalW  = validSolidez.reduce((s, x) => s + x.w, 0);
    const solidez = totalW > 0
      ? validSolidez.reduce((s, x) => s + x.score * (x.w / totalW), 0)
      : null;

    const momentum = 4.0;
    const scoreFundamental = solidez !== null
      ? +(solidez * 0.60 + momentum * 0.40).toFixed(2)
      : null;

    // ── INDICADOR GREENBLATT ────────────────────────
    const sc_roic     = scoreROIC(roic);
    const sc_evEbitda = scoreEVEBITDA(evEbitda);
    const scoreGreenblatt = sc_roic !== null && sc_evEbitda !== null
      ? +(sc_roic * 0.50 + sc_evEbitda * 0.50).toFixed(2)
      : sc_roic !== null ? +sc_roic.toFixed(2)
      : sc_evEbitda !== null ? +sc_evEbitda.toFixed(2)
      : null;

    // ── INDICADOR LYNCH ─────────────────────────────
    const sc_per = scorePER(per);
    const sc_peg = scorePEG(peg);
    const scoreLynch = sc_per !== null && sc_peg !== null
      ? +(sc_per * 0.50 + sc_peg * 0.50).toFixed(2)
      : sc_per !== null ? +sc_per.toFixed(2)
      : sc_peg !== null ? +sc_peg.toFixed(2)
      : null;

    // ── SCORE FINAL ─────────────────────────────────
    const validFinals = [scoreFundamental, scoreGreenblatt, scoreLynch].filter(x => x !== null);
    const scoreFinal  = validFinals.length > 0
      ? +(validFinals.reduce((a, b) => a + b, 0) / validFinals.length).toFixed(2)
      : null;

    return res.status(200).json({
      ticker,
      company:  val(price.longName) || val(price.shortName) || ticker,
      sector:   val(price.sector) || null,
      industry: val(price.industry) || null,
      currency: val(price.currency) || 'USD',
      exchange: val(price.exchangeName) || null,
      price:    priceVal,
      marketCap,
      datos: {
        revenue:   revenue   ? Math.round(revenue / 1e6)   : null,
        ebitda:    ebitda    ? Math.round(ebitda  / 1e6)   : null,
        ebit:      ebit      ? Math.round(ebit    / 1e6)   : null,
        netIncome: netIncome ? Math.round(netIncome / 1e6) : null,
        fcf:       fcf       ? Math.round(fcf     / 1e6)   : null,
        equity:    equityFin    ? Math.round(equityFin  / 1e6)   : null,
        totalDebt: totalDebt ? Math.round(totalDebt / 1e6) : null,
        cash:      cash      ? Math.round(cash    / 1e6)   : null,
        eps, per, peg, pfcf, evEbitda, roe, roic,
        opMargin, netMargin, fcfPct,
        crecIngresos, crecEBITDA, crecBPA, deudaEquity
      },
      scoresFundamental: {
        crecIngresos: sc_crecIng,
        crecEBITDA:   sc_crecEBITDA,
        margenes:     sc_margenes,
        fcfIngresos:  sc_fcf,
        pfcf:         sc_pfcf,
        roe:          sc_roe,
        deuda:        sc_deuda,
        solidez:      solidez ? +solidez.toFixed(2) : null,
        momentum,
        total:        scoreFundamental,
        label:        scoreFundamental ? classify(scoreFundamental, FUND_MAP) : null
      },
      scoresGreenblatt: {
        roic:     sc_roic,
        evEbitda: sc_evEbitda,
        total:    scoreGreenblatt,
        label:    scoreGreenblatt ? classify(scoreGreenblatt, GREEN_MAP) : null
      },
      scoresLynch: {
        per:   sc_per,
        peg:   sc_peg,
        total: scoreLynch,
        label: scoreLynch ? classify(scoreLynch, LYNCH_MAP) : null
      },
      scoreFinal,
      recomendacion: scoreFinal ? classify(scoreFinal, FINAL_MAP) : null
    });

  } catch (err) {
    return res.status(500).json({ error: err.message, ticker });
  }
}
