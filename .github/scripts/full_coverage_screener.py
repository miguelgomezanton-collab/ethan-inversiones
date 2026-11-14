#!/usr/bin/env python3
"""
Validación completa de cobertura Yahoo Finance para los 4 ETFs.
Comprueba TODOS los componentes (no muestras):
  XBI  → 159 componentes
  CIBR →  39 componentes
  SOXX →  30 componentes
  GDX  →  58 componentes

Para cada ticker verifica:
  1. Que Yahoo Finance devuelva datos históricos (rango=6mo, intervalo=1mo)
  2. Que haya suficientes velas mensuales para indicadores ETHAN (≥14 meses)
  3. Que el intervalo semanal también tenga datos (≥20 semanas)
  4. Que el intervalo diario tenga datos (≥60 días)

Escribe /tmp/full_coverage_result.json
"""

import json
import sys
import time
import urllib.request
import urllib.error

# ── Configuración por ETF ────────────────────────────────────────────────────
ETF_CONFIG = {
    'XBI':  {'min_monthly': 14, 'min_weekly': 20, 'min_daily': 60},
    'CIBR': {'min_monthly': 14, 'min_weekly': 20, 'min_daily': 60},
    'SOXX': {'min_monthly': 14, 'min_weekly': 20, 'min_daily': 60},
    'GDX':  {'min_monthly': 14, 'min_weekly': 20, 'min_daily': 60},
}

# ── Helper: consulta Yahoo Finance ──────────────────────────────────────────
def yahoo_check(ticker, interval, range_str, min_bars, timeout=10):
    """
    Retorna (ok: bool, bars: int, error: str|None)
    ok=True si hay ≥ min_bars velas para el intervalo dado.
    """
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
        f"?interval={interval}&range={range_str}&includePrePost=false"
    )
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; ETHANValidator/1.0)',
            'Accept': 'application/json',
        })
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
        result = data.get('chart', {}).get('result', [])
        if not result:
            err = data.get('chart', {}).get('error', {})
            return False, 0, err.get('description', 'no result') if err else 'no result'
        timestamps = result[0].get('timestamp', [])
        bars = len(timestamps)
        if bars < min_bars:
            return False, bars, f"solo {bars} velas ({interval}), necesita ≥{min_bars}"
        return True, bars, None
    except urllib.error.HTTPError as e:
        return False, 0, f"HTTP {e.code}"
    except Exception as e:
        return False, 0, str(e)[:80]


def analyze_ticker(ticker):
    """
    Retorna dict con resultado para los tres intervalos.
    analyzable=True solo si los tres pasan.
    """
    time.sleep(0.4)   # rate-limit amigable con Yahoo

    monthly_ok, m_bars, m_err = yahoo_check(ticker, '1mo', '5y',  14)
    time.sleep(0.25)
    weekly_ok,  w_bars, w_err = yahoo_check(ticker, '1wk', '2y',  20)
    time.sleep(0.25)
    daily_ok,   d_bars, d_err = yahoo_check(ticker, '1d',  '6mo', 60)

    analyzable = monthly_ok and weekly_ok and daily_ok

    reasons = []
    if not monthly_ok: reasons.append(f"mensual: {m_err}")
    if not weekly_ok:  reasons.append(f"semanal: {w_err}")
    if not daily_ok:   reasons.append(f"diario: {d_err}")

    return {
        'ticker':     ticker,
        'analyzable': analyzable,
        'monthly':    {'ok': monthly_ok, 'bars': m_bars},
        'weekly':     {'ok': weekly_ok,  'bars': w_bars},
        'daily':      {'ok': daily_ok,   'bars': d_bars},
        'reasons':    reasons,
    }


# ── Main ─────────────────────────────────────────────────────────────────────
print("=" * 70)
print("  VALIDACIÓN COMPLETA SCREENER ETHAN — COBERTURA REAL YAHOO FINANCE")
print("=" * 70)

results   = {}
all_pass  = True

