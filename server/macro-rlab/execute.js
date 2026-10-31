// /api/macro-rlab/execute.js — Vercel Serverless
// Orquestador de ejecución de experimentos Macro R-LAB
//
// POST /api/macro-rlab/execute
// Body: { researchId, periodConfig?, notes? }
//
// Flujo:
//   1. Cargar investigación de Firestore
//   2. Fetch datos diarios de señal + objetivo (con soporte Yahoo Finance para SP500/VIX3M)
//   3. Calcular rendimientos forward (fwdReturns) a 1M/3M/6M/12M
//   4. Alinear señal con rendimientos (con lag) — ordenado cronológicamente (B10)
//   5. Ejecutar stats: pearson, spearman, bootstrap adaptativo (B4+B5), quintiles,
//      estabilidad, walk-forward
//   6. classifyExperiment con expectedDirection (B3) → veredicto
//   7. Guardar versión en macro_rlab_versions + ejecución en macro_rlab_executions
//   8. Actualizar versionCount en la investigación

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';
import {
  pearson, spearman, blockBootstrap, quintiles,
  monotonicityCheck, temporalStability, walkForward,
  lookAheadCheck, coverageCheck, alignByDate,
  classifyExperiment, forwardReturnSummary,
  // B2: señales derivadas VIX/VIX3M
  vixVix3mRatio, vixVix3mDiff, vixVix3mCross1,
  vixVix3mContango, vixVix3mIntensity, vixVix3mRegimeDur,
  // B6: transformaciones adicionales
  rollingMA, maDistance, maCrossover, maSlope,
  nSessionReturn, rollingPercentile, rollingZScore, vixAboveMaRule,
} from './stats.js';

const FRED_API = 'https://api.stlouisfed.org/fred/series/observations';
const COL_RESEARCH   = 'macro_rlab_research';
const COL_VERSIONS   = 'macro_rlab_versions';
const COL_EXECUTIONS = 'macro_rlab_executions';

// ─── Indicadores disponibles para fetch ──────────────────────────────────────
// B1+B2: SP500 y VIX3M ahora van por Yahoo Finance
const FRED_SERIES = {
  VIX:    'VIXCLS',
  HY_OAS: 'BAMLH0A0HYM2',
  DGS10:  'DGS10',
  DGS2:   'DGS2',
  DFII10: 'DFII10',
  DFF:    'DFF',
  BBB:    'BAMLC0A4CBBB',
};
const YAHOO_SYMBOLS = {
  SP500: '%5EGSPC',  // B1: historia completa desde 1928
  VIX3M: '%5EVIX3M', // B2: necesario para señales derivadas
};

// B2: indicadores que son señales derivadas VIX/VIX3M
const VIX_VIX3M_DERIVED = new Set([
  'VIX_VIX3M_RATIO',
  'VIX_VIX3M_DIFF',
  'VIX_VIX3M_CROSS1',
  'VIX_VIX3M_CONTANGO',
  'VIX_VIX3M_INTENSITY',
  'VIX_VIX3M_REGIME_DUR',
]);

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  return getFirestore();
}

// ─── Fetch FRED diario ────────────────────────────────────────────────────────
async function fetchFRED(series, apiKey, from = '') {
  const startParam = from ? `&observation_start=${from}` : '';
  const url = `${FRED_API}?series_id=${series}&api_key=${apiKey}&file_type=json&sort_order=asc&frequency=d${startParam}`;
  const r   = await fetch(url);
  if (!r.ok) throw new Error(`FRED ${series}: HTTP ${r.status}`);
  const d   = await r.json();
  return (d.observations || [])
    .filter(o => o.value !== '.' && o.value !== 'null')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }))
    .filter(o => isFinite(o.value));
}

