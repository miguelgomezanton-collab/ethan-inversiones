import{g as q}from"./macro-data-CGVdt8ED.js";const t=l=>l!=null?Number(l).toFixed(2):"—",p=l=>l==="ok"?"✓ OK":l==="warn"?"⚠ WARN":l==="stale"?"✗ STALE":"—";async function K(l,{actionsSlot:P}){var f;P.innerHTML='<button class="btn btn-primary" id="pm-refresh">↻ Actualizar</button>',l.innerHTML='<div id="pm-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function u(d=!1){try{const s=await q(d);N(s)}catch(s){document.getElementById("pm-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${s.message}</div></div>`}}function N(d){var $,w,M,R,D,E,T,A,z,C,I,S,k;const s=document.getElementById("pm-wrap"),O=d.coyuntura||{},m=d.seguimiento||{},e=O.tipoReal,a=m.ffr,g=m.ffrHistory||[],y=a!=null&&a.date?new Date(a.date).getTime():null,r=y?y-2184*60*60*1e3:null;r&&new Date(r).toISOString().slice(0,10);const n=r&&g.length>0?g.reduce((v,L)=>{const j=Math.abs(new Date(L.date).getTime()-r),V=v?Math.abs(new Date(v.date).getTime()-r):1/0;return j<V?L:v},null):null,c=n?Math.round(Math.abs(new Date(n.date).getTime()-r)/864e5):null,x=c!=null&&c<=7,o=a&&n&&x?Math.round((a.value-n.value)*100):null,B=o==null?"—":o>25?"↑ Endureciendo":o<-25?"↓ Relajando":"→ Estable",b=o==null?"var(--text3)":o>25?"var(--red)":o<-25?"var(--green)":"var(--amber)",i=(e==null?void 0:e.value)??null,H=i!=null?Math.min(100,Math.max(0,(i+3)/6*100)):50,h=i==null?"—":i>=1.5?"Muy Restrictiva":i>=1?"Restrictiva":i>=.5?"Neutral":i>=0?"Acomodaticia":"Muy Acomodaticia",F=i==null?"var(--text3)":i>=1?"var(--red)":i>=.5?"var(--amber)":"var(--green)";s.innerHTML=`
      <!-- STANCE BAR -->
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Stance de Política Monetaria · Fed</div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">PROVISIONAL · Fase 1 · Tipo Real como proxy único</div>
        </div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;color:${F};margin-bottom:10px;">${h}</div>
        <div style="height:14px;background:var(--surface2);border-radius:7px;overflow:hidden;position:relative;margin-bottom:6px;">
          <div style="height:100%;width:100%;background:linear-gradient(90deg,var(--green),var(--amber) 40%,var(--red));border-radius:7px;"></div>
          <div style="position:absolute;top:50%;left:${H}%;transform:translate(-50%,-50%);width:4px;height:18px;background:var(--text1);border-radius:2px;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:10px;">
          <span style="color:var(--green)">Muy Acomodaticia</span><span>Neutral</span><span style="color:var(--red)">Muy Restrictiva</span>
        </div>
        <div style="font-size:11px;color:var(--text2);line-height:1.7;">
          ${i!=null?`Tipo real <strong style="color:var(--text1)">${i>=0?"+":""}${t(i)}%</strong> → <strong style="color:${F}">${h}</strong>.
              ${i>=1.5?"Restricción significativa — históricamente asociada a desaceleración del crédito y presión sobre valoraciones.":i>=1?"Política restrictiva — frena consumo e inversión por encima de la inflación.":i>=.5?"Zona neutral — la tasa real no estimula ni restringe significativamente.":i>=0?"Tipo real positivo pero bajo. Señal poco restrictiva según umbral provisional.":"Tipo real negativo — política expansiva, potencial riesgo inflacionario estructural."}
              <em style="color:var(--text3);font-size:10px;">Scoring provisional. Fase 2 incorporará balance Fed y expectativas de tipos.</em>`:"Sin datos de tipo real disponibles."}
        </div>
      </div>

      <!-- 3 TARJETAS: FFR · TIPO REAL · DIRECCIÓN -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">

        <!-- 1. FFR efectivo -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Fed Funds efectivo <span style="float:right;color:var(--teal)">FRED DFF</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:var(--amber);">
            ${(a==null?void 0:a.value)!=null?t(a.value)+"%":"—"}
          </div>
          <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin:8px 0 6px;">
            <div style="height:100%;width:${(a==null?void 0:a.value)!=null?Math.min(a.value/8*100,100):0}%;background:var(--amber);border-radius:3px;"></div>
          </div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);line-height:1.7;">
            Fecha: ${(a==null?void 0:a.date)||"—"}<br>
            Freshness: ${(($=e==null?void 0:e.ffr)==null?void 0:$.ageDays)!=null?e.ffr.ageDays+"d":"—"} · ${p((w=e==null?void 0:e.ffr)==null?void 0:w.freshness)}<br>
            Fuente: FRED DFF (diario)
          </div>
        </div>

        <!-- 2. Tipo Real -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Tipo Real (FFR − CPI) <span style="float:right;color:var(--teal)">AUTO</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${(e==null?void 0:e.score)>0?"var(--green)":(e==null?void 0:e.score)===0?"var(--amber)":"var(--red)"};">
            ${(e==null?void 0:e.value)!=null?(e.value>=0?"+":"")+t(e.value)+"%":"—"}
          </div>
          <div style="position:relative;height:5px;background:var(--surface2);border-radius:3px;margin:8px 0 6px;">
            ${(e==null?void 0:e.value)!=null&&e.value>=0?`<div style="position:absolute;left:50%;width:${Math.min(e.value*16,50)}%;height:100%;background:${e.score>0?"var(--green)":"var(--amber)"};border-radius:0 3px 3px 0;"></div>`:""}
            ${(e==null?void 0:e.value)!=null&&e.value<0?`<div style="position:absolute;right:50%;width:${Math.min(Math.abs(e.value)*16,50)}%;height:100%;background:var(--red);border-radius:3px 0 0 3px;"></div>`:""}
            <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
          </div>
          <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">
            FFR ${((M=e==null?void 0:e.ffr)==null?void 0:M.value)!=null?t(e.ffr.value)+"%":"—"} − CPI ${((R=e==null?void 0:e.cpi)==null?void 0:R.yoy)!=null?t(e.cpi.yoy)+"%":"—"} = ${(e==null?void 0:e.value)!=null?(e.value>=0?"+":"")+t(e.value)+"%":"—"}
          </div>
          <div class="audit-toggle" onclick="this.classList.toggle('open')">
            <span class="audit-lbl">Metodología ▾</span>
            <div class="audit-body">
              DFF: ${((D=e==null?void 0:e.ffr)==null?void 0:D.date)||"—"} | ${((E=e==null?void 0:e.ffr)==null?void 0:E.value)!=null?t(e.ffr.value)+"%":"—"} | ${p((T=e==null?void 0:e.ffr)==null?void 0:T.freshness)}<br>
              CPI: ${((A=e==null?void 0:e.cpi)==null?void 0:A.date)||"—"} | YoY ${((z=e==null?void 0:e.cpi)==null?void 0:z.yoy)!=null?t(e.cpi.yoy)+"%":"—"} | base ${((C=e==null?void 0:e.cpi)==null?void 0:C.baseDate)||"—"} | ${p((I=e==null?void 0:e.cpi)==null?void 0:I.freshness)}<br>
              Cálculo: ${((S=e==null?void 0:e.ffr)==null?void 0:S.value)!=null?t(e.ffr.value):"—"} − ${((k=e==null?void 0:e.cpi)==null?void 0:k.yoy)!=null?t(e.cpi.yoy):"—"} = ${(e==null?void 0:e.value)!=null?(e.value>=0?"+":"")+t(e.value)+"%":"—"}<br>
              Score: ${(e==null?void 0:e.score)!=null?e.score:"bloqueado"}${e!=null&&e.stale?" · STALE":""}<br>
              Thresholds: ≥+1.0→+1 · ≥+0.5→0 · &lt;+0.5→−1 [PROVISIONAL]<br>
              Convención: +1=restrictivo · −1=acomodaticio · Motor: HIST_MACRO_V1 Fase 1
            </div>
          </div>
        </div>

        <!-- 3. Dirección reciente FFR -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
            Dirección reciente · FFR 3M <span style="float:right;color:var(--amber)">FASE 1</span>
          </div>
          <div style="font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;color:${b};">
            ${o!=null?(o>=0?"+":"")+o+" pb":"—"}
          </div>
          <div style="font-size:16px;color:${b};margin:6px 0;font-family:var(--mono);">${B}</div>
          <div style="font-size:9px;color:var(--amber);font-family:var(--mono);margin-top:6px;">
            ⚠ Proxy acciones pasadas Fed — no forward-looking
          </div>
          <div class="audit-toggle" onclick="this.classList.toggle('open')">
            <span class="audit-lbl">Metodología ▾</span>
            <div class="audit-body">
              Actual: ${(a==null?void 0:a.date)||"—"} | ${(a==null?void 0:a.value)!=null?t(a.value)+"%":"—"}<br>
              Referencia 3M: ${(n==null?void 0:n.date)||"—"} | ${(n==null?void 0:n.value)!=null?t(n.value)+"%":"—"}<br>
              Gap objetivo: ${c!=null?c+"d":"—"} · ${x?"✓ OK":"⚠ fuera tolerancia ±7d"}<br>
              Δ3M: ${o!=null?(o>=0?"+":"")+o+" pb":"— (inválido)"}<br>
              Fase 2 pendiente: CME Futures (forward-looking)
            </div>
          </div>
        </div>
      </div>

      <!-- PENDIENTES FASE 2 -->
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">📋 Fase 2 — Pendiente de implementación</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div>⏳ Expectativas Fed (CME Futures)<br><span style="color:var(--text3)">Forward-looking · precios de mercado</span></div>
          <div>⏳ Balance Fed (WALCL)<br><span style="color:var(--text3)">QT/QE · expansión/contracción</span></div>
          <div>⏳ Core PCE como alternativa a CPI<br><span style="color:var(--text3)">Referencia estructural de la Fed</span></div>
        </div>
      </div>

      <div class="co-footer">Fuentes: FRED DFF · FRED CPIAUCSL · Reservas/BBB → 1.2 Liquidez</div>
    `}return(f=document.getElementById("pm-refresh"))==null||f.addEventListener("click",()=>u(!0)),await u(!1),{destroy(){}}}export{K as render};
