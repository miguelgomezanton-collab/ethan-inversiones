import{g as h}from"./macro-data-Bc3_xk8a.js";const $=["creditoVsNominal","impulsoCrediticio","putCall"];async function E(u,{actionsSlot:m}){m.innerHTML=`
    <button class="btn" id="btn-edit-manual">✎ Editar pendientes</button>
    <button class="btn btn-primary" id="btn-refresh">↻ Actualizar</button>
  `,u.innerHTML='<div id="indicadores-content"><div class="empty"><div class="loader-ring"></div></div></div>';const v=document.getElementById("indicadores-content");let t={};try{t=JSON.parse(sessionStorage.getItem("ethan_macro_manual")||"{}")}catch{}async function p(e=!1){v.innerHTML='<div class="empty"><div class="loader-ring"></div></div>';try{const i=await f(e);g(i)}catch(i){v.innerHTML=`
        <div class="empty">
          <div class="empty-icon">⚠</div>
          <div class="empty-title">Error al cargar indicadores</div>
          <div class="empty-desc">${i.message}</div>
        </div>
      `}}async function f(e){const i=new URLSearchParams;if(t.creditoVsNominal!==void 0&&i.set("creditoVsNominal",t.creditoVsNominal),t.impulsoCrediticio!==void 0&&i.set("impulsoCrediticio",t.impulsoCrediticio),t.curvaEUR!==void 0&&i.set("curvaEUR",t.curvaEUR),t.putCall!==void 0&&i.set("putCall",t.putCall),i.toString()){const a=await fetch("/api/macro?"+i.toString());if(!a.ok){const r=await a.json().catch(()=>({}));throw new Error(r.error||`HTTP ${a.status}`)}return a.json()}return h(e)}function n(e,i=null){if((e==null?void 0:e.value)===null||(e==null?void 0:e.value)===void 0)return"Sin dato";const a=i!==null?e.value.toFixed(i):e.value;return`${e.value>0&&e.unit!==""?"+":""}${a}${e.unit}`}function g(e){const i=e.seguimiento||{},a=i.highYieldSpread,r=i.inflacionEsperada1y,d=i.inflacionEsperada5y,s=i.paroSemanalUS,b=i.paroSemanalEUR,l=e.indicators.bbbSpread,y=`
      <div class="kpi-row" style="grid-template-columns:repeat(5,1fr);">
        <div class="kpi-card">
          <div class="kpi-label">High Yield Spread</div>
          <div class="kpi-value">${n(a,2)}</div>
          <div class="kpi-sub">${(a==null?void 0:a.date)||"—"} · primero en moverse en pánico</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">BBB Spread</div>
          <div class="kpi-value">${n(l)}</div>
          <div class="kpi-sub">${(l==null?void 0:l.date)||"—"} · investment grade</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Inflación Esperada 1Y</div>
          <div class="kpi-value">${n(r,2)}</div>
          <div class="kpi-sub">${(r==null?void 0:r.date)||"—"} · shock inmediato (mensual)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Inflación Esperada 5Y</div>
          <div class="kpi-value">${n(d,2)}</div>
          <div class="kpi-sub">${(d==null?void 0:d.date)||"—"} · ¿se queda pegado o es transitorio?</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Paro Semanal (US)</div>
          <div class="kpi-value">${(s==null?void 0:s.value)!==null&&(s==null?void 0:s.value)!==void 0?Number(s.value).toLocaleString("es-ES"):"Sin dato"}</div>
          <div class="kpi-sub">${(s==null?void 0:s.date)||"—"} · initial claims</div>
        </div>
      </div>
    `,x=[a,l,r,d,s,b].filter(Boolean).map(o=>`
        <tr>
          <td style="text-align:left">
            ${o.label}${o.manual?' <span class="tag warn" style="margin-left:6px;">pendiente</span>':""}
            ${o.detail?`<div style="font-size:9px;color:var(--text3);margin-top:2px;">${o.detail}</div>`:""}
          </td>
          <td>${n(o,o===s?0:null)}</td>
          <td>${o.date||"—"}</td>
        </tr>
      `).join("");v.innerHTML=`
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 18px;margin-bottom:20px;">
        <div style="font-size:11px;color:var(--text2);line-height:1.7;">
          Esta sección vigila el día a día para detectar pronto si la foto macro de 1.1 Coyuntura empieza a moverse.
          Los indicadores aquí mostrados son informativos y <strong style="color:var(--text1);">no participan en el score total</strong>.
        </div>
      </div>

      ${y}

      <div class="section-title" style="margin-top:24px;">Seguimiento de Alta Frecuencia</div>
      <table class="data-table">
        <thead><tr><th>Indicador</th><th>Valor</th><th>Fecha</th></tr></thead>
        <tbody>${x}</tbody>
      </table>

      <div class="section-title" style="margin-top:24px;">Pendientes de Clasificar</div>
      <div style="background:var(--surface);border:1px dashed var(--border);border-radius:10px;padding:14px 18px;margin-bottom:8px;">
        <div style="font-size:11px;color:var(--text2);line-height:1.7;margin-bottom:10px;">
          Estos indicadores sí forman parte del score total (categoría Monetarios), pero aún no tienen fuente
          automática ni una ubicación visual definitiva entre Seguimiento y Liquidez.
        </div>
        ${$.map(o=>{const c=e.indicators[o];return c?`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-top:1px solid var(--border);font-size:11px;">
              <span>${c.label}</span>
              <span style="font-family:var(--mono);color:${c.value===null?"var(--text3)":"var(--text1)"}">${n(c)}</span>
            </div>
          `:""}).join("")}
      </div>

      ${e.errors?`
        <div class="section-title" style="margin-top:24px;color:var(--amber);">⚠ Avisos</div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8;">
          ${e.errors.map(o=>`<div>${o}</div>`).join("")}
        </div>
      `:""}
    `}return document.getElementById("btn-refresh").addEventListener("click",()=>p(!0)),document.getElementById("btn-edit-manual").addEventListener("click",()=>{const e=prompt("Crédito vs Nominal GDP (%):",t.creditoVsNominal??""),i=prompt("Impulso Crediticio (valor numérico, positivo o negativo):",t.impulsoCrediticio??""),a=prompt("Put/Call Ratio (CBOE — consulta cboe.com/delayed_quotes o tu bróker):",t.putCall??"");e!==null&&e!==""&&(t.creditoVsNominal=parseFloat(e)),i!==null&&i!==""&&(t.impulsoCrediticio=parseFloat(i)),a!==null&&a!==""&&(t.putCall=parseFloat(a)),sessionStorage.setItem("ethan_macro_manual",JSON.stringify(t)),p(!0)}),await p(!1),{destroy(){}}}export{E as render};
