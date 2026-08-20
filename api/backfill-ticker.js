// /api/backfill-ticker.js — ETHAN Mercados
// Dos acciones en una función para no superar el límite de 12 serverless functions:
//
// action: 'backfill' (default) — descarga histórico via Twelve Data → prices/{ticker}/daily
// action: 'market-history'     — cache OHLCV via Yahoo → ethan_market_history/{ticker}_{year}

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })});
  }
  return getFirestore();
}

// ── Twelve Data (backfill clásico) ────────────────────────────────
async function fetchTwelveData(ticker, { dateFrom, dateTo, outputSize = 252 } = {}) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  let url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(ticker)}&interval=1day&apikey=${apiKey}&dp=4&order=DESC`;
  if (dateFrom && dateTo) url += `&start_date=${dateFrom}&end_date=${dateTo}&outputsize=5000`;
  else url += `&outputsize=${outputSize}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`);
    const data = await res.json();
    if (data.status === 'error') throw new Error(data.message || 'Twelve Data error');
    return data.values || [];
  } catch(e) { clearTimeout(t); throw e; }
}

// ── Yahoo Finance OHLCV (market-history) ──────────────────────────
function yearsInRange(startDate, endDate) {
  const s = new Date(startDate).getFullYear();
  const e = new Date(endDate).getFullYear();
  const years = [];
  for (let y = s; y <= e; y++) years.push(y);
  return years;
}

async function fetchYahooOHLCV(ticker, startDate, endDate) {
  const s = Math.floor(new Date(startDate).getTime() / 1000);
  const e = Math.floor(new Date(endDate + 'T23:59:59Z').getTime() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&period1=${s}&period2=${e}&events=history`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(t);
    if (!r.ok) throw new Error(`Yahoo HTTP ${r.status}`);
    const j = await r.json();
    const result = j?.chart?.result?.[0];
    if (!result) throw new Error('Sin datos Yahoo');
    const timestamps = result.timestamp || [];
    const q = result.indicators?.quote?.[0] || {};
    const adj = result.indicators?.adjclose?.[0]?.adjclose || q.close;
    const rows = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (!adj[i] || !q.open[i]) continue;
      rows.push({
        date:   new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
        open:   +q.open[i].toFixed(4),
        high:   +q.high[i].toFixed(4),
        low:    +q.low[i].toFixed(4),
        close:  +adj[i].toFixed(4),
        volume: q.volume[i] || 0,
      });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  } catch(e) { clearTimeout(t); throw e; }
}

// ── Handler ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const cronSecret = process.env.CRON_SECRET;
  const isClient   = req.headers['x-ethan-client'] === 'true';
  if (cronSecret && !isClient && req.headers['authorization'] !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body || {};
  const action = body.action || 'backfill';

  // ── Acción market-history — Yahoo directo, sin Firestore ─────
  if (action === 'market-history') {
    const { ticker, startDate, endDate } = body;
    if (!ticker || !startDate || !endDate) {
      return res.status(400).json({ error: 'ticker, startDate, endDate requeridos' });
    }
    try {
      const rows = await fetchYahooOHLCV(ticker, startDate, endDate);
      if (!rows.length) throw new Error('Sin datos de Yahoo Finance');
      return res.status(200).json({
        ticker, startDate, endDate,
        cachedYears: [], fetchedYears: [],
        totalRows: rows.length, rows,
      });
    } catch(e) {
      console.error('[market-history]', ticker, e.message);
      return res.status(500).json({ error: e.message, ticker });
    }
  }

  // ── Acción backfill clásica (Twelve Data) ─────────────────────
  const { ticker, dateFrom, dateTo, status = 'active', forceRefresh = false } = body;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });
  const db = getDB();
  const startMs = Date.now();
  try {
    if (!forceRefresh && status === 'inactive') {
      const snap = await db.collection('prices').doc(ticker).collection('daily')
        .orderBy('__name__', 'desc').limit(1).get();
      if (!snap.empty) return res.status(200).json({ status: 'already_exists', ticker, lastDate: snap.docs[0].id });
    }
    const history = await fetchTwelveData(ticker, { dateFrom, dateTo });
    if (!history.length) throw new Error('Sin datos históricos de Twelve Data');
    const BATCH_SIZE = 400;
    let saved = 0;
    for (let i = 0; i < history.length; i += BATCH_SIZE) {
      const chunk = history.slice(i, i + BATCH_SIZE);
      const batch = db.batch();
      chunk.forEach(day => {
        const date = day.datetime?.slice(0, 10);
        if (!date) return;
        const close = parseFloat(day.close);
        if (isNaN(close) || close <= 0) return;
        batch.set(db.collection('prices').doc(ticker).collection('daily').doc(date), {
          close, adjustedClose: close,
          open: parseFloat(day.open) || null, high: parseFloat(day.high) || null,
          low: parseFloat(day.low) || null, volume: parseInt(day.volume) || 0,
          source: 'twelvedata_backfill', fetchedAt: new Date().toISOString(),
        }, { merge: true });
        saved++;
      });
      await batch.commit();
    }
    if (status === 'active') {
      const latest = history[0];
      const close = parseFloat(latest.close);
      const prevClose = parseFloat(history[1]?.close) || close;
      await db.collection('prices').doc(ticker).collection('latest').doc('current').set({
        adjustedClose: close, asOf: latest.datetime?.slice(0, 10),
        dayChangePct: prevClose > 0 ? (close - prevClose) / prevClose * 100 : 0,
        source: 'twelvedata_backfill', fetchedAt: new Date().toISOString(),
      });
    }
    await db.collection('tracked_assets').doc(ticker).set({
      ticker, status, addedAt: new Date().toISOString(),
      lastSuccessfulFetch: new Date().toISOString(), consecutiveFailures: 0,
      dateFrom: dateFrom || null, dateTo: dateTo || null,
    }, { merge: true });
    return res.status(200).json({
      status: 'ok', ticker, saved,
      dateFrom: history[history.length-1]?.datetime?.slice(0,10),
      dateTo:   history[0]?.datetime?.slice(0,10),
      durationMs: Date.now() - startMs,
    });
  } catch(e) {
    return res.status(500).json({ status: 'error', ticker, error: e.message });
  }
}
