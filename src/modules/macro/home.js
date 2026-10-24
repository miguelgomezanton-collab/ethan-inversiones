import { getMacroData } from './macro-data.js';

// ─── Utilidades ───────────────────────────────────────────────────────────────
const f1  = v => v != null ? Number(v).toFixed(1)  : '—';
const f2  = v => v != null ? Number(v).toFixed(2)  : '—';
const f3  = v => v != null ? Number(v).toFixed(3)  : '—';

// Color semántico CONTEXTUAL (no por signo matemático)
// direction: 'up-bad' = subida es mala (HY OAS, VIX), 'up-good' = subida es buena (precio, M2)
function chgColor(val, direction = 'up-good') {
  if (val == null) return 'var(--text3)';
  const bad = direction === 'up-bad' ? val > 0 : val < 0;
  if (Math.abs(val) < 0.001) return 'var(--text3)';
  return bad ? 'var(--red)' : 'var(--green)';
}

function chgArrow(val, direction = 'up-good') {
  if (val == null) return '';
  const bad = direction === 'up-bad' ? val > 0 : val < 0;
  if (Math.abs(val) < 0.001) return '→';
  return bad ? (val > 0 ? '↑' : '↓') : (val > 0 ? '↑' : '↓');
}

function chgSpan(val, unit = '', direction = 'up-good') {
  if (val == null) return `<span style="color:var(--text3);">—</span>`;
  const c = chgColor(val, direction);
  const arrow = val > 0 ? '↑' : val < 0 ? '↓' : '→';
  return `<span style="color:${c};font-family:var(--mono);font-size:10px;">${arrow}${val > 0 ? '+' : ''}${f2(val)}${unit}</span>`;
}

// Chip de estado
function chip(label, color, small = false) {
  const sz = small ? '7px' : '8px';
  return `<span style="display:inline-block;padding:2px 7px;border-radius:3px;font-family:var(--mono);font-size:${sz};font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:${color}22;color:${color};border:1px solid ${color}44;">${label}</span>`;
}

// Freshness dot
function freshDot(f) {
  const c = f === 'ok' ? 'var(--green)' : f === 'warn' ? 'var(--amber)' : f === 'stale' ? 'var(--red)' : 'var(--text3)';
  return `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${c};"></span>`;
}

// Colores de estado (5 niveles)
const STATE_COLORS = {
  normal:       'var(--green)',
  vigilancia:   'var(--teal)',
  tension:      'var(--amber)',
  estres:       'var(--red)',
  contango:     'var(--green)',
  'tension-creciente': 'var(--teal)',
  backwardation:'var(--amber)',
  'estres-severo': 'var(--red)',
  alcista:      'var(--green)',
  neutral:      'var(--amber)',
  bajista:      'var(--red)',
  restrictivo:  'var(--red)',
  'levemente-restrictivo': 'var(--amber)',
  acomodaticio: 'var(--green)',
};

function stateColor(s) { return STATE_COLORS[s] || 'var(--text3)'; }

// Etiqueta legible
const STATE_LABELS = {
  normal: 'NORMAL', vigilancia: 'VIGILANCIA', tension: 'TENSIÓN', estres: 'ESTRÉS',
  contango: 'CONTANGO', 'tension-creciente': 'TENSIÓN ↑', backwardation: 'BACKWRDTN', 'estres-severo': 'ESTRÉS',
  alcista: 'ALCISTA', neutral: 'NEUTRAL', bajista: 'BAJISTA',
  restrictivo: 'RESTRICTIVO', 'levemente-restrictivo': 'LEVE RESTR.', neutral_rate: 'NEUTRAL', acomodaticio: 'ACOMODATICIO',
};
function stateLabel(s) { return STATE_LABELS[s] || (s || '—').toUpperCase(); }

