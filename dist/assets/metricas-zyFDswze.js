const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/fondo-BNdtPYYf.js","assets/userdata-DxgjZ95P.js","assets/index-BuBCrzrQ.js","assets/index-CirJMAu0.css"])))=>i.map(i=>d[i]);
import{_ as X}from"./index-BuBCrzrQ.js";import{U as I}from"./userdata-DxgjZ95P.js";const D=(t,d=2)=>t!=null&&isFinite(t)?(t>=0?"+":"")+t.toFixed(d)+"%":"—",g=t=>t!=null&&isFinite(t)?(t<0?"-":"")+"€"+Math.abs(t).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",W=(t,d=2)=>t!=null&&isFinite(t)?t.toFixed(d):"—",M=t=>t?new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";function J(t,d,p){if(!p||p<=0)return null;const y=new Date().toISOString().slice(0,10),m=(t||[]).reduce((o,i)=>o+(i.pnlAbs||0),0),s=(d||[]).reduce((o,i)=>{const F=i.currentPrice||i.entry;if(!F||!i.entry||!i.shares)return o;const _=(i.direction||"alcista")==="bajista"?(i.entry-F)*i.shares:(F-i.entry)*i.shares;return o+_},0),b=(d||[]).reduce((o,i)=>{const F=i.currentPrice||i.entry;return o+(F&&i.shares?F*i.shares:i.cost||0)},0),x=p+m+s,a=Math.max(0,p-b+m),e=(x-p)/p,f=[...(t||[]).map(o=>o.entryDateISO).filter(Boolean),...(d||[]).map(o=>o.entryDate).filter(Boolean)].sort()[0]||y,u=Math.round((new Date(y)-new Date(f))/864e5),r=Math.round(u*252/365),v=r>0?Math.pow(Math.max(1+e,.001),252/r)-1:e,S=[...(t||[]).map(o=>(o.pnlPct||0)/100),...(d||[]).map(o=>{const i=o.currentPrice||o.entry;return!i||!o.entry?0:(o.direction||"alcista")==="bajista"?(o.entry-i)/o.entry:(i-o.entry)/o.entry})],z=S.length,l=z?S.reduce((o,i)=>o+i,0)/z:0,$=z?S.reduce((o,i)=>o+(i-l)**2,0)/z:0,P=u>0?z/(u/365):z,h=Math.sqrt($*P),j=h>0?v/h:0,k=S.filter(o=>o<0),L=k.length>0,E=L?Math.sqrt(k.reduce((o,i)=>o+i**2,0)/k.length*P):0,V=E>0?v/E:null,B=[...(t||[]).map(o=>({r:1+(o.pnlPct||0)/100,date:o.entryDateISO||""})),...(d||[]).map(o=>{const i=o.currentPrice||o.entry;return{r:i&&o.entry?(o.direction||"alcista")==="bajista"?1+(o.entry-i)/o.entry:i/o.entry:1,date:o.entryDate||""}})].filter(o=>o.date).sort((o,i)=>o.date.localeCompare(i.date)),n=[100];let w=1;B.forEach(o=>{w*=o.r,n.push(+(w*100).toFixed(3))});const c=p*Math.max(...n)/100,C=c>0?(x-c)/c:0,H=x-c;let T=100,N=0,G=f,Y=f;n.forEach((o,i)=>{var _;o>T&&(T=o);const F=(T-o)/T;F>N&&(N=F,Y=((_=B[i-1])==null?void 0:_.date)||f)});const U=N>0?v/N:null;return y.slice(0,4),y.slice(0,7),{totalReturn:e,annReturn:v,nDays:u,tradingDays:r,ytd:e,mtd:null,annVol:h,sharpe:j,sortino:V,calmar:U,hasNegOps:L,maxDD:N,ddStart:G,ddTrough:Y,maxHistorico:c,drawdownActual:C,desdeMaximo:H,twrSeries:n,startDate:f,pnlRealizado:m,pnlNoRealizado:s,capitalActual:x,capitalInvertido:b,cash:a}}function q(t){if(!(t!=null&&t.length))return null;const d=t.filter(r=>r.pnlPct>0),p=t.filter(r=>r.pnlPct<=0),y=d.length/t.length,m=d.length?d.reduce((r,v)=>r+v.pnlPct,0)/d.length:0,s=p.length?Math.abs(p.reduce((r,v)=>r+v.pnlPct,0)/p.length):0,b=t.reduce((r,v)=>r+(v.pnlAbs||0),0),x=s>0?y*m/((1-y)*s):null,a=y*m/100-(1-y)*s/100,e=s>0?m/s:null,R=t.reduce((r,v)=>r+(v.pnlPct||0),0)/t.length,f=t.filter(r=>r.entryDateISO&&r.exitDateISO),u=f.length?Math.round(f.reduce((r,v)=>r+Math.round((new Date(v.exitDateISO)-new Date(v.entryDateISO))/864e5),0)/f.length):null;return{winRate:y,avgWin:m,avgLoss:s,profitFactor:x,esperanza:a,payoff:e,totalPL:b,avgReturn:R,avgDays:u,n:t.length,hasAbs:t.some(r=>r.pnlAbs)}}function K(t){if(!t||t.length<2)return'<div style="height:140px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:11px;font-family:var(--mono);">Sin datos suficientes</div>';const d=800,p=140,y=Math.min(...t),s=Math.max(...t)-y||1,b=r=>r/(t.length-1)*d,x=r=>p-(r-y)/s*p,a=t.map((r,v)=>`${b(v).toFixed(1)},${x(r).toFixed(1)}`).join(" "),e=t[t.length-1],R=e>=100?"#40d9c0":"#f47174",f=x(100).toFixed(1),u=`${b(0).toFixed(1)},${p} ${a} ${d},${p}`;return`<svg viewBox="0 0 ${d} ${p}" style="width:100%;height:${p}px;display:block;">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${R}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${R}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${f}" x2="${d}" y2="${f}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <polygon points="${u}" fill="url(#tg)"/>
    <polyline points="${a}" fill="none" stroke="${R}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${d}" cy="${x(e).toFixed(1)}" r="4" fill="${R}"/>
  </svg>`}function O(t,d,p){return`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);">
    <span style="font-size:11px;color:var(--text2);">${t}</span>
    <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${p||"var(--text1)"};">${d}</span>
  </div>`}const Q=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`];async function Z(t){var m,s,b,x,a;const d=Math.round((Date.now()-new Date(t))/864e5),y=`https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=${d>365?"2y":d>180?"1y":"6mo"}`;for(const e of Q)try{const R=await fetch(e(y),{signal:AbortSignal.timeout(6e3)});if(!R.ok)continue;const f=JSON.parse(await R.text()),u=(s=(m=f==null?void 0:f.chart)==null?void 0:m.result)==null?void 0:s[0];if(!u)continue;const r=u.timestamp||u.timestamps,v=(a=(x=(b=u.indicators)==null?void 0:b.quote)==null?void 0:x[0])==null?void 0:a.close;if(!r||!v||v.length<2)continue;const S=new Date(t).getTime();let z=0;for(let P=0;P<r.length;P++)if(r[P]*1e3>=S){z=P;break}const l=v[z],$=v[v.length-1];if(!l||!$)continue;return{return:($-l)/l,priceStart:l,priceEnd:$}}catch{}return null}function A(t,d,p,y,m){return`<div class="pm-mc">
    <div class="pm-mc-name">${t}</div>
    <div class="pm-mc-row">
      <span class="pm-mc-val">${d}</span>
      ${p?`<span class="pm-mc-badge ${y}">${p}</span>`:""}
    </div>
    <div class="pm-mc-note">${m}</div>
  </div>`}const aa=`
