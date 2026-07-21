import{g as j}from"./macro-data-CGVdt8ED.js";async function H(M,{actionsSlot:C}){var h;C.innerHTML='<button class="btn btn-primary" id="tl-refresh">↻ Actualizar</button>',M.innerHTML='<div id="tl-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Descargando datos históricos...</div></div></div>';async function u(){document.getElementById("tl-wrap");try{const[a,i]=await Promise.all([j(!1),fetch("/api/macro-history?type=timeline").then(o=>{if(!o.ok)throw new Error("macro-history: "+o.status);return o.json()})]);I(a,i)}catch(a){document.getElementById("tl-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${a.message}</div></div>`}}function I(a,i){var Y;const o=document.getElementById("tl-wrap"),f=i.timeline||{},d=a.scoreTotal??0,$=d>=4?"var(--green)":d>=0?"var(--amber)":"var(--red)",l=f.spNorm||[],c=f.cpiYoY||[],p=f.scoreHistory||[],w=[...l,...c,...p].map(t=>new Date(t.date+"-01"));if(w.length===0){o.innerHTML='<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Sin datos históricos</div></div>';return}const x=new Date(Math.min(...w)),b=new Date,n=820,v=180,m=8,y=12,F=[...l.map(t=>t.value),...c.map(t=>t.value),...p.map(t=>t.value*15)].filter(t=>t!=null&&isFinite(t)),k=Math.min(...F,-10),B=Math.max(...F,10);function D(t){const s=new Date(t+"-01");return m+(s-x)/(b-x)*(n-2*m)}function z(t){return y+(1-(t-k)/(B-k))*(v-2*y)}function r(t,s=1){return t.filter(g=>g.value!=null).map(g=>`${D(g.date).toFixed(1)},${z(g.value*s).toFixed(1)}`).join(" ")}const P=z(0),S=[];let e=new Date(x);for(e.setMonth(0),e.setDate(1);e<=b;)S.push({year:e.getFullYear(),x:D(e.toISOString().slice(0,7))}),e=new Date(e.getFullYear()+1,0,1);o.innerHTML=`
      <div class="mac-card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);">
            SP500 normalizado · CPI YoY · Score Parcial (3 indicadores auto) · ${x.getFullYear()}–${b.getFullYear()}
          </div>
          <div style="display:flex;gap:14px;">
            ${[["var(--green)","SP500 (norm.)"],["var(--red)","CPI YoY"],["var(--teal)","Score parcial ×15"]].map(([t,s])=>`<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--text2);"><div style="width:8px;height:3px;background:${t};border-radius:2px;"></div>${s}</div>`).join("")}
          </div>
        </div>
        <svg viewBox="0 0 ${n} ${v}" style="width:100%;background:var(--surface2);border-radius:8px;" preserveAspectRatio="none">
          <line x1="0" y1="${P.toFixed(1)}" x2="${n}" y2="${P.toFixed(1)}" stroke="var(--border2)" stroke-width="1" stroke-dasharray="4"/>
          ${S.map(t=>`
            <line x1="${t.x.toFixed(1)}" y1="0" x2="${t.x.toFixed(1)}" y2="${v}" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3"/>
            <text x="${(t.x+3).toFixed(1)}" y="${v-3}" font-family="IBM Plex Mono" font-size="8" fill="var(--text3)">${t.year}</text>
          `).join("")}
          ${r(c)?`<polyline points="${r(c)}"     fill="none" stroke="var(--red)"   stroke-width="1.5" stroke-linejoin="round" opacity="0.75"/>`:""}
          ${r(l)?`<polyline points="${r(l)}"     fill="none" stroke="var(--green)" stroke-width="2"   stroke-linejoin="round" opacity="0.8"/>`:""}
          ${r(p)?`<polyline points="${r(p,15)}" fill="none" stroke="var(--teal)"  stroke-width="2" stroke-linejoin="round"/>`:""}
          <circle cx="${(n-m-4).toFixed(1)}" cy="${(y+10).toFixed(1)}" r="4" fill="${$}"/>
          <text x="${(n-m-30).toFixed(1)}" y="${(y+8).toFixed(1)}" font-family="IBM Plex Mono" font-size="8" fill="${$}">${d>=0?"+":""}${d}</text>
        </svg>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:8px;">
          Score parcial = Curva USD + Tipo Real + BBB Spread (×15 para visibilidad). Rango: −3 a +3. Score completo requiere M2 Global, LEI e Impulso (manuales).
          ${(Y=i.errors)!=null&&Y.length?" · ⚠ "+i.errors.slice(0,2).join(", "):""}
        </div>
      </div>

      <div class="mac-card">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:12px;">Períodos Históricos con Configuración Similar</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead><tr style="background:var(--surface2);">
            <th style="padding:8px 12px;text-align:left;font-size:9px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);">Período</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">Curva USD</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">CPI YoY</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">Tipo Real</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">SP500 +6m</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">SP500 +12m</th>
            <th style="padding:8px 12px;text-align:left;font-size:9px;color:var(--text3);border-bottom:1px solid var(--border);">Contexto</th>
          </tr></thead>
          <tbody>
            ${[{p:"Jun 2022",c:"-0.04%",cpi:"9.1%",tr:"-3.7%",s6:"-14%",s12:"-18%",ctx:"Pico inflación · Fed subiendo agresivamente",s6c:"var(--red)",s12c:"var(--red)"},{p:"Oct 2019",c:"+0.15%",cpi:"1.8%",tr:"+3.5%",s6:"+8%",s12:"+19%",ctx:"Curva recuperando · Fed bajando tipos",s6c:"var(--green)",s12c:"var(--green)"},{p:"Nov 2018",c:"+0.21%",cpi:"2.2%",tr:"+0.2%",s6:"-7%",s12:"+14%",ctx:"QT + trade war · luego Fed pivotó",s6c:"var(--red)",s12c:"var(--green)"},{p:"Dic 2007",c:"+0.74%",cpi:"4.1%",tr:"+1.1%",s6:"-12%",s12:"-38%",ctx:"Crisis subprime · spreads disparados",s6c:"var(--red)",s12c:"var(--red)"},{p:"Mar 2020",c:"+0.48%",cpi:"+1.5%",tr:"+3.5%",s6:"+39%",s12:"+53%",ctx:"COVID · Fed QE masivo → rebote brutal",s6c:"var(--green)",s12c:"var(--green)"}].map(t=>`<tr>
              <td style="padding:9px 12px;border-bottom:1px solid var(--border);font-weight:600;">${t.p}</td>
              <td style="padding:9px 12px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);color:${t.c.startsWith("-")?"var(--red)":"var(--green)"};">${t.c}</td>
              <td style="padding:9px 12px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);color:var(--amber);">${t.cpi}</td>
              <td style="padding:9px 12px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);color:${parseFloat(t.tr)>0?"var(--green)":"var(--red)"};">${t.tr}</td>
              <td style="padding:9px 12px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);font-weight:700;color:${t.s6c};">${t.s6}</td>
              <td style="padding:9px 12px;text-align:center;border-bottom:1px solid var(--border);font-family:var(--mono);font-weight:700;color:${t.s12c};">${t.s12}</td>
              <td style="padding:9px 12px;border-bottom:1px solid var(--border);font-size:10px;color:var(--text2);">${t.ctx}</td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:10px;">Rendimientos históricos documentados. No constituyen garantía de rendimientos futuros.</div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Calculado en servidor · Yahoo Finance (SP500) · FRED (CPIAUCSL, DGS10, DGS2, DFF, BAMLC0A4CBBB) · sin API key en frontend</div>
    `}return(h=document.getElementById("tl-refresh"))==null||h.addEventListener("click",u),await u(),{destroy(){}}}export{H as render};
