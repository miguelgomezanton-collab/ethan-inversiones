// /api/macro-rlab/execute.js — Vercel Serverless
// Orquestador de ejecución de experimentos Macro R-LAB
//
// POST /api/macro-rlab/execute
// Body: { researchId, periodConfig?, notes? }
//
// Flujo:
//   1. Cargar investigación de Firestore
//   2. Fetch datos diarios de señal + objetivo
//   3. Calcular rendimientos forward (fwdReturns) a 1M/3M/6M/12M
//   4. Alinear señal con rendimientos (con lag)
//   5. Ejecutar stats: pearson, spearman, bootstrap, quintiles, estabilidad, walk-forward
//   6. classifyExperiment → veredicto
//   7. Guardar versión en macro_rlab_versions + ejecución en macro_rlab_executions
//   8. Actualizar versionCount en la investigación

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';
import {
  pearson, spearman, blockBootstrap, quintiles,
  monotonicityCheck, temporalStability, walkForward,
  lookAheadCheck, coverageCheck, alignByDate,
  classifyExperiment, forwardReturnSummary,
} from '../lib/macro-rlab-stats.js';

const FRED_API = 'https://api.stlouisfed.org/fred/series/observations';
const COL_RESEARCH   = 'macro_rlab_research';
const COL_VERSIONS   = 'macro_rlab_versions';
const COL_EXECUTIONS = 'macro_rlab_executions';

// ─── Indicadores disponibles para fetch ──────────────────────────────────────
const FRED_SERIES = {
  VIX:     'VIXCLS',
  HY_OAS:  'BAMLH0A0HYM2',
  SP500:   'SP500',
  DGS10:   'DGS10',
  DGS2:    'DGS2',
  DFII10:  'DFII10',
  DFF:     'DFF',
  BBB:     'BAMLC0A4CBBB',
};

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

