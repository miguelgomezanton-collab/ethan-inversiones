// api/lib/macro-rlab-stats.js
// Motor estadístico compartido — Macro R-LAB
// Consumido por: api/macro-rlab/execute.js (y eventualmente macro-history.js)
// No modifica estado. Solo funciones puras.
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Utilidades de ranking ──────────────────────────────────────────────────
export function rankArray(arr) {
  const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].v === sorted[i].v) j++;
    const avg = (i + j - 1) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].i] = avg;
    i = j;
  }
  return ranks;
}

// ── 2. Pearson con p-value (aproximación normal para n > 30) ─────────────────
export function pearson(xs, ys, minN = 15) {
  const n = Math.min(xs.length, ys.length);
  if (n < minN) return null;
  const x = xs.slice(0, n), y = ys.slice(0, n);
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx, b = y[i] - my;
    num += a * b; dx2 += a * a; dy2 += b * b;
  }
  const denom = Math.sqrt(dx2 * dy2);
  if (!denom) return null;
  const r = num / denom;
  const t = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r + 1e-10);
  const z = Math.abs(t);
  const p = n > 30
    ? 2 * (1 - (0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)))))
    : null;
  // IC95 via transformación de Fisher
  const zr   = Math.atanh(r);
  const se   = 1 / Math.sqrt(n - 3);
  const ci95 = [+Math.tanh(zr - 1.96 * se).toFixed(3), +Math.tanh(zr + 1.96 * se).toFixed(3)];
  return { rho: +r.toFixed(3), n, p: p != null ? +p.toFixed(4) : null, ci95 };
}

// ── 3. Spearman (Pearson sobre rangos) ───────────────────────────────────────
export function spearman(xs, ys, minN = 15) {
  if (xs.length < minN || ys.length < minN) return null;
  return pearson(rankArray(xs), rankArray(ys), minN);
}

// ── 4. Bootstrap por bloques (Spearman) ──────────────────────────────────────
// pairs: [{x, y}]  NSIM: simulaciones  BL: tamaño de bloque
export function blockBootstrap(pairs, NSIM = 5000, BL = 12) {
  const T = pairs.length;
  if (T < 15) return null;

  function rhoF(samp) {
    const n  = samp.length;
    const rx = rankArray(samp.map(p => p.x));
    const ry = rankArray(samp.map(p => p.y));
    const mx = rx.reduce((a, b) => a + b, 0) / n;
    const my = ry.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const a = rx[i] - mx, b = ry[i] - my;
      num += a * b; dx2 += a * a; dy2 += b * b;
    }
    const d = Math.sqrt(dx2 * dy2);
    return d ? num / d : 0;
  }

  const rObs = rhoF(pairs);

  // PRNG determinista (semilla fija → resultados reproducibles)
  let seed = 20260823;
  function rnd() {
    seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (seed >>> 0) / 4294967296;
  }

  const bootDist = [];
  for (let s = 0; s < NSIM; s++) {
    const samp = [];
    while (samp.length < T) {
      const start = Math.floor(rnd() * (T - BL + 1));
      for (let k = 0; k < BL && samp.length < T; k++) samp.push(pairs[(start + k) % T]);
    }
    bootDist.push(rhoF(samp.slice(0, T)));
  }
  bootDist.sort((a, b) => a - b);

  const ci025 = bootDist[Math.floor(NSIM * 0.025)];
  const ci975 = bootDist[Math.floor(NSIM * 0.975)];
  const pBoot = (rObs < 0
    ? bootDist.filter(r => r >= 0).length
    : bootDist.filter(r => r <= 0).length) / NSIM;

  return {
    rhoObs:   +rObs.toFixed(3),
    ci95:     [+ci025.toFixed(3), +ci975.toFixed(3)],
    pBoot:    +pBoot.toFixed(4),
    excludes0: (rObs < 0 && ci975 < 0) || (rObs > 0 && ci025 > 0),
    T, NSIM, BL,
    method: `Block Bootstrap (bloques móviles ${BL}, ${NSIM} sims)`,
  };
}

