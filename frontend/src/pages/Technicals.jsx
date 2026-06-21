import { TrendingUp } from 'lucide-react'

export default function Technicals({ portfolio }) {
  return (
    <div className="empty-card animate-fadeUp">
      <TrendingUp size={38} color="#5b6b85" strokeWidth={1.5} style={{ margin: '0 auto' }} />
      <h2 style={{ marginTop: 18, fontSize: 19, fontWeight: 600, color: '#e8edf5' }}>Technicals</h2>
      <p style={{ color: '#5b6b85', marginTop: 7, fontSize: 14.5 }}>
        {portfolio.isLoaded ? `${portfolio.holdings.length} holdings loaded` : 'Import your portfolio to get started'}
      </p>
    </div>
  )
}