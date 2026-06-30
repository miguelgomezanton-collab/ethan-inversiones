import{U as O}from"./userdata-BhiQW5_g.js";import"./index-D7_8-KQu.js";const Y="ethan_positions",K="ethan_positions_history",V=[l=>`https://api.allorigins.win/raw?url=${encodeURIComponent(l)}`,l=>`https://corsproxy.io/?${encodeURIComponent(l)}`,l=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(l)}`,l=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(l)}`];async function Q(l){var v,u,b,d;const E=`https://query1.finance.yahoo.com/v8/finance/chart/${l}?interval=1d&range=1y&events=history`;for(const r of V)try{const $=await fetch(r(E),{signal:AbortSignal.timeout(8e3)});if(!$.ok)continue;const w=await $.text();let f;try{f=JSON.parse(w)}catch{continue}const D=(u=(v=f==null?void 0:f.chart)==null?void 0:v.result)==null?void 0:u[0];if(!D)continue;const S=(d=(b=D.indicators)==null?void 0:b.quote)==null?void 0:d[0];if(!S)continue;const k=D.meta||{};return{timestamps:D.timestamp,opens:S.open,highs:S.high,lows:S.low,closes:S.close,volumes:S.volume,name:k.shortName||k.longName||l,currency:k.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function J(l,E){const v=2/(E+1),u=new Array(l.length).fill(null);let b=l.findIndex(d=>d!=null&&!isNaN(d));if(b<0)return u;u[b]=l[b];for(let d=b+1;d<l.length;d++){const r=l[d]!=null&&!isNaN(l[d])?l[d]:u[d-1];u[d]=r*v+u[d-1]*(1-v)}return u}function Z(l,E,v,u,b,d){const r={};l.forEach((w,f)=>{const D=new Date(w*1e3),S=D.getDay(),k=D.getDate()-S+(S===0?-6:1),R=new Date(+D);R.setDate(k);const x=R.toISOString().slice(0,10);r[x]?(r[x].h=Math.max(r[x].h,v[f]),r[x].l=Math.min(r[x].l,u[f]),r[x].c=b[f],r[x].v+=d[f]):r[x]={o:E[f],h:v[f],l:u[f],c:b[f],v:d[f]}});const $=Object.keys(r).sort();return{opens:$.map(w=>r[w].o),highs:$.map(w=>r[w].h),lows:$.map(w=>r[w].l),closes:$.map(w=>r[w].c)}}function tt(l,E){const v=l.length;if(v<5)return!1;const u=v-1,b=v-2,d=v-3;let r=0;for(let $=Math.max(0,d-10);$<d;$++)r=Math.max(r,l[$]);return l[d]>r&&E[b]<l[d]&&E[u]<l[d]&&E[b]<E[d]&&E[u]<E[b]}function et(l,E){const{timestamps:v,opens:u,highs:b,lows:d,closes:r,volumes:$,name:w,currency:f}=E,D=r.length,S=D-1,k=r[S],x=J(r,10)[S],T=Z(v,u,b,d,r,$),_=J(T.closes,10)[T.closes.length-1],A=l.stopType==="manual"?l.stopManual:l.stopType==="semanal"?_:x,U=tt(b,r),t=(k-l.entry)/l.entry*100,a=(k-A)/k*100,s=k<=A*1.005;return{currentPrice:k,stopDiario:x,stopSemanal:_,activeStop:A,escapeFalso:U,tocoStop:s,pnlPct:t,distStop:a,name:w,currency:f}}async function it(l,{actionsSlot:E}){var U;let v=await O.get(Y)||[],u=await O.get(K)||[];E.innerHTML=`
    <button class="btn btn-primary" id="pos-open-form-btn">+ Nueva posición</button>
  `,l.innerHTML=`
    <div id="pos-form-panel" style="display:none;"></div>
    <div id="pos-list"></div>
  `;function b(){var a,s,e,c,i;const t=document.getElementById("pos-form-panel");t.style.display="block",t.innerHTML=`
      <div class="pos-form-card">
        <div class="pos-form-title">Nueva posición</div>

        <!-- Fila 1: Ticker + buscar + dirección -->
        <div class="pos-form-search">
          <div class="pos-form-field">
            <label>Dirección</label>
            <select id="pf-direction" class="sc2-sel" style="width:130px;">
              <option value="alcista">📈 Alcista (Long)</option>
              <option value="bajista">📉 Bajista (Short)</option>
            </select>
          </div>
          <div class="pos-form-field">
            <label>Ticker</label>
            <input type="text" id="pf-ticker" placeholder="AAPL, 3GOL..." class="wl-input" style="width:140px;text-transform:uppercase;" autocomplete="off">
          </div>
          <button class="btn btn-primary" id="pf-search-btn" style="margin-top:18px;">🔍 Buscar</button>
          <div id="pf-search-status" style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:22px;"></div>
        </div>

        <!-- Fila 2: Datos principales -->
        <div class="pos-form-grid">
          <div class="pos-form-field">
            <label>Precio entrada</label>
            <input type="number" id="pf-entry" placeholder="150.00" step="0.01" class="wl-input">
          </div>
          <div class="pos-form-field">
            <label>Nº acciones / participaciones</label>
            <input type="number" id="pf-shares" placeholder="100" step="1" class="wl-input">
          </div>
          <div class="pos-form-field">
            <label>Coste total inversión</label>
            <input type="number" id="pf-cost" placeholder="15000.00" step="0.01" class="wl-input" readonly style="opacity:0.7;">
            <div style="font-size:9px;color:var(--text3);margin-top:3px;font-family:var(--mono);">Se calcula automáticamente</div>
          </div>
          <div class="pos-form-field">
            <label>Fecha de entrada</label>
            <input type="date" id="pf-date" value="${new Date().toISOString().slice(0,10)}" class="wl-input">
          </div>
          <div class="pos-form-field">
            <label>Stop loss</label>
            <select id="pf-stop-type" class="sc2-sel" style="width:100%;">
              <option value="semanal">EMA10 Semanal (dinámico)</option>
              <option value="diario">EMA10 Diario (dinámico)</option>
              <option value="manual">Manual (precio fijo)</option>
            </select>
          </div>
          <div class="pos-form-field" id="pf-stop-manual-wrap" style="display:none;">
            <label>Stop loss manual</label>
            <input type="number" id="pf-stop-manual" placeholder="140.00" step="0.01" class="wl-input">
          </div>
        </div>

        <!-- Fila 3: Nombre manual (si no encuentra el ticker) -->
        <div class="pos-form-grid">
          <div class="pos-form-field" style="grid-column:1/3">
            <label>Nombre del activo <span style="color:var(--text3)">(opcional — se rellena automáticamente)</span></label>
            <input type="text" id="pf-name" placeholder="ej. WisdomTree Gold 3x Daily Leveraged" class="wl-input" style="width:100%;">
          </div>
          <div class="pos-form-field" style="grid-column:3/4">
            <label>Notas</label>
            <input type="text" id="pf-notas" placeholder="Motivo de entrada, contexto..." class="wl-input" style="width:100%;">
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
          <button class="btn" id="pf-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="pf-add-btn">+ Añadir a cartera</button>
        </div>
      </div>
    `,["pf-entry","pf-shares"].forEach(p=>{var n;(n=document.getElementById(p))==null||n.addEventListener("input",()=>{var g,P;const y=parseFloat(((g=document.getElementById("pf-entry"))==null?void 0:g.value)||0),o=parseFloat(((P=document.getElementById("pf-shares"))==null?void 0:P.value)||0);y>0&&o>0&&(document.getElementById("pf-cost").value=(y*o).toFixed(2))})}),(a=document.getElementById("pf-stop-type"))==null||a.addEventListener("change",p=>{document.getElementById("pf-stop-manual-wrap").style.display=p.target.value==="manual"?"block":"none"}),(s=document.getElementById("pf-search-btn"))==null||s.addEventListener("click",async()=>{var y,o,g,P;const p=(y=document.getElementById("pf-ticker"))==null?void 0:y.value.trim().toUpperCase();if(!p)return;const n=document.getElementById("pf-search-status");n.textContent="Buscando...",n.style.color="var(--text3)";try{const F=`https://query1.finance.yahoo.com/v8/finance/chart/${p}?interval=1d&range=5d`;let C=!1;for(const j of V)try{const B=await fetch(j(F),{signal:AbortSignal.timeout(6e3)});if(!B.ok)continue;const M=JSON.parse(await B.text()),L=(P=(g=(o=M==null?void 0:M.chart)==null?void 0:o.result)==null?void 0:g[0])==null?void 0:P.meta;if(!L)continue;const N=L.shortName||L.longName||p,I=L.regularMarketPrice;document.getElementById("pf-name").value=N,I&&!document.getElementById("pf-entry").value&&(document.getElementById("pf-entry").value=I.toFixed(2)),n.textContent=`✓ Encontrado: ${N}${I?" · $"+I.toFixed(2):""}`,n.style.color="var(--green)",C=!0;break}catch{}C||(n.textContent="⚠ No encontrado en Yahoo · puedes añadirlo manualmente",n.style.color="var(--amber)")}catch{n.textContent="⚠ Error de conexión · puedes añadirlo manualmente",n.style.color="var(--amber)"}}),(e=document.getElementById("pf-ticker"))==null||e.addEventListener("keydown",p=>{var n;p.key==="Enter"&&((n=document.getElementById("pf-search-btn"))==null||n.click()),p.target.value=p.target.value.toUpperCase()}),(c=document.getElementById("pf-cancel-btn"))==null||c.addEventListener("click",()=>{t.style.display="none"}),(i=document.getElementById("pf-add-btn"))==null||i.addEventListener("click",async()=>{var M,L,N,I,z,H,m,h,G,W;const p=((M=document.getElementById("pf-direction"))==null?void 0:M.value)||"alcista",n=(L=document.getElementById("pf-ticker"))==null?void 0:L.value.trim().toUpperCase(),y=parseFloat((N=document.getElementById("pf-entry"))==null?void 0:N.value),o=parseFloat((I=document.getElementById("pf-shares"))==null?void 0:I.value)||null,g=parseFloat((z=document.getElementById("pf-cost"))==null?void 0:z.value)||(y&&o?y*o:null),P=((H=document.getElementById("pf-date"))==null?void 0:H.value)||new Date().toISOString().slice(0,10),F=((m=document.getElementById("pf-stop-type"))==null?void 0:m.value)||"semanal",C=F==="manual"&&parseFloat((h=document.getElementById("pf-stop-manual"))==null?void 0:h.value)||null,j=((G=document.getElementById("pf-name"))==null?void 0:G.value.trim())||"",B=((W=document.getElementById("pf-notas"))==null?void 0:W.value.trim())||"";if(!n||!y||y<=0){alert("Ticker y precio de entrada son obligatorios.");return}if(v.find(X=>X.ticker===n)){alert(`${n} ya está en cartera.`);return}v.push({direction:p,ticker:n,name:j,entry:y,shares:o,cost:g,entryDate:P,stopType:F,stopManual:C,notas:B,addedAt:new Date(P).getTime()||Date.now()}),await d(),t.style.display="none",f()})}(U=document.getElementById("pos-open-form-btn"))==null||U.addEventListener("click",b);async function d(){await O.set(Y,v)}async function r(){await O.set(K,u)}function $(t,a,s=!1){var o;const e=(a==null?void 0:a.pnlPct)>0?"var(--green)":(a==null?void 0:a.pnlPct)<0?"var(--red)":"var(--text2)",c=(a==null?void 0:a.pnlPct)>0?"+":"",i=g=>g!=null?"$"+g.toFixed(2):"—",p=g=>g!=null?g.toFixed(1)+"%":"—";if(s)return`
      <div class="pos-card loading" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${t.ticker}</div><div class="pos-name">Cargando...</div></div>
          <span class="wl-spinner"></span>
        </div>
      </div>`;if(!a)return`
      <div class="pos-card" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker} <span class="pos-dir-badge ${t.direction==="bajista"?"short":"long"}">${t.direction==="bajista"?"📉 SHORT":"📈 LONG"}</span></div>
            <div class="pos-name" style="color:var(--amber)">${t.name||"Sin datos de mercado — posición manual"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${t.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>
        <div class="pos-metrics">
          <div class="pos-metric"><div class="pos-metric-label">Precio Entrada</div><div class="pos-metric-val" style="color:var(--text2)">${i(t.entry)}</div></div>
          ${t.shares?`<div class="pos-metric"><div class="pos-metric-label">Acciones</div><div class="pos-metric-val" style="font-size:16px;">${t.shares}</div></div>`:""}
          ${t.cost?`<div class="pos-metric"><div class="pos-metric-label">Inversión total</div><div class="pos-metric-val" style="font-size:16px;">$${parseFloat(t.cost).toFixed(0)}</div></div>`:""}
          ${t.entryDate?`<div class="pos-metric"><div class="pos-metric-label">Fecha entrada</div><div class="pos-metric-val" style="font-size:13px;font-family:var(--mono);">${new Date(t.entryDate).toLocaleDateString("es-ES")}</div></div>`:""}
        </div>
        <div style="font-size:10px;color:var(--amber);font-family:var(--mono);padding:8px 0;">⚠ No se pudieron cargar datos de mercado para este ticker</div>
      </div>`;const n=((a.currentPrice-a.stopDiario)/a.currentPrice*100).toFixed(1),y=((a.currentPrice-a.stopSemanal)/a.currentPrice*100).toFixed(1);return`
      <div class="pos-card ${a.tocoStop?"stop-hit":""} ${a.escapeFalso?"escape-alert-card":""}" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker} <span class="pos-dir-badge ${t.direction==="bajista"?"short":"long"}">${t.direction==="bajista"?"📉 SHORT":"📈 LONG"}</span></div>
            <div class="pos-name">${a.name||""} · ${a.currency||"USD"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="${((o=a.currentPrice)==null?void 0:o.toFixed(2))||""}" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${t.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>

        <div class="pos-metrics">
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Actual</div>
            <div class="pos-metric-val">${i(a.currentPrice)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Entrada</div>
            <div class="pos-metric-val" style="color:var(--text2)">${i(t.entry)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">P&L</div>
            <div class="pos-metric-val" style="color:${e}">${c}${p(a.pnlPct)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Stop Activo ${t.stopType==="manual"?"(Manual)":t.stopType==="semanal"?"(Semanal)":"(Diario)"}</div>
            <div class="pos-metric-val" style="color:var(--red)">${i(a.activeStop)}</div>
          </div>
          ${t.shares?`
          <div class="pos-metric">
            <div class="pos-metric-label">Acciones</div>
            <div class="pos-metric-val" style="font-size:16px;">${t.shares}</div>
          </div>`:""}
          ${t.cost?`
          <div class="pos-metric">
            <div class="pos-metric-label">Inversión total</div>
            <div class="pos-metric-val" style="font-size:16px;">$${parseFloat(t.cost).toFixed(0)}</div>
          </div>`:""}
          ${t.shares&&a.currentPrice?`
          <div class="pos-metric">
            <div class="pos-metric-label">Valor actual</div>
            <div class="pos-metric-val" style="color:${e};font-size:16px;">$${(t.shares*a.currentPrice).toFixed(0)}</div>
          </div>`:""}
          ${t.entryDate?`
          <div class="pos-metric">
            <div class="pos-metric-label">Fecha entrada</div>
            <div class="pos-metric-val" style="font-size:13px;font-family:var(--mono);">${new Date(t.entryDate).toLocaleDateString("es-ES")}</div>
          </div>`:""}
        </div>

        <div class="pos-stops">
          <div class="pos-stop-row ${t.stopType==="diario"?"active":""}">
            <span class="pos-stop-label">EMA10 Diario</span>
            <span class="pos-stop-val">${i(a.stopDiario)}</span>
            <span class="pos-stop-dist">(${n}%)</span>
          </div>
          <div class="pos-stop-row ${t.stopType==="semanal"?"active":""}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${i(a.stopSemanal)}</span>
            <span class="pos-stop-dist">(${y}%)</span>
          </div>
        </div>

        ${a.tocoStop?`
          <div class="pos-alert stop">
            <span class="pos-alert-icon">🛑</span>
            <div>
              <div class="pos-alert-title">STOP TOCADO — EMA10 ${t.stopType==="semanal"?"SEMANAL":"DIARIO"}</div>
              <div class="pos-alert-desc">El precio ha alcanzado tu stop dinámico en ${i(a.activeStop)}. Considera cerrar la posición.</div>
            </div>
          </div>`:""}

        ${a.escapeFalso?`
          <div class="pos-alert escape">
            <span class="pos-alert-icon">🚨</span>
            <div>
              <div class="pos-alert-title">ESCAPE FALSO DETECTADO</div>
              <div class="pos-alert-desc">El precio hizo nuevo máximo pero cerró por debajo. Señal de debilidad — considera salir antes del stop.</div>
            </div>
          </div>`:""}
      </div>`}function w(){document.querySelectorAll(".pos-del-btn:not([data-idx])").forEach(t=>{t.addEventListener("click",async()=>{confirm(`¿Eliminar ${t.dataset.ticker} sin guardar en historial?`)&&(v=v.filter(a=>a.ticker!==t.dataset.ticker),await d(),f())})}),document.querySelectorAll(".pos-close-btn").forEach(t=>{t.addEventListener("click",()=>D(t.dataset.ticker,parseFloat(t.dataset.price)))})}async function f(){const t=document.getElementById("pos-list");if(t){if(v.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`,A();return}t.innerHTML=`
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${v.length})</div>
        ${v.map(a=>$(a,null,!0)).join("")}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`,A(),await Promise.all(v.map(async a=>{try{const s=await Q(a.ticker),e=et(a,s),c=document.getElementById(`poscard-${a.ticker}`);c&&(c.outerHTML=$(a,e))}catch{const s=document.getElementById(`poscard-${a.ticker}`);s&&(s.outerHTML=$(a,null))}})),w()}}function D(t,a){const s=document.getElementById("pos-close-modal");s&&s.remove();const e=v.find(i=>i.ticker===t);if(!e)return;const c=document.createElement("div");c.id="pos-close-modal",c.innerHTML=`
      <div class="pos-modal-overlay">
        <div class="pos-modal">
          <div class="pos-modal-title">Cerrar posición · ${t}</div>
          <div class="pos-modal-body">
            <div class="pos-modal-row">
              <label>Precio de cierre</label>
              <input type="number" id="close-price" value="${a||""}" step="0.01" class="wl-input" style="width:140px;">
            </div>
            <div class="pos-modal-row">
              <label>Fecha de cierre</label>
              <input type="date" id="close-date" value="${new Date().toISOString().slice(0,10)}" class="wl-input" style="width:160px;">
            </div>
            <div class="pos-modal-row">
              <label>Motivo de cierre</label>
              <select id="close-reason" class="sc2-sel" style="width:200px;">
                <option value="stop">🛑 Stop tocado (EMA10)</option>
                <option value="objetivo">🎯 Objetivo alcanzado</option>
                <option value="escape">🚨 Escape falso</option>
                <option value="condiciones">📉 Condiciones rotas</option>
                <option value="manual">✋ Cierre manual</option>
              </select>
            </div>
            <div class="pos-modal-row">
              <label>Notas de cierre</label>
              <input type="text" id="close-notas" placeholder="Opcional..." class="wl-input" style="width:280px;">
            </div>
            ${a?`
            <div class="pos-modal-pnl">
              P&L estimado: <strong style="color:${a>=e.entry?"var(--green)":"var(--red)"}">
                ${a>=e.entry?"+":""}${((a-e.entry)/e.entry*100).toFixed(2)}%
              </strong>
            </div>`:""}
          </div>
          <div class="pos-modal-footer">
            <button class="btn" id="close-cancel">Cancelar</button>
            <button class="btn btn-primary" id="close-confirm">Confirmar cierre</button>
          </div>
        </div>
      </div>`,document.body.appendChild(c),document.getElementById("close-cancel").addEventListener("click",()=>c.remove()),c.querySelector(".pos-modal-overlay").addEventListener("click",i=>{i.target===i.currentTarget&&c.remove()}),document.getElementById("close-price").addEventListener("input",i=>{const p=parseFloat(i.target.value),n=c.querySelector(".pos-modal-pnl");if(n&&p>0){const y=((p-e.entry)/e.entry*100).toFixed(2);n.innerHTML=`P&L: <strong style="color:${p>=e.entry?"var(--green)":"var(--red)"}">${p>=e.entry?"+":""}${y}%</strong>`}}),document.getElementById("close-confirm").addEventListener("click",async()=>{const i=parseFloat(document.getElementById("close-price").value),p=document.getElementById("close-date").value,n=document.getElementById("close-reason").value,y=document.getElementById("close-notas").value;if(!i||i<=0){alert("Introduce el precio de cierre");return}const o=e.direction||"alcista",g=o==="bajista"?(e.entry-i)/e.entry*100:(i-e.entry)/e.entry*100,P=e.entryDate?new Date(e.entryDate):new Date(e.addedAt),F=new Date(p),C=Math.max(0,Math.round((F-P)/864e5)),j=e.cost?e.cost*g/100:null;u.unshift({direction:o,ticker:e.ticker,name:e.name||e.ticker,entry:e.entry,exit:i,shares:e.shares||null,cost:e.cost||null,pnlPct:g,pnlAbs:j,stopType:e.stopType,reason:n,notasEntrada:e.notas||"",notasSalida:y,entryDate:P.toLocaleDateString("es-ES"),exitDate:new Date(p).toLocaleDateString("es-ES"),entryDateISO:P.toISOString().slice(0,10),exitDateISO:p,duration:C,closedAt:Date.now()}),v=v.filter(B=>B.ticker!==t),await d(),await r(),c.remove(),f()})}function S(t,a){if(t.length===0)return null;const s=t.filter(m=>m.pnlPct>0),e=t.filter(m=>m.pnlPct<=0),c=s.length/t.length*100,i=s.length?s.reduce((m,h)=>m+h.pnlPct,0)/s.length:0,p=e.length?e.reduce((m,h)=>m+h.pnlPct,0)/e.length:0,n=t.reduce((m,h)=>m+h.pnlPct,0)/t.length,y=c/100*i+(1-c/100)*p,o=t.reduce((m,h)=>m+(h.pnlAbs||0),0),g=t.some(m=>m.pnlAbs!=null),P=a>0?o/a*100:null,F=t.reduce((m,h)=>m+(h.duration||0),0)/t.length,C=n,j=t.reduce((m,h)=>m+Math.pow(h.pnlPct-C,2),0)/t.length,B=Math.sqrt(j),M=B>0?n/B:0,L=Math.min(...t.map(m=>m.pnlPct)),N=[...t].sort((m,h)=>(m.closedAt||0)-(h.closedAt||0));let I=100,z=100,H=0;return N.forEach(m=>{I*=1+m.pnlPct/100,I>z&&(z=I);const h=(z-I)/z*100;h>H&&(H=h)}),{nOps:t.length,winRate:c,avgPnlPct:n,expectancy:y,totalPnlAbs:o,hasAbsData:g,totalPnlPctOnCapital:P,avgDays:F,stdDev:B,sharpe:M,maxLoss:L,maxDD:H}}function k(t,a){if(!t)return'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>';const s=(i,p=2)=>i!=null&&!isNaN(i)?i.toFixed(p):"—",e=i=>i>=0?"+":"",c=i=>i>=0?"var(--green)":"var(--red)";return`
      <div class="pos-metrics-grid">
        <div class="pos-mtile"><div class="pos-mtile-lbl">Capital Asignado</div><div class="pos-mtile-val">${a}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Beneficio Total (€)</div><div class="pos-mtile-val" style="color:${t.hasAbsData?c(t.totalPnlAbs):"var(--text3)"}">${t.hasAbsData?e(t.totalPnlAbs)+"$"+s(t.totalPnlAbs,0):"Sin coste asignado"}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Beneficio Total (%)</div><div class="pos-mtile-val" style="color:${t.totalPnlPctOnCapital!=null?c(t.totalPnlPctOnCapital):"var(--text3)"}">${t.totalPnlPctOnCapital!=null?e(t.totalPnlPctOnCapital)+s(t.totalPnlPctOnCapital)+"%":"—"}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ganancia Media</div><div class="pos-mtile-val" style="color:${c(t.avgPnlPct)}">${e(t.avgPnlPct)}${s(t.avgPnlPct)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ratio Win</div><div class="pos-mtile-val" style="color:${t.winRate>=50?"var(--green)":"var(--amber)"}">${s(t.winRate,1)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Esperanza Matemática</div><div class="pos-mtile-val" style="color:${c(t.expectancy)}">${e(t.expectancy)}${s(t.expectancy)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Días Medios / Op.</div><div class="pos-mtile-val">${s(t.avgDays,1)}d</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ratio Sharpe</div><div class="pos-mtile-val" style="color:${t.sharpe>=1?"var(--green)":t.sharpe>=0?"var(--amber)":"var(--red)"}">${s(t.sharpe)}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Volatilidad Media</div><div class="pos-mtile-val">${s(t.stdDev)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Máxima Pérdida</div><div class="pos-mtile-val" style="color:var(--red)">${s(t.maxLoss)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Máximo DD</div><div class="pos-mtile-val" style="color:var(--red)">-${s(t.maxDD)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Nº Operaciones</div><div class="pos-mtile-val">${t.nOps}</div></div>
      </div>`}function R(t,a){if(t.length===0)return'<div class="sc2-empty">Sin operaciones cerradas todavía</div>';const s={stop:"🛑 Stop",objetivo:"🎯 Objetivo",escape:"🚨 Escape falso",condiciones:"📉 Condiciones",manual:"✋ Manual"};return`
      <table class="sc2-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>TICKER</th><th>ENTRADA</th><th>SALIDA</th>
            <th>P&L %</th><th>P&L €</th><th>DURACIÓN</th><th>MOTIVO</th><th>NOTAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>{const c=u.indexOf(e);return`
            <tr>
              <td>
                <div class="sc2-ticker">${e.ticker} <span class="pos-dir-badge ${e.direction==="bajista"?"short":"long"}" style="font-size:7px;">${e.direction==="bajista"?"SHORT":"LONG"}</span></div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${e.entryDate} → ${e.exitDate}</div>
              </td>
              <td class="sc2-price">$${e.entry.toFixed(2)}</td>
              <td class="sc2-price">$${e.exit.toFixed(2)}</td>
              <td class="sc2-score" style="color:${e.pnlPct>=0?"var(--green)":"var(--red)"}">${e.pnlPct>=0?"+":""}${e.pnlPct.toFixed(2)}%</td>
              <td class="sc2-price" style="color:${e.pnlAbs!=null?e.pnlAbs>=0?"var(--green)":"var(--red)":"var(--text3)"}">${e.pnlAbs!=null?(e.pnlAbs>=0?"+":"")+"$"+e.pnlAbs.toFixed(0):"—"}</td>
              <td class="sc2-vol">${e.duration}d</td>
              <td style="font-size:10px;color:var(--text2);">${s[e.reason]||e.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${e.notasSalida||"—"}</td>
              <td><button class="pos-del-btn" data-idx="${c}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>`}let x="alcista",T=null,q=null;async function _(){T=await O.get("ethan_capital_alcista"),q=await O.get("ethan_capital_bajista")}function A(){var n,y;const t=document.getElementById("pos-history");if(!t)return;const a=u.filter(o=>(o.direction||"alcista")==="alcista"),s=u.filter(o=>o.direction==="bajista"),e=T,c=q,i=S(a,e),p=S(s,c);t.innerHTML=`
      <div class="pos-hist-tabs">
        <button class="pos-hist-tab ${x==="alcista"?"active":""}" data-tab="alcista">📈 Alcista (${a.length})</button>
        <button class="pos-hist-tab ${x==="bajista"?"active":""}" data-tab="bajista">📉 Bajista (${s.length})</button>
      </div>

      <div class="pos-hist-panel" id="panel-alcista" style="display:${x==="alcista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Alcista (€)</label>
          <input type="number" id="cap-alcista-input" class="wl-input" style="width:160px;" value="${e??""}" placeholder="ej. 20000">
          <button class="btn" id="cap-alcista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${k(i,e!=null?"$"+e.toFixed(0):"Sin definir")}
        ${R(a)}
      </div>

      <div class="pos-hist-panel" id="panel-bajista" style="display:${x==="bajista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Bajista (€)</label>
          <input type="number" id="cap-bajista-input" class="wl-input" style="width:160px;" value="${c??""}" placeholder="ej. 10000">
          <button class="btn" id="cap-bajista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${k(p,c!=null?"$"+c.toFixed(0):"Sin definir")}
        ${R(s)}
      </div>
    `,t.querySelectorAll(".pos-hist-tab").forEach(o=>{o.addEventListener("click",()=>{x=o.dataset.tab,A()})}),(n=document.getElementById("cap-alcista-save"))==null||n.addEventListener("click",async()=>{const o=parseFloat(document.getElementById("cap-alcista-input").value);T=isNaN(o)?null:o,await O.set("ethan_capital_alcista",T),A()}),(y=document.getElementById("cap-bajista-save"))==null||y.addEventListener("click",async()=>{const o=parseFloat(document.getElementById("cap-bajista-input").value);q=isNaN(o)?null:o,await O.set("ethan_capital_bajista",q),A()}),t.querySelectorAll(".pos-del-btn[data-idx]").forEach(o=>{o.addEventListener("click",async()=>{confirm("¿Eliminar esta operación del historial?")&&(u.splice(parseInt(o.dataset.idx),1),await r(),A())})})}return await _(),f(),{destroy(){}}}export{it as render};
