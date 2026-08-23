// correlaciones.js — Lead-lag correlations: Indicador(t) → SP500 Forward Return(t+H)
// Dataset: HIST_MACRO_V1_FRED (mismo que Timeline y Analogías)
import { getMacroData } from './macro-data.js';

const IND_LABELS = {
  curvaUSD:      'Curva USD 10Y-2Y',
  tipoReal:      'Tipo Real (FFR-CPI)',
  lei:           'LEI (OECD CLI USA)',
  m2usa:         'M2 USA YoY',
  creditoVsPib:  'Crédito vs PIB',
  impulso:       'Impulso Crediticio',
  velM2:         'Velocidad M2',
  reservas:      'Reservas Bancarias',
  bbb:           'BBB Spread',
  scoreNorm:     'HIST_MACRO_V1 ScoreNorm',
};

const HORIZONS = [0, 3, 6, 12];
const H_LABELS = { 0: 'Coincidente', 3: '+3M', 6: '+6M', 12: '+12M' };

function rhoColor(r) {
  if (r == null) return 'var(--text3)';
  const a = Math.abs(r);
  if (a >= 0.4) return r > 0 ? 'var(--green)' : 'var(--red)';
  if (a >= 0.2) return r > 0 ? '#7abb7a' : '#d4888a';
  return 'var(--text3)';
}

