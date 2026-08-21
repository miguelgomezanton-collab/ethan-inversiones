// /api/macro.js — ETHAN Mercados · Sistema Macro v3
// 11 indicadores · rango −17 a +17
// Fuente: FRED API + CNN Fear & Greed + Yahoo Finance (VIX SMA200)
// M2 Global: FRED (USA) + ECB (EUR) + BOJ (JPN) + manual (CHN)

const FRED    = 'https://api.stlouisfed.org/fred/series/observations';
const FG_URL  = 'https://feargreedchart.com/api/?action=all';
const FG_ALT  = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata';
const ECB_URL = 'https://data-api.ecb.europa.eu/service/data/YC/B.U2.EUR.4F.G_N_A.SV_C_YM.SRS_10Y_2Y?lastNObservations=1&format=csvdata';

// Serie M2 Eurozona BCE (millones EUR, fin de mes, sin ajuste estacional)
const ECB_M2_URL = 'https://data-api.ecb.europa.eu/service/data/BSI/M.U2.N.V.M20.X.1.U2.2300.Z01.E?lastNObservations=14&format=csvdata';

// BOJ Time-Series Data Search API (oficial desde feb 2026)
// Series: MD02'MAM1YAM2M2MO — M2 YoY% directo (no calculado), actualizado a 2026/07
// Documentación: https://www.stat-search.boj.or.jp/ssi/mtshtml/md02_m_1_en.html


// ── FRED helper ───────────────────────────────
async function fred(id, key, limit = 14) {
  const url = `${FRED}?series_id=${id}&api_key=${key}&file_type=json&sort_order=desc&limit=${limit}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`FRED ${id}: ${r.status}`);
  const d = await r.json();
  return (d.observations || [])
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }));
}

// ── Yahoo Finance helper ──────────────────────
async function yahoo(sym) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=5d`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`Yahoo ${sym}: ${r.status}`);
  const m = (await r.json()).chart?.result?.[0]?.meta;
  if (!m) throw new Error(`Yahoo ${sym}: sin datos`);
  const prev = m.previousClose || m.chartPreviousClose;
  return { value: +m.regularMarketPrice.toFixed(2), change: prev ? +((m.regularMarketPrice - prev) / prev * 100).toFixed(2) : null };
}

// ── ECB M2 Eurozona ───────────────────────────
async function fetchECBm2() {
  const r = await fetch(ECB_M2_URL, { headers: { 'Accept': 'text/csv' } });
  if (!r.ok) throw new Error(`ECB M2: ${r.status}`);
  const text = await r.text();
  const lines = text.trim().split('\n');
  if (lines.length < 2) throw new Error('ECB M2: sin datos');
  const h = lines[0].split(',');
  const di = h.indexOf('TIME_PERIOD'), vi = h.indexOf('OBS_VALUE');
  if (di < 0 || vi < 0) throw new Error('ECB M2: formato inesperado');
  // Devolver últimas 14 observaciones ordenadas desc
  return lines.slice(1)
    .map(l => { const c = l.split(','); return { date: c[di], value: parseFloat(c[vi]) }; })
    .filter(p => !isNaN(p.value))
    .reverse(); // más reciente primero
}

// ── JPN M2 — BOJ API via Cloudflare Worker proxy ─────────────────
// Worker: soft-field-156f.miguel-gomez-anton.workers.dev
// Series: MAM1NAM2M2MO (nivel) + MAM1YAM2M2MO (YoY oficial)
// Estructura respuesta BOJ: RESULTSET[].VALUES.{SURVEY_DATES, VALUES}
const BOJ_PROXY = 'https://soft-field-156f.miguel-gomez-anton.workers.dev';
const BOJ_TS_API = 'https://www.stat-search.boj.or.jp/api/v1/getDataCode';

