const F=[{ticker:"GC=F",name:"Oro",cat:"metales",type:"futures",emoji:"🥇"},{ticker:"GLD",name:"Oro · SPDR Gold Trust",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"IAU",name:"Oro · iShares Gold ETF",cat:"metales",type:"etf",emoji:"🥇"},{ticker:"SI=F",name:"Plata",cat:"metales",type:"futures",emoji:"🥈"},{ticker:"SLV",name:"Plata · iShares Silver",cat:"metales",type:"etf",emoji:"🥈"},{ticker:"PL=F",name:"Platino",cat:"metales",type:"futures",emoji:"⬜"},{ticker:"PA=F",name:"Paladio",cat:"metales",type:"futures",emoji:"🔘"},{ticker:"PPLT",name:"Platino · Sprott ETF",cat:"metales",type:"etf",emoji:"⬜"},{ticker:"CL=F",name:"Petróleo WTI",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"BZ=F",name:"Petróleo Brent",cat:"energia",type:"futures",emoji:"🛢️"},{ticker:"USO",name:"Petróleo · US Oil Fund",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"UCO",name:"Petróleo · ProShares 2x",cat:"energia",type:"etf",emoji:"🛢️"},{ticker:"NG=F",name:"Gas Natural",cat:"energia",type:"futures",emoji:"🔥"},{ticker:"UNG",name:"Gas Natural · US Fund",cat:"energia",type:"etf",emoji:"🔥"},{ticker:"RB=F",name:"Gasolina RBOB",cat:"energia",type:"futures",emoji:"⛽"},{ticker:"HO=F",name:"Gasóleo / Fuel Oil",cat:"energia",type:"futures",emoji:"🏭"},{ticker:"HG=F",name:"Cobre",cat:"industriales",type:"futures",emoji:"🟤"},{ticker:"CPER",name:"Cobre · US Copper ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"COPX",name:"Cobre · Mineras ETF",cat:"industriales",type:"etf",emoji:"🟤"},{ticker:"ALI=F",name:"Aluminio",cat:"industriales",type:"futures",emoji:"🔩"},{ticker:"ZNC=F",name:"Zinc",cat:"industriales",type:"futures",emoji:"⚙️"},{ticker:"ZW=F",name:"Trigo",cat:"agricultura",type:"futures",emoji:"🌾"},{ticker:"WEAT",name:"Trigo · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌾"},{ticker:"ZC=F",name:"Maíz",cat:"agricultura",type:"futures",emoji:"🌽"},{ticker:"CORN",name:"Maíz · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🌽"},{ticker:"ZS=F",name:"Soja",cat:"agricultura",type:"futures",emoji:"🫘"},{ticker:"SOYB",name:"Soja · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🫘"},{ticker:"SB=F",name:"Azúcar",cat:"agricultura",type:"futures",emoji:"🍬"},{ticker:"CANE",name:"Azúcar · Teucrium ETF",cat:"agricultura",type:"etf",emoji:"🍬"},{ticker:"KC=F",name:"Café",cat:"agricultura",type:"futures",emoji:"☕"},{ticker:"JO",name:"Café · iPath ETF",cat:"agricultura",type:"etf",emoji:"☕"},{ticker:"CC=F",name:"Cacao",cat:"agricultura",type:"futures",emoji:"🍫"},{ticker:"NIB",name:"Cacao · iPath ETF",cat:"agricultura",type:"etf",emoji:"🍫"},{ticker:"CT=F",name:"Algodón",cat:"agricultura",type:"futures",emoji:"🤍"},{ticker:"LE=F",name:"Ganado Bovino",cat:"agricultura",type:"futures",emoji:"🐄"},{ticker:"HE=F",name:"Cerdos",cat:"agricultura",type:"futures",emoji:"🐷"},{ticker:"GSG",name:"Commodities · iShares S&P",cat:"all",type:"etf",emoji:"🌐"},{ticker:"PDBC",name:"Commodities · Invesco",cat:"all",type:"etf",emoji:"🌐"},{ticker:"DJP",name:"Commodities · iPath",cat:"all",type:"etf",emoji:"🌐"},{ticker:"COMT",name:"Commodities · iShares GSCI",cat:"all",type:"etf",emoji:"🌐"}],G=[{key:"all",label:"Todos",emoji:"🌐"},{key:"metales",label:"Metales Preciosos",emoji:"🥇"},{key:"energia",label:"Energía",emoji:"⚡"},{key:"industriales",label:"Met. Industriales",emoji:"⚙️"},{key:"agricultura",label:"Agricultura",emoji:"🌾"}],N=11,V=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`,o=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(o)}`];async function H(o){var r,m,d,a,y,s,e;const p=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=10y&events=history`;for(const l of V)try{const n=await fetch(l(p),{signal:AbortSignal.timeout(8e3)});if(!n.ok)continue;const c=await n.text();let i;try{i=JSON.parse(c)}catch{continue}const f=(m=(r=i==null?void 0:i.chart)==null?void 0:r.result)==null?void 0:m[0];if(!f)continue;const u=(a=(d=f.indicators)==null?void 0:d.quote)==null?void 0:a[0];if(!u)continue;const v=((e=(s=(y=f.indicators)==null?void 0:y.adjclose)==null?void 0:s[0])==null?void 0:e.adjclose)||u.close,k=v.map((g,h)=>u.close[h]&&g?g/u.close[h]:1);return{timestamps:f.timestamp,opens:u.open.map((g,h)=>g*k[h]),highs:u.high.map((g,h)=>g*k[h]),lows:u.low.map((g,h)=>g*k[h]),closes:v,vols:u.volume}}catch{}throw new Error("Sin datos")}function S(o,p){const r=2/(p+1),m=new Array(o.length).fill(null);let d=o.findIndex(a=>a!=null&&!isNaN(a));if(d<0)return m;m[d]=o[d];for(let a=d+1;a<o.length;a++){const y=o[a]!=null&&!isNaN(o[a])?o[a]:m[a-1];m[a]=y*r+m[a-1]*(1-r)}return m}function x(o){const p=S(o,12),r=S(o,26),m=p.map((d,a)=>d!=null&&r[a]!=null?d-r[a]:null);return{m,sl:S(m.map(d=>d??0),9)}}function $(o,p=14){const r=new Array(o.length).fill(null);if(o.length<p+1)return r;let m=0,d=0;for(let s=1;s<=p;s++){const e=o[s]-o[s-1];e>0?m+=e:d-=e}let a=m/p,y=d/p;r[p]=y===0?100:100-100/(1+a/y);for(let s=p+1;s<o.length;s++){const e=o[s]-o[s-1];a=(a*(p-1)+(e>0?e:0))/p,y=(y*(p-1)+(e<0?-e:0))/p,r[s]=y===0?100:100-100/(1+a/y)}return r}function w(o,p,r,m){const d=r.map((y,s)=>{if(s<m-1)return null;const e=Math.max(...o.slice(s-m+1,s+1)),l=Math.min(...p.slice(s-m+1,s+1));return e===l?50:(y-l)/(e-l)*100}),a=S(d,3);return{k:a,d:S(a.map(y=>y??0),3)}}function D(o,p,r,m,d,a,y){const s={};o.forEach((l,n)=>{const c=new Date(l*1e3);let i;if(y==="W"){const f=c.getDay(),u=c.getDate()-f+(f===0?-6:1),v=new Date(+c);v.setDate(u),i=v.toISOString().slice(0,10)}else i=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`;s[i]?(s[i].h=Math.max(s[i].h,r[n]),s[i].l=Math.min(s[i].l,m[n]),s[i].c=d[n],s[i].v+=a[n]):s[i]={o:p[n],h:r[n],l:m[n],c:d[n],v:a[n]}});const e=Object.keys(s).sort();return{dates:e,opens:e.map(l=>s[l].o),highs:e.map(l=>s[l].h),lows:e.map(l=>s[l].l),closes:e.map(l=>s[l].c),vols:e.map(l=>s[l].v)}}function q(o){const{timestamps:p,opens:r,highs:m,lows:d,closes:a,vols:y}=o,s=a.length,e=y[s-1]||0,l=y.slice(-N).reduce((j,z)=>j+(z||0),0)/N,n=D(p,r,m,d,a,y,"W"),c=D(p,r,m,d,a,y,"M"),i=c.closes.length-1,f=n.closes.length-1,u=s-1,v=x(c.closes),k=w(c.highs,c.lows,c.closes,89),g=w(c.highs,c.lows,c.closes,8),h=$(c.closes),t=S(c.closes,10),E=x(n.closes),C=w(n.highs,n.lows,n.closes,89),T=$(n.closes),I=S(n.closes,20),b=x(a),U=$(a),P=[v.m[i]>0&&v.m[i]>v.sl[i],k.k[i]>80&&k.k[i]>k.d[i]||k.k[i]>92,h[i]>65,g.k[i]>78,t[i]&&c.closes[i]>t[i]],A=[E.m[f]>0&&E.m[f]>E.sl[f],C.k[f]>85&&C.k[f]>C.d[f]||C.k[f]>92,T[f]>67,I[f]&&n.closes[f]>I[f]],M=P.every(j=>j),R=A.every(j=>j),B=b.m[u]>b.sl[u]&&b.m[u-1]<=b.sl[u-1]&&U[u]>57&&b.m[u]>0,L=P.filter(j=>j).length+A.filter(j=>j).length+(B?1:0);let O="watching";return M&&R&&B?O="ready":M&&R?O="diario":L>=7&&(O="close"),{score:L,estado:O,price:a[u],lastVol:e,avgVol11:l}}async function W(o,{actionsSlot:p}){var s;let r=[],m=!1,d="all";p.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="cm-status" id="cm-status"></span>
      <button class="cm-scan-btn" id="cm-scan-btn">▶ Escanear</button>
    </div>
  `,o.innerHTML=`
    <div class="cm-wrap">
      <div class="cm-tabs">
        ${G.map((e,l)=>`
          <button class="cm-tab ${l===0?"active":""}" data-cat="${e.key}">
            ${e.emoji} ${e.label}
            <span class="cm-tab-badge" id="cm-badge-${e.key}"></span>
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
  `;function a(){var k,g,h;const e=parseInt(((k=document.getElementById("cm-filter-score"))==null?void 0:k.value)||"7"),l=((g=document.getElementById("cm-filter-tipo"))==null?void 0:g.value)||"all",n=((h=document.getElementById("cm-filter-estado"))==null?void 0:h.value)||"all",c=r.filter(t=>!(t.score<e||d!=="all"&&t.cat!==d||l!=="all"&&t.type!==l||n!=="all"&&t.estado!==n)).sort((t,E)=>E.score-t.score);G.forEach(t=>{const E=document.getElementById(`cm-badge-${t.key}`);if(!E)return;const C=r.filter(b=>t.key==="all"||b.cat===t.key),T=C.filter(b=>b.estado==="ready").length,I=C.filter(b=>b.score>=7).length;C.length>0&&I>0?(E.textContent=T>0?T:I,E.style.background=T>0?"var(--green)":"var(--text3)",E.style.display="inline"):E.style.display="none"});const i=document.getElementById("cm-results");if(!i)return;if(c.length===0){i.innerHTML=`<div class="sc2-empty">${r.length>0?"Ningún activo cumple los filtros actuales":"Pulsa Escanear para analizar el universo de commodities"}</div>`;return}const f=t=>t>=9?"var(--green)":t>=7?"var(--amber)":"var(--text3)",u={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},v=t=>t==="ready"?"var(--green)":t==="diario"?"var(--amber)":"var(--text3)";i.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${c.length} activos · <strong style="color:var(--green)">${c.filter(t=>t.estado==="ready").length} listos</strong>
        · ${c.filter(t=>t.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ACTIVO</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOLUMEN MEDIA 11s</th></tr>
        </thead>
        <tbody>
          ${c.map(t=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="font-size:20px;line-height:1;">${t.emoji}</div>
                  <div>
                    <div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;">
                      <span class="sc2-ticker">${t.ticker.replace("=F","")}</span>
                      <span class="cm-type-badge ${t.type==="futures"?"cm-type-futures":"cm-type-etf"}">${t.type==="futures"?"FUTURO":"ETF"}</span>
                    </div>
                    <div class="cm-name">${t.name}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:10px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${t.cat==="all"?"AMPLIO":t.cat.toUpperCase()}</td>
              <td class="sc2-score" style="color:${f(t.score)}">${t.score}/10</td>
              <td style="color:${v(t.estado)};font-size:10px;font-weight:600">${u[t.estado]||"—"}</td>
              <td class="sc2-price">${t.price?t.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${t.type==="futures"?t.avgVol11>=1e3?Math.round(t.avgVol11/1e3)+"k contratos":"—":t.avgVol11>=1e6?(t.avgVol11/1e6).toFixed(1)+"M":Math.round(t.avgVol11/1e3)+"k"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}async function y(){if(m)return;m=!0,r=[];const e=document.getElementById("cm-scan-btn"),l=document.getElementById("cm-status"),n=document.getElementById("cm-progress"),c=document.getElementById("cm-progress-fill");e&&(e.disabled=!0,e.textContent="⏳ Escaneando..."),n&&(n.style.display="block"),c&&(c.style.width="0%");const i=6;let f=0;for(let u=0;u<F.length;u+=i){const v=F.slice(u,u+i);(await Promise.all(v.map(async g=>{try{const h=await H(g.ticker);return{...g,...q(h)}}catch{return null}}))).forEach(g=>{g&&r.push(g)}),f+=v.length,c&&(c.style.width=(f/F.length*100).toFixed(0)+"%"),l&&(l.textContent=`${F[Math.min(u+i-1,F.length-1)].ticker} (${f}/${F.length})`),a(),await new Promise(g=>setTimeout(g,300))}m=!1,e&&(e.disabled=!1,e.textContent="↻ Re-escanear"),n&&(n.style.display="none"),l&&(l.textContent=`${r.length} activos · ${r.filter(u=>u.estado==="ready").length} listos`),a()}return o.querySelectorAll(".cm-tab").forEach(e=>{e.addEventListener("click",()=>{d=e.dataset.cat,o.querySelectorAll(".cm-tab").forEach(l=>l.classList.remove("active")),e.classList.add("active"),a()})}),["cm-filter-score","cm-filter-tipo","cm-filter-estado"].forEach(e=>{var l;(l=document.getElementById(e))==null||l.addEventListener("change",a)}),(s=document.getElementById("cm-scan-btn"))==null||s.addEventListener("click",y),{destroy(){}}}export{W as render};
