// test-holdings-pilot.mjs
// Prueba piloto de los adapters de holdings
// Ejecutar: node test-holdings-pilot.mjs
//
// ETFs piloto: XBI (SPDR), CIBR (First Trust), SMH (VanEck), GDX (VanEck)
// No usa Firestore ni backend Vercel — prueba los adapters directamente.
//
// Resultados esperados:
//   XBI:  SPDR XLSX, ~180 posiciones, peso ~100%
//   CIBR: First Trust HTML, ~25-40 posiciones, ticker CIBR verificado
//   SMH:  VanEck HTML, ~25-30 posiciones
//   GDX:  VanEck HTML, ~40-55 posiciones, tickers internacionales normalizados

import * as spdr       from './server/etf-holdings/sources/spdr.js';
import * as firsttrust from './server/etf-holdings/sources/firsttrust.js';
import * as vaneck     from './server/etf-holdings/sources/vaneck.js';
import { normalizeInternationalTicker } from './server/etf-holdings/sources/vaneck.js';

const PILOT = [
  { ticker: 'XBI',  adapter: spdr,       label: 'SPDR/SSGA' },
  { ticker: 'CIBR', adapter: firsttrust, label: 'First Trust' },
  { ticker: 'SMH',  adapter: vaneck,     label: 'VanEck' },
  { ticker: 'GDX',  adapter: vaneck,     label: 'VanEck' },
];

const TIMEOUT_MS = 30000;

async function testOne({ ticker, adapter, label }) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🔍 ${ticker} [${label}]`);
  console.log(`${'─'.repeat(60)}`);

  const start = Date.now();
  try {
    const result = await Promise.race([
      adapter.fetchHoldings(ticker),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout ${TIMEOUT_MS}ms`)), TIMEOUT_MS)),
    ]);

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`✅ OK en ${elapsed}s`);
    console.log(`   Fuente:        ${result.source}`);
    console.log(`   Fecha ref:     ${result.referenceDate}`);
    console.log(`   Posiciones:    ${result.totalHoldings} accionarias + ${result.cashRows} cash/excluidas`);
    console.log(`   Peso total:    ${result.totalWeight.toFixed(2)}%`);
    console.log(`   URL:           ${result.sourceUrl}`);

    // Mostrar top 5 holdings
    const top5 = result.holdings.slice(0, 5);
    console.log(`\n   Top 5 holdings:`);
    top5.forEach((h, i) => {
      const orig = h.originalTicker && h.originalTicker !== h.ticker ? ` (orig: ${h.originalTicker})` : '';
      console.log(`     ${i+1}. ${h.ticker.padEnd(12)}${h.weight?.toFixed(2).padStart(6)}%  ${h.name?.substring(0, 30)}${orig}`);
    });

    // Para GDX: verificar normalización de tickers internacionales
    if (ticker === 'GDX') {
      const intlHoldings = result.holdings.filter(h => h.originalTicker && h.originalTicker !== h.ticker);
      const nullHoldings  = result.holdings.filter(h => h.ticker === null);
      console.log(`\n   Normalización internacional:`);
      console.log(`     Tickers normalizados: ${intlHoldings.length}`);
      console.log(`     Tickers sin mapping:  ${nullHoldings.length}`);
      if (intlHoldings.length > 0) {
        console.log(`     Ejemplos: ${intlHoldings.slice(0, 3).map(h => `${h.originalTicker}→${h.ticker}`).join(', ')}`);
      }
    }

    // Para CIBR: verificar que NO es QTEC
    if (ticker === 'CIBR') {
      const hasQTEC = result.holdings.some(h => h.ticker === 'QTEC');
      console.log(`\n   Verificación identidad CIBR: ${hasQTEC ? '❌ FALLO — contiene QTEC como componente (sospechoso)' : '✅ OK — no contiene QTEC como componente'}`);
    }

    // Integridad de pesos
    const integrityOk = result.totalWeight > 80;
    console.log(`\n   Integridad: ${integrityOk ? '✅' : '⚠️'} peso ${result.totalWeight.toFixed(1)}% (umbral >80%)`);

    return {
      ticker,
      ok:            true,
      posiciones:    result.totalHoldings,
      cashExcluidas: result.cashRows,
      peso:          result.totalWeight,
      fecha:         result.referenceDate,
      integrityOk,
      elapsed,
    };
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`❌ ERROR en ${elapsed}s: ${err.message}`);
    return { ticker, ok: false, error: err.message, elapsed };
  }
}

