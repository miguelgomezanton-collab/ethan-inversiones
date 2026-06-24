const es=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function W(a){for(const d of es)try{const m=await fetch(d(a),{signal:AbortSignal.timeout(8e3)});if(!m.ok)continue;const n=await m.text();try{return JSON.parse(n)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function P(a,d){const m=2/(d+1),n=new Array(a.length).fill(null);let i=a.findIndex(t=>t!=null&&!isNaN(t));if(i<0)return n;n[i]=a[i];for(let t=i+1;t<a.length;t++){const v=a[t]!=null&&!isNaN(a[t])?a[t]:n[t-1];n[t]=v*m+n[t-1]*(1-m)}return n}function Y(a,d){return a.map((m,n)=>{if(n<d-1)return null;const i=a.slice(n-d+1,n+1).filter(t=>t!=null&&!isNaN(t));return i.length===d?i.reduce((t,v)=>t+v,0)/d:null})}function z(a,d=12,m=26,n=9){const i=P(a,d),t=P(a,m),v=i.map((o,u)=>o!=null&&t[u]!=null?o-t[u]:null),l=P(v.map(o=>o??0),n);return{m:v,sl:l,hist:v.map((o,u)=>o!=null&&l[u]!=null?o-l[u]:null)}}function D(a,d=14){const m=new Array(a.length).fill(null);if(a.length<d+1)return m;let n=0,i=0;for(let l=1;l<=d;l++){const o=a[l]-a[l-1];o>0?n+=o:i-=o}let t=n/d,v=i/d;m[d]=v===0?100:100-100/(1+t/v);for(let l=d+1;l<a.length;l++){const o=a[l]-a[l-1];t=(t*(d-1)+(o>0?o:0))/d,v=(v*(d-1)+(o<0?-o:0))/d,m[l]=v===0?100:100-100/(1+t/v)}return m}function H(a,d,m,n=14,i=3){const t=m.map((l,o)=>{if(o<n-1)return null;const u=Math.max(...a.slice(o-n+1,o+1)),c=Math.min(...d.slice(o-n+1,o+1));return u===c?50:(l-c)/(u-c)*100}),v=Y(t,i);return{k:v,d:Y(v.map(l=>l??0),3)}}function G(a,d,m,n,i,t,v){const l={};a.forEach((u,c)=>{const $=new Date(u*1e3);let y;if(v==="W"){const s=$.getDay(),g=$.getDate()-s+(s===0?-6:1),f=new Date(+$);f.setDate(g),y=f.toISOString().slice(0,10)}else y=`${$.getFullYear()}-${String($.getMonth()+1).padStart(2,"0")}`;l[y]?(l[y].h=Math.max(l[y].h,m[c]),l[y].l=Math.min(l[y].l,n[c]),l[y].c=i[c],l[y].v+=t[c]):l[y]={o:d[c],h:m[c],l:n[c],c:i[c],v:t[c]}});const o=Object.keys(l).sort();return{O:o.map(u=>l[u].o),H:o.map(u=>l[u].h),L:o.map(u=>l[u].l),C:o.map(u=>l[u].c),V:o.map(u=>l[u].v)}}async function cs(a){var o,u,c,$,y,s,g;const d=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`,m=await W(d),n=(u=(o=m==null?void 0:m.chart)==null?void 0:o.result)==null?void 0:u[0];if(!n)throw new Error("Sin datos");const i=($=(c=n.indicators)==null?void 0:c.quote)==null?void 0:$[0];if(!i)throw new Error("Sin quotes");const t=((g=(s=(y=n.indicators)==null?void 0:y.adjclose)==null?void 0:s[0])==null?void 0:g.adjclose)||i.close,v=t.map((f,p)=>i.close[p]&&f?f/i.close[p]:1),l=n.meta||{};return{timestamps:n.timestamp,O:i.open.map((f,p)=>f*v[p]),H:i.high.map((f,p)=>f*v[p]),L:i.low.map((f,p)=>f*v[p]),C:t,V:i.volume,name:l.shortName||l.longName||a,currency:l.currency||"USD"}}function is(a){const{timestamps:d,O:m,H:n,L:i,C:t,V:v,name:l,currency:o}=a,c=t.length-1,$=z(t),y=H(n,i,t,89);H(n,i,t,8);const s=D(t,14);D(t,5);const g=P(t,5),f=P(t,10),p=P(t,20),E=G(d,m,n,i,t,v,"W"),r=E.C.length-1,I=z(E.C),k=H(E.H,E.L,E.C,89),O=D(E.C,14),R=D(E.C,5),T=P(E.C,5),U=P(E.C,10),e=P(E.C,20),A=G(d,m,n,i,t,v,"M"),h=A.C.length-1,_=z(A.C),L=H(A.H,A.L,A.C,89),V=H(A.H,A.L,A.C,8),j=D(A.C,14),B=P(A.C,10),X=t[c],q=t[c-1],K=X-q,Q=K/q*100,Z=U[r],x={macd:_.m[h]>0&&_.m[h]>_.sl[h],s89:L.k[h]>80&&L.k[h]>L.d[h]||L.k[h]>92,s89_opt:L.k[h]>92,rsi14:j[h]>65,s8:V.k[h]>78,precio:B[h]!=null&&A.C[h]>B[h],vals:{macd:_.m[h],macd_sl:_.sl[h],s89:L.k[h],rsi14:j[h],s8:V.k[h],close:A.C[h],ema10:B[h]}};x.cumple=x.macd&&x.s89&&x.rsi14&&x.s8&&x.precio;const b={macd:I.m[r]>0&&I.m[r]>I.sl[r],s89:k.k[r]>85&&k.k[r]>k.d[r]||k.k[r]>92,s89_opt:k.k[r]>92,rsi14:O[r]>67,precio:e[r]!=null&&E.C[r]>e[r],vals:{macd:I.m[r],macd_sl:I.sl[r],s89:k.k[r],rsi14:O[r],rsi5:R[r],close:E.C[r],ema5:T[r],ema10:U[r],ema20:e[r]}};b.cumple=b.macd&&b.s89&&b.rsi14&&b.precio;const N={macd_pos:$.m[c]>0,s89:y.k[c]>85,rsi14:s[c]>59,macd_cross:c>0&&$.m[c]>$.sl[c]&&$.m[c-1]<=$.sl[c-1],vals:{macd:$.m[c],s89:y.k[c],rsi14:s[c],ema5:g[c],ema10:f[c],ema20:p[c]}};N.cumple=N.macd_pos&&N.s89&&N.rsi14&&N.macd_cross;const ss=O[r]>50&&E.C[r]>T[r]-.005*T[r]&&E.C[r]<T[r]*1.02,as=R[r]!=null&&R[r]<40,ts=k.k[r]>85,ns=N.macd_pos&&N.macd_cross&&N.rsi14&&$.m[c]>0;let w=0;return x.macd&&w++,x.s89&&w++,x.rsi14&&w++,x.s8&&w++,x.precio&&w++,b.macd&&w++,b.s89&&w++,b.rsi14&&w++,b.precio&&w++,x.cumple&&b.cumple&&w++,{price:X,prevClose:q,change:K,changePct:Q,stopSemanal:Z,score:w,mc:x,sc:b,dc:N,señal_ema5_w:ss,señal_rsi5_w:as,señal_s89_w:ts,señal_diaria:ns,name:l,currency:o}}async function ls(a){var l,o,u,c,$,y;const d=`https://query2.finance.yahoo.com/v7/finance/options/${a}`,m=await W(d),n=(o=(l=m==null?void 0:m.optionChain)==null?void 0:l.result)==null?void 0:o[0];if(!n)throw new Error("Sin cadena de opciones");const i=n.expirationDates||[],t=((c=(u=n.options)==null?void 0:u[0])==null?void 0:c.calls)||[],v=((y=($=n.options)==null?void 0:$[0])==null?void 0:y.puts)||[];return{expirations:i,calls:t,puts:v,quote:n.quote}}async function J(a,d){var l,o,u,c,$,y;const m=`https://query2.finance.yahoo.com/v7/finance/options/${a}?date=${d}`,n=await W(m),i=(o=(l=n==null?void 0:n.optionChain)==null?void 0:l.result)==null?void 0:o[0];if(!i)throw new Error("Sin datos");const t=((c=(u=i.options)==null?void 0:u[0])==null?void 0:c.calls)||[],v=((y=($=i.options)==null?void 0:$[0])==null?void 0:y.puts)||[];return{calls:t,puts:v}}function os(a,d){const m=[...new Set([...a,...d].map(t=>t.strike))].sort((t,v)=>t-v);let n=1/0,i=null;return m.forEach(t=>{const v=a.reduce((u,c)=>c.strike<t?u+(t-c.strike)*(c.openInterest||0)*100:u,0),l=d.reduce((u,c)=>c.strike>t?u+(c.strike-t)*(c.openInterest||0)*100:u,0),o=v+l;o<n&&(n=o,i=t)}),i}const C=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",M=a=>a!=null&&!isNaN(a)?"$"+a.toFixed(2):"—",F=a=>a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?(a/1e3).toFixed(0)+"k":(a==null?void 0:a.toString())||"—";function S(a,d,m,n,i=!1){return`
    <div class="an-cond-row ${a?i?"cond-opt":"cond-ok":"cond-fail"}">
      <span class="an-cond-icon">${a?i?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${d}</span>
      <span class="an-cond-val">${m}</span>
      ${n?`<span class="an-cond-thr">${n}</span>`:""}
    </div>`}async function ds(a,{actionsSlot:d}){var $,y;let m="",n=null,i=[];d.innerHTML=`
    <div class="an-search-bar">
      <input type="text" id="an-input" placeholder="Ticker: AAPL, MSFT, SAN.MC..." class="wl-input" autocomplete="off">
      <button class="btn btn-primary" id="an-analyze-btn">Analizar</button>
    </div>
  `,a.innerHTML=`
    <div id="an-content">
      <div class="empty">
        <div class="empty-icon">📊</div>
        <div class="empty-title">Análisis Técnico</div>
        <div class="empty-desc">Introduce un ticker para ver el análisis completo: score ETHAN, condiciones por timeframe, señales de entrada y cadena de opciones.</div>
      </div>
    </div>
  `;const t=()=>document.getElementById("an-content");async function v(s){const g=t();if(g){g.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const f=await cs(s),p=is(f);m=s,l(p,s),u(s)}catch(f){const p=t();if(!p)return;p.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${f.message}</div></div>`}}}function l(s,g){const f=t();if(!f)return;const p=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",E=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",r=s.score>=8?"good":"bad",I=s.change>=0?"up":"down",k=s.change>=0?"+":"",O=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;f.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${M(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${I}">${k}${M(s.change)} (${k}${C(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP SEMANAL</div>
          <div class="an-hero-value" style="color:var(--red)">${M(s.stopSemanal)}</div>
          <div class="an-hero-sub">EMA 10 semanal · dist. ${O!=null?O+"%":"—"}</div>
        </div>
      </div>

      <!-- SCORE BAR -->
      <div class="an-score-section">
        <div class="an-score-label">SCORE ETHAN</div>
        <div class="an-score-track">
          <div class="an-score-fill" style="width:${s.score*10}%;background:linear-gradient(90deg,${p}88,${p})"></div>
          <div class="an-score-dot" style="left:${s.score*10}%;background:${p}"></div>
        </div>
        <div class="an-score-num" style="color:${p}">${s.score}/10</div>
        <div class="an-score-verdict ${r}">${E}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${S(s.mc.macd,"MACD > 0 y alcista",`${C(s.mc.vals.macd)} / sig ${C(s.mc.vals.macd_sl)}`,"> 0")}
          ${S(s.mc.s89,"Estocástico 89 > 80",`${C(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${S(s.mc.rsi14,"RSI 14 > 65",`${C(s.mc.vals.rsi14)}`,"> 65")}
          ${S(s.mc.s8,"Estocástico 8 > 78",`${C(s.mc.vals.s8)}`,"> 78")}
          ${S(s.mc.precio,"Precio > EMA 10",`${M(s.mc.vals.close)} / EMA ${M(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${S(s.sc.macd,"MACD > 0 y alcista",`${C(s.sc.vals.macd)} / sig ${C(s.sc.vals.macd_sl)}`,"> 0")}
          ${S(s.sc.s89,"Estocástico 89 > 85",`${C(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${S(s.sc.rsi14,"RSI 14 > 67",`${C(s.sc.vals.rsi14)}`,"> 67")}
          ${S(s.sc.precio,"Precio > EMA 20",`${M(s.sc.vals.close)} / EMA ${M(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${M(s.sc.vals.ema5)} · EMA10 ${M(s.sc.vals.ema10)} · EMA20 ${M(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${S(s.dc.macd_pos,"MACD > 0",`${C(s.dc.vals.macd)}`,"> 0")}
          ${S(s.dc.s89,"Estocástico 89 > 85",`${C(s.dc.vals.s89)}`,"> 85")}
          ${S(s.dc.rsi14,"RSI 14 > 59",`${C(s.dc.vals.rsi14)}`,"> 59")}
          ${S(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
          <div class="an-ema-row">EMA5 ${M(s.dc.vals.ema5)} · EMA10 ${M(s.dc.vals.ema10)} · EMA20 ${M(s.dc.vals.ema20)}</div>
        </div>

        <!-- SEÑALES DE ENTRADA -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title señales">◆ SEÑALES DE ENTRADA</div>
            <div class="an-tf-badge ${s.señal_diaria||s.señal_rsi5_w||s.señal_ema5_w?"ok":s.mc.cumple&&s.sc.cumple?"wait":"fail"}">
              ${s.señal_diaria?"✓ ENTRADA ACTIVA":s.señal_rsi5_w||s.señal_ema5_w?"✓ SEÑAL SEMANAL":s.mc.cumple&&s.sc.cumple?"⏳ ESPERA":"✗ INACTIVO"}
            </div>
          </div>
          <div class="an-signals-grid">
            ${o("📉","Rebote EMA5 Semanal",s.señal_ema5_w,`EMA5W: ${M(s.sc.vals.ema5)}`)}
            ${o("📊","RSI5 Bajo Semanal",s.señal_rsi5_w,`RSI5W: ${C(s.sc.vals.rsi5)}`)}
            ${o("🔥","MACD+RSI Diario",s.señal_diaria,`MACD: ${C(s.dc.vals.macd)}`)}
            ${o("📈","Estoch89 Semanal",s.señal_s89_w,`Stoch89W: ${C(s.sc.vals.s89)}`)}
          </div>
        </div>

      </div><!-- /tf-grid -->

      <!-- OPCIONES / MAX PAIN -->
      <div id="an-options-section">
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain <span class="count">cargando...</span></div>
        <div class="empty" style="padding:30px;"><div class="loader-ring"></div></div>
      </div>
    `}function o(s,g,f,p){return`
      <div class="an-signal-card ${f?"active":""}">
        <div class="an-signal-icon">${s}</div>
        <div class="an-signal-name">${g}</div>
        <div class="an-signal-status">${f?"ACTIVA":"NO"}</div>
        <div class="an-signal-desc">${p}</div>
      </div>`}async function u(s){var f;const g=document.getElementById("an-options-section");if(g)try{const p=await ls(s);if(i=p.expirations,n=i[0],c(s,p.calls,p.puts,(f=p.quote)==null?void 0:f.regularMarketPrice),i.length>1){const E=document.getElementById("an-expiry-select");E&&E.addEventListener("change",async()=>{var r;n=parseInt(E.value),E.disabled=!0;try{const{calls:I,puts:k}=await J(s,n);c(s,I,k,(r=p.quote)==null?void 0:r.regularMarketPrice)}catch(I){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error al cargar vencimiento: ${I.message}</div>`}E.disabled=!1})}}catch(p){g&&(g.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${p.message}</div>
      `)}}function c(s,g,f,p){const E=document.getElementById("an-options-section");if(!E)return;const r=os(g,f),I={};g.forEach(e=>{I[e.strike]||(I[e.strike]={strike:e.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),I[e.strike].callOI+=e.openInterest||0,I[e.strike].callVol+=e.volume||0,I[e.strike].callIV=e.impliedVolatility}),f.forEach(e=>{I[e.strike]||(I[e.strike]={strike:e.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),I[e.strike].putOI+=e.openInterest||0,I[e.strike].putVol+=e.volume||0,I[e.strike].putIV=e.impliedVolatility});const k=Object.values(I).sort((e,A)=>e.strike-A.strike),O=Math.max(...k.map(e=>Math.max(e.callOI,e.putOI))),R=p?k.filter(e=>e.strike>=p*.8&&e.strike<=p*1.2):k,T=R.length>0?R:k.slice(0,40),U=i.map(e=>{const h=new Date(e*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});return`<option value="${e}" ${e===n?"selected":""}>${h}</option>`}).join("");if(E.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:14px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain
          <span class="count">${s} · vencimiento próximo</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${i.length>1?`<select id="an-expiry-select" class="sc2-sel">${U}</select>`:""}
          <div class="an-maxpain-badge">🎯 Max Pain: <strong>${M(r)}</strong></div>
        </div>
      </div>

      <div class="an-options-legend">
        <span class="an-leg-call">■ Calls (OI)</span>
        <span class="an-leg-put">■ Puts (OI)</span>
        ${p?`<span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Precio actual: ${M(p)} · Max Pain: ${M(r)}</span>`:""}
      </div>

      <div id="an-options-body">
        <table class="sc2-table an-options-table">
          <thead>
            <tr>
              <th>CALL OI</th><th>CALL VOL</th><th>CALL IV</th>
              <th class="an-strike-col">STRIKE</th>
              <th>PUT IV</th><th>PUT VOL</th><th>PUT OI</th>
            </tr>
          </thead>
          <tbody>
            ${T.map(e=>{const A=r&&Math.abs(e.strike-r)<.5,h=p&&Math.abs(e.strike-p)<p*.005,_=O>0?(e.callOI/O*100).toFixed(1):0,L=O>0?(e.putOI/O*100).toFixed(1):0;return`
                <tr class="${A?"an-row-maxpain":h?"an-row-atm":""}">
                  <td class="an-call-cell">
                    <div class="an-oi-wrap">
                      <div class="an-oi-bar call" style="width:${_}%"></div>
                      <span class="an-oi-num">${F(e.callOI)}</span>
                    </div>
                  </td>
                  <td class="an-num">${F(e.callVol)}</td>
                  <td class="an-num">${e.callIV!=null?(e.callIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-strike-col ${A?"maxpain":""}${h?" atm":""}">
                    ${M(e.strike)}
                    ${A?'<span class="an-mp-tag">MAX PAIN</span>':""}
                    ${h?'<span class="an-atm-tag">ATM</span>':""}
                  </td>
                  <td class="an-num">${e.putIV!=null?(e.putIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-num">${F(e.putVol)}</td>
                  <td class="an-put-cell">
                    <div class="an-oi-wrap reverse">
                      <span class="an-oi-num">${F(e.putOI)}</span>
                      <div class="an-oi-bar put" style="width:${L}%"></div>
                    </div>
                  </td>
                </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ OI = Open Interest (contratos abiertos) · Max Pain = strike donde el vendedor de opciones pierde menos. Solo vencimientos disponibles en Yahoo Finance.
        </div>
      </div>
    `,i.length>1){const e=document.getElementById("an-expiry-select");e&&e.addEventListener("change",async()=>{var A,h;n=parseInt(e.value),e.disabled=!0;try{const _=((h=(A=document.querySelector(".an-hero-value"))==null?void 0:A.textContent)==null?void 0:h.replace("$",""))||null,{calls:L,puts:V}=await J(m,n);c(m,L,V,parseFloat(_))}catch(_){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${_.message}</div>`}e.disabled=!1})}}return($=document.getElementById("an-analyze-btn"))==null||$.addEventListener("click",()=>{var g;const s=(g=document.getElementById("an-input"))==null?void 0:g.value.trim().toUpperCase();s&&v(s)}),(y=document.getElementById("an-input"))==null||y.addEventListener("keydown",s=>{if(s.key==="Enter"){const g=s.target.value.trim().toUpperCase();g&&v(g)}s.target.value=s.target.value.toUpperCase()}),{destroy(){}}}export{ds as render};
