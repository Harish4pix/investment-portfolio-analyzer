import { LayoutGrid, Briefcase, TrendingUp, Shield, Receipt, Target, Scale, Bot } from 'lucide-react'

const ICONS = {
  overview: LayoutGrid,
  holdings: Briefcase,
  technicals: TrendingUp,
  risk: Shield,
  tax: Receipt,
  sip: Target,
  benchmark: Scale,
  ai: Bot,
}

export default function Navbar({ tabs, activeTab, setActiveTab }) {
  return (
    <nav style={{
      background: '#0a0d14',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 28px',
      display: 'flex',
      gap: 2,
      overflowX: 'auto',
    }}>
      {tabs.map(tab => {
        const Icon = ICONS[tab.id]
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'none',
              border: 'none',
              borderBottom: active ? '2px solid #1565c0' : '2px solid transparent',
              padding: '13px 16px',
              color: active ? '#e8edf5' : '#5b6b85',
              cursor: 'pointer',
              fontSize: 14.5,
              fontWeight: active ? 600 : 500,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#9aa8c0' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#5b6b85' }}
          >
            <Icon size={17} strokeWidth={2.2} />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}