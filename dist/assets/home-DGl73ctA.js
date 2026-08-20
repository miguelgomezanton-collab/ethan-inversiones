import{g as ie}from"./macro-data-CGVdt8ED.js";const $=n=>n!=null?Number(n).toFixed(1):"—",c=n=>n!=null?Number(n).toFixed(2):"—";function re(n){var i,I,g,v,u,l,a,h,A,M,m,C,O,U,x,k,B,j,G,H,f,T,L,z,R,N,Y,w,D;const r=n.coyuntura||{},e=n.liquidez||{},s=n.seguimiento||{},d=n.indicators||{},E=n.riesgoContagio,b=n.probabilities||{},S=n.scoreTotal??0,t=(P,y,F="")=>y!=null?`- ${P}: ${typeof y=="number"?(y>=0?"+":"")+c(y):y}${F}`:null;return`Eres ETHAN, un sistema de análisis macroeconómico profesional para un inversor particular. 
Tienes acceso a los datos macro actualizados del sistema de scoring ETHAN (rango -17 a +17).

Aquí están los datos macro en tiempo real:

${[`SCORE MACRO TOTAL: ${S>=0?"+":""}${S} / +17 → ${n.zone}`,"","## INDICADORES ADELANTADOS",t("Curva USD (10Y−2Y)",(i=r.curvaUSD)==null?void 0:i.value,"%")+(((I=r.curvaUSD)==null?void 0:I.score)!=null?` → score ${r.curvaUSD.score>0?"+1":r.curvaUSD.score===0?"0":"-1"} (umbral: ≥+0.90%→+1, +0.48-0.89%→0, <+0.48%→-1)`:""),t("Curva EUR (10Y−2Y)",(g=r.curvaEUR)==null?void 0:g.value,"%")+(((v=r.curvaEUR)==null?void 0:v.score)!=null?` → score ${r.curvaEUR.score>0?"+1":r.curvaEUR.score===0?"0":"-1"} (umbral: ≥+0.60%→+1)`:""),t("LEI USA m/m",(u=d.lei)==null?void 0:u.value,"%")+(((l=d.lei)==null?void 0:l.score)!=null?` → score ${d.lei.score>0?"+1":d.lei.score===0?"0":"-1"} (umbral: ≥+0.3%→+1)`:""),"","## LIQUIDEZ GLOBAL",t("M2 Global YoY",(a=e.m2)==null?void 0:a.value,"%")+(((h=e.m2)==null?void 0:h.score)!=null?` → score ${e.m2.score} (umbral: ≥+5%→+3, +3-4.9%→+1, <+3%→-3, peso ×3)`:""),(A=e.m2)!=null&&A.components?`  Desglose: USA ${c(e.m2.components.usYoY)}% / EUR ${c(e.m2.components.eurYoY)}% / JPN ${c(e.m2.components.jpYoY)}% / CHN ${e.m2.components.chnYoY!=null?c(e.m2.components.chnYoY)+"%":"pendiente"}`:null,t("Crédito vs Nominal GDP",(M=e.credito)==null?void 0:M.value,"%")+(((m=e.credito)==null?void 0:m.score)!=null?` → score ${e.credito.score} (peso ×3)`:""),((C=e.credito)==null?void 0:C.creditYoY)!=null?`  Desglose: crédito YoY ${c(e.credito.creditYoY)}% vs GDP YoY ${c(e.credito.gdpYoY)}%`:null,t("Impulso Crediticio",(O=e.impulso)==null?void 0:O.value)+(((U=e.impulso)==null?void 0:U.score)!=null?` → score ${e.impulso.score} (peso ×2)`:""),t("Velocidad M2 YoY",(x=e.velM2)==null?void 0:x.value,"%")+(((k=e.velM2)==null?void 0:k.score)!=null?` → score ${e.velM2.score} (peso ×2)`:""),t("Reservas Bancarias Fed",(B=e.reservas)==null?void 0:B.value,"T$")+(((j=e.reservas)==null?void 0:j.score)!=null?` → score ${e.reservas.score} (umbral: ≥$3.5T→+1)`:""),t("BBB Spread",(G=e.bbbSpread)==null?void 0:G.value,"%")+(((H=e.bbbSpread)==null?void 0:H.score)!=null?` → score ${e.bbbSpread.score} (umbral: ≤1.00%→+1)`:""),"","## POLÍTICA MONETARIA & INFLACIÓN",t("Fed Funds Rate",(f=s.ffr)==null?void 0:f.value,"%"),t("Tipo Real (FFR−CPI)",(T=r.tipoReal)==null?void 0:T.value,"%")+(((L=r.tipoReal)==null?void 0:L.score)!=null?` → score ${r.tipoReal.score>0?"+1":r.tipoReal.score===0?"0":"-1"} (umbral: ≥+1.0%→+1)`:""),t("CPI Headline YoY",(z=r.cpi)==null?void 0:z.value,"%"),t("CPI Core YoY",(R=r.cpi)==null?void 0:R.cpiCore,"%"),E?`- Riesgo de Contagio inflacionario: ${E.nivel.toUpperCase()} (${E.pct}%) — tipo ${E.tipo}`:null,t("Breakeven 1Y (T1YIE)",(N=s.breakeven1y)==null?void 0:N.value,"%"),t("Breakeven 5Y (T5YIE)",(Y=s.breakeven5y)==null?void 0:Y.value,"%"),"","## SENTIMIENTO & CRÉDITO",((w=d.fearGreed)==null?void 0:w.value)!=null?`- Fear & Greed CNN: ${d.fearGreed.value} (${d.fearGreed.label_text||"—"}) → score ${d.fearGreed.score>0?"+1":d.fearGreed.score===0?"0":"-1"} (umbral: <40→+1 contrarian, >54→-1 riesgo)`:null,s.vix?`- VIX: ${$(s.vix.value)} vs SMA200: ${$(s.vix.sma200)} → ${s.vix.aboveSMA200?"SOBRE SMA200 — alerta volatilidad bajista":"bajo SMA200 — volatilidad contenida"}`:null,t("HY Spread",(D=s.hySpread)==null?void 0:D.value,"%"),s.wti?`- WTI: $${$(s.wti.value)} (${s.wti.change>=0?"+":""}${$(s.wti.change)}% hoy)`:null,"","## PROBABILIDADES DE ESCENARIO",`- Recesión 12m: ${b.recesion||0}%`,`- Stagflación: ${b.stagflation||0}%`,`- Soft Landing: ${b.softLanding||0}%`,`- Expansión: ${b.expansion||0}%`].filter(Boolean).join(`
`)}

INSTRUCCIONES:
Genera un análisis ejecutivo en español de exactamente 5 párrafos. Estructura:
1. DIAGNÓSTICO DEL CICLO: dónde estamos y hacia dónde vamos, usando los indicadores adelantados (curvas, LEI)
2. LIQUIDEZ: si hay combustible para que el ciclo continúe o no, qué dice el M2, el crédito y las reservas
3. INFLACIÓN Y POLÍTICA MONETARIA: si la Fed puede actuar o está atrapada, riesgo de contagio estructural
4. SENTIMIENTO Y SEÑALES DE MERCADO: qué dice el Fear&Greed, el VIX y los spreads de crédito
5. CONCLUSIÓN ACCIONABLE: 2-3 frases concretas sobre posicionamiento para esta semana

Reglas de formato estrictas:
- NO uses #, ##, ---,  ni ningún símbolo markdown de encabezado o separador
- Empieza cada párrafo directamente con el título en MAYÚSCULAS seguido de un espacio y el texto, sin salto de línea entre título y contenido. Ejemplo: "DIAGNÓSTICO DEL CICLO El ciclo muestra..."
- Usa **negrita** solo para conceptos clave dentro del texto
- Sin bullet points, todo en prosa continua
- No repitas los números que ya aparecen en el dashboard — interprétalos
- Tono directo, técnico pero claro, sin rodeos`}async function ne(n){const r=await fetch("/api/macro-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n})});if(!r.ok){const s=await r.json().catch(()=>({}));throw new Error(s.error||`HTTP ${r.status}`)}return(await r.json()).text||""}async function le(n,{actionsSlot:r}){var b,S;r.innerHTML=`
    <button class="btn" id="home-ai-btn">✦ Análisis ETHAN IA</button>
    <button class="btn btn-primary" id="home-refresh">↻ Actualizar</button>
  `,n.innerHTML='<div id="home-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando dashboard...</div></div></div>';let e=null;async function s(t=!1){try{const p=await ie(t);e=p,E(p)}catch(p){document.getElementById("home-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${p.message}</div></div>`}}async function d(){if(!e)return;const t=document.getElementById("home-ai-btn"),p=document.getElementById("home-ai-box");if(p){t.disabled=!0,t.textContent="✦ Generando...",p.innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
        <div class="loader-ring"></div>
        <span style="font-size:11px;color:var(--text3);font-family:var(--mono);">Analizando ${Object.values(e.indicators||{}).filter(i=>(i==null?void 0:i.score)!=null).length} indicadores macro...</span>
      </div>`;try{const i=re(e),v=(await ne(i)).replace(/^#{1,3}\s.*$/gm,"").replace(/^-{3,}$/gm,"").replace(/^\*{3,}$/gm,"").trim().replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").split(/\n\n+/).filter(u=>u.trim()).map(u=>`<p style="margin-bottom:12px;line-height:1.75;">${u.trim()}</p>`).join("");p.innerHTML=`
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:var(--teal);margin-bottom:10px;">
          ✦ Análisis ETHAN IA · ${new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})} · Score ${e.scoreTotal>=0?"+":""}${e.scoreTotal} / +17
        </div>
        <div style="font-size:12px;color:var(--text2);">${v}</div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:9px;color:var(--text3);font-family:var(--mono);">
          Generado automáticamente con Claude · No constituye asesoramiento financiero · ETHAN v11
        </div>`}catch(i){p.innerHTML=`<div style="font-size:11px;color:var(--red);font-family:var(--mono);">⚠ Error al generar análisis: ${i.message}</div>`}finally{t.disabled=!1,t.textContent="✦ Análisis ETHAN IA"}}}function E(t){var L,z,R,N,Y,w,D,P,y,F,q,V,Z,J,Q,X,W,_,K,ee,te,oe;const p=document.getElementById("home-wrap"),i=t.scoreTotal??0,I=t.zone||"—",g=t.probabilities||{},v=t.indicators||{},u=t.seguimiento||{},l=t.liquidez||{},a=t.coyuntura||{},h=i>=4?"var(--green)":i>=0?"var(--amber)":"var(--red)",A=(L=Object.entries(g).sort((o,ae)=>ae[1]-o[1])[0])==null?void 0:L[0],M={recesion:"Recesión 12m",stagflation:"Stagflación",softLanding:"Soft Landing",expansion:"Expansión"},m=Object.values(v).filter(o=>(o==null?void 0:o.score)!=null),C=m.filter(o=>o.score>0).length,O=m.filter(o=>o.score<0).length,U=m.filter(o=>o.score===0).length,x=m.length?Math.round(C/m.length*100):0,k=(((z=a.curvaUSD)==null?void 0:z.score)||0)+(((R=a.curvaEUR)==null?void 0:R.score)||0)+(((N=v.lei)==null?void 0:N.score)||0),B=(((Y=l.m2)==null?void 0:Y.score)||0)+(((w=l.impulso)==null?void 0:w.score)||0)+(((D=l.velM2)==null?void 0:D.score)||0),j=(((P=a.tipoReal)==null?void 0:P.score)||0)+(((y=l.reservas)==null?void 0:y.score)||0),G=((F=v.cpi)==null?void 0:F.score)||0,H=((q=v.fearGreed)==null?void 0:q.score)||0;p.innerHTML=`
      <div style="display:grid;grid-template-columns:220px 1fr 180px;gap:14px;margin-bottom:14px;">

        <!-- Score -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;">
          <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">MACRO SCORE</div>
          <div style="font-family:var(--serif);font-size:60px;font-weight:600;font-style:italic;line-height:1;color:${h}">${i>=0?"+":""}${i}</div>
          <div style="font-family:var(--serif);font-size:18px;font-style:italic;color:${h};margin-top:6px;">${I}</div>
          <div style="height:4px;background:var(--surface2);border-radius:2px;width:100%;margin-top:12px;overflow:hidden;">
            <div style="height:100%;width:${Math.max(0,(i+17)/34*100)}%;background:${h};border-radius:2px;"></div>
          </div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:5px;">${i>=0?"+":""}${i} de ±17</div>
        </div>

        <!-- Probabilidades + Semáforo -->
        <div class="mac-card">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Escenarios</div>
              ${[{k:"recesion",l:"Recesión 12m",c:"var(--red)"},{k:"stagflation",l:"Stagflación",c:"var(--amber)"},{k:"softLanding",l:"Soft Landing",c:"var(--teal)"},{k:"expansion",l:"Expansión",c:"var(--green)"}].map(o=>`
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
                  <span style="font-size:10px;color:var(--text2);width:90px;flex-shrink:0;">${o.l}</span>
                  <div style="flex:1;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${g[o.k]||0}%;background:${o.c};border-radius:3px;"></div>
                  </div>
                  <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${o.c};width:32px;text-align:right;">${g[o.k]||0}%</span>
                </div>`).join("")}
            </div>
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Semáforo</div>
              ${[{l:"Ciclo económico",v:((V=a.curvaUSD)==null?void 0:V.value)!=null?a.curvaUSD.value<0?"Curva invertida":"Curva positiva":"—",s:k},{l:"Liquidez global",v:((Z=l.m2)==null?void 0:Z.value)!=null?(l.m2.value>=0?"+":"")+c(l.m2.value)+"% M2":"—",s:B},{l:"Política monetaria",v:((J=a.tipoReal)==null?void 0:J.value)!=null?"Tipo real "+(a.tipoReal.value>=0?"+":"")+c(a.tipoReal.value)+"%":"—",s:j},{l:"Inflación",v:((Q=a.cpi)==null?void 0:Q.value)!=null?"CPI "+$(a.cpi.value)+"%":"—",s:G},{l:"Sentimiento",v:((X=u.fearGreed)==null?void 0:X.value)!=null?"F&G "+u.fearGreed.value:"—",s:H}].map(o=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;border:1px solid var(--border);margin-bottom:5px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:var(--${o.s>0?"green":o.s<0?"red":"amber"});flex-shrink:0;"></div>
                  <span style="flex:1;font-size:10px;color:var(--text1);">${o.l}</span>
                  <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">${o.v}</span>
                </div>`).join("")}
            </div>
          </div>
        </div>

        <!-- Delta -->
        <div class="mac-card" style="display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center;text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:4px;">vs Mes Anterior</div>
          <div style="padding:10px 0;border-bottom:1px solid var(--border);width:100%;">
            <div style="font-size:28px;font-weight:700;color:var(--green);">↑ ${C}</div>
            <div style="font-size:10px;color:var(--text3);">Mejoran</div>
          </div>
          <div style="padding:10px 0;border-bottom:1px solid var(--border);width:100%;">
            <div style="font-size:28px;font-weight:700;color:var(--red);">↓ ${O}</div>
            <div style="font-size:10px;color:var(--text3);">Empeoran</div>
          </div>
          <div style="padding:10px 0;width:100%;">
            <div style="font-size:28px;font-weight:700;color:var(--text3);">= ${U}</div>
            <div style="font-size:10px;color:var(--text3);">Sin cambios</div>
          </div>
          <div style="padding-top:8px;border-top:1px solid var(--border);width:100%;">
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Índice difusión</div>
            <div style="font-family:var(--mono);font-size:18px;font-weight:700;margin-top:3px;color:${x>=50?"var(--green)":x>=30?"var(--amber)":"var(--red)"};">${x}%</div>
            <div style="font-size:9px;color:var(--text3);margin-top:2px;">${x>=50?"señal alcista":x>=30?"señal neutra":"señal bajista"}</div>
          </div>
        </div>
      </div>

      <!-- Frase ejecutiva automática -->
      <div class="mac-card" style="background:rgba(${i>=4?"74,222,128":i>=0?"251,191,36":"244,113,116"},0.04);border-color:rgba(${i>=4?"74,222,128":i>=0?"251,191,36":"244,113,116"},0.18);margin-bottom:14px;">
        <div style="font-family:var(--serif);font-size:15px;font-style:italic;color:var(--text1);line-height:1.8;" id="home-phrase">Cargando diagnóstico...</div>
      </div>

      <!-- Bloque análisis IA -->
      <div class="mac-card" style="border-color:rgba(64,217,192,0.25);margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--teal);">✦ Análisis Inteligente ETHAN</div>
            <div style="font-size:10px;color:var(--text3);margin-top:3px;">Interpretación automática de los ${m.length} indicadores activos con Claude</div>
          </div>
          <button id="home-ai-btn-inner" class="btn btn-primary" style="white-space:nowrap;">✦ Generar análisis</button>
        </div>
        <div id="home-ai-box" style="min-height:48px;display:flex;align-items:center;">
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono);">Pulsa "Generar análisis" para obtener la interpretación IA de los datos actuales.</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="mac-card-sm"><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">ÚLTIMA ACTUALIZACIÓN</div><div style="font-family:var(--mono);font-size:12px;color:var(--text1);">${t.updatedAt?new Date(t.updatedAt).toLocaleString("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"—"}</div></div>
        <div class="mac-card-sm"><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">ESCENARIO MÁS PROBABLE</div><div style="font-family:var(--mono);font-size:12px;color:${h};">${M[A]||"—"} · ${g[A]||0}%</div></div>
      </div>
    `;const f=[];((W=a.curvaUSD)==null?void 0:W.value)!=null&&f.push(a.curvaUSD.value<0?`La <strong>curva USD invertida</strong> (${c(a.curvaUSD.value)}%) anticipa desaceleración`:`La curva USD positiva (+${c(a.curvaUSD.value)}%) apoya el ciclo`),((_=l.m2)==null?void 0:_.value)!=null&&f.push(l.m2.score<0?`la <strong>liquidez es insuficiente</strong> (M2 ${c(l.m2.value)}%)`:`la liquidez global es expansiva (M2 +${c(l.m2.value)}%)`),((K=a.cpi)==null?void 0:K.value)!=null&&((ee=a.cpi)==null?void 0:ee.cpiCore)!=null&&f.push(`inflación Headline ${$(a.cpi.value)}% vs Core ${$(a.cpi.cpiCore)}%`),((te=a.tipoReal)==null?void 0:te.value)!=null&&f.push(`tipo real ${a.tipoReal.value>=0?"restrictivo +":"acomodaticio "}${c(a.tipoReal.value)}%`);const T=document.getElementById("home-phrase");if(T){const o=f.join(". ")+(f.length?".":"Introduce los datos manuales para el diagnóstico completo.");T.innerHTML=o.charAt(0).toUpperCase()+o.slice(1)}(oe=document.getElementById("home-ai-btn-inner"))==null||oe.addEventListener("click",d)}return(b=document.getElementById("home-refresh"))==null||b.addEventListener("click",()=>s(!0)),(S=document.getElementById("home-ai-btn"))==null||S.addEventListener("click",d),await s(!1),{destroy(){}}}export{le as render};
