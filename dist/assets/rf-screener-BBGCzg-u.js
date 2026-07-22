import{U as G}from"./userdata-99Myk5WH.js";import"./index-B8gSlGv_.js";const H=[{ticker:"TLT",name:"Bonos Tesoro USA 20+ años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEF",name:"Bonos Tesoro USA 7-10 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SHY",name:"Bonos Tesoro USA 1-3 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEI",name:"Bonos Tesoro USA 3-7 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"GOVT",name:"Bonos Gobierno USA (todos)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"TIP",name:"Bonos TIPS (inflación USA)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SCHP",name:"TIPS Schwab",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGIT",name:"Bonos Gobierno USA 5-10a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGLT",name:"Bonos Gobierno USA 25+a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SPTL",name:"Bonos Largo Plazo SPDR",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"LQD",name:"Bonos Corp. Investment Grade",cat:"corp-usa",emoji:"🏢"},{ticker:"VCIT",name:"Bonos Corp. Medio Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"VCLT",name:"Bonos Corp. Largo Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"USIG",name:"Bonos Corp. IG USA",cat:"corp-usa",emoji:"🏢"},{ticker:"IGSB",name:"Bonos Corp. Corto Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"IGIB",name:"Bonos Corp. Medio Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"HYG",name:"High Yield Corporativo iShares",cat:"high-yield",emoji:"⚡"},{ticker:"JNK",name:"High Yield SPDR",cat:"high-yield",emoji:"⚡"},{ticker:"USHY",name:"High Yield USA iShares",cat:"high-yield",emoji:"⚡"},{ticker:"HYLD",name:"High Yield Activo",cat:"high-yield",emoji:"⚡"},{ticker:"ANGL",name:"Fallen Angels USD Bond",cat:"high-yield",emoji:"⚡"},{ticker:"BNDX",name:"Bonos Internacionales Vanguard",cat:"intl",emoji:"🌍"},{ticker:"BWX",name:"Bonos Gobierno Internac.",cat:"intl",emoji:"🌍"},{ticker:"EMB",name:"Bonos Emergentes USD iShares",cat:"intl",emoji:"🌍"},{ticker:"PCY",name:"Bonos Emergentes USD Invesco",cat:"intl",emoji:"🌍"},{ticker:"VWOB",name:"Bonos Emergentes Vanguard",cat:"intl",emoji:"🌍"},{ticker:"IGOV",name:"Bonos Gobierno DM iShares",cat:"intl",emoji:"🌍"},{ticker:"IAGG",name:"Bonos Agregado Intl. iShares",cat:"intl",emoji:"🌍"},{ticker:"BND",name:"Agregado USA Vanguard",cat:"broad",emoji:"📊"},{ticker:"AGG",name:"Agregado USA iShares",cat:"broad",emoji:"📊"},{ticker:"FBND",name:"Agregado USA Fidelity",cat:"broad",emoji:"📊"},{ticker:"SCHZ",name:"Agregado USA Schwab",cat:"broad",emoji:"📊"},{ticker:"SPAB",name:"Agregado USA SPDR",cat:"broad",emoji:"📊"},{ticker:"SHV",name:"Letras Tesoro USA <1 año",cat:"short",emoji:"💵"},{ticker:"BIL",name:"T-Bills 1-3 meses",cat:"short",emoji:"💵"},{ticker:"SGOV",name:"T-Bills 0-3 meses iShares",cat:"short",emoji:"💵"},{ticker:"CLTL",name:"Tesoro Corto Plazo Invesco",cat:"short",emoji:"💵"},{ticker:"MINT",name:"Money Market PIMCO",cat:"short",emoji:"💵"}],z=[{key:"all",label:"Todos",emoji:"📋"},{key:"gov-usa",label:"Gobierno USA",emoji:"🇺🇸"},{key:"corp-usa",label:"Corporativo USA",emoji:"🏢"},{key:"high-yield",label:"High Yield",emoji:"⚡"},{key:"intl",label:"Internacional",emoji:"🌍"},{key:"broad",label:"Agregados",emoji:"📊"},{key:"short",label:"Corto Plazo",emoji:"💵"}],F=11,_=[e=>`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,e=>`https://corsproxy.io/?${encodeURIComponent(e)}`,e=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(e)}`,e=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(e)}`];async function J(e){var l,t,u,i,p,s,m;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${e}?interval=1d&range=10y&events=history`;for(const d of _)try{const g=await fetch(d(c),{signal:AbortSignal.timeout(8e3)});if(!g.ok)continue;const v=await g.text();let f;try{f=JSON.parse(v)}catch{continue}const y=(t=(l=f==null?void 0:f.chart)==null?void 0:l.result)==null?void 0:t[0];if(!y)continue;const h=(i=(u=y.indicators)==null?void 0:u.quote)==null?void 0:i[0];if(!h)continue;const I=((m=(s=(p=y.indicators)==null?void 0:p.adjclose)==null?void 0:s[0])==null?void 0:m.adjclose)||h.close,a=I.map((n,r)=>h.close[r]&&n?n/h.close[r]:1);return{timestamps:y.timestamp,opens:h.open.map((n,r)=>n*a[r]),highs:h.high.map((n,r)=>n*a[r]),lows:h.low.map((n,r)=>n*a[r]),closes:I,vols:h.volume}}catch{}throw new Error("Sin datos")}function j(e,c){const l=2/(c+1),t=new Array(e.length).fill(null);let u=e.findIndex(i=>i!=null&&!isNaN(i));if(u<0)return t;t[u]=e[u];for(let i=u+1;i<e.length;i++){const p=e[i]!=null&&!isNaN(e[i])?e[i]:t[i-1];t[i]=p*l+t[i-1]*(1-l)}return t}function R(e){const c=j(e,12),l=j(e,26),t=c.map((u,i)=>u!=null&&l[i]!=null?u-l[i]:null);return{m:t,sl:j(t.map(u=>u??0),9)}}function D(e,c=14){const l=new Array(e.length).fill(null);if(e.length<c+1)return l;let t=0,u=0;for(let s=1;s<=c;s++){const m=e[s]-e[s-1];m>0?t+=m:u-=m}let i=t/c,p=u/c;l[c]=p===0?100:100-100/(1+i/p);for(let s=c+1;s<e.length;s++){const m=e[s]-e[s-1];i=(i*(c-1)+(m>0?m:0))/c,p=(p*(c-1)+(m<0?-m:0))/c,l[s]=p===0?100:100-100/(1+i/p)}return l}function P(e,c,l,t){const u=l.map((p,s)=>{if(s<t-1)return null;const m=Math.max(...e.slice(s-t+1,s+1)),d=Math.min(...c.slice(s-t+1,s+1));return m===d?50:(p-d)/(m-d)*100}),i=j(u,3);return{k:i,d:j(i.map(p=>p??0),3)}}function N(e,c,l,t,u,i,p){const s={};e.forEach((d,g)=>{const v=new Date(d*1e3);let f;if(p==="W"){const y=v.getDay(),h=v.getDate()-y+(y===0?-6:1),I=new Date(+v);I.setDate(h),f=I.toISOString().slice(0,10)}else f=`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}`;s[f]?(s[f].h=Math.max(s[f].h,l[g]),s[f].l=Math.min(s[f].l,t[g]),s[f].c=u[g],s[f].v+=i[g]):s[f]={o:c[g],h:l[g],l:t[g],c:u[g],v:i[g]}});const m=Object.keys(s).sort();return{dates:m,opens:m.map(d=>s[d].o),highs:m.map(d=>s[d].h),lows:m.map(d=>s[d].l),closes:m.map(d=>s[d].c),vols:m.map(d=>s[d].v)}}function X(e){const{timestamps:c,opens:l,highs:t,lows:u,closes:i,vols:p}=e,s=i.length,m=p[s-1]||0,d=p.slice(-F).reduce((B,W)=>B+(W||0),0)/F,g=N(c,l,t,u,i,p,"W"),v=N(c,l,t,u,i,p,"M"),f=v.closes.length-1,y=g.closes.length-1,h=s-1,I=R(v.closes),a=P(v.highs,v.lows,v.closes,89),n=P(v.highs,v.lows,v.closes,8),r=D(v.closes),b=j(v.closes,10),E=R(g.closes),x=P(g.highs,g.lows,g.closes,89),A=D(g.closes),k=j(g.closes,20),S=R(i),$=D(i),o=[I.m[f]>0&&I.m[f]>I.sl[f],a.k[f]>80&&a.k[f]>a.d[f]||a.k[f]>92,r[f]>65,n.k[f]>78,b[f]&&v.closes[f]>b[f]],w=[E.m[y]>0&&E.m[y]>E.sl[y],x.k[y]>85&&x.k[y]>x.d[y]||x.k[y]>92,A[y]>67,k[y]&&g.closes[y]>k[y]],L=o.every(B=>B),C=w.every(B=>B),U=S.m[h]>S.sl[h]&&S.m[h-1]<=S.sl[h-1]&&$[h]>57&&S.m[h]>0,T=o.filter(B=>B).length+w.filter(B=>B).length+(U?1:0);let M="watching";return L&&C&&U?M="ready":L&&C?M="diario":T>=7&&(M="close"),{score:T,estado:M,price:i[h],lastVol:m,avgVol11:d}}async function K(e){try{const c=await G.get("ethan_watchlist_rf_v1")||[];c.includes(e)||(c.push(e),await G.set("ethan_watchlist_rf_v1",c));const l=document.querySelector(`[data-wl="${e}"]`);l&&(l.textContent="✓",l.style.color="var(--green)",l.disabled=!0)}catch{}}const q="ethan_rf_custom_etfs";async function O(){try{return await G.get(q)||[]}catch{return[]}}async function V(e){await G.set(q,e)}async function Y(){const e=await O(),c=new Set(H.map(t=>t.ticker)),l=e.filter(t=>!c.has(typeof t=="string"?t:t.ticker)).map(t=>typeof t=="string"?{ticker:t,name:t,cat:"custom",emoji:"➕"}:{ticker:t.ticker,name:t.name||t.ticker,cat:t.category||"custom",emoji:"➕"});return[...H,...l]}async function Z(e){var l,t,u;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${e}?interval=1d&range=5d`;for(const i of _)try{const p=await fetch(i(c),{signal:AbortSignal.timeout(8e3)});if(!p.ok)continue;const s=await p.text();let m;try{m=JSON.parse(s)}catch{continue}const d=(u=(t=(l=m==null?void 0:m.chart)==null?void 0:l.result)==null?void 0:t[0])==null?void 0:u.meta;if(!d)continue;return{ticker:e.toUpperCase(),name:d.shortName||d.longName||e,price:d.regularMarketPrice||null,currency:d.currency||"USD",exchange:d.exchangeName||"",category:"",description:"",expenseRatio:"",etfYield:""}}catch{}throw new Error("ETF no encontrado")}async function te(e,{actionsSlot:c,savedState:l}){var f,y,h,I;let t=(l==null?void 0:l.scanResults)||[],u=!1,i="all",p=await O();c.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;">
      <input type="text" id="rf-custom-input" placeholder="Ticker: TLT, HYG, EMLC..." class="wl-input" style="width:200px;text-transform:uppercase;" autocomplete="off">
      <button class="btn btn-primary" id="rf-custom-add-btn" style="font-size:11px;">🔍 Buscar ETF</button>
      <span style="width:1px;height:16px;background:var(--border);display:inline-block;"></span>
      <span class="cm-status" id="rf-status"></span>
      <button class="cm-scan-btn" id="rf-scan-btn">▶ Escanear</button>
    </div>
  `;async function s(){const a=document.getElementById("rf-custom-chips");if(!a)return;const n=await O();if(n.length===0){a.innerHTML="";return}a.innerHTML=`
      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 4px;">
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono);align-self:center;margin-right:4px;">AÑADIDOS AL UNIVERSO:</span>
        ${n.map(r=>`
          <span class="rf-custom-chip">
            ➕ ${r}
            <button class="rf-custom-remove" data-ticker="${r}">✕</button>
          </span>
        `).join("")}
      </div>
    `,a.querySelectorAll(".rf-custom-remove").forEach(r=>{r.addEventListener("click",async()=>{const b=r.dataset.ticker,E=(await O()).filter(x=>x!==b);await V(E),p=E,await s(),await m()})})}async function m(){const a=(await Y()).length,n=document.getElementById("rf-universe-count");n&&(n.textContent=`${a} ETFs en universo`)}e.innerHTML=`
    <div class="cm-wrap">
      <div id="rf-preview"></div>
      <div id="rf-custom-chips"></div>
      <div class="cm-tabs">
        ${z.map((a,n)=>`
          <button class="cm-tab ${n===0?"active":""}" data-cat="${a.key}">
            ${a.emoji} ${a.label}
            <span class="cm-tab-badge" id="rf-badge-${a.key}"></span>
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
  `,await s(),await m();function d(){var S,$;const a=parseInt(((S=document.getElementById("rf-filter-score"))==null?void 0:S.value)||"7"),n=(($=document.getElementById("rf-filter-estado"))==null?void 0:$.value)||"all",r=t.filter(o=>!(o.score<a||i!=="all"&&o.cat!==i||n!=="all"&&o.estado!==n)).sort((o,w)=>w.score-o.score);z.forEach(o=>{const w=document.getElementById(`rf-badge-${o.key}`);if(!w)return;const L=t.filter(T=>o.key==="all"||T.cat===o.key),C=L.filter(T=>T.estado==="ready").length,U=L.filter(T=>T.score>=7).length;U>0?(w.textContent=C>0?C:U,w.style.background=C>0?"var(--green)":"var(--text3)",w.style.display="inline"):w.style.display="none"});const b=document.getElementById("rf-results");if(!b)return;if(r.length===0){b.innerHTML=`<div class="sc2-empty">${t.length>0?"Ningún ETF cumple los filtros actuales":"Pulsa Escanear para analizar el universo de Renta Fija"}</div>`;return}const E=o=>o>=9?"var(--green)":o>=7?"var(--amber)":"var(--text3)",x={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},A=o=>o==="ready"?"var(--green)":o==="diario"?"var(--amber)":"var(--text3)",k={"gov-usa":"GOB. USA","corp-usa":"CORP. USA","high-yield":"HIGH YIELD",intl:"INTL.",broad:"AGREGADO",short:"CORTO PLAZO"};b.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${r.length} ETFs · <strong style="color:var(--green)">${r.filter(o=>o.estado==="ready").length} listos</strong>
        · ${r.filter(o=>o.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${r.map(o=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="font-size:18px;line-height:1;">${o.emoji}</div>
                  <div>
                    <div class="sc2-ticker">${o.ticker}</div>
                    <div class="cm-name">${o.name}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:9.5px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${k[o.cat]||o.cat}</td>
              <td class="sc2-score" style="color:${E(o.score)}">${o.score}/10</td>
              <td style="color:${A(o.estado)};font-size:10px;font-weight:600">${x[o.estado]||"—"}</td>
              <td class="sc2-price">${o.price?"$"+o.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${o.avgVol11>=1e6?(o.avgVol11/1e6).toFixed(1)+"M":Math.round(o.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${o.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,b.querySelectorAll(".sc2-wl-btn").forEach(o=>{o.addEventListener("click",w=>{w.stopPropagation(),K(o.dataset.wl)})})}async function g(){if(u)return;u=!0,t=[];const a=await Y(),n=document.getElementById("rf-scan-btn"),r=document.getElementById("rf-status"),b=document.getElementById("rf-progress"),E=document.getElementById("rf-progress-fill");n&&(n.disabled=!0,n.textContent="⏳ Escaneando..."),b&&(b.style.display="block"),E&&(E.style.width="0%");const x=6;let A=0;for(let k=0;k<a.length;k+=x){const S=a.slice(k,k+x);(await Promise.all(S.map(async o=>{try{const w=await J(o.ticker);return{...o,...X(w)}}catch{return null}}))).forEach(o=>{o&&t.push(o)}),A+=S.length,E&&(E.style.width=(A/a.length*100).toFixed(0)+"%"),r&&(r.textContent=`${a[Math.min(k+x-1,a.length-1)].ticker} (${A}/${a.length})`),d(),await new Promise(o=>setTimeout(o,300))}u=!1,n&&(n.disabled=!1,n.textContent="↻ Re-escanear"),b&&(b.style.display="none"),r&&(r.textContent=`${t.length} ETFs · ${t.filter(k=>k.estado==="ready").length} listos`),d()}async function v(a){const n=document.getElementById("rf-preview");if(n){n.innerHTML=`
      <div class="etf-preview-card" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;color:var(--text3);font-family:var(--mono);font-size:11px;">
          <div class="loader-ring"></div>Buscando ${a}...
        </div>
      </div>`;try{const r=await Z(a);n.innerHTML=`
        <div class="etf-preview-card" style="margin-bottom:14px;">
          <div class="etf-preview-header">
            <div>
              <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--teal);">${r.ticker}</div>
              <div style="font-family:var(--serif);font-size:15px;font-style:italic;color:var(--text1);margin-top:4px;">${r.name}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${r.exchange} · ${r.currency}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--mono);font-size:20px;color:var(--text1);">${r.price?"$"+r.price.toFixed(2):"—"}</div>
            </div>
          </div>
          <div class="etf-preview-fields">
            <div class="etf-pf">
              <label>Categoría</label>
              <input type="text" id="rf-pf-cat" placeholder="ej. High Yield, Emergentes..." value="${r.category}">
            </div>
            <div class="etf-pf">
              <label>TER (ratio de gastos)</label>
              <input type="text" id="rf-pf-ter" placeholder="ej. 0.15%" value="${r.expenseRatio}">
            </div>
            <div class="etf-pf">
              <label>Yield / Cupón</label>
              <input type="text" id="rf-pf-yield" placeholder="ej. 4.5%" value="${r.etfYield}">
            </div>
            <div class="etf-pf" style="grid-column:1/-1">
              <label>Descripción / Notas</label>
              <textarea id="rf-pf-desc" placeholder="ej. ETF de bonos emergentes en divisa local, exposición a LatAm y Asia...">${r.description||""}</textarea>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
            <button class="btn" id="rf-preview-cancel">Cancelar</button>
            <button class="btn btn-primary" id="rf-preview-add">+ Añadir al universo</button>
          </div>
        </div>`,document.getElementById("rf-preview-cancel").addEventListener("click",()=>{n.innerHTML="",document.getElementById("rf-custom-input").value=""}),document.getElementById("rf-preview-add").addEventListener("click",async()=>{const b={...r,category:document.getElementById("rf-pf-cat").value,expenseRatio:document.getElementById("rf-pf-ter").value,etfYield:document.getElementById("rf-pf-yield").value,description:document.getElementById("rf-pf-desc").value},E=new Set(H.map(k=>k.ticker)),x=await O(),A=x.some(k=>(typeof k=="string"?k:k.ticker)===b.ticker);!E.has(b.ticker)&&!A&&(x.push(b),await V(x),p=x),n.innerHTML="",document.getElementById("rf-custom-input").value="",await s(),await m()})}catch(r){n.innerHTML=`<div class="etf-preview-card" style="margin-bottom:14px;color:var(--red);font-family:var(--mono);font-size:11px;">✗ ${r.message} — comprueba el ticker</div>`}}}return(f=document.getElementById("rf-custom-add-btn"))==null||f.addEventListener("click",()=>{const a=document.getElementById("rf-custom-input"),n=a==null?void 0:a.value.trim().toUpperCase();n&&v(n)}),(y=document.getElementById("rf-custom-input"))==null||y.addEventListener("keydown",a=>{if(a.key==="Enter"){a.preventDefault();const n=a.target.value.trim().toUpperCase();n&&v(n)}a.target.value=a.target.value.toUpperCase()}),e.querySelectorAll(".cm-tab").forEach(a=>{a.addEventListener("click",()=>{i=a.dataset.cat,e.querySelectorAll(".cm-tab").forEach(n=>n.classList.remove("active")),a.classList.add("active"),d()})}),["rf-filter-score","rf-filter-estado"].forEach(a=>{var n;(n=document.getElementById(a))==null||n.addEventListener("change",d)}),(h=document.getElementById("rf-scan-btn"))==null||h.addEventListener("click",g),((I=l==null?void 0:l.scanResults)==null?void 0:I.length)>0&&(d==null||d()),{destroy(){}}}export{te as render};