// ─── Calcular rendimientos forward en meses ──────────────────────────────────
// Para cada punto, busca el precio M meses después y calcula log-return
function calcForwardReturns(data, months) {
  // data: [{date: 'YYYY-MM-DD', value: number}] ordenados asc
  const result = {}; // date → { 1M, 3M, 6M, 12M }
  const dateMap = new Map(data.map(p => [p.date, p.value]));
  const dates   = data.map(p => p.date);

  for (let i = 0; i < data.length; i++) {
    const { date, value } = data[i];
    const fwds = {};
    for (const m of months) {
      // Buscar fecha aproximada M meses adelante
      const target = new Date(date + 'T00:00:00Z');
      target.setUTCMonth(target.getUTCMonth() + m);
      const targetStr = target.toISOString().slice(0, 10);
      // Buscar la fecha más cercana en ±5 días hábiles
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
      // Buscar ~12 meses antes
      const prev = data.find((p, j) => {
        if (j >= i) return false;
        const ms = new Date(date) - new Date(p.date);
        return ms >= 330 * 86400000 && ms <= 395 * 86400000;
      });
      if (prev && prev.value !== 0) out.push({ date, value: (value - prev.value) / prev.value });
    } else if (method === 'MOM') {
      if (i > 0 && data[i-1].value !== 0) {
        out.push({ date, value: (value - data[i-1].value) / data[i-1].value });
      }
    } else if (method === 'ZSCORE') {
      // z-score rolling 252 días (~1 año)
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
    const research = resDoc.data();
    const periodCfg = bodyPeriod || research.periodConfig || { type: 'MAX' };
    const horizons  = research.horizonMonths || [1, 3, 6, 12];
    const lagMonths = research.lag || 0;

    // 2. Fetch datos de señal y objetivo
    const signalSeries = FRED_SERIES[research.signal];
    const targetSeries = FRED_SERIES[research.targetIndicator];
    if (!signalSeries) return res.status(400).json({ error: `Indicador señal no soportado: ${research.signal}` });
    if (!targetSeries) return res.status(400).json({ error: `Indicador objetivo no soportado: ${research.targetIndicator}` });

    const [rawSignal, rawTarget] = await Promise.all([
      fetchFRED(signalSeries, apiKey),
      fetchFRED(targetSeries, apiKey),
    ]);

    // 3. Transformar señal
    const transformedSignal = transformSignal(
      applyPeriodFilter(rawSignal, periodCfg),
      research.transformSignal || 'LEVEL'
    );
    const filteredTarget = applyPeriodFilter(rawTarget, periodCfg);

    // Cobertura
    const signalCov = coverageCheck(transformedSignal.map(p => p.value));
    const targetCov = coverageCheck(filteredTarget.map(p => p.value));

    // Metadatos de período efectivo
    const effectiveFrom = transformedSignal[0]?.date ?? null;
    const effectiveTo   = transformedSignal[transformedSignal.length - 1]?.date ?? null;
    const nSignal = transformedSignal.length;
    const nTarget = filteredTarget.length;

    // 4. Calcular rendimientos forward del target
    const fwdMap = calcForwardReturns(filteredTarget, horizons);

    // 5. Para cada horizonte, alinear señal con rendimientos (con lag)
    const results = {};
    for (const h of horizons) {
      const key = `${h}M`;
      // Construir pares (signal_date, fwd_return)
      // Si lag > 0: la señal en t predice el retorno desde t+lag
      const pairs = [];
      const signalDates = [];
      const returnDates = [];

      for (const { date, value: sigVal } of transformedSignal) {
        // Fecha de entrada al trade: date + lag meses
        let entryDate = date;
        if (lagMonths > 0) {
          const d = new Date(date + 'T00:00:00Z');
          d.setUTCMonth(d.getUTCMonth() + lagMonths);
          entryDate = d.toISOString().slice(0, 10);
        }
        // Buscar rendimiento forward desde entryDate
        if (fwdMap[entryDate]?.[key] !== undefined) {
          pairs.push([sigVal, fwdMap[entryDate][key]]);
          signalDates.push(date);
          returnDates.push(entryDate);
        } else {
          // Buscar fecha más cercana
          for (let delta = 1; delta <= 5; delta++) {
            for (const sign of [1, -1]) {
              const d2 = new Date(entryDate + 'T00:00:00Z');
              d2.setUTCDate(d2.getUTCDate() + sign * delta);
              const k = d2.toISOString().slice(0, 10);
              if (fwdMap[k]?.[key] !== undefined) {
                pairs.push([sigVal, fwdMap[k][key]]);
                signalDates.push(date);
                returnDates.push(k);
                break;
              }
            }
            if (pairs.length > (results[key]?.pairs?.length ?? 0) + 1 ||
                signalDates.length > 0) break;
          }
        }
      }

      if (pairs.length < 20) {
        results[key] = { error: 'Datos insuficientes', nPairs: pairs.length };
        continue;
      }

      // Stats principales
      const pear   = pearson(pairs.map(p => p[0]), pairs.map(p => p[1]));
      const spear  = spearman(pairs.map(p => p[0]), pairs.map(p => p[1]));
      const boot   = blockBootstrap(pairs);
      const quints = quintiles(pairs.map(p => p[0]), pairs.map(p => p[1]), research.quintiles || 5);
      const mono   = monotonicityCheck(quints);
      const stab   = temporalStability(pairs, (xs, ys) => spearman(xs, ys));
      const wf     = walkForward(pairs, 0.6, (xs, ys) => spearman(xs, ys));
      const lookahead = lookAheadCheck(signalDates, returnDates, h);

      results[key] = {
        nPairs:      pairs.length,
        pearson:     pear,
        spearman:    spear,
        bootstrap:   boot,
        quintiles:   quints,
        monotonicity: mono,
        stability:   stab,
        walkForward: wf,
        lookAheadViolations: lookahead,
        verdict: classifyExperiment({
          spearmanResult: spear,
          bootstrap:      boot,
          stability:      stab,
          walkForward:    wf,
          coverage:       Math.min(signalCov, targetCov),
          minN:           pairs.length,
        }),
      };
    }

    // 6. Veredicto global (el peor de los horizontes relevantes)
    const verdictOrder = ['VALIDADA', 'INDICATIVA', 'INCONCLUSA', 'NO_VALIDADA'];
    const verdicts     = Object.values(results).map(r => r.verdict).filter(Boolean);
    const globalVerdict = verdictOrder.find(v => !verdicts.includes(v) ? false : true)
      ?? verdicts[0] ?? 'INCONCLUSA';

    // 7. Guardar versión
    const versionData = {
      researchId,
      versionNum:      (research.versionCount || 0) + 1,
      periodConfig:    periodCfg,
      effectiveFrom,
      effectiveTo,
      nSignal,
      nTarget,
      signalCoverage:  signalCov,
      targetCoverage:  targetCov,
      results,
      verdict:         globalVerdict,
      notes,
      createdAt: FieldValue.serverTimestamp(),
    };
    const versionRef = await db.collection(COL_VERSIONS).add(versionData);

    // Guardar ejecución
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
      versionCount: FieldValue.increment(1),
      executionCount: FieldValue.increment(1),
      state: globalVerdict === 'VALIDADA' ? 'VALIDADA' :
             globalVerdict === 'INDICATIVA' ? 'INDICATIVA' : 'EN_INVESTIGACION',
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      versionId:   versionRef.id,
      executionId: execRef.id,
      verdict:     globalVerdict,
      effectiveFrom,
      effectiveTo,
      nSignal,
      nTarget,
      results,
    });

  } catch (err) {
    console.error('[macro-rlab/execute]', err);
    // Marcar ejecución como fallida si tenemos researchId
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
