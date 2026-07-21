// ═══════════════════════════════════════════════
// MÓDULO: 4.6 Backtesting · Sistema Alcista
// Motor: condiciones M+S del sistema ETHAN
// Entrada: Diario o Semanal (configurable)
// Salida: EMA10 Diario o Semanal (configurable)
// Sizing: % fijo, Kelly o ATR (Money Management)
// ═══════════════════════════════════════════════

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
];

// ── Indicadores (idénticos a rv-analisis.js) ──
function ema(arr, p) {
  const k=2/(p+1), out=new Array(arr.length).fill(null);
  let s=arr.findIndex(v=>v!=null&&!isNaN(v));
  if(s<0)return out; out[s]=arr[s];
  for(let i=s+1;i<arr.length;i++){
    const v=(arr[i]!=null&&!isNaN(arr[i]))?arr[i]:out[i-1];
    out[i]=v*k+out[i-1]*(1-k);
  }
  return out;
}
function sma(arr,p){
  return arr.map((_,i)=>{
    if(i<p-1)return null;
    const sl=arr.slice(i-p+1,i+1).filter(v=>v!=null&&!isNaN(v));
    return sl.length===p?sl.reduce((a,b)=>a+b,0)/p:null;
  });
}
function macd(c,f=12,s=26,sig=9){
  const ef=ema(c,f),es=ema(c,s);
  const m=ef.map((v,i)=>(v!=null&&es[i]!=null)?v-es[i]:null);
  const sl=ema(m.map(v=>v??0),sig);
  return{m,sl,hist:m.map((v,i)=>(v!=null&&sl[i]!=null)?v-sl[i]:null)};
}
function rsi(c,p=14){
  const out=new Array(c.length).fill(null);
  if(c.length<p+1)return out;
  let g=0,l=0;
  for(let i=1;i<=p;i++){const d=c[i]-c[i-1];d>0?g+=d:l-=d;}
  let ag=g/p,al=l/p;
  out[p]=al===0?100:100-(100/(1+ag/al));
  for(let i=p+1;i<c.length;i++){
    const d=c[i]-c[i-1];
    ag=(ag*(p-1)+(d>0?d:0))/p;al=(al*(p-1)+(d<0?-d:0))/p;
    out[i]=al===0?100:100-(100/(1+ag/al));
  }
  return out;
}
function stoch(H,L,C,p=14,sk=3){
  const rk=C.map((c,i)=>{
    if(i<p-1)return null;
    const hh=Math.max(...H.slice(i-p+1,i+1)),ll=Math.min(...L.slice(i-p+1,i+1));
    return hh===ll?50:(c-ll)/(hh-ll)*100;
  });
  const k=sma(rk,sk);
  return{k,d:sma(k.map(v=>v??0),3)};
}
function resampleWeekly(ts,O,H,L,C,V){
  const g={};
  ts.forEach((t,i)=>{
    const dd=new Date(t*1000),dy=dd.getDay(),df=dd.getDate()-dy+(dy===0?-6:1);
    const mo=new Date(+dd);mo.setDate(df);const key=mo.toISOString().slice(0,10);
    if(!g[key])g[key]={o:O[i],h:H[i],l:L[i],c:C[i],v:V[i],dates:[new Date(t*1000).toISOString().slice(0,10)]};
    else{g[key].h=Math.max(g[key].h,H[i]);g[key].l=Math.min(g[key].l,L[i]);g[key].c=C[i];g[key].v+=V[i];g[key].dates.push(new Date(t*1000).toISOString().slice(0,10));}
  });
  const keys=Object.keys(g).sort();
  return{O:keys.map(k=>g[k].o),H:keys.map(k=>g[k].h),L:keys.map(k=>g[k].l),C:keys.map(k=>g[k].c),V:keys.map(k=>g[k].v),dates:keys,lastDates:keys.map(k=>g[k].dates[g[k].dates.length-1])};
}
function resampleMonthly(ts,O,H,L,C,V){
  const g={};
  ts.forEach((t,i)=>{
    const dd=new Date(t*1000);
    const key=`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}`;
    if(!g[key])g[key]={o:O[i],h:H[i],l:L[i],c:C[i],v:V[i]};
    else{g[key].h=Math.max(g[key].h,H[i]);g[key].l=Math.min(g[key].l,L[i]);g[key].c=C[i];g[key].v+=V[i];}
  });
  const keys=Object.keys(g).sort();
  return{O:keys.map(k=>g[k].o),H:keys.map(k=>g[k].h),L:keys.map(k=>g[k].l),C:keys.map(k=>g[k].c),V:keys.map(k=>g[k].v),dates:keys};
}
function atr(H,L,C,p=14){
  const tr=H.map((h,i)=>i===0?h-L[i]:Math.max(h-L[i],Math.abs(h-C[i-1]),Math.abs(L[i]-C[i-1])));
  const a=new Array(tr.length).fill(null);
  if(tr.length<p)return a;
  a[p-1]=tr.slice(0,p).reduce((s,v)=>s+v,0)/p;
  for(let i=p;i<tr.length;i++)a[i]=(a[i-1]*(p-1)+tr[i])/p;
  return a;
}

