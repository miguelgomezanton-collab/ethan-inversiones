import{U as E}from"./userdata-n3nGJAZW.js";import"./index-xG_i8sKu.js";const j=[s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://corsproxy.io/?${encodeURIComponent(s)}`,s=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(s)}`,s=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(s)}`];async function q(s){var o,n,$,A;const d=`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=5d`;for(const i of j)try{const y=await fetch(i(d),{signal:AbortSignal.timeout(6e3)});if(!y.ok)continue;const v=JSON.parse(await y.text());return((A=($=(n=(o=v==null?void 0:v.chart)==null?void 0:o.result)==null?void 0:n[0])==null?void 0:$.meta)==null?void 0:A.regularMarketPrice)||null}catch{}return null}function D(s){if(s.length===0)return null;const d=s.filter(t=>t.pnlPct>0),o=s.filter(t=>t.pnlPct<=0),n=d.length/s.length*100,$=d.length?d.reduce((t,a)=>t+a.pnlPct,0)/d.length:0,A=o.length?o.reduce((t,a)=>t+a.pnlPct,0)/o.length:0,i=s.reduce((t,a)=>t+a.pnlPct,0)/s.length,y=n/100*$+(1-n/100)*A,v=s.reduce((t,a)=>t+(a.pnlAbs||0),0),w=s.some(t=>t.pnlAbs!=null),g=i,f=s.reduce((t,a)=>t+Math.pow(a.pnlPct-g,2),0)/s.length,p=Math.sqrt(f),P=p>0?i/p:0,l=Math.min(...s.map(t=>t.pnlPct)),u=[...s].sort((t,a)=>(t.closedAt||0)-(a.closedAt||0));let r=100,b=100,S=0;return u.forEach(t=>{r*=1+t.pnlPct/100,r>b&&(b=r);const a=(b-r)/b*100;a>S&&(S=a)}),{nOps:s.length,winRate:n,avgPnlPct:i,expectancy:y,totalPnlAbs:v,hasAbsData:w,stdDev:p,sharpe:P,maxLoss:l,maxDD:S}}function z(s){const d=s.filter(n=>n.pnlPct>0).reduce((n,$)=>n+$.pnlPct,0),o=Math.abs(s.filter(n=>n.pnlPct<=0).reduce((n,$)=>n+$.pnlPct,0));return o>0?d/o:d>0?1/0:0}async function V(s,{actionsSlot:d}){var A;d.innerHTML='<button class="btn btn-primary" id="gen-refresh-btn">↻ Actualizar</button>',s.innerHTML='<div id="gen-content"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando análisis...</div></div></div>';async function o(){const i=document.getElementById("gen-content");i.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Calculando métricas de cartera...</div></div>';const[y,v,w,g,f,p]=await Promise.all([E.get("ethan_positions").then(l=>l||[]),E.get("ethan_positions_history").then(l=>l||[]),E.get("ethan_capital_alcista"),E.get("ethan_capital_bajista"),E.get("ethan_satelite_assets").then(l=>l||[]),E.get("ethan_core_pct")]),P={};await Promise.all(y.map(async l=>{const u=await q(l.ticker);P[l.ticker]=u})),n(y,v,w,g,f,p,P)}function n(i,y,v,w,g,f,p){const P=document.getElementById("gen-content");i.filter(e=>(e.direction||"alcista")==="alcista"),i.filter(e=>e.direction==="bajista");let l=0,u=0,r=0;i.forEach(e=>{const h=p[e.ticker],k=e.shares&&h?e.shares*h:e.cost||0;if((e.direction||"alcista")==="alcista"?l+=k:u+=k,h&&e.entry){const _=e.direction==="bajista"?(e.entry-h)/e.entry*100:(h-e.entry)/e.entry*100,F=e.cost?e.cost*_/100:null;F!=null&&(r+=F)}});const b=(v||0)+(w||0),S=l+u,t=y,a=D(t),m=D(t.filter(e=>(e.direction||"alcista")==="alcista")),x=D(t.filter(e=>e.direction==="bajista")),I=t.reduce((e,h)=>e+(h.pnlAbs||0),0),L=t.some(e=>e.pnlAbs!=null),M=z(t),B=[...t].sort((e,h)=>(e.closedAt||0)-(h.closedAt||0));let O=100;const T=B.map(e=>(O*=1+e.pnlPct/100,O)),c=(e,h=2)=>e!=null&&!isNaN(e)&&isFinite(e)?e.toFixed(h):"—",R=e=>e>=0?"+":"",C=e=>e>=0?"var(--green)":"var(--red)";P.innerHTML=`
      <!-- RESUMEN GLOBAL -->
      <div class="gen-hero">
        <div class="gen-hero-card">
          <div class="gen-hero-label">Capital Total Asignado</div>
          <div class="gen-hero-value">${b>0?"$"+b.toFixed(0):"—"}</div>
          <div class="gen-hero-sub">Alcista $${(v||0).toFixed(0)} · Bajista $${(w||0).toFixed(0)}</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">P&L Realizado (histórico)</div>
          <div class="gen-hero-value" style="color:${L?C(I):"var(--text3)"}">${L?R(I)+"$"+I.toFixed(0):"Sin coste asignado"}</div>
          <div class="gen-hero-sub">${t.length} operaciones cerradas</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">P&L No Realizado (abiertas)</div>
          <div class="gen-hero-value" style="color:${C(r)}">${R(r)}$${r.toFixed(0)}</div>
          <div class="gen-hero-sub">${i.length} posiciones abiertas</div>
        </div>
        <div class="gen-hero-card">
          <div class="gen-hero-label">Exposición Actual</div>
          <div class="gen-hero-value">$${S.toFixed(0)}</div>
          <div class="gen-hero-sub">Long $${l.toFixed(0)} · Short $${u.toFixed(0)}</div>
        </div>
      </div>

      <!-- RENTABILIDAD / RIESGO / EFICIENCIA -->
      <div class="gen-section-title">📊 Rentabilidad, Riesgo y Eficiencia — Global</div>
      ${a?`
      <div class="gen-metrics-grid">
        <div class="gen-mtile"><div class="gen-mtile-lbl">Operaciones Totales</div><div class="gen-mtile-val">${a.nOps}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ratio Win</div><div class="gen-mtile-val" style="color:${a.winRate>=50?"var(--green)":"var(--amber)"}">${c(a.winRate,1)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ganancia Media</div><div class="gen-mtile-val" style="color:${C(a.avgPnlPct)}">${R(a.avgPnlPct)}${c(a.avgPnlPct)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Esperanza Matemática</div><div class="gen-mtile-val" style="color:${C(a.expectancy)}">${R(a.expectancy)}${c(a.expectancy)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Profit Factor</div><div class="gen-mtile-val" style="color:${M>=1.5?"var(--green)":M>=1?"var(--amber)":"var(--red)"}">${isFinite(M)?c(M):"∞"}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Ratio Sharpe</div><div class="gen-mtile-val" style="color:${a.sharpe>=1?"var(--green)":a.sharpe>=0?"var(--amber)":"var(--red)"}">${c(a.sharpe)}</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Volatilidad Media</div><div class="gen-mtile-val">${c(a.stdDev)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Máximo Drawdown</div><div class="gen-mtile-val" style="color:var(--red)">-${c(a.maxDD)}%</div></div>
        <div class="gen-mtile"><div class="gen-mtile-lbl">Máxima Pérdida (op.)</div><div class="gen-mtile-val" style="color:var(--red)">${c(a.maxLoss)}%</div></div>
      </div>
      `:'<div class="sc2-empty">Sin operaciones cerradas todavía — cierra posiciones en el módulo Cartera para ver métricas</div>'}

      <!-- COMPARATIVA ALCISTA VS BAJISTA -->
      <div class="gen-section-title" style="margin-top:24px;">⚖️ Comparativa Alcista vs Bajista</div>
      <div class="gen-compare-grid">
        <div class="gen-compare-col">
          <div class="gen-compare-head long">📈 ALCISTA</div>
          ${m?`
            <div class="gen-compare-row"><span>Operaciones</span><strong>${m.nOps}</strong></div>
            <div class="gen-compare-row"><span>Win Rate</span><strong style="color:${m.winRate>=50?"var(--green)":"var(--amber)"}">${c(m.winRate,1)}%</strong></div>
            <div class="gen-compare-row"><span>P&L Medio</span><strong style="color:${C(m.avgPnlPct)}">${R(m.avgPnlPct)}${c(m.avgPnlPct)}%</strong></div>
            <div class="gen-compare-row"><span>Sharpe</span><strong>${c(m.sharpe)}</strong></div>
            <div class="gen-compare-row"><span>Max DD</span><strong style="color:var(--red)">-${c(m.maxDD)}%</strong></div>
          `:'<div class="sc2-empty">Sin datos</div>'}
        </div>
        <div class="gen-compare-col">
          <div class="gen-compare-head short">📉 BAJISTA</div>
          ${x?`
            <div class="gen-compare-row"><span>Operaciones</span><strong>${x.nOps}</strong></div>
            <div class="gen-compare-row"><span>Win Rate</span><strong style="color:${x.winRate>=50?"var(--green)":"var(--amber)"}">${c(x.winRate,1)}%</strong></div>
            <div class="gen-compare-row"><span>P&L Medio</span><strong style="color:${C(x.avgPnlPct)}">${R(x.avgPnlPct)}${c(x.avgPnlPct)}%</strong></div>
            <div class="gen-compare-row"><span>Sharpe</span><strong>${c(x.sharpe)}</strong></div>
            <div class="gen-compare-row"><span>Max DD</span><strong style="color:var(--red)">-${c(x.maxDD)}%</strong></div>
          `:'<div class="sc2-empty">Sin datos</div>'}
        </div>
      </div>

      <!-- CURVA DE EQUITY -->
      ${T.length>1?`
      <div class="gen-section-title" style="margin-top:24px;">📈 Curva de Equity (base 100)</div>
      <div class="gen-equity-chart">
        ${$(T)}
      </div>`:""}

      <!-- COMPOSICIÓN CORE/SATÉLITE -->
      <div class="gen-section-title" style="margin-top:24px;">🧩 Composición Asset Allocation</div>
      <div class="gen-alloc-row">
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Split CORE / Satélite</div>
          <div class="gen-alloc-bar">
            <div class="gen-alloc-bar-core" style="width:${f||70}%"></div>
            <div class="gen-alloc-bar-sat" style="width:${100-(f||70)}%"></div>
          </div>
          <div class="gen-alloc-legend">
            <span><span class="gen-dot core"></span>CORE ${f||70}%</span>
            <span><span class="gen-dot sat"></span>Satélite ${100-(f||70)}%</span>
          </div>
        </div>
        <div class="gen-alloc-card">
          <div class="gen-alloc-label">Activos en Cesta Satélite</div>
          <div class="gen-alloc-chips">
            ${g.length>0?g.map(e=>`<span class="rf-custom-chip">${typeof e=="string"?e:e.ticker}</span>`).join(""):'<span class="sc2-empty" style="padding:0;">Sin activos en la cesta satélite</span>'}
          </div>
        </div>
      </div>

      <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:20px;text-align:right;">
        Última actualización: ${new Date().toLocaleString("es-ES")}
      </div>
    `}function $(i){const g=Math.min(...i,100),p=Math.max(...i,100)-g||1,P=860/Math.max(1,i.length-1),l=i.map((S,t)=>{const a=20+t*P,m=160-(S-g)/p*140;return`${a},${m}`}).join(" "),u=160-(100-g)/p*140,r=i[i.length-1],b=r>=100?"#4ade80":"#f47174";return`
      <svg viewBox="0 0 900 180" style="width:100%;height:180px;">
        <line x1="20" y1="${u}" x2="880" y2="${u}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
        <polyline points="${l}" fill="none" stroke="${b}" stroke-width="2"/>
        <circle cx="${20+(i.length-1)*P}" cy="${160-(r-g)/p*140}" r="4" fill="${b}"/>
      </svg>`}return(A=document.getElementById("gen-refresh-btn"))==null||A.addEventListener("click",o),o(),{destroy(){}}}export{V as render};
