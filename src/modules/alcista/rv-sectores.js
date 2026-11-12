import { saveModuleState } from '../../router.js';
import { UserData } from '../../userdata.js';
// ═══════════════════════════════════════════════
// MÓDULO: Screener por Sectores
// Misma interfaz y motor que el Screener de Índices.
// Pestañas por sector SPDR con los componentes del SP500
// clasificados por sector. Escaneo independiente por pestaña.
// ═══════════════════════════════════════════════

const SECTORS_CONFIG = [
  { key: 'XLK',  label: 'Tech',        emoji: '💻' },
  { key: 'XLF',  label: 'Financials',  emoji: '🏦' },
  { key: 'XLV',  label: 'Health',      emoji: '🏥' },
  { key: 'XLE',  label: 'Energy',      emoji: '⚡' },
  { key: 'XLY',  label: 'Consumer D',  emoji: '🛍️' },
  { key: 'XLP',  label: 'Consumer S',  emoji: '🛒' },
  { key: 'XLI',  label: 'Industrials', emoji: '🏭' },
  { key: 'XLB',  label: 'Materials',   emoji: '⚗️' },
  { key: 'XLU',  label: 'Utilities',   emoji: '💡' },
  { key: 'XLRE', label: 'Real Estate', emoji: '🏢' },
  { key: 'XLC',  label: 'Comm',        emoji: '📡' },
];

// ── ETFs especializados por sector (FASE 1) ─────
// NO modificar SECTORS_CONFIG ni SECTOR_TICKERS
const SUBSECTORS_CONFIG = {
  XLK:  [
    { ticker: 'SMH',  name: 'Semiconductores',         emoji: '🔬' },
    { ticker: 'IGV',  name: 'Software',                emoji: '💾' },
    { ticker: 'CIBR', name: 'Ciberseguridad',          emoji: '🔐' },
    { ticker: 'SKYY', name: 'Cloud Computing',         emoji: '☁️' },
    { ticker: 'AIQ',  name: 'Inteligencia Artificial', emoji: '🤖' },
    { ticker: 'BOTZ', name: 'Robótica y Automatización',emoji: '⚙️' },
    { ticker: 'FDN',  name: 'Internet',                emoji: '🌐' },
    { ticker: 'QTUM', name: 'Computación Cuántica',    emoji: '⚛️' },
  ],
  XLF:  [
    { ticker: 'KBWB', name: 'Bancos',                  emoji: '🏦' },
    { ticker: 'KRE',  name: 'Bancos Regionales',       emoji: '🏘️' },
    { ticker: 'KIE',  name: 'Seguros',                 emoji: '🛡️' },
    { ticker: 'IYG',  name: 'Servicios Financieros',   emoji: '💳' },
    { ticker: 'KCE',  name: 'Bolsas y Trading',        emoji: '📈' },
    { ticker: 'FINX', name: 'Fintech',                 emoji: '📱' },
    { ticker: 'PSP',  name: 'Private Equity',          emoji: '🤝' },
    { ticker: 'BIZD', name: 'BDCs',                    emoji: '💼' },
  ],
  XLV:  [
    { ticker: 'XBI',  name: 'Biotecnología',           emoji: '🧬' },
    { ticker: 'IBB',  name: 'Biotecnología Nasdaq',    emoji: '🔬' },
    { ticker: 'IHE',  name: 'Farmacéuticas',           emoji: '💊' },
    { ticker: 'IHI',  name: 'Equipo Médico',           emoji: '🏥' },
    { ticker: 'IHF',  name: 'Seguros Salud',           emoji: '❤️' },
    { ticker: 'ARKG', name: 'Genómica',                emoji: '🧪' },
  ],
  XLE:  [
    { ticker: 'XOP',  name: 'E&P Petróleo',            emoji: '🛢️' },
    { ticker: 'OIH',  name: 'Servicios Petróleo',      emoji: '⛽' },
    { ticker: 'FCG',  name: 'Gas Natural',             emoji: '🔥' },
    { ticker: 'AMLP', name: 'MLP Midstream',           emoji: '🚰' },
    { ticker: 'TAN',  name: 'Solar',                   emoji: '☀️' },
    { ticker: 'ICLN', name: 'Energías Limpias',        emoji: '♻️' },
    { ticker: 'URA',  name: 'Uranio',                  emoji: '☢️' },
    { ticker: 'NLR',  name: 'Nuclear',                 emoji: '⚛️' },
  ],
  XLI:  [
    { ticker: 'ITA',  name: 'Defensa y Aeroespacial',  emoji: '✈️' },
    { ticker: 'PAVE', name: 'Infraestructura',         emoji: '🏗️' },
    { ticker: 'IYT',  name: 'Transporte',              emoji: '🚂' },
    { ticker: 'JETS', name: 'Aerolíneas',              emoji: '✈️' },
    { ticker: 'AIRR', name: 'Aviación EE.UU.',         emoji: '🛩️' },
    { ticker: 'XAR',  name: 'Defensa SPDR',            emoji: '🛡️' },
  ],
  XLY:  [
    { ticker: 'XRT',  name: 'Retail',                  emoji: '🛒' },
    { ticker: 'IBUY', name: 'E-Commerce',              emoji: '📦' },
    { ticker: 'ITB',  name: 'Construcción Residencial',emoji: '🏠' },
    { ticker: 'PEJ',  name: 'Ocio y Hostelería',       emoji: '🍽️' },
    { ticker: 'ESPO', name: 'Videojuegos (eSports)',   emoji: '🎮' },
    { ticker: 'CARZ', name: 'Automoción',              emoji: '🚗' },
  ],
  XLP:  [
    { ticker: 'PBJ',  name: 'Alimentos y Bebidas',     emoji: '🥤' },
    { ticker: 'MOO',  name: 'Agronegocio',             emoji: '🌾' },
    { ticker: 'FSTA', name: 'Consumo Básico iShares',  emoji: '🛒' },
  ],
  XLB:  [
    { ticker: 'GDX',  name: 'Mineras Oro',             emoji: '🥇' },
    { ticker: 'SIL',  name: 'Mineras Plata',           emoji: '🥈' },
    { ticker: 'COPX', name: 'Cobre',                   emoji: '🟤' },
    { ticker: 'XME',  name: 'Metales y Minería',       emoji: '⛏️' },
    { ticker: 'LIT',  name: 'Litio y Baterías',        emoji: '🔋' },
    { ticker: 'GUNR', name: 'Recursos Naturales',      emoji: '🌲' },
    { ticker: 'SLX',  name: 'Acero',                   emoji: '🏗️' },
    { ticker: 'REMX', name: 'Tierras Raras',           emoji: '🔮' },
  ],
  XLU:  [
    { ticker: 'GRID', name: 'Smart Grid',              emoji: '⚡' },
    { ticker: 'PHO',  name: 'Agua',                    emoji: '💧' },
    { ticker: 'FIW',  name: 'Agua First Trust',        emoji: '🌊' },
    { ticker: 'NLR',  name: 'Nuclear',                 emoji: '⚛️' },
  ],
  XLRE: [
    { ticker: 'VNQ',  name: 'REITs Diversificados',    emoji: '🏢' },
    { ticker: 'REET', name: 'REITs Globales',          emoji: '🌍' },
    { ticker: 'REM',  name: 'Mortgage REITs',          emoji: '🏦' },
    { ticker: 'DTCR', name: 'Data Centers',            emoji: '🖥️' },
  ],
  XLC:  [
    { ticker: 'IYZ',  name: 'Telecomunicaciones',      emoji: '📡' },
    { ticker: 'FDN',  name: 'Internet',                emoji: '🌐' },
    { ticker: 'SOCL', name: 'Redes Sociales',          emoji: '📲' },
    { ticker: 'PBS',  name: 'Media y Entretenimiento', emoji: '📺' },
    { ticker: 'ESPO', name: 'Videojuegos (eSports)',   emoji: '🎮' },
  ],
};

