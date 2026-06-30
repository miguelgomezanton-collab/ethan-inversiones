import{U as O}from"./userdata-C8tf_HXI.js";import"./index-DkkJmNlz.js";const D=[{ticker:"TLT",name:"Bonos Tesoro USA 20+ años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEF",name:"Bonos Tesoro USA 7-10 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SHY",name:"Bonos Tesoro USA 1-3 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEI",name:"Bonos Tesoro USA 3-7 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"GOVT",name:"Bonos Gobierno USA (todos)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"TIP",name:"Bonos TIPS (inflación USA)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SCHP",name:"TIPS Schwab",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGIT",name:"Bonos Gobierno USA 5-10a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGLT",name:"Bonos Gobierno USA 25+a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SPTL",name:"Bonos Largo Plazo SPDR",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"LQD",name:"Bonos Corp. Investment Grade",cat:"corp-usa",emoji:"🏢"},{ticker:"VCIT",name:"Bonos Corp. Medio Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"VCLT",name:"Bonos Corp. Largo Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"USIG",name:"Bonos Corp. IG USA",cat:"corp-usa",emoji:"🏢"},{ticker:"IGSB",name:"Bonos Corp. Corto Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"IGIB",name:"Bonos Corp. Medio Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"HYG",name:"High Yield Corporativo iShares",cat:"high-yield",emoji:"⚡"},{ticker:"JNK",name:"High Yield SPDR",cat:"high-yield",emoji:"⚡"},{ticker:"USHY",name:"High Yield USA iShares",cat:"high-yield",emoji:"⚡"},{ticker:"HYLD",name:"High Yield Activo",cat:"high-yield",emoji:"⚡"},{ticker:"ANGL",name:"Fallen Angels USD Bond",cat:"high-yield",emoji:"⚡"},{ticker:"BNDX",name:"Bonos Internacionales Vanguard",cat:"intl",emoji:"🌍"},{ticker:"BWX",name:"Bonos Gobierno Internac.",cat:"intl",emoji:"🌍"},{ticker:"EMB",name:"Bonos Emergentes USD iShares",cat:"intl",emoji:"🌍"},{ticker:"PCY",name:"Bonos Emergentes USD Invesco",cat:"intl",emoji:"🌍"},{ticker:"VWOB",name:"Bonos Emergentes Vanguard",cat:"intl",emoji:"🌍"},{ticker:"IGOV",name:"Bonos Gobierno DM iShares",cat:"intl",emoji:"🌍"},{ticker:"IAGG",name:"Bonos Agregado Intl. iShares",cat:"intl",emoji:"🌍"},{ticker:"BND",name:"Agregado USA Vanguard",cat:"broad",emoji:"📊"},{ticker:"AGG",name:"Agregado USA iShares",cat:"broad",emoji:"📊"},{ticker:"FBND",name:"Agregado USA Fidelity",cat:"broad",emoji:"📊"},{ticker:"SCHZ",name:"Agregado USA Schwab",cat:"broad",emoji:"📊"},{ticker:"SPAB",name:"Agregado USA SPDR",cat:"broad",emoji:"📊"},{ticker:"SHV",name:"Letras Tesoro USA <1 año",cat:"short",emoji:"💵"},{ticker:"BIL",name:"T-Bills 1-3 meses",cat:"short",emoji:"💵"},{ticker:"SGOV",name:"T-Bills 0-3 meses iShares",cat:"short",emoji:"💵"},{ticker:"CLTL",name:"Tesoro Corto Plazo Invesco",cat:"short",emoji:"💵"},{ticker:"MINT",name:"Money Market PIMCO",cat:"short",emoji:"💵"}],z=[{key:"all",label:"Todos",emoji:"📋"},{key:"gov-usa",label:"Gobierno USA",emoji:"🇺🇸"},{key:"corp-usa",label:"Corporativo USA",emoji:"🏢"},{key:"high-yield",label:"High Yield",emoji:"⚡"},{key:"intl",label:"Internacional",emoji:"🌍"},{key:"broad",label:"Agregados",emoji:"📊"},{key:"short",label:"Corto Plazo",emoji:"💵"}],F=11,_=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`,o=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(o)}`];async function J(o){var r,a,f,i,u,s,d;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=10y&events=history`;for(const p of _)try{const g=await fetch(p(c),{signal:AbortSignal.timeout(8e3)});if(!g.ok)continue;const y=await g.text();let m;try{m=JSON.parse(y)}catch{continue}const h=(a=(r=m==null?void 0:m.chart)==null?void 0:r.result)==null?void 0:a[0];if(!h)continue;const e=(i=(f=h.indicators)==null?void 0:f.quote)==null?void 0:i[0];if(!e)continue;const n=((d=(s=(u=h.indicators)==null?void 0:u.adjclose)==null?void 0:s[0])==null?void 0:d.adjclose)||e.close,l=n.map((v,b)=>e.close[b]&&v?v/e.close[b]:1);return{timestamps:h.timestamp,opens:e.open.map((v,b)=>v*l[b]),highs:e.high.map((v,b)=>v*l[b]),lows:e.low.map((v,b)=>v*l[b]),closes:n,vols:e.volume}}catch{}throw new Error("Sin datos")}function B(o,c){const r=2/(c+1),a=new Array(o.length).fill(null);let f=o.findIndex(i=>i!=null&&!isNaN(i));if(f<0)return a;a[f]=o[f];for(let i=f+1;i<o.length;i++){const u=o[i]!=null&&!isNaN(o[i])?o[i]:a[i-1];a[i]=u*r+a[i-1]*(1-r)}return a}function M(o){const c=B(o,12),r=B(o,26),a=c.map((f,i)=>f!=null&&r[i]!=null?f-r[i]:null);return{m:a,sl:B(a.map(f=>f??0),9)}}function G(o,c=14){const r=new Array(o.length).fill(null);if(o.length<c+1)return r;let a=0,f=0;for(let s=1;s<=c;s++){const d=o[s]-o[s-1];d>0?a+=d:f-=d}let i=a/c,u=f/c;r[c]=u===0?100:100-100/(1+i/u);for(let s=c+1;s<o.length;s++){const d=o[s]-o[s-1];i=(i*(c-1)+(d>0?d:0))/c,u=(u*(c-1)+(d<0?-d:0))/c,r[s]=u===0?100:100-100/(1+i/u)}return r}function R(o,c,r,a){const f=r.map((u,s)=>{if(s<a-1)return null;const d=Math.max(...o.slice(s-a+1,s+1)),p=Math.min(...c.slice(s-a+1,s+1));return d===p?50:(u-p)/(d-p)*100}),i=B(f,3);return{k:i,d:B(i.map(u=>u??0),3)}}function N(o,c,r,a,f,i,u){const s={};o.forEach((p,g)=>{const y=new Date(p*1e3);let m;if(u==="W"){const h=y.getDay(),e=y.getDate()-h+(h===0?-6:1),n=new Date(+y);n.setDate(e),m=n.toISOString().slice(0,10)}else m=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}`;s[m]?(s[m].h=Math.max(s[m].h,r[g]),s[m].l=Math.min(s[m].l,a[g]),s[m].c=f[g],s[m].v+=i[g]):s[m]={o:c[g],h:r[g],l:a[g],c:f[g],v:i[g]}});const d=Object.keys(s).sort();return{dates:d,opens:d.map(p=>s[p].o),highs:d.map(p=>s[p].h),lows:d.map(p=>s[p].l),closes:d.map(p=>s[p].c),vols:d.map(p=>s[p].v)}}function X(o){const{timestamps:c,opens:r,highs:a,lows:f,closes:i,vols:u}=o,s=i.length,d=u[s-1]||0,p=u.slice(-F).reduce((S,W)=>S+(W||0),0)/F,g=N(c,r,a,f,i,u,"W"),y=N(c,r,a,f,i,u,"M"),m=y.closes.length-1,h=g.closes.length-1,e=s-1,n=M(y.closes),l=R(y.highs,y.lows,y.closes,89),v=R(y.highs,y.lows,y.closes,8),b=G(y.closes),x=B(y.closes,10),w=M(g.closes),k=R(g.highs,g.lows,g.closes,89),A=G(g.closes),T=B(g.closes,20),t=M(i),E=G(i),C=[n.m[m]>0&&n.m[m]>n.sl[m],l.k[m]>80&&l.k[m]>l.d[m]||l.k[m]>92,b[m]>65,v.k[m]>78,x[m]&&y.closes[m]>x[m]],j=[w.m[h]>0&&w.m[h]>w.sl[h],k.k[h]>85&&k.k[h]>k.d[h]||k.k[h]>92,A[h]>67,T[h]&&g.closes[h]>T[h]],$=C.every(S=>S),I=j.every(S=>S),P=t.m[e]>t.sl[e]&&t.m[e-1]<=t.sl[e-1]&&E[e]>57&&t.m[e]>0,H=C.filter(S=>S).length+j.filter(S=>S).length+(P?1:0);let U="watching";return $&&I&&P?U="ready":$&&I?U="diario":H>=7&&(U="close"),{score:H,estado:U,price:i[e],lastVol:d,avgVol11:p}}async function K(o){try{const c=await O.get("ethan_watchlist_rf_v1")||[];c.includes(o)||(c.push(o),await O.set("ethan_watchlist_rf_v1",c));const r=document.querySelector(`[data-wl="${o}"]`);r&&(r.textContent="✓",r.style.color="var(--green)",r.disabled=!0)}catch{}}const q="ethan_rf_custom_etfs";async function L(){try{return await O.get(q)||[]}catch{return[]}}async function V(o){await O.set(q,o)}async function Y(){const o=await L(),c=new Set(D.map(a=>a.ticker)),r=o.filter(a=>!c.has(typeof a=="string"?a:a.ticker)).map(a=>typeof a=="string"?{ticker:a,name:a,cat:"custom",emoji:"➕"}:{ticker:a.ticker,name:a.name||a.ticker,cat:a.category||"custom",emoji:"➕"});return[...D,...r]}async function Z(o){var r,a,f;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=5d`;for(const i of _)try{const u=await fetch(i(c),{signal:AbortSignal.timeout(8e3)});if(!u.ok)continue;const s=await u.text();let d;try{d=JSON.parse(s)}catch{continue}const p=(f=(a=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:a[0])==null?void 0:f.meta;if(!p)continue;return{ticker:o.toUpperCase(),name:p.shortName||p.longName||o,price:p.regularMarketPrice||null,currency:p.currency||"USD",exchange:p.exchangeName||"",category:"",description:"",expenseRatio:"",etfYield:""}}catch{}throw new Error("ETF no encontrado")}async function te(o,{actionsSlot:c}){var y,m,h;let r=[],a=!1,f="all",i=await L();c.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;">
      <input type="text" id="rf-custom-input" placeholder="Ticker: TLT, HYG, EMLC..." class="wl-input" style="width:200px;text-transform:uppercase;" autocomplete="off">
      <button class="btn btn-primary" id="rf-custom-add-btn" style="font-size:11px;">🔍 Buscar ETF</button>
      <span style="width:1px;height:16px;background:var(--border);display:inline-block;"></span>
      <span class="cm-status" id="rf-status"></span>
      <button class="cm-scan-btn" id="rf-scan-btn">▶ Escanear</button>
    </div>
  `;async function u(){const e=document.getElementById("rf-custom-chips");if(!e)return;const n=await L();if(n.length===0){e.innerHTML="";return}e.innerHTML=`
      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 4px;">
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono);align-self:center;margin-right:4px;">AÑADIDOS AL UNIVERSO:</span>
        ${n.map(l=>`
          <span class="rf-custom-chip">
            ➕ ${l}
            <button class="rf-custom-remove" data-ticker="${l}">✕</button>
          </span>
        `).join("")}
      </div>
    `,e.querySelectorAll(".rf-custom-remove").forEach(l=>{l.addEventListener("click",async()=>{const v=l.dataset.ticker,b=(await L()).filter(x=>x!==v);await V(b),i=b,await u(),await s()})})}async function s(){const e=(await Y()).length,n=document.getElementById("rf-universe-count");n&&(n.textContent=`${e} ETFs en universo`)}o.innerHTML=`
    <div class="cm-wrap">
      <div id="rf-preview"></div>
      <div id="rf-custom-chips"></div>
      <div class="cm-tabs">
        ${z.map((e,n)=>`
          <button class="cm-tab ${n===0?"active":""}" data-cat="${e.key}">
            ${e.emoji} ${e.label}
            <span class="cm-tab-badge" id="rf-badge-${e.key}"></span>
          </button>
        `).join("")}
        <span id="rf-universe-count" style="margin-left:auto;font-size:9px;color:var(--text3);font-family:var(--mono);align-self:center;padding-right:4px;"></span>
      </div>

      <div class="sc2-toolbar" style="margin-top:14px;">
        <div class="sc2-filters">
          <div class="sc2-filter"><label>SCORE MÍN.</label>
            <select id="rf-filter-score" class="sc2-sel">
              <option value="9">≥ 9</option>
              <option value="8">≥ 8</option>
              <option value="7" selected>≥ 7</option>
              <option value="6">≥ 6</option>
              <option value="5">≥ 5</option>
              <option value="0">Todos</option>
            </select>
          </div>
          <div class="sc2-filter"><label>ESTADO</label>
            <select id="rf-filter-estado" class="sc2-sel">
              <option value="all">Todos</option>
              <option value="ready">🟢 Ready</option>
              <option value="diario">🟡 Espera diario</option>
              <option value="close">🔵 Cerca</option>
            </select>
          </div>
        </div>
      </div>

      <div class="sc2-progress" id="rf-progress" style="display:none">
        <div class="sc2-progress-fill" id="rf-progress-fill"></div>
      </div>

      <div id="rf-results">
        <div class="sc2-empty" id="rf-empty-msg">Pulsa Escanear para analizar los ETFs de Renta Fija</div>
      </div>
    </div>
  `,await u(),await s();function d(){var A,T;const e=parseInt(((A=document.getElementById("rf-filter-score"))==null?void 0:A.value)||"7"),n=((T=document.getElementById("rf-filter-estado"))==null?void 0:T.value)||"all",l=r.filter(t=>!(t.score<e||f!=="all"&&t.cat!==f||n!=="all"&&t.estado!==n)).sort((t,E)=>E.score-t.score);z.forEach(t=>{const E=document.getElementById(`rf-badge-${t.key}`);if(!E)return;const C=r.filter(I=>t.key==="all"||I.cat===t.key),j=C.filter(I=>I.estado==="ready").length,$=C.filter(I=>I.score>=7).length;$>0?(E.textContent=j>0?j:$,E.style.background=j>0?"var(--green)":"var(--text3)",E.style.display="inline"):E.style.display="none"});const v=document.getElementById("rf-results");if(!v)return;if(l.length===0){v.innerHTML=`<div class="sc2-empty">${r.length>0?"Ningún ETF cumple los filtros actuales":"Pulsa Escanear para analizar el universo de Renta Fija"}</div>`;return}const b=t=>t>=9?"var(--green)":t>=7?"var(--amber)":"var(--text3)",x={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},w=t=>t==="ready"?"var(--green)":t==="diario"?"var(--amber)":"var(--text3)",k={"gov-usa":"GOB. USA","corp-usa":"CORP. USA","high-yield":"HIGH YIELD",intl:"INTL.",broad:"AGREGADO",short:"CORTO PLAZO"};v.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${l.length} ETFs · <strong style="color:var(--green)">${l.filter(t=>t.estado==="ready").length} listos</strong>
        · ${l.filter(t=>t.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${l.map(t=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="font-size:18px;line-height:1;">${t.emoji}</div>
                  <div>
                    <div class="sc2-ticker">${t.ticker}</div>
                    <div class="cm-name">${t.name}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:9.5px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${k[t.cat]||t.cat}</td>
              <td class="sc2-score" style="color:${b(t.score)}">${t.score}/10</td>
              <td style="color:${w(t.estado)};font-size:10px;font-weight:600">${x[t.estado]||"—"}</td>
              <td class="sc2-price">${t.price?"$"+t.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${t.avgVol11>=1e6?(t.avgVol11/1e6).toFixed(1)+"M":Math.round(t.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${t.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,v.querySelectorAll(".sc2-wl-btn").forEach(t=>{t.addEventListener("click",E=>{E.stopPropagation(),K(t.dataset.wl)})})}async function p(){if(a)return;a=!0,r=[];const e=await Y(),n=document.getElementById("rf-scan-btn"),l=document.getElementById("rf-status"),v=document.getElementById("rf-progress"),b=document.getElementById("rf-progress-fill");n&&(n.disabled=!0,n.textContent="⏳ Escaneando..."),v&&(v.style.display="block"),b&&(b.style.width="0%");const x=6;let w=0;for(let k=0;k<e.length;k+=x){const A=e.slice(k,k+x);(await Promise.all(A.map(async t=>{try{const E=await J(t.ticker);return{...t,...X(E)}}catch{return null}}))).forEach(t=>{t&&r.push(t)}),w+=A.length,b&&(b.style.width=(w/e.length*100).toFixed(0)+"%"),l&&(l.textContent=`${e[Math.min(k+x-1,e.length-1)].ticker} (${w}/${e.length})`),d(),await new Promise(t=>setTimeout(t,300))}a=!1,n&&(n.disabled=!1,n.textContent="↻ Re-escanear"),v&&(v.style.display="none"),l&&(l.textContent=`${r.length} ETFs · ${r.filter(k=>k.estado==="ready").length} listos`),d()}async function g(e){const n=document.getElementById("rf-preview");if(n){n.innerHTML=`
      <div class="etf-preview-card" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;color:var(--text3);font-family:var(--mono);font-size:11px;">
          <div class="loader-ring"></div>Buscando ${e}...
        </div>
      </div>`;try{const l=await Z(e);n.innerHTML=`
        <div class="etf-preview-card" style="margin-bottom:14px;">
          <div class="etf-preview-header">
            <div>
              <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--teal);">${l.ticker}</div>
              <div style="font-family:var(--serif);font-size:15px;font-style:italic;color:var(--text1);margin-top:4px;">${l.name}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${l.exchange} · ${l.currency}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--mono);font-size:20px;color:var(--text1);">${l.price?"$"+l.price.toFixed(2):"—"}</div>
            </div>
          </div>
          <div class="etf-preview-fields">
            <div class="etf-pf">
              <label>Categoría</label>
              <input type="text" id="rf-pf-cat" placeholder="ej. High Yield, Emergentes..." value="${l.category}">
            </div>
            <div class="etf-pf">
              <label>TER (ratio de gastos)</label>
              <input type="text" id="rf-pf-ter" placeholder="ej. 0.15%" value="${l.expenseRatio}">
            </div>
            <div class="etf-pf">
              <label>Yield / Cupón</label>
              <input type="text" id="rf-pf-yield" placeholder="ej. 4.5%" value="${l.etfYield}">
            </div>
            <div class="etf-pf" style="grid-column:1/-1">
              <label>Descripción / Notas</label>
              <textarea id="rf-pf-desc" placeholder="ej. ETF de bonos emergentes en divisa local, exposición a LatAm y Asia...">${l.description||""}</textarea>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
            <button class="btn" id="rf-preview-cancel">Cancelar</button>
            <button class="btn btn-primary" id="rf-preview-add">+ Añadir al universo</button>
          </div>
        </div>`,document.getElementById("rf-preview-cancel").addEventListener("click",()=>{n.innerHTML="",document.getElementById("rf-custom-input").value=""}),document.getElementById("rf-preview-add").addEventListener("click",async()=>{const v={...l,category:document.getElementById("rf-pf-cat").value,expenseRatio:document.getElementById("rf-pf-ter").value,etfYield:document.getElementById("rf-pf-yield").value,description:document.getElementById("rf-pf-desc").value},b=new Set(D.map(k=>k.ticker)),x=await L(),w=x.some(k=>(typeof k=="string"?k:k.ticker)===v.ticker);!b.has(v.ticker)&&!w&&(x.push(v),await V(x),i=x),n.innerHTML="",document.getElementById("rf-custom-input").value="",await u(),await s()})}catch(l){n.innerHTML=`<div class="etf-preview-card" style="margin-bottom:14px;color:var(--red);font-family:var(--mono);font-size:11px;">✗ ${l.message} — comprueba el ticker</div>`}}}return(y=document.getElementById("rf-custom-add-btn"))==null||y.addEventListener("click",()=>{const e=document.getElementById("rf-custom-input"),n=e==null?void 0:e.value.trim().toUpperCase();n&&g(n)}),(m=document.getElementById("rf-custom-input"))==null||m.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const n=e.target.value.trim().toUpperCase();n&&g(n)}e.target.value=e.target.value.toUpperCase()}),o.querySelectorAll(".cm-tab").forEach(e=>{e.addEventListener("click",()=>{f=e.dataset.cat,o.querySelectorAll(".cm-tab").forEach(n=>n.classList.remove("active")),e.classList.add("active"),d()})}),["rf-filter-score","rf-filter-estado"].forEach(e=>{var n;(n=document.getElementById(e))==null||n.addEventListener("change",d)}),(h=document.getElementById("rf-scan-btn"))==null||h.addEventListener("click",p),{destroy(){}}}export{te as render};
