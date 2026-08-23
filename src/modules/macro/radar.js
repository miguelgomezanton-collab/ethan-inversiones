import { getMacroData } from './macro-data.js';
const f1=v=>v!=null?Number(v).toFixed(1):'—';
const f2=v=>v!=null?Number(v).toFixed(2):'—';

export async function render(container,{actionsSlot}){
  actionsSlot.innerHTML=`<button class="btn btn-primary" id="radar-refresh">↻ Actualizar</button>`;
  container.innerHTML=`<div id="radar-wrap"><div class="empty"><div class="loader-ring"></div></div></div>`;
  async function load(force=false){
    try{const m=await getMacroData(force);paint(m);}
    catch(e){document.getElementById('radar-wrap').innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`;}
  }
  function paint(macro){
    const el=document.getElementById('radar-wrap');
    const co=macro.coyuntura||{};
    const ind=macro.indicators||{};
    const liq=macro.liquidez||{};
    const seg=macro.seguimiento||{};
    const s=macro.scoreTotal??0;
    const mainCol=s>=4?'var(--green)':s>=0?'var(--amber)':'var(--red)';

    const cicloScore=(co.curvaUSD?.score||0)+(co.curvaEUR?.score||0)+(ind.lei?.score||0);
    const liqScore=(liq.m2?.score||0)+(liq.impulso?.score||0)+(liq.velM2?.score||0)+(liq.credito?.score||0);
    const creditoScore=(liq.bbbSpread?.score||0)+(seg.hySpread?.value!=null?(seg.hySpread.value<3.5?1:seg.hySpread.value<5?0:-1):0);
    const sentScore=(ind.fearGreed?.score||0)+(seg.vix?.aboveSMA200!=null?(seg.vix.aboveSMA200?-1:1):0);
    const polScore=(co.tipoReal?.score||0)+(liq.reservas?.score||0);
    const infScore=(ind.cpi?.score||0);

    // Trazabilidad detallada por componente (audit, sin cambiar reglas)
    const auditBlocks = [
      {
        l: 'Ciclo Económico', sc: cicloScore,
        components: [
          { name: 'Curva USD', value: co.curvaUSD?.value, score: co.curvaUSD?.score, source: 'HIST_MACRO_V1', rule: '≥0.90→+1 | ≥0.48→0 | <0.48→-1' },
          { name: 'Curva EUR', value: co.curvaEUR?.value, score: co.curvaEUR?.score, source: 'HIST_MACRO_V1', rule: '≥0.60→+1 | ≥0.40→0 | <0.40→-1' },
          { name: 'LEI (OECD)', value: ind.lei?.value, score: ind.lei?.score, source: 'HIST_MACRO_V1', rule: 'nivel>100 y delta>0→+1 | nivel<100 y delta<0→-1 | resto→0' },
        ]
      },
      {
        l: 'Liquidez Global', sc: liqScore,
        components: [
          { name: 'M2 Global YoY', value: liq.m2?.value, score: liq.m2?.score, source: 'HIST_MACRO_V1', rule: '≥5%→+3 | ≥3%→+1 | <3%→-3 [PROVISIONAL]' },
          { name: 'Impulso Crediticio', value: liq.impulso?.value, score: liq.impulso?.score, source: 'HIST_MACRO_V1', rule: '≥1.0→+2 | ≥0.5→+1 | <0.5→-2 [PROVISIONAL]' },
          { name: 'Velocidad M2', value: liq.velM2?.value, score: liq.velM2?.score, source: 'HIST_MACRO_V1', rule: '≥0%→+2 | ≥-1.5%→-1 | <-1.5%→-2 [PROVISIONAL]' },
          { name: 'Crédito vs PIB', value: liq.credito?.value, score: liq.credito?.score, source: 'HIST_MACRO_V1', rule: '≥3pp→+3 | ≥1.5pp→0 | <1.5pp→-3 [PROVISIONAL]' },
        ]
      },
      {
        l: 'Crédito', sc: creditoScore,
        components: [
          { name: 'BBB Spread', value: liq.bbbSpread?.value, score: liq.bbbSpread?.score, source: 'HIST_MACRO_V1 (solo analogías)', rule: '≤1.00%→+1 | ≤1.50%→0 | >1.50%→-1' },
          { name: 'HY Spread', value: seg.hySpread?.value, score: seg.hySpread?.value!=null?(seg.hySpread.value<3.5?1:seg.hySpread.value<5?0:-1):null, source: '⚠ INLINE — no en HIST_MACRO_V1', rule: '<3.5%→+1 | <5%→0 | ≥5%→-1 [PROVISIONAL]' },
        ]
      },
      {
        l: 'Sentimiento', sc: sentScore,
        components: [
          { name: 'Fear & Greed', value: ind.fearGreed?.value, score: ind.fearGreed?.score, source: '⚠ INLINE — no en HIST_MACRO_V1', rule: '<40→+1 | ≤54→0 | >54→-1 [convención contrarian]' },
          { name: 'VIX vs SMA200', value: seg.vix?.value, score: seg.vix?.aboveSMA200!=null?(seg.vix.aboveSMA200?-1:1):null, source: '⚠ INLINE — no en HIST_MACRO_V1', rule: '<SMA200→+1 | ≥SMA200→-1 [PROVISIONAL]' },
        ]
      },
      {
        l: 'Política Monetaria', sc: polScore,
        components: [
          { name: 'Tipo Real', value: co.tipoReal?.value, score: co.tipoReal?.score, source: 'HIST_MACRO_V1', rule: '≥1.0%→+1 | ≥0.5%→0 | <0.5%→-1' },
          { name: 'Reservas Fed', value: liq.reservas?.value, score: liq.reservas?.score, source: 'HIST_MACRO_V1', rule: '≥3.5T→+1 | <3.5T→-1 [PROVISIONAL, umbral fijo]' },
        ]
      },
      {
        l: 'Inflación', sc: infScore,
        components: [
          { name: 'CPI score', value: co.cpi?.value, score: ind.cpi?.score ?? null, source: '⚠ CPI no tiene score en HIST_MACRO_V1 — si null→0 silencioso', rule: 'CPI es INPUT de Tipo Real en HIST_MACRO_V1, no indicador independiente' },
        ]
      },
    ];

    const totalAudit = auditBlocks.reduce((s,b) => s + b.sc, 0);

    const blocks=[
      {icon:'🔄',l:'Ciclo Económico',sc:cicloScore,detail:`Curva USD ${co.curvaUSD?.value!=null?f2(co.curvaUSD.value)+'%':'—'} · Curva EUR ${co.curvaEUR?.value!=null?f2(co.curvaEUR.value)+'%':'—'} · LEI ${ind.lei?.value!=null?f2(ind.lei.value)+'%':'—'}`},
      {icon:'💧',l:'Liquidez Global',sc:liqScore,detail:`M2 ${liq.m2?.value!=null?f2(liq.m2.value)+'%':'—'} · Impulso ${liq.impulso?.value!=null?f2(liq.impulso.value):'—'} · Vel.M2 ${liq.velM2?.value!=null?f2(liq.velM2.value)+'%':'—'}`},
      {icon:'📊',l:'Crédito',sc:creditoScore,detail:`BBB ${liq.bbbSpread?.value!=null?f2(liq.bbbSpread.value)+'%':'—'} · HY ${seg.hySpread?.value!=null?f2(seg.hySpread.value)+'%':'—'}`},
      {icon:'🧠',l:'Sentimiento',sc:sentScore,detail:`F&G ${ind.fearGreed?.value??'—'} · VIX ${seg.vix?.value!=null?f1(seg.vix.value):'—'}${seg.vix?.aboveSMA200?' ⚠ sobre SMA200':''}`},
      {icon:'🏦',l:'Política Monetaria',sc:polScore,detail:`Tipo real ${co.tipoReal?.value!=null?(co.tipoReal.value>=0?'+':'')+f2(co.tipoReal.value)+'%':'—'} · Reservas ${liq.reservas?.value!=null?'$'+f2(liq.reservas.value)+'T':'—'}`},
      {icon:'🌡️',l:'Inflación',sc:infScore,detail:`CPI ${co.cpi?.value!=null?f1(co.cpi.value)+'%':'—'} · Core ${co.cpi?.cpiCore!=null?f1(co.cpi.cpiCore)+'%':'—'} · Riesgo: ${macro.riesgoContagio?.pct??'—'}%`},
    ];

    // Riesgo principal
    const worstBlock=blocks.reduce((a,b)=>a.sc<b.sc?a:b,blocks[0]);
    const bestBlock=blocks.reduce((a,b)=>a.sc>b.sc?a:b,blocks[0]);

    el.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 300px;gap:14px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${blocks.map(b=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);border-radius:8px;">
            <div style="font-size:20px;width:30px;text-align:center;flex-shrink:0;">${b.icon}</div>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;color:var(--text1);margin-bottom:2px;">${b.l}</div>
              <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">${b.detail}</div>
            </div>
            <div style="font-size:18px;">${dotLabel(b.sc)}</div>
          </div>`).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Riesgo principal -->
          <div class="mac-card" style="background:rgba(244,113,116,0.04);border-color:rgba(244,113,116,0.22);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">Riesgo Principal</div>
            <div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:8px;">${worstBlock.l}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">${
              worstBlock.l==='Ciclo Económico'?'Curva invertida + LEI negativo anticipan desaceleración o recesión en 6-9 meses. Es el indicador adelantado más fiable históricamente.':
              worstBlock.l==='Liquidez Global'?'El dinero se retira del sistema. Históricamente esto precede presión en activos de riesgo con 6-12 meses de retardo.':
              worstBlock.l==='Inflación'?'Inflación Core elevada impide que la Fed baje tipos, manteniendo condiciones restrictivas más tiempo del esperado.':
              worstBlock.l==='Crédito'?'Los spreads de crédito ampliando señalan estrés en el sistema financiero y riesgo de contagio a la economía real.':
              worstBlock.l==='Política Monetaria'?'Política muy restrictiva — el coste del dinero está frenando inversión y consumo de forma significativa.':
              'Sentimiento codicioso con macro deteriorándose — señal de complacencia que históricamente precede correcciones.'
            }</div>
          </div>

          <!-- Factor mitigante -->
          <div class="mac-card" style="background:rgba(74,222,128,0.04);border-color:rgba(74,222,128,0.2);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">Factor Mitigante</div>
            <div style="font-size:14px;font-weight:700;color:var(--green);margin-bottom:6px;">${bestBlock.l}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">${
              bestBlock.l==='Sentimiento'&&ind.fearGreed?.value<40?'El miedo extremo de mercado actúa como señal contrarian alcista si el macro se estabiliza.':
              bestBlock.l==='Liquidez Global'?'M2 positivo inyecta combustible que puede sostener el ciclo más tiempo del que sugieren los adelantados.':
              'El bloque más sólido del sistema actúa como amortiguador frente al riesgo principal.'
            }</div>
          </div>

          <!-- Score total -->
          <div class="mac-card" style="text-align:center;">
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);text-transform:uppercase;margin-bottom:8px;">Score Total</div>
            <div style="font-family:var(--serif);font-size:48px;font-weight:600;font-style:italic;color:${mainCol};">${s>=0?'+':''}${s}</div>
            <div style="font-family:var(--serif);font-size:16px;font-style:italic;color:${mainCol};margin-top:4px;">${macro.zone||'—'}</div>
          </div>
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Radar de riesgos · actualización automática</div>

      <!-- AUDIT TRAIL -->
      <div style="margin-top:14px;background:rgba(64,217,192,0.04);border:1px solid rgba(64,217,192,0.15);border-radius:10px;padding:14px 16px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:10px;">
          🔍 Audit Trail — Trazabilidad Score Total
          <span style="color:${totalAudit===s?'var(--green)':'var(--red)'};">
            ${auditBlocks.map(b=>`${b.l.split(' ')[0]}:${b.sc>=0?'+':''}${b.sc}`).join(' | ')} = ${totalAudit>=0?'+':''}${totalAudit}
            ${totalAudit===s?' ✓ coincide con scoreTotal':'⚠ NO coincide con scoreTotal='+s+' (discrepancia)'}
          </span>
        </div>
        ${auditBlocks.map(b => `
          <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);">
            <div style="font-size:10px;font-weight:700;color:${b.sc>0?'var(--green)':b.sc<0?'var(--red)':'var(--amber)'};margin-bottom:4px;">
              ${b.l} → Score: ${b.sc>=0?'+':''}${b.sc}
            </div>
            ${b.components.map(c => `
              <div style="font-size:9px;font-family:var(--mono);color:var(--text3);line-height:1.8;margin-left:12px;">
                ${c.name}:
                valor=${c.value!=null?(typeof c.value==='number'?c.value.toFixed(3):c.value):'MISSING'} →
                score=${c.score!=null?(c.score>=0?'+':'')+c.score:'null (→0 silencioso)'} ·
                ${c.source.startsWith('⚠')?'<span style="color:var(--amber);">'+c.source+'</span>':c.source} ·
                Regla: ${c.rule}
              </div>`).join('')}
          </div>`).join('')}
        <div style="font-size:9px;font-family:var(--mono);color:var(--amber);margin-top:6px;line-height:1.6;">
          ⚠ Indicadores marcados INLINE no pertenecen a HIST_MACRO_V1 y tienen reglas distintas.<br>
          ⚠ CPI: si score=null, infScore=0 silenciosamente — puede ocultar señal de inflación.<br>
          ⚠ Score Total del Radar ≠ scoreTotal del Motor Macro (son agregaciones distintas). Ver HIST_MACRO_V1 para referencia canónica.
        </div>
      </div>
    `;
  }
  document.getElementById('radar-refresh')?.addEventListener('click',()=>load(true));
  await load(false);
  return{destroy(){}};
}
