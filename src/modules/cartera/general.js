// ═══════════════════════════════════════════════
// MÓDULO: Cartera · General + Proyecciones
// v2 — NAV diario real marcado a mercado.
// Todas las métricas de riesgo (Sharpe, Sortino,
// Calmar, Max DD) se calculan sobre la curva de
// NAV real, no sobre aproximaciones por operación.
// ═══════════════════════════════════════════════

import { UserData } from '../../userdata.js';

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
];

async function fetchDailyHistory(ticker, rangeDays) {
  // Pide suficiente histórico para cubrir desde la entrada más antigua
  const range = rangeDays > 365*1.5 ? '5y' : rangeDays > 200 ? '2y' : '1y';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=${range}`;
  for (const fn of PROXIES) {
    try {
      const r = await fetch(fn(url), { signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      const j = JSON.parse(await r.text());
      const res = j?.chart?.result?.[0]; if (!res) continue;
      const closes = res.indicators?.quote?.[0]?.close;
      const ts = res.timestamp;
      if (!closes || !ts) continue;
      // Mapa fecha(YYYY-MM-DD) -> precio cierre
      const map = {};
      ts.forEach((t,i) => {
        if (closes[i] == null) return;
        const d = new Date(t*1000).toISOString().slice(0,10);
        map[d] = closes[i];
      });
      return map;
    } catch {}
  }
  return null;
}

async function fetchPrice(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`;
  for (const fn of PROXIES) {
    try {
      const r = await fetch(fn(url), { signal: AbortSignal.timeout(6000) });
      if (!r.ok) continue;
      const j = JSON.parse(await r.text());
      return j?.chart?.result?.[0]?.meta?.regularMarketPrice || null;
    } catch {}
  }
  return null;
}

// ── Formatters ──────────────────────────────────
const fmt   = (n,d=2) => n!=null && !isNaN(n) && isFinite(n) ? n.toFixed(d) : '—';
const fmtE  = n => n!=null && !isNaN(n) ? '$'+n.toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0}) : '—';
const fmtPct= n => n!=null && !isNaN(n) ? (n>=0?'+':'')+(n*100).toFixed(2)+'%' : '—';
const fmtDate = d => d ? new Date(d).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}) : '—';

function dateRange(start, end) {
  const out = [];
  let d = new Date(start);
  const endD = new Date(end);
  while (d <= endD) { out.push(d.toISOString().slice(0,10)); d.setDate(d.getDate()+1); }
  return out;
}

// ── Construcción del NAV diario real ────────────
// Para cada día desde la primera entrada hasta hoy, suma el valor a mercado
// de todas las posiciones vivas ese día (usando el último precio conocido
// hasta esa fecha — forward-fill para fines de semana/festivos).
async function buildNavSeries(allTrades) {
  if (allTrades.length === 0) return null;

  const startDate = allTrades.reduce((min,t) => t.entryDate < min ? t.entryDate : min, allTrades[0].entryDate);
  const today = new Date().toISOString().slice(0,10);
  const days = dateRange(startDate, today);
  const maxRangeDays = days.length;

  // Histórico de precios por ticker único
  const tickers = [...new Set(allTrades.map(t => t.ticker))];
  const histMap = {};
  await Promise.all(tickers.map(async tk => {
    histMap[tk] = await fetchDailyHistory(tk, maxRangeDays);
  }));

  // Para cada día, sumar valor de posiciones vivas (forward-fill precio)
  const lastKnownPrice = {};
  const nav = days.map(day => {
    let total = 0;
    allTrades.forEach(t => {
      const isOpen = !t.exitDate || t.exitDate >= day;
      const isActive = t.entryDate <= day && (t.exitDate ? day <= t.exitDate : true);
      if (!isActive) return;
      const hist = histMap[t.ticker];
      let price = hist?.[day];
      if (price == null && hist) {
        // Forward-fill: usar el último precio conocido hasta esta fecha
        price = lastKnownPrice[t.ticker] ?? t.entry;
      }
      if (price != null) lastKnownPrice[t.ticker] = price;
      const usedPrice = price ?? t.entry;
      const shares = t.shares || (t.cost && t.entry ? t.cost/t.entry : 0);
      const value = t.direction === 'bajista'
        ? (t.entry * shares) + (shares * (t.entry - usedPrice))  // short: gana si baja
        : shares * usedPrice;
      total += value;
    });
    return { day, value: total };
  });

  return nav;
}

