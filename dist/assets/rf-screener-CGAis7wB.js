import{U as L}from"./userdata-DX6e4I4S.js";import"./index-BAPcvFQs.js";const D=[{ticker:"TLT",name:"Bonos Tesoro USA 20+ años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEF",name:"Bonos Tesoro USA 7-10 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SHY",name:"Bonos Tesoro USA 1-3 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEI",name:"Bonos Tesoro USA 3-7 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"GOVT",name:"Bonos Gobierno USA (todos)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"TIP",name:"Bonos TIPS (inflación USA)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SCHP",name:"TIPS Schwab",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGIT",name:"Bonos Gobierno USA 5-10a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGLT",name:"Bonos Gobierno USA 25+a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SPTL",name:"Bonos Largo Plazo SPDR",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"LQD",name:"Bonos Corp. Investment Grade",cat:"corp-usa",emoji:"🏢"},{ticker:"VCIT",name:"Bonos Corp. Medio Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"VCLT",name:"Bonos Corp. Largo Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"USIG",name:"Bonos Corp. IG USA",cat:"corp-usa",emoji:"🏢"},{ticker:"IGSB",name:"Bonos Corp. Corto Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"IGIB",name:"Bonos Corp. Medio Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"HYG",name:"High Yield Corporativo iShares",cat:"high-yield",emoji:"⚡"},{ticker:"JNK",name:"High Yield SPDR",cat:"high-yield",emoji:"⚡"},{ticker:"USHY",name:"High Yield USA iShares",cat:"high-yield",emoji:"⚡"},{ticker:"HYLD",name:"High Yield Activo",cat:"high-yield",emoji:"⚡"},{ticker:"ANGL",name:"Fallen Angels USD Bond",cat:"high-yield",emoji:"⚡"},{ticker:"BNDX",name:"Bonos Internacionales Vanguard",cat:"intl",emoji:"🌍"},{ticker:"BWX",name:"Bonos Gobierno Internac.",cat:"intl",emoji:"🌍"},{ticker:"EMB",name:"Bonos Emergentes USD iShares",cat:"intl",emoji:"🌍"},{ticker:"PCY",name:"Bonos Emergentes USD Invesco",cat:"intl",emoji:"🌍"},{ticker:"VWOB",name:"Bonos Emergentes Vanguard",cat:"intl",emoji:"🌍"},{ticker:"IGOV",name:"Bonos Gobierno DM iShares",cat:"intl",emoji:"🌍"},{ticker:"IAGG",name:"Bonos Agregado Intl. iShares",cat:"intl",emoji:"🌍"},{ticker:"BND",name:"Agregado USA Vanguard",cat:"broad",emoji:"📊"},{ticker:"AGG",name:"Agregado USA iShares",cat:"broad",emoji:"📊"},{ticker:"FBND",name:"Agregado USA Fidelity",cat:"broad",emoji:"📊"},{ticker:"SCHZ",name:"Agregado USA Schwab",cat:"broad",emoji:"📊"},{ticker:"SPAB",name:"Agregado USA SPDR",cat:"broad",emoji:"📊"},{ticker:"SHV",name:"Letras Tesoro USA <1 año",cat:"short",emoji:"💵"},{ticker:"BIL",name:"T-Bills 1-3 meses",cat:"short",emoji:"💵"},{ticker:"SGOV",name:"T-Bills 0-3 meses iShares",cat:"short",emoji:"💵"},{ticker:"CLTL",name:"Tesoro Corto Plazo Invesco",cat:"short",emoji:"💵"},{ticker:"MINT",name:"Money Market PIMCO",cat:"short",emoji:"💵"}],V=[{key:"all",label:"Todos",emoji:"📋"},{key:"gov-usa",label:"Gobierno USA",emoji:"🇺🇸"},{key:"corp-usa",label:"Corporativo USA",emoji:"🏢"},{key:"high-yield",label:"High Yield",emoji:"⚡"},{key:"intl",label:"Internacional",emoji:"🌍"},{key:"broad",label:"Agregados",emoji:"📊"},{key:"short",label:"Corto Plazo",emoji:"💵"}],F=11,W=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];async function X(s){var r,c,d,n,m,a,u;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`;for(const g of W)try{const f=await fetch(g(l),{signal:AbortSignal.timeout(8e3)});if(!f.ok)continue;const h=await f.text();let e;try{e=JSON.parse(h)}catch{continue}const t=(c=(r=e==null?void 0:e.chart)==null?void 0:r.result)==null?void 0:c[0];if(!t)continue;const i=(n=(d=t.indicators)==null?void 0:d.quote)==null?void 0:n[0];if(!i)continue;const p=((u=(a=(m=t.indicators)==null?void 0:m.adjclose)==null?void 0:a[0])==null?void 0:u.adjclose)||i.close,v=p.map((y,k)=>i.close[k]&&y?y/i.close[k]:1);return{timestamps:t.timestamp,opens:i.open.map((y,k)=>y*v[k]),highs:i.high.map((y,k)=>y*v[k]),lows:i.low.map((y,k)=>y*v[k]),closes:p,vols:i.volume}}catch{}throw new Error("Sin datos")}function x(s,l){const r=2/(l+1),c=new Array(s.length).fill(null);let d=s.findIndex(n=>n!=null&&!isNaN(n));if(d<0)return c;c[d]=s[d];for(let n=d+1;n<s.length;n++){const m=s[n]!=null&&!isNaN(s[n])?s[n]:c[n-1];c[n]=m*r+c[n-1]*(1-r)}return c}function U(s){const l=x(s,12),r=x(s,26),c=l.map((d,n)=>d!=null&&r[n]!=null?d-r[n]:null);return{m:c,sl:x(c.map(d=>d??0),9)}}function O(s,l=14){const r=new Array(s.length).fill(null);if(s.length<l+1)return r;let c=0,d=0;for(let a=1;a<=l;a++){const u=s[a]-s[a-1];u>0?c+=u:d-=u}let n=c/l,m=d/l;r[l]=m===0?100:100-100/(1+n/m);for(let a=l+1;a<s.length;a++){const u=s[a]-s[a-1];n=(n*(l-1)+(u>0?u:0))/l,m=(m*(l-1)+(u<0?-u:0))/l,r[a]=m===0?100:100-100/(1+n/m)}return r}function G(s,l,r,c){const d=r.map((m,a)=>{if(a<c-1)return null;const u=Math.max(...s.slice(a-c+1,a+1)),g=Math.min(...l.slice(a-c+1,a+1));return u===g?50:(m-g)/(u-g)*100}),n=x(d,3);return{k:n,d:x(n.map(m=>m??0),3)}}function z(s,l,r,c,d,n,m){const a={};s.forEach((g,f)=>{const h=new Date(g*1e3);let e;if(m==="W"){const t=h.getDay(),i=h.getDate()-t+(t===0?-6:1),p=new Date(+h);p.setDate(i),e=p.toISOString().slice(0,10)}else e=`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}`;a[e]?(a[e].h=Math.max(a[e].h,r[f]),a[e].l=Math.min(a[e].l,c[f]),a[e].c=d[f],a[e].v+=n[f]):a[e]={o:l[f],h:r[f],l:c[f],c:d[f],v:n[f]}});const u=Object.keys(a).sort();return{dates:u,opens:u.map(g=>a[g].o),highs:u.map(g=>a[g].h),lows:u.map(g=>a[g].l),closes:u.map(g=>a[g].c),vols:u.map(g=>a[g].v)}}function J(s){const{timestamps:l,opens:r,highs:c,lows:d,closes:n,vols:m}=s,a=n.length,u=m[a-1]||0,g=m.slice(-F).reduce((w,q)=>w+(q||0),0)/F,f=z(l,r,c,d,n,m,"W"),h=z(l,r,c,d,n,m,"M"),e=h.closes.length-1,t=f.closes.length-1,i=a-1,p=U(h.closes),v=G(h.highs,h.lows,h.closes,89),y=G(h.highs,h.lows,h.closes,8),k=O(h.closes),S=x(h.closes,10),E=U(f.closes),I=G(f.highs,f.lows,f.closes,89),o=O(f.closes),b=x(f.closes,20),A=U(n),B=O(n),T=[p.m[e]>0&&p.m[e]>p.sl[e],v.k[e]>80&&v.k[e]>v.d[e]||v.k[e]>92,k[e]>65,y.k[e]>78,S[e]&&h.closes[e]>S[e]],j=[E.m[t]>0&&E.m[t]>E.sl[t],I.k[t]>85&&I.k[t]>I.d[t]||I.k[t]>92,o[t]>67,b[t]&&f.closes[t]>b[t]],P=T.every(w=>w),R=j.every(w=>w),M=A.m[i]>A.sl[i]&&A.m[i-1]<=A.sl[i-1]&&B[i]>57&&A.m[i]>0,H=T.filter(w=>w).length+j.filter(w=>w).length+(M?1:0);let $="watching";return P&&R&&M?$="ready":P&&R?$="diario":H>=7&&($="close"),{score:H,estado:$,price:n[i],lastVol:u,avgVol11:g}}async function K(s){try{const l=await L.get("ethan_watchlist_rf_v1")||[];l.includes(s)||(l.push(s),await L.set("ethan_watchlist_rf_v1",l));const r=document.querySelector(`[data-wl="${s}"]`);r&&(r.textContent="✓",r.style.color="var(--green)",r.disabled=!0)}catch{}}const Y="ethan_rf_custom_etfs";async function C(){try{return await L.get(Y)||[]}catch{return[]}}async function N(s){await L.set(Y,s)}async function _(){const s=await C(),l=new Set(D.map(c=>c.ticker)),r=s.filter(c=>!l.has(c)).map(c=>({ticker:c,name:c,cat:"custom",emoji:"➕"}));return[...D,...r]}async function ee(s,{actionsSlot:l}){var g,f,h;let r=[],c=!1,d="all";await C(),l.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;">
      <input type="text" id="rf-custom-input" placeholder="Añadir ETF al universo..." class="wl-input" style="width:200px;">
      <button class="btn" id="rf-custom-add-btn" style="font-size:10px;">+ Universo</button>
      <span style="width:1px;height:16px;background:var(--border);display:inline-block;"></span>
      <span class="cm-status" id="rf-status"></span>
      <button class="cm-scan-btn" id="rf-scan-btn">▶ Escanear</button>
    </div>
  `;async function n(){const e=document.getElementById("rf-custom-chips");if(!e)return;const t=await C();if(t.length===0){e.innerHTML="";return}e.innerHTML=`
      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 4px;">
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono);align-self:center;margin-right:4px;">AÑADIDOS AL UNIVERSO:</span>
        ${t.map(i=>`
          <span class="rf-custom-chip">
            ➕ ${i}
            <button class="rf-custom-remove" data-ticker="${i}">✕</button>
          </span>
        `).join("")}
      </div>
    `,e.querySelectorAll(".rf-custom-remove").forEach(i=>{i.addEventListener("click",async()=>{const p=i.dataset.ticker,v=(await C()).filter(y=>y!==p);await N(v),await n(),await m()})})}async function m(){const e=(await _()).length,t=document.getElementById("rf-universe-count");t&&(t.textContent=`${e} ETFs en universo`)}s.innerHTML=`
    <div class="cm-wrap">
      <div id="rf-custom-chips"></div>
      <div class="cm-tabs">
        ${V.map((e,t)=>`
          <button class="cm-tab ${t===0?"active":""}" data-cat="${e.key}">
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
  `,await n(),await m();function a(){var E,I;const e=parseInt(((E=document.getElementById("rf-filter-score"))==null?void 0:E.value)||"7"),t=((I=document.getElementById("rf-filter-estado"))==null?void 0:I.value)||"all",i=r.filter(o=>!(o.score<e||d!=="all"&&o.cat!==d||t!=="all"&&o.estado!==t)).sort((o,b)=>b.score-o.score);V.forEach(o=>{const b=document.getElementById(`rf-badge-${o.key}`);if(!b)return;const A=r.filter(j=>o.key==="all"||j.cat===o.key),B=A.filter(j=>j.estado==="ready").length,T=A.filter(j=>j.score>=7).length;T>0?(b.textContent=B>0?B:T,b.style.background=B>0?"var(--green)":"var(--text3)",b.style.display="inline"):b.style.display="none"});const p=document.getElementById("rf-results");if(!p)return;if(i.length===0){p.innerHTML=`<div class="sc2-empty">${r.length>0?"Ningún ETF cumple los filtros actuales":"Pulsa Escanear para analizar el universo de Renta Fija"}</div>`;return}const v=o=>o>=9?"var(--green)":o>=7?"var(--amber)":"var(--text3)",y={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},k=o=>o==="ready"?"var(--green)":o==="diario"?"var(--amber)":"var(--text3)",S={"gov-usa":"GOB. USA","corp-usa":"CORP. USA","high-yield":"HIGH YIELD",intl:"INTL.",broad:"AGREGADO",short:"CORTO PLAZO"};p.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${i.length} ETFs · <strong style="color:var(--green)">${i.filter(o=>o.estado==="ready").length} listos</strong>
        · ${i.filter(o=>o.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${i.map(o=>`
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
              <td style="font-size:9.5px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${S[o.cat]||o.cat}</td>
              <td class="sc2-score" style="color:${v(o.score)}">${o.score}/10</td>
              <td style="color:${k(o.estado)};font-size:10px;font-weight:600">${y[o.estado]||"—"}</td>
              <td class="sc2-price">${o.price?"$"+o.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${o.avgVol11>=1e6?(o.avgVol11/1e6).toFixed(1)+"M":Math.round(o.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${o.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,p.querySelectorAll(".sc2-wl-btn").forEach(o=>{o.addEventListener("click",b=>{b.stopPropagation(),K(o.dataset.wl)})})}async function u(){if(c)return;c=!0,r=[];const e=await _(),t=document.getElementById("rf-scan-btn"),i=document.getElementById("rf-status"),p=document.getElementById("rf-progress"),v=document.getElementById("rf-progress-fill");t&&(t.disabled=!0,t.textContent="⏳ Escaneando..."),p&&(p.style.display="block"),v&&(v.style.width="0%");const y=6;let k=0;for(let S=0;S<e.length;S+=y){const E=e.slice(S,S+y);(await Promise.all(E.map(async o=>{try{const b=await X(o.ticker);return{...o,...J(b)}}catch{return null}}))).forEach(o=>{o&&r.push(o)}),k+=E.length,v&&(v.style.width=(k/e.length*100).toFixed(0)+"%"),i&&(i.textContent=`${e[Math.min(S+y-1,e.length-1)].ticker} (${k}/${e.length})`),a(),await new Promise(o=>setTimeout(o,300))}c=!1,t&&(t.disabled=!1,t.textContent="↻ Re-escanear"),p&&(p.style.display="none"),i&&(i.textContent=`${r.length} ETFs · ${r.filter(S=>S.estado==="ready").length} listos`),a()}return(g=document.getElementById("rf-custom-add-btn"))==null||g.addEventListener("click",async()=>{const e=document.getElementById("rf-custom-input"),t=e==null?void 0:e.value.trim().toUpperCase();if(!t)return;const i=new Set(D.map(v=>v.ticker)),p=await C();!i.has(t)&&!p.includes(t)&&(p.push(t),await N(p),await n(),await m()),e&&(e.value="")}),(f=document.getElementById("rf-custom-input"))==null||f.addEventListener("keydown",e=>{var t;e.key==="Enter"&&(e.preventDefault(),(t=document.getElementById("rf-custom-add-btn"))==null||t.click())}),s.querySelectorAll(".cm-tab").forEach(e=>{e.addEventListener("click",()=>{d=e.dataset.cat,s.querySelectorAll(".cm-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),a()})}),["rf-filter-score","rf-filter-estado"].forEach(e=>{var t;(t=document.getElementById(e))==null||t.addEventListener("change",a)}),(h=document.getElementById("rf-scan-btn"))==null||h.addEventListener("click",u),{destroy(){}}}export{ee as render};
