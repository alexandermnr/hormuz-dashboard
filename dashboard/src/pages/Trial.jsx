import React, { useState } from 'react'

const TIER1_FEATURES = [
  'Daily HNI score + status',
  'Velocity direction (\u2191\u2193)',
  'Primary driver sentence',
  'Full intelligence brief (300+ words)',
  'Signal anomaly alerts',
  'Weekly signal summary',
]

const TIER2_FEATURES = [
  'Everything in Tier 1',
  'Full 5-layer dashboard',
  'Layer-by-layer score breakdown',
  'Historical score chart',
  'Telegram CRITICAL alerts',
  'Insurance signal detail (Layer 5)',
  'Correlated asset watchlist',
]

const SOURCES = ['LinkedIn', 'Email', 'Referral', 'Google', 'Other']

export default function Trial() {
  const [selectedTier, setSelectedTier] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', source: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-gold font-mono text-3xl">&#10003;</div>
          <h1 className="text-white font-mono text-lg font-bold">Trial access granted</h1>
          <p className="text-white font-mono text-xs leading-relaxed">
            Check your email within the next hour for your login details.
            Your 7-day trial starts now.
          </p>
          <p className="text-white font-mono text-[10px] leading-relaxed mt-2">
            (Trial access is sent manually by the HIP team.
            If you don&apos;t receive an email within 2 hours,
            contact alexandermnr@yahoo.com)
          </p>
          <a href="/public" className="inline-block text-gold font-mono text-xs underline hover:text-gold/80 mt-4">
            Return to public score
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">7-Day Free Trial</p>
          <h1 className="text-white font-mono text-xl font-bold mb-2">
            See what HIP subscribers see every day
          </h1>
          <p className="text-white font-mono text-xs leading-relaxed">
            No credit card required. Cancel anytime before day 7.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Tier 1 Card */}
          <div className={`border p-5 flex flex-col ${selectedTier === 1 ? 'border-gold' : 'border-gray-700'}`}>
            <p className="text-white font-mono text-[10px] uppercase tracking-wider mb-1">Tier 1 — Signal Brief</p>
            <p className="text-gold font-mono text-lg font-bold mb-1">Free for 7 days</p>
            <p className="text-white font-mono text-[10px] mb-3">then $49/month</p>
            <p className="text-white font-mono text-[10px] leading-relaxed mb-4">
              Daily intelligence brief delivered to your inbox.
              The score, the driver, and the full analysis.
            </p>
            <div className="flex-1 space-y-1.5 mb-4">
              {TIER1_FEATURES.map((f) => (
                <div key={f} className="flex gap-2">
                  <span className="text-gold font-mono text-xs">&#10003;</span>
                  <span className="text-white font-mono text-[10px]">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedTier(1)}
              className={`w-full py-2.5 font-mono text-xs uppercase tracking-wider border ${
                selectedTier === 1
                  ? 'bg-gold text-navy border-gold font-bold'
                  : 'border-gold text-gold hover:bg-gold/10'
              }`}
            >
              Try Tier 1 Free
            </button>
          </div>

          {/* Tier 2 Card */}
          <div className={`border p-5 flex flex-col ${selectedTier === 2 ? 'border-gold' : 'border-gold/50'}`}>
            <div className="flex justify-between items-start mb-1">
              <p className="text-white font-mono text-[10px] uppercase tracking-wider">Tier 2 — Dashboard</p>
              <span className="text-gold font-mono text-[10px] uppercase tracking-wider">Most Popular</span>
            </div>
            <p className="text-gold font-mono text-lg font-bold mb-1">Free for 7 days</p>
            <p className="text-white font-mono text-[10px] mb-3">then $199/month</p>
            <p className="text-white font-mono text-[10px] leading-relaxed mb-4">
              Full platform access. Every signal layer, every day.
              Telegram CRITICAL alerts.
            </p>
            <div className="flex-1 space-y-1.5 mb-4">
              {TIER2_FEATURES.map((f) => (
                <div key={f} className="flex gap-2">
                  <span className="text-gold font-mono text-xs">&#10003;</span>
                  <span className="text-white font-mono text-[10px]">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedTier(2)}
              className={`w-full py-2.5 font-mono text-xs uppercase tracking-wider border ${
                selectedTier === 2
                  ? 'bg-gold text-navy border-gold font-bold'
                  : 'bg-gold text-navy border-gold font-bold hover:bg-gold/90'
              }`}
            >
              Try Tier 2 Free
            </button>
          </div>
        </div>

        {/* Signup Form — appears after tier selection */}
        {selectedTier && (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gold font-mono text-xs uppercase tracking-wider text-center mb-4">
                Starting your 7-day Tier {selectedTier} trial
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-transparent border border-gray-700 text-white font-mono text-sm px-3 py-2 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-transparent border border-gray-700 text-white font-mono text-sm px-3 py-2 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Company <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-transparent border border-gray-700 text-white font-mono text-sm px-3 py-2 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white font-mono text-[10px] uppercase tracking-wider block mb-1">
                  How did you hear about us?
                </label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full bg-[#0a1628] border border-gray-700 text-white font-mono text-sm px-3 py-2 focus:border-gold focus:outline-none"
                >
                  <option value="">Select...</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Hidden tier field */}
              <input type="hidden" name="tier" value={selectedTier} />

              <button
                type="submit"
                className="w-full py-3 bg-gold text-navy font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold/90"
              >
                Start My Free Trial
              </button>
            </form>

            <p className="text-white font-mono text-[10px] leading-relaxed text-center">
              By starting a trial you agree to the{' '}
              <a href="/terms" className="text-white underline hover:text-gold">Terms of Service</a>.
              Your data is handled per GDPR Article 13.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
