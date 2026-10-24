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

// ── CHN M2 — Arquitectura P0.1 ────────────────────────────────────
// Prioridad: PBoC Worker → Trading Economics → ChinaData.live
// FRED MYAGM2CNM189N/MABMM301CNM189S discontinuadas — NO usar.
// YoY calculado internamente desde nivel M2, igual que USA/EUR/JPN.
// Cross-check contra YoY publicado por TE cuando disponible.
// P0.1 criterio de cierre: CHN OK · coverage 100/100 · YoY ≈ +7.7% (jul 2026 PBoC)

async function fetchChinaM2_TE() {
  // Trading Economics — serie mensual PBoC M2 China en CNY billion
  // Endpoint JSON público (sin API key para datos básicos)
  const url = 'https://api.tradingeconomics.com/historical/country/china/indicator/money-supply-m2?c=guest:guest&f=json';
  const diag = { source: 'TRADING_ECONOMICS', url: url.replace(/c=[^&]+/, 'c=***'), httpStatus: null,
    parserBranch: null, nObsReceived: null, nObsParsed: null,
    latestDate: null, latestValue: null, baseDate: null, baseValue: null, error: null };
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { signal: ctrl.signal,
      headers: { 'User-Agent': 'EthanMacroPlatform/1.0', 'Accept': 'application/json' } });
    diag.httpStatus = res.status;
    if (!res.ok) { diag.error = `HTTP ${res.status}`; return { diag, missing: true }; }
    const json = await res.json();
    // TE estructura: array de {DateTime, Value, ...}
    const rows = Array.isArray(json) ? json : json?.data || [];
    diag.parserBranch = Array.isArray(json) ? 'root_array' : 'json.data';
    diag.nObsReceived = rows.length;
    if (!rows.length) { diag.error = 'TE: array vacío'; return { diag, missing: true }; }
    // Normalizar: DateTime = "YYYY-MM-DDT..." o "YYYY-MM-DD"
    const obs = rows.map(r => ({
      date: String(r.DateTime || r.date || '').slice(0,7),
      value: Number(r.Value ?? r.value),
    })).filter(r => /^\d{4}-\d{2}$/.test(r.date) && Number.isFinite(r.value) && r.value > 0)
      .sort((a,b) => b.date.localeCompare(a.date));
    diag.nObsParsed = obs.length;
    if (!obs.length) { diag.error = 'TE: sin obs válidas tras parseo'; return { diag, missing: true }; }
    return { obs, source: 'TE_PBOC', diag };
  } catch(e) { diag.error = `fetch error: ${e.message}`; return { diag, missing: true }; }
}

async function fetchChinaM2_Live() {
  // ChinaData.live — alternativa si TE no disponible
  const url = 'https://chinadata.live/api/v2/data/china-m2-money-supply';
  const diag = { source: 'CHINADATA_LIVE', url, httpStatus: null,
    parserBranch: null, nObsReceived: null, nObsParsed: null,
    latestDate: null, latestValue: null, baseDate: null, baseValue: null, error: null };
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(url, { signal: ctrl.signal,
      headers: { 'User-Agent': 'EthanMacroPlatform/1.0', 'Accept': 'application/json' } });
    diag.httpStatus = res.status;
    if (!res.ok) { diag.error = `HTTP ${res.status} — posible bloqueo Cloudflare/WAF`; return { diag, missing: true }; }
    const json = await res.json();
    let rows = null;
    if (Array.isArray(json?.data?.data))  { rows = json.data.data; diag.parserBranch = 'json.data.data'; }
    else if (Array.isArray(json?.data))    { rows = json.data;       diag.parserBranch = 'json.data'; }
    else if (Array.isArray(json))          { rows = json;            diag.parserBranch = 'root_array'; }
    else { diag.error = `estructura desconocida: keys=${Object.keys(json||{}).slice(0,5).join(',')}`; }
    diag.nObsReceived = rows?.length ?? 0;
    if (!rows?.length) { diag.error = diag.error || 'CHN_NO_OBSERVATIONS'; return { diag, missing: true }; }
    const obs = rows.map(r => {
      const rawDate = String(r.date || r.period || r.time || '');
      const date = rawDate.length >= 7 ? rawDate.slice(0,7).replace(/^(\d{4})(\d{2})$/, '$1-$2') : null;
      return { date, value: Number(r.value ?? r.val ?? r.amount) };
    }).filter(r => r.date && /^\d{4}-\d{2}$/.test(r.date) && Number.isFinite(r.value) && r.value > 0)
      .sort((a,b) => b.date.localeCompare(a.date));
    diag.nObsParsed = obs.length;
    if (!obs.length) { diag.error = 'CHN_NO_VALID_OBS_AFTER_PARSE'; diag.failReason = 'INVALID_DATE_OR_VALUE'; return { diag, missing: true }; }

    // Debug: primeras/últimas observaciones para diagnóstico
    diag.first3 = obs.slice(-3).map(r => `${r.date}=${r.value}`); // obs está desc, las últimas son las más antiguas
    diag.last3  = obs.slice(0, 3).map(r => `${r.date}=${r.value}`);  // primeras en desc = más recientes

    const current = obs[0];
    diag.latestDate  = current.date;
    diag.latestValue = current.value;

    const [year, month] = current.date.split('-').map(Number);
    const targetBase = `${year - 1}-${String(month).padStart(2, '0')}`;
    diag.targetBaseDate = targetBase;

    const base = obs.find(r => r.date === targetBase)
      || obs.find(r => Math.abs(new Date(r.date+'-01') - new Date(targetBase+'-01')) <= 35*24*3600*1000);

    if (!base) {
      diag.failReason = 'NO_BASE_12M';
      diag.error = `YoY base no encontrada cerca de ${targetBase}. Obs disponibles: ${obs.slice(0,5).map(r=>r.date).join(',')}...`;
      return { diag, missing: true };
    }

    diag.baseDate = base.date;
    diag.baseValue = base.value;
    diag.baseDeltaDays = Math.round(Math.abs(new Date(base.date+'-01') - new Date(targetBase+'-01')) / (1000*60*60*24));

    const yoy = +((current.value / base.value - 1) * 100).toFixed(2);
    diag.yoyCalc = `${current.value}/${base.value}-1 = ${yoy}%`;
    return { obs, source: 'PBOC_VIA_CHINADATA', diag };
  } catch(e) { diag.error = `fetch error: ${e.message}`; return { diag, missing: true }; }
}

async function fetchChinaM2() {
  // Prioridad: Trading Economics → ChinaData.live
  // (PBoC Worker se añadirá cuando el Worker esté configurado)
  const diagAll = [];
  for (const fetchFn of [fetchChinaM2_TE, fetchChinaM2_Live]) {
    let result;
    try { result = await fetchFn(); } catch(e) { result = { diag: { error: e.message }, missing: true }; }
    diagAll.push(result.diag);
    if (result && !result.missing && result.obs?.length) {
      // Calcular YoY internamente desde nivel M2 (igual que USA/EUR/JPN)
      const obs = result.obs; // desc
      const current = obs[0];
      const [year, month] = current.date.split('-').map(Number);
      const targetBase = `${year - 1}-${String(month).padStart(2, '0')}`;
      const base = obs.find(r => r.date === targetBase)
        || obs.find(r => Math.abs(new Date(r.date+'-01') - new Date(targetBase+'-01')) <= 35*24*3600*1000);
      if (!base) {
        result.diag.error = `YOY_BASE_NOT_FOUND: buscando ${targetBase}`;
        diagAll[diagAll.length-1] = result.diag;
        continue;
      }
      const yoy = +((current.value / base.value - 1) * 100).toFixed(2);
      result.diag.latestDate = current.date;
      result.diag.latestValue = current.value;
      result.diag.baseDate = base.date;
      result.diag.baseValue = base.value;
      return { current, base, yoy, nObs: obs.length,
        source: result.source, diag: result.diag, diagAll };
    }
  }
  // Todas las fuentes fallaron
  return { diag: diagAll[diagAll.length-1] || { error: 'all sources failed' }, diagAll, missing: true };
}


