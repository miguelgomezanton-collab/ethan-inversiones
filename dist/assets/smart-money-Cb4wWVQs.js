import{UserData as _}from"./userdata-2NGQIm4_.js";import"./index-BgqbrflN.js";const T=(o,f=1)=>o!=null&&isFinite(o)?(o*100).toFixed(f)+"%":"—",O=o=>o!=null?Math.abs(o).toLocaleString("es-ES"):"—",V=o=>o&&o.length>=10?new Date(o+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}):o||"—",G=o=>o!=null?"$"+(o/1e6).toFixed(1)+"M":"—",H=o=>o!=null?Math.abs(o)>=1e9?"$"+(o/1e9).toFixed(1)+"B":"$"+(o/1e6).toFixed(0)+"M":"—",U=o=>`ethan_sm_hist_${o.toUpperCase()}`;async function K(o,f,h){try{const k=U(o),p=await _.get(k)||[],w=new Date().toISOString().slice(0,10);if(p.length&&p[p.length-1].date===w)return p;const l={date:w,shortFloat:f,instPct:h},b=[...p,l].slice(-12);return await _.set(k,b),b}catch{return[]}}async function Q(o){try{return await _.get(U(o))||[]}catch{return[]}}function q(o,f,h,k=T){if(!(f!=null&&f.length)||o==null)return"";const p=f.length>=2?f[f.length-2]:null;if(!p)return"";const l=p[h==="inst"?"instPct":"shortFloat"];if(l==null)return"";const b=o-l,E=Math.abs(b);if(E<.001)return`<span style="font-family:var(--mono);font-size:10px;color:var(--text3);">= sin cambio vs ${V(p.date)}</span>`;const z=b>0;return`<span style="font-family:var(--mono);font-size:10px;color:${(h==="inst"?z:!z)?"var(--green)":"var(--red)"};">${z?"▲":"▼"} ${k(E)} vs ${V(p.date)}</span>`}const N=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`];async function J(o){var f,h,k,p,w,l,b,E,z,C,A,I,B;try{const j=`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${o}?modules=defaultKeyStatistics,summaryDetail,financialData`;let t=null;for(const d of N)try{const v=new AbortController,m=setTimeout(()=>v.abort(),8e3),S=await fetch(d(j),{signal:v.signal});if(clearTimeout(m),!S.ok)continue;const u=await S.json();if(t=(h=(f=u==null?void 0:u.quoteSummary)==null?void 0:f.result)==null?void 0:h[0],t)break}catch{}const s=(t==null?void 0:t.defaultKeyStatistics)||{},r=(t==null?void 0:t.summaryDetail)||{},i=((k=s.floatShares)==null?void 0:k.raw)??null,e=((p=s.sharesOutstanding)==null?void 0:p.raw)??null,a=((w=r.marketCap)==null?void 0:w.raw)??null,c=((l=s.sharesPercentSharesOut)==null?void 0:l.raw)??null;let g=null;try{const d=`https://efts.sec.gov/LATEST/search-index?q=%22${o}%22&dateRange=custom&startdt=2024-01-01&forms=10-Q,10-K`,v=N[0](d),m=new AbortController,S=setTimeout(()=>m.abort(),8e3),u=await fetch(v,{signal:m.signal});if(clearTimeout(S),u.ok){const x=await u.json(),y=(E=(b=x==null?void 0:x.hits)==null?void 0:b.hits)==null?void 0:E[0];if(y){const L=`https://www.sec.gov${(z=y._source)!=null&&z.file_date?"/cgi-bin/browse-edgar?action=getcompany&CIK="+((C=y._source)==null?void 0:C.entity_id)+"&type=10-Q&dateb=&owner=include&count=1&search_text=":""}`;g={snippets:(I=(A=x==null?void 0:x.hits)==null?void 0:A.hits)==null?void 0:I.slice(0,3).map(D=>{var P,R,n;return((P=D._source)==null?void 0:P.period_of_report)+": "+(((n=(R=D.highlight)==null?void 0:R.file_date)==null?void 0:n[0])||"")}).filter(Boolean),filingDate:(B=y==null?void 0:y._source)==null?void 0:B.period_of_report}}}}catch{}let F=null;try{const d=`Empresa: ${o}
Capitalización: ${a?H(a):"—"}
Acciones en circulación: ${e?(e/1e6).toFixed(1)+"M":"—"}
Float: ${i?(i/1e6).toFixed(1)+"M":"—"}
Short interest: ${c?(c*100).toFixed(1)+"%":"—"}`,v=`Eres un analista financiero. Basándote en el conocimiento público sobre ${o}, estima el programa de recompra de acciones más reciente conocido.

