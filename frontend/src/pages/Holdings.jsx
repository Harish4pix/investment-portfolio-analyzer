// pages/Holdings.jsx
//
// The main data table — shows every holding with its
// quantity, prices, invested/current value, gain, and ROI.
// This is the "ground truth" view of the portfolio.

import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react'
import { fmtINR, fmtPct, fmtIndian, gainColor } from '../utils/format.js'

export default function Holdings({ portfolio }) {
  const { holdings, isLoaded } = portfolio

  // Empty state — same pattern as before
  if (!isLoaded || !holdings.length) {
    return (
      <div className="empty-card animate-fadeUp">
        <Briefcase size={38} color="#5b6b85" strokeWidth={1.5} style={{ margin: '0 auto' }} />
        <h2 style={{ marginTop: 18, fontSize: 19, fontWeight: 600, color: '#e8edf5' }}>Holdings</h2>
        <p style={{ color: '#5b6b85', marginTop: 7, fontSize: 14.5 }}>
          Import your portfolio to get started
        </p>
      </div>
    )
  }

  // Portfolio-level totals for the summary row at the bottom
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0)
  const totalCurrent  = holdings.reduce((s, h) => s + h.current, 0)
  const totalGain     = totalCurrent - totalInvested

  return (
    <div className="animate-fadeUp">
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#e8edf5' }}>All Holdings</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5b6b85' }}>
            {holdings.length} instrument{holdings.length > 1 ? 's' : ''} · {fmtINR(totalInvested)} invested
          </p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Ticker', 'Name', 'Type', 'Qty', 'Avg Price', 'LTP', 'Invested', 'Current', 'P&L', 'ROI'].map((h) => (
                  <th key={h} style={{
                    padding: '11px 14px', textAlign: 'left', color: '#5b6b85',
                    fontWeight: 600, fontSize: 11, letterSpacing: '0.05em',
                    borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr
                  key={h.ticker + i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 14px', color: '#5b9bd5', fontWeight: 700 }}>{h.ticker}</td>
                  <td style={{ padding: '11px 14px', color: '#e8edf5', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.name}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: h.type === 'Stock' ? 'rgba(21,101,192,0.15)' : 'rgba(192,132,252,0.15)',
                      color: h.type === 'Stock' ? '#5b9bd5' : '#c084fc',
                    }}>
                      {h.type}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', color: '#7a8aa0' }}>{fmtIndian(h.qty)}</td>
                  <td style={{ padding: '11px 14px', color: '#7a8aa0' }}>{fmtINR(h.avgPrice)}</td>
                  <td style={{ padding: '11px 14px', color: '#e8edf5', fontWeight: 600 }}>{fmtINR(h.ltp)}</td>
                  <td style={{ padding: '11px 14px', color: '#7a8aa0' }}>{fmtINR(h.invested)}</td>
                  <td style={{ padding: '11px 14px', color: '#ffd200', fontWeight: 700 }}>{fmtINR(h.current)}</td>
                  <td style={{ padding: '11px 14px', color: gainColor(h.gain), fontWeight: 600 }}>
                    {h.gain >= 0 ? '+' : ''}{fmtINR(h.gain)}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                      background: h.roiPct >= 0 ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: gainColor(h.roiPct),
                    }}>
                      {h.roiPct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {fmtPct(h.roiPct, 1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Summary footer row */}
            <tfoot>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderTop: '2px solid rgba(255,255,255,0.08)' }}>
                <td colSpan={6} style={{ padding: '12px 14px', color: '#e8edf5', fontWeight: 700, fontSize: 12.5 }}>
                  Total
                </td>
                <td style={{ padding: '12px 14px', color: '#7a8aa0', fontWeight: 700 }}>{fmtINR(totalInvested)}</td>
                <td style={{ padding: '12px 14px', color: '#ffd200', fontWeight: 700 }}>{fmtINR(totalCurrent)}</td>
                <td style={{ padding: '12px 14px', color: gainColor(totalGain), fontWeight: 700 }}>
                  {totalGain >= 0 ? '+' : ''}{fmtINR(totalGain)}
                </td>
                <td style={{ padding: '12px 14px', color: gainColor(totalGain), fontWeight: 700 }}>
                  {fmtPct(totalInvested ? (totalGain / totalInvested) * 100 : 0, 1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}


