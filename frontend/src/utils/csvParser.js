// utils/csvParser.js
//
// Parses CSV files exported from Kite (Zerodha) and Groww
// into a consistent internal Holding shape.
//
// WHY WE NEED THIS:
// Kite and Groww export holdings in totally different column formats.
// This file is the "translation layer" — no matter which broker
// the data comes from, it becomes the SAME shape internally.
// Every other part of the app (charts, tables, calculations)
// never needs to know which broker the data originally came from.

import Papa from 'papaparse'

// ── Internal Holding Shape ──────────────────────────────────────
// Every holding in our app — regardless of source — looks like this:
// {
//   ticker:    'RELIANCE',
//   name:      'Reliance Industries',
//   type:      'Stock' | 'MF',
//   qty:       20,
//   avgPrice:  2480,
//   ltp:       2480,   // placeholder until Phase 3 fetches live price
//   sector:    'Unknown',
//   exchange:  'NSE' | 'AMFI',
// }

// ── Kite CSV Parser ──────────────────────────────────────────────
// Kite's holdings export (Console → Holdings → Download) has columns like:
// Instrument, Qty., Avg. cost, LTP, Cur. val, P&L, Net chg., Day chg.
//
// Column names can vary slightly by export date/version,
// so we check MULTIPLE possible names for each field.
export function parseKiteCSV(rawText) {
  // Papa.parse converts raw CSV text into an array of row objects.
  // header: true means row 1 becomes the object keys.
  const { data, errors } = Papa.parse(rawText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\.+/g, '').replace(/\s+/g, '_'),
    // transformHeader cleans messy headers like "Avg. cost" → "avg_cost"
  })

  if (errors.length) {
    console.warn('CSV parse warnings:', errors)
  }

  const holdings = data
    .map((row) => {
      // Try multiple possible column names (Kite has changed format before)
      const ticker = row['instrument'] || row['symbol'] || row['tradingsymbol']
      const qty    = parseFloat(row['qty'] || row['quantity'] || 0)
      const avg    = parseFloat(row['avg_cost'] || row['average_price'] || row['avgcost'] || 0)
      const ltp    = parseFloat(row['ltp'] || row['last_price'] || avg)

      // Skip rows that don't have the minimum required data
      if (!ticker || !qty || qty <= 0) return null

      return {
        ticker: ticker.trim().toUpperCase(),
        name: ticker.trim(),          // Phase 3 will replace with full company name
        type: 'Stock',
        qty,
        avgPrice: avg,
        ltp: ltp || avg,
        sector: 'Unknown',            // Phase 3/4 will map sectors
        exchange: 'NSE',
      }
    })
    .filter(Boolean)   // Remove null entries (skipped rows)

  return holdings
}

// ── Groww CSV Parser ──────────────────────────────────────────────
// Groww's holdings export has columns like:
// Stock Name, Quantity, Average buy price, Current price, ISIN
// (Mutual fund exports use: Scheme Name, Units, Average NAV, Current NAV)
export function parseGrowwCSV(rawText) {
  const { data, errors } = Papa.parse(rawText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/[\s/]+/g, '_'),
  })

  if (errors.length) {
    console.warn('CSV parse warnings:', errors)
  }

  const holdings = data
    .map((row) => {
      // Mutual fund export uses "scheme_name", stock export uses "stock_name"
      const name = row['scheme_name'] || row['fund_name'] || row['stock_name'] || row['company_name']
      const isMF = !!(row['scheme_name'] || row['fund_name'])

      const qty = parseFloat(row['units'] || row['quantity'] || 0)
      const avg = parseFloat(row['average_nav'] || row['average_buy_price'] || row['average_price'] || 0)
      const ltp = parseFloat(row['current_nav'] || row['current_price'] || row['ltp'] || avg)

      if (!name || !qty || qty <= 0) return null

      // Generate a short ticker-like code from the fund/stock name
      const ticker = isMF
        ? name.trim().split(' ').slice(0, 2).join('_').toUpperCase()
        : name.trim().toUpperCase()

      return {
        ticker,
        name: name.trim(),
        type: isMF ? 'MF' : 'Stock',
        qty,
        avgPrice: avg,
        ltp: ltp || avg,
        sector: isMF ? 'Equity MF' : 'Unknown',
        exchange: isMF ? 'AMFI' : 'NSE',
      }
    })
    .filter(Boolean)

  return holdings
}

// ── Sample CSV generators (for the "Download Sample" button) ────
export const KITE_SAMPLE_CSV = `Instrument,Qty.,Avg. cost,LTP
RELIANCE,20,2480,2890
HDFCBANK,35,1540,1720
TCS,15,3650,4120
INFY,40,1430,1590`

export const GROWW_SAMPLE_CSV = `Scheme Name,Units,Average NAV,Current NAV
Axis Long Term Equity Fund,300,55,78
Mirae Asset Large Cap Fund,500,88,112
Parag Parikh Flexi Cap Fund,200,62,89`