.pm-wrap{font-family:var(--sans);}
.pm-tabs2{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:18px;}
.pm-tab2{padding:9px 18px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);}
.pm-tab2.active{color:var(--teal);border-bottom-color:var(--teal);}
.pm-panel2{display:none;}.pm-panel2.active{display:block;}

.pm-hero2{display:grid;grid-template-columns:260px 1fr;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--surface);margin-bottom:16px;}
.pm-hero-left{padding:22px 24px;border-right:1px solid var(--border);display:flex;flex-direction:column;gap:14px;}
.pm-hero-main{display:flex;flex-direction:column;gap:3px;}
.pm-hero-lbl{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);}
.pm-hero-val{font-family:var(--serif);font-size:36px;font-weight:600;font-style:italic;line-height:1;}
.pm-hero-sub{font-family:var(--mono);font-size:11px;}
.pm-hero-stack{display:flex;flex-direction:column;gap:0;}
.pm-hero-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:11px;}
.pm-hero-row:last-child{border-bottom:none;}
.pm-hero-row-lbl{color:var(--text3);}
.pm-hero-row-val{font-family:var(--mono);font-weight:600;}
.pm-chart-right{padding:18px 20px 12px;display:flex;flex-direction:column;gap:10px;}
.pm-chart-top{display:flex;justify-content:space-between;align-items:center;}
.pm-chart-lbl{font-size:9px;font-family:var(--mono);color:var(--text3);}

