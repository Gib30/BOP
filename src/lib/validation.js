/**
 * URL validation - must be https?:// with valid domain (has TLD)
 * Accepts: https://example.com, https://t.me/x, https://discord.gg/abc
 * Rejects: "asdf", "http://", "https://x", gibberish
 */
const URL_REGEX = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}(\/[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%]*)?$/;

/**
 * XRPL classic address: starts with r, base58, 25-34 chars
 */
const ISSUER_REGEX = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;

/**
 * Token ticker: 1-10 alphanumeric, optional hyphens
 */
const TICKER_REGEX = /^[A-Z0-9]{1,10}$/;

export function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  return URL_REGEX.test(trimmed);
}

export function isValidIssuer(str) {
  if (!str || typeof str !== 'string') return false;
  return ISSUER_REGEX.test(str.trim());
}

export function isValidTicker(str) {
  if (!str || typeof str !== 'string') return false;
  return TICKER_REGEX.test(str.trim().toUpperCase());
}

/**
 * Validate optional URL field - empty is ok, non-empty must be valid URL
 */
export function validateOptionalUrl(value, fieldName) {
  if (!value || !value.trim()) return null;
  if (!isValidUrl(value)) return `${fieldName} must be a valid URL (e.g. https://example.com)`;
  return null;
}