// ── Métricas sobre NAV real ──────────────────────
function navMetrics(nav, capitalBase) {
  if (!nav || nav.length < 2) return null;
  const values = nav.map(n => n.value).filter(v => v > 0);
  if (values.length < 2) return null;

  // Retornos diarios
  const returns = [];
  for (let i=1;i<values.length;i++) {
    if (values[i-1] > 0) returns.push((values[i]-values[i-1])/values[i-1]);
  }
  if (returns.length === 0) return null;

  const meanDaily = returns.reduce((s,r)=>s+r,0)/returns.length;
  const stdDaily = Math.sqrt(returns.reduce((s,r)=>s+(r-meanDaily)**2,0)/returns.length);

  // Anualización (252 días de trading)
  const annualReturn = Math.pow(1+meanDaily, 252) - 1;
  const annualVol = stdDaily * Math.sqrt(252);
  const sharpe = annualVol > 0 ? annualReturn/annualVol : 0;

  // Sortino: solo desviación de retornos negativos
  const negReturns = returns.filter(r => r < 0);
  const downsideDev = negReturns.length ? Math.sqrt(negReturns.reduce((s,r)=>s+r**2,0)/negReturns.length) * Math.sqrt(252) : 0;
  const sortino = downsideDev > 0 ? annualReturn/downsideDev : 0;

  // Max Drawdown real con fechas
  let peak = values[0], peakIdx = 0, maxDD = 0, ddStart = nav[0].day, ddEnd = nav[0].day, ddTrough = nav[0].day;
  let curPeakIdx = 0;
  values.forEach((v,i) => {
    if (v > peak) { peak = v; curPeakIdx = i; }
    const dd = peak > 0 ? (peak-v)/peak : 0;
    if (dd > maxDD) { maxDD = dd; ddStart = nav[curPeakIdx].day; ddTrough = nav[i].day; }
  });
  // Buscar fecha de recuperación (primera vez que vuelve a superar el peak previo al drawdown)
  let recoveryDate = null;
  const peakValueAtDD = values[nav.findIndex(n=>n.day===ddStart)];
  for (let i = nav.findIndex(n=>n.day===ddTrough); i < values.length; i++) {
    if (values[i] >= peakValueAtDD) { recoveryDate = nav[i].day; break; }
  }
  const ddDurationDays = recoveryDate
    ? Math.round((new Date(recoveryDate)-new Date(ddStart))/86400000)
    : null; // null = aún no recuperado

  // Calmar Ratio: retorno anualizado / max drawdown
  const calmar = maxDD > 0 ? annualReturn/maxDD : 0;

  const totalReturn = values[0] > 0 ? (values[values.length-1]-values[0])/values[0] : 0;

  return {
    startValue: values[0], endValue: values[values.length-1], totalReturn,
    annualReturn, annualVol, sharpe, sortino, calmar,
    maxDD, ddStart, ddTrough, recoveryDate, ddDurationDays,
    returns, nDays: values.length
  };
}

