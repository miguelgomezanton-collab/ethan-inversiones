#!/usr/bin/env python3
"""
Informe final de validación post-piloto.
Lee /tmp/{TICKER}_c2.json, /tmp/screener_summary.json, /tmp/arch_result.json.
"""
import json

ETFS = ['XBI', 'CIBR', 'SOXX', 'GDX']


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return {}


screener = load('/tmp/screener_summary.json')
arch     = load('/tmp/arch_result.json')
cache    = {t: load(f'/tmp/{t}_c2.json') for t in ETFS}

print()
print("╔══════════════════════════════════════════════════════════════╗")
print("║    INFORME FINAL — VALIDACIÓN POST-PILOTO ETF HOLDINGS      ║")
print("╚══════════════════════════════════════════════════════════════╝")

# Tabla Firestore
print()
print(f"  {'ETF':<6}{'Fuente':<12}{'Fecha':<13}{'Posic.':<8}{'Peso':<7}{'Int.':<5}{'Stale'}")
print("  " + "-" * 55)
for t in ETFS:
    d   = cache[t]
    src = d.get('source', '?')[:10]
    rd  = d.get('referenceDate', '?')
    n   = str(d.get('totalHoldings', '?'))
    w   = f"{d.get('totalWeight', 0):.1f}%"
    ig  = '✅' if d.get('integrityOk') else '❌'
    st  = '⚠️' if d.get('stale') else 'no'
    print(f"  {t:<6}{src:<12}{rd:<13}{n:<8}{w:<7}{ig:<5}{st}")

# Tabla cobertura screener
print()
print(f"  {'ETF':<6}{'Total':<8}{'Analiz.':<10}{'No proc.':<11}{'Cobert.':<10}{'Tickers error'}")
print("  " + "-" * 65)
for t in ETFS:
    s   = screener.get(t, {})
    tot = str(cache[t].get('totalHoldings', '?'))
    ana = str(s.get('analyzable', '?'))
    nop = str(s.get('not_processable', '?'))
    cov = f"{s.get('coverage_pct', 0):.0f}%"
    cok = '✅' if s.get('coverage_ok') else ('⚠️' if s.get('coverage_pct', 0) >= 50 else '❌')
    ft  = str(s.get('not_processable_tickers', []))[:22]
    print(f"  {t:<6}{tot:<8}{ana:<10}{nop:<11}{cok}{cov:<8} {ft}")

# Arquitectura
print()
print("  Arquitectura:")
if arch.get('ok'):
    print(
        f"  ✅ SOXX slug: {arch.get('soxx_slug','?')} | "
        f"/latest-holdings.csv: {arch.get('uses_latest')} | "
        f"SMH refs activas: {arch.get('active_smh_refs', 0)}"
    )
else:
    print(f"  ❌ Errores: {arch.get('errors', [])}")

# Veredicto
print()
all_cache_ok    = all(cache.get(t, {}).get('integrityOk') for t in ETFS)
all_screener_ok = all(screener.get(t, {}).get('coverage_ok', False) for t in ETFS)
arch_ok         = arch.get('ok', False)

if all_cache_ok and all_screener_ok and arch_ok:
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║  🎯 AUTORIZADO PARA PRODUCCIÓN                              ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print("  Siguiente: limpiar debug → merge a main → push → verificar prod")
else:
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║  ⛔ NO AUTORIZADO PARA PRODUCCIÓN                           ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    if not all_cache_ok:
        print("  ❌ Firestore: integridad KO en algún ETF")
    if not all_screener_ok:
        print("  ❌ Screener: cobertura Yahoo Finance insuficiente")
    if not arch_ok:
        print("  ❌ Arquitectura: configuración incorrecta")

print("  ⛔ main NO modificado — pendiente de autorización explícita")