// ─── Canvas chart helpers ─────────────────────────────────────────────────────
// Dibuja una serie de puntos en un canvas 2D.
// series: [{vals: number[], color, width, dash}]
// hLines: [{y, color, dash, label}]
// bands: [{yMin, yMax, color}]
function drawChart(canvas, series, opts = {}) {
  const { hLines = [], bands = [], yMin: forceYMin, yMax: forceYMax, padding = { t: 12, r: 8, b: 20, l: 36 } } = opts;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const P = padding;
  const cW = W - P.l - P.r, cH = H - P.t - P.b;

  // Calcular rango Y
  let allVals = [];
  series.forEach(s => allVals.push(...(s.vals || []).filter(v => v != null)));
  if (!allVals.length) { ctx.clearRect(0, 0, W, H); return; }

  let yMin = forceYMin != null ? forceYMin : Math.min(...allVals);
  let yMax = forceYMax != null ? forceYMax : Math.max(...allVals);
  hLines.forEach(l => { yMin = Math.min(yMin, l.y); yMax = Math.max(yMax, l.y); });
  bands.forEach(b => { yMin = Math.min(yMin, b.yMin); yMax = Math.max(yMax, b.yMax); });
  const pad = (yMax - yMin) * 0.08;
  if (forceYMin == null) yMin -= pad;
  if (forceYMax == null) yMax += pad;
  if (yMin === yMax) { yMin -= 1; yMax += 1; }

  const toX = (i, n) => P.l + (i / (n - 1)) * cW;
  const toY = (v) => P.t + cH - ((v - yMin) / (yMax - yMin)) * cH;

  ctx.clearRect(0, 0, W, H);

  // Bands
  bands.forEach(b => {
    ctx.fillStyle = b.color;
    const bY1 = toY(b.yMax), bY2 = toY(b.yMin);
    ctx.fillRect(P.l, bY1, cW, bY2 - bY1);
  });

  // Y axis labels (3)
  ctx.fillStyle = 'rgba(180,180,180,0.5)';
  ctx.font = '8px monospace';
  ctx.textAlign = 'right';
  [yMin, (yMin + yMax) / 2, yMax].forEach(v => {
    const y = toY(v);
    ctx.fillStyle = 'rgba(160,160,160,0.4)';
    ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(W - P.r, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5; ctx.stroke();
    ctx.fillStyle = 'rgba(140,140,140,0.7)';
    ctx.fillText(v.toFixed(1), P.l - 2, y + 3);
  });

  // H-Lines
  hLines.forEach(l => {
    const y = toY(l.y);
    ctx.save();
    if (l.dash) ctx.setLineDash(l.dash);
    ctx.strokeStyle = l.color || 'rgba(255,255,255,0.3)';
    ctx.lineWidth = l.width || 1;
    ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(W - P.r, y); ctx.stroke();
    if (l.label) {
      ctx.fillStyle = l.color || 'rgba(255,255,255,0.5)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(l.label, P.l + 3, y - 2);
    }
    ctx.restore();
  });

  // Series
  series.forEach(s => {
    const vals = s.vals || [];
    const n = vals.length;
    if (n < 2) return;
    ctx.save();
    if (s.dash) ctx.setLineDash(s.dash);
    ctx.strokeStyle = s.color || 'rgba(255,255,255,0.8)';
    ctx.lineWidth = s.width || 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let started = false;
    vals.forEach((v, i) => {
      if (v == null) return;
      const x = toX(i, n), y = toY(v);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill bajo la línea principal
    if (s.fill) {
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = s.color || 'rgba(255,255,255,0.1)';
      ctx.lineTo(toX(n - 1, n), P.t + cH);
      ctx.lineTo(P.l, P.t + cH);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  });
}

// ─── Sparkline mini (sin ejes) ────────────────────────────────────────────────
function sparklineHTML(id, vals, color) {
  return `<canvas id="${id}" width="80" height="28" style="display:block;"></canvas>`;
}

function drawSparkline(canvas, vals, color = 'var(--teal)') {
  if (!canvas || !vals || vals.length < 2) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const clean = vals.filter(v => v != null);
  if (clean.length < 2) return;
  const mn = Math.min(...clean), mx = Math.max(...clean);
  const toX = (i) => (i / (vals.length - 1)) * W;
  const toY = (v) => H - ((v - mn) / (mx - mn || 1)) * H * 0.85 - H * 0.07;
  ctx.clearRect(0, 0, W, H);
  // Resolve CSS var to actual color for canvas
  const computedColor = color.startsWith('var(') ? '#40d9c0' : color;
  ctx.strokeStyle = computedColor;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let started = false;
  vals.forEach((v, i) => {
    if (v == null) return;
    const x = toX(i), y = toY(v);
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// ─── Prompt IA ────────────────────────────────────────────────────────────────
function buildPrompt(macro) {
  const co  = macro.coyuntura   || {};
  const liq = macro.liquidez    || {};
  const seg = macro.seguimiento || {};
  const cf  = macro.condicionesFinancieras || {};
  const mkt = macro.mercado     || {};
  const s   = macro.scoreTotal  ?? 0;
  const alerts = (macro.alerts || []).filter(a => a.severity === 'error' || a.severity === 'warn');
  const hy = liq.hyOas || {};
  const dxy = cf.dxy || {};
  const df = cf.dfii10 || {};
  const sp = mkt.sp500Trend || {};
  const vix = mkt.vix || {};
  const vtr = mkt.vixTermRatio || {};
  const cv = cf.t10y2y || seg.t10y2y || {};

  const L = (label, v, u = '') => v != null ? `- ${label}: ${typeof v === 'number' ? (v >= 0 ? '+' : '') + f2(v) : v}${u}` : null;

  const block = [
    `SCORE MACRO: ${s >= 0 ? '+' : ''}${s} / +15 → ${macro.zone || '—'}`,
    '',
    '## CRÉDITO',
    L('HY OAS', hy.value, '%'), hy.hyState ? `  → ${hy.hyState} (pct ${hy.percentile}% Z3y ${hy.zscore3y ?? '—'})` : null,
    L('Chg 1D', hy.chg1d, 'pp'), L('Chg 5D', hy.chg5d, 'pp'),
    '',
    '## VOLATILIDAD',
    vix.value != null ? `- VIX: ${f1(vix.value)}  MM200: ${f1(vix.mm200)}  ${vix.aboveMM200 ? 'sobre MM200 ⚠' : 'bajo MM200 ✓'}` : null,
    vtr.ratio != null ? `- Ratio VIX/VIX3M: ${f2(vtr.ratio)} → ${vtr.state}` : null,
    '',
    '## SP500 TENDENCIA',
    sp.monthly ? `- Mensual: ${sp.monthly.state}  M10: ${f2(sp.monthly.m10)}  slope: ${sp.monthly.slope}` : null,
    sp.weekly  ? `- Semanal: ${sp.weekly.state}   M10: ${f2(sp.weekly.m10)}   slope: ${sp.weekly.slope}`  : null,
    sp.daily   ? `- Diario:  ${sp.daily.state}    M10: ${f2(sp.daily.m10)}    slope: ${sp.daily.slope}`   : null,
    sp.summary ? `- Resumen: ${sp.summary}` : null,
    '',
    '## CONDICIONES FINANCIERAS',
    L('DXY', dxy.value), dxy.percentile != null ? `  → pct ${dxy.percentile}%` : null,
    L('Curva 10Y−2Y', cv.value, '%'),
    L('DFII10 Real Yield', df.value, '%'), df.regime ? `  → ${df.regime} (pct ${df.percentile}%)` : null,
    L('FFR', seg.ffr?.value, '%'),
    L('Tipo real ex post', co.tipoReal?.value, '%'),
    L('CPI Headline', co.cpi?.value, '%'), L('CPI Core', co.cpi?.cpiCore, '%'),
    '',
    '## LIQUIDEZ',
    L('M2 Global YoY', liq.m2?.value, '%'),
    L('Crédito vs GDP', liq.credito?.value, '%'),
    L('Impulso crediticio', liq.impulso?.value),
    '',
    '## ALERTAS', alerts.length ? alerts.map(a => `- [${a.severity}] ${a.label}: ${a.triggers.join(' / ')}`).join('\n') : '- Sin alertas',
  ].filter(v => v != null).join('\n');

  return `Eres ETHAN, sistema de análisis macroeconómico profesional. Datos actuales:

${block}

Genera un análisis ejecutivo en ESPAÑOL, exactamente 5 párrafos:
1. RÉGIMEN MACRO: ciclo actual, qué lo confirma
2. CRÉDITO Y VOLATILIDAD: tensión sistémica, HY OAS, VIX ratio
3. CONDICIONES MONETARIAS: tipo real TIPS, DXY, implicaciones
4. LIQUIDEZ Y MOMENTUM: M2, crédito, impulso
5. CONCLUSIÓN: 2-3 frases concretas de posicionamiento esta semana

Formato:
- Sin #, ##, ---, bullets
- Párrafos empiezan con TÍTULO EN MAYÚSCULAS seguido del texto
- **negrita** para conceptos clave
- Tono técnico directo, sin rodeos
- No repetir los números — interprétalos`;
}

async function callClaude(prompt) {
  const r = await fetch('/api/macro-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `HTTP ${r.status}`); }
  const d = await r.json();
  return d.text || '';
}

// ─── Render ───────────────────────────────────────────────────────────────────
export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `
    <button class="btn" id="home-ai-btn">✦ Análisis IA</button>
    <button class="btn btn-primary" id="home-refresh">↻ Actualizar</button>
  `;
  container.innerHTML = `<div id="home-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando...</div></div></div>`;

  let currentMacro = null;

  async function load(force = false) {
    try { const m = await getMacroData(force); currentMacro = m; paint(m); }
    catch (e) { document.getElementById('home-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`; }
  }

  async function generateAI() {
    if (!currentMacro) return;
    const btn = document.getElementById('home-ai-btn');
    const box = document.getElementById('home-ai-box');
    if (!box) return;
    btn.disabled = true; btn.textContent = '✦ Generando...';
    box.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="loader-ring"></div><span style="font-size:11px;color:var(--text3);font-family:var(--mono);">Analizando...</span></div>`;
    try {
      const text = await callClaude(buildPrompt(currentMacro));
      const html = text.replace(/^#{1,3}\s.*$/gm,'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').trim()
        .split(/\n\n+/).filter(p=>p.trim()).map(p=>`<p style="margin-bottom:10px;line-height:1.7;">${p.trim()}</p>`).join('');
      const s = currentMacro.scoreTotal;
      box.innerHTML = `
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--teal);margin-bottom:8px;">✦ ETHAN IA · ${new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})} · Score ${s>=0?'+':''}${s}/+15</div>
        <div style="font-size:12px;color:var(--text2);">${html}</div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);font-size:9px;color:var(--text3);font-family:var(--mono);">Generado con Claude · No constituye asesoramiento financiero</div>`;
    } catch(e) {
      box.innerHTML = `<div style="font-size:11px;color:var(--red);">⚠ ${e.message}</div>`;
    } finally { btn.disabled=false; btn.textContent='✦ Análisis IA'; }
  }

  // ─── PAINT ──────────────────────────────────────────────────────────────────
  function paint(macro) {
    const wrap = document.getElementById('home-wrap');
    const s    = macro.scoreTotal ?? 0;
    const z    = macro.zone || '—';
    const co   = macro.coyuntura   || {};
    const liq  = macro.liquidez    || {};
    const seg  = macro.seguimiento || {};
    const cf   = macro.condicionesFinancieras || {};
    const mkt  = macro.mercado     || {};

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
    const allAlerts   = macro.alerts || [];
    const activeAlerts = allAlerts.filter(a => a.severity === 'error' || a.severity === 'warn');

    // ── Dirección macro (¿mejorando o deteriorándose?) ──────────────────────
    // Basado en cambios 5D de indicadores clave
    let posDelta = 0, negDelta = 0;
    if (hy?.chg5d != null)  { hy.chg5d  > 0.05 ? negDelta++ : hy.chg5d  < -0.05 ? posDelta++ : 0; }
    if (vix?.chg5d != null) { vix.chg5d > 0.5  ? negDelta++ : vix.chg5d < -0.5  ? posDelta++ : 0; }
    if (dxy?.chg5d != null) { dxy.chg5d > 0.3  ? negDelta++ : dxy.chg5d < -0.3  ? posDelta++ : 0; }
    if (df?.chg5d  != null) { df.chg5d  > 0.05 ? negDelta++ : df.chg5d  < -0.05 ? posDelta++ : 0; } // DFII10 alta = restrictivo
    if (sp?.daily?.state === 'alcista') posDelta++; else if (sp?.daily?.state === 'bajista') negDelta++;

    const dir = negDelta > posDelta + 1 ? 'DETERIORO' : posDelta > negDelta + 1 ? 'MEJORA' : 'ESTABLE';
    const dirIcon = dir === 'DETERIORO' ? '↘' : dir === 'MEJORA' ? '↗' : '→';
    const dirColor = dir === 'DETERIORO' ? 'var(--red)' : dir === 'MEJORA' ? 'var(--green)' : 'var(--teal)';

    // Nivel general (peor de crédito/volatilidad)
    const hyLevel   = hy?.hyState  || 'normal';
    const vixLevel  = vix?.aboveMM200 ? 'tension' : 'normal';
    const stateRank = { normal: 0, vigilancia: 1, tension: 2, estres: 3 };
    const worstKey  = stateRank[hyLevel] >= stateRank[vixLevel] ? hyLevel : vixLevel;
    const levelColor = stateColor(worstKey);

    // ── Frase ejecutiva corta (2 líneas máx) ───────────────────────────────
    const parts = [];
    if (hy?.hyState && hy.hyState !== 'normal') parts.push(`Crédito HY en ${stateLabel(hy.hyState).toLowerCase()}`);
    else if (hy?.value != null) parts.push(`Crédito HY normalizado (${f2(hy.value)}%)`);
    if (vix?.aboveMM200) parts.push(`VIX sobre MM200`);
    if (sp?.monthly?.state) parts.push(`Tendencia mensual ${sp.monthly.state}`);
    if (sp?.daily?.state && sp?.daily?.state !== sp?.monthly?.state) parts.push(`diaria ${sp.daily.state}`);
    if (liq.m2?.score > 0) parts.push(`liquidez global expansiva`);
    const phrase = parts.length ? parts.join(', ') + '.' : 'Cargando diagnóstico…';
    const phraseCapital = phrase.charAt(0).toUpperCase() + phrase.slice(1);

    // ── "Qué cambió" (cambios materiales 5D) ───────────────────────────────
    const mejoras    = [];
    const deterioros = [];

    // HY OAS (subida = deterioro)
    if (hy?.chg5d != null && Math.abs(hy.chg5d) >= 0.05) {
      const entry = { label: 'HY OAS', val: hy.chg5d, unit: 'pp', horizon: '5D', direction: 'up-bad' };
      hy.chg5d > 0 ? deterioros.push(entry) : mejoras.push(entry);
    }
    // VIX (subida = deterioro)
    if (vix?.chg5d != null && Math.abs(vix.chg5d) >= 0.3) {
      const entry = { label: 'VIX', val: vix.chg5d, unit: '', horizon: '5D', direction: 'up-bad' };
      vix.chg5d > 0 ? deterioros.push(entry) : mejoras.push(entry);
    }
    // MM200 VIX (encima = alerta)
    if (vix?.aboveMM200 === true)  deterioros.push({ label: 'VIX', val: null, unit: '', horizon: 'actual', note: 'sobre MM200', direction: 'up-bad' });
    if (vix?.aboveMM200 === false) mejoras.push({ label: 'VIX', val: null, unit: '', horizon: 'actual', note: 'bajo MM200', direction: 'up-bad' });
    // DFII10 (subida = más restrictivo = deterioro para activos)
    if (df?.chg5d != null && Math.abs(df.chg5d) >= 0.05) {
      const entry = { label: 'DFII10 Real Yield', val: df.chg5d, unit: 'pp', horizon: '5D', direction: 'up-bad' };
      df.chg5d > 0 ? deterioros.push(entry) : mejoras.push(entry);
    }
    // DXY (subida generalmente negativa para activos; depende del contexto, aquí neutral)
    if (dxy?.chg5d != null && Math.abs(dxy.chg5d) >= 0.3) {
      const entry = { label: 'DXY', val: dxy.chg5d, unit: '', horizon: '5D', direction: 'up-bad' };
      dxy.chg5d > 0 ? deterioros.push(entry) : mejoras.push(entry);
    }
    // Curva (inversión = deterioro)
    if (cv?.value != null) {
      if (cv.value < 0)  deterioros.push({ label: 'Curva 10Y−2Y', val: null, note: `invertida (${f2(cv.value)}%)`, horizon: 'actual', direction: 'up-good' });
      else               mejoras.push({ label: 'Curva 10Y−2Y', val: null, note: `positiva (+${f2(cv.value)}%)`, horizon: 'actual', direction: 'up-good' });
    }
    // SP500 tendencia diaria
    if (sp?.daily?.state === 'bajista') deterioros.push({ label: 'SP500 diario', val: null, note: 'tendencia bajista', horizon: 'actual', direction: 'up-good' });
    if (sp?.daily?.state === 'alcista') mejoras.push({ label: 'SP500 diario', val: null, note: 'tendencia alcista', horizon: 'actual', direction: 'up-good' });
    // M2
    if (liq.m2?.score > 0) mejoras.push({ label: 'M2 Global', val: liq.m2.value, unit: '% YoY', horizon: 'actual', direction: 'up-good' });
    if (liq.m2?.score < 0) deterioros.push({ label: 'M2 Global', val: liq.m2.value, unit: '% YoY', horizon: 'actual', direction: 'up-good' });

    function changeEntry(e) {
      const c = e.direction === 'up-bad' ? (e.val > 0 ? 'var(--red)' : 'var(--green)') : (e.val > 0 ? 'var(--green)' : 'var(--red)');
      const arrow = e.val != null ? (e.val > 0 ? '↑' : '↓') : (e.direction === 'up-bad' ? '' : '');
      const mag   = e.val != null ? `${e.val > 0 ? '+' : ''}${f2(e.val)}${e.unit}` : '';
      const note  = e.note || '';
      return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border);">
        <span style="font-family:var(--mono);font-size:12px;color:${e.val == null ? 'var(--text3)' : c};">${arrow}</span>
        <span style="font-size:10px;color:var(--text2);flex:1;">${e.label}</span>
        <span style="font-family:var(--mono);font-size:10px;font-weight:600;color:${c};">${mag || note}</span>
        <span style="font-family:var(--mono);font-size:8px;color:var(--text3);">${e.horizon}</span>
      </div>`;
    }

    // ── HTML principal ──────────────────────────────────────────────────────
    wrap.innerHTML = `

      <!-- ══ 1. CABECERA EJECUTIVA ══ -->
      <div style="display:flex;align-items:center;gap:0;margin-bottom:${activeAlerts.length?'8':'14'}px;padding:12px 16px;background:var(--surface1);border:1px solid var(--border);border-radius:10px;flex-wrap:wrap;gap:10px;">

        <!-- Régimen + score -->
        <div style="display:flex;align-items:baseline;gap:10px;">
          <div style="font-family:var(--mono);font-size:13px;font-weight:800;letter-spacing:0.06em;color:var(--text1);">${z.toUpperCase()}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text3);">${s>=0?'+':''}${s}/+15</div>
        </div>

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Dirección -->
        <div style="font-family:var(--mono);font-size:11px;font-weight:700;color:${dirColor};">${dirIcon} ${dir} SEMANAL</div>

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Nivel general -->
        ${chip(stateLabel(worstKey), levelColor)}

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Alertas -->
        ${activeAlerts.length
          ? `<span style="font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red);">⬤ ${activeAlerts.length} ALERTA${activeAlerts.length>1?'S':''}</span>`
          : `<span style="font-family:var(--mono);font-size:10px;color:var(--green);">✓ SIN ALERTAS</span>`}

        <!-- Spacer -->
        <div style="flex:1;"></div>

        <!-- Timestamp -->
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">
          ${macro.updatedAt ? new Date(macro.updatedAt).toLocaleString('es-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}
        </div>
      </div>

      <!-- Frase ejecutiva -->
      <div style="margin-bottom:${activeAlerts.length?'8':'14'}px;padding:10px 16px;background:var(--surface1);border-left:3px solid ${levelColor};border-radius:0 6px 6px 0;font-size:12px;color:var(--text2);line-height:1.6;">${phraseCapital}</div>

      <!-- ══ 2. ALERTAS (si existen) ══ -->
      ${activeAlerts.length ? `
      <div style="margin-bottom:14px;display:flex;flex-direction:column;gap:6px;">
        ${activeAlerts.map(a => {
          const sc = a.severity === 'error' ? 'var(--red)' : a.severity === 'warn' ? 'var(--amber)' : 'var(--teal)';
          return `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;border-radius:8px;border:1px solid ${sc}44;background:${sc}0a;">
            <div style="flex-shrink:0;margin-top:1px;">${chip(a.severity === 'error' ? 'ESTRÉS' : 'VIGILANCIA', sc)}</div>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:700;color:var(--text1);margin-bottom:3px;">${a.label}</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${a.triggers.join(' · ')}</div>
            </div>
            ${a.date ? `<div style="font-family:var(--mono);font-size:8px;color:var(--text3);flex-shrink:0;">${a.date}</div>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- ══ 3. TRES TARJETAS VISUALES ══ -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">

        <!-- ─ A. HY OAS ─ -->
        <div class="mac-card" style="padding:14px;">
          <!-- Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div>
              <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);">Crédito · HY OAS</div>
              <div style="display:flex;align-items:baseline;gap:8px;margin-top:2px;">
                <span style="font-size:22px;font-weight:700;color:${hy ? stateColor(hy.hyState) : 'var(--text3)'};">${hy ? f2(hy.value) : '—'}<span style="font-size:11px;color:var(--text3);margin-left:2px;">%</span></span>
              </div>
              <div style="display:flex;gap:8px;margin-top:3px;">
                ${hy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(hy.chg1d,'up-bad')};">${hy.chg1d != null ? (hy.chg1d>0?'+':'')+f2(hy.chg1d) : '—'}pp <span style="color:var(--text3);">1D</span></span>` : ''}
                ${hy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(hy.chg5d,'up-bad')};">${hy.chg5d != null ? (hy.chg5d>0?'+':'')+f2(hy.chg5d) : '—'}pp <span style="color:var(--text3);">5D</span></span>` : ''}
              </div>
            </div>
            <div style="text-align:right;">
              ${hy ? chip(stateLabel(hy.hyState), stateColor(hy.hyState)) : ''}
              ${hy ? `<div style="margin-top:4px;">${freshDot(hy.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${hy.ageDays}d</span></div>` : ''}
            </div>
          </div>

          <!-- Selector rango -->
          <div style="display:flex;gap:4px;margin-bottom:6px;" id="hy-range-btns">
            ${['3M','1A','3A','Máx.'].map((r,i)=>`<button data-range="${r}" style="font-family:var(--mono);font-size:8px;padding:2px 6px;border-radius:3px;border:1px solid var(--border);background:${i===1?'var(--surface2)':'transparent'};color:${i===1?'var(--text1)':'var(--text3)'};cursor:pointer;" onclick="window._hyRange='${r}';window._hyRedraw&&window._hyRedraw();">${r}</button>`).join('')}
          </div>

          <!-- Canvas gráfico -->
          <canvas id="hy-chart" width="340" height="120" style="width:100%;height:120px;display:block;border-radius:4px;background:var(--surface2);"></canvas>

          <!-- Leyenda -->
          <div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:2px;background:var(--teal);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">HY OAS</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;background:var(--amber);border-top:1px dashed var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;background:rgba(255,255,255,0.4);border-top:1px dashed rgba(255,255,255,0.4);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span></div>
            <button id="hy-detail-btn" style="margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--teal);background:none;border:none;cursor:pointer;padding:0;">▾ Ver detalle</button>
          </div>

          <!-- Detalle oculto -->
          <div id="hy-detail" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
              ${hy ? [
                ['Percentil', hy.percentile != null ? hy.percentile + '%' : '—'],
                ['Z-score 3Y', hy.zscore3y != null ? f2(hy.zscore3y) : '—'],
                ['MM100', f2(hy.mm100)], ['MM200', f2(hy.mm200)],
                ['Obs.', hy.nObs || '—'], ['Desde', hy.dateFrom || '—'],
                ['Chg 20D', hy.chg20d != null ? (hy.chg20d>0?'+':'')+f2(hy.chg20d)+'pp' : '—'], ['Fecha', hy.date || '—'],
              ].map(([k,v]) => `<div style="font-size:9px;"><span style="color:var(--text3);font-family:var(--mono);">${k}: </span><span style="color:var(--text1);">${v}</span></div>`).join('') : ''}
            </div>
          </div>
        </div>

        <!-- ─ B. VOLATILIDAD ─ -->
        <div class="mac-card" style="padding:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div>
              <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);">Volatilidad · VIX</div>
              <div style="display:flex;align-items:baseline;gap:12px;margin-top:2px;">
                <div>
                  <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX</span>
                  <span style="font-size:22px;font-weight:700;color:${vix?.aboveMM200?'var(--red)':'var(--green)'};">${vix ? f1(vix.value) : '—'}</span>
                  ${vix ? `<div style="font-family:var(--mono);font-size:9px;color:${chgColor(vix.chg1d,'up-bad')};">${vix.chg1d!=null?(vix.chg1d>0?'+':'')+f2(vix.chg1d):''} <span style="color:var(--text3);">1D</span></div>` : ''}
                </div>
                <div>
                  <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M</span>
                  <span style="font-size:22px;font-weight:700;color:var(--text2);">${vix3 ? f1(vix3.value) : '—'}</span>
                  ${vix3 ? `<div style="font-family:var(--mono);font-size:9px;color:${chgColor(vix3.chg1d,'up-bad')};">${vix3.chg1d!=null?(vix3.chg1d>0?'+':'')+f2(vix3.chg1d):''} <span style="color:var(--text3);">1D</span></div>` : ''}
                </div>
              </div>
            </div>
            <div style="text-align:right;">
              ${vix ? chip(vix.aboveMM200?'SOBRE MM200':'BAJO MM200', vix.aboveMM200?'var(--red)':'var(--green)') : ''}
              ${vix ? `<div style="margin-top:4px;">${freshDot(vix.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${vix.ageDays}d</span></div>` : ''}
            </div>
          </div>

          <!-- Canvas VIX -->
          <canvas id="vix-chart" width="340" height="110" style="width:100%;height:110px;display:block;border-radius:4px;background:var(--surface2);"></canvas>

          <!-- Ratio medidor -->
          <div style="margin-top:8px;padding:8px;background:var(--surface2);border-radius:6px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">VIX / VIX3M</span>
              <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${vtr ? stateColor(vtr.state) : 'var(--text3)'};">${vtr ? f3(vtr.ratio) : '—'}</span>
              ${vtr ? chip(stateLabel(vtr.state), stateColor(vtr.state), true) : ''}
            </div>
            <!-- Barra ratio 0.75 - 1.25 -->
            <div style="position:relative;height:6px;background:linear-gradient(to right, var(--green) 0%, var(--teal) 20%, var(--amber) 50%, var(--red) 80%);border-radius:3px;overflow:hidden;">
              ${vtr ? `<div style="position:absolute;top:-1px;width:3px;height:8px;background:white;border-radius:1px;left:${Math.max(0,Math.min(100,((vtr.ratio-0.75)/0.5)*100))}%;transform:translateX(-50%);"></div>` : ''}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:2px;">
              <span style="font-family:var(--mono);font-size:7px;color:var(--text3);">0.75</span>
              <span style="font-family:var(--mono);font-size:7px;color:var(--text3);">1.00</span>
              <span style="font-family:var(--mono);font-size:7px;color:var(--text3);">1.25</span>
            </div>
          </div>

          <!-- Leyenda -->
          <div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:2px;background:var(--red);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;background:var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;border-top:1px dashed rgba(255,255,255,0.3);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span></div>
          </div>
        </div>

        <!-- ─ C. SP500 TENDENCIA ─ -->
        <div class="mac-card" style="padding:14px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">S&P 500 · Tendencia M10</div>

          <!-- Semáforo 3 timeframes -->
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            ${['monthly','weekly','daily'].map((tf, i) => {
              const label = ['MENSUAL','SEMANAL','DIARIO'][i];
              const d = sp?.[tf];
              const sc = stateColor(d?.state);
              return `<div style="flex:1;text-align:center;padding:6px;border-radius:6px;background:${sc}15;border:1px solid ${sc}33;">
                <div style="font-family:var(--mono);font-size:7px;color:var(--text3);margin-bottom:3px;">${label}</div>
                <div style="width:10px;height:10px;border-radius:50%;background:${sc};margin:0 auto 3px;"></div>
                <div style="font-family:var(--mono);font-size:8px;font-weight:700;color:${sc};">${d ? stateLabel(d.state) : '—'}</div>
              </div>`;
            }).join('')}
          </div>

          <!-- 3 minigráficos -->
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${['monthly','weekly','daily'].map((tf, i) => {
              const label = ['Mensual','Semanal','Diario'][i];
              const d = sp?.[tf];
              if (!d) return '';
              const sc = stateColor(d.state);
              const distPct = d.price && d.m10 ? (((d.price - d.m10) / d.m10) * 100).toFixed(1) : null;
              const slopeIcon = d.slope === 'up' ? '↑' : d.slope === 'down' ? '↓' : '→';
              return `<div style="background:var(--surface2);border-radius:6px;padding:6px 8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                  <span style="font-family:var(--mono);font-size:9px;color:var(--text2);">${label}</span>
                  <div style="display:flex;gap:6px;align-items:center;">
                    <span style="font-family:var(--mono);font-size:9px;color:var(--text1);">P: ${f2(d.price)}</span>
                    <span style="font-family:var(--mono);font-size:9px;color:${sc};">M10: ${f2(d.m10)} ${slopeIcon}</span>
                    ${distPct != null ? `<span style="font-family:var(--mono);font-size:8px;color:${parseFloat(distPct)>0?'var(--green)':'var(--red)'};">${parseFloat(distPct)>0?'+':''}${distPct}%</span>` : ''}
                  </div>
                </div>
                <canvas id="sp-${tf}-chart" width="300" height="36" style="width:100%;height:36px;display:block;border-radius:3px;"></canvas>
              </div>`;
            }).filter(Boolean).join('')}
          </div>

          ${sp?.summary ? `<div style="margin-top:8px;font-size:9px;color:var(--text2);line-height:1.5;font-style:italic;">${sp.summary}</div>` : ''}
        </div>
      </div>

      <!-- ══ 4. BANDA CONDICIONES FINANCIERAS ══ -->
      <div class="mac-card" style="padding:12px 16px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">Condiciones Financieras</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">

          <!-- DXY -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">DXY — Dólar</div>
            <div style="font-size:18px;font-weight:700;color:var(--text1);margin-bottom:1px;">${dxy ? f2(dxy.value) : '—'}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${dxy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(dxy.chg5d,'up-bad')};">${dxy.chg5d!=null?(dxy.chg5d>0?'+':'')+f2(dxy.chg5d):''} <span style="color:var(--text3);">5D</span></span>` : ''}
              ${dxy?.percentile != null ? `<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">p${dxy.percentile}</span>` : ''}
            </div>
            <canvas id="sp-dxy-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- Curva -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Curva 10Y−2Y</div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:1px;">
              <span style="font-size:18px;font-weight:700;color:${cv?.value != null ? (cv.value >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--text3)'};">${cv?.value != null ? (cv.value>=0?'+':'')+f2(cv.value)+'%' : '—'}</span>
              ${cv?.value != null ? chip(cv.value >= 0 ? 'POSITIVA' : 'INVERTIDA', cv.value >= 0 ? 'var(--green)' : 'var(--red)', true) : ''}
            </div>
            <div style="display:flex;gap:6px;margin-bottom:4px;">
              ${t10 ? `<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">10Y: <span style="color:var(--text1);">${f2(t10.value)}%</span></span>` : ''}
              ${t2  ? `<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">2Y: <span style="color:var(--text1);">${f2(t2.value)}%</span></span>`  : ''}
            </div>
            <canvas id="sp-cv-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- DFII10 -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Tipo Real 10Y · DFII10</div>
            <div style="font-size:18px;font-weight:700;color:${df ? (df.value > 0 ? 'var(--red)' : 'var(--green)') : 'var(--text3)'};margin-bottom:1px;">${df ? f2(df.value)+'%' : '—'}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${df ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(df.chg5d,'up-bad')};">${df.chg5d!=null?(df.chg5d>0?'+':'')+f2(df.chg5d)+'pp':''} <span style="color:var(--text3);">5D</span></span>` : ''}
              ${df?.regime ? chip(stateLabel(df.regime), stateColor(df.regime), true) : ''}
            </div>
            <canvas id="sp-df-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- Pol Monetaria -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Pol. Monetaria</div>
            <div style="font-size:18px;font-weight:700;color:var(--text1);margin-bottom:1px;">${seg.ffr?.value != null ? f2(seg.ffr.value)+'%' : '—'} <span style="font-size:10px;color:var(--text3);">FFR</span></div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${co.tipoReal?.value != null ? `<span style="font-family:var(--mono);font-size:9px;color:var(--text3);">Real ex post: <span style="color:${co.tipoReal.value > 0 ? 'var(--red)' : 'var(--green)'};">${f2(co.tipoReal.value)}%</span></span>` : ''}
            </div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);">
              ${co.cpi?.value != null ? `CPI: ${f1(co.cpi.value)}%` : ''}
              ${co.cpi?.cpiCore != null ? ` · Core: ${f1(co.cpi.cpiCore)}%` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 5. QUÉ CAMBIÓ ══ -->
      ${(mejoras.length || deterioros.length) ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <div class="mac-card" style="padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:14px;color:var(--green);">↑</span>
            <span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--green);">Mejora</span>
          </div>
          ${mejoras.length ? mejoras.map(changeEntry).join('') : `<div style="font-size:10px;color:var(--text3);">Sin mejoras materiales esta semana.</div>`}
        </div>
        <div class="mac-card" style="padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:14px;color:var(--red);">↓</span>
            <span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);">Deterioro</span>
          </div>
          ${deterioros.length ? deterioros.map(changeEntry).join('') : `<div style="font-size:10px;color:var(--text3);">Sin deterioros materiales esta semana.</div>`}
        </div>
      </div>` : ''}

      <!-- ══ 6. ANÁLISIS IA ══ -->
      <div class="mac-card" style="border-color:rgba(64,217,192,0.25);margin-bottom:14px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--teal);">✦ Análisis ETHAN IA</div>
            <div style="font-size:10px;color:var(--text3);margin-top:2px;">Interpretación automática · ETHAN v5c</div>
          </div>
          <button id="home-ai-btn-inner" class="btn btn-primary" style="white-space:nowrap;font-size:11px;">✦ Generar análisis</button>
        </div>
        <div id="home-ai-box" style="min-height:44px;display:flex;align-items:center;">
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono);">Pulsa "Generar análisis" para obtener la interpretación IA.</div>
        </div>
      </div>
    `;

    // ── Dibujar gráficos tras render del DOM ─────────────────────────────────
    requestAnimationFrame(() => {
      // HY OAS chart
      const hyCanvas = document.getElementById('hy-chart');
      if (hyCanvas && hy) {
        const hyBands = [
          { yMin: 6,   yMax: 99,  color: 'rgba(244,113,116,0.06)' }, // estrés
          { yMin: 4.5, yMax: 6,   color: 'rgba(251,191,36,0.06)'  }, // tensión
          { yMin: 3.5, yMax: 4.5, color: 'rgba(64,217,192,0.04)'  }, // vigilancia
          { yMin: 0,   yMax: 3.5, color: 'rgba(74,222,128,0.04)'  }, // normal
        ];
        // Construir series desde los últimos N obs (usamos history si existe, sino mockeo con value+mm)
        const nObs = 252; // 1 año por defecto
        const hyVals  = Array(nObs).fill(null); hyVals[nObs-1] = hy.value;
        if (hy.chg1d != null && nObs > 1)  hyVals[nObs-2] = hy.value - hy.chg1d;
        if (hy.chg5d != null && nObs > 5)  hyVals[nObs-6] = hy.value - hy.chg5d;
        if (hy.chg20d != null && nObs > 20) hyVals[nObs-21] = hy.value - hy.chg20d;

        // Interpolación lineal simple entre puntos conocidos
        function interp(arr) {
          const out = [...arr];
          let lastKnown = null, lastIdx = -1;
          for (let i = 0; i < out.length; i++) {
            if (out[i] != null) {
              if (lastKnown != null && i - lastIdx > 1) {
                for (let j = lastIdx + 1; j < i; j++) {
                  out[j] = lastKnown + (out[i] - lastKnown) * ((j - lastIdx) / (i - lastIdx));
                }
              }
              lastKnown = out[i]; lastIdx = i;
            }
          }
          // rellenar inicio si aún null
          for (let i = 0; i < out.length; i++) { if (out[i] == null) out[i] = out.find(v=>v!=null) || 0; else break; }
          return out;
        }

        const hyInterp = interp(hyVals);
        // MM aproximadas (constante de snapshot)
        const mm100Vals = Array(nObs).fill(hy.mm100);
        const mm200Vals = Array(nObs).fill(hy.mm200);

        drawChart(hyCanvas, [
          { vals: hyInterp,  color: '#40d9c0', width: 2, fill: true },
          { vals: mm100Vals, color: '#fbbf24', width: 1, dash: [4,3] },
          { vals: mm200Vals, color: 'rgba(255,255,255,0.35)', width: 1, dash: [2,4] },
        ], { bands: hyBands, yMin: 0 });

        // Range switcher
        window._hyRange = '1A';
        window._hyRedraw = () => {
          document.querySelectorAll('#hy-range-btns button').forEach(b => {
            const active = b.dataset.range === window._hyRange;
            b.style.background = active ? 'var(--surface2)' : 'transparent';
            b.style.color = active ? 'var(--text1)' : 'var(--text3)';
          });
          // (En producción: refetch slice histórico)
        };
      }

      // VIX chart
      const vixCanvas = document.getElementById('vix-chart');
      if (vixCanvas && vix) {
        const n = 252;
        const vixVals  = Array(n).fill(null); vixVals[n-1]  = vix.value;
        if (vix.chg1d != null)  vixVals[n-2]  = vix.value - vix.chg1d;
        if (vix.chg5d != null)  vixVals[n-6]  = vix.value - vix.chg5d;
        if (vix.chg20d != null) vixVals[n-21] = vix.value - vix.chg20d;
        const vix3Vals = Array(n).fill(null);
        if (vix3) {
          vix3Vals[n-1] = vix3.value;
          if (vix3.chg1d != null) vix3Vals[n-2] = vix3.value - vix3.chg1d;
          if (vix3.chg5d != null) vix3Vals[n-6] = vix3.value - vix3.chg5d;
        }
        function interp2(arr) {
          const out = [...arr];
          const known = out.map((v,i)=>v!=null?i:-1).filter(i=>i>=0);
          for (let k = 0; k < known.length-1; k++) {
            const i0=known[k], i1=known[k+1];
            for (let i=i0+1;i<i1;i++) out[i]=out[i0]+(out[i1]-out[i0])*((i-i0)/(i1-i0));
          }
          for (let i=0;i<out.length;i++){if(out[i]==null)out[i]=out.find(v=>v!=null)||15;else break;}
          return out;
        }
        const mm200Vals = Array(n).fill(vix.mm200);
        drawChart(vixCanvas, [
          { vals: interp2(vixVals),  color: '#f47174', width: 2 },
          { vals: vix3 ? interp2(vix3Vals) : [], color: '#fbbf24', width: 1.5, dash: [4,3] },
          { vals: mm200Vals, color: 'rgba(255,255,255,0.3)', width: 1, dash: [2,4] },
        ], {
          hLines: [
            { y: 20, color: 'rgba(251,191,36,0.5)', dash: [3,3], label: '20', width: 0.8 },
            { y: 30, color: 'rgba(244,113,116,0.5)', dash: [3,3], label: '30', width: 0.8 },
          ],
          yMin: 0,
        });
      }

      // SP500 mini-charts (sparklines por timeframe)
      ['monthly','weekly','daily'].forEach(tf => {
        const c = document.getElementById(`sp-${tf}-chart`);
        if (!c || !sp?.[tf]) return;
        const d = sp[tf];
        // Construir mini sparkline precio vs M10
        const n = 20;
        const priceVals = Array(n).fill(null); priceVals[n-1] = d.price;
        const m10Vals   = Array(n).fill(d.m10);
        const color = d.state === 'alcista' ? '#4ade80' : d.state === 'bajista' ? '#f47174' : '#fbbf24';
        drawChart(c, [
          { vals: priceVals, color, width: 1.5 },
          { vals: m10Vals, color: 'rgba(255,255,255,0.3)', width: 1, dash: [2,3] },
        ], { padding: { t: 4, r: 4, b: 4, l: 4 }, yMin: undefined, yMax: undefined });
      });

      // Sparklines condiciones financieras (usando chg1d/5d/20d para construir mini serie)
      function buildSpark(cur, chg1, chg5, chg20) {
        if (cur == null) return [];
        const vals = [null, null, null, null, null];
        vals[4] = cur;
        if (chg1  != null) vals[3] = cur - chg1;
        if (chg5  != null) vals[1] = cur - chg5;
        if (chg20 != null) vals[0] = cur - chg20;
        // interp simple
        const out = [...vals];
        for (let i = 0; i < out.length; i++) {
          if (out[i] == null) {
            const prev = out.slice(0,i).reverse().find(v=>v!=null);
            const next = out.slice(i+1).find(v=>v!=null);
            if (prev != null && next != null) out[i] = (prev+next)/2;
            else if (prev != null) out[i] = prev;
            else if (next != null) out[i] = next;
          }
        }
        return out;
      }

      const dxyS = document.getElementById('sp-dxy-spark');
      if (dxyS && dxy) {
        const vals = buildSpark(dxy.value, dxy.chg1d, dxy.chg5d, dxy.chg20d);
        drawSparkline(dxyS, vals, '#40d9c0');
      }
      const cvS = document.getElementById('sp-cv-spark');
      if (cvS && cv?.value != null) {
        // Para la curva usamos t10 y t2 chg acumulado como proxy
        const vals = buildSpark(cv.value, null, null, null);
        drawSparkline(cvS, vals, cv.value >= 0 ? '#4ade80' : '#f47174');
      }
      const dfS = document.getElementById('sp-df-spark');
      if (dfS && df) {
        const vals = buildSpark(df.value, df.chg1d, df.chg5d, df.chg20d);
        drawSparkline(dfS, vals, df.value > 0 ? '#f47174' : '#4ade80');
      }
    });

    // Botón detalle HY
    document.getElementById('hy-detail-btn')?.addEventListener('click', () => {
      const d = document.getElementById('hy-detail');
      const btn = document.getElementById('hy-detail-btn');
      if (d) { d.style.display = d.style.display === 'none' ? 'block' : 'none'; btn.textContent = d.style.display === 'none' ? '▾ Ver detalle' : '▴ Ocultar'; }
    });

    // Bind botón IA
    document.getElementById('home-ai-btn-inner')?.addEventListener('click', generateAI);
  }

  document.getElementById('home-refresh')?.addEventListener('click', () => load(true));
  document.getElementById('home-ai-btn')?.addEventListener('click', generateAI);
  await load(false);
  return { destroy() {} };
}
