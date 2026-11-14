const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/fondo-CSS_RoO0.js","assets/userdata-DXI1eA65.js","assets/index-CgF2jx7D.js","assets/index-QgqYHJNn.css"])))=>i.map(i=>d[i]);
import{_ as st}from"./index-CgF2jx7D.js";import{UserData as G}from"./userdata-DXI1eA65.js";const nt="ethan_positions",lt="ethan_positions_history",Y=[d=>`https://api.allorigins.win/raw?url=${encodeURIComponent(d)}`,d=>`https://corsproxy.io/?${encodeURIComponent(d)}`,d=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(d)}`,d=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(d)}`];async function dt(d){var b,I,u,p,L,T;const m=`https://query1.finance.yahoo.com/v8/finance/chart/${d==="3GOL"?"3GOL.MI":d}?interval=1d&range=6mo&events=history`;for(const C of Y)try{const U=new AbortController,W=setTimeout(()=>U.abort(),8e3),A=await fetch(C(m),{signal:U.signal});if(clearTimeout(W),!A.ok)continue;const q=await A.text();let k;try{k=JSON.parse(q)}catch{continue}const N=(I=(b=k==null?void 0:k.chart)==null?void 0:b.result)==null?void 0:I[0];if(!N)continue;const z=(p=(u=N.indicators)==null?void 0:u.quote)==null?void 0:p[0];if(!z)continue;const _=N.meta||{},H=((T=(L=N.indicators.adjclose)==null?void 0:L[0])==null?void 0:T.adjclose)||z.close,O=N.timestamp.map((h,t)=>t).filter(h=>H[h]!=null&&!isNaN(H[h])&&z.high[h]!=null&&z.low[h]!=null);if(!O.length)continue;return{timestamps:O.map(h=>N.timestamp[h]),opens:O.map(h=>z.open[h]),highs:O.map(h=>z.high[h]),lows:O.map(h=>z.low[h]),closes:O.map(h=>H[h]),volumes:O.map(h=>z.volume[h]),name:_.shortName||_.longName||d,currency:_.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function ct(d,j){const m=2/(j+1),b=new Array(d.length).fill(null);let I=d.findIndex(u=>u!=null&&!isNaN(u));if(I<0)return b;b[I]=d[I];for(let u=I+1;u<d.length;u++){const p=d[u]!=null&&!isNaN(d[u])?d[u]:b[u-1];b[u]=p*m+b[u-1]*(1-m)}return b}function pt(d,j,m,b,I,u){const p={};d.forEach((T,C)=>{const U=new Date(T*1e3),W=U.getDay(),A=U.getDate()-W+(W===0?-6:1),q=new Date(+U);q.setDate(A);const k=q.toISOString().slice(0,10);p[k]?(p[k].h=Math.max(p[k].h,m[C]),p[k].l=Math.min(p[k].l,b[C]),p[k].c=I[C],p[k].v+=u[C]):p[k]={o:j[C],h:m[C],l:b[C],c:I[C],v:u[C]}});const L=Object.keys(p).sort();return{opens:L.map(T=>p[T].o),highs:L.map(T=>p[T].h),lows:L.map(T=>p[T].l),closes:L.map(T=>p[T].c)}}function vt(d,j){const m=d.length;if(m<5)return!1;const b=m-1,I=m-2,u=m-3;let p=0;for(let L=Math.max(0,u-10);L<u;L++)p=Math.max(p,d[L]);return d[u]>p&&j[I]<d[u]&&j[b]<d[u]&&j[I]<j[u]&&j[b]<j[I]}function ut(d,j){const{timestamps:m,opens:b,highs:I,lows:u,closes:p,volumes:L,name:T,currency:C}=j,U=p.length,W=U-1;let A=null;for(let e=W;e>=0;e--)if(p[e]!=null&&!isNaN(p[e])&&p[e]>0){A=p[e];break}if(!A)return null;const k=ct(p,10)[W],N=pt(m,b,I,u,p,L),_=ct(N.closes,10)[N.closes.length-1],H=d.stopType==="manual"?d.stopManual:d.stopType==="semanal"?_:k,O=vt(I,p),h=d.direction||"alcista",t=h==="bajista"?(d.entry-A)/d.entry*100:(A-d.entry)/d.entry*100,a=H>0?h==="bajista"?(H-A)/A*100:(A-H)/A*100:0,l=h==="bajista"?A>=H:A<=H;return{currentPrice:A,stopDiario:k,stopSemanal:_,activeStop:H,escapeFalso:O,tocoStop:l,pnlPct:t,distStop:a,name:T,currency:C}}async function yt(d,{actionsSlot:j}){var h;let m=await G.get(nt)||[],b=await G.get(lt)||[];j.innerHTML=`
    <button class="btn btn-primary" id="pos-open-form-btn">+ Nueva posición</button>
  `,d.innerHTML=`
    <div id="pos-form-panel" style="display:none;"></div>
    <div id="pos-list"></div>
  `;function I(){var a,l,e,n,i;const t=document.getElementById("pos-form-panel");t.style.display="block",t.innerHTML=`
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
          <div class="pos-form-field">
            <label>Nombre del activo <span style="color:var(--text3)">(opcional — se rellena automáticamente)</span></label>
            <input type="text" id="pf-name" placeholder="ej. WisdomTree Gold 3x Daily Leveraged" class="wl-input" style="width:100%;">
          </div>
          <div class="pos-form-field">
            <label>Sector</label>
            <select id="pf-sector" class="sc2-sel" style="width:100%;">
              <option value="">— Auto (desde watchlist)</option>
              <option value="tech">Tecnología</option>
              <option value="health">Healthcare</option>
              <option value="energy">Energía</option>
              <option value="finance">Financiero</option>
              <option value="consumer">Consumo Discrecional</option>
              <option value="industrial">Industrial</option>
              <option value="materials">Materiales</option>
              <option value="utilities">Utilities</option>
              <option value="realestate">Real Estate</option>
              <option value="comm">Comunicación</option>
              <option value="staples">Consumo Básico</option>
              <option value="commodities">Commodities</option>
            </select>
          </div>
          <div class="pos-form-field">
            <label>Bucket</label>
            <select id="pf-bucket" class="sc2-sel" style="width:100%;">
              <option value="sat">SATÉLITE</option>
              <option value="core">CORE</option>
            </select>
          </div>
          <div class="pos-form-field">
            <label>Notas</label>
            <input type="text" id="pf-notas" placeholder="Motivo de entrada, contexto..." class="wl-input" style="width:100%;">
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
          <button class="btn" id="pf-cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="pf-add-btn">+ Añadir a cartera</button>
        </div>
      </div>
    `,["pf-entry","pf-shares"].forEach(o=>{var r;(r=document.getElementById(o))==null||r.addEventListener("input",()=>{var v,E;const g=parseFloat(((v=document.getElementById("pf-entry"))==null?void 0:v.value)||0),c=parseFloat(((E=document.getElementById("pf-shares"))==null?void 0:E.value)||0);g>0&&c>0&&(document.getElementById("pf-cost").value=(g*c).toFixed(2))})}),(a=document.getElementById("pf-stop-type"))==null||a.addEventListener("change",o=>{document.getElementById("pf-stop-manual-wrap").style.display=o.target.value==="manual"?"block":"none"}),(l=document.getElementById("pf-search-btn"))==null||l.addEventListener("click",async()=>{var g,c,v,E;const o=(g=document.getElementById("pf-ticker"))==null?void 0:g.value.trim().toUpperCase();if(!o)return;const r=document.getElementById("pf-search-status");r.textContent="Buscando...",r.style.color="var(--text3)";try{const f=(await G.get("ethan_watchlist")||[]).find($=>{var w;return((w=$.ticker)==null?void 0:w.toUpperCase())===o});if(f!=null&&f.sector){const $=document.getElementById("pf-sector");$&&($.value=f.sector)}}catch{}try{const x=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=5d`;let f=!1;for(const $ of Y)try{const w=await fetch($(x),{signal:(()=>{const P=new AbortController;return setTimeout(()=>P.abort(),6e3),P.signal})()});if(!w.ok)continue;const D=JSON.parse(await w.text()),B=(E=(v=(c=D==null?void 0:D.chart)==null?void 0:c.result)==null?void 0:v[0])==null?void 0:E.meta;if(!B)continue;const R=B.shortName||B.longName||o,S=B.regularMarketPrice;document.getElementById("pf-name").value=R,S&&!document.getElementById("pf-entry").value&&(document.getElementById("pf-entry").value=S.toFixed(2)),r.textContent=`✓ Encontrado: ${R}${S?" · $"+S.toFixed(2):""}`,r.style.color="var(--green)",f=!0;break}catch{}f||(r.textContent="⚠ No encontrado en Yahoo · puedes añadirlo manualmente",r.style.color="var(--amber)")}catch{r.textContent="⚠ Error de conexión · puedes añadirlo manualmente",r.style.color="var(--amber)"}}),(e=document.getElementById("pf-ticker"))==null||e.addEventListener("keydown",o=>{var r;o.key==="Enter"&&((r=document.getElementById("pf-search-btn"))==null||r.click()),o.target.value=o.target.value.toUpperCase()}),(n=document.getElementById("pf-cancel-btn"))==null||n.addEventListener("click",()=>{t.style.display="none"}),(i=document.getElementById("pf-add-btn"))==null||i.addEventListener("click",async()=>{var P,M,F,s,y,V,J,X,Q,Z,tt,et,at;const o=((P=document.getElementById("pf-direction"))==null?void 0:P.value)||"alcista",r=(M=document.getElementById("pf-ticker"))==null?void 0:M.value.trim().toUpperCase(),g=parseFloat((F=document.getElementById("pf-entry"))==null?void 0:F.value),c=parseFloat((s=document.getElementById("pf-shares"))==null?void 0:s.value)||null,v=parseFloat((y=document.getElementById("pf-cost"))==null?void 0:y.value)||(g&&c?g*c:null),E=((V=document.getElementById("pf-date"))==null?void 0:V.value)||new Date().toISOString().slice(0,10),x=((J=document.getElementById("pf-stop-type"))==null?void 0:J.value)||"semanal",f=x==="manual"&&parseFloat((X=document.getElementById("pf-stop-manual"))==null?void 0:X.value)||null,$=parseFloat((Q=document.getElementById("pf-entry-stop"))==null?void 0:Q.value)||f||null,w=((Z=document.getElementById("pf-name"))==null?void 0:Z.value.trim())||"",D=((tt=document.getElementById("pf-notas"))==null?void 0:tt.value.trim())||"",B=((et=document.getElementById("pf-sector"))==null?void 0:et.value)||"",R=((at=document.getElementById("pf-bucket"))==null?void 0:at.value)||"sat";if(!r||!g||g<=0){alert("Ticker y precio de entrada son obligatorios.");return}if(m.find(it=>it.ticker===r)){alert(`${r} ya está en cartera.`);return}let S=B;if(!S)try{const K=(await G.get("ethan_watchlist")||[]).find(rt=>{var ot;return((ot=rt.ticker)==null?void 0:ot.toUpperCase())===r});K!=null&&K.sector&&(S=K.sector)}catch{}m.push({direction:o,ticker:r,name:w,entry:g,shares:c,cost:v,entryDate:E,stopType:x,stopManual:f,entryStop:$,notas:D,sector:S,bucket:R,addedAt:new Date(E).getTime()||Date.now()}),await u(),fetch("/api/backfill-ticker",{method:"POST",headers:{"Content-Type":"application/json","X-ETHAN-Client":"true"},body:JSON.stringify({ticker:r,dateFrom:E,dateTo:new Date().toISOString().slice(0,10),status:"active",forceRefresh:!0})}).catch(()=>{}),t.style.display="none",C()})}(h=document.getElementById("pos-open-form-btn"))==null||h.addEventListener("click",I);async function u(){await G.set(nt,m)}async function p(){await G.set(lt,b)}function L(t,a,l=!1){var c;const e=(a==null?void 0:a.pnlPct)>0?"var(--green)":(a==null?void 0:a.pnlPct)<0?"var(--red)":"var(--text2)",n=(a==null?void 0:a.pnlPct)>0?"+":"",i=v=>v!=null?"$"+v.toFixed(2):"—",o=v=>v!=null?v.toFixed(1)+"%":"—";if(l)return`
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
      </div>`;const r=((a.currentPrice-a.stopDiario)/a.currentPrice*100).toFixed(1),g=((a.currentPrice-a.stopSemanal)/a.currentPrice*100).toFixed(1);return`
      <div class="pos-card ${a.tocoStop?"stop-hit":""} ${a.escapeFalso?"escape-alert-card":""}" id="poscard-${t.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${t.ticker} <span class="pos-dir-badge ${t.direction==="bajista"?"short":"long"}">${t.direction==="bajista"?"📉 SHORT":"📈 LONG"}</span></div>
            <div class="pos-name">${a.name||""} · ${a.currency||"USD"}</div>
            ${t.notas?`<div class="pos-notas">${t.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${t.ticker}" data-price="${((c=a.currentPrice)==null?void 0:c.toFixed(2))||""}" title="Cerrar posición">✓ Cerrar</button>
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
            <div class="pos-metric-val" style="color:${e}">${n}${o(a.pnlPct)}</div>
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
            <span class="pos-stop-dist">(${r}%)</span>
          </div>
          <div class="pos-stop-row ${t.stopType==="semanal"?"active":""}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${i(a.stopSemanal)}</span>
            <span class="pos-stop-dist">(${g}%)</span>
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
      </div>`}function T(){document.querySelectorAll(".pos-del-btn:not([data-idx])").forEach(t=>{t.addEventListener("click",async()=>{confirm(`¿Eliminar ${t.dataset.ticker} sin guardar en historial?`)&&(m=m.filter(a=>a.ticker!==t.dataset.ticker),await u(),C())})}),document.querySelectorAll(".pos-close-btn").forEach(t=>{t.addEventListener("click",()=>U(t.dataset.ticker,parseFloat(t.dataset.price)))})}async function C(){const t=document.getElementById("pos-list");if(t){if(m.length===0){t.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`,O();return}t.innerHTML=`
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${m.length})</div>
        ${m.map(a=>L(a,null,!0)).join("")}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`,O(),await Promise.all(m.map(async a=>{var l;try{const e=await dt(a.ticker),n=ut(a,e);let i=!1;n.currentPrice&&n.currentPrice!==a.currentPrice&&(a.currentPrice=n.currentPrice,a.prevPrice=((l=e.closes)==null?void 0:l[e.closes.length-2])||n.currentPrice,i=!0),n.stopDiario&&n.stopDiario!==a.stopDiario&&(a.stopDiario=n.stopDiario,a.stopSemanal=n.stopSemanal,a.activeStop=n.activeStop,i=!0),i&&await u();const o=document.getElementById(`poscard-${a.ticker}`);o&&(o.outerHTML=L(a,n))}catch{const e=document.getElementById(`poscard-${a.ticker}`);e&&(e.outerHTML=L(a,null))}})),T()}}function U(t,a){const l=document.getElementById("pos-close-modal");l&&l.remove();const e=m.find(i=>i.ticker===t);if(!e)return;const n=document.createElement("div");n.id="pos-close-modal",n.innerHTML=`
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
      </div>`,document.body.appendChild(n),document.getElementById("close-cancel").addEventListener("click",()=>n.remove()),n.querySelector(".pos-modal-overlay").addEventListener("click",i=>{i.target===i.currentTarget&&n.remove()}),document.getElementById("close-price").addEventListener("input",i=>{const o=parseFloat(i.target.value),r=n.querySelector(".pos-modal-pnl");if(r&&o>0){const g=((o-e.entry)/e.entry*100).toFixed(2);r.innerHTML=`P&L: <strong style="color:${o>=e.entry?"var(--green)":"var(--red)"}">${o>=e.entry?"+":""}${g}%</strong>`}}),document.getElementById("close-confirm").addEventListener("click",async()=>{const i=parseFloat(document.getElementById("close-price").value),o=document.getElementById("close-date").value,r=document.getElementById("close-reason").value,g=document.getElementById("close-notas").value;if(!i||i<=0){alert("Introduce el precio de cierre");return}const c=e.direction||"alcista",v=c==="bajista"?(e.entry-i)/e.entry*100:(i-e.entry)/e.entry*100,E=e.entryDate?new Date(e.entryDate):new Date(e.addedAt),x=new Date(o),f=Math.max(0,Math.round((x-E)/864e5)),$=e.cost?e.cost*v/100:null,w=E.toISOString().slice(0,10);await W(e.ticker,w,o,c),b.unshift({direction:c,ticker:e.ticker,name:e.name||e.ticker,entry:e.entry,exit:i,shares:e.shares||null,cost:e.cost||null,entryStop:e.initialStop||e.entryStop||e.stopManual||null,initialStop:e.initialStop||e.entryStop||e.stopManual||null,pnlPct:v,pnlAbs:$,stopType:e.stopType,reason:r,notasEntrada:e.notas||"",notasSalida:g,entryDate:E.toLocaleDateString("es-ES"),exitDate:new Date(o).toLocaleDateString("es-ES"),entryDateISO:w,exitDateISO:o,duration:f,closedAt:Date.now(),source:e.source||null,sizingId:e.sizingId||null,authorizedShares:e.authorizedShares||null,executedShares:e.executedShares||null,policyVersion:e.policyVersion||null,executionStatus:e.executionStatus||null}),m=m.filter(D=>D.ticker!==t),await u(),await p(),fetch("/api/backfill-ticker",{method:"POST",headers:{"Content-Type":"application/json","X-ETHAN-Client":"true"},body:JSON.stringify({ticker:e.ticker,dateFrom:w,dateTo:o,status:"inactive"})}).catch(()=>{}),n.remove(),C()})}async function W(t,a,l,e){var c,v,E,x,f;const n=`ethan_ph_${t}_${a}_${l}`;if(await G.get(n))return;const o=Math.ceil((new Date(l)-new Date(a))/864e5)+5,r=o>365*1.5?"5y":o>200?"2y":o>60?"6mo":"3mo",g=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${r}`;for(const $ of Y)try{const w=await fetch($(g),{signal:(()=>{const M=new AbortController;return setTimeout(()=>M.abort(),1e4),M.signal})()});if(!w.ok)continue;const D=JSON.parse(await w.text()),B=(v=(c=D==null?void 0:D.chart)==null?void 0:c.result)==null?void 0:v[0];if(!B)continue;const R=(f=(x=(E=B.indicators)==null?void 0:E.quote)==null?void 0:x[0])==null?void 0:f.close,S=B.timestamp;if(!R||!S)continue;const P=[];S.forEach((M,F)=>{if(R[F]==null)return;const s=new Date(M*1e3).toISOString().slice(0,10);s>=a&&s<=l&&P.push({date:s,price:R[F]})}),P.length>0&&(await G.set(n,{ticker:t,entryDate:a,exitDate:l,direction:e,prices:P}),console.log(`[PriceHistory] Guardado ${t} ${a}→${l}: ${P.length} días`));return}catch(w){console.warn(`[PriceHistory] Proxy falló para ${t}:`,w.message)}console.warn(`[PriceHistory] No se pudo guardar historial de ${t} — se usará pnlPct directo`)}function A(t,a){if(t.length===0)return null;const l=t.filter(s=>s.pnlPct>0),e=t.filter(s=>s.pnlPct<=0),n=l.length/t.length*100,i=l.length?l.reduce((s,y)=>s+y.pnlPct,0)/l.length:0,o=e.length?e.reduce((s,y)=>s+y.pnlPct,0)/e.length:0,r=t.reduce((s,y)=>s+y.pnlPct,0)/t.length,g=n/100*i+(1-n/100)*o,c=t.reduce((s,y)=>s+(y.pnlAbs||0),0),v=t.some(s=>s.pnlAbs!=null),E=a>0?c/a*100:null,x=t.reduce((s,y)=>s+(y.duration||0),0)/t.length,f=t.filter(s=>s.pnlPct>0),$=t.filter(s=>s.pnlPct<=0),w=f.length?f.reduce((s,y)=>s+y.pnlPct,0)/f.length:0,D=$.length?Math.abs($.reduce((s,y)=>s+y.pnlPct,0)/$.length):0,B=D>0?w/D:null,R=f.reduce((s,y)=>s+(y.pnlAbs||0),0),S=Math.abs($.reduce((s,y)=>s+(y.pnlAbs||0),0)),P=S>0?R/S:null,M=Math.max(...t.map(s=>s.pnlPct)),F=Math.min(...t.map(s=>s.pnlPct));return{nOps:t.length,winRate:n,avgPnlPct:r,expectancy:g,totalPnlAbs:c,hasAbsData:v,totalPnlPctOnCapital:E,avgDays:x,maxLoss:F,avgWin:w,avgLoss:D,payoff:B,profitFactor:P,maxWin:M}}function q(t,a){if(!t)return'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>';const l=(o,r=2)=>o!=null&&!isNaN(o)?o.toFixed(r):"—",e=o=>o>=0?"+":"",n=o=>o>=0?"var(--green)":"var(--red)",i=(o,r,g,c="")=>`
      <div class="pos-mtile">
        <div class="pos-mtile-lbl">${o}</div>
        <div class="pos-mtile-val" style="${c?"color:"+c:""}">${r}</div>
        <div style="font-size:9px;color:var(--text3);margin-top:4px;line-height:1.4;">${g}</div>
      </div>`;return`
      <div class="pos-metrics-grid">
        ${i("Capital Asignado",a,"Capital de referencia asignado a esta estrategia.")}
        ${i("Beneficio Total (€)",t.hasAbsData?e(t.totalPnlAbs)+"$"+l(t.totalPnlAbs,0):"Sin coste asignado","Suma del P&L realizado de todas las operaciones cerradas.",t.hasAbsData?n(t.totalPnlAbs):"")}
        ${i("Beneficio Total (%)",t.totalPnlPctOnCapital!=null?e(t.totalPnlPctOnCapital)+l(t.totalPnlPctOnCapital)+"%":"—","Rentabilidad acumulada sobre el capital asignado.",t.totalPnlPctOnCapital!=null?n(t.totalPnlPctOnCapital):"")}
        ${i("Rent. media / op.",e(t.avgPnlPct)+l(t.avgPnlPct)+"%","Rentabilidad media de todas las operaciones cerradas.",n(t.avgPnlPct))}
        ${i("Win Rate",l(t.winRate,1)+"%","Porcentaje de operaciones cerradas con beneficio.",t.winRate>=50?"var(--green)":"var(--amber)")}
        ${i("Esperanza / op.",e(t.expectancy)+l(t.expectancy)+"%","Retorno histórico esperado por operación según Win Rate, Avg Win y Avg Loss.",n(t.expectancy))}
        ${i("Avg Win","+"+l(t.avgWin)+"%","Rentabilidad media de las operaciones ganadoras.","var(--green)")}
        ${i("Avg Loss","-"+l(t.avgLoss)+"%","Pérdida media de las operaciones perdedoras.","var(--red)")}
        ${i("Payoff",l(t.payoff),"Ganancia media / pérdida media. >1 = favorable.",t.payoff>=1.5?"var(--green)":"var(--amber)")}
        ${i("Profit Factor",l(t.profitFactor),"Ganancias brutas (€) / pérdidas brutas (€). >1 = sistema rentable.",t.profitFactor>=1.5?"var(--green)":"var(--amber)")}
        ${i("Días Medios / Op.",l(t.avgDays,1)+"d","Duración media de las operaciones cerradas.")}
        ${i("Mejor Operación","+"+l(t.maxWin)+"%","Mayor rentabilidad obtenida en una operación cerrada.","var(--green)")}
        ${i("Peor Operación",l(t.maxLoss)+"%","Mayor pérdida registrada en una operación cerrada.","var(--red)")}
        ${i("Nº Operaciones",t.nOps,"Número total de operaciones cerradas analizadas.")}
      </div>`}function k(t,a){if(t.length===0)return'<div class="sc2-empty">Sin operaciones cerradas todavía</div>';const l={stop:"🛑 Stop",objetivo:"🎯 Objetivo",escape:"🚨 Escape falso",condiciones:"📉 Condiciones",manual:"✋ Manual"};return`
      <table class="sc2-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>TICKER</th><th>ENTRADA</th><th>SALIDA</th>
            <th>CAPITAL</th><th>P&L %</th><th>P&L €</th><th>DURACIÓN</th><th>MOTIVO</th><th>NOTAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>{const n=b.indexOf(e),i=e.cost||(e.shares&&e.entry?e.shares*e.entry:null);return`
            <tr>
              <td>
                <div class="sc2-ticker">${e.ticker} <span class="pos-dir-badge ${e.direction==="bajista"?"short":"long"}" style="font-size:7px;">${e.direction==="bajista"?"SHORT":"LONG"}</span></div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${e.entryDate} → ${e.exitDate}</div>
              </td>
              <td class="sc2-price">$${e.entry.toFixed(2)}</td>
              <td class="sc2-price">$${e.exit.toFixed(2)}</td>
              <td class="sc2-price" style="color:var(--text2);">${i?"$"+Math.round(i).toLocaleString("es-ES"):"—"}</td>
              <td class="sc2-score" style="color:${e.pnlPct>=0?"var(--green)":"var(--red)"}">${e.pnlPct>=0?"+":""}${e.pnlPct.toFixed(2)}%</td>
              <td class="sc2-price" style="color:${e.pnlAbs!=null?e.pnlAbs>=0?"var(--green)":"var(--red)":"var(--text3)"}">${e.pnlAbs!=null?(e.pnlAbs>=0?"+":"")+"$"+e.pnlAbs.toFixed(0):"—"}</td>
              <td class="sc2-vol">${e.duration}d</td>
              <td style="font-size:10px;color:var(--text2);">${l[e.reason]||e.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${e.notasSalida||"—"}</td>
              <td><button class="pos-del-btn" data-idx="${n}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>`}let N="alcista",z=null,_=null;async function H(){z=await G.get("ethan_capital_alcista"),_=await G.get("ethan_capital_bajista")}function O(){var r,g;const t=document.getElementById("pos-history");if(!t)return;const a=b.filter(c=>(c.direction||"alcista")==="alcista"),l=b.filter(c=>c.direction==="bajista"),e=z,n=_,i=A(a,e),o=A(l,n);t.innerHTML=`
      <div class="pos-hist-tabs">
        <button class="pos-hist-tab ${N==="alcista"?"active":""}" data-tab="alcista">📈 Alcista (${a.length})</button>
        <button class="pos-hist-tab ${N==="bajista"?"active":""}" data-tab="bajista">📉 Bajista (${l.length})</button>
      </div>

      <div class="pos-hist-panel" id="panel-alcista" style="display:${N==="alcista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Alcista (€)</label>
          <input type="number" id="cap-alcista-input" class="wl-input" style="width:160px;" value="${e??""}" placeholder="ej. 20000">
          <button class="btn" id="cap-alcista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${q(i,e!=null?"$"+e.toFixed(0):"Sin definir")}
        ${k(a)}
      </div>

      <div class="pos-hist-panel" id="panel-bajista" style="display:${N==="bajista"?"block":"none"}">
        <div class="pos-capital-row">
          <label>Capital asignado a Bajista (€)</label>
          <input type="number" id="cap-bajista-input" class="wl-input" style="width:160px;" value="${n??""}" placeholder="ej. 10000">
          <button class="btn" id="cap-bajista-save" style="font-size:10px;">Guardar</button>
        </div>
        ${q(o,n!=null?"$"+n.toFixed(0):"Sin definir")}
        ${k(l)}
      </div>
    `,t.querySelectorAll(".pos-hist-tab").forEach(c=>{c.addEventListener("click",()=>{N=c.dataset.tab,O()})}),(r=document.getElementById("cap-alcista-save"))==null||r.addEventListener("click",async()=>{var f;const c=parseFloat(document.getElementById("cap-alcista-input").value);if(isNaN(c))return;const v=c,x=v-(z||0);if(z=v,await G.set("ethan_capital_alcista",z),x!==0)try{const{getFondo:$,aportarCapital:w,retirarCapital:D,inicializarFondo:B,calcVL:R}=await st(async()=>{const{getFondo:F,aportarCapital:s,retirarCapital:y,inicializarFondo:V,calcVL:J}=await import("./fondo-CSS_RoO0.js");return{getFondo:F,aportarCapital:s,retirarCapital:y,inicializarFondo:V,calcVL:J}},__vite__mapDeps([0,1,2,3])),S=await $(),P=b.filter(F=>(F.direction||"alcista")==="alcista").reduce((F,s)=>F+(s.pnlAbs||0),0),M=v+P;if(!S)await B(v,new Date().toISOString().slice(0,10));else{const F=((f=S.movimientos)==null?void 0:f.reduce((s,y)=>y.tipo==="inicio"||y.tipo==="aportacion"?s+y.importe:s-Math.abs(y.importe),0))||0;Math.abs(F-v)>1&&(x>0?await w(x,M,"Aportación alcista"):await D(Math.abs(x),M,"Retirada alcista"))}}catch($){console.warn("Fondo:",$.message)}O()}),(g=document.getElementById("cap-bajista-save"))==null||g.addEventListener("click",async()=>{const c=parseFloat(document.getElementById("cap-bajista-input").value);if(isNaN(c))return;const v=c,x=v-(_||0);_=v,await G.set("ethan_capital_bajista",_);try{const{getFondo:f,aportarCapital:$,retirarCapital:w,inicializarFondo:D}=await st(async()=>{const{getFondo:P,aportarCapital:M,retirarCapital:F,inicializarFondo:s}=await import("./fondo-CSS_RoO0.js");return{getFondo:P,aportarCapital:M,retirarCapital:F,inicializarFondo:s}},__vite__mapDeps([0,1,2,3])),B=await f(),R=b.filter(P=>P.direction==="bajista").reduce((P,M)=>P+(M.pnlAbs||0),0),S=v+R;B?x>0?await $(x,S,"Aportación bajista"):x<0&&await w(Math.abs(x),S,"Retirada bajista"):await D(v,new Date().toISOString().slice(0,10))}catch(f){console.warn("Fondo:",f.message)}O()}),t.querySelectorAll(".pos-del-btn[data-idx]").forEach(c=>{c.addEventListener("click",async()=>{confirm("¿Eliminar esta operación del historial?")&&(b.splice(parseInt(c.dataset.idx),1),await p(),O())})})}return await H(),C(),{destroy(){}}}export{yt as render};
