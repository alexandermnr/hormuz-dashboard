import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const INDICES = [
  {
    short: 'HORMUZ',
    full: 'Strait of Hormuz Disruption Index',
    live: true,
    path: '/hormuz',
    launch: null,
  },
  {
    short: 'RED SEA',
    full: 'Red Sea-Suez Corridor Index',
    live: false,
    path: '/red-sea',
    launch: 'Q3 2026',
  },
  {
    short: 'SEMICONDUCTORS',
    full: 'Semiconductor Supply Chain Stress Index',
    live: false,
    path: '/semiconductors',
    launch: 'Q4 2026',
  },
  {
    short: 'FOOD SUPPLY',
    full: 'Global Food Supply Chain Cascade Index',
    live: false,
    path: '/food-supply',
    launch: 'Q4 2026',
  },
]

const TIERS_PREVIEW = [
  { name: 'SIGNAL', price: '$49/mo', desc: 'Daily intelligence brief, HNI score, velocity alerts', live: true },
  { name: 'MONITOR', price: '$199/mo', desc: 'Full dashboard access, 5-layer breakdown, Telegram alerts', live: true },
  { name: 'ANALYST', price: '$999/mo', desc: 'Monthly analyst call, PDF reports, priority response', live: false },
  { name: 'TERMINAL', price: '$5,000+', desc: 'Custom backtests, API access, bespoke SLA, multi-seat', live: false },
]

