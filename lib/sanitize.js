// lib/sanitize.js - Strip HTML & control characters (XSS shield) + block NoSQL operators
export const clean = (s, max = 500) =>
  String(s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);

export function noOperators(o) {
  if (o && typeof o === 'object') {
    for (const k of Object.keys(o)) {
      if (k.startsWith('$') || k.includes('.') || !noOperators(o[k])) return false;
    }
  }
  return true;
}
