#!/usr/bin/env python3
"""
Informe final del smoke test de produccion.
Lee /tmp/screener_summary.json y /tmp/arch_result.json.
"""
import json
import os
import sys

print("")
print("================================================")
print("  RESULTADO SMOKE TEST PRODUCCION")
print("================================================")
print("")

# Screener
if os.path.exists('/tmp/screener_summary.json'):
    d = json.load(open('/tmp/screener_summary.json'))
    print("Screener ETHAN - cobertura Yahoo Finance:")
    for etf, r in d.items():
        icon = "OK  " if r['coverage_ok'] else "FAIL"
        print(
            f"  [{icon}] {etf}: {r['coverage_pct']}%"
            f" ({r['analyzable']}/{r['sample']} analizables"
            f" de {r['total_holdings']} posiciones)"
        )
else:
    print("  [SKIP] screener_summary.json no encontrado")

print("")

# Arquitectura
if os.path.exists('/tmp/arch_result.json'):
    d = json.load(open('/tmp/arch_result.json'))
    print("Arquitectura:")
    print(f"  SOXX en fetcher.js : {d['soxx_in_fetcher']}")
    print(f"  SMH en fetcher.js  : {d['smh_in_fetcher']}")
    print(f"  Slug SOXX          : {d['soxx_slug']}")
    print(f"  Refs activas SMH   : {d['active_smh_refs']}")
    if d.get('errors'):
        for e in d['errors']:
            print(f"  ERROR: {e}")
else:
    print("  [SKIP] arch_result.json no encontrado")

print("")
