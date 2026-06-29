import{U as k}from"./userdata-pvr7nrrX.js";import"./index-DOO7AhzC.js";const S="ethan_positions",P="ethan_positions_history",T=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function M(a){var l,n,d,c;const y=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=1y&events=history`;for(const i of T)try{const f=await fetch(i(y),{signal:AbortSignal.timeout(8e3)});if(!f.ok)continue;const v=await f.text();let m;try{m=JSON.parse(v)}catch{continue}const $=(n=(l=m==null?void 0:m.chart)==null?void 0:l.result)==null?void 0:n[0];if(!$)continue;const g=(c=(d=$.indicators)==null?void 0:d.quote)==null?void 0:c[0];if(!g)continue;const E=$.meta||{};return{timestamps:$.timestamp,opens:g.open,highs:g.high,lows:g.low,closes:g.close,volumes:g.volume,name:E.shortName||E.longName||a,currency:E.currency||"USD"}}catch{}throw new Error("Sin datos disponibles")}function I(a,y){const l=2/(y+1),n=new Array(a.length).fill(null);let d=a.findIndex(c=>c!=null&&!isNaN(c));if(d<0)return n;n[d]=a[d];for(let c=d+1;c<a.length;c++){const i=a[c]!=null&&!isNaN(a[c])?a[c]:n[c-1];n[c]=i*l+n[c-1]*(1-l)}return n}function C(a,y,l,n,d,c){const i={};a.forEach((v,m)=>{const $=new Date(v*1e3),g=$.getDay(),E=$.getDate()-g+(g===0?-6:1),e=new Date(+$);e.setDate(E);const t=e.toISOString().slice(0,10);i[t]?(i[t].h=Math.max(i[t].h,l[m]),i[t].l=Math.min(i[t].l,n[m]),i[t].c=d[m],i[t].v+=c[m]):i[t]={o:y[m],h:l[m],l:n[m],c:d[m],v:c[m]}});const f=Object.keys(i).sort();return{opens:f.map(v=>i[v].o),highs:f.map(v=>i[v].h),lows:f.map(v=>i[v].l),closes:f.map(v=>i[v].c)}}function B(a,y){const l=a.length;if(l<5)return!1;const n=l-1,d=l-2,c=l-3;let i=0;for(let f=Math.max(0,c-10);f<c;f++)i=Math.max(i,a[f]);return a[c]>i&&y[d]<a[c]&&y[n]<a[c]&&y[d]<y[c]&&y[n]<y[d]}function F(a,y){const{timestamps:l,opens:n,highs:d,lows:c,closes:i,volumes:f,name:v,currency:m}=y,$=i.length,g=$-1,E=i[g],t=I(i,10)[g],u=C(l,n,d,c,i,f),p=I(u.closes,10)[u.closes.length-1],r=a.stopType==="semanal"?p:t,h=B(d,i),s=(E-a.entry)/a.entry*100,b=(E-r)/E*100,w=E<=r*1.005;return{currentPrice:E,stopDiario:t,stopSemanal:p,activeStop:r,escapeFalso:h,tocoStop:w,pnlPct:s,distStop:b,name:v,currency:m}}async function N(a,{actionsSlot:y}){var g,E;let l=await k.get(S)||[],n=await k.get(P)||[];y.innerHTML=`
    <div class="pos-add-bar">
      <input type="text" id="pos-ticker" placeholder="Ticker" class="wl-input" style="width:110px;text-transform:uppercase;" autocomplete="off">
      <input type="number" id="pos-entry" placeholder="Precio entrada" class="wl-input" style="width:150px;" step="0.01">
      <select id="pos-stop-type" class="sc2-sel">
        <option value="semanal">Stop EMA10 Semanal</option>
        <option value="diario">Stop EMA10 Diario</option>
      </select>
      <input type="text" id="pos-notas" placeholder="Notas (opcional)" class="wl-input" style="width:160px;">
      <button class="btn btn-primary" id="pos-add-btn">+ Añadir posición</button>
    </div>
  `,a.innerHTML='<div id="pos-list"></div>';async function d(){await k.set(S,l)}async function c(){await k.set(P,n)}function i(e,t,u=!1){var w;const o=(t==null?void 0:t.pnlPct)>0?"var(--green)":(t==null?void 0:t.pnlPct)<0?"var(--red)":"var(--text2)",p=(t==null?void 0:t.pnlPct)>0?"+":"",r=x=>x!=null?"$"+x.toFixed(2):"—",h=x=>x!=null?x.toFixed(1)+"%":"—";if(u)return`
      <div class="pos-card loading" id="poscard-${e.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${e.ticker}</div><div class="pos-name">Cargando...</div></div>
          <span class="wl-spinner"></span>
        </div>
      </div>`;if(!t)return`
      <div class="pos-card error" id="poscard-${e.ticker}">
        <div class="pos-card-header">
          <div><div class="pos-ticker">${e.ticker}</div><div class="pos-name" style="color:var(--red)">Error al cargar</div></div>
          <button class="pos-del-btn" data-ticker="${e.ticker}">✕</button>
        </div>
      </div>`;const s=((t.currentPrice-t.stopDiario)/t.currentPrice*100).toFixed(1),b=((t.currentPrice-t.stopSemanal)/t.currentPrice*100).toFixed(1);return`
      <div class="pos-card ${t.tocoStop?"stop-hit":""} ${t.escapeFalso?"escape-alert-card":""}" id="poscard-${e.ticker}">
        <div class="pos-card-header">
          <div>
            <div class="pos-ticker">${e.ticker}</div>
            <div class="pos-name">${t.name||""} · ${t.currency||"USD"}</div>
            ${e.notas?`<div class="pos-notas">${e.notas}</div>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="pos-close-btn" data-ticker="${e.ticker}" data-price="${((w=t.currentPrice)==null?void 0:w.toFixed(2))||""}" title="Cerrar posición">✓ Cerrar</button>
            <button class="pos-del-btn" data-ticker="${e.ticker}" title="Eliminar sin guardar">✕</button>
          </div>
        </div>

        <div class="pos-metrics">
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Actual</div>
            <div class="pos-metric-val">${r(t.currentPrice)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Precio Entrada</div>
            <div class="pos-metric-val" style="color:var(--text2)">${r(e.entry)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">P&L</div>
            <div class="pos-metric-val" style="color:${o}">${p}${h(t.pnlPct)}</div>
          </div>
          <div class="pos-metric">
            <div class="pos-metric-label">Stop Activo (${e.stopType==="semanal"?"Semanal":"Diario"})</div>
            <div class="pos-metric-val" style="color:var(--red)">${r(t.activeStop)}</div>
          </div>
        </div>

        <div class="pos-stops">
          <div class="pos-stop-row ${e.stopType==="diario"?"active":""}">
            <span class="pos-stop-label">EMA10 Diario</span>
            <span class="pos-stop-val">${r(t.stopDiario)}</span>
            <span class="pos-stop-dist">(${s}%)</span>
          </div>
          <div class="pos-stop-row ${e.stopType==="semanal"?"active":""}">
            <span class="pos-stop-label">EMA10 Semanal</span>
            <span class="pos-stop-val">${r(t.stopSemanal)}</span>
            <span class="pos-stop-dist">(${b}%)</span>
          </div>
        </div>

        ${t.tocoStop?`
          <div class="pos-alert stop">
            <span class="pos-alert-icon">🛑</span>
            <div>
              <div class="pos-alert-title">STOP TOCADO — EMA10 ${e.stopType==="semanal"?"SEMANAL":"DIARIO"}</div>
              <div class="pos-alert-desc">El precio ha alcanzado tu stop dinámico en ${r(t.activeStop)}. Considera cerrar la posición.</div>
            </div>
          </div>`:""}

        ${t.escapeFalso?`
          <div class="pos-alert escape">
            <span class="pos-alert-icon">🚨</span>
            <div>
              <div class="pos-alert-title">ESCAPE FALSO DETECTADO</div>
              <div class="pos-alert-desc">El precio hizo nuevo máximo pero cerró por debajo. Señal de debilidad — considera salir antes del stop.</div>
            </div>
          </div>`:""}
      </div>`}function f(){document.querySelectorAll(".pos-del-btn:not([data-idx])").forEach(e=>{e.addEventListener("click",async()=>{confirm(`¿Eliminar ${e.dataset.ticker} sin guardar en historial?`)&&(l=l.filter(t=>t.ticker!==e.dataset.ticker),await d(),v())})}),document.querySelectorAll(".pos-close-btn").forEach(e=>{e.addEventListener("click",()=>m(e.dataset.ticker,parseFloat(e.dataset.price)))})}async function v(){const e=document.getElementById("pos-list");if(e){if(l.length===0){e.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📊</div>
          <div class="empty-title">Sin posiciones abiertas</div>
          <div class="empty-desc">Añade un ticker, precio de entrada y tipo de stop arriba.</div>
        </div>
        <div class="pos-hist-section">
          <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
          <div id="pos-history"></div>
        </div>`,$();return}e.innerHTML=`
      <div class="pos-open-section">
        <div class="pos-section-title">📂 Posiciones abiertas (${l.length})</div>
        ${l.map(t=>i(t,null,!0)).join("")}
      </div>
      <div class="pos-hist-section">
        <div class="pos-hist-title">📋 Historial de operaciones cerradas</div>
        <div id="pos-history"></div>
      </div>`,$(),await Promise.all(l.map(async t=>{try{const u=await M(t.ticker),o=F(t,u),p=document.getElementById(`poscard-${t.ticker}`);p&&(p.outerHTML=i(t,o))}catch{const u=document.getElementById(`poscard-${t.ticker}`);u&&(u.outerHTML=i(t,null))}})),f()}}function m(e,t){const u=document.getElementById("pos-close-modal");u&&u.remove();const o=l.find(r=>r.ticker===e);if(!o)return;const p=document.createElement("div");p.id="pos-close-modal",p.innerHTML=`
      <div class="pos-modal-overlay">
        <div class="pos-modal">
          <div class="pos-modal-title">Cerrar posición · ${e}</div>
          <div class="pos-modal-body">
            <div class="pos-modal-row">
              <label>Precio de cierre</label>
              <input type="number" id="close-price" value="${t||""}" step="0.01" class="wl-input" style="width:140px;">
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
            ${t?`
            <div class="pos-modal-pnl">
              P&L estimado: <strong style="color:${t>=o.entry?"var(--green)":"var(--red)"}">
                ${t>=o.entry?"+":""}${((t-o.entry)/o.entry*100).toFixed(2)}%
              </strong>
            </div>`:""}
          </div>
          <div class="pos-modal-footer">
            <button class="btn" id="close-cancel">Cancelar</button>
            <button class="btn btn-primary" id="close-confirm">Confirmar cierre</button>
          </div>
        </div>
      </div>`,document.body.appendChild(p),document.getElementById("close-cancel").addEventListener("click",()=>p.remove()),p.querySelector(".pos-modal-overlay").addEventListener("click",r=>{r.target===r.currentTarget&&p.remove()}),document.getElementById("close-price").addEventListener("input",r=>{const h=parseFloat(r.target.value),s=p.querySelector(".pos-modal-pnl");if(s&&h>0){const b=((h-o.entry)/o.entry*100).toFixed(2);s.innerHTML=`P&L: <strong style="color:${h>=o.entry?"var(--green)":"var(--red)"}">${h>=o.entry?"+":""}${b}%</strong>`}}),document.getElementById("close-confirm").addEventListener("click",async()=>{const r=parseFloat(document.getElementById("close-price").value),h=document.getElementById("close-date").value,s=document.getElementById("close-reason").value,b=document.getElementById("close-notas").value;if(!r||r<=0){alert("Introduce el precio de cierre");return}const w=(r-o.entry)/o.entry*100,x=new Date(o.addedAt),D=new Date(h),A=Math.round((D-x)/864e5);n.unshift({ticker:o.ticker,name:o.name||o.ticker,entry:o.entry,exit:r,pnlPct:w,stopType:o.stopType,reason:s,notasEntrada:o.notas||"",notasSalida:b,entryDate:new Date(o.addedAt).toLocaleDateString("es-ES"),exitDate:new Date(h).toLocaleDateString("es-ES"),duration:A,closedAt:Date.now()}),l=l.filter(L=>L.ticker!==e),await d(),await c(),p.remove(),v()})}function $(){const e=document.getElementById("pos-history");if(!e)return;if(n.length===0){e.innerHTML='<div class="sc2-empty">Sin posiciones cerradas todavía</div>';return}const t=n.filter(s=>s.pnlPct>0).length,u=n.filter(s=>s.pnlPct<=0).length,o=n.reduce((s,b)=>s+b.pnlPct,0)/n.length,p=Math.max(...n.map(s=>s.pnlPct)),r=Math.min(...n.map(s=>s.pnlPct)),h={stop:"🛑 Stop",objetivo:"🎯 Objetivo",escape:"🚨 Escape falso",condiciones:"📉 Condiciones",manual:"✋ Manual"};e.innerHTML=`
      <!-- Resumen estadístico -->
      <div class="pos-hist-stats">
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val">${n.length}</div>
          <div class="pos-hist-stat-lbl">Operaciones</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">${t}</div>
          <div class="pos-hist-stat-lbl">Ganadoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${u}</div>
          <div class="pos-hist-stat-lbl">Perdedoras</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:${o>=0?"var(--green)":"var(--red)"}">${o>=0?"+":""}${o.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">P&L medio</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--green)">+${p.toFixed(1)}%</div>
          <div class="pos-hist-stat-lbl">Mejor op.</div>
        </div>
        <div class="pos-hist-stat">
          <div class="pos-hist-stat-val" style="color:var(--red)">${r.toFixed(1)}%</div>
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
          ${n.map((s,b)=>`
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
              <td style="font-size:10px;color:var(--text2);">${h[s.reason]||s.reason}</td>
              <td style="font-size:9px;color:var(--text3);max-width:180px;">${s.notasSalida||"—"}</td>
              <td>
                <button class="pos-del-btn" data-idx="${b}" title="Eliminar del historial" style="font-size:10px;padding:2px 6px;">✕</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`,e.querySelectorAll(".pos-del-btn[data-idx]").forEach(s=>{s.addEventListener("click",async()=>{confirm("¿Eliminar esta operación del historial?")&&(n.splice(parseInt(s.dataset.idx),1),await c(),$())})})}return(g=document.getElementById("pos-add-btn"))==null||g.addEventListener("click",async()=>{var p,r,h,s;const e=(p=document.getElementById("pos-ticker"))==null?void 0:p.value.trim().toUpperCase(),t=parseFloat((r=document.getElementById("pos-entry"))==null?void 0:r.value),u=((h=document.getElementById("pos-stop-type"))==null?void 0:h.value)||"semanal",o=((s=document.getElementById("pos-notas"))==null?void 0:s.value.trim())||"";if(!e||!t||t<=0){alert("Completa el ticker y el precio de entrada.");return}if(l.find(b=>b.ticker===e)){alert(`${e} ya está en cartera.`);return}l.push({ticker:e,entry:t,stopType:u,notas:o,addedAt:Date.now()}),await d(),document.getElementById("pos-ticker").value="",document.getElementById("pos-entry").value="",document.getElementById("pos-notas").value="",v()}),["pos-ticker","pos-entry","pos-notas"].forEach(e=>{var t;(t=document.getElementById(e))==null||t.addEventListener("keydown",u=>{var o;u.key==="Enter"&&((o=document.getElementById("pos-add-btn"))==null||o.click())})}),(E=document.getElementById("pos-ticker"))==null||E.addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase()}),v(),{destroy(){}}}export{N as render};
