// /api/macro-rlab/data.js — Vercel Serverless
// Sirve histórico completo de indicadores para Macro R-LAB
// GET /api/macro-rlab/data?indicator=VIX&freq=daily&from=MAX
//
// Indicadores soportados:
//   VIX        → FRED VIXCLS (diario desde 1990)
//   HY_OAS     → FRED BAMLH0A0HYM2 (diario desde 1997)
//   SP500      → Yahoo Finance ^GSPC (diario desde 1928) — B1
//   CURVE_10_2 → FRED DGS10 - DGS2 (diario desde 1976)
//   DXY        → FRED DTWEXBGS (diario desde 2006)
//   REAL_10Y   → FRED DFII10 (diario desde 2003)
//   VIX3M      → Yahoo Finance ^VIX3M (diario desde ~2008)
//   FFR        → FRED DFF (diario desde 1954)
//   CPI        → FRED CPIAUCSL (mensual)
//   BBB        → FRED BAMLC0A4CBBB (diario desde 1997)
//
// Cache Firestore: macro_rlab_data_cache/{indicator} con TTL de 24h — B1
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';

const FRED_API = 'https://api.stlouisfed.org/fred/series/observations';
const COL_CACHE = 'macro_rlab_data_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }) });
  }
  return getFirestore();
}

// Configuración de cada indicador
const INDICATORS = {
  VIX: {
    label:       'VIX — CBOE Volatility Index',
    source:      'FRED',
    series:      'VIXCLS',
    freq:        'd',
    from:        '1990-01-02',
    unit:        'puntos',
    description: 'Volatilidad implícita del S&P 500 a 30 días (CBOE)',
  },
  HY_OAS: {
    label:       'HY OAS — ICE BofA US HY',
    source:      'FRED',
    series:      'BAMLH0A0HYM2',
    freq:        'd',
    from:        '1997-01-02',
    unit:        'pb',
    description: 'Option-Adjusted Spread del índice de High Yield USD',
  },
  // B1: Cambiado de FRED SP500 (~10 años diarios) a Yahoo Finance ^GSPC (desde 1928)
  SP500: {
    label:       'S&P 500',
    source:      'YAHOO',
    symbol:      '%5EGSPC',          // ^GSPC URL-encoded
    sourceDetail:'Yahoo Finance ^GSPC (1928-presente)',
    freq:        'd',
    from:        '1928-01-03',
    unit:        'puntos',
    description: 'Índice S&P 500 (precio cierre) — fuente: Yahoo Finance ^GSPC con rango MAX',
  },
  CURVE_10_2: {
    label:       'Curva 10Y–2Y',
    source:      'FRED_DERIVED',
    series:      ['DGS10', 'DGS2'],
    freq:        'd',
    from:        '1976-06-01',
    unit:        '%',
    description: 'Spread entre Treasury 10Y y 2Y (indicador de inversión de curva)',
  },
  DXY: {
    label:       'DXY — US Dollar Index',
    source:      'FRED',
    series:      'DTWEXBGS',
    freq:        'd',
    from:        '2006-01-02',
    unit:        'índice',
    description: 'Índice ponderado del dólar vs cesta de divisas',
  },
  REAL_10Y: {
    label:       'Tipo Real 10Y (DFII10)',
    source:      'FRED',
    series:      'DFII10',
    freq:        'd',
    from:        '2003-01-02',
    unit:        '%',
    description: 'Treasury 10Y ajustado por inflación (TIPS)',
  },
  VIX3M: {
    label:       'VIX3M — CBOE 3-Month Volatility',
    source:      'YAHOO',
    symbol:      '%5EVIX3M',
    sourceDetail:'Yahoo Finance ^VIX3M',
    freq:        'd',
    from:        '2008-01-01',
    unit:        'puntos',
    description: 'Volatilidad implícita del S&P 500 a 3 meses (CBOE)',
  },
  FFR: {
    label:       'Federal Funds Rate',
    source:      'FRED',
    series:      'DFF',
    freq:        'd',
    from:        '1954-07-01',
    unit:        '%',
    description: 'Tasa de fondos federales efectiva',
  },
  CPI: {
    label:       'CPI — Inflación General USA',
    source:      'FRED',
    series:      'CPIAUCSL',
    freq:        'm',
    from:        '1947-01-01',
    unit:        'índice',
    description: 'Consumer Price Index for All Urban Consumers',
  },
  BBB: {
    label:       'BBB OAS — ICE BofA BBB',
    source:      'FRED',
    series:      'BAMLC0A4CBBB',
    freq:        'd',
    from:        '1997-01-02',
    unit:        'pb',
    description: 'Option-Adjusted Spread del índice BBB USD',
  },
};

