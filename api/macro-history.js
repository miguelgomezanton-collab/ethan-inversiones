// /api/macro-history.js — Vercel Serverless
// Datos históricos para Timeline y Correlaciones
// La FRED API key vive SOLO aquí, nunca en el frontend

const FRED = 'https://api.stlouisfed.org/fred/series/observations';

async function fred(id, key, limit = 96, order = 'asc', freq = '', observationStart = '') {
  const freqParam  = freq ? `&frequency=${freq}` : '';
  const startParam = observationStart ? `&observation_start=${observationStart}` : '';
  // limit=0 o observationStart definido → sin limit param (FRED devuelve todo)
  const limitParam = (!observationStart && limit > 0) ? `&limit=${limit}` : '';
  const url = `${FRED}?series_id=${id}&api_key=${key}&file_type=json&sort_order=${order}${limitParam}${freqParam}${startParam}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`FRED ${id}: ${r.status}`);
  const d = await r.json();
  return (d.observations || [])
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }));
}

async function yahoo(symbol, years = 7) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1mo&range=${years}y`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`Yahoo ${symbol}: ${r.status}`);
  const res = (await r.json()).chart?.result?.[0];
  if (!res) throw new Error(`Yahoo ${symbol}: sin datos`);
  const timestamps = res.timestamps || res.timestamp;
  const closes = res.indicators?.quote?.[0]?.close;
  if (!timestamps || !closes) throw new Error(`Yahoo ${symbol}: sin series`);
  return timestamps
    .map((ts, i) => ({ date: new Date(ts * 1000).toISOString().slice(0, 7), value: closes[i] }))
    .filter(p => p.value != null);
}

function yoySeries(arr) {
  if (!arr || arr.length < 13) return [];
  const result = [];
  for (let i = 12; i < arr.length; i++) {
    const cur = arr[i], prev = arr[i - 12];
    if (cur.value != null && prev.value != null && prev.value !== 0)
      result.push({ date: cur.date, value: +((cur.value - prev.value) / prev.value * 100).toFixed(2) });
  }
  return result;
}

function monthlyReturns(arr) {
  if (!arr || arr.length < 2) return [];
  const result = [];
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i], prev = arr[i - 1];
    if (cur.value != null && prev.value != null && prev.value !== 0)
      result.push({ date: cur.date, value: +((cur.value - prev.value) / prev.value * 100).toFixed(2) });
  }
  return result;
}

function normalizeBase100(arr) {
  if (!arr || arr.length === 0) return [];
  const base = arr[0].value;
  return arr.map(p => ({ date: p.date, value: base > 0 ? +((p.value / base - 1) * 100).toFixed(2) : 0 }));
}

function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 10) return null;
  const x = xs.slice(-n), y = ys.slice(-n);
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx, b = y[i] - my;
    num += a * b; dx2 += a * a; dy2 += b * b;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? null : +(num / denom).toFixed(2);
}

