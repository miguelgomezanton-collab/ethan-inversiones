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

// ── Universo base fijo — idéntico al módulo AA antiguo ───────────
const AA_UNIVERSE_BASE = [
  { ticker:'VTI',      name:'Vanguard Total Stock Market',       type:'RV',      category:'allocation' },
  { ticker:'VEU',      name:'Vanguard FTSE All-World ex-US',     type:'RV',      category:'allocation' },
  { ticker:'IEF',      name:'iShares 7-10Y Treasury Bond',       type:'RF',      category:'allocation' },
  { ticker:'BNDX',     name:'Vanguard Total Intl Bond',          type:'RF',      category:'allocation' },
  { ticker:'VNQ',      name:'Vanguard Real Estate ETF',          type:'REIT',    category:'reit'       },
  { ticker:'VNQI',     name:'Vanguard Global ex-US Real Estate', type:'REIT',    category:'reit'       },
  { ticker:'GLD',      name:'SPDR Gold Trust',                   type:'GOLD',    category:'commodity'  },
  { ticker:'SLV',      name:'iShares Silver Trust',              type:'SILVER',  category:'commodity'  },
  { ticker:'USO',      name:'United States Oil Fund',            type:'OIL',     category:'commodity'  },
  { ticker:'SPY',      name:'S&P 500 ETF',                       type:'INDEX',   category:'indicator'  },
  { ticker:'HYG',      name:'iShares High Yield Corp Bond',      type:'HY',      category:'indicator'  },
  { ticker:'EURUSD=X', name:'Euro/Dólar',                        type:'FX',      category:'indicator'  },
];
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
  const coreThreshold = POLICY.coreScoreThreshold ?? 6;
  const coreMaxW = POLICY.coreMaxWeight ?? 0.40;

  // Universo completo = base fijo + tickers extra de Parámetros
  const extraTickers = (POLICY.coreUniverse || [])
    .filter(t => !AA_UNIVERSE_BASE.find(b => b.ticker === t));
  const fullUniverse = [
    ...AA_UNIVERSE_BASE,
    ...extraTickers.map(t => ({ ticker:t, name:t, type:'RV', category:'allocation' }))
  ];

  const coreEl = el.querySelector('#mt-aa-core-results');
  if (coreEl) coreEl.innerHTML = `<div class="mt-loader"><div class="mt-loader-ring"></div>Calculando señales para ${fullUniverse.length} activos...</div>`;

  // Fetch y análisis de todos los activos (con stagger para no saturar proxies)
  const allData = [];
  for (let i = 0; i < fullUniverse.length; i++) {
    const asset = fullUniverse[i];
    await new Promise(r => setTimeout(r, i * 150));
    try {
      const raw = await mtFetchData(asset.ticker);
      const analysis = mtAnalyzeAsset(raw);
      allData.push({ ...asset, ...analysis });
    } catch(e) {
      allData.push({ ...asset, score: 0, error: e.message });
    }
  }

  // Separar por categoría — igual que el módulo antiguo
  const allocationAssets = allData.filter(a => a.category === 'allocation').sort((a,b) => b.score - a.score);
  const reitAssets       = allData.filter(a => a.category === 'reit');
  const commodityAssets  = allData.filter(a => a.category === 'commodity');
  const indicators       = allData.filter(a => a.category === 'indicator');
  const gold   = commodityAssets.find(a => a.ticker === 'GLD');
  const silver = commodityAssets.find(a => a.ticker === 'SLV');
  const oil    = commodityAssets.find(a => a.ticker === 'USO');
  const hy     = indicators.find(a => a.ticker === 'HYG');
  const fx     = indicators.find(a => a.ticker === 'EURUSD=X');
  const spy    = indicators.find(a => a.ticker === 'SPY');

  // Decisión RV vs RF (top 2 de allocation)
  const top2   = allocationAssets.slice(0, 2);
  const rvCount = top2.filter(a => a.type === 'RV').length;
  const rfCount = top2.filter(a => a.type === 'RF').length;
  let recommendation;
  if (rvCount === 2)      recommendation = { type:'RV', label:'Renta Variable', class:'green', desc:'Los 2 más fuertes son RV' };
  else if (rfCount === 2) recommendation = { type:'RF', label:'Renta Fija',     class:'blue',  desc:'Los 2 más fuertes son RF' };
  else                    recommendation = { type:'NEUTRO', label:'Mixto',       class:'amber', desc:'1 RF + 1 RV' };

  const decision = recommendation.type === 'NEUTRO' ? 'RV' : recommendation.type;

  // Elegibles para sizing CORE
  const eligible   = allocationAssets.filter(a => !a.error && a.type === decision && a.score >= coreThreshold);
  const candidates = eligible.length > 0 ? eligible : allocationAssets.filter(a => !a.error && a.type === decision);
  const scoreMedio = candidates.length > 0 ? candidates.reduce((s,a) => s+a.score, 0)/candidates.length : 0;
  const cashPct    = Math.max(0, Math.min(100, ((8 - scoreMedio) / 8) * 100));
  const investedPct = 100 - cashPct;
  const corePositions = mtInverseVol(candidates, coreMaxW, investedPct);

  // Scores RV / RF para el banner
  const rvAssets = allocationAssets.filter(a => a.type === 'RV' && !a.error);
  const rfAssets = allocationAssets.filter(a => a.type === 'RF' && !a.error);
  const rvScore  = rvAssets.reduce((s,a) => s+a.score, 0) / (rvAssets.length||1);
  const rfScore  = rfAssets.reduce((s,a) => s+a.score, 0) / (rfAssets.length||1);

  // Snapshot
  await saveAASnapshot({
    date: new Date().toISOString().slice(0,10),
    decision, recommendation: recommendation.label, rvScore, rfScore, scoreMedio, cashPct,
    scores: allData.map(a => ({ ticker:a.ticker, score:a.score, type:a.type, category:a.category })),
    positions: corePositions.map(p => ({ ticker:p.ticker, weightPct:p.weightPct })),
    nav, coreBudget,
  });

  // Render
  renderCoreEngine(el, {
    allocationAssets, top2, recommendation, reitAssets,
    gold, silver, oil, hy, fx, spy,
    corePositions, scoreMedio, cashPct, investedPct,
    coreThreshold, coreBudget, nav,
    rvScore, rfScore,
  });
}

