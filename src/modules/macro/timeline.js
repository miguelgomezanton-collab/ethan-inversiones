// timeline.js — Timeline Histórico con selector de variable macro
import { getMacroData } from './macro-data.js';

const MACRO_VARS = {
  US10Y:        { label: 'Treasury 10Y' },
  DFF:          { label: 'Fed Funds Rate' },
  CPI_YOY:      { label: 'CPI Headline YoY' },
  CORE_CPI_YOY: { label: 'Core CPI YoY' },
};

export async function render(container, { actionsSlot }) {
  let currentWindow = '10Y';
  let currentVar    = 'US10Y';

  actionsSlot.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Variable:</span>
        <select id="tl-var" style="background:var(--surface2);border:1px solid var(--border);color:var(--text1);font-family:var(--mono);font-size:10px;padding:4px 8px;border-radius:4px;cursor:pointer;">
          ${Object.entries(MACRO_VARS).map(([k,v]) =>
            `<option value="${k}" ${k==='US10Y'?'selected':''}>${v.label}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:4px;">
        ${['5Y','10Y','20Y','MAX'].map(w =>
          `<button class="btn tl-win ${w==='10Y'?'btn-primary':''}" data-w="${w}" style="padding:4px 9px;font-size:10px;">${w}</button>`
        ).join('')}
      </div>
      <button class="btn btn-primary" id="tl-refresh" style="padding:4px 9px;font-size:10px;">↻</button>
    </div>`;

  container.innerHTML = `<div id="tl-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div></div></div>`;

  let histData = null;

  async function load(force = false) {
    const el = document.getElementById('tl-wrap');
    try {
      const [macro, hist] = await Promise.all([
        getMacroData(force),
        fetch('/api/macro-history?type=timeline').then(r => { if (!r.ok) throw new Error('macro-history: ' + r.status); return r.json(); })
      ]);
      histData = hist;
      paint(macro, hist);
    } catch(e) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  function paint(macro, hist) {
    const el = document.getElementById('tl-wrap');
    const tl  = hist.timeline || {};
    const s   = macro.scoreTotal ?? 0;
    const mainCol = s >= 4 ? 'var(--green)' : s >= 0 ? 'var(--amber)' : 'var(--red)';

    const spNorm    = tl.spNorm       || [];
    const scoreHist = tl.scoreHistory || [];
    const mv        = tl.macroVars?.[currentVar] || {};
    const varSeries = mv.series || [];
    const debug     = tl._debug || {};

    const toYM = d => String(d || '').slice(0, 7);

    // Período común SP500 + variable seleccionada
    const spDates  = new Set(spNorm.map(p => toYM(p.date)));
    const varDates = new Set(varSeries.map(p => toYM(p.date)));
    const commonDates = [...spDates].filter(d => varDates.has(d)).sort();

    if (commonDates.length === 0) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos</div>
        <div class="empty-desc" style="font-family:var(--mono);font-size:10px;">
          spNorm: ${spNorm.length} · ${mv.label||currentVar}: ${varSeries.length}<br>
          Score: ${debug.nScore||0} meses · ${debug.firstScore||'—'} → ${debug.lastScore||'—'}
        </div></div>`;
      return;
    }

    // Filtrar por ventana
    const lastDate  = new Date(commonDates[commonDates.length-1] + '-01');
    const winYears  = currentWindow === 'MAX' ? 100 : parseInt(currentWindow);
    const winStart  = new Date(lastDate); winStart.setFullYear(winStart.getFullYear() - winYears);
    const winStartYM = winStart.toISOString().slice(0,7);
    const winDates  = commonDates.filter(d => d >= winStartYM);

    if (winDates.length < 3) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos en ventana ${currentWindow}</div></div>`;
      return;
    }

    const minYM = winDates[0], maxYM = winDates[winDates.length-1];
    const minDate = new Date(minYM + '-01'), maxDate = new Date(maxYM + '-01');

    // SP500: variación % desde primer punto válido de la ventana
    const spF  = spNorm.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);
    const spBase = spF.length ? spF[0].value : 1;
    const spPct  = spF.map(p => ({ date: p.date, value: +((p.value / spBase - 1) * 100).toFixed(2) }));
    const varF = varSeries.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);
    const scF  = scoreHist.filter(p => toYM(p.date) >= minYM && toYM(p.date) <= maxYM);

    // Layout SVG — 3 paneles
    const W = 820, PX = 42, PY = 6, LABEL_H = 16;
    const P_H = 85, GAP = 10;
    const TOTAL_H = (P_H + LABEL_H) * 3 + GAP * 2 + PY * 2 + 16;

    const p1top = PY + LABEL_H;
    const p2top = PY + LABEL_H + P_H + GAP + LABEL_H;
    const p3top = PY + LABEL_H + (P_H + GAP + LABEL_H) * 2;

    function toX(dateStr) {
      const d = new Date(toYM(dateStr) + '-01');
      const span = maxDate - minDate;
      return span > 0 ? PX + (d - minDate) / span * (W - 2*PX) : PX;
    }

    // makeY genérico
    function makeY(vals, top) {
      const v = vals.filter(x => x != null && isFinite(x));
      if (!v.length) return { fn: () => top + P_H/2, min: 0, max: 0 };
      const mn = Math.min(...v), mx = Math.max(...v);
      const pad = (mx - mn) * 0.12 || 0.5;
      return { fn: val => top + PY + (1 - (val-(mn-pad))/((mx+pad)-(mn-pad))) * (P_H - 2*PY), min: mn-pad, max: mx+pad };
    }
    // makeY para SP500 % — fuerza 0 en rango, ticks en múltiplos de 50%
    function makeYpct(vals, top) {
      const v = vals.filter(x => x != null && isFinite(x));
      if (!v.length) return { fn: () => top + P_H/2, min: 0, max: 0, ticks: [] };
      const mn = Math.min(0, ...v);  // siempre incluir 0
      const mx = Math.max(0, ...v);
      const pad = (mx - mn) * 0.08 || 5;
      const rangeMin = mn - pad, rangeMax = mx + pad;
      const fn = val => top + PY + (1 - (val - rangeMin) / (rangeMax - rangeMin)) * (P_H - 2*PY);
      // Ticks en múltiplos de 50% que caigan en el rango
      const tickStep = mx > 200 ? 50 : mx > 100 ? 25 : 10;
      const tPct = [];
      for (let t = Math.ceil(rangeMin/tickStep)*tickStep; t <= rangeMax; t += tickStep) {
        tPct.push(t);
      }
      return { fn, min: rangeMin, max: rangeMax, ticks: tPct };
    }

    function pts(series, yFn) {
      return series.filter(p => p.value != null && isFinite(p.value))
        .map(p => `${toX(p.date).toFixed(1)},${yFn(p.value).toFixed(1)}`).join(' ');
    }

    const yP1 = makeYpct(spPct.map(p => p.value), p1top);
    const yP2 = makeY(varF.map(p => p.value), p2top);
    const yP3 = makeY(scF.map(p => p.value), p3top);

    // Ticks eje X
    const tickStep = winYears >= 15 ? 5 : 1;
    const ticks = [];
    let ty = Math.ceil(minDate.getFullYear() / tickStep) * tickStep;
    while (ty <= maxDate.getFullYear() + 1) {
      const x = toX(`${ty}-01-01`);
      if (x >= PX && x <= W-PX) ticks.push({ year: ty, x });
      ty += tickStep;
    }

    // Labels eje Y (3 valores por panel)
    function yAxisLabels(yObj, top) {
      return [0, 0.5, 1].map(f => {
        const v = yObj.min + (yObj.max - yObj.min) * f;
        const y = yObj.fn(v);
        return { y, label: Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2) };
      });
    }

    const lP1 = (yP1.ticks || []).map(t => ({ y: yP1.fn(t), label: (t>=0?"+":"")+t+"%" }));
    const lP2 = yAxisLabels(yP2, p2top);
    const lP3 = yAxisLabels(yP3, p3top);

    const SCORE_N = 9, TOTAL_N = 9, MAX_POSS = 15;  // 9 indicadores FRED, MaxScore=15
    const scoreFrom = debug.firstScore ? debug.firstScore.slice(0,7) : '—';
    const scoreLast = debug.lastScore  ? debug.lastScore.slice(0,7)  : '—';

    el.innerHTML = `
      <div class="mac-card" style="margin-bottom:14px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Timeline Histórico · Ventana: ${currentWindow}</span>
            <span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:10px;">Común SP500+${mv.label||currentVar}: ${minYM} → ${maxYM} · ${winDates.length}m</span>
          </div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--amber);">
            Score parcial ${SCORE_N}/${TOTAL_N} · ${debug.nScore||scF.length}m · ${debug.firstScore?.slice(0,7)||'—'} → ${debug.lastScore?.slice(0,7)||'—'} · PROVISIONAL
          </div>
        </div>

        <!-- SVG 3 paneles -->
        <svg viewBox="0 0 ${W} ${TOTAL_H}" style="width:100%;background:var(--surface2);border-radius:8px;" preserveAspectRatio="xMidYMid meet">

          <!-- Labels de panel -->
          <text x="${PX}" y="${PY+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--green)">S&amp;P 500 (var. % desde inicio ventana)</text>
          <text x="${PX}" y="${p1top+P_H+GAP+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--blue)">${mv.label||currentVar} · ${mv.unit||'%'} · ${mv.source||'FRED'} · ${mv.transform||'media mensual'}</text>
          <text x="${PX}" y="${p2top+P_H+GAP+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">Macro Score Histórico · HIST_MACRO_V1_FRED · ScoreNorm [-1,+1] · PROVISIONAL</text>

          <!-- Separadores -->
          <line x1="${PX}" y1="${p2top}" x2="${W-PX}" y2="${p2top}" stroke="var(--border)" stroke-width="0.5"/>
          <line x1="${PX}" y1="${p3top}" x2="${W-PX}" y2="${p3top}" stroke="var(--border)" stroke-width="0.5"/>

          <!-- Línea 0% P1, P2 y P3 -->
          <line x1="${PX}" y1="${yP1.fn(0).toFixed(1)}" x2="${W-PX}" y2="${yP1.fn(0).toFixed(1)}" stroke="var(--green)" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
          ${yP2.fn(0) > p2top && yP2.fn(0) < p2top+P_H ? `<line x1="${PX}" y1="${yP2.fn(0).toFixed(1)}" x2="${W-PX}" y2="${yP2.fn(0).toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>` : ''}
          <line x1="${PX}" y1="${yP3.fn(0).toFixed(1)}" x2="${W-PX}" y2="${yP3.fn(0).toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>

          <!-- Ticks X -->
          ${ticks.map(t => `
            <line x1="${t.x.toFixed(1)}" y1="${p1top}" x2="${t.x.toFixed(1)}" y2="${(p3top+P_H).toFixed(1)}" stroke="var(--border)" stroke-width="0.4" stroke-dasharray="3"/>
            <text x="${t.x.toFixed(1)}" y="${(p3top+P_H+13).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">${t.year}</text>
          `).join('')}

          <!-- Eje Y labels -->
          ${lP1.map(l => `<text x="${(PX-3).toFixed(1)}" y="${(l.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${l.label}</text>`).join('')}
          ${lP2.map(l => `<text x="${(PX-3).toFixed(1)}" y="${(l.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${l.label}</text>`).join('')}
          ${lP3.map(l => `<text x="${(PX-3).toFixed(1)}" y="${(l.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${l.label}</text>`).join('')}

          <!-- Series -->
          ${pts(spPct, yP1.fn) ? `<polyline points="${pts(spPct, yP1.fn)}"  fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linejoin="round" opacity="0.9"/>` : ''}
          ${pts(varF, yP2.fn) ? `<polyline points="${pts(varF, yP2.fn)}" fill="none" stroke="var(--blue)"  stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/>` : ''}
          ${pts(scF, yP3.fn)  ? `<polyline points="${pts(scF, yP3.fn)}"  fill="none" stroke="var(--teal)"  stroke-width="2"   stroke-linejoin="round"/>` : ''}

          <!-- Punto actual score — muestra ScoreNorm, no raw -->
          ${scF.length ? (() => {
            const last = scF[scF.length-1];
            const cx = toX(last.date).toFixed(1);
            const cy = yP3.fn(last.value).toFixed(1);
            const snLabel = last.value != null ? (last.value >= 0 ? '+' : '') + last.value.toFixed(2) : '—';
            const snCol = last.value > 0.2 ? 'var(--green)' : last.value < -0.2 ? 'var(--red)' : 'var(--amber)';
            return `<circle cx="${cx}" cy="${cy}" r="4" fill="${snCol}"/>
                    <text x="${(+cx+6).toFixed(1)}" y="${(+cy+4).toFixed(1)}" font-family="IBM Plex Mono" font-size="9" fill="${snCol}">${snLabel}</text>`;
          })() : ''}
          <!-- Overlay tooltip -->
          <rect id="tl-overlay" x="${PX}" y="${p1top}" width="${W-2*PX}" height="${p3top+P_H-p1top}" fill="transparent" style="cursor:crosshair;"/>
          <line id="tl-cursor" x1="${PX}" y1="${p1top}" x2="${PX}" y2="${p3top+P_H}" stroke="var(--text3)" stroke-width="0.8" stroke-dasharray="3" opacity="0" pointer-events="none"/>
          <g id="tl-tooltip" opacity="0" pointer-events="none">
            <rect id="tl-tt-bg" x="0" y="0" width="220" height="72" rx="5" fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
            <text id="tl-tt-date" x="8" y="15" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">—</text>
            <text id="tl-tt-sp"   x="8" y="28" font-family="IBM Plex Mono" font-size="9" fill="var(--green)">S&amp;P 500: —</text>
            <text id="tl-tt-var"  x="8" y="41" font-family="IBM Plex Mono" font-size="9" fill="var(--blue)">—: —</text>
            <text id="tl-tt-sc"   x="8" y="54" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">Score: —</text>
            <text id="tl-tt-note" x="8" y="67" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">PROVISIONAL</text>
          </g>
        </svg>

        <!-- Debug/auditoría -->
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;line-height:1.7;">
          Serie: ${mv.source||'—'} · Frecuencia origen: ${currentVar.includes('YOY')?'mensual':'diaria'} ·
          Transformación: ${mv.transform||'media mensual'} · Período: ${minYM} → ${maxYM} · N meses válidos: ${varF.length}<br>
          ${debug.version||'HIST_MACRO_V1_FRED'} · 9 indicadores (Curva USD, Tipo Real, LEI, M2USA, Crédito/PIB, Impulso, VelM2, Reservas, BBB) · ${debug.nValid||'—'} meses válidos (cov≥60%) de ${debug.nTotal||'—'} totales · ${debug.firstScore||'—'} → ${debug.lastScore||'—'}
          ${hist.errors?.length ? ' · ⚠ ' + hist.errors.slice(0,2).join(', ') : ''}
        </div>
      </div>

      <!-- AUDITORÍA HIST_MACRO_V1_FRED -->
      <div class="mac-card" style="margin-bottom:14px;font-family:var(--mono);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">
          🔍 Auditoría HIST_MACRO_V1_FRED — 4 meses de referencia
          <span style="color:var(--text3);font-weight:400;margin-left:8px;">
            ${debug.nValid||'—'} meses válidos (cov≥60%) de ${debug.nTotal||'—'} totales · MaxPossible=${debug.maxPossible||15} · ${debug.version||'—'}
          </span>
        </div>
        ${(debug.auditMonths||[]).map(m => {
          if (!m.valid) return `<div style="font-size:10px;color:var(--text3);margin-bottom:12px;">${m.month}: N/A — ${m.error||'cobertura insuficiente'}</div>`;
          const comps = m.components || {};
          const IND_ORDER = ['curvaUSD','tipoReal','lei','m2usa','creditoVsPib','impulso','velM2','reservas','bbb'];
          const snCol = m.scoreNorm > 0.2 ? 'var(--green)' : m.scoreNorm < -0.2 ? 'var(--red)' : 'var(--amber)';
          return `
            <div style="margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">
              <div style="font-size:10px;color:var(--teal);margin-bottom:6px;font-weight:700;">
                ${m.month} · ScoreNorm <span style="color:${snCol}">${m.scoreNorm>=0?'+':''}${m.scoreNorm?.toFixed(3)}</span>
                · Raw ${m.scoreRaw>=0?'+':''}${m.scoreRaw} / ${m.maxAvailable}
                · Coverage ${Math.round(m.coverage*100)}%
                · Válidos ${Object.values(comps).filter(c=>c.valid&&c.maxScore>0).length}/8
                ${m.violations?.length ? `<span style="color:var(--red)">⚠ ${m.violations.length} VIOLACIÓN(ES): ${m.violations.join(' | ')}</span>` : ''}
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:9px;">
                <thead><tr>
                  <th style="text-align:left;padding:3px 6px;color:var(--text3);">Indicador</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Valor</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Score</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Max</th>
                  <th style="text-align:left;padding:3px 6px;color:var(--text3);">Fuente</th>
                  <th style="text-align:center;padding:3px 6px;color:var(--text3);">OK</th>
                </tr></thead>
                <tbody>
                  ${IND_ORDER.map(k => {
                    const c = comps[k];
                    if (!c) return '';
                    const sc = c.score != null ? (c.score>=0?'+':'')+c.score : '—';
                    const vl = c.value != null ? (typeof c.value === 'number' ? c.value.toFixed(2) : c.value) : '—';
                    const col = c.valid ? (c.score > 0 ? 'var(--green)' : c.score < 0 ? 'var(--red)' : 'var(--amber)') : 'var(--text3)';
                    return `<tr style="border-bottom:1px solid var(--border);">
                      <td style="padding:3px 6px;color:var(--text2);">${k}</td>
                      <td style="padding:3px 6px;text-align:right;color:var(--text1);">${vl}</td>
                      <td style="padding:3px 6px;text-align:right;color:${col};font-weight:700;">${sc}</td>
                      <td style="padding:3px 6px;text-align:right;color:var(--text3);">±${c.maxScore||1}</td>
                      <td style="padding:3px 6px;color:var(--text3);font-size:8px;">${c.source||'—'}${c.note?' · '+c.note:''}</td>
                      <td style="padding:3px 6px;text-align:center;">${c.valid?'✓':'✗'}</td>
                    </tr>`;
                  }).join('')}
                  <tr style="background:var(--surface2);">
                    <td style="padding:4px 6px;font-weight:700;color:var(--text1);">TOTAL</td>
                    <td colspan="2" style="padding:4px 6px;text-align:right;font-weight:700;color:${snCol};">Raw ${m.scoreRaw>=0?'+':''}${m.scoreRaw} / ${m.maxAvailable} = Norm ${m.scoreNorm>=0?'+':''}${m.scoreNorm?.toFixed(3)}</td>
                    <td style="padding:4px 6px;text-align:right;color:var(--text3);">15</td>
                    <td colspan="2" style="padding:4px 6px;color:var(--text3);">Coverage ${Math.round(m.coverage*100)}% ${m.coverage>=0.6?'✓ válido':'✗ N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
        }).join('')}
      </div>

      <!-- ANALOGÍAS FASE 2 -->
      <div class="mac-card" style="background:rgba(251,191,36,0.04);border-color:rgba(251,191,36,0.2);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:10px;">
          Analogías Históricas <span style="color:var(--amber);margin-left:8px;">⏳ Fase 2 — Motor de Similitud Pendiente</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Motor de Similitud</div>
            Vector macro mensual normalizado → distancia coseno → top N análogos con cobertura mínima
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Retornos Forward</div>
            S&amp;P 500 +3m / +6m / +12m calculados automáticamente desde histórico FRED SP500
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:6px;">Macro Score Canónico</div>
            Reconstrucción desde 2000 con alta cobertura y metodología homogénea al motor actual
          </div>
        </div>
      </div>

      <div class="co-footer" style="margin-top:14px;">
        Fuentes: FRED SP500 (mensual) · FRED DGS10/DFF/CPIAUCSL/CPILFESL ·
        HIST_MACRO_V1_FRED · ${debug.version||"HIST_MACRO_V1_FRED"} · ${debug.nScore||scF.length} meses válidos (coverage≥60%) · ${debug.firstScore?.slice(0,7)||"—"} → ${debug.lastScore?.slice(0,7)||"—"} · PROVISIONAL
      </div>
    `;

    // Tooltip interactivo
    const svgEl     = el.querySelector('svg');
    const overlay   = el.querySelector('#tl-overlay');
    const cursor    = el.querySelector('#tl-cursor');
    const tooltip   = el.querySelector('#tl-tooltip');
    const ttBg      = el.querySelector('#tl-tt-bg');
    const ttDate    = el.querySelector('#tl-tt-date');
    const ttSp      = el.querySelector('#tl-tt-sp');
    const ttVar     = el.querySelector('#tl-tt-var');
    const ttSc      = el.querySelector('#tl-tt-sc');

    // Índices por mes
    const spMap  = new Map(spPct.map(p => [toYM(p.date), p.value]));
    const varMap = new Map(varF.map(p => [toYM(p.date), p.value]));
    const scMap  = new Map(scF.map(p => [toYM(p.date), p])); // objeto completo para tooltip

    if (overlay && svgEl) {
      overlay.addEventListener('mousemove', e => {
        const rect  = svgEl.getBoundingClientRect();
        const svgW  = W, svgH = TOTAL_H;
        const scaleX = svgW / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;

        // Mes más cercano
        const frac   = (mouseX - PX) / (W - 2*PX);
        const ts     = minDate.getTime() + frac * (maxDate.getTime() - minDate.getTime());
        const hoverD = new Date(ts);
        const hYM    = `${hoverD.getFullYear()}-${String(hoverD.getMonth()+1).padStart(2,'0')}`;

        const spV  = spMap.get(hYM);
        const varV = varMap.get(hYM);
        const scV  = scMap.get(hYM);

        cursor.setAttribute('x1', mouseX); cursor.setAttribute('x2', mouseX);
        cursor.setAttribute('opacity', '1');

        ttDate.textContent = hYM;
        ttSp.textContent   = spV  != null ? `S&P 500: ${spV >= 0 ? '+' : ''}${spV.toFixed(1)}%` : 'S&P 500: —';
        ttVar.textContent  = varV != null ? `${mv.label||currentVar}: ${varV.toFixed(2)}${mv.unit||'%'}` : `${mv.label||currentVar}: —`;
        if (scV != null) {
          const snLabel  = (scV.value != null ? (scV.value>=0?'+':'')+scV.value.toFixed(2) : '—');
          const rawLabel = (scV.scoreRaw != null ? (scV.scoreRaw>=0?'+':'')+scV.scoreRaw : '—');
          const covLabel = scV.coverage != null ? Math.round(scV.coverage*100)+'%' : '—';
          ttSc.textContent = `ScoreNorm ${snLabel} · Raw ${rawLabel} · Cov ${covLabel}`;
        } else {
          ttSc.textContent = 'Score: — (N/A o sin datos)';
        }

        // Posición tooltip — derecha o izquierda según posición
        const ttX = mouseX + 10 < W - 230 ? mouseX + 10 : mouseX - 230;
        const ttY = p1top + 5;
        tooltip.setAttribute('transform', `translate(${ttX},${ttY})`);
        tooltip.setAttribute('opacity', '1');
      });
      overlay.addEventListener('mouseleave', () => {
        cursor.setAttribute('opacity', '0');
        tooltip.setAttribute('opacity', '0');
      });
    }
  }

  // Event listeners
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tl-win');
    if (!btn) return;
    currentWindow = btn.dataset.w;
    document.querySelectorAll('.tl-win').forEach(b => b.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
    if (histData) paint({scoreTotal: 0}, histData); // repintar sin recargar
    load(false);
  });

  document.addEventListener('change', e => {
    if (e.target.id !== 'tl-var') return;
    currentVar = e.target.value;
    if (histData) load(false);
  });

  document.getElementById('tl-refresh')?.addEventListener('click', () => load(true));
  await load(false);
  return { destroy() {} };
}
