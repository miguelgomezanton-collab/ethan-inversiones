import{U as A}from"./userdata-CYjZ6E2F.js";import"./index-DjiZMk9c.js";const z="ethan_positions",H="ethan_positions_history",U=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function q(a){var r,i,u,n;const h=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=1y&events=history`;for(const l of U)try{const y=await fetch(l(h),{signal:AbortSignal.timeout(8e3)});if(!y.ok)continue;const $=await y.text();let p;try{p=JSON.parse($)}catch{continue}const w=(i=(r=p==null?void 0:p.chart)==null?void 0:r.result)==null?void 0:i[0];if(!w)continue;const b=(n=(u=w.indicators)==null?void 0:u.quote)==null?void 0:n[0];if(!b)continue;const x=w.meta||{};return{timestamps:w.timestamp,opens:b.open,highs:b.high,lows:b.low,closes:b.close,volumes:b.volume,name:x.shortName||x.longName||a,currency:x.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function R(a,h){const r=2/(h+1),i=new Array(a.length).fill(null);let u=a.findIndex(n=>n!=null&&!isNaN(n));if(u<0)return i;i[u]=a[u];for(let n=u+1;n<a.length;n++){const l=a[n]!=null&&!isNaN(a[n])?a[n]:i[n-1];i[n]=l*r+i[n-1]*(1-r)}return i}function _(a,h,r,i,u,n){const l={};a.forEach(($,p)=>{const w=new Date($*1e3),b=w.getDay(),x=w.getDate()-b+(b===0?-6:1),t=new Date(+w);t.setDate(x);const e=t.toISOString().slice(0,10);l[e]?(l[e].h=Math.max(l[e].h,r[p]),l[e].l=Math.min(l[e].l,i[p]),l[e].c=u[p],l[e].v+=n[p]):l[e]={o:h[p],h:r[p],l:i[p],c:u[p],v:n[p]}});const y=Object.keys(l).sort();return{opens:y.map($=>l[$].o),highs:y.map($=>l[$].h),lows:y.map($=>l[$].l),closes:y.map($=>l[$].c)}}function G(a,h){const r=a.length;if(r<5)return!1;const i=r-1,u=r-2,n=r-3;let l=0;for(let y=Math.max(0,n-10);y<n;y++)l=Math.max(l,a[y]);return a[n]>l&&h[u]<a[n]&&h[i]<a[n]&&h[u]<h[n]&&h[i]<h[u]}function W(a,h){const{timestamps:r,opens:i,highs:u,lows:n,closes:l,volumes:y,name:$,currency:p}=h,w=l.length,b=w-1,x=l[b],e=R(l,10)[b],f=_(r,i,u,n,l,y),v=R(f.closes,10)[f.closes.length-1],d=a.stopType==="manual"?a.stopManual:a.stopType==="semanal"?v:e,c=G(u,l),s=(x-a.entry)/a.entry*100,m=(x-d)/x*100,E=x<=d*1.005;return{currentPrice:x,stopDiario:e,stopSemanal:v,activeStop:d,escapeFalso:c,tocoStop:E,pnlPct:s,distStop:m,name:$,currency:p}}async function J(a,{actionsSlot:h}){var x;let r=await A.get(z)||[],i=await A.get(H)||[];h.innerHTML=`
    <button class="btn btn-primary" id="pos-open-form-btn">+ Nueva posición</button>
  `,a.innerHTML=`
    <div id="pos-form-panel" style="display:none;"></div>
    <div id="pos-list"></div>
  `;function u(){var e,f,o,v,d;const t=document.getElementById("pos-form-panel");t.style.display="block",t.innerHTML=`
      <div class="pos-form-card">
        <div class="pos-form-title">Nueva posición</div>

        <!-- Fila 1: Ticker + buscar -->
        <div class="pos-form-search">
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
    `,["pf-entry","pf-shares"].forEach(c=>{var s;(s=document.getElementById(c))==null||s.addEventListener("input",()=>{var g,k;const m=parseFloat(((g=document.getElementById("pf-entry"))==null?void 0:g.value)||0),E=parseFloat(((k=document.getElementById("pf-shares"))==null?void 0:k.value)||0);m>0&&E>0&&(document.getElementById("pf-cost").value=(m*E).toFixed(2))})}),(e=document.getElementById("pf-stop-type"))==null||e.addEventListener("change",c=>{document.getElementById("pf-stop-manual-wrap").style.display=c.target.value==="manual"?"block":"none"}),(f=document.getElementById("pf-search-btn"))==null||f.addEventListener("click",async()=>{var m,E,g,k;const c=(m=document.getElementById("pf-ticker"))==null?void 0:m.value.trim().toUpperCase();if(!c)return;const s=document.getElementById("pf-search-status");s.textContent="Buscando...",s.style.color="var(--text3)";try{const F=`https://query1.finance.yahoo.com/v8/finance/chart/${c}?interval=1d&range=5d`;let D=!1;for(const T of U)try{const B=await fetch(T(F),{signal:AbortSignal.timeout(6e3)});if(!B.ok)continue;const P=JSON.parse(await B.text()),S=(k=(g=(E=P==null?void 0:P.chart)==null?void 0:E.result)==null?void 0:g[0])==null?void 0:k.meta;if(!S)continue;const L=S.shortName||S.longName||c,I=S.regularMarketPrice;document.getElementById("pf-name").value=L,I&&!document.getElementById("pf-entry").value&&(document.getElementById("pf-entry").value=I.toFixed(2)),s.textContent=`✓ Encontrado: ${L}${I?" · $"+I.toFixed(2):""}`,s.style.color="var(--green)",D=!0;break}catch{}D||(s.textContent="⚠ No encontrado en Yahoo · puedes añadirlo manualmente",s.style.color="var(--amber)")}catch{s.textContent="⚠ Error de conexión · puedes añadirlo manualmente",s.style.color="var(--amber)"}}),(o=document.getElementById("pf-ticker"))==null||o.addEventListener("keydown",c=>{var s;c.key==="Enter"&&((s=document.getElementById("pf-search-btn"))==null||s.click()),c.target.value=c.target.value.toUpperCase()}),(v=document.getElementById("pf-cancel-btn"))==null||v.addEventListener("click",()=>{t.style.display="none"}),(d=document.getElementById("pf-add-btn"))==null||d.addEventListener("click",async()=>{var B,P,S,L,I,M,C,N,O;const c=(B=document.getElementById("pf-ticker"))==null?void 0:B.value.trim().toUpperCase(),s=parseFloat((P=document.getElementById("pf-entry"))==null?void 0:P.value),m=parseFloat((S=document.getElementById("pf-shares"))==null?void 0:S.value)||null,E=parseFloat((L=document.getElementById("pf-cost"))==null?void 0:L.value)||(s&&m?s*m:null),g=((I=document.getElementById("pf-date"))==null?void 0:I.value)||new Date().toISOString().slice(0,10),k=((M=document.getElementById("pf-stop-type"))==null?void 0:M.value)||"semanal",F=k==="manual"&&parseFloat((C=document.getElementById("pf-stop-manual"))==null?void 0:C.value)||null,D=((N=document.getElementById("pf-name"))==null?void 0:N.value.trim())||"",T=((O=document.getElementById("pf-notas"))==null?void 0:O.value.trim())||"";if(!c||!s||s<=0){alert("Ticker y precio de entrada son obligatorios.");return}if(r.find(j=>j.ticker===c)){alert(`${c} ya está en cartera.`);return}r.push({ticker:c,name:D,entry:s,shares:m,cost:E,entryDate:g,stopType:k,stopManual:F,notas:T,addedAt:new Date(g).getTime()||Date.now()}),await n(),t.style.display="none",p()})}(x=document.getElementById("pos-open-form-btn"))==null||x.addEventListener("click",u);async function n(){await A.set(z,r)}async function l(){await A.set(H,i)}function y(t,e,f=!1){var E;const o=(e==null?void 0:e.pnlPct)>0?"var(--green)":(e==null?void 0:e.pnlPct)<0?"var(--red)":"var(--text2)",v=(e==null?void 0:e.pnlPct)>0?"+":"",d=g=>g!=null?"$"+g.toFixed(2):"—",c=g=>g!=null?g.toFixed(1)+"%":"—";if(f)return`
      <div class="pos-card loading" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${t.ticker}</div><div class="pos-name">Cargando...</div></div>
          <span class="wl-spinner"></span>
        </div>
      </div>`;if(!e)return`
      <div class="pos-card" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker}</div>
            <div class="pos-name" style="color:var(--amber)">${t.name||"Sin datos de mercado — posición manual"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${t.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>
        <div class="pos-metrics">
          <div class="pos-metric"><div class="pos-metric-label">Precio Entrada</div><div class="pos-metric-val" style="color:var(--text2)">${d(t.entry)}</div></div>
          ${t.shares?`<div class="pos-metric"><div class="pos-metric-label">Acciones</div><div class="pos-metric-val" style="font-size:16px;">${t.shares}</div></div>`:""}
          ${t.cost?`<div class="pos-metric"><div class="pos-metric-label">Inversión total</div><div class="pos-metric-val" style="font-size:16px;">$${parseFloat(t.cost).toFixed(0)}</div></div>`:""}
          ${t.entryDate?`<div class="pos-metric"><div class="pos-metric-label">Fecha entrada</div><div class="pos-metric-val" style="font-size:13px;font-family:var(--mono);">${new Date(t.entryDate).toLocaleDateString("es-ES")}</div></div>`:""}
        </div>
        <div style="font-size:10px;color:var(--amber);font-family:var(--mono);padding:8px 0;">⚠ No se pudieron cargar datos de mercado para este ticker</div>
      </div>`;const s=((e.currentPrice-e.stopDiario)/e.currentPrice*100).toFixed(1),m=((e.currentPrice-e.stopSemanal)/e.currentPrice*100).toFixed(1);return`
      <div class="pos-card ${e.tocoStop?"stop-hit":""} ${e.escapeFalso?"escape-alert-card":""}" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker}</div>
            <div class="pos-name">${e.name||""} · ${e.currency||"USD"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="${((E=e.currentPrice)==null?void 0:E.toFixed(2))||""}" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${t.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>

        <div class="pos-metrics">
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Actual</div>
            <div class="pos-metric-val">${d(e.currentPrice)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Entrada</div>
            <div class="pos-metric-val" style="color:var(--text2)">${d(t.entry)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">P&L</div>
            <div class="pos-metric-val" style="color:${o}">${v}${c(e.pnlPct)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Stop Activo ${t.stopType==="manual"?"(Manual)":t.stopType==="semanal"?"(Semanal)":"(Diario)"}</div>
            <div class="pos-metric-val" style="color:var(--red)">${d(e.activeStop)}</div>
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
          ${t.shares&&e.currentPrice?`
          <div class="pos-metric">
            <div class="pos-metric-label">Valor actual</div>
            <div class="pos-metric-val" style="color:${o};font-size:16px;">$${(t.shares*e.currentPrice).toFixed(0)}</div>
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
            <span class="pos-stop-val">${d(e.stopDiario)}</span>
            <span class="pos-stop-dist">(${s}%)</span>
          </div>
          <div class="pos-stop-row ${t.stopType==="semanal"?"active":""}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${d(e.stopSemanal)}</span>
            <span class="pos-stop-dist">(${m}%)</span>
          </div>
        </div>

        ${e.tocoStop?`
          <div class="pos-alert stop">
            <span class="pos-alert-icon">🛑</span>
            <div>
              <div class="pos-alert-title">STOP TOCADO — EMA10 ${t.stopType==="semanal"?"SEMANAL":"DIARIO"}</div>
              <div class="pos-alert-desc">El precio ha alcanzado tu stop dinámico en ${d(e.activeStop)}. Considera cerrar la posición.</div>
            </div>
          </div>`:""}

        ${e.escapeFalso?`
          <div class="pos-alert escape">
            <span class="pos-alert-icon">🚨</span>
            <div>
              <div class="pos-alert-title">ESCAPE FALSO DETECTADO</div>
              <div class="pos-alert-desc">El precio hizo nuevo máximo pero cerró por debajo. Señal de debilidad — considera salir antes del stop.</div>
            </div>
          </div>`:""}
      </div>`}function $(){document.querySelectorAll(".pos-del-btn:not([data-idx])").forEach(t=>{t.addEventListener("click",async()=>{confirm(`¿Eliminar ${t.dataset.ticker} sin guardar en historial?`)&&(r=r.filter(e=>e.ticker!==t.dataset.ticker),await n(),p())})}),document.querySelectorAll(".pos-close-btn").forEach(t=>{t.addEventListener("click",()=>w(t.dataset.ticker,parseFloat(t.dataset.price)))})}async function p(){const t=document.getElementById("pos-list");if(t){if(r.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`,b();return}t.innerHTML=`
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${r.length})</div>
        ${r.map(e=>y(e,null,!0)).join("")}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`,b(),await Promise.all(r.map(async e=>{try{const f=await q(e.ticker),o=W(e,f),v=document.getElementById(`poscard-${e.ticker}`);v&&(v.outerHTML=y(e,o))}catch{const f=document.getElementById(`poscard-${e.ticker}`);f&&(f.outerHTML=y(e,null))}})),$()}}function w(t,e){const f=document.getElementById("pos-close-modal");f&&f.remove();const o=r.find(d=>d.ticker===t);if(!o)return;const v=document.createElement("div");v.id="pos-close-modal",v.innerHTML=`
      <div class="pos-modal-overlay">
        <div class="pos-modal">
          <div class="pos-modal-title">Cerrar posición · ${t}</div>
          <div class="pos-modal-body">
            <div class="pos-modal-row">
              <label>Precio de cierre</label>
              <input type="number" id="close-price" value="${e||""}" step="0.01" class="wl-input" style="width:140px;">
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
            ${e?`
            <div class="pos-modal-pnl">
              P&L estimado: <strong style="color:${e>=o.entry?"var(--green)":"var(--red)"}">
                ${e>=o.entry?"+":""}${((e-o.entry)/o.entry*100).toFixed(2)}%
              </strong>
            </div>`:""}
          </div>
          <div class="pos-modal-footer">
            <button class="btn" id="close-cancel">Cancelar</button>
            <button class="btn btn-primary" id="close-confirm">Confirmar cierre</button>
          </div>
        </div>
      </div>`,document.body.appendChild(v),document.getElementById("close-cancel").addEventListener("click",()=>v.remove()),v.querySelector(".pos-modal-overlay").addEventListener("click",d=>{d.target===d.currentTarget&&v.remove()}),document.getElementById("close-price").addEventListener("input",d=>{const c=parseFloat(d.target.value),s=v.querySelector(".pos-modal-pnl");if(s&&c>0){const m=((c-o.entry)/o.entry*100).toFixed(2);s.innerHTML=`P&L: <strong style="color:${c>=o.entry?"var(--green)":"var(--red)"}">${c>=o.entry?"+":""}${m}%</strong>`}}),document.getElementById("close-confirm").addEventListener("click",async()=>{const d=parseFloat(document.getElementById("close-price").value),c=document.getElementById("close-date").value,s=document.getElementById("close-reason").value,m=document.getElementById("close-notas").value;if(!d||d<=0){alert("Introduce el precio de cierre");return}const E=(d-o.entry)/o.entry*100,g=new Date(o.addedAt),k=new Date(c),F=Math.round((k-g)/864e5);i.unshift({ticker:o.ticker,name:o.name||o.ticker,entry:o.entry,exit:d,pnlPct:E,stopType:o.stopType,reason:s,notasEntrada:o.notas||"",notasSalida:m,entryDate:new Date(o.addedAt).toLocaleDateString("es-ES"),exitDate:new Date(c).toLocaleDateString("es-ES"),duration:F,closedAt:Date.now()}),r=r.filter(D=>D.ticker!==t),await n(),await l(),v.remove(),p()})}function b(){const t=document.getElementById("pos-history");if(!t)return;if(i.length===0){t.innerHTML='<div class="sc2-empty">Sin posiciones cerradas todavía</div>';return}const e=i.filter(s=>s.pnlPct>0).length,f=i.filter(s=>s.pnlPct<=0).length,o=i.reduce((s,m)=>s+m.pnlPct,0)/i.length,v=Math.max(...i.map(s=>s.pnlPct)),d=Math.min(...i.map(s=>s.pnlPct)),c={stop:"🛑 Stop",objetivo:"🎯 Objetivo",escape:"🚨 Escape falso",condiciones:"📉 Condiciones",manual:"✋ Manual"};t.innerHTML=`
      <!-- Resumen estadístico -->
      <div class="pos-hist-stats">
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val">${i.length}</div>
          <div class="pos-hist-stat-lbl">Operaciones</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">${e}</div>
          <div class="pos-hist-stat-lbl">Ganadoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${f}</div>
          <div class="pos-hist-stat-lbl">Perdedoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:${o>=0?"var(--green)":"var(--red)"}">${o>=0?"+":""}${o.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">P&L medio</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">+${v.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">Mejor op.</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${d.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">Peor op.</div>
        </div>
      </div>

      <!-- Tabla historial -->
      <table class="sc2-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>TICKER</th><th>ENTRADA</th><th>SALIDA</th>
            <th>P&L</th><th>DURACIÓN</th><th>MOTIVO</th><th>NOTAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${i.map((s,m)=>`
            <tr>
              <td>
                <div class="sc2-ticker">${s.ticker}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${s.entryDate} → ${s.exitDate}</div>
              </td>
              <td class="sc2-price">$${s.entry.toFixed(2)}</td>
              <td class="sc2-price">$${s.exit.toFixed(2)}</td>
              <td class="sc2-score" style="color:${s.pnlPct>=0?"var(--green)":"var(--red)"}">
                ${s.pnlPct>=0?"+":""}${s.pnlPct.toFixed(2)}%
              </td>
              <td class="sc2-vol">${s.duration}d</td>
              <td style="font-size:10px;color:var(--text2);">${c[s.reason]||s.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${s.notasSalida||"—"}</td>
              <td>
                <button class="pos-del-btn" data-idx="${m}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`,t.querySelectorAll(".pos-del-btn[data-idx]").forEach(s=>{s.addEventListener("click",async()=>{confirm("¿Eliminar esta operación del historial?")&&(i.splice(parseInt(s.dataset.idx),1),await l(),b())})})}return p(),{destroy(){}}}export{J as render};
