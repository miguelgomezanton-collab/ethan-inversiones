import { getMacroData, getManuals, saveManuals } from './macro-data.js';

const f2    = v => v != null ? Number(v).toFixed(2) : '—';
const fsign = v => v != null ? (v>=0?'+':'')+Number(v).toFixed(2) : '—';
const col   = s => s > 0 ? 'var(--green)' : s === 0 ? 'var(--amber)' : 'var(--red)';

function regime(liq) {
  // Liquidity Score propio — independiente del macro.scoreTotal
  // Indicadores: M2 Global (±3), Impulso Crediticio (±2), Velocidad M2 (±2), Reservas (±1/−2), BBB Spread (±1)
  // PROVISIONAL — pesos y thresholds pendientes de calibración
  let rawScore = 0, maxAvailable = 0;
  const MAX_POSSIBLE = 12; // M2×3 + Crédito×3 + Impulso×2 + VelM2×2 + Reservas×1 + BBB×1
  const detail = {};
  for (const [k, i] of Object.entries(liq)) {
    if (i?.score != null) {
      rawScore     += i.score;
      maxAvailable += Math.abs(i.weight || 1);
      detail[k]     = i.score;
    }
  }
  const coverage = +(maxAvailable / MAX_POSSIBLE).toFixed(3);

  let title, c, sub;
  if (rawScore >= 4)  { title = 'Liquidez Expansiva';   c = 'var(--green)'; sub = 'Combustible para el ciclo'; }
  else if (rawScore >= 0)  { title = 'Liquidez Neutral';     c = 'var(--amber)'; sub = 'Mixto — selectividad clave'; }
  else if (rawScore >= -4) { title = 'Liquidez Contractiva'; c = 'var(--red)';   sub = 'El dinero se retira del sistema'; }
  else                     { title = 'Drenaje Severo';       c = 'var(--red)';   sub = 'Riesgo sistémico — reducir exposición'; }

  return { title, c, sub, score: rawScore, maxAvailable, coverage, detail };
}

function buildPhrase(liq) {
  const parts = [];
  if (liq.m2?.value != null)
    parts.push(liq.m2.value >= 5 ? `El <strong>M2 crece fuerte</strong> (+${f2(liq.m2.value)}% YoY) — combustible para el ciclo` :
      liq.m2.value >= 3 ? `El <strong>M2 crece moderadamente</strong> (+${f2(liq.m2.value)}% YoY)` :
      `El <strong>M2 está por debajo del umbral</strong> (${fsign(liq.m2.value)}% YoY) — presión sobre activos de riesgo`);
  if (liq.impulso?.value != null)
    parts.push(liq.impulso.value >= 1 ? `el <strong>impulso crediticio es fuerte</strong> (+${f2(liq.impulso.value)})` :
      liq.impulso.value >= 0.5 ? `el impulso crediticio es positivo (+${f2(liq.impulso.value)})` :
      `el <strong>impulso crediticio es negativo</strong> (${f2(liq.impulso.value)}) — frena el gasto con 6-9 meses de retardo`);
  if (liq.reservas?.value != null)
    parts.push(liq.reservas.value >= 3.5 ? `las reservas bancarias son abundantes ($${f2(liq.reservas.value)}T)` :
      liq.reservas.value >= 2.5 ? `las reservas están en nivel bajo ($${f2(liq.reservas.value)}T) — QT activo de la Fed` :
      `las <strong>reservas son insuficientes</strong> ($${f2(liq.reservas.value)}T) — riesgo de credit crunch`);
  return parts.join('. ') + (parts.length ? '.' : 'Introduce los datos manuales para obtener el diagnóstico de liquidez.');
}

function centeredBar(value, maxAbs, cPos = 'var(--green)', cNeg = 'var(--red)') {
  const pct = Math.min(Math.abs(value || 0) / maxAbs * 50, 50);
  const isPos = (value || 0) >= 0;
  return `<div style="position:relative;height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;">
    ${isPos ? `<div style="position:absolute;left:50%;width:${pct}%;height:100%;background:${cPos};border-radius:0 4px 4px 0;"></div>`
            : `<div style="position:absolute;right:50%;width:${pct}%;height:100%;background:${cNeg};border-radius:4px 0 0 4px;"></div>`}
    <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);font-family:var(--mono);">
    <span style="color:${cNeg}">Contractivo</span><span>0</span><span style="color:${cPos}">Expansivo</span>
  </div>`;
}

