const E="ethan_watchlist_rf_v1",te=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`],ne={TLT:{name:"Bonos Tesoro USA 20+a",emoji:"🇺🇸",cat:"Gobierno USA"},IEF:{name:"Bonos Tesoro USA 7-10a",emoji:"🇺🇸",cat:"Gobierno USA"},SHY:{name:"Bonos Tesoro USA 1-3a",emoji:"🇺🇸",cat:"Gobierno USA"},IEI:{name:"Bonos Tesoro USA 3-7a",emoji:"🇺🇸",cat:"Gobierno USA"},GOVT:{name:"Bonos Gobierno USA",emoji:"🇺🇸",cat:"Gobierno USA"},TIP:{name:"TIPS inflación USA",emoji:"🇺🇸",cat:"Gobierno USA"},SCHP:{name:"TIPS Schwab",emoji:"🇺🇸",cat:"Gobierno USA"},VGIT:{name:"Bonos Gobierno 5-10a",emoji:"🇺🇸",cat:"Gobierno USA"},VGLT:{name:"Bonos Gobierno 25+a",emoji:"🇺🇸",cat:"Gobierno USA"},SPTL:{name:"Bonos Largo Plazo SPDR",emoji:"🇺🇸",cat:"Gobierno USA"},LQD:{name:"Corp. Investment Grade",emoji:"🏢",cat:"Corporativo USA"},VCIT:{name:"Corp. Medio Plazo",emoji:"🏢",cat:"Corporativo USA"},VCLT:{name:"Corp. Largo Plazo",emoji:"🏢",cat:"Corporativo USA"},USIG:{name:"Corp. IG USA",emoji:"🏢",cat:"Corporativo USA"},IGSB:{name:"Corp. Corto Plazo IG",emoji:"🏢",cat:"Corporativo USA"},IGIB:{name:"Corp. Medio Plazo IG",emoji:"🏢",cat:"Corporativo USA"},HYG:{name:"High Yield iShares",emoji:"⚡",cat:"High Yield"},JNK:{name:"High Yield SPDR",emoji:"⚡",cat:"High Yield"},USHY:{name:"High Yield USA",emoji:"⚡",cat:"High Yield"},ANGL:{name:"Fallen Angels USD",emoji:"⚡",cat:"High Yield"},BNDX:{name:"Bonos Intl. Vanguard",emoji:"🌍",cat:"Internacional"},BWX:{name:"Bonos Gobierno Intl.",emoji:"🌍",cat:"Internacional"},EMB:{name:"Bonos Emergentes USD",emoji:"🌍",cat:"Internacional"},PCY:{name:"Bonos Emergentes Invesco",emoji:"🌍",cat:"Internacional"},VWOB:{name:"Bonos Emergentes Vanguard",emoji:"🌍",cat:"Internacional"},IGOV:{name:"Bonos Gobierno DM",emoji:"🌍",cat:"Internacional"},IAGG:{name:"Agregado Intl. iShares",emoji:"🌍",cat:"Internacional"},BND:{name:"Agregado USA Vanguard",emoji:"📊",cat:"Agregado"},AGG:{name:"Agregado USA iShares",emoji:"📊",cat:"Agregado"},FBND:{name:"Agregado USA Fidelity",emoji:"📊",cat:"Agregado"},SCHZ:{name:"Agregado USA Schwab",emoji:"📊",cat:"Agregado"},SPAB:{name:"Agregado USA SPDR",emoji:"📊",cat:"Agregado"},SHV:{name:"Letras Tesoro <1a",emoji:"💵",cat:"Corto Plazo"},BIL:{name:"T-Bills 1-3 meses",emoji:"💵",cat:"Corto Plazo"},SGOV:{name:"T-Bills 0-3m iShares",emoji:"💵",cat:"Corto Plazo"},MINT:{name:"Money Market PIMCO",emoji:"💵",cat:"Corto Plazo"}};function oe(a){return ne[a]||{name:a,emoji:"📈",cat:"ETF RF"}}function $(a,p){const s=2/(p+1),l=new Array(a.length).fill(null);let u=a.findIndex(i=>i!=null&&!isNaN(i));if(u<0)return l;l[u]=a[u];for(let i=u+1;i<a.length;i++){const m=a[i]!=null&&!isNaN(a[i])?a[i]:l[i-1];l[i]=m*s+l[i-1]*(1-s)}return l}function z(a){const p=$(a,12),s=$(a,26),l=p.map((u,i)=>u!=null&&s[i]!=null?u-s[i]:null);return{m:l,sl:$(l.map(u=>u??0),9)}}function H(a,p=14){const s=new Array(a.length).fill(null);if(a.length<p+1)return s;let l=0,u=0;for(let n=1;n<=p;n++){const v=a[n]-a[n-1];v>0?l+=v:u-=v}let i=l/p,m=u/p;s[p]=m===0?100:100-100/(1+i/m);for(let n=p+1;n<a.length;n++){const v=a[n]-a[n-1];i=(i*(p-1)+(v>0?v:0))/p,m=(m*(p-1)+(v<0?-v:0))/p,s[n]=m===0?100:100-100/(1+i/m)}return s}function Y(a,p,s,l=14,u=3){const i=s.map((v,c)=>{if(c<l-1)return null;const d=Math.max(...a.slice(c-l+1,c+1)),r=Math.min(...p.slice(c-l+1,c+1));return d===r?50:(v-r)/(d-r)*100});function m(v,c){return v.map((d,r)=>{if(r<c-1)return null;const e=v.slice(r-c+1,r+1).filter(t=>t!=null);return e.length===c?e.reduce((t,g)=>t+g,0)/c:null})}const n=m(i,u);return{k:n,d:m(n.map(v=>v??0),u)}}function ee(a,p,s,l,u,i,m){const n={};a.forEach((c,d)=>{const r=new Date(c*1e3);let e;if(m==="W"){const t=r.getDay(),g=r.getDate()-t+(t===0?-6:1),w=new Date(+r);w.setDate(g),e=w.toISOString().slice(0,10)}else e=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`;n[e]?(n[e].h=Math.max(n[e].h,s[d]),n[e].l=Math.min(n[e].l,l[d]),n[e].c=u[d],n[e].v+=i[d]):n[e]={o:p[d],h:s[d],l:l[d],c:u[d],v:i[d]}});const v=Object.keys(n).sort();return{dates:v,opens:v.map(c=>n[c].o),highs:v.map(c=>n[c].h),lows:v.map(c=>n[c].l),closes:v.map(c=>n[c].c),vols:v.map(c=>n[c].v)}}async function se(a){var s,l,u,i,m,n,v;const p=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`;for(const c of te)try{const d=await fetch(c(p),{signal:AbortSignal.timeout(8e3)});if(!d.ok)continue;const r=await d.text();let e;try{e=JSON.parse(r)}catch{continue}const t=(l=(s=e==null?void 0:e.chart)==null?void 0:s.result)==null?void 0:l[0];if(!t)continue;const g=(i=(u=t.indicators)==null?void 0:u.quote)==null?void 0:i[0];if(!g)continue;const w=((v=(n=(m=t.indicators)==null?void 0:m.adjclose)==null?void 0:n[0])==null?void 0:v.adjclose)||g.close,o=w.map((S,f)=>g.close[f]&&S?S/g.close[f]:1);return{timestamps:t.timestamp,opens:g.open.map((S,f)=>S*o[f]),highs:g.high.map((S,f)=>S*o[f]),lows:g.low.map((S,f)=>S*o[f]),closes:w,vols:g.volume}}catch{}throw new Error("Sin datos disponibles")}function le(a,p){const{timestamps:s,opens:l,highs:u,lows:i,closes:m,vols:n}=a,v=m.length,c=oe(p),d=ee(s,l,u,i,m,n,"W"),r=ee(s,l,u,i,m,n,"M"),e=z(m),t=H(m),g=$(m,5),w=$(m,10),o=v-1,S=z(d.closes),f=Y(d.highs,d.lows,d.closes,89),I=H(d.closes),h=$(d.closes,10),W=$(d.closes,20),y=d.closes.length-1,T=z(r.closes),j=Y(r.highs,r.lows,r.closes,89),q=Y(r.highs,r.lows,r.closes,8),J=H(r.closes),X=$(r.closes,10),A=r.closes.length-1,k=F=>F!=null&&!isNaN(F)?F.toFixed(2):"—",G={ok:T.m[A]>0&&T.m[A]>T.sl[A],label:"MACD>0↑",val:k(T.m[A])},x={ok:j.k[A]>80&&j.k[A]>j.d[A]||j.k[A]>92,opt:j.k[A]>92,label:"Stoch89>80",val:k(j.k[A])},D={ok:J[A]>65,label:"RSI>65",val:k(J[A])},M={ok:q.k[A]>78,label:"Stoch8>78",val:k(q.k[A])},_={ok:X[A]!=null&&r.closes[A]>X[A],label:"P>EMA10",val:k(r.closes[A])},C=G.ok&&x.ok&&D.ok&&M.ok&&_.ok,L={ok:S.m[y]>0&&S.m[y]>S.sl[y],label:"MACD>0↑",val:k(S.m[y])},N={ok:f.k[y]>85&&f.k[y]>f.d[y]||f.k[y]>92,opt:f.k[y]>92,label:"Stoch89>85",val:k(f.k[y])},O={ok:I[y]>67,label:"RSI>67",val:k(I[y])},R={ok:W[y]!=null&&d.closes[y]>W[y],label:"P>EMA20",val:k(d.closes[y])},U=L.ok&&N.ok&&O.ok&&R.ok,K=e.m[o]>0,P=o>0&&e.m[o]>e.sl[o]&&e.m[o-1]<=e.sl[o-1],Q=t[o]>57,Z=K&&P&&Q;let b=0;G.ok&&b++,x.ok&&b++,D.ok&&b++,M.ok&&b++,_.ok&&b++,L.ok&&b++,N.ok&&b++,O.ok&&b++,R.ok&&b++,C&&U&&b++;let B="watching";return C&&U&&Z?B="ready":C&&U?B="diario":b>=7&&(B="close"),{name:c.name,emoji:c.emoji,cat:c.cat,price:m[o],score:b,estado:B,mensualOk:C,semanalOk:U,dailyReady:Z,mc:[G,x,D,M,_],sc:[L,N,O,R],dc:{pos:{ok:K,label:"MACD>0",val:k(e.m[o])},cross:{ok:P,label:"MACD↑ cruza",val:P?"SÍ":"NO"},rsi:{ok:Q,label:"RSI>57",val:k(t[o])}},stopSemanal:h[y],ema5d:g[o],ema10d:w[o]}}function ie(a){return a>=9?"var(--green)":a>=7?"#6ee7b7":a>=5?"var(--amber)":"var(--text3)"}function ce(a){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[a]||"—"}function de(a){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[a]||""}function ae(a){return`<span class="wl-cond ${a.ok?"ok":""} ${a.opt?"opt":""}">${a.label}</span>`}function V(a){return`<div class="wl-detail-row"><span class="wl-cond-dot ${a.ok?"ok":""}"></span><span class="wl-detail-label">${a.label}</span><span class="wl-detail-val">${a.val}</span></div>`}async function re(a,{actionsSlot:p}){var d,r;let s=[];try{s=JSON.parse(localStorage.getItem(E))||[]}catch{s=[]}const l={},u={};p.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-rf-input" placeholder="ETF: TLT, IEF, HYG, BNDX..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-rf-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-rf-last-update"></span>
    </div>
  `,a.innerHTML='<div id="wl-rf-list"></div>';function i(e){const t=l[e],g=!!u[e],w=oe(e);if(!t||t.status==="loading")return`
      <div class="wl-card loading">
        <div class="wl-card-main">
          <div><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px">${w.emoji}</span><div><div class="wl-ticker">${e}</div><div class="wl-name">${w.name}</div></div></div></div>
          <div><span class="wl-spinner"></span></div>
          <div>Cargando...</div><div></div><div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
      </div>`;if(t.status==="error")return`
      <div class="wl-card error">
        <div class="wl-card-main">
          <div><div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px">${w.emoji}</span><div><div class="wl-ticker">${e}</div><div class="wl-name" style="color:var(--red)">Error al cargar</div></div></div></div>
          <div>—</div><div>—</div><div style="font-size:11px;color:var(--red)">${t.error||"Sin datos"}</div>
          <div></div><div></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
      </div>`;const o=t.result,S=ie(o.score),f=o.stopSemanal?((o.price-o.stopSemanal)/o.price*100).toFixed(1):null,I=h=>h!=null&&!isNaN(h)?"$"+h.toFixed(2):"—";return`
      <div class="wl-card ${o.estado}">
        <div class="wl-card-main wl-expandable" data-ticker="${e}">
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;line-height:1">${o.emoji}</span>
              <div>
                <div style="display:flex;align-items:center;gap:7px;">
                  <span class="wl-ticker">${e}</span>
                  <span style="font-size:8px;color:var(--text3);font-family:var(--mono);background:var(--surface2);padding:1px 5px;border-radius:3px;">${o.cat}</span>
                </div>
                <div class="wl-name">${o.name}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="wl-price">${I(o.price)}</div>
            ${f!=null?`<div class="wl-stop">Stop: ${I(o.stopSemanal)} (${f}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${S}">${o.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${o.score*10}%;background:${S}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${o.mc.map(h=>ae(h)).join("")}</div>
          <div class="wl-conds">${o.sc.map(h=>ae(h)).join("")}</div>
          <div><span class="wl-state-chip ${de(o.estado)}">${ce(o.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
        <div class="wl-detail ${g?"open":""}" id="wldetail-rf-${e}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${o.mensualOk?"✓":""}</div>
              ${o.mc.map(h=>V(h)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${o.semanalOk?"✓":""}</div>
              ${o.sc.map(h=>V(h)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(o.dc).map(h=>V(h)).join("")}
              <div class="wl-daily-signal ${o.dailyReady?"ready":""}">
                ${o.dailyReady?"🚀 ENTRADA ACTIVA":"⏳ Sin señal de entrada diaria todavía"}
              </div>
              ${o.ema5d!=null?`<div class="wl-ema-row"><span>EMA5d</span><span>${I(o.ema5d)}</span></div>`:""}
              ${o.ema10d!=null?`<div class="wl-ema-row"><span>EMA10d (stop)</span><span>${I(o.ema10d)}</span></div>`:""}
            </div>
          </div>
        </div>
      </div>`}function m(){const e=document.getElementById("wl-rf-list");if(!e)return;if(s.length===0){e.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📋</div>
          <div class="empty-title">Watchlist de Renta Fija vacía</div>
          <div class="empty-desc">Añade ETFs aquí arriba o pulsa + WL en el screener de RF.<br>Ejemplos: TLT, IEF, BND, HYG, BNDX, EMB...</div>
        </div>`;return}const t=[...s].sort((w,o)=>{var S,f,I,h;return(((f=(S=l[o])==null?void 0:S.result)==null?void 0:f.score)??-1)-(((h=(I=l[w])==null?void 0:I.result)==null?void 0:h.score)??-1)});e.innerHTML=t.map(w=>i(w)).join("");const g=document.getElementById("wl-rf-last-update");g&&(g.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),n()}function n(){document.querySelectorAll(".wl-expandable").forEach(e=>{e.addEventListener("click",t=>{if(t.target.classList.contains("wl-del-btn"))return;const g=e.dataset.ticker;u[g]=!u[g];const w=document.getElementById(`wldetail-rf-${g}`);w&&w.classList.toggle("open",u[g])})}),document.querySelectorAll(".wl-del-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const g=e.dataset.ticker;s=s.filter(w=>w!==g),localStorage.setItem(E,JSON.stringify(s)),delete l[g],m()})})}async function v(e){l[e]={status:"loading"},m();try{const t=await se(e);l[e]={status:"ok",result:le(t,e)}}catch(t){l[e]={status:"error",error:t.message.slice(0,50)}}m()}function c(e){const t=e.trim().toUpperCase();t&&(s.includes(t)||(s.push(t),localStorage.setItem(E,JSON.stringify(s)),v(t)))}(d=document.getElementById("wl-rf-add-btn"))==null||d.addEventListener("click",()=>{const e=document.getElementById("wl-rf-input");e!=null&&e.value.trim()&&(c(e.value),e.value="")}),(r=document.getElementById("wl-rf-input"))==null||r.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const t=document.getElementById("wl-rf-input");if(!(t!=null&&t.value.trim()))return;c(t.value),t.value=""}}),m();for(const e of s)v(e);return{destroy(){}}}function me(a){try{const p=JSON.parse(localStorage.getItem(E))||[];p.includes(a)||(p.push(a),localStorage.setItem(E,JSON.stringify(p)))}catch{}}export{me as addToWatchlist,re as render};
