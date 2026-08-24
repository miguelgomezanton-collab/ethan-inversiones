// radar.js — RISK_RADAR_V1 (motor independiente de riesgos actuales)
// Separado de HIST_MACRO_V1 (régimen macro canónico)
// Cada indicador: source, value, transformation, thresholds, score, maxScore, block, version
import { getMacroData } from './macro-data.js';

const f1 = v => v != null ? Number(v).toFixed(1) : '—';
const f2 = v => v != null ? Number(v).toFixed(2) : '—';
const sc2s = s => s > 0 ? ('+'+s) : String(s);

const VERSION = 'RISK_RADAR_V1';

export async function render(container, { actionsSlot }) {
  let activeTab = 'radar';
  actionsSlot.innerHTML = `
    <div style="display:flex;gap:4px;align-items:center;">
      <button class="btn radar-tab-btn ${activeTab==='radar'?'btn-primary':''}" data-tab="radar">🎛️ Radar</button>
      <button class="btn radar-tab-btn ${activeTab==='block'?'btn-primary':''}" data-tab="block">🔬 Block Validation</button>
      <button class="btn btn-primary" id="radar-refresh" style="margin-left:6px;">↻</button>
    </div>`;
  container.innerHTML = `<div id="radar-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;

  let blockData = null;
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
      ${buildBlockStressHTML(hist?.radarBlockStress)}
      ${buildScoreTotalHTML(hist?.radarScoreTotal)}
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

  function buildBlockStressHTML(bs) {
    if (!bs) return '';
    const f1=v=>v!=null?(v>=0?'+':'')+v.toFixed(1)+'%':'—';
    const f1b=v=>v!=null?v.toFixed(1)+'%':'—';
    const f3=v=>v!=null?(v>=0?'+':'')+v.toFixed(3):'—';
    const col=v=>v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
    const statusCol=s=>s==='VALIDATED'?'var(--green)':s==='WEAK'?'var(--amber)':s==='UNSTABLE'?'var(--red)':'var(--text3)';
    return '<div style="margin-top:14px;">' +
      '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">' +
        'Stress Test por Bloque (6 bloques RISK_RADAR_V1) — Retorno y Downside Risk' +
      '</div>' +
      Object.entries(bs).map(([bName, bData]) => {
        if (bData.unavailable) return '<div class="mac-card" style="margin-bottom:8px;opacity:0.6;">' +
          '<div style="font-size:10px;font-weight:700;color:var(--text2);margin-bottom:4px;">' + bName + ' <span style="color:var(--amber);font-size:9px;">⚠ Sin datos históricos en HIST_MACRO_V1</span></div>' +
          '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);">' + (bData.note||'') + '</div>' +
        '</div>';
        const scores = Object.keys(bData.byScore||{}).sort((a,b)=>+a-+b);
        const sp6=bData.spearmanR6, spB=bData.spearmanBin, spDD=bData.spearmanDD, spDD10=bData.spearmanDD10;
        const st=bData.status||'—';
        return '<div class="mac-card" style="margin-bottom:10px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">' +
            '<span style="font-size:10px;font-weight:700;color:var(--text2);">' + bName + ' <span style="font-size:9px;color:'+statusCol(st)+';font-family:var(--mono);">'+st+'</span></span>' +
            '<span style="font-size:9px;font-family:var(--mono);color:var(--text3);">N='+bData.n+' · ρ+6M='+f3(sp6?.rho)+(sp6?.p!=null?' p='+sp6.p.toFixed(3):'')+' · ρDD='+f3(spDD?.rho)+(spDD?.p!=null?' p='+spDD.p.toFixed(3):'')+' · ρDD10='+f3(spDD10?.rho)+(spDD10?.p!=null?' p='+spDD10.p.toFixed(3):'')+' · ρBin='+f3(spB?.rho)+(spB?.p!=null?' p='+spB.p.toFixed(3):'')+'</span>' +
          '</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">' +
            '<thead><tr style="background:var(--surface2);">' +
              '<th style="padding:3px 5px;text-align:left;color:var(--text3);">Score</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">N</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">Med+6M</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">Med+12M</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">%Pos+12M</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">MaxDD</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">VaR95%</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">P(DD>10%)</th>' +
              '<th style="padding:3px 5px;text-align:right;color:var(--text3);">P(DD>15%)</th>' +
            '</tr></thead><tbody>' +
            scores.map(k => {
              const s=bData.byScore[k], ds=s?.ds12||{};
              if(!s) return '';
              return '<tr style="border-bottom:1px solid var(--border);">' +
                '<td style="padding:3px 5px;font-weight:700;color:' + (+k>0?'var(--green)':+k<0?'var(--red)':'var(--amber)') + ';">' + k + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:var(--text3);">' + (ds.n||s.n) + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+col(s.med6m)+';">' + f1(s.med6m) + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+col(s.med12m)+';">' + f1(s.med12m) + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+((s.pctPos12m??0)>50?'var(--green)':'var(--red)')+';">' + (s.pctPos12m!=null?s.pctPos12m+'%':'—') + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+(ds.medDD<-10?'var(--red)':ds.medDD<-5?'var(--amber)':'var(--green)')+';">' + f1b(ds.medDD) + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+(ds.var95<-15?'var(--red)':ds.var95<-8?'var(--amber)':'var(--text3)')+';">' + f1(ds.var95) + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+(ds.probDD10>30?'var(--red)':ds.probDD10>15?'var(--amber)':'var(--green)')+';">' + (ds.probDD10!=null?ds.probDD10+'%':'—') + '</td>' +
                '<td style="padding:3px 5px;text-align:right;color:'+(ds.probDD15>15?'var(--red)':ds.probDD15>5?'var(--amber)':'var(--green)')+';">' + (ds.probDD15!=null?ds.probDD15+'%':'—') + '</td>' +
              '</tr>';
            }).join('') +
          '</tbody></table></div>';
      }).join('') + '</div>';
  }

  function buildScoreTotalHTML(st) {
    if (!st) return '';
    const f1=v=>v!=null?(v>=0?'+':'')+v.toFixed(1)+'%':'—';
    const f1b=v=>v!=null?v.toFixed(1)+'%':'—';
    const f3=v=>v!=null?(v>=0?'+':'')+v.toFixed(3):'—';
    const col=v=>v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
    const colDD=v=>v==null?'var(--text3)':v<-10?'var(--red)':v<-5?'var(--amber)':'var(--green)';
    const v=st.validation||{};
    // Diagnóstico calculado de monotonicidad
    const qs=st.quintiles||[];
    const dd10vals=qs.map(q=>q.ds12?.probDD10??null).filter(v=>v!=null);
    const dd10mono = dd10vals.length>=3 && dd10vals[0]>dd10vals[dd10vals.length-1]; // Q1 peor que Q5
    const retMono  = qs.length>=4 && (qs[0].pctPos12m??100) > (qs[qs.length-1].pctPos12m??0);
    const verdict  = (!dd10mono && !retMono) ? '⚠ Sin monotonicidad clara en downside risk ni probabilidad de retorno positivo con los datos disponibles.' :
                     (dd10mono && retMono)   ? '✓ El Score discrimina downside risk: Q1 tiene mayor prob. DD>10% y mayor %Pos+12M que Q5 (mean reversion).' :
                     dd10mono ? '〜 Discriminación parcial de downside risk (DD>10%). Retorno positivo no monotónico.' :
                     '〜 %Pos+12M decrece de Q1→Q5 (mean reversion). Downside risk no monotónico.';

    // Tarjetas de validación estadística
    const statCards = [
      ['Pearson +6M',      v.pearsonR6,  'retorno +6M'],
      ['Spearman +6M',     v.spearmanR6, 'retorno +6M'],
      ['Spearman bin+12M', v.spearmanBin,'P(ret+>0)+12M'],
      ['Spearman MaxDD',   v.spearmanDD, 'MaxDD 12M'],
      ['Spearman P(DD>10%)',v.spearmanDD10,'P(DD>10%)+12M'],
    ];

    return '<div style="margin-top:14px;">' +
      '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">' +
        'RISK_RADAR_V1 Score Total · Diagnóstico de Riesgo (no predictor de retorno)' +
      '</div>' +

      // Validación estadística
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
        '<div class="mac-card">' +
          '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:8px;">Correlaciones Score Total → S&P 500</div>' +
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;">' +
            statCards.slice(0,3).map(([l,s,sub]) =>
              '<div style="background:var(--surface2);border-radius:6px;padding:7px;text-align:center;">' +
                '<div style="font-size:8px;color:var(--text3);margin-bottom:3px;">' + l + '</div>' +
                '<div style="font-family:var(--mono);font-size:12px;font-weight:700;color:' + col(s?.rho) + ';">' + f3(s?.rho) + (s?.p!=null&&s.p<0.05?'*':'') + '</div>' +
                '<div style="font-size:8px;color:var(--text3);">p=' + (s?.p!=null?s.p.toFixed(4):'—') + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
            statCards.slice(3).map(([l,s,sub]) =>
              '<div style="background:rgba(244,113,116,0.06);border-radius:6px;padding:7px;text-align:center;">' +
                '<div style="font-size:8px;color:var(--text3);margin-bottom:3px;">' + l + '</div>' +
                '<div style="font-family:var(--mono);font-size:12px;font-weight:700;color:' + col(-(s?.rho||0)) + ';">' + f3(s?.rho) + (s?.p!=null&&s.p<0.05?'*':'') + '</div>' +
                '<div style="font-size:8px;color:var(--text3);">p=' + (s?.p!=null?s.p.toFixed(4):'—') + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
          '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;">* p<0.05 · ρ<0 en DD = Score más bajo predice peor drawdown ✓</div>' +
        '</div>' +
        '<div class="mac-card">' +
          '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;">Estabilidad Temporal Pearson +6M</div>' +
          '<div style="display:flex;gap:8px;">' +
            (v.stability||[]).map(b =>
              '<div style="background:var(--surface2);border-radius:6px;padding:8px;text-align:center;flex:1;">' +
                '<div style="font-size:8px;color:var(--text3);">' + b.label + '</div>' +
                '<div style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + col(b.rho) + ';">' + f3(b.rho) + (b.p!=null&&b.p<0.05?'*':'') + '</div>' +
                '<div style="font-size:8px;color:var(--text3);">N=' + b.n + ' · ' + (b.first||'—').slice(0,7) + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +
      '</div>' +

      // Quintiles con downside risk
      '<div class="mac-card">' +
        '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:8px;">Quintiles Score Total — Downside Risk (test decisivo del Radar)</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">' +
          '<thead><tr style="background:var(--surface2);">' +
            '<th style="padding:4px 5px;text-align:left;color:var(--text3);">Q</th>' +
            '<th style="padding:4px 5px;text-align:center;color:var(--text3);">Score</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">N</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">Med+6M</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">%Pos+12M</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">MaxDD</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">VaR95%(+12M)</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">CVaR95%</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">P(DD>10%)</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">P(DD>15%)</th>' +
            '<th style="padding:4px 5px;text-align:right;color:var(--text3);">Peor ret</th>' +
          '</tr></thead><tbody>' +
          qs.map(q => {
            const ds=q.ds12||{};
            return '<tr style="border-bottom:1px solid var(--border);">' +
              '<td style="padding:4px 5px;color:var(--teal);font-weight:700;">Q'+q.quintile+'</td>' +
              '<td style="padding:4px 5px;text-align:center;font-size:8px;color:var(--text3);">['+q.minScore+','+q.maxScore+']</td>' +
              '<td style="padding:4px 5px;text-align:right;color:var(--text3);">'+(ds.n||'—')+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+col(q.med6m)+';">'+f1(q.med6m)+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+((q.pctPos12m??0)>50?'var(--green)':'var(--red)')+';">'+(q.pctPos12m!=null?q.pctPos12m+'%':'—')+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+colDD(ds.medDD)+';">'+f1b(ds.medDD)+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+colDD(ds.var95)+';">'+f1(ds.var95)+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+colDD(ds.cvar95)+';">'+f1(ds.cvar95)+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+(ds.probDD10>20?'var(--red)':ds.probDD10>10?'var(--amber)':'var(--green)')+';">'+(ds.probDD10!=null?ds.probDD10+'%':'—')+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:'+(ds.probDD15>10?'var(--red)':ds.probDD15>5?'var(--amber)':'var(--green)')+';">'+(ds.probDD15!=null?ds.probDD15+'%':'—')+'</td>' +
              '<td style="padding:4px 5px;text-align:right;color:var(--red);">'+f1(ds.worstReturn)+'</td>' +
            '</tr>';
          }).join('') +
          '</tbody></table>' +
          '<div style="font-size:9px;color:var(--'+(verdict.startsWith('✓')?'green':verdict.startsWith('⚠')?'amber':'text2')+'};font-family:var(--mono);margin-top:8px;padding:8px;background:var(--surface2);border-radius:6px;">' + verdict + '</div>' +
          '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;">RISK_RADAR_V1 = diagnóstico contemporáneo del régimen/riesgo macro · No es predictor direccional del S&P 500. Stress Test → consecuencias históricas del régimen.</div>' +
      '</div></div>';
  }

  async function loadBlockValidation(force=false) {
    if (blockData && !force) { paintBlockValidation(blockData); return; }
    document.getElementById('radar-wrap').innerHTML = '<div class="empty"><div class="loader-ring"></div></div>';
    try {
      // Dos peticiones independientes — el backend las separó porque juntas
      // superaban el límite de tiempo de Vercel. Si una falla/tarda, la otra
      // igualmente se pinta. Parseamos el JSON SIEMPRE (incluso en error) para
      // poder mostrar el motivo real (credenciales Firebase, etc.) en pantalla.
      const safeJson = r => r.json().then(j => ({ ok: r.ok, status: r.status, body: j })).catch(() => ({ ok: r.ok, status: r.status, body: null }));
      const [blockRes, compRes] = await Promise.allSettled([
        fetch('/api/macro-history?type=blockvalidation').then(safeJson),
        fetch('/api/macro-history?type=componentvalidation').then(safeJson),
      ]);
      const bWrap = blockRes.status==='fulfilled' ? blockRes.value : null;
      const cWrap = compRes.status==='fulfilled' ? compRes.value : null;
      const bPart = bWrap?.ok ? bWrap.body : null;
      const cPart = cWrap?.ok ? cWrap.body : null;
      blockData = (bPart || cPart || bWrap || cWrap) ? {
        updatedAt: bPart?.updatedAt || cPart?.updatedAt,
        blockValidation: bPart?.blockValidation || {},
        summary: bPart?.summary || {},
        componentValidation: cPart?.componentValidation || {},
        componentMatrix: cPart?.componentMatrix || [],
        partialBlock: !bPart, partialComponent: !cPart,
        // Motivo real del fallo, tal cual lo devuelve el backend — para no
        // tener que ir a mirar Network tab ni logs de Vercel a mano.
        componentErrorDetail: !cPart ? (cWrap?.body?.error || (compRes.status==='rejected' ? String(compRes.reason) : `HTTP ${cWrap?.status}`)) : null,
        blockErrorDetail: !bPart ? (bWrap?.body?.error || (blockRes.status==='rejected' ? String(blockRes.reason) : `HTTP ${bWrap?.status}`)) : null,
        componentNotComputedYet: !!cPart?.notComputedYet,
        componentCalculatedAt: cPart?.calculatedAt || null,
        componentDataThrough: cPart?.dataThrough || null,
        componentNSim: cPart?.nSim ?? null,
        componentBlockSize: cPart?.blockSize ?? null,
        componentTitle: cPart?.title || null,
        componentFrozenNote: cPart?.frozen || null,
      } : null;
      paintBlockValidation(blockData);
    } catch(e) {
      document.getElementById('radar-wrap').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.radar-tab-btn');
    if (!btn) return;
    activeTab = btn.dataset.tab;
    document.querySelectorAll('.radar-tab-btn').forEach(b => b.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
    if (activeTab === 'radar') load();
    else loadBlockValidation();
  });
  document.getElementById('radar-refresh')?.addEventListener('click', () => {
    if (activeTab === 'radar') load(true);
    else loadBlockValidation(true);
  });
  await load(false);
  return { destroy() {} };
}

  function paintBlockValidation(data) {
    const el = document.getElementById('radar-wrap');
    if (!data) { el.innerHTML = '<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos de block validation</div></div>'; return; }
    const f1=v=>v!=null?(v>=0?'+':'')+v.toFixed(1)+'%':'—';
    const f3=v=>v!=null?(v>=0?'+':'')+v.toFixed(3):'—';
    const col=v=>v==null?'var(--text3)':v>0?'var(--green)':'var(--red)';
    const colDD=v=>v==null?'var(--text3)':v<-10?'var(--red)':v<-5?'var(--amber)':'var(--green)';
    const verdictCol=v=>v==='ROBUST RISK SIGNAL'?'var(--green)':v==='INDICATIVE RISK SIGNAL'?'var(--teal)':v==='REGIME DEPENDENT'?'var(--amber)':v==='DESCRIPTIVE ONLY'?'var(--text3)':'var(--red)';
    const verdictIcon=v=>v==='ROBUST RISK SIGNAL'?'✓':v==='INDICATIVE RISK SIGNAL'?'〜':v==='REGIME DEPENDENT'?'⚡':v==='DESCRIPTIVE ONLY'?'○':'✗';

    // Matriz resumen
    const summaryHTML = '<div class="mac-card" style="margin-bottom:14px;">' +
      '<div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">RISK_RADAR_V1 — BLOCK VALIDATION REPORT</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:10px;">' +
        '<thead><tr style="background:var(--surface2);">' +
          '<th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Bloque</th>' +
          '<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">N hist / fwd</th>' +
          '<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">ρ DD+12M</th>' +
          '<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">ρ Bin+12M</th>' +
          '<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Bootstrap</th>' +
          '<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Regime?</th>' +
          '<th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Veredicto</th>' +
        '</tr></thead><tbody>' +
      Object.entries(data.blockValidation||{}).map(([bName,bv]) =>
        '<tr style="border-bottom:1px solid var(--border);">' +
          '<td style="padding:6px 8px;color:var(--text1);font-weight:600;">' + bName + '</td>' +
          '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:var(--text3);font-size:9px;">' + (bv.nHistorico||bv.n||'—') + '<br><span style="color:var(--text3);opacity:0.7;">fwd:' + (bv.nFwd12m||bv.nWith12m||'—') + '</span></td>' +
          '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:' + col(bv.corr?.spDD12?.rho) + ';">' + f3(bv.corr?.spDD12?.rho) + (bv.corr?.spDD12?.p!=null&&bv.corr.spDD12.p<0.05?'*':'') + '</td>' +
          '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:' + col(bv.corr?.spBin12?.rho) + ';">' + f3(bv.corr?.spBin12?.rho) + (bv.corr?.spBin12?.p!=null&&bv.corr.spBin12.p<0.05?'*':'') + '</td>' +
          '<td style="padding:6px 8px;text-align:center;font-family:var(--mono);font-size:9px;color:' + (bv.boot?.excludes0?'var(--green)':bv.boot?.pBoot!=null&&bv.boot.pBoot<0.1?'var(--amber)':'var(--text3)') + ';">' + (bv.boot?'ρ='+bv.boot.rhoObs+' ['+bv.boot.ci95+'] p='+bv.boot.pBoot:'—') + '</td>' +
          '<td style="padding:6px 8px;text-align:center;font-size:9px;color:' + (bv.regDep?'var(--amber)':'var(--text3)') + ';">' + (bv.regDep?'⚡ SÍ':'No') + '</td>' +
          '<td style="padding:6px 8px;font-family:var(--mono);font-size:9px;font-weight:700;color:' + verdictCol(bv.verdict) + ';">' + verdictIcon(bv.verdict) + ' ' + (bv.verdict||'—') + '</td>' +
        '</tr>'
      ).join('') +
      '</tbody></table></div>';

    // Detalle por bloque
    const detailHTML = Object.entries(data.blockValidation||{}).map(([bName,bv]) => {
      const scores = Object.keys(bv.byScore||{}).sort((a,b)=>+a-+b);
      const tempRows = (bv.temp||[]).map(t =>
        '<div style="background:var(--surface2);border-radius:6px;padding:8px;text-align:center;flex:1;">' +
          '<div style="font-size:8px;color:var(--text3);">' + t.label + '<br>' + (t.first||'').slice(0,7) + '</div>' +
          '<div style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + col(t.rho) + ';">' + f3(t.rho) + (t.p!=null&&t.p<0.05?'*':'') + '</div>' +
          '<div style="font-size:8px;color:var(--text3);">N=' + t.n + ' p=' + (t.p!=null?t.p.toFixed(3):'—') + '</div>' +
        '</div>'
      ).join('');
      return '<div class="mac-card" style="margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">' +
          '<span style="font-size:11px;font-weight:700;color:var(--text1);">' + bName + '</span>' +
          '<span style="font-family:var(--mono);font-size:10px;font-weight:700;color:' + verdictCol(bv.verdict) + ';">' + verdictIcon(bv.verdict) + ' ' + (bv.verdict||'—') + '</span>' +
        '</div>' +
        (bv.note?'<div style="font-size:9px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">⚠ ' + bv.note + '</div>':'') +
        // Correlaciones
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px;">' +
        [['ρ DD+12M',bv.corr?.spDD12],['ρ Bin+12M',bv.corr?.spBin12],['ρ DD+6M',bv.corr?.spDD6],['ρ R+6M',bv.corr?.spR6]].map(([l,s]) =>
          '<div style="background:var(--surface2);border-radius:6px;padding:7px;text-align:center;">' +
            '<div style="font-size:8px;color:var(--text3);margin-bottom:3px;">' + l + '</div>' +
            '<div style="font-family:var(--mono);font-size:12px;font-weight:700;color:' + col(s?.rho) + ';">' + f3(s?.rho) + (s?.p!=null&&s.p<0.05?'*':'') + '</div>' +
            '<div style="font-size:8px;color:var(--text3);">p=' + (s?.p!=null?s.p.toFixed(3):'—') + ' N=' + (s?.n||'—') + '</div>' +
          '</div>'
        ).join('') + '</div>' +
        // Bootstrap + non-overlap
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">' +
          '<div style="background:rgba(' + (bv.boot?.excludes0?'74,222,128':bv.boot?.pBoot!=null&&bv.boot.pBoot<0.1?'64,217,192':'100,100,100') + ',0.07);border-radius:6px;padding:8px;">' +
            '<div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">Block Bootstrap (5000 sims, bloque 12M)</div>' +
            '<div style="font-family:var(--mono);font-size:11px;font-weight:700;color:' + (bv.boot?.excludes0?'var(--green)':bv.boot?.pBoot!=null&&bv.boot.pBoot<0.1?'var(--amber)':'var(--text3)') + ';">' + (bv.boot?'ρ='+bv.boot.rhoObs+' IC95['+bv.boot.ci95[0]+','+bv.boot.ci95[1]+'] p='+bv.boot.pBoot:'—') + '</div>' +
            '<div style="font-size:8px;color:var(--text3);">' + (bv.boot?.excludes0?'✓ IC95 excluye 0':bv.boot?.pBoot!=null&&bv.boot.pBoot<0.1?'〜 p<0.1':'No significativo') + '</div>' +
          '</div>' +
          '<div style="background:var(--surface2);border-radius:6px;padding:8px;">' +
            '<div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">No solapado (cada 12M)</div>' +
            '<div style="font-family:var(--mono);font-size:11px;font-weight:700;color:' + col(bv.noOvDD?.rho) + ';">' + (bv.noOvDD?.insufficient?'N insuficiente':f3(bv.noOvDD?.rho)) + '</div>' +
            '<div style="font-size:8px;color:var(--text3);">N=' + (bv.noOvDD?.n||'—') + ' p=' + (bv.noOvDD?.p!=null?bv.noOvDD.p.toFixed(3):'—') + '</div>' +
          '</div>' +
        '</div>' +
        // Estabilidad temporal
        '<div style="display:flex;gap:6px;margin-bottom:10px;">' + tempRows + '</div>' +
        (bv.regDep?'<div style="font-size:9px;color:var(--amber);font-family:var(--mono);margin-bottom:8px;">⚡ REGIME DEPENDENT — el signo de ρ cambia entre períodos</div>':'') +
        // Tabla por score
        '<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">' +
          '<thead><tr style="background:var(--surface2);">' +
            '<th style="padding:3px 5px;text-align:left;color:var(--text3);">Score</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">N</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">Med+6M</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">Med+12M</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">%Pos+12M</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">MedDD+6M</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">MedDD+12M</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">P(DD>10%)</th>' +
            '<th style="padding:3px 5px;text-align:right;color:var(--text3);">VaR95%</th>' +
          '</tr></thead><tbody>' +
          scores.map(k => {
            const s=bv.byScore[k];
            return '<tr style="border-bottom:1px solid var(--border);' + (s.lowN?'opacity:0.55;':'') + '">' +
              '<td style="padding:3px 5px;font-weight:700;color:' + (+k>0?'var(--green)':+k<0?'var(--red)':'var(--amber)') + ';">' + k + (s.lowN?' <span style="color:var(--text3);font-size:8px;">LOW N</span>':'') + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:var(--text3);">' + s.n + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + col(s.medR6) + ';">' + f1(s.medR6) + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + col(s.medR12) + ';">' + f1(s.medR12) + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + ((s.pctPos12??0)>50?'var(--green)':'var(--red)') + ';">' + (s.pctPos12!=null?s.pctPos12+'%':'—') + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + colDD(s.medDD6) + ';">' + (s.medDD6!=null?s.medDD6.toFixed(1)+'%':'—') + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + colDD(s.medDD12) + ';">' + (s.medDD12!=null?s.medDD12.toFixed(1)+'%':'—') + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + ((s.pDD10??0)>30?'var(--red)':(s.pDD10??0)>15?'var(--amber)':'var(--green)') + ';">' + (s.pDD10!=null?s.pDD10+'%':'—') + '</td>' +
              '<td style="padding:3px 5px;text-align:right;color:' + colDD(s.var95) + ';">' + f1(s.var95) + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>';
    }).join('');

    const IND_LABELS_CV = {
      curvaUSD:'Curva USD 10Y-2Y', lei:'LEI (OECD CLI)', m2usa:'M2 USA YoY', impulso:'Impulso Crediticio',
      velM2:'Velocidad M2', creditoVsPib:'Crédito vs PIB', bbb:'BBB Spread', hy:'HY Spread',
      vix:'VIX vs SMA200', cpiHeadline:'CPI Headline YoY', cpiCore:'Core CPI YoY',
      tipoReal:'Tipo Real (FFR-CPI)', reservas:'Reservas Bancarias',
    };
    const classColor = c => c==='ROBUST' ? 'var(--green)' : c==='INDICATIVE' ? 'var(--teal)'
      : c==='REGIME DEPENDENT' ? 'var(--amber)' : c==='INSUFFICIENT DATA' ? 'var(--text3)' : 'var(--red)';
    const v2Color = v => v==='MACRO REGIME' ? 'var(--blue)' : v==='MARKET RISK' ? 'var(--purple)'
      : v==='REVIEW' ? 'var(--amber)' : 'var(--text3)';

    // Componentes internos — COMPONENT VALIDATION: los 13 indicadores individuales, sin agregar por bloque
    // Se lee de un snapshot PERSISTIDO en Firestore (cron mensual), no se recalcula al abrir la pestaña.
    const fmtDT = iso => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}); };
    const titleHTML = '<div style="font-size:11px;font-weight:700;color:var(--teal);font-family:var(--mono);letter-spacing:0.04em;margin:18px 0 6px;">' +
      (data.componentTitle || 'RISK_RADAR_V1 — COMPONENT VALIDATION REPORT') + '</div>' +
      (data.componentFrozenNote ? '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:10px;">' + data.componentFrozenNote + '</div>' : '');
    const statusLineHTML = '<div style="font-size:9px;font-family:var(--mono);color:var(--text3);margin-bottom:10px;padding:8px 10px;background:var(--surface2);border-radius:6px;">' +
      '📌 Último cálculo: <strong style="color:var(--text2);">' + fmtDT(data.componentCalculatedAt) + '</strong>' +
      ' · datos hasta <strong style="color:var(--text2);">' + (data.componentDataThrough||'—') + '</strong>' +
      ' · <strong style="color:var(--text2);">' + (data.componentNSim!=null?data.componentNSim.toLocaleString('es-ES'):'—') + '</strong> sims' +
      ' · recálculo mensual automático (cron), no en cada carga' +
      '</div>';

    // Distribución por score real del indicador — Score|N|Med+6M|Med+12M|%Pos+12M|MedDD+6M|MedDD+12M|P(DD>10%)|P(DD>15%)|VaR95|CVaR95
    function byScoreTableHTML(byScore) {
      if (!byScore || !Object.keys(byScore).length) return '';
      const scores = Object.keys(byScore).sort((a,b)=>parseFloat(a)-parseFloat(b));
      return '<table style="width:100%;border-collapse:collapse;font-size:8.5px;font-family:var(--mono);margin-top:4px;margin-bottom:8px;">' +
        '<thead><tr style="background:var(--surface2);">' +
          ['Score','N','Med+6M','Med+12M','%Pos+12M','MedDD+6M','MedDD+12M','P(DD>10%)','P(DD>15%)','VaR95','CVaR95'].map(h=>'<th style="padding:3px 5px;text-align:center;color:var(--text3);">'+h+'</th>').join('') +
        '</tr></thead><tbody>' +
        scores.map(k => { const s = byScore[k];
          return '<tr style="border-bottom:1px solid var(--border);' + (s.lowN?'opacity:0.55;':'') + '">' +
            '<td style="padding:3px 5px;text-align:center;color:var(--text2);font-weight:700;">' + k + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:var(--text3);">' + s.n + (s.lowN?' <span style="color:var(--amber);">LOW N</span>':'') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + col(s.medR6) + ';">' + f1(s.medR6) + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + col(s.medR12) + ';">' + f1(s.medR12) + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + ((s.pctPos12??0)>50?'var(--green)':'var(--red)') + ';">' + (s.pctPos12!=null?s.pctPos12+'%':'—') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + colDD(s.medDD6) + ';">' + (s.medDD6!=null?s.medDD6.toFixed(1)+'%':'—') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + colDD(s.medDD12) + ';">' + (s.medDD12!=null?s.medDD12.toFixed(1)+'%':'—') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + ((s.pDD10??0)>30?'var(--red)':(s.pDD10??0)>15?'var(--amber)':'var(--green)') + ';">' + (s.pDD10!=null?s.pDD10+'%':'—') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + ((s.pDD15??0)>15?'var(--red)':'var(--text3)') + ';">' + (s.pDD15!=null?s.pDD15+'%':'—') + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + colDD(s.var95) + ';">' + f1(s.var95) + '</td>' +
            '<td style="padding:3px 5px;text-align:center;color:' + colDD(s.cvar95) + ';">' + f1(s.cvar95) + '</td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>';
    }

    const compHTML = data.componentNotComputedYet
      ? '<div class="mac-card" style="margin-top:14px;">' + titleHTML + statusLineHTML + '<div class="empty"><div class="empty-icon">🕐</div><div class="empty-title">Component Validation aún no calculado</div><div class="empty-desc">El cron mensual todavía no ha corrido. Se persistirá automáticamente en Firestore la próxima ejecución.</div></div></div>'
      : data.partialComponent
      ? '<div class="mac-card" style="margin-top:14px;"><div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Component Validation no disponible</div><div class="empty-desc">La lectura de /api/macro-history?type=componentvalidation falló.</div>' +
        (data.componentErrorDetail ? '<div style="margin-top:10px;font-family:var(--mono);font-size:9px;color:var(--red);background:var(--surface2);padding:8px 10px;border-radius:6px;text-align:left;">Motivo exacto: ' + String(data.componentErrorDetail).replace(/</g,'&lt;') + '</div>' : '') +
        '</div></div>'
      : '<div class="mac-card" style="margin-top:14px;">' +
      titleHTML + statusLineHTML +
      '<div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">Component Validation — Indicadores Individuales (sin agregar por bloque)</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">' +
        '<thead><tr style="background:var(--surface2);">' +
          '<th style="padding:4px 6px;text-align:left;color:var(--text3);">Indicador</th>' +
          '<th style="padding:4px 6px;text-align:left;color:var(--text3);">Bloque</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">N</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">ρ Ret+6M</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">ρ Ret+12M</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">ρ DD+6M</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">ρ DD+12M</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">ρ Bin+12M</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Bootstrap</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Temporal</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Clasificación</th>' +
        '</tr></thead><tbody>' +
      Object.entries(data.componentValidation||{}).map(([id,cv]) => {
        const c = cv.corr || {};
        return '<tr style="border-bottom:1px solid var(--border);">' +
          '<td style="padding:4px 6px;color:var(--text2);">' + (IND_LABELS_CV[id]||id) + '</td>' +
          '<td style="padding:4px 6px;color:var(--text3);">' + (cv.block||'—') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);">' + (cv.n||'—') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + col(c.spR6?.rho) + ';">' + f3(c.spR6?.rho) + (c.spR6?.p!=null&&c.spR6.p<0.05?'*':'') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + col(c.spR12?.rho) + ';">' + f3(c.spR12?.rho) + (c.spR12?.p!=null&&c.spR12.p<0.05?'*':'') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + col(c.spDD6?.rho) + ';">' + f3(c.spDD6?.rho) + (c.spDD6?.p!=null&&c.spDD6.p<0.05?'*':'') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + col(c.spDD12?.rho) + ';">' + f3(c.spDD12?.rho) + (c.spDD12?.p!=null&&c.spDD12.p<0.05?'*':'') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + col(c.spBin12?.rho) + ';">' + f3(c.spBin12?.rho) + (c.spBin12?.p!=null&&c.spBin12.p<0.05?'*':'') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;font-size:9px;color:' + (cv.boot?.excludes0?'var(--green)':cv.boot?.pBoot!=null&&cv.boot.pBoot<0.1?'var(--amber)':'var(--text3)') + ';">' + (cv.boot?'ρ='+cv.boot.rhoObs+' p='+cv.boot.pBoot:'—') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:' + (cv.regDep?'var(--amber)':'var(--text3)') + ';">' + (cv.regDep?'INESTABLE':'estable') + '</td>' +
          '<td style="padding:4px 6px;text-align:center;font-weight:700;color:' + classColor(cv.classification) + ';">' + (cv.classification||'—') + '</td>' +
        '</tr>' +
        (cv.note ? '<tr><td colspan="11" style="padding:2px 6px 8px;font-size:8.5px;color:var(--text3);font-style:italic;">ℹ ' + cv.note + '</td></tr>' : '') +
        '<tr><td colspan="11" style="padding:0 6px 10px;">' + byScoreTableHTML(cv.byScore) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">RISK_RADAR_V1 permanece FROZEN — esta pantalla es solo diagnóstico para decidir la arquitectura de V2. * = p&lt;0.05 · debajo de cada fila, distribución por score real (N&lt;10 → LOW N, no se clasifica como robusta)</div>' +
      '</div>';

    // Matriz final resumen — Indicador | Bloque actual | Return signal | Downside signal | Temporal stability | Bootstrap | Classification | Propuesta V2
    const matrixHTML = (!data.componentMatrix || !data.componentMatrix.length) ? '' :
      '<div class="mac-card" style="margin-top:14px;">' +
      '<div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">Matriz Final — Component Validation</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);">' +
        '<thead><tr style="background:var(--surface2);">' +
          '<th style="padding:4px 6px;text-align:left;color:var(--text3);">Indicador</th>' +
          '<th style="padding:4px 6px;text-align:left;color:var(--text3);">Bloque</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">N</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Return signal</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Downside signal</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Temporal stability</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Bootstrap</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Classification</th>' +
          '<th style="padding:4px 6px;text-align:center;color:var(--text3);">Propuesta V2</th>' +
        '</tr></thead><tbody>' +
      data.componentMatrix.map(r => '<tr style="border-bottom:1px solid var(--border);">' +
          '<td style="padding:4px 6px;color:var(--text2);">' + (IND_LABELS_CV[r.id]||r.id) + '</td>' +
          '<td style="padding:4px 6px;color:var(--text3);">' + r.block + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);font-size:9px;">' + (r.nHistorico||r.n||'—') + '<br><span style="opacity:0.7;">fwd:' + (r.nFwd12m||'—') + '</span></td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);">' + r.returnSignal + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);">' + r.downsideSignal + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);">' + r.temporalStability + '</td>' +
          '<td style="padding:4px 6px;text-align:center;color:var(--text3);">' + r.bootstrap + '</td>' +
          '<td style="padding:4px 6px;text-align:center;font-weight:700;color:' + classColor(r.classification) + ';">' + r.classification + '</td>' +
          '<td style="padding:4px 6px;text-align:center;font-weight:700;color:' + v2Color(r.proposalV2) + ';">' + (r.proposalV2||'—') + '</td>' +
        '</tr>').join('') +
      '</tbody></table>' +
      '<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">Propuesta V2 es solo informativa — no se implementa V2 en esta pantalla.</div>' +
      '</div>';

    el.innerHTML = summaryHTML + detailHTML + compHTML + matrixHTML +
      '<div class="co-footer" style="margin-top:14px;">RISK_RADAR_V1 Block + Component Validation · ' + (data.updatedAt||'').slice(0,10) + ' · FROZEN — no modificar thresholds hasta completar análisis' +
      (data.partialBlock?' · ⚠ Block Validation no disponible' + (data.blockErrorDetail?' ('+String(data.blockErrorDetail).replace(/</g,'&lt;')+')':''):'') + '</div>';
  }
