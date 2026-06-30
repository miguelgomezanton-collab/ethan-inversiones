import{U as B}from"./userdata-CKzH1I_M.js";import"./index-BC0lXU28.js";const X=[e=>`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,e=>`https://corsproxy.io/?${encodeURIComponent(e)}`,e=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(e)}`,e=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(e)}`];async function K(e){var b,g,c,$;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${e}?interval=1d&range=5d`;for(const x of X)try{const h=await fetch(x(i),{signal:AbortSignal.timeout(6e3)});if(!h.ok)continue;const o=JSON.parse(await h.text());return(($=(c=(g=(b=o==null?void 0:o.chart)==null?void 0:b.result)==null?void 0:g[0])==null?void 0:c.meta)==null?void 0:$.regularMarketPrice)||null}catch{}return null}const C=(e,i=2)=>e!=null&&!isNaN(e)?e.toFixed(i):"—",E=e=>e!=null&&!isNaN(e)?"$"+e.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",L=e=>e!=null&&!isNaN(e)?(e>=0?"+":"")+(e*100).toFixed(2)+"%":"—",W=e=>e!=null&&!isNaN(e)?e>=1e3?"$"+(e/1e3).toFixed(1)+"k":E(e):"—";function G(e){if(!e.length)return null;const i=e.map(t=>({...t,pct:t.pnlPct/100,pl:t.pnlAbs})),b=i.reduce((t,r)=>t+(r.pl||0),0),g=i.some(t=>t.pl!=null),c=i.filter(t=>t.pct>0),$=i.filter(t=>t.pct<=0),x=c.length/i.length,h=c.length?c.reduce((t,r)=>t+r.pct,0)/c.length:0,o=$.length?Math.abs($.reduce((t,r)=>t+r.pct,0)/$.length):0,d=x*h-(1-x)*o,p=i.map(t=>t.pct),m=p.reduce((t,r)=>t+r,0)/p.length,y=Math.sqrt(p.reduce((t,r)=>t+(r-m)**2,0)/p.length),w=y>0?m/y:0,u=i.map(t=>t.duration).filter(t=>t>0),l=u.length?u.reduce((t,r)=>t+r,0)/u.length:0,n=l>0?365.25/l:0,f=i.reduce((t,r)=>t.pct>r.pct?t:r),v=i.reduce((t,r)=>t.pct<r.pct?t:r),P=c.length?c.reduce((t,r)=>t+r.pct,0):0,I=$.length?Math.abs($.reduce((t,r)=>t+r.pct,0)):0,a=I>0?P/I:P>0?1/0:0;let R=0,j=0;return i.forEach(t=>{t.pct<=0?(j++,R=Math.max(R,j)):j=0}),{totalPL:b,hasAbsData:g,winRate:x,avgWinPct:h,avgLossPct:o,esperanza:d,sharpe:w,diasMedio:l,opsAnio:n,maxWin:f,maxLoss:v,profitFactor:a,maxConsecLoss:R,winners:c.length,losers:$.length,total:i.length,stdRent:y,rentMedia:m}}function J(e,i){return e?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${e.hasAbsData?e.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${e.hasAbsData?E(e.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${e.total} operaciones</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(e.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${e.winners}W / ${e.losers}L</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Rent. Media/Op</div><div class="gen-mtile-val" style="color:${e.rentMedia>=0?"var(--green)":"var(--red)"}">${L(e.rentMedia)}</div><div class="gen-mtile-sub">${C(e.diasMedio,0)}d · ${C(e.opsAnio,1)} ops/año</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${e.esperanza>=0?"var(--green)":"var(--red)"}">${L(e.esperanza)}</div><div class="gen-mtile-sub">Sharpe: ${C(e.sharpe)}</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${e.profitFactor===1/0?"∞":C(e.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${L(e.avgWinPct)} · AvgL: -${(e.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${L(e.maxWin.pct)}</div><div class="gen-mtile-sub">${e.maxWin.ticker} · ${e.maxWin.duration}d</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${L(e.maxLoss.pct)}</div><div class="gen-mtile-sub">${e.maxLoss.ticker} · ${e.maxLoss.duration}d</div></div>
      <div class="gen-mtile ${i}"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${e.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
    </div>`:'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>'}function Q(e,i=1){if(e.length<2)return'<div class="sc2-empty" style="padding:30px;">Necesitas al menos 2 operaciones</div>';const b=900,g=220,c=24,$=Math.min(...e,0),h=Math.max(...e,0)-$||1,o=(b-c*2)/(e.length-1),d=e.map((w,u)=>`${c+u*o},${g-c-(w-$)/h*(g-c*2)}`).join(" "),p=g-c-(0-$)/h*(g-c*2),m=e[e.length-1],y=m>=0?"#4ade80":"#f47174";return`<svg viewBox="0 0 ${b} ${g}" style="width:100%;height:${g}px;">
    <line x1="${c}" y1="${p}" x2="${b-c}" y2="${p}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polyline points="${d}" fill="none" stroke="${y}" stroke-width="2"/>
    <circle cx="${c+(e.length-1)*o}" cy="${g-c-(m-$)/h*(g-c*2)}" r="4" fill="${y}"/>
  </svg>`}function Z(e,i,b,g){const h=[...e,...i,...b],o=Math.min(...h),p=Math.max(...h)-o||1,m=840/(g-1),y=w=>w.map((u,l)=>`${30+l*m},${230-(u-o)/p*200}`).join(" ");return`<svg viewBox="0 0 900 260" style="width:100%;height:260px;">
    <polyline points="${y(i)}" fill="none" stroke="#5fa8e0" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
    <polyline points="${y(b)}" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
    <polyline points="${y(e)}" fill="none" stroke="#40d9c0" stroke-width="2.5"/>
    <circle cx="${30+(g-1)*m}" cy="${230-(e[e.length-1]-o)/p*200}" r="4" fill="#40d9c0"/>
  </svg>
  <div style="display:flex;gap:16px;margin-top:8px;font-size:9px;font-family:var(--mono);">
    <span style="color:#40d9c0;">■ Riesgo actual</span>
    <span style="color:#5fa8e0;">■ Riesgo mitad</span>
    <span style="color:#fbbf24;">■ Riesgo doble</span>
  </div>`}function ee(e,i){const b=["Win Rate","Rent. Media","Esperanza","Sharpe","Profit Factor"],g=l=>l?[l.winRate,Math.max(0,l.rentMedia+.5)/1,Math.max(0,l.esperanza+.5)/1,Math.max(0,(l.sharpe+1)/3),Math.min((l.profitFactor===1/0?3:l.profitFactor)/3,1)]:[0,0,0,0,0],c=g(e),$=g(i),x=150,h=150,o=110,d=5,p=(l,n)=>{const f=Math.PI*2*n/d-Math.PI/2,v=o*Math.max(0,Math.min(1,l));return`${x+v*Math.cos(f)},${h+v*Math.sin(f)}`},m=c.map((l,n)=>p(l,n)).join(" "),y=$.map((l,n)=>p(l,n)).join(" "),w=Array.from({length:d}).map((l,n)=>{const f=Math.PI*2*n/d-Math.PI/2;return`<line x1="${x}" y1="${h}" x2="${x+o*Math.cos(f)}" y2="${h+o*Math.sin(f)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),u=b.map((l,n)=>{const f=Math.PI*2*n/d-Math.PI/2,v=x+(o+22)*Math.cos(f),P=h+(o+22)*Math.sin(f);return`<text x="${v}" y="${P}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${l}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:340px;height:auto;display:block;margin:0 auto;">
    <circle cx="${x}" cy="${h}" r="${o}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${x}" cy="${h}" r="${o*.66}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    <circle cx="${x}" cy="${h}" r="${o*.33}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${w}
    <polygon points="${m}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${y}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${u}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function ie(e,{actionsSlot:i}){var h;i.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',e.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';let b=.01,g=.1;async function c(){const o=document.getElementById("gen-content");o.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Calculando métricas de cartera...</div></div>';const[d,p,m,y,w,u]=await Promise.all([B.get("ethan_positions").then(n=>n||[]),B.get("ethan_positions_history").then(n=>n||[]),B.get("ethan_capital_alcista"),B.get("ethan_capital_bajista"),B.get("ethan_satelite_assets").then(n=>n||[]),B.get("ethan_core_pct")]),l={};await Promise.all(d.map(async n=>{l[n.ticker]=await K(n.ticker)})),$(d,p,m,y,w,u,l)}function $(o,d,p,m,y,w,u){var O;const l=document.getElementById("gen-content"),n=d.filter(s=>(s.direction||"alcista")==="alcista"),f=d.filter(s=>s.direction==="bajista"),v=[...d].sort((s,A)=>(s.closedAt||0)-(A.closedAt||0)),P=G(n),I=G(f),a=G(v),R=(p||0)+(m||0);let j=0,t=0,r=0;o.forEach(s=>{const A=u[s.ticker],N=s.shares&&A?s.shares*A:s.cost||0;if((s.direction||"alcista")==="alcista"?j+=N:t+=N,A&&s.entry){const H=s.direction==="bajista"?(s.entry-A)/s.entry*100:(A-s.entry)/s.entry*100;s.cost&&(r+=s.cost*H/100)}});let z=[];if(a&&a.hasAbsData){let s=0;v.forEach(A=>{s+=A.pnlAbs||0,z.push(s)})}else{let s=100;v.forEach(A=>{s*=1+A.pnlPct/100,z.push(s)})}l.innerHTML=`
      <!-- KPIs GENERALES -->
      ${J(a,"gen")}

      <!-- COMPARATIVA + EQUITY -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${ee(P,I)}</div>
        <div class="gen-chart-box"><div class="gen-chart-title">Equity Curve Combinada</div>${Q(z)}</div>
      </div>

      <!-- RATIO CARDS -->
      <div class="gen-ratio-grid">
        <div class="gen-ratio-card">
          <div class="gen-chart-title">📊 Ratios Rentabilidad</div>
          ${a?`
            <div class="gen-ratio-row"><span>Rent. Media/Op</span><strong>${L(a.rentMedia)}</strong></div>
            <div class="gen-ratio-row"><span>Días Medios</span><strong>${C(a.diasMedio,1)}</strong></div>
            <div class="gen-ratio-row"><span>Ops/Año</span><strong>${C(a.opsAnio,1)}</strong></div>
            <div class="gen-ratio-row"><span>Desv. Estándar</span><strong>${L(a.stdRent)}</strong></div>
          `:'<div class="sc2-empty">Sin datos</div>'}
        </div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">⚖️ Ratios Riesgo</div>
          ${a?`
            <div class="gen-ratio-row"><span>Win Rate</span><strong>${(a.winRate*100).toFixed(1)}%</strong></div>
            <div class="gen-ratio-row"><span>Profit Factor</span><strong>${a.profitFactor===1/0?"∞":C(a.profitFactor)}</strong></div>
            <div class="gen-ratio-row"><span>Sharpe</span><strong>${C(a.sharpe)}</strong></div>
            <div class="gen-ratio-row"><span>Máx Rachas Perd.</span><strong style="color:var(--red)">${a.maxConsecLoss}</strong></div>
          `:'<div class="sc2-empty">Sin datos</div>'}
        </div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${P&&P.hasAbsData?E(P.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${I&&I.hasAbsData?E(I.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${a&&a.totalPL>=0?"var(--green)":"var(--red)"}">${a&&a.hasAbsData?E(a.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza</span><strong style="color:${a&&a.esperanza>=0?"var(--green)":"var(--red)"}">${a?L(a.esperanza):"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${R>0?E(R):"—"}</div><div class="gen-hero-sub">Alcista ${E(p||0)} · Bajista ${E(m||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${r>=0?"var(--green)":"var(--red)"}">${(r>=0?"+":"")+E(r)}</div><div class="gen-hero-sub">${o.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${E(j)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${E(t)}</div></div>
      </div>

      <!-- CONFIGURACIÓN DE PROYECCIÓN -->
      <div class="gen-section-title" style="margin-top:24px;">🚀 Configuración de Proyección</div>
      <div class="pos-capital-row" style="margin-bottom:16px;flex-wrap:wrap;">
        <label>Capital Inicial (€)</label>
        <input type="number" id="proj-capital" class="wl-input" style="width:140px;" value="${R||1e4}">
        <label style="margin-left:16px;">Riesgo por Operación (%)</label>
        <input type="number" id="proj-risk" class="wl-input" style="width:90px;" value="1" step="0.25" min="0.25" max="5">
        <label style="margin-left:16px;">DD Máx. Tolerable (%)</label>
        <input type="number" id="proj-dd" class="wl-input" style="width:90px;" value="10" step="1" min="5" max="30">
        <button class="btn btn-primary" id="proj-recalc-btn" style="margin-left:10px;">Recalcular</button>
      </div>

      <div id="gen-projections"></div>
    `,(O=document.getElementById("proj-recalc-btn"))==null||O.addEventListener("click",()=>{const s=parseFloat(document.getElementById("proj-capital").value)||1e4;b=(parseFloat(document.getElementById("proj-risk").value)||1)/100,g=(parseFloat(document.getElementById("proj-dd").value)||10)/100,x(a,s,b,g)}),x(a,R||1e4,b,g);const S=document.createElement("div");S.innerHTML=`
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${w||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(w||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${w||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(w||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${y.length>0?y.map(s=>`<span class="rf-custom-chip">${typeof s=="string"?s:s.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>
      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `,l.appendChild(S)}function x(o,d,p,m){const y=document.getElementById("gen-projections");if(!y)return;if(!o){y.innerHTML='<div class="sc2-empty">Necesitas operaciones cerradas para proyectar (cierra posiciones en el módulo Cartera)</div>';return}const{rentMedia:w,opsAnio:u,diasMedio:l,winRate:n,avgWinPct:f,avgLossPct:v}=o,P=v>0?Math.min(p/v,1):0,I=f*P,a=v*P,R=n*I-(1-n)*a,j=Math.round(u*5),t=d*Math.pow(1+R,Math.round(u)),r=d*Math.pow(1+R,j);let z="";for(let M=1;M<=5;M++){const k=d*Math.pow(1+R,Math.round(u*M)),F=Math.min(k/Math.max(r,d*1.01)*100,100);z+=`<div class="proj-row"><span class="proj-year">Año ${M}</span><div class="proj-bar-track"><div class="proj-bar-fill" style="width:${F}%"></div></div><span class="proj-val">${W(k)}</span></div>`}const _=61,S=M=>Array.from({length:_},(k,F)=>d*Math.pow(1+M,Math.round(u*F/12))),O=v>0?Math.min(p/2/v,1):0,s=v>0?Math.min(p*2/v,1):0,A=n*f*O-(1-n)*v*O,N=n*f*s-(1-n)*v*s,H=1-n;let Y="";for(let M=2;M<=10;M++){const k=Math.pow(H,M),F=(1-Math.pow(1-a,M))*100,U=(1-Math.pow(1-k,100))*100,D=F>m*100;Y+=`<div class="gen-dd-row ${D?"exceeds":""}"><span>${M} pérdidas seguidas</span><span class="gen-dd-val">DD: <strong style="color:${D?"var(--red)":"var(--amber)"}">${F.toFixed(1)}%</strong>${D?" ⚠️":""} · P(100 ops): ${U.toFixed(1)}%</span></div>`}const T=a>0?Math.log(1-m)/Math.log(1-a):1/0,q=T>8?'<span style="color:var(--green)">✅ Muy seguro</span>':T>5?'<span style="color:var(--amber)">⚠️ Moderado</span>':'<span style="color:var(--red)">🔴 Peligroso</span>',V=[{name:"Conservador",mult:.5,desc:"Mitad riesgo",color:"var(--amber)"},{name:"Base (actual)",mult:1,desc:`Riesgo ${(p*100).toFixed(1)}%`,color:"var(--teal)"},{name:"Agresivo",mult:2,desc:"Doble riesgo",color:"var(--red)"}].map(M=>{const k=v>0?Math.min(p*M.mult/v,1):0,F=n*f*k-(1-n)*v*k,U=d*Math.pow(1+F,j),D=v*k>0?Math.floor(Math.log(1-m)/Math.log(1-v*k)):1/0;return`
        <div class="gen-scenario-card">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <strong style="color:${M.color};font-size:11px;">${M.name}</strong>
            <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${M.desc}</span>
          </div>
          <div class="gen-scenario-grid">
            <div>Impacto/op: <strong>${L(F)}</strong></div>
            <div>Capital 5Y: <strong>${W(U)}</strong></div>
            <div>DD/pérdida: <strong style="color:var(--red)">${(v*k*100).toFixed(2)}%</strong></div>
            <div>Pérdidas→DD: <strong style="color:${D>8?"var(--green)":D>5?"var(--amber)":"var(--red)"}">${isFinite(D)?D:"∞"}</strong></div>
          </div>
        </div>`}).join("");y.innerHTML=`
      <div class="gen-hero" style="margin-bottom:18px;">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Inicial</div><div class="gen-hero-value">${E(d)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Rent. Histórica/Op</div><div class="gen-hero-value" style="color:var(--blue)">${L(w)}</div><div class="gen-hero-sub">${C(l,0)}d · ${C(u,1)} ops/año</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Sizing</div><div class="gen-hero-value" style="color:var(--amber)">${(P*100).toFixed(1)}%</div><div class="gen-hero-sub">Riesgo ${(p*100).toFixed(1)}%</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Impacto Real/Op</div><div class="gen-hero-value" style="color:${R>=0?"var(--green)":"var(--red)"}">${L(R)}</div><div class="gen-hero-sub">Esperanza × Sizing</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Proyección 1Y</div><div class="gen-hero-value" style="color:var(--green)">${W(t)}</div><div class="gen-hero-sub">×${(t/d).toFixed(2)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Proyección 5Y</div><div class="gen-hero-value" style="color:var(--green)">${W(r)}</div><div class="gen-hero-sub">×${(r/d).toFixed(2)}</div></div>
      </div>

      <div class="gen-compare-grid">
        <div class="gen-chart-box">
          <div class="gen-chart-title">Proyección por Año (5Y)</div>
          <p class="gen-chart-desc">Basado en rentabilidad media × sizing actual, con reinversión compuesta.</p>
          <div class="gen-proj-table">${z}</div>
        </div>
        <div class="gen-chart-box">
          <div class="gen-chart-title">Curva de Crecimiento (60 meses)</div>
          ${Z(S(R),S(A),S(N),_)}
        </div>
      </div>

      <div class="gen-compare-grid" style="margin-top:18px;">
        <div class="gen-chart-box">
          <div class="gen-chart-title">📉 Drawdown Esperado</div>
          <p class="gen-chart-desc">Según tu win rate, sizing y rachas perdedoras probables.</p>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:11px;color:var(--text2);">
            Cada pérdida: <strong style="color:var(--red)">-${(a*100).toFixed(2)}%</strong> en cuenta
          </div>
          ${Y}
          <div class="gen-dd-summary">
            <strong style="color:var(--teal)">Con tu sizing:</strong> <strong>${isFinite(T)?Math.floor(T):"∞"} pérdidas consecutivas</strong> hasta DD máx ${(m*100).toFixed(0)}%. ${q}
          </div>
        </div>
        <div class="gen-chart-box">
          <div class="gen-chart-title">🎯 Escenarios</div>
          ${V}
        </div>
      </div>
    `}return(h=document.getElementById("gen-refresh-btn"))==null||h.addEventListener("click",c),c(),{destroy(){}}}export{ie as render};
