export function render(el) {
  el.innerHTML = `
<div class="page-crumb">ETHAN R-Lab <span>›</span> Trading R-Lab</div>
<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px;">
  <div class="page-title" style="font-style:italic;">Trading R-Lab</div>
  <span style="font-family:var(--mono);font-size:9px;font-weight:700;padding:3px 10px;border-radius:12px;background:rgba(167,139,250,0.12);color:#a78bfa;border:1px solid rgba(167,139,250,0.25);">⚗ RESEARCH · NO PRODUCTION</span>
</div>

<div class="mm-tabs" style="margin-bottom:20px;">
  ${['overview','entry','exit','matrix','robustness','audit'].map((t,i)=>
    `<button class="mm-tab${i===0?' active':''}" data-rlab-tab="${t}">${
      ['📊 Overview','📥 Entry Lab','📤 Exit Lab','⊞ Entry × Exit','🔬 Robustness','🗂 Audit / Runs'][i]
    }</button>`
  ).join('')}
</div>

<div id="rlab-panel-overview" class="rlab-panel"></div>
<div id="rlab-panel-entry"    class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-exit"     class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-matrix"   class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-robustness" class="rlab-panel" style="display:none;"></div>
<div id="rlab-panel-audit"    class="rlab-panel" style="display:none;"></div>
`;
  initPanels(el);
}

const ENTRY_LABELS = {E0:'E0 — Immediate',E1:'E1 — EMA5W cross',E2:'E2 — MACD+RSI diario',E3:'E3 — RSI5W Pullback',E4:'E4 — RSI5D Pullback'};
const EXIT_LABELS  = {X1:'X1 — EMA10D pura',X2:'X2 — EMA10W pura'};
const ENTRY_RULES  = ['E0','E1','E2','E3','E4'];
const EXIT_RULES   = ['X1','X2'];

function initPanels(root) {
  let data = null;
  renderOverview(root.querySelector('#rlab-panel-overview'), data);
  renderAudit(root.querySelector('#rlab-panel-audit'));

  root.querySelectorAll('.mm-tab[data-rlab-tab]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      root.querySelectorAll('.mm-tab[data-rlab-tab]').forEach(b=>b.classList.remove('active'));
      root.querySelectorAll('.rlab-panel').forEach(p=>p.style.display='none');
      btn.classList.add('active');
      const panel = root.querySelector(`#rlab-panel-${btn.dataset.rlabTab}`);
      panel.style.display='block';
      renderPanel(btn.dataset.rlabTab, panel, data);
    });
  });

  root.addEventListener('click', async e=>{
    const id = e.target.id;

    if (id==='rlab-trace-btn') {
      const tk = (root.querySelector('#rlab-trace-ticker')?.value||'AAPL').toUpperCase();
      const st = root.querySelector('#rlab-trace-status');
      const rs = root.querySelector('#rlab-trace-result');
      st.innerHTML='<span style="color:var(--text3)">⏳ Trace '+tk+'...</span>';rs.innerHTML='';
      try {
        const resp = await fetch('/api/macro-history?type=rlab-trace&ticker='+tk);
        const d = await resp.json();
        console.log('[R-Lab Trace]', 'status_field='+d.status, 'dataset='+JSON.stringify(d.dataset)?.slice(0,120));
        const ok = d.status==='OK' || d.dataset?.n_daily>0;
        st.innerHTML='<span style="color:'+(ok?'var(--green)':'var(--amber)')+'">'+tk+': '+(d.status||'sin status')+'</span>';
        rs.innerHTML=renderTraceResult(d);
      }catch(err){st.innerHTML='<span style="color:var(--red)">Error: '+err.message+'</span>';}
    }

    if (id==='rlab-results-btn') {
      const st=root.querySelector('#rlab-run-status');
      st&&(st.textContent='Cargando...');
      try {
        const d=await fetch('/api/macro-history?type=results').then(r=>r.json());
        data=d;
        st&&(st.innerHTML='<span style="color:var(--green)">✓ '+d.n_trades+' trades</span>');
        renderOverview(root.querySelector('#rlab-panel-overview'),data);
        const activeTab=root.querySelector('.mm-tab[data-rlab-tab].active')?.dataset?.rlabTab;
        if(activeTab&&activeTab!=='audit'){renderPanel(activeTab,root.querySelector('#rlab-panel-'+activeTab),data);}
      }catch(err){st&&(st.innerHTML='<span style="color:var(--red)">'+err.message+'</span>');}
    }

    if (id==='rlab-run-batch-btn') {
      const start=parseInt(root.querySelector('#rlab-batch-start')?.value||'0');
      const runId=root.querySelector('#rlab-run-id')?.value||'sp100_v1';
      const st=root.querySelector('#rlab-run-status');
      st&&(st.textContent='Ejecutando lote '+start+'...');
      try{
        const d=await fetch('/api/macro-history?type=run&start='+start+'&size=15&run_id='+runId).then(r=>r.json());
        data=d; st&&(st.innerHTML='<span style="color:var(--green)">✓ Lote OK · '+d.summary?.n_trades+' trades</span>');
        renderOverview(root.querySelector('#rlab-panel-overview'),data);
      }catch(err){st&&(st.innerHTML='<span style="color:var(--red)">'+err.message+'</span>');}
    }

    if (id==='rlab-run-all-btn') {
      const runId=root.querySelector('#rlab-run-id')?.value||'sp100_v1';
      const st=root.querySelector('#rlab-run-status');
      const prog=root.querySelector('#rlab-run-progress');
      st&&(st.textContent='Lanzando 7 lotes...');
      for(let s=0;s<105;s+=15){
        prog&&(prog.textContent='Lote '+(s/15+1)+'/7 ('+s+'–'+(s+14)+')...');
        try{
          const d=await fetch('/api/macro-history?type=run&start='+s+'&size=15&run_id='+runId).then(r=>r.json());
          data=d;
        }catch(e){prog&&(prog.textContent+=' ERROR: '+e.message);}
        await new Promise(r=>setTimeout(r,500));
      }
      st&&(st.innerHTML='<span style="color:var(--green)">✓ Completado</span>');
      renderOverview(root.querySelector('#rlab-panel-overview'),data);
    }
  });
}

