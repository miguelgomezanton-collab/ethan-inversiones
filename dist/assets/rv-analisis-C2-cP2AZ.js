const es=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function ns(a){for(const d of es)try{const m=await fetch(d(a),{signal:AbortSignal.timeout(8e3)});if(!m.ok)continue;const n=await m.text();try{return JSON.parse(n)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function L(a,d){const m=2/(d+1),n=new Array(a.length).fill(null);let i=a.findIndex(e=>e!=null&&!isNaN(e));if(i<0)return n;n[i]=a[i];for(let e=i+1;e<a.length;e++){const r=a[e]!=null&&!isNaN(a[e])?a[e]:n[e-1];n[e]=r*m+n[e-1]*(1-m)}return n}function X(a,d){return a.map((m,n)=>{if(n<d-1)return null;const i=a.slice(n-d+1,n+1).filter(e=>e!=null&&!isNaN(e));return i.length===d?i.reduce((e,r)=>e+r,0)/d:null})}function j(a,d=12,m=26,n=9){const i=L(a,d),e=L(a,m),r=i.map((l,v)=>l!=null&&e[v]!=null?l-e[v]:null),o=L(r.map(l=>l??0),n);return{m:r,sl:o,hist:r.map((l,v)=>l!=null&&o[v]!=null?l-o[v]:null)}}function F(a,d=14){const m=new Array(a.length).fill(null);if(a.length<d+1)return m;let n=0,i=0;for(let o=1;o<=d;o++){const l=a[o]-a[o-1];l>0?n+=l:i-=l}let e=n/d,r=i/d;m[d]=r===0?100:100-100/(1+e/r);for(let o=d+1;o<a.length;o++){const l=a[o]-a[o-1];e=(e*(d-1)+(l>0?l:0))/d,r=(r*(d-1)+(l<0?-l:0))/d,m[o]=r===0?100:100-100/(1+e/r)}return m}function q(a,d,m,n=14,i=3){const e=m.map((o,l)=>{if(l<n-1)return null;const v=Math.max(...a.slice(l-n+1,l+1)),c=Math.min(...d.slice(l-n+1,l+1));return v===c?50:(o-c)/(v-c)*100}),r=X(e,i);return{k:r,d:X(r.map(o=>o??0),3)}}function G(a,d,m,n,i,e,r){const o={};a.forEach((v,c)=>{const $=new Date(v*1e3);let y;if(r==="W"){const s=$.getDay(),h=$.getDate()-s+(s===0?-6:1),f=new Date(+$);f.setDate(h),y=f.toISOString().slice(0,10)}else y=`${$.getFullYear()}-${String($.getMonth()+1).padStart(2,"0")}`;o[y]?(o[y].h=Math.max(o[y].h,m[c]),o[y].l=Math.min(o[y].l,n[c]),o[y].c=i[c],o[y].v+=e[c]):o[y]={o:d[c],h:m[c],l:n[c],c:i[c],v:e[c]}});const l=Object.keys(o).sort();return{O:l.map(v=>o[v].o),H:l.map(v=>o[v].h),L:l.map(v=>o[v].l),C:l.map(v=>o[v].c),V:l.map(v=>o[v].v)}}async function cs(a){var l,v,c,$,y,s,h;const d=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`,m=await ns(d),n=(v=(l=m==null?void 0:m.chart)==null?void 0:l.result)==null?void 0:v[0];if(!n)throw new Error("Sin datos");const i=($=(c=n.indicators)==null?void 0:c.quote)==null?void 0:$[0];if(!i)throw new Error("Sin quotes");const e=((h=(s=(y=n.indicators)==null?void 0:y.adjclose)==null?void 0:s[0])==null?void 0:h.adjclose)||i.close,r=e.map((f,p)=>i.close[p]&&f?f/i.close[p]:1),o=n.meta||{};return{timestamps:n.timestamp,O:i.open.map((f,p)=>f*r[p]),H:i.high.map((f,p)=>f*r[p]),L:i.low.map((f,p)=>f*r[p]),C:e,V:i.volume,name:o.shortName||o.longName||a,currency:o.currency||"USD"}}function is(a){const{timestamps:d,O:m,H:n,L:i,C:e,V:r,name:o,currency:l}=a,c=e.length-1,$=j(e),y=q(n,i,e,89);q(n,i,e,8);const s=F(e,14);F(e,5);const h=L(e,5),f=L(e,10),p=L(e,20),g=G(d,m,n,i,e,r,"W"),u=g.C.length-1,O=j(g.C),k=q(g.H,g.L,g.C,89),E=F(g.C,14),T=F(g.C,5),P=L(g.C,5),H=L(g.C,10),U=L(g.C,20),w=G(d,m,n,i,e,r,"M"),t=w.C.length-1,C=j(w.C),M=q(w.H,w.L,w.C,89),N=q(w.H,w.L,w.C,8),V=F(w.C,14),D=L(w.C,10),Y=e[c],z=e[c-1],K=Y-z,J=K/z*100,Q=H[u],x={macd:C.m[t]>0&&C.m[t]>C.sl[t],s89:M.k[t]>80&&M.k[t]>M.d[t]||M.k[t]>92,s89_opt:M.k[t]>92,rsi14:V[t]>65,s8:N.k[t]>78,precio:D[t]!=null&&w.C[t]>D[t],vals:{macd:C.m[t],macd_sl:C.sl[t],s89:M.k[t],rsi14:V[t],s8:N.k[t],close:w.C[t],ema10:D[t]}};x.cumple=x.macd&&x.s89&&x.rsi14&&x.s8&&x.precio;const S={macd:O.m[u]>0&&O.m[u]>O.sl[u],s89:k.k[u]>85&&k.k[u]>k.d[u]||k.k[u]>92,s89_opt:k.k[u]>92,rsi14:E[u]>67,precio:U[u]!=null&&g.C[u]>U[u],vals:{macd:O.m[u],macd_sl:O.sl[u],s89:k.k[u],rsi14:E[u],rsi5:T[u],close:g.C[u],ema5:P[u],ema10:H[u],ema20:U[u]}};S.cumple=S.macd&&S.s89&&S.rsi14&&S.precio;const R={macd_pos:$.m[c]>0,s89:y.k[c]>85,rsi14:s[c]>59,macd_cross:c>0&&$.m[c]>$.sl[c]&&$.m[c-1]<=$.sl[c-1],vals:{macd:$.m[c],s89:y.k[c],rsi14:s[c],ema5:h[c],ema10:f[c],ema20:p[c]}};R.cumple=R.macd_pos&&R.s89&&R.rsi14&&R.macd_cross;const Z=E[u]>50&&g.C[u]>P[u]-.005*P[u]&&g.C[u]<P[u]*1.02,ss=T[u]!=null&&T[u]<40,ts=k.k[u]>85,as=R.macd_pos&&R.macd_cross&&R.rsi14&&$.m[c]>0;let _=0;return x.macd&&_++,x.s89&&_++,x.rsi14&&_++,x.s8&&_++,x.precio&&_++,S.macd&&_++,S.s89&&_++,S.rsi14&&_++,S.precio&&_++,x.cumple&&S.cumple&&_++,{price:Y,prevClose:z,change:K,changePct:J,stopSemanal:Q,score:_,mc:x,sc:S,dc:R,señal_ema5_w:Z,señal_rsi5_w:ss,señal_s89_w:ts,señal_diaria:as,name:o,currency:l}}const W={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"*/*","Accept-Language":"en-US,en;q=0.9",Referer:"https://finance.yahoo.com/"};async function os(){const d=(await fetch("https://finance.yahoo.com",{headers:{...W,Accept:"text/html"},redirect:"follow"})).headers.get("set-cookie")||"",m=await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb",{headers:{...W,Cookie:d}});if(!m.ok)throw new Error(`Crumb HTTP ${m.status}`);const n=(await m.text()).trim();if(!n||n.length<3)throw new Error("Crumb inválido");return{crumb:n,cookie:d}}async function ls(a){var c,$,y,s,h,f;const{crumb:d,cookie:m}=await os(),n=`https://query2.finance.yahoo.com/v7/finance/options/${a}?crumb=${encodeURIComponent(d)}`,i=await fetch(n,{headers:{...W,Cookie:m}});if(!i.ok)throw new Error(`Yahoo options HTTP ${i.status}`);const e=await i.json(),r=($=(c=e==null?void 0:e.optionChain)==null?void 0:c.result)==null?void 0:$[0];if(!r)throw new Error("Sin cadena de opciones");const o=r.expirationDates||[],l=((s=(y=r.options)==null?void 0:y[0])==null?void 0:s.calls)||[],v=((f=(h=r.options)==null?void 0:h[0])==null?void 0:f.puts)||[];return{expirations:o,calls:l,puts:v,quote:r.quote,crumb:d,cookie:m}}async function ds(a,d,m,n){var c,$,y,s,h,f;const i=`https://query2.finance.yahoo.com/v7/finance/options/${a}?date=${d}&crumb=${encodeURIComponent(m)}`,e=await fetch(i,{headers:{...W,Cookie:n}});if(!e.ok)throw new Error(`Yahoo options HTTP ${e.status}`);const r=await e.json(),o=($=(c=r==null?void 0:r.optionChain)==null?void 0:c.result)==null?void 0:$[0];if(!o)throw new Error("Sin datos");const l=((s=(y=o.options)==null?void 0:y[0])==null?void 0:s.calls)||[],v=((f=(h=o.options)==null?void 0:h[0])==null?void 0:f.puts)||[];return{calls:l,puts:v}}function rs(a,d){const m=[...new Set([...a,...d].map(e=>e.strike))].sort((e,r)=>e-r);let n=1/0,i=null;return m.forEach(e=>{const r=a.reduce((v,c)=>c.strike<e?v+(e-c.strike)*(c.openInterest||0)*100:v,0),o=d.reduce((v,c)=>c.strike>e?v+(c.strike-e)*(c.openInterest||0)*100:v,0),l=r+o;l<n&&(n=l,i=e)}),i}const I=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",A=a=>a!=null&&!isNaN(a)?"$"+a.toFixed(2):"—",B=a=>a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?(a/1e3).toFixed(0)+"k":(a==null?void 0:a.toString())||"—";function b(a,d,m,n,i=!1){return`
    <div class="an-cond-row ${a?i?"cond-opt":"cond-ok":"cond-fail"}">
      <span class="an-cond-icon">${a?i?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${d}</span>
      <span class="an-cond-val">${m}</span>
      ${n?`<span class="an-cond-thr">${n}</span>`:""}
    </div>`}async function ms(a,{actionsSlot:d}){var $,y;let m="",n=null,i=[];d.innerHTML=`
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
  `;const e=()=>document.getElementById("an-content");async function r(s){const h=e();if(h){h.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const f=await cs(s),p=is(f);m=s,o(p,s),v(s)}catch(f){const p=e();if(!p)return;p.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${f.message}</div></div>`}}}function o(s,h){const f=e();if(!f)return;const p=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",g=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",u=s.score>=8?"good":"bad",O=s.change>=0?"up":"down",k=s.change>=0?"+":"",E=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;f.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${A(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${O}">${k}${A(s.change)} (${k}${I(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP SEMANAL</div>
          <div class="an-hero-value" style="color:var(--red)">${A(s.stopSemanal)}</div>
          <div class="an-hero-sub">EMA 10 semanal · dist. ${E!=null?E+"%":"—"}</div>
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
        <div class="an-score-verdict ${u}">${g}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${b(s.mc.macd,"MACD > 0 y alcista",`${I(s.mc.vals.macd)} / sig ${I(s.mc.vals.macd_sl)}`,"> 0")}
          ${b(s.mc.s89,"Estocástico 89 > 80",`${I(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${b(s.mc.rsi14,"RSI 14 > 65",`${I(s.mc.vals.rsi14)}`,"> 65")}
          ${b(s.mc.s8,"Estocástico 8 > 78",`${I(s.mc.vals.s8)}`,"> 78")}
          ${b(s.mc.precio,"Precio > EMA 10",`${A(s.mc.vals.close)} / EMA ${A(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${b(s.sc.macd,"MACD > 0 y alcista",`${I(s.sc.vals.macd)} / sig ${I(s.sc.vals.macd_sl)}`,"> 0")}
          ${b(s.sc.s89,"Estocástico 89 > 85",`${I(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${b(s.sc.rsi14,"RSI 14 > 67",`${I(s.sc.vals.rsi14)}`,"> 67")}
          ${b(s.sc.precio,"Precio > EMA 20",`${A(s.sc.vals.close)} / EMA ${A(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${A(s.sc.vals.ema5)} · EMA10 ${A(s.sc.vals.ema10)} · EMA20 ${A(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${b(s.dc.macd_pos,"MACD > 0",`${I(s.dc.vals.macd)}`,"> 0")}
          ${b(s.dc.s89,"Estocástico 89 > 85",`${I(s.dc.vals.s89)}`,"> 85")}
          ${b(s.dc.rsi14,"RSI 14 > 59",`${I(s.dc.vals.rsi14)}`,"> 59")}
          ${b(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
          <div class="an-ema-row">EMA5 ${A(s.dc.vals.ema5)} · EMA10 ${A(s.dc.vals.ema10)} · EMA20 ${A(s.dc.vals.ema20)}</div>
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
            ${l("📉","Rebote EMA5 Semanal",s.señal_ema5_w,`EMA5W: ${A(s.sc.vals.ema5)}`)}
            ${l("🔥","MACD+RSI Diario",s.señal_diaria,`MACD: ${I(s.dc.vals.macd)}`)}
            ${l("📈","Estoch89 Semanal",s.señal_s89_w,`Stoch89W: ${I(s.sc.vals.s89)}`)}
            ${l("📊","RSI5 Pullback Semanal",s.señal_rsi5_w,`RSI5W: ${I(s.sc.vals.rsi5)}`)}
            ${l("🌊","Canal Bajista",!1,"Ruptura + volumen")}
          </div>
        </div>

      </div><!-- /tf-grid -->

      <!-- OPCIONES / MAX PAIN -->
      <div id="an-options-section">
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain <span class="count">cargando...</span></div>
        <div class="empty" style="padding:30px;"><div class="loader-ring"></div></div>
      </div>
    `}function l(s,h,f,p){return`
      <div class="an-signal-card ${f?"active":""}">
        <div class="an-signal-icon">${s}</div>
        <div class="an-signal-name">${h}</div>
        <div class="an-signal-status">${f?"ACTIVA":"NO"}</div>
        <div class="an-signal-desc">${p}</div>
      </div>`}async function v(s){var f;const h=document.getElementById("an-options-section");if(h)try{const p=await ls(s);i=p.expirations,n=i[0];const{crumb:g,cookie:u}=p;c(s,p.calls,p.puts,(f=p.quote)==null?void 0:f.regularMarketPrice,g,u)}catch(p){h&&(h.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${p.message}</div>
      `)}}function c(s,h,f,p,g,u){const O=document.getElementById("an-options-section");if(!O)return;const k=rs(h,f),E={};h.forEach(t=>{E[t.strike]||(E[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),E[t.strike].callOI+=t.openInterest||0,E[t.strike].callVol+=t.volume||0,E[t.strike].callIV=t.impliedVolatility}),f.forEach(t=>{E[t.strike]||(E[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),E[t.strike].putOI+=t.openInterest||0,E[t.strike].putVol+=t.volume||0,E[t.strike].putIV=t.impliedVolatility});const T=Object.values(E).sort((t,C)=>t.strike-C.strike),P=Math.max(...T.map(t=>Math.max(t.callOI,t.putOI))),H=p?T.filter(t=>t.strike>=p*.8&&t.strike<=p*1.2):T,U=H.length>0?H:T.slice(0,40),w=i.map(t=>{const M=new Date(t*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});return`<option value="${t}" ${t===n?"selected":""}>${M}</option>`}).join("");if(O.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:14px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain
          <span class="count">${s} · vencimiento próximo</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${i.length>1?`<select id="an-expiry-select" class="sc2-sel">${w}</select>`:""}
          <div class="an-maxpain-badge">🎯 Max Pain: <strong>${A(k)}</strong></div>
        </div>
      </div>

      <div class="an-options-legend">
        <span class="an-leg-call">■ Calls (OI)</span>
        <span class="an-leg-put">■ Puts (OI)</span>
        ${p?`<span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Precio actual: ${A(p)} · Max Pain: ${A(k)}</span>`:""}
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
            ${U.map(t=>{const C=k&&Math.abs(t.strike-k)<.5,M=p&&Math.abs(t.strike-p)<p*.005,N=P>0?(t.callOI/P*100).toFixed(1):0,V=P>0?(t.putOI/P*100).toFixed(1):0;return`
                <tr class="${C?"an-row-maxpain":M?"an-row-atm":""}">
                  <td class="an-call-cell">
                    <div class="an-oi-wrap">
                      <div class="an-oi-bar call" style="width:${N}%"></div>
                      <span class="an-oi-num">${B(t.callOI)}</span>
                    </div>
                  </td>
                  <td class="an-num">${B(t.callVol)}</td>
                  <td class="an-num">${t.callIV!=null?(t.callIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-strike-col ${C?"maxpain":""}${M?" atm":""}">
                    ${A(t.strike)}
                    ${C?'<span class="an-mp-tag">MAX PAIN</span>':""}
                    ${M?'<span class="an-atm-tag">ATM</span>':""}
                  </td>
                  <td class="an-num">${t.putIV!=null?(t.putIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-num">${B(t.putVol)}</td>
                  <td class="an-put-cell">
                    <div class="an-oi-wrap reverse">
                      <span class="an-oi-num">${B(t.putOI)}</span>
                      <div class="an-oi-bar put" style="width:${V}%"></div>
                    </div>
                  </td>
                </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ OI = Open Interest (contratos abiertos) · Max Pain = strike donde el vendedor de opciones pierde menos. Solo vencimientos disponibles en Yahoo Finance.
        </div>
      </div>
    `,i.length>1){const t=document.getElementById("an-expiry-select");t&&t.addEventListener("change",async()=>{var C,M;n=parseInt(t.value),t.disabled=!0;try{const N=((M=(C=document.querySelector(".an-hero-value"))==null?void 0:C.textContent)==null?void 0:M.replace("$",""))||null,{calls:V,puts:D}=await ds(m,n,g,u);c(m,V,D,parseFloat(N),g,u)}catch(N){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${N.message}</div>`}t.disabled=!1})}}return($=document.getElementById("an-analyze-btn"))==null||$.addEventListener("click",()=>{var h;const s=(h=document.getElementById("an-input"))==null?void 0:h.value.trim().toUpperCase();s&&r(s)}),(y=document.getElementById("an-input"))==null||y.addEventListener("keydown",s=>{if(s.key==="Enter"){const h=s.target.value.trim().toUpperCase();h&&r(h)}s.target.value=s.target.value.toUpperCase()}),{destroy(){}}}export{ms as render};
