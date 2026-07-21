import{g as te}from"./macro-data-CGVdt8ED.js";const m=r=>r!=null?Number(r).toFixed(1):"—",t=r=>r!=null?Number(r).toFixed(2):"—";async function re(r,{actionsSlot:O}){var g;O.innerHTML='<button class="btn btn-primary" id="radar-refresh">↻ Actualizar</button>',r.innerHTML='<div id="radar-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';async function f(l=!1){try{const c=await te(l);Q(c)}catch(c){document.getElementById("radar-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${c.message}</div></div>`}}function Q(l){var y,b,$,S,z,h,M,E,C,R,L,q,w,I,k,B,T,U,G,F,H,A,D,P,j,N,V,X,Y,J,K;const c=document.getElementById("radar-wrap"),i=l.coyuntura||{},s=l.indicators||{},e=l.liquidez||{},o=l.seguimiento||{},p=l.scoreTotal??0,x=p>=4?"var(--green)":p>=0?"var(--amber)":"var(--red)",W=(((y=i.curvaUSD)==null?void 0:y.score)||0)+(((b=i.curvaEUR)==null?void 0:b.score)||0)+((($=s.lei)==null?void 0:$.score)||0),Z=(((S=e.m2)==null?void 0:S.score)||0)+(((z=e.impulso)==null?void 0:z.score)||0)+(((h=e.velM2)==null?void 0:h.score)||0)+(((M=e.credito)==null?void 0:M.score)||0),_=(((E=e.bbbSpread)==null?void 0:E.score)||0)+(((C=o.hySpread)==null?void 0:C.value)!=null?o.hySpread.value<3.5?1:o.hySpread.value<5?0:-1:0),ee=(((R=s.fearGreed)==null?void 0:R.score)||0)+(((L=o.vix)==null?void 0:L.aboveSMA200)!=null?o.vix.aboveSMA200?-1:1:0),ie=(((q=i.tipoReal)==null?void 0:q.score)||0)+(((w=e.reservas)==null?void 0:w.score)||0),ae=((I=s.cpi)==null?void 0:I.score)||0;function oe(a){return a>0?"🟢":a===0?"🟡":"🔴"}const d=[{icon:"🔄",l:"Ciclo Económico",sc:W,detail:`Curva USD ${((k=i.curvaUSD)==null?void 0:k.value)!=null?t(i.curvaUSD.value)+"%":"—"} · Curva EUR ${((B=i.curvaEUR)==null?void 0:B.value)!=null?t(i.curvaEUR.value)+"%":"—"} · LEI ${((T=s.lei)==null?void 0:T.value)!=null?t(s.lei.value)+"%":"—"}`},{icon:"💧",l:"Liquidez Global",sc:Z,detail:`M2 ${((U=e.m2)==null?void 0:U.value)!=null?t(e.m2.value)+"%":"—"} · Impulso ${((G=e.impulso)==null?void 0:G.value)!=null?t(e.impulso.value):"—"} · Vel.M2 ${((F=e.velM2)==null?void 0:F.value)!=null?t(e.velM2.value)+"%":"—"}`},{icon:"📊",l:"Crédito",sc:_,detail:`BBB ${((H=e.bbbSpread)==null?void 0:H.value)!=null?t(e.bbbSpread.value)+"%":"—"} · HY ${((A=o.hySpread)==null?void 0:A.value)!=null?t(o.hySpread.value)+"%":"—"}`},{icon:"🧠",l:"Sentimiento",sc:ee,detail:`F&G ${((D=s.fearGreed)==null?void 0:D.value)??"—"} · VIX ${((P=o.vix)==null?void 0:P.value)!=null?m(o.vix.value):"—"}${(j=o.vix)!=null&&j.aboveSMA200?" ⚠ sobre SMA200":""}`},{icon:"🏦",l:"Política Monetaria",sc:ie,detail:`Tipo real ${((N=i.tipoReal)==null?void 0:N.value)!=null?(i.tipoReal.value>=0?"+":"")+t(i.tipoReal.value)+"%":"—"} · Reservas ${((V=e.reservas)==null?void 0:V.value)!=null?"$"+t(e.reservas.value)+"T":"—"}`},{icon:"🌡️",l:"Inflación",sc:ae,detail:`CPI ${((X=i.cpi)==null?void 0:X.value)!=null?m(i.cpi.value)+"%":"—"} · Core ${((Y=i.cpi)==null?void 0:Y.cpiCore)!=null?m(i.cpi.cpiCore)+"%":"—"} · Riesgo: ${((J=l.riesgoContagio)==null?void 0:J.pct)??"—"}%`}],n=d.reduce((a,v)=>a.sc<v.sc?a:v,d[0]),u=d.reduce((a,v)=>a.sc>v.sc?a:v,d[0]);c.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 300px;gap:14px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${d.map(a=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);border-radius:8px;">
            <div style="font-size:20px;width:30px;text-align:center;flex-shrink:0;">${a.icon}</div>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;color:var(--text1);margin-bottom:2px;">${a.l}</div>
              <div style="font-size:10px;color:var(--text3);font-family:var(--mono);">${a.detail}</div>
            </div>
            <div style="font-size:18px;">${oe(a.sc)}</div>
          </div>`).join("")}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Riesgo principal -->
          <div class="mac-card" style="background:rgba(244,113,116,0.04);border-color:rgba(244,113,116,0.22);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">Riesgo Principal</div>
            <div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:8px;">${n.l}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.6;">${n.l==="Ciclo Económico"?"Curva invertida + LEI negativo anticipan desaceleración o recesión en 6-9 meses. Es el indicador adelantado más fiable históricamente.":n.l==="Liquidez Global"?"El dinero se retira del sistema. Históricamente esto precede presión en activos de riesgo con 6-12 meses de retardo.":n.l==="Inflación"?"Inflación Core elevada impide que la Fed baje tipos, manteniendo condiciones restrictivas más tiempo del esperado.":n.l==="Crédito"?"Los spreads de crédito ampliando señalan estrés en el sistema financiero y riesgo de contagio a la economía real.":n.l==="Política Monetaria"?"Política muy restrictiva — el coste del dinero está frenando inversión y consumo de forma significativa.":"Sentimiento codicioso con macro deteriorándose — señal de complacencia que históricamente precede correcciones."}</div>
          </div>

          <!-- Factor mitigante -->
          <div class="mac-card" style="background:rgba(74,222,128,0.04);border-color:rgba(74,222,128,0.2);">
            <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">Factor Mitigante</div>
            <div style="font-size:14px;font-weight:700;color:var(--green);margin-bottom:6px;">${u.l}</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5;">${u.l==="Sentimiento"&&((K=s.fearGreed)==null?void 0:K.value)<40?"El miedo extremo de mercado actúa como señal contrarian alcista si el macro se estabiliza.":u.l==="Liquidez Global"?"M2 positivo inyecta combustible que puede sostener el ciclo más tiempo del que sugieren los adelantados.":"El bloque más sólido del sistema actúa como amortiguador frente al riesgo principal."}</div>
          </div>

          <!-- Score total -->
          <div class="mac-card" style="text-align:center;">
            <div style="font-size:9px;color:var(--text3);font-family:var(--mono);text-transform:uppercase;margin-bottom:8px;">Score Total</div>
            <div style="font-family:var(--serif);font-size:48px;font-weight:600;font-style:italic;color:${x};">${p>=0?"+":""}${p}</div>
            <div style="font-family:var(--serif);font-size:16px;font-style:italic;color:${x};margin-top:4px;">${l.zone||"—"}</div>
          </div>
        </div>
      </div>
      <div class="co-footer" style="margin-top:14px;">Radar de riesgos · actualización automática</div>
    `}return(g=document.getElementById("radar-refresh"))==null||g.addEventListener("click",()=>f(!0)),await f(!1),{destroy(){}}}export{re as render};
