// /api/market-history.js — ETHAN Mercados
// Cache persistente de datos históricos OHLCV en Firestore
// Estructura: ethan_market_history/{ticker}_{year}
// POST { ticker, startDate, endDate, uid }
// Lazy cache: solo descarga lo que no existe en Firestore

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

// Años completos necesarios para el rango
function yearsInRange(startDate, endDate) {
  const s = new Date(startDate).getFullYear();
  const e = new Date(endDate).getFullYear();
  const years = [];
  for (let y = s; y <= e; y++) years.push(y);
  return years;
}

// Descarga histórico desde Yahoo Finance (sin proxy — servidor a servidor)
async function fetchFromYahoo(ticker, startDate, endDate) {
  const s = Math.floor(new Date(startDate).getTime() / 1000);
  const e = Math.floor(new Date(endDate + 'T23:59:59Z').getTime() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&period1=${s}&period2=${e}&events=history`;

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ETHAN/1.0)' }
    });
    clearTimeout(timeout);
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
      const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
      rows.push({
        date,
        open:   +q.open[i].toFixed(4),
        high:   +q.high[i].toFixed(4),
        low:    +q.low[i].toFixed(4),
        close:  +adj[i].toFixed(4),
        volume: q.volume[i] || 0,
      });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  } catch(e) {
    clearTimeout(timeout);
    throw e;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const isClient = req.headers['x-ethan-client'] === 'true';
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && !isClient && req.headers['authorization'] !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { ticker, startDate, endDate, uid, forceRefresh = false } = req.body || {};
  if (!ticker || !startDate || !endDate || !uid) {
    return res.status(400).json({ error: 'ticker, startDate, endDate, uid requeridos' });
  }

  const db = getDB();
  const years = yearsInRange(startDate, endDate);
  const result = { ticker, startDate, endDate, years: {}, missingYears: [], cachedYears: [] };

  try {
    // 1. Para cada año, comprobar si existe en cache
    const yearDocs = await Promise.all(
      years.map(y => db.collection('users').doc(uid)
        .collection('ethan_market_history').doc(`${ticker}_${y}`).get())
    );

    const toFetch = [];
    for (let i = 0; i < years.length; i++) {
      const y = years[i];
      const snap = yearDocs[i];
      if (!forceRefresh && snap.exists) {
        result.cachedYears.push(y);
        result.years[y] = snap.data().rows || [];
      } else {
        result.missingYears.push(y);
        toFetch.push(y);
      }
    }

    // 2. Descargar años que faltan
    if (toFetch.length > 0) {
      const fetchStart = `${Math.min(...toFetch)}-01-01`;
      const fetchEnd   = `${Math.max(...toFetch)}-12-31`;

      const rows = await fetchFromYahoo(ticker, fetchStart, fetchEnd);

      // Agrupar por año
      const byYear = {};
      for (const row of rows) {
        const y = parseInt(row.date.slice(0, 4));
        if (!byYear[y]) byYear[y] = [];
        byYear[y].push(row);
      }

      // Persistir cada año en Firestore
      const batch = db.batch();
      for (const y of toFetch) {
        const yearRows = byYear[y] || [];
        const docRef = db.collection('users').doc(uid)
          .collection('ethan_market_history').doc(`${ticker}_${y}`);
        const payload = {
          ticker,
          year: y,
          timeframe: '1D',
          source: 'yahoo_finance',
          fetchedAt: new Date().toISOString(),
          firstDate: yearRows[0]?.date || null,
          lastDate:  yearRows[yearRows.length - 1]?.date || null,
          dataVersion: '1.0',
          rows: yearRows,
        };
        batch.set(docRef, payload);
        result.years[y] = yearRows;
      }
      await batch.commit();
    }

    // 3. Combinar todos los rows en orden cronológico
    const allRows = years.flatMap(y => result.years[y] || [])
      .filter(r => r.date >= startDate && r.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));

    return res.status(200).json({
      ticker,
      startDate,
      endDate,
      cachedYears: result.cachedYears,
      fetchedYears: result.missingYears,
      totalRows: allRows.length,
      rows: allRows,
    });

  } catch(e) {
    console.error('[market-history]', ticker, e.message);
    return res.status(500).json({ error: e.message, ticker });
  }
}
