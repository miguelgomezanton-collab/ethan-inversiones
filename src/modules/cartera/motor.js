// ═══════════════════════════════════════════════════════════════════
// MÓDULO: Motor Integrado de Cartera
// Portfolio State · Asset Allocation · Risk Budget · Position Sizing
// Pre-Trade Check · Propuestas · Parámetros
// ═══════════════════════════════════════════════════════════════════

import { UserData } from '../../userdata.js';
import { getCurrentUser } from '../../auth.js';
import { db } from '../../firebase.js';
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

// ── Helpers ──────────────────────────────────────────────────────
const fmtE  = n => (n<0?'−':'') + '€' + Math.abs(n).toLocaleString('es-ES',{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtP  = (n,d=1) => (n>=0?'+':'') + (n*100).toFixed(d) + '%';
const col   = n => n > 0.001 ? 'var(--green)' : n < -0.001 ? 'var(--red)' : 'var(--text2)';
const clamp = (v,mn,mx) => Math.min(mx, Math.max(mn, v));

// ── Policy default ────────────────────────────────────────────────
const POLICY_KEY = 'ethan_motor_policy';
const POLICY_DEFAULT = {
  version: '1.0', corePct: 0.50, satPct: 0.50,
  maxAssetNav: 0.20, maxSectorNav: 0.35,
  tradeRisk: 0.015, portRisk: 0.06, coreRisk: 0.03, satRisk: 0.04,
  ddScale: [1.00, 0.80, 0.60, 0.40, 0.25],
  coreUniverse: ['VTI','VEU','IEF','BNDX'],
  coreScoreThreshold: 6,
  coreMaxWeight: 0.40,
  satMaxWeight: 0.40,
  updatedAt: null,
};
let POLICY = { ...POLICY_DEFAULT };
let STATE  = null;

function getDDMult(dd) {
  const d = Math.abs(dd||0);
  if (d <= 0.03) return POLICY.ddScale[0];
  if (d <= 0.05) return POLICY.ddScale[1];
  if (d <= 0.08) return POLICY.ddScale[2];
  if (d <= 0.10) return POLICY.ddScale[3];
  return POLICY.ddScale[4];
}

// ── CSS ───────────────────────────────────────────────────────────
const CSS = `
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
`;

// ════════════════════════════════════════════════════════════════
// MOTOR TÉCNICO — funciones puras reutilizadas de allocation.js
// ════════════════════════════════════════════════════════════════
function mtEma(arr, p) {
  const k=2/(p+1), out=new Array(arr.length).fill(null);
  let s=arr.findIndex(v=>v!=null&&!isNaN(v));
  if(s<0)return out; out[s]=arr[s];
  for(let i=s+1;i<arr.length;i++){const v=(arr[i]!=null&&!isNaN(arr[i]))?arr[i]:out[i-1];out[i]=v*k+out[i-1]*(1-k);}
  return out;
}
function mtMacd(c){const ef=mtEma(c,12),es=mtEma(c,26);const m=ef.map((v,i)=>(v!=null&&es[i]!=null)?v-es[i]:null);return{m,sl:mtEma(m.map(v=>v??0),9)};}
function mtRsi(c,p=14){const out=new Array(c.length).fill(null);if(c.length<p+1)return out;let g=0,l=0;for(let i=1;i<=p;i++){const d=c[i]-c[i-1];d>0?g+=d:l-=d;}let ag=g/p,al=l/p;out[p]=al===0?100:100-(100/(1+ag/al));for(let i=p+1;i<c.length;i++){const d=c[i]-c[i-1];ag=(ag*(p-1)+(d>0?d:0))/p;al=(al*(p-1)+(d<0?-d:0))/p;out[i]=al===0?100:100-(100/(1+ag/al));}return out;}
function mtStoch(H,L,C,p){const rK=C.map((c,i)=>{if(i<p-1)return null;const hh=Math.max(...H.slice(i-p+1,i+1)),ll=Math.min(...L.slice(i-p+1,i+1));return hh===ll?50:(c-ll)/(hh-ll)*100;});const k=mtEma(rK,3);return{k,d:mtEma(k.map(v=>v??0),3)};}
function mtResample(ts,opens,highs,lows,closes,vols,freq){
  const groups={};
  ts.forEach((t,i)=>{const dd=new Date(t*1000);let key;
    if(freq==='W'){const day=dd.getDay();const diff=dd.getDate()-day+(day===0?-6:1);const mo=new Date(+dd);mo.setDate(diff);key=mo.toISOString().slice(0,10);}
    else key=`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}`;
    if(!groups[key])groups[key]={o:opens[i],h:highs[i],l:lows[i],c:closes[i],v:vols[i]};
    else{groups[key].h=Math.max(groups[key].h,highs[i]);groups[key].l=Math.min(groups[key].l,lows[i]);groups[key].c=closes[i];groups[key].v+=vols[i];}
  });
  const keys=Object.keys(groups).sort();
  return{dates:keys,opens:keys.map(k=>groups[k].o),highs:keys.map(k=>groups[k].h),lows:keys.map(k=>groups[k].l),closes:keys.map(k=>groups[k].c),vols:keys.map(k=>groups[k].v)};
}

function mtDailyVol(closes){
  if(!closes||closes.length<2)return null;
  const rets=[];for(let i=1;i<closes.length;i++)rets.push((closes[i]/closes[i-1])-1);
  const mean=rets.reduce((a,b)=>a+b,0)/rets.length;
  return Math.sqrt(rets.reduce((a,b)=>a+Math.pow(b-mean,2),0)/rets.length);
}

const AA_PROXIES = [
  u=>`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
];

async function mtFetchData(ticker) {
  const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2y&events=history`;
  for(const fn of AA_PROXIES){
    try{
      const ctrl=new AbortController();setTimeout(()=>ctrl.abort(),8000);
      const r=await fetch(fn(yUrl),{signal:ctrl.signal});if(!r.ok)continue;
      const text=await r.text();let j;try{j=JSON.parse(text);}catch{continue;}
      const res=j?.chart?.result?.[0];if(!res)continue;
      const q=res.indicators?.quote?.[0];if(!q)continue;
      const adj=res.indicators.adjclose?.[0]?.adjclose||q.close;
      const ratio=adj.map((a,i)=>(q.close[i]&&a)?a/q.close[i]:1);
      return{timestamps:res.timestamp,opens:q.open.map((v,i)=>v*ratio[i]),highs:q.high.map((v,i)=>v*ratio[i]),lows:q.low.map((v,i)=>v*ratio[i]),closes:adj,vols:q.volume};
    }catch{}
  }
  throw new Error(`Sin datos: ${ticker}`);
}

function mtAnalyzeAsset(raw) {
  const{timestamps,opens,highs,lows,closes,vols}=raw;
  const W=mtResample(timestamps,opens,highs,lows,closes,vols,'W');
  const M=mtResample(timestamps,opens,highs,lows,closes,vols,'M');
  const mm=mtMacd(M.closes),ms89=mtStoch(M.highs,M.lows,M.closes,89),mrsi=mtRsi(M.closes,14),mEma=mtEma(M.closes,10);
  const mi=M.closes.length-1;
  const wm=mtMacd(W.closes),ws89=mtStoch(W.highs,W.lows,W.closes,89),wrsi=mtRsi(W.closes,14),wEma=mtEma(W.closes,20);
  const wi=W.closes.length-1;
  const mc={macd:mm.m[mi]>0&&mm.m[mi]>mm.sl[mi],s89:(ms89.k[mi]>80&&ms89.k[mi]>ms89.d[mi])||ms89.k[mi]>92,rsi:mrsi[mi]>65,precio:mEma[mi]&&M.closes[mi]>mEma[mi]};
  const sc={macd:wm.m[wi]>0&&wm.m[wi]>wm.sl[wi],s89:(ws89.k[wi]>85&&ws89.k[wi]>ws89.d[wi])||ws89.k[wi]>92,rsi:wrsi[wi]>67,precio:wEma[wi]&&W.closes[wi]>wEma[wi]};
  const score=Object.values(mc).filter(x=>x).length+Object.values(sc).filter(x=>x).length;
  const last52=closes.slice(-252),cur=closes[closes.length-1];
  const min52=Math.min(...last52),max52=Math.max(...last52);
  const percentile=((cur-min52)/(max52-min52))*100;
  return{score,mensual:mc,semanal:sc,price:cur,closes:closes.slice(-60),percentile,min52,max52};
}

function mtInverseVol(candidates, maxWeight, totalPct=100) {
  const withVol=candidates.map(a=>({...a,vol:mtDailyVol(a.closes)})).filter(a=>a.vol&&a.vol>0);
  if(!withVol.length)return[];
  const invVols=withVol.map(a=>1/a.vol),sumIV=invVols.reduce((a,b)=>a+b,0);
  let pos=withVol.map((a,i)=>({...a,weightPct:(invVols[i]/sumIV)*totalPct}));
  const effMax=Math.max(maxWeight,1/pos.length)*totalPct;
  for(let iter=0;iter<10;iter++){
    const over=pos.filter(p=>p.weightPct>effMax);if(!over.length)break;
    let excess=0;pos.forEach(p=>{if(p.weightPct>effMax){excess+=p.weightPct-effMax;p.weightPct=effMax;}});
    const under=pos.filter(p=>p.weightPct<effMax),underSum=under.reduce((s,p)=>s+p.weightPct,0);
    if(!underSum||!under.length)break;
    under.forEach(p=>{p.weightPct+=p.weightPct/underSum*excess;});
  }
  return pos.sort((a,b)=>b.weightPct-a.weightPct);
}

// Guardar snapshot de decisión AA en Firestore
async function saveAASnapshot(snapshot) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    const key = `ethan_aa_snapshot_${new Date().toISOString().slice(0,10)}`;
    await UserData.set(key, { ...snapshot, savedAt: new Date().toISOString() });
  } catch {}
}