// ── Helpers visuales idénticos al módulo AA antiguo ─────────────
const AA_PALETTE = { RV:'#40d9c0', RF:'#5fa8e0', REIT:'#a78bfa', GOLD:'#fbbf24', SILVER:'#9ca3af', OIL:'#f47174', Cash:'#3d6460' };
const AA_CAT_COLORS = { RV:'#40d9c0', RF:'#5fa8e0', REIT:'#a78bfa', Commodity:'#fbbf24', Otro:'#9ca3af', Cash:'#3d6460' };
const AA_CAT_LABELS = { RV:'RV', RF:'RF', REIT:'REIT', Commodity:'Commodities', Otro:'Otro', Cash:'Cash' };

function aaScoreClass(s) { return s>=6?'s-high':s>=4?'s-mid':'s-low'; }

function aaCondRow(a) {
  if (!a.mensual) return '';
  return `<div class="aa-cond-row">
    <span class="aa-cond-mini ${a.mensual.macd?'ok':''}">M·MACD</span>
    <span class="aa-cond-mini ${a.mensual.s89?'ok':''}">M·S89</span>
    <span class="aa-cond-mini ${a.mensual.rsi?'ok':''}">M·RSI</span>
    <span class="aa-cond-mini ${a.mensual.precio?'ok':''}">M·P>EMA</span>
    <span class="aa-cond-mini ${a.semanal.macd?'ok':''}">W·MACD</span>
    <span class="aa-cond-mini ${a.semanal.s89?'ok':''}">W·S89</span>
    <span class="aa-cond-mini ${a.semanal.rsi?'ok':''}">W·RSI</span>
    <span class="aa-cond-mini ${a.semanal.precio?'ok':''}">W·P>EMA</span>
  </div>`;
}

function aaAssetCard(a, selected) {
  return `<div class="aa-asset-card ${selected?'selected':''}">
    <div class="aa-asset-top">
      <div>
        <div class="aa-asset-ticker">${a.ticker.replace('=X','')}</div>
        <div class="aa-asset-region">${a.type||''}</div>
      </div>
      <div class="aa-asset-score ${aaScoreClass(a.score)}">${a.score}<span class="aa-asset-score-max">/8</span></div>
    </div>
    ${aaCondRow(a)}
  </div>`;
}