export async function render(container, { actionsSlot }) {
  let currentH = 6;

  actionsSlot.innerHTML = `
    <div style="display:flex;gap:4px;align-items:center;">
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Horizonte:</span>
      ${HORIZONS.map(h => `<button class="btn corr-h ${h===6?'btn-primary':''}" data-h="${h}" style="padding:4px 9px;font-size:10px;">${H_LABELS[h]}</button>`).join('')}
      <button class="btn btn-primary" id="corr-refresh" style="padding:4px 9px;font-size:10px;margin-left:6px;">↻</button>
    </div>`;

  container.innerHTML = `<div id="corr-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;

  async function load(force = false) {
    try {
      const hist = await fetch('/api/macro-history?type=correlaciones')
        .then(r => { if (!r.ok) throw new Error('macro-history: ' + r.status); return r.json(); });
      paint(hist);
    } catch(e) {
      document.getElementById('corr-wrap').innerHTML =
        `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  function paint(hist) {
    const el = document.getElementById('corr-wrap');
    const cm = hist.corrMatrix;

    if (!cm) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos de correlación</div></div>`;
      return;
    }

    const matrix = cm[currentH] || {};

    // Tabla lead-lag
    const rows = Object.entries(IND_LABELS).map(([k, label]) => {
      const cell = matrix[k];
      const rho  = cell?.rho;
      const n    = cell?.n;
      const isScore = k === 'scoreNorm';
      return `<tr style="border-bottom:1px solid var(--border);${isScore?'background:rgba(64,217,192,0.04);':''}">
        <td style="padding:8px 10px;font-size:10px;color:${isScore?'var(--teal)':'var(--text2)'};font-weight:${isScore?'700':'400'};">${label}</td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:12px;font-weight:700;color:${rhoColor(rho)};">
          ${rho != null ? (rho>=0?'+':'')+rho.toFixed(2) : '—'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:10px;color:var(--text3);">
          ${n != null ? n : '—'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:10px;color:${cell?.p!=null?(cell.p<0.05?'var(--green)':'var(--amber)'):'var(--text3)'};">
          ${cell?.p != null ? (cell.p < 0.001 ? '<0.001' : cell.p.toFixed(3)) : '—'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:9px;color:var(--text3);">
          ${cell?.ci95 ? '['+cell.ci95[0]+', '+cell.ci95[1]+']' : '—'}
        </td>
        <td style="padding:8px 10px;">
          ${rho != null ? `<div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.min(Math.abs(rho)*100,100)}%;background:${rhoColor(rho)};border-radius:3px;margin-left:${rho<0?'auto':'0'};"></div>
          </div>` : ''}
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <div>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">
              Correlaciones Lead-Lag · S&P 500
            </span>
            <span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:8px;">
              Indicador(t) → SP500 Forward Return ${H_LABELS[currentH]}
            </span>
          </div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">
            HIST_MACRO_V1_FRED · Pearson · N≥20 obs
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Indicador macro</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">ρ Pearson</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">N obs</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">p-value</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">IC 95%</th>
            <th style="padding:8px 10px;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">Intensidad</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <div style="margin-top:12px;font-size:9px;font-family:var(--mono);color:var(--text3);line-height:1.7;background:var(--surface2);padding:10px 12px;border-radius:6px;">
          ⚠ Correlaciones calculadas únicamente sobre SP500 (dataset FRED disponible).
          Nasdaq, Russell, Oro, Bonos e IEF pendientes de histórico suficiente.<br>
          Pearson mide relación lineal. No implica causalidad. Horizonte ${H_LABELS[currentH]}: el indicador precede al retorno en ${currentH} meses.<br>
          ScoreNorm = scoreRaw / maxAvailable · misma metodología que Motor de Analogías.
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;font-family:var(--mono);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          🔍 Audit Trail — Verificación Lead-Lag (sin look-ahead)
        </div>
        ${(hist.corrAudit||[]).map(a => {
          if (a.error) return `<div style="font-size:9px;color:var(--text3);margin-bottom:6px;">${a.month}: ${a.error}</div>`;
          return `<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);">
            <div style="font-size:10px;color:var(--teal);font-weight:700;margin-bottom:4px;">
              ${a.month} · ScoreNorm ${a.scoreNorm>=0?'+':''}${a.scoreNorm?.toFixed(3)} · SP0: ${a.sp0!=null?a.sp0:'—'}
            </div>
            ${a.rows.map(r => r.error ? '' : `
              <div style="font-size:9px;color:var(--text3);line-height:2;margin-left:8px;">
                ${r.label}: valor=${r.value?.toFixed?.(3)??r.value} | score=${r.score>=0?'+':''}${r.score}
                → SP0:${a.sp0??'—'} | SP+3m:${r.sp3m!=null?(r.sp3m>=0?'+':'')+r.sp3m+'%':'—'}
                | SP+6m:${r.sp6m!=null?(r.sp6m>=0?'+':'')+r.sp6m+'% ('+r.sp6mDate+' nivel:'+r.sp6mRaw+')':'—'}
                | SP+12m:${r.sp12m!=null?(r.sp12m>=0?'+':'')+r.sp12m+'%':'—'}
              </div>`).join('')}
          </div>`;
        }).join('')}
        <div style="font-size:9px;color:var(--text3);margin-top:4px;">
          SP0 = nivel S&P 500 en el mes del indicador · SP+6m = nivel 6 meses después · forward return = SP+6m/SP0 − 1
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Distribución S&P 500 por Régimen Macro (ScoreNorm)
          <span style="color:var(--text3);font-weight:400;margin-left:8px;">¿Qué distribución de retornos ha tenido históricamente el S&P condicionado al régimen?</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:7px 10px;text-align:left;font-size:9px;color:var(--text3);">Régimen</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">N meses</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +3M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +6M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +12M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">% Pos +12M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med MaxDD</th>
          </tr></thead>
          <tbody>
            ${(hist.regimeAnalysis||[]).map(b => {
              const h3  = b.byHorizon?.[3];
              const h6  = b.byHorizon?.[6];
              const h12 = b.byHorizon?.[12];
              const f   = (v,suffix='%') => v!=null?(v>=0?'+':'')+v.toFixed(1)+suffix:'—';
              const c   = v => v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
              return `<tr style="border-bottom:1px solid var(--border);">
                <td style="padding:7px 10px;color:var(--text2);">${b.label} <span style="color:var(--text3);font-size:9px;">(${b.min.toFixed(2)} → ${b.max.toFixed(2)})</span></td>
                <td style="padding:7px 10px;text-align:center;color:var(--text3);">${b.nMonths}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${c(h3?.median)};">${f(h3?.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${c(h6?.median)};">${f(h6?.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${c(h12?.median)};">${f(h12?.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${(h12?.pctPos??0)>50?'var(--green)':'var(--red)'};">${h12?.pctPos!=null?h12.pctPos+'%':'—'}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:var(--red);">${f(h12?.medianDD)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ Basado en SP500 disponible (${hist.corrMatrix ? 'HIST_MACRO_V1_FRED' : '—'}). N bajo = baja fiabilidad estadística. No implica predicción.
        </div>
      </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Activos adicionales</div>
            Nasdaq, Russell, Oro, Bonos (IEF) cuando tengamos histórico FRED suficiente
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Significancia estadística</div>
            p-value y bandas de confianza 95% por celda
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Validación temporal</div>
            Correlaciones por décadas — ¿son estables o cambian de régimen?
          </div>
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Quintiles ScoreNorm → S&amp;P 500 Forward Return
          <span style="font-weight:400;margin-left:6px;">N equilibrado · ¿existe monotonicidad?</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Q</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Rango Score</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">N</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +3M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +6M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +12M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">% Pos +12M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">MaxDD</th>
          </tr></thead>
          <tbody>${(hist.quintiles||[]).map(q => {
            const f = (v,s='%')=>v!=null?(v>=0?'+':'')+v.toFixed(1)+s:'—';
            const c = v=>v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
            const h3=q.byHorizon?.[3],h6=q.byHorizon?.[6],h12=q.byHorizon?.[12];
            return '<tr style="border-bottom:1px solid var(--border);">' +
              '<td style="padding:6px 8px;color:var(--teal);font-weight:700;font-family:var(--mono);">Q'+q.quintile+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);font-size:9px;color:var(--text3);">['+q.minScore+', '+q.maxScore+']</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:var(--text3);">'+(h6?.n||q.nMonths)+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+c(h3?.median)+';">'+f(h3?.median)+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+c(h6?.median)+';">'+f(h6?.median)+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+c(h12?.median)+';">'+f(h12?.median)+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+((h12?.pctPos??0)>50?'var(--green)':'var(--red)')+';">'+(h12?.pctPos!=null?h12.pctPos+'%':'—')+'</td>' +
              '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:var(--red);">'+f(h12?.medianDD)+'</td>' +
            '</tr>';
          }).join('')}</tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;">
          Monotonicidad Q1→Q5: si +12M decrece consistentemente, Score tiene relación inversa con retorno futuro. Sin patrón → Score describe régimen, no anticipa retorno absoluto.
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Estabilidad Temporal · ρ +6M por ventana de 10 años · * = p&lt;0.05
        </div>
        ${['tipoReal','lei','bbb','scoreNorm'].map(k => {
          const IND = {tipoReal:'Tipo Real',lei:'LEI',bbb:'BBB Spread',scoreNorm:'ScoreNorm'};
          const windows = hist.stabilityByIndicator?.[k]||[];
          if (!windows.length) return '<div style="font-size:9px;color:var(--text3);margin-bottom:8px;">'+IND[k]+': N insuficiente</div>';
          return '<div style="margin-bottom:10px;">' +
            '<div style="font-size:9px;color:var(--text2);font-weight:700;font-family:var(--mono);margin-bottom:4px;">'+IND[k]+'</div>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
            windows.map(w => {
              const col = w.rho==null?'var(--text3)':w.rho>0?'var(--green)':'var(--red)';
              const sig = w.p!=null&&w.p<0.05?'*':'';
              return '<div style="background:var(--surface2);border-radius:6px;padding:6px 10px;text-align:center;min-width:86px;">' +
                '<div style="font-size:8px;color:var(--text3);font-family:var(--mono);">'+w.window+'</div>' +
                '<div style="font-family:var(--mono);font-size:13px;font-weight:700;color:'+col+';margin:2px 0;">'+(w.rho!=null?(w.rho>=0?'+':'')+w.rho.toFixed(2)+sig:'—')+'</div>' +
                '<div style="font-size:8px;color:var(--text3);">N='+w.n+'</div>' +
              '</div>';
            }).join('') + '</div></div>';
        }).join('')}
      </div>

      <div class="co-footer">
        Fuente: HIST_MACRO_V1_FRED · SP500 FRED mensual ·
        Correlaciones calculadas sobre meses con coverage≥60% · PROVISIONAL
      </div>
    `;
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.corr-h');
    if (!btn) return;
    currentH = parseInt(btn.dataset.h);
    document.querySelectorAll('.corr-h').forEach(b => b.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
    load();
  });
  document.getElementById('corr-refresh')?.addEventListener('click', () => load(true));
  await load();
  return { destroy() {} };
}
