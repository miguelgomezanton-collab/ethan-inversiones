import{U as N}from"./userdata-n3nGJAZW.js";import"./index-xG_i8sKu.js";const F=[{ticker:"GC=F",name:"Oro",cat:"metales",type:"futures",emoji:"🥇"},{ticker:"GLD",name:"Oro · SPDR Gold Trust",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"IAU",name:"Oro · iShares Gold ETF",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"SI=F",name:"Plata",cat:"metales",type:"futures",emoji:"🥈"},{ticker:"SLV",name:"Plata · iShares Silver",cat:"metales",type:"etf",emoji:"🥈"},{ticker:"PL=F",name:"Platino",cat:"metales",type:"futures",emoji:"⬜"},{ticker:"PA=F",name:"Paladio",cat:"metales",type:"futures",emoji:"🔘"},{ticker:"PPLT",name:"Platino · Sprott ETF",cat:"metales",type:"etf",emoji:"⬜"},{ticker:"CL=F",name:"Petróleo WTI",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"BZ=F",name:"Petróleo Brent",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"USO",name:"Petróleo · US Oil Fund",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"UCO",name:"Petróleo · ProShares 2x",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"NG=F",name:"Gas Natural",cat:"energia",type:"futures",emoji:"🔥"},{ticker:"UNG",name:"Gas Natural · US Fund",cat:"energia",type:"etf",emoji:"🔥"},{ticker:"RB=F",name:"Gasolina RBOB",cat:"energia",type:"futures",emoji:"⛽"},{ticker:"HO=F",name:"Gasóleo / Fuel Oil",cat:"energia",type:"futures",emoji:"🏭"},{ticker:"HG=F",name:"Cobre",cat:"industriales",type:"futures",emoji:"🟤"},{ticker:"CPER",name:"Cobre · US Copper ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"COPX",name:"Cobre · Mineras ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"ALI=F",name:"Aluminio",cat:"industriales",type:"futures",emoji:"🔩"},{ticker:"ZNC=F",name:"Zinc",cat:"industriales",type:"futures",emoji:"⚙️"},{ticker:"ZW=F",name:"Trigo",cat:"agricultura",type:"futures",emoji:"🌾"},{ticker:"WEAT",name:"Trigo · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌾"},{ticker:"ZC=F",name:"Maíz",cat:"agricultura",type:"futures",emoji:"🌽"},{ticker:"CORN",name:"Maíz · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌽"},{ticker:"ZS=F",name:"Soja",cat:"agricultura",type:"futures",emoji:"🫘"},{ticker:"SOYB",name:"Soja · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🫘"},{ticker:"SB=F",name:"Azúcar",cat:"agricultura",type:"futures",emoji:"🍬"},{ticker:"CANE",name:"Azúcar · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🍬"},{ticker:"KC=F",name:"Café",cat:"agricultura",type:"futures",emoji:"☕"},{ticker:"JO",name:"Café · iPath ETF",cat:"agricultura",type:"etf",emoji:"☕"},{ticker:"CC=F",name:"Cacao",cat:"agricultura",type:"futures",emoji:"🍫"},{ticker:"NIB",name:"Cacao · iPath ETF",cat:"agricultura",type:"etf",emoji:"🍫"},{ticker:"CT=F",name:"Algodón",cat:"agricultura",type:"futures",emoji:"🤍"},{ticker:"LE=F",name:"Ganado Bovino",cat:"agricultura",type:"futures",emoji:"🐄"},{ticker:"HE=F",name:"Cerdos",cat:"agricultura",type:"futures",emoji:"🐷"},{ticker:"GSG",name:"Commodities · iShares S&P",cat:"all",type:"etf",emoji:"🌐"},{ticker:"PDBC",name:"Commodities · Invesco",cat:"all",type:"etf",emoji:"🌐"},{ticker:"DJP",name:"Commodities · iPath",cat:"all",type:"etf",emoji:"🌐"},{ticker:"COMT",name:"Commodities · iShares GSCI",cat:"all",type:"etf",emoji:"🌐"}],D=[{key:"all",label:"Todos",emoji:"🌐"},{key:"metales",label:"Metales Preciosos",emoji:"🥇"},{key:"energia",label:"Energía",emoji:"⚡"},{key:"industriales",label:"Met. Industriales",emoji:"⚙️"},{key:"agricultura",label:"Agricultura",emoji:"🌾"}],U=11,_=[i=>`https://api.allorigins.win/raw?url=${encodeURIComponent(i)}`,i=>`https://corsproxy.io/?${encodeURIComponent(i)}`,i=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(i)}`,i=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(i)}`];async function q(i){var c,r,u,l,d,s,p;const f=`https://query1.finance.yahoo.com/v8/finance/chart/${i}?interval=1d&range=10y&events=history`;for(const t of _)try{const a=await fetch(t(f),{signal:AbortSignal.timeout(8e3)});if(!a.ok)continue;const n=await a.text();let o;try{o=JSON.parse(n)}catch{continue}const m=(r=(c=o==null?void 0:o.chart)==null?void 0:c.result)==null?void 0:r[0];if(!m)continue;const y=(l=(u=m.indicators)==null?void 0:u.quote)==null?void 0:l[0];if(!y)continue;const h=((p=(s=(d=m.indicators)==null?void 0:d.adjclose)==null?void 0:s[0])==null?void 0:p.adjclose)||y.close,E=h.map((v,g)=>y.close[g]&&v?v/y.close[g]:1);return{timestamps:m.timestamp,opens:y.open.map((v,g)=>v*E[g]),highs:y.high.map((v,g)=>v*E[g]),lows:y.low.map((v,g)=>v*E[g]),closes:h,vols:y.volume}}catch{}throw new Error("Sin datos")}function T(i,f){const c=2/(f+1),r=new Array(i.length).fill(null);let u=i.findIndex(l=>l!=null&&!isNaN(l));if(u<0)return r;r[u]=i[u];for(let l=u+1;l<i.length;l++){const d=i[l]!=null&&!isNaN(i[l])?i[l]:r[l-1];r[l]=d*c+r[l-1]*(1-c)}return r}function O(i){const f=T(i,12),c=T(i,26),r=f.map((u,l)=>u!=null&&c[l]!=null?u-c[l]:null);return{m:r,sl:T(r.map(u=>u??0),9)}}function $(i,f=14){const c=new Array(i.length).fill(null);if(i.length<f+1)return c;let r=0,u=0;for(let s=1;s<=f;s++){const p=i[s]-i[s-1];p>0?r+=p:u-=p}let l=r/f,d=u/f;c[f]=d===0?100:100-100/(1+l/d);for(let s=f+1;s<i.length;s++){const p=i[s]-i[s-1];l=(l*(f-1)+(p>0?p:0))/f,d=(d*(f-1)+(p<0?-p:0))/f,c[s]=d===0?100:100-100/(1+l/d)}return c}function P(i,f,c,r){const u=c.map((d,s)=>{if(s<r-1)return null;const p=Math.max(...i.slice(s-r+1,s+1)),t=Math.min(...f.slice(s-r+1,s+1));return p===t?50:(d-t)/(p-t)*100}),l=T(u,3);return{k:l,d:T(l.map(d=>d??0),3)}}function z(i,f,c,r,u,l,d){const s={};i.forEach((t,a)=>{const n=new Date(t*1e3);let o;if(d==="W"){const m=n.getDay(),y=n.getDate()-m+(m===0?-6:1),h=new Date(+n);h.setDate(y),o=h.toISOString().slice(0,10)}else o=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;s[o]?(s[o].h=Math.max(s[o].h,c[a]),s[o].l=Math.min(s[o].l,r[a]),s[o].c=u[a],s[o].v+=l[a]):s[o]={o:f[a],h:c[a],l:r[a],c:u[a],v:l[a]}});const p=Object.keys(s).sort();return{dates:p,opens:p.map(t=>s[t].o),highs:p.map(t=>s[t].h),lows:p.map(t=>s[t].l),closes:p.map(t=>s[t].c),vols:p.map(t=>s[t].v)}}function H(i){const{timestamps:f,opens:c,highs:r,lows:u,closes:l,vols:d}=i,s=l.length,p=d[s-1]||0,t=d.slice(-U).reduce((b,V)=>b+(V||0),0)/U,a=z(f,c,r,u,l,d,"W"),n=z(f,c,r,u,l,d,"M"),o=n.closes.length-1,m=a.closes.length-1,y=s-1,h=O(n.closes),E=P(n.highs,n.lows,n.closes,89),v=P(n.highs,n.lows,n.closes,8),g=$(n.closes),C=T(n.closes,10),e=O(a.closes),k=P(a.highs,a.lows,a.closes,89),I=$(a.closes),w=T(a.closes,20),j=O(l),S=$(l),A=[h.m[o]>0&&h.m[o]>h.sl[o],E.k[o]>80&&E.k[o]>E.d[o]||E.k[o]>92,g[o]>65,v.k[o]>78,C[o]&&n.closes[o]>C[o]],M=[e.m[m]>0&&e.m[m]>e.sl[m],k.k[m]>85&&k.k[m]>k.d[m]||k.k[m]>92,I[m]>67,w[m]&&a.closes[m]>w[m]],L=A.every(b=>b),R=M.every(b=>b),B=j.m[y]>j.sl[y]&&j.m[y-1]<=j.sl[y-1]&&S[y]>57&&j.m[y]>0,G=A.filter(b=>b).length+M.filter(b=>b).length+(B?1:0);let x="watching";return L&&R&&B?x="ready":L&&R?x="diario":G>=7&&(x="close"),{score:G,estado:x,price:l[y],lastVol:p,avgVol11:t}}async function J(i,{actionsSlot:f}){var p;let c=[],r=!1,u="all";f.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="cm-status" id="cm-status"></span>
      <button class="cm-scan-btn" id="cm-scan-btn">▶ Escanear</button>
    </div>
  `,i.innerHTML=`
    <div class="cm-wrap">
      <div class="cm-tabs">
        ${D.map((t,a)=>`
          <button class="cm-tab ${a===0?"active":""}" data-cat="${t.key}">
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
        <div class="sc2-empty">Pulsa Escanear para analizar el universo de commodities (${F.length} activos)</div>
      </div>
    </div>
  `;async function l(t){try{const a=await N.get("ethan_watchlist_com_v1")||[];a.includes(t)||(a.push(t),await N.set("ethan_watchlist_com_v1",a));const n=document.querySelector(`[data-wl="${t}"]`);n&&(n.textContent="✓",n.style.color="var(--green)",n.disabled=!0)}catch{}}function d(){var v,g,C;const t=parseInt(((v=document.getElementById("cm-filter-score"))==null?void 0:v.value)||"7"),a=((g=document.getElementById("cm-filter-tipo"))==null?void 0:g.value)||"all",n=((C=document.getElementById("cm-filter-estado"))==null?void 0:C.value)||"all",o=c.filter(e=>!(e.score<t||u!=="all"&&e.cat!==u||a!=="all"&&e.type!==a||n!=="all"&&e.estado!==n)).sort((e,k)=>k.score-e.score);D.forEach(e=>{const k=document.getElementById(`cm-badge-${e.key}`);if(!k)return;const I=c.filter(S=>e.key==="all"||S.cat===e.key),w=I.filter(S=>S.estado==="ready").length,j=I.filter(S=>S.score>=7).length;I.length>0&&j>0?(k.textContent=w>0?w:j,k.style.background=w>0?"var(--green)":"var(--text3)",k.style.display="inline"):k.style.display="none"});const m=document.getElementById("cm-results");if(!m)return;if(o.length===0){m.innerHTML=`<div class="sc2-empty">${c.length>0?"Ningún activo cumple los filtros actuales":"Pulsa Escanear para analizar el universo de commodities"}</div>`;return}const y=e=>e>=9?"var(--green)":e>=7?"var(--amber)":"var(--text3)",h={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},E=e=>e==="ready"?"var(--green)":e==="diario"?"var(--amber)":"var(--text3)";m.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${o.length} activos · <strong style="color:var(--green)">${o.filter(e=>e.estado==="ready").length} listos</strong>
        · ${o.filter(e=>e.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ACTIVO</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOLUMEN MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${o.map(e=>`
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
              <td class="sc2-score" style="color:${y(e.score)}">${e.score}/10</td>
              <td style="color:${E(e.estado)};font-size:10px;font-weight:600">${h[e.estado]||"—"}</td>
              <td class="sc2-price">${e.price?e.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${e.type==="futures"?e.avgVol11>=1e3?Math.round(e.avgVol11/1e3)+"k contratos":"—":e.avgVol11>=1e6?(e.avgVol11/1e6).toFixed(1)+"M":Math.round(e.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${e.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,m.querySelectorAll(".sc2-wl-btn").forEach(e=>{e.addEventListener("click",k=>{k.stopPropagation(),l(e.dataset.wl)})})}async function s(){if(r)return;r=!0,c=[];const t=document.getElementById("cm-scan-btn"),a=document.getElementById("cm-status"),n=document.getElementById("cm-progress"),o=document.getElementById("cm-progress-fill");t&&(t.disabled=!0,t.textContent="⏳ Escaneando..."),n&&(n.style.display="block"),o&&(o.style.width="0%");const m=6;let y=0;for(let h=0;h<F.length;h+=m){const E=F.slice(h,h+m);(await Promise.all(E.map(async g=>{try{const C=await q(g.ticker);return{...g,...H(C)}}catch{return null}}))).forEach(g=>{g&&c.push(g)}),y+=E.length,o&&(o.style.width=(y/F.length*100).toFixed(0)+"%"),a&&(a.textContent=`${F[Math.min(h+m-1,F.length-1)].ticker} (${y}/${F.length})`),d(),await new Promise(g=>setTimeout(g,300))}r=!1,t&&(t.disabled=!1,t.textContent="↻ Re-escanear"),n&&(n.style.display="none"),a&&(a.textContent=`${c.length} activos · ${c.filter(h=>h.estado==="ready").length} listos`),d()}return i.querySelectorAll(".cm-tab").forEach(t=>{t.addEventListener("click",()=>{u=t.dataset.cat,i.querySelectorAll(".cm-tab").forEach(a=>a.classList.remove("active")),t.classList.add("active"),d()})}),["cm-filter-score","cm-filter-tipo","cm-filter-estado"].forEach(t=>{var a;(a=document.getElementById(t))==null||a.addEventListener("change",d)}),(p=document.getElementById("cm-scan-btn"))==null||p.addEventListener("click",s),{destroy(){}}}export{J as render};