function aaSizingBlock(sizing, coreBudget, nav) {
  if (!sizing || sizing.positions.length === 0) {
    return `<div class="aa-sizing-block">
      <div class="section-title">Cartera CORE <span class="count">inversa de volatilidad</span></div>
      <div class="aa-cash-banner">
        <div class="aa-cash-icon">💵</div>
        <div>
          <div class="aa-cash-title">100% Cash · En espera de señal</div>
          <div class="aa-cash-desc">Ningún activo alcanza score ≥${POLICY.coreScoreThreshold??6}/8. Mantener liquidez hasta que mejoren las condiciones.</div>
        </div>
      </div>
    </div>`;
  }
  const segments = [
    ...sizing.positions.map(p => ({ label:p.ticker, pct:p.weightPct, color:AA_PALETTE[p.type]||'var(--teal)' })),
    ...(sizing.cashPct>0.5 ? [{ label:'CASH', pct:sizing.cashPct, color:AA_PALETTE.Cash }] : [])
  ];
  const barHTML = segments.map(s =>
    `<div class="aa-sizing-seg" style="width:${s.pct.toFixed(1)}%;background:${s.color};" title="${s.label}: ${s.pct.toFixed(1)}%"></div>`
  ).join('');
  const cardsHTML = sizing.positions.map(p => `
    <div class="aa-sizing-card">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:${AA_PALETTE[p.type]||'var(--teal)'}"></span>
        <span class="aa-sizing-ticker">${p.ticker}</span>
      </div>
      <div class="aa-sizing-pct">${p.weightPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--teal);margin-top:3px;">${fmtE(coreBudget*p.weightPct/100)}</div>
      <div class="aa-sizing-meta">score ${p.score}/8</div>
      <div class="aa-sizing-meta-vol">vol 60d: ${p.vol?(p.vol*100).toFixed(2)+'%/día':'—'}</div>
    </div>`
  ).join('') + (sizing.cashPct>0.5 ? `
    <div class="aa-sizing-card cash">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:var(--text3)"></span>
        <span class="aa-sizing-ticker">CASH</span>
      </div>
      <div class="aa-sizing-pct" style="color:var(--text3)">${sizing.cashPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;">${fmtE(coreBudget*sizing.cashPct/100)}</div>
      <div class="aa-sizing-meta">convicción media ${sizing.scoreMedio.toFixed(1)}/8</div>
    </div>` : '');
  return `<div class="aa-sizing-block">
    <div class="section-title">Cartera CORE <span class="count">inversa de volatilidad · score≥${POLICY.coreScoreThreshold??6}</span></div>
    <div class="aa-sizing-layout">
      <div class="aa-sizing-main">
        <div class="aa-sizing-bar">${barHTML}</div>
        <div class="aa-sizing-grid">${cardsHTML}</div>
        <div class="aa-sizing-note">Menos volátil → más peso (desviación estándar 60 sesiones). Cash% = (8 − score medio) / 8. Tope: ${Math.round((POLICY.coreMaxWeight||0.4)*100)}% por activo. Budget CORE: ${fmtE(coreBudget)}</div>
      </div>
    </div>
  </div>`;
}

