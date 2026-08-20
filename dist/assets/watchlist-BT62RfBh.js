import{U as x}from"./userdata-DxgjZ95P.js";import"./index-BuBCrzrQ.js";const O="ethan_watchlist_bajista_v1",et=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];function A(s,v){const m=2/(v+1),d=new Array(s.length).fill(null);let f=s.findIndex(n=>n!=null&&!isNaN(n));if(f<0)return d;d[f]=s[f];for(let n=f+1;n<s.length;n++){const w=s[n]!=null&&!isNaN(s[n])?s[n]:d[n-1];d[n]=w*m+d[n-1]*(1-m)}return d}function G(s,v=12,m=26,d=9){const f=A(s,v),n=A(s,m),w=f.map((a,r)=>a!=null&&n[r]!=null?a-n[r]:null);return{m:w,sl:A(w.map(a=>a??0),d)}}function Y(s,v=14){const m=new Array(s.length).fill(null);if(s.length<v+1)return m;let d=0,f=0;for(let a=1;a<=v;a++){const r=s[a]-s[a-1];r>0?d+=r:f-=r}let n=d/v,w=f/v;m[v]=w===0?100:100-100/(1+n/w);for(let a=v+1;a<s.length;a++){const r=s[a]-s[a-1];n=(n*(v-1)+(r>0?r:0))/v,w=(w*(v-1)+(r<0?-r:0))/v,m[a]=w===0?100:100-100/(1+n/w)}return m}function I(s,v,m,d=14,f=3){const n=m.map((r,p)=>{if(p<d-1)return null;const u=Math.max(...s.slice(p-d+1,p+1)),i=Math.min(...v.slice(p-d+1,p+1));return u===i?50:(r-i)/(u-i)*100});function w(r,p){return r.map((u,i)=>{if(i<p-1)return null;const t=r.slice(i-p+1,i+1).filter(l=>l!=null);return t.length===p?t.reduce((l,c)=>l+c,0)/p:null})}const a=w(n,f);return{k:a,d:w(a.map(r=>r??0),f)}}function tt(s,v,m,d,f,n,w){const a={};s.forEach((p,u)=>{const i=new Date(p*1e3);let t;if(w==="W"){const l=i.getDay(),c=i.getDate()-l+(l===0?-6:1),e=new Date(+i);e.setDate(c),t=e.toISOString().slice(0,10)}else t=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}`;a[t]?(a[t].h=Math.max(a[t].h,m[u]),a[t].l=Math.min(a[t].l,d[u]),a[t].c=f[u],a[t].v+=n[u]):a[t]={o:v[u],h:m[u],l:d[u],c:f[u],v:n[u]}});const r=Object.keys(a).sort();return{dates:r,opens:r.map(p=>a[p].o),highs:r.map(p=>a[p].h),lows:r.map(p=>a[p].l),closes:r.map(p=>a[p].c),vols:r.map(p=>a[p].v)}}async function lt(s){var m,d,f,n,w,a,r;const v=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`;for(const p of et)try{const u=await fetch(p(v),{signal:AbortSignal.timeout(8e3)});if(!u.ok)continue;const i=await u.text();let t;try{t=JSON.parse(i)}catch{continue}const l=(d=(m=t==null?void 0:t.chart)==null?void 0:m.result)==null?void 0:d[0];if(!l)continue;const c=(n=(f=l.indicators)==null?void 0:f.quote)==null?void 0:n[0];if(!c)continue;const e=((r=(a=(w=l.indicators)==null?void 0:w.adjclose)==null?void 0:a[0])==null?void 0:r.adjclose)||c.close,g=e.map((k,o)=>c.close[o]&&k?k/c.close[o]:1),$=l.meta||{};return{timestamps:l.timestamp,opens:c.open.map((k,o)=>k*g[o]),highs:c.high.map((k,o)=>k*g[o]),lows:c.low.map((k,o)=>k*g[o]),closes:e,vols:c.volume,name:$.shortName||$.longName||s,currency:$.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function at(s){const{timestamps:v,opens:m,highs:d,lows:f,closes:n,vols:w,name:a,currency:r}=s,p=n.length,u=tt(v,m,d,f,n,w,"W"),i=tt(v,m,d,f,n,w,"M");G(n),Y(n,14);const t=A(n,5),l=A(n,10),c=p-1,e=G(u.closes),g=I(u.highs,u.lows,u.closes,89),$=Y(u.closes,14);A(u.closes,10);const k=A(u.closes,20),o=u.closes.length-1,_=G(i.closes),S=I(i.highs,i.lows,i.closes,89),E=I(i.highs,i.lows,i.closes,8),K=Y(i.closes,14),V=A(i.closes,10),h=i.closes.length-1,b=H=>H!=null&&!isNaN(H)?H.toFixed(2):"—",X=I(i.highs,i.lows,i.closes,14),M={ok:V[h]!=null&&i.closes[h]<V[h],label:"P<EMA10",val:b(i.closes[h])},C={ok:_.m[h]<0&&_.m[h]<_.sl[h],label:"MACD↓<0",val:b(_.m[h])},T={ok:S.k[h]<S.d[h]&&(h<1||S.k[h-1]>=S.d[h-1]||S.k[h]<20),label:"Stoch89↓",val:b(S.k[h])},L={ok:K[h]<41,label:"RSI<41",val:b(K[h])},N={ok:X.k[h]<30,label:"Stoch14<30",val:b(X.k[h])},j={ok:E.k[h]<E.d[h]&&(h<1||E.k[h-1]>=E.d[h-1]||E.k[h]<20),label:"Stoch8↓",val:b(E.k[h])},U=M.ok&&C.ok&&T.ok&&L.ok&&N.ok&&j.ok,Q=I(u.highs,u.lows,u.closes,14),q={ok:e.m[o]<0&&e.m[o]<e.sl[o],label:"MACD↓<0",val:b(e.m[o])},B={ok:g.k[o]<20&&g.k[o]<g.d[o],label:"Stoch89↓<20",val:b(g.k[o])},F={ok:Q.k[o]<20,label:"Stoch14<20",val:b(Q.k[o])},W={ok:$[o]<40,label:"RSI<40",val:b($[o])},P=q.ok&&B.ok&&F.ok&&W.ok,R=I(d,f,n,8),z=c>0&&R.k[c]<R.d[c]&&R.k[c-1]>=R.d[c-1],Z=z;let y=0;M.ok&&y++,C.ok&&y++,T.ok&&y++,L.ok&&y++,N.ok&&y++,j.ok&&y++,q.ok&&y++,B.ok&&y++,F.ok&&y++,W.ok&&y++;let D="watching";return U&&P&&Z?D="ready":U&&P?D="diario":y>=7&&(D="close"),{name:a,currency:r,price:n[c],score:y,estado:D,mensualOk:U,semanalOk:P,dailyReady:Z,mc:[M,C,T,L,N,j],sc:[q,B,F,W],dc:{s8cross:{ok:z,label:"Stoch8↓",val:z?"SÍ":"NO"}},stopSemanal:k[o],ema5d:t[c],ema10d:l[c]}}function nt(s){return s>=9?"var(--green)":s>=7?"#6ee7b7":s>=5?"var(--amber)":"var(--text3)"}function ot(s){return{ready:"🔴 CORTO LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[s]||"—"}function it(s){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[s]||""}function ct(s){return`<span class="wl-cond ${s.ok?"ok":""} ${s.opt?"opt":""}">${s.label}</span>`}function st(s){return s.map(v=>ct(v)).join("")}function J(s){return`<div class="wl-detail-row">
    <span class="wl-cond-dot ${s.ok?"ok":""}"></span>
    <span class="wl-detail-label">${s.label}</span>
    <span class="wl-detail-val">${s.val}</span>
  </div>`}async function vt(s,{actionsSlot:v}){var u,i;let m=await x.get(O)||[];const d={},f={};v.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-input" placeholder="Añadir ticker..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-last-update"></span>
    </div>
  `,s.innerHTML='<div id="wl-list"></div>';function n(t){const l=d[t],c=!!f[t];if(!l||l.status==="loading")return`
      <div class="wl-card loading" id="wlcard-${t}">
        <div class="wl-card-main">
          <div><div class="wl-ticker">${t}</div></div>
          <div><span class="wl-spinner"></span></div>
          <div class="wl-card-center">Cargando...</div>
          <div></div><div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${t}">✕</button></div>
        </div>
      </div>`;if(l.status==="error")return`
      <div class="wl-card error" id="wlcard-${t}">
        <div class="wl-card-main">
          <div><div class="wl-ticker">${t}</div><div class="wl-name" style="color:var(--red)">Error al cargar</div></div>
          <div>—</div><div>—</div>
          <div style="font-size:11px;color:var(--red)">${l.error||"Sin datos"}</div>
          <div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${t}">✕</button></div>
        </div>
      </div>`;const e=l.result,g=nt(e.score),$=e.stopSemanal?((e.price-e.stopSemanal)/e.price*100).toFixed(1):null,k=o=>o!=null&&!isNaN(o)?"$"+o.toFixed(2):"—";return`
      <div class="wl-card ${e.estado}" id="wlcard-${t}">
        <div class="wl-card-main wl-expandable" data-ticker="${t}">
          <div>
            <div class="wl-ticker">${t}</div>
            <div class="wl-name">${e.name||""}</div>
          </div>
          <div>
            <div class="wl-price">${k(e.price)}</div>
            ${$!=null?`<div class="wl-stop">Stop: ${k(e.stopSemanal)} (${$}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${g}">${e.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${e.score*10}%;background:${g}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${st(e.mc)}</div>
          <div class="wl-conds">${st(e.sc)}</div>
          <div><span class="wl-state-chip ${it(e.estado)}">${ot(e.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${t}">✕</button></div>
        </div>
        <div class="wl-detail ${c?"open":""}" id="wldetail-${t}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${e.mensualOk?"✓":""}</div>
              ${e.mc.map(o=>J(o)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${e.semanalOk?"✓":""}</div>
              ${e.sc.map(o=>J(o)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(e.dc).map(o=>J(o)).join("")}
              <div class="wl-daily-signal ${e.dailyReady?"ready":""}">
                ${e.dailyReady?"🔴 ENTRADA CORTO ACTIVA — Stoch8 cortó a la baja":"⏳ Sin señal de entrada bajista todavía"}
              </div>
              ${e.stopSemanal!=null?`<div class="wl-ema-row"><span>Stop (EMA20 sem.)</span><span>$${e.stopSemanal.toFixed(2)}</span></div>`:""}
              ${e.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d ref.</span><span>$${e.ema10d.toFixed(2)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function w(){const t=document.getElementById("wl-list");if(!t)return;if(m.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">👁</div>
          <div class="empty-title">Watchlist vacía</div>
          <div class="empty-desc">Añade tickers aquí arriba o pulsa + Watchlist en cualquier screener</div>
        </div>`;return}const l=[...m].sort((e,g)=>{var o,_,S,E;const $=((_=(o=d[e])==null?void 0:o.result)==null?void 0:_.score)??-1;return(((E=(S=d[g])==null?void 0:S.result)==null?void 0:E.score)??-1)-$});t.innerHTML=l.map(e=>n(e)).join("");const c=document.getElementById("wl-last-update");c&&(c.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),a()}function a(){document.querySelectorAll(".wl-expandable").forEach(t=>{t.addEventListener("click",l=>{if(l.target.classList.contains("wl-del-btn"))return;const c=t.dataset.ticker;f[c]=!f[c];const e=document.getElementById(`wldetail-${c}`);e&&e.classList.toggle("open",f[c])})}),document.querySelectorAll(".wl-del-btn").forEach(t=>{t.addEventListener("click",l=>{l.stopPropagation();const c=t.dataset.ticker;m=m.filter(e=>e!==c),x.set(O,m),delete d[c],w()})})}async function r(t){d[t]={status:"loading"},w();try{const l=await lt(t);d[t]={status:"ok",result:at(l)}}catch(l){d[t]={status:"error",error:l.message.slice(0,50)}}w()}function p(t){const l=t.trim().toUpperCase().replace(/\s+/g,"");if(l){if(m.includes(l)){w();return}m.push(l),x.set(O,m),r(l)}}(u=document.getElementById("wl-add-btn"))==null||u.addEventListener("click",()=>{const t=document.getElementById("wl-input");t!=null&&t.value.trim()&&(p(t.value),t.value="")}),(i=document.getElementById("wl-input"))==null||i.addEventListener("keydown",t=>{if(t.key==="Enter"){t.preventDefault();const l=document.getElementById("wl-input");if(!(l!=null&&l.value.trim()))return;p(l.value),l.value=""}}),w();for(const t of m)r(t);return{destroy(){}}}async function ut(s){try{const v=await x.get(O)||[];v.includes(s)||(v.push(s),await x.set(O,v))}catch{}}export{ut as addToWatchlist,vt as render};
