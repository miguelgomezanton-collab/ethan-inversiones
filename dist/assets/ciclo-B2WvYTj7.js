import{g as F,a as U,s as k}from"./macro-data-CGVdt8ED.js";const q=r=>r!=null?(r>=0?"+":"")+Number(r).toFixed(2):"—",G=r=>r>0?"var(--green)":r===0?"var(--amber)":"var(--red)";function Y(r,u,l,p){return`<div class="co-manual-row"><div><div style="font-size:11px;color:var(--text2);font-weight:600;">${u}</div><div style="font-size:9px;color:var(--text3);">${l}</div></div><div style="display:flex;align-items:center;gap:6px;"><input type="number" class="co-manual-input" data-key="${r}" value="${p??""}" placeholder="—" step="0.1" style="width:72px;"><span style="font-size:10px;color:var(--text3);">%</span></div></div>`}async function Z(r,{actionsSlot:u}){var x,f;u.innerHTML='<button class="btn" id="ciclo-edit">✎ Editar manuales</button><button class="btn btn-primary" id="ciclo-refresh">↻ Actualizar</button>',r.innerHTML='<div id="ciclo-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function l(o=!1){try{const n=await F(o);p(n)}catch(n){document.getElementById("ciclo-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${n.message}</div></div>`}}function p(o){var E,S,C,L,M;const n=document.getElementById("ciclo-wrap"),v=o.coyuntura||{},y=o.indicators||{},g=o.scoreTotal??0;o.availableScore;const b=o.coverage??1,R=U(),s=((E=v.curvaUSD)==null?void 0:E.score)??null,d=((S=v.curvaEUR)==null?void 0:S.score)??null,c=((C=v.lei??y.lei)==null?void 0:C.score)??null,t=[s,d,c].filter(a=>a!=null).reduce((a,e)=>a+e,0),$=[s,d,c].filter(a=>a!=null).length,m=3,w=t>=2?"EXPANSIÓN":t===1?"RECUPERAC.":t===0?"NEUTRAL":t>=-1?"DESACEL.":"CONTRACCIÓN",h=t>0?"var(--green)":t===0?"var(--amber)":"var(--red)",O=b>=.85?"var(--green)":b>=.65?"var(--amber)":"var(--red)";n.innerHTML=`
      <div style="display:grid;grid-template-columns:260px 1fr;gap:16px;margin-bottom:14px;">
        <!-- Wheel -->
        <div class="mac-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <svg viewBox="0 0 240 240" style="width:210px;height:210px;">
            <circle cx="120" cy="120" r="90" fill="none" stroke="var(--border)" stroke-width="2"/>
            <!-- 5 sectores: Contracción / Desacel / Neutral / Recuperac / Expansión -->
            <path d="M120,120 L120,30 A90,90 0 0,1 198,75 Z" fill="${t>=2?"rgba(74,222,128,0.22)":"rgba(74,222,128,0.06)"}" stroke="${t>=2?"var(--green)":"var(--border)"}" stroke-width="${t>=2?"2":"1"}"/>
            <path d="M120,120 L198,75 A90,90 0 0,1 198,165 Z" fill="${t===1?"rgba(74,222,128,0.18)":"rgba(74,222,128,0.05)"}" stroke="${t===1?"var(--green)":"var(--border)"}" stroke-width="${t===1?"2":"1"}"/>
            <path d="M120,120 L198,165 A90,90 0 0,1 120,210 Z" fill="${t===0?"rgba(251,191,36,0.22)":"rgba(251,191,36,0.06)"}" stroke="${t===0?"var(--amber)":"var(--border)"}" stroke-width="${t===0?"2":"1"}"/>
            <path d="M120,120 L120,210 A90,90 0 0,1 42,165 Z" fill="${t===-1?"rgba(244,113,116,0.20)":"rgba(244,113,116,0.06)"}" stroke="${t===-1?"var(--red)":"var(--border)"}" stroke-width="${t===-1?"2":"1"}"/>
            <path d="M120,120 L42,165 A90,90 0 0,1 42,75 Z" fill="${t<=-2?"rgba(244,113,116,0.25)":"rgba(64,217,192,0.06)"}" stroke="${t<=-2?"var(--red)":"var(--border)"}" stroke-width="${t<=-2?"2":"1"}"/>
            <path d="M120,120 L42,75 A90,90 0 0,1 120,30 Z" fill="rgba(64,217,192,0.04)" stroke="var(--border)" stroke-width="1"/>
            <!-- Labels -->
            <text x="120" y="40"  text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--green)">EXPANSIÓN</text>
            <text x="196" y="108" text-anchor="end"    font-family="IBM Plex Mono" font-size="8" fill="var(--green)">RECUPERAC.</text>
            <text x="196" y="155" text-anchor="end"    font-family="IBM Plex Mono" font-size="8" fill="var(--amber)">NEUTRAL</text>
            <text x="120" y="204" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">DESACEL.</text>
            <text x="44"  y="155" text-anchor="start"  font-family="IBM Plex Mono" font-size="8" fill="var(--red)">CONTRACCIÓN</text>
            <text x="44"  y="85"  text-anchor="start"  font-family="IBM Plex Mono" font-size="8" fill="var(--teal)">—</text>
            <!-- Centro: cicloScore exclusivo -->
            <circle cx="120" cy="120" r="44" fill="var(--surface)"/>
            <text x="120" y="110" text-anchor="middle" font-family="Cormorant Garamond" font-size="11" font-style="italic" fill="${h}">${w}</text>
            <text x="120" y="126" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" font-weight="bold" fill="${h}">${t>=0?"+":""}${t} / ±${m}</text>
            <text x="120" y="139" text-anchor="middle" font-family="IBM Plex Mono" font-size="8"  fill="${O}">${$}/${m} ind.</text>
          </svg>
          <div style="font-family:var(--mono);font-size:9px;text-align:center;margin-top:4px;color:var(--text3);">Score Ciclo · Curva USD ${s!=null?(s>=0?"+":"")+s:"—"} + Curva EUR ${d!=null?(d>=0?"+":"")+d:"—"} + LEI ${c!=null?(c>=0?"+":"")+c:"—"} = ${t>=0?"+":""}${t}</div>
          <div style="font-family:var(--mono);font-size:8px;text-align:center;margin-top:2px;color:var(--text3);">Cobertura Ciclo: ${$}/${m} indicadores · Score global ETHAN: ${g>=0?"+":""}${g}/17</div>
        </div>

        <!-- Indicadores adelantados -->
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${["curvaUSD","curvaEUR","lei"].map(a=>{var A,D,z,I;const e=v[a]||(a==="lei"?y.lei:null);if(!e)return`<div class="mac-card" style="background:var(--surface2);"><div style="font-size:10px;color:var(--text3);">${a==="curvaUSD"?"Curva USD":a==="curvaEUR"?"Curva EUR":"LEI USA"} — sin datos</div></div>`;const i=G(e.score),N=a==="curvaUSD"?"≥+0.90%→+1 · +0.48-0.89%→0 · <+0.48%→−1":a==="curvaEUR"?"≥+0.60%→+1 · +0.40-0.59%→0 · <+0.40%→−1":"nivel>100 y subiendo→+1 · nivel<100 y bajando→−1 · resto→0",T=a==="curvaUSD"?"Curva USD (10Y−2Y)":a==="curvaEUR"?"Curva EUR (10Y−2Y)"+(e.manual?" ✎":""):"OECD CLI USA ✎",P=a==="curvaUSD"?e.error?`Error: ${e.error}`:e.value==null?"Sin dato":e.value<0?"Invertida — señal histórica de recesión":e.score>0?"≥+0.90% — optimismo de crecimiento":e.value>=.48?"Comprimiendo — neutral":"<+0.48% — señal negativa":a==="curvaEUR"?e.value<0?"Invertida — señal recesiva en Europa":e.score>0?"≥+0.60% — ciclo expansivo":"Neutral":e.value==null?"Sin dato":e.value>100&&e.delta>0?">100 y subiendo — expansión":e.value>100&&e.delta<=0?">100 pero perdiendo momentum — desaceleración":e.value<=100&&e.delta<0?"<100 y bajando — contracción":"<100 pero mejorando — recuperación",B=a==="lei"?e.freshness==="stale"?"⚠ Pendiente actualización":e.freshness==="warn"?"⚠ Próximo a expirar":e.score>0?"↑ Mejorando":e.score===0?"→ Estable":"↓ Empeorando":a==="curvaUSD"||a==="curvaEUR"?e.freshness==="stale"?"⚠ Dato obsoleto":e.freshness==="warn"?"⚠ Próximo a expirar":e.error?"⚠ Error":e.score>0?"↑ Mejorando":e.score===0?"→ Estable":"↓ Empeorando":e.score>0?"↑ Mejorando":e.score===0?"→ Estable":"↓ Empeorando",j=a==="lei"?e.freshness==="stale"?"var(--red)":e.freshness==="warn"?"var(--amber)":i:a==="curvaUSD"||a==="curvaEUR"?e.freshness==="stale"||e.error?"var(--red)":e.freshness==="warn"?"var(--amber)":i:i;return`<div class="mac-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-size:10px;font-weight:700;color:var(--text2);">${T}</div>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span style="font-size:10px;font-family:var(--mono);color:${j};">${B}</span>
                  <span style="font-size:9px;padding:2px 7px;border-radius:10px;font-family:var(--mono);font-weight:700;background:rgba(${e.score>0?"74,222,128":e.score===0?"251,191,36":"244,113,116"},0.12);color:${i};">Score ${e.score>0?"+":""}${e.score??"—"}</span>
                </div>
              </div>
              <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${i};">${a==="lei"?e.value!=null?Number(e.value).toFixed(4):"—":e.value!=null?q(e.value)+"%":"—"}</div>
              ${a==="lei"&&e.delta!=null?`<div style="font-family:var(--mono);font-size:10px;color:${e.delta>0?"var(--green)":"var(--red)"};margin-top:2px;">MoM ${e.delta>0?"+":""}${e.delta.toFixed(4)} pts</div>`:""}
              <div style="position:relative;height:5px;background:var(--surface2);border-radius:3px;margin:8px 0 4px;">
                ${e.value!=null&&e.value>=0?`<div style="position:absolute;left:50%;width:${Math.min(Math.abs(e.value||0)*50,50)}%;height:100%;background:${i};border-radius:0 3px 3px 0;"></div>`:""}
                ${e.value!=null&&e.value<0?`<div style="position:absolute;right:50%;width:${Math.min(Math.abs(e.value||0)*50,50)}%;height:100%;background:${i};border-radius:3px 0 0 3px;"></div>`:""}
                <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;"><span style="color:var(--red)">Negativo</span><span>0</span><span style="color:var(--green)">Positivo</span></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:3px;">${N}</div>
              <div style="font-size:10px;color:var(--text2);border-top:1px solid var(--border);padding-top:6px;margin-top:6px;">${P}</div>
              ${a==="curvaUSD"?`<div style="margin-top:6px;">
                ${e.freshness==="stale"||e.error?`<div style="font-size:9px;color:var(--red);font-family:var(--mono);">⚠ ${e.error||"DATO OBSOLETO — Score bloqueado"}</div>`:""}
                ${e.freshness==="warn"?'<div style="font-size:9px;color:var(--amber);font-family:var(--mono);">⚠ Próximo a expirar</div>':""}
                <div class="audit-toggle" onclick="this.classList.toggle('open')">
                  <span class="audit-lbl">Metodología ▾</span>
                  <div class="audit-body">
                    Curva USD 10Y−2Y · DGS10 − DGS2 · FRED<br>
                    DGS10: ${((A=e.dgs10)==null?void 0:A.date)||"—"} | ${((D=e.dgs10)==null?void 0:D.value)!=null?e.dgs10.value.toFixed(3)+"%":"—"}<br>
                    DGS2 : ${((z=e.dgs2)==null?void 0:z.date)||"—"} | ${((I=e.dgs2)==null?void 0:I.value)!=null?e.dgs2.value.toFixed(3)+"%":"—"}<br>
                    Spread: ${e.value!=null?(e.value>=0?"+":"")+e.value.toFixed(2)+"%":"—"} · ${e.ageDays!=null?e.ageDays+"d":"—"} · ${e.freshness==="ok"?"✓ OK":e.freshness==="warn"?"⚠ WARN":"✗ STALE"}<br>
                    Score: ${e.score!=null?(e.score>0?"+":"")+e.score:"bloqueado"} · Thresholds PROVISIONAL
                  </div>
                </div>
              </div>`:""}
              ${a==="curvaEUR"?`<div style="margin-top:6px;">
                ${e.freshness==="stale"||e.error?'<div style="font-size:9px;color:var(--red);font-family:var(--mono);">⚠ DATO OBSOLETO — Score bloqueado</div>':""}
                ${e.freshness==="warn"?'<div style="font-size:9px;color:var(--amber);font-family:var(--mono);">⚠ Próximo a expirar</div>':""}
                <div class="audit-toggle" onclick="this.classList.toggle('open')">
                  <span class="audit-lbl">Metodología ▾</span>
                  <div class="audit-body">
                    Curva EUR 10Y−2Y · ECB YC · spread precalculado Svensson<br>
                    Spread: ${e.date||"—"} | ${e.value!=null?(e.value>=0?"+":"")+e.value.toFixed(2)+"%":"—"}<br>
                    Antigüedad: ${e.ageDays!=null?e.ageDays+"d":"—"} · ${e.freshness==="ok"?"✓ OK":e.freshness==="warn"?"⚠ WARN":"✗ STALE"}<br>
                    Score: ${e.score!=null?(e.score>0?"+":"")+e.score:"bloqueado"} · Thresholds PROVISIONAL
                  </div>
                </div>
              </div>`:""}
              ${a==="lei"?`<div style="margin-top:6px;">
                ${e.freshness==="stale"?'<div style="font-size:9px;color:var(--red);font-family:var(--mono);">⚠ DATO OBSOLETO — Score bloqueado</div>':""}
                ${e.freshness==="warn"?'<div style="font-size:9px;color:var(--amber);font-family:var(--mono);">⚠ Próximo a expirar</div>':""}
                <div class="audit-toggle" onclick="this.classList.toggle('open')">
                  <span class="audit-lbl">Metodología ▾</span>
                  <div class="audit-body">
                    OECD CLI USA · FRED USALOLITOAASTSAM · Mensual<br>
                    Actual: ${e.date||"—"} | Nivel ${e.value!=null?Number(e.value).toFixed(5):"—"}<br>
                    Anterior: ${e.prevDate||"—"} | Nivel ${e.prevValue!=null?Number(e.prevValue).toFixed(5):"—"}<br>
                    Delta MoM: ${e.delta!=null?(e.delta>0?"+":"")+e.delta.toFixed(5)+" pts":"—"}<br>
                    Regla: nivel>100 y subiendo → +1 · Score: ${e.score!=null?e.score:"bloqueado"}<br>
                    Antigüedad: ${e.ageDays}d · ${e.freshness==="ok"?"✓ OK (≤100d)":e.freshness==="warn"?"⚠ WARN (101–130d)":"✗ STALE (>130d)"}
                  </div>
                </div>
              </div>`:""}
            </div>`}).join("")}
        </div>
      </div>

      <!-- Cuadrante régimen 2x2 — PENDIENTE conexión Ciclo × Liquidez -->
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);">Mapa de Régimen Macro (Crecimiento × Liquidez)</div>
          <div style="font-size:8px;font-family:var(--mono);color:var(--amber);">⏳ Pendiente conexión Ciclo × Liquidez — posición activa disponible tras Audit 1.2</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          ${[{l:"BOOM",c:"var(--green)",desc:"Crecimiento alto + Liquidez alta · RV agresiva, small caps, commodities"},{l:"GOLDILOCKS",c:"var(--teal)",desc:"Crecimiento moderado + Liquidez alta · RV quality, bonos IG, oro"},{l:"DESACELERACIÓN",c:"var(--amber)",desc:"Crecimiento moderado + Liquidez baja · Defensivo, cash, bonos cortos"},{l:"RECESIÓN",c:"var(--red)",desc:"Crecimiento negativo + Liquidez baja · Cash, treasuries, oro"}].map(a=>`<div style="padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:100px;background:var(--surface2);">
            <div style="font-size:11px;font-weight:700;color:${a.c};margin-bottom:6px;">${a.l}</div>
            <div style="font-size:9px;color:var(--text3);line-height:1.4;">${a.desc}</div>
          </div>`).join("")}
        </div>
        <div style="font-size:8px;font-family:var(--mono);color:var(--text3);margin-top:8px;">Eje Crecimiento ← cicloScore (Curva USD + Curva EUR + LEI) · Eje Liquidez ← liqScore (M2 + Impulso + Vel.M2) · Conexión pendiente cierre Audit 1.2</div>
      </div>

      <!-- Panel manuales -->
      <div id="ciclo-manual-panel" style="background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:6px;padding:8px 10px;line-height:1.8;background:var(--surface);border:1px dashed var(--border2);border-radius:12px;padding:18px 20px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">✎ Override Manual — Ciclo</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:14px;">OECD CLI USA se obtiene automáticamente de FRED (USALOLITOAASTSAM). Solo introduce un override si FRED no está disponible o el dato tiene más de 2 meses. Override: introduce el delta MoM en puntos (ej. +0.04 si el nivel subió de 100.76 a 100.80). Score: >0 y subiendo → +1 | <100 y bajando → -1 | resto → 0.</div>
        ${Y("lei","Override LEI (% m/m)","Deja vacío para usar FRED USSLIND automático · ≥+0.3%→+1 · ±0.3%→0 · <−0.3%→−1",R.lei)}
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-primary" id="ciclo-save-man">Guardar y actualizar</button>
          <button class="btn" id="ciclo-close-man">Cancelar</button>
        </div>
      </div>
      <div class="co-footer">Fuentes: FRED (DGS10, DGS2, USALOLITOAASTSAM) · ECB Data Portal (Curva EUR)</div>
    `,(L=document.getElementById("ciclo-save-man"))==null||L.addEventListener("click",()=>{const a=U();document.querySelectorAll(".co-manual-input").forEach(e=>{const i=e.value.trim();a[e.dataset.key]=i!==""?parseFloat(i):null}),k(a),document.getElementById("ciclo-manual-panel").style.display="none",l(!0)}),(M=document.getElementById("ciclo-close-man"))==null||M.addEventListener("click",()=>{document.getElementById("ciclo-manual-panel").style.display="none"})}return(x=document.getElementById("ciclo-refresh"))==null||x.addEventListener("click",()=>l(!0)),(f=document.getElementById("ciclo-edit"))==null||f.addEventListener("click",()=>{const o=document.getElementById("ciclo-manual-panel");o&&(o.style.display=o.style.display==="none"?"block":"none")}),await l(!1),{destroy(){}}}export{Z as render};
