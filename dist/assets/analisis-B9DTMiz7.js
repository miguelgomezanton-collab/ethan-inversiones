import{s as os}from"./index-CgF2jx7D.js";const is=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`,a=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(a)}`];function L(a,i){const l=2/(i+1),t=new Array(a.length).fill(null);let v=0,c=0;for(let s=0;s<a.length;s++)a[s]!=null&&(c<i?(v+=a[s],c++,c===i&&(t[s]=v/i)):t[s]=(a[s]-t[s-1])*l+t[s-1]);return t}function H(a,i=12,l=26,t=9){const v=L(a,i),c=L(a,l),s=a.map((o,d)=>v[d]!=null&&c[d]!=null?v[d]-c[d]:null),u=L(s.map(o=>o??0),t);return{m:s,sl:u}}function z(a,i=14){const l=new Array(a.length).fill(null);let t=0,v=0;for(let c=1;c<a.length;c++){const s=a[c]-a[c-1];c<=i?(t+=Math.max(s,0),v+=Math.max(-s,0),c===i&&(t/=i,v/=i,l[c]=100-100/(1+t/Math.max(v,1e-10)))):l[c-1]!=null&&(t=(t*(i-1)+Math.max(s,0))/i,v=(v*(i-1)+Math.max(-s,0))/i,l[c]=100-100/(1+t/Math.max(v,1e-10)))}return l}function R(a,i,l,t=14,v=3){const c=new Array(l.length).fill(null);for(let u=t-1;u<l.length;u++){const o=Math.max(...a.slice(u-t+1,u+1).filter(n=>n!=null)),d=Math.min(...i.slice(u-t+1,u+1).filter(n=>n!=null));c[u]=o!==d?(l[u]-d)/(o-d)*100:50}const s=L(c.map(u=>u??0),v);return{k:c,d:s}}function q(a,i,l,t,v,c,s){const u=n=>{const m=new Date(n*1e3);return s==="W"?`${m.getFullYear()}-W${String(Math.ceil((m-new Date(m.getFullYear(),0,1))/6048e5)).padStart(2,"0")}`:`${m.getFullYear()}-${m.getMonth()}`},o={},d=[];return a.forEach((n,m)=>{if(v[m]==null)return;const f=u(n);o[f]?(o[f].h=Math.max(o[f].h,l[m]),o[f].l=Math.min(o[f].l,t[m]),o[f].c=v[m],o[f].v+=c[m]??0):(o[f]={o:i[m],h:l[m],l:t[m],c:v[m],v:c[m]??0},d.push(f))}),{O:d.map(n=>o[n].o),H:d.map(n=>o[n].h),L:d.map(n=>o[n].l),C:d.map(n=>o[n].c),V:d.map(n=>o[n].v)}}async function ds(a){var l,t,v,c,s,u,o;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=10y`;for(const d of is)try{const n=await fetch(d(i),{signal:(()=>{const h=new AbortController;return setTimeout(()=>h.abort(),1e4),h.signal})()});if(!n.ok)continue;const m=JSON.parse(await n.text()),f=(t=(l=m==null?void 0:m.chart)==null?void 0:l.result)==null?void 0:t[0];if(!f)continue;const $=f.meta,r=(c=(v=f.indicators)==null?void 0:v.quote)==null?void 0:c[0],M=((o=(u=(s=f.indicators)==null?void 0:s.adjclose)==null?void 0:u[0])==null?void 0:o.adjclose)||r.close,y=M.map((h,g)=>r.close[g]&&h?h/r.close[g]:1);return{timestamps:f.timestamp,O:r.open.map((h,g)=>h*y[g]),H:r.high.map((h,g)=>h*y[g]),L:r.low.map((h,g)=>h*y[g]),C:M,V:r.volume,name:$.shortName||$.longName||a,currency:$.currency||"USD"}}catch{}throw new Error(`No se pudo obtener datos de ${a}`)}function ms(a){const{timestamps:i,O:l,H:t,L:v,C:c,V:s,name:u,currency:o}=a,d=c.length,n=d-1;H(c);const m=R(t,v,c,8);R(t,v,c,14);const f=L(c,20),$=q(i,l,t,v,c,s,"W"),r=$.C.length-1,M=H($.C),y=R($.H,$.L,$.C,89),h=R($.H,$.L,$.C,14),g=z($.C,14),j=L($.C,10),_=q(i,l,t,v,c,s,"M"),e=_.C.length-1,N=H(_.C),w=R(_.H,_.L,_.C,89),S=R(_.H,_.L,_.C,14),I=R(_.H,_.L,_.C,8),D=z(_.C,14),T=L(_.C,10),O=c[n],x=c[n-1],U=O-x,Y=U/x*100,P=j[r],J=P!=null?((P-O)/O*100).toFixed(2):null,G=N.m[e]!=null&&N.m[e]<0&&N.m[e]<N.sl[e],X=w.k[e]!=null&&w.k[e]<w.d[e]&&(e<1||w.k[e-1]>=w.d[e-1]||w.k[e]<20),Q=D[e]!=null&&D[e]<41,Z=S.k[e]!=null&&S.k[e]<30,ss=I.k[e]!=null&&I.k[e]<I.d[e]&&(e<1||I.k[e-1]>=I.d[e-1]||I.k[e]<20),as=T[e]!=null&&_.C[e]<T[e],E={macd:G,s89:X,rsi14:Q,s14:Z,s8:ss,precio:as,vals:{macd:N.m[e],macd_sl:N.sl[e],s89:w.k[e],s89d:w.d[e],rsi14:D[e],s14:S.k[e],s8:I.k[e],s8d:I.d[e],close:_.C[e],ema10:T[e]}};E.cumple=E.macd&&E.s89&&E.rsi14&&E.s14&&E.s8&&E.precio;const cs=M.m[r]!=null&&M.m[r]<0&&M.m[r]<M.sl[r],ts=y.k[r]!=null&&y.k[r]<20&&y.k[r]<y.d[r],ns=h.k[r]!=null&&h.k[r]<20,es=g[r]!=null&&g[r]<40,C={macd:cs,s89:ts,s14:ns,rsi14:es,vals:{macd:M.m[r],macd_sl:M.sl[r],s89:y.k[r],s89d:y.d[r],s14:h.k[r],rsi14:g[r],close:$.C[r],ema10:j[r]}};C.cumple=C.macd&&C.s89&&C.s14&&C.rsi14;const F=n>0&&m.k[n]<m.d[n]&&m.k[n-1]>=m.d[n-1],K=f[n]!=null&&O<=f[n]*1.005&&O>=f[n]*.995,V=F&&!K,B=K&&F,ls=V||B;let A=0;return E.precio&&A++,E.macd&&A++,E.s89&&A++,E.rsi14&&A++,E.s14&&A++,E.s8&&A++,C.macd&&A++,C.s89&&A++,C.s14&&A++,C.rsi14&&A++,{price:O,prevClose:x,change:U,changePct:Y,stopRef:P,stopDist:J,score:A,mc:E,sc:C,señal_s8:V,señal_ema20:B,haySeñal:ls,d_s8_k:m.k[n],d_s8_d:m.d[n],d_ema20:f[n],name:u,currency:o}}const p=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—",b=a=>a!=null&&!isNaN(a)?a.toFixed(2):"—";function k(a,i,l,t){return`<div class="an-cond-row ${a?"ok":"fail"}">
    <span class="an-cond-dot"></span>
    <span class="an-cond-label">${i}</span>
    <span class="an-cond-val">${l}</span>
    <span class="an-cond-thresh">${t}</span>
  </div>`}function W(a,i,l,t){return`<div class="an-signal-card ${l?"active":""}">
    <div class="an-signal-icon">${a}</div>
    <div class="an-signal-name">${i}</div>
    <div class="an-signal-status">${l?"ACTIVA":"NO"}</div>
    <div class="an-signal-desc">${t}</div>
  </div>`}async function vs(a,{actionsSlot:i,savedState:l}){i.innerHTML="",a.innerHTML=`
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
  `;const t=()=>document.getElementById("an-content");function v(s,u){const o=t();if(!o)return;const d=s.score>=9?"var(--red)":s.score>=7?"var(--amber)":"var(--text3)",n=s.score===10?"CANDIDATO ÓPTIMO":s.score>=8?"MONITOREAR":"NO CUMPLE",m=s.score>=8?"bad":"fail",f=s.change<=0?"down":"up",$=s.stopDist;o.innerHTML=`
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
    `}async function c(s){os("baj-analisis",{ticker:s});const u=t();if(u){u.innerHTML=`<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando ${s}...</div></div>`;try{const o=await ds(s),d=ms(o);v(d,s)}catch(o){const d=t();if(!d)return;d.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error al analizar ${s}</div><div class="empty-desc">${o.message}</div></div>`}}}return document.getElementById("baj-analyze-btn").addEventListener("click",()=>{const s=document.getElementById("baj-ticker-input").value.trim().toUpperCase();s&&c(s)}),document.getElementById("baj-ticker-input").addEventListener("keydown",s=>{if(s.key==="Enter"){const u=s.target.value.trim().toUpperCase();u&&c(u)}}),l!=null&&l.ticker&&(document.getElementById("baj-ticker-input").value=l.ticker,c(l.ticker)),{destroy(){}}}export{vs as render};
