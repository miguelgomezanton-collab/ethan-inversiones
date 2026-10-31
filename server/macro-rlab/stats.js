// api/lib/macro-rlab-stats.js
// Motor estadístico compartido — Macro R-LAB
// Consumido por: api/macro-rlab/execute.js (y eventualmente macro-history.js)
// No modifica estado. Solo funciones puras.
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Utilidades de ranking ──────────────────────────────────────────────────
export function rankArray(arr) {
  const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks  = new Array(arr.length);
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
// B4+B5: BL ahora se calcula adaptativamente a partir de horizonDays
// horizonDays: duración del horizonte de retorno forward en días naturales
//   → BL = round(horizonDays * 1.5) — captura la autocorrelación inducida
//     por el solapamiento de ventanas de retorno
// nObs y nEffective se exponen en el resultado:
//   nEffective = floor(nObs / horizonDays) — número de observaciones independientes efectivas
export function blockBootstrap(pairs, NSIM = 5000, horizonDays = 21) {
  const T = pairs.length;
  if (T < 15) return null;

  // B5: BL adaptativo al horizonte (no fijo en 12)
  const BL = Math.max(5, Math.round(horizonDays * 1.5));

  // B4: número efectivo de observaciones independientes
  const nObs       = T;
  const nEffective = Math.max(1, Math.floor(nObs / horizonDays));

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
    const maxStart = Math.max(1, T - BL + 1);
    while (samp.length < T) {
      const start = Math.floor(rnd() * maxStart);
      for (let k = 0; k < BL && samp.length < T; k++) {
        const idx = (start + k) % T;
        if (pairs[idx] !== undefined) samp.push(pairs[idx]);
      }
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
    rhoObs:      +rObs.toFixed(3),
    ci95:        [+ci025.toFixed(3), +ci975.toFixed(3)],
    pBoot:       +pBoot.toFixed(4),
    excludes0:   (rObs < 0 && ci975 < 0) || (rObs > 0 && ci025 > 0),
    T, NSIM, BL,
    // B4: exponer nObs y nEffective
    nObs,
    nEffective,
    horizonDays,
    method: `Block Bootstrap (bloques móviles BL=${BL} [horizonte ${horizonDays}d×1.5], ${NSIM} sims, nEff=${nEffective})`,
  };
}

// ── 5. Quintiles ──────────────────────────────────────────────────────────────
export function quintiles(xs, fwdReturns, nQ = 5) {
  const pairs = xs.map((x, i) => ({ x, y: fwdReturns[i] }))
    .filter(p => p.x != null && p.y != null)
    .sort((a, b) => a.x - b.x);
  const T = pairs.length;
  if (T < nQ * 3) return null;

  return Array.from({ length: nQ }, (_, q) => {
    const lo    = Math.floor(T * q / nQ);
    const hi    = Math.floor(T * (q + 1) / nQ);
    const slice = pairs.slice(lo, hi);
    const ys    = slice.map(p => p.y);
    const med   = [...ys].sort((a, b) => a - b);
    const median  = med.length ? +med[Math.floor(med.length / 2)].toFixed(2) : null;
    const mean    = ys.length ? +(ys.reduce((a, b) => a + b, 0) / ys.length).toFixed(2) : null;
    const pctPos  = ys.length ? +(ys.filter(v => v > 0).length / ys.length * 100).toFixed(1) : null;
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
    monotone:  score >= 0.8,
    direction: ups > downs ? 'up' : downs > ups ? 'down' : 'mixed',
    score:     +score.toFixed(2),
    ups, downs,
  };
}

// ── 7. Estabilidad temporal (Early / Mid / Recent) ────────────────────────────
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
// B10: pares DEBEN estar ordenados cronológicamente (ASC) — se verifica aquí
export function walkForward(pairs, trainPct = 0.6, statFn = null) {
  const T = pairs.length;

  // B10: verificar orden cronológico estricto
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].date && pairs[i - 1].date && pairs[i].date <= pairs[i - 1].date) {
      console.warn('[walkForward] Pares no están en orden cronológico estricto. ' +
        `Índice ${i}: ${pairs[i-1].date} ≥ ${pairs[i].date}`);
    }
  }

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
    chronologicalOrder: true, // garantizado por llamador (execute.js ordena por fecha)
  };
}

