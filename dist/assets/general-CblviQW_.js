import{U as S}from"./userdata-C7GiS4zF.js";import"./index-fIW2Udqm.js";const T=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function B(t,n){var a,c,d,v,g;const u=n>547.5?"5y":n>200?"2y":"1y",l=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${u}`;for(const i of T)try{const p=await fetch(i(l),{signal:AbortSignal.timeout(8e3)});if(!p.ok)continue;const x=JSON.parse(await p.text()),D=(c=(a=x==null?void 0:x.chart)==null?void 0:a.result)==null?void 0:c[0];if(!D)continue;const e=(g=(v=(d=D.indicators)==null?void 0:d.quote)==null?void 0:v[0])==null?void 0:g.close,w=D.timestamp;if(!e||!w)continue;const o={};return w.forEach((s,h)=>{if(e[h]==null)return;const m=new Date(s*1e3).toISOString().slice(0,10);o[m]=e[h]}),o}catch{}return null}async function V(t){var u,l,a,c;const n=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const d of T)try{const v=await fetch(d(n),{signal:AbortSignal.timeout(6e3)});if(!v.ok)continue;const g=JSON.parse(await v.text());return((c=(a=(l=(u=g==null?void 0:g.chart)==null?void 0:u.result)==null?void 0:l[0])==null?void 0:a.meta)==null?void 0:c.regularMarketPrice)||null}catch{}return null}const L=(t,n=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(n):"—",R=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",I=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",E=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function W(t,n){const u=[];let l=new Date(t);const a=new Date(n);for(;l<=a;)u.push(l.toISOString().slice(0,10)),l.setDate(l.getDate()+1);return u}async function _(t){if(t.length===0)return null;const n=t.reduce((i,p)=>p.entryDate<i?p.entryDate:i,t[0].entryDate),u=new Date().toISOString().slice(0,10),l=W(n,u),a=l.length,c=[...new Set(t.map(i=>i.ticker))],d={};await Promise.all(c.map(async i=>{d[i]=await B(i,a)}));const v={};return l.map(i=>{let p=0,x=0,D=0;return t.forEach(e=>{const w=e.cost||(e.shares&&e.entry?e.shares*e.entry:0);e.entryDate===i&&(x+=w);const o=e.exitDate===i,s=e.entryDate<=i&&(e.exitDate?i<e.exitDate:!0);if(o){const r=d[e.ticker],y=(r==null?void 0:r[i])??v[e.ticker]??e.entry,f=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),P=e.direction==="bajista"?e.entry*f+f*(e.entry-y):f*y;D+=P;return}if(!s)return;const h=d[e.ticker];let m=h==null?void 0:h[i];m==null&&h&&(m=v[e.ticker]??e.entry),m!=null&&(v[e.ticker]=m);const b=m??e.entry,k=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),A=e.direction==="bajista"?e.entry*k+k*(e.entry-b):k*b;p+=A}),{day:i,value:p,cashIn:x,cashOut:D}})}function q(t){if(!t||t.length<2)return null;const n=[];for(let $=1;$<t.length;$++){const M=t[$-1].value,O=t[$].value,F=t[$].cashIn-t[$].cashOut,z=M+F;if(z>.01){const j=(O-z)/z;Math.abs(j)<.9&&n.push(j)}}if(n.length<2)return null;const u=n.reduce(($,M)=>$+M,0)/n.length,l=Math.sqrt(n.reduce(($,M)=>$+(M-u)**2,0)/n.length);let a=100;const c=[100];n.forEach($=>{a*=1+$,c.push(a)});const d=(a-100)/100,v=n.length,g=252/v,i=Math.pow(1+d,g)-1,p=l*Math.sqrt(252),x=p>0?i/p:0,D=n.filter($=>$<0),e=D.length?Math.sqrt(D.reduce(($,M)=>$+M**2,0)/D.length)*Math.sqrt(252):0,w=e>0?i/e:i>0?1/0:0;let o=c[0],s=0,h=0,m=0,b=0;c.forEach(($,M)=>{$>o&&(o=$,s=M);const O=o>0?(o-$)/o:0;O>h&&(h=O,m=s,b=M)});const k=$=>{var M;return((M=t[Math.min($,t.length-1)])==null?void 0:M.day)||t[t.length-1].day},A=k(m),r=k(b);let y=null;const f=c[m];for(let $=b;$<c.length;$++)if(c[$]>=f){y=k($);break}const P=y?Math.round((new Date(y)-new Date(A))/864e5):null,C=h>0?i/h:i>0?1/0:0;return{totalReturn:d,annualReturn:i,annualVol:p,sharpe:x,sortino:w,calmar:C,maxDD:h,ddStart:A,ddTrough:r,recoveryDate:y,ddDurationDays:P,returns:n,nDays:v,twrSeries:c}}function N(t){if(!t.length)return null;const n=t.map(r=>({...r,pct:r.pnlPct/100,pl:r.pnlAbs})),u=n.reduce((r,y)=>r+(y.pl||0),0),l=n.some(r=>r.pl!=null),a=n.filter(r=>r.pct>0),c=n.filter(r=>r.pct<=0),d=a.length/n.length,v=a.length?a.reduce((r,y)=>r+y.pct,0)/a.length:0,g=c.length?Math.abs(c.reduce((r,y)=>r+y.pct,0)/c.length):0,i=d*v-(1-d)*g,p=n.map(r=>r.duration).filter(r=>r>0),x=p.length?p.reduce((r,y)=>r+y,0)/p.length:0,D=x>0?365.25/x:0,e=n.reduce((r,y)=>r.pct>y.pct?r:y),w=n.reduce((r,y)=>r.pct<y.pct?r:y),o=a.length?a.reduce((r,y)=>r+y.pct,0):0,s=c.length?Math.abs(c.reduce((r,y)=>r+y.pct,0)):0,h=s>0?o/s:o>0?1/0:0;let m=0,b=0;n.forEach(r=>{r.pct<=0?(b++,m=Math.max(m,b)):b=0});const k=g>0?v/g:null,A=k!=null?d-(1-d)/k:null;return{totalPL:u,hasAbsData:l,winRate:d,avgWinPct:v,avgLossPct:g,esperanza:i,diasMedio:x,opsAnio:D,maxWin:e,maxLoss:w,profitFactor:h,maxConsecLoss:m,kelly:A,R:k,winners:a.length,losers:c.length,total:n.length}}function G(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${t.hasAbsData?t.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${t.hasAbsData?R(t.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${t.total} operaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(t.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${t.winners}W / ${t.losers}L</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${t.esperanza>=0?"var(--green)":"var(--red)"}">${I(t.esperanza)}</div><div class="gen-mtile-sub">por operación</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${t.profitFactor===1/0?"∞":L(t.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${I(t.avgWinPct)} · AvgL: -${(t.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${I(t.maxWin.pct)}</div><div class="gen-mtile-sub">${t.maxWin.ticker} · ${t.maxWin.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${I(t.maxLoss.pct)}</div><div class="gen-mtile-sub">${t.maxLoss.ticker} · ${t.maxLoss.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${t.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Kelly Óptimo</div><div class="gen-mtile-val" style="color:${t.kelly!=null&&t.kelly>0?"var(--green)":"var(--text3)"}">${t.kelly!=null?(t.kelly*100).toFixed(1)+"%":"—"}</div><div class="gen-mtile-sub">% capital/op recomendado</div></div>
    </div>`:'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>'}function U(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno TWR Total</div><div class="gen-mtile-val" style="color:${t.totalReturn>=0?"var(--green)":"var(--red)"}">${I(t.totalReturn)}</div><div class="gen-mtile-sub">${t.nDays} días · neutraliza aportaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Anualizado</div><div class="gen-mtile-val" style="color:${t.annualReturn>=0?"var(--green)":"var(--red)"}">${I(t.annualReturn)}</div><div class="gen-mtile-sub">CAGR sobre TWR</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Anualizada</div><div class="gen-mtile-val">${L(t.annualVol*100,1)}%</div><div class="gen-mtile-sub">desv. estándar</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sharpe Ratio</div><div class="gen-mtile-val" style="color:${t.sharpe>=1?"var(--green)":t.sharpe>=0?"var(--amber)":"var(--red)"}">${L(t.sharpe)}</div><div class="gen-mtile-sub">anualizado, rf=0</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sortino Ratio</div><div class="gen-mtile-val" style="color:${t.sortino>=1?"var(--green)":t.sortino>=0?"var(--amber)":"var(--red)"}">${L(t.sortino)}</div><div class="gen-mtile-sub">solo riesgo bajista</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Calmar Ratio</div><div class="gen-mtile-val" style="color:${t.calmar>=1?"var(--green)":t.calmar>=0?"var(--amber)":"var(--red)"}">${L(t.calmar)}</div><div class="gen-mtile-sub">retorno / max DD</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown Real</div><div class="gen-mtile-val" style="color:var(--red)">-${L(t.maxDD*100,1)}%</div><div class="gen-mtile-sub">${E(t.ddStart)} → ${E(t.ddTrough)}</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Recuperación DD</div><div class="gen-mtile-val" style="color:${t.recoveryDate?"var(--green)":"var(--amber)"}">${t.ddDurationDays!=null?t.ddDurationDays+"d":"En curso"}</div><div class="gen-mtile-sub">${t.recoveryDate?E(t.recoveryDate):"sin recuperar"}</div></div>
    </div>`:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>'}function H(t,n){if(!t||t.length<2)return'<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>';const u=900,l=240,a=24,c=Math.min(...t,100),v=Math.max(...t,100)-c||1,g=(u-a*2)/(t.length-1),i=t.map((w,o)=>`${a+o*g},${l-a-(w-c)/v*(l-a*2)}`).join(" "),p=t[t.length-1],x=p>=100?"#4ade80":"#f47174",D=l-a-(100-c)/v*(l-a*2),e=`${a},${l-a} ${i} ${a+(t.length-1)*g},${l-a}`;return`<svg viewBox="0 0 ${u} ${l}" style="width:100%;height:${l}px;">
    <line x1="${a}" y1="${D}" x2="${u-a}" y2="${D}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polygon points="${e}" fill="${x}" opacity="0.08"/>
    <polyline points="${i}" fill="none" stroke="${x}" stroke-width="2"/>
    <circle cx="${a+(t.length-1)*g}" cy="${l-a-(p-c)/v*(l-a*2)}" r="4" fill="${x}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${E(n[0].day)}</span><span>Base 100</span><span>${E(n[n.length-1].day)}</span>
  </div>`}function K(t){if(!t||t.length<2)return"";const n=900,u=120,l=10;let a=t[0];const c=t.map(p=>(a=Math.max(a,p),a>0?(a-p)/a:0)),d=Math.max(...c,.001),v=(n-l*2)/(c.length-1),g=c.map((p,x)=>`${l+x*v},${l+p/d*(u-l*2)}`).join(" "),i=`${l},${l} ${g} ${l+(c.length-1)*v},${l}`;return`<svg viewBox="0 0 ${n} ${u}" style="width:100%;height:${u}px;">
    <polygon points="${i}" fill="#f47174" opacity="0.15"/>
    <polyline points="${g}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`}function X(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const n=t.map(w=>w*100),u=Math.min(...n),l=Math.max(...n),a=12,c=(l-u)/a||1,d=new Array(a).fill(0);n.forEach(w=>{let o=Math.floor((w-u)/c);o>=a&&(o=a-1),o<0&&(o=0),d[o]++});const v=900,g=200,i=24,p=Math.max(...d,1),x=(v-i*2)/a,D=d.map((w,o)=>{const s=w/p*(g-i*2),h=i+o*x,m=g-i-s,k=u+o*c>=0?"#4ade80":"#f47174";return`<rect x="${h+1}" y="${m}" width="${x-2}" height="${s}" fill="${k}" opacity="0.7"/>`}).join(""),e=i+(0-u)/(l-u||1)*(v-i*2);return`<svg viewBox="0 0 ${v} ${g}" style="width:100%;height:${g}px;">
    ${D}
    <line x1="${e}" y1="${i}" x2="${e}" y2="${g-i}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${u.toFixed(1)}%</span><span>0%</span><span>${l.toFixed(1)}%</span>
  </div>`}function J(t,n){const u=["Win Rate","Esperanza","Profit Factor","Kelly"],l=o=>o?[o.winRate,Math.max(0,Math.min(1,o.esperanza+.3)),Math.min((o.profitFactor===1/0?3:o.profitFactor)/3,1),Math.max(0,Math.min(1,(o.kelly||0)+.3))]:[0,0,0,0],a=l(t),c=l(n),d=150,v=150,g=110,i=4,p=(o,s)=>{const h=Math.PI*2*s/i-Math.PI/2,m=g*Math.max(0,Math.min(1,o));return`${d+m*Math.cos(h)},${v+m*Math.sin(h)}`},x=a.map((o,s)=>p(o,s)).join(" "),D=c.map((o,s)=>p(o,s)).join(" "),e=Array.from({length:i}).map((o,s)=>{const h=Math.PI*2*s/i-Math.PI/2;return`<line x1="${d}" y1="${v}" x2="${d+g*Math.cos(h)}" y2="${v+g*Math.sin(h)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),w=u.map((o,s)=>{const h=Math.PI*2*s/i-Math.PI/2,m=d+(g+22)*Math.cos(h),b=v+(g+22)*Math.sin(h);return`<text x="${m}" y="${b}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${o}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${d}" cy="${v}" r="${g}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${d}" cy="${v}" r="${g*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${e}
    <polygon points="${x}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${D}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${w}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function Z(t,{actionsSlot:n}){var a;n.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function u(){const c=document.getElementById("gen-content");c.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[d,v,g,i,p,x]=await Promise.all([S.get("ethan_positions").then(s=>s||[]),S.get("ethan_positions_history").then(s=>s||[]),S.get("ethan_capital_alcista"),S.get("ethan_capital_bajista"),S.get("ethan_satelite_assets").then(s=>s||[]),S.get("ethan_core_pct")]),D={};await Promise.all(d.map(async s=>{D[s.ticker]=await V(s.ticker)}));const e=[...d.filter(s=>s.entryDate).map(s=>({ticker:s.ticker,direction:s.direction||"alcista",entry:s.entry,shares:s.shares,cost:s.cost,entryDate:s.entryDate,exitDate:null})),...v.filter(s=>s.entryDateISO).map(s=>({ticker:s.ticker,direction:s.direction||"alcista",entry:s.entry,shares:s.shares,cost:s.cost,entryDate:s.entryDateISO,exitDate:s.exitDateISO}))];let w=null,o=null;e.length>0&&(w=await _(e),o=q(w)),l(d,v,g,i,p,x,D,w,o)}function l(c,d,v,g,i,p,x,D,e){const w=document.getElementById("gen-content"),o=d.filter(f=>(f.direction||"alcista")==="alcista"),s=d.filter(f=>f.direction==="bajista"),h=N(o),m=N(s),b=N(d),k=(v||0)+(g||0);let A=0,r=0,y=0;c.forEach(f=>{const P=x[f.ticker],C=f.shares&&P?f.shares*P:f.cost||0;if((f.direction||"alcista")==="alcista"?A+=C:r+=C,P&&f.entry){const $=f.direction==="bajista"?(f.entry-P)/f.entry*100:(P-f.entry)/f.entry*100;f.cost&&(y+=f.cost*$/100)}}),w.innerHTML=`
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${G(b)}

      <!-- NAV REAL -->
      <div class="gen-section-title" style="margin-top:24px;">📈 Rendimiento Real (Time-Weighted) — Marcado a Mercado</div>
      ${e?`
        ${U(e)}
        <div class="gen-compare-grid" style="margin-top:14px;">
          <div class="gen-chart-box">
            <div class="gen-chart-title">Índice de Rendimiento (base 100, neutraliza aportaciones de capital)</div>
            ${H(e.twrSeries,D)}
          </div>
          <div class="gen-chart-box">
            <div class="gen-chart-title">Drawdown a lo largo del tiempo</div>
            ${K(e.twrSeries)}
          </div>
        </div>
      `:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para reconstruir el rendimiento real</div>'}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${b?`
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${X(d.map(f=>f.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${J(h,m)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${h&&h.hasAbsData?R(h.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${m&&m.hasAbsData?R(m.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${b&&b.totalPL>=0?"var(--green)":"var(--red)"}">${b&&b.hasAbsData?R(b.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${b&&b.esperanza>=0?"var(--green)":"var(--red)"}">${b?I(b.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(h==null?void 0:h.kelly)!=null?(h.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(m==null?void 0:m.kelly)!=null?(m.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${k>0?R(k):"—"}</div><div class="gen-hero-sub">Alcista ${R(v||0)} · Bajista ${R(g||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${y>=0?"var(--green)":"var(--red)"}">${(y>=0?"+":"")+R(y)}</div><div class="gen-hero-sub">${c.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${R(A)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${R(r)}</div></div>
      </div>

      <!-- COMPOSICIÓN ASSET ALLOCATION -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${p||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(p||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${p||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(p||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${i.length>0?i.map(f=>`<span class="rf-custom-chip">${typeof f=="string"?f:f.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(a=document.getElementById("gen-refresh-btn"))==null||a.addEventListener("click",u),u(),{destroy(){}}}export{Z as render};
