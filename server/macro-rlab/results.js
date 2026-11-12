// /api/macro-rlab/results.js — Vercel Serverless
// Lee los resultados de una versión específica
//
// GET /api/macro-rlab/results?versionId=xxx
// GET /api/macro-rlab/results?researchId=xxx             → última versión
// GET /api/macro-rlab/results?researchId=xxx&all=true    → todas las versiones (resumen)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore }                  from 'firebase-admin/firestore';

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }) });
  }
  return getFirestore();
}

const COL_RESEARCH  = 'macro_rlab_research';
const COL_VERSIONS  = 'macro_rlab_versions';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID) return res.status(500).json({ error: 'FIREBASE_ADMIN_* env vars no configuradas' });

  const db = getDB();
  const { versionId, researchId, all } = req.query;

  try {
    // Por versionId concreto
    if (versionId) {
      const doc = await db.collection(COL_VERSIONS).doc(versionId).get();
      if (!doc.exists) return res.status(404).json({ error: 'Versión no encontrada' });
      return res.status(200).json({ id: doc.id, ...doc.data() });
    }

    if (!researchId) return res.status(400).json({ error: 'Falta versionId o researchId' });

    // Todas las versiones (resumen sin resultados completos)
    if (all === 'true') {
      const snap = await db.collection(COL_VERSIONS)
        .where('researchId', '==', researchId)
        .orderBy('createdAt', 'desc')
        .get();
      const items = snap.docs.map(d => {
        const { results, ...meta } = d.data();
        return {
          id: d.id,
          ...meta,
          // Resumen compacto de resultados por horizonte
          verdictByHorizon: Object.fromEntries(
            Object.entries(results || {}).map(([h, r]) => [h, r.verdict ?? r.error ?? 'N/A'])
          ),
        };
      });
      return res.status(200).json({ versions: items, total: items.length });
    }

    // Última versión
    const snap = await db.collection(COL_VERSIONS)
      .where('researchId', '==', researchId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (snap.empty) return res.status(404).json({ error: 'Sin versiones para esta investigación' });
    const doc = snap.docs[0];
    return res.status(200).json({ id: doc.id, ...doc.data() });

  } catch (err) {
    console.error('[macro-rlab/results]', err);
    return res.status(500).json({ error: err.message });
  }
}
