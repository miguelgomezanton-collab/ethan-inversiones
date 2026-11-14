#!/usr/bin/env python3
"""
Verifica documentos Firestore de etf_holdings_cache.
Lee /tmp/{TICKER}_c2.json (ya descargados por el step anterior).
"""
import json
import sys

ETFS = ['XBI', 'CIBR', 'SOXX', 'GDX']

results = {}
for t in ETFS:
    try:
        with open(f'/tmp/{t}_c2.json') as f:
            d = json.load(f)
        results[t] = d
    except Exception as e:
        results[t] = {'ok': False, 'error': str(e)}

print(f"\n{'ETF':<6}{'Fuente':<14}{'Fecha ref.':<16}{'Posic.':<8}{'Peso':<8}{'Integr.':<8}{'Stale'}")
print("-" * 70)

all_ok = True
for t in ETFS:
    d = results[t]
    n   = d.get('totalHoldings', '?')
    w   = f"{d.get('totalWeight', 0):.1f}%"
    ig  = '✅' if d.get('integrityOk') else '❌'
    st  = '⚠️' if d.get('stale') else 'no'
    src = d.get('source', '?')[:12]
    rd  = d.get('referenceDate', '?')
    print(f"{t:<6}{src:<14}{rd:<16}{str(n):<8}{w:<8}{ig:<8}{st}")
    if not d.get('ok') or not d.get('integrityOk'):
        print(f"       ERROR: {d.get('error', 'integridad KO')}")
        all_ok = False

soxx = results.get('SOXX', {})
actual_ticker = soxx.get('ticker', '?')
print(f"\n  SOXX ticker field: '{actual_ticker}' (esperado: SOXX)")
if actual_ticker != 'SOXX':
    print("  ❌ ticker inesperado — posible referencia a SMH")
    all_ok = False
else:
    print("  ✅ SOXX confirmado (no SMH)")

docs_ok = sum(1 for d in results.values() if d.get('ok') and d.get('integrityOk'))
print(f"\n  Documentos Firestore válidos: {docs_ok}/4")

for t in ETFS:
    note = results[t].get('integrityNote', '')
    if note:
        print(f"  {t}: {note}")

if not all_ok or docs_ok < 4:
    print("\n❌ Firestore: algún documento con error o integridad KO")
    sys.exit(1)

print("\n✅ Firestore OK — 4/4 documentos válidos en etf_holdings_cache")
