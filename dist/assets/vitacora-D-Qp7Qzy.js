import{U as k}from"./userdata-DRc3raHj.js";import"./index-Bux_OP-y.js";const A="ethan_bitacora_v1",D={euforia:"😄",positivo:"😊",neutro:"😐",frustrado:"😤",ansioso:"😰"},I={entrada:"ENTRADA",salida:"SALIDA",reflexion:"REFLEXIÓN",error:"ERROR"},w=e=>new Date(e).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}),C=e=>new Date(e).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});function M(e,d){return`<span class="msd-tag ${d==="ok"?"ok":d==="fail"?"fail":"na"}">${e} ${d==="ok"?"✓":d==="fail"?"✗":"—"}</span>`}function B(e){var f,p,m;const d=e.direction&&e.direction!=="na"?`<span class="bt-entry-dir ${e.direction}">${e.direction.toUpperCase()}</span>`:"",o=e.lesson?`<div class="bt-entry-lesson">${e.lesson}</div>`:"";return`
    <div class="bt-entry" data-id="${e.id}">
      <div class="bt-entry-header">
        <div class="bt-entry-meta">
          <span class="bt-entry-ticker">${e.ticker||"—"}</span>
          ${d}
          <span class="bt-entry-type">${I[e.type]||e.type}</span>
          <span class="bt-entry-date">${w(e.createdAt)} · ${C(e.createdAt)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="bt-entry-mood">${D[e.mood]||"—"}</span>
          <button class="bt-delete-btn" data-id="${e.id}" title="Eliminar">✕</button>
        </div>
      </div>
      <div class="bt-entry-msd">
        ${M("M",((f=e.msd)==null?void 0:f.M)||"na")}
        ${M("S",((p=e.msd)==null?void 0:p.S)||"na")}
        ${M("D",((m=e.msd)==null?void 0:m.D)||"na")}
      </div>
      ${e.notas?`<div class="bt-entry-text">${e.notas}</div>`:""}
      ${o}
    </div>`}function T(e){const d=e.filter(s=>s.type==="entrada"||s.type==="salida");if(d.length<3)return null;const o=e.filter(s=>{var l,c;return s.type==="salida"&&((l=s.msd)==null?void 0:l.M)==="ok"&&((c=s.msd)==null?void 0:c.S)!=="ok"}),f=e.filter(s=>{var l,c,v;return s.type==="entrada"&&((l=s.msd)==null?void 0:l.M)==="ok"&&((c=s.msd)==null?void 0:c.S)==="ok"&&((v=s.msd)==null?void 0:v.D)!=="ok"}),p=d.filter(s=>{var l,c,v;return((l=s.msd)==null?void 0:l.M)==="fail"||((c=s.msd)==null?void 0:c.S)==="fail"||((v=s.msd)==null?void 0:v.D)==="fail"}),m=d.filter(s=>{var l,c,v;return((l=s.msd)==null?void 0:l.M)==="ok"&&((c=s.msd)==null?void 0:c.S)==="ok"&&((v=s.msd)==null?void 0:v.D)==="ok"}),E=d.length?Math.round(m.length/d.length*100):0,b={};return d.forEach(s=>{var l,c,v;s.mood&&(b[s.mood]||(b[s.mood]={total:0,ok:0}),b[s.mood].total++,((l=s.msd)==null?void 0:l.M)==="ok"&&((c=s.msd)==null?void 0:c.S)==="ok"&&((v=s.msd)==null?void 0:v.D)==="ok"&&b[s.mood].ok++)}),{salidasPrematuras:o.length,entradasSinD:f.length,fueraSistema:p.length,dentraSistema:m.length,pctConsistencia:E,totalOps:d.length,moodStats:b,mStats:{cumple:d.filter(s=>{var l;return((l=s.msd)==null?void 0:l.M)==="ok"}).length,total:d.length},sStats:{cumple:d.filter(s=>{var l;return((l=s.msd)==null?void 0:l.S)==="ok"}).length,total:d.length},dStats:{cumple:d.filter(s=>{var l;return((l=s.msd)==null?void 0:l.D)==="ok"}).length,total:d.length}}}async function j(e,{actionsSlot:d}){var v;d.innerHTML="";let o=await k.get(A)||[];async function f(){await k.set(A,o)}const p={M:"na",S:"na",D:"na"};let m="positivo",E="all";e.innerHTML=`
    <div class="bt-tabs">
      <button class="bt-tab active" data-tab="diario">📓 Diario</button>
      <button class="bt-tab" data-tab="registrar">✍️ Registrar</button>
      <button class="bt-tab" data-tab="sesgos">🧠 Sesgos</button>
    </div>

    <!-- DIARIO -->
    <div class="bt-panel active" id="panel-diario">
      <div class="bt-grid">
        <div class="bt-col">
          <div class="bt-filters">
            <span class="bt-filter-label">Ver:</span>
            <button class="bt-filter-btn active" data-filter="all">Todas</button>
            <button class="bt-filter-btn" data-filter="entrada">Entradas</button>
            <button class="bt-filter-btn" data-filter="salida">Salidas</button>
            <button class="bt-filter-btn" data-filter="reflexion">Reflexiones</button>
            <button class="bt-filter-btn" data-filter="error">Errores</button>
          </div>
          <div id="bt-feed"></div>
        </div>
        <div class="bt-col">
          <div class="bt-card" id="bt-stats-card">
            <div class="bt-card-title">Estadísticas</div>
            <div id="bt-stats-body"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- REGISTRAR -->
    <div class="bt-panel" id="panel-registrar">
      <div class="bt-grid">
        <div class="bt-col">
          <div class="bt-card">
            <div class="bt-card-title">Nueva Entrada</div>

            <div class="bt-form-row triple">
              <div class="bt-field"><label>Tipo</label>
                <select class="bt-select" id="reg-type">
                  <option value="entrada">📈 Entrada en posición</option>
                  <option value="salida">📉 Salida de posición</option>
                  <option value="reflexion">🤔 Reflexión libre</option>
                  <option value="error">⚠️ Error / aprendizaje</option>
                </select>
              </div>
              <div class="bt-field"><label>Ticker / Activo</label>
                <input type="text" class="bt-input" id="reg-ticker" placeholder="NVDA" style="text-transform:uppercase;">
              </div>
              <div class="bt-field"><label>Dirección</label>
                <select class="bt-select" id="reg-dir">
                  <option value="long">📈 Long</option>
                  <option value="short">📉 Short</option>
                  <option value="na">— N/A</option>
                </select>
              </div>
            </div>

            <div class="bt-field" style="margin-bottom:8px;"><label>Condiciones del sistema (M · S · D)</label></div>
            <div class="msd-row">
              ${["M","S","D"].map(t=>`
                <div class="msd-pill">
                  <label>${t==="M"?"MENSUAL":t==="S"?"SEMANAL":"DIARIO"}</label>
                  <div class="msd-btn-group">
                    <button class="msd-btn" data-msd="${t}" data-val="ok">✓</button>
                    <button class="msd-btn" data-msd="${t}" data-val="fail">✗</button>
                    <button class="msd-btn active-na" data-msd="${t}" data-val="na">—</button>
                  </div>
                </div>`).join("")}
            </div>

            <div class="bt-field" style="margin-bottom:8px;"><label>Estado emocional</label></div>
            <div class="mood-row" style="margin-bottom:16px;">
              ${Object.entries(D).map(([t,i])=>`<button class="mood-btn ${t==="positivo"?"active":""}" data-mood="${t}">${i}<span class="mood-label">${t.charAt(0).toUpperCase()+t.slice(1)}</span></button>`).join("")}
            </div>

            <div class="bt-form-row single" style="margin-bottom:12px;">
              <div class="bt-field"><label>Razonamiento / Contexto</label>
                <textarea class="bt-textarea" id="reg-notas" placeholder="¿Por qué entras/sales? ¿Qué ves en el gráfico? ¿Qué dice el macro?"></textarea>
              </div>
            </div>
            <div class="bt-form-row single">
              <div class="bt-field"><label>Aprendizaje / Lección (opcional)</label>
                <textarea class="bt-textarea" id="reg-lesson" placeholder="¿Qué aprendes? ¿Harías algo diferente?" style="min-height:60px;"></textarea>
              </div>
            </div>

            <button class="btn-save" id="btn-guardar" style="margin-top:16px;">Guardar en Bitácora</button>
          </div>
        </div>

        <!-- Preview -->
        <div class="bt-col">
          <div class="bt-card">
            <div class="bt-card-title">Vista Previa</div>
            <div id="bt-preview"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SESGOS -->
    <div class="bt-panel" id="panel-sesgos">
      <div class="bt-grid">
        <div class="bt-col" id="sesgos-main"></div>
        <div class="bt-col" id="sesgos-sidebar"></div>
      </div>
    </div>
  `,e.querySelectorAll(".bt-tab").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".bt-tab").forEach(i=>i.classList.remove("active")),e.querySelectorAll(".bt-panel").forEach(i=>i.classList.remove("active")),t.classList.add("active"),document.getElementById("panel-"+t.dataset.tab).classList.add("active"),t.dataset.tab==="sesgos"&&c()})}),e.querySelectorAll(".bt-filter-btn").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".bt-filter-btn").forEach(i=>i.classList.remove("active")),t.classList.add("active"),E=t.dataset.filter,b()})}),e.querySelectorAll(".msd-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.msd,a=t.dataset.val;p[i]=a,e.querySelectorAll(`[data-msd="${i}"]`).forEach(r=>{r.classList.remove("active-ok","active-fail","active-na")}),t.classList.add(a==="ok"?"active-ok":a==="fail"?"active-fail":"active-na"),l()})}),e.querySelectorAll(".mood-btn").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".mood-btn").forEach(i=>i.classList.remove("active")),t.classList.add("active"),m=t.dataset.mood,l()})}),["reg-ticker","reg-type","reg-dir","reg-notas"].forEach(t=>{var i;(i=document.getElementById(t))==null||i.addEventListener("input",l)}),(v=document.getElementById("btn-guardar"))==null||v.addEventListener("click",async()=>{const t=document.getElementById("reg-ticker").value.trim().toUpperCase(),i=document.getElementById("reg-type").value,a=document.getElementById("reg-notas").value.trim();if(!a&&i!=="reflexion"){document.getElementById("reg-notas").focus();return}const r={id:Date.now().toString(),type:i,ticker:t,direction:document.getElementById("reg-dir").value,msd:{...p},mood:m,notas:a,lesson:document.getElementById("reg-lesson").value.trim(),createdAt:Date.now()};o.unshift(r),await f(),document.getElementById("reg-ticker").value="",document.getElementById("reg-notas").value="",document.getElementById("reg-lesson").value="",p.M=p.S=p.D="na",e.querySelectorAll(".msd-btn").forEach(n=>{n.classList.remove("active-ok","active-fail","active-na"),n.dataset.val==="na"&&n.classList.add("active-na")}),b(),l(),e.querySelectorAll(".bt-tab").forEach(n=>n.classList.remove("active")),e.querySelectorAll(".bt-panel").forEach(n=>n.classList.remove("active")),e.querySelector('[data-tab="diario"]').classList.add("active"),document.getElementById("panel-diario").classList.add("active")});function b(){const t=document.getElementById("bt-feed");if(!t)return;const i=E==="all"?o:o.filter(a=>a.type===E);i.length===0?t.innerHTML=`<div class="sc2-empty">${o.length===0?"Aún no hay entradas — usa la pestaña Registrar para añadir la primera.":"Ninguna entrada coincide con el filtro."}</div>`:(t.innerHTML=i.map(B).join(""),t.querySelectorAll(".bt-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{o=o.filter(r=>r.id!==a.dataset.id),await f(),b(),s()})})),s()}function s(){const t=document.getElementById("bt-stats-body");if(!t)return;const i=o.filter(n=>n.type==="entrada"||n.type==="salida"),a=i.filter(n=>{var y,u,S;return((y=n.msd)==null?void 0:y.M)==="ok"&&((u=n.msd)==null?void 0:u.S)==="ok"&&((S=n.msd)==null?void 0:S.D)==="ok"}),r=i.length?Math.round(a.length/i.length*100):0;t.innerHTML=`
      <div class="bt-stat-row"><span class="bt-stat-label">Total entradas</span><span class="bt-stat-val">${o.length}</span></div>
      <div class="bt-stat-row"><span class="bt-stat-label">M+S+D cumplidas</span><span class="bt-stat-val" style="color:${r>=80?"var(--green)":r>=60?"var(--amber)":"var(--red)"}">${a.length} / ${i.length}</span></div>
      <div class="bt-stat-row"><span class="bt-stat-label">Consistencia</span><span class="bt-stat-val" style="color:${r>=80?"var(--green)":r>=60?"var(--amber)":"var(--red)"}">${r}%</span></div>
      <div class="bt-stat-row"><span class="bt-stat-label">Reflexiones</span><span class="bt-stat-val">${o.filter(n=>n.type==="reflexion").length}</span></div>
      <div class="bt-stat-row"><span class="bt-stat-label">Errores registrados</span><span class="bt-stat-val">${o.filter(n=>n.type==="error").length}</span></div>
    `}function l(){var u,S,$,h;const t=document.getElementById("bt-preview");if(!t)return;const i=((u=document.getElementById("reg-ticker"))==null?void 0:u.value.toUpperCase())||"—",a=((S=document.getElementById("reg-type"))==null?void 0:S.value)||"entrada",r=(($=document.getElementById("reg-dir"))==null?void 0:$.value)||"na",n=((h=document.getElementById("reg-notas"))==null?void 0:h.value)||"",y=r!=="na"?`<span class="bt-entry-dir ${r}">${r.toUpperCase()}</span>`:"";t.innerHTML=`
      <div class="bt-entry" style="margin-bottom:0;">
        <div class="bt-entry-header">
          <div class="bt-entry-meta">
            <span class="bt-entry-ticker">${i}</span>
            ${y}
            <span class="bt-entry-type">${I[a]||a}</span>
            <span class="bt-entry-date">Ahora</span>
          </div>
          <span class="bt-entry-mood">${D[m]||"😊"}</span>
        </div>
        <div class="bt-entry-msd">
          ${["M","S","D"].map(g=>M(g,p[g])).join("")}
        </div>
        <div class="bt-entry-text" style="color:${n?"var(--text2)":"var(--text3)"};font-style:${n?"normal":"italic"}">
          ${n||"Tu razonamiento aparecerá aquí..."}
        </div>
      </div>`}function c(){const t=document.getElementById("sesgos-main"),i=document.getElementById("sesgos-sidebar");if(!t||!i)return;const a=T(o);if(!a){t.innerHTML='<div class="bt-card"><div class="sc2-empty" style="padding:40px;">Necesitas al menos 3 operaciones registradas para detectar sesgos.</div></div>',i.innerHTML="";return}const r=($,h,g,x)=>{const L=h>0?$/h:0;return L>=g?"alto":L>=x?"medio":"bajo"},n=r(a.salidasPrematuras,a.totalOps,.3,.15),y=r(a.entradasSinD,a.totalOps,.3,.15),u=a.pctConsistencia>=80?"bajo":a.pctConsistencia>=60?"medio":"alto";t.innerHTML=`
      <div class="bt-card">
        <div class="bt-card-title">Sesgos Detectados</div>
        <p style="font-size:11px;color:var(--text3);margin-bottom:16px;line-height:1.6;">Basado en tus ${o.length} entradas. Los sesgos se detectan analizando el patrón de tus decisiones vs el sistema M+S+D.</p>

        <div class="bt-sesgo-item ${n}">
          <span class="bt-sesgo-badge ${n}">${n.toUpperCase()}</span>
          <div class="bt-sesgo-name">✂️ Recortar ganancias pronto</div>
          <div class="bt-sesgo-desc">${a.salidasPrematuras} salida${a.salidasPrematuras!==1?"s":""} con M cumpliendo pero S sin confirmar. Si el mensual sigue alcista/bajista, la salida prematura puede costarte retorno adicional.</div>
        </div>

        <div class="bt-sesgo-item ${y}">
          <span class="bt-sesgo-badge ${y}">${y.toUpperCase()}</span>
          <div class="bt-sesgo-name">⚡ Impaciencia en la entrada</div>
          <div class="bt-sesgo-desc">${a.entradasSinD} entrada${a.entradasSinD!==1?"s":""} con M+S cumpliendo pero D sin confirmar. Entrar antes de la señal diaria suele resultar en paradas prematuras por ruido.</div>
        </div>

        <div class="bt-sesgo-item ${u}">
          <span class="bt-sesgo-badge ${u}">${u.toUpperCase()}</span>
          <div class="bt-sesgo-name">🔄 Consistencia del sistema</div>
          <div class="bt-sesgo-desc">${a.pctConsistencia}% de tus operaciones cumplen M+S+D completo. ${a.pctConsistencia>=80?"Excelente disciplina.":a.pctConsistencia>=60?"Hay margen de mejora — el objetivo es >80%.":"Por debajo del umbral mínimo. Revisa si estás saltándote el sistema con frecuencia."}</div>
        </div>
      </div>`;const S=Object.entries(D).map(([$,h])=>{const g=a.moodStats[$];if(!g)return"";const x=Math.round(g.ok/g.total*100),L=x>=70?"var(--green)":x>=40?"var(--amber)":"var(--red)";return`<div class="bt-stat-row"><span class="bt-stat-label">${h} ${$.charAt(0).toUpperCase()+$.slice(1)}</span><span class="bt-stat-val" style="color:${L}">${g.total} ops · ${x}% sistema</span></div>`}).join("");i.innerHTML=`
      <div class="bt-card">
        <div class="bt-card-title">Consistencia M+S+D</div>
        <div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px;">
            <span>Ops con M+S+D ✓</span><strong style="color:${a.pctConsistencia>=80?"var(--green)":a.pctConsistencia>=60?"var(--amber)":"var(--red)"}">${a.pctConsistencia}%</strong>
          </div>
          <div style="height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;">
            <div style="width:${a.pctConsistencia}%;height:100%;background:${a.pctConsistencia>=80?"var(--green)":a.pctConsistencia>=60?"var(--amber)":"var(--red)"};border-radius:4px;"></div>
          </div>
        </div>
        <div class="bt-stat-row"><span class="bt-stat-label">M cumple</span><span class="bt-stat-val">${a.mStats.cumple}/${a.mStats.total}</span></div>
        <div class="bt-stat-row"><span class="bt-stat-label">S cumple</span><span class="bt-stat-val">${a.sStats.cumple}/${a.sStats.total}</span></div>
        <div class="bt-stat-row"><span class="bt-stat-label">D cumple</span><span class="bt-stat-val">${a.dStats.cumple}/${a.dStats.total}</span></div>
      </div>
      ${S?`
      <div class="bt-card" style="margin-top:16px;">
        <div class="bt-card-title">Estado emocional vs Sistema</div>
        ${S}
        <p style="font-size:10px;color:var(--text3);margin-top:12px;line-height:1.5;">% de operaciones que respetaron M+S+D según tu estado emocional al registrar.</p>
      </div>`:""}
    `}return b(),l(),{destroy(){}}}export{j as render};
