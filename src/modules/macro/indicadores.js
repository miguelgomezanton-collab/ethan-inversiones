// ═══════════════════════════════════════════════
// MÓDULO: Indicadores de Seguimiento (1.2)
// Tabla completa de los 8 indicadores monetarios ponderados.
// ═══════════════════════════════════════════════

import { getMacroData } from './macro-data.js';

const MONETARIOS_KEYS = [
  'm2Global', 'creditoVsNominal', 'impulsoCrediticio', 'velocidadM2',
  'reservasBancarias', 'tipoReal', 'bbbSpread', 'putCall'
];

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `
    <button class="btn" id="btn-edit-manual">✎ Editar manuales</button>
    <button class="btn btn-primary" id="btn-refresh">↻ Actualizar</button>
  `;

  container.innerHTML = `<div id="indicadores-content"><div class="empty"><div class="loader-ring"></div></div></div>`;
  const el = document.getElementById('indicadores-content');

  let manualOverrides = {};
  try {
    manualOverrides = JSON.parse(sessionStorage.getItem('ethan_macro_manual') || '{}');
  } catch (e) {}

  async function load(forceRefresh = false) {
    el.innerHTML = `<div class="empty"><div class="loader-ring"></div></div>`;
    try {
      const macro = await getMacroDataWithOverrides(forceRefresh);
      paint(macro);
    } catch (err) {
      el.innerHTML = `
        <div class="empty">
          <div class="empty-icon">⚠</div>
          <div class="empty-title">Error al cargar indicadores</div>
          <div class="empty-desc">${err.message}</div>
        </div>
      `;
    }
  }

  async function getMacroDataWithOverrides(forceRefresh) {
    const params = new URLSearchParams();
    if (manualOverrides.creditoVsNominal !== undefined) params.set('creditoVsNominal', manualOverrides.creditoVsNominal);
    if (manualOverrides.impulsoCrediticio !== undefined) params.set('impulsoCrediticio', manualOverrides.impulsoCrediticio);
    if (manualOverrides.curvaEUR !== undefined) params.set('curvaEUR', manualOverrides.curvaEUR);
    if (manualOverrides.putCall !== undefined) params.set('putCall', manualOverrides.putCall);

    if (params.toString()) {
      const res = await fetch('/api/macro?' + params.toString());
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      return res.json();
    }
    return getMacroData(forceRefresh);
  }

  function paint(macro) {
    const scoreColor = macro.scoreMonetarios >= 4 ? 'var(--green)' : macro.scoreMonetarios >= 0 ? 'var(--amber)' : 'var(--red)';

    const rows = MONETARIOS_KEYS
      .map(k => macro.indicators[k])
      .filter(Boolean)
      .map(ind => {
        const pondScore = ind.score !== null ? ind.score * ind.weight : null;
        const signColor = ind.score > 0 ? 'good' : ind.score < 0 ? 'bad' : 'warn';
        const valueStr = ind.value !== null && ind.value !== undefined
          ? `${ind.value > 0 && ind.unit !== '' ? '+' : ''}${ind.value}${ind.unit}`
          : '— (sin dato)';
        return `
          <tr>
            <td style="text-align:left">
              ${ind.label}${ind.manual ? ' <span class="tag warn" style="margin-left:6px;">manual</span>' : ''}
              ${ind.detail ? `<div style="font-size:9px;color:var(--text3);margin-top:2px;">${ind.detail}</div>` : ''}
            </td>
            <td>${valueStr}</td>
            <td>×${ind.weight}</td>
            <td><span class="tag ${ind.score === null ? '' : signColor}">${ind.score === null ? 'N/D' : (ind.score > 0 ? '+' + ind.score : ind.score)}</span></td>
            <td style="font-weight:600;">${pondScore === null ? '—' : (pondScore > 0 ? '+' + pondScore : pondScore)}</td>
          </tr>
        `;
      }).join('');

    el.innerHTML = `
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">Score Monetarios</div>
          <div class="kpi-value" style="color:${scoreColor}">${macro.scoreMonetarios >= 0 ? '+' : ''}${macro.scoreMonetarios}/${macro.maxMonetarios}</div>
          <div class="kpi-sub">8 indicadores ponderados</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Velocidad M2</div>
          <div class="kpi-value ${macro.indicators.velocidadM2?.score >= 0 ? 'up' : 'down'}">${macro.indicators.velocidadM2?.value ?? '—'}%</div>
          <div class="kpi-sub">FRED M2V</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Put/Call Ratio</div>
          <div class="kpi-value ${macro.indicators.putCall?.score === null || macro.indicators.putCall?.score === undefined ? '' : (macro.indicators.putCall.score >= 0 ? 'up' : 'down')}">${macro.indicators.putCall?.value ?? 'Sin dato'}</div>
          <div class="kpi-sub">Manual — CBOE</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">BBB Spreads</div>
          <div class="kpi-value ${macro.indicators.bbbSpread?.score >= 0 ? 'up' : 'down'}">${macro.indicators.bbbSpread?.value ?? '—'}%</div>
          <div class="kpi-sub">FRED BAMLC0A4CBBB</div>
        </div>
      </div>

      <div class="section-title">Indicadores Monetarios Ponderados</div>
      <table class="data-table">
        <thead><tr><th>Indicador</th><th>Valor</th><th>Peso</th><th>Score</th><th>Ponderado</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      ${macro.errors ? `
        <div class="section-title" style="margin-top:24px;color:var(--amber);">⚠ Avisos</div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8;">
          ${macro.errors.map(e => `<div>${e}</div>`).join('')}
        </div>
      ` : ''}
    `;
  }

  document.getElementById('btn-refresh').addEventListener('click', () => load(true));
  document.getElementById('btn-edit-manual').addEventListener('click', () => {
    const creditoVsNominal = prompt('Crédito vs Nominal GDP (%):', manualOverrides.creditoVsNominal ?? '');
    const impulsoCrediticio = prompt('Impulso Crediticio (valor numérico, positivo o negativo):', manualOverrides.impulsoCrediticio ?? '');
    const curvaEUR = prompt('Curva EUR 10Y-2Y (%) — déjalo vacío para usar el dato automático del ECB, o escribe un valor para forzarlo:', manualOverrides.curvaEUR ?? '');
    const putCall = prompt('Put/Call Ratio (CBOE — consulta cboe.com/delayed_quotes o tu bróker):', manualOverrides.putCall ?? '');

    manualOverrides = {};
    if (creditoVsNominal !== null && creditoVsNominal !== '') manualOverrides.creditoVsNominal = parseFloat(creditoVsNominal);
    if (impulsoCrediticio !== null && impulsoCrediticio !== '') manualOverrides.impulsoCrediticio = parseFloat(impulsoCrediticio);
    if (curvaEUR !== null && curvaEUR !== '') manualOverrides.curvaEUR = parseFloat(curvaEUR);
    if (putCall !== null && putCall !== '') manualOverrides.putCall = parseFloat(putCall);

    sessionStorage.setItem('ethan_macro_manual', JSON.stringify(manualOverrides));
    load(true);
  });

  await load(false);

  return {
    destroy() {}
  };
}
