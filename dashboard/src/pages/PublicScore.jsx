import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ScoreDisplay, { getScoreColor } from '../components/ScoreDisplay'
import VelocityArrow from '../components/VelocityArrow'

export default function PublicScore() {
  const [latest, setLatest] = useState(null)
  const [brief, setBrief] = useState(null)
  const [alertSentence, setAlertSentence] = useState('')
  const [loading, setLoading] = useState(true)

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

  const isDataGap = latest.status_label === 'DATA GAP'
  const statusClean = (latest.status_label || '').replace(' (PARTIAL DATA)', '')

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
          Last updated: {new Date(latest.calculated_at || latest.score_date).toLocaleString()}
        </div>

        {/* Alert Sentence */}
        {alertSentence && (
          <p className="text-white font-mono text-sm leading-relaxed px-4">
            {alertSentence}
          </p>
        )}

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
