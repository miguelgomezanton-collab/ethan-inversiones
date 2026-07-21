// ═══════════════════════════════════════════════
// MÓDULO: Risk Management (4.4)
// 5 pestañas: Overview, Stops Activos,
// Exposición, Escenarios, Mis Reglas
// Datos reales de Firestore:
// - ethan_positions (posiciones + entryStop)
// - ethan_capital_alcista/bajista
// - ethan_risk_limits (límites configurables)
// ═══════════════════════════════════════════════

import { UserData } from '../../userdata.js';

const LIMITS_KEY = 'ethan_risk_limits';

const DEFAULT_LIMITS = {
  maxRiskPerOp: 1.5,    // % riesgo máximo por operación
  maxExposure: 90,       // % exposición total máxima
  maxPosition: 25,       // % máximo por posición individual
  maxSector: 50,         // % máximo por sector
  maxDrawdown: 10,       // % drawdown máximo tolerable
  maxLosStreak: 3,       // rachas perdedoras antes de reducir sizing
};

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
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

const fmtE  = v => v != null ? '€'+Math.abs(v).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0}) : '—';
const fmtPct = (v, d=1) => v != null ? (v>=0?'+':'')+v.toFixed(d)+'%' : '—';
const fmt2   = v => v != null ? v.toFixed(2) : '—';

function semItem(status, label, val) {
  return `<div class="rm-semaforo-item ${status}">
    <div class="rm-semaforo-dot"></div>
    <span class="rm-semaforo-label">${label}</span>
    <span class="rm-semaforo-val">${val}</span>
  </div>`;
}

function barRow(label, value, max, pct) {
  const fill = Math.min(pct, 100);
  const color = fill > 90 ? 'var(--red)' : fill > 75 ? 'var(--amber)' : 'var(--teal)';
  return `<div class="rm-bar-row">
    <div class="rm-bar-header">
      <span>${label}</span>
      <div><strong>${value}</strong> <span class="limit">/ ${max}</span></div>
    </div>
    <div class="rm-bar-track">
      <div class="rm-bar-fill" style="width:${fill}%;background:${color};"></div>
      <div class="rm-bar-limit" style="left:89%"></div>
    </div>
  </div>`;
}

