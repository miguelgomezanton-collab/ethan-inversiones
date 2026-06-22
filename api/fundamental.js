// ═══════════════════════════════════════════════
// /api/fundamental.js — Vercel Serverless Function
// ═══════════════════════════════════════════════
// Recibe ?ticker=AAPL, llama a Financial Modeling Prep en paralelo
// (income statement, balance sheet, cash flow, key-metrics-ttm,
// financial-growth), y devuelve los 3 scores ETHAN calculados:
// Fundamental (60% Solidez + 40% Momentum)
// Greenblatt  (50% ROIC + 50% EV/EBITDA)
// Lynch       (50% PER  + 50% PEG)
//
// Variable de entorno requerida en Vercel: FMP_API_KEY

const FMP_BASE = 'https://financialmodelingprep.com/stable';

async function fmpFetch(endpoint, symbol, params, apiKey) {
  const qs = new URLSearchParams({ symbol, ...params, apikey: apiKey });
  const url = `${FMP_BASE}/${endpoint}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP ${endpoint}: HTTP ${res.status}`);
  const data = await res.json();
  if (data && data['Error Message']) throw new Error(`FMP: ${data['Error Message']}`);
  return data;
}

// ───────────────────────────────────────────────
// Scoring — fórmulas exactas del sistema ETHAN
// ───────────────────────────────────────────────

