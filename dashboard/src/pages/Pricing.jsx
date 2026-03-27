import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const TIERS = [
  {
    name: 'Signal Brief',
    monthly: 49,
    annual: 39,
    annualTotal: 468,
    description: 'Daily intelligence in your inbox. The score plus the story behind it.',
    featured: false,
    enterprise: false,
    included: [
      'Daily HNI score',
      'Velocity direction (\u2191\u2193)',
      'Primary driver sentence',
      'Full daily intelligence brief (300+ words)',
      'Signal anomaly alerts via email',
      'Weekly signal summary',
    ],
    excluded: [
      'Dashboard access',
      'Layer-by-layer breakdown',
      'Telegram CRITICAL alerts',
      'Monthly analyst call',
    ],
    cta: 'Subscribe',
  },
  {
    name: 'Dashboard',
    monthly: 199,
    annual: 166,
    annualTotal: 1992,
    description: 'Full platform access. See every signal layer, every day.',
    featured: true,
    enterprise: false,
    included: [
      'Everything in Signal Brief',
      'Full 5-layer dashboard',
      'Layer-by-layer score breakdown',
      'Historical score chart',
      'Staleness and data gap alerts',
      'Telegram CRITICAL alerts',
      'Insurance signal detail (Layer 5)',
    ],
    excluded: [
      'Monthly analyst call',
      'PDF reports',
      'Custom backtest reports',
    ],
    cta: 'Subscribe',
  },
  {
    name: 'Analyst',
    monthly: 999,
    annual: 833,
    annualTotal: 9996,
    description: 'For risk teams and portfolio managers who need direct access.',
    featured: false,
    enterprise: false,
    comingSoon: true,
    included: [
      'Everything in Dashboard',
      'Monthly 30-min analyst call',
      'Monthly PDF risk report',
      'Signal interpretation notes',
      'Early anomaly notification',
      'Priority email response',
      'Kalshi market positioning data',
    ],
    excluded: [
      'Custom backtest reports',
      'Bespoke SLA',
    ],
    cta: 'Subscribe',
  },
  {
    name: 'Enterprise',
    monthly: null,
    annual: null,
    annualTotal: null,
    description: 'Bespoke deliverables, SLA guarantees, and direct wire invoicing.',
    featured: false,
    enterprise: true,
    comingSoon: true,
    included: [
      'Everything in Analyst',
      'Custom backtest reports ($7,500\u2013$15,000 each)',
      'Dedicated intelligence brief',
      'Named SLA with response time',
      'API data access',
      'Multi-seat dashboard access',
      'Invoice / wire payment',
      'GRIT Terminal early access',
    ],
    excluded: [],
    cta: 'Contact for pricing',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState('idle')

  async function handleWaitlist() {
    const trimmed = waitlistEmail.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
    setWaitlistStatus('sending')
    try {
      const { error } = await supabase.from('email_captures').insert({
        email: trimmed,
        source: 'pricing_waitlist',
        index_interest: 'ANALYST_WAITLIST',
      })
      setWaitlistStatus(error ? 'error' : 'success')
    } catch {
      setWaitlistStatus('error')
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">Subscriber Access</p>
        <h1 className="text-white font-mono text-xl font-bold mb-2">
          Intelligence that moves before markets do
        </h1>
        <p className="text-white font-mono text-xs leading-relaxed max-w-2xl">
          Every tier built on the same 5-signal methodology. Insurance underwriter data
          3&#8211;5 weeks ahead of news. Higher tiers add depth, access, and direct analyst time.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAnnual(false)}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border ${
            !annual ? 'border-gold text-gold' : 'border-gray-700 text-gray-500'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border ${
            annual ? 'border-gold text-gold' : 'border-gray-700 text-gray-500'
          }`}
        >
          Annual
        </button>
        {annual && (
          <span className="font-mono text-[10px] text-gold uppercase tracking-wider">
            Save $120/year
          </span>
        )}
      </div>

      {/* Free Band */}
      <div className="border border-gray-700 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-white font-mono text-sm font-bold">Public &#8212; Free forever</p>
          <p className="text-white font-mono text-[10px] mt-1">
            Daily HNI score only. No brief, no signal breakdown, no velocity data.
          </p>
        </div>
        <p className="text-white font-mono text-[10px] uppercase tracking-wider">No signup required</p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`border p-5 flex flex-col ${
              tier.featured ? 'border-gold' : 'border-gray-700'
            }`}
          >
            {/* Badge */}
            {tier.comingSoon && (
              <p className="text-amber-400 font-mono text-[10px] uppercase tracking-wider mb-2 border border-amber-400/50 inline-block px-2 py-0.5">
                COMING SOON
              </p>
            )}
            {tier.featured && !tier.comingSoon && (
              <p className="text-gold font-mono text-[10px] uppercase tracking-wider mb-2">
                Most Popular
              </p>
            )}

            {/* Name + Price */}
            <h3 className="text-white font-mono text-sm font-bold">{tier.name}</h3>
            <div className="mt-2 mb-3">
              {tier.enterprise ? (
                <p className="text-gold font-mono text-2xl font-bold">Custom</p>
              ) : (
                <>
                  <p className="text-gold font-mono text-2xl font-bold">
                    ${annual ? tier.annual : tier.monthly}
                    <span className="text-xs font-normal text-white">/mo</span>
                  </p>
                  {annual && (
                    <p className="text-white font-mono text-[10px]">
                      billed as ${tier.annualTotal?.toLocaleString()}/year
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-white font-mono text-[10px] leading-relaxed mb-4">
              {tier.description}
            </p>

            {/* Included */}
            <div className="flex-1 space-y-1.5 mb-4">
              {tier.included.map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="text-gold font-mono text-xs">{'\u2713'}</span>
                  <span className="text-white font-mono text-[10px]">{item}</span>
                </div>
              ))}
              {tier.excluded.map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="text-gray-600 font-mono text-xs">{'\u2717'}</span>
                  <span className="text-gray-600 font-mono text-[10px]">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className={`w-full py-2.5 font-mono text-xs uppercase tracking-wider border ${
                tier.featured
                  ? 'bg-gold text-navy border-gold font-bold hover:bg-gold/90'
                  : tier.enterprise
                    ? 'border-gray-600 text-gray-400'
                    : 'border-gold text-gold hover:bg-gold/10'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Waitlist for Analyst/Terminal */}
      <div className="border border-navy-mid p-6 mt-2">
        <p className="text-white font-mono text-xs mb-2">
          Analyst and Terminal tiers launch with multi-index coverage. Join the waitlist.
        </p>
        {waitlistStatus === 'success' ? (
          <p className="text-emerald-400 font-mono text-[10px]">&#10003; You're on the waitlist.</p>
        ) : (
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
              placeholder="you@example.com"
              className="flex-1 bg-navy border border-navy-mid text-white font-mono text-[10px] px-3 py-2 focus:border-gold focus:outline-none"
            />
            <button
              onClick={handleWaitlist}
              disabled={waitlistStatus === 'sending'}
              className="border border-gold text-gold font-mono text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-gold/10 disabled:opacity-50"
            >
              {waitlistStatus === 'sending' ? '...' : 'JOIN WAITLIST'}
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-white font-mono text-[10px] leading-relaxed pt-4">
        All tiers provide data intelligence for informational purposes only.
        Not a prediction, recommendation, or financial advice.
        Elite Forensic Group.
      </p>
    </div>
  )
}
