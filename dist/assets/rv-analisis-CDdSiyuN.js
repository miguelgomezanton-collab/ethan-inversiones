const ts=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];async function ns(a){for(const i of ts)try{const r=await fetch(i(a),{signal:AbortSignal.timeout(8e3)});if(!r.ok)continue;const e=await r.text();try{return JSON.parse(e)}catch{continue}}catch{}throw new Error("Sin proxy disponible")}function P(a,i){const r=2/(i+1),e=new Array(a.length).fill(null);let l=a.findIndex(t=>t!=null&&!isNaN(t));if(l<0)return e;e[l]=a[l];for(let t=l+1;t<a.length;t++){const p=a[t]!=null&&!isNaN(a[t])?a[t]:e[t-1];e[t]=p*r+e[t-1]*(1-r)}return e}function K(a,i){return a.map((r,e)=>{if(e<i-1)return null;const l=a.slice(e-i+1,e+1).filter(t=>t!=null&&!isNaN(t));return l.length===i?l.reduce((t,p)=>t+p,0)/i:null})}function z(a,i=12,r=26,e=9){const l=P(a,i),t=P(a,r),p=l.map((d,u)=>d!=null&&t[u]!=null?d-t[u]:null),o=P(p.map(d=>d??0),e);return{m:p,sl:o,hist:p.map((d,u)=>d!=null&&o[u]!=null?d-o[u]:null)}}function D(a,i=14){const r=new Array(a.length).fill(null);if(a.length<i+1)return r;let e=0,l=0;for(let o=1;o<=i;o++){const d=a[o]-a[o-1];d>0?e+=d:l-=d}let t=e/i,p=l/i;r[i]=p===0?100:100-100/(1+t/p);for(let o=i+1;o<a.length;o++){const d=a[o]-a[o-1];t=(t*(i-1)+(d>0?d:0))/i,p=(p*(i-1)+(d<0?-d:0))/i,r[o]=p===0?100:100-100/(1+t/p)}return r}function H(a,i,r,e=14,l=3){const t=r.map((o,d)=>{if(d<e-1)return null;const u=Math.max(...a.slice(d-e+1,d+1)),c=Math.min(...i.slice(d-e+1,d+1));return u===c?50:(o-c)/(u-c)*100}),p=K(t,l);return{k:p,d:K(p.map(o=>o??0),3)}}function Y(a,i,r,e,l,t,p){const o={};a.forEach((u,c)=>{const g=new Date(u*1e3);let E;if(p==="W"){const s=g.getDay(),h=g.getDate()-s+(s===0?-6:1),v=new Date(+g);v.setDate(h),E=v.toISOString().slice(0,10)}else E=`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}`;o[E]?(o[E].h=Math.max(o[E].h,r[c]),o[E].l=Math.min(o[E].l,e[c]),o[E].c=l[c],o[E].v+=t[c]):o[E]={o:i[c],h:r[c],l:e[c],c:l[c],v:t[c]}});const d=Object.keys(o).sort();return{O:d.map(u=>o[u].o),H:d.map(u=>o[u].h),L:d.map(u=>o[u].l),C:d.map(u=>o[u].c),V:d.map(u=>o[u].v)}}async function es(a){var d,u,c,g,E,s,h;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y&events=history`,r=await ns(i),e=(u=(d=r==null?void 0:r.chart)==null?void 0:d.result)==null?void 0:u[0];if(!e)throw new Error("Sin datos");const l=(g=(c=e.indicators)==null?void 0:c.quote)==null?void 0:g[0];if(!l)throw new Error("Sin quotes");const t=((h=(s=(E=e.indicators)==null?void 0:E.adjclose)==null?void 0:s[0])==null?void 0:h.adjclose)||l.close,p=t.map((v,f)=>l.close[f]&&v?v/l.close[f]:1),o=e.meta||{};return{timestamps:e.timestamp,O:l.open.map((v,f)=>v*p[f]),H:l.high.map((v,f)=>v*p[f]),L:l.low.map((v,f)=>v*p[f]),C:t,V:l.volume,name:o.shortName||o.longName||a,currency:o.currency||"USD"}}function cs(a){const{timestamps:i,O:r,H:e,L:l,C:t,V:p,name:o,currency:d}=a,c=t.length-1,g=z(t),E=H(e,l,t,89);H(e,l,t,8);const s=D(t,14);D(t,5);const h=P(t,5),v=P(t,10),f=P(t,20),I=Y(i,r,e,l,t,p,"W"),m=I.C.length-1,A=z(I.C),C=H(I.H,I.L,I.C,89),O=D(I.C,14),T=D(I.C,5),N=P(I.C,5),U=P(I.C,10),n=P(I.C,20),y=Y(i,r,e,l,t,p,"M"),$=y.C.length-1,_=z(y.C),L=H(y.H,y.L,y.C,89),V=H(y.H,y.L,y.C,8),W=D(y.C,14),j=P(y.C,10),q=t[c],B=t[c-1],X=q-B,G=X/B*100,J=U[m],w={macd:_.m[$]>0&&_.m[$]>_.sl[$],s89:L.k[$]>80&&L.k[$]>L.d[$]||L.k[$]>92,s89_opt:L.k[$]>92,rsi14:W[$]>65,s8:V.k[$]>78,precio:j[$]!=null&&y.C[$]>j[$],vals:{macd:_.m[$],macd_sl:_.sl[$],s89:L.k[$],rsi14:W[$],s8:V.k[$],close:y.C[$],ema10:j[$]}};w.cumple=w.macd&&w.s89&&w.rsi14&&w.s8&&w.precio;const S={macd:A.m[m]>0&&A.m[m]>A.sl[m],s89:C.k[m]>85&&C.k[m]>C.d[m]||C.k[m]>92,s89_opt:C.k[m]>92,rsi14:O[m]>67,precio:n[m]!=null&&I.C[m]>n[m],vals:{macd:A.m[m],macd_sl:A.sl[m],s89:C.k[m],rsi14:O[m],rsi5:T[m],close:I.C[m],ema5:N[m],ema10:U[m],ema20:n[m]}};S.cumple=S.macd&&S.s89&&S.rsi14&&S.precio;const R={macd_pos:g.m[c]>0,s89:E.k[c]>85,rsi14:s[c]>59,macd_cross:c>0&&g.m[c]>g.sl[c]&&g.m[c-1]<=g.sl[c-1],vals:{macd:g.m[c],s89:E.k[c],rsi14:s[c],ema5:h[c],ema10:v[c],ema20:f[c]}};R.cumple=R.macd_pos&&R.s89&&R.rsi14&&R.macd_cross;const Q=O[m]>50&&I.C[m]>N[m]-.005*N[m]&&I.C[m]<N[m]*1.02,Z=T[m]!=null&&T[m]<40,ss=C.k[m]>85,as=R.macd_pos&&R.macd_cross&&R.rsi14&&g.m[c]>0;let b=0;return w.macd&&b++,w.s89&&b++,w.rsi14&&b++,w.s8&&b++,w.precio&&b++,S.macd&&b++,S.s89&&b++,S.rsi14&&b++,S.precio&&b++,w.cumple&&S.cumple&&b++,{price:q,prevClose:B,change:X,changePct:G,stopSemanal:J,score:b,mc:w,sc:S,dc:R,señal_ema5_w:Q,señal_rsi5_w:Z,señal_s89_w:ss,señal_diaria:as,name:o,currency:d}}async function is(a){const i=await fetch(`/api/options?ticker=${encodeURIComponent(a)}`);if(!i.ok)throw new Error(`API options HTTP ${i.status}`);const r=await i.json();if(r.error)throw new Error(r.error);return r}async function ls(a,i){const r=await fetch(`/api/options?ticker=${encodeURIComponent(a)}&date=${i}`);if(!r.ok)throw new Error(`API options HTTP ${r.status}`);const e=await r.json();if(e.error)throw new Error(e.error);return e}function os(a,i){const r=[...new Set([...a,...i].map(t=>t.strike))].sort((t,p)=>t-p);let e=1/0,l=null;return r.forEach(t=>{const p=a.reduce((u,c)=>c.strike<t?u+(t-c.strike)*(c.openInterest||0)*100:u,0),o=i.reduce((u,c)=>c.strike>t?u+(c.strike-t)*(c.openInterest||0)*100:u,0),d=p+o;d<e&&(e=d,l=t)}),l}const M=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",k=a=>a!=null&&!isNaN(a)?"$"+a.toFixed(2):"—",F=a=>a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?(a/1e3).toFixed(0)+"k":(a==null?void 0:a.toString())||"—";function x(a,i,r,e,l=!1){return`
    <div class="an-cond-row ${a?l?"an-cond-opt":"an-cond-ok":"an-cond-fail"}">
      <span class="an-cond-icon">${a?l?"⭐":"✓":"✗"}</span>
      <span class="an-cond-label">${i}</span>
      <span class="an-cond-val">${r}</span>
      ${e?`<span class="an-cond-thr">${e}</span>`:""}
    </div>`}async function ds(a,{actionsSlot:i}){var g,E;let r="",e=null,l=[];i.innerHTML=`
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
  `;const t=()=>document.getElementById("an-content");async function p(s){const h=t();if(h){h.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const v=await es(s),f=cs(v);r=s,o(f,s),u(s)}catch(v){const f=t();if(!f)return;f.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${v.message}</div></div>`}}}function o(s,h){const v=t();if(!v)return;const f=s.score>=9?"var(--green)":s.score>=7?"var(--amber)":"var(--red)",I=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",m=s.score>=8?"good":"bad",A=s.change>=0?"up":"down",C=s.change>=0?"+":"",O=s.stopSemanal?((s.price-s.stopSemanal)/s.price*100).toFixed(2):null;v.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${k(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${A}">${C}${k(s.change)} (${C}${M(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP SEMANAL</div>
          <div class="an-hero-value" style="color:var(--red)">${k(s.stopSemanal)}</div>
          <div class="an-hero-sub">EMA 10 semanal · dist. ${O!=null?O+"%":"—"}</div>
        </div>
      </div>

      <!-- SCORE BAR -->
      <div class="an-score-section">
        <div class="an-score-label">SCORE ETHAN</div>
        <div class="an-score-track">
          <div class="an-score-fill" style="width:${s.score*10}%;background:linear-gradient(90deg,${f}88,${f})"></div>
          <div class="an-score-dot" style="left:${s.score*10}%;background:${f}"></div>
        </div>
        <div class="an-score-num" style="color:${f}">${s.score}/10</div>
        <div class="an-score-verdict ${m}">${I}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${x(s.mc.macd,"MACD > 0 y alcista",`${M(s.mc.vals.macd)} / sig ${M(s.mc.vals.macd_sl)}`,"> 0")}
          ${x(s.mc.s89,"Estocástico 89 > 80",`${M(s.mc.vals.s89)}`,"> 80",s.mc.s89_opt)}
          ${x(s.mc.rsi14,"RSI 14 > 65",`${M(s.mc.vals.rsi14)}`,"> 65")}
          ${x(s.mc.s8,"Estocástico 8 > 78",`${M(s.mc.vals.s8)}`,"> 78")}
          ${x(s.mc.precio,"Precio > EMA 10",`${k(s.mc.vals.close)} / EMA ${k(s.mc.vals.ema10)}`,"")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${x(s.sc.macd,"MACD > 0 y alcista",`${M(s.sc.vals.macd)} / sig ${M(s.sc.vals.macd_sl)}`,"> 0")}
          ${x(s.sc.s89,"Estocástico 89 > 85",`${M(s.sc.vals.s89)}`,"> 85",s.sc.s89_opt)}
          ${x(s.sc.rsi14,"RSI 14 > 67",`${M(s.sc.vals.rsi14)}`,"> 67")}
          ${x(s.sc.precio,"Precio > EMA 20",`${k(s.sc.vals.close)} / EMA ${k(s.sc.vals.ema20)}`,"")}
          <div class="an-ema-row">EMA5 ${k(s.sc.vals.ema5)} · EMA10 ${k(s.sc.vals.ema10)} · EMA20 ${k(s.sc.vals.ema20)}</div>
        </div>

        <!-- DIARIO -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.dc.cumple?"ok":"fail"}">${s.dc.cumple?"✓ LISTO":"✗ ESPERAR"}</div>
          </div>
          ${x(s.dc.macd_pos,"MACD > 0",`${M(s.dc.vals.macd)}`,"> 0")}
          ${x(s.dc.s89,"Estocástico 89 > 85",`${M(s.dc.vals.s89)}`,"> 85")}
          ${x(s.dc.rsi14,"RSI 14 > 59",`${M(s.dc.vals.rsi14)}`,"> 59")}
          ${x(s.dc.macd_cross,"MACD cruza al alza",s.dc.macd_cross?"SÍ":"NO","")}
          <div class="an-ema-row">EMA5 ${k(s.dc.vals.ema5)} · EMA10 ${k(s.dc.vals.ema10)} · EMA20 ${k(s.dc.vals.ema20)}</div>
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
            ${d("📉","Rebote EMA5 Semanal",s.señal_ema5_w,`EMA5W: ${k(s.sc.vals.ema5)}`)}
            ${d("🔥","MACD+RSI Diario",s.señal_diaria,`MACD: ${M(s.dc.vals.macd)}`)}
            ${d("📈","Estoch89 Semanal",s.señal_s89_w,`Stoch89W: ${M(s.sc.vals.s89)}`)}
            ${d("📊","RSI5 Pullback Semanal",s.señal_rsi5_w,`RSI5W: ${M(s.sc.vals.rsi5)}`)}
            ${d("🌊","Canal Bajista",!1,"Ruptura + volumen")}
          </div>
        </div>

      </div><!-- /tf-grid -->

      <!-- OPCIONES / MAX PAIN -->
      <div id="an-options-section">
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain <span class="count">cargando...</span></div>
        <div class="empty" style="padding:30px;"><div class="loader-ring"></div></div>
      </div>
    `}function d(s,h,v,f){return`
      <div class="an-signal-card ${v?"active":""}">
        <div class="an-signal-icon">${s}</div>
        <div class="an-signal-name">${h}</div>
        <div class="an-signal-status">${v?"ACTIVA":"NO"}</div>
        <div class="an-signal-desc">${f}</div>
      </div>`}async function u(s){const h=document.getElementById("an-options-section");if(h)try{const v=await is(s);l=v.expirationDates||[],e=l[0],c(s,v.calls,v.puts,v.price)}catch(v){h&&(h.innerHTML=`
        <div class="section-title" style="margin-top:28px;">Cadena de Opciones · Max Pain</div>
        <div class="sc2-empty" style="color:var(--text3);font-size:11px;">Opciones no disponibles para ${s} · ${v.message}</div>
      `)}}function c(s,h,v,f){const I=document.getElementById("an-options-section");if(!I)return;const m=os(h,v),A={};h.forEach(n=>{A[n.strike]||(A[n.strike]={strike:n.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),A[n.strike].callOI+=n.openInterest||0,A[n.strike].callVol+=n.volume||0,A[n.strike].callIV=n.impliedVolatility}),v.forEach(n=>{A[n.strike]||(A[n.strike]={strike:n.strike,callOI:0,putOI:0,callVol:0,putVol:0,callIV:null,putIV:null}),A[n.strike].putOI+=n.openInterest||0,A[n.strike].putVol+=n.volume||0,A[n.strike].putIV=n.impliedVolatility});const C=Object.values(A).sort((n,y)=>n.strike-y.strike),O=Math.max(...C.map(n=>Math.max(n.callOI,n.putOI))),T=f?C.filter(n=>n.strike>=f*.8&&n.strike<=f*1.2):C,N=T.length>0?T:C.slice(0,40),U=l.map(n=>{const $=new Date(n*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});return`<option value="${n}" ${n===e?"selected":""}>${$}</option>`}).join("");if(I.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;margin-bottom:14px;flex-wrap:wrap;gap:12px;">
        <div class="section-title" style="margin:0;">Cadena de Opciones · Max Pain
          <span class="count">${s} · vencimiento próximo</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${l.length>1?`<select id="an-expiry-select" class="sc2-sel">${U}</select>`:""}
          <div class="an-maxpain-badge">🎯 Max Pain: <strong>${k(m)}</strong></div>
        </div>
      </div>

      <div class="an-options-legend">
        <span class="an-leg-call">■ Calls (OI)</span>
        <span class="an-leg-put">■ Puts (OI)</span>
        ${f?`<span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Precio actual: ${k(f)} · Max Pain: ${k(m)}</span>`:""}
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
            ${N.map(n=>{const y=m&&Math.abs(n.strike-m)<.5,$=f&&Math.abs(n.strike-f)<f*.005,_=O>0?(n.callOI/O*100).toFixed(1):0,L=O>0?(n.putOI/O*100).toFixed(1):0;return`
                <tr class="${y?"an-row-maxpain":$?"an-row-atm":""}">
                  <td class="an-call-cell">
                    <div class="an-oi-wrap">
                      <div class="an-oi-bar call" style="width:${_}%"></div>
                      <span class="an-oi-num">${F(n.callOI)}</span>
                    </div>
                  </td>
                  <td class="an-num">${F(n.callVol)}</td>
                  <td class="an-num">${n.callIV!=null?(n.callIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-strike-col ${y?"maxpain":""}${$?" atm":""}">
                    ${k(n.strike)}
                    ${y?'<span class="an-mp-tag">MAX PAIN</span>':""}
                    ${$?'<span class="an-atm-tag">ATM</span>':""}
                  </td>
                  <td class="an-num">${n.putIV!=null?(n.putIV*100).toFixed(1)+"%":"—"}</td>
                  <td class="an-num">${F(n.putVol)}</td>
                  <td class="an-put-cell">
                    <div class="an-oi-wrap reverse">
                      <span class="an-oi-num">${F(n.putOI)}</span>
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
    `,l.length>1){const n=document.getElementById("an-expiry-select");n&&n.addEventListener("change",async()=>{var y,$;e=parseInt(n.value),n.disabled=!0;try{const _=(($=(y=document.querySelector(".an-hero-value"))==null?void 0:y.textContent)==null?void 0:$.replace("$",""))||null,{calls:L,puts:V}=await ls(r,e);c(r,L,V,parseFloat(_))}catch(_){document.getElementById("an-options-body").innerHTML=`<div class="sc2-empty">Error: ${_.message}</div>`}n.disabled=!1})}}return(g=document.getElementById("an-analyze-btn"))==null||g.addEventListener("click",()=>{var h;const s=(h=document.getElementById("an-input"))==null?void 0:h.value.trim().toUpperCase();s&&p(s)}),(E=document.getElementById("an-input"))==null||E.addEventListener("keydown",s=>{if(s.key==="Enter"){const h=s.target.value.trim().toUpperCase();h&&p(h)}s.target.value=s.target.value.toUpperCase()}),{destroy(){}}}export{ds as render};
