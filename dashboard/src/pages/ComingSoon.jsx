import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PublicHeader, PublicFooter } from './GritTerminalLanding'

export default function ComingSoon({ indexName, fullName, description, launchDate }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const { error } = await supabase.from('email_captures').insert({
        email: trimmed,
        source: 'coming_soon_page',
        index_interest: indexName,
      })
      setStatus(error ? 'error' : 'success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <PublicHeader />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider">
          <Link to="/" className="hover:text-white">GRIT TERMINAL</Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{indexName}</span>
        </p>
      </div>

      {/* Content */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center flex-1">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          <span className="text-gold font-mono text-[10px] uppercase tracking-wider">COMING SOON</span>
        </div>

        <h1 className="text-white font-mono text-2xl font-bold uppercase tracking-wide mb-4">
          {fullName}
        </h1>
        <p className="text-gray-400 font-mono text-xs leading-relaxed mb-6 max-w-lg mx-auto">
          {description}
        </p>
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-12">
          Estimated launch: {launchDate}
        </p>

        {/* Notify form */}
        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <p className="text-emerald-400 font-mono text-sm">
              &#10003; You'll be notified when {indexName} goes live.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-gold font-mono text-xs uppercase tracking-wider mb-4">
                Get notified at launch
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                  placeholder="you@example.com"
                  className="flex-1 bg-navy-light border border-navy-mid text-white font-mono text-xs px-4 py-3 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-gold text-navy font-mono text-[10px] uppercase tracking-wider px-6 py-3 font-bold hover:bg-gold/90 disabled:opacity-50"
                >
                  {status === 'sending' ? '...' : 'NOTIFY ME'}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-red-400 font-mono text-[10px] mt-2">Please enter a valid email address.</p>
              )}
            </form>
          )}
        </div>

        <div className="mt-12">
          <Link to="/" className="text-gold font-mono text-[10px] uppercase tracking-wider hover:text-gold/80">
            &larr; BACK TO GRIT TERMINAL
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
