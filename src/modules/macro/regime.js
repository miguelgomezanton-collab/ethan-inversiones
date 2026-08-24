// regime.js — Fuente de verdad canónica para la clasificación del régimen macro
// Motor: HIST_MACRO_V1_FRED (agosto 2026)
// VALIDACIÓN HARD: dado un mismo score, todas las pantallas deben devolver exactamente el mismo régimen.
// NO modificar sin actualizar HIST_MACRO_V1.

/**
 * Mapping canónico score → régimen.
 * score = scoreRaw (entero, rango teórico -17 a +17)
 * @param {number|null} score
 * @returns {{ label: string, color: string, source: string }}
 */
export function regimeFromScore(score) {
  if (score == null || isNaN(score)) {
    return { label: 'Sin datos', color: 'var(--text3)', source: 'HIST_MACRO_V1' };
  }
  if (score >= 10) return { label: 'Boom',           color: 'var(--green)',  source: 'HIST_MACRO_V1' };
  if (score >=  4) return { label: 'Expansión',       color: 'var(--teal)',   source: 'HIST_MACRO_V1' };
  if (score >=  0) return { label: 'Desaceleración',  color: 'var(--amber)',  source: 'HIST_MACRO_V1' };
  if (score >= -4) return { label: 'Recesión Leve',   color: 'var(--red)',    source: 'HIST_MACRO_V1' };
  return              { label: 'Recesión Severa',  color: 'var(--red)',    source: 'HIST_MACRO_V1' };
}

/**
 * Rango de exposición a RV recomendado por régimen (orientativo, no normativo).
 * @param {number|null} score
 * @returns {string}
 */
export function rvRangeFromScore(score) {
  if (score == null || isNaN(score)) return '—';
  if (score >= 10) return '75–90%';
  if (score >=  4) return '55–70%';
  if (score >=  0) return '35–55%';
  if (score >= -4) return '20–40%';
  return '10–25%';
}