// ── 5. Quintiles ──────────────────────────────────────────────────────────────
// xs: valores del indicador, fwdReturns: array de retornos forward (misma longitud)
// nQ: número de quintiles (5 por defecto)
export function quintiles(xs, fwdReturns, nQ = 5) {
  const pairs = xs.map((x, i) => ({ x, y: fwdReturns[i] }))
    .filter(p => p.x != null && p.y != null)
    .sort((a, b) => a.x - b.x);
  const T = pairs.length;
  if (T < nQ * 3) return null;

  return Array.from({ length: nQ }, (_, q) => {
    const lo = Math.floor(T * q / nQ);
    const hi = Math.floor(T * (q + 1) / nQ);
    const slice = pairs.slice(lo, hi);
    const ys = slice.map(p => p.y);
    const med = [...ys].sort((a, b) => a - b);
    const median = med.length ? +med[Math.floor(med.length / 2)].toFixed(2) : null;
    const mean   = ys.length ? +(ys.reduce((a, b) => a + b, 0) / ys.length).toFixed(2) : null;
    const pctPos = ys.length ? +(ys.filter(v => v > 0).length / ys.length * 100).toFixed(1) : null;
    return {
      quintile: q + 1,
      n: slice.length,
      xMin: +slice[0].x.toFixed(3),
      xMax: +slice[slice.length - 1].x.toFixed(3),
      medianReturn: median,
      meanReturn:   mean,
      pctPositive:  pctPos,
    };
  });
}

// ── 6. Monotonicity check ─────────────────────────────────────────────────────
// Devuelve { monotone: bool, direction: 'up'|'down'|'mixed', score: 0-1 }
export function monotonicityCheck(quintileResults, metric = 'medianReturn') {
  if (!quintileResults || quintileResults.length < 3) return null;
  const vals = quintileResults.map(q => q[metric]).filter(v => v != null);
  if (vals.length < 3) return null;
  let ups = 0, downs = 0;
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] > vals[i - 1]) ups++;
    else if (vals[i] < vals[i - 1]) downs++;
  }
  const total = vals.length - 1;
  const score = Math.max(ups, downs) / total;
  return {
    monotone: score >= 0.8,
    direction: ups > downs ? 'up' : downs > ups ? 'down' : 'mixed',
    score: +score.toFixed(2),
    ups, downs,
  };
}

// ── 7. Estabilidad temporal (Early / Mid / Recent) ────────────────────────────
// pairs: [{x, y, date}] ordenados ASC por fecha
// statFn: función que recibe pairs y devuelve {rho, p}
export function temporalStability(pairs, statFn = null) {
  const T = pairs.length;
  if (T < 30) return null;

  const blocks = [
    { label: 'Early',  slice: pairs.slice(0, Math.floor(T / 3)) },
    { label: 'Mid',    slice: pairs.slice(Math.floor(T / 3), Math.floor(2 * T / 3)) },
    { label: 'Recent', slice: pairs.slice(Math.floor(2 * T / 3)) },
  ];

  const fn = statFn || ((p) => spearman(p.map(e => e.x), p.map(e => e.y)));

  return blocks.map(b => {
    const res = b.slice.length >= 15 ? fn(b.slice) : null;
    return {
      label:    b.label,
      n:        b.slice.length,
      dateFrom: b.slice[0]?.date?.slice(0, 7) ?? null,
      dateTo:   b.slice[b.slice.length - 1]?.date?.slice(0, 7) ?? null,
      rho:      res?.rho ?? null,
      p:        res?.p   ?? null,
    };
  });
}

// ── 8. Walk-forward (out-of-sample) ──────────────────────────────────────────
// pairs ordenados ASC. trainPct: proporción de entrenamiento (0.6 por defecto)
export function walkForward(pairs, trainPct = 0.6, statFn = null) {
  const T = pairs.length;
  const cutoff = Math.floor(T * trainPct);
  if (cutoff < 15 || T - cutoff < 10) return null;

  const fn = statFn || ((p) => spearman(p.map(e => e.x), p.map(e => e.y)));

  const train = pairs.slice(0, cutoff);
  const test  = pairs.slice(cutoff);
  return {
    trainN:     train.length,
    testN:      test.length,
    trainFrom:  train[0]?.date?.slice(0, 7) ?? null,
    trainTo:    train[train.length - 1]?.date?.slice(0, 7) ?? null,
    testFrom:   test[0]?.date?.slice(0, 7) ?? null,
    testTo:     test[test.length - 1]?.date?.slice(0, 7) ?? null,
    trainStat:  fn(train),
    testStat:   fn(test),
    method:     `Walk-forward ${Math.round(trainPct * 100)}/${Math.round((1 - trainPct) * 100)}`,
  };
}

// ── 9. Controles de integridad ────────────────────────────────────────────────

