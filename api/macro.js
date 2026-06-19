// ═══════════════════════════════════════════════
// /api/macro.js — Vercel Serverless Function
// ═══════════════════════════════════════════════
// Agrega datos de FRED, CBOE y Conference Board, calcula el score
// macro completo (11 indicadores, −17 a +17) con los umbrales de
// ETHAN Mercados, y devuelve un JSON limpio al frontend.
//
// El frontend NUNCA llama a FRED directamente (sin CORS + expondría
// la API key). Esta función hace de proxy + motor de cálculo.
//
// Variable de entorno requerida en Vercel: FRED_API_KEY

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const CBOE_PUTCALL_URL = 'https://cdn.cboe.com/resources/options/volume_and_call_put_ratios/totalpc.csv';
const LEI_URL = 'https://www.conference-board.org/topics/us-leading-indicators/';

// ───────────────────────────────────────────────
// Helpers de fetch
// ───────────────────────────────────────────────

async function fetchFredSeries(seriesId, apiKey, limit = 14) {
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId}: HTTP ${res.status}`);
  const data = await res.json();
  const obs = (data.observations || [])
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }));
  return obs; // más reciente primero
}

async function fetchLatestPutCall() {
  const res = await fetch(CBOE_PUTCALL_URL);
  if (!res.ok) throw new Error(`CBOE: HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split('\n').filter(l => /^\d{1,2}\/\d{1,2}\/\d{4}/.test(l));
  if (lines.length === 0) throw new Error('CBOE: no se encontraron filas de datos');
  const lastLine = lines[lines.length - 1];
  const parts = lastLine.split(',');
  const date = parts[0];
  const ratio = parseFloat(parts[4]);
  if (isNaN(ratio)) throw new Error('CBOE: no se pudo parsear el ratio');
  return { date, ratio };
}

async function fetchLEI() {
  const res = await fetch(LEI_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EthanMercados/1.0)' }
  });
  if (!res.ok) throw new Error(`Conference Board: HTTP ${res.status}`);
  const html = await res.text();
  // Patrón observado en el sidebar de widgets: "+ 0.1% U.S. LEI" o "- 0.2% U.S. LEI"
  const match = html.match(/([+\-−])\s*([\d.]+)%\s*U\.S\.\s*LEI/i);
  if (!match) throw new Error('Conference Board: patrón LEI no encontrado (posible cambio de página)');
  const sign = match[1] === '-' || match[1] === '−' ? -1 : 1;
  const value = sign * parseFloat(match[2]);
  return { value, raw: match[0] };
}

// ───────────────────────────────────────────────
// Scoring — umbrales confirmados por Miguel
// ───────────────────────────────────────────────

function scoreCurva(spreadPct) {
  if (spreadPct > 0.60) return 1;
  if (spreadPct < 0) return -1;
  return 0;
}

function scoreLEI(value) {
  if (value > 0) return 1;
  if (value < -5) return -1;
  return 0;
}

function scoreM2Global(yoyPct) {
  if (yoyPct > 3) return 1;
  if (yoyPct < 0) return -1;
  return 0;
}

function scoreVelocidadM2(yoyPct) {
  return yoyPct >= 0 ? 1 : -1;
}

function scoreReservas(yoyPct) {
  if (yoyPct > 10) return 1;
  if (yoyPct < 0) return -1;
  return 0;
}

function scoreTipoReal(realRatePct) {
  if (realRatePct < -2) return 1;
  if (realRatePct > 0) return -1;
  return 0;
}

function scoreBBBSpread(spreadPct) {
  if (spreadPct < 2) return 1;
  if (spreadPct > 3) return -1;
  return 0;
}

function scorePutCall(ratio) {
  if (ratio > 1.0) return 1;
  if (ratio < 0.7) return -1;
  return 0;
}

// Crédito vs Nominal e Impulso Crediticio quedan manuales (no hay serie FRED
// directa de "crédito bancario YoY vs GDP nominal YoY" calculada automáticamente
// sin combinar varias series trimestrales); se reciben como input opcional.
function scoreCreditoVsNominal(spreadPct) {
  if (spreadPct === null || spreadPct === undefined) return null;
  if (spreadPct > 3) return 1;
  if (spreadPct < -3) return -1;
  return 0;
}

