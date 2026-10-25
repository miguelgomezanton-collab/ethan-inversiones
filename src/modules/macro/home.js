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

// ─── Canvas chart: gráfico financiero de líneas con eje X temporal real ──────
//
// seriesData: Array de { dates: string[], vals: number[], color, width, dash, fill, label }
//   - dates: ISO strings 'YYYY-MM-DD' ordenados ASC (mismo length que vals)
//   - vals: valores numéricos (null = hueco, no se dibuja ni se une)
// opts: {
//   hLines: [{y, color, dash, label, width}],
//   bands:  [{yMin, yMax, color}],
//   xRange: { fromDate: 'YYYY-MM-DD', toDate: 'YYYY-MM-DD' },   // filtro de rango
//   padding: { t, r, b, l },
//   GAP_DAYS: número de días para considerar hueco temporal (no unir)
// }
//
// VALIDACIÓN OBLIGATORIA (ejecutada internamente antes de dibujar):
//   1. Filtra valores no finitos y no numéricos
//   2. Verifica que valores < 50 (evita mezclar pb con %)
//   3. Auto escala Y: margen 10% sobre min y max visible
//   4. Si < 2 pts válidos → muestra "INSUFFICIENT DATA"
//   5. No une segmentos con hueco > GAP_DAYS días

// ─── Helpers de formato de fecha para eje X ──────────────────────────────────
const _MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function _fmtXLabel(ms, spanDays) {
  const d = new Date(ms);
  const yy = String(d.getUTCFullYear()).slice(2);
  const mon = _MESES_CORTO[d.getUTCMonth()];
  const day = d.getUTCDate();
  if (spanDays <= 100)       return `${day} ${mon}`;           // 3M  → "15 ene"
  if (spanDays <= 400)       return `${day} ${mon}`;           // 1A  → "1 feb"
  if (spanDays <= 1200)      return `${mon} ${yy}`;            // 3A  → "ene 26"
  return String(d.getUTCFullYear());                            // Máx → "2024"
}

// Genera los ms de los ticks principales para el eje X, adaptados al rango
function _xTicks(xMin, xMax, targetN) {
  const spanMs   = xMax - xMin;
  const spanDays = spanMs / 86400000;

  // Candidatos de intervalo (en ms): semana, 2sem, mes, 2mes, 3mes, 6mes, año, 2años, 5años
  const candidates = [
    7, 14, 30, 60, 91, 182, 365, 730, 1825
  ].map(d => d * 86400000);

  // Elegir intervalo que produzca ~targetN ticks
  let best = candidates[candidates.length - 1];
  for (const iv of candidates) {
    if (spanMs / iv <= targetN + 2) { best = iv; break; }
  }

  // Alinear al inicio de unidad natural (mes, semana, año)
  const ticks = [];
  const d0 = new Date(xMin);

  let cursor;
  if (best >= 365 * 86400000) {
    // Alinear a 1 enero
    cursor = Date.UTC(d0.getUTCFullYear(), 0, 1);
    if (cursor < xMin) cursor = Date.UTC(d0.getUTCFullYear() + 1, 0, 1);
  } else if (best >= 28 * 86400000) {
    // Alinear a primer día del mes
    cursor = Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), 1);
    if (cursor < xMin) {
      const nm = d0.getUTCMonth() + 1;
      cursor = Date.UTC(d0.getUTCFullYear() + Math.floor(nm / 12), nm % 12, 1);
    }
  } else {
    // Alinear a lunes
    const dow = d0.getUTCDay(); // 0=dom
    const daysToMon = (dow === 0 ? 1 : (8 - dow) % 7 || 7);
    cursor = xMin + daysToMon * 86400000;
    cursor = Math.floor(cursor / (7 * 86400000)) * (7 * 86400000);
    if (cursor < xMin) cursor += 7 * 86400000;
  }

  // Avanzar según step (meses o ms fijo)
  const stepMonths = best >= 28 * 86400000 ? Math.round(best / (30.44 * 86400000)) : 0;

  let safety = 0;
  while (cursor <= xMax && safety++ < 100) {
    if (cursor >= xMin) ticks.push(cursor);
    if (stepMonths > 0) {
      const td = new Date(cursor);
      const nm = td.getUTCMonth() + stepMonths;
      cursor = Date.UTC(td.getUTCFullYear() + Math.floor(nm / 12), nm % 12, 1);
    } else {
      cursor += best;
    }
  }

  return { ticks, spanDays };
}

