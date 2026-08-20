// ═══════════════════════════════════════════════
// MÓDULO: 4.6 Backtesting · Sistema Alcista
// Motor copiado exactamente de la plataforma vieja
// ═══════════════════════════════════════════════

const PROXIES = [
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];

// ── Indicadores (idénticos a plataforma vieja) ──
function ema(arr, p) {
  const k = 2/(p+1), out = new Array(arr.length).fill(null);
  let start = arr.findIndex(v => v != null && !isNaN(v));
  if (start < 0) return out;
  out[start] = arr[start];
  for (let i = start+1; i < arr.length; i++) {
    const v = arr[i] != null && !isNaN(arr[i]) ? arr[i] : out[i-1];
    out[i] = v * k + out[i-1] * (1-k);
  }
  return out;
}
function macd(closes, f=12, s=26, sig=9) {
  const ef = ema(closes,f), es = ema(closes,s);
  const m = ef.map((v,i) => (v!=null&&es[i]!=null) ? v-es[i] : null);
  const sl = ema(m.map(v=>v??0), sig);
  return { m, sl };
}
function rsi(closes, p=14) {
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
function stoch(highs, lows, closes, p=14) {
  const rawK = closes.map((c,i) => {
    if (i<p-1) return null;
    const hh=Math.max(...highs.slice(i-p+1,i+1));
    const ll=Math.min(...lows.slice(i-p+1,i+1));
    return hh===ll ? 50 : (c-ll)/(hh-ll)*100;
  });
  const kArr = ema(rawK, 3);
  const dArr = ema(kArr.map(v=>v??0), 3);
  return { k: kArr, d: dArr };
}
function resample(ts, opens, highs, lows, closes, vols, freq) {
  const groups = {};
  ts.forEach((t, i) => {
    const d = new Date(t * 1000);
    let key;
    if (freq === 'W') {
      const day = d.getDay();
      const diff = d.getDate() - day + (day===0?-6:1);
      const mo = new Date(+d); mo.setDate(diff);
      key = mo.toISOString().slice(0,10);
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    }
    if (!groups[key]) {
      groups[key] = { o: opens[i], h: highs[i], l: lows[i], c: closes[i], v: vols[i] };
    } else {
      groups[key].h = Math.max(groups[key].h, highs[i]);
      groups[key].l = Math.min(groups[key].l, lows[i]);
      groups[key].c = closes[i];
      groups[key].v += vols[i];
    }
  });
  const keys = Object.keys(groups).sort();
  return {
    dates:  keys,
    opens:  keys.map(k=>groups[k].o),
    highs:  keys.map(k=>groups[k].h),
    lows:   keys.map(k=>groups[k].l),
    closes: keys.map(k=>groups[k].c),
    vols:   keys.map(k=>groups[k].v),
  };
}

// ── Fetch Yahoo 10 años ──────────────────────
async function fetchData(ticker) {
  const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=10y&events=history`;
  let lastErr;
  for (const fn of PROXIES) {
    try {
      const r = await fetch(fn(yUrl), { signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 15000); return c.signal; })() });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = JSON.parse(await r.text());
      if (j.chart?.error) throw new Error(j.chart.error.description);
      const res = j.chart.result[0];
      const q = res.indicators.quote[0];
      const adj = res.indicators.adjclose?.[0]?.adjclose || q.close;
      const ratio = adj.map((a,i) => (q.close[i]&&a) ? a/q.close[i] : 1);
      return {
        name: res.meta.longName || ticker,
        timestamps: res.timestamp,
        opens:  q.open.map((v,i) => v*ratio[i]),
        highs:  q.high.map((v,i) => v*ratio[i]),
        lows:   q.low.map((v,i)  => v*ratio[i]),
        closes: adj,
        vols:   q.volume,
      };
    } catch(e) { lastErr=e; }
  }
  throw lastErr || new Error('Sin conexión');
}

// ── Motor de backtesting (copiado exacto) ────
function runEngine(raw, entryMode, exitMode) {
  const { timestamps, opens, highs, lows, closes, vols } = raw;

  const W = resample(timestamps, opens, highs, lows, closes, vols, 'W');
  const M = resample(timestamps, opens, highs, lows, closes, vols, 'M');

  // Indicadores MENSUAL
  const m_macd  = macd(M.closes);
  const m_s89   = stoch(M.highs, M.lows, M.closes, 89);
  const m_s8    = stoch(M.highs, M.lows, M.closes, 8);
  const m_rsi   = rsi(M.closes, 14);
  const m_sma10 = ema(M.closes, 10);
  // Indicadores SEMANAL
  const w_macd  = macd(W.closes);
  const w_s89   = stoch(W.highs, W.lows, W.closes, 89);
  const w_rsi   = rsi(W.closes, 14);
  const w_sma20 = ema(W.closes, 20);
  const w_sma10 = ema(W.closes, 10);
  const w_sma5  = ema(W.closes, 5);
  const w_rsi5  = rsi(W.closes, 5);
  // Indicadores DIARIO
  const d_macd  = macd(closes);
  const d_rsi14 = rsi(closes, 14);
  const d_rsi5  = rsi(closes, 5);
  const d_sma5  = ema(closes, 5);
  const d_sma10 = ema(closes, 10);
  const d_sma20 = ema(closes, 20);

  function getMonthIdx(dateStr) {
    const key = dateStr.slice(0,7);
    const idx = M.dates.indexOf(key);
    return idx >= 0 ? idx : M.dates.length - 1;
  }
  function getWeekIdx(ts) {
    const d = new Date(ts*1000);
    const day = d.getDay();
    const diff = d.getDate()-day+(day===0?-6:1);
    const mo = new Date(+d); mo.setDate(diff);
    const key = mo.toISOString().slice(0,10);
    const idx = W.dates.indexOf(key);
    return idx >= 0 ? idx : W.dates.length - 1;
  }
  function mensualOk(mi) {
    if (mi < 0 || mi >= M.closes.length) return false;
    const macdOk = m_macd.m[mi]>0 && m_macd.m[mi]>m_macd.sl[mi];
    const s89Ok  = (m_s89.k[mi]>80 && m_s89.k[mi]>m_s89.d[mi]) || m_s89.k[mi]>92;
    const rsiOk  = m_rsi[mi]>65;
    const s8Ok   = m_s8.k[mi]>78;
    const pOk    = M.closes[mi]>m_sma10[mi];
    return macdOk && s89Ok && rsiOk && s8Ok && pOk;
  }
  function semanalOk(wi) {
    if (wi < 0 || wi >= W.closes.length) return false;
    const macdOk = w_macd.m[wi]>0 && w_macd.m[wi]>w_macd.sl[wi];
    const s89Ok  = (w_s89.k[wi]>85 && w_s89.k[wi]>w_s89.d[wi]) || w_s89.k[wi]>92;
    const rsiOk  = w_rsi[wi]>67;
    const pOk    = W.closes[wi]>w_sma20[wi];
    return macdOk && s89Ok && rsiOk && pOk;
  }

  const trades = [];
  let inTrade = false;
  let entryPrice = 0, entryDate = '', entryIdx = 0;
  let equity = 100;
  const equityCurve = [{ date: '', val: 100 }];
  const n = closes.length;
  let i = 100; // warmup

  while (i < n) {
    const ts = timestamps[i];
    const dateStr = new Date(ts*1000).toISOString().slice(0,10);
    const mi = getMonthIdx(dateStr);
    const wi = getWeekIdx(ts);

    if (!inTrade) {
      const mOk = mensualOk(mi);
      const wOk = semanalOk(wi);
      const skipFiltros = (entryMode === 'canal');

      if ((skipFiltros || (mOk && wOk)) && i > 0) {
        let señal = false;
        if (entryMode === 'macd') {
          const macdCross = d_macd.m[i] > d_macd.sl[i] && d_macd.m[i-1] <= d_macd.sl[i-1];
          señal = macdCross && d_rsi14[i] > 57 && d_macd.m[i] > 0;
        } else if (entryMode === 'sma5w') {
          const w_sma5_curr = w_sma5[wi];
          const w_sma5_prev = wi > 0 ? w_sma5[wi-1] : null;
          const w_close_curr = W.closes[wi];
          const w_close_prev = wi > 0 ? W.closes[wi-1] : null;
          señal = w_sma5_curr != null && w_sma5_prev != null &&
                  w_close_curr > w_sma5_curr && w_close_prev <= w_sma5_prev;
        } else if (entryMode === 'sma5d') {
          const sma5_curr = d_sma5[i];
          const sma5_prev = d_sma5[i-1];
          señal = sma5_curr != null && sma5_prev != null &&
                  closes[i] > sma5_curr && closes[i-1] <= sma5_prev;
        } else if (entryMode === 'rsi5d') {
          const rsi5_curr = d_rsi5[i];
          const rsi5_prev = d_rsi5[i-1];
          señal = rsi5_curr != null && rsi5_prev != null &&
                  rsi5_curr > 60 && rsi5_prev <= 60;
        } else if (entryMode === 'rsi5w') {
          const w_stoch5 = stoch(W.highs, W.lows, W.closes, 5);
          señal = wi >= 2 &&
            (w_rsi5[wi-1] < 50 || w_rsi5[wi-2] < 50) &&
            w_stoch5.k[wi-1] < w_stoch5.k[wi-2] &&
            w_rsi5[wi] > 60 && w_rsi5[wi-1] <= 60 &&
            w_stoch5.k[wi] > w_stoch5.k[wi-1];
        } else if (entryMode === 'rsi5_pullback') {
          let estuvoFuerte = false;
          for(let j = i-10; j < i; j++) {
            if(j >= 0 && d_rsi5[j] > 60) { estuvoFuerte = true; break; }
          }
          señal = i >= 5 && estuvoFuerte &&
            d_rsi5[i-1] >= 38 && d_rsi5[i-1] <= 42 &&
            d_rsi5[i] > d_rsi5[i-1] && d_rsi5[i-1] < d_rsi5[i-2];
        } else if (entryMode === 'canal') {
          let canal = null;
          if(i >= 16) {
            const s = i-15, mxs = [];
            for(let j = s; j <= i; j++) {
              if(j > s && j < i && highs[j] > highs[j-1] && highs[j] > highs[j+1])
                mxs.push({idx:j, p:highs[j]});
            }
            if(mxs.length >= 2) {
              const m1=mxs[mxs.length-1], m2=mxs[mxs.length-2];
              const pm = (m1.p-m2.p)/(m1.idx-m2.idx);
              if(pm < 0) canal = m1.p + pm*(i-m1.idx);
            }
          }
          const d_vol_avg = ema(vols, 20);
          señal = i >= 25 && canal != null &&
            Math.abs(closes[i]-d_sma5[i])/d_sma5[i] < 0.03 &&
            closes[i] > canal && closes[i-1] <= canal &&
            vols[i] > d_vol_avg[i]*1.1 &&
            ((d_sma5[i] > d_sma10[i] && d_sma5[i-1] <= d_sma10[i-1]) ||
             (d_sma20[i] && d_sma5[i] > d_sma20[i] && d_sma5[i-1] <= d_sma20[i-1]));
        }

        if (señal) {
          inTrade = true;
          entryPrice = closes[i];
          entryDate = dateStr;
          entryIdx = i;
        }
      }
    } else {
      const wi_e = getWeekIdx(ts);
      let stopHit = false;
      if (exitMode === 'sma10w') {
        stopHit = w_sma10[wi_e] != null && W.closes[wi_e] != null && W.closes[wi_e] < w_sma10[wi_e];
      } else if (exitMode === 'sma10d') {
        stopHit = d_sma10[i] != null && closes[i] < d_sma10[i];
      }
      const d = new Date(ts*1000);
      const isWeekEnd = d.getDay() === 5;
      const mi_e = getMonthIdx(dateStr);
      const condsBroken = isWeekEnd && (!mensualOk(mi_e) || !semanalOk(wi_e));

      if (stopHit || condsBroken || i === n-1) {
        const exitPrice = closes[i];
        const pct = (exitPrice - entryPrice) / entryPrice * 100;
        const exitType = i === n-1 ? 'open' : stopHit ? 'sma' : 'cond';
        const bars = i - entryIdx;
        equity = equity * (1 + pct/100);
        equityCurve.push({ date: dateStr, val: equity });
        trades.push({
          n: trades.length + 1,
          entryDate, exitDate: dateStr,
          entryPrice, exitPrice, pct, exitType, bars, equity
        });
        inTrade = false;
      }
    }
    i++;
  }

  const wins = trades.filter(t => t.pct > 0);
  const losses = trades.filter(t => t.pct <= 0);
  const totalReturn = equity - 100;
  const winRate = trades.length ? wins.length/trades.length*100 : 0;
  const avgWin = wins.length ? wins.reduce((a,t)=>a+t.pct,0)/wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((a,t)=>a+t.pct,0)/losses.length : 0;
  const profitFactor = avgLoss !== 0 ? Math.abs((winRate/100*avgWin)/((1-winRate/100)*Math.abs(avgLoss))) : null;
  let peak = 100, maxDD = 0;
  equityCurve.forEach(p => {
    if (p.val > peak) peak = p.val;
    const dd = (peak-p.val)/peak*100;
    if (dd > maxDD) maxDD = dd;
  });

  return { trades, equityCurve, metrics: { totalReturn, winRate, avgWin, avgLoss, profitFactor, maxDD, nTrades: trades.length } };
}

// ── SVG Equity Curve ─────────────────────────
function equityChart(curve) {
  if (!curve || curve.length < 2) return '';
  const vals = curve.map(p => p.val);
  const W = 820, H = 180;
  const min = Math.min(...vals)*0.99, max = Math.max(...vals)*1.01, range = (max-min)||1;
  const toX = i => (i/(vals.length-1)*W).toFixed(1);
  const toY = v => (H-((v-min)/range*H)).toFixed(1);
  const pts = vals.map((v,i) => `${toX(i)},${toY(v)}`).join(' ');
  const last = vals[vals.length-1];
  const col = last >= 100 ? '#40d9c0' : '#f47174';
  const base100Y = toY(100);
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${col}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${base100Y}" x2="${W}" y2="${base100Y}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(base100Y)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Base 100</text>
    <polygon points="0,${H} ${pts} ${W},${H}" fill="url(#eg)"/>
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${W}" cy="${toY(last)}" r="4" fill="${col}"/>
  </svg>`;
}

const fmtPct = (n,d=2) => n!=null&&isFinite(n)?(n>=0?'+':'')+n.toFixed(d)+'%':'—';
const fmtE   = n => n!=null&&isFinite(n)?(n<0?'-':'')+'€'+Math.abs(n).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0}):'—';
const fmtDate = d => { if(!d) return '—'; const p=d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };

