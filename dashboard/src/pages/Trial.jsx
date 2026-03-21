import React, { useState } from 'react'

const FEATURES = [
  'Full 5-layer HNI dashboard with live data',
  'Layer-by-layer score breakdown',
  'Historical score chart',
  'Staleness and data gap alerts',
  'Correlated asset watchlist',
  'Telegram CRITICAL alerts setup',
  'Full daily intelligence brief (300+ words)',
  'Signal interpretation notes',
]

const SOURCES = ['LinkedIn', 'Email', 'Referral', 'Google', 'Other']

export default function Trial() {
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
          <div className="text-gold font-mono text-3xl">{'\u2713'}</div>
          <h1 className="text-white font-mono text-lg font-bold">Trial access granted</h1>
          <p className="text-white font-mono text-xs leading-relaxed">
            Check your email for dashboard login details. Your 7-day trial starts now.
          </p>
          <a href="/public" className="inline-block text-gold font-mono text-xs underline hover:text-gold/80 mt-4">
            Return to public score
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">7-Day Free Trial</p>
          <h1 className="text-white font-mono text-xl font-bold mb-2">
            See what Tier 2 subscribers see every day
          </h1>
          <p className="text-white font-mono text-xs leading-relaxed">
            Full dashboard access. All 5 signal layers. Telegram CRITICAL alerts.
            No credit card required.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {FEATURES.map((f) => (
            <div key={f} className="flex gap-2">
              <span className="text-gold font-mono text-xs">{'\u2713'}</span>
              <span className="text-white font-mono text-[10px]">{f}</span>
            </div>
          ))}
        </div>

        {/* After Trial */}
        <p className="text-white font-mono text-[10px] leading-relaxed border-t border-gray-700 pt-4">
          After 7 days, continues at $199/month or $166/month billed annually.
          Cancel anytime before day 7 {'\u2014'} no charge.
        </p>

        {/* Form */}
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

          <button
            type="submit"
            className="w-full py-3 bg-gold text-navy font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold/90"
          >
            Start My Free Trial
          </button>
        </form>

        {/* Legal */}
        <p className="text-white font-mono text-[10px] leading-relaxed text-center">
          By starting a trial you agree to the{' '}
          <a href="/terms" className="text-white underline hover:text-gold">Terms of Service</a>.
          Your data is handled per GDPR Article 13.
        </p>
      </div>
    </div>
  )
}
