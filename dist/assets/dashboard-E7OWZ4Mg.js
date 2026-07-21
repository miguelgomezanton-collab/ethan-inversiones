import{U as y}from"./userdata-CJI3A66s.js";import{n as L}from"./index-DuMkqd25.js";const k=100,z=i=>i!=null&&isFinite(i)?(i<0?"-":"")+"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",V=(i,v=2)=>i!=null&&isFinite(i)?(i>=0?"+":"")+i.toFixed(v)+"%":"—",ut=i=>i!=null?i.toFixed(4):"—";async function ft(){try{const i=await fetch("/api/noticias",{signal:AbortSignal.timeout(1e4)});return i.ok?(await i.json()).items||[]:[]}catch{return[]}}function ht(i){if(!i||i.length<2)return"";const v=i.map(n=>n.val),x=200,b=50,r=Math.min(...v),m=Math.max(...v),e=m-r||1,$=v.map((n,M)=>`${(M/(v.length-1)*x).toFixed(1)},${(b-(n-r)/e*b).toFixed(1)}`).join(" "),c=v[v.length-1],l=c>=100?"#40d9c0":"#f47174";return`<svg viewBox="0 0 ${x} ${b}" style="width:100%;height:${b}px;">
    <polyline points="${$}" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${x}" cy="${(b-(c-r)/e*b).toFixed(1)}" r="3" fill="${l}"/>
  </svg>`}async function yt(i,v,x,b,r){const m=[];return i.forEach(e=>{const $=e.currentPrice||e.entry,c=e.entryStop||e.stopManual;if(!c||!$)return;((e.direction||"alcista")==="bajista"?$>=c:$<=c)&&m.push({tipo:"stop",urgencia:"alta",texto:`${e.ticker} ha tocado el stop loss`,detalle:`Stop: €${c} · Precio actual: €${$}`,accion:"car-cartera"})}),(x||[]).forEach(e=>{(e.estado==="ready"||e.estado==="LISTO")&&m.push({tipo:"entrada",urgencia:"media",texto:`${e.ticker} — señal alcista activa`,detalle:`Score: ${e.score||"—"} · ${e.sector||""}`,accion:"alc-rv-watchlist"})}),(b||[]).forEach(e=>{(e.estado==="ready"||e.estado==="LISTO")&&m.push({tipo:"corto",urgencia:"media",texto:`${e.ticker} — señal bajista activa`,detalle:`Score bajista: ${e.score||"—"}`,accion:"baj-watchlist"})}),(r||[]).forEach(e=>{e.resultado==="entrada"&&m.push({tipo:"correccion",urgencia:"media",texto:`${e.ticker} — corrección tipo ${e.tipo} con entrada`,detalle:e.nota||`Corrección tipo ${e.tipo}`,accion:"alc-rv-correcciones"})}),m}const xt=`
.db-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;}
.db-grid-wide{display:grid;grid-template-columns:1.5fr 1fr;gap:14px;margin-bottom:14px;}
.db-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;}
.db-card-title{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;}
.db-card-title a{color:var(--teal);cursor:pointer;font-size:9px;}
.db-vl{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;font-style:italic;line-height:1;color:var(--teal);}
.db-vl-sub{font-family:var(--mono);font-size:11px;margin-top:6px;}
.db-stat{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:11px;}
.db-stat:last-child{border-bottom:none;}
.db-stat-lbl{color:var(--text2);}
.db-stat-val{font-family:var(--mono);font-weight:700;}
.db-pos-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);}
.db-pos-row:last-child{border-bottom:none;}
.db-pos-ticker{font-weight:700;font-size:12px;}
.db-pos-name{font-size:9px;color:var(--text2);}
.db-macro-score{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:600;font-style:italic;line-height:1;}
.db-alerta{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer;}
.db-alerta:last-child{border-bottom:none;}
.db-alerta:hover{opacity:0.8;}
.db-alerta-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px;}
.db-alerta-texto{font-size:11px;font-weight:600;color:var(--text1);}
.db-alerta-detalle{font-size:10px;color:var(--text2);margin-top:2px;}
.db-noticia{padding:9px 0;border-bottom:1px solid var(--border);}
.db-noticia:last-child{border-bottom:none;}
.db-noticia a{font-size:11px;color:var(--text1);text-decoration:none;line-height:1.4;display:block;}
.db-noticia a:hover{color:var(--teal);}
.db-noticia-meta{font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:4px;}
.db-empty{font-size:11px;color:var(--text2);padding:10px 0;font-family:var(--mono);}
.db-saludo{font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;color:var(--text2);margin-bottom:18px;}
`;async function kt(i,{actionsSlot:v}){var b;if(!document.getElementById("db-css")){const r=document.createElement("style");r.id="db-css",r.textContent=xt,document.head.appendChild(r)}v.innerHTML='<button class="btn btn-primary" id="db-refresh">↻ Actualizar</button>',i.innerHTML='<div id="db-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando dashboard...</div></div></div>';async function x(){var K,Q,X,Y,Z;const r=document.getElementById("db-wrap");r.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando...</div></div>';const m=new Date().getHours(),e=m<12?"Buenos días":m<20?"Buenas tardes":"Buenas noches",$=new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"}),[c,l,n,M,it,ot,st,rt]=await Promise.all([y.get("ethan_fondo_v1"),y.get("ethan_positions").then(t=>t||[]),y.get("ethan_positions_history").then(t=>t||[]),y.get("ethan_capital_alcista").then(t=>t||0),y.get("ethan_capital_bajista").then(t=>t||0),y.get("ethan_watchlist_v1").then(t=>t||[]),y.get("ethan_watchlist_bajista_v1").then(t=>t||[]),y.get("ethan_correcciones_v1").then(t=>t||[])]),_=M+it,P=n.reduce((t,a)=>t+(a.pnlAbs||0),0),C=l.reduce((t,a)=>{const o=a.currentPrice||a.entry;return!o||!a.entry||!a.shares?t:t+((a.direction||"alcista")==="bajista"?(a.entry-o)*a.shares:(o-a.entry)*a.shares)},0),R=_+P+C,j=(c==null?void 0:c.participaciones)||_/k,G=j>0?R/j:k,U=(G-k)/k,nt=U>=0?"var(--green)":"var(--red)",dt=await(async()=>{var t,a,o;try{const f=[...new Set([...l.map(d=>d.ticker),...n.map(d=>d.ticker)])],w={};if(await Promise.all(f.map(async d=>{const D=await y.get(`ethan_px_hist_${d}`);D&&(w[d]=D)})),!Object.keys(w).length)return null;const u=((a=(t=c==null?void 0:c.movimientos)==null?void 0:t[0])==null?void 0:a.date)||((o=n[0])==null?void 0:o.entryDateISO);if(!u)return null;const p=new Date().toISOString().slice(0,10),h=[];let S=new Date(u);for(;S.toISOString().slice(0,10)<=p;){const d=S.toISOString().slice(0,10);S.getDay()!==0&&S.getDay()!==6&&h.push(d),S.setDate(S.getDate()+1)}const T=[];return h.forEach(d=>{let D=0,tt=0,pt=n.filter(s=>s.exitDateISO<d).reduce((s,N)=>s+(N.pnlAbs||0),0),at=!1;if([...n.filter(s=>s.entryDateISO<=d&&s.exitDateISO>=d),...l.filter(s=>s.entryDate<=d)].forEach(s=>{const N=s.ticker,bt=w[N]||{},H=d===p?s.currentPrice||s.entry:bt[d]||null;if(!H)return;const E=s.shares||(s.cost&&s.entry?s.cost/s.entry:0);if(!E)return;const mt=s.cost||E*s.entry,gt=(s.direction||"alcista")==="bajista"?E*s.entry*2-E*H:E*H;D+=mt,tt+=gt,at=!0}),!at)return;const et=Math.max(0,_+pt-D+tt)/j;et>0&&T.push({date:d,val:+(et/k*100).toFixed(3)})}),T.length>1?T:null}catch{return null}})(),F=n.length?n.reduce((t,a)=>t+(a.pnlPct||0),0)/n.length:null,A=n.filter(t=>t.entryDateISO&&t.exitDateISO),W=A.length?Math.round(A.reduce((t,a)=>t+Math.round((new Date(a.exitDateISO)-new Date(a.entryDateISO))/864e5),0)/A.length):null,I=await yt(l,n,ot,st,rt),q=l.map(t=>t.ticker).join(","),[ct,lt]=[ft(),q?fetch(`/api/noticias?tickers=${q}`,{signal:AbortSignal.timeout(12e3)}).then(t=>t.json()).catch(()=>({results:{}})):Promise.resolve({results:{}})],J=sessionStorage.getItem("ethan_macro_cache"),O=J?JSON.parse(J):null,g=((K=O==null?void 0:O.data)==null?void 0:K.scoreTotal)??null,B=g>6?"var(--green)":g>0?"var(--amber)":"var(--red)",vt=g>8?"Expansión":g>4?"Moderado":g>0?"Desaceleración":g>-4?"Contracción":"Recesión";r.innerHTML=`
      <div class="db-saludo" style="color:var(--text1);">${e} — ${$} · v16 ✓</div>

      <!-- Fila 1: VL + Stats + Macro -->
      <div class="db-grid">

        <!-- VL del Fondo -->
        <div class="db-card">
          <div class="db-card-title">
            Fondo ETHAN
            <a id="db-goto-fondo">Ver detalle →</a>
          </div>
          <div class="db-vl">${ut(G)}</div>
          <div class="db-vl-sub" style="color:${nt};">${V(U*100)} desde inicio</div>
          <div style="margin-top:12px;">${ht(dt)}</div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--text3);">
            <span>VL inicio: ${k}</span>
            <span>${j.toFixed(2)} participaciones</span>
          </div>
        </div>

        <!-- Stats trading -->
        <div class="db-card">
          <div class="db-card-title">Estadísticas</div>
          <div class="db-stat">
            <span class="db-stat-lbl">Valor cartera</span>
            <span class="db-stat-val" style="color:var(--teal);">${z(R)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">P&L Realizado</span>
            <span class="db-stat-val" style="color:${P>=0?"var(--green)":"var(--red)"};">${z(P)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">P&L No Realizado</span>
            <span class="db-stat-val" style="color:${C>=0?"var(--green)":"var(--red)"};">${z(C)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Rent. media/op</span>
            <span class="db-stat-val" style="color:${(F||0)>=0?"var(--green)":"var(--red)"};">${F!=null?V(F):"—"}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Días medios/op</span>
            <span class="db-stat-val">${W!=null?W+"d":"—"}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Operaciones</span>
            <span class="db-stat-val">${n.length} cerradas · ${l.length} abiertas</span>
          </div>
        </div>

        <!-- Score Macro -->
        <div class="db-card">
          <div class="db-card-title">
            Score Macro
            <a id="db-goto-macro">Ver detalle →</a>
          </div>
          ${g!=null?`
          <div class="db-macro-score" style="color:${B};">${g>0?"+":""}${g}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:${B};margin-top:4px;">${vt}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:8px;">Rango: −17 a +17</div>
          <div style="margin-top:12px;">
            <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${((g+17)/34*100).toFixed(0)}%;background:${B};border-radius:3px;transition:width 0.5s;"></div>
            </div>
          </div>`:`
                    <div class="db-empty">Visita <strong style="color:var(--teal);cursor:pointer;" id="db-goto-macro2">1.0 Macro Dashboard</strong> para cargar el score</div>`}
        </div>
      </div>

      <!-- Fila 2: Posiciones + Alertas -->
      <div class="db-grid-wide">

        <!-- Posiciones abiertas -->
        <div class="db-card">
          <div class="db-card-title">
            Posiciones abiertas
            <a id="db-goto-cartera">Ver detalle →</a>
          </div>
          ${l.length?l.map(t=>{const a=t.currentPrice||t.entry,o=t.direction||"alcista",f=a&&t.entry?(o==="bajista"?(t.entry-a)/t.entry:(a-t.entry)/t.entry)*100:0,w=t.shares&&t.entry?(o==="bajista"?t.entry-a:a-t.entry)*t.shares:null,u=f>=0?"var(--green)":"var(--red)",p=t.entryStop||t.stopManual,h=p&&(o==="bajista"?a>=p:a<=p);return`<div class="db-pos-row">
              <div>
                <div class="db-pos-ticker">${t.ticker} ${h?"⚠️":""}</div>
                <div class="db-pos-name">${t.name||""} · ${o}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${u};">${V(f)}</div>
                <div style="font-family:var(--mono);font-size:10px;color:${u};">${w!=null?z(w):""}</div>
              </div>
            </div>`}).join(""):'<div class="db-empty">Sin posiciones abiertas</div>'}
        </div>

        <!-- Alertas -->
        <div class="db-card">
          <div class="db-card-title">
            Alertas activas
            <span style="font-family:var(--mono);font-size:10px;color:${I.length>0?"var(--amber)":"var(--text3)"};">${I.length}</span>
          </div>
          ${I.length?I.map(t=>{const a=t.urgencia==="alta"?"var(--red)":t.tipo==="correccion"?"var(--teal)":t.tipo==="corto"?"var(--red)":"var(--green)";return`<div class="db-alerta" data-accion="${t.accion}">
              <div class="db-alerta-dot" style="background:${a};"></div>
              <div>
                <div class="db-alerta-texto">${t.texto}</div>
                <div class="db-alerta-detalle">${t.detalle}</div>
              </div>
            </div>`}).join(""):'<div class="db-empty">Sin alertas activas</div>'}
        </div>
      </div>

      <!-- Fila 3: Noticias generales -->
      <div class="db-card" id="db-noticias-card" style="margin-bottom:14px;">
        <div class="db-card-title">Noticias del mercado</div>
        <div id="db-noticias-content"><div class="db-empty">Cargando noticias...</div></div>
      </div>

      <!-- Fila 4: Noticias por posición -->
      ${l.length?`
      <div class="db-card" id="db-noticias-pos-card">
        <div class="db-card-title">Noticias de tus posiciones · ${l.map(t=>t.ticker).join(", ")}</div>
        <div id="db-noticias-pos-content"><div class="db-empty">Cargando...</div></div>
      </div>`:""}
    `,(Q=document.getElementById("db-goto-fondo"))==null||Q.addEventListener("click",()=>L("car-fondo")),(X=document.getElementById("db-goto-macro"))==null||X.addEventListener("click",()=>L("macro-home")),(Y=document.getElementById("db-goto-macro2"))==null||Y.addEventListener("click",()=>L("macro-home")),(Z=document.getElementById("db-goto-cartera"))==null||Z.addEventListener("click",()=>L("car-cartera")),r.querySelectorAll(".db-alerta[data-accion]").forEach(t=>{t.addEventListener("click",()=>L(t.dataset.accion))}),ct.then(t=>{const a=document.getElementById("db-noticias-content");if(a){if(!t.length){a.innerHTML='<div class="db-empty">No se pudieron cargar las noticias</div>';return}a.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 24px;">
        ${t.map(o=>`
          <div class="db-noticia">
            <a href="${o.link}" target="_blank" rel="noopener">${o.title}</a>
            <div class="db-noticia-meta">${o.source}${o.date?" · "+new Date(o.date).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}):""}</div>
          </div>`).join("")}
      </div>`}}),lt.then(t=>{const a=document.getElementById("db-noticias-pos-content");if(!a)return;const o=t.results||{},f=Object.keys(o);if(!f.length){a.innerHTML='<div class="db-empty">Sin noticias</div>';return}if(!f.some(u=>{var p;return((p=o[u])==null?void 0:p.length)>0})){a.innerHTML='<div class="db-empty">No se encontraron noticias para tus posiciones</div>';return}a.innerHTML=`<div style="display:grid;grid-template-columns:repeat(${Math.min(f.length,3)},1fr);gap:0 24px;">
        ${f.map(u=>{const p=o[u]||[];return p.length?`<div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);">${u}</div>
            ${p.map(h=>`<div class="db-noticia">
              <a href="${h.link}" target="_blank" rel="noopener">${h.title}</a>
              <div class="db-noticia-meta">${h.date?new Date(h.date).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}):""}</div>
            </div>`).join("")}
          </div>`:""}).join("")}
      </div>`})}return(b=document.getElementById("db-refresh"))==null||b.addEventListener("click",x),x(),{destroy(){var r;(r=document.getElementById("db-css"))==null||r.remove()}}}export{kt as render};