function renderPanel(tab,panel,data){
  if(tab==='overview')renderOverview(panel,data);
  else if(tab==='entry')renderEntry(panel,data);
  else if(tab==='exit')renderExit(panel,data);
  else if(tab==='matrix')renderMatrix(panel,data);
  else if(tab==='robustness')panel.innerHTML='<div class="mac-card" style="color:var(--text3);padding:30px;text-align:center;">Robustness (Bootstrap, Walk-Forward, Sector) — Próxima fase</div>';
  else if(tab==='audit')renderAudit(panel);
}

function col(v,pos,neg){return v==null?'var(--text3)':v>pos?'var(--green)':v<neg?'var(--red)':'var(--amber)';}
function fmt(v,dec=1,sfx=''){return v!=null?(v>=0&&sfx!='%'&&dec<3?v.toFixed(dec):v.toFixed(dec))+sfx:'—';}

function renderOverview(el,data){
  const s=data?.summary||{},aggIS=data?.aggregates_IS||{};
  el.innerHTML=`
<div class="mac-card" style="margin-bottom:14px;background:rgba(167,139,250,0.04);border-color:rgba(167,139,250,0.2);">
  <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
    <span style="font-size:10px;font-weight:700;color:#a78bfa;">BASE_FILTER_V1 · CURRENT_SP100 · 10Y</span>
    <span style="font-family:var(--mono);font-size:9px;color:var(--amber);">⚠ SURVIVORSHIP BIAS · PIPELINE VALIDATION</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
  ${[['Eligible Events',s.n_events],['Event Entries',s.n_event_entries],['Trades',s.n_trades],['Errores',s.n_errors],['Firestore',s.saved_to_firestore?'✓':'—']].map(([l,v])=>
    `<div style="background:var(--surface2);border-radius:6px;padding:10px;text-align:center;">
      <div style="font-size:8px;color:var(--text3);margin-bottom:4px;">${l}</div>
      <div style="font-family:var(--serif);font-size:20px;font-weight:600;font-style:italic;">${v??'—'}</div>
    </div>`).join('')}
  </div>
  <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:8px;">
    IS 2015–2020 · OOS 2021–presente · Close(t)→Open(t+1) · EMA(no SMA) · E2 RSI14>59
  </div>
</div>
${Object.keys(aggIS).length?`
<div class="mac-card" style="margin-bottom:14px;">
  <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:10px;">TRIGGER RATE E0–E4 · % eventos con entrada activada (IS)</div>
  ${ENTRY_RULES.map(er=>{const r=aggIS[er+'_X1']||{};const p=r.trigger_rate??0;const c=p>70?'var(--green)':p>40?'var(--amber)':'var(--red)';return`
  <div style="margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
      <span style="font-size:9px;color:var(--text2);">${ENTRY_LABELS[er]}</span>
      <span style="font-family:var(--mono);font-size:9px;color:${c};">${p}% (${r.n_triggered||'—'}/${r.n_events||'—'})</span>
    </div>
    <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;">
      <div style="height:100%;width:${Math.min(p,100)}%;background:${c};"></div>
    </div>
  </div>`;}).join('')}
</div>
${renderQuickMatrix(aggIS,'IS')}`:'<div class="mac-card" style="padding:30px;text-align:center;color:var(--text3);">Sin datos · Lanza el Validation Run desde \'Audit / Runs\'</div>'}`;
}