function chip(status, label) {
  return `<span class="chip chip-${status}">${label}</span>`;
}

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="risk-refresh-btn">↻ Actualizar</button>`;
  container.innerHTML = `<div id="risk-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando Risk Management...</div></div></div>`;

  async function load() {
    const el = document.getElementById('risk-content');
    el.innerHTML = `<div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando precios actuales...</div></div>`;

    const [positions, history, capA, capB, limits] = await Promise.all([
      UserData.get('ethan_positions').then(v=>v||[]),
      UserData.get('ethan_positions_history').then(v=>v||[]),
      UserData.get('ethan_capital_alcista'),
      UserData.get('ethan_capital_bajista'),
      UserData.get(LIMITS_KEY).then(v=>v||DEFAULT_LIMITS),
    ]);

    const totalCapital = (capA||0) + (capB||0);

    // Precios actuales
    const prices = {};
    await Promise.all(positions.map(async p => {
      prices[p.ticker] = await fetchPrice(p.ticker);
    }));

    // Calcular valor actual y riesgo por posición
    const posData = positions.map(p => {
      const price   = prices[p.ticker] ?? p.entry;
      const shares  = p.shares || (p.cost && p.entry ? p.cost/p.entry : 0);
      const value   = shares * price;
      const costPct = totalCapital > 0 ? (p.cost||0)/totalCapital*100 : 0;
      const valuePct= totalCapital > 0 ? value/totalCapital*100 : 0;
      const pnl     = p.cost ? value - p.cost : null;
      const pnlPct  = p.cost ? (value-p.cost)/p.cost*100 : null;

      // Riesgo real si salta el stop
      let maxLoss = null, riskPct = null;
      if (p.entryStop && shares > 0) {
        const dist = p.direction === 'bajista'
          ? (p.entryStop - price) * shares
          : (price - p.entryStop) * shares;
        maxLoss = dist < 0 ? dist : 0; // negativo = pérdida
        riskPct = totalCapital > 0 ? maxLoss/totalCapital*100 : null;
      }

      // Distancia al stop
      const stopDist = p.entryStop && price
        ? ((price - p.entryStop) / price * 100)
        : null;
      const stopStatus = !p.entryStop ? 'bad'
        : Math.abs(stopDist) < 2 ? 'warn' : 'ok';

      return { ...p, price, shares, value, costPct, valuePct, pnl, pnlPct,
               maxLoss, riskPct, stopDist, stopStatus };
    });

    // Totales
    const totalValue    = posData.reduce((s,p)=>s+p.value,0);
    const totalExposure = totalCapital > 0 ? totalValue/totalCapital*100 : 0;
    const totalRisk     = posData.reduce((s,p)=>s+(p.riskPct||0),0);
    const totalMaxLoss  = posData.reduce((s,p)=>s+(p.maxLoss||0),0);
    const biggestPos    = posData.length ? posData.reduce((a,b)=>a.valuePct>b.valuePct?a:b) : null;

    // Sectores
    const sectorMap = {};
    posData.forEach(p => {
      const s = p.sector || 'Sin sector';
      sectorMap[s] = (sectorMap[s]||0) + p.valuePct;
    });
    const biggestSector = Object.entries(sectorMap).reduce((a,b)=>b[1]>a[1]?b:a, ['—',0]);

    // Sin stops
    const noStop = posData.filter(p=>!p.entryStop);

    // Rachas perdedoras recientes
    let streak=0, maxStreak=0;
    [...history].sort((a,b)=>a.closedAt-b.closedAt).forEach(h=>{
      if(h.pnlPct<=0){streak++;maxStreak=Math.max(maxStreak,streak);}else streak=0;
    });

    // Estado semáforos
    const s_risk    = totalRisk > limits.maxRiskPerOp*posData.length ? 'bad' : totalRisk > limits.maxRiskPerOp*posData.length*0.8 ? 'warn' : 'ok';
    const s_exp     = totalExposure > limits.maxExposure ? 'bad' : totalExposure > limits.maxExposure*0.85 ? 'warn' : 'ok';
    const s_pos     = biggestPos?.valuePct > limits.maxPosition ? 'bad' : biggestPos?.valuePct > limits.maxPosition*0.85 ? 'warn' : 'ok';
    const s_sector  = biggestSector[1] > limits.maxSector ? 'bad' : biggestSector[1] > limits.maxSector*0.85 ? 'warn' : 'ok';
    const s_streak  = streak >= limits.maxLosStreak ? 'bad' : streak >= limits.maxLosStreak-1 ? 'warn' : 'ok';
    const s_stops   = noStop.length > 0 ? 'bad' : 'ok';

    // ── Render ──────────────────────────────────
    el.innerHTML = `
      <div class="rm-tabs">
        <button class="rm-tab active" data-tab="overview">🚦 Overview</button>
        <button class="rm-tab" data-tab="stops">🛑 Stops Activos</button>
        <button class="rm-tab" data-tab="exposicion">📊 Exposición</button>
        <button class="rm-tab" data-tab="escenarios">⚡ Escenarios</button>
        <button class="rm-tab" data-tab="reglas">📋 Mis Reglas</button>
      </div>

      <!-- OVERVIEW -->
      <div class="rm-panel active" id="panel-overview">
        <div class="rm-grid4" style="margin-bottom:16px;">
          <div class="rm-tile">
            <div class="rm-tile-label">Riesgo Total en Cartera</div>
            <div class="rm-tile-val ${totalRisk<0?'down':''}">${Math.abs(totalRisk).toFixed(1)}%</div>
            <div class="rm-tile-sub">${fmtE(totalMaxLoss)} si saltan todos los stops · límite ${limits.maxRiskPerOp}% por op</div>
            <span class="rm-tile-badge badge-${s_risk==='ok'?'ok':s_risk==='warn'?'warn':'bad'}">${s_risk==='ok'?'✓ OK':s_risk==='warn'?'⚠ CERCA':'✗ EXCEDE'}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Exposición Bruta</div>
            <div class="rm-tile-val">${totalExposure.toFixed(1)}%</div>
            <div class="rm-tile-sub">${fmtE(totalValue)} en mercado · límite ${limits.maxExposure}%</div>
            <span class="rm-tile-badge badge-${s_exp==='ok'?'ok':s_exp==='warn'?'warn':'bad'}">${s_exp==='ok'?'✓ OK':s_exp==='warn'?'⚠ CERCA':'✗ EXCEDE'}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Posición Mayor</div>
            <div class="rm-tile-val ${s_pos==='warn'?'warn':''}">${biggestPos?biggestPos.valuePct.toFixed(1)+'%':'—'}</div>
            <div class="rm-tile-sub">${biggestPos?.ticker||'—'} · límite ${limits.maxPosition}%</div>
            <span class="rm-tile-badge badge-${s_pos==='ok'?'ok':s_pos==='warn'?'warn':'bad'}">${s_pos==='ok'?'✓ OK':s_pos==='warn'?'⚠ CERCA':'✗ EXCEDE'}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Stops sin configurar</div>
            <div class="rm-tile-val ${noStop.length>0?'down':''}">${noStop.length}</div>
            <div class="rm-tile-sub">${noStop.length>0?noStop.map(p=>p.ticker).join(', '):'Todas las posiciones tienen stop'}</div>
            <span class="rm-tile-badge badge-${noStop.length>0?'bad':'ok'}">${noStop.length>0?'✗ ALERTA':'✓ OK'}</span>
          </div>
        </div>
        <div class="rm-grid2">
          <div class="rm-card">
            <div class="rm-card-title">Semáforo de Riesgo</div>
            <div class="rm-semaforo">
              ${semItem(s_risk,   'Riesgo total por stops', `${Math.abs(totalRisk).toFixed(1)}% / ${limits.maxRiskPerOp}% por op`)}
              ${semItem(s_exp,    'Exposición total', `${totalExposure.toFixed(1)}% / ${limits.maxExposure}%`)}
              ${semItem(s_pos,    `Concentración — ${biggestPos?.ticker||'—'}`, `${biggestPos?.valuePct.toFixed(1)||'0'}% / ${limits.maxPosition}%`)}
              ${semItem(s_sector, `Sector — ${biggestSector[0]}`, `${biggestSector[1].toFixed(1)}% / ${limits.maxSector}%`)}
              ${semItem(s_streak, 'Rachas perdedoras activas', `${streak} / ${limits.maxLosStreak}`)}
              ${semItem(s_stops,  'Posiciones sin stop', noStop.length > 0 ? noStop.map(p=>p.ticker).join(', ') : 'Ninguna')}
            </div>
          </div>
          <div class="rm-card">
            <div class="rm-card-title">Uso de Límites</div>
            ${barRow('Riesgo por operaciones', Math.abs(totalRisk).toFixed(1)+'%', limits.maxRiskPerOp+'% por op', Math.abs(totalRisk)/limits.maxRiskPerOp*100)}
            ${barRow('Exposición total', totalExposure.toFixed(1)+'%', limits.maxExposure+'%', totalExposure/limits.maxExposure*100)}
            ${biggestPos ? barRow(`Posición mayor (${biggestPos.ticker})`, biggestPos.valuePct.toFixed(1)+'%', limits.maxPosition+'%', biggestPos.valuePct/limits.maxPosition*100) : ''}
            ${biggestSector[1] > 0 ? barRow(`Sector (${biggestSector[0]})`, biggestSector[1].toFixed(1)+'%', limits.maxSector+'%', biggestSector[1]/limits.maxSector*100) : ''}
          </div>
        </div>
      </div>

      <!-- STOPS ACTIVOS -->
      <div class="rm-panel" id="panel-stops">
        <div class="rm-card">
          <div class="rm-card-title">Stops Activos por Posición</div>
          <div class="rm-card-desc">Precio actual vs stop de entrada de cada posición. Los stops dinámicos (EMA10) debes actualizarlos semanalmente en Cartera.</div>
          ${posData.length === 0
            ? `<div class="sc2-empty">Sin posiciones abiertas</div>`
            : posData.map(p => `
            <div class="rm-stop-card">
              <div class="rm-stop-header">
                <div style="display:flex;gap:8px;align-items:center;">
                  <span class="rm-stop-ticker">${p.ticker}</span>
                  <span class="rm-stop-dir ${p.direction==='bajista'?'short':'long'}">${p.direction==='bajista'?'SHORT':'LONG'}</span>
                </div>
                ${p.stopStatus==='ok' ? chip('ok','✓ Por encima del stop')
                  : p.stopStatus==='warn' ? chip('warn','⚠ Cerca del stop')
                  : chip('bad','✗ Sin stop configurado')}
              </div>
              <div class="rm-stop-grid">
                <div class="rm-stop-item"><span class="rm-stop-item-label">Precio entrada</span><span class="rm-stop-item-val">${p.entry?.toFixed(2)||'—'}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Precio actual</span><span class="rm-stop-item-val ${p.pnlPct>=0?'up':'down'}">${p.price?.toFixed(2)||'—'}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Stop de entrada</span><span class="rm-stop-item-val" style="color:var(--red)">${p.entryStop?.toFixed(2)||'—'}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Distancia al stop</span><span class="rm-stop-item-val ${p.stopDist!=null&&p.stopDist<2?'warn':''}">${p.stopDist!=null?p.stopDist.toFixed(1)+'%':'—'}</span></div>
              </div>
              ${p.stopStatus==='ok' ? `<div class="rm-stop-alert ok">✓ Stop seguro · Pérdida máx si salta: ${p.maxLoss!=null?fmtE(p.maxLoss)+' ('+Math.abs(p.riskPct||0).toFixed(2)+'% capital)':'—'}</div>`
                : p.stopStatus==='warn' ? `<div class="rm-stop-alert warn">⚠ Precio muy cerca del stop (${p.stopDist?.toFixed(1)}%). Monitorear de cerca.</div>`
                : `<div class="rm-stop-alert warn">⚠ Sin stop configurado — añádelo en el módulo Cartera.</div>`}
            </div>`).join('')}
        </div>
      </div>

      <!-- EXPOSICIÓN -->
      <div class="rm-panel" id="panel-exposicion">
        <div class="rm-grid2">
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Por Posición</div>
            <table class="rm-table">
              <thead><tr><th>TICKER</th><th>DIR.</th><th class="r">VALOR</th><th class="r">% CAPITAL</th><th class="r">P&L</th><th class="r">ESTADO</th></tr></thead>
              <tbody>
                ${posData.map(p => `<tr>
                  <td style="font-family:var(--mono);font-weight:700;">${p.ticker}</td>
                  <td>${chip(p.direction==='bajista'?'bad':'ok', p.direction==='bajista'?'S':'L')}</td>
                  <td class="r">${fmtE(p.value)}</td>
                  <td class="r ${p.valuePct>limits.maxPosition*0.9?'warn':''}">${p.valuePct.toFixed(1)}%</td>
                  <td class="r ${p.pnlPct>=0?'up':'down'}">${p.pnl!=null?(p.pnl>=0?'+':'')+fmtE(p.pnl):'—'}</td>
                  <td class="r">${chip(p.valuePct>limits.maxPosition?'bad':p.valuePct>limits.maxPosition*0.9?'warn':'ok', p.valuePct>limits.maxPosition?'EXCEDE':p.valuePct>limits.maxPosition*0.9?'CERCA':'OK')}</td>
                </tr>`).join('')}
                <tr style="border-top:1px solid var(--border2);">
                  <td colspan="2" style="color:var(--text3);font-size:11px;">TOTAL</td>
                  <td class="r" style="font-weight:700;">${fmtE(totalValue)}</td>
                  <td class="r" style="font-weight:700;">${totalExposure.toFixed(1)}%</td>
                  <td class="r ${posData.reduce((s,p)=>s+(p.pnl||0),0)>=0?'up':'down'}" style="font-weight:700;">${fmtE(posData.reduce((s,p)=>s+(p.pnl||0),0))}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Pérdida Máxima Real (si saltan todos los stops)</div>
            <table class="rm-table">
              <thead><tr><th>TICKER</th><th class="r">STOP</th><th class="r">PÉRDIDA MÁX.</th><th class="r">% CAPITAL</th></tr></thead>
              <tbody>
                ${posData.map(p => `<tr>
                  <td style="font-family:var(--mono);">${p.ticker}</td>
                  <td class="r">${p.entryStop?.toFixed(2)||'—'}</td>
                  <td class="r ${p.maxLoss!=null?'down':''}">${p.maxLoss!=null?'−'+fmtE(Math.abs(p.maxLoss)):'Sin stop'}</td>
                  <td class="r ${p.riskPct!=null?'down':''}">${p.riskPct!=null?Math.abs(p.riskPct).toFixed(2)+'%':'—'}</td>
                </tr>`).join('')}
                <tr style="border-top:1px solid var(--border2);">
                  <td colspan="2" style="color:var(--text3);font-size:11px;">RIESGO TOTAL</td>
                  <td class="r down" style="font-weight:700;">−${fmtE(Math.abs(totalMaxLoss))}</td>
                  <td class="r down" style="font-weight:700;">${Math.abs(totalRisk).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
            ${noStop.length > 0 ? `<div style="margin-top:12px;font-size:10px;color:var(--amber);font-family:var(--mono);">⚠ ${noStop.map(p=>p.ticker).join(', ')} sin stop — riesgo real no calculable para ${noStop.length===1?'esta posición':'estas posiciones'}.</div>` : ''}
          </div>
        </div>
      </div>

      <!-- ESCENARIOS -->
      <div class="rm-panel" id="panel-escenarios">
        <div class="rm-card">
          <div class="rm-card-title">Simulador de Escenarios</div>
          <div class="rm-card-desc">¿Qué pasaría si el mercado cayera un X%? La exposición y el capital se toman de tu cartera real. La beta la introduces manualmente (pendiente de automatizar desde Métricas).</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
            <div class="rm-field"><label>Capital Total (€)</label>
              <input type="number" id="sc-capital" class="rm-sim-input" value="${totalCapital||10000}">
            </div>
            <div class="rm-field"><label>Beta de cartera <span style="color:var(--text3);text-transform:none;">(manual)</span></label>
              <input type="number" id="sc-beta" class="rm-sim-input" value="1.10" step="0.01">
            </div>
            <div class="rm-field"><label>Exposición actual (%)</label>
              <input type="number" id="sc-exp" class="rm-sim-input" value="${totalExposure.toFixed(1)}" step="0.1">
            </div>
          </div>
          <button class="btn btn-primary" id="sc-calc-btn">Calcular Escenarios</button>
          <div id="sc-results" style="margin-top:16px;"></div>
        </div>
      </div>

      <!-- MIS REGLAS -->
      <div class="rm-panel" id="panel-reglas">
        <div class="rm-grid2">
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Mis Reglas de Risk Management</div>
            <div class="rm-card-desc">Edita tus límites. Se guardan en Firestore y se usan en todo el módulo.</div>
            ${[
              ['maxRiskPerOp',  'Riesgo máximo por operación (%)',   'Nunca arriesgar más de este % en una sola posición (entrada - stop × acciones / capital).'],
              ['maxExposure',   'Exposición máxima total (%)',        'Porcentaje máximo del capital que puede estar invertido simultáneamente.'],
              ['maxPosition',   'Límite por posición individual (%)', 'Ninguna posición puede superar este % del capital.'],
              ['maxSector',     'Límite por sector (%)',              'Concentración máxima en un mismo sector.'],
              ['maxDrawdown',   'Drawdown máximo tolerable (%)',      'Si la cartera cae este % desde su máximo, parar y revisar.'],
              ['maxLosStreak',  'Rachas perdedoras (nº ops)',         'Tras este número de pérdidas consecutivas, reducir sizing a la mitad.'],
            ].map(([key, label, desc]) => `
              <div class="rm-rule">
                <div class="rm-rule-body">
                  <div class="rm-rule-title">${label}</div>
                  <div class="rm-rule-desc">${desc}</div>
                </div>
                <input type="number" class="rm-rule-input" data-key="${key}" value="${limits[key]}" step="0.5" style="width:70px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:6px 8px;color:var(--teal);font-family:var(--mono);font-size:13px;text-align:right;">
              </div>`).join('')}
            <button class="btn btn-primary" id="save-limits-btn" style="margin-top:16px;width:100%;">Guardar límites</button>
            <div id="limits-saved" style="font-size:10px;color:var(--green);font-family:var(--mono);margin-top:8px;text-align:center;display:none;">✓ Límites guardados</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="rm-card" style="margin-bottom:0;">
              <div class="rm-card-title">Cumplimiento Actual</div>
              <div class="rm-semaforo">
                ${semItem(s_risk,   'Riesgo por operaciones', Math.abs(totalRisk).toFixed(1)+'% / '+limits.maxRiskPerOp+'%')}
                ${semItem(s_exp,    'Exposición total', totalExposure.toFixed(1)+'% / '+limits.maxExposure+'%')}
                ${semItem(s_pos,    'Posición individual', (biggestPos?.valuePct||0).toFixed(1)+'% / '+limits.maxPosition+'%')}
                ${semItem(s_sector, 'Sector', biggestSector[1].toFixed(1)+'% / '+limits.maxSector+'%')}
                ${semItem(s_streak, 'Rachas perdedoras', streak+' / '+limits.maxLosStreak)}
                ${semItem(s_stops,  'Stops configurados', noStop.length===0?'✓ Todas':'✗ Faltan: '+noStop.map(p=>p.ticker).join(', '))}
              </div>
            </div>
            ${[...noStop.map(p=>({level:'bad', msg:`<strong style="color:var(--red)">${p.ticker}</strong> — Sin stop configurado. Añádelo en Cartera.`})),
               ...(biggestPos?.valuePct > limits.maxPosition*0.9 ? [{level: biggestPos.valuePct > limits.maxPosition ? 'bad':'warn', msg:`<strong style="color:${biggestPos.valuePct > limits.maxPosition ? 'var(--red)':'var(--amber)'}">${biggestPos.ticker}</strong> — Al ${biggestPos.valuePct.toFixed(1)}% del capital, ${biggestPos.valuePct > limits.maxPosition ? 'excede' : 'cerca de'} el límite del ${limits.maxPosition}%.`}] : []),
               ...(streak >= limits.maxLosStreak-1 ? [{level:'warn', msg:`Racha de ${streak} pérdidas consecutivas. Considera reducir el sizing.`}] : [])
              ].length > 0 ? `
            <div class="rm-card" style="margin-bottom:0;">
              <div class="rm-card-title">Acciones Recomendadas</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${[...noStop.map(p=>({level:'bad', msg:`<strong style="color:var(--red)">${p.ticker}</strong> — Sin stop configurado. Añádelo en Cartera.`})),
                   ...(biggestPos?.valuePct > limits.maxPosition*0.9 ? [{level: biggestPos.valuePct > limits.maxPosition ? 'bad':'warn', msg:`<strong style="color:${biggestPos.valuePct > limits.maxPosition ? 'var(--red)':'var(--amber)'}">${biggestPos.ticker}</strong> — Al ${biggestPos.valuePct.toFixed(1)}% del capital, ${biggestPos.valuePct > limits.maxPosition ? 'excede' : 'cerca de'} el límite del ${limits.maxPosition}%.`}] : []),
                   ...(streak >= limits.maxLosStreak-1 ? [{level:'warn', msg:`Racha de ${streak} pérdidas consecutivas. Considera reducir el sizing.`}] : [])
                  ].map(a=>`<div style="padding:10px 12px;background:rgba(${a.level==='bad'?'244,113,116':'251,191,36'},0.07);border:1px solid rgba(${a.level==='bad'?'244,113,116':'251,191,36'},0.2);border-radius:8px;font-size:11px;color:var(--text2);line-height:1.5;">${a.level==='bad'?'🔴':'⚠️'} ${a.msg}</div>`).join('')}
              </div>
            </div>` : ''}
          </div>
        </div>
      </div>
    `;

    // ── Tabs ──────────────────────────────────────
    el.querySelectorAll('.rm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        el.querySelectorAll('.rm-tab').forEach(t=>t.classList.remove('active'));
        el.querySelectorAll('.rm-panel').forEach(p=>p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-'+tab.dataset.tab).classList.add('active');
      });
    });

    // ── Simulador ─────────────────────────────────
    document.getElementById('sc-calc-btn')?.addEventListener('click', () => {
      const cap  = parseFloat(document.getElementById('sc-capital').value)||totalCapital||10000;
      const beta = parseFloat(document.getElementById('sc-beta').value)||1.1;
      const exp  = (parseFloat(document.getElementById('sc-exp').value)||totalExposure)/100;
      const scenarios = [
        { name:'Corrección leve',    pct:-0.05 },
        { name:'Corrección moderada',pct:-0.10 },
        { name:'Corrección fuerte',  pct:-0.20 },
        { name:'Bear market',        pct:-0.35 },
        { name:'Crash severo',       pct:-0.50 },
      ];
      const statusFor = impact => {
        if (impact > -0.05) return ['ok','TOLERABLE'];
        if (impact > -0.10) return ['warn','MONITOREAR'];
        if (impact > -0.20) return ['warn','REVISAR'];
        return ['bad','CRÍTICO'];
      };
      const rows = scenarios.map(s => {
        const impact = s.pct * beta * exp;
        const pl = cap * impact;
        const [cls, lbl] = statusFor(impact);
        return `<tr>
          <td>${s.name}</td>
          <td style="color:${s.pct<-0.15?'var(--red)':'var(--amber)'};">${(s.pct*100).toFixed(0)}%</td>
          <td class="r down">${(impact*100).toFixed(1)}%</td>
          <td class="r down">−${fmtE(Math.abs(pl))}</td>
          <td class="r">${fmtE(cap+pl)}</td>
          <td class="r">${chip(cls, lbl)}</td>
        </tr>`;
      }).join('');
      document.getElementById('sc-results').innerHTML = `
        <table class="rm-table">
          <thead><tr><th>ESCENARIO</th><th>CAÍDA</th><th class="r">IMPACTO</th><th class="r">P&L</th><th class="r">CAPITAL RESTANTE</th><th class="r">ESTADO</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-size:10px;color:var(--text3);margin-top:8px;">Exposición ${(exp*100).toFixed(1)}% · Beta ${beta} · Capital ${fmtE(cap)} · Los stops limitan la pérdida real a ${fmtE(Math.abs(totalMaxLoss))}.</p>`;
    });

    // ── Guardar límites ────────────────────────────
    document.getElementById('save-limits-btn')?.addEventListener('click', async () => {
      const newLimits = { ...limits };
      document.querySelectorAll('.rm-rule-input').forEach(inp => {
        newLimits[inp.dataset.key] = parseFloat(inp.value)||0;
      });
      await UserData.set(LIMITS_KEY, newLimits);
      const saved = document.getElementById('limits-saved');
      if (saved) { saved.style.display='block'; setTimeout(()=>saved.style.display='none', 2000); }
    });
  }

  document.getElementById('risk-refresh-btn')?.addEventListener('click', load);
  load();
  return { destroy() {} };
}
