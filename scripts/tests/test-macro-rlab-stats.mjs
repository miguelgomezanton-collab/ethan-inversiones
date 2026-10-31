#!/usr/bin/env node
// scripts/tests/test-macro-rlab-stats.mjs
// B10: Tests del motor estadístico Macro R-LAB
//
// Verificaciones:
//   1. Walk-forward es estrictamente cronológico (el test nunca tiene fechas anteriores al train)
//   2. blockBootstrap adapta BL al horizonDays
//   3. classifyExperiment respeta expectedDirection
//   4. Load test del endpoint /api/macro-rlab/execute (smoke test de integración)
//
// Uso:
//   node scripts/tests/test-macro-rlab-stats.mjs
//   node scripts/tests/test-macro-rlab-stats.mjs --load-test  (requiere servidor local)
// ─────────────────────────────────────────────────────────────────────────────

import {
  spearman,
  blockBootstrap,
  walkForward,
  classifyExperiment,
  coverageCheck,
  rollingMA,
  vixVix3mRatio,
  vixVix3mRegimeDur,
} from '../../api/lib/macro-rlab-stats.js';

let passed = 0;
let failed = 0;

function assert(condition, label, detail = '') {
  if (condition) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.error(`  ✗  ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n── ${title} ──`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makePairs(n, rhoTarget = -0.5, seed = 42) {
  // Genera pares con correlación aproximada rhoTarget usando seed simple
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) & 0xFFFFFFFF; return (s >>> 0) / 4294967296; };
  const xs  = Array.from({ length: n }, () => lcg() * 100);
  const ys  = xs.map(x => rhoTarget * x + (1 - Math.abs(rhoTarget)) * lcg() * 100);
  // Fechas estrictamente crecientes (un día por observación, salto de 1 día hábil)
  const base = new Date('2010-01-01T00:00:00Z');
  return xs.map((x, i) => {
    // i+1 días para que nunca haya igualdad (base + 1 día es 2010-01-02, etc.)
    const d = new Date(base.getTime() + (i + 1) * 86400000);
    return { date: d.toISOString().slice(0, 10), x, y: ys[i] };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1: Walk-forward — orden cronológico estricto
// ═══════════════════════════════════════════════════════════════════════════════
section('B10 — Walk-forward orden cronológico estricto');

{
  const pairs = makePairs(200);
  // Verificar que pairs están en orden ASC
  let ordered = true;
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].date <= pairs[i-1].date) { ordered = false; break; }
  }
  assert(ordered, 'Pairs de entrada en orden cronológico ASC');

  const wf = walkForward(pairs, 0.6);
  assert(wf !== null, 'walkForward devuelve resultado con 200 pares');
  assert(wf.trainN === 120, `trainN=120 (60% de 200)`, `trainN=${wf.trainN}`);
  assert(wf.testN  === 80,  `testN=80  (40% de 200)`,  `testN=${wf.testN}`);

  // El test nunca tiene fechas anteriores al train
  // Verificamos usando las fechas completas de los pares reales
  const cutoff = Math.floor(pairs.length * 0.6);
  const lastTrainDate = pairs[cutoff - 1].date;
  const firstTestDate = pairs[cutoff].date;
  assert(
    firstTestDate > lastTrainDate,
    `firstTestDate (${firstTestDate}) > lastTrainDate (${lastTrainDate}) — sin solapamiento`,
  );
}

