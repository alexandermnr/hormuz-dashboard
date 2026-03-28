import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PublicHeader, PublicFooter } from './GritTerminalLanding'

const LAYERS = [
  { name: 'Diplomatic', weight: '35%', desc: 'IAEA board reports, sanctions activity, rial black market deviation, diplomatic flight patterns.' },
  { name: 'Maritime', weight: '10%', desc: 'Strait of Hormuz vessel density, VLCC AG-East freight rates, AIS anomaly detection.' },
  { name: 'Energy', weight: '35%', desc: 'OVX volatility index, Brent-Dubai spread, CFTC net speculative positioning.' },
  { name: 'Insurance', weight: '15%', desc: 'Lloyd\'s JWC listed area status, Persian Gulf war risk premium movements.' },
  { name: 'Credit', weight: 'Under verification', desc: 'Gulf sovereign CDS spreads. Excluded from current composite pending second-source confirmation.' },
]

const FEATURES = [
  { title: 'Daily HNI Score', desc: 'Composite 0-100 score with status classification updated every 6 hours.' },
  { title: 'Signal Layer Breakdown', desc: 'See which of the 5 signal layers drove today\'s score and how each moved.' },
  { title: 'Velocity Alerts', desc: 'Real-time Telegram notification on 15-point composite moves within 24 hours.' },
]

function getStatusLabel(score) {
  if (score == null) return 'NO DATA'
  if (score >= 85) return 'EXTREME'
  if (score >= 75) return 'CRITICAL'
  if (score >= 60) return 'HIGH TENSION'
  if (score >= 40) return 'ELEVATED RISK'
  return 'LOW RISK'
}

function getStatusColor(score) {
  if (score == null) return '#888'
  if (score >= 85) return '#7f1d1d'
  if (score >= 75) return '#e53e3e'
  if (score >= 60) return '#dd6b20'
  if (score >= 40) return '#c9a84c'
  return '#48bb78'
}