function drawLineChart(canvas, seriesData, opts = {}) {
  const {
    hLines = [], bands = [],
    xRange = null,
    padding = { t: 14, r: 10, b: 28, l: 46 },
    GAP_DAYS = 10,
    unitMaxValue = 50,  // valores > esto se rechazan (evita mezclar pb con %)
  } = opts;

  const ctx = canvas.getContext('2d');
  const W   = canvas.width, H = canvas.height;
  const P   = padding;
  const cW  = W - P.l - P.r;
  const cH  = H - P.t - P.b;

  // Número de ticks X según ancho del canvas (móvil vs desktop)
  const targetTicks = cW < 400 ? 5 : 10;

  // Función de dibujado base (sin crosshair) — se llama al montar y en cada repaint
  function _drawStatic(crosshairX = null) {
    ctx.clearRect(0, 0, W, H);

    // ── 1. Validar y preparar series ────────────────────────────────────────
    const prepared = seriesData.map(s => {
      const dates = s.dates || [];
      const rawVals = s.vals || [];
      const pts = [];
      for (let i = 0; i < Math.min(dates.length, rawVals.length); i++) {
        if (rawVals[i] == null) continue;
        const d = String(dates[i]).slice(0, 10);
        const v = Number(rawVals[i]);
        if (!isFinite(v) || isNaN(v)) continue;
        if (unitMaxValue != null && v > unitMaxValue) continue;
        pts.push({ d, v, ms: new Date(d).getTime() });
      }
      pts.sort((a, b) => a.ms - b.ms);
      return { ...s, pts };
    });

    // ── 2. Filtrar por xRange ──────────────────────────────────────────────
    let fromMs = -Infinity, toMs = Infinity;
    if (xRange?.fromDate) fromMs = new Date(xRange.fromDate).getTime();
    if (xRange?.toDate)   toMs   = new Date(xRange.toDate).getTime();

    const filtered = prepared.map(s => ({
      ...s,
      pts: s.pts.filter(p => p.ms >= fromMs && p.ms <= toMs),
    }));

    // ── 3. Rango X global ──────────────────────────────────────────────────
    const allMs = filtered.flatMap(s => s.pts.map(p => p.ms));
    if (allMs.length === 0) {
      ctx.fillStyle = 'rgba(140,140,140,0.5)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('INSUFFICIENT DATA', W / 2, H / 2);
      return null;
    }
    const xMin = Math.min(...allMs), xMax = Math.max(...allMs);
    const xSpan = xMax - xMin || 1;

    // ── 4. Rango Y ────────────────────────────────────────────────────────
    const allVis = filtered.flatMap(s => s.pts.map(p => p.v));
    const hLineVals = hLines.map(l => l.y).filter(v => isFinite(v));
    const allForScale = [...allVis, ...hLineVals];
    if (allForScale.length === 0) return null;

    let yMin = Math.min(...allForScale);
    let yMax = Math.max(...allForScale);
    const ySpan = yMax - yMin || 1;
    const yPad  = ySpan * 0.10;
    yMin -= yPad;
    yMax += yPad;

    // ── 5. Proyección ─────────────────────────────────────────────────────
    const toX = ms => P.l + ((ms - xMin) / xSpan) * cW;
    const toY = v  => P.t + cH - ((v - yMin) / (yMax - yMin)) * cH;

    // ── 6. Bandas ─────────────────────────────────────────────────────────
    bands.forEach(b => {
      const by1 = Math.max(P.t, toY(Math.min(b.yMax, yMax)));
      const by2 = Math.min(P.t + cH, toY(Math.max(b.yMin, yMin)));
      if (by2 > by1) { ctx.fillStyle = b.color; ctx.fillRect(P.l, by1, cW, by2 - by1); }
    });

    // ── 7. Ticks X — calcular posiciones ──────────────────────────────────
    const { ticks: rawTicks, spanDays } = _xTicks(xMin, xMax, targetTicks);

    // Siempre incluir primer y último punto; filtrar los que caen fuera
    const ticksMs = [...new Set([xMin, ...rawTicks.filter(t => t > xMin && t < xMax), xMax])];

    // Calcular labels y posiciones X
    const FONT_SIZE = 8;
    ctx.font = `${FONT_SIZE}px monospace`;
    const labelW = ctx.measureText('ene 26 ').width; // ancho de referencia

    // Anti-solapamiento: eliminar ticks demasiado cercanos excepto el primero y el último
    const kept = [];
    for (let i = 0; i < ticksMs.length; i++) {
      const x = toX(ticksMs[i]);
      if (i === 0 || i === ticksMs.length - 1) { kept.push(ticksMs[i]); continue; }
      const prevX = toX(kept[kept.length - 1]);
      const nextX = toX(ticksMs[ticksMs.length - 1]);
      if (x - prevX >= labelW * 1.5 && nextX - x >= labelW * 1.5) kept.push(ticksMs[i]);
    }

    // ── 8. Grid vertical X (tenue) + Labels eje X ─────────────────────────
    ctx.setLineDash([]);
    kept.forEach((ms, i) => {
      const x = toX(ms);
      // Grid vertical
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, P.t); ctx.lineTo(x, P.t + cH); ctx.stroke();

      // Label
      const label = _fmtXLabel(ms, spanDays);
      ctx.fillStyle = 'rgba(140,140,140,0.65)';
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = 'top';
      const align = i === 0 ? 'left' : i === kept.length - 1 ? 'right' : 'center';
      ctx.textAlign = align;
      ctx.fillText(label, x, P.t + cH + 4);
    });

    // ── 9. Grid Y (4 líneas) ──────────────────────────────────────────────
    const nGrid = 4;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = `${FONT_SIZE}px monospace`;
    for (let i = 0; i <= nGrid; i++) {
      const v = yMin + (yMax - yMin) * (i / nGrid);
      const y = toY(v);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(W - P.r, y); ctx.stroke();
      ctx.fillStyle = 'rgba(140,140,140,0.65)';
      ctx.fillText(v.toFixed(2), P.l - 3, y);
    }

    // ── 10. H-Lines ───────────────────────────────────────────────────────
    hLines.forEach(l => {
      if (!isFinite(l.y)) return;
      const y = toY(l.y);
      ctx.save();
      ctx.setLineDash(l.dash || [3, 3]);
      ctx.strokeStyle = l.color || 'rgba(255,255,255,0.3)';
      ctx.lineWidth   = l.width || 0.8;
      ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(W - P.r, y); ctx.stroke();
      if (l.label) {
        ctx.fillStyle = l.color || 'rgba(255,255,255,0.4)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(l.label, P.l + 3, y - 1);
      }
      ctx.restore();
    });

    // ── 11. Dibujar series ────────────────────────────────────────────────
    const GAP_MS = GAP_DAYS * 86400000;
    filtered.forEach(s => {
      const pts = s.pts;
      if (pts.length < 2) return;
      ctx.save();
      ctx.setLineDash(s.dash || []);
      ctx.strokeStyle = s.color || 'rgba(255,255,255,0.8)';
      ctx.lineWidth   = s.width || 1.5;
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';
      ctx.beginPath();
      let penDown = false;
      const fillPts = [];
      for (let i = 0; i < pts.length; i++) {
        const { ms, v } = pts[i];
        const x = toX(ms), y = toY(v);
        const gap = i > 0 && (ms - pts[i-1].ms) > GAP_MS;
        if (!penDown || gap) { ctx.moveTo(x, y); penDown = true; }
        else ctx.lineTo(x, y);
        if (s.fill) fillPts.push({ x, y });
      }
      ctx.stroke();
      if (s.fill && fillPts.length >= 2) {
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = s.color || 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.moveTo(fillPts[0].x, fillPts[0].y);
        fillPts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(fillPts[fillPts.length - 1].x, P.t + cH);
        ctx.lineTo(fillPts[0].x, P.t + cH);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    });

    // ── 12. Crosshair ─────────────────────────────────────────────────────
    if (crosshairX !== null) {
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(crosshairX, P.t);
      ctx.lineTo(crosshairX, P.t + cH);
      ctx.stroke();
      ctx.restore();
    }

    return { filtered, toX, toY, xMin, xMax, xSpan, yMin, yMax, spanDays };
  }

  // Primer dibujado
  let _state = _drawStatic(null);

  // ── Crosshair y tooltip via mousemove ─────────────────────────────────────
  // Eliminar listeners anteriores (por si se redibujan)
  if (canvas._chartCleanup) canvas._chartCleanup();

  if (!_state) return; // sin datos, no montar listeners

  // Tooltip DOM (uno reutilizable por canvas)
  let _tt = canvas._tooltip;
  if (!_tt) {
    _tt = document.createElement('div');
    _tt.style.cssText = [
      'position:absolute;pointer-events:none;z-index:200',
      'background:rgba(18,22,30,0.93)',
      'border:1px solid rgba(255,255,255,0.13)',
      'border-radius:5px',
      'padding:5px 9px',
      'font-family:monospace',
      'font-size:10px',
      'color:#d4d4d8',
      'white-space:nowrap',
      'display:none',
      'box-shadow:0 2px 8px rgba(0,0,0,0.5)',
    ].join(';');
    // Insertar junto al canvas (necesita padre con position:relative)
    const parent = canvas.parentElement;
    if (parent) {
      if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
      parent.appendChild(_tt);
    }
    canvas._tooltip = _tt;
  }

  function _onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const cx = (e.clientX - rect.left) * scaleX;
    if (cx < P.l || cx > P.l + cW) { _tt.style.display = 'none'; _drawStatic(null); return; }

    _drawStatic(cx);

    // Fecha del cursor
    const { xMin, xMax, xSpan, filtered, spanDays } = _state || {};
    if (!filtered) return;
    const hoverMs = xMin + ((cx - P.l) / cW) * xSpan;
    const hoverDate = new Date(hoverMs);
    const isoDate = hoverDate.toISOString().slice(0, 10);
    const dayStr  = `${hoverDate.getUTCDate()} ${_MESES_CORTO[hoverDate.getUTCMonth()]} ${hoverDate.getUTCFullYear()}`;

    // Valor de cada serie en ese punto (interpolación lineal)
    const lines = filtered.map(s => {
      if (!s.pts.length || !s.label) return null;
      // Buscar el punto más cercano
      let lo = null, hi = null;
      for (const p of s.pts) {
        if (p.ms <= hoverMs) lo = p;
        else if (hi === null) hi = p;
      }
      let val = null;
      if (lo && hi) {
        const t = (hoverMs - lo.ms) / (hi.ms - lo.ms);
        val = lo.v + t * (hi.v - lo.v);
      } else if (lo) val = lo.v;
      else if (hi) val = hi.v;
      if (val === null) return null;
      return `<span style="color:${s.color || '#fff'}">${s.label}</span> <b>${val.toFixed(2)}</b>`;
    }).filter(Boolean);

    _tt.innerHTML = `<div style="color:rgba(180,180,180,0.7);margin-bottom:3px;font-size:9px;">${dayStr}</div>${lines.join('<br>')}`;
    _tt.style.display = 'block';

    // Posición del tooltip
    const ttW = _tt.offsetWidth || 120;
    const ttH = _tt.offsetHeight || 60;
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const flipX = relX + ttW + 14 > rect.width;
    _tt.style.left  = `${flipX ? relX - ttW - 8 : relX + 10}px`;
    _tt.style.top   = `${Math.max(0, relY - ttH / 2)}px`;
  }

  function _onLeave() {
    _tt.style.display = 'none';
    _drawStatic(null);
  }

  canvas.addEventListener('mousemove', _onMove);
  canvas.addEventListener('mouseleave', _onLeave);

  canvas._chartCleanup = () => {
    canvas.removeEventListener('mousemove', _onMove);
    canvas.removeEventListener('mouseleave', _onLeave);
    if (canvas._tooltip) { canvas._tooltip.remove(); canvas._tooltip = null; }
  };
}

