// /api/macro-history.js — Vercel Serverless
// Datos históricos para Timeline y Correlaciones
// La FRED API key vive SOLO aquí, nunca en el frontend

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ── Firebase Admin (para persistencia de Component Validation) ──
function getDB() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}
const CV_COLLECTION = 'risk_radar_validation';
const CV_DOC = 'component_validation_latest';
const HIST_MACRO_VERSION = 'HIST_MACRO_V1_FRED';
const RISK_RADAR_VERSION = 'RISK_RADAR_V1';
const COMPONENT_VALIDATION_METHOD_VERSION = 'COMPONENT_VALIDATION_V1';
const CV_NSIM = 5000, CV_BLOCKSIZE = 12;

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

// YoY por fecha real — para series trimestrales o irregulares (GDP, etc.)
// Busca obs exactamente 12M antes, tolerancia ±tolDays días
function yoySeriesByDate(arr, tolDays=45) {
  if (!arr || arr.length < 5) return [];
  const result = [];
  const TOL = tolDays * 24 * 3600 * 1000;
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i];
    const targetMs = new Date(cur.date).getTime() - 365 * 24 * 3600 * 1000;
    const prev = arr.slice(0, i).reverse().find(p =>
      Math.abs(new Date(p.date).getTime() - targetMs) <= TOL
    );
    if (prev && prev.value !== 0 && cur.value != null)
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


// ═══════════════════════════════════════════════════════════════════
// ETHAN Trading R-Lab V1 — Motor (fusionado en macro-history)
// type=rlab-trace | type=rlab-run | type=rlab-results
// ═══════════════════════════════════════════════════════════════════
// ── Indicadores (idénticos a backtest.js — fuente canónica) ──────
function _ema(arr, p) {
  // NOTA: llamada "sma" en UI pero es EMA. k=2/(p+1). Documentado en R-Lab V1.
  const k = 2/(p+1), out = new Array(arr.length).fill(null);
  const start = arr.findIndex(v => v != null && !isNaN(v));
  if (start < 0) return out;
  out[start] = arr[start];
  for (let i = start+1; i < arr.length; i++) {
    const v = arr[i] != null && !isNaN(arr[i]) ? arr[i] : out[i-1];
    out[i] = v * k + out[i-1] * (1-k);
  }
  return out;
}
function _macd(closes, f=12, s=26, sig=9) {
  const ef = _ema(closes,f), es = _ema(closes,s);
  const m = ef.map((v,i) => (v!=null&&es[i]!=null) ? v-es[i] : null);
  const sl = _ema(m.map(v=>v??0), sig);
  return { m, sl };
}
function _rsi(closes, p=14) {
  const out = new Array(closes.length).fill(null);
  if (closes.length < p+1) return out;
  let g=0, l=0;
  for (let i=1; i<=p; i++) { const d=closes[i]-closes[i-1]; d>0?g+=d:l-=d; }
  let ag=g/p, al=l/p;
  out[p] = al===0 ? 100 : 100-(100/(1+ag/al));
  for (let i=p+1; i<closes.length; i++) {
    const d=closes[i]-closes[i-1];
    ag=(ag*(p-1)+(d>0?d:0))/p;
    al=(al*(p-1)+(d<0?-d:0))/p;
    out[i] = al===0 ? 100 : 100-(100/(1+ag/al));
  }
  return out;
}
function _stoch(highs, lows, closes, p=14) {
  const rawK = closes.map((c,i) => {
    if (i<p-1) return null;
    const hh = Math.max(...highs.slice(i-p+1,i+1));
    const ll  = Math.min(...lows.slice(i-p+1,i+1));
    return hh===ll ? 50 : (c-ll)/(hh-ll)*100;
  });
  const k = _ema(rawK, 3);
  const d = _ema(k.map(v=>v??0), 3);
  return { k, d };
}

// ── Resample diario → semanal o mensual ─────────────────────────
function _resample(timestamps, opens, highs, lows, closes, vols, freq) {
  const groups = {};
  timestamps.forEach((t, i) => {
    const dt = new Date(t * 1000);
    let key;
    if (freq === 'W') {
      const day = dt.getDay();
      const diff = dt.getDate() - day + (day===0?-6:1);
      const mo = new Date(+dt); mo.setDate(diff);
      key = mo.toISOString().slice(0,10);
    } else {
      key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
    }
    if (!groups[key]) {
      groups[key] = { o:opens[i], h:highs[i], l:lows[i], c:closes[i], v:vols[i], lastTs:t };
    } else {
      groups[key].h = Math.max(groups[key].h, highs[i]);
      groups[key].l = Math.min(groups[key].l, lows[i]);
      groups[key].c = closes[i];
      groups[key].v += vols[i];
      groups[key].lastTs = t;  // timestamp del último día de la barra
    }
  });
  const keys = Object.keys(groups).sort();
  return {
    dates:   keys,
    opens:   keys.map(k=>groups[k].o),
    highs:   keys.map(k=>groups[k].h),
    lows:    keys.map(k=>groups[k].l),
    closes:  keys.map(k=>groups[k].c),
    vols:    keys.map(k=>groups[k].v),
    lastTs:  keys.map(k=>groups[k].lastTs),  // ts del cierre de cada barra
  };
}

// ── PIT: barras cerradas deterministas ───────────────────────────
// Para cada sesión diaria t, solo se pueden usar barras W/M cuyo
// lastTs (timestamp del último día de la barra) < t.
// Esto garantiza que nunca se usa una barra todavía abierta.
function lastClosedWeeklyBar(t, W) {
  // Buscar el índice más alto donde W.lastTs[idx] < t
  let idx = -1;
  for (let i = 0; i < W.lastTs.length; i++) {
    if (W.lastTs[i] < t) idx = i; else break;
  }
  return idx;
}
function lastClosedMonthlyBar(t, M) {
  let idx = -1;
  for (let i = 0; i < M.lastTs.length; i++) {
    if (M.lastTs[i] < t) idx = i; else break;
  }
  return idx;
}

// ── BASE_FILTER_V1 — 9 condiciones HARD ─────────────────────────
function mensualOk(mi, ind) {
  if (mi < 0) return false;
  const { m_macd, m_s89, m_s8, m_rsi, m_ema10 } = ind;
  if (m_macd.m[mi]==null || m_s89.k[mi]==null || m_s8.k[mi]==null ||
      m_rsi[mi]==null || m_ema10[mi]==null) return false;
  const macdOk = m_macd.m[mi]>0 && m_macd.m[mi]>m_macd.sl[mi];
  const s89Ok  = (m_s89.k[mi]>80 && m_s89.k[mi]>m_s89.d[mi]) || m_s89.k[mi]>92;
  const s8Ok   = m_s8.k[mi]>78;
  const rsiOk  = m_rsi[mi]>65;
  const pOk    = m_ema10[mi]!=null && ind.M.closes[mi]>m_ema10[mi];
  return macdOk && s89Ok && s8Ok && rsiOk && pOk;
}
function semanalOk(wi, ind) {
  if (wi < 0) return false;
  const { w_macd, w_s89, w_rsi, w_ema20 } = ind;
  if (w_macd.m[wi]==null || w_s89.k[wi]==null ||
      w_rsi[wi]==null || w_ema20[wi]==null) return false;
  const macdOk = w_macd.m[wi]>0 && w_macd.m[wi]>w_macd.sl[wi];
  const s89Ok  = (w_s89.k[wi]>85 && w_s89.k[wi]>w_s89.d[wi]) || w_s89.k[wi]>92;
  const rsiOk  = w_rsi[wi]>67;
  const pOk    = w_ema20[wi]!=null && ind.W.closes[wi]>w_ema20[wi];
  return macdOk && s89Ok && rsiOk && pOk;
}

// ── Señales de entrada E0–E4 ─────────────────────────────────────
// Devuelven true si la señal se activa en el día i (usando Close[i])
// La ejecución real se hace en Open[i+1]
function entrySignal(entryRule, i, ind) {
  const { closes, opens, highs, lows, timestamps,
    d_macd, d_rsi14, d_rsi5, d_ema5, d_ema10,
    W, w_ema5, w_rsi5, w_stoch5,
  } = ind;

  if (entryRule === 'E0') {
    return true; // inmediato al nacer ELIGIBLE
  }
  if (entryRule === 'E1') {
    // Rebote EMA5W: cierre semanal cruza EMA5W al alza
    const wi = lastClosedWeeklyBar(timestamps[i], ind.W);
    if (wi < 1) return false;
    const curr = W.closes[wi], prev = W.closes[wi-1];
    const ema5c = w_ema5[wi], ema5p = w_ema5[wi-1];
    return ema5c!=null && ema5p!=null && curr>ema5c && prev<=ema5p;
  }
  if (entryRule === 'E2') {
    // MACD diario cruce alcista + RSI14 >59 + MACD>0
    if (i<1) return false;
    const cross = d_macd.m[i]>d_macd.sl[i] && d_macd.m[i-1]<=d_macd.sl[i-1];
    return cross && d_rsi14[i]>59 && d_macd.m[i]>0;
  }
  if (entryRule === 'E3') {
    // RSI5 Pullback semanal: RSI5+Stoch5 semanales
    const wi = lastClosedWeeklyBar(timestamps[i], ind.W);
    if (wi < 2) return false;
    return (
      (w_rsi5[wi-1]<50 || w_rsi5[wi-2]<50) &&
      w_stoch5.k[wi-1]<w_stoch5.k[wi-2] &&
      w_rsi5[wi]>60 && w_rsi5[wi-1]<=60 &&
      w_stoch5.k[wi]>w_stoch5.k[wi-1]
    );
  }
  if (entryRule === 'E4') {
    // RSI5 Pullback diario: zona 38-42 + rebote + fortaleza previa
    if (i < 5) return false;
    let estuvoFuerte = false;
    for (let j=i-10; j<i; j++) { if (j>=0 && d_rsi5[j]>60) { estuvoFuerte=true; break; } }
    return estuvoFuerte &&
      d_rsi5[i-1]>=38 && d_rsi5[i-1]<=42 &&
      d_rsi5[i]>d_rsi5[i-1] && d_rsi5[i-1]<d_rsi5[i-2];
  }
  return false;
}

// ── Señales de salida X1/X2 ──────────────────────────────────────
function exitSignal(exitRule, i, ind) {
  const { closes, timestamps, d_ema10, W, w_ema10 } = ind;
  if (exitRule === 'X1') {
    // Close diario < EMA10D
    return d_ema10[i]!=null && closes[i]<d_ema10[i];
  }
  if (exitRule === 'X2') {
    // Close semanal < EMA10W (solo válido en último día de semana cerrada)
    const wi = lastClosedWeeklyBar(timestamps[i], ind.W);
    if (wi < 0) return false;
    return w_ema10[wi]!=null && W.closes[wi]<w_ema10[wi];
  }
  return false;
}

