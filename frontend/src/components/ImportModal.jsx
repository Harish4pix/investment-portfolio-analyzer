// components/ImportModal.jsx
//
// The modal that lets users bring their portfolio into the app.
// Three ways in:
//   1. Upload a Kite CSV file
//   2. Upload a Groww CSV file
//   3. Add a holding manually (one at a time)

import { useState, useRef } from 'react'
import { X, Upload, FileSpreadsheet, PlusCircle } from 'lucide-react'
import { parseKiteCSV, parseGrowwCSV, KITE_SAMPLE_CSV, GROWW_SAMPLE_CSV } from '../utils/csvParser.js'
import { enrichHoldings } from '../utils/portfolioCalc.js'

export default function ImportModal({ onClose, onImport }) {
  // mode controls which of the 3 import methods is shown
  const [mode, setMode] = useState('kite')   // 'kite' | 'groww' | 'manual'
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  // ── Manual entry form state ──────────────────────────────────
  const [form, setForm] = useState({
    ticker: '', name: '', type: 'Stock',
    qty: '', avgPrice: '', ltp: '', sector: '',
  })
  const [manualHoldings, setManualHoldings] = useState([])

  // ── File upload handler ──────────────────────────────────────
  const handleFile = (file) => {
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const parsed = mode === 'kite' ? parseKiteCSV(text) : parseGrowwCSV(text)

        if (!parsed.length) {
          setError('No valid holdings found in this file. Please check the format.')
          return
        }
        const enriched = enrichHoldings(parsed)
        onImport(enriched, mode)
      } catch (err) {
        setError('Could not parse this file. Please check it matches the expected format.')
      }
    }
    reader.readAsText(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  // ── Manual entry handlers ────────────────────────────────────
  const addManualRow = () => {
    if (!form.ticker || !form.qty || !form.avgPrice) {
      setError('Ticker, Quantity, and Average Price are required.')
      return
    }
    setError('')
    setManualHoldings((prev) => [
      ...prev,
      {
        ticker: form.ticker.toUpperCase(),
        name: form.name || form.ticker,
        type: form.type,
        qty: parseFloat(form.qty),
        avgPrice: parseFloat(form.avgPrice),
        ltp: parseFloat(form.ltp) || parseFloat(form.avgPrice),
        sector: form.sector || 'Other',
        exchange: form.type === 'MF' ? 'AMFI' : 'NSE',
      },
    ])
    setForm({ ticker: '', name: '', type: 'Stock', qty: '', avgPrice: '', ltp: '', sector: '' })
  }

  const removeManualRow = (idx) => {
    setManualHoldings((prev) => prev.filter((_, i) => i !== idx))
  }

  const finishManualEntry = () => {
    if (!manualHoldings.length) {
      setError('Add at least one holding before continuing.')
      return
    }
    const enriched = enrichHoldings(manualHoldings)
    onImport(enriched, 'manual')
  }

  // ── Demo data loader ─────────────────────────────────────────
  const loadDemo = () => {
    const demoRaw = parseKiteCSV(KITE_SAMPLE_CSV)
    onImport(enrichHoldings(demoRaw), 'demo')
  }

  // ── Shared styles ─────────────────────────────────────────────
  const inputStyle = {
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '8px 11px',
    color: '#e8edf5',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const modeTabStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 6,
    background: active ? 'rgba(21,101,192,0.15)' : 'transparent',
    border: `1px solid ${active ? 'rgba(21,101,192,0.4)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#5b9bd5' : '#7a8aa0',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="animate-fadeUp"
        style={{
          background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, width: 560, maxWidth: '92vw', maxHeight: '85vh',
          overflowY: 'auto', padding: '24px 26px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#e8edf5' }}>Import Portfolio</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8aa0' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button style={modeTabStyle(mode === 'kite')} onClick={() => { setMode('kite'); setError('') }}>
            <FileSpreadsheet size={14} /> Kite CSV
          </button>
          <button style={modeTabStyle(mode === 'groww')} onClick={() => { setMode('groww'); setError('') }}>
            <FileSpreadsheet size={14} /> Groww CSV
          </button>
          <button style={modeTabStyle(mode === 'manual')} onClick={() => { setMode('manual'); setError('') }}>
            <PlusCircle size={14} /> Manual Entry
          </button>
        </div>

        {/* ── CSV Upload UI (Kite or Groww) ── */}
        {(mode === 'kite' || mode === 'groww') && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: '#7a8aa0',
            }}>
              <p style={{ margin: '0 0 5px', fontWeight: 700, color: '#e8edf5' }}>
                Expected columns ({mode === 'kite' ? 'Kite' : 'Groww'}):
              </p>
              <code style={{ color: '#5b9bd5' }}>
                {mode === 'kite' ? 'Instrument, Qty., Avg. cost, LTP' : 'Scheme Name, Units, Average NAV, Current NAV'}
              </code>
              <p style={{ margin: '8px 0 0' }}>
                Export from {mode === 'kite' ? 'Zerodha Console → Holdings → Download CSV' : 'Groww → Portfolio → Export'}
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 8,
                padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(21,101,192,0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
            >
              <Upload size={28} color="#5b6b85" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: 10, fontSize: 13, color: '#e8edf5', fontWeight: 600 }}>
                Click to upload or drag & drop
              </p>
              <p style={{ marginTop: 3, fontSize: 11.5, color: '#5b6b85' }}>CSV files only</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {/* ── Manual Entry UI ── */}
        {mode === 'manual' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 10 }}>
              <input style={inputStyle} placeholder="Ticker (e.g. RELIANCE)" value={form.ticker}
                onChange={(e) => setForm((p) => ({ ...p, ticker: e.target.value }))} />
              <input style={inputStyle} placeholder="Name (optional)" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              <input style={inputStyle} type="number" placeholder="Quantity" value={form.qty}
                onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
              <input style={inputStyle} type="number" placeholder="Avg. Buy Price ₹" value={form.avgPrice}
                onChange={(e) => setForm((p) => ({ ...p, avgPrice: e.target.value }))} />
              <input style={inputStyle} type="number" placeholder="Current Price ₹ (optional)" value={form.ltp}
                onChange={(e) => setForm((p) => ({ ...p, ltp: e.target.value }))} />
              <select style={inputStyle} value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                <option>Stock</option>
                <option>MF</option>
              </select>
            </div>
            <button onClick={addManualRow} style={{
              width: '100%', padding: '9px', borderRadius: 6, marginBottom: 14,
              background: 'rgba(21,101,192,0.12)', border: '1px solid rgba(21,101,192,0.35)',
              color: '#5b9bd5', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              + Add to List
            </button>

            {manualHoldings.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {manualHoldings.map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', background: 'rgba(255,255,255,0.02)',
                    borderRadius: 6, marginBottom: 6, fontSize: 12.5,
                  }}>
                    <span style={{ color: '#e8edf5', fontWeight: 600 }}>{h.ticker}</span>
                    <span style={{ color: '#7a8aa0' }}>{h.qty} units @ ₹{h.avgPrice}</span>
                    <button onClick={() => removeManualRow(i)} style={{
                      background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 12,
                    }}>
                      Remove
                    </button>
                  </div>
                ))}
                <button onClick={finishManualEntry} style={{
                  width: '100%', padding: '10px', borderRadius: 6, marginTop: 8,
                  background: '#1565c0', border: 'none', color: '#fff',
                  fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Import {manualHoldings.length} Holding{manualHoldings.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p style={{ color: '#e74c3c', fontSize: 12.5, marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}

        {/* Demo button — always visible at bottom */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
          <button onClick={loadDemo} style={{
            background: 'none', border: 'none', color: '#5b6b85',
            fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline',
          }}>
            Or load demo portfolio to explore the app
          </button>
        </div>
      </div>
    </div>
  )
}