.pm-dd-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.pm-dd-cell{background:var(--surface);padding:12px 16px;}
.pm-dd-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.pm-dd-val{font-family:var(--mono);font-size:18px;font-weight:700;}
.pm-dd-sub{font-size:10px;color:var(--text3);margin-top:3px;}

/* ── Cards con descripción (estilo anterior) ── */
.pm-eyebrow{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.pm-eyebrow::after{content:"";flex:1;height:1px;background:var(--border);}
.pm-section-lbl{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.pm-section-lbl .pm-dash{width:10px;height:1.5px;background:var(--teal);}
.pm-section-lbl span{font-family:var(--mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--teal);}
.pm-section-lbl small{font-size:11px;color:var(--text3);text-transform:none;letter-spacing:0;}
.pm-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:20px;}
.pm-mc{background:var(--surface);padding:18px 20px;transition:background 0.15s;}
.pm-mc:hover{background:var(--surface2);}
.pm-mc-name{font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:10px;}
.pm-mc-row{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;}
.pm-mc-val{font-family:var(--mono);font-size:22px;font-weight:500;}
.pm-mc-badge{font-family:var(--mono);font-size:9px;padding:2px 7px;border-radius:3px;}
.pm-mc-badge.good{color:var(--green);background:rgba(74,222,128,0.1);}
.pm-mc-badge.warn{color:var(--amber);background:rgba(251,191,36,0.1);}
.pm-mc-badge.bad{color:var(--red);background:rgba(244,113,116,0.1);}
.pm-mc-badge.neu{color:var(--text3);background:var(--surface2);}
.pm-mc-note{font-size:10.5px;color:var(--text3);line-height:1.55;}

.pm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.pm-card2{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;}
.pm-card2-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:10px;}

.pm-debug{background:#0d1500;border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:14px 16px;margin-bottom:16px;font-family:var(--mono);font-size:10px;line-height:1.9;color:var(--text3);}
.pm-debug-title{color:var(--amber);font-weight:700;font-size:11px;margin-bottom:8px;}
.pm-debug-row{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.04);padding:3px 0;}
.pm-debug-lbl{color:var(--text3);}
.pm-debug-val{color:var(--text2);font-weight:600;}

