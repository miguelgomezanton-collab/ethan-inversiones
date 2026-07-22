const gt=[n=>`https://api.allorigins.win/raw?url=${encodeURIComponent(n)}`,n=>`https://corsproxy.io/?${encodeURIComponent(n)}`,n=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(n)}`];function z(n,r){const c=2/(r+1),l=new Array(n.length).fill(null);let o=n.findIndex(e=>e!=null&&!isNaN(e));if(o<0)return l;l[o]=n[o];for(let e=o+1;e<n.length;e++){const t=n[e]!=null&&!isNaN(n[e])?n[e]:l[e-1];l[e]=t*c+l[e-1]*(1-c)}return l}function rt(n,r){return n.map((c,l)=>{if(l<r-1)return null;const o=n.slice(l-r+1,l+1).filter(e=>e!=null&&!isNaN(e));return o.length===r?o.reduce((e,t)=>e+t,0)/r:null})}function Z(n,r=12,c=26,l=9){const o=z(n,r),e=z(n,c),t=o.map((a,i)=>a!=null&&e[i]!=null?a-e[i]:null),s=z(t.map(a=>a??0),l);return{m:t,sl:s,hist:t.map((a,i)=>a!=null&&s[i]!=null?a-s[i]:null)}}function U(n,r=14){const c=new Array(n.length).fill(null);if(n.length<r+1)return c;let l=0,o=0;for(let s=1;s<=r;s++){const a=n[s]-n[s-1];a>0?l+=a:o-=a}let e=l/r,t=o/r;c[r]=t===0?100:100-100/(1+e/t);for(let s=r+1;s<n.length;s++){const a=n[s]-n[s-1];e=(e*(r-1)+(a>0?a:0))/r,t=(t*(r-1)+(a<0?-a:0))/r,c[s]=t===0?100:100-100/(1+e/t)}return c}function dt(n,r,c,l=14,o=3){const e=c.map((s,a)=>{if(a<l-1)return null;const i=Math.max(...n.slice(a-l+1,a+1)),m=Math.min(...r.slice(a-l+1,a+1));return i===m?50:(s-m)/(i-m)*100}),t=rt(e,o);return{k:t,d:rt(t.map(s=>s??0),3)}}function ht(n,r,c,l,o,e){const t={};n.forEach((a,i)=>{const m=new Date(a*1e3),b=m.getDay(),u=m.getDate()-b+(b===0?-6:1),v=new Date(+m);v.setDate(u);const h=v.toISOString().slice(0,10);t[h]?(t[h].h=Math.max(t[h].h,c[i]),t[h].l=Math.min(t[h].l,l[i]),t[h].c=o[i],t[h].v+=e[i],t[h].dates.push(new Date(a*1e3).toISOString().slice(0,10))):t[h]={o:r[i],h:c[i],l:l[i],c:o[i],v:e[i],dates:[new Date(a*1e3).toISOString().slice(0,10)]}});const s=Object.keys(t).sort();return{O:s.map(a=>t[a].o),H:s.map(a=>t[a].h),L:s.map(a=>t[a].l),C:s.map(a=>t[a].c),V:s.map(a=>t[a].v),dates:s,lastDates:s.map(a=>t[a].dates[t[a].dates.length-1])}}function yt(n,r,c,l,o,e){const t={};n.forEach((a,i)=>{const m=new Date(a*1e3),b=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}`;t[b]?(t[b].h=Math.max(t[b].h,c[i]),t[b].l=Math.min(t[b].l,l[i]),t[b].c=o[i],t[b].v+=e[i]):t[b]={o:r[i],h:c[i],l:l[i],c:o[i],v:e[i]}});const s=Object.keys(t).sort();return{O:s.map(a=>t[a].o),H:s.map(a=>t[a].h),L:s.map(a=>t[a].l),C:s.map(a=>t[a].c),V:s.map(a=>t[a].v),dates:s}}function xt(n,r,c,l=14){const o=n.map((t,s)=>s===0?t-r[s]:Math.max(t-r[s],Math.abs(t-c[s-1]),Math.abs(r[s]-c[s-1]))),e=new Array(o.length).fill(null);if(o.length<l)return e;e[l-1]=o.slice(0,l).reduce((t,s)=>t+s,0)/l;for(let t=l;t<o.length;t++)e[t]=(e[t-1]*(l-1)+o[t])/l;return e}async function $t(n){var c,l,o,e,t,s,a,i,m,b;const r=`https://query1.finance.yahoo.com/v8/finance/chart/${n}?interval=1d&range=3y&events=history`;for(const u of gt)try{const v=await fetch(u(r),{signal:AbortSignal.timeout(12e3)});if(!v.ok)continue;const h=JSON.parse(await v.text()),g=(l=(c=h==null?void 0:h.chart)==null?void 0:c.result)==null?void 0:l[0];if(!g)continue;const y=(e=(o=g.indicators)==null?void 0:o.quote)==null?void 0:e[0];if(!y)continue;const M=((a=(s=(t=g.indicators)==null?void 0:t.adjclose)==null?void 0:s[0])==null?void 0:a.adjclose)||y.close,S=M.map(($,x)=>y.close[x]&&$?$/y.close[x]:1);return{ts:g.timestamp,O:y.open.map(($,x)=>$*S[x]),H:y.high.map(($,x)=>$*S[x]),L:y.low.map(($,x)=>$*S[x]),C:M,V:y.volume,name:((i=g.meta)==null?void 0:i.shortName)||((m=g.meta)==null?void 0:m.longName)||n,currency:((b=g.meta)==null?void 0:b.currency)||"USD"}}catch{}throw new Error(`No se pudo obtener histórico de ${n}`)}function wt(n,r,c,l,o){const{sizingMethod:e,riskPct:t,kellyFraction:s}=c;if(e==="fijo"){const a=n*(t/100);return Math.floor(a/r)}if(e==="kelly"){const i=Math.max(0,(o-(1-o)/1.5)*s);return Math.floor(n*i/r)}if(e==="atr"&&l){const a=n*(t/100);return Math.max(1,Math.floor(a/l))}return Math.floor(n*(t/100)/r)}function kt(n,r){const{entradaTF:c,salidaTF:l,capital:o}=r,{ts:e,O:t,H:s,L:a,C:i,V:m}=n,b=i.length,u=ht(e,t,s,a,i,m),v=yt(e,t,s,a,i,m),h=xt(s,a,i,14),g=Z(v.C),y=dt(v.H,v.L,v.C,89),M=U(v.C,14),S=z(v.C,10),$=Z(u.C),x=dt(u.H,u.L,u.C,89),I=U(u.C,14),B=z(u.C,20),A=U(u.C,5),w=z(u.C,5),F=Z(i),pt=U(i,14),et=z(i,10),at=v.C.map((d,p)=>p<2||!S[p]?!1:g.m[p]>0&&g.m[p]>g.sl[p]&&y.k[p]>60&&M[p]>50&&v.C[p]>S[p]),nt=u.C.map((d,p)=>p<2||!B[p]?!1:$.m[p]>0&&$.m[p]>$.sl[p]&&x.k[p]>50&&I[p]>50&&u.C[p]>B[p]),st=new Array(b).fill(0),it=new Array(b).fill(0);let q=0,O=0;for(let d=0;d<b;d++){const p=new Date(e[d]*1e3).toISOString().slice(0,10),k=p.slice(0,7);for(;q<u.dates.length-1&&!((u.lastDates?u.lastDates[q]:u.dates[q])>=p);)q++;for(st[d]=q;O<v.dates.length-1&&v.dates[O]<k;)O++;it[d]=O}const C=[];let _=!1,D={},P=o,H=[{date:new Date(e[0]*1e3).toISOString().slice(0,10),equity:o}],lt=.5;for(let d=50;d<b;d++){const p=new Date(e[d]*1e3).toISOString().slice(0,10),k=i[d];if(!k||isNaN(k))continue;const f=st[d],W=it[d];if(_){let T=!1;if(l==="diario"?T=et[d]!=null&&k<et[d]:l==="semanal"&&(T=B[f]!=null&&u.C[f]<B[f]),W>=1&&!at[W]&&(T=!0),f>=1&&!nt[f]&&(T=!0),T||d===b-1){const J=(k-D.precio)/D.precio*100,j=(k-D.precio)*D.shares,E=Math.round((new Date(p)-new Date(D.date))/864e5);P+=j,C.push({entryDate:D.date,exitDate:p,entryPrice:D.precio,exitPrice:k,shares:D.shares,coste:D.coste,pnlPct:J,pnlAbs:j,dias:E}),lt=C.filter(L=>L.pnlPct>0).length/Math.max(C.length,1),_=!1,H.push({date:p,equity:P})}}else{const T=W>=2&&at[W-1],J=f>=2&&nt[f-1];if(T&&J){let j=!1;if(c==="diario"&&d>1){const E=F.m[d]>0&&F.m[d]>F.sl[d]&&F.m[d-1]<=F.sl[d-1]&&pt[d]>59,L=w[f]!=null&&u.C[f]>w[f]*.995&&u.C[f]<w[f]*1.02&&I[f]>50,Q=x.k[f]!=null&&x.k[f]>85,vt=A[f]!=null&&A[f]<40;j=E||L||Q||vt}else if(c==="semanal"&&f>1){const E=w[f]!=null&&u.C[f]>w[f]*.995&&u.C[f]<w[f]*1.02&&I[f]>50,L=x.k[f]!=null&&x.k[f]>85,Q=A[f]!=null&&A[f]<40;j=E||L||Q}if(j){const E=wt(P,k,r,h[d],lt);E>0&&E*k<=P&&(_=!0,D={i:d,date:p,precio:k,shares:E,coste:E*k})}}}_&&H.push({date:p,equity:P+(k-D.precio)*D.shares})}const N=C.filter(d=>d.pnlPct>0),Y=C.filter(d=>d.pnlPct<=0),G=C.length?N.length/C.length:0,ot=N.length?N.reduce((d,p)=>d+p.pnlPct,0)/N.length:0,K=Y.length?Math.abs(Y.reduce((d,p)=>d+p.pnlPct,0)/Y.length):0,ut=K>0?G*ot/((1-G)*K):null,mt=(P-o)/o,bt=(i[b-1]-i[50])/i[50],ft=C.length?Math.round(C.reduce((d,p)=>d+p.dias,0)/C.length):0;let R=o,X=0;return H.forEach(d=>{d.equity>R&&(R=d.equity);const p=(R-d.equity)/R;p>X&&(X=p)}),{trades:C,equityCurve:H,capital:P,capitalInicial:o,winRate:G,avgWin:ot,avgLoss:K,profitFactor:ut,totalReturn:mt,buyHold:bt,avgDias:ft,maxDD:X,nTrades:C.length}}function Mt(n,r){if(!n||n.length<2)return"";const c=n.map(g=>g.equity),l=820,o=200,e=Math.min(...c)*.995,t=Math.max(...c)*1.005,s=t-e||1,a=g=>(g/(c.length-1)*l).toFixed(1),i=g=>(o-(g-e)/s*o).toFixed(1),m=c.map((g,y)=>`${a(y)},${i(g)}`).join(" "),b=c[c.length-1],u=b>=r?"#40d9c0":"#f47174",v=i(r),h=`0,${o} ${m} ${l},${o}`;return`<svg viewBox="0 0 ${l} ${o}" style="width:100%;height:${o}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${u}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${u}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${v}" x2="${l}" y2="${v}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(v)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Capital inicial</text>
    <polygon points="${h}" fill="url(#eg)"/>
    <polyline points="${m}" fill="none" stroke="${u}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${l}" cy="${i(b)}" r="4" fill="${u}"/>
  </svg>`}const tt=(n,r=2)=>n!=null&&isFinite(n)?(n>=0?"+":"")+n.toFixed(r)+"%":"—",V=n=>n!=null&&isFinite(n)?(n<0?"-":"")+"€"+Math.abs(n).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",ct=n=>n?new Date(n+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—",Ct=`
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
`;async function Dt(n,{actionsSlot:r}){if(!document.getElementById("bt-css")){const e=document.createElement("style");e.id="bt-css",e.textContent=Ct,document.head.appendChild(e)}r.innerHTML="",n.innerHTML='<div class="bt-wrap" id="bt-wrap"></div>';function c(e,t,s){const a=document.getElementById("bt-wrap"),{trades:i,equityCurve:m,capital:b,capitalInicial:u,winRate:v,avgWin:h,avgLoss:g,profitFactor:y,totalReturn:M,buyHold:S,avgDias:$,maxDD:x,nTrades:I}=e,B=M>=0?"var(--green)":"var(--red)",A=S>=0?"var(--green)":"var(--red)";a.innerHTML=`
      <!-- Configuración -->
      ${l(t)}

      <!-- KPIs -->
      <div class="bt-strip">
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Rentabilidad</div>
          <div class="bt-strip-val" style="color:${B};">${tt(M*100)}</div>
          <div class="bt-strip-sub">vs Buy&Hold: <span style="color:${A};">${tt(S*100)}</span></div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Capital Final</div>
          <div class="bt-strip-val" style="color:var(--teal);">${V(b)}</div>
          <div class="bt-strip-sub">desde ${V(u)}</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Win Rate</div>
          <div class="bt-strip-val" style="color:${v>=.5?"var(--green)":"var(--red)"};">${Math.round(v*100)}%</div>
          <div class="bt-strip-sub">${I} operaciones</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Profit Factor</div>
          <div class="bt-strip-val" style="color:${(y||0)>=1.5?"var(--green)":(y||0)>=1?"var(--amber)":"var(--red)"};">${y!=null?y.toFixed(2):"—"}</div>
          <div class="bt-strip-sub">Avg: +${h.toFixed(1)}% / -${g.toFixed(1)}%</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Máx. Drawdown</div>
          <div class="bt-strip-val" style="color:${x<.1?"var(--green)":x<.2?"var(--amber)":"var(--red)"};">-${(x*100).toFixed(1)}%</div>
          <div class="bt-strip-sub">Media/op: ${$}d</div>
        </div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${s} · Equity Curve · ${t.entradaTF==="diario"?"Entrada Diaria":"Entrada Semanal"} · ${t.salidaTF==="diario"?"Salida EMA10D":"Salida EMA10S"}</div>
        ${Mt(m,u)}
        <div style="display:flex;gap:16px;margin-top:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          <span>— Equity del sistema</span>
          <span>Base = capital inicial (${V(u)})</span>
          <span>${m.length} puntos</span>
        </div>
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">
          ${I} operaciones simuladas
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>Entrada</th><th>Salida</th><th>Días</th>
            <th>Precio entrada</th><th>Precio salida</th>
            <th>P&L %</th><th>P&L €</th>
          </tr></thead>
          <tbody>
            ${i.map(w=>{const F=w.pnlPct>=0?"var(--green)":"var(--red)";return`<tr>
                <td>${ct(w.entryDate)}</td>
                <td>${ct(w.exitDate)}</td>
                <td>${w.dias}d</td>
                <td>$${w.entryPrice.toFixed(2)}</td>
                <td>$${w.exitPrice.toFixed(2)}</td>
                <td style="color:${F};font-weight:700;">${tt(w.pnlPct)}</td>
                <td style="color:${F};font-weight:700;">${V(w.pnlAbs)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
        ${I===0?'<div class="empty" style="padding:30px;"><div class="empty-icon">📊</div><div class="empty-title">Sin señales en el período</div><div class="empty-desc">Las condiciones M+S no se cumplieron suficientemente en los últimos 3 años</div></div>':""}
      </div>
    `,o(t)}function l(e={}){return`<div class="bt-config">
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
    </div>`}function o(e={}){var t;(t=document.getElementById("bt-run-btn"))==null||t.addEventListener("click",async()=>{var b,u,v,h,g,y;const s=(((b=document.getElementById("bt-ticker"))==null?void 0:b.value)||"").trim().toUpperCase();if(!s)return;const a={ticker:s,capital:parseFloat((u=document.getElementById("bt-capital"))==null?void 0:u.value)||1e4,entradaTF:((v=document.getElementById("bt-entrada"))==null?void 0:v.value)||"diario",salidaTF:((h=document.getElementById("bt-salida"))==null?void 0:h.value)||"diario",sizingMethod:((g=document.getElementById("bt-sizing"))==null?void 0:g.value)||"fijo",riskPct:parseFloat((y=document.getElementById("bt-risk"))==null?void 0:y.value)||20,kellyFraction:.5},i=document.getElementById("bt-run-btn"),m=document.getElementById("bt-status");i.disabled=!0,i.textContent="⏳ Descargando...",m&&(m.textContent=`Descargando 3 años de ${s}...`);try{const M=await $t(s);m&&(m.textContent="Ejecutando simulación..."),await new Promise($=>setTimeout($,50));const S=kt(M,a);c(S,a,M.name||s)}catch(M){i.disabled=!1,i.textContent="▶ Ejecutar backtest",m&&(m.textContent="⚠ "+M.message)}})}return document.getElementById("bt-wrap").innerHTML=l(),o(),{destroy(){var e;(e=document.getElementById("bt-css"))==null||e.remove()}}}export{Dt as render};
