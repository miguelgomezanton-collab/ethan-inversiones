import{U as A}from"./userdata-DxgjZ95P.js";import{s as pt}from"./index-BuBCrzrQ.js";const nt="ethan_fondo_v1",L=100,vt=[i=>`https://api.allorigins.win/raw?url=${encodeURIComponent(i)}`,i=>`https://corsproxy.io/?${encodeURIComponent(i)}`,i=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(i)}`];async function it(i,m,g){var $,s,l,S,k;const n=m?Math.floor(new Date(m).getTime()/1e3):Math.floor(Date.now()/1e3)-63072e3,x=Math.floor(g?new Date(g+"T23:59:59").getTime()/1e3:Date.now()/1e3),y=`https://query1.finance.yahoo.com/v8/finance/chart/${i}?interval=1d&period1=${n}&period2=${x}`;for(const F of vt)try{const E=await fetch(F(y),{signal:AbortSignal.timeout(12e3)});if(!E.ok)continue;const c=JSON.parse(await E.text()),w=(s=($=c==null?void 0:c.chart)==null?void 0:$.result)==null?void 0:s[0];if(!w)continue;const d=w.timestamp||[],p=((k=(S=(l=w.indicators)==null?void 0:l.quote)==null?void 0:S[0])==null?void 0:k.close)||[],D=[];return d.forEach((t,R)=>{p[R]!=null&&D.push({date:new Date(t*1e3).toISOString().slice(0,10),close:p[R]})}),D}catch{}throw new Error(`No se pudo obtener histórico de ${i}`)}async function rt(i,m,g="active"){var y;const n=`ethan_px_hist_${i}`,x=await A.get(n)||{};if(m.forEach($=>{x[$.date]=$.close}),await A.set(n,x),g==="active"&&m.length>0){const $=[...m].sort((s,l)=>l.date.localeCompare(s.date));await A.set(`ethan_px_latest_${i}`,{close:$[0].close,asOf:$[0].date,prev:((y=$[1])==null?void 0:y.close)||$[0].close})}return Object.keys(x).length}const P=i=>i!=null&&isFinite(i)?(i<0?"-":"")+"€"+Math.abs(i).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}):"—",N=(i,m=2)=>i!=null&&isFinite(i)?(i>=0?"+":"")+i.toFixed(m)+"%":"—",T=i=>i!=null?i.toFixed(4):"—",X=i=>i?new Date(i+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):"—";async function st(){return await A.get(nt)}async function ot(i){await A.set(nt,i)}function lt(i,m){return i!=null&&i.participaciones?m/i.participaciones:L}async function ft(i,m,g="Capital inicial"){const n=i/L,x={vlInicial:L,participaciones:n,creadoEn:m,movimientos:[{date:m,tipo:"inicio",importe:i,vl:L,participacionesMov:n,participacionesTotal:n,nota:g}]};return await ot(x),x}async function xt(i,m,g,n,x){let y=await st();const $=lt(y,x),s=Math.abs(m)/$,l=i==="aportacion"?y.participaciones+s:y.participaciones-s;if(l<0)throw new Error("Retirada superior al valor del fondo");return y.participaciones=l,y.movimientos=[...y.movimientos||[],{date:g,tipo:i,importe:i==="aportacion"?m:-m,vl:$,participacionesMov:s,participacionesTotal:l,nota:n}],await ot(y),y}function tt(i){if(!(i!=null&&i.length))return null;const m=i.filter(c=>c.pnlPct>0),g=i.filter(c=>c.pnlPct<=0),n=m.length/i.length,x=m.length?m.reduce((c,w)=>c+w.pnlPct,0)/m.length:0,y=g.length?Math.abs(g.reduce((c,w)=>c+w.pnlPct,0)/g.length):0,$=i.reduce((c,w)=>c+(w.pnlAbs||0),0),s=y>0?n*x/((1-n)*y):null,l=n*x/100-(1-n)*y/100,S=y>0?x/y:null,k=i.reduce((c,w)=>c+(w.pnlPct||0),0)/i.length,F=i.filter(c=>c.entryDateISO&&c.exitDateISO),E=F.length?Math.round(F.reduce((c,w)=>c+Math.round((new Date(w.exitDateISO)-new Date(w.entryDateISO))/864e5),0)/F.length):null;return{winRate:n,avgWin:x,avgLoss:y,profitFactor:s,esperanza:l,payoff:S,totalPL:$,avgReturn:k,avgDays:E,n:i.length,hasAbs:i.some(c=>c.pnlAbs)}}async function ut(i,m,g=[],n=[],x=0){var h;const y=(i==null?void 0:i.movimientos)||[],$=(h=y[0])==null?void 0:h.date,s=new Date().toISOString().slice(0,10),l=$?Math.round((new Date(s)-new Date($))/864e5):0,S=Math.round(l*252/365),k=(i==null?void 0:i.participaciones)||x/L,F=(m-L)/L,E=S>10?Math.pow(Math.max(1+F,.001),252/S)-1:F,c=[...(g||[]).map(a=>a.ticker),...(n||[]).map(a=>a.ticker)].filter((a,e,v)=>a&&v.indexOf(a)===e),w={};await Promise.all(c.map(async a=>{const e=await A.get(`ethan_px_hist_${a}`);e&&(w[a]=e)}));const d=Object.keys(w).length>0;let p=[];if(d&&$){const a=[];let e=new Date($);const v=new Date(s);for(;e<=v;){const r=e.toISOString().slice(0,10),z=e.getDay();z!==0&&z!==6&&a.push(r),e.setDate(e.getDate()+1)}a.forEach(r=>{let z=0,B=0,K=0,J=!1;if((g||[]).forEach(f=>{!f.exitDateISO||!f.pnlAbs||f.exitDateISO<r&&(K+=f.pnlAbs)}),(g||[]).forEach(f=>{if(!f.ticker||!f.entryDateISO||!f.exitDateISO||r<f.entryDateISO||r>f.exitDateISO)return;const _=(w[f.ticker]||{})[r];if(!_)return;const M=f.shares||(f.cost&&f.entry?f.cost/f.entry:0);if(!M)return;const Z=f.cost||M*f.entry,Q=(f.direction||"alcista")==="bajista"?M*f.entry*2-M*_:M*_;z+=Z,B+=Q,J=!0}),(n||[]).forEach(f=>{if(!f.ticker||!f.entryDate||r<f.entryDate)return;const at=w[f.ticker]||{},_=r===s?f.currentPrice||f.entry:at[r]||null;if(!_)return;const M=f.shares||(f.cost&&f.entry?f.cost/f.entry:0);if(!M)return;const Z=f.cost||M*f.entry,Q=(f.direction||"alcista")==="bajista"?M*f.entry*2-M*_:M*_;z+=Z,B+=Q,J=!0}),!J)return;const dt=x+K-z,et=Math.max(0,dt+B)/k;et>0&&p.push([r,et])})}if(p.length<3){const a=[];$&&a.push([$,L]);let e=0;(g||[]).filter(r=>r.exitDateISO&&r.pnlAbs!=null).sort((r,z)=>r.exitDateISO.localeCompare(z.exitDateISO)).forEach(r=>{e+=r.pnlAbs||0,a.push([r.exitDateISO,(x+e)/k])}),a.push([s,m]),y.forEach(r=>{r.tipo!=="inicio"&&a.push([r.date,r.vl])});const v={};a.sort((r,z)=>r[0].localeCompare(z[0])).forEach(([r,z])=>{z>0&&(v[r]=z)}),p=Object.entries(v).sort((r,z)=>r[0].localeCompare(z[0]))}p.length>0&&(p[p.length-1]=[s,m]);let D=L,t=0,R=$;p.forEach(([a,e])=>{e>D&&(D=e);const v=(D-e)/D;v>t&&(t=v,R=a)});const C=D>0?(m-D)/D:0,G=t>0?E/t:null,O=[];for(let a=1;a<p.length;a++){const e=p[a-1][1],v=p[a][1];e>0&&v>0&&O.push((v-e)/e)}let H=null,q=null,j=null;if(O.length>=10){const a=O.reduce((r,z)=>r+z,0)/O.length,e=O.reduce((r,z)=>r+(z-a)**2,0)/O.length;j=Math.sqrt(e*252),H=j>0?E/j:null;const v=O.filter(r=>r<0);if(v.length>0){const r=Math.sqrt(v.reduce((z,B)=>z+B*B,0)/v.length*252);q=r>0?E/r:null}}const W=p.map(([a,e])=>({date:a,val:+(e/L*100).toFixed(4)})),Y=s.slice(0,4),U=s.slice(0,7),V=p.filter(([a])=>a.slice(0,4)===Y),o=p.filter(([a])=>a.slice(0,7)===U),u=V.length>=2?(V[V.length-1][1]-V[0][1])/V[0][1]:F,b=o.length>=2?(o[o.length-1][1]-o[0][1])/o[0][1]:null;return{vlActual:m,vlInicial:L,totalReturn:F,annReturn:E,nDays:l,tradingDays:S,startDate:$,participaciones:k,maxHistoricoVL:D,drawdownActual:C,ddDate:R,maxDD:t,calmar:G,sharpe:H,sortino:q,annVol:j,ytd:u,mtd:b,hasHistory:d,serieBase100:W,nPuntos:p.length}}function mt(i,m=!0){if(!i||i.length<2)return'<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-family:var(--mono);font-size:11px;">Sin datos suficientes — registra el capital inicial</div>';const g=i.map(d=>d.val),n=820,x=200,y=Math.min(...g)*.998,s=Math.max(...g)*1.002-y||1,l=d=>d/(g.length-1)*n,S=d=>x-(d-y)/s*(x-20)-10,k=g.map((d,p)=>`${l(p).toFixed(1)},${S(d).toFixed(1)}`).join(" "),F=g[g.length-1],E=F>=100?"#40d9c0":"#f47174",c=S(100).toFixed(1),w=`0,${x} ${k} ${n},${x}`;return`<svg viewBox="0 0 ${n} ${x}" style="width:100%;height:${x}px;display:block;">
    <defs><linearGradient id="vlg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${E}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${E}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${c}" x2="${n}" y2="${c}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(c)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">100</text>
    <polygon points="${w}" fill="url(#vlg)"/>
    <polyline points="${k}" fill="none" stroke="${E}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${l(g.length-1).toFixed(1)}" cy="${S(F).toFixed(1)}" r="5" fill="${E}"/>
    <circle cx="${l(g.length-1).toFixed(1)}" cy="${S(F).toFixed(1)}" r="9" fill="none" stroke="${E}" stroke-width="1" opacity="0.4"/>
  </svg>`}function I(i,m,g,n,x){return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;transition:background 0.15s;">
    <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:10px;">${i}</div>
    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px;">
      <span style="font-family:var(--mono);font-size:22px;font-weight:500;">${m}</span>
      ${g?`<span style="font-family:var(--mono);font-size:9px;padding:2px 7px;border-radius:3px;background:var(--${n==="good"?"green":n==="warn"?"amber":n==="bad"?"red":"text3"}22;color:var(--${n==="good"?"green":n==="warn"?"amber":n==="bad"?"red":"text3"});">${g}</span>`:""}
    </div>
    <div style="font-size:10.5px;color:var(--text3);line-height:1.55;">${x}</div>
  </div>`}const gt=`
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
`;async function $t(i,{actionsSlot:m,savedState:g}){var y,$;if(!document.getElementById("fondo-css")){const s=document.createElement("style");s.id="fondo-css",s.textContent=gt,document.head.appendChild(s)}m.innerHTML=`
    <button class="btn" id="fondo-backfill-btn" title="Descarga el histórico de precios de todas las posiciones">📥 Importar histórico</button>
    <button class="btn btn-primary" id="fondo-refresh">↻ Actualizar</button>
  `,i.innerHTML='<div id="fondo-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando fondo...</div></div></div>';let n=(g==null?void 0:g.activeTab)||"cotizacion";async function x(){var O,H,q,j,W,Y,U,V;const s=document.getElementById("fondo-wrap"),[l,S,k,F,E]=await Promise.all([st(),A.get("ethan_positions").then(o=>o||[]),A.get("ethan_positions_history").then(o=>o||[]),A.get("ethan_capital_alcista").then(o=>o||0),A.get("ethan_capital_bajista").then(o=>o||0)]),c=F+E,w=k.reduce((o,u)=>o+(u.pnlAbs||0),0),d=S.reduce((o,u)=>{const b=u.currentPrice||u.entry;return!b||!u.entry||!u.shares?o:o+((u.direction||"alcista")==="bajista"?(u.entry-b)*u.shares:(b-u.entry)*u.shares)},0),p=c+w+d,D=l?lt(l,p):L,t=l?await ut(l,D,k,S,c):null,R=(t==null?void 0:t.totalReturn)||0,C=R>=0?"var(--green)":"var(--red)";s.innerHTML=`
      <div class="fondo-tabs">
        <button class="fondo-tab ${n==="cotizacion"?"active":""}" data-tab="cotizacion">📈 Cotización</button>
        <button class="fondo-tab ${n==="riesgo"?"active":""}" data-tab="riesgo">⚡ Riesgo</button>
        <button class="fondo-tab ${n==="trading"?"active":""}" data-tab="trading">🎯 Trading</button>
        <button class="fondo-tab ${n==="movimientos"?"active":""}" data-tab="movimientos">💶 Movimientos</button>
        <button class="fondo-tab ${n==="distribucion"?"active":""}" data-tab="distribucion">🗂 Distribución</button>
      </div>

      <!-- ══ TAB COTIZACIÓN ══ -->
      <div class="fondo-panel ${n==="cotizacion"?"active":""}" id="fondo-panel-cotizacion">

        ${l?"":`
        <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:20px 22px;margin-bottom:16px;">
          <div style="font-size:13px;font-weight:600;color:var(--amber);margin-bottom:8px;">⚠ Fondo no inicializado</div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:14px;">Para activar la contabilidad por participaciones, introduce el capital inicial del fondo.</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <div>
              <label style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:5px;">Capital inicial (€)</label>
              <input type="number" id="fondo-init-importe" class="wl-input" style="width:160px;" placeholder="ej. 8000" value="${c||""}">
            </div>
            <div>
              <label style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:5px;">Fecha de inicio</label>
              <input type="date" id="fondo-init-fecha" class="wl-input" style="width:160px;" value="${((O=k[0])==null?void 0:O.entryDateISO)||new Date().toISOString().slice(0,10)}">
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
              <div class="fondo-vl-big" style="color:var(--teal);">${T(D)}</div>
              <div style="font-family:var(--mono);font-size:12px;color:${C};margin-top:6px;">${N(R*100)} desde el ${X(t==null?void 0:t.startDate)}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:4px;">
                ${((H=t==null?void 0:t.participaciones)==null?void 0:H.toFixed(4))||"—"} participaciones · VL inicial: ${L.toFixed(4)}
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">Base 100 · ${(t==null?void 0:t.tradingDays)||0} sesiones · ${(t==null?void 0:t.nPuntos)||0} puntos</div>
                <div style="font-size:10px;color:var(--text3);">Valor cartera: <strong style="color:var(--teal);">${P(p)}</strong></div>
              </div>
              ${mt(t==null?void 0:t.serieBase100)}
            </div>
          </div>
        </div>

        <!-- Strip métricas rápidas -->
        <div class="fondo-strip">
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">TWR Total</div>
            <div class="fondo-strip-val" style="color:${C};">${N(R*100)}</div>
            <div class="fondo-strip-sub">(VL ${T(D)} / ${L})</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">CAGR Anualizado</div>
            <div class="fondo-strip-val" style="color:${((t==null?void 0:t.annReturn)||0)>=0?"var(--green)":"var(--red)"};">${N(((t==null?void 0:t.annReturn)||0)*100)}</div>
            <div class="fondo-strip-sub">252 sesiones/año</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Máx. Histórico VL</div>
            <div class="fondo-strip-val" style="color:var(--text1);">${T(t==null?void 0:t.maxHistoricoVL)}</div>
            <div class="fondo-strip-sub">Pico del fondo</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Drawdown Actual</div>
            <div class="fondo-strip-val" style="color:${((t==null?void 0:t.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${N(((t==null?void 0:t.drawdownActual)||0)*100)}</div>
            <div class="fondo-strip-sub">Desde el máximo</div>
          </div>
        </div>

        <!-- Métricas detalladas -->
        <div class="fondo-section">Rentabilidad</div>
        <div class="fondo-metrics">
          ${I("YTD",N(((t==null?void 0:t.ytd)||0)*100),null,"neu","Rentabilidad acumulada desde el 1 de enero del año en curso.")}
          ${I("MTD",(t==null?void 0:t.mtd)!=null?N(t.mtd*100):"—",null,"neu","Rentabilidad del mes en curso. Requiere snapshot fin de mes anterior.")}
          ${I("P&L Realizado",P(w),w>=0?"Ganancia":"Pérdida",w>=0?"good":"bad","Suma de beneficios y pérdidas de todas las operaciones cerradas.")}
          ${I("P&L No Realizado",P(d),d>=0?"Latente+":"Latente−",d>=0?"good":"warn","P&L de las posiciones abiertas a precio actual. Se actualiza al abrir Posiciones.")}
          ${I("Valor Liquidativo",T(D),null,"neu",`Precio por participación hoy. Inicio: ${L.toFixed(4)}. Sube/baja con el P&L de la cartera.`)}
          ${I("Valor Cartera",P(p),null,"neu",`VL (${T(D)}) × ${((q=t==null?void 0:t.participaciones)==null?void 0:q.toFixed(2))||"—"} participaciones.`)}
        </div>

      </div>

      <!-- ══ TAB RIESGO ══ -->
      <div class="fondo-panel ${n==="riesgo"?"active":""}" id="fondo-panel-riesgo">
        <div class="fondo-section">Drawdown</div>
        <div class="fondo-strip" style="margin-bottom:16px;">
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Máx. Histórico VL</div>
            <div class="fondo-strip-val" style="color:var(--text1);">${T(t==null?void 0:t.maxHistoricoVL)}</div>
            <div class="fondo-strip-sub">Pico del fondo</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Drawdown Actual</div>
            <div class="fondo-strip-val" style="color:${((t==null?void 0:t.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${N(((t==null?void 0:t.drawdownActual)||0)*100)}</div>
            <div class="fondo-strip-sub">Desde el máximo</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Desde máximo (€)</div>
            <div class="fondo-strip-val" style="color:${((t==null?void 0:t.drawdownActual)||0)<0?"var(--red)":"var(--green)"};">${P(((t==null?void 0:t.drawdownActual)||0)*p)}</div>
            <div class="fondo-strip-sub">${((t==null?void 0:t.drawdownActual)||0)>=0?"En máximos":"Recuperar"}</div>
          </div>
          <div class="fondo-strip-cell">
            <div class="fondo-strip-lbl">Máx. Drawdown</div>
            <div class="fondo-strip-val" style="color:${((t==null?void 0:t.maxDD)||0)>.1?"var(--red)":"var(--amber)"};">${(t==null?void 0:t.maxDD)!=null?"-"+(t.maxDD*100).toFixed(1)+"%":"N/A"}</div>
            <div class="fondo-strip-sub">Histórico</div>
          </div>
        </div>

        <div class="fondo-section">Ratios ajustados por riesgo</div>
        <div class="fondo-metrics">
          ${(t==null?void 0:t.sharpe)!=null?I("Sharpe Ratio",t.sharpe.toFixed(2),t.sharpe>=1.5?"Excelente":t.sharpe>=1?"Sólido":t.sharpe>=.5?"Aceptable":"Débil",t.sharpe>=1?"good":t.sharpe>=.5?"warn":"bad","Retorno anualizado / volatilidad diaria × √252. Calculado sobre retornos diarios reales del VL."):I("Sharpe Ratio","N/A",null,"neu","Importa el histórico de precios para calcular.")}
          ${(t==null?void 0:t.sortino)!=null?I("Sortino Ratio",t.sortino.toFixed(2),t.sortino>=2?"Excelente":t.sortino>=1.5?"Bueno":"Aceptable",t.sortino>=1.5?"good":"warn","Como Sharpe pero penaliza solo la volatilidad bajista. >2 = gestión de riesgo sobresaliente."):I("Sortino Ratio","N/A",null,"neu","Sin días negativos en el VL o histórico insuficiente.")}
          ${I("Calmar Ratio",(t==null?void 0:t.calmar)!=null?t.calmar.toFixed(2):"N/A",(t==null?void 0:t.calmar)!=null?t.calmar>=1?"Bueno":"Vigilar":null,(t==null?void 0:t.calmar)!=null?t.calmar>=1?"good":"warn":"neu","CAGR / Máx. Drawdown histórico. >1 = el retorno compensa el peor dolor sufrido.")}
          ${(t==null?void 0:t.annVol)!=null?I("Volatilidad Anual.",(t.annVol*100).toFixed(1)+"%",t.annVol<.15?"Contenida":t.annVol<.25?"Moderada":"Alta",t.annVol<.15?"good":t.annVol<.25?"warn":"bad","Desviación estándar retornos diarios del VL × √252. Referencia: SP500 ~15-20%/año."):I("Volatilidad Anual.","N/A",null,"neu","Importa el histórico de precios para calcular.")}
          ${I("Días activo",(t==null?void 0:t.nDays)!=null?t.nDays+"d":"—",null,"neu",`Desde el ${X(t==null?void 0:t.startDate)} · ${(t==null?void 0:t.tradingDays)||0} sesiones · ${(t==null?void 0:t.nPuntos)||0} puntos en la serie VL.`)}
        </div>
      </div>

      <!-- ══ TAB TRADING ══ -->
      <div class="fondo-panel ${n==="trading"?"active":""}" id="fondo-panel-trading">
        ${(()=>{const o=tt(k),u=tt(k.filter(e=>(e.direction||"alcista")==="alcista")),b=tt(k.filter(e=>e.direction==="bajista")),h=(e,v=2)=>e!=null&&isFinite(e)?(e>=0?"+":"")+e.toFixed(v)+"%":"—",a=e=>e!=null&&isFinite(e)?(e<0?"-":"")+"€"+Math.abs(e).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}):"—";return o?`
          <div class="fondo-metrics" style="margin-bottom:16px;">
            ${I("Win Rate",o?Math.round(o.winRate*100)+"%":"—",o&&o.winRate>=.5?"Bueno":"Vigilar",o&&o.winRate>=.5?"good":"warn",o.n+" operaciones cerradas")}
            ${I("Profit Factor",o&&o.profitFactor!=null?o.profitFactor.toFixed(2):"—",o&&o.profitFactor>=1.5?"Sólido":o&&o.profitFactor>=1?"Aceptable":"Débil",o&&o.profitFactor>=1.5?"good":o&&o.profitFactor>=1?"neu":"bad","Ganancias brutas / pérdidas brutas. >1.5 = sistema robusto.")}
            ${I("Esperanza Mat.",o?h(o.esperanza*100):"—",o&&o.esperanza>=0?"Positiva":"Negativa",o&&o.esperanza>=0?"good":"bad","Retorno esperado por operación normalizada.")}
            ${I("Avg Win",o?"+"+o.avgWin.toFixed(1)+"%":"—",null,"good","Ganancia media de las operaciones ganadoras.")}
            ${I("Avg Loss",o?"-"+o.avgLoss.toFixed(1)+"%":"—",null,"warn","Pérdida media de las operaciones perdedoras.")}
            ${I("Payoff",o&&o.payoff!=null?o.payoff.toFixed(2):"—",o&&o.payoff>=1.5?"Bueno":"Neutral",o&&o.payoff>=1.5?"good":"neu","Avg Win / Avg Loss.")}
            ${I("Holding medio",(o==null?void 0:o.avgDays)!=null?o.avgDays+"d":"—",null,"neu","Días medios por operación cerrada.")}
            ${I("P&L Realizado",o!=null&&o.hasAbs?a(o.totalPL):"—",o&&o.totalPL>=0?"Ganancia":"Pérdida",o&&o.totalPL>=0?"good":"bad","Suma de todos los P&L realizados.")}
            ${I("Rent. media/op.",o?h(o.avgReturn):"—",o&&o.avgReturn>=0?"Positiva":"Negativa",o&&o.avgReturn>=0?"good":"bad","Rentabilidad media por operación cerrada.")}
          </div>

          <div class="fondo-section">Por estrategia</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
            ${["Alcista","Bajista"].map((e,v)=>{const r=v===0?u:b;return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;">
                <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:${v===0?"var(--green)":"var(--red)"};margin-bottom:12px;">${e} · ${r?r.n+" ops":"sin ops"}</div>
                ${r?[["Win Rate",Math.round(r.winRate*100)+"%"],["Avg Win","+"+r.avgWin.toFixed(1)+"%"],["Avg Loss","-"+r.avgLoss.toFixed(1)+"%"],["Profit Factor",r.profitFactor!=null?r.profitFactor.toFixed(2):"—"],["Esperanza",h(r.esperanza*100)],["Holding medio",r.avgDays!=null?r.avgDays+"d":"—"],["Rent. media/op",h(r.avgReturn)]].map(([B,K])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:11px;"><span style="color:var(--text2);">${B}</span><span style="font-family:var(--mono);font-weight:700;">${K}</span></div>`).join(""):'<div style="color:var(--text3);font-size:11px;padding:10px 0;">Sin operaciones</div>'}
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
                ${k.map(e=>{const v=e.entryDateISO&&e.exitDateISO?Math.round((new Date(e.exitDateISO)-new Date(e.entryDateISO))/864e5):null,r=(e.pnlPct||0)>=0?"var(--green)":"var(--red)";return`<tr>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);font-weight:700;">${e.ticker}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);"><span style="font-size:9px;padding:2px 7px;border-radius:10px;background:${(e.direction||"alcista")==="alcista"?"rgba(74,222,128,0.1)":"rgba(244,113,116,0.1)"};color:${(e.direction||"alcista")==="alcista"?"var(--green)":"var(--red)"};">${e.direction||"alcista"}</span></td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:var(--text3);">${e.entryDateISO||"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:var(--text3);">${e.exitDateISO||"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${v!=null?v+"d":"—"}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${r};">${h(e.pnlPct)}</td>
                    <td style="padding:9px 14px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);font-weight:700;color:${r};">${e.pnlAbs!=null?a(e.pnlAbs):"—"}</td>
                  </tr>`}).join("")}
              </tbody>
            </table>
          </div>`:'<div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Sin operaciones cerradas</div></div>'})()}
      </div>

      <!-- ══ TAB MOVIMIENTOS ══ -->
      <div class="fondo-panel ${n==="movimientos"?"active":""}" id="fondo-panel-movimientos">

        <!-- Formulario nueva aportación/retirada -->
        <div class="fondo-form">
          <div class="fondo-form-title">
            Registrar movimiento
            <span style="font-family:var(--mono);font-size:10px;color:var(--text3);">VL actual: ${T(D)}</span>
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
            <button class="btn btn-primary" id="mov-guardar" ${l?"":"disabled"}>Registrar</button>
          </div>
          ${l?"":'<div style="font-size:10px;color:var(--amber);margin-top:8px;">⚠ Inicializa el fondo primero en la pestaña Cotización</div>'}
        </div>

        <!-- Tabla movimientos -->
        ${(j=l==null?void 0:l.movimientos)!=null&&j.length?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
          <table class="fondo-mov-table">
            <thead><tr>
              <th>Fecha</th><th>Tipo</th><th class="r">Importe</th>
              <th class="r">VL</th><th class="r">Participaciones</th>
              <th class="r">Total Part.</th><th>Nota</th><th></th>
            </tr></thead>
            <tbody>
              ${[...l.movimientos].reverse().map((o,u)=>{var e,v,r;const b=l.movimientos.length-1-u,h=o.tipo==="aportacion"||o.tipo==="inicio"?"var(--green)":"var(--red)",a=o.tipo==="inicio"?"🏁 Inicio":o.tipo==="aportacion"?"▲ Aportación":"▼ Retirada";return`<tr>
                  <td>${X(o.date)}</td>
                  <td><span style="font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:10px;background:${h}22;color:${h};">${a}</span></td>
                  <td class="r" style="color:${h};">${P(Math.abs(o.importe))}</td>
                  <td class="r">${((e=o.vl)==null?void 0:e.toFixed(4))||"—"}</td>
                  <td class="r">${((v=o.participacionesMov)==null?void 0:v.toFixed(4))||"—"}</td>
                  <td class="r" style="color:var(--teal);">${((r=o.participacionesTotal)==null?void 0:r.toFixed(4))||"—"}</td>
                  <td style="color:var(--text3);font-size:10px;">${o.nota||"—"}</td>
                  <td class="r">
                    <button class="btn fondo-del-mov" data-idx="${b}" style="font-size:9px;padding:2px 8px;color:var(--red);border-color:rgba(244,113,116,0.3);">✕</button>
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
      <div class="fondo-panel ${n==="distribucion"?"active":""}" id="fondo-panel-distribucion">
        ${(()=>{const o=S.reduce((a,e)=>{const v=e.currentPrice||e.entry;return a+(v&&e.shares?v*e.shares:e.cost||0)},0),u=Math.max(0,p-o),b=[{label:"Capital invertido",val:o,col:"var(--teal)"},{label:"Cash disponible",val:u,col:"var(--blue)"}],h=p||1;return`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px 22px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:600;margin-bottom:16px;">Asignación del capital</div>
            <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:16px;">
              ${b.map(a=>`<div style="width:${(a.val/h*100).toFixed(1)}%;background:${a.col};"></div>`).join("")}
            </div>
            ${b.map(a=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:8px;height:8px;border-radius:2px;background:${a.col};"></div>
                <span style="font-size:12px;">${a.label}</span>
              </div>
              <div style="display:flex;gap:20px;">
                <span style="font-family:var(--mono);font-size:12px;color:var(--text3);">${(a.val/h*100).toFixed(1)}%</span>
                <span style="font-family:var(--mono);font-size:12px;color:var(--text1);font-weight:600;">${P(a.val)}</span>
              </div>
            </div>`).join("")}
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;">
              <span style="font-weight:700;">Valor total fondo</span>
              <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--teal);">${P(p)}</span>
            </div>
          </div>

          <!-- Posiciones abiertas -->
          ${S.length?`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
            <div style="padding:16px 20px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">${S.length} posiciones abiertas</div>
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead><tr style="background:var(--surface2);">
                <th style="padding:8px 16px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Ticker</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Valor</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Peso</th>
                <th style="padding:8px 16px;text-align:right;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">P&L</th>
              </tr></thead>
              <tbody>
                ${S.map(a=>{const e=a.currentPrice||a.entry,v=e&&a.shares?e*a.shares:a.cost||0,r=a.shares&&a.entry?(a.direction||"alcista")==="bajista"?(a.entry-e)*a.shares:(e-a.entry)*a.shares:null,z=(v/h*100).toFixed(1);return`<tr>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);font-weight:700;">${a.ticker}</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${P(v)}</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);">${z}%</td>
                    <td style="padding:10px 16px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono);color:${r>=0?"var(--green)":"var(--red)"};">${r!=null?P(r):"—"}</td>
                  </tr>`}).join("")}
              </tbody>
            </table>
          </div>`:'<div class="empty"><div class="empty-icon">📂</div><div class="empty-title">Sin posiciones abiertas</div></div>'}`})()}
      </div>
    `,s.querySelectorAll(".fondo-tab").forEach(o=>{o.addEventListener("click",()=>{var u;n=o.dataset.tab,pt("car-fondo",{activeTab:n}),s.querySelectorAll(".fondo-tab").forEach(b=>b.classList.remove("active")),s.querySelectorAll(".fondo-panel").forEach(b=>b.classList.remove("active")),o.classList.add("active"),(u=s.querySelector(`#fondo-panel-${n}`))==null||u.classList.add("active")})}),(W=document.getElementById("fondo-init-btn"))==null||W.addEventListener("click",async()=>{var b,h;const o=parseFloat((b=document.getElementById("fondo-init-importe"))==null?void 0:b.value),u=(h=document.getElementById("fondo-init-fecha"))==null?void 0:h.value;if(!o||o<=0)return alert("Introduce un importe válido");if(!u)return alert("Introduce una fecha de inicio");await ft(o,u,"Capital inicial"),x()});const G=()=>{var a,e;const o=parseFloat((a=document.getElementById("mov-importe"))==null?void 0:a.value),u=(e=document.getElementById("mov-tipo"))==null?void 0:e.value,b=document.getElementById("mov-preview");if(!b)return;if(!l||!o||o<=0){b.textContent="";return}const h=(o/D).toFixed(4);b.textContent=u==="aportacion"?`→ Se emitirán ${h} participaciones al VL ${T(D)}`:`→ Se cancelarán ${h} participaciones al VL ${T(D)}`};(Y=document.getElementById("mov-importe"))==null||Y.addEventListener("input",G),(U=document.getElementById("mov-tipo"))==null||U.addEventListener("change",G),s.querySelectorAll(".fondo-del-mov").forEach(o=>{o.addEventListener("click",async()=>{const u=parseInt(o.dataset.idx),b=l.movimientos[u];if(!confirm(`¿Eliminar ${b.tipo} de ${P(Math.abs(b.importe))} del ${X(b.date)}?`))return;l.movimientos.splice(u,1);let h=0;l.movimientos=l.movimientos.map(a=>(a.tipo==="inicio"||a.tipo==="aportacion"?h+=a.participacionesMov||0:a.tipo==="retirada"&&(h-=a.participacionesMov||0),{...a,participacionesTotal:h})),l.participaciones=h,await ot(l),x()})}),(V=document.getElementById("mov-guardar"))==null||V.addEventListener("click",async()=>{var a,e,v,r;if(!l)return;const o=(a=document.getElementById("mov-tipo"))==null?void 0:a.value,u=parseFloat((e=document.getElementById("mov-importe"))==null?void 0:e.value),b=(v=document.getElementById("mov-fecha"))==null?void 0:v.value,h=(r=document.getElementById("mov-nota"))==null?void 0:r.value.trim();if(!u||u<=0)return alert("Introduce un importe válido");if(!b)return alert("Selecciona una fecha");try{await xt(o,u,b,h,p),document.getElementById("mov-importe").value="",document.getElementById("mov-nota").value="",x()}catch(z){alert("Error: "+z.message)}})}return(y=document.getElementById("fondo-refresh"))==null||y.addEventListener("click",x),($=document.getElementById("fondo-backfill-btn"))==null||$.addEventListener("click",async()=>{const s=document.getElementById("fondo-backfill-btn");s.disabled=!0;try{const[l,S]=await Promise.all([A.get("ethan_positions").then(d=>d||[]),A.get("ethan_positions_history").then(d=>d||[])]),k=new Date().toISOString().slice(0,10);let F=0,E=0,c=0;const w={"3GOL":"3GOL.MI"};for(const d of S){if(!d.ticker||!d.entryDateISO||!d.exitDateISO)continue;const p=w[d.ticker]||d.ticker;s.textContent=`⏳ ${p}...`;try{const D=await it(p,d.entryDateISO,d.exitDateISO);if(d.exit&&D.length>0){const t=D.reduce((R,C)=>R.date>C.date?R:C);t.close=d.exit}await rt(d.ticker,D,"inactive"),E+=D.length,F++}catch(D){c++,console.warn("Backfill "+p+":",D.message)}}for(const d of l)if(!(!d.ticker||!d.entryDate)){s.textContent=`⏳ ${d.ticker}...`;try{const p=await it(d.ticker,d.entryDate,k);await rt(d.ticker,p,"active"),E+=p.length,F++}catch(p){c++,console.warn("Backfill "+d.ticker+":",p.message)}}s.textContent=`✓ ${F} tickers · ${E} días${c?" · "+c+" errores":""}`,setTimeout(()=>{s.disabled=!1,s.textContent="📥 Importar histórico",x()},4e3)}catch(l){s.textContent="⚠ "+l.message.slice(0,40),setTimeout(()=>{s.disabled=!1,s.textContent="📥 Importar histórico"},3e3)}}),x(),{destroy(){var s;(s=document.getElementById("fondo-css"))==null||s.remove()}}}export{$t as render};
