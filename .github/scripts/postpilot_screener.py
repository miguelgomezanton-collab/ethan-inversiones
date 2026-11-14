#!/usr/bin/env python3
"""
Verifica cobertura Yahoo Finance para los componentes de cada ETF.
Lee /tmp/{TICKER}_full.json y escribe /tmp/screener_summary.json.
"""
import json
import sys
import time
import urllib.request

ETF_CONFIG = {
    'XBI':  {'sample': 10,   'min_cov': 80},
    'CIBR': {'sample': 10,   'min_cov': 80},
    'SOXX': {'sample': None, 'min_cov': 80},
    'GDX':  {'sample': 20,   'min_cov': 60},
}


def check_yahoo(ticker, timeout=8):
    try:
        url = (
            f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
            "?interval=1d&range=5d"
        )
        req = urllib.request.Request(
            url, headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
            result = data.get('chart', {}).get('result', [])
            return bool(result and result[0].get('meta', {}).get('symbol'))
    except Exception:
        return False


summary = {}
all_ok = True

for etf, cfg in ETF_CONFIG.items():
    with open(f'/tmp/{etf}_full.json') as f:
        d = json.load(f)

    holdings = sorted(
        d.get('holdings', []),
        key=lambda h: h.get('weight', 0),
        reverse=True
    )
    if cfg['sample']:
        holdings = holdings[:cfg['sample']]

    tickers = [h['ticker'] for h in holdings]
    print(f"\n  {etf} — testando {len(tickers)} tickers: {tickers}")

    ok, fail = [], []
    for t in tickers:
        if check_yahoo(t):
            ok.append(t)
        else:
            fail.append(t)
        time.sleep(0.35)

    n = len(tickers)
    cov = len(ok) / n * 100 if n else 0
    cov_ok = cov >= cfg['min_cov']
    icon = '✅' if cov_ok else '❌'

    print(f"  {icon} Cobertura: {cov:.0f}% ({len(ok)}/{n})")
    if fail:
        print(f"  ⚠️  No procesables: {fail}")

    summary[etf] = {
        'total_holdings':         d.get('totalHoldings', 0),
        'sample':                 n,
        'analyzable':             len(ok),
        'not_processable':        len(fail),
        'not_processable_tickers': fail,
        'coverage_pct':           round(cov, 1),
        'coverage_ok':            cov_ok,
    }
    if not cov_ok:
        all_ok = False

with open('/tmp/screener_summary.json', 'w') as f:
    json.dump(summary, f)

if not all_ok:
    print("\n❌ Cobertura insuficiente en algún ETF")
    sys.exit(1)

print("\n✅ Screener ETHAN — cobertura Yahoo Finance aceptable en todos los ETFs")
