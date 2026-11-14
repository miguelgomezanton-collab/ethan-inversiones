import{g as re,a as ee,s as se}from"./macro-data-CGVdt8ED.js";const l=a=>a!=null?Number(a).toFixed(2):"—",S=a=>a!=null?(a>=0?"+":"")+Number(a).toFixed(2):"—",M=a=>a>0?"var(--green)":a===0?"var(--amber)":"var(--red)";function oe(a){if(a==null||isNaN(a))return"—";const t=Number(a).toFixed(2)+"%",s=Math.round(a*100)+" pb";return`${t} <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">(${s})</span>`}function te(a,t){return a==="stale"||a==="missing"?`<span style="background:var(--red);color:#fff;font-size:8px;font-weight:700;font-family:var(--mono);padding:2px 6px;border-radius:3px;letter-spacing:0.05em;">STALE${t!=null?" "+t+"d":""}</span>`:a==="warn"?`<span style="background:var(--amber);color:#1a1a1a;font-size:8px;font-weight:700;font-family:var(--mono);padding:2px 6px;border-radius:3px;">${t}d</span>`:`<span style="background:var(--green);color:#fff;font-size:8px;font-weight:700;font-family:var(--mono);padding:2px 6px;border-radius:3px;">✓ ${t!=null?t+"d":"OK"}</span>`}function f(a,t){return`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border2);font-size:9px;">
    <span style="color:var(--text3);font-family:var(--mono);">${a}</span>
    <span style="color:var(--text2);font-family:var(--mono);font-weight:600;">${t??"—"}</span>
  </div>`}function A(a){return a==null?"var(--text3)":a>0?"var(--red)":a<0?"var(--green)":"var(--text3)"}function ae(a,t,s="NO DATA — HY OAS unavailable"){if(!t)return`<div class="co-liq-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:120px;gap:6px;">
    <span style="font-size:11px;color:var(--text3);font-family:var(--mono);">${s}</span>
    <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Verificar FRED BAMLH0A0HYM2</span>
  </div>`;const u=te(t.freshness,t.ageDays),v=t.percentile!=null?t.percentile>=75?"var(--red)":t.percentile>=40?"var(--amber)":"var(--green)":"var(--text3)",d=!(t.insufficientHistory===!0)&&t.zscore3y!=null?`<span style="color:${t.zscore3y>1.5?"var(--red)":t.zscore3y<-1?"var(--green)":"var(--text2)"};">${t.zscore3y.toFixed(2)}</span>`:'<span style="color:var(--text3);font-size:8px;">INSUFFICIENT HISTORY</span>',m=t.dateFrom&&t.date?`${t.dateFrom} → ${t.date}`:t.date||"—";return`<div class="co-liq-card">
    <div class="co-liq-card-header">
      <span class="co-liq-card-title">${a}</span>
      ${u}
    </div>
    <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:var(--text1);margin:6px 0 2px;">
      ${t.stale?'<span style="font-size:14px;color:var(--text3);">STALE</span>':oe(t.value)}
    </div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${t.source||"—"}</div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:8px;">
      ${m} · <span style="color:var(--text2);">${t.nObs!=null?t.nObs+" obs":"—"}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:1px;">
      ${f("Pct. LT",t.percentile!=null?`<span style="color:${v};font-weight:700;">${t.percentile}%</span>`:"—")}
      ${f("Z-score 3Y",d)}
      ${f("Var 20s",t.var20!=null?`<span style="color:${A(t.var20)}">${t.var20>=0?"+":""}${t.var20.toFixed(2)}%</span>`:"—")}
      ${f("Var 60s",t.var60!=null?`<span style="color:${A(t.var60)}">${t.var60>=0?"+":""}${t.var60.toFixed(2)}%</span>`:"—")}
      ${f("vs SMA200",t.trendVsSma200!=null?`<span style="color:${t.trendVsSma200==="above"?"var(--red)":"var(--green)"}">${t.trendVsSma200==="above"?"▲ Por encima":"▼ Por debajo"}</span>`:"—")}
    </div>
    <div style="margin-top:6px;font-size:8px;color:var(--amber);font-family:var(--mono);font-weight:700;">RESEARCH / DIAGNOSTIC ONLY</div>
  </div>`}function le(a,t,s){if(!a)return`<div class="co-liq-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:120px;gap:6px;">
      <span style="font-size:11px;color:var(--text3);font-family:var(--mono);">NO DATA — Gap no calculable</span>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Falta: ${!t&&!s?"BBB + HY OAS":s?"BBB OAS (BAMLC0A4CBBB)":"HY OAS (BAMLH0A0HYM2)"}</span>
    </div>`;const u=te(a.freshness,null),v=a.percentile!=null?a.percentile>=75?"var(--red)":a.percentile>=40?"var(--amber)":"var(--green)":"var(--text3)",y=a.dateFrom&&a.date?`${a.dateFrom} → ${a.date}`:a.date||"—",m=!(a.insufficientHistory===!0)&&a.zscore3y!=null?`<span style="color:${a.zscore3y>1.5?"var(--red)":a.zscore3y<-1?"var(--green)":"var(--text2)"};">${a.zscore3y.toFixed(2)}</span>`:'<span style="color:var(--text3);font-size:8px;">INSUFFICIENT HISTORY</span>';return`<div class="co-liq-card">
    <div class="co-liq-card-header">
      <span class="co-liq-card-title">📐 HY–BBB Gap</span>
      ${u}
    </div>
    <div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:var(--text1);margin:6px 0 2px;">
      ${a.stale?'<span style="font-size:14px;color:var(--text3);">STALE</span>':oe(a.value)}
    </div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">calc: BAMLH0A0HYM2 − BAMLC0A4CBBB</div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:8px;">
      ${y} · <span style="color:var(--text2);">${a.nObs!=null?a.nObs+" obs":"—"}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:1px;">
      ${f("Pct. LT",a.percentile!=null?`<span style="color:${v};font-weight:700;">${a.percentile}%</span>`:"—")}
      ${f("Z-score 3Y",m)}
      ${f("Var 20s",a.var20!=null?`<span style="color:${A(a.var20)}">${a.var20>=0?"+":""}${a.var20.toFixed(2)}%</span>`:"—")}
      ${f("Var 60s",a.var60!=null?`<span style="color:${A(a.var60)}">${a.var60>=0?"+":""}${a.var60.toFixed(2)}%</span>`:"—")}
      ${f("vs SMA200",a.trendVsSma200!=null?`<span style="color:${a.trendVsSma200==="above"?"var(--red)":"var(--green)"}">${a.trendVsSma200==="above"?"▲ Por encima":"▼ Por debajo"}</span>`:"—")}
    </div>
    <div style="margin-top:6px;font-size:8px;color:var(--amber);font-family:var(--mono);font-weight:700;">RESEARCH / DIAGNOSTIC ONLY</div>
  </div>`}function ne(a){let t=0,s=0;const u=12,v={};for(const[n,g]of Object.entries(a))(g==null?void 0:g.score)!=null&&(t+=g.score,s+=Math.abs(g.weight||1),v[n]=g.score);const y=+(s/u).toFixed(3);let d,m,e;return t>=4?(d="Liquidez Expansiva",m="var(--green)",e="Combustible para el ciclo"):t>=0?(d="Liquidez Neutral",m="var(--amber)",e="Mixto — selectividad clave"):t>=-4?(d="Liquidez Contractiva",m="var(--red)",e="El dinero se retira del sistema"):(d="Drenaje Severo",m="var(--red)",e="Riesgo sistémico — reducir exposición"),{title:d,c:m,sub:e,score:t,maxAvailable:s,coverage:y,detail:v}}function ie(a){var s,u,v;const t=[];return((s=a.m2)==null?void 0:s.value)!=null&&t.push(a.m2.value>=5?`El <strong>M2 crece fuerte</strong> (+${l(a.m2.value)}% YoY) — combustible para el ciclo`:a.m2.value>=3?`El <strong>M2 crece moderadamente</strong> (+${l(a.m2.value)}% YoY)`:`El <strong>M2 está por debajo del umbral</strong> (${S(a.m2.value)}% YoY) — presión sobre activos de riesgo`),((u=a.impulso)==null?void 0:u.value)!=null&&t.push(a.impulso.value>=1?`el <strong>impulso crediticio es fuerte</strong> (+${l(a.impulso.value)})`:a.impulso.value>=.5?`el impulso crediticio es positivo (+${l(a.impulso.value)})`:`el <strong>impulso crediticio es negativo</strong> (${l(a.impulso.value)}) — frena el gasto con 6-9 meses de retardo`),((v=a.reservas)==null?void 0:v.value)!=null&&t.push(a.reservas.value>=3.5?`las reservas bancarias son abundantes ($${l(a.reservas.value)}T)`:a.reservas.value>=2.5?`las reservas están en nivel bajo ($${l(a.reservas.value)}T) — QT activo de la Fed`:`las <strong>reservas son insuficientes</strong> ($${l(a.reservas.value)}T) — riesgo de credit crunch`),t.join(". ")+(t.length?".":"Introduce los datos manuales para obtener el diagnóstico de liquidez.")}function ce(a,t,s="var(--green)",u="var(--red)"){const v=Math.min(Math.abs(a||0)/t*50,50);return`<div style="position:relative;height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;">
    ${(a||0)>=0?`<div style="position:absolute;left:50%;width:${v}%;height:100%;background:${s};border-radius:0 4px 4px 0;"></div>`:`<div style="position:absolute;right:50%;width:${v}%;height:100%;background:${u};border-radius:4px 0 0 4px;"></div>`}
    <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:var(--border2);"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);font-family:var(--mono);">
    <span style="color:${u}">Contractivo</span><span>0</span><span style="color:${s}">Expansivo</span>
  </div>`}function h(a,t,s,u,v,y){if(!s)return"";const d=M(s.score),m=s.label==="Reservas Bancarias Fed"?s.value!=null?"$"+l(s.value)+"T":"—":s.value!=null?S(s.value)+"%":"—",e=t.includes("Reservas")?2:t.includes("M2")?10:t.includes("Crédito vs")?8:5,n=t.includes("Reservas")?s.value!=null?s.value-3:null:s.value,g=u?`<div class="audit-toggle" onclick="this.classList.toggle('open')">
    <span class="audit-lbl">Metodología ▾</span>
    <div class="audit-body">${typeof u=="string"?u:""}</div>
  </div>`:"";return`<div class="co-liq-card">
    <div class="co-liq-card-header">
      <span class="co-liq-card-title">${a} ${t}</span>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">${s.date||"—"}${s.manual?" · ✎":""}</span>
    </div>
    <div style="font-family:var(--serif);font-size:32px;font-weight:600;font-style:italic;color:${d};">${m}</div>
    <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">${v}</div>
    ${s.value!=null&&n!=null?ce(n,e):'<div style="height:8px;background:var(--surface2);border-radius:4px;margin:8px 0 4px;"></div>'}
    <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-top:8px;">${y(s.score,s.value)}</div>
    ${g}
  </div>`}function de(a,t,s,u,v){return`<div class="co-manual-row">
    <div><div style="font-size:11px;color:var(--text2);font-weight:600;">${t}</div><div style="font-size:9px;color:var(--text3);">${s}</div></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <input type="number" class="liq-manual-input" data-key="${a}" value="${v??""}" placeholder="—" step="0.1" style="width:72px;">
      <span style="font-size:10px;color:var(--text3);">${u}</span>
    </div>
  </div>`}async function ve(a,{actionsSlot:t}){var v,y;t.innerHTML=`
    <button class="btn" id="liq-edit">✎ Editar manuales</button>
    <button class="btn btn-primary" id="liq-refresh">↻ Actualizar</button>
  `,a.innerHTML='<div id="liq-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function s(d=!1){try{const m=await re(d);u(m)}catch(m){document.getElementById("liq-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${m.message}</div></div>`}}function u(d){var O,E,L,Y,z,C,I,T,R,D,w,N,F,q,H,V;const m=document.getElementById("liq-wrap"),e=d.liquidez||{},n=ne(e),g=ee();m.innerHTML=`
      <!-- HERO -->
      <div class="co-verdict-block" style="margin-bottom:16px;">
        <div class="co-score-wrap">
          <div class="co-score-num" style="color:${n.c}">${n.score>=0?"+":""}${n.score}</div>
          <div class="co-score-max">puntos liq.</div>
          <div class="co-score-gauge"><div class="co-score-gauge-fill" style="width:${Math.max(0,(n.score+13)/26*100)}%;background:${n.c};"></div></div>
        </div>
        <div class="co-verdict-center">
          <div class="co-verdict-label">Régimen de liquidez · ${d.updatedAt?new Date(d.updatedAt).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}):"—"}</div>
          <div class="co-verdict-title" style="color:${n.c}">${n.title}</div>
          <div class="co-verdict-phrase">${ie(e)}</div>
        </div>
        <div class="co-verdict-right">
          ${((O=e.m2)==null?void 0:O.value)!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">M2 Global</div><div class="co-verdict-mini-val" style="color:${M(e.m2.score)}">${S(e.m2.value)}%</div><div class="co-verdict-mini-sub">YoY · ×3</div></div>`:""}
          ${((E=e.reservas)==null?void 0:E.value)!=null?`<div class="co-verdict-mini"><div class="co-verdict-mini-label">Reservas Fed</div><div class="co-verdict-mini-val" style="color:${M(e.reservas.score)}">$${l(e.reservas.value)}T</div><div class="co-verdict-mini-sub">${e.reservas.score>0?">$3.5T":e.reservas.score===-1?"$2.5-3.4T":"<$2.5T"}</div></div>`:""}
        </div>
      </div>

      <!-- PANEL MANUALES -->
      <div id="liq-manual-panel" style="display:none;background:var(--surface);border:1px dashed var(--border2);border-radius:12px;padding:18px 20px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">✎ Input Manual — China M2</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:14px;">
          USA (FRED), Eurozona (ECB) y Japón (BOJ) son ahora <strong style="color:var(--teal)">100% automáticos</strong>.
          Solo China M2 YoY requiere input manual — el PBoC no tiene API pública gratuita estable.
          Sin este dato, el M2 Global se calcula con 3 regiones (~70% del total).
        </div>
        ${de("chinaM2","China M2 YoY (%)","Fuente: PBoC · publicación mensual · peso ~30% del M2 Global","%",g.chinaM2)}
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-primary" id="liq-save-manuals">Guardar y actualizar</button>
          <button class="btn" id="liq-close-manuals">Cancelar</button>
        </div>
      </div>

      <!-- GRID 6 CARDS -->
      <div class="co-liq-grid3">
        ${h("💵","M2 Global",e.m2,(L=e.m2)!=null&&L.auto?(()=>{var $,P,k,G,j,U,J,W,K;const o=e.m2.components||{},r=b=>b==="ok"?"✓ OK":b==="stale"?"✗ STALE":b==="manual"?"✎ manual":"— missing",p=(b,_,x)=>{const c=o[_];if(!c)return`${x}: —`;if(c.error)return`${x}: ⚠ ${c.error}${c.fallbackReason?" ("+c.fallbackReason+")":""}${c.source?" ["+c.source+"]":""}`;const i=c.source?` [${c.source}${c.fallbackReason?" · "+c.fallbackReason:""}]`:"",B=c.isOfficialYoY?"YoY oficial BOJ":"YoY calc.",Z=c.baseDate?` | base ${c.baseDate}`:c.isOfficialYoY?" | YoY directo BOJ":"";return`${x}: ${c.currentDate||"—"} | ${B} ${c.yoy!=null?(c.yoy>=0?"+":"")+l(c.yoy)+"%":"—"}${Z} | ${c.ageDays!=null?c.ageDays+"d":"-"} · ${r(c.freshness)}${i}`};return[p(!0,"us","USA FRED M2SL"),p(!0,"eur","EUR ECB BSI"),p(!0,"jp","JPN BOJ"),`CHN: ${($=o.chn)!=null&&$.valid?o.chn.source==="manual override"?`${l(o.chn.yoy)}% (manual override)`:`${o.chn.currentDate||"—"} | YoY calc. ${o.chn.yoy!=null?(o.chn.yoy>=0?"+":"")+l(o.chn.yoy)+"%":"—"} | base ${o.chn.baseDate||"—"} | N=${o.chn.nObs||"—"} | ${o.chn.ageDays!=null?o.chn.ageDays+"d":"-"} · ✓ OK [${o.chn.source||"—"}]`:(()=>{var x,c;const b=((x=o.chn)==null?void 0:x.diag)||{};return'<span style="color:var(--red)">⚠ MISSING</span><br>'+(((c=o.chn)==null?void 0:c.diagAll)||[b]).map((i,B)=>{var Q,X;return[`Fuente ${B+1} [${i.source||"—"}]: HTTP ${i.httpStatus||"—"} · branch:${i.parserBranch||"—"} · nObs:${i.nObsReceived||0}→${i.nObsParsed||0}`,(Q=i.last3)!=null&&Q.length?`Más recientes: ${i.last3.join(" | ")}`:null,(X=i.first3)!=null&&X.length?`Más antiguas: ${i.first3.join(" | ")}`:null,i.latestDate?`current: ${i.latestDate} = ${i.latestValue}`:null,i.targetBaseDate?`target base: ${i.targetBaseDate}`:null,i.baseDate?`base found: ${i.baseDate} = ${i.baseValue} (Δ${i.baseDeltaDays}d)`:null,i.yoyCalc?`YoY calc: ${i.yoyCalc}`:null,i.failReason?`<strong style="color:var(--red)">FAIL: ${i.failReason}</strong>`:null,i.error?`Error: ${i.error}`:null].filter(Boolean).join("<br>")}).join("<br>---<br>")})()}`,`Cobertura: ${e.m2.coverageWeight||"—"}/100 (mín. 60) · Global YoY: ${e.m2.value!=null?(e.m2.value>=0?"+":"")+l(e.m2.value)+"%":"bloqueado"} · Estado: <strong style="color:${((P=e.m2.audit)==null?void 0:P.aggregateStatus)==="OK"?"var(--green)":((k=e.m2.audit)==null?void 0:k.aggregateStatus)==="PARTIAL"?"var(--amber)":"var(--red)"};">${((G=e.m2.audit)==null?void 0:G.aggregateStatus)||"—"}</strong>${(j=e.m2.audit)!=null&&j.renormalized?" · Pesos renormalizados (missing: "+((W=(J=(U=e.m2.audit)==null?void 0:U.missingRegions)==null?void 0:J.join(", "))==null?void 0:W.toUpperCase())+")":""}`,`<span style="color:var(--text3);font-size:9px;">Metodología: media ponderada YoY | Pesos USA=35 EUR=25 JPN=10 CHN=30 | ${(K=e.m2.audit)!=null&&K.historicalProxy?"HIST_MACRO_V1 usa M2SL USA como HISTORICAL_PROXY para pre-2016":""}</span>`].join("<br>")})():"YoY — estimado global (Fed+ECB+PBOC+BoJ)","≥+5.0%→+3  ·  +3.0-4.9%→+1  ·  <+3.0%→−3  ·  peso ×3 · min.cobertura 60/100",(o,r)=>o>0?`<strong style="color:var(--green)">+${o} pts.</strong> M2 creciendo — combustible para el ciclo y expansión de múltiplos.`:o===0?'<strong style="color:var(--amber)">0 pts.</strong> M2 entre +3% y +5% — ciclo sostenido pero sin exceso monetario.':r!=null?`<strong style="color:var(--red)">${o} pts.</strong> M2 bajo umbral — presión sobre activos de riesgo con 6-12m de retardo.`:'Sin datos o cobertura insuficiente (<60/100). Introduce China M2 YoY% con "Editar manuales" para mejorar cobertura.')}

        ${h("📈","Crédito vs Nominal GDP",e.credito,(Y=e.credito)!=null&&Y.auto?(()=>{const o=e.credito.tl||{},r=e.credito.gdp||{},p=$=>$==="ok"?"✓ OK":$==="warn"?"⚠ WARN":$==="stale"?"✗ STALE":"—";return["Metodología — Crédito vs PIB",`TOTLL: ${o.date||"—"} | base ${o.baseDate||"—"} | ${o.ageDays!=null?o.ageDays+"d":"—"} · ${p(o.freshness)}${o.error?" ⚠ "+o.error:""}`,`GDP:   ${r.date||"—"} | base ${r.baseDate||"—"} | ${r.ageDays!=null?r.ageDays+"d":"—"} · ${p(r.freshness)}${r.error?" ⚠ "+r.error:""}`,`CreditYoY: ${e.credito.creditYoY!=null?(e.credito.creditYoY>=0?"+":"")+l(e.credito.creditYoY)+"%":"—"} | GdpYoY: ${e.credito.gdpYoY!=null?(e.credito.gdpYoY>=0?"+":"")+l(e.credito.gdpYoY)+"%":"—"} | Diff: ${e.credito.value!=null?(e.credito.value>=0?"+":"")+l(e.credito.value)+"%":"—"}`,`Score: ${e.credito.score!=null?e.credito.score:"bloqueado"}${e.credito.stale?" · STALE":""}`].join("<br>")})():"Manual override","≥+3.0%→+3  ·  +1.5-2.9%→0  ·  <+1.5%→−3  ·  PROVISIONAL · peso ×3",(o,r)=>o>0?`<strong style="color:var(--green)">+${o} pts.</strong> Crédito crece significativamente más que el PIB nominal — expansión financiera.`:o===0?'<strong style="color:var(--amber)">0 pts.</strong> Crédito crece moderadamente más que el nominal — impulso leve.':r!=null&&r>0?`<strong style="color:var(--amber)">${o} pts.</strong> Crédito crece más que el PIB nominal (+${typeof r=="number"?r.toFixed(2):r} pp) pero por debajo del umbral de señal. <em>Scoring provisional.</em>`:r!=null&&r<=0?`<strong style="color:var(--red)">${o} pts.</strong> Crédito crece menos que el PIB nominal — desapalancamiento bancario.`:`<strong style="color:var(--red)">${o} pts.</strong> Sin datos suficientes.`)}

        ${h("⚡","Impulso Crediticio",e.impulso,(z=e.impulso)!=null&&z.auto?(()=>{const o=e.impulso.current||{},r=e.impulso.point3m||{},p=$=>$==="ok"?"✓ OK":$==="warn"?"⚠ WARN":$==="stale"?"✗ STALE":"—";return["Metodología — Impulso Crediticio",`Actual:  ${o.date||"—"} | base ${o.baseDate||"—"} | ${o.ageDays!=null?o.ageDays+"d":"—"} · ${p(o.freshness)}`,`Hace 3M: ${r.date||"—"} | base ${r.baseDate||"—"}`,`YoY actual: ${e.impulso.yoyNow!=null?(e.impulso.yoyNow>=0?"+":"")+l(e.impulso.yoyNow)+"%":"—"} | YoY 3M atrás: ${e.impulso.yoy3mAgo!=null?(e.impulso.yoy3mAgo>=0?"+":"")+l(e.impulso.yoy3mAgo)+"%":"—"}`,`Impulso (diff): ${e.impulso.value!=null?(e.impulso.value>=0?"+":"")+l(e.impulso.value)+" pp":"—"}`,`Score: ${e.impulso.score!=null?e.impulso.score:"bloqueado"}${e.impulso.stale?" · STALE":""}${e.impulso.error?" · ⚠ "+e.impulso.error:""}`].join("<br>")})():"Manual override","≥+1.0→+2  ·  +0.5-0.9→+1  ·  <+0.5→−2  ·  PROVISIONAL · peso ×2",(o,r)=>o>=2?'<strong style="color:var(--green)">+2 pts.</strong> Impulso fuerte — crédito acelerando.':o===1?'<strong style="color:var(--green)">+1 pt.</strong> Impulso positivo moderado.':r!=null&&r>=0?`<strong style="color:var(--amber)">${o} pts.</strong> Crédito creciendo pero desacelerando — impulso negativo. <em>Scoring provisional.</em>`:`<strong style="color:var(--red)">${o} pts.</strong> Crédito desacelerando — contracción del impulso crediticio.`)}

        ${h("🔄","Velocidad M2",e.velM2,(C=e.velM2)!=null&&C.auto?(()=>{const o=e.velM2,r=p=>p==="ok"?"✓ OK":p==="warn"?"⚠ WARN":p==="stale"?"✗ STALE":"—";return["Metodología — Velocidad M2",`M2V actual: ${o.date||"—"} | ${o.rawValue!=null?o.rawValue.toFixed(4):"—"}`,`Base:       ${o.baseDate||"—"} | ${o.baseValue!=null?o.baseValue.toFixed(4):"—"}`,`YoY: ${o.value!=null?(o.value>=0?"+":"")+l(o.value)+"%":"—"} | ${o.ageDays!=null?o.ageDays+"d":"—"} · ${r(o.freshness)}`,`Score: ${o.score!=null?o.score:"bloqueado"}${o.stale?" · STALE":""} · Fuente: FRED M2V [PROVISIONAL]`].join("<br>")})():"YoY · FRED M2V (trimestral) · automático","≥0%→+2  ·  −1.5 a −0.1%→−1  ·  <−1.5%→−2  ·  PROVISIONAL · peso ×2",(o,r)=>o>=2?`<strong style="color:var(--green)">+2 pts.</strong> Velocidad M2 ${r!=null?(r>=0?"+":"")+l(r)+"% interanual":"—"}. Scoring provisional.`:o===-1?`<strong style="color:var(--amber)">−1 pt.</strong> Velocidad M2 ${r!=null?(r>=0?"+":"")+l(r)+"% interanual":"—"}. Scoring provisional.`:`<strong style="color:var(--red)">${o??"—"} pts.</strong> Velocidad M2 ${r!=null?(r>=0?"+":"")+l(r)+"% interanual":"—"}. Scoring provisional.`)}

        ${h("🏦","Reservas Bancarias Fed",e.reservas,(I=e.reservas)!=null&&I.auto?(()=>{const o=e.reservas,r=p=>p==="ok"?"✓ OK":p==="warn"?"⚠ WARN":p==="stale"?"✗ STALE":"—";return["Metodología — Reservas Bancarias",`Fecha: ${o.date||"—"} | Bruto FRED: ${o.rawValueM!=null?Number(o.rawValueM).toLocaleString("es-ES")+" $M":"—"} | Convertido: ${o.value!=null?"$"+o.value+"T":"—"}`,`Antigüedad: ${o.ageDays!=null?o.ageDays+"d":"—"} · ${r(o.freshness)} · Fuente: FRED WRESBAL`,`Score: ${o.score!=null?o.score:"bloqueado"}${o.stale?" · STALE":""} [PROVISIONAL · thresholds fijos $3.5T/$2.5T]`].join("<br>")})():"Valor absoluto en $T · FRED WRESBAL (semanal) · automático","≥$3.5T→+1  ·  $2.5-3.4T→−1  ·  <$2.5T→−2  ·  PROVISIONAL · peso ×1",(o,r)=>o>0?`<strong style="color:var(--green)">+1 pt.</strong> Reservas $${r}T — liquidez sistémica elevada. Scoring provisional.`:o===-1?`<strong style="color:var(--amber)">−1 pt.</strong> Reservas $${r}T — zona media. Scoring provisional.`:`<strong style="color:var(--red)">${o??"—"} pts.</strong> Reservas ${r!=null?"$"+r+"T":"—"}. Scoring provisional.`)}

      </div>

      <!-- SUBBLOQUE: CONDICIONES DE CRÉDITO -->
      <div style="margin-top:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
          <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;">📉 Condiciones de crédito</div>
          <span style="background:var(--amber);color:#1a1a1a;font-size:8px;font-weight:700;font-family:var(--mono);padding:2px 8px;border-radius:3px;letter-spacing:0.06em;">RESEARCH / DIAGNOSTIC ONLY</span>
          <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Sin impacto en Liquidity Score</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          ${ae("📊 BBB OAS",e.bbb,"NO DATA — BBB OAS unavailable")}
          ${ae("⚡ High Yield OAS",e.hyOas,"NO DATA — HY OAS unavailable")}
          ${le(e.hyBbbGap,e.bbb,e.hyOas)}
        </div>
        <div style="margin-top:8px;font-size:9px;color:var(--text3);font-family:var(--mono);line-height:1.6;">
          ⚠ Indicadores de diagnóstico · STALE si dato &gt;3 días hábiles (~5 días naturales) ·
          HY–BBB Gap muestra NO DATA si falta cualquiera de los dos spreads ·
          Pct. = percentil en serie histórica completa · Z-score = ventana 3Y (~756 sesiones) ·
          Fuentes: FRED BAMLC0A4CBBB · FRED BAMLH0A0HYM2 (ICE BofA)
        </div>
      </div>

      <!-- IMPLICACIONES -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-top:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;">💡 Implicaciones para la estrategia</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">
            Liquidity Score: <span style="color:${n.c};font-weight:700;">${n.score>=0?"+":""}${n.score}</span> / ${n.maxAvailable} · cobertura ${Math.round(n.coverage*100)}% · <span style="color:var(--amber)">PROVISIONAL</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:${n.c};margin-bottom:6px;text-transform:uppercase;">Renta Variable</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${n.score>=4?`Liquidity Score ${n.score>=0?"+":""}${n.score}: liquidez expansiva${((T=e.m2)==null?void 0:T.value)!=null?" · M2 Global +"+l(e.m2.value)+"%":""}.`:n.score>=0?`Liquidity Score ${n.score>=0?"+":""}${n.score}: liquidez neutral${((R=e.m2)==null?void 0:R.value)!=null?" · M2 Global "+S(e.m2.value)+"%":""}.`:`Liquidity Score ${n.score}: liquidez contractiva${((D=e.m2)==null?void 0:D.value)!=null?" · M2 Global "+S(e.m2.value)+"%":""}.`}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:var(--amber);margin-bottom:6px;text-transform:uppercase;">Crédito</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${((w=e.bbb)==null?void 0:w.value)!=null?`BBB OAS: ${l(e.bbb.value)}% (pct. ${e.bbb.percentile??"—"}%) — ${e.bbb.value<=1?"spreads contenidos.":e.bbb.value<=1.5?"spreads moderados.":"spreads elevados, estrés crediticio."}`:"BBB Spread no disponible."}
              ${((N=e.hyOas)==null?void 0:N.value)!=null?` HY OAS: ${l(e.hyOas.value)}% (pct. ${e.hyOas.percentile??"—"}%).`:""}
              ${((F=e.hyBbbGap)==null?void 0:F.value)!=null?` Gap HY–BBB: ${l(e.hyBbbGap.value)}% (pct. ${e.hyBbbGap.percentile??"—"}%).`:""}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:var(--blue);margin-bottom:6px;text-transform:uppercase;">Sizing</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">
              ${n.score>=4?"Liquidity Score expansivo: sizing normal.":n.score>=0?"Liquidity Score neutral: sizing moderado, stops ajustados.":"Liquidity Score contractivo: sizing conservador."}
              ${((q=e.reservas)==null?void 0:q.value)!=null?` Reservas Fed: $${l(e.reservas.value)}T.`:""}
              <span style="color:var(--text3);font-style:italic;"> Scoring provisional.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="co-footer" style="margin-top:16px;">Fuentes: FRED (M2SL, M2V, WRESBAL, BAMLC0A4CBBB, BAMLH0A0HYM2, TOTLL, GDP, USALOLITOAASTSAM) · ECB (M2 EUR, Curva EUR) · BOJ vía Cloudflare Worker proxy (M2 JPN) · ChinaData.live PBoC (M2 CHN — pendiente automatización) · Condiciones de crédito: RESEARCH/DIAGNOSTIC ONLY — sin impacto en Liquidity Score</div>
    `,(H=document.getElementById("liq-save-manuals"))==null||H.addEventListener("click",()=>{const o=ee();document.querySelectorAll(".liq-manual-input").forEach(r=>{const p=r.value.trim();o[r.dataset.key]=p!==""?parseFloat(p):null}),se(o),document.getElementById("liq-manual-panel").style.display="none",s(!0)}),(V=document.getElementById("liq-close-manuals"))==null||V.addEventListener("click",()=>{document.getElementById("liq-manual-panel").style.display="none"})}return(v=document.getElementById("liq-refresh"))==null||v.addEventListener("click",()=>s(!0)),(y=document.getElementById("liq-edit"))==null||y.addEventListener("click",()=>{const d=document.getElementById("liq-manual-panel");d&&(d.style.display=d.style.display==="none"?"block":"none")}),await s(!1),{destroy(){}}}export{ve as render};
