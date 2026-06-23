async function s(i){return i.innerHTML=`
    <div class="empty">
      <div class="empty-icon">👁</div>
      <div class="empty-title">Watchlist · Bajista</div>
      <div class="empty-desc">Candidatos a cortos en seguimiento.</div>
    </div>
  `,{destroy(){}}}export{s as render};
