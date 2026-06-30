// ═══════════════════════════════════════════════
// MÓDULO: Cartera · Análisis General
// Vista consolidada de toda la actividad:
// - Posiciones abiertas (alcista + bajista)
// - Historial de operaciones cerradas
// - Asset Allocation CORE/Satélite (composición)
// Métricas: rentabilidad, riesgo, eficiencia.
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

// ── Cálculo de métricas (igual lógica que en cartera.js) ──
function calcMetrics(ops) {
  if (ops.length === 0) return null;
  const wins = ops.filter(o => o.pnlPct > 0), losses = ops.filter(o => o.pnlPct <= 0);
  const winRate = (wins.length / ops.length) * 100;
  const avgWinPct  = wins.length   ? wins.reduce((s,o)=>s+o.pnlPct,0)/wins.length     : 0;
  const avgLossPct = losses.length ? losses.reduce((s,o)=>s+o.pnlPct,0)/losses.length : 0;
  const avgPnlPct  = ops.reduce((s,o)=>s+o.pnlPct,0) / ops.length;
  const expectancy = (winRate/100 * avgWinPct) + ((1-winRate/100) * avgLossPct);
  const totalPnlAbs = ops.reduce((s,o) => s + (o.pnlAbs || 0), 0);
  const hasAbsData = ops.some(o => o.pnlAbs != null);
  const mean = avgPnlPct;
  const variance = ops.reduce((s,o) => s + Math.pow(o.pnlPct - mean, 2), 0) / ops.length;
  const stdDev = Math.sqrt(variance);
  const sharpe = stdDev > 0 ? (avgPnlPct / stdDev) : 0;
  const maxLoss = Math.min(...ops.map(o => o.pnlPct));
  const sorted = [...ops].sort((a,b) => (a.closedAt||0) - (b.closedAt||0));
  let equity = 100, peak = 100, maxDD = 0;
  sorted.forEach(o => { equity *= (1 + o.pnlPct/100); if (equity > peak) peak = equity; const dd = ((peak-equity)/peak)*100; if (dd > maxDD) maxDD = dd; });
  return { nOps: ops.length, winRate, avgPnlPct, expectancy, totalPnlAbs, hasAbsData, stdDev, sharpe, maxLoss, maxDD };
}

function profitFactor(ops) {
  const gains  = ops.filter(o=>o.pnlPct>0).reduce((s,o)=>s+o.pnlPct,0);
  const losses = Math.abs(ops.filter(o=>o.pnlPct<=0).reduce((s,o)=>s+o.pnlPct,0));
  return losses > 0 ? gains/losses : (gains>0?Infinity:0);
}

