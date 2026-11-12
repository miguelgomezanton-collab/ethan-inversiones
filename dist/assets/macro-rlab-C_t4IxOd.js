const P="/api/macro-rlab",D={VALIDADA:{bg:"#052e16",border:"#16a34a",text:"#4ade80"},INDICATIVA:{bg:"#0c1a2e",border:"#2563eb",text:"#60a5fa"},EN_INVESTIGACION:{bg:"#1c1917",border:"#78716c",text:"#a8a29e"},BORRADOR:{bg:"#1c1917",border:"#44403c",text:"#78716c"},NO_VALIDADA:{bg:"#2d0a0a",border:"#dc2626",text:"#f87171"},INCONCLUSA:{bg:"#1c1208",border:"#d97706",text:"#fbbf24"},"CERRADA—RESEARCH ONLY":{bg:"#14042b",border:"#7c3aed",text:"#a78bfa"},CERRADA:{bg:"#14042b",border:"#7c3aed",text:"#a78bfa"}},$={VIX:"VIX — Volatilidad Implícita S&P",HY_OAS:"HY OAS — Spread High Yield",SP500:"S&P 500",CURVE_10_2:"Curva 10Y–2Y",DXY:"DXY — Índice USD",REAL_10Y:"Tipo Real 10Y",FFR:"Federal Funds Rate",BBB:"BBB OAS — Spread BBB",CPI:"CPI — Inflación USA"},H=[{value:"MAX",label:"Máx disponible"},{value:"20Y",label:"Últimos 20 años"},{value:"10Y",label:"Últimos 10 años"},{value:"5Y",label:"Últimos 5 años"},{value:"CUSTOM",label:"Personalizado"}],F=[1,3,6,12];function g(e){return D[e]||D.EN_INVESTIGACION}function k(e){const r=g(e);return`<span style="background:${r.bg};border:1px solid ${r.border};color:${r.text};
    padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.5px">${e}</span>`}function b(e,r=3){return e==null?"—":Number(e).toFixed(r)}function I(e){return e==null?"—":`${(e*100).toFixed(1)}%`}function E(e){return e==null?"":e<.01?"***":e<.05?"**":e<.1?"*":""}async function f(e,r={}){const t=await fetch(P+e,{headers:{"Content-Type":"application/json"},...r});if(!t.ok){const a=await t.json().catch(()=>({error:t.statusText}));throw new Error(a.error||`HTTP ${t.status}`)}return t.json()}let w={};async function V(e,r){const t=`${e}::${r}`;if(w[t])return w[t];try{const a=await f(`/data?indicator=${e}&from=${r}&meta=true`);return w[t]=a.coverage,a.coverage}catch{return null}}async function C(e){e.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div>
        <h2 style="margin:0;font-size:20px;color:#f1f5f9">Macro R-LAB</h2>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px">
          Laboratorio de investigación — relaciones señal→retorno
        </p>
      </div>
      <button id="rlab-new-btn" style="
        background:#2563eb;color:#fff;border:none;border-radius:6px;
        padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600">
        + Nueva investigación
      </button>
    </div>

    <div id="rlab-filters" style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      ${["Todos","BORRADOR","EN_INVESTIGACION","INDICATIVA","VALIDADA","NO_VALIDADA","INCONCLUSA","CERRADA"].map((r,t)=>`<button class="rlab-filter-btn${t===0?" active":""}" data-state="${t===0?"":r}"
          style="padding:4px 12px;border-radius:20px;font-size:12px;cursor:pointer;
          border:1px solid ${t===0?"#2563eb":"#334155"};
          background:${t===0?"#1d3a6e":"#1e293b"};color:${t===0?"#60a5fa":"#94a3b8"}">${t===0?"Todos":r.replace("—"," ")}</button>`).join("")}
    </div>

    <div id="rlab-portfolio-list" style="display:flex;flex-direction:column;gap:12px">
      <div style="color:#64748b;text-align:center;padding:40px">Cargando...</div>
    </div>
  `,e.querySelector("#rlab-new-btn").onclick=()=>B(e),e.querySelectorAll(".rlab-filter-btn").forEach(r=>{r.onclick=()=>{e.querySelectorAll(".rlab-filter-btn").forEach(t=>{t.style.border="1px solid #334155",t.style.background="#1e293b",t.style.color="#94a3b8",t.classList.remove("active")}),r.style.border="1px solid #2563eb",r.style.background="#1d3a6e",r.style.color="#60a5fa",r.classList.add("active"),j(e,r.dataset.state)}}),j(e,"")}async function j(e,r){const t=e.querySelector("#rlab-portfolio-list");t.innerHTML='<div style="color:#64748b;text-align:center;padding:40px">Cargando...</div>';try{const a=r?`/research?state=${r}`:"/research",{items:i}=await f(a);if(!(i!=null&&i.length)){t.innerHTML='<div style="color:#64748b;text-align:center;padding:40px">Sin investigaciones. Crea la primera.</div>';return}t.innerHTML=i.map(o=>Y(o)).join(""),t.querySelectorAll(".rlab-card").forEach(o=>{o.onclick=()=>A(e,o.dataset.id)})}catch(a){t.innerHTML=`<div style="color:#f87171;padding:20px">Error: ${a.message}</div>`}}function Y(e){var t,a,i;const r=g(e.state);return`
    <div class="rlab-card" data-id="${e.id}" style="
      background:#0f172a;border:1px solid #1e293b;border-left:3px solid ${r.border};
      border-radius:8px;padding:16px;cursor:pointer;transition:border-color .15s"
      onmouseover="this.style.borderColor='${r.border}'" onmouseout="this.style.borderColor='#1e293b'">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            ${k(e.state)}
            <span style="color:#64748b;font-size:12px">v${e.versionCount||0} ejecuciones</span>
          </div>
          <div style="font-size:15px;font-weight:600;color:#f1f5f9;margin-bottom:4px;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.title}</div>
          <div style="color:#94a3b8;font-size:12px;display:-webkit-box;-webkit-line-clamp:2;
            -webkit-box-orient:vertical;overflow:hidden">${e.hypothesis}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;font-size:12px;color:#64748b">
          <div style="color:#94a3b8;margin-bottom:4px">
            <span style="color:#cbd5e1">${$[e.signal]||e.signal}</span>
            <span style="margin:0 4px">→</span>
            <span style="color:#cbd5e1">${$[e.targetIndicator]||e.targetIndicator}</span>
          </div>
          <div>${((i=(a=(t=e.updatedAt)==null?void 0:t.toDate)==null?void 0:a.call(t))==null?void 0:i.toLocaleDateString("es-ES"))??""}</div>
        </div>
      </div>
    </div>
  `}async function B(e){e.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <button id="rlab-back" style="background:none;border:none;color:#60a5fa;cursor:pointer;font-size:13px">
        ← Volver al portfolio
      </button>
    </div>
    <h2 style="margin:0 0 24px;font-size:18px;color:#f1f5f9">Nueva investigación</h2>

    <form id="rlab-form" style="display:flex;flex-direction:column;gap:20px;max-width:680px">
      ${L("title","Título de la investigación","text","Ej: VIX alto predice recuperación S&P 500")}
      ${L("hypothesis","Hipótesis","textarea","Describe la relación causal que esperas encontrar y el mecanismo económico...",8)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        ${z("signal","Indicador señal",$)}
        ${z("targetIndicator","Indicador objetivo",$)}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        ${z("transformSignal","Transformar señal",{LEVEL:"Nivel",YOY:"YoY %",MOM:"MoM %",ZSCORE:"Z-Score 1Y"})}
        <div>
          <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">Lag (meses)</label>
          <input name="lag" type="number" min="0" max="24" value="0" style="${y}">
        </div>
        ${z("quintiles","Quintiles",{3:"3 grupos",4:"4 grupos",5:"5 quintiles",10:"10 deciles"})}
      </div>

      <!-- Horizontes forward -->
      <div>
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px">Horizontes forward a analizar</label>
        <div style="display:flex;gap:8px">
          ${F.map(a=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;
              background:#1e293b;border:1px solid #334155;border-radius:6px;padding:6px 12px">
              <input type="checkbox" name="horizons" value="${a}" ${a<=6?"checked":""}>
              <span style="font-size:13px;color:#cbd5e1">${a}M</span>
            </label>`).join("")}
        </div>
      </div>

      <!-- Período histórico -->
      <div>
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px">Período histórico</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px" id="period-btns">
          ${H.map((a,i)=>`
            <button type="button" class="period-btn${i===0?" active":""}" data-period="${a.value}"
              style="padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;
              border:1px solid ${i===0?"#2563eb":"#334155"};
              background:${i===0?"#1d3a6e":"#1e293b"};color:${i===0?"#60a5fa":"#94a3b8"}">${a.label}</button>
          `).join("")}
        </div>
        <div id="period-custom" style="display:none;display:flex;gap:12px">
          <div>
            <label style="font-size:11px;color:#64748b;margin-bottom:4px;display:block">Desde</label>
            <input id="period-from" type="date" style="${y}">
          </div>
          <div>
            <label style="font-size:11px;color:#64748b;margin-bottom:4px;display:block">Hasta</label>
            <input id="period-to" type="date" value="${new Date().toISOString().slice(0,10)}" style="${y}">
          </div>
        </div>
        <div id="period-meta" style="margin-top:8px;font-size:12px;color:#64748b;min-height:20px"></div>
      </div>

      ${L("notes","Notas iniciales (opcional)","textarea","Contexto adicional, referencias, casos de uso esperados...",4)}

      <div style="display:flex;gap:12px;margin-top:8px">
        <button type="submit" style="
          background:#2563eb;color:#fff;border:none;border-radius:6px;
          padding:10px 24px;cursor:pointer;font-size:14px;font-weight:600">
          Crear investigación
        </button>
        <button type="button" id="rlab-cancel" style="
          background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:6px;
          padding:10px 24px;cursor:pointer;font-size:14px">
          Cancelar
        </button>
      </div>
      <div id="rlab-form-error" style="color:#f87171;font-size:13px;display:none"></div>
    </form>
  `,e.querySelector("#rlab-back").onclick=()=>C(e),e.querySelector("#rlab-cancel").onclick=()=>C(e);let r="MAX";e.querySelectorAll(".period-btn").forEach(a=>{a.onclick=()=>{e.querySelectorAll(".period-btn").forEach(o=>{o.style.border="1px solid #334155",o.style.background="#1e293b",o.style.color="#94a3b8"}),a.style.border="1px solid #2563eb",a.style.background="#1d3a6e",a.style.color="#60a5fa",r=a.dataset.period;const i=e.querySelector("#period-custom");i.style.display=r==="CUSTOM"?"flex":"none",t()}});async function t(){var d,l,p,n;const a=(d=e.querySelector("[name=signal]"))==null?void 0:d.value,i=(l=e.querySelector("[name=targetIndicator]"))==null?void 0:l.value,o=e.querySelector("#period-meta");if(!(!a||!i)){o.textContent="Consultando cobertura...";try{const[s,c]=await Promise.all([V(a,r),V(i,r)]),x=Math.min((s==null?void 0:s.nObs)||0,(c==null?void 0:c.nObs)||0);o.innerHTML=`
        <span style="color:#94a3b8">Señal: </span>
        <span style="color:#cbd5e1">${(s==null?void 0:s.dateFrom)??"?"} → ${(s==null?void 0:s.dateTo)??"?"} · ${((p=s==null?void 0:s.nObs)==null?void 0:p.toLocaleString())??"?"} obs</span>
        <span style="margin:0 8px;color:#475569">|</span>
        <span style="color:#94a3b8">Objetivo: </span>
        <span style="color:#cbd5e1">${(c==null?void 0:c.dateFrom)??"?"} → ${(c==null?void 0:c.dateTo)??"?"} · ${((n=c==null?void 0:c.nObs)==null?void 0:n.toLocaleString())??"?"} obs</span>
        <span style="margin:0 8px;color:#475569">|</span>
        <span style="color:${x<100?"#f87171":"#4ade80"}">~${x.toLocaleString()} pares estimados</span>
      `}catch{o.textContent="No se pudo consultar cobertura"}}}e.querySelector("[name=signal]").addEventListener("change",t),e.querySelector("[name=targetIndicator]").addEventListener("change",t),e.querySelector("#rlab-form").onsubmit=async a=>{a.preventDefault();const i=e.querySelector("#rlab-form-error");i.style.display="none";const o=a.target,d=[...o.querySelectorAll("[name=horizons]:checked")].map(s=>parseInt(s.value));if(!d.length){i.textContent="Selecciona al menos un horizonte",i.style.display="block";return}let l={type:r};if(r==="CUSTOM"){const s=e.querySelector("#period-from").value,c=e.querySelector("#period-to").value;if(!s){i.textContent="Indica fecha de inicio",i.style.display="block";return}l={type:"CUSTOM",from:s,to:c}}const p={title:o.querySelector("[name=title]").value.trim(),hypothesis:o.querySelector("[name=hypothesis]").value.trim(),signal:o.querySelector("[name=signal]").value,targetIndicator:o.querySelector("[name=targetIndicator]").value,transformSignal:o.querySelector("[name=transformSignal]").value,quintiles:parseInt(o.querySelector("[name=quintiles]").value),lag:parseInt(o.querySelector("[name=lag]").value)||0,horizonMonths:d,periodConfig:l,notes:o.querySelector("[name=notes]").value.trim()};if(!p.title||!p.hypothesis){i.textContent="Título e hipótesis son obligatorios",i.style.display="block";return}const n=o.querySelector("[type=submit]");n.disabled=!0,n.textContent="Creando...";try{const s=await f("/research",{method:"POST",body:JSON.stringify(p)});A(e,s.id)}catch(s){i.textContent=s.message,i.style.display="block",n.disabled=!1,n.textContent="Crear investigación"}}}async function A(e,r){e.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button id="rlab-back" style="background:none;border:none;color:#60a5fa;cursor:pointer;font-size:13px">
        ← Portfolio
      </button>
    </div>
    <div id="rlab-detail-content" style="color:#64748b">Cargando...</div>
  `,e.querySelector("#rlab-back").onclick=()=>C(e);try{const[t,a]=await Promise.all([f(`/research?id=${r}`),f(`/results?researchId=${r}&all=true`).catch(()=>({versions:[]}))]);U(e,t,a)}catch(t){e.querySelector("#rlab-detail-content").innerHTML=`<div style="color:#f87171">Error: ${t.message}</div>`}}function U(e,{research:r,executions:t},{versions:a}){var d,l,p;const i=a==null?void 0:a[0],o=e.querySelector("#rlab-detail-content");o.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          ${k(r.state)}
          <span style="color:#64748b;font-size:12px">${r.versionCount||0} ejecuciones · v${a.length}</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:19px;color:#f1f5f9">${r.title}</h2>
        <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.5">${r.hypothesis}</p>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        ${r.state!=="CERRADA"?`
          <button id="rlab-run-btn" style="
            background:#2563eb;color:#fff;border:none;border-radius:6px;
            padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600">
            ▶ Ejecutar
          </button>
          <button id="rlab-close-btn" style="
            background:#1e293b;color:#a78bfa;border:1px solid #7c3aed;border-radius:6px;
            padding:8px 16px;cursor:pointer;font-size:13px">
            Cerrar investigación
          </button>`:""}
      </div>
    </div>

    <!-- Configuración -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;
      background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px;margin-bottom:20px">
      ${h("Señal",$[r.signal]||r.signal)}
      ${h("Objetivo",$[r.targetIndicator]||r.targetIndicator)}
      ${h("Transformación",r.transformSignal||"LEVEL")}
      ${h("Lag",`${r.lag||0} meses`)}
      ${h("Quintiles",r.quintiles||5)}
      ${h("Horizontes",(r.horizonMonths||[]).map(n=>`${n}M`).join(", "))}
      ${h("Período",((d=r.periodConfig)==null?void 0:d.type)||"MAX")}
    </div>

    <!-- Historial de versiones -->
    ${a.length?`
      <div style="margin-bottom:20px">
        <h3 style="margin:0 0 12px;font-size:14px;color:#94a3b8;font-weight:600;
          text-transform:uppercase;letter-spacing:.5px">Historial de ejecuciones</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${a.map(n=>{var s;return`
            <div class="rlab-ver-row" data-vid="${n.id}" style="
              background:#0f172a;border:1px solid #1e293b;border-radius:6px;
              padding:12px 16px;cursor:pointer;display:flex;justify-content:space-between;
              align-items:center">
              <span style="color:#94a3b8;font-size:13px">v${n.versionNum} · ${n.effectiveFrom||"?"} → ${n.effectiveTo||"?"} · ${((s=n.nSignal)==null?void 0:s.toLocaleString())||"?"} obs</span>
              <div style="display:flex;align-items:center;gap:12px">
                ${Object.entries(n.verdictByHorizon||{}).map(([c,x])=>`<span style="font-size:11px;color:${g(x).text}">${c}: ${x}</span>`).join("")}
                ${k(n.verdict||n.finalVerdict||"EN_INVESTIGACION")}
              </div>
            </div>`}).join("")}
        </div>
      </div>`:""}

    <!-- Resultados de la última versión -->
    <div id="rlab-results-panel">
      ${i?M(i):`
        <div style="text-align:center;padding:40px;color:#64748b;
          background:#0f172a;border:1px solid #1e293b;border-radius:8px">
          Sin ejecuciones aún. Pulsa <strong style="color:#60a5fa">▶ Ejecutar</strong> para lanzar el análisis.
        </div>`}
    </div>

    <!-- Ejecución en progreso -->
    <div id="rlab-exec-progress" style="display:none;
      background:#0f172a;border:1px solid #2563eb;border-radius:8px;padding:24px;text-align:center;margin-top:20px">
      <div style="color:#60a5fa;font-size:14px;margin-bottom:8px">⏳ Ejecutando análisis...</div>
      <div style="color:#64748b;font-size:12px">Descargando datos y calculando estadísticos. Puede tardar 15-30s.</div>
    </div>

    <!-- Error de ejecución -->
    <div id="rlab-exec-error" style="display:none;color:#f87171;font-size:13px;
      background:#2d0a0a;border:1px solid #dc2626;border-radius:8px;padding:16px;margin-top:16px"></div>
  `,(l=o.querySelector("#rlab-run-btn"))==null||l.addEventListener("click",async()=>{const n=o.querySelector("#rlab-exec-progress"),s=o.querySelector("#rlab-exec-error"),c=o.querySelector("#rlab-run-btn");n.style.display="block",s.style.display="none",c.disabled=!0,c.textContent="▶ Ejecutando...";try{const x=await f("/execute",{method:"POST",body:JSON.stringify({researchId:r.id})});n.style.display="none",A(e,r.id)}catch(x){n.style.display="none",s.style.display="block",s.textContent=`Error en ejecución: ${x.message}`,c.disabled=!1,c.textContent="▶ Ejecutar"}}),(p=o.querySelector("#rlab-close-btn"))==null||p.addEventListener("click",()=>{X(e,r)}),o.querySelectorAll(".rlab-ver-row").forEach(n=>{n.addEventListener("click",async()=>{const s=await f(`/results?versionId=${n.dataset.vid}`);o.querySelector("#rlab-results-panel").innerHTML=M(s)})})}function M(e){var t,a;if(!e||!e.results)return"";const r=Object.keys(e.results);return`
    <div style="margin-top:4px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <h3 style="margin:0;font-size:14px;color:#94a3b8;font-weight:600;
          text-transform:uppercase;letter-spacing:.5px">Resultados v${e.versionNum}</h3>
        ${k(e.verdict||"EN_INVESTIGACION")}
        <span style="color:#64748b;font-size:12px">
          ${e.effectiveFrom||"?"} → ${e.effectiveTo||"?"} ·
          señal: ${((t=e.nSignal)==null?void 0:t.toLocaleString())||"?"} obs ·
          cobertura: ${((a=e.signalCoverage)==null?void 0:a.toFixed(1))||"?"}%
        </span>
      </div>

      <!-- Tabs de horizontes -->
      <div style="display:flex;gap:4px;margin-bottom:16px" id="hz-tabs">
        ${r.map((i,o)=>{const d=e.results[i],l=g(d.verdict||"INCONCLUSA");return`<button class="hz-tab${o===0?" active":""}" data-hz="${i}"
            style="padding:6px 16px;border-radius:6px 6px 0 0;font-size:13px;cursor:pointer;
            border:1px solid ${o===0?l.border:"#334155"};border-bottom:none;
            background:${o===0?l.bg:"#0f172a"};color:${o===0?l.text:"#64748b"}">${i}</button>`}).join("")}
      </div>

      ${r.map((i,o)=>`
        <div class="hz-panel" data-hz="${i}" style="display:${o===0?"block":"none"}">
          ${_(e.results[i],i)}
        </div>`).join("")}
    </div>
  `}function _(e,r){var n,s,c,x,m,O,N,q,T;if(e.error)return`<div style="color:#f87171;padding:20px">${e.error} (${e.nPairs||0} pares)</div>`;const t=e.spearman,a=e.pearson,i=e.bootstrap,o=e.stability,d=e.walkForward,l=e.monotonicity,p=e.quintiles;return`
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:0 8px 8px 8px;padding:20px">
      <!-- Veredicto horizonte -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:12px;
        background:${g(e.verdict||"INCONCLUSA").bg};border:1px solid ${g(e.verdict||"INCONCLUSA").border};border-radius:6px">
        ${k(e.verdict||"INCONCLUSA")}
        <span style="color:#94a3b8;font-size:13px">${((n=e.nPairs)==null?void 0:n.toLocaleString())||"?"} pares · Horizonte ${r}</span>
        ${e.lookAheadViolations>0?`
          <span style="color:#fbbf24;font-size:12px">⚠ ${e.lookAheadViolations} posibles look-ahead</span>`:""}
      </div>

      <!-- Stats principales -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:20px">
        ${S("Spearman ρ",b(t==null?void 0:t.rho),(t==null?void 0:t.pValue)<.05?"#4ade80":"#f87171",`p=${b(t==null?void 0:t.pValue,4)} ${E(t==null?void 0:t.pValue)}  IC95: [${b((s=t==null?void 0:t.ci95)==null?void 0:s[0])}, ${b((c=t==null?void 0:t.ci95)==null?void 0:c[1])}]`)}
        ${S("Pearson r",b(a==null?void 0:a.r),(a==null?void 0:a.pValue)<.05?"#4ade80":"#f87171",`p=${b(a==null?void 0:a.pValue,4)} ${E(a==null?void 0:a.pValue)}`)}
        ${S("Bootstrap (BC)",b(i==null?void 0:i.median),null,`p=${b(i==null?void 0:i.pValue,4)} ${E(i==null?void 0:i.pValue)}  IC95: [${b((x=i==null?void 0:i.ci95)==null?void 0:x[0])}, ${b((m=i==null?void 0:i.ci95)==null?void 0:m[1])}]`)}
        ${S("Monotonía Q",`${(l==null?void 0:l.score)??"?"}/4`,l!=null&&l.isMonotone?"#4ade80":"#f87171",l!=null&&l.isMonotone?"Monótona ✓":"No monótona")}
        ${S("Walk-Forward",b((O=d==null?void 0:d.test)==null?void 0:O.rho),((N=d==null?void 0:d.test)==null?void 0:N.pValue)<.05?"#4ade80":"#f87171",`Train: ${b((q=d==null?void 0:d.train)==null?void 0:q.rho)}  Test: ${b((T=d==null?void 0:d.test)==null?void 0:T.rho)} (${I(d==null?void 0:d.degradation)} degradación)`)}
      </div>

      <!-- Estabilidad temporal -->
      ${o!=null&&o.blocks?`
        <div style="margin-bottom:20px">
          <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">ESTABILIDAD TEMPORAL</div>
          <div style="display:flex;gap:12px">
            ${["early","mid","recent"].map(u=>{var R;const v=(R=o.blocks)==null?void 0:R[u];return v?`<div style="flex:1;background:#1e293b;border-radius:6px;padding:12px;text-align:center">
                <div style="font-size:11px;color:#64748b;margin-bottom:4px">${u.toUpperCase()}</div>
                <div style="font-size:18px;font-weight:700;color:${v.rho>0?"#4ade80":"#f87171"}">${b(v.rho,2)}</div>
                <div style="font-size:11px;color:#64748b">n=${v.n||"?"} p=${b(v.pValue,3)}</div>
              </div>`:""}).join("")}
          </div>
        </div>`:""}

      <!-- Quintiles -->
      ${p!=null&&p.length?`
        <div>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">ANÁLISIS POR QUINTILES</div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="color:#64748b">
                <th style="padding:6px;text-align:left">Q</th>
                <th style="padding:6px;text-align:left">Rango señal</th>
                <th style="padding:6px;text-align:right">Mediana ret.</th>
                <th style="padding:6px;text-align:right">Media ret.</th>
                <th style="padding:6px;text-align:right">% positivos</th>
                <th style="padding:6px;text-align:right">N</th>
              </tr>
            </thead>
            <tbody>
              ${p.map((u,v)=>`
                <tr style="border-top:1px solid #1e293b">
                  <td style="padding:6px;color:#94a3b8">Q${v+1}</td>
                  <td style="padding:6px;color:#94a3b8">[${b(u.xMin,2)}, ${b(u.xMax,2)}]</td>
                  <td style="padding:6px;text-align:right;color:${u.medianReturn>0?"#4ade80":"#f87171"}">${I(u.medianReturn)}</td>
                  <td style="padding:6px;text-align:right;color:${u.meanReturn>0?"#4ade80":"#f87171"}">${I(u.meanReturn)}</td>
                  <td style="padding:6px;text-align:right;color:#94a3b8">${(u.pctPositive*100).toFixed(1)}%</td>
                  <td style="padding:6px;text-align:right;color:#64748b">${u.n||0}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`:""}
    </div>
  `}function X(e,r,t){const a=e.querySelector("#rlab-detail-content"),i=[["hypothesisTested","La hipótesis fue testada formalmente"],["lookaheadChecked","Verificado que no hay look-ahead bias"],["multipleHorizons","Testado en múltiples horizontes temporales"],["temporalStability","Comprobada estabilidad temporal (Early/Mid/Recent)"],["walkForwardPassed","Walk-forward satisfactorio (no overfitting)"],["economicRationale","Racionalidad económica documentada"],["riskAware","Riesgos de implementación identificados"]];a.insertAdjacentHTML("beforeend",`
    <div id="rlab-close-overlay" style="
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,0.75);z-index:1000;
      display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;
        padding:28px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto">
        <h3 style="margin:0 0 20px;font-size:17px;color:#f1f5f9">Cerrar investigación formalmente</h3>

        <div style="margin-bottom:20px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:8px">Veredicto final</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px" id="verdict-btns">
            ${["VALIDADA","INDICATIVA","INCONCLUSA","NO_VALIDADA","CERRADA—RESEARCH ONLY"].map((l,p)=>{const n=g(l);return`<button type="button" class="verdict-btn" data-verdict="${l}"
                style="padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;
                border:1px solid ${n.border};background:${p===0?n.bg:"#0f172a"};color:${n.text}">${l}</button>`}).join("")}
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px">
            Justificación del cierre <span style="color:#f87171">*</span>
          </label>
          <textarea id="close-notes" rows="4" placeholder="Explica el resultado, limitaciones encontradas, próximos pasos..." style="${y};resize:vertical"></textarea>
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:10px">Checklist de cierre</label>
          ${i.map(([l,p])=>`
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:pointer">
              <input type="checkbox" class="close-check" data-key="${l}"
                style="accent-color:#2563eb;width:16px;height:16px">
              <span style="font-size:13px;color:#94a3b8">${p}</span>
            </label>`).join("")}
          <div id="checklist-pct" style="margin-top:8px;font-size:12px;color:#64748b">0/7 completados</div>
        </div>

        <div style="margin-bottom:20px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="promote-prod" style="accent-color:#2563eb;width:16px;height:16px">
            <span style="font-size:13px;color:#94a3b8">Promover a producción</span>
          </label>
          <div id="prod-notes-wrap" style="display:none;margin-top:8px">
            <textarea id="prod-notes" rows="2" placeholder="Notas de implementación en producción..." style="${y}"></textarea>
          </div>
        </div>

        <div style="display:flex;gap:12px">
          <button id="close-submit" style="
            background:#7c3aed;color:#fff;border:none;border-radius:6px;
            padding:10px 24px;cursor:pointer;font-size:13px;font-weight:600">
            Cerrar investigación
          </button>
          <button id="close-cancel" style="
            background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:6px;
            padding:10px 16px;cursor:pointer;font-size:13px">
            Cancelar
          </button>
        </div>
        <div id="close-error" style="display:none;color:#f87171;font-size:13px;margin-top:12px"></div>
      </div>
    </div>
  `);const o=a.querySelector("#rlab-close-overlay");let d="VALIDADA";o.querySelector("#close-cancel").onclick=()=>o.remove(),o.querySelectorAll(".verdict-btn").forEach(l=>{l.onclick=()=>{o.querySelectorAll(".verdict-btn").forEach(n=>{n.style.background="#0f172a"});const p=g(l.dataset.verdict);l.style.background=p.bg,d=l.dataset.verdict}}),o.querySelectorAll(".close-check").forEach(l=>{l.onchange=()=>{const p=o.querySelectorAll(".close-check:checked").length;o.querySelector("#checklist-pct").textContent=`${p}/7 completados`}}),o.querySelector("#promote-prod").onchange=function(){o.querySelector("#prod-notes-wrap").style.display=this.checked?"block":"none"},o.querySelector("#close-submit").onclick=async()=>{var c,x;const l=o.querySelector("#close-error"),p=o.querySelector("#close-notes").value.trim(),n=o.querySelector("#promote-prod").checked,s=Object.fromEntries([...o.querySelectorAll(".close-check")].map(m=>[m.dataset.key,m.checked]));l.style.display="none";try{await f("/close",{method:"POST",body:JSON.stringify({researchId:r.id,finalVerdict:d,closureNotes:p,checklist:s,promoteToProd:n,productionNotes:((x=(c=o.querySelector("#prod-notes"))==null?void 0:c.value)==null?void 0:x.trim())||""})}),o.remove(),A(e,r.id)}catch(m){l.textContent=m.message,l.style.display="block"}}}const y=`width:100%;background:#1e293b;border:1px solid #334155;border-radius:6px;
  color:#f1f5f9;padding:8px 12px;font-size:13px;box-sizing:border-box;font-family:inherit`;function L(e,r,t="text",a="",i=3){const o=t==="textarea"?`<textarea name="${e}" rows="${i}" placeholder="${a}" style="${y};resize:vertical"></textarea>`:`<input name="${e}" type="${t}" placeholder="${a}" style="${y}">`;return`<div>
    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">${r}</label>
    ${o}
  </div>`}function z(e,r,t){const a=Object.entries(t).map(([i,o])=>`<option value="${i}">${o}</option>`).join("");return`<div>
    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px">${r}</label>
    <select name="${e}" style="${y}">${a}</select>
  </div>`}function h(e,r){return`<div>
    <div style="font-size:11px;color:#64748b;margin-bottom:2px">${e}</div>
    <div style="font-size:13px;color:#cbd5e1">${r}</div>
  </div>`}function S(e,r,t,a=""){return`<div style="background:#1e293b;border-radius:8px;padding:14px">
    <div style="font-size:11px;color:#64748b;margin-bottom:4px;text-transform:uppercase">${e}</div>
    <div style="font-size:22px;font-weight:700;color:${t||"#f1f5f9"};margin-bottom:4px">${r}</div>
    ${a?`<div style="font-size:11px;color:#64748b">${a}</div>`:""}
  </div>`}function Q(e){e.addEventListener("click",r=>{const t=r.target.closest(".hz-tab");if(!t)return;const a=t.dataset.hz,i=t.closest("[id^=rlab]")||e;i.querySelectorAll(".hz-tab").forEach(o=>{o.classList.remove("active"),o.style.background="#0f172a",o.style.color="#64748b",o.style.border="1px solid #334155",o.style.borderBottom="none"}),t.classList.add("active"),i.querySelectorAll(".hz-panel").forEach(o=>{o.style.display=o.dataset.hz===a?"block":"none"})})}function G(e){Q(e),C(e)}function J(e){G(e)}export{J as initMacroRLab,G as render};
