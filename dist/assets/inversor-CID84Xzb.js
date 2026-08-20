import{g as B}from"./macro-data-CGVdt8ED.js";async function F(k,{actionsSlot:j}){var c;j.innerHTML='<button class="btn btn-primary" id="inv-refresh">↻ Actualizar</button>',k.innerHTML='<div id="inv-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function l(a=!1){try{const t=await B(a);D(t)}catch(t){document.getElementById("inv-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${t.message}</div></div>`}}function D(a){var d,v,p,m,g,u,x,f,b,y,h,z,$,E,C,w,M,S,R,A,q;const t=document.getElementById("inv-wrap"),e=a.scoreTotal??0,o=a.coyuntura||{},i=a.liquidez||{},r=a.indicators||{};a.seguimiento;const n=e>=4?"var(--green)":e>=0?"var(--amber)":"var(--red)",I=e>=10?"Agresivo. El ciclo y la liquidez acompañan.":e>=4?"Moderado. Oportunidad selectiva.":e>=0?"Defensivo. No es momento de agresividad.":"Muy defensivo. Proteger capital primero.",L=e>=10?"75-90%":e>=4?"55-70%":e>=0?"35-55%":"15-35%",T=e>=4?["Mantener posiciones largas existentes con stops en EMA20 semanal","Favorecer sectores con alta liquidez: Tecnología, Industriales","Considerar small caps si el score supera +10","Oro como cobertura parcial ante riesgo de inflación"]:["Reducir exposición en RV si ya supera el "+(e>=0?"55%":"35%")+" del capital","Favorecer sectores defensivos: Healthcare, Consumo Básico, Utilities","Mantener oro como cobertura de inflación persistente","Cash y bonos cortos (< 2Y) para el resto de la cartera"],H=e>=4?["No aumentar posiciones en sectores muy sensibles a tipos (REITS, Utilities)","Evitar High Yield hasta que los spreads bajen de 3.5%"]:["No ampliar posiciones en growth o tecnología hasta que la curva se normalice","Evitar High Yield y bonos largos (sensibles a tipos altos)","No aumentar sizing total hasta que el score macro supere +"+(e>=0?"9":"4")],N=e<0&&((d=o.curvaUSD)==null?void 0:d.value)<0&&((v=i.m2)==null?void 0:v.score)<0,U=((p=o.curvaUSD)==null?void 0:p.value)>.9&&((m=i.m2)==null?void 0:m.score)>=0&&((g=i.impulso)==null?void 0:g.score)>0;t.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 300px;gap:14px;">
        <div>
          <!-- Veredicto -->
          <div class="mac-card" style="background:rgba(${e>=4?"74,222,128":e>=0?"251,191,36":"244,113,116"},0.04);border-color:rgba(${e>=4?"74,222,128":e>=0?"251,191,36":"244,113,116"},0.2);margin-bottom:12px;">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:10px;">Diagnóstico · ${new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"})}</div>
            <div style="font-family:var(--serif);font-size:34px;font-weight:600;font-style:italic;color:${n};line-height:1.15;margin-bottom:14px;">${I}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.8;">${e>=4?'El ciclo muestra <strong style="color:var(--text1)">señales expansivas</strong>. La liquidez acompaña y los spreads de crédito no muestran estrés sistémico. Entorno favorable para posiciones largas con gestión de riesgo activa.':e>=0?'El ciclo muestra <strong style="color:var(--text1)">señales mixtas</strong>: algunos indicadores adelantados se deterioran mientras la liquidez se mantiene. No es el momento de ampliar exposición agresivamente, pero tampoco de salir del mercado.':`El ciclo muestra <strong style="color:var(--text1)">señales claras de desaceleración</strong>: curva${((u=o.curvaUSD)==null?void 0:u.value)<0?" invertida":"comprimiendo"}, LEI ${((x=r.lei)==null?void 0:x.score)<0?"negativo":"débil"}, liquidez insuficiente. El único soporte puede ser el sentimiento o el mercado laboral — pero no eliminan el riesgo, solo lo retrasan.`}</div>
          </div>

          <!-- Acciones -->
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:12px;">Acciones Recomendadas</div>
            ${T.map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surface2);border-radius:6px;margin-bottom:6px;font-size:11px;color:var(--text1);"><div style="width:18px;height:18px;border-radius:50%;background:rgba(74,222,128,0.15);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">✓</div>${s}</div>`).join("")}
            ${H.map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surface2);border-radius:6px;margin-bottom:6px;font-size:11px;color:var(--text1);"><div style="width:18px;height:18px;border-radius:50%;background:rgba(244,113,116,0.15);color:var(--red);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">✗</div>${s}</div>`).join("")}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Resumen factores -->
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:12px;">Resumen de Factores</div>
            ${[["Macro Score",(e>=0?"+":"")+e+" / +17",n],["Liquidez",((f=i.m2)==null?void 0:f.score)>=0?"Positiva":"Contractiva",((b=i.m2)==null?void 0:b.score)>=0?"var(--green)":"var(--red)"],["Política monetaria",((y=o.tipoReal)==null?void 0:y.value)!=null?o.tipoReal.value>=1?"Muy restrictiva":o.tipoReal.value>=.5?"Restrictiva":"Acomodaticia":"—",((h=o.tipoReal)==null?void 0:h.score)>0?"var(--green)":"var(--red)"],["Crédito",((z=i.bbbSpread)==null?void 0:z.score)>0?"Tranquilo":(($=i.bbbSpread)==null?void 0:$.score)===0?"Bajo tensión":"Estrés",((E=i.bbbSpread)==null?void 0:E.score)>0?"var(--green)":((C=i.bbbSpread)==null?void 0:C.score)===0?"var(--amber)":"var(--red)"],["Sentimiento",((w=r.fearGreed)==null?void 0:w.value)!=null?r.fearGreed.value>55?"Codicioso":r.fearGreed.value<40?"Miedo":"Neutral":"—",((M=r.fearGreed)==null?void 0:M.score)>0?"var(--green)":((S=r.fearGreed)==null?void 0:S.score)===0?"var(--amber)":"var(--red)"],["Inflación",(R=a.riesgoContagio)!=null&&R.nivel?a.riesgoContagio.nivel.charAt(0).toUpperCase()+a.riesgoContagio.nivel.slice(1):"—",((A=a.riesgoContagio)==null?void 0:A.nivel)==="bajo"?"var(--green)":((q=a.riesgoContagio)==null?void 0:q.nivel)==="moderado"?"var(--amber)":"var(--red)"]].map(([s,P,V])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);"><span style="font-size:11px;color:var(--text2);">${s}</span><span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${V};">${P}</span></div>`).join("")}
            <div style="margin-top:10px;">
              <div style="font-size:9px;color:var(--text3);margin-bottom:4px;">Exposición RV recomendada</div>
              <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:${n};">${L}</div>
            </div>
          </div>

          <!-- Alertas -->
          ${N?`<div class="mac-card" style="background:rgba(244,113,116,0.06);border-color:rgba(244,113,116,0.25);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--red);margin-bottom:8px;">🚨 Alerta Máxima Activa</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">Curva invertida + M2 contractivo + score negativo simultáneamente. Activar protocolo defensivo completo: reducir RV al 20-30% y aumentar cash.</div>
          </div>`:""}
          ${U?`<div class="mac-card" style="background:rgba(74,222,128,0.06);border-color:rgba(74,222,128,0.25);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--green);margin-bottom:8px;">✅ Señal de Cambio Positivo</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">Curva positiva + impulso crediticio positivo + M2 expansivo. Score superaría +10. Aumentar RV al 75-85% con agresividad.</div>
          </div>`:`<div class="mac-card" style="background:var(--surface2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Señal de Cambio Positivo</div>
            <div style="font-size:11px;color:var(--text3);line-height:1.5;">Curva USD ≥+0.90% + Impulso crediticio ≥+1.0 + M2 ≥+5% simultáneamente → score superaría +10. Aumentar RV al 75-85%.</div>
          </div>`}
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Modo Inversor · síntesis automática del sistema macro ETHAN · no constituye asesoramiento financiero</div>
    `}return(c=document.getElementById("inv-refresh"))==null||c.addEventListener("click",()=>l(!0)),await l(!1),{destroy(){}}}export{F as render};