// ════════════════════════════════════════════════════════════════
// LOAD — carga de datos desde Firestore via UserData
// ════════════════════════════════════════════════════════════════
async function loadState() {
  try {
    // 1. Política
    const savedPolicy = await UserData.get(POLICY_KEY);
    if (savedPolicy) POLICY = { ...POLICY_DEFAULT, ...savedPolicy };

    // 2. Capital inicial por bucket
    const capA = (await UserData.get('ethan_capital_alcista')) || 0;
    const capB = (await UserData.get('ethan_capital_bajista')) || 0;
    const capitalInicial = capA + capB;

    // 3. Posiciones abiertas
    const rawPos = (await UserData.get('ethan_positions')) || [];

    // 4. Historial cerradas
    const history = (await UserData.get('ethan_positions_history')) || [];
    const pnlReal = history.reduce((s,h) => s + (h.pnlAbs||0), 0);

    // 5. Watchlist para sectores
    const watchlist = (await UserData.get('ethan_watchlist')) || [];
    const sectorMap = {};
    watchlist.forEach(w => { if (w.ticker && w.sector) sectorMap[w.ticker.toUpperCase()] = w.sector; });

    // Función EMA igual que cartera.js
    function calcEMA(closes, period) {
      const k = 2 / (period + 1);
      const ema = [closes[0]];
      for (let i = 1; i < closes.length; i++) {
        ema.push(closes[i] * k + ema[i-1] * (1-k));
      }
      return ema;
    }

    // 6. Precios actuales + stop inicial vs stop activo
    const positions = await Promise.all(rawPos.map(async p => {
      // Precio actual: leer el que calculó y persistió cartera.js (única fuente de verdad)
      // Prioridad: currentPrice persistido → entry como fallback
      let current = p.currentPrice > 0 ? p.currentPrice : (p.entry || 0);

      // Stop inicial — el que se fijó al abrir la operación
      const initialStop = p.entryStop || p.stopManual || 0;

      // Stop activo — leer el que calculó y persistió cartera.js
      // Prioridad: manual → activeStop persistido → stopDiario/semanal persistido → initialStop
      let activeStop = 0;
      if (p.stopType === 'manual' && p.stopManual > 0) {
        activeStop = p.stopManual;
      } else if (p.activeStop > 0) {
        activeStop = p.activeStop;
      } else if (p.stopType === 'semanal' && p.stopSemanal > 0) {
        activeStop = p.stopSemanal;
      } else if (p.stopDiario > 0) {
        activeStop = p.stopDiario;
      } else if (initialStop > 0) {
        activeStop = initialStop;
      }

      const dir    = p.direction || 'alcista';
      const shares = p.shares || (p.cost && p.entry ? Math.round(p.cost/p.entry) : 0);
      const cost   = shares * p.entry;
      const mktVal = shares * current;
      const pnlAbs = dir === 'bajista'
        ? (p.entry - current) * shares
        : (current - p.entry) * shares;
      const pnlPct = cost > 0 ? pnlAbs / cost : 0;

      // Riesgo inicial = distancia entrada → stop inicial × shares
      const initialRisk = initialStop > 0
        ? Math.abs(p.entry - initialStop) * shares
        : 0;

      // Capital actualmente en riesgo:
      // LONG: si activeStop >= entry → €0 (stop en beneficio, capital protegido)
      //       si activeStop <  entry → (entry - activeStop) × shares
      // SHORT: si activeStop <= entry → €0
      //        si activeStop >  entry → (activeStop - entry) × shares
      let capitalAtRisk = 0;
      if (activeStop > 0) {
        if (dir === 'bajista') {
          capitalAtRisk = activeStop > p.entry ? (activeStop - p.entry) * shares : 0;
        } else {
          capitalAtRisk = activeStop < p.entry ? (p.entry - activeStop) * shares : 0;
        }
      }

      // P&L at Risk = beneficio/valor actual que retrocedería hasta el stop
      // LONG: (current - activeStop) × shares  (siempre ≥ 0 si stop < current)
      // SHORT: (activeStop - current) × shares
      let pnlAtRisk = 0;
      if (activeStop > 0 && current > 0) {
        if (dir === 'bajista') {
          pnlAtRisk = Math.max(0, (activeStop - current) * shares);
        } else {
          pnlAtRisk = Math.max(0, (current - activeStop) * shares);
        }
      }

      const bucket = p.bucket || 'sat';
      const sector = p.sector || sectorMap[p.ticker?.toUpperCase()] || 'desconocido';

      return {
        ...p, current, pnlPct, pnlAbs, cost, mktVal,
        bucket, sector, dir, shares,
        initialStop, activeStop, initialRisk, capitalAtRisk, pnlAtRisk,
        // stop para compatibilidad con el resto del código
        stop: activeStop,
      };
    }));

    // 7. NAV = capital inicial + P&L realizado + P&L no realizado
    // (no usar capA+capB como NAV ya que es el capital inicial, no el valor actual)
    const unrealPnl  = positions.reduce((s,p) => s + p.pnlAbs, 0);
    const navActual   = capitalInicial + pnlReal + unrealPnl;
    const invested    = positions.reduce((s,p) => s + p.mktVal, 0);
    const cash        = Math.max(0, navActual - invested);

    const buckets = { core:0, sat:0 };
    const sectors = {};
    positions.forEach(p => {
      buckets[p.bucket] = (buckets[p.bucket]||0) + p.mktVal;
      sectors[p.sector] = (sectors[p.sector]||0) + p.mktVal;
    });

    // 8. Riesgo abierto = suma de capitalAtRisk de todas las posiciones
    // Si stop >= entry (LONG) o stop <= entry (SHORT): capital en riesgo = 0
    const openRisk = positions.reduce((s,p) => s + (p.capitalAtRisk||0), 0);

    // 9. Drawdown desde el fondo — HWM = max(hwmHistórico, navActual)
    const fondo  = await UserData.get('ethan_fondo');
    const VL0    = 100;
    const parts  = fondo?.participaciones || (capitalInicial / VL0);
    const vlActual = parts > 0 ? navActual / parts : VL0;
    // HWM histórico desde los movimientos del fondo
    let hwmVL = VL0;
    if (fondo?.movimientos) {
      hwmVL = Math.max(VL0, ...fondo.movimientos.map(m => m.vl||VL0));
    }
    // HWM nunca puede ser menor que el VL actual
    hwmVL = Math.max(hwmVL, vlActual);
    const hwm = hwmVL * parts;
    // Drawdown = navActual/hwm - 1, siempre ≤ 0
    const drawdownActual = hwm > 0 ? Math.min(0, navActual / hwm - 1) : 0;

    STATE = {
      nav: navActual, capitalInicial, cash, invested, unrealPnl, pnlReal,
      positions, buckets, sectors,
      openRisk, openRiskPct: navActual > 0 ? openRisk / navActual : 0,
      drawdownActual, hwm, vlActual,
      timestamp: new Date().toISOString(),
    };

    return true;
  } catch(e) {
    console.error('Motor loadState:', e);
    return false;
  }
}

