import{U as E}from"./userdata-C8tf_HXI.js";import"./index-DkkJmNlz.js";const T="ethan_watchlist_rf_v1",ne=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`],se={TLT:{name:"Bonos Tesoro USA 20+a",emoji:"🇺🇸",cat:"Gobierno USA"},IEF:{name:"Bonos Tesoro USA 7-10a",emoji:"🇺🇸",cat:"Gobierno USA"},SHY:{name:"Bonos Tesoro USA 1-3a",emoji:"🇺🇸",cat:"Gobierno USA"},IEI:{name:"Bonos Tesoro USA 3-7a",emoji:"🇺🇸",cat:"Gobierno USA"},GOVT:{name:"Bonos Gobierno USA",emoji:"🇺🇸",cat:"Gobierno USA"},TIP:{name:"TIPS inflación USA",emoji:"🇺🇸",cat:"Gobierno USA"},SCHP:{name:"TIPS Schwab",emoji:"🇺🇸",cat:"Gobierno USA"},VGIT:{name:"Bonos Gobierno 5-10a",emoji:"🇺🇸",cat:"Gobierno USA"},VGLT:{name:"Bonos Gobierno 25+a",emoji:"🇺🇸",cat:"Gobierno USA"},SPTL:{name:"Bonos Largo Plazo SPDR",emoji:"🇺🇸",cat:"Gobierno USA"},LQD:{name:"Corp. Investment Grade",emoji:"🏢",cat:"Corporativo USA"},VCIT:{name:"Corp. Medio Plazo",emoji:"🏢",cat:"Corporativo USA"},VCLT:{name:"Corp. Largo Plazo",emoji:"🏢",cat:"Corporativo USA"},USIG:{name:"Corp. IG USA",emoji:"🏢",cat:"Corporativo USA"},IGSB:{name:"Corp. Corto Plazo IG",emoji:"🏢",cat:"Corporativo USA"},IGIB:{name:"Corp. Medio Plazo IG",emoji:"🏢",cat:"Corporativo USA"},HYG:{name:"High Yield iShares",emoji:"⚡",cat:"High Yield"},JNK:{name:"High Yield SPDR",emoji:"⚡",cat:"High Yield"},USHY:{name:"High Yield USA",emoji:"⚡",cat:"High Yield"},ANGL:{name:"Fallen Angels USD",emoji:"⚡",cat:"High Yield"},BNDX:{name:"Bonos Intl. Vanguard",emoji:"🌍",cat:"Internacional"},BWX:{name:"Bonos Gobierno Intl.",emoji:"🌍",cat:"Internacional"},EMB:{name:"Bonos Emergentes USD",emoji:"🌍",cat:"Internacional"},PCY:{name:"Bonos Emergentes Invesco",emoji:"🌍",cat:"Internacional"},VWOB:{name:"Bonos Emergentes Vanguard",emoji:"🌍",cat:"Internacional"},IGOV:{name:"Bonos Gobierno DM",emoji:"🌍",cat:"Internacional"},IAGG:{name:"Agregado Intl. iShares",emoji:"🌍",cat:"Internacional"},BND:{name:"Agregado USA Vanguard",emoji:"📊",cat:"Agregado"},AGG:{name:"Agregado USA iShares",emoji:"📊",cat:"Agregado"},FBND:{name:"Agregado USA Fidelity",emoji:"📊",cat:"Agregado"},SCHZ:{name:"Agregado USA Schwab",emoji:"📊",cat:"Agregado"},SPAB:{name:"Agregado USA SPDR",emoji:"📊",cat:"Agregado"},SHV:{name:"Letras Tesoro <1a",emoji:"💵",cat:"Corto Plazo"},BIL:{name:"T-Bills 1-3 meses",emoji:"💵",cat:"Corto Plazo"},SGOV:{name:"T-Bills 0-3m iShares",emoji:"💵",cat:"Corto Plazo"},MINT:{name:"Money Market PIMCO",emoji:"💵",cat:"Corto Plazo"}};function te(a){return se[a]||{name:a,emoji:"📈",cat:"ETF RF"}}function $(a,p){const s=2/(p+1),i=new Array(a.length).fill(null);let u=a.findIndex(l=>l!=null&&!isNaN(l));if(u<0)return i;i[u]=a[u];for(let l=u+1;l<a.length;l++){const m=a[l]!=null&&!isNaN(a[l])?a[l]:i[l-1];i[l]=m*s+i[l-1]*(1-s)}return i}function H(a){const p=$(a,12),s=$(a,26),i=p.map((u,l)=>u!=null&&s[l]!=null?u-s[l]:null);return{m:i,sl:$(i.map(u=>u??0),9)}}function Y(a,p=14){const s=new Array(a.length).fill(null);if(a.length<p+1)return s;let i=0,u=0;for(let n=1;n<=p;n++){const v=a[n]-a[n-1];v>0?i+=v:u-=v}let l=i/p,m=u/p;s[p]=m===0?100:100-100/(1+l/m);for(let n=p+1;n<a.length;n++){const v=a[n]-a[n-1];l=(l*(p-1)+(v>0?v:0))/p,m=(m*(p-1)+(v<0?-v:0))/p,s[n]=m===0?100:100-100/(1+l/m)}return s}function V(a,p,s,i=14,u=3){const l=s.map((v,c)=>{if(c<i-1)return null;const d=Math.max(...a.slice(c-i+1,c+1)),r=Math.min(...p.slice(c-i+1,c+1));return d===r?50:(v-r)/(d-r)*100});function m(v,c){return v.map((d,r)=>{if(r<c-1)return null;const e=v.slice(r-c+1,r+1).filter(t=>t!=null);return e.length===c?e.reduce((t,f)=>t+f,0)/c:null})}const n=m(l,u);return{k:n,d:m(n.map(v=>v??0),u)}}function ae(a,p,s,i,u,l,m){const n={};a.forEach((c,d)=>{const r=new Date(c*1e3);let e;if(m==="W"){const t=r.getDay(),f=r.getDate()-t+(t===0?-6:1),w=new Date(+r);w.setDate(f),e=w.toISOString().slice(0,10)}else e=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`;n[e]?(n[e].h=Math.max(n[e].h,s[d]),n[e].l=Math.min(n[e].l,i[d]),n[e].c=u[d],n[e].v+=l[d]):n[e]={o:p[d],h:s[d],l:i[d],c:u[d],v:l[d]}});const v=Object.keys(n).sort();return{dates:v,opens:v.map(c=>n[c].o),highs:v.map(c=>n[c].h),lows:v.map(c=>n[c].l),closes:v.map(c=>n[c].c),vols:v.map(c=>n[c].v)}}async function ie(a){var s,i,u,l,m,n,v;const p=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`;for(const c of ne)try{const d=await fetch(c(p),{signal:AbortSignal.timeout(8e3)});if(!d.ok)continue;const r=await d.text();let e;try{e=JSON.parse(r)}catch{continue}const t=(i=(s=e==null?void 0:e.chart)==null?void 0:s.result)==null?void 0:i[0];if(!t)continue;const f=(l=(u=t.indicators)==null?void 0:u.quote)==null?void 0:l[0];if(!f)continue;const w=((v=(n=(m=t.indicators)==null?void 0:m.adjclose)==null?void 0:n[0])==null?void 0:v.adjclose)||f.close,o=w.map((h,g)=>f.close[g]&&h?h/f.close[g]:1);return{timestamps:t.timestamp,opens:f.open.map((h,g)=>h*o[g]),highs:f.high.map((h,g)=>h*o[g]),lows:f.low.map((h,g)=>h*o[g]),closes:w,vols:f.volume}}catch{}throw new Error("Sin datos disponibles")}function le(a,p){const{timestamps:s,opens:i,highs:u,lows:l,closes:m,vols:n}=a,v=m.length,c=te(p),d=ae(s,i,u,l,m,n,"W"),r=ae(s,i,u,l,m,n,"M"),e=H(m),t=Y(m),f=$(m,5),w=$(m,10),o=v-1,h=H(d.closes),g=V(d.highs,d.lows,d.closes,89),I=Y(d.closes),S=$(d.closes,10),q=$(d.closes,20),y=d.closes.length-1,U=H(r.closes),j=V(r.highs,r.lows,r.closes,89),X=V(r.highs,r.lows,r.closes,8),J=Y(r.closes),K=$(r.closes,10),A=r.closes.length-1,k=z=>z!=null&&!isNaN(z)?z.toFixed(2):"—",x={ok:U.m[A]>0&&U.m[A]>U.sl[A],label:"MACD>0↑",val:k(U.m[A])},D={ok:j.k[A]>80&&j.k[A]>j.d[A]||j.k[A]>92,opt:j.k[A]>92,label:"Stoch89>80",val:k(j.k[A])},M={ok:J[A]>65,label:"RSI>65",val:k(J[A])},_={ok:X.k[A]>78,label:"Stoch8>78",val:k(X.k[A])},L={ok:K[A]!=null&&r.closes[A]>K[A],label:"P>EMA10",val:k(r.closes[A])},C=x.ok&&D.ok&&M.ok&&_.ok&&L.ok,R={ok:h.m[y]>0&&h.m[y]>h.sl[y],label:"MACD>0↑",val:k(h.m[y])},P={ok:g.k[y]>85&&g.k[y]>g.d[y]||g.k[y]>92,opt:g.k[y]>92,label:"Stoch89>85",val:k(g.k[y])},N={ok:I[y]>67,label:"RSI>67",val:k(I[y])},O={ok:q[y]!=null&&d.closes[y]>q[y],label:"P>EMA20",val:k(d.closes[y])},B=R.ok&&P.ok&&N.ok&&O.ok,Q=e.m[o]>0,F=o>0&&e.m[o]>e.sl[o]&&e.m[o-1]<=e.sl[o-1],Z=t[o]>57,ee=Q&&F&&Z;let b=0;x.ok&&b++,D.ok&&b++,M.ok&&b++,_.ok&&b++,L.ok&&b++,R.ok&&b++,P.ok&&b++,N.ok&&b++,O.ok&&b++,C&&B&&b++;let G="watching";return C&&B&&ee?G="ready":C&&B?G="diario":b>=7&&(G="close"),{name:c.name,emoji:c.emoji,cat:c.cat,price:m[o],score:b,estado:G,mensualOk:C,semanalOk:B,dailyReady:ee,mc:[x,D,M,_,L],sc:[R,P,N,O],dc:{pos:{ok:Q,label:"MACD>0",val:k(e.m[o])},cross:{ok:F,label:"MACD↑ cruza",val:F?"SÍ":"NO"},rsi:{ok:Z,label:"RSI>57",val:k(t[o])}},stopSemanal:S[y],ema5d:f[o],ema10d:w[o]}}function ce(a){return a>=9?"var(--green)":a>=7?"#6ee7b7":a>=5?"var(--amber)":"var(--text3)"}function de(a){return{ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"}[a]||"—"}function re(a){return{ready:"wl-chip-ready",diario:"wl-chip-diario",close:"wl-chip-close",watching:"wl-chip-watching"}[a]||""}function oe(a){return`<span class="wl-cond ${a.ok?"ok":""} ${a.opt?"opt":""}">${a.label}</span>`}function W(a){return`<div class="wl-detail-row"><span class="wl-cond-dot ${a.ok?"ok":""}"></span><span class="wl-detail-label">${a.label}</span><span class="wl-detail-val">${a.val}</span></div>`}async function pe(a,{actionsSlot:p}){var d,r;let s=[];try{s=await E.get(T)||[]}catch{s=[]}const i={},u={};p.innerHTML=`
    <div class="wl-add-bar">
      <input type="text" id="wl-rf-input" placeholder="ETF: TLT, IEF, HYG, BNDX..." autocomplete="off" class="wl-input">
      <button class="btn btn-primary" id="wl-rf-add-btn">+ Añadir</button>
      <span class="last-update" id="wl-rf-last-update"></span>
    </div>
  `,a.innerHTML='<div id="wl-rf-list"></div>';function l(e){const t=i[e],f=!!u[e],w=te(e);if(!t||t.status==="loading")return`
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
      </div>`;const o=t.result,h=ce(o.score),g=o.stopSemanal?((o.price-o.stopSemanal)/o.price*100).toFixed(1):null,I=S=>S!=null&&!isNaN(S)?"$"+S.toFixed(2):"—";return`
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
            ${g!=null?`<div class="wl-stop">Stop: ${I(o.stopSemanal)} (${g}%)</div>`:""}
          </div>
          <div class="wl-score-wrap">
            <div class="wl-score-num" style="color:${h}">${o.score}</div>
            <div>
              <div class="wl-score-track"><div class="wl-score-fill" style="width:${o.score*10}%;background:${h}"></div></div>
              <div class="wl-score-max">/10</div>
            </div>
          </div>
          <div class="wl-conds">${o.mc.map(S=>oe(S)).join("")}</div>
          <div class="wl-conds">${o.sc.map(S=>oe(S)).join("")}</div>
          <div><span class="wl-state-chip ${re(o.estado)}">${de(o.estado)}</span></div>
          <div><button class="wl-del-btn" data-ticker="${e}">✕</button></div>
        </div>
        <div class="wl-detail ${f?"open":""}" id="wldetail-rf-${e}">
          <div class="wl-detail-grid">
            <div class="wl-detail-block">
              <div class="wl-detail-title mensual">◆ MENSUAL ${o.mensualOk?"✓":""}</div>
              ${o.mc.map(S=>W(S)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title semanal">◆ SEMANAL ${o.semanalOk?"✓":""}</div>
              ${o.sc.map(S=>W(S)).join("")}
            </div>
            <div class="wl-detail-block">
              <div class="wl-detail-title diario">◆ DIARIO — Timing</div>
              ${Object.values(o.dc).map(S=>W(S)).join("")}
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
        </div>`;return}const t=[...s].sort((w,o)=>{var h,g,I,S;return(((g=(h=i[o])==null?void 0:h.result)==null?void 0:g.score)??-1)-(((S=(I=i[w])==null?void 0:I.result)==null?void 0:S.score)??-1)});e.innerHTML=t.map(w=>l(w)).join("");const f=document.getElementById("wl-rf-last-update");f&&(f.textContent="Actualizado: "+new Date().toLocaleTimeString("es-ES")),n()}function n(){document.querySelectorAll(".wl-expandable").forEach(e=>{e.addEventListener("click",t=>{if(t.target.classList.contains("wl-del-btn"))return;const f=e.dataset.ticker;u[f]=!u[f];const w=document.getElementById(`wldetail-rf-${f}`);w&&w.classList.toggle("open",u[f])})}),document.querySelectorAll(".wl-del-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const f=e.dataset.ticker;s=s.filter(w=>w!==f),E.set(T,s),delete i[f],m()})})}async function v(e){i[e]={status:"loading"},m();try{const t=await ie(e);i[e]={status:"ok",result:le(t,e)}}catch(t){i[e]={status:"error",error:t.message.slice(0,50)}}m()}async function c(e){const t=e.trim().toUpperCase();t&&(s.includes(t)||(s.push(t),await E.set(T,s),v(t)))}(d=document.getElementById("wl-rf-add-btn"))==null||d.addEventListener("click",()=>{const e=document.getElementById("wl-rf-input");e!=null&&e.value.trim()&&(c(e.value),e.value="")}),(r=document.getElementById("wl-rf-input"))==null||r.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const t=document.getElementById("wl-rf-input");if(!(t!=null&&t.value.trim()))return;c(t.value),t.value=""}}),m();for(const e of s)v(e);return{destroy(){}}}async function ue(a){try{const p=await E.get(T)||[];p.includes(a)||(p.push(a),await E.set(T,p))}catch{}}export{ue as addToWatchlist,pe as render};
