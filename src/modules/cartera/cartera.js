// ═══════════════════════════════════════════════
// MÓDULO: Cartera · Gestión de Posiciones
// Replicación exacta del original:
// - Cards por posición con precio actual, P&L, stops
// - Stop activo: EMA10 Semanal o EMA10 Diario
// - Alertas: 🛑 Stop tocado · 🚨 Escape Falso
// - Persistencia en Firestore via UserData
// ═══════════════════════════════════════════════

import { UserData } from '../../userdata.js';

const STORAGE_KEY = 'ethan_positions';
const HISTORY_KEY  = 'ethan_positions_history';

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
];

async function fetchData(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y&events=history`;
  for (const fn of PROXIES) {
    try {
      const r = await fetch(fn(url), { signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      const text = await r.text();
      let j; try { j = JSON.parse(text); } catch { continue; }
      const res = j?.chart?.result?.[0]; if (!res) continue;
      const q = res.indicators?.quote?.[0]; if (!q) continue;
      const meta = res.meta || {};
      return {
        timestamps: res.timestamp,
        opens:  q.open, highs: q.high,
        lows:   q.low,  closes: q.close,
        volumes: q.volume,
        name: meta.shortName || meta.longName || ticker,
        currency: meta.currency || 'USD'
      };
    } catch {}
  }
  throw new Error('Sin datos disponibles');
}

function calcEMA(arr, p) {
  const k = 2/(p+1), out = new Array(arr.length).fill(null);
  let s = arr.findIndex(v => v != null && !isNaN(v));
  if (s < 0) return out; out[s] = arr[s];
  for (let i = s+1; i < arr.length; i++) {
    const v = (arr[i] != null && !isNaN(arr[i])) ? arr[i] : out[i-1];
    out[i] = v*k + out[i-1]*(1-k);
  }
  return out;
}

function resampleWeekly(ts, O, H, L, C, V) {
  const weeks = {};
  ts.forEach((t, i) => {
    const d = new Date(t*1000);
    const dy = d.getDay(), df = d.getDate()-dy+(dy===0?-6:1);
    const mo = new Date(+d); mo.setDate(df);
    const key = mo.toISOString().slice(0,10);
    if (!weeks[key]) weeks[key] = { o:O[i], h:H[i], l:L[i], c:C[i], v:V[i] };
    else { weeks[key].h=Math.max(weeks[key].h,H[i]); weeks[key].l=Math.min(weeks[key].l,L[i]); weeks[key].c=C[i]; weeks[key].v+=V[i]; }
  });
  const keys = Object.keys(weeks).sort();
  return { opens:keys.map(k=>weeks[k].o), highs:keys.map(k=>weeks[k].h), lows:keys.map(k=>weeks[k].l), closes:keys.map(k=>weeks[k].c) };
}

function detectEscapeFalso(highs, closes) {
  const n = highs.length; if (n < 5) return false;
  const curr=n-1, prev1=n-2, prev2=n-3;
  let maxPrev = 0;
  for (let i = Math.max(0, prev2-10); i < prev2; i++) maxPrev = Math.max(maxPrev, highs[i]);
  return highs[prev2] > maxPrev
    && closes[prev1] < highs[prev2]
    && closes[curr]  < highs[prev2]
    && closes[prev1] < closes[prev2]
    && closes[curr]  < closes[prev1];
}

function analyzePosition(pos, data) {
  const { timestamps, opens, highs, lows, closes, volumes, name, currency } = data;
  const n = closes.length, di = n-1;
  const currentPrice = closes[di];

  const ema10d = calcEMA(closes, 10);
  const stopDiario = ema10d[di];

  const W = resampleWeekly(timestamps, opens, highs, lows, closes, volumes);
  const ema10w = calcEMA(W.closes, 10);
  const stopSemanal = ema10w[W.closes.length-1];

  const activeStop = pos.stopType === 'semanal' ? stopSemanal : stopDiario;
  const escapeFalso = detectEscapeFalso(highs, closes);
  const pnlPct = ((currentPrice - pos.entry) / pos.entry) * 100;
  const distStop = ((currentPrice - activeStop) / currentPrice) * 100;
  const tocoStop = currentPrice <= activeStop * 1.005;

  return { currentPrice, stopDiario, stopSemanal, activeStop, escapeFalso, tocoStop, pnlPct, distStop, name, currency };
}

// ── RENDER ─────────────────────────────────────
export async function render(container, { actionsSlot }) {
  let positions = (await UserData.get(STORAGE_KEY)) || [];
  let history   = (await UserData.get(HISTORY_KEY))  || [];

  actionsSlot.innerHTML = `
    <div class="pos-add-bar">
      <input type="text" id="pos-ticker" placeholder="Ticker" class="wl-input" style="width:110px;text-transform:uppercase;" autocomplete="off">
      <input type="number" id="pos-entry" placeholder="Precio entrada" class="wl-input" style="width:150px;" step="0.01">
      <select id="pos-stop-type" class="sc2-sel">
        <option value="semanal">Stop EMA10 Semanal</option>
        <option value="diario">Stop EMA10 Diario</option>
      </select>
      <input type="text" id="pos-notas" placeholder="Notas (opcional)" class="wl-input" style="width:160px;">
      <button class="btn btn-primary" id="pos-add-btn">+ Añadir posición</button>
    </div>
  `;

  container.innerHTML = `<div id="pos-list"></div>`;

  async function savePositions() {
    await UserData.set(STORAGE_KEY, positions);
  }
  async function saveHistory() {
    await UserData.set(HISTORY_KEY, history);
  }

  function renderCard(pos, analysis, loading=false) {
    const pnlColor = analysis?.pnlPct > 0 ? 'var(--green)' : analysis?.pnlPct < 0 ? 'var(--red)' : 'var(--text2)';
    const pnlSign  = analysis?.pnlPct > 0 ? '+' : '';
    const fmtP = v => v != null ? '$'+v.toFixed(2) : '—';
    const fmtPct = v => v != null ? v.toFixed(1)+'%' : '—';

    if (loading) return `
      <div class="pos-card loading" id="poscard-${pos.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${pos.ticker}</div><div class="pos-name">Cargando...</div></div>
          <span class="wl-spinner"></span>
        </div>
      </div>`;

    if (!analysis) return `
      <div class="pos-card error" id="poscard-${pos.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${pos.ticker}</div><div class="pos-name" style="color:var(--red)">Error al cargar</div></div>
          <button class="pos-del-btn" data-ticker="${pos.ticker}">✕</button>
        </div>
      </div>`;

    const distD = ((analysis.currentPrice - analysis.stopDiario)  / analysis.currentPrice * 100).toFixed(1);
    const distW = ((analysis.currentPrice - analysis.stopSemanal) / analysis.currentPrice * 100).toFixed(1);

    return `
      <div class="pos-card ${analysis.tocoStop?'stop-hit':''} ${analysis.escapeFalso?'escape-alert-card':''}" id="poscard-${pos.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${pos.ticker}</div>
            <div class="pos-name">${analysis.name||''} · ${analysis.currency||'USD'}</div>
            ${pos.notas?`<div class="pos-notas">${pos.notas}</div>`:''}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${pos.ticker}" data-price="${analysis.currentPrice?.toFixed(2)||''}" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${pos.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>

        <div class="pos-metrics">
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Actual</div>
            <div class="pos-metric-val">${fmtP(analysis.currentPrice)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Entrada</div>
            <div class="pos-metric-val" style="color:var(--text2)">${fmtP(pos.entry)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">P&L</div>
            <div class="pos-metric-val" style="color:${pnlColor}">${pnlSign}${fmtPct(analysis.pnlPct)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Stop Activo (${pos.stopType==='semanal'?'Semanal':'Diario'})</div>
            <div class="pos-metric-val" style="color:var(--red)">${fmtP(analysis.activeStop)}</div>
          </div>
        </div>

        <div class="pos-stops">
          <div class="pos-stop-row ${pos.stopType==='diario'?'active':''}">
            <span class="pos-stop-label">EMA10 Diario</span>
            <span class="pos-stop-val">${fmtP(analysis.stopDiario)}</span>
            <span class="pos-stop-dist">(${distD}%)</span>
          </div>
          <div class="pos-stop-row ${pos.stopType==='semanal'?'active':''}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${fmtP(analysis.stopSemanal)}</span>
            <span class="pos-stop-dist">(${distW}%)</span>
          </div>
        </div>

        ${analysis.tocoStop ? `
          <div class="pos-alert stop">
            <span class="pos-alert-icon">🛑</span>
            <div>
              <div class="pos-alert-title">STOP TOCADO — EMA10 ${pos.stopType==='semanal'?'SEMANAL':'DIARIO'}</div>
              <div class="pos-alert-desc">El precio ha alcanzado tu stop dinámico en ${fmtP(analysis.activeStop)}. Considera cerrar la posición.</div>
            </div>
          </div>` : ''}

        ${analysis.escapeFalso ? `
          <div class="pos-alert escape">
            <span class="pos-alert-icon">🚨</span>
            <div>
              <div class="pos-alert-title">ESCAPE FALSO DETECTADO</div>
              <div class="pos-alert-desc">El precio hizo nuevo máximo pero cerró por debajo. Señal de debilidad — considera salir antes del stop.</div>
            </div>
          </div>` : ''}
      </div>`;
  }

  function attachCardListeners() {
    document.querySelectorAll('.pos-del-btn:not([data-idx])').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(`¿Eliminar ${btn.dataset.ticker} sin guardar en historial?`)) return;
        positions = positions.filter(p => p.ticker !== btn.dataset.ticker);
        await savePositions();
        renderAll();
      });
    });
    document.querySelectorAll('.pos-close-btn').forEach(btn => {
      btn.addEventListener('click', () => showCloseModal(btn.dataset.ticker, parseFloat(btn.dataset.price)));
    });
  }

  async function renderAll() {
    const el = document.getElementById('pos-list');
    if (!el) return;

    if (positions.length === 0) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`;
      renderHistory();
      return;
    }

    el.innerHTML = `
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${positions.length})</div>
        ${positions.map(p => renderCard(p, null, true)).join('')}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`;

    renderHistory();

    await Promise.all(positions.map(async pos => {
      try {
        const data = await fetchData(pos.ticker);
        const analysis = analyzePosition(pos, data);
        const card = document.getElementById(`poscard-${pos.ticker}`);
        if (card) card.outerHTML = renderCard(pos, analysis);
      } catch {
        const card = document.getElementById(`poscard-${pos.ticker}`);
        if (card) card.outerHTML = renderCard(pos, null);
      }
    }));

    attachCardListeners();
  }

  // ── Modal de cierre ─────────────────────────
  function showCloseModal(ticker, currentPrice) {
    const existing = document.getElementById('pos-close-modal');
    if (existing) existing.remove();

    const pos = positions.find(p => p.ticker === ticker);
    if (!pos) return;

    const modal = document.createElement('div');
    modal.id = 'pos-close-modal';
    modal.innerHTML = `
      <div class="pos-modal-overlay">
        <div class="pos-modal">
          <div class="pos-modal-title">Cerrar posición · ${ticker}</div>
          <div class="pos-modal-body">
            <div class="pos-modal-row">
              <label>Precio de cierre</label>
              <input type="number" id="close-price" value="${currentPrice||''}" step="0.01" class="wl-input" style="width:140px;">
            </div>
            <div class="pos-modal-row">
              <label>Fecha de cierre</label>
              <input type="date" id="close-date" value="${new Date().toISOString().slice(0,10)}" class="wl-input" style="width:160px;">
            </div>
            <div class="pos-modal-row">
              <label>Motivo de cierre</label>
              <select id="close-reason" class="sc2-sel" style="width:200px;">
                <option value="stop">🛑 Stop tocado (EMA10)</option>
                <option value="objetivo">🎯 Objetivo alcanzado</option>
                <option value="escape">🚨 Escape falso</option>
                <option value="condiciones">📉 Condiciones rotas</option>
                <option value="manual">✋ Cierre manual</option>
              </select>
            </div>
            <div class="pos-modal-row">
              <label>Notas de cierre</label>
              <input type="text" id="close-notas" placeholder="Opcional..." class="wl-input" style="width:280px;">
            </div>
            ${currentPrice ? `
            <div class="pos-modal-pnl">
              P&L estimado: <strong style="color:${currentPrice>=pos.entry?'var(--green)':'var(--red)'}">
                ${currentPrice>=pos.entry?'+':''}${(((currentPrice-pos.entry)/pos.entry)*100).toFixed(2)}%
              </strong>
            </div>` : ''}
          </div>
          <div class="pos-modal-footer">
            <button class="btn" id="close-cancel">Cancelar</button>
            <button class="btn btn-primary" id="close-confirm">Confirmar cierre</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('close-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.pos-modal-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) modal.remove(); });

    // Actualizar P&L en tiempo real al cambiar precio
    document.getElementById('close-price').addEventListener('input', e => {
      const p = parseFloat(e.target.value);
      const pnlEl = modal.querySelector('.pos-modal-pnl');
      if (pnlEl && p > 0) {
        const pnl = ((p-pos.entry)/pos.entry*100).toFixed(2);
        pnlEl.innerHTML = `P&L: <strong style="color:${p>=pos.entry?'var(--green)':'var(--red)'}">${p>=pos.entry?'+':''}${pnl}%</strong>`;
      }
    });

    document.getElementById('close-confirm').addEventListener('click', async () => {
      const closePrice  = parseFloat(document.getElementById('close-price').value);
      const closeDate   = document.getElementById('close-date').value;
      const closeReason = document.getElementById('close-reason').value;
      const closeNotas  = document.getElementById('close-notas').value;

      if (!closePrice || closePrice <= 0) { alert('Introduce el precio de cierre'); return; }

      const pnlPct = ((closePrice - pos.entry) / pos.entry) * 100;
      const entryDate = new Date(pos.addedAt);
      const exitDate  = new Date(closeDate);
      const duration  = Math.round((exitDate - entryDate) / 86400000);

      history.unshift({
        ticker:      pos.ticker,
        name:        pos.name || pos.ticker,
        entry:       pos.entry,
        exit:        closePrice,
        pnlPct:      pnlPct,
        stopType:    pos.stopType,
        reason:      closeReason,
        notasEntrada:pos.notas || '',
        notasSalida: closeNotas,
        entryDate:   new Date(pos.addedAt).toLocaleDateString('es-ES'),
        exitDate:    new Date(closeDate).toLocaleDateString('es-ES'),
        duration:    duration,
        closedAt:    Date.now()
      });

      positions = positions.filter(p => p.ticker !== ticker);
      await savePositions();
      await saveHistory();
      modal.remove();
      renderAll();
    });
  }

  // ── Historial de posiciones cerradas ─────────
  function renderHistory() {
    const el = document.getElementById('pos-history');
    if (!el) return;

    if (history.length === 0) {
      el.innerHTML = `<div class="sc2-empty">Sin posiciones cerradas todavía</div>`;
      return;
    }

    const winners = history.filter(h => h.pnlPct > 0).length;
    const losers  = history.filter(h => h.pnlPct <= 0).length;
    const avgPnl  = history.reduce((s,h) => s+h.pnlPct, 0) / history.length;
    const bestPnl = Math.max(...history.map(h=>h.pnlPct));
    const worstPnl= Math.min(...history.map(h=>h.pnlPct));

    const reasonLabel = { stop:'🛑 Stop', objetivo:'🎯 Objetivo', escape:'🚨 Escape falso', condiciones:'📉 Condiciones', manual:'✋ Manual' };

    el.innerHTML = `
      <!-- Resumen estadístico -->
      <div class="pos-hist-stats">
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val">${history.length}</div>
          <div class="pos-hist-stat-lbl">Operaciones</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">${winners}</div>
          <div class="pos-hist-stat-lbl">Ganadoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${losers}</div>
          <div class="pos-hist-stat-lbl">Perdedoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:${avgPnl>=0?'var(--green)':'var(--red)'}">${avgPnl>=0?'+':''}${avgPnl.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">P&L medio</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">+${bestPnl.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">Mejor op.</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${worstPnl.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">Peor op.</div>
        </div>
      </div>

      <!-- Tabla historial -->
      <table class="sc2-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>TICKER</th><th>ENTRADA</th><th>SALIDA</th>
            <th>P&L</th><th>DURACIÓN</th><th>MOTIVO</th><th>NOTAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${history.map((h, i) => `
            <tr>
              <td>
                <div class="sc2-ticker">${h.ticker}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${h.entryDate} → ${h.exitDate}</div>
              </td>
              <td class="sc2-price">$${h.entry.toFixed(2)}</td>
              <td class="sc2-price">$${h.exit.toFixed(2)}</td>
              <td class="sc2-score" style="color:${h.pnlPct>=0?'var(--green)':'var(--red)'}">
                ${h.pnlPct>=0?'+':''}${h.pnlPct.toFixed(2)}%
              </td>
              <td class="sc2-vol">${h.duration}d</td>
              <td style="font-size:10px;color:var(--text2);">${reasonLabel[h.reason]||h.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${h.notasSalida||'—'}</td>
              <td>
                <button class="pos-del-btn" data-idx="${i}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    // Listener eliminar del historial
    el.querySelectorAll('.pos-del-btn[data-idx]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar esta operación del historial?')) return;
        history.splice(parseInt(btn.dataset.idx), 1);
        await saveHistory();
        renderHistory();
      });
    });
  }

  // Añadir posición
  document.getElementById('pos-add-btn')?.addEventListener('click', async () => {
    const ticker   = document.getElementById('pos-ticker')?.value.trim().toUpperCase();
    const entry    = parseFloat(document.getElementById('pos-entry')?.value);
    const stopType = document.getElementById('pos-stop-type')?.value || 'semanal';
    const notas    = document.getElementById('pos-notas')?.value.trim() || '';

    if (!ticker || !entry || entry <= 0) {
      alert('Completa el ticker y el precio de entrada.'); return;
    }
    if (positions.find(p => p.ticker === ticker)) {
      alert(`${ticker} ya está en cartera.`); return;
    }

    positions.push({ ticker, entry, stopType, notas, addedAt: Date.now() });
    await savePositions();

    document.getElementById('pos-ticker').value  = '';
    document.getElementById('pos-entry').value   = '';
    document.getElementById('pos-notas').value   = '';

    renderAll();
  });

  // Enter en los inputs
  ['pos-ticker','pos-entry','pos-notas'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('pos-add-btn')?.click();
    });
  });
  document.getElementById('pos-ticker')?.addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase();
  });

  renderAll();
  return { destroy() {} };
}
