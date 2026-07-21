import{g as Y}from"./macro-data-CGVdt8ED.js";const c=o=>o!=null?Number(o).toFixed(2):"—";function j(o){return o==null?"var(--text3)":o>.6?"var(--green)":o>.3?"var(--teal)":o>-.3?"var(--text3)":o>-.6?"var(--amber)":"var(--red)"}function I(o){return o==null?"—":(o>=0?"+":"")+c(o)}async function G(o,{actionsSlot:q}){var v;q.innerHTML='<button class="btn btn-primary" id="corr-refresh">↻ Recalcular</button>',o.innerHTML='<div id="corr-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Calculando correlaciones...</div></div></div>';async function p(){const a=document.getElementById("corr-wrap");a.innerHTML='<div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div><div class="empty-desc">SP500 · Nasdaq · Russell · Oro · Bonos · Dólar · Indicadores FRED</div></div>';try{const[e,d]=await Promise.all([Y(!1),fetch("/api/macro-history?type=correlaciones").then(r=>{if(!r.ok)throw new Error("macro-history: "+r.status);return r.json()})]);A(e,d)}catch(e){document.getElementById("corr-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`}}function A(a,e){var y,b,f,g,h,$,C,D,S,w,R,z,E,L;const d=document.getElementById("corr-wrap"),r=e.correlaciones||{},m=e.n_months||0,s=a.coyuntura||{},n=a.liquidez||{},u=a.indicators||{},F=["SP500","Nasdaq","Russell","Oro","Bonos (IEF)","Dólar (DXY)"],P=["sp","nq","ru","au","bond","dxy"],M=[{name:"Curva USD (10Y−2Y)",key:"curvaUSD",val:(y=s.curvaUSD)==null?void 0:y.value,unit:"%",col:(b=s.curvaUSD)==null?void 0:b.score},{name:"Tipo Real (FFR−CPI)",key:"tipoReal",val:(f=s.tipoReal)==null?void 0:f.value,unit:"%",col:(g=s.tipoReal)==null?void 0:g.score},{name:"BBB Spread",key:"bbb",val:(h=n.bbbSpread)==null?void 0:h.value,unit:"%",col:($=n.bbbSpread)==null?void 0:$.score},{name:"Crédito vs Nominal",key:"creditoVsNominal",val:(C=n.credito)==null?void 0:C.value,unit:"%",col:(D=n.credito)==null?void 0:D.score}],T=[{name:"M2 Global YoY ✎",sp:.81,nq:.88,ru:.76,au:.42,bond:-.35,dxy:-.58,val:(w=(S=a.liquidez)==null?void 0:S.m2)==null?void 0:w.value,unit:"%"},{name:"LEI USA ✎",sp:.68,nq:.65,ru:.73,au:-.22,bond:.08,dxy:-.31,val:(R=u.lei)==null?void 0:R.value,unit:"%"},{name:"Impulso Crediticio ✎",sp:.71,nq:.79,ru:.69,au:.18,bond:-.28,dxy:-.42,val:(z=n.impulso)==null?void 0:z.value},{name:"Fear & Greed",sp:-.34,nq:-.38,ru:-.31,au:-.14,bond:.09,dxy:-.05,val:(E=u.fearGreed)==null?void 0:E.value}],k="padding:9px 10px;text-align:center;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);font-weight:600;",x=t=>`padding:9px 10px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;font-weight:700;color:${j(t)};`;function N(t){const l=r[t.key]||{},i=t.col!=null?t.col>0?"var(--green)":t.col===0?"var(--amber)":"var(--red)":"var(--text3)";return`<tr>
        <td style="padding:9px 12px;border-bottom:1px solid var(--border);font-weight:600;">${t.name} <span style="font-size:8px;color:var(--teal);font-family:var(--mono);">CALC</span></td>
        ${P.map(B=>`<td style="${x(l[B])}">${I(l[B])}</td>`).join("")}
        <td style="padding:9px 10px;border-bottom:1px solid var(--border);font-size:10px;color:${i};">${t.val!=null?(t.val>=0?"+":"")+c(t.val)+(t.unit||""):"—"}</td>
      </tr>`}function U(t){const l=[t.sp,t.nq,t.ru,t.au,t.bond,t.dxy];return`<tr>
        <td style="padding:9px 12px;border-bottom:1px solid var(--border);font-weight:600;">${t.name}</td>
        ${l.map(i=>`<td style="${x(i)}">${I(i)}</td>`).join("")}
        <td style="padding:9px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--text3);">${t.val!=null?(t.val>=0?"+":"")+c(t.val)+(t.unit||""):"—"}</td>
      </tr>`}d.innerHTML=`
      <div style="font-size:11px;color:var(--text3);margin-bottom:12px;line-height:1.5;">
        Correlación de Pearson calculada en el servidor con <strong style="color:var(--text1)">${m} meses</strong> de datos históricos.
        <span style="color:var(--teal);font-family:var(--mono);font-size:9px;">CALC</span> = calculado automáticamente.
        <strong style="color:var(--amber)">✎</strong> = estimación histórica (indicador manual sin serie auto).
      </div>
      <div style="font-size:9px;font-family:var(--mono);color:var(--text3);margin-bottom:12px;">
        <span style="color:var(--green)">■</span> >+0.60 &nbsp;
        <span style="color:var(--teal)">■</span> +0.30-0.60 &nbsp;
        <span style="color:var(--text3)">■</span> ±0.30 &nbsp;
        <span style="color:var(--amber)">■</span> −0.30 a −0.60 &nbsp;
        <span style="color:var(--red)">■</span> <−0.60
      </div>
      <div class="mac-card">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:9px 12px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);border-bottom:1px solid var(--border);">Indicador</th>
            ${F.map(t=>`<th style="${k}">${t}</th>`).join("")}
            <th style="padding:9px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Valor actual</th>
          </tr></thead>
          <tbody>
            ${M.map(N).join("")}
            <tr><td colspan="8" style="padding:5px 12px;background:var(--surface2);font-size:9px;color:var(--text3);font-family:var(--mono);font-style:italic;">Indicadores manuales — correlaciones históricas estimadas</td></tr>
            ${T.map(U).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:10px;">
          ${(L=e.errors)!=null&&L.length?"⚠ "+e.errors.join(" · ")+" · ":""}Correlación de Pearson con retornos mensuales. Período: últimos ${m} meses. No constituyen recomendaciones de inversión.
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Calculado en servidor · Yahoo Finance (SP500, Nasdaq, Russell, Oro, IEF, DXY) · FRED (DGS10, DGS2, DFF, CPIAUCSL, BAMLC0A4CBBB, TOTLL, GDP)</div>
    `}return(v=document.getElementById("corr-refresh"))==null||v.addEventListener("click",p),await p(),{destroy(){}}}export{G as render};