async function fetchBOJm2() {
  const now = new Date();
  const sd  = new Date(); sd.setMonth(sd.getMonth() - 15);
  const fmt = d => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`;

  const params = new URLSearchParams({
    format: 'json', lang: 'en', db: 'MD02',
    startDate: fmt(sd), endDate: fmt(now),
    code: 'MAM1NAM2M2MO,MAM1YAM2M2MO',
  });
  const bojUrl = `${BOJ_TS_API}?${params.toString()}`;
  const proxyUrl = `${BOJ_PROXY}/?url=${encodeURIComponent(bojUrl)}`;

  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 15000);
  const r = await fetch(proxyUrl, {
    signal: ctrl.signal,
    headers: { 'User-Agent': 'EthanMacroPlatform/1.0', 'Accept': 'application/json' },
  });
  if (!r.ok) throw new Error(`BOJ proxy HTTP ${r.status}`);
  const d = await r.json();
  if (d?.STATUS && String(d.STATUS) !== '200') {
    throw new Error(`BOJ STATUS ${d.STATUS}: ${d.MESSAGE||''}`);
  }

  // Parser estructura BOJ: RESULTSET[].VALUES.{SURVEY_DATES, VALUES}
  function parseSeries(code) {
    const s = (d.RESULTSET||[]).find(s => s.SERIES_CODE === code);
    if (!s?.VALUES?.SURVEY_DATES?.length) return [];
    return s.VALUES.SURVEY_DATES
      .map((date, i) => ({
        date: String(date).replace(/^(\d{4})(\d{2})$/, '$1-$2-01'),  // YYYYMM → YYYY-MM-01
        value: parseFloat(s.VALUES.VALUES[i]),
      }))
      .filter(o => !isNaN(o.value) && o.value > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  const levelObs = parseSeries('MAM1NAM2M2MO');
  const yoyObs   = parseSeries('MAM1YAM2M2MO');

  if (!levelObs.length) throw new Error(`BOJ: sin obs para MAM1NAM2M2MO`);

  const officialYoY = yoyObs.length
    ? { value: yoyObs[0].value, date: yoyObs[0].date }
    : null;

  return { obs: levelObs, officialYoY, source: 'BOJ_PROXY', url: proxyUrl };
}

// ── Calcular M2 Global USA + EUR + JPN + CHN ────────────────────
// Fix 1: freshness por componente
// Fix 2: YoY por fecha real (no obs[12] a ciegas)
const M2_STALE_DAYS = 90; // mensual con lag ~6 semanas → tolerancia 90d

function findYoYBase(obs, currentDate) {
  // Buscar observación cuya fecha sea ~12 meses antes, ±10 días
  const target = new Date(currentDate);
  target.setFullYear(target.getFullYear() - 1);
  const targetMs = target.getTime();
  const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
  const match = obs.find(o => Math.abs(new Date(o.date).getTime() - targetMs) <= TEN_DAYS);
  return match || null;
}

function m2Freshness(dateStr) {
  if (!dateStr) return { ageDays: null, freshness: 'missing' };
  // Fechas mensuales vienen como 'YYYY-MM' → usar fin de mes
  const d = new Date(dateStr.length === 7 ? dateStr + '-01' : dateStr);
  const ageDays = Math.round((Date.now() - d.getTime()) / (1000*60*60*24));
  const freshness = ageDays <= M2_STALE_DAYS ? 'ok' : 'stale';
  return { ageDays, freshness };
}

async function calcGlobalM2(fredKey, manualChinaM2pct) {
  const [rUsM2, rEurM2, rJpM2, rEURUSD, rUSDJPY] = await Promise.allSettled([
    fred('M2SL', fredKey, 14),
    fetchECBm2(),
    fetchBOJm2(),
    yahoo('EURUSD%3DX'),
    yahoo('USDJPY%3DX'),
  ]);

  const errors = [];
  const components = {};

  // ── USA M2 ──────────────────────────────────────────────────
  if (rUsM2.status === 'fulfilled' && rUsM2.value.length >= 2) {
    const obs = rUsM2.value; // desc
    const current = obs[0];
    const base = findYoYBase(obs, current.date);
    const { ageDays, freshness } = m2Freshness(current.date);
    if (base) {
      const yoy = +((current.value - base.value) / base.value * 100).toFixed(2);
      components.us = { yoy, currentDate: current.date, currentValue: current.value,
        baseDate: base.date, baseValue: base.value, ageDays, freshness, weight: 35, valid: freshness === 'ok' };
    } else {
      components.us = { yoy: null, currentDate: current.date, error: 'Sin base YoY 12M', ageDays, freshness, weight: 35, valid: false };
    }
  } else {
    errors.push('USA M2: ' + (rUsM2.reason?.message || 'sin datos'));
    components.us = { yoy: null, error: 'Sin datos', ageDays: null, freshness: 'missing', weight: 35, valid: false };
  }

  // ── EUR M2 ──────────────────────────────────────────────────
  if (rEurM2.status === 'fulfilled' && rEurM2.value.length >= 2) {
    const obs = rEurM2.value;
    const current = obs[0];
    const base = findYoYBase(obs, current.date);
    const { ageDays, freshness } = m2Freshness(current.date);
    if (base) {
      const yoy = +((current.value - base.value) / base.value * 100).toFixed(2);
      components.eur = { yoy, currentDate: current.date, currentValue: current.value,
        baseDate: base.date, baseValue: base.value, ageDays, freshness, weight: 25, valid: freshness === 'ok' };
    } else {
      components.eur = { yoy: null, currentDate: current.date, error: 'Sin base YoY 12M', ageDays, freshness, weight: 25, valid: false };
    }
  } else {
    errors.push('EUR M2: ' + (rEurM2.reason?.message || 'sin datos'));
    components.eur = { yoy: null, error: 'Sin datos', ageDays: null, freshness: 'missing', weight: 25, valid: false };
  }

  // ── JPN M2 ──────────────────────────────────────────────────
  const jpResult = rJpM2.status === 'fulfilled' ? rJpM2.value : null;
  const jpObs = jpResult?.obs || (Array.isArray(jpResult) ? jpResult : null);
  const jpSource2 = jpResult?.source || 'unknown';
  const jpFallbackReason = jpResult?.fallbackReason;

  if (jpObs && jpObs.length >= 2) {
    const current = jpObs[0];
    const base = findYoYBase(jpObs, current.date);
    const { ageDays, freshness } = m2Freshness(current.date);
    const officialYoY = jpResult?.officialYoY || null;
    if (base) {
      const yoyCalc = +((current.value - base.value) / base.value * 100).toFixed(2);
      // Validación cruzada: YoY calculado vs YoY oficial BOJ
      let validation = null;
      if (officialYoY != null) {
        const diff = Math.abs(yoyCalc - officialYoY.value);
        validation = { officialYoY: officialYoY.value, officialDate: officialYoY.date, diff: +diff.toFixed(2), status: diff > 0.1 ? 'VALIDATION_WARN' : 'OK' };
      }
      components.jp = {
        yoy: yoyCalc, currentDate: current.date, currentValue: current.value,
        baseDate: base.date, baseValue: base.value,
        ageDays, freshness, weight: 10, valid: freshness === 'ok',
        source: jpSource2, validation,
        ...(jpFallbackReason ? { fallbackReason: jpFallbackReason } : {}),
      };
    } else {
      // Sin base YoY calculado — usar YoY oficial directamente si disponible
      if (officialYoY != null) {
        components.jp = {
          yoy: officialYoY.value, currentDate: officialYoY.date,
          baseDate: null, isOfficialYoY: true,
          ageDays: m2Freshness(officialYoY.date).ageDays,
          freshness: m2Freshness(officialYoY.date).freshness,
          weight: 10, valid: m2Freshness(officialYoY.date).freshness === 'ok',
          source: jpSource2,
        };
      } else {
        components.jp = { yoy: null, currentDate: current.date, error: 'Sin base YoY 12M ni YoY oficial',
          ageDays, freshness, weight: 10, valid: false, source: jpSource2 };
      }
    }
  } else if (jpResult?.officialYoY) {
    // Solo YoY oficial disponible (sin nivel)
    const oy = jpResult.officialYoY;
    const { ageDays, freshness } = m2Freshness(oy.date);
    components.jp = {
      yoy: oy.value, currentDate: oy.date, isOfficialYoY: true,
      ageDays, freshness, weight: 10, valid: freshness === 'ok', source: jpSource2,
    };
    const errMsg = rJpM2.reason?.message || jpResult?.fallbackReason || `sin obs (${jpObs?.length ?? 'N/A'})`;
    errors.push('JPN M2: ' + errMsg);
    components.jp = { yoy: null, error: errMsg, ageDays: null, freshness: 'missing', weight: 10, valid: false };
  }

  // ── CHN M2 (manual) ─────────────────────────────────────────
  if (manualChinaM2pct != null) {
    components.chn = { yoy: manualChinaM2pct, currentDate: null, freshness: 'manual', weight: 30, valid: true };
  } else {
    components.chn = { yoy: null, freshness: 'missing', weight: 30, valid: false };
  }

  // ── Agregación con cobertura dinámica ────────────────────────
  const available = Object.values(components).filter(c => c.valid && c.yoy != null);
  const coverageWeight = available.reduce((s, c) => s + c.weight, 0);
  const MIN_COVERAGE = 60; // mínimo 60/100 para emitir score
  let globalYoY = null;
  if (available.length > 0) {
    globalYoY = +(available.reduce((s, c) => s + c.yoy * c.weight, 0) / coverageWeight).toFixed(2);
  }

  // FX spot (solo informativo — no afecta YoY)
  const eurusd = rEURUSD.status === 'fulfilled' ? rEURUSD.value.value : null;
  const usdjpy = rUSDJPY.status === 'fulfilled' ? rUSDJPY.value.value : null;

  return {
    globalYoY,
    coverageWeight,
    coveragePct: +(coverageWeight / 100).toFixed(4),
    coverageOk: coverageWeight >= MIN_COVERAGE,
    components,
    fx: { eurusd, usdjpy },
    errors,
  };
}

// ── VIX con SMA200 ────────────────────────────
async function fetchVIX() {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=2y`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`Yahoo VIX: ${r.status}`);
  const res = (await r.json()).chart?.result?.[0];
  if (!res) throw new Error('Yahoo VIX: sin datos');
  const closes = res.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
  const current = closes[closes.length - 1];
  const sma200 = closes.length >= 200
    ? closes.slice(-200).reduce((a, b) => a + b, 0) / 200
    : closes.reduce((a, b) => a + b, 0) / closes.length;
  const aboveSMA200 = current > sma200;
  return {
    value: +current.toFixed(2),
    sma200: +sma200.toFixed(2),
    aboveSMA200,
    signal: aboveSMA200 ? 'Alerta: VIX sobre SMA200 — volatilidad elevada (bajista)' : 'VIX bajo SMA200 — volatilidad contenida',
  };
}

