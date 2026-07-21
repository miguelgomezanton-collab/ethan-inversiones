// /api/backfill-all-positions.js — Vercel Serverless
// Recibe las posiciones del cliente y dispara el backfill de cada una.
// POST { positions: [...], history: [...] }

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

async function fetchHistory(ticker, { dateFrom, dateTo } = {}) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  let url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(ticker)}&interval=1day&apikey=${apiKey}&dp=4&order=DESC&outputsize=5000`;
  if (dateFrom && dateTo) url += `&start_date=${dateFrom}&end_date=${dateTo}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`);
  const data = await res.json();
  if (data.status === 'error') throw new Error(data.message || 'Twelve Data error');
  return data.values || [];
}

async function saveToFirestore(db, ticker, history, status) {
  if (!history.length) return 0;
  const BATCH_SIZE = 400;
  let saved = 0;
  for (let i = 0; i < history.length; i += BATCH_SIZE) {
    const batch = db.batch();
    history.slice(i, i + BATCH_SIZE).forEach(day => {
      const date = day.datetime?.slice(0, 10);
      if (!date) return;
      const close = parseFloat(day.close);
      if (isNaN(close) || close <= 0) return;
      batch.set(
        db.collection('prices').doc(ticker).collection('daily').doc(date),
        { close, adjustedClose: close, open: parseFloat(day.open)||null, high: parseFloat(day.high)||null, low: parseFloat(day.low)||null, volume: parseInt(day.volume)||0, source: 'twelvedata_backfill', fetchedAt: new Date().toISOString() },
        { merge: true }
      );
      saved++;
    });
    await batch.commit();
  }

  // Actualizar latest solo si activa
  if (status === 'active' && history[0]) {
    const latest = history[0];
    const close = parseFloat(latest.close);
    const prev = parseFloat(history[1]?.close) || close;
    await db.collection('prices').doc(ticker).collection('latest').doc('current').set({
      adjustedClose: close, asOf: latest.datetime?.slice(0,10),
      dayChangePct: prev > 0 ? (close - prev) / prev * 100 : 0,
      source: 'twelvedata_backfill', fetchedAt: new Date().toISOString(),
    });
  }

  // Registrar en tracked_assets
  await db.collection('tracked_assets').doc(ticker).set({
    ticker, status, addedAt: new Date().toISOString(),
    lastSuccessfulFetch: new Date().toISOString(), consecutiveFailures: 0,
  }, { merge: true });

  return saved;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];
  const isClient   = req.headers['x-ethan-client'] === 'true';
  if (cronSecret && !isClient && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { positions = [], history = [] } = req.body || {};
  const db = getDB();
  const today = new Date().toISOString().slice(0, 10);
  const results = [];
  const startMs = Date.now();

  // ── Posiciones cerradas ──────────────────────
  for (const pos of history) {
    if (!pos.ticker || !pos.entryDateISO || !pos.exitDateISO) continue;
    try {
      const data = await fetchHistory(pos.ticker, { dateFrom: pos.entryDateISO, dateTo: pos.exitDateISO });
      const saved = await saveToFirestore(db, pos.ticker, data, 'inactive');
      results.push({ ticker: pos.ticker, type: 'closed', saved, status: 'ok' });
    } catch(e) {
      results.push({ ticker: pos.ticker, type: 'closed', error: e.message });
    }
    await new Promise(r => setTimeout(r, 600)); // pausa entre llamadas
  }

  // ── Posiciones abiertas ──────────────────────
  for (const pos of positions) {
    if (!pos.ticker || !pos.entryDate) continue;
    try {
      const data = await fetchHistory(pos.ticker, { dateFrom: pos.entryDate, dateTo: today });
      const saved = await saveToFirestore(db, pos.ticker, data, 'active');
      results.push({ ticker: pos.ticker, type: 'open', saved, status: 'ok' });
    } catch(e) {
      results.push({ ticker: pos.ticker, type: 'open', error: e.message });
    }
    await new Promise(r => setTimeout(r, 600));
  }

  return res.status(200).json({
    status: 'ok',
    results,
    totalSaved: results.reduce((s, r) => s + (r.saved || 0), 0),
    durationMs: Date.now() - startMs,
  });
}
