// utils/portfolioCalc.js
//
// Takes raw holdings (just qty, avgPrice, ltp) and "enriches" them
// with every computed field the rest of the app needs:
// invested value, current value, gain/loss, ROI%.
//
// WHY A SEPARATE ENRICH STEP:
// CSV parsers and manual entry only know the RAW numbers a user entered.
// They shouldn't also know HOW to calculate ROI or P&L — that's a
// different responsibility. This keeps each function focused on one job
// (Single Responsibility Principle).

export function enrichHoldings(rawHoldings) {
  return rawHoldings.map((h) => {
    const invested = h.qty * h.avgPrice
    const current  = h.qty * h.ltp
    const gain      = current - invested
    const roiPct    = h.avgPrice ? ((h.ltp - h.avgPrice) / h.avgPrice) * 100 : 0

    return {
      ...h,
      invested,
      current,
      gain,
      roiPct,
    }
  })
}

// ── Portfolio-level totals ──────────────────────────────────────
// Used by Header, Overview, and anywhere we need the "big numbers"
export function calcPortfolioTotals(holdings) {
  if (!holdings.length) {
    return { totalInvested: 0, totalCurrent: 0, totalGain: 0, totalROI: 0 }
  }
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0)
  const totalCurrent  = holdings.reduce((s, h) => s + h.current, 0)
  const totalGain     = totalCurrent - totalInvested
  const totalROI      = totalInvested ? (totalGain / totalInvested) * 100 : 0

  return { totalInvested, totalCurrent, totalGain, totalROI }
}