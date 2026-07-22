import{U as A}from"./userdata-DRc3raHj.js";import"./index-Bux_OP-y.js";const z="ethan_alertas_snapshot",_={rv:"ethan_watchlist_v1",com:"ethan_watchlist_com_v1",rf:"ethan_watchlist_rf_v1"},$={watching:0,close:1,diario:2,ready:3},B={watching:"👁 Vigilando",close:"🔶 Cerca",diario:"⏳ Espera Diario",ready:"🟢 Listo"},P={rv:"Renta Variable",com:"Commodities",rf:"Renta Fija"},U=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`,o=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(o)}`];async function F(o){var p,m,d,i,h,t,s;const v=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=10y&events=history`;for(const a of U)try{const r=await fetch(a(v),{signal:AbortSignal.timeout(8e3)});if(!r.ok)continue;const c=await r.text();let n;try{n=JSON.parse(c)}catch{continue}const f=(m=(p=n==null?void 0:n.chart)==null?void 0:p.result)==null?void 0:m[0];if(!f)continue;const u=(i=(d=f.indicators)==null?void 0:d.quote)==null?void 0:i[0];if(!u)continue;const g=((s=(t=(h=f.indicators)==null?void 0:h.adjclose)==null?void 0:t[0])==null?void 0:s.adjclose)||u.close,w=g.map((e,y)=>u.close[y]&&e?e/u.close[y]:1);return{timestamps:f.timestamp,O:u.open.map((e,y)=>e*w[y]),H:u.high.map((e,y)=>e*w[y]),L:u.low.map((e,y)=>e*w[y]),C:g,V:u.volume}}catch{}throw new Error("Sin datos")}function E(o,v){const p=2/(v+1),m=new Array(o.length).fill(null);let d=o.findIndex(i=>i!=null&&!isNaN(i));if(d<0)return m;m[d]=o[d];for(let i=d+1;i<o.length;i++){const h=o[i]!=null&&!isNaN(o[i])?o[i]:m[i-1];m[i]=h*p+m[i-1]*(1-p)}return m}function D(o){const v=E(o,12),p=E(o,26),m=v.map((d,i)=>d!=null&&p[i]!=null?d-p[i]:null);return{m,sl:E(m.map(d=>d??0),9)}}function R(o,v=14){const p=new Array(o.length).fill(null);if(o.length<v+1)return p;let m=0,d=0;for(let t=1;t<=v;t++){const s=o[t]-o[t-1];s>0?m+=s:d-=s}let i=m/v,h=d/v;p[v]=h===0?100:100-100/(1+i/h);for(let t=v+1;t<o.length;t++){const s=o[t]-o[t-1];i=(i*(v-1)+(s>0?s:0))/v,h=(h*(v-1)+(s<0?-s:0))/v,p[t]=h===0?100:100-100/(1+i/h)}return p}function N(o,v,p,m){const d=p.map((h,t)=>{if(t<m-1)return null;const s=Math.max(...o.slice(t-m+1,t+1)),a=Math.min(...v.slice(t-m+1,t+1));return s===a?50:(h-a)/(s-a)*100}),i=E(d,3);return{k:i,d:E(i.map(h=>h??0),3)}}function V(o,v,p,m,d,i,h){const t={};o.forEach((a,r)=>{const c=new Date(a*1e3);let n;if(h==="W"){const f=c.getDay(),u=c.getDate()-f+(f===0?-6:1),g=new Date(+c);g.setDate(u),n=g.toISOString().slice(0,10)}else n=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`;t[n]?(t[n].H=Math.max(t[n].H,p[r]),t[n].L=Math.min(t[n].L,m[r]),t[n].C=d[r],t[n].V+=i[r]):t[n]={O:v[r],H:p[r],L:m[r],C:d[r],V:i[r]}});const s=Object.keys(t).sort();return{O:s.map(a=>t[a].O),H:s.map(a=>t[a].H),L:s.map(a=>t[a].L),C:s.map(a=>t[a].C),V:s.map(a=>t[a].V)}}function W(o){const{timestamps:v,O:p,H:m,L:d,C:i,V:h}=o,t=i.length,s=t-1,a=V(v,p,m,d,i,h,"W"),r=a.C.length-1,c=V(v,p,m,d,i,h,"M"),n=c.C.length-1,f=D(c.C),u=N(c.H,c.L,c.C,89),g=N(c.H,c.L,c.C,8),w=R(c.C),e=E(c.C,10),y=D(a.C),l=N(a.H,a.L,a.C,89),O=R(a.C),H=E(a.C,20),k=D(i),C=R(i),x=[f.m[n]>0&&f.m[n]>f.sl[n],u.k[n]>80&&u.k[n]>u.d[n]||u.k[n]>92,w[n]>65,g.k[n]>78,e[n]&&c.C[n]>e[n]],M=[y.m[r]>0&&y.m[r]>y.sl[r],l.k[r]>85&&l.k[r]>l.d[r]||l.k[r]>92,O[r]>67,H[r]&&a.C[r]>H[r]],S=x.every(L=>L),b=M.every(L=>L),T=k.m[s]>k.sl[s]&&s>0&&k.m[s-1]<=k.sl[s-1]&&C[s]>57&&k.m[s]>0,j=x.filter(L=>L).length+M.filter(L=>L).length+(S&&b?1:0);let I="watching";return S&&b&&T?I="ready":S&&b?I="diario":j>=7&&(I="close"),{estado:I,score:j,price:i[s]}}async function Y(o,{actionsSlot:v}){var h;v.innerHTML=`
    <button class="btn btn-primary" id="alertas-refresh-btn">↻ Actualizar ahora</button>
  `,o.innerHTML='<div id="alertas-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando watchlists...</div></div></div>';async function p(){const t=document.getElementById("alertas-content");if(!t)return;t.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando valores...</div><div class="empty-desc">Esto puede tardar un minuto según el tamaño de tus watchlists</div></div>';const[s,a,r,c]=await Promise.all([A.get(_.rv).then(l=>l||[]),A.get(_.com).then(l=>l||[]),A.get(_.rf).then(l=>l||[]),A.get(z).then(l=>l||{})]),n=[...s.map(l=>({ticker:l,wl:"rv"})),...a.map(l=>({ticker:l,wl:"com"})),...r.map(l=>({ticker:l,wl:"rf"}))];if(n.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">🔔</div>
          <div class="empty-title">Sin tickers en tus watchlists</div>
          <div class="empty-desc">Añade valores a la Watchlist de RV, Commodities o RF para recibir alertas de cambios de estado.</div>
        </div>`;return}const f=[],u=5;let g=0;for(let l=0;l<n.length;l+=u){const O=n.slice(l,l+u),H=await Promise.all(O.map(async({ticker:C,wl:x})=>{try{const M=await F(C),{estado:S,score:b,price:T}=W(M);return{ticker:C,wl:x,estado:S,score:b,price:T,ok:!0}}catch{return{ticker:C,wl:x,estado:null,score:null,price:null,ok:!1}}}));f.push(...H),g+=O.length;const k=document.getElementById("alertas-content");k&&(k.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando... ${g}/${n.length}</div><div class="empty-desc">Comparando estados con el último análisis guardado</div></div>`),await new Promise(C=>setTimeout(C,200))}const w={},e=new Date().toLocaleString("es-ES");f.forEach(l=>{l.ok&&(w[l.ticker]={estado:l.estado,score:l.score,price:l.price,ts:Date.now()})}),await A.set(z,w);const y=f.filter(l=>!l.ok||!c[l.ticker]?!1:c[l.ticker].estado!==l.estado);i(y.length),m(t,f,c,e)}function m(t,s,a,r){const c=s.filter(e=>e.ok&&a[e.ticker]&&$[e.estado]>$[a[e.ticker].estado]),n=s.filter(e=>e.ok&&a[e.ticker]&&$[e.estado]<$[a[e.ticker].estado]),f=s.filter(e=>e.ok&&a[e.ticker]&&e.estado===a[e.ticker].estado),u=s.filter(e=>e.ok&&!a[e.ticker]),g=s.filter(e=>!e.ok),w=c.length>0||n.length>0;t.innerHTML=`
      <div class="al-header">
        <div>
          <div class="al-title">Análisis completado</div>
          <div class="al-sub">${r} · ${s.filter(e=>e.ok).length} valores analizados</div>
        </div>
        <div class="al-summary">
          ${c.length>0?`<span class="al-chip up">↑ ${c.length} mejoras</span>`:""}
          ${n.length>0?`<span class="al-chip down">↓ ${n.length} empeoramientos</span>`:""}
          ${w?"":'<span class="al-chip neutral">Sin cambios de estado</span>'}
        </div>
      </div>

      ${c.length>0?`
        <div class="al-section">
          <div class="al-section-title up">↑ MEJORAS DE ESTADO</div>
          ${c.sort((e,y)=>$[y.estado]-$[e.estado]).map(e=>d(e,a[e.ticker],"up")).join("")}
        </div>`:""}

      ${n.length>0?`
        <div class="al-section">
          <div class="al-section-title down">↓ EMPEORAMIENTOS</div>
          ${n.sort((e,y)=>$[e.estado]-$[y.estado]).map(e=>d(e,a[e.ticker],"down")).join("")}
        </div>`:""}

      ${u.length>0?`
        <div class="al-section">
          <div class="al-section-title new">✦ NUEVOS (primer análisis)</div>
          ${u.map(e=>d(e,null,"new")).join("")}
        </div>`:""}

      ${f.length>0?`
        <div class="al-section collapsed">
          <div class="al-section-title neutral" style="cursor:pointer;" onclick="this.parentElement.classList.toggle('collapsed')">
            = SIN CAMBIOS (${f.length}) <span style="font-size:10px;color:var(--text3)">▸ mostrar/ocultar</span>
          </div>
          <div class="al-collapsed-body">
            ${f.map(e=>d(e,a[e.ticker],"neutral")).join("")}
          </div>
        </div>`:""}

      ${g.length>0?`
        <div class="al-section">
          <div class="al-section-title error">⚠ SIN DATOS (${g.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;padding-top:8px;">
            ${g.map(e=>`<span style="font-family:var(--mono);font-size:10px;color:var(--text3);background:var(--surface2);padding:3px 8px;border-radius:4px;">${e.ticker}</span>`).join("")}
          </div>
        </div>`:""}
    `}function d(t,s,a){const r={ready:"var(--green)",diario:"var(--amber)",close:"var(--blue)",watching:"var(--text3)"},c=s?B[s.estado]:"—",n=B[t.estado]||"—",f=a==="up"||a==="down"?"→":"",u=t.price?"$"+t.price.toFixed(2):"—",g=s!=null&&s.price?"$"+s.price.toFixed(2):null;return`
      <div class="al-card ${a}">
        <div class="al-card-left">
          <div class="al-ticker">${t.ticker}</div>
          <div class="al-wl">${P[t.wl]}</div>
        </div>
        <div class="al-card-center">
          ${s?`<span class="al-state prev">${c}</span><span class="al-arrow">${f}</span>`:""}
          <span class="al-state curr" style="color:${r[t.estado]||"var(--text3)"}">${n}</span>
        </div>
        <div class="al-card-right">
          <div class="al-score">${t.score}/10</div>
          <div class="al-price">${u}${g&&g!==u?` <span style="color:var(--text3);font-size:9px;">(ant. ${g})</span>`:""}</div>
        </div>
      </div>`}function i(t){const s=document.getElementById("alertas-badge");s&&(t>0?(s.textContent=t,s.style.display="inline"):s.style.display="none")}return(h=document.getElementById("alertas-refresh-btn"))==null||h.addEventListener("click",p),p(),{destroy(){}}}export{Y as render};
