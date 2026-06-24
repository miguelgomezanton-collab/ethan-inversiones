import{e as u,f as b,h as l,i as m}from"./index-h6yN1P33.js";async function g(c,{actionsSlot:o}){o.innerHTML=`
    <button class="btn" id="btn-historial">Historial</button>
    <button class="btn btn-primary" id="btn-nueva-op">+ Nueva operación</button>
  `,c.innerHTML='<div id="cartera-content"></div>';const d=document.getElementById("cartera-content");function n(){const e=l.operaciones.alcista.filter(t=>!t.fechaSalida),a=l.operaciones.alcista.filter(t=>t.fechaSalida),i=a.reduce((t,h)=>t+(h.plusvalia||0),0),r=a.filter(t=>(t.plusvalia||0)>0).length,s=a.length?Math.round(r/a.length*100):0;if(!l.ready){d.innerHTML='<div class="empty"><div class="loader-ring"></div></div>';return}if(e.length===0&&a.length===0){d.innerHTML=`
        <div class="empty">
          <div class="empty-icon">◫</div>
          <div class="empty-title">Cartera vacía</div>
          <div class="empty-desc">Registra tu primera operación para empezar a hacer seguimiento.</div>
        </div>
      `;return}d.innerHTML=`
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">P&amp;L Total (cerradas)</div>
          <div class="kpi-value ${i>=0?"up":"down"}">${i>=0?"+":""}${i.toFixed(2)} €</div>
          <div class="kpi-sub">${a.length} operaciones cerradas</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Posiciones Abiertas</div>
          <div class="kpi-value">${e.length}</div>
          <div class="kpi-sub">en seguimiento</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Win Rate</div>
          <div class="kpi-value ${s>=50?"up":"down"}">${s}%</div>
          <div class="kpi-sub">sobre cerradas</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Operaciones</div>
          <div class="kpi-value">${l.operaciones.alcista.length}</div>
          <div class="kpi-sub">histórico</div>
        </div>
      </div>

      <div class="section-title">Posiciones Abiertas</div>
      <table class="data-table">
        <thead><tr><th>Valor</th><th>Ticker</th><th>Entrada</th><th>Capital</th><th>Fecha</th><th></th></tr></thead>
        <tbody>
          ${e.length===0?'<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px;">Sin posiciones abiertas</td></tr>':""}
          ${e.map(t=>`
            <tr>
              <td style="text-align:left">${t.valor||"—"}</td>
              <td class="tick">${t.ticker||"—"}</td>
              <td>${t.precioEntrada??"—"}</td>
              <td>${t.capital?t.capital.toFixed(0)+" €":"—"}</td>
              <td>${t.fechaEntrada||"—"}</td>
              <td><button class="btn" data-del="${t.id}" style="padding:3px 8px;font-size:9px;">✕</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      ${a.length>0?`
        <div class="section-title" style="margin-top:24px;">Últimas Cerradas</div>
        <table class="data-table">
          <thead><tr><th>Valor</th><th>Ticker</th><th>Rentabilidad</th><th>P&amp;L</th><th>Días</th></tr></thead>
          <tbody>
            ${a.slice(0,8).map(t=>`
              <tr>
                <td style="text-align:left">${t.valor||"—"}</td>
                <td class="tick">${t.ticker||"—"}</td>
                <td class="${(t.rentabilidad||0)>=0?"up":"down"}">${t.rentabilidad?(t.rentabilidad*100).toFixed(2)+"%":"—"}</td>
                <td class="${(t.plusvalia||0)>=0?"up":"down"}">${t.plusvalia?(t.plusvalia>=0?"+":"")+t.plusvalia.toFixed(2)+" €":"—"}</td>
                <td>${t.dias??"—"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `:""}
    `,d.querySelectorAll("[data-del]").forEach(t=>{t.addEventListener("click",async()=>{confirm("¿Eliminar esta operación?")&&await m("alcista",t.dataset.del)})})}const p=u(n);n(),document.getElementById("btn-nueva-op").addEventListener("click",()=>v()),document.getElementById("btn-historial").addEventListener("click",()=>{alert("Vista de historial completo — pendiente de diseño detallado.")});function v(){const e=prompt("Nombre del valor (ej: APPLE):");if(!e)return;const a=prompt("Ticker (ej: AAPL):");if(!a)return;const i=parseFloat(prompt("Precio de entrada:")),r=parseFloat(prompt("Capital asignado (€):")),s=new Date().toISOString().split("T")[0];b("alcista",{valor:e.toUpperCase(),ticker:a.toUpperCase(),precioEntrada:i,capital:r,peso:0,fechaEntrada:s}).catch(t=>alert("Error al guardar: "+t.message))}return{destroy(){p()}}}export{g as render};