// ── Ratios sobre operaciones cerradas (igual que antes, para KPIs por op) ──
function calcRatios(ops) {
  if (!ops.length) return null;
  const opsN = ops.map(o => ({ ...o, pct: o.pnlPct/100, pl: o.pnlAbs }));
  const totalPL = opsN.reduce((s,o)=> s + (o.pl||0), 0);
  const hasAbsData = opsN.some(o => o.pl != null);
  const winners = opsN.filter(o => o.pct > 0), losers = opsN.filter(o => o.pct <= 0);
  const winRate = winners.length / opsN.length;
  const avgWinPct  = winners.length ? winners.reduce((s,o)=>s+o.pct,0)/winners.length : 0;
  const avgLossPct = losers.length  ? Math.abs(losers.reduce((s,o)=>s+o.pct,0)/losers.length) : 0;
  const esperanza  = winRate*avgWinPct - (1-winRate)*avgLossPct;
  const diasArr = opsN.map(o=>o.duration).filter(d=>d>0);
  const diasMedio = diasArr.length ? diasArr.reduce((s,d)=>s+d,0)/diasArr.length : 0;
  const opsAnio = diasMedio > 0 ? 365.25/diasMedio : 0;
  const maxWin  = opsN.reduce((a,b)=> a.pct > b.pct ? a : b);
  const maxLoss = opsN.reduce((a,b)=> a.pct < b.pct ? a : b);
  const grossWin  = winners.length ? winners.reduce((s,o)=>s+o.pct,0) : 0;
  const grossLoss = losers.length  ? Math.abs(losers.reduce((s,o)=>s+o.pct,0)) : 0;
  const profitFactor = grossLoss > 0 ? grossWin/grossLoss : (grossWin>0?Infinity:0);
  let maxConsecLoss = 0, cl = 0;
  opsN.forEach(o => { if (o.pct <= 0) { cl++; maxConsecLoss = Math.max(maxConsecLoss, cl); } else cl = 0; });

  // Kelly Criterion: f* = W - (1-W)/R, donde R = avgWin/avgLoss
  const R = avgLossPct > 0 ? avgWinPct/avgLossPct : null;
  const kelly = R != null ? winRate - (1-winRate)/R : null;

  return { totalPL, hasAbsData, winRate, avgWinPct, avgLossPct, esperanza,
    diasMedio, opsAnio, maxWin, maxLoss, profitFactor, maxConsecLoss, kelly, R,
    winners: winners.length, losers: losers.length, total: opsN.length };
}

function kpiBlock(r) {
  if (!r) return `<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>`;
  return `
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${r.hasAbsData?(r.totalPL>=0?'var(--green)':'var(--red)'):'var(--text3)'}">${r.hasAbsData?fmtE(r.totalPL):'Sin coste'}</div><div class="gen-mtile-sub">${r.total} operaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(r.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${r.winners}W / ${r.losers}L</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${r.esperanza>=0?'var(--green)':'var(--red)'}">${fmtPct(r.esperanza)}</div><div class="gen-mtile-sub">por operación</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${r.profitFactor===Infinity?'∞':fmt(r.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${fmtPct(r.avgWinPct)} · AvgL: -${(r.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${fmtPct(r.maxWin.pct)}</div><div class="gen-mtile-sub">${r.maxWin.ticker} · ${r.maxWin.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${fmtPct(r.maxLoss.pct)}</div><div class="gen-mtile-sub">${r.maxLoss.ticker} · ${r.maxLoss.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${r.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Kelly Óptimo</div><div class="gen-mtile-val" style="color:${r.kelly!=null&&r.kelly>0?'var(--green)':'var(--text3)'}">${r.kelly!=null?(r.kelly*100).toFixed(1)+'%':'—'}</div><div class="gen-mtile-sub">% capital/op recomendado</div></div>
    </div>`;
}

