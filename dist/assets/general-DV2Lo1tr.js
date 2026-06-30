import{U as P}from"./userdata-FmmCdJd0.js";import"./index-CdupGQB6.js";const B=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`,t=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`];async function W(t,n){var s,h,o,g,d;const i=n>547.5?"5y":n>200?"2y":"1y",l=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=${i}`;for(const c of B)try{const p=await fetch(c(l),{signal:AbortSignal.timeout(8e3)});if(!p.ok)continue;const f=JSON.parse(await p.text()),k=(h=(s=f==null?void 0:f.chart)==null?void 0:s.result)==null?void 0:h[0];if(!k)continue;const e=(d=(g=(o=k.indicators)==null?void 0:o.quote)==null?void 0:g[0])==null?void 0:d.close,b=k.timestamp;if(!e||!b)continue;const v={};return b.forEach((a,m)=>{if(e[m]==null)return;const u=new Date(a*1e3).toISOString().slice(0,10);v[u]=e[m]}),v}catch{}return null}async function _(t){var i,l,s,h;const n=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=5d`;for(const o of B)try{const g=await fetch(o(n),{signal:AbortSignal.timeout(6e3)});if(!g.ok)continue;const d=JSON.parse(await g.text());return((h=(s=(l=(i=d==null?void 0:d.chart)==null?void 0:i.result)==null?void 0:l[0])==null?void 0:s.meta)==null?void 0:h.regularMarketPrice)||null}catch{}return null}const L=(t,n=2)=>t!=null&&!isNaN(t)&&isFinite(t)?t.toFixed(n):"—",M=t=>t!=null&&!isNaN(t)?"$"+t.toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",I=t=>t!=null&&!isNaN(t)?(t>=0?"+":"")+(t*100).toFixed(2)+"%":"—",O=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function H(t,n){const i=[];let l=new Date(t);const s=new Date(n);for(;l<=s;)i.push(l.toISOString().slice(0,10)),l.setDate(l.getDate()+1);return i}async function U(t){if(t.length===0)return null;const n=t.reduce((c,p)=>p.entryDate<c?p.entryDate:c,t[0].entryDate),i=new Date().toISOString().slice(0,10),l=H(n,i),s=l.length,h=[...new Set(t.map(c=>c.ticker))],o={};await Promise.all(h.map(async c=>{o[c]=await W(c,s)}));const g={};return l.map(c=>{let p=0,f=0,k=0;return t.forEach(e=>{const b=e.cost||(e.shares&&e.entry?e.shares*e.entry:0);e.entryDate===c&&(f+=b);const v=e.exitDate===c,a=e.entryDate<=c&&(e.exitDate?c<e.exitDate:!0);if(v){const r=o[e.ticker],x=(r==null?void 0:r[c])??g[e.ticker]??e.entry,y=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),S=e.direction==="bajista"?e.entry*y+y*(e.entry-x):y*x;k+=S;return}if(!a)return;const m=o[e.ticker];let u=m==null?void 0:m[c];u==null&&m&&(u=g[e.ticker]??e.entry),u!=null&&(g[e.ticker]=u);const D=u??e.entry,w=e.shares||(e.cost&&e.entry?e.cost/e.entry:0),R=e.direction==="bajista"?e.entry*w+w*(e.entry-D):w*D;p+=R}),{day:c,value:p,cashIn:f,cashOut:k}})}function G(t){if(!t||t.length<2)return null;const n=[],i=[];for(let $=1;$<t.length;$++){const A=t[$-1].value,E=t[$].value,T=t[$].cashIn-t[$].cashOut,z=A+T;if(z>.01){const N=(E-z)/z,V=Math.abs(N)<.9;i.push({day:t[$].day,prevValue:A,todayValue:E,cashIn:t[$].cashIn,cashOut:t[$].cashOut,netFlow:T,base:z,r:N,kept:V}),V&&n.push(N)}}if(n.length<2)return{debugLog:i,insufficient:!0};const l=n.reduce(($,A)=>$+A,0)/n.length,s=Math.sqrt(n.reduce(($,A)=>$+(A-l)**2,0)/n.length);let h=100;const o=[100];n.forEach($=>{h*=1+$,o.push(h)});const g=(h-100)/100,d=n.length,c=252/d,p=Math.pow(1+g,c)-1,f=s*Math.sqrt(252),k=f>0?p/f:0,e=n.filter($=>$<0),b=e.length?Math.sqrt(e.reduce(($,A)=>$+A**2,0)/e.length)*Math.sqrt(252):0,v=b>0?p/b:p>0?1/0:0;let a=o[0],m=0,u=0,D=0,w=0;o.forEach(($,A)=>{$>a&&(a=$,m=A);const E=a>0?(a-$)/a:0;E>u&&(u=E,D=m,w=A)});const R=$=>{var A;return((A=t[Math.min($,t.length-1)])==null?void 0:A.day)||t[t.length-1].day},r=R(D),x=R(w);let y=null;const S=o[D];for(let $=w;$<o.length;$++)if(o[$]>=S){y=R($);break}const C=y?Math.round((new Date(y)-new Date(r))/864e5):null,F=u>0?p/u:p>0?1/0:0;return{totalReturn:g,annualReturn:p,annualVol:f,sharpe:k,sortino:v,calmar:F,maxDD:u,ddStart:r,ddTrough:x,recoveryDate:y,ddDurationDays:C,returns:n,nDays:d,twrSeries:o,debugLog:i}}function j(t){if(!t.length)return null;const n=t.map(r=>({...r,pct:r.pnlPct/100,pl:r.pnlAbs})),i=n.reduce((r,x)=>r+(x.pl||0),0),l=n.some(r=>r.pl!=null),s=n.filter(r=>r.pct>0),h=n.filter(r=>r.pct<=0),o=s.length/n.length,g=s.length?s.reduce((r,x)=>r+x.pct,0)/s.length:0,d=h.length?Math.abs(h.reduce((r,x)=>r+x.pct,0)/h.length):0,c=o*g-(1-o)*d,p=n.map(r=>r.duration).filter(r=>r>0),f=p.length?p.reduce((r,x)=>r+x,0)/p.length:0,k=f>0?365.25/f:0,e=n.reduce((r,x)=>r.pct>x.pct?r:x),b=n.reduce((r,x)=>r.pct<x.pct?r:x),v=s.length?s.reduce((r,x)=>r+x.pct,0):0,a=h.length?Math.abs(h.reduce((r,x)=>r+x.pct,0)):0,m=a>0?v/a:v>0?1/0:0;let u=0,D=0;n.forEach(r=>{r.pct<=0?(D++,u=Math.max(u,D)):D=0});const w=d>0?g/d:null,R=w!=null?o-(1-o)/w:null;return{totalPL:i,hasAbsData:l,winRate:o,avgWinPct:g,avgLossPct:d,esperanza:c,diasMedio:f,opsAnio:k,maxWin:e,maxLoss:b,profitFactor:m,maxConsecLoss:u,kelly:R,R:w,winners:s.length,losers:h.length,total:n.length}}function q(t){return t?`
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
          ${[...t.debugLog].sort((i,l)=>Math.abs(l.r)-Math.abs(i.r)).slice(0,15).map(i=>`
            <tr style="${i.kept?"":"opacity:0.4;"}">
              <td style="font-family:var(--mono);font-size:10px;">${O(i.day)}</td>
              <td class="sc2-price">$${i.prevValue.toFixed(0)}</td>
              <td class="sc2-price">$${i.todayValue.toFixed(0)}</td>
              <td class="sc2-price" style="color:var(--teal)">${i.cashIn>0?"$"+i.cashIn.toFixed(0):"—"}</td>
              <td class="sc2-price" style="color:var(--amber)">${i.cashOut>0?"$"+i.cashOut.toFixed(0):"—"}</td>
              <td class="sc2-price">$${i.base.toFixed(0)}</td>
              <td class="sc2-score" style="color:${i.r>=0?"var(--green)":"var(--red)"}">${(i.r*100).toFixed(1)}%</td>
              <td style="font-size:10px;color:${i.kept?"var(--green)":"var(--red)"}">${i.kept?"✓ sí":"✗ filtrado"}</td>
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
    </div>`:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para calcular el NAV real</div>'}function J(t,n){if(!t||t.length<2)return'<div class="sc2-empty" style="padding:30px;">Sin suficientes datos para graficar</div>';const i=900,l=240,s=24,h=Math.min(...t,100),g=Math.max(...t,100)-h||1,d=(i-s*2)/(t.length-1),c=t.map((b,v)=>`${s+v*d},${l-s-(b-h)/g*(l-s*2)}`).join(" "),p=t[t.length-1],f=p>=100?"#4ade80":"#f47174",k=l-s-(100-h)/g*(l-s*2),e=`${s},${l-s} ${c} ${s+(t.length-1)*d},${l-s}`;return`<svg viewBox="0 0 ${i} ${l}" style="width:100%;height:${l}px;">
    <line x1="${s}" y1="${k}" x2="${i-s}" y2="${k}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
    <polygon points="${e}" fill="${f}" opacity="0.08"/>
    <polyline points="${c}" fill="none" stroke="${f}" stroke-width="2"/>
    <circle cx="${s+(t.length-1)*d}" cy="${l-s-(p-h)/g*(l-s*2)}" r="4" fill="${f}"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${O(n[0].day)}</span><span>Base 100</span><span>${O(n[n.length-1].day)}</span>
  </div>`}function Y(t){if(!t||t.length<2)return"";const n=900,i=120,l=10;let s=t[0];const h=t.map(p=>(s=Math.max(s,p),s>0?(s-p)/s:0)),o=Math.max(...h,.001),g=(n-l*2)/(h.length-1),d=h.map((p,f)=>`${l+f*g},${l+p/o*(i-l*2)}`).join(" "),c=`${l},${l} ${d} ${l+(h.length-1)*g},${l}`;return`<svg viewBox="0 0 ${n} ${i}" style="width:100%;height:${i}px;">
    <polygon points="${c}" fill="#f47174" opacity="0.15"/>
    <polyline points="${d}" fill="none" stroke="#f47174" stroke-width="1.5"/>
  </svg>`}function Q(t){if(!t||t.length<3)return'<div class="sc2-empty" style="padding:30px;">Necesitas más operaciones para el histograma</div>';const n=t.map(b=>b*100),i=Math.min(...n),l=Math.max(...n),s=12,h=(l-i)/s||1,o=new Array(s).fill(0);n.forEach(b=>{let v=Math.floor((b-i)/h);v>=s&&(v=s-1),v<0&&(v=0),o[v]++});const g=900,d=200,c=24,p=Math.max(...o,1),f=(g-c*2)/s,k=o.map((b,v)=>{const a=b/p*(d-c*2),m=c+v*f,u=d-c-a,w=i+v*h>=0?"#4ade80":"#f47174";return`<rect x="${m+1}" y="${u}" width="${f-2}" height="${a}" fill="${w}" opacity="0.7"/>`}).join(""),e=c+(0-i)/(l-i||1)*(g-c*2);return`<svg viewBox="0 0 ${g} ${d}" style="width:100%;height:${d}px;">
    ${k}
    <line x1="${e}" y1="${c}" x2="${e}" y2="${d-c}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:4px;">
    <span>${i.toFixed(1)}%</span><span>0%</span><span>${l.toFixed(1)}%</span>
  </div>`}function Z(t,n){const i=["Win Rate","Esperanza","Profit Factor","Kelly"],l=v=>v?[v.winRate,Math.max(0,Math.min(1,v.esperanza+.3)),Math.min((v.profitFactor===1/0?3:v.profitFactor)/3,1),Math.max(0,Math.min(1,(v.kelly||0)+.3))]:[0,0,0,0],s=l(t),h=l(n),o=150,g=150,d=110,c=4,p=(v,a)=>{const m=Math.PI*2*a/c-Math.PI/2,u=d*Math.max(0,Math.min(1,v));return`${o+u*Math.cos(m)},${g+u*Math.sin(m)}`},f=s.map((v,a)=>p(v,a)).join(" "),k=h.map((v,a)=>p(v,a)).join(" "),e=Array.from({length:c}).map((v,a)=>{const m=Math.PI*2*a/c-Math.PI/2;return`<line x1="${o}" y1="${g}" x2="${o+d*Math.cos(m)}" y2="${g+d*Math.sin(m)}" stroke="var(--border)" stroke-width="1"/>`}).join(""),b=i.map((v,a)=>{const m=Math.PI*2*a/c-Math.PI/2,u=o+(d+22)*Math.cos(m),D=g+(d+22)*Math.sin(m);return`<text x="${u}" y="${D}" font-size="9" fill="var(--text3)" text-anchor="middle" font-family="var(--mono)">${v}</text>`}).join("");return`<svg viewBox="0 0 300 300" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
    <circle cx="${o}" cy="${g}" r="${d}" fill="none" stroke="var(--border)" stroke-width="1"/>
    <circle cx="${o}" cy="${g}" r="${d*.5}" fill="none" stroke="var(--border)" stroke-width="0.5"/>
    ${e}
    <polygon points="${f}" fill="rgba(74,222,128,0.12)" stroke="#4ade80" stroke-width="1.5"/>
    <polygon points="${k}" fill="rgba(244,113,116,0.10)" stroke="#f47174" stroke-width="1.5"/>
    ${b}
  </svg>
  <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:9px;font-family:var(--mono);">
    <span style="color:#4ade80;">■ Alcista</span><span style="color:#f47174;">■ Bajista</span>
  </div>`}async function at(t,{actionsSlot:n}){var s;n.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',t.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function i(){const h=document.getElementById("gen-content");h.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Reconstruyendo NAV diario real...</div><div class="empty-desc">Descargando histórico de precios — puede tardar según el número de tickers</div></div>';const[o,g,d,c,p,f]=await Promise.all([P.get("ethan_positions").then(a=>a||[]),P.get("ethan_positions_history").then(a=>a||[]),P.get("ethan_capital_alcista"),P.get("ethan_capital_bajista"),P.get("ethan_satelite_assets").then(a=>a||[]),P.get("ethan_core_pct")]),k={};await Promise.all(o.map(async a=>{k[a.ticker]=await _(a.ticker)}));const e=[...o.filter(a=>a.entryDate).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDate,exitDate:null})),...g.filter(a=>a.entryDateISO).map(a=>({ticker:a.ticker,direction:a.direction||"alcista",entry:a.entry,shares:a.shares,cost:a.cost,entryDate:a.entryDateISO,exitDate:a.exitDateISO}))];let b=null,v=null;e.length>0&&(b=await U(e),v=G(b)),l(o,g,d,c,p,f,k,b,v)}function l(h,o,g,d,c,p,f,k,e){const b=document.getElementById("gen-content"),v=o.filter(y=>(y.direction||"alcista")==="alcista"),a=o.filter(y=>y.direction==="bajista"),m=j(v),u=j(a),D=j(o),w=(g||0)+(d||0);let R=0,r=0,x=0;h.forEach(y=>{const S=f[y.ticker],C=y.shares&&S?y.shares*S:y.cost||0;if((y.direction||"alcista")==="alcista"?R+=C:r+=C,S&&y.entry){const F=y.direction==="bajista"?(y.entry-S)/y.entry*100:(S-y.entry)/y.entry*100;y.cost&&(x+=y.cost*F/100)}}),b.innerHTML=`
      <!-- KPIs OPERACIONALES -->
      <div class="gen-section-title">📊 Rentabilidad por Operaciones — Global</div>
      ${q(D)}

      <!-- NAV REAL -->
      <div class="gen-section-title" style="margin-top:24px;">📈 Rendimiento Real (Time-Weighted) — Marcado a Mercado</div>
      ${e?`
        ${X(e)}
        ${K(e)}
        ${e.twrSeries?`
        <div class="gen-compare-grid" style="margin-top:14px;">
          <div class="gen-chart-box">
            <div class="gen-chart-title">Índice de Rendimiento (base 100, neutraliza aportaciones de capital)</div>
            ${J(e.twrSeries,k)}
          </div>
          <div class="gen-chart-box">
            <div class="gen-chart-title">Drawdown a lo largo del tiempo</div>
            ${Y(e.twrSeries)}
          </div>
        </div>`:""}
      `:'<div class="sc2-empty">Necesitas posiciones con fecha de entrada para reconstruir el rendimiento real</div>'}

      <!-- DISTRIBUCIÓN DE RETORNOS -->
      ${D?`
      <div class="gen-section-title" style="margin-top:24px;">📐 Distribución de Retornos por Operación</div>
      <div class="gen-chart-box">
        <div class="gen-chart-title">Histograma (% por operación)</div>
        ${Q(o.map(y=>y.pnlPct/100))}
      </div>`:""}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-chart-box"><div class="gen-chart-title">Radar comparativo</div>${Z(m,u)}</div>
        <div class="gen-ratio-card">
          <div class="gen-chart-title">💰 P/L Resumen</div>
          <div class="gen-ratio-row"><span>P/L Alcista</span><strong style="color:var(--green)">${m&&m.hasAbsData?M(m.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Bajista</span><strong style="color:var(--red)">${u&&u.hasAbsData?M(u.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>P/L Total</span><strong style="color:${D&&D.totalPL>=0?"var(--green)":"var(--red)"}">${D&&D.hasAbsData?M(D.totalPL):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Esperanza Global</span><strong style="color:${D&&D.esperanza>=0?"var(--green)":"var(--red)"}">${D?I(D.esperanza):"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Alcista</span><strong>${(m==null?void 0:m.kelly)!=null?(m.kelly*100).toFixed(1)+"%":"—"}</strong></div>
          <div class="gen-ratio-row"><span>Kelly Bajista</span><strong>${(u==null?void 0:u.kelly)!=null?(u.kelly*100).toFixed(1)+"%":"—"}</strong></div>
        </div>
      </div>

      <!-- EXPOSICIÓN ACTUAL -->
      <div class="gen-section-title" style="margin-top:24px;">📂 Exposición Actual (Posiciones Abiertas)</div>
      <div class="gen-hero">
        <div class="gen-hero-card"><div class="gen-hero-label">Capital Total Asignado</div><div class="gen-hero-value">${w>0?M(w):"—"}</div><div class="gen-hero-sub">Alcista ${M(g||0)} · Bajista ${M(d||0)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">P&L No Realizado</div><div class="gen-hero-value" style="color:${x>=0?"var(--green)":"var(--red)"}">${(x>=0?"+":"")+M(x)}</div><div class="gen-hero-sub">${h.length} posiciones abiertas</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Long</div><div class="gen-hero-value" style="color:var(--green)">${M(R)}</div></div>
        <div class="gen-hero-card"><div class="gen-hero-label">Exposición Short</div><div class="gen-hero-value" style="color:var(--red)">${M(r)}</div></div>
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
            ${c.length>0?c.map(y=>`<span class="rf-custom-chip">${typeof y=="string"?y:y.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">Última actualización: ${new Date().toLocaleString("es-ES")}</div>
    `}return(s=document.getElementById("gen-refresh-btn"))==null||s.addEventListener("click",i),i(),{destroy(){}}}export{at as render};
