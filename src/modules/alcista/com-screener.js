// ═══════════════════════════════════════════════
// MÓDULO: Screener · Commodities
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">🪙</div>
      <div class="empty-title">Screener · Commodities</div>
      <div class="empty-desc">Metales, energía y materias primas — variación y tendencia.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
