
// hooks/useLivePrices.js
//
// Custom hook that fetches live prices for the current portfolio's
// tickers, and exposes a refresh() function to re-fetch on demand.
//
// WHY A CUSTOM HOOK:
// This logic — loading state, error state, fetch function — would be
// needed in multiple pages (Holdings, Overview, Technicals).
// A custom hook lets us write it ONCE and reuse it everywhere.

import { useState, useCallback } from 'react'
import { fetchLivePrices } from '../utils/api.js'

export function useLivePrices() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // refresh — call this to fetch live prices for a list of tickers.
  // Returns a map: { RELIANCE: 1309.5, TCS: 2125, ... }
  const refresh = useCallback(async (tickers) => {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchLivePrices(tickers)

      // Convert array response into a lookup object for easy access
      const priceMap = {}
      results.forEach((r) => {
        if (r.success && r.ltp) {
          priceMap[r.ticker] = {
            ltp: r.ltp,
            change: r.change,
            changePct: r.change_pct,
          }
        }
      })

      setLastUpdated(new Date())
      setLoading(false)
      return priceMap
    } catch (err) {
      setError('Could not fetch live prices. Check your connection.')
      setLoading(false)
      return {}
    }
  }, [])

  return { refresh, loading, error, lastUpdated }
}