// ── CNN Fear & Greed — CNN directo + macromicro via worker + VIX sintético ──
async function fetchFearGreed() {
  // 1. Intentar CNN directo
  for (const url of [FG_URL, FG_ALT]) {
    try {
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.cnn.com/',
          'Origin': 'https://www.cnn.com',
        },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) continue;
      const d = await r.json();
      if (d?.now?.score != null) {
        return { value: Math.round(d.now.score), label: d.now.valueText,
          previousClose: d.previousClose?.score != null ? Math.round(d.previousClose.score) : null,
          previousWeek:  d.previousWeek?.score  != null ? Math.round(d.previousWeek.score)  : null,
          previousMonth: d.previousMonth?.score != null ? Math.round(d.previousMonth.score) : null,
          source: 'CNN' };
      }
      const fg = d?.fear_and_greed;
      if (fg?.score != null) {
        return { value: Math.round(fg.score), label: fg.rating,
          previousClose: fg.previous_close  != null ? Math.round(fg.previous_close)  : null,
          previousWeek:  fg.previous_1_week  != null ? Math.round(fg.previous_1_week)  : null,
          previousMonth: fg.previous_1_month != null ? Math.round(fg.previous_1_month) : null,
          source: 'CNN' };
      }
    } catch {}
  }

  // 2. Macromicro via worker (HTML scraping)
  try {
    const mmUrl = 'https://en.macromicro.me/collections/34/us-stock-relative/50108/cnn-fear-and-greed';
    const workerUrl = `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(mmUrl)}`;
    const r = await fetch(workerUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const html = await r.text();
      // Buscar el valor del Fear & Greed en el HTML
      // macromicro suele tener el dato en un JSON inline o en atributos data-
      const patterns = [
        /"value"\s*:\s*(\d+\.?\d*)/,
        /fear.and.greed[^:]*:\s*(\d+)/i,
        /currentValue[^:]*:\s*(\d+\.?\d*)/,
        /"score"\s*:\s*(\d+\.?\d*)/,
        /data-value="(\d+\.?\d*)"/,
        /class="[^"]*value[^"]*"[^>]*>(\d+)/,
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) {
          const value = Math.round(parseFloat(m[1]));
          if (value >= 0 && value <= 100) {
            const label = value >= 75 ? 'Extreme Greed' : value >= 55 ? 'Greed' :
                          value >= 45 ? 'Neutral' : value >= 25 ? 'Fear' : 'Extreme Fear';
            return { value, label, source: 'MacroMicro/CNN' };
          }
        }
      }
    }
  } catch {}

  // 3. Fallback sintético desde VIX
  try {
    const vixUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=5d';
    const proxies = [
      u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
      u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    ];
    for (const fn of proxies) {
      try {
        const r = await fetch(fn(vixUrl), { signal: AbortSignal.timeout(6000) });
        if (!r.ok) continue;
        const j = JSON.parse(await r.text());
        const closes = j?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        if (!closes?.length) continue;
        const vix = closes[closes.length - 1];
        const prevVix = closes[closes.length - 2] || vix;
        if (!vix) continue;
        const calcScore = v => {
          let s;
          if (v < 12)      s = Math.round(85 + (12-v)*1.25);
          else if (v < 16) s = Math.round(60 + (16-v)*6.25);
          else if (v < 20) s = Math.round(40 + (20-v)*5);
          else if (v < 28) s = Math.round(20 + (28-v)*2.5);
          else             s = Math.max(0, Math.round(20-(v-28)*1.5));
          return Math.max(0, Math.min(100, s));
        };
        const score = calcScore(vix);
        const label = score >= 75 ? 'Extreme Greed' : score >= 55 ? 'Greed' :
                      score >= 45 ? 'Neutral' : score >= 25 ? 'Fear' : 'Extreme Fear';
        return { value: score, label, previousClose: calcScore(prevVix),
          vix: vix.toFixed(1), source: 'VIX sintético' };
      } catch {}
    }
  } catch {}

  throw new Error('Fear & Greed: sin datos disponibles');
}

