import{g as T,a as C,s as q}from"./macro-data-CGVdt8ED.js";const s=o=>o!=null?Number(o).toFixed(2):"—",g=o=>o!=null?(o>=0?"+":"")+Number(o).toFixed(2):"—",m=o=>o>0?"var(--green)":o===0?"var(--amber)":"var(--red)";function S(o){const t=Object.values(o).filter(a=>(a==null?void 0:a.score)!=null).reduce((a,n)=>a+n.score,0);return t>=4?{title:"Liquidez Expansiva",c:"var(--green)",sub:"Combustible para el ciclo",score:t}:t>=0?{title:"Liquidez Neutral",c:"var(--amber)",sub:"Mixto — selectividad clave",score:t}:t>=-4?{title:"Liquidez Contractiva",c:"var(--red)",sub:"El dinero se retira del sistema",score:t}:{title:"Drenaje Severo",c:"var(--red)",sub:"Riesgo sistémico — reducir exposición",score:t}}function w(o){var a,n,l;const t=[];return((a=o.m2)==null?void 0:a.value)!=null&&t.push(o.m2.value>=5?`El <strong>M2 crece fuerte</strong> (+${s(o.m2.value)}% YoY) — combustible para el ciclo`:o.m2.value>=3?`El <strong>M2 crece moderadamente</strong> (+${s(o.m2.value)}% YoY)`:`El <strong>M2 está por debajo del umbral</strong> (${g(o.m2.value)}% YoY) — presión sobre activos de riesgo`),((n=o.impulso)==null?void 0:n.value)!=null&&t.push(o.impulso.value>=1?`el <strong>impulso crediticio es fuerte</strong> (+${s(o.impulso.value)})`:o.impulso.value>=.5?`el impulso crediticio es positivo (+${s(o.impulso.value)})`:`el <strong>impulso crediticio es negativo</strong> (${s(o.impulso.value)}) — frena el gasto con 6-9 meses de retardo`),((l=o.reservas)==null?void 0:l.value)!=null&&t.push(o.reservas.value>=3.5?`las reservas bancarias son abundantes ($${s(o.reservas.value)}T)`:o.reservas.value>=2.5?`las reservas están en nivel bajo ($${s(o.reservas.value)}T) — QT activo de la Fed`:`las <strong>reservas son insuficientes</strong> ($${s(o.reservas.value)}T) — riesgo de credit crunch`),t.join(". ")+(t.length?".":"Introduce los datos manuales para obtener el diagnóstico de liquidez.")}function A(o,t,a="var(--green)",n="var(--red)"){const l=Math.min(Math.abs(o||0)/t*50,50);return`<div style="position:relative;height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;">
    ${(o||0)>=0?`<div style="position:absolute;left:50%;width:${l}%;height:100%;background:${a};border-radius:0 4px 4px 0;"></div>`:`<div style="position:absolute;right:50%;width:${l}%;height:100%;background:${n};border-radius:4px 0 0 4px;"></div>`}
    <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);font-family:var(--mono);">
    <span style="color:${n}">Contractivo</span><span>0</span><span style="color:${a}">Expansivo</span>
  </div>`}function p(o,t,a,n,l,u){if(!a)return"";const c=m(a.score),v=a.label==="Reservas Bancarias Fed"?a.value!=null?"$"+s(a.value)+"T":"—":a.value!=null?g(a.value)+"%":"—",e=t.includes("Reservas")?2:t.includes("M2")?10:t.includes("Crédito vs")?8:5,i=t.includes("Reservas")?a.value!=null?a.value-3:null:a.value;return`<div class="co-liq-card">
    <div class="co-liq-card-header">
      <span class="co-liq-card-title">${o} ${t}</span>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${a.date||"—"}${a.manual?" · ✎":""}</span>
    </div>
    <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${c};">${v}</div>
    <div style="font-size:10px;color:var(--text2);font-family:var(--mono);margin-bottom:2px;">${n}</div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${l}</div>
    ${a.value!=null&&i!=null?A(i,e):'<div style="height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;"></div>'}
    <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-top:8px;">${u(a.score,a.value)}</div>
  </div>`}function I(o,t,a,n,l){return`<div class="co-manual-row">
    <div><div style="font-size:11px;color:var(--text2);font-weight:600;">${t}</div><div style="font-size:9px;color:var(--text3);">${a}</div></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <input type="number" class="liq-manual-input" data-key="${o}" value="${l??""}" placeholder="—" step="0.1" style="width:72px;">
      <span style="font-size:10px;color:var(--text3);">${n}</span>
    </div>
  </div>`}async function F(o,{actionsSlot:t}){var l,u;t.innerHTML=`
    <button class="btn" id="liq-edit">✎ Editar manuales</button>
    <button class="btn btn-primary" id="liq-refresh">↻ Actualizar</button>
  `,o.innerHTML='<div id="liq-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function a(c=!1){try{const v=await T(c);n(v)}catch(v){document.getElementById("liq-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${v.message}</div></div>`}}function n(c){var b,y,x,f,$,h,Y,E,M,z;const v=document.getElementById("liq-wrap"),e=c.liquidez||{},i=S(e),L=C();v.innerHTML=`
      <!-- HERO -->
      <div class="co-verdict-block" style="margin-bottom:16px;">
        <div class="co-score-wrap">
          <div class="co-score-num" style="color:${i.c}">${i.score>=0?"+":""}${i.score}</div>
          <div class="co-score-max">puntos liq.</div>
          <div class="co-score-gauge"><div class="co-score-gauge-fill" style="width:${Math.max(0,(i.score+13)/26*100)}%;background:${i.c};"></div></div>
        </div>
        <div class="co-verdict-center">
          <div class="co-verdict-label">Régimen de liquidez · ${c.updatedAt?new Date(c.updatedAt).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}):"—"}</div>
          <div class="co-verdict-title" style="color:${i.c}">${i.title}</div>
          <div class="co-verdict-phrase">${w(e)}</div>
        </div>
        <div class="co-verdict-right">
          ${((b=e.m2)==null?void 0:b.value)!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">M2 Global</div><div class="co-verdict-mini-val" style="color:${m(e.m2.score)}">${g(e.m2.value)}%</div><div class="co-verdict-mini-sub">YoY · ×3</div></div>`:""}
          ${((y=e.reservas)==null?void 0:y.value)!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">Reservas Fed</div><div class="co-verdict-mini-val" style="color:${m(e.reservas.score)}">$${s(e.reservas.value)}T</div><div class="co-verdict-mini-sub">${e.reservas.score>0?">$3.5T":e.reservas.score===-1?"$2.5-3.4T":"<$2.5T"}</div></div>`:""}
        </div>
      </div>

      <!-- PANEL MANUALES -->
      <div id="liq-manual-panel" style="display:none;background:var(--surface);border:1px dashed var(--border2);border-radius:12px;padding:18px 20px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">✎ Input Manual — China M2</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:14px;">
          USA (FRED), Eurozona (ECB) y Japón (BOJ) son ahora <strong style="color:var(--teal)">100% automáticos</strong>.
          Solo China M2 YoY requiere input manual — el PBoC no tiene API pública gratuita estable.
          Sin este dato, el M2 Global se calcula con 3 regiones (~70% del total).
        </div>
        ${I("chinaM2","China M2 YoY (%)","Fuente: PBoC · publicación mensual · peso ~30% del M2 Global","%",L.chinaM2)}
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-primary" id="liq-save-manuals">Guardar y actualizar</button>
          <button class="btn" id="liq-close-manuals">Cancelar</button>
        </div>
      </div>

      <!-- GRID 6 CARDS -->
      <div class="co-liq-grid3">
        ${p("💵","M2 Global (USA+EUR+JPN)",e.m2,(x=e.m2)!=null&&x.auto?`${e.m2.coverage||""} · USA: ${((f=e.m2.components)==null?void 0:f.usYoY)!=null?(e.m2.components.usYoY>=0?"+":"")+s(e.m2.components.usYoY)+"%":"—"} · EUR: ${(($=e.m2.components)==null?void 0:$.eurYoY)!=null?(e.m2.components.eurYoY>=0?"+":"")+s(e.m2.components.eurYoY)+"%":"—"} · JPN: ${((h=e.m2.components)==null?void 0:h.jpYoY)!=null?(e.m2.components.jpYoY>=0?"+":"")+s(e.m2.components.jpYoY)+"%":"—"}`:"YoY — estimado global (Fed+ECB+PBOC+BoJ)","≥+5.0%→+3  ·  +3.0-4.9%→+1  ·  <+3.0%→−3  ·  peso ×3",(r,d)=>r>0?`<strong style="color:var(--green)">+${r} pts.</strong> M2 creciendo — combustible para el ciclo y expansión de múltiplos.`:r===0?'<strong style="color:var(--amber)">0 pts.</strong> M2 entre +3% y +5% — ciclo sostenido pero sin exceso monetario.':d!=null?`<strong style="color:var(--red)">${r} pts.</strong> M2 bajo umbral — presión sobre activos de riesgo con 6-12m de retardo.`:'Sin datos automáticos aún. Introduce China M2 YoY% con "Editar manuales" para completar el cálculo.')}

        ${p("📈","Crédito vs Nominal GDP",e.credito,(Y=e.credito)!=null&&Y.auto?`Crédito YoY: ${e.credito.creditYoY!=null?(e.credito.creditYoY>=0?"+":"")+s(e.credito.creditYoY)+"%":"—"} · GDP YoY: ${e.credito.gdpYoY!=null?"+"+s(e.credito.gdpYoY)+"%":"—"} · FRED TOTLL vs GDP`:"Crecimiento crédito − Crecimiento nominal GDP","≥+3.0%→+3  ·  +1.5-2.9%→0  ·  <+1.5%→−3  ·  peso ×3",(r,d)=>r>0?`<strong style="color:var(--green)">+${r} pts.</strong> Crédito crece más que el nominal — expansión financiera saludable.`:r===0?'<strong style="color:var(--amber)">0 pts.</strong> Crédito alineado con el nominal — ciclo estable.':`<strong style="color:var(--red)">${r} pts.</strong> Crédito crece menos que el nominal — desapalancamiento en curso.`)}

        ${p("⚡","Impulso Crediticio",e.impulso,(E=e.impulso)!=null&&E.auto?`Aceleración TOTLL: YoY ahora ${e.impulso.yoyNow!=null?(e.impulso.yoyNow>=0?"+":"")+s(e.impulso.yoyNow)+"%":"—"} vs hace 3m ${e.impulso.yoy3mAgo!=null?(e.impulso.yoy3mAgo>=0?"+":"")+s(e.impulso.yoy3mAgo)+"%":"—"} · FRED TOTLL`:"Aceleración del crédito — anticipa gasto con 6-9 meses","≥+1.0→+2  ·  +0.5-0.9→+1  ·  <+0.5→−2  ·  peso ×2",(r,d)=>r>=2?'<strong style="color:var(--green)">+2 pts.</strong> Impulso fuerte — expansión de demanda en 6-9 meses.':r===1?'<strong style="color:var(--green)">+1 pt.</strong> Impulso positivo moderado.':`<strong style="color:var(--red)">${r} pts.</strong> Impulso negativo — contracción del gasto con retardo.`)}

        ${p("🔄","Velocidad M2",e.velM2,"YoY · FRED M2V (trimestral) · automático","≥0%→+2  ·  −1.5 a −0.1%→−1  ·  <−1.5%→−2  ·  peso ×2",(r,d)=>r>=2?'<strong style="color:var(--green)">+2 pts.</strong> ≥0% — el dinero circula activamente. El M2 se traduce en actividad económica real.':r===-1?'<strong style="color:var(--amber)">−1 pt.</strong> Entre −1.5% y −0.1% — velocidad cayendo ligeramente. El dinero se acumula en vez de circular.':'<strong style="color:var(--red)">−2 pts.</strong> <−1.5% — velocidad muy baja. Bancos no prestan, empresas no invierten, consumidores no gastan. Señal de estancamiento aunque haya mucho M2.')}

        ${p("🏦","Reservas Bancarias Fed",e.reservas,"Valor absoluto en $T · FRED WRESBAL (semanal) · automático","≥$3.5T→+1  ·  $2.5-3.4T→−1  ·  <$2.5T→−2  ·  peso ×1",(r,d)=>r>0?'<strong style="color:var(--green)">+1 pt.</strong> ≥$3.5T — liquidez abundante. Los bancos tienen amplia capacidad prestadora.':r===-1?'<strong style="color:var(--amber)">−1 pt.</strong> $2.5-3.4T — reservas en zona baja. QT activo de la Fed — menos liquidez en el sistema.':'<strong style="color:var(--red)">−2 pts.</strong> <$2.5T — reservas insuficientes. La Fed está drenando agresivamente. Riesgo de contracción crediticia sistémica.')}

        ${e.bbb?`<div class="co-liq-card">
          <div class="co-liq-card-header"><span class="co-liq-card-title">📊 BBB Spread</span><span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${e.bbb.date||"—"}</span></div>
          <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${m(e.bbb.score)};">${s(e.bbb.value)}%</div>
          <div style="font-size:10px;color:var(--text2);font-family:var(--mono);margin-bottom:2px;">OAS · FRED BAMLC0A4CBBB</div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">≤1.00%→+1  ·  1.00-1.50%→0  ·  >1.50%→−1  ·  peso ×1</div>
          <div class="co-ind-bar-track" style="margin:8px 0 4px;"><div class="co-ind-bar-fill" style="width:${Math.min(e.bbb.value/4*100,100)}%;background:${m(e.bbb.score)};"></div></div>
          <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-top:8px;">
            ${e.bbb.score>0?'<strong style="color:var(--green)">+1 pt.</strong> ≤1.00% — mercado tranquilo, acceso barato al crédito corporativo.':e.bbb.score===0?'<strong style="color:var(--amber)">0 pts.</strong> 1.00-1.50% — neutral, coste de crédito moderado.':'<strong style="color:var(--red)">−1 pt.</strong> >1.50% — estrés crediticio, prima de riesgo corporativo elevada.'}
          </div>
        </div>`:""}
      </div>

      <!-- IMPLICACIONES -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-top:16px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">💡 Implicaciones para la estrategia</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;"><div style="font-size:10px;font-weight:700;color:${i.c};margin-bottom:6px;text-transform:uppercase;">Renta Variable</div><div style="font-size:11px;color:var(--text2);line-height:1.5;">${i.score>=4?"Liquidez expansiva favorece expansión de múltiplos. Entorno propicio para posiciones largas.":i.score>=0?"Liquidez mixta. Selectividad: calidad sobre momentum.":"Liquidez contractiva presiona valoraciones. Preferir FCF alto y calidad sobre growth."}</div></div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;"><div style="font-size:10px;font-weight:700;color:var(--amber);margin-bottom:6px;text-transform:uppercase;">Renta Fija</div><div style="font-size:11px;color:var(--text2);line-height:1.5;">${i.score>=0?"Spreads contenidos favorecen IG. Duration media acceptable.":"QT + spreads ampliando. Duration corta o flotantes. IG estricto sobre HY."}</div></div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;"><div style="font-size:10px;font-weight:700;color:var(--blue);margin-bottom:6px;text-transform:uppercase;">Sizing</div><div style="font-size:11px;color:var(--text2);line-height:1.5;">${i.score>=4?"Liquidez favorable. Sizing normal, stops amplios.":i.score>=0?"Sizing moderado. Stops ajustados.":"Sizing conservador. Esperar M2>+3% para aumentar exposición."}</div></div>
        </div>
      </div>

      <div class="co-footer" style="margin-top:16px;">Fuentes: FRED (M2SL, M2V, WRESBAL, BAMLC0A4CBBB, TOTLL, GDP, USSLIND) · ECB (M2 EUR, Curva EUR) · BOJ API (M2 JPN) · China M2: input manual mensual (PBoC)</div>
    `,(M=document.getElementById("liq-save-manuals"))==null||M.addEventListener("click",()=>{const r=C();document.querySelectorAll(".liq-manual-input").forEach(d=>{const B=d.value.trim();r[d.dataset.key]=B!==""?parseFloat(B):null}),q(r),document.getElementById("liq-manual-panel").style.display="none",a(!0)}),(z=document.getElementById("liq-close-manuals"))==null||z.addEventListener("click",()=>{document.getElementById("liq-manual-panel").style.display="none"})}return(l=document.getElementById("liq-refresh"))==null||l.addEventListener("click",()=>a(!0)),(u=document.getElementById("liq-edit"))==null||u.addEventListener("click",()=>{const c=document.getElementById("liq-manual-panel");c&&(c.style.display=c.style.display==="none"?"block":"none")}),await a(!1),{destroy(){}}}export{F as render};