// ─── FRED fetch ──────────────────────────────────────────────────────────────
async function fetchFRED(seriesId, apiKey, from = '', freq = 'd') {
  const freqParam  = freq ? `&frequency=${freq}` : '';
  const startParam = from ? `&observation_start=${from}` : '';
  const url = `${FRED_API}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=asc${freqParam}${startParam}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`FRED ${seriesId}: HTTP ${r.status}`);
  const d = await r.json();
  return (d.observations || [])
    .filter(o => o.value !== '.' && o.value !== 'null')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }))
    .filter(o => isFinite(o.value));
}

// ─── Yahoo Finance fetch ─────────────────────────────────────────────────────
// B1: range=max para ^GSPC (historia completa desde 1928); range=20y para VIX3M
async function fetchYahoo(symbol) {
  // ^GSPC encoded como %5EGSPC → historia completa; demás símbolos → 20 años
  const range = symbol === '%5EGSPC' ? 'max' : '20y';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}&events=history`;
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ETHAN-Macro-RLAB/1.0)',
      'Accept':     'application/json',
    },
  });
  if (!r.ok) throw new Error(`Yahoo ${symbol}: HTTP ${r.status}`);
  const res = (await r.json()).chart?.result?.[0];
  if (!res) throw new Error(`Yahoo ${symbol}: sin datos`);
  const ts     = res.timestamps || res.timestamp || [];
  const closes = res.indicators?.quote?.[0]?.close || [];
  return ts
    .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), value: closes[i] }))
    .filter(p => p.value != null && isFinite(p.value));
}

// ─── Firestore cache: leer ────────────────────────────────────────────────────
// B1: cacheKey = `{INDICATOR}` (un doc por indicador, siempre historia completa)
async function readCache(db, indicator) {
  try {
    const doc = await db.collection(COL_CACHE).doc(indicator).get();
    if (!doc.exists) return null;
    const d = doc.data();
    if (!d?.fetchedAt) return null;
    const fetchedMs = d.fetchedAt.toMillis ? d.fetchedAt.toMillis() : d.fetchedAt;
    if (Date.now() - fetchedMs > CACHE_TTL_MS) return null; // expirado
    return { data: d.data, coverage: d.coverage };
  } catch {
    return null; // cache miss silencioso
  }
}

// ─── Firestore cache: escribir ───────────────────────────────────────────────
async function writeCache(db, indicator, data, coverage) {
  try {
    await db.collection(COL_CACHE).doc(indicator).set({
      data,
      coverage,
      fetchedAt: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.warn(`[macro-rlab/data] cache write failed for ${indicator}:`, e.message);
  }
}

// ─── Aplicar recorte de fecha según parámetro 'from' ──────────────────────
function applyFromFilter(data, fromParam) {
  if (!fromParam || fromParam === 'MAX') return data;
  const years = { '5Y': 5, '10Y': 10, '20Y': 20 };
  if (years[fromParam]) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - years[fromParam]);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return data.filter(d => d.date >= cutoffStr);
  }
  // YYYY-MM-DD personalizado
  if (/^\d{4}-\d{2}-\d{2}$/.test(fromParam)) {
    return data.filter(d => d.date >= fromParam);
  }
  return data;
}