Contexto actual de la empresa:
${d}

Responde SOLO con JSON sin markdown:
{
  "tienePrograma": true,
  "aprobadoTotal": 90000000000,
  "ejecutadoEstimado": 67000000000,
  "pendienteEstimado": 23000000000,
  "pctFloatAnual": 3.2,
  "ultimaActualizacion": "Q1 2025",
  "fuente": "Estimación basada en reportes públicos",
  "nota": "Dato aproximado basado en últimos earnings conocidos. Puede estar desactualizado hasta 3 meses."
}

Si no tienes información suficiente sobre el programa de recompras de ${o}, responde con {"tienePrograma": false, "nota": "Sin datos de programa de recompras conocido"}

Sé conservador — solo incluye datos que conozcas con razonable certeza.`,m=await fetch("/api/macro-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:v})});if(m.ok){const x=((await m.json()).text||"").replace(/```json\n?|```\n?/g,"").trim().match(/\{[\s\S]*\}/);x&&(F=JSON.parse(x[0]))}}catch{}return{floatShares:i,sharesOut:e,marketCap:a,sharesShortPct:c,programa:F}}catch{return null}}function W(o,f){if(!o)return`<div style="font-family:var(--mono);font-size:11px;color:var(--text3);">Sin datos de recompras disponibles para ${f}</div>`;const{floatShares:h,sharesOut:k,marketCap:p,sharesShortPct:w,programa:l}=o,b=h||k||p?`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
      ${p?`<div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:5px;text-transform:uppercase;">Market Cap</div>
        <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;">${H(p)}</div>
      </div>`:""}
      ${h?`<div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:5px;text-transform:uppercase;">Float</div>
        <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;">${(h/1e6).toFixed(0)}M acc.</div>
      </div>`:""}
      ${w!=null?`<div style="background:var(--surface2);border-radius:8px;padding:12px 14px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:5px;text-transform:uppercase;">Short % float</div>
        <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;color:${w>.1?"var(--red)":"var(--text1)"};">${(w*100).toFixed(1)}%</div>
      </div>`:""}
    </div>`:"";if(!l||!l.tienePrograma)return b+`<div style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:12px 14px;background:var(--surface2);border-radius:8px;">${(l==null?void 0:l.nota)||"Sin datos de programa de recompras conocido"}</div>`;const E=l.ejecutadoEstimado||0,z=l.aprobadoTotal||1,C=Math.min(100,E/z*100),A=l.pendienteEstimado||z-E;return`${b}
    <div style="background:var(--surface2);border-radius:10px;padding:16px 18px;margin-bottom:12px;">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Programa de Recompras · ${l.ultimaActualizacion||"—"}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">
        <div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Total aprobado</div>
          <div style="font-family:var(--serif);font-size:22px;font-style:italic;font-weight:600;color:var(--text1);">${H(z)}</div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Ejecutado (est.)</div>
          <div style="font-family:var(--serif);font-size:22px;font-style:italic;font-weight:600;color:var(--amber);">${H(E)}</div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Pendiente (est.)</div>
          <div style="font-family:var(--serif);font-size:22px;font-style:italic;font-weight:600;color:var(--green);">${H(A)}</div>
        </div>
      </div>
      <!-- Barra de progreso -->
      <div style="font-size:10px;color:var(--text3);margin-bottom:5px;">Progreso del programa</div>
      <div style="height:8px;background:var(--surface);border-radius:4px;overflow:hidden;margin-bottom:6px;">
        <div style="height:100%;width:${C.toFixed(0)}%;background:linear-gradient(90deg,var(--teal),var(--amber));border-radius:4px;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--text3);">
        <span>Ejecutado ${C.toFixed(0)}%</span>
        <span>Pendiente ${(100-C).toFixed(0)}%</span>
      </div>
      ${l.pctFloatAnual?`<div style="margin-top:10px;font-size:11px;color:var(--text2);">Ritmo de recompras: <strong style="color:var(--teal);">${l.pctFloatAnual.toFixed(1)}% del float/año</strong> — equivalente a recomprar toda la empresa en ${(100/l.pctFloatAnual).toFixed(0)} años al ritmo actual</div>`:""}
    </div>
    <div style="font-family:var(--mono);font-size:9px;color:var(--text3);background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:8px 12px;line-height:1.6;">
      ⚠ ${l.nota||"Datos aproximados basados en últimos reportes públicos conocidos. Pueden estar desactualizados hasta 3 meses. Verifica en los earnings reports oficiales de la empresa."}
    </div>`}const Y=`
