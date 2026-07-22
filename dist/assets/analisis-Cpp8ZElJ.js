import{s as is}from"./index-BAlb9zK3.js";const os=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];function L(a,o){const l=2/(o+1),t=new Array(a.length).fill(null);let v=0,c=0;for(let s=0;s<a.length;s++)a[s]!=null&&(c<o?(v+=a[s],c++,c===o&&(t[s]=v/o)):t[s]=(a[s]-t[s-1])*l+t[s-1]);return t}function H(a,o=12,l=26,t=9){const v=L(a,o),c=L(a,l),s=a.map((i,d)=>v[d]!=null&&c[d]!=null?v[d]-c[d]:null),u=L(s.map(i=>i??0),t);return{m:s,sl:u}}function z(a,o=14){const l=new Array(a.length).fill(null);let t=0,v=0;for(let c=1;c<a.length;c++){const s=a[c]-a[c-1];c<=o?(t+=Math.max(s,0),v+=Math.max(-s,0),c===o&&(t/=o,v/=o,l[c]=100-100/(1+t/Math.max(v,1e-10)))):l[c-1]!=null&&(t=(t*(o-1)+Math.max(s,0))/o,v=(v*(o-1)+Math.max(-s,0))/o,l[c]=100-100/(1+t/Math.max(v,1e-10)))}return l}function R(a,o,l,t=14,v=3){const c=new Array(l.length).fill(null);for(let u=t-1;u<l.length;u++){const i=Math.max(...a.slice(u-t+1,u+1).filter(n=>n!=null)),d=Math.min(...o.slice(u-t+1,u+1).filter(n=>n!=null));c[u]=i!==d?(l[u]-d)/(i-d)*100:50}const s=L(c.map(u=>u??0),v);return{k:c,d:s}}function q(a,o,l,t,v,c,s){const u=n=>{const m=new Date(n*1e3);return s==="W"?`${m.getFullYear()}-W${String(Math.ceil((m-new Date(m.getFullYear(),0,1))/6048e5)).padStart(2,"0")}`:`${m.getFullYear()}-${m.getMonth()}`},i={},d=[];return a.forEach((n,m)=>{if(v[m]==null)return;const f=u(n);i[f]?(i[f].h=Math.max(i[f].h,l[m]),i[f].l=Math.min(i[f].l,t[m]),i[f].c=v[m],i[f].v+=c[m]??0):(i[f]={o:o[m],h:l[m],l:t[m],c:v[m],v:c[m]??0},d.push(f))}),{O:d.map(n=>i[n].o),H:d.map(n=>i[n].h),L:d.map(n=>i[n].l),C:d.map(n=>i[n].c),V:d.map(n=>i[n].v)}}async function ds(a){var l,t,v,c,s,u,i;const o=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y`;for(const d of os)try{const n=await fetch(d(o),{signal:AbortSignal.timeout(1e4)});if(!n.ok)continue;const m=JSON.parse(await n.text()),f=(t=(l=m==null?void 0:m.chart)==null?void 0:l.result)==null?void 0:t[0];if(!f)continue;const $=f.meta,r=(c=(v=f.indicators)==null?void 0:v.quote)==null?void 0:c[0],M=((i=(u=(s=f.indicators)==null?void 0:s.adjclose)==null?void 0:u[0])==null?void 0:i.adjclose)||r.close,y=M.map((E,g)=>r.close[g]&&E?E/r.close[g]:1);return{timestamps:f.timestamp,O:r.open.map((E,g)=>E*y[g]),H:r.high.map((E,g)=>E*y[g]),L:r.low.map((E,g)=>E*y[g]),C:M,V:r.volume,name:$.shortName||$.longName||a,currency:$.currency||"USD"}}catch{}throw new Error(`No se pudo obtener datos de ${a}`)}function ms(a){const{timestamps:o,O:l,H:t,L:v,C:c,V:s,name:u,currency:i}=a,d=c.length,n=d-1;H(c);const m=R(t,v,c,8);R(t,v,c,14);const f=L(c,20),$=q(o,l,t,v,c,s,"W"),r=$.C.length-1,M=H($.C),y=R($.H,$.L,$.C,89),E=R($.H,$.L,$.C,14),g=z($.C,14),j=L($.C,10),h=q(o,l,t,v,c,s,"M"),e=h.C.length-1,S=H(h.C),w=R(h.H,h.L,h.C,89),O=R(h.H,h.L,h.C,14),I=R(h.H,h.L,h.C,8),D=z(h.C,14),T=L(h.C,10),N=c[n],x=c[n-1],U=N-x,Y=U/x*100,P=j[r],J=P!=null?((P-N)/N*100).toFixed(2):null,G=S.m[e]!=null&&S.m[e]<0&&S.m[e]<S.sl[e],X=w.k[e]!=null&&w.k[e]<w.d[e]&&(e<1||w.k[e-1]>=w.d[e-1]||w.k[e]<20),Q=D[e]!=null&&D[e]<41,Z=O.k[e]!=null&&O.k[e]<30,ss=I.k[e]!=null&&I.k[e]<I.d[e]&&(e<1||I.k[e-1]>=I.d[e-1]||I.k[e]<20),as=T[e]!=null&&h.C[e]<T[e],_={macd:G,s89:X,rsi14:Q,s14:Z,s8:ss,precio:as,vals:{macd:S.m[e],macd_sl:S.sl[e],s89:w.k[e],s89d:w.d[e],rsi14:D[e],s14:O.k[e],s8:I.k[e],s8d:I.d[e],close:h.C[e],ema10:T[e]}};_.cumple=_.macd&&_.s89&&_.rsi14&&_.s14&&_.s8&&_.precio;const cs=M.m[r]!=null&&M.m[r]<0&&M.m[r]<M.sl[r],ts=y.k[r]!=null&&y.k[r]<20&&y.k[r]<y.d[r],ns=E.k[r]!=null&&E.k[r]<20,es=g[r]!=null&&g[r]<40,C={macd:cs,s89:ts,s14:ns,rsi14:es,vals:{macd:M.m[r],macd_sl:M.sl[r],s89:y.k[r],s89d:y.d[r],s14:E.k[r],rsi14:g[r],close:$.C[r],ema10:j[r]}};C.cumple=C.macd&&C.s89&&C.s14&&C.rsi14;const F=n>0&&m.k[n]<m.d[n]&&m.k[n-1]>=m.d[n-1],K=f[n]!=null&&N<=f[n]*1.005&&N>=f[n]*.995,V=F&&!K,B=K&&F,ls=V||B;let A=0;return _.precio&&A++,_.macd&&A++,_.s89&&A++,_.rsi14&&A++,_.s14&&A++,_.s8&&A++,C.macd&&A++,C.s89&&A++,C.s14&&A++,C.rsi14&&A++,{price:N,prevClose:x,change:U,changePct:Y,stopRef:P,stopDist:J,score:A,mc:_,sc:C,señal_s8:V,señal_ema20:B,haySeñal:ls,d_s8_k:m.k[n],d_s8_d:m.d[n],d_ema20:f[n],name:u,currency:i}}const p=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",b=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—";function k(a,o,l,t){return`<div class="an-cond-row ${a?"ok":"fail"}">
    <span class="an-cond-dot"></span>
    <span class="an-cond-label">${o}</span>
    <span class="an-cond-val">${l}</span>
    <span class="an-cond-thresh">${t}</span>
  </div>`}function W(a,o,l,t){return`<div class="an-signal-card ${l?"active":""}">
    <div class="an-signal-icon">${a}</div>
    <div class="an-signal-name">${o}</div>
    <div class="an-signal-status">${l?"ACTIVA":"NO"}</div>
    <div class="an-signal-desc">${t}</div>
  </div>`}async function vs(a,{actionsSlot:o,savedState:l}){o.innerHTML="",a.innerHTML=`
    <div class="an-search-row">
      <input type="text" id="baj-ticker-input" class="wl-input"
        placeholder="Ticker para análisis bajista (ej. TSLA, NVDA...)"
        style="max-width:340px;text-transform:uppercase;">
      <button class="btn btn-primary" id="baj-analyze-btn">Analizar</button>
    </div>
    <div id="an-content">
      <div class="empty">
        <div class="empty-icon">📉</div>
        <div class="empty-title">Análisis Técnico Bajista</div>
        <div class="empty-desc">Introduce un ticker para ver el score bajista, condiciones por timeframe y señales de entrada corta.</div>
      </div>
    </div>
  `;const t=()=>document.getElementById("an-content");function v(s,u){const i=t();if(!i)return;const d=s.score>=9?"var(--red)":s.score>=7?"var(--amber)":"var(--text3)",n=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",m=s.score>=8?"bad":"fail",f=s.change<=0?"down":"up",$=s.stopDist;i.innerHTML=`
      <!-- PRECIO HERO -->
      <div class="an-hero">
        <div class="an-hero-card">
          <div class="an-hero-label">PRECIO ACTUAL</div>
          <div class="an-hero-value">${b(s.price)}</div>
          <div class="an-hero-sub">${s.name} · ${s.currency}</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">VARIACIÓN</div>
          <div class="an-hero-value ${f}">${s.change>=0?"+":""}${b(s.change)} (${s.changePct>=0?"+":""}${p(s.changePct)}%)</div>
          <div class="an-hero-sub">vs cierre anterior</div>
        </div>
        <div class="an-hero-card">
          <div class="an-hero-label">STOP REFERENCIA</div>
          <div class="an-hero-value" style="color:var(--amber)">${b(s.stopRef)}</div>
          <div class="an-hero-sub">EMA10 semanal · dist. ${$!=null?$+"%":"—"}</div>
        </div>
      </div>

      <!-- SCORE BAR -->
      <div class="an-score-section">
        <div class="an-score-label">SCORE BAJISTA</div>
        <div class="an-score-track">
          <div class="an-score-fill" style="width:${s.score*10}%;background:linear-gradient(90deg,${d}88,${d})"></div>
          <div class="an-score-dot" style="left:${s.score*10}%;background:${d}"></div>
        </div>
        <div class="an-score-num" style="color:${d}">${s.score}/10</div>
        <div class="an-score-verdict ${m}">${n}</div>
      </div>

      <!-- TIMEFRAME GRID -->
      <div class="an-tf-grid">

        <!-- MENSUAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title mensual">◆ MENSUAL</div>
            <div class="an-tf-badge ${s.mc.cumple?"ok":"fail"}">${s.mc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${k(s.mc.precio,"Precio &lt; EMA 10",`${b(s.mc.vals.close)} / EMA ${b(s.mc.vals.ema10)}`,"")}
          ${k(s.mc.macd,"MACD cortado ↓ &lt; 0",`${p(s.mc.vals.macd)} / sig ${p(s.mc.vals.macd_sl)}`,"< 0")}
          ${k(s.mc.s89,"Estocástico 89 cortado ↓",`K ${p(s.mc.vals.s89)} / D ${p(s.mc.vals.s89d)}`,"K corta ↓")}
          ${k(s.mc.rsi14,"RSI 14 &lt; 41",`${p(s.mc.vals.rsi14)}`,"< 41")}
          ${k(s.mc.s14,"Estocástico 14 &lt; 30",`K ${p(s.mc.vals.s14)}`,"< 30")}
          ${k(s.mc.s8,"Estocástico 8 cortado ↓",`K ${p(s.mc.vals.s8)} / D ${p(s.mc.vals.s8d)}`,"K corta ↓")}
        </div>

        <!-- SEMANAL -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title semanal">◆ SEMANAL</div>
            <div class="an-tf-badge ${s.sc.cumple?"ok":"fail"}">${s.sc.cumple?"✓ CUMPLE":"✗ FALLO"}</div>
          </div>
          ${k(s.sc.macd,"MACD cortado ↓ &lt; 0",`${p(s.sc.vals.macd)} / sig ${p(s.sc.vals.macd_sl)}`,"< 0")}
          ${k(s.sc.s89,"Estocástico 89 cortado ↓ &lt; 20",`K ${p(s.sc.vals.s89)} / D ${p(s.sc.vals.s89d)}`,"K < 20 ↓")}
          ${k(s.sc.s14,"Estocástico 14 &lt; 20",`K ${p(s.sc.vals.s14)}`,"< 20")}
          ${k(s.sc.rsi14,"RSI 14 &lt; 40",`${p(s.sc.vals.rsi14)}`,"< 40")}
          <div class="an-ema-row">EMA10 sem. ${b(s.sc.vals.ema10)} · Precio ${b(s.sc.vals.close)}</div>
        </div>

        <!-- DIARIO (timing) -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title diario">◆ DIARIO (timing)</div>
            <div class="an-tf-badge ${s.haySeñal?"ok":s.mc.cumple&&s.sc.cumple?"wait":"fail"}">
              ${s.haySeñal?"✓ ENTRADA":s.mc.cumple&&s.sc.cumple?"⏳ ESPERAR":"✗ INACTIVO"}
            </div>
          </div>
          ${k(s.señal_s8,"Estocástico 8 corta ↓",s.señal_s8?"SÍ":"NO","")}
          ${k(s.señal_ema20,"Precio toca EMA20 + Estoc.8 ↓",s.señal_ema20?"SÍ":"NO","")}
          <div class="an-ema-row">Estoc.8 K ${p(s.d_s8_k)} / D ${p(s.d_s8_d)} · EMA20 ${b(s.d_ema20)}</div>
        </div>

        <!-- SEÑALES -->
        <div class="an-tf-block">
          <div class="an-tf-header">
            <div class="an-tf-title señales">◆ SEÑALES DE ENTRADA</div>
            <div class="an-tf-badge ${s.haySeñal?"ok":s.mc.cumple&&s.sc.cumple?"wait":"fail"}">
              ${s.haySeñal?"✓ ENTRADA ACTIVA":s.mc.cumple&&s.sc.cumple?"⏳ ESPERA":"✗ INACTIVO"}
            </div>
          </div>
          <div class="an-signals-grid">
            ${W("📉","Estoc.8 corta ↓",s.señal_s8,`K ${p(s.d_s8_k)} / D ${p(s.d_s8_d)}`)}
            ${W("🔄","Rebote EMA20 + Estoc.8 ↓",s.señal_ema20,`EMA20: ${b(s.d_ema20)}`)}
          </div>
        </div>

      </div><!-- /tf-grid -->
    `}async function c(s){is("baj-analisis",{ticker:s});const u=t();if(u){u.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const i=await ds(s),d=ms(i);v(d,s)}catch(i){const d=t();if(!d)return;d.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error al analizar ${s}</div><div class="empty-desc">${i.message}</div></div>`}}}return document.getElementById("baj-analyze-btn").addEventListener("click",()=>{const s=document.getElementById("baj-ticker-input").value.trim().toUpperCase();s&&c(s)}),document.getElementById("baj-ticker-input").addEventListener("keydown",s=>{if(s.key==="Enter"){const u=s.target.value.trim().toUpperCase();u&&c(u)}}),l!=null&&l.ticker&&(document.getElementById("baj-ticker-input").value=l.ticker,c(l.ticker)),{destroy(){}}}export{vs as render};