function navMetricsBlock(m) {
  if (!m) return `<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>`;
  return `
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Total</div><div class="gen-mtile-val" style="color:${m.totalReturn>=0?'var(--green)':'var(--red)'}">${fmtPct(m.totalReturn)}</div><div class="gen-mtile-sub">${m.nDays} días</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Anualizado</div><div class="gen-mtile-val" style="color:${m.annualReturn>=0?'var(--green)':'var(--red)'}">${fmtPct(m.annualReturn)}</div><div class="gen-mtile-sub">CAGR estimado</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Anualizada</div><div class="gen-mtile-val">${fmt(m.annualVol*100,1)}%</div><div class="gen-mtile-sub">desv. estándar</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sharpe Ratio</div><div class="gen-mtile-val" style="color:${m.sharpe>=1?'var(--green)':m.sharpe>=0?'var(--amber)':'var(--red)'}">${fmt(m.sharpe)}</div><div class="gen-mtile-sub">anualizado, rf=0</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sortino Ratio</div><div class="gen-mtile-val" style="color:${m.sortino>=1?'var(--green)':m.sortino>=0?'var(--amber)':'var(--red)'}">${fmt(m.sortino)}</div><div class="gen-mtile-sub">solo riesgo bajista</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Calmar Ratio</div><div class="gen-mtile-val" style="color:${m.calmar>=1?'var(--green)':m.calmar>=0?'var(--amber)':'var(--red)'}">${fmt(m.calmar)}</div><div class="gen-mtile-sub">retorno / max DD</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown Real</div><div class="gen-mtile-val" style="color:var(--red)">-${fmt(m.maxDD*100,1)}%</div><div class="gen-mtile-sub">${fmtDate(m.ddStart)} → ${fmtDate(m.ddTrough)}</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Recuperación DD</div><div class="gen-mtile-val" style="color:${m.recoveryDate?'var(--green)':'var(--amber)'}">${m.ddDurationDays!=null?m.ddDurationDays+'d':'En curso'}</div><div class="gen-mtile-sub">${m.recoveryDate?fmtDate(m.recoveryDate):'sin recuperar'}</div></div>
    </div>`;
}

// ── SVG charts ───────────────────────────────────
function navChartSVG(nav) {
  if (!nav || nav.length < 2) return `<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>`;
  const w=900, h=240, pad=24;
  const values = nav.map(n=>n.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max-min)||1;
  const stepX = (w-pad*2) / (values.length-1);
  const pts = values.map((v,i) => `${pad+i*stepX},${h-pad-((v-min)/range)*(h-pad*2)}`).join(' ');
  const last = values[values.length-1], first = values[0];
  const lineColor = last>=first ? '#4ade80' : '#f47174';
  // Área debajo
  const areaPts = `${pad},${h-pad} ${pts} ${pad+(values.length-1)*stepX},${h-pad}`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    <polygon points="${areaPts}" fill="${lineColor}" opacity="0.08"/>
    <polyline points="${pts}" fill="none" stroke="${lineColor}" stroke-width="2"/>
    <circle cx="${pad+(values.length-1)*stepX}" cy="${h-pad-((last-min)/range)*(h-pad*2)}" r="4" fill="${lineColor}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${fmtDate(nav[0].day)}</span><span>${fmtDate(nav[nav.length-1].day)}</span>
  </div>`;
}

function ddChartSVG(nav) {
  if (!nav || nav.length < 2) return '';
  const w=900, h=120, pad=10;
  let peak = nav[0].value;
  const dds = nav.map(n => { peak = Math.max(peak, n.value); return peak>0 ? (peak-n.value)/peak : 0; });
  const max = Math.max(...dds, 0.001);
  const stepX = (w-pad*2) / (dds.length-1);
  const pts = dds.map((d,i) => `${pad+i*stepX},${pad + (d/max)*(h-pad*2)}`).join(' ');
  const areaPts = `${pad},${pad} ${pts} ${pad+(dds.length-1)*stepX},${pad}`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    <polygon points="${areaPts}" fill="#f47174" opacity="0.15"/>
    <polyline points="${pts}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`;
}

