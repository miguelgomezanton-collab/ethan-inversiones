// timeline.js — Timeline Histórico + Analogías (Fase 2 pendiente)
import { getMacroData } from './macro-data.js';

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `
    <div style="display:flex;gap:6px;align-items:center;">
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Ventana:</span>
      ${['5Y','10Y','20Y','MAX'].map(w =>
        `<button class="btn tl-win ${w==='10Y'?'btn-primary':''}" data-w="${w}" style="padding:5px 10px;font-size:10px;">${w}</button>`
      ).join('')}
      <button class="btn btn-primary" id="tl-refresh" style="margin-left:6px;">↻</button>
    </div>`;
  container.innerHTML = `<div id="tl-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div></div></div>`;

  let currentWindow = '10Y';

  async function load() {
    const el = document.getElementById('tl-wrap');
    try {
      const [macro, hist] = await Promise.all([
        getMacroData(false),
        fetch('/api/macro-history?type=timeline').then(r => { if (!r.ok) throw new Error('macro-history: ' + r.status); return r.json(); })
      ]);
      paint(macro, hist);
    } catch(e) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  function paint(macro, hist) {
    const el = document.getElementById('tl-wrap');
    const tl = hist.timeline || {};
    const s  = macro.scoreTotal ?? 0;
    const mainCol = s >= 4 ? 'var(--green)' : s >= 0 ? 'var(--amber)' : 'var(--red)';

    const spNorm    = tl.spNorm      || [];
    const cpiYoY    = tl.cpiYoY     || [];
    const scoreHist = tl.scoreHistory || [];

    // Normalizar fechas a YYYY-MM
    const toYM = d => String(d || '').slice(0, 7);

    // Período común efectivo entre las tres series
    // Período común SP500 + CPI (el score se superpone donde esté disponible)
    const spDates   = new Set(spNorm.map(p => toYM(p.date)));
    const cpiDates  = new Set(cpiYoY.map(p => toYM(p.date)));
    const commonDates = [...spDates].filter(d => cpiDates.has(d)).sort();

    if (commonDates.length === 0) {
      const spSample  = [...spDates].sort().slice(-3).join(', ');
      const cpiSample = [...cpiDates].sort().slice(-3).join(', ');
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin período común</div>
        <div class="empty-desc" style="font-family:var(--mono);font-size:10px;text-align:left;max-width:600px;margin:0 auto;">
          spNorm: ${spNorm.length} obs · cpiYoY: ${cpiYoY.length} obs · scoreHist: ${scoreHist.length} obs<br>
          spNorm últimas 3 fechas: ${spSample}<br>
          cpiYoY últimas 3 fechas: ${cpiSample}<br>
          errors: ${JSON.stringify(hist.errors||[])}
        </div></div>`;
      return;
    }

    // Rango según ventana seleccionada
    const lastDate = new Date(commonDates[commonDates.length - 1] + '-01');
    const windowYears = currentWindow === 'MAX' ? 100 : parseInt(currentWindow);
    const windowStart = new Date(lastDate);
    windowStart.setFullYear(windowStart.getFullYear() - windowYears);
    const windowStartYM = windowStart.toISOString().slice(0, 7);

    const filteredDates = commonDates.filter(d => d >= windowStartYM);
    if (filteredDates.length < 3) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos suficientes en ventana ${currentWindow}</div></div>`;
      return;
    }

    const minYM = filteredDates[0];
    const maxYM = filteredDates[filteredDates.length - 1];
    const minDate = new Date(minYM + '-01');
    const maxDate = new Date(maxYM + '-01');

    // Filtrar series al rango
    const spF   = spNorm.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);
    const cpiF  = cpiYoY.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);
    const scF   = scoreHist.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);

    // Cobertura del score histórico
    const debug = hist.timeline?._debug || {};
    const SCORE_COMPONENTS = 2;
    const TOTAL_INDICATORS = 11;
    const coverageLabel = `${SCORE_COMPONENTS}/${TOTAL_INDICATORS} indicadores`;
    const scoreFrom = debug.firstScore ? debug.firstScore.slice(0,7) : (scF.length ? toYM(scF[0].date) : '—');
    const scoreLast = debug.lastScore  ? debug.lastScore.slice(0,7)  : '—';
    const scoreN    = debug.nScore     ?? scF.length;

    // SVG dimensiones — 3 paneles sincronizados
    const W = 820, PX = 40, PY = 8;
    const PANEL_H = 90, GAP = 12;
    const TOTAL_H = PANEL_H * 3 + GAP * 2 + PY * 2 + 20;

    function toX(dateStr) {
      const d = new Date(toYM(dateStr) + '-01');
      const span = maxDate - minDate;
      return span > 0 ? PX + (d - minDate) / span * (W - 2 * PX) : PX;
    }

    function makeY(values, panelTop) {
      const valid = values.filter(v => v != null && isFinite(v));
      if (!valid.length) return { toY: () => panelTop + PANEL_H/2, min: 0, max: 0 };
      const min = Math.min(...valid), max = Math.max(...valid);
      const pad = (max - min) * 0.1 || 1;
      return {
        toY: v => panelTop + PY + (1 - (v - (min-pad)) / ((max+pad) - (min-pad))) * (PANEL_H - 2*PY),
        min: min - pad, max: max + pad,
      };
    }

    function pts(series, toY) {
      return series.filter(p => p.value != null && isFinite(p.value))
        .map(p => `${toX(p.date).toFixed(1)},${toY(p.value).toFixed(1)}`).join(' ');
    }

    const p1top = PY;
    const p2top = PY + PANEL_H + GAP;
    const p3top = PY + (PANEL_H + GAP) * 2;

    const yP1 = makeY(spF.map(p => p.value), p1top);
    const yP2 = makeY(cpiF.map(p => p.value), p2top);
    const yP3 = makeY(scF.map(p => p.value), p3top);

    const zeroP2 = yP2.toY(0);
    const zeroP3 = yP3.toY(0);

    // Ticks eje X — quinquenales para MAX/20Y, anuales para 10Y/5Y
    const tickStep = windowYears >= 15 ? 5 : 1;
    const ticks = [];
    let ty = Math.ceil(minDate.getFullYear() / tickStep) * tickStep;
    while (ty <= maxDate.getFullYear()) {
      const x = toX(`${ty}-01`);
      ticks.push({ year: ty, x });
      ty += tickStep;
    }

    // Label eje Y para cada panel
    function yLabels(yFn, min, max, panelTop) {
      const steps = 3;
      return Array.from({ length: steps + 1 }, (_, i) => {
        const v = min + (max - min) * i / steps;
        return { y: yFn(v), label: v >= 100 ? v.toFixed(0) : v.toFixed(1) };
      });
    }

    el.innerHTML = `
      <!-- VENTANA Y COBERTURA -->
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Timeline Histórico · Período Común</span>
            <span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:10px;">${minYM} → ${maxYM}</span>
          </div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--amber);">
            Score histórico: ${coverageLabel} · PARCIAL / PROVISIONAL · ${scoreN} meses · ${scoreFrom} → ${scoreLast}
          </div>
        </div>

        <svg viewBox="0 0 ${W} ${TOTAL_H}" style="width:100%;background:var(--surface2);border-radius:8px;" preserveAspectRatio="xMidYMid meet">
          <!-- Etiquetas paneles -->
          <text x="${PX}" y="${p1top + 12}" font-family="IBM Plex Mono" font-size="9" fill="var(--green)">S&amp;P 500 (var. % desde inicio ventana)</text>
          <text x="${PX}" y="${p2top + 12}" font-family="IBM Plex Mono" font-size="9" fill="var(--red)">CPI YoY %</text>
          <text x="${PX}" y="${p3top + 12}" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">Score histórico (${coverageLabel})</text>

          <!-- Separadores de panel -->
          <line x1="${PX}" y1="${p2top}" x2="${W-PX}" y2="${p2top}" stroke="var(--border)" stroke-width="0.5"/>
          <line x1="${PX}" y1="${p3top}" x2="${W-PX}" y2="${p3top}" stroke="var(--border)" stroke-width="0.5"/>

          <!-- Líneas cero P2 y P3 -->
          <line x1="${PX}" y1="${zeroP2.toFixed(1)}" x2="${W-PX}" y2="${zeroP2.toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>
          <line x1="${PX}" y1="${zeroP3.toFixed(1)}" x2="${W-PX}" y2="${zeroP3.toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>

          <!-- Ticks X -->
          ${ticks.map(t => `
            <line x1="${t.x.toFixed(1)}" y1="${p1top}" x2="${t.x.toFixed(1)}" y2="${p3top+PANEL_H}" stroke="var(--border)" stroke-width="0.4" stroke-dasharray="3"/>
            <text x="${t.x.toFixed(1)}" y="${(p3top+PANEL_H+14).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">${t.year}</text>
          `).join('')}

          <!-- Series -->
          ${pts(spF, yP1.toY)  ? `<polyline points="${pts(spF, yP1.toY)}"  fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/>` : ''}
          ${pts(cpiF, yP2.toY) ? `<polyline points="${pts(cpiF, yP2.toY)}" fill="none" stroke="var(--red)"   stroke-width="1.5" stroke-linejoin="round" opacity="0.75"/>` : ''}
          ${pts(scF, yP3.toY)  ? `<polyline points="${pts(scF, yP3.toY)}"  fill="none" stroke="var(--teal)"  stroke-width="2"   stroke-linejoin="round"/>` : ''}

          <!-- Punto actual score -->
          ${scF.length ? `
            <circle cx="${toX(scF[scF.length-1].date).toFixed(1)}" cy="${yP3.toY(scF[scF.length-1].value).toFixed(1)}" r="4" fill="${mainCol}"/>
            <text x="${(toX(scF[scF.length-1].date)+6).toFixed(1)}" y="${(yP3.toY(scF[scF.length-1].value)+4).toFixed(1)}" font-family="IBM Plex Mono" font-size="9" fill="${mainCol}">${s>=0?'+':''}${s}</text>
          ` : ''}
        </svg>

        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;line-height:1.7;">
          Score histórico parcial = Curva USD + Tipo Real [${SCORE_COMPONENTS}/${TOTAL_INDICATORS} indicadores].
          BBB excluido (→ 1.2 Liquidez). Período común: ${minYM} → ${maxYM} (${filteredDates.length} meses).
          Fase 2: Macro Score histórico canónico con cobertura completa.
          ${hist.errors?.length ? ' · ⚠ ' + hist.errors.slice(0, 2).join(', ') : ''}
        </div>
      </div>

      <!-- ANALOGÍAS — FASE 2 -->
      <div class="mac-card" style="background:rgba(251,191,36,0.04);border-color:rgba(251,191,36,0.2);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:10px;">
          Analogías Históricas <span style="color:var(--amber);margin-left:8px;">⏳ Fase 2 — Motor de Similitud Pendiente</span>
        </div>
        <div style="font-size:11px;color:var(--text2);line-height:1.7;margin-bottom:12px;">
          La tabla anterior contenía 5 episodios seleccionados manualmente y ha sido eliminada. No representa una metodología auditable.
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Motor de Similitud</div>
            Vector macro mensual normalizado → distancia coseno → top N análogos con cobertura mínima
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Retornos Forward</div>
            S&amp;P 500 +3m / +6m / +12m calculados automáticamente desde histórico Yahoo Finance
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Macro Score Canónico</div>
            Reconstrucción desde 1990/2000 con alta cobertura y metodología homogénea al motor actual
          </div>
        </div>
      </div>

      <div class="co-footer" style="margin-top:14px;">
        Fuentes: Yahoo Finance (^GSPC mensual) · FRED (CPIAUCSL, DGS10, DGS2, DFF) ·
        Score histórico: Curva USD + Tipo Real [${coverageLabel}] · PARCIAL/PROVISIONAL ·
        Analogías Fase 2 pendiente
      </div>
    `;
  }

  // Botones de ventana
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tl-win');
    if (!btn) return;
    currentWindow = btn.dataset.w;
    document.querySelectorAll('.tl-win').forEach(b => b.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
    load();
  });
  document.getElementById('tl-refresh')?.addEventListener('click', load);
  await load();
  return { destroy() {} };
}