// ── Fetch Yahoo 3 años ────────────────────────
async function fetchHistory(ticker){
  const url=`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3y&events=history`;
  for(const fn of PROXIES){
    try{
      const r=await fetch(fn(url),{signal:AbortSignal.timeout(12000)});
      if(!r.ok)continue;
      const j=JSON.parse(await r.text());
      const res=j?.chart?.result?.[0];if(!res)continue;
      const q=res.indicators?.quote?.[0];if(!q)continue;
      const adj=res.indicators?.adjclose?.[0]?.adjclose||q.close;
      const ratio=adj.map((a,i)=>(q.close[i]&&a)?a/q.close[i]:1);
      return{
        ts:res.timestamp,
        O:q.open.map((v,i)=>v*ratio[i]),
        H:q.high.map((v,i)=>v*ratio[i]),
        L:q.low.map((v,i)=>v*ratio[i]),
        C:adj, V:q.volume,
        name:res.meta?.shortName||res.meta?.longName||ticker,
        currency:res.meta?.currency||'USD',
      };
    }catch{}
  }
  throw new Error(`No se pudo obtener histórico de ${ticker}`);
}

// ── Condiciones M+S del sistema ETHAN ─────────
function checkCondicionMensual(M,i){
  if(i<1)return false;
  const mm=macd(M.C),s89=stoch(M.H,M.L,M.C,89),s8=stoch(M.H,M.L,M.C,8),r14=rsi(M.C,14),e10=ema(M.C,10);
  const macdOk=mm.m[i]>0&&mm.m[i]>mm.sl[i];
  const s89Ok=(s89.k[i]>80&&s89.k[i]>s89.d[i])||s89.k[i]>92;
  const rsiOk=r14[i]>65;
  const s8Ok=s8.k[i]>78;
  const precioOk=e10[i]!=null&&M.C[i]>e10[i];
  return macdOk&&s89Ok&&rsiOk&&s8Ok&&precioOk;
}
function checkCondicionSemanal(W,i){
  if(i<1)return false;
  const wm=macd(W.C),s89=stoch(W.H,W.L,W.C,89),r14=rsi(W.C,14),e20=ema(W.C,20);
  const macdOk=wm.m[i]>0&&wm.m[i]>wm.sl[i];
  const s89Ok=(s89.k[i]>85&&s89.k[i]>s89.d[i])||s89.k[i]>92;
  const rsiOk=r14[i]>67;
  const precioOk=e20[i]!=null&&W.C[i]>e20[i];
  return macdOk&&s89Ok&&rsiOk&&precioOk;
}
// Señales de entrada — idénticas a rv-analisis.js
// Señal 1: MACD+RSI Diario (señal_diaria)
function señalMACDRSIDiario(data,i){
  const dm=macd(data.C);
  const r14=rsi(data.C,14);
  if(i<1)return false;
  return dm.m[i]>0 && dm.m[i]>dm.sl[i] && dm.m[i-1]<=dm.sl[i-1] && r14[i]>59;
}
// Señal 2: Rebote EMA5 Semanal
function señalEMA5Semanal(W,i){
  const e5=ema(W.C,5);
  const r14=rsi(W.C,14);
  if(!e5[i]||!W.C[i])return false;
  return r14[i]>50 && W.C[i]>e5[i]*0.995 && W.C[i]<e5[i]*1.02;
}
// Señal 3: Stoch89 Semanal >85
function señalStoch89Semanal(W,i){
  const s89=stoch(W.H,W.L,W.C,89);
  return s89.k[i]!=null&&s89.k[i]>85;
}
// Señal 4: RSI5 Pullback Semanal <40
function señalRSI5Semanal(W,i){
  const r5=rsi(W.C,5);
  return r5[i]!=null&&r5[i]<40;
}
function checkEntradaDiario(data,i,W,wi){
  // Cualquiera de las 4 señales activa
  return señalMACDRSIDiario(data,i)
      || señalEMA5Semanal(W,wi)
      || señalStoch89Semanal(W,wi)
      || señalRSI5Semanal(W,wi);
}
function checkEntradaSemanal(W,i){
  // Señales semanales únicamente
  return señalEMA5Semanal(W,i)
      || señalStoch89Semanal(W,i)
      || señalRSI5Semanal(W,i);
}
function checkSalidaDiario(data,i){
  const e10=ema(data.C,10);
  return data.C[i]!=null&&e10[i]!=null&&data.C[i]<e10[i];
}
function checkSalidaSemanal(W,i){
  const e10=ema(W.C,10);
  return W.C[i]!=null&&e10[i]!=null&&W.C[i]<e10[i];
}

