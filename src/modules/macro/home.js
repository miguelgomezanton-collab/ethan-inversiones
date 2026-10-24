import { getMacroData } from './macro-data.js';

// ── Utilidades de formato ─────────────────────────────────────────────────────
const f1  = v => v != null ? Number(v).toFixed(1)  : '—';
const f2  = v => v != null ? Number(v).toFixed(2)  : '—';
const f3  = v => v != null ? Number(v).toFixed(3)  : '—';
const sgn = v => v != null ? (v >= 0 ? '+' : '') + f2(v) : '—';
const pct = v => v != null ? (v >= 0 ? '+' : '') + f1(v) + '%' : '—';

// Colores semánticos ─────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s == null) return 'var(--text3)';
  if (s >= 4)   return 'var(--green)';
  if (s >= 0)   return 'var(--amber)';
  return 'var(--red)';
}

// Chip de estado inline ───────────────────────────────────────────────────────
function chip(label, color) {
  return `<span style="display:inline-block;padding:1px 6px;border-radius:3px;font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:${color}22;color:${color};border:1px solid ${color}44;">${label}</span>`;
}

// Semáforo dot ────────────────────────────────────────────────────────────────
function dot(score, size = 8) {
  const c = score == null ? 'var(--text3)' : score > 0 ? 'var(--green)' : score < 0 ? 'var(--red)' : 'var(--amber)';
  return `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:50%;background:${c};flex-shrink:0;"></span>`;
}

// Etiqueta de alerta ──────────────────────────────────────────────────────────
function alertChip(severity) {
  const map = { error: ['var(--red)', '⬤ ACTIVA'], warn: ['var(--amber)', '◐ WARN'], info: ['var(--teal)', 'ℹ INFO'] };
  const [c, t] = map[severity] || ['var(--text3)', severity];
  return chip(t, c);
}

// Etiqueta freshness ──────────────────────────────────────────────────────────
function freshnessChip(f) {
  if (f === 'ok')    return chip('LIVE', 'var(--green)');
  if (f === 'warn')  return chip('RECIENTE', 'var(--amber)');
  if (f === 'stale') return chip('STALE', 'var(--red)');
  return '';
}

// ── Fila de indicador compacta ────────────────────────────────────────────────
function indRow(label, val, extra = '') {
  return `
    <div style="display:flex;align-items:baseline;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
      <span style="font-size:10px;color:var(--text2);">${label}</span>
      <span style="font-family:var(--mono);font-size:11px;font-weight:600;color:var(--text1);">${val}${extra ? `<span style="font-size:9px;color:var(--text3);margin-left:4px;">${extra}</span>` : ''}</span>
    </div>`;
}

// ── Micro barra de cambio ─────────────────────────────────────────────────────
function chgBar(chg1d, chg5d) {
  if (chg1d == null && chg5d == null) return '';
  const items = [];
  if (chg1d != null) {
    const c = chg1d > 0 ? 'var(--green)' : chg1d < 0 ? 'var(--red)' : 'var(--text3)';
    items.push(`<span style="font-family:var(--mono);font-size:9px;color:${c};">${chg1d > 0 ? '+' : ''}${f2(chg1d)}<span style="color:var(--text3);">1d</span></span>`);
  }
  if (chg5d != null) {
    const c = chg5d > 0 ? 'var(--green)' : chg5d < 0 ? 'var(--red)' : 'var(--text3)';
    items.push(`<span style="font-family:var(--mono);font-size:9px;color:${c};">${chg5d > 0 ? '+' : ''}${f2(chg5d)}<span style="color:var(--text3);">5d</span></span>`);
  }
  return `<div style="display:flex;gap:8px;margin-top:2px;">${items.join('')}</div>`;
}

// ── Estado SP500 M10 ─────────────────────────────────────────────────────────
function sp500State(state) {
  if (state === 'alcista')  return chip('ALCISTA', 'var(--green)');
  if (state === 'bajista')  return chip('BAJISTA', 'var(--red)');
  return chip('NEUTRAL', 'var(--amber)');
}

