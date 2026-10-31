// src/modules/macro/macro-rlab.js — Macro R-LAB frontend MVP
// ──────────────────────────────────────────────────────────────────────────────
// Vista principal del laboratorio de investigación macro.
// Rutas: /macro/rlab → portfolio | /macro/rlab/new → nueva investigación
//        /macro/rlab/:id → detalle/resultados | /macro/rlab/:id/close → cierre
// ──────────────────────────────────────────────────────────────────────────────

const API = '/api/macro-rlab';

// ─── Paleta y helpers ─────────────────────────────────────────────────────────
const VERDICT_COLOR = {
  VALIDADA:                { bg: '#052e16', border: '#16a34a', text: '#4ade80' },
  INDICATIVA:              { bg: '#0c1a2e', border: '#2563eb', text: '#60a5fa' },
  EN_INVESTIGACION:        { bg: '#1c1917', border: '#78716c', text: '#a8a29e' },
  BORRADOR:                { bg: '#1c1917', border: '#44403c', text: '#78716c' },
  NO_VALIDADA:             { bg: '#2d0a0a', border: '#dc2626', text: '#f87171' },
  INCONCLUSA:              { bg: '#1c1208', border: '#d97706', text: '#fbbf24' },
  'CERRADA—RESEARCH ONLY': { bg: '#14042b', border: '#7c3aed', text: '#a78bfa' },
  CERRADA:                 { bg: '#14042b', border: '#7c3aed', text: '#a78bfa' },
};
const INDICATORS = {
  VIX:     'VIX — Volatilidad Implícita S&P',
  HY_OAS:  'HY OAS — Spread High Yield',
  SP500:   'S&P 500',
  CURVE_10_2: 'Curva 10Y–2Y',
  DXY:     'DXY — Índice USD',
  REAL_10Y:'Tipo Real 10Y',
  FFR:     'Federal Funds Rate',
  BBB:     'BBB OAS — Spread BBB',
  CPI:     'CPI — Inflación USA',
};
const PERIOD_OPTIONS = [
  { value: 'MAX',    label: 'Máx disponible' },
  { value: '20Y',    label: 'Últimos 20 años' },
  { value: '10Y',    label: 'Últimos 10 años' },
  { value: '5Y',     label: 'Últimos 5 años' },
  { value: 'CUSTOM', label: 'Personalizado' },
];
const HORIZON_OPTIONS = [1, 3, 6, 12];

function vc(state) { return VERDICT_COLOR[state] || VERDICT_COLOR['EN_INVESTIGACION']; }
function badge(state) {
  const c = vc(state);
  return `<span style="background:${c.bg};border:1px solid ${c.border};color:${c.text};
    padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.5px">${state}</span>`;
}
function fmt(n, dec = 3) { return n == null ? '—' : Number(n).toFixed(dec); }
function pctFmt(n) { return n == null ? '—' : `${(n * 100).toFixed(1)}%`; }
function stars(p) {
  if (p == null) return '';
  if (p < 0.01) return '***';
  if (p < 0.05) return '**';
  if (p < 0.10) return '*';
  return '';
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const r = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}

