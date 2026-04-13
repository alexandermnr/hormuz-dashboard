import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PublicHeader, PublicFooter } from './GritTerminalLanding'

const LAYERS = [
  { key: 'L1', name: 'Conflict Events', weight: '20%',
    desc: 'Regional conflict escalation signals, Houthi attack event tracking, UKMTO and MARAD maritime advisory monitoring.' },
  { key: 'L2', name: 'Maritime', weight: '25%',
    desc: 'Bab-el-Mandeb vessel transit calls, Red Sea port activity, and maritime traffic density monitoring.' },
  { key: 'L3', name: 'Energy & Commodity Markets', weight: '30%',
    desc: 'Brent-Dubai spread, Red Sea LNG premium, and Cape of Good Hope rerouting proxy signals.' },
  { key: 'L5', name: 'Insurance & War Risk', weight: '20%',
    desc: 'Red Sea war risk premium movements, JWC listed area status, and P&I club advisory signals.' },
]

const FEATURES = [
  { title: 'Daily RSBI Score', desc: 'Composite 0-100 score with status classification updated every 6 hours.' },
  { title: 'Signal Layer Breakdown', desc: 'See which signal layers drove today\'s score and how each moved.' },
  { title: 'Velocity Alerts', desc: 'Real-time Telegram notification on significant composite moves within 24 hours.' },
]

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
  const scores = data.map(d => d.composite_score).filter(v => v != null)
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
      {scores.length > 0 && (() => {
        const lastX = w
        const lastY = h - ((scores[scores.length - 1] - min) / range) * (h - 10) - 5
        return <circle cx={lastX} cy={lastY} r="3" fill="#c9a84c" />
      })()}
    </svg>
  )
}

function VelocityIndicator({ velocity }) {
  if (velocity == null) return null
  if (velocity > 3) {
    return <span className="font-mono text-lg" style={{ color: '#C0392B' }}>{'\u25B2'} +{velocity.toFixed(1)}</span>
  }
  if (velocity < -3) {
    return <span className="font-mono text-lg" style={{ color: '#1A6B3C' }}>{'\u25BC'} {velocity.toFixed(1)}</span>
  }
  return <span className="font-mono text-sm text-gray-500">{velocity > 0 ? '+' : ''}{velocity.toFixed(1)}</span>
}

export default function RedSeaLanding() {
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [isCalibration, setIsCalibration] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [latestRes, historyRes] = await Promise.all([
        supabase
          .from('rsbi_scores')
          .select('*')
          .order('score_date', { ascending: false })
          .limit(1),
        supabase
          .from('rsbi_scores')
          .select('score_date, composite_score')
          .order('score_date', { ascending: false })
          .limit(7),
      ])
      if (latestRes.data?.[0]) {
        setLatest(latestRes.data[0])
        const dq = latestRes.data[0].data_quality
        if (dq === 'CALIBRATION' || dq === 'CORRUPTED') {
          setIsCalibration(true)
        }
      }
      if (historyRes.data) setHistory(historyRes.data.reverse())

      const configRes = await supabase
        .from('platform_config')
        .select('rsbi_calibration_active')
        .limit(1)
      if (configRes.data?.[0]?.rsbi_calibration_active != null) {
        setIsCalibration(configRes.data[0].rsbi_calibration_active)
      }
    }
    fetchData()
  }, [])

  const score = latest?.composite_score
  const statusLabel = latest?.status_label || 'NO DATA'

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <PublicHeader />

      {isCalibration && (
        <div style={{ background: '#FFA500', padding: '8px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
          RSBI CALIBRATION PERIOD — April 7–20, 2026. Scores are live but pre-commercial. Clean data period begins April 21, 2026.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider">
          <Link to="/" className="hover:text-white">GRIT TERMINAL</Link>
          <span className="mx-2">/</span>
          <span className="text-gold">RED SEA</span>
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="flex-1">
            <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
              Red Sea Burden Index
            </p>
            {score != null ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-6xl font-bold" style={{ color: getStatusColor(score) }}>
                    {Math.round(score)}
                  </span>
                  <span className="text-gray-500 font-mono text-sm">/ 100</span>
                  <VelocityIndicator velocity={latest?.velocity_24h} />
                </div>
                <p className="font-mono text-sm font-bold uppercase tracking-wider mb-2"
                   style={{ color: getStatusColor(score) }}>
                  {statusLabel}
                </p>
                <p className="text-gray-500 font-mono text-[10px]">
                  Last updated: {latest?.score_date || '\u2014'}
                </p>
              </>
            ) : (
              <p className="text-gray-500 font-mono text-sm">Loading score...</p>
            )}
          </div>

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

      <section className="bg-navy-light border-y border-navy-mid">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
            Signal Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAYERS.map((layer) => (
              <div key={layer.name} className="border border-navy-mid p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-mono text-[10px]">{layer.key}</span>
                  <span className="text-gold font-mono text-[10px] uppercase tracking-wider">
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

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-6">
          What This Index Tracks
        </h2>
        <div className="max-w-3xl">
          <p className="text-gray-300 font-mono text-xs leading-relaxed">
            The Red Sea / Bab-el-Mandeb corridor handles approximately 12-15% of global trade
            and is a critical chokepoint for East-West maritime commerce. Sustained disruption
            forces rerouting around the Cape of Good Hope, adding 10-14 days to transit times
            and significantly increasing freight and insurance costs. This index synthesizes
            insurance underwriter data, maritime surveillance, geopolitical signals, and
            energy market positioning into a single composite score tracking disruption risk.
          </p>
        </div>
      </section>

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

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
          Access Red Sea Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="border border-navy-mid p-6">
            <p className="text-white font-mono text-sm font-bold mb-1">SIGNAL</p>
            <p className="text-gold font-mono text-2xl font-bold mb-3">$49<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            <ul className="space-y-1.5 mb-5">
              {['Daily RSBI score + velocity', 'Full intelligence brief (300+ words)', 'Signal anomaly email alerts', 'Weekly signal summary'].map(f => (
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
          <div className="border border-gold p-6">
            <p className="text-gold font-mono text-[10px] uppercase tracking-wider mb-1">Most Popular</p>
            <p className="text-white font-mono text-sm font-bold mb-1">MONITOR</p>
            <p className="text-gold font-mono text-2xl font-bold mb-3">$199<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            <ul className="space-y-1.5 mb-5">
              {['Everything in Signal', 'Full signal layer dashboard', 'Layer-by-layer breakdown', 'Historical score chart', 'Telegram CRITICAL alerts', 'Insurance signal detail'].map(f => (
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
