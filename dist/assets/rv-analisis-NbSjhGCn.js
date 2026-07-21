import{s as ts}from"./index-DuMkqd25.js";const ns=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function cs(a){for(const l of ns)try{const d=await fetch(l(a),{signal:AbortSignal.timeout(8e3)});if(!d.ok)continue;const n=await d.text();try{return JSON.parse(n)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function N(a,l){const d=2/(l+1),n=new Array(a.length).fill(null);let c=a.findIndex(e=>e!=null&&!isNaN(e));if(c<0)return n;n[c]=a[c];for(let e=c+1;e<a.length;e++){const u=a[e]!=null&&!isNaN(a[e])?a[e]:n[e-1];n[e]=u*d+n[e-1]*(1-d)}return n}function Q(a,l){return a.map((d,n)=>{if(n<l-1)return null;const c=a.slice(n-l+1,n+1).filter(e=>e!=null&&!isNaN(e));return c.length===l?c.reduce((e,u)=>e+u,0)/l:null})}function K(a,l=12,d=26,n=9){const c=N(a,l),e=N(a,d),u=c.map((r,m)=>r!=null&&e[m]!=null?r-e[m]:null),o=N(u.map(r=>r??0),n);return{m:u,sl:o,hist:u.map((r,m)=>r!=null&&o[m]!=null?r-o[m]:null)}}function q(a,l=14){const d=new Array(a.length).fill(null);if(a.length<l+1)return d;let n=0,c=0;for(let o=1;o<=l;o++){const r=a[o]-a[o-1];r>0?n+=r:c-=r}let e=n/l,u=c/l;d[l]=u===0?100:100-100/(1+e/u);for(let o=l+1;o<a.length;o++){const r=a[o]-a[o-1];e=(e*(l-1)+(r>0?r:0))/l,u=(u*(l-1)+(r<0?-r:0))/l,d[o]=u===0?100:100-100/(1+e/u)}return d}function W(a,l,d,n=14,c=3){const e=d.map((o,r)=>{if(r<n-1)return null;const m=Math.max(...a.slice(r-n+1,r+1)),i=Math.min(...l.slice(r-n+1,r+1));return m===i?50:(o-i)/(m-i)*100}),u=Q(e,c);return{k:u,d:Q(u.map(o=>o??0),3)}}function G(a,l,d,n,c,e,u){const o={};a.forEach((m,i)=>{const y=new Date(m*1e3);let I;if(u==="W"){const T=y.getDay(),R=y.getDate()-T+(T===0?-6:1),M=new Date(+y);M.setDate(R),I=M.toISOString().slice(0,10)}else I=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}`;o[I]?(o[I].h=Math.max(o[I].h,d[i]),o[I].l=Math.min(o[I].l,n[i]),o[I].c=c[i],o[I].v+=e[i]):o[I]={o:l[i],h:d[i],l:n[i],c:c[i],v:e[i]}});const r=Object.keys(o).sort();return{O:r.map(m=>o[m].o),H:r.map(m=>o[m].h),L:r.map(m=>o[m].l),C:r.map(m=>o[m].c),V:r.map(m=>o[m].v)}}async function is(a){var r,m,i,y,I,T,R;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`,d=await cs(l),n=(m=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:m[0];if(!n)throw new Error("Sin datos");const c=(y=(i=n.indicators)==null?void 0:i.quote)==null?void 0:y[0];if(!c)throw new Error("Sin quotes");const e=((R=(T=(I=n.indicators)==null?void 0:I.adjclose)==null?void 0:T[0])==null?void 0:R.adjclose)||c.close,u=e.map((M,C)=>c.close[C]&&M?M/c.close[C]:1),o=n.meta||{};return{timestamps:n.timestamp,O:c.open.map((M,C)=>M*u[C]),H:c.high.map((M,C)=>M*u[C]),L:c.low.map((M,C)=>M*u[C]),C:e,V:c.volume,name:o.shortName||o.longName||a,currency:o.currency||"USD"}}function os(a){const{timestamps:l,O:d,H:n,L:c,C:e,V:u,name:o,currency:r}=a,i=e.length-1,y=K(e),I=W(n,c,e,89);W(n,c,e,8);const T=q(e,14);q(e,5);const R=N(e,5),M=N(e,10),C=N(e,20),x=G(l,d,n,c,e,u,"W"),s=x.C.length-1,f=K(x.C),p=W(x.H,x.L,x.C,89),v=q(x.C,14),b=q(x.C,5),k=N(x.C,5),h=N(x.C,10),P=N(x.C,20),g=G(l,d,n,c,e,u,"M"),$=g.C.length-1,U=K(g.C),V=W(g.H,g.L,g.C,89),B=W(g.H,g.L,g.C,8),j=q(g.C,14),X=N(g.C,10),z=e[i],F=e[i-1],t=z-F,D=t/F*100,H=h[s],E={macd:U.m[$]>0&&U.m[$]>U.sl[$],s89:V.k[$]>80&&V.k[$]>V.d[$]||V.k[$]>92,s89_opt:V.k[$]>92,rsi14:j[$]>65,s8:B.k[$]>78,precio:X[$]!=null&&g.C[$]>X[$],vals:{macd:U.m[$],macd_sl:U.sl[$],s89:V.k[$],rsi14:j[$],s8:B.k[$],close:g.C[$],ema10:X[$]}};E.cumple=E.macd&&E.s89&&E.rsi14&&E.s8&&E.precio;const w={macd:f.m[s]>0&&f.m[s]>f.sl[s],s89:p.k[s]>85&&p.k[s]>p.d[s]||p.k[s]>92,s89_opt:p.k[s]>92,rsi14:v[s]>67,precio:P[s]!=null&&x.C[s]>P[s],vals:{macd:f.m[s],macd_sl:f.sl[s],s89:p.k[s],rsi14:v[s],rsi5:b[s],close:x.C[s],ema5:k[s],ema10:h[s],ema20:P[s]}};w.cumple=w.macd&&w.s89&&w.rsi14&&w.precio;const _={macd_pos:y.m[i]>0,s89:I.k[i]>85,rsi14:T[i]>59,macd_cross:i>0&&y.m[i]>y.sl[i]&&y.m[i-1]<=y.sl[i-1],vals:{macd:y.m[i],s89:I.k[i],rsi14:T[i],ema5:R[i],ema10:M[i],ema20:C[i]}};_.cumple=_.macd_pos&&_.s89&&_.rsi14&&_.macd_cross;const Z=v[s]>50&&x.C[s]>k[s]-.005*k[s]&&x.C[s]<k[s]*1.02,ss=b[s]!=null&&b[s]<40,as=p.k[s]>85,es=_.macd_pos&&_.macd_cross&&_.rsi14&&y.m[i]>0;let L=0;return E.macd&&L++,E.s89&&L++,E.rsi14&&L++,E.s8&&L++,E.precio&&L++,w.macd&&L++,w.s89&&L++,w.rsi14&&L++,w.precio&&L++,E.cumple&&w.cumple&&L++,{price:z,prevClose:F,change:t,changePct:D,stopSemanal:H,score:L,mc:E,sc:w,dc:_,señal_ema5_w:Z,señal_rsi5_w:ss,señal_s89_w:as,señal_diaria:es,name:o,currency:r}}async function ls(a){const l=await fetch(`/api/options?ticker=${encodeURIComponent(a)}`);if(!l.ok)throw new Error(`API options HTTP ${l.status}`);const d=await l.json();if(d.error)throw new Error(d.error);return d}async function J(a,l){const d=await fetch(`/api/options?ticker=${encodeURIComponent(a)}&date=${l}`);if(!d.ok)throw new Error(`API options HTTP ${d.status}`);const n=await d.json();if(n.error)throw new Error(n.error);return n}function ds(a,l){const d=[...new Set([...a,...l].map(e=>e.strike))].sort((e,u)=>e-u);let n=1/0,c=null;return d.forEach(e=>{const u=a.reduce((m,i)=>i.strike<e?m+(e-i.strike)*(i.openInterest||0)*100:m,0),o=l.reduce((m,i)=>i.strike>e?m+(i.strike-e)*(i.openInterest||0)*100:m,0),r=u+o;r<n&&(n=r,c=e)}),c}const O=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",A=a=>a!=null&&!isNaN(a)?"$"+a.toFixed(2):"—",Y=a=>a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?(a/1e3).toFixed(0)+"k":(a==null?void 0:a.toString())||"—";function S(a,l,d,n,c=!1){return`
    <div class="an-cond-row ${a?c?"an-cond-opt":"an-cond-ok":"an-cond-fail"}">
      <span class="an-cond-icon">${a?c?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${l}</span>
      <span class="an-cond-val">${d}</span>
      ${n?`<span class="an-cond-thr">${n}</span>`:""}
    </div>`}async function ms(a,{actionsSlot:l,savedState:d}){var C,x;let n="",c=null,e=[];l.innerHTML=`
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
  `;const u=()=>document.getElementById("an-content");async function o(s){ts("alc-rv-analisis",{ticker:s});const f=u();if(f){f.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const p=await is(s),v=os(p);n=s,r(v,s),R(s)}catch(p){const v=u();if(!v)return;v.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${p.message}</div></div>`}}}function r(s,f){const p=u();if(!p)return;const v=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",b=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",k=s.score>=8?"good":"bad",h=s.change>=0?"up":"down",P=s.change>=0?"+":"",g=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;p.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${A(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${h}">${P}${A(s.change)} (${P}${O(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP SEMANAL</div>
          <div class="an-hero-value" style="color:var(--red)">${A(s.stopSemanal)}</div>
          <div class="an-hero-sub">EMA 10 semanal · dist. ${g!=null?g+"%":"—"}</div>
        </div>
      </div>

      <!-- SCORE BAR -->
      <div class="an-score-section">
        <div class="an-score-label">SCORE ETHAN</div>
        <div class="an-score-track">
          <div class="an-score-fill" style="width:${s.score*10}%;background:linear-gradient(90deg,${v}88,${v})"></div>
          <div class="an-score-dot" style="left:${s.score*10}%;background:${v}"></div>
        </div>
        <div class="an-score-num" style="color:${v}">${s.score}/10</div>
        <div class="an-score-verdict ${k}">${b}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${S(s.mc.macd,"MACD > 0 y alcista",`${O(s.mc.vals.macd)} / sig ${O(s.mc.vals.macd_sl)}`,"> 0")}
          ${S(s.mc.s89,"Estocástico 89 > 80",`${O(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${S(s.mc.rsi14,"RSI 14 > 65",`${O(s.mc.vals.rsi14)}`,"> 65")}
          ${S(s.mc.s8,"Estocástico 8 > 78",`${O(s.mc.vals.s8)}`,"> 78")}
          ${S(s.mc.precio,"Precio > EMA 10",`${A(s.mc.vals.close)} / EMA ${A(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${S(s.sc.macd,"MACD > 0 y alcista",`${O(s.sc.vals.macd)} / sig ${O(s.sc.vals.macd_sl)}`,"> 0")}
          ${S(s.sc.s89,"Estocástico 89 > 85",`${O(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${S(s.sc.rsi14,"RSI 14 > 67",`${O(s.sc.vals.rsi14)}`,"> 67")}
          ${S(s.sc.precio,"Precio > EMA 20",`${A(s.sc.vals.close)} / EMA ${A(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${A(s.sc.vals.ema5)} · EMA10 ${A(s.sc.vals.ema10)} · EMA20 ${A(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${S(s.dc.macd_pos,"MACD > 0",`${O(s.dc.vals.macd)}`,"> 0")}
          ${S(s.dc.s89,"Estocástico 89 > 85",`${O(s.dc.vals.s89)}`,"> 85")}
          ${S(s.dc.rsi14,"RSI 14 > 59",`${O(s.dc.vals.rsi14)}`,"> 59")}
          ${S(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
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
            ${m("📉","Rebote EMA5 Semanal",s.señal_ema5_w,`EMA5W: ${A(s.sc.vals.ema5)}`)}
            ${m("🔥","MACD+RSI Diario",s.señal_diaria,`MACD: ${O(s.dc.vals.macd)}`)}
            ${m("📈","Estoch89 Semanal",s.señal_s89_w,`Stoch89W: ${O(s.sc.vals.s89)}`)}
            ${m("📊","RSI5 Pullback Semanal",s.señal_rsi5_w,`RSI5W: ${O(s.sc.vals.rsi5)}`)}
            ${m("🌊","Canal Bajista",!1,"Ruptura + volumen")}
          </div>
        </div>

      </div><!-- /tf-grid -->

      <!-- OPCIONES / MAX PAIN -->
      <div id="an-options-section">
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain <span class="count">cargando...</span></div>
        <div class="empty" style="padding:30px;"><div class="loader-ring"></div></div>
      </div>
    `}function m(s,f,p,v){return`
      <div class="an-signal-card ${p?"active":""}">
        <div class="an-signal-icon">${s}</div>
        <div class="an-signal-name">${f}</div>
        <div class="an-signal-status">${p?"ACTIVA":"NO"}</div>
        <div class="an-signal-desc">${v}</div>
      </div>`}function i(s){const f=new Date(s*1e3);return f.getDay()!==5?!1:f.getDate()>=15&&f.getDate()<=21}function y(s){return i(s)?[2,5,8,11].includes(new Date(s*1e3).getMonth()):!1}function I(s){const p=new Date(s*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}),v=new Date;v.setHours(0,0,0,0);const b=new Date(s*1e3);b.setHours(0,0,0,0);const k=Math.round((b-v)/864e5),h=k===0?"HOY":k===1?"mañana":k+"d";return y(s)?p+" ("+h+") ⭐ OPEX TRIM.":i(s)?p+" ("+h+") 📅 OPEX MENS.":p+" ("+h+")"}function T(s){const f=Date.now()/1e3,p=s.filter(v=>v>f);return p.length?p.find(v=>i(v))||p[0]:s[0]}async function R(s){const f=document.getElementById("an-options-section");if(f)try{const p=await ls(s);if(e=p.expirationDates||[],c=T(e),c!==e[0]){const v=await J(s,c);M(s,v.calls,v.puts,p.price)}else M(s,p.calls,p.puts,p.price)}catch(p){f&&(f.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${p.message}</div>
      `)}}function M(s,f,p,v){const b=document.getElementById("an-options-section");if(!b)return;const k=ds(f,p),h={};f.forEach(t=>{h[t.strike]||(h[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),h[t.strike].callOI+=t.openInterest||0,h[t.strike].callVol+=t.volume||0,h[t.strike].callIV=t.impliedVolatility}),p.forEach(t=>{h[t.strike]||(h[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),h[t.strike].putOI+=t.openInterest||0,h[t.strike].putVol+=t.volume||0,h[t.strike].putIV=t.impliedVolatility});const P=Object.values(h).sort((t,D)=>t.strike-D.strike),g=Math.max(...P.map(t=>Math.max(t.callOI,t.putOI))),$=v?P.filter(t=>t.strike>=v*.8&&t.strike<=v*1.2):P,U=$.length>0?$:P.slice(0,40),V=e.map(t=>`<option value="${t}" ${t===c?"selected":""}>${I(t)}</option>`).join(""),B=i(c),j=y(c),X=new Date;X.setHours(0,0,0,0);const z=new Date(c*1e3);z.setHours(0,0,0,0);const F=Math.round((z-X)/864e5);if(b.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:10px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain</div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${e.length>1?`<select id="an-expiry-select" class="sc2-sel">${V}</select>`:""}
          <div class="an-maxpain-badge">🎯 Max Pain: <strong>${A(k)}</strong></div>
        </div>
      </div>

      <!-- Panel explicativo OPEX -->
      <div class="an-opex-info">
        <div class="an-opex-left">
          <span class="an-opex-badge ${j?"quarterly":B?"monthly":"weekly"}">
            ${j?"⭐ OPEX TRIMESTRAL":B?"📅 OPEX MENSUAL":"📆 VENCIMIENTO SEMANAL"}
          </span>
          <span class="an-opex-days">${F===0?"Vence HOY":F===1?"Vence mañana":`Vence en ${F} días`}</span>
        </div>
        <div class="an-opex-explain">
          ${j?"⭐ <strong>OPEX Trimestral</strong> — el más importante del año (mar/jun/sep/dic). Concentra el mayor volumen de contratos. El Max Pain tiene aquí su máxima influencia sobre el precio.":B?"📅 <strong>OPEX Mensual</strong> — tercer viernes de cada mes. Vencimiento de referencia para opciones estándar. El precio suele gravitar hacia el Max Pain en los días previos.":"📆 <strong>Vencimiento semanal</strong> — menor concentración de OI. El Max Pain es orientativo pero tiene menos peso que en el OPEX mensual. Se ha seleccionado el OPEX mensual más próximo automáticamente."}
        </div>
      </div>

      <div class="an-options-legend">
        <span class="an-leg-call">■ Calls (OI)</span>
        <span class="an-leg-put">■ Puts (OI)</span>
        ${v?`<span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Precio actual: ${A(v)} · Max Pain: ${A(k)}</span>`:""}
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
            ${U.map(t=>{const D=k&&Math.abs(t.strike-k)<.5,H=v&&Math.abs(t.strike-v)<v*.005,E=g>0?(t.callOI/g*100).toFixed(1):0,w=g>0?(t.putOI/g*100).toFixed(1):0;return`
                <tr class="${D?"an-row-maxpain":H?"an-row-atm":""}">
                  <td class="an-call-cell">
                    <div class="an-oi-wrap">
                      <div class="an-oi-bar call" style="width:${E}%"></div>
                      <span class="an-oi-num">${Y(t.callOI)}</span>
                    </div>
                  </td>
                  <td class="an-num">${Y(t.callVol)}</td>
                  <td class="an-num">${t.callIV!=null?(t.callIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-strike-col ${D?"maxpain":""}${H?" atm":""}">
                    ${A(t.strike)}
                    ${D?'<span class="an-mp-tag">MAX PAIN</span>':""}
                    ${H?'<span class="an-atm-tag">ATM</span>':""}
                  </td>
                  <td class="an-num">${t.putIV!=null?(t.putIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-num">${Y(t.putVol)}</td>
                  <td class="an-put-cell">
                    <div class="an-oi-wrap reverse">
                      <span class="an-oi-num">${Y(t.putOI)}</span>
                      <div class="an-oi-bar put" style="width:${w}%"></div>
                    </div>
                  </td>
                </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ OI = Open Interest (contratos abiertos) · Max Pain = strike donde el vendedor de opciones pierde menos. Solo vencimientos disponibles en Yahoo Finance.
        </div>
      </div>
    `,e.length>1){const t=document.getElementById("an-expiry-select");t&&t.addEventListener("change",async()=>{var D,H;c=parseInt(t.value),t.disabled=!0;try{const E=((H=(D=document.querySelector(".an-hero-value"))==null?void 0:D.textContent)==null?void 0:H.replace("$",""))||null,{calls:w,puts:_}=await J(n,c);M(n,w,_,parseFloat(E))}catch(E){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${E.message}</div>`}t.disabled=!1})}}if((C=document.getElementById("an-analyze-btn"))==null||C.addEventListener("click",()=>{var f;const s=(f=document.getElementById("an-input"))==null?void 0:f.value.trim().toUpperCase();s&&o(s)}),(x=document.getElementById("an-input"))==null||x.addEventListener("keydown",s=>{if(s.key==="Enter"){const f=s.target.value.trim().toUpperCase();f&&o(f)}s.target.value=s.target.value.toUpperCase()}),d!=null&&d.ticker){const s=document.getElementById("an-input");s&&(s.value=d.ticker),o(d.ticker)}return{destroy(){}}}export{ms as render};
