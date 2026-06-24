const ts=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function ns(a){for(const l of ts)try{const m=await fetch(l(a),{signal:AbortSignal.timeout(8e3)});if(!m.ok)continue;const n=await m.text();try{return JSON.parse(n)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function R(a,l){const m=2/(l+1),n=new Array(a.length).fill(null);let o=a.findIndex(e=>e!=null&&!isNaN(e));if(o<0)return n;n[o]=a[o];for(let e=o+1;e<a.length;e++){const v=a[e]!=null&&!isNaN(a[e])?a[e]:n[e-1];n[e]=v*m+n[e-1]*(1-m)}return n}function Q(a,l){return a.map((m,n)=>{if(n<l-1)return null;const o=a.slice(n-l+1,n+1).filter(e=>e!=null&&!isNaN(e));return o.length===l?o.reduce((e,v)=>e+v,0)/l:null})}function K(a,l=12,m=26,n=9){const o=R(a,l),e=R(a,m),v=o.map((r,u)=>r!=null&&e[u]!=null?r-e[u]:null),d=R(v.map(r=>r??0),n);return{m:v,sl:d,hist:v.map((r,u)=>r!=null&&d[u]!=null?r-d[u]:null)}}function q(a,l=14){const m=new Array(a.length).fill(null);if(a.length<l+1)return m;let n=0,o=0;for(let d=1;d<=l;d++){const r=a[d]-a[d-1];r>0?n+=r:o-=r}let e=n/l,v=o/l;m[l]=v===0?100:100-100/(1+e/v);for(let d=l+1;d<a.length;d++){const r=a[d]-a[d-1];e=(e*(l-1)+(r>0?r:0))/l,v=(v*(l-1)+(r<0?-r:0))/l,m[d]=v===0?100:100-100/(1+e/v)}return m}function W(a,l,m,n=14,o=3){const e=m.map((d,r)=>{if(r<n-1)return null;const u=Math.max(...a.slice(r-n+1,r+1)),i=Math.min(...l.slice(r-n+1,r+1));return u===i?50:(d-i)/(u-i)*100}),v=Q(e,o);return{k:v,d:Q(v.map(d=>d??0),3)}}function G(a,l,m,n,o,e,v){const d={};a.forEach((u,i)=>{const g=new Date(u*1e3);let y;if(v==="W"){const L=g.getDay(),T=g.getDate()-L+(L===0?-6:1),A=new Date(+g);A.setDate(T),y=A.toISOString().slice(0,10)}else y=`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}`;d[y]?(d[y].h=Math.max(d[y].h,m[i]),d[y].l=Math.min(d[y].l,n[i]),d[y].c=o[i],d[y].v+=e[i]):d[y]={o:l[i],h:m[i],l:n[i],c:o[i],v:e[i]}});const r=Object.keys(d).sort();return{O:r.map(u=>d[u].o),H:r.map(u=>d[u].h),L:r.map(u=>d[u].l),C:r.map(u=>d[u].c),V:r.map(u=>d[u].v)}}async function cs(a){var r,u,i,g,y,L,T;const l=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`,m=await ns(l),n=(u=(r=m==null?void 0:m.chart)==null?void 0:r.result)==null?void 0:u[0];if(!n)throw new Error("Sin datos");const o=(g=(i=n.indicators)==null?void 0:i.quote)==null?void 0:g[0];if(!o)throw new Error("Sin quotes");const e=((T=(L=(y=n.indicators)==null?void 0:y.adjclose)==null?void 0:L[0])==null?void 0:T.adjclose)||o.close,v=e.map((A,w)=>o.close[w]&&A?A/o.close[w]:1),d=n.meta||{};return{timestamps:n.timestamp,O:o.open.map((A,w)=>A*v[w]),H:o.high.map((A,w)=>A*v[w]),L:o.low.map((A,w)=>A*v[w]),C:e,V:o.volume,name:d.shortName||d.longName||a,currency:d.currency||"USD"}}function is(a){const{timestamps:l,O:m,H:n,L:o,C:e,V:v,name:d,currency:r}=a,i=e.length-1,g=K(e),y=W(n,o,e,89);W(n,o,e,8);const L=q(e,14);q(e,5);const T=R(e,5),A=R(e,10),w=R(e,20),s=G(l,m,n,o,e,v,"W"),t=s.C.length-1,f=K(s.C),p=W(s.H,s.L,s.C,89),S=q(s.C,14),O=q(s.C,5),$=R(s.C,5),D=R(s.C,10),_=R(s.C,20),x=G(l,m,n,o,e,v,"M"),h=x.C.length-1,U=K(x.C),N=W(x.H,x.L,x.C,89),j=W(x.H,x.L,x.C,8),z=q(x.C,14),B=R(x.C,10),X=e[i],c=e[i-1],b=X-c,H=b/c*100,F=D[t],I={macd:U.m[h]>0&&U.m[h]>U.sl[h],s89:N.k[h]>80&&N.k[h]>N.d[h]||N.k[h]>92,s89_opt:N.k[h]>92,rsi14:z[h]>65,s8:j.k[h]>78,precio:B[h]!=null&&x.C[h]>B[h],vals:{macd:U.m[h],macd_sl:U.sl[h],s89:N.k[h],rsi14:z[h],s8:j.k[h],close:x.C[h],ema10:B[h]}};I.cumple=I.macd&&I.s89&&I.rsi14&&I.s8&&I.precio;const k={macd:f.m[t]>0&&f.m[t]>f.sl[t],s89:p.k[t]>85&&p.k[t]>p.d[t]||p.k[t]>92,s89_opt:p.k[t]>92,rsi14:S[t]>67,precio:_[t]!=null&&s.C[t]>_[t],vals:{macd:f.m[t],macd_sl:f.sl[t],s89:p.k[t],rsi14:S[t],rsi5:O[t],close:s.C[t],ema5:$[t],ema10:D[t],ema20:_[t]}};k.cumple=k.macd&&k.s89&&k.rsi14&&k.precio;const V={macd_pos:g.m[i]>0,s89:y.k[i]>85,rsi14:L[i]>59,macd_cross:i>0&&g.m[i]>g.sl[i]&&g.m[i-1]<=g.sl[i-1],vals:{macd:g.m[i],s89:y.k[i],rsi14:L[i],ema5:T[i],ema10:A[i],ema20:w[i]}};V.cumple=V.macd_pos&&V.s89&&V.rsi14&&V.macd_cross;const Z=S[t]>50&&s.C[t]>$[t]-.005*$[t]&&s.C[t]<$[t]*1.02,ss=O[t]!=null&&O[t]<40,as=p.k[t]>85,es=V.macd_pos&&V.macd_cross&&V.rsi14&&g.m[i]>0;let P=0;return I.macd&&P++,I.s89&&P++,I.rsi14&&P++,I.s8&&P++,I.precio&&P++,k.macd&&P++,k.s89&&P++,k.rsi14&&P++,k.precio&&P++,I.cumple&&k.cumple&&P++,{price:X,prevClose:c,change:b,changePct:H,stopSemanal:F,score:P,mc:I,sc:k,dc:V,señal_ema5_w:Z,señal_rsi5_w:ss,señal_s89_w:as,señal_diaria:es,name:d,currency:r}}async function os(a){const l=await fetch(`/api/options?ticker=${encodeURIComponent(a)}`);if(!l.ok)throw new Error(`API options HTTP ${l.status}`);const m=await l.json();if(m.error)throw new Error(m.error);return m}async function J(a,l){const m=await fetch(`/api/options?ticker=${encodeURIComponent(a)}&date=${l}`);if(!m.ok)throw new Error(`API options HTTP ${m.status}`);const n=await m.json();if(n.error)throw new Error(n.error);return n}function ls(a,l){const m=[...new Set([...a,...l].map(e=>e.strike))].sort((e,v)=>e-v);let n=1/0,o=null;return m.forEach(e=>{const v=a.reduce((u,i)=>i.strike<e?u+(e-i.strike)*(i.openInterest||0)*100:u,0),d=l.reduce((u,i)=>i.strike>e?u+(i.strike-e)*(i.openInterest||0)*100:u,0),r=v+d;r<n&&(n=r,o=e)}),o}const M=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",E=a=>a!=null&&!isNaN(a)?"$"+a.toFixed(2):"—",Y=a=>a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?(a/1e3).toFixed(0)+"k":(a==null?void 0:a.toString())||"—";function C(a,l,m,n,o=!1){return`
    <div class="an-cond-row ${a?o?"an-cond-opt":"an-cond-ok":"an-cond-fail"}">
      <span class="an-cond-icon">${a?o?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${l}</span>
      <span class="an-cond-val">${m}</span>
      ${n?`<span class="an-cond-thr">${n}</span>`:""}
    </div>`}async function ds(a,{actionsSlot:l}){var A,w;let m="",n=null,o=[];l.innerHTML=`
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
  `;const e=()=>document.getElementById("an-content");async function v(s){const t=e();if(t){t.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const f=await cs(s),p=is(f);m=s,d(p,s),L(s)}catch(f){const p=e();if(!p)return;p.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${f.message}</div></div>`}}}function d(s,t){const f=e();if(!f)return;const p=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",S=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",O=s.score>=8?"good":"bad",$=s.change>=0?"up":"down",D=s.change>=0?"+":"",_=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;f.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${E(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${$}">${D}${E(s.change)} (${D}${M(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP SEMANAL</div>
          <div class="an-hero-value" style="color:var(--red)">${E(s.stopSemanal)}</div>
          <div class="an-hero-sub">EMA 10 semanal · dist. ${_!=null?_+"%":"—"}</div>
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
        <div class="an-score-verdict ${O}">${S}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${C(s.mc.macd,"MACD > 0 y alcista",`${M(s.mc.vals.macd)} / sig ${M(s.mc.vals.macd_sl)}`,"> 0")}
          ${C(s.mc.s89,"Estocástico 89 > 80",`${M(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${C(s.mc.rsi14,"RSI 14 > 65",`${M(s.mc.vals.rsi14)}`,"> 65")}
          ${C(s.mc.s8,"Estocástico 8 > 78",`${M(s.mc.vals.s8)}`,"> 78")}
          ${C(s.mc.precio,"Precio > EMA 10",`${E(s.mc.vals.close)} / EMA ${E(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${C(s.sc.macd,"MACD > 0 y alcista",`${M(s.sc.vals.macd)} / sig ${M(s.sc.vals.macd_sl)}`,"> 0")}
          ${C(s.sc.s89,"Estocástico 89 > 85",`${M(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${C(s.sc.rsi14,"RSI 14 > 67",`${M(s.sc.vals.rsi14)}`,"> 67")}
          ${C(s.sc.precio,"Precio > EMA 20",`${E(s.sc.vals.close)} / EMA ${E(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${E(s.sc.vals.ema5)} · EMA10 ${E(s.sc.vals.ema10)} · EMA20 ${E(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${C(s.dc.macd_pos,"MACD > 0",`${M(s.dc.vals.macd)}`,"> 0")}
          ${C(s.dc.s89,"Estocástico 89 > 85",`${M(s.dc.vals.s89)}`,"> 85")}
          ${C(s.dc.rsi14,"RSI 14 > 59",`${M(s.dc.vals.rsi14)}`,"> 59")}
          ${C(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
          <div class="an-ema-row">EMA5 ${E(s.dc.vals.ema5)} · EMA10 ${E(s.dc.vals.ema10)} · EMA20 ${E(s.dc.vals.ema20)}</div>
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
            ${r("📉","Rebote EMA5 Semanal",s.señal_ema5_w,`EMA5W: ${E(s.sc.vals.ema5)}`)}
            ${r("🔥","MACD+RSI Diario",s.señal_diaria,`MACD: ${M(s.dc.vals.macd)}`)}
            ${r("📈","Estoch89 Semanal",s.señal_s89_w,`Stoch89W: ${M(s.sc.vals.s89)}`)}
            ${r("📊","RSI5 Pullback Semanal",s.señal_rsi5_w,`RSI5W: ${M(s.sc.vals.rsi5)}`)}
            ${r("🌊","Canal Bajista",!1,"Ruptura + volumen")}
          </div>
        </div>

      </div><!-- /tf-grid -->

      <!-- OPCIONES / MAX PAIN -->
      <div id="an-options-section">
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain <span class="count">cargando...</span></div>
        <div class="empty" style="padding:30px;"><div class="loader-ring"></div></div>
      </div>
    `}function r(s,t,f,p){return`
      <div class="an-signal-card ${f?"active":""}">
        <div class="an-signal-icon">${s}</div>
        <div class="an-signal-name">${t}</div>
        <div class="an-signal-status">${f?"ACTIVA":"NO"}</div>
        <div class="an-signal-desc">${p}</div>
      </div>`}function u(s){const t=new Date(s*1e3);return t.getDay()!==5?!1:t.getDate()>=15&&t.getDate()<=21}function i(s){return u(s)?[2,5,8,11].includes(new Date(s*1e3).getMonth()):!1}function g(s){const f=new Date(s*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}),p=new Date;p.setHours(0,0,0,0);const S=new Date(s*1e3);S.setHours(0,0,0,0);const O=Math.round((S-p)/864e5),$=O===0?"HOY":O===1?"mañana":O+"d";return i(s)?f+" ("+$+") ⭐ OPEX TRIM.":u(s)?f+" ("+$+") 📅 OPEX MENS.":f+" ("+$+")"}function y(s){const t=Date.now()/1e3,f=s.filter(p=>p>t);return f.length?f.find(p=>u(p))||f[0]:s[0]}async function L(s){const t=document.getElementById("an-options-section");if(t)try{const f=await os(s);if(o=f.expirationDates||[],n=y(o),n!==o[0]){const p=await J(s,n);T(s,p.calls,p.puts,f.price)}else T(s,f.calls,f.puts,f.price)}catch(f){t&&(t.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${f.message}</div>
      `)}}function T(s,t,f,p){const S=document.getElementById("an-options-section");if(!S)return;const O=ls(t,f),$={};t.forEach(c=>{$[c.strike]||($[c.strike]={strike:c.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),$[c.strike].callOI+=c.openInterest||0,$[c.strike].callVol+=c.volume||0,$[c.strike].callIV=c.impliedVolatility}),f.forEach(c=>{$[c.strike]||($[c.strike]={strike:c.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),$[c.strike].putOI+=c.openInterest||0,$[c.strike].putVol+=c.volume||0,$[c.strike].putIV=c.impliedVolatility});const D=Object.values($).sort((c,b)=>c.strike-b.strike),_=Math.max(...D.map(c=>Math.max(c.callOI,c.putOI))),x=p?D.filter(c=>c.strike>=p*.8&&c.strike<=p*1.2):D,h=x.length>0?x:D.slice(0,40),U=o.map(c=>`<option value="${c}" ${c===n?"selected":""}>${g(c)}</option>`).join(""),N=u(n),j=i(n),z=new Date;z.setHours(0,0,0,0);const B=new Date(n*1e3);B.setHours(0,0,0,0);const X=Math.round((B-z)/864e5);if(S.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:10px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain</div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${o.length>1?`<select id="an-expiry-select" class="sc2-sel">${U}</select>`:""}
          <div class="an-maxpain-badge">🎯 Max Pain: <strong>${E(O)}</strong></div>
        </div>
      </div>

      <!-- Panel explicativo OPEX -->
      <div class="an-opex-info">
        <div class="an-opex-left">
          <span class="an-opex-badge ${j?"quarterly":N?"monthly":"weekly"}">
            ${j?"⭐ OPEX TRIMESTRAL":N?"📅 OPEX MENSUAL":"📆 VENCIMIENTO SEMANAL"}
          </span>
          <span class="an-opex-days">${X===0?"Vence HOY":X===1?"Vence mañana":`Vence en ${X} días`}</span>
        </div>
        <div class="an-opex-explain">
          ${j?"⭐ <strong>OPEX Trimestral</strong> — el más importante del año (mar/jun/sep/dic). Concentra el mayor volumen de contratos. El Max Pain tiene aquí su máxima influencia sobre el precio.":N?"📅 <strong>OPEX Mensual</strong> — tercer viernes de cada mes. Vencimiento de referencia para opciones estándar. El precio suele gravitar hacia el Max Pain en los días previos.":"📆 <strong>Vencimiento semanal</strong> — menor concentración de OI. El Max Pain es orientativo pero tiene menos peso que en el OPEX mensual. Se ha seleccionado el OPEX mensual más próximo automáticamente."}
        </div>
      </div>

      <div class="an-options-legend">
        <span class="an-leg-call">■ Calls (OI)</span>
        <span class="an-leg-put">■ Puts (OI)</span>
        ${p?`<span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Precio actual: ${E(p)} · Max Pain: ${E(O)}</span>`:""}
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
            ${h.map(c=>{const b=O&&Math.abs(c.strike-O)<.5,H=p&&Math.abs(c.strike-p)<p*.005,F=_>0?(c.callOI/_*100).toFixed(1):0,I=_>0?(c.putOI/_*100).toFixed(1):0;return`
                <tr class="${b?"an-row-maxpain":H?"an-row-atm":""}">
                  <td class="an-call-cell">
                    <div class="an-oi-wrap">
                      <div class="an-oi-bar call" style="width:${F}%"></div>
                      <span class="an-oi-num">${Y(c.callOI)}</span>
                    </div>
                  </td>
                  <td class="an-num">${Y(c.callVol)}</td>
                  <td class="an-num">${c.callIV!=null?(c.callIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-strike-col ${b?"maxpain":""}${H?" atm":""}">
                    ${E(c.strike)}
                    ${b?'<span class="an-mp-tag">MAX PAIN</span>':""}
                    ${H?'<span class="an-atm-tag">ATM</span>':""}
                  </td>
                  <td class="an-num">${c.putIV!=null?(c.putIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-num">${Y(c.putVol)}</td>
                  <td class="an-put-cell">
                    <div class="an-oi-wrap reverse">
                      <span class="an-oi-num">${Y(c.putOI)}</span>
                      <div class="an-oi-bar put" style="width:${I}%"></div>
                    </div>
                  </td>
                </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ OI = Open Interest (contratos abiertos) · Max Pain = strike donde el vendedor de opciones pierde menos. Solo vencimientos disponibles en Yahoo Finance.
        </div>
      </div>
    `,o.length>1){const c=document.getElementById("an-expiry-select");c&&c.addEventListener("change",async()=>{var b,H;n=parseInt(c.value),c.disabled=!0;try{const F=((H=(b=document.querySelector(".an-hero-value"))==null?void 0:b.textContent)==null?void 0:H.replace("$",""))||null,{calls:I,puts:k}=await J(m,n);T(m,I,k,parseFloat(F))}catch(F){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${F.message}</div>`}c.disabled=!1})}}return(A=document.getElementById("an-analyze-btn"))==null||A.addEventListener("click",()=>{var t;const s=(t=document.getElementById("an-input"))==null?void 0:t.value.trim().toUpperCase();s&&v(s)}),(w=document.getElementById("an-input"))==null||w.addEventListener("keydown",s=>{if(s.key==="Enter"){const t=s.target.value.trim().toUpperCase();t&&v(t)}s.target.value=s.target.value.toUpperCase()}),{destroy(){}}}export{ds as render};
