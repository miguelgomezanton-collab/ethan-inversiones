const it=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`];function E(t,e){const o=2/(e+1),l=new Array(t.length).fill(null);let c=t.findIndex(a=>a!=null&&!isNaN(a));if(c<0)return l;l[c]=t[c];for(let a=c+1;a<t.length;a++){const n=t[a]!=null&&!isNaN(t[a])?t[a]:l[a-1];l[a]=n*o+l[a-1]*(1-o)}return l}function Y(t,e){return t.map((o,l)=>{if(l<e-1)return null;const c=t.slice(l-e+1,l+1).filter(a=>a!=null&&!isNaN(a));return c.length===e?c.reduce((a,n)=>a+n,0)/e:null})}function N(t,e=12,o=26,l=9){const c=E(t,e),a=E(t,o),n=c.map((s,r)=>s!=null&&a[r]!=null?s-a[r]:null),i=E(n.map(s=>s??0),l);return{m:n,sl:i,hist:n.map((s,r)=>s!=null&&i[r]!=null?s-i[r]:null)}}function B(t,e=14){const o=new Array(t.length).fill(null);if(t.length<e+1)return o;let l=0,c=0;for(let i=1;i<=e;i++){const s=t[i]-t[i-1];s>0?l+=s:c-=s}let a=l/e,n=c/e;o[e]=n===0?100:100-100/(1+a/n);for(let i=e+1;i<t.length;i++){const s=t[i]-t[i-1];a=(a*(e-1)+(s>0?s:0))/e,n=(n*(e-1)+(s<0?-s:0))/e,o[i]=n===0?100:100-100/(1+a/n)}return o}function q(t,e,o,l=14,c=3){const a=o.map((i,s)=>{if(s<l-1)return null;const r=Math.max(...t.slice(s-l+1,s+1)),u=Math.min(...e.slice(s-l+1,s+1));return r===u?50:(i-u)/(r-u)*100}),n=Y(a,c);return{k:n,d:Y(n.map(i=>i??0),3)}}function rt(t,e,o,l,c,a){const n={};t.forEach((s,r)=>{const u=new Date(s*1e3),p=u.getDay(),m=u.getDate()-p+(p===0?-6:1),g=new Date(+u);g.setDate(m);const h=g.toISOString().slice(0,10);n[h]?(n[h].h=Math.max(n[h].h,o[r]),n[h].l=Math.min(n[h].l,l[r]),n[h].c=c[r],n[h].v+=a[r],n[h].dates.push(new Date(s*1e3).toISOString().slice(0,10))):n[h]={o:e[r],h:o[r],l:l[r],c:c[r],v:a[r],dates:[new Date(s*1e3).toISOString().slice(0,10)]}});const i=Object.keys(n).sort();return{O:i.map(s=>n[s].o),H:i.map(s=>n[s].h),L:i.map(s=>n[s].l),C:i.map(s=>n[s].c),V:i.map(s=>n[s].v),dates:i,lastDates:i.map(s=>n[s].dates[n[s].dates.length-1])}}function ct(t,e,o,l,c,a){const n={};t.forEach((s,r)=>{const u=new Date(s*1e3),p=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`;n[p]?(n[p].h=Math.max(n[p].h,o[r]),n[p].l=Math.min(n[p].l,l[r]),n[p].c=c[r],n[p].v+=a[r]):n[p]={o:e[r],h:o[r],l:l[r],c:c[r],v:a[r]}});const i=Object.keys(n).sort();return{O:i.map(s=>n[s].o),H:i.map(s=>n[s].h),L:i.map(s=>n[s].l),C:i.map(s=>n[s].c),V:i.map(s=>n[s].v),dates:i}}function dt(t,e,o,l=14){const c=t.map((n,i)=>i===0?n-e[i]:Math.max(n-e[i],Math.abs(n-o[i-1]),Math.abs(e[i]-o[i-1]))),a=new Array(c.length).fill(null);if(c.length<l)return a;a[l-1]=c.slice(0,l).reduce((n,i)=>n+i,0)/l;for(let n=l;n<c.length;n++)a[n]=(a[n-1]*(l-1)+c[n])/l;return a}async function ut(t){var o,l,c,a,n,i,s,r,u,p;const e=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=3y&events=history`;for(const m of it)try{const g=await fetch(m(e),{signal:AbortSignal.timeout(12e3)});if(!g.ok)continue;const h=JSON.parse(await g.text()),d=(l=(o=h==null?void 0:h.chart)==null?void 0:o.result)==null?void 0:l[0];if(!d)continue;const b=(a=(c=d.indicators)==null?void 0:c.quote)==null?void 0:a[0];if(!b)continue;const v=((s=(i=(n=d.indicators)==null?void 0:n.adjclose)==null?void 0:i[0])==null?void 0:s.adjclose)||b.close,k=v.map((y,$)=>b.close[$]&&y?y/b.close[$]:1);return{ts:d.timestamp,O:b.open.map((y,$)=>y*k[$]),H:b.high.map((y,$)=>y*k[$]),L:b.low.map((y,$)=>y*k[$]),C:v,V:b.volume,name:((r=d.meta)==null?void 0:r.shortName)||((u=d.meta)==null?void 0:u.longName)||t,currency:((p=d.meta)==null?void 0:p.currency)||"USD"}}catch{}throw new Error(`No se pudo obtener histórico de ${t}`)}function G(t,e){if(e<1)return!1;const o=N(t.C),l=q(t.H,t.L,t.C,89),c=q(t.H,t.L,t.C,8),a=B(t.C,14),n=E(t.C,10),i=o.m[e]>0&&o.m[e]>o.sl[e],s=l.k[e]>80&&l.k[e]>l.d[e]||l.k[e]>92,r=a[e]>65,u=c.k[e]>78,p=n[e]!=null&&t.C[e]>n[e];return i&&s&&r&&u&&p}function K(t,e){if(e<1)return!1;const o=N(t.C),l=q(t.H,t.L,t.C,89),c=B(t.C,14),a=E(t.C,20),n=o.m[e]>0&&o.m[e]>o.sl[e],i=l.k[e]>85&&l.k[e]>l.d[e]||l.k[e]>92,s=c[e]>67,r=a[e]!=null&&t.C[e]>a[e];return n&&i&&s&&r}function pt(t,e){const o=N(t.C),l=B(t.C,14);return e<1?!1:o.m[e]>0&&o.m[e]>o.sl[e]&&o.m[e-1]<=o.sl[e-1]&&l[e]>59}function J(t,e){const o=E(t.C,5),l=B(t.C,14);return!o[e]||!t.C[e]?!1:l[e]>50&&t.C[e]>o[e]*.995&&t.C[e]<o[e]*1.02}function _(t,e){const o=q(t.H,t.L,t.C,89);return o.k[e]!=null&&o.k[e]>85}function Q(t,e){const o=B(t.C,5);return o[e]!=null&&o[e]<40}function mt(t,e,o,l){return pt(t,e)||J(o,l)||_(o,l)||Q(o,l)}function ft(t,e){return J(t,e)||_(t,e)||Q(t,e)}function bt(t,e){const o=E(t.C,10);return t.C[e]!=null&&o[e]!=null&&t.C[e]<o[e]}function vt(t,e){const o=E(t.C,10);return t.C[e]!=null&&o[e]!=null&&t.C[e]<o[e]}function ht(t,e,o,l,c){const{sizingMethod:a,riskPct:n,kellyFraction:i}=o;if(a==="fijo"){const s=t*(n/100);return Math.floor(s/e)}if(a==="kelly"){const r=Math.max(0,(c-(1-c)/1.5)*i);return Math.floor(t*r/e)}if(a==="atr"&&l){const s=t*(n/100);return Math.max(1,Math.floor(s/l))}return Math.floor(t*(n/100)/e)}function gt(t,e){const{entradaTF:o,salidaTF:l,capital:c}=e,{ts:a,O:n,H:i,L:s,C:r,V:u}=t,p=r.length,m=rt(a,n,i,s,r,u),g=ct(a,n,i,s,r,u),h=dt(i,s,r,14),d=[];let b=!1,v={},k=[{date:new Date(a[0]*1e3).toISOString().slice(0,10),equity:c}],y=c,$=.5;for(let f=50;f<p;f++){const x=new Date(a[f]*1e3).toISOString().slice(0,10),w=r[f];if(!w)continue;const nt=x,at=m.dates.findIndex((D,I)=>m.lastDates[I]>=nt||I===m.dates.length-1),S=Math.max(0,Math.min(at,m.C.length-1)),st=x.slice(0,7),U=g.dates.findIndex(D=>D>=st),L=Math.max(0,U<0?g.C.length-1:U);if(b){let D=!1;l==="diario"?D=bt(t,f):l==="semanal"&&S>0&&(D=vt(m,S));const I=L>=1&&G(g,L-1),z=S>=1&&K(m,S-1);if((!I||!z)&&(D=!0),D||f===p-1){const O=(w-v.precio)/v.precio*100,V=(w-v.precio)*v.shares,ot=Math.round((new Date(x)-new Date(v.date))/864e5);y+=V,d.push({entryDate:v.date,exitDate:x,entryPrice:v.precio,exitPrice:w,shares:v.shares,coste:v.coste,pnlPct:O,pnlAbs:V,dias:ot}),$=d.filter(lt=>lt.pnlPct>0).length/d.length,b=!1,k.push({date:x,equity:y})}}else{const D=L>=2&&G(g,L-1),I=S>=2&&K(m,S-1);if(D&&I){let z=!1;if(o==="diario"&&f>0?z=mt(t,f,m,S):o==="semanal"&&S>0&&(z=ft(m,S)),z){const O=ht(y,w,e,h[f],$);O>0&&O*w<=y&&(b=!0,v={i:f,date:x,precio:w,shares:O,coste:O*w})}}}b&&k.push({date:x,equity:y+(w-v.precio)*v.shares})}const M=d.filter(f=>f.pnlPct>0),P=d.filter(f=>f.pnlPct<=0),T=d.length?M.length/d.length:0,C=M.length?M.reduce((f,x)=>f+x.pnlPct,0)/M.length:0,F=P.length?Math.abs(P.reduce((f,x)=>f+x.pnlPct,0)/P.length):0,Z=F>0?T*C/((1-T)*F):null,W=(y-c)/c,tt=(r[p-1]-r[50])/r[50],et=d.length?Math.round(d.reduce((f,x)=>f+x.dias,0)/d.length):0;let A=c,H=0;return k.forEach(f=>{f.equity>A&&(A=f.equity);const x=(A-f.equity)/A;x>H&&(H=x)}),{trades:d,equityCurve:k,capital:y,capitalInicial:c,winRate:T,avgWin:C,avgLoss:F,profitFactor:Z,totalReturn:W,buyHold:tt,avgDias:et,maxDD:H,nTrades:d.length}}function yt(t,e){if(!t||t.length<2)return"";const o=t.map(d=>d.equity),l=820,c=200,a=Math.min(...o)*.995,n=Math.max(...o)*1.005,i=n-a||1,s=d=>(d/(o.length-1)*l).toFixed(1),r=d=>(c-(d-a)/i*c).toFixed(1),u=o.map((d,b)=>`${s(b)},${r(d)}`).join(" "),p=o[o.length-1],m=p>=e?"#40d9c0":"#f47174",g=r(e),h=`0,${c} ${u} ${l},${c}`;return`<svg viewBox="0 0 ${l} ${c}" style="width:100%;height:${c}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${m}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${g}" x2="${l}" y2="${g}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(g)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Capital inicial</text>
    <polygon points="${h}" fill="url(#eg)"/>
    <polyline points="${u}" fill="none" stroke="${m}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${l}" cy="${r(p)}" r="4" fill="${m}"/>
  </svg>`}const R=(t,e=2)=>t!=null&&isFinite(t)?(t>=0?"+":"")+t.toFixed(e)+"%":"—",j=t=>t!=null&&isFinite(t)?(t<0?"-":"")+"€"+Math.abs(t).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",X=t=>t?new Date(t+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—",xt=`
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
`;async function $t(t,{actionsSlot:e}){if(!document.getElementById("bt-css")){const a=document.createElement("style");a.id="bt-css",a.textContent=xt,document.head.appendChild(a)}e.innerHTML="",t.innerHTML='<div class="bt-wrap" id="bt-wrap"></div>';function o(a,n,i){const s=document.getElementById("bt-wrap"),{trades:r,equityCurve:u,capital:p,capitalInicial:m,winRate:g,avgWin:h,avgLoss:d,profitFactor:b,totalReturn:v,buyHold:k,avgDias:y,maxDD:$,nTrades:M}=a,P=v>=0?"var(--green)":"var(--red)",T=k>=0?"var(--green)":"var(--red)";s.innerHTML=`
      <!-- Configuración -->
      ${l(n)}

      <!-- KPIs -->
      <div class="bt-strip">
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Rentabilidad</div>
          <div class="bt-strip-val" style="color:${P};">${R(v*100)}</div>
          <div class="bt-strip-sub">vs Buy&Hold: <span style="color:${T};">${R(k*100)}</span></div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Capital Final</div>
          <div class="bt-strip-val" style="color:var(--teal);">${j(p)}</div>
          <div class="bt-strip-sub">desde ${j(m)}</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Win Rate</div>
          <div class="bt-strip-val" style="color:${g>=.5?"var(--green)":"var(--red)"};">${Math.round(g*100)}%</div>
          <div class="bt-strip-sub">${M} operaciones</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Profit Factor</div>
          <div class="bt-strip-val" style="color:${(b||0)>=1.5?"var(--green)":(b||0)>=1?"var(--amber)":"var(--red)"};">${b!=null?b.toFixed(2):"—"}</div>
          <div class="bt-strip-sub">Avg: +${h.toFixed(1)}% / -${d.toFixed(1)}%</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Máx. Drawdown</div>
          <div class="bt-strip-val" style="color:${$<.1?"var(--green)":$<.2?"var(--amber)":"var(--red)"};">-${($*100).toFixed(1)}%</div>
          <div class="bt-strip-sub">Media/op: ${y}d</div>
        </div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${i} · Equity Curve · ${n.entradaTF==="diario"?"Entrada Diaria":"Entrada Semanal"} · ${n.salidaTF==="diario"?"Salida EMA10D":"Salida EMA10S"}</div>
        ${yt(u,m)}
        <div style="display:flex;gap:16px;margin-top:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          <span>— Equity del sistema</span>
          <span>Base = capital inicial (${j(m)})</span>
          <span>${u.length} puntos</span>
        </div>
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">
          ${M} operaciones simuladas
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>Entrada</th><th>Salida</th><th>Días</th>
            <th>Precio entrada</th><th>Precio salida</th>
            <th>P&L %</th><th>P&L €</th>
          </tr></thead>
          <tbody>
            ${r.map(C=>{const F=C.pnlPct>=0?"var(--green)":"var(--red)";return`<tr>
                <td>${X(C.entryDate)}</td>
                <td>${X(C.exitDate)}</td>
                <td>${C.dias}d</td>
                <td>$${C.entryPrice.toFixed(2)}</td>
                <td>$${C.exitPrice.toFixed(2)}</td>
                <td style="color:${F};font-weight:700;">${R(C.pnlPct)}</td>
                <td style="color:${F};font-weight:700;">${j(C.pnlAbs)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
        ${M===0?'<div class="empty" style="padding:30px;"><div class="empty-icon">📊</div><div class="empty-title">Sin señales en el período</div><div class="empty-desc">Las condiciones M+S no se cumplieron suficientemente en los últimos 3 años</div></div>':""}
      </div>
    `,c(n)}function l(a={}){return`<div class="bt-config">
      <div class="bt-config-title">Configuración del Backtest</div>
      <div class="bt-config-grid">
        <div class="bt-field">
          <label>Ticker</label>
          <input type="text" id="bt-ticker" class="wl-input" placeholder="ej. AAPL, NVDA..." value="${a.ticker||""}" style="text-transform:uppercase;">
        </div>
        <div class="bt-field">
          <label>Capital inicial (€)</label>
          <input type="number" id="bt-capital" class="wl-input" value="${a.capital||1e4}">
        </div>
        <div class="bt-field">
          <label>Señal de entrada</label>
          <select id="bt-entrada" class="wl-input">
            <option value="diario" ${a.entradaTF==="diario"?"selected":""}>Diario (Stoch8↑ o MM alineadas)</option>
            <option value="semanal" ${a.entradaTF==="semanal"?"selected":""}>Semanal (Stoch89↑ + precio>EMA10)</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Señal de salida</label>
          <select id="bt-salida" class="wl-input">
            <option value="diario" ${a.salidaTF==="diario"?"selected":""}>EMA10 Diario</option>
            <option value="semanal" ${a.salidaTF==="semanal"?"selected":""}>EMA10 Semanal</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Método de sizing</label>
          <select id="bt-sizing" class="wl-input">
            <option value="fijo" ${a.sizingMethod==="fijo"?"selected":""}>% Fijo del capital</option>
            <option value="kelly" ${a.sizingMethod==="kelly"?"selected":""}>½ Kelly</option>
            <option value="atr" ${a.sizingMethod==="atr"?"selected":""}>Volatilidad ATR</option>
          </select>
        </div>
        <div class="bt-field">
          <label>% Capital por operación</label>
          <input type="number" id="bt-risk" class="wl-input" value="${a.riskPct||20}" min="1" max="100">
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="btn btn-primary" id="bt-run-btn" style="min-width:140px;">▶ Ejecutar backtest</button>
        <span id="bt-status" style="font-family:var(--mono);font-size:11px;color:var(--text3);"></span>
      </div>
    </div>`}function c(a={}){var n;(n=document.getElementById("bt-run-btn"))==null||n.addEventListener("click",async()=>{var p,m,g,h,d,b;const i=(((p=document.getElementById("bt-ticker"))==null?void 0:p.value)||"").trim().toUpperCase();if(!i)return;const s={ticker:i,capital:parseFloat((m=document.getElementById("bt-capital"))==null?void 0:m.value)||1e4,entradaTF:((g=document.getElementById("bt-entrada"))==null?void 0:g.value)||"diario",salidaTF:((h=document.getElementById("bt-salida"))==null?void 0:h.value)||"diario",sizingMethod:((d=document.getElementById("bt-sizing"))==null?void 0:d.value)||"fijo",riskPct:parseFloat((b=document.getElementById("bt-risk"))==null?void 0:b.value)||20,kellyFraction:.5},r=document.getElementById("bt-run-btn"),u=document.getElementById("bt-status");r.disabled=!0,r.textContent="⏳ Descargando...",u&&(u.textContent=`Descargando 3 años de ${i}...`);try{const v=await ut(i);u&&(u.textContent="Ejecutando simulación..."),await new Promise(y=>setTimeout(y,50));const k=gt(v,s);o(k,s,v.name||i)}catch(v){r.disabled=!1,r.textContent="▶ Ejecutar backtest",u&&(u.textContent="⚠ "+v.message)}})}return document.getElementById("bt-wrap").innerHTML=l(),c(),{destroy(){var a;(a=document.getElementById("bt-css"))==null||a.remove()}}}export{$t as render};
