import{s as V}from"./index-Bux_OP-y.js";import{U as A}from"./userdata-DRc3raHj.js";const B=[{ticker:"GC=F",name:"Oro",cat:"metales",type:"futures",emoji:"🥇"},{ticker:"GLD",name:"Oro · SPDR Gold Trust",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"IAU",name:"Oro · iShares Gold ETF",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"SI=F",name:"Plata",cat:"metales",type:"futures",emoji:"🥈"},{ticker:"SLV",name:"Plata · iShares Silver",cat:"metales",type:"etf",emoji:"🥈"},{ticker:"PL=F",name:"Platino",cat:"metales",type:"futures",emoji:"⬜"},{ticker:"PA=F",name:"Paladio",cat:"metales",type:"futures",emoji:"🔘"},{ticker:"PPLT",name:"Platino · Sprott ETF",cat:"metales",type:"etf",emoji:"⬜"},{ticker:"CL=F",name:"Petróleo WTI",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"BZ=F",name:"Petróleo Brent",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"USO",name:"Petróleo · US Oil Fund",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"UCO",name:"Petróleo · ProShares 2x",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"NG=F",name:"Gas Natural",cat:"energia",type:"futures",emoji:"🔥"},{ticker:"UNG",name:"Gas Natural · US Fund",cat:"energia",type:"etf",emoji:"🔥"},{ticker:"RB=F",name:"Gasolina RBOB",cat:"energia",type:"futures",emoji:"⛽"},{ticker:"HO=F",name:"Gasóleo / Fuel Oil",cat:"energia",type:"futures",emoji:"🏭"},{ticker:"HG=F",name:"Cobre",cat:"industriales",type:"futures",emoji:"🟤"},{ticker:"CPER",name:"Cobre · US Copper ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"COPX",name:"Cobre · Mineras ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"ALI=F",name:"Aluminio",cat:"industriales",type:"futures",emoji:"🔩"},{ticker:"ZNC=F",name:"Zinc",cat:"industriales",type:"futures",emoji:"⚙️"},{ticker:"ZW=F",name:"Trigo",cat:"agricultura",type:"futures",emoji:"🌾"},{ticker:"WEAT",name:"Trigo · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌾"},{ticker:"ZC=F",name:"Maíz",cat:"agricultura",type:"futures",emoji:"🌽"},{ticker:"CORN",name:"Maíz · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌽"},{ticker:"ZS=F",name:"Soja",cat:"agricultura",type:"futures",emoji:"🫘"},{ticker:"SOYB",name:"Soja · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🫘"},{ticker:"SB=F",name:"Azúcar",cat:"agricultura",type:"futures",emoji:"🍬"},{ticker:"CANE",name:"Azúcar · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🍬"},{ticker:"KC=F",name:"Café",cat:"agricultura",type:"futures",emoji:"☕"},{ticker:"JO",name:"Café · iPath ETF",cat:"agricultura",type:"etf",emoji:"☕"},{ticker:"CC=F",name:"Cacao",cat:"agricultura",type:"futures",emoji:"🍫"},{ticker:"NIB",name:"Cacao · iPath ETF",cat:"agricultura",type:"etf",emoji:"🍫"},{ticker:"CT=F",name:"Algodón",cat:"agricultura",type:"futures",emoji:"🤍"},{ticker:"LE=F",name:"Ganado Bovino",cat:"agricultura",type:"futures",emoji:"🐄"},{ticker:"HE=F",name:"Cerdos",cat:"agricultura",type:"futures",emoji:"🐷"},{ticker:"GSG",name:"Commodities · iShares S&P",cat:"all",type:"etf",emoji:"🌐"},{ticker:"PDBC",name:"Commodities · Invesco",cat:"all",type:"etf",emoji:"🌐"},{ticker:"DJP",name:"Commodities · iPath",cat:"all",type:"etf",emoji:"🌐"},{ticker:"COMT",name:"Commodities · iShares GSCI",cat:"all",type:"etf",emoji:"🌐"}],G=[{key:"all",label:"Todos",emoji:"🌐"},{key:"metales",label:"Metales Preciosos",emoji:"🥇"},{key:"energia",label:"Energía",emoji:"⚡"},{key:"industriales",label:"Met. Industriales",emoji:"⚙️"},{key:"agricultura",label:"Agricultura",emoji:"🌾"}],D=11,H=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];async function q(s){var m,c,d,o,p,a,f;const u=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=10y&events=history`;for(const g of H)try{const y=await fetch(g(u),{signal:AbortSignal.timeout(8e3)});if(!y.ok)continue;const k=await y.text();let i;try{i=JSON.parse(k)}catch{continue}const b=(c=(m=i==null?void 0:i.chart)==null?void 0:m.result)==null?void 0:c[0];if(!b)continue;const E=(o=(d=b.indicators)==null?void 0:d.quote)==null?void 0:o[0];if(!E)continue;const I=((f=(a=(p=b.indicators)==null?void 0:p.adjclose)==null?void 0:a[0])==null?void 0:f.adjclose)||E.close,$=I.map((t,n)=>E.close[n]&&t?t/E.close[n]:1);return{timestamps:b.timestamp,opens:E.open.map((t,n)=>t*$[n]),highs:E.high.map((t,n)=>t*$[n]),lows:E.low.map((t,n)=>t*$[n]),closes:I,vols:E.volume}}catch{}throw new Error("Sin datos")}function M(s,u){const m=2/(u+1),c=new Array(s.length).fill(null);let d=s.findIndex(o=>o!=null&&!isNaN(o));if(d<0)return c;c[d]=s[d];for(let o=d+1;o<s.length;o++){const p=s[o]!=null&&!isNaN(s[o])?s[o]:c[o-1];c[o]=p*m+c[o-1]*(1-m)}return c}function R(s){const u=M(s,12),m=M(s,26),c=u.map((d,o)=>d!=null&&m[o]!=null?d-m[o]:null);return{m:c,sl:M(c.map(d=>d??0),9)}}function U(s,u=14){const m=new Array(s.length).fill(null);if(s.length<u+1)return m;let c=0,d=0;for(let a=1;a<=u;a++){const f=s[a]-s[a-1];f>0?c+=f:d-=f}let o=c/u,p=d/u;m[u]=p===0?100:100-100/(1+o/p);for(let a=u+1;a<s.length;a++){const f=s[a]-s[a-1];o=(o*(u-1)+(f>0?f:0))/u,p=(p*(u-1)+(f<0?-f:0))/u,m[a]=p===0?100:100-100/(1+o/p)}return m}function N(s,u,m,c){const d=m.map((p,a)=>{if(a<c-1)return null;const f=Math.max(...s.slice(a-c+1,a+1)),g=Math.min(...u.slice(a-c+1,a+1));return f===g?50:(p-g)/(f-g)*100}),o=M(d,3);return{k:o,d:M(o.map(p=>p??0),3)}}function z(s,u,m,c,d,o,p){const a={};s.forEach((g,y)=>{const k=new Date(g*1e3);let i;if(p==="W"){const b=k.getDay(),E=k.getDate()-b+(b===0?-6:1),I=new Date(+k);I.setDate(E),i=I.toISOString().slice(0,10)}else i=`${k.getFullYear()}-${String(k.getMonth()+1).padStart(2,"0")}`;a[i]?(a[i].h=Math.max(a[i].h,m[y]),a[i].l=Math.min(a[i].l,c[y]),a[i].c=d[y],a[i].v+=o[y]):a[i]={o:u[y],h:m[y],l:c[y],c:d[y],v:o[y]}});const f=Object.keys(a).sort();return{dates:f,opens:f.map(g=>a[g].o),highs:f.map(g=>a[g].h),lows:f.map(g=>a[g].l),closes:f.map(g=>a[g].c),vols:f.map(g=>a[g].v)}}function W(s){const{timestamps:u,opens:m,highs:c,lows:d,closes:o,vols:p}=s,a=o.length,f=p[a-1]||0,g=p.slice(-D).reduce((T,_)=>T+(_||0),0)/D,y=z(u,m,c,d,o,p,"W"),k=z(u,m,c,d,o,p,"M"),i=k.closes.length-1,b=y.closes.length-1,E=a-1,I=R(k.closes),$=N(k.highs,k.lows,k.closes,89),t=N(k.highs,k.lows,k.closes,8),n=U(k.closes),v=M(k.closes,10),r=R(y.closes),h=N(y.highs,y.lows,y.closes,89),F=U(y.closes),j=M(y.closes,20),l=R(o),w=U(o),O=[I.m[i]>0&&I.m[i]>I.sl[i],$.k[i]>80&&$.k[i]>$.d[i]||$.k[i]>92,n[i]>65,t.k[i]>78,v[i]&&k.closes[i]>v[i]],x=[r.m[b]>0&&r.m[b]>r.sl[b],h.k[b]>85&&h.k[b]>h.d[b]||h.k[b]>92,F[b]>67,j[b]&&y.closes[b]>j[b]],e=O.every(T=>T),C=x.every(T=>T),L=l.m[E]>l.sl[E]&&l.m[E-1]<=l.sl[E-1]&&w[E]>57&&l.m[E]>0,P=O.filter(T=>T).length+x.filter(T=>T).length+(L?1:0);let S="watching";return e&&C&&L?S="ready":e&&C?S="diario":P>=7&&(S="close"),{score:P,estado:S,price:o[E],lastVol:f,avgVol11:g}}async function Y(s,{actionsSlot:u,savedState:m}){var E,I,$;let c=(m==null?void 0:m.scanResults)||[],d=!1,o="all";const p="ethan_com_custom_etfs";async function a(){return await A.get(p)||[]}async function f(t){await A.set(p,t)}async function g(){const t=await a(),n=new Set(B.map(r=>r.ticker)),v=t.filter(r=>!n.has(typeof r=="string"?r:r.ticker)).map(r=>typeof r=="string"?{ticker:r,name:r,cat:"custom",type:"etf",emoji:"➕"}:{ticker:r.ticker,name:r.name||r.ticker,cat:r.category||"custom",type:"etf",emoji:"➕"});return[...B,...v]}async function y(t){var v,r,h;const n=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const F of H)try{const j=await fetch(F(n),{signal:AbortSignal.timeout(8e3)});if(!j.ok)continue;const l=JSON.parse(await j.text()),w=(h=(r=(v=l==null?void 0:l.chart)==null?void 0:v.result)==null?void 0:r[0])==null?void 0:h.meta;if(!w)continue;return{ticker:t.toUpperCase(),name:w.shortName||w.longName||t,price:w.regularMarketPrice||null,currency:w.currency||"USD",cat:"custom",type:"etf",emoji:"➕"}}catch{}throw new Error("Ticker no encontrado")}u.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-family:var(--mono);font-size:10px;color:var(--text3);" id="cm-universe-count">— activos</span>
      <button class="btn" id="cm-add-btn">+ Añadir ETF</button>
      <span class="cm-status" id="cm-status"></span>
      <button class="cm-scan-btn" id="cm-scan-btn">▶ Escanear</button>
    </div>
  `,g().then(t=>{const n=document.getElementById("cm-universe-count");n&&(n.textContent=t.length+" activos")}),s.innerHTML=`
    <div class="cm-wrap">
      <div id="cm-add-preview"></div>
      <div class="cm-tabs">
        ${G.map((t,n)=>`
          <button class="cm-tab ${n===0?"active":""}" data-cat="${t.key}">
            ${t.emoji} ${t.label}
            <span class="cm-tab-badge" id="cm-badge-${t.key}"></span>
          </button>
        `).join("")}
      </div>

      <div class="sc2-toolbar" style="margin-top:14px;">
        <div class="sc2-filters">
          <div class="sc2-filter"><label>SCORE MÍN.</label>
            <select id="cm-filter-score" class="sc2-sel">
              <option value="9">≥ 9</option>
              <option value="8">≥ 8</option>
              <option value="7" selected>≥ 7</option>
              <option value="6">≥ 6</option>
              <option value="5">≥ 5</option>
              <option value="0">Todos</option>
            </select>
          </div>
          <div class="sc2-filter"><label>TIPO</label>
            <select id="cm-filter-tipo" class="sc2-sel">
              <option value="all">Futuros + ETFs</option>
              <option value="futures">Solo Futuros</option>
              <option value="etf">Solo ETFs</option>
            </select>
          </div>
          <div class="sc2-filter"><label>ESTADO</label>
            <select id="cm-filter-estado" class="sc2-sel">
              <option value="all">Todos</option>
              <option value="ready">🟢 Ready</option>
              <option value="diario">🟡 Espera diario</option>
              <option value="close">🔵 Cerca</option>
            </select>
          </div>
        </div>
      </div>

      <div class="sc2-progress" id="cm-progress" style="display:none">
        <div class="sc2-progress-fill" id="cm-progress-fill"></div>
      </div>

      <div id="cm-results">
        <div class="sc2-empty">Pulsa Escanear para analizar el universo de commodities (${B.length} activos)</div>
      </div>
    </div>
  `;async function k(t){try{const n=await A.get("ethan_watchlist_com_v1")||[];n.includes(t)||(n.push(t),await A.set("ethan_watchlist_com_v1",n));const v=document.querySelector(`[data-wl="${t}"]`);v&&(v.textContent="✓",v.style.color="var(--green)",v.disabled=!0)}catch{}}function i(){var w,O,x;const t=parseInt(((w=document.getElementById("cm-filter-score"))==null?void 0:w.value)||"7"),n=((O=document.getElementById("cm-filter-tipo"))==null?void 0:O.value)||"all",v=((x=document.getElementById("cm-filter-estado"))==null?void 0:x.value)||"all",r=c.filter(e=>!(e.score<t||o!=="all"&&e.cat!==o||n!=="all"&&e.type!==n||v!=="all"&&e.estado!==v)).sort((e,C)=>C.score-e.score);G.forEach(e=>{const C=document.getElementById(`cm-badge-${e.key}`);if(!C)return;const L=c.filter(T=>e.key==="all"||T.cat===e.key),P=L.filter(T=>T.estado==="ready").length,S=L.filter(T=>T.score>=7).length;L.length>0&&S>0?(C.textContent=P>0?P:S,C.style.background=P>0?"var(--green)":"var(--text3)",C.style.display="inline"):C.style.display="none"});const h=document.getElementById("cm-results");if(!h)return;if(r.length===0){h.innerHTML=`<div class="sc2-empty">${c.length>0?"Ningún activo cumple los filtros actuales":"Pulsa Escanear para analizar el universo de commodities"}</div>`;return}const F=e=>e>=9?"var(--green)":e>=7?"var(--amber)":"var(--text3)",j={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},l=e=>e==="ready"?"var(--green)":e==="diario"?"var(--amber)":"var(--text3)";h.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${r.length} activos · <strong style="color:var(--green)">${r.filter(e=>e.estado==="ready").length} listos</strong>
        · ${r.filter(e=>e.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ACTIVO</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOLUMEN MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${r.map(e=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="font-size:20px;line-height:1;">${e.emoji}</div>
                  <div>
                    <div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;">
                      <span class="sc2-ticker">${e.ticker.replace("=F","")}</span>
                      <span class="cm-type-badge ${e.type==="futures"?"cm-type-futures":"cm-type-etf"}">${e.type==="futures"?"FUTURO":"ETF"}</span>
                    </div>
                    <div class="cm-name">${e.name}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:10px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${e.cat==="all"?"AMPLIO":e.cat.toUpperCase()}</td>
              <td class="sc2-score" style="color:${F(e.score)}">${e.score}/10</td>
              <td style="color:${l(e.estado)};font-size:10px;font-weight:600">${j[e.estado]||"—"}</td>
              <td class="sc2-price">${e.price?e.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${e.type==="futures"?e.avgVol11>=1e3?Math.round(e.avgVol11/1e3)+"k contratos":"—":e.avgVol11>=1e6?(e.avgVol11/1e6).toFixed(1)+"M":Math.round(e.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${e.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,h.querySelectorAll(".sc2-wl-btn").forEach(e=>{e.addEventListener("click",C=>{C.stopPropagation(),k(e.dataset.wl)})})}async function b(){if(d)return;d=!0,c=[];const t=document.getElementById("cm-scan-btn"),n=document.getElementById("cm-status"),v=document.getElementById("cm-progress"),r=document.getElementById("cm-progress-fill");t&&(t.disabled=!0,t.textContent="⏳ Escaneando..."),v&&(v.style.display="block"),r&&(r.style.width="0%");const h=await g(),F=6;let j=0;for(let l=0;l<h.length;l+=F){const w=h.slice(l,l+F);(await Promise.all(w.map(async x=>{try{const e=await q(x.ticker);return{...x,...W(e)}}catch{return null}}))).forEach(x=>{x&&c.push(x)}),j+=w.length,r&&(r.style.width=(j/h.length*100).toFixed(0)+"%"),n&&(n.textContent=`${h[Math.min(l+F-1,h.length-1)].ticker} (${j}/${h.length})`),i(),await new Promise(x=>setTimeout(x,300))}d=!1,t&&(t.disabled=!1,t.textContent="↻ Re-escanear"),v&&(v.style.display="none"),n&&(n.textContent=`${c.length} activos · ${c.filter(l=>l.estado==="ready").length} listos`),i(),V("alc-com-screener",{scanResults:c})}return s.querySelectorAll(".cm-tab").forEach(t=>{t.addEventListener("click",()=>{o=t.dataset.cat,s.querySelectorAll(".cm-tab").forEach(n=>n.classList.remove("active")),t.classList.add("active"),i()})}),["cm-filter-score","cm-filter-tipo","cm-filter-estado"].forEach(t=>{var n;(n=document.getElementById(t))==null||n.addEventListener("change",i)}),(E=document.getElementById("cm-add-btn"))==null||E.addEventListener("click",()=>{var n,v;const t=document.getElementById("cm-add-preview");t&&(t.innerHTML=`
      <div style="background:var(--surface);border:1px solid var(--border2);border-radius:8px;padding:14px 16px;margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <input type="text" id="cm-add-input" class="wl-input" placeholder="Ticker (ej. 3GOL.MI, PDBC...)" style="width:200px;text-transform:uppercase;">
        <select id="cm-add-cat" class="wl-input" style="width:160px;">
          <option value="metales">Metales</option>
          <option value="energia">Energía</option>
          <option value="industriales">Industriales</option>
          <option value="agricultura">Agricultura</option>
          <option value="custom">Otro</option>
        </select>
        <button class="btn btn-primary" id="cm-add-search">Buscar</button>
        <button class="btn" id="cm-add-cancel">✕</button>
        <div id="cm-add-result" style="width:100%;font-size:11px;"></div>
      </div>`,(n=document.getElementById("cm-add-cancel"))==null||n.addEventListener("click",()=>{t.innerHTML=""}),(v=document.getElementById("cm-add-search"))==null||v.addEventListener("click",async()=>{var F,j;const r=(F=document.getElementById("cm-add-input"))==null?void 0:F.value.trim().toUpperCase();if(!r)return;const h=document.getElementById("cm-add-result");h.innerHTML='<span style="color:var(--text3);">Buscando...</span>';try{const l=await y(r);h.innerHTML=`
          <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface2);padding:10px 12px;border-radius:6px;">
            <div>
              <strong>${l.ticker}</strong> — ${l.name}
              <span style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-left:8px;">${l.price?"$"+l.price.toFixed(2):""} ${l.currency}</span>
            </div>
            <button class="btn btn-primary" id="cm-add-confirm">+ Añadir al universo</button>
          </div>`,(j=document.getElementById("cm-add-confirm"))==null||j.addEventListener("click",async()=>{var e;const w=((e=document.getElementById("cm-add-cat"))==null?void 0:e.value)||"custom",O=await a();O.find(C=>(C.ticker||C)===l.ticker)||(O.push({ticker:l.ticker,name:l.name,category:w}),await f(O));const x=document.getElementById("cm-universe-count");x&&(x.textContent=(await g()).length+" activos"),t.innerHTML=`<div style="background:rgba(64,217,192,0.08);border:1px solid rgba(64,217,192,0.25);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:11px;color:var(--teal);">✓ ${l.ticker} añadido al universo · Lanza un nuevo escaneo para incluirlo</div>`,setTimeout(()=>{t.innerHTML=""},4e3)})}catch(l){h.innerHTML=`<span style="color:var(--red);">⚠ ${l.message}</span>`}}))}),(I=document.getElementById("cm-scan-btn"))==null||I.addEventListener("click",b),(($=m==null?void 0:m.scanResults)==null?void 0:$.length)>0&&(i==null||i()),{destroy(){}}}export{Y as render};
