// ═══════════════════════════════════════════════
// MÓDULO: Screener SP500 / NYSE
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">Screener SP500 / NYSE</div>
      <div class="empty-desc">Filtrado de valores del S&amp;P 500 y NYSE según el sistema ETHAN (EMA, RSI, MACD, Stoch).</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