// ── Calcular M2 Global USA + EUR + JPN + CHN ────────────────────
// Fix 1: freshness por componente
// Fix 2: YoY por fecha real (no obs[12] a ciegas)
const M2_STALE_DAYS     = 90;  // USA/EUR/JPN: mensual con lag ~4-6 semanas
const M2_STALE_DAYS_CHN = 120; // CHN: PBoC publica con lag ~45-60 días + descarga

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
  const [rUsM2, rEurM2, rJpM2, rChnM2, rEURUSD, rUSDJPY] = await Promise.allSettled([
    fred('M2SL', fredKey, 14),
    fetchECBm2(),
    fetchBOJm2(),
    fetchChinaM2(fredKey),
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
    // Solo YoY oficial disponible (sin nivel de stock)
    const oy = jpResult.officialYoY;
    const { ageDays, freshness } = m2Freshness(oy.date);
    components.jp = {
      yoy: oy.value, currentDate: oy.date, isOfficialYoY: true,
      ageDays, freshness, weight: 10, valid: freshness === 'ok', source: jpSource2,
    };
    // Nota: no sobreescribir con error si el YoY oficial es válido
  }

  // ── CHN M2 — ChinaData.live (fuente primaria). Sin fallback a FRED (series discontinuadas).
  // fetchChinaM2() devuelve { diag, missing:true } si falla, o { current, base, yoy, diag } si OK.
  const chnRaw    = rChnM2.status === 'fulfilled' ? rChnM2.value : null;
  const chnDiag   = chnRaw?.diag || { error: rChnM2.reason?.message || 'promise rejected' };

  if (chnRaw && !chnRaw.missing && chnRaw.current && chnRaw.yoy != null) {
    const dateStr = chnRaw.current.date;
    const d = new Date(dateStr.length === 7 ? dateStr + '-01' : dateStr);
    const ageDays = Math.round((Date.now() - d.getTime()) / (1000*60*60*24));
    const freshness = ageDays <= M2_STALE_DAYS_CHN ? 'ok' : 'stale';
    components.chn = {
      valid:        freshness !== 'stale',
      source:       chnRaw.source || 'PBOC_VIA_CHINADATA',
      currentDate:  chnRaw.current.date,
      currentValue: chnRaw.current.value,
      baseDate:     chnRaw.base.date,
      baseValue:    chnRaw.base.value,
      yoy:          +chnRaw.yoy.toFixed(2),
      ageDays, freshness, weight: 30,
      nObs:         chnRaw.nObs || null,
      diag:         chnDiag,
      diagAll:      chnRaw?.diagAll,
    };
  } else if (manualChinaM2pct != null) {
    components.chn = {
      yoy: manualChinaM2pct, currentDate: null, freshness: 'manual',
      weight: 30, valid: true, source: 'manual override',
      diag: chnDiag,
      diagAll: chnRaw?.diagAll,
    };
  } else {
    // MISSING — diagnostico completo expuesto, no sustituido silenciosamente
    const errMsg = chnDiag?.error || rChnM2.reason?.message || 'sin datos';
    errors.push('CHN M2: ' + errMsg);
    components.chn = {
      yoy: null, freshness: 'missing', weight: 30, valid: false,
      error: errMsg, diag: chnDiag,
      diagAll: chnRaw?.diagAll,
    };
  }

  // ── Agregación con cobertura dinámica y renormalización explícita ──
  const available = Object.values(components).filter(c => c.valid && c.yoy != null);
  const coverageWeight = available.reduce((s, c) => s + c.weight, 0);
  const allRegions = ['us','eur','jp','chn'];
  const missingRegions = allRegions.filter(k => !components[k]?.valid);
  const MIN_COVERAGE = 60;
  const renormalized = missingRegions.length > 0; // pesos renormalizados cuando falta alguna región
  let globalYoY = null;
  if (available.length > 0) {
    // Renormalización: dividir por suma de pesos disponibles (no 100)
    globalYoY = +(available.reduce((s, c) => s + c.yoy * c.weight, 0) / coverageWeight).toFixed(2);
  }
  const coverageOk = coverageWeight >= MIN_COVERAGE;
  // PARTIAL = score posible pero cobertura incompleta
  const aggregateStatus = !coverageOk ? 'INSUFFICIENT' : missingRegions.length > 0 ? 'PARTIAL' : 'OK';

  // FX spot (solo informativo — no afecta YoY)
  const eurusd = rEURUSD.status === 'fulfilled' ? rEURUSD.value.value : null;
  const usdjpy = rUSDJPY.status === 'fulfilled' ? rUSDJPY.value.value : null;

  return {
    globalYoY,
    coverageWeight,
    coveragePct: +(coverageWeight / 100).toFixed(4),
    coverageOk,
    aggregateStatus,   // 'OK' | 'PARTIAL' | 'INSUFFICIENT'
    renormalized,      // true cuando se renormalizan pesos por ausencia de región
    missingRegions,    // lista de regiones ausentes
    components,
    fx: { eurusd, usdjpy },
    errors,
  };
}

// ── Helper: fetch Yahoo Finance chart (ticker codificado) ─────────────────
// ── Helper: calcAgeDays estandarizado (UTC midnight) ─────────────────────
// Acepta fecha ISO "YYYY-MM-DD" o timestamp Unix (segundos).
// Resta siempre desde UTC 00:00 de la fecha dada, evitando desfases de zona.
function calcAgeDays(dateOrTs) {
  if (dateOrTs == null) return null;
  let ms;
  if (typeof dateOrTs === 'number') {
    // Unix timestamp en segundos → fecha UTC midnight
    const d = new Date(dateOrTs * 1000);
    ms = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  } else {
    const s = String(dateOrTs).slice(0, 10); // "YYYY-MM-DD"
    const [y, m, dd] = s.split('-').map(Number);
    ms = Date.UTC(y, m - 1, dd);
  }
  return Math.round((Date.now() - ms) / 86400000);
}

async function fetchYahooChart(ticker, range = '5y', label = ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=${range}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ETHAN/1.0)' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Yahoo ${label}: HTTP ${r.status}`);
  const res = (await r.json()).chart?.result?.[0];
  if (!res) throw new Error(`Yahoo ${label}: sin resultado`);
  const timestamps = res.timestamp || [];
  const closes     = res.indicators?.quote?.[0]?.close || [];
  const valid = timestamps
    .map((t, i) => ({ t, v: closes[i] }))
    .filter(o => o.v != null && isFinite(o.v));
  return valid; // [{t: unix, v: float}]
}

// ── Helper: métricas de serie de precios/volatilidad ─────────────────────
// Calcula MM100, MM200, cambios 1D/5D/20D, pendiente MM, percentil ventana
function seriesMetrics(valid, label, source, freshnessThresholds = [3, 7]) {
  if (!valid || valid.length < 2) return null;
  const vals  = valid.map(o => o.v);
  const times = valid.map(o => o.t);
  const n     = vals.length;
  const current  = vals[n - 1];
  const lastTs   = times[n - 1];
  const firstTs  = times[0];
  const lastDate  = new Date(lastTs  * 1000).toISOString().slice(0, 10);
  const firstDate = new Date(firstTs * 1000).toISOString().slice(0, 10);
  const ageDays   = calcAgeDays(lastTs);   // UTC midnight — consistente con FRED
  const [okDays, warnDays] = freshnessThresholds;
  const freshness = ageDays <= okDays ? 'ok' : ageDays <= warnDays ? 'warn' : 'stale';
  const stale = freshness === 'stale';

  // MM100 / MM200 — requieren exactamente esa cantidad de obs
  const mm100 = n >= 100 ? +(vals.slice(-100).reduce((a, b) => a + b, 0) / 100).toFixed(4) : null;
  const mm200 = n >= 200 ? +(vals.slice(-200).reduce((a, b) => a + b, 0) / 200).toFixed(4) : null;

  // Pendientes: comparar MM actual vs MM hace 10 sesiones
  let slopeMM100 = null, slopeMM200 = null;
  if (n >= 110) {
    const mm100_10ago = +(vals.slice(-110, -10).reduce((a, b) => a + b, 0) / 100).toFixed(4);
    slopeMM100 = mm100 != null ? (mm100 > mm100_10ago ? 'up' : mm100 < mm100_10ago ? 'down' : 'flat') : null;
  }
  if (n >= 210) {
    const mm200_10ago = +(vals.slice(-210, -10).reduce((a, b) => a + b, 0) / 200).toFixed(4);
    slopeMM200 = mm200 != null ? (mm200 > mm200_10ago ? 'up' : mm200 < mm200_10ago ? 'down' : 'flat') : null;
  }

  // Cambios 1D / 5D / 20D
  const chg1d  = n >  1 ? +(current - vals[n -  2]).toFixed(4) : null;
  const chg5d  = n >  5 ? +(current - vals[n -  6]).toFixed(4) : null;
  const chg20d = n > 20 ? +(current - vals[n - 21]).toFixed(4) : null;

  // Posición vs medias
  const aboveMM100 = mm100 != null ? current > mm100 : null;
  const aboveMM200 = mm200 != null ? current > mm200 : null;

  // Percentil dentro de la ventana disponible (con etiqueta explícita de ventana)
  const sorted = [...vals].sort((a, b) => a - b);
  const rank   = sorted.filter(v => v <= current).length;
  const percentile = +(rank / sorted.length * 100).toFixed(1);
  const percentileWindow = `desde ${firstDate} hasta ${lastDate}`;

  // Z-score rolling 3Y (≥756 sesiones)
  const HAS_3Y = n >= 756;
  let zscore3y = null;
  if (HAS_3Y) {
    const sl  = vals.slice(-756);
    const m   = sl.reduce((a, b) => a + b, 0) / sl.length;
    const sd  = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / sl.length);
    zscore3y  = sd > 0 ? +((current - m) / sd).toFixed(2) : null;
  }

  return {
    label, source,
    value: +current.toFixed(4), date: lastDate, dateFrom: firstDate,
    ageDays, freshness, stale,
    nObs: n,
    mm100, mm200, slopeMM100, slopeMM200,
    aboveMM100, aboveMM200,
    chg1d, chg5d, chg20d,
    percentile, percentileWindow, insufficientHistory: !HAS_3Y,
    zscore3y,
  };
}

// ── Helper: subsamplea serie a máximo N puntos para el frontend ──────────
function subsampleHistory(valid, maxPts = 756) {
  if (!valid || valid.length === 0) return [];
  // valid: [{t: unix, v: float}] ordenado ascendente
  if (valid.length <= maxPts) return valid.map(o => ({ date: new Date(o.t * 1000).toISOString().slice(0, 10), v: +o.v.toFixed(4) }));
  const step = Math.ceil(valid.length / maxPts);
  const out = [];
  for (let i = 0; i < valid.length; i += step) out.push(valid[i]);
  // Siempre incluir el último punto
  if (out[out.length - 1] !== valid[valid.length - 1]) out.push(valid[valid.length - 1]);
  return out.map(o => ({ date: new Date(o.t * 1000).toISOString().slice(0, 10), v: +o.v.toFixed(4) }));
}

// ── VIX con SMA200 + métricas completas ──────────────────────────────────
async function fetchVIX() {
  // 5Y para tener ≥1250 sesiones → MM200 seguro y Z-score 3Y
  const valid = await fetchYahooChart('%5EVIX', '5y', 'VIX');
  if (valid.length < 200) {
    return { error: `INVALID_HISTORY: solo ${valid.length} sesiones válidas (necesarias 200 para MM200)`, valid: false };
  }
  const m = seriesMetrics(valid, 'VIX', 'Yahoo Finance ^VIX', [3, 7]);
  if (!m) return { error: 'VIX: seriesMetrics devolvió null', valid: false };
  return {
    ...m,
    value:        m.value,
    aboveSMA200:  m.aboveMM200,   // alias legado para sentimentScore (liquidez.js lo usa)
    sessionsUsed: m.nObs,
    valid: true,
    signal: m.aboveMM200 ? 'Alerta: VIX sobre MM200 — volatilidad elevada' : 'VIX bajo MM200 — volatilidad contenida',
    history: subsampleHistory(valid, 756),  // ≤756 puntos (3Y de diarios) para el gráfico
  };
}

