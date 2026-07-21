import{s as ne}from"./index-DuMkqd25.js";import{U as M}from"./userdata-CJI3A66s.js";const D="ethan_etf_rv_universe",J=11,se=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];async function X(s){for(const f of se)try{const r=await fetch(f(s),{signal:AbortSignal.timeout(8e3)});if(!r.ok)continue;const e=await r.text();return JSON.parse(e)}catch{}throw new Error("Sin proxy disponible")}async function oe(s){var o,l,i;const f=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=5d`,r=await X(f),e=(i=(l=(o=r==null?void 0:r.chart)==null?void 0:o.result)==null?void 0:l[0])==null?void 0:i.meta;if(!e)throw new Error("ETF no encontrado");return{ticker:s.toUpperCase(),name:e.shortName||e.longName||s,price:e.regularMarketPrice||null,currency:e.currency||"USD",exchange:e.exchangeName||"",category:"",description:"",expenseRatio:"",etfYield:"",addedAt:new Date().toLocaleDateString("es-ES")}}function B(s,f){const r=2/(f+1),e=new Array(s.length).fill(null);let o=s.findIndex(l=>l!=null&&!isNaN(l));if(o<0)return e;e[o]=s[o];for(let l=o+1;l<s.length;l++){const i=s[l]!=null&&!isNaN(s[l])?s[l]:e[l-1];e[l]=i*r+e[l-1]*(1-r)}return e}function F(s){const f=B(s,12),r=B(s,26),e=f.map((o,l)=>o!=null&&r[l]!=null?o-r[l]:null);return{m:e,sl:B(e.map(o=>o??0),9)}}function z(s,f=14){const r=new Array(s.length).fill(null);if(s.length<f+1)return r;let e=0,o=0;for(let n=1;n<=f;n++){const u=s[n]-s[n-1];u>0?e+=u:o-=u}let l=e/f,i=o/f;r[f]=i===0?100:100-100/(1+l/i);for(let n=f+1;n<s.length;n++){const u=s[n]-s[n-1];l=(l*(f-1)+(u>0?u:0))/f,i=(i*(f-1)+(u<0?-u:0))/f,r[n]=i===0?100:100-100/(1+l/i)}return r}function N(s,f,r,e){const o=r.map((i,n)=>{if(n<e-1)return null;const u=Math.max(...s.slice(n-e+1,n+1)),d=Math.min(...f.slice(n-e+1,n+1));return u===d?50:(i-d)/(u-d)*100}),l=B(o,3);return{k:l,d:B(l.map(i=>i??0),3)}}function K(s,f,r,e,o,l,i){const n={};s.forEach((d,x)=>{const b=new Date(d*1e3);let h;if(i==="W"){const I=b.getDay(),w=b.getDate()-I+(I===0?-6:1),p=new Date(+b);p.setDate(w),h=p.toISOString().slice(0,10)}else h=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`;n[h]?(n[h].h=Math.max(n[h].h,r[x]),n[h].l=Math.min(n[h].l,e[x]),n[h].c=o[x],n[h].v+=l[x]):n[h]={o:f[x],h:r[x],l:e[x],c:o[x],v:l[x]}});const u=Object.keys(n).sort();return{opens:u.map(d=>n[d].o),highs:u.map(d=>n[d].h),lows:u.map(d=>n[d].l),closes:u.map(d=>n[d].c),vols:u.map(d=>n[d].v)}}async function le(s){var j,P,_,q,G,W,Q;const f=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`,r=await X(f),e=(P=(j=r==null?void 0:r.chart)==null?void 0:j.result)==null?void 0:P[0];if(!e)throw new Error("Sin datos");const o=(q=(_=e.indicators)==null?void 0:_.quote)==null?void 0:q[0];if(!o)throw new Error("Sin quotes");const l=((Q=(W=(G=e.indicators)==null?void 0:G.adjclose)==null?void 0:W[0])==null?void 0:Q.adjclose)||o.close,i=l.map((g,$)=>o.close[$]&&g?g/o.close[$]:1),n=l,u=o.high.map((g,$)=>g*i[$]),d=o.low.map((g,$)=>g*i[$]),x=o.open.map((g,$)=>g*i[$]),b=o.volume,h=e.timestamp,I=n.length,w=I-1,p=b.slice(-J).reduce((g,$)=>g+($||0),0)/J,c=K(h,x,u,d,n,b,"W"),a=c.closes.length-1,v=K(h,x,u,d,n,b,"M"),y=v.closes.length-1,k=F(v.closes),E=N(v.highs,v.lows,v.closes,89),T=N(v.highs,v.lows,v.closes,8),R=z(v.closes),t=B(v.closes,10),m=F(c.closes),C=N(c.highs,c.lows,c.closes,89),Z=z(c.closes),U=B(c.closes,20),L=F(n),ee=z(n),H=[k.m[y]>0&&k.m[y]>k.sl[y],E.k[y]>80&&E.k[y]>E.d[y]||E.k[y]>92,R[y]>65,T.k[y]>78,t[y]&&v.closes[y]>t[y]],V=[m.m[a]>0&&m.m[a]>m.sl[a],C.k[a]>85&&C.k[a]>C.d[a]||C.k[a]>92,Z[a]>67,U[a]&&c.closes[a]>U[a]],O=H.every(g=>g),S=V.every(g=>g),te=L.m[w]>L.sl[w]&&w>0&&L.m[w-1]<=L.sl[w-1]&&ee[w]>57&&L.m[w]>0,Y=H.filter(g=>g).length+V.filter(g=>g).length+(O&&S?1:0);let A="watching";return O&&S&&te?A="ready":O&&S?A="diario":Y>=7&&(A="close"),{score:Y,estado:A,price:n[w],avgVol11:p}}async function re(s,{actionsSlot:f,savedState:r}){var b,h,I,w;let e=await M.get(D)||[],o=(r==null?void 0:r.scanResults)||[],l=!1,i=null;f.innerHTML=`
    <div style="display:flex;gap:8px;align-items:center;">
      <input type="text" id="etf-input" placeholder="Ticker: SPY, QQQ, XLK..." class="wl-input" style="width:200px;text-transform:uppercase;" autocomplete="off">
      <button class="btn btn-primary" id="etf-search-btn">🔍 Buscar ETF</button>
    </div>
  `,s.innerHTML=`
    <div class="etf-wrap">

      <!-- Preview card -->
      <div id="etf-preview" style="display:none;"></div>

      <!-- Universe chips -->
      <div class="etf-universe-bar">
        <span class="etf-universe-label">UNIVERSO</span>
        <div id="etf-chips" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
        <span id="etf-universe-count" style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-left:auto;"></span>
      </div>

      <!-- Toolbar -->
      <div class="sc2-toolbar">
        <div class="sc2-filters">
          <div class="sc2-filter"><label>SCORE MÍN.</label>
            <select id="etf-f-score" class="sc2-sel">
              <option value="9">≥ 9</option><option value="8">≥ 8</option>
              <option value="7" selected>≥ 7</option><option value="6">≥ 6</option>
              <option value="0">Todos</option>
            </select>
          </div>
          <div class="sc2-filter"><label>ESTADO</label>
            <select id="etf-f-estado" class="sc2-sel">
              <option value="all">Todos</option>
              <option value="ready">🟢 Ready</option>
              <option value="diario">🟡 Espera diario</option>
              <option value="close">🔵 Cerca</option>
            </select>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="cm-status" id="etf-status"></span>
          <button class="cm-scan-btn" id="etf-scan-btn" disabled>▶ Escanear</button>
        </div>
      </div>

      <div class="sc2-progress" id="etf-progress" style="display:none">
        <div class="sc2-progress-fill" id="etf-progress-fill"></div>
      </div>

      <div id="etf-results">
        <div class="sc2-empty">Añade ETFs al universo y pulsa Escanear</div>
      </div>

    </div>
  `;async function n(p){const c=document.getElementById("etf-preview");c.style.display="block",c.innerHTML=`
      <div class="etf-preview-card">
        <div style="display:flex;align-items:center;gap:10px;color:var(--text3);font-family:var(--mono);font-size:11px;">
          <div class="loader-ring"></div>Buscando ${p}...
        </div>
      </div>`;try{i=await oe(p),c.innerHTML=`
        <div class="etf-preview-card">
          <div class="etf-preview-header">
            <div>
              <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--teal);">${i.ticker}</div>
              <div style="font-family:var(--serif);font-size:15px;font-style:italic;color:var(--text1);margin-top:4px;">${i.name}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${i.exchange} · ${i.currency}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--mono);font-size:20px;color:var(--text1);">${i.price?"$"+i.price.toFixed(2):"—"}</div>
            </div>
          </div>
          <div class="etf-preview-fields">
            <div class="etf-pf">
              <label>Categoría / Sector</label>
              <input type="text" id="pf-cat" placeholder="ej. Technology, Semiconductors..." value="${i.category}">
            </div>
            <div class="etf-pf">
              <label>TER (ratio de gastos)</label>
              <input type="text" id="pf-ter" placeholder="ej. 0.20%" value="${i.expenseRatio}">
            </div>
            <div class="etf-pf">
              <label>Yield / Dividendo</label>
              <input type="text" id="pf-yield" placeholder="ej. 1.5%" value="${i.etfYield}">
            </div>
            <div class="etf-pf" style="grid-column:1/-1">
              <label>Descripción / Notas</label>
              <textarea id="pf-desc" placeholder="ej. ETF de semiconductores con exposición a NVDA, AMD, INTC...">${i.description}</textarea>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
            <button class="btn" id="preview-cancel">Cancelar</button>
            <button class="btn btn-primary" id="preview-add">+ Añadir al universo</button>
          </div>
        </div>`,document.getElementById("preview-cancel").addEventListener("click",()=>{c.style.display="none",document.getElementById("etf-input").value=""}),document.getElementById("preview-add").addEventListener("click",async()=>{const a={...i,category:document.getElementById("pf-cat").value,expenseRatio:document.getElementById("pf-ter").value,etfYield:document.getElementById("pf-yield").value,description:document.getElementById("pf-desc").value};e.find(v=>v.ticker===a.ticker)||(e.push(a),await M.set(D,e)),c.style.display="none",document.getElementById("etf-input").value="",u(),d()})}catch(a){c.innerHTML=`<div class="etf-preview-card" style="color:var(--red);font-family:var(--mono);font-size:11px;">✗ ${a.message}</div>`}}function u(){const p=document.getElementById("etf-chips"),c=document.getElementById("etf-universe-count");p.innerHTML=e.map(a=>`
      <span class="rf-custom-chip" title="${a.name}${a.category?" · "+a.category:""}">
        ${a.ticker}
        <button class="rf-custom-remove" data-ticker="${a.ticker}">✕</button>
      </span>`).join(""),c.textContent=`${e.length} ETF${e.length!==1?"s":""}`,document.getElementById("etf-scan-btn").disabled=e.length===0,p.querySelectorAll(".rf-custom-remove").forEach(a=>{a.addEventListener("click",async()=>{e=e.filter(v=>v.ticker!==a.dataset.ticker),await M.set(D,e),u(),d()})})}function d(){var T,R;const p=parseInt(((T=document.getElementById("etf-f-score"))==null?void 0:T.value)||"7"),c=((R=document.getElementById("etf-f-estado"))==null?void 0:R.value)||"all",a=o.filter(t=>!(t.score<p||c!=="all"&&t.estado!==c)).sort((t,m)=>m.score-t.score),v=document.getElementById("etf-results");if(!v)return;if(o.length===0){v.innerHTML=`<div class="sc2-empty">${e.length>0?`${e.length} ETFs listos · pulsa Escanear`:"Añade ETFs al universo y pulsa Escanear"}</div>`;return}if(a.length===0){v.innerHTML='<div class="sc2-empty">Ningún ETF cumple los filtros actuales</div>';return}const y=t=>t>=9?"var(--green)":t>=7?"var(--amber)":"var(--text3)",k={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},E=t=>t==="ready"?"var(--green)":t==="diario"?"var(--amber)":t==="close"?"var(--blue)":"var(--text3)";v.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${a.length} ETFs · <strong style="color:var(--green)">${a.filter(t=>t.estado==="ready").length} listos</strong>
        · ${a.filter(t=>t.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${a.map(t=>{const m=e.find(C=>C.ticker===t.ticker)||{};return`
              <tr>
                <td>
                  <div class="sc2-ticker">${t.ticker}</div>
                  <div style="font-size:10px;color:var(--text2);margin-top:2px;">${m.name||"—"}</div>
                  ${m.description?`<div style="font-size:9px;color:var(--text3);margin-top:2px;max-width:220px;line-height:1.4;">${m.description.slice(0,80)}${m.description.length>80?"…":""}</div>`:""}
                </td>
                <td>
                  <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">${m.category||"—"}</div>
                  ${m.expenseRatio?`<div style="font-size:9px;color:var(--text3);font-family:var(--mono);">TER: ${m.expenseRatio}</div>`:""}
                  ${m.etfYield?`<div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Yield: ${m.etfYield}</div>`:""}
                </td>
                <td class="sc2-score" style="color:${y(t.score)}">${t.score}/10</td>
                <td style="color:${E(t.estado)};font-size:10px;font-weight:600">${k[t.estado]||"—"}</td>
                <td class="sc2-price">${t.price?"$"+t.price.toFixed(2):"—"}</td>
                <td class="sc2-vol">${t.avgVol11>=1e6?(t.avgVol11/1e6).toFixed(1)+"M":Math.round(t.avgVol11/1e3)+"k"}</td>
                <td><button class="sc2-wl-btn" data-wl="${t.ticker}">+ WL</button></td>
              </tr>`}).join("")}
        </tbody>
      </table>`,v.querySelectorAll(".sc2-wl-btn").forEach(t=>{t.addEventListener("click",async()=>{try{const m=await M.get("ethan_watchlist_v1")||[];m.includes(t.dataset.wl)||(m.push(t.dataset.wl),await M.set("ethan_watchlist_v1",m)),t.textContent="✓",t.style.color="var(--green)",t.disabled=!0}catch{}})})}async function x(){if(l||e.length===0)return;l=!0,o=[];const p=document.getElementById("etf-scan-btn"),c=document.getElementById("etf-status"),a=document.getElementById("etf-progress"),v=document.getElementById("etf-progress-fill");p.disabled=!0,p.textContent="⏳ Escaneando...",a.style.display="block",v.style.width="0%";const y=5;let k=0;for(let E=0;E<e.length;E+=y){const T=e.slice(E,E+y);(await Promise.all(T.map(async t=>{try{return{ticker:t.ticker,...await le(t.ticker)}}catch{return null}}))).forEach(t=>{t&&o.push(t)}),k+=T.length,v.style.width=(k/e.length*100).toFixed(0)+"%",c.textContent=`${e[Math.min(E+y-1,e.length-1)].ticker} (${k}/${e.length})`,d(),await new Promise(t=>setTimeout(t,300))}l=!1,p.disabled=!1,p.textContent="↻ Re-escanear",a.style.display="none",c.textContent=`${o.length} ETFs · ${o.filter(E=>E.estado==="ready").length} listos`,d(),ne("alc-etf-screener",{scanResults:o})}return(b=document.getElementById("etf-search-btn"))==null||b.addEventListener("click",()=>{var c;const p=(c=document.getElementById("etf-input"))==null?void 0:c.value.trim().toUpperCase();p&&n(p)}),(h=document.getElementById("etf-input"))==null||h.addEventListener("keydown",p=>{if(p.key==="Enter"){const c=p.target.value.trim().toUpperCase();c&&n(c)}p.target.value=p.target.value.toUpperCase()}),(I=document.getElementById("etf-scan-btn"))==null||I.addEventListener("click",x),["etf-f-score","etf-f-estado"].forEach(p=>{var c;(c=document.getElementById(p))==null||c.addEventListener("change",d)}),u(),d(),((w=r==null?void 0:r.scanResults)==null?void 0:w.length)>0&&(d==null||d()),{destroy(){}}}export{re as render};
