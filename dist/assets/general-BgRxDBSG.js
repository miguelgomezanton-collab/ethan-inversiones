import{U as S}from"./userdata-7hbFyLxN.js";import"./index-ChpwFVhn.js";const F=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function B(t,n){var s,c,d,v,g;const m=n>547.5?"5y":n>200?"2y":"1y",l=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${m}`;for(const i of F)try{const p=await fetch(i(l),{signal:AbortSignal.timeout(8e3)});if(!p.ok)continue;const $=JSON.parse(await p.text()),D=(c=(s=$==null?void 0:$.chart)==null?void 0:s.result)==null?void 0:c[0];if(!D)continue;const e=(g=(v=(d=D.indicators)==null?void 0:d.quote)==null?void 0:v[0])==null?void 0:g.close,w=D.timestamp;if(!e||!w)continue;const o={};return w.forEach((a,h)=>{if(e[h]==null)return;const f=new Date(a*1e3).toISOString().slice(0,10);o[f]=e[h]}),o}catch{}return null}async function V(t){var m,l,s,c;const n=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const d of F)try{const v=await fetch(d(n),{signal:AbortSignal.timeout(6e3)});if(!v.ok)continue;const g=JSON.parse(await v.text());return((c=(s=(l=(m=g==null?void 0:g.chart)==null?void 0:m.result)==null?void 0:l[0])==null?void 0:s.meta)==null?void 0:c.regularMarketPrice)||null}catch{}return null}const L=(t,n=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(n):"—",A=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",I=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",E=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function W(t,n){const m=[];let l=new Date(t);const s=new Date(n);for(;l<=s;)m.push(l.toISOString().slice(0,10)),l.setDate(l.getDate()+1);return m}async function _(t){if(t.length===0)return null;const n=t.reduce((i,p)=>p.entryDate<i?p.entryDate:i,t[0].entryDate),m=new Date().toISOString().slice(0,10),l=W(n,m),s=l.length,c=[...new Set(t.map(i=>i.ticker))],d={};await Promise.all(c.map(async i=>{d[i]=await B(i,s)}));const v={};return l.map(i=>{let p=0,$=0,D=0;return t.forEach(e=>{const w=e.cost||(e.shares&&e.entry?e.shares*e.entry:0);if(e.entryDate===i&&($+=w),e.exitDate===i){const R=d[e.ticker],r=(R==null?void 0:R[i])??v[e.ticker]??e.entry,u=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),x=e.direction==="bajista"?e.entry*u+u*(e.entry-r):u*r;D+=x}if(!(e.entryDate<=i&&(e.exitDate?i<=e.exitDate:!0)))return;const a=d[e.ticker];let h=a==null?void 0:a[i];h==null&&a&&(h=v[e.ticker]??e.entry),h!=null&&(v[e.ticker]=h);const f=h??e.entry,b=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),k=e.direction==="bajista"?e.entry*b+b*(e.entry-f):b*f;p+=k}),{day:i,value:p,cashIn:$,cashOut:D}})}function q(t){if(!t||t.length<2)return null;const n=[];for(let y=1;y<t.length;y++){const M=t[y-1].value,O=t[y].value,T=t[y].cashIn-t[y].cashOut,z=M+T;if(z>.01){const j=(O-z)/z;Math.abs(j)<.8&&n.push(j)}}if(n.length<2)return null;const m=n.reduce((y,M)=>y+M,0)/n.length,l=Math.sqrt(n.reduce((y,M)=>y+(M-m)**2,0)/n.length);let s=100;const c=[100];n.forEach(y=>{s*=1+y,c.push(s)});const d=(s-100)/100,v=n.length,g=252/v,i=Math.pow(1+d,g)-1,p=l*Math.sqrt(252),$=p>0?i/p:0,D=n.filter(y=>y<0),e=D.length?Math.sqrt(D.reduce((y,M)=>y+M**2,0)/D.length)*Math.sqrt(252):0,w=e>0?i/e:i>0?1/0:0;let o=c[0],a=0,h=0,f=0,b=0;c.forEach((y,M)=>{y>o&&(o=y,a=M);const O=o>0?(o-y)/o:0;O>h&&(h=O,f=a,b=M)});const k=y=>{var M;return((M=t[Math.min(y,t.length-1)])==null?void 0:M.day)||t[t.length-1].day},R=k(f),r=k(b);let u=null;const x=c[f];for(let y=b;y<c.length;y++)if(c[y]>=x){u=k(y);break}const P=u?Math.round((new Date(u)-new Date(R))/864e5):null,C=h>0?i/h:i>0?1/0:0;return{totalReturn:d,annualReturn:i,annualVol:p,sharpe:$,sortino:w,calmar:C,maxDD:h,ddStart:R,ddTrough:r,recoveryDate:u,ddDurationDays:P,returns:n,nDays:v,twrSeries:c}}function N(t){if(!t.length)return null;const n=t.map(r=>({...r,pct:r.pnlPct/100,pl:r.pnlAbs})),m=n.reduce((r,u)=>r+(u.pl||0),0),l=n.some(r=>r.pl!=null),s=n.filter(r=>r.pct>0),c=n.filter(r=>r.pct<=0),d=s.length/n.length,v=s.length?s.reduce((r,u)=>r+u.pct,0)/s.length:0,g=c.length?Math.abs(c.reduce((r,u)=>r+u.pct,0)/c.length):0,i=d*v-(1-d)*g,p=n.map(r=>r.duration).filter(r=>r>0),$=p.length?p.reduce((r,u)=>r+u,0)/p.length:0,D=$>0?365.25/$:0,e=n.reduce((r,u)=>r.pct>u.pct?r:u),w=n.reduce((r,u)=>r.pct<u.pct?r:u),o=s.length?s.reduce((r,u)=>r+u.pct,0):0,a=c.length?Math.abs(c.reduce((r,u)=>r+u.pct,0)):0,h=a>0?o/a:o>0?1/0:0;let f=0,b=0;n.forEach(r=>{r.pct<=0?(b++,f=Math.max(f,b)):b=0});const k=g>0?v/g:null,R=k!=null?d-(1-d)/k:null;return{totalPL:m,hasAbsData:l,winRate:d,avgWinPct:v,avgLossPct:g,esperanza:i,diasMedio:$,opsAnio:D,maxWin:e,maxLoss:w,profitFactor:h,maxConsecLoss:f,kelly:R,R:k,winners:s.length,losers:c.length,total:n.length}}function G(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${t.hasAbsData?t.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${t.hasAbsData?A(t.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${t.total} operaciones</div></div>
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
    </div>`:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>'}function H(t,n){if(!t||t.length<2)return'<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>';const m=900,l=240,s=24,c=Math.min(...t,100),v=Math.max(...t,100)-c||1,g=(m-s*2)/(t.length-1),i=t.map((w,o)=>`${s+o*g},${l-s-(w-c)/v*(l-s*2)}`).join(" "),p=t[t.length-1],$=p>=100?"#4ade80":"#f47174",D=l-s-(100-c)/v*(l-s*2),e=`${s},${l-s} ${i} ${s+(t.length-1)*g},${l-s}`;return`<svg viewBox="0 0 ${m} ${l}" style="width:100%;height:${l}px;">
    <line x1="${s}" y1="${D}" x2="${m-s}" y2="${D}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polygon points="${e}" fill="${$}" opacity="0.08"/>
    <polyline points="${i}" fill="none" stroke="${$}" stroke-width="2"/>
    <circle cx="${s+(t.length-1)*g}" cy="${l-s-(p-c)/v*(l-s*2)}" r="4" fill="${$}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${E(n[0].day)}</span><span>Base 100</span><span>${E(n[n.length-1].day)}</span>
  </div>`}function K(t){if(!t||t.length<2)return"";const n=900,m=120,l=10;let s=t[0];const c=t.map(p=>(s=Math.max(s,p),s>0?(s-p)/s:0)),d=Math.max(...c,.001),v=(n-l*2)/(c.length-1),g=c.map((p,$)=>`${l+$*v},${l+p/d*(m-l*2)}`).join(" "),i=`${l},${l} ${g} ${l+(c.length-1)*v},${l}`;return`<svg viewBox="0 0 ${n} ${m}" style="width:100%;height:${m}px;">
    <polygon points="${i}" fill="#f47174" opacity="0.15"/>
    <polyline points="${g}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`}function X(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const n=t.map(w=>w*100),m=Math.min(...n),l=Math.max(...n),s=12,c=(l-m)/s||1,d=new Array(s).fill(0);n.forEach(w=>{let o=Math.floor((w-m)/c);o>=s&&(o=s-1),o<0&&(o=0),d[o]++});const v=900,g=200,i=24,p=Math.max(...d,1),$=(v-i*2)/s,D=d.map((w,o)=>{const a=w/p*(g-i*2),h=i+o*$,f=g-i-a,k=m+o*c>=0?"#4ade80":"#f47174";return`<rect x="${h+1}" y="${f}" width="${$-2}" height="${a}" fill="${k}" opacity="0.7"/>`}).join(""),e=i+(0-m)/(l-m||1)*(v-i*2);return`<svg viewBox="0 0 ${v} ${g}" style="width:100%;height:${g}px;">
    ${D}
    <line x1="${e}" y1="${i}" x2="${e}" y2="${g-i}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${m.toFixed(1)}%</span><span>0%</span><span>${l.toFixed(1)}%</span>
  </div>`}function J(t,n){const m=["Win Rate","Esperanza","Profit Factor","Kelly"],l=o=>o?[o.winRate,Math.max(0,Math.min(1,o.esperanza+.3)),Math.min((o.profitFactor===1/0?3:o.profitFactor)/3,1),Math.max(0,Math.min(1,(o.kelly||0)+.3))]:[0,0,0,0],s=l(t),c=l(n),d=150,v=150,g=110,i=4,p=(o,a)=>{const h=Math.PI*2*a/i-Math.PI/2,f=g*Math.max(0,Math.min(1,o));return`${d+f*Math.cos(h)},${v+f*Math.sin(h)}`},$=s.map((o,a)=>p(o,a)).join(" "),D=c.map((o,a)=>p(o,a)).join(" "),e=Array.from({length:i}).map((o,a)=>{const h=Math.PI*2*a/i-Math.PI/2;return`<line x1="${d}" y1="${v}" x2="${d+g*Math.cos(h)}" y2="${v+g*Math.sin(h)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),w=m.map((o,a)=>{const h=Math.PI*2*a/i-Math.PI/2,f=d+(g+22)*Math.cos(h),b=v+(g+22)*Math.sin(h);return`<text x="${f}" y="${b}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${o}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${d}" cy="${v}" r="${g}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${d}" cy="${v}" r="${g*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${e}
    <polygon points="${$}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${D}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${w}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function Z(t,{actionsSlot:n}){var s;n.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function m(){const c=document.getElementById("gen-content");c.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[d,v,g,i,p,$]=await Promise.all([S.get("ethan_positions").then(a=>a||[]),S.get("ethan_positions_history").then(a=>a||[]),S.get("ethan_capital_alcista"),S.get("ethan_capital_bajista"),S.get("ethan_satelite_assets").then(a=>a||[]),S.get("ethan_core_pct")]),D={};await Promise.all(d.map(async a=>{D[a.ticker]=await V(a.ticker)}));const e=[...d.filter(a=>a.entryDate).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDate,exitDate:null})),...v.filter(a=>a.entryDateISO).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDateISO,exitDate:a.exitDateISO}))];let w=null,o=null;e.length>0&&(w=await _(e),o=q(w)),l(d,v,g,i,p,$,D,w,o)}function l(c,d,v,g,i,p,$,D,e){const w=document.getElementById("gen-content"),o=d.filter(x=>(x.direction||"alcista")==="alcista"),a=d.filter(x=>x.direction==="bajista"),h=N(o),f=N(a),b=N(d),k=(v||0)+(g||0);let R=0,r=0,u=0;c.forEach(x=>{const P=$[x.ticker],C=x.shares&&P?x.shares*P:x.cost||0;if((x.direction||"alcista")==="alcista"?R+=C:r+=C,P&&x.entry){const y=x.direction==="bajista"?(x.entry-P)/x.entry*100:(P-x.entry)/x.entry*100;x.cost&&(u+=x.cost*y/100)}}),w.innerHTML=`
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
        ${X(d.map(x=>x.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${J(h,f)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${h&&h.hasAbsData?A(h.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${f&&f.hasAbsData?A(f.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${b&&b.totalPL>=0?"var(--green)":"var(--red)"}">${b&&b.hasAbsData?A(b.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${b&&b.esperanza>=0?"var(--green)":"var(--red)"}">${b?I(b.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(h==null?void 0:h.kelly)!=null?(h.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(f==null?void 0:f.kelly)!=null?(f.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${k>0?A(k):"—"}</div><div class="gen-hero-sub">Alcista ${A(v||0)} · Bajista ${A(g||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${u>=0?"var(--green)":"var(--red)"}">${(u>=0?"+":"")+A(u)}</div><div class="gen-hero-sub">${c.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${A(R)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${A(r)}</div></div>
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
            ${i.length>0?i.map(x=>`<span class="rf-custom-chip">${typeof x=="string"?x:x.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(s=document.getElementById("gen-refresh-btn"))==null||s.addEventListener("click",m),m(),{destroy(){}}}export{Z as render};
