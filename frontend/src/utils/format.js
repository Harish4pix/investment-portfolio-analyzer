// utils/format.js
//
// Central place for ALL formatting functions.
// Never format numbers inline in components —
// always import from here. This way if the format
// changes, you fix it in ONE place.

// ── Indian Currency Formatting ──────────────────────────────────
// Indian system: 1,00,000 = 1 Lakh, 1,00,00,000 = 1 Crore
export const fmtINR = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '₹0'
  const abs  = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e7) return sign + '₹' + (abs / 1e7).toFixed(2) + ' Cr'
  if (abs >= 1e5) return sign + '₹' + (abs / 1e5).toFixed(2) + ' L'
  if (abs >= 1e3) return sign + '₹' + (abs / 1e3).toFixed(1) + 'K'
  return sign + '₹' + abs.toFixed(2)
}

// ── Percentage ──────────────────────────────────────────────────
// Always shows sign: +12.34% or -5.67%
export const fmtPct = (n, dec = 2) => {
  if (n === undefined || n === null || isNaN(n)) return '0.00%'
  return (n >= 0 ? '+' : '') + Number(n).toFixed(dec) + '%'
}

// ── Plain number ────────────────────────────────────────────────
export const fmtNum = (n, dec = 2) => {
  if (n === undefined || n === null || isNaN(n)) return '0'
  return Number(n).toFixed(dec)
}

// ── Indian number with commas ───────────────────────────────────
// 1234567 → 12,34,567
export const fmtIndian = (n) => {
  if (!n) return '0'
  return Number(n).toLocaleString('en-IN')
}

// ── Color helper ────────────────────────────────────────────────
// Returns CSS color string based on positive/negative value
export const pctColor = (n) =>
  n >= 0 ? 'var(--color-green)' : 'var(--color-red)'

export const gainColor = (n) =>
  n >= 0 ? 'var(--color-green)' : 'var(--color-red)'