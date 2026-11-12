import{g as tt}from"./macro-data-CGVdt8ED.js";const Le=t=>t!=null?Number(t).toFixed(1):"—",y=t=>t!=null?Number(t).toFixed(2):"—",nt=t=>t!=null?Number(t).toFixed(3):"—";function Ae(t,u="up-good"){if(t==null)return"var(--text3)";const w=u==="up-bad"?t>0:t<0;return Math.abs(t)<.001?"var(--text3)":w?"var(--red)":"var(--green)"}function we(t,u,w=!1){return`<span style="display:inline-block;padding:2px 7px;border-radius:3px;font-family:var(--mono);font-size:${w?"7px":"8px"};font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:${u}22;color:${u};border:1px solid ${u}44;">${t}</span>`}function Qe(t){return`<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${t==="ok"?"var(--green)":t==="warn"?"var(--amber)":t==="stale"?"var(--red)":"var(--text3)"};"></span>`}const at={normal:"var(--green)",vigilancia:"var(--teal)",tension:"var(--amber)",estres:"var(--red)",contango:"var(--green)","tension-creciente":"var(--teal)",backwardation:"var(--amber)","estres-severo":"var(--red)",alcista:"var(--green)",neutral:"var(--amber)",bajista:"var(--red)",restrictivo:"var(--red)","levemente-restrictivo":"var(--amber)",acomodaticio:"var(--green)"};function Ie(t){return at[t]||"var(--text3)"}const ot={normal:"NORMAL",vigilancia:"VIGILANCIA",tension:"TENSIÓN",estres:"ESTRÉS",contango:"CONTANGO","tension-creciente":"TENSIÓN ↑",backwardation:"BACKWRDTN","estres-severo":"ESTRÉS",alcista:"ALCISTA",neutral:"NEUTRAL",bajista:"BAJISTA",restrictivo:"RESTRICTIVO","levemente-restrictivo":"LEVE RESTR.",neutral_rate:"NEUTRAL",acomodaticio:"ACOMODATICIO"};function Ee(t){return ot[t]||(t||"—").toUpperCase()}const Ke=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];function lt(t,u){const w=new Date(t),A=String(w.getUTCFullYear()).slice(2),P=Ke[w.getUTCMonth()],I=w.getUTCDate();return u<=100?`${I} ${P}`:u<=400?`${I} ${P}`:u<=1200?`${P} ${A}`:String(w.getUTCFullYear())}function it(t,u,w){const A=u-t,P=A/864e5,I=[7,14,30,60,91,182,365,730,1825].map(i=>i*864e5);let V=I[I.length-1];for(const i of I)if(A/i<=w+2){V=i;break}const te=[],d=new Date(t);let e;if(V>=365*864e5)e=Date.UTC(d.getUTCFullYear(),0,1),e<t&&(e=Date.UTC(d.getUTCFullYear()+1,0,1));else if(V>=28*864e5){if(e=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1),e<t){const i=d.getUTCMonth()+1;e=Date.UTC(d.getUTCFullYear()+Math.floor(i/12),i%12,1)}}else{const i=d.getUTCDay(),v=i===0?1:(8-i)%7||7;e=t+v*864e5,e=Math.floor(e/(7*864e5))*(7*864e5),e<t&&(e+=7*864e5)}const D=V>=28*864e5?Math.round(V/(30.44*864e5)):0;let S=0;for(;e<=u&&S++<100;)if(e>=t&&te.push(e),D>0){const i=new Date(e),v=i.getUTCMonth()+D;e=Date.UTC(i.getUTCFullYear()+Math.floor(v/12),v%12,1)}else e+=V;return{ticks:te,spanDays:P}}function De(t,u,w={}){const{hLines:A=[],bands:P=[],xRange:I=null,padding:V={t:14,r:10,b:28,l:46},GAP_DAYS:te=10,unitMaxValue:d=50}=w,e=t.getContext("2d"),D=t.width,S=t.height,i=V,v=D-i.l-i.r,X=S-i.t-i.b,T=v<400?5:10;function ne(s=null){e.clearRect(0,0,D,S);const p=u.map(o=>{const f=o.dates||[],L=o.vals||[],F=[];for(let N=0;N<Math.min(f.length,L.length);N++){if(L[N]==null)continue;const fe=String(f[N]).slice(0,10),be=Number(L[N]);!isFinite(be)||isNaN(be)||d!=null&&be>d||F.push({d:fe,v:be,ms:new Date(fe).getTime()})}return F.sort((N,fe)=>N.ms-fe.ms),{...o,pts:F}});let c=-1/0,R=1/0;I!=null&&I.fromDate&&(c=new Date(I.fromDate).getTime()),I!=null&&I.toDate&&(R=new Date(I.toDate).getTime());const q=p.map(o=>({...o,pts:o.pts.filter(f=>f.ms>=c&&f.ms<=R)})),g=q.flatMap(o=>o.pts.map(f=>f.ms));if(g.length===0)return e.fillStyle="rgba(140,140,140,0.5)",e.font="10px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("INSUFFICIENT DATA",D/2,S/2),null;const ye=Math.min(...g),G=Math.max(...g),ce=G-ye||1,oe=q.flatMap(o=>o.pts.map(f=>f.v)),le=A.map(o=>o.y).filter(o=>isFinite(o)),Se=[...oe,...le];if(Se.length===0)return null;let ie=Math.min(...Se),se=Math.max(...Se);const xe=(se-ie||1)*.1;ie-=xe,se+=xe;const de=o=>i.l+(o-ye)/ce*v,pe=o=>i.t+X-(o-ie)/(se-ie)*X;P.forEach(o=>{const f=Math.max(i.t,pe(Math.min(o.yMax,se))),L=Math.min(i.t+X,pe(Math.max(o.yMin,ie)));L>f&&(e.fillStyle=o.color,e.fillRect(i.l,f,v,L-f))});const{ticks:W,spanDays:Z}=it(ye,G,T),j=[...new Set([ye,...W.filter(o=>o>ye&&o<G),G])],O=8;e.font=`${O}px monospace`;const Y=e.measureText("ene 26 ").width,he=[];for(let o=0;o<j.length;o++){const f=de(j[o]);if(o===0||o===j.length-1){he.push(j[o]);continue}const L=de(he[he.length-1]),F=de(j[j.length-1]);f-L>=Y*1.5&&F-f>=Y*1.5&&he.push(j[o])}e.setLineDash([]),he.forEach((o,f)=>{const L=de(o);e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=.5,e.beginPath(),e.moveTo(L,i.t),e.lineTo(L,i.t+X),e.stroke();const F=lt(o,Z);e.fillStyle="rgba(140,140,140,0.65)",e.font=`${O}px monospace`,e.textBaseline="top";const N=f===0?"left":f===he.length-1?"right":"center";e.textAlign=N,e.fillText(F,L,i.t+X+4)});const Oe=4;e.textAlign="right",e.textBaseline="middle",e.font=`${O}px monospace`;for(let o=0;o<=Oe;o++){const f=ie+(se-ie)*(o/Oe),L=pe(f);e.strokeStyle="rgba(255,255,255,0.05)",e.lineWidth=.5,e.setLineDash([]),e.beginPath(),e.moveTo(i.l,L),e.lineTo(D-i.r,L),e.stroke(),e.fillStyle="rgba(140,140,140,0.65)",e.fillText(f.toFixed(2),i.l-3,L)}A.forEach(o=>{if(!isFinite(o.y))return;const f=pe(o.y);e.save(),e.setLineDash(o.dash||[3,3]),e.strokeStyle=o.color||"rgba(255,255,255,0.3)",e.lineWidth=o.width||.8,e.beginPath(),e.moveTo(i.l,f),e.lineTo(D-i.r,f),e.stroke(),o.label&&(e.fillStyle=o.color||"rgba(255,255,255,0.4)",e.font="8px monospace",e.textAlign="left",e.textBaseline="bottom",e.fillText(o.label,i.l+3,f-1)),e.restore()});const Be=te*864e5;return q.forEach(o=>{const f=o.pts;if(f.length<2)return;e.save(),e.setLineDash(o.dash||[]),e.strokeStyle=o.color||"rgba(255,255,255,0.8)",e.lineWidth=o.width||1.5,e.lineJoin="round",e.lineCap="round",e.beginPath();let L=!1;const F=[];for(let N=0;N<f.length;N++){const{ms:fe,v:be}=f[N],Te=de(fe),ze=pe(be),Fe=N>0&&fe-f[N-1].ms>Be;!L||Fe?(e.moveTo(Te,ze),L=!0):e.lineTo(Te,ze),o.fill&&F.push({x:Te,y:ze})}e.stroke(),o.fill&&F.length>=2&&(e.globalAlpha=.07,e.fillStyle=o.color||"rgba(255,255,255,0.1)",e.beginPath(),e.moveTo(F[0].x,F[0].y),F.forEach(N=>e.lineTo(N.x,N.y)),e.lineTo(F[F.length-1].x,i.t+X),e.lineTo(F[0].x,i.t+X),e.closePath(),e.fill(),e.globalAlpha=1),e.restore()}),s!==null&&(e.save(),e.setLineDash([3,3]),e.strokeStyle="rgba(255,255,255,0.35)",e.lineWidth=.8,e.beginPath(),e.moveTo(s,i.t),e.lineTo(s,i.t+X),e.stroke(),e.restore()),{filtered:q,toX:de,toY:pe,xMin:ye,xMax:G,xSpan:ce,yMin:ie,yMax:se,spanDays:Z}}let r=ne(null);if(t._chartCleanup&&t._chartCleanup(),!r)return;let $=t._tooltip;if(!$){$=document.createElement("div"),$.style.cssText=["position:absolute;pointer-events:none;z-index:200","background:rgba(18,22,30,0.93)","border:1px solid rgba(255,255,255,0.13)","border-radius:5px","padding:5px 9px","font-family:monospace","font-size:10px","color:#d4d4d8","white-space:nowrap","display:none","box-shadow:0 2px 8px rgba(0,0,0,0.5)"].join(";");const s=t.parentElement;s&&(getComputedStyle(s).position==="static"&&(s.style.position="relative"),s.appendChild($)),t._tooltip=$}function ae(s){const p=t.getBoundingClientRect(),c=D/p.width,R=(s.clientX-p.left)*c;if(R<i.l||R>i.l+v){$.style.display="none",ne(null);return}ne(R);const{xMin:q,xMax:g,xSpan:ye,filtered:G,spanDays:ce}=r||{};if(!G)return;const oe=q+(R-i.l)/v*ye,le=new Date(oe);le.toISOString().slice(0,10);const Se=`${le.getUTCDate()} ${Ke[le.getUTCMonth()]} ${le.getUTCFullYear()}`,ie=G.map(W=>{if(!W.pts.length||!W.label)return null;let Z=null,j=null;for(const Y of W.pts)Y.ms<=oe?Z=Y:j===null&&(j=Y);let O=null;if(Z&&j){const Y=(oe-Z.ms)/(j.ms-Z.ms);O=Z.v+Y*(j.v-Z.v)}else Z?O=Z.v:j&&(O=j.v);return O===null?null:`<span style="color:${W.color||"#fff"}">${W.label}</span> <b>${O.toFixed(2)}</b>`}).filter(Boolean);$.innerHTML=`<div style="color:rgba(180,180,180,0.7);margin-bottom:3px;font-size:9px;">${Se}</div>${ie.join("<br>")}`,$.style.display="block";const se=$.offsetWidth||120,Re=$.offsetHeight||60,xe=s.clientX-p.left,de=s.clientY-p.top,pe=xe+se+14>p.width;$.style.left=`${pe?xe-se-8:xe+10}px`,$.style.top=`${Math.max(0,de-Re/2)}px`}function n(){$.style.display="none",ne(null)}t.addEventListener("mousemove",ae),t.addEventListener("mouseleave",n),t._chartCleanup=()=>{t.removeEventListener("mousemove",ae),t.removeEventListener("mouseleave",n),t._tooltip&&(t._tooltip.remove(),t._tooltip=null)}}function _e(t,u,w="var(--teal)"){if(!t||!u||u.length<2)return;const A=t.getContext("2d"),P=t.width,I=t.height,V=u.filter(v=>v!=null);if(V.length<2)return;const te=Math.min(...V),d=Math.max(...V),e=v=>v/(u.length-1)*P,D=v=>I-(v-te)/(d-te||1)*I*.85-I*.07;A.clearRect(0,0,P,I);const S=w.startsWith("var(")?"#40d9c0":w;A.strokeStyle=S,A.lineWidth=1.5,A.lineJoin="round",A.beginPath();let i=!1;u.forEach((v,X)=>{if(v==null)return;const T=e(X),ne=D(v);i?A.lineTo(T,ne):(A.moveTo(T,ne),i=!0)}),A.stroke()}function st(t){var r,$,ae,n,s,p,c;const u=t.coyuntura||{},w=t.liquidez||{},A=t.seguimiento||{},P=t.condicionesFinancieras||{},I=t.mercado||{},V=t.scoreTotal??0,te=(t.alerts||[]).filter(R=>R.severity==="error"||R.severity==="warn"),d=w.hyOas||{},e=P.dxy||{},D=P.dfii10||{},S=I.sp500Trend||{},i=I.vix||{},v=I.vixTermRatio||{},X=P.t10y2y||A.t10y2y||{},T=(R,q,g="")=>q!=null?`- ${R}: ${typeof q=="number"?(q>=0?"+":"")+y(q):q}${g}`:null;return`Eres ETHAN, sistema de análisis macroeconómico profesional. Datos actuales:

${[`SCORE MACRO: ${V>=0?"+":""}${V} / +15 → ${t.zone||"—"}`,"","## CRÉDITO",T("HY OAS",d.value,"%"),d.hyState?`  → ${d.hyState} (pct ${d.percentile}% Z3y ${d.zscore3y??"—"})`:null,T("Chg 1D",d.chg1d,"pp"),T("Chg 5D",d.chg5d,"pp"),"","## VOLATILIDAD",i.value!=null?`- VIX: ${Le(i.value)}  MM200: ${Le(i.mm200)}  ${i.aboveMM200?"sobre MM200 ⚠":"bajo MM200 ✓"}`:null,v.ratio!=null?`- Ratio VIX/VIX3M: ${y(v.ratio)} → ${v.state}`:null,"","## SP500 TENDENCIA",S.monthly?`- Mensual: ${S.monthly.state}  M10: ${y(S.monthly.m10)}  slope: ${S.monthly.slope}`:null,S.weekly?`- Semanal: ${S.weekly.state}   M10: ${y(S.weekly.m10)}   slope: ${S.weekly.slope}`:null,S.daily?`- Diario:  ${S.daily.state}    M10: ${y(S.daily.m10)}    slope: ${S.daily.slope}`:null,S.summary?`- Resumen: ${S.summary}`:null,"","## CONDICIONES FINANCIERAS",T("DXY",e.value),e.percentile!=null?`  → pct ${e.percentile}%`:null,T("Curva 10Y−2Y",X.value,"%"),T("DFII10 Real Yield",D.value,"%"),D.regime?`  → ${D.regime} (pct ${D.percentile}%)`:null,T("FFR",(r=A.ffr)==null?void 0:r.value,"%"),T("Tipo real ex post",($=u.tipoReal)==null?void 0:$.value,"%"),T("CPI Headline",(ae=u.cpi)==null?void 0:ae.value,"%"),T("CPI Core",(n=u.cpi)==null?void 0:n.cpiCore,"%"),"","## LIQUIDEZ",T("M2 Global YoY",(s=w.m2)==null?void 0:s.value,"%"),T("Crédito vs GDP",(p=w.credito)==null?void 0:p.value,"%"),T("Impulso crediticio",(c=w.impulso)==null?void 0:c.value),"","## ALERTAS",te.length?te.map(R=>`- [${R.severity}] ${R.label}: ${R.triggers.join(" / ")}`).join(`
`):"- Sin alertas"].filter(R=>R!=null).join(`
`)}

Genera un análisis ejecutivo en ESPAÑOL, exactamente 5 párrafos:
1. RÉGIMEN MACRO: ciclo actual, qué lo confirma
2. CRÉDITO Y VOLATILIDAD: tensión sistémica, HY OAS, VIX ratio
3. CONDICIONES MONETARIAS: tipo real TIPS, DXY, implicaciones
4. LIQUIDEZ Y MOMENTUM: M2, crédito, impulso
5. CONCLUSIÓN: 2-3 frases concretas de posicionamiento esta semana

Formato:
- Sin #, ##, ---, bullets
- Párrafos empiezan con TÍTULO EN MAYÚSCULAS seguido del texto
- **negrita** para conceptos clave
- Tono técnico directo, sin rodeos
- No repetir los números — interprétalos`}async function rt(t){const u=await fetch("/api/macro-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t})});if(!u.ok){const A=await u.json().catch(()=>({}));throw new Error(A.error||`HTTP ${u.status}`)}return(await u.json()).text||""}async function dt(t,{actionsSlot:u}){var V,te;u.innerHTML=`
    <button class="btn" id="home-ai-btn">✦ Análisis IA</button>
    <button class="btn btn-primary" id="home-refresh">↻ Actualizar</button>
  `,t.innerHTML='<div id="home-wrap"><div class="empty"><div class="loader-ring"></div><div class="empty-title">Cargando...</div></div></div>';let w=null;async function A(d=!1){try{const e=await tt(d);w=e,I(e)}catch(e){document.getElementById("home-wrap").innerHTML=`<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Error</div><div class="empty-desc">${e.message}</div></div>`}}async function P(){if(!w)return;const d=document.getElementById("home-ai-btn"),e=document.getElementById("home-ai-box");if(e){d.disabled=!0,d.textContent="✦ Generando...",e.innerHTML='<div style="display:flex;align-items:center;gap:10px;"><div class="loader-ring"></div><span style="font-size:11px;color:var(--text3);font-family:var(--mono);">Analizando...</span></div>';try{const S=(await rt(st(w))).replace(/^#{1,3}\s.*$/gm,"").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").trim().split(/\n\n+/).filter(v=>v.trim()).map(v=>`<p style="margin-bottom:10px;line-height:1.7;">${v.trim()}</p>`).join(""),i=w.scoreTotal;e.innerHTML=`
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--teal);margin-bottom:8px;">✦ ETHAN IA · ${new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})} · Score ${i>=0?"+":""}${i}/+15</div>
        <div style="font-size:12px;color:var(--text2);">${S}</div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);font-size:9px;color:var(--text3);font-family:var(--mono);">Generado con Claude · No constituye asesoramiento financiero</div>`}catch(D){e.innerHTML=`<div style="font-size:11px;color:var(--red);">⚠ ${D.message}</div>`}finally{d.disabled=!1,d.textContent="✦ Análisis IA"}}}function I(d){var Oe,Be,o,f,L,F,N,fe,be,Te,ze,Fe,Pe,je,He,Ue,Xe;const e=document.getElementById("home-wrap"),D=d.scoreTotal??0,S=d.zone||"—",i=d.coyuntura||{},v=d.liquidez||{},X=d.seguimiento||{},T=d.condicionesFinancieras||{},ne=d.mercado||{},r=ne.vix||null,$=ne.vix3m||null,ae=ne.vixTermRatio||null,n=v.hyOas||null,s=ne.sp500Trend||null,p=T.dxy||null,c=T.dfii10||null,R=T.t10y||null,q=T.t2y||null,g=T.t10y2y||X.t10y2y||null,G=(d.alerts||[]).filter(l=>l.severity==="error"||l.severity==="warn");let ce=0,oe=0;(n==null?void 0:n.chg5d)!=null&&(n.chg5d>.05?oe++:n.chg5d<-.05&&ce++),(r==null?void 0:r.chg5d)!=null&&(r.chg5d>.5?oe++:r.chg5d<-.5&&ce++),(p==null?void 0:p.chg5d)!=null&&(p.chg5d>.3?oe++:p.chg5d<-.3&&ce++),(c==null?void 0:c.chg5d)!=null&&(c.chg5d>.05?oe++:c.chg5d<-.05&&ce++),((Oe=s==null?void 0:s.daily)==null?void 0:Oe.state)==="alcista"?ce++:((Be=s==null?void 0:s.daily)==null?void 0:Be.state)==="bajista"&&oe++;const le=oe>ce+1?"DETERIORO":ce>oe+1?"MEJORA":"ESTABLE",Se=le==="DETERIORO"?"↘":le==="MEJORA"?"↗":"→",ie=le==="DETERIORO"?"var(--red)":le==="MEJORA"?"var(--green)":"var(--teal)",se=(n==null?void 0:n.hyState)||"normal",Re=r!=null&&r.aboveMM200?"tension":"normal",xe={normal:0,vigilancia:1,tension:2,estres:3},de=xe[se]>=xe[Re]?se:Re,pe=Ie(de),W=[];n!=null&&n.hyState&&n.hyState!=="normal"?W.push(`Crédito HY en ${Ee(n.hyState).toLowerCase()}`):(n==null?void 0:n.value)!=null&&W.push(`Crédito HY normalizado (${y(n.value)}%)`),r!=null&&r.aboveMM200&&W.push("VIX sobre MM200"),(o=s==null?void 0:s.monthly)!=null&&o.state&&W.push(`Tendencia mensual ${s.monthly.state}`),(f=s==null?void 0:s.daily)!=null&&f.state&&((L=s==null?void 0:s.daily)==null?void 0:L.state)!==((F=s==null?void 0:s.monthly)==null?void 0:F.state)&&W.push(`diaria ${s.daily.state}`),((N=v.m2)==null?void 0:N.score)>0&&W.push("liquidez global expansiva");const Z=W.length?W.join(", ")+".":"Cargando diagnóstico…",j=Z.charAt(0).toUpperCase()+Z.slice(1),O=[],Y=[];if((n==null?void 0:n.chg5d)!=null&&Math.abs(n.chg5d)>=.05){const l={label:"HY OAS",val:n.chg5d,unit:"pp",horizon:"5D",direction:"up-bad"};n.chg5d>0?Y.push(l):O.push(l)}if((r==null?void 0:r.chg5d)!=null&&Math.abs(r.chg5d)>=.3){const l={label:"VIX",val:r.chg5d,unit:"",horizon:"5D",direction:"up-bad"};r.chg5d>0?Y.push(l):O.push(l)}if((r==null?void 0:r.aboveMM200)===!0&&Y.push({label:"VIX",val:null,unit:"",horizon:"actual",note:"sobre MM200",direction:"up-bad"}),(r==null?void 0:r.aboveMM200)===!1&&O.push({label:"VIX",val:null,unit:"",horizon:"actual",note:"bajo MM200",direction:"up-bad"}),(c==null?void 0:c.chg5d)!=null&&Math.abs(c.chg5d)>=.05){const l={label:"DFII10 Real Yield",val:c.chg5d,unit:"pp",horizon:"5D",direction:"up-bad"};c.chg5d>0?Y.push(l):O.push(l)}if((p==null?void 0:p.chg5d)!=null&&Math.abs(p.chg5d)>=.3){const l={label:"DXY",val:p.chg5d,unit:"",horizon:"5D",direction:"up-bad"};p.chg5d>0?Y.push(l):O.push(l)}(g==null?void 0:g.value)!=null&&(g.value<0?Y.push({label:"Curva 10Y−2Y",val:null,note:`invertida (${y(g.value)}%)`,horizon:"actual",direction:"up-good"}):O.push({label:"Curva 10Y−2Y",val:null,note:`positiva (+${y(g.value)}%)`,horizon:"actual",direction:"up-good"})),((fe=s==null?void 0:s.daily)==null?void 0:fe.state)==="bajista"&&Y.push({label:"SP500 diario",val:null,note:"tendencia bajista",horizon:"actual",direction:"up-good"}),((be=s==null?void 0:s.daily)==null?void 0:be.state)==="alcista"&&O.push({label:"SP500 diario",val:null,note:"tendencia alcista",horizon:"actual",direction:"up-good"}),((Te=v.m2)==null?void 0:Te.score)>0&&O.push({label:"M2 Global",val:v.m2.value,unit:"% YoY",horizon:"actual",direction:"up-good"}),((ze=v.m2)==null?void 0:ze.score)<0&&Y.push({label:"M2 Global",val:v.m2.value,unit:"% YoY",horizon:"actual",direction:"up-good"});function he(l){const h=l.direction==="up-bad"?l.val>0?"var(--red)":"var(--green)":l.val>0?"var(--green)":"var(--red)",Me=l.val!=null?l.val>0?"↑":"↓":(l.direction==="up-bad",""),J=l.val!=null?`${l.val>0?"+":""}${y(l.val)}${l.unit}`:"",$e=l.note||"";return`<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border);">
        <span style="font-family:var(--mono);font-size:12px;color:${l.val==null?"var(--text3)":h};">${Me}</span>
        <span style="font-size:10px;color:var(--text2);flex:1;">${l.label}</span>
        <span style="font-family:var(--mono);font-size:10px;font-weight:600;color:${h};">${J||$e}</span>
        <span style="font-family:var(--mono);font-size:8px;color:var(--text3);">${l.horizon}</span>
      </div>`}e.innerHTML=`

      <!-- ══ 1. CABECERA EJECUTIVA ══ -->
      <div style="display:flex;align-items:center;gap:0;margin-bottom:${G.length?"8":"14"}px;padding:12px 16px;background:var(--surface1);border:1px solid var(--border);border-radius:10px;flex-wrap:wrap;gap:10px;">

        <!-- Régimen + score -->
        <div style="display:flex;align-items:baseline;gap:10px;">
          <div style="font-family:var(--mono);font-size:13px;font-weight:800;letter-spacing:0.06em;color:var(--text1);">${S.toUpperCase()}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text3);">${D>=0?"+":""}${D}/+15</div>
        </div>

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Dirección -->
        <div style="font-family:var(--mono);font-size:11px;font-weight:700;color:${ie};">${Se} ${le} SEMANAL</div>

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Nivel general -->
        ${we(Ee(de),pe)}

        <div style="width:1px;height:16px;background:var(--border);"></div>

        <!-- Alertas -->
        ${G.length?`<span style="font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red);">⬤ ${G.length} ALERTA${G.length>1?"S":""}</span>`:'<span style="font-family:var(--mono);font-size:10px;color:var(--green);">✓ SIN ALERTAS</span>'}

        <!-- Spacer -->
        <div style="flex:1;"></div>

        <!-- Timestamp -->
        <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">
          ${d.updatedAt?new Date(d.updatedAt).toLocaleString("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"—"}
        </div>
      </div>

      <!-- Frase ejecutiva -->
      <div style="margin-bottom:${G.length?"8":"14"}px;padding:10px 16px;background:var(--surface1);border-left:3px solid ${pe};border-radius:0 6px 6px 0;font-size:12px;color:var(--text2);line-height:1.6;">${j}</div>

      <!-- ══ 2. ALERTAS (si existen) ══ -->
      ${G.length?`
      <div style="margin-bottom:14px;display:flex;flex-direction:column;gap:6px;">
        ${G.map(l=>{const h=l.severity==="error"?"var(--red)":l.severity==="warn"?"var(--amber)":"var(--teal)";return`<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;border-radius:8px;border:1px solid ${h}44;background:${h}0a;">
            <div style="flex-shrink:0;margin-top:1px;">${we(l.severity==="error"?"ESTRÉS":"VIGILANCIA",h)}</div>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:700;color:var(--text1);margin-bottom:3px;">${l.label}</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);">${l.triggers.join(" · ")}</div>
            </div>
            ${l.date?`<div style="font-family:var(--mono);font-size:8px;color:var(--text3);flex-shrink:0;">${l.date}</div>`:""}
          </div>`}).join("")}
      </div>`:""}

      <!-- ══ 3. GRÁFICOS APILADOS ══ -->
      <style>
        .chart-canvas-main { width:100%; height:clamp(320px,50vw,480px); display:block; border-radius:4px; background:var(--surface2); }
        @media(min-width:768px){ .chart-canvas-main { height:460px; } }
      </style>

      <!-- ─ A. HIGH YIELD OAS ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera compacta -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">HIGH YIELD OAS</div>
          <span style="font-size:20px;font-weight:800;color:${n?Ie(n.hyState):"var(--text3)"};">${n?y(n.value):"—"}<span style="font-size:10px;color:var(--text3);margin-left:2px;">%</span></span>
          <div style="display:flex;gap:8px;">
            ${n?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(n.chg1d,"up-bad")};">${n.chg1d!=null?(n.chg1d>0?"+":"")+y(n.chg1d):"—"}pp <span style="color:var(--text3);">1D</span></span>`:""}
            ${n?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(n.chg5d,"up-bad")};">${n.chg5d!=null?(n.chg5d>0?"+":"")+y(n.chg5d):"—"}pp <span style="color:var(--text3);">5D</span></span>`:""}
            ${n?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(n.chg20d,"up-bad")};">${n.chg20d!=null?(n.chg20d>0?"+":"")+y(n.chg20d):"—"}pp <span style="color:var(--text3);">20D</span></span>`:""}
          </div>
          ${n?we(Ee(n.hyState),Ie(n.hyState)):""}
          ${n?`${Qe(n.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${n.ageDays}d</span>`:""}
          <div style="flex:1;"></div>
          <!-- Selector rango -->
          <div style="display:flex;gap:4px;" id="hy-range-btns">
            ${["3M","1A","3A","Máx"].map((l,h)=>`<button data-range="${l}" style="font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;border:1px solid var(--border);background:${h===1?"var(--teal)":"transparent"};color:${h===1?"#000":"var(--text3)"};font-weight:${h===1?"700":"400"};cursor:pointer;">${l}</button>`).join("")}
          </div>
        </div>
        <!-- Máx disponible label -->
        <div id="hy-max-label" style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:6px;display:none;"></div>
        <!-- Canvas principal -->
        <canvas id="hy-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda toggleable -->
        <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-hy" checked style="accent-color:var(--teal);"><div style="width:14px;height:2px;background:var(--teal);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">HY OAS</span></label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-mm100" checked style="accent-color:var(--amber);"><div style="width:14px;height:1px;border-top:1px dashed var(--amber);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span></label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="hy-tog-mm200" checked style="accent-color:rgba(255,255,255,0.4);"><div style="width:14px;height:1px;border-top:1px dashed rgba(255,255,255,0.4);"></div><span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span></label>
          <button id="hy-detail-btn" style="margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--teal);background:none;border:none;cursor:pointer;padding:0;">▾ Ver detalle</button>
        </div>
        <!-- Detalle oculto -->
        <div id="hy-detail" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
            ${n?[["Percentil",n.percentile!=null?n.percentile+"%":"—"],["Z-score 3Y",n.zscore3y!=null?y(n.zscore3y):"—"],["MM100",y(n.mm100)],["MM200",y(n.mm200)],["Obs.",n.nObs||"—"],["Desde",n.dateFrom||"—"],["Chg 20D",n.chg20d!=null?(n.chg20d>0?"+":"")+y(n.chg20d)+"pp":"—"],["Fecha",n.date||"—"]].map(([l,h])=>`<div style="font-size:9px;"><span style="color:var(--text3);font-family:var(--mono);">${l}: </span><span style="color:var(--text1);">${h}</span></div>`).join(""):""}
          </div>
        </div>
      </div>

      <!-- ─ B. VOLATILIDAD VIX ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera compacta -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">VOLATILIDAD · VIX</div>
          <div style="display:flex;align-items:baseline;gap:10px;">
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX </span>
              <span style="font-size:20px;font-weight:800;color:${r!=null&&r.aboveMM200?"var(--red)":"var(--green)"};">${r?Le(r.value):"—"}</span>
              ${r?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(r.chg1d,"up-bad")};margin-left:4px;">${r.chg1d!=null?(r.chg1d>0?"+":"")+y(r.chg1d):""} <span style="color:var(--text3);">1D</span></span>`:""}
            </div>
            <div style="width:1px;height:16px;background:var(--border);"></div>
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M </span>
              <span style="font-size:20px;font-weight:800;color:var(--text2);">${$?Le($.value):"—"}</span>
              ${$?`<span style="font-family:var(--mono);font-size:9px;color:${Ae($.chg1d,"up-bad")};margin-left:4px;">${$.chg1d!=null?($.chg1d>0?"+":"")+y($.chg1d):""} <span style="color:var(--text3);">1D</span></span>`:""}
            </div>
            <div style="width:1px;height:16px;background:var(--border);"></div>
            <div>
              <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">RATIO </span>
              <span style="font-family:var(--mono);font-size:16px;font-weight:700;color:${ae?Ie(ae.state):"var(--text3)"};">${ae?nt(ae.ratio):"—"}</span>
              ${ae?`<span style="margin-left:5px;">${we(Ee(ae.state),Ie(ae.state),!0)}</span>`:""}
            </div>
          </div>
          ${r?we(r.aboveMM200?"SOBRE MM200":"BAJO MM200",r.aboveMM200?"var(--red)":"var(--green)"):""}
          ${r?`${Qe(r.freshness)}<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:3px;">${r.ageDays}d</span>`:""}
          <div style="flex:1;"></div>
          <!-- Selector rango VIX -->
          <div style="display:flex;gap:4px;" id="vix-range-btns">
            ${["3M","1A","3A","Máx"].map((l,h)=>`<button data-range="${l}" style="font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;border:1px solid var(--border);background:${h===1?"#f47174":"transparent"};color:${h===1?"#000":"var(--text3)"};font-weight:${h===1?"700":"400"};cursor:pointer;">${l}</button>`).join("")}
          </div>
        </div>
        <!-- Canvas VIX -->
        <canvas id="vix-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda VIX con toggles -->
        <div style="display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="vix-tog-vix" checked style="accent-color:#e2e8f0;">
            <div style="width:14px;height:2px;background:#e2e8f0;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX</span>
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="vix-tog-vix3m" checked style="accent-color:#f97316;">
            <div style="width:14px;height:1px;border-top:2px dashed #f97316;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">VIX3M</span>
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="vix-tog-mm100" checked style="accent-color:#60a5fa;">
            <div style="width:14px;height:1px;border-top:2px dashed #60a5fa;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span>
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="vix-tog-mm200" checked style="accent-color:#a78bfa;">
            <div style="width:14px;height:1px;border-top:2px dashed #a78bfa;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span>
          </label>
        </div>
      </div>

      <!-- ─ C. S&P 500 TENDENCIA ─ -->
      <div class="mac-card" style="padding:14px 16px;margin-bottom:14px;">
        <!-- Cabecera dinámica (se actualiza vía JS) -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
          <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);min-width:90px;">S&amp;P 500 · M10</div>
          <div id="sp-header-metrics" style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;">
            <!-- rellenado por JS -->
          </div>
          <div style="flex:1;"></div>
          <!-- Semáforos compactos -->
          <div style="display:flex;gap:6px;">
            ${["monthly","weekly","daily"].map((l,h)=>{const Me=["M","S","D"][h],J=s==null?void 0:s[l],$e=Ie(J==null?void 0:J.state);return`<div style="text-align:center;padding:3px 7px;border-radius:4px;background:${$e}18;border:1px solid ${$e}44;">
                <div style="font-family:var(--mono);font-size:7px;color:var(--text3);">${Me}</div>
                <div style="font-family:var(--mono);font-size:8px;font-weight:700;color:${$e};">${J?Ee(J.state).slice(0,3):"—"}</div>
              </div>`}).join("")}
          </div>
        </div>
        <!-- Tabs timeframe SP500 -->
        <div style="display:flex;gap:0;margin-bottom:10px;border-bottom:1px solid var(--border);">
          ${["monthly","weekly","daily"].map((l,h)=>{const Me=["Mensual","Semanal","Diario"][h],J=l==="daily";return`<button class="sp-tf-tab" data-tf="${l}" style="font-family:var(--mono);font-size:9px;padding:5px 14px;background:${J?"var(--surface2)":"transparent"};color:${J?"var(--text1)":"var(--text3)"};border:none;border-bottom:${J?"2px solid var(--teal)":"2px solid transparent"};cursor:pointer;margin-bottom:-1px;">${Me}</button>`}).join("")}
        </div>
        <!-- Canvas SP500 (único, redibujado al cambiar tab) -->
        <canvas id="sp-main-chart" width="900" height="460" class="chart-canvas-main"></canvas>
        <!-- Leyenda SP500 con toggles (MM100/MM200 solo visibles en Diario) -->
        <div id="sp-legend" style="display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-price" checked style="accent-color:#22d3ee;">
            <div style="width:14px;height:2px;background:#22d3ee;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">Precio</span>
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-m10" checked style="accent-color:#fbbf24;">
            <div style="width:14px;height:1px;border-top:2px dashed #fbbf24;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">M10</span>
          </label>
          <label id="sp-tog-mm100-wrap" style="display:none;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-mm100" checked style="accent-color:#60a5fa;">
            <div style="width:14px;height:1px;border-top:2px solid #60a5fa;"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM100</span>
          </label>
          <label id="sp-tog-mm200-wrap" style="display:none;align-items:center;gap:5px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="sp-tog-mm200" checked style="accent-color:rgba(200,200,210,0.7);">
            <div style="width:14px;height:1px;border-top:2px dashed rgba(200,200,210,0.7);"></div>
            <span style="font-size:8px;color:var(--text3);font-family:var(--mono);">MM200</span>
          </label>
        </div>
        ${s!=null&&s.summary?`<div style="margin-top:8px;font-size:9px;color:var(--text2);line-height:1.5;font-style:italic;">${s.summary}</div>`:""}
      </div>

      <!-- ══ 4. BANDA CONDICIONES FINANCIERAS ══ -->
      <div class="mac-card" style="padding:12px 16px;margin-bottom:14px;">
        <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">Condiciones Financieras</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">

          <!-- DXY -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">DXY — Dólar</div>
            <div style="font-size:18px;font-weight:700;color:var(--text1);margin-bottom:1px;">${p?y(p.value):"—"}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${p?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(p.chg5d,"up-bad")};">${p.chg5d!=null?(p.chg5d>0?"+":"")+y(p.chg5d):""} <span style="color:var(--text3);">5D</span></span>`:""}
              ${(p==null?void 0:p.percentile)!=null?`<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">p${p.percentile}</span>`:""}
            </div>
            <canvas id="sp-dxy-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- Curva -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Curva 10Y−2Y</div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:1px;">
              <span style="font-size:18px;font-weight:700;color:${(g==null?void 0:g.value)!=null?g.value>=0?"var(--green)":"var(--red)":"var(--text3)"};">${(g==null?void 0:g.value)!=null?(g.value>=0?"+":"")+y(g.value)+"%":"—"}</span>
              ${(g==null?void 0:g.value)!=null?we(g.value>=0?"POSITIVA":"INVERTIDA",g.value>=0?"var(--green)":"var(--red)",!0):""}
            </div>
            <div style="display:flex;gap:6px;margin-bottom:4px;">
              ${R?`<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">10Y: <span style="color:var(--text1);">${y(R.value)}%</span></span>`:""}
              ${q?`<span style="font-family:var(--mono);font-size:8px;color:var(--text3);">2Y: <span style="color:var(--text1);">${y(q.value)}%</span></span>`:""}
            </div>
            <canvas id="sp-cv-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- DFII10 -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Tipo Real 10Y · DFII10</div>
            <div style="font-size:18px;font-weight:700;color:${c?c.value>0?"var(--red)":"var(--green)":"var(--text3)"};margin-bottom:1px;">${c?y(c.value)+"%":"—"}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${c?`<span style="font-family:var(--mono);font-size:9px;color:${Ae(c.chg5d,"up-bad")};">${c.chg5d!=null?(c.chg5d>0?"+":"")+y(c.chg5d)+"pp":""} <span style="color:var(--text3);">5D</span></span>`:""}
              ${c!=null&&c.regime?we(Ee(c.regime),Ie(c.regime),!0):""}
            </div>
            <canvas id="sp-df-spark" width="80" height="28" style="width:100%;height:28px;display:block;"></canvas>
          </div>

          <!-- Pol Monetaria -->
          <div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:3px;">Pol. Monetaria</div>
            <div style="font-size:18px;font-weight:700;color:var(--text1);margin-bottom:1px;">${((Fe=X.ffr)==null?void 0:Fe.value)!=null?y(X.ffr.value)+"%":"—"} <span style="font-size:10px;color:var(--text3);">FFR</span></div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              ${((Pe=i.tipoReal)==null?void 0:Pe.value)!=null?`<span style="font-family:var(--mono);font-size:9px;color:var(--text3);">Real ex post: <span style="color:${i.tipoReal.value>0?"var(--red)":"var(--green)"};">${y(i.tipoReal.value)}%</span></span>`:""}
            </div>
            <div style="font-family:var(--mono);font-size:8px;color:var(--text3);">
              ${((je=i.cpi)==null?void 0:je.value)!=null?`CPI: ${Le(i.cpi.value)}%`:""}
              ${((He=i.cpi)==null?void 0:He.cpiCore)!=null?` · Core: ${Le(i.cpi.cpiCore)}%`:""}
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 5. QUÉ CAMBIÓ ══ -->
      ${O.length||Y.length?`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <div class="mac-card" style="padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:14px;color:var(--green);">↑</span>
            <span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--green);">Mejora</span>
          </div>
          ${O.length?O.map(he).join(""):'<div style="font-size:10px;color:var(--text3);">Sin mejoras materiales esta semana.</div>'}
        </div>
        <div class="mac-card" style="padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:14px;color:var(--red);">↓</span>
            <span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);">Deterioro</span>
          </div>
          ${Y.length?Y.map(he).join(""):'<div style="font-size:10px;color:var(--text3);">Sin deterioros materiales esta semana.</div>'}
        </div>
      </div>`:""}

      <!-- ══ 6. ANÁLISIS IA ══ -->
      <div class="mac-card" style="border-color:rgba(64,217,192,0.25);margin-bottom:14px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <div style="font-family:var(--mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--teal);">✦ Análisis ETHAN IA</div>
            <div style="font-size:10px;color:var(--text3);margin-top:2px;">Interpretación automática · ETHAN v5c</div>
          </div>
          <button id="home-ai-btn-inner" class="btn btn-primary" style="white-space:nowrap;font-size:11px;">✦ Generar análisis</button>
        </div>
        <div id="home-ai-box" style="min-height:44px;display:flex;align-items:center;">
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono);">Pulsa "Generar análisis" para obtener la interpretación IA.</div>
        </div>
      </div>
    `,requestAnimationFrame(()=>{function l(x){if(!Array.isArray(x)||x.length===0)return{dates:[],vals:[]};const z=x.filter(m=>m&&typeof m.date=="string"&&isFinite(Number(m.v))).map(m=>({date:m.date.slice(0,10),v:Number(m.v)})).sort((m,C)=>m.date<C.date?-1:1);return{dates:z.map(m=>m.date),vals:z.map(m=>m.v)}}function h(x,z){return x.map((m,C)=>{if(C<z-1)return null;const _=x.slice(C-z+1,C+1);return _.some(a=>a==null||!isFinite(a))?null:_.reduce((a,b)=>a+b,0)/z})}function Me(x){const z=new Date,C={"3M":90,"1A":365,"3A":365*3}[x];return C?new Date(z.getTime()-C*864e5).toISOString().slice(0,10):null}const J=document.getElementById("hy-chart");if(J&&n){let a=function(){document.querySelectorAll("#hy-range-btns button").forEach(ee=>{const Ce=ee.dataset.range===z;ee.style.background=Ce?"var(--teal)":"transparent",ee.style.color=Ce?"#000":"var(--text3)",ee.style.fontWeight=Ce?"700":"400"});const H=n.history||[],{dates:k,vals:U}=l(H);if(k.length<5){De(J,[],{bands:x});return}const me=U[U.length-1],re=me!=null&&me>20?.01:1,Q=U.map(ee=>ee*re),ve=h(Q,100),ue=h(Q,200),K=document.getElementById("hy-max-label");K&&(z==="Máx"&&k.length>0?(K.textContent=`Máximo disponible: ${k[0]} — ${k[k.length-1]}`,K.style.display="block"):K.style.display="none");const ge=Me(z),ke=ge?{fromDate:ge,toDate:k[k.length-1]}:null,E=[];m&&E.push({dates:k,vals:Q,color:"#40d9c0",width:2,fill:!0,label:"HY OAS"}),C&&E.push({dates:k,vals:ve,color:"#fbbf24",width:1,dash:[4,3],label:"MM100"}),_&&E.push({dates:k,vals:ue,color:"rgba(255,255,255,0.35)",width:1,dash:[2,4],label:"MM200"}),De(J,E,{bands:x,xRange:ke,GAP_DAYS:10,unitMaxValue:null})};const x=[{yMin:6,yMax:25,color:"rgba(244,113,116,0.07)"},{yMin:4.5,yMax:6,color:"rgba(251,191,36,0.06)"},{yMin:3.5,yMax:4.5,color:"rgba(64,217,192,0.05)"},{yMin:0,yMax:3.5,color:"rgba(74,222,128,0.04)"}];let z="1A",m=!0,C=!0,_=!0;a(),document.querySelectorAll("#hy-range-btns button").forEach(H=>{H.addEventListener("click",()=>{z=H.dataset.range,a()})});const b=document.getElementById("hy-tog-hy"),B=document.getElementById("hy-tog-mm100"),M=document.getElementById("hy-tog-mm200");b&&b.addEventListener("change",()=>{m=b.checked,a()}),B&&B.addEventListener("change",()=>{C=B.checked,a()}),M&&M.addEventListener("change",()=>{_=M.checked,a()})}const $e=document.getElementById("vix-chart");if($e&&r){let z=function(){var me,re,Q,ve;document.querySelectorAll("#vix-range-btns button").forEach(ue=>{const K=ue.dataset.range===x;ue.style.background=K?"#e2e8f0":"transparent",ue.style.color=K?"#000":"var(--text3)",ue.style.fontWeight=K?"700":"400"});const{dates:m,vals:C}=l(r.history||[]),{dates:_,vals:a}=l(($==null?void 0:$.history)||[]);if(m.length<5){De($e,[],{});return}const b=h(C,100),B=h(C,200),M=Me(x),H=M?{fromDate:M,toDate:m[m.length-1]}:null,k={vix:((me=document.getElementById("vix-tog-vix"))==null?void 0:me.checked)??!0,vix3m:((re=document.getElementById("vix-tog-vix3m"))==null?void 0:re.checked)??!0,mm100:((Q=document.getElementById("vix-tog-mm100"))==null?void 0:Q.checked)??!0,mm200:((ve=document.getElementById("vix-tog-mm200"))==null?void 0:ve.checked)??!0},U=[];k.vix&&U.push({dates:m,vals:C,color:"#e2e8f0",width:2,label:"VIX"}),k.vix3m&&U.push({dates:_,vals:a,color:"#f97316",width:1.5,dash:[4,3],label:"VIX3M"}),k.mm100&&U.push({dates:m,vals:b,color:"#60a5fa",width:1.2,dash:[3,3],label:"MM100"}),k.mm200&&U.push({dates:m,vals:B,color:"#a78bfa",width:1,dash:[2,4],label:"MM200"}),De($e,U,{hLines:[{y:20,color:"rgba(251,191,36,0.45)",dash:[3,3],label:"20",width:.8},{y:30,color:"rgba(244,113,116,0.45)",dash:[3,3],label:"30",width:.8}],xRange:H,GAP_DAYS:10,unitMaxValue:null})},x="1A";z(),document.querySelectorAll("#vix-range-btns button").forEach(m=>{m.addEventListener("click",()=>{x=m.dataset.range,z()})}),["vix-tog-vix","vix-tog-vix3m","vix-tog-mm100","vix-tog-mm200"].forEach(m=>{var C;(C=document.getElementById(m))==null||C.addEventListener("change",z)})}if(s){let m=function(){const a=s[x],b=document.getElementById("sp-header-metrics");if(!b||!a)return;const B=Ie(a.state),M=a.slope==="up"?"↑":a.slope==="down"?"↓":"→",H=a.price&&a.m10?(a.price-a.m10)/a.m10*100:null,k=x==="daily"&&a.price&&a._mm100Last?(a.price-a._mm100Last)/a._mm100Last*100:null,U=x==="daily"&&a.price&&a._mm200Last?(a.price-a._mm200Last)/a._mm200Last*100:null;function me(ve,ue,K){if(ve==null)return"";const ge=ve>0?"+":"",ke=ve>0?"var(--green)":"var(--red)";return`<span style="font-family:var(--mono);font-size:9px;color:var(--text3);">${ue} <span style="color:${ke};">${ge}${ve.toFixed(1)}%</span></span>`}const re=a._slopeMM100==="up"?"↑":a._slopeMM100==="down"?"↓":a._slopeMM100?"→":"",Q=a._slopeMM200==="up"?"↑":a._slopeMM200==="down"?"↓":a._slopeMM200?"→":"";b.innerHTML=`
            <span style="font-size:20px;font-weight:800;color:${B};">${y(a.price)}</span>
            <span style="font-family:var(--mono);font-size:9px;color:${B};">M10: ${y(a.m10)} ${M}</span>
            ${H!=null?me(H,"vs M10"):""}
            ${k!=null?`<span style="font-family:var(--mono);font-size:9px;color:#60a5fa;">MM100: ${y(a._mm100Last)} ${re}</span>`:""}
            ${k!=null?me(k,"vs MM100"):""}
            ${U!=null?`<span style="font-family:var(--mono);font-size:9px;color:rgba(200,200,210,0.8);">MM200: ${y(a._mm200Last)} ${Q}</span>`:""}
            ${U!=null?me(U,"vs MM200"):""}
            ${we(Ee(a.state),B)}
          `},C=function(){var a,b,B,M;return{price:((a=document.getElementById("sp-tog-price"))==null?void 0:a.checked)??!0,m10:((b=document.getElementById("sp-tog-m10"))==null?void 0:b.checked)??!0,mm100:((B=document.getElementById("sp-tog-mm100"))==null?void 0:B.checked)??!0,mm200:((M=document.getElementById("sp-tog-mm200"))==null?void 0:M.checked)??!0}},_=function(){var ke;document.querySelectorAll(".sp-tf-tab").forEach(E=>{const ee=E.dataset.tf===x;E.style.background=ee?"var(--surface2)":"transparent",E.style.color=ee?"var(--text1)":"var(--text3)",E.style.borderBottom=ee?"2px solid var(--teal)":"2px solid transparent"});const a=x==="daily",b=document.getElementById("sp-tog-mm100-wrap"),B=document.getElementById("sp-tog-mm200-wrap");if(b&&(b.style.display=a?"flex":"none"),B&&(B.style.display=a?"flex":"none"),!z)return;const M=s[x];if(!((ke=M==null?void 0:M.history)!=null&&ke.length)){De(z,[],{}),m();return}const H=M.history.filter(E=>E&&typeof E.date=="string"&&isFinite(Number(E.price))).sort((E,ee)=>E.date<ee.date?-1:1),k=H.map(E=>E.date.slice(0,10)),U=H.map(E=>Number(E.price)),me=H.map(E=>E.m10!=null&&isFinite(Number(E.m10))?Number(E.m10):null);let re=null,Q=null;if(a){let Ce=function(Ne){const Ye=Ne.filter(et=>et!=null);if(Ye.length<6)return null;const Je=Ye[Ye.length-6],Ze=Ye[Ye.length-1];return Ze>Je*1.001?"up":Ze<Je*.999?"down":"flat"};re=h(U,100),Q=h(U,200);const E=[...re].reverse().find(Ne=>Ne!=null),ee=[...Q].reverse().find(Ne=>Ne!=null);M._mm100Last=E??null,M._mm200Last=ee??null,M._slopeMM100=Ce(re),M._slopeMM200=Ce(Q)}const ve=M.state==="alcista"?"#22d3ee":M.state==="bajista"?"#f47174":"#22d3ee",ue=x==="monthly"?60:x==="weekly"?14:7,K=C(),ge=[];K.price&&ge.push({dates:k,vals:U,color:ve,width:1.8,fill:!0,label:"Precio"}),K.m10&&ge.push({dates:k,vals:me,color:"#fbbf24",width:1.5,dash:[4,3],label:"M10"}),a&&K.mm100&&re&&ge.push({dates:k,vals:re,color:"#60a5fa",width:1.2,label:"MM100"}),a&&K.mm200&&Q&&ge.push({dates:k,vals:Q,color:"rgba(200,200,210,0.6)",width:1,dash:[3,4],label:"MM200"}),De(z,ge,{GAP_DAYS:ue,unitMaxValue:null}),m()},x="daily";const z=document.getElementById("sp-main-chart");_(),document.querySelectorAll(".sp-tf-tab").forEach(a=>{a.addEventListener("click",()=>{x=a.dataset.tf,_()})}),["sp-tog-price","sp-tog-m10","sp-tog-mm100","sp-tog-mm200"].forEach(a=>{var b;(b=document.getElementById(a))==null||b.addEventListener("change",_)})}function Ve(x,z,m,C){if(x==null)return[];const _=[null,null,null,null,null];_[4]=x,z!=null&&(_[3]=x-z),m!=null&&(_[1]=x-m),C!=null&&(_[0]=x-C);const a=[..._];for(let b=0;b<a.length;b++)if(a[b]==null){const B=a.slice(0,b).reverse().find(H=>H!=null),M=a.slice(b+1).find(H=>H!=null);B!=null&&M!=null?a[b]=(B+M)/2:B!=null?a[b]=B:M!=null&&(a[b]=M)}return a}const Ge=document.getElementById("sp-dxy-spark");Ge&&p&&_e(Ge,Ve(p.value,p.chg1d,p.chg5d,p.chg20d),"#40d9c0");const We=document.getElementById("sp-cv-spark");We&&(g==null?void 0:g.value)!=null&&_e(We,Ve(g.value,null,null,null),g.value>=0?"#4ade80":"#f47174");const qe=document.getElementById("sp-df-spark");qe&&c&&_e(qe,Ve(c.value,c.chg1d,c.chg5d,c.chg20d),c.value>0?"#f47174":"#4ade80")}),(Ue=document.getElementById("hy-detail-btn"))==null||Ue.addEventListener("click",()=>{const l=document.getElementById("hy-detail"),h=document.getElementById("hy-detail-btn");l&&(l.style.display=l.style.display==="none"?"block":"none",h.textContent=l.style.display==="none"?"▾ Ver detalle":"▴ Ocultar")}),(Xe=document.getElementById("home-ai-btn-inner"))==null||Xe.addEventListener("click",P)}return(V=document.getElementById("home-refresh"))==null||V.addEventListener("click",()=>A(!0)),(te=document.getElementById("home-ai-btn"))==null||te.addEventListener("click",P),await A(!1),{destroy(){}}}export{dt as render};
