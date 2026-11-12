import{g as O}from"./macro-data-CGVdt8ED.js";import{UserData as A}from"./userdata-DXI1eA65.js";import"./index-CgF2jx7D.js";function N(a){return a==null||isNaN(a)?{label:"Sin datos",color:"var(--text3)",source:"HIST_MACRO_V1"}:a>=10?{label:"Boom",color:"var(--green)",source:"HIST_MACRO_V1"}:a>=4?{label:"Expansión",color:"var(--teal)",source:"HIST_MACRO_V1"}:a>=0?{label:"Desaceleración",color:"var(--amber)",source:"HIST_MACRO_V1"}:a>=-4?{label:"Recesión Leve",color:"var(--red)",source:"HIST_MACRO_V1"}:{label:"Recesión Severa",color:"var(--red)",source:"HIST_MACRO_V1"}}function _(a){return a==null||isNaN(a)?"—":a>=10?"75–90%":a>=4?"55–70%":a>=0?"35–55%":a>=-4?"20–40%":"10–25%"}const L="ethan_estrategia_ia",X=[{name:"Tecnología",etf:"XLK",proxy:"QQQ"},{name:"Semiconductores",etf:"SOXX",proxy:"SOXX"},{name:"Consumo discrecional",etf:"XLY",proxy:"XLY"},{name:"Energía",etf:"XLE",proxy:"XLE"},{name:"Financiero",etf:"XLF",proxy:"XLF"},{name:"Healthcare",etf:"XLV",proxy:"XLV"},{name:"Utilities",etf:"XLU",proxy:"XLU"},{name:"Inmobiliario",etf:"XLRE",proxy:"XLRE"}],V=[a=>`https://api.allorigins.win/raw?url=${encodeURIComponent(a)}`,a=>`https://corsproxy.io/?${encodeURIComponent(a)}`];async function D(a){var m,g,f,x,b,y;const u=`https://query1.finance.yahoo.com/v8/finance/chart/${a}?interval=1d&range=3mo`;for(const E of V)try{const h=new AbortController,S=setTimeout(()=>h.abort(),8e3),i=await fetch(E(u),{signal:h.signal});if(clearTimeout(S),!i.ok)continue;const o=await i.json(),l=(g=(m=o==null?void 0:o.chart)==null?void 0:m.result)==null?void 0:g[0];if(!l)continue;const t=(y=(b=(x=(f=l.indicators)==null?void 0:f.quote)==null?void 0:x[0])==null?void 0:b.close)==null?void 0:y.filter(w=>w!=null);if(!(t!=null&&t.length))continue;const n=t[t.length-1],r=t[t.length-2]||n,e=t.slice(-20).reduce((w,z)=>w+z,0)/Math.min(20,t.length),v=t.slice(-50).reduce((w,z)=>w+z,0)/Math.min(50,t.length),$=(n-r)/r*100,c=t.length>20?(n-t[t.length-21])/t[t.length-21]*100:0;let d=50;return n>e&&(d+=15),n>v&&(d+=15),e>v&&(d+=10),c>0&&(d+=10),d=Math.min(100,Math.max(0,d)),{last:n,chg1d:$,chg1m:c,ma20:e,ma50:v,score:d}}catch{}return null}async function G(){try{const a=new AbortController,u=setTimeout(()=>a.abort(),15e3),m=await fetch("/api/cava",{signal:a.signal});return clearTimeout(u),m.ok?((await m.json()).videos||[]).slice(0,3):[]}catch{return[]}}async function U(a,u,m,g){var r;const f=(a==null?void 0:a.scoreTotal)??0,x=((r=a==null?void 0:a.coyuntura)==null?void 0:r.label)||"Desaceleración",b=f>=10?"75-90%":f>=4?"55-70%":f>=0?"35-55%":"15-35%",y=u.map(e=>{var v;return`${e.name} (${e.etf}): score técnico ${e.score??"—"}/100, cambio 1m ${((v=e.chg1m)==null?void 0:v.toFixed(1))??"—"}%`}).join(`
`),E=m.map(e=>{var $;const v=($=e.tips)!=null&&$.length?e.tips.map((c,d)=>`  ${d+1}. ${c}`).join(`
`):"  Sin tips disponibles";return`"${e.title}" (${e.published}):
${v}`}).join(`

`),h=g!=null&&g.length?g.map(e=>`${e.ticker}: ${e.direction||"alcista"}, entrada ${e.entry}`).join(", "):"Sin posiciones abiertas",S=`Eres el asistente de inversión de la plataforma ETHAN Mercados. Analiza la siguiente información y genera una estrategia de inversión concreta para los próximos 30 días.

SCORE MACRO ETHAN: ${f}/+17 — Fase: ${x}
Exposición RV recomendada por score: ${b}

ANÁLISIS SECTORIAL (score técnico 0-100):
${y}

ÚLTIMOS ANÁLISIS DE JOSÉ LUIS CAVA:
${E}

POSICIONES ABIERTAS ACTUALES:
${h}

Genera una estrategia de inversión en formato JSON exacto (sin markdown, sin texto extra):
{
  "titulo": "Título conciso de la estrategia",
  "resumen": "Párrafo de 3-4 frases explicando el contexto macro y la tesis principal",
  "acciones": [
    {
      "tipo": "comprar|vigilar|evitar",
      "titulo": "Nombre del activo o sector",
      "descripcion": "2-3 frases explicando por qué y cómo",
      "tags": ["tag1", "tag2"]
    }
  ],
  "distribucion": [
    {
      "nombre": "Sector o tipo de activo",
      "pct": 35,
      "razon": "Una frase",
      "etf": "ETF o ticker de referencia"
    }
  ],
  "riesgos": ["riesgo 1", "riesgo 2", "riesgo 3"],
  "catalizadores": ["catalizador 1", "catalizador 2", "catalizador 3"]
}

Sé concreto y accionable. Usa los datos reales proporcionados. Máximo 4 acciones y 4 entradas en distribución.`,i=await fetch("/api/macro-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:S})});if(!i.ok)throw new Error(`Error API: ${i.status}`);const o=await i.json(),l=o.text||o.resultado||o.content||"";if(!l)throw new Error("Sin respuesta de la IA — comprueba los créditos de Anthropic");const n=l.replace(/```json\n?|```\n?/g,"").trim().match(/\{[\s\S]*\}/);if(!n)throw new Error("Respuesta IA no válida");return JSON.parse(n[0])}const B=`
.inv-tabs{display:flex;gap:3px;border-bottom:1px solid var(--border);margin-bottom:20px;}
.inv-tab{padding:10px 18px;background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:11px;font-weight:600;letter-spacing:0.03em;border-bottom:2px solid transparent;font-family:var(--sans);transition:all 0.15s;}
.inv-tab:hover{color:var(--text2);}
.inv-tab.active{color:var(--teal);border-bottom-color:var(--teal);}
.inv-panel{display:none;}
.inv-panel.active{display:block;animation:fadeIn 0.2s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

.inv-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:14px;}
.inv-card-sm{background:var(--surface2);border-radius:8px;padding:14px 16px;}
.inv-card-title{font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:12px;}
.inv-g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.inv-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;}

/* Macro banner */
.inv-macro-banner{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;margin-bottom:14px;}
.inv-score-big{font-family:var(--serif);font-size:64px;font-weight:600;font-style:italic;line-height:1;}
.inv-score-label{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:4px;}
.inv-score-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.12em;}
.inv-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
.inv-pill{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-family:var(--mono);font-size:9px;color:var(--text2);}
.inv-pill.pos{border-color:rgba(74,222,128,0.3);color:var(--green);}
.inv-pill.neg{border-color:rgba(244,113,116,0.3);color:var(--red);}
.inv-pill.neu{border-color:rgba(251,191,36,0.3);color:var(--amber);}