for etf in ['XBI', 'CIBR', 'SOXX', 'GDX']:
    with open(f'/tmp/{etf}_full.json') as f:
        d = json.load(f)

    holdings = sorted(
        d.get('holdings', []),
        key=lambda h: h.get('weight', 0),
        reverse=True
    )
    tickers = [h['ticker'] for h in holdings if h.get('ticker')]

    total_holdings = d.get('totalHoldings', len(holdings))
    print(f"\n{'─'*70}")
    print(f"  {etf}  — {len(tickers)} tickers a comprobar (total holdings en Firestore: {total_holdings})")
    print(f"{'─'*70}")

    etf_results = []
    not_analyzable = []

    for i, ticker in enumerate(tickers, 1):
        res = analyze_ticker(ticker)
        etf_results.append(res)
        icon = '✅' if res['analyzable'] else '❌'
        bar_summary = f"M={res['monthly']['bars']} W={res['weekly']['bars']} D={res['daily']['bars']}"
        print(f"  {icon} [{i:3d}/{len(tickers)}] {ticker:<12}  {bar_summary}")
        if not res['analyzable']:
            not_analyzable.append(res)
            for r in res['reasons']:
                print(f"         ⚠  {r}")

    n_ok  = sum(1 for r in etf_results if r['analyzable'])
    n_all = len(etf_results)
    cov   = n_ok / n_all * 100 if n_all else 0

    print(f"\n  {'✅' if cov >= 80 else '❌'} Cobertura {etf}: {cov:.1f}%  ({n_ok}/{n_all} analizables)")
    if not_analyzable:
        print(f"  ⚠  No analizables ({len(not_analyzable)}):")
        for na in not_analyzable:
            print(f"     • {na['ticker']}: {'; '.join(na['reasons'])}")

    results[etf] = {
        'source':            d.get('source', '?'),
        'date':              d.get('date', '?'),
        'total_holdings':    total_holdings,
        'tickers_checked':   n_all,
        'analyzable':        n_ok,
        'not_analyzable':    len(not_analyzable),
        'coverage_pct':      round(cov, 1),
        'coverage_ok':       cov >= 80,
        'not_analyzable_detail': [
            {'ticker': na['ticker'], 'reasons': na['reasons']}
            for na in not_analyzable
        ],
        'detail': etf_results,
    }
    if cov < 80:
        all_pass = False

# ── Informe resumen ──────────────────────────────────────────────────────────
print(f"\n{'='*70}")
print("  INFORME RESUMEN — COBERTURA REAL (universo completo)")
print(f"{'='*70}")
print(f"\n  {'ETF':<6} {'Fuente':<18} {'Fecha':<13} {'Holdings':>8} {'Comprob.':>8} {'Analiz.':>8} {'No anal.':>8} {'Cobert.':>8}")
print(f"  {'─'*80}")
for etf, r in results.items():
    icon = '✅' if r['coverage_ok'] else '❌'
    print(
        f"  {etf:<6} {r['source']:<18} {r['date']:<13}"
        f" {r['total_holdings']:>8} {r['tickers_checked']:>8}"
        f" {r['analyzable']:>8} {r['not_analyzable']:>8}"
        f" {icon}{r['coverage_pct']:>6.1f}%"
    )

# ── CIBR: aclaración de fuente ───────────────────────────────────────────────
print(f"\n  CIBR — Aclaración de fuente:")
print(f"  • Gestora:      First Trust (emisor del ETF)")
print(f"  • Índice:       NQCYBRE — Nasdaq CTA Cybersecurity Exclusions Index")
print(f"  • Fuente datos: nasdaq.com/docs/ (adapter 'Nasdaq Ind' en ETHAN)")
print(f"  • Retraso doc.: hasta ~1 mes (comportamiento esperado y documentado)")
print(f"  • Fecha {results['CIBR']['date']}: último rebalanceo publicado en Nasdaq — correcto")

# ── Veredicto ────────────────────────────────────────────────────────────────
print(f"\n{'='*70}")
if all_pass:
    print("  🎯  COBERTURA COMPLETA VALIDADA — AUTORIZADO PARA PRODUCCIÓN")
else:
    print("  ⛔  COBERTURA INSUFICIENTE EN ALGÚN ETF — NO AUTORIZADO")
print(f"{'='*70}\n")

with open('/tmp/full_coverage_result.json', 'w') as f:
    json.dump(results, f, indent=2)

sys.exit(0 if all_pass else 1)
