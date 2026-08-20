import{g as y}from"./macro-data-CGVdt8ED.js";const d=l=>l!=null?Number(l).toFixed(2):"—";async function b(l,{actionsSlot:p}){var v;p.innerHTML='<button class="btn btn-primary" id="pm-refresh">↻ Actualizar</button>',l.innerHTML='<div id="pm-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function s(o=!1){try{const n=await y(o);u(n)}catch(n){document.getElementById("pm-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${n.message}</div></div>`}}function u(o){const n=document.getElementById("pm-wrap"),m=o.coyuntura||{},x=o.seguimiento||{},c=o.liquidez||{};o.indicators;const e=m.tipoReal,i=x.ffr,a=c.reservas,t=c.bbbSpread,r=(e==null?void 0:e.value)!=null?Math.min(100,Math.max(0,(e.value+3)/6*100)):50,g=r>70?"Muy Restrictiva":r>55?"Restrictiva":r>45?"Neutral":r>30?"Acomodaticia":"Muy Acomodaticia",f=r>70?"var(--red)":r>55?"var(--amber)":r>45?"var(--text2)":"var(--green)";n.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 260px;gap:14px;margin-bottom:14px;">
        <div>
          <!-- Stance bar -->
          <div class="mac-card" style="margin-bottom:12px;">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Stance de Política Monetaria</div>
            <div style="font-family:var(--serif);font-size:24px;font-style:italic;color:${f};margin-bottom:10px;">${g}</div>
            <div style="height:14px;background:var(--surface2);border-radius:7px;overflow:hidden;position:relative;margin-bottom:6px;">
              <div style="height:100%;width:100%;background:linear-gradient(90deg,var(--green),var(--amber) 40%,var(--red));border-radius:7px;"></div>
              <div style="position:absolute;top:50%;left:${r}%;transform:translate(-50%,-50%);width:4px;height:18px;background:var(--text1);border-radius:2px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:12px;"><span>Muy Acomodaticia</span><span>Neutral</span><span>Muy Restrictiva</span></div>
            <div style="font-size:11px;color:var(--text2);line-height:1.7;">${(e==null?void 0:e.value)!=null?`El <strong style="color:var(--text1)">tipo real de ${e.value>=0?"+":""}${d(e.value)}%</strong> indica política ${e.value>=1?"muy restrictiva":e.value>=.5?"restrictiva":"acomodaticia"}. Históricamente, tipos reales >+1.5% durante >6 meses han precedido recesión en el 78% de los casos.`:"Sin datos de tipo real disponibles."}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <!-- FFR -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Fed Funds Rate <span style="float:right;color:var(--teal)">AUTO</span></div>
              <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:var(--amber);">${(i==null?void 0:i.value)!=null?d(i.value)+"%":"—"}</div>
              <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin:8px 0 4px;"><div style="height:100%;width:${(i==null?void 0:i.value)!=null?Math.min(i.value/8*100,100):0}%;background:var(--amber);border-radius:3px;"></div></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${(i==null?void 0:i.date)||"—"}</div>
              <div style="font-size:10px;color:var(--text2);margin-top:6px;line-height:1.5;">${(i==null?void 0:i.value)!=null&&i.value>4?"Tipos restrictivos — presiona consumo e inversión":"Tipos en zona acomodaticia"}</div>
            </div>
            <!-- Tipo Real -->
            <div class="mac-card">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Tipo Real (FFR − CPI) <span style="float:right;color:var(--teal)">AUTO</span></div>
              <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${(e==null?void 0:e.score)>0?"var(--green)":(e==null?void 0:e.score)===0?"var(--amber)":"var(--red)"};">${(e==null?void 0:e.value)!=null?(e.value>=0?"+":"")+d(e.value)+"%":"—"}</div>
              <div style="position:relative;height:5px;background:var(--surface2);border-radius:3px;margin:8px 0 4px;">
                ${(e==null?void 0:e.value)!=null&&e.value>=0?`<div style="position:absolute;left:50%;width:${Math.min(e.value*20,50)}%;height:100%;background:${e.score>0?"var(--green)":"var(--amber)"};border-radius:0 3px 3px 0;"></div>`:""}
                ${(e==null?void 0:e.value)!=null&&e.value<0?`<div style="position:absolute;right:50%;width:${Math.min(Math.abs(e.value)*20,50)}%;height:100%;background:var(--red);border-radius:3px 0 0 3px;"></div>`:""}
                <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
              </div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">≥+1.0%→+1 · +0.5-0.9%→0 · <+0.5%→−1 · peso ×1</div>
              <div style="font-size:10px;color:var(--text2);line-height:1.5;">${(e==null?void 0:e.score)>0?"Política neutral-restrictiva — no estimula la economía":(e==null?void 0:e.score)===0?"Zona neutral":(e==null?void 0:e.value)!=null?"< +0.5% → excesivamente restrictivo o inflación desbocada":"Sin datos"}</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Reservas -->
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Reservas Bancarias Fed <span style="float:right;color:var(--teal)">AUTO</span></div>
            <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${(a==null?void 0:a.score)>0?"var(--green)":(a==null?void 0:a.score)===0?"var(--amber)":"var(--red)"};">${(a==null?void 0:a.value)!=null?"$"+d(a.value)+"T":"—"}</div>
            <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin:8px 0 4px;"><div style="height:100%;width:${(a==null?void 0:a.value)!=null?Math.min(a.value/5*100,100):0}%;background:${(a==null?void 0:a.score)>0?"var(--green)":(a==null?void 0:a.score)===0?"var(--amber)":"var(--red)"};border-radius:3px;"></div></div>
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;">≥$3.5T→+1 · $2.5-3.4T→−1 · <$2.5T→−2</div>
            <div style="font-size:10px;color:var(--text2);line-height:1.5;">${(a==null?void 0:a.score)>0?"Liquidez bancaria abundante":(a==null?void 0:a.score)===-1?"QT activo — capacidad prestadora reducida":"Reservas insuficientes — riesgo credit crunch"}</div>
          </div>
          <!-- BBB Spread -->
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">BBB Corporate Spread <span style="float:right;color:var(--teal)">AUTO</span></div>
            <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:${(t==null?void 0:t.score)>0?"var(--green)":(t==null?void 0:t.score)===0?"var(--amber)":"var(--red)"};">${(t==null?void 0:t.value)!=null?d(t.value)+"%":"—"}</div>
            <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin:8px 0 4px;"><div style="height:100%;width:${(t==null?void 0:t.value)!=null?Math.min(t.value/4*100,100):0}%;background:${(t==null?void 0:t.score)>0?"var(--green)":(t==null?void 0:t.score)===0?"var(--amber)":"var(--red)"};border-radius:3px;"></div></div>
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;">≤1.00%→+1 · 1.00-1.50%→0 · >1.50%→−1</div>
            <div style="font-size:10px;color:var(--text2);line-height:1.5;">${(t==null?void 0:t.score)>0?"Mercado tranquilo — coste de crédito bajo":(t==null?void 0:t.score)===0?"Neutral":"Estrés crediticio — prime de riesgo elevada"}</div>
          </div>
          <!-- Ventana contagio -->
          <div class="mac-card" style="background:var(--surface2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Ventana de Contagio Inflacionario</div>
            <div style="display:flex;gap:4px;">
              <div style="flex:1;background:rgba(74,222,128,0.1);border-radius:4px;padding:6px;text-align:center;font-size:8px;font-family:var(--mono);"><div style="color:var(--green)">0-3m</div><div style="color:var(--text3);margin-top:2px;">Seguro</div></div>
              <div style="flex:1;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:4px;padding:6px;text-align:center;font-size:8px;font-family:var(--mono);"><div style="color:var(--amber)">3-6m</div><div style="color:var(--text3);margin-top:2px;">⚠ Riesgo</div></div>
              <div style="flex:1;background:rgba(244,113,116,0.1);border-radius:4px;padding:6px;text-align:center;font-size:8px;font-family:var(--mono);"><div style="color:var(--red)">6m+</div><div style="color:var(--text3);margin-top:2px;">Estructural</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="co-footer">Fuentes: FRED (DFF, DGS10, DGS2, CPIAUCSL, WRESBAL, BAMLC0A4CBBB)</div>
    `}return(v=document.getElementById("pm-refresh"))==null||v.addEventListener("click",()=>s(!0)),await s(!1),{destroy(){}}}export{b as render};