function renderQuickMatrix(agg,label){
  return`<div class="mac-card" style="margin-bottom:14px;">
  <div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:8px;">Entry×Exit Win Rate · ${label}</div>
  <table style="width:100%;border-collapse:collapse;font-size:9px;">
    <thead><tr style="background:var(--surface2);">
      <th style="padding:5px 8px;text-align:left;color:var(--text3);">Entrada</th>
      ${EXIT_RULES.map(xr=>`<th style="padding:5px 8px;text-align:center;color:var(--text3);">${EXIT_LABELS[xr]}</th>`).join('')}
    </tr></thead>
    <tbody>${ENTRY_RULES.map(er=>`<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:5px 8px;color:var(--text2);">${ENTRY_LABELS[er]}</td>
      ${EXIT_RULES.map(xr=>{const r=agg[er+'_'+xr];if(!r||!r.n_trades)return'<td style="padding:5px 8px;text-align:center;color:var(--text3);">—</td>';
        const c=r.win_rate>55?'var(--green)':r.win_rate>45?'var(--amber)':'var(--red)';
        return`<td style="padding:5px 8px;text-align:center;"><div style="font-family:var(--mono);font-weight:700;color:${c};">${r.win_rate}%</div><div style="font-size:8px;color:var(--text3);">(${r.expectancy>=0?'+':''}${r.expectancy}) N=${r.n_trades}</div></td>`;}).join('')}
    </tr>`).join('')}</tbody>
  </table>
</div>`;
}

function renderEntry(el,data){
  const agg=data?.aggregates_IS||{};
  el.innerHTML=`<div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:12px;">ENTRY LAB · IS 2015–2020</div>`+
  ENTRY_RULES.map(er=>{const r=agg[er+'_X1']||{};return`
  <div class="mac-card" style="margin-bottom:10px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:var(--text2);">${ENTRY_LABELS[er]}</span>
      <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">N=${r.n_trades||'—'} · Trigger=${r.trigger_rate||'—'}% · ${r.days_to_trigger_mean||'—'}d hasta entry</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
      ${[['Win Rate',r.win_rate,'%',55,45],['Expectancy',r.expectancy,'',0.1,-0.1],['PF',r.profit_factor,'',1.5,1],['Med.Ret',r.median_ret,'%',2,0],['MFE',r.mfe_mean,'%',0,-99],['Capture',r.capture_mean,'%',65,40]].map(([l,v,s,hi,lo])=>`
      <div style="background:var(--surface2);border-radius:5px;padding:8px;text-align:center;">
        <div style="font-size:8px;color:var(--text3);margin-bottom:3px;">${l}</div>
        <div style="font-family:var(--mono);font-size:11px;font-weight:700;color:${col(v,hi,lo)};">${v!=null?v.toFixed(l==='PF'?2:1)+s:'—'}</div>
      </div>`).join('')}
    </div>
  </div>`;}).join('');
}

function renderExit(el,data){
  const agg=data?.aggregates_IS||{};
  el.innerHTML=`<div style="font-size:9px;font-weight:700;color:var(--text3);margin-bottom:12px;">EXIT LAB · EMA10D vs EMA10W puras · Sin condsBroken · IS 2015–2020</div>`+
  EXIT_RULES.map(xr=>`<div class="mac-card" style="margin-bottom:10px;">
    <div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:6px;">${EXIT_LABELS[xr]}</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;font-size:9px;font-family:var(--mono);">
      ${ENTRY_RULES.map(er=>{const r=agg[er+'_'+xr]||{};return`<div style="background:var(--surface2);border-radius:5px;padding:6px;text-align:center;">
        <div style="font-size:8px;color:var(--text3);">${er}</div>
        <div style="color:${col(r.win_rate,55,45)};">${r.win_rate??'—'}%</div>
        <div style="color:var(--text3);font-size:8px;">N=${r.n_trades||'—'}</div>
      </div>`;}).join('')}
    </div>
  </div>`).join('');
}