// Test unitario de normalización de tickers internacionales
function testTickerNormalization() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log('🧪 Test de normalización de tickers internacionales');
  console.log(`${'═'.repeat(60)}`);

  const cases = [
    ['NST AU',      'NST.AX',   'AuSE Australian'],
    ['EDV LN',      'EDV.L',    'LSE London'],
    ['LUG CN',      'LUG.TO',   'TSX Toronto'],
    ['2259 HK',     '2259.HK',  'HKEX Hong Kong'],
    ['GFI SJ',      'GFI',      'JSE → ADR NYSE'],
    ['PE&OLES* MM', null,        'BMV México sin equivalente'],
    ['GOLD',        'GOLD',     'US ticker sin cambio'],
    ['NEM',         'NEM',      'US ticker sin cambio'],
    ['BTG',         'BTG',      'US ticker sin cambio'],
  ];

  let passed = 0;
  for (const [input, expected, label] of cases) {
    const result = normalizeInternationalTicker(input, 'GDX_TEST');
    const ok     = result === expected;
    console.log(`  ${ok ? '✅' : '❌'} "${input}" → "${result}" (esperado: "${expected}") [${label}]`);
    if (ok) passed++;
  }
  console.log(`\n  Resultado: ${passed}/${cases.length} casos OK`);
}

// Tabla resumen al final
function printSummary(results) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log('📊 TABLA RESUMEN — PILOTO 4 ETFs');
  console.log(`${'═'.repeat(70)}`);
  console.log(`${'ETF'.padEnd(8)} ${'Estado'.padEnd(10)} ${'Posic.'.padEnd(8)} ${'Excluidas'.padEnd(10)} ${'Peso%'.padEnd(8)} ${'Fecha'.padEnd(12)} ${'Tiempo'}`);
  console.log('─'.repeat(70));
  for (const r of results) {
    if (r.ok) {
      const intgr = r.integrityOk ? '✅' : '⚠️';
      console.log(`${r.ticker.padEnd(8)} ${'✅ OK'.padEnd(10)} ${String(r.posiciones).padEnd(8)} ${String(r.cashExcluidas).padEnd(10)} ${r.peso.toFixed(1).padEnd(8)} ${r.fecha.padEnd(12)} ${r.elapsed}s ${intgr}`);
    } else {
      console.log(`${r.ticker.padEnd(8)} ${'❌ FALLO'.padEnd(10)} ${r.error?.substring(0, 45)}`);
    }
  }
  console.log('═'.repeat(70));
}

// Main
async function main() {
  console.log('═'.repeat(60));
  console.log('🚀 ETHAN — Prueba piloto adapters holdings ETF');
  console.log(`   Fecha: ${new Date().toISOString()}`);
  console.log('═'.repeat(60));

  // Test normalización (sin red)
  testTickerNormalization();

  // Test descargas reales
  console.log(`\n${'═'.repeat(60)}`);
  console.log('🌐 Tests de descarga real (requiere red)');
  console.log('═'.repeat(60));

  const results = [];
  for (const pilot of PILOT) {
    const r = await testOne(pilot);
    results.push(r);
    // Pausa entre requests para no saturar
    if (pilot !== PILOT[PILOT.length - 1]) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  printSummary(results);

  const allOk = results.every(r => r.ok);
  console.log(`\n${allOk ? '✅ PILOTO COMPLETADO — todos los adapters funcionan' : '⚠️  PILOTO CON FALLOS — revisar errores arriba'}`);
  process.exit(allOk ? 0 : 1);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
