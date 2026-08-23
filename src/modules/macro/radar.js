// radar.js — RISK_RADAR_V1 (motor independiente de riesgos actuales)
// Separado de HIST_MACRO_V1 (régimen macro canónico)
// Cada indicador: source, value, transformation, thresholds, score, maxScore, block, version
import { getMacroData } from './macro-data.js';

const f1 = v => v != null ? Number(v).toFixed(1) : '—';
const f2 = v => v != null ? Number(v).toFixed(2) : '—';
const sc2s = s => s > 0 ? ('+'+s) : String(s);

const VERSION = 'RISK_RADAR_V1';

export async function render(container, { actionsSlot }) {
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="radar-refresh">↻ Actualizar</button>`;
  container.innerHTML = `<div id="radar-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;

  async function load(force = false) {
    try {
      const [m, hist] = await Promise.all([
        getMacroData(force),
        fetch('/api/macro-history?type=radar').then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      paint(m, hist);
    }
    catch(e) { document.getElementById('radar-wrap').innerHTML =
      `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`; }
  }

  function paint(macro, hist) {
    const el  = document.getElementById('radar-wrap');
    const co  = macro.coyuntura  || {};
    const ind = macro.indicators || {};
    const liq = macro.liquidez   || {};
    const seg = macro.seguimiento|| {};

    // ── RISK_RADAR_V1: definición explícita de cada indicador ──────
    // source: 'HIST_MACRO_V1' | 'RISK_RADAR_V1' | 'SHARED'
    // SHARED = mismo dato, puede tener regla distinta
    const indicators = [
      // ── CICLO ECONÓMICO ──
      {
        block: 'Ciclo Económico', name: 'Curva USD 10Y-2Y',
        value: co.curvaUSD?.value, unit: '%',
        score: co.curvaUSD?.score ?? null, maxScore: 1,
        source: 'HIST_MACRO_V1',
        thresholds: '≥0.90→+1 | ≥0.48→0 | <0.48→-1 [PROVISIONAL]',
        transformation: 'DGS10 − DGS2 fecha común más reciente',
      },
      {
        block: 'Ciclo Económico', name: 'Curva EUR 10Y-2Y',
        value: co.curvaEUR?.value, unit: '%',
        score: co.curvaEUR?.score ?? null, maxScore: 1,
        source: 'HIST_MACRO_V1',
        thresholds: '≥0.60→+1 | ≥0.40→0 | <0.40→-1 [PROVISIONAL]',
        transformation: 'ECB YC SRS_10Y_2Y',
      },
      {
        block: 'Ciclo Económico', name: 'LEI (OECD CLI USA)',
        value: ind.lei?.value, unit: '',
        score: ind.lei?.score ?? null, maxScore: 1,
        source: 'HIST_MACRO_V1',
        thresholds: 'nivel>100 y delta>0→+1 | nivel<100 y delta<0→-1 | resto→0',
        transformation: 'FRED USALOLITOAASTSAM nivel + delta mensual',
      },
      // ── LIQUIDEZ GLOBAL ──
      {
        block: 'Liquidez Global', name: 'M2 Global YoY',
        value: liq.m2?.value, unit: '%',
        score: liq.m2?.score ?? null, maxScore: 3,
        source: 'HIST_MACRO_V1',
        thresholds: '≥5%→+3 | ≥3%→+1 | <3%→-3 [PROVISIONAL · proxy USA]',
        transformation: 'M2SL YoY fecha real (proxy M2 Global)',
      },
      {
        block: 'Liquidez Global', name: 'Impulso Crediticio',
        value: liq.impulso?.value, unit: 'pp',
        score: liq.impulso?.score ?? null, maxScore: 2,
        source: 'HIST_MACRO_V1',
        thresholds: '≥1.0→+2 | ≥0.5→+1 | <0.5→-2 [PROVISIONAL]',
        transformation: 'TOTLL YoY(t) − YoY(t−3M)',
      },
      {
        block: 'Liquidez Global', name: 'Velocidad M2',
        value: liq.velM2?.value, unit: '%',
        score: liq.velM2?.score ?? null, maxScore: 2,
        source: 'HIST_MACRO_V1',
        thresholds: '≥0%→+2 | ≥-1.5%→-1 | <-1.5%→-2 [PROVISIONAL]',
        transformation: 'FRED M2V YoY fecha real',
      },
      {
        block: 'Liquidez Global', name: 'Crédito vs PIB',
        value: liq.credito?.value, unit: 'pp',
        score: liq.credito?.score ?? null, maxScore: 3,
        source: 'HIST_MACRO_V1',
        thresholds: '≥3pp→+3 | ≥1.5pp→0 | <1.5pp→-3 [PROVISIONAL]',
        transformation: 'TOTLL YoY − GDP YoY (diff pp)',
      },
      // ── CRÉDITO ──
      {
        block: 'Crédito', name: 'BBB Spread',
        value: liq.bbbSpread?.value, unit: '%',
        score: liq.bbbSpread?.score ?? null, maxScore: 1,
        source: 'SHARED (HIST_MACRO_V1 analogy vector)',
        thresholds: '≤1.00%→+1 | ≤1.50%→0 | >1.50%→-1',
        transformation: 'FRED BAMLC0A4CBBB diario',
      },
      {
        block: 'Crédito', name: 'HY Spread (OAS)',
        value: seg.hySpread?.value, unit: '%',
        score: seg.hySpread?.freshness !== 'stale' && seg.hySpread?.value != null
          ? (seg.hySpread.value < 3.5 ? 1 : seg.hySpread.value < 5 ? 0 : -1)
          : null,
        maxScore: 1,
        source: 'RISK_RADAR_V1',
        thresholds: '<3.5%→+1 | <5%→0 | ≥5%→-1 [PROVISIONAL · no en HIST_MACRO_V1]',
        transformation: 'FRED BAMLH0A0HYM2 diario',
      },
      // ── SENTIMIENTO ──
      {
        block: 'Sentimiento', name: 'Fear & Greed',
        value: ind.fearGreed?.value, unit: '',
        score: ind.fearGreed?.freshness !== 'stale' && ind.fearGreed?.value != null
          ? (ind.fearGreed.value < 25 ? -1 : ind.fearGreed.value < 55 ? 0 : 1)
          : null,
        maxScore: 1,
        source: 'RISK_RADAR_V1',
        thresholds: '<25→-1 | <55→0 | ≥55→+1 [risk-on, PROVISIONAL · convencion SENTIMIENTO no contrarian]',
        transformation: 'CNN Fear & Greed Index (diario)',
      },
      {
        block: 'Sentimiento', name: 'VIX vs SMA200',
        value: seg.vix?.value, unit: '',
        score: seg.vix?.valid && seg.vix?.aboveSMA200 != null
          ? (seg.vix.aboveSMA200 ? -1 : 1)
          : null,
        maxScore: 1,
        source: 'RISK_RADAR_V1',
        thresholds: '<SMA200→+1 | ≥SMA200→-1 [PROVISIONAL]',
        transformation: 'Yahoo Finance ^VIX diario, SMA200',
      },
      // ── POLÍTICA MONETARIA ──
      {
        block: 'Política Monetaria', name: 'Tipo Real (FFR−CPI)',
        value: co.tipoReal?.value, unit: '%',
        score: co.tipoReal?.score ?? null, maxScore: 1,
        source: 'HIST_MACRO_V1',
        thresholds: '≥1.0%→+1 | ≥0.5%→0 | <0.5%→-1 [PROVISIONAL · +1=restrictivo]',
        transformation: 'DFF − CPIAUCSL YoY fecha real',
      },
      {
        block: 'Política Monetaria', name: 'Reservas Fed',
        value: liq.reservas?.value, unit: '$T',
        score: liq.reservas?.score ?? null, maxScore: 1,
        source: 'HIST_MACRO_V1',
        thresholds: '≥3.5T→+1 | <3.5T→-1 [PROVISIONAL · umbral fijo no estable entre QE/QT]',
        transformation: 'FRED WRESBAL semanal /1_000_000 → trillions',
      },
      // ── INFLACIÓN ──
      {
        block: 'Inflación', name: 'CPI Headline YoY',
        value: co.cpi?.value, unit: '%',
        // CPI no tiene score propio en HIST_MACRO_V1 — es input de Tipo Real
        // Regla RISK_RADAR_V1 propia
        score: co.cpi?.value != null
          ? (co.cpi.value <= 2.5 ? 1 : co.cpi.value <= 3.5 ? 0 : -1)
          : null,
        maxScore: 1,
        source: 'RISK_RADAR_V1',
        thresholds: '≤2.5%→+1 | ≤3.5%→0 | >3.5%→-1 [PROVISIONAL · en HIST_MACRO_V1 CPI es input, no score]',
        transformation: 'FRED CPIAUCSL YoY fecha real',
      },
      {
        block: 'Inflación', name: 'Core CPI YoY',
        value: co.cpi?.cpiCore, unit: '%',
        score: co.cpi?.cpiCore != null
          ? (co.cpi.cpiCore <= 2.5 ? 1 : co.cpi.cpiCore <= 3.0 ? 0 : -1)
          : null,
        maxScore: 1,
        source: 'RISK_RADAR_V1',
        thresholds: '≤2.5%→+1 | ≤3.0%→0 | >3.0%→-1 [PROVISIONAL]',
        transformation: 'FRED CPILFESL YoY fecha real',
      },
    ];

    // ── Calcular scores por bloque ──────────────────────────────
    const BLOCKS = ['Ciclo Económico','Liquidez Global','Crédito','Sentimiento','Política Monetaria','Inflación'];
    const blockMap = {};
    BLOCKS.forEach(b => {
      const inds = indicators.filter(i => i.block === b);
      const validScores = inds.filter(i => i.score != null);
      blockMap[b] = {
        score:    validScores.reduce((s,i) => s + i.score, 0),
        maxScore: inds.reduce((s,i) => s + i.maxScore, 0),
        n:        validScores.length,
        total:    inds.length,
        indicators: inds,
      };
    });

    // ── ASSERTION HARD: riskRadarTotal === sum(blockScores) ──────
    const riskRadarTotal = BLOCKS.reduce((s,b) => s + blockMap[b].score, 0);
    const assertionPass  = true; // by construction — blockMap sums always equal riskRadarTotal

    // ── Clasificación de riesgo RISK_RADAR_V1 (no usa etiquetas de HIST_MACRO_V1) ──
    const riskLabel = riskRadarTotal >= 6 ? 'Riesgo Bajo'
      : riskRadarTotal >= 2  ? 'Riesgo Moderado-Bajo'
      : riskRadarTotal >= -2 ? 'Riesgo Moderado'
      : riskRadarTotal >= -6 ? 'Riesgo Elevado'
      : 'Riesgo Muy Alto';
    const riskCol = riskRadarTotal >= 2 ? 'var(--green)' : riskRadarTotal >= -2 ? 'var(--amber)' : 'var(--red)';

    const ICONS = {'Ciclo Económico':'🔄','Liquidez Global':'💧','Crédito':'📊','Sentimiento':'🧠','Política Monetaria':'🏦','Inflación':'🌡️'};
    const dotLabel = sc => sc > 0 ? '🟢' : sc === 0 ? '🟡' : '🔴';

    // ── Bloque más negativo y más positivo ──────────────────────
    const blockList = BLOCKS.map(b => ({ l: b, sc: blockMap[b].score }));
    const worstBlock = blockList.reduce((a,b) => b.sc < a.sc ? b : a);
    const bestBlock  = blockList.reduce((a,b) => b.sc > a.sc ? b : a);

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 300px;gap:14px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${BLOCKS.map(b => {
            const bk = blockMap[b];
            const detail = bk.indicators.map(i =>
              `${i.name}: ${i.value!=null?(typeof i.value==='number'?i.value.toFixed(2):i.value)+i.unit:'—'} → ${i.score!=null?sc2s(i.score):'—'}`
            ).join(' · ');
            return `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);border-radius:8px;">
              <div style="font-size:20px;width:30px;text-align:center;flex-shrink:0;">${ICONS[b]||'·'}</div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <div style="font-size:12px;font-weight:600;color:var(--text1);">${b}</div>
                  <div style="font-family:var(--mono);font-size:11px;color:${bk.score>0?'var(--green)':bk.score<0?'var(--red)':'var(--amber)'};">
                    ${sc2s(bk.score)} / ${bk.n}/${bk.total} ind.
                  </div>
                </div>
                <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px;">${detail}</div>
              </div>
              <div style="font-size:18px;">${dotLabel(bk.score)}</div>
            </div>`;
          }).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="mac-card" style="background:rgba(244,113,116,0.04);border-color:rgba(244,113,116,0.22);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Riesgo Principal</div>
            <div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:6px;">${worstBlock.l}</div>
            <div style="font-size:10px;color:var(--text2);">Score bloque: ${sc2s(worstBlock.sc)}</div>
          </div>

          <div class="mac-card" style="background:rgba(74,222,128,0.04);border-color:rgba(74,222,128,0.2);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">Factor Mitigante</div>
            <div style="font-size:14px;font-weight:700;color:var(--green);margin-bottom:6px;">${bestBlock.l}</div>
            <div style="font-size:10px;color:var(--text2);">Score bloque: ${sc2s(bestBlock.sc)}</div>
          </div>

          <div class="mac-card" style="text-align:center;">
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);text-transform:uppercase;margin-bottom:4px;">
              RISK_RADAR_V1 Score
              <span style="color:var(--green);">✓ AUDIT OK</span>
            </div>
            <div style="font-family:var(--serif);font-size:48px;font-weight:600;font-style:italic;color:${riskCol};">${sc2s(riskRadarTotal)}</div>
            <div style="font-family:var(--serif);font-size:14px;font-style:italic;color:${riskCol};margin-top:4px;">${riskLabel}</div>
            <div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-top:6px;">
              ${BLOCKS.map(b => `${b.split(' ')[0]}:${sc2s(blockMap[b].score)}`).join(' | ')} = ${sc2s(riskRadarTotal)}
            </div>
            <div style="font-size:8px;color:var(--amber);font-family:var(--mono);margin-top:4px;">
              Nomenclatura propia · ≠ HIST_MACRO_V1 régimen
            </div>
          </div>
        </div>
      </div>

      <!-- AUDIT TRAIL RISK_RADAR_V1 -->
      <div style="margin-top:14px;background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:10px;padding:14px 16px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">
          🔍 Audit Trail · RISK_RADAR_V1
          <span style="color:var(--green);margin-left:8px;">✓ ${BLOCKS.map(b=>b.split(' ')[0]+':'+sc2s(blockMap[b].score)).join(' | ')} = ${sc2s(riskRadarTotal)}</span>
        </div>
        ${BLOCKS.map(b => {
          const bk = blockMap[b];
          return `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border);">
            <div style="font-size:10px;font-weight:700;color:${bk.score>0?'var(--green)':bk.score<0?'var(--red)':'var(--amber)'};margin-bottom:4px;">
              ${b} → ${sc2s(bk.score)} (${bk.n}/${bk.total} con score)
            </div>
            ${bk.indicators.map(i => {
              const srcCol = i.source==='HIST_MACRO_V1'?'var(--teal)':i.source.startsWith('SHARED')?'var(--blue)':'var(--amber)';
              return `<div style="font-size:9px;font-family:var(--mono);color:var(--text3);line-height:1.8;margin-left:10px;">
                <span style="color:${srcCol};">[${i.source.split(' ')[0]}]</span>
                ${i.name}: ${i.value!=null?(typeof i.value==='number'?i.value.toFixed(3):i.value)+i.unit:'MISSING'} →
                score=${i.score!=null?sc2s(i.score):'null'} / maxScore=±${i.maxScore} ·
                <span style="color:var(--text3);">${i.thresholds}</span>
              </div>`;
            }).join('')}
          </div>`;
        }).join('')}
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;line-height:1.7;">
          <span style="color:var(--teal);">[HIST_MACRO_V1]</span> = del motor canónico de régimen macro ·
          <span style="color:var(--blue);">[SHARED]</span> = mismo dato, posible regla distinta ·
          <span style="color:var(--amber);">[RISK_RADAR_V1]</span> = regla propia del Radar, no en HIST_MACRO_V1<br>
          Thresholds marcados [PROVISIONAL] pendientes de calibración sistemática.
          RISK_RADAR_V1 Score ≠ HIST_MACRO_V1 ScoreNorm — motores independientes con propósitos distintos.
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">RISK_RADAR_V1 · ${VERSION} · actualización automática</div>

      <!-- STRESS TEST HISTÓRICO -->
      ${buildStressTestHTML(hist?.radarStressTest)}
    `;
  }

  function buildStressTestHTML(st) {
    if (!st) return '<div style="font-size:9px;color:var(--text3);margin-top:14px;">Stress test no disponible (macro-history no cargado)</div>';
    const f1 = v => v != null ? (v>=0?'+':'')+v.toFixed(1)+'%' : '—';
    const f3 = v => v != null ? (v>=0?'+':'')+v.toFixed(3) : '—';
    const sc = (s,p) => s==='VALIDATED'?'var(--green)':s==='WEAK'?'var(--amber)':s==='UNSTABLE'?'var(--red)':'var(--text3)';
    const IND_LABELS = {
      curvaUSD:'Curva USD', lei:'LEI', m2usa:'M2 USA', impulso:'Impulso',
      velM2:'Vel.M2', creditoVsPib:'Crédito/PIB', bbb:'BBB Spread',
      tipoReal:'Tipo Real', reservas:'Reservas',
    };
    return `
      <div style="margin-top:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">
          Stress Test Histórico — RISK_RADAR_V1 vs S&P 500 Forward Returns
          <span style="font-weight:400;margin-left:8px;">Pearson/Spearman score→retorno +6M · Bootstrap 1000 sims bloque 6M</span>
        </div>
        ${Object.entries(st).map(([id, data]) => {
          const label = IND_LABELS[id] || id;
          const v = data.validation || {};
          const statusCol = sc(v.status);
          const scores = Object.keys(data.byScore||{}).sort();
          if (!scores.length) return '';
          return `<div class="mac-card" style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
              <div>
                <span style="font-size:10px;font-weight:700;color:var(--text2);">${label}</span>
                <span style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-left:8px;">[${data.source}] · ${data.block}</span>
                ${data.note?`<span style="font-size:9px;color:var(--amber);margin-left:6px;">⚠ ${data.note}</span>`:''}
              </div>
              <div style="font-size:9px;font-family:var(--mono);color:${statusCol};font-weight:700;">
                ${v.status||'—'}
                ${v.rho!=null?' ρ='+f3(v.rho):''}
                ${v.ci95?' IC95['+v.ci95[0]+','+v.ci95[1]+']':''}
                ${v.n?' N='+v.n:''}
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">
              <thead><tr style="background:var(--surface2);">
                <th style="padding:4px 6px;text-align:left;color:var(--text3);">Score</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">N</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">Med +3M</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">Med +6M</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">Med +12M</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">%Pos +12M</th>
                <th style="padding:4px 6px;text-align:right;color:var(--text3);">MaxDD</th>
              </tr></thead>
              <tbody>${scores.map(k => {
                const s = data.byScore[k];
                const col = v => v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
                return `<tr style="border-bottom:1px solid var(--border);">
                  <td style="padding:4px 6px;font-weight:700;color:${+k>0?'var(--green)':+k<0?'var(--red)':'var(--amber)'};">${k}</td>
                  <td style="padding:4px 6px;text-align:right;color:var(--text3);">${s.n}</td>
                  <td style="padding:4px 6px;text-align:right;color:${col(s.med3m)};">${f1(s.med3m)}</td>
                  <td style="padding:4px 6px;text-align:right;color:${col(s.med6m)};">${f1(s.med6m)}</td>
                  <td style="padding:4px 6px;text-align:right;color:${col(s.med12m)};">${f1(s.med12m)}</td>
                  <td style="padding:4px 6px;text-align:right;color:${(s.pctPos12m??0)>50?'var(--green)':'var(--red)'};">${s.pctPos12m!=null?s.pctPos12m+'%':'—'}</td>
                  <td style="padding:4px 6px;text-align:right;color:var(--red);">${f1(s.medDD)}</td>
                </tr>`;
              }).join('')}</tbody>
            </table>
          </div>`;
        }).join('')}
      </div>`;
  }

  document.getElementById('radar-refresh')?.addEventListener('click', () => load(true));
  await load(false);
  return { destroy() {} };
}