// ── RENDER ─────────────────────────────────────
export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>`;
  container.innerHTML = `<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>`;

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

    // Precios actuales para exposición abierta
    const pricesMap = {};
    await Promise.all(positions.map(async p => {
      const price = await fetchPrice(p.ticker);
      pricesMap[p.ticker] = price;
    }));

    paint(positions, history, capitalAlcista, capitalBajista, satelite, corePct, pricesMap);
  }

  function paint(positions, history, capA, capB, satelite, corePct, prices) {
    const el = document.getElementById('gen-content');

    // ── Exposición actual (posiciones abiertas) ──
    const longs  = positions.filter(p => (p.direction||'alcista')==='alcista');
    const shorts = positions.filter(p => p.direction==='bajista');

    let exposureLong = 0, exposureShort = 0, unrealizedPnl = 0;
    positions.forEach(p => {
      const price = prices[p.ticker];
      const value = p.shares && price ? p.shares * price : (p.cost || 0);
      if ((p.direction||'alcista')==='alcista') exposureLong += value;
      else exposureShort += value;

      if (price && p.entry) {
        const pnlPct = p.direction==='bajista' ? ((p.entry-price)/p.entry*100) : ((price-p.entry)/p.entry*100);
        const pnlAbs = p.cost ? (p.cost * pnlPct/100) : null;
        if (pnlAbs != null) unrealizedPnl += pnlAbs;
      }
    });

    const totalCapitalAsignado = (capA||0) + (capB||0);
    const totalExposure = exposureLong + exposureShort;

    // ── Históricos combinados ──
    const allOps = history;
    const mAll = calcMetrics(allOps);
    const mAlcista = calcMetrics(allOps.filter(h=>(h.direction||'alcista')==='alcista'));
    const mBajista = calcMetrics(allOps.filter(h=>h.direction==='bajista'));

    const realizedPnlTotal = allOps.reduce((s,o)=>s+(o.pnlAbs||0), 0);
    const hasAnyAbsData = allOps.some(o=>o.pnlAbs!=null);
    const pf = profitFactor(allOps);

    // Curva de equity combinada (todas las operaciones cerradas ordenadas)
    const sortedOps = [...allOps].sort((a,b)=>(a.closedAt||0)-(b.closedAt||0));
    let equity = 100;
    const equityCurve = sortedOps.map(o => { equity *= (1+o.pnlPct/100); return equity; });

    const fmt = (v,d=2) => v!=null && !isNaN(v) && isFinite(v) ? v.toFixed(d) : '—';
    const sign = v => v>=0?'+':'';
    const color = v => v>=0?'var(--green)':'var(--red)';

    el.innerHTML = `
      <!-- RESUMEN GLOBAL -->
      <div class="gen-hero">
        <div class="gen-hero-card">
          <div class="gen-hero-label">Capital Total Asignado</div>
          <div class="gen-hero-value">${totalCapitalAsignado>0?'$'+totalCapitalAsignado.toFixed(0):'—'}</div>
          <div class="gen-hero-sub">Alcista $${(capA||0).toFixed(0)} · Bajista $${(capB||0).toFixed(0)}</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">P&L Realizado (histórico)</div>
          <div class="gen-hero-value" style="color:${hasAnyAbsData?color(realizedPnlTotal):'var(--text3)'}">${hasAnyAbsData?(sign(realizedPnlTotal)+'$'+realizedPnlTotal.toFixed(0)):'Sin coste asignado'}</div>
          <div class="gen-hero-sub">${allOps.length} operaciones cerradas</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">P&L No Realizado (abiertas)</div>
          <div class="gen-hero-value" style="color:${color(unrealizedPnl)}">${sign(unrealizedPnl)}$${unrealizedPnl.toFixed(0)}</div>
          <div class="gen-hero-sub">${positions.length} posiciones abiertas</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">Exposición Actual</div>
          <div class="gen-hero-value">$${totalExposure.toFixed(0)}</div>
          <div class="gen-hero-sub">Long $${exposureLong.toFixed(0)} · Short $${exposureShort.toFixed(0)}</div>
        </div>
      </div>

      <!-- RENTABILIDAD / RIESGO / EFICIENCIA -->
      <div class="gen-section-title">📊 Rentabilidad, Riesgo y Eficiencia — Global</div>
      ${mAll ? `
      <div class="gen-metrics-grid">
        <div class="gen-mtile"><div class="gen-mtile-lbl">Operaciones Totales</div><div class="gen-mtile-val">${mAll.nOps}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ratio Win</div><div class="gen-mtile-val" style="color:${mAll.winRate>=50?'var(--green)':'var(--amber)'}">${fmt(mAll.winRate,1)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ganancia Media</div><div class="gen-mtile-val" style="color:${color(mAll.avgPnlPct)}">${sign(mAll.avgPnlPct)}${fmt(mAll.avgPnlPct)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Matemática</div><div class="gen-mtile-val" style="color:${color(mAll.expectancy)}">${sign(mAll.expectancy)}${fmt(mAll.expectancy)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val" style="color:${pf>=1.5?'var(--green)':pf>=1?'var(--amber)':'var(--red)'}">${isFinite(pf)?fmt(pf):'∞'}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ratio Sharpe</div><div class="gen-mtile-val" style="color:${mAll.sharpe>=1?'var(--green)':mAll.sharpe>=0?'var(--amber)':'var(--red)'}">${fmt(mAll.sharpe)}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Media</div><div class="gen-mtile-val">${fmt(mAll.stdDev)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown</div><div class="gen-mtile-val" style="color:var(--red)">-${fmt(mAll.maxDD)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Máxima Pérdida (op.)</div><div class="gen-mtile-val" style="color:var(--red)">${fmt(mAll.maxLoss)}%</div></div>
      </div>
      ` : `<div class="sc2-empty">Sin operaciones cerradas todavía — cierra posiciones en el módulo Cartera para ver métricas</div>`}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-compare-col">
          <div class="gen-compare-head long">📈 ALCISTA</div>
          ${mAlcista ? `
            <div class="gen-compare-row"><span>Operaciones</span><strong>${mAlcista.nOps}</strong></div>
            <div class="gen-compare-row"><span>Win Rate</span><strong style="color:${mAlcista.winRate>=50?'var(--green)':'var(--amber)'}">${fmt(mAlcista.winRate,1)}%</strong></div>
            <div class="gen-compare-row"><span>P&L Medio</span><strong style="color:${color(mAlcista.avgPnlPct)}">${sign(mAlcista.avgPnlPct)}${fmt(mAlcista.avgPnlPct)}%</strong></div>
            <div class="gen-compare-row"><span>Sharpe</span><strong>${fmt(mAlcista.sharpe)}</strong></div>
            <div class="gen-compare-row"><span>Max DD</span><strong style="color:var(--red)">-${fmt(mAlcista.maxDD)}%</strong></div>
          ` : `<div class="sc2-empty">Sin datos</div>`}
        </div>
        <div class="gen-compare-col">
          <div class="gen-compare-head short">📉 BAJISTA</div>
          ${mBajista ? `
            <div class="gen-compare-row"><span>Operaciones</span><strong>${mBajista.nOps}</strong></div>
            <div class="gen-compare-row"><span>Win Rate</span><strong style="color:${mBajista.winRate>=50?'var(--green)':'var(--amber)'}">${fmt(mBajista.winRate,1)}%</strong></div>
            <div class="gen-compare-row"><span>P&L Medio</span><strong style="color:${color(mBajista.avgPnlPct)}">${sign(mBajista.avgPnlPct)}${fmt(mBajista.avgPnlPct)}%</strong></div>
            <div class="gen-compare-row"><span>Sharpe</span><strong>${fmt(mBajista.sharpe)}</strong></div>
            <div class="gen-compare-row"><span>Max DD</span><strong style="color:var(--red)">-${fmt(mBajista.maxDD)}%</strong></div>
          ` : `<div class="sc2-empty">Sin datos</div>`}
        </div>
      </div>

      <!-- CURVA DE EQUITY -->
      ${equityCurve.length > 1 ? `
      <div class="gen-section-title" style="margin-top:24px;">📈 Curva de Equity (base 100)</div>
      <div class="gen-equity-chart">
        ${renderEquitySVG(equityCurve)}
      </div>` : ''}

      <!-- COMPOSICIÓN CORE/SATÉLITE -->
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
            ${satelite.length>0 ? satelite.map(a=>`<span class="rf-custom-chip">${typeof a==='string'?a:a.ticker}</span>`).join('') : '<span class="sc2-empty" style="padding:0;">Sin activos en la cesta satélite</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">
        Última actualización: ${new Date().toLocaleString('es-ES')}
      </div>
    `;
  }

  function renderEquitySVG(curve) {
    const w = 900, h = 180, pad = 20;
    const min = Math.min(...curve, 100), max = Math.max(...curve, 100);
    const range = max - min || 1;
    const stepX = (w - pad*2) / Math.max(1, curve.length-1);
    const points = curve.map((v,i) => {
      const x = pad + i*stepX;
      const y = h - pad - ((v-min)/range)*(h-pad*2);
      return `${x},${y}`;
    }).join(' ');
    const baseline100Y = h - pad - ((100-min)/range)*(h-pad*2);
    const lastVal = curve[curve.length-1];
    const lastColor = lastVal >= 100 ? '#4ade80' : '#f47174';

    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
        <line x1="${pad}" y1="${baseline100Y}" x2="${w-pad}" y2="${baseline100Y}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
        <polyline points="${points}" fill="none" stroke="${lastColor}" stroke-width="2"/>
        <circle cx="${pad+(curve.length-1)*stepX}" cy="${h-pad-((lastVal-min)/range)*(h-pad*2)}" r="4" fill="${lastColor}"/>
      </svg>`;
  }

  document.getElementById('gen-refresh-btn')?.addEventListener('click', load);
  load();

  return { destroy() {} };
}
