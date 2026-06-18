// ═══════════════════════════════════════════════
// MÓDULO: Asset Allocation
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">⚖</div>
      <div class="empty-title">Asset Allocation</div>
      <div class="empty-desc">Distribución de capital por clase de activo, sector y estrategia.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
