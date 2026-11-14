import{UserData as at}from"./userdata-DXI1eA65.js";import{s as Tt}from"./index-CgF2jx7D.js";const At="ethan_fondo_v1",Q=100,Vt=[t=>`https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,t=>`https://corsproxy.io/?${encodeURIComponent(t)}`,t=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(t)}`];async function Dt(t,y,k){var m,E,l,d,F;const v=y?Math.floor(new Date(y).getTime()/1e3):Math.floor(Date.now()/1e3)-63072e3,b=Math.floor(k?new Date(k+"T23:59:59").getTime()/1e3:Date.now()/1e3),$=`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&period1=${v}&period2=${b}`;for(const S of Vt)try{const D=await fetch(S($),{signal:(()=>{const T=new AbortController;return setTimeout(()=>T.abort(),12e3),T.signal})()});if(!D.ok)continue;const x=JSON.parse(await D.text()),z=(E=(m=x==null?void 0:x.chart)==null?void 0:m.result)==null?void 0:E[0];if(!z)continue;const W=z.timestamp||[],a=((F=(d=(l=z.indicators)==null?void 0:l.quote)==null?void 0:d[0])==null?void 0:F.close)||[],P=[];return W.forEach((T,A)=>{a[A]!=null&&P.push({date:new Date(T*1e3).toISOString().slice(0,10),close:a[A]})}),P}catch{}throw new Error(`No se pudo obtener histórico de ${t}`)}async function Mt(t,y,k="active"){var $;const v=`ethan_px_hist_${t}`,b=await at.get(v)||{};if(y.forEach(m=>{b[m.date]=m.close}),await at.set(v,b),k==="active"&&y.length>0){const m=[...y].sort((E,l)=>l.date.localeCompare(E.date));await at.set(`ethan_px_latest_${t}`,{close:m[0].close,asOf:m[0].date,prev:(($=m[1])==null?void 0:$.close)||m[0].close})}return Object.keys(b).length}const _=t=>t!=null&&isFinite(t)?(t<0?"-":"")+"€"+Math.abs(t).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}):"—",G=(t,y=2)=>t!=null&&isFinite(t)?(t>=0?"+":"")+t.toFixed(y)+"%":"—",ft=t=>t!=null?t.toFixed(2):"—",It=t=>t?new Date(t+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";async function Ft(){return await at.get(At)}async function Et(t){await at.set(At,t)}function Lt(t,y){return t!=null&&t.participaciones?y/t.participaciones:Q}async function Ot(t,y,k="Capital inicial"){const v=t/Q,b={vlInicial:Q,participaciones:v,creadoEn:y,movimientos:[{date:y,tipo:"inicio",importe:t,vl:Q,participacionesMov:v,participacionesTotal:v,nota:k}]};return await Et(b),b}async function Ct(t,y,k,v,b){let $=await Ft();const m=Lt($,b),E=Math.abs(y)/m,l=t==="aportacion"?$.participaciones+E:$.participaciones-E;if(l<0)throw new Error("Retirada superior al valor del fondo");return $.participaciones=l,$.movimientos=[...$.movimientos||[],{date:k,tipo:t,importe:t==="aportacion"?y:-y,vl:m,participacionesMov:E,participacionesTotal:l,nota:v}],await Et($),$}function Rt(t){if(!(t!=null&&t.length))return null;const y=t.filter(x=>x.pnlPct>0),k=t.filter(x=>x.pnlPct<=0),v=y.length/t.length,b=y.length?y.reduce((x,z)=>x+z.pnlPct,0)/y.length:0,$=k.length?Math.abs(k.reduce((x,z)=>x+z.pnlPct,0)/k.length):0,m=t.reduce((x,z)=>x+(z.pnlAbs||0),0),E=$>0?v*b/((1-v)*$):null,l=v*b/100-(1-v)*$/100,d=$>0?b/$:null,F=t.reduce((x,z)=>x+(z.pnlPct||0),0)/t.length,S=t.filter(x=>x.entryDateISO&&x.exitDateISO),D=S.length?Math.round(S.reduce((x,z)=>x+Math.round((new Date(z.exitDateISO)-new Date(z.entryDateISO))/864e5),0)/S.length):null;return{winRate:v,avgWin:b,avgLoss:$,profitFactor:E,esperanza:l,payoff:d,totalPL:m,avgReturn:F,avgDays:D,n:t.length,hasAbs:t.some(x=>x.pnlAbs)}}async function Bt(t,y,k=[],v=[],b=0){var tt;const $=(t==null?void 0:t.movimientos)||[],m=(tt=$[0])==null?void 0:tt.date,E=new Date().toISOString().slice(0,10),l=m?Math.round((new Date(E)-new Date(m))/864e5):0,d=Math.round(l*252/365),F=(t==null?void 0:t.participaciones)||b/Q,S=(y-Q)/Q,D=l>10?Math.pow(Math.max(1+S,.001),365/l)-1:S,x=[...(k||[]).map(f=>f.ticker),...(v||[]).map(f=>f.ticker)].filter((f,R,K)=>f&&K.indexOf(f)===R),z={};await Promise.all(x.map(async f=>{const R=await at.get(`ethan_px_hist_${f}`);R&&(z[f]=R)}));const W=Object.keys(z).length>0;let a=[];if(W&&m){const f=[];let R=new Date(m);const K=new Date(E);for(;R<=K;){const u=R.toISOString().slice(0,10),O=R.getDay();O!==0&&O!==6&&f.push(u),R.setDate(R.getDate()+1)}f.forEach(u=>{let O=0,Y=0,pt=0,et=!1;if((k||[]).forEach(c=>{!c.exitDateISO||!c.pnlAbs||c.exitDateISO<u&&(pt+=c.pnlAbs)}),(k||[]).forEach(c=>{if(!c.ticker||!c.entryDateISO||!c.exitDateISO||u<c.entryDateISO||u>c.exitDateISO)return;const h=(z[c.ticker]||{})[u];if(!h)return;const I=c.shares||(c.cost&&c.entry?c.cost/c.entry:0);if(!I)return;const J=c.cost||I*c.entry,ot=(c.direction||"alcista")==="bajista"?I*c.entry*2-I*h:I*h;O+=J,Y+=ot,et=!0}),(v||[]).forEach(c=>{if(!c.ticker||!c.entryDate||u<c.entryDate)return;const Z=z[c.ticker]||{},h=u===E?c.currentPrice||c.entry:Z[u]||null;if(!h)return;const I=c.shares||(c.cost&&c.entry?c.cost/c.entry:0);if(!I)return;const J=c.cost||I*c.entry,ot=(c.direction||"alcista")==="bajista"?I*c.entry*2-I*h:I*h;O+=J,Y+=ot,et=!0}),!et)return;const st=$.reduce((c,Z)=>Z.date>u?c:Z.tipo==="inicio"||Z.tipo==="aportacion"?c+Z.importe:c-Math.abs(Z.importe),0)+pt-O,B=Math.max(0,st+Y)/F;B>0&&a.push([u,B])})}if(a.length<3){const f=[];m&&f.push([m,Q]);let R=0;(k||[]).filter(u=>u.exitDateISO&&u.pnlAbs!=null).sort((u,O)=>u.exitDateISO.localeCompare(O.exitDateISO)).forEach(u=>{R+=u.pnlAbs||0,f.push([u.exitDateISO,(b+R)/F])}),f.push([E,y]),$.forEach(u=>{u.tipo!=="inicio"&&f.push([u.date,u.vl])});const K={};f.sort((u,O)=>u[0].localeCompare(O[0])).forEach(([u,O])=>{O>0&&(K[u]=O)}),a=Object.entries(K).sort((u,O)=>u[0].localeCompare(O[0]))}a.length>0&&(a[a.length-1]=[E,y]);let P=Q,T=0,A=m;a.forEach(([f,R])=>{R>P&&(P=R);const K=(P-R)/P;K>T&&(T=K,A=f)});const U=P>0?(y-P)/P:0,e=T>0?D/T:null,rt=[],ct=[];for(let f=1;f<a.length;f++){const R=a[f-1][1],K=a[f][1];R>0&&K>0&&(rt.push((K-R)/R),ct.push(a[f][0]))}const ut=Math.round(l*252/365),bt=rt.length,mt=Math.max(0,ut-bt),it=[...rt,...Array(mt).fill(0)];let xt=null,gt=null,s=null,V=null,nt=null,lt=null,dt=null;if(rt.length>=10){const f=it.reduce((h,I)=>h+I,0)/it.length,R=it.reduce((h,I)=>h+(I-f)**2,0)/it.length;s=Math.sqrt(R*252);const u=Math.pow(1+.05,1/252)-1,O=it.map(h=>h-u),Y=O.reduce((h,I)=>h+I,0)/O.length,pt=O.reduce((h,I)=>h+(I-Y)**2,0)/O.length,et=Math.sqrt(pt*252);xt=et>0?Y*252/et:null;const vt=O.filter(h=>h<0);if(vt.length>0){const h=vt.reduce((J,j)=>J+j*j,0)/vt.length,I=Math.sqrt(h*252);gt=I>0?Y*252/I:null}const st=await at.get("ethan_px_hist_SPY")||{},X=[],B=[],c={};for(let h=0;h<ct.length;h++)c[ct[h]]=rt[h];const Z=Object.keys(st).sort();for(let h=1;h<Z.length;h++){const I=Z[h],J=Z[h-1];if(I<(m||""))continue;if(I>E)break;const j=st[I],ot=st[J];if(!j||!ot||ot<=0)continue;const St=(j-ot)/ot,yt=c[I]??0;X.push(St),B.push(yt)}if(X.length>=10){const h=B.reduce((N,q)=>N+q,0)/B.length,I=X.reduce((N,q)=>N+q,0)/X.length,J=B.reduce((N,q,kt)=>N+(q-h)*(X[kt]-I),0)/B.length,j=X.reduce((N,q)=>N+(q-I)**2,0)/X.length;V=j>0?J/j:null;const ot=Math.pow(1+I,252)-1,St=.05,yt=X.reduce((N,q)=>N*(1+q),1)-1,$t=Math.pow(1+St,X.length/252)-1;nt=V!=null?S-($t+V*(yt-$t)):null;const wt=Math.sqrt(B.reduce((N,q)=>N+(q-h)**2,0)/B.length),H=Math.sqrt(j);lt=wt>0&&H>0?J/(wt*H):null,dt={volAnual:Math.sqrt(j*252),twrTotal:X.reduce((N,q)=>N*(1+q),1)-1,twrAnual:ot};const C=Object.keys(st).filter(N=>N.startsWith(E.slice(0,4))).sort();C.length>=2&&(dt.ytd=(st[C[C.length-1]]-st[C[0]])/st[C[0]])}}const ht=a.map(([f,R])=>({date:f,val:+(R/Q*100).toFixed(4)})),zt=E.slice(0,4),o=E.slice(0,7),r=a.filter(([f])=>f.slice(0,4)===zt);a.filter(([f])=>f.slice(0,7)===o);const g=(m==null?void 0:m.slice(0,4))===zt?S:r.length>=2?(r[r.length-1][1]-r[0][1])/r[0][1]:S,n=a.filter(([f])=>f.slice(0,7)<o),i=n.length>0?n[n.length-1][1]:a.length>0?a[0][1]:null,L=a.length>0?a[a.length-1][1]:y,M=i&&i>0?(L-i)/i:null;return{vlActual:y,vlInicial:Q,totalReturn:S,annReturn:D,nDays:l,tradingDays:d,startDate:m,participaciones:F,maxHistoricoVL:P,drawdownActual:U,ddDate:A,maxDD:T,calmar:e,sharpe:xt,sortino:gt,annVol:s,beta:V,alpha:nt,correlation:lt,spyStats:dt,ytd:g,mtd:M,hasHistory:W,serieBase100:ht,nPuntos:a.length,dailyReturns:it}}function jt(t,y=!0){if(!t||t.length<2)return'<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-family:var(--mono);font-size:11px;">Sin datos suficientes — registra el capital inicial</div>';const k=t.map(W=>W.val),v=820,b=200,$=Math.min(...k)*.998,E=Math.max(...k)*1.002-$||1,l=W=>W/(k.length-1)*v,d=W=>b-(W-$)/E*(b-20)-10,F=k.map((W,a)=>`${l(a).toFixed(1)},${d(W).toFixed(1)}`).join(" "),S=k[k.length-1],D=S>=100?"#40d9c0":"#f47174",x=d(100).toFixed(1),z=`0,${b} ${F} ${v},${b}`;return`<svg viewBox="0 0 ${v} ${b}" style="width:100%;height:${b}px;display:block;">
    <defs><linearGradient id="vlg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${D}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${D}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${x}" x2="${v}" y2="${x}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(x)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">100</text>
    <polygon points="${z}" fill="url(#vlg)"/>
    <polyline points="${F}" fill="none" stroke="${D}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${l(k.length-1).toFixed(1)}" cy="${d(S).toFixed(1)}" r="5" fill="${D}"/>
    <circle cx="${l(k.length-1).toFixed(1)}" cy="${d(S).toFixed(1)}" r="9" fill="none" stroke="${D}" stroke-width="1" opacity="0.4"/>
  </svg>`}function w(t,y,k,v,b,$=!1){const m=v==="good"?"var(--green)":v==="bad"?"var(--red)":v==="warn"?"var(--amber)":"var(--text1)";return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;transition:background 0.15s;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);">${t}</div>
      ${$===!0?'<span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(74,222,128,0.12);color:var(--green);letter-spacing:0.08em;">✓ AUDIT</span>':$==="model"?'<span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(95,168,224,0.12);color:var(--blue);letter-spacing:0.08em;">✓ MODEL</span>':""}
    </div>
    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px;">
      <span style="font-family:var(--mono);font-size:22px;font-weight:500;color:${m};">${y}</span>
      ${k?`<span style="font-family:var(--mono);font-size:9px;padding:2px 7px;border-radius:3px;background:${m}22;color:${m};">${k}</span>`:""}
    </div>
    <div style="font-size:10.5px;color:var(--text3);line-height:1.55;">${b}</div>
  </div>`}const Nt=`
.fondo-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:20px;}
.fondo-tab{padding:9px 18px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);}
.fondo-tab.active{color:var(--teal);border-bottom-color:var(--teal);}
.fondo-panel{display:none;}.fondo-panel.active{display:block;}
.fondo-hero{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px 28px;margin-bottom:16px;}
.fondo-vl-big{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:600;font-style:italic;line-height:1;}
.fondo-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.fondo-strip-cell{background:var(--surface);padding:14px 18px;}
.fondo-strip-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.fondo-strip-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.fondo-strip-sub{font-size:10px;color:var(--text3);margin-top:3px;}
.fondo-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:20px;}
.fondo-section{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);display:flex;align-items:center;gap:10px;margin:16px 0 12px;}
.fondo-section::after{content:"";flex:1;height:1px;background:var(--border);}
.fondo-mov-table{width:100%;border-collapse:collapse;font-size:12px;}
.fondo-mov-table th{padding:9px 14px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.fondo-mov-table th.r{text-align:right;}
.fondo-mov-table td{padding:11px 14px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;color:var(--text2);}
.fondo-mov-table td.r{text-align:right;}
.fondo-mov-table tr:last-child td{border-bottom:none;}
.fondo-form{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px 22px;margin-bottom:16px;}
.fondo-form-title{font-size:13px;font-weight:600;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;}
.fondo-form-grid{display:grid;grid-template-columns:160px 160px 1fr auto;gap:10px;align-items:end;}
.fondo-field label{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);display:block;margin-bottom:5px;}
`;async function qt(t,{actionsSlot:y,savedState:k}){var $,m,E;if(!document.getElementById("fondo-css")){const l=document.createElement("style");l.id="fondo-css",l.textContent=Nt,document.head.appendChild(l)}y.innerHTML=`
    <button class="btn" id="fondo-backfill-btn" title="Descarga el histórico de precios de todas las posiciones">📥 Importar histórico</button>
    <button class="btn btn-primary" id="fondo-report-btn">📄 Informe mensual</button>
    <button class="btn btn-primary" id="fondo-refresh">↻ Actualizar</button>
  `,t.innerHTML='<div id="fondo-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando fondo...</div></div></div>';let v=(k==null?void 0:k.activeTab)||"cotizacion";async function b(){var bt,mt,it,xt,gt,s,V,nt,lt,dt,ht,zt;const l=document.getElementById("fondo-wrap"),[d,F,S,D,x]=await Promise.all([Ft(),at.get("ethan_positions").then(o=>o||[]),at.get("ethan_positions_history").then(o=>o||[]),at.get("ethan_capital_alcista").then(o=>o||0),at.get("ethan_capital_bajista").then(o=>o||0)]),z=new Date().toISOString().slice(0,10);if(sessionStorage.getItem("ethan_fondo_last_update")!==z&&F.length>0){const o=[...F.filter(r=>!r.exitDateISO).map(r=>({ticker:r.ticker,from:r.entryDateISO||z})),{ticker:"SPY",from:((mt=(bt=d==null?void 0:d.movimientos)==null?void 0:bt[0])==null?void 0:mt.date)||"2026-01-01"}];Promise.all(o.map(async({ticker:r,from:p})=>{try{const n={"3GOL":"3GOL.MI"}[r]||r,i=await Dt(n,p,z);i!=null&&i.length&&await Mt(r,i,"active")}catch{}})).then(()=>{sessionStorage.setItem("ethan_fondo_last_update",z)})}const a=D+x||((it=d==null?void 0:d.movimientos)==null?void 0:it.reduce((o,r)=>r.tipo==="aportacion"?o+r.importe:o-Math.abs(r.importe),0))||0,P=S.reduce((o,r)=>o+(r.pnlAbs||0),0),T=F.reduce((o,r)=>{const p=r.currentPrice||r.entry;return!p||!r.entry||!r.shares?o:o+((r.direction||"alcista")==="bajista"?(r.entry-p)*r.shares:(p-r.entry)*r.shares)},0),A=a+P+T,U=d?Lt(d,A):Q,e=d?await Bt(d,U,S,F,a):null,rt=(e==null?void 0:e.totalReturn)||0,ct=rt>=0?"var(--green)":"var(--red)";window._ethanReportData={m:e,positions:F,history:S,fondo:d,vlActual:U,valorCartera:A,pnlRealizado:P,pnlNoRealizado:T},l.innerHTML=`
      <div class="fondo-tabs">
        <button class="fondo-tab ${v==="cotizacion"?"active":""}" data-tab="cotizacion">📈 Cotización</button>
        <button class="fondo-tab ${v==="riesgo"?"active":""}" data-tab="riesgo">⚡ Riesgo</button>
        <button class="fondo-tab ${v==="trading"?"active":""}" data-tab="trading">🎯 Trading</button>
        <button class="fondo-tab ${v==="movimientos"?"active":""}" data-tab="movimientos">💶 Movimientos</button>
        <button class="fondo-tab ${v==="distribucion"?"active":""}" data-tab="distribucion">🗂 Distribución</button>
      </div>

      <!-- ══ TAB COTIZACIÓN ══ -->
      <div class="fondo-panel ${v==="cotizacion"?"active":""}" id="fondo-panel-cotizacion">

        ${d?"":`
        <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:20px 22px;margin-bottom:16px;">
          <div style="font-size:13px;font-weight:600;color:var(--amber);margin-bottom:8px;">⚠ Fondo no inicializado</div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:14px;">Para activar la contabilidad por participaciones, introduce el capital inicial del fondo.</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <div>
              <label style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:5px;">Capital inicial (€)</label>
              <input type="number" id="fondo-init-importe" class="wl-input" style="width:160px;" placeholder="ej. 8000" value="${a||""}">
            </div>
            <div>
              <label style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:5px;">Fecha de inicio</label>
              <input type="date" id="fondo-init-fecha" class="wl-input" style="width:160px;" value="${((xt=S[0])==null?void 0:xt.entryDateISO)||new Date().toISOString().slice(0,10)}">
            </div>
            <div style="padding-top:18px;">
              <button class="btn btn-primary" id="fondo-init-btn">Inicializar fondo</button>
            </div>
          </div>
          <div style="font-size:10px;color:var(--text3);margin-top:10px;">VL inicial = 100,0000 · Participaciones = capital / 100</div>
        </div>`}

        <!-- Hero VL -->
        <div class="fondo-hero">
          <div style="display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:center;">
            <div>
              <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">Valor Liquidativo</div>
              <div class="fondo-vl-big" style="color:var(--teal);">${ft(U)}</div>
              <div style="font-family:var(--mono);font-size:12px;color:${ct};margin-top:6px;">${G(rt*100)} desde el ${It(e==null?void 0:e.startDate)}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:4px;">
                ${((gt=e==null?void 0:e.participaciones)==null?void 0:gt.toFixed(4))||"—"} participaciones · VL inicial: ${Q.toFixed(4)}
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">Base 100 · ${(e==null?void 0:e.tradingDays)||0} sesiones · ${(e==null?void 0:e.nPuntos)||0} puntos</div>
                <div style="font-size:10px;color:var(--text3);">Valor cartera: <strong style="color:var(--teal);">${_(A)}</strong></div>
              </div>
              ${jt(e==null?void 0:e.serieBase100)}
            </div>
          </div>
        </div>

        <!-- Strip métricas rápidas -->
        <div class="fondo-strip">
          <div class="fondo-strip-cell">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="fondo-strip-lbl">TWR Total</div>
              <span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;background:rgba(74,222,128,0.12);color:var(--green);">✓ AUDIT</span>
            </div>
            <div class="fondo-strip-val" style="color:${ct};">${G(rt*100)}</div>
            <div class="fondo-strip-sub">(VL ${ft(U)} / ${Q})</div>
          </div>
          <div class="fondo-strip-cell">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="fondo-strip-lbl">CAGR Anualizado</div>
              <span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;background:rgba(74,222,128,0.12);color:var(--green);">✓ AUDIT</span>
            </div>
            <div class="fondo-strip-val" style="color:${((e==null?void 0:e.annReturn)||0)>=0?"var(--green)":"var(--red)"};">${G(((e==null?void 0:e.annReturn)||0)*100)}</div>
            <div class="fondo-strip-sub">365 días/año</div>
          </div>
          <div class="fondo-strip-cell">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="fondo-strip-lbl">Máx. Histórico VL</div>
              <span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;background:rgba(74,222,128,0.12);color:var(--green);">✓ AUDIT</span>
            </div>
            <div class="fondo-strip-val" style="color:var(--text1);">${ft(e==null?void 0:e.maxHistoricoVL)}</div>
            <div class="fondo-strip-sub">Pico del fondo</div>
          </div>
          <div class="fondo-strip-cell">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="fondo-strip-lbl">Drawdown Actual</div>
              <span style="font-family:var(--mono);font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;background:rgba(74,222,128,0.12);color:var(--green);">✓ AUDIT</span>
            </div>
            <div class="fondo-strip-val" style="color:${((e==null?void 0:e.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${G(((e==null?void 0:e.drawdownActual)||0)*100)}</div>
            <div class="fondo-strip-sub">Desde el máximo</div>
          </div>
        </div>

        <!-- Métricas detalladas -->
        <div class="fondo-section">Rentabilidad</div>

        ${e!=null&&e.spyStats?`
        <!-- Comparativa Fondo vs SPY -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead><tr style="background:var(--surface2);">
              <th style="padding:10px 16px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);border-bottom:1px solid var(--border);">Métrica</th>
              <th style="padding:10px 16px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--teal);border-bottom:1px solid var(--border);">Fondo ETHAN</th>
              <th style="padding:10px 16px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--blue);border-bottom:1px solid var(--border);">SPY</th>
              <th style="padding:10px 16px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);border-bottom:1px solid var(--border);">Diferencia</th>
            </tr></thead>
            <tbody>
              ${[["TWR (período)",e.totalReturn*100,e.spyStats.twrTotal*100,"%"],["YTD",e.ytd!=null?e.ytd*100:null,e.spyStats.ytd!=null?e.spyStats.ytd*100:null,"%"],["Volatilidad anual",e.annVol!=null?e.annVol*100:null,e.spyStats.volAnual*100,"%"]].map(([o,r,p,g])=>{if(r==null||p==null)return"";const n=r-p,i=n>=0?"var(--green)":"var(--red)",L=tt=>tt!=null?(tt>=0?"+":"")+tt.toFixed(2)+g:"—",M=o==="Volatilidad anual"?r<p?"var(--green)":"var(--red)":r>=p?"var(--green)":"var(--red)";return`<tr>
                  <td style="padding:10px 16px;border-bottom:1px solid var(--border);color:var(--text2);">${o}</td>
                  <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${M};">${L(r)}</td>
                  <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:var(--text2);">${L(p)}</td>
                  <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${i};">${L(n)}</td>
                </tr>`}).join("")}
            </tbody>
          </table>
        </div>`:(e==null?void 0:e.beta)==null?`
        <div style="font-size:10px;color:var(--text3);background:var(--surface2);border-radius:6px;padding:10px 14px;margin-bottom:16px;font-family:var(--mono);">
          Importa el histórico de SPY en la pestaña Riesgo para ver la comparativa con el benchmark
        </div>`:""}

        <div class="fondo-metrics">
          ${w("YTD",G(((e==null?void 0:e.ytd)||0)*100),null,((e==null?void 0:e.ytd)||0)>=0?"good":"bad","Rentabilidad acumulada desde el 1 de enero del año en curso.",!0)}
          ${w("MTD",(e==null?void 0:e.mtd)!=null?G(e.mtd*100):"—",null,(e==null?void 0:e.mtd)!=null?e.mtd>=0?"good":"bad":"neu","Rentabilidad del mes en curso.",!0)}
          ${w("P&L Realizado",_(P),P>=0?"Ganancia":"Pérdida",P>=0?"good":"bad","Suma de beneficios y pérdidas de todas las operaciones cerradas.",!0)}
          ${w("P&L No Realizado",_(T),T>=0?"Latente+":"Latente−",T>=0?"good":"bad","P&L de las posiciones abiertas a precio actual. Se actualiza al abrir Posiciones.",!0)}
          ${w("Valor Liquidativo",ft(U),null,"neu",`Precio por participación hoy. Inicio: ${Q.toFixed(4)}. Sube/baja con el P&L de la cartera.`,!0)}
          ${w("Valor Cartera",_(A),null,"neu",`VL (${ft(U)}) × ${((s=e==null?void 0:e.participaciones)==null?void 0:s.toFixed(2))||"—"} participaciones.`,!0)}
        </div>

      </div>

      <!-- ══ TAB RIESGO ══ -->
      <div class="fondo-panel ${v==="riesgo"?"active":""}" id="fondo-panel-riesgo">
        <div class="fondo-section">Drawdown</div>
        <div class="fondo-strip" style="margin-bottom:16px;">
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Máx. Histórico VL</div>
            <div class="fondo-strip-val" style="color:var(--text1);">${ft(e==null?void 0:e.maxHistoricoVL)}</div>
            <div class="fondo-strip-sub">Pico del fondo</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Drawdown Actual</div>
            <div class="fondo-strip-val" style="color:${((e==null?void 0:e.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${G(((e==null?void 0:e.drawdownActual)||0)*100)}</div>
            <div class="fondo-strip-sub">Desde el máximo</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Desde máximo (€)</div>
            <div class="fondo-strip-val" style="color:${((e==null?void 0:e.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${_(((e==null?void 0:e.drawdownActual)||0)*A)}</div>
            <div class="fondo-strip-sub">${((e==null?void 0:e.drawdownActual)||0)>=0?"En máximos":"Recuperar"}</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Máx. Drawdown</div>
            <div class="fondo-strip-val" style="color:${((e==null?void 0:e.maxDD)||0)>.1?"var(--red)":"var(--amber)"};">${(e==null?void 0:e.maxDD)!=null?"-"+(e.maxDD*100).toFixed(1)+"%":"N/A"}</div>
            <div class="fondo-strip-sub">Histórico</div>
          </div>
        </div>

        <div class="fondo-section">Ratios ajustados por riesgo</div>
        <div class="fondo-metrics">
          ${(e==null?void 0:e.sharpe)!=null?w("Sharpe Ratio",e.sharpe.toFixed(2),e.sharpe>=1.5?"Excelente":e.sharpe>=1?"Sólido":e.sharpe>=.5?"Aceptable":"Débil",e.sharpe>=1?"good":e.sharpe>=.5?"warn":"bad","Retorno anualizado / volatilidad diaria × √252. Calculado sobre retornos diarios reales del VL.",!0):w("Sharpe Ratio","N/A",null,"neu","Importa el histórico de precios para calcular.",!0)}
          ${(e==null?void 0:e.sortino)!=null?w("Sortino Ratio",e.sortino.toFixed(2),e.sortino>=2?"Excelente":e.sortino>=1.5?"Bueno":"Aceptable",e.sortino>=1.5?"good":"warn","Como Sharpe pero penaliza solo la volatilidad bajista. >2 = gestión de riesgo sobresaliente.",!0):w("Sortino Ratio","N/A",null,"neu","Sin días negativos en el VL o histórico insuficiente.",!0)}
          ${w("Calmar Ratio",(e==null?void 0:e.calmar)!=null?e.calmar.toFixed(2):"N/A",(e==null?void 0:e.calmar)!=null?e.calmar>=1?"Bueno":"Vigilar":null,(e==null?void 0:e.calmar)!=null?e.calmar>=1?"good":"warn":"neu","CAGR / Máx. Drawdown histórico. >1 = el retorno compensa el peor dolor sufrido.",!0)}
          ${(e==null?void 0:e.annVol)!=null?w("Volatilidad Anual.",(e.annVol*100).toFixed(1)+"%",e.annVol<.15?"Contenida":e.annVol<.25?"Moderada":"Alta",e.annVol<.15?"good":e.annVol<.25?"warn":"bad","Desviación estándar retornos diarios del VL × √252. Referencia: SP500 ~15-20%/año.",!0):w("Volatilidad Anual.","N/A",null,"neu","Importa el histórico de precios para calcular.",!0)}
          ${w("Días activo",(e==null?void 0:e.nDays)!=null?e.nDays+"d":"—",null,"neu",`Desde el ${It(e==null?void 0:e.startDate)} · ${(e==null?void 0:e.tradingDays)||0} sesiones · ${(e==null?void 0:e.nPuntos)||0} puntos en la serie VL.`,!0)}
        </div>

        <div class="fondo-section">Beta vs SPY</div>
        <div class="fondo-metrics">
          ${(e==null?void 0:e.beta)!=null?w("Beta",e.beta.toFixed(2),e.beta<.8?"Defensivo":e.beta<1.2?"Mercado":"Agresivo",e.beta<.8?"good":e.beta<1.2?"neu":"warn",`Sensibilidad del fondo vs SP500. Beta=1 = se mueve igual que el mercado. Calculada con ${(e==null?void 0:e.nPuntos)||0} sesiones.`,!0):'<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;"><div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:10px;">BETA VS SPY</div><div style="font-family:var(--mono);font-size:22px;font-weight:500;margin-bottom:6px;">N/A</div><div style="font-size:10.5px;color:var(--text3);line-height:1.55;">Importa el histórico de SPY para calcular. <button class="btn btn-primary" id="fondo-import-spy" style="font-size:9px;padding:4px 10px;margin-left:8px;">📥 Importar SPY</button></div></div>'}
          ${(e==null?void 0:e.alpha)!=null?w("Alpha (Jensen)",(e.alpha*100).toFixed(2)+"%",e.alpha>0?"Positivo":"Negativo",e.alpha>0?"good":"bad","Retorno del fondo no explicado por el mercado. Alpha>0 = generas valor sobre el benchmark.",!0):w("Alpha","N/A",null,"neu","Requiere Beta calculada.",!0)}
          ${(e==null?void 0:e.correlation)!=null?w("Correlación",e.correlation.toFixed(2),e.correlation>.8?"Alta":e.correlation>.5?"Media":"Baja",e.correlation>.8?"warn":e.correlation>.5?"neu":"good","Correlación entre retornos diarios del fondo y el SP500. <1 = diversificación real.",!0):w("Correlación","N/A",null,"neu","Requiere Beta calculada.",!0)}
        </div>

        ${(()=>{if(!(e!=null&&e.dailyReturns)||e.dailyReturns.length<20)return`
            <div class="fondo-section">VaR & Monte Carlo</div>
            <div style="background:var(--surface2);border-radius:8px;padding:14px 16px;font-size:11px;color:var(--text3);font-family:var(--mono);">
              Se necesitan al menos 20 días de retornos para calcular VaR y Monte Carlo. Importa el histórico de precios.
            </div>`;const o=e.dailyReturns,r=[...o].sort((H,C)=>H-C),p=r.length,g=r[Math.floor(p*.05)],n=r[Math.floor(p*.01)],i=g*A,L=n*A,M=r.slice(0,Math.floor(p*.05)),tt=M.length?M.reduce((H,C)=>H+C,0)/M.length:g,f=o.reduce((H,C)=>H+C,0)/p,R=Math.sqrt(o.reduce((H,C)=>H+(C-f)**2,0)/p),K=0,u=2e3,O=252,Y=[];for(let H=0;H<u;H++){let C=1;for(let N=0;N<O;N++){const q=Math.random(),kt=Math.random(),Pt=Math.sqrt(-2*Math.log(q))*Math.cos(2*Math.PI*kt);C*=1+K+R*Pt}Y.push(C)}Y.sort((H,C)=>H-C);const pt=Y[Math.floor(u*.1)],et=Y[Math.floor(u*.5)],vt=Y[Math.floor(u*.9)],st=Y[Math.floor(u*.05)],X=30,B=Y[0],c=Y[Y.length-1],Z=(c-B)/X,h=new Array(X).fill(0);Y.forEach(H=>{const C=Math.min(X-1,Math.floor((H-B)/Z));h[C]++});const I=Math.max(...h),J=820,j=120,ot=J/X,St=h.map((H,C)=>{const N=C*ot,q=H/I*j,kt=B+C*Z,Pt=kt<1?"#f47174":kt>1?"#40d9c0":"#fbbf24";return`<rect x="${N.toFixed(1)}" y="${(j-q).toFixed(1)}" width="${(ot-1).toFixed(1)}" height="${q.toFixed(1)}" fill="${Pt}" opacity="0.7"/>`}).join(""),yt=((1-B)/(c-B)*J).toFixed(1),$t=((pt-B)/(c-B)*J).toFixed(1),wt=((vt-B)/(c-B)*J).toFixed(1);return`
          <div class="fondo-section">Value at Risk (VaR histórico)</div>
          <div class="fondo-metrics" style="margin-bottom:8px;">
            ${w("VaR 95% (1 día)",G(g*100),"Hist. 95%","bad",`Con 95% de confianza, no perderás más de ${_(Math.abs(i))} en un día.`,!0)}
            ${w("VaR 99% (1 día)",G(n*100),"Hist. 99%","bad",`Con 99% de confianza, no perderás más de ${_(Math.abs(L))} en un día.`,!0)}
            ${w("CVaR 95%",G(tt*100),"Expected Shortfall","bad","Pérdida media esperada en el peor 5% de los días. También llamado Expected Shortfall.",!0)}
            ${w("VaR 95% mensual",G(g*Math.sqrt(21)*100),"Escalado √21","warn","VaR diario escalado a 21 días hábiles por la raíz del tiempo.",!0)}
          </div>
          <div style="background:var(--surface2);border-radius:6px;padding:10px 14px;font-size:10px;color:var(--text3);margin-bottom:16px;font-family:var(--mono);">
            Basado en ${p} retornos diarios históricos reales del VL · Método histórico (no asume distribución normal)
          </div>

          <div class="fondo-section">Monte Carlo — Proyección 12 meses</div>
          <div class="fondo-metrics" style="margin-bottom:12px;">
            ${w("Escenario Optimista (P90)",G((vt-1)*100),"+"+_((vt-1)*A),"good",`El 10% de las simulaciones superan este resultado. Valor cartera: ${_(vt*A)}`,!0)}
            ${w("Escenario Base (P50)",G((et-1)*100),_((et-1)*A),et-1>=0?"good":"bad",`Mediana de ${u.toLocaleString()} simulaciones con μ=0% (random walk). Valor cartera esperado: ${_(et*A)}`,!0)}
            ${w("Escenario Pesimista (P10)",G((pt-1)*100),_((pt-1)*A),"bad",`El 90% de las simulaciones superan este resultado. Valor cartera: ${_(pt*A)}`,!0)}
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);padding:10px 14px;background:rgba(251,191,36,0.05);border-radius:6px;margin-top:8px;line-height:1.6;">
              ⚠ Modelo: μ=0 (random walk) · σ=${(R*Math.sqrt(252)*100).toFixed(1)}% anualizado · μ histórico=${(f*252*100).toFixed(1)}% (referencia, no usado — historial &lt;12 meses insuficiente para estimación robusta) · ${u.toLocaleString()} simulaciones · 252 días
            </div>
            ${w("Percentil 5",G((st-1)*100),_((st-1)*A),"bad","El peor 5% de escenarios. El 5% de los escenarios simulados finaliza por debajo de este resultado a 12 meses.",!0)}
          </div>

          <!-- Histograma Monte Carlo -->
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <div style="font-size:12px;font-weight:600;">Distribución de resultados — ${u} simulaciones · ${O} días</div>
              <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">μ histórico=${G(f*252*100)} · σ=${G(R*Math.sqrt(252)*100)} anualizado</div>
            </div>
            <svg viewBox="0 0 ${J} ${j}" style="width:100%;height:${j}px;display:block;">
              ${St}
              <line x1="${yt}" y1="0" x2="${yt}" y2="${j}" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,4"/>
              <text x="${parseFloat(yt)+4}" y="14" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Base 100</text>
              <line x1="${$t}" y1="0" x2="${$t}" y2="${j}" stroke="#f47174" stroke-width="1.5" stroke-dasharray="3,3"/>
              <text x="${parseFloat($t)+4}" y="28" font-family="IBM Plex Mono" font-size="9" fill="#f47174">P10</text>
              <line x1="${wt}" y1="0" x2="${wt}" y2="${j}" stroke="#40d9c0" stroke-width="1.5" stroke-dasharray="3,3"/>
              <text x="${parseFloat(wt)+4}" y="28" font-family="IBM Plex Mono" font-size="9" fill="#40d9c0">P90</text>
            </svg>
            <div style="display:flex;gap:20px;margin-top:10px;font-size:10px;font-family:var(--mono);color:var(--text3);">
              <span style="color:#f47174;">■ Pérdida</span>
              <span style="color:#fbbf24;">■ Neutral</span>
              <span style="color:#40d9c0;">■ Ganancia</span>
              <span style="margin-left:auto;">Retorno anual esperado: <strong style="color:${et-1>=0?"var(--green)":"var(--red)"};">${G((et-1)*100)}</strong></span>
            </div>
          </div>
          <div style="background:var(--surface2);border-radius:6px;padding:10px 14px;font-size:10px;color:var(--text3);font-family:var(--mono);">
            ⚠ Monte Carlo asume distribución normal de retornos con media y desviación histórica. Los resultados son ilustrativos — los mercados tienen colas más gruesas de lo que el modelo predice.
          </div>`})()}
      </div>

      <!-- ══ TAB TRADING ══ -->
      <div class="fondo-panel ${v==="trading"?"active":""}" id="fondo-panel-trading">
        ${(()=>{const o=Rt(S),r=Rt(S.filter(i=>(i.direction||"alcista")==="alcista")),p=Rt(S.filter(i=>i.direction==="bajista")),g=(i,L=2)=>i!=null&&isFinite(i)?(i>=0?"+":"")+i.toFixed(L)+"%":"—",n=i=>i!=null&&isFinite(i)?(i<0?"-":"")+"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—";return o?`
          <div class="fondo-metrics" style="margin-bottom:16px;">
            ${w("Win Rate",o?Math.round(o.winRate*100)+"%":"—",o&&o.winRate>=.5?"Bueno":"Vigilar",o&&o.winRate>=.5?"good":"warn",o.n+" operaciones cerradas",!0)}
            ${w("Profit Factor",o&&o.profitFactor!=null?o.profitFactor.toFixed(2):"—",o&&o.profitFactor>=1.5?"Sólido":o&&o.profitFactor>=1?"Aceptable":"Débil",o&&o.profitFactor>=1.5?"good":o&&o.profitFactor>=1?"neu":"bad","Ganancias brutas / pérdidas brutas. >1.5 = sistema robusto.",!0)}
            ${w("Esperanza Mat.",o?g(o.esperanza*100):"—",o&&o.esperanza>=0?"Positiva":"Negativa",o&&o.esperanza>=0?"good":"bad","Retorno esperado por operación normalizada.",!0)}
            ${w("Avg Win",o?"+"+o.avgWin.toFixed(1)+"%":"—",null,"good","Ganancia media de las operaciones ganadoras.",!0)}
            ${w("Avg Loss",o?"-"+o.avgLoss.toFixed(1)+"%":"—",null,"warn","Pérdida media de las operaciones perdedoras.",!0)}
            ${w("Payoff",o&&o.payoff!=null?o.payoff.toFixed(2):"—",o&&o.payoff>=1.5?"Bueno":"Neutral",o&&o.payoff>=1.5?"good":"neu","Avg Win / Avg Loss.",!0)}
            ${w("Holding medio",(o==null?void 0:o.avgDays)!=null?o.avgDays+"d":"—",null,"neu","Días medios por operación cerrada.",!0)}
            ${w("P&L Realizado",o!=null&&o.hasAbs?n(o.totalPL):"—",o&&o.totalPL>=0?"Ganancia":"Pérdida",o&&o.totalPL>=0?"good":"bad","Suma de todos los P&L realizados.",!0)}
            ${w("Rent. media/op.",o?g(o.avgReturn):"—",o&&o.avgReturn>=0?"Positiva":"Negativa",o&&o.avgReturn>=0?"good":"bad","Rentabilidad media por operación cerrada.",!0)}
          </div>

          <div class="fondo-section">Por estrategia</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
            ${["Alcista","Bajista"].map((i,L)=>{const M=L===0?r:p;return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;">
                <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:${L===0?"var(--green)":"var(--red)"};margin-bottom:12px;">${i} · ${M?M.n+" ops":"sin ops"}</div>
                ${M?[["Win Rate",Math.round(M.winRate*100)+"%"],["Avg Win","+"+M.avgWin.toFixed(1)+"%"],["Avg Loss","-"+M.avgLoss.toFixed(1)+"%"],["Profit Factor",M.profitFactor!=null?M.profitFactor.toFixed(2):"—"],["Esperanza",g(M.esperanza*100)],["Holding medio",M.avgDays!=null?M.avgDays+"d":"—"],["Rent. media/op",g(M.avgReturn)]].map(([f,R])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:11px;"><span style="color:var(--text2);">${f}</span><span style="font-family:var(--mono);font-weight:700;">${R}</span></div>`).join(""):'<div style="color:var(--text3);font-size:11px;padding:10px 0;">Sin operaciones</div>'}
              </div>`}).join("")}
          </div>

          <div class="fondo-section">Historial de operaciones</div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead><tr style="background:var(--surface2);">
                <th style="padding:8px 14px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Ticker</th>
                <th style="padding:8px 14px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Estrategia</th>
                <th style="padding:8px 14px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Entrada</th>
                <th style="padding:8px 14px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Salida</th>
                <th style="padding:8px 14px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Días</th>
                <th style="padding:8px 14px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L %</th>
                <th style="padding:8px 14px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L €</th>
              </tr></thead>
              <tbody>
                ${S.map(i=>{const L=i.entryDateISO&&i.exitDateISO?Math.round((new Date(i.exitDateISO)-new Date(i.entryDateISO))/864e5):null,M=(i.pnlPct||0)>=0?"var(--green)":"var(--red)";return`<tr>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);font-weight:700;">${i.ticker}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);"><span style="font-size:9px;padding:2px 7px;border-radius:10px;background:${(i.direction||"alcista")==="alcista"?"rgba(74,222,128,0.1)":"rgba(244,113,116,0.1)"};color:${(i.direction||"alcista")==="alcista"?"var(--green)":"var(--red)"};">${i.direction||"alcista"}</span></td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:var(--text3);">${i.entryDateISO||"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:var(--text3);">${i.exitDateISO||"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${L!=null?L+"d":"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${M};">${g(i.pnlPct)}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${M};">${i.pnlAbs!=null?n(i.pnlAbs):"—"}</td>
                  </tr>`}).join("")}
              </tbody>
            </table>
          </div>`:'<div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Sin operaciones cerradas</div></div>'})()}
      </div>

      <!-- ══ TAB MOVIMIENTOS ══ -->
      <div class="fondo-panel ${v==="movimientos"?"active":""}" id="fondo-panel-movimientos">

        <!-- Formulario nueva aportación/retirada -->
        <div class="fondo-form">
          <div class="fondo-form-title">
            Registrar movimiento
            <span style="font-family:var(--mono);font-size:10px;color:var(--text3);">VL actual: ${ft(U)}</span>
          </div>
          <div class="fondo-form-grid">
            <div class="fondo-field">
              <label>Tipo</label>
              <select id="mov-tipo" class="wl-input">
                <option value="aportacion">Aportación</option>
                <option value="retirada">Retirada</option>
              </select>
            </div>
            <div class="fondo-field">
              <label>Importe (€)</label>
              <input type="number" id="mov-importe" class="wl-input" placeholder="ej. 2000" min="0">
            </div>
            <div class="fondo-field">
              <label>Fecha</label>
              <input type="date" id="mov-fecha" class="wl-input" value="${new Date().toISOString().slice(0,10)}">
            </div>
            <div class="fondo-field">
              <label>Nota</label>
              <input type="text" id="mov-nota" class="wl-input" placeholder="Opcional">
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
            <div id="mov-preview" style="font-size:11px;color:var(--text3);font-family:var(--mono);"></div>
            <button class="btn btn-primary" id="mov-guardar" ${d?"":"disabled"}>Registrar</button>
          </div>
          ${d?"":'<div style="font-size:10px;color:var(--amber);margin-top:8px;">⚠ Inicializa el fondo primero en la pestaña Cotización</div>'}
        </div>

        <!-- Tabla movimientos -->
        ${(V=d==null?void 0:d.movimientos)!=null&&V.length?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
          <table class="fondo-mov-table">
            <thead><tr>
              <th>Fecha</th><th>Tipo</th><th class="r">Importe</th>
              <th class="r">VL</th><th class="r">Participaciones</th>
              <th class="r">Total Part.</th><th>Nota</th><th></th>
            </tr></thead>
            <tbody>
              ${[...d.movimientos].reverse().map((o,r)=>{var i,L,M;const p=d.movimientos.length-1-r,g=o.tipo==="aportacion"||o.tipo==="inicio"?"var(--green)":"var(--red)",n=o.tipo==="inicio"?"🏁 Inicio":o.tipo==="aportacion"?"▲ Aportación":"▼ Retirada";return`<tr>
                  <td>${It(o.date)}</td>
                  <td><span style="font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:10px;background:${g}22;color:${g};">${n}</span></td>
                  <td class="r" style="color:${g};">${_(Math.abs(o.importe))}</td>
                  <td class="r">${((i=o.vl)==null?void 0:i.toFixed(4))||"—"}</td>
                  <td class="r">${((L=o.participacionesMov)==null?void 0:L.toFixed(4))||"—"}</td>
                  <td class="r" style="color:var(--teal);">${((M=o.participacionesTotal)==null?void 0:M.toFixed(4))||"—"}</td>
                  <td style="color:var(--text3);font-size:10px;">${o.nota||"—"}</td>
                  <td class="r">
                    <button class="btn fondo-del-mov" data-idx="${p}" style="font-size:9px;padding:2px 8px;color:var(--red);border-color:rgba(244,113,116,0.3);">✕</button>
                  </td>
                </tr>`}).join("")}
            </tbody>
          </table>
        </div>`:`
        <div class="empty">
          <div class="empty-icon">💶</div>
          <div class="empty-title">Sin movimientos</div>
          <div class="empty-desc">Inicializa el fondo y registra aportaciones y retiradas aquí.</div>
        </div>`}
      </div>

      <!-- ══ TAB DISTRIBUCIÓN ══ -->
      <div class="fondo-panel ${v==="distribucion"?"active":""}" id="fondo-panel-distribucion">
        ${(()=>{const o=F.reduce((n,i)=>{const L=i.currentPrice||i.entry;return n+(L&&i.shares?L*i.shares:i.cost||0)},0),r=Math.max(0,A-o),p=[{label:"Capital invertido",val:o,col:"var(--teal)"},{label:"Cash disponible",val:r,col:"var(--blue)"}],g=A||1;return`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px 22px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:600;margin-bottom:16px;">Asignación del capital</div>
            <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:16px;">
              ${p.map(n=>`<div style="width:${(n.val/g*100).toFixed(1)}%;background:${n.col};"></div>`).join("")}
            </div>
            ${p.map(n=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:8px;height:8px;border-radius:2px;background:${n.col};"></div>
                <span style="font-size:12px;">${n.label}</span>
              </div>
              <div style="display:flex;gap:20px;">
                <span style="font-family:var(--mono);font-size:12px;color:var(--text3);">${(n.val/g*100).toFixed(1)}%</span>
                <span style="font-family:var(--mono);font-size:12px;color:var(--text1);font-weight:600;">${_(n.val)}</span>
              </div>
            </div>`).join("")}
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;">
              <span style="font-weight:700;">Valor total fondo</span>
              <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--teal);">${_(A)}</span>
            </div>
          </div>

          <!-- Posiciones abiertas -->
          ${F.length?`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
            <div style="padding:16px 20px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">${F.length} posiciones abiertas</div>
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead><tr style="background:var(--surface2);">
                <th style="padding:8px 16px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Ticker</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Valor</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Peso</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L</th>
              </tr></thead>
              <tbody>
                ${F.map(n=>{const i=n.currentPrice||n.entry,L=i&&n.shares?i*n.shares:n.cost||0,M=n.shares&&n.entry?(n.direction||"alcista")==="bajista"?(n.entry-i)*n.shares:(i-n.entry)*n.shares:null,tt=(L/g*100).toFixed(1);return`<tr>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);font-weight:700;">${n.ticker}</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${_(L)}</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${tt}%</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:${M>=0?"var(--green)":"var(--red)"};">${M!=null?_(M):"—"}</td>
                  </tr>`}).join("")}
              </tbody>
            </table>
          </div>`:'<div class="empty"><div class="empty-icon">📂</div><div class="empty-title">Sin posiciones abiertas</div></div>'}`})()}
      </div>
    `,l.querySelectorAll(".fondo-tab").forEach(o=>{o.addEventListener("click",()=>{var r;v=o.dataset.tab,Tt("car-fondo",{activeTab:v}),l.querySelectorAll(".fondo-tab").forEach(p=>p.classList.remove("active")),l.querySelectorAll(".fondo-panel").forEach(p=>p.classList.remove("active")),o.classList.add("active"),(r=l.querySelector(`#fondo-panel-${v}`))==null||r.classList.add("active")})}),(nt=document.getElementById("fondo-init-btn"))==null||nt.addEventListener("click",async()=>{var p,g;const o=parseFloat((p=document.getElementById("fondo-init-importe"))==null?void 0:p.value),r=(g=document.getElementById("fondo-init-fecha"))==null?void 0:g.value;if(!o||o<=0)return alert("Introduce un importe válido");if(!r)return alert("Introduce una fecha de inicio");await Ot(o,r,"Capital inicial"),b()});const ut=()=>{var n,i;const o=parseFloat((n=document.getElementById("mov-importe"))==null?void 0:n.value),r=(i=document.getElementById("mov-tipo"))==null?void 0:i.value,p=document.getElementById("mov-preview");if(!p)return;if(!d||!o||o<=0){p.textContent="";return}const g=(o/U).toFixed(4);p.textContent=r==="aportacion"?`→ Se emitirán ${g} participaciones al VL ${ft(U)}`:`→ Se cancelarán ${g} participaciones al VL ${ft(U)}`};(lt=document.getElementById("mov-importe"))==null||lt.addEventListener("input",ut),(dt=document.getElementById("mov-tipo"))==null||dt.addEventListener("change",ut),(ht=document.getElementById("fondo-import-spy"))==null||ht.addEventListener("click",async()=>{var r,p;const o=document.getElementById("fondo-import-spy");o.disabled=!0,o.textContent="⏳ Importando SPY...";try{const g=await Dt("SPY",((p=(r=d==null?void 0:d.movimientos)==null?void 0:r[0])==null?void 0:p.date)||"2024-01-01",new Date().toISOString().slice(0,10));await Mt("SPY",g,"active"),o.textContent=`✓ ${g.length} días importados`,setTimeout(()=>b(),2e3)}catch(g){o.textContent="⚠ Error: "+g.message.slice(0,30),o.disabled=!1}}),l.querySelectorAll(".fondo-del-mov").forEach(o=>{o.addEventListener("click",async()=>{const r=parseInt(o.dataset.idx),p=d.movimientos[r];if(!confirm(`¿Eliminar ${p.tipo} de ${_(Math.abs(p.importe))} del ${It(p.date)}?`))return;d.movimientos.splice(r,1);let g=0;d.movimientos=d.movimientos.map(n=>(n.tipo==="inicio"||n.tipo==="aportacion"?g+=n.participacionesMov||0:n.tipo==="retirada"&&(g-=n.participacionesMov||0),{...n,participacionesTotal:g})),d.participaciones=g,await Et(d),b()})}),(zt=document.getElementById("mov-guardar"))==null||zt.addEventListener("click",async()=>{var n,i,L,M;if(!d)return;const o=(n=document.getElementById("mov-tipo"))==null?void 0:n.value,r=parseFloat((i=document.getElementById("mov-importe"))==null?void 0:i.value),p=(L=document.getElementById("mov-fecha"))==null?void 0:L.value,g=(M=document.getElementById("mov-nota"))==null?void 0:M.value.trim();if(!r||r<=0)return alert("Introduce un importe válido");if(!p)return alert("Selecciona una fecha");try{await Ct(o,r,p,g,A),document.getElementById("mov-importe").value="",document.getElementById("mov-nota").value="",b()}catch(tt){alert("Error: "+tt.message)}})}return($=document.getElementById("fondo-refresh"))==null||$.addEventListener("click",b),(m=document.getElementById("fondo-report-btn"))==null||m.addEventListener("click",()=>{_t(window._ethanReportData||{})}),(E=document.getElementById("fondo-backfill-btn"))==null||E.addEventListener("click",async()=>{const l=document.getElementById("fondo-backfill-btn");l.disabled=!0;try{const[d,F]=await Promise.all([at.get("ethan_positions").then(a=>a||[]),at.get("ethan_positions_history").then(a=>a||[])]),S=new Date().toISOString().slice(0,10);let D=0,x=0,z=0;const W={"3GOL":"3GOL.MI"};for(const a of F){if(!a.ticker||!a.entryDateISO||!a.exitDateISO)continue;const P=W[a.ticker]||a.ticker;l.textContent=`⏳ ${P}...`;try{const T=await Dt(P,a.entryDateISO,a.exitDateISO);if(a.exit&&T.length>0){const A=T.reduce((U,e)=>U.date>e.date?U:e);A.close=a.exit}await Mt(a.ticker,T,"inactive"),x+=T.length,D++}catch(T){z++,console.warn("Backfill "+P+":",T.message)}}for(const a of d)if(!(!a.ticker||!a.entryDate)){l.textContent=`⏳ ${a.ticker}...`;try{const P=await Dt(a.ticker,a.entryDate,S);await Mt(a.ticker,P,"active"),x+=P.length,D++}catch(P){z++,console.warn("Backfill "+a.ticker+":",P.message)}}l.textContent=`✓ ${D} tickers · ${x} días${z?" · "+z+" errores":""}`,setTimeout(()=>{l.disabled=!1,l.textContent="📥 Importar histórico",b()},4e3)}catch(d){l.textContent="⚠ "+d.message.slice(0,40),setTimeout(()=>{l.disabled=!1,l.textContent="📥 Importar histórico"},3e3)}}),b(),{destroy(){var l;(l=document.getElementById("fondo-css"))==null||l.remove()}}}function _t({m:t,positions:y,history:k,fondo:v,vlActual:b,valorCartera:$,pnlRealizado:m,pnlNoRealizado:E}){var rt,ct,ut,bt,mt,it,xt,gt;const l=new Date,d=l.toLocaleDateString("es-ES",{month:"long",year:"numeric"}),F=l.toLocaleDateString("es-ES",{month:"long"}),S=l.getFullYear(),D=(s,V=1)=>s!=null&&isFinite(s)?(s>=0?"+":"")+s.toFixed(V)+"%":"—",x=s=>s!=null?(s>=0?"+€":"−€")+Math.abs(s).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—",z=s=>s!=null?s.toFixed(2):"—",W=`${S}-${String(l.getMonth()+1).padStart(2,"0")}`,a=(k||[]).filter(s=>(s.exitDateISO||"").startsWith(W)),P=a.filter(s=>(s.pnlPct||0)>0),T=a.filter(s=>(s.pnlPct||0)<=0),A=a.reduce((s,V)=>s+(V.pnlAbs||0),0),U=`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>ETHAN · Informe ${d}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Montserrat:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#040e0e;--surface:#0b1f1f;--surface2:#0f2828;--border:#1a3c3c;--teal:#40d9c0;--teal-dim:rgba(64,217,192,0.08);--green:#4ade80;--red:#f47174;--amber:#fbbf24;--blue:#5fa8e0;--text1:#eaf6f4;--text2:#7aada6;--text3:#3d6460;--serif:'Cormorant Garamond',serif;--sans:'Montserrat',sans-serif;--mono:'IBM Plex Mono',monospace;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text1);font-family:var(--sans);font-size:13px;}
.page{max-width:860px;margin:0 auto;}
.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:60px;border-bottom:1px solid var(--border);position:relative;overflow:hidden;}
.cover::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 100% 0%,rgba(64,217,192,0.08),transparent 60%),radial-gradient(ellipse 50% 70% at 0% 100%,rgba(64,217,192,0.05),transparent 50%);pointer-events:none;}
.cover-top{position:relative;z-index:1;}
.cover-eyebrow{font-family:var(--mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text3);margin-bottom:16px;margin-top:60px;}
.cover-title{font-family:var(--serif);font-size:72px;font-weight:300;font-style:italic;line-height:0.95;color:var(--text1);}
.cover-title em{color:var(--teal);}
.cover-subtitle{font-family:var(--serif);font-size:24px;font-weight:300;color:var(--text2);margin-top:16px;}
.cover-bottom{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);}
.cover-stat{background:var(--surface);padding:20px 22px;}
.cover-stat-lbl{font-family:var(--mono);font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.cover-stat-val{font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;line-height:1;}
.cover-stat-sub{font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:5px;}
.section{padding:48px 60px;border-bottom:1px solid var(--border);}
.section-header{display:flex;align-items:baseline;gap:16px;margin-bottom:28px;padding-bottom:14px;border-bottom:1px solid var(--border);}
.section-num{font-family:var(--mono);font-size:10px;color:var(--teal);letter-spacing:0.15em;}
.section-title{font-family:var(--serif);font-size:28px;font-weight:400;font-style:italic;}
.section-rule{flex:1;height:1px;background:var(--border);}
.metrics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:20px;}
.metric-cell{background:var(--surface);padding:18px 20px;}
.metric-lbl{font-family:var(--mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text2);margin-bottom:8px;}
.metric-val{font-family:var(--serif);font-size:34px;font-weight:600;font-style:italic;line-height:1;}
.metric-sub{font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:5px;}
.compare-table{width:100%;border-collapse:collapse;margin-bottom:20px;}
.compare-table th{padding:10px 16px;text-align:left;font-family:var(--mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text2);border-bottom:1px solid var(--border);background:var(--surface2);}
.compare-table th.r{text-align:right;}
.compare-table td{padding:12px 16px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px;}
.compare-table td.r{text-align:right;}
.compare-table td.label{font-family:var(--sans);font-size:12px;color:var(--text1);}
.compare-table tbody tr:last-child td{border-bottom:none;}
.ops-table{width:100%;border-collapse:collapse;}
.ops-table th{padding:9px 12px;text-align:left;font-family:var(--mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text2);border-bottom:1px solid var(--border);background:var(--surface2);}
.ops-table th.r{text-align:right;}
.ops-table td{padding:11px 12px;border-bottom:1px solid var(--border);font-size:11px;}
.ops-table td.r{text-align:right;font-family:var(--mono);}
.ops-table tbody tr:last-child td{border-bottom:none;}
.pos-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:20px;}
.pos-cell{background:var(--surface);padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
.pos-ticker{font-weight:700;font-size:14px;}
.pos-name{font-size:10px;color:var(--text2);margin-top:3px;}
.pos-pnl{font-family:var(--serif);font-size:22px;font-style:italic;font-weight:600;}
.pos-weight{font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:3px;}
.insight{border-left:3px solid var(--teal);background:var(--teal-dim);padding:14px 18px;border-radius:0 4px 4px 0;margin-top:18px;}
.insight-title{font-family:var(--mono);font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--teal);margin-bottom:7px;}
.insight-text{font-size:12px;color:var(--text1);line-height:1.7;}
.tag{display:inline-block;padding:2px 8px;border-radius:3px;font-family:var(--mono);font-size:9px;font-weight:700;}
.tag-green{background:rgba(74,222,128,0.12);color:var(--green);}
.tag-red{background:rgba(244,113,116,0.12);color:var(--red);}
.tag-blue{background:rgba(95,168,224,0.12);color:var(--blue);}
.risk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:20px;}
.risk-card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:16px 18px;}
.risk-card-lbl{font-family:var(--mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text2);margin-bottom:7px;}
.risk-card-val{font-family:var(--serif);font-size:26px;font-style:italic;font-weight:600;line-height:1;margin-bottom:4px;}
.risk-card-desc{font-size:10px;color:var(--text2);line-height:1.5;margin-top:5px;}
.macro-row{display:flex;align-items:center;gap:24px;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:4px;margin-bottom:16px;}
.macro-score{font-family:var(--serif);font-size:56px;font-weight:600;font-style:italic;line-height:1;flex-shrink:0;}
.macro-label{font-family:var(--serif);font-size:20px;font-style:italic;margin-bottom:4px;}
.macro-desc{font-size:11px;color:var(--text2);line-height:1.6;}
.macro-inds{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;}
.macro-ind{background:var(--surface2);padding:12px 14px;}
.macro-ind-lbl{font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:5px;}
.macro-ind-val{font-family:var(--mono);font-size:13px;font-weight:500;}
.exec-summary{font-family:var(--serif);font-size:17px;font-weight:300;line-height:1.8;border-left:3px solid var(--teal);padding-left:22px;margin-bottom:22px;}
.exec-summary em{color:var(--teal);font-style:italic;}
.footer{padding:28px 60px;display:flex;justify-content:space-between;align-items:center;}
.footer-left{font-family:var(--serif);font-size:13px;font-style:italic;color:var(--text3);}
.footer-right{font-family:var(--mono);font-size:9px;color:var(--text3);text-align:right;line-height:1.6;}
@media print{body{background:#040e0e!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.cover{min-height:100vh;page-break-after:always;}.section{page-break-inside:avoid;}}
</style>
</head>
<body>
<div class="page">

  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-top">
      <img src="/LOGO ETHAN MERCADOS.png" alt="ETHAN Mercados" style="height:34px;width:auto;margin-bottom:0;">
      <div class="cover-eyebrow">Informe mensual de gestión · Período</div>
      <div class="cover-title">${F}<br><em>${S}</em></div>
      <div class="cover-subtitle">Fondo ETHAN · Resumen ejecutivo y métricas de rendimiento</div>
    </div>
    <div class="cover-bottom">
      <div class="cover-stat">
        <div class="cover-stat-lbl">VL cierre</div>
        <div class="cover-stat-val" style="color:var(--teal);">${z(b)}</div>
        <div class="cover-stat-sub">Base 100 · inicio fondo</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-lbl">Rentabilidad mes</div>
        <div class="cover-stat-val" style="color:${((t==null?void 0:t.mtd)||0)>=0?"var(--green)":"var(--red)"};">${D(((t==null?void 0:t.mtd)||0)*100)}</div>
        <div class="cover-stat-sub">vs benchmark</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-lbl">Rentabilidad YTD</div>
        <div class="cover-stat-val" style="color:${((t==null?void 0:t.ytd)||0)>=0?"var(--green)":"var(--red)"};">${D(((t==null?void 0:t.ytd)||0)*100)}</div>
        <div class="cover-stat-sub">acumulado año</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-lbl">Valor cartera</div>
        <div class="cover-stat-val" style="color:var(--teal);">€${Math.round($||0).toLocaleString("es-ES")}</div>
        <div class="cover-stat-sub">${y.length} posiciones abiertas</div>
      </div>
    </div>
  </div>

  <!-- 01. RESUMEN EJECUTIVO -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">01</span>
      <span class="section-title">Resumen Ejecutivo</span>
      <div class="section-rule"></div>
    </div>
    <p class="exec-summary">
      ${F} ${S} cerró con un VL de <em>${z(b)}</em> y una rentabilidad acumulada desde inicio del 
      <em>${D(((t==null?void 0:t.totalReturn)||0)*100)}</em>. 
      ${a.length?`Durante el mes se ejecutaron <em>${a.length} operaciones</em> — ${P.length} ganadoras y ${T.length} perdedoras — con un P&L realizado de <em>${x(A)}</em>.`:"No se ejecutaron operaciones durante el mes."}
      El P&L no realizado en posiciones abiertas es de <em>${x(E)}</em>.
    </p>
    <div class="insight">
      <div class="insight-title">Métricas clave del período</div>
      <div class="insight-text">
        Sharpe: <strong>${((rt=t==null?void 0:t.sharpe)==null?void 0:rt.toFixed(2))||"—"}</strong> · 
        Sortino: <strong>${((ct=t==null?void 0:t.sortino)==null?void 0:ct.toFixed(2))||"—"}</strong> · 
        Volatilidad anual: <strong>${t!=null&&t.annVol?(t.annVol*100).toFixed(1)+"%":"—"}</strong> · 
        Max Drawdown: <strong style="color:var(--red);">${t!=null&&t.maxDD?"-"+(t.maxDD*100).toFixed(1)+"%":"—"}</strong> · 
        Beta vs SPY: <strong>${((ut=t==null?void 0:t.beta)==null?void 0:ut.toFixed(2))||"—"}</strong>
      </div>
    </div>
  </div>

  <!-- 02. RENTABILIDAD -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">02</span>
      <span class="section-title">Rentabilidad</span>
      <div class="section-rule"></div>
    </div>
    <div class="metrics-grid">
      <div class="metric-cell">
        <div class="metric-lbl">TWR Total</div>
        <div class="metric-val" style="color:${((t==null?void 0:t.totalReturn)||0)>=0?"var(--green)":"var(--red)"};">${D(((t==null?void 0:t.totalReturn)||0)*100)}</div>
        <div class="metric-sub">desde inicio del fondo</div>
      </div>
      <div class="metric-cell">
        <div class="metric-lbl">YTD ${S}</div>
        <div class="metric-val" style="color:${((t==null?void 0:t.ytd)||0)>=0?"var(--green)":"var(--red)"};">${D(((t==null?void 0:t.ytd)||0)*100)}</div>
        <div class="metric-sub">acumulado año en curso</div>
      </div>
      <div class="metric-cell">
        <div class="metric-lbl">MTD ${F}</div>
        <div class="metric-val" style="color:${((t==null?void 0:t.mtd)||0)>=0?"var(--green)":"var(--red)"};">${D(((t==null?void 0:t.mtd)||0)*100)}</div>
        <div class="metric-sub">rentabilidad del mes</div>
      </div>
      <div class="metric-cell">
        <div class="metric-lbl">P&L Realizado</div>
        <div class="metric-val" style="color:${(m||0)>=0?"var(--green)":"var(--red)"};">${x(m)}</div>
        <div class="metric-sub">operaciones cerradas</div>
      </div>
      <div class="metric-cell">
        <div class="metric-lbl">P&L No Realizado</div>
        <div class="metric-val" style="color:${(E||0)>=0?"var(--green)":"var(--red)"};">${x(E)}</div>
        <div class="metric-sub">posiciones abiertas</div>
      </div>
      <div class="metric-cell">
        <div class="metric-lbl">Valor Liquidativo</div>
        <div class="metric-val" style="color:var(--teal);">${z(b)}</div>
        <div class="metric-sub">${((bt=t==null?void 0:t.participaciones)==null?void 0:bt.toFixed(2))||"—"} participaciones</div>
      </div>
    </div>
    ${t!=null&&t.spyStats?`
    <table class="compare-table">
      <thead><tr><th>Métrica</th><th class="r">Fondo ETHAN</th><th class="r">SPY</th><th class="r">Diferencia</th></tr></thead>
      <tbody>
        <tr>
          <td class="label">TWR período</td>
          <td class="r" style="color:${(t.totalReturn||0)>=(t.spyStats.twrTotal||0)?"var(--green)":"var(--red)"};">${D((t.totalReturn||0)*100)}</td>
          <td class="r" style="color:var(--text2);">${D((t.spyStats.twrTotal||0)*100)}</td>
          <td class="r" style="color:${(t.totalReturn||0)>=(t.spyStats.twrTotal||0)?"var(--green)":"var(--red)"};">${D(((t.totalReturn||0)-(t.spyStats.twrTotal||0))*100)}</td>
        </tr>
        <tr>
          <td class="label">Volatilidad anual</td>
          <td class="r" style="color:${(t.annVol||0)<=(t.spyStats.volAnual||1)?"var(--green)":"var(--red)"};">${t.annVol?(t.annVol*100).toFixed(1)+"%":"—"}</td>
          <td class="r" style="color:var(--text2);">${t.spyStats.volAnual?(t.spyStats.volAnual*100).toFixed(1)+"%":"—"}</td>
          <td class="r" style="color:${(t.annVol||0)<=(t.spyStats.volAnual||1)?"var(--green)":"var(--red)"};">${t.annVol&&t.spyStats.volAnual?D((t.annVol-t.spyStats.volAnual)*100):"—"}</td>
        </tr>
      </tbody>
    </table>`:""}
  </div>

  <!-- 03. RIESGO -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">03</span>
      <span class="section-title">Métricas de Riesgo</span>
      <div class="section-rule"></div>
    </div>
    <div class="risk-grid">
      <div class="risk-card">
        <div class="risk-card-lbl">Sharpe Ratio</div>
        <div class="risk-card-val" style="color:${((t==null?void 0:t.sharpe)||0)>=1?"var(--green)":((t==null?void 0:t.sharpe)||0)>=0?"var(--amber)":"var(--red)"};">${((mt=t==null?void 0:t.sharpe)==null?void 0:mt.toFixed(2))||"—"}</div>
        <div class="risk-card-desc">Retorno ajustado por riesgo total. >1 = nivel profesional.</div>
      </div>
      <div class="risk-card">
        <div class="risk-card-lbl">Sortino Ratio</div>
        <div class="risk-card-val" style="color:${((t==null?void 0:t.sortino)||0)>=1?"var(--green)":((t==null?void 0:t.sortino)||0)>=0?"var(--amber)":"var(--red)"};">${((it=t==null?void 0:t.sortino)==null?void 0:it.toFixed(2))||"—"}</div>
        <div class="risk-card-desc">Penaliza solo la volatilidad negativa. >2 = excelente.</div>
      </div>
      <div class="risk-card">
        <div class="risk-card-lbl">Max Drawdown</div>
        <div class="risk-card-val" style="color:var(--red);">${t!=null&&t.maxDD?"-"+(t.maxDD*100).toFixed(1)+"%":"—"}</div>
        <div class="risk-card-desc">Caída máxima desde máximos históricos del VL.</div>
      </div>
      <div class="risk-card">
        <div class="risk-card-lbl">Beta vs SPY</div>
        <div class="risk-card-val" style="color:var(--teal);">${((xt=t==null?void 0:t.beta)==null?void 0:xt.toFixed(2))||"—"}</div>
        <div class="risk-card-desc">Sensibilidad vs mercado. <1 = más defensivo que el SP500.</div>
      </div>
      <div class="risk-card">
        <div class="risk-card-lbl">Alpha Jensen</div>
        <div class="risk-card-val" style="color:${((t==null?void 0:t.alpha)||0)>=0?"var(--green)":"var(--red)"};">${t!=null&&t.alpha?D(t.alpha*100,2):"—"}</div>
        <div class="risk-card-desc">Retorno no explicado por el mercado. Positivo = valor añadido real.</div>
      </div>
      <div class="risk-card">
        <div class="risk-card-lbl">Calmar Ratio</div>
        <div class="risk-card-val" style="color:${((t==null?void 0:t.calmar)||0)>=.5?"var(--green)":"var(--amber)"};">${((gt=t==null?void 0:t.calmar)==null?void 0:gt.toFixed(2))||"—"}</div>
        <div class="risk-card-desc">TWR / Max Drawdown. Retorno por unidad de drawdown sufrido.</div>
      </div>
    </div>
  </div>

  <!-- 04. OPERACIONES -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">04</span>
      <span class="section-title">Operaciones del Mes</span>
      <div class="section-rule"></div>
    </div>
    ${a.length?`
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:20px;">
      <div style="background:var(--surface);padding:14px 16px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Operaciones</div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;font-weight:600;">${a.length}</div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:4px;">${P.length}G · ${T.length}P</div>
      </div>
      <div style="background:var(--surface);padding:14px 16px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Win Rate mes</div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;font-weight:600;color:${P.length/a.length>=.5?"var(--green)":"var(--red)"};">${a.length>0?(P.length/a.length*100).toFixed(0)+"%":"—"}</div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:4px;">del mes</div>
      </div>
      <div style="background:var(--surface);padding:14px 16px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">P&L realizado</div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;font-weight:600;color:${A>=0?"var(--green)":"var(--red)"};">${x(A)}</div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:4px;">neto del mes</div>
      </div>
      <div style="background:var(--surface);padding:14px 16px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Días medio</div>
        <div style="font-family:var(--serif);font-size:28px;font-style:italic;font-weight:600;">${a.length>0?Math.round(a.reduce((s,V)=>{const nt=V.exitDateISO&&V.entryDateISO?Math.round((new Date(V.exitDateISO)-new Date(V.entryDateISO))/864e5):0;return s+nt},0)/a.length)+"d":"—"}</div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:4px;">duración media</div>
      </div>
    </div>
    <table class="ops-table">
      <thead><tr><th>Ticker</th><th>Entrada</th><th>Salida</th><th class="r">P.Entrada</th><th class="r">P.Salida</th><th class="r">P&L %</th><th class="r">P&L €</th></tr></thead>
      <tbody>
        ${a.map(s=>{var V,nt,lt,dt;return`<tr>
          <td><div style="font-weight:700;font-size:13px;">${s.ticker||"—"}</div></td>
          <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${((V=s.entryDateISO)==null?void 0:V.slice(0,10))||"—"}</td>
          <td style="font-family:var(--mono);font-size:10px;color:var(--text2);">${((nt=s.exitDateISO)==null?void 0:nt.slice(0,10))||"—"}</td>
          <td class="r">$${((lt=s.entry)==null?void 0:lt.toFixed(2))||"—"}</td>
          <td class="r">$${((dt=s.exit)==null?void 0:dt.toFixed(2))||"—"}</td>
          <td class="r" style="color:${(s.pnlPct||0)>=0?"var(--green)":"var(--red)"};font-weight:700;">${D(s.pnlPct||0)}</td>
          <td class="r" style="color:${(s.pnlAbs||0)>=0?"var(--green)":"var(--red)"};font-weight:700;">${x(s.pnlAbs)}</td>
        </tr>`}).join("")}
      </tbody>
    </table>`:`<div style="text-align:center;padding:32px;color:var(--text2);font-family:var(--mono);">Sin operaciones cerradas en ${F} ${S}</div>`}
  </div>

  <!-- 05. POSICIONES ABIERTAS -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">05</span>
      <span class="section-title">Posiciones Abiertas al Cierre</span>
      <div class="section-rule"></div>
    </div>
    ${y.length?`
    <div class="pos-grid">
      ${y.map(s=>{const V=s.currentPrice||s.entry,nt=s.direction||"alcista",lt=V&&s.entry?(nt==="bajista"?(s.entry-V)/s.entry:(V-s.entry)/s.entry)*100:0,dt=lt>=0?"var(--green)":"var(--red)",ht=$>0?((s.shares||1)*(V||s.entry||0)/$*100).toFixed(1):"—";return`<div class="pos-cell">
          <div>
            <div class="pos-ticker" style="color:var(--text1);">${s.ticker}</div>
            <div class="pos-name">${s.name||""}</div>
          </div>
          <div style="text-align:right;">
            <div class="pos-pnl" style="color:${dt};">${D(lt)}</div>
            <div class="pos-weight">Peso: ${ht}% · Stop: ${s.entryStop||s.stopManual||"—"}</div>
          </div>
        </div>`}).join("")}
    </div>`:'<div style="text-align:center;padding:32px;color:var(--text2);font-family:var(--mono);">Sin posiciones abiertas</div>'}
  </div>

  <!-- PIE -->
  <div class="footer">
    <div class="footer-left">ETHAN Mercados · Informe ${d}</div>
    <div class="footer-right">
      Documento de uso privado · No constituye asesoramiento financiero<br>
      Generado el ${l.toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"})} · Plataforma ETHAN v3.0
    </div>
  </div>
</div>
</body>
</html>`,e=window.open("","_blank");e.document.write(U),e.document.close(),e.document.title=`ETHAN · Informe ${d}`}export{qt as render};
