import{g as m,f as x,a as k}from"./macro-data-Bc3_xk8a.js";async function C(u,{actionsSlot:g}){g.innerHTML='<button class="btn btn-primary" id="btn-refresh-macro">↻ Actualizar</button>',u.innerHTML='<div id="coyuntura-content"><div class="empty"><div class="loader-ring"></div></div></div>';const l=document.getElementById("coyuntura-content");async function r(e=!1){l.innerHTML='<div class="empty"><div class="loader-ring"></div></div>';try{const a=await m(e);b(a)}catch(a){l.innerHTML=`
        <div class="empty">
          <div class="empty-icon">⚠</div>
          <div class="empty-title">No se pudo cargar el score macro</div>
          <div class="empty-desc">${a.message}</div>
        </div>
      `}}function b(e){var d,n,v,c,p;const a=((d=e.fearGreed)==null?void 0:d.score)??null,t=a!==null?k(a):"—",o=a!==null?x(a):"var(--text3)",f=e.scoreTotal>=4?"var(--green)":e.scoreTotal>=0?"var(--amber)":"var(--red)",y=["curvaUSD","curvaEUR","lei"].map(i=>e.indicators[i]).filter(Boolean).map(i=>$(i)).join("");l.innerHTML=`
      <div class="kpi-row">
        <div class="kpi-card" style="grid-column: span 2;">
          <div class="kpi-label">Score Macro Total</div>
          <div class="kpi-value" style="color:${f};font-size:28px;">${e.scoreTotal>=0?"+":""}${e.scoreTotal}/${e.maxTotal}</div>
          <div class="kpi-sub">${e.zone.emoji} ${e.zone.label}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Fear &amp; Greed (CNN)</div>
          <div class="kpi-value" style="color:${o}">${a??"—"}</div>
          <div class="kpi-sub">${t}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Riesgo Inflacionario</div>
          <div class="kpi-value" style="font-size:16px;color:${((n=e.riesgoContagio)==null?void 0:n.nivel)==="alto"?"var(--red)":((v=e.riesgoContagio)==null?void 0:v.nivel)==="moderado"?"var(--amber)":"var(--green)"}">${((c=e.riesgoContagio)==null?void 0:c.label)||"—"}</div>
          <div class="kpi-sub">CPI YoY: ${((p=e.riesgoContagio)==null?void 0:p.cpiYoY)??"—"}%</div>
        </div>
      </div>

      <div class="section-title">Probabilidades de Escenario</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
        ${s("Recesión 12m",e.probabilities.recesion12m,"var(--red)")}
        ${s("Stagflation",e.probabilities.stagflation,"var(--red)")}
        ${s("Soft Landing",e.probabilities.softLanding,"var(--amber)")}
        ${s("Expansión",e.probabilities.expansion,"var(--green)")}
      </div>

      <div class="section-title">Indicadores Adelantados (${e.scoreAdelantados>=0?"+":""}${e.scoreAdelantados}/${e.maxAdelantados})</div>
      <table class="data-table">
        <thead><tr><th>Indicador</th><th>Valor</th><th>Fecha</th><th>Señal</th></tr></thead>
        <tbody>${y}</tbody>
      </table>

      ${e.errors?`
        <div class="section-title" style="margin-top:24px;color:var(--amber);">⚠ Avisos</div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8;">
          ${e.errors.map(i=>`<div>${i}</div>`).join("")}
        </div>
      `:""}

      <div style="margin-top:20px;font-family:var(--mono);font-size:9px;color:var(--text3);">
        Última actualización: ${new Date(e.updatedAt).toLocaleString("es-ES")}
      </div>
    `}function s(e,a,t){return`
      <div class="kpi-card">
        <div class="kpi-label">${e}</div>
        <div class="kpi-value" style="color:${t};font-size:20px;">${a}%</div>
      </div>
    `}function $(e){const a=e.score>0?"good":e.score<0?"bad":"warn",t=e.score>0?`+${e.score}`:e.score,o=e.value!==null&&e.value!==void 0?`${e.value>0&&e.unit!==""?"+":""}${e.value}${e.unit}`:"—";return`
      <tr>
        <td style="text-align:left">${e.label}${e.manual?' <span class="tag warn" style="margin-left:6px;">manual</span>':""}</td>
        <td>${o}</td>
        <td>${e.date||"—"}</td>
        <td><span class="tag ${a}">${t}</span></td>
      </tr>
    `}return document.getElementById("btn-refresh-macro").addEventListener("click",()=>r(!0)),await r(!1),{destroy(){}}}export{C as render};