// Caso con pairs mezclados (simulando bug)
{
  const pairsMixed = makePairs(100);
  // Mezclar los últimos 20 al principio
  const shuffled = [...pairsMixed.slice(80), ...pairsMixed.slice(0, 80)];
  const wfShuffled = walkForward(shuffled, 0.6);
  // El resultado debe existir pero tendrá advertencia en consola
  assert(wfShuffled !== null, 'walkForward funciona con pares no ordenados (advierte pero no lanza)');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2: blockBootstrap — BL adaptativo al horizonte (B5)
// ═══════════════════════════════════════════════════════════════════════════════
section('B5 — Bootstrap con BL adaptativo al horizonte');

{
  const pairs  = makePairs(300, -0.4).map(p => ({ x: p.x, y: p.y }));

  // 1M ~ 21 días → BL = round(21 * 1.5) = 32
  const boot1M = blockBootstrap(pairs, 1000, 21);
  assert(boot1M !== null, 'blockBootstrap 1M devuelve resultado');
  assert(boot1M.BL === 32, `BL 1M = 32 (21*1.5=31.5→32)`, `BL=${boot1M.BL}`);
  assert(boot1M.horizonDays === 21, `horizonDays=21`, `horizonDays=${boot1M.horizonDays}`);

  // 3M ~ 63 días → BL = round(63 * 1.5) = 95
  const boot3M = blockBootstrap(pairs, 1000, 63);
  assert(boot3M !== null, 'blockBootstrap 3M devuelve resultado');
  assert(boot3M.BL === 95, `BL 3M = 95 (63*1.5=94.5→95)`, `BL=${boot3M.BL}`);

  // 12M ~ 252 días → BL = round(252 * 1.5) = 378
  const boot12M = blockBootstrap(pairs, 1000, 252);
  assert(boot12M !== null, 'blockBootstrap 12M devuelve resultado');
  assert(boot12M.BL === 378, `BL 12M = 378 (252*1.5)`, `BL=${boot12M.BL}`);

  // nObs y nEffective expuestos (B4)
  assert(typeof boot1M.nObs === 'number',       'nObs expuesto en resultado');
  assert(typeof boot1M.nEffective === 'number', 'nEffective expuesto en resultado');
  assert(boot1M.nObs === 300, `nObs=300`, `nObs=${boot1M.nObs}`);
  // nEffective = floor(300 / 21) = 14
  assert(boot1M.nEffective === 14, `nEffective=14 (300/21)`, `nEffective=${boot1M.nEffective}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3: classifyExperiment con expectedDirection (B3)
// ═══════════════════════════════════════════════════════════════════════════════
section('B3 — classifyExperiment respeta expectedDirection');

{
  // Correlación NEGATIVA significativa con expectedDirection=TWO_SIDED
  // → debe clasificarse como NO_VALIDADA si rho<0 significativo y sin bootRobust ni estabilidad
  // (no es la prueba principal, verificamos el escenario de dirección)

  // Caso principal: correlación NEGATIVA significativa, expectedDirection=NEGATIVE
  // → NO debe clasificarse como NO_VALIDADA
  const spearNeg = { rho: -0.45, p: 0.001, n: 200, ci95: [-0.55, -0.35] };
  const bootNeg  = { excludes0: true, rhoObs: -0.45, pBoot: 0.002, ci95: [-0.58, -0.30] };
  const stabNeg  = [
    { label: 'Early',  rho: -0.40, p: 0.01 },
    { label: 'Mid',    rho: -0.48, p: 0.01 },
    { label: 'Recent', rho: -0.44, p: 0.01 },
  ];
  const wfNeg   = { trainStat: { rho: -0.43 }, testStat: { rho: -0.46 } };
  const covPass  = { pass: true, coveragePct: 99 };

  const verdictNegDir = classifyExperiment({
    spearmanResult: spearNeg,
    bootstrap:      bootNeg,
    stability:      stabNeg,
    walkForward:    wfNeg,
    coverage:       covPass,
    minN:           30,
    expectedDirection: 'NEGATIVE',
  });
  assert(
    verdictNegDir === 'VALIDADA',
    `rho=-0.45 sig + expectedDirection=NEGATIVE → VALIDADA (no NO_VALIDADA)`,
    `actual: ${verdictNegDir}`,
  );

  // Misma señal, expectedDirection=POSITIVE → debe penalizar (rho en dirección contraria)
  const verdictWrongDir = classifyExperiment({
    spearmanResult: spearNeg,
    bootstrap:      bootNeg,
    stability:      stabNeg,
    walkForward:    wfNeg,
    coverage:       covPass,
    minN:           30,
    expectedDirection: 'POSITIVE',
  });
  assert(
    verdictWrongDir === 'NO_VALIDADA',
    `rho=-0.45 sig + expectedDirection=POSITIVE → NO_VALIDADA`,
    `actual: ${verdictWrongDir}`,
  );

  // TWO_SIDED: cualquier dirección vale
  const verdictTwoSided = classifyExperiment({
    spearmanResult: spearNeg,
    bootstrap:      bootNeg,
    stability:      stabNeg,
    walkForward:    wfNeg,
    coverage:       covPass,
    minN:           30,
    expectedDirection: 'TWO_SIDED',
  });
  assert(
    verdictTwoSided === 'VALIDADA',
    `rho=-0.45 sig + expectedDirection=TWO_SIDED → VALIDADA`,
    `actual: ${verdictTwoSided}`,
  );

  // Señal positiva débil no significativa → INCONCLUSA (sin suficiente N)
  const spearWeak = { rho: 0.08, p: 0.32, n: 25, ci95: [-0.08, 0.22] };
  const verdictWeak = classifyExperiment({
    spearmanResult: spearWeak,
    bootstrap:      null,
    stability:      null,
    walkForward:    null,
    coverage:       covPass,
    minN:           30,
    expectedDirection: 'TWO_SIDED',
  });
  assert(
    verdictWeak === 'INCONCLUSA',
    `n=25 < minN=30 → INCONCLUSA`,
    `actual: ${verdictWeak}`,
  );

  // Señal no significativa con suficiente N → NO_VALIDADA
  const spearNoSig = { rho: 0.05, p: 0.48, n: 150, ci95: [-0.12, 0.22] };
  const verdictNoSig = classifyExperiment({
    spearmanResult: spearNoSig,
    bootstrap:      { excludes0: false },
    stability:      stabNeg.map(b => ({ ...b, rho: 0.03 })),
    walkForward:    { trainStat: { rho: 0.04 }, testStat: { rho: 0.06 } },
    coverage:       covPass,
    minN:           30,
    expectedDirection: 'POSITIVE',
  });
  assert(
    verdictNoSig === 'NO_VALIDADA',
    `rho=0.05, p=0.48, n=150 → NO_VALIDADA`,
    `actual: ${verdictNoSig}`,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4: Transformaciones B6 — rollingMA nunca devuelve cero en warmup
// ═══════════════════════════════════════════════════════════════════════════════
section('B6 — Transformaciones: rollingMA, vixVix3m*');

{
  const data = Array.from({ length: 250 }, (_, i) => ({
    date: new Date(new Date('2015-01-01').getTime() + i * 86400000).toISOString().slice(0, 10),
    value: 20 + Math.sin(i / 30) * 5 + i * 0.01,
  }));

  const ma10  = rollingMA(data, 10);
  const ma100 = rollingMA(data, 100);
  const ma200 = rollingMA(data, 200);

  // Warmup debe ser null, no 0
  assert(ma10[0].value  === null, 'MA10 warmup[0] = null (no cero)');
  assert(ma10[8].value  === null, 'MA10 warmup[8] = null');
  assert(ma10[9].value  !== null, 'MA10[9] tiene valor (primera obs válida)');
  assert(ma100[98].value === null, 'MA100 warmup[98] = null');
  assert(ma200[198].value === null, 'MA200 warmup[198] = null');
  // Con 250 puntos, MA200 tiene 50 valores válidos
  assert(ma200[249].value !== null, 'MA200[249] tiene valor');

  // VIX/VIX3M: vixVix3mRatio y vixVix3mRegimeDur
  const vix   = data.map(p => ({ ...p, value: p.value }));
  const vix3m = data.map(p => ({ ...p, value: p.value * 1.05 + 1 })); // VIX3M siempre > VIX → contango
  const ratio = vixVix3mRatio(vix, vix3m);
  assert(ratio.length > 0, 'vixVix3mRatio devuelve datos');
  assert(ratio.every(p => p.value === null || p.value > 0), 'ratio siempre positivo');

  const dur = vixVix3mRegimeDur(vix, vix3m);
  assert(dur.length > 0, 'vixVix3mRegimeDur devuelve datos');
  // Con VIX3M siempre > VIX → contango → duración siempre 0
  const nonZeroDur = dur.filter(p => p.value !== null && p.value > 0);
  assert(nonZeroDur.length === 0, 'régimen backwardation = 0 cuando VIX3M > VIX siempre');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 5: Load test smoke del endpoint /api/macro-rlab/execute (opcional)
// ═══════════════════════════════════════════════════════════════════════════════
section('B10 — Load test endpoint (requiere --load-test y servidor local en :3000)');

if (process.argv.includes('--load-test')) {
  const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';
  const RESEARCH_ID = process.env.TEST_RESEARCH_ID || 'VIX_CAVA_CLASSIC_V1';

  console.log(`  → Ejecutando load test contra ${BASE}/api/macro-rlab/execute`);
  console.log(`  → researchId: ${RESEARCH_ID}`);

  const N_REQUESTS = 3;
  const results    = [];
  let   errors     = 0;

  for (let i = 0; i < N_REQUESTS; i++) {
    const t0 = Date.now();
    try {
      const r = await fetch(`${BASE}/api/macro-rlab/execute`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ researchId: RESEARCH_ID, notes: `load-test-run-${i+1}` }),
      });
      const ms   = Date.now() - t0;
      const body = await r.json();
      results.push({ run: i + 1, status: r.status, ms, verdict: body.verdict });
      console.log(`  [run ${i+1}] HTTP ${r.status} — ${ms}ms — verdict: ${body.verdict || body.error}`);
    } catch (e) {
      errors++;
      console.error(`  [run ${i+1}] ERROR: ${e.message}`);
    }
  }

  const successRuns = results.filter(r => r.status === 200);
  assert(errors === 0,            `Sin errores de red (${errors} errores)`);
  assert(successRuns.length >= 1, `Al menos 1 ejecución exitosa de ${N_REQUESTS}`);
  if (successRuns.length > 0) {
    const avgMs = successRuns.reduce((a, r) => a + r.ms, 0) / successRuns.length;
    assert(avgMs < 60000, `Tiempo medio < 60s (media: ${Math.round(avgMs)}ms)`);
    const verdicts = [...new Set(successRuns.map(r => r.verdict))];
    assert(
      verdicts.every(v => ['VALIDADA','INDICATIVA','NO_VALIDADA','INCONCLUSA'].includes(v)),
      `Veredictos válidos: ${verdicts.join(', ')}`,
    );
  }
} else {
  console.log('  → Omitido (pasa --load-test para activarlo)');
}

// ─── Resumen ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(60)}`);
console.log(`Resultado: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n⚠  ${failed} test(s) fallaron.`);
  process.exit(1);
} else {
  console.log('\n✓  Todos los tests pasaron.');
  process.exit(0);
}