function MiniSparkline({ data }) {
  if (!data || data.length < 2) return null
  const scores = data.map(d => d.composite_hni).filter(v => v != null)
  if (scores.length < 2) return null
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min || 1
  const w = 200
  const h = 60
  const points = scores.map((v, i) => {
    const x = (i / (scores.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 10) - 5
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke="#c9a84c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Latest point dot */}
      {scores.length > 0 && (() => {
        const lastX = w
        const lastY = h - ((scores[scores.length - 1] - min) / range) * (h - 10) - 5
        return <circle cx={lastX} cy={lastY} r="3" fill="#c9a84c" />
      })()}
    </svg>
  )
}

export default function HormuzLanding() {
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    async function fetchData() {
      const [latestRes, historyRes] = await Promise.all([
        supabase
          .from('hni_scores')
          .select('*')
          .order('score_date', { ascending: false })
          .limit(1),
        supabase
          .from('hni_scores')
          .select('score_date, composite_hni')
          .order('score_date', { ascending: false })
          .limit(7),
      ])
      if (latestRes.data?.[0]) setLatest(latestRes.data[0])
      if (historyRes.data) setHistory(historyRes.data.reverse())
    }
    fetchData()
  }, [])

  const score = latest?.composite_hni != null
    ? latest.composite_hni
    : latest
      ? Math.round(
          ((latest.layer1_score || 0) * 0.35 +
           (latest.layer2_score || 0) * 0.10 +
           (latest.layer3_score || 0) * 0.35 +
           (latest.layer4_score || 0) * 0.05 +
           (latest.layer5_score || 0) * 0.15) * 100
        ) / 100
      : null

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <PublicHeader />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider">
          <Link to="/" className="hover:text-white">GRIT TERMINAL</Link>
          <span className="mx-2">/</span>
          <span className="text-gold">HORMUZ</span>
        </p>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Left — Score */}
          <div className="flex-1">
            <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
              Strait of Hormuz Disruption Index
            </p>
            {score != null ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-6xl font-bold" style={{ color: getStatusColor(score) }}>
                    {Math.round(score)}
                  </span>
                  <span className="text-gray-500 font-mono text-sm">/ 100</span>
                </div>
                <p className="font-mono text-sm font-bold uppercase tracking-wider mb-2"
                   style={{ color: getStatusColor(score) }}>
                  {getStatusLabel(score)}
                </p>
                <p className="text-gray-500 font-mono text-[10px]">
                  Last updated: {latest?.score_date || '—'}
                </p>
              </>
            ) : (
              <p className="text-gray-500 font-mono text-sm">Loading score...</p>
            )}
          </div>

          {/* Right — Sparkline */}
          <div className="flex-shrink-0">
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-2">
              7-Day Trend
            </p>
            <MiniSparkline data={history} />
            <div className="flex justify-between mt-1">
              <span className="text-gray-600 font-mono text-[9px]">
                {history[0]?.score_date || ''}
              </span>
              <span className="text-gray-600 font-mono text-[9px]">
                {history[history.length - 1]?.score_date || ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Layer Summary */}
      <section className="bg-navy-light border-y border-navy-mid">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
            Signal Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {LAYERS.map((layer, i) => (
              <div key={layer.name} className="border border-navy-mid p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-mono text-[10px]">Layer {i + 1}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${
                    layer.weight === 'Under verification' ? 'text-gray-600' : 'text-gold'
                  }`}>
                    {layer.weight}
                  </span>
                </div>
                <p className="text-white font-mono text-sm font-bold mb-2">{layer.name}</p>
                <p className="text-gray-400 font-mono text-[10px] leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What This Index Tracks */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-6">
          What This Index Tracks
        </h2>
        <div className="max-w-3xl">
          <p className="text-gray-300 font-mono text-xs leading-relaxed">
            The Strait of Hormuz carries approximately 20% of the world's daily oil supply
            and handles one-fifth of global LNG trade. A sustained closure would remove
            17-18 million barrels per day from global markets. This index synthesizes
            insurance underwriter data, maritime surveillance, diplomatic signals, and
            energy market positioning into a single composite score that has historically
            moved 3-5 weeks before stress events reach mainstream markets.
          </p>
        </div>
      </section>

      {/* What Subscribers Receive */}
      <section className="bg-navy-light border-y border-navy-mid">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
            What Subscribers Receive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="border border-navy-mid p-5">
                <p className="text-white font-mono text-sm font-bold mb-2">{feat.title}</p>
                <p className="text-gray-400 font-mono text-[10px] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
          Access Hormuz Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Signal tier */}
          <div className="border border-navy-mid p-6">
            <p className="text-white font-mono text-sm font-bold mb-1">SIGNAL</p>
            <p className="text-gold font-mono text-2xl font-bold mb-3">$49<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            <ul className="space-y-1.5 mb-5">
              {['Daily HNI score + velocity', 'Full intelligence brief (300+ words)', 'Signal anomaly email alerts', 'Weekly signal summary'].map(f => (
                <li key={f} className="flex gap-2">
                  <span className="text-gold font-mono text-xs">&#10003;</span>
                  <span className="text-gray-300 font-mono text-[10px]">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="block w-full text-center bg-gold text-navy font-mono text-[10px] uppercase tracking-wider py-2.5 font-bold hover:bg-gold/90">
              SUBSCRIBE
            </Link>
          </div>
          {/* Monitor tier */}
          <div className="border border-gold p-6">
            <p className="text-gold font-mono text-[10px] uppercase tracking-wider mb-1">Most Popular</p>
            <p className="text-white font-mono text-sm font-bold mb-1">MONITOR</p>
            <p className="text-gold font-mono text-2xl font-bold mb-3">$199<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            <ul className="space-y-1.5 mb-5">
              {['Everything in Signal', 'Full 5-layer dashboard', 'Layer-by-layer breakdown', 'Historical score chart', 'Telegram CRITICAL alerts', 'Insurance signal detail (Layer 5)'].map(f => (
                <li key={f} className="flex gap-2">
                  <span className="text-gold font-mono text-xs">&#10003;</span>
                  <span className="text-gray-300 font-mono text-[10px]">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="block w-full text-center bg-gold text-navy font-mono text-[10px] uppercase tracking-wider py-2.5 font-bold hover:bg-gold/90">
              SUBSCRIBE
            </Link>
          </div>
        </div>
        <p className="text-gray-500 font-mono text-[10px] text-center mt-4">
          ANALYST and TERMINAL tiers — COMING SOON
        </p>
        <p className="text-gray-600 font-mono text-[10px] text-center mt-2">
          Secure checkout via Stripe — launching April 2026
        </p>
      </section>

      <PublicFooter />
    </div>
  )
}
