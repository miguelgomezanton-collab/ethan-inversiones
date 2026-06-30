import{e as p,f as m,h as a,i as h}from"./index-fIW2Udqm.js";async function v(i,{actionsSlot:r}){r.innerHTML='<button class="btn btn-primary" id="btn-registrar">+ Registrar</button>',i.innerHTML='<div id="vitacora-content"></div>';const e=document.getElementById("vitacora-content");function n(){if(!a.ready){e.innerHTML='<div class="empty"><div class="loader-ring"></div></div>';return}if(a.vitacora.length===0){e.innerHTML=`
        <div class="empty">
          <div class="empty-icon">📓</div>
          <div class="empty-title">Sin entradas registradas</div>
          <div class="empty-desc">Registra el estado emocional, condición M+S+D y notas de cada operación.</div>
        </div>
      `;return}e.innerHTML=`
      <div class="section-title">Entradas Recientes</div>
      <table class="data-table">
        <thead><tr><th>Fecha</th><th>Ticker</th><th>Estado</th><th>M+S+D</th><th>Nota</th><th></th></tr></thead>
        <tbody>
          ${a.vitacora.map(t=>`
            <tr>
              <td style="text-align:left">${new Date(t.fecha).toLocaleDateString("es-ES")}</td>
              <td class="tick">${t.ticker||"—"}</td>
              <td><span class="tag ${t.estado==="positivo"?"good":t.estado==="negativo"?"bad":"warn"}">${t.estado||"—"}</span></td>
              <td>${t.msd?"✓":"—"}</td>
              <td style="text-align:left;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.nota||""}</td>
              <td><button class="btn" data-del="${t.id}" style="padding:3px 8px;font-size:9px;">✕</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,e.querySelectorAll("[data-del]").forEach(t=>{t.addEventListener("click",async()=>{confirm("¿Eliminar esta entrada?")&&await h(t.dataset.del)})})}const s=p(n);return n(),document.getElementById("btn-registrar").addEventListener("click",async()=>{const t=prompt("Ticker de la operación:");if(!t)return;const d=prompt("Estado emocional (positivo / neutral / negativo):","neutral"),o=confirm("¿Se cumplieron las condiciones M+S+D? (Aceptar = sí)"),c=prompt("Nota / reflexión:")||"";m({ticker:t.toUpperCase(),estado:d,msd:o,nota:c,fecha:Date.now()}).catch(l=>alert("Error al guardar: "+l.message))}),{destroy(){s()}}}export{v as render};
