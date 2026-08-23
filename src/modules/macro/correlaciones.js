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

      <div class="mac-card" style="background:rgba(251,191,36,0.04);border-color:rgba(251,191,36,0.2);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">
          Pendiente · Fase 2C
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
