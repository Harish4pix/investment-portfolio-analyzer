import { LayoutGrid } from 'lucide-react'

export default function Overview({ portfolio, onImport }) {
  return (
    <div className="empty-card animate-fadeUp">
      <LayoutGrid size={38} color="#5b6b85" strokeWidth={1.5} style={{ margin: '0 auto' }} />
      <h2 style={{ marginTop: 18, fontSize: 19, fontWeight: 600, color: '#e8edf5' }}>Overview</h2>
      <p style={{ color: '#5b6b85', marginTop: 7, fontSize: 14.5 }}>
        {portfolio.isLoaded
          ? `${portfolio.holdings.length} holdings loaded`
          : 'Import your portfolio to get started'}
      </p>
      {!portfolio.isLoaded && (
        <button onClick={onImport} style={{
          marginTop: 22, padding: '10px 24px', borderRadius: 6,
          background: '#1565c0', color: '#fff', border: 'none',
          cursor: 'pointer', fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1976d2'}
        onMouseLeave={e => e.currentTarget.style.background = '#1565c0'}
        >
          Import Portfolio
        </button>
      )}
    </div>
  )
}