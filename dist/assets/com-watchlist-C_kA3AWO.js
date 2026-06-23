const I="ethan_watchlist_com_v1",le=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`],ne={"GC=F":{name:"Oro",emoji:"🥇"},GLD:{name:"Oro · SPDR Gold Trust",emoji:"🥇"},IAU:{name:"Oro · iShares",emoji:"🥇"},"SI=F":{name:"Plata",emoji:"🥈"},SLV:{name:"Plata · iShares",emoji:"🥈"},"PL=F":{name:"Platino",emoji:"⬜"},"PA=F":{name:"Paladio",emoji:"🔘"},PPLT:{name:"Platino · Sprott",emoji:"⬜"},"CL=F":{name:"Petróleo WTI",emoji:"🛢️"},"BZ=F":{name:"Petróleo Brent",emoji:"🛢️"},USO:{name:"Petróleo · US Oil Fund",emoji:"🛢️"},UCO:{name:"Petróleo · ProShares 2x",emoji:"🛢️"},"NG=F":{name:"Gas Natural",emoji:"🔥"},UNG:{name:"Gas Natural · US Fund",emoji:"🔥"},"RB=F":{name:"Gasolina RBOB",emoji:"⛽"},"HO=F":{name:"Gasóleo",emoji:"🏭"},"HG=F":{name:"Cobre",emoji:"🟤"},CPER:{name:"Cobre · US ETF",emoji:"🟤"},COPX:{name:"Cobre · Mineras",emoji:"🟤"},"ALI=F":{name:"Aluminio",emoji:"🔩"},"ZNC=F":{name:"Zinc",emoji:"⚙️"},"ZW=F":{name:"Trigo",emoji:"🌾"},WEAT:{name:"Trigo · Teucrium",emoji:"🌾"},"ZC=F":{name:"Maíz",emoji:"🌽"},CORN:{name:"Maíz · Teucrium",emoji:"🌽"},"ZS=F":{name:"Soja",emoji:"🫘"},SOYB:{name:"Soja · Teucrium",emoji:"🫘"},"SB=F":{name:"Azúcar",emoji:"🍬"},CANE:{name:"Azúcar · Teucrium",emoji:"🍬"},"KC=F":{name:"Café",emoji:"☕"},JO:{name:"Café · iPath",emoji:"☕"},"CC=F":{name:"Cacao",emoji:"🍫"},NIB:{name:"Cacao · iPath",emoji:"🍫"},"CT=F":{name:"Algodón",emoji:"🤍"},"LE=F":{name:"Ganado Bovino",emoji:"🐄"},"HE=F":{name:"Cerdos",emoji:"🐷"},GSG:{name:"Commodities · iShares",emoji:"🌐"},PDBC:{name:"Commodities · Invesco",emoji:"🌐"},DJP:{name:"Commodities · iPath",emoji:"🌐"},COMT:{name:"Commodities · iShares GSCI",emoji:"🌐"}};function oe(a){return ne[a]||{name:a,emoji:a.includes("=F")?"📊":"📈"}}function C(a,m){const i=2/(m+1),c=new Array(a.length).fill(null);let v=a.findIndex(d=>d!=null&&!isNaN(d));if(v<0)return c;c[v]=a[v];for(let d=v+1;d<a.length;d++){const l=a[d]!=null&&!isNaN(a[d])?a[d]:c[d-1];c[d]=l*i+c[d-1]*(1-i)}return c}function J(a,m=12,i=26,c=9){const v=C(a,m),d=C(a,i),l=v.map((t,n)=>t!=null&&d[n]!=null?t-d[n]:null);return{m:l,sl:C(l.map(t=>t??0),c)}}function q(a,m=14){const i=new Array(a.length).fill(null);if(a.length<m+1)return i;let c=0,v=0;for(let t=1;t<=m;t++){const n=a[t]-a[t-1];n>0?c+=n:v-=n}let d=c/m,l=v/m;i[m]=l===0?100:100-100/(1+d/l);for(let t=m+1;t<a.length;t++){const n=a[t]-a[t-1];d=(d*(m-1)+(n>0?n:0))/m,l=(l*(m-1)+(n<0?-n:0))/m,i[t]=l===0?100:100-100/(1+d/l)}return i}function H(a,m,i,c=14,v=3){const d=i.map((n,u)=>{if(u<c-1)return null;const f=Math.max(...a.slice(u-c+1,u+1)),y=Math.min(...m.slice(u-c+1,u+1));return f===y?50:(n-y)/(f-y)*100});function l(n,u){return n.map((f,y)=>{if(y<u-1)return null;const e=n.slice(y-u+1,y+1).filter(s=>s!=null);return e.length===u?e.reduce((s,r)=>s+r,0)/u:null})}const t=l(d,v);return{k:t,d:l(t.map(n=>n??0),v)}}function se(a,m,i,c,v,d,l){const t={};a.forEach((u,f)=>{const y=new Date(u*1e3);let e;if(l==="W"){const s=y.getDay(),r=y.getDate()-s+(s===0?-6:1),h=new Date(+y);h.setDate(r),e=h.toISOString().slice(0,10)}else e=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}`;t[e]?(t[e].h=Math.max(t[e].h,i[f]),t[e].l=Math.min(t[e].l,c[f]),t[e].c=v[f],t[e].v+=d[f]):t[e]={o:m[f],h:i[f],l:c[f],c:v[f],v:d[f]}});const n=Object.keys(t).sort();return{dates:n,opens:n.map(u=>t[u].o),highs:n.map(u=>t[u].h),lows:n.map(u=>t[u].l),closes:n.map(u=>t[u].c),vols:n.map(u=>t[u].v)}}async function ie(a){var i,c,v,d,l,t,n;const m=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`;for(const u of le)try{const f=await fetch(u(m),{signal:AbortSignal.timeout(8e3)});if(!f.ok)continue;const y=await f.text();let e;try{e=JSON.parse(y)}catch{continue}const s=(c=(i=e==null?void 0:e.chart)==null?void 0:i.result)==null?void 0:c[0];if(!s)continue;const r=(d=(v=s.indicators)==null?void 0:v.quote)==null?void 0:d[0];if(!r)continue;const h=((n=(t=(l=s.indicators)==null?void 0:l.adjclose)==null?void 0:t[0])==null?void 0:n.adjclose)||r.close,o=h.map((p,g)=>r.close[g]&&p?p/r.close[g]:1),b=s.meta||{};return{timestamps:s.timestamp,opens:r.open.map((p,g)=>p*o[g]),highs:r.high.map((p,g)=>p*o[g]),lows:r.low.map((p,g)=>p*o[g]),closes:h,vols:r.volume,currency:b.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function ce(a,m){const{timestamps:i,opens:c,highs:v,lows:d,closes:l,vols:t,currency:n}=a,u=l.length,f=oe(m),y=m.includes("=F"),e=se(i,c,v,d,l,t,"W"),s=se(i,c,v,d,l,t,"M"),r=J(l),h=q(l,14),o=C(l,5),b=C(l,10),p=u-1,g=J(e.closes),w=H(e.highs,e.lows,e.closes,89),A=q(e.closes,14),E=C(e.closes,10),Y=C(e.closes,20),k=e.closes.length-1,O=J(s.closes),F=H(s.highs,s.lows,s.closes,89),V=H(s.highs,s.lows,s.closes,8),K=q(s.closes,14),X=C(s.closes,10),S=s.closes.length-1,j=W=>W!=null&&!isNaN(W)?W.toFixed(2):"—",D={ok:O.m[S]>0&&O.m[S]>O.sl[S],label:"MACD>0↑",val:j(O.m[S])},L={ok:F.k[S]>80&&F.k[S]>F.d[S]||F.k[S]>92,opt:F.k[S]>92,label:"Stoch89>80",val:j(F.k[S])},M={ok:K[S]>65,label:"RSI>65",val:j(K[S])},N={ok:V.k[S]>78,label:"Stoch8>78",val:j(V.k[S])},P={ok:X[S]!=null&&s.closes[S]>X[S],label:"P>EMA10",val:j(s.closes[S])},T=D.ok&&L.ok&&M.ok&&N.ok&&P.ok,R={ok:g.m[k]>0&&g.m[k]>g.sl[k],label:"MACD>0↑",val:j(g.m[k])},G={ok:w.k[k]>85&&w.k[k]>w.d[k]||w.k[k]>92,opt:w.k[k]>92,label:"Stoch89>85",val:j(w.k[k])},U={ok:A[k]>67,label:"RSI>67",val:j(A[k])},B={ok:Y[k]!=null&&e.closes[k]>Y[k],label:"P>EMA20",val:j(e.closes[k])},x=R.ok&&G.ok&&U.ok&&B.ok,Q=r.m[p]>0,z=p>0&&r.m[p]>r.sl[p]&&r.m[p-1]<=r.sl[p-1],ee=h[p]>57,ae=Q&&z&&ee;let $=0;D.ok&&$++,L.ok&&$++,M.ok&&$++,N.ok&&$++,P.ok&&$++,R.ok&&$++,G.ok&&$++,U.ok&&$++,B.ok&&$++,T&&x&&$++;let _="watching";return T&&x&&ae?_="ready":T&&x?_="diario":$>=7&&(_="close"),{name:f.name,emoji:f.emoji,isFutures:y,currency:n,price:l[p],score:$,estado:_,mensualOk:T,semanalOk:x,dailyReady:ae,mc:[D,L,M,N,P],sc:[R,G,U,B],dc:{pos:{ok:Q,label:"MACD>0",val:j(r.m[p])},cross:{ok:z,label:"MACD↑ cruza",val:z?"SÍ":"NO"},rsi:{ok:ee,label:"RSI>57",val:j(h[p])}},stopSemanal:E[k],ema5d:o[p],ema10d:b[p]}}function de(a){return a>=9?"var(--green)":a>=7?"#6ee7b7":a>=5?"var(--amber)":"var(--text3)"}function re(a){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[a]||"—"}function me(a){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[a]||""}function te(a){return`<span class="wl-cond ${a.ok?"ok":""} ${a.opt?"opt":""}">${a.label}</span>`}function Z(a){return`<div class="wl-detail-row">
    <span class="wl-cond-dot ${a.ok?"ok":""}"></span>
    <span class="wl-detail-label">${a.label}</span>
    <span class="wl-detail-val">${a.val}</span>
  </div>`}async function ue(a,{actionsSlot:m}){var f,y;let i=[];try{i=JSON.parse(localStorage.getItem(I))||[]}catch{i=[]}const c={},v={};m.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-com-input" placeholder="Ticker: GC=F, GLD, CL=F..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-com-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-com-last-update"></span>
    </div>
  `,a.innerHTML='<div id="wl-com-list"></div>';function d(e){const s=c[e],r=!!v[e],h=oe(e);if(!s||s.status==="loading")return`
      <div class="wl-card loading" id="wlcard-${e.replace("=","-")}">
        <div class="wl-card-main">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px">${h.emoji}</span>
              <div>
                <div class="wl-ticker">${e.replace("=F","")}</div>
                <div class="wl-name">${h.name}</div>
              </div>
            </div>
          </div>
          <div><span class="wl-spinner"></span></div>
          <div class="wl-card-center">Cargando...</div>
          <div></div><div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
      </div>`;if(s.status==="error")return`
      <div class="wl-card error" id="wlcard-${e.replace("=","-")}">
        <div class="wl-card-main">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px">${h.emoji}</span>
              <div>
                <div class="wl-ticker">${e.replace("=F","")}</div>
                <div class="wl-name" style="color:var(--red)">Error al cargar</div>
              </div>
            </div>
          </div>
          <div>—</div><div>—</div>
          <div style="font-size:11px;color:var(--red)">${s.error||"Sin datos"}</div>
          <div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
      </div>`;const o=s.result,b=de(o.score),p=o.stopSemanal?((o.price-o.stopSemanal)/o.price*100).toFixed(1):null,g=w=>w!=null&&!isNaN(w)?o.currency==="USD"?"$"+w.toFixed(2):w.toFixed(2)+" "+o.currency:"—";return`
      <div class="wl-card ${o.estado}" id="wlcard-${e.replace("=","-")}">
        <div class="wl-card-main wl-expandable" data-ticker="${e}">
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;line-height:1">${o.emoji}</span>
              <div>
                <div style="display:flex;align-items:center;gap:7px;">
                  <span class="wl-ticker">${e.replace("=F","")}</span>
                  <span class="cm-type-badge ${o.isFutures?"cm-type-futures":"cm-type-etf"}">${o.isFutures?"FUTURO":"ETF"}</span>
                </div>
                <div class="wl-name">${o.name}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="wl-price">${g(o.price)}</div>
            ${p!=null?`<div class="wl-stop">Stop: ${g(o.stopSemanal)} (${p}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${b}">${o.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${o.score*10}%;background:${b}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${o.mc.map(w=>te(w)).join("")}</div>
          <div class="wl-conds">${o.sc.map(w=>te(w)).join("")}</div>
          <div><span class="wl-state-chip ${me(o.estado)}">${re(o.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
        <div class="wl-detail ${r?"open":""}" id="wldetail-${e.replace("=","-")}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${o.mensualOk?"✓":""}</div>
              ${o.mc.map(w=>Z(w)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${o.semanalOk?"✓":""}</div>
              ${o.sc.map(w=>Z(w)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(o.dc).map(w=>Z(w)).join("")}
              <div class="wl-daily-signal ${o.dailyReady?"ready":""}">
                ${o.dailyReady?"🚀 ENTRADA ACTIVA — MACD cruzó al alza":"⏳ Sin señal de entrada diaria todavía"}
              </div>
              ${o.ema5d!=null?`<div class="wl-ema-row"><span>EMA5d</span><span>${g(o.ema5d)}</span></div>`:""}
              ${o.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d (stop)</span><span>${g(o.ema10d)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function l(){const e=document.getElementById("wl-com-list");if(!e)return;if(i.length===0){e.innerHTML=`
        <div class="empty">
          <div class="empty-icon">🪙</div>
          <div class="empty-title">Watchlist de Commodities vacía</div>
          <div class="empty-desc">Añade tickers aquí arriba o pulsa + WL en el screener de commodities.<br>Puedes usar futuros (GC=F, CL=F, NG=F...) o ETFs (GLD, USO, SLV...)</div>
        </div>`;return}const s=[...i].sort((h,o)=>{var g,w,A,E;const b=((w=(g=c[h])==null?void 0:g.result)==null?void 0:w.score)??-1;return(((E=(A=c[o])==null?void 0:A.result)==null?void 0:E.score)??-1)-b});e.innerHTML=s.map(h=>d(h)).join("");const r=document.getElementById("wl-com-last-update");r&&(r.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),t()}function t(){document.querySelectorAll(".wl-expandable").forEach(e=>{e.addEventListener("click",s=>{if(s.target.classList.contains("wl-del-btn"))return;const r=e.dataset.ticker;v[r]=!v[r];const h=document.getElementById(`wldetail-${r.replace("=","-")}`);h&&h.classList.toggle("open",v[r])})}),document.querySelectorAll(".wl-del-btn").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const r=e.dataset.ticker;i=i.filter(h=>h!==r),localStorage.setItem(I,JSON.stringify(i)),delete c[r],l()})})}async function n(e){c[e]={status:"loading"},l();try{const s=await ie(e);c[e]={status:"ok",result:ce(s,e)}}catch(s){c[e]={status:"error",error:s.message.slice(0,50)}}l()}function u(e){const s=e.trim().toUpperCase().replace(/\s+/g,"");if(s){if(i.includes(s)){l();return}i.push(s),localStorage.setItem(I,JSON.stringify(i)),n(s)}}(f=document.getElementById("wl-com-add-btn"))==null||f.addEventListener("click",()=>{const e=document.getElementById("wl-com-input");e!=null&&e.value.trim()&&(u(e.value),e.value="")}),(y=document.getElementById("wl-com-input"))==null||y.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const s=document.getElementById("wl-com-input");if(!(s!=null&&s.value.trim()))return;u(s.value),s.value=""}}),l();for(const e of i)n(e);return{destroy(){}}}function ve(a){try{const m=JSON.parse(localStorage.getItem(I))||[];m.includes(a)||(m.push(a),localStorage.setItem(I,JSON.stringify(m)))}catch{}}export{ve as addToWatchlist,ue as render};