const ENTRY_NAMES = {
  sma5w: 'Rebote EMA5 Semanal',
  rsi5w: 'RSI5+Stoch5 Semanal',
  macd:  'MACD + RSI Diario',
  sma5d: 'Rebote EMA5 Diario',
  rsi5_pullback: 'RSI5 Pullback Diario',
  canal: 'Canal Bajista',
};
const EXIT_NAMES = {
  sma10w: 'Stop EMA10 Semanal',
  sma10d: 'Stop EMA10 Diario',
};

const CSS = `
.bt-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:20px;}
.bt-tab{padding:9px 18px;background:transparent;border:none;color:var(--text2);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);}
.bt-tab:hover{color:var(--text1);}
.bt-tab.active{color:var(--teal);border-bottom-color:var(--teal);}
.bt-wrap{font-family:var(--sans);}
.bt-config{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.bt-entry-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border);border-radius:6px;overflow:hidden;margin-bottom:14px;}
.bt-entry-btn{background:var(--surface);border:none;color:var(--text2);cursor:pointer;padding:12px 14px;text-align:left;font-family:var(--sans);border-top:2px solid transparent;transition:all 0.15s;}
.bt-entry-btn:hover{background:var(--surface2);color:var(--text1);}
.bt-entry-btn.active{color:var(--teal);border-top-color:var(--teal);background:var(--surface2);}
.bt-entry-btn .bn{font-size:9px;font-family:var(--mono);letter-spacing:0.1em;color:var(--text3);margin-bottom:4px;}
.bt-entry-btn .bl{font-size:11px;font-weight:600;margin-bottom:2px;}
.bt-entry-btn .bd{font-size:10px;color:var(--text3);line-height:1.4;}
.bt-entry-btn.active .bn{color:var(--teal);}
.bt-exit-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--border);border-radius:6px;overflow:hidden;margin-bottom:14px;}
.bt-exit-btn{background:var(--surface);border:none;color:var(--text2);cursor:pointer;padding:12px 14px;text-align:left;font-family:var(--sans);border-top:2px solid transparent;transition:all 0.15s;}
.bt-exit-btn:hover{background:var(--surface2);}
.bt-exit-btn.active{color:var(--red);border-top-color:var(--red);background:var(--surface2);}
.bt-exit-btn .bn{font-size:9px;font-family:var(--mono);letter-spacing:0.1em;color:var(--text3);margin-bottom:4px;}
.bt-exit-btn .bl{font-size:11px;font-weight:600;}
.bt-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-strip-cell{background:var(--surface);padding:14px 16px;}
.bt-strip-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.bt-strip-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.bt-strip-sub{font-size:10px;color:var(--text3);margin-top:3px;}
.bt-chart{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;}
.bt-table{width:100%;border-collapse:collapse;font-size:11px;}
.bt-table th{padding:8px 12px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.bt-table th:first-child,.bt-table td:first-child{text-align:left;}
.bt-table td{padding:9px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);text-align:right;color:var(--text2);}
.bt-table tbody tr:hover td{background:var(--surface2);}
.bt-best{background:rgba(64,217,192,0.06);border:1px solid rgba(64,217,192,0.3);border-left:4px solid var(--teal);border-radius:10px;padding:18px 22px;margin-bottom:16px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;}
.bt-combo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-combo-cell{background:var(--surface);padding:12px 14px;cursor:pointer;border-top:2px solid transparent;transition:all 0.15s;}
.bt-combo-cell:hover{background:var(--surface2);}
.bt-combo-cell.best{border-top-color:var(--teal);background:var(--surface2);}
`;