function scoreCrecingresos(pct) {
  if (pct === null) return null;
  if (pct >= 10) return 5;
  if (pct >= 5)  return 2.5 + ((pct - 5) / 5) * 2.5; // interpolado
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

const FUND_MAP   = [[4.5,'Premium'],[4,'Calidad'],[3,'Aceptable'],[2,'Débil'],[0,'Problemática']];
const GREEN_MAP  = [[4.5,'Atractiva'],[4,'Interesante'],[3,'Neutral'],[2,'Poco Atractiva'],[0,'Desfavorable']];
const LYNCH_MAP  = [[4.5,'Ganga'],[4,'Atractiva'],[3,'Razonable'],[2,'Cara'],[0,'Muy Cara / Evitar']];
const FINAL_MAP  = [[4.5,'COMPRA FUERTE'],[4,'COMPRA'],[3.5,'INTERESANTE'],[3,'ACEPTABLE'],[2.5,'DÉBIL'],[0,'EVITAR']];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'FMP_API_KEY no configurada en Vercel' });

  const ticker = (req.query.ticker || '').toUpperCase().trim();
  if (!ticker) return res.status(400).json({ error: 'Parámetro ticker requerido' });

  const errors = [];

  try {
    // ── Llamadas en paralelo a FMP ──────────────────
    const [incomeRes, balanceRes, cashRes, metricsRes, growthRes, profileRes] =
      await Promise.allSettled([
        fmpFetch('income-statement',        ticker, { limit: 2 },  apiKey),
        fmpFetch('balance-sheet-statement', ticker, { limit: 1 },  apiKey),
        fmpFetch('cash-flow-statement',     ticker, { limit: 1 },  apiKey),
        fmpFetch('key-metrics-ttm',         ticker, {},            apiKey),
        fmpFetch('financial-growth',        ticker, { limit: 1 },  apiKey),
        fmpFetch('profile',                 ticker, {},            apiKey)
      ]);

    // ── Extracción de datos ─────────────────────────
    const inc  = incomeRes.status === 'fulfilled' ? incomeRes.value : [];
    const bal  = balanceRes.status === 'fulfilled' ? balanceRes.value : [];
    const cf   = cashRes.status === 'fulfilled' ? cashRes.value : [];
    const met  = metricsRes.status === 'fulfilled' ? (Array.isArray(metricsRes.value) ? metricsRes.value[0] : metricsRes.value) : {};
    const grow = growthRes.status === 'fulfilled' ? (growthRes.value?.[0] || {}) : {};
    const prof = profileRes.status === 'fulfilled' ? (Array.isArray(profileRes.value) ? profileRes.value[0] : profileRes.value) : {};

    if (incomeRes.status === 'rejected') errors.push('income-statement: ' + incomeRes.reason?.message);
    if (balanceRes.status === 'rejected') errors.push('balance-sheet: ' + balanceRes.reason?.message);
    if (cashRes.status === 'rejected')    errors.push('cash-flow: ' + cashRes.reason?.message);
    if (metricsRes.status === 'rejected') errors.push('key-metrics: ' + metricsRes.reason?.message);
    if (growthRes.status === 'rejected')  errors.push('financial-growth: ' + growthRes.reason?.message);
    if (profileRes.status === 'rejected') errors.push('profile: ' + profileRes.reason?.message);

    // Datos del último año y año anterior para calcular YoY
    const incCur  = inc[0]  || {};
    const incPrev = inc[1]  || {};
    const balCur  = bal[0]  || {};
    const cfCur   = cf[0]   || {};

    const revenue     = incCur.revenue || null;
    const revPrev     = incPrev.revenue || null;
    const ebitda      = incCur.ebitda || null;
    const ebitdaPrev  = incPrev.ebitda || null;
    const ebit        = incCur.operatingIncome || null;
    const opMargin    = revenue && ebit ? (ebit / revenue) * 100 : null;
    const netIncome   = incCur.netIncome || null;
    const netMargin   = revenue && netIncome ? (netIncome / revenue) * 100 : null;
    const fcf         = cfCur.freeCashFlow || null;
    const fcfPct      = revenue && fcf ? (fcf / revenue) * 100 : null;

    const marketCap   = prof.mktCap || met?.marketCapTTM || null;
    const price       = prof.price || null;
    const eps         = met?.epsLTMTTM || met?.netIncomePerShareTTM || null;
    const equity      = balCur.totalStockholdersEquity || null;
    const totalDebt   = balCur.totalDebt || null;
    const cash        = balCur.cashAndCashEquivalents || balCur.cashAndShortTermInvestments || null;
    const roe         = equity && netIncome && equity > 0 ? (netIncome / equity) * 100 : null;
    const deudaEquity = equity && totalDebt && equity > 0 ? totalDebt / equity : null;

    // Crecimientos YoY
    const crecIngresos = revenue && revPrev && revPrev > 0
      ? ((revenue - revPrev) / Math.abs(revPrev)) * 100 : null;
    const crecEBITDA = ebitda && ebitdaPrev && ebitdaPrev > 0
      ? ((ebitda - ebitdaPrev) / Math.abs(ebitdaPrev)) * 100 : null;

    // P/FCF y PER
    const pfcf = marketCap && fcf && fcf > 0 ? marketCap / fcf : null;
    const per  = price && eps && eps > 0 ? price / eps : null;

    // EV/EBITDA
    const ev = (marketCap || 0) + (totalDebt || 0) - (cash || 0);
    const evEbitda = ev > 0 && ebitda && ebitda > 0 ? ev / ebitda : null;

    // ROIC
    const nopat = ebit ? ebit * 0.75 : null;
    const capInv = (equity || 0) + (totalDebt || 0);
    const roic = nopat && capInv > 0 ? (nopat / capInv) * 100 : null;

    // PEG — usamos crecimiento BPA del growth endpoint, o crecimiento de ingresos como proxy
    const crecBPA = grow?.epsgrowth != null ? grow.epsgrowth * 100 :
                    grow?.revenueGrowth != null ? grow.revenueGrowth * 100 : null;
    const peg = per && crecBPA && crecBPA > 0 ? per / crecBPA : null;

    // ── Cálculo INDICADOR FUNDAMENTAL ──────────────
    const sc_crecIng   = scoreCrecingresos(crecIngresos);
    const sc_crecEBITDA = scoreCrecEBITDA(crecEBITDA);
    const sc_margenes  = scoreMargenes(opMargin, netMargin);
    const sc_fcf       = scoreFCFIngresos(fcfPct);
    const sc_pfcf      = scorePFCF(pfcf);
    const sc_roe       = scoreROE(roe);
    const sc_deuda     = scoreDeuda(deudaEquity);

    // Solo calculamos Solidez con los scores disponibles, ponderando sobre el peso real disponible
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
    const totalW = validSolidez.reduce((s, x) => s + x.w, 0);
    const solidez = totalW > 0
      ? validSolidez.reduce((s, x) => s + x.score * x.w, 0) / totalW * 5 / 5
      : null;

    const momentum = 4.0; // simplificado
    const scoreFundamental = solidez !== null
      ? solidez * 0.60 + momentum * 0.40
      : null;

    // ── Cálculo INDICADOR GREENBLATT ───────────────
    const sc_roic     = scoreROIC(roic);
    const sc_evEbitda = scoreEVEBITDA(evEbitda);
    const scoreGreenblatt = (sc_roic !== null && sc_evEbitda !== null)
      ? sc_roic * 0.50 + sc_evEbitda * 0.50
      : sc_roic ?? sc_evEbitda;

    // ── Cálculo INDICADOR LYNCH ────────────────────
    const sc_per = scorePER(per);
    const sc_peg = scorePEG(peg);
    const scoreLynch = (sc_per !== null && sc_peg !== null)
      ? sc_per * 0.50 + sc_peg * 0.50
      : sc_per ?? sc_peg;

    // ── Score final promedio ───────────────────────
    const validFinals = [scoreFundamental, scoreGreenblatt, scoreLynch].filter(x => x !== null);
    const scoreFinal = validFinals.length > 0
      ? validFinals.reduce((a, b) => a + b, 0) / validFinals.length
      : null;

    return res.status(200).json({
      ticker,
      company: prof.companyName || ticker,
      sector: prof.sector || null,
      industry: prof.industry || null,
      currency: prof.currency || 'USD',
      exchange: prof.exchangeShortName || null,
      price,
      marketCap,
      // Datos brutos (para mostrar en la UI)
      datos: {
        revenue: revenue ? Math.round(revenue / 1e6) : null, // en M
        ebitda:  ebitda  ? Math.round(ebitda  / 1e6) : null,
        ebit:    ebit    ? Math.round(ebit    / 1e6) : null,
        netIncome: netIncome ? Math.round(netIncome / 1e6) : null,
        fcf:     fcf ? Math.round(fcf / 1e6) : null,
        equity:  equity  ? Math.round(equity  / 1e6) : null,
        totalDebt: totalDebt ? Math.round(totalDebt / 1e6) : null,
        cash:    cash    ? Math.round(cash    / 1e6) : null,
        eps, per, peg, pfcf, evEbitda, roe, roic,
        opMargin, netMargin, fcfPct,
        crecIngresos, crecEBITDA, crecBPA,
        deudaEquity
      },
      // Scores individuales (para debug y desglose en la UI)
      scoresFundamental: {
        crecIngresos: sc_crecIng,
        crecEBITDA: sc_crecEBITDA,
        margenes: sc_margenes,
        fcfIngresos: sc_fcf,
        pfcf: sc_pfcf,
        roe: sc_roe,
        deuda: sc_deuda,
        solidez: solidez ? +solidez.toFixed(2) : null,
        momentum,
        total: scoreFundamental ? +scoreFundamental.toFixed(2) : null,
        label: scoreFundamental ? classify(scoreFundamental, FUND_MAP) : null
      },
      scoresGreenblatt: {
        roic: sc_roic,
        evEbitda: sc_evEbitda,
        total: scoreGreenblatt ? +scoreGreenblatt.toFixed(2) : null,
        label: scoreGreenblatt ? classify(scoreGreenblatt, GREEN_MAP) : null
      },
      scoresLynch: {
        per: sc_per,
        peg: sc_peg,
        total: scoreLynch ? +scoreLynch.toFixed(2) : null,
        label: scoreLynch ? classify(scoreLynch, LYNCH_MAP) : null
      },
      scoreFinal: scoreFinal ? +scoreFinal.toFixed(2) : null,
      recomendacion: scoreFinal ? classify(scoreFinal, FINAL_MAP) : null,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err) {
    return res.status(500).json({ error: err.message, ticker });
  }
}