// ─── Fetch Yahoo Finance ──────────────────────────────────────────────────────
// B1: ^GSPC con range=max; B2: ^VIX3M con range=20y
async function fetchYahoo(symbol) {
  const range = symbol === '%5EGSPC' ? 'max' : '20y';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}&events=history`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ETHAN-Macro-RLAB/1.0)', 'Accept': 'application/json' },
  });
  if (!r.ok) throw new Error(`Yahoo ${symbol}: HTTP ${r.status}`);
  const res = (await r.json()).chart?.result?.[0];
  if (!res) throw new Error(`Yahoo ${symbol}: sin datos`);
  const ts     = res.timestamps || res.timestamp || [];
  const closes = res.indicators?.quote?.[0]?.close || [];
  return ts
    .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), value: closes[i] }))
    .filter(p => p.value != null && isFinite(p.value));
}

// ─── Fetch por indicador (FRED o Yahoo) ──────────────────────────────────────
async function fetchIndicator(indKey, apiKey) {
  if (YAHOO_SYMBOLS[indKey]) {
    return fetchYahoo(YAHOO_SYMBOLS[indKey]);
  }
  if (FRED_SERIES[indKey]) {
    return fetchFRED(FRED_SERIES[indKey], apiKey);
  }
  // CURVE_10_2: diferencia de dos series FRED
  if (indKey === 'CURVE_10_2') {
    const [s10, s2] = await Promise.all([
      fetchFRED('DGS10', apiKey),
      fetchFRED('DGS2',  apiKey),
    ]);
    const s2Map = new Map(s2.map(p => [p.date, p.value]));
    return s10
      .filter(p => s2Map.has(p.date))
      .map(p => ({ date: p.date, value: +(p.value - s2Map.get(p.date)).toFixed(3) }));
  }
  throw new Error(`Indicador no soportado en execute: ${indKey}`);
}

// ─── B2: Construir señal derivada VIX/VIX3M on-the-fly ──────────────────────
// Requiere rawVIX y rawVIX3M ya cargados
async function buildDerivedVixSignal(signalKey, apiKey) {
  const [rawVix, rawVix3m] = await Promise.all([
    fetchFRED('VIXCLS', apiKey),
    fetchYahoo('%5EVIX3M'),
  ]);
  switch (signalKey) {
    case 'VIX_VIX3M_RATIO':      return vixVix3mRatio(rawVix, rawVix3m);
    case 'VIX_VIX3M_DIFF':       return vixVix3mDiff(rawVix, rawVix3m);
    case 'VIX_VIX3M_CROSS1':     return vixVix3mCross1(rawVix, rawVix3m);
    case 'VIX_VIX3M_CONTANGO':   return vixVix3mContango(rawVix, rawVix3m);
    case 'VIX_VIX3M_INTENSITY':  return vixVix3mIntensity(rawVix, rawVix3m);
    case 'VIX_VIX3M_REGIME_DUR': return vixVix3mRegimeDur(rawVix, rawVix3m);
    default: throw new Error(`Señal derivada VIX/VIX3M desconocida: ${signalKey}`);
  }
}

// ─── Calcular rendimientos forward en meses ──────────────────────────────────
// B4: expone nOverlapping para cada horizonte
// Devuelve Map<date, {1M, 3M, ...}>
function calcForwardReturns(data, months) {
  const result  = {};
  const dateMap = new Map(data.map(p => [p.date, p.value]));

  for (let i = 0; i < data.length; i++) {
    const { date, value } = data[i];
    const fwds = {};
    for (const m of months) {
      const target = new Date(date + 'T00:00:00Z');
      target.setUTCMonth(target.getUTCMonth() + m);
      let fwdVal = null;
      for (let delta = 0; delta <= 7; delta++) {
        for (const sign of [0, 1, -1]) {
          const d2 = new Date(target);
          d2.setUTCDate(d2.getUTCDate() + sign * delta);
          const k = d2.toISOString().slice(0, 10);
          if (dateMap.has(k)) { fwdVal = dateMap.get(k); break; }
        }
        if (fwdVal !== null) break;
      }
      if (fwdVal !== null && value > 0) {
        fwds[`${m}M`] = Math.log(fwdVal / value);
      }
    }
    if (Object.keys(fwds).length) result[date] = fwds;
  }
  return result;
}

// ─── Transformar señal ────────────────────────────────────────────────────────
function transformSignal(data, method) {
  if (method === 'LEVEL') return data;
  const out = [];
  for (let i = 0; i < data.length; i++) {
    const { date, value } = data[i];
    if (method === 'YOY') {
      const prev = data.find((p, j) => {
        if (j >= i) return false;
        const ms = new Date(date) - new Date(p.date);
        return ms >= 330 * 86400000 && ms <= 395 * 86400000;
      });
      if (prev && prev.value !== 0) out.push({ date, value: (value - prev.value) / prev.value });
    } else if (method === 'MOM') {
      if (i > 0 && data[i-1].value !== 0)
        out.push({ date, value: (value - data[i-1].value) / data[i-1].value });
    } else if (method === 'ZSCORE') {
      const window = data.slice(Math.max(0, i - 251), i + 1).map(p => p.value);
      if (window.length >= 30) {
        const mean = window.reduce((a, b) => a + b, 0) / window.length;
        const std  = Math.sqrt(window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length);
        if (std > 0) out.push({ date, value: (value - mean) / std });
      }
    } else {
      out.push({ date, value });
    }
  }
  return out;
}

// ─── B6: Aplicar transformaciones adicionales ────────────────────────────────
// method: 'MM10' | 'MM100' | 'MM200' | 'MA_DIST_100' | etc.
function applyExtendedTransform(data, method) {
  if (!method || method === 'LEVEL') return data;
  switch (method) {
    case 'MM10':        return rollingMA(data, 10).filter(p => p.value != null);
    case 'MM100':       return rollingMA(data, 100).filter(p => p.value != null);
    case 'MM200':       return rollingMA(data, 200).filter(p => p.value != null);
    case 'MA_DIST_100': {
      const ma = rollingMA(data, 100);
      return maDistance(data, ma).filter(p => p.value != null);
    }
    case 'MA_DIST_200': {
      const ma = rollingMA(data, 200);
      return maDistance(data, ma).filter(p => p.value != null);
    }
    case 'MA_SLOPE_10': {
      const ma = rollingMA(data, 10);
      return maSlope(ma, 5).filter(p => p.value != null);
    }
    case 'RET_5S':  return nSessionReturn(data, 5).filter(p => p.value != null);
    case 'RET_20S': return nSessionReturn(data, 20).filter(p => p.value != null);
    case 'RET_60S': return nSessionReturn(data, 60).filter(p => p.value != null);
    case 'PCT_2Y':  return rollingPercentile(data, 504).filter(p => p.value != null);
    case 'PCT_5Y':  return rollingPercentile(data, 1260).filter(p => p.value != null);
    case 'Z_2Y':    return rollingZScore(data, 2).filter(p => p.value != null);
    case 'Z_3Y':    return rollingZScore(data, 3).filter(p => p.value != null);
    case 'Z_5Y':    return rollingZScore(data, 5).filter(p => p.value != null);
    case 'Z_10Y':   return rollingZScore(data, 10).filter(p => p.value != null);
    default:        return data;
  }
}

// ─── Aplicar filtro de período ────────────────────────────────────────────────
function applyPeriodFilter(data, periodConfig) {
  if (!periodConfig || periodConfig.type === 'MAX') return data;
  const cutoffMap = { '5Y': 5, '10Y': 10, '20Y': 20 };
  if (cutoffMap[periodConfig.type]) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - cutoffMap[periodConfig.type]);
    const from = d.toISOString().slice(0, 10);
    return data.filter(p => p.date >= from);
  }
  if (periodConfig.type === 'CUSTOM') {
    let out = data;
    if (periodConfig.from) out = out.filter(p => p.date >= periodConfig.from);
    if (periodConfig.to)   out = out.filter(p => p.date <= periodConfig.to);
    return out;
  }
  return data;
}

// ─── Handler principal ────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'FRED_API_KEY no configurada' });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return res.status(500).json({ error: 'FIREBASE_SERVICE_ACCOUNT no configurada' });

  const { researchId, periodConfig: bodyPeriod, notes = '' } = req.body || {};
  if (!researchId) return res.status(400).json({ error: 'Falta researchId' });

  const db = getDB();

  try {
    // 1. Cargar investigación
    const resDoc = await db.collection(COL_RESEARCH).doc(researchId).get();
    if (!resDoc.exists) return res.status(404).json({ error: 'Investigación no encontrada' });
    const research   = resDoc.data();
    const periodCfg  = bodyPeriod || research.periodConfig || { type: 'MAX' };
    const horizons   = research.horizonMonths || [1, 3, 6, 12];
    const lagMonths  = research.lag || 0;

    // B3: leer expectedDirection de la investigación (default: TWO_SIDED)
    const expectedDirection = research.expectedDirection || 'TWO_SIDED';

    // 2. Fetch datos de señal y objetivo
    const signalKey = research.signal?.toUpperCase();
    const targetKey = research.targetIndicator?.toUpperCase();

    let rawSignal;
    // B2: señales derivadas VIX/VIX3M se construyen on-the-fly
    if (VIX_VIX3M_DERIVED.has(signalKey)) {
      rawSignal = await buildDerivedVixSignal(signalKey, apiKey);
    } else {
      rawSignal = await fetchIndicator(signalKey, apiKey);
    }

    const rawTarget = await fetchIndicator(targetKey, apiKey);

    // 3. Transformar señal — primero transformaciones clásicas, luego extendidas
    const classicTransform   = research.transformSignal || 'LEVEL';
    const extendedTransform  = research.transformExtended || null; // MM10, Z_5Y, etc.

    let transformedSignal = transformSignal(
      applyPeriodFilter(rawSignal, periodCfg),
      classicTransform
    );
    if (extendedTransform) {
      transformedSignal = applyExtendedTransform(transformedSignal, extendedTransform);
    }

    const filteredTarget = applyPeriodFilter(rawTarget, periodCfg);

    // Cobertura
    const signalCov = coverageCheck(transformedSignal.map(p => p.value));
    const targetCov = coverageCheck(filteredTarget.map(p => p.value));

    const effectiveFrom = transformedSignal[0]?.date ?? null;
    const effectiveTo   = transformedSignal[transformedSignal.length - 1]?.date ?? null;
    const nSignal = transformedSignal.length;
    const nTarget = filteredTarget.length;

    // 4. Calcular rendimientos forward del target
    const fwdMap = calcForwardReturns(filteredTarget, horizons);

    // 5. Para cada horizonte, alinear señal con rendimientos
    const results = {};
    for (const h of horizons) {
      const key = `${h}M`;
      // B4: horizonDays para BL adaptativo
      const horizonDays = h * 21; // ~21 sesiones/mes

      const pairs        = [];
      const signalDates  = [];
      const returnDates  = [];

      // B10: asegurar orden cronológico de transformedSignal antes de iterar
      const sortedSignal = [...transformedSignal].sort((a, b) => a.date < b.date ? -1 : 1);

      for (const { date, value: sigVal } of sortedSignal) {
        let entryDate = date;
        if (lagMonths > 0) {
          const d = new Date(date + 'T00:00:00Z');
          d.setUTCMonth(d.getUTCMonth() + lagMonths);
          entryDate = d.toISOString().slice(0, 10);
        }
        if (fwdMap[entryDate]?.[key] !== undefined) {
          pairs.push({ date, x: sigVal, y: fwdMap[entryDate][key] });
          signalDates.push(date);
          returnDates.push(entryDate);
        } else {
          // Buscar fecha más cercana ±5 días
          let found = false;
          for (let delta = 1; delta <= 5 && !found; delta++) {
            for (const sign of [1, -1]) {
              const d2 = new Date(entryDate + 'T00:00:00Z');
              d2.setUTCDate(d2.getUTCDate() + sign * delta);
              const k = d2.toISOString().slice(0, 10);
              if (fwdMap[k]?.[key] !== undefined) {
                pairs.push({ date, x: sigVal, y: fwdMap[k][key] });
                signalDates.push(date);
                returnDates.push(k);
                found = true;
                break;
              }
            }
          }
        }
      }

      if (pairs.length < 20) {
        results[key] = { error: 'Datos insuficientes', nPairs: pairs.length };
        continue;
      }

      // B4: nObs y nEffective
      const nObs       = pairs.length;
      const nEffective = Math.max(1, Math.floor(nObs / horizonDays));

      // Stats principales
      const xs   = pairs.map(p => p.x);
      const ys   = pairs.map(p => p.y);
      const pear = pearson(xs, ys);
      const spear = spearman(xs, ys);
      // B4+B5: pasar horizonDays al bootstrap
      const boot   = blockBootstrap(pairs.map(p => ({ x: p.x, y: p.y })), 5000, horizonDays);
      const quints = quintiles(xs, ys, research.quintiles || 5);
      const mono   = monotonicityCheck(quints);
      const stab   = temporalStability(pairs, (p) => spearman(p.map(e => e.x), p.map(e => e.y)));
      // B10: pairs ya están en orden cronológico (sortedSignal)
      const wf         = walkForward(pairs, 0.6, (p) => spearman(p.map(e => e.x), p.map(e => e.y)));
      const lookahead  = lookAheadCheck(signalDates, returnDates, h);

      // B3: pasar expectedDirection al clasificador
      const verdict = classifyExperiment({
        spearmanResult:    spear,
        bootstrap:         boot,
        stability:         stab,
        walkForward:       wf,
        coverage:          signalCov,
        minN:              Math.min(30, nEffective * 3), // ajustar minN al nEffective
        expectedDirection,
      });

      results[key] = {
        // B4: exponer nObs y nEffective
        nPairs:       nObs,
        nObs,
        nEffective,
        horizonDays,
        pearson:      pear,
        spearman:     spear,
        bootstrap:    boot,
        quintiles:    quints,
        monotonicity: mono,
        stability:    stab,
        walkForward:  wf,
        lookAheadViolations: lookahead,
        verdict,
        expectedDirection,
      };
    }

    // 6. Veredicto global (el peor de los horizontes relevantes)
    const verdictOrder  = ['VALIDADA', 'INDICATIVA', 'INCONCLUSA', 'NO_VALIDADA'];
    const verdicts      = Object.values(results).map(r => r.verdict).filter(Boolean);
    const globalVerdict = verdictOrder.find(v => verdicts.includes(v)) ?? verdicts[0] ?? 'INCONCLUSA';

    // 7. Guardar versión
    const versionData = {
      researchId,
      versionNum:        (research.versionCount || 0) + 1,
      periodConfig:      periodCfg,
      effectiveFrom,
      effectiveTo,
      nSignal,
      nTarget,
      signalCoverage:    signalCov,
      targetCoverage:    targetCov,
      expectedDirection,
      results,
      verdict:           globalVerdict,
      notes,
      createdAt: FieldValue.serverTimestamp(),
    };
    const versionRef = await db.collection(COL_VERSIONS).add(versionData);

    const execData = {
      researchId,
      versionId:   versionRef.id,
      status:      'COMPLETED',
      verdict:     globalVerdict,
      horizons,
      nPairs:      Math.max(...Object.values(results).map(r => r.nPairs || 0)),
      startedAt:   FieldValue.serverTimestamp(),
      completedAt: FieldValue.serverTimestamp(),
    };
    const execRef = await db.collection(COL_EXECUTIONS).add(execData);

    // Actualizar investigación
    await db.collection(COL_RESEARCH).doc(researchId).update({
      versionCount:   FieldValue.increment(1),
      executionCount: FieldValue.increment(1),
      state: globalVerdict === 'VALIDADA'  ? 'VALIDADA' :
             globalVerdict === 'INDICATIVA'? 'INDICATIVA' : 'EN_INVESTIGACION',
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      versionId:    versionRef.id,
      executionId:  execRef.id,
      verdict:      globalVerdict,
      effectiveFrom,
      effectiveTo,
      nSignal,
      nTarget,
      expectedDirection,
      results,
    });

  } catch (err) {
    console.error('[macro-rlab/execute]', err);
    try {
      await db.collection(COL_EXECUTIONS).add({
        researchId,
        status:      'FAILED',
        error:       err.message,
        startedAt:   FieldValue.serverTimestamp(),
        completedAt: FieldValue.serverTimestamp(),
      });
    } catch {}
    return res.status(500).json({ error: err.message });
  }
}