// ── ECB Curva EUR ─────────────────────────────
async function fetchCurvaEUR() {
  const r = await fetch(ECB_URL, { headers: { 'Accept': 'text/csv' } });
  if (!r.ok) throw new Error(`ECB: ${r.status}`);
  const lines = (await r.text()).trim().split('\n');
  const h = lines[0].split(','), last = lines[lines.length - 1].split(',');
  const di = h.indexOf('TIME_PERIOD'), vi = h.indexOf('OBS_VALUE');
  const v = parseFloat(last[vi]);
  if (isNaN(v)) throw new Error('ECB: valor no parseable');
  return { value: +v.toFixed(2), date: last[di] };
}

// ══════════════════════════════════════════════
// SCORING — Sistema oficial ETHAN Macro v3
// ══════════════════════════════════════════════

// Indicador 1: Curva USD (×1)
function scCurvaUSD(v) {
  if (v >= 0.90) return +1;
  if (v >= 0.48) return  0;
  return -1;
}
// Indicador 2: Curva EUR (×1)
function scCurvaEUR(v) {
  if (v >= 0.60) return +1;
  if (v >= 0.40) return  0;
  return -1;
}
// Indicador 3: OECD CLI USA — nivel + dirección (×1)
// Serie: USALOLITOAASTSAM (amplitude adjusted, ~100 = tendencia)
// Scoring v1: nivel > 100 y subiendo → +1 | nivel < 100 y bajando → -1 | resto → 0
function scLEI(level, delta) {
  if (level > 100 && delta > 0) return +1;
  if (level < 100 && delta < 0) return -1;
  return 0;
}
// Indicador 4: M2 Global (×3)
function scM2(v) {
  if (v >= 5.0) return +3;
  if (v >= 3.0) return +1;
  return -3;
}
// Indicador 5: Crédito vs Nominal GDP (×3)
function scCredito(v) {
  if (v >= 3.0) return +3;
  if (v >= 1.5) return  0;
  return -3;
}
// Indicador 6: Impulso Crediticio (×2)
function scImpulso(v) {
  if (v >= 1.0) return +2;
  if (v >= 0.5) return +1;
  return -2;
}
// Indicador 7: Velocidad M2 (×2)
function scVelM2(v) {
  if (v >=  0.0) return +2;
  if (v >= -1.5) return -1;
  return -2;
}
// Indicador 8: Reservas Bancarias (×1) — por valor absoluto en $T
function scReservas(v) {
  if (v >= 3.5) return +1;
  if (v >= 2.5) return -1;
  return -2;
}
// Indicador 9: Tipo Real FFR−CPI (×1)
function scTipoReal(v) {
  if (v >= 1.0) return +1;
  if (v >= 0.5) return  0;
  return -1;
}
// Indicador 10: BBB Spread (×1)
function scBBB(v) {
  if (v <= 1.00) return +1;
  if (v <= 1.50) return  0;
  return -1;
}
// Indicador 11: Fear & Greed / Put-Call proxy (×1)
function scFG(v) {
  if (v < 40)  return +1;   // miedo = oportunidad contrarian
  if (v <= 54) return  0;
  return -1;                 // euforia = riesgo
}