// ════════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ════════════════════════════════════════════════════════════════
function renderState(el) {
  if (!STATE) return;
  const { nav, cash, invested, unrealPnl, openRisk, openRiskPct, drawdownActual, hwm, positions, buckets, sectors } = STATE;

  // Strip
  const setCell = (id, val, c) => {
    const e = el.querySelector('#mt-'+id);
    if (!e) return;
    e.textContent = val;
    if (c) e.style.color = c;
  };
  setCell('nav',      fmtE(nav),          'var(--teal)');
  setCell('cash',     fmtE(cash),         cash/nav>0.5?'var(--amber)':'var(--text1)');
  setCell('invested', fmtE(invested),      'var(--blue)');
  setCell('unreal',   (unrealPnl>=0?'+':'')+fmtE(unrealPnl), col(unrealPnl));
  setCell('dd',       fmtP(drawdownActual), Math.abs(drawdownActual)>0.08?'var(--red)':Math.abs(drawdownActual)>0.03?'var(--amber)':'var(--green)');
  setCell('risk',     fmtE(openRisk),      openRiskPct>POLICY.portRisk?'var(--red)':openRiskPct>POLICY.portRisk*0.7?'var(--amber)':'var(--green)');

  const sub = (id, txt) => { const e=el.querySelector('#mt-sub-'+id); if(e) e.textContent=txt; };
  sub('nav',      'HWM: '+fmtE(hwm));
  sub('cash',     (cash/nav*100).toFixed(1)+'% NAV');
  sub('invested', (invested/nav*100).toFixed(1)+'% NAV');
  sub('risk',     (openRiskPct*100).toFixed(2)+'% NAV');

  // Posiciones
  const posEl = el.querySelector('#mt-positions');
  posEl.innerHTML = !positions.length
    ? `<div style="text-align:center;padding:24px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas · Cash ${(cash/nav*100).toFixed(1)}%</div>`
    : `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:860px;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          ${['TICKER','DIR','ENTRADA','ACTUAL','P&L%','STOP INICIAL','STOP ACTIVO','CAP. EN RIESGO','P&L AT RISK','% NAV','BUCKET'].map(h=>
            `<th style="font-family:var(--mono);font-size:8px;text-transform:uppercase;color:var(--text3);padding:7px 8px;text-align:${['TICKER','DIR','BUCKET'].includes(h)?'left':'right'};">${h}</th>`
          ).join('')}
        </tr></thead>
        <tbody>
          ${positions.map(p => {
            const pctN = p.mktVal/nav;
            const stopColor = p.activeStop>0
              ? (p.dir==='bajista'?(p.activeStop<=p.current?'var(--green)':'var(--red)'):(p.activeStop>=p.entry?'var(--green)':'var(--red)'))
              : 'var(--text3)';
            return `<tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px;font-weight:700;">${p.ticker}</td>
              <td style="padding:8px;"><span class="mt-badge ${p.dir==='bajista'?'mt-fail':'mt-pass'}" style="font-size:8px;">${p.dir==='bajista'?'SHORT':'LONG'}</span></td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">$${p.entry.toFixed(2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">$${p.current.toFixed(2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${col(p.pnlPct)};">${fmtP(p.pnlPct,2)}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:var(--text3);">${p.initialStop>0?'$'+p.initialStop.toFixed(2):'—'}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${stopColor};">${p.activeStop>0?'$'+p.activeStop.toFixed(2):'—'}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:${p.capitalAtRisk>0?'var(--red)':'var(--green)'};">${p.capitalAtRisk>0?fmtE(p.capitalAtRisk):'€0 ✓'}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);color:var(--amber);">${p.pnlAtRisk>0?fmtE(p.pnlAtRisk):'—'}</td>
              <td style="padding:8px;text-align:right;font-family:var(--mono);">${(pctN*100).toFixed(1)}%</td>
              <td style="padding:8px;"><span style="font-family:var(--mono);font-size:9px;color:${p.bucket==='core'?'var(--teal)':'var(--purple)'};">${p.bucket.toUpperCase()}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>`;

  // Buckets
  const bEl = el.querySelector('#mt-buckets');
  bEl.innerHTML = ['core','sat'].map(b => {
    const pct = nav>0 ? buckets[b]/nav : 0;
    const tgt = b==='core' ? POLICY.corePct : POLICY.satPct;
    const clr = b==='core' ? 'var(--teal)' : 'var(--purple)';
    return `<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
        <span style="color:${clr};font-weight:700;">${b.toUpperCase()}</span>
        <span style="font-family:var(--mono);">${(pct*100).toFixed(1)}% <span style="color:var(--text3);">/ ${(tgt*100).toFixed(0)}%</span></span>
      </div>
      <div class="mt-bar-track">
        <div style="position:absolute;height:100%;width:${(tgt*100).toFixed(0)}%;background:${clr};opacity:0.15;border-radius:4px;left:0;top:0;"></div>
        <div class="mt-bar-fill" style="width:${clamp(pct/tgt*100,0,100).toFixed(1)}%;background:${clr};position:relative;"></div>
      </div>
    </div>`;
  }).join('');

  // Sectores
  const sEl = el.querySelector('#mt-sectors');
  const ss = Object.entries(sectors).sort((a,b)=>b[1]-a[1]);
  sEl.innerHTML = ss.length ? ss.map(([s,v]) => {
    const pct = nav>0?v/nav:0;
    const over = pct > POLICY.maxSectorNav;
    return `<div style="margin-bottom:7px;">
      <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;">
        <span style="color:var(--text2);">${s}</span>
        <span style="font-family:var(--mono);color:${over?'var(--red)':'var(--text1)'};">${(pct*100).toFixed(1)}%${over?' ⚠':''}</span>
      </div>
      <div class="mt-bar-track" style="height:5px;">
        <div class="mt-bar-fill" style="width:${clamp(pct*100,0,100).toFixed(1)}%;background:${over?'var(--red)':'var(--blue)'};"></div>
      </div>
    </div>`;
  }).join('') : `<div style="font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas</div>`;

  el.querySelector('#mt-timestamp').textContent = new Date(STATE.timestamp).toLocaleString('es-ES');
}

// ════════════════════════════════════════════════════════════════
// ASSET ALLOCATION ENGINE
// ════════════════════════════════════════════════════════════════
async function runAllocationEngine(el) {
  const nav = STATE?.nav || 0;
  const coreBudget = nav * POLICY.corePct;
  const satBudget  = nav * POLICY.satPct;

  // ── CORE ENGINE ──────────────────────────────────────────────
  const coreUniverse = POLICY.coreUniverse || ['VTI','VEU','IEF','BNDX'];
  const coreThreshold = POLICY.coreScoreThreshold ?? 6;
  const coreMaxW = POLICY.coreMaxWeight ?? 0.40;

  const coreEl = el.querySelector('#mt-aa-core-results');
  if (coreEl) coreEl.innerHTML = `<div class="mt-loader"><div class="mt-loader-ring"></div>Calculando señales CORE (${coreUniverse.join(', ')})...</div>`;

  let coreData = [];
  for (const ticker of coreUniverse) {
    try {
      const raw = await mtFetchData(ticker);
      const analysis = mtAnalyzeAsset(raw);
      // Inferir tipo desde ticker
      const type = ['IEF','BNDX','TLT','BND','AGG'].includes(ticker) ? 'RF' : 'RV';
      coreData.push({ ticker, type, ...analysis });
    } catch(e) {
      coreData.push({ ticker, error: e.message, score: 0 });
    }
  }

  // Decisión RV vs RF
  const rvAssets = coreData.filter(a => a.type==='RV' && !a.error);
  const rfAssets = coreData.filter(a => a.type==='RF' && !a.error);
  const rvScore  = rvAssets.reduce((s,a)=>s+a.score,0) / (rvAssets.length||1);
  const rfScore  = rfAssets.reduce((s,a)=>s+a.score,0) / (rfAssets.length||1);
  const decision = rvScore >= rfScore ? 'RV' : 'RF';
  const decisionLabel = decision === 'RV' ? 'Renta Variable' : 'Renta Fija';

  // Candidatos elegibles (tipo ganador + score ≥ threshold)
  const eligible = coreData.filter(a => !a.error && a.type===decision && a.score>=coreThreshold);

  // Si no hay elegibles, incluir todos los del tipo ganador
  const candidates = eligible.length > 0 ? eligible : coreData.filter(a => !a.error && a.type===decision);

  // Score medio y cash
  const scoreMedio = candidates.length > 0 ? candidates.reduce((s,a)=>s+a.score,0)/candidates.length : 0;
  const cashPct = Math.max(0, Math.min(100, ((8 - scoreMedio) / 8) * 100));
  const investedPct = 100 - cashPct;

  // Inverse volatility
  const corePositions = mtInverseVol(candidates, coreMaxW, investedPct);

  // Guardar snapshot
  const snapshot = {
    date: new Date().toISOString().slice(0,10),
    decision, decisionLabel, rvScore, rfScore, scoreMedio, cashPct,
    scores: coreData.map(a=>({ticker:a.ticker,score:a.score,type:a.type})),
    positions: corePositions.map(p=>({ticker:p.ticker,weightPct:p.weightPct})),
    nav, coreBudget,
  };
  await saveAASnapshot(snapshot);

  // ── SATÉLITE ENGINE — se ejecuta por separado desde el botón inline ──
  // (no se ejecuta aquí, el usuario introduce los tickers manualmente)

  // ── RENDER CORE ────────────────────────────────────────────────
  renderCoreEngine(el, { coreData, decision, decisionLabel, rvScore, rfScore, coreThreshold, cashPct, investedPct, corePositions, scoreMedio, coreBudget, nav });
}

function renderCoreEngine(el, { coreData, decision, decisionLabel, rvScore, rfScore, coreThreshold, cashPct, investedPct, corePositions, scoreMedio, coreBudget, nav }) {
  const coreEl = el.querySelector('#mt-aa-core-results');
  if (!coreEl) return;

  const decColor = decision==='RV' ? 'var(--teal)' : 'var(--blue)';
  const cashEur  = coreBudget * cashPct / 100;
  const invEur   = coreBudget * investedPct / 100;

  coreEl.innerHTML = `
    <!-- Decisión RV vs RF -->
    <div style="background:${decColor}12;border:1px solid ${decColor}33;border-radius:10px;padding:16px 18px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;">Decisión del motor</div>
          <div style="font-family:var(--serif);font-size:24px;font-style:italic;font-weight:600;color:${decColor};">${decisionLabel}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text2);margin-top:4px;">Score RV ${rvScore.toFixed(1)}/8 · Score RF ${rfScore.toFixed(1)}/8</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">Score medio elegibles</div>
          <div style="font-family:var(--serif);font-size:32px;font-style:italic;font-weight:600;">${scoreMedio.toFixed(1)}/8</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">Cash convicción: ${cashPct.toFixed(1)}%</div>
        </div>
      </div>
    </div>

    <!-- Scores por activo -->
    <div style="margin-bottom:14px;">
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Señales por activo</div><div class="mt-sdiv-line"></div></div>
      <div style="display:grid;grid-template-columns:repeat(${Math.min(coreData.length,4)},1fr);gap:8px;">
        ${coreData.map(a => {
          if (a.error) return `<div class="mt-kpi" style="opacity:0.5;"><div class="mt-kpi-lbl">${a.ticker}</div><div style="font-family:var(--mono);font-size:10px;color:var(--red);">Error</div></div>`;
          const sc = a.score;
          const scColor = sc>=6?'var(--green)':sc>=4?'var(--amber)':'var(--red)';
          const isWinner = a.type===decision;
          const isEligible = isWinner && sc>=coreThreshold;
          return `<div class="mt-kpi" style="border-color:${isEligible?decColor+'44':'var(--border)'};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div class="mt-kpi-lbl">${a.ticker}</div>
              <span class="mt-badge ${isEligible?'mt-pass':isWinner?'mt-warn':'mt-info'}">${isEligible?'ELEGIBLE':isWinner?'BAJO SCORE':'OTRO TIPO'}</span>
            </div>
            <div style="font-family:var(--serif);font-size:28px;font-style:italic;font-weight:600;color:${scColor};">${sc}/8</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:4px;">${a.type} · ${a.price?.toFixed(2)||'—'}</div>
            <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
              ${['macd','s89','rsi','precio'].map(k => {
                const mOk = a.mensual?.[k], wOk = a.semanal?.[k];
                return `<span style="font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:4px;background:${mOk?'rgba(74,222,128,0.1)':'rgba(244,113,116,0.08)'};color:${mOk?'var(--green)':'var(--text3)'};">M:${k.slice(0,4).toUpperCase()}</span>
                        <span style="font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:4px;background:${wOk?'rgba(74,222,128,0.1)':'rgba(244,113,116,0.08)'};color:${wOk?'var(--green)':'var(--text3)'};">S:${k.slice(0,4).toUpperCase()}</span>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Pesos CORE recomendados -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Target CORE</div><div class="mt-sdiv-line"></div></div>
    <div style="background:var(--surface2);border-radius:10px;overflow:hidden;margin-bottom:12px;">
      ${corePositions.length === 0 ? `
        <div style="padding:20px;text-align:center;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin activos elegibles — Cash 100%</div>
      ` : corePositions.map(p => {
        const eur = coreBudget * p.weightPct / 100;
        const pctNav = nav>0 ? eur/nav*100 : 0;
        return `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);">
          <div style="font-weight:700;font-size:13px;width:60px;">${p.ticker}</div>
          <div style="flex:1;">
            <div style="height:6px;background:var(--surface);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${p.weightPct.toFixed(1)}%;background:${decColor};border-radius:3px;"></div>
            </div>
          </div>
          <div style="font-family:var(--mono);font-size:12px;font-weight:700;min-width:50px;text-align:right;">${p.weightPct.toFixed(1)}%</div>
          <div style="font-family:var(--mono);font-size:11px;color:var(--teal);min-width:80px;text-align:right;">${fmtE(eur)}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text3);min-width:60px;text-align:right;">${pctNav.toFixed(1)}% NAV</div>
        </div>`;
      }).join('')}
      <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:rgba(64,217,192,0.04);">
        <div style="font-size:11px;color:var(--text3);width:60px;">Cash</div>
        <div style="flex:1;"></div>
        <div style="font-family:var(--mono);font-size:12px;font-weight:700;min-width:50px;text-align:right;color:var(--text3);">${cashPct.toFixed(1)}%</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--text3);min-width:80px;text-align:right;">${fmtE(cashEur)}</div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--text3);min-width:60px;text-align:right;">${(cashEur/nav*100).toFixed(1)}% NAV</div>
      </div>
      <div style="padding:10px 16px;font-family:var(--mono);font-size:9px;color:var(--text3);">
        Budget CORE total: ${fmtE(coreBudget)} · Invertible: ${fmtE(invEur)} · Cash táctico: ${fmtE(cashEur)}
      </div>
    </div>`;
}

function renderSatEngine(el, { satData, satPositions, satBudget, satUniverse, nav }) {
  const satEl = el.querySelector('#mt-aa-sat-results');
  if (!satEl) return;

  if (!satUniverse.length) {
    satEl.innerHTML = `<div style="padding:24px;text-align:center;font-family:var(--mono);font-size:11px;color:var(--text3);">
      Sin universo Satélite configurado. Añade tickers en Parámetros → Universo Satélite.
    </div>`;
    return;
  }

  satEl.innerHTML = `
    <div style="background:var(--surface2);border-radius:10px;overflow:hidden;">
      ${satPositions.length === 0
        ? `<div style="padding:20px;text-align:center;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin datos suficientes</div>`
        : satPositions.map(p => {
          const eur = satBudget * p.weightPct / 100;
          const pctNav = nav>0 ? eur/nav*100 : 0;
          return `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);">
            <div style="font-weight:700;font-size:13px;width:70px;">${p.ticker}</div>
            <div style="flex:1;">
              <div style="height:6px;background:var(--surface);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${p.weightPct.toFixed(1)}%;background:var(--purple);border-radius:3px;"></div>
              </div>
            </div>
            <div style="font-family:var(--mono);font-size:12px;font-weight:700;min-width:50px;text-align:right;">${p.weightPct.toFixed(1)}%</div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--purple);min-width:80px;text-align:right;">${fmtE(eur)}</div>
            <div style="font-family:var(--mono);font-size:10px;color:var(--text3);min-width:60px;text-align:right;">${pctNav.toFixed(1)}% NAV</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);min-width:50px;text-align:right;">Vol: ${p.vol?(p.vol*100).toFixed(1)+'%':'—'}</div>
          </div>`;
        }).join('')}
      <div style="padding:10px 16px;font-family:var(--mono);font-size:9px;color:var(--text3);">
        Budget SAT total: ${fmtE(satBudget)} · 100% invertido (sin cash táctico en Satélite)
      </div>
    </div>
    ${satData.filter(a=>a.error).length ? `
      <div style="margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--amber);">
        ⚠ Sin datos: ${satData.filter(a=>a.error).map(a=>a.ticker).join(', ')}
      </div>` : ''}`;
}

function renderAllocation(el) {
  if (!STATE) return;
  const { nav, cash, buckets } = STATE;

  ['core','sat'].forEach(b => {
    const tgt    = b==='core' ? POLICY.corePct : POLICY.satPct;
    const budget = nav * tgt;
    const inv    = buckets[b]||0;
    const avail  = Math.max(0, budget - inv);
    const occ    = budget > 0 ? inv/budget : 0;
    const clr    = b==='core' ? 'var(--teal)' : 'var(--purple)';

    const s = id => el.querySelector(`#mt-${b}-${id}`);
    if (s('tgt')) s('tgt').textContent = (tgt*100).toFixed(0)+'% NAV';
    if (s('budget')) { s('budget').textContent = fmtE(budget); }
    if (s('inv'))    { s('inv').textContent    = fmtE(inv); }
    if (s('avail'))  { s('avail').textContent  = fmtE(avail); s('avail').style.color = avail>0?'var(--green)':'var(--text3)'; }
    if (s('bar'))    { s('bar').style.width = clamp(occ*100,0,100).toFixed(1)+'%'; s('bar').style.background = clr; }
    if (s('occ'))    s('occ').textContent = (occ*100).toFixed(1)+'% ocupado';
  });

  // Target vs Actual — límites máximos, no targets obligatorios
  const totalInv = (buckets.core||0) + (buckets.sat||0);
  const rows = [
    { dim:'CORE',     label:'Límite máx.',  lim:POLICY.corePct, act:(buckets.core||0)/nav, tol:POLICY.corePct },
    { dim:'SATÉLITE', label:'Límite máx.',  lim:POLICY.satPct,  act:(buckets.sat||0)/nav,  tol:POLICY.satPct  },
    { dim:'RV Total', label:'Invertido',    lim:null,           act:totalInv/nav,           tol:null           },
    { dim:'Cash',     label:'No desplegado',lim:null,           act:cash/nav,              tol:null           },
  ];
  const tbody = el.querySelector('#mt-alloc-table');
  if (tbody) tbody.innerHTML = rows.map(r => {
    // Estado: solo FAIL si se supera el límite; nunca FAIL por tener cash
    let statusColor, statusTxt;
    if (r.lim !== null) {
      const over = r.act > r.lim + 0.001; // supera el límite
      statusColor = over ? 'var(--red)' : 'var(--green)';
      statusTxt   = over ? '✗ Supera límite' : '✓ Dentro límite';
    } else {
      statusColor = 'var(--text3)';
      statusTxt   = '— informativo';
    }
    const limTxt = r.lim !== null ? fmtP(r.lim) : '—';
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:9px 12px;font-weight:700;">${r.dim}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);font-size:10px;color:var(--text3);">${r.label}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${limTxt}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${fmtP(r.act)}</td>
      <td style="padding:9px 12px;text-align:right;font-size:10px;color:${statusColor};">${statusTxt}</td>
    </tr>`;
  }).join('');

  // Cash breakdown
  const coreBudget = nav*POLICY.corePct, satBudget = nav*POLICY.satPct;
  const setQ = (id, v) => { const e=el.querySelector('#mt-'+id); if(e) e.textContent=v; };
  setQ('cash-struct', fmtE(Math.max(0, nav-coreBudget-satBudget)));
  setQ('cash-core',   fmtE(Math.max(0, coreBudget-(buckets.core||0))));
  setQ('cash-sat',    fmtE(Math.max(0, satBudget-(buckets.sat||0))));
}

function renderRiskBudget(el) {
  if (!STATE) return;
  const { nav, openRisk, drawdownActual, positions } = STATE;
  const openRiskPct = nav>0?openRisk/nav:0;
  const ddMult      = getDDMult(drawdownActual);
  const availGlobal = Math.max(0, POLICY.portRisk - openRiskPct);
  const effectRisk  = POLICY.tradeRisk * ddMult;

  const set = (id, v, c) => { const e=el.querySelector('#mt-'+id); if(!e)return; e.textContent=v; if(c)e.style.color=c; };
  set('rb-global-used',  (openRiskPct*100).toFixed(2)+'%', openRiskPct>POLICY.portRisk?'var(--red)':'var(--green)');
  set('rb-global-avail', (availGlobal*100).toFixed(2)+'%', 'var(--green)');
  set('rb-global-limit', 'Límite: '+(POLICY.portRisk*100).toFixed(0)+'% NAV');
  set('rb-per-trade',    (effectRisk*100).toFixed(2)+'%',  'var(--amber)');
  set('rb-dd-mult',      `×${ddMult.toFixed(2)} · DD: ${fmtP(drawdownActual)} · Base: ${(POLICY.tradeRisk*100).toFixed(2)}%`);
  const globalBar = el.querySelector('#mt-rb-global-bar');
  if (globalBar) { globalBar.style.width=clamp(openRiskPct/POLICY.portRisk*100,0,100).toFixed(1)+'%'; globalBar.style.background=openRiskPct>POLICY.portRisk?'var(--red)':'var(--green)'; }

  // Por bucket
  ['core','sat'].forEach(b => {
    const rl = b==='core'?POLICY.coreRisk:POLICY.satRisk;
    const orb = positions.filter(p=>p.bucket===b).reduce((s,p)=>s+(p.stop>0?Math.abs(p.current-p.stop)/p.current*p.mktVal:0),0);
    const orPct = nav>0?orb/nav:0;
    const avb = Math.max(0, rl-orPct);
    const clr = b==='core'?'var(--teal)':'var(--purple)';
    set(`rb-${b}-used`,  (orPct*100).toFixed(2)+'%');
    set(`rb-${b}-avail`, (avb*100).toFixed(2)+'%', 'var(--green)');
    set(`rb-${b}-limit`, 'Límite: '+(rl*100).toFixed(0)+'% NAV');
    const bar = el.querySelector(`#mt-rb-${b}-bar`);
    if (bar) { bar.style.width=clamp(orPct/rl*100,0,100).toFixed(1)+'%'; bar.style.background=orPct>rl?'var(--red)':clr; }
  });

  // DD Scaling table
  const ddt = el.querySelector('#mt-dd-table');
  if (ddt) {
    const ddBands = [
      {r:'0% a -3%',  m:POLICY.ddScale[0],from:0,to:0.03},
      {r:'-3% a -5%', m:POLICY.ddScale[1],from:0.03,to:0.05},
      {r:'-5% a -8%', m:POLICY.ddScale[2],from:0.05,to:0.08},
      {r:'-8% a -10%',m:POLICY.ddScale[3],from:0.08,to:0.10},
      {r:'> -10%',    m:POLICY.ddScale[4],from:0.10,to:1},
    ];
    const da = Math.abs(drawdownActual||0);
    ddt.innerHTML = ddBands.map(b => {
      const act = da>=b.from&&da<b.to;
      return `<tr class="${act?'mt-active':''}">
        <td>${b.r}</td><td>×${b.m.toFixed(2)}</td>
        <td>${(POLICY.tradeRisk*100).toFixed(2)}% NAV</td>
        <td>${(POLICY.tradeRisk*b.m*100).toFixed(2)}% NAV</td>
        <td>${act?'← Activo':''}</td>
      </tr>`;
    }).join('');
  }

  // Risk per position
  const rpe = el.querySelector('#mt-risk-positions');
  if (rpe) {
    rpe.innerHTML = !positions.length
      ? `<div style="text-align:center;padding:20px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin posiciones abiertas</div>`
      : `<table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead><tr style="border-bottom:1px solid var(--border);">
            ${['TICKER','DIR','BUCKET','ACTUAL','STOP','RIESGO €','% NAV'].map(h=>
              `<th style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:7px 10px;text-align:${h==='TICKER'?'left':'right'};">${h}</th>`
            ).join('')}
          </tr></thead>
          <tbody>${positions.map(p => {
            const re = p.stop>0?Math.abs(p.current-p.stop)/p.current*p.mktVal:0;
            const rp = nav>0?re/nav:0;
            return `<tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px 10px;font-weight:700;">${p.ticker}</td>
              <td style="padding:8px 10px;text-align:right;"><span class="mt-badge ${p.dir==='bajista'?'mt-fail':'mt-pass'}" style="font-size:8px;">${p.dir==='bajista'?'SHORT':'LONG'}</span></td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);font-size:9px;color:${p.bucket==='core'?'var(--teal)':'var(--purple)'};">${p.bucket.toUpperCase()}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);">$${p.current.toFixed(2)}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${p.stop>0?'$'+p.stop.toFixed(2):'—'}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${p.stop>0?fmtE(re):'—'}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${p.stop>0?(rp*100).toFixed(2)+'%':'—'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>`;
  }
}

function calcSizing(el) {
  if (!STATE) return;
  const g = id => el.querySelector('#mt-sz-'+id);
  const ticker = (g('ticker')?.value||'').trim().toUpperCase();
  const bucket = g('bucket')?.value || 'sat';
  const side   = g('side')?.value   || 'long';
  const sector = g('sector')?.value || 'tech';
  const entry  = parseFloat(g('entry')?.value)  || 0;
  const stop   = parseFloat(g('stop')?.value)   || 0;

  const resEl = el.querySelector('#mt-sz-result');
  const wfEl  = el.querySelector('#mt-sz-waterfall');

  const showErr = msg => {
    resEl.innerHTML = `<div style="color:var(--red);font-family:var(--mono);font-size:11px;padding:20px;background:rgba(244,113,116,0.05);border-radius:8px;">⚠ ${msg}</div>`;
    wfEl.innerHTML = '';
  };

  if (!entry || !stop) { showErr('Introduce precio de entrada y stop loss.'); return; }
  if (side==='long'  && stop >= entry) { showErr('LONG: el stop debe ser MENOR que la entrada.'); return; }
  if (side==='short' && stop <= entry) { showErr('SHORT: el stop debe ser MAYOR que la entrada.'); return; }
  if (Math.abs(entry-stop)/entry > 0.20) { showErr('Stop demasiado alejado (>20% de entrada). Revisa los datos.'); return; }

  const { nav, cash, buckets, sectors, positions, openRisk, drawdownActual } = STATE;
  const ddMult = getDDMult(drawdownActual);

  const budgetTgt   = bucket==='core' ? POLICY.corePct : POLICY.satPct;
  const budgetEur   = nav * budgetTgt;
  const investedEur = buckets[bucket]||0;
  const availBucket = Math.max(0, budgetEur - investedEur);

  const riskLimitB  = bucket==='core' ? POLICY.coreRisk : POLICY.satRisk;
  const openRiskB   = positions.filter(p=>p.bucket===bucket)
    .reduce((s,p)=>s+(p.stop>0?Math.abs(p.current-p.stop)/p.current*p.mktVal:0),0);
  const availRiskB  = Math.max(0, nav*riskLimitB - openRiskB);
  const availRiskG  = Math.max(0, nav*POLICY.portRisk - openRisk);

  const baseRiskEur = nav * POLICY.tradeRisk * ddMult;
  const allowedRisk = Math.min(baseRiskEur, availRiskB, availRiskG);

  const riskPerShare = Math.abs(entry - stop);
  const assetExp   = positions.filter(p=>p.ticker===ticker).reduce((s,p)=>s+p.mktVal,0);
  const sectorExp  = positions.filter(p=>p.sector===sector).reduce((s,p)=>s+p.mktVal,0);
  const availAsset  = Math.max(0, nav*POLICY.maxAssetNav  - assetExp);
  const availSector = Math.max(0, nav*POLICY.maxSectorNav - sectorExp);

  const limits = [
    { id:'risk',    label:'Riesgo/op. efectivo',               type:'HARD', qty: allowedRisk>0 ? Math.floor(allowedRisk/riskPerShare)  : 0, limit:`${fmtE(allowedRisk)} (${(allowedRisk/nav*100).toFixed(2)}% NAV)` },
    { id:'bucket',  label:'Capital bucket '+bucket.toUpperCase(), type:'HARD', qty: availBucket>0 ? Math.floor(availBucket/entry)         : 0, limit:`${fmtE(availBucket)} disponible` },
    { id:'cash',    label:'Cash disponible real',               type:'HARD', qty: cash>0        ? Math.floor(cash/entry)                : 0, limit:`${fmtE(cash)} en cartera` },
    { id:'asset',   label:'Máximo por activo',                  type:'HARD', qty: availAsset>0  ? Math.floor(availAsset/entry)           : 0, limit:`${(POLICY.maxAssetNav*100).toFixed(0)}% NAV` },
    { id:'sector',  label:'Máximo sectorial',                   type:'SOFT', qty: availSector>0 ? Math.floor(availSector/entry)          : 0, limit:`${(POLICY.maxSectorNav*100).toFixed(0)}% NAV` },
    { id:'rbucket', label:`Risk Budget ${bucket.toUpperCase()}`,type:'HARD', qty: availRiskB>0  ? Math.floor(availRiskB/riskPerShare)    : 0, limit:`${fmtE(availRiskB)} restante` },
    { id:'rglobal', label:'Risk Budget global',                 type:'HARD', qty: availRiskG>0  ? Math.floor(availRiskG/riskPerShare)    : 0, limit:`${(POLICY.portRisk*100).toFixed(0)}% NAV` },
  ];

  const hardQtys = limits.filter(l=>l.type==='HARD').map(l=>l.qty);
  const qtyFinal = Math.max(0, Math.min(...hardQtys));
  const limiting = [...limits].sort((a,b)=>a.qty-b.qty)[0];

  const checks = [
    { rule:'Stop válido (dirección)',     type:'HARD', result:'PASS', note:`${side.toUpperCase()}: stop correcto` },
    { rule:'Capital bucket disponible',   type:'HARD', result: availBucket>=entry?'PASS':'FAIL', note:fmtE(availBucket) },
    { rule:'Cash disponible real',        type:'HARD', result: cash>=entry?'PASS':'FAIL',        note:fmtE(cash) },
    { rule:'Risk Budget global',          type:'HARD', result: availRiskG>=riskPerShare?'PASS':'FAIL', note:(availRiskG/nav*100).toFixed(2)+'% NAV' },
    { rule:`Risk Budget ${bucket.toUpperCase()}`, type:'HARD', result: availRiskB>=riskPerShare?'PASS':'FAIL', note:(availRiskB/nav*100).toFixed(2)+'% NAV' },
    { rule:'Límite por activo',           type:'HARD', result: availAsset>=entry?'PASS':'FAIL',  note:fmtE(availAsset) },
    { rule:'Límite sectorial',            type:'SOFT', result: availSector>=entry?'PASS':'WARN', note:fmtE(availSector) },
    { rule:'Drawdown scaling',            type:'INFO', result: ddMult<1?'WARN':'PASS',           note:`×${ddMult.toFixed(2)}` },
    { rule:'Posición > 0 acciones',       type:'HARD', result: qtyFinal>0?'PASS':'FAIL',         note:qtyFinal+' acc.' },
  ];

  const hardFail = checks.some(c=>c.type==='HARD'&&c.result==='FAIL');
  const hasWarn  = checks.some(c=>c.result==='WARN');
  const approved = !hardFail && qtyFinal>0;
  const statusColor = approved ? 'var(--teal)' : hasWarn ? 'var(--amber)' : 'var(--red)';
  const statusTxt   = approved ? '✓ AUTORIZADO' : hasWarn ? '⚠ AUTORIZADO CON WARNINGS' : '✗ BLOQUEADO';

  const capInv     = qtyFinal * entry;
  const initRiskE  = qtyFinal * riskPerShare;
  const initRiskP  = nav>0 ? initRiskE/nav : 0;
  const pctNav     = nav>0 ? capInv/nav : 0;
  const pctBucket  = budgetEur>0 ? capInv/budgetEur : 0;

  // Before / After
  const cashAfter     = cash - capInv;
  const investedAfter = (STATE.invested||0) + capInv;
  const riskAfter     = openRisk + initRiskE;
  const bucketAfter   = (buckets[bucket]||0) + capInv;
  const sectorAfter   = (sectors[sector]||0) + capInv;

  resEl.innerHTML = `
    <div style="text-align:center;padding:8px 0 16px;">
      <div style="font-family:var(--serif);font-size:48px;font-weight:600;font-style:italic;color:${statusColor};">${qtyFinal}</div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:2px;">acciones ${side.toUpperCase()}</div>
      <div style="margin-top:8px;display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;background:${statusColor}18;border:1px solid ${statusColor}44;">
        <span style="font-family:var(--mono);font-size:10px;font-weight:700;color:${statusColor};">${statusTxt}</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">
      ${[['Capital',fmtE(capInv)],['Riesgo inicial',fmtE(initRiskE)],['Riesgo % NAV',(initRiskP*100).toFixed(2)+'%'],['% Bucket',(pctBucket*100).toFixed(1)+'%'],['% NAV',(pctNav*100).toFixed(1)+'%'],['DD mult.','×'+ddMult.toFixed(2)],['Regla limitante',limiting.label],['Policy v.',POLICY.version.slice(0,10)]].map(([l,v])=>
        `<div style="background:var(--surface2);border-radius:6px;padding:7px 10px;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:2px;">${l}</div>
          <div style="font-family:var(--mono);font-size:11px;font-weight:700;word-break:break-word;">${v}</div>
        </div>`).join('')}
    </div>`;

  wfEl.innerHTML = `
    <!-- Waterfall -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Waterfall de Restricciones</div><div class="mt-sdiv-line"></div></div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      <div class="mt-wf-row mt-wf-head"><span>Restricción</span><span style="text-align:right;">Máx.</span><span>Límite</span><span>Tipo</span><span style="text-align:right;">Estado</span></div>
      ${limits.map(l => {
        const isLim = l.id===limiting.id;
        const sb = l.qty===0?'mt-fail':isLim?'mt-warn':'mt-pass';
        const st = l.qty===0?'FAIL':isLim?'LIMITA':'OK';
        const tb = l.type==='HARD'?'mt-hard':l.type==='SOFT'?'mt-soft':'mt-info';
        return `<div class="mt-wf-row${isLim?' limiting':''}">
          <span style="font-size:11px;color:${isLim?'var(--amber)':'var(--text2)'};">${l.label}</span>
          <span style="font-family:var(--mono);font-size:13px;font-weight:700;text-align:right;color:${l.qty===0?'var(--red)':isLim?'var(--amber)':'var(--text1)'};">${l.qty}</span>
          <span style="font-family:var(--mono);font-size:9px;color:var(--text3);">${l.limit}</span>
          <span class="mt-badge ${tb}">${l.type}</span>
          <span class="mt-badge ${sb}" style="text-align:center;">${st}</span>
        </div>`;
      }).join('')}
      <div class="mt-wf-row" style="background:rgba(64,217,192,0.04);border-top:1px solid var(--border);">
        <span style="font-size:12px;font-weight:700;">RESULTADO FINAL</span>
        <span style="font-family:var(--mono);font-size:16px;font-weight:700;text-align:right;color:${statusColor};">${qtyFinal}</span>
        <span style="font-family:var(--mono);font-size:11px;color:var(--text2);">${fmtE(capInv)}</span>
        <span></span>
        <span class="mt-badge ${approved?'mt-pass':hasWarn?'mt-warn':'mt-fail'}" style="text-align:center;">${approved?'AUTORIZADO':'BLOQUEADO'}</span>
      </div>
    </div>

    <!-- Before / After -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Cartera Before → After</div><div class="mt-sdiv-line"></div></div>
    <div class="mt-ba-grid">
      <div class="mt-ba-col">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Antes</div>
        ${[['NAV',fmtE(nav)],['Cash',fmtE(cash)],['Invertido',fmtE(STATE.invested||0)],['Riesgo abierto',fmtE(openRisk)],['Bucket '+bucket.toUpperCase(),fmtE(buckets[bucket]||0)],['Sector',fmtE(sectors[sector]||0)]].map(([l,v])=>
          `<div class="mt-ba-row"><span style="font-size:10px;color:var(--text3);">${l}</span><span style="font-family:var(--mono);font-size:11px;font-weight:700;">${v}</span></div>`).join('')}
      </div>
      <div style="display:flex;align-items:center;justify-content:center;color:var(--text3);">→</div>
      <div class="mt-ba-col" style="border:1px solid rgba(64,217,192,0.2);">
        <div style="font-family:var(--mono);font-size:9px;color:var(--teal);text-transform:uppercase;margin-bottom:8px;">Después</div>
        ${[
          ['NAV',        nav,           0],
          ['Cash',       cashAfter,     cashAfter-cash],
          ['Invertido',  investedAfter, capInv],
          ['Riesgo',     riskAfter,     initRiskE],
          ['Bucket',     bucketAfter,   capInv],
          ['Sector',     sectorAfter,   capInv],
        ].map(([l,v,d])=>{
          const dc = d===0?'mt-delta-nu':d<0?'mt-delta-dn':'mt-delta-up';
          const ds = d===0?'':d>0?'+':'';
          return `<div class="mt-ba-row">
            <span style="font-size:10px;color:var(--text3);">${l}</span>
            <span style="font-family:var(--mono);font-size:11px;font-weight:700;">${fmtE(v)} ${d!==0?`<span class="mt-delta ${dc}">${ds}${fmtE(d)}</span>`:''}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Pre-Trade Check -->
    <div class="mt-sdiv"><div class="mt-sdiv-lbl">Pre-Trade Check</div><div class="mt-sdiv-line"></div></div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
      ${checks.map(c=>{
        const bc=c.result==='PASS'?'mt-pass':c.result==='WARN'?'mt-warn':'mt-fail';
        const tc=c.type==='HARD'?'mt-hard':c.type==='SOFT'?'mt-soft':'mt-info';
        return `<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:8px 14px;border-bottom:1px solid var(--border);">
          <span style="font-size:11px;color:var(--text2);">${c.rule}</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--text3);">${c.note}</span>
          <span class="mt-badge ${tc}">${c.type}</span>
          <span class="mt-badge ${bc}">${c.result}</span>
        </div>`;
      }).join('')}
    </div>`;

  // Guardar propuesta si autorizado
  if (approved) saveProposal({ ticker, bucket, side, sector, entry, stop, qtyFinal, capInv, initRiskE, initRiskP, pctNav, ddMult, limitingRule:limiting.label, finalStatus:approved?'PASS':hasWarn?'WARN':'FAIL', policyVersion:POLICY.version, nav:STATE.nav });
}

async function saveProposal(data) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'trade_proposals'), {
      ...data, timestamp: serverTimestamp()
    });
    // Refrescar lista de propuestas si está visible
    const el = document.getElementById('mt-proposals-list');
    if (el) await loadAndRenderProposals(el);
  } catch(e) { console.warn('saveProposal:', e.message); }
}

async function loadAndRenderProposals(el) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    const q = query(collection(db,'users',user.uid,'trade_proposals'), orderBy('timestamp','desc'), limit(10));
    const snap = await getDocs(q);
    const props = snap.docs.map(d=>({id:d.id,...d.data()}));
    el.innerHTML = !props.length
      ? `<div style="text-align:center;padding:24px;font-family:var(--mono);font-size:11px;color:var(--text3);">Sin propuestas registradas</div>`
      : props.map(p => {
          const bc = p.finalStatus==='PASS'?'mt-pass':p.finalStatus==='WARN'?'mt-warn':'mt-fail';
          const ts = p.timestamp?.toDate?.()?.toLocaleString('es-ES') || '—';
          return `<div class="mt-prop-row">
            <span class="mt-badge ${bc}">${p.finalStatus}</span>
            <div>
              <div style="font-weight:700;">${p.ticker||'—'} ${(p.side||'').toUpperCase()} · ${p.qtyFinal||0} acc. · ${(p.bucket||'').toUpperCase()}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:2px;">$${p.entry?.toFixed(2)||'—'} → stop $${p.stop?.toFixed(2)||'—'} · ${p.limitingRule||'—'}</div>
            </div>
            <div style="text-align:right;font-family:var(--mono);font-size:11px;">${p.capInv?fmtE(p.capInv):'—'}</div>
            <div style="text-align:right;font-family:var(--mono);font-size:10px;color:var(--red);">${p.initRiskE?fmtE(p.initRiskE):'—'}</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${ts}</div>
          </div>`;
        }).join('');
  } catch(e) { console.warn('loadProposals:', e.message); }
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════
export async function render(container, { actionsSlot, savedState } = {}) {
  if (!document.getElementById('mt-css')) {
    const s = document.createElement('style'); s.id = 'mt-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  // 1. Loader mientras carga
  container.innerHTML = `<div id="mt-wrap"><div style="display:flex;align-items:center;gap:10px;padding:40px 20px;font-family:var(--mono);font-size:11px;color:var(--text3);"><div class="mt-loader-ring"></div>Cargando Motor Integrado...</div></div>`;

  // 2. Cargar datos y política
  await loadState();
  const wrap = container.querySelector('#mt-wrap');

  // 3. Pintar HTML
  wrap.innerHTML = `
    <div class="mt-tabs">
      <button class="mt-tab active" data-tab="state">📊 Portfolio State</button>
      <button class="mt-tab" data-tab="allocation">🎯 Asset Allocation</button>
      <button class="mt-tab" data-tab="sizing">📐 Position Sizing</button>
      <button class="mt-tab" data-tab="risk">⚡ Risk Budget</button>
      <button class="mt-tab" data-tab="proposals">📋 Propuestas</button>
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
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Capital Budgets</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-g2 mb12">
        ${['core','sat'].map(b => {
          const clr = b==='core'?'var(--teal)':'var(--purple)';
          const nm  = b==='core'?'CORE':'SATÉLITE';
          return `<div class="mt-card">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;">
              <div style="font-family:var(--serif);font-size:18px;font-style:italic;font-weight:600;color:${clr};">${nm}</div>
              <span id="mt-${b}-tgt" style="font-family:var(--mono);font-size:10px;color:var(--text3);">—</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
              <div><div class="mt-lbl">Budget</div><div class="mt-val" id="mt-${b}-budget" style="font-size:16px;">—</div></div>
              <div><div class="mt-lbl">Invertido</div><div class="mt-val" id="mt-${b}-inv" style="font-size:16px;color:var(--blue);">—</div></div>
              <div><div class="mt-lbl">Disponible</div><div class="mt-val" id="mt-${b}-avail" style="font-size:16px;">—</div></div>
            </div>
            <div class="mt-bar-track"><div class="mt-bar-fill" id="mt-${b}-bar" style="width:0%;"></div></div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px;text-align:right;" id="mt-${b}-occ">—</div>
          </div>`;
        }).join('')}
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Target vs Actual</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-card mb12">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="border-bottom:1px solid var(--border);">
            ${['Dimensión','Concepto','Límite máx.','Actual','Estado'].map((h,i)=>
              `<th style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:8px 12px;text-align:${i===0?'left':'right'};">${h}</th>`).join('')}
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

      <div class="mt-sdiv"><div class="mt-sdiv-lbl">CORE Engine · Señales y Pesos</div><div class="mt-sdiv-line"></div>
        <button class="btn mt-badge" id="mt-aa-run-btn" style="font-size:10px;padding:5px 12px;margin-left:8px;">▶ Calcular</button>
      </div>
      <div id="mt-aa-core-results" style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:20px;text-align:center;">
        Pulsa Calcular para ejecutar el motor de señales CORE.
      </div>

      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Satélite Engine · Pesos por Inversa de Volatilidad</div><div class="mt-sdiv-line"></div></div>
      <div style="background:var(--surface2);border-radius:10px;padding:14px 16px;margin-bottom:12px;">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
          <input type="text" id="mt-aa-sat-input" class="mt-input" placeholder="EXPD, XLI, XLV, VLO (separados por coma)" style="flex:1;text-transform:uppercase;">
          <button class="btn btn-primary" id="mt-aa-sat-btn" style="white-space:nowrap;">▶ Calcular SAT</button>
        </div>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Introduce los tickers de tu universo Satélite. Se calculan pesos por inversa de volatilidad con tope del ${Math.round((POLICY.satMaxWeight??0.40)*100)}% por activo. 100% invertido.</div>
      </div>
      <div id="mt-aa-sat-results" style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:20px;text-align:center;">
        Introduce tickers y pulsa Calcular SAT.
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
        ${['core','sat'].map(b=>{
          const clr=b==='core'?'var(--teal)':'var(--purple)';
          return `<div class="mt-kpi">
            <div class="mt-kpi-lbl" style="color:${clr};">${b.toUpperCase()}</div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;">
              <div><div style="font-size:9px;color:var(--text3);">Usado</div><div class="mt-kpi-val" id="mt-rb-${b}-used" style="font-size:18px;">—</div></div>
              <div style="text-align:right;"><div style="font-size:9px;color:var(--text3);">Disponible</div><div class="mt-kpi-val" id="mt-rb-${b}-avail" style="font-size:18px;color:var(--green);">—</div></div>
            </div>
            <div class="mt-kpi-sub" id="mt-rb-${b}-limit" style="margin-top:4px;">—</div>
            <div class="mt-bar-track" style="margin-top:6px;"><div class="mt-bar-fill" id="mt-rb-${b}-bar" style="background:${clr};"></div></div>
          </div>`;
        }).join('')}
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

    <!-- PROPUESTAS -->
    <div class="mt-panel" id="mt-panel-proposals">
      <div style="font-size:10px;color:var(--text3);margin-bottom:12px;line-height:1.6;">Log de auditoría — últimas 10 propuestas calculadas por el motor. Cada propuesta registra parámetros vigentes, resultado del Pre-Trade Check y regla limitante.</div>
      <div class="mt-card"><div class="mt-card-title">Últimas Propuestas</div><div id="mt-proposals-list"><div class="mt-loader"><div class="mt-loader-ring"></div>Cargando...</div></div></div>
    </div>

    <!-- PARÁMETROS -->
    <div class="mt-panel" id="mt-panel-params">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div><div style="font-family:var(--mono);font-size:10px;color:var(--text2);">Policy v<span id="mt-policy-version">—</span></div><div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px;">Guardado: <span id="mt-policy-updated">—</span></div></div>
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Asset Allocation</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-g4 mb12">
        <div class="mt-field"><label>Target CORE (%)</label><input type="number" id="mt-p-core" class="mt-input" value="50"></div>
        <div class="mt-field"><label>Target Satélite (%)</label><input type="number" id="mt-p-sat" class="mt-input" value="50"></div>
        <div class="mt-field"><label>Máx. activo (% NAV)</label><input type="number" id="mt-p-asset" class="mt-input" value="20"></div>
        <div class="mt-field"><label>Máx. sector (% NAV)</label><input type="number" id="mt-p-sector" class="mt-input" value="35"></div>
      </div>
      <div class="mt-g4 mb12">
        <div class="mt-field"><label>Score mínimo CORE</label><input type="number" id="mt-p-core-threshold" class="mt-input" value="6" min="0" max="8"></div>
        <div class="mt-field"><label>Máx. peso CORE (%)</label><input type="number" id="mt-p-core-maxw" class="mt-input" value="40"></div>
        <div class="mt-field"><label>Máx. peso SAT (%)</label><input type="number" id="mt-p-sat-maxw" class="mt-input" value="40"></div>
      </div>
      <div class="mt-g2 mb12">
        <div class="mt-field">
          <label>Universo CORE (tickers separados por coma)</label>
          <input type="text" id="mt-p-core-universe" class="mt-input" placeholder="VTI, VEU, IEF, BNDX" value="VTI, VEU, IEF, BNDX">
          <div style="font-size:9px;color:var(--text3);margin-top:3px;">Por defecto: VTI, VEU, IEF, BNDX. Los que terminan en BND/IEF/TLT se tratan como RF, el resto como RV.</div>
        </div>
        <div class="mt-field">
          <label>Máx. peso por activo CORE (%)</label>
          <input type="number" id="mt-p-core-maxw" class="mt-input" value="40">
          <div style="font-size:9px;color:var(--text3);margin-top:3px;">Tope de concentración por activo en la cartera CORE.</div>
        </div>
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Risk Management</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-g4 mb12">
        <div class="mt-field"><label>Riesgo base/op. (% NAV)</label><input type="number" id="mt-p-trade" class="mt-input" step="0.25"></div>
        <div class="mt-field"><label>Riesgo máx. cartera (%)</label><input type="number" id="mt-p-port" class="mt-input" step="0.5"></div>
        <div class="mt-field"><label>Riesgo máx. CORE (%)</label><input type="number" id="mt-p-crisk" class="mt-input" step="0.25"></div>
        <div class="mt-field"><label>Riesgo máx. Satélite (%)</label><input type="number" id="mt-p-srisk" class="mt-input" step="0.25"></div>
      </div>
      <div class="mt-sdiv"><div class="mt-sdiv-lbl">Drawdown Scaling</div><div class="mt-sdiv-line"></div></div>
      <div class="mt-card mb12" style="background:var(--surface2);">
        <div class="mt-g5">
          ${['0%→-3%','-3%→-5%','-5%→-8%','-8%→-10%','>-10%'].map((l,i)=>
            `<div class="mt-field"><label>${l}</label><input type="number" id="mt-p-dd${i+1}" class="mt-input" step="0.05"></div>`
          ).join('')}
        </div>
      </div>
      <div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:10px;color:var(--text2);line-height:1.6;">
        ⚠ Guardar crea una nueva versión de política. Las propuestas quedan vinculadas a la versión activa en el momento del cálculo.
      </div>
      <button class="btn btn-primary" id="mt-params-save">Guardar y versionar</button>
    </div>`;

  // ── Tabs ──────────────────────────────────────────────────────
  wrap.querySelectorAll('.mt-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      wrap.querySelectorAll('.mt-tab').forEach(t=>t.classList.remove('active'));
      wrap.querySelectorAll('.mt-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      wrap.querySelector(`#mt-panel-${tab.dataset.tab}`)?.classList.add('active');
      if (tab.dataset.tab === 'proposals') {
        const el2 = wrap.querySelector('#mt-proposals-list');
        if (el2) loadAndRenderProposals(el2);
      }
    });
  });

  // ── Botón Calcular AA CORE ────────────────────────────────────
  wrap.querySelector('#mt-aa-run-btn')?.addEventListener('click', () => {
    runAllocationEngine(wrap);
  });

  // ── Botón Calcular SAT inline ─────────────────────────────────
  wrap.querySelector('#mt-aa-sat-btn')?.addEventListener('click', async () => {
    const input = wrap.querySelector('#mt-aa-sat-input')?.value || '';
    const tickers = input.split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);
    if (!tickers.length) { alert('Introduce al menos un ticker.'); return; }
    const satEl = wrap.querySelector('#mt-aa-sat-results');
    if (satEl) satEl.innerHTML = `<div class="mt-loader"><div class="mt-loader-ring"></div>Calculando señales Satélite (${tickers.join(', ')})...</div>`;
    const satBudget = (STATE?.nav||0) * POLICY.satPct;
    const satMaxW   = POLICY.satMaxWeight ?? 0.40;
    const satData = [];
    for (const ticker of tickers) {
      try {
        const raw = await mtFetchData(ticker);
        const analysis = mtAnalyzeAsset(raw);
        satData.push({ ticker, ...analysis });
      } catch(e) {
        satData.push({ ticker, error: e.message });
      }
    }
    const satPositions = mtInverseVol(satData.filter(a=>!a.error), satMaxW, 100);
    renderSatEngine(wrap, { satData, satPositions, satBudget, satUniverse: tickers, nav: STATE?.nav||0 });
  });

  // Enter en el input SAT
  wrap.querySelector('#mt-aa-sat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') wrap.querySelector('#mt-aa-sat-btn')?.click();
  });

  // ── Sizing button ─────────────────────────────────────────────
  wrap.querySelector('#mt-sz-btn')?.addEventListener('click', () => calcSizing(wrap));

  // ── Params save ───────────────────────────────────────────────
  wrap.querySelector('#mt-params-save')?.addEventListener('click', async () => {
    const g  = id => parseFloat(wrap.querySelector('#mt-p-'+id)?.value)||0;
    const gs = id => (wrap.querySelector('#mt-p-'+id)?.value||'').split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);
    POLICY.corePct          = g('core')/100;
    POLICY.satPct           = g('sat')/100;
    POLICY.maxAssetNav      = g('asset')/100;
    POLICY.maxSectorNav     = g('sector')/100;
    POLICY.tradeRisk        = g('trade')/100;
    POLICY.portRisk         = g('port')/100;
    POLICY.coreRisk         = g('crisk')/100;
    POLICY.satRisk          = g('srisk')/100;
    POLICY.coreScoreThreshold = g('core-threshold');
    POLICY.coreMaxWeight    = g('core-maxw')/100;
    POLICY.satMaxWeight     = g('sat-maxw')/100;
    POLICY.coreUniverse     = gs('core-universe');
    POLICY.ddScale          = [1,2,3,4,5].map(i => parseFloat(wrap.querySelector(`#mt-p-dd${i}`)?.value)||0);
    await UserData.set(POLICY_KEY, POLICY);
    renderAll(wrap);
    const btn = wrap.querySelector('#mt-params-save');
    if (btn) { btn.textContent='✓ Guardado'; btn.style.color='var(--green)'; setTimeout(()=>{btn.textContent='Guardar y versionar';btn.style.color='';},2500); }
  });

  // ── Refresh ───────────────────────────────────────────────────
  if (actionsSlot) {
    actionsSlot.innerHTML = `<button class="btn" style="font-size:10px;padding:5px 12px;">↻ Actualizar</button>`;
    actionsSlot.querySelector('.btn')?.addEventListener('click', async () => {
      await loadState();
      renderAll(wrap);
    });
  }

  renderAll(wrap);

  return {
    destroy() { document.getElementById('mt-css')?.remove(); }
  };
}