const SECTOR_TICKERS = {
  XLK:  ["AAPL","MSFT","NVDA","AVGO","ORCL","CRM","AMD","QCOM","AMAT","ACN","CSCO","INTU","NOW","IBM","TXN","ADI","KLAC","LRCX","PANW","SNPS","CDNS","MCHP","FTNT","ADSK","ANSS","ANET","KEYS","GDDY","IT","EPAM","CTSH","NXPI","ON","SWKS","JNPR","HPQ","HPE","CDW","WDC","STX","NTAP","PTC","VRSN","TDY","FFIV","AKAM","TRMB","TYL","LDOS","GLW","QRVO","MPWR"],
  XLF:  ["JPM","BAC","WFC","GS","MS","BX","KKR","BLK","SCHW","C","AXP","USB","PNC","TFC","COF","ICE","CME","SPGI","MCO","BK","STT","MTB","CFG","HBAN","RF","KEY","NTRS","FITB","CMA","ZION","AFL","MET","PRU","AIG","TRV","CB","ALL","PGR","HIG","AJG","MMC","AON","WTW","BRO","CINF","RE","ACGL","FNF","FAF","SYF","DFS","GL","RJF","ALLY","EFX","NDAQ","V","MA","PYPL","FIS","FI","GPN","CBOE"],
  XLV:  ["UNH","JNJ","LLY","ABBV","MRK","TMO","ABT","DHR","PFE","BMY","ELV","CVS","CI","SYK","MDT","ISRG","GILD","BSX","VRTX","REGN","HUM","HCA","MOH","CNC","EW","IDXX","BDX","IQV","A","ZBH","WAT","RMD","HOLX","BIIB","INCY","DGX","LH","BAX","STE","HSIC","TECH","BIO","RVTY","PODD","MTD","DXCM","ALGN","DVA","UHS","MRNA"],
  XLE:  ["XOM","CVX","COP","EOG","SLB","MPC","PSX","VLO","OXY","WMB","KMI","HAL","DVN","BKR","FANG","APA","MRO","OKE","TRGP","HES","LNG","CQP","PXD","NOG","MTDR","SM","CIVI","PR","CHRD","MGY","PBF","DINO","HFC","VVV","ET","WES","MPLX","EPD","PAA"],
  XLY:  ["AMZN","TSLA","HD","MCD","NKE","LOW","BKNG","TJX","CMG","SBUX","F","GM","ORLY","AZO","ABNB","MAR","HLT","YUM","DPZ","DRI","RCL","CCL","NCLH","EL","ETSY","APTV","BWA","LKQ","KMX","RL","PVH","TPR","VFC","HAS","WHR","POOL","DHI","LEN","PHM","NVR","TOL","EXPE","ULTA","BBWI","CZR","MGM","LVS","WYNN","HGV","VAC"],
  XLP:  ["PG","KO","PEP","COST","WMT","PM","MO","MDLZ","KMB","CL","GIS","K","SJM","CAG","HRL","TSN","MKC","CPB","CHD","CLX","SFM","USFD","SYY","BG","ADM","MOS","NTR","CF","CTVA","FMC","CALM","LANC","JJSF","UTZ","SMPL","WEIS","SPTN","MGPI","IPAR"],
  XLI:  ["RTX","HON","UPS","CAT","GE","DE","BA","LMT","ETN","EMR","GD","NOC","PH","ITW","ROK","AME","IR","PCAR","OTIS","CARR","AXON","TT","XYL","GNRC","JCI","ROP","GWW","SNA","FAST","EXPD","ODFL","CSX","UNP","NSC","WAB","JBHT","FDX","CTAS","MSM","NDSN","RBC","HWM","TDG","TXT","HII","LDOS","BAH","SAIC","MANT","KBR","CHRW","XPO","GXO","SAIA","ARCB","WERN","BMI","CFX","GTLS","MWA","ESCO","DCI"],
  XLB:  ["LIN","APD","SHW","ECL","FCX","NEM","DOW","DD","LYB","PPG","NUE","STLD","VMC","MLM","CF","IP","PKG","ALB","EMN","IFF","AVY","BALL","AMCR","ATI","AA","OLN","HUN","TROX","FUL","RPM","AXTA","CBT","ASIX","BCPC","HWKN","CTVA","FMC","MOS","ADM","BG"],
  XLU:  ["NEE","DUK","SO","D","AEP","EXC","SRE","PEG","XEL","ED","EIX","AEE","LNT","WEC","ES","CMS","DTE","NI","CNP","EVRG","PNW","ATO","AWK","WTR","SJW","OGE","IDA","HE","AVA","MGEE","BKH","ARTNA","CWCO"],
  XLRE: ["PLD","AMT","CCI","EQIX","SBAC","DLR","PSA","EXR","AVB","EQR","WELL","SPG","IRM","ESS","MAA","CPT","UDR","VTR","ARE","HST","REG","O","NNN","VICI","BXP","SLG","KIM","FRT","INVH","TRNO","EGP","FR","REXR","STAG","COLD","IIPR","ADC","NTST","EPRT","NHI","HR","DOC","MPW","PEB","RHP","XHR","APLE","CLDT","MAC","SKT"],
  XLC:  ["META","GOOGL","GOOG","NFLX","CMCSA","DIS","T","VZ","CHTR","TMUS","EA","TTWO","WBD","FOX","FOXA","PARA","LYV","IPG","OMC","LU","MSG","MSGS","DISH","LUMN","FYBR","CABO","CNK","IMAX","AMC"]
};

const VOL_AVG_PERIODS = 11;

const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(u)}`,
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
];

async function fetchOHLC(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=10y&events=history`;
  for (const fn of PROXIES) {
    try {
      const r = await fetch(fn(url), { signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 8000); return c.signal; })() });
      if (!r.ok) continue;
      const text = await r.text();
      let j; try { j = JSON.parse(text); } catch { continue; }
      const res = j?.chart?.result?.[0];
      if (!res) continue;
      const q = res.indicators?.quote?.[0];
      if (!q) continue;
      const adj = res.indicators?.adjclose?.[0]?.adjclose || q.close;
      const ratio = adj.map((a,i) => (q.close[i] && a) ? a/q.close[i] : 1);
      return {
        timestamps: res.timestamp,
        opens: q.open.map((v,i) => v*ratio[i]),
        highs: q.high.map((v,i) => v*ratio[i]),
        lows:  q.low.map((v,i)  => v*ratio[i]),
        closes: adj, vols: q.volume
      };
    } catch (e) {}
  }
  throw new Error('Sin datos');
}

// ── Obtener componentes de un ETF via backend oficial ────────────────
// Usa el endpoint /api/macro-rlab/etf-holdings?ticker=XBI integrado en el
// dispatcher de macro-rlab para respetar el límite de 12 funciones Vercel Hobby.
// Fallback transparente: si el backend falla, se mantiene el caché local.
async function fetchETFHoldings(ticker) {
  const BASE = import.meta.env?.VITE_API_BASE || '';
  const url  = `${BASE}/api/macro-rlab/etf-holdings?ticker=${encodeURIComponent(ticker.toUpperCase())}`;

  try {
    const ctrl = new AbortController();
    const to   = setTimeout(() => ctrl.abort(), 20000);
    const r    = await fetch(url, { signal: ctrl.signal });
    clearTimeout(to);

    if (!r.ok) {
      const errBody = await r.json().catch(() => ({}));
      console.warn(`[holdings] ${ticker}: HTTP ${r.status} — ${errBody.error || 'sin detalle'}`);
      return null;
    }

    const data = await r.json();
    if (!data.ok || !data.holdings?.length) {
      console.warn(`[holdings] ${ticker}: respuesta sin holdings — ${data.error || ''}`);
      return null;
    }

    // Filtrar posiciones sin ticker Yahoo válido (internacionales sin normalización)
    const validHoldings = data.holdings.filter(h => h.ticker && h.ticker !== 'null');

    return {
      holdings:      validHoldings,
      source:        data.source,
      sourceUrl:     data.sourceUrl,
      referenceDate: data.referenceDate,
      fetchedAt:     data.fetchedAt || Date.now(),
      totalHoldings: data.totalHoldings,
      cashRows:      data.cashRows,
      totalWeight:   data.totalWeight,
      integrityOk:   data.integrityOk,
      integrityNote: data.integrityNote,
      fromCache:     data.fromCache,
      stale:         data.stale,
      staleWarning:  data.staleWarning,
    };
  } catch (err) {
    console.warn(`[holdings] ${ticker}: error en fetch — ${err.message}`);
    return null;
  }
}