// ─── Metadatos de cobertura ──────────────────────────────────────────────────
function buildCoverage(data, indicator) {
  const cfg   = INDICATORS[indicator];
  const valid = data.filter(d => d.value != null && isFinite(d.value));
  return {
    indicator,
    label:       cfg.label,
    unit:        cfg.unit,
    description: cfg.description,
    // B1: incluir sourceDetail para SP500 y VIX3M
    source:      cfg.sourceDetail ?? cfg.source,
    freq:        cfg.freq === 'd' ? 'Diaria' : 'Mensual',
    dateFrom:    valid[0]?.date ?? null,
    dateTo:      valid[valid.length - 1]?.date ?? null,
    nObs:        valid.length,
    nObsMax:     data.length,
    coveragePct: data.length ? +(valid.length / data.length * 100).toFixed(1) : 0,
  };
}

// ─── Handler principal ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { indicator, from = 'MAX', meta = 'false' } = req.query;
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'FRED_API_KEY no configurada' });
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID) return res.status(500).json({ error: 'FIREBASE_ADMIN_* env vars no configuradas' });

  // Listar indicadores disponibles
  if (!indicator || indicator === 'list') {
    const list = Object.entries(INDICATORS).map(([id, cfg]) => ({
      id,
      label:       cfg.label,
      source:      cfg.sourceDetail ?? cfg.source,
      freq:        cfg.freq === 'd' ? 'Diaria' : 'Mensual',
      from:        cfg.from,
      unit:        cfg.unit,
      description: cfg.description,
    }));
    return res.status(200).json({ indicators: list });
  }

  const indKey = indicator.toUpperCase();
  const cfg = INDICATORS[indKey];
  if (!cfg) {
    return res.status(400).json({
      error: `Indicador '${indicator}' no reconocido`,
      available: Object.keys(INDICATORS),
    });
  }

  try {
    const db = getDB();

    // ── B1: intentar cache Firestore (solo para from=MAX — historia completa) ─
    // Para recortes temporales aplicamos el filtro sobre los datos del cache
    const cached = await readCache(db, indKey);

    let rawData = [];
    let cacheHit = false;

    if (cached) {
      rawData  = cached.data;
      cacheHit = true;
    } else {
      // Fetch fresco
      if (cfg.source === 'FRED') {
        rawData = await fetchFRED(cfg.series, apiKey, cfg.from, cfg.freq);

      } else if (cfg.source === 'FRED_DERIVED') {
        const [s10, s2] = await Promise.all([
          fetchFRED(cfg.series[0], apiKey, cfg.from, cfg.freq),
          fetchFRED(cfg.series[1], apiKey, cfg.from, cfg.freq),
        ]);
        const s2Map = new Map(s2.map(p => [p.date, p.value]));
        rawData = s10
          .filter(p => s2Map.has(p.date))
          .map(p => ({ date: p.date, value: +(p.value - s2Map.get(p.date)).toFixed(3) }));

      } else if (cfg.source === 'YAHOO') {
        // B1: ^GSPC usa range=max para historia completa
        rawData = await fetchYahoo(cfg.symbol);
      }

      // Escribir cache (historia completa, sin filtro de fecha)
      const fullCoverage = buildCoverage(rawData, indKey);
      await writeCache(db, indKey, rawData, fullCoverage);
    }

    const filtered = applyFromFilter(rawData, from);
    const coverage = buildCoverage(filtered, indKey);

    // Anotar si la respuesta viene del cache
    if (cacheHit) coverage.fromCache = true;

    // Solo metadatos si meta=true
    if (meta === 'true') {
      return res.status(200).json({ coverage, data: [] });
    }

    return res.status(200).json({ coverage, data: filtered });

  } catch (err) {
    console.error(`[macro-rlab/data] ${indicator}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
