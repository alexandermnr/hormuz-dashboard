import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ScoreDisplay, { getScoreColor } from '../components/ScoreDisplay'
import VelocityArrow from '../components/VelocityArrow'

export default function PublicScore() {
  const [latest, setLatest] = useState(null)
  const [brief, setBrief] = useState(null)
  const [alertSentence, setAlertSentence] = useState('')
  const [loading, setLoading] = useState(true)
  const [captureEmail, setCaptureEmail] = useState('')
  const [captureStatus, setCaptureStatus] = useState('idle') // idle | sending | success | error

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (latest) {
      document.title = `Hormuz Risk Index: ${Math.round(latest.composite_hni || 0)} — ${latest.status_label}`
    }
  }, [latest])

  async function fetchData() {
    try {
      const [scoreRes, briefRes, configRes] = await Promise.all([
        supabase
          .from('hni_scores')
          .select('*')
          .order('score_date', { ascending: false })
          .limit(1),
        supabase
          .from('daily_briefs')
          .select('primary_driver')
          .order('brief_date', { ascending: false })
          .limit(1),
        supabase
          .from('platform_config')
          .select('value')
          .eq('key', 'alert_sentences')
          .single(),
      ])

      if (scoreRes.data?.[0]) setLatest(scoreRes.data[0])
      if (briefRes.data?.[0]) setBrief(briefRes.data[0])

      if (configRes.data?.value && scoreRes.data?.[0]) {
        const sentences = configRes.data.value
        const status = scoreRes.data[0].status_label?.replace(' (PARTIAL DATA)', '')
        if (sentences[status]) {
          setAlertSentence(sentences[status])
        }
      }
    } catch (err) {
      console.error('Failed to fetch public data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailCapture() {
    if (captureStatus === 'sending') return
    const trimmed = captureEmail.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setCaptureStatus('error')
      return
    }
    setCaptureStatus('sending')
    try {
      const res = await fetch(
        'https://tojefhjisctafyvbguqt.supabase.co/functions/v1/capture-email',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvamVmaGppc2N0YWZ5dmJndXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTIzOTcsImV4cCI6MjA4OTIyODM5N30.65VpUSd4hwbcilaK48MAnpIpdJdXsjJosnzTC04ebNs',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: trimmed, source: 'public_page' }),
        }
      )
      if (res.ok) {
        setCaptureStatus('success')
      } else {
        setCaptureStatus('error')
      }
    } catch {
      setCaptureStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-white font-mono text-sm">Loading...</div>
      </div>
    )
  }

  if (!latest) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-white font-mono text-sm">No score data available</div>
      </div>
    )
  }

  // Calculate composite from layer scores if composite_hni is null
  const computedScore = latest.composite_hni != null
    ? latest.composite_hni
    : Math.round(
        ((latest.layer1_score || 0) * 0.35 +
         (latest.layer2_score || 0) * 0.10 +
         (latest.layer3_score || 0) * 0.35 +
         (latest.layer4_score || 0) * 0.05 +
         (latest.layer5_score || 0) * 0.15) * 100
      ) / 100

  const isDataGap = !computedScore || computedScore <= 0
  const statusClean = (latest.status_label || '').replace(' (PARTIAL DATA)', '')

  // Freshness indicator
  const today = new Date().toISOString().split('T')[0]
  const scoreDate = latest.score_date || ''
  const isToday = scoreDate === today
  const isYesterday = scoreDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const freshnessColor = isToday ? '#48bb78' : isYesterday ? '#c9a84c' : '#e53e3e'
  const freshnessLabel = isToday ? '\u25cf LIVE' : isYesterday ? '\u25cf 1 DAY OLD' : '\u25cf STALE'

  // Score legend
  const band = computedScore <= 30 ? 3 : computedScore <= 50 ? 2 : computedScore <= 70 ? 1 : 0
  const bands = [
    { range: '71\u2013100', label: 'NOMINAL', desc: 'Conditions within normal parameters', color: '#48bb78' },
    { range: '51\u201370', label: 'ELEVATED', desc: 'Above-baseline readings, monitoring active', color: '#c9a84c' },
    { range: '31\u201350', label: 'HIGH TENSION', desc: 'Elevated signals across key layers', color: '#dd6b20' },
    { range: '0\u201330', label: 'CRITICAL', desc: 'Multiple leading indicators in stress zone', color: '#e53e3e' },
  ]

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Headline */}
        <div>
          <h1 className="text-gold font-mono text-sm uppercase tracking-[0.3em] mb-2 font-bold">
            Strait of Hormuz Risk Monitor
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p className="text-white font-mono text-xs leading-relaxed px-4">
            The Strait carries 20% of global oil supply. This score tracks disruption risk
            using 5 signal layers — including insurance underwriter data that moves 3–5 weeks
            before news reaches markets.
          </p>
        </div>

        {/* Score */}
        <div className="py-8">
          {isDataGap ? (
            <div>
              <div className="text-6xl md:text-8xl font-mono font-bold text-white">—</div>
              <div className="mt-2 text-sm font-mono text-white tracking-widest">DATA GAP</div>
              <p className="mt-4 text-xs font-mono text-white">
                Insufficient data to calculate a reliable score. Check back at the next update cycle.
              </p>
            </div>
          ) : (
            <>
              <ScoreDisplay score={computedScore} status={latest.status_label} size="large" />
              <div className="mt-4">
                <VelocityArrow velocity={latest.score_velocity} />
              </div>
              <p style={{fontFamily:'monospace', fontSize:'11px', color:'#a08840', margin:'4px 0 12px 0', letterSpacing:'0.05em'}}>
                5 SIGNAL LAYERS &nbsp;|&nbsp; 12 ACTIVE SIGNALS &nbsp;|&nbsp; UPDATED EVERY 6 HOURS
              </p>
            </>
          )}
        </div>

        {/* Score Context */}
        <p className="text-white font-mono text-xs leading-relaxed px-4">
          {statusClean} — Diplomatic and insurance signals are driving current readings.
          Subscribers receive the full signal breakdown and daily intelligence brief.
        </p>

        {/* Last Updated */}
        <div className="text-white font-mono text-xs mt-2">
          Last updated: {latest.score_date}
        </div>
        <p style={{fontFamily:'monospace', fontSize:'11px', color:freshnessColor, margin:'4px 0', letterSpacing:'0.05em'}}>
          {freshnessLabel} &nbsp;|&nbsp; 12 SIGNALS ACTIVE
        </p>

        {/* Alert Sentence */}
        {alertSentence && (
          <p className="text-white font-mono text-sm leading-relaxed px-4">
            {alertSentence}
          </p>
        )}

        {/* Score Legend */}
        <div style={{margin:'0 auto', maxWidth:'400px'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <tbody>
              {bands.map((b, i) => {
                const isActive = i === band
                const color = isActive ? b.color : b.color + '66'
                return (
                  <tr key={b.label}>
                    <td style={{fontFamily:'monospace', fontSize:'10px', color, padding:'3px 8px', borderBottom:'1px solid #1a2a40', width:'60px'}}>{b.range}</td>
                    <td style={{fontFamily:'monospace', fontSize:'10px', color, padding:'3px 8px', borderBottom:'1px solid #1a2a40', fontWeight: isActive ? 'bold' : 'normal', width:'100px'}}>{b.label}</td>
                    <td style={{fontFamily:'monospace', fontSize:'10px', color, padding:'3px 8px', borderBottom:'1px solid #1a2a40'}}>{b.desc}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p style={{fontFamily:'monospace', fontSize:'11px', color:'#666666', fontStyle:'italic', marginTop:'8px'}}>
            Subscribers see which signals moved first — and how far ahead of markets.
          </p>
          <p style={{marginTop:'8px'}}>
            <a href="/archive" style={{fontFamily:'monospace', fontSize:'11px', color:'#c9a84c', textDecoration:'underline'}}>
              View 30-day score archive {'\u2192'}
            </a>
          </p>
        </div>

        {/* Email Capture */}
        <div style={{margin:'24px 0', padding:'24px 16px', borderTop:'1px solid #1a2a40', borderBottom:'1px solid #1a2a40'}}>
          {captureStatus === 'success' ? (
            <p style={{fontFamily:'monospace', fontSize:'14px', color:'#48bb78', letterSpacing:'0.03em'}}>
              {'\u2713'} Check your inbox {'\u2014'} your first score is on its way.
            </p>
          ) : (
            <>
              <h2 style={{fontFamily:'Georgia, serif', fontSize:'18px', color:'#c9a84c', margin:'0 0 6px 0'}}>
                Get the daily score in your inbox {'\u2014'} free
              </h2>
              <p style={{fontFamily:'monospace', fontSize:'11px', color:'#999999', margin:'0 0 16px 0'}}>
                No credit card. No commitment. Unsubscribe anytime.
              </p>
              <div style={{display:'flex', gap:'8px', maxWidth:'400px', margin:'0 auto'}}>
                <input
                  type="email"
                  value={captureEmail}
                  onChange={(e) => setCaptureEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleEmailCapture() }}
                  placeholder="you@example.com"
                  disabled={captureStatus === 'sending'}
                  style={{
                    flex:1, padding:'10px 14px', fontFamily:'monospace', fontSize:'13px',
                    backgroundColor:'#0D1B2A', color:'#ffffff', border:'1px solid #1a2a40',
                    outline:'none', letterSpacing:'0.03em',
                  }}
                />
                <div
                  onClick={handleEmailCapture}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEmailCapture() }}
                  style={{
                    padding:'10px 20px', backgroundColor:'#c9a84c', color:'#0a1628',
                    fontFamily:'monospace', fontSize:'12px', fontWeight:'bold',
                    letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer',
                    whiteSpace:'nowrap', userSelect:'none',
                    opacity: captureStatus === 'sending' ? 0.6 : 1,
                  }}
                >
                  {captureStatus === 'sending' ? 'Sending...' : 'Send me the score'}
                </div>
              </div>
              {captureStatus === 'error' && (
                <p style={{fontFamily:'monospace', fontSize:'11px', color:'#e53e3e', marginTop:'8px'}}>
                  Something went wrong {'\u2014'} try again.
                </p>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="pt-6">
          <p className="text-white font-mono text-xs mb-4 px-4">
            You're seeing the score. Subscribers see why — and which signals moved first.
          </p>
          <a
            href="https://hormuzintelligence.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gold text-navy font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold-light"
          >
            Get the Daily Intelligence Brief — From $49/month
          </a>
          <p className="text-white font-mono text-[10px] mt-3">
            Includes: daily brief, signal drivers, velocity direction, and 24-hour lead analysis.
          </p>
          <p className="text-white font-mono text-[10px] mt-1">
            By subscribing you agree to the{' '}
            <a href="/terms" className="text-white underline hover:text-gold">Terms of Service</a>
          </p>
          <p className="mt-3">
            <a href="/preview" className="text-gold font-mono text-xs underline hover:text-gold/80">
              See what Tier 2 subscribers see {'\u2192'} Preview dashboard
            </a>
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-white font-mono text-[10px] leading-relaxed px-4 pt-4">
          The HNI is a data intelligence composite for informational purposes only.
          Not a prediction, recommendation, or financial advice.
        </p>
      </div>
    </div>
  )
}
