// ═══════════════════════════════════════════════
// MÓDULO: Coyuntura Macroeconómica
// Placeholder — pendiente de migrar contenido real.
// ═══════════════════════════════════════════════

export async function render(container) {
  container.innerHTML = `
    <div class="empty">
      <div class="empty-icon">◉</div>
      <div class="empty-title">Coyuntura Macroeconómica</div>
      <div class="empty-desc">Score macro, fase del ciclo (curva de tipos, LEI) y Fear &amp; Greed Index.</div>
    </div>
  `;

  return {
    destroy() {}
  };
}