// ── VIX Term Ratio estado ────────────────────────────────────────────────────
function vixRatioChip(state) {
  const map = {
    'contango':         ['var(--green)',  'CONTANGO'],
    'tension-creciente':['var(--teal)',   'TENSIÓN ↑'],
    'backwardation':    ['var(--amber)',  'BACKWRDTN'],
    'estres-severo':    ['var(--red)',    'ESTRÉS'],
  };
  const [c, l] = map[state] || ['var(--text3)', state || '—'];
  return chip(l, c);
}

// ── HY OAS estado ────────────────────────────────────────────────────────────
function hyStateChip(state) {
  const map = {
    normal:     ['var(--green)',  'NORMAL'],
    vigilancia: ['var(--teal)',   'VIGILANCIA'],
    tension:    ['var(--amber)',  'TENSIÓN'],
    estres:     ['var(--red)',    'ESTRÉS'],
  };
  const [c, l] = map[state] || ['var(--text3)', state || '—'];
  return chip(l, c);
}

// ── DFII10 régimen ───────────────────────────────────────────────────────────
function dfiiRegimeChip(r) {
  const map = {
    restrictivo:     ['var(--red)',   'RESTRICTIVO'],
    'levemente-restrictivo': ['var(--amber)', 'LEVE RESTR.'],
    neutral:         ['var(--teal)',  'NEUTRAL'],
    acomodaticio:    ['var(--green)', 'ACOMODATICIO'],
  };
  const [c, l] = map[r] || ['var(--text3)', r || '—'];
  return chip(l, c);
}