// ── Sizing ────────────────────────────────────
function calcShares(capital,precio,config,atrVal,winRate){
  const{sizingMethod,riskPct,kellyFraction}=config;
  if(sizingMethod==='fijo'){
    const invested=capital*(riskPct/100);
    return Math.floor(invested/precio);
  }
  if(sizingMethod==='kelly'){
    const rr=1.5; // ratio ganancia/pérdida asumido
    const f=Math.max(0,(winRate-(1-winRate)/rr)*kellyFraction);
    return Math.floor(capital*f/precio);
  }
  if(sizingMethod==='atr'&&atrVal){
    const targetRisk=capital*(riskPct/100);
    return Math.max(1,Math.floor(targetRisk/atrVal));
  }
  return Math.floor(capital*(riskPct/100)/precio);
}

// ── Motor de backtesting ──────────────────────
function runBacktest(data,config){
  const{entradaTF,salidaTF,capital:capitalInicial}=config;
  const{ts,O,H,L,C,V}=data;
  const n=C.length;

  const W=resampleWeekly(ts,O,H,L,C,V);
  const M=resampleMonthly(ts,O,H,L,C,V);
  const atrD=atr(H,L,C,14);

  // Precalcular condiciones M+S para cada día
  // Mapear día → índice semanal y mensual más reciente
  const trades=[];
  let inTrade=false;
  let entry={};
  let equityCurve=[{date:new Date(ts[0]*1000).toISOString().slice(0,10),equity:capitalInicial}];
  let capital=capitalInicial;
  let prevWinRate=0.5; // inicial

  for(let i=50;i<n;i++){
    const date=new Date(ts[i]*1000).toISOString().slice(0,10);
    const precio=C[i];
    if(!precio)continue;

    // Encontrar índice semanal y mensual correspondiente
    const dateStr=date;
    const wi=W.dates.findIndex((d,idx)=>W.lastDates[idx]>=dateStr||idx===W.dates.length-1);
    const wIdx=Math.max(0,Math.min(wi,W.C.length-1));
    const monthStr=date.slice(0,7);
    const mi=M.dates.findIndex(d=>d>=monthStr);
    const mIdx=Math.max(0,mi<0?M.C.length-1:mi);

    if(!inTrade){
      // Comprobar condiciones M+S
      const mensualOk=mIdx>=2&&checkCondicionMensual(M,mIdx-1);
      const semanalOk=wIdx>=2&&checkCondicionSemanal(W,wIdx-1);

      if(mensualOk&&semanalOk){
        // Comprobar señal de entrada
        let entrar=false;
        if(entradaTF==='diario'&&i>0)entrar=checkEntradaDiario(data,i,W,wIdx);
        else if(entradaTF==='semanal'&&wIdx>0)entrar=checkEntradaSemanal(W,wIdx);

        if(entrar){
          const shares=calcShares(capital,precio,config,atrD[i],prevWinRate);
          if(shares>0&&shares*precio<=capital){
            inTrade=true;
            entry={i,date,precio,shares,coste:shares*precio};
          }
        }
      }
    } else {
      // Comprobar salida
      let salir=false;
      if(salidaTF==='diario')salir=checkSalidaDiario(data,i);
      else if(salidaTF==='semanal'&&wIdx>0)salir=checkSalidaSemanal(W,wIdx);

      // También salir si rompe condiciones M+S
      const mensualOk=mIdx>=1&&checkCondicionMensual(M,mIdx-1);
      const semanalOk=wIdx>=1&&checkCondicionSemanal(W,wIdx-1);
      if(!mensualOk||!semanalOk)salir=true;

      if(salir||i===n-1){
        const pnlPct=(precio-entry.precio)/entry.precio*100;
        const pnlAbs=(precio-entry.precio)*entry.shares;
        const dias=Math.round((new Date(date)-new Date(entry.date))/86400000);
        capital+=pnlAbs;
        trades.push({
          entryDate:entry.date,exitDate:date,
          entryPrice:entry.precio,exitPrice:precio,
          shares:entry.shares,coste:entry.coste,
          pnlPct,pnlAbs,dias,
        });
        prevWinRate=trades.filter(t=>t.pnlPct>0).length/trades.length;
        inTrade=false;
        equityCurve.push({date,equity:capital});
      }
    }
    // Marcar a mercado si en trade
    if(inTrade) equityCurve.push({date,equity:capital+(precio-entry.precio)*entry.shares});
  }

  // Métricas
  const wins=trades.filter(t=>t.pnlPct>0);
  const losses=trades.filter(t=>t.pnlPct<=0);
  const winRate=trades.length?wins.length/trades.length:0;
  const avgWin=wins.length?wins.reduce((s,t)=>s+t.pnlPct,0)/wins.length:0;
  const avgLoss=losses.length?Math.abs(losses.reduce((s,t)=>s+t.pnlPct,0)/losses.length):0;
  const profitFactor=avgLoss>0?(winRate*avgWin)/((1-winRate)*avgLoss):null;
  const totalReturn=(capital-capitalInicial)/capitalInicial;
  const buyHold=(C[n-1]-C[50])/C[50];
  const avgDias=trades.length?Math.round(trades.reduce((s,t)=>s+t.dias,0)/trades.length):0;

  // Max Drawdown sobre equity curve
  let peak=capitalInicial,maxDD=0;
  equityCurve.forEach(p=>{
    if(p.equity>peak)peak=p.equity;
    const dd=(peak-p.equity)/peak;
    if(dd>maxDD)maxDD=dd;
  });

  return{trades,equityCurve,capital,capitalInicial,
    winRate,avgWin,avgLoss,profitFactor,totalReturn,buyHold,avgDias,maxDD,
    nTrades:trades.length};
}

