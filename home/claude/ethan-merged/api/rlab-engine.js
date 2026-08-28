// ═══════════════════════════════════════════════════════════════════
// ETHAN Trading R-Lab V1 — Motor estadístico de backtesting
// ═══════════════════════════════════════════════════════════════════
// BASE_FILTER_V1: 5 mensual + 4 semanal = 9 condiciones HARD
// Entradas: E0 Immediate | E1 EMA5W cross | E2 MACD+RSI diario
//           E3 RSI5 Pullback semanal | E4 RSI5 Pullback diario
// Salidas:  X1 EMA10D pura | X2 EMA10W pura (sin condsBroken)
// Convención: señal Close(t) → ejecución Open(t+1) HARD
// PIT: lastClosedWeeklyBar(t) / lastClosedMonthlyBar(t) deterministas
// ═══════════════════════════════════════════════════════════════════

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })});
  }
  return getFirestore();
}

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

// ── Handler principal ─────────────────────────────────────────────
export default async function handler(req, res) {
  const { type, ticker, trace } = req.query;
  const traceMode = trace === 'true';

  // ── TRACE mode: 1 ticker, log día a día ──────────────────────
  if (type === 'trace' && ticker) {
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
  if (type === 'run') {
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
  if (type === 'results') {
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

  return res.status(400).json({ error: 'type requerido: trace | run | results' });
}
