const _="ethan_watchlist_v1",et=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];function A(s,i){const c=2/(i+1),d=new Array(s.length).fill(null);let w=s.findIndex(n=>n!=null&&!isNaN(n));if(w<0)return d;d[w]=s[w];for(let n=w+1;n<s.length;n++){const m=s[n]!=null&&!isNaN(s[n])?s[n]:d[n-1];d[n]=m*c+d[n-1]*(1-c)}return d}function P(s,i=12,c=26,d=9){const w=A(s,i),n=A(s,c),m=w.map((a,o)=>a!=null&&n[o]!=null?a-n[o]:null);return{m,sl:A(m.map(a=>a??0),d)}}function W(s,i=14){const c=new Array(s.length).fill(null);if(s.length<i+1)return c;let d=0,w=0;for(let a=1;a<=i;a++){const o=s[a]-s[a-1];o>0?d+=o:w-=o}let n=d/i,m=w/i;c[i]=m===0?100:100-100/(1+n/m);for(let a=i+1;a<s.length;a++){const o=s[a]-s[a-1];n=(n*(i-1)+(o>0?o:0))/i,m=(m*(i-1)+(o<0?-o:0))/i,c[a]=m===0?100:100-100/(1+n/m)}return c}function H(s,i,c,d=14,w=3){const n=c.map((o,u)=>{if(u<d-1)return null;const r=Math.max(...s.slice(u-d+1,u+1)),v=Math.min(...i.slice(u-d+1,u+1));return r===v?50:(o-v)/(r-v)*100});function m(o,u){return o.map((r,v)=>{if(v<u-1)return null;const t=o.slice(v-u+1,v+1).filter(l=>l!=null);return t.length===u?t.reduce((l,p)=>l+p,0)/u:null})}const a=m(n,w);return{k:a,d:m(a.map(o=>o??0),w)}}function tt(s,i,c,d,w,n,m){const a={};s.forEach((u,r)=>{const v=new Date(u*1e3);let t;if(m==="W"){const l=v.getDay(),p=v.getDate()-l+(l===0?-6:1),e=new Date(+v);e.setDate(p),t=e.toISOString().slice(0,10)}else t=`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}`;a[t]?(a[t].h=Math.max(a[t].h,c[r]),a[t].l=Math.min(a[t].l,d[r]),a[t].c=w[r],a[t].v+=n[r]):a[t]={o:i[r],h:c[r],l:d[r],c:w[r],v:n[r]}});const o=Object.keys(a).sort();return{dates:o,opens:o.map(u=>a[u].o),highs:o.map(u=>a[u].h),lows:o.map(u=>a[u].l),closes:o.map(u=>a[u].c),vols:o.map(u=>a[u].v)}}async function lt(s){var c,d,w,n,m,a,o;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`;for(const u of et)try{const r=await fetch(u(i),{signal:AbortSignal.timeout(8e3)});if(!r.ok)continue;const v=await r.text();let t;try{t=JSON.parse(v)}catch{continue}const l=(d=(c=t==null?void 0:t.chart)==null?void 0:c.result)==null?void 0:d[0];if(!l)continue;const p=(n=(w=l.indicators)==null?void 0:w.quote)==null?void 0:n[0];if(!p)continue;const e=((o=(a=(m=l.indicators)==null?void 0:m.adjclose)==null?void 0:a[0])==null?void 0:o.adjclose)||p.close,h=e.map((k,f)=>p.close[f]&&k?k/p.close[f]:1),$=l.meta||{};return{timestamps:l.timestamp,opens:p.open.map((k,f)=>k*h[f]),highs:p.high.map((k,f)=>k*h[f]),lows:p.low.map((k,f)=>k*h[f]),closes:e,vols:p.volume,name:$.shortName||$.longName||s,currency:$.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function at(s){const{timestamps:i,opens:c,highs:d,lows:w,closes:n,vols:m,name:a,currency:o}=s,u=n.length,r=tt(i,c,d,w,n,m,"W"),v=tt(i,c,d,w,n,m,"M"),t=P(n),l=W(n,14),p=A(n,5),e=A(n,10),h=u-1,$=P(r.closes),k=H(r.highs,r.lows,r.closes,89),f=W(r.closes,14),M=A(r.closes,10),I=A(r.closes,20),g=r.closes.length-1,x=P(v.closes),E=H(v.highs,v.lows,v.closes,89),Y=H(v.highs,v.lows,v.closes,8),K=W(v.closes,14),V=A(v.closes,10),y=v.closes.length-1,S=J=>J!=null&&!isNaN(J)?J.toFixed(2):"—",C={ok:x.m[y]>0&&x.m[y]>x.sl[y],label:"MACD>0↑",val:S(x.m[y])},R={ok:E.k[y]>80&&E.k[y]>E.d[y]||E.k[y]>92,opt:E.k[y]>92,label:"Stoch89>80",val:S(E.k[y])},L={ok:K[y]>65,label:"RSI>65",val:S(K[y])},T={ok:Y.k[y]>78,label:"Stoch8>78",val:S(Y.k[y])},j={ok:V[y]!=null&&v.closes[y]>V[y],label:"P>EMA10",val:S(v.closes[y])},D=C.ok&&R.ok&&L.ok&&T.ok&&j.ok,q={ok:$.m[g]>0&&$.m[g]>$.sl[g],label:"MACD>0↑",val:S($.m[g])},U={ok:k.k[g]>85&&k.k[g]>k.d[g]||k.k[g]>92,opt:k.k[g]>92,label:"Stoch89>85",val:S(k.k[g])},z={ok:f[g]>67,label:"RSI>67",val:S(f[g])},B={ok:I[g]!=null&&r.closes[g]>I[g],label:"P>EMA20",val:S(r.closes[g])},N=q.ok&&U.ok&&z.ok&&B.ok,X=t.m[h]>0,F=h>0&&t.m[h]>t.sl[h]&&t.m[h-1]<=t.sl[h-1],Q=l[h]>57,Z=X&&F&&Q;let b=0;C.ok&&b++,R.ok&&b++,L.ok&&b++,T.ok&&b++,j.ok&&b++,q.ok&&b++,U.ok&&b++,z.ok&&b++,B.ok&&b++,D&&N&&b++;let O="watching";return D&&N&&Z?O="ready":D&&N?O="diario":b>=7&&(O="close"),{name:a,currency:o,price:n[h],score:b,estado:O,mensualOk:D,semanalOk:N,dailyReady:Z,mc:[C,R,L,T,j],sc:[q,U,z,B],dc:{pos:{ok:X,label:"MACD>0",val:S(t.m[h])},cross:{ok:F,label:"MACD↑ cruza",val:F?"SÍ":"NO"},rsi:{ok:Q,label:"RSI>57",val:S(l[h])}},stopSemanal:M[g],ema5d:p[h],ema10d:e[h]}}function nt(s){return s>=9?"var(--green)":s>=7?"#6ee7b7":s>=5?"var(--amber)":"var(--text3)"}function ot(s){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[s]||"—"}function it(s){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[s]||""}function ct(s){return`<span class="wl-cond ${s.ok?"ok":""} ${s.opt?"opt":""}">${s.label}</span>`}function st(s){return s.map(i=>ct(i)).join("")}function G(s){return`<div class="wl-detail-row">
    <span class="wl-cond-dot ${s.ok?"ok":""}"></span>
    <span class="wl-detail-label">${s.label}</span>
    <span class="wl-detail-val">${s.val}</span>
  </div>`}async function dt(s,{actionsSlot:i}){var r,v;let c=[];try{c=JSON.parse(localStorage.getItem(_))||[]}catch{c=[]}const d={},w={};i.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-input" placeholder="Añadir ticker..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-last-update"></span>
    </div>
  `,s.innerHTML='<div id="wl-list"></div>';function n(t){const l=d[t],p=!!w[t];if(!l||l.status==="loading")return`
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
      </div>`;const e=l.result,h=nt(e.score),$=e.stopSemanal?((e.price-e.stopSemanal)/e.price*100).toFixed(1):null,k=f=>f!=null&&!isNaN(f)?"$"+f.toFixed(2):"—";return`
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
            <div class="wl-score-num" style="color:${h}">${e.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${e.score*10}%;background:${h}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${st(e.mc)}</div>
          <div class="wl-conds">${st(e.sc)}</div>
          <div><span class="wl-state-chip ${it(e.estado)}">${ot(e.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${t}">✕</button></div>
        </div>
        <div class="wl-detail ${p?"open":""}" id="wldetail-${t}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${e.mensualOk?"✓":""}</div>
              ${e.mc.map(f=>G(f)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${e.semanalOk?"✓":""}</div>
              ${e.sc.map(f=>G(f)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(e.dc).map(f=>G(f)).join("")}
              <div class="wl-daily-signal ${e.dailyReady?"ready":""}">
                ${e.dailyReady?"🚀 ENTRADA ACTIVA — MACD cruzó al alza":"⏳ Sin señal de entrada diaria todavía"}
              </div>
              ${e.ema5d!=null?`<div class="wl-ema-row"><span>EMA5d</span><span>$${e.ema5d.toFixed(2)}</span></div>`:""}
              ${e.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d (stop)</span><span>$${e.ema10d.toFixed(2)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function m(){const t=document.getElementById("wl-list");if(!t)return;if(c.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">👁</div>
          <div class="empty-title">Watchlist vacía</div>
          <div class="empty-desc">Añade tickers aquí arriba o pulsa + Watchlist en cualquier screener</div>
        </div>`;return}const l=[...c].sort((e,h)=>{var f,M,I,g;const $=((M=(f=d[e])==null?void 0:f.result)==null?void 0:M.score)??-1;return(((g=(I=d[h])==null?void 0:I.result)==null?void 0:g.score)??-1)-$});t.innerHTML=l.map(e=>n(e)).join("");const p=document.getElementById("wl-last-update");p&&(p.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),a()}function a(){document.querySelectorAll(".wl-expandable").forEach(t=>{t.addEventListener("click",l=>{if(l.target.classList.contains("wl-del-btn"))return;const p=t.dataset.ticker;w[p]=!w[p];const e=document.getElementById(`wldetail-${p}`);e&&e.classList.toggle("open",w[p])})}),document.querySelectorAll(".wl-del-btn").forEach(t=>{t.addEventListener("click",l=>{l.stopPropagation();const p=t.dataset.ticker;c=c.filter(e=>e!==p),localStorage.setItem(_,JSON.stringify(c)),delete d[p],m()})})}async function o(t){d[t]={status:"loading"},m();try{const l=await lt(t);d[t]={status:"ok",result:at(l)}}catch(l){d[t]={status:"error",error:l.message.slice(0,50)}}m()}function u(t){const l=t.trim().toUpperCase().replace(/\s+/g,"");if(l){if(c.includes(l)){m();return}c.push(l),localStorage.setItem(_,JSON.stringify(c)),o(l)}}(r=document.getElementById("wl-add-btn"))==null||r.addEventListener("click",()=>{const t=document.getElementById("wl-input");t!=null&&t.value.trim()&&(u(t.value),t.value="")}),(v=document.getElementById("wl-input"))==null||v.addEventListener("keydown",t=>{if(t.key==="Enter"){t.preventDefault();const l=document.getElementById("wl-input");if(!(l!=null&&l.value.trim()))return;u(l.value),l.value=""}}),m();for(const t of c)o(t);return{destroy(){}}}function rt(s){try{const i=JSON.parse(localStorage.getItem(_))||[];i.includes(s)||(i.push(s),localStorage.setItem(_,JSON.stringify(i)))}catch{}}export{rt as addToWatchlist,dt as render};
