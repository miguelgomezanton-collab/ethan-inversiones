import{U as B}from"./userdata-n3nGJAZW.js";import"./index-xG_i8sKu.js";const D="ethan_etf_rv_universe",J=11,ne=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`,o=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(o)}`];async function X(o){for(const p of ne)try{const e=await fetch(p(o),{signal:AbortSignal.timeout(8e3)});if(!e.ok)continue;const a=await e.text();return JSON.parse(a)}catch{}throw new Error("Sin proxy disponible")}async function se(o){var i,n,f;const p=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=5d`,e=await X(p),a=(f=(n=(i=e==null?void 0:e.chart)==null?void 0:i.result)==null?void 0:n[0])==null?void 0:f.meta;if(!a)throw new Error("ETF no encontrado");return{ticker:o.toUpperCase(),name:a.shortName||a.longName||o,price:a.regularMarketPrice||null,currency:a.currency||"USD",exchange:a.exchangeName||"",category:"",description:"",expenseRatio:"",etfYield:"",addedAt:new Date().toLocaleDateString("es-ES")}}function T(o,p){const e=2/(p+1),a=new Array(o.length).fill(null);let i=o.findIndex(n=>n!=null&&!isNaN(n));if(i<0)return a;a[i]=o[i];for(let n=i+1;n<o.length;n++){const f=o[n]!=null&&!isNaN(o[n])?o[n]:a[n-1];a[n]=f*e+a[n-1]*(1-e)}return a}function F(o){const p=T(o,12),e=T(o,26),a=p.map((i,n)=>i!=null&&e[n]!=null?i-e[n]:null);return{m:a,sl:T(a.map(i=>i??0),9)}}function z(o,p=14){const e=new Array(o.length).fill(null);if(o.length<p+1)return e;let a=0,i=0;for(let s=1;s<=p;s++){const r=o[s]-o[s-1];r>0?a+=r:i-=r}let n=a/p,f=i/p;e[p]=f===0?100:100-100/(1+n/f);for(let s=p+1;s<o.length;s++){const r=o[s]-o[s-1];n=(n*(p-1)+(r>0?r:0))/p,f=(f*(p-1)+(r<0?-r:0))/p,e[s]=f===0?100:100-100/(1+n/f)}return e}function N(o,p,e,a){const i=e.map((f,s)=>{if(s<a-1)return null;const r=Math.max(...o.slice(s-a+1,s+1)),m=Math.min(...p.slice(s-a+1,s+1));return r===m?50:(f-m)/(r-m)*100}),n=T(i,3);return{k:n,d:T(n.map(f=>f??0),3)}}function K(o,p,e,a,i,n,f){const s={};o.forEach((m,w)=>{const b=new Date(m*1e3);let E;if(f==="W"){const c=b.getDay(),l=b.getDate()-c+(c===0?-6:1),d=new Date(+b);d.setDate(l),E=d.toISOString().slice(0,10)}else E=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`;s[E]?(s[E].h=Math.max(s[E].h,e[w]),s[E].l=Math.min(s[E].l,a[w]),s[E].c=i[w],s[E].v+=n[w]):s[E]={o:p[w],h:e[w],l:a[w],c:i[w],v:n[w]}});const r=Object.keys(s).sort();return{opens:r.map(m=>s[m].o),highs:r.map(m=>s[m].h),lows:r.map(m=>s[m].l),closes:r.map(m=>s[m].c),vols:r.map(m=>s[m].v)}}async function oe(o){var j,P,_,q,G,W,Q;const p=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=10y&events=history`,e=await X(p),a=(P=(j=e==null?void 0:e.chart)==null?void 0:j.result)==null?void 0:P[0];if(!a)throw new Error("Sin datos");const i=(q=(_=a.indicators)==null?void 0:_.quote)==null?void 0:q[0];if(!i)throw new Error("Sin quotes");const n=((Q=(W=(G=a.indicators)==null?void 0:G.adjclose)==null?void 0:W[0])==null?void 0:Q.adjclose)||i.close,f=n.map((y,$)=>i.close[$]&&y?y/i.close[$]:1),s=n,r=i.high.map((y,$)=>y*f[$]),m=i.low.map((y,$)=>y*f[$]),w=i.open.map((y,$)=>y*f[$]),b=i.volume,E=a.timestamp,c=s.length,l=c-1,d=b.slice(-J).reduce((y,$)=>y+($||0),0)/J,u=K(E,w,r,m,s,b,"W"),g=u.closes.length-1,h=K(E,w,r,m,s,b,"M"),v=h.closes.length-1,k=F(h.closes),I=N(h.highs,h.lows,h.closes,89),t=N(h.highs,h.lows,h.closes,8),x=z(h.closes),C=T(h.closes,10),A=F(u.closes),L=N(u.highs,u.lows,u.closes,89),Z=z(u.closes),U=T(u.closes,20),S=F(s),ee=z(s),H=[k.m[v]>0&&k.m[v]>k.sl[v],I.k[v]>80&&I.k[v]>I.d[v]||I.k[v]>92,x[v]>65,t.k[v]>78,C[v]&&h.closes[v]>C[v]],V=[A.m[g]>0&&A.m[g]>A.sl[g],L.k[g]>85&&L.k[g]>L.d[g]||L.k[g]>92,Z[g]>67,U[g]&&u.closes[g]>U[g]],M=H.every(y=>y),O=V.every(y=>y),te=S.m[l]>S.sl[l]&&l>0&&S.m[l-1]<=S.sl[l-1]&&ee[l]>57&&S.m[l]>0,Y=H.filter(y=>y).length+V.filter(y=>y).length+(M&&O?1:0);let R="watching";return M&&O&&te?R="ready":M&&O?R="diario":Y>=7&&(R="close"),{score:Y,estado:R,price:s[l],avgVol11:d}}async function ie(o,{actionsSlot:p}){var w,b,E;let e=await B.get(D)||[],a=[],i=!1,n=null;p.innerHTML=`
    <div style="display:flex;gap:8px;align-items:center;">
      <input type="text" id="etf-input" placeholder="Ticker: SPY, QQQ, XLK..." class="wl-input" style="width:200px;text-transform:uppercase;" autocomplete="off">
      <button class="btn btn-primary" id="etf-search-btn">🔍 Buscar ETF</button>
    </div>
  `,o.innerHTML=`
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
  `;async function f(c){const l=document.getElementById("etf-preview");l.style.display="block",l.innerHTML=`
      <div class="etf-preview-card">
        <div style="display:flex;align-items:center;gap:10px;color:var(--text3);font-family:var(--mono);font-size:11px;">
          <div class="loader-ring"></div>Buscando ${c}...
        </div>
      </div>`;try{n=await se(c),l.innerHTML=`
        <div class="etf-preview-card">
          <div class="etf-preview-header">
            <div>
              <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--teal);">${n.ticker}</div>
              <div style="font-family:var(--serif);font-size:15px;font-style:italic;color:var(--text1);margin-top:4px;">${n.name}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${n.exchange} · ${n.currency}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--mono);font-size:20px;color:var(--text1);">${n.price?"$"+n.price.toFixed(2):"—"}</div>
            </div>
          </div>
          <div class="etf-preview-fields">
            <div class="etf-pf">
              <label>Categoría / Sector</label>
              <input type="text" id="pf-cat" placeholder="ej. Technology, Semiconductors..." value="${n.category}">
            </div>
            <div class="etf-pf">
              <label>TER (ratio de gastos)</label>
              <input type="text" id="pf-ter" placeholder="ej. 0.20%" value="${n.expenseRatio}">
            </div>
            <div class="etf-pf">
              <label>Yield / Dividendo</label>
              <input type="text" id="pf-yield" placeholder="ej. 1.5%" value="${n.etfYield}">
            </div>
            <div class="etf-pf" style="grid-column:1/-1">
              <label>Descripción / Notas</label>
              <textarea id="pf-desc" placeholder="ej. ETF de semiconductores con exposición a NVDA, AMD, INTC...">${n.description}</textarea>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
            <button class="btn" id="preview-cancel">Cancelar</button>
            <button class="btn btn-primary" id="preview-add">+ Añadir al universo</button>
          </div>
        </div>`,document.getElementById("preview-cancel").addEventListener("click",()=>{l.style.display="none",document.getElementById("etf-input").value=""}),document.getElementById("preview-add").addEventListener("click",async()=>{const d={...n,category:document.getElementById("pf-cat").value,expenseRatio:document.getElementById("pf-ter").value,etfYield:document.getElementById("pf-yield").value,description:document.getElementById("pf-desc").value};e.find(u=>u.ticker===d.ticker)||(e.push(d),await B.set(D,e)),l.style.display="none",document.getElementById("etf-input").value="",s(),r()})}catch(d){l.innerHTML=`<div class="etf-preview-card" style="color:var(--red);font-family:var(--mono);font-size:11px;">✗ ${d.message}</div>`}}function s(){const c=document.getElementById("etf-chips"),l=document.getElementById("etf-universe-count");c.innerHTML=e.map(d=>`
      <span class="rf-custom-chip" title="${d.name}${d.category?" · "+d.category:""}">
        ${d.ticker}
        <button class="rf-custom-remove" data-ticker="${d.ticker}">✕</button>
      </span>`).join(""),l.textContent=`${e.length} ETF${e.length!==1?"s":""}`,document.getElementById("etf-scan-btn").disabled=e.length===0,c.querySelectorAll(".rf-custom-remove").forEach(d=>{d.addEventListener("click",async()=>{e=e.filter(u=>u.ticker!==d.dataset.ticker),await B.set(D,e),s(),r()})})}function r(){var k,I;const c=parseInt(((k=document.getElementById("etf-f-score"))==null?void 0:k.value)||"7"),l=((I=document.getElementById("etf-f-estado"))==null?void 0:I.value)||"all",d=a.filter(t=>!(t.score<c||l!=="all"&&t.estado!==l)).sort((t,x)=>x.score-t.score),u=document.getElementById("etf-results");if(!u)return;if(a.length===0){u.innerHTML=`<div class="sc2-empty">${e.length>0?`${e.length} ETFs listos · pulsa Escanear`:"Añade ETFs al universo y pulsa Escanear"}</div>`;return}if(d.length===0){u.innerHTML='<div class="sc2-empty">Ningún ETF cumple los filtros actuales</div>';return}const g=t=>t>=9?"var(--green)":t>=7?"var(--amber)":"var(--text3)",h={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},v=t=>t==="ready"?"var(--green)":t==="diario"?"var(--amber)":t==="close"?"var(--blue)":"var(--text3)";u.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${d.length} ETFs · <strong style="color:var(--green)">${d.filter(t=>t.estado==="ready").length} listos</strong>
        · ${d.filter(t=>t.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${d.map(t=>{const x=e.find(C=>C.ticker===t.ticker)||{};return`
              <tr>
                <td>
                  <div class="sc2-ticker">${t.ticker}</div>
                  <div style="font-size:10px;color:var(--text2);margin-top:2px;">${x.name||"—"}</div>
                  ${x.description?`<div style="font-size:9px;color:var(--text3);margin-top:2px;max-width:220px;line-height:1.4;">${x.description.slice(0,80)}${x.description.length>80?"…":""}</div>`:""}
                </td>
                <td>
                  <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">${x.category||"—"}</div>
                  ${x.expenseRatio?`<div style="font-size:9px;color:var(--text3);font-family:var(--mono);">TER: ${x.expenseRatio}</div>`:""}
                  ${x.etfYield?`<div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Yield: ${x.etfYield}</div>`:""}
                </td>
                <td class="sc2-score" style="color:${g(t.score)}">${t.score}/10</td>
                <td style="color:${v(t.estado)};font-size:10px;font-weight:600">${h[t.estado]||"—"}</td>
                <td class="sc2-price">${t.price?"$"+t.price.toFixed(2):"—"}</td>
                <td class="sc2-vol">${t.avgVol11>=1e6?(t.avgVol11/1e6).toFixed(1)+"M":Math.round(t.avgVol11/1e3)+"k"}</td>
                <td><button class="sc2-wl-btn" data-wl="${t.ticker}">+ WL</button></td>
              </tr>`}).join("")}
        </tbody>
      </table>`,u.querySelectorAll(".sc2-wl-btn").forEach(t=>{t.addEventListener("click",async()=>{try{const x=await B.get("ethan_watchlist_v1")||[];x.includes(t.dataset.wl)||(x.push(t.dataset.wl),await B.set("ethan_watchlist_v1",x)),t.textContent="✓",t.style.color="var(--green)",t.disabled=!0}catch{}})})}async function m(){if(i||e.length===0)return;i=!0,a=[];const c=document.getElementById("etf-scan-btn"),l=document.getElementById("etf-status"),d=document.getElementById("etf-progress"),u=document.getElementById("etf-progress-fill");c.disabled=!0,c.textContent="⏳ Escaneando...",d.style.display="block",u.style.width="0%";const g=5;let h=0;for(let v=0;v<e.length;v+=g){const k=e.slice(v,v+g);(await Promise.all(k.map(async t=>{try{return{ticker:t.ticker,...await oe(t.ticker)}}catch{return null}}))).forEach(t=>{t&&a.push(t)}),h+=k.length,u.style.width=(h/e.length*100).toFixed(0)+"%",l.textContent=`${e[Math.min(v+g-1,e.length-1)].ticker} (${h}/${e.length})`,r(),await new Promise(t=>setTimeout(t,300))}i=!1,c.disabled=!1,c.textContent="↻ Re-escanear",d.style.display="none",l.textContent=`${a.length} ETFs · ${a.filter(v=>v.estado==="ready").length} listos`,r()}return(w=document.getElementById("etf-search-btn"))==null||w.addEventListener("click",()=>{var l;const c=(l=document.getElementById("etf-input"))==null?void 0:l.value.trim().toUpperCase();c&&f(c)}),(b=document.getElementById("etf-input"))==null||b.addEventListener("keydown",c=>{if(c.key==="Enter"){const l=c.target.value.trim().toUpperCase();l&&f(l)}c.target.value=c.target.value.toUpperCase()}),(E=document.getElementById("etf-scan-btn"))==null||E.addEventListener("click",m),["etf-f-score","etf-f-estado"].forEach(c=>{var l;(l=document.getElementById(c))==null||l.addEventListener("change",r)}),s(),r(),{destroy(){}}}export{ie as render};