// Alinear dos series por fecha (YYYY-MM)
function alignByDate(a, b) {
  const bMap = new Map(b.map(p => [p.date.slice(0, 7), p.value]));
  const xs = [], ys = [];
  for (const pa of a) {
    const key = pa.date.slice(0, 7);
    if (bMap.has(key) && pa.value != null && bMap.get(key) != null) {
      xs.push(pa.value);
      ys.push(bMap.get(key));
    }
  }
  return { xs, ys };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600,stale-while-revalidate=7200');
  const key = process.env.FRED_API_KEY;
  if (!key) return res.status(500).json({ error: 'FRED_API_KEY no configurada' });

  const type = req.query.type || 'all'; // 'timeline' | 'correlaciones' | 'radar' | 'all'
  const errs = [];

  // ── Fetch FRED histórico ──────────────────────
  const [rSp, rNq, rRu, rAu, rBond, rDxy,
         rDgs10, rDgs2, rDff, rCpi, rCpiCore, rBbb, rM2v, rWresbal, rTotll, rGdp,
         rLei, rM2sl, rHy, rVix] =
    await Promise.allSettled([
      fred('SP500', key, 0, 'asc', 'm', '1976-01-01'),
      fred('SP500', key, 0, 'asc', '',  '1976-01-01'),
      fred('SP500', key, 0, 'asc', 'm', '2000-01-01'),
      fred('GOLDAMGBD228NLBM', key, 120, 'asc', 'm'),
      fred('DGS10',     key, 120, 'asc', 'm'),
      fred('DTWEXBGS',  key, 120, 'asc', 'm'),
      fred('DGS10',  key, 0, 'asc', '', '1976-01-01'),
      fred('DGS2',   key, 0, 'asc', '', '1976-01-01'),
      fred('DFF',    key, 0, 'asc', '', '1954-01-01'),
      fred('CPIAUCSL',   key, 0, 'asc', '', '1947-01-01'),
      fred('CPILFESL',   key, 132, 'desc'),
      fred('BAMLC0A4CBBB', key, 0, 'asc', '', '1997-01-01'),
      fred('M2V',        key, 0, 'asc', '', '1959-01-01'),
      fred('WRESBAL',    key, 0, 'asc', '', '1984-01-01'),
      fred('TOTLL',      key, 0, 'asc', '', '1973-01-01'),
      fred('GDP',        key, 0, 'asc', '', '1947-01-01'),
      fred('USALOLITOAASTSAM', key, 0, 'asc', '', '1959-01-01'),
      fred('M2SL',       key, 0, 'asc', '', '1959-01-01'),
      fred('BAMLH0A0HYM2', key, 0, 'asc', 'm', '1997-01-01'),  // HY OAS mensual (media FRED)
      fred('VIXCLS',     key, 0, 'asc', 'm', '1990-01-01'),     // VIX mensual (evita 9k obs diarias)
    ]);

  // ── Procesar series ───────────────────────────
  // SP500: usar el chunk más completo disponible, con fallback progresivo
  // rSp = mensual completo (puede fallar por timeout) | rNq = diario largo | rRu = mensual reciente
  const spChunkA = rSp.status === 'fulfilled' && rSp.value?.length > 0 ? rSp.value : null;
  const spChunkB = rNq.status === 'fulfilled' && rNq.value?.length > 0 ? rNq.value : null;
  const spChunkC = rRu.status === 'fulfilled' && rRu.value?.length > 0 ? rRu.value : null;
  // Elegir el que tenga mayor cobertura histórica
  const sp = [spChunkA, spChunkB, spChunkC]
    .filter(Boolean)
    .reduce((best, arr) => (!best || arr[0]?.date < best[0]?.date) ? arr : best, null);
  const nq   = rNq.status   === 'fulfilled' ? rNq.value   : null;
  const ru   = rRu.status   === 'fulfilled' ? rRu.value   : null;
  const au   = rAu.status   === 'fulfilled' ? rAu.value   : null;
  const bond = rBond.status === 'fulfilled' ? rBond.value : null;
  const dxy  = rDxy.status  === 'fulfilled' ? rDxy.value  : null;

  const dgs10 = rDgs10.status === 'fulfilled' ? rDgs10.value : null;
  const dgs2  = rDgs2.status  === 'fulfilled' ? rDgs2.value  : null;
  const dff   = rDff.status   === 'fulfilled' ? rDff.value   : null;
  const cpi   = rCpi.status   === 'fulfilled' ? rCpi.value   : null;
  const cpiCore = rCpiCore.status === 'fulfilled' ? rCpiCore.value : null;
  const bbb   = rBbb.status   === 'fulfilled' ? rBbb.value   : null;
  const m2v   = rM2v.status   === 'fulfilled' ? rM2v.value   : null;
  const totll = rTotll.status === 'fulfilled' ? rTotll.value : null;
  const gdp   = rGdp.status   === 'fulfilled' ? rGdp.value   : null;
  const lei   = rLei.status   === 'fulfilled' ? rLei.value   : null;
  const m2sl  = rM2sl.status  === 'fulfilled' ? rM2sl.value  : null;
  const wresbal = rWresbal.status === 'fulfilled' ? rWresbal.value : null;

  // Registrar errores
  if (!sp)    errs.push('Yahoo SP500: ' + rSp.reason?.message);
  if (!dgs10) errs.push('DGS10: '      + rDgs10.reason?.message);

  // Reducir series diarias/diarias a media mensual (YYYY-MM → valor promedio)
  function toMonthly(arr) {
    if (!arr?.length) return [];
    const byMonth = new Map();
    arr.forEach(p => {
      const ym = p.date.slice(0,7);
      if (!byMonth.has(ym)) byMonth.set(ym, []);
      byMonth.get(ym).push(p.value);
    });
    return [...byMonth.entries()]
      .map(([ym, vals]) => ({ date: ym + '-01', value: +(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(4) }))
      .sort((a,b) => a.date.localeCompare(b.date));
  }

  // Series del selector — media mensual, unidad natural
  const dgs10Monthly = toMonthly(dgs10);  // Treasury 10Y %
  const dffMonthly   = toMonthly(dff);    // Fed Funds %
  const hy    = rHy.status  === 'fulfilled' ? rHy.value  : null;
  const vixMon = rVix.status === 'fulfilled' ? rVix.value : null; // ya mensual via FRED frequency=m

  // VIX mensual → SMA200 sobre medias mensuales, score: por encima=−1, por debajo=+1
  const vixMonMap = new Map();
  if (vixMon && vixMon.length >= 200) {
    for (let i = 200; i < vixMon.length; i++) {
      const sma200 = vixMon.slice(i-200, i).reduce((s,p)=>s+p.value,0)/200;
      const above  = vixMon[i].value > sma200;
      const ym     = vixMon[i].date.slice(0,7);
      vixMonMap.set(ym, { value: +vixMon[i].value.toFixed(2), aboveSMA200: above, score: above ? -1 : 1 });
    }
  }
  // HY mensual (FRED ya entrega media mensual con frequency=m)
  const hyMonMap = new Map();
  if (hy) {
    hy.forEach(p => {
      const ym = p.date.slice(0,7);
      const score = p.value < 3.5 ? 1 : p.value < 5 ? 0 : -1;
      hyMonMap.set(ym, { value: +p.value.toFixed(3), score });
    });
  }
  // CPI Core → mensual map para Inflación (CPI Headline ya existe como cpiYoYMap)
  const cpiCoreAscFull = cpiCore ? [...cpiCore].reverse() : null;
  const cpiCoreYoYFull = yoySeries(cpiCoreAscFull);
  const cpiCoreYoYMap  = new Map(cpiCoreYoYFull.map(p => [p.date.slice(0,7), p.value]));
  const cpiCoreAsc   = cpiCore ? [...cpiCore].reverse() : null;
  const cpiYoY       = yoySeries(cpi);          // CPI Headline YoY (cpi ya viene asc desde fetch)
  const cpiCoreYoY   = yoySeries(cpiCoreAsc);  // Core CPI YoY
  const m2YoY    = yoySeries(m2v);
  const totllYoY = yoySeries(totll);
  const gdpYoY   = yoySeries(gdp);
  const spRaw    = normalizeBase100(sp);  // mantenemos para correlaciones
  // SP500 diario → mensual (media del mes) para forward returns históricos
  const spMonthly = sp ? toMonthly(sp) : [];
  const spNorm    = spMonthly; // raw mensual para timeline y spMap

  // Curva USD mensual
  const curvaUSD = (() => {
    if (!dgs10 || !dgs2) return null;
    const d2Map = new Map(dgs2.map(p => [p.date.slice(0, 7), p.value]));
    return dgs10.map(p => {
      const d2v = d2Map.get(p.date.slice(0, 7));
      return d2v != null ? { date: p.date, value: +(p.value - d2v).toFixed(2) } : null;
    }).filter(Boolean);
  })();

  // Tipo Real mensual (FFR - CPI YoY, alineados por fecha)
  const tipoReal = (() => {
    if (!dff || !cpiYoY) return null;
    const cpiMap = new Map(cpiYoY.map(p => [p.date.slice(0, 7), p.value]));
    return dff.map(p => {
      const cv = cpiMap.get(p.date.slice(0, 7));
      return cv != null ? { date: p.date, value: +(p.value - cv).toFixed(2) } : null;
    }).filter(Boolean);
  })();

  // Crédito vs nominal YoY diferencial
  const creditoVsNominal = (() => {
    if (!totllYoY || !gdpYoY) return null;
    const gdpMap = new Map(gdpYoY.map(p => [p.date.slice(0, 7), p.value]));
    return totllYoY.map(p => {
      const gv = gdpMap.get(p.date.slice(0, 7));
      return gv != null ? { date: p.date, value: +(p.value - gv).toFixed(2) } : null;
    }).filter(Boolean);
  })();

  // ── HIST_MACRO_V1_FRED ─────────────────────────────────────────
  // Macro Score Histórico — Proxy FRED (no es el Macro Score live canónico)
  // ScoreNorm = scoreRaw / maxScoreDisponible → [-1,+1]
  // Coverage  = maxScoreDisponible / 14      → [0,1]  (BBB excluido del denominador)
  // Coverage < 0.60 → valid = false
  const VERSION = 'HIST_MACRO_V1_FRED';
  const MAX_POSSIBLE = 14; // 1+1+1+3+3+2+2+1 (BBB excluido del score — doble conteo con Liquidez)
  const COVERAGE_MIN = 0.60;

  // Scoring functions (idénticos al motor live)
  const scCurvaH  = v => v >= 0.90 ? +1 : v >= 0.48 ?  0 : -1;
  const scTipoH   = v => v >= 1.00 ? +1 : v >= 0.50 ?  0 : -1;
  const scLeiH    = (niv, dlt) => niv > 100 && dlt > 0 ? +1 : niv < 100 && dlt < 0 ? -1 : 0;
  const scM2H     = v => v >= 5.0 ? +3 : v >= 3.0 ? +1 : -3;
  const scCredH   = v => v >= 3.0 ? +3 : v >= 1.5 ?  0 : -3;
  const scImpH    = v => v >= 1.0 ? +2 : v >= 0.5 ? +1 : -2;
  const scVelH    = v => v >= 0.0 ? +2 : v >= -1.5 ? -1 : -2;
  const scResH    = v => v >= 3.5 ? +1 : -1;  // maxScore=1: solo +1/-1 para mantener invariante |score|<=maxScore
  const scBbbH    = v => v <= 1.00 ? +1 : v <= 1.50 ? 0 : -1;

  // Mapas mensuales — media mensual para diarias, valor mensual para mensuales
  const curvaMap  = toMonthlyMap(curvaUSD);
  const dffMonMap = toMonthlyMap(toMonthly(dff));
  // cpiYoY para el histórico: cpi viene asc (desde 1947), calcular YoY directamente sin invertir
  const cpiYoYHistArr = yoySeries(cpi);  // cpi ya es asc desde fetch
  const cpiYoYMap = (() => { const m = new Map(); cpiYoYHistArr.forEach(p => m.set(p.date.slice(0,7), p.value)); return m; })();
  const leiMap    = (() => {
    if (!lei?.length) return new Map();
    const m = new Map(); let prev = null;
    [...lei].sort((a,b)=>a.date.localeCompare(b.date)).forEach(p => {
      m.set(p.date.slice(0,7), { value: p.value, delta: prev != null ? p.value - prev : 0 });
      prev = p.value;
    });
    return m;
  })();
  const m2slYoYMap = (() => {
    const ys = yoySeries(m2sl); const m = new Map();
    ys.forEach(p => m.set(p.date.slice(0,7), p.value)); return m;
  })();
  const totllYoYMap = (() => { const m = new Map(); totllYoY.forEach(p => m.set(p.date.slice(0,7), p.value)); return m; })();
  const gdpYoYMap   = (() => { const m = new Map(); gdpYoY.forEach(p => m.set(p.date.slice(0,7), p.value)); return m; })();
  // Impulso: YoY actual − YoY hace 3 meses (desde totllYoY)
  const totllYoYArr = totllYoY ? [...totllYoY].sort((a,b)=>a.date.localeCompare(b.date)) : [];
  const impMap = (() => {
    const m = new Map();
    totllYoYArr.forEach((p, i) => {
      if (i < 3) return;
      const p3m = totllYoYArr[i-3];
      m.set(p.date.slice(0,7), +(p.value - p3m.value).toFixed(2));
    });
    return m;
  })();
  const velM2Map = (() => { const ys = yoySeries(m2v); const m = new Map(); ys.forEach(p => m.set(p.date.slice(0,7), p.value)); return m; })();
  const resMap   = (() => {
    const m = new Map();
    toMonthly(wresbal).forEach(p => m.set(p.date.slice(0,7), +(p.value / 1_000_000).toFixed(3)));
    return m;
  })();
  const bbbMap   = toMonthlyMap(toMonthly(bbb));

  function toMonthlyMap(arr) {
    const m = new Map();
    if (arr?.length) arr.forEach(p => m.set(p.date?.slice(0,7) || p.date, p.value));
    return m;
  }

  // Construir matriz mensual desde 1976-01
  function buildHistMacroV1() {
    const months = new Set([
      ...curvaMap.keys(), ...cpiYoYMap.keys(), ...dffMonMap.keys(),
    ]);
    const sorted = [...months].filter(ym => ym >= '1976-01').sort();

    return sorted.map(ym => {
      const comps = {};

      // 1. Curva USD — maxScore 1
      const curva = curvaMap.get(ym);
      comps.curvaUSD = curva != null
        ? { value: curva, score: scCurvaH(curva), maxScore: 1, valid: true, source: 'DGS10-DGS2' }
        : { value: null, score: null, maxScore: 1, valid: false, source: 'DGS10-DGS2' };

      // 2. Tipo Real — maxScore 1
      const dffV = dffMonMap.get(ym), cpiV = cpiYoYMap.get(ym);
      const tr   = dffV != null && cpiV != null ? +(dffV - cpiV).toFixed(2) : null;
      comps.tipoReal = tr != null
        ? { value: tr, score: scTipoH(tr), maxScore: 1, valid: true, source: 'DFF-CPIAUCSL' }
        : { value: null, score: null, maxScore: 1, valid: false, source: 'DFF-CPIAUCSL' };

      // 3. LEI — maxScore 1
      const leiD = leiMap.get(ym);
      comps.lei = leiD != null
        ? { value: leiD.value, score: scLeiH(leiD.value, leiD.delta), maxScore: 1, valid: true, source: 'USALOLITOAASTSAM' }
        : { value: null, score: null, maxScore: 1, valid: false, source: 'USALOLITOAASTSAM' };

      // 4. M2 USA YoY — maxScore 3 (proxy M2 Global)
      const m2V = m2slYoYMap.get(ym);
      comps.m2usa = m2V != null
        ? { value: m2V, score: scM2H(m2V), maxScore: 3, valid: true, source: 'M2SL_YoY', note: 'proxy M2 Global' }
        : { value: null, score: null, maxScore: 3, valid: false, source: 'M2SL_YoY' };

      // 5. Crédito vs PIB — maxScore 3
      const totYoY = totllYoYMap.get(ym), gdpYoYV = gdpYoYMap.get(ym);
      const credDiff = totYoY != null && gdpYoYV != null ? +(totYoY - gdpYoYV).toFixed(2) : null;
      comps.creditoVsPib = credDiff != null
        ? { value: credDiff, score: scCredH(credDiff), maxScore: 3, valid: true, source: 'TOTLL-GDP_YoY' }
        : { value: null, score: null, maxScore: 3, valid: false, source: 'TOTLL-GDP_YoY' };

      // 6. Impulso Crediticio — maxScore 2
      const impV = impMap.get(ym);
      comps.impulso = impV != null
        ? { value: impV, score: scImpH(impV), maxScore: 2, valid: true, source: 'TOTLL_accel3M' }
        : { value: null, score: null, maxScore: 2, valid: false, source: 'TOTLL_accel3M' };

      // 7. Velocidad M2 — maxScore 2
      const velV = velM2Map.get(ym);
      comps.velM2 = velV != null
        ? { value: velV, score: scVelH(velV), maxScore: 2, valid: true, source: 'M2V_YoY' }
        : { value: null, score: null, maxScore: 2, valid: false, source: 'M2V_YoY' };

      // 8. Reservas — maxScore 1
      const resV = resMap.get(ym);
      comps.reservas = resV != null
        ? { value: resV, score: scResH(resV), maxScore: 1, valid: true, source: 'WRESBAL_T' }
        : { value: null, score: null, maxScore: 1, valid: false, source: 'WRESBAL_T' };

      // 9. BBB Spread — almacenado en vector para analogías, score=0 (excluido del Macro Score)
      const bbbV = bbbMap.get(ym);
      comps.bbb = bbbV != null
        ? { value: bbbV, score: 0, maxScore: 0, maxAnalogias: 1, valid: true, source: 'BAMLC0A4CBBB', note: 'Max Macro: 0 | Analogías: ±1' }
        : { value: null, score: null, maxScore: 0, maxAnalogias: 1, valid: false, source: 'BAMLC0A4CBBB' };

      // 10. HY Spread — RISK_RADAR_V1 Sentimiento (no en HIST_MACRO_V1 score, maxScore=0)
      const hyV = hyMonMap.get(ym);
      comps.hy = hyV != null
        ? { value: hyV.value, score: hyV.score, maxScore: 0, valid: true, source: 'BAMLH0A0HYM2', note: 'RISK_RADAR_V1 Sentimiento — excluido de HIST_MACRO_V1 score' }
        : { value: null, score: null, maxScore: 0, valid: false, source: 'BAMLH0A0HYM2' };

      // 11. VIX vs SMA200 — RISK_RADAR_V1 Sentimiento (disponible desde 1990, maxScore=0)
      const vixV = vixMonMap.get(ym);
      comps.vix = vixV != null
        ? { value: vixV.value, aboveSMA200: vixV.aboveSMA200, score: vixV.score, maxScore: 0, valid: true, source: 'VIXCLS_SMA200', note: 'RISK_RADAR_V1 Sentimiento — desde 1990' }
        : { value: null, score: null, maxScore: 0, valid: false, source: 'VIXCLS_SMA200' };

      // 12. CPI Headline YoY — RISK_RADAR_V1 Inflación (ya en tipoReal como input, maxScore=0 para no doble contar)
      const cpiHeadlineV = cpiYoYMap.get(ym);
      const scCpiH = v => v <= 2.5 ? 1 : v <= 3.5 ? 0 : -1;
      comps.cpiHeadline = cpiHeadlineV != null
        ? { value: +cpiHeadlineV.toFixed(2), score: scCpiH(cpiHeadlineV), maxScore: 0, valid: true, source: 'CPIAUCSL_YoY', note: 'RISK_RADAR_V1 Inflación — maxScore=0 en HIST_MACRO_V1 (input de tipoReal)' }
        : { value: null, score: null, maxScore: 0, valid: false, source: 'CPIAUCSL_YoY' };

      // 13. Core CPI YoY — RISK_RADAR_V1 Inflación (maxScore=0)
      const cpiCoreV = cpiCoreYoYMap.get(ym);
      const scCoreCpiH = v => v <= 2.5 ? 1 : v <= 3.0 ? 0 : -1;
      comps.cpiCore = cpiCoreV != null
        ? { value: +cpiCoreV.toFixed(2), score: scCoreCpiH(cpiCoreV), maxScore: 0, valid: true, source: 'CPILFESL_YoY', note: 'RISK_RADAR_V1 Inflación — maxScore=0 en HIST_MACRO_V1' }
        : { value: null, score: null, maxScore: 0, valid: false, source: 'CPILFESL_YoY' };

      // Agregación — BBB con maxScore=0 no suma al denominador
      const valid = Object.values(comps).filter(c => c.valid && c.maxScore > 0);
      const scoreRaw    = valid.reduce((s, c) => s + c.score, 0);
      const maxAvailable = valid.reduce((s, c) => s + c.maxScore, 0);
      const coverage    = +(maxAvailable / MAX_POSSIBLE).toFixed(3);
      const scoreNorm   = maxAvailable > 0 ? +(scoreRaw / maxAvailable).toFixed(3) : null;

      // HARD invariants — verificar consistencia matemática
      const violations = [];
      Object.entries(comps).forEach(([k, c]) => {
        if (c.valid && c.maxScore > 0 && c.score != null) {
          if (Math.abs(c.score) > c.maxScore)
            violations.push(`${k}: |score|=${Math.abs(c.score)} > maxScore=${c.maxScore}`);
        }
      });
      if (scoreNorm != null && (scoreNorm < -1.001 || scoreNorm > 1.001))
        violations.push(`scoreNorm=${scoreNorm} fuera de [-1,+1]`);
      if (maxAvailable > 0 && Math.abs(scoreRaw) > maxAvailable)
        violations.push(`|scoreRaw|=${Math.abs(scoreRaw)} > maxAvailable=${maxAvailable}`);

      return {
        month: ym,
        components: comps,
        scoreRaw,
        maxAvailable,
        scoreNorm,
        coverage,
        valid: coverage >= COVERAGE_MIN && violations.length === 0,
        violations: violations.length ? violations : undefined,
        version: VERSION,
      };
    });
  }

  const histMacroV1 = buildHistMacroV1();

  // ── Fase 2B: Motor de Analogías ────────────────────────────────
  const VECTOR_KEYS   = ['curvaUSD','tipoReal','lei','m2usa','creditoVsPib','impulso','velM2','reservas','bbb'];
  const VECTOR_MAXSC  = { curvaUSD:1, tipoReal:1, lei:1, m2usa:3, creditoVsPib:3, impulso:2, velM2:2, reservas:1, bbb:1 };
  const MIN_DIMS      = 6;
  const EXCLUDE_LAST  = 12;

  const spMapFirst = spNorm.length ? spNorm[0].date.slice(0,7) : '—';
  const spMapLast  = spNorm.length ? spNorm[spNorm.length-1].date.slice(0,7) : '—';
  const spMap = new Map(spNorm.map(p => [p.date.slice(0,7), p.value]));

  // Early return para type=radar — solo stress test, sin analogías ni correlaciones pesadas
  if (type === 'radar') {
    // Construir radarStressTest inline (reutiliza funciones declaradas abajo via hoisting)
    // spReturn y maxDrawdown se definen después pero en mismo scope de función
    // Usamos approach directo sin llamar funciones no declaradas aún
    const fwdM3 = new Map(), fwdM6 = new Map(), fwdM12 = new Map();
    for (const [ym] of spMap) {
      const base = new Date(ym + '-01');
      [3,6,12].forEach(h => {
        const t = new Date(base); t.setMonth(t.getMonth() + h);
        const tym = t.toISOString().slice(0,7);
        const from = spMap.get(ym), to = spMap.get(tym);
        if (from && to) {
          const r = +((to/from-1)*100).toFixed(2);
          if (h===3) fwdM3.set(ym,r); else if (h===6) fwdM6.set(ym,r); else fwdM12.set(ym,r);
        }
      });
    }
    function maxDD12(fromYM) {
      const from = spMap.get(fromYM); if (!from) return null;
      let peak=from, maxD=0;
      for (let i=1;i<=12;i++){const t=new Date(fromYM+'-01');t.setMonth(t.getMonth()+i);const v=spMap.get(t.toISOString().slice(0,7));if(!v)continue;if(v>peak)peak=v;const d=(v-peak)/peak*100;if(d<maxD)maxD=d;}
      return +maxD.toFixed(2);
    }
    function fwdStats(months) {
      const r3=months.map(m=>fwdM3.get(m)).filter(v=>v!=null);
      const r6=months.map(m=>fwdM6.get(m)).filter(v=>v!=null);
      const r12=months.map(m=>fwdM12.get(m)).filter(v=>v!=null);
      const dd=months.map(m=>maxDD12(m)).filter(v=>v!=null);
      const med=arr=>{const s=[...arr].sort((a,b)=>a-b);return s.length?+s[Math.floor(s.length/2)].toFixed(2):null;};
      return {n:months.length,n3m:r3.length,med3m:med(r3),pctPos3m:r3.length?+(r3.filter(v=>v>0).length/r3.length*100).toFixed(1):null,n6m:r6.length,med6m:med(r6),pctPos6m:r6.length?+(r6.filter(v=>v>0).length/r6.length*100).toFixed(1):null,n12m:r12.length,med12m:med(r12),pctPos12m:r12.length?+(r12.filter(v=>v>0).length/r12.length*100).toFixed(1):null,medDD:med(dd)};
    }
    // Pearson/Spearman simples para validación
    function pearsonSimple(xs,ys){if(xs.length<15)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let num=0,dx2=0,dy2=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}const d=Math.sqrt(dx2*dy2);if(!d)return null;const r=num/d,n=xs.length,t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10);const z=Math.abs(t),p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null;return{rho:+r.toFixed(3),n,p:p!=null?+p.toFixed(4):null};}
    function rankArr(arr){const s=[...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);const r=new Array(arr.length);let i=0;while(i<s.length){let j=i;while(j<s.length&&s[j].v===s[i].v)j++;const avg=(i+j-1)/2;for(let k=i;k<j;k++)r[s[k].i]=avg;i=j;}return r;}
    function spearmanSimple(xs,ys){return pearsonSimple(rankArr(xs),rankArr(ys));}

    // ── Stress test por INDICADOR ─────────────────────────────
    const RADAR_IND = [
      {id:'curvaUSD', block:'Ciclo',    source:'HIST_MACRO_V1', getter:m=>m.components?.curvaUSD, scoreFrom:c=>c?.score??null},
      {id:'lei',      block:'Ciclo',    source:'HIST_MACRO_V1', getter:m=>m.components?.lei,       scoreFrom:c=>c?.score??null},
      {id:'m2usa',    block:'Liquidez', source:'HIST_MACRO_V1', getter:m=>m.components?.m2usa,     scoreFrom:c=>c?.score??null},
      {id:'impulso',  block:'Liquidez', source:'HIST_MACRO_V1', getter:m=>m.components?.impulso,   scoreFrom:c=>c?.score??null},
      {id:'velM2',    block:'Liquidez', source:'HIST_MACRO_V1', getter:m=>m.components?.velM2,     scoreFrom:c=>c?.score??null},
      {id:'creditoVsPib',block:'Liquidez',source:'HIST_MACRO_V1',getter:m=>m.components?.creditoVsPib,scoreFrom:c=>c?.score??null},
      {id:'bbb',      block:'Crédito',  source:'SHARED',        getter:m=>m.components?.bbb,       scoreFrom:c=>c?.value!=null?(c.value<=1?1:c.value<=1.5?0:-1):null},
      {id:'tipoReal', block:'Política', source:'HIST_MACRO_V1', getter:m=>m.components?.tipoReal,  scoreFrom:c=>c?.score??null},
      {id:'reservas', block:'Política', source:'HIST_MACRO_V1', getter:m=>m.components?.reservas,  scoreFrom:c=>c?.score??null, structuralNote:'STRUCTURAL_REVIEW — nivel nominal no estacionario entre regímenes QE/QT'},
    ];
    // Ampliar RADAR_IND con Sentimiento e Inflación para el stress test
    // (declarado aquí, antes de su primer uso — antes vivía más abajo y rompía con TDZ ReferenceError)
    const RADAR_IND_EXTENDED = [...RADAR_IND,
      {id:'hy',          block:'Sentimiento', source:'RISK_RADAR_V1', getter:m=>m.components?.hy,          scoreFrom:c=>c?.score??null},
      {id:'vix',         block:'Sentimiento', source:'RISK_RADAR_V1', getter:m=>m.components?.vix,         scoreFrom:c=>c?.score??null},
      {id:'cpiHeadline', block:'Inflación',   source:'RISK_RADAR_V1', getter:m=>m.components?.cpiHeadline, scoreFrom:c=>c?.score??null},
      {id:'cpiCore',     block:'Inflación',   source:'RISK_RADAR_V1', getter:m=>m.components?.cpiCore,     scoreFrom:c=>c?.score??null},
    ];

    const rst = {};
    for (const ind of RADAR_IND_EXTENDED) {
      const byScore={},xs=[],ys6=[],ybin=[];
      for (const m of histMacroV1) {
        if(!m.valid) continue;
        const sc=ind.scoreFrom(ind.getter(m));
        if(sc==null) continue;
        const key=sc>=0?'+'+sc:String(sc);
        if(!byScore[key]) byScore[key]=[];
        byScore[key].push(m.month);
        const r6=fwdM6.get(m.month),r12=fwdM12.get(m.month);
        if(r6!=null){xs.push(sc);ys6.push(r6);}
        if(r12!=null){ybin.push(r12>0?1:0);}
      }
      const bss={};
      for(const[k2,months] of Object.entries(byScore)) if(months.length) bss[k2]=fwdStats(months);
      const insuffN=Object.values(bss).every(v=>v.n<10)||xs.length<15;
      const spR6=spearmanSimple(xs,ys6),spBin=spearmanSimple(xs,ybin.slice(0,xs.length));
      const status=insuffN?'INSUFFICIENT_N':(spBin?.p!=null&&spBin.p<0.05)?'VALIDATED':(spBin?.p!=null&&spBin.p<0.15)?'WEAK':'UNSTABLE';
      rst[ind.id]={block:ind.block,source:ind.source,structuralNote:ind.structuralNote,byScore:bss,pearsonR6:pearsonSimple(xs,ys6),spearmanR6:spR6,spearmanBin:spBin,status};
    }

    // ── Stress test por BLOQUE ─────────────────────────────────
    // ── Stress test por BLOQUE ─────────────────────────────────
    const BLOCK_DEFS={
      Ciclo:    {inds:['curvaUSD','lei']},
      Liquidez: {inds:['m2usa','impulso','velM2','creditoVsPib']},
      Crédito:  {inds:['bbb']},
      Sentimiento:{inds:['hy','vix'], note:'F&G excluido (LIVE_ONLY, sin serie histórica FRED). VIX disponible desde 1990.'},
      Política: {inds:['tipoReal','reservas']},
      Inflación:{inds:['cpiHeadline','cpiCore'], note:'CPI/Core son RISK_RADAR_V1, maxScore=0 en HIST_MACRO_V1. Input de tipoReal pero score propio.'},
    };
    const blockResults={};
    for(const[bName,bDef] of Object.entries(BLOCK_DEFS)){
      if(bDef.inds && !bDef.inds.length){
        blockResults[bName]={note:bDef.note,unavailable:true};
        continue;
      }
      const scoreByMonth={};
      for(const m of histMacroV1){
        if(!m.valid) continue;
        let bSc=0,nV=0;
        for(const indId of bDef.inds){const ind=RADAR_IND_EXTENDED.find(i=>i.id===indId);const sc=ind?.scoreFrom(ind.getter(m));if(sc!=null){bSc+=sc;nV++;}}
        if(nV>0) scoreByMonth[m.month]=bSc;
      }
      const byScore={},xs=[],ys6=[],ys12=[],ybin=[],xsDD=[],ysDD=[],ysDD10=[];
      for(const[ym,sc] of Object.entries(scoreByMonth)){
        const key=sc>=0?'+'+sc:String(sc);
        if(!byScore[key]) byScore[key]=[];
        byScore[key].push(ym);
        const r6=fwdM6.get(ym),r12=fwdM12.get(ym),dd=maxDD12(ym);
        if(r6!=null){xs.push(sc);ys6.push(r6);}
        if(r12!=null){ys12.push(r12);ybin.push(r12>0?1:0);}
        if(dd!=null){xsDD.push(sc);ysDD.push(dd);ysDD10.push(dd<-10?1:0);}
      }
      const bss={};
      for(const[k,months] of Object.entries(byScore)){
        if(months.length){
          bss[k]={...fwdStats(months), ds6:downsideStats(months,6), ds12:downsideStats(months,12)};
        }
      }
      // Spearman bloques
      const spR6   = spearmanSimple(xs,ys6);
      const spBin  = spearmanSimple(xs,ybin.slice(0,xs.length));
      const spDD   = spearmanSimple(xsDD,ysDD);
      const spDD10 = spearmanSimple(xsDD,ysDD10);
      // Clasificación
      const n=xs.length;
      const status = n<15?'INSUFFICIENT_N'
        : (spDD?.p!=null&&spDD.p<0.05)||(spBin?.p!=null&&spBin.p<0.05)?'VALIDATED'
        : (spDD?.p!=null&&spDD.p<0.15)||(spBin?.p!=null&&spBin.p<0.15)?'WEAK':'UNSTABLE';
      blockResults[bName]={byScore:bss,spearmanR6:spR6,spearmanBin:spBin,spearmanDD:spDD,spearmanDD10:spDD10,status,n};
    }

    // ── Stress test SCORE TOTAL ────────────────────────────────
    const totalPairs=[];
    for(const m of histMacroV1){
      if(!m.valid) continue;
      let tot=0,nV=0;
      for(const ind of RADAR_IND){const sc=ind.scoreFrom(ind.getter(m));if(sc!=null){tot+=sc;nV++;}}
      if(nV>=4&&fwdM6.get(m.month)!=null) totalPairs.push({ym:m.month,sc:tot});
    }
    totalPairs.sort((a,b)=>a.sc-b.sc||a.ym.localeCompare(b.ym));
    const Ntp=totalPairs.length;
    totalPairs.forEach((p,i)=>{p.q=Math.min(5,Math.floor(i*5/Ntp)+1);});
    // Función de downside risk metrics por lista de meses
    function downsideStats(months, horizon) {
      const fwdMap = horizon===3?fwdM3:horizon===6?fwdM6:fwdM12;
      const returns = months.map(m=>fwdMap.get(m)).filter(v=>v!=null);
      const dds = months.map(m=>maxDD12(m)).filter(v=>v!=null);
      if (!returns.length) return null;
      const sorted = [...returns].sort((a,b)=>a-b);
      const ddSorted = [...dds].sort((a,b)=>a-b);
      const pctile = (arr,p) => arr.length ? +arr[Math.max(0,Math.floor(arr.length*p)-1)].toFixed(2) : null;
      const n = returns.length;
      // VaR 95% = percentile 5 del retorno
      const var95 = pctile(sorted, 0.05);
      // CVaR 95% = media de los peores 5%
      const nCVar = Math.max(1, Math.floor(n*0.05));
      const cvar95 = +(sorted.slice(0,nCVar).reduce((a,b)=>a+b,0)/nCVar).toFixed(2);
      const worstReturn = sorted[0];
      const p10 = pctile(sorted, 0.10);
      const probDD10 = dds.length ? +(dds.filter(d=>d<-10).length/dds.length*100).toFixed(1) : null;
      const probDD15 = dds.length ? +(dds.filter(d=>d<-15).length/dds.length*100).toFixed(1) : null;
      const medDD = ddSorted.length ? +ddSorted[Math.floor(ddSorted.length/2)].toFixed(2) : null;
      return {n, var95, cvar95, worstReturn, p10, probDD10, probDD15, medDD,
              pctPos: +(returns.filter(v=>v>0).length/n*100).toFixed(1)};
    }

    const quintileResults=[1,2,3,4,5].map(q=>{
      const sl=totalPairs.filter(p=>p.q===q);
      const scores=sl.map(p=>p.sc);
      const months=sl.map(p=>p.ym);
      return{
        quintile:q,
        minScore:scores.length?Math.min(...scores):null,
        maxScore:scores.length?Math.max(...scores):null,
        ...fwdStats(months),
        ds6:  downsideStats(months,6),
        ds12: downsideStats(months,12),
      };
    });
    // Spearman ScoreTotal → MaxDD y → Prob(DD>10%)
    const ddPairs = totalPairs.map(p=>({sc:p.sc, dd:maxDD12(p.ym)})).filter(p=>p.dd!=null);
    const spDD    = spearmanSimple(ddPairs.map(p=>p.sc), ddPairs.map(p=>p.dd));
    const dd10Pairs = ddPairs.map(p=>({sc:p.sc, bin:p.dd<-10?1:0}));
    const spDD10  = spearmanSimple(dd10Pairs.map(p=>p.sc), dd10Pairs.map(p=>p.bin));
    const tsXs=totalPairs.map(p=>p.sc),tsY6=totalPairs.map(p=>fwdM6.get(p.ym));
    const t12=totalPairs.filter(p=>fwdM12.get(p.ym)!=null);
    const tsXs12=t12.map(p=>p.sc),tsYbin=t12.map(p=>fwdM12.get(p.ym)>0?1:0);
    const chronoPairs=[...totalPairs].sort((a,b)=>a.ym.localeCompare(b.ym));
    const bSz=Math.floor(chronoPairs.length/3);
    const stability=['Early','Mid','Recent'].map((label,i)=>{
      const bl=chronoPairs.slice(i*bSz,i===2?chronoPairs.length:(i+1)*bSz);
      const xs=bl.map(p=>p.sc),ys=bl.map(p=>fwdM6.get(p.ym));
      const res=pearsonSimple(xs,ys);
      return{label,n:bl.length,first:bl[0]?.ym,last:bl[bl.length-1]?.ym,rho:res?.rho??null,p:res?.p??null};
    });

    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      radarStressTest: rst,
      radarBlockStress: blockResults,
      radarScoreTotal: {quintiles:quintileResults,validation:{nTotal:Ntp,pearsonR6:pearsonSimple(tsXs,tsY6),spearmanR6:spearmanSimple(tsXs,tsY6),spearmanBin:spearmanSimple(tsXs12,tsYbin),spearmanDD:spDD,spearmanDD10:spDD10,stability}},
      errors: errs.length?errs:undefined,
    });
  }

  // ── BLOCK VALIDATION REPORT (type=blockvalidation) ──────────
  if (type === 'blockvalidation') {
    const fm3v = new Map(), fm6v = new Map(), fm12v = new Map();
    for (const [ym] of spMap) {
      const b=new Date(ym+'-01');
      [[3,fm3v],[6,fm6v],[12,fm12v]].forEach(([h,m])=>{
        const t=new Date(b); t.setMonth(t.getMonth()+h);
        const ty=t.toISOString().slice(0,7), fr=spMap.get(ym), to=spMap.get(ty);
        if(fr&&to) m.set(ym,+((to/fr-1)*100).toFixed(3));
      });
    }
    function bvDD(fromYM,months){const fr=spMap.get(fromYM);if(!fr)return null;let pk=fr,mx=0;for(let i=1;i<=months;i++){const t=new Date(fromYM+'-01');t.setMonth(t.getMonth()+i);const v=spMap.get(t.toISOString().slice(0,7));if(!v)continue;if(v>pk)pk=v;const d=(v-pk)/pk*100;if(d<mx)mx=d;}return+mx.toFixed(3);}
    function bvSt(months){
      const r3=months.map(m=>fm3v.get(m)).filter(v=>v!=null),r6=months.map(m=>fm6v.get(m)).filter(v=>v!=null),r12=months.map(m=>fm12v.get(m)).filter(v=>v!=null);
      const dd6=months.map(m=>bvDD(m,6)).filter(v=>v!=null),dd12=months.map(m=>bvDD(m,12)).filter(v=>v!=null);
      const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return+s[Math.floor(s.length/2)].toFixed(2);};
      const pct=(a,p)=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return+s[Math.max(0,Math.floor(s.length*p)-1)].toFixed(2);};
      const nc=n=>Math.max(1,Math.floor(n*0.05));
      return{n:months.length,medR3:med(r3),medR6:med(r6),medR12:med(r12),pctPos12:r12.length?+(r12.filter(v=>v>0).length/r12.length*100).toFixed(1):null,medDD6:med(dd6),medDD12:med(dd12),pDD10:dd12.length?+(dd12.filter(d=>d<-10).length/dd12.length*100).toFixed(1):null,pDD15:dd12.length?+(dd12.filter(d=>d<-15).length/dd12.length*100).toFixed(1):null,var95:r12.length?pct([...r12].sort((x,y)=>x-y),0.05):null,cvar95:r12.length?(()=>{const s=[...r12].sort((x,y)=>x-y),nc2=nc(r12.length);return+(s.slice(0,nc2).reduce((a,b)=>a+b,0)/nc2).toFixed(2);})():null,worstR12:r12.length?+Math.min(...r12).toFixed(2):null,lowN:months.length<10};
    }
    function bvP(xs,ys){if(!xs||xs.length<10)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let num=0,dx2=0,dy2=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}const d=Math.sqrt(dx2*dy2);if(!d)return null;const r=num/d,n=xs.length,t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10),z=Math.abs(t),p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null,zr=0.5*Math.log((1+r)/(1-r+1e-10)),se=1/Math.sqrt(n-3);return{rho:+r.toFixed(3),n,p:p!=null?+p.toFixed(4):null,ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)]};}
    function bvRk(arr){const s=[...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);const r=new Array(arr.length);let i=0;while(i<s.length){let j=i;while(j<s.length&&s[j].v===s[i].v)j++;const avg=(i+j-1)/2;for(let k=i;k<j;k++)r[s[k].i]=avg;i=j;}return r;}
    function bvSp(xs,ys){return bvP(bvRk(xs),bvRk(ys));}
    function bvBoot(pairs,NSIM=5000,BL=12){const T=pairs.length;if(T<15)return null;function rhoF(a){const n=a.length,rx=bvRk(a.map(p=>p[0])),ry=bvRk(a.map(p=>p[1]));const mx=rx.reduce((a,b)=>a+b,0)/n,my=ry.reduce((a,b)=>a+b,0)/n;let num=0,dx2=0,dy2=0;for(let i=0;i<n;i++){const a2=rx[i]-mx,b2=ry[i]-my;num+=a2*b2;dx2+=a2*a2;dy2+=b2*b2;}const d=Math.sqrt(dx2*dy2);return d?num/d:0;}const rO=rhoF(pairs);let sd=20260823;function rnd(){sd=(sd*1664525+1013904223)&0xFFFFFFFF;return(sd>>>0)/4294967296;}const bt=[];for(let s=0;s<NSIM;s++){const sm=[];while(sm.length<T){const st=Math.floor(rnd()*(T-BL+1));for(let k=0;k<BL&&sm.length<T;k++)sm.push(pairs[(st+k)%T]);}bt.push(rhoF(sm.slice(0,T)));}bt.sort((a,b)=>a-b);const ci025=bt[Math.floor(NSIM*0.025)],ci975=bt[Math.floor(NSIM*0.975)],pB=(rO<0?bt.filter(r=>r>=0).length:bt.filter(r=>r<=0).length)/NSIM;return{rhoObs:+rO.toFixed(3),ci95:[+ci025.toFixed(3),+ci975.toFixed(3)],pBoot:+pB.toFixed(4),excludes0:(rO<0&&ci975<0)||(rO>0&&ci025>0),T,NSIM,BL};}
    function bvNO(pairs){const s=[...pairs].sort((a,b)=>a[0].localeCompare(b[0]));const sel=[];let last=null;for(const p of s){if(!last||(new Date(p[0]+'-01')-new Date(last+'-01'))>=365*24*3600*1e3*0.95){sel.push(p);last=p[0];}}if(sel.length<10)return{n:sel.length,insufficient:true};const res=bvSp(sel.map(p=>p[1]),sel.map(p=>p[2]));return{n:sel.length,...(res||{})};}

    const IND_G={curvaUSD:m=>m.components?.curvaUSD?.score??null,lei:m=>m.components?.lei?.score??null,m2usa:m=>m.components?.m2usa?.score??null,impulso:m=>m.components?.impulso?.score??null,velM2:m=>m.components?.velM2?.score??null,creditoVsPib:m=>m.components?.creditoVsPib?.score??null,bbb:m=>{const v=m.components?.bbb?.value;return v!=null?(v<=1?1:v<=1.5?0:-1):null;},hy:m=>m.components?.hy?.score??null,vix:m=>m.components?.vix?.score??null,cpiHeadline:m=>m.components?.cpiHeadline?.score??null,cpiCore:m=>m.components?.cpiCore?.score??null,tipoReal:m=>m.components?.tipoReal?.score??null,reservas:m=>m.components?.reservas?.score??null};
    const BV_BL={'Ciclo Económico':{inds:['curvaUSD','lei']},'Liquidez Global':{inds:['m2usa','impulso','velM2','creditoVsPib']},'Crédito':{inds:['bbb'],note:'BBB score propio RISK_RADAR_V1'},'Sentimiento':{inds:['hy','vix'],note:'F&G=LIVE_ONLY excluido. VIX desde 1990.'},'Política Monetaria':{inds:['tipoReal','reservas']},'Inflación':{inds:['cpiHeadline','cpiCore'],note:'maxScore=0 en HIST_MACRO_V1; regla RISK_RADAR_V1 propia'}};

    const bVal={};
    for(const[bN,bD] of Object.entries(BV_BL)){
      const monthly=[];
      for(const m of histMacroV1){if(!m.valid)continue;let bSc=0,nV=0;for(const id of bD.inds){const sc=IND_G[id]?.(m);if(sc!=null){bSc+=sc;nV++;}}if(nV>0)monthly.push({ym:m.month,bSc,nV,nT:bD.inds.length});}
      const byScore={};
      for(const d of monthly){const k=d.bSc>=0?'+'+d.bSc:String(d.bSc);if(!byScore[k])byScore[k]=[];byScore[k].push(d.ym);}
      const bss={};for(const[k,ms] of Object.entries(byScore))bss[k]=bvSt(ms);
      const p6=[],p12=[],pDD6=[],pDD12=[],pBin=[],pDD10=[],pDD15=[];
      for(const d of monthly){const r6=fm6v.get(d.ym),r12=fm12v.get(d.ym),dd6=bvDD(d.ym,6),dd12=bvDD(d.ym,12);if(r6!=null)p6.push([d.ym,d.bSc,r6]);if(r12!=null){p12.push([d.ym,d.bSc,r12]);pBin.push([d.ym,d.bSc,r12>0?1:0]);}if(dd6!=null)pDD6.push([d.ym,d.bSc,dd6]);if(dd12!=null){pDD12.push([d.ym,d.bSc,dd12]);pDD10.push([d.ym,d.bSc,dd12<-10?1:0]);pDD15.push([d.ym,d.bSc,dd12<-15?1:0]);}}
      const sp=p=>bvSp(p.map(q=>q[1]),p.map(q=>q[2]));
      const corr={spR6:sp(p6),spR12:sp(p12),spDD6:sp(pDD6),spDD12:sp(pDD12),spBin12:sp(pBin),spDD10:sp(pDD10),spDD15:sp(pDD15)};
      const btTarget=pDD12.length>=15?pDD12:pBin;
      const boot=bvBoot(btTarget.map(p=>[p[1],p[2]])),bootBin=bvBoot(pBin.map(p=>[p[1],p[2]]));
      const noOvDD=bvNO(pDD12),noOvBin=bvNO(pBin);
      const chrono=[...p6].sort((a,b)=>a[0].localeCompare(b[0]));
      const bSzT=Math.floor(chrono.length/3);
      const temp=['Early','Mid','Recent'].map((label,i)=>{const bl=chrono.slice(i*bSzT,i===2?chrono.length:(i+1)*bSzT);const res=bvSp(bl.map(p=>p[1]),bl.map(p=>p[2]));return{label,n:bl.length,first:bl[0]?.[0],last:bl[bl.length-1]?.[0],rho:res?.rho??null,p:res?.p??null,ci95:res?.ci95??null};});
      const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho)),regDep=signs.length>=2&&signs.some(s=>s!==signs[0]);
      const mainN=Math.max(p12.length,pDD12.length);
      const hasRobust=(boot?.excludes0)||(noOvDD?.rho!=null&&noOvDD?.ci95&&((noOvDD.rho<0&&noOvDD.ci95[1]<0)||(noOvDD.rho>0&&noOvDD.ci95[0]>0)));
      const indicative=(boot?.pBoot!=null&&boot.pBoot<0.1)||(corr.spDD12?.p!=null&&corr.spDD12.p<0.1)||(corr.spBin12?.p!=null&&corr.spBin12.p<0.1);
      const descriptive=(corr.spDD12?.p??1)>0.3&&(corr.spBin12?.p??1)>0.3&&(corr.spR12?.p??1)>0.3;
      const verdict=mainN<15?'INSUFFICIENT DATA':regDep?'REGIME DEPENDENT':hasRobust?'ROBUST RISK SIGNAL':indicative?'INDICATIVE RISK SIGNAL':descriptive?'DESCRIPTIVE ONLY':'INDICATIVE RISK SIGNAL';
      bVal[bN]={note:bD.note,n:monthly.length,nWith12m:p12.length,byScore:bss,corr,boot,bootBin,noOvDD,noOvBin,temp,regDep,verdict};
    }
    const cmpV={};
    for(const id of['hy','vix','cpiHeadline','cpiCore']){
      const p12c=[],pDD12c=[],pBinc=[];
      for(const m of histMacroV1){if(!m.valid)continue;const sc=IND_G[id]?.(m);if(sc==null)continue;const r12=fm12v.get(m.month),dd12=bvDD(m.month,12);if(r12!=null){p12c.push([m.month,sc,r12]);pBinc.push([m.month,sc,r12>0?1:0]);}if(dd12!=null)pDD12c.push([m.month,sc,dd12]);}
      const sp=p=>bvSp(p.map(q=>q[1]),p.map(q=>q[2]));
      cmpV[id]={n:p12c.length,spR12:sp(p12c),spDD12:sp(pDD12c),spBin12:sp(pBinc),boot:bvBoot(pDD12c.map(p=>[p[1],p[2]])),noOverlap:bvNO(pDD12c)};
    }
    return res.status(200).json({updatedAt:new Date().toISOString(),blockValidation:bVal,componentValidation:cmpV,summary:Object.fromEntries(Object.entries(bVal).map(([k,v])=>[k,{verdict:v.verdict,n:v.n,regDep:v.regDep}])),errors:errs.length?errs:undefined});
  }

  function spReturn(fromYM, monthsForward) {
    const from = spMap.get(fromYM);
    if (from == null || from === 0) return null;
    // Buscar mes t+N (puede no ser exacto — tomar el más próximo dentro de ±1 mes)
    const target = new Date(fromYM + '-01');
    target.setMonth(target.getMonth() + monthsForward);
    const targetYM = target.toISOString().slice(0,7);
    const to = spMap.get(targetYM) || spMap.get(
      // fallback ±1 mes
      (() => { const t2 = new Date(target); t2.setMonth(t2.getMonth()-1); return t2.toISOString().slice(0,7); })()
    );
    if (to == null) return null;
    return +((to / from - 1) * 100).toFixed(2);
  }

  function maxDrawdown(fromYM, months) {
    const from = spMap.get(fromYM);
    if (from == null || from === 0) return null;
    let peak = from, maxDD = 0;
    for (let i = 1; i <= months; i++) {
      const t = new Date(fromYM + '-01');
      t.setMonth(t.getMonth() + i);
      const v = spMap.get(t.toISOString().slice(0,7));
      if (v == null) continue;
      if (v > peak) peak = v;
      const dd = (v - peak) / peak * 100;
      if (dd < maxDD) maxDD = dd;
    }
    return +maxDD.toFixed(2);
  }

  // Normalización point-in-time (z-score winsorizado)
  // Para cada mes t, stats calculados SOLO con datos disponibles hasta t
  // Evita look-ahead bias en validación histórica
  // Cache de stats por mes para eficiencia
  const _statsCache = new Map();

  function getDimStats(upToMonth) {
    if (_statsCache.has(upToMonth)) return _statsCache.get(upToMonth);
    const eligible = histMacroV1.filter(m => m.valid && m.month <= upToMonth);
    const stats = {};
    VECTOR_KEYS.forEach(k => {
      const vals = eligible
        .filter(m => m.components[k]?.valid && m.components[k]?.value != null)
        .map(m => m.components[k].value);
      if (!vals.length) { stats[k] = { mean: 0, std: 1, p5: 0, p95: 0 }; return; }
      const mean = vals.reduce((a,b) => a+b, 0) / vals.length;
      const std  = Math.sqrt(vals.map(v => (v-mean)**2).reduce((a,b) => a+b, 0) / vals.length) || 1;
      const sorted = [...vals].sort((a,b) => a-b);
      const p5  = sorted[Math.floor(sorted.length * 0.05)] ?? sorted[0];
      const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? sorted[sorted.length-1];
      stats[k] = { mean, std, p5, p95 };
    });
    _statsCache.set(upToMonth, stats);
    return stats;
  }

  function normalize(k, v, upToMonth) {
    const stats = getDimStats(upToMonth);
    const { mean, std, p5, p95 } = stats[k] || { mean: 0, std: 1, p5: v, p95: v };
    const w = Math.max(p5, Math.min(p95, v));
    return (w - mean) / std;
  }

  function getVector(monthObj, upToMonth) {
    const refMonth = upToMonth || monthObj.month;
    const v = {};
    VECTOR_KEYS.forEach(k => {
      const c = monthObj.components?.[k];
      if (c?.valid && c?.value != null) v[k] = normalize(k, c.value, refMonth);
    });
    return v;
  }

  // Para el mes actual (producción) usamos todos los datos disponibles
  // latestMonth se declara después de latestValid más abajo

  function cosineSim(va, vb) {
    const keys = Object.keys(va).filter(k => vb[k] != null);
    if (keys.length < MIN_DIMS) return null;
    const dot  = keys.reduce((s,k) => s + va[k]*vb[k], 0);
    const normA = Math.sqrt(keys.reduce((s,k) => s + va[k]**2, 0));
    const normB = Math.sqrt(keys.reduce((s,k) => s + vb[k]**2, 0));
    if (normA === 0 || normB === 0) return null;
    return { sim: +(dot / (normA * normB)).toFixed(4), dims: keys.length };
  }

  // Vector del mes más reciente válido (para búsqueda de analogías desde el presente)
  const latestValid  = [...histMacroV1].reverse().find(m => m.valid);
  const latestMonth  = latestValid?.month || '2099-01';
  const latestVector = latestValid ? getVector(latestValid, latestMonth) : null;

  // Meses históricos elegibles: válidos, al menos 12 meses antes del último
  const cutoffYM = latestValid
    ? (() => { const d = new Date(latestValid.month+'-01'); d.setMonth(d.getMonth()-EXCLUDE_LAST); return d.toISOString().slice(0,7); })()
    : '2099-01';

  // findAnalogies v2.2 — HARDENED
  // Requisitos candidato: ≥6/9 dims, similarity ≥60%, todos los forward metrics disponibles
  // Producción: excluir últimos 12M, deduplicación ±6M
  // Walk-forward: candidateDate <= referenceDate - 12M, deduplicación ±6M
  // Top 10 máximo — NO rellenar si no alcanzan el umbral
  const SIM_MIN   = 0.60;
  const DEDUP_M   = 6;

  function addMonths(ym, n) {
    const d = new Date(ym + '-01');
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 7);
  }

  function findAnalogies(queryVector, queryMonth, topN = 10, opts = {}) {
    const { walkForward = false } = opts;

    // Límite temporal de candidatos
    const maxMonth = walkForward && queryMonth
      ? addMonths(queryMonth, -12)   // walk-forward: ≤ referenceDate - 12M
      : addMonths(latestValid?.month || queryMonth, -EXCLUDE_LAST); // producción: excluir últimos 12M

    const candidates = histMacroV1.filter(m => m.valid && m.month <= maxMonth);

    const scored = candidates.map(m => {
      // Point-in-time: normalizar candidato con stats disponibles hasta su propio mes
      const mv  = getVector(m, m.month);
      const res = cosineSim(queryVector, mv);
      if (!res) return null;
      if (res.sim < SIM_MIN) return null;   // HARD: similarity ≥ 60%
      if (res.dims < MIN_DIMS) return null; // HARD: ≥ 6/9 dims (ya en cosineSim, doble check)

      const r3  = spReturn(m.month, 3);
      const r6  = spReturn(m.month, 6);
      const r12 = spReturn(m.month, 12);
      const dd  = maxDrawdown(m.month, 12);

      // HARD: todos los forward metrics disponibles
      if (r3 == null || r6 == null || r12 == null || dd == null) return null;

      return {
        month: m.month, similarity: res.sim, dimsUsed: res.dims,
        coverage: m.coverage, scoreNorm: m.scoreNorm, scoreRaw: m.scoreRaw,
        sp3m: r3, sp6m: r6, sp12m: r12, maxDD12m: dd,
      };
    }).filter(Boolean);

    scored.sort((a, b) => b.similarity - a.similarity);

    // Deduplicación ±DEDUP_M: greedy, episodios independientes
    const selected = [];
    const excluded = new Set();
    for (const c of scored) {
      if (selected.length >= topN) break;
      if (excluded.has(c.month)) continue;
      selected.push(c);
      for (let d = -DEDUP_M; d <= DEDUP_M; d++) {
        excluded.add(addMonths(c.month, d));
      }
    }
    return selected;  // máximo topN, puede ser menos si no hay suficientes elegibles
  }

  // Calcular analogías para el mes actual y para los 3 meses de prueba
  // Analogías actuales: excluir últimos 12M (no walk-forward, query=presente)
  const analogyCurrent  = latestVector
    ? findAnalogies(latestVector, latestValid?.month, 10, { walkForward: false, dedupMonths: 6 })
    : [];
  // Pruebas de validación: walk-forward estricto (solo meses ANTERIORES al mes auditado)
  const analogyProbe = ['2022-10','2020-04','2018-12','2008-09'].map(ym => {
    const m = histMacroV1.find(h => h.month === ym);
    if (!m?.valid) return { month: ym, error: 'no válido en histMacroV1' };

    const v = getVector(m, ym);
    const top = findAnalogies(v, ym, 10, { walkForward: true });
    const selectedMonths = new Set((top || []).map(a => a.month));

    // ── Diagnóstico de pipeline ──────────────────────────────────
    const maxMonth = addMonths(ym, -12);
    const diag = { month: ym };

    const s0 = histMacroV1;
    diag.universeTotal = s0.length;

    const s1 = s0.filter(c => c.valid);
    diag.afterValid = s1.length;

    const s2 = s1.filter(c => c.month <= maxMonth);
    diag.afterEmbargo = s2.length;

    const s3 = s2.filter(c => c.coverage >= COVERAGE_MIN);
    diag.afterCoverage = s3.length;

    // Top candidatos ANTES de los filtros duros — para ver por qué se rechazan
    const topRaw = s3.map(c => {
      const cv  = getVector(c, c.month);
      const res = cosineSim(v, cv);
      if (!res) return null;
      const r3  = spReturn(c.month, 3);
      const r6  = spReturn(c.month, 6);
      const r12 = spReturn(c.month, 12);
      const dd  = maxDrawdown(c.month, 12);
      // Determinar razón de rechazo
      const reasons = [];
      if (res.sim < SIM_MIN) reasons.push(`sim=${(res.sim*100).toFixed(1)}%<60%`);
      if (res.dims < MIN_DIMS) reasons.push(`dims=${res.dims}<6`);
      if (r3  == null) reasons.push('sp3m=null');
      if (r6  == null) reasons.push('sp6m=null');
      if (r12 == null) reasons.push('sp12m=null');
      if (dd  == null) reasons.push('dd=null');
      return {
        month: c.month, sim: res.sim, dims: res.dims,
        scoreNorm: c.scoreNorm, coverage: c.coverage,
        sp3m: r3, sp6m: r6, sp12m: r12, maxDD12m: dd,
        eligible: reasons.length === 0,
        status: reasons.length > 0 ? 'REJECTED' : selectedMonths.has(c.month) ? 'SELECTED' : 'ELIGIBLE',
        rejectionReasons: reasons,
      };
    }).filter(Boolean).sort((a,b) => b.sim - a.sim);

    diag.afterSimCalc   = topRaw.length;
    diag.eligibleCount  = topRaw.filter(c => c.eligible).length;
    diag.top15Raw       = topRaw.slice(0, 15); // top 15 antes de filtros finales

    return { month: ym, analogies: top, queryVector: v, diag };
  });

  // Resumen estadístico de analogías
  function summarize(analogies) {
    const r6  = analogies.map(a => a.sp6m).filter(v => v != null);
    const r12 = analogies.map(a => a.sp12m).filter(v => v != null);
    const dd  = analogies.map(a => a.maxDD12m).filter(v => v != null);
    const median = arr => { if (!arr.length) return null; const s = [...arr].sort((a,b)=>a-b); return s[Math.floor(s.length/2)]; };
    return {
      medianSp6m:   median(r6),
      medianSp12m:  median(r12),
      medianMaxDD:  median(dd),
      pctPositive12m: r12.length ? +(r12.filter(v=>v>0).length/r12.length*100).toFixed(1) : null,
      n: analogies.length,
    };
  }

  // ── Test global de invariantes (sobre TODOS los meses) ─────────
  const globalViolations = [];
  let nScoreNormOOB = 0, nAbsViolation = 0, nCoverageOOB = 0;
  histMacroV1.forEach(m => {
    if (m.violations?.length) {
      nAbsViolation += m.violations.length;
      globalViolations.push({ month: m.month, v: m.violations });
    }
    if (m.scoreNorm != null && (m.scoreNorm < -1.001 || m.scoreNorm > 1.001)) nScoreNormOOB++;
    if (m.coverage > 1.001) nCoverageOOB++;
  });
  const invariantsPass = nAbsViolation === 0 && nScoreNormOOB === 0 && nCoverageOOB === 0;
  const invariantStatus = invariantsPass
    ? `✓ PASS — todos los invariantes OK sobre ${histMacroV1.length} meses`
    : `✗ FAIL — ${nAbsViolation} violaciones |score|>max, ${nScoreNormOOB} scoreNorm OOB, ${nCoverageOOB} coverage OOB`;

  // Score histórico simplificado para el gráfico (solo válidos)
  const scoreHistory = histMacroV1
    .filter(m => m.valid)
    .map(m => ({ date: m.month + '-01', value: m.scoreNorm, scoreRaw: m.scoreRaw, coverage: m.coverage }));

  // ── Correlaciones lead-lag (Fase 2C) ──────────────────────────
  // Indicador(t) vs Forward Return activo(t+H) para H = 0, 3, 6, 12 meses
  // Dataset: HIST_MACRO_V1_FRED (misma fuente que analogías)
  // Activos: SP500 (spMap ya construido), + placeholders para otros activos futuros
  // Significancia: N observaciones por celda

  const HORIZONS = [0, 3, 6, 12]; // meses
  const IND_KEYS = ['curvaUSD','tipoReal','lei','m2usa','creditoVsPib','impulso','velM2','reservas','bbb','scoreNorm'];

  // Para cada activo construir un mapa de forward returns por horizonte
  // Por ahora solo SP500 tiene histórico completo; otros activos se añadirán cuando tengamos datos
  function buildForwardMap(priceMap, horizon) {
    const fwd = new Map();
    for (const [ym, price] of priceMap) {
      const r = spReturn(ym, horizon); // reutilizamos spReturn que ya usa spMap
      if (r != null) fwd.set(ym, r);
    }
    return fwd;
  }

  // Correlación Pearson entre indicador y forward return, alineados por mes
  function calcLeadLag(indKey, fwdMap) {
    const xs = [], ys = [];
    for (const m of histMacroV1) {
      if (!m.valid) continue;
      const indVal = indKey === 'scoreNorm'
        ? m.scoreNorm
        : m.components?.[indKey]?.valid ? m.components[indKey].value : null;
      const fwdVal = fwdMap.get(m.month);
      if (indVal != null && fwdVal != null) {
        xs.push(indVal);
        ys.push(fwdVal);
      }
    }
    if (xs.length < 20) return null;
    const mx = xs.reduce((a,b)=>a+b,0)/xs.length;
    const my = ys.reduce((a,b)=>a+b,0)/ys.length;
    let num=0, dx2=0, dy2=0;
    for (let i=0; i<xs.length; i++) {
      const a=xs[i]-mx, b=ys[i]-my;
      num+=a*b; dx2+=a*a; dy2+=b*b;
    }
    const denom = Math.sqrt(dx2*dy2);
    return denom===0 ? null : { rho: +(num/denom).toFixed(3), n: xs.length };
  }

  const REGIME_BUCKETS = [
    { label: 'Muy negativo', min: -1.01, max: -0.60 },
    { label: 'Negativo',     min: -0.60, max: -0.20 },
    { label: 'Neutral',      min: -0.20, max: +0.20 },
    { label: 'Positivo',     min: +0.20, max: +0.60 },
    { label: 'Muy positivo', min: +0.60, max:  1.01 },
  ];
  const REGIME_HORIZONS = [3, 6, 12];

  let corrAudit = [], regimeAnalysis = [], corrMatrix = {}, quintiles = [], stabilityByIndicator = {},
      spearmanReturn = null, spearmanBinary = null, spearmanN = 0,
      spearmanBinaryNonOverlap = null, nonOverlapN = 0,
      spearmanBinaryHAC = null, spearmanBinaryBootstrap = null;
  try {
    const AUDIT_MONTHS = ['2022-10', '2020-04', '2018-12', '2026-06'];
    corrAudit = AUDIT_MONTHS.map(ym => {
      const m = histMacroV1.find(h => h.month === ym);
      if (!m?.valid) return { month: ym, error: 'no válido' };
      const c = m.components;
      const auditRows = [
        { key: 'tipoReal', label: 'Tipo Real' },
        { key: 'lei',      label: 'LEI (OECD CLI)' },
        { key: 'bbb',      label: 'BBB Spread' },
      ].map(({ key, label }) => {
        const comp = c[key];
        if (!comp?.valid) return { key, label, value: null, error: 'no disponible' };
        const sp0  = spMap.get(ym);
        const sp3  = spReturn(ym, 3);
        const sp6  = spReturn(ym, 6);
        const sp12 = spReturn(ym, 12);
        const t6   = new Date(ym + '-01');
        t6.setMonth(t6.getMonth() + 6);
        const ym6  = t6.toISOString().slice(0, 7);
        return {
          key, label, value: comp.value, score: comp.score,
          sp0:     sp0  != null ? +sp0.toFixed(2)  : null,
          sp3m:    sp3  != null ? +sp3.toFixed(2)  : null,
          sp6m:    sp6  != null ? +sp6.toFixed(2)  : null,
          sp12m:   sp12 != null ? +sp12.toFixed(2) : null,
          sp6mDate: ym6,
          sp6mRaw: spMap.get(ym6) != null ? +spMap.get(ym6).toFixed(2) : null,
        };
      });
      return {
        month: ym, scoreNorm: m.scoreNorm, coverage: m.coverage,
        sp0: spMap.get(ym) != null ? +spMap.get(ym).toFixed(2) : null,
        rows: auditRows,
      };
    });

    regimeAnalysis = REGIME_BUCKETS.map(bucket => {
      const months = histMacroV1.filter(m =>
        m.valid && m.scoreNorm != null &&
        m.scoreNorm > bucket.min && m.scoreNorm <= bucket.max
      );
      const byHorizon = {};
      for (const h of REGIME_HORIZONS) {
        const returns = months.map(m => spReturn(m.month, h)).filter(v => v != null);
        const dds     = months.map(m => maxDrawdown(m.month, 12)).filter(v => v != null);
        const sorted  = [...returns].sort((a,b) => a-b);
        const med     = arr => arr.length ? arr[Math.floor(arr.length/2)] : null;
        byHorizon[h]  = {
          n:        returns.length,
          median:   med(sorted),
          pctPos:   returns.length ? +(returns.filter(v=>v>0).length/returns.length*100).toFixed(1) : null,
          medianDD: med([...dds].sort((a,b)=>a-b)),
          p25:      sorted[Math.floor(sorted.length*0.25)] ?? null,
          p75:      sorted[Math.floor(sorted.length*0.75)] ?? null,
        };
      }
      return { ...bucket, nMonths: months.length, byHorizon };
    });

    // Quintiles equilibrados: rank secuencial sobre meses CON forward returns disponibles
    // Filtramos primero los que tienen al menos sp6m, luego asignamos quintil
    const validMonths = histMacroV1
      .filter(m => m.valid && m.scoreNorm != null && spReturn(m.month, 6) != null)
      .sort((a,b) => a.scoreNorm - b.scoreNorm || a.month.localeCompare(b.month));
    const totalN = validMonths.length;
    validMonths.forEach((m, i) => { m._quintile = Math.min(5, Math.floor(i * 5 / totalN) + 1); });
    const qGroups = [1,2,3,4,5].map(q => validMonths.filter(m => m._quintile === q));
    const qNs = qGroups.map(g => g.length);
    const qBalanced = Math.max(...qNs) - Math.min(...qNs) <= 1;
    quintiles = qGroups.map((slice, qi) => {
      const byHorizon = {};
      for (const h of REGIME_HORIZONS) {
        const returns = slice.map(m => spReturn(m.month, h)).filter(v => v != null);
        const dds     = slice.map(m => maxDrawdown(m.month, 12)).filter(v => v != null);
        const sorted  = [...returns].sort((a,b) => a-b);
        const med     = arr => arr.length ? +arr[Math.floor(arr.length/2)].toFixed(2) : null;
        byHorizon[h]  = {
          n: returns.length, median: med(sorted),
          pctPos: returns.length ? +(returns.filter(v=>v>0).length/returns.length*100).toFixed(1) : null,
          medianDD: med([...dds].sort((a,b)=>a-b)),
        };
      }
      const scores = slice.map(m => m.scoreNorm);
      return {
        quintile: qi+1, nMonths: slice.length, balanced: qBalanced,
        minScore: +Math.min(...scores).toFixed(3),
        maxScore: +Math.max(...scores).toFixed(3),
        byHorizon,
      };
    });

    // Pearson con p-value (aproximación t-student: t = r*sqrt(n-2)/sqrt(1-r^2))
    function pearsonWithP(xs, ys) {
      if (!xs?.length || xs.length < 20) return null;
      const mx = xs.reduce((a,b)=>a+b,0)/xs.length;
      const my = ys.reduce((a,b)=>a+b,0)/ys.length;
      let num=0, dx2=0, dy2=0;
      for (let i=0; i<xs.length; i++) {
        const a=xs[i]-mx, b=ys[i]-my;
        num+=a*b; dx2+=a*a; dy2+=b*b;
      }
      const denom = Math.sqrt(dx2*dy2);
      if (denom===0) return null;
      const r = num/denom;
      const n = xs.length;
      const t = r * Math.sqrt(n-2) / Math.sqrt(1 - r*r + 1e-10);
      // p-value aproximado (distribución t, dos colas) — aproximación normal para n>30
      const z = Math.abs(t);
      const pApprox = n > 30
        ? 2 * (1 - (0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2*z*z/Math.PI)))))
        : null; // sin aproximación para n pequeño
      // IC 95% via Fisher z-transform
      const zr  = 0.5 * Math.log((1+r)/(1-r+1e-10));
      const se  = 1/Math.sqrt(n-3);
      const ci95 = [
        +(Math.tanh(zr - 1.96*se)).toFixed(3),
        +(Math.tanh(zr + 1.96*se)).toFixed(3),
      ];
      return { rho: +r.toFixed(3), n, p: pApprox != null ? +pApprox.toFixed(4) : null, ci95 };
    }

    // Recalcular corrMatrix con p-values
    for (const h of HORIZONS) {
      const fwdMap = buildForwardMap(spMap, h);
      corrMatrix[h] = {};
      for (const k of IND_KEYS) {
        const xs=[], ys=[];
        for (const m of histMacroV1) {
          if (!m.valid) continue;
          const indVal = k==='scoreNorm' ? m.scoreNorm : m.components?.[k]?.valid ? m.components[k].value : null;
          const fwdVal = fwdMap.get(m.month);
          if (indVal!=null && fwdVal!=null) { xs.push(indVal); ys.push(fwdVal); }
        }
        corrMatrix[h][k] = pearsonWithP(xs, ys);
      }
    }

    // Estabilidad temporal: 3 bloques iguales por N (Early / Mid / Recent)
    const KEY_INDICATORS = ['tipoReal','lei','bbb','scoreNorm'];
    const fwdMap6stable = buildForwardMap(spMap, 6);
    // Solo meses con forward +6M disponible, ordenados cronológicamente
    const mthsWith6m = histMacroV1
      .filter(m => m.valid && fwdMap6stable.get(m.month) != null)
      .sort((a,b) => a.month.localeCompare(b.month));
    const bSz = Math.floor(mthsWith6m.length / 3);
    const temporalBlocks = [
      { label: 'Early',  months: mthsWith6m.slice(0, bSz) },
      { label: 'Mid',    months: mthsWith6m.slice(bSz, bSz*2) },
      { label: 'Recent', months: mthsWith6m.slice(bSz*2) },
    ].map(b => ({
      label: b.label,
      first: b.months[0]?.month?.slice(0,7) || '—',
      last:  b.months[b.months.length-1]?.month?.slice(0,7) || '—',
      n:     b.months.length,
      months: b.months,
    }));

    stabilityByIndicator = {};
    for (const k of KEY_INDICATORS) {
      stabilityByIndicator[k] = temporalBlocks.map(b => {
        const xs=[], ys=[];
        for (const m of b.months) {
          const indVal = k==='scoreNorm' ? m.scoreNorm
            : m.components?.[k]?.valid ? m.components[k].value : null;
          const fwdVal = fwdMap6stable.get(m.month);
          if (indVal!=null && fwdVal!=null) { xs.push(indVal); ys.push(fwdVal); }
        }
        const res = xs.length >= 10 ? pearsonWithP(xs, ys) : null;
        return {
          label: b.label,
          window: `${b.first}→${b.last}`,
          n:      xs.length,
          rho:    res?.rho ?? null,
          p:      res?.p  ?? null,
          ci95:   res?.ci95 ?? null,
          lowN:   xs.length < 15,
        };
      });
    }
  } catch(e) { errs.push('corrAudit/regime/corrMatrix error: ' + e.message); }

  // Spearman ScoreNorm → retorno +12M (fuera del try para acceso a fwdMap12)
  try {
    function rankArray(arr) {
      const sorted = [...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
      const ranks = new Array(arr.length);
      let i=0;
      while (i < sorted.length) {
        let j=i;
        while (j<sorted.length && sorted[j].v===sorted[i].v) j++;
        const avg = (i+j-1)/2;
        for (let k=i;k<j;k++) ranks[sorted[k].i]=avg;
        i=j;
      }
      return ranks;
    }
    function pearsonRanks(xs,ys) {
      if (!xs?.length||xs.length<10) return null;
      const mx=xs.reduce((a,b)=>a+b,0)/xs.length, my=ys.reduce((a,b)=>a+b,0)/ys.length;
      let num=0,dx2=0,dy2=0;
      for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}
      const d=Math.sqrt(dx2*dy2); if(d===0) return null;
      const r=num/d, n=xs.length;
      const t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10);
      const z=Math.abs(t), p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null;
      const zr=0.5*Math.log((1+r)/(1-r+1e-10)), se=1/Math.sqrt(n-3);
      return { rho:+r.toFixed(3), n, p:p!=null?+p.toFixed(4):null, ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)] };
    }
    const fwdMap12b = buildForwardMap(spMap, 12);
    const xs12=[],ys12=[],ybin=[];
    for (const m of histMacroV1) {
      if (!m.valid||m.scoreNorm==null) continue;
      const r12=fwdMap12b.get(m.month);
      if (r12==null) continue;
      xs12.push(m.scoreNorm); ys12.push(r12); ybin.push(r12>0?1:0);
    }
    spearmanReturn = pearsonRanks(rankArray(xs12), rankArray(ys12));
    spearmanBinary = pearsonRanks(rankArray(xs12), rankArray(ybin));
    spearmanN      = xs12.length;

    // Validación robusta: observaciones no solapadas cada 12M
    // Elimina autocorrelación de los forward returns a +12M
    const nonOverlap = [];
    const allPairs12 = histMacroV1
      .filter(m => m.valid && m.scoreNorm != null && fwdMap12b.get(m.month) != null)
      .sort((a,b) => a.month.localeCompare(b.month));
    let lastIncluded = null;
    for (const m of allPairs12) {
      if (lastIncluded === null ||
          (new Date(m.month+'-01') - new Date(lastIncluded+'-01')) >= 365*24*3600*1000*0.95) {
        nonOverlap.push({ x: m.scoreNorm, y: fwdMap12b.get(m.month) });
        lastIncluded = m.month;
      }
    }
    const xno = nonOverlap.map(p=>p.x), yno = nonOverlap.map(p=>p.y), ybno = yno.map(v=>v>0?1:0);
    nonOverlapN = nonOverlap.length;
    if (nonOverlapN >= 10) {
      spearmanBinaryNonOverlap = pearsonRanks(rankArray(xno), rankArray(ybno));
    }

    // Newey-West HAC: t-stat robusto a autocorrelación en retornos solapados
    // Aplicado a Spearman binario: ScoreNorm rank vs retorno positivo +12M
    // Bandwidth = floor(1.3 * T^(1/3)) — regla de Andrews para T~110
    try {
      const T = xs12.length;
      const bw = Math.floor(1.3 * Math.pow(T, 1/3)); // ~6 para T=110
      const rxHac = rankArray(xs12);
      const ryHac = rankArray(ybin);
      // Demeaning
      const mx = rxHac.reduce((a,b)=>a+b,0)/T;
      const my = ryHac.reduce((a,b)=>a+b,0)/T;
      const xd = rxHac.map(v=>v-mx), yd = ryHac.map(v=>v-my);
      // Residuos de la regresión OLS: yd = b*xd + e
      const sxx = xd.reduce((a,v)=>a+v*v,0);
      const sxy = xd.reduce((a,v,i)=>a+v*yd[i],0);
      const b   = sxy/sxx;
      const e   = yd.map((v,i)=>v-b*xd[i]);
      // Score xi*ei
      const sc = xd.map((v,i)=>v*e[i]);
      // Varianza HAC (Newey-West)
      let hacVar = sc.reduce((a,v)=>a+v*v,0); // lag 0
      for (let lag=1; lag<=bw; lag++) {
        const w   = 1 - lag/(bw+1); // Bartlett kernel
        let cov = 0;
        for (let t=lag; t<T; t++) cov += sc[t]*sc[t-lag];
        hacVar += 2*w*cov;
      }
      const seHac   = Math.sqrt(hacVar/(sxx*sxx));
      const tHac    = b/seHac;
      const dfHac   = T-2;
      // p-value aproximado (normal para T>30)
      const zHac    = Math.abs(tHac);
      const pHac    = 2*(1-(0.5*(1+Math.sign(zHac)*Math.sqrt(1-Math.exp(-2*zHac*zHac/Math.PI)))));
      // Convertir coeficiente a ρ-equivalente (b normalizado por sd_x/sd_y)
      const sdx = Math.sqrt(xd.reduce((a,v)=>a+v*v,0)/T);
      const sdy = Math.sqrt(yd.reduce((a,v)=>a+v*v,0)/T);
      const rhoHac = +(b*(sdx/sdy)).toFixed(3);
      // IC95 via Fisher z-transform con SE ajustado
      const zr = 0.5*Math.log((1+rhoHac)/(1-rhoHac+1e-10));
      const seZ = seHac/(sdx/sdy)/Math.sqrt(T);
      spearmanBinaryHAC = {
        rho:  rhoHac, tStat: +tHac.toFixed(3), p: +pHac.toFixed(4),
        bw, T, seHac: +seHac.toFixed(4),
        ci95: [+(Math.tanh(zr-1.96*seZ)).toFixed(3), +(Math.tanh(zr+1.96*seZ)).toFixed(3)],
        method: `Newey-West HAC (Bartlett, bw=${bw})`,
      };
    } catch(eHac) { errs.push('HAC error: ' + eHac.message); }

    // Block Bootstrap: bloques móviles de 12M, 5000 simulaciones
    // Preserva la dependencia temporal de los retornos solapados
    try {
      const BLOCK  = 12;   // meses por bloque
      const NSIM   = 5000;
      const T_bb   = xs12.length;
      const nBlocks = Math.ceil(T_bb / BLOCK);

      // Par (score, binario) ya construido en xs12/ybin
      const pairs = xs12.map((x,i) => [x, ybin[i]]);

      function spearmanRho(arr) {
        const n = arr.length;
        const rx = rankArray(arr.map(p=>p[0]));
        const ry = rankArray(arr.map(p=>p[1]));
        const mx = rx.reduce((a,b)=>a+b,0)/n, my = ry.reduce((a,b)=>a+b,0)/n;
        let num=0,dx2=0,dy2=0;
        for(let i=0;i<n;i++){const a=rx[i]-mx,b=ry[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}
        const d=Math.sqrt(dx2*dy2); return d===0?0:num/d;
      }

      const rhoObs = spearmanRho(pairs);

      // Semilla determinista — generador LCG simple
      let seed = 20260823;
      function rand() { seed=(seed*1664525+1013904223)&0xFFFFFFFF; return (seed>>>0)/4294967296; }

      const bootDist = [];
      for (let s=0; s<NSIM; s++) {
        const sample = [];
        while (sample.length < T_bb) {
          const start = Math.floor(rand() * (T_bb - BLOCK + 1));
          for (let k=0; k<BLOCK && sample.length<T_bb; k++) {
            sample.push(pairs[(start+k) % T_bb]);
          }
        }
        bootDist.push(spearmanRho(sample.slice(0, T_bb)));
      }
      bootDist.sort((a,b)=>a-b);
      const ci025 = bootDist[Math.floor(NSIM*0.025)];
      const ci975 = bootDist[Math.floor(NSIM*0.975)];
      // p-value bootstrap: proporción de simulaciones con ρ >= 0 (cola izquierda para ρ<0)
      const pBoot = bootDist.filter(r => r >= 0).length / NSIM;

      spearmanBinaryBootstrap = {
        rhoObs:   +rhoObs.toFixed(3),
        ci95:     [+ci025.toFixed(3), +ci975.toFixed(3)],
        pBoot:    +pBoot.toFixed(4),
        excludes0: ci025 < 0 && ci975 < 0,
        block: BLOCK, nSim: NSIM, T: T_bb,
        method: `Block Bootstrap (bloques móviles ${BLOCK}M, ${NSIM} sims)`,
      };
    } catch(eBoot) { errs.push('Bootstrap error: ' + eBoot.message); }
  } catch(e) { errs.push('spearman error: ' + e.message); }

  // Correlaciones legacy (retornos coincidentes) — mantenidas para compatibilidad
  const calcCorr = (indSeries, assetSeries) => {
    if (!indSeries || !assetSeries) return null;
    const indRet = monthlyReturns(indSeries);
    const astRet = monthlyReturns(assetSeries);
    const { xs, ys } = alignByDate(indRet, astRet);
    return pearson(xs, ys);
  };

  const assets = { sp, nq, ru, au, bond, dxy };
  const indicators = { curvaUSD, tipoReal, bbb, creditoVsNominal };

  const correlaciones = {};
  for (const [indName, indSeries] of Object.entries(indicators)) {
    correlaciones[indName] = {};
    for (const [astName, astSeries] of Object.entries(assets)) {
      correlaciones[indName][astName] = calcCorr(indSeries, astSeries);
    }
  }

  // ── RISK_RADAR_V1 Stress Test ─────────────────────────────────
  // Para cada indicador del Radar: reconstruir valor histórico desde histMacroV1,
  // aplicar thresholds actuales, calcular forward returns y validación estadística.
  // Reutiliza: spReturn, maxDrawdown, pearsonWithP, pearsonRanks, rankArray, buildForwardMap

  let radarStressTest = {};
  try {
    // rankArray/pearsonRanks viven como function-declarations dentro de OTRO try{} anterior
    // (bloque de Spearman ScoreNorm) — en ESM estricto eso las deja block-scoped a ese try,
    // así que aquí quedaban fuera de alcance (ReferenceError, capturado silenciosamente
    // por el catch de abajo). Copia local para que este bloque sea autosuficiente.
    function rankArray(arr) {
      const sorted = [...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
      const ranks = new Array(arr.length);
      let i=0;
      while (i < sorted.length) {
        let j=i;
        while (j<sorted.length && sorted[j].v===sorted[i].v) j++;
        const avg = (i+j-1)/2;
        for (let k=i;k<j;k++) ranks[sorted[k].i]=avg;
        i=j;
      }
      return ranks;
    }
    function pearsonRanks(xs,ys) {
      if (!xs?.length||xs.length<10) return null;
      const mx=xs.reduce((a,b)=>a+b,0)/xs.length, my=ys.reduce((a,b)=>a+b,0)/ys.length;
      let num=0,dx2=0,dy2=0;
      for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}
      const d=Math.sqrt(dx2*dy2); if(d===0) return null;
      const r=num/d, n=xs.length;
      const t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10);
      const z=Math.abs(t), p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null;
      const zr=0.5*Math.log((1+r)/(1-r+1e-10)), se=1/Math.sqrt(n-3);
      return { rho:+r.toFixed(3), n, p:p!=null?+p.toFixed(4):null, ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)] };
    }
    const fwdMap3  = buildForwardMap(spMap, 3);
    const fwdMap6  = buildForwardMap(spMap, 6);
    const fwdMap12 = buildForwardMap(spMap, 12);

    // Definición de indicadores del Radar con getter desde histMacroV1
    const RADAR_INDICATORS = [
      { id: 'curvaUSD',     block: 'Ciclo Económico',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.curvaUSD,
        scoreFrom: c => c?.score ?? null },
      { id: 'curvaEUR',     block: 'Ciclo Económico',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.curvaUSD, // proxy — EUR no en histMacroV1
        scoreFrom: c => null, note: 'EUR no en HIST_MACRO_V1, proxy no disponible' },
      { id: 'lei',          block: 'Ciclo Económico',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.lei,
        scoreFrom: c => c?.score ?? null },
      { id: 'm2usa',        block: 'Liquidez Global',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.m2usa,
        scoreFrom: c => c?.score ?? null },
      { id: 'impulso',      block: 'Liquidez Global',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.impulso,
        scoreFrom: c => c?.score ?? null },
      { id: 'velM2',        block: 'Liquidez Global',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.velM2,
        scoreFrom: c => c?.score ?? null },
      { id: 'creditoVsPib', block: 'Liquidez Global',    source: 'HIST_MACRO_V1',
        getter: m => m.components?.creditoVsPib,
        scoreFrom: c => c?.score ?? null },
      { id: 'bbb',          block: 'Crédito',            source: 'SHARED',
        getter: m => m.components?.bbb,
        scoreFrom: c => c?.value != null ? (c.value <= 1 ? 1 : c.value <= 1.5 ? 0 : -1) : null },
      { id: 'tipoReal',     block: 'Política Monetaria', source: 'HIST_MACRO_V1',
        getter: m => m.components?.tipoReal,
        scoreFrom: c => c?.score ?? null },
      { id: 'reservas',     block: 'Política Monetaria', source: 'HIST_MACRO_V1',
        getter: m => m.components?.reservas,
        scoreFrom: c => c?.score ?? null },
    ];

    // Para cada indicador: agrupar meses por score, calcular forward stats
    function forwardStats(months) {
      const r3 = months.map(m => fwdMap3.get(m)).filter(v => v != null);
      const r6 = months.map(m => fwdMap6.get(m)).filter(v => v != null);
      const r12= months.map(m => fwdMap12.get(m)).filter(v => v != null);
      const dd = months.map(m => maxDrawdown(m, 12)).filter(v => v != null);
      const med = arr => { const s=[...arr].sort((a,b)=>a-b); return s.length?+s[Math.floor(s.length/2)].toFixed(2):null; };
      return {
        n: months.length,
        n3m: r3.length, med3m: med(r3), pctPos3m: r3.length?+(r3.filter(v=>v>0).length/r3.length*100).toFixed(1):null,
        n6m: r6.length, med6m: med(r6), pctPos6m: r6.length?+(r6.filter(v=>v>0).length/r6.length*100).toFixed(1):null,
        n12m:r12.length,med12m:med(r12),pctPos12m:r12.length?+(r12.filter(v=>v>0).length/r12.length*100).toFixed(1):null,
        medDD: med(dd),
      };
    }

    // Validación estadística Spearman score→retorno +6M con bootstrap
    function validateIndicator(xs, ys6) {
      if (xs.length < 15) return { status: 'INSUFFICIENT_N', n: xs.length };
      const rho = pearsonRanks(rankArray(xs), rankArray(ys6));
      if (!rho) return { status: 'INSUFFICIENT_N', n: xs.length };
      // Bootstrap ligero (1000 sims para no agotar tiempo Vercel)
      let seed = 20260823;
      function rand() { seed=(seed*1664525+1013904223)&0xFFFFFFFF; return (seed>>>0)/4294967296; }
      const pairs = xs.map((x,i)=>[x,ys6[i]]);
      const T = pairs.length, NSIM = 1000, BLOCK = 6;
      function rhoFrom(arr) {
        const rx=rankArray(arr.map(p=>p[0])), ry=rankArray(arr.map(p=>p[1]));
        const mx=rx.reduce((a,b)=>a+b,0)/arr.length, my=ry.reduce((a,b)=>a+b,0)/arr.length;
        let num=0,dx2=0,dy2=0;
        for(let i=0;i<arr.length;i++){const a=rx[i]-mx,b=ry[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}
        const d=Math.sqrt(dx2*dy2); return d?num/d:0;
      }
      const boot = [];
      for (let s=0;s<NSIM;s++) {
        const samp=[];
        while(samp.length<T){const st=Math.floor(rand()*(T-BLOCK+1));for(let k=0;k<BLOCK&&samp.length<T;k++)samp.push(pairs[(st+k)%T]);}
        boot.push(rhoFrom(samp));
      }
      boot.sort((a,b)=>a-b);
      const ci025=boot[Math.floor(NSIM*0.025)], ci975=boot[Math.floor(NSIM*0.975)];
      const pBoot = boot.filter(r=>r>=0).length/NSIM;
      const excludes0 = (rho.rho < 0 && ci975 < 0) || (rho.rho > 0 && ci025 > 0);
      const status = excludes0 ? 'VALIDATED' : pBoot < 0.1 ? 'WEAK' : 'UNSTABLE';
      return { status, rho: rho.rho, p: rho.p, ci95: [+ci025.toFixed(3), +ci975.toFixed(3)], pBoot: +pBoot.toFixed(4), n: xs.length, excludes0 };
    }

    for (const ind of RADAR_INDICATORS) {
      const byScore = { '+1':[], '0':[], '-1':[], '-2':[], '-3':[], '+2':[], '+3':[] };
      const xs=[], ys6=[];
      for (const m of histMacroV1) {
        if (!m.valid) continue;
        const comp = ind.getter(m);
        const sc   = ind.scoreFrom(comp);
        if (sc == null) continue;
        const key  = sc >= 0 ? '+'+sc : String(sc);
        if (!byScore[key]) byScore[key] = [];
        byScore[key].push(m.month);
        const r6 = fwdMap6.get(m.month);
        if (r6 != null) { xs.push(sc); ys6.push(r6); }
      }
      const byScoreStats = {};
      for (const [k,months] of Object.entries(byScore)) {
        if (months.length > 0) byScoreStats[k] = forwardStats(months);
      }
      radarStressTest[ind.id] = {
        block: ind.block, source: ind.source, note: ind.note,
        byScore: byScoreStats,
        validation: validateIndicator(xs, ys6),
      };
    }
  } catch(e) { errs.push('radarStressTest error: ' + e.message); }

  // ── Respuesta ─────────────────────────────────
  return res.status(200).json({
    updatedAt: new Date().toISOString(),

    // Para Timeline
    timeline: {
      spNorm,
      cpiYoY,
      m2YoY,
      scoreHistory,
      curvaUSD,
      macroVars: {
        US10Y:        { label: 'Treasury 10Y',      unit: '%', series: dgs10Monthly,  source: 'FRED DGS10',    transform: 'media mensual' },
        DFF:          { label: 'Fed Funds Rate',     unit: '%', series: dffMonthly,   source: 'FRED DFF',      transform: 'media mensual' },
        CPI_YOY:      { label: 'CPI Headline YoY',  unit: '%', series: cpiYoY,        source: 'FRED CPIAUCSL', transform: 'YoY por fecha real' },
        CORE_CPI_YOY: { label: 'Core CPI YoY',      unit: '%', series: cpiCoreYoY,   source: 'FRED CPILFESL', transform: 'YoY por fecha real' },
      },
      _debug: {
        nScore:        scoreHistory.length,
        firstScore:    histMacroV1.find(m => m.valid)?.month,
        lastScore:     [...histMacroV1].reverse().find(m => m.valid)?.month,
        nTotal:        histMacroV1.length,
        nValid:        histMacroV1.filter(m => m.valid).length,
        nViolations:   nAbsViolation,
        invariantsPass,
        invariantStatus,
        firstViolation: globalViolations[0] || null,
        version:       VERSION,
        maxPossible:   MAX_POSSIBLE,
        // Meses de auditoría — para validación cruzada
        auditMonths: ['2026-06','2022-10','2020-04','2018-12'].map(ym => {
          const m = histMacroV1.find(h => h.month === ym);
          return m || { month: ym, valid: false, error: 'no encontrado' };
        }),
      },
    },
    histMacroV1: histMacroV1.filter(m => m.valid),
    analogies: {
      current:   { month: latestValid?.month, vector: latestVector, top10: analogyCurrent, summary: summarize(analogyCurrent) },
      probes:    analogyProbe,
      version:   'SIMILARITY_V2_PIT_COSINE_ZSCORE_WIN_DEDUP6M',
      minDims:   MIN_DIMS,
      excludeLast: EXCLUDE_LAST,
      spCoverage: {
        first: spMapFirst, last: spMapLast, n: spNorm.length,
        chunkA: spChunkA ? spChunkA.length + ' obs desde ' + spChunkA[0]?.date : 'FAILED',
        chunkB: spChunkB ? spChunkB.length + ' obs desde ' + spChunkB[0]?.date : 'FAILED',
        chunkC: spChunkC ? spChunkC.length + ' obs desde ' + spChunkC[0]?.date : 'FAILED',
      },
    },

    // Para Correlaciones
    correlaciones,
    corrMatrix,
    corrAudit,
    regimeAnalysis,
    quintiles,
    stabilityByIndicator,
    radarStressTest,
    spearman: {
      return12m:          spearmanReturn,
      binary12m:          spearmanBinary,
      binary12mNonOverlap: spearmanBinaryNonOverlap,
      binary12mHAC:        spearmanBinaryHAC,
      binary12mBootstrap:  spearmanBinaryBootstrap,
      nNonOverlap: nonOverlapN,
      n:                  spearmanN,
    },

    // Metadatos
    n_months: sp?.length || 0,
    errors: errs.length ? errs : undefined,
  });
}
