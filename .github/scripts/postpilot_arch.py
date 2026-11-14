#!/usr/bin/env python3
"""
Verifica arquitectura: SOXX como ETF principal de semiconductores,
sin referencias activas a SMH, slug correcto, URL /latest-holdings.csv.
Escribe /tmp/arch_result.json.
"""
import json
import re
import subprocess
import sys

# 1) Referencias a SMH en archivos del módulo ETF-holdings (server/etf-holdings/)
#    Los módulos de sectores (rv-sectores.js) y VanEck (vaneck.js) pueden usar SMH
#    legítimamente — el check es que el ROUTER (fetcher.js) no lo incluya.
#    Buscamos SMH solo en los archivos que gestionan el subsistema de holdings.
smh_grep = subprocess.run(
    ['grep', '-rn', 'SMH', 'server/etf-holdings/'],
    capture_output=True, text=True
)
# Excluir: vaneck.js (SMH es ETF VanEck válido), líneas comentadas
active_smh = [
    line for line in smh_grep.stdout.splitlines()
    if not any(c in line for c in ['//#', '// ', '/*', 'vaneck.js'])
    and 'node_modules' not in line
    # 'fetcher.js' se analiza por separado en check 2
    and 'fetcher.js' not in line
]

print(f"  Referencias SMH en etf-holdings/ (excl. vaneck.js, fetcher.js): {len(active_smh)}")
for line in active_smh[:5]:
    print(f"    {line}")

# 2) SOXX en fetcher.js
with open('server/etf-holdings/fetcher.js') as f:
    fetcher = f.read()
soxx_in_fetcher = "'SOXX'" in fetcher
smh_in_fetcher  = "'SMH'"  in fetcher
print(f"\n  fetcher.js — SOXX presente: {soxx_in_fetcher}")
print(f"  fetcher.js — SMH presente:  {smh_in_fetcher}")

# 3) Slug SOXX e URL en ishares.js
with open('server/etf-holdings/sources/ishares.js') as f:
    ishares = f.read()
slug_match = re.search(r"SOXX[^}]{0,80}?'([a-z][a-z-]+)'", ishares)
soxx_slug  = slug_match.group(1) if slug_match else '?'
uses_latest = '/latest-holdings.csv' in ishares
print(f"\n  ishares.js — SOXX slug: {soxx_slug}")
print(f"  ishares.js — /latest-holdings.csv: {uses_latest}")

# 4) Validar
errors = []
if active_smh:
    errors.append(f"{len(active_smh)} referencias activas a SMH")
if not soxx_in_fetcher:
    errors.append("SOXX no en fetcher.js")
if smh_in_fetcher:
    errors.append("SMH todavía en fetcher.js")
if 'ishares-phlx' in soxx_slug:
    errors.append(f"Slug incorrecto: {soxx_slug}")
if not uses_latest:
    errors.append("ishares.js no usa /latest-holdings.csv")

arch_ok = len(errors) == 0

result = {
    'ok':              arch_ok,
    'soxx_slug':       soxx_slug,
    'uses_latest':     uses_latest,
    'soxx_in_fetcher': soxx_in_fetcher,
    'smh_in_fetcher':  smh_in_fetcher,
    'active_smh_refs': len(active_smh),
    'errors':          errors,
}
with open('/tmp/arch_result.json', 'w') as f:
    json.dump(result, f)

if errors:
    print(f"\n❌ Arquitectura:")
    for e in errors:
        print(f"   - {e}")
    sys.exit(1)

print(f"\n✅ Arquitectura OK")