.pm-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;}
.pm-stat{background:var(--surface);padding:14px 16px;}
.pm-stat-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.pm-stat-val{font-family:var(--mono);font-size:20px;font-weight:700;margin-bottom:3px;}
.pm-stat-sub{font-size:10px;color:var(--text3);}
`;async function na(t,{actionsSlot:d}){var m;if(!document.getElementById("pm-css2")){const s=document.createElement("style");s.id="pm-css2",s.textContent=aa,document.head.appendChild(s)}d.innerHTML='<button class="btn btn-primary" id="pm-refresh">↻ Actualizar</button>',t.innerHTML='<div class="pm-wrap" id="pm-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando métricas...</div></div></div>';async function p(){const s=document.getElementById("pm-wrap");s.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Leyendo Firestore...</div></div>';try{const b=await I.get("ethan_positions").then(h=>h||[]),x=await I.get("ethan_positions_history").then(h=>h||[]),a=await I.get("ethan_capital_alcista")||0,e=await I.get("ethan_capital_bajista")||0,R=await I.get("ethan_satelite_assets").then(h=>h||[]),f=await I.get("ethan_core_pct")||70;if(!b.length&&!x.length){s.innerHTML='<div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Sin operaciones</div><div class="empty-desc">Registra operaciones en Cartera para ver las métricas.</div></div>';return}const u=a+e,r=J(x,b,u),v=q(x),S=q(x.filter(h=>(h.direction||"alcista")==="alcista")),z=q(x.filter(h=>h.direction==="bajista"));let l=null;try{const{getFondo:h,calcMetricasFondo:j}=await X(async()=>{const{getFondo:L,calcMetricasFondo:E}=await import("./fondo-BNdtPYYf.js");return{getFondo:L,calcMetricasFondo:E}},__vite__mapDeps([0,1,2,3])),k=await h();k&&(r!=null&&r.capitalActual)&&(l=j(k,r.capitalActual))}catch(h){console.warn("Fondo no disponible:",h.message)}const $=l?{...r,vlActual:l.vlActual,vlInicial:l.vlInicial,participaciones:l.participaciones,serieBase100:l.serieBase100,maxHistoricoVL:l.maxHistoricoVL,maxHistoricoEur:l.maxHistoricoEur,...l.nDays>10?{totalReturn:l.totalReturn,annReturn:l.annReturn,maxDD:l.maxDD,drawdownActual:l.drawdownActual,desdeMaximoEur:l.desdeMaximoEur,calmar:l.calmar}:{}}:r;let P=null;$!=null&&$.startDate&&(P=await Promise.race([Z($.startDate),new Promise(h=>setTimeout(()=>h(null),6e3))]).catch(()=>null)),y(s,b,x,$,v,S,z,u,R,f,a,e,P)}catch(b){console.error("Métricas:",b),document.getElementById("pm-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${b.message}</div></div>`}}function y(s,b,x,a,e,R,f,u,r,v,S,z,l){var L,E,V,B;const $=(a==null?void 0:a.totalReturn)??0,P=$>=0?"var(--green)":"var(--red)",j=!b.some(n=>n.currentPrice)&&b.length?`<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:var(--amber);">
          ⚠ Abre <strong>Cartera</strong> para actualizar los precios de las posiciones abiertas. Métricas usa el precio guardado allí.
        </div>`:"",k=`<div class="pm-debug">
      <div class="pm-debug-title">🔍 Reconciliación de capital</div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">Capital inicial (Alcista)</span><span class="pm-debug-val">${g(S)}</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">Capital inicial (Bajista)</span><span class="pm-debug-val">${g(z)}</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">Capital invertido (posiciones abiertas)</span><span class="pm-debug-val">${g(a==null?void 0:a.capitalInvertido)}</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">Cash disponible (estimado)</span><span class="pm-debug-val">${g(a==null?void 0:a.cash)}</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">P&L realizado (operaciones cerradas)</span><span class="pm-debug-val" style="color:var(--green)">${g(a==null?void 0:a.pnlRealizado)}</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl">P&L no realizado (posiciones abiertas)</span><span class="pm-debug-val" style="color:${((a==null?void 0:a.pnlNoRealizado)||0)>=0?"var(--green)":"var(--red)"}">${g(a==null?void 0:a.pnlNoRealizado)}</span></div>
      <div class="pm-debug-row" style="border-top:1px solid rgba(255,255,255,0.1);margin-top:4px;padding-top:6px;"><span class="pm-debug-lbl" style="color:var(--text2);font-weight:700;">Valor cartera = inicial + realizado + no realizado</span><span class="pm-debug-val" style="color:var(--teal);font-size:13px;">${g(a==null?void 0:a.capitalActual)}</span></div>
      ${(a==null?void 0:a.vlActual)!=null?`<div class="pm-debug-row"><span class="pm-debug-lbl" style="color:var(--teal);">VL por participación</span><span class="pm-debug-val" style="color:var(--teal);">${a.vlActual.toFixed(4)} (inicio: ${((L=a.vlInicial)==null?void 0:L.toFixed(2))||"100"})</span></div>
      <div class="pm-debug-row"><span class="pm-debug-lbl" style="color:var(--teal);">Participaciones totales</span><span class="pm-debug-val" style="color:var(--teal);">${((E=a.participaciones)==null?void 0:E.toFixed(4))||"—"}</span></div>`:'<div class="pm-debug-row"><span class="pm-debug-lbl">Fondo por participaciones</span><span class="pm-debug-val" style="color:var(--amber);">No inicializado — guarda el capital en Cartera para activar</span></div>'}
      ${b.map(n=>`<div class="pm-debug-row"><span class="pm-debug-lbl">${n.ticker} · precio ${n.currentPrice?"actual":"entrada"}</span><span class="pm-debug-val">${n.currentPrice||n.entry} × ${n.shares} = ${g((n.currentPrice||n.entry)*n.shares)}</span></div>`).join("")}
    </div>`;s.innerHTML=`
      ${j}
      ${k}

      <!-- Tabs -->
      <div class="pm-tabs2">
        <button class="pm-tab2 active" data-tab2="cartera">📊 Cartera</button>
        <button class="pm-tab2" data-tab2="trading">📈 Trading</button>
      </div>

      <!-- ══ TAB CARTERA ══ -->
      <div class="pm-panel2 active" id="pm-panel-cartera">

        <!-- Hero -->
        <div class="pm-hero2">
          <div class="pm-hero-left">
            <div class="pm-hero-main">
              <div class="pm-hero-lbl">Valor total de la cartera</div>
              <div class="pm-hero-val" style="color:var(--teal);">${g((a==null?void 0:a.capitalActual)||u)}</div>
              <div class="pm-hero-sub" style="color:${P};">${D($*100)} desde el ${M(a==null?void 0:a.startDate)}</div>
            </div>
            <div class="pm-hero-stack">
              ${O("Cash disponible",g(a==null?void 0:a.cash),"var(--text2)")}
              ${O("Invertido",g(a==null?void 0:a.capitalInvertido),"var(--text2)")}
              ${O("P&L Realizado",g(a==null?void 0:a.pnlRealizado),"var(--green)")}
              ${O("P&L No Realizado",g(a==null?void 0:a.pnlNoRealizado),((a==null?void 0:a.pnlNoRealizado)||0)>=0?"var(--green)":"var(--red)")}
            </div>
          </div>
          <div class="pm-chart-right">
            <div class="pm-chart-top">
              <div style="font-size:11px;font-weight:600;">TWR · base 100</div>
              <div class="pm-chart-lbl">${(a==null?void 0:a.tradingDays)||0} sesiones · desde ${M(a==null?void 0:a.startDate)}</div>
            </div>
            ${K(a==null?void 0:a.twrSeries)}
            <div style="display:flex;gap:16px;font-size:9px;font-family:var(--mono);color:var(--text3);">
              <span>100 = capital inicial</span>
              <span>Actual: ${((B=(V=a==null?void 0:a.twrSeries)==null?void 0:V[a.twrSeries.length-1])==null?void 0:B.toFixed(1))||"—"}</span>
            </div>
          </div>
        </div>

        <!-- Drawdown strip -->
        <div class="pm-dd-strip">
          <div class="pm-dd-cell">
            <div class="pm-dd-lbl">Máximo histórico</div>
            <div class="pm-dd-val" style="color:var(--green);">${g(a==null?void 0:a.maxHistorico)}</div>
            <div class="pm-dd-sub">Pico del NAV</div>
          </div>
          <div class="pm-dd-cell">
            <div class="pm-dd-lbl">Drawdown actual</div>
            <div class="pm-dd-val" style="color:${((a==null?void 0:a.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${D(((a==null?void 0:a.drawdownActual)||0)*100)}</div>
            <div class="pm-dd-sub">Desde el máximo</div>
          </div>
          <div class="pm-dd-cell">
            <div class="pm-dd-lbl">Desde máximo (€)</div>
            <div class="pm-dd-val" style="color:${((a==null?void 0:a.desdeMaximo)||0)<0?"var(--red)":"var(--green)"};">${g(a==null?void 0:a.desdeMaximo)}</div>
            <div class="pm-dd-sub">${((a==null?void 0:a.desdeMaximo)||0)>=0?"En máximos":"Recuperar"}</div>
          </div>
        </div>

        <!-- Métricas cartera — Rentabilidad -->
        <div class="pm-section-lbl"><span class="pm-dash"></span><span>Rentabilidad</span><small>— qué generó la cartera</small></div>
        <div class="pm-cards">
          ${A("TWR Total",D($*100),$>=0?"Positivo":"Negativo",$>=0?"good":"bad",`Time-Weighted Return desde el ${M(a==null?void 0:a.startDate)}. Neutraliza el efecto de aportaciones y retiradas.`)}
          ${A("CAGR Anualizado",D(((a==null?void 0:a.annReturn)||0)*100),((a==null?void 0:a.annReturn)||0)>=.1?"Bueno":((a==null?void 0:a.annReturn)||0)>=0?"Positivo":"Negativo",((a==null?void 0:a.annReturn)||0)>=.1?"good":((a==null?void 0:a.annReturn)||0)>=0?"neu":"bad",`Tasa de crecimiento anual compuesta. Fórmula: (1+TWR)^(252/${(a==null?void 0:a.tradingDays)||0}) − 1. Base: 252 sesiones/año.`)}
          ${A("YTD",D(((a==null?void 0:a.ytd)||0)*100),null,"neu","Rentabilidad acumulada desde el 1 de enero del año en curso.")}
          ${A("MTD",(a==null?void 0:a.mtd)!=null?D(a.mtd*100):"—",null,"neu","Rentabilidad del mes en curso. Requiere snapshot del valor al cierre del mes anterior.")}
          ${A("P&L Realizado",g(a==null?void 0:a.pnlRealizado),((a==null?void 0:a.pnlRealizado)||0)>=0?"Ganancia":"Pérdida",((a==null?void 0:a.pnlRealizado)||0)>=0?"good":"bad","Suma de beneficios y pérdidas de todas las operaciones cerradas.")}
          ${A("P&L No Realizado",g(a==null?void 0:a.pnlNoRealizado),((a==null?void 0:a.pnlNoRealizado)||0)>=0?"Latente+":"Latente−",((a==null?void 0:a.pnlNoRealizado)||0)>=0?"good":"warn","P&L de las posiciones aún abiertas a precio actual. Se actualiza cuando abres el módulo Cartera.")}
          ${l?A("Benchmark SPY",D(l.return*100),null,"neu",`Rentabilidad del SP500 (SPY) en el mismo período (desde ${M(a==null?void 0:a.startDate)}). Referencia de mercado.`):""}
          ${l&&a?A("Alpha",D((a.totalReturn-l.return)*100),a.totalReturn-l.return>=0?"Superando mercado":"Por debajo",a.totalReturn-l.return>=0?"good":"bad",`TWR cartera (${D(a.totalReturn*100)}) − Benchmark SPY (${D(l.return*100)}). Alpha positivo = bates al mercado.`):""}
        </div>

        <!-- Métricas cartera — Riesgo -->
        <div class="pm-section-lbl"><span class="pm-dash"></span><span>Riesgo ajustado</span><small>— si el retorno compensa la volatilidad</small></div>
        <div class="pm-cards">
          ${A("Sharpe Ratio",W(a==null?void 0:a.sharpe),((a==null?void 0:a.sharpe)||0)>=1.5?"Excelente":((a==null?void 0:a.sharpe)||0)>=1?"Sólido":((a==null?void 0:a.sharpe)||0)>=.5?"Aceptable":"Débil",((a==null?void 0:a.sharpe)||0)>=1?"good":((a==null?void 0:a.sharpe)||0)>=.5?"neu":"warn","Retorno anualizado / volatilidad total. >1 = sólido, >1.5 = excelente. Referencia: fondos top ~1.0.")}
          ${A("Sortino Ratio",(a==null?void 0:a.sortino)!=null?W(a.sortino):(a==null?void 0:a.hasNegOps)===!1?"N/A":"—",(a==null?void 0:a.sortino)!=null?a.sortino>=2?"Excelente":a.sortino>=1.5?"Bueno":"Aceptable":null,(a==null?void 0:a.sortino)!=null&&a.sortino>=1.5?"good":"neu",(a==null?void 0:a.hasNegOps)===!1?"Sin operaciones negativas todavía — se calculará en cuanto haya pérdidas.":"Como Sharpe pero penaliza solo la volatilidad bajista. >2 = gestión de riesgo sobresaliente.")}
          ${A("Calmar Ratio",(a==null?void 0:a.calmar)!=null?W(a.calmar):(a==null?void 0:a.maxDD)===0?"N/A":"—",(a==null?void 0:a.calmar)!=null?a.calmar>=1?"Bueno":"Vigilar":null,(a==null?void 0:a.calmar)!=null?a.calmar>=1?"good":"warn":"neu",(a==null?void 0:a.maxDD)===0?"Sin drawdown todavía — se calculará en cuanto haya uno.":"CAGR / Máx. Drawdown. >1 = el retorno supera el mayor dolor sufrido.")}
          ${A("Volatilidad Anual.",(a==null?void 0:a.annVol)!=null?(a.annVol*100).toFixed(1)+"%":"—",(a==null?void 0:a.annVol)!=null?a.annVol<.15?"Contenida":a.annVol<.25?"Moderada":"Alta":null,(a==null?void 0:a.annVol)!=null?a.annVol<.15?"good":a.annVol<.25?"neu":"warn":"neu","Desviación estándar de los retornos anualizada. Referencia: SP500 ~15-20%/año.")}
          ${A("Máx. Drawdown",(a==null?void 0:a.maxDD)!=null?"-"+(a.maxDD*100).toFixed(1)+"%":"—",(a==null?void 0:a.maxDD)!=null?a.maxDD<.1?"Controlado":a.maxDD<.2?"Moderado":"Alto":null,(a==null?void 0:a.maxDD)!=null?a.maxDD<.1?"good":a.maxDD<.2?"neu":"bad":"neu",`Caída máxima desde un pico hasta el valle siguiente. Desde ${M(a==null?void 0:a.ddStart)} hasta ${M(a==null?void 0:a.ddTrough)}.`)}
        </div>

        <!-- Allocation -->
        <div class="pm-card2">
          <div class="pm-card2-title">Asset Allocation</div>
          <div style="display:flex;height:6px;border-radius:3px;overflow:hidden;margin-bottom:12px;">
            ${u>0?`
            <div style="width:${Math.min(((a==null?void 0:a.capitalInvertido)||0)/u*100,100).toFixed(1)}%;background:var(--teal);"></div>
            <div style="flex:1;background:var(--surface2);"></div>`:'<div style="width:100%;background:var(--surface2);"></div>'}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            ${[["Invertido",g(a==null?void 0:a.capitalInvertido),(a==null?void 0:a.capitalInvertido)!=null&&u>0?(a.capitalInvertido/u*100).toFixed(1)+"%":"—","var(--teal)"],["Cash",g(a==null?void 0:a.cash),(a==null?void 0:a.cash)!=null&&u>0?(a.cash/u*100).toFixed(1)+"%":"—","var(--blue)"],["Capital inicial",g(u),"100%","var(--text3)"]].map(([n,w,c,C])=>`<div style="background:var(--surface2);border-radius:6px;padding:10px 12px;">
              <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${n}</div>
              <div style="font-family:var(--mono);font-size:15px;font-weight:700;color:${C};">${w}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:2px;">${c}</div>
            </div>`).join("")}
          </div>
        </div>
      </div>

      <!-- ══ TAB TRADING ══ -->
      <div class="pm-panel2" id="pm-panel-trading">

        <!-- Stats globales -->
        <div class="pm-stat-grid">
          ${[["Win Rate",e?Math.round(e.winRate*100)+"%":"—",e?e.n+" operaciones":"—",e&&e.winRate>=.5?"var(--green)":"var(--red)"],["Profit Factor",e&&e.profitFactor!=null?e.profitFactor.toFixed(2):"—",">1.5 = sólido",e&&e.profitFactor>=1.5?"var(--green)":e&&e.profitFactor>=1?"var(--amber)":"var(--red)"],["Esperanza",e?D(e.esperanza*100):"—","por operación",e&&e.esperanza>=0?"var(--green)":"var(--red)"],["Avg Win",e?"+"+e.avgWin.toFixed(1)+"%":"—","ganancia media","var(--green)"],["Avg Loss",e?"-"+e.avgLoss.toFixed(1)+"%":"—","pérdida media","var(--red)"],["Payoff",e&&e.payoff!=null?e.payoff.toFixed(2):"—","win/loss ratio",e&&e.payoff>=1.5?"var(--green)":"var(--amber)"],["Holding medio",(e==null?void 0:e.avgDays)!=null?e.avgDays+"d":"—","días por operación","var(--text2)"],["P&L Realizado",e!=null&&e.hasAbs?g(e.totalPL):"—","operaciones cerradas",e&&e.totalPL>=0?"var(--green)":"var(--red)"],["Rent. media/op.",e?D(e.avgReturn):"—","todas las ops",e&&e.avgReturn>=0?"var(--green)":"var(--red)"]].map(([n,w,c,C])=>`<div class="pm-stat">
            <div class="pm-stat-lbl">${n}</div>
            <div class="pm-stat-val" style="color:${C};">${w}</div>
            <div class="pm-stat-sub">${c}</div>
          </div>`).join("")}
        </div>

        <!-- Alcista vs Bajista -->
        <div class="pm-grid2">
          ${["Alcista","Bajista"].map((n,w)=>{const c=w===0?R:f;return`<div class="pm-card2">
              <div class="pm-card2-title" style="color:${w===0?"var(--green)":"var(--red)"};">${n} · ${c?c.n+" ops":"sin ops"}</div>
              ${c?[["Win Rate",Math.round(c.winRate*100)+"%"],["Avg Win","+"+c.avgWin.toFixed(1)+"%"],["Avg Loss","-"+c.avgLoss.toFixed(1)+"%"],["Profit Factor",c.profitFactor!=null?c.profitFactor.toFixed(2):"—"],["Esperanza",D(c.esperanza*100)],["Holding medio",c.avgDays!=null?c.avgDays+"d":"—"],["Rent. media/op",D(c.avgReturn)]].map(([H,T])=>O(H,T)).join(""):'<div style="color:var(--text3);font-size:11px;padding:10px 0;">Sin operaciones</div>'}
            </div>`}).join("")}
        </div>

        <!-- Historial -->
        ${x.length?`<div class="pm-card2">
          <div class="pm-card2-title">Operaciones cerradas (${x.length})</div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:6px;">
            <thead><tr style="background:var(--surface2);">
              <th style="padding:7px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Ticker</th>
              <th style="padding:7px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Entrada</th>
              <th style="padding:7px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Salida</th>
              <th style="padding:7px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Días</th>
              <th style="padding:7px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L %</th>
              <th style="padding:7px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L €</th>
            </tr></thead>
            <tbody>
              ${x.map(n=>{const w=n.entryDateISO&&n.exitDateISO?Math.round((new Date(n.exitDateISO)-new Date(n.entryDateISO))/864e5):null,c=n.pnlPct>=0?"var(--green)":"var(--red)";return`<tr>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;">${n.ticker} <span style="font-size:9px;color:var(--text3);">${n.direction||"alcista"}</span></td>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-size:11px;">${M(n.entryDateISO)}</td>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-size:11px;">${M(n.exitDateISO)}</td>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${w!=null?w+"d":"—"}</td>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${c};">${D(n.pnlPct)}</td>
                  <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${c};">${n.pnlAbs!=null?g(n.pnlAbs):"—"}</td>
                </tr>`}).join("")}
            </tbody>
          </table>
        </div>`:""}
      </div>

      <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-align:right;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
        Valor cartera = capitalInicial + P&L realizado + P&L no realizado · CAGR con 252 sesiones/año · ${new Date().toLocaleString("es-ES")}
      </div>
    `,s.querySelectorAll(".pm-tab2").forEach(n=>{n.addEventListener("click",()=>{var w;s.querySelectorAll(".pm-tab2").forEach(c=>c.classList.remove("active")),s.querySelectorAll(".pm-panel2").forEach(c=>c.classList.remove("active")),n.classList.add("active"),(w=s.querySelector("#pm-panel-"+n.dataset.tab2))==null||w.classList.add("active")})})}return(m=document.getElementById("pm-refresh"))==null||m.addEventListener("click",p),p(),{destroy(){var s;(s=document.getElementById("pm-css2"))==null||s.remove()}}}export{na as render};