function scoreImpulsoCrediticio(value) {
  if (value === null || value === undefined) return null;
  return value >= 0 ? 1 : -1;
}

// ───────────────────────────────────────────────
// Handler principal
// ───────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800'); // 15 min cache

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FRED_API_KEY no configurada en Vercel (Settings → Environment Variables)' });
  }

  // Inputs manuales opcionales (curva EUR, crédito vs nominal, impulso crediticio)
  // pasados como query params por el frontend si el usuario los ha editado
  const curvaEURManual = req.query.curvaEUR ? parseFloat(req.query.curvaEUR) : 0.70;
  const creditoVsNominalManual = req.query.creditoVsNominal ? parseFloat(req.query.creditoVsNominal) : null;
  const impulsoCrediticioManual = req.query.impulsoCrediticio ? parseFloat(req.query.impulsoCrediticio) : null;

  const errors = [];
  const indicators = {};

  // ── FRED: 6 series en paralelo ──
  const [dgs10, dgs2, dff, bbb, cpi, m2v] = await Promise.allSettled([
    fetchFredSeries('DGS10', apiKey, 5),
    fetchFredSeries('DGS2', apiKey, 5),
    fetchFredSeries('DFF', apiKey, 5),
    fetchFredSeries('BAMLC0A4CBBB', apiKey, 5),
    fetchFredSeries('CPIAUCSL', apiKey, 14),
    fetchFredSeries('M2V', apiKey, 5)
  ]);

  // Curva USD (10Y - 2Y)
  if (dgs10.status === 'fulfilled' && dgs2.status === 'fulfilled' && dgs10.value[0] && dgs2.value[0]) {
    const y10 = dgs10.value[0].value;
    const y2 = dgs2.value[0].value;
    const spread = +(y10 - y2).toFixed(2);
    indicators.curvaUSD = {
      label: 'Curva USD (10Y−2Y)',
      value: spread,
      unit: '%',
      date: dgs10.value[0].date,
      score: scoreCurva(spread),
      weight: 1,
      detail: `10Y: ${y10}% − 2Y: ${y2}%`
    };
  } else {
    errors.push('curvaUSD: ' + (dgs10.reason || dgs2.reason));
  }

  // Curva EUR (manual)
  indicators.curvaEUR = {
    label: 'Curva EUR (10Y−2Y)',
    value: curvaEURManual,
    unit: '%',
    date: null,
    score: scoreCurva(curvaEURManual),
    weight: 1,
    manual: true,
    detail: 'Valor manual — sin API gratuita disponible (ECB)'
  };

  // Tipo Real = FFR - CPI YoY
  if (dff.status === 'fulfilled' && cpi.status === 'fulfilled' && dff.value[0] && cpi.value.length >= 13) {
    const ffr = dff.value[0].value;
    const cpiLatest = cpi.value[0].value;
    const cpiYearAgo = cpi.value[12].value;
    const cpiYoY = +(((cpiLatest - cpiYearAgo) / cpiYearAgo) * 100).toFixed(2);
    const tipoReal = +(ffr - cpiYoY).toFixed(2);
    indicators.tipoReal = {
      label: 'Tipo de Interés Real',
      value: tipoReal,
      unit: '%',
      date: dff.value[0].date,
      score: scoreTipoReal(tipoReal),
      weight: 1,
      detail: `FFR: ${ffr}% − CPI YoY: ${cpiYoY}%`
    };
  } else {
    errors.push('tipoReal: ' + (dff.reason || cpi.reason || 'datos insuficientes'));
  }

  // BBB Corporate Spreads
  if (bbb.status === 'fulfilled' && bbb.value[0]) {
    const spread = bbb.value[0].value;
    indicators.bbbSpread = {
      label: 'Corporate Spreads (BBB)',
      value: spread,
      unit: '%',
      date: bbb.value[0].date,
      score: scoreBBBSpread(spread),
      weight: 1
    };
  } else {
    errors.push('bbbSpread: ' + bbb.reason);
  }

  // Velocidad M2 (YoY)
  if (m2v.status === 'fulfilled' && m2v.value.length >= 2) {
    const latest = m2v.value[0].value;
    const prev = m2v.value[1].value; // M2V es trimestral, comparamos vs trimestre anterior como proxy de tendencia
    const yoy = +(((latest - prev) / prev) * 100).toFixed(2);
    indicators.velocidadM2 = {
      label: 'Velocidad M2',
      value: yoy,
      unit: '%',
      date: m2v.value[0].date,
      score: scoreVelocidadM2(yoy),
      weight: 2,
      detail: `M2V actual: ${latest}`
    };
  } else {
    errors.push('velocidadM2: ' + (m2v.reason || 'datos insuficientes'));
  }

  // M2 Global — usamos M2SL (US) como proxy hasta integrar ECB/PBOC/BoJ
  try {
    const m2sl = await fetchFredSeries('M2SL', apiKey, 14);
    if (m2sl.length >= 13) {
      const latest = m2sl[0].value;
      const yearAgo = m2sl[12].value;
      const yoy = +(((latest - yearAgo) / yearAgo) * 100).toFixed(2);
      indicators.m2Global = {
        label: 'M2 Global (proxy US)',
        value: yoy,
        unit: '% YoY',
        date: m2sl[0].date,
        score: scoreM2Global(yoy),
        weight: 3,
        detail: 'Proxy basado en M2 US (FRED M2SL) — pendiente integrar ECB/PBOC/BoJ'
      };
    }
  } catch (e) {
    errors.push('m2Global: ' + e.message);
  }

  // Reservas Bancarias (WRESBAL, YoY)
  try {
    const wresbal = await fetchFredSeries('WRESBAL', apiKey, 60);
    if (wresbal.length >= 52) {
      const latest = wresbal[0].value;
      const yearAgo = wresbal[51].value; // ~52 semanas atrás
      const yoy = +(((latest - yearAgo) / yearAgo) * 100).toFixed(2);
      indicators.reservasBancarias = {
        label: 'Reservas Bancarias',
        value: yoy,
        unit: '% YoY',
        date: wresbal[0].date,
        score: scoreReservas(yoy),
        weight: 1,
        detail: `Nivel actual: $${(latest / 1000).toFixed(2)}T`
      };
    }
  } catch (e) {
    errors.push('reservasBancarias: ' + e.message);
  }

  // ── CBOE: Put/Call Ratio ──
  try {
    const pc = await fetchLatestPutCall();
    indicators.putCall = {
      label: 'Put/Call Ratio',
      value: pc.ratio,
      unit: '',
      date: pc.date,
      score: scorePutCall(pc.ratio),
      weight: 1
    };
  } catch (e) {
    errors.push('putCall: ' + e.message);
  }

  // ── Conference Board: LEI ──
  try {
    const lei = await fetchLEI();
    indicators.lei = {
      label: 'LEI (Conference Board)',
      value: lei.value,
      unit: '%',
      date: null,
      score: scoreLEI(lei.value),
      weight: 1,
      detail: lei.raw
    };
  } catch (e) {
    errors.push('lei: ' + e.message);
  }

  // ── Manuales: Crédito vs Nominal, Impulso Crediticio ──
  indicators.creditoVsNominal = {
    label: 'Crédito vs Nominal GDP',
    value: creditoVsNominalManual,
    unit: '%',
    date: null,
    score: scoreCreditoVsNominal(creditoVsNominalManual),
    weight: 3,
    manual: true,
    detail: 'Valor manual — combina Fed H.8 + BEA GDP'
  };

  indicators.impulsoCrediticio = {
    label: 'Impulso Crediticio',
    value: impulsoCrediticioManual,
    unit: '',
    date: null,
    score: scoreImpulsoCrediticio(impulsoCrediticioManual),
    weight: 2,
    manual: true,
    detail: 'Valor manual — BIS Credit Impulse'
  };

  // ── Cálculo de score total ──
  let scoreAdelantados = 0;
  let scoreMonetarios = 0;
  let maxAdelantados = 0;
  let maxMonetarios = 0;

  const adelantadosKeys = ['curvaUSD', 'curvaEUR', 'lei'];
  const monetariosKeys = ['m2Global', 'creditoVsNominal', 'impulsoCrediticio', 'velocidadM2', 'reservasBancarias', 'tipoReal', 'bbbSpread', 'putCall'];

  adelantadosKeys.forEach(k => {
    const ind = indicators[k];
    if (ind && ind.score !== null && ind.score !== undefined) {
      scoreAdelantados += ind.score * ind.weight;
      maxAdelantados += ind.weight;
    }
  });

  monetariosKeys.forEach(k => {
    const ind = indicators[k];
    if (ind && ind.score !== null && ind.score !== undefined) {
      scoreMonetarios += ind.score * ind.weight;
      maxMonetarios += ind.weight;
    }
  });

  const scoreTotal = scoreAdelantados + scoreMonetarios;
  const maxTotal = maxAdelantados + maxMonetarios; // típicamente 17 si todo resuelve

  // ── Zona / fase del ciclo ──
  function getZone(score) {
    if (score >= 10) return { label: 'Boom / Euforia', color: 'verde-oscuro', emoji: '🟢' };
    if (score >= 4) return { label: 'Expansión sólida', color: 'verde', emoji: '🟢' };
    if (score >= 0) return { label: 'Soft Landing', color: 'amarillo', emoji: '🟡' };
    if (score >= -4) return { label: 'Desaceleración', color: 'naranja', emoji: '🟠' };
    if (score >= -10) return { label: 'Recesión leve', color: 'rojo', emoji: '🔴' };
    return { label: 'Recesión severa', color: 'rojo-oscuro', emoji: '🔴' };
  }

  const zone = getZone(scoreTotal);

  // ── Probabilidades derivadas del score (heurística simple, lineal) ──
  // Normaliza el score (-17..+17) a probabilidades de 4 escenarios
  function getProbabilities(score) {
    const norm = Math.max(-17, Math.min(17, score)); // clamp
    const pct = (norm + 17) / 34; // 0..1, 0=recesión extrema, 1=boom extremo

    let recesion, stagflation, softLanding, expansion;
    if (pct < 0.3) {
      recesion = 60 - pct * 100; stagflation = 30; softLanding = 8; expansion = 2;
    } else if (pct < 0.5) {
      recesion = 45 - (pct - 0.3) * 150; stagflation = 30 - (pct - 0.3) * 50; softLanding = 15 + (pct - 0.3) * 50; expansion = 10;
    } else if (pct < 0.7) {
      recesion = 15 - (pct - 0.5) * 50; stagflation = 15 - (pct - 0.5) * 50; softLanding = 50; expansion = 20 + (pct - 0.5) * 50;
    } else {
      recesion = 5; stagflation = 5; softLanding = 30 - (pct - 0.7) * 50; expansion = 60 + (pct - 0.7) * 50;
    }
    const total = recesion + stagflation + softLanding + expansion;
    return {
      recesion12m: +Math.max(0, (recesion / total) * 100).toFixed(0),
      stagflation: +Math.max(0, (stagflation / total) * 100).toFixed(0),
      softLanding: +Math.max(0, (softLanding / total) * 100).toFixed(0),
      expansion: +Math.max(0, (expansion / total) * 100).toFixed(0)
    };
  }

  const probabilities = getProbabilities(scoreTotal);

  // ── Riesgo de contagio inflacionario (derivado de CPI YoY) ──
  let riesgoContagio = null;
  if (cpi.status === 'fulfilled' && cpi.value.length >= 13) {
    const cpiLatest = cpi.value[0].value;
    const cpiYearAgo = cpi.value[12].value;
    const cpiYoY = +(((cpiLatest - cpiYearAgo) / cpiYearAgo) * 100).toFixed(2);
    let nivel, label;
    if (cpiYoY < 2.5) { nivel = 'bajo'; label = 'Riesgo bajo'; }
    else if (cpiYoY < 4) { nivel = 'moderado'; label = 'Riesgo moderado'; }
    else { nivel = 'alto'; label = 'Riesgo alto — vigilar espiral salarios-precios'; }
    riesgoContagio = { cpiYoY, nivel, label };
  }

  return res.status(200).json({
    updatedAt: new Date().toISOString(),
    scoreTotal,
    maxTotal,
    scoreAdelantados,
    maxAdelantados,
    scoreMonetarios,
    maxMonetarios,
    zone,
    probabilities,
    riesgoContagio,
    indicators,
    errors: errors.length > 0 ? errors : undefined
  });
}