function ema(arr, p) {
  const k = 2/(p+1), out = new Array(arr.length).fill(null);
  let s = arr.findIndex(v => v != null && !isNaN(v));
  if (s < 0) return out; out[s] = arr[s];
  for (let i = s+1; i < arr.length; i++) {
    const v = (arr[i] != null && !isNaN(arr[i])) ? arr[i] : out[i-1];
    out[i] = v*k + out[i-1]*(1-k);
  }
  return out;
}
function macd(closes) {
  const ef = ema(closes,12), es = ema(closes,26);
  const m = ef.map((v,i) => (v!=null&&es[i]!=null)?v-es[i]:null);
  return { m, sl: ema(m.map(v=>v??0),9) };
}
function rsi(closes, p=14) {
  const out = new Array(closes.length).fill(null);
  if (closes.length < p+1) return out;
  let g=0, l=0;
  for (let i=1; i<=p; i++) { const d=closes[i]-closes[i-1]; d>0?g+=d:l-=d; }
  let ag=g/p, al=l/p;
  out[p] = al===0?100:100-(100/(1+ag/al));
  for (let i=p+1; i<closes.length; i++) {
    const d=closes[i]-closes[i-1];
    ag=(ag*(p-1)+(d>0?d:0))/p; al=(al*(p-1)+(d<0?-d:0))/p;
    out[i]=al===0?100:100-(100/(1+ag/al));
  }
  return out;
}
function stoch(highs, lows, closes, p) {
  const rawK = closes.map((c,i) => {
    if (i<p-1) return null;
    const hh=Math.max(...highs.slice(i-p+1,i+1));
    const ll=Math.min(...lows.slice(i-p+1,i+1));
    return hh===ll?50:(c-ll)/(hh-ll)*100;
  });
  const k = ema(rawK,3);
  return { k, d: ema(k.map(v=>v??0),3) };
}
function resample(ts, opens, highs, lows, closes, vols, freq) {
  const groups = {};
  ts.forEach((t,i) => {
    const dd = new Date(t*1000);
    let key;
    if (freq==='W') {
      const day=dd.getDay(), diff=dd.getDate()-day+(day===0?-6:1);
      const mo=new Date(+dd); mo.setDate(diff);
      key=mo.toISOString().slice(0,10);
    } else {
      key=`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}`;
    }
    if (!groups[key]) groups[key]={o:opens[i],h:highs[i],l:lows[i],c:closes[i],v:vols[i]};
    else { groups[key].h=Math.max(groups[key].h,highs[i]); groups[key].l=Math.min(groups[key].l,lows[i]); groups[key].c=closes[i]; groups[key].v+=vols[i]; }
  });
  const keys=Object.keys(groups).sort();
  return { dates:keys, opens:keys.map(k=>groups[k].o), highs:keys.map(k=>groups[k].h), lows:keys.map(k=>groups[k].l), closes:keys.map(k=>groups[k].c), vols:keys.map(k=>groups[k].v) };
}

function analyzeAsset(raw) {
  const {timestamps,opens,highs,lows,closes,vols}=raw;
  const n=closes.length;
  const lastVol=vols[n-1]||0;
  const avgVol11=vols.slice(-VOL_AVG_PERIODS).reduce((a,b)=>a+(b||0),0)/VOL_AVG_PERIODS;

  const W=resample(timestamps,opens,highs,lows,closes,vols,'W');
  const M=resample(timestamps,opens,highs,lows,closes,vols,'M');
  const mi=M.closes.length-1, wi=W.closes.length-1, di=n-1;

  const m_macd=macd(M.closes), m_s89=stoch(M.highs,M.lows,M.closes,89);
  const m_s8=stoch(M.highs,M.lows,M.closes,8), m_rsi=rsi(M.closes,14);
  const m_ema10=ema(M.closes,10);
  const w_macd=macd(W.closes), w_s89=stoch(W.highs,W.lows,W.closes,89);
  const w_rsi=rsi(W.closes,14), w_ema20=ema(W.closes,20);
  const d_macd=macd(closes), d_rsi=rsi(closes,14);

  const mc_ok=[
    m_macd.m[mi]>0&&m_macd.m[mi]>m_macd.sl[mi],
    (m_s89.k[mi]>80&&m_s89.k[mi]>m_s89.d[mi])||m_s89.k[mi]>92,
    m_rsi[mi]>65, m_s8.k[mi]>78,
    m_ema10[mi]&&M.closes[mi]>m_ema10[mi]
  ];
  const sc_ok=[
    w_macd.m[wi]>0&&w_macd.m[wi]>w_macd.sl[wi],
    (w_s89.k[wi]>85&&w_s89.k[wi]>w_s89.d[wi])||w_s89.k[wi]>92,
    w_rsi[wi]>67, w_ema20[wi]&&W.closes[wi]>w_ema20[wi]
  ];

  const mensualOk=mc_ok.every(x=>x), semanalOk=sc_ok.every(x=>x);
  const dailyReady=d_macd.m[di]>d_macd.sl[di]&&d_macd.m[di-1]<=d_macd.sl[di-1]&&d_rsi[di]>57&&d_macd.m[di]>0;
  const score=mc_ok.filter(x=>x).length+sc_ok.filter(x=>x).length+(dailyReady?1:0);

  let estado='watching';
  if (mensualOk&&semanalOk&&dailyReady) estado='ready';
  else if (mensualOk&&semanalOk) estado='diario';
  else if (score>=7) estado='close';

  return { score, estado, price: closes[di], lastVol, avgVol11 };
}