function renderCoreEngine(el, { allocationAssets, top2, recommendation, reitAssets, gold, silver, oil, hy, fx, spy, corePositions, scoreMedio, cashPct, investedPct, coreThreshold, coreBudget, nav, rvScore, rfScore }) {
  const coreEl = el.querySelector('#mt-aa-core-results');
  if (!coreEl) return;

  const sizing = { positions: corePositions, cashPct, scoreMedio };
  const sizingHTML = aaSizingBlock(sizing, coreBudget, nav);

  // Warnings — idénticos al módulo antiguo
  const warnings = [];
  if (gold && gold.score >= 7) warnings.push({ type:'caution', icon:'🥇', text:'<strong>Oro en máximos:</strong> mercado buscando refugio, incertidumbre elevada.' });
  if (silver && gold && silver.score >= 7 && gold.score >= 7) warnings.push({ type:'caution', icon:'🥈', text:'<strong>Oro y plata fuertes:</strong> señal de refugio amplificada.' });
  if (recommendation.type === 'RV' && hy && hy.score <= 4) warnings.push({ type:'alert', icon:'⚠️', text:'<strong>Divergencia:</strong> RV fuerte pero High Yield débil. Extrema precaución.' });
  if (oil && oil.score >= 7) warnings.push({ type:'caution', icon:'🛢️', text:'<strong>Petróleo muy fuerte:</strong> posible presión inflacionaria.' });
  if (recommendation.type === 'RV' && hy && hy.score >= 6 && gold && gold.score <= 4) warnings.push({ type:'ok', icon:'✓', text:'<strong>Entorno favorable:</strong> RV fuerte, crédito sano, sin búsqueda de refugio.' });
  if (recommendation.type === 'RF' && gold && gold.score >= 6) warnings.push({ type:'alert', icon:'🛡️', text:'<strong>Modo defensivo total:</strong> RF + Oro fuertes. Máxima aversión al riesgo.' });
  if (fx && fx.score >= 7) warnings.push({ type:'alert', icon:'💱', text:'<strong>Euro muy fuerte:</strong> impacto negativo en inversiones USD sin cobertura.' });
  if (hy && hy.score <= 2) warnings.push({ type:'alert', icon:'🚨', text:'<strong>Alerta crítica:</strong> High Yield colapsando. Reducir exposición a riesgo.' });

  // Recesión y cobertura
  const recessionClass = hy && hy.score <= 3 ? 'red' : hy && hy.score <= 5 ? 'amber' : 'green';
  const recessionLabel = hy && hy.score <= 3 ? 'Alto' : hy && hy.score <= 5 ? 'Moderado' : 'Bajo';
  const hedgeClass = fx && fx.score >= 6 ? 'red' : fx && fx.score >= 4 ? 'amber' : 'green';
  const hedgeLabel = fx && fx.score >= 6 ? 'Sí cubrir' : fx && fx.score >= 4 ? 'Vigilar' : 'No cubrir';

  coreEl.innerHTML = `
    <div class="aa-tab-panel">
      ${sizingHTML}

      ${warnings.length ? `<div class="aa-warnings">
        ${warnings.map(w => `<div class="aa-warning-item ${w.type}"><div class="aa-warning-icon">${w.icon}</div><div class="aa-warning-text">${w.text}</div></div>`).join('')}
      </div>` : ''}

      <div class="aa-decision-row">
        <div class="aa-decision-card ${recommendation.class}">
          <div class="aa-decision-label">Decisión de Inversión</div>
          <div class="aa-decision-value ${recommendation.class}">${recommendation.label}</div>
          <div class="aa-decision-desc">${recommendation.desc}</div>
        </div>
        <div class="aa-decision-card ${recessionClass}">
          <div class="aa-decision-label">Riesgo de Recesión</div>
          <div class="aa-decision-value ${recessionClass}">${recessionLabel}</div>
          <div class="aa-decision-desc">${hy ? 'HYG Score: ' + hy.score + '/8' : '—'}</div>
        </div>
        <div class="aa-decision-card ${hedgeClass}">
          <div class="aa-decision-label">Cobertura Cambiaria</div>
          <div class="aa-decision-value ${hedgeClass}">${hedgeLabel}</div>
          <div class="aa-decision-desc">${fx ? 'EUR/USD Score: ' + fx.score + '/8' : '—'}</div>
        </div>
      </div>

      <div class="section-title">Renta Variable vs Renta Fija <span class="count">decisión principal</span></div>
      <div class="aa-asset-grid">
        ${allocationAssets.map(a => aaAssetCard(a, top2.includes(a))).join('')}
      </div>

      <div class="section-title" style="margin-top:24px;">Inmobiliario (REIT) <span class="count">satélite — informativo</span></div>
      <div class="aa-asset-grid">
        ${reitAssets.map(a => aaAssetCard(a, false)).join('')}
      </div>

      <div class="section-title" style="margin-top:24px;">Commodities &amp; Contexto <span class="count">satélite — informativo</span></div>
      <div class="aa-asset-grid satellite">
        ${[gold, silver, oil].filter(Boolean).map(a => aaAssetCard(a, false)).join('')}
      </div>
      <div class="aa-asset-grid satellite" style="margin-top:12px;">
        ${[spy, hy, fx].filter(Boolean).map(a => aaAssetCard(a, false)).join('')}
      </div>
    </div>`;
}

