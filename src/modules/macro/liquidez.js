// ═══════════════════════════════════════════════
// MÓDULO: Liquidez Global
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">💧</div>
      <div class="empty-title">Liquidez Global</div>
      <div class="empty-desc">M2 global, balance de bancos centrales y condiciones de crédito agregadas.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