function PublicHeader() {
  return (
    <header className="border-b border-navy-mid">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-gold font-mono text-sm uppercase tracking-[0.25em] font-bold hover:text-gold/80">
          GRIT TERMINAL
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/methodology" className="text-gray-400 font-mono text-[10px] uppercase tracking-wider hover:text-white hidden sm:block">
            Methodology
          </Link>
          <Link to="/pricing" className="text-gray-400 font-mono text-[10px] uppercase tracking-wider hover:text-white hidden sm:block">
            Pricing
          </Link>
          <Link to="/accuracy" className="text-gray-400 font-mono text-[10px] uppercase tracking-wider hover:text-white hidden sm:block">
            Accuracy
          </Link>
          <Link
            to="/app"
            className="border border-gold text-gold font-mono text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-gold/10"
          >
            LOGIN
          </Link>
        </nav>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-navy-mid mt-20">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 font-mono text-[10px]">GRIT TERMINAL &copy; 2026</p>
        <p className="text-gray-600 font-mono text-[10px] text-center">
          Data Intelligence for Audit Support | Not Investment Advice
        </p>
        <div className="flex gap-4">
          <Link to="/methodology" className="text-gray-500 font-mono text-[10px] hover:text-white">Methodology</Link>
          <Link to="/pricing" className="text-gray-500 font-mono text-[10px] hover:text-white">Pricing</Link>
          <Link to="/terms" className="text-gray-500 font-mono text-[10px] hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  )
}

function IndexCard({ index, hniScore }) {
  const [email, setEmail] = useState('')
  const [notifyState, setNotifyState] = useState('idle')
  const [expanded, setExpanded] = useState(false)

  async function handleNotify() {
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
    setNotifyState('sending')
    try {
      const { error } = await supabase.from('email_captures').insert({
        email: trimmed,
        source: 'landing_notify',
        index_interest: index.short,
      })
      setNotifyState(error ? 'error' : 'success')
    } catch {
      setNotifyState('error')
    }
  }

  return (
    <div className="border border-navy-mid p-6 flex flex-col">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gold font-mono text-xs uppercase tracking-[0.2em] font-bold">
          {index.short}
        </span>
        {index.live ? (
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            LIVE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-gold">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            COMING SOON
          </span>
        )}
      </div>

      {/* Full name */}
      <h3 className="text-white font-mono text-sm mb-4 leading-snug">{index.full}</h3>

      {/* Score or launch date */}
      {index.live && hniScore != null ? (
        <div className="mb-4">
          <span className="text-gold font-mono text-4xl font-bold">{Math.round(hniScore)}</span>
          <span className="text-gray-400 font-mono text-xs ml-2">/ 100</span>
        </div>
      ) : !index.live ? (
        <p className="text-gray-500 font-mono text-xs mb-4">
          Estimated launch: {index.launch}
        </p>
      ) : null}

      {/* CTA */}
      <div className="mt-auto">
        {index.live ? (
          <Link
            to={index.path}
            className="block w-full text-center border border-gold text-gold font-mono text-[10px] uppercase tracking-wider py-2.5 hover:bg-gold/10"
          >
            VIEW INDEX &rarr;
          </Link>
        ) : (
          <>
            {notifyState === 'success' ? (
              <p className="text-emerald-400 font-mono text-[10px] text-center py-2.5">
                &#10003; You'll be notified when {index.short} goes live.
              </p>
            ) : expanded ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNotify()}
                  placeholder="you@example.com"
                  className="flex-1 bg-navy border border-navy-mid text-white font-mono text-[10px] px-3 py-2.5 focus:border-gold focus:outline-none"
                />
                <button
                  onClick={handleNotify}
                  disabled={notifyState === 'sending'}
                  className="border border-gold text-gold font-mono text-[10px] uppercase tracking-wider px-3 py-2.5 hover:bg-gold/10 disabled:opacity-50"
                >
                  {notifyState === 'sending' ? '...' : 'SEND'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="w-full border border-gold text-gold font-mono text-[10px] uppercase tracking-wider py-2.5 hover:bg-gold/10"
              >
                NOTIFY ME &rarr;
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function GritTerminalLanding() {
  const [hniScore, setHniScore] = useState(null)

  useEffect(() => {
    async function fetchScore() {
      const { data } = await supabase
        .from('hni_scores')
        .select('composite_hni')
        .order('score_date', { ascending: false })
        .limit(1)
      if (data?.[0]) setHniScore(data[0].composite_hni)
    }
    fetchScore()
  }, [])

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <PublicHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-white font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight mb-4">
          Geopolitical Risk Intelligence, Quantified
        </h1>
        <p className="text-gray-400 font-mono text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          Real-time composite indices tracking the world's critical chokepoints,
          supply chains, and conflict corridors.
        </p>
      </section>

      {/* Index Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDICES.map((idx) => (
            <IndexCard key={idx.short} index={idx} hniScore={idx.live ? hniScore : null} />
          ))}
        </div>
      </section>

      {/* Methodology Strip */}
      <section className="bg-navy-light border-y border-navy-mid">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-white font-mono text-sm font-bold mb-2">Signal Collection</p>
              <p className="text-gray-400 font-mono text-[10px] leading-relaxed">
                Automated agents extract data from insurance underwriters, maritime AIS feeds,
                IAEA reports, sovereign CDS spreads, and energy futures — every 6 hours.
              </p>
            </div>
            <div className="text-center">
              <p className="text-white font-mono text-sm font-bold mb-2">Composite Scoring</p>
              <p className="text-gray-400 font-mono text-[10px] leading-relaxed">
                Weighted 5-layer model normalizes raw signals into a single 0-100 composite score.
                Each layer's contribution is transparent and auditable.
              </p>
            </div>
            <div className="text-center">
              <p className="text-white font-mono text-sm font-bold mb-2">Daily Intelligence</p>
              <p className="text-gray-400 font-mono text-[10px] leading-relaxed">
                Subscribers receive daily briefs explaining what moved, which layer drove it,
                and how signals are trending relative to their historical baselines.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/methodology" className="text-gold font-mono text-[10px] uppercase tracking-wider hover:text-gold/80">
              READ FULL METHODOLOGY &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-8 text-center">
          Access Tiers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS_PREVIEW.map((tier) => (
            <div key={tier.name} className="border border-navy-mid p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-mono text-sm font-bold">{tier.name}</p>
                {!tier.live && (
                  <span className="text-gold font-mono text-[9px] uppercase tracking-wider border border-gold px-1.5 py-0.5">
                    COMING SOON
                  </span>
                )}
              </div>
              <p className="text-gold font-mono text-lg font-bold mb-2">{tier.price}</p>
              <p className="text-gray-400 font-mono text-[10px] leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/pricing" className="text-gold font-mono text-[10px] uppercase tracking-wider hover:text-gold/80">
            VIEW FULL PRICING &rarr;
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export { PublicHeader, PublicFooter }
