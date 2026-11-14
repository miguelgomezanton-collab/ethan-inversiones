import{g as Vt}from"./macro-data-CGVdt8ED.js";const Ht={US10Y:{label:"Treasury 10Y"},DFF:{label:"Fed Funds Rate"},CPI_YOY:{label:"CPI Headline YoY"},CORE_CPI_YOY:{label:"Core CPI YoY"}};async function qt($t,{actionsSlot:bt}){var lt;let V="10Y",z="US10Y";bt.innerHTML=`
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono);">Variable:</span>
        <select id="tl-var" style="background:var(--surface2);border:1px solid var(--border);color:var(--text1);font-family:var(--mono);font-size:10px;padding:4px 8px;border-radius:4px;cursor:pointer;">
          ${Object.entries(Ht).map(([o,g])=>`<option value="${o}" ${o==="US10Y"?"selected":""}>${g.label}</option>`).join("")}
        </select>
      </div>
      <div style="display:flex;gap:4px;">
        ${["5Y","10Y","20Y","MAX"].map(o=>`<button class="btn tl-win ${o==="10Y"?"btn-primary":""}" data-w="${o}" style="padding:4px 9px;font-size:10px;">${o}</button>`).join("")}
      </div>
      <button class="btn btn-primary" id="tl-refresh" style="padding:4px 9px;font-size:10px;">↻</button>
    </div>`,$t.innerHTML='<div id="tl-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div></div></div>';let U=null;async function G(o=!1){const g=document.getElementById("tl-wrap");try{const[n,M]=await Promise.all([Vt(o),fetch("/api/macro-history?type=timeline").then(f=>{if(!f.ok)throw new Error("macro-history: "+f.status);return f.json()})]);U=M,st(n,M)}catch(n){g.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${n.message}</div></div>`}}function St(o){if(!o||!o.current||!o.current.top10||!o.current.top10.length)return'<div class="mac-card" style="background:rgba(251,191,36,0.04);border-color:rgba(251,191,36,0.2);"><div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);">Analogías Históricas — sin datos suficientes</div></div>';const g=o.current,n=g.summary,M=g.top10,f=e=>e!=null?(e>=0?"+":"")+e.toFixed(1)+"%":"—",W=e=>e!=null?(e>=0?"+":"")+e.toFixed(3):"—",c=e=>e==null?"var(--text3)":e>0?"var(--green)":"var(--red)",R=e=>e>.8?"var(--green)":e>.5?"var(--amber)":"var(--red)",a=[["Mediana S&P +6m",n.medianSp6m,!0],["Mediana S&P +12m",n.medianSp12m,!0],["% positivas +12m",n.pctPositive12m!=null?n.pctPositive12m+"%":null,!1],["Mediana MaxDD 12m",n.medianMaxDD,!0]].map(([e,l,C])=>'<div style="background:var(--surface2);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:4px;">'+e+'</div><div style="font-family:var(--serif);font-size:20px;font-weight:600;font-style:italic;color:'+(C?c(typeof l=="string"?parseFloat(l):l):"var(--text1)")+';">'+(C&&l!=null?(l>=0?"+":"")+parseFloat(l).toFixed(1)+"%":l||"—")+"</div></div>").join(""),y=M.map((e,l)=>'<tr style="border-bottom:1px solid var(--border);'+(l===0?"background:rgba(64,217,192,0.04);":"")+'"><td style="padding:6px 8px;font-family:var(--mono);color:var(--text1);">'+e.month+'</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:'+R(e.similarity)+';">'+(e.similarity*100).toFixed(1)+'%</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:var(--text3);">'+e.dimsUsed+'/9</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:'+c(e.scoreNorm)+';">'+W(e.scoreNorm)+'</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:'+c(e.sp3m)+';">'+f(e.sp3m)+'</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:'+c(e.sp6m)+';">'+f(e.sp6m)+'</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:'+c(e.sp12m)+';">'+f(e.sp12m)+'</td><td style="padding:6px 8px;text-align:right;font-family:var(--mono);color:var(--red);">'+f(e.maxDD12m)+"</td></tr>").join(""),tt=(o.probes||[]).map(e=>{var E,J;if(e.error)return'<div style="font-size:10px;color:var(--text3);margin-bottom:8px;">'+e.month+": "+e.error+"</div>";const l=e.diag||{},C=l.universeTotal!=null?'<div style="font-size:9px;font-family:var(--mono);color:var(--text3);margin-bottom:6px;line-height:1.7;background:var(--surface2);padding:6px 8px;border-radius:4px;">Universe: '+l.universeTotal+" → válidos: "+l.afterValid+" → embargo-12M: "+l.afterEmbargo+" → coverage≥60%: "+l.afterCoverage+" → sim calculada: "+(l.afterSimCalc||0)+" → elegibles: "+(l.eligibleCount||0)+" → final: "+(((E=e.analogies)==null?void 0:E.length)||0)+"</div>":"",H=(l.top15Raw||[]).map(i=>'<tr style="border-top:1px solid var(--border);opacity:'+(i.eligible?"1":"0.55")+';"><td style="padding:2px 4px;color:'+(i.eligible?"var(--text1)":"var(--text3)")+';">'+i.month+'</td><td style="padding:2px 4px;text-align:right;color:'+R(i.sim)+';">'+(i.sim*100).toFixed(1)+'%</td><td style="padding:2px 4px;text-align:right;color:var(--text3);">'+i.dims+'</td><td style="padding:2px 4px;text-align:right;color:'+c(i.scoreNorm)+';">'+W(i.scoreNorm)+'</td><td style="padding:2px 4px;text-align:right;color:'+c(i.sp3m)+';">'+f(i.sp3m)+'</td><td style="padding:2px 4px;text-align:right;color:'+c(i.sp6m)+';">'+f(i.sp6m)+'</td><td style="padding:2px 4px;text-align:right;color:'+c(i.sp12m)+';">'+f(i.sp12m)+'</td><td style="padding:2px 4px;text-align:right;color:var(--red);">'+f(i.maxDD12m)+'</td><td style="padding:2px 4px;font-size:8px;color:'+(i.status==="SELECTED"?"var(--teal)":i.status==="ELIGIBLE"?"var(--green)":"var(--red)")+';">'+(i.status||"?")+(i.status==="REJECTED"?" "+(i.rejectionReasons||[]).join(", "):"")+"</td></tr>").join("");return'<div style="margin-bottom:16px;"><div style="font-size:10px;font-weight:700;color:var(--teal);margin-bottom:4px;font-family:var(--mono);">'+e.month+" · "+(((J=e.analogies)==null?void 0:J.length)||0)+" analogías finales</div>"+C+(H?'<table style="width:100%;border-collapse:collapse;font-size:9px;font-family:var(--mono);"><tr style="color:var(--text3);"><td style="padding:2px 4px;">Mes</td><td style="padding:2px 4px;text-align:right;">Sim.</td><td style="padding:2px 4px;text-align:right;">D</td><td style="padding:2px 4px;text-align:right;">Score</td><td style="padding:2px 4px;text-align:right;">+3m</td><td style="padding:2px 4px;text-align:right;">+6m</td><td style="padding:2px 4px;text-align:right;">+12m</td><td style="padding:2px 4px;text-align:right;">DD</td><td style="padding:2px 4px;">Estado</td></tr>'+H+"</table>":"")+"</div>"}).join("");return'<div class="mac-card" style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;"><div><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Analogías Históricas</span><span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:8px;">'+g.month+" · Top "+M.length+" · "+o.version+"</span></div>"+(o.spCoverage?'<div style="font-size:9px;font-family:var(--mono);color:var(--amber);">SP500: '+o.spCoverage.first+" → "+o.spCoverage.last+" ("+o.spCoverage.n+"m) · A:"+(o.spCoverage.chunkA||"—")+" B:"+(o.spCoverage.chunkB||"—")+"</div>":"")+'<div style="font-size:9px;font-family:var(--mono);color:var(--text3);">Mín. '+o.minDims+"/9 dims · excl. últimos "+o.excludeLast+'m · coseno z-score winsorizado</div></div><div style="font-size:10px;color:var(--amber);font-family:var(--mono);margin-bottom:10px;">⚠ Comportamiento histórico posterior de configuraciones similares — no es forecast</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;">'+a+'</div><table style="width:100%;border-collapse:collapse;font-size:10px;"><thead><tr style="background:var(--surface2);"><th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text3);">Mes</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">Simil.</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">Dims</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">ScoreNorm</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">S&P +3m</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">S&P +6m</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">S&P +12m</th><th style="padding:6px 8px;text-align:right;font-size:9px;color:var(--text3);">MaxDD 12m</th></tr></thead><tbody>'+y+'</tbody></table></div><div class="mac-card" style="margin-bottom:14px;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">🔍 Validación — Top 5 de meses de referencia</div>'+tt+"</div>"}function st(o,g){var mt,gt,ft,yt,ut,ht;const n=document.getElementById("tl-wrap"),M=g.timeline||{};o.scoreTotal;const f=M.spNorm||[],W=M.scoreHistory||[],c=((mt=M.macroVars)==null?void 0:mt[z])||{},R=c.series||[],a=M._debug||{},y=t=>String(t||"").slice(0,7),tt=new Set(f.map(t=>y(t.date))),e=new Set(R.map(t=>y(t.date))),l=[...tt].filter(t=>e.has(t)).sort();if(l.length===0){n.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos</div>
        <div class="empty-desc" style="font-family:var(--mono);font-size:10px;">
          spNorm: ${f.length} · ${c.label||z}: ${R.length}<br>
          Score: ${a.nScore||0} meses · ${a.firstScore||"—"} → ${a.lastScore||"—"}
        </div></div>`;return}const C=new Date(l[l.length-1]+"-01"),H=V==="MAX"?100:parseInt(V),E=new Date(C);E.setFullYear(E.getFullYear()-H);const J=E.toISOString().slice(0,7),i=l.filter(t=>t>=J);if(i.length<3){n.innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos en ventana ${V}</div></div>`;return}const L=i[0],T=i[i.length-1],j=new Date(L+"-01"),et=new Date(T+"-01"),ot=f.filter(t=>y(t.date)>=L&&y(t.date)<=T),Mt=ot.length?ot[0].value:1,K=ot.map(t=>({date:t.date,value:+((t.value/Mt-1)*100).toFixed(2)})),q=R.filter(t=>y(t.date)>=L&&y(t.date)<=T),w=W.filter(t=>y(t.date)>=L&&y(t.date)<=T),b=820,r=42,F=6,Y=16,u=85,X=10,wt=(u+Y)*3+X*2+F*2+16,D=F+Y,N=F+Y+u+X+Y,k=F+Y+(u+X+Y)*2;function at(t){const v=new Date(y(t)+"-01"),s=et-j;return s>0?r+(v-j)/s*(b-2*r):r}function dt(t,v){const s=t.filter(h=>h!=null&&isFinite(h));if(!s.length)return{fn:()=>v+u/2,min:0,max:0};const m=Math.min(...s),p=Math.max(...s),$=(p-m)*.12||.5;return{fn:h=>v+F+(1-(h-(m-$))/(p+$-(m-$)))*(u-2*F),min:m-$,max:p+$}}function Ft(t,v){const s=t.filter(x=>x!=null&&isFinite(x));if(!s.length)return{fn:()=>v+u/2,min:0,max:0,ticks:[]};const m=Math.min(0,...s),p=Math.max(0,...s),$=(p-m)*.08||5,h=m-$,S=p+$,d=x=>v+F+(1-(x-h)/(S-h))*(u-2*F),P=p>200?50:p>100?25:10,I=[];for(let x=Math.ceil(h/P)*P;x<=S;x+=P)I.push(x);return{fn:d,min:h,max:S,ticks:I}}function B(t,v){return t.filter(s=>s.value!=null&&isFinite(s.value)).map(s=>`${at(s.date).toFixed(1)},${v(s.value).toFixed(1)}`).join(" ")}const O=Ft(K.map(t=>t.value),D),A=dt(q.map(t=>t.value),N),_=dt(w.map(t=>t.value),k),rt=H>=15?5:1,ct=[];let Q=Math.ceil(j.getFullYear()/rt)*rt;for(;Q<=et.getFullYear()+1;){const t=at(`${Q}-01-01`);t>=r&&t<=b-r&&ct.push({year:Q,x:t}),Q+=rt}function pt(t,v){return[0,.5,1].map(s=>{const m=t.min+(t.max-t.min)*s;return{y:t.fn(m),label:Math.abs(m)>=10?m.toFixed(1):m.toFixed(2)}})}const Pt=(O.ticks||[]).map(t=>({y:O.fn(t),label:(t>=0?"+":"")+t+"%"})),zt=pt(A),Dt=pt(_),kt=9,At=9;a.firstScore&&a.firstScore.slice(0,7),a.lastScore&&a.lastScore.slice(0,7),n.innerHTML=`
      <div class="mac-card" style="margin-bottom:14px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);">Timeline Histórico · Ventana: ${V}</span>
            <span style="font-size:9px;font-family:var(--mono);color:var(--text2);margin-left:10px;">Común SP500+${c.label||z}: ${L} → ${T} · ${i.length}m</span>
          </div>
          <div style="font-size:9px;font-family:var(--mono);color:var(--amber);">
            Score parcial ${kt}/${At} · ${a.nScore||w.length}m · ${((gt=a.firstScore)==null?void 0:gt.slice(0,7))||"—"} → ${((ft=a.lastScore)==null?void 0:ft.slice(0,7))||"—"} · PROVISIONAL
          </div>
        </div>

        <!-- SVG 3 paneles -->
        <svg viewBox="0 0 ${b} ${wt}" style="width:100%;background:var(--surface2);border-radius:8px;" preserveAspectRatio="xMidYMid meet">

          <!-- Labels de panel -->
          <text x="${r}" y="${F+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--green)">S&amp;P 500 (var. % desde inicio ventana)</text>
          <text x="${r}" y="${D+u+X+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--blue)">${c.label||z} · ${c.unit||"%"} · ${c.source||"FRED"} · ${c.transform||"media mensual"}</text>
          <text x="${r}" y="${N+u+X+11}" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">Macro Score Histórico · HIST_MACRO_V1_FRED · ScoreNorm [-1,+1] · PROVISIONAL</text>

          <!-- Separadores -->
          <line x1="${r}" y1="${N}" x2="${b-r}" y2="${N}" stroke="var(--border)" stroke-width="0.5"/>
          <line x1="${r}" y1="${k}" x2="${b-r}" y2="${k}" stroke="var(--border)" stroke-width="0.5"/>

          <!-- Línea 0% P1, P2 y P3 -->
          <line x1="${r}" y1="${O.fn(0).toFixed(1)}" x2="${b-r}" y2="${O.fn(0).toFixed(1)}" stroke="var(--green)" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
          ${A.fn(0)>N&&A.fn(0)<N+u?`<line x1="${r}" y1="${A.fn(0).toFixed(1)}" x2="${b-r}" y2="${A.fn(0).toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>`:""}
          <line x1="${r}" y1="${_.fn(0).toFixed(1)}" x2="${b-r}" y2="${_.fn(0).toFixed(1)}" stroke="var(--border2)" stroke-width="0.8" stroke-dasharray="4"/>

          <!-- Ticks X -->
          ${ct.map(t=>`
            <line x1="${t.x.toFixed(1)}" y1="${D}" x2="${t.x.toFixed(1)}" y2="${(k+u).toFixed(1)}" stroke="var(--border)" stroke-width="0.4" stroke-dasharray="3"/>
            <text x="${t.x.toFixed(1)}" y="${(k+u+13).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">${t.year}</text>
          `).join("")}

          <!-- Eje Y labels -->
          ${Pt.map(t=>`<text x="${(r-3).toFixed(1)}" y="${(t.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${t.label}</text>`).join("")}
          ${zt.map(t=>`<text x="${(r-3).toFixed(1)}" y="${(t.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${t.label}</text>`).join("")}
          ${Dt.map(t=>`<text x="${(r-3).toFixed(1)}" y="${(t.y+3).toFixed(1)}" text-anchor="end" font-family="IBM Plex Mono" font-size="7" fill="var(--text3)">${t.label}</text>`).join("")}

          <!-- Series -->
          ${B(K,O.fn)?`<polyline points="${B(K,O.fn)}"  fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linejoin="round" opacity="0.9"/>`:""}
          ${B(q,A.fn)?`<polyline points="${B(q,A.fn)}" fill="none" stroke="var(--blue)"  stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/>`:""}
          ${B(w,_.fn)?`<polyline points="${B(w,_.fn)}"  fill="none" stroke="var(--teal)"  stroke-width="2"   stroke-linejoin="round"/>`:""}

          <!-- Punto actual score — muestra ScoreNorm, no raw -->
          ${w.length?(()=>{const t=w[w.length-1],v=at(t.date).toFixed(1),s=_.fn(t.value).toFixed(1),m=t.value!=null?(t.value>=0?"+":"")+t.value.toFixed(2):"—",p=t.value>.2?"var(--green)":t.value<-.2?"var(--red)":"var(--amber)";return`<circle cx="${v}" cy="${s}" r="4" fill="${p}"/>
                    <text x="${(+v+6).toFixed(1)}" y="${(+s+4).toFixed(1)}" font-family="IBM Plex Mono" font-size="9" fill="${p}">${m}</text>`})():""}
          <!-- Overlay tooltip -->
          <rect id="tl-overlay" x="${r}" y="${D}" width="${b-2*r}" height="${k+u-D}" fill="transparent" style="cursor:crosshair;"/>
          <line id="tl-cursor" x1="${r}" y1="${D}" x2="${r}" y2="${k+u}" stroke="var(--text3)" stroke-width="0.8" stroke-dasharray="3" opacity="0" pointer-events="none"/>
          <g id="tl-tooltip" opacity="0" pointer-events="none">
            <rect id="tl-tt-bg" x="0" y="0" width="220" height="72" rx="5" fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
            <text id="tl-tt-date" x="8" y="15" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">—</text>
            <text id="tl-tt-sp"   x="8" y="28" font-family="IBM Plex Mono" font-size="9" fill="var(--green)">S&amp;P 500: —</text>
            <text id="tl-tt-var"  x="8" y="41" font-family="IBM Plex Mono" font-size="9" fill="var(--blue)">—: —</text>
            <text id="tl-tt-sc"   x="8" y="54" font-family="IBM Plex Mono" font-size="9" fill="var(--teal)">Score: —</text>
            <text id="tl-tt-note" x="8" y="67" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">PROVISIONAL</text>
          </g>
        </svg>

        <!-- Debug/auditoría -->
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;line-height:1.7;">
          Serie: ${c.source||"—"} · Frecuencia origen: ${z.includes("YOY")?"mensual":"diaria"} ·
          Transformación: ${c.transform||"media mensual"} · Período: ${L} → ${T} · N meses válidos: ${q.length}<br>
          ${a.version||"HIST_MACRO_V1_FRED"} · 8 ind. score + BBB (analogías) · ${a.nValid||"—"}/${a.nTotal||"—"} meses válidos · ${a.firstScore||"—"} → ${a.lastScore||"—"} · <span style="color:${a.invariantsPass?"var(--green)":"var(--red)"}">${a.invariantStatus||"—"}</span>
          ${(yt=g.errors)!=null&&yt.length?" · ⚠ "+g.errors.slice(0,2).join(", "):""}
        </div>
      </div>

      <!-- AUDITORÍA HIST_MACRO_V1_FRED -->
      <div class="mac-card" style="margin-bottom:14px;font-family:var(--mono);">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:10px;">
          🔍 Auditoría HIST_MACRO_V1_FRED — 4 meses de referencia
          <span style="color:var(--text3);font-weight:400;margin-left:8px;">
            ${a.nValid||"—"}/${a.nTotal||"—"} meses válidos · MaxPossible=${a.maxPossible||14} · BBB Max Macro:0/Analogías:±1 · <span style="color:${a.invariantsPass?"var(--green)":"var(--red)"}">${a.invariantStatus||"—"}</span>
          </span>
        </div>
        ${(a.auditMonths||[]).map(t=>{var p,$,h;if(!t.valid)return`<div style="font-size:10px;color:var(--text3);margin-bottom:12px;">${t.month}: N/A — ${t.error||"cobertura insuficiente"}</div>`;const v=t.components||{},s=["curvaUSD","tipoReal","lei","m2usa","creditoVsPib","impulso","velM2","reservas","bbb"],m=t.scoreNorm>.2?"var(--green)":t.scoreNorm<-.2?"var(--red)":"var(--amber)";return`
            <div style="margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">
              <div style="font-size:10px;color:var(--teal);margin-bottom:6px;font-weight:700;">
                ${t.month} · ScoreNorm <span style="color:${m}">${t.scoreNorm>=0?"+":""}${(p=t.scoreNorm)==null?void 0:p.toFixed(3)}</span>
                · Raw ${t.scoreRaw>=0?"+":""}${t.scoreRaw} / ${t.maxAvailable}
                · Coverage ${Math.round(t.coverage*100)}%
                · Válidos ${Object.values(v).filter(S=>S.valid&&S.maxScore>0).length}/8
                ${($=t.violations)!=null&&$.length?`<span style="color:var(--red)">⚠ ${t.violations.length} VIOLACIÓN(ES): ${t.violations.join(" | ")}</span>`:""}
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:9px;">
                <thead><tr>
                  <th style="text-align:left;padding:3px 6px;color:var(--text3);">Indicador</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Valor</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Score</th>
                  <th style="text-align:right;padding:3px 6px;color:var(--text3);">Max</th>
                  <th style="text-align:left;padding:3px 6px;color:var(--text3);">Fuente</th>
                  <th style="text-align:center;padding:3px 6px;color:var(--text3);">OK</th>
                </tr></thead>
                <tbody>
                  ${s.map(S=>{const d=v[S];if(!d)return"";const P=d.score!=null?(d.score>=0?"+":"")+d.score:"—",I=d.value!=null?typeof d.value=="number"?d.value.toFixed(2):d.value:"—",x=d.valid?d.score>0?"var(--green)":d.score<0?"var(--red)":"var(--amber)":"var(--text3)";return`<tr style="border-bottom:1px solid var(--border);">
                      <td style="padding:3px 6px;color:var(--text2);">${S}</td>
                      <td style="padding:3px 6px;text-align:right;color:var(--text1);">${I}</td>
                      <td style="padding:3px 6px;text-align:right;color:${x};font-weight:700;">${P}</td>
                      <td style="padding:3px 6px;text-align:right;color:var(--text3);">±${d.maxScore||1}</td>
                      <td style="padding:3px 6px;color:var(--text3);font-size:8px;">${d.source||"—"}${d.note?" · "+d.note:""}</td>
                      <td style="padding:3px 6px;text-align:center;">${d.valid?"✓":"✗"}</td>
                    </tr>`}).join("")}
                  <tr style="background:var(--surface2);">
                    <td style="padding:4px 6px;font-weight:700;color:var(--text1);">TOTAL</td>
                    <td colspan="2" style="padding:4px 6px;text-align:right;font-weight:700;color:${m};">Raw ${t.scoreRaw>=0?"+":""}${t.scoreRaw} / ${t.maxAvailable} = Norm ${t.scoreNorm>=0?"+":""}${(h=t.scoreNorm)==null?void 0:h.toFixed(3)}</td>
                    <td style="padding:4px 6px;text-align:right;color:var(--text3);">${a.maxPossible||14}</td>
                    <td colspan="2" style="padding:4px 6px;color:var(--text3);">Coverage ${Math.round(t.coverage*100)}% (${t.maxAvailable}/${a.maxPossible||14}) ${t.coverage>=.6?"✓ válido":"✗ N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>`}).join("")}
      </div>

      <!-- ANALOGÍAS HISTÓRICAS — FASE 2B -->
      ${St(g.analogies)}
      <div class="co-footer" style="margin-top:14px;">
        Fuentes: FRED SP500 (mensual) · FRED DGS10/DFF/CPIAUCSL/CPILFESL ·
        HIST_MACRO_V1_FRED · ${a.version||"HIST_MACRO_V1_FRED"} · ${a.nScore||w.length} meses válidos (coverage≥60%) · ${((ut=a.firstScore)==null?void 0:ut.slice(0,7))||"—"} → ${((ht=a.lastScore)==null?void 0:ht.slice(0,7))||"—"} · PROVISIONAL
      </div>
    `;const xt=n.querySelector("svg"),it=n.querySelector("#tl-overlay"),Z=n.querySelector("#tl-cursor"),nt=n.querySelector("#tl-tooltip");n.querySelector("#tl-tt-bg");const It=n.querySelector("#tl-tt-date"),Rt=n.querySelector("#tl-tt-sp"),Ct=n.querySelector("#tl-tt-var"),vt=n.querySelector("#tl-tt-sc"),Et=new Map(K.map(t=>[y(t.date),t.value])),Lt=new Map(q.map(t=>[y(t.date),t.value])),Tt=new Map(w.map(t=>[y(t.date),t]));it&&xt&&(it.addEventListener("mousemove",t=>{const v=xt.getBoundingClientRect(),m=b/v.width,p=(t.clientX-v.left)*m,$=(p-r)/(b-2*r),h=j.getTime()+$*(et.getTime()-j.getTime()),S=new Date(h),d=`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}`,P=Et.get(d),I=Lt.get(d),x=Tt.get(d);if(Z.setAttribute("x1",p),Z.setAttribute("x2",p),Z.setAttribute("opacity","1"),It.textContent=d,Rt.textContent=P!=null?`S&P 500: ${P>=0?"+":""}${P.toFixed(1)}%`:"S&P 500: —",Ct.textContent=I!=null?`${c.label||z}: ${I.toFixed(2)}${c.unit||"%"}`:`${c.label||z}: —`,x!=null){const Bt=x.value!=null?(x.value>=0?"+":"")+x.value.toFixed(2):"—",Ot=x.scoreRaw!=null?(x.scoreRaw>=0?"+":"")+x.scoreRaw:"—",_t=x.coverage!=null?Math.round(x.coverage*100)+"%":"—";vt.textContent=`ScoreNorm ${Bt} · Raw ${Ot} · Cov ${_t}`}else vt.textContent="Score: — (N/A o sin datos)";const Yt=p+10<b-230?p+10:p-230,Nt=D+5;nt.setAttribute("transform",`translate(${Yt},${Nt})`),nt.setAttribute("opacity","1")}),it.addEventListener("mouseleave",()=>{Z.setAttribute("opacity","0"),nt.setAttribute("opacity","0")}))}return document.addEventListener("click",o=>{const g=o.target.closest(".tl-win");g&&(V=g.dataset.w,document.querySelectorAll(".tl-win").forEach(n=>n.classList.remove("btn-primary")),g.classList.add("btn-primary"),U&&st({scoreTotal:0},U),G(!1))}),document.addEventListener("change",o=>{o.target.id==="tl-var"&&(z=o.target.value,U&&G(!1))}),(lt=document.getElementById("tl-refresh"))==null||lt.addEventListener("click",()=>G(!0)),await G(!1),{destroy(){}}}export{qt as render};
