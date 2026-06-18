// ═══════════════════════════════════════════════
// MÓDULO: Indicadores de Seguimiento
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">📡</div>
      <div class="empty-title">Indicadores de Seguimiento</div>
      <div class="empty-desc">Indicadores monetarios ponderados: M2 Global, impulso crediticio, velocidad del dinero.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
