async function l(r,{actionsSlot:n}){n.innerHTML='<button class="btn btn-primary" id="btn-refresh-liq">↻ Actualizar</button>',r.innerHTML='<div id="liquidez-content"><div class="empty"><div class="loader-ring"></div></div></div>';const s=document.getElementById("liquidez-content");async function t(){s.innerHTML='<div class="empty"><div class="loader-ring"></div></div>';try{const e=await fetch("/api/macro");if(!e.ok){const a=await e.json().catch(()=>({}));throw new Error(a.error||`HTTP ${e.status}`)}const i=await e.json();c(i)}catch(e){s.innerHTML=`
        <div class="empty">
          <div class="empty-icon">⚠</div>
          <div class="empty-title">Error al cargar datos de liquidez</div>
          <div class="empty-desc">${e.message}</div>
        </div>
      `}}function c(e){const i=e.indicators.m2Global,a=e.indicators.velocidadM2,d=e.indicators.reservasBancarias;s.innerHTML=`
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">M2 (proxy US)</div>
          <div class="kpi-value ${(i==null?void 0:i.score)>=0?"up":"down"}">${i?(i.value>=0?"+":"")+i.value+"%":"—"}</div>
          <div class="kpi-sub">YoY — ${(i==null?void 0:i.date)||"—"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Velocidad M2</div>
          <div class="kpi-value ${(a==null?void 0:a.score)>=0?"up":"down"}">${a?(a.value>=0?"+":"")+a.value+"%":"—"}</div>
          <div class="kpi-sub">${(a==null?void 0:a.detail)||""}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Reservas Bancarias</div>
          <div class="kpi-value ${(d==null?void 0:d.score)>=0?"up":"down"}">${d?(d.value>=0?"+":"")+d.value+"%":"—"}</div>
          <div class="kpi-sub">YoY — ${(d==null?void 0:d.detail)||""}</div>
        </div>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:20px;">
        <div style="font-size:11px;color:var(--text2);line-height:1.7;">
          <strong style="color:var(--amber);">⚠ Nota:</strong> el valor de M2 mostrado es un proxy basado únicamente en M2 de Estados Unidos (FRED, serie M2SL).
          El "M2 Global" completo de tu sistema combina Fed + ECB + PBOC + BoJ — esa integración multi-banco-central
          está pendiente de construir. Mientras tanto, este proxy US sirve como referencia direccional.
        </div>
      </div>

      <div class="section-title">Evolución M2 (12 meses)</div>
      <div id="m2-chart" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;height:280px;"></div>
    `,o()}async function o(e){const i=document.getElementById("m2-chart");i&&(i.innerHTML=`
      <div class="empty" style="height:100%;">
        <div class="empty-icon">📈</div>
        <div class="empty-title">Histórico pendiente</div>
        <div class="empty-desc">El endpoint actual solo devuelve el valor YoY más reciente. Para graficar la serie completa hace falta ampliar /api/macro con un endpoint de histórico (12 meses de M2SL).</div>
      </div>
    `)}return document.getElementById("btn-refresh-liq").addEventListener("click",t),await t(),{destroy(){}}}export{l as render};
