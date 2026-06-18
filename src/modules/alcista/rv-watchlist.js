// ═══════════════════════════════════════════════
// MÓDULO: Watchlist · Renta Variable
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">👁</div>
      <div class="empty-title">Watchlist · Renta Variable</div>
      <div class="empty-desc">Tickers de renta variable en seguimiento con señales EMA.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