/* Sectores */
.inv-sector-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
.inv-sector-row:last-child{border-bottom:none;}
.inv-sector-name{font-size:11px;color:var(--text1);width:170px;flex-shrink:0;}
.inv-sector-etf{font-family:var(--mono);font-size:9px;color:var(--text3);width:44px;}
.inv-bar-track{flex:1;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;}
.inv-bar-fill{height:100%;border-radius:3px;}
.inv-sector-score{font-family:var(--mono);font-size:11px;font-weight:700;width:36px;text-align:right;}
.inv-sector-chg{font-family:var(--mono);font-size:9px;width:52px;text-align:right;}
.inv-signal{font-family:var(--mono);font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;}
.inv-signal.buy{background:rgba(74,222,128,0.12);color:var(--green);}
.inv-signal.neu{background:rgba(251,191,36,0.08);color:var(--amber);}
.inv-signal.avoid{background:rgba(244,113,116,0.08);color:var(--red);}

/* Cava */
.inv-cava-title{font-size:12px;font-weight:600;color:var(--text1);margin-bottom:4px;}
.inv-cava-date{font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:10px;}
.inv-tip-row{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
.inv-tip-row:last-child{border-bottom:none;}
.inv-tip-num{font-family:var(--mono);font-size:9px;color:var(--teal);font-weight:700;flex-shrink:0;width:18px;}
.inv-tip-text{font-size:11px;color:var(--text1);line-height:1.5;}

/* Confluencias */
.inv-conf-card{background:var(--surface2);border-radius:8px;padding:12px 14px;border-left:3px solid transparent;}
.inv-conf-card.pos{border-left-color:var(--green);}
.inv-conf-card.neg{border-left-color:var(--red);}
.inv-conf-card.neu{border-left-color:var(--amber);}
.inv-conf-tipo{font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;}
.inv-conf-titulo{font-size:12px;font-weight:600;color:var(--text1);margin-bottom:5px;}
.inv-conf-desc{font-size:11px;color:var(--text2);line-height:1.5;}

/* Generar */
.inv-generate-bar{background:linear-gradient(135deg,rgba(64,217,192,0.06),rgba(64,217,192,0.02));border:1px solid rgba(64,217,192,0.2);border-radius:12px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.inv-generate-info h3{font-family:var(--serif);font-size:20px;font-style:italic;color:var(--text1);margin-bottom:3px;}
.inv-generate-info p{font-size:10px;color:var(--text2);font-family:var(--mono);}
.inv-sources{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.inv-source{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-family:var(--mono);font-size:9px;color:var(--text2);display:flex;align-items:center;gap:5px;}
.inv-dot{width:6px;height:6px;border-radius:50%;}

/* Estrategia output */
.inv-strategy-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;}
.inv-strategy-title{font-family:var(--serif);font-size:28px;font-weight:400;font-style:italic;line-height:1.2;}
.inv-strategy-meta{font-family:var(--mono);font-size:9px;color:var(--text3);text-align:right;line-height:1.8;}
.inv-resumen{font-family:var(--serif);font-size:15px;font-weight:300;color:var(--text2);line-height:1.8;border-left:3px solid var(--teal);padding-left:18px;margin-bottom:20px;}
.inv-resumen em{color:var(--teal);font-style:italic;}

.inv-accion{background:var(--surface2);border-radius:10px;padding:14px 16px;border-left:3px solid transparent;}
.inv-accion.comprar{border-left-color:var(--green);}
.inv-accion.vigilar{border-left-color:var(--amber);}
.inv-accion.evitar{border-left-color:var(--red);}
.inv-accion-tipo{font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;}
.inv-accion-tipo.comprar{color:var(--green);}
.inv-accion-tipo.vigilar{color:var(--amber);}
.inv-accion-tipo.evitar{color:var(--red);}
.inv-accion-titulo{font-size:12px;font-weight:600;color:var(--text1);margin-bottom:5px;}
.inv-accion-desc{font-size:11px;color:var(--text2);line-height:1.5;}
.inv-accion-tags{display:flex;gap:5px;margin-top:7px;flex-wrap:wrap;}
.inv-accion-tag{font-family:var(--mono);font-size:9px;background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:2px 6px;color:var(--text3);}

.inv-dist-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface2);border-radius:8px;}
.inv-dist-pct{font-family:var(--serif);font-size:24px;font-style:italic;font-weight:600;width:56px;text-align:right;flex-shrink:0;}
.inv-dist-name{font-size:12px;font-weight:600;color:var(--text1);margin-bottom:2px;}
.inv-dist-razon{font-size:10px;color:var(--text2);line-height:1.4;}
.inv-dist-etf{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px;}

