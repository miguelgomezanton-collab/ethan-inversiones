const P={curvaUSD:"Curva USD 10Y-2Y",tipoReal:"Tipo Real (FFR-CPI)",lei:"LEI (OECD CLI USA)",m2usa:"M2 USA YoY",creditoVsPib:"Crédito vs PIB",impulso:"Impulso Crediticio",velM2:"Velocidad M2",reservas:"Reservas Bancarias",bbb:"BBB Spread",scoreNorm:"HIST_MACRO_V1 ScoreNorm"},R=[0,3,6,12],S={0:"Coincidente",3:"+3M",6:"+6M",12:"+12M"};function w(v){if(v==null)return"var(--text3)";const u=Math.abs(v);return u>=.4?v>0?"var(--green)":"var(--red)":u>=.2?v>0?"#7abb7a":"#d4888a":"var(--text3)"}async function F(v,{actionsSlot:u}){var M;let m=6;u.innerHTML=`
    <div style="display:flex;gap:4px;align-items:center;">
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Horizonte:</span>
      ${R.map(n=>`<button class="btn corr-h ${n===6?"btn-primary":""}" data-h="${n}" style="padding:4px 9px;font-size:10px;">${S[n]}</button>`).join("")}
      <button class="btn btn-primary" id="corr-refresh" style="padding:4px 9px;font-size:10px;margin-left:6px;">↻</button>
    </div>`,v.innerHTML='<div id="corr-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function z(n=!1){try{const l=await fetch("/api/macro-history?type=correlaciones").then(s=>{if(!s.ok)throw new Error("macro-history: "+s.status);return s.json()});I(l)}catch(l){document.getElementById("corr-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${l.message}</div></div>`}}function N(n){var g,a,i,e,r;if(!n)return'<div style="font-size:9px;color:var(--text3);">Sin datos</div>';const l=t=>t!=null?(t>=0?"+":"")+t.toFixed(3):"—",s=t=>t==null?"var(--text3)":t>0?"var(--green)":"var(--red)",b=t=>t!=null&&t<.05?"*":"",$=[["Spearman vs retorno +12M continuo",n.return12m,n.n],["Spearman vs binario positivo +12M (1/0)",n.binary12m,n.n]].map(([t,o,p])=>'<div style="background:var(--surface2);border-radius:8px;padding:12px;"><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;">'+t+'</div><div style="font-family:var(--serif);font-size:28px;font-weight:600;font-style:italic;color:'+s(o==null?void 0:o.rho)+';">'+l(o==null?void 0:o.rho)+b(o==null?void 0:o.p)+'</div><div style="font-size:9px;color:var(--text3);font-family:var(--mono);">N='+p+" · p="+((o==null?void 0:o.p)!=null?o.p.toFixed(4):"—")+'</div><div style="font-size:9px;color:var(--text3);">IC95: '+(o!=null&&o.ci95?"["+o.ci95[0]+", "+o.ci95[1]+"]":"—")+"</div></div>").join(""),h='<div style="background:var(--surface2);border-radius:8px;padding:12px;margin-top:8px;"><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">Obs. no solapadas cada 12M (N independiente)</div><div style="font-size:13px;font-weight:700;font-family:var(--mono);color:'+s((g=n.binary12mNonOverlap)==null?void 0:g.rho)+';">'+l((a=n.binary12mNonOverlap)==null?void 0:a.rho)+b((i=n.binary12mNonOverlap)==null?void 0:i.p)+'</div><div style="font-size:9px;color:var(--text3);">N='+n.nNonOverlap+" · p="+(((e=n.binary12mNonOverlap)==null?void 0:e.p)!=null?n.binary12mNonOverlap.p.toFixed(4):"—")+" · IC95: "+((r=n.binary12mNonOverlap)!=null&&r.ci95?"["+n.binary12mNonOverlap.ci95[0]+", "+n.binary12mNonOverlap.ci95[1]+"]":"—")+"</div></div>";let f='<div style="font-size:9px;color:var(--amber);margin-top:8px;">Bootstrap no disponible</div>';if(n.binary12mBootstrap){const t=n.binary12mBootstrap,o=t.excludes0?"74,222,128":t.pBoot<.05?"64,217,192":"251,191,36",p=t.excludes0?"✓ IC95% excluye 0: señal robusta. ScoreNorm contiene información sobre probabilidad de retorno positivo a +12M.":t.pBoot<.05?"⚠ p<0.05 pero IC95 cruza 0 — señal sugestiva, no concluyente.":"⚠ IC95 cruza 0 — evidencia indicativa pero no robusta estadísticamente.",c=[["ρ observado",(t.rhoObs>=0?"+":"")+t.rhoObs.toFixed(3),t.rhoObs<0?"var(--red)":"var(--green)"],["IC95% bootstrap","["+t.ci95[0]+", "+t.ci95[1]+"]",t.excludes0?"var(--green)":"var(--amber)"],["p bootstrap",t.pBoot.toFixed(4)+(t.pBoot<.05?"*":""),t.pBoot<.05?"var(--green)":"var(--amber)"],["N / bloque",t.T+" / "+t.block+"M","var(--text2)"]].map(([x,d,y])=>'<div style="background:var(--surface);border-radius:6px;padding:8px 10px;text-align:center;"><div style="font-size:8px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">'+x+'</div><div style="font-family:var(--mono);font-size:13px;font-weight:700;color:'+y+';">'+d+"</div></div>").join("");f='<div style="background:rgba('+o+",0.06);border:1px solid rgba("+o+',0.25);border-radius:8px;padding:12px;margin-top:10px;"><div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:8px;">'+t.method+'</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px;">'+c+'</div><div style="font-size:9px;color:var(--text3);font-family:var(--mono);">'+p+"</div></div>"}return'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'+$+"</div>"+h+f+'<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">rho &lt; 0: ScoreNorm mayor asociado con menor probabilidad de retorno positivo a +12M.</div>'}function I(n){var h,f,g;const l=document.getElementById("corr-wrap"),s=n.corrMatrix;if(!s){l.innerHTML='<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos de correlación</div></div>';return}const b=s[m]||{},$=Object.entries(P).map(([a,i])=>{const e=b[a],r=e==null?void 0:e.rho,t=e==null?void 0:e.n,o=a==="scoreNorm";return`<tr style="border-bottom:1px solid var(--border);${o?"background:rgba(64,217,192,0.04);":""}">
        <td style="padding:8px 10px;font-size:10px;color:${o?"var(--teal)":"var(--text2)"};font-weight:${o?"700":"400"};">${i}</td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:12px;font-weight:700;color:${w(r)};">
          ${r!=null?(r>=0?"+":"")+r.toFixed(2):"—"}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:10px;color:var(--text3);">
          ${t??"—"}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:10px;color:${(e==null?void 0:e.p)!=null?e.p<.05?"var(--green)":"var(--amber)":"var(--text3)"};">
          ${(e==null?void 0:e.p)!=null?e.p<.001?"<0.001":e.p.toFixed(3):"—"}
        </td>
        <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:9px;color:var(--text3);">
          ${e!=null&&e.ci95?"["+e.ci95[0]+", "+e.ci95[1]+"]":"—"}
        </td>
        <td style="padding:8px 10px;">
          ${r!=null?`<div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.min(Math.abs(r)*100,100)}%;background:${w(r)};border-radius:3px;margin-left:${r<0?"auto":"0"};"></div>
          </div>`:""}
        </td>
      </tr>`}).join("");l.innerHTML=`
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <div>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">
              Correlaciones Lead-Lag · S&P 500
            </span>
            <span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:8px;">
              Indicador(t) → SP500 Forward Return ${S[m]}
            </span>
          </div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--text3);">
            HIST_MACRO_V1_FRED · Pearson · N≥20 obs
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Indicador macro</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">ρ Pearson</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">N obs</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">p-value</th>
            <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">IC 95%</th>
            <th style="padding:8px 10px;font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;">Intensidad</th>
          </tr></thead>
          <tbody>${$}</tbody>
        </table>

        <div style="margin-top:12px;font-size:9px;font-family:var(--mono);color:var(--text3);line-height:1.7;background:var(--surface2);padding:10px 12px;border-radius:6px;">
          ⚠ Correlaciones calculadas únicamente sobre SP500 (dataset FRED disponible).
          Nasdaq, Russell, Oro, Bonos e IEF pendientes de histórico suficiente.<br>
          Pearson mide relación lineal. No implica causalidad. Horizonte ${S[m]}: el indicador precede al retorno en ${m} meses.<br>
          ScoreNorm = scoreRaw / maxAvailable · misma metodología que Motor de Analogías.
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;font-family:var(--mono);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          🔍 Audit Trail — Verificación Lead-Lag (sin look-ahead)
        </div>
        ${(n.corrAudit||[]).map(a=>{var i;return a.error?`<div style="font-size:9px;color:var(--text3);margin-bottom:6px;">${a.month}: ${a.error}</div>`:`<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);">
            <div style="font-size:10px;color:var(--teal);font-weight:700;margin-bottom:4px;">
              ${a.month} · ScoreNorm ${a.scoreNorm>=0?"+":""}${(i=a.scoreNorm)==null?void 0:i.toFixed(3)} · SP0: ${a.sp0!=null?a.sp0:"—"}
            </div>
            ${a.rows.map(e=>{var r,t;return e.error?"":`
              <div style="font-size:9px;color:var(--text3);line-height:2;margin-left:8px;">
                ${e.label}: valor=${((t=(r=e.value)==null?void 0:r.toFixed)==null?void 0:t.call(r,3))??e.value} | score=${e.score>=0?"+":""}${e.score}
                → SP0:${a.sp0??"—"} | SP+3m:${e.sp3m!=null?(e.sp3m>=0?"+":"")+e.sp3m+"%":"—"}
                | SP+6m:${e.sp6m!=null?(e.sp6m>=0?"+":"")+e.sp6m+"% ("+e.sp6mDate+" nivel:"+e.sp6mRaw+")":"—"}
                | SP+12m:${e.sp12m!=null?(e.sp12m>=0?"+":"")+e.sp12m+"%":"—"}
              </div>`}).join("")}
          </div>`}).join("")}
        <div style="font-size:9px;color:var(--text3);margin-top:4px;">
          SP0 = nivel S&P 500 en el mes del indicador · SP+6m = nivel 6 meses después · forward return = SP+6m/SP0 − 1
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Distribución S&P 500 por Régimen Macro (ScoreNorm)
          <span style="color:var(--text3);font-weight:400;margin-left:8px;">¿Qué distribución de retornos ha tenido históricamente el S&P condicionado al régimen?</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:7px 10px;text-align:left;font-size:9px;color:var(--text3);">Régimen</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">N meses</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +3M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +6M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med +12M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">% Pos +12M</th>
            <th style="padding:7px 10px;text-align:center;font-size:9px;color:var(--text3);">Med MaxDD</th>
          </tr></thead>
          <tbody>
            ${(n.regimeAnalysis||[]).map(a=>{var p,c,x;const i=(p=a.byHorizon)==null?void 0:p[3],e=(c=a.byHorizon)==null?void 0:c[6],r=(x=a.byHorizon)==null?void 0:x[12],t=(d,y="%")=>d!=null?(d>=0?"+":"")+d.toFixed(1)+y:"—",o=d=>d==null?"var(--text3)":d>0?"var(--green)":"var(--red)";return`<tr style="border-bottom:1px solid var(--border);">
                <td style="padding:7px 10px;color:var(--text2);">${a.label} <span style="color:var(--text3);font-size:9px;">(${a.min.toFixed(2)} → ${a.max.toFixed(2)})</span></td>
                <td style="padding:7px 10px;text-align:center;color:var(--text3);">${a.nMonths}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${o(i==null?void 0:i.median)};">${t(i==null?void 0:i.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${o(e==null?void 0:e.median)};">${t(e==null?void 0:e.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${o(r==null?void 0:r.median)};">${t(r==null?void 0:r.median)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:${((r==null?void 0:r.pctPos)??0)>50?"var(--green)":"var(--red)"};">${(r==null?void 0:r.pctPos)!=null?r.pctPos+"%":"—"}</td>
                <td style="padding:7px 10px;text-align:center;font-family:var(--mono);color:var(--red);">${t(r==null?void 0:r.medianDD)}</td>
              </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          ⚠ Basado en SP500 disponible (${n.corrMatrix?"HIST_MACRO_V1_FRED":"—"}). N bajo = baja fiabilidad estadística. No implica predicción.
        </div>
      </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:10px;color:var(--text3);font-family:var(--mono);">
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Activos adicionales</div>
            Nasdaq, Russell, Oro, Bonos (IEF) cuando tengamos histórico FRED suficiente
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Significancia estadística</div>
            p-value y bandas de confianza 95% por celda
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px 12px;">
            <div style="color:var(--text2);font-weight:700;margin-bottom:4px;">Validación temporal</div>
            Correlaciones por décadas — ¿son estables o cambian de régimen?
          </div>
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Quintiles ScoreNorm → S&amp;P 500 Forward Return
          <span style="font-weight:400;margin-left:6px;">N equilibrado por rank secuencial · ¿existe monotonicidad?</span>
          ${((f=(h=n.quintiles)==null?void 0:h[0])==null?void 0:f.balanced)!==void 0?'<span style="color:'+(n.quintiles[0].balanced?"var(--green)":"var(--red)")+';">'+(n.quintiles[0].balanced?" ✓ BALANCE OK":" ✗ QUINTILE_BALANCE_FAIL")+"</span>":""}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Q</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Rango Score</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">N</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +3M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +6M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">Med +12M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">% Pos +12M</th>
            <th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">MaxDD</th>
          </tr></thead>
          <tbody>${(n.quintiles||[]).map(a=>{var p,c,x;const i=(d,y="%")=>d!=null?(d>=0?"+":"")+d.toFixed(1)+y:"—",e=d=>d==null?"var(--text3)":d>0?"var(--green)":"var(--red)",r=(p=a.byHorizon)==null?void 0:p[3],t=(c=a.byHorizon)==null?void 0:c[6],o=(x=a.byHorizon)==null?void 0:x[12];return'<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 8px;color:var(--teal);font-weight:700;font-family:var(--mono);">Q'+a.quintile+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);font-size:9px;color:var(--text3);">['+a.minScore+", "+a.maxScore+']</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:var(--text3);">'+((t==null?void 0:t.n)||a.nMonths)+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+e(r==null?void 0:r.median)+';">'+i(r==null?void 0:r.median)+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+e(t==null?void 0:t.median)+';">'+i(t==null?void 0:t.median)+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+e(o==null?void 0:o.median)+';">'+i(o==null?void 0:o.median)+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+(((o==null?void 0:o.pctPos)??0)>50?"var(--green)":"var(--red)")+';">'+((o==null?void 0:o.pctPos)!=null?o.pctPos+"%":"—")+'</td><td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:var(--red);">'+i(o==null?void 0:o.medianDD)+"</td></tr>"}).join("")}</tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;">
          Monotonicidad Q1→Q5: si +12M decrece consistentemente, Score tiene relación inversa con retorno futuro. Sin patrón → Score describe régimen, no anticipa retorno absoluto.
        </div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Estabilidad Temporal · Pearson +6M en 3 bloques iguales por N · * = p&lt;0.05
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Indicador</th>
            ${(((g=n.stabilityByIndicator)==null?void 0:g.tipoReal)||[]).map(a=>'<th style="padding:6px 8px;text-align:center;font-size:9px;color:var(--text3);">'+a.label+'<br><span style="font-weight:400;">'+a.window+"</span><br>N="+a.n+"</th>").join("")}
          </tr></thead>
          <tbody>
            ${["tipoReal","lei","bbb","scoreNorm"].map(a=>{var r;const i={tipoReal:"Tipo Real",lei:"LEI",bbb:"BBB Spread",scoreNorm:"ScoreNorm"},e=((r=n.stabilityByIndicator)==null?void 0:r[a])||[];return'<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 8px;color:var(--text2);">'+i[a]+"</td>"+e.map(t=>{if(t.lowN)return'<td style="padding:6px 8px;text-align:center;font-family:var(--mono);font-size:9px;color:var(--text3);">LOW N</td>';const o=t.rho==null?"var(--text3)":t.rho>0?"var(--green)":"var(--red)",p=t.p!=null&&t.p<.05?"*":"",c=t.ci95?" ["+t.ci95[0]+","+t.ci95[1]+"]":"";return'<td style="padding:6px 8px;text-align:center;font-family:var(--mono);color:'+o+';">'+(t.rho!=null?(t.rho>=0?"+":"")+t.rho.toFixed(2)+p:"—")+'<div style="font-size:8px;color:var(--text3);">'+(t.p!=null?"p="+t.p.toFixed(3):"—")+c+"</div></td>"}).join("")+"</tr>"}).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:6px;">* p&lt;0.05 · Si ρ cambia de signo entre bloques: relación de régimen, no estructural.</div>
      </div>

      <div class="mac-card" style="margin-bottom:14px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">
          Spearman ScoreNorm → S&amp;P 500 · Retorno +12M
        </div>
        ${N(n.spearman)}
      </div>

      </div>

      <div class="co-footer">
        Fuente: HIST_MACRO_V1_FRED · SP500 FRED mensual ·
        Correlaciones calculadas sobre meses con coverage≥60% · PROVISIONAL
      </div>
    `}return document.addEventListener("click",n=>{const l=n.target.closest(".corr-h");l&&(m=parseInt(l.dataset.h),document.querySelectorAll(".corr-h").forEach(s=>s.classList.remove("btn-primary")),l.classList.add("btn-primary"),z())}),(M=document.getElementById("corr-refresh"))==null||M.addEventListener("click",()=>z(!0)),await z(),{destroy(){}}}export{F as render};