// ── VIX3M ─────────────────────────────────────────────────────────────────
async function fetchVIX3M() {
  // ^VIX3M: CBOE 3-Month Volatility Index (disponible en Yahoo Finance)
  const valid = await fetchYahooChart('%5EVIX3M', '5y', 'VIX3M');
  if (valid.length < 5) throw new Error(`VIX3M: solo ${valid.length} sesiones — NO DATA`);
  const m = seriesMetrics(valid, 'VIX3M', 'Yahoo Finance ^VIX3M', [3, 7]);
  return { ...m, history: subsampleHistory(valid, 756) };
}

// ── DXY ───────────────────────────────────────────────────────────────────
async function fetchDXY() {
  // DX-Y.NYB: ICE US Dollar Index (Spot) en Yahoo Finance
  const valid = await fetchYahooChart('DX-Y.NYB', '5y', 'DXY');
  if (valid.length < 5) throw new Error(`DXY: solo ${valid.length} sesiones — NO DATA`);
  return seriesMetrics(valid, 'DXY', 'Yahoo Finance DX-Y.NYB (ICE US Dollar Index)', [3, 7]);
}

// ── S&P 500 — tendencia multitemporal M10 ─────────────────────────────────
async function fetchSP500Trend() {
  // ^GSPC: S&P 500 Index. Necesitamos cierre diario, semanal y mensual → 5Y de diarios
  const daily = await fetchYahooChart('%5EGSPC', '5y', 'SP500');
  if (daily.length < 20) throw new Error(`SP500: solo ${daily.length} sesiones — insuficiente`);

  // Helper: M10 sobre un array de cierres (10 últimos periodos)
  function m10State(closes, label) {
    const n = closes.length;
    if (n < 11) return { state: 'INSUFFICIENT_DATA', label, nObs: n, price: null, m10: null, slope: null };
    const price = closes[n - 1];
    const m10   = +(closes.slice(-10).reduce((a, b) => a + b, 0) / 10).toFixed(4);
    // Pendiente: comparar M10 actual vs M10 hace 5 periodos
    const m10prev = n >= 15 ? +(closes.slice(-15, -5).reduce((a, b) => a + b, 0) / 10).toFixed(4) : null;
    const slope   = m10prev != null ? (m10 > m10prev ? 'up' : m10 < m10prev ? 'down' : 'flat') : null;
    const aboveM10 = price > m10;
    // Estado: alcista = precio sobre M10 Y M10 subiendo | bajista = precio bajo M10 Y M10 bajando | neutral = resto
    let state;
    if (aboveM10 && slope === 'up')   state = 'alcista';
    else if (!aboveM10 && slope === 'down') state = 'bajista';
    else state = 'neutral';
    return { state, label, nObs: n, price: +price.toFixed(2), m10, slope, aboveM10 };
  }

  // Diario: usar cierres diarios directamente
  const dailyCloses = daily.map(o => o.v);
  const dailyDates  = daily.map(o => new Date(o.t * 1000).toISOString().slice(0, 10));
  const dailyState  = { ...m10State(dailyCloses, 'Diario'), date: dailyDates[dailyDates.length - 1] };

  // Semanal: agrupar por semana (cierre del viernes o último día de la semana)
  const weeklyMap = new Map();
  daily.forEach(o => {
    const d   = new Date(o.t * 1000);
    const yr  = d.getUTCFullYear();
    const wk  = Math.floor((d - new Date(yr, 0, 1)) / 604800000);
    const key = `${yr}-W${String(wk).padStart(2,'0')}`;
    weeklyMap.set(key, o.v); // sobreescribe → queda el último día de cada semana
  });
  const weeklyCloses = [...weeklyMap.values()];
  const weeklyDates  = [...weeklyMap.keys()];
  const weeklyState  = { ...m10State(weeklyCloses, 'Semanal'), week: weeklyDates[weeklyDates.length - 1] };

  // Mensual: agrupar por mes
  const monthlyMap = new Map();
  daily.forEach(o => {
    const d   = new Date(o.t * 1000);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;
    monthlyMap.set(key, o.v); // sobreescribe → queda el cierre de fin de mes
  });
  const monthlyCloses = [...monthlyMap.values()];
  const monthlyDates  = [...monthlyMap.keys()];
  const monthlyState  = { ...m10State(monthlyCloses, 'Mensual'), month: monthlyDates[monthlyDates.length - 1] };

  // Resumen
  const states = [monthlyState.state, weeklyState.state, dailyState.state];
  let summary;
  if (states.every(s => s === 'alcista'))                                     summary = 'Tendencia plenamente confirmada — alcista en los tres marcos';
  else if (monthlyState.state === 'alcista' && weeklyState.state === 'alcista') summary = 'Corrección diaria dentro de tendencia alcista';
  else if (monthlyState.state === 'alcista' && weeklyState.state !== 'alcista') summary = 'Deterioro intermedio — mensual alcista pero semanal debilitado';
  else if (states.every(s => s === 'bajista'))                                summary = 'Régimen técnico bajista confirmado en los tres marcos';
  else                                                                         summary = 'Señales mixtas — sin confirmación clara de tendencia';

  // Construir historiales para el gráfico (date + price + m10 móvil punto a punto)
  function buildM10History(closes, dates, maxPts) {
    const n = closes.length;
    const pts = [];
    for (let i = 9; i < n; i++) {
      const m10i = +(closes.slice(i - 9, i + 1).reduce((a, b) => a + b, 0) / 10).toFixed(2);
      pts.push({ date: String(dates[i]).slice(0, 10), price: +closes[i].toFixed(2), m10: m10i });
    }
    if (pts.length <= maxPts) return pts;
    const step = Math.ceil(pts.length / maxPts);
    const out = [];
    for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
    if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
    return out;
  }

  const dailyHistory   = buildM10History(dailyCloses, dailyDates, 756);
  const weeklyHistory  = buildM10History(weeklyCloses, weeklyDates, 260);
  const monthlyHistory = buildM10History(monthlyCloses, monthlyDates, 120);

  return {
    label: 'S&P 500 Tendencia Multitemporal', source: 'Yahoo Finance ^GSPC · M10',
    daily:   { ...dailyState,   history: dailyHistory },
    weekly:  { ...weeklyState,  history: weeklyHistory },
    monthly: { ...monthlyState, history: monthlyHistory },
    summary,
    nObsDaily: daily.length,
    dateLastClose: dailyDates[dailyDates.length - 1],
    // Amplitud: NO DATA — pendiente de fuente robusta (batch SP500 components)
    amplitud: { state: 'NO_DATA', note: 'Amplitud: NO DATA — pendiente de fuente de breadth robusta (batch SP500 components, fase posterior)' },
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
          date: new Date().toISOString().slice(0,10), source: 'CNN' };
      }
      const fg = d?.fear_and_greed;
      if (fg?.score != null) {
        return { value: Math.round(fg.score), label: fg.rating,
          previousClose: fg.previous_close  != null ? Math.round(fg.previous_close)  : null,
          previousWeek:  fg.previous_1_week  != null ? Math.round(fg.previous_1_week)  : null,
          previousMonth: fg.previous_1_month != null ? Math.round(fg.previous_1_month) : null,
          date: new Date().toISOString().slice(0,10), source: 'CNN' };
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
            return { value, label, date: new Date().toISOString().slice(0,10), source: 'MacroMicro/CNN' };
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
          vix: vix.toFixed(1), date: new Date().toISOString().slice(0,10), source: 'VIX sintético' };
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
// Indicador 10: BBB Spread (×1) — frontera inequívoca
// ≤1.00% → +1 | >1.00% y ≤1.50% → 0 | >1.50% → -1
function scBBB(v) {
  if (v <= 1.00) return +1;
  if (v <= 1.50) return  0;
  return -1;
}
// Indicador 11: Fear & Greed / Put-Call proxy (×1)
// Sentiment Score — Risk-On/Risk-Off (independiente del contrarian)
function scFG_sent(v)  { return v < 25 ? -1 : v < 55 ? 0 : +1; }
function scVIX_sent(aboveSMA200) { return aboveSMA200 ? -1 : +1; }
function scHY_sent(v)  { return v < 3.5 ? +1 : v <= 5.0 ? 0 : -1; }
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
    rVix3m, rDxy, rDfii10, rSP500Trend,
  ] = await Promise.allSettled([
    fred('DGS10',        key, 5),
    fred('DGS2',         key, 5),
    fred('DFF',          key, 100),   // diario — necesita ~91 obs para 3M de dirección
    fred('BAMLC0A4CBBB', key, 6500),  // diario — histórico completo desde ~2000 para percentil LT y Z-score 3Y
    fred('CPIAUCSL',     key, 16),
    fred('CPILFESL',     key, 16),
    fetchFearGreed(),
    fetchVIX(),                        // 5Y de diarios → MM200 + Z-score 3Y
    fetchCurvaEUR(),
    fred('BAMLH0A0HYM2', key, 6500),  // diario — histórico completo desde ~2000 para percentil LT y Z-score 3Y
    fred('EXPINF1YR',    key, 10),   // Fed Cleveland 1Y inflation expectations
    fred('T5YIE',        key, 10),   // Breakeven 5Y
    fred('T5YIFR',       key, 10),   // Breakeven 5Y forward rate (alternativa)
    yahoo('CL%3DF'),
    yahoo('BZ%3DF'),
    fred('M2V',          key, 8),
    fred('WRESBAL',      key, 60),
    fred('USALOLITOAASTSAM', key, 3),   // OECD CLI USA (amplitude adjusted, mensual)
    fred('TOTLL',        key, 70),
    fred('GDP',          key,  8),
    fred('MICH',         key, 10),   // Univ. Michigan 1Y inflation expectations (fallback)
    // ── Nuevas series Fase 1 ──────────────────────────────────────────────
    fetchVIX3M(),                      // CBOE 3M Vol — para ratio VIX/VIX3M
    fetchDXY(),                        // ICE US Dollar Index — DX-Y.NYB
    fred('DFII10',       key, 1300),   // 10Y Real Yield TIPS — 5Y de diarios (≥756 para Z-score 3Y)
    fetchSP500Trend(),                 // Tendencia M10 diaria/semanal/mensual
  ]);

  // M2 Global en paralelo pero con timeout propio para no bloquear el resto
  const rGlobalM2 = await Promise.race([
    calcGlobalM2(key, man.chinM2).then(v => ({ status: 'fulfilled', value: v })).catch(e => ({ status: 'rejected', reason: e })),
    new Promise(resolve => setTimeout(() => resolve({ status: 'rejected', reason: new Error('M2 Global timeout') }), 8000)),
  ]);

  // ── Procesar series automáticas ───────────────
  let t10y = null, t2y = null, ffr = null, cpiYoY = null, cpiCoreYoY = null;

  // DGS10 — enriquecido con freshness, ageDays, chg1d/5d, percentile
  if (rDgs10.status === 'fulfilled' && rDgs10.value[0]) {
    const obs10 = rDgs10.value; // DESC, ya filtrado por fred()
    const v10   = obs10[0].value;
    const d10   = obs10[0].date;
    const age10 = calcAgeDays(d10);
    const fr10  = age10 <= 7 ? 'ok' : age10 <= 10 ? 'warn' : 'stale';
    const vals10 = obs10.map(o => o.value);
    t10y = {
      value: v10, date: d10, ageDays: age10, freshness: fr10, stale: fr10 === 'stale',
      chg1d:  vals10.length > 1 ? +(v10 - vals10[1]).toFixed(3)  : null,
      chg5d:  vals10.length > 4 ? +(v10 - vals10[4]).toFixed(3)  : null,
    };
  } else errs.push('DGS10: ' + rDgs10.reason?.message);

  // DGS2 — enriquecido con freshness, ageDays, chg1d/5d, percentile
  if (rDgs2.status === 'fulfilled' && rDgs2.value[0]) {
    const obs2  = rDgs2.value;
    const v2    = obs2[0].value;
    const d2    = obs2[0].date;
    const age2  = calcAgeDays(d2);
    const fr2   = age2 <= 7 ? 'ok' : age2 <= 10 ? 'warn' : 'stale';
    const vals2 = obs2.map(o => o.value);
    t2y = {
      value: v2, date: d2, ageDays: age2, freshness: fr2, stale: fr2 === 'stale',
      chg1d:  vals2.length > 1 ? +(v2 - vals2[1]).toFixed(3)  : null,
      chg5d:  vals2.length > 4 ? +(v2 - vals2[4]).toFixed(3)  : null,
    };
  } else errs.push('DGS2: ' + rDgs2.reason?.message);

  // FFR — FRED DFF (diario). Freshness: ≤7d OK | 8-14d WARN | >14d STALE
  let ffrMeta = null;
  if (rDff.status === 'fulfilled' && rDff.value[0]) {
    const d = rDff.value[0];
    const ageDays = Math.round((Date.now() - new Date(d.date).getTime()) / 86400000);
    ffrMeta = { value: d.value, date: d.date, ageDays,
      freshness: ageDays <= 7 ? 'ok' : ageDays <= 14 ? 'warn' : 'stale' };
    ffr = { value: d.value, date: d.date };
  } else errs.push('DFF: ' + rDff.reason?.message);

  // CPI — FRED CPIAUCSL (mensual). YoY por fecha real. Freshness: ≤45d OK | ≤60d WARN | >60d STALE
  let cpiMeta = null;
  if (rCpi.status === 'fulfilled' && rCpi.value.length >= 2) {
    const obs = rCpi.value;
    const current = obs[0];
    const base    = findYoYBase(obs, current.date);
    if (base) {
      cpiYoY = +(((current.value - base.value) / base.value) * 100).toFixed(2);
      const ageDays = Math.round((Date.now() - new Date(current.date).getTime()) / 86400000);
      cpiMeta = { value: current.value, date: current.date, baseDate: base.date,
        baseValue: base.value, yoy: cpiYoY, ageDays,
        freshness: ageDays <= 45 ? 'ok' : ageDays <= 60 ? 'warn' : 'stale' };
    } else errs.push('CPI: sin base YoY 12M');
  } else errs.push('CPI: ' + rCpi.reason?.message);

  if (rCpiCore.status === 'fulfilled' && rCpiCore.value.length >= 2) {
    const obs = rCpiCore.value;
    const current = obs[0];
    const base    = findYoYBase(obs, current.date);
    if (base) cpiCoreYoY = +(((current.value - base.value) / base.value) * 100).toFixed(2);
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
      // Audit trail — FIX 02+03: M2 Global traceability
      audit: {
        methodology: 'Weighted average YoY of regional M2s. Weights: USA=35, EUR=25, JPN=10, CHN=30. Min coverage=60/100 for valid score.',
        aggregateStatus: g.aggregateStatus,  // OK | PARTIAL | INSUFFICIENT
        renormalized: g.renormalized,         // true → pesos renormalizados por ausencia de región
        missingRegions: g.missingRegions,     // regiones ausentes
        historicalProxy: 'HIST_MACRO_V1 uses M2SL (USA) as HISTORICAL_PROXY for M2 Global. China/EUR/JPN not available for pre-2016 history.',
        series: {
          usa: { seriesId: 'M2SL', source: 'FRED', frequency: 'monthly', weight: 35,
            value: g.components.us?.currentValue, date: g.components.us?.currentDate,
            yoy: g.components.us?.yoy, ageDays: g.components.us?.ageDays,
            freshness: g.components.us?.freshness, status: g.components.us?.valid ? 'OK' : (g.components.us?.freshness || 'MISSING'),
            nObs: null, error: g.components.us?.error || null },
          eur: { seriesId: 'ECB_BSI_M3/M2', source: 'ECB', frequency: 'monthly', weight: 25,
            value: g.components.eur?.currentValue, date: g.components.eur?.currentDate,
            yoy: g.components.eur?.yoy, ageDays: g.components.eur?.ageDays,
            freshness: g.components.eur?.freshness, status: g.components.eur?.valid ? 'OK' : (g.components.eur?.freshness || 'MISSING'),
            nObs: null, error: g.components.eur?.error || null },
          jpn: { seriesId: 'MAM1NAM2M2MO (nivel) + MAM1YAM2M2MO (YoY oficial)',
            source: g.components.jp?.source || 'BOJ_PROXY',
            sourceNote: 'BOJ Time-Series API (stat-search.boj.or.jp) via Cloudflare Worker proxy. MAM1NAM2M2MO = M2+CD stock, fin de mes. MAM1YAM2M2MO = variación interanual oficial BOJ. No es proxy: es la serie oficial BOJ de M2.',
            frequency: 'monthly', weight: 10,
            value: g.components.jp?.currentValue, date: g.components.jp?.currentDate,
            yoy: g.components.jp?.yoy, ageDays: g.components.jp?.ageDays,
            freshness: g.components.jp?.freshness, status: g.components.jp?.valid ? 'OK' : (g.components.jp?.freshness || 'MISSING'),
            isOfficialYoY: g.components.jp?.isOfficialYoY || false,
            validation: g.components.jp?.validation || null,
            error: g.components.jp?.error || null },
          chn: { seriesId: 'MYAGM2CNM189N (FRED, primario) / china-m2-money-supply (ChinaData, fallback)',
            source: g.components.chn?.source || 'PBOC_VIA_CHINADATA', frequency: 'monthly', weight: 30,
            value: g.components.chn?.currentValue, date: g.components.chn?.currentDate,
            yoy: g.components.chn?.yoy, ageDays: g.components.chn?.ageDays,
            freshness: g.components.chn?.freshness,
            status: g.components.chn?.valid ? 'OK' : (g.components.chn?.freshness === 'missing' ? 'MISSING' : 'STALE'),
            nObs: g.components.chn?.nObs || null,
            yoyControl: g.components.chn?.yoyControl || null,
            fredError: g.components.chn?.fredError || null,
            error: g.components.chn?.error || null,
            note: g.components.chn?.valid ? null : 'CHN MISSING → no substituido silenciosamente. Score basado solo en cobertura disponible.' },
        },
        coverageActive: Object.entries(g.components).filter(([,c])=>c.valid).map(([k,c])=>({region:k,weight:c.weight,yoy:c.yoy})),
        errors: g.errors,
      },
    };
  } else {
    errs.push('M2 Global: ' + rGlobalM2.reason?.message);
    ind.m2 = { label: 'M2 Global', value: null, date: null, score: null, weight: 3 };
  }

  // 5. Crédito vs Nominal GDP — FRED TOTLL (mensual) vs GDP (trimestral, SAAR)
  // Fix: YoY por fecha real (findYoYBase), freshness por componente, debug completo
  // Scoring provisional: diff ≥ +3.0% → +3 | ≥ +1.5% → 0 | < +1.5% → -3
  if (man.credito != null) {
    ind.credito = { label: 'Crédito vs Nominal GDP', value: man.credito, date: null,
      score: scCredito(man.credito), weight: 3, manual: true };
  } else if (rTotll.status === 'fulfilled' && rTotll.value.length >= 2 &&
             rGdp.status   === 'fulfilled' && rGdp.value.length   >= 2) {
    const tl  = rTotll.value; // desc, mensual
    const gdp = rGdp.value;   // desc, trimestral

    // TOTLL YoY por fecha real — serie semanal: buscar obs más próxima a t-365d ±7 días
    const tlCurrent  = tl[0];
    const tlBase     = findYoYBase(tl, tlCurrent.date);  // ±10d ya configurado en findYoYBase
    const tlAgeDays  = Math.round((Date.now() - new Date(tlCurrent.date).getTime()) / 86400000);
    const tlFresh    = tlAgeDays <= 30 ? 'ok' : tlAgeDays <= 45 ? 'warn' : 'stale';

    // GDP YoY por fecha real — trimestral, publication-aware
    // La fecha FRED es el inicio del trimestre (2026-04-01 = Q2 2026)
    // BEA publica ~30 días después del cierre del trimestre
    // Freshness: considerar stale solo si han pasado >150d desde inicio del trimestre
    // (equivale a >~2 trimestres de lag, lo que indicaría que hay un dato más reciente disponible)
    const gdpCurrent = gdp[0];
    const gdpBase    = findYoYBase(gdp, gdpCurrent.date);
    const gdpAgeDays = Math.round((Date.now() - new Date(gdpCurrent.date).getTime()) / 86400000);
    const gdpFresh   = gdpAgeDays <= 150 ? 'ok' : gdpAgeDays <= 210 ? 'warn' : 'stale';

    if (tlBase && gdpBase) {
      const creditYoY = +(((tlCurrent.value  - tlBase.value)  / tlBase.value)  * 100).toFixed(2);
      const gdpYoY    = +(((gdpCurrent.value - gdpBase.value) / gdpBase.value) * 100).toFixed(2);
      const diff      = +(creditYoY - gdpYoY).toFixed(2);
      const isStale   = tlFresh === 'stale' || gdpFresh === 'stale';
      ind.credito = {
        label: 'Crédito vs Nominal GDP (TOTLL vs GDP)',
        value: diff, creditYoY, gdpYoY,
        tl:  { date: tlCurrent.date,  value: tlCurrent.value,  baseDate: tlBase.date,  baseValue: tlBase.value,  ageDays: tlAgeDays,  freshness: tlFresh  },
        gdp: { date: gdpCurrent.date, value: gdpCurrent.value, baseDate: gdpBase.date, baseValue: gdpBase.value, ageDays: gdpAgeDays, freshness: gdpFresh },
        date: tlCurrent.date,
        score: isStale ? null : scCredito(diff),
        weight: 3, auto: true,
        stale: isStale,
      };
    } else {
      ind.credito = {
        label: 'Crédito vs Nominal GDP', value: null, date: tlCurrent.date,
        tl:  { date: tlCurrent.date,  ageDays: tlAgeDays,  freshness: tlFresh,  error: tlBase  ? null : 'Sin base YoY 12M' },
        gdp: { date: gdpCurrent.date, ageDays: gdpAgeDays, freshness: gdpFresh, error: gdpBase ? null : 'Sin base YoY 4T'  },
        score: null, weight: 3, auto: true,
      };
    }
  } else {
    if (rTotll.status !== 'fulfilled') errs.push('TOTLL: ' + rTotll.reason?.message);
    if (rGdp.status   !== 'fulfilled') errs.push('GDP: '   + rGdp.reason?.message);
    ind.credito = { label: 'Crédito vs Nominal GDP', value: man.credito ?? null, date: null,
      score: man.credito != null ? scCredito(man.credito) : null, weight: 3, manual: man.credito != null };
  }

  // 6. Impulso Crediticio — aceleración del crédito (TOTLL semanal)
  // Impulso = YoY actual − YoY de hace 3 meses (≈91 días)
  // Fix: buscar obs más cercana a t−91d por fecha, no por posición (tl[3] = 3 semanas, no 3 meses)
  if (man.impulso != null) {
    ind.impulso = { label: 'Impulso Crediticio', value: man.impulso, date: null,
      score: scImpulso(man.impulso), weight: 2, manual: true };
  } else if (rTotll.status === 'fulfilled' && rTotll.value.length >= 4) {
    const tl = rTotll.value; // desc, semanal
    const current = tl[0];

    // Punto de hace ~3 meses: buscar obs más próxima a currentDate - 91 días
    const currentMs = new Date(current.date).getTime();
    const target3m  = currentMs - 91 * 24 * 60 * 60 * 1000;
    const WEEK_MS   = 7 * 24 * 60 * 60 * 1000;
    const obs3m = tl.reduce((best, o) => {
      const diff = Math.abs(new Date(o.date).getTime() - target3m);
      return (!best || diff < Math.abs(new Date(best.date).getTime() - target3m)) ? o : best;
    }, null);

    // Bases YoY por fecha real para cada punto
    const baseNow = findYoYBase(tl, current.date);
    const base3m  = obs3m ? findYoYBase(tl, obs3m.date) : null;

    // Freshness
    const tlAgeDays = Math.round((Date.now() - currentMs) / 86400000);
    const tlFresh   = tlAgeDays <= 30 ? 'ok' : tlAgeDays <= 45 ? 'warn' : 'stale';

    if (baseNow && base3m && obs3m) {
      const yoyNow = ((current.value  - baseNow.value) / baseNow.value) * 100;
      const yoy3m  = ((obs3m.value    - base3m.value)  / base3m.value)  * 100;
      const impulso = +(yoyNow - yoy3m).toFixed(2);
      ind.impulso = {
        label: 'Impulso Crediticio (aceleración TOTLL)',
        value: impulso,
        yoyNow:   +yoyNow.toFixed(2),
        yoy3mAgo: +yoy3m.toFixed(2),
        current:  { date: current.date,  value: current.value,  baseDate: baseNow.date, ageDays: tlAgeDays, freshness: tlFresh },
        point3m:  { date: obs3m.date,    value: obs3m.value,    baseDate: base3m.date },
        date: current.date,
        score: tlFresh === 'stale' ? null : scImpulso(impulso),
        weight: 2, auto: true,
        stale: tlFresh === 'stale',
      };
    } else {
      ind.impulso = {
        label: 'Impulso Crediticio', value: null, date: current.date,
        error: !baseNow ? `Sin base YoY actual (buscando ~${new Date(new Date(current.date).getTime()-365*86400000).toISOString().slice(0,10)} en ${tl.length} obs, última ${tl[tl.length-1]?.date})` : !obs3m ? 'Sin obs 3M' : `Sin base YoY 3M (buscando ~${new Date(new Date(obs3m.date).getTime()-365*86400000).toISOString().slice(0,10)} en ${tl.length} obs)`,
        score: null, weight: 2, auto: true,
      };
    }
  } else {
    ind.impulso = { label: 'Impulso Crediticio', value: man.impulso ?? null, date: null,
      score: man.impulso != null ? scImpulso(man.impulso) : null, weight: 2, manual: man.impulso != null };
  }

  // 7. Velocidad M2 — FRED M2V (trimestral, NSA)
  // Fix: YoY por fecha real (findYoYBase), freshness publication-aware, debug completo
  if (rM2v.status === 'fulfilled' && rM2v.value.length >= 2) {
    const mv = rM2v.value; // desc, trimestral
    const current = mv[0];
    const base    = findYoYBase(mv, current.date);
    const ageDays = Math.round((Date.now() - new Date(current.date).getTime()) / 86400000);
    // Trimestral publication-aware: dato de QN publicado ~30d después del cierre del trimestre
    // Stale si han pasado >210d desde inicio del trimestre (>2 trimestres sin actualizar)
    const freshness = ageDays <= 150 ? 'ok' : ageDays <= 210 ? 'warn' : 'stale';
    if (base) {
      const yoy = +(((current.value - base.value) / base.value) * 100).toFixed(2);
      ind.velM2 = {
        label: 'Velocidad M2 (FRED M2V)',
        value: yoy, rawValue: current.value,
        date: current.date, baseDate: base.date, baseValue: base.value,
        ageDays, freshness,
        score: freshness === 'stale' ? null : scVelM2(yoy),
        weight: 2, auto: true, stale: freshness === 'stale',
      };
    } else {
      ind.velM2 = { label: 'Velocidad M2', value: null, date: current.date,
        error: 'Sin base YoY trimestral', ageDays, freshness,
        score: null, weight: 2, auto: true };
    }
  } else {
    errs.push('M2V: ' + rM2v.reason?.message);
    ind.velM2 = { label: 'Velocidad M2', value: null, date: null, score: null, weight: 2 };
  }

  // 8. Reservas Bancarias — FRED WRESBAL (semanal, SA, miles de millones USD → $T)
  // Freshness semanal: ≤14d OK | 15-21d WARN | >21d STALE
  if (rWresbal.status === 'fulfilled' && rWresbal.value[0]) {
    const rawM = rWresbal.value[0].value;              // en millones USD (FRED)
    const rawT  = +(rawM / 1_000_000).toFixed(3);      // millones → trillions
    const date    = rWresbal.value[0].date;
    const ageDays = Math.round((Date.now() - new Date(date).getTime()) / 86400000);
    const freshness = ageDays <= 14 ? 'ok' : ageDays <= 21 ? 'warn' : 'stale';
    ind.reservas = {
      label: 'Reservas Bancarias Fed',
      value: rawT, rawValueM: rawM, date,
      ageDays, freshness,
      score: freshness === 'stale' ? null : scReservas(rawT),
      weight: 1, auto: true, stale: freshness === 'stale',
    };
  } else {
    errs.push('WRESBAL: ' + rWresbal.reason?.message);
    ind.reservas = { label: 'Reservas Bancarias Fed', value: null, date: null, score: null, weight: 1 };
  }

  // 9. Tipo Real (FFR − CPI YoY) — PROVISIONAL
  // FFR: FRED DFF (diario) | CPI: FRED CPIAUCSL (mensual, YoY por fecha real)
  if (ffrMeta && cpiMeta) {
    const isStale = ffrMeta.freshness === 'stale' || cpiMeta.freshness === 'stale';
    const v = +(ffrMeta.value - cpiMeta.yoy).toFixed(2);
    ind.tipoReal = {
      label: 'Tipo Real (FFR−CPI)',
      value: v, date: ffrMeta.date,
      ffr: ffrMeta, cpi: cpiMeta,
      score: isStale ? null : scTipoReal(v),
      weight: 1, auto: true, stale: isStale,
    };
  } else if (ffr && cpiYoY != null) {
    // Fallback sin metadata completa
    const v = +(ffr.value - cpiYoY).toFixed(2);
    ind.tipoReal = { label: 'Tipo Real (FFR−CPI)', value: v, date: ffr.date,
      score: scTipoReal(v), weight: 1 };
  }

  // ── Helper: métricas enriquecidas para spreads de crédito ──────────────────
  function creditSpreadMetrics(obs, label, source, freshnessThresholds = [3, 7]) {
    if (!obs || !obs.length) return null;
    // obs llega en orden DESC (más reciente primero) — invertir para cálculos
    const asc   = [...obs].reverse();
    const valid = asc.filter(o => !isNaN(+o.value) && o.value != null);
    if (!valid.length) return null;
    const vals     = valid.map(o => +o.value);
    const dates    = valid.map(o => o.date);
    const current  = vals.at(-1);
    const lastDate = dates.at(-1);
    const firstDate = dates[0];
    const ageDays  = lastDate ? calcAgeDays(lastDate) : null;
    const [okDays, warnDays] = freshnessThresholds;
    const freshness = ageDays == null ? 'missing' : ageDays <= okDays ? 'ok' : ageDays <= warnDays ? 'warn' : 'stale';
    const stale = freshness === 'stale' || freshness === 'missing';

    // Percentil — serie histórica completa (todas las observaciones disponibles)
    const sorted = [...vals].sort((a, b) => a - b);
    const rank   = sorted.filter(v => v <= current).length;
    const percentile = +(rank / sorted.length * 100).toFixed(1);

    // Z-score rolling 3Y (~756 sesiones) — null si no hay 756 obs completas
    const HAS_3Y = vals.length >= 756;
    let zscore3y = null;
    let mean3y   = null;
    if (HAS_3Y) {
      const slice3y = vals.slice(-756);
      mean3y  = slice3y.reduce((a, b) => a + b, 0) / slice3y.length;
      const std3y = Math.sqrt(slice3y.reduce((a, b) => a + (b - mean3y) ** 2, 0) / slice3y.length);
      zscore3y = std3y > 0 ? +((current - mean3y) / std3y).toFixed(2) : null;
      mean3y   = +mean3y.toFixed(3);
    }

    const var20 = vals.length > 20 ? +(current - vals.at(-21)).toFixed(3) : null;
    const var60 = vals.length > 60 ? +(current - vals.at(-61)).toFixed(3) : null;
    const sma200vals = vals.slice(-200);
    const sma200     = sma200vals.length >= 100
      ? +(sma200vals.reduce((a, b) => a + b, 0) / sma200vals.length).toFixed(3) : null;
    const trendVsSma200 = sma200 != null ? (current > sma200 ? 'above' : 'below') : null;

    return {
      label, source,
      value: +current.toFixed(3), date: lastDate, dateFrom: firstDate, ageDays, freshness, stale,
      nObs: vals.length,
      // Percentil calculado sobre todo el histórico disponible
      percentile,
      // Z-score solo si hay ≥756 sesiones; si no → insufficientHistory: true
      zscore3y,
      mean3y,
      insufficientHistory: !HAS_3Y,
      var20, var60, sma200, trendVsSma200,
      researchOnly: true,
    };
  }

  // 10a. BBB Corporate Spread — RESEARCH/DIAGNOSTIC ONLY (retirado del Liquidity Score)
  // researchOnly: true → sin score, sin weight → no contribuye al scoreTotal ni al MAX_POSSIBLE
  if (rBbb.status === 'fulfilled' && rBbb.value?.length) {
    const bbbMetrics = creditSpreadMetrics(rBbb.value, 'BBB Corporate Spread', 'FRED BAMLC0A4CBBB', [3, 7]);
    if (bbbMetrics) {
      ind.bbb = { ...bbbMetrics, researchOnly: true, auto: true };
      // score y weight quedan undefined → el loop scoreTotal los ignora
    }
  } else errs.push('BBB OAS: FRED BAMLC0A4CBBB — ' + (rBbb.reason?.message || 'sin datos'));

  // 10b. HY OAS — solo diagnóstico, sin score
  let hyOasMetrics = null;
  if (rHy.status === 'fulfilled' && rHy.value?.length) {
    hyOasMetrics = creditSpreadMetrics(rHy.value, 'High Yield OAS', 'FRED BAMLH0A0HYM2', [3, 7]);
    if (!hyOasMetrics) errs.push('HY OAS: FRED BAMLH0A0HYM2 retornó ' + rHy.value.length + ' obs pero creditSpreadMetrics devolvió null');
  } else if (rHy.status === 'rejected') {
    errs.push('HY OAS: FRED BAMLH0A0HYM2 — ' + (rHy.reason?.message || 'fetch rejected'));
  } else if (rHy.status === 'fulfilled' && !rHy.value?.length) {
    errs.push('HY OAS: FRED BAMLH0A0HYM2 — array vacío tras filtrar "." (0 observaciones válidas)');
  }

  // 10c. HY–BBB Gap — calculado, solo diagnóstico
  let hyBbbGap = null;
  if (hyOasMetrics?.value != null && ind.bbb?.value != null) {
    // Reconstruir series válidas ascendentes (ya filtradas de ".")
    const hyVals  = rHy.value?.length  ? [...rHy.value].reverse().filter(o => !isNaN(+o.value)).map(o => +o.value)  : [];
    const hyDates = rHy.value?.length  ? [...rHy.value].reverse().filter(o => !isNaN(+o.value)).map(o => o.date)    : [];
    const bbbVals = rBbb.value?.length ? [...rBbb.value].reverse().filter(o => !isNaN(+o.value)).map(o => +o.value) : [];
    const bbbDates= rBbb.value?.length ? [...rBbb.value].reverse().filter(o => !isNaN(+o.value)).map(o => o.date)   : [];
    // Gap sobre el solapamiento de ambas series (mínimo común)
    const minLen  = Math.min(hyVals.length, bbbVals.length);
    const gapVals = Array.from({ length: minLen }, (_, i) =>
      +(hyVals.at(-(minLen - i)) - bbbVals.at(-(minLen - i))).toFixed(3));
    const gapVal  = +(hyOasMetrics.value - ind.bbb.value).toFixed(3);
    // Fechas de ventana
    const gapDateFrom = hyDates.at(-minLen) || bbbDates.at(-minLen) || null;
    const gapDate     = hyOasMetrics.date || ind.bbb?.date || null;
    // Percentil LT sobre serie de gaps completa
    const gapSorted = [...gapVals].sort((a, b) => a - b);
    const gapRank   = gapSorted.filter(v => v <= gapVal).length;
    const gapPct    = +(gapRank / (gapSorted.length || 1) * 100).toFixed(1);
    // Z-score 3Y del gap (≥756 obs solapadas)
    const GAP_HAS_3Y = gapVals.length >= 756;
    let gapZscore = null;
    if (GAP_HAS_3Y) {
      const sl  = gapVals.slice(-756);
      const m   = sl.reduce((a, b) => a + b, 0) / sl.length;
      const sd  = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / sl.length);
      gapZscore = sd > 0 ? +((gapVal - m) / sd).toFixed(2) : null;
    }
    const gapVar20 = gapVals.length > 20 ? +(gapVal - gapVals.at(-21)).toFixed(3) : null;
    const gapVar60 = gapVals.length > 60 ? +(gapVal - gapVals.at(-61)).toFixed(3) : null;
    const gapSma200vals = gapVals.slice(-200);
    const gapSma200 = gapSma200vals.length >= 100
      ? +(gapSma200vals.reduce((a, b) => a + b, 0) / gapSma200vals.length).toFixed(3) : null;
    const gapTrend = gapSma200 != null ? (gapVal > gapSma200 ? 'above' : 'below') : null;
    const gapStale = hyOasMetrics.stale || (ind.bbb?.stale ?? false);
    hyBbbGap = {
      label: 'HY–BBB Gap', source: 'calc: BAMLH0A0HYM2 − BAMLC0A4CBBB',
      value: gapVal, date: gapDate, dateFrom: gapDateFrom, stale: gapStale,
      freshness: gapStale ? 'stale' : 'ok',
      nObs: gapVals.length, insufficientHistory: !GAP_HAS_3Y,
      percentile: gapPct, zscore3y: gapZscore,
      var20: gapVar20, var60: gapVar60,
      sma200: gapSma200, trendVsSma200: gapTrend,
      researchOnly: true,
    };
  }

  // 11. Fear & Greed — CNN (scraping) con freshness
  // F&G desacoplado del scoreTotal (decisión arquitectónica agosto 2026):
  // - scoreTotal debe contener solo variables macro/financieras con histórico reproducible
  // - F&G (LIVE_ONLY) entra exclusivamente en sentimentScore con convención risk-on coherente
  // - Señal contrarian se mantiene como capa informativa no puntuable
  // - score: null → excluido del loop scoreTotal; weight: 0 para documentar la intención
  const fg = rFg.status === 'fulfilled' ? rFg.value : null;
  if (fg) {
    ind.fearGreed = {
      label: 'Fear & Greed (CNN)',
      value: fg.value, date: fg.date || null,
      source: fg.source || 'CNN',
      previousClose: fg.previousClose, previousWeek: fg.previousWeek, previousMonth: fg.previousMonth,
      label_text: fg.label,
      ageDays: fg.date ? Math.round((Date.now() - new Date(fg.date).getTime()) / 86400000) : null,
      freshness: (() => {
        if (!fg.date) return 'unknown';
        const d = Math.round((Date.now() - new Date(fg.date).getTime()) / 86400000);
        return d <= 1 ? 'ok' : d <= 3 ? 'warn' : 'stale';
      })(),
      score: null,   // excluido del scoreTotal — solo entra en sentimentScore
      weight: 0,     // MAX_POSSIBLE no incluye F&G (LIVE_ONLY, sin histórico reproducible)
      scoreContrarian: scFG(fg.value),       // conservado para señal contrarian informativa
      scoreSentiment: scFG_sent(fg.value),   // score risk-on para sentimentScore
    };
  } else errs.push('FearGreed: ' + rFg.reason?.message);

  // ── Fase 1: Nuevas series — VIX3M, DXY, DFII10, SP500Trend ──────────────

  // VIX3M
  let vix3mData = null;
  if (rVix3m.status === 'fulfilled' && rVix3m.value) {
    vix3mData = rVix3m.value;
  } else {
    errs.push('VIX3M (^VIX3M Yahoo): ' + (rVix3m.reason?.message || 'NO DATA — no se sustituye por otra serie'));
  }

  // DXY
  let dxyData = null;
  if (rDxy.status === 'fulfilled' && rDxy.value) {
    dxyData = rDxy.value;
  } else {
    errs.push('DXY (DX-Y.NYB Yahoo): ' + (rDxy.reason?.message || 'NO DATA — no se sustituye por otra serie'));
  }

  // DFII10 — 10Y Real Yield TIPS (diferente de tipoReal = FFR−CPI)
  let dfii10Data = null;
  if (rDfii10.status === 'fulfilled' && rDfii10.value?.length) {
    const obs    = [...rDfii10.value].reverse().filter(o => o.value != null && !isNaN(+o.value));
    if (obs.length >= 2) {
      const current  = +obs[obs.length - 1].value;
      const lastDate = obs[obs.length - 1].date;
      const firstDate= obs[0].date;
      const ageDays  = calcAgeDays(lastDate);
      const freshness= ageDays <= 3 ? 'ok' : ageDays <= 7 ? 'warn' : 'stale';
      const vals     = obs.map(o => +o.value);
      const n        = vals.length;
      const chg1d    = n >  1 ? +(current - vals[n -  2]).toFixed(3) : null;
      const chg5d    = n >  5 ? +(current - vals[n -  6]).toFixed(3) : null;
      const chg20d   = n > 20 ? +(current - vals[n - 21]).toFixed(3) : null;
      const sorted   = [...vals].sort((a, b) => a - b);
      const rank     = sorted.filter(v => v <= current).length;
      const percentile = +(rank / sorted.length * 100).toFixed(1);
      // Lectura de régimen
      let regime;
      if (current <= 0) regime = 'acomodaticio';
      else if (current <= 1.0) regime = 'neutral-bajo';
      else if (current <= 2.0) regime = 'neutral-alto';
      else regime = 'restrictivo';
      dfii10Data = {
        label: '10Y Real Yield (TIPS)', source: 'FRED DFII10',
        value: current, date: lastDate, dateFrom: firstDate,
        ageDays, freshness, stale: freshness === 'stale',
        nObs: n, chg1d, chg5d, chg20d,
        percentile, percentileWindow: `desde ${firstDate} hasta ${lastDate}`,
        insufficientHistory: n < 756,
        regime,
        note: 'Distinto de tipoReal (FFR−CPI). DFII10 = rendimiento real mercado TIPS 10Y.',
      };
    } else errs.push('DFII10: insuficientes obs válidas tras filtrar');
  } else {
    errs.push('DFII10 (FRED): ' + (rDfii10.reason?.message || 'sin datos'));
  }

  // SP500 Tendencia multitemporal
  let sp500Trend = null;
  if (rSP500Trend.status === 'fulfilled' && rSP500Trend.value) {
    sp500Trend = rSP500Trend.value;
  } else {
    errs.push('SP500Trend (^GSPC Yahoo): ' + (rSP500Trend.reason?.message || 'NO DATA'));
  }

  // ── VIX Term Structure Ratio = VIX / VIX3M ───────────────────────────────
  let vixTermRatio = null;
  const vixVal  = rVix.status === 'fulfilled' ? rVix.value?.value : null;
  const vix3mVal = vix3mData?.value ?? null;
  if (vixVal != null && vix3mVal != null && vix3mVal > 0) {
    const ratio = +(vixVal / vix3mVal).toFixed(4);
    let ratioState;
    if (ratio < 0.90)    ratioState = 'contango';
    else if (ratio < 1.0) ratioState = 'tension-creciente';
    else if (ratio < 1.10) ratioState = 'backwardation';
    else                  ratioState = 'estres-severo';
    vixTermRatio = {
      ratio, vix: vixVal, vix3m: vix3mVal,
      state: ratioState,
      date: rVix.value?.date || null,
    };
  }

  // ── HY OAS: añadir MM100/MM200 desde la serie completa ya cargada ────────
  // hyOasMetrics ya tiene percentil LT y Z-score 3Y desde creditSpreadMetrics().
  // Calculamos MM100/MM200 y cambios sobre la misma serie rHy.value
  let hyOasEnhanced = hyOasMetrics ? { ...hyOasMetrics } : null;
  if (hyOasMetrics && rHy.status === 'fulfilled' && rHy.value?.length) {
    const hyObs = [...rHy.value].reverse().filter(o => !isNaN(+o.value));
    const hyVals2 = hyObs.map(o => +o.value);
    const hn = hyVals2.length;
    const mm100 = hn >= 100 ? +(hyVals2.slice(-100).reduce((a,b) => a+b, 0) / 100).toFixed(4) : null;
    const mm200 = hn >= 200 ? +(hyVals2.slice(-200).reduce((a,b) => a+b, 0) / 200).toFixed(4) : null;
    let slopeMM100 = null, slopeMM200 = null;
    if (hn >= 110) {
      const prev = +(hyVals2.slice(-110, -10).reduce((a,b) => a+b,0)/100).toFixed(4);
      slopeMM100 = mm100 > prev ? 'up' : mm100 < prev ? 'down' : 'flat';
    }
    if (hn >= 210) {
      const prev = +(hyVals2.slice(-210, -10).reduce((a,b) => a+b,0)/200).toFixed(4);
      slopeMM200 = mm200 > prev ? 'up' : mm200 < prev ? 'down' : 'flat';
    }
    const cur = hyOasMetrics.value;
    const chg1d  = hn >  1 ? +(cur - hyVals2[hn -  2]).toFixed(4) : null;
    const chg5d  = hn >  5 ? +(cur - hyVals2[hn -  6]).toFixed(4) : null;
    const chg20d = hn > 20 ? +(cur - hyVals2[hn - 21]).toFixed(4) : null;
    // Estado HY OAS según spec
    const aboveMM100 = mm100 != null ? cur > mm100 : null;
    const aboveMM200 = mm200 != null ? cur > mm200 : null;
    let hyState;
    if (!aboveMM100 && !aboveMM200 && (slopeMM100 !== 'up') && (chg20d == null || chg20d <= 0))
      hyState = 'normal';
    else if (aboveMM100 && slopeMM100 === 'up' && chg20d != null && chg20d > 0)
      hyState = 'vigilancia';
    else if (aboveMM100 && aboveMM200 && slopeMM100 === 'up' && slopeMM200 === 'up')
      hyState = 'tension';
    else
      hyState = 'vigilancia';
    // Alerta estrés: supera máximo de 6M (126 sesiones) + Z-score alto + BBB confirma
    const max6m = hn >= 126 ? Math.max(...hyVals2.slice(-126)) : null;
    const stressAlert = max6m != null && cur > max6m
      && (hyOasMetrics.zscore3y ?? 0) > 1.5
      && ind.bbb?.value != null && ind.bbb.value > (hyVals2.slice(-126).reduce((a,b)=>a+b,0)/Math.min(hn,126));
    if (stressAlert) hyState = 'estres';
    // Historia para gráfico: últimos 3Y (≈756 obs diarias) en orden ASC
    const hyHistory = (() => {
      // hyObs ya está en ASC (tras .reverse()), filtrado de NaN
      const hyDatesAsc = [...rHy.value].reverse().filter(o => !isNaN(+o.value));
      const maxPts = 756;
      const src = hyDatesAsc.length <= maxPts ? hyDatesAsc
        : hyDatesAsc.slice(-maxPts); // últimos 3Y
      return src.map(o => ({ date: String(o.date).slice(0, 10), v: +o.value }));
    })();

    hyOasEnhanced = {
      ...hyOasMetrics,
      mm100, mm200, slopeMM100, slopeMM200,
      aboveMM100, aboveMM200,
      chg1d, chg5d, chg20d,
      hyState,
      history: hyHistory,
    };
  }

  // ── Motor de alertas combinadas ───────────────────────────────────────────
  const alerts = [];
  const now = new Date().toISOString().slice(0, 10);

  // Alerta de crédito
  if (hyOasEnhanced?.aboveMM100 && hyOasEnhanced?.chg20d > 0 && hyOasEnhanced?.slopeMM100 === 'up') {
    alerts.push({ id: 'credito', label: 'Alerta de crédito', severity: 'warn', date: now,
      triggers: ['HY OAS sobre MM100', `var20D +${hyOasEnhanced.chg20d?.toFixed(2)}pp`, 'MM100 ascendente'],
      state: hyOasEnhanced.hyState });
  }
  // Alerta de volatilidad
  const vixAboveMM100 = rVix.status === 'fulfilled' && rVix.value?.aboveMM100;
  if (vixVal != null && vixVal > 20 && vixAboveMM100 && vixTermRatio?.ratio != null && vixTermRatio.ratio >= 0.9) {
    alerts.push({ id: 'volatilidad', label: 'Alerta de volatilidad', severity: 'warn', date: now,
      triggers: [`VIX ${vixVal?.toFixed(1)} > 20`, 'VIX sobre MM100', `ratio VIX/VIX3M ${vixTermRatio.ratio?.toFixed(3)} ≥ 0.90`],
      state: vixTermRatio.state });
  }
  // Alerta de estrés
  if (hyOasEnhanced?.hyState === 'tension' || hyOasEnhanced?.hyState === 'estres') {
    if (vixVal != null && vixVal > 30 && vixTermRatio?.ratio != null && vixTermRatio.ratio > 1.0) {
      alerts.push({ id: 'estres', label: 'Alerta de estrés', severity: 'error', date: now,
        triggers: ['HY OAS en tensión o estrés', `VIX ${vixVal?.toFixed(1)} > 30`, `ratio VIX/VIX3M ${vixTermRatio.ratio?.toFixed(3)} > 1.0`],
        state: 'estres' });
    }
  }
  // Alerta de endurecimiento financiero
  if (dxyData?.chg5d != null && dxyData.chg5d > 0.5
    && dfii10Data?.chg5d != null && dfii10Data.chg5d > 0.05
    && hyOasEnhanced?.chg5d != null && hyOasEnhanced.chg5d > 0.05) {
    alerts.push({ id: 'endurecimiento', label: 'Alerta de endurecimiento financiero', severity: 'warn', date: now,
      triggers: [`DXY +${dxyData.chg5d?.toFixed(2)} (5D)`, `DFII10 +${dfii10Data.chg5d?.toFixed(3)}pp (5D)`, `HY OAS +${hyOasEnhanced.chg5d?.toFixed(3)}pp (5D)`],
      state: 'endurecimiento' });
  }
  // Corrección dentro de tendencia
  if (sp500Trend?.monthly?.state === 'alcista' && sp500Trend?.weekly?.state === 'alcista'
    && sp500Trend?.daily?.state !== 'alcista'
    && (hyOasEnhanced?.hyState === 'normal' || hyOasEnhanced?.hyState === 'vigilancia')) {
    alerts.push({ id: 'correccion', label: 'Corrección dentro de tendencia alcista', severity: 'info', date: now,
      triggers: ['Mensual alcista', 'Semanal alcista', `Diario ${sp500Trend.daily.state}`, `HY OAS ${hyOasEnhanced?.hyState || '—'}`],
      state: 'correccion' });
  }
  // Deterioro confirmado
  if (sp500Trend?.weekly?.state === 'bajista' && sp500Trend?.daily?.state === 'bajista'
    && (hyOasEnhanced?.chg5d ?? 0) > 0
    && (vixTermRatio?.ratio ?? 0) >= 0.9) {
    alerts.push({ id: 'deterioro', label: 'Deterioro confirmado', severity: 'error', date: now,
      triggers: ['Semanal bajista', 'Diario bajista', 'Amplitud: NO DATA', `HY OAS chg5D +${hyOasEnhanced?.chg5d?.toFixed(3) ?? '—'}pp`, `ratio VIX/VIX3M ${vixTermRatio?.ratio?.toFixed(3) ?? '—'}`],
      state: 'deterioro' });
  }

  // ── Score total ───────────────────────────────
  // Solo indicadores con score != null contribuyen al numerador Y al denominador.
  // STALE/MISSING/ERROR quedan completamente excluidos de ambos.
  let scoreTotal = 0, availableScore = 0;
  const scoreDetail = {};
  const MAX_POSSIBLE = 15; // curvaUSD×1 + curvaEUR×1 + lei×1 + m2×3 + credito×3 + impulso×2 + velM2×2 + reservas×1 + tipoReal×1. BBB retirado (RESEARCH ONLY). F&G excluido (LIVE_ONLY)
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
    ffr: ffrMeta || ffr,
    ffrHistory: rDff.status === 'fulfilled'
      ? rDff.value.map(o => ({ date: o.date, value: o.value }))
      : [],
    t10y2y: t10y && t2y ? { value: +(t10y.value - t2y.value).toFixed(2), date: t10y.date } : null,
    cpi:     cpiYoY    != null ? { value: cpiYoY,    date: rCpi.value?.[0]?.date }    : null,
    cpiCore: cpiCoreYoY != null ? { value: cpiCoreYoY, date: rCpiCore.value?.[0]?.date } : null,
    bbb:      ind.bbb        || null,
    hySpread: hyOasMetrics  || null,   // alias para sentimentScore (usa .value, .freshness)
    hyOas:    hyOasMetrics  || null,   // campo canónico para liquidez.js
    hyBbbGap: hyBbbGap      || null,
    breakeven1y: (() => {
      // EXPINF1YR — Fed Cleveland (mensual, no diaria → freshness ≤45d OK)
      if (rBreakeven1y.status === 'fulfilled') {
        const valid = rBreakeven1y.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) {
          const ageDays = Math.round((Date.now() - new Date(valid.date).getTime()) / 86400000);
          const freshness = ageDays <= 45 ? 'ok' : ageDays <= 60 ? 'warn' : 'stale';
          return { value: valid.value, date: valid.date, series: 'EXPINF1YR',
            label: 'Expectativa inflación 1Y — Cleveland Fed', ageDays, freshness };
        }
      }
      // Fallback: MICH (mensual → misma freshness)
      if (rMich?.status === 'fulfilled') {
        const valid = rMich.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) {
          const ageDays = Math.round((Date.now() - new Date(valid.date).getTime()) / 86400000);
          const freshness = ageDays <= 45 ? 'ok' : ageDays <= 60 ? 'warn' : 'stale';
          return { value: valid.value, date: valid.date, series: 'MICH',
            label: 'Expectativa inflación 1Y — Univ. Michigan (fallback)', ageDays, freshness };
        }
      }
      errs.push('EXPINF1YR+MICH: sin datos válidos');
      return null;
    })(),
    breakeven5y: (() => {
      // T5YIE — Breakeven TIPS 5Y (mercado)
      if (rBreakeven5y.status === 'fulfilled') {
        const valid = rBreakeven5y.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) {
          const ageDays = Math.round((Date.now() - new Date(valid.date).getTime()) / 86400000);
          const freshness = ageDays <= 7 ? 'ok' : ageDays <= 10 ? 'warn' : 'stale';
          return { value: valid.value, date: valid.date, series: 'T5YIE',
            label: 'Breakeven inflación 5Y — TIPS mercado', ageDays, freshness };
        }
      }
      // Fallback: T5YIFR (5Y forward 5Y)
      if (rBreakeven5yAlt.status === 'fulfilled') {
        const valid = rBreakeven5yAlt.value.find(o => o.value != null && !isNaN(o.value));
        if (valid) {
          const ageDays = Math.round((Date.now() - new Date(valid.date).getTime()) / 86400000);
          const freshness = ageDays <= 7 ? 'ok' : ageDays <= 10 ? 'warn' : 'stale';
          return { value: valid.value, date: valid.date, series: 'T5YIFR',
            label: 'Forward inflación 5Y5Y (fallback)', ageDays, freshness };
        }
      }
      errs.push('T5YIE+T5YIFR: sin datos válidos');
      return null;
    })(),
    vix:   rVix.status   === 'fulfilled' ? rVix.value   : null,
    wti:   rWti.status   === 'fulfilled' ? rWti.value   : null,
    brent: rBrent.status === 'fulfilled' ? rBrent.value : null,
  };
  // Riesgo contagio
  const rc = cpiYoY != null && cpiCoreYoY != null ? riesgoContagio(cpiYoY, cpiCoreYoY) : null;
  if (rBreakeven1y.status !== 'fulfilled') errs.push('T1YIE: ' + rBreakeven1y.reason?.message);
  if (rBreakeven5y.status !== 'fulfilled') errs.push('T5YIE: ' + rBreakeven5y.reason?.message);

  // Sentiment Score — Risk-On/Risk-Off con cobertura
  let sentimentScore = { raw: 0, available: 0, coverage: 0, regime: 'INSUFFICIENT DATA', contrarian: null, components: [], provisional: true };
  try {
    const sentComponents = [];
    if (ind.fearGreed?.freshness !== 'stale' && ind.fearGreed?.value != null)
      sentComponents.push({ key: 'fg',  score: ind.fearGreed.scoreSentiment ?? scFG_sent(ind.fearGreed.value),  weight: 1 });
    if (seguimiento.vix?.valid && seguimiento.vix?.aboveSMA200 != null)
      sentComponents.push({ key: 'vix', score: scVIX_sent(seguimiento.vix.aboveSMA200), weight: 1 });
    if (seguimiento.hySpread?.freshness !== 'stale' && seguimiento.hySpread?.value != null)
      sentComponents.push({ key: 'hy',  score: scHY_sent(seguimiento.hySpread.value),   weight: 1 });
    const sentRaw      = sentComponents.reduce((s, c) => s + c.score, 0);
    const sentAvail    = sentComponents.length;
    const sentCoverage = +(sentAvail / 3).toFixed(2);
    const sentRegime   = sentAvail < 2 ? 'INSUFFICIENT DATA'
      : sentRaw >= 2 ? 'Risk-On' : sentRaw >= 0 ? 'Neutral' : 'Risk-Off';
    const sentContrarian = ind.fearGreed?.value != null
      ? (ind.fearGreed.value <= 25 ? 'OPORTUNIDAD CONTRARIAN'
        : ind.fearGreed.value >= 75 ? 'PRECAUCIÓN CONTRARIAN' : 'NEUTRAL')
      : null;
    sentimentScore = { raw: sentRaw, available: sentAvail, coverage: sentCoverage,
      regime: sentRegime, contrarian: sentContrarian, components: sentComponents, provisional: true };
  } catch(e) {
    errs.push('SentimentScore error: ' + e.message);
  }

  return res.status(200).json({
    updatedAt: new Date().toISOString(),
    _version: 'macro-v2026-10-24-v5e-history',
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
      bbb:      ind.bbb,              // BBB OAS — RESEARCH ONLY desde v3.9
      hyOas:    hyOasEnhanced || null, // HY OAS con MM100/MM200/estados
      hyBbbGap: hyBbbGap    || null,  // HY–BBB Gap — calculado, sin score
    },

    // ── Fase 1: Condiciones financieras y mercado ─────────────────────────
    mercado: {
      vix:         rVix.status === 'fulfilled' ? rVix.value : null,
      vix3m:       vix3mData  || null,
      vixTermRatio: vixTermRatio || null,
      // dxy: ver condicionesFinancieras.dxy (eliminado aquí para evitar duplicado)
      sp500Trend:  sp500Trend || null,
      // Amplitud: NO DATA — pendiente de fuente robusta
      amplitud: { state: 'NO_DATA', note: 'Pendiente de fuente de breadth robusta (fase posterior)' },
    },
    condicionesFinancieras: {
      t10y:       t10y      || null,  // DGS10 nominal con freshness+chg
      t2y:        t2y       || null,  // DGS2 nominal con freshness+chg
      t10y2y:     seguimiento.t10y2y || null, // curva spread
      dfii10:     dfii10Data || null, // 10Y Real Yield TIPS (mercado)
      dxy:        dxyData    || null, // ICE US Dollar Index — única referencia
      // tipoReal (FFR−CPI) sigue en coyuntura.tipoReal — NO se mueve aquí
    },
    alerts: alerts.length ? alerts : [],

    // Todos los indicadores con score (para debug y Kelly)
    indicators: ind,
    scoreDetail,
    sentimentScore,
    errors: errs.length ? errs : undefined,
  });
}