function renderParamsForm(el) {
  const set = (id, v) => { const e=el.querySelector('#mt-p-'+id); if(e) e.value=v; };
  set('core',  (POLICY.corePct*100).toFixed(0));
  set('sat',   (POLICY.satPct*100).toFixed(0));
  set('asset', (POLICY.maxAssetNav*100).toFixed(0));
  set('sector',(POLICY.maxSectorNav*100).toFixed(0));
  set('trade', (POLICY.tradeRisk*100).toFixed(2));
  set('port',  (POLICY.portRisk*100).toFixed(0));
  set('crisk', (POLICY.coreRisk*100).toFixed(2));
  set('srisk', (POLICY.satRisk*100).toFixed(2));
  set('core-threshold', POLICY.coreScoreThreshold ?? 6);
  set('core-maxw',     ((POLICY.coreMaxWeight ?? 0.40)*100).toFixed(0));
  set('sat-maxw',      ((POLICY.satMaxWeight  ?? 0.40)*100).toFixed(0));
  set('core-universe', (POLICY.coreUniverse || ['VTI','VEU','IEF','BNDX']).join(', '));
  set('sat-universe',  (POLICY.satUniverse  || []).join(', '));
  POLICY.ddScale.forEach((v,i) => { const e=el.querySelector(`#mt-p-dd${i+1}`); if(e) e.value=v.toFixed(2); });
  const pv = el.querySelector('#mt-policy-version'); if(pv) pv.textContent=POLICY.version;
  const pu = el.querySelector('#mt-policy-updated'); if(pu) pu.textContent=POLICY.updatedAt?new Date(POLICY.updatedAt).toLocaleString('es-ES'):'—';
}

function renderAll(el) {
  renderState(el);
  renderAllocation(el);
  renderRiskBudget(el);
  renderParamsForm(el);
}
