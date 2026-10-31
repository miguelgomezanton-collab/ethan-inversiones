#!/usr/bin/env node
// scripts/seed-macro-rlab.js
// Seed inicial de Macro R-LAB en Firestore
//
// Uso:  GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json node scripts/seed-macro-rlab.js
// O:    FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' node scripts/seed-macro-rlab.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

initializeApp(sa ? { credential: cert(sa) } : undefined);
const db = getFirestore();
const COL = 'macro_rlab_research';

const now = Timestamp.now();

const seeds = [
  {
    id: 'RISK_RADAR_V1',
    doc: {
      title:           'RISK_RADAR_V1 — VIX como predictor de retornos S&P 500',
      hypothesis:      'Niveles elevados de VIX (>25) anticipan rendimientos superiores del S&P 500 a 3-12 meses. El mecanismo: el miedo extremo crea valoraciones deprimidas, y la reversión a la media genera alfa predictivo.',
      signal:          'VIX',
      targetIndicator: 'SP500',
      horizonMonths:   [1, 3, 6, 12],
      periodConfig:    { type: 'MAX' },
      lag:             0,
      transformSignal: 'LEVEL',
      quintiles:       5,
      state:           'CERRADA',
      closureVerdict:  'CERRADA—RESEARCH ONLY',
      closureNotes:    'La relación VIX→retornos SP500 es estadísticamente significativa en horizontes de 3-12M (Spearman ≈ -0.35, p<0.01) pero presenta baja estabilidad temporal en períodos post-2010. La quintil más alta (VIX>30) muestra retornos medianos del +18% a 12M pero con alta dispersión. No se promueve a producción por las dificultades de timing exacto y el riesgo de "catching the falling knife". Se mantiene como referencia de investigación.',
      closureChecklist: {
        hypothesisTested: true, lookaheadChecked: true, multipleHorizons: true,
        temporalStability: true, walkForwardPassed: false, economicRationale: true, riskAware: true,
      },
      checklistPct:    86,
      versionCount:    3,
      executionCount:  3,
      notes:           'Primera investigación del sistema. Referencia conceptual para el Risk Radar.',
      tags:            ['VIX', 'SP500', 'volatilidad', 'fear-greed'],
      archived:        false,
      closedAt:        now,
      createdAt:       now,
      updatedAt:       now,
    },
  },
  {
    id: 'HY_OAS_V1',
    doc: {
      title:           'HY_OAS_V1 — Spreads HY como indicador de estrés de crédito y señal de ciclo',
      hypothesis:      'La ampliación de spreads HY OAS por encima de 500pb predice contracciones económicas con 2-6 meses de antelación y retornos negativos en renta variable en el horizonte de 3-6 meses.',
      signal:          'HY_OAS',
      targetIndicator: 'SP500',
      horizonMonths:   [1, 3, 6, 12],
      periodConfig:    { type: 'MAX' },
      lag:             0,
      transformSignal: 'LEVEL',
      quintiles:       5,
      state:           'INDICATIVA',
      closureVerdict:  null,
      closureNotes:    '',
      closureChecklist: {},
      checklistPct:    0,
      versionCount:    2,
      executionCount:  2,
      notes:           'En análisis. Los resultados preliminares muestran relación negativa robusta pero con problemas de estabilidad post-2020 (QE distorsiona los spreads).',
      tags:            ['HY', 'spread', 'crédito', 'ciclo'],
      archived:        false,
      closedAt:        null,
      createdAt:       now,
      updatedAt:       now,
    },
  },
  {
    id: 'VIX_V1',
    doc: {
      title:           'VIX_V1 — Estructura temporal de volatilidad VIX/VIX3M como timing indicator',
      hypothesis:      'Cuando VIX > VIX3M (estructura invertida = backwardation), el mercado está en estrés agudo y los retornos forward a 1-3 meses tienden a ser superiores a la media histórica (efecto mean-reversion del miedo).',
      signal:          'VIX',
      targetIndicator: 'SP500',
      horizonMonths:   [1, 3, 6],
      periodConfig:    { type: '10Y' },
      lag:             0,
      transformSignal: 'LEVEL',
      quintiles:       5,
      state:           'EN_INVESTIGACION',
      closureVerdict:  null,
      closureNotes:    '',
      closureChecklist: {},
      checklistPct:    0,
      versionCount:    0,
      executionCount:  0,
      notes:           'Extensión de RISK_RADAR_V1 usando la ratio VIX/VIX3M como señal más precisa que el nivel absoluto del VIX. Requiere incorporar VIX3M como indicador en /data. Por ahora usa VIX level como proxy.',
      tags:            ['VIX', 'VIX3M', 'term-structure', 'backwardation'],
      archived:        false,
      closedAt:        null,
      createdAt:       now,
      updatedAt:       now,
    },
  },
];

async function seed() {
  for (const { id, doc } of seeds) {
    const ref = db.collection(COL).doc(id);
    const existing = await ref.get();
    if (existing.exists) {
      console.log(`⚠  ${id} ya existe — saltando (usa --force para sobrescribir)`);
      continue;
    }
    await ref.set(doc);
    console.log(`✓  ${id} creado`);
  }
  console.log('\nSeed completado.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