// ── 9. Controles de integridad ────────────────────────────────────────────────

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
export function forwardReturnSummary(months, fwdMap) {
  const med = arr => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    return +s[Math.floor(s.length / 2)].toFixed(2);
  };
  const results = {};
  for (const [hLabel, hMonths] of Object.entries({ '1M': 1, '3M': 3, '6M': 6, '12M': 12 })) {
    const rets = months.map(m => fwdMap?.get?.(m)?.[hMonths] ?? null).filter(v => v != null);
    results[hLabel] = {
      n:           rets.length,
      median:      med(rets),
      mean:        rets.length ? +(rets.reduce((a, b) => a + b, 0) / rets.length).toFixed(2) : null,
      pctPositive: rets.length ? +(rets.filter(v => v > 0).length / rets.length * 100).toFixed(1) : null,
    };
  }
  return results;
}

// ── 11. Alinear dos series por fecha ─────────────────────────────────────────
export function alignByDate(a, b, tolDays = 0) {
  const bMap  = new Map(b.map(p => [p.date.slice(0, 10), p.value]));
  const pairs = [];
  for (const pa of a) {
    const key = pa.date.slice(0, 10);
    if (pa.value == null) continue;
    let bVal = bMap.get(key) ?? null;
    if (bVal == null && tolDays > 0) {
      const ms  = new Date(key).getTime();
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
// B3: añadido expectedDirection: 'POSITIVE' | 'NEGATIVE' | 'TWO_SIDED'
//   - Si expectedDirection='NEGATIVE' y rho < 0 significativo → tratar como confirmación positiva
//   - Una correlación negativa significativa NO debe clasificarse como NO_VALIDADA
//     si la hipótesis esperaba dirección negativa
export function classifyExperiment({
  spearmanResult,
  bootstrap,
  stability,
  walkForward: wf,
  coverage,
  minN = 30,
  expectedDirection = 'TWO_SIDED', // B3: nuevo parámetro
}) {
  if (!coverage?.pass) return 'INCONCLUSA';
  if (!spearmanResult || spearmanResult.n < minN) return 'INCONCLUSA';

  const rho  = spearmanResult.rho ?? 0;
  const pVal = spearmanResult.p;

  // B3: normalizar el rho según la dirección esperada
  // Si la hipótesis es NEGATIVE, "confirmar" significa rho < 0
  // Tratamos el rho ajustado para que siempre el "buen" resultado sea rho > 0
  let adjustedRho = rho;
  if (expectedDirection === 'NEGATIVE') {
    adjustedRho = -rho; // si esperamos negativo y rho es negativo, adjustedRho > 0
  }
  // TWO_SIDED y POSITIVE: sin cambio

  const significant = pVal != null && pVal < 0.05;
  // B3: para que sea significativo en la dirección esperada, el adjustedRho debe ser positivo
  const significantInExpectedDir = significant && (
    expectedDirection === 'TWO_SIDED' ? true : adjustedRho > 0
  );

  const bootRobust = bootstrap?.excludes0 === true;
  // B3: para bootstrap, también verificar que la dirección sea la esperada
  const bootRobustDir = bootRobust && (
    expectedDirection === 'NEGATIVE' ? rho < 0 :
    expectedDirection === 'POSITIVE' ? rho > 0 : true
  );

  const wfConsist = wf
    ? Math.sign(wf.trainStat?.rho ?? 0) === Math.sign(wf.testStat?.rho ?? 0)
    : null;

  // Estabilidad temporal: al menos 2 de 3 bloques con mismo signo
  let stableBlocks = 0;
  if (stability) {
    const majority  = Math.sign(rho);
    const signs     = stability.map(b => b.rho != null ? Math.sign(b.rho) : 0);
    stableBlocks    = signs.filter(s => s === majority).length;
  }
  const temporallyStable = stability ? stableBlocks >= 2 : null;

  if (significantInExpectedDir && bootRobustDir && temporallyStable && (wfConsist !== false))
    return 'VALIDADA';
  if (significantInExpectedDir && (bootRobustDir || temporallyStable))
    return 'INDICATIVA';
  // B3: NO_VALIDADA solo si hay suficiente N pero la señal no es significativa EN LA DIRECCIÓN ESPERADA
  if (!significantInExpectedDir && spearmanResult.n >= minN)
    return 'NO_VALIDADA';
  return 'INCONCLUSA';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── B6: TRANSFORMACIONES ADICIONALES ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// ── B6.1. Medias móviles (MM10 / MM100 / MM200) ──────────────────────────────
// data: [{date, value}] ordenado ASC
// Devuelve [{date, value}] con null en warmup (no cero)
export function rollingMA(data, n) {
  return data.map((p, i) => {
    if (i < n - 1) return { date: p.date, value: null };
    const window = data.slice(i - n + 1, i + 1).map(d => d.value).filter(v => v != null);
    if (window.length < n) return { date: p.date, value: null };
    return { date: p.date, value: window.reduce((a, b) => a + b, 0) / n };
  });
}

// ── B6.2. Distancia porcentual precio ↔ MA ───────────────────────────────────
// Devuelve (precio / MA - 1) × 100 en porcentaje; null si MA es null
export function maDistance(price, ma) {
  const n = Math.min(price.length, ma.length);
  return Array.from({ length: n }, (_, i) => {
    const p = price[i].value;
    const m = ma[i].value;
    if (p == null || m == null || m === 0) return { date: price[i].date, value: null };
    return { date: price[i].date, value: +((p / m - 1) * 100).toFixed(4) };
  });
}

// ── B6.3. Señal de cruce MA corta vs MA larga ─────────────────────────────────
// Devuelve +1 cuando ma1 > ma2 (cruce alcista), -1 cuando ma1 < ma2
export function maCrossover(ma1, ma2) {
  const n = Math.min(ma1.length, ma2.length);
  return Array.from({ length: n }, (_, i) => {
    const v1 = ma1[i].value;
    const v2 = ma2[i].value;
    if (v1 == null || v2 == null) return { date: ma1[i].date, value: null };
    return { date: ma1[i].date, value: v1 > v2 ? 1 : v1 < v2 ? -1 : 0 };
  });
}

// ── B6.4. Pendiente de la MA (slope) ─────────────────────────────────────────
// Variación porcentual de MA en los últimos `lookback` periodos
// Equivalente a (MA[t] - MA[t-lookback]) / MA[t-lookback] × 100
export function maSlope(ma, lookback = 5) {
  return ma.map((p, i) => {
    if (i < lookback) return { date: p.date, value: null };
    const prev = ma[i - lookback].value;
    const curr = p.value;
    if (prev == null || curr == null || prev === 0) return { date: p.date, value: null };
    return { date: p.date, value: +((curr / prev - 1) * 100).toFixed(4) };
  });
}

// ── B6.5. Variación a N sesiones ─────────────────────────────────────────────
// Retorno logarítmico desde n sesiones atrás
// n ∈ [5, 20, 60] sesiones bursátiles
export function nSessionReturn(data, n) {
  return data.map((p, i) => {
    if (i < n) return { date: p.date, value: null };
    const prev = data[i - n].value;
    const curr = p.value;
    if (prev == null || curr == null || prev <= 0) return { date: p.date, value: null };
    return { date: p.date, value: +Math.log(curr / prev).toFixed(6) };
  });
}

// ── B6.6. Percentil rolling ─────────────────────────────────────────────────
// Percentil del valor actual dentro de una ventana rolling de `window` periodos
// Devuelve valor entre 0 y 100
export function rollingPercentile(data, window) {
  return data.map((p, i) => {
    if (i < window - 1) return { date: p.date, value: null };
    const slice = data.slice(i - window + 1, i + 1).map(d => d.value).filter(v => v != null);
    if (slice.length < Math.floor(window * 0.8)) return { date: p.date, value: null };
    const sorted = [...slice].sort((a, b) => a - b);
    const rank   = sorted.filter(v => v <= p.value).length;
    return { date: p.date, value: +((rank / sorted.length) * 100).toFixed(1) };
  });
}

// ── B6.7. Z-score rolling ────────────────────────────────────────────────────
// Z-score del valor actual respecto a una ventana de N años de sesiones bursátiles
// windowYears ∈ [2, 3, 5, 10] — se asumen ~252 sesiones/año
export function rollingZScore(data, windowYears) {
  const n = Math.round(windowYears * 252);
  return data.map((p, i) => {
    if (i < n - 1) return { date: p.date, value: null };
    const slice = data.slice(i - n + 1, i + 1).map(d => d.value).filter(v => v != null);
    if (slice.length < Math.floor(n * 0.8)) return { date: p.date, value: null };
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const std  = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length);
    if (std === 0) return { date: p.date, value: null };
    return { date: p.date, value: +((p.value - mean) / std).toFixed(4) };
  });
}

// ── B6.8. Regla VIX > MM10 × 1.12 ───────────────────────────────────────────
// Devuelve 1 cuando VIX > MM10 * multiplier (estrés elevado), 0 en caso contrario
export function vixAboveMaRule(vix, ma10, multiplier = 1.12) {
  const n = Math.min(vix.length, ma10.length);
  return Array.from({ length: n }, (_, i) => {
    const v = vix[i].value;
    const m = ma10[i].value;
    if (v == null || m == null || m === 0) return { date: vix[i].date, value: null };
    return { date: vix[i].date, value: v > m * multiplier ? 1 : 0 };
  });
}

// ── B2: Señales derivadas VIX / VIX3M ────────────────────────────────────────
// Estas funciones se usan en execute.js para construir señales on-the-fly

// Ratio VIX / VIX3M
export function vixVix3mRatio(vix, vix3m) {
  const bMap = new Map(vix3m.map(p => [p.date, p.value]));
  return vix
    .filter(p => bMap.has(p.date))
    .map(p => {
      const v3 = bMap.get(p.date);
      if (p.value == null || v3 == null || v3 === 0) return { date: p.date, value: null };
      return { date: p.date, value: +(p.value / v3).toFixed(4) };
    });
}

// Diferencial VIX - VIX3M
export function vixVix3mDiff(vix, vix3m) {
  const bMap = new Map(vix3m.map(p => [p.date, p.value]));
  return vix
    .filter(p => bMap.has(p.date))
    .map(p => {
      const v3 = bMap.get(p.date);
      if (p.value == null || v3 == null) return { date: p.date, value: null };
      return { date: p.date, value: +(p.value - v3).toFixed(4) };
    });
}

// Cross-1: 1 cuando VIX > VIX3M (backwardation), 0 en caso contrario
export function vixVix3mCross1(vix, vix3m) {
  const bMap = new Map(vix3m.map(p => [p.date, p.value]));
  return vix
    .filter(p => bMap.has(p.date))
    .map(p => {
      const v3 = bMap.get(p.date);
      if (p.value == null || v3 == null) return { date: p.date, value: null };
      return { date: p.date, value: p.value > v3 ? 1 : 0 };
    });
}

// Contango/Backwardation: (VIX3M - VIX) / VIX3M — positivo=contango, negativo=backwardation
export function vixVix3mContango(vix, vix3m) {
  const bMap = new Map(vix3m.map(p => [p.date, p.value]));
  return vix
    .filter(p => bMap.has(p.date))
    .map(p => {
      const v3 = bMap.get(p.date);
      if (p.value == null || v3 == null || v3 === 0) return { date: p.date, value: null };
      return { date: p.date, value: +((v3 - p.value) / v3).toFixed(4) };
    });
}

// Intensidad: |VIX - VIX3M| / VIX3M — magnitud de la desviación, siempre positivo
export function vixVix3mIntensity(vix, vix3m) {
  const bMap = new Map(vix3m.map(p => [p.date, p.value]));
  return vix
    .filter(p => bMap.has(p.date))
    .map(p => {
      const v3 = bMap.get(p.date);
      if (p.value == null || v3 == null || v3 === 0) return { date: p.date, value: null };
      return { date: p.date, value: +(Math.abs(p.value - v3) / v3).toFixed(4) };
    });
}

// Duración del régimen de backwardation: número de sesiones consecutivas con VIX > VIX3M
// Devuelve 0 cuando estamos en contango
export function vixVix3mRegimeDur(vix, vix3m) {
  const cross = vixVix3mCross1(vix, vix3m); // 1=backwardation, 0=contango
  let dur = 0;
  return cross.map(p => {
    if (p.value == null) return { date: p.date, value: null };
    if (p.value === 1) {
      dur++;
    } else {
      dur = 0;
    }
    return { date: p.date, value: dur };
  });
}
