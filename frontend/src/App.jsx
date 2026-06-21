import { useState } from 'react'
import Header from './components/layout/Header.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Overview    from './pages/Overview.jsx'
import Holdings    from './pages/Holdings.jsx'
import Technicals  from './pages/Technicals.jsx'
import Risk        from './pages/Risk.jsx'
import TaxElss     from './pages/TaxElss.jsx'
import SipPlanner  from './pages/SipPlanner.jsx'
import Benchmark   from './pages/Benchmark.jsx'
import AIAdvisor   from './pages/AIAdvisor.jsx'

export const TABS = [
  { id: 'overview',   label: 'Overview',    icon: '📊' },
  { id: 'holdings',   label: 'Holdings',    icon: '💼' },
  { id: 'technicals', label: 'Technicals',  icon: '📈' },
  { id: 'risk',       label: 'Risk',        icon: '🛡' },
  { id: 'tax',        label: 'Tax & ELSS',  icon: '🧾' },
  { id: 'sip',        label: 'SIP Planner', icon: '🎯' },
  { id: 'benchmark',  label: 'Benchmark',   icon: '⚖' },
  { id: 'ai',         label: 'AI Advisor',  icon: '🤖' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const [portfolio, setPortfolio] = useState({
    holdings: [],
    isLoaded: false,
    source: null,
  })

  const [showImport, setShowImport] = useState(false)

  const pageProps = { portfolio, setPortfolio, setActiveTab }
  const PAGE_MAP = {
    overview:    <Overview    {...pageProps} onImport={() => setShowImport(true)} />,
    holdings:    <Holdings    {...pageProps} />,
    technicals:  <Technicals  {...pageProps} />,
    risk:        <Risk        {...pageProps} />,
    tax:         <TaxElss     {...pageProps} />,
    sip:         <SipPlanner  {...pageProps} />,
    benchmark:   <Benchmark   {...pageProps} />,
    ai:          <AIAdvisor   {...pageProps} />,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0,198,255,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(192,132,252,0.05) 0%, transparent 60%)
        `,
        zIndex: 0,
      }} />

      <div className="relative" style={{ zIndex: 1 }}>
        <Header portfolio={portfolio} onImport={() => setShowImport(true)} />
        <Navbar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mx-auto px-6 py-6" style={{ maxWidth: 1300 }}>
          {PAGE_MAP[activeTab]}
        </main>
      </div>

      {showImport && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(8px)' }}
          onClick={() => setShowImport(false)}
        >
          <div className="glass-card p-8 text-center" style={{ width: 440 }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 40 }}>📥</p>
            <h2 className="mt-4 font-bold text-lg">Import Portfolio</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 13, marginTop: 8 }}>
              Import module coming in Phase 2.
            </p>
            <button
              onClick={() => setShowImport(false)}
              className="mt-6 px-6 py-2 rounded-btn text-sm font-semibold"
              style={{ background: 'var(--grad-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}