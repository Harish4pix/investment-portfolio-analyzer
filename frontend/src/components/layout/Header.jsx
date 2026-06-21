import { useMemo } from 'react'
import { BarChart3, ArrowUpToLine, Circle } from 'lucide-react'
import { fmtINR, fmtPct } from '../../utils/format.js'
import { isMarketOpen } from '../../constants/holidays.js'

export default function Header({ portfolio, onImport }) {
  const open = isMarketOpen()

  const { totalCurrent, totalROI } = useMemo(() => {
    if (!portfolio.holdings.length) return { totalCurrent: 0, totalROI: 0 }
    const invested = portfolio.holdings.reduce((s, h) => s + h.invested, 0)
    const current  = portfolio.holdings.reduce((s, h) => s + h.current, 0)
    return {
      totalCurrent: current,
      totalROI: invested ? ((current - invested) / invested) * 100 : 0,
    }
  }, [portfolio.holdings])

  return (
    <header style={{
      background: '#0a0d14',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 28px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Left: Logo + Market Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#1565c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={19} color="#fff" strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>
            IPA
          </span>
          <span style={{
            fontSize: 12, color: '#5b6b85', fontWeight: 500,
            borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 10,
            letterSpacing: '0.02em',
          }}>
            Portfolio Analyzer
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
          <Circle size={7} fill={open ? '#2ecc71' : '#5b6b85'} color={open ? '#2ecc71' : '#5b6b85'} />
          <span style={{ color: open ? '#2ecc71' : '#5b6b85', fontWeight: 500 }}>
            NSE {open ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Right: Portfolio Value + Import */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {portfolio.isLoaded && (
          <>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 10, color: '#5b6b85', fontWeight: 500 }}>PORTFOLIO VALUE</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#e8edf5', fontFamily: "'IBM Plex Mono', monospace" }}>
                {fmtINR(totalCurrent)}
              </p>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 4,
              color: totalROI >= 0 ? '#2ecc71' : '#e74c3c',
              background: totalROI >= 0 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {fmtPct(totalROI)}
            </div>
          </>
        )}

        <button
          onClick={onImport}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#1565c0',
            border: 'none',
            borderRadius: 6,
            padding: '7px 14px',
            color: '#fff',
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1976d2'}
          onMouseLeave={e => e.currentTarget.style.background = '#1565c0'}
        >
          <ArrowUpToLine size={15} strokeWidth={2.4} />
          Import Portfolio
        </button>
      </div>
    </header>
  )
}