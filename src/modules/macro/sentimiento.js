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
    const el   = document.getElementById('sent-wrap');
    const seg  = macro.seguimiento || {};
    const ind  = macro.indicators  || {};
    const ss   = macro.sentimentScore || {};
    const fg   = ind.fearGreed || seg.fearGreed;
    const vix  = seg.vix;
    const hy   = seg.hySpread;

    // Gauge Fear & Greed
    const fgVal   = fg?.freshness !== 'stale' ? (fg?.value ?? 50) : 50;
    const fgA     = (fgVal / 100) * Math.PI;
    const fgX     = 100 + 72 * Math.cos(Math.PI - fgA);
    const fgY     = 100 - 72 * Math.sin(fgA);
    const fgC     = fgVal > 74 ? 'var(--green)' : fgVal >= 55 ? 'var(--amber)' : fgVal > 45 ? 'var(--text2)' : fgVal >= 25 ? 'var(--amber)' : 'var(--red)';
    const fgLabel = fgVal > 74 ? 'Euforia Extrema' : fgVal >= 55 ? 'Greed' : fgVal > 45 ? 'Neutral' : fgVal >= 25 ? 'Fear' : 'Miedo Extremo';

    // Regime color
    const regimeCol = ss.regime === 'Risk-On' ? 'var(--green)' : ss.regime === 'Risk-Off' ? 'var(--red)' : ss.regime === 'INSUFFICIENT DATA' ? 'var(--text3)' : 'var(--amber)';

    // Score component detail
    const fgComp  = ss.components?.find(c => c.key === 'fg');
    const vixComp = ss.components?.find(c => c.key === 'vix');
    const hyComp  = ss.components?.find(c => c.key === 'hy');
    const scoreCol = s => s > 0 ? 'var(--green)' : s < 0 ? 'var(--red)' : 'var(--amber)';

    el.innerHTML = `
      <!-- SENTIMENT SCORE HEADER -->
      <div class="mac-card" style="margin-bottom:14px;background:rgba(${ss.regime==='Risk-On'?'74,222,128':ss.regime==='Risk-Off'?'244,113,116':'251,191,36'},0.04);border-color:rgba(${ss.regime==='Risk-On'?'74,222,128':ss.regime==='Risk-Off'?'244,113,116':'251,191,36'},0.2);">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Sentiment Score · Risk-On / Risk-Off</div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">
            ${ss.raw!=null?ss.raw>=0?'+'+ss.raw:ss.raw:'—'} / ${ss.available||0} disponibles · cobertura ${ss.coverage!=null?Math.round(ss.coverage*100)+'%':'—'} · <span style="color:var(--amber);">PROVISIONAL</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:20px;margin-bottom:12px;">
          <div>
            <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${regimeCol};">${ss.regime||'—'}</div>
            <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
              ${ss.regime==='Risk-On'?'+2/+3 → Risk-On · mercado con apetito por riesgo':
                ss.regime==='Risk-Off'?'−1/−3 → Risk-Off · aversión al riesgo':
                ss.regime==='INSUFFICIENT DATA'?'Cobertura insuficiente — mínimo 2/3 indicadores':
                '0/+1 → Neutral · sin señal clara'}
            </div>
          </div>
          <!-- Mini scorecard -->
          <div style="display:flex;gap:6px;flex:1;">
            ${[
              { label: 'F&G', comp: fgComp, val: fg?.freshness!=='stale'?fgVal:null, sub: fgVal!=null?fgVal+' pts':'STALE' },
              { label: 'VIX', comp: vixComp, val: vix?.valid?vix.value:null, sub: vix?.valid?(vix.aboveSMA200?'↑ SMA200':'↓ SMA200'):(vix?.error||'—') },
              { label: 'HY',  comp: hyComp,  val: hy?.freshness!=='stale'?hy?.value:null, sub: hy?.value!=null?hy.value+'%':'STALE' },
            ].map(({ label, comp, val, sub }) => `
              <div style="flex:1;background:var(--surface2);border-radius:8px;padding:10px;text-align:center;">
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${label}</div>
                <div style="font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;color:${comp?scoreCol(comp.score):'var(--text3)'};">${comp!=null?(comp.score>=0?'+':'')+comp.score:'—'}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px;">${sub}</div>
              </div>`).join('')}
          </div>
        </div>
        <!-- Contrarian signal separado -->
        <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">Señal Contrarian (informativa · solo F&G extremos)</div>
          <div style="font-size:11px;font-weight:700;font-family:var(--mono);color:${ss.contrarian==='OPORTUNIDAD CONTRARIAN'?'var(--green)':ss.contrarian==='PRECAUCIÓN CONTRARIAN'?'var(--red)':'var(--text3)'};">
            ${ss.contrarian||'—'}
          </div>
        </div>
      </div>

      <!-- 3 TARJETAS DE INDICADORES -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">

        <!-- F&G -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Fear & Greed <span style="float:right;color:var(--teal)">CNN</span></div>
          <svg viewBox="0 0 200 115" style="width:100%;max-width:160px;display:block;margin:0 auto 8px;">
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="var(--surface2)" stroke-width="14" stroke-linecap="round"/>
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="url(#fgSG2)" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="${(Math.PI*72).toFixed(1)}" stroke-dashoffset="${(Math.PI*72*(1-fgVal/100)).toFixed(1)}"/>
            <defs><linearGradient id="fgSG2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--red)"/><stop offset="50%" stop-color="var(--amber)"/><stop offset="100%" stop-color="var(--green)"/>
            </linearGradient></defs>
            <line x1="100" y1="100" x2="${fgX.toFixed(1)}" y2="${fgY.toFixed(1)}" stroke="var(--teal)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="100" cy="100" r="4" fill="var(--teal)"/>
            <text x="100" y="84" text-anchor="middle" font-family="IBM Plex Mono" font-size="20" font-weight="700" fill="${fgC}">${fgVal}</text>
            <text x="100" y="100" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--text2)">${fgLabel}</text>
          </svg>
          ${fg?`<div style="display:flex;gap:4px;justify-content:center;font-size:9px;font-family:var(--mono);color:var(--text3);margin-bottom:8px;">
            <span>1d:${fg.previousClose??'—'}</span><span>·</span><span>1s:${fg.previousWeek??'—'}</span><span>·</span><span>1m:${fg.previousMonth??'—'}</span>
          </div>` : ''}
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.12);border-radius:6px;padding:6px 8px;line-height:1.7;">
            🔍 F&G<br>
            ${fg?.value??'—'} · ${fg?.date||'sin fecha'} · ${fg?.ageDays!=null?fg.ageDays+'d':'—'} · ${fsn(fg?.freshness)}<br>
            Fuente: ${fg?.source||'—'}${fg?.source&&fg.source!=='CNN'?` <strong style="color:var(--amber);">⚠ FALLBACK / PROXY — no es dato CNN directo</strong>`:''}<br>
            Score risk-on: ${fgComp?fgComp.score>=0?'+'+fgComp.score:fgComp.score:'excluido (STALE)'} · <25→−1 | 25–54→0 | ≥55→+1
          </div>
        </div>

        <!-- VIX -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">VIX vs SMA200 <span style="float:right;color:var(--teal)">Yahoo</span></div>
          ${vix?.valid === false ? `
            <div style="font-size:10px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">⚠ ${vix.error}</div>
          ` : vix?.valid ? `
            <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${vix.aboveSMA200?'var(--red)':'var(--green)'};">${f1(vix.value)}</div>
            <div style="font-size:10px;font-family:var(--mono);color:${vix.aboveSMA200?'var(--red)':'var(--green)'};margin:4px 0;">
              ${vix.aboveSMA200?'⚠ SOBRE':'↓ BAJO'} SMA200 · ${f1(vix.sma200)}
            </div>
            <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:8px;">
              <div style="height:100%;width:${Math.min(vix.value/60*100,100)}%;background:${vix.aboveSMA200?'var(--red)':'var(--green)'};border-radius:2px;"></div>
            </div>
          ` : '<div style="font-size:10px;color:var(--text3);margin-bottom:8px;">Sin datos VIX</div>'}
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.12);border-radius:6px;padding:6px 8px;line-height:1.7;">
            🔍 VIX<br>
            ${vix?.date||'—'} · ${vix?.ageDays!=null?vix.ageDays+'d':'—'} · ${fsn(vix?.freshness)}<br>
            Sesiones: ${vix?.sessionsUsed||'—'} (mín. 200 para SMA200)<br>
            Score risk-on: ${vixComp?vixComp.score>=0?'+'+vixComp.score:vixComp.score:'excluido'} · &lt;SMA200→+1 | ≥SMA200→−1
          </div>
        </div>

        <!-- HY -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">HY Spread <span style="float:right;color:var(--teal)">FRED</span></div>
          ${hy ? `
            <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${hy.freshness==='stale'?'var(--text3)':hy.value<3.5?'var(--green)':hy.value<=5?'var(--amber)':'var(--red)'};">
              ${hy.freshness==='stale'?'STALE':f2(hy.value)+'%'}
            </div>
            <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin:8px 0;">
              <div style="height:100%;width:${Math.min((hy.value||0)/12*100,100)}%;background:${hy.value<3.5?'var(--green)':hy.value<=5?'var(--amber)':'var(--red)'};border-radius:2px;"></div>
            </div>
          ` : '<div style="font-size:10px;color:var(--text3);margin-bottom:8px;">Sin datos HY</div>'}
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.12);border-radius:6px;padding:6px 8px;line-height:1.7;">
            🔍 HY OAS<br>
            ${hy?.date||'—'} · ${hy?.ageDays!=null?hy.ageDays+'d':'—'} · ${fsn(hy?.freshness)}<br>
            BAMLH0A0HYM2 · OAS: ${hy?.value!=null?f2(hy.value)+'%':'—'}<br>
            Score risk-on: ${hyComp?hyComp.score>=0?'+'+hyComp.score:hyComp.score:'excluido (STALE)'} · &lt;3.5%→+1 | 3.5–5%→0 | &gt;5%→−1
          </div>
        </div>
      </div>

      <div style="font-size:9px;font-family:var(--mono);color:var(--amber);background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 12px;margin-bottom:14px;">
        ⚠ Sentiment Score PROVISIONAL. Thresholds sin calibración histórica. BBB eliminado (→ 1.2 Liquidez). Contrarian signal informativo — no entra en Sentiment Score.
      </div>

      <div class="co-footer">Fuentes: CNN Fear &amp; Greed · Yahoo Finance ^VIX (SMA200 · ${vix?.sessionsUsed||'—'} sesiones) · FRED BAMLH0A0HYM2</div>
    `;
  }
  document.getElementById('sent-refresh')?.addEventListener('click', () => load(true));
  await load(false);
  return { destroy() {} };
}
