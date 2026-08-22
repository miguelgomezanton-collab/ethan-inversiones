import { getMacroData } from './macro-data.js';
const f2 = v => v != null ? Number(v).toFixed(2) : '—';
const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'—';

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="pm-refresh">↻ Actualizar</button>`;
  container.innerHTML = `<div id="pm-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;

  async function load(force = false) {
    try { const m = await getMacroData(force); paint(m); }
    catch(e) { document.getElementById('pm-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`; }
  }

  function paint(macro) {
    const el  = document.getElementById('pm-wrap');
    const co  = macro.coyuntura  || {};
    const seg = macro.seguimiento || {};
    const tr  = co.tipoReal;
    const ffr = seg.ffr;

    // Dirección reciente FFR — buscar por fecha real (t−91 días), no por posición
    // DFF es diario: ffrHistory viene desc, necesitamos obs más cercana a hace ~3 meses
    const ffrHistory = seg.ffrHistory || [];
    const currentFfrDate = ffr?.date ? new Date(ffr.date).getTime() : null;
    const target3mMs = currentFfrDate ? currentFfrDate - 91 * 24 * 60 * 60 * 1000 : null;
    const ffr3m = target3mMs ? ffrHistory.reduce((best, o) => {
      const diff = Math.abs(new Date(o.date).getTime() - target3mMs);
      return (!best || diff < Math.abs(new Date(best.date).getTime() - target3mMs)) ? o : best;
    }, null) : null;
    const ffr3mGapDays = ffr3m ? Math.round(Math.abs(new Date(ffr3m.date).getTime() - target3mMs) / 86400000) : null;
    const ffr3mValid = ffr3mGapDays != null && ffr3mGapDays <= 7;
    // Delta en puntos básicos (pb = pp × 100)
    const ffrDeltaPb = (ffr && ffr3m && ffr3mValid)
      ? Math.round((ffr.value - ffr3m.value) * 100)
      : null;
    const ffrDir = ffrDeltaPb == null ? '—'
      : ffrDeltaPb > 25  ? '↑ Endureciendo'
      : ffrDeltaPb < -25 ? '↓ Relajando'
      : '→ Estable';
    const ffrDirCol = ffrDeltaPb == null ? 'var(--text3)'
      : ffrDeltaPb > 25  ? 'var(--red)'
      : ffrDeltaPb < -25 ? 'var(--green)'
      : 'var(--amber)';

    // Stance — basado exclusivamente en tipo real (mismos umbrales que scTipoReal)
    const trVal = tr?.value ?? null;
    const stance = trVal != null ? Math.min(100, Math.max(0, ((trVal + 3) / 6) * 100)) : 50;
    const stanceLabel = trVal == null ? '—'
      : trVal >= 1.5 ? 'Muy Restrictiva'
      : trVal >= 1.0 ? 'Restrictiva'
      : trVal >= 0.5 ? 'Neutral'
      : trVal >= 0.0 ? 'Acomodaticia'
      : 'Muy Acomodaticia';
    const stanceCol = trVal == null ? 'var(--text3)'
      : trVal >= 1.0 ? 'var(--red)'
      : trVal >= 0.5 ? 'var(--amber)'
      : 'var(--green)';

    el.innerHTML = `
      <!-- STANCE BAR -->
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Stance de Política Monetaria · Fed</div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">PROVISIONAL · Fase 1 · Tipo Real como proxy único</div>
        </div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;color:${stanceCol};margin-bottom:10px;">${stanceLabel}</div>
        <div style="height:14px;background:var(--surface2);border-radius:7px;overflow:hidden;position:relative;margin-bottom:6px;">
          <div style="height:100%;width:100%;background:linear-gradient(90deg,var(--green),var(--amber) 40%,var(--red));border-radius:7px;"></div>
          <div style="position:absolute;top:50%;left:${stance}%;transform:translate(-50%,-50%);width:4px;height:18px;background:var(--text1);border-radius:2px;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:10px;">
          <span style="color:var(--green)">Muy Acomodaticia</span><span>Neutral</span><span style="color:var(--red)">Muy Restrictiva</span>
        </div>
        <div style="font-size:11px;color:var(--text2);line-height:1.7;">
          ${trVal != null
            ? `Tipo real <strong style="color:var(--text1)">${trVal>=0?'+':''}${f2(trVal)}%</strong> → <strong style="color:${stanceCol}">${stanceLabel}</strong>.
              ${trVal>=1.5?'Restricción significativa — históricamente asociada a desaceleración del crédito y presión sobre valoraciones.':
                trVal>=1.0?'Política restrictiva — frena consumo e inversión por encima de la inflación.':
                trVal>=0.5?'Zona neutral — la tasa real no estimula ni restringe significativamente.':
                trVal>=0.0?'Política acomodaticia — tipo real positivo pero bajo, condiciones financieras laxas.':
                'Tipo real negativo — política expansiva, potencial riesgo inflacionario estructural.'}
              <em style="color:var(--text3);font-size:10px;">Scoring provisional. Fase 2 incorporará balance Fed y expectativas de tipos.</em>`
            : 'Sin datos de tipo real disponibles.'}
        </div>
      </div>

      <!-- 3 TARJETAS: FFR · TIPO REAL · DIRECCIÓN -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">

        <!-- 1. FFR efectivo -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Fed Funds efectivo <span style="float:right;color:var(--teal)">FRED DFF</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:var(--amber);">
            ${ffr?.value != null ? f2(ffr.value)+'%' : '—'}
          </div>
          <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin:8px 0 6px;">
            <div style="height:100%;width:${ffr?.value!=null?Math.min(ffr.value/8*100,100):0}%;background:var(--amber);border-radius:3px;"></div>
          </div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);line-height:1.7;">
            Fecha: ${ffr?.date||'—'}<br>
            Freshness: ${tr?.ffr?.ageDays!=null?tr.ffr.ageDays+'d':'—'} · ${fsn(tr?.ffr?.freshness)}<br>
            Fuente: FRED DFF (diario)
          </div>
        </div>

        <!-- 2. Tipo Real -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Tipo Real (FFR − CPI) <span style="float:right;color:var(--teal)">AUTO</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${tr?.score>0?'var(--green)':tr?.score===0?'var(--amber)':'var(--red)'};">
            ${tr?.value != null ? (tr.value>=0?'+':'')+f2(tr.value)+'%' : '—'}
          </div>
          <div style="position:relative;height:5px;background:var(--surface2);border-radius:3px;margin:8px 0 6px;">
            ${tr?.value!=null&&tr.value>=0?`<div style="position:absolute;left:50%;width:${Math.min(tr.value*16,50)}%;height:100%;background:${tr.score>0?'var(--green)':'var(--amber)'};border-radius:0 3px 3px 0;"></div>`:''}
            ${tr?.value!=null&&tr.value<0?`<div style="position:absolute;right:50%;width:${Math.min(Math.abs(tr.value)*16,50)}%;height:100%;background:var(--red);border-radius:3px 0 0 3px;"></div>`:''}
            <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
          </div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:8px 10px;line-height:1.8;">
            🔍 DEBUG<br>
            DFF: ${tr?.ffr?.date||'—'} | ${tr?.ffr?.value!=null?f2(tr.ffr.value)+'%':'—'} | ${fsn(tr?.ffr?.freshness)}<br>
            CPI: ${tr?.cpi?.date||'—'} | YoY ${tr?.cpi?.yoy!=null?f2(tr.cpi.yoy)+'%':'—'} | base ${tr?.cpi?.baseDate||'—'} | ${fsn(tr?.cpi?.freshness)}<br>
            = ${tr?.ffr?.value!=null?f2(tr.ffr.value):'—'} − ${tr?.cpi?.yoy!=null?f2(tr.cpi.yoy):'—'} = ${tr?.value!=null?(tr.value>=0?'+':'')+f2(tr.value)+'%':'—'}<br>
            Score: ${tr?.score!=null?tr.score:'bloqueado'}${tr?.stale?' · STALE':''} · ≥+1.0→+1 · ≥+0.5→0 · <+0.5→−1 [PROVISIONAL]
          </div>
        </div>

        <!-- 3. Dirección reciente FFR -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Dirección reciente · FFR 3M <span style="float:right;color:var(--amber)">FASE 1</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${ffrDirCol};">
            ${ffrDeltaPb != null ? (ffrDeltaPb>=0?'+':'')+ffrDeltaPb+' pb' : '—'}
          </div>
          <div style="font-size:16px;color:${ffrDirCol};margin:6px 0;font-family:var(--mono);">${ffrDir}</div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:8px 10px;margin-top:6px;line-height:1.8;">
            🔍 DEBUG Dirección FFR<br>
            Actual: ${ffr?.date||'—'} | ${ffr?.value!=null?f2(ffr.value)+'%':'—'}<br>
            Ref. ~3M: ${ffr3m?.date||'—'} | ${ffr3m?.value!=null?f2(ffr3m.value)+'%':'—'}${!ffr3mValid&&ffr3m?' ⚠ gap '+ffr3mGapDays+'d >7d':ffr3m?' ✓':''}}<br>
            Δ3M: ${ffrDeltaPb!=null?(ffrDeltaPb>=0?'+':'')+ffrDeltaPb+' pb':'—'} · gap al objetivo: ${ffr3mGapDays!=null?ffr3mGapDays+'d':'—'} · ${ffr3mValid?'✓ OK (≤7d)':'⚠ fuera tolerancia ±7d'}<br>
            <span style="color:var(--amber)">⚠ Proxy acciones pasadas Fed — no forward-looking. Fase 2 → CME Futures.</span>
          </div>
        </div>
      </div>

      <!-- PENDIENTES FASE 2 -->
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">📋 Fase 2 — Pendiente de implementación</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div>⏳ Expectativas Fed (CME Futures)<br><span style="color:var(--text3)">Forward-looking · precios de mercado</span></div>
          <div>⏳ Balance Fed (WALCL)<br><span style="color:var(--text3)">QT/QE · expansión/contracción</span></div>
          <div>⏳ Core PCE como alternativa a CPI<br><span style="color:var(--text3)">Referencia estructural de la Fed</span></div>
        </div>
      </div>

      <div class="co-footer">Fuentes: FRED DFF · FRED CPIAUCSL · Reservas/BBB → 1.2 Liquidez</div>
    `;
  }

  document.getElementById('pm-refresh')?.addEventListener('click', () => load(true));
  await load(false);
  return { destroy() {} };
}
