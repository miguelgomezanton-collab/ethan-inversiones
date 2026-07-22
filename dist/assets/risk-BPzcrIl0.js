import{U as L}from"./userdata-Dsogw_hu.js";import"./index-BAlb9zK3.js";const V="ethan_risk_limits",J={maxRiskPerOp:1.5,maxExposure:90,maxPosition:25,maxSector:50,maxDrawdown:10,maxLosStreak:3},Q=[i=>`https://api.allorigins.win/raw?url=${encodeURIComponent(i)}`,i=>`https://corsproxy.io/?${encodeURIComponent(i)}`,i=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(i)}`];async function W(i){var b,g,d,k;const x=`https://query1.finance.yahoo.com/v8/finance/chart/${i}?interval=1d&range=5d`;for(const T of Q)try{const F=await fetch(T(x),{signal:AbortSignal.timeout(6e3)});if(!F.ok)continue;const A=JSON.parse(await F.text());return((k=(d=(g=(b=A==null?void 0:A.chart)==null?void 0:b.result)==null?void 0:g[0])==null?void 0:d.meta)==null?void 0:k.regularMarketPrice)||null}catch{}return null}const n=i=>i!=null?"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—";function c(i,x,b){return`<div class="rm-semaforo-item ${i}">
    <div class="rm-semaforo-dot"></div>
    <span class="rm-semaforo-label">${x}</span>
    <span class="rm-semaforo-val">${b}</span>
  </div>`}function O(i,x,b,g){const d=Math.min(g,100),k=d>90?"var(--red)":d>75?"var(--amber)":"var(--teal)";return`<div class="rm-bar-row">
    <div class="rm-bar-header">
      <span>${i}</span>
      <div><strong>${x}</strong> <span class="limit">/ ${b}</span></div>
    </div>
    <div class="rm-bar-track">
      <div class="rm-bar-fill" style="width:${d}%;background:${k};"></div>
      <div class="rm-bar-limit" style="left:89%"></div>
    </div>
  </div>`}function R(i,x){return`<span class="chip chip-${i}">${x}</span>`}async function tt(i,{actionsSlot:x}){var g;x.innerHTML='<button class="btn btn-primary" id="risk-refresh-btn">↻ Actualizar</button>',i.innerHTML='<div id="risk-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando Risk Management...</div></div></div>';async function b(){var U,q;const d=document.getElementById("risk-content");d.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando precios actuales...</div></div>';const[k,T,F,A,a]=await Promise.all([L.get("ethan_positions").then(t=>t||[]),L.get("ethan_positions_history").then(t=>t||[]),L.get("ethan_capital_alcista"),L.get("ethan_capital_bajista"),L.get(V).then(t=>t||J)]),m=(F||0)+(A||0),z={};await Promise.all(k.map(async t=>{z[t.ticker]=await W(t.ticker)}));const l=k.map(t=>{const s=z[t.ticker]??t.entry,o=t.shares||(t.cost&&t.entry?t.cost/t.entry:0),y=o*s,S=m>0?(t.cost||0)/m*100:0,B=m>0?y/m*100:0,u=t.cost?y-t.cost:null,C=t.cost?(y-t.cost)/t.cost*100:null;let w=null,I=null;if(t.entryStop&&o>0){const H=t.direction==="bajista"?(t.entryStop-s)*o:(s-t.entryStop)*o;w=H<0?H:0,I=m>0?w/m*100:null}const M=t.entryStop&&s?(s-t.entryStop)/s*100:null,G=t.entryStop?Math.abs(M)<2?"warn":"ok":"bad";return{...t,price:s,shares:o,value:y,costPct:S,valuePct:B,pnl:u,pnlPct:C,maxLoss:w,riskPct:I,stopDist:M,stopStatus:G}}),D=l.reduce((t,s)=>t+s.value,0),v=m>0?D/m*100:0,$=l.reduce((t,s)=>t+(s.riskPct||0),0),j=l.reduce((t,s)=>t+(s.maxLoss||0),0),e=l.length?l.reduce((t,s)=>t.valuePct>s.valuePct?t:s):null,_={};l.forEach(t=>{const s=t.sector||"Sin sector";_[s]=(_[s]||0)+t.valuePct});const h=Object.entries(_).reduce((t,s)=>s[1]>t[1]?s:t,["—",0]),r=l.filter(t=>!t.entryStop);let p=0;[...T].sort((t,s)=>t.closedAt-s.closedAt).forEach(t=>{t.pnlPct<=0?p++:p=0});const f=$>a.maxRiskPerOp*l.length?"bad":$>a.maxRiskPerOp*l.length*.8?"warn":"ok",E=v>a.maxExposure?"bad":v>a.maxExposure*.85?"warn":"ok",P=(e==null?void 0:e.valuePct)>a.maxPosition?"bad":(e==null?void 0:e.valuePct)>a.maxPosition*.85?"warn":"ok",N=h[1]>a.maxSector?"bad":h[1]>a.maxSector*.85?"warn":"ok",K=p>=a.maxLosStreak?"bad":p>=a.maxLosStreak-1?"warn":"ok",X=r.length>0?"bad":"ok";d.innerHTML=`
      <div class="rm-tabs">
        <button class="rm-tab active" data-tab="overview">🚦 Overview</button>
        <button class="rm-tab" data-tab="stops">🛑 Stops Activos</button>
        <button class="rm-tab" data-tab="exposicion">📊 Exposición</button>
        <button class="rm-tab" data-tab="escenarios">⚡ Escenarios</button>
        <button class="rm-tab" data-tab="reglas">📋 Mis Reglas</button>
      </div>

      <!-- OVERVIEW -->
      <div class="rm-panel active" id="panel-overview">
        <div class="rm-grid4" style="margin-bottom:16px;">
          <div class="rm-tile">
            <div class="rm-tile-label">Riesgo Total en Cartera</div>
            <div class="rm-tile-val ${$<0?"down":""}">${Math.abs($).toFixed(1)}%</div>
            <div class="rm-tile-sub">${n(j)} si saltan todos los stops · límite ${a.maxRiskPerOp}% por op</div>
            <span class="rm-tile-badge badge-${f==="ok"?"ok":f==="warn"?"warn":"bad"}">${f==="ok"?"✓ OK":f==="warn"?"⚠ CERCA":"✗ EXCEDE"}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Exposición Bruta</div>
            <div class="rm-tile-val">${v.toFixed(1)}%</div>
            <div class="rm-tile-sub">${n(D)} en mercado · límite ${a.maxExposure}%</div>
            <span class="rm-tile-badge badge-${E==="ok"?"ok":E==="warn"?"warn":"bad"}">${E==="ok"?"✓ OK":E==="warn"?"⚠ CERCA":"✗ EXCEDE"}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Posición Mayor</div>
            <div class="rm-tile-val ${P==="warn"?"warn":""}">${e?e.valuePct.toFixed(1)+"%":"—"}</div>
            <div class="rm-tile-sub">${(e==null?void 0:e.ticker)||"—"} · límite ${a.maxPosition}%</div>
            <span class="rm-tile-badge badge-${P==="ok"?"ok":P==="warn"?"warn":"bad"}">${P==="ok"?"✓ OK":P==="warn"?"⚠ CERCA":"✗ EXCEDE"}</span>
          </div>
          <div class="rm-tile">
            <div class="rm-tile-label">Stops sin configurar</div>
            <div class="rm-tile-val ${r.length>0?"down":""}">${r.length}</div>
            <div class="rm-tile-sub">${r.length>0?r.map(t=>t.ticker).join(", "):"Todas las posiciones tienen stop"}</div>
            <span class="rm-tile-badge badge-${r.length>0?"bad":"ok"}">${r.length>0?"✗ ALERTA":"✓ OK"}</span>
          </div>
        </div>
        <div class="rm-grid2">
          <div class="rm-card">
            <div class="rm-card-title">Semáforo de Riesgo</div>
            <div class="rm-semaforo">
              ${c(f,"Riesgo total por stops",`${Math.abs($).toFixed(1)}% / ${a.maxRiskPerOp}% por op`)}
              ${c(E,"Exposición total",`${v.toFixed(1)}% / ${a.maxExposure}%`)}
              ${c(P,`Concentración — ${(e==null?void 0:e.ticker)||"—"}`,`${(e==null?void 0:e.valuePct.toFixed(1))||"0"}% / ${a.maxPosition}%`)}
              ${c(N,`Sector — ${h[0]}`,`${h[1].toFixed(1)}% / ${a.maxSector}%`)}
              ${c(K,"Rachas perdedoras activas",`${p} / ${a.maxLosStreak}`)}
              ${c(X,"Posiciones sin stop",r.length>0?r.map(t=>t.ticker).join(", "):"Ninguna")}
            </div>
          </div>
          <div class="rm-card">
            <div class="rm-card-title">Uso de Límites</div>
            ${O("Riesgo por operaciones",Math.abs($).toFixed(1)+"%",a.maxRiskPerOp+"% por op",Math.abs($)/a.maxRiskPerOp*100)}
            ${O("Exposición total",v.toFixed(1)+"%",a.maxExposure+"%",v/a.maxExposure*100)}
            ${e?O(`Posición mayor (${e.ticker})`,e.valuePct.toFixed(1)+"%",a.maxPosition+"%",e.valuePct/a.maxPosition*100):""}
            ${h[1]>0?O(`Sector (${h[0]})`,h[1].toFixed(1)+"%",a.maxSector+"%",h[1]/a.maxSector*100):""}
          </div>
        </div>
      </div>

      <!-- STOPS ACTIVOS -->
      <div class="rm-panel" id="panel-stops">
        <div class="rm-card">
          <div class="rm-card-title">Stops Activos por Posición</div>
          <div class="rm-card-desc">Precio actual vs stop de entrada de cada posición. Los stops dinámicos (EMA10) debes actualizarlos semanalmente en Cartera.</div>
          ${l.length===0?'<div class="sc2-empty">Sin posiciones abiertas</div>':l.map(t=>{var s,o,y,S;return`
            <div class="rm-stop-card">
              <div class="rm-stop-header">
                <div style="display:flex;gap:8px;align-items:center;">
                  <span class="rm-stop-ticker">${t.ticker}</span>
                  <span class="rm-stop-dir ${t.direction==="bajista"?"short":"long"}">${t.direction==="bajista"?"SHORT":"LONG"}</span>
                </div>
                ${t.stopStatus==="ok"?R("ok","✓ Por encima del stop"):t.stopStatus==="warn"?R("warn","⚠ Cerca del stop"):R("bad","✗ Sin stop configurado")}
              </div>
              <div class="rm-stop-grid">
                <div class="rm-stop-item"><span class="rm-stop-item-label">Precio entrada</span><span class="rm-stop-item-val">${((s=t.entry)==null?void 0:s.toFixed(2))||"—"}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Precio actual</span><span class="rm-stop-item-val ${t.pnlPct>=0?"up":"down"}">${((o=t.price)==null?void 0:o.toFixed(2))||"—"}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Stop de entrada</span><span class="rm-stop-item-val" style="color:var(--red)">${((y=t.entryStop)==null?void 0:y.toFixed(2))||"—"}</span></div>
                <div class="rm-stop-item"><span class="rm-stop-item-label">Distancia al stop</span><span class="rm-stop-item-val ${t.stopDist!=null&&t.stopDist<2?"warn":""}">${t.stopDist!=null?t.stopDist.toFixed(1)+"%":"—"}</span></div>
              </div>
              ${t.stopStatus==="ok"?`<div class="rm-stop-alert ok">✓ Stop seguro · Pérdida máx si salta: ${t.maxLoss!=null?n(t.maxLoss)+" ("+Math.abs(t.riskPct||0).toFixed(2)+"% capital)":"—"}</div>`:t.stopStatus==="warn"?`<div class="rm-stop-alert warn">⚠ Precio muy cerca del stop (${(S=t.stopDist)==null?void 0:S.toFixed(1)}%). Monitorear de cerca.</div>`:'<div class="rm-stop-alert warn">⚠ Sin stop configurado — añádelo en el módulo Cartera.</div>'}
            </div>`}).join("")}
        </div>
      </div>

      <!-- EXPOSICIÓN -->
      <div class="rm-panel" id="panel-exposicion">
        <div class="rm-grid2">
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Por Posición</div>
            <table class="rm-table">
              <thead><tr><th>TICKER</th><th>DIR.</th><th class="r">VALOR</th><th class="r">% CAPITAL</th><th class="r">P&L</th><th class="r">ESTADO</th></tr></thead>
              <tbody>
                ${l.map(t=>`<tr>
                  <td style="font-family:var(--mono);font-weight:700;">${t.ticker}</td>
                  <td>${R(t.direction==="bajista"?"bad":"ok",t.direction==="bajista"?"S":"L")}</td>
                  <td class="r">${n(t.value)}</td>
                  <td class="r ${t.valuePct>a.maxPosition*.9?"warn":""}">${t.valuePct.toFixed(1)}%</td>
                  <td class="r ${t.pnlPct>=0?"up":"down"}">${t.pnl!=null?(t.pnl>=0?"+":"")+n(t.pnl):"—"}</td>
                  <td class="r">${R(t.valuePct>a.maxPosition?"bad":t.valuePct>a.maxPosition*.9?"warn":"ok",t.valuePct>a.maxPosition?"EXCEDE":t.valuePct>a.maxPosition*.9?"CERCA":"OK")}</td>
                </tr>`).join("")}
                <tr style="border-top:1px solid var(--border2);">
                  <td colspan="2" style="color:var(--text3);font-size:11px;">TOTAL</td>
                  <td class="r" style="font-weight:700;">${n(D)}</td>
                  <td class="r" style="font-weight:700;">${v.toFixed(1)}%</td>
                  <td class="r ${l.reduce((t,s)=>t+(s.pnl||0),0)>=0?"up":"down"}" style="font-weight:700;">${n(l.reduce((t,s)=>t+(s.pnl||0),0))}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Pérdida Máxima Real (si saltan todos los stops)</div>
            <table class="rm-table">
              <thead><tr><th>TICKER</th><th class="r">STOP</th><th class="r">PÉRDIDA MÁX.</th><th class="r">% CAPITAL</th></tr></thead>
              <tbody>
                ${l.map(t=>{var s;return`<tr>
                  <td style="font-family:var(--mono);">${t.ticker}</td>
                  <td class="r">${((s=t.entryStop)==null?void 0:s.toFixed(2))||"—"}</td>
                  <td class="r ${t.maxLoss!=null?"down":""}">${t.maxLoss!=null?"−"+n(Math.abs(t.maxLoss)):"Sin stop"}</td>
                  <td class="r ${t.riskPct!=null?"down":""}">${t.riskPct!=null?Math.abs(t.riskPct).toFixed(2)+"%":"—"}</td>
                </tr>`}).join("")}
                <tr style="border-top:1px solid var(--border2);">
                  <td colspan="2" style="color:var(--text3);font-size:11px;">RIESGO TOTAL</td>
                  <td class="r down" style="font-weight:700;">−${n(Math.abs(j))}</td>
                  <td class="r down" style="font-weight:700;">${Math.abs($).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
            ${r.length>0?`<div style="margin-top:12px;font-size:10px;color:var(--amber);font-family:var(--mono);">⚠ ${r.map(t=>t.ticker).join(", ")} sin stop — riesgo real no calculable para ${r.length===1?"esta posición":"estas posiciones"}.</div>`:""}
          </div>
        </div>
      </div>

      <!-- ESCENARIOS -->
      <div class="rm-panel" id="panel-escenarios">
        <div class="rm-card">
          <div class="rm-card-title">Simulador de Escenarios</div>
          <div class="rm-card-desc">¿Qué pasaría si el mercado cayera un X%? La exposición y el capital se toman de tu cartera real. La beta la introduces manualmente (pendiente de automatizar desde Métricas).</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
            <div class="rm-field"><label>Capital Total (€)</label>
              <input type="number" id="sc-capital" class="rm-sim-input" value="${m||1e4}">
            </div>
            <div class="rm-field"><label>Beta de cartera <span style="color:var(--text3);text-transform:none;">(manual)</span></label>
              <input type="number" id="sc-beta" class="rm-sim-input" value="1.10" step="0.01">
            </div>
            <div class="rm-field"><label>Exposición actual (%)</label>
              <input type="number" id="sc-exp" class="rm-sim-input" value="${v.toFixed(1)}" step="0.1">
            </div>
          </div>
          <button class="btn btn-primary" id="sc-calc-btn">Calcular Escenarios</button>
          <div id="sc-results" style="margin-top:16px;"></div>
        </div>
      </div>

      <!-- MIS REGLAS -->
      <div class="rm-panel" id="panel-reglas">
        <div class="rm-grid2">
          <div class="rm-card" style="margin-bottom:0;">
            <div class="rm-card-title">Mis Reglas de Risk Management</div>
            <div class="rm-card-desc">Edita tus límites. Se guardan en Firestore y se usan en todo el módulo.</div>
            ${[["maxRiskPerOp","Riesgo máximo por operación (%)","Nunca arriesgar más de este % en una sola posición (entrada - stop × acciones / capital)."],["maxExposure","Exposición máxima total (%)","Porcentaje máximo del capital que puede estar invertido simultáneamente."],["maxPosition","Límite por posición individual (%)","Ninguna posición puede superar este % del capital."],["maxSector","Límite por sector (%)","Concentración máxima en un mismo sector."],["maxDrawdown","Drawdown máximo tolerable (%)","Si la cartera cae este % desde su máximo, parar y revisar."],["maxLosStreak","Rachas perdedoras (nº ops)","Tras este número de pérdidas consecutivas, reducir sizing a la mitad."]].map(([t,s,o])=>`
              <div class="rm-rule">
                <div class="rm-rule-body">
                  <div class="rm-rule-title">${s}</div>
                  <div class="rm-rule-desc">${o}</div>
                </div>
                <input type="number" class="rm-rule-input" data-key="${t}" value="${a[t]}" step="0.5" style="width:70px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:6px 8px;color:var(--teal);font-family:var(--mono);font-size:13px;text-align:right;">
              </div>`).join("")}
            <button class="btn btn-primary" id="save-limits-btn" style="margin-top:16px;width:100%;">Guardar límites</button>
            <div id="limits-saved" style="font-size:10px;color:var(--green);font-family:var(--mono);margin-top:8px;text-align:center;display:none;">✓ Límites guardados</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="rm-card" style="margin-bottom:0;">
              <div class="rm-card-title">Cumplimiento Actual</div>
              <div class="rm-semaforo">
                ${c(f,"Riesgo por operaciones",Math.abs($).toFixed(1)+"% / "+a.maxRiskPerOp+"%")}
                ${c(E,"Exposición total",v.toFixed(1)+"% / "+a.maxExposure+"%")}
                ${c(P,"Posición individual",((e==null?void 0:e.valuePct)||0).toFixed(1)+"% / "+a.maxPosition+"%")}
                ${c(N,"Sector",h[1].toFixed(1)+"% / "+a.maxSector+"%")}
                ${c(K,"Rachas perdedoras",p+" / "+a.maxLosStreak)}
                ${c(X,"Stops configurados",r.length===0?"✓ Todas":"✗ Faltan: "+r.map(t=>t.ticker).join(", "))}
              </div>
            </div>
            ${[...r.map(t=>({level:"bad",msg:`<strong style="color:var(--red)">${t.ticker}</strong> — Sin stop configurado. Añádelo en Cartera.`})),...(e==null?void 0:e.valuePct)>a.maxPosition*.9?[{level:e.valuePct>a.maxPosition?"bad":"warn",msg:`<strong style="color:${e.valuePct>a.maxPosition?"var(--red)":"var(--amber)"}">${e.ticker}</strong> — Al ${e.valuePct.toFixed(1)}% del capital, ${e.valuePct>a.maxPosition?"excede":"cerca de"} el límite del ${a.maxPosition}%.`}]:[],...p>=a.maxLosStreak-1?[{level:"warn",msg:`Racha de ${p} pérdidas consecutivas. Considera reducir el sizing.`}]:[]].length>0?`
            <div class="rm-card" style="margin-bottom:0;">
              <div class="rm-card-title">Acciones Recomendadas</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${[...r.map(t=>({level:"bad",msg:`<strong style="color:var(--red)">${t.ticker}</strong> — Sin stop configurado. Añádelo en Cartera.`})),...(e==null?void 0:e.valuePct)>a.maxPosition*.9?[{level:e.valuePct>a.maxPosition?"bad":"warn",msg:`<strong style="color:${e.valuePct>a.maxPosition?"var(--red)":"var(--amber)"}">${e.ticker}</strong> — Al ${e.valuePct.toFixed(1)}% del capital, ${e.valuePct>a.maxPosition?"excede":"cerca de"} el límite del ${a.maxPosition}%.`}]:[],...p>=a.maxLosStreak-1?[{level:"warn",msg:`Racha de ${p} pérdidas consecutivas. Considera reducir el sizing.`}]:[]].map(t=>`<div style="padding:10px 12px;background:rgba(${t.level==="bad"?"244,113,116":"251,191,36"},0.07);border:1px solid rgba(${t.level==="bad"?"244,113,116":"251,191,36"},0.2);border-radius:8px;font-size:11px;color:var(--text2);line-height:1.5;">${t.level==="bad"?"🔴":"⚠️"} ${t.msg}</div>`).join("")}
              </div>
            </div>`:""}
          </div>
        </div>
      </div>
    `,d.querySelectorAll(".rm-tab").forEach(t=>{t.addEventListener("click",()=>{d.querySelectorAll(".rm-tab").forEach(s=>s.classList.remove("active")),d.querySelectorAll(".rm-panel").forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.getElementById("panel-"+t.dataset.tab).classList.add("active")})}),(U=document.getElementById("sc-calc-btn"))==null||U.addEventListener("click",()=>{const t=parseFloat(document.getElementById("sc-capital").value)||m||1e4,s=parseFloat(document.getElementById("sc-beta").value)||1.1,o=(parseFloat(document.getElementById("sc-exp").value)||v)/100,y=[{name:"Corrección leve",pct:-.05},{name:"Corrección moderada",pct:-.1},{name:"Corrección fuerte",pct:-.2},{name:"Bear market",pct:-.35},{name:"Crash severo",pct:-.5}],S=u=>u>-.05?["ok","TOLERABLE"]:u>-.1?["warn","MONITOREAR"]:u>-.2?["warn","REVISAR"]:["bad","CRÍTICO"],B=y.map(u=>{const C=u.pct*s*o,w=t*C,[I,M]=S(C);return`<tr>
          <td>${u.name}</td>
          <td style="color:${u.pct<-.15?"var(--red)":"var(--amber)"};">${(u.pct*100).toFixed(0)}%</td>
          <td class="r down">${(C*100).toFixed(1)}%</td>
          <td class="r down">−${n(Math.abs(w))}</td>
          <td class="r">${n(t+w)}</td>
          <td class="r">${R(I,M)}</td>
        </tr>`}).join("");document.getElementById("sc-results").innerHTML=`
        <table class="rm-table">
          <thead><tr><th>ESCENARIO</th><th>CAÍDA</th><th class="r">IMPACTO</th><th class="r">P&L</th><th class="r">CAPITAL RESTANTE</th><th class="r">ESTADO</th></tr></thead>
          <tbody>${B}</tbody>
        </table>
        <p style="font-size:10px;color:var(--text3);margin-top:8px;">Exposición ${(o*100).toFixed(1)}% · Beta ${s} · Capital ${n(t)} · Los stops limitan la pérdida real a ${n(Math.abs(j))}.</p>`}),(q=document.getElementById("save-limits-btn"))==null||q.addEventListener("click",async()=>{const t={...a};document.querySelectorAll(".rm-rule-input").forEach(o=>{t[o.dataset.key]=parseFloat(o.value)||0}),await L.set(V,t);const s=document.getElementById("limits-saved");s&&(s.style.display="block",setTimeout(()=>s.style.display="none",2e3))})}return(g=document.getElementById("risk-refresh-btn"))==null||g.addEventListener("click",b),b(),{destroy(){}}}export{tt as render};
