const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/userdata-DXI1eA65.js","assets/index-CgF2jx7D.js","assets/index-QgqYHJNn.css"])))=>i.map(i=>d[i]);
import{_ as $t}from"./index-CgF2jx7D.js";const wt=[i=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(i)}`,i=>`https://api.allorigins.win/raw?url=${encodeURIComponent(i)}`,i=>`https://corsproxy.io/?${encodeURIComponent(i)}`];function L(i,c){const g=2/(c+1),u=new Array(i.length).fill(null);let f=i.findIndex(b=>b!=null&&!isNaN(b));if(f<0)return u;u[f]=i[f];for(let b=f+1;b<i.length;b++){const y=i[b]!=null&&!isNaN(i[b])?i[b]:u[b-1];u[b]=y*g+u[b-1]*(1-g)}return u}function bt(i,c=12,g=26,u=9){const f=L(i,c),b=L(i,g),y=f.map((v,r)=>v!=null&&b[r]!=null?v-b[r]:null),t=L(y.map(v=>v??0),u);return{m:y,sl:t}}function tt(i,c=14){const g=new Array(i.length).fill(null);if(i.length<c+1)return g;let u=0,f=0;for(let t=1;t<=c;t++){const v=i[t]-i[t-1];v>0?u+=v:f-=v}let b=u/c,y=f/c;g[c]=y===0?100:100-100/(1+b/y);for(let t=c+1;t<i.length;t++){const v=i[t]-i[t-1];b=(b*(c-1)+(v>0?v:0))/c,y=(y*(c-1)+(v<0?-v:0))/c,g[t]=y===0?100:100-100/(1+b/y)}return g}function st(i,c,g,u=14){const f=g.map((t,v)=>{if(v<u-1)return null;const r=Math.max(...i.slice(v-u+1,v+1)),p=Math.min(...c.slice(v-u+1,v+1));return r===p?50:(t-p)/(r-p)*100}),b=L(f,3),y=L(b.map(t=>t??0),3);return{k:b,d:y}}function gt(i,c,g,u,f,b,y){const t={};i.forEach((r,p)=>{const D=new Date(r*1e3);let s;if(y==="W"){const o=D.getDay(),m=D.getDate()-o+(o===0?-6:1),I=new Date(+D);I.setDate(m),s=I.toISOString().slice(0,10)}else s=`${D.getFullYear()}-${String(D.getMonth()+1).padStart(2,"0")}`;t[s]?(t[s].h=Math.max(t[s].h,g[p]),t[s].l=Math.min(t[s].l,u[p]),t[s].c=f[p],t[s].v+=b[p]):t[s]={o:c[p],h:g[p],l:u[p],c:f[p],v:b[p]}});const v=Object.keys(t).sort();return{dates:v,opens:v.map(r=>t[r].o),highs:v.map(r=>t[r].h),lows:v.map(r=>t[r].l),closes:v.map(r=>t[r].c),vols:v.map(r=>t[r].v)}}async function kt(i){var u,f,b;const c=`https://query1.finance.yahoo.com/v8/finance/chart/${i}?interval=1d&range=10y&events=history`;let g;for(const y of wt)try{const t=await fetch(y(c),{signal:(()=>{const o=new AbortController;return setTimeout(()=>o.abort(),15e3),o.signal})()});if(!t.ok)throw new Error(`HTTP ${t.status}`);const v=JSON.parse(await t.text());if((u=v.chart)!=null&&u.error)throw new Error(v.chart.error.description);const r=v.chart.result[0],p=r.indicators.quote[0],D=((b=(f=r.indicators.adjclose)==null?void 0:f[0])==null?void 0:b.adjclose)||p.close,s=D.map((o,m)=>p.close[m]&&o?o/p.close[m]:1);return{name:r.meta.longName||i,timestamps:r.timestamp,opens:p.open.map((o,m)=>o*s[m]),highs:p.high.map((o,m)=>o*s[m]),lows:p.low.map((o,m)=>o*s[m]),closes:D,vols:p.volume}}catch(t){g=t}throw g||new Error("Sin conexión")}function St(i,c,g){const{timestamps:u,opens:f,highs:b,lows:y,closes:t,vols:v}=i,r=gt(u,f,b,y,t,v,"W"),p=gt(u,f,b,y,t,v,"M"),D=bt(p.closes),s=st(p.highs,p.lows,p.closes,89),o=st(p.highs,p.lows,p.closes,8),m=tt(p.closes,14),I=L(p.closes,10),B=bt(r.closes),x=st(r.highs,r.lows,r.closes,89),$=tt(r.closes,14),Y=L(r.closes,20),F=L(r.closes,10),C=L(r.closes,5),R=tt(r.closes,5),A=bt(t),U=tt(t,14),d=tt(t,5),w=L(t,5),z=L(t,10),X=L(t,20);function P(l){const S=l.slice(0,7),q=p.dates.indexOf(S);return q>=0?q:p.dates.length-1}function a(l){const S=new Date(l*1e3),q=S.getDay(),E=S.getDate()-q+(q===0?-6:1),O=new Date(+S);O.setDate(E);const W=O.toISOString().slice(0,10),rt=r.dates.indexOf(W);return rt>=0?rt:r.dates.length-1}function n(l){if(l<0||l>=p.closes.length)return!1;const S=D.m[l]>0&&D.m[l]>D.sl[l],q=s.k[l]>80&&s.k[l]>s.d[l]||s.k[l]>92,E=m[l]>65,O=o.k[l]>78,W=p.closes[l]>I[l];return S&&q&&E&&O&&W}function j(l){if(l<0||l>=r.closes.length)return!1;const S=B.m[l]>0&&B.m[l]>B.sl[l],q=x.k[l]>85&&x.k[l]>x.d[l]||x.k[l]>92,E=$[l]>67,O=r.closes[l]>Y[l];return S&&q&&E&&O}const h=[];let T=!1,N=0,Q="",Z=0,J=100;const V=[{date:"",val:100}],lt=t.length;let e=100;for(;e<lt;){const l=u[e],S=new Date(l*1e3).toISOString().slice(0,10),q=P(S),E=a(l);if(T){const O=a(l);let W=!1;g==="sma10w"?W=F[O]!=null&&r.closes[O]!=null&&r.closes[O]<F[O]:g==="sma10d"&&(W=z[e]!=null&&t[e]<z[e]);const G=new Date(l*1e3).getDay()===5,k=P(S),M=G&&(!n(k)||!j(O));if(W||M||e===lt-1){const K=t[e],H=(K-N)/N*100,_=e===lt-1?"open":W?"sma":"cond",ot=e-Z;J=J*(1+H/100),V.push({date:S,val:J}),h.push({n:h.length+1,entryDate:Q,exitDate:S,entryPrice:N,exitPrice:K,pct:H,exitType:_,bars:ot,equity:J}),T=!1}}else{const O=n(q),W=j(E);if((c==="canal"||O&&W)&&e>0){let G=!1;if(c==="macd")G=A.m[e]>A.sl[e]&&A.m[e-1]<=A.sl[e-1]&&U[e]>57&&A.m[e]>0;else if(c==="sma5w"){const k=C[E],M=E>0?C[E-1]:null,K=r.closes[E],H=E>0?r.closes[E-1]:null;G=k!=null&&M!=null&&K>k&&H<=M}else if(c==="sma5d"){const k=w[e],M=w[e-1];G=k!=null&&M!=null&&t[e]>k&&t[e-1]<=M}else if(c==="rsi5d"){const k=d[e],M=d[e-1];G=k!=null&&M!=null&&k>60&&M<=60}else if(c==="rsi5w"){const k=st(r.highs,r.lows,r.closes,5);G=E>=2&&(R[E-1]<50||R[E-2]<50)&&k.k[E-1]<k.k[E-2]&&R[E]>60&&R[E-1]<=60&&k.k[E]>k.k[E-1]}else if(c==="rsi5_pullback"){let k=!1;for(let M=e-10;M<e;M++)if(M>=0&&d[M]>60){k=!0;break}G=e>=5&&k&&d[e-1]>=38&&d[e-1]<=42&&d[e]>d[e-1]&&d[e-1]<d[e-2]}else if(c==="canal"){let k=null;if(e>=16){const K=e-15,H=[];for(let _=K;_<=e;_++)_>K&&_<e&&b[_]>b[_-1]&&b[_]>b[_+1]&&H.push({idx:_,p:b[_]});if(H.length>=2){const _=H[H.length-1],ot=H[H.length-2],ut=(_.p-ot.p)/(_.idx-ot.idx);ut<0&&(k=_.p+ut*(e-_.idx))}}const M=L(v,20);G=e>=25&&k!=null&&Math.abs(t[e]-w[e])/w[e]<.03&&t[e]>k&&t[e-1]<=k&&v[e]>M[e]*1.1&&(w[e]>z[e]&&w[e-1]<=z[e-1]||X[e]&&w[e]>X[e]&&w[e-1]<=X[e-1])}G&&(T=!0,N=t[e],Q=S,Z=e)}}e++}const et=h.filter(l=>l.pct>0),dt=h.filter(l=>l.pct<=0),ht=J-100,ct=h.length?et.length/h.length*100:0,mt=et.length?et.reduce((l,S)=>l+S.pct,0)/et.length:0,pt=dt.length?dt.reduce((l,S)=>l+S.pct,0)/dt.length:0,yt=pt!==0?Math.abs(ct/100*mt/((1-ct/100)*Math.abs(pt))):null;let at=100,vt=0;return V.forEach(l=>{l.val>at&&(at=l.val);const S=(at-l.val)/at*100;S>vt&&(vt=S)}),{trades:h,equityCurve:V,metrics:{totalReturn:ht,winRate:ct,avgWin:mt,avgLoss:pt,profitFactor:yt,maxDD:vt,nTrades:h.length}}}function Et(i){if(!i||i.length<2)return"";const c=i.map(o=>o.val),g=820,u=180,f=Math.min(...c)*.99,b=Math.max(...c)*1.01,y=b-f||1,t=o=>(o/(c.length-1)*g).toFixed(1),v=o=>(u-(o-f)/y*u).toFixed(1),r=c.map((o,m)=>`${t(m)},${v(o)}`).join(" "),p=c[c.length-1],D=p>=100?"#40d9c0":"#f47174",s=v(100);return`<svg viewBox="0 0 ${g} ${u}" style="width:100%;height:${u}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${D}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${D}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${s}" x2="${g}" y2="${s}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(s)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Base 100</text>
    <polygon points="0,${u} ${r} ${g},${u}" fill="url(#eg)"/>
    <polyline points="${r}" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${g}" cy="${v(p)}" r="4" fill="${D}"/>
  </svg>`}const ft=i=>i!=null&&isFinite(i)?(i<0?"-":"")+"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",xt=i=>{if(!i)return"—";const c=i.split("-");return`${c[2]}/${c[1]}/${c[0].slice(2)}`},nt={sma5w:"Rebote EMA5 Semanal",rsi5w:"RSI5+Stoch5 Semanal",macd:"MACD + RSI Diario",sma5d:"Rebote EMA5 Diario",rsi5_pullback:"RSI5 Pullback Diario",canal:"Canal Bajista"},it={sma10w:"Stop EMA10 Semanal",sma10d:"Stop EMA10 Diario"},It=`