export async function render(container, { actionsSlot, savedState }) {
  const sectorState = {};
  SECTORS_CONFIG.forEach(cfg => {
    const prev = savedState?.sectorState?.[cfg.key];
    sectorState[cfg.key] = prev
      ? { ...prev, scanning: false }
      : { results: [], scanning: false, done: 0, total: 0 };
  });

  let rotacionResults    = savedState?.rotacionResults    || [];
  let subsectorResults   = savedState?.subsectorResults   || {};  // { sectorKey: [{ticker,name,emoji,score,estado,price}] }
  let subsectorScanState = {}; // { sectorKey: { scanning, results } }
  let globalSubResults   = savedState?.globalSubResults   || [];
  let globalSubScanning  = false;

  // Estado de los componentes cacheados: { etfTicker: { holdings, fetchedAt } }
  let holdingsCache      = savedState?.holdingsCache      || {};
  // Estado del screener de componentes por ETF: { etfTicker: { results, scanning } }
  let compScreenerState  = {};

  SECTORS_CONFIG.forEach(cfg => {
    subsectorScanState[cfg.key] = { scanning: false, results: subsectorResults[cfg.key] || [] };
  });

  let activeTab      = savedState?.activeTab      || SECTORS_CONFIG[0]?.key || 'XLK';
  let activeView     = 'rotacion';
  // subsectorView: null | { sectorKey, subsectorTicker }
  let subsectorView  = null;

  actionsSlot.innerHTML = '';

  const ETFS_SECTORIALES = [
    { ticker: 'XLK',  name: 'Technology',       emoji: '💻' },
    { ticker: 'XLF',  name: 'Financials',        emoji: '🏦' },
    { ticker: 'XLV',  name: 'Health Care',       emoji: '🏥' },
    { ticker: 'XLE',  name: 'Energy',            emoji: '⚡' },
    { ticker: 'XLY',  name: 'Consumer Discret.', emoji: '🛍️' },
    { ticker: 'XLP',  name: 'Consumer Staples',  emoji: '🛒' },
    { ticker: 'XLI',  name: 'Industrials',       emoji: '🏭' },
    { ticker: 'XLB',  name: 'Materials',         emoji: '⚗️' },
    { ticker: 'XLU',  name: 'Utilities',         emoji: '💡' },
    { ticker: 'XLRE', name: 'Real Estate',       emoji: '🏢' },
    { ticker: 'XLC',  name: 'Communication',     emoji: '📡' },
  ];

  // ── Helpers ─────────────────────────────────────
  function saveState() {
    saveModuleState('alc-rv-sectores', {
      sectorState, rotacionResults, activeTab,
      subsectorResults: Object.fromEntries(
        Object.entries(subsectorScanState).map(([k,v]) => [k, v.results])
      ),
      globalSubResults, holdingsCache,
    });
  }

  const scoreColor  = s => s >= 9 ? 'var(--green)' : s >= 7 ? 'var(--amber)' : s >= 5 ? 'var(--blue)' : 'var(--text3)';
  const estadoLabel = { ready:'🟢 LISTO', diario:'⏳ ESPERA DIARIO', close:'🔶 CERCA', watching:'👁 VIGILANDO' };
  const estadoColor = e => e==='ready'?'var(--green)':e==='diario'?'var(--amber)':'var(--text3)';

  // ── HTML principal ───────────────────────────────
  container.innerHTML = `
    <div class="sc2-wrap">

      <!-- Selector de vista principal -->
      <div class="sct-view-tabs">
        <button class="sct-view-tab active" data-view="rotacion">📊 Rotación Sectorial</button>
        <button class="sct-view-tab" data-view="subsectores-global">🧩 Todos los Subsectores</button>
        <button class="sct-view-tab" data-view="componentes">🔍 Componentes por Sector</button>
      </div>

      <!-- VISTA 1: ROTACIÓN + SUBSECTORES POR SECTOR -->
      <div id="sct-panel-rotacion" class="sct-view-panel active">

        <!-- Panel de subsectores (oculto por defecto) -->
        <div id="sct-subsector-drill" style="display:none">
          <div class="sct-sub-header">
            <button class="sct-back-btn" id="sct-back-btn">← Volver a Sectores</button>
            <div id="sct-sub-title" class="sct-sub-title"></div>
          </div>
          <!-- Lista subsectores del sector seleccionado -->
          <div id="sct-sub-list"></div>
          <!-- Componentes del subsector seleccionado -->
          <div id="sct-comp-drill" style="display:none">
            <div class="sct-sub-header" style="margin-top:16px">
              <button class="sct-back-btn" id="sct-back-sub-btn">← Volver a Subsectores</button>
              <div id="sct-comp-title" class="sct-sub-title"></div>
            </div>
            <div id="sct-comp-content"></div>
          </div>
        </div>

        <!-- Panel de rotación (visible por defecto) -->
        <div id="sct-rot-main">
          <div class="sc2-toolbar">
            <div style="font-size:11px;color:var(--text3);">
              Analiza los 11 ETFs sectoriales SPDR y los rankea por fuerza técnica (score /10)
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
              <span class="sc2-status" id="rot-status"></span>
              <button class="sc2-btn-scan" id="rot-scan-btn">▶ Escanear Sectores</button>
            </div>
          </div>
          <div class="sc2-progress" id="rot-progress" style="display:none">
            <div class="sc2-progress-fill" id="rot-progress-fill"></div>
          </div>
          <div id="rot-results">
            <div class="sc2-empty">Pulsa Escanear para analizar los 11 ETFs sectoriales</div>
          </div>
        </div>

      </div>

      <!-- VISTA 2: TODOS LOS SUBSECTORES (ranking global) -->
      <div id="sct-panel-subsectores-global" class="sct-view-panel" style="display:none">
        <div class="sc2-toolbar">
          <div style="font-size:11px;color:var(--text3);">
            Ranking global de todos los ETFs especializados por fuerza técnica ETHAN
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="sc2-status" id="gsub-status"></span>
            <button class="sc2-btn-scan" id="gsub-scan-btn">▶ Escanear Todos</button>
          </div>
        </div>
        <div class="sc2-progress" id="gsub-progress" style="display:none">
          <div class="sc2-progress-fill" id="gsub-progress-fill"></div>
        </div>
        <div id="gsub-results">
          <div class="sc2-empty">Pulsa Escanear para analizar todos los ETFs especializados</div>
        </div>
      </div>

      <!-- VISTA 3: COMPONENTES POR SECTOR -->
      <div id="sct-panel-componentes" class="sct-view-panel" style="display:none">
        <div class="sc2-tabs" id="sc2s-tabs">
          ${SECTORS_CONFIG.map((cfg,i) => `
            <button class="sc2-tab ${i===0?'active':''}" data-sector="${cfg.key}">
              ${cfg.emoji} ${cfg.label}
              <span class="sc2-tab-badge" id="sbadge-${cfg.key}" style="display:none"></span>
            </button>
          `).join('')}
        </div>

        ${SECTORS_CONFIG.map((cfg,i) => `
          <div class="sc2-panel ${i===0?'active':''}" id="spanel-${cfg.key}">
            <div class="sc2-toolbar">
              <div class="sc2-filters">
                <div class="sc2-filter"><label>SCORE MÍN.</label>
                  <select id="sfs-${cfg.key}" class="sc2-sel">
                    <option value="9">≥ 9</option>
                    <option value="8">≥ 8</option>
                    <option value="7" selected>≥ 7</option>
                    <option value="6">≥ 6</option>
                    <option value="5">≥ 5</option>
                    <option value="0">Todos</option>
                  </select>
                </div>
                <div class="sc2-filter"><label>VOLUMEN</label>
                  <select id="sfv-${cfg.key}" class="sc2-sel">
                    <option value="0">Cualquiera</option>
                    <option value="500000">› 500k</option>
                    <option value="990000" selected>› 990k</option>
                    <option value="2000000">› 2M</option>
                    <option value="5000000">› 5M</option>
                  </select>
                </div>
                <div class="sc2-filter"><label>ESTADO</label>
                  <select id="sfe-${cfg.key}" class="sc2-sel">
                    <option value="all">Todos</option>
                    <option value="ready">🟢 Ready</option>
                    <option value="diario">🟡 Espera diario</option>
                    <option value="close">🔵 Cerca</option>
                  </select>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:12px;">
                <span class="sc2-status" id="sst-${cfg.key}"></span>
                <button class="sc2-btn-scan" id="sbtn-${cfg.key}" data-sector="${cfg.key}">▶ Escanear</button>
              </div>
            </div>
            <div class="sc2-progress" id="sprog-${cfg.key}" style="display:none">
              <div class="sc2-progress-fill" id="sprogfill-${cfg.key}"></div>
            </div>
            <div id="sres-${cfg.key}">
              <div class="sc2-empty">Pulsa Escanear para analizar ${(SECTOR_TICKERS[cfg.key]||[]).length} valores del sector ${cfg.label}</div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  // ── addToWatchlist ──────────────────────────────
  async function addToWatchlistLocal(ticker) {
    try {
      const list = (await UserData.get('ethan_watchlist_v1')) || [];
      if (!list.includes(ticker)) {
        list.push(ticker);
        await UserData.set('ethan_watchlist_v1', list);
      }
      const btn = document.querySelector(`[data-wl="${ticker}"]`);
      if (btn) { btn.textContent = '✓'; btn.style.color = 'var(--green)'; btn.disabled = true; }
    } catch (e) {}
  }

  // ── Vista Componentes: renderTable ──────────────
  function renderTable(sectorKey) {
    const state = sectorState[sectorKey];
    const minScore    = parseInt(container.querySelector(`#sfs-${sectorKey}`)?.value || '7');
    const minVol      = parseInt(container.querySelector(`#sfv-${sectorKey}`)?.value || '0');
    const filterEstado = container.querySelector(`#sfe-${sectorKey}`)?.value || 'all';

    const filtered = state.results.filter(r => {
      if (r.score < minScore) return false;
      if (minVol > 0 && r.avgVol11 < minVol) return false;
      if (filterEstado !== 'all' && r.estado !== filterEstado) return false;
      return true;
    }).sort((a,b) => b.score - a.score);

    const el = container.querySelector(`#sres-${sectorKey}`);
    if (!el) return;

    const badge = container.querySelector(`#sbadge-${sectorKey}`);
    const readyCount = state.results.filter(r => r.estado === 'ready').length;
    if (badge) {
      if (state.results.length > 0) {
        badge.style.display = 'inline';
        badge.textContent = readyCount > 0 ? readyCount : state.results.length;
        badge.style.background = readyCount > 0 ? 'var(--green)' : 'var(--text3)';
      } else { badge.style.display = 'none'; }
    }

    if (filtered.length === 0) {
      el.innerHTML = `<div class="sc2-empty">${state.results.length > 0 ? 'Ningún valor cumple los filtros' : 'Sin datos — pulsa Escanear'}</div>`;
      return;
    }

    el.innerHTML = `
      <table class="sc2-table">
        <thead>
          <tr><th>TICKER</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              <td class="sc2-ticker">${r.ticker}</td>
              <td class="sc2-score" style="color:${scoreColor(r.score)}">${r.score}/10</td>
              <td style="color:${r.estado==='ready'?'var(--green)':r.estado==='diario'?'var(--amber)':'var(--text3)'}">${estadoLabel[r.estado]||'—'}</td>
              <td class="sc2-price">${r.price ? r.price.toFixed(2) : '—'}</td>
              <td class="sc2-vol">${r.avgVol11 >= 1e6 ? (r.avgVol11/1e6).toFixed(1)+'M' : Math.round(r.avgVol11/1e3)+'k'}</td>
              <td><button class="sc2-wl-btn" data-wl="${r.ticker}">+ WL</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    el.querySelectorAll('.sc2-wl-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); addToWatchlistLocal(btn.dataset.wl); });
    });
  }

  async function startScan(sectorKey) {
    const state = sectorState[sectorKey];
    if (state.scanning) return;
    state.scanning = true;
    state.results = [];
    const tickers = SECTOR_TICKERS[sectorKey] || [];
    state.total = tickers.length;

    const btn  = container.querySelector(`#sbtn-${sectorKey}`);
    const st   = container.querySelector(`#sst-${sectorKey}`);
    const prog = container.querySelector(`#sprog-${sectorKey}`);
    const fill = container.querySelector(`#sprogfill-${sectorKey}`);

    if (btn)  { btn.disabled = true; btn.textContent = '⏳ Escaneando...'; }
    if (prog) prog.style.display = 'block';
    if (fill) fill.style.width = '0%';

    const BATCH = 8;
    let done = 0;
    for (let i = 0; i < tickers.length; i += BATCH) {
      const batch = tickers.slice(i, i + BATCH);
      const batchRes = await Promise.all(batch.map(async ticker => {
        try {
          const raw = await fetchOHLC(ticker);
          const result = analyzeAsset(raw);
          result.ticker = ticker;
          return result;
        } catch { return null; }
      }));

      batchRes.forEach(r => { if (r) state.results.push(r); });
      done += batch.length;

      const pct = (done / state.total * 100).toFixed(1);
      if (fill) fill.style.width = pct + '%';
      if (st)   st.textContent = `${tickers[Math.min(i+BATCH-1, tickers.length-1)]} (${done}/${state.total})`;

      if (activeTab === sectorKey) renderTable(sectorKey);
      await new Promise(r => setTimeout(r, 250));
    }

    state.scanning = false;
    if (btn)  { btn.disabled = false; btn.textContent = '↻ Re-escanear'; }
    if (prog) prog.style.display = 'none';
    if (st)   st.textContent = `${state.results.length} valores · ${state.results.filter(r=>r.estado==='ready').length} listos`;
    renderTable(sectorKey);
    saveState();
  }

  // ── Rotación Sectorial ───────────────────────────
  function renderRotacion() {
    const el = container.querySelector('#rot-results');
    if (!el) return;
    if (rotacionResults.length === 0) {
      el.innerHTML = `<div class="sc2-empty">Pulsa Escanear para analizar los 11 ETFs sectoriales</div>`;
      return;
    }
    const sorted = [...rotacionResults].sort((a,b) => b.score - a.score);

    el.innerHTML = `
      <div class="sct-rotation-grid">
        ${sorted.map((r, i) => {
          const etf = ETFS_SECTORIALES.find(e => e.ticker === r.ticker) || {};
          const barPct = (r.score / 10 * 100).toFixed(0);
          const rankColor = i === 0 ? 'var(--green)' : i <= 2 ? 'var(--amber)' : 'var(--text3)';
          const hasSubsectors = (SUBSECTORS_CONFIG[r.ticker] || []).length > 0;
          return `
            <div class="sct-rot-card ${r.estado === 'ready' ? 'rot-ready' : ''}">
              <div class="sct-rot-rank" style="color:${rankColor}">#${i+1}</div>
              <div class="sct-rot-main">
                <div class="sct-rot-header">
                  <span class="sct-rot-emoji">${etf.emoji || ''}</span>
                  <div>
                    <div class="sct-rot-ticker">${r.ticker}</div>
                    <div class="sct-rot-name">${etf.name || ''}</div>
                  </div>
                  <div class="sct-rot-score" style="color:${scoreColor(r.score)}">${r.score}<span style="font-size:11px;font-style:normal;color:var(--text3);font-family:var(--mono)">/10</span></div>
                </div>
                <div class="sct-rot-bar-wrap">
                  <div class="sct-rot-bar-fill" style="width:${barPct}%;background:${scoreColor(r.score)}"></div>
                </div>
                <div class="sct-rot-footer">
                  <span style="color:${estadoColor(r.estado)};font-size:10px;font-weight:600">${estadoLabel[r.estado]||'—'}</span>
                  <span class="sct-rot-price">${r.price ? '$'+r.price.toFixed(2) : '—'}</span>
                  ${hasSubsectors ? `<button class="sct-ver-sub-btn" data-sector="${r.ticker}">🧩 Ver Subsectores</button>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Listeners "Ver Subsectores"
    el.querySelectorAll('.sct-ver-sub-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openSubsectorDrill(btn.dataset.sector);
      });
    });
  }

  async function startRotacionScan() {
    if (rotacionResults.length > 0 && container.querySelector('#rot-scan-btn')?.textContent.includes('Re')) {
      // permitir re-escanear
    }
    const btn  = container.querySelector('#rot-scan-btn');
    const st   = container.querySelector('#rot-status');
    const prog = container.querySelector('#rot-progress');
    const fill = container.querySelector('#rot-progress-fill');

    if (btn?.disabled) return;
    rotacionResults = [];
    if (btn)  { btn.disabled = true; btn.textContent = '⏳ Escaneando...'; }
    if (prog) prog.style.display = 'block';
    if (fill) fill.style.width = '0%';

    const results = await Promise.all(ETFS_SECTORIALES.map(async (etf, i) => {
      try {
        const raw = await fetchOHLC(etf.ticker);
        const result = analyzeAsset(raw);
        result.ticker = etf.ticker;
        if (fill) fill.style.width = `${((i+1)/ETFS_SECTORIALES.length*100).toFixed(0)}%`;
        if (st)   st.textContent = `${etf.ticker} (${i+1}/${ETFS_SECTORIALES.length})`;
        return result;
      } catch { return null; }
    }));

    rotacionResults = results.filter(Boolean);
    if (btn)  { btn.disabled = false; btn.textContent = '↻ Re-escanear'; }
    if (prog) prog.style.display = 'none';
    if (st)   st.textContent = `${rotacionResults.length} sectores analizados`;
    renderRotacion();
    saveState();
  }

  // ── Subsector Drill: sector → lista ETFs especializados ──
  function openSubsectorDrill(sectorKey) {
    const rotMain = container.querySelector('#sct-rot-main');
    const drillEl = container.querySelector('#sct-subsector-drill');
    const compEl  = container.querySelector('#sct-comp-drill');
    if (!rotMain || !drillEl) return;

    subsectorView = { sectorKey, subsectorTicker: null };

    rotMain.style.display = 'none';
    drillEl.style.display  = 'block';
    if (compEl) compEl.style.display = 'none';

    const sectorCfg = ETFS_SECTORIALES.find(e => e.ticker === sectorKey) || {};
    const titleEl = container.querySelector('#sct-sub-title');
    if (titleEl) titleEl.textContent = `${sectorCfg.emoji || ''} ${sectorCfg.name || sectorKey} — Subsectores`;

    renderSubsectorList(sectorKey);
  }

  function renderSubsectorList(sectorKey) {
    const listEl = container.querySelector('#sct-sub-list');
    if (!listEl) return;

    const subs    = SUBSECTORS_CONFIG[sectorKey] || [];
    const state   = subsectorScanState[sectorKey];
    const results = state?.results || [];
    const scanning = state?.scanning || false;

    // Construir mapa ticker→resultado
    const resultMap = {};
    results.forEach(r => { resultMap[r.ticker] = r; });

    const hasResults = results.length > 0;

    listEl.innerHTML = `
      <div class="sc2-toolbar" style="margin-bottom:12px">
        <div style="font-size:11px;color:var(--text3)">
          ${subs.length} ETFs especializados en este sector · Mismo motor ETHAN /10
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="sc2-status" id="sub-scan-status-${sectorKey}">${hasResults ? results.length+' ETFs analizados' : ''}</span>
          <button class="sc2-btn-scan" id="sub-scan-btn-${sectorKey}" data-sector="${sectorKey}">
            ${scanning ? '⏳ Escaneando...' : hasResults ? '↻ Re-escanear' : '▶ Escanear Subsectores'}
          </button>
        </div>
      </div>
      <div class="sc2-progress" id="sub-prog-${sectorKey}" style="display:none">
        <div class="sc2-progress-fill" id="sub-progfill-${sectorKey}"></div>
      </div>
      <div class="sct-rotation-grid" id="sub-grid-${sectorKey}">
        ${subs.map(sub => {
          const r = resultMap[sub.ticker];
          return `
            <div class="sct-rot-card sct-sub-card ${r?.estado === 'ready' ? 'rot-ready' : ''}" data-sub="${sub.ticker}" data-sector="${sectorKey}">
              <div class="sct-rot-main">
                <div class="sct-rot-header">
                  <span class="sct-rot-emoji">${sub.emoji}</span>
                  <div>
                    <div class="sct-rot-ticker">${sub.ticker}</div>
                    <div class="sct-rot-name">${sub.name}</div>
                  </div>
                  ${r ? `<div class="sct-rot-score" style="color:${scoreColor(r.score)}">${r.score}<span style="font-size:11px;font-style:normal;color:var(--text3);font-family:var(--mono)">/10</span></div>` : '<div class="sct-rot-score" style="color:var(--text3)">—</div>'}
                </div>
                ${r ? `
                <div class="sct-rot-bar-wrap">
                  <div class="sct-rot-bar-fill" style="width:${(r.score/10*100).toFixed(0)}%;background:${scoreColor(r.score)}"></div>
                </div>
                <div class="sct-rot-footer">
                  <span style="color:${estadoColor(r.estado)};font-size:10px;font-weight:600">${estadoLabel[r.estado]||'—'}</span>
                  <span class="sct-rot-price">${r.price ? '$'+r.price.toFixed(2) : '—'}</span>
                  <button class="sct-ver-comp-btn" data-sub="${sub.ticker}" data-name="${sub.name}" data-emoji="${sub.emoji}">🔍 Ver Empresas</button>
                </div>` : `
                <div class="sct-rot-footer" style="justify-content:flex-end">
                  <span style="color:var(--text3);font-size:10px">Sin datos</span>
                </div>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector(`#sub-scan-btn-${sectorKey}`)?.addEventListener('click', () => {
      startSubsectorScan(sectorKey);
    });

    listEl.querySelectorAll('.sct-ver-comp-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openComponentsDrill(btn.dataset.sub, btn.dataset.name, btn.dataset.emoji);
      });
    });
  }

  async function startSubsectorScan(sectorKey) {
    const state = subsectorScanState[sectorKey];
    if (state.scanning) return;
    state.scanning = true;
    state.results  = [];

    const subs = SUBSECTORS_CONFIG[sectorKey] || [];
    const btn  = container.querySelector(`#sub-scan-btn-${sectorKey}`);
    const st   = container.querySelector(`#sub-scan-status-${sectorKey}`);
    const prog = container.querySelector(`#sub-prog-${sectorKey}`);
    const fill = container.querySelector(`#sub-progfill-${sectorKey}`);

    if (btn)  { btn.disabled = true; btn.textContent = '⏳ Escaneando...'; }
    if (prog) prog.style.display = 'block';
    if (fill) fill.style.width = '0%';

    // ETFs especializados son pocos (3-8), procesar en paralelo
    const results = await Promise.all(subs.map(async (sub, i) => {
      try {
        const raw = await fetchOHLC(sub.ticker);
        const result = analyzeAsset(raw);
        result.ticker = sub.ticker;
        result.name   = sub.name;
        result.emoji  = sub.emoji;
        if (fill) fill.style.width = `${((i+1)/subs.length*100).toFixed(0)}%`;
        if (st)   st.textContent   = `${sub.ticker} (${i+1}/${subs.length})`;
        return result;
      } catch { return null; }
    }));

    state.results  = results.filter(Boolean).sort((a,b) => b.score - a.score);
    state.scanning = false;
    if (btn)  { btn.disabled = false; btn.textContent = '↻ Re-escanear'; }
    if (prog) prog.style.display = 'none';
    if (st)   st.textContent = `${state.results.length} ETFs analizados`;

    // Actualizar subsectorResults para persistencia
    subsectorResults[sectorKey] = state.results;
    saveState();

    // Re-renderizar la lista con resultados
    renderSubsectorList(sectorKey);
  }

  // ── Componentes de un ETF especializado ─────────
  function openComponentsDrill(etfTicker, etfName, etfEmoji) {
    const compEl    = container.querySelector('#sct-comp-drill');
    const subListEl = container.querySelector('#sct-sub-list');
    if (!compEl) return;

    subsectorView = { ...subsectorView, subsectorTicker: etfTicker };

    // Ocultar lista de subsectores, mostrar drill de componentes
    if (subListEl) subListEl.style.opacity = '0.4';
    compEl.style.display = 'block';

    const titleEl = container.querySelector('#sct-comp-title');
    if (titleEl) titleEl.textContent = `${etfEmoji} ${etfTicker} — ${etfName}`;

    renderComponentsDrill(etfTicker);
  }

  async function renderComponentsDrill(etfTicker) {
    const contentEl = container.querySelector('#sct-comp-content');
    if (!contentEl) return;

    // ¿Hay holdings cacheados?
    const cached = holdingsCache[etfTicker];
    const NOW    = Date.now();
    const STALE_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 días
    const isStale = cached && (NOW - cached.fetchedAt) > STALE_THRESHOLD;

    contentEl.innerHTML = `<div class="sc2-empty">⏳ Cargando componentes de ${etfTicker}...</div>`;

    let holdings    = null;
    let holdingsMeta = null;

    if (cached && cached.holdings) {
      // Caché local disponible (puede estar stale)
      holdings     = cached.holdings;
      holdingsMeta = cached;
    }

    if (!holdings || isStale) {
      // Descargar desde backend
      const result = await fetchETFHoldings(etfTicker);
      if (result && result.holdings?.length) {
        holdings     = result.holdings;
        holdingsMeta = result;
        // Guardar en caché local (Firestore ya guarda en backend)
        holdingsCache[etfTicker] = {
          holdings,
          fetchedAt:     result.fetchedAt || NOW,
          source:        result.source,
          sourceUrl:     result.sourceUrl,
          referenceDate: result.referenceDate,
          totalHoldings: result.totalHoldings,
          cashRows:      result.cashRows,
          totalWeight:   result.totalWeight,
          integrityOk:   result.integrityOk,
          integrityNote: result.integrityNote,
          stale:         result.stale,
          staleWarning:  result.staleWarning,
        };
        saveState();
      }
    }

    if (!holdings || holdings.length === 0) {
      contentEl.innerHTML = `
        <div class="sc2-empty" style="flex-direction:column;gap:8px">
          <span>No se pudieron obtener componentes de ${etfTicker}</span>
          <span style="font-size:11px;color:var(--text3)">Este ETF puede no estar aún soportado. Gestoras: SPDR, First Trust, VanEck.</span>
        </div>`;
      return;
    }

    const meta         = holdingsMeta || cached || {};
    const refDate      = meta.referenceDate || (meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'));
    const sourceLabel  = meta.source ? `${meta.source}` : 'Fuente desconocida';
    const posCount     = meta.totalHoldings || holdings.length;
    const cashInfo     = meta.cashRows > 0 ? ` · ${meta.cashRows} no-accionarias excluidas` : '';
    const weightInfo   = meta.totalWeight ? ` · peso ${meta.totalWeight.toFixed(1)}%` : '';
    const integrityBadge = meta.integrityOk === false
      ? `<span style="color:var(--amber);font-size:10px">⚠️ Integridad: ${meta.integrityNote || 'verificar'}</span>`
      : (meta.integrityOk === true ? `<span style="color:var(--green);font-size:10px">✓ ${posCount} posiciones${weightInfo}</span>` : '');
    const staleWarning = (isStale || meta.stale)
      ? `<span style="color:var(--amber);font-size:10px">⚠️ ${meta.staleWarning || 'Datos de más de 7 días — actualizar recomendado'}</span>`
      : '';

    // Estado del screener de componentes
    if (!compScreenerState[etfTicker]) {
      compScreenerState[etfTicker] = { results: [], scanning: false };
    }
    const compState = compScreenerState[etfTicker];

    contentEl.innerHTML = `
      <div class="sc2-toolbar" style="margin-bottom:12px">
        <div style="font-size:11px;color:var(--text3);display:flex;flex-direction:column;gap:4px">
          <span>📋 ${posCount} componentes${cashInfo} · <strong style="color:var(--text2)">${sourceLabel}</strong> · ${refDate}</span>
          ${integrityBadge}
          ${staleWarning}
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="sc2-status" id="comp-scan-st-${etfTicker}">${compState.results.length > 0 ? compState.results.length+' analizados' : ''}</span>
          <button class="sc2-btn-scan" id="comp-scan-btn-${etfTicker}">
            ${compState.scanning ? '⏳ Escaneando...' : compState.results.length > 0 ? '↻ Re-escanear' : '▶ Screener ETHAN'}
          </button>
          <button class="sct-back-btn" id="comp-refresh-btn-${etfTicker}" style="font-size:10px">↻ Actualizar componentes</button>
        </div>
      </div>
      <div class="sc2-progress" id="comp-prog-${etfTicker}" style="display:none">
        <div class="sc2-progress-fill" id="comp-progfill-${etfTicker}"></div>
      </div>
      <!-- Lista de componentes (holdings) -->
      <div style="margin-bottom:16px">
        <table class="sc2-table">
          <thead>
            <tr><th>#</th><th>TICKER</th><th>NOMBRE</th><th>PESO %</th><th>ETHAN</th></tr>
          </thead>
          <tbody id="comp-holdings-body-${etfTicker}">
            ${holdings.map((h, idx) => {
              const r = compState.results.find(x => x.ticker === h.ticker);
              return `
                <tr>
                  <td style="color:var(--text3);font-size:10px">${idx+1}</td>
                  <td class="sc2-ticker">${h.ticker}</td>
                  <td style="font-size:11px;color:var(--text2)">${h.name || '—'}</td>
                  <td style="font-size:11px;color:var(--text3)">${h.weight ? h.weight+'%' : '—'}</td>
                  <td id="comp-ethan-${etfTicker}-${h.ticker}">
                    ${r ? `<span style="color:${scoreColor(r.score)};font-weight:700">${r.score}/10</span> <span style="color:${estadoColor(r.estado)};font-size:10px">${estadoLabel[r.estado]||''}</span>` : '<span style="color:var(--text3);font-size:10px">—</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      <!-- Tabla screener ETHAN si ya hay resultados -->
      <div id="comp-screener-results-${etfTicker}"></div>
    `;

    // Renderizar screener si ya hay datos
    if (compState.results.length > 0) renderCompScreener(etfTicker, holdings);

    container.querySelector(`#comp-scan-btn-${etfTicker}`)?.addEventListener('click', () => {
      startCompScreener(etfTicker, holdings);
    });

    container.querySelector(`#comp-refresh-btn-${etfTicker}`)?.addEventListener('click', async () => {
      // Forzar re-descarga desde fuente oficial (pasar refresh=1 al backend)
      const BASE = import.meta.env?.VITE_API_BASE || '';
      const url  = `${BASE}/api/macro-rlab/etf-holdings?ticker=${encodeURIComponent(etfTicker.toUpperCase())}&refresh=1`;
      contentEl.innerHTML = `<div class="sc2-empty">⏳ Actualizando componentes de ${etfTicker} desde fuente oficial...</div>`;
      try {
        const r = await fetch(url, { signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 25000); return c.signal; })() });
        const data = r.ok ? await r.json() : null;
        if (data?.ok && data.holdings?.length) {
          holdingsCache[etfTicker] = {
            holdings:      data.holdings.filter(h => h.ticker && h.ticker !== 'null'),
            fetchedAt:     data.fetchedAt || Date.now(),
            source:        data.source,
            sourceUrl:     data.sourceUrl,
            referenceDate: data.referenceDate,
            totalHoldings: data.totalHoldings,
            cashRows:      data.cashRows,
            totalWeight:   data.totalWeight,
            integrityOk:   data.integrityOk,
            integrityNote: data.integrityNote,
            stale:         false,
          };
          saveState();
        } else {
          // Fallo: mantener caché actual y mostrar warning
          console.warn(`[holdings] refresh ${etfTicker} falló: ${data?.error || 'sin respuesta'}`);
        }
      } catch (e) {
        console.warn(`[holdings] refresh ${etfTicker} error: ${e.message}`);
      }
      await renderComponentsDrill(etfTicker);
    });
  }

  async function startCompScreener(etfTicker, holdings) {
    const state = compScreenerState[etfTicker];
    if (state.scanning) return;
    state.scanning = true;
    state.results  = [];

    const tickers = holdings.map(h => h.ticker).filter(Boolean);
    const btn  = container.querySelector(`#comp-scan-btn-${etfTicker}`);
    const st   = container.querySelector(`#comp-scan-st-${etfTicker}`);
    const prog = container.querySelector(`#comp-prog-${etfTicker}`);
    const fill = container.querySelector(`#comp-progfill-${etfTicker}`);

    if (btn)  { btn.disabled = true; btn.textContent = '⏳ Escaneando...'; }
    if (prog) prog.style.display = 'block';
    if (fill) fill.style.width = '0%';

    const BATCH = 8;
    let done = 0;
    for (let i = 0; i < tickers.length; i += BATCH) {
      const batch = tickers.slice(i, i+BATCH);
      const batchRes = await Promise.all(batch.map(async ticker => {
        try {
          const raw = await fetchOHLC(ticker);
          const result = analyzeAsset(raw);
          result.ticker = ticker;
          return result;
        } catch { return null; }
      }));

      batchRes.forEach(r => { if (r) state.results.push(r); });
      done += batch.length;

      const pct = (done/tickers.length*100).toFixed(1);
      if (fill) fill.style.width = pct + '%';
      if (st)   st.textContent = `${batch[batch.length-1]} (${done}/${tickers.length})`;

      // Actualizar celdas ETHAN en la tabla de holdings
      batchRes.forEach(r => {
        if (!r) return;
        const cell = container.querySelector(`#comp-ethan-${etfTicker}-${r.ticker}`);
        if (cell) {
          cell.innerHTML = `<span style="color:${scoreColor(r.score)};font-weight:700">${r.score}/10</span> <span style="color:${estadoColor(r.estado)};font-size:10px">${estadoLabel[r.estado]||''}</span>`;
        }
      });

      await new Promise(r => setTimeout(r, 250));
    }

    state.scanning = false;
    if (btn)  { btn.disabled = false; btn.textContent = '↻ Re-escanear'; }
    if (prog) prog.style.display = 'none';
    if (st)   st.textContent = `${state.results.length} valores analizados · ${state.results.filter(r=>r.estado==='ready').length} listos`;

    renderCompScreener(etfTicker, holdings);
  }

  function renderCompScreener(etfTicker, holdings) {
    const el = container.querySelector(`#comp-screener-results-${etfTicker}`);
    if (!el) return;
    const state = compScreenerState[etfTicker];
    if (!state || state.results.length === 0) return;

    const sorted = [...state.results]
      .filter(r => r.score >= 5)
      .sort((a,b) => b.score - a.score);

    if (sorted.length === 0) {
      el.innerHTML = `<div class="sc2-empty" style="margin-top:16px">Ningún valor con score ≥ 5</div>`;
      return;
    }

    el.innerHTML = `
      <div style="font-size:11px;font-weight:600;color:var(--text2);margin:16px 0 8px;text-transform:uppercase;letter-spacing:.06em">
        Ranking ETHAN — Score ≥ 5
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>TICKER</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th><th>VOL MEDIA 11s</th><th></th></tr>
        </thead>
        <tbody>
          ${sorted.map(r => `
            <tr>
              <td class="sc2-ticker">${r.ticker}</td>
              <td class="sc2-score" style="color:${scoreColor(r.score)}">${r.score}/10</td>
              <td style="color:${estadoColor(r.estado)}">${estadoLabel[r.estado]||'—'}</td>
              <td class="sc2-price">${r.price ? r.price.toFixed(2) : '—'}</td>
              <td class="sc2-vol">${r.avgVol11 >= 1e6 ? (r.avgVol11/1e6).toFixed(1)+'M' : Math.round(r.avgVol11/1e3)+'k'}</td>
              <td><button class="sc2-wl-btn" data-wl="${r.ticker}">+ WL</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    el.querySelectorAll('.sc2-wl-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); addToWatchlistLocal(btn.dataset.wl); });
    });
  }

  // ── Vista Global Subsectores (FASE 3) ───────────
  function renderGlobalSubsectores() {
    const el = container.querySelector('#gsub-results');
    if (!el) return;
    if (globalSubResults.length === 0) {
      el.innerHTML = `<div class="sc2-empty">Pulsa Escanear para analizar todos los ETFs especializados</div>`;
      return;
    }

    const sorted = [...globalSubResults].sort((a,b) => b.score - a.score);

    el.innerHTML = `
      <div style="font-size:11px;color:var(--text3);margin-bottom:12px">
        ${sorted.length} ETFs especializados de ${Object.values(SUBSECTORS_CONFIG).flat().length} totales
        <span style="font-size:10px;margin-left:8px">(ETFs duplicados entre sectores contados una sola vez)</span>
      </div>
      <table class="sc2-table">
        <thead>
          <tr><th>#</th><th>TICKER</th><th>SUBSECTOR</th><th>SECTOR(ES)</th><th>SCORE</th><th>ESTADO</th><th>PRECIO</th></tr>
        </thead>
        <tbody>
          ${sorted.map((r, i) => `
            <tr>
              <td style="color:${i<3?'var(--amber)':'var(--text3)'};font-weight:${i<3?'700':'400'}">${i+1}</td>
              <td class="sc2-ticker">${r.ticker}</td>
              <td style="font-size:11px">${r.emoji || ''} ${r.name || r.ticker}</td>
              <td style="font-size:10px;color:var(--text3)">${r.sectors || ''}</td>
              <td class="sc2-score" style="color:${scoreColor(r.score)}">${r.score}/10</td>
              <td style="color:${estadoColor(r.estado)};font-size:10px;font-weight:600">${estadoLabel[r.estado]||'—'}</td>
              <td class="sc2-price">${r.price ? '$'+r.price.toFixed(2) : '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async function startGlobalSubScan() {
    if (globalSubScanning) return;
    globalSubScanning = true;

    const btn  = container.querySelector('#gsub-scan-btn');
    const st   = container.querySelector('#gsub-status');
    const prog = container.querySelector('#gsub-progress');
    const fill = container.querySelector('#gsub-progress-fill');

    if (btn)  { btn.disabled = true; btn.textContent = '⏳ Escaneando...'; }
    if (prog) prog.style.display = 'block';
    if (fill) fill.style.width = '0%';

    // Construir universo único de ETFs especializados (deduplicar)
    // Mapear ticker → { name, emoji, sectors[] }
    const universe = {};
    Object.entries(SUBSECTORS_CONFIG).forEach(([sectorKey, subs]) => {
      const sectorCfg = ETFS_SECTORIALES.find(e => e.ticker === sectorKey);
      subs.forEach(sub => {
        if (!universe[sub.ticker]) {
          universe[sub.ticker] = { ticker: sub.ticker, name: sub.name, emoji: sub.emoji, sectors: [] };
        }
        universe[sub.ticker].sectors.push(sectorCfg?.emoji || sectorKey);
      });
    });

    const uniq = Object.values(universe);
    const BATCH = 8;
    const results = [];
    let done = 0;

    for (let i = 0; i < uniq.length; i += BATCH) {
      const batch = uniq.slice(i, i+BATCH);
      const batchRes = await Promise.all(batch.map(async item => {
        try {
          const raw = await fetchOHLC(item.ticker);
          const result = analyzeAsset(raw);
          return { ...item, ...result, sectors: item.sectors.join(' ') };
        } catch { return null; }
      }));

      batchRes.forEach(r => { if (r) results.push(r); });
      done += batch.length;

      const pct = (done/uniq.length*100).toFixed(1);
      if (fill) fill.style.width = pct + '%';
      if (st)   st.textContent = `${batch[batch.length-1].ticker} (${done}/${uniq.length})`;

      await new Promise(r => setTimeout(r, 250));
    }

    globalSubResults = results;
    globalSubScanning = false;
    if (btn)  { btn.disabled = false; btn.textContent = '↻ Re-escanear'; }
    if (prog) prog.style.display = 'none';
    if (st)   st.textContent = `${results.length} ETFs · ${results.filter(r=>r.estado==='ready').length} listos`;

    renderGlobalSubsectores();
    saveState();
  }

  // ── Listeners navegación principal ──────────────
  container.querySelectorAll('.sct-view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      activeView = view;
      container.querySelectorAll('.sct-view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      container.querySelector('#sct-panel-rotacion')?.style.setProperty('display', view==='rotacion' ? 'block' : 'none');
      container.querySelector('#sct-panel-subsectores-global')?.style.setProperty('display', view==='subsectores-global' ? 'block' : 'none');
      container.querySelector('#sct-panel-componentes')?.style.setProperty('display', view==='componentes' ? 'block' : 'none');
    });
  });

  container.querySelector('#rot-scan-btn')?.addEventListener('click', startRotacionScan);
  container.querySelector('#gsub-scan-btn')?.addEventListener('click', startGlobalSubScan);

  // Botón "Volver a Sectores"
  container.querySelector('#sct-back-btn')?.addEventListener('click', () => {
    container.querySelector('#sct-rot-main').style.display = 'block';
    container.querySelector('#sct-subsector-drill').style.display = 'none';
    subsectorView = null;
  });

  // Botón "Volver a Subsectores"
  container.querySelector('#sct-back-sub-btn')?.addEventListener('click', () => {
    const compEl    = container.querySelector('#sct-comp-drill');
    const subListEl = container.querySelector('#sct-sub-list');
    if (compEl)    compEl.style.display = 'none';
    if (subListEl) subListEl.style.opacity = '1';
    if (subsectorView) subsectorView.subsectorTicker = null;
  });

  container.querySelectorAll('.sc2-tab[data-sector]').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.sector;
      activeTab = key;
      container.querySelectorAll('.sc2-tab[data-sector]').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.sc2-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      container.querySelector(`#spanel-${key}`)?.classList.add('active');
      renderTable(key);
      saveState();
    });
  });

  container.querySelectorAll('.sc2-btn-scan[data-sector]').forEach(btn => {
    btn.addEventListener('click', () => startScan(btn.dataset.sector));
  });

  SECTORS_CONFIG.forEach(cfg => {
    [`sfs-${cfg.key}`,`sfv-${cfg.key}`,`sfe-${cfg.key}`].forEach(id => {
      container.querySelector(`#${id}`)?.addEventListener('change', () => renderTable(cfg.key));
    });
  });

  // ── Restaurar estado ─────────────────────────────
  if (savedState?.sectorState) {
    SECTORS_CONFIG.forEach(cfg => {
      if (sectorState[cfg.key]?.results?.length > 0) {
        const btn = container.querySelector(`#sbtn-${cfg.key}`);
        const st  = container.querySelector(`#sst-${cfg.key}`);
        if (btn) btn.textContent = '↻ Re-escanear';
        if (st)  st.textContent = `${sectorState[cfg.key].results.length} valores · ${sectorState[cfg.key].results.filter(r=>r.estado==='ready').length} listos`;
        if (cfg.key === activeTab) renderTable(cfg.key);
      }
    });
  }
  if (savedState?.rotacionResults?.length  > 0) renderRotacion();
  if (savedState?.globalSubResults?.length > 0) renderGlobalSubsectores();

  return { destroy() {} };
}
