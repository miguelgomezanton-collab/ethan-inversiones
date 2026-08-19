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
// LOAD — carga de datos desde Firestore via UserData
// ════════════════════════════════════════════════════════════════
async function loadState() {
  try {
    // 1. Política
    const savedPolicy = await UserData.get(POLICY_KEY);
    if (savedPolicy) POLICY = { ...POLICY_DEFAULT, ...savedPolicy };

    // 2. Capital
    const capA = (await UserData.get('ethan_capital_alcista')) || 0;
    const capB = (await UserData.get('ethan_capital_bajista')) || 0;
    const nav  = capA + capB;

    // 3. Posiciones abiertas
    const rawPos = (await UserData.get('ethan_positions')) || [];

    // 4. Historial cerradas
    const history = (await UserData.get('ethan_positions_history')) || [];
    const pnlReal = history.reduce((s,h) => s + (h.pnlAbs||0), 0);

    // 5. Precios actuales
    const positions = await Promise.all(rawPos.map(async p => {
      let current = p.currentPrice || p.entry || 0;
      try {
        const px = await UserData.get(`ethan_px_latest_${p.ticker}`);
        if (px?.close) current = px.close;
      } catch {}
      const dir    = p.direction || 'alcista';
      const pnlPct = dir === 'bajista'
        ? (p.entry - current) / p.entry
        : (current - p.entry) / p.entry;
      const shares = p.shares || (p.cost && p.entry ? Math.round(p.cost/p.entry) : 0);
      const cost   = shares * p.entry;
      const mktVal = shares * current;
      const pnlAbs = pnlPct * cost;
      const bucket = p.bucket || 'sat';
      const sector = p.sector || 'desconocido';
      const stop   = p.stopManual || p.stopDiario || 0;
      return { ...p, current, pnlPct, pnlAbs, cost, mktVal, bucket, sector, stop, dir, shares };
    }));

    // 6. Exposiciones
    const invested = positions.reduce((s,p) => s + p.mktVal, 0);
    const cash     = Math.max(0, nav - invested);
    const unrealPnl= positions.reduce((s,p) => s + p.pnlAbs, 0);
    const buckets  = { core:0, sat:0 };
    const sectors  = {};
    positions.forEach(p => {
      buckets[p.bucket] = (buckets[p.bucket]||0) + p.mktVal;
      sectors[p.sector] = (sectors[p.sector]||0) + p.mktVal;
    });

    // 7. Riesgo abierto (distancia al stop)
    const openRisk = positions.reduce((s,p) => {
      if (!p.stop || p.stop <= 0 || !p.current) return s;
      const riskPct = p.dir === 'bajista'
        ? Math.abs(p.stop - p.current) / p.current
        : Math.abs(p.current - p.stop) / p.current;
      return s + riskPct * p.mktVal;
    }, 0);

    // 8. Drawdown desde el fondo
    const fondo = await UserData.get('ethan_fondo');
    const VL0   = 100;
    const parts = fondo?.participaciones || (nav / VL0);
    const vlActual = parts > 0 ? nav / parts : VL0;
    let hwmVL = VL0;
    if (fondo?.movimientos) {
      // Simplificado — el HWM real viene de la serie completa (fondo.js)
      hwmVL = Math.max(VL0, ...fondo.movimientos.map(m => m.vl||VL0));
    }
    const drawdownActual = hwmVL > 0 ? (vlActual - hwmVL) / hwmVL : 0;
    const hwm = hwmVL * parts;

    STATE = {
      nav, cash, invested, unrealPnl, pnlReal,
      positions, buckets, sectors,
      openRisk, openRiskPct: nav > 0 ? openRisk / nav : 0,
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
    : `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:680px;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          ${['TICKER','DIR','ENTRADA','ACTUAL','P&L%','STOP','RIESGO€','% NAV','BUCKET'].map(h=>
            `<th style="font-family:var(--mono);font-size:9px;text-transform:uppercase;color:var(--text3);padding:7px 10px;text-align:${['TICKER','DIR','BUCKET'].includes(h)?'left':'right'};">${h}</th>`
          ).join('')}
        </tr></thead>
        <tbody>
          ${positions.map(p => {
            const riskE = p.stop>0 ? Math.abs(p.current-p.stop)/p.current*p.mktVal : 0;
            const pctN  = p.mktVal/nav;
            return `<tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px 10px;font-weight:700;">${p.ticker}</td>
              <td style="padding:8px 10px;"><span class="mt-badge ${p.dir==='bajista'?'mt-fail':'mt-pass'}" style="font-size:8px;">${p.dir==='bajista'?'SHORT':'LONG'}</span></td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);">$${p.entry.toFixed(2)}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);">$${p.current.toFixed(2)}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:${col(p.pnlPct)};">${fmtP(p.pnlPct,2)}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${p.stop>0?'$'+p.stop.toFixed(2):'—'}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);color:var(--red);">${p.stop>0?fmtE(riskE):'—'}</td>
              <td style="padding:8px 10px;text-align:right;font-family:var(--mono);">${(pctN*100).toFixed(1)}%</td>
              <td style="padding:8px 10px;"><span style="font-family:var(--mono);font-size:9px;color:${p.bucket==='core'?'var(--teal)':'var(--purple)'};">${p.bucket.toUpperCase()}</span></td>
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

  // Target vs Actual
  const totalInv = (buckets.core||0)+(buckets.sat||0);
  const rows = [
    { dim:'CORE',      tgt:POLICY.corePct, act:(buckets.core||0)/nav, tol:0.05 },
    { dim:'SATÉLITE',  tgt:POLICY.satPct,  act:(buckets.sat||0)/nav,  tol:0.05 },
    { dim:'RV Total',  tgt:POLICY.corePct+POLICY.satPct, act:totalInv/nav, tol:0.10 },
    { dim:'Cash',      tgt:0, act:cash/nav, tol:0.20 },
  ];
  const tbody = el.querySelector('#mt-alloc-table');
  if (tbody) tbody.innerHTML = rows.map(r => {
    const d = r.act - r.tgt;
    const ad = Math.abs(d);
    const sc = ad<r.tol?'var(--green)':ad<r.tol*1.5?'var(--amber)':'var(--red)';
    const st = ad<r.tol?'✓ En rango':ad<r.tol*1.5?'⚠ Cerca':'✗ Fuera';
    const dc = d===0?'mt-delta-nu':d>0?'mt-delta-up':'mt-delta-dn';
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:9px 12px;font-weight:700;">${r.dim}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${r.tgt>0?fmtP(r.tgt):'—'}</td>
      <td style="padding:9px 12px;text-align:right;font-family:var(--mono);">${fmtP(r.act)}</td>
      <td style="padding:9px 12px;text-align:right;"><span class="mt-delta ${dc}">${d===0?'—':(d>0?'+':'')}${(d*100).toFixed(1)} pp</span></td>
      <td style="padding:9px 12px;text-align:right;font-size:10px;color:${sc};">${st}</td>
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
            ${['Dimensión','Target','Actual','Delta','Estado'].map((h,i)=>
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

  // ── Sizing button ─────────────────────────────────────────────
  wrap.querySelector('#mt-sz-btn')?.addEventListener('click', () => calcSizing(wrap));

  // ── Params save ───────────────────────────────────────────────
  wrap.querySelector('#mt-params-save')?.addEventListener('click', async () => {
    const g = id => parseFloat(wrap.querySelector('#mt-p-'+id)?.value)||0;
    POLICY.corePct      = g('core')/100;
    POLICY.satPct       = g('sat')/100;
    POLICY.maxAssetNav  = g('asset')/100;
    POLICY.maxSectorNav = g('sector')/100;
    POLICY.tradeRisk    = g('trade')/100;
    POLICY.portRisk     = g('port')/100;
    POLICY.coreRisk     = g('crisk')/100;
    POLICY.satRisk      = g('srisk')/100;
    POLICY.ddScale      = [1,2,3,4,5].map(i => parseFloat(wrap.querySelector(`#mt-p-dd${i}`)?.value)||0);
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
