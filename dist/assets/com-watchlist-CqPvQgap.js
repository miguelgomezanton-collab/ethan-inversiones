import{U as E}from"./userdata-CvV5RMPs.js";import"./index-C3d4C5TD.js";const I="ethan_watchlist_com_v1",le=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`],ie={"GC=F":{name:"Oro",emoji:"🥇"},GLD:{name:"Oro · SPDR Gold Trust",emoji:"🥇"},IAU:{name:"Oro · iShares",emoji:"🥇"},"SI=F":{name:"Plata",emoji:"🥈"},SLV:{name:"Plata · iShares",emoji:"🥈"},"PL=F":{name:"Platino",emoji:"⬜"},"PA=F":{name:"Paladio",emoji:"🔘"},PPLT:{name:"Platino · Sprott",emoji:"⬜"},"CL=F":{name:"Petróleo WTI",emoji:"🛢️"},"BZ=F":{name:"Petróleo Brent",emoji:"🛢️"},USO:{name:"Petróleo · US Oil Fund",emoji:"🛢️"},UCO:{name:"Petróleo · ProShares 2x",emoji:"🛢️"},"NG=F":{name:"Gas Natural",emoji:"🔥"},UNG:{name:"Gas Natural · US Fund",emoji:"🔥"},"RB=F":{name:"Gasolina RBOB",emoji:"⛽"},"HO=F":{name:"Gasóleo",emoji:"🏭"},"HG=F":{name:"Cobre",emoji:"🟤"},CPER:{name:"Cobre · US ETF",emoji:"🟤"},COPX:{name:"Cobre · Mineras",emoji:"🟤"},"ALI=F":{name:"Aluminio",emoji:"🔩"},"ZNC=F":{name:"Zinc",emoji:"⚙️"},"ZW=F":{name:"Trigo",emoji:"🌾"},WEAT:{name:"Trigo · Teucrium",emoji:"🌾"},"ZC=F":{name:"Maíz",emoji:"🌽"},CORN:{name:"Maíz · Teucrium",emoji:"🌽"},"ZS=F":{name:"Soja",emoji:"🫘"},SOYB:{name:"Soja · Teucrium",emoji:"🫘"},"SB=F":{name:"Azúcar",emoji:"🍬"},CANE:{name:"Azúcar · Teucrium",emoji:"🍬"},"KC=F":{name:"Café",emoji:"☕"},JO:{name:"Café · iPath",emoji:"☕"},"CC=F":{name:"Cacao",emoji:"🍫"},NIB:{name:"Cacao · iPath",emoji:"🍫"},"CT=F":{name:"Algodón",emoji:"🤍"},"LE=F":{name:"Ganado Bovino",emoji:"🐄"},"HE=F":{name:"Cerdos",emoji:"🐷"},GSG:{name:"Commodities · iShares",emoji:"🌐"},PDBC:{name:"Commodities · Invesco",emoji:"🌐"},DJP:{name:"Commodities · iPath",emoji:"🌐"},COMT:{name:"Commodities · iShares GSCI",emoji:"🌐"}};function ne(a){return ie[a]||{name:a,emoji:a.includes("=F")?"📊":"📈"}}function C(a,m){const i=2/(m+1),c=new Array(a.length).fill(null);let v=a.findIndex(d=>d!=null&&!isNaN(d));if(v<0)return c;c[v]=a[v];for(let d=v+1;d<a.length;d++){const n=a[d]!=null&&!isNaN(a[d])?a[d]:c[d-1];c[d]=n*i+c[d-1]*(1-i)}return c}function H(a,m=12,i=26,c=9){const v=C(a,m),d=C(a,i),n=v.map((t,l)=>t!=null&&d[l]!=null?t-d[l]:null);return{m:n,sl:C(n.map(t=>t??0),c)}}function Z(a,m=14){const i=new Array(a.length).fill(null);if(a.length<m+1)return i;let c=0,v=0;for(let t=1;t<=m;t++){const l=a[t]-a[t-1];l>0?c+=l:v-=l}let d=c/m,n=v/m;i[m]=n===0?100:100-100/(1+d/n);for(let t=m+1;t<a.length;t++){const l=a[t]-a[t-1];d=(d*(m-1)+(l>0?l:0))/m,n=(n*(m-1)+(l<0?-l:0))/m,i[t]=n===0?100:100-100/(1+d/n)}return i}function Y(a,m,i,c=14,v=3){const d=i.map((l,u)=>{if(u<c-1)return null;const f=Math.max(...a.slice(u-c+1,u+1)),g=Math.min(...m.slice(u-c+1,u+1));return f===g?50:(l-g)/(f-g)*100});function n(l,u){return l.map((f,g)=>{if(g<u-1)return null;const e=l.slice(g-u+1,g+1).filter(s=>s!=null);return e.length===u?e.reduce((s,r)=>s+r,0)/u:null})}const t=n(d,v);return{k:t,d:n(t.map(l=>l??0),v)}}function te(a,m,i,c,v,d,n){const t={};a.forEach((u,f)=>{const g=new Date(u*1e3);let e;if(n==="W"){const s=g.getDay(),r=g.getDate()-s+(s===0?-6:1),h=new Date(+g);h.setDate(r),e=h.toISOString().slice(0,10)}else e=`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}`;t[e]?(t[e].h=Math.max(t[e].h,i[f]),t[e].l=Math.min(t[e].l,c[f]),t[e].c=v[f],t[e].v+=d[f]):t[e]={o:m[f],h:i[f],l:c[f],c:v[f],v:d[f]}});const l=Object.keys(t).sort();return{dates:l,opens:l.map(u=>t[u].o),highs:l.map(u=>t[u].h),lows:l.map(u=>t[u].l),closes:l.map(u=>t[u].c),vols:l.map(u=>t[u].v)}}async function ce(a){var i,c,v,d,n,t,l;const m=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`;for(const u of le)try{const f=await fetch(u(m),{signal:AbortSignal.timeout(8e3)});if(!f.ok)continue;const g=await f.text();let e;try{e=JSON.parse(g)}catch{continue}const s=(c=(i=e==null?void 0:e.chart)==null?void 0:i.result)==null?void 0:c[0];if(!s)continue;const r=(d=(v=s.indicators)==null?void 0:v.quote)==null?void 0:d[0];if(!r)continue;const h=((l=(t=(n=s.indicators)==null?void 0:n.adjclose)==null?void 0:t[0])==null?void 0:l.adjclose)||r.close,o=h.map((p,y)=>r.close[y]&&p?p/r.close[y]:1),b=s.meta||{};return{timestamps:s.timestamp,opens:r.open.map((p,y)=>p*o[y]),highs:r.high.map((p,y)=>p*o[y]),lows:r.low.map((p,y)=>p*o[y]),closes:h,vols:r.volume,currency:b.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function de(a,m){const{timestamps:i,opens:c,highs:v,lows:d,closes:n,vols:t,currency:l}=a,u=n.length,f=ne(m),g=m.includes("=F"),e=te(i,c,v,d,n,t,"W"),s=te(i,c,v,d,n,t,"M"),r=H(n),h=Z(n,14),o=C(n,5),b=C(n,10),p=u-1,y=H(e.closes),w=Y(e.highs,e.lows,e.closes,89),A=Z(e.closes,14),O=C(e.closes,10),V=C(e.closes,20),$=e.closes.length-1,T=H(s.closes),F=Y(s.highs,s.lows,s.closes,89),K=Y(s.highs,s.lows,s.closes,8),X=Z(s.closes,14),Q=C(s.closes,10),k=s.closes.length-1,S=q=>q!=null&&!isNaN(q)?q.toFixed(2):"—",L={ok:T.m[k]>0&&T.m[k]>T.sl[k],label:"MACD>0↑",val:S(T.m[k])},M={ok:F.k[k]>80&&F.k[k]>F.d[k]||F.k[k]>92,opt:F.k[k]>92,label:"Stoch89>80",val:S(F.k[k])},P={ok:X[k]>65,label:"RSI>65",val:S(X[k])},R={ok:K.k[k]>78,label:"Stoch8>78",val:S(K.k[k])},N={ok:Q[k]!=null&&s.closes[k]>Q[k],label:"P>EMA10",val:S(s.closes[k])},x=L.ok&&M.ok&&P.ok&&R.ok&&N.ok,G={ok:y.m[$]>0&&y.m[$]>y.sl[$],label:"MACD>0↑",val:S(y.m[$])},U={ok:w.k[$]>85&&w.k[$]>w.d[$]||w.k[$]>92,opt:w.k[$]>92,label:"Stoch89>85",val:S(w.k[$])},B={ok:A[$]>67,label:"RSI>67",val:S(A[$])},z={ok:V[$]!=null&&e.closes[$]>V[$],label:"P>EMA20",val:S(e.closes[$])},_=G.ok&&U.ok&&B.ok&&z.ok,ee=r.m[p]>0,W=p>0&&r.m[p]>r.sl[p]&&r.m[p-1]<=r.sl[p-1],ae=h[p]>57,se=ee&&W&&ae;let j=0;L.ok&&j++,M.ok&&j++,P.ok&&j++,R.ok&&j++,N.ok&&j++,G.ok&&j++,U.ok&&j++,B.ok&&j++,z.ok&&j++,x&&_&&j++;let D="watching";return x&&_&&se?D="ready":x&&_?D="diario":j>=7&&(D="close"),{name:f.name,emoji:f.emoji,isFutures:g,currency:l,price:n[p],score:j,estado:D,mensualOk:x,semanalOk:_,dailyReady:se,mc:[L,M,P,R,N],sc:[G,U,B,z],dc:{pos:{ok:ee,label:"MACD>0",val:S(r.m[p])},cross:{ok:W,label:"MACD↑ cruza",val:W?"SÍ":"NO"},rsi:{ok:ae,label:"RSI>57",val:S(h[p])}},stopSemanal:O[$],ema5d:o[p],ema10d:b[p]}}function re(a){return a>=9?"var(--green)":a>=7?"#6ee7b7":a>=5?"var(--amber)":"var(--text3)"}function me(a){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[a]||"—"}function ue(a){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[a]||""}function oe(a){return`<span class="wl-cond ${a.ok?"ok":""} ${a.opt?"opt":""}">${a.label}</span>`}function J(a){return`<div class="wl-detail-row">
    <span class="wl-cond-dot ${a.ok?"ok":""}"></span>
    <span class="wl-detail-label">${a.label}</span>
    <span class="wl-detail-val">${a.val}</span>
  </div>`}async function we(a,{actionsSlot:m}){var f,g;let i=[];try{i=await E.get(I)||[]}catch{i=[]}const c={},v={};m.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-com-input" placeholder="Ticker: GC=F, GLD, CL=F..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-com-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-com-last-update"></span>
    </div>
  `,a.innerHTML='<div id="wl-com-list"></div>';function d(e){const s=c[e],r=!!v[e],h=ne(e);if(!s||s.status==="loading")return`
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
      </div>`;const o=s.result,b=re(o.score),p=o.stopSemanal?((o.price-o.stopSemanal)/o.price*100).toFixed(1):null,y=w=>w!=null&&!isNaN(w)?o.currency==="USD"?"$"+w.toFixed(2):w.toFixed(2)+" "+o.currency:"—";return`
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
            <div class="wl-price">${y(o.price)}</div>
            ${p!=null?`<div class="wl-stop">Stop: ${y(o.stopSemanal)} (${p}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${b}">${o.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${o.score*10}%;background:${b}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${o.mc.map(w=>oe(w)).join("")}</div>
          <div class="wl-conds">${o.sc.map(w=>oe(w)).join("")}</div>
          <div><span class="wl-state-chip ${ue(o.estado)}">${me(o.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
        <div class="wl-detail ${r?"open":""}" id="wldetail-${e.replace("=","-")}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${o.mensualOk?"✓":""}</div>
              ${o.mc.map(w=>J(w)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${o.semanalOk?"✓":""}</div>
              ${o.sc.map(w=>J(w)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(o.dc).map(w=>J(w)).join("")}
              <div class="wl-daily-signal ${o.dailyReady?"ready":""}">
                ${o.dailyReady?"🚀 ENTRADA ACTIVA — MACD cruzó al alza":"⏳ Sin señal de entrada diaria todavía"}
              </div>
              ${o.ema5d!=null?`<div class="wl-ema-row"><span>EMA5d</span><span>${y(o.ema5d)}</span></div>`:""}
              ${o.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d (stop)</span><span>${y(o.ema10d)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function n(){const e=document.getElementById("wl-com-list");if(!e)return;if(i.length===0){e.innerHTML=`
        <div class="empty">
          <div class="empty-icon">🪙</div>
          <div class="empty-title">Watchlist de Commodities vacía</div>
          <div class="empty-desc">Añade tickers aquí arriba o pulsa + WL en el screener de commodities.<br>Puedes usar futuros (GC=F, CL=F, NG=F...) o ETFs (GLD, USO, SLV...)</div>
        </div>`;return}const s=[...i].sort((h,o)=>{var y,w,A,O;const b=((w=(y=c[h])==null?void 0:y.result)==null?void 0:w.score)??-1;return(((O=(A=c[o])==null?void 0:A.result)==null?void 0:O.score)??-1)-b});e.innerHTML=s.map(h=>d(h)).join("");const r=document.getElementById("wl-com-last-update");r&&(r.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),t()}function t(){document.querySelectorAll(".wl-expandable").forEach(e=>{e.addEventListener("click",s=>{if(s.target.classList.contains("wl-del-btn"))return;const r=e.dataset.ticker;v[r]=!v[r];const h=document.getElementById(`wldetail-${r.replace("=","-")}`);h&&h.classList.toggle("open",v[r])})}),document.querySelectorAll(".wl-del-btn").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const r=e.dataset.ticker;i=i.filter(h=>h!==r),await E.set(I,i),delete c[r],n()})})}async function l(e){c[e]={status:"loading"},n();try{const s=await ce(e);c[e]={status:"ok",result:de(s,e)}}catch(s){c[e]={status:"error",error:s.message.slice(0,50)}}n()}async function u(e){const s=e.trim().toUpperCase().replace(/\s+/g,"");if(s){if(i.includes(s)){n();return}i.push(s),await E.set(I,i),l(s)}}(f=document.getElementById("wl-com-add-btn"))==null||f.addEventListener("click",()=>{const e=document.getElementById("wl-com-input");e!=null&&e.value.trim()&&(u(e.value),e.value="")}),(g=document.getElementById("wl-com-input"))==null||g.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const s=document.getElementById("wl-com-input");if(!(s!=null&&s.value.trim()))return;u(s.value),s.value=""}}),n();for(const e of i)l(e);return{destroy(){}}}async function fe(a){try{const m=await E.get(I)||[];m.includes(a)||(m.push(a),await E.set(I,m))}catch{}}export{fe as addToWatchlist,we as render};