function renderSatEngine(el, { satData, satPositions, satBudget, satUniverse, nav }) {
  const satEl = el.querySelector('#mt-aa-sat-results');
  if (!satEl) return;

  if (!satUniverse.length) {
    satEl.innerHTML = `<div class="empty" style="padding:30px 20px;"><div class="empty-title">Cartera Satélite vacía</div><div class="empty-desc">Añade al menos 2 tickers y pulsa Calcular pesos.</div></div>`;
    return;
  }

  if (!satPositions.length) {
    satEl.innerHTML = `<div class="empty" style="padding:30px 20px;"><div class="empty-title">No se pudo calcular</div><div class="empty-desc">Revisa los tickers o inténtalo de nuevo.</div></div>`;
    return;
  }

  const palette = ['#40d9c0','#a78bfa','#fbbf24','#5fa8e0','#4ade80','#f47174','#9ca3af','#fb923c'];
  const colorMap = {};
  satPositions.forEach((p,i) => colorMap[p.ticker] = palette[i%palette.length]);

  const barHTML = satPositions.map(p =>
    `<div class="aa-sizing-seg" style="width:${p.weightPct.toFixed(1)}%;background:${colorMap[p.ticker]};" title="${p.ticker}: ${p.weightPct.toFixed(1)}%"></div>`
  ).join('');

  const cardsHTML = satPositions.map(p => `
    <div class="aa-sizing-card">
      <div class="aa-sizing-card-top">
        <span class="aa-sizing-dot" style="background:${colorMap[p.ticker]}"></span>
        <span class="aa-sizing-ticker">${p.ticker}</span>
      </div>
      <div class="aa-sizing-pct">${p.weightPct.toFixed(1)}<span class="aa-sizing-pct-sym">%</span></div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--purple);margin-top:3px;">${fmtE(satBudget*p.weightPct/100)}</div>
      <div class="aa-sizing-meta-vol">vol 60d: ${p.vol?(p.vol*100).toFixed(2)+'%/día':'—'}</div>
    </div>`
  ).join('');

  const failed = satData.filter(a=>a.error);

  satEl.innerHTML = `
    <div class="aa-tab-panel">
      <div class="aa-sizing-block">
        <div class="section-title">Reparto Sugerido <span class="count">inversa de volatilidad · 100% invertido, sin cash</span></div>
        <div class="aa-sizing-layout">
          <div class="aa-sizing-main">
            <div class="aa-sizing-bar">${barHTML}</div>
            <div class="aa-sizing-grid">${cardsHTML}</div>
            <div class="aa-sizing-note">Menos volátil → más peso (60 sesiones). Tope ${Math.round((POLICY.satMaxWeight||0.4)*100)}% por activo. Sin filtro de score. Budget SAT: ${fmtE(satBudget)}</div>
            ${failed.length ? `<div class="aa-sizing-note" style="color:var(--amber);margin-top:6px;">⚠ Sin datos: ${failed.map(a=>a.ticker).join(', ')}</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
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

      <!-- Subpestañas AA -->
      <div style="display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:16px;">
        <button class="mt-aa-subtab active" data-aatab="overview" style="padding:8px 16px;background:transparent;border:none;color:var(--teal);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid var(--teal);font-family:var(--sans);">📊 Overview</button>
        <button class="mt-aa-subtab" data-aatab="core" style="padding:8px 16px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent;font-family:var(--sans);">🎯 CORE</button>
        <button class="mt-aa-subtab" data-aatab="sat" style="padding:8px 16px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;border-bottom:2px solid transparent;font-family:var(--sans);">🛰 SATÉLITE</button>
      </div>

      <!-- OVERVIEW -->
      <div class="mt-aa-subpanel active" id="mt-aa-panel-overview">
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
        <div class="mt-sdiv"><div class="mt-sdiv-lbl">Límites de Exposición</div><div class="mt-sdiv-line"></div></div>
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
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);">Inversa de volatilidad · 100% invertido · Tope <span id="mt-aa-sat-maxw-label">${Math.round((POLICY.satMaxWeight??0.40)*100)}%</span> por activo · Budget SAT: <span id="mt-aa-sat-budget-label">—</span></div>
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
          ${[
            {label:'DD 0 – 3%', id:'mt-p-dd1', color:'var(--green)'},
            {label:'DD 3 – 5%', id:'mt-p-dd2', color:'var(--teal)'},
            {label:'DD 5 – 8%', id:'mt-p-dd3', color:'var(--amber)'},
            {label:'DD 8 – 10%',id:'mt-p-dd4', color:'var(--red)'},
            {label:'DD > 10%',  id:'mt-p-dd5', color:'var(--red)'},
          ].map(b => `
            <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;text-align:center;">
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:6px;">${b.label}</div>
              <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
                <span style="font-family:var(--mono);font-size:13px;color:var(--text3);">×</span>
                <input type="number" id="${b.id}" class="mt-input" step="0.05" style="width:60px;padding:4px 6px;font-size:13px;text-align:center;color:${b.color};">
              </div>
            </div>`).join('')}
        </div>

        <!-- Situación actual dinámica -->
        <div id="mt-p-dd-status" style="background:var(--surface2);border-radius:8px;padding:10px 14px;font-family:var(--mono);font-size:10px;color:var(--text2);">
          —
        </div>
      </div>

      <div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:10px;color:var(--text2);line-height:1.6;">
        ⚠ Guardar crea una nueva versión de política. Todas las propuestas quedan vinculadas a la versión activa en el momento de su cálculo.
      </div>
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

  // ── Subpestañas Asset Allocation ─────────────────────────────
  wrap.querySelectorAll('.mt-aa-subtab').forEach(tab => {
    tab.addEventListener('click', () => {
      wrap.querySelectorAll('.mt-aa-subtab').forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--text3)';
        t.style.borderBottomColor = 'transparent';
      });
      wrap.querySelectorAll('.mt-aa-subpanel').forEach(p => p.style.display='none');
      tab.classList.add('active');
      tab.style.color = 'var(--teal)';
      tab.style.borderBottomColor = 'var(--teal)';
      const panel = wrap.querySelector(`#mt-aa-panel-${tab.dataset.aatab}`);
      if (panel) panel.style.display = 'block';
    });
  });

  // Actualizar labels dinámicos de CORE y SAT en subpestañas
  function updateAALabels() {
    const nav = STATE?.nav || 0;
    const ul = wrap.querySelector('#mt-aa-core-universe-label');
    const tl = wrap.querySelector('#mt-aa-core-threshold-label');
    const bl = wrap.querySelector('#mt-aa-core-budget-label');
    const sl = wrap.querySelector('#mt-aa-sat-budget-label');
    const mw = wrap.querySelector('#mt-aa-sat-maxw-label');
    if (ul) ul.textContent = (POLICY.coreUniverse||['VTI','VEU','IEF','BNDX']).join(', ');
    if (tl) tl.textContent = POLICY.coreScoreThreshold ?? 6;
    if (bl) bl.textContent = fmtE(nav * POLICY.corePct);
    if (sl) sl.textContent = fmtE(nav * POLICY.satPct);
    if (mw) mw.textContent = Math.round((POLICY.satMaxWeight??0.40)*100)+'%';
  }
  updateAALabels();

  // ── Slider CORE/SAT ───────────────────────────────────────────
  const slider = wrap.querySelector('#mt-p-core-slider');
  function updateSliderUI(val) {
    const sat = 100 - val;
    const coreBar = wrap.querySelector('#mt-p-core-bar');
    const satBar  = wrap.querySelector('#mt-p-sat-bar');
    if (coreBar) coreBar.style.width = val + '%';
    if (satBar)  satBar.style.width  = sat + '%';
    const cp = wrap.querySelector('#mt-p-core-bar-pct');
    const sp = wrap.querySelector('#mt-p-sat-bar-pct');
    if (cp) cp.textContent = val;
    if (sp) sp.textContent = sat;
    const ch = wrap.querySelector('#mt-p-core');
    const sh = wrap.querySelector('#mt-p-sat');
    if (ch) ch.value = val;
    if (sh) sh.value = sat;
  }
  slider?.addEventListener('input', () => updateSliderUI(parseInt(slider.value)));

  // ── Status DD dinámico ────────────────────────────────────────
  function updateDDStatus() {
    const el2 = wrap.querySelector('#mt-p-dd-status');
    if (!el2 || !STATE) return;
    const dd = STATE.drawdownActual || 0;
    const mult = getDDMult(dd);
    const baseRisk = parseFloat(wrap.querySelector('#mt-p-trade')?.value || POLICY.tradeRisk*100);
    const effective = (baseRisk * mult).toFixed(2);
    el2.innerHTML = `<strong>Situación actual:</strong> DD ${(dd*100).toFixed(1)}% → multiplicador <strong>×${mult.toFixed(2)}</strong> → riesgo base efectivo <strong style="color:var(--amber);">${effective}% NAV</strong>`;
  }
  updateDDStatus();
  wrap.querySelector('#mt-p-trade')?.addEventListener('input', updateDDStatus);
  wrap.querySelector('#mt-aa-run-btn')?.addEventListener('click', () => {
    updateAALabels();
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
    const g  = id => parseFloat(wrap.querySelector('#'+id)?.value)||0;
    const gs = id => (wrap.querySelector('#'+id)?.value||'').split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);

    // Leer valores
    const corePct   = g('mt-p-core');
    const satPct    = 100 - corePct;
    const asset     = g('mt-p-asset')/100;
    const sector    = g('mt-p-sector')/100;
    const coreMaxW  = g('mt-p-core-maxw')/100;
    const volWin    = g('mt-p-vol-window');
    const trade     = g('mt-p-trade')/100;
    const port      = g('mt-p-port')/100;
    const coreRisk  = g('mt-p-crisk')/100;
    const satRisk   = g('mt-p-srisk')/100;
    const ddScale   = [1,2,3,4,5].map(i => parseFloat(wrap.querySelector(`#mt-p-dd${i}`)?.value)||0);

    // ── Validaciones HARD ────────────────────────────────────────
    const errors = [];
    if (Math.abs(corePct + satPct - 100) > 0.1)        errors.push('CORE + SAT debe sumar exactamente 100%.');
    if (trade > port)                                   errors.push(`Riesgo base/op. (${(trade*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(port*100).toFixed(2)}%).`);
    if (coreRisk > port)                                errors.push(`Riesgo máx. CORE (${(coreRisk*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(port*100).toFixed(2)}%).`);
    if (satRisk > port)                                 errors.push(`Riesgo máx. SAT (${(satRisk*100).toFixed(2)}%) no puede superar el riesgo máximo de cartera (${(port*100).toFixed(2)}%).`);
    if (coreMaxW <= 0 || coreMaxW > 1)                 errors.push('Peso máximo CORE debe estar entre 1% y 100%.');
    if (asset > sector)                                 errors.push(`Límite por activo (${(asset*100).toFixed(0)}% NAV) no puede superar el límite sectorial (${(sector*100).toFixed(0)}% NAV).`);
    if (volWin < 10 || volWin > 252)                   errors.push('Ventana de volatilidad debe estar entre 10 y 252 sesiones.');
    for (let i=1; i<ddScale.length; i++) {
      if (ddScale[i] > ddScale[i-1] + 0.001)           errors.push(`DD Scaling debe ser decreciente: banda ${i+1} (×${ddScale[i]}) > banda ${i} (×${ddScale[i-1]}).`);
    }
    if (ddScale[0] > 1.001)                             errors.push('El primer multiplicador DD no puede ser mayor que 1.');

    if (errors.length > 0) {
      // Mostrar errores sin versionar
      const errHTML = errors.map(e => `<div style="display:flex;gap:8px;"><span style="color:var(--red);">✗</span><span>${e}</span></div>`).join('');
      const existingErr = wrap.querySelector('#mt-params-errors');
      if (existingErr) existingErr.remove();
      const errDiv = document.createElement('div');
      errDiv.id = 'mt-params-errors';
      errDiv.style.cssText = 'background:rgba(244,113,116,0.08);border:1px solid rgba(244,113,116,0.3);border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:11px;color:var(--text2);line-height:1.8;';
      errDiv.innerHTML = `<div style="font-weight:700;color:var(--red);margin-bottom:8px;">⚠ Política no válida — no se ha guardado:</div>${errHTML}`;
      wrap.querySelector('#mt-params-save').insertAdjacentElement('beforebegin', errDiv);
      return;
    }

    // Limpiar errores anteriores
    wrap.querySelector('#mt-params-errors')?.remove();

    // Guardar
    POLICY.corePct            = corePct/100;
    POLICY.satPct             = satPct/100;
    POLICY.maxAssetNav        = asset;
    POLICY.maxSectorNav       = sector;
    POLICY.coreUniverse       = gs('mt-p-core-universe');
    POLICY.coreScoreThreshold = g('mt-p-core-threshold');
    POLICY.coreMaxWeight      = coreMaxW;
    POLICY.volWindow          = volWin;
    POLICY.tradeRisk          = trade;
    POLICY.portRisk           = port;
    POLICY.coreRisk           = coreRisk;
    POLICY.satRisk            = satRisk;
    POLICY.ddScale            = ddScale;
    await UserData.set(POLICY_KEY, POLICY);
    renderAll(wrap);
    const btn = wrap.querySelector('#mt-params-save');
    if (btn) { btn.textContent='✓ Guardado · v'+POLICY.version.slice(0,10); btn.style.color='var(--green)'; setTimeout(()=>{btn.textContent='💾 Guardar y versionar';btn.style.color='';},2500); }
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
  const set = (id, v) => { const e=el.querySelector('#'+id); if(e) e.value=v; };
  const corePct = Math.round(POLICY.corePct*100);
  const satPct  = 100 - corePct;
  const slider = el.querySelector('#mt-p-core-slider');
  if (slider) slider.value = corePct;
  const cp = el.querySelector('#mt-p-core-bar-pct'); if (cp) cp.textContent = corePct;
  const sp = el.querySelector('#mt-p-sat-bar-pct');  if (sp) sp.textContent = satPct;
  const cb = el.querySelector('#mt-p-core-bar');     if (cb) cb.style.width = corePct + '%';
  const sb = el.querySelector('#mt-p-sat-bar');      if (sb) sb.style.width = satPct + '%';
  set('mt-p-core',           corePct);
  set('mt-p-sat',            satPct);
  set('mt-p-asset',          (POLICY.maxAssetNav*100).toFixed(0));
  set('mt-p-sector',         (POLICY.maxSectorNav*100).toFixed(0));
  set('mt-p-core-universe',  (POLICY.coreUniverse||[]).join(', '));
  set('mt-p-core-threshold', POLICY.coreScoreThreshold ?? 6);
  set('mt-p-core-maxw',      ((POLICY.coreMaxWeight??0.40)*100).toFixed(0));
  set('mt-p-vol-window',     POLICY.volWindow ?? 60);
  set('mt-p-trade',          (POLICY.tradeRisk*100).toFixed(2));
  set('mt-p-port',           (POLICY.portRisk*100).toFixed(0));
  set('mt-p-crisk',          (POLICY.coreRisk*100).toFixed(2));
  set('mt-p-srisk',          (POLICY.satRisk*100).toFixed(2));
  POLICY.ddScale.forEach((v,i) => set(`mt-p-dd${i+1}`, v.toFixed(2)));
  const pv = el.querySelector('#mt-policy-version'); if(pv) pv.textContent = POLICY.version;
  const pu = el.querySelector('#mt-policy-updated'); if(pu) pu.textContent = POLICY.updatedAt ? new Date(POLICY.updatedAt).toLocaleString('es-ES') : 'Sin guardar';
  // DD status
  const ddSt = el.querySelector('#mt-p-dd-status');
  if (ddSt && STATE) {
    const dd = STATE.drawdownActual || 0;
    const mult = getDDMult(dd);
    const base = POLICY.tradeRisk*100;
    ddSt.innerHTML = `<strong>Situación actual:</strong> DD ${(dd*100).toFixed(1)}% → multiplicador <strong>×${mult.toFixed(2)}</strong> → riesgo base efectivo <strong style="color:var(--amber);">${(base*mult).toFixed(2)}% NAV</strong>`;
  }

  // Límite efectivo CORE (mínimo entre límite interno y límite global)
  const effEl = el.querySelector('#mt-p-effective-limit');
  if (effEl) {
    const corePctV  = POLICY.corePct;
    const maxCoreW  = POLICY.coreMaxWeight ?? 0.40;
    const maxAsset  = POLICY.maxAssetNav;
    const limitInterno = maxCoreW * corePctV;       // ej. 40% × 65% = 26% NAV
    const limitEfect   = Math.min(limitInterno, maxAsset);
    const manda = limitEfect === maxAsset ? 'límite global' : 'límite interno CORE';
    const nav = STATE?.nav || 0;
    effEl.innerHTML = `Límite efectivo por activo CORE: <strong style="color:var(--teal);">${(limitEfect*100).toFixed(1)}% NAV</strong> (${fmtE(nav*limitEfect)}) · manda ${manda}`;
  }

  // Risk status — riesgo abierto vs límites
  const riskSt = el.querySelector('#mt-p-risk-status');
  if (riskSt && STATE) {
    const { nav, openRisk, positions } = STATE;
    const openRiskPct = nav > 0 ? openRisk/nav : 0;
    const openCORE = positions.filter(p=>p.bucket==='core').reduce((s,p)=>s+(p.capitalAtRisk||0),0);
    const openSAT  = positions.filter(p=>p.bucket==='sat').reduce((s,p)=>s+(p.capitalAtRisk||0),0);
    const openCorePct = nav>0 ? openCORE/nav : 0;
    const openSatPct  = nav>0 ? openSAT/nav  : 0;
    const availGlobal = Math.max(0, POLICY.portRisk - openRiskPct);
    const availCORE   = Math.max(0, POLICY.coreRisk  - openCorePct);
    const availSAT    = Math.max(0, POLICY.satRisk   - openSatPct);
    const col = (used, lim) => used > lim ? 'var(--red)' : used > lim*0.7 ? 'var(--amber)' : 'var(--green)';
    riskSt.innerHTML = `
      Riesgo abierto cartera: <strong style="color:${col(openRiskPct, POLICY.portRisk)}">${(openRiskPct*100).toFixed(2)}%</strong> · disponible: <strong style="color:var(--green);">${(availGlobal*100).toFixed(2)}%</strong><br>
      CORE abierto: <strong style="color:${col(openCorePct, POLICY.coreRisk)}">${(openCorePct*100).toFixed(2)}%</strong> · disponible: <strong>${(availCORE*100).toFixed(2)}%</strong> &nbsp;|&nbsp;
      SAT abierto: <strong style="color:${col(openSatPct, POLICY.satRisk)}">${(openSatPct*100).toFixed(2)}%</strong> · disponible: <strong>${(availSAT*100).toFixed(2)}%</strong>`;
  }
}

function renderAll(el) {
  renderState(el);
  renderAllocation(el);
  renderRiskBudget(el);
  renderParamsForm(el);
}
