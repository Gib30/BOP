/**
 * Safe parse of holders/trustLines strings (e.g. "2,847" or "2847")
 * Returns 0 for invalid or missing values.
 */
export function parseCount(str) {
  if (str == null || str === '') return 0;
  const cleaned = String(str).replace(/,/g, '').replace(/\s/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isNaN(n) ? 0 : n;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Enrich badges with auto-derived ones: New (created in last 30 days), Meme (category Meme).
 * Does not duplicate existing badges. Returns a new array.
 */
export function enrichBadges(badges = [], category, createdAt) {
  const set = new Set(badges || []);
  if (category === 'Meme' && !set.has('Meme')) set.add('Meme');
  if (createdAt) {
    const age = Date.now() - new Date(createdAt).getTime();
    if (age < THIRTY_DAYS_MS && !set.has('New')) set.add('New');
  }
  return [...set];
}
