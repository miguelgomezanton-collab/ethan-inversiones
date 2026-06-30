// ═══════════════════════════════════════════════
// MÓDULO: Cartera · General + Proyecciones
// Combina datos reales (Firestore) de cartera.js:
// - Ratios de rentabilidad/riesgo Alcista vs Bajista
// - Proyección a 5 años con sizing configurable
// - Drawdown esperado por rachas perdedoras
// - Escenarios Conservador / Base / Agresivo
// ═══════════════════════════════════════════════

import { UserData } from '../../userdata.js';

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
];

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
const fmt   = (n,d=2) => n!=null && !isNaN(n) ? n.toFixed(d) : '—';
const fmtE  = n => n!=null && !isNaN(n) ? '$'+n.toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0}) : '—';
const fmtPct= n => n!=null && !isNaN(n) ? (n>=0?'+':'')+(n*100).toFixed(2)+'%' : '—';
const fmtK  = n => n!=null && !isNaN(n) ? (n>=1000 ? '$'+(n/1000).toFixed(1)+'k' : fmtE(n)) : '—';

// ── Ratios (idéntico a la fórmula original, adaptado a pnlPct ya en %) ──
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

  const rents = opsN.map(o => o.pct);
  const meanRent = rents.reduce((s,r)=>s+r,0)/rents.length;
  const stdRent  = Math.sqrt(rents.reduce((s,r)=>s+(r-meanRent)**2,0)/rents.length);
  const sharpe   = stdRent > 0 ? meanRent/stdRent : 0;

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

  return { totalPL, hasAbsData, winRate, avgWinPct, avgLossPct, esperanza, sharpe,
    diasMedio, opsAnio, maxWin, maxLoss, profitFactor, maxConsecLoss,
    winners: winners.length, losers: losers.length, total: opsN.length, stdRent, rentMedia: meanRent };
}

function kpiBlock(r, colorClass) {
  if (!r) return `<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>`;
  return `
    <div class="gen-metrics-grid">
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${r.hasAbsData?(r.totalPL>=0?'var(--green)':'var(--red)'):'var(--text3)'}">${r.hasAbsData?fmtE(r.totalPL):'Sin coste'}</div><div class="gen-mtile-sub">${r.total} operaciones</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(r.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${r.winners}W / ${r.losers}L</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Rent. Media/Op</div><div class="gen-mtile-val" style="color:${r.rentMedia>=0?'var(--green)':'var(--red)'}">${fmtPct(r.rentMedia)}</div><div class="gen-mtile-sub">${fmt(r.diasMedio,0)}d · ${fmt(r.opsAnio,1)} ops/año</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${r.esperanza>=0?'var(--green)':'var(--red)'}">${fmtPct(r.esperanza)}</div><div class="gen-mtile-sub">Sharpe: ${fmt(r.sharpe)}</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${r.profitFactor===Infinity?'∞':fmt(r.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${fmtPct(r.avgWinPct)} · AvgL: -${(r.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${fmtPct(r.maxWin.pct)}</div><div class="gen-mtile-sub">${r.maxWin.ticker} · ${r.maxWin.duration}d</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${fmtPct(r.maxLoss.pct)}</div><div class="gen-mtile-sub">${r.maxLoss.ticker} · ${r.maxLoss.duration}d</div></div>
      <div class="gen-mtile ${colorClass}"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${r.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
    </div>`;
}

