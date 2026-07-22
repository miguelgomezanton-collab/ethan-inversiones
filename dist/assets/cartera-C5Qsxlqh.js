const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/fondo-CuDiLIRT.js","assets/userdata-Dsogw_hu.js","assets/index-BAlb9zK3.js","assets/index-CirJMAu0.css"])))=>i.map(i=>d[i]);
import{_ as X}from"./index-BAlb9zK3.js";import{U as N}from"./userdata-Dsogw_hu.js";const Q="ethan_positions",Z="ethan_positions_history",J=[d=>`https://api.allorigins.win/raw?url=${encodeURIComponent(d)}`,d=>`https://corsproxy.io/?${encodeURIComponent(d)}`,d=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(d)}`,d=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(d)}`];async function at(d){var u,f,P,p;const D=`https://query1.finance.yahoo.com/v8/finance/chart/${d}?interval=1d&range=1y&events=history`;for(const m of J)try{const I=await fetch(m(D),{signal:AbortSignal.timeout(8e3)});if(!I.ok)continue;const C=await I.text();let h;try{h=JSON.parse(C)}catch{continue}const j=(f=(u=h==null?void 0:h.chart)==null?void 0:u.result)==null?void 0:f[0];if(!j)continue;const B=(p=(P=j.indicators)==null?void 0:P.quote)==null?void 0:p[0];if(!B)continue;const L=j.meta||{};return{timestamps:j.timestamp,opens:B.open,highs:B.high,lows:B.low,closes:B.close,volumes:B.volume,name:L.shortName||L.longName||d,currency:L.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function tt(d,D){const u=2/(D+1),f=new Array(d.length).fill(null);let P=d.findIndex(p=>p!=null&&!isNaN(p));if(P<0)return f;f[P]=d[P];for(let p=P+1;p<d.length;p++){const m=d[p]!=null&&!isNaN(d[p])?d[p]:f[p-1];f[p]=m*u+f[p-1]*(1-u)}return f}function st(d,D,u,f,P,p){const m={};d.forEach((C,h)=>{const j=new Date(C*1e3),B=j.getDay(),L=j.getDate()-B+(B===0?-6:1),H=new Date(+j);H.setDate(L);const T=H.toISOString().slice(0,10);m[T]?(m[T].h=Math.max(m[T].h,u[h]),m[T].l=Math.min(m[T].l,f[h]),m[T].c=P[h],m[T].v+=p[h]):m[T]={o:D[h],h:u[h],l:f[h],c:P[h],v:p[h]}});const I=Object.keys(m).sort();return{opens:I.map(C=>m[C].o),highs:I.map(C=>m[C].h),lows:I.map(C=>m[C].l),closes:I.map(C=>m[C].c)}}function it(d,D){const u=d.length;if(u<5)return!1;const f=u-1,P=u-2,p=u-3;let m=0;for(let I=Math.max(0,p-10);I<p;I++)m=Math.max(m,d[I]);return d[p]>m&&D[P]<d[p]&&D[f]<d[p]&&D[P]<D[p]&&D[f]<D[P]}function ot(d,D){const{timestamps:u,opens:f,highs:P,lows:p,closes:m,volumes:I,name:C,currency:h}=D,j=m.length,B=j-1,L=m[B],T=tt(m,10)[B],_=st(u,f,P,p,m,I),z=tt(_.closes,10)[_.closes.length-1],U=d.stopType==="manual"?d.stopManual:d.stopType==="semanal"?z:T,R=it(P,m),G=(L-d.entry)/d.entry*100,t=(L-U)/L*100,a=L<=U*1.005;return{currentPrice:L,stopDiario:T,stopSemanal:z,activeStop:U,escapeFalso:R,tocoStop:a,pnlPct:G,distStop:t,name:C,currency:h}}async function ct(d,{actionsSlot:D}){var G;let u=await N.get(Q)||[],f=await N.get(Z)||[];D.innerHTML=`
    <button class="btn btn-primary" id="pos-open-form-btn">+ Nueva posición</button>
  `,d.innerHTML=`
    <div id="pos-form-panel" style="display:none;"></div>
    <div id="pos-list"></div>
  `;function P(){var a,i,e,o,s;const t=document.getElementById("pos-form-panel");t.style.display="block",t.innerHTML=`
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
          <div class="pos-form-field">
            <label>Stop de entrada (€) <span style="color:var(--text3);text-transform:none;">— precio del stop al abrir</span></label>
            <input type="number" id="pf-entry-stop" placeholder="ej. 145.00" step="0.01" class="wl-input">
          </div>
          <div class="pos-form-field" id="pf-stop-manual-wrap" style="display:none;">
            <label>Stop loss manual (precio fijo)</label>
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
    `,["pf-entry","pf-shares"].forEach(l=>{var c;(c=document.getElementById(l))==null||c.addEventListener("input",()=>{var v,w;const b=parseFloat(((v=document.getElementById("pf-entry"))==null?void 0:v.value)||0),n=parseFloat(((w=document.getElementById("pf-shares"))==null?void 0:w.value)||0);b>0&&n>0&&(document.getElementById("pf-cost").value=(b*n).toFixed(2))})}),(a=document.getElementById("pf-stop-type"))==null||a.addEventListener("change",l=>{document.getElementById("pf-stop-manual-wrap").style.display=l.target.value==="manual"?"block":"none"}),(i=document.getElementById("pf-search-btn"))==null||i.addEventListener("click",async()=>{var b,n,v,w;const l=(b=document.getElementById("pf-ticker"))==null?void 0:b.value.trim().toUpperCase();if(!l)return;const c=document.getElementById("pf-search-status");c.textContent="Buscando...",c.style.color="var(--text3)";try{const g=`https://query1.finance.yahoo.com/v8/finance/chart/${l}?interval=1d&range=5d`;let E=!1;for(const M of J)try{const $=await fetch(M(g),{signal:AbortSignal.timeout(6e3)});if(!$.ok)continue;const A=JSON.parse(await $.text()),F=(w=(v=(n=A==null?void 0:A.chart)==null?void 0:n.result)==null?void 0:v[0])==null?void 0:w.meta;if(!F)continue;const O=F.shortName||F.longName||l,S=F.regularMarketPrice;document.getElementById("pf-name").value=O,S&&!document.getElementById("pf-entry").value&&(document.getElementById("pf-entry").value=S.toFixed(2)),c.textContent=`✓ Encontrado: ${O}${S?" · $"+S.toFixed(2):""}`,c.style.color="var(--green)",E=!0;break}catch{}E||(c.textContent="⚠ No encontrado en Yahoo · puedes añadirlo manualmente",c.style.color="var(--amber)")}catch{c.textContent="⚠ Error de conexión · puedes añadirlo manualmente",c.style.color="var(--amber)"}}),(e=document.getElementById("pf-ticker"))==null||e.addEventListener("keydown",l=>{var c;l.key==="Enter"&&((c=document.getElementById("pf-search-btn"))==null||c.click()),l.target.value=l.target.value.toUpperCase()}),(o=document.getElementById("pf-cancel-btn"))==null||o.addEventListener("click",()=>{t.style.display="none"}),(s=document.getElementById("pf-add-btn"))==null||s.addEventListener("click",async()=>{var F,O,S,x,k,r,y,V,W,Y,K;const l=((F=document.getElementById("pf-direction"))==null?void 0:F.value)||"alcista",c=(O=document.getElementById("pf-ticker"))==null?void 0:O.value.trim().toUpperCase(),b=parseFloat((S=document.getElementById("pf-entry"))==null?void 0:S.value),n=parseFloat((x=document.getElementById("pf-shares"))==null?void 0:x.value)||null,v=parseFloat((k=document.getElementById("pf-cost"))==null?void 0:k.value)||(b&&n?b*n:null),w=((r=document.getElementById("pf-date"))==null?void 0:r.value)||new Date().toISOString().slice(0,10),g=((y=document.getElementById("pf-stop-type"))==null?void 0:y.value)||"semanal",E=g==="manual"&&parseFloat((V=document.getElementById("pf-stop-manual"))==null?void 0:V.value)||null,M=parseFloat((W=document.getElementById("pf-entry-stop"))==null?void 0:W.value)||E||null,$=((Y=document.getElementById("pf-name"))==null?void 0:Y.value.trim())||"",A=((K=document.getElementById("pf-notas"))==null?void 0:K.value.trim())||"";if(!c||!b||b<=0){alert("Ticker y precio de entrada son obligatorios.");return}if(u.find(et=>et.ticker===c)){alert(`${c} ya está en cartera.`);return}u.push({direction:l,ticker:c,name:$,entry:b,shares:n,cost:v,entryDate:w,stopType:g,stopManual:E,entryStop:M,notas:A,addedAt:new Date(w).getTime()||Date.now()}),await p(),fetch("/api/backfill-ticker",{method:"POST",headers:{"Content-Type":"application/json","X-ETHAN-Client":"true"},body:JSON.stringify({ticker:c,dateFrom:w,dateTo:new Date().toISOString().slice(0,10),status:"active",forceRefresh:!0})}).catch(()=>{}),t.style.display="none",h()})}(G=document.getElementById("pos-open-form-btn"))==null||G.addEventListener("click",P);async function p(){await N.set(Q,u)}async function m(){await N.set(Z,f)}function I(t,a,i=!1){var n;const e=(a==null?void 0:a.pnlPct)>0?"var(--green)":(a==null?void 0:a.pnlPct)<0?"var(--red)":"var(--text2)",o=(a==null?void 0:a.pnlPct)>0?"+":"",s=v=>v!=null?"$"+v.toFixed(2):"—",l=v=>v!=null?v.toFixed(1)+"%":"—";if(i)return`
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
          <div class="pos-metric"><div class="pos-metric-label">Precio Entrada</div><div class="pos-metric-val" style="color:var(--text2)">${s(t.entry)}</div></div>
          ${t.shares?`<div class="pos-metric"><div class="pos-metric-label">Acciones</div><div class="pos-metric-val" style="font-size:16px;">${t.shares}</div></div>`:""}
          ${t.cost?`<div class="pos-metric"><div class="pos-metric-label">Inversión total</div><div class="pos-metric-val" style="font-size:16px;">$${parseFloat(t.cost).toFixed(0)}</div></div>`:""}
          ${t.entryDate?`<div class="pos-metric"><div class="pos-metric-label">Fecha entrada</div><div class="pos-metric-val" style="font-size:13px;font-family:var(--mono);">${new Date(t.entryDate).toLocaleDateString("es-ES")}</div></div>`:""}
        </div>
        <div style="font-size:10px;color:var(--amber);font-family:var(--mono);padding:8px 0;">⚠ No se pudieron cargar datos de mercado para este ticker</div>
      </div>`;const c=((a.currentPrice-a.stopDiario)/a.currentPrice*100).toFixed(1),b=((a.currentPrice-a.stopSemanal)/a.currentPrice*100).toFixed(1);return`
      <div class="pos-card ${a.tocoStop?"stop-hit":""} ${a.escapeFalso?"escape-alert-card":""}" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker} <span class="pos-dir-badge ${t.direction==="bajista"?"short":"long"}">${t.direction==="bajista"?"📉 SHORT":"📈 LONG"}</span></div>
            <div class="pos-name">${a.name||""} · ${a.currency||"USD"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="${((n=a.currentPrice)==null?void 0:n.toFixed(2))||""}" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${t.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>

        <div class="pos-metrics">
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Actual</div>
            <div class="pos-metric-val">${s(a.currentPrice)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Entrada</div>
            <div class="pos-metric-val" style="color:var(--text2)">${s(t.entry)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">P&L</div>
            <div class="pos-metric-val" style="color:${e}">${o}${l(a.pnlPct)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Stop Activo ${t.stopType==="manual"?"(Manual)":t.stopType==="semanal"?"(Semanal)":"(Diario)"}</div>
            <div class="pos-metric-val" style="color:var(--red)">${s(a.activeStop)}</div>
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
            <span class="pos-stop-val">${s(a.stopDiario)}</span>
            <span class="pos-stop-dist">(${c}%)</span>
          </div>
          <div class="pos-stop-row ${t.stopType==="semanal"?"active":""}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${s(a.stopSemanal)}</span>
            <span class="pos-stop-dist">(${b}%)</span>
          </div>
        </div>

        ${a.tocoStop?`
          <div class="pos-alert stop">
            <span class="pos-alert-icon">🛑</span>
            <div>
              <div class="pos-alert-title">STOP TOCADO — EMA10 ${t.stopType==="semanal"?"SEMANAL":"DIARIO"}</div>
              <div class="pos-alert-desc">El precio ha alcanzado tu stop dinámico en ${s(a.activeStop)}. Considera cerrar la posición.</div>
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
      </div>`}function C(){document.querySelectorAll(".pos-del-btn:not([data-idx])").forEach(t=>{t.addEventListener("click",async()=>{confirm(`¿Eliminar ${t.dataset.ticker} sin guardar en historial?`)&&(u=u.filter(a=>a.ticker!==t.dataset.ticker),await p(),h())})}),document.querySelectorAll(".pos-close-btn").forEach(t=>{t.addEventListener("click",()=>j(t.dataset.ticker,parseFloat(t.dataset.price)))})}async function h(){const t=document.getElementById("pos-list");if(t){if(u.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`,R();return}t.innerHTML=`
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${u.length})</div>
        ${u.map(a=>I(a,null,!0)).join("")}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`,R(),await Promise.all(u.map(async a=>{var i;try{const e=await at(a.ticker),o=ot(a,e);o.currentPrice&&o.currentPrice!==a.currentPrice&&(a.currentPrice=o.currentPrice,a.prevPrice=((i=e.closes)==null?void 0:i[e.closes.length-2])||o.currentPrice,await p());const s=document.getElementById(`poscard-${a.ticker}`);s&&(s.outerHTML=I(a,o))}catch{const e=document.getElementById(`poscard-${a.ticker}`);e&&(e.outerHTML=I(a,null))}})),C()}}function j(t,a){const i=document.getElementById("pos-close-modal");i&&i.remove();const e=u.find(s=>s.ticker===t);if(!e)return;const o=document.createElement("div");o.id="pos-close-modal",o.innerHTML=`
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
      </div>`,document.body.appendChild(o),document.getElementById("close-cancel").addEventListener("click",()=>o.remove()),o.querySelector(".pos-modal-overlay").addEventListener("click",s=>{s.target===s.currentTarget&&o.remove()}),document.getElementById("close-price").addEventListener("input",s=>{const l=parseFloat(s.target.value),c=o.querySelector(".pos-modal-pnl");if(c&&l>0){const b=((l-e.entry)/e.entry*100).toFixed(2);c.innerHTML=`P&L: <strong style="color:${l>=e.entry?"var(--green)":"var(--red)"}">${l>=e.entry?"+":""}${b}%</strong>`}}),document.getElementById("close-confirm").addEventListener("click",async()=>{const s=parseFloat(document.getElementById("close-price").value),l=document.getElementById("close-date").value,c=document.getElementById("close-reason").value,b=document.getElementById("close-notas").value;if(!s||s<=0){alert("Introduce el precio de cierre");return}const n=e.direction||"alcista",v=n==="bajista"?(e.entry-s)/e.entry*100:(s-e.entry)/e.entry*100,w=e.entryDate?new Date(e.entryDate):new Date(e.addedAt),g=new Date(l),E=Math.max(0,Math.round((g-w)/864e5)),M=e.cost?e.cost*v/100:null,$=w.toISOString().slice(0,10);await B(e.ticker,$,l,n),f.unshift({direction:n,ticker:e.ticker,name:e.name||e.ticker,entry:e.entry,exit:s,shares:e.shares||null,cost:e.cost||null,entryStop:e.entryStop||e.stopManual||null,pnlPct:v,pnlAbs:M,stopType:e.stopType,reason:c,notasEntrada:e.notas||"",notasSalida:b,entryDate:w.toLocaleDateString("es-ES"),exitDate:new Date(l).toLocaleDateString("es-ES"),entryDateISO:$,exitDateISO:l,duration:E,closedAt:Date.now()}),u=u.filter(A=>A.ticker!==t),await p(),await m(),fetch("/api/backfill-ticker",{method:"POST",headers:{"Content-Type":"application/json","X-ETHAN-Client":"true"},body:JSON.stringify({ticker:e.ticker,dateFrom:$,dateTo:l,status:"inactive"})}).catch(()=>{}),o.remove(),h()})}async function B(t,a,i,e){var n,v,w,g,E;const o=`ethan_ph_${t}_${a}_${i}`;if(await N.get(o))return;const l=Math.ceil((new Date(i)-new Date(a))/864e5)+5,c=l>365*1.5?"5y":l>200?"2y":l>60?"6mo":"3mo",b=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${c}`;for(const M of J)try{const $=await fetch(M(b),{signal:AbortSignal.timeout(1e4)});if(!$.ok)continue;const A=JSON.parse(await $.text()),F=(v=(n=A==null?void 0:A.chart)==null?void 0:n.result)==null?void 0:v[0];if(!F)continue;const O=(E=(g=(w=F.indicators)==null?void 0:w.quote)==null?void 0:g[0])==null?void 0:E.close,S=F.timestamp;if(!O||!S)continue;const x=[];S.forEach((k,r)=>{if(O[r]==null)return;const y=new Date(k*1e3).toISOString().slice(0,10);y>=a&&y<=i&&x.push({date:y,price:O[r]})}),x.length>0&&(await N.set(o,{ticker:t,entryDate:a,exitDate:i,direction:e,prices:x}),console.log(`[PriceHistory] Guardado ${t} ${a}→${i}: ${x.length} días`));return}catch($){console.warn(`[PriceHistory] Proxy falló para ${t}:`,$.message)}console.warn(`[PriceHistory] No se pudo guardar historial de ${t} — se usará pnlPct directo`)}function L(t,a){if(t.length===0)return null;const i=t.filter(r=>r.pnlPct>0),e=t.filter(r=>r.pnlPct<=0),o=i.length/t.length*100,s=i.length?i.reduce((r,y)=>r+y.pnlPct,0)/i.length:0,l=e.length?e.reduce((r,y)=>r+y.pnlPct,0)/e.length:0,c=t.reduce((r,y)=>r+y.pnlPct,0)/t.length,b=o/100*s+(1-o/100)*l,n=t.reduce((r,y)=>r+(y.pnlAbs||0),0),v=t.some(r=>r.pnlAbs!=null),w=a>0?n/a*100:null,g=t.reduce((r,y)=>r+(y.duration||0),0)/t.length,E=c,M=t.reduce((r,y)=>r+Math.pow(y.pnlPct-E,2),0)/t.length,$=Math.sqrt(M),A=$>0?c/$:0,F=Math.min(...t.map(r=>r.pnlPct)),O=[...t].sort((r,y)=>(r.closedAt||0)-(y.closedAt||0));let S=100,x=100,k=0;return O.forEach(r=>{S*=1+r.pnlPct/100,S>x&&(x=S);const y=(x-S)/x*100;y>k&&(k=y)}),{nOps:t.length,winRate:o,avgPnlPct:c,expectancy:b,totalPnlAbs:n,hasAbsData:v,totalPnlPctOnCapital:w,avgDays:g,stdDev:$,sharpe:A,maxLoss:F,maxDD:k}}function H(t,a){if(!t)return'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>';const i=(s,l=2)=>s!=null&&!isNaN(s)?s.toFixed(l):"—",e=s=>s>=0?"+":"",o=s=>s>=0?"var(--green)":"var(--red)";return`
      <div class="pos-metrics-grid">
        <div class="pos-mtile"><div class="pos-mtile-lbl">Capital Asignado</div><div class="pos-mtile-val">${a}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Beneficio Total (€)</div><div class="pos-mtile-val" style="color:${t.hasAbsData?o(t.totalPnlAbs):"var(--text3)"}">${t.hasAbsData?e(t.totalPnlAbs)+"$"+i(t.totalPnlAbs,0):"Sin coste asignado"}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Beneficio Total (%)</div><div class="pos-mtile-val" style="color:${t.totalPnlPctOnCapital!=null?o(t.totalPnlPctOnCapital):"var(--text3)"}">${t.totalPnlPctOnCapital!=null?e(t.totalPnlPctOnCapital)+i(t.totalPnlPctOnCapital)+"%":"—"}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ganancia Media</div><div class="pos-mtile-val" style="color:${o(t.avgPnlPct)}">${e(t.avgPnlPct)}${i(t.avgPnlPct)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ratio Win</div><div class="pos-mtile-val" style="color:${t.winRate>=50?"var(--green)":"var(--amber)"}">${i(t.winRate,1)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Esperanza Matemática</div><div class="pos-mtile-val" style="color:${o(t.expectancy)}">${e(t.expectancy)}${i(t.expectancy)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Días Medios / Op.</div><div class="pos-mtile-val">${i(t.avgDays,1)}d</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Ratio Sharpe</div><div class="pos-mtile-val" style="color:${t.sharpe>=1?"var(--green)":t.sharpe>=0?"var(--amber)":"var(--red)"}">${i(t.sharpe)}</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Volatilidad Media</div><div class="pos-mtile-val">${i(t.stdDev)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Máxima Pérdida</div><div class="pos-mtile-val" style="color:var(--red)">${i(t.maxLoss)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Máximo DD</div><div class="pos-mtile-val" style="color:var(--red)">-${i(t.maxDD)}%</div></div>
        <div class="pos-mtile"><div class="pos-mtile-lbl">Nº Operaciones</div><div class="pos-mtile-val">${t.nOps}</div></div>
      </div>`}function T(t,a){if(t.length===0)return'<div class="sc2-empty">Sin operaciones cerradas todavía</div>';const i={stop:"🛑 Stop",objetivo:"🎯 Objetivo",escape:"🚨 Escape falso",condiciones:"📉 Condiciones",manual:"✋ Manual"};return`
      <table class="sc2-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>TICKER</th><th>ENTRADA</th><th>SALIDA</th>
            <th>P&L %</th><th>P&L €</th><th>DURACIÓN</th><th>MOTIVO</th><th>NOTAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>{const o=f.indexOf(e);return`
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
              <td style="font-size:10px;color:var(--text2);">${i[e.reason]||e.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${e.notasSalida||"—"}</td>
              <td><button class="pos-del-btn" data-idx="${o}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>`}let _="alcista",q=null,z=null;async function U(){q=await N.get("ethan_capital_alcista"),z=await N.get("ethan_capital_bajista")}function R(){var c,b;const t=document.getElementById("pos-history");if(!t)return;const a=f.filter(n=>(n.direction||"alcista")==="alcista"),i=f.filter(n=>n.direction==="bajista"),e=q,o=z,s=L(a,e),l=L(i,o);t.innerHTML=`
      <div class="pos-hist-tabs">
        <button class="pos-hist-tab ${_==="alcista"?"active":""}" data-tab="alcista">📈 Alcista (${a.length})</button>
        <button class="pos-hist-tab ${_==="bajista"?"active":""}" data-tab="bajista">📉 Bajista (${i.length})</button>
      </div>

      <div class="pos-hist-panel" id="panel-alcista" style="display:${_==="alcista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Alcista (€)</label>
          <input type="number" id="cap-alcista-input" class="wl-input" style="width:160px;" value="${e??""}" placeholder="ej. 20000">
          <button class="btn" id="cap-alcista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${H(s,e!=null?"$"+e.toFixed(0):"Sin definir")}
        ${T(a)}
      </div>

      <div class="pos-hist-panel" id="panel-bajista" style="display:${_==="bajista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Bajista (€)</label>
          <input type="number" id="cap-bajista-input" class="wl-input" style="width:160px;" value="${o??""}" placeholder="ej. 10000">
          <button class="btn" id="cap-bajista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${H(l,o!=null?"$"+o.toFixed(0):"Sin definir")}
        ${T(i)}
      </div>
    `,t.querySelectorAll(".pos-hist-tab").forEach(n=>{n.addEventListener("click",()=>{_=n.dataset.tab,R()})}),(c=document.getElementById("cap-alcista-save"))==null||c.addEventListener("click",async()=>{const n=parseFloat(document.getElementById("cap-alcista-input").value);if(isNaN(n))return;const v=n,g=v-(q||0);q=v,await N.set("ethan_capital_alcista",q);try{const{getFondo:E,aportarCapital:M,retirarCapital:$,inicializarFondo:A,calcVL:F}=await X(async()=>{const{getFondo:k,aportarCapital:r,retirarCapital:y,inicializarFondo:V,calcVL:W}=await import("./fondo-CuDiLIRT.js");return{getFondo:k,aportarCapital:r,retirarCapital:y,inicializarFondo:V,calcVL:W}},__vite__mapDeps([0,1,2,3])),O=await E(),S=f.filter(k=>(k.direction||"alcista")==="alcista").reduce((k,r)=>k+(r.pnlAbs||0),0),x=v+S;O?g>0?await M(g,x,"Aportación alcista"):g<0&&await $(Math.abs(g),x,"Retirada alcista"):await A(v,new Date().toISOString().slice(0,10))}catch(E){console.warn("Fondo:",E.message)}R()}),(b=document.getElementById("cap-bajista-save"))==null||b.addEventListener("click",async()=>{const n=parseFloat(document.getElementById("cap-bajista-input").value);if(isNaN(n))return;const v=n,g=v-(z||0);z=v,await N.set("ethan_capital_bajista",z);try{const{getFondo:E,aportarCapital:M,retirarCapital:$,inicializarFondo:A}=await X(async()=>{const{getFondo:x,aportarCapital:k,retirarCapital:r,inicializarFondo:y}=await import("./fondo-CuDiLIRT.js");return{getFondo:x,aportarCapital:k,retirarCapital:r,inicializarFondo:y}},__vite__mapDeps([0,1,2,3])),F=await E(),O=f.filter(x=>x.direction==="bajista").reduce((x,k)=>x+(k.pnlAbs||0),0),S=v+O;F?g>0?await M(g,S,"Aportación bajista"):g<0&&await $(Math.abs(g),S,"Retirada bajista"):await A(v,new Date().toISOString().slice(0,10))}catch(E){console.warn("Fondo:",E.message)}R()}),t.querySelectorAll(".pos-del-btn[data-idx]").forEach(n=>{n.addEventListener("click",async()=>{confirm("¿Eliminar esta operación del historial?")&&(f.splice(parseInt(n.dataset.idx),1),await m(),R())})})}return await U(),h(),{destroy(){}}}export{ct as render};
