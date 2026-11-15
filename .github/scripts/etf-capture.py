#!/usr/bin/env python3
"""
ETF Data Capture — genera informe detallado de cobertura por ETF.
Requiere: BASE_URL y BYPASS en env.
"""
import os
import sys
import json
import urllib.request
import urllib.error

BASE_URL = os.environ.get("BASE_URL", "https://ethan-inversiones.vercel.app")
BYPASS   = os.environ.get("BYPASS", "")

TICKERS = [
    # Validación específica solicitada
    "FDN", "REMX", "ARKG", "KBWB", "PBS", "COPX",
    # Problemáticos anteriores
    "IHI", "PHO", "IBUY",
    # Muestra representativa por fuente
    "SKYY", "FCG", "ESPO",
    # iShares varios
    "IBB", "IHE", "IHF", "ITA", "SOXX",
    # VanEck / Invesco / State Street
    "REMX", "MOO", "NLR", "LIT", "GDX", "URA", "SIL", "GUNR",
    # Sector industrial/materiales
    "XME", "COPX", "SLX", "AMLP", "OIH",
    # Resto representativo
    "VNQ", "REET", "REM", "XRT", "XBI", "AIQ", "BOTZ",
    "CIBR", "IGV", "ITB", "IYG", "IYT", "IYZ",
    "AIRR", "CARZ", "DTCR", "FINX",
    "FSTA", "GRID", "ICLN", "JETS",
    "KCE", "KIE", "KRE",
    "PBJ", "PAVE", "PEJ", "PSP",
    "QTUM", "SOCL", "SOXX", "TAN", "XAR", "XOP",
    "BIZD", "FIW",
]

# Deduplicar manteniendo orden
seen = set()
TICKERS_UNIQ = []
for t in TICKERS:
    if t not in seen:
        seen.add(t)
        TICKERS_UNIQ.append(t)

results = []
errors  = []

print(f"Consultando {len(TICKERS_UNIQ)} ETFs contra {BASE_URL}\n")
print(f"{'ETF':<8} {'Total':>7} {'c/Tick':>7} {'s/Tick':>7} {'Cob%':>6}  {'Fuente':<10}  {'Fecha efectiva':<14}  {'ETHAN'}")
print("-" * 85)

for ticker in TICKERS_UNIQ:
    url = f"{BASE_URL}/api/macro-rlab/etf-holdings?ticker={ticker}"
    req = urllib.request.Request(url, headers={"x-vercel-protection-bypass": BYPASS})

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        errors.append(f"{ticker}: HTTP {e.code}")
        print(f"{ticker:<8} {'ERROR HTTP '+str(e.code):>50}")
        continue
    except Exception as e:
        errors.append(f"{ticker}: {e}")
        print(f"{ticker:<8} {'ERROR: '+str(e)[:40]:>50}")
        continue

    if not data.get("ok", True) and "error" in data:
        errors.append(f"{ticker}: {data['error']}")
        print(f"{ticker:<8} {'FAIL: '+data['error'][:60]}")
        continue

    holdings    = data.get("holdings", [])
    total       = len(holdings)
    con_ticker  = sum(1 for h in holdings if h.get("ticker") and h.get("ticker") != "null")
    sin_ticker  = total - con_ticker
    cobertura   = round(con_ticker / total * 100, 1) if total > 0 else 0.0
    source      = data.get("source", "unknown")
    fecha       = data.get("effectiveDate", data.get("referenceDate", "N/A"))
    ethan_ok    = "✅ SI" if con_ticker > 0 else "❌ NO"

    print(f"{ticker:<8} {total:>7} {con_ticker:>7} {sin_ticker:>7} {cobertura:>5.1f}%  {source:<10}  {str(fecha)[:14]:<14}  {ethan_ok}")
    results.append({
        "ticker": ticker, "total": total, "con_ticker": con_ticker,
        "sin_ticker": sin_ticker, "cobertura": cobertura,
        "source": source, "fecha": fecha, "ok": con_ticker > 0,
    })

print()
print("=" * 85)
ok_count   = sum(1 for r in results if r["ok"])
fail_count = len(results) - ok_count
print(f"RESULTADO: {ok_count}/{len(results)} ETFs con cobertura válida")
if errors:
    print(f"\nERRORES ({len(errors)}):")
    for e in errors:
        print(f"  - {e}")

if fail_count > 0:
    sys.exit(1)
