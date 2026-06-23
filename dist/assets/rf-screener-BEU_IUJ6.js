const A=[{ticker:"TLT",name:"Bonos Tesoro USA 20+ años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEF",name:"Bonos Tesoro USA 7-10 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SHY",name:"Bonos Tesoro USA 1-3 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"IEI",name:"Bonos Tesoro USA 3-7 años",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"GOVT",name:"Bonos Gobierno USA (todos)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"TIP",name:"Bonos TIPS (inflación USA)",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SCHP",name:"TIPS Schwab",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGIT",name:"Bonos Gobierno USA 5-10a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"VGLT",name:"Bonos Gobierno USA 25+a",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"SPTL",name:"Bonos Largo Plazo SPDR",cat:"gov-usa",emoji:"🇺🇸"},{ticker:"LQD",name:"Bonos Corp. Investment Grade",cat:"corp-usa",emoji:"🏢"},{ticker:"VCIT",name:"Bonos Corp. Medio Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"VCLT",name:"Bonos Corp. Largo Plazo",cat:"corp-usa",emoji:"🏢"},{ticker:"USIG",name:"Bonos Corp. IG USA",cat:"corp-usa",emoji:"🏢"},{ticker:"IGSB",name:"Bonos Corp. Corto Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"IGIB",name:"Bonos Corp. Medio Plazo IG",cat:"corp-usa",emoji:"🏢"},{ticker:"HYG",name:"High Yield Corporativo iShares",cat:"high-yield",emoji:"⚡"},{ticker:"JNK",name:"High Yield SPDR",cat:"high-yield",emoji:"⚡"},{ticker:"USHY",name:"High Yield USA iShares",cat:"high-yield",emoji:"⚡"},{ticker:"HYLD",name:"High Yield Activo",cat:"high-yield",emoji:"⚡"},{ticker:"ANGL",name:"Fallen Angels USD Bond",cat:"high-yield",emoji:"⚡"},{ticker:"BNDX",name:"Bonos Internacionales Vanguard",cat:"intl",emoji:"🌍"},{ticker:"BWX",name:"Bonos Gobierno Internac.",cat:"intl",emoji:"🌍"},{ticker:"EMB",name:"Bonos Emergentes USD iShares",cat:"intl",emoji:"🌍"},{ticker:"PCY",name:"Bonos Emergentes USD Invesco",cat:"intl",emoji:"🌍"},{ticker:"VWOB",name:"Bonos Emergentes Vanguard",cat:"intl",emoji:"🌍"},{ticker:"IGOV",name:"Bonos Gobierno DM iShares",cat:"intl",emoji:"🌍"},{ticker:"IAGG",name:"Bonos Agregado Intl. iShares",cat:"intl",emoji:"🌍"},{ticker:"BND",name:"Agregado USA Vanguard",cat:"broad",emoji:"📊"},{ticker:"AGG",name:"Agregado USA iShares",cat:"broad",emoji:"📊"},{ticker:"FBND",name:"Agregado USA Fidelity",cat:"broad",emoji:"📊"},{ticker:"SCHZ",name:"Agregado USA Schwab",cat:"broad",emoji:"📊"},{ticker:"SPAB",name:"Agregado USA SPDR",cat:"broad",emoji:"📊"},{ticker:"SHV",name:"Letras Tesoro USA <1 año",cat:"short",emoji:"💵"},{ticker:"BIL",name:"T-Bills 1-3 meses",cat:"short",emoji:"💵"},{ticker:"SGOV",name:"T-Bills 0-3 meses iShares",cat:"short",emoji:"💵"},{ticker:"CLTL",name:"Tesoro Corto Plazo Invesco",cat:"short",emoji:"💵"},{ticker:"MINT",name:"Money Market PIMCO",cat:"short",emoji:"💵"}],D=[{key:"all",label:"Todos",emoji:"📋"},{key:"gov-usa",label:"Gobierno USA",emoji:"🇺🇸"},{key:"corp-usa",label:"Corporativo USA",emoji:"🏢"},{key:"high-yield",label:"High Yield",emoji:"⚡"},{key:"intl",label:"Internacional",emoji:"🌍"},{key:"broad",label:"Agregados",emoji:"📊"},{key:"short",label:"Corto Plazo",emoji:"💵"}],M=11,F=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`,o=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(o)}`];async function z(o){var n,d,h,s,f,a,t;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=10y&events=history`;for(const i of F)try{const r=await fetch(i(c),{signal:AbortSignal.timeout(8e3)});if(!r.ok)continue;const m=await r.text();let l;try{l=JSON.parse(m)}catch{continue}const u=(d=(n=l==null?void 0:l.chart)==null?void 0:n.result)==null?void 0:d[0];if(!u)continue;const g=(s=(h=u.indicators)==null?void 0:h.quote)==null?void 0:s[0];if(!g)continue;const v=((t=(a=(f=u.indicators)==null?void 0:f.adjclose)==null?void 0:a[0])==null?void 0:t.adjclose)||g.close,y=v.map((p,e)=>g.close[e]&&p?p/g.close[e]:1);return{timestamps:u.timestamp,opens:g.open.map((p,e)=>p*y[e]),highs:g.high.map((p,e)=>p*y[e]),lows:g.low.map((p,e)=>p*y[e]),closes:v,vols:g.volume}}catch{}throw new Error("Sin datos")}function j(o,c){const n=2/(c+1),d=new Array(o.length).fill(null);let h=o.findIndex(s=>s!=null&&!isNaN(s));if(h<0)return d;d[h]=o[h];for(let s=h+1;s<o.length;s++){const f=o[s]!=null&&!isNaN(o[s])?o[s]:d[s-1];d[s]=f*n+d[s-1]*(1-n)}return d}function C(o){const c=j(o,12),n=j(o,26),d=c.map((h,s)=>h!=null&&n[s]!=null?h-n[s]:null);return{m:d,sl:j(d.map(h=>h??0),9)}}function $(o,c=14){const n=new Array(o.length).fill(null);if(o.length<c+1)return n;let d=0,h=0;for(let a=1;a<=c;a++){const t=o[a]-o[a-1];t>0?d+=t:h-=t}let s=d/c,f=h/c;n[c]=f===0?100:100-100/(1+s/f);for(let a=c+1;a<o.length;a++){const t=o[a]-o[a-1];s=(s*(c-1)+(t>0?t:0))/c,f=(f*(c-1)+(t<0?-t:0))/c,n[a]=f===0?100:100-100/(1+s/f)}return n}function x(o,c,n,d){const h=n.map((f,a)=>{if(a<d-1)return null;const t=Math.max(...o.slice(a-d+1,a+1)),i=Math.min(...c.slice(a-d+1,a+1));return t===i?50:(f-i)/(t-i)*100}),s=j(h,3);return{k:s,d:j(s.map(f=>f??0),3)}}function V(o,c,n,d,h,s,f){const a={};o.forEach((i,r)=>{const m=new Date(i*1e3);let l;if(f==="W"){const u=m.getDay(),g=m.getDate()-u+(u===0?-6:1),v=new Date(+m);v.setDate(g),l=v.toISOString().slice(0,10)}else l=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}`;a[l]?(a[l].h=Math.max(a[l].h,n[r]),a[l].l=Math.min(a[l].l,d[r]),a[l].c=h[r],a[l].v+=s[r]):a[l]={o:c[r],h:n[r],l:d[r],c:h[r],v:s[r]}});const t=Object.keys(a).sort();return{dates:t,opens:t.map(i=>a[i].o),highs:t.map(i=>a[i].h),lows:t.map(i=>a[i].l),closes:t.map(i=>a[i].c),vols:t.map(i=>a[i].v)}}function Y(o){const{timestamps:c,opens:n,highs:d,lows:h,closes:s,vols:f}=o,a=s.length,t=f[a-1]||0,i=f.slice(-M).reduce((S,N)=>S+(N||0),0)/M,r=V(c,n,d,h,s,f,"W"),m=V(c,n,d,h,s,f,"M"),l=m.closes.length-1,u=r.closes.length-1,g=a-1,v=C(m.closes),y=x(m.highs,m.lows,m.closes,89),p=x(m.highs,m.lows,m.closes,8),e=$(m.closes),k=j(m.closes,10),E=C(r.closes),b=x(r.highs,r.lows,r.closes,89),T=$(r.closes),I=j(r.closes,20),B=C(s),H=$(s),L=[v.m[l]>0&&v.m[l]>v.sl[l],y.k[l]>80&&y.k[l]>y.d[l]||y.k[l]>92,e[l]>65,p.k[l]>78,k[l]&&m.closes[l]>k[l]],O=[E.m[u]>0&&E.m[u]>E.sl[u],b.k[u]>85&&b.k[u]>b.d[u]||b.k[u]>92,T[u]>67,I[u]&&r.closes[u]>I[u]],G=L.every(S=>S),P=O.every(S=>S),U=B.m[g]>B.sl[g]&&B.m[g-1]<=B.sl[g-1]&&H[g]>57&&B.m[g]>0,R=L.filter(S=>S).length+O.filter(S=>S).length+(U?1:0);let w="watching";return G&&P&&U?w="ready":G&&P?w="diario":R>=7&&(w="close"),{score:R,estado:w,price:s[g],lastVol:t,avgVol11:i}}function _(o){try{const c=JSON.parse(localStorage.getItem("ethan_watchlist_rf_v1")||"[]");c.includes(o)||(c.push(o),localStorage.setItem("ethan_watchlist_rf_v1",JSON.stringify(c)));const n=document.querySelector(`[data-wl="${o}"]`);n&&(n.textContent="✓",n.style.color="var(--green)",n.disabled=!0)}catch{}}async function q(o,{actionsSlot:c}){var a;let n=[],d=!1,h="all";c.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="cm-status" id="rf-status"></span>
      <button class="cm-scan-btn" id="rf-scan-btn">▶ Escanear</button>
    </div>
  `,o.innerHTML=`
    <div class="cm-wrap">
      <div class="cm-tabs">
        ${D.map((t,i)=>`
          <button class="cm-tab ${i===0?"active":""}" data-cat="${t.key}">
            ${t.emoji} ${t.label}
            <span class="cm-tab-badge" id="rf-badge-${t.key}"></span>
          </button>
        `).join("")}
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
        <div class="sc2-empty">Pulsa Escanear para analizar ${A.length} ETFs de Renta Fija</div>
      </div>
    </div>
  `;function s(){var y,p;const t=parseInt(((y=document.getElementById("rf-filter-score"))==null?void 0:y.value)||"7"),i=((p=document.getElementById("rf-filter-estado"))==null?void 0:p.value)||"all",r=n.filter(e=>!(e.score<t||h!=="all"&&e.cat!==h||i!=="all"&&e.estado!==i)).sort((e,k)=>k.score-e.score);D.forEach(e=>{const k=document.getElementById(`rf-badge-${e.key}`);if(!k)return;const E=n.filter(I=>e.key==="all"||I.cat===e.key),b=E.filter(I=>I.estado==="ready").length,T=E.filter(I=>I.score>=7).length;T>0?(k.textContent=b>0?b:T,k.style.background=b>0?"var(--green)":"var(--text3)",k.style.display="inline"):k.style.display="none"});const m=document.getElementById("rf-results");if(!m)return;if(r.length===0){m.innerHTML=`<div class="sc2-empty">${n.length>0?"Ningún ETF cumple los filtros actuales":"Pulsa Escanear para analizar el universo de Renta Fija"}</div>`;return}const l=e=>e>=9?"var(--green)":e>=7?"var(--amber)":"var(--text3)",u={ready:"🟢 LISTO",diario:"⏳ ESPERA DIARIO",close:"🔶 CERCA",watching:"👁 VIGILANDO"},g=e=>e==="ready"?"var(--green)":e==="diario"?"var(--amber)":"var(--text3)",v={"gov-usa":"GOB. USA","corp-usa":"CORP. USA","high-yield":"HIGH YIELD",intl:"INTL.",broad:"AGREGADO",short:"CORTO PLAZO"};m.innerHTML=`
      <div style="font-size:11px;color:var(--text2);padding:6px 0 10px;border-bottom:1px solid var(--border);margin-bottom:4px;">
        ${r.length} ETFs · <strong style="color:var(--green)">${r.filter(e=>e.estado==="ready").length} listos</strong>
        · ${r.filter(e=>e.estado==="diario").length} espera diario
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>ETF</th><th>CATEGORÍA</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${r.map(e=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="font-size:18px;line-height:1;">${e.emoji}</div>
                  <div>
                    <div class="sc2-ticker">${e.ticker}</div>
                    <div class="cm-name">${e.name}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:9.5px;color:var(--text3);text-transform:uppercase;font-family:var(--mono)">${v[e.cat]||e.cat}</td>
              <td class="sc2-score" style="color:${l(e.score)}">${e.score}/10</td>
              <td style="color:${g(e.estado)};font-size:10px;font-weight:600">${u[e.estado]||"—"}</td>
              <td class="sc2-price">${e.price?"$"+e.price.toFixed(2):"—"}</td>
              <td class="sc2-vol">${e.avgVol11>=1e6?(e.avgVol11/1e6).toFixed(1)+"M":Math.round(e.avgVol11/1e3)+"k"}</td>
              <td><button class="sc2-wl-btn" data-wl="${e.ticker}">+ WL</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,m.querySelectorAll(".sc2-wl-btn").forEach(e=>{e.addEventListener("click",k=>{k.stopPropagation(),_(e.dataset.wl)})})}async function f(){if(d)return;d=!0,n=[];const t=document.getElementById("rf-scan-btn"),i=document.getElementById("rf-status"),r=document.getElementById("rf-progress"),m=document.getElementById("rf-progress-fill");t&&(t.disabled=!0,t.textContent="⏳ Escaneando..."),r&&(r.style.display="block"),m&&(m.style.width="0%");const l=6;let u=0;for(let g=0;g<A.length;g+=l){const v=A.slice(g,g+l);(await Promise.all(v.map(async p=>{try{const e=await z(p.ticker);return{...p,...Y(e)}}catch{return null}}))).forEach(p=>{p&&n.push(p)}),u+=v.length,m&&(m.style.width=(u/A.length*100).toFixed(0)+"%"),i&&(i.textContent=`${A[Math.min(g+l-1,A.length-1)].ticker} (${u}/${A.length})`),s(),await new Promise(p=>setTimeout(p,300))}d=!1,t&&(t.disabled=!1,t.textContent="↻ Re-escanear"),r&&(r.style.display="none"),i&&(i.textContent=`${n.length} ETFs · ${n.filter(g=>g.estado==="ready").length} listos`),s()}return o.querySelectorAll(".cm-tab").forEach(t=>{t.addEventListener("click",()=>{h=t.dataset.cat,o.querySelectorAll(".cm-tab").forEach(i=>i.classList.remove("active")),t.classList.add("active"),s()})}),["rf-filter-score","rf-filter-estado"].forEach(t=>{var i;(i=document.getElementById(t))==null||i.addEventListener("change",s)}),(a=document.getElementById("rf-scan-btn"))==null||a.addEventListener("click",f),{destroy(){}}}export{q as render};
