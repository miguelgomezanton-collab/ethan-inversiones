// /api/macro-history.js — Vercel Serverless
// Datos históricos para Timeline y Correlaciones
// La FRED API key vive SOLO aquí, nunca en el frontend

const FRED = 'https://api.stlouisfed.org/fred/series/observations';

async function fred(id, key, limit = 96, order = 'asc', freq = '', observationStart = '') {
  const freqParam  = freq ? `&frequency=${freq}` : '';
  const startParam = observationStart ? `&observation_start=${observationStart}` : '';
  const limitParam = observationStart ? '' : `&limit=${limit}`;
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

  const type = req.query.type || 'all'; // 'timeline' | 'correlaciones' | 'all'
  const errs = [];

  // ── Fetch FRED histórico ──────────────────────
  const [rSp, rNq, rRu, rAu, rBond, rDxy,
         rDgs10, rDgs2, rDff, rCpi, rCpiCore, rBbb, rM2v, rWresbal, rTotll, rGdp,
         rLei, rM2sl] =
    await Promise.allSettled([
      fred('SP500',     key, 0, 'asc', 'm', '1976-01-01'),  // histórico completo para forward returns
      fred('SP500',     key, 0, 'asc', 'm', '1976-01-01'),  // placeholder
      fred('SP500',     key, 0, 'asc', 'm', '1976-01-01'),  // placeholder
      fred('GOLDAMGBD228NLBM', key, 120, 'asc', 'm'),
      fred('DGS10',     key, 120, 'asc', 'm'),
      fred('DTWEXBGS',  key, 120, 'asc', 'm'),
      fred('DGS10',  key, 0, 'asc', '', '1976-01-01'),  // desde 1976 para histórico completo
      fred('DGS2',   key, 0, 'asc', '', '1976-01-01'),
      fred('DFF',    key, 0, 'asc', '', '1954-01-01'),
      fred('CPIAUCSL',   key, 0, 'asc', '', '1947-01-01'),  // asc para YoY histórico
      fred('CPILFESL',   key, 132, 'desc'),
      fred('BAMLC0A4CBBB', key, 0, 'asc', '', '1997-01-01'),
      fred('M2V',        key, 0, 'asc', '', '1959-01-01'),
      fred('WRESBAL',    key, 0, 'asc', '', '1984-01-01'),
      fred('TOTLL',      key, 0, 'asc', '', '1973-01-01'),
      fred('GDP',        key, 0, 'asc', '', '1947-01-01'),
      fred('USALOLITOAASTSAM', key, 0, 'asc', '', '1959-01-01'),  // LEI
      fred('M2SL',       key, 0, 'asc', '', '1959-01-01'),        // M2 USA proxy M2 Global
    ]);

  // ── Procesar series ───────────────────────────
  const sp   = rSp.status   === 'fulfilled' ? rSp.value   : null;
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
  const cpiAsc       = cpi     ? [...cpi].reverse()     : null;
  const cpiCoreAsc   = cpiCore ? [...cpiCore].reverse() : null;
  const cpiYoY       = yoySeries(cpiAsc);      // CPI Headline YoY
  const cpiCoreYoY   = yoySeries(cpiCoreAsc);  // Core CPI YoY
  const m2YoY    = yoySeries(m2v);
  const totllYoY = yoySeries(totll);
  const gdpYoY   = yoySeries(gdp);
  const spRaw    = normalizeBase100(sp);  // mantenemos para correlaciones
  const spNorm   = sp ? [...sp].sort((a,b) => a.date.localeCompare(b.date)) : []; // raw asc para timeline

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
      // BBB ya contribuye en 1.2 Liquidez — doble conteo si se incluye aquí
      const bbbV = bbbMap.get(ym);
      comps.bbb = bbbV != null
        ? { value: bbbV, score: 0, maxScore: 0, maxAnalogias: 1, valid: true, source: 'BAMLC0A4CBBB', note: 'Max Macro: 0 | Analogías: ±1' }
        : { value: null, score: null, maxScore: 0, maxAnalogias: 1, valid: false, source: 'BAMLC0A4CBBB' };

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
  // Vector: [curvaUSD, tipoReal, lei, m2usa, creditoVsPib, impulso, velM2, reservas, bbb]
  // BBB entra en similitud (no en score) — ayuda a distinguir estrés financiero
  const VECTOR_KEYS   = ['curvaUSD','tipoReal','lei','m2usa','creditoVsPib','impulso','velM2','reservas','bbb'];
  const VECTOR_MAXSC  = { curvaUSD:1, tipoReal:1, lei:1, m2usa:3, creditoVsPib:3, impulso:2, velM2:2, reservas:1, bbb:1 };
  const MIN_DIMS      = 6;  // mínimo 6 de 9 dimensiones comunes
  const EXCLUDE_LAST  = 12; // excluir últimos 12 meses del histórico

  // Construir mapa SP500 mensual para retornos forward
  const spMap = new Map(spNorm.map(p => [p.date.slice(0,7), p.value]));

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
  const latestMonth = latestValid?.month || '2099-01';

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
  const latestValid = [...histMacroV1].reverse().find(m => m.valid);
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
    if (!m?.valid) return { month: ym, error: 'no válido' };
    // Point-in-time: normalizar el query con stats disponibles hasta el mes de referencia
    const v = getVector(m, ym);
    const top = findAnalogies(v, ym, 10, { walkForward: true });
    return { month: ym, analogies: top, queryVector: v };
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

  // ── Correlaciones (retornos mensuales) ────────
  const calcCorr = (indSeries, assetSeries) => {
    if (!indSeries || !assetSeries) return null;
    const indRet = monthlyReturns(indSeries);
    const astRet = monthlyReturns(assetSeries);
    const { xs, ys } = alignByDate(indRet, astRet);
    return pearson(xs, ys);
  };

  const assets = { sp, nq, ru, au, bond, dxy };
  const indicators = {
    curvaUSD,
    tipoReal,
    bbb,
    creditoVsNominal,
  };

  const correlaciones = {};
  for (const [indName, indSeries] of Object.entries(indicators)) {
    correlaciones[indName] = {};
    for (const [astName, astSeries] of Object.entries(assets)) {
      correlaciones[indName][astName] = calcCorr(indSeries, astSeries);
    }
  }

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
    },

    // Para Correlaciones
    correlaciones,

    // Metadatos
    n_months: sp?.length || 0,
    errors: errs.length ? errs : undefined,
  });
}