.inv-disclaimer{font-family:var(--mono);font-size:9px;color:var(--text3);background:var(--surface2);border-radius:6px;padding:10px 14px;margin-top:14px;line-height:1.6;}
.inv-insight{border-left:2px solid var(--teal);background:rgba(64,217,192,0.05);padding:10px 14px;border-radius:0 8px 8px 0;font-size:11px;color:var(--text2);line-height:1.6;margin-top:12px;}
.inv-insight strong{color:var(--text1);}
.inv-divider{height:1px;background:var(--border);margin:14px 0;}

.inv-empty{text-align:center;padding:48px 20px;color:var(--text3);font-family:var(--mono);font-size:11px;}
.inv-empty-icon{font-size:32px;margin-bottom:12px;}
.inv-empty-title{font-size:13px;color:var(--text2);margin-bottom:6px;}
.inv-empty-desc{font-size:11px;color:var(--text3);}
.inv-loader{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:14px;}
.inv-loader-ring{width:28px;height:28px;border:3px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
`;async function J(a,{actionsSlot:u}){var S;if(!document.getElementById("inv-css")){const i=document.createElement("style");i.id="inv-css",i.textContent=B,document.head.appendChild(i)}u.innerHTML='<button class="btn btn-primary" id="inv-refresh">↻ Actualizar</button>',a.innerHTML=`
    <div id="inv-wrap">
      <div class="inv-tabs">
        <button class="inv-tab active" data-tab="analisis">📊 Análisis Actual</button>
        <button class="inv-tab" data-tab="estrategia">🤖 Estrategia IA</button>
      </div>
      <div class="inv-panel active" id="inv-panel-analisis">
        <div class="inv-loader"><div class="inv-loader-ring"></div></div>
      </div>
      <div class="inv-panel" id="inv-panel-estrategia">
        <div class="inv-loader"><div class="inv-loader-ring"></div></div>
      </div>
    </div>`,a.querySelectorAll(".inv-tab").forEach(i=>{i.addEventListener("click",()=>{a.querySelectorAll(".inv-tab").forEach(o=>o.classList.remove("active")),a.querySelectorAll(".inv-panel").forEach(o=>o.classList.remove("active")),i.classList.add("active"),document.getElementById("inv-panel-"+i.dataset.tab).classList.add("active")})});let m=null,g=[],f=[],x=[];async function b(){try{const[i,o,l]=await Promise.all([O(!1),A.get("ethan_positions").then(r=>r||[]),A.get(L).then(r=>r||null)]);m=i,x=o.filter(r=>!r.exitDateISO),y(i,[],[]),E(l);const[t,n]=await Promise.all([Promise.all(X.map(async r=>{const e=await D(r.etf);return{...r,...e||{}}})),G()]);g=t,f=n,y(i,t,n)}catch(i){document.getElementById("inv-panel-analisis").innerHTML=`<div class="inv-empty"><div class="inv-empty-icon">⚠</div><div class="inv-empty-title">Error al cargar</div><div class="inv-empty-desc">${i.message}</div></div>`}}function y(i,o,l){var C,I;const t=document.getElementById("inv-panel-analisis"),n=(i==null?void 0:i.scoreTotal)??0,r=n>=4?"var(--green)":n>=0?"var(--amber)":"var(--red)",v=N(n).label,$=_(n),c=(i==null?void 0:i.indicators)||{},d=(s,p=2)=>s!=null?Number(s).toFixed(p):"—",w=o.length?o.map(s=>{const p=s.score??50,T=p>=65?"linear-gradient(90deg,var(--green),rgba(74,222,128,0.4))":p>=45?"linear-gradient(90deg,var(--amber),rgba(251,191,36,0.4))":"linear-gradient(90deg,var(--red),rgba(244,113,116,0.4))",R=p>=65?"var(--green)":p>=45?"var(--amber)":"var(--red)",H=p>=65?'<span class="inv-signal buy">COMPRAR</span>':p>=45?'<span class="inv-signal neu">NEUTRAL</span>':'<span class="inv-signal avoid">EVITAR</span>',j=(s.chg1m??0)>=0?"var(--green)":"var(--red)";return`<div class="inv-sector-row">
        <span class="inv-sector-name">${s.name}</span>
        <span class="inv-sector-etf">${s.etf}</span>
        <div class="inv-bar-track"><div class="inv-bar-fill" style="width:${p}%;background:${T}"></div></div>
        <span class="inv-sector-score" style="color:${R}">${p}</span>
        <span class="inv-sector-chg" style="color:${j}">${(s.chg1m??0)>=0?"+":""}${d(s.chg1m,1)}%</span>
        ${H}
      </div>`}).join(""):'<div style="text-align:center;padding:20px;font-family:var(--mono);font-size:11px;color:var(--text3);">Cargando datos sectoriales...</div>',z=l.length?l.slice(0,2).map(s=>`
      <div style="margin-bottom:14px;">
        <div class="inv-cava-title">${s.title}</div>
        <div class="inv-cava-date">${s.published}</div>
        ${(s.tips||[]).slice(0,3).map((p,T)=>`
          <div class="inv-tip-row"><span class="inv-tip-num">${T+1}</span><span class="inv-tip-text">${p}</span></div>
        `).join("")}
      </div>
      <div class="inv-divider"></div>`).join(""):'<div style="font-family:var(--mono);font-size:11px;color:var(--text3);padding:10px 0;">Sin vídeos de Cava disponibles</div>',k=o.filter(s=>(s.score??50)>=65).map(s=>s.name),M=o.filter(s=>(s.score??50)<45).map(s=>s.name);t.innerHTML=`
      <!-- Macro banner -->
      <div class="inv-macro-banner">
        <div class="inv-score-big" style="color:${r}">${n>0?"+":""}${n}</div>
        <div>
          <div class="inv-score-label" style="color:${r}">${v}</div>
          <div style="font-size:8px;font-family:var(--mono);color:var(--text3);margin-top:2px;">Motor: HIST_MACRO_V1</div>
          <div class="inv-score-sub">Score macro ETHAN · −17 a +17 · ${new Date().toLocaleDateString("es-ES")}</div>
          <div class="inv-pills">
            ${c.curvaUS!=null?`<span class="inv-pill ${c.curvaUS>0?"pos":"neg"}">📈 Curva ${d(c.curvaUS)}%</span>`:""}
            ${c.m2Global!=null?`<span class="inv-pill ${c.m2Global>0?"pos":"neg"}">💧 M2 ${d(c.m2Global,1)}%</span>`:""}
            ${((C=c.fearGreed)==null?void 0:C.value)!=null?`<span class="inv-pill ${c.fearGreed.value>50?"pos":c.fearGreed.value>30?"neu":"neg"}">😰 F&G ${Math.round(c.fearGreed.value)}</span>`:""}
            ${c.vix!=null?`<span class="inv-pill ${c.vix<15?"pos":c.vix<25?"neu":"neg"}">⚡ VIX ${d(c.vix,1)}</span>`:""}
          </div>
        </div>
        <div style="text-align:right;">
          <div class="inv-score-sub" style="margin-bottom:6px;">Exposición RV recomendada</div>
          <div style="font-family:var(--serif);font-size:32px;font-style:italic;font-weight:600;color:${r}">${$}</div>
        </div>
      </div>

      <div class="inv-g2">
        <!-- Sectores -->
        <div class="inv-card">
          <div class="inv-card-title">Señal técnica sectorial</div>
          ${w}
        </div>

        <!-- Cava -->
        <div class="inv-card">
          <div class="inv-card-title">José Luis Cava — Últimos análisis</div>
          ${z}
          ${(I=l[0])!=null&&I.resumen?`<div class="inv-insight"><strong>Resumen:</strong> ${l[0].resumen}</div>`:""}
        </div>
      </div>

      <!-- Confluencias -->
      <div class="inv-card">
        <div class="inv-card-title">Confluencias — Macro · Sectores · Cava</div>
        <div class="inv-g3">
          <div class="inv-conf-card pos">
            <div class="inv-conf-tipo" style="color:var(--green);">✓ Confluencia alcista</div>
            <div class="inv-conf-titulo">${k.slice(0,2).join(" + ")||"Sin señal clara"}</div>
            <div class="inv-conf-desc">Score macro positivo + señal técnica fuerte. Mayor probabilidad de continuidad alcista.</div>
          </div>
          <div class="inv-conf-card neg">
            <div class="inv-conf-tipo" style="color:var(--red);">✗ Confluencia bajista</div>
            <div class="inv-conf-titulo">${M.slice(0,2).join(" + ")||"Sin señal clara"}</div>
            <div class="inv-conf-desc">Señal técnica débil en entorno macro de desaceleración. Evitar o posición corta táctica.</div>
          </div>
          <div class="inv-conf-card neu">
            <div class="inv-conf-tipo" style="color:var(--amber);">◈ Gestión de riesgo</div>
            <div class="inv-conf-titulo">Exposición actual vs recomendada</div>
            <div class="inv-conf-desc">Score ${n>=0?"+":""}${n} sugiere RV ${$}. Ajusta la cartera si tu exposición actual difiere significativamente.</div>
          </div>
        </div>
      </div>`}function E(i){var l;const o=document.getElementById("inv-panel-estrategia");o.innerHTML=`
      <div class="inv-generate-bar">
        <div class="inv-generate-info">
          <h3>Estrategia IA</h3>
          <p>Combina score macro · señales sectoriales · análisis de Cava · posiciones actuales</p>
        </div>
        <button class="btn btn-primary" id="inv-generar-btn" ${i?'style="background:transparent;border-color:rgba(64,217,192,0.3);"':""}>
          ${i?"↺ Nueva estrategia":"⚡ Generar estrategia"}
        </button>
      </div>
      <div class="inv-sources">
        <div class="inv-source"><div class="inv-dot" style="background:var(--teal)"></div>Score macro</div>
        <div class="inv-source"><div class="inv-dot" style="background:var(--blue)"></div>11 sectores</div>
        <div class="inv-source"><div class="inv-dot" style="background:var(--amber)"></div>Vídeos Cava</div>
        <div class="inv-source"><div class="inv-dot" style="background:var(--green)"></div>${x.length} posiciones</div>
      </div>
      <div id="inv-estrategia-output">
        ${i?h(i):`
          <div class="inv-empty">
            <div class="inv-empty-icon">🤖</div>
            <div class="inv-empty-title">Sin estrategia generada</div>
            <div class="inv-empty-desc">Pulsa el botón para generar tu primera estrategia de inversión con IA</div>
          </div>`}
      </div>`,(l=document.getElementById("inv-generar-btn"))==null||l.addEventListener("click",async()=>{const t=document.getElementById("inv-generar-btn"),n=document.getElementById("inv-estrategia-output");t.disabled=!0,t.textContent="Analizando...",n.innerHTML=`
        <div class="inv-loader">
          <div class="inv-loader-ring"></div>
          <div style="font-family:var(--mono);font-size:11px;color:var(--text2);">Analizando macro, sectores y Cava con IA...</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text3);">Puede tardar 20-30 segundos</div>
        </div>`;try{const r=await U(m,g,f,x);r.generadoEn=new Date().toISOString(),await A.set(L,r),n.innerHTML=h(r),t.textContent="↺ Nueva estrategia",t.style.cssText="background:transparent;border-color:rgba(64,217,192,0.3);"}catch(r){n.innerHTML=`<div class="inv-empty"><div class="inv-empty-icon">⚠</div><div class="inv-empty-title">Error al generar</div><div class="inv-empty-desc">${r.message}</div></div>`,t.textContent="⚡ Intentar de nuevo"}t.disabled=!1})}function h(i){if(!i)return"";const o=i.generadoEn?new Date(i.generadoEn).toLocaleString("es-ES",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—",l=(i.acciones||[]).map(e=>`
      <div class="inv-accion ${e.tipo}">
        <div class="inv-accion-tipo ${e.tipo}">${e.tipo==="comprar"?"✓ Buscar entradas":e.tipo==="vigilar"?"⚠ Vigilar":"✗ Evitar"}</div>
        <div class="inv-accion-titulo">${e.titulo}</div>
        <div class="inv-accion-desc">${e.descripcion}</div>
        ${(e.tags||[]).length?`<div class="inv-accion-tags">${e.tags.map(v=>`<span class="inv-accion-tag">${v}</span>`).join("")}</div>`:""}
      </div>`).join(""),t=(i.distribucion||[]).map(e=>`<div class="inv-dist-row">
        <div class="inv-dist-pct" style="color:${e.pct>=30?"var(--teal)":e.nombre.toLowerCase().includes("cash")?"var(--text3)":"var(--text2)"}">${e.pct}%</div>
        <div>
          <div class="inv-dist-name">${e.nombre}</div>
          <div class="inv-dist-razon">${e.razon}</div>
          <div class="inv-dist-etf">${e.etf}</div>
        </div>
      </div>`).join(""),n=(i.riesgos||[]).map(e=>`<div style="padding:3px 0;font-size:11px;color:var(--text2);">— ${e}</div>`).join(""),r=(i.catalizadores||[]).map(e=>`<div style="padding:3px 0;font-size:11px;color:var(--text2);">— ${e}</div>`).join("");return`<div class="inv-card">
      <div class="inv-strategy-header">
        <div class="inv-strategy-title">${i.titulo||"Estrategia de inversión"}</div>
        <div class="inv-strategy-meta">
          <div style="color:var(--teal);font-weight:700;font-family:var(--mono);">Generado con IA</div>
          <div>${o}</div>
        </div>
      </div>
      <div class="inv-resumen">${i.resumen||""}</div>

      <div class="inv-card-title" style="margin-bottom:10px;">Acciones recomendadas</div>
      <div class="inv-g2" style="margin-bottom:20px;">${l}</div>

      <div class="inv-card-title" style="margin-bottom:10px;">Distribución sugerida</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">${t}</div>

      <div class="inv-g2">
        <div class="inv-card-sm">
          <div class="inv-card-title">Riesgos principales</div>
          ${n}
        </div>
        <div class="inv-card-sm">
          <div class="inv-card-title">Catalizadores positivos</div>
          ${r}
        </div>
      </div>
      <div class="inv-disclaimer">⚠ Estrategia generada por IA con datos de ETHAN Mercados. No constituye asesoramiento financiero. Verifica siempre las señales M+S+D antes de ejecutar.</div>
    </div>`}return(S=document.getElementById("inv-refresh"))==null||S.addEventListener("click",b),b(),{destroy(){var i;(i=document.getElementById("inv-css"))==null||i.remove()}}}export{J as render};
