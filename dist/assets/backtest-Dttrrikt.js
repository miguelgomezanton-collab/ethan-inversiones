const yt=[n=>`https://api.allorigins.win/raw?url=${encodeURIComponent(n)}`,n=>`https://corsproxy.io/?${encodeURIComponent(n)}`,n=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(n)}`];function A(n,r){const p=2/(r+1),o=new Array(n.length).fill(null);let l=n.findIndex(e=>e!=null&&!isNaN(e));if(l<0)return o;o[l]=n[l];for(let e=l+1;e<n.length;e++){const t=n[e]!=null&&!isNaN(n[e])?n[e]:o[e-1];o[e]=t*p+o[e-1]*(1-p)}return o}function pt(n,r){return n.map((p,o)=>{if(o<r-1)return null;const l=n.slice(o-r+1,o+1).filter(e=>e!=null&&!isNaN(e));return l.length===r?l.reduce((e,t)=>e+t,0)/r:null})}function it(n,r=12,p=26,o=9){const l=A(n,r),e=A(n,p),t=l.map((a,i)=>a!=null&&e[i]!=null?a-e[i]:null),s=A(t.map(a=>a??0),o);return{m:t,sl:s,hist:t.map((a,i)=>a!=null&&s[i]!=null?a-s[i]:null)}}function X(n,r=14){const p=new Array(n.length).fill(null);if(n.length<r+1)return p;let o=0,l=0;for(let s=1;s<=r;s++){const a=n[s]-n[s-1];a>0?o+=a:l-=a}let e=o/r,t=l/r;p[r]=t===0?100:100-100/(1+e/t);for(let s=r+1;s<n.length;s++){const a=n[s]-n[s-1];e=(e*(r-1)+(a>0?a:0))/r,t=(t*(r-1)+(a<0?-a:0))/r,p[s]=t===0?100:100-100/(1+e/t)}return p}function ut(n,r,p,o=14,l=3){const e=p.map((s,a)=>{if(a<o-1)return null;const i=Math.max(...n.slice(a-o+1,a+1)),b=Math.min(...r.slice(a-o+1,a+1));return i===b?50:(s-b)/(i-b)*100}),t=pt(e,l);return{k:t,d:pt(t.map(s=>s??0),3)}}function xt(n,r,p,o,l,e){const t={};n.forEach((a,i)=>{const b=new Date(a*1e3),m=b.getDay(),u=b.getDate()-m+(m===0?-6:1),v=new Date(+b);v.setDate(u);const h=v.toISOString().slice(0,10);t[h]?(t[h].h=Math.max(t[h].h,p[i]),t[h].l=Math.min(t[h].l,o[i]),t[h].c=l[i],t[h].v+=e[i],t[h].dates.push(new Date(a*1e3).toISOString().slice(0,10))):t[h]={o:r[i],h:p[i],l:o[i],c:l[i],v:e[i],dates:[new Date(a*1e3).toISOString().slice(0,10)]}});const s=Object.keys(t).sort();return{O:s.map(a=>t[a].o),H:s.map(a=>t[a].h),L:s.map(a=>t[a].l),C:s.map(a=>t[a].c),V:s.map(a=>t[a].v),dates:s,lastDates:s.map(a=>t[a].dates[t[a].dates.length-1])}}function $t(n,r,p,o,l,e){const t={};n.forEach((a,i)=>{const b=new Date(a*1e3),m=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`;t[m]?(t[m].h=Math.max(t[m].h,p[i]),t[m].l=Math.min(t[m].l,o[i]),t[m].c=l[i],t[m].v+=e[i]):t[m]={o:r[i],h:p[i],l:o[i],c:l[i],v:e[i]}});const s=Object.keys(t).sort();return{O:s.map(a=>t[a].o),H:s.map(a=>t[a].h),L:s.map(a=>t[a].l),C:s.map(a=>t[a].c),V:s.map(a=>t[a].v),dates:s}}function wt(n,r,p,o=14){const l=n.map((t,s)=>s===0?t-r[s]:Math.max(t-r[s],Math.abs(t-p[s-1]),Math.abs(r[s]-p[s-1]))),e=new Array(l.length).fill(null);if(l.length<o)return e;e[o-1]=l.slice(0,o).reduce((t,s)=>t+s,0)/o;for(let t=o;t<l.length;t++)e[t]=(e[t-1]*(o-1)+l[t])/o;return e}async function kt(n){var p,o,l,e,t,s,a,i,b,m;const r=`https://query1.finance.yahoo.com/v8/finance/chart/${n}?interval=1d&range=3y&events=history`;for(const u of yt)try{const v=await fetch(u(r),{signal:AbortSignal.timeout(12e3)});if(!v.ok)continue;const h=JSON.parse(await v.text()),g=(o=(p=h==null?void 0:h.chart)==null?void 0:p.result)==null?void 0:o[0];if(!g)continue;const y=(e=(l=g.indicators)==null?void 0:l.quote)==null?void 0:e[0];if(!y)continue;const k=((a=(s=(t=g.indicators)==null?void 0:t.adjclose)==null?void 0:s[0])==null?void 0:a.adjclose)||y.close,S=k.map((w,x)=>y.close[x]&&w?w/y.close[x]:1);return{ts:g.timestamp,O:y.open.map((w,x)=>w*S[x]),H:y.high.map((w,x)=>w*S[x]),L:y.low.map((w,x)=>w*S[x]),C:k,V:y.volume,name:((i=g.meta)==null?void 0:i.shortName)||((b=g.meta)==null?void 0:b.longName)||n,currency:((m=g.meta)==null?void 0:m.currency)||"USD"}}catch{}throw new Error(`No se pudo obtener histórico de ${n}`)}function Mt(n,r,p,o,l){const{sizingMethod:e,riskPct:t,kellyFraction:s}=p;if(e==="fijo"){const a=n*(t/100);return Math.floor(a/r)}if(e==="kelly"){const i=Math.max(0,(l-(1-l)/1.5)*s);return Math.floor(n*i/r)}if(e==="atr"&&o){const a=n*(t/100);return Math.max(1,Math.floor(a/o))}return Math.floor(n*(t/100)/r)}function Ct(n,r){const{entradaTF:p,salidaTF:o,capital:l}=r,{ts:e,O:t,H:s,L:a,C:i,V:b}=n,m=i.length,u=xt(e,t,s,a,i,b),v=$t(e,t,s,a,i,b),h=wt(s,a,i,14),g=it(v.C),y=ut(v.H,v.L,v.C,89),k=X(v.C,14),S=A(v.C,10),w=it(u.C),x=ut(u.H,u.L,u.C,89),P=X(u.C,14),j=A(u.C,20),q=X(u.C,5),F=A(u.C,5),I=it(i),R=X(i,14),_=A(i,10),T=v.C.map((d,c)=>c<2||!S[c]?!1:g.m[c]>0&&g.m[c]>g.sl[c]&&y.k[c]>60&&k[c]>50&&v.C[c]>S[c]),M=u.C.map((d,c)=>c<2||!j[c]?!1:w.m[c]>0&&w.m[c]>w.sl[c]&&x.k[c]>50&&P[c]>50&&u.C[c]>j[c]),L=new Array(m).fill(0),Q=new Array(m).fill(0);let H=0,W=0;for(let d=0;d<m;d++){const c=new Date(e[d]*1e3).toISOString().slice(0,10),$=c.slice(0,7);for(;H<u.dates.length-1&&!((u.lastDates?u.lastDates[H]:u.dates[H])>=c);)H++;for(L[d]=H;W<v.dates.length-1&&v.dates[W]<$;)W++;Q[d]=W}const C=[];let U=!1,D={},z=l,V=[{date:new Date(e[0]*1e3).toISOString().slice(0,10),equity:l}],lt=.5;for(let d=50;d<m;d++){const c=new Date(e[d]*1e3).toISOString().slice(0,10),$=i[d];if(!$||isNaN($))continue;const f=L[d],K=Q[d];if(U){let B=!1;if(o==="diario"?B=_[d]!=null&&$<_[d]:o==="semanal"&&(B=j[f]!=null&&u.C[f]<j[f]),K>=1&&!T[K]&&(B=!0),f>=1&&!M[f]&&(B=!0),B||d===m-1){const nt=($-D.precio)/D.precio*100,O=($-D.precio)*D.shares,E=Math.round((new Date(c)-new Date(D.date))/864e5);z+=O,C.push({entryDate:D.date,exitDate:c,entryPrice:D.precio,exitPrice:$,shares:D.shares,coste:D.coste,pnlPct:nt,pnlAbs:O,dias:E}),lt=C.filter(N=>N.pnlPct>0).length/Math.max(C.length,1),U=!1,V.push({date:c,equity:z})}}else{const B=K>=2&&T[K-1],nt=f>=2&&M[f-1];if(B&&nt){let O=!1;if(p==="diario"&&d>1){const E=I.m[d]>0&&I.m[d]>I.sl[d]&&I.m[d-1]<=I.sl[d-1]&&R[d]>59,N=F[f]!=null&&u.C[f]>F[f]*.995&&u.C[f]<F[f]*1.02&&P[f]>50,st=x.k[f]!=null&&x.k[f]>85,ht=q[f]!=null&&q[f]<40;O=E||N||st||ht}else if(p==="semanal"&&f>1){const E=F[f]!=null&&u.C[f]>F[f]*.995&&u.C[f]<F[f]*1.02&&P[f]>50,N=x.k[f]!=null&&x.k[f]>85,st=q[f]!=null&&q[f]<40;O=E||N||st}if(O){const E=Mt(z,$,r,h[d],lt);E>0&&E*$<=z&&(U=!0,D={i:d,date:c,precio:$,shares:E,coste:E*$})}}}U&&V.push({date:c,equity:z+($-D.precio)*D.shares})}const Y=C.filter(d=>d.pnlPct>0),Z=C.filter(d=>d.pnlPct<=0),tt=C.length?Y.length/C.length:0,rt=Y.length?Y.reduce((d,c)=>d+c.pnlPct,0)/Y.length:0,et=Z.length?Math.abs(Z.reduce((d,c)=>d+c.pnlPct,0)/Z.length):0,bt=et>0?tt*rt/((1-tt)*et):null,ft=(z-l)/l,vt=(i[m-1]-i[50])/i[50],gt=C.length?Math.round(C.reduce((d,c)=>d+c.dias,0)/C.length):0;let G=l,at=0;V.forEach(d=>{d.equity>G&&(G=d.equity);const c=(G-d.equity)/G;c>at&&(at=c)});let dt=0,ct=0;for(let d=50;d<m;d++){const c=L[d],$=Q[d];$>=2&&T[$-1]&&dt++,$>=2&&T[$-1]&&c>=2&&M[c-1]&&ct++}return{trades:C,equityCurve:V,capital:z,capitalInicial:l,winRate:tt,avgWin:rt,avgLoss:et,profitFactor:bt,totalReturn:ft,buyHold:vt,avgDias:gt,maxDD:at,nTrades:C.length,debug:{diasConM:dt,diasConMS:ct,totalDias:m-50,semanas:u.dates.length,meses:v.dates.length}}}function Dt(n,r){if(!n||n.length<2)return"";const p=n.map(g=>g.equity),o=820,l=200,e=Math.min(...p)*.995,t=Math.max(...p)*1.005,s=t-e||1,a=g=>(g/(p.length-1)*o).toFixed(1),i=g=>(l-(g-e)/s*l).toFixed(1),b=p.map((g,y)=>`${a(y)},${i(g)}`).join(" "),m=p[p.length-1],u=m>=r?"#40d9c0":"#f47174",v=i(r),h=`0,${l} ${b} ${o},${l}`;return`<svg viewBox="0 0 ${o} ${l}" style="width:100%;height:${l}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${u}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${u}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${v}" x2="${o}" y2="${v}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(v)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Capital inicial</text>
    <polygon points="${h}" fill="url(#eg)"/>
    <polyline points="${b}" fill="none" stroke="${u}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${o}" cy="${i(m)}" r="4" fill="${u}"/>
  </svg>`}const ot=(n,r=2)=>n!=null&&isFinite(n)?(n>=0?"+":"")+n.toFixed(r)+"%":"—",J=n=>n!=null&&isFinite(n)?(n<0?"-":"")+"€"+Math.abs(n).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",mt=n=>n?new Date(n+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—",St=`
.bt-wrap{font-family:var(--sans);}
.bt-config{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.bt-config-title{font-size:13px;font-weight:600;margin-bottom:16px;}
.bt-config-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px;}
.bt-field label{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);display:block;margin-bottom:5px;}
.bt-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-strip-cell{background:var(--surface);padding:14px 16px;}
.bt-strip-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.bt-strip-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.bt-strip-sub{font-size:10px;color:var(--text3);margin-top:3px;}
.bt-chart{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;}
.bt-table{width:100%;border-collapse:collapse;font-size:11px;}
.bt-table th{padding:8px 12px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.bt-table th:first-child,.bt-table td:first-child{text-align:left;}
.bt-table td{padding:9px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);text-align:right;color:var(--text2);}
.bt-table tbody tr:last-child td{border-bottom:none;}
.bt-table tbody tr:hover td{background:var(--surface2);}
`;async function Et(n,{actionsSlot:r}){if(!document.getElementById("bt-css")){const e=document.createElement("style");e.id="bt-css",e.textContent=St,document.head.appendChild(e)}r.innerHTML="",n.innerHTML='<div class="bt-wrap" id="bt-wrap"></div>';function p(e,t,s){var F,I,R,_,T;const a=document.getElementById("bt-wrap"),{trades:i,equityCurve:b,capital:m,capitalInicial:u,winRate:v,avgWin:h,avgLoss:g,profitFactor:y,totalReturn:k,buyHold:S,avgDias:w,maxDD:x,nTrades:P}=e,j=k>=0?"var(--green)":"var(--red)",q=S>=0?"var(--green)":"var(--red)";a.innerHTML=`
      <!-- Configuración -->
      ${o(t)}

      <!-- Debug info -->
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-family:var(--mono);font-size:10px;color:var(--text2);">
        🔍 Debug: ${((F=e.debug)==null?void 0:F.totalDias)||0} días analizados · ${((I=e.debug)==null?void 0:I.diasConM)||0} con condición M ✓ · ${((R=e.debug)==null?void 0:R.diasConMS)||0} con M+S ✓ · ${((_=e.debug)==null?void 0:_.semanas)||0} semanas · ${((T=e.debug)==null?void 0:T.meses)||0} meses
      </div>

      <!-- KPIs -->
      <div class="bt-strip">
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Rentabilidad</div>
          <div class="bt-strip-val" style="color:${j};">${ot(k*100)}</div>
          <div class="bt-strip-sub">vs Buy&Hold: <span style="color:${q};">${ot(S*100)}</span></div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Capital Final</div>
          <div class="bt-strip-val" style="color:var(--teal);">${J(m)}</div>
          <div class="bt-strip-sub">desde ${J(u)}</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Win Rate</div>
          <div class="bt-strip-val" style="color:${v>=.5?"var(--green)":"var(--red)"};">${Math.round(v*100)}%</div>
          <div class="bt-strip-sub">${P} operaciones</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Profit Factor</div>
          <div class="bt-strip-val" style="color:${(y||0)>=1.5?"var(--green)":(y||0)>=1?"var(--amber)":"var(--red)"};">${y!=null?y.toFixed(2):"—"}</div>
          <div class="bt-strip-sub">Avg: +${h.toFixed(1)}% / -${g.toFixed(1)}%</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Máx. Drawdown</div>
          <div class="bt-strip-val" style="color:${x<.1?"var(--green)":x<.2?"var(--amber)":"var(--red)"};">-${(x*100).toFixed(1)}%</div>
          <div class="bt-strip-sub">Media/op: ${w}d</div>
        </div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${s} · Equity Curve · ${t.entradaTF==="diario"?"Entrada Diaria":"Entrada Semanal"} · ${t.salidaTF==="diario"?"Salida EMA10D":"Salida EMA10S"}</div>
        ${Dt(b,u)}
        <div style="display:flex;gap:16px;margin-top:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          <span>— Equity del sistema</span>
          <span>Base = capital inicial (${J(u)})</span>
          <span>${b.length} puntos</span>
        </div>
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">
          ${P} operaciones simuladas
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>Entrada</th><th>Salida</th><th>Días</th>
            <th>Precio entrada</th><th>Precio salida</th>
            <th>P&L %</th><th>P&L €</th>
          </tr></thead>
          <tbody>
            ${i.map(M=>{const L=M.pnlPct>=0?"var(--green)":"var(--red)";return`<tr>
                <td>${mt(M.entryDate)}</td>
                <td>${mt(M.exitDate)}</td>
                <td>${M.dias}d</td>
                <td>$${M.entryPrice.toFixed(2)}</td>
                <td>$${M.exitPrice.toFixed(2)}</td>
                <td style="color:${L};font-weight:700;">${ot(M.pnlPct)}</td>
                <td style="color:${L};font-weight:700;">${J(M.pnlAbs)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
        ${P===0?'<div class="empty" style="padding:30px;"><div class="empty-icon">📊</div><div class="empty-title">Sin señales en el período</div><div class="empty-desc">Las condiciones M+S no se cumplieron suficientemente en los últimos 3 años</div></div>':""}
      </div>
    `,l(t)}function o(e={}){return`<div class="bt-config">
      <div class="bt-config-title">Configuración del Backtest</div>
      <div class="bt-config-grid">
        <div class="bt-field">
          <label>Ticker</label>
          <input type="text" id="bt-ticker" class="wl-input" placeholder="ej. AAPL, NVDA..." value="${e.ticker||""}" style="text-transform:uppercase;">
        </div>
        <div class="bt-field">
          <label>Capital inicial (€)</label>
          <input type="number" id="bt-capital" class="wl-input" value="${e.capital||1e4}">
        </div>
        <div class="bt-field">
          <label>Señal de entrada</label>
          <select id="bt-entrada" class="wl-input">
            <option value="diario" ${e.entradaTF==="diario"?"selected":""}>Diario (Stoch8↑ o MM alineadas)</option>
            <option value="semanal" ${e.entradaTF==="semanal"?"selected":""}>Semanal (Stoch89↑ + precio>EMA10)</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Señal de salida</label>
          <select id="bt-salida" class="wl-input">
            <option value="diario" ${e.salidaTF==="diario"?"selected":""}>EMA10 Diario</option>
            <option value="semanal" ${e.salidaTF==="semanal"?"selected":""}>EMA10 Semanal</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Método de sizing</label>
          <select id="bt-sizing" class="wl-input">
            <option value="fijo" ${e.sizingMethod==="fijo"?"selected":""}>% Fijo del capital</option>
            <option value="kelly" ${e.sizingMethod==="kelly"?"selected":""}>½ Kelly</option>
            <option value="atr" ${e.sizingMethod==="atr"?"selected":""}>Volatilidad ATR</option>
          </select>
        </div>
        <div class="bt-field">
          <label>% Capital por operación</label>
          <input type="number" id="bt-risk" class="wl-input" value="${e.riskPct||20}" min="1" max="100">
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="btn btn-primary" id="bt-run-btn" style="min-width:140px;">▶ Ejecutar backtest</button>
        <span id="bt-status" style="font-family:var(--mono);font-size:11px;color:var(--text3);"></span>
      </div>
    </div>`}function l(e={}){var t;(t=document.getElementById("bt-run-btn"))==null||t.addEventListener("click",async()=>{var m,u,v,h,g,y;const s=(((m=document.getElementById("bt-ticker"))==null?void 0:m.value)||"").trim().toUpperCase();if(!s)return;const a={ticker:s,capital:parseFloat((u=document.getElementById("bt-capital"))==null?void 0:u.value)||1e4,entradaTF:((v=document.getElementById("bt-entrada"))==null?void 0:v.value)||"diario",salidaTF:((h=document.getElementById("bt-salida"))==null?void 0:h.value)||"diario",sizingMethod:((g=document.getElementById("bt-sizing"))==null?void 0:g.value)||"fijo",riskPct:parseFloat((y=document.getElementById("bt-risk"))==null?void 0:y.value)||20,kellyFraction:.5},i=document.getElementById("bt-run-btn"),b=document.getElementById("bt-status");i.disabled=!0,i.textContent="⏳ Descargando...",b&&(b.textContent=`Descargando 3 años de ${s}...`);try{const k=await kt(s);b&&(b.textContent="Ejecutando simulación..."),await new Promise(w=>setTimeout(w,50));const S=Ct(k,a);p(S,a,k.name||s)}catch(k){i.disabled=!1,i.textContent="▶ Ejecutar backtest",b&&(b.textContent="⚠ "+k.message)}})}return document.getElementById("bt-wrap").innerHTML=o(),l(),{destroy(){var e;(e=document.getElementById("bt-css"))==null||e.remove()}}}export{Et as render};
