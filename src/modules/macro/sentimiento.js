import { getMacroData } from './macro-data.js';
const f1 = v => v != null ? Number(v).toFixed(1) : '—';
const f2 = v => v != null ? Number(v).toFixed(2) : '—';
const fsn = f => f==='ok'?'✓ OK':f==='warn'?'⚠ WARN':f==='stale'?'✗ STALE':'— sin fecha';

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="sent-refresh">↻ Actualizar</button>`;
  container.innerHTML = `<div id="sent-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;
  async function load(force = false) {
    try { const m = await getMacroData(force); paint(m); }
    catch(e) { document.getElementById('sent-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`; }
  }
  function paint(macro) {
    const el  = document.getElementById('sent-wrap');
    const seg = macro.seguimiento || {};
    const ind = macro.indicators  || {};
    const fg  = ind.fearGreed || seg.fearGreed;
    const vix = seg.vix;
    const hy  = seg.hySpread;
    // BBB eliminado de Sentimiento — vive en 1.2 Liquidez

    const fgVal   = fg?.freshness !== 'stale' ? (fg?.value ?? 50) : 50;
    const fgA     = (fgVal / 100) * Math.PI;
    const fgX     = 100 + 72 * Math.cos(Math.PI - fgA);
    const fgY     = 100 - 72 * Math.sin(fgA);
    const fgC     = fgVal > 75 ? 'var(--green)' : fgVal > 55 ? 'var(--amber)' : fgVal > 45 ? 'var(--text2)' : fgVal > 25 ? 'var(--amber)' : 'var(--red)';
    const fgLabel = fgVal > 75 ? 'Euforia Extrema' : fgVal > 55 ? 'Greed' : fgVal > 45 ? 'Neutral' : fgVal > 25 ? 'Fear' : 'Miedo Extremo';
    const contrarian    = fgVal < 40 ? 'POSITIVO' : fgVal < 55 ? 'NEUTRO' : 'PRECAUCIÓN';
    const contrarianCol = fgVal < 40 ? 'var(--green)' : fgVal < 55 ? 'var(--amber)' : 'var(--red)';

    el.innerHTML = `
      <!-- FILA PRINCIPAL: Gauge + Conclusión -->
      <div style="display:grid;grid-template-columns:220px 1fr;gap:14px;margin-bottom:14px;">

        <!-- Gauge F&G -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <svg viewBox="0 0 200 115" style="width:185px;">
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="var(--surface2)" stroke-width="14" stroke-linecap="round"/>
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="url(#fgSG)" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="${(Math.PI*72).toFixed(1)}" stroke-dashoffset="${(Math.PI*72*(1-fgVal/100)).toFixed(1)}"/>
            <defs><linearGradient id="fgSG" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--red)"/>
              <stop offset="50%" stop-color="var(--amber)"/>
              <stop offset="100%" stop-color="var(--green)"/>
            </linearGradient></defs>
            <line x1="100" y1="100" x2="${fgX.toFixed(1)}" y2="${fgY.toFixed(1)}" stroke="var(--teal)" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="100" cy="100" r="5" fill="var(--teal)"/>
            <text x="100" y="82" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" font-weight="700" fill="${fgC}">${fgVal}</text>
            <text x="100" y="100" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="var(--text2)">${fgLabel}</text>
            <text x="28"  y="114" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">Fear</text>
            <text x="172" y="114" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--green)">Greed</text>
          </svg>
          ${fg ? `<div style="display:flex;gap:5px;justify-content:center;font-size:9px;font-family:var(--mono);color:var(--text3);margin-top:5px;">
            <span>1d:${fg.previousClose??'—'}</span><span>·</span><span>1s:${fg.previousWeek??'—'}</span><span>·</span><span>1m:${fg.previousMonth??'—'}</span>
          </div>` : ''}
          <!-- DEBUG F&G -->
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);margin-top:8px;background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:6px 8px;width:100%;text-align:left;line-height:1.7;">
            🔍 F&G<br>
            Valor: ${fg?.value??'—'} · Score: ${fg?.score??'—'}<br>
            Fecha: ${fg?.date||'sin fecha'} · ${fg?.ageDays!=null?fg.ageDays+'d':'—'} · ${fsn(fg?.freshness)}<br>
            Fuente: ${fg?.source||'—'}<br>
            <span style="color:var(--amber);">PROVISIONAL · &lt;40→+1 | 40-54→0 | &gt;54→−1</span>
          </div>
        </div>

        <div>
          <!-- Conclusión contrarian -->
          <div class="mac-card" style="margin-bottom:12px;background:rgba(${fgVal<40?'74,222,128':fgVal<55?'251,191,36':'244,113,116'},0.04);border-color:rgba(${fgVal<40?'74,222,128':fgVal<55?'251,191,36':'244,113,116'},0.2);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">
              Lectura Contrarian · <span style="color:var(--amber);">solo basada en Fear &amp; Greed [PROVISIONAL]</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <div>
                <div style="font-size:11px;color:var(--text2);">El mercado siente</div>
                <div style="font-family:var(--serif);font-size:24px;font-weight:600;font-style:italic;color:${fgC};">${fgLabel}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;color:var(--text2);">Señal contrarian</div>
                <div style="font-family:var(--serif);font-size:24px;font-weight:600;font-style:italic;color:${contrarianCol};">${contrarian}</div>
              </div>
            </div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">
              ${fgVal > 55
                ? `Mercado codicioso (${fgVal}). Euforia con macro deteriorándose ha precedido correcciones históricamente. <em style="color:var(--text3)">Umbral provisional: >54.</em>`
                : fgVal < 40
                ? `Mercado con miedo (${fgVal}). Señal contrarian alcista — el pánico crea oportunidades si el macro lo soporta. <em style="color:var(--text3)">Umbral provisional: <40.</em>`
                : `Mercado neutral (${fgVal}). Sin señal extrema. <em style="color:var(--text3)">Umbral provisional: 40-54.</em>`}
            </div>
          </div>

          <!-- VIX + HY (sin BBB) -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

            <!-- VIX -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;">
                VIX vs SMA200 <span style="float:right;color:var(--teal)">Yahoo Finance</span>
              </div>
              ${vix?.valid === false ? `
                <div style="font-size:10px;color:var(--amber);font-family:var(--mono);">⚠ ${vix.error}</div>
              ` : vix ? `
                <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${vix.aboveSMA200?'var(--red)':'var(--green)'};">${f1(vix.value)}</div>
                <div style="font-size:9px;font-family:var(--mono);color:${vix.aboveSMA200?'var(--red)':'var(--green)'};margin:4px 0;">
                  ${vix.aboveSMA200?'⚠ SOBRE':'↓ BAJO'} SMA200 (${f1(vix.sma200)})
                </div>
                <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:8px;">
                  <div style="height:100%;width:${Math.min(vix.value/60*100,100)}%;background:${vix.aboveSMA200?'var(--red)':'var(--green)'};border-radius:2px;"></div>
                </div>
                <div style="font-size:9px;font-family:var(--mono);color:var(--text3);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:6px 8px;line-height:1.7;">
                  🔍 VIX<br>
                  Fecha: ${vix.date||'—'} · ${vix.ageDays!=null?vix.ageDays+'d':'—'} · ${fsn(vix.freshness)}<br>
                  VIX: ${f1(vix.value)} | SMA200: ${f1(vix.sma200)}<br>
                  Sesiones usadas: ${vix.sessionsUsed||'—'} (mín. 200)<br>
                  <span style="color:var(--amber);">PROVISIONAL · sin scoring numérico</span>
                </div>
              ` : '<div style="font-size:10px;color:var(--text3);">Sin datos VIX</div>'}
            </div>

            <!-- HY Spread -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;">
                HY Spread <span style="float:right;color:var(--teal)">FRED BAMLH0A0HYM2</span>
              </div>
              ${hy ? `
                <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${hy.freshness==='stale'?'var(--text3)':hy.value<3.5?'var(--green)':hy.value<5?'var(--amber)':'var(--red)'};">
                  ${hy.freshness==='stale'?'STALE':f2(hy.value)+'%'}
                </div>
                <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin:8px 0;">
                  <div style="height:100%;width:${Math.min((hy.value||0)/12*100,100)}%;background:${hy.value<3.5?'var(--green)':hy.value<5?'var(--amber)':'var(--red)'};border-radius:2px;"></div>
                </div>
                <div style="font-size:9px;font-family:var(--mono);color:var(--text3);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:6px 8px;line-height:1.7;">
                  🔍 HY Spread<br>
                  Fecha: ${hy.date||'—'} · ${hy.ageDays!=null?hy.ageDays+'d':'—'} · ${fsn(hy.freshness)}<br>
                  OAS: ${f2(hy.value)}% · BAMLH0A0HYM2<br>
                  Clasificación: ${hy.value<3.5?'Sin estrés':hy.value<5?'Alerta':' Estrés severo'} [PROVISIONAL]<br>
                  <span style="color:var(--amber);">&lt;3.5→sin estrés | &lt;5→alerta | ≥5→severo · sin scoring numérico</span>
                </div>
              ` : '<div style="font-size:10px;color:var(--text3);">Sin datos HY Spread</div>'}
            </div>
          </div>
        </div>
      </div>

      <div style="font-size:9px;font-family:var(--mono);color:var(--amber);background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 12px;margin-bottom:14px;">
        ⚠ Sentiment Score pendiente de diseño. BBB Spread eliminado (vive en 1.2 Liquidez). Conclusión contrarian basada solo en Fear &amp; Greed [PROVISIONAL]. VIX y HY sin scoring numérico todavía.
      </div>

      <div class="co-footer">Fuentes: CNN Fear &amp; Greed (primaria) · Yahoo Finance VIX (SMA200, 2Y) · FRED BAMLH0A0HYM2 (HY OAS) · BBB → 1.2 Liquidez</div>
    `;
  }
  document.getElementById('sent-refresh')?.addEventListener('click', () => load(true));
  await load(false);
  return { destroy() {} };
}