// Look-ahead: dado un cutoffDate, verifica que no hay observaciones futuras
// en la serie de señal que se usan para predecir retornos del mismo periodo
export function lookAheadCheck(signalDates, returnDates, horizonMonths) {
  let violations = 0;
  for (let i = 0; i < signalDates.length; i++) {
    const sigMs = new Date(signalDates[i]).getTime();
    const retMs = new Date(returnDates[i] ?? '9999-01').getTime();
    const expectedGap = horizonMonths * 30 * 24 * 3600 * 1000;
    if (retMs - sigMs < expectedGap * 0.9) violations++;
  }
  return {
    pass:       violations === 0,
    violations,
    method:     `Look-ahead control (horizonte ${horizonMonths}M)`,
  };
}

// Cobertura: porcentaje de observaciones válidas (no null)
export function coverageCheck(values, minCoveragePct = 85) {
  const total   = values.length;
  const valid   = values.filter(v => v != null && isFinite(v)).length;
  const pct     = total ? +(valid / total * 100).toFixed(1) : 0;
  return {
    total, valid,
    coveragePct: pct,
    pass:        pct >= minCoveragePct,
    threshold:   minCoveragePct,
  };
}

// ── 10. Resumen de forward returns ────────────────────────────────────────────
// fwdMap: Map<YYYY-MM, retorno>  months: array de YYYY-MM a analizar
export function forwardReturnSummary(months, fwdMap, maxDDFn = null) {
  const med = arr => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    return +s[Math.floor(s.length / 2)].toFixed(2);
  };
  const results = {};
  for (const [hLabel, hMonths] of Object.entries({ '1M': 1, '3M': 3, '6M': 6, '12M': 12 })) {
    const rets = months.map(m => fwdMap?.get?.(m)?.[hMonths] ?? null).filter(v => v != null);
    results[hLabel] = {
      n:          rets.length,
      median:     med(rets),
      mean:       rets.length ? +(rets.reduce((a, b) => a + b, 0) / rets.length).toFixed(2) : null,
      pctPositive: rets.length ? +(rets.filter(v => v > 0).length / rets.length * 100).toFixed(1) : null,
    };
  }
  return results;
}

// ── 11. Alinear dos series por fecha ─────────────────────────────────────────
// a, b: [{date: 'YYYY-MM', value}]  — tolerancia en días para series de frecuencias distintas
export function alignByDate(a, b, tolDays = 0) {
  const bMap = new Map(b.map(p => [p.date.slice(0, 10), p.value]));
  const pairs = [];
  for (const pa of a) {
    const key = pa.date.slice(0, 10);
    if (pa.value == null) continue;
    let bVal = bMap.get(key) ?? null;
    if (bVal == null && tolDays > 0) {
      // Buscar fecha más cercana dentro de tolerancia
      const ms = new Date(key).getTime();
      const tol = tolDays * 86400000;
      for (const [dk, dv] of bMap) {
        if (Math.abs(new Date(dk).getTime() - ms) <= tol) { bVal = dv; break; }
      }
    }
    if (bVal != null) pairs.push({ date: key, x: pa.value, y: bVal });
  }
  return pairs;
}

// ── 12. Clasificación automática del experimento ──────────────────────────────
// Devuelve: 'VALIDADA' | 'INDICATIVA' | 'NO_VALIDADA' | 'INCONCLUSA'
export function classifyExperiment({ spearmanResult, bootstrap, stability, walkForward, coverage, minN = 30 }) {
  if (!coverage?.pass) return 'INCONCLUSA';
  if (!spearmanResult || spearmanResult.n < minN) return 'INCONCLUSA';

  const significant = spearmanResult.p != null && spearmanResult.p < 0.05;
  const bootRobust  = bootstrap?.excludes0 === true;
  const wfConsist   = walkForward ? Math.sign(walkForward.trainStat?.rho ?? 0) === Math.sign(walkForward.testStat?.rho ?? 0) : null;

  // Estabilidad temporal: al menos 2 de 3 bloques con mismo signo
  let stableBlocks = 0;
  if (stability) {
    const signs = stability.map(b => b.rho != null ? Math.sign(b.rho) : 0);
    const majority = Math.sign(spearmanResult.rho ?? 0);
    stableBlocks = signs.filter(s => s === majority).length;
  }
  const temporallyStable = stability ? stableBlocks >= 2 : null;

  if (significant && bootRobust && temporallyStable && (wfConsist !== false))
    return 'VALIDADA';
  if (significant && (bootRobust || temporallyStable))
    return 'INDICATIVA';
  if (!significant && spearmanResult.n >= minN)
    return 'NO_VALIDADA';
  return 'INCONCLUSA';
}
