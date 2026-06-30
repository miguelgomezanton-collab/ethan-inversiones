import{U as P}from"./userdata-C8tf_HXI.js";import"./index-DkkJmNlz.js";const T=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function V(t,l){var p,y,o,g,r;const n=l>547.5?"5y":l>200?"2y":"1y",x=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${n}`;for(const b of T)try{const a=await fetch(b(x),{signal:AbortSignal.timeout(8e3)});if(!a.ok)continue;const d=JSON.parse(await a.text()),D=(y=(p=d==null?void 0:d.chart)==null?void 0:p.result)==null?void 0:y[0];if(!D)continue;const w=(r=(g=(o=D.indicators)==null?void 0:o.quote)==null?void 0:g[0])==null?void 0:r.close,s=D.timestamp;if(!w||!s)continue;const c={};return s.forEach((e,m)=>{if(w[m]==null)return;const v=new Date(e*1e3).toISOString().slice(0,10);c[v]=w[m]}),c}catch{}return null}async function B(t){var n,x,p,y;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const o of T)try{const g=await fetch(o(l),{signal:AbortSignal.timeout(6e3)});if(!g.ok)continue;const r=JSON.parse(await g.text());return((y=(p=(x=(n=r==null?void 0:r.chart)==null?void 0:n.result)==null?void 0:x[0])==null?void 0:p.meta)==null?void 0:y.regularMarketPrice)||null}catch{}return null}const W=(t,l=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(l):"—",I=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",R=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",_=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function H(t,l){const n=[];let x=new Date(t);const p=new Date(l);for(;x<=p;)n.push(x.toISOString().slice(0,10)),x.setDate(x.getDate()+1);return n}async function U(t){if(t.length===0)return null;const l=t.reduce((a,d)=>d.entryDate<a?d.entryDate:a,t[0].entryDate),n=new Date().toISOString().slice(0,10),x=H(l,n),p=x.length,y=[...new Set(t.map(a=>a.ticker))],o={};await Promise.all(y.map(async a=>{o[a]=await V(a,p)}));const g=t.map(a=>{let d=a.shares;return(!d||d<=0)&&(a.cost&&a.entry?d=a.cost/a.entry:d=0),{...a,shares:d}}),r={};return x.map(a=>{let d=0,D=0,w=0;return g.forEach(s=>{if(s.shares<=0)return;const c=s.cost||s.shares*s.entry;s.entryDate===a&&(D+=c);const e=s.exitDate===a,m=s.entryDate<=a&&(s.exitDate?a<s.exitDate:!0);if(e){const i=o[s.ticker],$=(i==null?void 0:i[a])??r[s.ticker]??s.entry,h=s.direction==="bajista"?s.entry*s.shares+s.shares*(s.entry-$):s.shares*$;w+=h;return}if(!m)return;const v=o[s.ticker];let f=v==null?void 0:v[a];f==null&&v&&(f=r[s.ticker]??s.entry),f!=null&&(r[s.ticker]=f);const k=f??s.entry,S=s.direction==="bajista"?s.entry*s.shares+s.shares*(s.entry-k):s.shares*k;d+=S}),{day:a,value:d,cashIn:D,cashOut:w}})}function q(t){if(!t||t.length<2)return null;const l=[],n=[];for(let u=1;u<t.length;u++){const A=t[u-1].value,L=t[u].value,z=t[u].cashIn-t[u].cashOut,O=A+z;if(O>.01){const F=(L-O)/O,j=Math.abs(F)<.9;n.push({day:t[u].day,prevValue:A,todayValue:L,cashIn:t[u].cashIn,cashOut:t[u].cashOut,netFlow:z,base:O,r:F,kept:j}),j&&l.push(F)}}if(l.length<2)return{debugLog:n,insufficient:!0};const x=l.reduce((u,A)=>u+A,0)/l.length,p=Math.sqrt(l.reduce((u,A)=>u+(A-x)**2,0)/l.length);let y=100;const o=[100];l.forEach(u=>{y*=1+u,o.push(y)});const g=(y-100)/100,r=l.length,b=252/r,a=Math.pow(1+g,b)-1,d=p*Math.sqrt(252),D=d>0?a/d:0,w=l.filter(u=>u<0),s=w.length?Math.sqrt(w.reduce((u,A)=>u+A**2,0)/w.length)*Math.sqrt(252):0,c=s>0?a/s:a>0?1/0:0;let e=o[0],m=0,v=0,f=0,k=0;o.forEach((u,A)=>{u>e&&(e=u,m=A);const L=e>0?(e-u)/e:0;L>v&&(v=L,f=m,k=A)});const S=u=>{var A;return((A=t[Math.min(u,t.length-1)])==null?void 0:A.day)||t[t.length-1].day},i=S(f),$=S(k);let h=null;const M=o[f];for(let u=k;u<o.length;u++)if(o[u]>=M){h=S(u);break}const E=h?Math.round((new Date(h)-new Date(i))/864e5):null,C=v>0?a/v:a>0?1/0:0;return{totalReturn:g,annualReturn:a,annualVol:d,sharpe:D,sortino:c,calmar:C,maxDD:v,ddStart:i,ddTrough:$,recoveryDate:h,ddDurationDays:E,returns:l,nDays:r,twrSeries:o,debugLog:n}}function N(t){if(!t.length)return null;const l=t.map(i=>({...i,pct:i.pnlPct/100,pl:i.pnlAbs})),n=l.reduce((i,$)=>i+($.pl||0),0),x=l.some(i=>i.pl!=null),p=l.filter(i=>i.pct>0),y=l.filter(i=>i.pct<=0),o=p.length/l.length,g=p.length?p.reduce((i,$)=>i+$.pct,0)/p.length:0,r=y.length?Math.abs(y.reduce((i,$)=>i+$.pct,0)/y.length):0,b=o*g-(1-o)*r,a=l.map(i=>i.duration).filter(i=>i>0),d=a.length?a.reduce((i,$)=>i+$,0)/a.length:0,D=d>0?365.25/d:0,w=l.reduce((i,$)=>i.pct>$.pct?i:$),s=l.reduce((i,$)=>i.pct<$.pct?i:$),c=p.length?p.reduce((i,$)=>i+$.pct,0):0,e=y.length?Math.abs(y.reduce((i,$)=>i+$.pct,0)):0,m=e>0?c/e:c>0?1/0:0;let v=0,f=0;l.forEach(i=>{i.pct<=0?(f++,v=Math.max(v,f)):f=0});const k=r>0?g/r:null,S=k!=null?o-(1-o)/k:null;return{totalPL:n,hasAbsData:x,winRate:o,avgWinPct:g,avgLossPct:r,esperanza:b,diasMedio:d,opsAnio:D,maxWin:w,maxLoss:s,profitFactor:m,maxConsecLoss:v,kelly:S,R:k,winners:p.length,losers:y.length,total:l.length}}function K(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${t.hasAbsData?t.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${t.hasAbsData?I(t.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${t.total} operaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(t.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${t.winners}W / ${t.losers}L</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${t.esperanza>=0?"var(--green)":"var(--red)"}">${R(t.esperanza)}</div><div class="gen-mtile-sub">por operación</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${t.profitFactor===1/0?"∞":W(t.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${R(t.avgWinPct)} · AvgL: -${(t.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${R(t.maxWin.pct)}</div><div class="gen-mtile-sub">${t.maxWin.ticker} · ${t.maxWin.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${R(t.maxLoss.pct)}</div><div class="gen-mtile-sub">${t.maxLoss.ticker} · ${t.maxLoss.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${t.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Kelly Óptimo</div><div class="gen-mtile-val" style="color:${t.kelly!=null&&t.kelly>0?"var(--green)":"var(--text3)"}">${t.kelly!=null?(t.kelly*100).toFixed(1)+"%":"—"}</div><div class="gen-mtile-sub">% capital/op recomendado</div></div>
    </div>`:'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>'}function G(t){return!t||!t.debugLog?"":`
    <details class="gen-debug-panel" style="margin-top:14px;">
      <summary style="cursor:pointer;font-size:10px;color:var(--text3);font-family:var(--mono);">🔍 Diagnóstico: 15 días con mayor impacto en el cálculo (clic para expandir)</summary>
      <table class="sc2-table" style="margin-top:10px;">
        <thead><tr><th>FECHA</th><th>VALOR AYER</th><th>VALOR HOY</th><th>CASH IN</th><th>CASH OUT</th><th>BASE</th><th>RETORNO</th><th>USADO</th></tr></thead>
        <tbody>
          ${[...t.debugLog].sort((n,x)=>Math.abs(x.r)-Math.abs(n.r)).slice(0,15).map(n=>`
            <tr style="${n.kept?"":"opacity:0.4;"}">
              <td style="font-family:var(--mono);font-size:10px;">${_(n.day)}</td>
              <td class="sc2-price">$${n.prevValue.toFixed(0)}</td>
              <td class="sc2-price">$${n.todayValue.toFixed(0)}</td>
              <td class="sc2-price" style="color:var(--teal)">${n.cashIn>0?"$"+n.cashIn.toFixed(0):"—"}</td>
              <td class="sc2-price" style="color:var(--amber)">${n.cashOut>0?"$"+n.cashOut.toFixed(0):"—"}</td>
              <td class="sc2-price">$${n.base.toFixed(0)}</td>
              <td class="sc2-score" style="color:${n.r>=0?"var(--green)":"var(--red)"}">${(n.r*100).toFixed(1)}%</td>
              <td style="font-size:10px;color:${n.kept?"var(--green)":"var(--red)"}">${n.kept?"✓ sí":"✗ filtrado"}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </details>`}function J(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const l=t.map(s=>s*100),n=Math.min(...l),x=Math.max(...l),p=12,y=(x-n)/p||1,o=new Array(p).fill(0);l.forEach(s=>{let c=Math.floor((s-n)/y);c>=p&&(c=p-1),c<0&&(c=0),o[c]++});const g=900,r=200,b=24,a=Math.max(...o,1),d=(g-b*2)/p,D=o.map((s,c)=>{const e=s/a*(r-b*2),m=b+c*d,v=r-b-e,k=n+c*y>=0?"#4ade80":"#f47174";return`<rect x="${m+1}" y="${v}" width="${d-2}" height="${e}" fill="${k}" opacity="0.7"/>`}).join(""),w=b+(0-n)/(x-n||1)*(g-b*2);return`<svg viewBox="0 0 ${g} ${r}" style="width:100%;height:${r}px;">
    ${D}
    <line x1="${w}" y1="${b}" x2="${w}" y2="${r-b}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${n.toFixed(1)}%</span><span>0%</span><span>${x.toFixed(1)}%</span>
  </div>`}function X(t,l){const n=["Win Rate","Esperanza","Profit Factor","Kelly"],x=c=>c?[c.winRate,Math.max(0,Math.min(1,c.esperanza+.3)),Math.min((c.profitFactor===1/0?3:c.profitFactor)/3,1),Math.max(0,Math.min(1,(c.kelly||0)+.3))]:[0,0,0,0],p=x(t),y=x(l),o=150,g=150,r=110,b=4,a=(c,e)=>{const m=Math.PI*2*e/b-Math.PI/2,v=r*Math.max(0,Math.min(1,c));return`${o+v*Math.cos(m)},${g+v*Math.sin(m)}`},d=p.map((c,e)=>a(c,e)).join(" "),D=y.map((c,e)=>a(c,e)).join(" "),w=Array.from({length:b}).map((c,e)=>{const m=Math.PI*2*e/b-Math.PI/2;return`<line x1="${o}" y1="${g}" x2="${o+r*Math.cos(m)}" y2="${g+r*Math.sin(m)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),s=n.map((c,e)=>{const m=Math.PI*2*e/b-Math.PI/2,v=o+(r+22)*Math.cos(m),f=g+(r+22)*Math.sin(m);return`<text x="${v}" y="${f}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${c}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${o}" cy="${g}" r="${r}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${o}" cy="${g}" r="${r*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${w}
    <polygon points="${d}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${D}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${s}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function Z(t,{actionsSlot:l}){var p;l.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function n(){const y=document.getElementById("gen-content");y.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[o,g,r,b,a,d]=await Promise.all([P.get("ethan_positions").then(e=>e||[]),P.get("ethan_positions_history").then(e=>e||[]),P.get("ethan_capital_alcista"),P.get("ethan_capital_bajista"),P.get("ethan_satelite_assets").then(e=>e||[]),P.get("ethan_core_pct")]),D={};await Promise.all(o.map(async e=>{D[e.ticker]=await B(e.ticker)}));const w=[...o.filter(e=>e.entryDate).map(e=>({ticker:e.ticker,direction:e.direction||"alcista",entry:e.entry,shares:e.shares,cost:e.cost,entryDate:e.entryDate,exitDate:null})),...g.filter(e=>e.entryDateISO).map(e=>({ticker:e.ticker,direction:e.direction||"alcista",entry:e.entry,shares:e.shares,cost:e.cost,entryDate:e.entryDateISO,exitDate:e.exitDateISO}))];let s=null,c=null;w.length>0&&(s=await U(w),c=q(s)),x(o,g,r,b,a,d,D,s,c)}function x(y,o,g,r,b,a,d,D,w){const s=document.getElementById("gen-content"),c=o.filter(h=>(h.direction||"alcista")==="alcista"),e=o.filter(h=>h.direction==="bajista"),m=N(c),v=N(e),f=N(o),k=(g||0)+(r||0);let S=0,i=0,$=0;y.forEach(h=>{const M=d[h.ticker],E=h.shares&&M?h.shares*M:h.cost||0;if((h.direction||"alcista")==="alcista"?S+=E:i+=E,M&&h.entry){const C=h.direction==="bajista"?(h.entry-M)/h.entry*100:(M-h.entry)/h.entry*100;h.cost&&($+=h.cost*C/100)}}),s.innerHTML=`
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${K(f)}

      <!-- NAV REAL — EN REVISIÓN -->
      <div class="gen-section-title" style="margin-top:24px;">📈 Rendimiento Real (Time-Weighted) — Marcado a Mercado</div>
      <div class="gen-wip-notice">
        🚧 <strong>Esta sección está temporalmente desactivada.</strong> El cálculo del NAV diario marcado a mercado todavía tiene una inconsistencia sin resolver (se está revisando) y los números no son fiables. El resto de métricas de esta página (KPIs por operación, comparativa Alcista/Bajista, exposición actual, composición) no se ven afectadas y siguen siendo correctas.
      </div>
      ${w&&w.debugLog?G(w):""}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${f?`
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${J(o.map(h=>h.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${X(m,v)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${m&&m.hasAbsData?I(m.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${v&&v.hasAbsData?I(v.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${f&&f.totalPL>=0?"var(--green)":"var(--red)"}">${f&&f.hasAbsData?I(f.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${f&&f.esperanza>=0?"var(--green)":"var(--red)"}">${f?R(f.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(m==null?void 0:m.kelly)!=null?(m.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(v==null?void 0:v.kelly)!=null?(v.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${k>0?I(k):"—"}</div><div class="gen-hero-sub">Alcista ${I(g||0)} · Bajista ${I(r||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${$>=0?"var(--green)":"var(--red)"}">${($>=0?"+":"")+I($)}</div><div class="gen-hero-sub">${y.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${I(S)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${I(i)}</div></div>
      </div>

      <!-- COMPOSICIÓN ASSET ALLOCATION -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${a||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(a||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${a||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(a||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${b.length>0?b.map(h=>`<span class="rf-custom-chip">${typeof h=="string"?h:h.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(p=document.getElementById("gen-refresh-btn"))==null||p.addEventListener("click",n),n(),{destroy(){}}}export{Z as render};
