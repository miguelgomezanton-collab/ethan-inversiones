import{g as z}from"./macro-data-CGVdt8ED.js";const n=o=>o!=null?Number(o).toFixed(1):"—",u=o=>o!=null?Number(o).toFixed(2):"—";async function k(o,{actionsSlot:b}){var x;b.innerHTML='<button class="btn btn-primary" id="inf-refresh">↻ Actualizar</button>',o.innerHTML='<div id="inf-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function m(s=!1){try{const l=await z(s);h(l)}catch(l){document.getElementById("inf-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${l.message}</div></div>`}}function h(s){var f,y;const l=document.getElementById("inf-wrap"),g=s.coyuntura||{},p=s.seguimiento||{},e=s.riesgoContagio,c=g.cpi,t=p.breakeven1y,a=p.breakeven5y,i=((f=g.cpi)==null?void 0:f.cpiCore)??((y=p.cpiCore)==null?void 0:y.value),r=c==null?void 0:c.value,$=r!=null?r<=2.5?"var(--green)":r<=4?"var(--amber)":"var(--red)":"var(--text3)",E=i!=null?i<=2.5?"var(--green)":i<=4?"var(--amber)":"var(--red)":"var(--text3)";l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <!-- Headline vs Core -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:12px;">CPI Headline vs Core <span style="float:right;color:var(--teal)">AUTO · FRED</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div style="text-align:center;background:var(--surface2);border-radius:8px;padding:16px 10px;">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px;">HEADLINE</div>
              <div style="font-family:var(--serif);font-size:40px;font-weight:600;font-style:italic;color:${$};">${r!=null?n(r)+"%":"—"}</div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">YoY · incl. energía/alimentos</div>
            </div>
            <div style="text-align:center;background:var(--surface2);border-radius:8px;padding:16px 10px;">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px;">CORE</div>
              <div style="font-family:var(--serif);font-size:40px;font-weight:600;font-style:italic;color:${E};">${i!=null?n(i)+"%":"—"}</div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">YoY · subyacente estructural</div>
            </div>
          </div>
          ${r!=null&&i!=null?`<div style="background:rgba(${i>r?"244,113,116":"74,222,128"},0.08);border:1px solid rgba(${i>r?"244,113,116":"74,222,128"},0.2);border-radius:8px;padding:12px;">
            <div style="font-size:10px;font-weight:700;color:${i>r?"var(--red)":"var(--amber)"};margin-bottom:4px;">${i>r?"⚠ Core > Headline — Señal Estructural":"Headline > Core — Presión Coyuntural"}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">${i>r?"La inflación no viene de shocks externos sino de presiones internas (salarios, servicios). Más difícil de controlar con tipos.":"La inflación viene principalmente de energía o alimentos. Generalmente transitoria si no hay segunda ronda de salarios."}</div>
          </div>`:""}
        </div>

        <!-- Breakevens + Riesgo Contagio -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Inflación Esperada <span style="float:right;color:var(--teal)">AUTO · FRED</span></div>
            ${t?`<div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
                <span style="font-size:11px;color:var(--text2);">${t.label||"Expectativa 1Y"}</span>
                <span style="font-family:var(--mono);font-size:13px;font-weight:700;color:${t.freshness==="stale"?"var(--text3)":t.value>3?"var(--red)":t.value>2.5?"var(--amber)":"var(--green)"};">${t.freshness==="stale"?"STALE":u(t.value)+"%"}</span>
              </div>
              <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:3px;"><div style="height:100%;width:${Math.min((t.value||0)/6*100,100)}%;background:${t.value>3?"var(--red)":t.value>2.5?"var(--amber)":"var(--green)"};border-radius:3px;"></div></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${t.date||"—"} · ${t.ageDays!=null?t.ageDays+"d":"—"} · ${t.freshness==="ok"?"✓ OK":t.freshness==="warn"?"⚠ WARN":"✗ STALE"} · ${t.series||"—"}</div>
            </div>`:'<div style="font-size:10px;color:var(--text3);margin-bottom:10px;">Expectativa 1Y: sin datos</div>'}
            ${a?`<div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
                <span style="font-size:11px;color:var(--text2);">${a.label||"Breakeven 5Y"}</span>
                <span style="font-family:var(--mono);font-size:13px;font-weight:700;color:${a.freshness==="stale"?"var(--text3)":a.value>2.8?"var(--red)":a.value>2.3?"var(--amber)":"var(--green)"};">${a.freshness==="stale"?"STALE":u(a.value)+"%"}</span>
              </div>
              <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:3px;"><div style="height:100%;width:${Math.min((a.value||0)/5*100,100)}%;background:${a.value>2.8?"var(--red)":a.value>2.3?"var(--amber)":"var(--green)"};border-radius:3px;"></div></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${a.date||"—"} · ${a.ageDays!=null?a.ageDays+"d":"—"} · ${a.freshness==="ok"?"✓ OK":a.freshness==="warn"?"⚠ WARN":"✗ STALE"} · ${a.series||"—"}</div>
            </div>`:'<div style="font-size:10px;color:var(--text3);margin-bottom:10px;">Breakeven 5Y: sin datos</div>'}
            <div style="font-size:10px;color:var(--text2);border-top:1px solid var(--border);padding-top:8px;line-height:1.5;">
              ${(()=>{const d=(t==null?void 0:t.freshness)!=="stale"?t==null?void 0:t.value:null,v=(a==null?void 0:a.freshness)!=="stale"?a==null?void 0:a.value:null;return d==null&&v==null?"Sin datos de expectativas disponibles.":d!=null&&v!=null?d>3&&v>2.3?'<strong style="color:var(--red)">Expectativas elevadas en corto y medio plazo.</strong> Mercado descuenta inflación persistente. <em style="color:var(--text3)">Umbrales provisionales.</em>':d>3?'Presión inflacionaria a corto plazo; expectativas de medio plazo contenidas. <em style="color:var(--text3)">Umbrales provisionales.</em>':'Expectativas contenidas en ambos horizontes. <em style="color:var(--text3)">Umbrales provisionales.</em>':v!=null?(v>2.3?"Breakeven 5Y por encima del objetivo Fed.":"Breakeven 5Y contenido.")+' <em style="color:var(--text3)">Sin dato 1Y.</em>':(d>3?"Expectativa 1Y elevada.":"Expectativa 1Y moderada.")+' <em style="color:var(--text3)">Sin dato 5Y.</em>'})()}
            </div>
          </div>

          ${e?`<div class="mac-card" style="background:rgba(${e.nivel==="bajo"?"74,222,128":e.nivel==="moderado"?"251,191,36":"244,113,116"},0.04);border-color:rgba(${e.nivel==="bajo"?"74,222,128":e.nivel==="moderado"?"251,191,36":"244,113,116"},0.2);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Índice de Persistencia Inflacionaria</div>
              <div style="font-size:8px;font-family:var(--mono);color:var(--amber);">HEURÍSTICO · PROVISIONAL</div>
            </div>
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
              <div style="text-align:center;flex-shrink:0;">
                <div style="font-family:var(--serif);font-size:44px;font-weight:600;font-style:italic;color:${e.nivel==="bajo"?"var(--green)":e.nivel==="moderado"?"var(--amber)":"var(--red)"};">${e.pct}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">/ 100 · NO ES PROBABILIDAD</div>
              </div>
              <div>
                <div style="font-size:12px;font-weight:700;color:${e.nivel==="bajo"?"var(--green)":e.nivel==="moderado"?"var(--amber)":"var(--red)"};margin-bottom:4px;text-transform:uppercase;">${e.nivel}</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;">Tipo: <strong style="color:${e.tipo==="coyuntural"?"var(--amber)":"var(--red)"};">${e.tipo.toUpperCase()}</strong> · gap ${n(e.gap)} pp ${e.tipo==="coyuntural"?"≥":"<"} 0.5 pp [umbral provisional]</div>
                <div style="font-size:11px;color:var(--text2);line-height:1.5;">${e.label}</div>
              </div>
            </div>
            <!-- Audit colapsable -->
            <div class="audit-toggle" onclick="this.classList.toggle('open')" style="margin-bottom:10px;">
              <span class="audit-lbl">Metodología ▾</span>
              <div class="audit-body">
                Headline (CPIAUCSL): ${n(e.headline)}%<br>
                Core (CPILFESL): ${n(e.core)}%<br>
                Gap Headline−Core: ${e.gap>=0?"+":""}${n(e.gap)} pp → ${e.tipo.toUpperCase()}<br>
                Índice heurístico: ${e.pct}/100 · regla: CPI≤2.5→10 | ≤3.0→20 | ≤3.5→30 | ≤4.0→50 | >4.0→75<br>
                Estado: PROVISIONAL · HEURÍSTICO · no calculado estadísticamente
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:8px;font-family:var(--mono);text-align:center;">
              <div style="background:rgba(74,222,128,0.08);border-radius:4px;padding:5px;"><div style="color:var(--green);">0–3m</div><div style="color:var(--text3);margin-top:2px;">Sin señal</div></div>
              <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:4px;padding:5px;"><div style="color:var(--amber);">3–6m</div><div style="color:var(--text3);margin-top:2px;">Vigilancia</div></div>
              <div style="background:rgba(244,113,116,0.08);border-radius:4px;padding:5px;"><div style="color:var(--red);">6m+</div><div style="color:var(--text3);margin-top:2px;">Estructural</div></div>
            </div>
          </div>`:""}
        </div>
      </div>
      <div class="co-footer">Fuentes: FRED (CPIAUCSL, CPILFESL, EXPINF1YR, T5YIE) · Expectativa 1Y: Cleveland Fed (primaria) / Univ. Michigan (fallback)</div>
    `}return(x=document.getElementById("inf-refresh"))==null||x.addEventListener("click",()=>m(!0)),await m(!1),{destroy(){}}}export{k as render};
