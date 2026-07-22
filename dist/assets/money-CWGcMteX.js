import{U as A}from"./userdata-Dsogw_hu.js";import"./index-BAlb9zK3.js";const D={XLK:"Tech",XLF:"Financials",XLV:"Health",XLE:"Energy",XLY:"Consumer D",XLP:"Consumer S",XLI:"Industrials",XLB:"Materials",XLU:"Utilities",XLRE:"Real Estate",XLC:"Comm"},C=r=>r!=null&&!isNaN(r)?"€"+r.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}):"—",T=r=>r!=null&&!isNaN(r)?"€"+r.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—";function P(r){if(!r||!r.length)return null;const I=r.filter(v=>v.pnlPct>0),E=r.filter(v=>v.pnlPct<=0),h=I.length/r.length,L=I.length?I.reduce((v,g)=>v+g.pnlPct,0)/I.length:0;let x=E.length?Math.abs(E.reduce((v,g)=>v+g.pnlPct,0)/E.length):0,F=!1;if(x<.001){const v=r.filter(g=>g.entry&&g.entryStop&&g.entryStop<g.entry);v.length>0&&(x=v.reduce((g,$)=>g+($.entry-$.entryStop)/$.entry*100,0)/v.length,F=!0)}const S=x>.001?L/x:null,w=S!=null?Math.max(0,h-(1-h)/S):null;return{winRate:h*100,avgWinPct:L,avgLossPct:x,kelly:w,n:r.length,hasLosses:E.length>0,fromStop:F}}async function N(r,{actionsSlot:I}){I.innerHTML="";const[E,h,L,x]=await Promise.all([A.get("ethan_positions").then(t=>t||[]),A.get("ethan_positions_history").then(t=>t||[]),A.get("ethan_capital_alcista"),A.get("ethan_capital_bajista")]),F={alcista:L||0,bajista:x||0};r.innerHTML=`
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
          <div class="mm-field"><label>Capital Asignado <span style="color:var(--text3);text-transform:none;">(editable)</span></label><input type="number" id="sz-capital" class="mm-input" value="${F.alcista}" step="100"></div>
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
          <div class="mm-field"><label>Capital Inicial (€)</label><input type="number" id="bt-capital" class="mm-input" value="${(L||0)+(x||0)||1e4}"></div>
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
          <div class="mm-field"><label>Capital Total (€)</label><input type="number" id="lim-capital" class="mm-input" value="${(L||0)+(x||0)||1e4}"></div>
          <div class="mm-field"><label>Máx. % por Posición</label><input type="number" id="lim-maxpos" class="mm-input" value="20"></div>
          <div class="mm-field"><label>Máx. % por Sector</label><input type="number" id="lim-maxsector" class="mm-input" value="35"></div>
          <div class="mm-field"><label>Máx. Exposición Total</label><input type="number" id="lim-maxtotal" class="mm-input" value="90"></div>
        </div>
        <button class="btn btn-primary" id="lim-check-btn" style="margin-top:14px;">Comprobar contra mi cartera actual</button>
        <div id="lim-results" style="margin-top:18px;"></div>
      </div>
    </div>
  `;function S(){const t=document.getElementById("sz-direction").value,s=F[t]||0;document.getElementById("sz-capital").value=s,document.getElementById("sz-capital-source").textContent=s>0?`Capital Asignado a ${t==="bajista"?"Bajista":"Alcista"} en Cartera`:`Sin Capital Asignado a ${t==="bajista"?"Bajista":"Alcista"} — configúralo en Cartera`,w()}function w(){const t=document.getElementById("sz-direction").value,s=document.getElementById("sz-ticker").value.trim().toUpperCase()||"—",a=parseFloat(document.getElementById("sz-capital").value)||0,l=parseFloat(document.getElementById("sz-risk").value)||0,i=parseFloat(document.getElementById("sz-entry").value)||0,c=parseFloat(document.getElementById("sz-stop").value)||0,m=parseFloat(document.getElementById("sz-tp").value)||null,u=a*(l/100),n=Math.abs(i-c),p=n>0?Math.floor(u/n):0,f=p*i,e=a>0?f/a*100:0,o=p*n,y=a>0?o/a*100:0,b=t==="alcista";if(document.getElementById("sz-res-title").textContent=`Resultado para ${s}`,document.getElementById("sz-out-dir").innerHTML=b?"📈 LONG":"📉 SHORT",document.getElementById("sz-out-dir").style.color=b?"var(--green)":"var(--red)",document.getElementById("sz-out-price").textContent=C(i),document.getElementById("sz-out-stop").textContent=C(c),document.getElementById("sz-out-stop-dist").textContent=`(-${C(n)}/acc)`,document.getElementById("sz-out-risk").textContent=C(u),document.getElementById("sz-out-risk-pct").textContent=`(${l.toFixed(2)}% de ${T(a)})`,m&&m>0){const k=Math.abs(m-i),d=n>0?(k/n).toFixed(2):"—";document.getElementById("sz-out-tp-row").style.display="flex",document.getElementById("sz-out-tp").textContent=C(m),document.getElementById("sz-out-tp-dist").textContent=`(+${C(k)}/acc)`,document.getElementById("sz-out-rr-row").style.display="flex",document.getElementById("sz-out-rr").textContent=`1 : ${d}`}else document.getElementById("sz-out-tp-row").style.display="none",document.getElementById("sz-out-rr-row").style.display="none";document.getElementById("sz-out-shares").textContent=p.toLocaleString("es-ES"),document.getElementById("sz-out-invested").textContent=T(f),document.getElementById("sz-out-invested-pct").textContent=`(${e.toFixed(1)}% del total)`,document.getElementById("sz-out-maxloss").textContent=T(o),document.getElementById("sz-out-maxloss-pct").textContent=`(${y.toFixed(2)}% del capital)`}["sz-capital","sz-risk","sz-entry","sz-stop","sz-tp","sz-ticker"].forEach(t=>{document.getElementById(t).addEventListener("input",w)}),document.getElementById("sz-direction").addEventListener("change",S),S();let v="alcista";function g(t){const s=h.filter(i=>(i.direction||"alcista")===t),a=P(s),l=document.getElementById("kl-source-badge");if(a){const i=a.fromStop?' · <span style="color:var(--amber)">pérdida estimada desde stop de entrada (sin pérdidas reales aún)</span>':"";l.innerHTML=`<span class="mm-source-badge real">✓ ${a.n} operaciones reales (${t})${i}</span>`,document.getElementById("kl-winrate").value=a.winRate.toFixed(1),document.getElementById("kl-avgwin").value=a.avgWinPct.toFixed(1),document.getElementById("kl-avgloss").value=a.avgLossPct.toFixed(1)}else l.innerHTML=`<span class="mm-source-badge">⚠ Sin operaciones cerradas en ${t} — introduce datos manualmente para simular</span>`;$()}document.querySelectorAll(".mm-subtab[data-kdir]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".mm-subtab[data-kdir]").forEach(s=>s.classList.remove("active")),t.classList.add("active"),v=t.dataset.kdir,g(v)})});function $(){var p;const t=(parseFloat(document.getElementById("kl-winrate").value)||0)/100,s=parseFloat(document.getElementById("kl-avgwin").value)||0,a=parseFloat(document.getElementById("kl-avgloss").value)||0,l=parseFloat(document.getElementById("kl-fraction").value),i=parseFloat((p=document.getElementById("sz-risk"))==null?void 0:p.value)||1.5;if(a<=0)return;const c=s/a,m=t-(1-t)/c,u=m*l;document.getElementById("kl-optimal").textContent=(m*100).toFixed(1)+"%",document.getElementById("kl-optimal").style.color=m>0?"var(--green)":"var(--red)",document.getElementById("kl-adjusted").textContent=(u*100).toFixed(1)+"%",document.getElementById("kl-fraction-label").textContent=`×${l} del Kelly completo`,document.getElementById("kl-current").textContent=i.toFixed(2)+"%";const n=document.getElementById("kl-verdict");m<=0?(n.textContent="🔴 Sin Edge",n.style.color="var(--red)"):i>m*100?(n.textContent="⚠️ Sobre-apalancado",n.style.color="var(--amber)"):m>.25?(n.textContent="⚠️ Edge muy alto, revisa",n.style.color="var(--amber)"):m>.05?(n.textContent="✅ Edge saludable",n.style.color="var(--green)"):(n.textContent="🟡 Edge marginal",n.style.color="var(--amber)")}["kl-winrate","kl-avgwin","kl-avgloss","kl-fraction"].forEach(t=>{document.getElementById(t).addEventListener("input",$)}),g("alcista");let B="total";function M(t){return[...t==="total"?h:h.filter(a=>(a.direction||"alcista")===t)].sort((a,l)=>(a.closedAt||0)-(l.closedAt||0))}function R(){const t=M(B),s=document.getElementById("bt-source-badge"),a=B==="total"?"Total (Alcista + Bajista)":B==="alcista"?"Alcista":"Bajista";t.length>0?s.innerHTML=`<span class="mm-source-badge real">✓ ${t.length} operaciones reales cerradas · ${a}</span>`:s.innerHTML=`<span class="mm-source-badge">⚠ Sin operaciones cerradas en ${a}</span>`}document.querySelectorAll("[data-btdir]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("[data-btdir]").forEach(s=>s.classList.remove("active")),t.classList.add("active"),B=t.dataset.btdir,R(),document.getElementById("bt-results").innerHTML="",document.getElementById("bt-status").textContent=""})}),R();function j(t,s,a){let l=s,i=s,c=0;const m=[s],u=[];t.forEach(e=>{const o=a(e,l),b=l*o*(e.pnlPct/100);l+=b,m.push(l),u.push(b/Math.max(l-b,1)),i=Math.max(i,l);const k=i>0?(i-l)/i*100:0;k>c&&(c=k)});const n=(l-s)/s*100,p=u.length?u.reduce((e,o)=>e+o,0)/u.length:0,f=u.length?Math.sqrt(u.reduce((e,o)=>e+(o-p)**2,0)/u.length):0;return{finalCapital:l,totalReturn:n,maxDD:c,volatility:f*100,curve:m}}return document.getElementById("bt-run-btn").addEventListener("click",()=>{const t=parseFloat(document.getElementById("bt-capital").value)||1e4,s=(parseFloat(document.getElementById("bt-risk").value)||1.5)/100,a=M(B),l=document.getElementById("bt-status");if(a.length===0){l.textContent="Sin operaciones cerradas en esta categoría — no se puede simular",document.getElementById("bt-results").innerHTML="";return}l.textContent=`Simulando ${a.length} operaciones con 4 métodos distintos...`;const i=P(a),c=(i==null?void 0:i.kelly)??null,m=c!=null?Math.max(0,c*.5):null,u=c==null?' · <span style="color:var(--amber)">⚠ Kelly no calculable — registra el stop de entrada en tus operaciones para activarlo</span>':i!=null&&i.fromStop?' · <span style="color:var(--amber)">pérdida estimada desde stop</span>':"";l.innerHTML=`Backtest sobre ${a.length} operaciones${u}`,c==null&&(l.innerHTML+=' — <span style="color:var(--text3)">Kelly se muestra como 0%</span>');const n=c??0,p=m??0,e=[{name:"Tu Sizing Real",desc:"Coste real de cada op / capital en ese momento",fn:(d,z)=>d.cost&&z>0?Math.min(d.cost/z,1):s,color:"var(--blue)"},{name:"Kelly Completo",desc:`f* = ${(n*100).toFixed(1)}%${c==null?" (sin datos)":""}`,fn:()=>n,color:"var(--red)"},{name:"Medio Kelly",desc:`½ × f* = ${(p*100).toFixed(1)}%${c==null?" (sin datos)":""}`,fn:()=>p,color:"var(--teal)"},{name:"Tamaño Fijo 10%",desc:"10% capital siempre",fn:()=>.1,color:"var(--amber)"}].map(d=>({...d,...j(a,t,d.fn)})),o=e.reduce((d,z)=>d.totalReturn>z.totalReturn?d:z),y=e.reduce((d,z)=>d.maxDD<z.maxDD?d:z),b=B==="total"?"Total (Alcista + Bajista)":B==="alcista"?"Alcista":"Bajista";l.textContent=`Backtest completado sobre ${a.length} operaciones reales cerradas · ${b}`;const k=document.getElementById("bt-results");k.innerHTML=`
      <div class="mm-bt-grid">
        ${e.map(d=>`
          <div class="mm-bt-card ${d===o?"best":""}">
            <div class="mm-bt-card-name">
              <span style="color:${d.color}">${d.name}</span>
              ${d===o?'<span class="method-badge recommended">MEJOR RENT.</span>':""}
            </div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:10px;font-family:var(--mono);">${d.desc}</div>
            <div class="mm-bt-metric"><span>Capital Final</span><strong>${T(d.finalCapital)}</strong></div>
            <div class="mm-bt-metric"><span>Rentabilidad</span><strong style="color:${d.totalReturn>=0?"var(--green)":"var(--red)"}">${d.totalReturn>=0?"+":""}${d.totalReturn.toFixed(1)}%</strong></div>
            <div class="mm-bt-metric"><span>Máx Drawdown</span><strong style="color:var(--red)">-${d.maxDD.toFixed(1)}%</strong></div>
            <div class="mm-bt-metric"><span>Volatilidad</span><strong>${d.volatility.toFixed(1)}%</strong></div>
          </div>`).join("")}
      </div>
      <div style="margin-top:14px;font-size:11px;color:var(--text2);background:var(--surface2);padding:12px 14px;border-radius:8px;line-height:1.6;">
        💡 <strong style="color:var(--teal)">${o.name}</strong> habría dado la mayor rentabilidad (${o.totalReturn.toFixed(1)}%), pero
        <strong style="color:var(--text1)">${y.name}</strong> habría sido el más seguro (drawdown máx. ${y.maxDD.toFixed(1)}%).
        Esto ilustra el trade-off clásico: más sizing = más rentabilidad potencial pero también más riesgo de ruina.
      </div>
    `}),document.getElementById("lim-check-btn").addEventListener("click",()=>{const t=parseFloat(document.getElementById("lim-capital").value)||1e4,s=parseFloat(document.getElementById("lim-maxpos").value)||20,a=parseFloat(document.getElementById("lim-maxsector").value)||35,l=parseFloat(document.getElementById("lim-maxtotal").value)||90,i=document.getElementById("lim-results");if(E.length===0){i.innerHTML='<div class="sc2-empty">Sin posiciones abiertas — añade alguna en el módulo Cartera</div>';return}const c=E.map(e=>({ticker:e.ticker,sector:e.sector||null,value:e.shares&&e.entry?e.shares*e.entry:e.cost||0})),u=c.reduce((e,o)=>e+o.value,0)/t*100,n={};c.forEach(e=>{const o=e.sector||"Sin sector";n[o]=(n[o]||0)+e.value});const p=(e,o)=>e>o?"bad":e>o*.8?"warn":"ok",f=e=>e==="ok"?"✓ OK":e==="warn"?"⚠ Cerca":"✗ Excede";i.innerHTML=`
      <div class="mm-source-badge real" style="margin-bottom:14px;">✓ Conectado a tus ${E.length} posiciones abiertas reales</div>
      <div class="mm-limits-grid">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;">Por Posición</div>
          ${c.map(e=>{const o=e.value/t*100,y=p(o,s);return`<div class="mm-limit-row"><span>${e.ticker}</span><span style="font-family:var(--mono);">${o.toFixed(1)}% / ${s}%</span><span class="mm-limit-status ${y}">${f(y)}</span></div>`}).join("")}
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;">Por Sector</div>
          ${Object.entries(n).map(([e,o])=>{const y=o/t*100,b=p(y,a);return`<div class="mm-limit-row"><span>${D[e]||e}</span><span style="font-family:var(--mono);">${y.toFixed(1)}% / ${a}%</span><span class="mm-limit-status ${b}">${f(b)}</span></div>`}).join("")}
          <div class="mm-limit-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:14px;">
            <span style="font-weight:700;">Exposición Total</span>
            <span style="font-family:var(--mono);">${u.toFixed(1)}% / ${l}%</span>
            <span class="mm-limit-status ${p(u,l)}">${f(p(u,l))}</span>
          </div>
        </div>
      </div>
    `}),r.querySelectorAll(".mm-tab").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll(".mm-tab").forEach(s=>s.classList.remove("active")),r.querySelectorAll(".mm-panel").forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.getElementById("panel-"+t.dataset.tab).classList.add("active")})}),{destroy(){}}}export{N as render};