export async function render(container, { actionsSlot }) {
  if (!document.getElementById('bt-css')) {
    const s = document.createElement('style'); s.id = 'bt-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  actionsSlot.innerHTML = '';
  container.innerHTML = `<div class="bt-wrap" id="bt-wrap"></div>`;

  let activeTab = 'backtesting';
  let entrySystem = 'sma5w';
  let exitSystem  = 'sma10w';

  // ── Cartera Real vs Sistema ──────────────────────
  async function renderCarteraReal() {
    const el = document.getElementById('bt-real-content');
    if (!el) return;
    el.innerHTML = `<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando cartera real...</div></div>`;

    const { UserData } = await import('../../userdata.js');
    const [history, positions] = await Promise.all([
      UserData.get('ethan_positions_history').then(v => v || []),
      UserData.get('ethan_positions').then(v => v || []),
    ]);

    const allOps = [
      ...history.map(h => ({ ...h, estado: 'cerrada' })),
      ...positions.map(p => ({ ...p, estado: 'abierta', pnlPct: null, pnlAbs: null })),
    ].sort((a,b) => (a.entryDateISO||a.entryDate||'').localeCompare(b.entryDateISO||b.entryDate||''));

    if (!allOps.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Sin operaciones en cartera</div></div>';
      return;
    }

    // ── Ratio de Información ─────────────────────
    const closedOps = history.filter(h => h.pnlPct != null);
    const nOps = closedOps.length;
    const avgReturn = nOps ? closedOps.reduce((s,h)=>s+(h.pnlPct||0),0)/nOps : 0;
    // SPY benchmark: aproximamos ~15% anual → ~0.3% por operación media de 15 días
    const benchmarkPerOp = 0.3;
    const alphaPerOp = closedOps.map(h => (h.pnlPct||0) - benchmarkPerOp);
    const avgAlpha = alphaPerOp.length ? alphaPerOp.reduce((a,b)=>a+b,0)/alphaPerOp.length : 0;
    const trackingError = alphaPerOp.length > 1
      ? Math.sqrt(alphaPerOp.reduce((s,a)=>s+(a-avgAlpha)**2,0)/(alphaPerOp.length-1))
      : null;
    const infoRatio = trackingError ? avgAlpha / trackingError : null;
    const irColor = infoRatio == null ? 'var(--text3)' : infoRatio > 0.5 ? 'var(--green)' : infoRatio > 0 ? 'var(--amber)' : 'var(--red)';
    const irLabel = infoRatio == null ? '—' : infoRatio > 0.5 ? 'Sistema robusto' : infoRatio > 0 ? 'Alpha positivo' : 'Alpha negativo';

    // ── Stats reales ─────────────────────────────
    const wins = closedOps.filter(h => (h.pnlPct||0) > 0);
    const losses = closedOps.filter(h => (h.pnlPct||0) <= 0);
    const winRate = nOps ? wins.length/nOps : 0;
    const avgWin = wins.length ? wins.reduce((s,h)=>s+(h.pnlPct||0),0)/wins.length : 0;
    const avgLoss = losses.length ? Math.abs(losses.reduce((s,h)=>s+(h.pnlPct||0),0)/losses.length) : 0;
    const totalPnl = closedOps.reduce((s,h)=>s+(h.pnlAbs||0),0);

    el.innerHTML = `
      <!-- Ratio de Información -->
      <div class="bt-config" style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;margin-bottom:16px;">📐 Ratio de Información</div>
        <div class="bt-strip" style="margin-bottom:12px;">
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Ratio de Información</div>
            <div class="bt-strip-val" style="color:${irColor};">${infoRatio!=null?infoRatio.toFixed(2):'N/A'}</div>
            <div class="bt-strip-sub">${irLabel}</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Alpha medio/op</div>
            <div class="bt-strip-val" style="color:${avgAlpha>=0?'var(--green)':'var(--red)'};">${avgAlpha>=0?'+':''}${avgAlpha.toFixed(2)}%</div>
            <div class="bt-strip-sub">vs benchmark ~0.3%/op</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Tracking Error</div>
            <div class="bt-strip-val">${trackingError!=null?trackingError.toFixed(2)+'%':'—'}</div>
            <div class="bt-strip-sub">dispersión del alpha</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Operaciones</div>
            <div class="bt-strip-val">${nOps}</div>
            <div class="bt-strip-sub">${nOps < 30 ? '⚠ <30 — muestra pequeña' : '✓ Muestra suficiente'}</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Win Rate real</div>
            <div class="bt-strip-val" style="color:${winRate>=0.5?'var(--green)':'var(--red)'};">${(winRate*100).toFixed(0)}%</div>
            <div class="bt-strip-sub">${wins.length}G / ${losses.length}P</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">P&L Total</div>
            <div class="bt-strip-val" style="color:${totalPnl>=0?'var(--green)':'var(--red)'};">${fmtE(totalPnl)}</div>
            <div class="bt-strip-sub">realizado</div>
          </div>
        </div>
        ${nOps < 30 ? `<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:10px 14px;font-size:11px;color:var(--amber);font-family:var(--mono);">
          ⚠ Con ${nOps} operaciones el Ratio de Información no es estadísticamente significativo. Se necesitan mínimo 30 operaciones para una conclusión fiable.
          ${nOps > 0 ? ` Faltan ${30-nOps} operaciones.` : ''}
        </div>` : `<div style="font-size:11px;color:var(--text2);font-family:var(--mono);">
          ${infoRatio > 0.5 ? '✅ IR > 0.5 — tu alpha es consistente y estadísticamente significativo. Tu sistema genera valor real.' :
            infoRatio > 0 ? '🟡 IR entre 0 y 0.5 — alpha positivo pero con alta variabilidad. Sigue acumulando operaciones.' :
            '🔴 IR negativo — el sistema no está generando alpha sobre el benchmark. Revisar el edge.'}
        </div>`}

        <!-- Explicación didáctica -->
        <div style="background:var(--surface2);border-radius:8px;padding:14px 16px;margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Qué es el Ratio de Información?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">Mide si tu alpha es <strong style="color:var(--text1);">consistente o aleatorio</strong>. Es el estándar de la industria para evaluar si un sistema de trading tiene edge real. IR = Alpha medio / Tracking Error.</div>
          </div>
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Qué significa cada métrica?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">
              <strong style="color:var(--text1);">Alpha medio/op</strong> — cuánto superas al benchmark por operación. Positivo = bates al mercado.<br>
              <strong style="color:var(--text1);">Tracking Error</strong> — dispersión de ese alpha. Alto = inconsistente, bajo = fiable.
            </div>
          </div>
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Cómo interpretar el IR?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">
              <span style="color:var(--green);">IR &gt; 0.5</span> → Sistema robusto, edge real<br>
              <span style="color:var(--amber);">IR 0–0.5</span> → Alpha positivo pero variable<br>
              <span style="color:var(--red);">IR &lt; 0</span> → Sin edge, revisar el sistema<br>
              <span style="color:var(--text3);">Benchmark</span> → 0.3%/op ≈ 15% anual SPY
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de operaciones reales -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);">
          <div style="font-size:13px;font-weight:600;">Historial de operaciones reales · ${nOps} cerradas · ${positions.length} abiertas</div>
          <div style="font-size:11px;color:var(--text2);margin-top:4px;">Alpha = P&L real − benchmark estimado (0.3%/op ≈ 15% anual / ~50 ops). Positivo = batiste al mercado en esa operación.</div>
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>#</th><th>Ticker</th><th>Entrada</th><th>Salida</th>
            <th>Días</th><th>P&L %</th><th>P&L €</th>
            <th class="r">Alpha vs bench</th><th>Estado</th>
          </tr></thead>
          <tbody>
            ${allOps.map((op, i) => {
              const dias = op.entryDateISO && op.exitDateISO
                ? Math.round((new Date(op.exitDateISO)-new Date(op.entryDateISO))/86400000) : null;
              const pnlPct = op.pnlPct ?? null;
              const alpha = pnlPct != null ? pnlPct - benchmarkPerOp : null;
              const col = pnlPct != null ? (pnlPct>=0?'var(--green)':'var(--red)') : 'var(--text2)';
              const alphaCol = alpha != null ? (alpha>0?'var(--green)':'var(--red)') : 'var(--text3)';
              return `<tr>
                <td style="color:var(--text3);">${i+1}</td>
                <td style="font-weight:700;">${op.ticker||'—'}</td>
                <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${op.entryDateISO||op.entryDate||'—'}</td>
                <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${op.exitDateISO||'—'}</td>
                <td>${dias!=null?dias+'d':'—'}</td>
                <td style="color:${col};font-weight:700;">${pnlPct!=null?(pnlPct>=0?'+':'')+pnlPct.toFixed(2)+'%':'—'}</td>
                <td style="color:${col};font-weight:700;font-family:var(--mono);">${op.pnlAbs!=null?fmtE(op.pnlAbs):'—'}</td>
                <td style="text-align:right;color:${alphaCol};font-family:var(--mono);">${alpha!=null?(alpha>=0?'+':'')+alpha.toFixed(2)+'%':'—'}</td>
                <td><span style="font-size:9px;padding:2px 8px;border-radius:3px;background:${op.estado==='cerrada'?'rgba(74,222,128,0.1)':'rgba(95,168,224,0.1)'};color:${op.estado==='cerrada'?'var(--green)':'var(--blue)'};">${op.estado==='cerrada'?'Cerrada':'Abierta'}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ── Tabs ────────────────────────────────────────
  function renderTabs() {
    return `<div class="bt-tabs">
      <button class="bt-tab ${activeTab==='backtesting'?'active':''}" data-tab="backtesting">📊 Backtesting Valores</button>
      <button class="bt-tab ${activeTab==='ethan'?'active':''}" data-tab="ethan">🤖 Backtesting ETHAN</button>
      <button class="bt-tab ${activeTab==='cartera-real'?'active':''}" data-tab="cartera-real">🎯 Cartera Real · Ratio de Información</button>
    </div>`;
  }

  function attachTabListeners() {
    document.querySelectorAll('.bt-tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        renderMain();
      });
    });
  }

  async function renderMain() {
    const el = document.getElementById('bt-wrap');
    if (activeTab === 'backtesting') {
      el.innerHTML = renderTabs() + renderConfig();
      attachTabListeners();
      attachListeners();
    } else if (activeTab === 'ethan') {
      el.innerHTML = renderTabs() + renderEthanConfig();
      attachTabListeners();
      attachEthanListeners();
    } else {
      el.innerHTML = renderTabs() + '<div id="bt-real-content"></div>';
      attachTabListeners();
      await renderCarteraReal();
    }
  }

  function renderConfig() {
    const entries = [
      { id:'sma5w', n:'SISTEMA 01', l:'Rebote EMA5 Semanal', d:'Precio cruza por encima de EMA5 semanal' },
      { id:'rsi5w', n:'SISTEMA 02', l:'RSI5+Stoch5 Semanal', d:'RSI5 < 50 y Stoch cayendo, luego rebote' },
      { id:'macd',  n:'SISTEMA 03', l:'MACD + RSI Diario',   d:'MACD cruza al alza + RSI14 > 57' },
      { id:'sma5d', n:'SISTEMA 04', l:'Rebote EMA5 Diario',  d:'Precio cruza por encima de EMA5 diaria' },
      { id:'rsi5_pullback', n:'SISTEMA 05', l:'RSI5 Pullback Diario', d:'RSI5 > 60 → 40 → rebota' },
      { id:'canal', n:'SISTEMA 06', l:'Canal Bajista', d:'Ruptura canal bajista + volumen' },
    ];
    const exits = [
      { id:'sma10w', n:'SALIDA 01', l:'EMA10 Semanal', d:'Cierre semanal < EMA10 semanal' },
      { id:'sma10d', n:'SALIDA 02', l:'EMA10 Diaria',  d:'Cierre diario < EMA10 diaria' },
    ];
    return `
      <div class="bt-config">
        <div style="display:flex;gap:10px;margin-bottom:14px;align-items:center;">
          <input type="text" id="bt-ticker" class="wl-input" placeholder="Ticker (ej. AAPL)" style="width:200px;text-transform:uppercase;">
          <button class="btn btn-primary" id="bt-run-btn" style="min-width:140px;">▶ Ejecutar backtest</button>
          <span id="bt-status" style="font-family:var(--mono);font-size:11px;color:var(--text3);"></span>
        </div>
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Sistema de entrada</div>
        <div class="bt-entry-grid">
          ${entries.map(e => `<button class="bt-entry-btn ${entrySystem===e.id?'active':''}" data-entry="${e.id}">
            <div class="bn">${e.n}</div>
            <div class="bl">${e.l}</div>
            <div class="bd">${e.d}</div>
          </button>`).join('')}
        </div>
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Sistema de salida</div>
        <div class="bt-exit-grid">
          ${exits.map(e => `<button class="bt-exit-btn ${exitSystem===e.id?'active':''}" data-exit="${e.id}">
            <div class="bn">${e.n}</div>
            <div class="bl">${e.l}</div>
          </button>`).join('')}
        </div>
        <div style="font-size:10px;color:var(--text3);">Condiciones M+S: Mensual (MACD↑, Stoch89>80, RSI>65, Stoch8>78, P>EMA10) + Semanal (MACD↑, Stoch89>85, RSI>67, P>EMA20)</div>
      </div>`;
  }

  function attachListeners() {
    document.querySelectorAll('.bt-entry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        entrySystem = btn.dataset.entry;
        document.querySelectorAll('.bt-entry-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    document.querySelectorAll('.bt-exit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        exitSystem = btn.dataset.exit;
        document.querySelectorAll('.bt-exit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('bt-run-btn')?.addEventListener('click', async () => {
      const ticker = (document.getElementById('bt-ticker')?.value || '').trim().toUpperCase();
      if (!ticker) return;
      const btn = document.getElementById('bt-run-btn');
      const st  = document.getElementById('bt-status');
      btn.disabled = true; btn.textContent = '⏳ Descargando...';
      if (st) st.textContent = `Obteniendo 10 años de ${ticker}...`;
      try {
        const raw = await fetchData(ticker);
        // Limpiar nulos
        const valid = raw.timestamps.map((_,i)=>i).filter(i =>
          raw.closes[i]!=null && raw.highs[i]!=null && raw.lows[i]!=null && !isNaN(raw.closes[i])
        );
        const clean = {
          timestamps: valid.map(i=>raw.timestamps[i]),
          opens:  valid.map(i=>raw.opens[i]),
          highs:  valid.map(i=>raw.highs[i]),
          lows:   valid.map(i=>raw.lows[i]),
          closes: valid.map(i=>raw.closes[i]),
          vols:   valid.map(i=>raw.vols[i]),
        };
        if (st) st.textContent = 'Probando 12 combinaciones...';
        await new Promise(r => setTimeout(r, 50));

        // Ejecutar todas las combinaciones
        const entries = ['sma5w','rsi5w','macd','sma5d','rsi5_pullback','canal'];
        const exits   = ['sma10w','sma10d'];
        const allResults = [];
        for (const en of entries) {
          for (const ex of exits) {
            const r = runEngine(clean, en, ex);
            allResults.push({ entry: en, exit: ex, result: r });
          }
        }
        // Resultado seleccionado
        const selected = allResults.find(r => r.entry===entrySystem && r.exit===exitSystem) || allResults[0];
        // Mejor combinación
        const best = allResults.reduce((b,r) =>
          r.result.metrics.totalReturn > b.result.metrics.totalReturn ? r : b
        );

        paintResults(selected.result, best, allResults, ticker, raw.name || ticker);
        if (st) st.textContent = `✓ Mejor: ${ENTRY_NAMES[best.entry]} + ${EXIT_NAMES[best.exit]}`;
      } catch(e) {
        if (st) st.textContent = '⚠ ' + e.message.slice(0,50);
        console.error(e);
      }
      btn.disabled = false; btn.textContent = '▶ Ejecutar backtest';
    });
  }

  function paintResults(result, best, allResults, ticker, name) {
    const el = document.getElementById('bt-wrap');
    const { trades, equityCurve, metrics: m } = result;
    const { totalReturn, winRate, avgWin, avgLoss, profitFactor, maxDD, nTrades } = m;
    const retCol = totalReturn>=0?'var(--green)':'var(--red)';
    const bm = best.result.metrics;

    // Grid comparativa de combinaciones
    const comboGrid = ['sma5w','rsi5w','macd','sma5d'].map(en => {
      return ['sma10w','sma10d'].map(ex => {
        const r = allResults.find(r=>r.entry===en&&r.exit===ex);
        const ret = r?.result.metrics.totalReturn;
        const wr  = r?.result.metrics.winRate;
        const nt  = r?.result.metrics.nTrades || 0;
        const isBest = best.entry===en && best.exit===ex;
        const rc = ret==null?'var(--text3)':ret>=0?'var(--green)':'var(--red)';
        return `<div class="bt-combo-cell ${isBest?'best':''}" data-entry="${en}" data-exit="${ex}" style="cursor:pointer;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:6px;">${ENTRY_NAMES[en].slice(0,18)} · ${EXIT_NAMES[ex].slice(5,12)}${isBest?' ★':''}</div>
          <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:${rc};">${ret!=null?(ret>=0?'+':'')+ret.toFixed(1)+'%':'—'}</div>
          <div style="font-size:10px;color:var(--text3);">${nt} ops · WR ${wr!=null?wr.toFixed(0)+'%':'—'}</div>
        </div>`;
      }).join('');
    }).join('');

    el.innerHTML = renderTabs() + renderConfig() + `
      <!-- Mejor combinación -->
      <div class="bt-best">
        <div style="font-size:28px;">★</div>
        <div>
          <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">MEJOR COMBINACIÓN</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px;">${ENTRY_NAMES[best.entry]} + ${EXIT_NAMES[best.exit]}</div>
          <div style="font-size:11px;color:var(--text2);">
            Rentabilidad: <strong style="color:var(--green);">${bm.totalReturn>=0?'+':''}${bm.totalReturn.toFixed(1)}%</strong> ·
            Win Rate: <strong>${bm.winRate.toFixed(1)}%</strong> ·
            Profit Factor: <strong>${bm.profitFactor!=null?bm.profitFactor.toFixed(2):'∞'}</strong> ·
            ${bm.nTrades} ops · Max DD: <strong style="color:var(--red);">-${bm.maxDD.toFixed(1)}%</strong>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--teal);">${bm.totalReturn>=0?'+':''}${bm.totalReturn.toFixed(1)}%</div>
          <div style="font-size:10px;color:var(--text3);">rentabilidad total</div>
        </div>
      </div>

      <!-- Grid comparativa -->
      <div class="bt-combo-grid">${comboGrid}</div>

      <!-- KPIs resultado seleccionado -->
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:8px;">${ENTRY_NAMES[entrySystem]} + ${EXIT_NAMES[exitSystem]} — ${ticker} (${name})</div>
      <div class="bt-strip">
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Rentabilidad</div><div class="bt-strip-val" style="color:${retCol};">${totalReturn>=0?'+':''}${totalReturn.toFixed(1)}%</div><div class="bt-strip-sub">sobre base 100</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Operaciones</div><div class="bt-strip-val">${nTrades}</div><div class="bt-strip-sub">${trades.filter(t=>t.pct>0).length}G · ${trades.filter(t=>t.pct<=0).length}P</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Win Rate</div><div class="bt-strip-val" style="color:${winRate>=50?'var(--green)':'var(--red)'};">${winRate.toFixed(1)}%</div><div class="bt-strip-sub">operaciones</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Media Ganancia</div><div class="bt-strip-val" style="color:var(--green);">+${avgWin.toFixed(1)}%</div><div class="bt-strip-sub">pérdida: ${avgLoss.toFixed(1)}%</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Profit Factor</div><div class="bt-strip-val" style="color:${profitFactor&&profitFactor>=1?'var(--green)':'var(--red)'};">${profitFactor!=null?profitFactor.toFixed(2):'∞'}</div><div class="bt-strip-sub">G/P ratio</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Máx. Drawdown</div><div class="bt-strip-val" style="color:var(--red);">-${maxDD.toFixed(1)}%</div><div class="bt-strip-sub">caída máxima</div></div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${ticker} · Equity Curve · Base 100</div>
        ${equityChart(equityCurve)}
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">${nTrades} operaciones simuladas</div>
        ${nTrades > 0 ? `<table class="bt-table">
          <thead><tr>
            <th>#</th><th>Entrada</th><th>Salida</th>
            <th>P.Entrada</th><th>P.Salida</th>
            <th>Resultado</th><th>Días</th><th>Motivo</th>
          </tr></thead>
          <tbody>
            ${trades.map(t => {
              const col = t.pct>=0?'var(--green)':'var(--red)';
              const motivo = t.exitType==='sma'?'Stop EMA':t.exitType==='cond'?'Conds. rotas':'Abierta';
              return `<tr>
                <td>${t.n}</td>
                <td>${fmtDate(t.entryDate)}</td>
                <td>${fmtDate(t.exitDate)}</td>
                <td>$${t.entryPrice.toFixed(2)}</td>
                <td>$${t.exitPrice.toFixed(2)}</td>
                <td style="color:${col};font-weight:700;">${t.pct>=0?'+':''}${t.pct.toFixed(2)}%</td>
                <td>${t.bars}d</td>
                <td><span style="font-size:9px;padding:2px 7px;border-radius:3px;background:${t.exitType==='sma'?'rgba(244,113,116,0.1)':t.exitType==='cond'?'rgba(251,191,36,0.1)':'rgba(95,168,224,0.1)'};color:${t.exitType==='sma'?'var(--red)':t.exitType==='cond'?'var(--amber)':'var(--blue)'};">${motivo}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>` : '<div style="padding:30px;text-align:center;color:var(--text3);font-family:var(--mono);">Sin operaciones en el período analizado</div>'}
      </div>`;

    attachListeners();
    attachTabListeners();
    // Clicks en combo grid para re-ejecutar con esa combinación
    document.querySelectorAll('.bt-combo-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        entrySystem = cell.dataset.entry;
        exitSystem  = cell.dataset.exit;
        document.getElementById('bt-ticker').value = ticker;
        document.getElementById('bt-run-btn').click();
      });
    });
  }


  // ════════════════════════════════════════════════════════════════
  // BACKTESTING ETHAN — Motor temporal completo
  // Arquitectura: Signal Close(t) → Execution Close(t+1)
  // Reutiliza lógica del Motor Integrado (Policy, waterfall, stops)
  // ════════════════════════════════════════════════════════════════

  // ── Helpers técnicos (mismos que motor.js) ─────────────────────
  function btEma(arr, p) {
    const k=2/(p+1); let s=arr.findIndex(v=>v!=null&&!isNaN(v));
    if(s<0)return arr.map(()=>null);
    const out=arr.map(()=>null); out[s]=arr[s];
    for(let i=s+1;i<arr.length;i++){const v=arr[i]??out[i-1]; out[i]=v*k+out[i-1]*(1-k);}
    return out;
  }
  function btMacd(c){const e12=btEma(c,12),e26=btEma(c,26);const m=e12.map((v,i)=>v!=null&&e26[i]!=null?v-e26[i]:null);return{m,sl:btEma(m.map(v=>v??0),9)};}
  function btRsi(c,p=14){const out=c.map(()=>null);if(c.length<p+1)return out;let g=0,l=0;for(let i=1;i<=p;i++){const d=c[i]-c[i-1];d>0?g+=d:l-=d;}let ag=g/p,al=l/p;out[p]=al===0?100:100-(100/(1+ag/al));for(let i=p+1;i<c.length;i++){const d=c[i]-c[i-1];ag=(ag*(p-1)+(d>0?d:0))/p;al=(al*(p-1)+(d<0?-d:0))/p;out[i]=al===0?100:100-(100/(1+ag/al));}return out;}
  function btStoch(H,L,C,p=8){return C.map((c,i)=>{if(i<p-1)return null;const hh=Math.max(...H.slice(i-p+1,i+1)),ll=Math.min(...L.slice(i-p+1,i+1));return hh===ll?50:(c-ll)/(hh-ll)*100;});}
  function btDDMult(dd, ddScale){const d=Math.abs(dd);if(d<=0.03)return ddScale[0];if(d<=0.05)return ddScale[1];if(d<=0.08)return ddScale[2];if(d<=0.10)return ddScale[3];return ddScale[4];}
  function btAnnVol(rets){if(rets.length<2)return 0;const m=rets.reduce((a,b)=>a+b,0)/rets.length;return Math.sqrt(rets.reduce((a,b)=>a+(b-m)**2,0)/rets.length)*Math.sqrt(252);}
  function btSharpe(rets,rf=0.05){const m=rets.reduce((a,b)=>a+b,0)/rets.length*252;const v=btAnnVol(rets);return v>0?(m-rf)/v:0;}
  function btSortino(rets,rf=0.05){const m=rets.reduce((a,b)=>a+b,0)/rets.length*252;const neg=rets.filter(r=>r<0);const dv=neg.length>0?Math.sqrt(neg.reduce((a,b)=>a+b**2,0)/neg.length)*Math.sqrt(252):0;return dv>0?(m-rf)/dv:0;}
  function btMaxDD(curve){let peak=curve[0],mdd=0;for(const v of curve){if(v>peak)peak=v;const dd=(v-peak)/peak;if(dd<mdd)mdd=dd;}return mdd;}
  function btCAGR(start,end,days){return days>0?Math.pow(end/start,365/days)-1:0;}

  // ── Señales de entrada (mismas reglas que Backtesting Valores) ──
  function btCheckEntry(closes, highs, lows, i, systems) {
    if (i < 30) return null;
    const c = closes; const H = highs; const L = lows;
    const ema5  = btEma(c, 5);
    const ema10 = btEma(c, 10);
    const macd  = btMacd(c);
    const rsi14 = btRsi(c, 14);
    const rsi5  = btRsi(c, 5);
    const stoch = btStoch(H, L, c, 8);

    if (systems.sma5d && i >= 1 && ema5[i] != null && c[i] > ema5[i] && c[i-1] <= ema5[i-1]) return 'EMA5D';
    if (systems.macd  && i >= 1 && macd.m[i] != null && macd.sl[i] != null &&
        macd.m[i] > macd.sl[i] && macd.m[i-1] <= macd.sl[i-1] && rsi14[i] > 55) return 'MACD_RSI';
    if (systems.rsi5_pullback && rsi5[i] != null && rsi5[i-1] != null &&
        rsi5[i] > 40 && rsi5[i-1] < 40) return 'RSI5_PB';
    return null;
  }

  // ── Señales de salida ───────────────────────────────────────────
  function btCheckExit(pos, closePrice, ema10) {
    // Stop por EMA10 diario
    if (pos.direction === 'long' && ema10 != null && closePrice < ema10) return 'EMA10D';
    // Stop fijo inicial
    if (pos.direction === 'long' && pos.activeStop > 0 && closePrice < pos.activeStop) return 'STOP';
    return null;
  }

  // ── Motor temporal principal ────────────────────────────────────
  function runEthanBacktest(universeData, config) {
    const { policy, initialCapital, benchmark, costs, startDate, endDate, systems } = config;
    const { tradeRisk, portRisk, ddScale, maxAssetNav, maxSectorNav,
            corePct, satPct, coreRisk, satRisk } = policy;

    // Unificar fechas del universo
    const allDates = [...new Set(
      Object.values(universeData).flatMap(d => d.map(r => r.date))
    )].filter(d => d >= startDate && d <= endDate).sort();

    if (allDates.length < 20) throw new Error('Datos insuficientes para el período seleccionado');

    // Estado de la simulación
    let nav = initialCapital;
    let cash = initialCapital;
    let hwm  = initialCapital;
    let openPositions = [];
    const closedTrades = [];
    const navCurve = [{ date: allDates[0], nav: initialCapital }];
    const dailyReturns = [];

    // Precalcular indicadores para cada ticker
    const indicators = {};
    for (const [ticker, rows] of Object.entries(universeData)) {
      const closes = rows.map(r => r.close);
      const highs  = rows.map(r => r.high);
      const lows   = rows.map(r => r.low);
      indicators[ticker] = {
        rows, closes, highs, lows,
        ema5:  btEma(closes, 5),
        ema10: btEma(closes, 10),
        macd:  btMacd(closes),
        rsi14: btRsi(closes, 14),
      };
    }

    // Iterar día a día
    for (let di = 1; di < allDates.length; di++) {
      const date = allDates[di];
      const prevDate = allDates[di - 1];
      const prevNav = nav;

      // 1. Actualizar precios y P&L de posiciones abiertas
      let unrealPnl = 0;
      for (const pos of openPositions) {
        const ind = indicators[pos.ticker];
        if (!ind) continue;
        const rowIdx = ind.rows.findIndex(r => r.date === date);
        if (rowIdx < 0) continue;
        const curPrice = ind.closes[rowIdx];
        pos.currentPrice = curPrice;
        // Actualizar stop activo (EMA10)
        const ema10 = ind.ema10[rowIdx];
        if (ema10 != null && pos.direction === 'long' && ema10 > pos.activeStop) {
          pos.activeStop = ema10;
        }
        unrealPnl += (curPrice - pos.entryPrice) * pos.shares;
      }

      // 2. NAV actual
      const investedVal = openPositions.reduce((s, p) => s + p.currentPrice * p.shares, 0);
      nav = cash + investedVal;
      const dd = hwm > 0 ? (nav - hwm) / hwm : 0;
      if (nav > hwm) hwm = nav;

      // 3. Ejecutar salidas — Signal was at prevDate, execution at date (t+1)
      const toClose = [];
      for (const pos of openPositions) {
        const ind = indicators[pos.ticker];
        if (!ind) continue;
        const rowIdx = ind.rows.findIndex(r => r.date === prevDate); // señal en t
        if (rowIdx < 0) continue;
        const ema10 = ind.ema10[rowIdx];
        const exitSignal = btCheckExit(pos, ind.closes[rowIdx], ema10);
        if (exitSignal) {
          // Ejecutar al cierre de date (t+1)
          const execRowIdx = ind.rows.findIndex(r => r.date === date);
          const exitPrice = execRowIdx >= 0 ? ind.closes[execRowIdx] : pos.currentPrice;
          const slippage = exitPrice * (costs.slippage / 100);
          const effectiveExit = pos.direction === 'long' ? exitPrice - slippage : exitPrice + slippage;
          const pnlAbs = (effectiveExit - pos.entryPrice) * pos.shares - costs.commission;
          const pnlPct = pnlAbs / (pos.entryPrice * pos.shares);
          toClose.push({ ...pos, exitDate: date, exitPrice: effectiveExit, pnlAbs, pnlPct, exitSystem: exitSignal, holdingDays: di - pos.entryDayIdx });
          cash += effectiveExit * pos.shares - costs.commission;
        }
      }
      openPositions = openPositions.filter(p => !toClose.find(c => c.ticker === p.ticker && c.entryDate === p.entryDate));
      closedTrades.push(...toClose);

      // 4. Risk Budget disponible
      const openRiskGlobal = openPositions.reduce((s, p) => s + Math.max(0, p.entryPrice - p.activeStop) * p.shares, 0);
      const openRiskBuckets = { core: 0, sat: 0 };
      openPositions.forEach(p => { openRiskBuckets[p.bucket] = (openRiskBuckets[p.bucket]||0) + Math.max(0, p.entryPrice - p.activeStop) * p.shares; });
      const exposureByTicker = {};
      const exposureBySector = {};
      openPositions.forEach(p => {
        exposureByTicker[p.ticker] = (exposureByTicker[p.ticker]||0) + p.currentPrice * p.shares;
        exposureBySector[p.sector||'?'] = (exposureBySector[p.sector||'?']||0) + p.currentPrice * p.shares;
      });
      const budgetCore = nav * corePct;
      const budgetSat  = nav * satPct;
      const investedCore = openPositions.filter(p=>p.bucket==='core').reduce((s,p)=>s+p.currentPrice*p.shares,0);
      const investedSat  = openPositions.filter(p=>p.bucket==='sat').reduce((s,p)=>s+p.currentPrice*p.shares,0);

      // 5. Evaluar señales de entrada en t (prevDate) → ejecutar en date (t+1)
      if (cash > 0) {
        for (const [ticker, ind] of Object.entries(indicators)) {
          if (openPositions.find(p => p.ticker === ticker)) continue;
          const rowIdx = ind.rows.findIndex(r => r.date === prevDate);
          if (rowIdx < 0 || rowIdx < 30) continue;
          const entrySystem = btCheckEntry(ind.closes, ind.highs, ind.lows, rowIdx, systems);
          if (!entrySystem) continue;

          // Ejecución al cierre de date (t+1)
          const execRowIdx = ind.rows.findIndex(r => r.date === date);
          if (execRowIdx < 0) continue;
          const entryPrice = ind.closes[execRowIdx];
          const slippage = entryPrice * (costs.slippage / 100);
          const effectiveEntry = entryPrice + slippage;
          const initialStop = ind.ema10[execRowIdx] || effectiveEntry * 0.93;
          const riskPerShare = Math.max(0.01, effectiveEntry - initialStop);

          // Bucket — alternar CORE/SAT
          const bucket = openPositions.length % 2 === 0 ? 'core' : 'sat';
          const budgetBucket = bucket === 'core' ? budgetCore : budgetSat;
          const investedBucket = bucket === 'core' ? investedCore : investedSat;
          const availBucket = Math.max(0, budgetBucket - investedBucket);
          const riskLimitBucket = bucket === 'core' ? coreRisk : satRisk;
          const openRiskBucket = openRiskBuckets[bucket] || 0;

          // Waterfall — misma lógica que motor.js
          const ddMult = btDDMult(dd, ddScale);
          const baseRiskEur = nav * tradeRisk * ddMult;
          const availRiskBucket = Math.max(0, nav * riskLimitBucket - openRiskBucket);
          const availRiskGlobal = Math.max(0, nav * portRisk - openRiskGlobal);
          const availAsset = Math.max(0, nav * maxAssetNav - (exposureByTicker[ticker]||0));

          const qtyByRisk   = Math.floor(baseRiskEur / riskPerShare);
          const qtyByBucket = Math.floor(availBucket / effectiveEntry);
          const qtyCash     = Math.floor(cash / effectiveEntry);
          const qtyAsset    = Math.floor(availAsset / effectiveEntry);
          const qtyRiskB    = Math.floor(availRiskBucket / riskPerShare);
          const qtyRiskG    = Math.floor(availRiskGlobal / riskPerShare);

          const shares = Math.max(0, Math.min(qtyByRisk, qtyByBucket, qtyCash, qtyAsset, qtyRiskB, qtyRiskG));
          if (shares <= 0) continue;

          const capitalInv = shares * effectiveEntry;
          cash -= capitalInv + costs.commission;
          openPositions.push({
            ticker, direction: 'long', bucket, sector: ticker,
            entryDate: date, entryPrice: effectiveEntry, shares,
            initialStop, activeStop: initialStop,
            currentPrice: effectiveEntry, entryDayIdx: di,
            entrySystem, limitingRule: 'waterfall',
            policyVersion: policy.version || '1.0',
          });
        }
      }

      // 6. Recalcular NAV final del día
      const newInvestedVal = openPositions.reduce((s, p) => s + p.currentPrice * p.shares, 0);
      nav = cash + newInvestedVal;
      if (nav > hwm) hwm = nav;
      if (di > 0) dailyReturns.push((nav - prevNav) / prevNav);
      navCurve.push({ date, nav });
    }

    // Cerrar posiciones abiertas al final
    for (const pos of openPositions) {
      const pnlAbs = (pos.currentPrice - pos.entryPrice) * pos.shares;
      closedTrades.push({ ...pos, exitDate: allDates[allDates.length-1], exitPrice: pos.currentPrice, pnlAbs, pnlPct: pnlAbs/(pos.entryPrice*pos.shares), exitSystem: 'END', holdingDays: 0 });
    }

    // ── Métricas ────────────────────────────────────────────────
    const totalDays = allDates.length;
    const winners   = closedTrades.filter(t => t.pnlPct > 0);
    const losers    = closedTrades.filter(t => t.pnlPct <= 0);
    const avgWin    = winners.length ? winners.reduce((s,t)=>s+t.pnlPct,0)/winners.length : 0;
    const avgLoss   = losers.length  ? Math.abs(losers.reduce((s,t)=>s+t.pnlPct,0)/losers.length) : 0;
    const grossWin  = winners.reduce((s,t)=>s+t.pnlAbs,0);
    const grossLoss = Math.abs(losers.reduce((s,t)=>s+t.pnlAbs,0));
    const mdd       = btMaxDD(navCurve.map(p=>p.nav));
    const cagr      = btCAGR(initialCapital, nav, totalDays);
    const sharpe    = btSharpe(dailyReturns);
    const sortino   = btSortino(dailyReturns);
    const vol       = btAnnVol(dailyReturns);
    const calmar    = mdd < 0 ? cagr / Math.abs(mdd) : 0;

    // Por año
    const byYear = {};
    navCurve.forEach(p => {
      const y = p.date.slice(0,4);
      if (!byYear[y]) byYear[y] = { start: p.nav, end: p.nav, trades: 0, maxDD: 0, peak: p.nav };
      byYear[y].end = p.nav;
      if (p.nav > byYear[y].peak) byYear[y].peak = p.nav;
      const dd2 = (p.nav - byYear[y].peak) / byYear[y].peak;
      if (dd2 < byYear[y].maxDD) byYear[y].maxDD = dd2;
    });
    closedTrades.forEach(t => {
      const y = (t.exitDate||'').slice(0,4);
      if (byYear[y]) byYear[y].trades++;
    });

    // Por bucket
    const byBucket = { core: { trades:[], pnl:0 }, sat: { trades:[], pnl:0 } };
    closedTrades.forEach(t => {
      const b = t.bucket||'sat';
      if (byBucket[b]) { byBucket[b].trades.push(t); byBucket[b].pnl += t.pnlAbs; }
    });

    // Por sistema de entrada
    const bySys = {};
    closedTrades.forEach(t => {
      if (!bySys[t.entrySystem]) bySys[t.entrySystem] = [];
      bySys[t.entrySystem].push(t);
    });

    return {
      // Config
      startDate, endDate, initialCapital, policyVersion: policy.version||'1.0',
      engineVersion: 'ETHAN Backtest Engine v1.0',
      signalConvention: 'Signal Close(t) → Execution Close(t+1)',
      survivorshipBias: true,
      // Curvas
      navCurve, dailyReturns,
      // Operaciones
      trades: closedTrades,
      openAtEnd: openPositions.length,
      // Métricas
      finalCapital: nav, twr: (nav/initialCapital)-1, cagr, vol, sharpe, sortino, calmar, mdd,
      nTrades: closedTrades.length, winRate: closedTrades.length ? winners.length/closedTrades.length : 0,
      avgWin, avgLoss, payoff: avgLoss>0?avgWin/avgLoss:0,
      profitFactor: grossLoss>0?grossWin/grossLoss:0,
      expectancy: closedTrades.length ? closedTrades.reduce((s,t)=>s+t.pnlPct,0)/closedTrades.length : 0,
      bestTrade: closedTrades.length ? Math.max(...closedTrades.map(t=>t.pnlPct)) : 0,
      worstTrade: closedTrades.length ? Math.min(...closedTrades.map(t=>t.pnlPct)) : 0,
      avgDays: closedTrades.length ? closedTrades.reduce((s,t)=>s+(t.holdingDays||0),0)/closedTrades.length : 0,
      byYear, byBucket, bySys,
    };
  }

  // ── UI Backtesting ETHAN ────────────────────────────────────────
  function renderEthanConfig() {
    const policy = { version:'1.0', corePct:0.50, satPct:0.50, tradeRisk:0.015, portRisk:0.06, coreRisk:0.03, satRisk:0.04, maxAssetNav:0.20, maxSectorNav:0.35, ddScale:[1,0.8,0.6,0.4,0.25] };
    return `
    <div id="bt-ethan-wrap">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:14px;">Configuración del Backtest</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px;">
          <div class="bt-field">
            <label>Universo (tickers, separados por coma)</label>
            <input type="text" id="bt-e-tickers" class="bt-input" placeholder="AAPL, MSFT, NVDA, JPM" style="text-transform:uppercase;">
          </div>
          <div class="bt-field">
            <label>Capital inicial (€)</label>
            <input type="number" id="bt-e-capital" class="bt-input" value="100000" step="1000">
          </div>
          <div class="bt-field">
            <label>Benchmark</label>
            <input type="text" id="bt-e-bench" class="bt-input" value="SPY">
          </div>
          <div class="bt-field">
            <label>Fecha inicio</label>
            <input type="date" id="bt-e-start" class="bt-input" value="2015-01-01">
          </div>
          <div class="bt-field">
            <label>Fecha fin</label>
            <input type="date" id="bt-e-end" class="bt-input" value="${new Date().toISOString().slice(0,10)}">
          </div>
          <div class="bt-field">
            <label>Slippage (%)</label>
            <input type="number" id="bt-e-slip" class="bt-input" value="0.10" step="0.05">
          </div>
          <div class="bt-field">
            <label>Comisión (€/op.)</label>
            <input type="number" id="bt-e-comm" class="bt-input" value="1" step="0.5">
          </div>
        </div>

        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin:14px 0 10px;">Policy del Motor</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:10px;">
          <div class="bt-field"><label>CORE %</label><input type="number" id="bt-e-core" class="bt-input" value="50"></div>
          <div class="bt-field"><label>Riesgo/op %</label><input type="number" id="bt-e-risk" class="bt-input" value="1.5" step="0.25"></div>
          <div class="bt-field"><label>Risk Budget %</label><input type="number" id="bt-e-port" class="bt-input" value="6" step="0.5"></div>
          <div class="bt-field"><label>Máx. activo %</label><input type="number" id="bt-e-asset" class="bt-input" value="20"></div>
          <div class="bt-field"><label>Máx. sector %</label><input type="number" id="bt-e-sect" class="bt-input" value="35"></div>
        </div>

        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin:14px 0 10px;">Sistemas de Entrada</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
          ${[['sma5d','EMA5 Diario'],['macd','MACD+RSI Diario'],['rsi5_pullback','RSI5 Pullback']].map(([id,lbl]) =>
            `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:11px;">
               <input type="checkbox" id="bt-e-sys-${id}" checked style="accent-color:var(--teal);"> ${lbl}
             </label>`).join('')}
        </div>

        <div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:10px;color:var(--text2);line-height:1.6;">
          ⚠ Backtest realizado con universo personalizado. <strong>Existe survivorship bias</strong> — los tickers introduidos representan el estado actual, no la composición histórica del mercado.<br>
          Convención: <strong>Signal Close(t) → Execution Close(t+1)</strong> · Engine: ETHAN Backtest Engine v1.0
        </div>

        <button class="btn btn-primary" id="bt-e-run" style="width:100%;padding:11px;">▶ Ejecutar Backtest ETHAN</button>
      </div>

      <div id="bt-ethan-results"></div>
    </div>`;
  }

  function renderEthanResults(r, benchData) {
    const fmtPct = (n,d=1) => (n>=0?'+':'')+(n*100).toFixed(d)+'%';
    const fmtE   = n => (n<0?'−':'')+'€'+Math.abs(n).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0});
    const col    = n => n>0?'var(--green)':n<0?'var(--red)':'var(--text2)';

    // Benchmark return
    let benchRet = 0;
    if (benchData && benchData.length > 1) {
      benchRet = (benchData[benchData.length-1].close / benchData[0].close) - 1;
    }
    const alpha = r.twr - benchRet;

    // Gráfico NAV simple (SVG)
    const navVals = r.navCurve.map(p=>p.nav);
    const navMin  = Math.min(...navVals) * 0.99;
    const navMax  = Math.max(...navVals) * 1.01;
    const W=700, H=180;
    const nx = (i) => (i/(navVals.length-1)*W).toFixed(1);
    const ny = (v) => (H-(v-navMin)/(navMax-navMin)*H).toFixed(1);
    const navPath = navVals.map((v,i)=>`${i===0?'M':'L'}${nx(i)},${ny(v)}`).join(' ');

    // Drawdown series
    let peak2=navVals[0];
    const ddVals = navVals.map(v=>{if(v>peak2)peak2=v;return(v-peak2)/peak2;});
    const ddMin  = Math.min(...ddVals);
    const ddPath = ddVals.map((v,i)=>`${i===0?'M':'L'}${nx(i)},${(H-(v/ddMin)*H*.8).toFixed(1)}`).join(' ');

    return `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div>
          <div style="font-family:var(--serif);font-size:20px;font-style:italic;">Resultado del Backtest</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;">
            Engine: ${r.engineVersion} · Policy v${r.policyVersion} · ${r.startDate} → ${r.endDate}
          </div>
        </div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--amber);">⚠ Survivorship bias</div>
      </div>

      <!-- KPIs ejecutivos -->
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:16px;">
        ${[
          ['CAGR',      fmtPct(r.cagr),          col(r.cagr)],
          ['TWR',       fmtPct(r.twr),            col(r.twr)],
          ['Max DD',    fmtPct(r.mdd),            'var(--red)'],
          ['Sharpe',    r.sharpe.toFixed(2),       r.sharpe>1?'var(--green)':r.sharpe>0?'var(--amber)':'var(--red)'],
          ['Sortino',   r.sortino.toFixed(2),      r.sortino>1?'var(--green)':r.sortino>0?'var(--amber)':'var(--red)'],
          ['Alpha vs bench', fmtPct(alpha),        col(alpha)],
          ['Vol anual',  fmtPct(r.vol),            'var(--text2)'],
          ['Calmar',    r.calmar.toFixed(2),       r.calmar>1?'var(--green)':'var(--amber)'],
          ['Trades',    r.nTrades,                 'var(--text2)'],
          ['Win Rate',  fmtPct(r.winRate,0),       r.winRate>0.5?'var(--green)':'var(--amber)'],
          ['Profit Factor', r.profitFactor.toFixed(2), r.profitFactor>1.5?'var(--green)':'var(--amber)'],
          ['Expectancy', fmtPct(r.expectancy,2),   col(r.expectancy)],
        ].map(([l,v,c])=>`<div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${l}</div>
          <div style="font-family:var(--mono);font-size:14px;font-weight:700;color:${c};margin-top:4px;">${v}</div>
        </div>`).join('')}
      </div>

      <!-- Curva NAV -->
      <div style="margin-bottom:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">ETHAN NAV vs Capital Inicial</div>
      <svg viewBox="0 0 ${W} ${H+10}" style="width:100%;height:auto;background:var(--surface2);border-radius:8px;margin-bottom:10px;">
        <line x1="0" y1="${ny(r.initialCapital)}" x2="${W}" y2="${ny(r.initialCapital)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4"/>
        <path d="${navPath}" fill="none" stroke="var(--teal)" stroke-width="2"/>
      </svg>

      <!-- Drawdown -->
      <div style="margin-bottom:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">Drawdown</div>
      <svg viewBox="0 0 ${W} ${H/2}" style="width:100%;height:auto;background:var(--surface2);border-radius:8px;margin-bottom:16px;">
        <path d="${ddPath}" fill="rgba(244,113,116,0.15)" stroke="var(--red)" stroke-width="1.5"/>
      </svg>

      <!-- Performance anual -->
      <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:8px;">Performance Anual</div>
      <table class="bt-table" style="margin-bottom:16px;">
        <thead><tr>
          <th>Año</th><th>ETHAN</th><th>Bench</th><th>Alpha</th><th>Max DD</th><th>Trades</th>
        </tr></thead>
        <tbody>
          ${Object.entries(r.byYear).map(([y,d])=>{
            const ret = d.start>0 ? (d.end/d.start)-1 : 0;
            return `<tr>
              <td>${y}</td>
              <td style="color:${col(ret)}">${fmtPct(ret)}</td>
              <td style="color:var(--text3)">—</td>
              <td style="color:${col(ret)}">${fmtPct(ret)}</td>
              <td style="color:var(--red)">${fmtPct(d.maxDD)}</td>
              <td>${d.trades}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <!-- CORE vs SAT -->
      <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:8px;">CORE vs SATÉLITE</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        ${['core','sat'].map(b=>{
          const bd = r.byBucket[b];
          const bWinners = bd.trades.filter(t=>t.pnlPct>0);
          const bWR = bd.trades.length ? bWinners.length/bd.trades.length : 0;
          const bGW = bWinners.reduce((s,t)=>s+t.pnlAbs,0);
          const bGL = Math.abs(bd.trades.filter(t=>t.pnlPct<=0).reduce((s,t)=>s+t.pnlAbs,0));
          const bPF = bGL>0?bGW/bGL:0;
          return `<div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-family:var(--mono);font-size:10px;font-weight:700;color:${b==='core'?'var(--teal)':'var(--purple)'};margin-bottom:10px;">${b.toUpperCase()}</div>
            ${[['Trades',bd.trades.length],['Win Rate',fmtPct(bWR,0)],['P&L',fmtE(bd.pnl)],['Profit Factor',bPF.toFixed(2)]].map(([l,v])=>
              `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:11px;">
                <span style="color:var(--text3);">${l}</span>
                <span style="font-family:var(--mono);font-weight:700;">${v}</span>
              </div>`).join('')}
          </div>`;
        }).join('')}
      </div>

      <!-- Sistemas de entrada -->
      <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:8px;">Sistemas de Entrada</div>
      <table class="bt-table" style="margin-bottom:16px;">
        <thead><tr><th>Sistema</th><th>Trades</th><th>Win Rate</th><th>Avg Win</th><th>Avg Loss</th><th>PF</th></tr></thead>
        <tbody>
          ${Object.entries(r.bySys).map(([sys,ts])=>{
            const ws=ts.filter(t=>t.pnlPct>0), ls=ts.filter(t=>t.pnlPct<=0);
            const wr=ts.length?ws.length/ts.length:0;
            const aw=ws.length?ws.reduce((s,t)=>s+t.pnlPct,0)/ws.length:0;
            const al=ls.length?Math.abs(ls.reduce((s,t)=>s+t.pnlPct,0)/ls.length):0;
            const gw=ws.reduce((s,t)=>s+t.pnlAbs,0), gl=Math.abs(ls.reduce((s,t)=>s+t.pnlAbs,0));
            return `<tr><td>${sys}</td><td>${ts.length}</td><td style="color:${wr>0.5?'var(--green)':'var(--amber)'}">${fmtPct(wr,0)}</td><td style="color:var(--green)">${fmtPct(aw)}</td><td style="color:var(--red)">-${fmtPct(al)}</td><td>${gl>0?(gw/gl).toFixed(2):'—'}</td></tr>`;
          }).join('')}
        </tbody>
      </table>

      <!-- Operaciones -->
      <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:8px;">
        Operaciones (${r.trades.length}) · Mostrando primeras 50
      </div>
      <table class="bt-table">
        <thead><tr><th>Ticker</th><th>Entrada</th><th>Salida</th><th>Días</th><th>Sistema</th><th>P&L%</th><th>P&L€</th></tr></thead>
        <tbody>
          ${r.trades.slice(0,50).map(t=>`<tr>
            <td style="text-align:left;font-weight:700;">${t.ticker}</td>
            <td>${t.entryDate}</td><td>${t.exitDate||'—'}</td>
            <td>${t.holdingDays||0}</td><td style="font-size:9px;">${t.entrySystem}</td>
            <td style="color:${col(t.pnlPct)}">${fmtPct(t.pnlPct)}</td>
            <td style="color:${col(t.pnlAbs)}">${fmtE(t.pnlAbs)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  function attachEthanListeners() {
    document.getElementById('bt-e-run')?.addEventListener('click', async () => {
      const btn = document.getElementById('bt-e-run');
      const resEl = document.getElementById('bt-ethan-results');
      const tickersRaw = (document.getElementById('bt-e-tickers')?.value||'').toUpperCase().split(',').map(s=>s.trim()).filter(Boolean);
      const capital   = parseFloat(document.getElementById('bt-e-capital')?.value) || 100000;
      const bench     = (document.getElementById('bt-e-bench')?.value||'SPY').trim().toUpperCase();
      const startDate = document.getElementById('bt-e-start')?.value || '2015-01-01';
      const endDate   = document.getElementById('bt-e-end')?.value   || new Date().toISOString().slice(0,10);
      const slip      = parseFloat(document.getElementById('bt-e-slip')?.value) || 0.10;
      const comm      = parseFloat(document.getElementById('bt-e-comm')?.value) || 1;
      const corePct   = (parseFloat(document.getElementById('bt-e-core')?.value)||50)/100;
      const tradeRisk = (parseFloat(document.getElementById('bt-e-risk')?.value)||1.5)/100;
      const portRisk  = (parseFloat(document.getElementById('bt-e-port')?.value)||6)/100;
      const maxAsset  = (parseFloat(document.getElementById('bt-e-asset')?.value)||20)/100;
      const maxSect   = (parseFloat(document.getElementById('bt-e-sect')?.value)||35)/100;
      const systems   = { sma5d: document.getElementById('bt-e-sys-sma5d')?.checked, macd: document.getElementById('bt-e-sys-macd')?.checked, rsi5_pullback: document.getElementById('bt-e-sys-rsi5_pullback')?.checked };

      if (!tickersRaw.length) { alert('Introduce al menos un ticker'); return; }

      btn.textContent = '⏳ Descargando datos históricos...'; btn.disabled = true;
      resEl.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:32px;font-family:var(--mono);font-size:11px;color:var(--text3);"><div class="bt-loader"></div>Descargando datos para ${[...tickersRaw, bench].join(', ')}...</div>`;

      try {
        const { getCurrentUser } = await import('../../auth.js');
        const user = getCurrentUser();
        if (!user) throw new Error('No autenticado');

        // Descargar datos via market-history (lazy cache)
        const allTickers = [...new Set([...tickersRaw, bench])];
        const universeData = {};
        let loaded = 0;
        for (const ticker of allTickers) {
          btn.textContent = `⏳ Descargando ${ticker} (${++loaded}/${allTickers.length})...`;
          const r2 = await fetch('/api/backfill-ticker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-ethan-client': 'true' },
            body: JSON.stringify({ action: 'market-history', ticker, startDate, endDate, uid: user.uid }),
          });
          if (!r2.ok) throw new Error(`Error descargando ${ticker}: HTTP ${r2.status}`);
          const d = await r2.json();
          if (!d.rows || d.rows.length < 20) throw new Error(`Datos insuficientes para ${ticker} (${d.rows?.length||0} sesiones)`);
          universeData[ticker] = d.rows;
        }

        btn.textContent = '⏳ Ejecutando simulación...';
        const policy = { version:'1.0', corePct, satPct:1-corePct, tradeRisk, portRisk, coreRisk:portRisk*0.5, satRisk:portRisk*0.65, maxAssetNav:maxAsset, maxSectorNav:maxSect, ddScale:[1,0.8,0.6,0.4,0.25] };
        const config  = { policy, initialCapital:capital, benchmark:bench, costs:{ slippage:slip, commission:comm }, startDate, endDate, systems };
        const benchData = universeData[bench] || [];
        delete universeData[bench]; // benchmark no es parte del universo de trading

        // Pequeño delay para que el browser pinte el estado
        await new Promise(r3=>setTimeout(r3,50));
        const result = runEthanBacktest(universeData, config);
        resEl.innerHTML = renderEthanResults(result, benchData);

      } catch(e) {
        resEl.innerHTML = `<div style="background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.3);border-radius:10px;padding:20px;font-family:var(--mono);font-size:12px;color:var(--red);">⚠ ${e.message}</div>`;
      }
      btn.textContent = '▶ Ejecutar Backtest ETHAN'; btn.disabled = false;
    });
  }

  document.getElementById('bt-wrap').innerHTML = renderTabs() + renderConfig();
  attachTabListeners();
  attachListeners();

  return { destroy() { document.getElementById('bt-css')?.remove(); } };
}
