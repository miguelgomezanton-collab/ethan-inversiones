import{s as ts}from"./index-BgqbrflN.js";const ns=[e=>`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,e=>`https://corsproxy.io/?${encodeURIComponent(e)}`,e=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(e)}`,e=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(e)}`];async function cs(e){for(const l of ns)try{const d=await fetch(l(e),{signal:(()=>{const n=new AbortController;return setTimeout(()=>n.abort(),8e3),n.signal})()});if(!d.ok)continue;const c=await d.text();try{return JSON.parse(c)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function N(e,l){const d=2/(l+1),c=new Array(e.length).fill(null);let n=e.findIndex(a=>a!=null&&!isNaN(a));if(n<0)return c;c[n]=e[n];for(let a=n+1;a<e.length;a++){const u=e[a]!=null&&!isNaN(e[a])?e[a]:c[a-1];c[a]=u*d+c[a-1]*(1-d)}return c}function Q(e,l){return e.map((d,c)=>{if(c<l-1)return null;const n=e.slice(c-l+1,c+1).filter(a=>a!=null&&!isNaN(a));return n.length===l?n.reduce((a,u)=>a+u,0)/l:null})}function K(e,l=12,d=26,c=9){const n=N(e,l),a=N(e,d),u=n.map((r,m)=>r!=null&&a[m]!=null?r-a[m]:null),o=N(u.map(r=>r??0),c);return{m:u,sl:o,hist:u.map((r,m)=>r!=null&&o[m]!=null?r-o[m]:null)}}function q(e,l=14){const d=new Array(e.length).fill(null);if(e.length<l+1)return d;let c=0,n=0;for(let o=1;o<=l;o++){const r=e[o]-e[o-1];r>0?c+=r:n-=r}let a=c/l,u=n/l;d[l]=u===0?100:100-100/(1+a/u);for(let o=l+1;o<e.length;o++){const r=e[o]-e[o-1];a=(a*(l-1)+(r>0?r:0))/l,u=(u*(l-1)+(r<0?-r:0))/l,d[o]=u===0?100:100-100/(1+a/u)}return d}function W(e,l,d,c=14,n=3){const a=d.map((o,r)=>{if(r<c-1)return null;const m=Math.max(...e.slice(r-c+1,r+1)),i=Math.min(...l.slice(r-c+1,r+1));return m===i?50:(o-i)/(m-i)*100}),u=Q(a,n);return{k:u,d:Q(u.map(o=>o??0),3)}}function G(e,l,d,c,n,a,u){const o={};e.forEach((m,i)=>{const y=new Date(m*1e3);let I;if(u==="W"){const T=y.getDay(),R=y.getDate()-T+(T===0?-6:1),M=new Date(+y);M.setDate(R),I=M.toISOString().slice(0,10)}else I=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}`;o[I]?(o[I].h=Math.max(o[I].h,d[i]),o[I].l=Math.min(o[I].l,c[i]),o[I].c=n[i],o[I].v+=a[i]):o[I]={o:l[i],h:d[i],l:c[i],c:n[i],v:a[i]}});const r=Object.keys(o).sort();return{O:r.map(m=>o[m].o),H:r.map(m=>o[m].h),L:r.map(m=>o[m].l),C:r.map(m=>o[m].c),V:r.map(m=>o[m].v)}}async function is(e){var r,m,i,y,I,T,R;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${e}?interval=1d&range=10y&events=history`,d=await cs(l),c=(m=(r=d==null?void 0:d.chart)==null?void 0:r.result)==null?void 0:m[0];if(!c)throw new Error("Sin datos");const n=(y=(i=c.indicators)==null?void 0:i.quote)==null?void 0:y[0];if(!n)throw new Error("Sin quotes");const a=((R=(T=(I=c.indicators)==null?void 0:I.adjclose)==null?void 0:T[0])==null?void 0:R.adjclose)||n.close,u=a.map((M,C)=>n.close[C]&&M?M/n.close[C]:1),o=c.meta||{};return{timestamps:c.timestamp,O:n.open.map((M,C)=>M*u[C]),H:n.high.map((M,C)=>M*u[C]),L:n.low.map((M,C)=>M*u[C]),C:a,V:n.volume,name:o.shortName||o.longName||e,currency:o.currency||"USD"}}function os(e){const{timestamps:l,O:d,H:c,L:n,C:a,V:u,name:o,currency:r}=e,i=a.length-1,y=K(a),I=W(c,n,a,89);W(c,n,a,8);const T=q(a,14);q(a,5);const R=N(a,5),M=N(a,10),C=N(a,20),x=G(l,d,c,n,a,u,"W"),s=x.C.length-1,f=K(x.C),p=W(x.H,x.L,x.C,89),v=q(x.C,14),S=q(x.C,5),k=N(x.C,5),h=N(x.C,10),P=N(x.C,20),g=G(l,d,c,n,a,u,"M"),$=g.C.length-1,U=K(g.C),V=W(g.H,g.L,g.C,89),B=W(g.H,g.L,g.C,8),j=q(g.C,14),X=N(g.C,10),z=a[i],F=a[i-1],t=z-F,D=t/F*100,H=h[s],E={macd:U.m[$]>0&&U.m[$]>U.sl[$],s89:V.k[$]>80&&V.k[$]>V.d[$]||V.k[$]>92,s89_opt:V.k[$]>92,rsi14:j[$]>65,s8:B.k[$]>78,precio:X[$]!=null&&g.C[$]>X[$],vals:{macd:U.m[$],macd_sl:U.sl[$],s89:V.k[$],rsi14:j[$],s8:B.k[$],close:g.C[$],ema10:X[$]}};E.cumple=E.macd&&E.s89&&E.rsi14&&E.s8&&E.precio;const w={macd:f.m[s]>0&&f.m[s]>f.sl[s],s89:p.k[s]>85&&p.k[s]>p.d[s]||p.k[s]>92,s89_opt:p.k[s]>92,rsi14:v[s]>67,precio:P[s]!=null&&x.C[s]>P[s],vals:{macd:f.m[s],macd_sl:f.sl[s],s89:p.k[s],rsi14:v[s],rsi5:S[s],close:x.C[s],ema5:k[s],ema10:h[s],ema20:P[s]}};w.cumple=w.macd&&w.s89&&w.rsi14&&w.precio;const b={macd_pos:y.m[i]>0,s89:I.k[i]>85,rsi14:T[i]>59,macd_cross:i>0&&y.m[i]>y.sl[i]&&y.m[i-1]<=y.sl[i-1],vals:{macd:y.m[i],s89:I.k[i],rsi14:T[i],ema5:R[i],ema10:M[i],ema20:C[i]}};b.cumple=b.macd_pos&&b.s89&&b.rsi14&&b.macd_cross;const Z=v[s]>50&&x.C[s]>k[s]-.005*k[s]&&x.C[s]<k[s]*1.02,ss=S[s]!=null&&S[s]<40,es=p.k[s]>85,as=b.macd_pos&&b.macd_cross&&b.rsi14&&y.m[i]>0;let L=0;return E.macd&&L++,E.s89&&L++,E.rsi14&&L++,E.s8&&L++,E.precio&&L++,w.macd&&L++,w.s89&&L++,w.rsi14&&L++,w.precio&&L++,E.cumple&&w.cumple&&L++,{price:z,prevClose:F,change:t,changePct:D,stopSemanal:H,score:L,mc:E,sc:w,dc:b,señal_ema5_w:Z,señal_rsi5_w:ss,señal_s89_w:es,señal_diaria:as,name:o,currency:r}}async function ls(e){const l=await fetch(`/api/options?ticker=${encodeURIComponent(e)}`);if(!l.ok)throw new Error(`API options HTTP ${l.status}`);const d=await l.json();if(d.error)throw new Error(d.error);return d}async function J(e,l){const d=await fetch(`/api/options?ticker=${encodeURIComponent(e)}&date=${l}`);if(!d.ok)throw new Error(`API options HTTP ${d.status}`);const c=await d.json();if(c.error)throw new Error(c.error);return c}function ds(e,l){const d=[...new Set([...e,...l].map(a=>a.strike))].sort((a,u)=>a-u);let c=1/0,n=null;return d.forEach(a=>{const u=e.reduce((m,i)=>i.strike<a?m+(a-i.strike)*(i.openInterest||0)*100:m,0),o=l.reduce((m,i)=>i.strike>a?m+(i.strike-a)*(i.openInterest||0)*100:m,0),r=u+o;r<c&&(c=r,n=a)}),n}const O=e=>e!=null&&!isNaN(e)?e.toFixed(2):"—",A=e=>e!=null&&!isNaN(e)?"$"+e.toFixed(2):"—",Y=e=>e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(0)+"k":(e==null?void 0:e.toString())||"—";function _(e,l,d,c,n=!1){return`
    <div class="an-cond-row ${e?n?"an-cond-opt":"an-cond-ok":"an-cond-fail"}">
      <span class="an-cond-icon">${e?n?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${l}</span>
      <span class="an-cond-val">${d}</span>
      ${c?`<span class="an-cond-thr">${c}</span>`:""}
    </div>`}async function ms(e,{actionsSlot:l,savedState:d}){var C,x;let c="",n=null,a=[];l.innerHTML=`
    <div class="an-search-bar">
      <input type="text" id="an-input" placeholder="Ticker: AAPL, MSFT, SAN.MC..." class="wl-input" autocomplete="off">
      <button class="btn btn-primary" id="an-analyze-btn">Analizar</button>
    </div>
  `,e.innerHTML=`
    <div id="an-content">
      <div class="empty">
        <div class="empty-icon">📊</div>
        <div class="empty-title">Análisis Técnico</div>
        <div class="empty-desc">Introduce un ticker para ver el análisis completo: score ETHAN, condiciones por timeframe, señales de entrada y cadena de opciones.</div>
      </div>
    </div>
  `;const u=()=>document.getElementById("an-content");async function o(s){ts("alc-rv-analisis",{ticker:s});const f=u();if(f){f.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const p=await is(s),v=os(p);c=s,r(v,s),R(s)}catch(p){const v=u();if(!v)return;v.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${p.message}</div></div>`}}}function r(s,f){const p=u();if(!p)return;const v=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",S=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",k=s.score>=8?"good":"bad",h=s.change>=0?"up":"down",P=s.change>=0?"+":"",g=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;p.innerHTML=`
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
        <div class="an-score-verdict ${k}">${S}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${_(s.mc.macd,"MACD > 0 y alcista",`${O(s.mc.vals.macd)} / sig ${O(s.mc.vals.macd_sl)}`,"> 0")}
          ${_(s.mc.s89,"Estocástico 89 > 80",`${O(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${_(s.mc.rsi14,"RSI 14 > 65",`${O(s.mc.vals.rsi14)}`,"> 65")}
          ${_(s.mc.s8,"Estocástico 8 > 78",`${O(s.mc.vals.s8)}`,"> 78")}
          ${_(s.mc.precio,"Precio > EMA 10",`${A(s.mc.vals.close)} / EMA ${A(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${_(s.sc.macd,"MACD > 0 y alcista",`${O(s.sc.vals.macd)} / sig ${O(s.sc.vals.macd_sl)}`,"> 0")}
          ${_(s.sc.s89,"Estocástico 89 > 85",`${O(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${_(s.sc.rsi14,"RSI 14 > 67",`${O(s.sc.vals.rsi14)}`,"> 67")}
          ${_(s.sc.precio,"Precio > EMA 20",`${A(s.sc.vals.close)} / EMA ${A(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${A(s.sc.vals.ema5)} · EMA10 ${A(s.sc.vals.ema10)} · EMA20 ${A(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${_(s.dc.macd_pos,"MACD > 0",`${O(s.dc.vals.macd)}`,"> 0")}
          ${_(s.dc.s89,"Estocástico 89 > 85",`${O(s.dc.vals.s89)}`,"> 85")}
          ${_(s.dc.rsi14,"RSI 14 > 59",`${O(s.dc.vals.rsi14)}`,"> 59")}
          ${_(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
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
      </div>`}function i(s){const f=new Date(s*1e3);return f.getDay()!==5?!1:f.getDate()>=15&&f.getDate()<=21}function y(s){return i(s)?[2,5,8,11].includes(new Date(s*1e3).getMonth()):!1}function I(s){const p=new Date(s*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}),v=new Date;v.setHours(0,0,0,0);const S=new Date(s*1e3);S.setHours(0,0,0,0);const k=Math.round((S-v)/864e5),h=k===0?"HOY":k===1?"mañana":k+"d";return y(s)?p+" ("+h+") ⭐ OPEX TRIM.":i(s)?p+" ("+h+") 📅 OPEX MENS.":p+" ("+h+")"}function T(s){const f=Date.now()/1e3,p=s.filter(v=>v>f);return p.length?p.find(v=>i(v))||p[0]:s[0]}async function R(s){const f=document.getElementById("an-options-section");if(f)try{const p=await ls(s);if(a=p.expirationDates||[],n=T(a),n!==a[0]){const v=await J(s,n);M(s,v.calls,v.puts,p.price)}else M(s,p.calls,p.puts,p.price)}catch(p){f&&(f.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${p.message}</div>
      `)}}function M(s,f,p,v){const S=document.getElementById("an-options-section");if(!S)return;const k=ds(f,p),h={};f.forEach(t=>{h[t.strike]||(h[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),h[t.strike].callOI+=t.openInterest||0,h[t.strike].callVol+=t.volume||0,h[t.strike].callIV=t.impliedVolatility}),p.forEach(t=>{h[t.strike]||(h[t.strike]={strike:t.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),h[t.strike].putOI+=t.openInterest||0,h[t.strike].putVol+=t.volume||0,h[t.strike].putIV=t.impliedVolatility});const P=Object.values(h).sort((t,D)=>t.strike-D.strike),g=Math.max(...P.map(t=>Math.max(t.callOI,t.putOI))),$=v?P.filter(t=>t.strike>=v*.8&&t.strike<=v*1.2):P,U=$.length>0?$:P.slice(0,40),V=a.map(t=>`<option value="${t}" ${t===n?"selected":""}>${I(t)}</option>`).join(""),B=i(n),j=y(n),X=new Date;X.setHours(0,0,0,0);const z=new Date(n*1e3);z.setHours(0,0,0,0);const F=Math.round((z-X)/864e5);if(S.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:10px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain</div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${a.length>1?`<select id="an-expiry-select" class="sc2-sel">${V}</select>`:""}
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
    `,a.length>1){const t=document.getElementById("an-expiry-select");t&&t.addEventListener("change",async()=>{var D,H;n=parseInt(t.value),t.disabled=!0;try{const E=((H=(D=document.querySelector(".an-hero-value"))==null?void 0:D.textContent)==null?void 0:H.replace("$",""))||null,{calls:w,puts:b}=await J(c,n);M(c,w,b,parseFloat(E))}catch(E){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${E.message}</div>`}t.disabled=!1})}}if((C=document.getElementById("an-analyze-btn"))==null||C.addEventListener("click",()=>{var f;const s=(f=document.getElementById("an-input"))==null?void 0:f.value.trim().toUpperCase();s&&o(s)}),(x=document.getElementById("an-input"))==null||x.addEventListener("keydown",s=>{if(s.key==="Enter"){const f=s.target.value.trim().toUpperCase();f&&o(f)}s.target.value=s.target.value.toUpperCase()}),d!=null&&d.ticker){const s=document.getElementById("an-input");s&&(s.value=d.ticker),o(d.ticker)}return{destroy(){}}}export{ms as render};
