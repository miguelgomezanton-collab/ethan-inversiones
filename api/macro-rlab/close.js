// /api/macro-rlab/close.js — Vercel Serverless
// Cierre formal de una investigación Macro R-LAB
//
// POST /api/macro-rlab/close
// Body: {
//   researchId,
//   finalVerdict,          // VALIDADA | INDICATIVA | NO_VALIDADA | INCONCLUSA | CERRADA—RESEARCH ONLY
//   closureNotes,          // obligatorio — justificación del cierre
//   checklist: {           // checklist de cierre — todos deben ser true para VALIDADA
//     hypothesisTested,    // hipótesis fue testada formalmente
//     lookaheadChecked,    // no hay look-ahead bias
//     multipleHorizons,    // testado en múltiples horizontes
//     temporalStability,   // comprobada estabilidad temporal
//     walkForwardPassed,   // walk-forward satisfactorio
//     economicRationale,   // racionalidad económica documentada
//     riskAware,           // riesgos de implementación identificados
//   },
//   promoteToProd,         // bool — ¿promover a producción?
//   productionNotes,       // si promoteToProd=true
// }

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue }      from 'firebase-admin/firestore';

function getDB() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  return getFirestore();
}

const COL_RESEARCH = 'macro_rlab_research';
const COL_VERSIONS = 'macro_rlab_versions';
const COL_PROD     = 'macro_rlab_production';

const VALID_FINAL_VERDICTS = [
  'VALIDADA',
  'INDICATIVA',
  'NO_VALIDADA',
  'INCONCLUSA',
  'CERRADA—RESEARCH ONLY',
];

const CHECKLIST_FIELDS = [
  'hypothesisTested',
  'lookaheadChecked',
  'multipleHorizons',
  'temporalStability',
  'walkForwardPassed',
  'economicRationale',
  'riskAware',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return res.status(500).json({ error: 'FIREBASE_SERVICE_ACCOUNT no configurada' });

  const {
    researchId,
    finalVerdict,
    closureNotes,
    checklist = {},
    promoteToProd = false,
    productionNotes = '',
  } = req.body || {};

  // Validaciones
  if (!researchId)   return res.status(400).json({ error: 'Falta researchId' });
  if (!finalVerdict) return res.status(400).json({ error: 'Falta finalVerdict' });
  if (!VALID_FINAL_VERDICTS.includes(finalVerdict)) {
    return res.status(400).json({
      error: `finalVerdict inválido. Válidos: ${VALID_FINAL_VERDICTS.join(', ')}`,
    });
  }
  if (!closureNotes || closureNotes.trim().length < 20) {
    return res.status(400).json({ error: 'closureNotes debe tener al menos 20 caracteres' });
  }

  // Para VALIDADA: checklist completo obligatorio
  if (finalVerdict === 'VALIDADA') {
    const missing = CHECKLIST_FIELDS.filter(f => checklist[f] !== true);
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Para VALIDADA todos los checks deben ser true. Faltan: ${missing.join(', ')}`,
      });
    }
  }

  const db = getDB();

  try {
    const resDoc = await db.collection(COL_RESEARCH).doc(researchId).get();
    if (!resDoc.exists) return res.status(404).json({ error: 'Investigación no encontrada' });
    const research = resDoc.data();

    if (research.state === 'CERRADA') {
      return res.status(400).json({ error: 'Esta investigación ya está cerrada' });
    }

    const now = FieldValue.serverTimestamp();

    // Construir checklist completo con estado
    const fullChecklist = Object.fromEntries(
      CHECKLIST_FIELDS.map(f => [f, checklist[f] === true])
    );
    const checklistPct = Math.round(
      CHECKLIST_FIELDS.filter(f => fullChecklist[f]).length / CHECKLIST_FIELDS.length * 100
    );

    // Actualizar investigación → CERRADA
    const updateData = {
      state:           'CERRADA',
      closureVerdict:  finalVerdict,
      closureNotes:    closureNotes.trim(),
      closureChecklist: fullChecklist,
      checklistPct,
      closedAt:        now,
      updatedAt:       now,
      archived:        false, // sigue visible aunque cerrada
    };
    await db.collection(COL_RESEARCH).doc(researchId).update(updateData);

    // Guardar snapshot de cierre como versión especial
    const closeVersion = {
      researchId,
      versionNum:     (research.versionCount || 0) + 1,
      type:           'CLOSURE',
      finalVerdict,
      closureNotes:   closureNotes.trim(),
      checklist:      fullChecklist,
      checklistPct,
      promoteToProd,
      productionNotes: productionNotes.trim(),
      createdAt:      now,
    };
    const closeVerRef = await db.collection(COL_VERSIONS).add(closeVersion);

    // Si promover a producción: crear entrada en colección de producción
    let prodId = null;
    if (promoteToProd) {
      if (finalVerdict !== 'VALIDADA' && finalVerdict !== 'INDICATIVA') {
        return res.status(400).json({
          error: `Solo se puede promover a producción con veredicto VALIDADA o INDICATIVA (actual: ${finalVerdict})`,
        });
      }
      // Obtener última versión de resultados
      const lastVerSnap = await db.collection(COL_VERSIONS)
        .where('researchId', '==', researchId)
        .where('type', '==', undefined)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
      // Nota: Firestore no filtra por campo ausente bien — obtenemos todas y filtramos
      const lastVersAll = await db.collection(COL_VERSIONS)
        .where('researchId', '==', researchId)
        .orderBy('createdAt', 'desc')
        .get();
      const lastResultVer = lastVersAll.docs.find(d => !d.data().type);

      const prodEntry = {
        researchId,
        closeVersionId: closeVerRef.id,
        resultVersionId: lastResultVer?.id ?? null,
        title:          research.title,
        hypothesis:     research.hypothesis,
        signal:         research.signal,
        targetIndicator: research.targetIndicator,
        verdict:        finalVerdict,
        promotedAt:     now,
        notes:          productionNotes.trim(),
        active:         true,
      };
      const prodRef = await db.collection(COL_PROD).add(prodEntry);
      prodId = prodRef.id;
    }

    await db.collection(COL_RESEARCH).doc(researchId).update({
      versionCount: FieldValue.increment(1),
    });

    return res.status(200).json({
      researchId,
      closeVersionId: closeVerRef.id,
      finalVerdict,
      checklistPct,
      promotedToProd: promoteToProd,
      prodId,
      state: 'CERRADA',
    });

  } catch (err) {
    console.error('[macro-rlab/close]', err);
    return res.status(500).json({ error: err.message });
  }
}