.sm-wrap{font-family:var(--sans);}
.sm-search{display:flex;gap:10px;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.sm-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:14px;}
.sm-card-title{font-size:13px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px;}
.sm-card-desc{font-size:11px;color:var(--text2);margin-bottom:16px;}
.sm-table{width:100%;border-collapse:collapse;font-size:11px;}
.sm-table th{padding:8px 12px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text2);border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);}
.sm-table th.r{text-align:right;}
.sm-table td{padding:9px 12px;border-bottom:1px solid var(--border);color:var(--text1);}
.sm-table td.r{text-align:right;font-family:var(--mono);}
.sm-table tbody tr:last-child td{border-bottom:none;}
.sm-table tbody tr:hover td{background:rgba(64,217,192,0.03);}
.sm-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:var(--border);border-radius:8px;overflow:hidden;margin-bottom:14px;}
.sm-kpi{background:var(--surface2);padding:14px 16px;}
.sm-kpi-lbl{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text2);margin-bottom:6px;}
.sm-kpi-val{font-family:var(--mono);font-size:20px;font-weight:700;}
.sm-kpi-sub{font-size:10px;color:var(--text2);margin-top:4px;}
.sm-badge{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:3px;font-weight:700;}
.sm-badge.buy{background:rgba(74,222,128,0.12);color:var(--green);}
.sm-badge.sell{background:rgba(244,113,116,0.12);color:var(--red);}
.sm-badge.high{background:rgba(244,113,116,0.12);color:var(--red);}
.sm-badge.med{background:rgba(251,191,36,0.12);color:var(--amber);}
.sm-badge.low{background:rgba(74,222,128,0.12);color:var(--green);}
.sm-loader{display:flex;align-items:center;gap:10px;color:var(--text2);font-family:var(--mono);font-size:11px;padding:20px 0;}
.sm-empty{text-align:center;padding:30px;color:var(--text2);font-family:var(--mono);font-size:11px;}
.sm-insight{border-left:2px solid var(--teal);background:var(--teal-dim);padding:10px 14px;border-radius:0 8px 8px 0;font-size:11px;color:var(--text2);line-height:1.6;margin-top:12px;}
.sm-insight strong{color:var(--text1);}
.sm-section{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text2);display:flex;align-items:center;gap:10px;margin:16px 0 10px;}
.sm-section::after{content:"";flex:1;height:1px;background:var(--border);}
`;async function tt(o,{actionsSlot:f}){var B,j;if(!document.getElementById("sm-css")){const t=document.createElement("style");t.id="sm-css",t.textContent=Y,document.head.appendChild(t)}f.innerHTML="",o.innerHTML='<div class="sm-wrap" id="sm-wrap"></div>';const h=document.getElementById("sm-wrap");h.innerHTML=`
    <!-- Tabs principales -->
    <div style="display:flex;gap:3px;border-bottom:1px solid var(--border);margin-bottom:18px;">
      <button class="sm-main-tab active" data-tab="smart" style="padding:10px 18px;background:transparent;border:none;color:var(--teal);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid var(--teal);font-family:var(--sans);">🏦 Smart Money</button>
      <button class="sm-main-tab" data-tab="13f" style="padding:10px 18px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);">🐋 13F · Fondos Top</button>
    </div>

    <!-- Panel Smart Money (original) -->
    <div id="sm-panel-smart">
      <div class="sm-search">
        <input type="text" id="sm-ticker" class="wl-input" placeholder="Ticker (ej. AAPL, NVDA...)" style="width:220px;text-transform:uppercase;">
        <button class="btn btn-primary" id="sm-search-btn">🔍 Analizar Smart Money</button>
        <span id="sm-status" style="font-family:var(--mono);font-size:11px;color:var(--text2);"></span>
      </div>
      <div id="sm-results">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:40px;text-align:center;">
          <div style="font-size:32px;margin-bottom:12px;">🏦</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:6px;">Smart Money Intelligence</div>
          <div style="font-size:11px;color:var(--text2);max-width:500px;margin:0 auto;line-height:1.6;">
            Introduce un ticker para ver las compras y ventas de insiders (SEC Form 4),
            el short interest institucional y los principales accionistas institucionales.
          </div>
        </div>
      </div>
    </div>

    <!-- Panel 13F Fondos Top -->
    <div id="sm-panel-13f" style="display:none;">
      <div id="sm-13f-content"></div>
    </div>
  `;async function k(){var e,a,c;const t=(((e=document.getElementById("sm-ticker"))==null?void 0:e.value)||"").trim().toUpperCase();if(!t)return;const s=document.getElementById("sm-search-btn"),r=document.getElementById("sm-status"),i=document.getElementById("sm-results");s.disabled=!0,s.textContent="⏳ Cargando...",r&&(r.textContent=`Consultando SEC, FINRA y Yahoo para ${t}...`),i.innerHTML=`<div class="sm-loader"><div class="loader-ring"></div>Obteniendo datos de Smart Money para ${t}...</div>`;try{s.disabled=!0,s.textContent="⏳ Buscando...",r&&(r.textContent=`Consultando insiders y mercado para ${t} en paralelo...`),i.innerHTML=`<div class="sm-loader"><div class="loader-ring"></div>Buscando datos de Smart Money para ${t}... (15-30s)</div>`;const[g,F,d]=await Promise.allSettled([fetch(`/api/smart-money?ticker=${t}&section=insiders`,{signal:(()=>{const $=new AbortController;return setTimeout(()=>$.abort(),58e3),$.signal})()}).then($=>$.json()),fetch(`/api/smart-money?ticker=${t}&section=market`,{signal:(()=>{const $=new AbortController;return setTimeout(()=>$.abort(),58e3),$.signal})()}).then($=>$.json()),J(t)]),v=g.status==="fulfilled"?g.value:{},m=F.status==="fulfilled"?F.value:{},S=d.status==="fulfilled"?d.value:null,u={ticker:t,insiders:v.insiders||[],shortInterest:m.shortInterest||null,institutional:m.institutional||null,recompras:S,errors:[...v.error?["Insiders: "+v.error.slice(0,60)]:[],...m.error?["Market: "+m.error.slice(0,60)]:[],...g.status==="rejected"?["Insiders timeout"]:[],...F.status==="rejected"?["Market timeout"]:[]]},x=((a=m.shortInterest)==null?void 0:a.shortFloat)??null,y=((c=m.institutional)==null?void 0:c.pctInstitutions)??null,[L]=await Promise.all([Q(t),K(t,x,y)]);u.history=L,p(u,t),r&&(r.textContent="")}catch(g){i.innerHTML=`<div class="sm-card"><div style="color:var(--red);font-family:var(--mono);">⚠ Error: ${g.message}</div></div>`,r&&(r.textContent="")}s.disabled=!1,s.textContent="🔍 Analizar Smart Money"}function p(t,s){var L,$,D,P,R;const r=document.getElementById("sm-results"),{insiders:i,shortInterest:e,institutional:a,history:c}=t,g=i.filter(n=>{var M;return n.type==="Compra"||((M=n.type)==null?void 0:M.toLowerCase().includes("purchase"))}).length,F=i.filter(n=>{var M;return n.type==="Venta"||((M=n.type)==null?void 0:M.toLowerCase().includes("sale"))}).length,d=e==null?void 0:e.shortFloat,v=a==null?void 0:a.pctInstitutions,m=q(v,c,"inst"),S=q(d,c,"short");let u="neutral",x="Neutral",y="var(--amber)";g>F&&g>0&&(!d||d<.15)?(u="alcista",x="Alcista",y="var(--green)"):(F>g*2||d&&d>.25)&&(u="bajista",x="Bajista",y="var(--red)"),r.innerHTML=`
      <!-- Resumen Smart Money -->
      <div class="sm-card" style="border-color:${y};border-left:4px solid ${y};">
        <div class="sm-card-title">
          <span style="color:${y};font-size:20px;">${u==="alcista"?"↑":u==="bajista"?"↓":"→"}</span>
          Señal Smart Money: <span style="color:${y};">${x}</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--text2);font-weight:400;margin-left:auto;">${s} · ${new Date().toLocaleDateString("es-ES")}</span>
        </div>
        <div class="sm-kpi-grid">
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Compras insiders</div>
            <div class="sm-kpi-val" style="color:var(--green);">${g}</div>
            <div class="sm-kpi-sub">últimos 6 meses</div>
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Ventas insiders</div>
            <div class="sm-kpi-val" style="color:var(--red);">${F}</div>
            <div class="sm-kpi-sub">últimos 6 meses</div>
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Short Interest</div>
            <div class="sm-kpi-val" style="color:${d>.2?"var(--red)":d>.1?"var(--amber)":"var(--green)"};">${T(d)}</div>
            <div class="sm-kpi-sub">% del float</div>
            ${S?`<div style="margin-top:4px;">${S}</div>`:""}
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Days to Cover</div>
            <div class="sm-kpi-val" style="color:${(e==null?void 0:e.daysTocover)>5?"var(--red)":(e==null?void 0:e.daysTocover)>3?"var(--amber)":"var(--green)"};">${((L=e==null?void 0:e.daysTocover)==null?void 0:L.toFixed(1))||"—"}d</div>
            <div class="sm-kpi-sub">presión bajista</div>
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">% Institucional</div>
            <div class="sm-kpi-val">${T(v)}</div>
            <div class="sm-kpi-sub">del float</div>
            ${m?`<div style="margin-top:4px;">${m}</div>`:""}
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">% Insiders</div>
            <div class="sm-kpi-val">${T(a==null?void 0:a.pctInsiders)}</div>
            <div class="sm-kpi-sub">del float</div>
          </div>
        </div>
        ${w(g,F,d,e==null?void 0:e.daysTocover,v)}
      </div>

      <!-- Insider Trading -->
      <div class="sm-card">
        <div class="sm-card-title">📋 Insider Trading — SEC Form 4</div>
        <div class="sm-card-desc">Compras y ventas declaradas por directivos, consejeros y accionistas >10% en los últimos 6 meses.</div>
        ${i.length?`
        <table class="sm-table">
          <thead><tr>
            <th>Fecha</th><th>Insider</th><th>Cargo</th>
            <th class="r">Tipo</th><th class="r">Cantidad</th>
            <th class="r">Precio</th><th class="r">Valor total</th>
          </tr></thead>
          <tbody>
            ${i.map(n=>{var M;return`<tr>
              <td style="color:var(--text2);font-family:var(--mono);font-size:10px;">${V(n.date)}</td>
              <td style="font-weight:600;">${n.insider||n.filer||"—"}</td>
              <td style="font-size:10px;color:var(--text2);">${n.title||"—"}</td>
              <td class="r"><span class="sm-badge ${n.type==="Compra"||(M=n.type)!=null&&M.toLowerCase().includes("purchase")?"buy":"sell"}">${n.type==="Compra"?"▲ COMPRA":n.type==="Venta"?"▼ VENTA":n.type||"—"}</span></td>
              <td class="r">${n.qty?O(n.qty):"—"}</td>
              <td class="r">${n.price||"—"}</td>
              <td class="r">${n.value||"—"}</td>
            </tr>`}).join("")}
          </tbody>
        </table>
        <div style="font-size:10px;color:var(--text2);margin-top:10px;font-family:var(--mono);">Fuente: OpenInsider / SEC EDGAR</div>`:'<div class="sm-empty">Sin transacciones de insiders en los últimos 6 meses</div>'}
      </div>

      <!-- Short Interest -->
      <div class="sm-card">
        <div class="sm-card-title">📉 Short Interest</div>
        <div class="sm-card-desc">Porcentaje del float vendido en corto. Alto short interest puede significar presión bajista o potencial short squeeze.</div>
        ${e?`
        <div class="sm-kpi-grid">
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Short Float</div>
            <div class="sm-kpi-val" style="color:${d>.2?"var(--red)":d>.1?"var(--amber)":"var(--green)"};">${T(d)}</div>
            <div class="sm-kpi-sub"><span class="sm-badge ${d>.2?"high":d>.1?"med":"low"}">${d>.2?"Alto":d>.1?"Moderado":"Bajo"}</span></div>
            ${S?`<div style="margin-top:6px;">${S}</div>`:""}
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Days to Cover</div>
            <div class="sm-kpi-val">${(($=e.daysTocover)==null?void 0:$.toFixed(1))||"—"}</div>
            <div class="sm-kpi-sub">días para cubrir</div>
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">Acciones en corto</div>
            <div class="sm-kpi-val" style="font-size:16px;">${O(e.shortVolume)}</div>
            <div class="sm-kpi-sub">${e.date}</div>
          </div>
        </div>
        <div class="sm-insight">
          <strong>Interpretación:</strong> Short float ${T(d)} —
          ${d>.2?"⚠ <strong>Short interest muy alto.</strong> Alto riesgo de presión bajista pero también potencial de <strong>short squeeze</strong> si hay catalizador positivo.":d>.1?"Moderado. El mercado tiene cierta posición bajista en este valor — vigilar.":d!=null?"✓ Bajo short interest. El mercado no está especialmente posicionado bajista.":"Sin datos suficientes."}
          ${e.daysTocover>5?` Days to Cover elevado (${(D=e.daysTocover)==null?void 0:D.toFixed(1)}d) — si el precio sube, la presión de recompra podría ser significativa.`:""}
        </div>`:'<div class="sm-empty">Sin datos de short interest disponibles</div>'}
      </div>

      <!-- Institutional Ownership -->
      <div class="sm-card">
        <div class="sm-card-title">🏛️ Ownership Institucional</div>
        <div class="sm-card-desc">Fondos, ETFs y grandes gestoras con posiciones declaradas. Alto % institucional = validación del mercado profesional.</div>
        ${a?`
        <div class="sm-kpi-grid" style="margin-bottom:16px;">
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">% Institucional</div>
            <div class="sm-kpi-val" style="color:${v>.7?"var(--green)":v>.4?"var(--amber)":"var(--text2)"};">${T(v)}</div>
            <div class="sm-kpi-sub">del float</div>
            ${m?`<div style="margin-top:6px;">${m}</div>`:""}
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">% Insiders</div>
            <div class="sm-kpi-val">${T(a.pctInsiders)}</div>
            <div class="sm-kpi-sub">directivos y fundadores</div>
          </div>
          <div class="sm-kpi">
            <div class="sm-kpi-lbl">% Público</div>
            <div class="sm-kpi-val">${T(1-(v||0)-(a.pctInsiders||0))}</div>
            <div class="sm-kpi-sub">retail y otros</div>
          </div>
        </div>
        ${(P=a.topHolders)!=null&&P.length?`
        <div class="sm-section">Top accionistas institucionales</div>
        <table class="sm-table">
          <thead><tr>
            <th>Institución</th><th class="r">% Float</th>
            <th class="r">Acciones</th><th class="r">Valor</th><th class="r">Cambio</th>
          </tr></thead>
          <tbody>
            ${a.topHolders.map(n=>`<tr>
              <td style="font-weight:600;">${n.name||"—"}</td>
              <td class="r">${T(n.pct)}</td>
              <td class="r">${O(n.shares)}</td>
              <td class="r">${G(n.value)}</td>
              <td class="r" style="color:${n.change>0?"var(--green)":n.change<0?"var(--red)":"var(--text2)"};">${n.change!=null?(n.change>=0?"+":"")+T(n.change):"—"}</td>
            </tr>`).join("")}
          </tbody>
        </table>`:""}`:'<div class="sm-empty">Sin datos de ownership institucional</div>'}
      </div>

      ${(R=t.errors)!=null&&R.length?`
      <div style="font-size:10px;color:var(--text3);font-family:var(--mono);padding:8px 0;">
        ⚠ Datos parciales: ${t.errors.join(" · ")}
      </div>`:""}

      <!-- Recompras de acciones -->
      <div class="sm-section">🔄 Recompra de Acciones</div>
      <div class="sm-card">
        <div class="sm-card-title">Programa de Recompras · Share Buyback</div>
        <div class="sm-card-desc">Datos de Yahoo Finance + estimación IA basada en últimos reportes públicos.</div>
        <div id="sm-recompras-content">
          ${W(t.recompras,s)}
        </div>
      </div>
    `}function w(t,s,r,i,e,a){const c=[];return t>0&&t>s&&c.push(`<strong>${t} compras de insiders</strong> vs ${s} ventas — los que mejor conocen la empresa están comprando`),s>t*2&&c.push(`⚠ <strong>${s} ventas de insiders</strong> — presión de distribución interna`),r>.2&&c.push(`<strong>Short interest elevado (${(r*100).toFixed(1)}%)</strong> — posible combustible para short squeeze`),r<.05&&r!=null&&c.push(`Short interest bajo (${(r*100).toFixed(1)}%) — mercado no apuesta contra el valor`),e>.7&&c.push(`<strong>${(e*100).toFixed(0)}% en manos institucionales</strong> — alta validación profesional`),c.length?`<div class="sm-insight">${c.join(" · ")}</div>`:""}(B=document.getElementById("sm-search-btn"))==null||B.addEventListener("click",k),(j=document.getElementById("sm-ticker"))==null||j.addEventListener("keydown",t=>{t.key==="Enter"&&k(),setTimeout(()=>{t.target&&(t.target.value=t.target.value.toUpperCase())},0)}),document.querySelectorAll(".sm-main-tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".sm-main-tab").forEach(s=>{s.style.color="var(--text3)",s.style.borderBottom="2px solid transparent"}),t.style.color="var(--teal)",t.style.borderBottom="2px solid var(--teal)",document.getElementById("sm-panel-smart").style.display=t.dataset.tab==="smart"?"block":"none",document.getElementById("sm-panel-13f").style.display=t.dataset.tab==="13f"?"block":"none",t.dataset.tab==="13f"&&E()})});const l={berkshire:{name:"Berkshire Hathaway",manager:"Warren Buffett",style:"Value concentrado",color:"#40d9c0"},bridgewater:{name:"Bridgewater Associates",manager:"Ray Dalio",style:"Macro global",color:"#5fa8e0"},pershing:{name:"Pershing Square",manager:"Bill Ackman",style:"Activista concentrado",color:"#a78bfa"},thirdpoint:{name:"Third Point",manager:"Dan Loeb",style:"Activista tech",color:"#fbbf24"},scion:{name:"Scion Asset Mgmt",manager:"Michael Burry",style:"Contrarian extremo",color:"#f47174"},baupost:{name:"Baupost Group",manager:"Seth Klarman",style:"Value profundo",color:"#4ade80"},fidelity:{name:"Fidelity (FMR LLC)",manager:"Will Danoff",style:"Growth americano",color:"#fb923c"},gic:{name:"GIC — Singapore",manager:"Lim Chow Kiat",style:"Fondo soberano SG",color:"#e879f9"},norges:{name:"Norges Bank (NBIM)",manager:"Nicolai Tangen",style:"Fondo soberano Noruega",color:"#f43f5e"}};let b=!1;async function E(){var s,r;if(b)return;const t=document.getElementById("sm-13f-content");t.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Buscar por fondo</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;" id="sm-13f-fund-btns">
            ${Object.entries(l).map(([i,e])=>`<button class="btn" data-fund="${i}" style="border-color:${e.color}20;font-size:10px;padding:5px 10px;">${e.name}</button>`).join("")}
          </div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">¿Qué fondos tienen este ticker?</div>
          <div style="display:flex;gap:8px;">
            <input type="text" id="sm-13f-ticker" class="wl-input" placeholder="AAPL, NVDA..." style="width:140px;text-transform:uppercase;">
            <button class="btn btn-primary" id="sm-13f-ticker-btn">Buscar</button>
          </div>
        </div>
      </div>
      <div id="sm-13f-result">
        <div style="text-align:center;padding:48px 20px;color:var(--text3);font-family:var(--mono);font-size:11px;">
          <div style="font-size:28px;margin-bottom:10px;">🐋</div>
          Selecciona un fondo o introduce un ticker para ver las posiciones 13F más recientes
        </div>
      </div>`,document.querySelectorAll("#sm-13f-fund-btns .btn").forEach(i=>{i.addEventListener("click",()=>z(i.dataset.fund))}),(s=document.getElementById("sm-13f-ticker-btn"))==null||s.addEventListener("click",()=>{var e,a;const i=(a=(e=document.getElementById("sm-13f-ticker"))==null?void 0:e.value)==null?void 0:a.trim().toUpperCase();i&&C(i)}),(r=document.getElementById("sm-13f-ticker"))==null||r.addEventListener("keydown",i=>{if(i.key==="Enter"){const e=i.target.value.trim().toUpperCase();e&&C(e)}}),b=!0}async function z(t){const s=document.getElementById("sm-13f-result"),r=l[t];s.innerHTML=`<div class="sm-loader"><div class="loader-ring"></div>Obteniendo último 13F de ${r.name} via SEC EDGAR...</div>`;try{const i=new AbortController,e=setTimeout(()=>i.abort(),3e4),a=await fetch(`/api/smart-13f?fund=${t}`,{signal:i.signal});clearTimeout(e);const c=await a.json();if(c.error)throw new Error(c.error);A(c,r)}catch(i){s.innerHTML=`<div style="background:var(--surface);border:1px solid var(--red);border-radius:10px;padding:20px;color:var(--red);font-family:var(--mono);font-size:11px;">⚠ ${i.message}</div>`}}async function C(t){const s=document.getElementById("sm-13f-result");s.innerHTML=`<div class="sm-loader"><div class="loader-ring"></div>Buscando ${t} en todos los 13F...</div>`;try{const r=new AbortController,i=setTimeout(()=>r.abort(),6e4),e=await fetch(`/api/smart-13f?ticker=${t}`,{signal:r.signal});clearTimeout(i);const a=await e.json();if(a.error)throw new Error(a.error);I(a,t)}catch(r){s.innerHTML=`<div style="background:var(--surface);border:1px solid var(--red);border-radius:10px;padding:20px;color:var(--red);font-family:var(--mono);font-size:11px;">⚠ ${r.message}</div>`}}function A(t,s){const r=document.getElementById("sm-13f-result"),i=e=>e>=1e9?"$"+(e/1e9).toFixed(1)+"B":"$"+(e/1e6).toFixed(0)+"M";r.innerHTML=`
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
        <div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;">${s.name}</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:3px;">${s.manager} · ${s.style}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">Portfolio 13F</div>
            <div style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--teal);">${i(t.totalValue)}</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">Q${t.period} · ${t.totalPositions} posiciones</div>
          </div>
        </div>
        <div style="padding:8px 0;">
          <div style="display:grid;grid-template-columns:1fr auto auto auto;padding:8px 18px;font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;border-bottom:1px solid var(--border);">
            <span>Empresa</span><span style="text-align:right;padding-right:16px;">Valor</span><span style="text-align:right;padding-right:16px;">Acciones</span><span style="text-align:right;">% Portfolio</span>
          </div>
          ${t.holdings.map((e,a)=>`
            <div style="display:grid;grid-template-columns:1fr auto auto auto;padding:9px 18px;border-bottom:1px solid var(--border);align-items:center;${a%2===0?"background:rgba(64,217,192,0.02)":""}">
              <div>
                <span style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-right:8px;">${a+1}</span>
                <span style="font-size:12px;font-weight:600;">${e.name}</span>
              </div>
              <span style="font-family:var(--mono);font-size:11px;text-align:right;padding-right:16px;">${i(e.value)}</span>
              <span style="font-family:var(--mono);font-size:10px;color:var(--text2);text-align:right;padding-right:16px;">${e.shares.toLocaleString("es-ES")}</span>
              <div style="text-align:right;min-width:60px;">
                <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${e.pct>=10?"var(--teal)":e.pct>=5?"var(--text1)":"var(--text2)"};">${e.pct.toFixed(1)}%</span>
                <div style="height:3px;background:var(--surface2);border-radius:2px;margin-top:3px;overflow:hidden;">
                  <div style="height:100%;width:${Math.min(100,e.pct*5)}%;background:var(--teal);border-radius:2px;"></div>
                </div>
              </div>
            </div>`).join("")}
        </div>
        <div style="padding:10px 18px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          ⚠ Datos SEC EDGAR 13F-HR · Publicación trimestral con 45 días de retraso · Solo posiciones largas en RV americana
        </div>
      </div>`}function I(t,s){var e;const r=document.getElementById("sm-13f-result"),i=a=>a>=1e9?"$"+(a/1e9).toFixed(1)+"B":"$"+(a/1e6).toFixed(0)+"M";if(!((e=t.funds)!=null&&e.length)){r.innerHTML=`<div style="text-align:center;padding:40px;font-family:var(--mono);font-size:11px;color:var(--text3);">
        <div style="font-size:24px;margin-bottom:10px;">🔍</div>
        ${s} no aparece en el top 15 de ninguno de los 7 fondos monitorizados
      </div>`;return}r.innerHTML=`
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);">
          <div style="font-family:var(--serif);font-size:20px;font-style:italic;font-weight:600;">${s} · Presencia en fondos 13F</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--text2);margin-top:3px;">${t.funds.length} de 7 fondos tienen ${s} en su top 15</div>
        </div>
        ${t.funds.map(a=>{var g;const c=l[a.key]||{};return`<div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${c.color||"var(--teal)"};flex-shrink:0;"></div>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;">${c.name||a.fund.name}</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${c.manager||""} · Q${a.period}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--mono);font-size:13px;font-weight:700;">${i(a.position.value)}</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text2);">${a.position.shares.toLocaleString("es-ES")} acc.</div>
            </div>
            <div style="text-align:right;min-width:54px;">
              <div style="font-family:var(--mono);font-size:13px;font-weight:700;color:var(--teal);">${(g=a.position.pct)==null?void 0:g.toFixed(1)}%</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">del fondo</div>
            </div>
          </div>`}).join("")}
        ${t.funds.length>=3?`
        <div style="padding:12px 18px;background:rgba(64,217,192,0.05);border-top:1px solid rgba(64,217,192,0.2);">
          <div style="font-family:var(--mono);font-size:9px;color:var(--teal);font-weight:700;">🐋 CONFLUENCIA DE WHALES</div>
          <div style="font-size:11px;color:var(--text1);margin-top:4px;">${t.funds.length} fondos independientes tienen ${s} en su top 15. Alta convicción institucional.</div>
        </div>`:""}
        <div style="padding:10px 18px;font-family:var(--mono);font-size:9px;color:var(--text3);">
          ⚠ Datos SEC EDGAR 13F-HR · 45 días de retraso · Solo posiciones largas
        </div>
      </div>`}return{destroy(){var t;(t=document.getElementById("sm-css"))==null||t.remove()}}}export{tt as render};