function histogramSVG(returns) {
  if (!returns || returns.length < 3) return `<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>`;
  const pcts = returns.map(r => r*100);
  const min = Math.min(...pcts), max = Math.max(...pcts);
  const bins = 12;
  const binSize = (max-min)/bins || 1;
  const counts = new Array(bins).fill(0);
  pcts.forEach(p => {
    let idx = Math.floor((p-min)/binSize);
    if (idx >= bins) idx = bins-1; if (idx < 0) idx = 0;
    counts[idx]++;
  });
  const w=900, h=200, pad=24;
  const maxCount = Math.max(...counts, 1);
  const barW = (w-pad*2)/bins;
  const bars = counts.map((c,i) => {
    const barH = (c/maxCount)*(h-pad*2);
    const x = pad+i*barW;
    const y = h-pad-barH;
    const binStart = min+i*binSize;
    const color = binStart >= 0 ? '#4ade80' : '#f47174';
    return `<rect x="${x+1}" y="${y}" width="${barW-2}" height="${barH}" fill="${color}" opacity="0.7"/>`;
  }).join('');
  const zeroX = pad + ((0-min)/(max-min||1))*(w-pad*2);
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    ${bars}
    <line x1="${zeroX}" y1="${pad}" x2="${zeroX}" y2="${h-pad}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${min.toFixed(1)}%</span><span>0%</span><span>${max.toFixed(1)}%</span>
  </div>`;
}

function radarChartSVG(rb, rr) {
  const labels = ['Win Rate','Esperanza','Profit Factor','Kelly'];
  const mk = r => r ? [r.winRate, Math.max(0,Math.min(1,r.esperanza+0.3)), Math.min((r.profitFactor===Infinity?3:r.profitFactor)/3,1), Math.max(0,Math.min(1,(r.kelly||0)+0.3))] : [0,0,0,0];
  const dataB = mk(rb), dataR = mk(rr);
  const cx=150, cy=150, R=110, n=4;
  const pt = (val, i) => { const a=(Math.PI*2*i/n)-Math.PI/2; const r=R*Math.max(0,Math.min(1,val)); return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; };
  const polyB = dataB.map((v,i)=>pt(v,i)).join(' ');
  const polyR = dataR.map((v,i)=>pt(v,i)).join(' ');
  const axisLines = Array.from({length:n}).map((_,i) => { const a=(Math.PI*2*i/n)-Math.PI/2; return `<line x1="${cx}" y1="${cy}" x2="${cx+R*Math.cos(a)}" y2="${cy+R*Math.sin(a)}" stroke="var(--border)" stroke-width="1"/>`; }).join('');
  const labelPos = labels.map((l,i) => { const a=(Math.PI*2*i/n)-Math.PI/2; const lx=cx+(R+22)*Math.cos(a), ly=cy+(R+22)*Math.sin(a); return `<text x="${lx}" y="${ly}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${l}</text>`; }).join('');
  return `<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${R*0.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${axisLines}
    <polygon points="${polyB}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${polyR}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${labelPos}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`;
}