// ── SVG Equity Curve ──────────────────────────
function equityChart(curve,capitalInicial){
  if(!curve||curve.length<2)return '';
  const vals=curve.map(p=>p.equity);
  const W=820,H=200;
  const min=Math.min(...vals)*0.995,max=Math.max(...vals)*1.005,range=(max-min)||1;
  const toX=i=>(i/(vals.length-1)*W).toFixed(1);
  const toY=v=>(H-((v-min)/range*H)).toFixed(1);
  const pts=vals.map((v,i)=>`${toX(i)},${toY(v)}`).join(' ');
  const last=vals[vals.length-1];
  const col=last>=capitalInicial?'#40d9c0':'#f47174';
  const baseY=toY(capitalInicial);
  const area=`0,${H} ${pts} ${W},${H}`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px;display:block;">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${col}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <line x1="0" y1="${baseY}" x2="${W}" y2="${baseY}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="8" y="${parseFloat(baseY)-4}" font-family="IBM Plex Mono" font-size="9" fill="var(--text3)">Capital inicial</text>
    <polygon points="${area}" fill="url(#eg)"/>
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${W}" cy="${toY(last)}" r="4" fill="${col}"/>
  </svg>`;
}

const fmtPct=(n,d=2)=>n!=null&&isFinite(n)?(n>=0?'+':'')+n.toFixed(d)+'%':'—';
const fmtE=n=>n!=null&&isFinite(n)?(n<0?'-':'')+'€'+Math.abs(n).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0}):'—';
const fmtDate=d=>d?new Date(d+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}):'—';

// ── CSS ───────────────────────────────────────
const CSS=`
.bt-wrap{font-family:var(--sans);}
.bt-config{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.bt-config-title{font-size:13px;font-weight:600;margin-bottom:16px;}
.bt-config-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px;}
.bt-field label{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);display:block;margin-bottom:5px;}
.bt-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;}
.bt-strip-cell{background:var(--surface);padding:14px 16px;}
.bt-strip-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:6px;}
.bt-strip-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.bt-strip-sub{font-size:10px;color:var(--text3);margin-top:3px;}
.bt-chart{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;}
.bt-table{width:100%;border-collapse:collapse;font-size:11px;}
.bt-table th{padding:8px 12px;text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.bt-table th:first-child,.bt-table td:first-child{text-align:left;}
.bt-table td{padding:9px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);text-align:right;color:var(--text2);}
.bt-table tbody tr:last-child td{border-bottom:none;}
.bt-table tbody tr:hover td{background:var(--surface2);}
`;

// ── RENDER ────────────────────────────────────
export async function render(container,{actionsSlot}){
  if(!document.getElementById('bt-css')){
    const s=document.createElement('style');s.id='bt-css';s.textContent=CSS;
    document.head.appendChild(s);
  }
  actionsSlot.innerHTML='';
  container.innerHTML=`<div class="bt-wrap" id="bt-wrap"></div>`;

  function paint(result,config,tickerName){
    const el=document.getElementById('bt-wrap');
    const{trades,equityCurve,capital,capitalInicial,winRate,avgWin,avgLoss,profitFactor,totalReturn,buyHold,avgDias,maxDD,nTrades}=result;
    const twrCol=totalReturn>=0?'var(--green)':'var(--red)';
    const bhCol=buyHold>=0?'var(--green)':'var(--red)';

    el.innerHTML=`
      <!-- Configuración -->
      ${renderConfig(config)}

      <!-- KPIs -->
      <div class="bt-strip">
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Rentabilidad</div>
          <div class="bt-strip-val" style="color:${twrCol};">${fmtPct(totalReturn*100)}</div>
          <div class="bt-strip-sub">vs Buy&Hold: <span style="color:${bhCol};">${fmtPct(buyHold*100)}</span></div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Capital Final</div>
          <div class="bt-strip-val" style="color:var(--teal);">${fmtE(capital)}</div>
          <div class="bt-strip-sub">desde ${fmtE(capitalInicial)}</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Win Rate</div>
          <div class="bt-strip-val" style="color:${winRate>=0.5?'var(--green)':'var(--red)'};">${Math.round(winRate*100)}%</div>
          <div class="bt-strip-sub">${nTrades} operaciones</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Profit Factor</div>
          <div class="bt-strip-val" style="color:${(profitFactor||0)>=1.5?'var(--green)':(profitFactor||0)>=1?'var(--amber)':'var(--red)'};">${profitFactor!=null?profitFactor.toFixed(2):'—'}</div>
          <div class="bt-strip-sub">Avg: +${avgWin.toFixed(1)}% / -${avgLoss.toFixed(1)}%</div>
        </div>
        <div class="bt-strip-cell">
          <div class="bt-strip-lbl">Máx. Drawdown</div>
          <div class="bt-strip-val" style="color:${maxDD<0.1?'var(--green)':maxDD<0.2?'var(--amber)':'var(--red)'};">-${(maxDD*100).toFixed(1)}%</div>
          <div class="bt-strip-sub">Media/op: ${avgDias}d</div>
        </div>
      </div>

      <!-- Equity Curve -->
      <div class="bt-chart">
        <div style="font-size:11px;font-weight:600;margin-bottom:10px;">${tickerName} · Equity Curve · ${config.entradaTF==='diario'?'Entrada Diaria':'Entrada Semanal'} · ${config.salidaTF==='diario'?'Salida EMA10D':'Salida EMA10S'}</div>
        ${equityChart(equityCurve,capitalInicial)}
        <div style="display:flex;gap:16px;margin-top:8px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          <span>— Equity del sistema</span>
          <span>Base = capital inicial (${fmtE(capitalInicial)})</span>
          <span>${equityCurve.length} puntos</span>
        </div>
      </div>

      <!-- Tabla operaciones -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;">
          ${nTrades} operaciones simuladas
        </div>
        <table class="bt-table">
          <thead><tr>
            <th>Entrada</th><th>Salida</th><th>Días</th>
            <th>Precio entrada</th><th>Precio salida</th>
            <th>P&L %</th><th>P&L €</th>
          </tr></thead>
          <tbody>
            ${trades.map(t=>{
              const col=t.pnlPct>=0?'var(--green)':'var(--red)';
              return `<tr>
                <td>${fmtDate(t.entryDate)}</td>
                <td>${fmtDate(t.exitDate)}</td>
                <td>${t.dias}d</td>
                <td>$${t.entryPrice.toFixed(2)}</td>
                <td>$${t.exitPrice.toFixed(2)}</td>
                <td style="color:${col};font-weight:700;">${fmtPct(t.pnlPct)}</td>
                <td style="color:${col};font-weight:700;">${fmtE(t.pnlAbs)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        ${nTrades===0?'<div class="empty" style="padding:30px;"><div class="empty-icon">📊</div><div class="empty-title">Sin señales en el período</div><div class="empty-desc">Las condiciones M+S no se cumplieron suficientemente en los últimos 3 años</div></div>':''}
      </div>
    `;
    // Re-attach listeners del config
    attachConfigListeners(config);
  }

  function renderConfig(config={}){
    return `<div class="bt-config">
      <div class="bt-config-title">Configuración del Backtest</div>
      <div class="bt-config-grid">
        <div class="bt-field">
          <label>Ticker</label>
          <input type="text" id="bt-ticker" class="wl-input" placeholder="ej. AAPL, NVDA..." value="${config.ticker||''}" style="text-transform:uppercase;">
        </div>
        <div class="bt-field">
          <label>Capital inicial (€)</label>
          <input type="number" id="bt-capital" class="wl-input" value="${config.capital||10000}">
        </div>
        <div class="bt-field">
          <label>Señal de entrada</label>
          <select id="bt-entrada" class="wl-input">
            <option value="diario" ${config.entradaTF==='diario'?'selected':''}>Diario (Stoch8↑ o MM alineadas)</option>
            <option value="semanal" ${config.entradaTF==='semanal'?'selected':''}>Semanal (Stoch89↑ + precio>EMA10)</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Señal de salida</label>
          <select id="bt-salida" class="wl-input">
            <option value="diario" ${config.salidaTF==='diario'?'selected':''}>EMA10 Diario</option>
            <option value="semanal" ${config.salidaTF==='semanal'?'selected':''}>EMA10 Semanal</option>
          </select>
        </div>
        <div class="bt-field">
          <label>Método de sizing</label>
          <select id="bt-sizing" class="wl-input">
            <option value="fijo" ${config.sizingMethod==='fijo'?'selected':''}>% Fijo del capital</option>
            <option value="kelly" ${config.sizingMethod==='kelly'?'selected':''}>½ Kelly</option>
            <option value="atr" ${config.sizingMethod==='atr'?'selected':''}>Volatilidad ATR</option>
          </select>
        </div>
        <div class="bt-field">
          <label>% Capital por operación</label>
          <input type="number" id="bt-risk" class="wl-input" value="${config.riskPct||20}" min="1" max="100">
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="btn btn-primary" id="bt-run-btn" style="min-width:140px;">▶ Ejecutar backtest</button>
        <span id="bt-status" style="font-family:var(--mono);font-size:11px;color:var(--text3);"></span>
      </div>
    </div>`;
  }

  function attachConfigListeners(currentConfig={}){
    document.getElementById('bt-run-btn')?.addEventListener('click',async()=>{
      const ticker=(document.getElementById('bt-ticker')?.value||'').trim().toUpperCase();
      if(!ticker)return;
      const config={
        ticker,
        capital:parseFloat(document.getElementById('bt-capital')?.value)||10000,
        entradaTF:document.getElementById('bt-entrada')?.value||'diario',
        salidaTF:document.getElementById('bt-salida')?.value||'diario',
        sizingMethod:document.getElementById('bt-sizing')?.value||'fijo',
        riskPct:parseFloat(document.getElementById('bt-risk')?.value)||20,
        kellyFraction:0.5,
      };
      const btn=document.getElementById('bt-run-btn');
      const st=document.getElementById('bt-status');
      btn.disabled=true; btn.textContent='⏳ Descargando...';
      if(st)st.textContent=`Descargando 3 años de ${ticker}...`;
      try{
        const data=await fetchHistory(ticker);
        if(st)st.textContent='Ejecutando simulación...';
        await new Promise(r=>setTimeout(r,50)); // yield para update UI
        const result=runBacktest(data,config);
        paint(result,config,data.name||ticker);
      }catch(e){
        btn.disabled=false; btn.textContent='▶ Ejecutar backtest';
        if(st)st.textContent='⚠ '+e.message;
      }
    });
  }

  // Render inicial solo con config
  document.getElementById('bt-wrap').innerHTML=renderConfig();
  attachConfigListeners();

  return{destroy(){document.getElementById('bt-css')?.remove();}};
}