// ─── Sparkline mini (sin ejes, usa drawLineChart simplificado) ───────────────
function drawSparklineLine(canvas, dates, vals, color = '#40d9c0') {
  if (!canvas || !dates || !vals || dates.length < 2) return;
  drawLineChart(canvas, [{ dates, vals, color, width: 1.5 }], {
    padding: { t: 2, r: 2, b: 2, l: 2 },
    GAP_DAYS: 90,
    unitMaxValue: null,  // sparklines pueden tener cualquier rango
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

      <!-- ══ 3. GRÁFICOS APILADOS ══ -->
      <style>
        .chart-canvas-main { width:100%; height:clamp(320px,50vw,480px); display:block; border-radius:4px; background:var(--surface2); }
        @media(min-width:768px){ .chart-canvas-main { height:460px; } }
      </style>

      <!-- ─ A. HIGH YIELD OAS ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera compacta -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">HIGH YIELD OAS</div>
          <span style="font-size:20px;font-weight:800;color:${hy ? stateColor(hy.hyState) : 'var(--text3)'};">${hy ? f2(hy.value) : '—'}<span style="font-size:10px;color:var(--text3);margin-left:2px;">%</span></span>
          <div style="display:flex;gap:8px;">
            ${hy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(hy.chg1d,'up-bad')};">${hy.chg1d!=null?(hy.chg1d>0?'+':'')+f2(hy.chg1d):'—'}pp <span style="color:var(--text3);">1D</span></span>` : ''}
            ${hy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(hy.chg5d,'up-bad')};">${hy.chg5d!=null?(hy.chg5d>0?'+':'')+f2(hy.chg5d):'—'}pp <span style="color:var(--text3);">5D</span></span>` : ''}
            ${hy ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(hy.chg20d,'up-bad')};">${hy.chg20d!=null?(hy.chg20d>0?'+':'')+f2(hy.chg20d):'—'}pp <span style="color:var(--text3);">20D</span></span>` : ''}
          </div>
          ${hy ? chip(stateLabel(hy.hyState), stateColor(hy.hyState)) : ''}
          ${hy ? `${freshDot(hy.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${hy.ageDays}d</span>` : ''}
          <div style="flex:1;"></div>
          <!-- Selector rango -->
          <div style="display:flex;gap:4px;" id="hy-range-btns">
            ${['3M','1A','3A','Máx'].map((r,i)=>`<button data-range="${r}" style="font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;border:1px solid var(--border);background:${i===1?'var(--teal)':'transparent'};color:${i===1?'#000':'var(--text3)'};font-weight:${i===1?'700':'400'};cursor:pointer;">${r}</button>`).join('')}
          </div>
        </div>
        <!-- Máx disponible label -->
        <div id="hy-max-label" style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:6px;display:none;"></div>
        <!-- Canvas principal -->
        <canvas id="hy-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda toggleable -->
        <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-hy" checked style="accent-color:var(--teal);"><div style="width:14px;height:2px;background:var(--teal);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">HY OAS</span></label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-mm100" checked style="accent-color:var(--amber);"><div style="width:14px;height:1px;border-top:1px dashed var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span></label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-mm200" checked style="accent-color:rgba(255,255,255,0.4);"><div style="width:14px;height:1px;border-top:1px dashed rgba(255,255,255,0.4);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span></label>
          <button id="hy-detail-btn" style="margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--teal);background:none;border:none;cursor:pointer;padding:0;">▾ Ver detalle</button>
        </div>
        <!-- Detalle oculto -->
        <div id="hy-detail" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
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

      <!-- ─ B. VOLATILIDAD VIX ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera compacta -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">VOLATILIDAD · VIX</div>
          <div style="display:flex;align-items:baseline;gap:10px;">
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX </span>
              <span style="font-size:20px;font-weight:800;color:${vix?.aboveMM200?'var(--red)':'var(--green)'};">${vix ? f1(vix.value) : '—'}</span>
              ${vix ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(vix.chg1d,'up-bad')};margin-left:4px;">${vix.chg1d!=null?(vix.chg1d>0?'+':'')+f2(vix.chg1d):''} <span style="color:var(--text3);">1D</span></span>` : ''}
            </div>
            <div style="width:1px;height:16px;background:var(--border);"></div>
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M </span>
              <span style="font-size:20px;font-weight:800;color:var(--text2);">${vix3 ? f1(vix3.value) : '—'}</span>
              ${vix3 ? `<span style="font-family:var(--mono);font-size:9px;color:${chgColor(vix3.chg1d,'up-bad')};margin-left:4px;">${vix3.chg1d!=null?(vix3.chg1d>0?'+':'')+f2(vix3.chg1d):''} <span style="color:var(--text3);">1D</span></span>` : ''}
            </div>
            <div style="width:1px;height:16px;background:var(--border);"></div>
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">RATIO </span>
              <span style="font-family:var(--mono);font-size:16px;font-weight:700;color:${vtr ? stateColor(vtr.state) : 'var(--text3)'};">${vtr ? f3(vtr.ratio) : '—'}</span>
              ${vtr ? `<span style="margin-left:5px;">${chip(stateLabel(vtr.state), stateColor(vtr.state), true)}</span>` : ''}
            </div>
          </div>
          ${vix ? chip(vix.aboveMM200?'SOBRE MM200':'BAJO MM200', vix.aboveMM200?'var(--red)':'var(--green)') : ''}
          ${vix ? `${freshDot(vix.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${vix.ageDays}d</span>` : ''}
          <div style="flex:1;"></div>
          <!-- Selector rango VIX -->
          <div style="display:flex;gap:4px;" id="vix-range-btns">
            ${['3M','1A','3A','Máx'].map((r,i)=>`<button data-range="${r}" style="font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;border:1px solid var(--border);background:${i===1?'#f47174':'transparent'};color:${i===1?'#000':'var(--text3)'};font-weight:${i===1?'700':'400'};cursor:pointer;">${r}</button>`).join('')}
          </div>
        </div>
        <!-- Canvas VIX -->
        <canvas id="vix-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda -->
        <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:2px;background:var(--red);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX</span></div>
          <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;background:var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M</span></div>
          <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;border-top:1px dashed var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span></div>
          <div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:1px;border-top:1px dashed rgba(255,255,255,0.3);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span></div>
        </div>
      </div>

      <!-- ─ C. S&P 500 TENDENCIA ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera dinámica (se actualiza vía JS) -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">S&amp;P 500 · M10</div>
          <div id="sp-header-metrics" style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;">
            <!-- rellenado por JS -->
          </div>
          <div style="flex:1;"></div>
          <!-- Semáforos compactos -->
          <div style="display:flex;gap:6px;">
            ${['monthly','weekly','daily'].map((tf, i) => {
              const label = ['M','S','D'][i];
              const d = sp?.[tf];
              const sc = stateColor(d?.state);
              return `<div style="text-align:center;padding:3px 7px;border-radius:4px;background:${sc}18;border:1px solid ${sc}44;">
                <div style="font-family:var(--mono);font-size:7px;color:var(--text3);">${label}</div>
                <div style="font-family:var(--mono);font-size:8px;font-weight:700;color:${sc};">${d ? stateLabel(d.state).slice(0,3) : '—'}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
        <!-- Tabs timeframe SP500 -->
        <div style="display:flex;gap:0;margin-bottom:10px;border-bottom:1px solid var(--border);">
          ${['monthly','weekly','daily'].map((tf, i) => {
            const label = ['Mensual','Semanal','Diario'][i];
            const active = tf === 'daily';
            return `<button class="sp-tf-tab" data-tf="${tf}" style="font-family:var(--mono);font-size:9px;padding:5px 14px;background:${active?'var(--surface2)':'transparent'};color:${active?'var(--text1)':'var(--text3)'};border:none;border-bottom:${active?'2px solid var(--teal)':'2px solid transparent'};cursor:pointer;margin-bottom:-1px;">${label}</button>`;
          }).join('')}
        </div>
        <!-- Canvas SP500 (único, redibujado al cambiar tab) -->
        <canvas id="sp-main-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda SP500 con toggles (MM100/MM200 solo visibles en Diario) -->
        <div id="sp-legend" style="display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-price" checked style="accent-color:#22d3ee;">
            <div style="width:14px;height:2px;background:#22d3ee;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">Precio</span>
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-m10" checked style="accent-color:#fbbf24;">
            <div style="width:14px;height:1px;border-top:2px dashed #fbbf24;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">M10</span>
          </label>
          <label id="sp-tog-mm100-wrap" style="display:none;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-mm100" checked style="accent-color:#60a5fa;">
            <div style="width:14px;height:1px;border-top:2px solid #60a5fa;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span>
          </label>
          <label id="sp-tog-mm200-wrap" style="display:none;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-mm200" checked style="accent-color:rgba(200,200,210,0.7);">
            <div style="width:14px;height:1px;border-top:2px dashed rgba(200,200,210,0.7);"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span>
          </label>
        </div>
        ${sp?.summary ? `<div style="margin-top:8px;font-size:9px;color:var(--text2);line-height:1.5;font-style:italic;">${sp.summary}</div>` : ''}
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

      // ─── Helper: filtrar y ordenar history [{date, v}] ──────────────────
      function prepHist(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return { dates: [], vals: [] };
        const pts = arr
          .filter(o => o && typeof o.date === 'string' && isFinite(Number(o.v)))
          .map(o => ({ date: o.date.slice(0, 10), v: Number(o.v) }))
          .sort((a, b) => a.date < b.date ? -1 : 1);
        return { dates: pts.map(p => p.date), vals: pts.map(p => p.v) };
      }

      // ─── Helper: calcular MM rolling desde una serie de vals ────────────
      function rollingMA(vals, n) {
        return vals.map((_, i) => {
          if (i < n - 1) return null;
          const slice = vals.slice(i - n + 1, i + 1);
          if (slice.some(v => v == null || !isFinite(v))) return null;
          return slice.reduce((a, b) => a + b, 0) / n;
        });
      }

      // ─── Helper: calcular fromDate según rango string ────────────────────
      function rangeFromDate(rangeKey) {
        const now = new Date();
        const map = { '3M': 90, '1A': 365, '3A': 365*3 };
        const days = map[rangeKey];
        if (!days) return null; // 'Máx' → sin filtro
        const d = new Date(now.getTime() - days * 86400000);
        return d.toISOString().slice(0, 10);
      }

      // ════════════════════════════════════════════════════════════════
      // A. HY OAS — gráfico con historia real + MM100 + MM200 + bandas
      // ════════════════════════════════════════════════════════════════
      const hyCanvas = document.getElementById('hy-chart');
      if (hyCanvas && hy) {
        const hyBands = [
          { yMin: 6,   yMax: 25,  color: 'rgba(244,113,116,0.07)' }, // estrés
          { yMin: 4.5, yMax: 6,   color: 'rgba(251,191,36,0.06)'  }, // tensión
          { yMin: 3.5, yMax: 4.5, color: 'rgba(64,217,192,0.05)'  }, // vigilancia
          { yMin: 0,   yMax: 3.5, color: 'rgba(74,222,128,0.04)'  }, // normal
        ];

        let hyActiveRange = '1A';
        // Estado de visibilidad de series (toggleable legend)
        let hyShowHy   = true;
        let hyShowMm100 = true;
        let hyShowMm200 = true;

        function hyRedraw() {
          // Actualizar estilo botones
          document.querySelectorAll('#hy-range-btns button').forEach(b => {
            const active = b.dataset.range === hyActiveRange;
            b.style.background = active ? 'var(--teal)' : 'transparent';
            b.style.color = active ? '#000' : 'var(--text3)';
            b.style.fontWeight = active ? '700' : '400';
          });

          // Obtener datos históricos de la API (hy.history: [{date, v}] ASC)
          const rawHist = hy.history || [];
          const { dates: allDates, vals: allVals } = prepHist(rawHist);

          if (allDates.length < 5) {
            drawLineChart(hyCanvas, [], { bands: hyBands });
            return;
          }

          // Validar unidad: si el último valor > 20 → probablemente son pb → dividir por 100
          const lastRaw = allVals[allVals.length - 1];
          const scaleFactor = (lastRaw != null && lastRaw > 20) ? 0.01 : 1;
          const scaledVals = allVals.map(v => v * scaleFactor);

          // Calcular MM100 y MM200 sobre la serie completa antes de filtrar rango
          // rollingMA devuelve null para el período de warmup → drawLineChart no los une
          const mm100Full = rollingMA(scaledVals, 100);
          const mm200Full = rollingMA(scaledVals, 200);

          // Máx disponible: mostrar etiqueta con rango real
          const maxLabel = document.getElementById('hy-max-label');
          if (maxLabel) {
            if (hyActiveRange === 'Máx' && allDates.length > 0) {
              maxLabel.textContent = `Máximo disponible: ${allDates[0]} — ${allDates[allDates.length - 1]}`;
              maxLabel.style.display = 'block';
            } else {
              maxLabel.style.display = 'none';
            }
          }

          // Filtrar por rango
          const fromDate = rangeFromDate(hyActiveRange);
          const xRange = fromDate ? { fromDate, toDate: allDates[allDates.length - 1] } : null;

          const series = [];
          if (hyShowHy)    series.push({ dates: allDates, vals: scaledVals,  color: '#40d9c0', width: 2,   fill: true,  label: 'HY OAS' });
          if (hyShowMm100) series.push({ dates: allDates, vals: mm100Full,   color: '#fbbf24', width: 1,   dash: [4,3], label: 'MM100'  });
          if (hyShowMm200) series.push({ dates: allDates, vals: mm200Full,   color: 'rgba(255,255,255,0.35)', width: 1, dash: [2,4], label: 'MM200' });

          drawLineChart(hyCanvas, series, { bands: hyBands, xRange, GAP_DAYS: 10, unitMaxValue: null });
        }

        hyRedraw();

        // Binding botones de rango
        document.querySelectorAll('#hy-range-btns button').forEach(b => {
          b.addEventListener('click', () => { hyActiveRange = b.dataset.range; hyRedraw(); });
        });
        // Binding toggles de leyenda
        const togHy  = document.getElementById('hy-tog-hy');
        const togM100 = document.getElementById('hy-tog-mm100');
        const togM200 = document.getElementById('hy-tog-mm200');
        if (togHy)   togHy.addEventListener('change',  () => { hyShowHy    = togHy.checked;   hyRedraw(); });
        if (togM100) togM100.addEventListener('change', () => { hyShowMm100 = togM100.checked; hyRedraw(); });
        if (togM200) togM200.addEventListener('change', () => { hyShowMm200 = togM200.checked; hyRedraw(); });
      }

      // ════════════════════════════════════════════════════════════════
      // B. VIX — gráfico con historia real + VIX3M + MM100 + MM200 + niveles
      // ════════════════════════════════════════════════════════════════
      const vixCanvas = document.getElementById('vix-chart');
      if (vixCanvas && vix) {
        let vixActiveRange = '1A';

        function vixRedraw() {
          document.querySelectorAll('#vix-range-btns button').forEach(b => {
            const active = b.dataset.range === vixActiveRange;
            b.style.background = active ? '#f47174' : 'transparent';
            b.style.color = active ? '#000' : 'var(--text3)';
            b.style.fontWeight = active ? '700' : '400';
          });

          const { dates: vDates, vals: vVals } = prepHist(vix.history || []);
          const { dates: v3Dates, vals: v3Vals } = prepHist(vix3?.history || []);

          if (vDates.length < 5) {
            drawLineChart(vixCanvas, [], {});
            return;
          }

          // MM100 y MM200 sobre VIX (null durante warmup → no se unen)
          const mm100Vix = rollingMA(vVals, 100);
          const mm200Vix = rollingMA(vVals, 200);

          const fromDate = rangeFromDate(vixActiveRange);
          const xRange = fromDate ? { fromDate, toDate: vDates[vDates.length - 1] } : null;

          drawLineChart(vixCanvas, [
            { dates: vDates,  vals: vVals,    color: '#f47174', width: 2,   label: 'VIX'   },
            { dates: v3Dates, vals: v3Vals,   color: '#fbbf24', width: 1.5, dash: [4,3], label: 'VIX3M' },
            { dates: vDates,  vals: mm100Vix, color: 'rgba(251,191,36,0.6)', width: 1, dash: [3,3], label: 'MM100' },
            { dates: vDates,  vals: mm200Vix, color: 'rgba(255,255,255,0.3)', width: 1, dash: [2,4], label: 'MM200' },
          ], {
            hLines: [
              { y: 20, color: 'rgba(251,191,36,0.55)',   dash: [3,3], label: '20', width: 0.8 },
              { y: 30, color: 'rgba(244,113,116,0.55)',  dash: [3,3], label: '30', width: 0.8 },
            ],
            xRange,
            GAP_DAYS: 10,
            unitMaxValue: null,
          });
        }

        vixRedraw();

        document.querySelectorAll('#vix-range-btns button').forEach(b => {
          b.addEventListener('click', () => { vixActiveRange = b.dataset.range; vixRedraw(); });
        });
      }

      // ════════════════════════════════════════════════════════════════
      // C. SP500 — canvas único, redibujado al cambiar tab
      //    Cada timeframe tiene history: [{date, price, m10}]
      // ════════════════════════════════════════════════════════════════
      if (sp) {
        let spActiveTf = 'daily';
        const spMainCanvas = document.getElementById('sp-main-chart');

        function updateSpHeader() {
          const d = sp[spActiveTf];
          const headerEl = document.getElementById('sp-header-metrics');
          if (!headerEl || !d) return;
          const sc = stateColor(d.state);
          const slopeIcon = d.slope === 'up' ? '↑' : d.slope === 'down' ? '↓' : '→';

          // Distancias relativas
          const distM10  = d.price && d.m10    ? (((d.price - d.m10)    / d.m10)    * 100) : null;
          const distMM100 = (spActiveTf === 'daily' && d.price && d._mm100Last)
                            ? (((d.price - d._mm100Last) / d._mm100Last) * 100) : null;
          const distMM200 = (spActiveTf === 'daily' && d.price && d._mm200Last)
                            ? (((d.price - d._mm200Last) / d._mm200Last) * 100) : null;

          function distSpan(val, label, refColor) {
            if (val == null) return '';
            const sign = val > 0 ? '+' : '';
            const col  = val > 0 ? 'var(--green)' : 'var(--red)';
            return `<span style="font-family:var(--mono);font-size:9px;color:var(--text3);">${label} <span style="color:${col};">${sign}${val.toFixed(1)}%</span></span>`;
          }

          // Pendientes MM100 / MM200 (solo diario)
          const slopeMM100 = d._slopeMM100 === 'up' ? '↑' : d._slopeMM100 === 'down' ? '↓' : d._slopeMM100 ? '→' : '';
          const slopeMM200 = d._slopeMM200 === 'up' ? '↑' : d._slopeMM200 === 'down' ? '↓' : d._slopeMM200 ? '→' : '';

          headerEl.innerHTML = `
            <span style="font-size:20px;font-weight:800;color:${sc};">${f2(d.price)}</span>
            <span style="font-family:var(--mono);font-size:9px;color:${sc};">M10: ${f2(d.m10)} ${slopeIcon}</span>
            ${distM10 != null ? distSpan(distM10, 'vs M10', '#fbbf24') : ''}
            ${distMM100 != null ? `<span style="font-family:var(--mono);font-size:9px;color:#60a5fa;">MM100: ${f2(d._mm100Last)} ${slopeMM100}</span>` : ''}
            ${distMM100 != null ? distSpan(distMM100, 'vs MM100', '#60a5fa') : ''}
            ${distMM200 != null ? `<span style="font-family:var(--mono);font-size:9px;color:rgba(200,200,210,0.8);">MM200: ${f2(d._mm200Last)} ${slopeMM200}</span>` : ''}
            ${distMM200 != null ? distSpan(distMM200, 'vs MM200', 'rgba(200,200,210,0.8)') : ''}
            ${chip(stateLabel(d.state), sc)}
          `;
        }

        // Leer estado de toggles
        function spToggles() {
          return {
            price : document.getElementById('sp-tog-price')?.checked  ?? true,
            m10   : document.getElementById('sp-tog-m10')?.checked    ?? true,
            mm100 : document.getElementById('sp-tog-mm100')?.checked  ?? true,
            mm200 : document.getElementById('sp-tog-mm200')?.checked  ?? true,
          };
        }

        function spRedraw() {
          // Actualizar estilos de tabs
          document.querySelectorAll('.sp-tf-tab').forEach(b => {
            const active = b.dataset.tf === spActiveTf;
            b.style.background = active ? 'var(--surface2)' : 'transparent';
            b.style.color = active ? 'var(--text1)' : 'var(--text3)';
            b.style.borderBottom = active ? '2px solid var(--teal)' : '2px solid transparent';
          });

          // Mostrar/ocultar controles MM100/MM200 (solo Diario)
          const isDaily = spActiveTf === 'daily';
          const mm100Wrap = document.getElementById('sp-tog-mm100-wrap');
          const mm200Wrap = document.getElementById('sp-tog-mm200-wrap');
          if (mm100Wrap) mm100Wrap.style.display = isDaily ? 'flex' : 'none';
          if (mm200Wrap) mm200Wrap.style.display = isDaily ? 'flex' : 'none';

          if (!spMainCanvas) return;
          const d = sp[spActiveTf];
          if (!d?.history?.length) {
            drawLineChart(spMainCanvas, [], {});
            updateSpHeader();
            return;
          }

          // history: [{date, price, m10}]
          const hist = d.history
            .filter(o => o && typeof o.date === 'string' && isFinite(Number(o.price)))
            .sort((a, b) => a.date < b.date ? -1 : 1);

          const dates  = hist.map(o => o.date.slice(0, 10));
          const prices = hist.map(o => Number(o.price));
          // m10 viene del backend (null durante warmup)
          const m10s   = hist.map(o => (o.m10 != null && isFinite(Number(o.m10))) ? Number(o.m10) : null);

          // ── Medias móviles diarias (calculadas sobre TODO el histórico, luego se recorta en drawLineChart) ──
          let mm100 = null, mm200 = null;
          if (isDaily) {
            mm100 = rollingMA(prices, 100);
            mm200 = rollingMA(prices, 200);

            // Guardar último valor disponible para cabecera
            const lastMM100 = [...mm100].reverse().find(v => v != null);
            const lastMM200 = [...mm200].reverse().find(v => v != null);
            d._mm100Last = lastMM100 ?? null;
            d._mm200Last = lastMM200 ?? null;

            // Pendiente simple: comparar últimos 5 días
            function slopeDir(arr) {
              const valid = arr.filter(v => v != null);
              if (valid.length < 6) return null;
              const prev = valid[valid.length - 6];
              const last = valid[valid.length - 1];
              if (last > prev * 1.001) return 'up';
              if (last < prev * 0.999) return 'down';
              return 'flat';
            }
            d._slopeMM100 = slopeDir(mm100);
            d._slopeMM200 = slopeDir(mm200);
          }

          const priceColor = d.state === 'alcista' ? '#22d3ee'
                           : d.state === 'bajista' ? '#f47174'
                           : '#22d3ee';

          const gapDays = spActiveTf === 'monthly' ? 60 : spActiveTf === 'weekly' ? 14 : 7;
          const tog = spToggles();

          const series = [];
          if (tog.price) series.push({ dates, vals: prices, color: priceColor, width: 1.8, fill: true, label: 'Precio' });
          if (tog.m10)   series.push({ dates, vals: m10s,   color: '#fbbf24', width: 1.5, dash: [4,3], label: 'M10' });
          if (isDaily && tog.mm100 && mm100) series.push({ dates, vals: mm100, color: '#60a5fa', width: 1.2, label: 'MM100' });
          if (isDaily && tog.mm200 && mm200) series.push({ dates, vals: mm200, color: 'rgba(200,200,210,0.6)', width: 1, dash: [3,4], label: 'MM200' });

          drawLineChart(spMainCanvas, series, { GAP_DAYS: gapDays, unitMaxValue: null });
          updateSpHeader();
        }

        spRedraw();

        // Binding tabs SP500
        document.querySelectorAll('.sp-tf-tab').forEach(b => {
          b.addEventListener('click', () => {
            spActiveTf = b.dataset.tf;
            spRedraw();
          });
        });

        // Binding toggles SP500
        ['sp-tog-price','sp-tog-m10','sp-tog-mm100','sp-tog-mm200'].forEach(id => {
          document.getElementById(id)?.addEventListener('change', spRedraw);
        });
      }

      // ════════════════════════════════════════════════════════════════
      // D. Sparklines condiciones financieras (chg1d/5d/20d — mini)
      //    Estas se mantienen con la función drawSparkline original
      // ════════════════════════════════════════════════════════════════
      function buildSpark(cur, chg1, chg5, chg20) {
        if (cur == null) return [];
        const vals = [null, null, null, null, null];
        vals[4] = cur;
        if (chg1  != null) vals[3] = cur - chg1;
        if (chg5  != null) vals[1] = cur - chg5;
        if (chg20 != null) vals[0] = cur - chg20;
        const out = [...vals];
        for (let i = 0; i < out.length; i++) {
          if (out[i] == null) {
            const prev = out.slice(0, i).reverse().find(v => v != null);
            const next = out.slice(i + 1).find(v => v != null);
            if (prev != null && next != null) out[i] = (prev + next) / 2;
            else if (prev != null) out[i] = prev;
            else if (next != null) out[i] = next;
          }
        }
        return out;
      }

      const dxyS = document.getElementById('sp-dxy-spark');
      if (dxyS && dxy) drawSparkline(dxyS, buildSpark(dxy.value, dxy.chg1d, dxy.chg5d, dxy.chg20d), '#40d9c0');

      const cvS = document.getElementById('sp-cv-spark');
      if (cvS && cv?.value != null) drawSparkline(cvS, buildSpark(cv.value, null, null, null), cv.value >= 0 ? '#4ade80' : '#f47174');

      const dfS = document.getElementById('sp-df-spark');
      if (dfS && df) drawSparkline(dfS, buildSpark(df.value, df.chg1d, df.chg5d, df.chg20d), df.value > 0 ? '#f47174' : '#4ade80');
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
