// timeline.js — usa /api/macro-history (sin key en frontend)
import { getMacroData } from './macro-data.js';

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="tl-refresh">↻ Actualizar</button>`;
  container.innerHTML = `<div id="tl-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div></div></div>`;

  async function load() {
    const el = document.getElementById('tl-wrap');
    try {
      const [macro, hist] = await Promise.all([
        getMacroData(false),
        fetch('/api/macro-history?type=timeline').then(r => { if (!r.ok) throw new Error('macro-history: ' + r.status); return r.json(); })
      ]);
      paint(macro, hist);
    } catch(e) {
      document.getElementById('tl-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  function paint(macro, hist) {
    const el = document.getElementById('tl-wrap');
    const tl = hist.timeline || {};
    const s = macro.scoreTotal ?? 0;
    const mainCol = s >= 4 ? 'var(--green)' : s >= 0 ? 'var(--amber)' : 'var(--red)';

    const spNorm    = tl.spNorm    || [];
    const cpiYoY    = tl.cpiYoY   || [];
    const scoreHist = tl.scoreHistory || [];

    // Fix parsing de fechas: normalizar a YYYY-MM siempre
    function toYM(dateStr) {
      return String(dateStr || '').slice(0, 7); // YYYY-MM-DD → YYYY-MM
    }

    const allDates = [...spNorm, ...cpiYoY, ...scoreHist]
      .map(p => new Date(toYM(p.date) + '-01'))
      .filter(d => !isNaN(d));
    if (allDates.length === 0) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos históricos</div></div>`;
      return;
    }
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date();

    const W = 820, H = 180, PX = 8, PY = 12;

    // Todas las series necesitan el mismo rango de valores
    const allVals = [
      ...spNorm.map(p => p.value),
      ...cpiYoY.map(p => p.value),
      ...scoreHist.map(p => p.value * 15),
    ].filter(v => v != null && isFinite(v));
    const minVal = Math.min(...allVals, -10), maxVal = Math.max(...allVals, 10);

    function toX(dateStr) {
      const d = new Date(toYM(dateStr) + '-01');
      return PX + (d - minDate) / (maxDate - minDate) * (W - 2 * PX);
    }
    function toY(val) {
      return PY + (1 - (val - minVal) / (maxVal - minVal)) * (H - 2 * PY);
    }
    function pts(series, scale = 1) {
      return series.filter(p => p.value != null)
        .map(p => `${toX(p.date).toFixed(1)},${toY(p.value * scale).toFixed(1)}`).join(' ');
    }

    // Línea de cero
    const zeroY = toY(0);

    // Labels de años
    const years = [];
    let y = new Date(minDate); y.setMonth(0); y.setDate(1);
    while (y <= maxDate) {
      years.push({ year: y.getFullYear(), x: toX(y.toISOString().slice(0, 7)) });
      y = new Date(y.getFullYear() + 1, 0, 1);
    }

    el.innerHTML = `
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);">
            SP500 normalizado · CPI YoY · Score histórico parcial (3/11 indicadores) · ${minDate.getFullYear()}–${maxDate.getFullYear()}
          </div>
          <div style="display:flex;gap:14px;">
            ${[['var(--green)','SP500 (norm.)'],['var(--red)','CPI YoY'],['var(--teal)','Score parcial ×15']].map(([c,l])=>
              `<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--text2);"><div style="width:8px;height:3px;background:${c};border-radius:2px;"></div>${l}</div>`).join('')}
          </div>
        </div>
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;background:var(--surface2);border-radius:8px;" preserveAspectRatio="none">
          <line x1="0" y1="${zeroY.toFixed(1)}" x2="${W}" y2="${zeroY.toFixed(1)}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4"/>
          ${years.map(y => `
            <line x1="${y.x.toFixed(1)}" y1="0" x2="${y.x.toFixed(1)}" y2="${H}" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3"/>
            <text x="${(y.x + 3).toFixed(1)}" y="${H - 3}" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">${y.year}</text>
          `).join('')}
          ${pts(cpiYoY)    ? `<polyline points="${pts(cpiYoY)}"     fill="none" stroke="var(--red)"   stroke-width="1.5" stroke-linejoin="round" opacity="0.75"/>` : ''}
          ${pts(spNorm)    ? `<polyline points="${pts(spNorm)}"     fill="none" stroke="var(--green)" stroke-width="2"   stroke-linejoin="round" opacity="0.8"/>` : ''}
          ${pts(scoreHist) ? `<polyline points="${pts(scoreHist, 15)}" fill="none" stroke="var(--teal)"  stroke-width="2" stroke-linejoin="round"/>` : ''}
          <circle cx="${(W - PX - 4).toFixed(1)}" cy="${(PY + 10).toFixed(1)}" r="4" fill="${mainCol}"/>
          <text x="${(W - PX - 30).toFixed(1)}" y="${(PY + 8).toFixed(1)}" font-family="IBM Plex Mono" font-size="8" fill="${mainCol}">${s >= 0 ? '+' : ''}${s}</text>
        </svg>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          Score histórico parcial = Curva USD + Tipo Real (×15 para visibilidad). Cobertura: 2/11 indicadores del motor actual.
          BBB excluido del score histórico (ya contabiliza en 1.2 Liquidez).
          Fase 2: Macro Score histórico canónico con todos los indicadores.
          ${hist.errors?.length ? ' · ⚠ ' + hist.errors.slice(0, 2).join(', ') : ''}
        </div>
      </div>

      <!-- ANALOGÍAS HISTÓRICAS — FASE 2 -->
      <div class="mac-card" style="background:rgba(251,191,36,0.04);border-color:rgba(251,191,36,0.2);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:10px;">
          Analogías Históricas <span style="color:var(--amber);margin-left:8px;">⏳ Fase 2 — Motor de Similitud Pendiente</span>
        </div>
        <div style="font-size:11px;color:var(--text2);line-height:1.7;margin-bottom:12px;">
          La tabla anterior contenía 5 episodios seleccionados manualmente. Ha sido eliminada porque no representa una metodología auditable.
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Fase 2 · Motor de Similitud</div>
            Vector macro mensual normalizado → distancia coseno → top N análogos históricos
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Fase 2 · Retornos Forward</div>
            S&amp;P 500 +3m / +6m / +12m calculados automáticamente desde histórico Yahoo Finance
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Fase 2 · Cobertura mínima</div>
            Solo emitir analogía si el vector histórico comparte ≥ N indicadores con el vector actual
          </div>
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Fuentes: Yahoo Finance (SP500 mensual) · FRED (CPIAUCSL, DGS10, DGS2, DFF) · Score histórico: Curva USD + Tipo Real · Fase 2: motor de similitud pendiente</div>
    `;
  }

  document.getElementById('tl-refresh')?.addEventListener('click', load);
  await load();
  return { destroy() {} };
}