// Zona de ciclo
function zone(s) {
  if (s >= 10)  return 'Boom / Euforia';
  if (s >=  4)  return 'Expansión';
  if (s >=  0)  return 'Desaceleración';
  if (s >= -4)  return 'Recesión Leve';
  return 'Recesión Severa';
}

// Probabilidades por score
function probabilities(s) {
  if (s >= 4)  return { recesion: 15, stagflation: 15, softLanding: 45, expansion: 25 };
  if (s >= 0)  return { recesion: 40, stagflation: 30, softLanding: 25, expansion:  5 };
  return             { recesion: 65, stagflation: 25, softLanding:  8, expansion:  2 };
}

// Riesgo contagio inflacionario
function riesgoContagio(cpiYoY, cpiCoreYoY) {
  const pct = cpiYoY <= 2.5 ? 10 : cpiYoY <= 3.0 ? 20 : cpiYoY <= 3.5 ? 30 : cpiYoY <= 4.0 ? 50 : 75;
  const gap  = +(cpiYoY - cpiCoreYoY).toFixed(2);
  const tipo = gap < 0.5 ? 'estructural' : 'coyuntural';
  return {
    headline: cpiYoY, core: cpiCoreYoY, gap, tipo, pct,
    nivel: pct <= 20 ? 'bajo' : pct <= 40 ? 'moderado' : 'alto',
    label: pct <= 20 ? 'Riesgo bajo — inflación bajo control'
      : pct <= 40  ? `Presión ${tipo} moderada — monitorear`
      : `Riesgo alto de contagio estructural (${pct}%) — vigilar espiral salarios-precios`
  };
}

