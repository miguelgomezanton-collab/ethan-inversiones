import{g as $}from"./macro-data-CGVdt8ED.js";const l=o=>o!=null?Number(o).toFixed(1):"—",y=o=>o!=null?Number(o).toFixed(2):"—";async function k(o,{actionsSlot:b}){var c;b.innerHTML='<button class="btn btn-primary" id="inf-refresh">↻ Actualizar</button>',o.innerHTML='<div id="inf-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function p(n=!1){try{const d=await $(n);h(d)}catch(d){document.getElementById("inf-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${d.message}</div></div>`}}function h(n){var f,u;const d=document.getElementById("inf-wrap"),m=n.coyuntura||{},s=n.seguimiento||{},e=n.riesgoContagio,v=m.cpi,t=s.breakeven1y,a=s.breakeven5y,r=((f=m.cpi)==null?void 0:f.cpiCore)??((u=s.cpiCore)==null?void 0:u.value),i=v==null?void 0:v.value,x=i!=null?i<=2.5?"var(--green)":i<=4?"var(--amber)":"var(--red)":"var(--text3)",g=r!=null?r<=2.5?"var(--green)":r<=4?"var(--amber)":"var(--red)":"var(--text3)";d.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <!-- Headline vs Core -->
        <div class="mac-card">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:12px;">CPI Headline vs Core <span style="float:right;color:var(--teal)">AUTO · FRED</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div style="text-align:center;background:var(--surface2);border-radius:8px;padding:16px 10px;">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px;">HEADLINE</div>
              <div style="font-family:var(--serif);font-size:40px;font-weight:600;font-style:italic;color:${x};">${i!=null?l(i)+"%":"—"}</div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">YoY · incl. energía/alimentos</div>
            </div>
            <div style="text-align:center;background:var(--surface2);border-radius:8px;padding:16px 10px;">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px;">CORE</div>
              <div style="font-family:var(--serif);font-size:40px;font-weight:600;font-style:italic;color:${g};">${r!=null?l(r)+"%":"—"}</div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">YoY · subyacente estructural</div>
            </div>
          </div>
          ${i!=null&&r!=null?`<div style="background:rgba(${r>i?"244,113,116":"74,222,128"},0.08);border:1px solid rgba(${r>i?"244,113,116":"74,222,128"},0.2);border-radius:8px;padding:12px;">
            <div style="font-size:10px;font-weight:700;color:${r>i?"var(--red)":"var(--amber)"};margin-bottom:4px;">${r>i?"⚠ Core > Headline — Señal Estructural":"Headline > Core — Presión Coyuntural"}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">${r>i?"La inflación no viene de shocks externos sino de presiones internas (salarios, servicios). Más difícil de controlar con tipos.":"La inflación viene principalmente de energía o alimentos. Generalmente transitoria si no hay segunda ronda de salarios."}</div>
          </div>`:""}
        </div>

        <!-- Breakevens + Riesgo Contagio -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="mac-card">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Inflación Esperada (Breakevens) <span style="float:right;color:var(--teal)">AUTO · FRED</span></div>
            ${t?`<div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;"><span style="font-size:11px;color:var(--text2);">Breakeven 1Y (T1YIE)</span><span style="font-family:var(--mono);font-size:13px;font-weight:700;color:${t.value>3?"var(--red)":t.value>2.5?"var(--amber)":"var(--green)"};">${y(t.value)}%</span></div>
              <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:3px;"><div style="height:100%;width:${Math.min(t.value/6*100,100)}%;background:${t.value>3?"var(--red)":t.value>2.5?"var(--amber)":"var(--green)"};border-radius:3px;"></div></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${t.value>3?">3% → shock inmediato esperado como persistente":t.value>2?"2-3% → por encima del objetivo Fed":"≤2% — anclada cerca del objetivo"}</div>
            </div>`:'<div style="font-size:10px;color:var(--text3);margin-bottom:10px;">T1YIE — sin datos</div>'}
            ${a?`<div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;"><span style="font-size:11px;color:var(--text2);">Breakeven 5Y (T5YIE)</span><span style="font-family:var(--mono);font-size:13px;font-weight:700;color:${a.value>2.8?"var(--red)":a.value>2.3?"var(--amber)":"var(--green)"};">${y(a.value)}%</span></div>
              <div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:3px;"><div style="height:100%;width:${Math.min(a.value/5*100,100)}%;background:${a.value>2.8?"var(--red)":a.value>2.3?"var(--amber)":"var(--green)"};border-radius:3px;"></div></div>
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">${a.value>2.3?"Desanclaje a largo plazo — mercado descuenta inflación persistente":"Anclada — mercado cree que la inflación es transitoria"}</div>
            </div>`:'<div style="font-size:10px;color:var(--text3);margin-bottom:10px;">T5YIE — sin datos</div>'}
            ${t&&a?`<div style="font-size:10px;color:var(--text2);border-top:1px solid var(--border);padding-top:8px;line-height:1.5;">
              ${t.value>3&&a.value>2.3?'<strong style="color:var(--red)">Ambos breakevens elevados</strong> — el mercado descuenta inflación persistente en horizontes corto Y largo. Señal de estructuralidad.':t.value>3?"Breakeven 1Y elevado pero 5Y contenido — el mercado cree que el shock es temporal.":"Expectativas ancladas en ambos horizontes. La Fed mantiene credibilidad."}
            </div>`:""}
          </div>

          ${e?`<div class="mac-card" style="background:rgba(${e.nivel==="bajo"?"74,222,128":e.nivel==="moderado"?"251,191,36":"244,113,116"},0.04);border-color:rgba(${e.nivel==="bajo"?"74,222,128":e.nivel==="moderado"?"251,191,36":"244,113,116"},0.2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">Riesgo de Contagio (Coyuntural → Estructural)</div>
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
              <div style="text-align:center;flex-shrink:0;">
                <div style="font-family:var(--serif);font-size:44px;font-weight:600;font-style:italic;color:${e.nivel==="bajo"?"var(--green)":e.nivel==="moderado"?"var(--amber)":"var(--red)"};">${e.pct}%</div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">probabilidad</div>
              </div>
              <div>
                <div style="font-size:12px;font-weight:700;color:${e.nivel==="bajo"?"var(--green)":e.nivel==="moderado"?"var(--amber)":"var(--red)"};margin-bottom:4px;text-transform:uppercase;">${e.nivel}</div>
                <div style="font-size:11px;color:var(--text2);line-height:1.5;">${e.label}</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;">
              <div style="background:var(--surface2);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:8px;color:var(--text3);text-transform:uppercase;margin-bottom:3px;">Headline</div><div style="font-family:var(--mono);font-size:14px;font-weight:700;color:${x};">${l(e.headline)}%</div></div>
              <div style="background:var(--surface2);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:8px;color:var(--text3);text-transform:uppercase;margin-bottom:3px;">Core</div><div style="font-family:var(--mono);font-size:14px;font-weight:700;color:${g};">${l(e.core)}%</div></div>
              <div style="background:var(--surface2);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:8px;color:var(--text3);text-transform:uppercase;margin-bottom:3px;">Tipo</div><div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${e.tipo==="coyuntural"?"var(--amber)":"var(--red)"};">${e.tipo.toUpperCase()}</div></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:8px;font-family:var(--mono);text-align:center;">
              <div style="background:rgba(74,222,128,0.08);border-radius:4px;padding:5px;"><div style="color:var(--green);">0-3m</div><div style="color:var(--text3);margin-top:2px;">Seguro</div></div>
              <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:4px;padding:5px;"><div style="color:var(--amber);">3-6m</div><div style="color:var(--text3);margin-top:2px;">⚠ Riesgo</div></div>
              <div style="background:rgba(244,113,116,0.08);border-radius:4px;padding:5px;"><div style="color:var(--red);">6m+</div><div style="color:var(--text3);margin-top:2px;">Estructural</div></div>
            </div>
          </div>`:""}
        </div>
      </div>
      <div class="co-footer">Fuentes: FRED (CPIAUCSL, CPILFESL, T1YIE, T5YIE)</div>
    `}return(c=document.getElementById("inf-refresh"))==null||c.addEventListener("click",()=>p(!0)),await p(!1),{destroy(){}}}export{k as render};