function renderMatrix(el,data){
  const aggIS=data?.aggregates_IS||{},aggOOS=data?.aggregates_OOS||{};
  if(!Object.keys(aggIS).length){el.innerHTML='<div class="mac-card" style="padding:30px;text-align:center;color:var(--text3);">Sin datos</div>';return;}
  el.innerHTML=renderFullMatrix(aggIS,'IN-SAMPLE (2015–2020)',false)+renderFullMatrix(aggOOS,'OUT-OF-SAMPLE (2021–presente)',true)+
    '<div style="font-size:8px;color:var(--amber);font-family:var(--mono);margin-top:8px;">⚠ No elegir la "mejor combinación" solo por IS. Esperar OOS + Robustness antes de cualquier decisión de producción.</div>';
}

function renderFullMatrix(agg,label,isOOS){
  return`<div class="mac-card" style="margin-bottom:12px;${isOOS?'border-color:rgba(251,191,36,0.3);background:rgba(251,191,36,0.03);':''}">
  <div style="font-size:9px;font-weight:700;color:${isOOS?'var(--amber)':'var(--text2)'};margin-bottom:8px;">${isOOS?'🎯':'📊'} ${label}</div>
  <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:9px;">
    <thead><tr style="background:var(--surface2);">
      <th style="padding:4px 8px;text-align:left;color:var(--text3);">E×X</th>
      ${['N','Win%','Exp','PF','Med.Ret','Dur(velas)'].map(h=>`<th style="padding:4px 8px;text-align:right;color:var(--text3);">${h}</th>`).join('')}
    </tr></thead>
    <tbody>${ENTRY_RULES.flatMap(er=>EXIT_RULES.map(xr=>{const r=agg[er+'_'+xr];
      if(!r)return`<tr><td colspan="7" style="padding:3px 8px;color:var(--text3);">${er}×${xr}: —</td></tr>`;
      return`<tr style="border-bottom:1px solid var(--border);">
        <td style="padding:4px 8px;font-family:var(--mono);color:var(--text2);">${er}×${xr}</td>
        <td style="padding:4px 8px;text-align:right;color:var(--text3);">${r.n_trades||'—'}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${col(r.win_rate,55,45)};">${r.win_rate??'—'}%</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${col(r.expectancy,0.1,-0.1)};">${r.expectancy!=null?(r.expectancy>=0?'+':'')+r.expectancy.toFixed(2):'—'}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${col(r.profit_factor,1.5,1)};">${r.profit_factor?.toFixed(2)||'—'}</td>
        <td style="padding:4px 8px;text-align:right;font-family:var(--mono);color:${col(r.median_ret,2,0)};">${r.median_ret!=null?(r.median_ret>=0?'+':'')+r.median_ret.toFixed(1)+'%':'—'}</td>
        <td style="padding:4px 8px;text-align:right;color:var(--text3);">${r.duration_median||'—'}</td>
      </tr>`;
    })).join('')}</tbody>
  </table></div>
</div>`;
}

function renderAudit(el){
  el.innerHTML=`
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
</div>`;
}