// ── RENDER ─────────────────────────────────────
export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>`;
  container.innerHTML = `<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>`;

  async function load() {
    const el = document.getElementById('gen-content');
    el.innerHTML = `<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>`;

    const [positions, history, capitalAlcista, capitalBajista, satelite, corePct] = await Promise.all([
      UserData.get('ethan_positions').then(v=>v||[]),
      UserData.get('ethan_positions_history').then(v=>v||[]),
      UserData.get('ethan_capital_alcista'),
      UserData.get('ethan_capital_bajista'),
      UserData.get('ethan_satelite_assets').then(v=>v||[]),
      UserData.get('ethan_core_pct'),
    ]);

    const pricesMap = {};
    await Promise.all(positions.map(async p => { pricesMap[p.ticker] = await fetchPrice(p.ticker); }));

    // Construir lista unificada de trades (abiertos + cerrados) con fechas normalizadas
    const allTrades = [
      ...positions.filter(p=>p.entryDate).map(p => ({
        ticker:p.ticker, direction:p.direction||'alcista', entry:p.entry,
        shares:p.shares, cost:p.cost, entryDate:p.entryDate, exitDate:null
      })),
      ...history.filter(h=>h.entryDateISO).map(h => ({
        ticker:h.ticker, direction:h.direction||'alcista', entry:h.entry,
        shares:h.shares, cost:h.cost, entryDate:h.entryDateISO, exitDate:h.exitDateISO
      }))
    ];

    let nav = null, navM = null;
    if (allTrades.length > 0) {
      nav = await buildNavSeries(allTrades);
      navM = navMetrics(nav, (capitalAlcista||0)+(capitalBajista||0));
    }

    paint(positions, history, capitalAlcista, capitalBajista, satelite, corePct, pricesMap, nav, navM);
  }

  function paint(positions, history, capA, capB, satelite, corePct, prices, nav, navM) {
    const el = document.getElementById('gen-content');

    const alcistaOps = history.filter(h => (h.direction||'alcista')==='alcista');
    const bajistaOps = history.filter(h => h.direction==='bajista');
    const rb = calcRatios(alcistaOps);
    const rr = calcRatios(bajistaOps);
    const rg = calcRatios(history);

    const totalCapital = (capA||0)+(capB||0);

    let exposureLong=0, exposureShort=0, unrealizedPnl=0;
    positions.forEach(p => {
      const price = prices[p.ticker];
      const value = p.shares && price ? p.shares*price : (p.cost||0);
      if ((p.direction||'alcista')==='alcista') exposureLong += value; else exposureShort += value;
      if (price && p.entry) {
        const pnlPct = p.direction==='bajista' ? ((p.entry-price)/p.entry*100) : ((price-p.entry)/p.entry*100);
        if (p.cost) unrealizedPnl += p.cost*pnlPct/100;
      }
    });

    el.innerHTML = `
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${kpiBlock(rg)}

      <!-- NAV REAL -->
      <div class="gen-section-title" style="margin-top:24px;">📈 NAV Real — Marcado a Mercado</div>
      ${navM ? `
        ${navMetricsBlock(navM)}
        <div class="gen-compare-grid" style="margin-top:14px;">
          <div class="gen-chart-box">
            <div class="gen-chart-title">Evolución del NAV</div>
            ${navChartSVG(nav)}
          </div>
          <div class="gen-chart-box">
            <div class="gen-chart-title">Drawdown a lo largo del tiempo</div>
            ${ddChartSVG(nav)}
          </div>
        </div>
      ` : `<div class="sc2-empty">Necesitas posiciones con fecha de entrada para reconstruir el NAV real</div>`}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${rg ? `
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${histogramSVG(history.map(h=>h.pnlPct/100))}
      </div>` : ''}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${radarChartSVG(rb,rr)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${rb&&rb.hasAbsData?fmtE(rb.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${rr&&rr.hasAbsData?fmtE(rr.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${rg&&rg.totalPL>=0?'var(--green)':'var(--red)'}">${rg&&rg.hasAbsData?fmtE(rg.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${rg&&rg.esperanza>=0?'var(--green)':'var(--red)'}">${rg?fmtPct(rg.esperanza):'—'}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${rb?.kelly!=null?(rb.kelly*100).toFixed(1)+'%':'—'}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${rr?.kelly!=null?(rr.kelly*100).toFixed(1)+'%':'—'}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${totalCapital>0?fmtE(totalCapital):'—'}</div><div class="gen-hero-sub">Alcista ${fmtE(capA||0)} · Bajista ${fmtE(capB||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${unrealizedPnl>=0?'var(--green)':'var(--red)'}">${(unrealizedPnl>=0?'+':'')+fmtE(unrealizedPnl)}</div><div class="gen-hero-sub">${positions.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${fmtE(exposureLong)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${fmtE(exposureShort)}</div></div>
      </div>

      <!-- COMPOSICIÓN ASSET ALLOCATION -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${corePct||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(corePct||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${corePct||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(corePct||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${satelite.length>0 ? satelite.map(a=>`<span class="rf-custom-chip">${typeof a==='string'?a:a.ticker}</span>`).join('') : '<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString('es-ES')}</div>
    `;
  }

  document.getElementById('gen-refresh-btn')?.addEventListener('click', load);
  load();

  return { destroy() {} };
}
