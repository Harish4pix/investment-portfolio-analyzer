import { useLivePrices } from './hooks/useLivePrices.js'
import { enrichHoldings } from './utils/portfolioCalc.js'
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
import ImportModal from './components/ImportModal.jsx'

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
  // handleImport — called by ImportModal once parsing succeeds
  const { refresh: refreshPrices, loading: pricesLoading } = useLivePrices()

  const handleImport = async (enrichedHoldings, source) => {
    // Show the holdings immediately with CSV/manual prices first —
    // don't make the user wait for the network call to see anything.
    setPortfolio({
      holdings: enrichedHoldings,
      isLoaded: true,
      source,
    })
    setShowImport(false)

    // Then fetch live prices in the background and update once ready
    const tickers = enrichedHoldings.map((h) => h.ticker)
    const priceMap = await refreshPrices(tickers)

    // Merge live prices into holdings, then re-run enrichment
    // so invested/current/gain/ROI all reflect the NEW live price.
    const updatedRaw = enrichedHoldings.map((h) => ({
      ...h,
      ltp: priceMap[h.ticker]?.ltp ?? h.ltp,   // fallback to old price if fetch failed
    }))
    const reEnriched = enrichHoldings(updatedRaw)

    setPortfolio({
      holdings: reEnriched,
      isLoaded: true,
      source,
    })
  }

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
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  )
}