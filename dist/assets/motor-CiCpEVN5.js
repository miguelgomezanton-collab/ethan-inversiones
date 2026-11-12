import{UserData as B}from"./userdata-2NGQIm4_.js";import{c as it,q as Bt,f as Ct,b as pt,h as Ht,l as Wt,i as Gt,j as _t,k as Yt,u as Kt,d as Qt}from"./index-BgqbrflN.js";const A=a=>(a<0?"−":"")+"€"+Math.abs(a).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),Z=(a,t=1)=>(a>=0?"+":"")+(a*100).toFixed(t)+"%",Rt=a=>a>.001?"var(--green)":a<-.001?"var(--red)":"var(--text2)",J=(a,t,f)=>Math.min(f,Math.max(t,a)),Pt="ethan_motor_policy",Mt={version:"1.0",corePct:.5,satPct:.5,maxAssetNav:.2,maxSectorNav:.35,tradeRisk:.015,portRisk:.06,coreRisk:.03,satRisk:.04,ddScale:[1,.8,.6,.4,.25],coreUniverse:["VTI","VEU","IEF","BNDX"],coreScoreThreshold:6,coreMaxWeight:.4,satMaxWeight:.4,authorizationTTLhours:24,updatedAt:null};let s={...Mt},C=null;function ot(a){const t=Math.abs(a||0);return t<=.03?s.ddScale[0]:t<=.05?s.ddScale[1]:t<=.08?s.ddScale[2]:t<=.1?s.ddScale[3]:s.ddScale[4]}const Xt=`
.mt-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:18px;}
.mt-tab{padding:9px 16px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent;transition:all 0.15s;font-family:var(--sans);}
.mt-tab.active{color:var(--teal);border-bottom-color:var(--teal);}
.mt-panel{display:none;}
.mt-panel.active{display:block;animation:mtFade 0.2s ease;}
@keyframes mtFade{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}

.mt-strip{display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;}
.mt-cell{background:var(--surface);padding:13px 15px;border-right:1px solid var(--border);}
.mt-cell:last-child{border-right:none;}
.mt-lbl{font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;}
.mt-val{font-family:var(--mono);font-size:14px;font-weight:700;}
.mt-sub{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:3px;}

.mt-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:12px;}
.mt-card-title{font-size:10px;font-weight:700;color:var(--text2);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.06em;}

.mt-g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mt-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.mt-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.mt-g5{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;}
.mb12{margin-bottom:12px;}

.mt-kpi{background:var(--surface2);border-radius:8px;padding:12px 14px;}
.mt-kpi-lbl{font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;}
.mt-kpi-val{font-family:var(--serif);font-size:22px;font-weight:600;font-style:italic;}
.mt-kpi-sub{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:4px;}

.mt-field{display:flex;flex-direction:column;gap:4px;}
.mt-field label{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;font-weight:600;}
.mt-input{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 11px;color:var(--text1);font-family:var(--mono);font-size:12px;width:100%;}
.mt-input:focus{outline:none;border-color:var(--teal);}
.mt-select{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 11px;color:var(--text1);font-family:var(--mono);font-size:11px;width:100%;cursor:pointer;}

.mt-bar-track{height:7px;background:var(--surface2);border-radius:4px;overflow:hidden;margin:4px 0;position:relative;}
.mt-bar-fill{height:100%;border-radius:4px;transition:width 0.4s ease;}

.mt-badge{font-family:var(--mono);font-size:8px;font-weight:700;padding:2px 7px;border-radius:8px;display:inline-block;}
.mt-hard{background:rgba(244,113,116,0.15);color:var(--red);}
.mt-soft{background:rgba(251,191,36,0.12);color:var(--amber);}
.mt-info{background:rgba(95,168,224,0.12);color:var(--blue);}
.mt-pass{background:rgba(74,222,128,0.12);color:var(--green);}
.mt-warn{background:rgba(251,191,36,0.12);color:var(--amber);}
.mt-fail{background:rgba(244,113,116,0.12);color:var(--red);}

.mt-wf-row{display:grid;grid-template-columns:1fr 70px 130px 60px 70px;align-items:center;padding:9px 14px;border-bottom:1px solid var(--border);gap:8px;}
.mt-wf-head{font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);background:var(--surface2);}

.mt-ba-grid{display:grid;grid-template-columns:1fr 22px 1fr;gap:0;margin:10px 0;}
.mt-ba-col{background:var(--surface2);border-radius:8px;padding:11px 13px;}
.mt-ba-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:11px;}
.mt-ba-row:last-child{border-bottom:none;}

.mt-dd-table{width:100%;border-collapse:collapse;}
.mt-dd-table th{font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:7px 11px;border-bottom:1px solid var(--border);}
.mt-dd-table td{padding:8px 11px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;}
.mt-dd-table tr.mt-active td{background:rgba(64,217,192,0.06);color:var(--teal);}

.mt-prop-row{display:grid;grid-template-columns:auto 1fr auto auto auto;gap:10px;align-items:center;padding:11px 14px;border-bottom:1px solid var(--border);font-size:11px;}
.mt-prop-row:last-child{border-bottom:none;}

.mt-sdiv{display:flex;align-items:center;gap:10px;margin:16px 0 10px;}
.mt-sdiv-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);white-space:nowrap;}
.mt-sdiv-line{flex:1;height:1px;background:var(--border);}

.mt-delta{font-family:var(--mono);font-size:9px;padding:1px 6px;border-radius:6px;}
.mt-delta-up{background:rgba(74,222,128,0.1);color:var(--green);}
.mt-delta-dn{background:rgba(244,113,116,0.1);color:var(--red);}
.mt-delta-nu{background:var(--surface2);color:var(--text3);}

.mt-loader{display:flex;align-items:center;gap:10px;color:var(--text3);font-family:var(--mono);font-size:11px;padding:32px 20px;}
.mt-loader-ring{width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg)}}

.mt-aa-subtab{transition:color 0.15s,border-color 0.15s;}
.mt-aa-subtab:hover{color:var(--text2)!important;}
.mt-aa-subtab.active{color:var(--teal)!important;border-bottom-color:var(--teal)!important;}
.mt-aa-subpanel{animation:mtFade 0.2s ease;}

.mt-aa-bar{height:10px;border-radius:5px;overflow:hidden;display:flex;margin:10px 0;}
.mt-aa-seg{height:100%;transition:width 0.4s ease;}
.mt-aa-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin:12px 0;}
.mt-aa-card{background:var(--surface2);border-radius:10px;padding:14px;border:1px solid var(--border);}
.mt-aa-card.cash{border-color:var(--border);opacity:0.7;}
.mt-aa-card-top{display:flex;align-items:center;gap:7px;margin-bottom:8px;}
.mt-aa-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.mt-aa-ticker{font-weight:700;font-size:12px;}
.mt-aa-pct{font-family:var(--serif);font-size:32px;font-style:italic;font-weight:600;line-height:1;}
.mt-aa-pct-sym{font-size:16px;}
.mt-aa-meta{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:5px;}
.mt-aa-score-card{background:var(--surface2);border-radius:10px;padding:12px 14px;border:1px solid var(--border);}
.mt-aa-score-card.eligible{border-color:rgba(64,217,192,0.3);}
.mt-aa-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0;}
.mt-aa-metric{background:var(--surface2);border-radius:8px;padding:12px 14px;}
.mt-aa-metric-lbl{font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:5px;}
.mt-aa-metric-val{font-family:var(--mono);font-size:18px;font-weight:700;}
.mt-aa-metric-sub{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;}
.mt-aa-decision-banner{border-radius:10px;padding:16px 18px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;}
.mt-aa-signal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0;}
.mt-aa-signal{font-family:var(--mono);font-size:8px;padding:3px 7px;border-radius:4px;text-align:center;}
.mt-aa-signal.ok{background:rgba(74,222,128,0.12);color:var(--green);}
.mt-aa-signal.no{background:rgba(244,113,116,0.08);color:var(--text3);}

`;function Y(a,t){const f=2/(t+1),e=new Array(a.length).fill(null);let y=a.findIndex(p=>p!=null&&!isNaN(p));if(y<0)return e;e[y]=a[y];for(let p=y+1;p<a.length;p++){const m=a[p]!=null&&!isNaN(a[p])?a[p]:e[p-1];e[p]=m*f+e[p-1]*(1-f)}return e}function $t(a){const t=Y(a,12),f=Y(a,26),e=t.map((y,p)=>y!=null&&f[p]!=null?y-f[p]:null);return{m:e,sl:Y(e.map(y=>y??0),9)}}function wt(a,t=14){const f=new Array(a.length).fill(null);if(a.length<t+1)return f;let e=0,y=0;for(let r=1;r<=t;r++){const n=a[r]-a[r-1];n>0?e+=n:y-=n}let p=e/t,m=y/t;f[t]=m===0?100:100-100/(1+p/m);for(let r=t+1;r<a.length;r++){const n=a[r]-a[r-1];p=(p*(t-1)+(n>0?n:0))/t,m=(m*(t-1)+(n<0?-n:0))/t,f[r]=m===0?100:100-100/(1+p/m)}return f}function At(a,t,f,e){const y=f.map((m,r)=>{if(r<e-1)return null;const n=Math.max(...a.slice(r-e+1,r+1)),d=Math.min(...t.slice(r-e+1,r+1));return n===d?50:(m-d)/(n-d)*100}),p=Y(y,3);return{k:p,d:Y(p.map(m=>m??0),3)}}function Et(a,t,f,e,y,p,m){const r={};a.forEach((d,u)=>{const b=new Date(d*1e3);let c;if(m==="W"){const h=b.getDay(),g=b.getDate()-h+(h===0?-6:1),o=new Date(+b);o.setDate(g),c=o.toISOString().slice(0,10)}else c=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`;r[c]?(r[c].h=Math.max(r[c].h,f[u]),r[c].l=Math.min(r[c].l,e[u]),r[c].c=y[u],r[c].v+=p[u]):r[c]={o:t[u],h:f[u],l:e[u],c:y[u],v:p[u]}});const n=Object.keys(r).sort();return{dates:n,opens:n.map(d=>r[d].o),highs:n.map(d=>r[d].h),lows:n.map(d=>r[d].l),closes:n.map(d=>r[d].c),vols:n.map(d=>r[d].v)}}function Zt(a){if(!a||a.length<2)return null;const t=[];for(let e=1;e<a.length;e++)t.push(a[e]/a[e-1]-1);const f=t.reduce((e,y)=>e+y,0)/t.length;return Math.sqrt(t.reduce((e,y)=>e+Math.pow(y-f,2),0)/t.length)}const Jt=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(a)}`];async function Ft(a){var f,e,y,p,m,r;const t=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=2y&events=history`;for(const n of Jt)try{const d=new AbortController;setTimeout(()=>d.abort(),8e3);const u=await fetch(n(t),{signal:d.signal});if(!u.ok)continue;const b=await u.text();let c;try{c=JSON.parse(b)}catch{continue}const h=(e=(f=c==null?void 0:c.chart)==null?void 0:f.result)==null?void 0:e[0];if(!h)continue;const g=(p=(y=h.indicators)==null?void 0:y.quote)==null?void 0:p[0];if(!g)continue;const o=((r=(m=h.indicators.adjclose)==null?void 0:m[0])==null?void 0:r.adjclose)||g.close,x=o.map((l,i)=>g.close[i]&&l?l/g.close[i]:1);return{timestamps:h.timestamp,opens:g.open.map((l,i)=>l*x[i]),highs:g.high.map((l,i)=>l*x[i]),lows:g.low.map((l,i)=>l*x[i]),closes:o,vols:g.volume}}catch{}throw new Error(`Sin datos: ${a}`)}function Lt(a){const{timestamps:t,opens:f,highs:e,lows:y,closes:p,vols:m}=a,r=Et(t,f,e,y,p,m,"W"),n=Et(t,f,e,y,p,m,"M"),d=$t(n.closes),u=At(n.highs,n.lows,n.closes,89),b=wt(n.closes,14),c=Y(n.closes,10),h=n.closes.length-1,g=$t(r.closes),o=At(r.highs,r.lows,r.closes,89),x=wt(r.closes,14),l=Y(r.closes,20),i=r.closes.length-1,R={macd:d.m[h]>0&&d.m[h]>d.sl[h],s89:u.k[h]>80&&u.k[h]>u.d[h]||u.k[h]>92,rsi:b[h]>65,precio:c[h]&&n.closes[h]>c[h]},S={macd:g.m[i]>0&&g.m[i]>g.sl[i],s89:o.k[i]>85&&o.k[i]>o.d[i]||o.k[i]>92,rsi:x[i]>67,precio:l[i]&&r.closes[i]>l[i]},L=Object.values(R).filter(z=>z).length+Object.values(S).filter(z=>z).length,P=p.slice(-252),M=p[p.length-1],T=Math.min(...P),v=Math.max(...P),E=(M-T)/(v-T)*100;return{score:L,mensual:R,semanal:S,price:M,closes:p.slice(-60),percentile:E,min52:T,max52:v}}function Tt(a,t,f=100){const y=a.map(d=>({...d,vol:Zt(d.closes)})).filter(d=>d.vol&&d.vol>0);if(!y.length)return[];const p=y.map(d=>1/d.vol),m=p.reduce((d,u)=>d+u,0);let r=y.map((d,u)=>({...d,weightPct:p[u]/m*f}));const n=t*f;for(let d=0;d<10&&r.filter(g=>g.weightPct>n).length;d++){let b=0;r.forEach(g=>{g.weightPct>n&&(b+=g.weightPct-n,g.weightPct=n)}),r.reduce((g,o)=>g+o.weightPct,0);const c=r.filter(g=>g.weightPct<n-.001),h=c.reduce((g,o)=>g+(n-o.weightPct),0);if(!c.length||!h)break;c.forEach(g=>{g.weightPct+=Math.min(n-g.weightPct,g.weightPct/c.reduce((o,x)=>o+x.weightPct,0)*b)})}if(r.some(d=>d.weightPct>n+.001)){const d=r.map(u=>`${u.ticker}:${u.weightPct.toFixed(2)}%`).join(",");throw new Error(`CORE_MAX_WEIGHT_BREACH — effMax=${n.toFixed(1)}% violado por [${d}]`)}return r.sort((d,u)=>u.weightPct-d.weightPct)}async function te(a){try{if(!it())return;const f=`ethan_aa_snapshot_${new Date().toISOString().slice(0,10)}`;await B.set(f,{...a,savedAt:new Date().toISOString()})}catch{}}const zt=[{ticker:"VTI",name:"Vanguard Total Stock Market",type:"RV",category:"allocation"},{ticker:"VEU",name:"Vanguard FTSE All-World ex-US",type:"RV",category:"allocation"},{ticker:"IEF",name:"iShares 7-10Y Treasury Bond",type:"RF",category:"allocation"},{ticker:"BNDX",name:"Vanguard Total Intl Bond",type:"RF",category:"allocation"},{ticker:"VNQ",name:"Vanguard Real Estate ETF",type:"REIT",category:"reit"},{ticker:"VNQI",name:"Vanguard Global ex-US Real Estate",type:"REIT",category:"reit"},{ticker:"GLD",name:"SPDR Gold Trust",type:"GOLD",category:"commodity"},{ticker:"SLV",name:"iShares Silver Trust",type:"SILVER",category:"commodity"},{ticker:"USO",name:"United States Oil Fund",type:"OIL",category:"commodity"},{ticker:"SPY",name:"S&P 500 ETF",type:"INDEX",category:"indicator"},{ticker:"HYG",name:"iShares High Yield Corp Bond",type:"HY",category:"indicator"},{ticker:"EURUSD=X",name:"Euro/Dólar",type:"FX",category:"indicator"}];async function ct(){try{let d=function(v,E){const z=2/(E+1),w=[v[0]];for(let O=1;O<v.length;O++)w.push(v[O]*z+w[O-1]*(1-z));return w};const a=await B.get(Pt);a&&(s={...Mt,...a});const t=await B.get("ethan_capital_alcista")||0,f=await B.get("ethan_capital_bajista")||0,e=t+f,y=await B.get("ethan_positions")||[],m=(await B.get("ethan_positions_history")||[]).reduce((v,E)=>v+(E.pnlAbs||0),0),r=await B.get("ethan_watchlist")||[],n={};r.forEach(v=>{v.ticker&&v.sector&&(n[v.ticker.toUpperCase()]=v.sector)});const u=await Promise.all(y.map(async v=>{var _;let E=v.currentPrice>0?v.currentPrice:v.entry||0;const z=v.initialStop||v.entryStop||v.stopManual||0;let w=0;v.stopType==="manual"&&v.stopManual>0?w=v.stopManual:v.activeStop>0?w=v.activeStop:v.stopType==="semanal"&&v.stopSemanal>0?w=v.stopSemanal:v.stopDiario>0?w=v.stopDiario:z>0&&(w=z);const O=v.direction||"alcista",V=v.shares||(v.cost&&v.entry?Math.round(v.cost/v.entry):0),F=V*v.entry,D=V*E,N=O==="bajista"?(v.entry-E)*V:(E-v.entry)*V,H=F>0?N/F:0,k=z>0?Math.abs(v.entry-z)*V:0;let I=0;w>0&&(O==="bajista"?I=w>v.entry?(w-v.entry)*V:0:I=w<v.entry?(v.entry-w)*V:0);let U=0;w>0&&E>0&&(O==="bajista"?U=Math.max(0,(w-E)*V):U=Math.max(0,(E-w)*V));const G=v.bucket||"sat",tt=v.sector||n[(_=v.ticker)==null?void 0:_.toUpperCase()]||"desconocido";return{...v,current:E,pnlPct:H,pnlAbs:N,cost:F,mktVal:D,bucket:G,sector:tt,dir:O,shares:V,initialStop:z,activeStop:w,initialRisk:k,capitalAtRisk:I,pnlAtRisk:U,stop:w}})),b=u.reduce((v,E)=>v+E.pnlAbs,0),c=e+m+b,h=u.reduce((v,E)=>v+E.mktVal,0),g=Math.max(0,c-h),o={core:0,sat:0},x={};u.forEach(v=>{o[v.bucket]=(o[v.bucket]||0)+v.mktVal,x[v.sector]=(x[v.sector]||0)+v.mktVal});const l=u.reduce((v,E)=>v+(E.capitalAtRisk||0),0),i=await B.get("ethan_fondo"),R=100,S=(i==null?void 0:i.participaciones)||e/R,L=S>0?c/S:R;let P=R;i!=null&&i.movimientos&&(P=Math.max(R,...i.movimientos.map(v=>v.vl||R))),P=Math.max(P,L);const M=P*S,T=M>0?Math.min(0,c/M-1):0;return C={nav:c,capitalInicial:e,cash:g,invested:h,unrealPnl:b,pnlReal:m,positions:u,buckets:o,sectors:x,openRisk:l,openRiskPct:c>0?l/c:0,drawdownActual:T,hwm:M,vlActual:L,timestamp:new Date().toISOString()},!0}catch(a){return console.error("Motor loadState:",a),!1}}function ee(a){if(!C)return;const{nav:t,cash:f,invested:e,unrealPnl:y,openRisk:p,openRiskPct:m,drawdownActual:r,hwm:n,positions:d,buckets:u,sectors:b}=C,c=(i,R,S)=>{const L=a.querySelector("#mt-"+i);L&&(L.textContent=R,S&&(L.style.color=S))};c("nav",A(t),"var(--teal)"),c("cash",A(f),f/t>.5?"var(--amber)":"var(--text1)"),c("invested",A(e),"var(--blue)"),c("unreal",(y>=0?"+":"")+A(y),Rt(y)),c("dd",Z(r),Math.abs(r)>.08?"var(--red)":Math.abs(r)>.03?"var(--amber)":"var(--green)"),c("risk",A(p),m>s.portRisk?"var(--red)":m>s.portRisk*.7?"var(--amber)":"var(--green)");const h=(i,R)=>{const S=a.querySelector("#mt-sub-"+i);S&&(S.textContent=R)};h("nav","HWM: "+A(n)),h("cash",(f/t*100).toFixed(1)+"% NAV"),h("invested",(e/t*100).toFixed(1)+"% NAV"),h("risk",(m*100).toFixed(2)+"% NAV");const g=a.querySelector("#mt-positions");g.innerHTML=d.length?`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:860px;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          ${["TICKER","DIR","ENTRADA","ACTUAL","P&L%","STOP INICIAL","STOP ACTIVO","CAP. EN RIESGO","P&L AT RISK","% NAV","BUCKET"].map(i=>`<th style="font-family:var(--mono);font-size:8px;text-transform:uppercase;color:var(--text3);padding:7px 8px;text-align:${["TICKER","DIR","BUCKET"].includes(i)?"left":"right"};">${i}</th>`).join("")}
        </tr></thead>
        <tbody>
          ${d.map(i=>{const R=i.mktVal/t,S=i.activeStop>0?i.dir==="bajista"?i.activeStop<=i.current?"var(--green)":"var(--red)":i.activeStop>=i.entry?"var(--green)":"var(--red)":"var(--text3)";return`<tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px;font-weight:700;">${i.ticker}</td>
              <td style="padding:8px;"><span class="mt-badge ${i.dir==="bajista"?"mt-fail":"mt-pass"}" style="font-size:8px;">${i.dir==="bajista"?"SHORT":"LONG"}</span></td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">$${i.entry.toFixed(2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">$${i.current.toFixed(2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${Rt(i.pnlPct)};">${Z(i.pnlPct,2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:var(--text3);">${i.initialStop>0?"$"+i.initialStop.toFixed(2):"—"}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${S};">${i.activeStop>0?"$"+i.activeStop.toFixed(2):"—"}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${i.capitalAtRisk>0?"var(--red)":"var(--green)"};">${i.capitalAtRisk>0?A(i.capitalAtRisk):"€0 ✓"}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:var(--amber);">${i.pnlAtRisk>0?A(i.pnlAtRisk):"—"}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">${(R*100).toFixed(1)}%</td>
              <td style="padding:8px;"><span style="font-family:var(--mono);font-size:9px;color:${i.bucket==="core"?"var(--teal)":"var(--purple)"};">${i.bucket.toUpperCase()}</span></td>
            </tr>`}).join("")}
        </tbody>
      </table></div>`:`<div style="text-align:center;padding:24px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas · Cash ${(f/t*100).toFixed(1)}%</div>`;const o=a.querySelector("#mt-buckets");o.innerHTML=["core","sat"].map(i=>{const R=t>0?u[i]/t:0,S=i==="core"?s.corePct:s.satPct,L=i==="core"?"var(--teal)":"var(--purple)";return`<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
        <span style="color:${L};font-weight:700;">${i.toUpperCase()}</span>
        <span style="font-family:var(--mono);">${(R*100).toFixed(1)}% <span style="color:var(--text3);">/ ${(S*100).toFixed(0)}%</span></span>
      </div>
      <div class="mt-bar-track">
        <div style="position:absolute;height:100%;width:${(S*100).toFixed(0)}%;background:${L};opacity:0.15;border-radius:4px;left:0;top:0;"></div>
        <div class="mt-bar-fill" style="width:${J(R/S*100,0,100).toFixed(1)}%;background:${L};position:relative;"></div>
      </div>
    </div>`}).join("");const x=a.querySelector("#mt-sectors"),l=Object.entries(b).sort((i,R)=>R[1]-i[1]);x.innerHTML=l.length?l.map(([i,R])=>{const S=t>0?R/t:0,L=S>s.maxSectorNav;return`<div style="margin-bottom:7px;">
      <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;">
        <span style="color:var(--text2);">${i}</span>
        <span style="font-family:var(--mono);color:${L?"var(--red)":"var(--text1)"};">${(S*100).toFixed(1)}%${L?" ⚠":""}</span>
      </div>
      <div class="mt-bar-track" style="height:5px;">
        <div class="mt-bar-fill" style="width:${J(S*100,0,100).toFixed(1)}%;background:${L?"var(--red)":"var(--blue)"};"></div>
      </div>
    </div>`}).join(""):'<div style="font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas</div>',a.querySelector("#mt-timestamp").textContent=new Date(C.timestamp).toLocaleString("es-ES")}async function ae(a){const t=(C==null?void 0:C.nav)||0,f=t*s.corePct;t*s.satPct;const e=s.coreScoreThreshold??6,y=s.coreMaxWeight??.4,p=(s.coreUniverse||[]).filter(k=>!zt.find(I=>I.ticker===k)),m=[...zt,...p.map(k=>({ticker:k,name:k,type:"RV",category:"allocation"}))],r=a.querySelector("#mt-aa-core-results");r&&(r.innerHTML=`<div class="mt-loader"><div class="mt-loader-ring"></div>Calculando señales para ${m.length} activos...</div>`);const n=[];for(let k=0;k<m.length;k++){const I=m[k];await new Promise(U=>setTimeout(U,k*150));try{const U=await Ft(I.ticker),G=Lt(U);n.push({...I,...G})}catch(U){n.push({...I,score:0,error:U.message})}}const d=n.filter(k=>k.category==="allocation").sort((k,I)=>I.score-k.score),u=n.filter(k=>k.category==="reit"),b=n.filter(k=>k.category==="commodity"),c=n.filter(k=>k.category==="indicator"),h=b.find(k=>k.ticker==="GLD"),g=b.find(k=>k.ticker==="SLV"),o=b.find(k=>k.ticker==="USO"),x=c.find(k=>k.ticker==="HYG"),l=c.find(k=>k.ticker==="EURUSD=X"),i=c.find(k=>k.ticker==="SPY"),R=d.slice(0,2),S=R.filter(k=>k.type==="RV").length,L=R.filter(k=>k.type==="RF").length;let P;S===2?P={type:"RV",label:"Renta Variable",class:"green",desc:"Los 2 más fuertes son RV"}:L===2?P={type:"RF",label:"Renta Fija",class:"blue",desc:"Los 2 más fuertes son RF"}:P={type:"NEUTRO",label:"Mixto",class:"amber",desc:"1 RF + 1 RV"};const M=P.type==="NEUTRO"?"RV":P.type,T=d.filter(k=>!k.error&&k.type===M&&k.score>=e),v=T.length>0?T:d.filter(k=>!k.error&&k.type===M),E=v.length>0?v.reduce((k,I)=>k+I.score,0)/v.length:0,z=Math.max(0,Math.min(100,(8-E)/8*100)),w=100-z,V=Tt(v,y,100).map(k=>({...k,weightPct:Math.min(k.weightPct,w)})),F=d.filter(k=>k.type==="RV"&&!k.error),D=d.filter(k=>k.type==="RF"&&!k.error),N=F.reduce((k,I)=>k+I.score,0)/(F.length||1),H=D.reduce((k,I)=>k+I.score,0)/(D.length||1);await te({date:new Date().toISOString().slice(0,10),decision:M,recommendation:P.label,rvScore:N,rfScore:H,scoreMedio:E,cashPct:z,scores:n.map(k=>({ticker:k.ticker,score:k.score,type:k.type,category:k.category})),positions:V.map(k=>({ticker:k.ticker,weightPct:k.weightPct})),nav:t,coreBudget:f}),re(a,{allocationAssets:d,top2:R,recommendation:P,reitAssets:u,gold:h,silver:g,oil:o,hy:x,fx:l,spy:i,corePositions:V,scoreMedio:E,cashPct:z,investedPct:w,coreThreshold:e,coreBudget:f,nav:t,rvScore:N,rfScore:H})}const dt={RV:"#40d9c0",RF:"#5fa8e0",REIT:"#a78bfa",GOLD:"#fbbf24",SILVER:"#9ca3af",OIL:"#f47174",Cash:"#3d6460"};function ie(a){return a>=6?"s-high":a>=4?"s-mid":"s-low"}function oe(a){return a.mensual?`<div class="aa-cond-row">
    <span class="aa-cond-mini ${a.mensual.macd?"ok":""}">M·MACD</span>
    <span class="aa-cond-mini ${a.mensual.s89?"ok":""}">M·S89</span>
    <span class="aa-cond-mini ${a.mensual.rsi?"ok":""}">M·RSI</span>
    <span class="aa-cond-mini ${a.mensual.precio?"ok":""}">M·P>EMA</span>
    <span class="aa-cond-mini ${a.semanal.macd?"ok":""}">W·MACD</span>
    <span class="aa-cond-mini ${a.semanal.s89?"ok":""}">W·S89</span>
    <span class="aa-cond-mini ${a.semanal.rsi?"ok":""}">W·RSI</span>
    <span class="aa-cond-mini ${a.semanal.precio?"ok":""}">W·P>EMA</span>
  </div>`:""}function et(a,t){return`<div class="aa-asset-card ${t?"selected":""}">
    <div class="aa-asset-top">
      <div>
        <div class="aa-asset-ticker">${a.ticker.replace("=X","")}</div>
        <div class="aa-asset-region">${a.type||""}</div>
      </div>
      <div class="aa-asset-score ${ie(a.score)}">${a.score}<span class="aa-asset-score-max">/8</span></div>
    </div>
    ${oe(a)}
  </div>`}function se(a,t,f){if(!a||a.positions.length===0)return`<div class="aa-sizing-block">
      <div class="section-title">Cartera CORE <span class="count">inversa de volatilidad</span></div>
      <div class="aa-cash-banner">
        <div class="aa-cash-icon">💵</div>
        <div>
          <div class="aa-cash-title">100% Cash · En espera de señal</div>
          <div class="aa-cash-desc">Ningún activo alcanza score ≥${s.coreScoreThreshold??6}/8. Mantener liquidez hasta que mejoren las condiciones.</div>
        </div>
      </div>
    </div>`;const y=[...a.positions.map(m=>({label:m.ticker,pct:m.weightPct,color:dt[m.type]||"var(--teal)"})),...a.cashPct>.5?[{label:"CASH",pct:a.cashPct,color:dt.Cash}]:[]].map(m=>`<div class="aa-sizing-seg" style="width:${m.pct.toFixed(1)}%;background:${m.color};" title="${m.label}: ${m.pct.toFixed(1)}%"></div>`).join(""),p=a.positions.map(m=>`
    <div class="aa-sizing-card">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:${dt[m.type]||"var(--teal)"}"></span>
        <span class="aa-sizing-ticker">${m.ticker}</span>
      </div>
      <div class="aa-sizing-pct">${m.weightPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--teal);margin-top:3px;">${A(t*m.weightPct/100)}</div>
      <div class="aa-sizing-meta">score ${m.score}/8</div>
      <div class="aa-sizing-meta-vol">vol 60d: ${m.vol?(m.vol*100).toFixed(2)+"%/día":"—"}</div>
    </div>`).join("")+(a.cashPct>.5?`
    <div class="aa-sizing-card cash">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:var(--text3)"></span>
        <span class="aa-sizing-ticker">CASH</span>
      </div>
      <div class="aa-sizing-pct" style="color:var(--text3)">${a.cashPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${A(t*a.cashPct/100)}</div>
      <div class="aa-sizing-meta">convicción media ${a.scoreMedio.toFixed(1)}/8</div>
    </div>`:"");return`<div class="aa-sizing-block">
    <div class="section-title">Cartera CORE <span class="count">inversa de volatilidad · score≥${s.coreScoreThreshold??6}</span></div>
    <div class="aa-sizing-layout">
      <div class="aa-sizing-main">
        <div class="aa-sizing-bar">${y}</div>
        <div class="aa-sizing-grid">${p}</div>
        <div class="aa-sizing-note">Menos volátil → más peso (desviación estándar 60 sesiones). Cash% = (8 − score medio) / 8. Tope: ${Math.round((s.coreMaxWeight||.4)*100)}% por activo. Budget CORE: ${A(t)}</div>
      </div>
    </div>
  </div>`}function re(a,{allocationAssets:t,top2:f,recommendation:e,reitAssets:y,gold:p,silver:m,oil:r,hy:n,fx:d,spy:u,corePositions:b,scoreMedio:c,cashPct:h,investedPct:g,coreThreshold:o,coreBudget:x,nav:l,rvScore:i,rfScore:R}){const S=a.querySelector("#mt-aa-core-results");if(!S)return;const P=se({positions:b,cashPct:h,scoreMedio:c},x),M=[];p&&p.score>=7&&M.push({type:"caution",icon:"🥇",text:"<strong>Oro en máximos:</strong> mercado buscando refugio, incertidumbre elevada."}),m&&p&&m.score>=7&&p.score>=7&&M.push({type:"caution",icon:"🥈",text:"<strong>Oro y plata fuertes:</strong> señal de refugio amplificada."}),e.type==="RV"&&n&&n.score<=4&&M.push({type:"alert",icon:"⚠️",text:"<strong>Divergencia:</strong> RV fuerte pero High Yield débil. Extrema precaución."}),r&&r.score>=7&&M.push({type:"caution",icon:"🛢️",text:"<strong>Petróleo muy fuerte:</strong> posible presión inflacionaria."}),e.type==="RV"&&n&&n.score>=6&&p&&p.score<=4&&M.push({type:"ok",icon:"✓",text:"<strong>Entorno favorable:</strong> RV fuerte, crédito sano, sin búsqueda de refugio."}),e.type==="RF"&&p&&p.score>=6&&M.push({type:"alert",icon:"🛡️",text:"<strong>Modo defensivo total:</strong> RF + Oro fuertes. Máxima aversión al riesgo."}),d&&d.score>=7&&M.push({type:"alert",icon:"💱",text:"<strong>Euro muy fuerte:</strong> impacto negativo en inversiones USD sin cobertura."}),n&&n.score<=2&&M.push({type:"alert",icon:"🚨",text:"<strong>Alerta crítica:</strong> High Yield colapsando. Reducir exposición a riesgo."});const T=n&&n.score<=3?"red":n&&n.score<=5?"amber":"green",v=n&&n.score<=3?"Alto":n&&n.score<=5?"Moderado":"Bajo",E=d&&d.score>=6?"red":d&&d.score>=4?"amber":"green",z=d&&d.score>=6?"Sí cubrir":d&&d.score>=4?"Vigilar":"No cubrir";S.innerHTML=`
    <div class="aa-tab-panel">
      ${P}

      ${M.length?`<div class="aa-warnings">
        ${M.map(w=>`<div class="aa-warning-item ${w.type}"><div class="aa-warning-icon">${w.icon}</div><div class="aa-warning-text">${w.text}</div></div>`).join("")}
      </div>`:""}

      <div class="aa-decision-row">
        <div class="aa-decision-card ${e.class}">
          <div class="aa-decision-label">Decisión de Inversión</div>
          <div class="aa-decision-value ${e.class}">${e.label}</div>
          <div class="aa-decision-desc">${e.desc}</div>
        </div>
        <div class="aa-decision-card ${T}">
          <div class="aa-decision-label">Riesgo de Recesión</div>
          <div class="aa-decision-value ${T}">${v}</div>
          <div class="aa-decision-desc">${n?"HYG Score: "+n.score+"/8":"—"}</div>
        </div>
        <div class="aa-decision-card ${E}">
          <div class="aa-decision-label">Cobertura Cambiaria</div>
          <div class="aa-decision-value ${E}">${z}</div>
          <div class="aa-decision-desc">${d?"EUR/USD Score: "+d.score+"/8":"—"}</div>
        </div>
      </div>

      <div class="section-title">Renta Variable vs Renta Fija <span class="count">decisión principal</span></div>
      <div class="aa-asset-grid">
        ${t.map(w=>et(w,f.includes(w))).join("")}
      </div>

      <div class="section-title" style="margin-top:24px;">Inmobiliario (REIT) <span class="count">satélite — informativo</span></div>
      <div class="aa-asset-grid">
        ${y.map(w=>et(w,!1)).join("")}
      </div>

      <div class="section-title" style="margin-top:24px;">Commodities &amp; Contexto <span class="count">satélite — informativo</span></div>
      <div class="aa-asset-grid satellite">
        ${[p,m,r].filter(Boolean).map(w=>et(w,!1)).join("")}
      </div>
      <div class="aa-asset-grid satellite" style="margin-top:12px;">
        ${[u,n,d].filter(Boolean).map(w=>et(w,!1)).join("")}
      </div>
    </div>`}function ne(a,{satData:t,satPositions:f,satBudget:e,satUniverse:y,nav:p}){const m=a.querySelector("#mt-aa-sat-results");if(!m)return;if(!y.length){m.innerHTML='<div class="empty" style="padding:30px 20px;"><div class="empty-title">Cartera Satélite vacía</div><div class="empty-desc">Añade al menos 2 tickers y pulsa Calcular pesos.</div></div>';return}if(!f.length){m.innerHTML='<div class="empty" style="padding:30px 20px;"><div class="empty-title">No se pudo calcular</div><div class="empty-desc">Revisa los tickers o inténtalo de nuevo.</div></div>';return}const r=["#40d9c0","#a78bfa","#fbbf24","#5fa8e0","#4ade80","#f47174","#9ca3af","#fb923c"],n={};f.forEach((c,h)=>n[c.ticker]=r[h%r.length]);const d=f.map(c=>`<div class="aa-sizing-seg" style="width:${c.weightPct.toFixed(1)}%;background:${n[c.ticker]};" title="${c.ticker}: ${c.weightPct.toFixed(1)}%"></div>`).join(""),u=f.map(c=>`
    <div class="aa-sizing-card">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:${n[c.ticker]}"></span>
        <span class="aa-sizing-ticker">${c.ticker}</span>
      </div>
      <div class="aa-sizing-pct">${c.weightPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--purple);margin-top:3px;">${A(e*c.weightPct/100)}</div>
      <div class="aa-sizing-meta-vol">vol 60d: ${c.vol?(c.vol*100).toFixed(2)+"%/día":"—"}</div>
    </div>`).join(""),b=t.filter(c=>c.error);m.innerHTML=`
    <div class="aa-tab-panel">
      <div class="aa-sizing-block">
        <div class="section-title">Reparto Sugerido <span class="count">inversa de volatilidad · 100% invertido, sin cash</span></div>
        <div class="aa-sizing-layout">
          <div class="aa-sizing-main">
            <div class="aa-sizing-bar">${d}</div>
            <div class="aa-sizing-grid">${u}</div>
            <div class="aa-sizing-note">Menos volátil → más peso (60 sesiones). Tope ${Math.round((s.satMaxWeight||.4)*100)}% por activo. Sin filtro de score. Budget SAT: ${A(e)}</div>
            ${b.length?`<div class="aa-sizing-note" style="color:var(--amber);margin-top:6px;">⚠ Sin datos: ${b.map(c=>c.ticker).join(", ")}</div>`:""}
          </div>
        </div>
      </div>
    </div>`}function le(a){if(!C)return;const{nav:t,cash:f,buckets:e}=C;["core","sat"].forEach(u=>{const b=u==="core"?s.corePct:s.satPct,c=t*b,h=e[u]||0,g=Math.max(0,c-h),o=c>0?h/c:0,x=u==="core"?"var(--teal)":"var(--purple)",l=i=>a.querySelector(`#mt-${u}-${i}`);l("tgt")&&(l("tgt").textContent=(b*100).toFixed(0)+"% NAV"),l("budget")&&(l("budget").textContent=A(c)),l("inv")&&(l("inv").textContent=A(h)),l("avail")&&(l("avail").textContent=A(g),l("avail").style.color=g>0?"var(--green)":"var(--text3)"),l("bar")&&(l("bar").style.width=J(o*100,0,100).toFixed(1)+"%",l("bar").style.background=x),l("occ")&&(l("occ").textContent=(o*100).toFixed(1)+"% ocupado")});const y=(e.core||0)+(e.sat||0),p=[{dim:"CORE",label:"Límite máx.",lim:s.corePct,act:(e.core||0)/t,tol:s.corePct},{dim:"SATÉLITE",label:"Límite máx.",lim:s.satPct,act:(e.sat||0)/t,tol:s.satPct},{dim:"RV Total",label:"Capital Invertido",lim:null,act:y/t,tol:null},{dim:"Cash",label:"Cash Táctico",lim:null,act:f/t,tol:null}],m=a.querySelector("#mt-alloc-table");m&&(m.innerHTML=p.map(u=>{let b,c;if(u.lim!==null){const g=u.act>u.lim+.001;b=g?"var(--red)":"var(--green)",c=g?"✗ Supera límite":"✓ Dentro límite"}else b="var(--text3)",c="— informativo";const h=u.lim!==null?Z(u.lim):"—";return`<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:9px 12px;font-weight:700;">${u.dim}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);font-size:10px;color:var(--text3);">${u.label}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${h}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${Z(u.act)}</td>
      <td style="padding:9px 12px;text-align:right;font-size:10px;color:${b};">${c}</td>
    </tr>`}).join(""));const r=t*s.corePct,n=t*s.satPct,d=(u,b)=>{const c=a.querySelector("#mt-"+u);c&&(c.textContent=b)};d("cash-struct",A(Math.max(0,t-r-n))),d("cash-core",A(Math.max(0,r-(e.core||0)))),d("cash-sat",A(Math.max(0,n-(e.sat||0))))}function de(a){if(!C)return;const{nav:t,drawdownActual:f,positions:e}=C,y=ot(f),p=s.tradeRisk*y,m=e.filter(l=>l.bucket==="core").reduce((l,i)=>l+(i.capitalAtRisk||0),0),r=e.filter(l=>l.bucket==="sat").reduce((l,i)=>l+(i.capitalAtRisk||0),0),n=m+r,d=t>0?n/t:0,u=t>0?m/t:0,b=t>0?r/t:0,c=Math.max(0,s.portRisk-d),h=(l,i,R)=>{const S=a.querySelector("#mt-"+l);S&&(S.textContent=i,R&&(S.style.color=R))};h("rb-global-used",(d*100).toFixed(2)+"%",d>s.portRisk?"var(--red)":d>s.portRisk*.7?"var(--amber)":"var(--green)"),h("rb-global-avail",(c*100).toFixed(2)+"%","var(--green)"),h("rb-global-limit","Límite: "+(s.portRisk*100).toFixed(0)+"% NAV"),h("rb-per-trade",(p*100).toFixed(2)+"%","var(--amber)"),h("rb-dd-mult",`×${y.toFixed(2)} · DD: ${Z(f)} · Base: ${(s.tradeRisk*100).toFixed(2)}%`);const g=a.querySelector("#mt-rb-global-bar");g&&(g.style.width=J(d/s.portRisk*100,0,100).toFixed(1)+"%",g.style.background=d>s.portRisk?"var(--red)":d>s.portRisk*.7?"var(--amber)":"var(--green)"),[["core",u,s.coreRisk,"var(--teal)"],["sat",b,s.satRisk,"var(--purple)"]].forEach(([l,i,R,S])=>{const L=Math.max(0,R-i);h(`rb-${l}-used`,(i*100).toFixed(2)+"%"),h(`rb-${l}-avail`,(L*100).toFixed(2)+"%","var(--green)"),h(`rb-${l}-limit`,"Límite: "+(R*100).toFixed(0)+"% NAV");const P=a.querySelector(`#mt-rb-${l}-bar`);P&&(P.style.width=J(i/R*100,0,100).toFixed(1)+"%",P.style.background=i>R?"var(--red)":S)});const o=a.querySelector("#mt-dd-table");if(o){const l=[{r:"0% a -3%",m:s.ddScale[0],from:0,to:.03},{r:"-3% a -5%",m:s.ddScale[1],from:.03,to:.05},{r:"-5% a -8%",m:s.ddScale[2],from:.05,to:.08},{r:"-8% a -10%",m:s.ddScale[3],from:.08,to:.1},{r:"> -10%",m:s.ddScale[4],from:.1,to:1}],i=Math.abs(f||0);o.innerHTML=l.map(R=>{const S=i>=R.from&&i<R.to;return`<tr class="${S?"mt-active":""}">
        <td>${R.r}</td><td>×${R.m.toFixed(2)}</td>
        <td>${(s.tradeRisk*100).toFixed(2)}% NAV</td>
        <td>${(s.tradeRisk*R.m*100).toFixed(2)}% NAV</td>
        <td>${S?"← Activo":""}</td>
      </tr>`}).join("")}const x=a.querySelector("#mt-risk-positions");x&&(x.innerHTML=e.length?`<table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead><tr style="border-bottom:1px solid var(--border);">
            ${["TICKER","DIR","BUCKET","ACTUAL","STOP","RIESGO €","% NAV"].map(l=>`<th style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:7px 10px;text-align:${l==="TICKER"?"left":"right"};">${l}</th>`).join("")}
          </tr></thead>
          <tbody>${e.map(l=>{const i=l.capitalAtRisk||0,R=t>0?i/t:0;return`<tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px 10px;font-weight:700;">${l.ticker}</td>
              <td style="padding:8px 10px;text-align:right;"><span class="mt-badge ${l.dir==="bajista"?"mt-fail":"mt-pass"}" style="font-size:8px;">${l.dir==="bajista"?"SHORT":"LONG"}</span></td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);font-size:9px;color:${l.bucket==="core"?"var(--teal)":"var(--purple)"};">${l.bucket.toUpperCase()}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);">$${l.current.toFixed(2)}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${l.stop>0?"$"+l.stop.toFixed(2):"—"}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${l.stop>0?A(i):"—"}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${l.stop>0?(R*100).toFixed(2)+"%":"—"}</td>
            </tr>`}).join("")}</tbody>
        </table>`:'<div style="text-align:center;padding:20px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas</div>')}async function ce(a){var gt,bt,yt,ht,kt,St;if(!C)return;const t=$=>a.querySelector("#mt-sz-"+$),f=(((gt=t("ticker"))==null?void 0:gt.value)||"").trim().toUpperCase(),e=((bt=t("bucket"))==null?void 0:bt.value)||"sat",y=((yt=t("side"))==null?void 0:yt.value)||"long",p=((ht=t("sector"))==null?void 0:ht.value)||"tech",m=parseFloat((kt=t("entry"))==null?void 0:kt.value)||0,r=parseFloat((St=t("stop"))==null?void 0:St.value)||0,n=a.querySelector("#mt-sz-result"),d=a.querySelector("#mt-sz-waterfall"),u=$=>{n.innerHTML=`<div style="color:var(--red);font-family:var(--mono);font-size:11px;padding:20px;background:rgba(244,113,116,0.05);border-radius:8px;">⚠ ${$}</div>`,d.innerHTML=""};if(!m||!r){u("Introduce precio de entrada y stop loss.");return}if(y==="long"&&r>=m){u("LONG: el stop debe ser MENOR que la entrada.");return}if(y==="short"&&r<=m){u("SHORT: el stop debe ser MAYOR que la entrada.");return}if(Math.abs(m-r)/m>.2){u("Stop demasiado alejado (>20% de entrada). Revisa los datos.");return}const{nav:b,cash:c,buckets:h,sectors:g,positions:o,openRisk:x,drawdownActual:l}=C,i=ot(l),R=e==="core"?s.corePct:s.satPct,S=b*R,L=h[e]||0,P=Math.max(0,S-L),M=e==="core"?s.coreRisk:s.satRisk,T=o.filter($=>$.bucket===e).reduce(($,q)=>$+(q.capitalAtRisk||0),0),v=Math.max(0,b*M-T),E=o.reduce(($,q)=>$+(q.capitalAtRisk||0),0),z=Math.max(0,b*s.portRisk-E),w=b*s.tradeRisk*i,O=Math.abs(m-r),V=o.filter($=>$.ticker===f).reduce(($,q)=>$+q.mktVal,0),F=o.filter($=>$.sector===p).reduce(($,q)=>$+q.mktVal,0),D=Math.max(0,b*s.maxAssetNav-V),N=Math.max(0,b*s.maxSectorNav-F),H=[{id:"risk",label:"Riesgo/op. efectivo",type:"HARD",qty:w>0?Math.floor(w/O):0,limit:`${A(w)} (${(s.tradeRisk*i*100).toFixed(2)}% NAV × ×${i.toFixed(2)})`},{id:"bucket",label:"Capital bucket "+e.toUpperCase(),type:"HARD",qty:P>0?Math.floor(P/m):0,limit:`${A(P)} disponible`},{id:"cash",label:"Cash disponible real",type:"HARD",qty:c>0?Math.floor(c/m):0,limit:`${A(c)} en cartera`},{id:"asset",label:"Máximo por activo",type:"HARD",qty:D>0?Math.floor(D/m):0,limit:`${(s.maxAssetNav*100).toFixed(0)}% NAV`},{id:"sector",label:"Máximo sectorial",type:"SOFT",qty:N>0?Math.floor(N/m):0,limit:`${(s.maxSectorNav*100).toFixed(0)}% NAV`},{id:"rbucket",label:`Risk Budget ${e.toUpperCase()}`,type:"HARD",qty:v>0?Math.floor(v/O):0,limit:`${A(v)} restante (${(v/b*100).toFixed(2)}% NAV)`},{id:"rglobal",label:"Risk Budget global",type:"HARD",qty:z>0?Math.floor(z/O):0,limit:`${A(z)} restante (${(s.portRisk*100).toFixed(0)}% NAV)`}],k=H.filter($=>$.type==="HARD").map($=>$.qty),I=Math.max(0,Math.min(...k)),U=[...H].sort(($,q)=>$.qty-q.qty)[0],G=[{rule:"Stop válido (dirección)",type:"HARD",result:"PASS",note:`${y.toUpperCase()}: stop correcto`},{rule:"Capital bucket disponible",type:"HARD",result:P>=m?"PASS":"FAIL",note:A(P)},{rule:"Cash disponible real",type:"HARD",result:c>=m?"PASS":"FAIL",note:A(c)},{rule:"Risk Budget global",type:"HARD",result:z>=O?"PASS":"FAIL",note:`${(z/b*100).toFixed(2)}% NAV disponible`},{rule:`Risk Budget ${e.toUpperCase()}`,type:"HARD",result:v>=O?"PASS":"FAIL",note:`${(v/b*100).toFixed(2)}% NAV disponible`},{rule:"Límite por activo",type:"HARD",result:D>=m?"PASS":"FAIL",note:A(D)},{rule:"Límite sectorial",type:"SOFT",result:N>=m?"PASS":"WARN",note:A(N)},{rule:"Drawdown scaling",type:"INFO",result:i<1?"WARN":"PASS",note:`×${i.toFixed(2)} · base ${(s.tradeRisk*100).toFixed(2)}% → efectivo ${(s.tradeRisk*i*100).toFixed(2)}%`},{rule:"Posición > 0 acciones",type:"HARD",result:I>0?"PASS":"FAIL",note:I+" acc."}],tt=G.some($=>$.type==="HARD"&&$.result==="FAIL"),_=G.some($=>$.result==="WARN"),Q=!tt&&I>0,X=Q?"var(--teal)":_?"var(--amber)":"var(--red)",Dt=Q?"✓ AUTORIZADO":_?"⚠ AUTORIZADO CON WARNINGS":"✗ BLOQUEADO",j=I*m,K=I*O,st=b>0?K/b:0,vt=b>0?j/b:0,Ot=S>0?j/S:0,ut=c-j,It=(C.invested||0)+j,qt=x+K,Vt=(h[e]||0)+j,Nt=(g[p]||0)+j;n.innerHTML=`
    <div style="text-align:center;padding:8px 0 16px;">
      <div style="font-family:var(--serif);font-size:48px;font-weight:600;font-style:italic;color:${X};">${I}</div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:2px;">acciones ${y.toUpperCase()}</div>
      <div style="margin-top:8px;display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;background:${X}18;border:1px solid ${X}44;">
        <span style="font-family:var(--mono);font-size:10px;font-weight:700;color:${X};">${Dt}</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">
      ${[["Capital",A(j)],["Riesgo inicial",A(K)],["Riesgo % NAV",(st*100).toFixed(2)+"%"],["% Bucket",(Ot*100).toFixed(1)+"%"],["% NAV",(vt*100).toFixed(1)+"%"],["DD mult.","×"+i.toFixed(2)],["Regla limitante",U.label],["Policy v.",s.version.slice(0,10)]].map(([$,q])=>`<div style="background:var(--surface2);border-radius:6px;padding:7px 10px;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:2px;">${$}</div>
          <div style="font-family:var(--mono);font-size:11px;font-weight:700;word-break:break-word;">${q}</div>
        </div>`).join("")}
    </div>`,d.innerHTML=`
    <!-- Waterfall -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Waterfall de Restricciones</div><div class="mt-sdiv-line"></div></div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <div class="mt-wf-row mt-wf-head"><span>Restricción</span><span style="text-align:right;">Máx.</span><span>Límite</span><span>Tipo</span><span style="text-align:right;">Estado</span></div>
      ${H.map($=>{const q=$.id===U.id,W=$.qty===0?"mt-fail":q?"mt-warn":"mt-pass",nt=$.qty===0?"FAIL":q?"LIMITA":"OK",lt=$.type==="HARD"?"mt-hard":$.type==="SOFT"?"mt-soft":"mt-info";return`<div class="mt-wf-row${q?" limiting":""}">
          <span style="font-size:11px;color:${q?"var(--amber)":"var(--text2)"};">${$.label}</span>
          <span style="font-family:var(--mono);font-size:13px;font-weight:700;text-align:right;color:${$.qty===0?"var(--red)":q?"var(--amber)":"var(--text1)"};">${$.qty}</span>
          <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">${$.limit}</span>
          <span class="mt-badge ${lt}">${$.type}</span>
          <span class="mt-badge ${W}" style="text-align:center;">${nt}</span>
        </div>`}).join("")}
      <div class="mt-wf-row" style="background:rgba(64,217,192,0.04);border-top:1px solid var(--border);">
        <span style="font-size:12px;font-weight:700;">RESULTADO FINAL</span>
        <span style="font-family:var(--mono);font-size:16px;font-weight:700;text-align:right;color:${X};">${I}</span>
        <span style="font-family:var(--mono);font-size:11px;color:var(--text2);">${A(j)}</span>
        <span></span>
        <span class="mt-badge ${Q?"mt-pass":_?"mt-warn":"mt-fail"}" style="text-align:center;">${Q?"AUTORIZADO":"BLOQUEADO"}</span>
      </div>
    </div>

    <!-- Before / After -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Cartera Before → After</div><div class="mt-sdiv-line"></div></div>
    <div class="mt-ba-grid">
      <div class="mt-ba-col">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Antes</div>
        ${[["NAV",A(b)],["Cash",A(c)],["Invertido",A(C.invested||0)],["Riesgo Abierto",A(x)],["Bucket "+e.toUpperCase(),A(h[e]||0)],["Sector",A(g[p]||0)]].map(([$,q])=>`<div class="mt-ba-row"><span style="font-size:10px;color:var(--text3);">${$}</span><span style="font-family:var(--mono);font-size:11px;font-weight:700;">${q}</span></div>`).join("")}
      </div>
      <div style="display:flex;align-items:center;justify-content:center;color:var(--text3);">→</div>
      <div class="mt-ba-col" style="border:1px solid rgba(64,217,192,0.2);">
        <div style="font-family:var(--mono);font-size:9px;color:var(--teal);text-transform:uppercase;margin-bottom:8px;">Después</div>
        ${[["NAV",b,0],["Cash",ut,ut-c],["Invertido",It,j],["Riesgo",qt,K],["Bucket",Vt,j],["Sector",Nt,j]].map(([$,q,W])=>{const nt=W===0?"mt-delta-nu":W<0?"mt-delta-dn":"mt-delta-up",lt=W===0?"":W>0?"+":"";return`<div class="mt-ba-row">
            <span style="font-size:10px;color:var(--text3);">${$}</span>
            <span style="font-family:var(--mono);font-size:11px;font-weight:700;">${A(q)} ${W!==0?`<span class="mt-delta ${nt}">${lt}${A(W)}</span>`:""}</span>
          </div>`}).join("")}
      </div>
    </div>

    <!-- Pre-Trade Check -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Pre-Trade Check</div><div class="mt-sdiv-line"></div></div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      ${G.map($=>{const q=$.result==="PASS"?"mt-pass":$.result==="WARN"?"mt-warn":"mt-fail",W=$.type==="HARD"?"mt-hard":$.type==="SOFT"?"mt-soft":"mt-info";return`<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:8px 14px;border-bottom:1px solid var(--border);">
          <span style="font-size:11px;color:var(--text2);">${$.rule}</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--text3);">${$.note}</span>
          <span class="mt-badge ${W}">${$.type}</span>
          <span class="mt-badge ${q}">${$.result}</span>
        </div>`}).join("")}
    </div>`;const Ut=tt?"BLOQUEADO":_?"WARN":"AUTORIZADO",xt={ticker:f,bucket:e,side:y,sector:p,referencePrice:m,referenceStop:r,authorizedShares:I,authorizedCapital:j,estimatedRiskEUR:K,estimatedRiskPctNAV:st,capInv:j,initRiskE:K,initRiskP:st,pctNav:vt,ddMult:i,limitingRule:U.label,finalStatus:Ut,policyVersion:s.version,nav:C.nav,sizingTimestamp:new Date().toISOString(),preTradeChecks:G.map($=>({rule:$.rule,result:$.result,type:$.type}))},rt=await pe(xt).catch(()=>null),jt=rt||"local_"+Date.now();if(Q){const $=document.createElement("div");$.style.cssText="margin-top:16px;text-align:center;",$.innerHTML=`
      <button class="btn btn-primary" id="mt-sz-exec-btn"
        style="padding:11px 28px;font-size:12px;font-weight:700;width:100%;">
        📋 Registrar ejecución en IBKR
      </button>
      <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:6px;">
        Autorización válida ${s.authorizationTTLhours||24}h${rt?" · ID: "+rt.slice(0,8)+"…":""}
      </div>`,n.appendChild($),$.querySelector("#mt-sz-exec-btn").addEventListener("click",()=>{me(a,xt,jt)})}const ft=wrap==null?void 0:wrap.querySelector("#mt-proposals-list");ft&&setTimeout(()=>mt(ft),600)}async function pe(a){try{const t=it();if(!t)return null;const f=(s.authorizationTTLhours||24)*3600*1e3,e=new Date(Date.now()+f).toISOString();return(await _t(Ct(pt,"users",t.uid,"trade_proposals"),{...a,timestamp:Yt(),expiresAt:e,status:a.finalStatus==="AUTORIZADO"?"AUTHORIZED":"BLOCKED"})).id}catch(t){return console.warn("saveProposal:",t.message),null}}function me(a,t,f){const e=document.createElement("div");e.id="mt-exec-overlay",e.style.cssText="position:fixed;inset:0;background:rgba(4,14,14,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";const y=new Date().toISOString().slice(0,10),p=t.side==="long"?"LONG":"SHORT",m=t.side==="long";e.innerHTML=`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px 28px;max-width:640px;width:100%;max-height:90vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;">Registrar ejecución IBKR</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;">${t.ticker} · ${p} · ${t.bucket.toUpperCase()} · ID ${f.slice(0,8)}…</div>
        </div>
        <button id="mt-exec-close" style="background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:20px;padding:4px;">✕</button>
      </div>
      <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;margin-bottom:16px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Autorización Position Sizing</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          ${[["Ticker",t.ticker],["Dirección",p],["Bucket",t.bucket.toUpperCase()],["Acciones autorizadas",t.authorizedShares],["Precio referencia","$"+(t.referencePrice||0).toFixed(2)],["Stop sizing","$"+(t.referenceStop||0).toFixed(2)],["Riesgo estimado",A(t.estimatedRiskEUR||0)],["% NAV",((t.estimatedRiskPctNAV||0)*100).toFixed(2)+"%"],["Policy v.",t.policyVersion]].map(([r,n])=>'<div><div style="font-family:var(--mono);font-size:8px;color:var(--text3);">'+r+'</div><div style="font-family:var(--mono);font-size:11px;font-weight:700;margin-top:2px;">'+n+"</div></div>").join("")}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
        <div class="mt-field"><label>Acciones ejecutadas *</label>
          <input type="number" id="mt-exec-shares" class="mt-input" value="${t.authorizedShares}" min="1" max="${t.authorizedShares}">
          <div style="font-size:9px;color:var(--text3);margin-top:2px;">Máx. autorizado: ${t.authorizedShares}</div>
        </div>
        <div class="mt-field"><label>Precio medio IBKR *</label>
          <input type="number" id="mt-exec-price" class="mt-input" value="${(t.referencePrice||0).toFixed(2)}" step="0.01">
        </div>
        <div class="mt-field"><label>Fecha de ejecución *</label>
          <input type="date" id="mt-exec-date" class="mt-input" value="${y}">
        </div>
        <div class="mt-field"><label>Stop inicial definitivo</label>
          <input type="number" id="mt-exec-stop" class="mt-input" value="${(t.referenceStop||0).toFixed(2)}" step="0.01">
        </div>
        <div class="mt-field"><label>Tipo de stop</label>
          <select id="mt-exec-stoptype" class="mt-select">
            <option value="diario">EMA10 Diario</option>
            <option value="semanal">EMA10 Semanal</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div class="mt-field"><label>Notas</label>
          <input type="text" id="mt-exec-notas" class="mt-input" placeholder="Contexto de la ejecución...">
        </div>
      </div>
      <div id="mt-exec-error" style="display:none;background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.3);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-family:var(--mono);font-size:11px;color:var(--red);"></div>
      <div id="mt-exec-comparison" style="margin-bottom:14px;"></div>
      <div style="display:flex;gap:10px;">
        <button class="btn" id="mt-exec-preview-btn" style="flex:1;">Vista previa</button>
        <button class="btn btn-primary" id="mt-exec-confirm-btn" style="flex:1;display:none;">✓ Confirmar y crear posición</button>
      </div>
    </div>`,document.body.appendChild(e),e.querySelector("#mt-exec-close").addEventListener("click",()=>e.remove()),e.addEventListener("click",r=>{r.target===e&&e.remove()}),e.querySelector("#mt-exec-preview-btn").addEventListener("click",()=>{const r=parseInt(e.querySelector("#mt-exec-shares").value)||0,n=parseFloat(e.querySelector("#mt-exec-price").value)||0,d=parseFloat(e.querySelector("#mt-exec-stop").value)||t.referenceStop||0,u=e.querySelector("#mt-exec-error");if(r>t.authorizedShares){u.textContent="ERROR — las acciones ejecutadas ("+r+") superan el máximo autorizado ("+t.authorizedShares+").",u.style.display="block",e.querySelector("#mt-exec-confirm-btn").style.display="none";return}if(!r||r<=0){u.textContent="Introduce las acciones ejecutadas.",u.style.display="block";return}if(!n||n<=0){u.textContent="Introduce el precio medio de IBKR.",u.style.display="block";return}u.style.display="none";const b=(C==null?void 0:C.nav)||0,h=(m?Math.max(0,n-(d||0)):Math.max(0,(d||0)-n))*r,g=b>0?h/b:0,o=m?Math.max(0,(d||0)<n?0:(n-(d||0))*r):Math.max(0,(d||0)>n?0:((d||0)-n)*r),x=n/(t.referencePrice||n)-1,l=m?x>0?"var(--red)":"var(--green)":x<0?"var(--red)":"var(--green)",i=((C==null?void 0:C.positions)||[]).filter(F=>F.bucket===t.bucket).reduce((F,D)=>F+(D.capitalAtRisk||0),0),R=((C==null?void 0:C.positions)||[]).reduce((F,D)=>F+(D.capitalAtRisk||0),0),S=t.bucket==="core"?s.coreRisk:s.satRisk,L=R+o,P=i+o,M=b>0?L/b:0,T=b>0?P/b:0,v=(F,D)=>F>D?"BREACH":F>D*.9?"WARN":"PASS",E=F=>F==="BREACH"?"var(--red)":F==="WARN"?"var(--amber)":"var(--green)",z=v(M,s.portRisk),w=v(T,S),O=z==="BREACH"||w==="BREACH"?"BREACH":z==="WARN"||w==="WARN"?"WARN":"PASS",V=E(O);e.querySelector("#mt-exec-comparison").innerHTML='<div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;margin-bottom:8px;">Comparativa autorización vs ejecución</div><table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px;"><thead><tr style="border-bottom:1px solid var(--border);"><th style="font-family:var(--mono);font-size:9px;color:var(--text3);padding:6px 10px;text-align:left;">Métrica</th><th style="font-family:var(--mono);font-size:9px;color:var(--text3);padding:6px 10px;text-align:right;">Autorizado</th><th style="font-family:var(--mono);font-size:9px;color:var(--text3);padding:6px 10px;text-align:right;">Ejecutado</th></tr></thead><tbody>'+[["Acciones",t.authorizedShares,r],["Precio","$"+(t.referencePrice||0).toFixed(2),"$"+n.toFixed(2)],["Capital",A(t.authorizedCapital||0),A(r*n)],["Riesgo €",A(t.estimatedRiskEUR||0),A(h)],["Riesgo %NAV",((t.estimatedRiskPctNAV||0)*100).toFixed(2)+"%",(g*100).toFixed(2)+"%"],["Slippage","—",'<span style="color:'+l+';">'+(x>=0?"+":"")+(x*100).toFixed(2)+"%</span>"]].map(([F,D,N])=>'<tr style="border-bottom:1px solid var(--border);"><td style="padding:7px 10px;">'+F+'</td><td style="padding:7px 10px;text-align:right;font-family:var(--mono);color:var(--text3);">'+D+'</td><td style="padding:7px 10px;text-align:right;font-family:var(--mono);font-weight:700;">'+N+"</td></tr>").join("")+'</tbody></table><div style="background:'+V+"12;border:1px solid "+V+'33;border-radius:8px;padding:12px 14px;"><div style="font-family:var(--mono);font-size:10px;font-weight:700;color:'+V+';margin-bottom:6px;">'+O+" — "+(O==="PASS"?"Ejecución dentro de los límites autorizados.":O==="WARN"?"La ejecución ha empeorado métricas pero sigue dentro de límites.":"La ejecución provoca incumplimiento de una o más reglas HARD.")+'</div><div style="font-family:var(--mono);font-size:9px;color:var(--text2);line-height:1.6;">Risk Budget global: <span style="color:'+E(z)+';">'+(M*100).toFixed(2)+"% / "+(s.portRisk*100).toFixed(0)+"% → "+z+"</span><br>Risk Budget "+t.bucket.toUpperCase()+': <span style="color:'+E(w)+';">'+(T*100).toFixed(2)+"% / "+(S*100).toFixed(0)+"% → "+w+'</span></div></div><div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:8px;">La posición se registrará aunque exista BREACH. ETHAN documenta la desviación para auditoría.</div>',e._execData={execShares:r,execPrice:n,execStop:d,actualRiskEUR:h,actualRiskPct:g,ptStatus:O,slippage:x,capitalAtRiskReal:o},e.querySelector("#mt-exec-confirm-btn").style.display="block"}),e.querySelector("#mt-exec-confirm-btn").addEventListener("click",async()=>{const r=e._execData;if(!r)return;const n=e.querySelector("#mt-exec-date").value||y,d=e.querySelector("#mt-exec-stoptype").value,u=e.querySelector("#mt-exec-notas").value,b=parseFloat(e.querySelector("#mt-exec-stop").value)||t.referenceStop,c=e.querySelector("#mt-exec-confirm-btn");c.textContent="Registrando…",c.disabled=!0;try{const h=await B.get("ethan_positions")||[],g={ticker:t.ticker,direction:t.side==="long"?"alcista":"bajista",bucket:t.bucket,sector:t.sector||"",shares:r.execShares,entry:r.execPrice,cost:r.execShares*r.execPrice,entryDate:n,initialStop:b,activeStop:b,stopType:d,notas:u,referencePrice:t.referencePrice,referenceStop:t.referenceStop,authorizedShares:t.authorizedShares,executedShares:r.execShares,estimatedRiskEUR:t.estimatedRiskEUR,estimatedRiskPctNAV:t.estimatedRiskPctNAV,actualRiskEUR:r.actualRiskEUR,actualRiskPctNAV:r.actualRiskPct,policyVersion:t.policyVersion,sizingTimestamp:t.sizingTimestamp,executionTimestamp:new Date().toISOString(),limitingRule:t.limitingRule,executionStatus:r.ptStatus,source:"position_sizing",sizingId:f,addedAt:Date.now()};h.push(g),await B.set("ethan_positions",h),await ve(f,{executedShares:r.execShares,executionPrice:r.execPrice,executionTimestamp:new Date().toISOString(),positionId:t.ticker+"_"+n,executionStatus:r.ptStatus}),await ct(),at(a);const o=a.querySelector("#mt-proposals-list");o&&await mt(o),e.remove();const x=a.querySelector("#mt-sz-exec-btn");x&&(x.textContent="✓ Ejecución registrada",x.disabled=!0,x.style.color="var(--green)")}catch(h){c.textContent="✓ Confirmar y crear posición",c.disabled=!1;const g=e.querySelector("#mt-exec-error");g.textContent="Error al guardar: "+h.message,g.style.display="block"}})}async function ve(a,t){try{const f=it();if(!f||!a)return;await Kt(Qt(pt,"users",f.uid,"trade_proposals",a),{status:"EXECUTED",executedShares:t.executedShares,executionPrice:t.executionPrice,executionTimestamp:t.executionTimestamp,positionId:t.positionId,executionStatus:t.executionStatus})}catch(f){console.warn("markProposalExecuted:",f.message)}}async function mt(a){try{const t=it();if(!t)return;const f=Bt(Ct(pt,"users",t.uid,"trade_proposals"),Ht("timestamp","desc"),Wt(10)),y=(await Gt(f)).docs.map(p=>({id:p.id,...p.data()}));a.innerHTML=y.length?y.map(p=>{var n,d,u,b,c;const m=p.finalStatus==="PASS"?"mt-pass":p.finalStatus==="WARN"?"mt-warn":"mt-fail",r=((u=(d=(n=p.timestamp)==null?void 0:n.toDate)==null?void 0:d.call(n))==null?void 0:u.toLocaleString("es-ES"))||"—";return`<div class="mt-prop-row">
            <span class="mt-badge ${m}">${p.finalStatus}</span>
            <div>
              <div style="font-weight:700;">${p.ticker||"—"} ${(p.side||"").toUpperCase()} · ${p.qtyFinal||0} acc. · ${(p.bucket||"").toUpperCase()}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:2px;">$${((b=p.entry)==null?void 0:b.toFixed(2))||"—"} → stop $${((c=p.stop)==null?void 0:c.toFixed(2))||"—"} · ${p.limitingRule||"—"} · v${p.policyVersion||"—"}</div>
            </div>
            <div style="text-align:right;font-family:var(--mono);font-size:11px;">${p.capInv?A(p.capInv):"—"}</div>
            <div style="text-align:right;font-family:var(--mono);font-size:10px;color:var(--red);">${p.initRiskE?A(p.initRiskE):"—"}</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${r}</div>
          </div>`}).join(""):'<div style="text-align:center;padding:24px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin propuestas registradas</div>'}catch(t){console.warn("loadProposals:",t.message)}}async function ge(a,{actionsSlot:t,savedState:f}={}){var n,d,u,b,c,h,g;if(!document.getElementById("mt-css")){const o=document.createElement("style");o.id="mt-css",o.textContent=Xt,document.head.appendChild(o)}a.innerHTML='<div id="mt-wrap"><div style="display:flex;align-items:center;gap:10px;padding:40px 20px;font-family:var(--mono);font-size:11px;color:var(--text3);"><div class="mt-loader-ring"></div>Cargando ETHAN Motor...</div></div>',await ct();const e=a.querySelector("#mt-wrap");e.innerHTML=`
    <div class="mt-tabs">
      <button class="mt-tab active" data-tab="state">📊 Portfolio State</button>
      <button class="mt-tab" data-tab="allocation">🎯 Asset Allocation</button>
      <button class="mt-tab" data-tab="sizing">📐 Position Sizing</button>
      <button class="mt-tab" data-tab="risk">⚡ Risk Budget</button>
      <button class="mt-tab" data-tab="params">⚙️ Parámetros</button>
    </div>

    <!-- PORTFOLIO STATE -->
    <div class="mt-panel active" id="mt-panel-state">
      <div class="mt-strip">
        <div class="mt-cell"><div class="mt-lbl">NAV Total</div><div class="mt-val" id="mt-nav">—</div><div class="mt-sub" id="mt-sub-nav">—</div></div>
        <div class="mt-cell"><div class="mt-lbl">Cash Disponible</div><div class="mt-val" id="mt-cash">—</div><div class="mt-sub" id="mt-sub-cash">—</div></div>
        <div class="mt-cell"><div class="mt-lbl">Capital Invertido</div><div class="mt-val" id="mt-invested">—</div><div class="mt-sub" id="mt-sub-invested">—</div></div>
        <div class="mt-cell"><div class="mt-lbl">P&L No Realizado</div><div class="mt-val" id="mt-unreal">—</div><div class="mt-sub">Posiciones abiertas</div></div>
        <div class="mt-cell"><div class="mt-lbl">Drawdown Actual</div><div class="mt-val" id="mt-dd">—</div><div class="mt-sub" id="mt-sub-dd">—</div></div>
        <div class="mt-cell"><div class="mt-lbl">Riesgo Abierto</div><div class="mt-val" id="mt-risk">—</div><div class="mt-sub" id="mt-sub-risk">—</div></div>
      </div>
      <div class="mt-g2 mb12">
        <div class="mt-card"><div class="mt-card-title">Posiciones Abiertas</div><div id="mt-positions"></div></div>
        <div>
          <div class="mt-card mb12"><div class="mt-card-title">Exposición por Bucket</div><div id="mt-buckets"></div></div>
          <div class="mt-card"><div class="mt-card-title">Exposición por Sector</div><div id="mt-sectors"></div></div>
        </div>
      </div>
      <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-align:right;">Valoración: <span id="mt-timestamp">—</span></div>
    </div>

    <!-- ASSET ALLOCATION -->
    <div class="mt-panel" id="mt-panel-allocation">

      <!-- Subpestañas AA -->
      <div style="display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:16px;">
        <button class="mt-aa-subtab active" data-aatab="overview" style="padding:8px 16px;background:transparent;border:none;color:var(--teal);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid var(--teal);font-family:var(--sans);">📊 Overview</button>
        <button class="mt-aa-subtab" data-aatab="core" style="padding:8px 16px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent;font-family:var(--sans);">🎯 CORE</button>
        <button class="mt-aa-subtab" data-aatab="sat" style="padding:8px 16px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent;font-family:var(--sans);">🛰 SATÉLITE</button>
      </div>

      <!-- OVERVIEW -->
      <div class="mt-aa-subpanel active" id="mt-aa-panel-overview">
        <div class="mt-sdiv"><div class="mt-sdiv-lbl">Budget de Capital</div><div class="mt-sdiv-line"></div></div>
        <div class="mt-g2 mb12">
          ${["core","sat"].map(o=>`<div class="mt-card">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;">
                <div style="font-family:var(--serif);font-size:18px;font-style:italic;font-weight:600;color:${o==="core"?"var(--teal)":"var(--purple)"};">${o==="core"?"CORE":"SATÉLITE"}</div>
                <span id="mt-${o}-tgt" style="font-family:var(--mono);font-size:10px;color:var(--text3);">—</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
                <div><div class="mt-lbl">Budget</div><div class="mt-val" id="mt-${o}-budget" style="font-size:16px;">—</div></div>
                <div><div class="mt-lbl">Invertido</div><div class="mt-val" id="mt-${o}-inv" style="font-size:16px;color:var(--blue);">—</div></div>
                <div><div class="mt-lbl">Disponible</div><div class="mt-val" id="mt-${o}-avail" style="font-size:16px;">—</div></div>
              </div>
              <div class="mt-bar-track"><div class="mt-bar-fill" id="mt-${o}-bar" style="width:0%;"></div></div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;text-align:right;" id="mt-${o}-occ">—</div>
            </div>`).join("")}
        </div>
        <div class="mt-sdiv"><div class="mt-sdiv-lbl">Límites de Exposición</div><div class="mt-sdiv-line"></div></div>
        <div class="mt-card mb12">
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="border-bottom:1px solid var(--border);">
              ${["Dimensión","Concepto","Límite máx.","Actual","Estado"].map((o,x)=>`<th style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:8px 12px;text-align:${x===0?"left":"right"};">${o}</th>`).join("")}
            </tr></thead>
            <tbody id="mt-alloc-table"></tbody>
          </table>
        </div>
        <div class="mt-sdiv"><div class="mt-sdiv-lbl">Cash Táctico</div><div class="mt-sdiv-line"></div></div>
        <div class="mt-g3">
          <div class="mt-kpi"><div class="mt-kpi-lbl">Cash Estructural</div><div class="mt-kpi-val" id="mt-cash-struct">—</div><div class="mt-kpi-sub">No asignado a ningún bucket</div></div>
          <div class="mt-kpi"><div class="mt-kpi-lbl">Cash Táctico CORE</div><div class="mt-kpi-val" id="mt-cash-core" style="color:var(--teal)">—</div><div class="mt-kpi-sub">Budget CORE sin desplegar</div></div>
          <div class="mt-kpi"><div class="mt-kpi-lbl">Cash Táctico Satélite</div><div class="mt-kpi-val" id="mt-cash-sat" style="color:var(--purple)">—</div><div class="mt-kpi-sub">Budget Satélite sin desplegar</div></div>
        </div>
      </div>

      <!-- CORE -->
      <div class="mt-aa-subpanel" id="mt-aa-panel-core" style="display:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">
            Universo: <strong style="color:var(--text2);" id="mt-aa-core-universe-label">—</strong> · Score mínimo: <strong style="color:var(--text2);" id="mt-aa-core-threshold-label">—</strong>/8 · Budget: <strong style="color:var(--teal);" id="mt-aa-core-budget-label">—</strong>
          </div>
          <button class="btn btn-primary" id="mt-aa-run-btn" style="font-size:10px;padding:6px 14px;">▶ Calcular señales</button>
        </div>
        <div id="mt-aa-core-results" style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:40px;text-align:center;">
          Pulsa Calcular señales para ejecutar el motor CORE.
        </div>
      </div>

      <!-- SATÉLITE -->
      <div class="mt-aa-subpanel" id="mt-aa-panel-sat" style="display:none;">
        <div style="background:var(--surface2);border-radius:10px;padding:14px 16px;margin-bottom:14px;">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <input type="text" id="mt-aa-sat-input" class="mt-input" placeholder="EXPD, XLI, XLV, VLO (separados por coma)" style="flex:1;text-transform:uppercase;">
            <button class="btn btn-primary" id="mt-aa-sat-btn" style="white-space:nowrap;">▶ Calcular pesos</button>
          </div>
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Inversa de volatilidad · 100% invertido · Tope <span id="mt-aa-sat-maxw-label">${Math.round((s.satMaxWeight??.4)*100)}%</span> por activo · Budget SAT: <span id="mt-aa-sat-budget-label">—</span></div>
        </div>
        <div id="mt-aa-sat-results" style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:40px;text-align:center;">
          Introduce tickers y pulsa Calcular pesos.
        </div>
      </div>
    </div>

    <!-- POSITION SIZING -->
    <div class="mt-panel" id="mt-panel-sizing">
      <div class="mt-g2 mb12">
        <div class="mt-card">
          <div class="mt-card-title">Propuesta de Operación</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="mt-field"><label>Ticker</label><input type="text" id="mt-sz-ticker" class="mt-input" placeholder="AAPL" style="text-transform:uppercase;"></div>
            <div class="mt-field"><label>Bucket</label><select id="mt-sz-bucket" class="mt-select"><option value="core">CORE</option><option value="sat">SATÉLITE</option></select></div>
            <div class="mt-field"><label>Dirección</label><select id="mt-sz-side" class="mt-select"><option value="long">LONG</option><option value="short">SHORT</option></select></div>
            <div class="mt-field"><label>Sector</label>
              <select id="mt-sz-sector" class="mt-select">
                <option value="tech">Tecnología</option><option value="health">Healthcare</option>
                <option value="energy">Energía</option><option value="finance">Financiero</option>
                <option value="consumer">Consumo Disc.</option><option value="industrial">Industrial</option>
                <option value="materials">Materiales</option><option value="utilities">Utilities</option>
                <option value="realestate">Real Estate</option><option value="comm">Comunicación</option>
                <option value="staples">Consumo Básico</option><option value="commodities">Commodities</option>
              </select>
            </div>
            <div class="mt-field"><label>Precio Entrada</label><input type="number" id="mt-sz-entry" class="mt-input" value="100" step="0.01"></div>
            <div class="mt-field"><label>Stop Loss</label><input type="number" id="mt-sz-stop" class="mt-input" value="93" step="0.01"></div>
          </div>
          <button class="btn btn-primary" id="mt-sz-btn" style="width:100%;margin-top:12px;">Calcular Posición Autorizada</button>
        </div>
        <div class="mt-card"><div class="mt-card-title">Resultado del Motor</div>
          <div id="mt-sz-result" style="text-align:center;padding:40px 20px;font-family:var(--mono);font-size:11px;color:var(--text3);">Introduce los datos y pulsa Calcular</div>
        </div>
      </div>
      <div class="mt-card"><div class="mt-card-title">Waterfall · Before/After · Pre-Trade Check</div><div id="mt-sz-waterfall"></div></div>

      <div class="mt-card" style="margin-top:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div class="mt-card-title" style="margin-bottom:0;">Audit Log · Historial de decisiones</div>
          <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">Últimas 10 · AUTORIZADO y BLOQUEADO</span>
        </div>
        <div id="mt-proposals-list"><div style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:16px 0;">Sin registros aún.</div></div>
      </div>
    </div>

    <!-- RISK BUDGET -->
    <div class="mt-panel" id="mt-panel-risk">
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Riesgo Global</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-g3 mb12">
        <div class="mt-kpi"><div class="mt-kpi-lbl">Riesgo Global Usado</div><div class="mt-kpi-val" id="mt-rb-global-used">—</div><div class="mt-kpi-sub" id="mt-rb-global-limit">—</div><div class="mt-bar-track" style="margin-top:8px;"><div class="mt-bar-fill" id="mt-rb-global-bar"></div></div></div>
        <div class="mt-kpi"><div class="mt-kpi-lbl">Riesgo Disponible</div><div class="mt-kpi-val" id="mt-rb-global-avail" style="color:var(--green)">—</div><div class="mt-kpi-sub">Para nuevas posiciones</div></div>
        <div class="mt-kpi"><div class="mt-kpi-lbl">Riesgo/Op. Efectivo</div><div class="mt-kpi-val" id="mt-rb-per-trade" style="color:var(--amber)">—</div><div class="mt-kpi-sub" id="mt-rb-dd-mult">—</div></div>
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Riesgo por Bucket</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-g2 mb12">
        ${["core","sat"].map(o=>{const x=o==="core"?"var(--teal)":"var(--purple)";return`<div class="mt-kpi">
            <div class="mt-kpi-lbl" style="color:${x};">${o.toUpperCase()}</div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;">
              <div><div style="font-size:9px;color:var(--text3);">Usado</div><div class="mt-kpi-val" id="mt-rb-${o}-used" style="font-size:18px;">—</div></div>
              <div style="text-align:right;"><div style="font-size:9px;color:var(--text3);">Disponible</div><div class="mt-kpi-val" id="mt-rb-${o}-avail" style="font-size:18px;color:var(--green);">—</div></div>
            </div>
            <div class="mt-kpi-sub" id="mt-rb-${o}-limit" style="margin-top:4px;">—</div>
            <div class="mt-bar-track" style="margin-top:6px;"><div class="mt-bar-fill" id="mt-rb-${o}-bar" style="background:${x};"></div></div>
          </div>`}).join("")}
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Drawdown Risk Scaling</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-card mb12">
        <table class="mt-dd-table">
          <thead><tr><th>Drawdown</th><th>Multiplicador</th><th>Riesgo base</th><th>Riesgo efectivo</th><th>Estado</th></tr></thead>
          <tbody id="mt-dd-table"></tbody>
        </table>
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Riesgo por Posición</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-card"><div id="mt-risk-positions"></div></div>
    </div>

    <!-- PARÁMETROS -->
    <div class="mt-panel" id="mt-panel-params">

      <!-- Header Policy Console -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-family:var(--serif);font-size:18px;font-style:italic;color:var(--text1);">Policy Console</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;">
            Política activa: <strong style="color:var(--text2);">v<span id="mt-policy-version">—</span></strong>
            · <span id="mt-policy-updated">—</span>
          </div>
        </div>
        <button class="btn btn-primary" id="mt-params-save" style="padding:9px 20px;">💾 Guardar y versionar</button>
      </div>

      <!-- BLOQUE 1: Asset Allocation -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text2);margin-bottom:14px;">1 · Asset Allocation</div>

        <!-- Slider CORE/SAT -->
        <div style="margin-bottom:16px;">
          <div style="font-size:10px;color:var(--text3);margin-bottom:8px;">Distribución estratégica del NAV</div>
          <div style="display:flex;border-radius:6px;overflow:hidden;height:32px;margin-bottom:8px;">
            <div id="mt-p-core-bar" style="background:rgba(64,217,192,0.25);display:flex;align-items:center;padding:0 12px;transition:width 0.3s;min-width:80px;">
              <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--teal);">CORE <span id="mt-p-core-bar-pct">50</span>%</span>
            </div>
            <div id="mt-p-sat-bar" style="background:rgba(167,139,250,0.2);display:flex;align-items:center;justify-content:flex-end;padding:0 12px;flex:1;transition:width 0.3s;min-width:80px;">
              <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--purple);"><span id="mt-p-sat-bar-pct">50</span>% SAT</span>
            </div>
          </div>
          <input type="range" id="mt-p-core-slider" min="10" max="90" step="5" value="50"
            style="width:100%;accent-color:var(--teal);cursor:pointer;">
          <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;">
            <span>10% CORE mín.</span><span>90% CORE máx.</span>
          </div>
          <!-- Inputs ocultos sincronizados con el slider -->
          <input type="hidden" id="mt-p-core" value="50">
          <input type="hidden" id="mt-p-sat" value="50">
        </div>

        <!-- Límites globales -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="mt-field">
            <label>Máx. por activo (% NAV)</label>
            <input type="number" id="mt-p-asset" class="mt-input" value="20" step="1" min="5" max="50">
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Ningún activo puede superar este % del NAV total.</div>
          </div>
          <div class="mt-field">
            <label>Máx. por sector (% NAV)</label>
            <input type="number" id="mt-p-sector" class="mt-input" value="35" step="5" min="10" max="60">
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Límite de concentración sectorial global.</div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:9px;color:var(--text3);background:var(--surface2);padding:8px 12px;border-radius:6px;line-height:1.6;">
          Los límites son acumulativos. ETHAN aplica siempre la restricción más conservadora entre el límite global y el límite específico del bucket.
        </div>
      </div>

      <!-- BLOQUE 2: Motor CORE -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text2);margin-bottom:14px;">2 · Motor CORE</div>

        <!-- Universo -->
        <div class="mt-field mb12">
          <label>Universo extra (además de VTI · VEU · IEF · BNDX · VNQ · VNQI · GLD · SLV · USO · SPY · HYG · EURUSD=X)</label>
          <input type="text" id="mt-p-core-universe" class="mt-input" placeholder="Tickers adicionales separados por coma, ej: QQQ, IEMG">
          <div style="font-size:9px;color:var(--text3);margin-top:3px;">El universo base es fijo. Añade aquí tickers extra que se tratarán como RV por defecto.</div>
        </div>

        <!-- Reglas de construcción -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div class="mt-field">
            <label>Score mínimo de entrada</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="number" id="mt-p-core-threshold" class="mt-input" value="6" min="0" max="8" step="1">
              <span style="font-family:var(--mono);font-size:11px;color:var(--text3);white-space:nowrap;">/ 8</span>
            </div>
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Señales mínimas para entrar en el portfolio CORE.</div>
          </div>
          <div class="mt-field">
            <label>Peso máximo por activo CORE</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="number" id="mt-p-core-maxw" class="mt-input" value="40" min="10" max="100" step="5">
              <span style="font-family:var(--mono);font-size:11px;color:var(--text3);white-space:nowrap;">% budget</span>
            </div>
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Prevalece el mínimo entre este límite y el límite global de activo.</div>
          </div>
          <div class="mt-field">
            <label>Ventana de volatilidad</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="number" id="mt-p-vol-window" class="mt-input" value="60" min="20" max="252" step="5">
              <span style="font-family:var(--mono);font-size:11px;color:var(--text3);white-space:nowrap;">sesiones</span>
            </div>
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Período para calcular la volatilidad de ponderación.</div>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--surface2);border-radius:6px;">
          <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">Método de ponderación:</span>
          <span style="font-family:var(--mono);font-size:9px;font-weight:700;color:var(--text2);">Inversa de volatilidad</span>
          <span style="font-family:var(--mono);font-size:8px;color:var(--text3);">(único método disponible)</span>
        </div>
      </div>

      <!-- BLOQUE 3: Risk Management -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text2);margin-bottom:14px;">3 · Risk Management</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="mt-field">
            <label>Riesgo base / operación (% NAV)</label>
            <input type="number" id="mt-p-trade" class="mt-input" step="0.25">
            <div style="font-size:9px;color:var(--text3);margin-top:3px;">Capital en riesgo por operación antes del DD scaling.</div>
          </div>
          <div>
            <div style="font-size:9px;color:var(--text3);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Límites de riesgo acumulado</div>
            <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
              <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:10px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">CARTERA</span>
                <input type="number" id="mt-p-port" class="mt-input" step="0.5" style="width:70px;padding:4px 8px;font-size:12px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">% NAV máx.</span>
              </div>
              <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:8px;padding-left:12px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">↳ CORE</span>
                <input type="number" id="mt-p-crisk" class="mt-input" step="0.25" style="width:70px;padding:4px 8px;font-size:12px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">% NAV</span>
              </div>
              <div style="display:flex;align-items:baseline;gap:6px;padding-left:12px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">↳ SAT</span>
                <input type="number" id="mt-p-srisk" class="mt-input" step="0.25" style="width:70px;padding:4px 8px;font-size:12px;">
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">% NAV</span>
              </div>
              <div style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;">
                <div style="font-size:9px;color:var(--text3);margin-bottom:6px;">CORE + SAT no son aditivos: manda el límite de cartera.</div>
                <div id="mt-p-risk-status" style="font-size:9px;color:var(--text2);line-height:1.6;">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOQUE 4: Drawdown Scaling -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text2);margin-bottom:14px;">4 · Drawdown Scaling</div>
        <div style="font-size:10px;color:var(--text3);margin-bottom:12px;">Multiplicador aplicado al riesgo base cuando el fondo está en drawdown.</div>

        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px;">
          ${[{label:"DD 0 – 3%",id:"mt-p-dd1",color:"var(--green)"},{label:"DD 3 – 5%",id:"mt-p-dd2",color:"var(--teal)"},{label:"DD 5 – 8%",id:"mt-p-dd3",color:"var(--amber)"},{label:"DD 8 – 10%",id:"mt-p-dd4",color:"var(--red)"},{label:"DD > 10%",id:"mt-p-dd5",color:"var(--red)"}].map(o=>`
            <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;text-align:center;">
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:6px;">${o.label}</div>
              <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
                <span style="font-family:var(--mono);font-size:13px;color:var(--text3);">×</span>
                <input type="number" id="${o.id}" class="mt-input" step="0.05" style="width:60px;padding:4px 6px;font-size:13px;text-align:center;color:${o.color};">
              </div>
            </div>`).join("")}
        </div>

        <!-- Situación actual dinámica -->
        <div id="mt-p-dd-status" style="background:var(--surface2);border-radius:8px;padding:10px 14px;font-family:var(--mono);font-size:10px;color:var(--text2);">
          —
        </div>
      </div>

      <div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:10px;color:var(--text2);line-height:1.6;">
        ⚠ Guardar crea una nueva versión de política. Todas las propuestas quedan vinculadas a la versión activa en el momento de su cálculo.
      </div>
    </div>`,e.querySelectorAll(".mt-tab").forEach(o=>{o.addEventListener("click",()=>{var x;if(e.querySelectorAll(".mt-tab").forEach(l=>l.classList.remove("active")),e.querySelectorAll(".mt-panel").forEach(l=>l.classList.remove("active")),o.classList.add("active"),(x=e.querySelector(`#mt-panel-${o.dataset.tab}`))==null||x.classList.add("active"),o.dataset.tab==="sizing"){const l=e.querySelector("#mt-proposals-list");l&&mt(l)}})}),e.querySelectorAll(".mt-aa-subtab").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".mt-aa-subtab").forEach(l=>{l.classList.remove("active"),l.style.color="var(--text3)",l.style.borderBottomColor="transparent"}),e.querySelectorAll(".mt-aa-subpanel").forEach(l=>l.style.display="none"),o.classList.add("active"),o.style.color="var(--teal)",o.style.borderBottomColor="var(--teal)";const x=e.querySelector(`#mt-aa-panel-${o.dataset.aatab}`);x&&(x.style.display="block")})});function y(){const o=(C==null?void 0:C.nav)||0,x=e.querySelector("#mt-aa-core-universe-label"),l=e.querySelector("#mt-aa-core-threshold-label"),i=e.querySelector("#mt-aa-core-budget-label"),R=e.querySelector("#mt-aa-sat-budget-label"),S=e.querySelector("#mt-aa-sat-maxw-label");x&&(x.textContent=(s.coreUniverse||["VTI","VEU","IEF","BNDX"]).join(", ")),l&&(l.textContent=s.coreScoreThreshold??6),i&&(i.textContent=A(o*s.corePct)),R&&(R.textContent=A(o*s.satPct)),S&&(S.textContent=Math.round((s.satMaxWeight??.4)*100)+"%")}y();const p=e.querySelector("#mt-p-core-slider");function m(o){const x=100-o,l=e.querySelector("#mt-p-core-bar"),i=e.querySelector("#mt-p-sat-bar");l&&(l.style.width=o+"%"),i&&(i.style.width=x+"%");const R=e.querySelector("#mt-p-core-bar-pct"),S=e.querySelector("#mt-p-sat-bar-pct");R&&(R.textContent=o),S&&(S.textContent=x);const L=e.querySelector("#mt-p-core"),P=e.querySelector("#mt-p-sat");L&&(L.value=o),P&&(P.value=x)}p==null||p.addEventListener("input",()=>m(parseInt(p.value)));function r(){var S;const o=e.querySelector("#mt-p-dd-status");if(!o||!C)return;const x=C.drawdownActual||0,l=ot(x),R=(parseFloat(((S=e.querySelector("#mt-p-trade"))==null?void 0:S.value)||s.tradeRisk*100)*l).toFixed(2);o.innerHTML=`<strong>Situación actual:</strong> DD ${(x*100).toFixed(1)}% → multiplicador <strong>×${l.toFixed(2)}</strong> → riesgo base efectivo <strong style="color:var(--amber);">${R}% NAV</strong>`}return r(),(n=e.querySelector("#mt-p-trade"))==null||n.addEventListener("input",r),(d=e.querySelector("#mt-aa-run-btn"))==null||d.addEventListener("click",()=>{y(),ae(e)}),(u=e.querySelector("#mt-aa-sat-btn"))==null||u.addEventListener("click",async()=>{var P;const x=(((P=e.querySelector("#mt-aa-sat-input"))==null?void 0:P.value)||"").split(",").map(M=>M.trim().toUpperCase()).filter(Boolean);if(!x.length){alert("Introduce al menos un ticker.");return}const l=e.querySelector("#mt-aa-sat-results");l&&(l.innerHTML=`<div class="mt-loader"><div class="mt-loader-ring"></div>Calculando señales Satélite (${x.join(", ")})...</div>`);const i=((C==null?void 0:C.nav)||0)*s.satPct,R=s.satMaxWeight??.4,S=[];for(const M of x)try{const T=await Ft(M),v=Lt(T);S.push({ticker:M,...v})}catch(T){S.push({ticker:M,error:T.message})}const L=Tt(S.filter(M=>!M.error),R,100);ne(e,{satData:S,satPositions:L,satBudget:i,satUniverse:x,nav:(C==null?void 0:C.nav)||0})}),(b=e.querySelector("#mt-aa-sat-input"))==null||b.addEventListener("keydown",o=>{var x;o.key==="Enter"&&((x=e.querySelector("#mt-aa-sat-btn"))==null||x.click())}),(c=e.querySelector("#mt-sz-btn"))==null||c.addEventListener("click",()=>ce(e)),(h=e.querySelector("#mt-params-save"))==null||h.addEventListener("click",async()=>{var V;const o=F=>{var D;return parseFloat((D=e.querySelector("#"+F))==null?void 0:D.value)||0},x=F=>{var D;return(((D=e.querySelector("#"+F))==null?void 0:D.value)||"").split(",").map(N=>N.trim().toUpperCase()).filter(Boolean)},l=o("mt-p-core"),i=100-l,R=o("mt-p-asset")/100,S=o("mt-p-sector")/100,L=o("mt-p-core-maxw")/100,P=o("mt-p-vol-window"),M=o("mt-p-trade")/100,T=o("mt-p-port")/100,v=o("mt-p-crisk")/100,E=o("mt-p-srisk")/100,z=[1,2,3,4,5].map(F=>{var D;return parseFloat((D=e.querySelector(`#mt-p-dd${F}`))==null?void 0:D.value)||0}),w=[];Math.abs(l+i-100)>.1&&w.push("CORE + SAT debe sumar exactamente 100%."),M>T&&w.push(`Riesgo base/op. (${(M*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(T*100).toFixed(2)}%).`),v>T&&w.push(`Riesgo máx. CORE (${(v*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(T*100).toFixed(2)}%).`),E>T&&w.push(`Riesgo máx. SAT (${(E*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(T*100).toFixed(2)}%).`),(L<=0||L>1)&&w.push("Peso máximo CORE debe estar entre 1% y 100%."),R>S&&w.push(`Límite por activo (${(R*100).toFixed(0)}% NAV) no puede superar el límite sectorial (${(S*100).toFixed(0)}% NAV).`),(P<10||P>252)&&w.push("Ventana de volatilidad debe estar entre 10 y 252 sesiones.");for(let F=1;F<z.length;F++)z[F]>z[F-1]+.001&&w.push(`DD Scaling debe ser decreciente: banda ${F+1} (×${z[F]}) > banda ${F} (×${z[F-1]}).`);if(z[0]>1.001&&w.push("El primer multiplicador DD no puede ser mayor que 1."),w.length>0){const F=w.map(H=>`<div style="display:flex;gap:8px;"><span style="color:var(--red);">✗</span><span>${H}</span></div>`).join(""),D=e.querySelector("#mt-params-errors");D&&D.remove();const N=document.createElement("div");N.id="mt-params-errors",N.style.cssText="background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.3);border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:11px;color:var(--text2);line-height:1.8;",N.innerHTML=`<div style="font-weight:700;color:var(--red);margin-bottom:8px;">⚠ Política no válida — no se ha guardado:</div>${F}`,e.querySelector("#mt-params-save").insertAdjacentElement("beforebegin",N);return}(V=e.querySelector("#mt-params-errors"))==null||V.remove(),s.corePct=l/100,s.satPct=i/100,s.maxAssetNav=R,s.maxSectorNav=S,s.coreUniverse=x("mt-p-core-universe"),s.coreScoreThreshold=o("mt-p-core-threshold"),s.coreMaxWeight=L,s.volWindow=P,s.tradeRisk=M,s.portRisk=T,s.coreRisk=v,s.satRisk=E,s.ddScale=z,await B.set(Pt,s),at(e);const O=e.querySelector("#mt-params-save");O&&(O.textContent="✓ Guardado · v"+s.version.slice(0,10),O.style.color="var(--green)",setTimeout(()=>{O.textContent="💾 Guardar y versionar",O.style.color=""},2500))}),t&&(t.innerHTML='<button class="btn" style="font-size:10px;padding:5px 12px;">↻ Actualizar</button>',(g=t.querySelector(".btn"))==null||g.addEventListener("click",async()=>{await ct(),at(e)})),at(e),{destroy(){var o;(o=document.getElementById("mt-css"))==null||o.remove()}}}function ue(a){const t=(g,o)=>{const x=a.querySelector("#"+g);x&&(x.value=o)},f=Math.round(s.corePct*100),e=100-f,y=a.querySelector("#mt-p-core-slider");y&&(y.value=f);const p=a.querySelector("#mt-p-core-bar-pct");p&&(p.textContent=f);const m=a.querySelector("#mt-p-sat-bar-pct");m&&(m.textContent=e);const r=a.querySelector("#mt-p-core-bar");r&&(r.style.width=f+"%");const n=a.querySelector("#mt-p-sat-bar");n&&(n.style.width=e+"%"),t("mt-p-core",f),t("mt-p-sat",e),t("mt-p-asset",(s.maxAssetNav*100).toFixed(0)),t("mt-p-sector",(s.maxSectorNav*100).toFixed(0)),t("mt-p-core-universe",(s.coreUniverse||[]).join(", ")),t("mt-p-core-threshold",s.coreScoreThreshold??6),t("mt-p-core-maxw",((s.coreMaxWeight??.4)*100).toFixed(0)),t("mt-p-vol-window",s.volWindow??60),t("mt-p-ttl",s.authorizationTTLhours??24),t("mt-p-trade",(s.tradeRisk*100).toFixed(2)),t("mt-p-port",(s.portRisk*100).toFixed(0)),t("mt-p-crisk",(s.coreRisk*100).toFixed(2)),t("mt-p-srisk",(s.satRisk*100).toFixed(2)),s.ddScale.forEach((g,o)=>t(`mt-p-dd${o+1}`,g.toFixed(2)));const d=a.querySelector("#mt-policy-version");d&&(d.textContent=s.version);const u=a.querySelector("#mt-policy-updated");u&&(u.textContent=s.updatedAt?new Date(s.updatedAt).toLocaleString("es-ES"):"Sin guardar");const b=a.querySelector("#mt-p-dd-status");if(b&&C){const g=C.drawdownActual||0,o=ot(g),x=s.tradeRisk*100;b.innerHTML=`<strong>Situación actual:</strong> DD ${(g*100).toFixed(1)}% → multiplicador <strong>×${o.toFixed(2)}</strong> → riesgo base efectivo <strong style="color:var(--amber);">${(x*o).toFixed(2)}% NAV</strong>`}const c=a.querySelector("#mt-p-effective-limit");if(c){const g=s.corePct,o=s.coreMaxWeight??.4,x=s.maxAssetNav,l=o*g,i=Math.min(l,x),R=i===x?"límite global":"límite interno CORE",S=(C==null?void 0:C.nav)||0;c.innerHTML=`Límite efectivo por activo CORE: <strong style="color:var(--teal);">${(i*100).toFixed(1)}% NAV</strong> (${A(S*i)}) · manda ${R}`}const h=a.querySelector("#mt-p-risk-status");if(h&&C){const{nav:g,openRisk:o,positions:x}=C,l=g>0?o/g:0,i=x.filter(E=>E.bucket==="core").reduce((E,z)=>E+(z.capitalAtRisk||0),0),R=x.filter(E=>E.bucket==="sat").reduce((E,z)=>E+(z.capitalAtRisk||0),0),S=g>0?i/g:0,L=g>0?R/g:0,P=Math.max(0,s.portRisk-l),M=Math.max(0,s.coreRisk-S),T=Math.max(0,s.satRisk-L),v=(E,z)=>E>z?"var(--red)":E>z*.7?"var(--amber)":"var(--green)";h.innerHTML=`
      Riesgo Abierto cartera: <strong style="color:${v(l,s.portRisk)}">${(l*100).toFixed(2)}%</strong> · disponible: <strong style="color:var(--green);">${(P*100).toFixed(2)}%</strong><br>
      CORE abierto: <strong style="color:${v(S,s.coreRisk)}">${(S*100).toFixed(2)}%</strong> · disponible: <strong>${(M*100).toFixed(2)}%</strong> &nbsp;|&nbsp;
      SAT abierto: <strong style="color:${v(L,s.satRisk)}">${(L*100).toFixed(2)}%</strong> · disponible: <strong>${(T*100).toFixed(2)}%</strong>`}}function at(a){ee(a),le(a),de(a),ue(a)}export{ge as render};
