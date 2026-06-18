// ═══════════════════════════════════════════════
// MÓDULO: Análisis Fundamental
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">🧮</div>
      <div class="empty-title">Análisis Fundamental</div>
      <div class="empty-desc">Rankings Fundamental, Greenblatt y Lynch por ticker.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
