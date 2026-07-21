import{g as M,a as u,s as L}from"./macro-data-CGVdt8ED.js";const C=i=>i!=null?(i>=0?"+":"")+Number(i).toFixed(2):"—",z=i=>i>0?"var(--green)":i===0?"var(--amber)":"var(--red)";function S(i,s,n,d){return`<div class="co-manual-row"><div><div style="font-size:11px;color:var(--text2);font-weight:600;">${s}</div><div style="font-size:9px;color:var(--text3);">${n}</div></div><div style="display:flex;align-items:center;gap:6px;"><input type="number" class="co-manual-input" data-key="${i}" value="${d??""}" placeholder="—" step="0.1" style="width:72px;"><span style="font-size:10px;color:var(--text3);">%</span></div></div>`}async function R(i,{actionsSlot:s}){var c,v;s.innerHTML='<button class="btn" id="ciclo-edit">✎ Editar manuales</button><button class="btn btn-primary" id="ciclo-refresh">↻ Actualizar</button>',i.innerHTML='<div id="ciclo-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function n(o=!1){try{const l=await M(o);d(l)}catch(l){document.getElementById("ciclo-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${l.message}</div></div>`}}function d(o){var p,m;const l=document.getElementById("ciclo-wrap"),x=o.coyuntura||{},f=o.indicators||{},e=o.scoreTotal??0,y=u(),g=e>=10?"BOOM":e>=4?"EXPANSIÓN":e>=0?"DESACEL.":e>=-4?"RECESIÓN LEVE":"RECESIÓN SEVERA",b=e>=10||e>=4?"var(--green)":e>=0?"var(--amber)":(e>=-4,"var(--red)");l.innerHTML=`
      <div style="display:grid;grid-template-columns:260px 1fr;gap:16px;margin-bottom:14px;">
        <!-- Wheel -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <svg viewBox="0 0 240 240" style="width:210px;height:210px;">
            <circle cx="120" cy="120" r="90" fill="none" stroke="var(--border)" stroke-width="2"/>
            <!-- 6 sectores -->
            <path d="M120,120 L120,30 A90,90 0 0,1 198,75 Z" fill="${e>=4&&e<10?"rgba(74,222,128,0.18)":"rgba(74,222,128,0.06)"}" stroke="var(--border)" stroke-width="1"/>
            <path d="M120,120 L198,75 A90,90 0 0,1 198,165 Z" fill="${e>=10?"rgba(74,222,128,0.22)":"rgba(74,222,128,0.05)"}" stroke="var(--border)" stroke-width="1"/>
            <path d="M120,120 L198,165 A90,90 0 0,1 120,210 Z" fill="rgba(251,191,36,0.06)" stroke="var(--border)" stroke-width="1"/>
            <path d="M120,120 L120,210 A90,90 0 0,1 42,165 Z" fill="${e>=0&&e<4?"rgba(251,191,36,0.22)":"rgba(251,191,36,0.06)"}" stroke="${e>=0&&e<4?"var(--amber)":"var(--border)"}" stroke-width="${e>=0&&e<4?"2":"1"}"/>
            <path d="M120,120 L42,165 A90,90 0 0,1 42,75 Z" fill="${e<0&&e>=-4?"rgba(244,113,116,0.20)":"rgba(244,113,116,0.06)"}" stroke="${e<0&&e>=-4?"var(--red)":"var(--border)"}" stroke-width="${e<0&&e>=-4?"2":"1"}"/>
            <path d="M120,120 L42,75 A90,90 0 0,1 120,30 Z" fill="${e<-4?"rgba(244,113,116,0.25)":"rgba(64,217,192,0.06)"}" stroke="${e<-4?"var(--red)":"var(--border)"}" stroke-width="${e<-4?"2":"1"}"/>
            <!-- Labels -->
            <text x="120" y="40" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--green)">EXPANSIÓN</text>
            <text x="196" y="108" text-anchor="end" font-family="IBM Plex Mono" font-size="8" fill="var(--green)">BOOM</text>
            <text x="196" y="155" text-anchor="end" font-family="IBM Plex Mono" font-size="8" fill="var(--amber)">DESACEL.</text>
            <text x="120" y="204" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">REC. LEVE</text>
            <text x="44" y="155" text-anchor="start" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">REC. SEVERA</text>
            <text x="44" y="85" text-anchor="start" font-family="IBM Plex Mono" font-size="8" fill="var(--teal)">RECUPER.</text>
            <!-- Centro -->
            <circle cx="120" cy="120" r="40" fill="var(--surface)"/>
            <text x="120" y="116" text-anchor="middle" font-family="Cormorant Garamond" font-size="12" font-style="italic" fill="${b}">${g}</text>
            <text x="120" y="132" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="var(--text3)">${e>=0?"+":""}${e} / 17</text>
          </svg>
        </div>

        <!-- Indicadores adelantados -->
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${["curvaUSD","curvaEUR","lei"].map(a=>{const t=x[a]||(a==="lei"?f.lei:null);if(!t)return`<div class="mac-card" style="background:var(--surface2);"><div style="font-size:10px;color:var(--text3);">${a==="curvaUSD"?"Curva USD":a==="curvaEUR"?"Curva EUR":"LEI USA"} — sin datos</div></div>`;const r=z(t.score),h=a==="curvaUSD"?"≥+0.90%→+1 · +0.48-0.89%→0 · <+0.48%→−1":a==="curvaEUR"?"≥+0.60%→+1 · +0.40-0.59%→0 · <+0.40%→−1":"≥+0.3%→+1 · ±0.3%→0 · <−0.3%→−1",E=a==="curvaUSD"?"Curva USD (10Y−2Y)":a==="curvaEUR"?"Curva EUR (10Y−2Y)"+(t.manual?" ✎":""):"LEI USA ✎",$=a==="curvaUSD"?t.value<0?"Invertida — señal histórica de recesión":t.score>0?"≥+0.90% — optimismo de crecimiento":"Comprimiendo — neutral":a==="curvaEUR"?t.value<0?"Invertida — señal recesiva en Europa":t.score>0?"≥+0.60% — ciclo expansivo":"Neutral":t.value==null?"Sin dato — introduce el valor mensualmente":t.score>0?"≥+0.3% → expansión próximos 6-9 meses":t.score===0?"±0.3% → neutral":"<−0.3% → contracción anticipada",I=t.score>0?"↑ Mejorando":t.score===0?"→ Estable":"↓ Empeorando";return`<div class="mac-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-size:10px;font-weight:700;color:var(--text2);">${E}</div>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span style="font-size:10px;font-family:var(--mono);color:${r};">${I}</span>
                  <span style="font-size:9px;padding:2px 7px;border-radius:10px;font-family:var(--mono);font-weight:700;background:rgba(${t.score>0?"74,222,128":t.score===0?"251,191,36":"244,113,116"},0.12);color:${r};">Score ${t.score>0?"+":""}${t.score??"—"}</span>
                </div>
              </div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${r};">${t.value!=null?C(t.value)+"%":"—"}</div>
              <div style="position:relative;height:5px;background:var(--surface2);border-radius:3px;margin:8px 0 4px;">
                ${t.value!=null&&t.value>=0?`<div style="position:absolute;left:50%;width:${Math.min(Math.abs(t.value||0)*50,50)}%;height:100%;background:${r};border-radius:0 3px 3px 0;"></div>`:""}
                ${t.value!=null&&t.value<0?`<div style="position:absolute;right:50%;width:${Math.min(Math.abs(t.value||0)*50,50)}%;height:100%;background:${r};border-radius:3px 0 0 3px;"></div>`:""}
                <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;"><span style="color:var(--red)">Negativo</span><span>0</span><span style="color:var(--green)">Positivo</span></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:3px;">${h}</div>
              <div style="font-size:10px;color:var(--text2);border-top:1px solid var(--border);padding-top:6px;margin-top:6px;">${$}</div>
            </div>`}).join("")}
        </div>
      </div>

      <!-- Cuadrante régimen 2x2 -->
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:12px;">Mapa de Régimen Macro (Crecimiento × Liquidez)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          ${[{l:"BOOM",c:"var(--green)",desc:"Crecimiento alto + Liquidez alta · RV agresiva, small caps, commodities",active:e>=10},{l:"GOLDILOCKS",c:"var(--teal)",desc:"Crecimiento moderado + Liquidez alta · RV quality, bonos IG, oro",active:e>=4&&e<10},{l:"DESACELERACIÓN",c:"var(--amber)",desc:"Crecimiento moderado + Liquidez baja · Defensivo, cash, bonos cortos",active:e>=0&&e<4},{l:"RECESIÓN",c:"var(--red)",desc:"Crecimiento negativo + Liquidez baja · Cash, treasuries, oro",active:e<0}].map(a=>`<div style="padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:100px;${a.active?"background:rgba(64,217,192,0.08);border:2px solid var(--teal);":"background:var(--surface2);"}">
            <div style="font-size:11px;font-weight:700;color:${a.c};margin-bottom:6px;">${a.l}</div>
            <div style="font-size:9px;color:var(--text3);line-height:1.4;">${a.desc}</div>
            ${a.active?'<div style="font-size:8px;font-family:var(--mono);color:var(--teal);margin-top:6px;font-weight:700;">◆ POSICIÓN ACTUAL</div>':""}
          </div>`).join("")}
        </div>
      </div>

      <!-- Panel manuales -->
      <div id="ciclo-manual-panel" style="display:none;background:var(--surface);border:1px dashed var(--border2);border-radius:12px;padding:18px 20px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">✎ Override Manual — Ciclo</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:14px;">LEI, Crédito vs Nominal e Impulso Crediticio son ahora automáticos vía FRED (USSLIND, TOTLL, GDP). Solo introduce un override si consideras que el dato de FRED no es representativo.</div>
        ${S("lei","Override LEI (% m/m)","Deja vacío para usar FRED USSLIND automático · ≥+0.3%→+1 · ±0.3%→0 · <−0.3%→−1",y.lei)}
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-primary" id="ciclo-save-man">Guardar y actualizar</button>
          <button class="btn" id="ciclo-close-man">Cancelar</button>
        </div>
      </div>
      <div class="co-footer">Fuentes: FRED (DGS10, DGS2) · ECB Data Portal (Curva EUR) · Conference Board LEI (manual)</div>
    `,(p=document.getElementById("ciclo-save-man"))==null||p.addEventListener("click",()=>{const a=u();document.querySelectorAll(".co-manual-input").forEach(t=>{const r=t.value.trim();a[t.dataset.key]=r!==""?parseFloat(r):null}),L(a),document.getElementById("ciclo-manual-panel").style.display="none",n(!0)}),(m=document.getElementById("ciclo-close-man"))==null||m.addEventListener("click",()=>{document.getElementById("ciclo-manual-panel").style.display="none"})}return(c=document.getElementById("ciclo-refresh"))==null||c.addEventListener("click",()=>n(!0)),(v=document.getElementById("ciclo-edit"))==null||v.addEventListener("click",()=>{const o=document.getElementById("ciclo-manual-panel");o&&(o.style.display=o.style.display==="none"?"block":"none")}),await n(!1),{destroy(){}}}export{R as render};
