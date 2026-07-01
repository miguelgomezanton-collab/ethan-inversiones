import{U as $}from"./userdata-Dfx9DQ6q.js";import"./index-BwSQom_n.js";const j={XLK:"Tech",XLF:"Financials",XLV:"Health",XLE:"Energy",XLY:"Consumer D",XLP:"Consumer S",XLI:"Industrials",XLB:"Materials",XLU:"Utilities",XLRE:"Real Estate",XLC:"Comm"},I=r=>r!=null&&!isNaN(r)?"€"+r.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}):"—",F=r=>r!=null&&!isNaN(r)?"€"+r.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—";function M(r){if(!r||!r.length)return null;const z=r.filter(y=>y.pnlPct>0),b=r.filter(y=>y.pnlPct<=0),x=z.length/r.length,k=z.length?z.reduce((y,B)=>y+B.pnlPct,0)/z.length:0,f=b.length?Math.abs(b.reduce((y,B)=>y+B.pnlPct,0)/b.length):0,C=f>0?k/f:null,L=C!=null?x-(1-x)/C:null;return{winRate:x*100,avgWinPct:k,avgLossPct:f,kelly:L,n:r.length}}async function H(r,{actionsSlot:z}){z.innerHTML="";const[b,x,k,f]=await Promise.all([$.get("ethan_positions").then(t=>t||[]),$.get("ethan_positions_history").then(t=>t||[]),$.get("ethan_capital_alcista"),$.get("ethan_capital_bajista")]),C={alcista:k||0,bajista:f||0};r.innerHTML=`
    <div class="mm-tabs">
      <button class="mm-tab active" data-tab="sizing">📐 Position Sizing</button>
      <button class="mm-tab" data-tab="kelly">🎯 Kelly Criterion</button>
      <button class="mm-tab" data-tab="backtest">🔁 Backtest de Sizing</button>
      <button class="mm-tab" data-tab="limits">🛡️ Límites de Exposición</button>
    </div>

    <!-- TAB 1: Position Sizing -->
    <div class="mm-panel active" id="panel-sizing">
      <div class="mm-card">
        <div class="mm-card-title">📐 Calculadora de Tamaño de Posición</div>
        <div class="mm-card-desc">Calcula cuántas acciones comprar y cuánto capital invertir para cada operación que quieras abrir.</div>

        <div class="mm-grid">
          <div class="mm-field"><label>Dirección</label>
            <select id="sz-direction" class="mm-select">
              <option value="alcista">📈 LONG (Alcista)</option>
              <option value="bajista">📉 SHORT (Bajista)</option>
            </select>
          </div>
          <div class="mm-field"><label>Ticker / Valor</label><input type="text" id="sz-ticker" class="mm-input" value="AAPL" style="text-transform:uppercase;"></div>
          <div class="mm-field"><label>Precio de Entrada (€)</label><input type="number" id="sz-entry" class="mm-input" value="150" step="0.01"></div>
          <div class="mm-field"><label>Stop Loss (€)</label><input type="number" id="sz-stop" class="mm-input" value="145" step="0.01"></div>
        </div>
        <div class="mm-grid" style="margin-top:10px;">
          <div class="mm-field"><label>Take Profit (€) <span style="color:var(--text3);text-transform:none;">(opcional)</span></label><input type="number" id="sz-tp" class="mm-input" placeholder="165.00" step="0.01"></div>
          <div class="mm-field"><label>Capital Asignado <span style="color:var(--text3);text-transform:none;">(editable)</span></label><input type="number" id="sz-capital" class="mm-input" value="${C.alcista}" step="100"></div>
          <div class="mm-field"><label>Riesgo por Operación (%)</label><input type="number" id="sz-risk" class="mm-input" value="1.5" step="0.25"></div>
          <div class="mm-field" style="justify-content:flex-end;"><div id="sz-capital-source" style="font-size:9px;color:var(--text3);font-family:var(--mono);padding-bottom:9px;"></div></div>
        </div>

        <div class="mm-grid" style="grid-template-columns:1fr 1fr;margin-top:18px;">
          <div class="mm-result-panel">
            <div class="mm-result-panel-title" id="sz-res-title">Resultado para AAPL</div>
            <div class="mm-result-row"><span>Dirección:</span> <strong id="sz-out-dir">📈 LONG</strong></div>
            <div class="mm-result-row"><span>Precio:</span> <strong id="sz-out-price">—</strong></div>
            <div class="mm-result-row"><span>Stop Loss:</span> <strong id="sz-out-stop" style="color:var(--red)">—</strong> <span id="sz-out-stop-dist" class="mm-result-sub-inline"></span></div>
            <div class="mm-result-row" id="sz-out-tp-row" style="display:none;"><span>Take Profit:</span> <strong id="sz-out-tp" style="color:var(--green)">—</strong> <span id="sz-out-tp-dist" class="mm-result-sub-inline"></span></div>
            <div class="mm-result-row"><span>Riesgo permitido:</span> <strong id="sz-out-risk" style="color:var(--amber)">—</strong> <span id="sz-out-risk-pct" class="mm-result-sub-inline"></span></div>
          </div>
          <div class="mm-result-panel highlight">
            <div class="mm-result-panel-title" style="color:var(--teal);">Tamaño de Posición</div>
            <div class="mm-result-row"><span>Acciones:</span> <strong id="sz-out-shares" style="font-size:18px;color:var(--teal);">—</strong></div>
            <div class="mm-result-row"><span>Capital a invertir:</span> <strong id="sz-out-invested">—</strong> <span id="sz-out-invested-pct" class="mm-result-sub-inline"></span></div>
            <div class="mm-result-row"><span>Pérdida máxima:</span> <strong id="sz-out-maxloss" style="color:var(--red)">—</strong> <span id="sz-out-maxloss-pct" class="mm-result-sub-inline"></span></div>
            <div class="mm-result-row" id="sz-out-rr-row" style="display:none;"><span>Ratio R:R:</span> <strong id="sz-out-rr" style="color:var(--green)">—</strong></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Kelly -->
    <div class="mm-panel" id="panel-kelly">
      <div class="mm-card">
        <div class="mm-card-title">🎯 Calculadora de Kelly Criterion</div>
        <div class="mm-card-desc">El Kelly Criterion calcula el % óptimo de capital a arriesgar por operación, maximizando el crecimiento compuesto a largo plazo.</div>

        <div class="mm-subtabs">
          <button class="mm-subtab active" data-kdir="alcista">📈 Alcista</button>
          <button class="mm-subtab" data-kdir="bajista">📉 Bajista</button>
        </div>
        <div id="kl-source-badge"></div>

        <div class="mm-grid">
          <div class="mm-field"><label>Win Rate (%)</label><input type="number" id="kl-winrate" class="mm-input" value="55"></div>
          <div class="mm-field"><label>Ganancia Media (%)</label><input type="number" id="kl-avgwin" class="mm-input" value="8"></div>
          <div class="mm-field"><label>Pérdida Media (%)</label><input type="number" id="kl-avgloss" class="mm-input" value="5"></div>
          <div class="mm-field"><label>Fracción de Kelly a usar</label>
            <select id="kl-fraction" class="mm-select">
              <option value="1">Kelly Completo (100%)</option>
              <option value="0.5" selected>Medio Kelly (50%) — recomendado</option>
              <option value="0.25">Cuarto Kelly (25%) — conservador</option>
            </select>
          </div>
        </div>
        <div class="mm-result-hero">
          <div class="mm-result-card">
            <div class="mm-result-label">Kelly Óptimo (f*)</div>
            <div class="mm-result-val" id="kl-optimal">—</div>
          </div>
          <div class="mm-result-card">
            <div class="mm-result-label">Kelly Ajustado (recomendado)</div>
            <div class="mm-result-val" id="kl-adjusted" style="color:var(--teal)">—</div>
            <div class="mm-result-sub" id="kl-fraction-label"></div>
          </div>
          <div class="mm-result-card">
            <div class="mm-result-label">Tu Sizing Actual</div>
            <div class="mm-result-val" id="kl-current" style="color:var(--amber)">—</div>
            <div class="mm-result-sub">según Riesgo% configurado</div>
          </div>
          <div class="mm-result-card">
            <div class="mm-result-label">Veredicto</div>
            <div class="mm-result-val" id="kl-verdict" style="font-size:14px;">—</div>
          </div>
        </div>
        <div style="margin-top:16px;font-size:11px;color:var(--text3);background:var(--surface2);padding:12px 14px;border-radius:8px;line-height:1.6;">
          ⚠ El Kelly completo maximiza el crecimiento teórico pero implica drawdowns muy violentos. La mayoría de gestores profesionales usan <strong style="color:var(--text2)">Medio Kelly o menos</strong>.
        </div>
      </div>
    </div>

    <!-- TAB 3: Backtest de Sizing -->
    <div class="mm-panel" id="panel-backtest">
      <div class="mm-card">
        <div class="mm-card-title">🔁 Backtest de Sizing — ¿Qué habría pasado con otro método?</div>
        <div class="mm-card-desc">Aplica retroactivamente distintos métodos de sizing a cada una de tus operaciones cerradas reales, y compara el resultado final: capital, rentabilidad, drawdown y volatilidad.</div>

        <div class="mm-subtabs">
          <button class="mm-subtab" data-btdir="alcista">📈 Alcista</button>
          <button class="mm-subtab" data-btdir="bajista">📉 Bajista</button>
          <button class="mm-subtab active" data-btdir="total">🌐 Total</button>
        </div>
        <div id="bt-source-badge"></div>

        <div class="mm-grid">
          <div class="mm-field"><label>Capital Inicial (€)</label><input type="number" id="bt-capital" class="mm-input" value="${(k||0)+(f||0)||1e4}"></div>
          <div class="mm-field"><label>Riesgo % <span style="color:var(--text3);text-transform:none;">(para Kelly y Fijo 10%)</span></label><input type="number" id="bt-risk" class="mm-input" value="1.5" step="0.25" style="opacity:0.6;"></div>
          <div class="mm-field" style="grid-column:span 2;display:flex;align-items:flex-end;">
            <button class="btn btn-primary" id="bt-run-btn" style="width:100%;">▶ Ejecutar Backtest</button>
          </div>
        </div>
        <div id="bt-status" style="margin-top:10px;font-family:var(--mono);font-size:10px;color:var(--text3);"></div>
        <div id="bt-results" style="margin-top:18px;"></div>
      </div>
    </div>

    <!-- TAB 4: Límites -->
    <div class="mm-panel" id="panel-limits">
      <div class="mm-card">
        <div class="mm-card-title">🛡️ Límites y Reglas de Exposición</div>
        <div class="mm-card-desc">Define tus reglas de gestión de riesgo y compáralas con tu cartera actual real.</div>
        <div class="mm-grid">
          <div class="mm-field"><label>Capital Total (€)</label><input type="number" id="lim-capital" class="mm-input" value="${(k||0)+(f||0)||1e4}"></div>
          <div class="mm-field"><label>Máx. % por Posición</label><input type="number" id="lim-maxpos" class="mm-input" value="20"></div>
          <div class="mm-field"><label>Máx. % por Sector</label><input type="number" id="lim-maxsector" class="mm-input" value="35"></div>
          <div class="mm-field"><label>Máx. Exposición Total</label><input type="number" id="lim-maxtotal" class="mm-input" value="90"></div>
        </div>
        <button class="btn btn-primary" id="lim-check-btn" style="margin-top:14px;">Comprobar contra mi cartera actual</button>
        <div id="lim-results" style="margin-top:18px;"></div>
      </div>
    </div>
  `;function L(){const t=document.getElementById("sz-direction").value,l=C[t]||0;document.getElementById("sz-capital").value=l,document.getElementById("sz-capital-source").textContent=l>0?`Capital Asignado a ${t==="bajista"?"Bajista":"Alcista"} en Cartera`:`Sin Capital Asignado a ${t==="bajista"?"Bajista":"Alcista"} — configúralo en Cartera`,y()}function y(){const t=document.getElementById("sz-direction").value,l=document.getElementById("sz-ticker").value.trim().toUpperCase()||"—",a=parseFloat(document.getElementById("sz-capital").value)||0,i=parseFloat(document.getElementById("sz-risk").value)||0,d=parseFloat(document.getElementById("sz-entry").value)||0,v=parseFloat(document.getElementById("sz-stop").value)||0,c=parseFloat(document.getElementById("sz-tp").value)||null,p=a*(i/100),n=Math.abs(d-v),m=n>0?Math.floor(p/n):0,g=m*d,e=a>0?g/a*100:0,o=m*n,s=a>0?o/a*100:0,u=t==="alcista";if(document.getElementById("sz-res-title").textContent=`Resultado para ${l}`,document.getElementById("sz-out-dir").innerHTML=u?"📈 LONG":"📉 SHORT",document.getElementById("sz-out-dir").style.color=u?"var(--green)":"var(--red)",document.getElementById("sz-out-price").textContent=I(d),document.getElementById("sz-out-stop").textContent=I(v),document.getElementById("sz-out-stop-dist").textContent=`(-${I(n)}/acc)`,document.getElementById("sz-out-risk").textContent=I(p),document.getElementById("sz-out-risk-pct").textContent=`(${i.toFixed(2)}% de ${F(a)})`,c&&c>0){const h=Math.abs(c-d),P=n>0?(h/n).toFixed(2):"—";document.getElementById("sz-out-tp-row").style.display="flex",document.getElementById("sz-out-tp").textContent=I(c),document.getElementById("sz-out-tp-dist").textContent=`(+${I(h)}/acc)`,document.getElementById("sz-out-rr-row").style.display="flex",document.getElementById("sz-out-rr").textContent=`1 : ${P}`}else document.getElementById("sz-out-tp-row").style.display="none",document.getElementById("sz-out-rr-row").style.display="none";document.getElementById("sz-out-shares").textContent=m.toLocaleString("es-ES"),document.getElementById("sz-out-invested").textContent=F(g),document.getElementById("sz-out-invested-pct").textContent=`(${e.toFixed(1)}% del total)`,document.getElementById("sz-out-maxloss").textContent=F(o),document.getElementById("sz-out-maxloss-pct").textContent=`(${s.toFixed(2)}% del capital)`}["sz-capital","sz-risk","sz-entry","sz-stop","sz-tp","sz-ticker"].forEach(t=>{document.getElementById(t).addEventListener("input",y)}),document.getElementById("sz-direction").addEventListener("change",L),L();let B="alcista";function w(t){const l=x.filter(d=>(d.direction||"alcista")===t),a=M(l),i=document.getElementById("kl-source-badge");a?(i.innerHTML=`<span class="mm-source-badge real">✓ Auto-rellenado con ${a.n} operaciones reales (${t})</span>`,document.getElementById("kl-winrate").value=a.winRate.toFixed(1),document.getElementById("kl-avgwin").value=a.avgWinPct.toFixed(1),document.getElementById("kl-avgloss").value=a.avgLossPct.toFixed(1)):i.innerHTML=`<span class="mm-source-badge">⚠ Sin operaciones cerradas en ${t} — introduce datos manualmente para simular</span>`,A()}document.querySelectorAll(".mm-subtab[data-kdir]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".mm-subtab[data-kdir]").forEach(l=>l.classList.remove("active")),t.classList.add("active"),B=t.dataset.kdir,w(B)})});function A(){var m;const t=(parseFloat(document.getElementById("kl-winrate").value)||0)/100,l=parseFloat(document.getElementById("kl-avgwin").value)||0,a=parseFloat(document.getElementById("kl-avgloss").value)||0,i=parseFloat(document.getElementById("kl-fraction").value),d=parseFloat((m=document.getElementById("sz-risk"))==null?void 0:m.value)||1.5;if(a<=0)return;const v=l/a,c=t-(1-t)/v,p=c*i;document.getElementById("kl-optimal").textContent=(c*100).toFixed(1)+"%",document.getElementById("kl-optimal").style.color=c>0?"var(--green)":"var(--red)",document.getElementById("kl-adjusted").textContent=(p*100).toFixed(1)+"%",document.getElementById("kl-fraction-label").textContent=`×${i} del Kelly completo`,document.getElementById("kl-current").textContent=d.toFixed(2)+"%";const n=document.getElementById("kl-verdict");c<=0?(n.textContent="🔴 Sin Edge",n.style.color="var(--red)"):d>c*100?(n.textContent="⚠️ Sobre-apalancado",n.style.color="var(--amber)"):c>.25?(n.textContent="⚠️ Edge muy alto, revisa",n.style.color="var(--amber)"):c>.05?(n.textContent="✅ Edge saludable",n.style.color="var(--green)"):(n.textContent="🟡 Edge marginal",n.style.color="var(--amber)")}["kl-winrate","kl-avgwin","kl-avgloss","kl-fraction"].forEach(t=>{document.getElementById(t).addEventListener("input",A)}),w("alcista");let E="total";function S(t){return[...t==="total"?x:x.filter(a=>(a.direction||"alcista")===t)].sort((a,i)=>(a.closedAt||0)-(i.closedAt||0))}function T(){const t=S(E),l=document.getElementById("bt-source-badge"),a=E==="total"?"Total (Alcista + Bajista)":E==="alcista"?"Alcista":"Bajista";t.length>0?l.innerHTML=`<span class="mm-source-badge real">✓ ${t.length} operaciones reales cerradas · ${a}</span>`:l.innerHTML=`<span class="mm-source-badge">⚠ Sin operaciones cerradas en ${a}</span>`}document.querySelectorAll("[data-btdir]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("[data-btdir]").forEach(l=>l.classList.remove("active")),t.classList.add("active"),E=t.dataset.btdir,T(),document.getElementById("bt-results").innerHTML="",document.getElementById("bt-status").textContent=""})}),T();function R(t,l,a){let i=l,d=l,v=0;const c=[l],p=[];t.forEach(e=>{const o=a(e,i),u=i*o*(e.pnlPct/100);i+=u,c.push(i),p.push(u/Math.max(i-u,1)),d=Math.max(d,i);const h=d>0?(d-i)/d*100:0;h>v&&(v=h)});const n=(i-l)/l*100,m=p.length?p.reduce((e,o)=>e+o,0)/p.length:0,g=p.length?Math.sqrt(p.reduce((e,o)=>e+(o-m)**2,0)/p.length):0;return{finalCapital:i,totalReturn:n,maxDD:v,volatility:g*100,curve:c}}return document.getElementById("bt-run-btn").addEventListener("click",()=>{const t=parseFloat(document.getElementById("bt-capital").value)||1e4,l=(parseFloat(document.getElementById("bt-risk").value)||1.5)/100,a=S(E),i=document.getElementById("bt-status");if(a.length===0){i.textContent="Sin operaciones cerradas en esta categoría — no se puede simular",document.getElementById("bt-results").innerHTML="";return}i.textContent=`Simulando ${a.length} operaciones con 4 métodos distintos...`;const d=M(a),v=(d==null?void 0:d.kelly)||0,c=Math.max(0,v*.5),n=[{name:"Tu Sizing Real",desc:"Coste real de cada op / capital en ese momento",fn:(s,u)=>s.cost&&u>0?Math.min(s.cost/u,1):l,color:"var(--blue)"},{name:"Kelly Completo",desc:`f* = ${(v*100).toFixed(1)}%`,fn:()=>Math.max(0,v),color:"var(--red)"},{name:"Medio Kelly",desc:`½ × f* = ${(c*100).toFixed(1)}%`,fn:()=>c,color:"var(--teal)"},{name:"Tamaño Fijo 10%",desc:"10% capital siempre",fn:()=>.1,color:"var(--amber)"}].map(s=>({...s,...R(a,t,s.fn)})),m=n.reduce((s,u)=>s.totalReturn>u.totalReturn?s:u),g=n.reduce((s,u)=>s.maxDD<u.maxDD?s:u),e=E==="total"?"Total (Alcista + Bajista)":E==="alcista"?"Alcista":"Bajista";i.textContent=`Backtest completado sobre ${a.length} operaciones reales cerradas · ${e}`;const o=document.getElementById("bt-results");o.innerHTML=`
      <div class="mm-bt-grid">
        ${n.map(s=>`
          <div class="mm-bt-card ${s===m?"best":""}">
            <div class="mm-bt-card-name">
              <span style="color:${s.color}">${s.name}</span>
              ${s===m?'<span class="method-badge recommended">MEJOR RENT.</span>':""}
            </div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:10px;font-family:var(--mono);">${s.desc}</div>
            <div class="mm-bt-metric"><span>Capital Final</span><strong>${F(s.finalCapital)}</strong></div>
            <div class="mm-bt-metric"><span>Rentabilidad</span><strong style="color:${s.totalReturn>=0?"var(--green)":"var(--red)"}">${s.totalReturn>=0?"+":""}${s.totalReturn.toFixed(1)}%</strong></div>
            <div class="mm-bt-metric"><span>Máx Drawdown</span><strong style="color:var(--red)">-${s.maxDD.toFixed(1)}%</strong></div>
            <div class="mm-bt-metric"><span>Volatilidad</span><strong>${s.volatility.toFixed(1)}%</strong></div>
          </div>`).join("")}
      </div>
      <div style="margin-top:14px;font-size:11px;color:var(--text2);background:var(--surface2);padding:12px 14px;border-radius:8px;line-height:1.6;">
        💡 <strong style="color:var(--teal)">${m.name}</strong> habría dado la mayor rentabilidad (${m.totalReturn.toFixed(1)}%), pero
        <strong style="color:var(--text1)">${g.name}</strong> habría sido el más seguro (drawdown máx. ${g.maxDD.toFixed(1)}%).
        Esto ilustra el trade-off clásico: más sizing = más rentabilidad potencial pero también más riesgo de ruina.
      </div>
    `}),document.getElementById("lim-check-btn").addEventListener("click",()=>{const t=parseFloat(document.getElementById("lim-capital").value)||1e4,l=parseFloat(document.getElementById("lim-maxpos").value)||20,a=parseFloat(document.getElementById("lim-maxsector").value)||35,i=parseFloat(document.getElementById("lim-maxtotal").value)||90,d=document.getElementById("lim-results");if(b.length===0){d.innerHTML='<div class="sc2-empty">Sin posiciones abiertas — añade alguna en el módulo Cartera</div>';return}const v=b.map(e=>({ticker:e.ticker,sector:e.sector||null,value:e.shares&&e.entry?e.shares*e.entry:e.cost||0})),p=v.reduce((e,o)=>e+o.value,0)/t*100,n={};v.forEach(e=>{const o=e.sector||"Sin sector";n[o]=(n[o]||0)+e.value});const m=(e,o)=>e>o?"bad":e>o*.8?"warn":"ok",g=e=>e==="ok"?"✓ OK":e==="warn"?"⚠ Cerca":"✗ Excede";d.innerHTML=`
      <div class="mm-source-badge real" style="margin-bottom:14px;">✓ Conectado a tus ${b.length} posiciones abiertas reales</div>
      <div class="mm-limits-grid">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;">Por Posición</div>
          ${v.map(e=>{const o=e.value/t*100,s=m(o,l);return`<div class="mm-limit-row"><span>${e.ticker}</span><span style="font-family:var(--mono);">${o.toFixed(1)}% / ${l}%</span><span class="mm-limit-status ${s}">${g(s)}</span></div>`}).join("")}
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;">Por Sector</div>
          ${Object.entries(n).map(([e,o])=>{const s=o/t*100,u=m(s,a);return`<div class="mm-limit-row"><span>${j[e]||e}</span><span style="font-family:var(--mono);">${s.toFixed(1)}% / ${a}%</span><span class="mm-limit-status ${u}">${g(u)}</span></div>`}).join("")}
          <div class="mm-limit-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:14px;">
            <span style="font-weight:700;">Exposición Total</span>
            <span style="font-family:var(--mono);">${p.toFixed(1)}% / ${i}%</span>
            <span class="mm-limit-status ${m(p,i)}">${g(m(p,i))}</span>
          </div>
        </div>
      </div>
    `}),r.querySelectorAll(".mm-tab").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll(".mm-tab").forEach(l=>l.classList.remove("active")),r.querySelectorAll(".mm-panel").forEach(l=>l.classList.remove("active")),t.classList.add("active"),document.getElementById("panel-"+t.dataset.tab).classList.add("active")})}),{destroy(){}}}export{H as render};