// ── Motor principal por ticker ────────────────────────────────────
function runTicker(ticker, raw, traceMode=false) {
  const { timestamps, opens, highs, lows, closes, vols } = raw;
  const n = closes.length;
  const WARMUP = 120; // velas diarias mínimas para inicializar indicadores

  const W = _resample(timestamps, opens, highs, lows, closes, vols, 'W');
  const M = _resample(timestamps, opens, highs, lows, closes, vols, 'M');

  // Indicadores — todos sobre series completas (no look-ahead en cálculo,
  // el PIT se garantiza en el acceso mediante lastClosedBar)
  const ind = {
    W, M, closes, opens, highs, lows, timestamps, vols,
    // MENSUAL
    m_macd:  _macd(M.closes),
    m_s89:   _stoch(M.highs, M.lows, M.closes, 89),
    m_s8:    _stoch(M.highs, M.lows, M.closes, 8),
    m_rsi:   _rsi(M.closes, 14),
    m_ema10: _ema(M.closes, 10),      // EMA10 mensual (UI la llama SMA10)
    // SEMANAL
    w_macd:  _macd(W.closes),
    w_s89:   _stoch(W.highs, W.lows, W.closes, 89),
    w_rsi:   _rsi(W.closes, 14),
    w_ema20: _ema(W.closes, 20),      // EMA20 semanal (UI la llama SMA20)
    w_ema10: _ema(W.closes, 10),
    w_ema5:  _ema(W.closes, 5),
    w_rsi5:  _rsi(W.closes, 5),
    w_stoch5:_stoch(W.highs, W.lows, W.closes, 5),
    // DIARIO
    d_macd:  _macd(closes),
    d_rsi14: _rsi(closes, 14),
    d_rsi5:  _rsi(closes, 5),
    d_ema5:  _ema(closes, 5),
    d_ema10: _ema(closes, 10),
    d_ema20: _ema(closes, 20),
  };

  const ENTRY_RULES = ['E0','E1','E2','E3','E4'];
  const EXIT_RULES  = ['X1','X2'];
  const IS_OOS_SPLIT = '2021-01-01'; // fecha de corte IS/OOS

  const events = [];          // ventanas de elegibilidad
  const eventEntries = [];    // resultado entry rule sobre cada evento
  const trades = [];          // trades ejecutados (triggered=true)
  const traceLog = [];        // solo en traceMode

  let currentEvent = null;
  let prevEligible = false;

  for (let i = WARMUP; i < n; i++) {
    const ts = timestamps[i];
    const dateStr = new Date(ts*1000).toISOString().slice(0,10);
    const isOOS = dateStr >= IS_OOS_SPLIT;

    // PIT determinista: solo barras cerradas antes de ts
    const mi = lastClosedMonthlyBar(ts, M);
    const wi = lastClosedWeeklyBar(ts, W);

    const mOk = mensualOk(mi, ind);
    const wOk = semanalOk(wi, ind);
    const eligible = mOk && wOk;

    // ── Gestión de eventos de elegibilidad ──────────────────────
    if (eligible && !prevEligible) {
      // Nace nuevo evento
      currentEvent = {
        id: `${ticker}_${dateStr}`,
        ticker, date_start: dateStr, date_end: null,
        price_at_start: opens[i],   // precio al que se podría entrar
        mi_at_start: mi, wi_at_start: wi,
        filter_snapshot: {
          m_macd: +ind.m_macd.m[mi]?.toFixed(3), m_s89k: +ind.m_s89.k[mi]?.toFixed(1),
          m_s8k: +ind.m_s8.k[mi]?.toFixed(1), m_rsi: +ind.m_rsi[mi]?.toFixed(1),
          m_ema10: +ind.m_ema10[mi]?.toFixed(2),
          w_macd: +ind.w_macd.m[wi]?.toFixed(3), w_s89k: +ind.w_s89.k[wi]?.toFixed(1),
          w_rsi: +ind.w_rsi[wi]?.toFixed(1), w_ema20: +ind.w_ema20[wi]?.toFixed(2),
        },
        isOOS,
        // Estado por entry rule: null=pendiente, true=triggered, false=expirado
        entryState: Object.fromEntries(ENTRY_RULES.map(e=>[e, null])),
        // Para cada trade abierto: {entryRule, exitRule, entryDate, entryPrice, entryIdx, maxHigh, minLow}
        openTrades: {},
        dayCount: 0,
      };
      events.push(currentEvent);
    }

    if (!eligible && prevEligible && currentEvent) {
      // Evento expira
      currentEvent.date_end = dateStr;
      // Marcar como expiradas las entry rules que no se activaron
      for (const er of ENTRY_RULES) {
        if (currentEvent.entryState[er] === null) {
          eventEntries.push({
            event_id: currentEvent.id, ticker, entry_rule: er,
            triggered: false, expired_without_entry: true,
            days_to_trigger: null, trigger_date: null,
            isOOS,
          });
        }
      }
      // Cerrar trades abiertos al precio de apertura del día que rompió elegibilidad
      for (const [key, ot] of Object.entries(currentEvent.openTrades)) {
        const exitPrice = opens[i]; // Open(t+1) donde t=día de rotura
        _closeTrade(trades, ot, exitPrice, dateStr, i, ot.entryIdx, closes, 'expired', ind);
      }
      currentEvent = null;
    }

    // ── Procesar señales de entrada y salida dentro del evento ──
    if (eligible && currentEvent) {
      currentEvent.dayCount++;

      for (const er of ENTRY_RULES) {
        // Solo procesar si aún no se activó
        if (currentEvent.entryState[er] !== null) continue;

        const sig = entrySignal(er, i, ind);
        if (sig && i+1 < n) {
          // Señal Close(i) → ejecución Open(i+1)
          const entryPrice = opens[i+1];
          const entryDate  = new Date(timestamps[i+1]*1000).toISOString().slice(0,10);
          currentEvent.entryState[er] = true;

          eventEntries.push({
            event_id: currentEvent.id, ticker, entry_rule: er,
            triggered: true, expired_without_entry: false,
            days_to_trigger: currentEvent.dayCount,
            trigger_date: dateStr,      // día que generó la señal
            entry_date: entryDate,      // día de ejecución real
            isOOS,
          });

          // Abrir un trade por cada exit rule
          for (const xr of EXIT_RULES) {
            const tradeKey = `${er}_${xr}`;
            if (!currentEvent.openTrades[tradeKey]) {
              currentEvent.openTrades[tradeKey] = {
                event_id: currentEvent.id, ticker,
                entry_rule: er, exit_rule: xr,
                entry_date: entryDate, entry_price: entryPrice,
                entry_idx: i+1,
                signal_date: dateStr,
                max_high: entryPrice, min_low: entryPrice,
                isOOS,
              };
            }
          }
        }
      }

      // Procesar salidas para trades abiertos
      for (const [key, ot] of Object.entries(currentEvent.openTrades)) {
        const xr = ot.exit_rule;
        // Actualizar MAE/MFE
        ot.max_high = Math.max(ot.max_high, highs[i]);
        ot.min_low  = Math.min(ot.min_low, lows[i]);

        const exitSig = exitSignal(xr, i, ind);
        if (exitSig && i+1 < n) {
          const exitPrice = opens[i+1];
          const exitDate  = new Date(timestamps[i+1]*1000).toISOString().slice(0,10);
          _closeTrade(trades, ot, exitPrice, exitDate, i+1, i, closes, 'exit_rule', ind);
          delete currentEvent.openTrades[key];
        }
      }

      if (traceMode && currentEvent.dayCount <= 30) {
        traceLog.push({
          date: dateStr, i,
          mi, wi,
          mOk, wOk, eligible,
          close: +closes[i].toFixed(2),
          open_next: i+1<n ? +opens[i+1].toFixed(2) : null,
          m_macd: +ind.m_macd.m[mi]?.toFixed(3),
          m_s89k: +ind.m_s89.k[mi]?.toFixed(1),
          m_s8k: +ind.m_s8.k[mi]?.toFixed(1),
          m_rsi: +ind.m_rsi[mi]?.toFixed(1),
          w_s89k: +ind.w_s89.k[wi]?.toFixed(1),
          w_rsi: +ind.w_rsi[wi]?.toFixed(1),
          d_rsi14: +ind.d_rsi14[i]?.toFixed(1),
        });
      }
    }

    prevEligible = eligible;
  }

  // Cerrar evento abierto al final de la serie
  if (currentEvent) {
    currentEvent.date_end = new Date(timestamps[n-1]*1000).toISOString().slice(0,10);
    for (const er of ENTRY_RULES) {
      if (currentEvent.entryState[er] === null) {
        eventEntries.push({
          event_id: currentEvent.id, ticker, entry_rule: er,
          triggered: false, expired_without_entry: false,
          days_to_trigger: null, trigger_date: null,
          expired_reason: 'end_of_data', isOOS: false,
        });
      }
    }
    for (const [key, ot] of Object.entries(currentEvent.openTrades)) {
      _closeTrade(trades, ot, closes[n-1],
        new Date(timestamps[n-1]*1000).toISOString().slice(0,10),
        n-1, ot.entry_idx, closes, 'end_of_data', ind);
    }
  }

  return { events, eventEntries, trades, traceLog };
}

function _closeTrade(trades, ot, exitPrice, exitDate, exitIdx, signalIdx, closes, exitReason, ind) {
  const bars   = exitIdx - ot.entry_idx;
  const pnlPct = (exitPrice - ot.entry_price) / ot.entry_price * 100;
  const mfePct = (ot.max_high - ot.entry_price) / ot.entry_price * 100;
  const maePct = (ot.min_low  - ot.entry_price) / ot.entry_price * 100;
  const capturePct = mfePct > 0 ? (pnlPct / mfePct * 100) : null;
  const givebackPct = mfePct > 0 ? mfePct - pnlPct : null;

  trades.push({
    event_id: ot.event_id, ticker: ot.ticker,
    entry_rule: ot.entry_rule, exit_rule: ot.exit_rule,
    signal_date: ot.signal_date,
    entry_date: ot.entry_date, entry_price: +ot.entry_price.toFixed(4),
    exit_date: exitDate, exit_price: +exitPrice.toFixed(4),
    exit_reason: exitReason,
    pnl_pct:  +pnlPct.toFixed(3),
    mfe_pct:  +mfePct.toFixed(3),
    mae_pct:  +maePct.toFixed(3),
    capture_pct: capturePct!=null ? +capturePct.toFixed(1) : null,
    giveback_pct: givebackPct!=null ? +givebackPct.toFixed(3) : null,
    bars_in_trade: bars,
    is_oos: ot.isOOS,
  });
}

// ── Agregados por combinación Entry×Exit ──────────────────────────
function _aggregate(trades, eventEntries, isOOS) {
  const results = {};
  const filteredTrades = trades.filter(t => t.is_oos === isOOS);
  const filteredEntries = eventEntries.filter(e => e.isOOS === isOOS);

  for (const er of ['E0','E1','E2','E3','E4']) {
    for (const xr of ['X1','X2']) {
      const key = `${er}_${xr}`;
      const tt = filteredTrades.filter(t => t.entry_rule===er && t.exit_rule===xr);
      const ee = filteredEntries.filter(e => e.entry_rule===er);
      const n_events_unique = new Set(ee.map(e=>e.event_id)).size;
      const triggered = ee.filter(e=>e.triggered);
      const wins = tt.filter(t=>t.pnl_pct>0);
      const pnls = tt.map(t=>t.pnl_pct).sort((a,b)=>a-b);
      const mfes = tt.map(t=>t.mfe_pct);
      const caps = tt.map(t=>t.capture_pct).filter(v=>v!=null);
      const bars = tt.map(t=>t.bars_in_trade);
      const daysToTrig = triggered.map(e=>e.days_to_trigger).filter(v=>v!=null);

      const grossWins  = wins.reduce((s,t)=>s+t.pnl_pct,0);
      const grossLoss  = tt.filter(t=>t.pnl_pct<=0).reduce((s,t)=>s+Math.abs(t.pnl_pct),0);

      results[key] = {
        entry_rule: er, exit_rule: xr, is_oos: isOOS,
        n_events:    n_events_unique,
        n_triggered: triggered.length,
        trigger_rate: n_events_unique ? +(triggered.length/n_events_unique*100).toFixed(1) : null,
        n_expired_without_entry: ee.filter(e=>e.expired_without_entry).length,
        n_trades: tt.length,
        win_rate: tt.length ? +(wins.length/tt.length*100).toFixed(1) : null,
        expectancy: tt.length ? +(pnls.reduce((s,v)=>s+v,0)/tt.length).toFixed(3) : null,
        profit_factor: grossLoss>0 ? +(grossWins/grossLoss).toFixed(3) : null,
        mean_ret:   pnls.length ? +(pnls.reduce((s,v)=>s+v,0)/pnls.length).toFixed(3) : null,
        median_ret: pnls.length ? +pnls[Math.floor(pnls.length/2)].toFixed(3) : null,
        mfe_mean:   mfes.length ? +(mfes.reduce((s,v)=>s+v,0)/mfes.length).toFixed(3) : null,
        capture_mean: caps.length ? +(caps.reduce((s,v)=>s+v,0)/caps.length).toFixed(1) : null,
        duration_mean:   bars.length ? Math.round(bars.reduce((s,v)=>s+v,0)/bars.length) : null,
        duration_median: bars.length ? bars.sort((a,b)=>a-b)[Math.floor(bars.length/2)] : null,
        days_to_trigger_mean: daysToTrig.length ? Math.round(daysToTrig.reduce((s,v)=>s+v,0)/daysToTrig.length) : null,
      };
    }
  }
  return results;
}

