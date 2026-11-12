function H(t){t.innerHTML=`
<div class="page-crumb">ETHAN R-Lab <span>›</span> Trading R-Lab</div>
<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px;">
  <div class="page-title" style="font-style:italic;">Trading R-Lab</div>
  <span style="font-family:var(--mono);font-size:9px;font-weight:700;padding:3px 10px;border-radius:12px;background:rgba(167,139,250,0.12);color:#a78bfa;border:1px solid rgba(167,139,250,0.25);">⚗ RESEARCH · NO PRODUCTION</span>
</div>

<div class="mm-tabs" style="margin-bottom:20px;">
  ${["overview","entry","exit","matrix","robustness","audit"].map((e,r)=>`<button class="mm-tab${r===0?" active":""}" data-rlab-tab="${e}">${["📊 Overview","📥 Entry Lab","📤 Exit Lab","⊞ Entry × Exit","🔬 Robustness","🗂 Audit / Runs"][r]}</button>`).join("")}
</div>

<div id="rlab-panel-overview" class="rlab-panel"></div>
<div id="rlab-panel-entry"    class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-exit"     class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-matrix"   class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-robustness" class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-audit"    class="rlab-panel" style="display:none;"></div>
`,R(t)}const h={E0:"E0 — Immediate",E1:"E1 — EMA5W cross",E2:"E2 — MACD+RSI diario",E3:"E3 — RSI5W Pullback",E4:"E4 — RSI5D Pullback"},T={X1:"X1 — EMA10D pura",X2:"X2 — EMA10W pura"},_=["E0","E1","E2","E3","E4"],$=["X1","X2"];function R(t){let e=null;u(t.querySelector("#rlab-panel-overview"),e),M(t.querySelector("#rlab-panel-audit")),t.querySelectorAll(".mm-tab[data-rlab-tab]").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".mm-tab[data-rlab-tab]").forEach(a=>a.classList.remove("active")),t.querySelectorAll(".rlab-panel").forEach(a=>a.style.display="none"),r.classList.add("active");const i=t.querySelector(`#rlab-panel-${r.dataset.rlabTab}`);i.style.display="block",E(r.dataset.rlabTab,i,e)})}),t.addEventListener("click",async r=>{var a,n,p,x,m,b,o,g;const i=r.target.id;if(i==="rlab-trace-btn"){const s=(((a=t.querySelector("#rlab-trace-ticker"))==null?void 0:a.value)||"AAPL").toUpperCase(),c=t.querySelector("#rlab-trace-status"),l=t.querySelector("#rlab-trace-result");c.innerHTML='<span style="color:var(--text3)">⏳ Trace '+s+"...</span>",l.innerHTML="";try{const d=await fetch("/api/macro-history?type=rlab-trace&ticker="+s),y=await d.text();let v;try{v=JSON.parse(y)}catch{c.innerHTML='<span style="color:var(--red)">RLAB_ENDPOINT_ERROR · HTTP '+d.status+"</span>",l.innerHTML=`<div style="background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.25);border-radius:6px;padding:10px;font-family:var(--mono);font-size:9px;">
            <div style="color:var(--red);font-weight:700;margin-bottom:6px;">❌ Respuesta no-JSON del endpoint</div>
            <div style="color:var(--text3);">HTTP: ${d.status} · Content-Type: ${d.headers.get("content-type")||"—"}</div>
            <div style="color:var(--amber);margin-top:4px;word-break:break-all;">${y.slice(0,500)}</div>
          </div>`;return}console.log("[R-Lab Trace]","ok="+v.ok,"status="+v.status,"stage="+v.stage,"dataset="+((n=JSON.stringify(v.dataset))==null?void 0:n.slice(0,80)));const w=v.ok===!0;c.innerHTML='<span style="color:'+(w?"var(--green)":"var(--amber)")+'">'+s+": "+(v.status||"sin status")+(v.stage?" [stage:"+v.stage+"]":"")+"</span>",l.innerHTML=k(v)}catch(d){c.innerHTML='<span style="color:var(--red)">Error de red: '+d.message+"</span>"}}if(i==="rlab-results-btn"){const s=t.querySelector("#rlab-run-status");s&&(s.textContent="Cargando...");try{const c=await fetch("/api/macro-history?type=results").then(d=>d.json());e=c,s&&(s.innerHTML='<span style="color:var(--green)">✓ '+c.n_trades+" trades</span>"),u(t.querySelector("#rlab-panel-overview"),e);const l=(x=(p=t.querySelector(".mm-tab[data-rlab-tab].active"))==null?void 0:p.dataset)==null?void 0:x.rlabTab;l&&l!=="audit"&&E(l,t.querySelector("#rlab-panel-"+l),e)}catch(c){s&&(s.innerHTML='<span style="color:var(--red)">'+c.message+"</span>")}}if(i==="rlab-run-batch-btn"){const s=parseInt(((m=t.querySelector("#rlab-batch-start"))==null?void 0:m.value)||"0"),c=((b=t.querySelector("#rlab-run-id"))==null?void 0:b.value)||"sp100_v1",l=t.querySelector("#rlab-run-status");l&&(l.textContent="Ejecutando lote "+s+"...");try{const d=await fetch("/api/macro-history?type=run&start="+s+"&size=15&run_id="+c).then(y=>y.json());e=d,l&&(l.innerHTML='<span style="color:var(--green)">✓ Lote OK · '+((o=d.summary)==null?void 0:o.n_trades)+" trades</span>"),u(t.querySelector("#rlab-panel-overview"),e)}catch(d){l&&(l.innerHTML='<span style="color:var(--red)">'+d.message+"</span>")}}if(i==="rlab-run-all-btn"){const s=((g=t.querySelector("#rlab-run-id"))==null?void 0:g.value)||"sp100_v1",c=t.querySelector("#rlab-run-status"),l=t.querySelector("#rlab-run-progress");c&&(c.textContent="Lanzando 7 lotes...");for(let d=0;d<105;d+=15){l&&(l.textContent="Lote "+(d/15+1)+"/7 ("+d+"–"+(d+14)+")...");try{e=await fetch("/api/macro-history?type=run&start="+d+"&size=15&run_id="+s).then(v=>v.json())}catch(y){l&&(l.textContent+=" ERROR: "+y.message)}await new Promise(y=>setTimeout(y,500))}c&&(c.innerHTML='<span style="color:var(--green)">✓ Completado</span>'),u(t.querySelector("#rlab-panel-overview"),e)}})}function E(t,e,r){t==="overview"?u(e,r):t==="entry"?L(e,r):t==="exit"?A(e,r):t==="matrix"?I(e,r):t==="robustness"?e.innerHTML='<div class="mac-card" style="color:var(--text3);padding:30px;text-align:center;">Robustness (Bootstrap, Walk-Forward, Sector) — Próxima fase</div>':t==="audit"&&M(e)}function f(t,e,r){return t==null?"var(--text3)":t>e?"var(--green)":t<r?"var(--red)":"var(--amber)"}function u(t,e){const r=(e==null?void 0:e.summary)||{},i=(e==null?void 0:e.aggregates_IS)||{};t.innerHTML=`
<div class="mac-card" style="margin-bottom:14px;background:rgba(167,139,250,0.04);border-color:rgba(167,139,250,0.2);">
  <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
    <span style="font-size:10px;font-weight:700;color:#a78bfa;">BASE_FILTER_V1 · CURRENT_SP100 · 10Y</span>
    <span style="font-family:var(--mono);font-size:9px;color:var(--amber);">⚠ SURVIVORSHIP BIAS · PIPELINE VALIDATION</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
  ${[["Eligible Events",r.n_events],["Event Entries",r.n_event_entries],["Trades",r.n_trades],["Errores",r.n_errors],["Firestore",r.saved_to_firestore?"✓":"—"]].map(([a,n])=>`<div style="background:var(--surface2);border-radius:6px;padding:10px;text-align:center;">
      <div style="font-size:8px;color:var(--text3);margin-bottom:4px;">${a}</div>
      <div style="font-family:var(--serif);font-size:20px;font-weight:600;font-style:italic;">${n??"—"}</div>
    </div>`).join("")}
  </div>
  <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:8px;">
    IS 2015–2020 · OOS 2021–presente · Close(t)→Open(t+1) · EMA(no SMA) · E2 RSI14>59
  </div>
</div>
${Object.keys(i).length?`
<div class="mac-card" style="margin-bottom:14px;">
  <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:10px;">TRIGGER RATE E0–E4 · % eventos con entrada activada (IS)</div>
  ${_.map(a=>{const n=i[a+"_X1"]||{},p=n.trigger_rate??0,x=p>70?"var(--green)":p>40?"var(--amber)":"var(--red)";return`
  <div style="margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
      <span style="font-size:9px;color:var(--text2);">${h[a]}</span>
      <span style="font-family:var(--mono);font-size:9px;color:${x};">${p}% (${n.n_triggered||"—"}/${n.n_events||"—"})</span>
    </div>
    <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;">
      <div style="height:100%;width:${Math.min(p,100)}%;background:${x};"></div>
    </div>
  </div>`}).join("")}
</div>
${z(i,"IS")}`:`<div class="mac-card" style="padding:30px;text-align:center;color:var(--text3);">Sin datos · Lanza el Validation Run desde 'Audit / Runs'</div>`}`}function z(t,e){return`<div class="mac-card" style="margin-bottom:14px;">
  <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:8px;">Entry×Exit Win Rate · ${e}</div>
  <table style="width:100%;border-collapse:collapse;font-size:9px;">
    <thead><tr style="background:var(--surface2);">
      <th style="padding:5px 8px;text-align:left;color:var(--text3);">Entrada</th>
      ${$.map(r=>`<th style="padding:5px 8px;text-align:center;color:var(--text3);">${T[r]}</th>`).join("")}
    </tr></thead>
    <tbody>${_.map(r=>`<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:5px 8px;color:var(--text2);">${h[r]}</td>
      ${$.map(i=>{const a=t[r+"_"+i];return!a||!a.n_trades?'<td style="padding:5px 8px;text-align:center;color:var(--text3);">—</td>':`<td style="padding:5px 8px;text-align:center;"><div style="font-family:var(--mono);font-weight:700;color:${a.win_rate>55?"var(--green)":a.win_rate>45?"var(--amber)":"var(--red)"};">${a.win_rate}%</div><div style="font-size:8px;color:var(--text3);">(${a.expectancy>=0?"+":""}${a.expectancy}) N=${a.n_trades}</div></td>`}).join("")}
    </tr>`).join("")}</tbody>
  </table>
</div>`}function L(t,e){const r=(e==null?void 0:e.aggregates_IS)||{};t.innerHTML='<div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:12px;">ENTRY LAB · IS 2015–2020</div>'+_.map(i=>{const a=r[i+"_X1"]||{};return`
  <div class="mac-card" style="margin-bottom:10px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:var(--text2);">${h[i]}</span>
      <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">N=${a.n_trades||"—"} · Trigger=${a.trigger_rate||"—"}% · ${a.days_to_trigger_mean||"—"}d hasta entry</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
      ${[["Win Rate",a.win_rate,"%",55,45],["Expectancy",a.expectancy,"",.1,-.1],["PF",a.profit_factor,"",1.5,1],["Med.Ret",a.median_ret,"%",2,0],["MFE",a.mfe_mean,"%",0,-99],["Capture",a.capture_mean,"%",65,40]].map(([n,p,x,m,b])=>`
      <div style="background:var(--surface2);border-radius:5px;padding:8px;text-align:center;">
        <div style="font-size:8px;color:var(--text3);margin-bottom:3px;">${n}</div>
        <div style="font-family:var(--mono);font-size:11px;font-weight:700;color:${f(p,m,b)};">${p!=null?p.toFixed(n==="PF"?2:1)+x:"—"}</div>
      </div>`).join("")}
    </div>
  </div>`}).join("")}function A(t,e){const r=(e==null?void 0:e.aggregates_IS)||{};t.innerHTML='<div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:12px;">EXIT LAB · EMA10D vs EMA10W puras · Sin condsBroken · IS 2015–2020</div>'+$.map(i=>`<div class="mac-card" style="margin-bottom:10px;">
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:6px;">${T[i]}</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;font-size:9px;font-family:var(--mono);">
      ${_.map(a=>{const n=r[a+"_"+i]||{};return`<div style="background:var(--surface2);border-radius:5px;padding:6px;text-align:center;">
        <div style="font-size:8px;color:var(--text3);">${a}</div>
        <div style="color:${f(n.win_rate,55,45)};">${n.win_rate??"—"}%</div>
        <div style="color:var(--text3);font-size:8px;">N=${n.n_trades||"—"}</div>
      </div>`}).join("")}
    </div>
  </div>`).join("")}function I(t,e){const r=(e==null?void 0:e.aggregates_IS)||{},i=(e==null?void 0:e.aggregates_OOS)||{};if(!Object.keys(r).length){t.innerHTML='<div class="mac-card" style="padding:30px;text-align:center;color:var(--text3);">Sin datos</div>';return}t.innerHTML=S(r,"IN-SAMPLE (2015–2020)",!1)+S(i,"OUT-OF-SAMPLE (2021–presente)",!0)+'<div style="font-size:8px;color:var(--amber);font-family:var(--mono);margin-top:8px;">⚠ No elegir la "mejor combinación" solo por IS. Esperar OOS + Robustness antes de cualquier decisión de producción.</div>'}function S(t,e,r){return`<div class="mac-card" style="margin-bottom:12px;${r?"border-color:rgba(251,191,36,0.3);background:rgba(251,191,36,0.03);":""}">
  <div style="font-size:9px;font-weight:700;color:${r?"var(--amber)":"var(--text2)"};margin-bottom:8px;">${r?"🎯":"📊"} ${e}</div>
  <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:9px;">
    <thead><tr style="background:var(--surface2);">
      <th style="padding:4px 8px;text-align:left;color:var(--text3);">E×X</th>
      ${["N","Win%","Exp","PF","Med.Ret","Dur(velas)"].map(i=>`<th style="padding:4px 8px;text-align:right;color:var(--text3);">${i}</th>`).join("")}
    </tr></thead>
    <tbody>${_.flatMap(i=>$.map(a=>{var p;const n=t[i+"_"+a];return n?`<tr style="border-bottom:1px solid var(--border);">
        <td style="padding:4px 8px;font-family:var(--mono);color:var(--text2);">${i}×${a}</td>
        <td style="padding:4px 8px;text-align:right;color:var(--text3);">${n.n_trades||"—"}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${f(n.win_rate,55,45)};">${n.win_rate??"—"}%</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${f(n.expectancy,.1,-.1)};">${n.expectancy!=null?(n.expectancy>=0?"+":"")+n.expectancy.toFixed(2):"—"}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${f(n.profit_factor,1.5,1)};">${((p=n.profit_factor)==null?void 0:p.toFixed(2))||"—"}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${f(n.median_ret,2,0)};">${n.median_ret!=null?(n.median_ret>=0?"+":"")+n.median_ret.toFixed(1)+"%":"—"}</td>
        <td style="padding:4px 8px;text-align:right;color:var(--text3);">${n.duration_median||"—"}</td>
      </tr>`:`<tr><td colspan="7" style="padding:3px 8px;color:var(--text3);">${i}×${a}: —</td></tr>`})).join("")}</tbody>
  </table></div>
</div>`}function M(t){t.innerHTML=`
<div class="mac-card" style="margin-bottom:14px;background:rgba(167,139,250,0.04);border-color:rgba(167,139,250,0.2);">
  <div style="font-size:10px;font-weight:700;color:#a78bfa;margin-bottom:8px;">⚗ Validation Run — S&P100</div>
  <div style="font-size:8px;font-family:var(--mono);color:var(--text3);margin-bottom:12px;line-height:1.7;">
    UNIVERSE: CURRENT_SP100 · SURVIVORSHIP_BIAS: TRUE · RESEARCH_STATUS: PIPELINE_VALIDATION<br>
    No usar resultados para promover reglas a producción sin validación OOS + Robustness.
  </div>

  <div style="margin-bottom:16px;">
    <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:8px;">PASO 1 — TRACE MODE (verificar PIT y fechas antes de lanzar los 100)</div>
    <div style="display:flex;gap:8px;align-items:center;">
      <input id="rlab-trace-ticker" class="mm-input" value="AAPL" style="width:90px;text-transform:uppercase;" placeholder="Ticker">
      <button id="rlab-trace-btn" class="btn btn-primary" style="font-size:10px;">▶ Trace</button>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">~10–15s</span>
    </div>
    <div id="rlab-trace-status" style="margin-top:6px;font-family:var(--mono);font-size:9px;"></div>
    <div id="rlab-trace-result" style="margin-top:6px;"></div>
  </div>

  <div style="border-top:1px solid var(--border);padding-top:14px;margin-bottom:14px;">
    <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:8px;">PASO 2 — VALIDATION RUN (7 lotes × 15 tickers · ~20 min total)</div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <input id="rlab-run-id" class="mm-input" value="sp100_v1" style="width:130px;" placeholder="run_id">
      <button id="rlab-run-all-btn" class="btn btn-primary" style="font-size:10px;">▶ Todos los lotes</button>
      <button id="rlab-run-batch-btn" class="btn" style="font-size:10px;">Lote manual</button>
      <input id="rlab-batch-start" type="number" class="mm-input" value="0" style="width:55px;" placeholder="start">
    </div>
    <div id="rlab-run-status"   style="margin-top:8px;font-family:var(--mono);font-size:9px;"></div>
    <div id="rlab-run-progress" style="font-family:var(--mono);font-size:9px;color:var(--text3);"></div>
  </div>

  <div style="border-top:1px solid var(--border);padding-top:12px;">
    <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:8px;">PASO 3 — CARGAR RESULTADOS</div>
    <button id="rlab-results-btn" class="btn" style="font-size:10px;">🔄 Leer agregados de Firestore</button>
  </div>
</div>`}function k(t){if(!t)return'<div style="color:var(--red);font-family:var(--mono);font-size:9px;">Sin respuesta del endpoint</div>';if(t.status&&t.status!=="OK"&&t.status!=="COMPLETED_WITH_EVENTS"&&t.status!=="COMPLETED_NO_EVENTS"){const o=t.fetch_diagnostic||{};return`<div style="background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.25);border-radius:6px;padding:10px;font-family:var(--mono);font-size:9px;">
      <div style="color:var(--red);font-weight:700;margin-bottom:6px;">❌ ${t.status}</div>
      <div style="color:var(--text3);line-height:1.8;">
        Ticker: ${t.ticker||"—"}<br>
        HTTP: ${o.http_status||"—"} · Raw size: ${o.raw_size||"—"}<br>
        URL: ${o.url||"—"}<br>
        Error: ${o.error||t.error||"—"}
      </div>
    </div>`}const e=t.dataset||{},r=t.filter_diagnosis||{},i=t.engine_result||{},a=r.max_conditions_ever??0,n=a>=9?"var(--green)":a>=7?"var(--amber)":"var(--red)",p=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">1. Dataset</div>
    <div style="font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.8;">
      <b style="color:var(--text1);">${e.ticker||"—"}</b> · ${e.first_date||"—"} → ${e.last_date||"—"}<br>
      ${e.n_daily||"—"} sesiones · ${e.n_weekly||"—"} semanas · ${e.n_monthly||"—"} meses<br>
      <span style="color:var(--amber);">${e.ema_note||""}</span>
    </div></div>`,x=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">2. Point-in-Time (barras cerradas)</div>
    <div style="overflow-x:auto;"><table style="border-collapse:collapse;font-size:8px;font-family:var(--mono);">
      <tr style="color:var(--text3);">${["Date","Monthly bar","Closed","Weekly bar","Closed"].map(o=>`<th style="padding:2px 6px;border-bottom:1px solid var(--border);">${o}</th>`).join("")}</tr>
      ${(t.pit_sample||[]).slice(0,8).map(o=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:2px 6px;color:var(--text2);">${o.date}</td>
        <td style="padding:2px 6px;">${o.monthly_bar_date||"—"}</td>
        <td style="padding:2px 6px;color:${o.monthly_bar_closed?"var(--green)":"var(--red)"};">${o.monthly_bar_closed?"✓ OK":"✗ OPEN"}</td>
        <td style="padding:2px 6px;">${o.weekly_bar_date||"—"}</td>
        <td style="padding:2px 6px;color:${o.weekly_bar_closed?"var(--green)":"var(--red)"};">${o.weekly_bar_closed?"✓ OK":"✗ OPEN"}</td>
      </tr>`).join("")}
    </table></div></div>`,m=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:6px;">3. BASE_FILTER — Diagnóstico</div>
    <div style="display:flex;gap:20px;margin-bottom:8px;">
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Máx condiciones</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:${n};">${a}/9</div></div>
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Días 9/9</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:${r.n_eligible_days>0?"var(--green)":"var(--amber)"};">${r.n_eligible_days??0}</div></div>
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Eventos</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;">${i.n_events??0}</div></div>
    </div>
    <div style="font-size:8px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">${r.note||""}</div>
    ${(r.near_misses_7plus||[]).length?`
    <div style="font-size:8px;font-weight:700;color:var(--text3);margin-bottom:4px;">Near-misses ≥7/9:</div>
    ${(r.near_misses_7plus||[]).slice(0,10).map(o=>{const g=["M_MACD","M_STOCH89","M_RSI14","M_STOCH8","M_MA10","W_MACD","W_STOCH89","W_RSI14","W_MA20"];return`<div style="font-family:var(--mono);font-size:8px;margin-bottom:3px;">
        <span style="color:var(--text2);">${o.date}</span>
        <span style="color:${o.n_conditions>=9?"var(--green)":"var(--amber)"};"> ${o.n_conditions}/9</span>
        · M:[${g.slice(0,5).map(s=>`<span style="color:${o.conditions[s]?"var(--green)":"var(--red)"};">${o.conditions[s]?"✓":"✗"}</span>`).join("")}]
        · W:[${g.slice(5).map(s=>`<span style="color:${o.conditions[s]?"var(--green)":"var(--red)"};">${o.conditions[s]?"✓":"✗"}</span>`).join("")}]
      </div>`}).join("")}`:'<div style="font-size:8px;color:var(--red);font-family:var(--mono);">Ningún día alcanzó 7/9 — revisar cálculo</div>'}
  </div>`,b=`<div style="background:var(--surface2);border-radius:6px;padding:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">4. Últimas sesiones — 9 condiciones individuales</div>
    <div style="overflow-x:auto;"><table style="border-collapse:collapse;font-size:7px;font-family:var(--mono);">
      <tr style="color:var(--text3);">${["Date","N","MACD_M","S89_M","RSI_M","S8_M","MA10_M","MACD_W","S89_W","RSI_W","MA20_W"].map(o=>`<th style="padding:1px 4px;border-bottom:1px solid var(--border);">${o}</th>`).join("")}</tr>
      ${(r.recent_30d_detail||[]).slice(-15).map(o=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:1px 4px;color:var(--text2);">${o.date}</td>
        <td style="padding:1px 4px;color:${o.n>=9?"var(--green)":o.n>=7?"var(--amber)":"var(--text3)"};">${o.n}</td>
        ${["M_MACD","M_STOCH89","M_RSI14","M_STOCH8","M_MA10","W_MACD","W_STOCH89","W_RSI14","W_MA20"].map(g=>`<td style="padding:1px 4px;text-align:center;color:${o[g]?"var(--green)":"var(--red)"};">${o[g]?"✓":"✗"}</td>`).join("")}
      </tr>`).join("")}
    </table></div></div>`;return p+x+m+b}export{H as render};
