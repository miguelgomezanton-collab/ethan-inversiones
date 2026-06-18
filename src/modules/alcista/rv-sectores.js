// ═══════════════════════════════════════════════
// MÓDULO: Screener de Sectores
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">🏭</div>
      <div class="empty-title">Screener de Sectores</div>
      <div class="empty-desc">Fuerza relativa de sectores (ETFs sectoriales) vs SPY.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
