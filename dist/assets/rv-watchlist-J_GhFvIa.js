import{UserData as I}from"./userdata-2NGQIm4_.js";import"./index-BgqbrflN.js";const M="ethan_watchlist_v1",lt=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];function A(s,i){const v=2/(i+1),c=new Array(s.length).fill(null);let w=s.findIndex(n=>n!=null&&!isNaN(n));if(w<0)return c;c[w]=s[w];for(let n=w+1;n<s.length;n++){const m=s[n]!=null&&!isNaN(s[n])?s[n]:c[n-1];c[n]=m*v+c[n-1]*(1-v)}return c}function H(s,i=12,v=26,c=9){const w=A(s,i),n=A(s,v),m=w.map((a,o)=>a!=null&&n[o]!=null?a-n[o]:null);return{m,sl:A(m.map(a=>a??0),c)}}function G(s,i=14){const v=new Array(s.length).fill(null);if(s.length<i+1)return v;let c=0,w=0;for(let a=1;a<=i;a++){const o=s[a]-s[a-1];o>0?c+=o:w-=o}let n=c/i,m=w/i;v[i]=m===0?100:100-100/(1+n/m);for(let a=i+1;a<s.length;a++){const o=s[a]-s[a-1];n=(n*(i-1)+(o>0?o:0))/i,m=(m*(i-1)+(o<0?-o:0))/i,v[a]=m===0?100:100-100/(1+n/m)}return v}function Y(s,i,v,c=14,w=3){const n=v.map((o,u)=>{if(u<c-1)return null;const d=Math.max(...s.slice(u-c+1,u+1)),r=Math.min(...i.slice(u-c+1,u+1));return d===r?50:(o-r)/(d-r)*100});function m(o,u){return o.map((d,r)=>{if(r<u-1)return null;const t=o.slice(r-u+1,r+1).filter(l=>l!=null);return t.length===u?t.reduce((l,p)=>l+p,0)/u:null})}const a=m(n,w);return{k:a,d:m(a.map(o=>o??0),w)}}function st(s,i,v,c,w,n,m){const a={};s.forEach((u,d)=>{const r=new Date(u*1e3);let t;if(m==="W"){const l=r.getDay(),p=r.getDate()-l+(l===0?-6:1),e=new Date(+r);e.setDate(p),t=e.toISOString().slice(0,10)}else t=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`;a[t]?(a[t].h=Math.max(a[t].h,v[d]),a[t].l=Math.min(a[t].l,c[d]),a[t].c=w[d],a[t].v+=n[d]):a[t]={o:i[d],h:v[d],l:c[d],c:w[d],v:n[d]}});const o=Object.keys(a).sort();return{dates:o,opens:o.map(u=>a[u].o),highs:o.map(u=>a[u].h),lows:o.map(u=>a[u].l),closes:o.map(u=>a[u].c),vols:o.map(u=>a[u].v)}}async function at(s){var v,c,w,n,m,a,o;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`;for(const u of lt)try{const d=await fetch(u(i),{signal:(()=>{const h=new AbortController;return setTimeout(()=>h.abort(),8e3),h.signal})()});if(!d.ok)continue;const r=await d.text();let t;try{t=JSON.parse(r)}catch{continue}const l=(c=(v=t==null?void 0:t.chart)==null?void 0:v.result)==null?void 0:c[0];if(!l)continue;const p=(n=(w=l.indicators)==null?void 0:w.quote)==null?void 0:n[0];if(!p)continue;const e=((o=(a=(m=l.indicators)==null?void 0:m.adjclose)==null?void 0:a[0])==null?void 0:o.adjclose)||p.close,k=e.map((h,f)=>p.close[f]&&h?h/p.close[f]:1),$=l.meta||{};return{timestamps:l.timestamp,opens:p.open.map((h,f)=>h*k[f]),highs:p.high.map((h,f)=>h*k[f]),lows:p.low.map((h,f)=>h*k[f]),closes:e,vols:p.volume,name:$.shortName||$.longName||s,currency:$.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function nt(s){const{timestamps:i,opens:v,highs:c,lows:w,closes:n,vols:m,name:a,currency:o}=s,u=n.length,d=st(i,v,c,w,n,m,"W"),r=st(i,v,c,w,n,m,"M"),t=H(n),l=G(n,14),p=A(n,5),e=A(n,10),k=u-1,$=H(d.closes),h=Y(d.highs,d.lows,d.closes,89),f=G(d.closes,14),D=A(d.closes,10),_=A(d.closes,20),g=d.closes.length-1,x=H(r.closes),E=Y(r.highs,r.lows,r.closes,89),K=Y(r.highs,r.lows,r.closes,8),V=G(r.closes,14),X=A(r.closes,10),y=r.closes.length-1,S=W=>W!=null&&!isNaN(W)?W.toFixed(2):"—",L={ok:x.m[y]>0&&x.m[y]>x.sl[y],label:"MACD>0↑",val:S(x.m[y])},N={ok:E.k[y]>80&&E.k[y]>E.d[y]||E.k[y]>92,opt:E.k[y]>92,label:"Stoch89>80",val:S(E.k[y])},O={ok:V[y]>65,label:"RSI>65",val:S(V[y])},j={ok:K.k[y]>78,label:"Stoch8>78",val:S(K.k[y])},U={ok:X[y]!=null&&r.closes[y]>X[y],label:"P>EMA10",val:S(r.closes[y])},C=L.ok&&N.ok&&O.ok&&j.ok&&U.ok,q={ok:$.m[g]>0&&$.m[g]>$.sl[g],label:"MACD>0↑",val:S($.m[g])},z={ok:h.k[g]>85&&h.k[g]>h.d[g]||h.k[g]>92,opt:h.k[g]>92,label:"Stoch89>85",val:S(h.k[g])},B={ok:f[g]>67,label:"RSI>67",val:S(f[g])},F={ok:_[g]!=null&&d.closes[g]>_[g],label:"P>EMA20",val:S(d.closes[g])},R=q.ok&&z.ok&&B.ok&&F.ok,Q=t.m[k]>0,P=k>0&&t.m[k]>t.sl[k]&&t.m[k-1]<=t.sl[k-1],Z=l[k]>57,tt=Q&&P&&Z;let b=0;L.ok&&b++,N.ok&&b++,O.ok&&b++,j.ok&&b++,U.ok&&b++,q.ok&&b++,z.ok&&b++,B.ok&&b++,F.ok&&b++,C&&R&&b++;let T="watching";return C&&R&&tt?T="ready":C&&R?T="diario":b>=7&&(T="close"),{name:a,currency:o,price:n[k],score:b,estado:T,mensualOk:C,semanalOk:R,dailyReady:tt,mc:[L,N,O,j,U],sc:[q,z,B,F],dc:{pos:{ok:Q,label:"MACD>0",val:S(t.m[k])},cross:{ok:P,label:"MACD↑ cruza",val:P?"SÍ":"NO"},rsi:{ok:Z,label:"RSI>57",val:S(l[k])}},stopSemanal:D[g],ema5d:p[k],ema10d:e[k]}}function ot(s){return s>=9?"var(--green)":s>=7?"#6ee7b7":s>=5?"var(--amber)":"var(--text3)"}function it(s){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[s]||"—"}function ct(s){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[s]||""}function dt(s){return`<span class="wl-cond ${s.ok?"ok":""} ${s.opt?"opt":""}">${s.label}</span>`}function et(s){return s.map(i=>dt(i)).join("")}function J(s){return`<div class="wl-detail-row">
    <span class="wl-cond-dot ${s.ok?"ok":""}"></span>
    <span class="wl-detail-label">${s.label}</span>
    <span class="wl-detail-val">${s.val}</span>
  </div>`}async function ut(s,{actionsSlot:i}){var d,r;let v=await I.get(M)||[];const c={},w={};i.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-input" placeholder="Añadir ticker..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-last-update"></span>
    </div>
  `,s.innerHTML='<div id="wl-list"></div>';function n(t){const l=c[t],p=!!w[t];if(!l||l.status==="loading")return`
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
      </div>`;const e=l.result,k=ot(e.score),$=e.stopSemanal?((e.price-e.stopSemanal)/e.price*100).toFixed(1):null,h=f=>f!=null&&!isNaN(f)?"$"+f.toFixed(2):"—";return`
      <div class="wl-card ${e.estado}" id="wlcard-${t}">
        <div class="wl-card-main wl-expandable" data-ticker="${t}">
          <div>
            <div class="wl-ticker">${t}</div>
            <div class="wl-name">${e.name||""}</div>
          </div>
          <div>
            <div class="wl-price">${h(e.price)}</div>
            ${$!=null?`<div class="wl-stop">Stop: ${h(e.stopSemanal)} (${$}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${k}">${e.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${e.score*10}%;background:${k}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${et(e.mc)}</div>
          <div class="wl-conds">${et(e.sc)}</div>
          <div><span class="wl-state-chip ${ct(e.estado)}">${it(e.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${t}">✕</button></div>
        </div>
        <div class="wl-detail ${p?"open":""}" id="wldetail-${t}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${e.mensualOk?"✓":""}</div>
              ${e.mc.map(f=>J(f)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${e.semanalOk?"✓":""}</div>
              ${e.sc.map(f=>J(f)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(e.dc).map(f=>J(f)).join("")}
              <div class="wl-daily-signal ${e.dailyReady?"ready":""}">
                ${e.dailyReady?"🚀 ENTRADA ACTIVA — MACD cruzó al alza":"⏳ Sin señal de entrada diaria todavía"}
              </div>
              ${e.ema5d!=null?`<div class="wl-ema-row"><span>EMA5d</span><span>$${e.ema5d.toFixed(2)}</span></div>`:""}
              ${e.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d (stop)</span><span>$${e.ema10d.toFixed(2)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function m(){const t=document.getElementById("wl-list");if(!t)return;if(v.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">👁</div>
          <div class="empty-title">Watchlist vacía</div>
          <div class="empty-desc">Añade tickers aquí arriba o pulsa + Watchlist en cualquier screener</div>
        </div>`;return}const l=[...v].sort((e,k)=>{var f,D,_,g;const $=((D=(f=c[e])==null?void 0:f.result)==null?void 0:D.score)??-1;return(((g=(_=c[k])==null?void 0:_.result)==null?void 0:g.score)??-1)-$});t.innerHTML=l.map(e=>n(e)).join("");const p=document.getElementById("wl-last-update");p&&(p.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),a()}function a(){document.querySelectorAll(".wl-expandable").forEach(t=>{t.addEventListener("click",l=>{if(l.target.classList.contains("wl-del-btn"))return;const p=t.dataset.ticker;w[p]=!w[p];const e=document.getElementById(`wldetail-${p}`);e&&e.classList.toggle("open",w[p])})}),document.querySelectorAll(".wl-del-btn").forEach(t=>{t.addEventListener("click",l=>{l.stopPropagation();const p=t.dataset.ticker;v=v.filter(e=>e!==p),I.set(M,v),delete c[p],m()})})}async function o(t){c[t]={status:"loading"},m();try{const l=await at(t);c[t]={status:"ok",result:nt(l)}}catch(l){c[t]={status:"error",error:l.message.slice(0,50)}}m()}function u(t){const l=t.trim().toUpperCase().replace(/\s+/g,"");if(l){if(v.includes(l)){m();return}v.push(l),I.set(M,v),o(l)}}(d=document.getElementById("wl-add-btn"))==null||d.addEventListener("click",()=>{const t=document.getElementById("wl-input");t!=null&&t.value.trim()&&(u(t.value),t.value="")}),(r=document.getElementById("wl-input"))==null||r.addEventListener("keydown",t=>{if(t.key==="Enter"){t.preventDefault();const l=document.getElementById("wl-input");if(!(l!=null&&l.value.trim()))return;u(l.value),l.value=""}}),m();for(const t of v)o(t);return{destroy(){}}}async function mt(s){try{const i=await I.get(M)||[];i.includes(s)||(i.push(s),await I.set(M,i))}catch{}}export{mt as addToWatchlist,ut as render};
