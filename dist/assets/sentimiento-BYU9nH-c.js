import{g as z}from"./macro-data-CGVdt8ED.js";const u=i=>i!=null?Number(i).toFixed(1):"—",x=i=>i!=null?Number(i).toFixed(2):"—";async function B(i,{actionsSlot:g}){var c;g.innerHTML='<button class="btn btn-primary" id="sent-refresh">↻ Actualizar</button>',i.innerHTML='<div id="sent-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function d(n=!1){try{const s=await z(n);y(s)}catch(s){document.getElementById("sent-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${s.message}</div></div>`}}function y(n){var m;const s=document.getElementById("sent-wrap"),l=n.seguimiento||{},o=(n.indicators||{}).fearGreed||l.fearGreed,r=l.vix,e=l.bbb||((m=n.liquidez)==null?void 0:m.bbbSpread),a=l.hySpread,t=(o==null?void 0:o.value)??50,v=t/100*Math.PI,h=100+72*Math.cos(Math.PI-v),$=100-72*Math.sin(v),f=t>75?"var(--green)":t>55?"var(--amber)":t>45?"var(--text2)":t>25?"var(--amber)":"var(--red)",p=t>75?"Euforia Extrema":t>55?"Greed":t>45?"Neutral":t>25?"Fear":"Miedo Extremo",M=t<40?"POSITIVO":t<55?"NEUTRO":"PRECAUCIÓN",w=t<40?"var(--green)":t<55?"var(--amber)":"var(--red)";s.innerHTML=`
      <div style="display:grid;grid-template-columns:220px 1fr;gap:14px;margin-bottom:14px;">
        <!-- Gauge -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <svg viewBox="0 0 200 115" style="width:185px;">
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="var(--surface2)" stroke-width="14" stroke-linecap="round"/>
            <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="url(#fgSG)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${(Math.PI*72).toFixed(1)}" stroke-dashoffset="${(Math.PI*72*(1-t/100)).toFixed(1)}"/>
            <defs><linearGradient id="fgSG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--red)"/><stop offset="50%" stop-color="var(--amber)"/><stop offset="100%" stop-color="var(--green)"/></linearGradient></defs>
            <line x1="100" y1="100" x2="${h.toFixed(1)}" y2="${$.toFixed(1)}" stroke="var(--teal)" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="100" cy="100" r="5" fill="var(--teal)"/>
            <text x="100" y="82" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" font-weight="700" fill="${f}">${t}</text>
            <text x="100" y="100" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="var(--text2)">${p}</text>
            <text x="28" y="114" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">Fear</text>
            <text x="172" y="114" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--green)">Greed</text>
          </svg>
          ${o?`<div style="display:flex;gap:5px;justify-content:center;font-size:9px;font-family:var(--mono);color:var(--text3);margin-top:5px;"><span>1d:${o.previousClose??"—"}</span><span>·</span><span>1s:${o.previousWeek??"—"}</span><span>·</span><span>1m:${o.previousMonth??"—"}</span></div>`:""}
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:5px;text-align:center;">${(o==null?void 0:o.score)!=null?o.score<0?"Score<40→+1 contrarian":o.score>0?"Score>54→−1 riesgo":"Score 40-54→0 neutral":"CNN Fear & Greed Index"}</div>
        </div>
        <div>
          <!-- Conclusión contrarian -->
          <div class="mac-card" style="margin-bottom:12px;background:rgba(${t<40?"74,222,128":t<55?"251,191,36":"244,113,116"},0.04);border-color:rgba(${t<40?"74,222,128":t<55?"251,191,36":"244,113,116"},0.2);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">Lectura Contrarian</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <div><div style="font-size:11px;color:var(--text2);">El mercado siente</div><div style="font-family:var(--serif);font-size:24px;font-weight:600;font-style:italic;color:${f};">${p}</div></div>
              <div style="text-align:right;"><div style="font-size:11px;color:var(--text2);">Señal contrarian</div><div style="font-family:var(--serif);font-size:24px;font-weight:600;font-style:italic;color:${w};">${M}</div></div>
            </div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">${t>55?`Mercado codicioso (${t}). Históricamente, euforia con macro deteriorándose precede correcciones del 10-15% en 3-6 meses. No es señal de entrada — es señal de precaución.`:t<40?`Mercado con miedo (${t}). Señal contrarian alcista — el pánico crea oportunidades si el macro lo soporta. Buscar confirmación en curva y liquidez.`:`Mercado neutral (${t}). Sin señal extrema — seguir el macro y la tendencia técnica.`}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <!-- VIX -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;">VIX vs SMA200 <span style="float:right;color:var(--teal)">AUTO</span></div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${r!=null&&r.aboveSMA200?"var(--red)":"var(--green)"};">${(r==null?void 0:r.value)!=null?u(r.value):"—"}</div>
              ${(r==null?void 0:r.aboveSMA200)!=null?`<div style="font-size:9px;font-family:var(--mono);color:${r.aboveSMA200?"var(--red)":"var(--green)"};margin:4px 0;">${r.aboveSMA200?"⚠ SOBRE":"↓ BAJO"} SMA200 (${u(r.sma200)})</div>`:""}
              <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:4px;"><div style="height:100%;width:${(r==null?void 0:r.value)!=null?Math.min(r.value/60*100,100):0}%;background:${r!=null&&r.aboveSMA200?"var(--red)":"var(--green)"};border-radius:2px;"></div></div>
              <div style="font-size:9px;color:var(--text2);">${r!=null&&r.aboveSMA200?"Alerta volatilidad — bajista":"Volatilidad contenida — alcista"}</div>
            </div>
            <!-- BBB -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;">BBB Spread <span style="float:right;color:var(--teal)">AUTO</span></div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${(e==null?void 0:e.score)>0?"var(--green)":(e==null?void 0:e.score)===0?"var(--amber)":"var(--red)"};">${(e==null?void 0:e.value)!=null?x(e.value)+"%":"—"}</div>
              <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin:8px 0 4px;"><div style="height:100%;width:${(e==null?void 0:e.value)!=null?Math.min(e.value/4*100,100):0}%;background:${(e==null?void 0:e.score)>0?"var(--green)":(e==null?void 0:e.score)===0?"var(--amber)":"var(--red)"};border-radius:2px;"></div></div>
              <div style="font-size:9px;color:var(--text2);">${(e==null?void 0:e.score)>0?"IG tranquilo":(e==null?void 0:e.score)===0?"Neutral":"Estrés IG"}</div>
            </div>
            <!-- HY -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;">HY Spread <span style="float:right;color:var(--teal)">AUTO</span></div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${(a==null?void 0:a.value)!=null?a.value<3.5?"var(--green)":a.value<5?"var(--amber)":"var(--red)":"var(--text3)"};">${(a==null?void 0:a.value)!=null?x(a.value)+"%":"—"}</div>
              <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin:8px 0 4px;"><div style="height:100%;width:${(a==null?void 0:a.value)!=null?Math.min(a.value/12*100,100):0}%;background:${(a==null?void 0:a.value)!=null?a.value<3.5?"var(--green)":a.value<5?"var(--amber)":"var(--red)":"var(--text3)"};border-radius:2px;"></div></div>
              <div style="font-size:9px;color:var(--text2);">${(a==null?void 0:a.value)!=null?a.value<3.5?"Sin estrés HY":a.value<5?"Alerta incipiente":"Estrés severo":"—"}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="co-footer">Fuentes: CNN Fear & Greed · Yahoo Finance (VIX 200 sesiones) · FRED (BAMLC0A4CBBB, BAMLH0A0HYM2)</div>
    `}return(c=document.getElementById("sent-refresh"))==null||c.addEventListener("click",()=>d(!0)),await d(!1),{destroy(){}}}export{B as render};