// ── SVG simple line/radar charts (sin dependencias) ──
function lineChartSVG(curve, labelEvery=1) {
  if (curve.length < 2) return `<div class="sc2-empty" style="padding:30px;">Necesitas al menos 2 operaciones</div>`;
  const w=900, h=220, pad=24;
  const min = Math.min(...curve, 0), max = Math.max(...curve, 0);
  const range = (max-min) || 1;
  const stepX = (w-pad*2) / (curve.length-1);
  const pts = curve.map((v,i) => `${pad+i*stepX},${h-pad-((v-min)/range)*(h-pad*2)}`).join(' ');
  const zeroY = h-pad-((0-min)/range)*(h-pad*2);
  const last = curve[curve.length-1];
  const lineColor = last>=0 ? '#4ade80' : '#f47174';
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    <line x1="${pad}" y1="${zeroY}" x2="${w-pad}" y2="${zeroY}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polyline points="${pts}" fill="none" stroke="${lineColor}" stroke-width="2"/>
    <circle cx="${pad+(curve.length-1)*stepX}" cy="${h-pad-((last-min)/range)*(h-pad*2)}" r="4" fill="${lineColor}"/>
  </svg>`;
}

function projectionChartSVG(curveMain, curveLow, curveHigh, months) {
  const w=900, h=260, pad=30;
  const all = [...curveMain, ...curveLow, ...curveHigh];
  const min = Math.min(...all), max = Math.max(...all);
  const range = (max-min)||1;
  const stepX = (w-pad*2) / (months-1);
  const toPts = arr => arr.map((v,i) => `${pad+i*stepX},${h-pad-((v-min)/range)*(h-pad*2)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    <polyline points="${toPts(curveLow)}" fill="none" stroke="#5fa8e0" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
    <polyline points="${toPts(curveHigh)}" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
    <polyline points="${toPts(curveMain)}" fill="none" stroke="#40d9c0" stroke-width="2.5"/>
    <circle cx="${pad+(months-1)*stepX}" cy="${h-pad-((curveMain[curveMain.length-1]-min)/range)*(h-pad*2)}" r="4" fill="#40d9c0"/>
  </svg>
  <div style="display:flex;gap:16px;margin-top:8px;font-size:9px;font-family:var(--mono);">
    <span style="color:#40d9c0;">■ Riesgo actual</span>
    <span style="color:#5fa8e0;">■ Riesgo mitad</span>
    <span style="color:#fbbf24;">■ Riesgo doble</span>
  </div>`;
}

function radarChartSVG(rb, rr) {
  const labels = ['Win Rate','Rent. Media','Esperanza','Sharpe','Profit Factor'];
  const mk = r => r ? [r.winRate, Math.max(0,r.rentMedia+0.5)/1, Math.max(0,r.esperanza+0.5)/1, Math.max(0,(r.sharpe+1)/3), Math.min((r.profitFactor===Infinity?3:r.profitFactor)/3,1)] : [0,0,0,0,0];
  const dataB = mk(rb), dataR = mk(rr);
  const cx=150, cy=150, R=110, n=5;
  const pt = (val, i) => {
    const angle = (Math.PI*2*i/n) - Math.PI/2;
    const r = R * Math.max(0,Math.min(1,val));
    return `${cx+r*Math.cos(angle)},${cy+r*Math.sin(angle)}`;
  };
  const polyB = dataB.map((v,i)=>pt(v,i)).join(' ');
  const polyR = dataR.map((v,i)=>pt(v,i)).join(' ');
  const axisLines = Array.from({length:n}).map((_,i) => {
    const angle = (Math.PI*2*i/n) - Math.PI/2;
    return `<line x1="${cx}" y1="${cy}" x2="${cx+R*Math.cos(angle)}" y2="${cy+R*Math.sin(angle)}" stroke="var(--border)" stroke-width="1"/>`;
  }).join('');
  const labelPos = labels.map((l,i) => {
    const angle = (Math.PI*2*i/n) - Math.PI/2;
    const lx = cx+(R+22)*Math.cos(angle), ly = cy+(R+22)*Math.sin(angle);
    return `<text x="${lx}" y="${ly}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${l}</text>`;
  }).join('');
  return `<svg viewBox="0 0 300 300" style="width:100%;max-width:340px;height:auto;display:block;margin:0 auto;">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${R*0.66}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${R*0.33}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
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

  let riskPct = 0.01;   // 1% por defecto
  let ddPctMax = 0.10;  // 10% por defecto

  async function load() {
    const el = document.getElementById('gen-content');
    el.innerHTML = `<div class="empty"><div class="loader-ring"></div><div class="empty-title">Calculando métricas de cartera...</div></div>`;

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

    paint(positions, history, capitalAlcista, capitalBajista, satelite, corePct, pricesMap);
  }

  function paint(positions, history, capA, capB, satelite, corePct, prices) {
    const el = document.getElementById('gen-content');

    const alcistaOps = history.filter(h => (h.direction||'alcista')==='alcista');
    const bajistaOps = history.filter(h => h.direction==='bajista');
    const allOps = [...history].sort((a,b)=>(a.closedAt||0)-(b.closedAt||0));

    const rb = calcRatios(alcistaOps);
    const rr = calcRatios(bajistaOps);
    const rg = calcRatios(allOps);

    const totalCapital = (capA||0)+(capB||0);

    // Exposición y P&L no realizado
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

    // Curva de equity combinada (en € si hay datos, si no en % acumulado)
    let equityCurve = [];
    if (rg && rg.hasAbsData) {
      let acc = 0; allOps.forEach(o => { acc += (o.pnlAbs||0); equityCurve.push(acc); });
    } else {
      let acc = 100; allOps.forEach(o => { acc *= (1+o.pnlPct/100); equityCurve.push(acc); });
    }

    el.innerHTML = `
      <!-- KPIs GENERALES -->
      ${kpiBlock(rg, 'gen')}

      <!-- COMPARATIVA + EQUITY -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${radarChartSVG(rb,rr)}</div>
        <div class="gen-chart-box"><div class="gen-chart-title">Equity Curve Combinada</div>${lineChartSVG(equityCurve)}</div>
      </div>

      <!-- RATIO CARDS -->
      <div class="gen-ratio-grid">
        <div class="gen-ratio-card">
          <div class="gen-chart-title">📊 Ratios Rentabilidad</div>
          ${rg ? `
            <div class="gen-ratio-row"><span>Rent. Media/Op</span><strong>${fmtPct(rg.rentMedia)}</strong></div>
            <div class="gen-ratio-row"><span>Días Medios</span><strong>${fmt(rg.diasMedio,1)}</strong></div>
            <div class="gen-ratio-row"><span>Ops/Año</span><strong>${fmt(rg.opsAnio,1)}</strong></div>
            <div class="gen-ratio-row"><span>Desv. Estándar</span><strong>${fmtPct(rg.stdRent)}</strong></div>
          ` : `<div class="sc2-empty">Sin datos</div>`}
        </div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">⚖️ Ratios Riesgo</div>
          ${rg ? `
            <div class="gen-ratio-row"><span>Win Rate</span><strong>${(rg.winRate*100).toFixed(1)}%</strong></div>
            <div class="gen-ratio-row"><span>Profit Factor</span><strong>${rg.profitFactor===Infinity?'∞':fmt(rg.profitFactor)}</strong></div>
            <div class="gen-ratio-row"><span>Sharpe</span><strong>${fmt(rg.sharpe)}</strong></div>
            <div class="gen-ratio-row"><span>Máx Rachas Perd.</span><strong style="color:var(--red)">${rg.maxConsecLoss}</strong></div>
          ` : `<div class="sc2-empty">Sin datos</div>`}
        </div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${rb&&rb.hasAbsData?fmtE(rb.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${rr&&rr.hasAbsData?fmtE(rr.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${rg&&rg.totalPL>=0?'var(--green)':'var(--red)'}">${rg&&rg.hasAbsData?fmtE(rg.totalPL):'—'}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza</span><strong style="color:${rg&&rg.esperanza>=0?'var(--green)':'var(--red)'}">${rg?fmtPct(rg.esperanza):'—'}</strong></div>
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

      <!-- CONFIGURACIÓN DE PROYECCIÓN -->
      <div class="gen-section-title" style="margin-top:24px;">🚀 Configuración de Proyección</div>
      <div class="pos-capital-row" style="margin-bottom:16px;flex-wrap:wrap;">
        <label>Capital Inicial (€)</label>
        <input type="number" id="proj-capital" class="wl-input" style="width:140px;" value="${totalCapital||10000}">
        <label style="margin-left:16px;">Riesgo por Operación (%)</label>
        <input type="number" id="proj-risk" class="wl-input" style="width:90px;" value="1" step="0.25" min="0.25" max="5">
        <label style="margin-left:16px;">DD Máx. Tolerable (%)</label>
        <input type="number" id="proj-dd" class="wl-input" style="width:90px;" value="10" step="1" min="5" max="30">
        <button class="btn btn-primary" id="proj-recalc-btn" style="margin-left:10px;">Recalcular</button>
      </div>

      <div id="gen-projections"></div>
    `;

    document.getElementById('proj-recalc-btn')?.addEventListener('click', () => {
      const capital = parseFloat(document.getElementById('proj-capital').value)||10000;
      riskPct  = (parseFloat(document.getElementById('proj-risk').value)||1)/100;
      ddPctMax = (parseFloat(document.getElementById('proj-dd').value)||10)/100;
      renderProjections(rg, capital, riskPct, ddPctMax);
    });

    // Primera carga de proyecciones
    const initCapital = totalCapital || 10000;
    renderProjections(rg, initCapital, riskPct, ddPctMax);

    // Composición Asset Allocation
    const allocEl = document.createElement('div');
    allocEl.innerHTML = `
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
    el.appendChild(allocEl);
  }

  function renderProjections(ratios, capital, riskPct, ddPct) {
    const el = document.getElementById('gen-projections');
    if (!el) return;

    if (!ratios) {
      el.innerHTML = `<div class="sc2-empty">Necesitas operaciones cerradas para proyectar (cierra posiciones en el módulo Cartera)</div>`;
      return;
    }

    const { rentMedia, opsAnio, diasMedio, winRate, avgWinPct, avgLossPct } = ratios;
    const sizing = avgLossPct>0 ? Math.min(riskPct/avgLossPct, 1) : 0;
    const impactoGan  = avgWinPct * sizing;
    const impactoPerd = avgLossPct * sizing;
    const rentEfectiva = winRate*impactoGan - (1-winRate)*impactoPerd;
    const totalOps5y = Math.round(opsAnio*5);
    const cap1y = capital * Math.pow(1+rentEfectiva, Math.round(opsAnio));
    const cap5y = capital * Math.pow(1+rentEfectiva, totalOps5y);

    // Tabla por año
    let projRows = '';
    for (let y=1;y<=5;y++) {
      const cap = capital * Math.pow(1+rentEfectiva, Math.round(opsAnio*y));
      const bw = Math.min((cap/Math.max(cap5y,capital*1.01))*100, 100);
      projRows += `<div class="proj-row"><span class="proj-year">Año ${y}</span><div class="proj-bar-track"><div class="proj-bar-fill" style="width:${bw}%"></div></div><span class="proj-val">${fmtK(cap)}</span></div>`;
    }

    // Curva de proyección con 3 escenarios de riesgo
    const months = 61;
    const mkCurve = rE => Array.from({length:months}, (_,m) => capital*Math.pow(1+rE, Math.round(opsAnio*m/12)));
    const sH = avgLossPct>0 ? Math.min((riskPct/2)/avgLossPct,1) : 0;
    const sD = avgLossPct>0 ? Math.min((riskPct*2)/avgLossPct,1) : 0;
    const rH = winRate*avgWinPct*sH - (1-winRate)*avgLossPct*sH;
    const rD = winRate*avgWinPct*sD - (1-winRate)*avgLossPct*sD;

    // Drawdown esperado
    const lossRate = 1-winRate;
    let ddRows = '';
    for (let n=2;n<=10;n++) {
      const prob = Math.pow(lossRate,n);
      const dd = (1-Math.pow(1-impactoPerd,n))*100;
      const p100 = (1-Math.pow(1-prob,100))*100;
      const exc = dd > ddPct*100;
      ddRows += `<div class="gen-dd-row ${exc?'exceeds':''}"><span>${n} pérdidas seguidas</span><span class="gen-dd-val">DD: <strong style="color:${exc?'var(--red)':'var(--amber)'}">${dd.toFixed(1)}%</strong>${exc?' ⚠️':''} · P(100 ops): ${p100.toFixed(1)}%</span></div>`;
    }
    const lDD = impactoPerd>0 ? Math.log(1-ddPct)/Math.log(1-impactoPerd) : Infinity;
    const ddVerdict = lDD>8 ? '<span style="color:var(--green)">✅ Muy seguro</span>' : lDD>5 ? '<span style="color:var(--amber)">⚠️ Moderado</span>' : '<span style="color:var(--red)">🔴 Peligroso</span>';

    // Escenarios
    const scenarios = [
      { name:'Conservador', mult:0.5, desc:'Mitad riesgo', color:'var(--amber)' },
      { name:'Base (actual)', mult:1, desc:`Riesgo ${(riskPct*100).toFixed(1)}%`, color:'var(--teal)' },
      { name:'Agresivo', mult:2, desc:'Doble riesgo', color:'var(--red)' },
    ];
    const scenarioCards = scenarios.map(s => {
      const sz = avgLossPct>0 ? Math.min((riskPct*s.mult)/avgLossPct,1) : 0;
      const rE = winRate*avgWinPct*sz - (1-winRate)*avgLossPct*sz;
      const cp = capital*Math.pow(1+rE, totalOps5y);
      const ddL = (avgLossPct*sz)>0 ? Math.floor(Math.log(1-ddPct)/Math.log(1-avgLossPct*sz)) : Infinity;
      return `
        <div class="gen-scenario-card">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <strong style="color:${s.color};font-size:11px;">${s.name}</strong>
            <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${s.desc}</span>
          </div>
          <div class="gen-scenario-grid">
            <div>Impacto/op: <strong>${fmtPct(rE)}</strong></div>
            <div>Capital 5Y: <strong>${fmtK(cp)}</strong></div>
            <div>DD/pérdida: <strong style="color:var(--red)">${(avgLossPct*sz*100).toFixed(2)}%</strong></div>
            <div>Pérdidas→DD: <strong style="color:${ddL>8?'var(--green)':ddL>5?'var(--amber)':'var(--red)'}">${isFinite(ddL)?ddL:'∞'}</strong></div>
          </div>
        </div>`;
    }).join('');

    el.innerHTML = `
      <div class="gen-hero" style="margin-bottom:18px;">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Inicial</div><div class="gen-hero-value">${fmtE(capital)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Rent. Histórica/Op</div><div class="gen-hero-value" style="color:var(--blue)">${fmtPct(rentMedia)}</div><div class="gen-hero-sub">${fmt(diasMedio,0)}d · ${fmt(opsAnio,1)} ops/año</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Sizing</div><div class="gen-hero-value" style="color:var(--amber)">${(sizing*100).toFixed(1)}%</div><div class="gen-hero-sub">Riesgo ${(riskPct*100).toFixed(1)}%</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Impacto Real/Op</div><div class="gen-hero-value" style="color:${rentEfectiva>=0?'var(--green)':'var(--red)'}">${fmtPct(rentEfectiva)}</div><div class="gen-hero-sub">Esperanza × Sizing</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Proyección 1Y</div><div class="gen-hero-value" style="color:var(--green)">${fmtK(cap1y)}</div><div class="gen-hero-sub">×${(cap1y/capital).toFixed(2)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Proyección 5Y</div><div class="gen-hero-value" style="color:var(--green)">${fmtK(cap5y)}</div><div class="gen-hero-sub">×${(cap5y/capital).toFixed(2)}</div></div>
      </div>

      <div class="gen-compare-grid">
        <div class="gen-chart-box">
          <div class="gen-chart-title">Proyección por Año (5Y)</div>
          <p class="gen-chart-desc">Basado en rentabilidad media × sizing actual, con reinversión compuesta.</p>
          <div class="gen-proj-table">${projRows}</div>
        </div>
        <div class="gen-chart-box">
          <div class="gen-chart-title">Curva de Crecimiento (60 meses)</div>
          ${projectionChartSVG(mkCurve(rentEfectiva), mkCurve(rH), mkCurve(rD), months)}
        </div>
      </div>

      <div class="gen-compare-grid" style="margin-top:18px;">
        <div class="gen-chart-box">
          <div class="gen-chart-title">📉 Drawdown Esperado</div>
          <p class="gen-chart-desc">Según tu win rate, sizing y rachas perdedoras probables.</p>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:11px;color:var(--text2);">
            Cada pérdida: <strong style="color:var(--red)">-${(impactoPerd*100).toFixed(2)}%</strong> en cuenta
          </div>
          ${ddRows}
          <div class="gen-dd-summary">
            <strong style="color:var(--teal)">Con tu sizing:</strong> <strong>${isFinite(lDD)?Math.floor(lDD):'∞'} pérdidas consecutivas</strong> hasta DD máx ${(ddPct*100).toFixed(0)}%. ${ddVerdict}
          </div>
        </div>
        <div class="gen-chart-box">
          <div class="gen-chart-title">🎯 Escenarios</div>
          ${scenarioCards}
        </div>
      </div>
    `;
  }

  document.getElementById('gen-refresh-btn')?.addEventListener('click', load);
  load();

  return { destroy() {} };
}