// ── Prompt para Claude IA ─────────────────────────────────────────────────────
function buildPrompt(macro) {
  const co  = macro.coyuntura   || {};
  const liq = macro.liquidez    || {};
  const seg = macro.seguimiento || {};
  const ind = macro.indicators  || {};
  const cf  = macro.condicionesFinancieras || {};
  const mkt = macro.mercado     || {};
  const s   = macro.scoreTotal  ?? 0;
  const alerts = (macro.alerts || []).filter(a => a.severity === 'error' || a.severity === 'warn');

  const line = (label, val, unit = '') =>
    val != null ? `- ${label}: ${typeof val === 'number' ? (val >= 0 ? '+' : '') + f2(val) : val}${unit}` : null;

  const hy  = liq.hyOas   || {};
  const dxy = cf.dxy       || {};
  const df  = cf.dfii10    || {};
  const sp  = mkt.sp500Trend || {};
  const vix = mkt.vix       || {};
  const vtr = mkt.vixTermRatio || {};

  const dataBlock = [
    `SCORE MACRO TOTAL: ${s >= 0 ? '+' : ''}${s} / +15 → ${macro.zone || '—'}`,
    '',
    '## CICLO Y CURVA',
    line('Curva USD (10Y−2Y)', co.curvaUSD?.value,  '%'),
    co.curvaUSD?.score != null ? `  → score ${co.curvaUSD.score > 0 ? '+1' : co.curvaUSD.score === 0 ? '0' : '-1'}` : null,
    line('T10Y Real Yield (DFII10)', df.value, '%'),
    df.regime ? `  → régimen: ${df.regime}  (percentil ${df.percentile}%)` : null,
    line('10Y Treasury', cf.t10y?.value, '%'),
    line('2Y Treasury',  cf.t2y?.value,  '%'),
    '',
    '## CONDICIONES DE MERCADO',
    line('HY OAS', hy.value, '%'),
    hy.hyState ? `  → estado: ${hy.hyState}  (percentil ${hy.percentile}%  Z-score 3Y: ${hy.zscore3y ?? '—'})` : null,
    vix.value != null ? `- VIX: ${f1(vix.value)}  MM200: ${f1(vix.mm200)}  ${vix.aboveMM200 ? 'sobre MM200 — alerta' : 'bajo MM200 — ok'}` : null,
    vtr.ratio != null ? `- VIX Term Ratio: ${f2(vtr.ratio)} → ${vtr.state}` : null,
    line('DXY', dxy.value),
    dxy.percentile != null ? `  → percentil ${dxy.percentile}%  (${dxy.percentileWindow})` : null,
    '',
    '## S&P 500 TENDENCIA MULTITEMPORAL',
    sp.monthly ? `- Mensual: ${sp.monthly.state}  precio=${f2(sp.monthly.price)}  M10=${f2(sp.monthly.m10)}` : null,
    sp.weekly  ? `- Semanal: ${sp.weekly.state}   precio=${f2(sp.weekly.price)}   M10=${f2(sp.weekly.m10)}` : null,
    sp.daily   ? `- Diario:  ${sp.daily.state}    precio=${f2(sp.daily.price)}    M10=${f2(sp.daily.m10)}` : null,
    sp.summary ? `- Resumen: ${sp.summary}` : null,
    '',
    '## LIQUIDEZ GLOBAL',
    line('M2 Global YoY', liq.m2?.value, '%'),
    liq.m2?.score != null ? `  → score ${liq.m2.score}` : null,
    line('Crédito vs GDP', liq.credito?.value, '%'),
    line('Impulso Crediticio', liq.impulso?.value),
    line('Velocidad M2 YoY', liq.velM2?.value, '%'),
    line('Reservas Fed', liq.reservas?.value, 'T$'),
    '',
    '## ALERTAS ACTIVAS',
    alerts.length ? alerts.map(a => `- [${a.severity.toUpperCase()}] ${a.label}: ${a.triggers.join(' / ')}`).join('\n') : '- Sin alertas activas',
    '',
    '## POLÍTICA MONETARIA',
    line('Fed Funds Rate', seg.ffr?.value, '%'),
    line('Tipo Real ex post (FFR−CPI)', co.tipoReal?.value, '%'),
    line('CPI Headline YoY', co.cpi?.value, '%'),
    line('CPI Core YoY', co.cpi?.cpiCore, '%'),
  ].filter(v => v != null).join('\n');

  return `Eres ETHAN, un sistema de análisis macroeconómico profesional para un inversor particular.
Tienes acceso a los datos macro actualizados del sistema de scoring ETHAN (rango -15 a +15).

Aquí están los datos macro en tiempo real:

${dataBlock}

INSTRUCCIONES:
Genera un análisis ejecutivo en español de exactamente 5 párrafos. Estructura:
1. RÉGIMEN MACRO: dónde estamos en el ciclo y qué lo confirma (curva, score, tendencia SP500)
2. TENSIÓN FINANCIERA: crédito HY, volatilidad VIX/ratio, qué nivel de riesgo sistémico hay ahora
3. CONDICIONES MONETARIAS: tipo real DFII10, DXY, qué implica para el posicionamiento
4. LIQUIDEZ Y MOMENTUM: M2, crédito, impulso, si el combustible del ciclo aguanta
5. CONCLUSIÓN ACCIONABLE: 2-3 frases concretas sobre posicionamiento para esta semana

Reglas de formato estrictas:
- NO uses #, ##, ---, ni ningún símbolo markdown de encabezado o separador
- Empieza cada párrafo directamente con el título en MAYÚSCULAS seguido de un espacio y el texto
- Usa **negrita** solo para conceptos clave dentro del texto
- Sin bullet points, todo en prosa continua
- No repitas los números que ya aparecen en el dashboard — interprétalos
- Tono directo, técnico pero claro, sin rodeos`;
}

// ── Llamada a Claude IA ───────────────────────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch('/api/macro-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.text || '';
}

