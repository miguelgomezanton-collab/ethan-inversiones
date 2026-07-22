import{U as A}from"./userdata-DRc3raHj.js";import"./index-Bux_OP-y.js";const C="ethan_correcciones_v1",ot=[o=>`https://api.allorigins.win/raw?url=${encodeURIComponent(o)}`,o=>`https://corsproxy.io/?${encodeURIComponent(o)}`,o=>`https://soft-field-156f.miguel-gomez-anton.workers.dev/?url=${encodeURIComponent(o)}`];async function at(o){var p,s,l,d;const i=`https://query1.finance.yahoo.com/v8/finance/chart/${o}?interval=1d&range=3y`;for(const n of ot)try{const r=await fetch(n(i),{signal:AbortSignal.timeout(1e4)});if(!r.ok)continue;const t=JSON.parse(await r.text()),e=(s=(p=t==null?void 0:t.chart)==null?void 0:p.result)==null?void 0:s[0];if(!e)continue;const a=e.meta||{},c=((d=(l=e.indicators)==null?void 0:l.quote)==null?void 0:d[0])||{};return{timestamps:e.timestamp||[],opens:c.open||[],highs:c.high||[],lows:c.low||[],closes:c.close||[],volumes:c.volume||[],name:a.shortName||a.longName||o,currency:a.currency||"USD"}}catch{}throw new Error(`No se pudo obtener datos de ${o}`)}function y(o,i){const p=2/(i+1),s=[];for(let l=0;l<o.length;l++){if(o[l]==null){s.push(null);continue}if(s.length<i){s.push(null);continue}if(s[l-1]==null){const d=o.slice(l-i+1,l+1).filter(n=>n!=null);s.push(d.length===i?d.reduce((n,r)=>n+r,0)/i:null)}else s.push(o[l]*p+s[l-1]*(1-p))}return s}function st(o,i){return o.map((p,s)=>{if(s<i-1)return null;const l=o.slice(s-i+1,s+1);return l.every(d=>d!=null)?l.reduce((d,n)=>d+n,0)/i:null})}function j(o,i){const p=Array(o.length).fill(null);if(o.length<i+1)return p;let s=0,l=0;for(let r=1;r<=i;r++){const t=o[r]-o[r-1];t>=0?s+=t:l-=t}let d=s/i,n=l/i;p[i]=n===0?100:100-100/(1+d/n);for(let r=i+1;r<o.length;r++){const t=o[r]-o[r-1];d=(d*(i-1)+Math.max(t,0))/i,n=(n*(i-1)+Math.max(-t,0))/i,p[r]=n===0?100:100-100/(1+d/n)}return p}function q(o,i,p,s,l=3){const d=p.map((r,t)=>{if(t<s-1)return null;const e=Math.max(...o.slice(t-s+1,t+1)),a=Math.min(...i.slice(t-s+1,t+1));return e===a?50:(r-a)/(e-a)*100}),n=st(d.map(r=>r??0),l);return{k:d,d:n}}function rt(o,i=12,p=26,s=9){const l=y(o,i),d=y(o,p),n=l.map((e,a)=>e!=null&&d[a]!=null?e-d[a]:null),r=y(n.map(e=>e??0),s),t=n.map((e,a)=>e!=null&&r[a]!=null?e-r[a]:null);return{macd:n,signal:r,hist:t}}function lt(o,i,p,s,l,d){const n={};o.forEach((t,e)=>{if(l[e]==null)return;const a=new Date(t*1e3),c=a.getDay(),g=new Date(a);g.setDate(a.getDate()-(c===0?6:c-1));const u=g.toISOString().slice(0,10);n[u]?(n[u].h=Math.max(n[u].h,p[e]),n[u].l=Math.min(n[u].l,s[e]),n[u].c=l[e],n[u].v+=d[e]||0):n[u]={o:i[e],h:p[e],l:s[e],c:l[e],v:d[e]||0}});const r=Object.keys(n).sort();return{opens:r.map(t=>n[t].o),highs:r.map(t=>n[t].h),lows:r.map(t=>n[t].l),closes:r.map(t=>n[t].c)}}function ct(o,i){const{timestamps:p,opens:s,highs:l,lows:d,closes:n,volumes:r}=o,t=n.length,e=lt(p,s,l,d,n,r),a=e.closes.length,c=e.closes[a-1],g=y(e.closes,5)[a-1],u=y(e.closes,10)[a-1],v=y(e.closes,20)[a-1],R=y(e.closes,34)[a-1],S=j(e.closes,14)[a-1],F=j(e.closes,2)[a-1],D=q(e.highs,e.lows,e.closes,89),tt=q(e.highs,e.lows,e.closes,14),h=D.k[a-1],W=D.k[a-2];D.d[a-1];const _=tt.k[a-1],L=rt(e.closes),P=L.macd[a-1],et=L.signal[a-1],z=L.hist[a-1],G=n[t-1],T=y(n,5)[t-1],O=y(n,10)[t-1],E=y(n,20)[t-1],J=y(n,34)[t-1],V=j(n,14)[t-1],X=q(l,d,n,5),Y=X.k[t-1],B=X.k[t-2],f=x=>x!=null?x.toFixed(2):"—",m=x=>x!=null?"$"+x.toFixed(2):"—";let N=[],U=[],H="pendiente";if(i===1){const x=c>v,M=c<g||c<u,I=h<W&&h>85,b=z>0&&P>et,$=S>57,w=F<40;N=[{label:"Precio > MM20 semanal",ok:x,val:`${m(c)} > ${m(v)}`},{label:"Precio < MM5 o < MM10 semanal",ok:M,val:`MM5:${m(g)} MM10:${m(u)}`},{label:"Stoch(89) corta ↓ pero >85",ok:I,val:`Stoch89: ${f(h)} (prev: ${f(W)})`},{label:"MACD cortado al alza (hist >0)",ok:b,val:`Hist: ${f(z)}`},{label:"RSI(14) semanal >57",ok:$,val:f(S)},{label:"RSI(2) semanal <40",ok:w,val:f(F)}];const k=Y>B&&B<30;U=[{label:"Stoch(5) diario cruza al alza desde <30",ok:k,val:`K: ${f(Y)} prev: ${f(B)}`}],H=[x,M,I,b,$,w].every(Boolean)?k?"entrada":"espera":"no-cumple"}else{const x=c<u,M=c>R,I=c!=null&&v!=null&&Math.abs(c-v)/v<.05,b=S<57,$=z<0&&P>0,w=h>75,k=_<60;N=[{label:"Precio < MM10 semanal",ok:x,val:`${m(c)} < ${m(u)}`},{label:"Precio > MM34 semanal",ok:M,val:`${m(c)} > ${m(R)}`},{label:"Precio cerca MM20 semanal (<5%)",ok:I,val:`MM20: ${m(v)} · dist: ${v?(Math.abs(c-v)/v*100).toFixed(1)+"%":"—"}`},{label:"RSI(14) semanal <57",ok:b,val:f(S)},{label:"MACD cortado ↓ pero >0",ok:$,val:`Hist: ${f(z)} · MACD: ${f(P)}`},{label:"Stoch(89) semanal >75",ok:w,val:f(h)},{label:"Stoch(14) semanal <60",ok:k,val:f(_)}];const K=V<40,Q=G>T&&T>O&&O>E,nt=E>J;U=[{label:"RSI(14) diario <40",ok:K,val:f(V)},{label:"Precio > MM5 > MM10 > MM20 diario",ok:Q,val:`P:${m(G)} MM5:${m(T)} MM10:${m(O)} MM20:${m(E)}`},{label:"Confirmación: MM20 > MM34 diario",ok:nt,val:`MM20:${m(E)} MM34:${m(J)}`}],H=[x,M,b,$,w,k].every(Boolean)?K&&Q?"entrada":"espera":"no-cumple"}return{precio:c,nombre:o.name,moneda:o.currency,wMM5:g,wMM10:u,wMM20:v,wMM34:R,condiciones:N,entrada:U,resultado:H,updatedAt:new Date().toISOString()}}function it(o){return o==="entrada"?'<span style="background:rgba(74,222,128,0.15);color:var(--green);padding:3px 10px;border-radius:10px;font-size:9px;font-weight:700;font-family:var(--mono);">🟢 ENTRADA</span>':o==="espera"?'<span style="background:rgba(251,191,36,0.12);color:var(--amber);padding:3px 10px;border-radius:10px;font-size:9px;font-weight:700;font-family:var(--mono);">⏳ ESPERA</span>':o==="no-cumple"?'<span style="background:rgba(244,113,116,0.12);color:var(--red);padding:3px 10px;border-radius:10px;font-size:9px;font-weight:700;font-family:var(--mono);">❌ NO CUMPLE</span>':'<span style="background:var(--surface2);color:var(--text3);padding:3px 10px;border-radius:10px;font-size:9px;font-family:var(--mono);">⏳ PENDIENTE</span>'}function Z(o){return`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
    <span style="font-size:13px;flex-shrink:0;">${o.ok?"✅":"❌"}</span>
    <span style="flex:1;font-size:11px;color:${o.ok?"var(--text1)":"var(--text3)"};">${o.label}</span>
    <span style="font-family:var(--mono);font-size:10px;color:${o.ok?"var(--teal)":"var(--text3)"};">${o.val}</span>
  </div>`}async function vt(o,{actionsSlot:i,savedState:p}){i.innerHTML="",o.innerHTML='<div id="cor-wrap"><div class="empty"><div class="loader-ring"></div></div></div>';let s=await A.get(C)||[];function l(){var r;const n=document.getElementById("cor-wrap");n.innerHTML=`
      <!-- Añadir valor -->
      <div class="mc-card" style="margin-bottom:16px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--text3);margin-bottom:12px;">Añadir a Watchlist de Correcciones</div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <input type="text" id="cor-ticker" placeholder="Ticker (ej. AAPL)" class="wl-input" style="width:160px;text-transform:uppercase;">
          <select id="cor-tipo" class="wl-input" style="width:220px;">
            <option value="1">Tipo 1 — Corrección superficial</option>
            <option value="2">Tipo 2 — Corrección normal</option>
          </select>
          <input type="text" id="cor-nota" placeholder="Nota opcional (ej. corrige a MM20)" class="wl-input" style="flex:1;min-width:180px;">
          <button class="btn btn-primary" id="cor-add-btn">+ Añadir</button>
        </div>
        <div style="margin-top:10px;font-size:10px;color:var(--text3);line-height:1.6;">
          <strong style="color:var(--text2);">Tipo 1:</strong> Corrección superficial — precio sigue sobre MM20 semanal. Entrada: Stoch(5) cruza ↑.<br>
          <strong style="color:var(--text2);">Tipo 2:</strong> Corrección normal — precio perfora MM10, busca MM20/MM34. Entrada: RSI(14) diario &lt;40 + alineación MMs.
        </div>
      </div>

      <!-- Lista -->
      ${s.length===0?`
        <div class="empty">
          <div class="empty-icon">📋</div>
          <div class="empty-title">Watchlist vacía</div>
          <div class="empty-desc">Añade valores que estén en corrección para hacer seguimiento.</div>
        </div>`:s.map((t,e)=>{var a,c;return`
        <div class="mc-card" style="margin-bottom:12px;" id="cor-card-${e}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--text1);">${t.ticker}</span>
                <span style="font-size:9px;padding:2px 8px;border-radius:10px;font-family:var(--mono);background:rgba(64,217,192,0.1);color:var(--teal);">TIPO ${t.tipo}</span>
                ${it(t.resultado)}
                ${t.nota?`<span style="font-size:10px;color:var(--text3);font-style:italic;">${t.nota}</span>`:""}
              </div>
              ${t.nombre?`<div style="font-size:10px;color:var(--text3);margin-top:3px;">${t.nombre} · ${t.moneda||"USD"} · Precio: $${((a=t.precio)==null?void 0:a.toFixed(2))||"—"}</div>`:""}
              ${t.updatedAt?`<div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px;">Última actualización: ${new Date(t.updatedAt).toLocaleString("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</div>`:""}
            </div>
            <div style="display:flex;gap:6px;">
              <button class="btn" data-idx="${e}" id="cor-refresh-${e}" style="font-size:10px;padding:4px 10px;">↻ Actualizar</button>
              <button class="btn" data-idx="${e}" id="cor-del-${e}" style="font-size:10px;padding:4px 10px;color:var(--red);border-color:rgba(244,113,116,0.3);">✕</button>
            </div>
          </div>

          ${(c=t.condiciones)!=null&&c.length?`
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
                Condiciones semanales · ${t.condiciones.filter(g=>g.ok).length}/${t.condiciones.length} ✓
              </div>
              ${t.condiciones.map(Z).join("")}
            </div>
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;">
                Señal de entrada · diario
              </div>
              ${(t.entrada||[]).map(Z).join("")}
              ${t.resultado==="entrada"?`
              <div style="margin-top:10px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);border-radius:8px;padding:10px 12px;">
                <div style="font-size:11px;color:var(--green);font-weight:700;">🟢 Condiciones de entrada activas</div>
                <div style="font-size:10px;color:var(--text2);margin-top:4px;">Revisar el gráfico y confirmar la señal antes de entrar.</div>
              </div>`:t.resultado==="espera"?`
              <div style="margin-top:10px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:10px 12px;">
                <div style="font-size:11px;color:var(--amber);font-weight:700;">⏳ Condiciones de corrección activas</div>
                <div style="font-size:10px;color:var(--text2);margin-top:4px;">Esperando señal de entrada en diario.</div>
              </div>`:""}
            </div>
          </div>`:`
          <div style="display:flex;align-items:center;gap:8px;color:var(--text3);font-size:11px;">
            <div class="loader-ring" style="width:14px;height:14px;"></div>
            Pulsa ↻ Actualizar para analizar las condiciones
          </div>`}
        </div>`}).join("")}
    `,(r=document.getElementById("cor-add-btn"))==null||r.addEventListener("click",async()=>{var c,g,u;const t=(c=document.getElementById("cor-ticker"))==null?void 0:c.value.trim().toUpperCase(),e=parseInt(((g=document.getElementById("cor-tipo"))==null?void 0:g.value)||"1"),a=(u=document.getElementById("cor-nota"))==null?void 0:u.value.trim();if(t){if(s.find(v=>v.ticker===t&&v.tipo===e)){alert(`${t} ya está en la watchlist con Tipo ${e}`);return}s.push({ticker:t,tipo:e,nota:a,resultado:"pendiente",addedAt:new Date().toISOString()}),await A.set(C,s),l(),d(s.length-1)}}),s.forEach((t,e)=>{var a,c;(a=document.getElementById(`cor-refresh-${e}`))==null||a.addEventListener("click",()=>d(e)),(c=document.getElementById(`cor-del-${e}`))==null||c.addEventListener("click",async()=>{s.splice(e,1),await A.set(C,s),l()})}),s.forEach((t,e)=>{t.condiciones||d(e)})}async function d(n){const r=s[n];if(!r)return;document.getElementById(`cor-card-${n}`);const t=document.getElementById(`cor-refresh-${n}`);t&&(t.disabled=!0,t.textContent="⏳");try{const e=await at(r.ticker),a=ct(e,r.tipo);s[n]={...r,...a},await A.set(C,s),l()}catch(e){t&&(t.disabled=!1,t.textContent="↻ Actualizar");const a=document.getElementById(`cor-card-${n}`);if(a){const c=a.querySelector('div[style*="loader-ring"]');c&&(c.innerHTML=`<span style="color:var(--red);">⚠ ${e.message}</span>`)}}}return l(),{destroy(){}}}export{vt as render};