// ─── Fetch metadata de indicador (coverage + estimado de obs) ────────────────
let _covCache = {};
async function fetchCoverage(indicator, periodType) {
  const key = `${indicator}::${periodType}`;
  if (_covCache[key]) return _covCache[key];
  try {
    const d = await apiFetch(`/data?indicator=${indicator}&from=${periodType}&meta=true`);
    _covCache[key] = d.coverage;
    return d.coverage;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1: PORTFOLIO VIEW
// ─────────────────────────────────────────────────────────────────────────────
async function renderPortfolio(container) {
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div>
        <h2 style="margin:0;font-size:20px;color:#f1f5f9">Macro R-LAB</h2>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px">
          Laboratorio de investigación — relaciones señal→retorno
        </p>
      </div>
      <button id="rlab-new-btn" style="
        background:#2563eb;color:#fff;border:none;border-radius:6px;
        padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600">
        + Nueva investigación
      </button>
    </div>

    <div id="rlab-filters" style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      ${['Todos','BORRADOR','EN_INVESTIGACION','INDICATIVA','VALIDADA','NO_VALIDADA','INCONCLUSA','CERRADA']
        .map((s,i) => `<button class="rlab-filter-btn${i===0?' active':''}" data-state="${i===0?'':s}"
          style="padding:4px 12px;border-radius:20px;font-size:12px;cursor:pointer;
          border:1px solid ${i===0?'#2563eb':'#334155'};
          background:${i===0?'#1d3a6e':'#1e293b'};color:${i===0?'#60a5fa':'#94a3b8'}">${
          i===0?'Todos':s.replace('—',' ')}</button>`).join('')}
    </div>

    <div id="rlab-portfolio-list" style="display:flex;flex-direction:column;gap:12px">
      <div style="color:#64748b;text-align:center;padding:40px">Cargando...</div>
    </div>
  `;

  container.querySelector('#rlab-new-btn').onclick = () => renderNewForm(container);

  // Filtros
  container.querySelectorAll('.rlab-filter-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.rlab-filter-btn').forEach(b => {
        b.style.border = '1px solid #334155'; b.style.background = '#1e293b'; b.style.color = '#94a3b8'; b.classList.remove('active');
      });
      btn.style.border = '1px solid #2563eb'; btn.style.background = '#1d3a6e'; btn.style.color = '#60a5fa'; btn.classList.add('active');
      loadPortfolio(container, btn.dataset.state);
    };
  });

  loadPortfolio(container, '');
}

async function loadPortfolio(container, stateFilter) {
  const list = container.querySelector('#rlab-portfolio-list');
  list.innerHTML = '<div style="color:#64748b;text-align:center;padding:40px">Cargando...</div>';
  try {
    const url = stateFilter ? `/research?state=${stateFilter}` : '/research';
    const { items } = await apiFetch(url);
    if (!items?.length) {
      list.innerHTML = '<div style="color:#64748b;text-align:center;padding:40px">Sin investigaciones. Crea la primera.</div>';
      return;
    }
    list.innerHTML = items.map(r => renderPortfolioCard(r)).join('');
    list.querySelectorAll('.rlab-card').forEach(card => {
      card.onclick = () => renderDetail(container, card.dataset.id);
    });
  } catch (e) {
    list.innerHTML = `<div style="color:#f87171;padding:20px">Error: ${e.message}</div>`;
  }
}

function renderPortfolioCard(r) {
  const c = vc(r.state);
  return `
    <div class="rlab-card" data-id="${r.id}" style="
      background:#0f172a;border:1px solid #1e293b;border-left:3px solid ${c.border};
      border-radius:8px;padding:16px;cursor:pointer;transition:border-color .15s"
      onmouseover="this.style.borderColor='${c.border}'" onmouseout="this.style.borderColor='#1e293b'">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            ${badge(r.state)}
            <span style="color:#64748b;font-size:12px">v${r.versionCount || 0} ejecuciones</span>
          </div>
          <div style="font-size:15px;font-weight:600;color:#f1f5f9;margin-bottom:4px;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.title}</div>
          <div style="color:#94a3b8;font-size:12px;display:-webkit-box;-webkit-line-clamp:2;
            -webkit-box-orient:vertical;overflow:hidden">${r.hypothesis}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;font-size:12px;color:#64748b">
          <div style="color:#94a3b8;margin-bottom:4px">
            <span style="color:#cbd5e1">${INDICATORS[r.signal]||r.signal}</span>
            <span style="margin:0 4px">→</span>
            <span style="color:#cbd5e1">${INDICATORS[r.targetIndicator]||r.targetIndicator}</span>
          </div>
          <div>${r.updatedAt?.toDate?.()?.toLocaleDateString('es-ES') ?? ''}</div>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2: NUEVA INVESTIGACIÓN
// ─────────────────────────────────────────────────────────────────────────────
async function renderNewForm(container) {
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <button id="rlab-back" style="background:none;border:none;color:#60a5fa;cursor:pointer;font-size:13px">
        ← Volver al portfolio
      </button>
    </div>
    <h2 style="margin:0 0 24px;font-size:18px;color:#f1f5f9">Nueva investigación</h2>

    <form id="rlab-form" style="display:flex;flex-direction:column;gap:20px;max-width:680px">
      ${field('title','Título de la investigación','text','Ej: VIX alto predice recuperación S&P 500')}
      ${field('hypothesis','Hipótesis','textarea',
        'Describe la relación causal que esperas encontrar y el mecanismo económico...',8)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        ${selectField('signal','Indicador señal',INDICATORS)}
        ${selectField('targetIndicator','Indicador objetivo',INDICATORS)}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        ${selectField('transformSignal','Transformar señal',{
          LEVEL:'Nivel', YOY:'YoY %', MOM:'MoM %', ZSCORE:'Z-Score 1Y'})}
        <div>
          <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">Lag (meses)</label>
          <input name="lag" type="number" min="0" max="24" value="0" style="${inputStyle}">
        </div>
        ${selectField('quintiles','Quintiles',{3:'3 grupos',4:'4 grupos',5:'5 quintiles',10:'10 deciles'})}
      </div>

      <!-- Horizontes forward -->
      <div>
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px">Horizontes forward a analizar</label>
        <div style="display:flex;gap:8px">
          ${HORIZON_OPTIONS.map(h => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;
              background:#1e293b;border:1px solid #334155;border-radius:6px;padding:6px 12px">
              <input type="checkbox" name="horizons" value="${h}" ${h<=6?'checked':''}>
              <span style="font-size:13px;color:#cbd5e1">${h}M</span>
            </label>`).join('')}
        </div>
      </div>

      <!-- Período histórico -->
      <div>
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px">Período histórico</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px" id="period-btns">
          ${PERIOD_OPTIONS.map((p,i) => `
            <button type="button" class="period-btn${i===0?' active':''}" data-period="${p.value}"
              style="padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;
              border:1px solid ${i===0?'#2563eb':'#334155'};
              background:${i===0?'#1d3a6e':'#1e293b'};color:${i===0?'#60a5fa':'#94a3b8'}">${p.label}</button>
          `).join('')}
        </div>
        <div id="period-custom" style="display:none;display:flex;gap:12px">
          <div>
            <label style="font-size:11px;color:#64748b;margin-bottom:4px;display:block">Desde</label>
            <input id="period-from" type="date" style="${inputStyle}">
          </div>
          <div>
            <label style="font-size:11px;color:#64748b;margin-bottom:4px;display:block">Hasta</label>
            <input id="period-to" type="date" value="${new Date().toISOString().slice(0,10)}" style="${inputStyle}">
          </div>
        </div>
        <div id="period-meta" style="margin-top:8px;font-size:12px;color:#64748b;min-height:20px"></div>
      </div>

      ${field('notes','Notas iniciales (opcional)','textarea','Contexto adicional, referencias, casos de uso esperados...',4)}

      <div style="display:flex;gap:12px;margin-top:8px">
        <button type="submit" style="
          background:#2563eb;color:#fff;border:none;border-radius:6px;
          padding:10px 24px;cursor:pointer;font-size:14px;font-weight:600">
          Crear investigación
        </button>
        <button type="button" id="rlab-cancel" style="
          background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:6px;
          padding:10px 24px;cursor:pointer;font-size:14px">
          Cancelar
        </button>
      </div>
      <div id="rlab-form-error" style="color:#f87171;font-size:13px;display:none"></div>
    </form>
  `;

  container.querySelector('#rlab-back').onclick = () => renderPortfolio(container);
  container.querySelector('#rlab-cancel').onclick = () => renderPortfolio(container);

  // Período
  let selectedPeriod = 'MAX';
  container.querySelectorAll('.period-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.period-btn').forEach(b => {
        b.style.border='1px solid #334155'; b.style.background='#1e293b'; b.style.color='#94a3b8';
      });
      btn.style.border='1px solid #2563eb'; btn.style.background='#1d3a6e'; btn.style.color='#60a5fa';
      selectedPeriod = btn.dataset.period;
      const customDiv = container.querySelector('#period-custom');
      customDiv.style.display = selectedPeriod === 'CUSTOM' ? 'flex' : 'none';
      updatePeriodMeta();
    };
  });

  // Actualizar metadata de cobertura al cambiar señal/objetivo/período
  async function updatePeriodMeta() {
    const signal = container.querySelector('[name=signal]')?.value;
    const target = container.querySelector('[name=targetIndicator]')?.value;
    const metaDiv = container.querySelector('#period-meta');
    if (!signal || !target) return;
    metaDiv.textContent = 'Consultando cobertura...';
    try {
      const [sc, tc] = await Promise.all([
        fetchCoverage(signal, selectedPeriod),
        fetchCoverage(target, selectedPeriod),
      ]);
      const nObs = Math.min(sc?.nObs || 0, tc?.nObs || 0);
      metaDiv.innerHTML = `
        <span style="color:#94a3b8">Señal: </span>
        <span style="color:#cbd5e1">${sc?.dateFrom ?? '?'} → ${sc?.dateTo ?? '?'} · ${sc?.nObs?.toLocaleString() ?? '?'} obs</span>
        <span style="margin:0 8px;color:#475569">|</span>
        <span style="color:#94a3b8">Objetivo: </span>
        <span style="color:#cbd5e1">${tc?.dateFrom ?? '?'} → ${tc?.dateTo ?? '?'} · ${tc?.nObs?.toLocaleString() ?? '?'} obs</span>
        <span style="margin:0 8px;color:#475569">|</span>
        <span style="color:${nObs < 100 ? '#f87171' : '#4ade80'}">~${nObs.toLocaleString()} pares estimados</span>
      `;
    } catch { metaDiv.textContent = 'No se pudo consultar cobertura'; }
  }

  container.querySelector('[name=signal]').addEventListener('change', updatePeriodMeta);
  container.querySelector('[name=targetIndicator]').addEventListener('change', updatePeriodMeta);

  // Submit
  container.querySelector('#rlab-form').onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = container.querySelector('#rlab-form-error');
    errDiv.style.display = 'none';

    const form = e.target;
    const horizons = [...form.querySelectorAll('[name=horizons]:checked')].map(c => parseInt(c.value));
    if (!horizons.length) { errDiv.textContent='Selecciona al menos un horizonte'; errDiv.style.display='block'; return; }

    let periodConfig = { type: selectedPeriod };
    if (selectedPeriod === 'CUSTOM') {
      const from = container.querySelector('#period-from').value;
      const to   = container.querySelector('#period-to').value;
      if (!from) { errDiv.textContent='Indica fecha de inicio'; errDiv.style.display='block'; return; }
      periodConfig = { type: 'CUSTOM', from, to };
    }

    const body = {
      title:           form.querySelector('[name=title]').value.trim(),
      hypothesis:      form.querySelector('[name=hypothesis]').value.trim(),
      signal:          form.querySelector('[name=signal]').value,
      targetIndicator: form.querySelector('[name=targetIndicator]').value,
      transformSignal: form.querySelector('[name=transformSignal]').value,
      quintiles:       parseInt(form.querySelector('[name=quintiles]').value),
      lag:             parseInt(form.querySelector('[name=lag]').value) || 0,
      horizonMonths:   horizons,
      periodConfig,
      notes:           form.querySelector('[name=notes]').value.trim(),
    };

    if (!body.title || !body.hypothesis) {
      errDiv.textContent = 'Título e hipótesis son obligatorios'; errDiv.style.display='block'; return;
    }

    const btn = form.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Creando...';
    try {
      const res = await apiFetch('/research', { method:'POST', body: JSON.stringify(body) });
      renderDetail(container, res.id);
    } catch(err) {
      errDiv.textContent = err.message; errDiv.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Crear investigación';
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 3: DETALLE + EJECUCIÓN + RESULTADOS
// ─────────────────────────────────────────────────────────────────────────────
async function renderDetail(container, id) {
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button id="rlab-back" style="background:none;border:none;color:#60a5fa;cursor:pointer;font-size:13px">
        ← Portfolio
      </button>
    </div>
    <div id="rlab-detail-content" style="color:#64748b">Cargando...</div>
  `;
  container.querySelector('#rlab-back').onclick = () => renderPortfolio(container);

  try {
    const [detail, results] = await Promise.all([
      apiFetch(`/research?id=${id}`),
      apiFetch(`/results?researchId=${id}&all=true`).catch(() => ({ versions: [] })),
    ]);
    renderDetailContent(container, detail, results);
  } catch(e) {
    container.querySelector('#rlab-detail-content').innerHTML =
      `<div style="color:#f87171">Error: ${e.message}</div>`;
  }
}

function renderDetailContent(container, { research: r, executions }, { versions }) {
  const lastVersion = versions?.[0];
  const content = container.querySelector('#rlab-detail-content');
  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          ${badge(r.state)}
          <span style="color:#64748b;font-size:12px">${r.versionCount || 0} ejecuciones · v${versions.length}</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:19px;color:#f1f5f9">${r.title}</h2>
        <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.5">${r.hypothesis}</p>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        ${r.state !== 'CERRADA' ? `
          <button id="rlab-run-btn" style="
            background:#2563eb;color:#fff;border:none;border-radius:6px;
            padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600">
            ▶ Ejecutar
          </button>
          <button id="rlab-close-btn" style="
            background:#1e293b;color:#a78bfa;border:1px solid #7c3aed;border-radius:6px;
            padding:8px 16px;cursor:pointer;font-size:13px">
            Cerrar investigación
          </button>` : ''}
      </div>
    </div>

    <!-- Configuración -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;
      background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px;margin-bottom:20px">
      ${metaItem('Señal', INDICATORS[r.signal]||r.signal)}
      ${metaItem('Objetivo', INDICATORS[r.targetIndicator]||r.targetIndicator)}
      ${metaItem('Transformación', r.transformSignal||'LEVEL')}
      ${metaItem('Lag', `${r.lag||0} meses`)}
      ${metaItem('Quintiles', r.quintiles||5)}
      ${metaItem('Horizontes', (r.horizonMonths||[]).map(h=>`${h}M`).join(', '))}
      ${metaItem('Período', r.periodConfig?.type||'MAX')}
    </div>

    <!-- Historial de versiones -->
    ${versions.length ? `
      <div style="margin-bottom:20px">
        <h3 style="margin:0 0 12px;font-size:14px;color:#94a3b8;font-weight:600;
          text-transform:uppercase;letter-spacing:.5px">Historial de ejecuciones</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${versions.map(v => `
            <div class="rlab-ver-row" data-vid="${v.id}" style="
              background:#0f172a;border:1px solid #1e293b;border-radius:6px;
              padding:12px 16px;cursor:pointer;display:flex;justify-content:space-between;
              align-items:center">
              <span style="color:#94a3b8;font-size:13px">v${v.versionNum} · ${v.effectiveFrom||'?'} → ${v.effectiveTo||'?'} · ${v.nSignal?.toLocaleString()||'?'} obs</span>
              <div style="display:flex;align-items:center;gap:12px">
                ${Object.entries(v.verdictByHorizon||{}).map(([h,vd]) =>
                  `<span style="font-size:11px;color:${vc(vd).text}">${h}: ${vd}</span>`).join('')}
                ${badge(v.verdict || v.finalVerdict || 'EN_INVESTIGACION')}
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}

    <!-- Resultados de la última versión -->
    <div id="rlab-results-panel">
      ${lastVersion ? renderResultsPanel(lastVersion) : `
        <div style="text-align:center;padding:40px;color:#64748b;
          background:#0f172a;border:1px solid #1e293b;border-radius:8px">
          Sin ejecuciones aún. Pulsa <strong style="color:#60a5fa">▶ Ejecutar</strong> para lanzar el análisis.
        </div>`}
    </div>

    <!-- Ejecución en progreso -->
    <div id="rlab-exec-progress" style="display:none;
      background:#0f172a;border:1px solid #2563eb;border-radius:8px;padding:24px;text-align:center;margin-top:20px">
      <div style="color:#60a5fa;font-size:14px;margin-bottom:8px">⏳ Ejecutando análisis...</div>
      <div style="color:#64748b;font-size:12px">Descargando datos y calculando estadísticos. Puede tardar 15-30s.</div>
    </div>

    <!-- Error de ejecución -->
    <div id="rlab-exec-error" style="display:none;color:#f87171;font-size:13px;
      background:#2d0a0a;border:1px solid #dc2626;border-radius:8px;padding:16px;margin-top:16px"></div>
  `;

  // Botón ejecutar
  content.querySelector('#rlab-run-btn')?.addEventListener('click', async () => {
    const progress = content.querySelector('#rlab-exec-progress');
    const errDiv   = content.querySelector('#rlab-exec-error');
    const runBtn   = content.querySelector('#rlab-run-btn');
    progress.style.display = 'block';
    errDiv.style.display   = 'none';
    runBtn.disabled = true; runBtn.textContent = '▶ Ejecutando...';
    try {
      const result = await apiFetch('/execute', {
        method: 'POST',
        body: JSON.stringify({ researchId: r.id }),
      });
      progress.style.display = 'none';
      // Recargar detalle con nuevos resultados
      renderDetail(container, r.id);
    } catch(err) {
      progress.style.display = 'none';
      errDiv.style.display = 'block';
      errDiv.textContent = `Error en ejecución: ${err.message}`;
      runBtn.disabled = false; runBtn.textContent = '▶ Ejecutar';
    }
  });

  // Botón cerrar investigación
  content.querySelector('#rlab-close-btn')?.addEventListener('click', () => {
    renderCloseForm(container, r, lastVersion);
  });

  // Click en versión → cargar resultados
  content.querySelectorAll('.rlab-ver-row').forEach(row => {
    row.addEventListener('click', async () => {
      const vData = await apiFetch(`/results?versionId=${row.dataset.vid}`);
      content.querySelector('#rlab-results-panel').innerHTML = renderResultsPanel(vData);
    });
  });
}

function renderResultsPanel(v) {
  if (!v || !v.results) return '';
  const horizons = Object.keys(v.results);
  return `
    <div style="margin-top:4px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <h3 style="margin:0;font-size:14px;color:#94a3b8;font-weight:600;
          text-transform:uppercase;letter-spacing:.5px">Resultados v${v.versionNum}</h3>
        ${badge(v.verdict || 'EN_INVESTIGACION')}
        <span style="color:#64748b;font-size:12px">
          ${v.effectiveFrom||'?'} → ${v.effectiveTo||'?'} ·
          señal: ${v.nSignal?.toLocaleString()||'?'} obs ·
          cobertura: ${v.signalCoverage?.toFixed(1)||'?'}%
        </span>
      </div>

      <!-- Tabs de horizontes -->
      <div style="display:flex;gap:4px;margin-bottom:16px" id="hz-tabs">
        ${horizons.map((h,i) => {
          const r = v.results[h];
          const c = vc(r.verdict || 'INCONCLUSA');
          return `<button class="hz-tab${i===0?' active':''}" data-hz="${h}"
            style="padding:6px 16px;border-radius:6px 6px 0 0;font-size:13px;cursor:pointer;
            border:1px solid ${i===0?c.border:'#334155'};border-bottom:none;
            background:${i===0?c.bg:'#0f172a'};color:${i===0?c.text:'#64748b'}">${h}</button>`;
        }).join('')}
      </div>

      ${horizons.map((h,i) => `
        <div class="hz-panel" data-hz="${h}" style="display:${i===0?'block':'none'}">
          ${renderHorizonResult(v.results[h], h)}
        </div>`).join('')}
    </div>
  `;
}

function renderHorizonResult(r, h) {
  if (r.error) return `<div style="color:#f87171;padding:20px">${r.error} (${r.nPairs||0} pares)</div>`;

  const sp = r.spearman;
  const pe = r.pearson;
  const bt = r.bootstrap;
  const st = r.stability;
  const wf = r.walkForward;
  const mo = r.monotonicity;
  const qu = r.quintiles;

  return `
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:0 8px 8px 8px;padding:20px">
      <!-- Veredicto horizonte -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:12px;
        background:${vc(r.verdict||'INCONCLUSA').bg};border:1px solid ${vc(r.verdict||'INCONCLUSA').border};border-radius:6px">
        ${badge(r.verdict||'INCONCLUSA')}
        <span style="color:#94a3b8;font-size:13px">${r.nPairs?.toLocaleString()||'?'} pares · Horizonte ${h}</span>
        ${r.lookAheadViolations > 0 ? `
          <span style="color:#fbbf24;font-size:12px">⚠ ${r.lookAheadViolations} posibles look-ahead</span>` : ''}
      </div>

      <!-- Stats principales -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:20px">
        ${statCard('Spearman ρ', fmt(sp?.rho), sp?.pValue < 0.05 ? '#4ade80' : '#f87171',
          `p=${fmt(sp?.pValue,4)} ${stars(sp?.pValue)}  IC95: [${fmt(sp?.ci95?.[0])}, ${fmt(sp?.ci95?.[1])}]`)}
        ${statCard('Pearson r', fmt(pe?.r), pe?.pValue < 0.05 ? '#4ade80' : '#f87171',
          `p=${fmt(pe?.pValue,4)} ${stars(pe?.pValue)}`)}
        ${statCard('Bootstrap (BC)', fmt(bt?.median), null,
          `p=${fmt(bt?.pValue,4)} ${stars(bt?.pValue)}  IC95: [${fmt(bt?.ci95?.[0])}, ${fmt(bt?.ci95?.[1])}]`)}
        ${statCard('Monotonía Q', `${mo?.score ?? '?'}/4`, mo?.isMonotone ? '#4ade80' : '#f87171',
          mo?.isMonotone ? 'Monótona ✓' : 'No monótona')}
        ${statCard('Walk-Forward', fmt(wf?.test?.rho),
          (wf?.test?.pValue < 0.05) ? '#4ade80' : '#f87171',
          `Train: ${fmt(wf?.train?.rho)}  Test: ${fmt(wf?.test?.rho)} (${pctFmt(wf?.degradation)} degradación)`)}
      </div>

      <!-- Estabilidad temporal -->
      ${st?.blocks ? `
        <div style="margin-bottom:20px">
          <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">ESTABILIDAD TEMPORAL</div>
          <div style="display:flex;gap:12px">
            ${['early','mid','recent'].map(period => {
              const b = st.blocks?.[period];
              if (!b) return '';
              return `<div style="flex:1;background:#1e293b;border-radius:6px;padding:12px;text-align:center">
                <div style="font-size:11px;color:#64748b;margin-bottom:4px">${period.toUpperCase()}</div>
                <div style="font-size:18px;font-weight:700;color:${b.rho > 0 ? '#4ade80' : '#f87171'}">${fmt(b.rho,2)}</div>
                <div style="font-size:11px;color:#64748b">n=${b.n||'?'} p=${fmt(b.pValue,3)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>` : ''}

      <!-- Quintiles -->
      ${qu?.length ? `
        <div>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">ANÁLISIS POR QUINTILES</div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="color:#64748b">
                <th style="padding:6px;text-align:left">Q</th>
                <th style="padding:6px;text-align:left">Rango señal</th>
                <th style="padding:6px;text-align:right">Mediana ret.</th>
                <th style="padding:6px;text-align:right">Media ret.</th>
                <th style="padding:6px;text-align:right">% positivos</th>
                <th style="padding:6px;text-align:right">N</th>
              </tr>
            </thead>
            <tbody>
              ${qu.map((q, qi) => `
                <tr style="border-top:1px solid #1e293b">
                  <td style="padding:6px;color:#94a3b8">Q${qi+1}</td>
                  <td style="padding:6px;color:#94a3b8">[${fmt(q.xMin,2)}, ${fmt(q.xMax,2)}]</td>
                  <td style="padding:6px;text-align:right;color:${q.medianReturn>0?'#4ade80':'#f87171'}">${pctFmt(q.medianReturn)}</td>
                  <td style="padding:6px;text-align:right;color:${q.meanReturn>0?'#4ade80':'#f87171'}">${pctFmt(q.meanReturn)}</td>
                  <td style="padding:6px;text-align:right;color:#94a3b8">${(q.pctPositive*100).toFixed(1)}%</td>
                  <td style="padding:6px;text-align:right;color:#64748b">${q.n||0}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 4: CIERRE FORMAL
// ─────────────────────────────────────────────────────────────────────────────
function renderCloseForm(container, research, lastVersion) {
  const content = container.querySelector('#rlab-detail-content');
  const checklistItems = [
    ['hypothesisTested',  'La hipótesis fue testada formalmente'],
    ['lookaheadChecked',  'Verificado que no hay look-ahead bias'],
    ['multipleHorizons',  'Testado en múltiples horizontes temporales'],
    ['temporalStability', 'Comprobada estabilidad temporal (Early/Mid/Recent)'],
    ['walkForwardPassed', 'Walk-forward satisfactorio (no overfitting)'],
    ['economicRationale', 'Racionalidad económica documentada'],
    ['riskAware',         'Riesgos de implementación identificados'],
  ];

  content.insertAdjacentHTML('beforeend', `
    <div id="rlab-close-overlay" style="
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,0.75);z-index:1000;
      display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;
        padding:28px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto">
        <h3 style="margin:0 0 20px;font-size:17px;color:#f1f5f9">Cerrar investigación formalmente</h3>

        <div style="margin-bottom:20px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:8px">Veredicto final</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px" id="verdict-btns">
            ${['VALIDADA','INDICATIVA','INCONCLUSA','NO_VALIDADA','CERRADA—RESEARCH ONLY'].map((v,i) => {
              const c = vc(v);
              return `<button type="button" class="verdict-btn" data-verdict="${v}"
                style="padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;
                border:1px solid ${c.border};background:${i===0?c.bg:'#0f172a'};color:${c.text}">${v}</button>`;
            }).join('')}
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px">
            Justificación del cierre <span style="color:#f87171">*</span>
          </label>
          <textarea id="close-notes" rows="4" placeholder="Explica el resultado, limitaciones encontradas, próximos pasos..." style="${inputStyle};resize:vertical"></textarea>
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:10px">Checklist de cierre</label>
          ${checklistItems.map(([key, label]) => `
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:pointer">
              <input type="checkbox" class="close-check" data-key="${key}"
                style="accent-color:#2563eb;width:16px;height:16px">
              <span style="font-size:13px;color:#94a3b8">${label}</span>
            </label>`).join('')}
          <div id="checklist-pct" style="margin-top:8px;font-size:12px;color:#64748b">0/7 completados</div>
        </div>

        <div style="margin-bottom:20px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="promote-prod" style="accent-color:#2563eb;width:16px;height:16px">
            <span style="font-size:13px;color:#94a3b8">Promover a producción</span>
          </label>
          <div id="prod-notes-wrap" style="display:none;margin-top:8px">
            <textarea id="prod-notes" rows="2" placeholder="Notas de implementación en producción..." style="${inputStyle}"></textarea>
          </div>
        </div>

        <div style="display:flex;gap:12px">
          <button id="close-submit" style="
            background:#7c3aed;color:#fff;border:none;border-radius:6px;
            padding:10px 24px;cursor:pointer;font-size:13px;font-weight:600">
            Cerrar investigación
          </button>
          <button id="close-cancel" style="
            background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:6px;
            padding:10px 16px;cursor:pointer;font-size:13px">
            Cancelar
          </button>
        </div>
        <div id="close-error" style="display:none;color:#f87171;font-size:13px;margin-top:12px"></div>
      </div>
    </div>
  `);

  const overlay = content.querySelector('#rlab-close-overlay');
  let selectedVerdict = 'VALIDADA';

  overlay.querySelector('#close-cancel').onclick = () => overlay.remove();

  // Selección de veredicto
  overlay.querySelectorAll('.verdict-btn').forEach(btn => {
    btn.onclick = () => {
      overlay.querySelectorAll('.verdict-btn').forEach(b => { b.style.background = '#0f172a'; });
      const c = vc(btn.dataset.verdict);
      btn.style.background = c.bg;
      selectedVerdict = btn.dataset.verdict;
    };
  });

  // Contador checklist
  overlay.querySelectorAll('.close-check').forEach(cb => {
    cb.onchange = () => {
      const done = overlay.querySelectorAll('.close-check:checked').length;
      overlay.querySelector('#checklist-pct').textContent = `${done}/7 completados`;
    };
  });

  // Promover a producción toggle
  overlay.querySelector('#promote-prod').onchange = function() {
    overlay.querySelector('#prod-notes-wrap').style.display = this.checked ? 'block' : 'none';
  };

  // Submit cierre
  overlay.querySelector('#close-submit').onclick = async () => {
    const errDiv  = overlay.querySelector('#close-error');
    const notes   = overlay.querySelector('#close-notes').value.trim();
    const promote = overlay.querySelector('#promote-prod').checked;
    const checklist = Object.fromEntries(
      [...overlay.querySelectorAll('.close-check')].map(c => [c.dataset.key, c.checked])
    );
    errDiv.style.display = 'none';
    try {
      await apiFetch('/close', {
        method: 'POST',
        body: JSON.stringify({
          researchId:     research.id,
          finalVerdict:   selectedVerdict,
          closureNotes:   notes,
          checklist,
          promoteToProd:  promote,
          productionNotes: overlay.querySelector('#prod-notes')?.value?.trim() || '',
        }),
      });
      overlay.remove();
      renderDetail(container, research.id);
    } catch(err) {
      errDiv.textContent = err.message;
      errDiv.style.display = 'block';
    }
  };
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────
const inputStyle = `width:100%;background:#1e293b;border:1px solid #334155;border-radius:6px;
  color:#f1f5f9;padding:8px 12px;font-size:13px;box-sizing:border-box;font-family:inherit`;

function field(name, label, type = 'text', placeholder = '', rows = 3) {
  const input = type === 'textarea'
    ? `<textarea name="${name}" rows="${rows}" placeholder="${placeholder}" style="${inputStyle};resize:vertical"></textarea>`
    : `<input name="${name}" type="${type}" placeholder="${placeholder}" style="${inputStyle}">`;
  return `<div>
    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">${label}</label>
    ${input}
  </div>`;
}

function selectField(name, label, options) {
  const opts = Object.entries(options).map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
  return `<div>
    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">${label}</label>
    <select name="${name}" style="${inputStyle}">${opts}</select>
  </div>`;
}

function metaItem(label, value) {
  return `<div>
    <div style="font-size:11px;color:#64748b;margin-bottom:2px">${label}</div>
    <div style="font-size:13px;color:#cbd5e1">${value}</div>
  </div>`;
}

function statCard(label, value, color, sub = '') {
  return `<div style="background:#1e293b;border-radius:8px;padding:14px">
    <div style="font-size:11px;color:#64748b;margin-bottom:4px;text-transform:uppercase">${label}</div>
    <div style="font-size:22px;font-weight:700;color:${color||'#f1f5f9'};margin-bottom:4px">${value}</div>
    ${sub ? `<div style="font-size:11px;color:#64748b">${sub}</div>` : ''}
  </div>`;
}

// ─── Activación de tabs de horizontes (delegación de eventos) ────────────────
function bindHorizonTabs(container) {
  container.addEventListener('click', e => {
    const tab = e.target.closest('.hz-tab');
    if (!tab) return;
    const hz = tab.dataset.hz;
    const parent = tab.closest('[id^=rlab]') || container;
    parent.querySelectorAll('.hz-tab').forEach(t => {
      t.classList.remove('active');
      t.style.background = '#0f172a'; t.style.color = '#64748b'; t.style.border = '1px solid #334155'; t.style.borderBottom = 'none';
    });
    tab.classList.add('active');
    parent.querySelectorAll('.hz-panel').forEach(p => {
      p.style.display = p.dataset.hz === hz ? 'block' : 'none';
    });
  });
}

// ─── Export público (patrón estándar del router) ─────────────────────────────
export function render(el) {
  bindHorizonTabs(el);
  renderPortfolio(el);
}

// Alias para uso directo si se invoca fuera del router
export function initMacroRLab(container) {
  render(container);
}