function liqCard(icon, title, ind, subtitle, thresholds, signal) {
  if (!ind) return '';
  const c = col(ind.score);
  const displayVal = ind.label === 'Reservas Bancarias Fed'
    ? (ind.value != null ? '$' + f2(ind.value) + 'T' : '—')
    : (ind.value != null ? fsign(ind.value) + '%' : '—');
  const maxAbs = title.includes('Reservas') ? 2 : title.includes('M2') ? 10 : title.includes('Crédito vs') ? 8 : 5;
  const barVal = title.includes('Reservas') ? (ind.value != null ? ind.value - 3 : null) : ind.value;
  return `<div class="co-liq-card">
    <div class="co-liq-card-header">
      <span class="co-liq-card-title">${icon} ${title}</span>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${ind.date||'—'}${ind.manual?' · ✎':''}</span>
    </div>
    <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${c};">${displayVal}</div>
    <div style="font-size:10px;color:var(--text2);font-family:var(--mono);margin-bottom:2px;">${subtitle}</div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${thresholds}</div>
    ${ind.value != null && barVal != null ? centeredBar(barVal, maxAbs) : '<div style="height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;"></div>'}
    <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-top:8px;">${signal(ind.score, ind.value)}</div>
  </div>`;
}

function manualInput(key, label, hint, unit, val) {
  return `<div class="co-manual-row">
    <div><div style="font-size:11px;color:var(--text2);font-weight:600;">${label}</div><div style="font-size:9px;color:var(--text3);">${hint}</div></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <input type="number" class="liq-manual-input" data-key="${key}" value="${val ?? ''}" placeholder="—" step="0.1" style="width:72px;">
      <span style="font-size:10px;color:var(--text3);">${unit}</span>
    </div>
  </div>`;
}

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `
    <button class="btn" id="liq-edit">✎ Editar manuales</button>
    <button class="btn btn-primary" id="liq-refresh">↻ Actualizar</button>
  `;
  container.innerHTML = `<div id="liq-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;

  async function load(force = false) {
    try { const m = await getMacroData(force); paint(m); }
    catch(e) { document.getElementById('liq-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`; }
  }

  function paint(macro) {
    const el  = document.getElementById('liq-wrap');
    const liq = macro.liquidez || {};
    const reg = regime(liq);
    const man = getManuals();

    el.innerHTML = `
      <!-- HERO -->
      <div class="co-verdict-block" style="margin-bottom:16px;">
        <div class="co-score-wrap">
          <div class="co-score-num" style="color:${reg.c}">${reg.score>=0?'+':''}${reg.score}</div>
          <div class="co-score-max">puntos liq.</div>
          <div class="co-score-gauge"><div class="co-score-gauge-fill" style="width:${Math.max(0,((reg.score+13)/26)*100)}%;background:${reg.c};"></div></div>
        </div>
        <div class="co-verdict-center">
          <div class="co-verdict-label">Régimen de liquidez · ${macro.updatedAt?new Date(macro.updatedAt).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):'—'}</div>
          <div class="co-verdict-title" style="color:${reg.c}">${reg.title}</div>
          <div class="co-verdict-phrase">${buildPhrase(liq)}</div>
        </div>
        <div class="co-verdict-right">
          ${liq.m2?.value!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">M2 Global</div><div class="co-verdict-mini-val" style="color:${col(liq.m2.score)}">${fsign(liq.m2.value)}%</div><div class="co-verdict-mini-sub">YoY · ×3</div></div>`:''}
          ${liq.reservas?.value!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">Reservas Fed</div><div class="co-verdict-mini-val" style="color:${col(liq.reservas.score)}">$${f2(liq.reservas.value)}T</div><div class="co-verdict-mini-sub">${liq.reservas.score>0?'>$3.5T':liq.reservas.score===-1?'$2.5-3.4T':'<$2.5T'}</div></div>`:''}
        </div>
      </div>

      <!-- PANEL MANUALES -->
      <div id="liq-manual-panel" style="display:none;background:var(--surface);border:1px dashed var(--border2);border-radius:12px;padding:18px 20px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">✎ Input Manual — China M2</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:14px;">
          USA (FRED), Eurozona (ECB) y Japón (BOJ) son ahora <strong style="color:var(--teal)">100% automáticos</strong>.
          Solo China M2 YoY requiere input manual — el PBoC no tiene API pública gratuita estable.
          Sin este dato, el M2 Global se calcula con 3 regiones (~70% del total).
        </div>
        ${manualInput('chinaM2', 'China M2 YoY (%)', 'Fuente: PBoC · publicación mensual · peso ~30% del M2 Global', '%', man.chinaM2)}
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-primary" id="liq-save-manuals">Guardar y actualizar</button>
          <button class="btn" id="liq-close-manuals">Cancelar</button>
        </div>
      </div>

      <!-- GRID 6 CARDS -->
      <div class="co-liq-grid3">
        ${liqCard('💵','M2 Global', liq.m2,
          liq.m2?.auto
            ? (() => {
                const c = liq.m2.components || {};
                const fsn = f => f === 'ok' ? '✓ OK' : f === 'stale' ? '✗ STALE' : f === 'manual' ? '✎ manual' : '— missing';
                const row = (flag, key, label) => {
                  const r = c[key];
                  if (!r) return `${label}: —`;
                  if (r.error) return `${label}: ⚠ ${r.error}${r.fallbackReason?' ('+r.fallbackReason+')':''}${r.source?' ['+r.source+']':''}`;
                  const srcTag = r.source ? ` [${r.source}${r.fallbackReason?' · '+r.fallbackReason:''}]` : '';
                  const yoyLabel = r.isOfficialYoY ? 'YoY oficial BOJ' : 'YoY calc.';
                  const baseInfo = r.baseDate ? ` | base ${r.baseDate}` : (r.isOfficialYoY ? ' | YoY directo BOJ' : '');
                  return `${label}: ${r.currentDate||'—'} | ${yoyLabel} ${r.yoy!=null?(r.yoy>=0?'+':'')+f2(r.yoy)+'%':'—'}${baseInfo} | ${r.ageDays!=null?r.ageDays+'d':'-'} · ${fsn(r.freshness)}${srcTag}`;
                };
                return [
                  row(true,'us','USA FRED M2SL'),
                  row(true,'eur','EUR ECB BSI'),
                  row(true,'jp','JPN BOJ'),
                  `CHN: ${c.chn?.valid
                    ? (c.chn.source === 'manual override'
                      ? `${f2(c.chn.yoy)}% (manual override)`
                      : `${c.chn.currentDate||'—'} | YoY calc. ${c.chn.yoy!=null?(c.chn.yoy>=0?'+':'')+f2(c.chn.yoy)+'%':'—'} | base ${c.chn.baseDate||'—'} | N=${c.chn.nObs||'—'} | ${c.chn.ageDays!=null?c.chn.ageDays+'d':'-'} · ✓ OK [${c.chn.source||'—'}]`)
                    : (() => {
                        const d = c.chn?.diag || {};
                        const diagAll = c.chn?.diagAll || [d];
                        return `<span style="color:var(--red)">⚠ MISSING</span><br>` +
                          diagAll.map((sd,i) => {
                            const lines = [
                              `Fuente ${i+1} [${sd.source||'—'}]: HTTP ${sd.httpStatus||'—'} · branch:${sd.parserBranch||'—'} · nObs:${sd.nObsReceived||0}→${sd.nObsParsed||0}`,
                              sd.last3?.length ? `Más recientes: ${sd.last3.join(' | ')}` : null,
                              sd.first3?.length ? `Más antiguas: ${sd.first3.join(' | ')}` : null,
                              sd.latestDate ? `current: ${sd.latestDate} = ${sd.latestValue}` : null,
                              sd.targetBaseDate ? `target base: ${sd.targetBaseDate}` : null,
                              sd.baseDate ? `base found: ${sd.baseDate} = ${sd.baseValue} (Δ${sd.baseDeltaDays}d)` : null,
                              sd.yoyCalc ? `YoY calc: ${sd.yoyCalc}` : null,
                              sd.failReason ? `<strong style="color:var(--red)">FAIL: ${sd.failReason}</strong>` : null,
                              sd.error ? `Error: ${sd.error}` : null,
                            ].filter(Boolean);
                            return lines.join('<br>');
                          }).join('<br>---<br>');
                      })()}`,
                  `Cobertura: ${liq.m2.coverageWeight||'—'}/100 (mín. 60) · Global YoY: ${liq.m2.value!=null?(liq.m2.value>=0?'+':'')+f2(liq.m2.value)+'%':'bloqueado'} · Estado: <strong style="color:${liq.m2.audit?.aggregateStatus==='OK'?'var(--green)':liq.m2.audit?.aggregateStatus==='PARTIAL'?'var(--amber)':'var(--red)'};">${liq.m2.audit?.aggregateStatus||'—'}</strong>${liq.m2.audit?.renormalized?' · Pesos renormalizados (missing: '+liq.m2.audit?.missingRegions?.join(', ')?.toUpperCase()+')':''}`,
                  `<span style="color:var(--text3);font-size:9px;">Metodología: media ponderada YoY | Pesos USA=35 EUR=25 JPN=10 CHN=30 | ${liq.m2.audit?.historicalProxy?'HIST_MACRO_V1 usa M2SL USA como HISTORICAL_PROXY para pre-2016':''}</span>`,
                ].join('<br>');
              })()
            : 'YoY — estimado global (Fed+ECB+PBOC+BoJ)',
          '≥+5.0%→+3  ·  +3.0-4.9%→+1  ·  <+3.0%→−3  ·  peso ×3 · min.cobertura 60/100',
          (s, v) => s > 0 ? `<strong style="color:var(--green)">+${s} pts.</strong> M2 creciendo — combustible para el ciclo y expansión de múltiplos.` :
            s === 0 ? `<strong style="color:var(--amber)">0 pts.</strong> M2 entre +3% y +5% — ciclo sostenido pero sin exceso monetario.` :
            v != null ? `<strong style="color:var(--red)">${s} pts.</strong> M2 bajo umbral — presión sobre activos de riesgo con 6-12m de retardo.` :
            `Sin datos o cobertura insuficiente (<60/100). Introduce China M2 YoY% con "Editar manuales" para mejorar cobertura.`)}

        ${liqCard('📈','Crédito vs Nominal GDP', liq.credito,
          liq.credito?.auto
            ? (() => {
                const tl  = liq.credito.tl  || {};
                const gdp = liq.credito.gdp || {};
                const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'—';
                return [
                  '🔍 DEBUG Crédito vs PIB',
                  `TOTLL: ${tl.date||'—'} | base ${tl.baseDate||'—'} | ${tl.ageDays!=null?tl.ageDays+'d':'—'} · ${fsn(tl.freshness)}${tl.error?' ⚠ '+tl.error:''}`,
                  `GDP:   ${gdp.date||'—'} | base ${gdp.baseDate||'—'} | ${gdp.ageDays!=null?gdp.ageDays+'d':'—'} · ${fsn(gdp.freshness)}${gdp.error?' ⚠ '+gdp.error:''}`,
                  `CreditYoY: ${liq.credito.creditYoY!=null?(liq.credito.creditYoY>=0?'+':'')+f2(liq.credito.creditYoY)+'%':'—'} | GdpYoY: ${liq.credito.gdpYoY!=null?(liq.credito.gdpYoY>=0?'+':'')+f2(liq.credito.gdpYoY)+'%':'—'} | Diff: ${liq.credito.value!=null?(liq.credito.value>=0?'+':'')+f2(liq.credito.value)+'%':'—'}`,
                  `Score: ${liq.credito.score!=null?liq.credito.score:'bloqueado'}${liq.credito.stale?' · STALE':''}`,
                ].join('<br>');
              })()
            : 'Manual override',
          '≥+3.0%→+3  ·  +1.5-2.9%→0  ·  <+1.5%→−3  ·  PROVISIONAL · peso ×3',
          (s, v) => s > 0 ? `<strong style="color:var(--green)">+${s} pts.</strong> Crédito crece significativamente más que el PIB nominal — expansión financiera.` :
            s === 0 ? `<strong style="color:var(--amber)">0 pts.</strong> Crédito crece moderadamente más que el nominal — impulso leve.` :
            v != null && v > 0 ? `<strong style="color:var(--amber)">${s} pts.</strong> Crédito crece más que el PIB nominal (+${typeof v === 'number' ? v.toFixed(2) : v} pp) pero por debajo del umbral de señal. <em>Scoring provisional.</em>` :
            v != null && v <= 0 ? `<strong style="color:var(--red)">${s} pts.</strong> Crédito crece menos que el PIB nominal — desapalancamiento bancario.` :
            `<strong style="color:var(--red)">${s} pts.</strong> Sin datos suficientes.`)}

        ${liqCard('⚡','Impulso Crediticio', liq.impulso,
          liq.impulso?.auto
            ? (() => {
                const c   = liq.impulso.current || {};
                const p3m = liq.impulso.point3m || {};
                const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'—';
                return [
                  '🔍 DEBUG Impulso Crediticio',
                  `Actual:  ${c.date||'—'} | base ${c.baseDate||'—'} | ${c.ageDays!=null?c.ageDays+'d':'—'} · ${fsn(c.freshness)}`,
                  `Hace 3M: ${p3m.date||'—'} | base ${p3m.baseDate||'—'}`,
                  `YoY actual: ${liq.impulso.yoyNow!=null?(liq.impulso.yoyNow>=0?'+':'')+f2(liq.impulso.yoyNow)+'%':'—'} | YoY 3M atrás: ${liq.impulso.yoy3mAgo!=null?(liq.impulso.yoy3mAgo>=0?'+':'')+f2(liq.impulso.yoy3mAgo)+'%':'—'}`,
                  `Impulso (diff): ${liq.impulso.value!=null?(liq.impulso.value>=0?'+':'')+f2(liq.impulso.value)+' pp':'—'}`,
                  `Score: ${liq.impulso.score!=null?liq.impulso.score:'bloqueado'}${liq.impulso.stale?' · STALE':''}${liq.impulso.error?' · ⚠ '+liq.impulso.error:''}`,
                ].join('<br>');
              })()
            : 'Manual override',
          '≥+1.0→+2  ·  +0.5-0.9→+1  ·  <+0.5→−2  ·  PROVISIONAL · peso ×2',
          (s, v) => s >= 2 ? `<strong style="color:var(--green)">+2 pts.</strong> Impulso fuerte — crédito acelerando.` :
            s === 1 ? `<strong style="color:var(--green)">+1 pt.</strong> Impulso positivo moderado.` :
            v != null && v >= 0 ? `<strong style="color:var(--amber)">${s} pts.</strong> Crédito creciendo pero desacelerando — impulso negativo. <em>Scoring provisional.</em>` :
            `<strong style="color:var(--red)">${s} pts.</strong> Crédito desacelerando — contracción del impulso crediticio.`)}

        ${liqCard('🔄','Velocidad M2', liq.velM2,
          liq.velM2?.auto
            ? (() => {
                const v = liq.velM2;
                const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'—';
                return [
                  '🔍 DEBUG Velocidad M2',
                  `M2V actual: ${v.date||'—'} | ${v.rawValue!=null?v.rawValue.toFixed(4):'—'}`,
                  `Base:       ${v.baseDate||'—'} | ${v.baseValue!=null?v.baseValue.toFixed(4):'—'}`,
                  `YoY: ${v.value!=null?(v.value>=0?'+':'')+f2(v.value)+'%':'—'} | ${v.ageDays!=null?v.ageDays+'d':'—'} · ${fsn(v.freshness)}`,
                  `Score: ${v.score!=null?v.score:'bloqueado'}${v.stale?' · STALE':''} · Fuente: FRED M2V [PROVISIONAL]`,
                ].join('<br>');
              })()
            : 'YoY · FRED M2V (trimestral) · automático',
          '≥0%→+2  ·  −1.5 a −0.1%→−1  ·  <−1.5%→−2  ·  PROVISIONAL · peso ×2',
          (s, v) => s >= 2
            ? `<strong style="color:var(--green)">+2 pts.</strong> Velocidad M2 ${v!=null?(v>=0?'+':'')+f2(v)+'% interanual':'—'}. Scoring provisional.`
            : s === -1
            ? `<strong style="color:var(--amber)">−1 pt.</strong> Velocidad M2 ${v!=null?(v>=0?'+':'')+f2(v)+'% interanual':'—'}. Scoring provisional.`
            : `<strong style="color:var(--red)">${s!=null?s:'—'} pts.</strong> Velocidad M2 ${v!=null?(v>=0?'+':'')+f2(v)+'% interanual':'—'}. Scoring provisional.`)}

        ${liqCard('🏦','Reservas Bancarias Fed', liq.reservas,
          liq.reservas?.auto
            ? (() => {
                const r = liq.reservas;
                const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'—';
                return [
                  '🔍 DEBUG Reservas Bancarias',
                  `Fecha: ${r.date||'—'} | Bruto FRED: ${r.rawValueM!=null?Number(r.rawValueM).toLocaleString('es-ES')+' $M':'—'} | Convertido: ${r.value!=null?'$'+r.value+'T':'—'}`,
                  `Antigüedad: ${r.ageDays!=null?r.ageDays+'d':'—'} · ${fsn(r.freshness)} · Fuente: FRED WRESBAL`,
                  `Score: ${r.score!=null?r.score:'bloqueado'}${r.stale?' · STALE':''} [PROVISIONAL · thresholds fijos $3.5T/$2.5T]`,
                ].join('<br>');
              })()
            : 'Valor absoluto en $T · FRED WRESBAL (semanal) · automático',
          '≥$3.5T→+1  ·  $2.5-3.4T→−1  ·  <$2.5T→−2  ·  PROVISIONAL · peso ×1',
          (s, v) => s > 0
            ? `<strong style="color:var(--green)">+1 pt.</strong> Reservas $${v}T — liquidez sistémica elevada. Scoring provisional.`
            : s === -1
            ? `<strong style="color:var(--amber)">−1 pt.</strong> Reservas $${v}T — zona media. Scoring provisional.`
            : `<strong style="color:var(--red)">${s!=null?s:'—'} pts.</strong> Reservas ${v!=null?'$'+v+'T':'—'}. Scoring provisional.`)}

        ${liq.bbb ? `<div class="co-liq-card">
          <div class="co-liq-card-header"><span class="co-liq-card-title">📊 BBB Spread</span><span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${liq.bbb.date||'—'}</span></div>
          <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${col(liq.bbb.score)};">${f2(liq.bbb.value)}%</div>
          <div style="font-size:10px;color:var(--text2);font-family:var(--mono);margin-bottom:2px;">OAS · FRED BAMLC0A4CBBB</div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">≤1.00%→+1  ·  >1.00% y ≤1.50%→0  ·  >1.50%→−1  ·  PROVISIONAL · peso ×1</div>
          <div class="co-ind-bar-track" style="margin:8px 0 4px;"><div class="co-ind-bar-fill" style="width:${Math.min(liq.bbb.value/4*100,100)}%;background:${col(liq.bbb.score)};"></div></div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:8px 10px;line-height:1.8;">
            🔍 DEBUG BBB Spread<br>
            Fecha: ${liq.bbb.date||'—'} | BAMLC0A4CBBB: ${liq.bbb.value!=null?liq.bbb.value.toFixed(2)+'%':'—'}<br>
            Antigüedad: ${liq.bbb.ageDays!=null?liq.bbb.ageDays+'d':'—'} · ${liq.bbb.freshness==='ok'?'✓ OK':liq.bbb.freshness==='warn'?'⚠ WARN':'✗ STALE'} (≤7d OK | 8-10d WARN | >10d STALE)<br>
            Score: ${liq.bbb.score!=null?liq.bbb.score:'bloqueado'}${liq.bbb.stale?' · STALE':''} · Fuente: FRED BAMLC0A4CBBB [PROVISIONAL]
          </div>
          <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-top:8px;">
            ${liq.bbb.score>0?'<strong style="color:var(--green)">+1 pt.</strong> ≤1.00% — spreads contenidos, mercado tranquilo. Scoring provisional.':
              liq.bbb.score===0?'<strong style="color:var(--amber)">0 pts.</strong> >1.00% y ≤1.50% — neutral, coste de crédito moderado. Scoring provisional.':
              liq.bbb.score!=null?'<strong style="color:var(--red)">−1 pt.</strong> >1.50% — estrés crediticio, prima de riesgo elevada. Scoring provisional.':
              '<strong style="color:var(--text3)">— pts.</strong> Dato obsoleto o no disponible.'}
          </div>
        </div>` : ''}
      </div>

      <!-- IMPLICACIONES -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-top:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;">💡 Implicaciones para la estrategia</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">
            Liquidity Score: <span style="color:${reg.c};font-weight:700;">${reg.score>=0?'+':''}${reg.score}</span> / ${reg.maxAvailable} · cobertura ${Math.round(reg.coverage*100)}% · <span style="color:var(--amber)">PROVISIONAL</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:${reg.c};margin-bottom:6px;text-transform:uppercase;">Renta Variable</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${reg.score >= 4
                ? `Liquidity Score ${reg.score>=0?'+':''}${reg.score}: liquidez expansiva${liq.m2?.value!=null?' · M2 Global +'+f2(liq.m2.value)+'%':''}.`
                : reg.score >= 0
                ? `Liquidity Score ${reg.score>=0?'+':''}${reg.score}: liquidez neutral${liq.m2?.value!=null?' · M2 Global '+fsign(liq.m2.value)+'%':''}.`
                : `Liquidity Score ${reg.score}: liquidez contractiva${liq.m2?.value!=null?' · M2 Global '+fsign(liq.m2.value)+'%':''}.`}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:var(--amber);margin-bottom:6px;text-transform:uppercase;">Renta Fija</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${liq.bbb?.value != null
                ? `BBB OAS: ${f2(liq.bbb.value)}% — ${liq.bbb.value <= 1.0 ? 'spreads contenidos, mercado tranquilo.' : liq.bbb.value <= 1.5 ? 'spreads moderados, zona neutral.' : 'spreads elevados, estrés crediticio.'}`
                : 'BBB Spread no disponible.'}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:var(--blue);margin-bottom:6px;text-transform:uppercase;">Sizing</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${reg.score >= 4
                ? 'Liquidity Score expansivo: sizing normal.'
                : reg.score >= 0
                ? 'Liquidity Score neutral: sizing moderado, stops ajustados.'
                : 'Liquidity Score contractivo: sizing conservador.'}
              ${liq.reservas?.value != null ? ` Reservas Fed: $${f2(liq.reservas.value)}T.` : ''}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="co-footer" style="margin-top:16px;">Fuentes: FRED (M2SL, M2V, WRESBAL, BAMLC0A4CBBB, TOTLL, GDP, USALOLITOAASTSAM) · ECB (M2 EUR, Curva EUR) · BOJ vía Cloudflare Worker proxy (M2 JPN) · ChinaData.live PBoC (M2 CHN — pendiente automatización)</div>
    `;

    // Eventos manuales
    document.getElementById('liq-save-manuals')?.addEventListener('click', () => {
      const man = getManuals();
      document.querySelectorAll('.liq-manual-input').forEach(inp => {
        const v = inp.value.trim();
        man[inp.dataset.key] = v !== '' ? parseFloat(v) : null;
      });
      saveManuals(man);
      document.getElementById('liq-manual-panel').style.display = 'none';
      load(true);
    });
    document.getElementById('liq-close-manuals')?.addEventListener('click', () => {
      document.getElementById('liq-manual-panel').style.display = 'none';
    });
  }

  document.getElementById('liq-refresh')?.addEventListener('click', () => load(true));
  document.getElementById('liq-edit')?.addEventListener('click', () => {
    const p = document.getElementById('liq-manual-panel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
  });

  await load(false);
  return { destroy() {} };
}
