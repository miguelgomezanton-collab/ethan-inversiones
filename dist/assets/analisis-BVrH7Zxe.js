async function x(y,{actionsSlot:b}){let w=null;b.innerHTML=`
    <div class="fund-search-bar">
      <input type="text" id="fund-ticker-input" placeholder="Ticker: AAPL, MSFT, ACS.MC..." autocomplete="off">
      <button class="btn btn-primary" id="fund-analyze-btn">Analizar</button>
    </div>
  `,y.innerHTML=`
    <div id="fund-content">
      <div class="empty">
        <div class="empty-icon">🧮</div>
        <div class="empty-title">Análisis Fundamental</div>
        <div class="empty-desc">Introduce un ticker para calcular los 3 indicadores ETHAN: Fundamental, Greenblatt y Lynch.</div>
      </div>
    </div>
  `;const u=document.getElementById("fund-content"),s=n=>n===null?"—":n>=1e3?`$${(n/1e3).toFixed(1)}B`:`$${n.toFixed(0)}M`,e=n=>n===null?"—":`${n>=0?"+":""}${n.toFixed(1)}%`,c=n=>n===null?"—":`${n.toFixed(1)}x`,g=n=>n===null?"—":n.toFixed(2);function v(n,d,i,a=90){if(n===null)return`
      <div class="fund-ring" style="width:${a}px;height:${a}px;">
        <svg width="${a}" height="${a}" viewBox="0 0 ${a} ${a}">
          <circle cx="${a/2}" cy="${a/2}" r="${a/2-8}" fill="none" stroke="var(--surface2)" stroke-width="6"/>
        </svg>
        <div class="fund-ring-inner">
          <div class="fund-ring-num" style="color:var(--text3);font-size:16px;">—</div>
        </div>
      </div>`;const r=a/2-8,o=2*Math.PI*r,f=o-n/5*o,h=a>=90?24:18;return`
      <div class="fund-ring" style="width:${a}px;height:${a}px;">
        <svg width="${a}" height="${a}" viewBox="0 0 ${a} ${a}">
          <circle cx="${a/2}" cy="${a/2}" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="6"/>
          <circle cx="${a/2}" cy="${a/2}" r="${r}" fill="none" stroke="${i}"
            stroke-width="6" stroke-dasharray="${o}" stroke-dashoffset="${f}"
            stroke-linecap="round" transform="rotate(-90 ${a/2} ${a/2})"/>
        </svg>
        <div class="fund-ring-inner">
          <div class="fund-ring-num" style="color:${i};font-size:${h}px;">${n.toFixed(1)}</div>
        </div>
      </div>
    `}function l(n){return n===null?"var(--text3)":n>=4.5?"var(--green)":n>=4?"#6ee7b7":n>=3?"var(--amber)":n>=2?"#f97316":"var(--red)"}function t(n,d=5){if(n===null)return'<div class="fund-mini-bar-wrap"><div class="fund-mini-bar-track"><div class="fund-mini-bar-fill" style="width:0%;background:var(--text3)"></div></div><span style="color:var(--text3)">—</span></div>';const i=n/d*100,a=l(n);return`<div class="fund-mini-bar-wrap"><div class="fund-mini-bar-track"><div class="fund-mini-bar-fill" style="width:${i}%;background:${a}"></div></div><span style="color:${a};font-family:var(--mono);font-size:10px;">${n.toFixed(1)}</span></div>`}function E(n){const d=n.scoresFundamental,i=n.scoresGreenblatt,a=n.scoresLynch,r=l(n.scoreFinal);u.innerHTML=`
      <div class="fund-header-card">
        <div class="fund-company-info">
          <div class="fund-ticker-badge">${n.ticker}</div>
          <div>
            <div class="fund-company-name">${n.company}</div>
            <div class="fund-company-meta">${[n.sector,n.industry,n.exchange].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
        <div class="fund-price-block">
          <div class="fund-price-value">${n.price?"$"+n.price.toFixed(2):"—"}</div>
          <div class="fund-price-cap">${n.marketCap?s(Math.round(n.marketCap/1e6)):"—"} cap</div>
        </div>
      </div>

      <!-- SCORE FINAL -->
      <div class="fund-final-card" style="border-color:${r}30;">
        <div class="fund-final-left">
          ${v(n.scoreFinal,n.recomendacion,r,110)}
        </div>
        <div class="fund-final-right">
          <div class="fund-final-label">Puntuación Final ETHAN</div>
          <div class="fund-final-rec" style="color:${r}">${n.recomendacion||"—"}</div>
          <div class="fund-final-formula">( Fundamental + Greenblatt + Lynch ) / 3</div>
        </div>
      </div>

      <!-- 3 INDICADORES -->
      <div class="fund-indicators-row">

        <!-- FUNDAMENTAL -->
        <div class="fund-ind-card">
          <div class="fund-ind-header">
            ${v(d.total,d.label,l(d.total),80)}
            <div>
              <div class="fund-ind-title">Fundamental</div>
              <div class="fund-ind-label" style="color:${l(d.total)}">${d.label||"—"}</div>
              <div class="fund-ind-formula">60% Solidez + 40% Momentum</div>
            </div>
          </div>
          <div class="fund-ind-rows">
            <div class="fund-ind-row"><span>Crec. Ingresos</span><span class="fund-ind-data">${e(n.datos.crecIngresos)}</span>${t(d.crecIngresos)}</div>
            <div class="fund-ind-row"><span>Crec. EBITDA</span><span class="fund-ind-data">${e(n.datos.crecEBITDA)}</span>${t(d.crecEBITDA)}</div>
            <div class="fund-ind-row"><span>Márgenes Op/Neto</span><span class="fund-ind-data">${n.datos.opMargin!==null?n.datos.opMargin.toFixed(1):"—"}% / ${n.datos.netMargin!==null?n.datos.netMargin.toFixed(1):"—"}%</span>${t(d.margenes)}</div>
            <div class="fund-ind-row"><span>FCF/Ingresos</span><span class="fund-ind-data">${e(n.datos.fcfPct)}</span>${t(d.fcfIngresos)}</div>
            <div class="fund-ind-row"><span>P/FCF</span><span class="fund-ind-data">${c(n.datos.pfcf)}</span>${t(d.pfcf)}</div>
            <div class="fund-ind-row"><span>ROE / MOAT</span><span class="fund-ind-data">${e(n.datos.roe)}</span>${t(d.roe)}</div>
            <div class="fund-ind-row"><span>Deuda/Equity</span><span class="fund-ind-data">${c(n.datos.deudaEquity)}</span>${t(d.deuda)}</div>
            <div class="fund-ind-row fund-ind-row-sep"><span>Solidez</span><span></span>${t(d.solidez)}</div>
            <div class="fund-ind-row"><span>Momentum</span><span class="fund-ind-data">fijo 4.0</span>${t(d.momentum)}</div>
          </div>
        </div>

        <!-- GREENBLATT -->
        <div class="fund-ind-card">
          <div class="fund-ind-header">
            ${v(i.total,i.label,l(i.total),80)}
            <div>
              <div class="fund-ind-title">Greenblatt</div>
              <div class="fund-ind-label" style="color:${l(i.total)}">${i.label||"—"}</div>
              <div class="fund-ind-formula">50% ROIC + 50% EV/EBITDA</div>
            </div>
          </div>
          <div class="fund-ind-rows">
            <div class="fund-ind-row"><span>EBIT</span><span class="fund-ind-data">${s(n.datos.ebit)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>NOPAT (EBIT×0.75)</span><span class="fund-ind-data">${n.datos.ebit?s(Math.round(n.datos.ebit*.75)):"—"}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>Capital Invertido</span><span class="fund-ind-data">${s((n.datos.equity||0)+(n.datos.totalDebt||0))}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row fund-ind-row-sep"><span>ROIC</span><span class="fund-ind-data">${e(n.datos.roic)}</span>${t(i.roic)}</div>
            <div class="fund-ind-row"><span>Market Cap</span><span class="fund-ind-data">${s(n.marketCap?Math.round(n.marketCap/1e6):null)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>Deuda</span><span class="fund-ind-data">${s(n.datos.totalDebt)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>Cash</span><span class="fund-ind-data">${s(n.datos.cash)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>EBITDA</span><span class="fund-ind-data">${s(n.datos.ebitda)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row fund-ind-row-sep"><span>EV/EBITDA</span><span class="fund-ind-data">${c(n.datos.evEbitda)}</span>${t(i.evEbitda)}</div>
          </div>
        </div>

        <!-- LYNCH -->
        <div class="fund-ind-card">
          <div class="fund-ind-header">
            ${v(a.total,a.label,l(a.total),80)}
            <div>
              <div class="fund-ind-title">Lynch</div>
              <div class="fund-ind-label" style="color:${l(a.total)}">${a.label||"—"}</div>
              <div class="fund-ind-formula">50% PER + 50% PEG</div>
            </div>
          </div>
          <div class="fund-ind-rows">
            <div class="fund-ind-row"><span>Precio</span><span class="fund-ind-data">${n.price?"$"+n.price.toFixed(2):"—"}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row"><span>BPA (EPS)</span><span class="fund-ind-data">${n.datos.eps?"$"+n.datos.eps.toFixed(2):"—"}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row fund-ind-row-sep"><span>PER</span><span class="fund-ind-data">${c(n.datos.per)}</span>${t(a.per)}</div>
            <div class="fund-ind-row"><span>Crec. BPA</span><span class="fund-ind-data">${e(n.datos.crecBPA)}</span><div class="fund-mini-bar-wrap"></div></div>
            <div class="fund-ind-row fund-ind-row-sep"><span>PEG</span><span class="fund-ind-data">${g(n.datos.peg)}</span>${t(a.peg)}</div>
          </div>
        </div>
      </div>

      <!-- DATOS FINANCIEROS RESUMEN -->
      <div class="section-title" style="margin-top:26px;">Datos Financieros <span class="count">último año fiscal · millones</span></div>
      <div class="fund-data-grid">
        ${[["Ingresos",s(n.datos.revenue)],["EBITDA",s(n.datos.ebitda)],["EBIT",s(n.datos.ebit)],["Beneficio Neto",s(n.datos.netIncome)],["Free Cash Flow",s(n.datos.fcf)],["Equity (Book)",s(n.datos.equity)],["Deuda Total",s(n.datos.totalDebt)],["Cash",s(n.datos.cash)],["Beta",n.datos.beta!==null&&n.datos.beta!==void 0?n.datos.beta.toFixed(2):"—"],["Dividendo Yield",n.datos.divYield!==null&&n.datos.divYield!==void 0?n.datos.divYield.toFixed(2)+"%":"—"],["ROE",e(n.datos.roe)],["Crec. Ingresos YoY",e(n.datos.crecIngresos)]].map(([o,f])=>`
          <div class="fund-data-item">
            <div class="fund-data-label">${o}</div>
            <div class="fund-data-value">${f}</div>
          </div>
        `).join("")}
      </div>

      ${n.errors?`
        <div style="margin-top:16px;font-family:var(--mono);font-size:9px;color:var(--amber);">
          ⚠ ${n.errors.join(" · ")}
        </div>
      `:""}
    `}async function p(){var d;const n=(d=document.getElementById("fund-ticker-input"))==null?void 0:d.value.trim().toUpperCase();if(n){u.innerHTML=`
      <div class="empty">
        <div class="loader-ring"></div>
        <div class="empty-title">Analizando ${n}</div>
        <div class="empty-desc">Trayendo datos de Financial Modeling Prep...</div>
      </div>
    `;try{const i=await fetch(`/api/fundamental?ticker=${encodeURIComponent(n)}`),a=await i.json();if(!i.ok||a.error)throw new Error(a.error||`HTTP ${i.status}`);w=a,E(a)}catch(i){u.innerHTML=`
        <div class="empty">
          <div class="empty-icon">⚠</div>
          <div class="empty-title">Error al analizar ${n}</div>
          <div class="empty-desc">${i.message}</div>
        </div>
      `}}}const $=document.getElementById("fund-analyze-btn"),m=document.getElementById("fund-ticker-input");return $&&$.addEventListener("click",p),m&&m.addEventListener("keydown",n=>{n.key==="Enter"&&(n.preventDefault(),p())}),{destroy(){}}}export{x as render};
