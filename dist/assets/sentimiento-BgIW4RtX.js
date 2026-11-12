import{g as L}from"./macro-data-CGVdt8ED.js";const h=s=>s!=null?Number(s).toFixed(1):"—",A=s=>s!=null?Number(s).toFixed(2):"—",m=s=>s==="ok"?"✓ OK":s==="warn"?"⚠ WARN":s==="stale"?"✗ STALE":"— sin fecha";async function T(s,{actionsSlot:S}){var u;S.innerHTML='<button class="btn btn-primary" id="sent-refresh">↻ Actualizar</button>',s.innerHTML='<div id="sent-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function g(n=!1){try{const l=await L(n);M(l)}catch(l){document.getElementById("sent-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${l.message}</div></div>`}}function M(n){var y,b,$;const l=document.getElementById("sent-wrap"),f=n.seguimiento||{},k=n.indicators||{},r=n.sentimentScore||{},t=k.fearGreed||f.fearGreed,e=f.vix,a=f.hySpread,o=(t==null?void 0:t.freshness)!=="stale"?(t==null?void 0:t.value)??50:50,x=o/100*Math.PI,I=100+72*Math.cos(Math.PI-x),w=100-72*Math.sin(x),O=o>74?"var(--green)":o>=55?"var(--amber)":o>45?"var(--text2)":o>=25?"var(--amber)":"var(--red)",R=o>74?"Euforia Extrema":o>=55?"Greed":o>45?"Neutral":o>=25?"Fear":"Miedo Extremo",E=r.regime==="Risk-On"?"var(--green)":r.regime==="Risk-Off"?"var(--red)":r.regime==="INSUFFICIENT DATA"?"var(--text3)":"var(--amber)",d=(y=r.components)==null?void 0:y.find(i=>i.key==="fg"),c=(b=r.components)==null?void 0:b.find(i=>i.key==="vix"),v=($=r.components)==null?void 0:$.find(i=>i.key==="hy"),N=i=>i>0?"var(--green)":i<0?"var(--red)":"var(--amber)";l.innerHTML=`
      <!-- SENTIMENT SCORE HEADER -->
      <div class="mac-card" style="margin-bottom:14px;background:rgba(${r.regime==="Risk-On"?"74,222,128":r.regime==="Risk-Off"?"244,113,116":"251,191,36"},0.04);border-color:rgba(${r.regime==="Risk-On"?"74,222,128":r.regime==="Risk-Off"?"244,113,116":"251,191,36"},0.2);">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Sentiment Score · Risk-On / Risk-Off</div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">
            ${r.raw!=null?r.raw>=0?"+"+r.raw:r.raw:"—"} / ${r.available||0} disponibles · cobertura ${r.coverage!=null?Math.round(r.coverage*100)+"%":"—"} · <span style="color:var(--amber);">PROVISIONAL</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:20px;margin-bottom:12px;">
          <div>
            <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${E};">${r.regime||"—"}</div>
            <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
              ${r.regime==="Risk-On"?"+2/+3 → Risk-On · mercado con apetito por riesgo":r.regime==="Risk-Off"?"−1/−3 → Risk-Off · aversión al riesgo":r.regime==="INSUFFICIENT DATA"?"Cobertura insuficiente — mínimo 2/3 indicadores":"0/+1 → Neutral · sin señal clara"}
            </div>
          </div>
          <!-- Mini scorecard -->
          <div style="display:flex;gap:6px;flex:1;">
            ${[{label:"F&G",comp:d,val:(t==null?void 0:t.freshness)!=="stale"?o:null,sub:o!=null?o+" pts":"STALE"},{label:"VIX",comp:c,val:e!=null&&e.valid?e.value:null,sub:e!=null&&e.valid?e.aboveSMA200?"↑ SMA200":"↓ SMA200":(e==null?void 0:e.error)||"—"},{label:"HY",comp:v,val:(a==null?void 0:a.freshness)!=="stale"?a==null?void 0:a.value:null,sub:(a==null?void 0:a.value)!=null?a.value+"%":"STALE"}].map(({label:i,comp:p,val:z,sub:C})=>`
              <div style="flex:1;background:var(--surface2);border-radius:8px;padding:10px;text-align:center;">
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${i}</div>
                <div style="font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;color:${p?N(p.score):"var(--text3)"};">${p!=null?(p.score>=0?"+":"")+p.score:"—"}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px;">${C}</div>
              </div>`).join("")}
          </div>
        </div>
        <!-- Contrarian signal separado -->
        <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">Señal Contrarian (informativa · solo F&G extremos)</div>
          <div style="font-size:11px;font-weight:700;font-family:var(--mono);color:${r.contrarian==="OPORTUNIDAD CONTRARIAN"?"var(--green)":r.contrarian==="PRECAUCIÓN CONTRARIAN"?"var(--red)":"var(--text3)"};">
            ${r.contrarian||"—"}
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
              stroke-dasharray="${(Math.PI*72).toFixed(1)}" stroke-dashoffset="${(Math.PI*72*(1-o/100)).toFixed(1)}"/>
            <defs><linearGradient id="fgSG2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--red)"/><stop offset="50%" stop-color="var(--amber)"/><stop offset="100%" stop-color="var(--green)"/>
            </linearGradient></defs>
            <line x1="100" y1="100" x2="${I.toFixed(1)}" y2="${w.toFixed(1)}" stroke="var(--teal)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="100" cy="100" r="4" fill="var(--teal)"/>
            <text x="100" y="84" text-anchor="middle" font-family="IBM Plex Mono" font-size="20" font-weight="700" fill="${O}">${o}</text>
            <text x="100" y="100" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--text2)">${R}</text>
          </svg>
          ${t?`<div style="display:flex;gap:4px;justify-content:center;font-size:9px;font-family:var(--mono);color:var(--text3);margin-bottom:8px;">
            <span>1d:${t.previousClose??"—"}</span><span>·</span><span>1s:${t.previousWeek??"—"}</span><span>·</span><span>1m:${t.previousMonth??"—"}</span>
          </div>`:""}
          <div class="audit-toggle" onclick="this.classList.toggle('open')" style="margin-top:8px;">
            <span class="audit-lbl">Metodología ▾</span>
            <div class="audit-body">
              ${(t==null?void 0:t.value)??"—"} · ${(t==null?void 0:t.date)||"sin fecha"} · ${(t==null?void 0:t.ageDays)!=null?t.ageDays+"d":"—"} · ${m(t==null?void 0:t.freshness)}<br>
              Fuente: ${(t==null?void 0:t.source)||"—"}${t!=null&&t.source&&t.source!=="CNN"?' <strong style="color:var(--amber);">⚠ FALLBACK / PROXY</strong>':""}<br>
              Score risk-on: ${d?d.score>=0?"+"+d.score:d.score:"excluido (STALE)"} · &lt;25→−1 | 25–54→0 | ≥55→+1<br>
              Score contrarian (informativo): ${(t==null?void 0:t.scoreContrarian)!=null?t.scoreContrarian:"—"} · LIVE_ONLY · no entra en scoreTotal
            </div>
          </div>
        </div>

        <!-- VIX -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">VIX vs SMA200 <span style="float:right;color:var(--teal)">Yahoo</span></div>
          ${(e==null?void 0:e.valid)===!1?`
            <div style="font-size:10px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">⚠ ${e.error}</div>
          `:e!=null&&e.valid?`
            <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${e.aboveSMA200?"var(--red)":"var(--green)"};">${h(e.value)}</div>
            <div style="font-size:10px;font-family:var(--mono);color:${e.aboveSMA200?"var(--red)":"var(--green)"};margin:4px 0;">
              ${e.aboveSMA200?"⚠ SOBRE":"↓ BAJO"} SMA200 · ${h(e.sma200)}
            </div>
            <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:8px;">
              <div style="height:100%;width:${Math.min(e.value/60*100,100)}%;background:${e.aboveSMA200?"var(--red)":"var(--green)"};border-radius:2px;"></div>
            </div>
          `:'<div style="font-size:10px;color:var(--text3);margin-bottom:8px;">Sin datos VIX</div>'}
          <div class="audit-toggle" onclick="this.classList.toggle('open')">
            <span class="audit-lbl">Metodología ▾</span>
            <div class="audit-body">
              ${(e==null?void 0:e.date)||"—"} · ${(e==null?void 0:e.ageDays)!=null?e.ageDays+"d":"—"} · ${m(e==null?void 0:e.freshness)}<br>
              Sesiones: ${(e==null?void 0:e.sessionsUsed)||"—"} (mín. 200 para SMA200) · ^VIX Yahoo Finance<br>
              Score risk-on: ${c?c.score>=0?"+"+c.score:c.score:"excluido"} · &lt;SMA200→+1 | ≥SMA200→−1 · [PROVISIONAL]
            </div>
          </div>
        </div>

        <!-- HY -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">HY Spread <span style="float:right;color:var(--teal)">FRED</span></div>
          ${a?`
            <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${a.freshness==="stale"?"var(--text3)":a.value<3.5?"var(--green)":a.value<=5?"var(--amber)":"var(--red)"};">
              ${a.freshness==="stale"?"STALE":A(a.value)+"%"}
            </div>
            <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin:8px 0;">
              <div style="height:100%;width:${Math.min((a.value||0)/12*100,100)}%;background:${a.value<3.5?"var(--green)":a.value<=5?"var(--amber)":"var(--red)"};border-radius:2px;"></div>
            </div>
          `:'<div style="font-size:10px;color:var(--text3);margin-bottom:8px;">Sin datos HY</div>'}
          <div class="audit-toggle" onclick="this.classList.toggle('open')">
            <span class="audit-lbl">Metodología ▾</span>
            <div class="audit-body">
              ${(a==null?void 0:a.date)||"—"} · ${(a==null?void 0:a.ageDays)!=null?a.ageDays+"d":"—"} · ${m(a==null?void 0:a.freshness)}<br>
              BAMLH0A0HYM2 · OAS: ${(a==null?void 0:a.value)!=null?A(a.value)+"%":"—"} · FRED (ICE BofA)<br>
              Score risk-on: ${v?v.score>=0?"+"+v.score:v.score:"excluido (STALE)"} · &lt;3.5%→+1 | 3.5–5%→0 | &gt;5%→−1 · [PROVISIONAL]
            </div>
          </div>
        </div>
      </div>

      <div style="font-size:9px;font-family:var(--mono);color:var(--amber);background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 12px;margin-bottom:14px;">
        ⚠ Sentiment Score PROVISIONAL. Thresholds sin calibración histórica. BBB eliminado (→ 1.2 Liquidez). Contrarian signal informativo — no entra en Sentiment Score.
      </div>

      <div class="co-footer">Fuentes: CNN Fear &amp; Greed · Yahoo Finance ^VIX (SMA200 · ${(e==null?void 0:e.sessionsUsed)||"—"} sesiones) · FRED BAMLH0A0HYM2</div>
    `}return(u=document.getElementById("sent-refresh"))==null||u.addEventListener("click",()=>g(!0)),await g(!1),{destroy(){}}}export{T as render};