// ── Render principal ──────────────────────────────────────────────────────────
export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `
    <button class="btn" id="home-ai-btn">✦ Análisis ETHAN IA</button>
    <button class="btn btn-primary" id="home-refresh">↻ Actualizar</button>
  `;
  container.innerHTML = `<div id="home-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando dashboard...</div></div></div>`;

  let currentMacro = null;

  async function load(force = false) {
    try {
      const m = await getMacroData(force);
      currentMacro = m;
      paint(m);
    } catch (e) {
      document.getElementById('home-wrap').innerHTML =
        `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  async function generateAI() {
    if (!currentMacro) return;
    const btn = document.getElementById('home-ai-btn');
    const box = document.getElementById('home-ai-box');
    if (!box) return;

    btn.disabled = true;
    btn.textContent = '✦ Generando...';
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
        <div class="loader-ring"></div>
        <span style="font-size:11px;color:var(--text3);font-family:var(--mono);">Analizando datos macro...</span>
      </div>`;

    try {
      const prompt = buildPrompt(currentMacro);
      const text   = await callClaude(prompt);

      const cleaned = text
        .replace(/^#{1,3}\s.*$/gm, '')
        .replace(/^-{3,}$/gm, '')
        .replace(/^\*{3,}$/gm, '')
        .trim();

      const formatted = cleaned
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(p => `<p style="margin-bottom:12px;line-height:1.75;">${p.trim()}</p>`)
        .join('');

      const s = currentMacro.scoreTotal;
      box.innerHTML = `
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:var(--teal);margin-bottom:10px;">
          ✦ Análisis ETHAN IA · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} · Score ${s >= 0 ? '+' : ''}${s} / +15
        </div>
        <div style="font-size:12px;color:var(--text2);">${formatted}</div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:9px;color:var(--text3);font-family:var(--mono);">
          Generado automáticamente con Claude · No constituye asesoramiento financiero · ETHAN v5c
        </div>`;
    } catch (e) {
      box.innerHTML = `<div style="font-size:11px;color:var(--red);font-family:var(--mono);">⚠ Error al generar análisis: ${e.message}</div>`;
    } finally {
      btn.disabled    = false;
      btn.textContent = '✦ Análisis ETHAN IA';
    }
  }

  // ── paint ──────────────────────────────────────────────────────────────────
  function paint(macro) {
    const el  = document.getElementById('home-wrap');
    const s   = macro.scoreTotal ?? 0;
    const z   = macro.zone || '—';
    const co  = macro.coyuntura   || {};
    const liq = macro.liquidez    || {};
    const seg = macro.seguimiento || {};
    const ind = macro.indicators  || {};
    const cf  = macro.condicionesFinancieras || {};
    const mkt = macro.mercado     || {};

    const mainCol = scoreColor(s);

    // Datos de uso frecuente
    const vix  = mkt.vix          || null;
    const vix3 = mkt.vix3m        || null;
    const vtr  = mkt.vixTermRatio || null;
    const hy   = liq.hyOas        || null;
    const sp   = mkt.sp500Trend   || null;
    const dxy  = cf.dxy           || null;
    const df   = cf.dfii10        || null;
    const t10  = cf.t10y          || null;
    const t2   = cf.t2y           || null;
    const cv   = cf.t10y2y        || seg.t10y2y || null;
    const alerts = (macro.alerts  || []);
    const activeAlerts = alerts.filter(a => a.severity === 'error' || a.severity === 'warn');

    // ── Difusión de scores (excluye indicadores sin score) ─────────────────
    const allScores  = Object.values(ind).filter(i => i?.score != null);
    const mejoran    = allScores.filter(i => i.score  > 0).length;
    const empeoran   = allScores.filter(i => i.score  < 0).length;
    const neutros    = allScores.filter(i => i.score === 0).length;
    const difusion   = allScores.length ? Math.round(mejoran / allScores.length * 100) : 0;
    const difCol     = difusion >= 50 ? 'var(--green)' : difusion >= 30 ? 'var(--amber)' : 'var(--red)';

    // ── Frase ejecutiva dinámica ───────────────────────────────────────────
    const frParts = [];
    if (cv?.value != null) {
      frParts.push(cv.value < 0
        ? `La <strong>curva USD invertida</strong> (${f2(cv.value)}%) anticipa desaceleración`
        : `La <strong>curva USD positiva</strong> (+${f2(cv.value)}%) apoya el ciclo`);
    }
    if (hy?.hyState) {
      const hyMap = { normal: 'crédito HY en zona normal', vigilancia: '<strong>crédito HY en vigilancia</strong>', tension: '<strong>tensión en crédito HY</strong>', estres: '<strong>estrés severo en crédito HY</strong>' };
      frParts.push(hyMap[hy.hyState] || `HY OAS ${f2(hy.value)}%`);
    }
    if (sp?.summary) frParts.push(`SP500 ${sp.summary}`);
    if (df?.regime) frParts.push(`tipo real ${df.regime} (DFII10 ${f2(df.value)}%)`);
    if (liq.m2?.value != null) frParts.push(liq.m2.score < 0 ? `<strong>liquidez insuficiente</strong> (M2 ${f2(liq.m2.value)}%)` : `liquidez global expansiva (M2 ${pct(liq.m2.value)})`);

    const phrase = frParts.length
      ? (frParts.join('. ') + '.').replace(/^./, c => c.toUpperCase())
      : 'Cargando diagnóstico completo…';

    // ── SP500 — estado 3 timeframes ────────────────────────────────────────
    function spRow(tf, data) {
      if (!data) return `<div style="padding:5px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${tf}</span><span style="font-size:9px;color:var(--text3);">—</span></div>`;
      const stateC = data.state === 'alcista' ? 'var(--green)' : data.state === 'bajista' ? 'var(--red)' : 'var(--amber)';
      return `
        <div style="padding:5px 0;border-bottom:1px solid var(--border);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${tf}</span>
            ${sp500State(data.state)}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:3px;">
            <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">P: <span style="color:var(--text1);">${f2(data.price)}</span></span>
            <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">M10: <span style="color:${stateC};">${f2(data.m10)}</span></span>
            <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">N=${data.nObs}</span>
          </div>
        </div>`;
    }

    el.innerHTML = `
      <!-- ── FILA 1: Score + Semáforo + Difusión ── -->
      <div style="display:grid;grid-template-columns:200px 1fr 160px;gap:14px;margin-bottom:14px;">

        <!-- Score macro -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px 16px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">MACRO SCORE</div>
          <div style="font-family:var(--serif);font-size:56px;font-weight:600;font-style:italic;line-height:1;color:${mainCol};">${s >= 0 ? '+' : ''}${s}</div>
          <div style="font-family:var(--serif);font-size:16px;font-style:italic;color:${mainCol};margin-top:4px;">${z}</div>
          <div style="height:4px;background:var(--surface2);border-radius:2px;width:100%;margin-top:10px;overflow:hidden;">
            <div style="height:100%;width:${Math.max(0, ((s + 15) / 30) * 100)}%;background:${mainCol};border-radius:2px;transition:width 0.6s;"></div>
          </div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:4px;">${s >= 0 ? '+' : ''}${s} de ±15</div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);width:100%;text-align:left;">
            <div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">ÚLTIMA ACTUALIZACIÓN</div>
            <div style="font-family:var(--mono);font-size:10px;color:var(--text1);">${macro.updatedAt ? new Date(macro.updatedAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
          </div>
        </div>

        <!-- Semáforo por bloques -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Estado del ciclo</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${[
              // Ciclo
              { l: 'Ciclo / Curva', s: co.curvaUSD?.score, v: cv?.value != null ? (cv.value >= 0 ? '+' : '') + f2(cv.value) + '% 10Y−2Y' : '—' },
              // Liquidez
              { l: 'Liquidez Global', s: liq.m2?.score, v: liq.m2?.value != null ? pct(liq.m2.value) + ' M2' : '—' },
              // Crédito HY
              { l: 'Crédito HY', s: hy?.hyState === 'normal' ? 1 : hy?.hyState === 'vigilancia' ? 0 : hy?.hyState === 'tension' ? -1 : hy?.hyState === 'estres' ? -2 : null,
                v: hy ? `${f2(hy.value)}%  ${hy.hyState || ''}` : '—' },
              // Volatilidad
              { l: 'Volatilidad VIX', s: vix ? (vix.aboveMM200 ? -1 : 1) : null, v: vix ? f1(vix.value) + '  ' + (vtr?.state || '') : '—' },
              // SP500 tendencia
              { l: 'SP500 Tendencia', s: sp?.daily?.state === 'alcista' ? 1 : sp?.daily?.state === 'bajista' ? -1 : sp?.daily ? 0 : null,
                v: sp?.summary || '—' },
              // Pol monetaria
              { l: 'Tipo Real TIPS', s: df ? (df.value > 1.5 ? -1 : df.value > 0 ? 0 : 1) : null,
                v: df ? f2(df.value) + '% ' + (df.regime || '') : '—' },
            ].map(row => {
              const sc = row.s != null ? (row.s > 0 ? 1 : row.s < 0 ? -1 : 0) : null;
              const c  = sc == null ? 'var(--text3)' : sc > 0 ? 'var(--green)' : sc < 0 ? 'var(--red)' : 'var(--amber)';
              return `
                <div style="display:flex;align-items:flex-start;gap:7px;padding:6px 8px;border-radius:6px;border:1px solid var(--border);">
                  <div style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0;margin-top:2px;"></div>
                  <div>
                    <div style="font-size:9px;color:var(--text2);font-weight:600;margin-bottom:2px;">${row.l}</div>
                    <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${row.v}</div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Difusión -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Difusión</div>
          <div style="width:80px;height:80px;border-radius:50%;background:conic-gradient(${difCol} 0% ${difusion}%, var(--surface2) ${difusion}% 100%);display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">
            <div style="width:60px;height:60px;border-radius:50%;background:var(--surface1);display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <div style="font-family:var(--mono);font-size:20px;font-weight:700;color:${difCol};">${difusion}%</div>
            </div>
          </div>
          <div style="font-size:9px;color:var(--text3);margin-bottom:10px;">${difusion >= 50 ? 'señal alcista' : difusion >= 30 ? 'señal neutra' : 'señal bajista'}</div>
          <div style="width:100%;border-top:1px solid var(--border);padding-top:8px;">
            <div style="display:flex;justify-content:space-around;">
              <div style="text-align:center;"><div style="font-size:18px;font-weight:700;color:var(--green);">↑${mejoran}</div><div style="font-size:8px;color:var(--text3);">pos</div></div>
              <div style="text-align:center;"><div style="font-size:18px;font-weight:700;color:var(--text3);">=${neutros}</div><div style="font-size:8px;color:var(--text3);">neu</div></div>
              <div style="text-align:center;"><div style="font-size:18px;font-weight:700;color:var(--red);">↓${empeoran}</div><div style="font-size:8px;color:var(--text3);">neg</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FILA 2: Frase ejecutiva ── -->
      <div class="mac-card" style="background:rgba(${s>=4?'74,222,128':s>=0?'251,191,36':'244,113,116'},0.04);border-color:rgba(${s>=4?'74,222,128':s>=0?'251,191,36':'244,113,116'},0.20);margin-bottom:14px;">
        <div style="font-family:var(--serif);font-size:14px;font-style:italic;color:var(--text1);line-height:1.8;" id="home-phrase">${phrase}</div>
      </div>

      <!-- ── FILA 3: Mercado (VIX·HY·SP500) ── -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">

        <!-- VIX + VIX3M + Ratio -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Volatilidad VIX</div>
          <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px;">
            <div>
              <div style="font-family:var(--mono);font-size:8px;color:var(--text3);">VIX</div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;line-height:1;color:${vix ? (vix.aboveMM200 ? 'var(--red)' : 'var(--green)') : 'var(--text3)'};">${vix ? f1(vix.value) : '—'}</div>
              ${vix ? chgBar(vix.chg1d, vix.chg5d) : ''}
            </div>
            <div>
              <div style="font-family:var(--mono);font-size:8px;color:var(--text3);">VIX3M</div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);">${vix3 ? f1(vix3.value) : '—'}</div>
              ${vix3 ? chgBar(vix3.chg1d, vix3.chg5d) : ''}
            </div>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
              <span style="font-size:9px;color:var(--text2);">VIX/VIX3M</span>
              <span style="font-family:var(--mono);font-size:11px;font-weight:600;color:var(--text1);">${vtr ? f3(vtr.ratio) : '—'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:9px;color:var(--text3);">Estado</span>
              ${vtr ? vixRatioChip(vtr.state) : '<span style="font-size:9px;color:var(--text3);">—</span>'}
            </div>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:7px;margin-top:7px;">
            ${vix ? indRow('MM200', f1(vix.mm200)) : ''}
            ${vix ? `<div style="display:flex;justify-content:space-between;padding:4px 0;">
              <span style="font-size:10px;color:var(--text2);">Sobre MM200</span>
              <span style="font-family:var(--mono);font-size:10px;font-weight:600;color:${vix.aboveMM200?'var(--red)':'var(--green)'};">${vix.aboveMM200?'SÍ ⚠':'NO ✓'}</span>
            </div>` : ''}
            ${vix ? `<div style="margin-top:4px;">${freshnessChip(vix.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:4px;">${vix.ageDays}d</span></div>` : ''}
          </div>
        </div>

        <!-- HY OAS -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">HY OAS — Crédito</div>
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:2px;">
            <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;line-height:1;color:${hy ? (hy.hyState === 'normal' ? 'var(--green)' : hy.hyState === 'vigilancia' ? 'var(--teal)' : hy.hyState === 'tension' ? 'var(--amber)' : 'var(--red)') : 'var(--text3)'};">${hy ? f2(hy.value) : '—'}</div>
            <div style="font-family:var(--mono);font-size:10px;color:var(--text3);">%</div>
          </div>
          ${hy ? chgBar(hy.chg1d, hy.chg5d) : ''}
          <div style="margin-top:8px;">${hy ? hyStateChip(hy.hyState) : ''}</div>
          <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:8px;">
            ${hy ? indRow('MM200', f2(hy.mm200)) : ''}
            ${hy ? indRow('Percentil', hy.percentile != null ? hy.percentile + '%' : '—', hy.percentileWindow || '') : ''}
            ${hy?.zscore3y != null ? indRow('Z-score 3Y', f2(hy.zscore3y)) : ''}
            ${hy ? `<div style="margin-top:5px;">${freshnessChip(hy.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:4px;">${hy.ageDays}d · ${hy.date}</span></div>` : '<div style="font-size:10px;color:var(--text3);">Sin datos HY OAS</div>'}
          </div>
        </div>

        <!-- SP500 Tendencia -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">S&P 500 — Tendencia M10</div>
          ${sp ? `
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;">
              <div style="font-family:var(--serif);font-size:24px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);">${f2(sp.daily?.price)}</div>
              <div style="font-family:var(--mono);font-size:8px;color:var(--text3);text-align:right;">${sp.dateLastClose || ''}</div>
            </div>
            ${spRow('Mensual',  sp.monthly)}
            ${spRow('Semanal',  sp.weekly)}
            ${spRow('Diario',   sp.daily)}
            <div style="padding-top:6px;">
              <div style="font-size:9px;color:var(--text2);">${sp.summary || ''}</div>
            </div>
          ` : '<div style="font-size:10px;color:var(--text3);">Sin datos S&P 500</div>'}
        </div>
      </div>

      <!-- ── FILA 4: Condiciones Financieras ── -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px;">

        <!-- DXY -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">DXY — Dólar</div>
          <div style="font-family:var(--serif);font-size:26px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);margin-bottom:4px;">${dxy ? f2(dxy.value) : '—'}</div>
          ${dxy ? chgBar(dxy.chg1d, dxy.chg5d) : ''}
          <div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;">
            ${dxy ? indRow('MM200', f2(dxy.mm200)) : ''}
            ${dxy ? indRow('Percentil', dxy.percentile != null ? dxy.percentile + '%' : '—', dxy.percentileWindow || '') : ''}
            ${dxy ? `<div style="margin-top:5px;">${freshnessChip(dxy.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:4px;">${dxy.ageDays}d</span></div>` : ''}
          </div>
        </div>

        <!-- T10Y / T2Y -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Curva Treasury</div>
          <div style="display:flex;gap:12px;margin-bottom:8px;">
            <div>
              <div style="font-size:8px;color:var(--text3);font-family:var(--mono);">10Y</div>
              <div style="font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);">${t10 ? f2(t10.value) : '—'}</div>
              ${t10 ? chgBar(t10.chg1d, t10.chg5d) : ''}
            </div>
            <div>
              <div style="font-size:8px;color:var(--text3);font-family:var(--mono);">2Y</div>
              <div style="font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);">${t2 ? f2(t2.value) : '—'}</div>
              ${t2 ? chgBar(t2.chg1d, t2.chg5d) : ''}
            </div>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:8px;">
            ${indRow('10Y−2Y spread', cv?.value != null ? f2(cv.value) + '%' : '—')}
            <div style="margin-top:5px;">
              ${cv?.value != null ? chip(cv.value < 0 ? 'INVERTIDA' : 'POSITIVA', cv.value < 0 ? 'var(--red)' : 'var(--green)') : ''}
            </div>
          </div>
        </div>

        <!-- DFII10 -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">DFII10 — Real Yield TIPS</div>
          <div style="font-family:var(--serif);font-size:26px;font-weight:600;font-style:italic;line-height:1;color:${df ? (df.value > 0 ? 'var(--red)' : 'var(--green)') : 'var(--text3)'};margin-bottom:4px;">${df ? f2(df.value) + '%' : '—'}</div>
          ${df ? chgBar(df.chg1d, df.chg5d) : ''}
          <div style="margin-top:8px;">${df ? dfiiRegimeChip(df.regime) : ''}</div>
          <div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;">
            ${df ? indRow('Percentil', df.percentile != null ? df.percentile + '%' : '—', df.percentileWindow || '') : ''}
            ${df ? `<div style="margin-top:5px;">${freshnessChip(df.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:4px;">${df.ageDays}d · ${df.date}</span></div>` : ''}
          </div>
        </div>

        <!-- Tipo Real ex post -->
        <div class="mac-card">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Pol. Monetaria</div>
          ${seg.ffr ? `
            <div style="margin-bottom:8px;">
              <div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:2px;">Fed Funds Rate</div>
              <div style="font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;line-height:1;color:var(--text1);">${f2(seg.ffr.value)}%</div>
            </div>` : ''}
          ${co.tipoReal ? `
            <div style="margin-bottom:8px;border-top:1px solid var(--border);padding-top:8px;">
              <div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:2px;">Real ex post (FFR−CPI)</div>
              <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:${co.tipoReal.value > 0 ? 'var(--red)' : 'var(--green)'};">${f2(co.tipoReal.value)}%</div>
            </div>` : ''}
          ${co.cpi ? `
            <div style="border-top:1px solid var(--border);padding-top:8px;">
              ${indRow('CPI Headline', f1(co.cpi.value) + '%')}
              ${co.cpi.cpiCore != null ? indRow('CPI Core', f1(co.cpi.cpiCore) + '%') : ''}
            </div>` : ''}
        </div>
      </div>

      <!-- ── FILA 5: Alertas combinadas ── -->
      ${activeAlerts.length ? `
      <div class="mac-card" style="margin-bottom:14px;border-color:rgba(244,113,116,0.3);background:rgba(244,113,116,0.03);">
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--red);margin-bottom:8px;">⬤ Alertas activas (${activeAlerts.length})</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${activeAlerts.map(a => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:7px 10px;border-radius:6px;background:var(--surface2);border:1px solid var(--border);">
              <div style="flex-shrink:0;margin-top:2px;">${alertChip(a.severity)}</div>
              <div>
                <div style="font-size:10px;font-weight:600;color:var(--text1);margin-bottom:3px;">${a.label}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${a.triggers.join(' · ')}</div>
              </div>
              <div style="margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--text3);flex-shrink:0;">${a.date || ''}</div>
            </div>`).join('')}
        </div>
      </div>` : `
      <div class="mac-card" style="margin-bottom:14px;border-color:rgba(74,222,128,0.2);background:rgba(74,222,128,0.02);">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:10px;color:var(--green);">✓</span>
          <span style="font-size:10px;color:var(--text2);">Sin alertas activas — todos los sistemas en rango normal</span>
        </div>
      </div>`}

      <!-- ── FILA 6: Análisis IA ── -->
      <div class="mac-card" style="border-color:rgba(64,217,192,0.25);margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:var(--teal);">✦ Análisis Inteligente ETHAN</div>
            <div style="font-size:10px;color:var(--text3);margin-top:3px;">Interpretación automática con Claude · ETHAN v5c</div>
          </div>
          <button id="home-ai-btn-inner" class="btn btn-primary" style="white-space:nowrap;">✦ Generar análisis</button>
        </div>
        <div id="home-ai-box" style="min-height:48px;display:flex;align-items:center;">
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono);">Pulsa "Generar análisis" para obtener la interpretación IA de los datos actuales.</div>
        </div>
      </div>
    `;

    // Bind botón IA interno
    document.getElementById('home-ai-btn-inner')?.addEventListener('click', generateAI);
  }

  document.getElementById('home-refresh')?.addEventListener('click', () => load(true));
  document.getElementById('home-ai-btn')?.addEventListener('click', generateAI);
  await load(false);
  return { destroy() {} };
}