// ── Handler principal ─────────────────────────
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900,stale-while-revalidate=1800');
  const key = process.env.FRED_API_KEY;
  if (!key) return res.status(500).json({ error: 'FRED_API_KEY no configurada' });

  // Override manual China M2 YoY% (único que no tiene API gratuita)
  const man = {
    lei:        req.query.lei     != null ? parseFloat(req.query.lei)     : null,
    chinM2:     req.query.chinaM2 != null ? parseFloat(req.query.chinaM2) : null,
    credito:    req.query.credito != null ? parseFloat(req.query.credito)  : null,
    impulso:    req.query.impulso != null ? parseFloat(req.query.impulso)  : null,
  };

  const errs = [];

  // ── Fetch en paralelo — dos grupos ───────────
  // Grupo 1: indicadores principales (rápidos)
  // Grupo 2: M2 Global (más lento — llama a ECB + BOJ + Yahoo FX)
  const [
    rDgs10, rDgs2, rDff, rBbb, rCpi, rCpiCore,
    rFg, rVix, rCurvaEUR,
    rHy, rBreakeven1y, rBreakeven5y, rBreakeven5yAlt,
    rWti, rBrent, rM2v, rWresbal,
    rLeiFreD, rTotll, rGdp, rMich,
  ] = await Promise.allSettled([
    fred('DGS10',        key, 5),
    fred('DGS2',         key, 5),
    fred('DFF',          key, 5),
    fred('BAMLC0A4CBBB', key, 5),
    fred('CPIAUCSL',     key, 14),
    fred('CPILFESL',     key, 14),
    fetchFearGreed(),
    fetchVIX(),
    fetchCurvaEUR(),
    fred('BAMLH0A0HYM2', key, 5),
    fred('EXPINF1YR',    key, 10),   // Fed Cleveland 1Y inflation expectations
    fred('T5YIE',        key, 10),   // Breakeven 5Y
    fred('T5YIFR',       key, 10),   // Breakeven 5Y forward rate (alternativa)
    yahoo('CL%3DF'),
    yahoo('BZ%3DF'),
    fred('M2V',          key, 6),
    fred('WRESBAL',      key, 60),
    fred('USALOLITOAASTSAM', key, 3),   // OECD CLI USA (amplitude adjusted, mensual)
    fred('TOTLL',        key, 14),
    fred('GDP',          key, 6),
    fred('MICH',         key, 10),   // Univ. Michigan 1Y inflation expectations (fallback)
  ]);

  // M2 Global en paralelo pero con timeout propio para no bloquear el resto
  const rGlobalM2 = await Promise.race([
    calcGlobalM2(key, man.chinM2).then(v => ({ status: 'fulfilled', value: v })).catch(e => ({ status: 'rejected', reason: e })),
    new Promise(resolve => setTimeout(() => resolve({ status: 'rejected', reason: new Error('M2 Global timeout') }), 8000)),
  ]);

  // ── Procesar series automáticas ───────────────
  let t10y = null, t2y = null, ffr = null, cpiYoY = null, cpiCoreYoY = null;

  if (rDgs10.status === 'fulfilled' && rDgs10.value[0])
    t10y = { value: rDgs10.value[0].value, date: rDgs10.value[0].date };
  else errs.push('DGS10: ' + rDgs10.reason?.message);

  if (rDgs2.status === 'fulfilled' && rDgs2.value[0])
    t2y = { value: rDgs2.value[0].value, date: rDgs2.value[0].date };
  else errs.push('DGS2: ' + rDgs2.reason?.message);

  if (rDff.status === 'fulfilled' && rDff.value[0])
    ffr = { value: rDff.value[0].value, date: rDff.value[0].date };
  else errs.push('DFF: ' + rDff.reason?.message);

  if (rCpi.status === 'fulfilled' && rCpi.value.length >= 13) {
    const l = rCpi.value[0].value, ya = rCpi.value[12].value;
    cpiYoY = +(((l - ya) / ya) * 100).toFixed(2);
  } else errs.push('CPI: ' + rCpi.reason?.message);

  if (rCpiCore.status === 'fulfilled' && rCpiCore.value.length >= 13) {
    const l = rCpiCore.value[0].value, ya = rCpiCore.value[12].value;
    cpiCoreYoY = +(((l - ya) / ya) * 100).toFixed(2);
  } else errs.push('CPICore: ' + rCpiCore.reason?.message);

  // ── Construir indicadores con score ──────────
  const ind = {};

  // 1. Curva USD — DGS10 y DGS2 con fecha común más reciente
  if (t10y && t2y) {
    // Buscar fecha común entre las últimas 5 observaciones de cada serie
    const dgs10obs = rDgs10.value;
    const dgs2obs  = rDgs2.value;
    const dgs10dates = new Set(dgs10obs.map(o => o.date));
    const commonObs  = dgs2obs.find(o => dgs10dates.has(o.date));
    if (commonObs) {
      const dgs10match = dgs10obs.find(o => o.date === commonObs.date);
      const spread = +(dgs10match.value - commonObs.value).toFixed(2);
      const ageDays = Math.round((Date.now() - new Date(commonObs.date).getTime()) / (1000*60*60*24));
      const freshness = ageDays <= 7 ? 'ok' : ageDays <= 10 ? 'warn' : 'stale';
      ind.curvaUSD = {
        label: 'Curva USD (10Y−2Y)', value: spread,
        date: commonObs.date,
        dgs10: { value: dgs10match.value, date: dgs10match.date },
        dgs2:  { value: commonObs.value,  date: commonObs.date  },
        ageDays, freshness,
        score: freshness === 'stale' ? null : scCurvaUSD(spread),
        weight: 1,
      };
    } else {
      ind.curvaUSD = { label: 'Curva USD (10Y−2Y)', value: null, score: null, weight: 1, error: 'Sin fecha común DGS10/DGS2' };
      errs.push('CurvaUSD: sin fecha común entre DGS10 y DGS2');
    }
  }

  // 2. Curva EUR — ECB YC spread SRS_10Y_2Y (precalculado, Svensson, soberana agregada eurozona)
  if (rCurvaEUR.status === 'fulfilled') {
    const v = rCurvaEUR.value.value;
    const dateStr = rCurvaEUR.value.date;
    const ageDays = Math.round((Date.now() - new Date(dateStr).getTime()) / (1000*60*60*24));
    const freshness = ageDays <= 7 ? 'ok' : ageDays <= 10 ? 'warn' : 'stale';
    ind.curvaEUR = {
      label: 'Curva EUR (10Y−2Y)', value: v, date: dateStr,
      ageDays, freshness,
      score: freshness === 'stale' ? null : scCurvaEUR(v),
      weight: 1,
      manual: false,
      source: 'ECB YC · B.U2.EUR.4F.G_N_A.SV_C_YM.SRS_10Y_2Y · Svensson · soberana eurozona',
    };
  } else errs.push('CurvaEUR: ' + rCurvaEUR.reason?.message);

  // 3. OECD CLI USA — FRED USALOLITOAASTSAM (amplitude adjusted, mensual)
  // Scoring: nivel > 100 y MoM > 0 → +1 | nivel < 100 y MoM < 0 → -1 | resto → 0
  // Freshness: bloquear score si el dato tiene más de 2 meses de antigüedad
  if (man.lei != null) {
    // Override manual — se interpreta como MoM% del CLI real
    // Para override: nivel asumido 100 (neutro), solo dirección MoM
    const manScore = man.lei > 0 ? +1 : man.lei < 0 ? -1 : 0;
    ind.lei = { label: 'OECD CLI USA', value: man.lei, date: null,
      score: manScore, weight: 1, manual: true };
  } else if (rLeiFreD.status === 'fulfilled' && rLeiFreD.value.length >= 2) {
    const obs     = rLeiFreD.value; // ordenado desc
    const level   = obs[0].value;
    const prev    = obs[1].value;
    const delta   = +(level - prev).toFixed(5);
    const latestDate = obs[0].date;
    // Freshness en días (OECD publica dato de mes t ~día 15 de t+2)
    const ageDays = Math.round((Date.now() - new Date(latestDate).getTime()) / (1000 * 60 * 60 * 24));
    const freshness = ageDays <= 100 ? 'ok' : ageDays <= 130 ? 'warn' : 'stale';
    const isStale = freshness === 'stale';
    ind.lei = {
      label: 'OECD CLI USA',
      value: level, delta,
      prevValue: prev, date: latestDate, prevDate: obs[1].date,
      score: isStale ? null : scLEI(level, delta),
      weight: 1, auto: true,
      freshness, ageDays,
      stale: isStale,
    };
  } else {
    errs.push('OECD CLI: ' + rLeiFreD.reason?.message);
    ind.lei = { label: 'OECD CLI USA', value: null, date: null,
      score: man.lei != null ? (man.lei > 0 ? +1 : man.lei < 0 ? -1 : 0) : null,
      weight: 1, manual: man.lei != null };
  }

  // 4. M2 Global — USA (FRED) + EUR (ECB) + JPN (BOJ) + CHN (manual)
  if (rGlobalM2.status === 'fulfilled') {
    const g = rGlobalM2.value;
    if (g.errors?.length) errs.push(...g.errors.map(e => 'M2Global: ' + e));
    const regions = ['us','eur','jp','chn'];
    const label = 'M2 Global (USA+EUR+JPN' + (g.components.chn?.valid ? '+CHN' : ', CHN pendiente') + ')';
    ind.m2 = {
      label,
      value: g.globalYoY,
      components: g.components,
      coverageWeight: g.coverageWeight,
      coveragePct: g.coveragePct,
      coverageOk: g.coverageOk,
      fx: g.fx,
      date: null,
      score: (g.globalYoY != null && g.coverageOk) ? scM2(g.globalYoY) : null,
      weight: 3, auto: true,
    };
  } else {
    errs.push('M2 Global: ' + rGlobalM2.reason?.message);
    ind.m2 = { label: 'M2 Global', value: null, date: null, score: null, weight: 3 };
  }

  // 5. Crédito vs Nominal GDP — FRED TOTLL (Total Loans, mensual) vs GDP (trimestral, SAAR)
  // Calculamos YoY de cada uno y el diferencial.
  // Si el manual override existe, lo usamos preferentemente.
  if (man.credito != null) {
    ind.credito = { label: 'Crédito vs Nominal GDP', value: man.credito, date: null,
      score: scCredito(man.credito), weight: 3, manual: true };
  } else if (
    rTotll.status === 'fulfilled' && rTotll.value.length >= 13 &&
    rGdp.status   === 'fulfilled' && rGdp.value.length   >= 5
  ) {
    // Crédito YoY (mensual)
    const tl = rTotll.value; // desc
    const creditYoY = +(((tl[0].value - tl[12].value) / tl[12].value) * 100).toFixed(2);
    // GDP nominal YoY (trimestral — 4 obs = 1 año)
    const gdp = rGdp.value; // desc
    const gdpYoY = +(((gdp[0].value - gdp[4].value) / gdp[4].value) * 100).toFixed(2);
    const diff = +(creditYoY - gdpYoY).toFixed(2);
    ind.credito = {
      label: 'Crédito vs Nominal GDP (TOTLL vs GDP)',
      value: diff, creditYoY, gdpYoY,
      date: tl[0].date,
      score: scCredito(diff), weight: 3, auto: true
    };
  } else {
    if (rTotll.status !== 'fulfilled') errs.push('TOTLL: ' + rTotll.reason?.message);
    if (rGdp.status   !== 'fulfilled') errs.push('GDP: '   + rGdp.reason?.message);
    ind.credito = { label: 'Crédito vs Nominal GDP', value: man.credito ?? null, date: null,
      score: man.credito != null ? scCredito(man.credito) : null, weight: 3, manual: man.credito != null };
  }

  // 6. Impulso Crediticio — derivado de la aceleración del crédito (TOTLL)
  // Si tenemos TOTLL: impulso = variación del YoY vs hace 3 meses (aceleración del crédito)
  // Si override manual, usar ese.
  if (man.impulso != null) {
    ind.impulso = { label: 'Impulso Crediticio', value: man.impulso, date: null,
      score: scImpulso(man.impulso), weight: 2, manual: true };
  } else if (rTotll.status === 'fulfilled' && rTotll.value.length >= 16) {
    const tl = rTotll.value; // desc
    // YoY actual vs YoY de hace 3 meses = aceleración del crédito
    const yoyNow  = ((tl[0].value  - tl[12].value) / tl[12].value) * 100;
    const yoy3m   = ((tl[3].value  - tl[15].value) / tl[15].value) * 100;
    const impulso = +(yoyNow - yoy3m).toFixed(2);
    ind.impulso = {
      label: 'Impulso Crediticio (aceleración TOTLL)',
      value: impulso, yoyNow: +yoyNow.toFixed(2), yoy3mAgo: +yoy3m.toFixed(2),
      date: tl[0].date,
      score: scImpulso(impulso), weight: 2, auto: true
    };
  } else {
    ind.impulso = { label: 'Impulso Crediticio', value: man.impulso ?? null, date: null,
      score: man.impulso != null ? scImpulso(man.impulso) : null, weight: 2, manual: man.impulso != null };
  }

  // 7. Velocidad M2 — FRED M2V (trimestral, YoY vs hace 4 trimestres)
  if (rM2v.status === 'fulfilled' && rM2v.value.length >= 5) {
    const latest = rM2v.value[0].value, ya = rM2v.value[4].value;
    const yoy = +(((latest - ya) / ya) * 100).toFixed(2);
    ind.velM2 = { label: 'Velocidad M2', value: yoy, rawValue: latest,
      date: rM2v.value[0].date, score: scVelM2(yoy), weight: 2 };
  } else {
    errs.push('M2V: ' + rM2v.reason?.message);
    ind.velM2 = { label: 'Velocidad M2', value: null, date: null, score: null, weight: 2 };
  }

  // 8. Reservas Bancarias — FRED WRESBAL (semanal, valor absoluto en $B → convertir a $T)
  if (rWresbal.status === 'fulfilled' && rWresbal.value[0]) {
    const rawB = rWresbal.value[0].value;              // en miles de millones $
    const rawT = +(rawB / 1000).toFixed(2);            // convertir a $T
    ind.reservas = { label: 'Reservas Bancarias Fed', value: rawT, rawValue: rawT,
      date: rWresbal.value[0].date, score: scReservas(rawT), weight: 1 };
  } else {
    errs.push('WRESBAL: ' + rWresbal.reason?.message);
    ind.reservas = { label: 'Reservas Bancarias Fed', value: null, date: null, score: null, weight: 1 };
  }

  // 9. Tipo Real (auto)
  if (ffr && cpiYoY != null) {
    const v = +(ffr.value - cpiYoY).toFixed(2);
    ind.tipoReal = { label: 'Tipo Real (FFR−CPI)', value: v, date: ffr.date,
      score: scTipoReal(v), weight: 1 };
  }

  // 10. BBB Spread (auto)
  if (rBbb.status === 'fulfilled' && rBbb.value[0]) {
    const v = rBbb.value[0].value;
    ind.bbb = { label: 'BBB Corporate Spread', value: v, date: rBbb.value[0].date,
      score: scBBB(v), weight: 1 };
  } else errs.push('BBB: ' + rBbb.reason?.message);

  // 11. Fear & Greed / Put-Call proxy (auto)
  const fg = rFg.status === 'fulfilled' ? rFg.value : null;
  if (fg) {
    ind.fearGreed = { label: 'Fear & Greed (CNN)', value: fg.value, date: null,
      score: scFG(fg.value), weight: 1,
      previousClose: fg.previousClose, previousWeek: fg.previousWeek, previousMonth: fg.previousMonth,
      label_text: fg.label };
  } else errs.push('FearGreed: ' + rFg.reason?.message);

  // ── Score total ───────────────────────────────
  // Solo indicadores con score != null contribuyen al numerador Y al denominador.
  // STALE/MISSING/ERROR quedan completamente excluidos de ambos.
  let scoreTotal = 0, availableScore = 0;
  const scoreDetail = {};
  const MAX_POSSIBLE = 17; // suma teórica de todos los pesos cuando todos puntúan
  Object.entries(ind).forEach(([k, i]) => {
    if (i.score != null) {
      scoreTotal    += i.score;
      availableScore += (i.weight || 1);
      scoreDetail[k] = { score: i.score, weight: i.weight };
    }
    // Si score null: excluido del numerador Y del denominador
  });
  const coverage = +(availableScore / MAX_POSSIBLE).toFixed(4); // 0–1

  // ── Seguimiento (sin score) ───────────────────
  const seguimiento = {
    t10y,
    t2y,
    ffr,
    t10y2y: t10y && t2y ? { value: +(t10y.value - t2y.value).toFixed(2), date: t10y.date } : null,
    cpi:     cpiYoY    != null ? { value: cpiYoY,    date: rCpi.value?.[0]?.date }    : null,
    cpiCore: cpiCoreYoY != null ? { value: cpiCoreYoY, date: rCpiCore.value?.[0]?.date } : null,
    bbb:     ind.bbb   || null,
    hySpread: rHy.status === 'fulfilled' && rHy.value[0]
      ? { value: rHy.value[0].value, date: rHy.value[0].date } : null,
    breakeven1y: (() => {
      // EXPINF1YR — Fed de Cleveland (más preciso que T1YIE)
      if (rBreakeven1y.status === 'fulfilled') {
        const valid = rBreakeven1y.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) return { value: valid.value, date: valid.date, series: 'EXPINF1YR' };
      }
      // Fallback: MICH (Univ. Michigan)
      if (rMich?.status === 'fulfilled') {
        const valid = rMich.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) return { value: valid.value, date: valid.date, series: 'MICH' };
      }
      errs.push('EXPINF1YR+MICH: sin datos válidos');
      return null;
    })(),
    breakeven5y: (() => {
      if (rBreakeven5y.status === 'fulfilled') {
        const valid = rBreakeven5y.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) return { value: valid.value, date: valid.date };
      }
      // Fallback a T5YIFR
      if (rBreakeven5yAlt.status === 'fulfilled') {
        const valid = rBreakeven5yAlt.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) return { value: valid.value, date: valid.date, series: 'T5YIFR' };
      }
      errs.push('T5YIE+T5YIFR: sin datos válidos');
      return null;
    })(),
    vix:   rVix.status   === 'fulfilled' ? rVix.value   : null,
    wti:   rWti.status   === 'fulfilled' ? rWti.value   : null,
    brent: rBrent.status === 'fulfilled' ? rBrent.value : null,
  };
  if (rVix.status !== 'fulfilled') errs.push('VIX: ' + rVix.reason?.message);
  if (rBreakeven1y.status !== 'fulfilled') errs.push('T1YIE: ' + rBreakeven1y.reason?.message);
  if (rBreakeven5y.status !== 'fulfilled') errs.push('T5YIE: ' + rBreakeven5y.reason?.message);

  // Riesgo contagio
  const rc = cpiYoY != null && cpiCoreYoY != null ? riesgoContagio(cpiYoY, cpiCoreYoY) : null;

  return res.status(200).json({
    updatedAt: new Date().toISOString(),
    scoreTotal,
    availableScore,
    coverage,
    maxPossible: MAX_POSSIBLE,
    zone: zone(scoreTotal),
    probabilities: probabilities(scoreTotal),
    riesgoContagio: rc,

    // 1.1 Coyuntura — indicadores con score
    coyuntura: {
      curvaUSD:  ind.curvaUSD,
      curvaEUR:  ind.curvaEUR,
      lei:       ind.lei,
      cpi:       seguimiento.cpi ? { ...seguimiento.cpi, cpiCore: cpiCoreYoY } : null,
      tipoReal:  ind.tipoReal,
    },

    // 1.2 Seguimiento — automáticos sin score
    seguimiento,

    // 1.3 Liquidez — indicadores con score (manuales)
    liquidez: {
      m2:       ind.m2,
      credito:  ind.credito,
      impulso:  ind.impulso,
      velM2:    ind.velM2,
      reservas: ind.reservas,
      bbb:      ind.bbb,
    },

    // Todos los indicadores con score (para debug y Kelly)
    indicators: ind,
    scoreDetail,
    errors: errs.length ? errs : undefined,
  });
}
