// utils/api.js
//
// Central place for ALL calls to our FastAPI backend.
// Never call fetch() or axios directly inside components —
// always go through here. This way, if the backend URL changes
// (e.g. when we deploy), we fix it in ONE place.

import axios from 'axios'

// Because of the Vite proxy we set up in Phase 1 (vite.config.js),
// any request to "/api/..." automatically forwards to
// http://localhost:8000/... during development.
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,   // 15 seconds — yfinance can be slow on cold starts
})

// ── Fetch live prices for a list of tickers ──────────────────────
// Returns: [{ ticker, ltp, prev_close, change, change_pct, success }, ...]
export async function fetchLivePrices(tickers) {
  if (!tickers.length) return []

  try {
    const res = await api.post('/prices/batch', { tickers })
    return res.data.prices
  } catch (err) {
    console.error('Failed to fetch live prices:', err)
    throw err
  }
}