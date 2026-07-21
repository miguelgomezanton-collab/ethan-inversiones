import{g as b}from"./macro-data-CGVdt8ED.js";function x(o,a,d,s){let i=new Date(o,a,1),e=0;for(;;){if(i.getDay()===s&&(e++,e===d))return new Date(i);i.setDate(i.getDate()+1)}}function D(o,a,d){let s=new Date(o,a+1,0);for(;s.getDay()!==d;)s.setDate(s.getDate()-1);return s}function g(o){return o.toLocaleDateString("es-ES",{weekday:"short",day:"numeric",month:"short"})}function y(o){const a=Math.round((o-new Date)/864e5);return a<0?`hace ${-a}d`:a===0?"Hoy":a===1?"Mañana":`en ${a} días`}function u(o){return o<new Date}function w(){const o=new Date,a=[];for(let i=-1;i<=3;i++){const e=(o.getMonth()+i+12)%12,r=o.getFullYear()+Math.floor((o.getMonth()+i)/12),p=x(r,e,2,3);p.setHours(14,30),a.push({date:p,name:`CPI USA (${p.toLocaleDateString("es-ES",{month:"short",year:"numeric"})})`,stars:5,cat:"inflacion",detail:"Dato de inflación mensual. Mayor driver de mercado junto con Payrolls. Sorpresa ±0.2% → RV ±2%.",impact:"RV ±2% · Bonos ±1%"});const l=D(r,e,5);l.setHours(14,30),a.push({date:l,name:`Core PCE (${l.toLocaleDateString("es-ES",{month:"short",year:"numeric"})})`,stars:4,cat:"inflacion",detail:"Indicador de inflación preferido de la Fed. Suele ir alineado con Core CPI.",impact:"RV ±1% · Fed expectativas"});const f=x(r,e,1,5);f.setHours(14,30),a.push({date:f,name:`Payrolls USA (${f.toLocaleDateString("es-ES",{month:"short",year:"numeric"})})`,stars:5,cat:"empleo",detail:"Creación de empleo no agrícola. Si >250k → Fed más restrictiva. Si <100k → señal de enfriamiento.",impact:"RV ±1.5% · USD ±0.5%"});const t=x(r,e,2,2);t.setHours(14,30),a.push({date:t,name:`PPI USA (${t.toLocaleDateString("es-ES",{month:"short",year:"numeric"})})`,stars:3,cat:"inflacion",detail:"Precios al productor — adelanta presiones en el CPI con 1-2 meses.",impact:"Moderado"});const n=new Date(r,e,2);if(n.setHours(16,0),a.push({date:n,name:`ISM Manufacturero (${n.toLocaleDateString("es-ES",{month:"short"})})`,stars:3,cat:"ciclo",detail:"50 = expansión/contracción. Por debajo de 48 durante 3+ meses = señal de recesión industrial.",impact:"RV ±0.5%"}),[0,2,4,5,6,8,10,11].includes(e)){const c=x(r,e,3,3);c.setHours(20,0),a.push({date:c,name:`FOMC Decision (${c.toLocaleDateString("es-ES",{month:"short",year:"numeric"})})`,stars:5,cat:"polmon",detail:"Decisión de tipos + dot plot + rueda de prensa Powell. El mayor catalizador de mercado de forma recurrente.",impact:"RV ±2-3% · Bonos ±2%"});const v=new Date(c);v.setDate(v.getDate()+21),a.push({date:v,name:`FOMC Minutes (${v.toLocaleDateString("es-ES",{month:"short"})})`,stars:3,cat:"polmon",detail:"Actas de la reunión FOMC. Matices sobre el tono hawkish/dovish del comité.",impact:"Moderado"})}if([0,3,6,9].includes(e)){const c=new Date(r,e,30);c.setHours(14,30),a.push({date:c,name:`GDP USA Avance Q${Math.ceil(e/3)} (${c.toLocaleDateString("es-ES",{month:"short"})})`,stars:4,cat:"ciclo",detail:"Primera estimación del PIB. Si < 0 dos trimestres consecutivos → recesión técnica.",impact:"RV ±1.5%"})}}const d=new Date(o.getTime()-14*864e5),s=new Date(o.getTime()+90*864e5);return a.filter(i=>i.date>=d&&i.date<=s).sort((i,e)=>i.date-e.date)}const h={inflacion:"var(--red)",empleo:"var(--green)",polmon:"var(--teal)",ciclo:"var(--amber)"},$={inflacion:"Inflación",empleo:"Empleo",polmon:"Pol. Monetaria",ciclo:"Ciclo"};function S(o){return"★".repeat(o)+"☆".repeat(5-o)}async function P(o,{actionsSlot:a}){var i;a.innerHTML='<button class="btn btn-primary" id="cal-refresh">↻ Actualizar</button>',o.innerHTML='<div id="cal-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function d(e=!1){try{const r=await b(e);s(r)}catch(r){document.getElementById("cal-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${r.message}</div></div>`}}function s(e){const r=document.getElementById("cal-wrap"),p=w(),l=p.find(t=>t.stars===5&&!u(t.date)),f=p.find(t=>!u(t.date));r.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 240px;gap:14px;">
        <div>
          ${p.map(t=>{const n=u(t.date),m=f&&t.date.getTime()===f.date.getTime(),c=h[t.cat]||"var(--text3)";return`<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:8px;border:1px solid ${m?"rgba(64,217,192,0.35)":"var(--border)"};background:${m?"var(--teal-dim)":n?"transparent":"var(--surface)"};margin-bottom:8px;opacity:${n?"0.45":"1"};">
              <div style="flex-shrink:0;width:90px;">
                <div style="font-family:var(--mono);font-size:9px;color:${m?"var(--teal)":n?"var(--text3)":"var(--text2)"};">${g(t.date)}</div>
                <div style="font-family:var(--mono);font-size:10px;font-weight:700;color:${m?"var(--teal)":n?"var(--text3)":"var(--text1)"};margin-top:2px;">${y(t.date)}</div>
              </div>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                  <span style="font-size:12px;font-weight:600;color:${m?"var(--teal)":n?"var(--text3)":"var(--text1)"};">${t.name}</span>
                  <span style="font-size:8px;font-family:var(--mono);font-weight:700;padding:1px 6px;border-radius:8px;background:rgba(${t.cat==="inflacion"?"244,113,116":t.cat==="empleo"?"74,222,128":t.cat==="polmon"?"64,217,192":"251,191,36"},0.1);color:${c};">${$[t.cat]}</span>
                </div>
                <div style="font-size:10px;color:var(--text2);margin-bottom:3px;">${t.detail}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Impacto: ${t.impact}</div>
              </div>
              <div style="flex-shrink:0;text-align:right;">
                <div style="color:var(--amber);letter-spacing:1px;font-size:12px;">${S(t.stars)}</div>
                ${m?'<div style="font-size:8px;font-family:var(--mono);color:var(--teal);margin-top:3px;">PRÓXIMO</div>':""}
              </div>
            </div>`}).join("")}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          ${l?`<div class="mac-card" style="background:var(--teal-dim);border-color:rgba(64,217,192,0.3);text-align:center;">
            <div style="font-family:var(--mono);font-size:9px;color:var(--teal);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">Próximo Crítico ★★★★★</div>
            <div style="font-family:var(--serif);font-size:18px;font-weight:600;font-style:italic;color:var(--text1);margin-bottom:6px;">${l.name.split("(")[0].trim()}</div>
            <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--teal);margin:8px 0;">${y(l.date)}</div>
            <div style="font-size:10px;color:var(--text2);line-height:1.5;">${g(l.date)}</div>
            <div style="font-size:9px;color:var(--text3);margin-top:6px;">${l.impact}</div>
          </div>`:""}

          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Leyenda</div>
            ${Object.entries($).map(([t,n])=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:10px;"><div style="width:8px;height:8px;border-radius:50%;background:${h[t]};flex-shrink:0;"></div>${n}</div>`).join("")}
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">Horas en CET</div>
              <div style="font-size:10px;color:var(--text2);">CPI/PPI/NFP: 14:30<br>FOMC: 20:00<br>ISM: 16:00</div>
            </div>
          </div>

          <div class="mac-card" style="background:var(--surface2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Score Macro Actual</div>
            <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${(e.scoreTotal??0)>=4?"var(--green)":(e.scoreTotal??0)>=0?"var(--amber)":"var(--red)"};">${(e.scoreTotal??0)>=0?"+":""}${e.scoreTotal??"—"}</div>
            <div style="font-size:11px;color:var(--text2);margin-top:4px;">${e.zone||"—"}</div>
            <div style="font-size:10px;color:var(--text3);margin-top:6px;line-height:1.5;">Un CPI al alza con score ya negativo = protocolo defensivo inmediato.</div>
          </div>
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Fechas calculadas automáticamente · FOMC, CPI y NFP según calendario oficial aproximado · verificar con fuente oficial antes de operar</div>
    `}return(i=document.getElementById("cal-refresh"))==null||i.addEventListener("click",()=>d(!0)),await d(!1),{destroy(){}}}export{P as render};
