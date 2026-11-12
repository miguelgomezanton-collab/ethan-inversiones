import{UserData as E}from"./userdata-2NGQIm4_.js";import{n as _}from"./index-BgqbrflN.js";const C=100,B=i=>i!=null&&isFinite(i)?(i<0?"-":"")+"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",q=(i,l=2)=>i!=null&&isFinite(i)?(i>=0?"+":"")+i.toFixed(l)+"%":"—",xt=i=>i!=null?i.toFixed(2):"—";async function $t(i){if(!(i!=null&&i.length))return[];const l=[];return await Promise.all(i.map(async c=>{var p,s,a,n,y,g;try{const m=`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${c}?modules=calendarEvents`,b=[w=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(w)}`,w=>`https://api.allorigins.win/raw?url=${encodeURIComponent(w)}`,w=>`https://corsproxy.io/?${encodeURIComponent(w)}`];for(const w of b)try{const A=new AbortController,k=setTimeout(()=>A.abort(),8e3),j=await fetch(w(m),{signal:A.signal});if(clearTimeout(k),!j.ok)continue;const M=await j.json(),D=(a=(s=(p=M==null?void 0:M.quoteSummary)==null?void 0:p.result)==null?void 0:s[0])==null?void 0:a.calendarEvents,I=(g=(y=(n=D==null?void 0:D.earnings)==null?void 0:n.earningsDate)==null?void 0:y[0])==null?void 0:g.raw;if(I){const z=new Date(I*1e3),L=Math.round((z-new Date)/864e5);l.push({ticker:c,date:z,daysUntil:L});break}}catch{}}catch{}})),l.filter(c=>c.daysUntil>=-1&&c.daysUntil<=90).sort((c,p)=>c.daysUntil-p.daysUntil)}function wt(i){const l=document.getElementById("db-earnings-content");if(!l)return;if(!(i!=null&&i.length)){l.innerHTML='<div class="db-empty">Sin earnings próximos en los próximos 90 días</div>';return}const c=a=>a.toLocaleDateString("es-ES",{weekday:"short",day:"numeric",month:"short"}),p=a=>a<=3?"var(--red)":a<=14?"var(--amber)":"var(--text2)",s=a=>a<=3?"rgba(244,113,116,0.08)":a<=14?"rgba(251,191,36,0.08)":"var(--surface2)";l.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:8px;">
    ${i.map(a=>`
      <div style="background:${s(a.daysUntil)};border:1px solid ${a.daysUntil<=3?"rgba(244,113,116,0.3)":a.daysUntil<=14?"rgba(251,191,36,0.3)":"var(--border)"};border-radius:6px;padding:8px 12px;display:flex;align-items:center;gap:10px;">
        <div style="font-weight:700;font-family:var(--mono);font-size:12px;color:var(--text1);">${a.ticker}</div>
        <div style="font-size:10px;color:${p(a.daysUntil)};font-family:var(--mono);">
          ${a.daysUntil===0?"🔴 HOY":a.daysUntil===1?"🟠 MAÑANA":a.daysUntil<=3?`🔴 en ${a.daysUntil}d`:a.daysUntil<=14?`🟡 en ${a.daysUntil}d`:`📅 en ${a.daysUntil}d`}
        </div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">${c(a.date)}</div>
      </div>`).join("")}
  </div>
  <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:8px;">Posiciones abiertas + watchlist alcista · 🔴 &lt;3d · 🟡 &lt;14d</div>`}const St=["beat","beats","surge","surges","soars","rises","gains","record","growth","profit","strong","upgrade","buy","outperform","bullish","rally","high","exceed","better","positive","boost","jump","up","increase","revenue beat","earnings beat","raised guidance","buyback","dividend"],kt=["miss","misses","falls","drops","plunges","decline","loss","weak","downgrade","sell","underperform","bearish","cut","lower","layoff","layoffs","restructure","lawsuit","fine","penalty","warning","below","disappoints","disappointing","recall","investigation","probe","debt","bankruptcy","crash","tumbles","slumps","concerns","risk","negative"];function J(i){if(!i||!i.length)return{score:0,label:"neutral",emoji:"⚪",color:"var(--text3)"};let l=0,c=0;i.forEach(a=>{const n=(a.title||a||"").toLowerCase();St.forEach(y=>{n.includes(y)&&l++}),kt.forEach(y=>{n.includes(y)&&c++})});const p=l+c,s=p>0?(l-c)/p:0;return s>.2?{score:s,label:"Positivo",emoji:"🟢",color:"var(--green)"}:s<-.2?{score:s,label:"Negativo",emoji:"🔴",color:"var(--red)"}:{score:s,label:"Neutral",emoji:"🟡",color:"var(--amber)"}}async function Et(){try{const i=await fetch("/api/noticias",{signal:(()=>{const c=new AbortController;return setTimeout(()=>c.abort(),1e4),c.signal})()});return i.ok?(await i.json()).items||[]:[]}catch{return[]}}function jt(i){if(!i||i.length<2)return"";const l=i.map(b=>b.val),c=200,p=50,s=Math.min(...l),a=Math.max(...l),n=a-s||1,y=l.map((b,w)=>`${(w/(l.length-1)*c).toFixed(1)},${(p-(b-s)/n*p).toFixed(1)}`).join(" "),g=l[l.length-1],m=g>=100?"#40d9c0":"#f47174";return`<svg viewBox="0 0 ${c} ${p}" style="width:100%;height:${p}px;">
    <polyline points="${y}" fill="none" stroke="${m}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${c}" cy="${(p-(g-s)/n*p).toFixed(1)}" r="3" fill="${m}"/>
  </svg>`}async function Dt(i,l,c,p,s){const a=[];return i.forEach(n=>{const y=n.currentPrice||n.entry,g=n.entryStop||n.stopManual;if(!g||!y)return;((n.direction||"alcista")==="bajista"?y>=g:y<=g)&&a.push({tipo:"stop",urgencia:"alta",texto:`${n.ticker} ha tocado el stop loss`,detalle:`Stop: €${g} · Precio actual: €${y}`,accion:"car-cartera"})}),(c||[]).forEach(n=>{(n.estado==="ready"||n.estado==="LISTO")&&a.push({tipo:"entrada",urgencia:"media",texto:`${n.ticker} — señal alcista activa`,detalle:`Score: ${n.score||"—"} · ${n.sector||""}`,accion:"alc-rv-watchlist"})}),(p||[]).forEach(n=>{(n.estado==="ready"||n.estado==="LISTO")&&a.push({tipo:"corto",urgencia:"media",texto:`${n.ticker} — señal bajista activa`,detalle:`Score bajista: ${n.score||"—"}`,accion:"baj-watchlist"})}),(s||[]).forEach(n=>{n.resultado==="entrada"&&a.push({tipo:"correccion",urgencia:"media",texto:`${n.ticker} — corrección tipo ${n.tipo} con entrada`,detalle:n.nota||`Corrección tipo ${n.tipo}`,accion:"alc-rv-correcciones"})}),a}const It=`
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
`;async function Mt(i,{actionsSlot:l}){var p;if(!document.getElementById("db-css")){const s=document.createElement("style");s.id="db-css",s.textContent=It,document.head.appendChild(s)}l.innerHTML='<button class="btn btn-primary" id="db-refresh">↻ Actualizar</button>',i.innerHTML='<div id="db-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando dashboard...</div></div></div>';async function c(){var et,at,it,nt,ot;const s=document.getElementById("db-wrap");s.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando...</div></div>';const a=new Date().getHours(),n=a<12?"Buenos días":a<20?"Buenas tardes":"Buenas noches",y=new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"}),[g,m,b,w,A,k,j,M]=await Promise.all([E.get("ethan_fondo_v1"),E.get("ethan_positions").then(t=>t||[]),E.get("ethan_positions_history").then(t=>t||[]),E.get("ethan_capital_alcista").then(t=>t||0),E.get("ethan_capital_bajista").then(t=>t||0),E.get("ethan_watchlist_v1").then(t=>t||[]),E.get("ethan_watchlist_bajista_v1").then(t=>t||[]),E.get("ethan_correcciones_v1").then(t=>t||[])]),D=w+A,I=b.reduce((t,e)=>t+(e.pnlAbs||0),0),z=m.reduce((t,e)=>{const r=e.currentPrice||e.entry;return!r||!e.entry||!e.shares?t:t+((e.direction||"alcista")==="bajista"?(e.entry-r)*e.shares:(r-e.entry)*e.shares)},0),F=D+I+z,L=(g==null?void 0:g.participaciones)||D/C,Y=L>0?F/L:C,K=(Y-C)/C,lt=K>=0?"var(--green)":"var(--red)",dt=await(async()=>{var t,e,r;try{const x=[...new Set([...m.map(u=>u.ticker),...b.map(u=>u.ticker)])],$={};if(await Promise.all(x.map(async u=>{const T=await E.get(`ethan_px_hist_${u}`);T&&($[u]=T)})),!Object.keys($).length)return null;const d=((e=(t=g==null?void 0:g.movimientos)==null?void 0:t[0])==null?void 0:e.date)||((r=b[0])==null?void 0:r.entryDateISO);if(!d)return null;const o=new Date().toISOString().slice(0,10),h=[];let f=new Date(d);for(;f.toISOString().slice(0,10)<=o;){const u=f.toISOString().slice(0,10);f.getDay()!==0&&f.getDay()!==6&&h.push(u),f.setDate(f.getDate()+1)}const V=[];return h.forEach(u=>{let T=0,st=0,ft=b.filter(v=>v.exitDateISO<u).reduce((v,W)=>v+(W.pnlAbs||0),0),rt=!1;if([...b.filter(v=>v.entryDateISO<=u&&v.exitDateISO>=u),...m.filter(v=>v.entryDate<=u)].forEach(v=>{const W=v.ticker,ut=$[W]||{},G=u===o?v.currentPrice||v.entry:ut[u]||null;if(!G)return;const P=v.shares||(v.cost&&v.entry?v.cost/v.entry:0);if(!P)return;const yt=v.cost||P*v.entry,ht=(v.direction||"alcista")==="bajista"?P*v.entry*2-P*G:P*G;T+=yt,st+=ht,rt=!0}),!rt)return;const ct=Math.max(0,D+ft-T+st)/L;ct>0&&V.push({date:u,val:+(ct/C*100).toFixed(3)})}),V.length>1?V:null}catch{return null}})(),N=b.length?b.reduce((t,e)=>t+(e.pnlPct||0),0)/b.length:null,U=b.filter(t=>t.entryDateISO&&t.exitDateISO),Q=U.length?Math.round(U.reduce((t,e)=>t+Math.round((new Date(e.exitDateISO)-new Date(e.entryDateISO))/864e5),0)/U.length):null,O=await Dt(m,b,k,j,M),X=m.map(t=>t.ticker).join(","),pt=[...new Set([...m.map(t=>t.ticker),...(k||[]).map(t=>t.ticker).slice(0,5)])],Z=[...new Set([...(k||[]).map(t=>t.ticker),...(j||[]).map(t=>t.ticker)])].slice(0,5).join(","),[vt,mt,bt]=[Et(),X?fetch(`/api/noticias?tickers=${X}`,{signal:(()=>{const t=new AbortController;return setTimeout(()=>t.abort(),12e3),t.signal})()}).then(t=>t.json()).catch(()=>({results:{}})):Promise.resolve({results:{}}),Z?fetch(`/api/noticias?tickers=${Z}`,{signal:(()=>{const t=new AbortController;return setTimeout(()=>t.abort(),12e3),t.signal})()}).then(t=>t.json()).catch(()=>({results:{}})):Promise.resolve({results:{}})];$t(pt).then(t=>wt(t)).catch(()=>{const t=document.getElementById("db-earnings-content");t&&(t.innerHTML='<div class="db-empty">Sin datos de earnings disponibles</div>')});const tt=sessionStorage.getItem("ethan_macro_cache"),H=tt?JSON.parse(tt):null,S=((et=H==null?void 0:H.data)==null?void 0:et.scoreTotal)??null,R=S>6?"var(--green)":S>0?"var(--amber)":"var(--red)",gt=S>8?"Expansión":S>4?"Moderado":S>0?"Desaceleración":S>-4?"Contracción":"Recesión";s.innerHTML=`
      <div class="db-saludo" style="color:var(--text1);">${n} — ${y}</div>

      <!-- Fila 1: VL + Stats + Macro -->
      <div class="db-grid">

        <!-- VL del Fondo -->
        <div class="db-card">
          <div class="db-card-title">
            Fondo ETHAN
            <a id="db-goto-fondo">Ver detalle →</a>
          </div>
          <div class="db-vl">${xt(Y)}</div>
          <div class="db-vl-sub" style="color:${lt};">${q(K*100)} desde inicio</div>
          <div style="margin-top:12px;">${jt(dt)}</div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--text3);">
            <span>VL inicio: ${C}</span>
            <span>${L.toFixed(2)} participaciones</span>
          </div>
        </div>

        <!-- Stats trading -->
        <div class="db-card">
          <div class="db-card-title">Estadísticas</div>
          <div class="db-stat">
            <span class="db-stat-lbl">Valor cartera</span>
            <span class="db-stat-val" style="color:var(--teal);">${B(F)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">P&L Realizado</span>
            <span class="db-stat-val" style="color:${I>=0?"var(--green)":"var(--red)"};">${B(I)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">P&L No Realizado</span>
            <span class="db-stat-val" style="color:${z>=0?"var(--green)":"var(--red)"};">${B(z)}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Rent. media/op</span>
            <span class="db-stat-val" style="color:${(N||0)>=0?"var(--green)":"var(--red)"};">${N!=null?q(N):"—"}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Días medios/op</span>
            <span class="db-stat-val">${Q!=null?Q+"d":"—"}</span>
          </div>
          <div class="db-stat">
            <span class="db-stat-lbl">Operaciones</span>
            <span class="db-stat-val">${b.length} cerradas · ${m.length} abiertas</span>
          </div>
        </div>

        <!-- Score Macro -->
        <div class="db-card">
          <div class="db-card-title">
            Score Macro
            <a id="db-goto-macro">Ver detalle →</a>
          </div>
          ${S!=null?`
          <div class="db-macro-score" style="color:${R};">${S>0?"+":""}${S}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:${R};margin-top:4px;">${gt}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:8px;">Rango: −17 a +17</div>
          <div style="margin-top:12px;">
            <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${((S+17)/34*100).toFixed(0)}%;background:${R};border-radius:3px;transition:width 0.5s;"></div>
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
          ${m.length?m.map(t=>{const e=t.currentPrice||t.entry,r=t.direction||"alcista",x=e&&t.entry?(r==="bajista"?(t.entry-e)/t.entry:(e-t.entry)/t.entry)*100:0,$=t.shares&&t.entry?(r==="bajista"?t.entry-e:e-t.entry)*t.shares:null,d=x>=0?"var(--green)":"var(--red)",o=t.entryStop||t.stopManual,h=o&&(r==="bajista"?e>=o:e<=o);return`<div class="db-pos-row">
              <div>
                <div class="db-pos-ticker">${t.ticker} ${h?"⚠️":""} <span id="sent-${t.ticker}" style="font-size:11px;" title="Sentimiento noticias">⚪</span></div>
                <div class="db-pos-name">${t.name||""} · ${r}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${d};">${q(x)}</div>
                <div style="font-family:var(--mono);font-size:10px;color:${d};">${$!=null?B($):""}</div>
              </div>
            </div>`}).join(""):'<div class="db-empty">Sin posiciones abiertas</div>'}
        </div>

        <!-- Alertas -->
        <div class="db-card">
          <div class="db-card-title">
            Alertas activas
            <span style="font-family:var(--mono);font-size:10px;color:${O.length>0?"var(--amber)":"var(--text3)"};">${O.length}</span>
          </div>
          ${O.length?O.map(t=>{const e=t.urgencia==="alta"?"var(--red)":t.tipo==="correccion"?"var(--teal)":t.tipo==="corto"?"var(--red)":"var(--green)";return`<div class="db-alerta" data-accion="${t.accion}">
              <div class="db-alerta-dot" style="background:${e};"></div>
              <div>
                <div class="db-alerta-texto">${t.texto}</div>
                <div class="db-alerta-detalle">${t.detalle}</div>
              </div>
            </div>`}).join(""):'<div class="db-empty">Sin alertas activas</div>'}
        </div>
      </div>

      <!-- Fila 3: Earnings Calendar -->
      <div class="db-card" style="margin-bottom:14px;" id="db-earnings-card">
        <div class="db-card-title">📅 Próximos Earnings</div>
        <div id="db-earnings-content"><div class="db-empty">Cargando...</div></div>
      </div>

      <!-- Fila 4: Noticias generales -->
      <div class="db-card" id="db-noticias-card" style="margin-bottom:14px;">
        <div class="db-card-title">Noticias del mercado</div>
        <div id="db-noticias-content"><div class="db-empty">Cargando noticias...</div></div>
      </div>

      <!-- Fila 4: Sentimiento Watchlist -->
      ${k!=null&&k.length||j!=null&&j.length?`
      <div class="db-card" style="margin-bottom:14px;" id="db-sent-watch-card">
        <div class="db-card-title">Sentimiento · Watchlist</div>
        <div id="db-sent-watch-content"><div class="db-empty">Cargando...</div></div>
      </div>`:""}

      <!-- Fila 5: Noticias por posición -->
      ${m.length?`
      <div class="db-card" id="db-noticias-pos-card">
        <div class="db-card-title">Noticias de tus posiciones · ${m.map(t=>t.ticker).join(", ")}</div>
        <div id="db-noticias-pos-content"><div class="db-empty">Cargando...</div></div>
      </div>`:""}
    `,(at=document.getElementById("db-goto-fondo"))==null||at.addEventListener("click",()=>_("car-fondo")),(it=document.getElementById("db-goto-macro"))==null||it.addEventListener("click",()=>_("macro-home")),(nt=document.getElementById("db-goto-macro2"))==null||nt.addEventListener("click",()=>_("macro-home")),(ot=document.getElementById("db-goto-cartera"))==null||ot.addEventListener("click",()=>_("car-cartera")),s.querySelectorAll(".db-alerta[data-accion]").forEach(t=>{t.addEventListener("click",()=>_(t.dataset.accion))}),vt.then(t=>{const e=document.getElementById("db-noticias-content");if(e){if(!t.length){e.innerHTML='<div class="db-empty">No se pudieron cargar las noticias</div>';return}e.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 24px;">
        ${t.map(r=>`
          <div class="db-noticia">
            <a href="${r.link}" target="_blank" rel="noopener">${r.title}</a>
            <div class="db-noticia-meta">${r.source}${r.date?" · "+new Date(r.date).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}):""}</div>
          </div>`).join("")}
      </div>`}}),bt.then(t=>{const e=document.getElementById("db-sent-watch-content");if(!e)return;const r=t.results||{},x=Object.keys(r).filter($=>{var d;return((d=r[$])==null?void 0:d.length)>0});if(!x.length){e.innerHTML='<div class="db-empty">Sin noticias para la watchlist</div>';return}e.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${x.map($=>{const d=r[$]||[],o=J(d),h=(k||[]).some(f=>f.ticker===$);return`<div style="display:flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:6px 12px;cursor:pointer;" 
                       title="${o.label} · ${d.length} noticias recientes">
            <span style="font-family:var(--mono);font-size:11px;font-weight:700;">${$}</span>
            <span style="font-size:9px;color:${h?"var(--green)":"var(--red)"};font-family:var(--mono);">${h?"▲":"▼"}</span>
            <span style="font-size:14px;" title="${o.label}">${o.emoji}</span>
            <span style="font-size:9px;color:${o.color};font-family:var(--mono);">${o.label}</span>
          </div>`}).join("")}
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:10px;font-family:var(--mono);">
        🟢 Positivo · 🟡 Neutral · 🔴 Negativo · ▲ Alcista · ▼ Bajista
      </div>`}),mt.then(t=>{const e=document.getElementById("db-noticias-pos-content");if(!e)return;const r=t.results||{},x=Object.keys(r);if(!x.length){e.innerHTML='<div class="db-empty">Sin noticias</div>';return}if(!x.some(d=>{var o;return((o=r[d])==null?void 0:o.length)>0})){e.innerHTML='<div class="db-empty">No se encontraron noticias para tus posiciones</div>';return}x.forEach(d=>{const o=r[d]||[],h=o.length?J(o):{emoji:"⚪",label:"Sin datos"},f=document.getElementById(`sent-${d}`);f&&(f.textContent=h.emoji,f.title=`Sentimiento: ${h.label}${o.length?` (${o.length} noticias)`:" — sin noticias recientes"}`)}),m.forEach(d=>{if(!x.includes(d.ticker)){const o=document.getElementById(`sent-${d.ticker}`);o&&(o.textContent="⚪",o.title="Sin noticias recientes")}}),e.innerHTML=`<div style="display:grid;grid-template-columns:repeat(${Math.min(x.length,3)},1fr);gap:0 24px;">
        ${x.map(d=>{const o=r[d]||[];if(!o.length)return"";const h=J(o);return`<div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
              <span>${d}</span>
              <span style="color:${h.color};" title="${h.label}">${h.emoji} ${h.label}</span>
            </div>
            ${o.map(f=>`<div class="db-noticia">
              <a href="${f.link}" target="_blank" rel="noopener">${f.title}</a>
              <div class="db-noticia-meta">${f.date?new Date(f.date).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}):""}</div>
            </div>`).join("")}
          </div>`}).join("")}
      </div>`})}return(p=document.getElementById("db-refresh"))==null||p.addEventListener("click",c),c(),{destroy(){var s;(s=document.getElementById("db-css"))==null||s.remove()}}}export{Mt as render};