function renderTraceResult(d){
  if(!d)return'<div style="color:var(--red);font-family:var(--mono);font-size:9px;">Sin respuesta del endpoint</div>';
  if(d.status&&d.status!=='OK'&&d.status!=='COMPLETED_WITH_EVENTS'&&d.status!=='COMPLETED_NO_EVENTS'){
    const fd=d.fetch_diagnostic||{};
    return`<div style="background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.25);border-radius:6px;padding:10px;font-family:var(--mono);font-size:9px;">
      <div style="color:var(--red);font-weight:700;margin-bottom:6px;">❌ ${d.status}</div>
      <div style="color:var(--text3);line-height:1.8;">
        Ticker: ${d.ticker||'—'}<br>
        HTTP: ${fd.http_status||'—'} · Raw size: ${fd.raw_size||'—'}<br>
        URL: ${fd.url||'—'}<br>
        Error: ${fd.error||d.error||'—'}
      </div>
    </div>`;
  }
  const ds=d.dataset||{},fd=d.filter_diagnosis||{},er=d.engine_result||{};
  const maxC=fd.max_conditions_ever??0;
  const maxCol=maxC>=9?'var(--green)':maxC>=7?'var(--amber)':'var(--red)';

  const dataHTML=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">1. Dataset</div>
    <div style="font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.8;">
      <b style="color:var(--text1);">${ds.ticker||'—'}</b> · ${ds.first_date||'—'} → ${ds.last_date||'—'}<br>
      ${ds.n_daily||'—'} sesiones · ${ds.n_weekly||'—'} semanas · ${ds.n_monthly||'—'} meses<br>
      <span style="color:var(--amber);">${ds.ema_note||''}</span>
    </div></div>`;

  const pitHTML=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">2. Point-in-Time (barras cerradas)</div>
    <div style="overflow-x:auto;"><table style="border-collapse:collapse;font-size:8px;font-family:var(--mono);">
      <tr style="color:var(--text3);">${['Date','Monthly bar','Closed','Weekly bar','Closed'].map(h=>`<th style="padding:2px 6px;border-bottom:1px solid var(--border);">${h}</th>`).join('')}</tr>
      ${(d.pit_sample||[]).slice(0,8).map(p=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:2px 6px;color:var(--text2);">${p.date}</td>
        <td style="padding:2px 6px;">${p.monthly_bar_date||'—'}</td>
        <td style="padding:2px 6px;color:${p.monthly_bar_closed?'var(--green)':'var(--red)'};">${p.monthly_bar_closed?'✓ OK':'✗ OPEN'}</td>
        <td style="padding:2px 6px;">${p.weekly_bar_date||'—'}</td>
        <td style="padding:2px 6px;color:${p.weekly_bar_closed?'var(--green)':'var(--red)'};">${p.weekly_bar_closed?'✓ OK':'✗ OPEN'}</td>
      </tr>`).join('')}
    </table></div></div>`;

  const diagHTML=`<div style="background:var(--surface2);border-radius:6px;padding:8px;margin-bottom:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:6px;">3. BASE_FILTER — Diagnóstico</div>
    <div style="display:flex;gap:20px;margin-bottom:8px;">
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Máx condiciones</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:${maxCol};">${maxC}/9</div></div>
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Días 9/9</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:${fd.n_eligible_days>0?'var(--green)':'var(--amber)'};">${fd.n_eligible_days??0}</div></div>
      <div style="text-align:center;"><div style="font-size:8px;color:var(--text3);">Eventos</div>
        <div style="font-family:var(--mono);font-size:24px;font-weight:700;">${er.n_events??0}</div></div>
    </div>
    <div style="font-size:8px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">${fd.note||''}</div>
    ${(fd.near_misses_7plus||[]).length?`
    <div style="font-size:8px;font-weight:700;color:var(--text3);margin-bottom:4px;">Near-misses ≥7/9:</div>
    ${(fd.near_misses_7plus||[]).slice(0,10).map(nm=>{
      const conds=['M_MACD','M_STOCH89','M_RSI14','M_STOCH8','M_MA10','W_MACD','W_STOCH89','W_RSI14','W_MA20'];
      return`<div style="font-family:var(--mono);font-size:8px;margin-bottom:3px;">
        <span style="color:var(--text2);">${nm.date}</span>
        <span style="color:${nm.n_conditions>=9?'var(--green)':'var(--amber)'};"> ${nm.n_conditions}/9</span>
        · M:[${conds.slice(0,5).map(c=>`<span style="color:${nm.conditions[c]?'var(--green)':'var(--red)'};">${nm.conditions[c]?'✓':'✗'}</span>`).join('')}]
        · W:[${conds.slice(5).map(c=>`<span style="color:${nm.conditions[c]?'var(--green)':'var(--red)'};">${nm.conditions[c]?'✓':'✗'}</span>`).join('')}]
      </div>`;}).join('')}`
    :`<div style="font-size:8px;color:var(--red);font-family:var(--mono);">Ningún día alcanzó 7/9 — revisar cálculo</div>`}
  </div>`;

  const recentHTML=`<div style="background:var(--surface2);border-radius:6px;padding:8px;">
    <div style="font-size:9px;font-weight:700;color:var(--teal);margin-bottom:4px;">4. Últimas sesiones — 9 condiciones individuales</div>
    <div style="overflow-x:auto;"><table style="border-collapse:collapse;font-size:7px;font-family:var(--mono);">
      <tr style="color:var(--text3);">${['Date','N','MACD_M','S89_M','RSI_M','S8_M','MA10_M','MACD_W','S89_W','RSI_W','MA20_W'].map(h=>`<th style="padding:1px 4px;border-bottom:1px solid var(--border);">${h}</th>`).join('')}</tr>
      ${(fd.recent_30d_detail||[]).slice(-15).map(r=>`<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:1px 4px;color:var(--text2);">${r.date}</td>
        <td style="padding:1px 4px;color:${r.n>=9?'var(--green)':r.n>=7?'var(--amber)':'var(--text3)'};">${r.n}</td>
        ${['M_MACD','M_STOCH89','M_RSI14','M_STOCH8','M_MA10','W_MACD','W_STOCH89','W_RSI14','W_MA20'].map(c=>
          `<td style="padding:1px 4px;text-align:center;color:${r[c]?'var(--green)':'var(--red)'};">${r[c]?'✓':'✗'}</td>`).join('')}
      </tr>`).join('')}
    </table></div></div>`;

  return dataHTML+pitHTML+diagHTML+recentHTML;
}

