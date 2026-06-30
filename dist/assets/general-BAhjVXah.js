import{U as S}from"./userdata-BhiQW5_g.js";import"./index-D7_8-KQu.js";const C=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function O(t,g){var n,p,c,v,d;const a=g>547.5?"5y":g>200?"2y":"1y",i=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${a}`;for(const l of C)try{const u=await fetch(l(i),{signal:AbortSignal.timeout(8e3)});if(!u.ok)continue;const r=JSON.parse(await u.text()),$=(p=(n=r==null?void 0:r.chart)==null?void 0:n.result)==null?void 0:p[0];if(!$)continue;const f=(d=(v=(c=$.indicators)==null?void 0:c.quote)==null?void 0:v[0])==null?void 0:d.close,m=$.timestamp;if(!f||!m)continue;const o={};return m.forEach((s,y)=>{if(f[y]==null)return;const b=new Date(s*1e3).toISOString().slice(0,10);o[b]=f[y]}),o}catch{}return null}async function z(t){var a,i,n,p;const g=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const c of C)try{const v=await fetch(c(g),{signal:AbortSignal.timeout(6e3)});if(!v.ok)continue;const d=JSON.parse(await v.text());return((p=(n=(i=(a=d==null?void 0:d.chart)==null?void 0:a.result)==null?void 0:i[0])==null?void 0:n.meta)==null?void 0:p.regularMarketPrice)||null}catch{}return null}const P=(t,g=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(g):"—",k=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",M=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",L=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function j(t,g){const a=[];let i=new Date(t);const n=new Date(g);for(;i<=n;)a.push(i.toISOString().slice(0,10)),i.setDate(i.getDate()+1);return a}async function B(t){if(t.length===0)return null;const g=t.reduce((l,u)=>u.entryDate<l?u.entryDate:l,t[0].entryDate),a=new Date().toISOString().slice(0,10),i=j(g,a),n=i.length,p=[...new Set(t.map(l=>l.ticker))],c={};await Promise.all(p.map(async l=>{c[l]=await O(l,n)}));const v={};return i.map(l=>{let u=0;return t.forEach(r=>{if(!r.exitDate||r.exitDate>=l,!(r.entryDate<=l&&(r.exitDate?l<=r.exitDate:!0)))return;const f=c[r.ticker];let m=f==null?void 0:f[l];m==null&&f&&(m=v[r.ticker]??r.entry),m!=null&&(v[r.ticker]=m);const o=m??r.entry,s=r.shares||(r.cost&&r.entry?r.cost/r.entry:0),y=r.direction==="bajista"?r.entry*s+s*(r.entry-o):s*o;u+=y}),{day:l,value:u}})}function F(t,g){if(!t||t.length<2)return null;const a=t.map(e=>e.value).filter(e=>e>0);if(a.length<2)return null;const i=[];for(let e=1;e<a.length;e++)a[e-1]>0&&i.push((a[e]-a[e-1])/a[e-1]);if(i.length===0)return null;const n=i.reduce((e,h)=>e+h,0)/i.length,p=Math.sqrt(i.reduce((e,h)=>e+(h-n)**2,0)/i.length),c=Math.pow(1+n,252)-1,v=p*Math.sqrt(252),d=v>0?c/v:0,l=i.filter(e=>e<0),u=l.length?Math.sqrt(l.reduce((e,h)=>e+h**2,0)/l.length)*Math.sqrt(252):0,r=u>0?c/u:0;let $=a[0],f=0,m=t[0].day;t[0].day;let o=t[0].day,s=0;a.forEach((e,h)=>{e>$&&($=e,s=h);const x=$>0?($-e)/$:0;x>f&&(f=x,m=t[s].day,o=t[h].day)});let y=null;const b=a[t.findIndex(e=>e.day===m)];for(let e=t.findIndex(h=>h.day===o);e<a.length;e++)if(a[e]>=b){y=t[e].day;break}const D=y?Math.round((new Date(y)-new Date(m))/864e5):null,w=f>0?c/f:0,A=a[0]>0?(a[a.length-1]-a[0])/a[0]:0;return{startValue:a[0],endValue:a[a.length-1],totalReturn:A,annualReturn:c,annualVol:v,sharpe:d,sortino:r,calmar:w,maxDD:f,ddStart:m,ddTrough:o,recoveryDate:y,ddDurationDays:D,returns:i,nDays:a.length}}function I(t){if(!t.length)return null;const g=t.map(e=>({...e,pct:e.pnlPct/100,pl:e.pnlAbs})),a=g.reduce((e,h)=>e+(h.pl||0),0),i=g.some(e=>e.pl!=null),n=g.filter(e=>e.pct>0),p=g.filter(e=>e.pct<=0),c=n.length/g.length,v=n.length?n.reduce((e,h)=>e+h.pct,0)/n.length:0,d=p.length?Math.abs(p.reduce((e,h)=>e+h.pct,0)/p.length):0,l=c*v-(1-c)*d,u=g.map(e=>e.duration).filter(e=>e>0),r=u.length?u.reduce((e,h)=>e+h,0)/u.length:0,$=r>0?365.25/r:0,f=g.reduce((e,h)=>e.pct>h.pct?e:h),m=g.reduce((e,h)=>e.pct<h.pct?e:h),o=n.length?n.reduce((e,h)=>e+h.pct,0):0,s=p.length?Math.abs(p.reduce((e,h)=>e+h.pct,0)):0,y=s>0?o/s:o>0?1/0:0;let b=0,D=0;g.forEach(e=>{e.pct<=0?(D++,b=Math.max(b,D)):D=0});const w=d>0?v/d:null,A=w!=null?c-(1-c)/w:null;return{totalPL:a,hasAbsData:i,winRate:c,avgWinPct:v,avgLossPct:d,esperanza:l,diasMedio:r,opsAnio:$,maxWin:f,maxLoss:m,profitFactor:y,maxConsecLoss:b,kelly:A,R:w,winners:n.length,losers:p.length,total:g.length}}function V(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${t.hasAbsData?t.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${t.hasAbsData?k(t.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${t.total} operaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(t.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${t.winners}W / ${t.losers}L</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${t.esperanza>=0?"var(--green)":"var(--red)"}">${M(t.esperanza)}</div><div class="gen-mtile-sub">por operación</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${t.profitFactor===1/0?"∞":P(t.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${M(t.avgWinPct)} · AvgL: -${(t.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${M(t.maxWin.pct)}</div><div class="gen-mtile-sub">${t.maxWin.ticker} · ${t.maxWin.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${M(t.maxLoss.pct)}</div><div class="gen-mtile-sub">${t.maxLoss.ticker} · ${t.maxLoss.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${t.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Kelly Óptimo</div><div class="gen-mtile-val" style="color:${t.kelly!=null&&t.kelly>0?"var(--green)":"var(--text3)"}">${t.kelly!=null?(t.kelly*100).toFixed(1)+"%":"—"}</div><div class="gen-mtile-sub">% capital/op recomendado</div></div>
    </div>`:'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>'}function T(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Total</div><div class="gen-mtile-val" style="color:${t.totalReturn>=0?"var(--green)":"var(--red)"}">${M(t.totalReturn)}</div><div class="gen-mtile-sub">${t.nDays} días</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Anualizado</div><div class="gen-mtile-val" style="color:${t.annualReturn>=0?"var(--green)":"var(--red)"}">${M(t.annualReturn)}</div><div class="gen-mtile-sub">CAGR estimado</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Anualizada</div><div class="gen-mtile-val">${P(t.annualVol*100,1)}%</div><div class="gen-mtile-sub">desv. estándar</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sharpe Ratio</div><div class="gen-mtile-val" style="color:${t.sharpe>=1?"var(--green)":t.sharpe>=0?"var(--amber)":"var(--red)"}">${P(t.sharpe)}</div><div class="gen-mtile-sub">anualizado, rf=0</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sortino Ratio</div><div class="gen-mtile-val" style="color:${t.sortino>=1?"var(--green)":t.sortino>=0?"var(--amber)":"var(--red)"}">${P(t.sortino)}</div><div class="gen-mtile-sub">solo riesgo bajista</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Calmar Ratio</div><div class="gen-mtile-val" style="color:${t.calmar>=1?"var(--green)":t.calmar>=0?"var(--amber)":"var(--red)"}">${P(t.calmar)}</div><div class="gen-mtile-sub">retorno / max DD</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown Real</div><div class="gen-mtile-val" style="color:var(--red)">-${P(t.maxDD*100,1)}%</div><div class="gen-mtile-sub">${L(t.ddStart)} → ${L(t.ddTrough)}</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Recuperación DD</div><div class="gen-mtile-val" style="color:${t.recoveryDate?"var(--green)":"var(--amber)"}">${t.ddDurationDays!=null?t.ddDurationDays+"d":"En curso"}</div><div class="gen-mtile-sub">${t.recoveryDate?L(t.recoveryDate):"sin recuperar"}</div></div>
    </div>`:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>'}function W(t){if(!t||t.length<2)return'<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>';const g=900,a=240,i=24,n=t.map(m=>m.value),p=Math.min(...n),v=Math.max(...n)-p||1,d=(g-i*2)/(n.length-1),l=n.map((m,o)=>`${i+o*d},${a-i-(m-p)/v*(a-i*2)}`).join(" "),u=n[n.length-1],r=n[0],$=u>=r?"#4ade80":"#f47174",f=`${i},${a-i} ${l} ${i+(n.length-1)*d},${a-i}`;return`<svg viewBox="0 0 ${g} ${a}" style="width:100%;height:${a}px;">
    <polygon points="${f}" fill="${$}" opacity="0.08"/>
    <polyline points="${l}" fill="none" stroke="${$}" stroke-width="2"/>
    <circle cx="${i+(n.length-1)*d}" cy="${a-i-(u-p)/v*(a-i*2)}" r="4" fill="${$}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${L(t[0].day)}</span><span>${L(t[t.length-1].day)}</span>
  </div>`}function _(t){if(!t||t.length<2)return"";const g=900,a=120,i=10;let n=t[0].value;const p=t.map(u=>(n=Math.max(n,u.value),n>0?(n-u.value)/n:0)),c=Math.max(...p,.001),v=(g-i*2)/(p.length-1),d=p.map((u,r)=>`${i+r*v},${i+u/c*(a-i*2)}`).join(" "),l=`${i},${i} ${d} ${i+(p.length-1)*v},${i}`;return`<svg viewBox="0 0 ${g} ${a}" style="width:100%;height:${a}px;">
    <polygon points="${l}" fill="#f47174" opacity="0.15"/>
    <polyline points="${d}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`}function q(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const g=t.map(m=>m*100),a=Math.min(...g),i=Math.max(...g),n=12,p=(i-a)/n||1,c=new Array(n).fill(0);g.forEach(m=>{let o=Math.floor((m-a)/p);o>=n&&(o=n-1),o<0&&(o=0),c[o]++});const v=900,d=200,l=24,u=Math.max(...c,1),r=(v-l*2)/n,$=c.map((m,o)=>{const s=m/u*(d-l*2),y=l+o*r,b=d-l-s,w=a+o*p>=0?"#4ade80":"#f47174";return`<rect x="${y+1}" y="${b}" width="${r-2}" height="${s}" fill="${w}" opacity="0.7"/>`}).join(""),f=l+(0-a)/(i-a||1)*(v-l*2);return`<svg viewBox="0 0 ${v} ${d}" style="width:100%;height:${d}px;">
    ${$}
    <line x1="${f}" y1="${l}" x2="${f}" y2="${d-l}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${a.toFixed(1)}%</span><span>0%</span><span>${i.toFixed(1)}%</span>
  </div>`}function G(t,g){const a=["Win Rate","Esperanza","Profit Factor","Kelly"],i=o=>o?[o.winRate,Math.max(0,Math.min(1,o.esperanza+.3)),Math.min((o.profitFactor===1/0?3:o.profitFactor)/3,1),Math.max(0,Math.min(1,(o.kelly||0)+.3))]:[0,0,0,0],n=i(t),p=i(g),c=150,v=150,d=110,l=4,u=(o,s)=>{const y=Math.PI*2*s/l-Math.PI/2,b=d*Math.max(0,Math.min(1,o));return`${c+b*Math.cos(y)},${v+b*Math.sin(y)}`},r=n.map((o,s)=>u(o,s)).join(" "),$=p.map((o,s)=>u(o,s)).join(" "),f=Array.from({length:l}).map((o,s)=>{const y=Math.PI*2*s/l-Math.PI/2;return`<line x1="${c}" y1="${v}" x2="${c+d*Math.cos(y)}" y2="${v+d*Math.sin(y)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),m=a.map((o,s)=>{const y=Math.PI*2*s/l-Math.PI/2,b=c+(d+22)*Math.cos(y),D=v+(d+22)*Math.sin(y);return`<text x="${b}" y="${D}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${o}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${c}" cy="${v}" r="${d}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${c}" cy="${v}" r="${d*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${f}
    <polygon points="${r}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${$}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${m}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function K(t,{actionsSlot:g}){var n;g.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function a(){const p=document.getElementById("gen-content");p.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[c,v,d,l,u,r]=await Promise.all([S.get("ethan_positions").then(s=>s||[]),S.get("ethan_positions_history").then(s=>s||[]),S.get("ethan_capital_alcista"),S.get("ethan_capital_bajista"),S.get("ethan_satelite_assets").then(s=>s||[]),S.get("ethan_core_pct")]),$={};await Promise.all(c.map(async s=>{$[s.ticker]=await z(s.ticker)}));const f=[...c.filter(s=>s.entryDate).map(s=>({ticker:s.ticker,direction:s.direction||"alcista",entry:s.entry,shares:s.shares,cost:s.cost,entryDate:s.entryDate,exitDate:null})),...v.filter(s=>s.entryDateISO).map(s=>({ticker:s.ticker,direction:s.direction||"alcista",entry:s.entry,shares:s.shares,cost:s.cost,entryDate:s.entryDateISO,exitDate:s.exitDateISO}))];let m=null,o=null;f.length>0&&(m=await B(f),o=F(m)),i(c,v,d,l,u,r,$,m,o)}function i(p,c,v,d,l,u,r,$,f){const m=document.getElementById("gen-content"),o=c.filter(x=>(x.direction||"alcista")==="alcista"),s=c.filter(x=>x.direction==="bajista"),y=I(o),b=I(s),D=I(c),w=(v||0)+(d||0);let A=0,e=0,h=0;p.forEach(x=>{const R=r[x.ticker],E=x.shares&&R?x.shares*R:x.cost||0;if((x.direction||"alcista")==="alcista"?A+=E:e+=E,R&&x.entry){const N=x.direction==="bajista"?(x.entry-R)/x.entry*100:(R-x.entry)/x.entry*100;x.cost&&(h+=x.cost*N/100)}}),m.innerHTML=`
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${V(D)}

      <!-- NAV REAL -->
      <div class="gen-section-title" style="margin-top:24px;">📈 NAV Real — Marcado a Mercado</div>
      ${f?`
        ${T(f)}
        <div class="gen-compare-grid" style="margin-top:14px;">
          <div class="gen-chart-box">
            <div class="gen-chart-title">Evolución del NAV</div>
            ${W($)}
          </div>
          <div class="gen-chart-box">
            <div class="gen-chart-title">Drawdown a lo largo del tiempo</div>
            ${_($)}
          </div>
        </div>
      `:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para reconstruir el NAV real</div>'}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${D?`
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${q(c.map(x=>x.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${G(y,b)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${y&&y.hasAbsData?k(y.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${b&&b.hasAbsData?k(b.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${D&&D.totalPL>=0?"var(--green)":"var(--red)"}">${D&&D.hasAbsData?k(D.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${D&&D.esperanza>=0?"var(--green)":"var(--red)"}">${D?M(D.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(y==null?void 0:y.kelly)!=null?(y.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(b==null?void 0:b.kelly)!=null?(b.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${w>0?k(w):"—"}</div><div class="gen-hero-sub">Alcista ${k(v||0)} · Bajista ${k(d||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${h>=0?"var(--green)":"var(--red)"}">${(h>=0?"+":"")+k(h)}</div><div class="gen-hero-sub">${p.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${k(A)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${k(e)}</div></div>
      </div>

      <!-- COMPOSICIÓN ASSET ALLOCATION -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${u||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(u||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${u||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(u||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${l.length>0?l.map(x=>`<span class="rf-custom-chip">${typeof x=="string"?x:x.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(n=document.getElementById("gen-refresh-btn"))==null||n.addEventListener("click",a),a(),{destroy(){}}}export{K as render};
