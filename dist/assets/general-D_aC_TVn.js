import{U as P}from"./userdata-CgA6yi1D.js";import"./index-H6ZDdhHr.js";const B=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function W(t,l){var i,g,c,p,r;const n=l>547.5?"5y":l>200?"2y":"1y",o=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${n}`;for(const m of B)try{const e=await fetch(m(o),{signal:AbortSignal.timeout(8e3)});if(!e.ok)continue;const h=JSON.parse(await e.text()),k=(g=(i=h==null?void 0:h.chart)==null?void 0:i.result)==null?void 0:g[0];if(!k)continue;const $=(r=(p=(c=k.indicators)==null?void 0:c.quote)==null?void 0:p[0])==null?void 0:r.close,s=k.timestamp;if(!$||!s)continue;const v={};return s.forEach((a,x)=>{if($[x]==null)return;const u=new Date(a*1e3).toISOString().slice(0,10);v[u]=$[x]}),v}catch{}return null}async function _(t){var n,o,i,g;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const c of B)try{const p=await fetch(c(l),{signal:AbortSignal.timeout(6e3)});if(!p.ok)continue;const r=JSON.parse(await p.text());return((g=(i=(o=(n=r==null?void 0:r.chart)==null?void 0:n.result)==null?void 0:o[0])==null?void 0:i.meta)==null?void 0:g.regularMarketPrice)||null}catch{}return null}const L=(t,l=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(l):"—",M=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",I=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",O=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function H(t,l){const n=[];let o=new Date(t);const i=new Date(l);for(;o<=i;)n.push(o.toISOString().slice(0,10)),o.setDate(o.getDate()+1);return n}async function U(t){if(t.length===0)return null;const l=t.reduce((e,h)=>h.entryDate<e?h.entryDate:e,t[0].entryDate),n=new Date().toISOString().slice(0,10),o=H(l,n),i=o.length,g=[...new Set(t.map(e=>e.ticker))],c={};await Promise.all(g.map(async e=>{c[e]=await W(e,i)}));const p=t.map(e=>{let h=e.shares;return(!h||h<=0)&&(e.cost&&e.entry?h=e.cost/e.entry:h=0),{...e,shares:h}}),r={};return o.map(e=>{let h=0,k=0,$=0;return p.forEach(s=>{if(s.shares<=0)return;const v=s.cost||s.shares*s.entry;s.entryDate===e&&(k+=v);const a=s.exitDate===e,x=s.entryDate<=e&&(s.exitDate?e<s.exitDate:!0);if(a){const d=c[s.ticker],D=(d==null?void 0:d[e])??r[s.ticker]??s.entry,y=s.direction==="bajista"?s.entry*s.shares+s.shares*(s.entry-D):s.shares*D;$+=y;return}if(!x)return;const u=c[s.ticker];let b=u==null?void 0:u[e];b==null&&u&&(b=r[s.ticker]??s.entry),b!=null&&(r[s.ticker]=b);const w=b??s.entry,R=s.direction==="bajista"?s.entry*s.shares+s.shares*(s.entry-w):s.shares*w;h+=R}),{day:e,value:h,cashIn:k,cashOut:$}})}function G(t){if(!t||t.length<2)return null;const l=[],n=[];for(let f=1;f<t.length;f++){const A=t[f-1].value,E=t[f].value,T=t[f].cashIn-t[f].cashOut,z=A+T;if(z>.01){const N=(E-z)/z,V=Math.abs(N)<.9;n.push({day:t[f].day,prevValue:A,todayValue:E,cashIn:t[f].cashIn,cashOut:t[f].cashOut,netFlow:T,base:z,r:N,kept:V}),V&&l.push(N)}}if(l.length<2)return{debugLog:n,insufficient:!0};const o=l.reduce((f,A)=>f+A,0)/l.length,i=Math.sqrt(l.reduce((f,A)=>f+(A-o)**2,0)/l.length);let g=100;const c=[100];l.forEach(f=>{g*=1+f,c.push(g)});const p=(g-100)/100,r=l.length,m=252/r,e=Math.pow(1+p,m)-1,h=i*Math.sqrt(252),k=h>0?e/h:0,$=l.filter(f=>f<0),s=$.length?Math.sqrt($.reduce((f,A)=>f+A**2,0)/$.length)*Math.sqrt(252):0,v=s>0?e/s:e>0?1/0:0;let a=c[0],x=0,u=0,b=0,w=0;c.forEach((f,A)=>{f>a&&(a=f,x=A);const E=a>0?(a-f)/a:0;E>u&&(u=E,b=x,w=A)});const R=f=>{var A;return((A=t[Math.min(f,t.length-1)])==null?void 0:A.day)||t[t.length-1].day},d=R(b),D=R(w);let y=null;const S=c[b];for(let f=w;f<c.length;f++)if(c[f]>=S){y=R(f);break}const C=y?Math.round((new Date(y)-new Date(d))/864e5):null,F=u>0?e/u:e>0?1/0:0;return{totalReturn:p,annualReturn:e,annualVol:h,sharpe:k,sortino:v,calmar:F,maxDD:u,ddStart:d,ddTrough:D,recoveryDate:y,ddDurationDays:C,returns:l,nDays:r,twrSeries:c,debugLog:n}}function j(t){if(!t.length)return null;const l=t.map(d=>({...d,pct:d.pnlPct/100,pl:d.pnlAbs})),n=l.reduce((d,D)=>d+(D.pl||0),0),o=l.some(d=>d.pl!=null),i=l.filter(d=>d.pct>0),g=l.filter(d=>d.pct<=0),c=i.length/l.length,p=i.length?i.reduce((d,D)=>d+D.pct,0)/i.length:0,r=g.length?Math.abs(g.reduce((d,D)=>d+D.pct,0)/g.length):0,m=c*p-(1-c)*r,e=l.map(d=>d.duration).filter(d=>d>0),h=e.length?e.reduce((d,D)=>d+D,0)/e.length:0,k=h>0?365.25/h:0,$=l.reduce((d,D)=>d.pct>D.pct?d:D),s=l.reduce((d,D)=>d.pct<D.pct?d:D),v=i.length?i.reduce((d,D)=>d+D.pct,0):0,a=g.length?Math.abs(g.reduce((d,D)=>d+D.pct,0)):0,x=a>0?v/a:v>0?1/0:0;let u=0,b=0;l.forEach(d=>{d.pct<=0?(b++,u=Math.max(u,b)):b=0});const w=r>0?p/r:null,R=w!=null?c-(1-c)/w:null;return{totalPL:n,hasAbsData:o,winRate:c,avgWinPct:p,avgLossPct:r,esperanza:m,diasMedio:h,opsAnio:k,maxWin:$,maxLoss:s,profitFactor:x,maxConsecLoss:u,kelly:R,R:w,winners:i.length,losers:g.length,total:l.length}}function q(t){return t?`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">P/L Total</div><div class="gen-mtile-val" style="color:${t.hasAbsData?t.totalPL>=0?"var(--green)":"var(--red)":"var(--text3)"}">${t.hasAbsData?M(t.totalPL):"Sin coste"}</div><div class="gen-mtile-sub">${t.total} operaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Win Rate</div><div class="gen-mtile-val">${(t.winRate*100).toFixed(1)}%</div><div class="gen-mtile-sub">${t.winners}W / ${t.losers}L</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Mat.</div><div class="gen-mtile-val" style="color:${t.esperanza>=0?"var(--green)":"var(--red)"}">${I(t.esperanza)}</div><div class="gen-mtile-sub">por operación</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val">${t.profitFactor===1/0?"∞":L(t.profitFactor)}</div><div class="gen-mtile-sub">AvgW: ${I(t.avgWinPct)} · AvgL: -${(t.avgLossPct*100).toFixed(2)}%</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Ganancia</div><div class="gen-mtile-val" style="color:var(--green)">${I(t.maxWin.pct)}</div><div class="gen-mtile-sub">${t.maxWin.ticker} · ${t.maxWin.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Pérdida</div><div class="gen-mtile-val" style="color:var(--red)">${I(t.maxLoss.pct)}</div><div class="gen-mtile-sub">${t.maxLoss.ticker} · ${t.maxLoss.duration}d</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máx Rachas Perd.</div><div class="gen-mtile-val" style="color:var(--red)">${t.maxConsecLoss}</div><div class="gen-mtile-sub">consecutivas</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Kelly Óptimo</div><div class="gen-mtile-val" style="color:${t.kelly!=null&&t.kelly>0?"var(--green)":"var(--text3)"}">${t.kelly!=null?(t.kelly*100).toFixed(1)+"%":"—"}</div><div class="gen-mtile-sub">% capital/op recomendado</div></div>
    </div>`:'<div class="sc2-empty">Sin operaciones cerradas en esta categoría</div>'}function K(t){return!t||!t.debugLog?"":`
    <details class="gen-debug-panel" style="margin-top:14px;">
      <summary style="cursor:pointer;font-size:10px;color:var(--text3);font-family:var(--mono);">🔍 Diagnóstico: 15 días con mayor impacto en el cálculo (clic para expandir)</summary>
      <table class="sc2-table" style="margin-top:10px;">
        <thead><tr><th>FECHA</th><th>VALOR AYER</th><th>VALOR HOY</th><th>CASH IN</th><th>CASH OUT</th><th>BASE</th><th>RETORNO</th><th>USADO</th></tr></thead>
        <tbody>
          ${[...t.debugLog].sort((n,o)=>Math.abs(o.r)-Math.abs(n.r)).slice(0,15).map(n=>`
            <tr style="${n.kept?"":"opacity:0.4;"}">
              <td style="font-family:var(--mono);font-size:10px;">${O(n.day)}</td>
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
    </details>`}function X(t){return t?t.insufficient?'<div class="sc2-empty">Datos insuficientes tras el filtro de sanidad — expande el diagnóstico abajo</div>':`
    <div class="gen-metrics-grid">
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno TWR Total</div><div class="gen-mtile-val" style="color:${t.totalReturn>=0?"var(--green)":"var(--red)"}">${I(t.totalReturn)}</div><div class="gen-mtile-sub">${t.nDays} días · neutraliza aportaciones</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Retorno Anualizado</div><div class="gen-mtile-val" style="color:${t.annualReturn>=0?"var(--green)":"var(--red)"}">${I(t.annualReturn)}</div><div class="gen-mtile-sub">CAGR sobre TWR</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Anualizada</div><div class="gen-mtile-val">${L(t.annualVol*100,1)}%</div><div class="gen-mtile-sub">desv. estándar</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sharpe Ratio</div><div class="gen-mtile-val" style="color:${t.sharpe>=1?"var(--green)":t.sharpe>=0?"var(--amber)":"var(--red)"}">${L(t.sharpe)}</div><div class="gen-mtile-sub">anualizado, rf=0</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Sortino Ratio</div><div class="gen-mtile-val" style="color:${t.sortino>=1?"var(--green)":t.sortino>=0?"var(--amber)":"var(--red)"}">${L(t.sortino)}</div><div class="gen-mtile-sub">solo riesgo bajista</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Calmar Ratio</div><div class="gen-mtile-val" style="color:${t.calmar>=1?"var(--green)":t.calmar>=0?"var(--amber)":"var(--red)"}">${L(t.calmar)}</div><div class="gen-mtile-sub">retorno / max DD</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown Real</div><div class="gen-mtile-val" style="color:var(--red)">-${L(t.maxDD*100,1)}%</div><div class="gen-mtile-sub">${O(t.ddStart)} → ${O(t.ddTrough)}</div></div>
      <div class="gen-mtile"><div class="gen-mtile-lbl">Recuperación DD</div><div class="gen-mtile-val" style="color:${t.recoveryDate?"var(--green)":"var(--amber)"}">${t.ddDurationDays!=null?t.ddDurationDays+"d":"En curso"}</div><div class="gen-mtile-sub">${t.recoveryDate?O(t.recoveryDate):"sin recuperar"}</div></div>
    </div>`:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>'}function J(t,l){if(!t||t.length<2)return'<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>';const n=900,o=240,i=24,g=Math.min(...t,100),p=Math.max(...t,100)-g||1,r=(n-i*2)/(t.length-1),m=t.map((s,v)=>`${i+v*r},${o-i-(s-g)/p*(o-i*2)}`).join(" "),e=t[t.length-1],h=e>=100?"#4ade80":"#f47174",k=o-i-(100-g)/p*(o-i*2),$=`${i},${o-i} ${m} ${i+(t.length-1)*r},${o-i}`;return`<svg viewBox="0 0 ${n} ${o}" style="width:100%;height:${o}px;">
    <line x1="${i}" y1="${k}" x2="${n-i}" y2="${k}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polygon points="${$}" fill="${h}" opacity="0.08"/>
    <polyline points="${m}" fill="none" stroke="${h}" stroke-width="2"/>
    <circle cx="${i+(t.length-1)*r}" cy="${o-i-(e-g)/p*(o-i*2)}" r="4" fill="${h}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${O(l[0].day)}</span><span>Base 100</span><span>${O(l[l.length-1].day)}</span>
  </div>`}function Y(t){if(!t||t.length<2)return"";const l=900,n=120,o=10;let i=t[0];const g=t.map(e=>(i=Math.max(i,e),i>0?(i-e)/i:0)),c=Math.max(...g,.001),p=(l-o*2)/(g.length-1),r=g.map((e,h)=>`${o+h*p},${o+e/c*(n-o*2)}`).join(" "),m=`${o},${o} ${r} ${o+(g.length-1)*p},${o}`;return`<svg viewBox="0 0 ${l} ${n}" style="width:100%;height:${n}px;">
    <polygon points="${m}" fill="#f47174" opacity="0.15"/>
    <polyline points="${r}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`}function Q(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const l=t.map(s=>s*100),n=Math.min(...l),o=Math.max(...l),i=12,g=(o-n)/i||1,c=new Array(i).fill(0);l.forEach(s=>{let v=Math.floor((s-n)/g);v>=i&&(v=i-1),v<0&&(v=0),c[v]++});const p=900,r=200,m=24,e=Math.max(...c,1),h=(p-m*2)/i,k=c.map((s,v)=>{const a=s/e*(r-m*2),x=m+v*h,u=r-m-a,w=n+v*g>=0?"#4ade80":"#f47174";return`<rect x="${x+1}" y="${u}" width="${h-2}" height="${a}" fill="${w}" opacity="0.7"/>`}).join(""),$=m+(0-n)/(o-n||1)*(p-m*2);return`<svg viewBox="0 0 ${p} ${r}" style="width:100%;height:${r}px;">
    ${k}
    <line x1="${$}" y1="${m}" x2="${$}" y2="${r-m}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${n.toFixed(1)}%</span><span>0%</span><span>${o.toFixed(1)}%</span>
  </div>`}function Z(t,l){const n=["Win Rate","Esperanza","Profit Factor","Kelly"],o=v=>v?[v.winRate,Math.max(0,Math.min(1,v.esperanza+.3)),Math.min((v.profitFactor===1/0?3:v.profitFactor)/3,1),Math.max(0,Math.min(1,(v.kelly||0)+.3))]:[0,0,0,0],i=o(t),g=o(l),c=150,p=150,r=110,m=4,e=(v,a)=>{const x=Math.PI*2*a/m-Math.PI/2,u=r*Math.max(0,Math.min(1,v));return`${c+u*Math.cos(x)},${p+u*Math.sin(x)}`},h=i.map((v,a)=>e(v,a)).join(" "),k=g.map((v,a)=>e(v,a)).join(" "),$=Array.from({length:m}).map((v,a)=>{const x=Math.PI*2*a/m-Math.PI/2;return`<line x1="${c}" y1="${p}" x2="${c+r*Math.cos(x)}" y2="${p+r*Math.sin(x)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),s=n.map((v,a)=>{const x=Math.PI*2*a/m-Math.PI/2,u=c+(r+22)*Math.cos(x),b=p+(r+22)*Math.sin(x);return`<text x="${u}" y="${b}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${v}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${c}" cy="${p}" r="${r}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${c}" cy="${p}" r="${r*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${$}
    <polygon points="${h}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${k}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${s}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function at(t,{actionsSlot:l}){var i;l.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function n(){const g=document.getElementById("gen-content");g.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[c,p,r,m,e,h]=await Promise.all([P.get("ethan_positions").then(a=>a||[]),P.get("ethan_positions_history").then(a=>a||[]),P.get("ethan_capital_alcista"),P.get("ethan_capital_bajista"),P.get("ethan_satelite_assets").then(a=>a||[]),P.get("ethan_core_pct")]),k={};await Promise.all(c.map(async a=>{k[a.ticker]=await _(a.ticker)}));const $=[...c.filter(a=>a.entryDate).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDate,exitDate:null})),...p.filter(a=>a.entryDateISO).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDateISO,exitDate:a.exitDateISO}))];let s=null,v=null;$.length>0&&(s=await U($),v=G(s)),o(c,p,r,m,e,h,k,s,v)}function o(g,c,p,r,m,e,h,k,$){const s=document.getElementById("gen-content"),v=c.filter(y=>(y.direction||"alcista")==="alcista"),a=c.filter(y=>y.direction==="bajista"),x=j(v),u=j(a),b=j(c),w=(p||0)+(r||0);let R=0,d=0,D=0;g.forEach(y=>{const S=h[y.ticker],C=y.shares&&S?y.shares*S:y.cost||0;if((y.direction||"alcista")==="alcista"?R+=C:d+=C,S&&y.entry){const F=y.direction==="bajista"?(y.entry-S)/y.entry*100:(S-y.entry)/y.entry*100;y.cost&&(D+=y.cost*F/100)}}),s.innerHTML=`
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${q(b)}

      <!-- NAV REAL -->
      <div class="gen-section-title" style="margin-top:24px;">📈 Rendimiento Real (Time-Weighted) — Marcado a Mercado</div>
      ${$?`
        ${X($)}
        ${K($)}
        ${$.twrSeries?`
        <div class="gen-compare-grid" style="margin-top:14px;">
          <div class="gen-chart-box">
            <div class="gen-chart-title">Índice de Rendimiento (base 100, neutraliza aportaciones de capital)</div>
            ${J($.twrSeries,k)}
          </div>
          <div class="gen-chart-box">
            <div class="gen-chart-title">Drawdown a lo largo del tiempo</div>
            ${Y($.twrSeries)}
          </div>
        </div>`:""}
      `:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para reconstruir el rendimiento real</div>'}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${b?`
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${Q(c.map(y=>y.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${Z(x,u)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${x&&x.hasAbsData?M(x.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${u&&u.hasAbsData?M(u.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${b&&b.totalPL>=0?"var(--green)":"var(--red)"}">${b&&b.hasAbsData?M(b.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${b&&b.esperanza>=0?"var(--green)":"var(--red)"}">${b?I(b.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(x==null?void 0:x.kelly)!=null?(x.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(u==null?void 0:u.kelly)!=null?(u.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${w>0?M(w):"—"}</div><div class="gen-hero-sub">Alcista ${M(p||0)} · Bajista ${M(r||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${D>=0?"var(--green)":"var(--red)"}">${(D>=0?"+":"")+M(D)}</div><div class="gen-hero-sub">${g.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${M(R)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${M(d)}</div></div>
      </div>

      <!-- COMPOSICIÓN ASSET ALLOCATION -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${e||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(e||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${e||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(e||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${m.length>0?m.map(y=>`<span class="rf-custom-chip">${typeof y=="string"?y:y.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(i=document.getElementById("gen-refresh-btn"))==null||i.addEventListener("click",n),n(),{destroy(){}}}export{at as render};
