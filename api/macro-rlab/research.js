// /api/macro-rlab/research.js — Vercel Serverless
// CRUD de investigaciones Macro R-LAB en Firestore
//
// GET    /api/macro-rlab/research          → lista todas
// GET    /api/macro-rlab/research?id=xxx   → una investigación con versiones
// POST   /api/macro-rlab/research          → crear nueva investigación
// PUT    /api/macro-rlab/research?id=xxx   → actualizar metadatos
// DELETE /api/macro-rlab/research?id=xxx   → archivar (soft delete)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  return getFirestore();
}

// ─── Colecciones ────────────────────────────────────────────────────────────
const COL_RESEARCH  = 'macro_rlab_research';
const COL_VERSIONS  = 'macro_rlab_versions';
const COL_EXECUTIONS = 'macro_rlab_executions';

// ─── Estados válidos ─────────────────────────────────────────────────────────
const VALID_STATES = ['BORRADOR', 'EN_INVESTIGACION', 'INDICATIVA', 'VALIDADA', 'NO_VALIDADA', 'INCONCLUSA', 'CERRADA'];

// ─── GET ─────────────────────────────────────────────────────────────────────
async function handleGet(req, res, db) {
  const { id, state, limit = '50' } = req.query;

  if (id) {
    // Una investigación con sus versiones y ejecuciones
    const doc = await db.collection(COL_RESEARCH).doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Investigación no encontrada' });

    const [versSnap, exSnap] = await Promise.all([
      db.collection(COL_VERSIONS)
        .where('researchId', '==', id)
        .orderBy('createdAt', 'desc')
        .get(),
      db.collection(COL_EXECUTIONS)
        .where('researchId', '==', id)
        .orderBy('startedAt', 'desc')
        .limit(10)
        .get(),
    ]);

    return res.status(200).json({
      research:   { id: doc.id, ...doc.data() },
      versions:   versSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      executions: exSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    });
  }

  // Lista con filtro opcional por estado
  let query = db.collection(COL_RESEARCH)
    .where('archived', '==', false)
    .orderBy('updatedAt', 'desc')
    .limit(parseInt(limit));

  if (state && VALID_STATES.includes(state)) {
    query = db.collection(COL_RESEARCH)
      .where('state', '==', state)
      .where('archived', '==', false)
      .orderBy('updatedAt', 'desc')
      .limit(parseInt(limit));
  }

  const snap = await query.get();
  return res.status(200).json({
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    total: snap.size,
  });
}

// ─── POST — crear nueva investigación ────────────────────────────────────────
async function handlePost(req, res, db) {
  const body = req.body;
  const required = ['title', 'hypothesis', 'signal', 'targetIndicator'];
  for (const f of required) {
    if (!body[f]) return res.status(400).json({ error: `Campo requerido: ${f}` });
  }

  const now = FieldValue.serverTimestamp();
  const doc = {
    // Identificación
    title:           body.title,
    hypothesis:      body.hypothesis,
    signal:          body.signal,           // indicador señal (p.ej. VIX)
    targetIndicator: body.targetIndicator,  // indicador objetivo (p.ej. SP500)
    // Configuración del experimento
    horizonMonths:   body.horizonMonths   ?? [1, 3, 6, 12],
    periodConfig:    body.periodConfig    ?? { type: 'MAX' },  // {type:'MAX'|'5Y'|'10Y'|'20Y'|'CUSTOM', from?, to?}
    lag:             body.lag             ?? 0,  // meses de lag señal → rendimiento
    transformSignal: body.transformSignal ?? 'LEVEL', // LEVEL | YOY | MOM | ZSCORE
    quintiles:       body.quintiles       ?? 5,
    // Estado y metadatos
    state:           'EN_INVESTIGACION',
    version:         1,
    versionCount:    0,
    executionCount:  0,
    notes:           body.notes ?? '',
    tags:            body.tags  ?? [],
    archived:        false,
    closedAt:        null,
    closureVerdict:  null,
    createdAt:       now,
    updatedAt:       now,
  };

  const ref = await db.collection(COL_RESEARCH).add(doc);
  return res.status(201).json({ id: ref.id, ...doc });
}

// ─── PUT — actualizar metadatos ──────────────────────────────────────────────
async function handlePut(req, res, db) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Falta id' });

  const doc = await db.collection(COL_RESEARCH).doc(id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Investigación no encontrada' });

  const allowed = ['title', 'hypothesis', 'notes', 'tags', 'state', 'periodConfig',
                   'horizonMonths', 'lag', 'transformSignal', 'quintiles'];
  const update  = { updatedAt: FieldValue.serverTimestamp() };

  for (const k of allowed) {
    if (req.body[k] !== undefined) {
      if (k === 'state' && !VALID_STATES.includes(req.body[k])) {
        return res.status(400).json({ error: `Estado inválido: ${req.body[k]}. Válidos: ${VALID_STATES.join(', ')}` });
      }
      update[k] = req.body[k];
    }
  }

  await db.collection(COL_RESEARCH).doc(id).update(update);
  return res.status(200).json({ id, ...update });
}

// ─── DELETE — archivar (soft delete) ─────────────────────────────────────────
async function handleDelete(req, res, db) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Falta id' });

  const doc = await db.collection(COL_RESEARCH).doc(id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Investigación no encontrada' });

  await db.collection(COL_RESEARCH).doc(id).update({
    archived:  true,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return res.status(200).json({ id, archived: true });
}

// ─── Handler principal ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return res.status(500).json({ error: 'FIREBASE_SERVICE_ACCOUNT no configurada' });
  }

  const db = getDB();
  try {
    if (req.method === 'GET')    return await handleGet(req, res, db);
    if (req.method === 'POST')   return await handlePost(req, res, db);
    if (req.method === 'PUT')    return await handlePut(req, res, db);
    if (req.method === 'DELETE') return await handleDelete(req, res, db);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[macro-rlab/research]', err);
    return res.status(500).json({ error: err.message });
  }
}