// ── Fetch Yahoo Finance ───────────────────────────────────────────
const RLAB_PROXIES = [
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];
async function fetchOHLCV(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=10y&events=history&includePrePost=false`;
  let lastErr;
  for (const fn of RLAB_PROXIES) {
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 15000);
      const r = await fetch(fn(url), { signal: ctrl.signal });
      if (!r.ok) continue;
      const j = JSON.parse(await r.text());
      const res = j?.chart?.result?.[0];
      if (!res) continue;
      const q = res.indicators.quote[0];
      return {
        timestamps: res.timestamp,
        opens: q.open, highs: q.high, lows: q.low,
        closes: q.close, vols: q.volume,
      };
    } catch(e) { lastErr=e; }
  }
  throw lastErr || new Error('Sin datos OHLCV');
}

// ── S&P 100 — universo de validación ─────────────────────────────
const SP100 = [
  'AAPL','MSFT','NVDA','AMZN','GOOGL','META','TSLA','BRK-B','JPM','UNH',
  'XOM','JNJ','V','PG','MA','HD','CVX','MRK','ABBV','PEP',
  'KO','AVGO','COST','LLY','WMT','TMO','DIS','CSCO','ABT','DHR',
  'MCD','ACN','VZ','ADBE','WFC','CRM','TXN','NKE','PM','NEE',
  'RTX','AMD','LIN','HON','BMY','AMGN','ORCL','SBUX','BA','GE',
  'INTC','CAT','QCOM','LOW','IBM','MMM','UPS','T','GS','AXP',
  'SPGI','BLK','CVS','MS','SCHW','DE','MDLZ','ELV','CI','INTU',
  'GILD','ISRG','ZTS','SYK','CB','PLD','C','SO','MO','DUK',
  'TGT','CL','BSX','USB','PNC','MMC','EOG','EMR','MCO','AON',
  'REGN','NSC','ETN','ADP','APD','ITW','PSA','EW','FCX','OXY',
];

export default async function handler(req, res) {
  const type = req.query.type || 'all';

  // ── ETHAN Trading R-Lab ────────────────────────────────────────
  if (type === 'rlab-trace' || type === 'rlab-run' || type === 'rlab-results') {
  
  const traceMode = trace === 'true';

  // ── TRACE mode: 1 ticker, log día a día ──────────────────────
  if (type === 'rlab-trace' && ticker) {
    try {
      const raw = await fetchOHLCV(ticker.toUpperCase());
      const result = runTicker(ticker.toUpperCase(), raw, true);
      return res.status(200).json({
        ticker: ticker.toUpperCase(),
        meta: {
          n_daily: raw.closes.length,
          n_events: result.events.length,
          n_event_entries: result.eventEntries.length,
          n_trades: result.trades.length,
          universe: 'TRACE_MODE',
          survivorship_bias: true,
          research_status: 'PIPELINE_VALIDATION',
          note: 'EMA (no SMA) para m_ema10/w_ema20/w_ema5. E2 usa RSI14>59.',
        },
        events: result.events.slice(0, 10),
        eventEntries: result.eventEntries.slice(0, 20),
        trades: result.trades.slice(0, 20),
        traceLog: result.traceLog,
      });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── RUN mode: S&P100 por lotes ────────────────────────────────
  if (type === 'rlab-run') {
    const batchStart = parseInt(req.query.start||'0');
    const batchSize  = parseInt(req.query.size||'15');
    const runId = req.query.run_id || `rlab_${Date.now()}`;
    const batch = SP100.slice(batchStart, batchStart + batchSize);

    const allEvents = [], allEntries = [], allTrades = [], errors = [];

    for (const tk of batch) {
      try {
        await new Promise(r => setTimeout(r, 150)); // throttle Yahoo
        const raw = await fetchOHLCV(tk);
        const { events, eventEntries, trades } = runTicker(tk, raw, false);
        allEvents.push(...events);
        allEntries.push(...eventEntries);
        allTrades.push(...trades);
      } catch(e) {
        errors.push({ ticker: tk, error: e.message });
      }
    }

    // Persistir en Firestore
    let saved = false;
    try {
      const db = getDB();
      const batch_ref = db.batch();
      for (const ev of allEvents) {
        batch_ref.set(db.collection('rlab_events').doc(ev.id), ev);
      }
      for (const ee of allEntries) {
        batch_ref.set(db.collection('rlab_event_entries')
          .doc(`${ee.event_id}_${ee.entry_rule}`), ee);
      }
      for (const tr of allTrades) {
        const trId = `${tr.event_id}_${tr.entry_rule}_${tr.exit_rule}_${tr.entry_date}`;
        batch_ref.set(db.collection('rlab_trades').doc(trId), tr);
      }
      await batch_ref.commit();
      saved = true;
    } catch(e) { errors.push({ firestore: e.message }); }

    // Agregados del lote
    const aggIS  = _aggregate(allTrades, allEntries, false);
    const aggOOS = _aggregate(allTrades, allEntries, true);

    return res.status(200).json({
      run_id: runId,
      batch: { start: batchStart, size: batch.length, tickers: batch },
      meta: {
        universe: 'CURRENT_SP100',
        survivorship_bias: true,
        research_status: 'PIPELINE_VALIDATION',
        is_oos_split: '2021-01-01',
        note: 'EMA (no SMA) para filtros. E2 RSI14>59. Conv: Close(t)→Open(t+1).',
      },
      summary: {
        n_events: allEvents.length,
        n_event_entries: allEntries.length,
        n_trades: allTrades.length,
        n_errors: errors.length,
        saved_to_firestore: saved,
      },
      aggregates_IS:  aggIS,
      aggregates_OOS: aggOOS,
      errors: errors.length ? errors : undefined,
    });
  }

  // ── RESULTS mode: leer agregados de Firestore ─────────────────
  if (type === 'rlab-results') {
    try {
      const db = getDB();
      const tradesSnap = await db.collection('rlab_trades').limit(5000).get();
      const entriesSnap = await db.collection('rlab_event_entries').limit(10000).get();
      const trades  = tradesSnap.docs.map(d=>d.data());
      const entries = entriesSnap.docs.map(d=>d.data());
      const aggIS   = _aggregate(trades, entries, false);
      const aggOOS  = _aggregate(trades, entries, true);
      return res.status(200).json({
        n_trades: trades.length, n_entries: entries.length,
        aggregates_IS: aggIS, aggregates_OOS: aggOOS,
      });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  
  }

 // 'timeline' | 'correlaciones' | 'radar' | 'all' | 'blockvalidation' | 'componentvalidation' | 'componentvalidation-recompute'

  // ── COMPONENT VALIDATION — lectura rápida del snapshot persistido ──
  // NO recalcula nada aquí. El cálculo (5.000 sims/indicador) solo corre
  // vía type=componentvalidation-recompute (cron mensual, ver vercel.json).
  // No necesita FRED_API_KEY ni el fetch histórico: por eso vive antes de todo eso.
  if (type === 'componentvalidation') {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const db = getDB();
      const snap = await db.collection(CV_COLLECTION).doc(CV_DOC).get();
      if (!snap.exists) {
        return res.status(200).json({ notComputedYet: true, componentValidation: {}, componentMatrix: [] });
      }
      return res.status(200).json(snap.data());
    } catch (e) {
      // Firestore no disponible (credenciales no configuradas) — degradación controlada
      // El cron mensual (componentvalidation-recompute) persiste el snapshot cuando Firestore esté disponible
      return res.status(200).json({
        notComputedYet: true,
        componentValidation: {},
        componentMatrix: [],
        note: 'Firestore no disponible. El snapshot se generará cuando se configuren las credenciales. Ejecutar ?type=componentvalidation-recompute para calcular.',
      });
    }
  }

  res.setHeader('Cache-Control', 's-maxage=3600,stale-while-revalidate=7200');
  const key = process.env.FRED_API_KEY;
  if (!key) return res.status(500).json({ error: 'FRED_API_KEY no configurada' });

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
  // SP500: intentar snapshot Firestore primero, luego construir desde tramos FRED
  let spFirestore = null;
  try {
    const db = getDB();
    const snap = await db.collection('ethan_market_data').doc('sp500_monthly_v1').get();
    if (snap.exists && snap.data()?.data) {
      const d = snap.data().data;
      spFirestore = Object.entries(d)
        .map(([date, value]) => ({ date: date+'-01', value }))
        .sort((a,b) => a.date.localeCompare(b.date));
    }
  } catch(_) { /* Firestore no disponible — usar fallback FRED */ }

  const spChunkA = rSp.status === 'fulfilled' && rSp.value?.length > 0 ? rSp.value : null;
  const spChunkB = rNq.status === 'fulfilled' && rNq.value?.length > 0 ? rNq.value : null;
  const spChunkC = rRu.status === 'fulfilled' && rRu.value?.length > 0 ? rRu.value : null;
  const sp = spFirestore && spFirestore.length > 500
    ? spFirestore
    : [spChunkA, spChunkB, spChunkC]
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
  const totllYoY = yoySeriesByDate(totll, 7);   // semanal → tolerancia ±7d (i-12 = ~3M → incorrecto)
  const gdpYoY   = yoySeriesByDate(gdp, 45);    // trimestral → tolerancia ±45d
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

  // ── BLOCK VALIDATION REPORT (type=blockvalidation, live) + COMPONENT VALIDATION RECOMPUTE (type=componentvalidation-recompute, solo cron) ──
  // blockvalidation sigue en vivo (operativo, ~8-9s, dentro del límite).
  // componentvalidation-recompute es pesado (13 indicadores × bootstrap 5.000 sims) y
  // NUNCA lo dispara el frontend — solo el cron mensual (ver vercel.json), autenticado
  // con CRON_SECRET. El resultado se persiste en Firestore y el frontend solo lee ese
  // snapshot (rama type==='componentvalidation' más arriba, antes del fetch a FRED).
  if (type === 'blockvalidation' || type === 'componentvalidation-recompute') {
    if (type === 'componentvalidation-recompute') {
      const cronSecret = process.env.CRON_SECRET;
      const authHeader = req.headers?.['authorization'];
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized — componentvalidation-recompute es solo para el cron' });
      }
    }
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
    if (type === 'blockvalidation')
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
    // ── COMPONENT VALIDATION — mismo stress test, a nivel de indicador individual ──
    // RISK_RADAR_V1 permanece FROZEN. No se recalibran thresholds ni scores aquí.
    const IND_BLOCK = {};
    for (const [bN, bD] of Object.entries(BV_BL)) for (const id of bD.inds) IND_BLOCK[id] = bN;

    const cmpV = {};
    const IND_NOTES = {
      hy: 'Fuente y metodología separadas de BBB (BAMLH0A0HYM2, mensual).',
      bbb: 'Fuente y metodología separadas de HY (BAMLC0A4CBBB).',
      vix: 'Histórico desde 1990 (VIXCLS). Fear & Greed queda LIVE_ONLY, sin serie histórica — no incluido aquí.',
      cpiHeadline: 'YoY por fecha real (misma transformación que módulo Inflación, CPIAUCSL).',
      cpiCore: 'YoY por fecha real (misma transformación que módulo Inflación, CPILFESL).',
      reservas: 'STRUCTURAL_REVIEW — nivel nominal no estacionario entre regímenes QE/QT.',
    };
    // Categoría base para "Propuesta V2" (solo informativo — no se implementa V2 aquí)
    const V2_BASE = {
      curvaUSD:'MACRO REGIME', lei:'MACRO REGIME', m2usa:'MACRO REGIME', impulso:'MACRO REGIME',
      velM2:'MACRO REGIME', creditoVsPib:'MACRO REGIME', tipoReal:'MACRO REGIME', reservas:'MACRO REGIME',
      cpiHeadline:'MACRO REGIME', cpiCore:'MACRO REGIME',
      bbb:'MARKET RISK', hy:'MARKET RISK', vix:'MARKET RISK',
    };

    if (type === 'componentvalidation-recompute')
    for (const id of Object.keys(IND_G)) {
      const monthly = [];
      for (const m of histMacroV1) { if (!m.valid) continue; const sc = IND_G[id]?.(m); if (sc != null) monthly.push({ ym: m.month, sc }); }

      const p6=[],p12=[],pDD6=[],pDD12=[],pBin=[],pDD10=[],pDD15=[];
      for (const d of monthly) {
        const r6=fm6v.get(d.ym), r12=fm12v.get(d.ym), dd6=bvDD(d.ym,6), dd12=bvDD(d.ym,12);
        if (r6!=null) p6.push([d.ym,d.sc,r6]);
        if (r12!=null) { p12.push([d.ym,d.sc,r12]); pBin.push([d.ym,d.sc,r12>0?1:0]); }
        if (dd6!=null) pDD6.push([d.ym,d.sc,dd6]);
        if (dd12!=null) { pDD12.push([d.ym,d.sc,dd12]); pDD10.push([d.ym,d.sc,dd12<-10?1:0]); pDD15.push([d.ym,d.sc,dd12<-15?1:0]); }
      }
      const sp = p => bvSp(p.map(q=>q[1]), p.map(q=>q[2]));
      const corr = { spR6: sp(p6), spR12: sp(p12), spDD6: sp(pDD6), spDD12: sp(pDD12), spBin12: sp(pBin), spDD10: sp(pDD10), spDD15: sp(pDD15) };

      const btTarget = pDD12.length >= 15 ? pDD12 : pBin;
      const boot    = bvBoot(btTarget.map(p=>[p[1],p[2]]));
      const bootBin = bvBoot(pBin.map(p=>[p[1],p[2]]));
      const noOvDD  = bvNO(pDD12), noOvBin = bvNO(pBin);

      // Distribución por score real del indicador — Score|N|Med+6M|Med+12M|%Pos+12M|MedDD+6M|MedDD+12M|P(DD>10%)|P(DD>15%)|VaR95|CVaR95
      // N<10 → LOW N (bvSt ya lo marca vía .lowN), no se clasifica como señal robusta.
      const byScore = {};
      const byScoreGroups = {};
      for (const d of monthly) { const k = d.sc>=0?'+'+d.sc:String(d.sc); (byScoreGroups[k] ||= []).push(d.ym); }
      for (const [k, ms] of Object.entries(byScoreGroups)) byScore[k] = bvSt(ms);

      // Estabilidad temporal Early/Mid/Recent (sobre retorno +6M, igual que en Block Validation)
      const chrono = [...p6].sort((a,b)=>a[0].localeCompare(b[0]));
      const bSzT = Math.floor(chrono.length/3);
      const temp = ['Early','Mid','Recent'].map((label,i) => {
        const bl = chrono.slice(i*bSzT, i===2?chrono.length:(i+1)*bSzT);
        const res = bvSp(bl.map(p=>p[1]), bl.map(p=>p[2]));
        return { label, n: bl.length, first: bl[0]?.[0], last: bl[bl.length-1]?.[0], rho: res?.rho ?? null, p: res?.p ?? null, ci95: res?.ci95 ?? null };
      });
      const signs  = temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));
      const regDep = signs.length>=2 && signs.some(s=>s!==signs[0]);

      // Coherencia de signo económico: por convención RISK_RADAR_V1, score alto = estado
      // más favorable → se espera ρ>0 con retorno y con DD (DD menos negativo = mayor valor),
      // y ρ>0 con binario positivo. Exigimos esto además de significancia para ROBUST/INDICATIVE
      // — así no se clasifica por p-value solo, tal como pide el spec.
      const dirVotes = [corr.spR12, corr.spDD12, corr.spBin12]
        .filter(c => c?.p != null && c.p < 0.3)
        .map(c => Math.sign(c.rho));
      const signCoherent = dirVotes.length > 0 && dirVotes.filter(s=>s>0).length >= dirVotes.filter(s=>s<0).length;

      const mainN     = Math.max(p12.length, pDD12.length);
      const hasRobust = signCoherent && ((boot?.excludes0) || (noOvDD?.rho!=null && noOvDD?.ci95 && ((noOvDD.rho<0 && noOvDD.ci95[1]<0)||(noOvDD.rho>0 && noOvDD.ci95[0]>0))));
      const indicative = signCoherent && ((boot?.pBoot!=null && boot.pBoot<0.1) || (corr.spDD12?.p!=null && corr.spDD12.p<0.1) || (corr.spBin12?.p!=null && corr.spBin12.p<0.1));
      // Clasificación: N + estabilidad temporal + bootstrap + magnitud/signo económico — no solo p<0.05
      const classification = mainN<15 ? 'INSUFFICIENT DATA'
        : regDep ? 'REGIME DEPENDENT'
        : hasRobust ? 'ROBUST'
        : indicative ? 'INDICATIVE'
        : 'NO SIGNAL';

      // Propuesta V2 — solo informativo, no se implementa aquí
      const proposalV2 = (classification==='INSUFFICIENT DATA' || classification==='NO SIGNAL') ? 'DROP CANDIDATE'
        : classification==='REGIME DEPENDENT' ? 'REVIEW'
        : (V2_BASE[id] || 'REVIEW');

      cmpV[id] = { block: IND_BLOCK[id]||'—', note: IND_NOTES[id]||undefined, n: monthly.length, nWith12m: p12.length, byScore, corr, boot, bootBin, noOvDD, noOvBin, temp, regDep, signCoherent, classification, proposalV2 };
    }

    // Matriz final: Indicador | Bloque | N | Return signal | Downside signal | Temporal stability | Bootstrap | Classification | Propuesta V2
    let componentMatrix = [];
    if (type === 'componentvalidation-recompute') {
      componentMatrix = Object.entries(cmpV).map(([id,v]) => ({
        id, block: v.block, n: v.nWith12m,
        returnSignal:    v.corr.spR12?.p!=null   ? (v.corr.spR12.p<0.05?'SIG':v.corr.spR12.p<0.15?'WEAK':'NONE')   : '—',
        downsideSignal:  v.corr.spDD12?.p!=null  ? (v.corr.spDD12.p<0.05?'SIG':v.corr.spDD12.p<0.15?'WEAK':'NONE') : '—',
        temporalStability: v.regDep ? 'UNSTABLE' : 'STABLE',
        bootstrap: v.boot?.excludes0 ? 'EXCLUDES 0' : v.boot?.pBoot!=null ? `p=${v.boot.pBoot}` : '—',
        classification: v.classification,
        proposalV2: v.proposalV2,
      }));
    }

    if (type === 'componentvalidation-recompute') {
      // dataThrough = último mes con dato válido en histMacroV1
      const lastValidMonth = [...histMacroV1].reverse().find(m => m.valid)?.month || null;
      const snapshot = {
        title: 'RISK_RADAR_V1 — COMPONENT VALIDATION REPORT',
        frozen: 'RISK_RADAR_V1 permanece FROZEN — no se han modificado thresholds, signos, pesos ni agregaciones.',
        updatedAt: new Date().toISOString(),
        calculatedAt: new Date().toISOString(),
        dataThrough: lastValidMonth,
        histMacroVersion: HIST_MACRO_VERSION,
        riskRadarVersion: RISK_RADAR_VERSION,
        methodologyVersion: COMPONENT_VALIDATION_METHOD_VERSION,
        nSim: CV_NSIM,
        blockSize: CV_BLOCKSIZE,
        componentValidation: cmpV,
        componentMatrix,
        errors: errs.length ? errs : undefined,
      };
      // HARD RULE: si algo de lo anterior ha fallado catastróficamente, ni siquiera
      // llegamos aquí (el handler habría devuelto 500 antes) — así que si llegamos
      // a este punto el cálculo es completo. Solo entonces escribimos en Firestore.
      // Si la propia escritura falla, NO tocamos el snapshot anterior.
      try {
        const db = getDB();
        await db.collection(CV_COLLECTION).doc(CV_DOC).set(snapshot);
        return res.status(200).json({ status: 'persisted', ...snapshot });
      } catch (e) {
        return res.status(500).json({ status: 'compute_ok_but_persist_failed', error: e.message, previousSnapshotPreserved: true });
      }
    }
    return res.status(200).json({updatedAt:new Date().toISOString(),blockValidation:bVal,summary:Object.fromEntries(Object.entries(bVal).map(([k,v])=>[k,{verdict:v.verdict,n:v.n,regDep:v.regDep}])),errors:errs.length?errs:undefined});
  }


  // ── DOWNSIDE COMPONENT DEEP DIVE (type=downsidedive) ──────────
  if (type === 'downsidedive') {
    const dd_fm3=new Map(),dd_fm6=new Map(),dd_fm12=new Map();
    for(const[ym] of spMap){[[3,dd_fm3],[6,dd_fm6],[12,dd_fm12]].forEach(([h,m])=>{const t=new Date(ym+'-01');t.setMonth(t.getMonth()+h);const ty=t.toISOString().slice(0,7),fr=spMap.get(ym),to=spMap.get(ty);if(fr&&to)m.set(ym,+((to/fr-1)*100).toFixed(3));});}
    function dd_maxDD(fromYM,months){const fr=spMap.get(fromYM);if(!fr)return null;let pk=fr,mx=0;for(let i=1;i<=months;i++){const t=new Date(fromYM+'-01');t.setMonth(t.getMonth()+i);const v=spMap.get(t.toISOString().slice(0,7));if(!v)continue;if(v>pk)pk=v;const d=(v-pk)/pk*100;if(d<mx)mx=d;}return+mx.toFixed(3);}
    function dd_stats(months){const r3=months.map(m=>dd_fm3.get(m)).filter(v=>v!=null),r6=months.map(m=>dd_fm6.get(m)).filter(v=>v!=null),r12=months.map(m=>dd_fm12.get(m)).filter(v=>v!=null);const dd6=months.map(m=>dd_maxDD(m,6)).filter(v=>v!=null),dd12=months.map(m=>dd_maxDD(m,12)).filter(v=>v!=null);const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return+s[Math.floor(s.length/2)].toFixed(2);};const pDD=(arr,thr)=>arr.length?+(arr.filter(d=>d<thr).length/arr.length*100).toFixed(1):null;return{n:months.length,retMed3:med(r3),retMed6:med(r6),retMed12:med(r12),pctPos6:r6.length?+(r6.filter(v=>v>0).length/r6.length*100).toFixed(1):null,pctPos12:r12.length?+(r12.filter(v=>v>0).length/r12.length*100).toFixed(1):null,medDD6:med(dd6),medDD12:med(dd12),pDD5_12:pDD(dd12,-5),pDD10_12:pDD(dd12,-10),pDD15_12:pDD(dd12,-15),pDD20_12:pDD(dd12,-20),var95_12:r12.length?(()=>{const s=[...r12].sort((x,y)=>x-y);return+s[Math.max(0,Math.floor(r12.length*0.05)-1)].toFixed(2);})():null,worstR12:r12.length?+Math.min(...r12).toFixed(2):null,lowN:months.length<10};}
    function dd_P(xs,ys){if(!xs||xs.length<10)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let num=0,dx2=0,dy2=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}const d=Math.sqrt(dx2*dy2);if(!d)return null;const r=num/d,n=xs.length,t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10),z=Math.abs(t),p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null,zr=0.5*Math.log((1+r)/(1-r+1e-10)),se=1/Math.sqrt(n-3);return{rho:+r.toFixed(3),n,p:p!=null?+p.toFixed(4):null,ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)]};}
    function dd_rk(arr){const s=[...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);const r=new Array(arr.length);let i=0;while(i<s.length){let j=i;while(j<s.length&&s[j].v===s[i].v)j++;const avg=(i+j-1)/2;for(let k=i;k<j;k++)r[s[k].i]=avg;i=j;}return r;}
    function dd_Sp(xs,ys){return dd_P(dd_rk(xs),dd_rk(ys));}
    function dd_boot(pairs,NSIM=5000,BL=12){const T=pairs.length;if(T<15)return null;function rhoF(a){const n=a.length,rx=dd_rk(a.map(p=>p[0])),ry=dd_rk(a.map(p=>p[1]));const mx=rx.reduce((a,b)=>a+b,0)/n,my=ry.reduce((a,b)=>a+b,0)/n;let num=0,dx2=0,dy2=0;for(let i=0;i<n;i++){const a2=rx[i]-mx,b2=ry[i]-my;num+=a2*b2;dx2+=a2*a2;dy2+=b2*b2;}const d=Math.sqrt(dx2*dy2);return d?num/d:0;}const rO=rhoF(pairs);let sd=20260824;function rnd(){sd=(sd*1664525+1013904223)&0xFFFFFFFF;return(sd>>>0)/4294967296;}const bt=[];for(let s=0;s<NSIM;s++){const sm=[];while(sm.length<T){const st=Math.floor(rnd()*(T-BL+1));for(let k=0;k<BL&&sm.length<T;k++)sm.push(pairs[(st+k)%T]);}bt.push(rhoF(sm.slice(0,T)));}bt.sort((a,b)=>a-b);const ci025=bt[Math.floor(NSIM*0.025)],ci975=bt[Math.floor(NSIM*0.975)],pB=(rO<0?bt.filter(r=>r>=0).length:bt.filter(r=>r<=0).length)/NSIM;return{rhoObs:+rO.toFixed(3),ci95:[+ci025.toFixed(3),+ci975.toFixed(3)],pBoot:+pB.toFixed(4),excludes0:(rO<0&&ci975<0)||(rO>0&&ci025>0),T,NSIM};}
    const DD_IND={hy:{label:'HY Spread',block:'Sentimiento',getter:m=>m.components?.hy?.score??null},cpiHeadline:{label:'CPI Headline',block:'Inflación',getter:m=>m.components?.cpiHeadline?.score??null},cpiCore:{label:'Core CPI',block:'Inflación',getter:m=>m.components?.cpiCore?.score??null},vix:{label:'VIX vs SMA200',block:'Sentimiento',getter:m=>m.components?.vix?.score??null},reservas:{label:'Reservas Fed',block:'Política',getter:m=>m.components?.reservas?.score??null}};
    const reservasRaw=[];for(const m of histMacroV1){if(!m.valid||!m.components?.reservas?.value)continue;reservasRaw.push({ym:m.month,v:m.components.reservas.value});}
    const resMaps={yoy:{},ch6m:{}};
    for(let i=0;i<reservasRaw.length;i++){const{ym,v}=reservasRaw[i];const t12=reservasRaw.find(p=>{const d=new Date(p.ym+'-01')-new Date(ym+'-01');return d>=335*24*3600*1e3&&d<=395*24*3600*1e3;});const t6=reservasRaw.find(p=>{const d=new Date(p.ym+'-01')-new Date(ym+'-01');return d>=150*24*3600*1e3&&d<=210*24*3600*1e3;});if(t12)resMaps.yoy[ym]=+((v/t12.v-1)*100).toFixed(2);if(t6)resMaps.ch6m[ym]=+((v/t6.v-1)*100).toFixed(2);}
    const resMapsZ={};for(let i=36;i<reservasRaw.length;i++){const window=reservasRaw.slice(i-36,i).map(p=>p.v);const mu=window.reduce((a,b)=>a+b,0)/36;const sigma=Math.sqrt(window.reduce((a,v)=>{const d=v-mu;return a+d*d;},0)/36);if(sigma>0)resMapsZ[reservasRaw[i].ym]=+((reservasRaw[i].v-mu)/sigma).toFixed(3);}
    const result={};
    for(const[id,def] of Object.entries(DD_IND)){
      const byScore={};const p6=[],p12=[],pDD6=[],pDD12=[];
      for(const m of histMacroV1){if(!m.valid)continue;const sc=def.getter(m);if(sc==null)continue;const k=sc>=0?'+'+sc:String(sc);(byScore[k]||=[]).push(m.month);const dd6=dd_maxDD(m.month,6),dd12=dd_maxDD(m.month,12),r6=dd_fm6.get(m.month),r12=dd_fm12.get(m.month);if(dd6!=null)pDD6.push([sc,dd6]);if(dd12!=null)pDD12.push([sc,dd12]);if(r6!=null)p6.push([sc,r6]);if(r12!=null)p12.push([sc,r12]);}
      const byScoreStats={};for(const[k,ms]of Object.entries(byScore))byScoreStats[k]=dd_stats(ms);
      const chrono=[...pDD6].sort((a,b)=>a[0]-b[0]);const bSz=Math.floor(chrono.length/3);
      const temp=['Early','Mid','Recent'].map((label,i)=>{const bl=chrono.slice(i*bSz,i===2?chrono.length:(i+1)*bSz);const res=dd_Sp(bl.map(p=>p[0]),bl.map(p=>p[1]));return{label,n:bl.length,rho:res?.rho??null,p:res?.p??null};});
      const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho)),regDep=signs.length>=2&&signs.some(s=>s!==signs[0]);
      const sp=p=>dd_Sp(p.map(q=>q[0]),p.map(q=>q[1]));
      const corr={spDD3:sp(pDD6.map(p=>[p[0],p[1]])),spDD6:sp(pDD6),spDD12:sp(pDD12),spR6:sp(p6),spR12:sp(p12),spBin12:dd_Sp(p12.map(p=>p[0]),p12.map(p=>p[1]>0?1:0))};
      const boot=dd_boot(pDD12);
      let altReservas=null;
      if(id==='reservas'){const altTests={};for(const[altKey,altMap]of Object.entries({yoy:resMaps.yoy,ch6m:resMaps.ch6m,zscore:resMapsZ})){const xsA=[],ysA=[];for(const m of histMacroV1){if(!m.valid)continue;const v=altMap[m.month];const dd12=dd_maxDD(m.month,12);if(v!=null&&dd12!=null){xsA.push(v);ysA.push(dd12);}}const spA=dd_Sp(xsA,ysA);const bootA=dd_boot(xsA.map((x,i)=>[x,ysA[i]]));const chrA=xsA.map((x,i)=>({x,y:ysA[i]}));const bSzA=Math.floor(chrA.length/3);const tempA=['Early','Mid','Recent'].map((label,j)=>{const bl=chrA.slice(j*bSzA,j===2?chrA.length:(j+1)*bSzA);const res=dd_Sp(bl.map(p=>p.x),bl.map(p=>p.y));return{label,n:bl.length,rho:res?.rho??null,p:res?.p??null};});const signsA=tempA.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));altTests[altKey]={n:xsA.length,spDD12:spA,boot:bootA,temp:tempA,regDep:signsA.length>=2&&signsA.some(s=>s!==signsA[0])};} altReservas=altTests;}
      const ddHorizons={};for(const[h,fm]of[[3,dd_fm3],[6,dd_fm6],[12,dd_fm12]]){const months=histMacroV1.filter(m=>m.valid&&def.getter(m)!=null).map(m=>m.month);const dds=months.map(m=>dd_maxDD(m,h)).filter(v=>v!=null);ddHorizons[h]={n:dds.length,pDD5:+(dds.filter(d=>d<-5).length/dds.length*100).toFixed(1),pDD10:+(dds.filter(d=>d<-10).length/dds.length*100).toFixed(1),pDD15:+(dds.filter(d=>d<-15).length/dds.length*100).toFixed(1),pDD20:+(dds.filter(d=>d<-20).length/dds.length*100).toFixed(1),medDD:+(([...dds].sort((a,b)=>a-b))[Math.floor(dds.length/2)]||0).toFixed(2)};}
      result[id]={label:def.label,block:def.block,n:Object.values(byScore).flat().length,nDD12:pDD12.length,byScore:byScoreStats,corr,boot,temp,regDep,ddHorizons,altReservas};
    }
    return res.status(200).json({updatedAt:new Date().toISOString(),title:'RISK_RADAR_V1 — DOWNSIDE COMPONENT DEEP DIVE',frozen:'RISK_RADAR_V1 FROZEN.',nSim:5000,blockSize:12,indicators:result,errors:errs.length?errs:undefined});
  }

  // ── CONTINUOUS DIVE (type=continuousdive) ─────────────────────
  if (type === 'continuousdive') {
    const cd_fm={};for(const h of[3,6,12]){cd_fm[h]=new Map();for(const[ym]of spMap){const t=new Date(ym+'-01');t.setMonth(t.getMonth()+h);const ty=t.toISOString().slice(0,7),fr=spMap.get(ym),to=spMap.get(ty);if(fr&&to)cd_fm[h].set(ym,+((to/fr-1)*100).toFixed(3));}}
    function cd_DD(fromYM,months){const fr=spMap.get(fromYM);if(!fr)return null;let pk=fr,mx=0;for(let i=1;i<=months;i++){const t=new Date(fromYM+'-01');t.setMonth(t.getMonth()+i);const v=spMap.get(t.toISOString().slice(0,7));if(!v)continue;if(v>pk)pk=v;const d=(v-pk)/pk*100;if(d<mx)mx=d;}return+mx.toFixed(3);}
    function cd_P(xs,ys){if(!xs||xs.length<10)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let num=0,dx2=0,dy2=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}const d=Math.sqrt(dx2*dy2);if(!d)return null;const r=num/d,n=xs.length,t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10),z=Math.abs(t),p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null,zr=0.5*Math.log((1+r)/(1-r+1e-10)),se=1/Math.sqrt(n-3);return{rho:+r.toFixed(3),n,p:p!=null?+p.toFixed(4):null,ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)]};}
    function cd_rk(arr){const s=[...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);const r=new Array(arr.length);let i=0;while(i<s.length){let j=i;while(j<s.length&&s[j].v===s[i].v)j++;const avg=(i+j-1)/2;for(let k=i;k<j;k++)r[s[k].i]=avg;i=j;}return r;}
    function cd_Sp(xs,ys){return cd_P(cd_rk(xs),cd_rk(ys));}
    function cd_boot(pairs,NSIM=5000,BL=12){const T=pairs.length;if(T<15)return null;function rhoF(a){const n=a.length,rx=cd_rk(a.map(p=>p[0])),ry=cd_rk(a.map(p=>p[1]));const mx=rx.reduce((a,b)=>a+b,0)/n,my=ry.reduce((a,b)=>a+b,0)/n;let num=0,dx2=0,dy2=0;for(let i=0;i<n;i++){const a2=rx[i]-mx,b2=ry[i]-my;num+=a2*b2;dx2+=a2*a2;dy2+=b2*b2;}const d=Math.sqrt(dx2*dy2);return d?num/d:0;}const rO=rhoF(pairs);let sd=20260825;function rnd(){sd=(sd*1664525+1013904223)&0xFFFFFFFF;return(sd>>>0)/4294967296;}const bt=[];for(let s=0;s<NSIM;s++){const sm=[];while(sm.length<T){const st=Math.floor(rnd()*(T-BL+1));for(let k=0;k<BL&&sm.length<T;k++)sm.push(pairs[(st+k)%T]);}bt.push(rhoF(sm.slice(0,T)));}bt.sort((a,b)=>a-b);const ci025=bt[Math.floor(NSIM*0.025)],ci975=bt[Math.floor(NSIM*0.975)],pB=(rO<0?bt.filter(r=>r>=0).length:bt.filter(r=>r<=0).length)/NSIM;return{rhoObs:+rO.toFixed(3),ci95:[+ci025.toFixed(3),+ci975.toFixed(3)],pBoot:+pB.toFixed(4),excludes0:(rO<0&&ci975<0)||(rO>0&&ci025>0),T,NSIM};}
    function cd_temp(pairs){const chrono=[...pairs].sort((a,b)=>a[0].localeCompare(b[0]));const bSz=Math.floor(chrono.length/3);return['Early','Mid','Recent'].map((label,i)=>{const bl=chrono.slice(i*bSz,i===2?chrono.length:(i+1)*bSz);const res=cd_Sp(bl.map(p=>p[1]),bl.map(p=>p[2]));return{label,n:bl.length,first:bl[0]?.[0],last:bl[bl.length-1]?.[0],rho:res?.rho??null,p:res?.p??null,ci95:res?.ci95??null};});}
    function cd_pctRank(vals,v){return+(vals.filter(x=>x<v).length/vals.length*100).toFixed(1);}
    const cdResult={};
    const hyVals=[],vixVals=[];
    for(const m of histMacroV1){if(m.components?.hy?.value!=null)hyVals.push(m.components.hy.value);if(m.components?.vix?.value!=null)vixVals.push(m.components.vix.value);}
    const validMonths=histMacroV1.filter(m=>m.valid);
    for(const[indKey,transforms,label]of[['hy',{level:m=>m.components?.hy?.value??null,pctRank:m=>{const v=m.components?.hy?.value;return v!=null?cd_pctRank(hyVals,v):null;},zscore3y:(m,i,arr)=>{const prev=arr.slice(Math.max(0,i-36),i).map(x=>x.components?.hy?.value).filter(v=>v!=null);if(prev.length<12)return null;const mu=prev.reduce((a,b)=>a+b,0)/prev.length;const sigma=Math.sqrt(prev.reduce((a,v)=>{const d=v-mu;return a+d*d;},0)/prev.length);const v=m.components?.hy?.value;return sigma>0&&v!=null?+((v-mu)/sigma).toFixed(3):null;},change3m:(m,i,arr)=>{const v=m.components?.hy?.value;if(v==null)return null;const t3=arr.slice(Math.max(0,i-3),i).reverse().find(x=>x.components?.hy?.value!=null);return t3?+(v-t3.components.hy.value).toFixed(3):null;}},'HY Spread'],['vix',{level:m=>m.components?.vix?.value??null,pctRank:m=>{const v=m.components?.vix?.value;return v!=null?cd_pctRank(vixVals,v):null;},zscore3y:(m,i,arr)=>{const prev=arr.slice(Math.max(0,i-36),i).map(x=>x.components?.vix?.value).filter(v=>v!=null);if(prev.length<12)return null;const mu=prev.reduce((a,b)=>a+b,0)/prev.length;const sigma=Math.sqrt(prev.reduce((a,v)=>{const d=v-mu;return a+d*d;},0)/prev.length);const v=m.components?.vix?.value;return sigma>0&&v!=null?+((v-mu)/sigma).toFixed(3):null;},change3m:(m,i,arr)=>{const v=m.components?.vix?.value;if(v==null)return null;const t3=arr.slice(Math.max(0,i-3),i).reverse().find(x=>x.components?.vix?.value!=null);return t3?+(v-t3.components.vix.value).toFixed(3):null;}},'VIX']]){
      const transResults={};
      for(const[tName,tfn]of Object.entries(transforms)){
        const pairs={};for(const h of[3,6,12])pairs[h]={dd:[],r:[],bin:[]};const pairsYM={};for(const h of[3,6,12])pairsYM[h]=[];
        validMonths.forEach((m,i,arr)=>{const v=tfn(m,i,arr);if(v==null)return;for(const h of[3,6,12]){const dd=cd_DD(m.month,h),ret=cd_fm[h].get(m.month);if(dd!=null){pairs[h].dd.push([v,dd]);pairsYM[h].push([m.month,v,dd]);}if(ret!=null){pairs[h].r.push([v,ret]);pairs[h].bin.push([v,ret>0?1:0]);}}});
        const res={};for(const h of[3,6,12]){const spDD=cd_Sp(pairs[h].dd.map(p=>p[0]),pairs[h].dd.map(p=>p[1])),spR=cd_Sp(pairs[h].r.map(p=>p[0]),pairs[h].r.map(p=>p[1])),spBin=cd_Sp(pairs[h].bin.map(p=>p[0]),pairs[h].bin.map(p=>p[1])),boot=cd_boot(pairs[h].dd),temp=cd_temp(pairsYM[h]);const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));const sorted=[...pairs[h].dd].sort((a,b)=>a[0]-b[0]);const Nq=sorted.length,qSz=Math.ceil(Nq/5);const quintiles=[0,1,2,3,4].map(qi=>{const sl=sorted.slice(qi*qSz,(qi+1)*qSz),dds=sl.map(p=>p[1]);const med=arr=>{const s=[...arr].sort((a,b)=>a-b);return s.length?+s[Math.floor(s.length/2)].toFixed(2):null;};return{q:qi+1,n:sl.length,minV:+sl[0]?.[0].toFixed(2),maxV:+sl[sl.length-1]?.[0].toFixed(2),medDD:med(dds),pDD10:dds.length?+(dds.filter(d=>d<-10).length/dds.length*100).toFixed(1):null};});res[h]={nDD:pairs[h].dd.length,spDD,spR,spBin,boot,temp,regDep:signs.length>=2&&signs.some(s=>s!==signs[0]),quintiles};}
        transResults[tName]=res;
      }
      cdResult[indKey]={label,transforms:transResults};
    }
    return res.status(200).json({updatedAt:new Date().toISOString(),title:'RISK_RADAR_V1 — CONTINUOUS DIVE: HY y VIX como variables continuas',frozen:'RISK_RADAR_V1 FROZEN.',nSim:5000,blockSize:12,result:cdResult,errors:errs.length?errs:undefined});
  }

  // ── SP500 HISTÓRICO — SNAPSHOT FIRESTORE (type=sp500-backfill) ──────
  // Construye el snapshot canónico mensual del S&P 500 en Firestore.
  // Fetches en paralelo por tramos de 10 años → sin timeout.
  // Cron: día 1 de cada mes. También ejecutable manualmente.
  // Todos los módulos (Timeline, Analogías, Correlaciones, CreditGap) leen este mismo snapshot.
  if (type === 'sp500-backfill') {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers?.['authorization'];
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized — sp500-backfill es solo para cron o admin' });
    }

    const SP500_COL = 'ethan_market_data';
    const SP500_DOC = 'sp500_monthly_v1';

    // Leer snapshot existente (Firestore opcional)
    let existing = {};
    let firestoreAvailable = false;
    try {
      const db = getDB();
      const snap = await db.collection(SP500_COL).doc(SP500_DOC).get();
      if (snap.exists) { existing = snap.data()?.data || {}; firestoreAvailable = true; }
    } catch(_) { /* Firestore no configurado — continuar sin caché persistente */ }

    const existingN = Object.keys(existing).length;

    const DECADES = [
      ['1970-01-01','1979-12-31'],
      ['1980-01-01','1989-12-31'],
      ['1990-01-01','1999-12-31'],
      ['2000-01-01','2009-12-31'],
      ['2010-01-01','2019-12-31'],
      ['2020-01-01','2029-12-31'],
    ];
    const thisYear = new Date().getFullYear();

    // Tramos a descargar: si existing está vacío, descargar TODO
    // Si tiene datos, solo refrescar el tramo actual
    const tramosToFetch = DECADES.filter(([from, to]) => {
      const endYear = parseInt(to.slice(0,4));
      const thisYear = new Date().getFullYear();
      if (endYear >= thisYear) return true; // siempre refrescar tramo actual
      if (existingN === 0) return true;     // sin caché → descargar todo
      // Con caché: saltar si ya tenemos datos de este rango
      const startYM = from.slice(0,7);
      const endYM = to.slice(0,7);
      return !Object.keys(existing).some(ym => ym >= startYM && ym <= endYM);
    });

    // Fetch en paralelo
    const fetchResults = await Promise.allSettled(
      tramosToFetch.map(async ([from, to]) => {
        const url = `https://api.stlouisfed.org/fred/series/observations` +
          `?series_id=SP500&api_key=${key}&file_type=json&sort_order=asc` +
          `&frequency=m&observation_start=${from}&observation_end=${to}`;
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 25000);
        const r = await fetch(url, { signal: ctrl.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${from}→${to}`);
        const j = await r.json();
        const obs = (j.observations || []).filter(o => o.value !== '.' && o.value !== 'NA');
        return { from, to, obs };
      })
    );

    // Combinar resultados
    const newData = { ...existing };
    const fetchLog = [];
    for (let i = 0; i < fetchResults.length; i++) {
      const [from, to] = tramosToFetch[i];
      const r = fetchResults[i];
      if (r.status === 'fulfilled') {
        r.value.obs.forEach(o => { newData[o.date.slice(0,7)] = parseFloat(o.value); });
        fetchLog.push({ range: `${from}→${to}`, status: 'OK', n: r.value.obs.length,
          first: r.value.obs[0]?.date, last: r.value.obs[r.value.obs.length-1]?.date });
      } else {
        fetchLog.push({ range: `${from}→${to}`, status: 'ERROR', error: r.reason?.message });
        errs.push(`SP500 ${from}: ${r.reason?.message}`);
      }
    }
    // Tramos ya en caché
    DECADES.filter(d => !tramosToFetch.includes(d)).forEach(([from, to]) => {
      fetchLog.push({ range: `${from}→${to}`, status: 'CACHED' });
    });

    const sorted = Object.keys(newData).sort();
    const totalN = sorted.length;
    const nowISO = new Date().toISOString();

    // Acceptance test: 7 fechas de referencia requeridas
    const CHECK_MONTHS = ['2000-01','2008-09','2009-03','2018-12','2020-04','2022-10','2025-04'];
    function fwdReturn(data, ym, h) {
      const from = data[ym]; if(!from) return null;
      const t = new Date(ym+'-01'); t.setMonth(t.getMonth()+h);
      const to = data[t.toISOString().slice(0,7)]; if(!to) return null;
      return +((to/from-1)*100).toFixed(2);
    }
    function fwdMaxDD(data, ym, months) {
      const from = data[ym]; if(!from) return null;
      let pk=from, mx=0;
      for(let i=1;i<=months;i++){
        const t=new Date(ym+'-01');t.setMonth(t.getMonth()+i);
        const v=data[t.toISOString().slice(0,7)];if(!v)continue;
        if(v>pk)pk=v;const d=(v-pk)/pk*100;if(d<mx)mx=d;
      }
      return +mx.toFixed(2);
    }
    const acceptanceTest = CHECK_MONTHS.map(ym => ({
      ym, sp0: newData[ym]||null,
      sp3M: fwdReturn(newData,ym,3), sp6M: fwdReturn(newData,ym,6), sp12M: fwdReturn(newData,ym,12),
      maxDD12M: fwdMaxDD(newData,ym,12),
      ok: !!newData[ym],
    }));

    // Persistir en Firestore si está disponible; si no, devolver los datos directamente
    let persistOk = false;
    let firestoreError = null;
    if (totalN > 0) {
      try {
        const db = getDB();
        await db.collection(SP500_COL).doc(SP500_DOC).set({
          data: newData,
          updatedAt: nowISO,
          n: totalN,
          first: sorted[0],
          last: sorted[sorted.length-1],
          source: 'FRED SP500 (series_id=SP500, frequency=m, month-end close)',
          method: 'month-end close via FRED API, parallel fetch by decade',
        });
        persistOk = true;
      } catch(e) {
        firestoreError = 'NO_FIRESTORE (credenciales no configuradas en Vercel)';
        // Sin Firestore: datos disponibles en spData de la respuesta para localStorage del cliente
      }
    }

    // Audit canónico
    const canonicalAudit = {
      source: 'FRED SP500 (S&P 500 Index, Not Seasonally Adjusted)',
      seriesId: 'SP500',
      frequency: 'monthly (month-end close)',
      adjusted: false,
      normalisation: 'YYYY-MM → month-end close price. No positional matching.',
      n: totalN,
      firstDate: sorted[0],
      lastDate: sorted[sorted.length-1],
      lastUpdated: nowISO,
      persistedInFirestore: persistOk,
      collection: `${SP500_COL}/${SP500_DOC}`,
      cronSchedule: '0 6 1 * * (día 1 de cada mes)',
      coverageCheck: {
        '1976+': sorted.some(ym=>ym<='1976-12')?'OK':'MISSING_PRE_1976',
        '2000s': sorted.some(ym=>ym>='2000-01'&&ym<='2009-12')?'OK':'MISSING',
        '2008_crisis': !!newData['2008-09']?'OK':'MISSING',
        '2020_covid': !!newData['2020-03']?'OK':'MISSING',
        'current': sorted[sorted.length-1]>='2025-01'?'OK':'POSSIBLY_STALE',
      },
      pointInTime: 'HARD RULE: SP future data never enters similarity/score calculation. Forward metrics used only for outcome evaluation.',
      fetchStrategy: 'Parallel fetch by decade (6 requests × 25s timeout). Historical decades cached; current decade always refreshed.',
    };

    return res.status(200).json({
      updatedAt: nowISO,
      title: 'SP500_CANONICAL_AUDIT',
      canonicalAudit,
      fetchLog: fetchLog.sort((a,b)=>a.range.localeCompare(b.range)),
      acceptanceTest,
      // Devolver datos para localStorage cuando Firestore no está disponible
      spData: !persistOk ? newData : undefined,
      firestoreStatus: persistOk ? 'OK' : `NO_FIRESTORE: ${firestoreError}`,
      errors: errs.length ? errs : undefined,
    });
  }


    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers?.['authorization'];
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

  if (type === 'creditgap') {
    // Aceptar SP500 desde POST body (cliente lo tiene en localStorage si Firestore no disponible)
    let spMapLocal = spMap;
    try {
      if (req.method === 'POST') {
        const chunks = [];
        await new Promise(resolve => { req.on('data', c => chunks.push(c)); req.on('end', resolve); });
        const parsed = JSON.parse(Buffer.concat(chunks).toString());
        if (parsed?.spData && Object.keys(parsed.spData).length > 100) {
          const arr = Object.entries(parsed.spData)
            .map(([ym, v]) => ({ date: ym+'-01', value: Number(v) }))
            .sort((a,b) => a.date.localeCompare(b.date));
          const mon = toMonthly(arr);
          spMapLocal = new Map(mon.map(p=>[p.date.slice(0,7), p.value]));
        }
      }
    } catch(_) {}
    const cg_fm = {};
    for (const h of [3,6,12]) {
      cg_fm[h] = new Map();
      for (const [ym] of spMapLocal) {
        const t=new Date(ym+'-01'); t.setMonth(t.getMonth()+h);
        const ty=t.toISOString().slice(0,7), fr=spMap.get(ym), to=spMap.get(ty);
        if(fr&&to) cg_fm[h].set(ym,+((to/fr-1)*100).toFixed(3));
      }
    }
    function cg_DD(fromYM,months){const fr=spMapLocal.get(fromYM);if(!fr)return null;let pk=fr,mx=0;for(let i=1;i<=months;i++){const t=new Date(fromYM+'-01');t.setMonth(t.getMonth()+i);const v=spMapLocal.get(t.toISOString().slice(0,7));if(!v)continue;if(v>pk)pk=v;const d=(v-pk)/pk*100;if(d<mx)mx=d;}return+mx.toFixed(3);}
    function cg_P(xs,ys){if(!xs||xs.length<10)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let num=0,dx2=0,dy2=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;num+=a*b;dx2+=a*a;dy2+=b*b;}const d=Math.sqrt(dx2*dy2);if(!d)return null;const r=num/d,n=xs.length,t=r*Math.sqrt(n-2)/Math.sqrt(1-r*r+1e-10),z=Math.abs(t),p=n>30?2*(1-(0.5*(1+Math.sign(z)*Math.sqrt(1-Math.exp(-2*z*z/Math.PI))))):null,zr=0.5*Math.log((1+r)/(1-r+1e-10)),se=1/Math.sqrt(n-3);return{rho:+r.toFixed(3),n,p:p!=null?+p.toFixed(4):null,ci95:[+(Math.tanh(zr-1.96*se)).toFixed(3),+(Math.tanh(zr+1.96*se)).toFixed(3)]};}
    function cg_rk(arr){const s=[...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);const r=new Array(arr.length);let i=0;while(i<s.length){let j=i;while(j<s.length&&s[j].v===s[i].v)j++;const avg=(i+j-1)/2;for(let k=i;k<j;k++)r[s[k].i]=avg;i=j;}return r;}
    function cg_Sp(xs,ys){return cg_P(cg_rk(xs),cg_rk(ys));}
    function cg_boot(pairs,NSIM=5000,BL=12){const T=pairs.length;if(T<15)return null;function rhoF(a){const n=a.length,rx=cg_rk(a.map(p=>p[0])),ry=cg_rk(a.map(p=>p[1]));const mx=rx.reduce((a,b)=>a+b,0)/n,my=ry.reduce((a,b)=>a+b,0)/n;let num=0,dx2=0,dy2=0;for(let i=0;i<n;i++){const a2=rx[i]-mx,b2=ry[i]-my;num+=a2*b2;dx2+=a2*a2;dy2+=b2*b2;}const d=Math.sqrt(dx2*dy2);return d?num/d:0;}const rO=rhoF(pairs);let sd=20260825;function rnd(){sd=(sd*1664525+1013904223)&0xFFFFFFFF;return(sd>>>0)/4294967296;}const bt=[];for(let s=0;s<NSIM;s++){const sm=[];while(sm.length<T){const st=Math.floor(rnd()*(T-BL+1));for(let k=0;k<BL&&sm.length<T;k++)sm.push(pairs[(st+k)%T]);}bt.push(rhoF(sm.slice(0,T)));}bt.sort((a,b)=>a-b);const ci025=bt[Math.floor(NSIM*0.025)],ci975=bt[Math.floor(NSIM*0.975)],pB=(rO<0?bt.filter(r=>r>=0).length:bt.filter(r=>r<=0).length)/NSIM;return{rhoObs:+rO.toFixed(3),ci95:[+ci025.toFixed(3),+ci975.toFixed(3)],pBoot:+pB.toFixed(4),excludes0:(rO<0&&ci975<0)||(rO>0&&ci025>0),T,NSIM};}

    function addMYM(ym,n){const d=new Date(ym+'-01');d.setMonth(d.getMonth()+n);return d.toISOString().slice(0,7);}

    // Serie de gaps desde histMacroV1
    const gapSeries=[];
    for(const m of histMacroV1){
      if(!m.valid)continue;
      const gap=m.components?.creditoVsPib?.value;
      if(gap==null)continue;
      gapSeries.push({ym:m.month,gap});
    }
    gapSeries.sort((a,b)=>a.ym.localeCompare(b.ym));
    const gapMap=new Map(gapSeries.map(g=>[g.ym,g.gap]));

    // Correlaciones con 4 lags (0/3/6/12M)
    const lagResults={};
    for(const lag of [0,3,6,12]){
      const p6=[],p12=[],pDD6=[],pDD12=[],pBin=[],pDD10=[],pDD15=[];
      for(const {ym} of gapSeries){
        const lagYM=lag===0?ym:addMYM(ym,-lag);
        const gap=gapMap.get(lagYM);if(gap==null)continue;
        const r6=cg_fm[6].get(ym),r12=cg_fm[12].get(ym),dd6=cg_DD(ym,6),dd12=cg_DD(ym,12);
        if(r6!=null)p6.push([gap,r6]);
        if(r12!=null){p12.push([gap,r12]);pBin.push([gap,r12>0?1:0]);}
        if(dd6!=null)pDD6.push([gap,dd6]);
        if(dd12!=null){pDD12.push([gap,dd12,r12??null]);pDD10.push([gap,dd12<-10?1:0]);pDD15.push([gap,dd12<-15?1:0]);}
      }
      const sp=p=>cg_Sp(p.map(q=>q[0]),p.map(q=>q[1]));
      const corr={spR6:sp(p6),spR12:sp(p12),spDD6:sp(pDD6),spDD12:sp(pDD12),spBin12:sp(pBin),spDD10:sp(pDD10),spDD15:sp(pDD15)};
      const boot=cg_boot(pDD12);
      const chByDate=[...pDD6.map((p,i)=>({gap:p[0],dd:p[1],ym:gapSeries[i]?.ym||''}))]
        .sort((a,b)=>a.ym.localeCompare(b.ym));
      const bSz=Math.floor(chByDate.length/3);
      const temp=['Early','Mid','Recent'].map((label,i)=>{
        const bl=chByDate.slice(i*bSz,i===2?chByDate.length:(i+1)*bSz);
        const res=cg_Sp(bl.map(p=>p.gap),bl.map(p=>p.dd));
        return{label,n:bl.length,rho:res?.rho??null,p:res?.p??null};
      });
      const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));
      const sorted=[...pDD12].sort((a,b)=>a[0]-b[0]);
      const Nq=sorted.length,qSz=Math.ceil(Nq/5);
      const quintiles=[0,1,2,3,4].map(qi=>{
        const sl=sorted.slice(qi*qSz,(qi+1)*qSz);
        const dds=sl.map(p=>p[1]);
        // Obtener r12 real para los mismos meses (sl[i] = [gap, dd12, ym])
        const rets=sl.map(p=>p[2]).filter(v=>v!=null);
        const med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?+s[Math.floor(s.length/2)].toFixed(2):null;};
        const var95=rets.length?+([...rets].sort((x,y)=>x-y)[Math.max(0,Math.floor(rets.length*0.05)-1)]).toFixed(2):null;
        const pPos12=rets.length?+(rets.filter(r=>r>0).length/rets.length*100).toFixed(1):null;
        return{q:qi+1,n:sl.length,gapMin:+sl[0]?.[0].toFixed(2),gapMax:+sl[sl.length-1]?.[0].toFixed(2),
          medDD12:med(dds),pDD10:dds.length?+(dds.filter(d=>d<-10).length/dds.length*100).toFixed(1):null,
          medRet12:med(rets),var95Ret12:var95,pPos12,
          nRet:rets.length};
      });
      const ddByQ=quintiles.map(q=>q.medDD12).filter(v=>v!=null);
      const isMonotonic=ddByQ.length>=3&&(ddByQ.every((v,i)=>i===0||v<=ddByQ[i-1])||ddByQ.every((v,i)=>i===0||v>=ddByQ[i-1]));
      lagResults['lag'+lag+'M']={lag,n:pDD12.length,corr,boot,temp,regDep:signs.length>=2&&signs.some(s=>s!==signs[0]),quintiles,isMonotonic};
    }

    // Estadísticos y audit
    const totllRaw=rTotll.status==='fulfilled'?rTotll.value:[];
    const gdpRaw=rGdp.status==='fulfilled'?rGdp.value:[];
    const _totllYoY=yoySeriesByDate(totllRaw, 7);   // semanal ±7d
    const _gdpYoY=yoySeriesByDate(gdpRaw, 45);      // trimestral ±45d
    const _totllMap=new Map(_totllYoY.map(p=>[p.date.slice(0,7),p.value]));
    const _gdpMap=new Map(_gdpYoY.map(p=>[p.date.slice(0,7),p.value]));

    const gaps=gapSeries.map(g=>g.gap).sort((a,b)=>a-b);
    const statSumm=arr=>{if(!arr||!arr.length)return{n:0};const s=[...arr].sort((a,b)=>a-b);const px=p=>s[Math.max(0,Math.floor(s.length*p)-1)];return{n:s.length,min:+s[0].toFixed(2),p10:+px(0.10).toFixed(2),p25:+px(0.25).toFixed(2),median:+px(0.50).toFixed(2),p75:+px(0.75).toFixed(2),p90:+px(0.90).toFixed(2),max:+s[s.length-1].toFixed(2)};};

    let nAfterSP500=0,nAfterFwd12=0,nAfterDD12=0;
    for(const m of histMacroV1){if(!m.valid||m.components?.creditoVsPib?.value==null)continue;if(!spMap.get(m.month))continue;nAfterSP500++;if(!cg_fm[12].get(m.month))continue;nAfterFwd12++;if(cg_DD(m.month,12)==null)continue;nAfterDD12++;}

    // Acceptance test manual: 6 fechas de referencia requeridas + 5 más recientes
    const TARGET_DATES=['2026-04','2025-04','2020-04','2018-12','2008-09','2000-01'];
    const manualTargets=TARGET_DATES.map(ym=>{
      // TOTLL: buscar obs en esa semana
      const tCands=totllRaw.filter(p=>p.date.slice(0,7)===ym||p.date.startsWith(ym));
      const tCur=tCands.length?tCands[tCands.length-1]:null;
      const targetBaseMs=tCur?new Date(tCur.date).getTime()-365*24*3600*1000:null;
      const tBase=targetBaseMs?totllRaw.filter(p=>Math.abs(new Date(p.date).getTime()-targetBaseMs)<=7*24*3600*1000)
        .sort((a,b)=>Math.abs(new Date(a.date).getTime()-targetBaseMs)-Math.abs(new Date(b.date).getTime()-targetBaseMs))[0]:null;
      const creditYoY=tCur&&tBase&&tBase.value?+((tCur.value/tBase.value-1)*100).toFixed(2):null;
      const gdpV=_gdpMap.get(ym);
      return{ym,totllCurrent:tCur?.value,totllCurrentDate:tCur?.date?.slice(0,10),
        totllBase:tBase?.value,totllBaseDate:tBase?.date?.slice(0,10),
        creditYoY,gdpYoY:gdpV??null,
        gap:creditYoY!=null&&gdpV!=null?+(creditYoY-gdpV).toFixed(2):null,
        spFwd12:cg_fm[12].get(ym),dd12:cg_DD(ym,12)};
    });
    const manualSample=[...manualTargets,...gapSeries.slice(-5).map(({ym,gap})=>({ym,gap,
      creditYoY:_totllMap.get(ym),gdpYoY:_gdpMap.get(ym),spFwd12:cg_fm[12].get(ym),dd12:cg_DD(ym,12)}))];

    const audit={pipeline:{
      totll:{first:totllRaw[0]?.date?.slice(0,7),last:totllRaw[totllRaw.length-1]?.date?.slice(0,7),n:totllRaw.length,seriesId:'TOTLL',frequency:'semanal (N≈52/año)'},
      gdp:{first:gdpRaw[0]?.date?.slice(0,7),last:gdpRaw[gdpRaw.length-1]?.date?.slice(0,7),n:gdpRaw.length,seriesId:'GDP',frequency:'trimestral_SAAR'},
      totllYoY:{n:_totllYoY.length,first:_totllYoY[0]?.date?.slice(0,7),last:_totllYoY[_totllYoY.length-1]?.date?.slice(0,7),
        method:'yoySeriesByDate ±7d (FIX B: TOTLL semanal — i-12=~3M era incorrecto)'},
      gdpYoY:{n:_gdpYoY.length,first:_gdpYoY[0]?.date?.slice(0,7),last:_gdpYoY[_gdpYoY.length-1]?.date?.slice(0,7),
        method:'yoySeriesByDate ±45d (FIX A: GDP trimestral)'},
      creditGrowthGap:{n:gapSeries.length,first:gapSeries[0]?.ym,last:gapSeries[gapSeries.length-1]?.ym},
      filterFunnel:{rawGap:gapSeries.length,afterSP500:nAfterSP500,afterFwd12M:nAfterFwd12,afterDD12M:nAfterDD12,
        note:'La caída N es principalmente por el bug SP500 histórico (spMap solo llega a ~2016)'},
      unitsCheck:{totll:'Miles de millones USD',totllYoY:'% YoY',gdpYoY:'% YoY',gap:'pp (porcentuales)',scaleConsistency:'OK — ambos en % antes de restar'},
      totllMethodNote:'FIX B: yoySeriesByDate ±7d. Bug anterior yoySeries(i-12) sobre serie semanal = variación ~3M, no 12M.',
      gdpMethodNote:'FIX A: yoySeriesByDate ±45d. Bug anterior yoySeries(i-12) sobre serie trimestral = variación ~3Y, no 12M.',
    },manualSample};

    const desc={...statSumm(gaps),n:gapSeries.length,first:gapSeries[0]?.ym,last:gapSeries[gapSeries.length-1]?.ym,
      pctPositive:gaps.length?+(gaps.filter(v=>v>0).length/gaps.length*100).toFixed(1):null,
      currentThresholds:'PROVISIONAL: diff>=3.0→+3 | diff>=1.5→0 | diff<1.5→-3',
      semanticNote:'creditGrowthGap>0 = crédito crece más rápido que PIB nominal. Gap<0 = crece más lento.',
      inputStats:{
        totllYoY:{...statSumm(_totllYoY.map(p=>p.value)),first:_totllYoY[0]?.date?.slice(0,7),last:_totllYoY[_totllYoY.length-1]?.date?.slice(0,7),method:'yoySeriesByDate ±7d'},
        gdpYoY:{...statSumm(_gdpYoY.map(p=>p.value)),first:_gdpYoY[0]?.date?.slice(0,7),last:_gdpYoY[_gdpYoY.length-1]?.date?.slice(0,7),method:'yoySeriesByDate ±45d'},
        gap:{...statSumm(gaps),first:gapSeries[0]?.ym,last:gapSeries[gapSeries.length-1]?.ym}},
    };
    const MIN_HIST=36;
    const wfObs=[];
    const sortedByDate=[...gapSeries].sort((a,b)=>a.ym.localeCompare(b.ym));
    for(let i=MIN_HIST;i<sortedByDate.length;i++){
      const{ym,gap}=sortedByDate[i];
      const hist=sortedByDate.slice(0,i).map(g=>g.gap).sort((a,b)=>a-b);
      const N=hist.length;
      const p33=hist[Math.floor(N*0.33)],p67=hist[Math.floor(N*0.67)];
      const score_pct=gap>=p67?3:gap>=p33?0:-3;
      const p20=hist[Math.floor(N*0.20)],p40=hist[Math.floor(N*0.40)];
      const p60=hist[Math.floor(N*0.60)],p80=hist[Math.floor(N*0.80)];
      const score_quintile=gap>=p80?3:gap>=p60?1:gap>=p40?0:gap>=p20?-1:-3;
      const mu=hist.reduce((a,b)=>a+b,0)/N;
      const sigma=Math.sqrt(hist.reduce((a,v)=>{const d=v-mu;return a+d*d;},0)/N);
      const zScore=sigma>0?+((gap-mu)/sigma).toFixed(3):null;
      const r12=cg_fm[12].get(ym),dd12=cg_DD(ym,12);
      wfObs.push({ym,gap,score_pct,score_quintile,zScore,r12,dd12,
        bin12:r12!=null?r12>0?1:0:null,dd10:dd12!=null?dd12<-10?1:0:null});
    }
    function wfEval(scoreKey,wfData){
      const valid=wfData.filter(d=>d[scoreKey]!=null&&d.dd12!=null&&d.r12!=null);
      if(valid.length<10)return{n:valid.length,insufficient:true};
      const xs=valid.map(d=>d[scoreKey]),ysDD=valid.map(d=>d.dd12),ysR=valid.map(d=>d.r12);
      const spDD=cg_Sp(xs,ysDD),spR=cg_Sp(xs,ysR),bootDD=cg_boot(valid.map(d=>[d[scoreKey],d.dd12]));
      const byScore={};
      for(const d of valid){const k=String(d[scoreKey]);if(!byScore[k])byScore[k]={n:0,dds:[],rets:[]};byScore[k].n++;byScore[k].dds.push(d.dd12);byScore[k].rets.push(d.r12);}
      const med=arr=>{const s=[...arr].sort((a,b)=>a-b);return s.length?+s[Math.floor(s.length/2)].toFixed(2):null;};
      const scoreStats={};
      for(const[k,v] of Object.entries(byScore))scoreStats[k]={n:v.n,medDD12:med(v.dds),medRet12:med(v.rets),pDD10:+(v.dds.filter(d=>d<-10).length/v.n*100).toFixed(1),pPos12:+(v.rets.filter(r=>r>0).length/v.n*100).toFixed(1)};
      let turnover=0;for(let i=1;i<valid.length;i++)if(valid[i][scoreKey]!==valid[i-1][scoreKey])turnover++;
      const bSz=Math.floor(valid.length/3);
      const temp=['Early','Mid','Recent'].map((label,i)=>{const bl=valid.slice(i*bSz,i===2?valid.length:(i+1)*bSz);const res=cg_Sp(bl.map(d=>d[scoreKey]),bl.map(d=>d.dd12));return{label,n:bl.length,rho:res?.rho??null,p:res?.p??null};});
      const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));
      return{n:valid.length,spDD,spR,bootDD,scoreStats,turnover,turnoverRate:+(turnover/valid.length).toFixed(3),temp,regDep:signs.length>=2&&signs.some(s=>s!==signs[0])};
    }
    function wfEvalCont(wfData){
      const valid=wfData.filter(d=>d.zScore!=null&&d.dd12!=null&&d.r12!=null);
      if(valid.length<10)return{n:valid.length,insufficient:true};
      const spDD=cg_Sp(valid.map(d=>d.zScore),valid.map(d=>d.dd12));
      const spR=cg_Sp(valid.map(d=>d.zScore),valid.map(d=>d.r12));
      const bootDD=cg_boot(valid.map(d=>[d.zScore,d.dd12]));
      const sorted=[...valid].sort((a,b)=>a.zScore-b.zScore);
      const qSz=Math.ceil(sorted.length/5);
      const med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?+s[Math.floor(s.length/2)].toFixed(2):null;};
      const quintiles=[0,1,2,3,4].map(qi=>{const sl=sorted.slice(qi*qSz,(qi+1)*qSz),dds=sl.map(p=>p.dd12);return{q:qi+1,n:sl.length,zMin:+sl[0]?.zScore.toFixed(2),zMax:+sl[sl.length-1]?.zScore.toFixed(2),medDD12:med(dds),pDD10:dds.length?+(dds.filter(d=>d<-10).length/dds.length*100).toFixed(1):null};});
      const bSz=Math.floor(valid.length/3);
      const temp=['Early','Mid','Recent'].map((label,i)=>{const bl=valid.slice(i*bSz,i===2?valid.length:(i+1)*bSz);const res=cg_Sp(bl.map(d=>d.zScore),bl.map(d=>d.dd12));return{label,n:bl.length,rho:res?.rho??null,p:res?.p??null};});
      const signs=temp.filter(b=>b.rho!=null).map(b=>Math.sign(b.rho));
      return{n:valid.length,spDD,spR,bootDD,quintiles,temp,regDep:signs.some((s,i)=>i>0&&s!==signs[0])};
    }
    const wfResults={
      percentiles_p33p67:wfEval('score_pct',wfObs),
      quintiles_p20p40p60p80:wfEval('score_quintile',wfObs),
      zscore_continuous:wfEvalCont(wfObs),
      wfN:wfObs.length,wfFirst:wfObs[0]?.ym,wfLast:wfObs[wfObs.length-1]?.ym,
      minHist:MIN_HIST,
      note:'Expanding window OOS. Thresholds calculados SOLO con datos anteriores a cada observación.',
    };

    return res.status(200).json({
      updatedAt:new Date().toISOString(),
      title:'creditGrowthGap (TOTLL YoY − GDP YoY) — Validación histórica + Walk-Forward Calibration',
      note:'HIST_MACRO_V1 FROZEN. FIX: gdpYoY usa fecha real ±45d. Walk-forward OOS con expanding window.',
      nSim:5000,blockSize:12,
      desc,audit,lagResults,wfResults,
      errors:errs.length?errs:undefined,
    });
  } // end creditgap

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