.bt-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:20px;}
.bt-tab{padding:9px 18px;background:transparent;border:none;color:var(--text2);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);}
.bt-tab:hover{color:var(--text1);}
.bt-tab.active{color:var(--teal);border-bottom-color:var(--teal);}
.bt-wrap{font-family:var(--sans);}
.bt-config{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.bt-entry-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border);border-radius:6px;overflow:hidden;margin-bottom:14px;}
.bt-entry-btn{background:var(--surface);border:none;color:var(--text2);cursor:pointer;padding:12px 14px;text-align:left;font-family:var(--sans);border-top:2px solid transparent;transition:all 0.15s;}
.bt-entry-btn:hover{background:var(--surface2);color:var(--text1);}
.bt-entry-btn.active{color:var(--teal);border-top-color:var(--teal);background:var(--surface2);}
.bt-entry-btn .bn{font-size:9px;font-family:var(--mono);letter-spacing:0.1em;color:var(--text3);margin-bottom:4px;}
.bt-entry-btn .bl{font-size:11px;font-weight:600;margin-bottom:2px;}
.bt-entry-btn .bd{font-size:10px;color:var(--text3);line-height:1.4;}
.bt-entry-btn.active .bn{color:var(--teal);}
.bt-exit-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--border);border-radius:6px;overflow:hidden;margin-bottom:14px;}
.bt-exit-btn{background:var(--surface);border:none;color:var(--text2);cursor:pointer;padding:12px 14px;text-align:left;font-family:var(--sans);border-top:2px solid transparent;transition:all 0.15s;}
.bt-exit-btn:hover{background:var(--surface2);}
.bt-exit-btn.active{color:var(--red);border-top-color:var(--red);background:var(--surface2);}
.bt-exit-btn .bn{font-size:9px;font-family:var(--mono);letter-spacing:0.1em;color:var(--text3);margin-bottom:4px;}
.bt-exit-btn .bl{font-size:11px;font-weight:600;}
.bt-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-strip-cell{background:var(--surface);padding:14px 16px;}
.bt-strip-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.bt-strip-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.bt-strip-sub{font-size:10px;color:var(--text3);margin-top:3px;}
.bt-chart{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;}
.bt-table{width:100%;border-collapse:collapse;font-size:11px;}
.bt-table th{padding:8px 12px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.bt-table th:first-child,.bt-table td:first-child{text-align:left;}
.bt-table td{padding:9px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);text-align:right;color:var(--text2);}
.bt-table tbody tr:hover td{background:var(--surface2);}
.bt-best{background:rgba(64,217,192,0.06);border:1px solid rgba(64,217,192,0.3);border-left:4px solid var(--teal);border-radius:10px;padding:18px 22px;margin-bottom:16px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;}
.bt-combo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-combo-cell{background:var(--surface);padding:12px 14px;cursor:pointer;border-top:2px solid transparent;transition:all 0.15s;}
.bt-combo-cell:hover{background:var(--surface2);}
.bt-combo-cell.best{border-top-color:var(--teal);background:var(--surface2);}
`;async function Dt(i,{actionsSlot:c}){if(!document.getElementById("bt-css")){const s=document.createElement("style");s.id="bt-css",s.textContent=It,document.head.appendChild(s)}c.innerHTML="",i.innerHTML='<div class="bt-wrap" id="bt-wrap"></div>';let g="backtesting",u="sma5w",f="sma10w";async function b(){const s=document.getElementById("bt-real-content");if(!s)return;s.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Analizando cartera real...</div></div>';const{UserData:o}=await $t(async()=>{const{UserData:a}=await import("./userdata-DXI1eA65.js");return{UserData:a}},__vite__mapDeps([0,1,2])),[m,I]=await Promise.all([o.get("ethan_positions_history").then(a=>a||[]),o.get("ethan_positions").then(a=>a||[])]),B=[...m.map(a=>({...a,estado:"cerrada"})),...I.map(a=>({...a,estado:"abierta",pnlPct:null,pnlAbs:null}))].sort((a,n)=>(a.entryDateISO||a.entryDate||"").localeCompare(n.entryDateISO||n.entryDate||""));if(!B.length){s.innerHTML='<div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Sin operaciones en cartera</div></div>';return}const x=m.filter(a=>a.pnlPct!=null),$=x.length;$&&x.reduce((a,n)=>a+(n.pnlPct||0),0)/$;const Y=.3,F=x.map(a=>(a.pnlPct||0)-Y),C=F.length?F.reduce((a,n)=>a+n,0)/F.length:0,R=F.length>1?Math.sqrt(F.reduce((a,n)=>a+(n-C)**2,0)/(F.length-1)):null,A=R?C/R:null,U=A==null?"var(--text3)":A>.5?"var(--green)":A>0?"var(--amber)":"var(--red)",d=A==null?"—":A>.5?"Sistema robusto":A>0?"Alpha positivo":"Alpha negativo",w=x.filter(a=>(a.pnlPct||0)>0),z=x.filter(a=>(a.pnlPct||0)<=0),X=$?w.length/$:0;w.length&&w.reduce((a,n)=>a+(n.pnlPct||0),0)/w.length,z.length&&Math.abs(z.reduce((a,n)=>a+(n.pnlPct||0),0)/z.length);const P=x.reduce((a,n)=>a+(n.pnlAbs||0),0);s.innerHTML=`
      <!-- Ratio de Información -->
      <div class="bt-config" style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;margin-bottom:16px;">📐 Ratio de Información</div>
        <div class="bt-strip" style="margin-bottom:12px;">
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Ratio de Información</div>
            <div class="bt-strip-val" style="color:${U};">${A!=null?A.toFixed(2):"N/A"}</div>
            <div class="bt-strip-sub">${d}</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Alpha medio/op</div>
            <div class="bt-strip-val" style="color:${C>=0?"var(--green)":"var(--red)"};">${C>=0?"+":""}${C.toFixed(2)}%</div>
            <div class="bt-strip-sub">vs benchmark ~0.3%/op</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Tracking Error</div>
            <div class="bt-strip-val">${R!=null?R.toFixed(2)+"%":"—"}</div>
            <div class="bt-strip-sub">dispersión del alpha</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Operaciones</div>
            <div class="bt-strip-val">${$}</div>
            <div class="bt-strip-sub">${$<30?"⚠ <30 — muestra pequeña":"✓ Muestra suficiente"}</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">Win Rate real</div>
            <div class="bt-strip-val" style="color:${X>=.5?"var(--green)":"var(--red)"};">${(X*100).toFixed(0)}%</div>
            <div class="bt-strip-sub">${w.length}G / ${z.length}P</div>
          </div>
          <div class="bt-strip-cell">
            <div class="bt-strip-lbl">P&L Total</div>
            <div class="bt-strip-val" style="color:${P>=0?"var(--green)":"var(--red)"};">${ft(P)}</div>
            <div class="bt-strip-sub">realizado</div>
          </div>
        </div>
        ${$<30?`<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:10px 14px;font-size:11px;color:var(--amber);font-family:var(--mono);">
          ⚠ Con ${$} operaciones el Ratio de Información no es estadísticamente significativo. Se necesitan mínimo 30 operaciones para una conclusión fiable.
          ${$>0?` Faltan ${30-$} operaciones.`:""}
        </div>`:`<div style="font-size:11px;color:var(--text2);font-family:var(--mono);">
          ${A>.5?"✅ IR > 0.5 — tu alpha es consistente y estadísticamente significativo. Tu sistema genera valor real.":A>0?"🟡 IR entre 0 y 0.5 — alpha positivo pero con alta variabilidad. Sigue acumulando operaciones.":"🔴 IR negativo — el sistema no está generando alpha sobre el benchmark. Revisar el edge."}
        </div>`}

        <!-- Explicación didáctica -->
        <div style="background:var(--surface2);border-radius:8px;padding:14px 16px;margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Qué es el Ratio de Información?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">Mide si tu alpha es <strong style="color:var(--text1);">consistente o aleatorio</strong>. Es el estándar de la industria para evaluar si un sistema de trading tiene edge real. IR = Alpha medio / Tracking Error.</div>
          </div>
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Qué significa cada métrica?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">
              <strong style="color:var(--text1);">Alpha medio/op</strong> — cuánto superas al benchmark por operación. Positivo = bates al mercado.<br>
              <strong style="color:var(--text1);">Tracking Error</strong> — dispersión de ese alpha. Alto = inconsistente, bajo = fiable.
            </div>
          </div>
          <div>
            <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">¿Cómo interpretar el IR?</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">
              <span style="color:var(--green);">IR &gt; 0.5</span> → Sistema robusto, edge real<br>
              <span style="color:var(--amber);">IR 0–0.5</span> → Alpha positivo pero variable<br>
              <span style="color:var(--red);">IR &lt; 0</span> → Sin edge, revisar el sistema<br>
              <span style="color:var(--text3);">Benchmark</span> → 0.3%/op ≈ 15% anual SPY
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de operaciones reales -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);">
          <div style="font-size:13px;font-weight:600;">Historial de operaciones reales · ${$} cerradas · ${I.length} abiertas</div>
          <div style="font-size:11px;color:var(--text2);margin-top:4px;">Alpha = P&L real − benchmark estimado (0.3%/op ≈ 15% anual / ~50 ops). Positivo = batiste al mercado en esa operación.</div>
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>#</th><th>Ticker</th><th>Entrada</th><th>Salida</th>
            <th>Días</th><th>P&L %</th><th>P&L €</th>
            <th class="r">Alpha vs bench</th><th>Estado</th>
          </tr></thead>
          <tbody>
            ${B.map((a,n)=>{const j=a.entryDateISO&&a.exitDateISO?Math.round((new Date(a.exitDateISO)-new Date(a.entryDateISO))/864e5):null,h=a.pnlPct??null,T=h!=null?h-Y:null,N=h!=null?h>=0?"var(--green)":"var(--red)":"var(--text2)",Q=T!=null?T>0?"var(--green)":"var(--red)":"var(--text3)";return`<tr>
                <td style="color:var(--text3);">${n+1}</td>
                <td style="font-weight:700;">${a.ticker||"—"}</td>
                <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${a.entryDateISO||a.entryDate||"—"}</td>
                <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${a.exitDateISO||"—"}</td>
                <td>${j!=null?j+"d":"—"}</td>
                <td style="color:${N};font-weight:700;">${h!=null?(h>=0?"+":"")+h.toFixed(2)+"%":"—"}</td>
                <td style="color:${N};font-weight:700;font-family:var(--mono);">${a.pnlAbs!=null?ft(a.pnlAbs):"—"}</td>
                <td style="text-align:right;color:${Q};font-family:var(--mono);">${T!=null?(T>=0?"+":"")+T.toFixed(2)+"%":"—"}</td>
                <td><span style="font-size:9px;padding:2px 8px;border-radius:3px;background:${a.estado==="cerrada"?"rgba(74,222,128,0.1)":"rgba(95,168,224,0.1)"};color:${a.estado==="cerrada"?"var(--green)":"var(--blue)"};">${a.estado==="cerrada"?"Cerrada":"Abierta"}</span></td>
              </tr>`}).join("")}
          </tbody>
        </table>
      </div>
    `}function y(){return`<div class="bt-tabs">
      <button class="bt-tab ${g==="backtesting"?"active":""}" data-tab="backtesting">📊 Backtesting</button>
      <button class="bt-tab ${g==="cartera-real"?"active":""}" data-tab="cartera-real">🎯 Cartera Real · Ratio de Información</button>
    </div>`}function t(){document.querySelectorAll(".bt-tab[data-tab]").forEach(s=>{s.addEventListener("click",()=>{g=s.dataset.tab,v()})})}async function v(){const s=document.getElementById("bt-wrap");g==="backtesting"?(s.innerHTML=y()+r(),t(),p()):(s.innerHTML=y()+'<div id="bt-real-content"></div>',t(),await b())}function r(){const s=[{id:"sma5w",n:"SISTEMA 01",l:"Rebote EMA5 Semanal",d:"Precio cruza por encima de EMA5 semanal"},{id:"rsi5w",n:"SISTEMA 02",l:"RSI5+Stoch5 Semanal",d:"RSI5 < 50 y Stoch cayendo, luego rebote"},{id:"macd",n:"SISTEMA 03",l:"MACD + RSI Diario",d:"MACD cruza al alza + RSI14 > 57"},{id:"sma5d",n:"SISTEMA 04",l:"Rebote EMA5 Diario",d:"Precio cruza por encima de EMA5 diaria"},{id:"rsi5_pullback",n:"SISTEMA 05",l:"RSI5 Pullback Diario",d:"RSI5 > 60 → 40 → rebota"},{id:"canal",n:"SISTEMA 06",l:"Canal Bajista",d:"Ruptura canal bajista + volumen"}],o=[{id:"sma10w",n:"SALIDA 01",l:"EMA10 Semanal",d:"Cierre semanal < EMA10 semanal"},{id:"sma10d",n:"SALIDA 02",l:"EMA10 Diaria",d:"Cierre diario < EMA10 diaria"}];return`
      <div class="bt-config">
        <div style="display:flex;gap:10px;margin-bottom:14px;align-items:center;">
          <input type="text" id="bt-ticker" class="wl-input" placeholder="Ticker (ej. AAPL)" style="width:200px;text-transform:uppercase;">
          <button class="btn btn-primary" id="bt-run-btn" style="min-width:140px;">▶ Ejecutar backtest</button>
          <span id="bt-status" style="font-family:var(--mono);font-size:11px;color:var(--text3);"></span>
        </div>
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Sistema de entrada</div>
        <div class="bt-entry-grid">
          ${s.map(m=>`<button class="bt-entry-btn ${u===m.id?"active":""}" data-entry="${m.id}">
            <div class="bn">${m.n}</div>
            <div class="bl">${m.l}</div>
            <div class="bd">${m.d}</div>
          </button>`).join("")}
        </div>
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">Sistema de salida</div>
        <div class="bt-exit-grid">
          ${o.map(m=>`<button class="bt-exit-btn ${f===m.id?"active":""}" data-exit="${m.id}">
            <div class="bn">${m.n}</div>
            <div class="bl">${m.l}</div>
          </button>`).join("")}
        </div>
        <div style="font-size:10px;color:var(--text3);">Condiciones M+S: Mensual (MACD↑, Stoch89>80, RSI>65, Stoch8>78, P>EMA10) + Semanal (MACD↑, Stoch89>85, RSI>67, P>EMA20)</div>
      </div>`}function p(){var s;document.querySelectorAll(".bt-entry-btn").forEach(o=>{o.addEventListener("click",()=>{u=o.dataset.entry,document.querySelectorAll(".bt-entry-btn").forEach(m=>m.classList.remove("active")),o.classList.add("active")})}),document.querySelectorAll(".bt-exit-btn").forEach(o=>{o.addEventListener("click",()=>{f=o.dataset.exit,document.querySelectorAll(".bt-exit-btn").forEach(m=>m.classList.remove("active")),o.classList.add("active")})}),(s=document.getElementById("bt-run-btn"))==null||s.addEventListener("click",async()=>{var B;const o=(((B=document.getElementById("bt-ticker"))==null?void 0:B.value)||"").trim().toUpperCase();if(!o)return;const m=document.getElementById("bt-run-btn"),I=document.getElementById("bt-status");m.disabled=!0,m.textContent="⏳ Descargando...",I&&(I.textContent=`Obteniendo 10 años de ${o}...`);try{const x=await kt(o),$=x.timestamps.map((d,w)=>w).filter(d=>x.closes[d]!=null&&x.highs[d]!=null&&x.lows[d]!=null&&!isNaN(x.closes[d])),Y={timestamps:$.map(d=>x.timestamps[d]),opens:$.map(d=>x.opens[d]),highs:$.map(d=>x.highs[d]),lows:$.map(d=>x.lows[d]),closes:$.map(d=>x.closes[d]),vols:$.map(d=>x.vols[d])};I&&(I.textContent="Probando 12 combinaciones..."),await new Promise(d=>setTimeout(d,50));const F=["sma5w","rsi5w","macd","sma5d","rsi5_pullback","canal"],C=["sma10w","sma10d"],R=[];for(const d of F)for(const w of C){const z=St(Y,d,w);R.push({entry:d,exit:w,result:z})}const A=R.find(d=>d.entry===u&&d.exit===f)||R[0],U=R.reduce((d,w)=>w.result.metrics.totalReturn>d.result.metrics.totalReturn?w:d);D(A.result,U,R,o,x.name||o),I&&(I.textContent=`✓ Mejor: ${nt[U.entry]} + ${it[U.exit]}`)}catch(x){I&&(I.textContent="⚠ "+x.message.slice(0,50)),console.error(x)}m.disabled=!1,m.textContent="▶ Ejecutar backtest"})}function D(s,o,m,I,B){const x=document.getElementById("bt-wrap"),{trades:$,equityCurve:Y,metrics:F}=s,{totalReturn:C,winRate:R,avgWin:A,avgLoss:U,profitFactor:d,maxDD:w,nTrades:z}=F,X=C>=0?"var(--green)":"var(--red)",P=o.result.metrics,a=["sma5w","rsi5w","macd","sma5d"].map(n=>["sma10w","sma10d"].map(j=>{const h=m.find(V=>V.entry===n&&V.exit===j),T=h==null?void 0:h.result.metrics.totalReturn,N=h==null?void 0:h.result.metrics.winRate,Q=(h==null?void 0:h.result.metrics.nTrades)||0,Z=o.entry===n&&o.exit===j,J=T==null?"var(--text3)":T>=0?"var(--green)":"var(--red)";return`<div class="bt-combo-cell ${Z?"best":""}" data-entry="${n}" data-exit="${j}" style="cursor:pointer;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:6px;">${nt[n].slice(0,18)} · ${it[j].slice(5,12)}${Z?" ★":""}</div>
          <div style="font-family:var(--mono);font-size:18px;font-weight:700;color:${J};">${T!=null?(T>=0?"+":"")+T.toFixed(1)+"%":"—"}</div>
          <div style="font-size:10px;color:var(--text3);">${Q} ops · WR ${N!=null?N.toFixed(0)+"%":"—"}</div>
        </div>`}).join("")).join("");x.innerHTML=y()+r()+`
      <!-- Mejor combinación -->
      <div class="bt-best">
        <div style="font-size:28px;">★</div>
        <div>
          <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.1em;color:var(--teal);margin-bottom:6px;">MEJOR COMBINACIÓN</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px;">${nt[o.entry]} + ${it[o.exit]}</div>
          <div style="font-size:11px;color:var(--text2);">
            Rentabilidad: <strong style="color:var(--green);">${P.totalReturn>=0?"+":""}${P.totalReturn.toFixed(1)}%</strong> ·
            Win Rate: <strong>${P.winRate.toFixed(1)}%</strong> ·
            Profit Factor: <strong>${P.profitFactor!=null?P.profitFactor.toFixed(2):"∞"}</strong> ·
            ${P.nTrades} ops · Max DD: <strong style="color:var(--red);">-${P.maxDD.toFixed(1)}%</strong>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--teal);">${P.totalReturn>=0?"+":""}${P.totalReturn.toFixed(1)}%</div>
          <div style="font-size:10px;color:var(--text3);">rentabilidad total</div>
        </div>
      </div>

      <!-- Grid comparativa -->
      <div class="bt-combo-grid">${a}</div>

      <!-- KPIs resultado seleccionado -->
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:8px;">${nt[u]} + ${it[f]} — ${I} (${B})</div>
      <div class="bt-strip">
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Rentabilidad</div><div class="bt-strip-val" style="color:${X};">${C>=0?"+":""}${C.toFixed(1)}%</div><div class="bt-strip-sub">sobre base 100</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Operaciones</div><div class="bt-strip-val">${z}</div><div class="bt-strip-sub">${$.filter(n=>n.pct>0).length}G · ${$.filter(n=>n.pct<=0).length}P</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Win Rate</div><div class="bt-strip-val" style="color:${R>=50?"var(--green)":"var(--red)"};">${R.toFixed(1)}%</div><div class="bt-strip-sub">operaciones</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Media Ganancia</div><div class="bt-strip-val" style="color:var(--green);">+${A.toFixed(1)}%</div><div class="bt-strip-sub">pérdida: ${U.toFixed(1)}%</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Profit Factor</div><div class="bt-strip-val" style="color:${d&&d>=1?"var(--green)":"var(--red)"};">${d!=null?d.toFixed(2):"∞"}</div><div class="bt-strip-sub">G/P ratio</div></div>
        <div class="bt-strip-cell"><div class="bt-strip-lbl">Máx. Drawdown</div><div class="bt-strip-val" style="color:var(--red);">-${w.toFixed(1)}%</div><div class="bt-strip-sub">caída máxima</div></div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${I} · Equity Curve · Base 100</div>
        ${Et(Y)}
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">${z} operaciones simuladas</div>
        ${z>0?`<table class="bt-table">
          <thead><tr>
            <th>#</th><th>Entrada</th><th>Salida</th>
            <th>P.Entrada</th><th>P.Salida</th>
            <th>Resultado</th><th>Días</th><th>Motivo</th>
          </tr></thead>
          <tbody>
            ${$.map(n=>{const j=n.pct>=0?"var(--green)":"var(--red)",h=n.exitType==="sma"?"Stop EMA":n.exitType==="cond"?"Conds. rotas":"Abierta";return`<tr>
                <td>${n.n}</td>
                <td>${xt(n.entryDate)}</td>
                <td>${xt(n.exitDate)}</td>
                <td>$${n.entryPrice.toFixed(2)}</td>
                <td>$${n.exitPrice.toFixed(2)}</td>
                <td style="color:${j};font-weight:700;">${n.pct>=0?"+":""}${n.pct.toFixed(2)}%</td>
                <td>${n.bars}d</td>
                <td><span style="font-size:9px;padding:2px 7px;border-radius:3px;background:${n.exitType==="sma"?"rgba(244,113,116,0.1)":n.exitType==="cond"?"rgba(251,191,36,0.1)":"rgba(95,168,224,0.1)"};color:${n.exitType==="sma"?"var(--red)":n.exitType==="cond"?"var(--amber)":"var(--blue)"};">${h}</span></td>
              </tr>`}).join("")}
          </tbody>
        </table>`:'<div style="padding:30px;text-align:center;color:var(--text3);font-family:var(--mono);">Sin operaciones en el período analizado</div>'}
      </div>`,p(),t(),document.querySelectorAll(".bt-combo-cell").forEach(n=>{n.addEventListener("click",()=>{u=n.dataset.entry,f=n.dataset.exit,document.getElementById("bt-ticker").value=I,document.getElementById("bt-run-btn").click()})})}return document.getElementById("bt-wrap").innerHTML=y()+r(),t(),p(),{destroy(){var s;(s=document.getElementById("bt-css"))==null||s.remove()}}}export{Dt as render};
