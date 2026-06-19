// ═══════════════════════════════════════════════
// macro-data.js — Helper compartido entre módulos de Macro
// ═══════════════════════════════════════════════

let cachedMacro = null;
let cachedMacroAt = 0;
let cachedFearGreed = null;
let cachedFearGreedAt = 0;

const CACHE_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Llama a /api/macro (nuestra función serverless con FRED + CBOE + LEI).
 * Cachea en memoria 5 min para no disparar la API en cada navegación entre
 * sub-páginas de Macro.
 */
export async function getMacroData(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedMacro && (now - cachedMacroAt) < CACHE_MS) {
    return cachedMacro;
  }
  const res = await fetch('/api/macro');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error /api/macro: HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedMacro = data;
  cachedMacroAt = now;
  return data;
}

/**
 * Llama directamente a feargreedchart.com (tiene CORS habilitado, no
 * necesita pasar por nuestro proxy serverless).
 */
export async function getFearGreed(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedFearGreed && (now - cachedFearGreedAt) < CACHE_MS) {
    return cachedFearGreed;
  }
  const res = await fetch('https://feargreedchart.com/api/?action=all');
  if (!res.ok) throw new Error(`Fear & Greed: HTTP ${res.status}`);
  const data = await res.json();
  cachedFearGreed = data;
  cachedFearGreedAt = now;
  return data;
}

export function fearGreedLabel(score) {
  if (score <= 20) return 'Extreme Fear';
  if (score <= 40) return 'Fear';
  if (score <= 60) return 'Neutral';
  if (score <= 80) return 'Greed';
  return 'Extreme Greed';
}

export function fearGreedColor(score) {
  if (score <= 20) return 'var(--red)';
  if (score <= 40) return 'var(--amber)';
  if (score <= 60) return 'var(--text2)';
  if (score <= 80) return 'var(--green)';
  return 'var(--teal)';
}
