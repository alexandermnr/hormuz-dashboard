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
      document.title = `Hormuz Risk Index: ${Math.round(latest.composite_hni)} — ${latest.status_label}`
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
        <div className="text-gray-500 font-mono text-sm">Loading...</div>
      </div>
    )
  }

  if (!latest) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gray-500 font-mono text-sm">No score data available</div>
      </div>
    )
  }

  const isDataGap = latest.status_label === 'DATA GAP'

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-1">
            Hormuz Intelligence Platform
          </h1>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>

        {/* Score */}
        <div className="py-8">
          {isDataGap ? (
            <div>
              <div className="text-6xl md:text-8xl font-mono font-bold text-gray-500">—</div>
              <div className="mt-2 text-sm font-mono text-gray-500 tracking-widest">DATA GAP</div>
              <p className="mt-4 text-xs font-mono text-gray-600">
                Insufficient data to calculate a reliable score. Check back at the next update cycle.
              </p>
            </div>
          ) : (
            <>
              <ScoreDisplay score={latest.composite_hni} status={latest.status_label} size="large" />
              <div className="mt-4">
                <VelocityArrow velocity={latest.score_velocity} />
              </div>
            </>
          )}
        </div>

        {/* Score Disclaimer */}
        <p className="text-gray-600 font-mono text-[10px] leading-relaxed px-6 max-w-md">
          The HNI is a data intelligence composite for informational purposes only.
          Not a prediction, recommendation, or financial advice.
        </p>

        {/* Last Updated */}
        <div className="text-gray-600 font-mono text-xs mt-2">
          Last updated: {new Date(latest.calculated_at || latest.score_date).toLocaleString()}
        </div>

        {/* Alert Sentence */}
        {alertSentence && (
          <p className="text-gray-400 font-mono text-sm leading-relaxed px-4">
            {alertSentence}
          </p>
        )}

        {/* Primary Driver */}
        {brief?.primary_driver && (
          <p className="text-gray-500 font-mono text-xs italic px-4">
            {brief.primary_driver}
          </p>
        )}

        {/* CTA */}
        <div className="pt-6">
          <a
            href="https://hormuzintelligence.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gold text-navy font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold-light"
          >
            Subscribe for daily intelligence brief — from $49/month
          </a>
          <p className="text-gray-600 font-mono text-[10px] mt-2">
            By subscribing you agree to the{' '}
            <a href="/terms" className="text-gray-500 underline hover:text-gold">Terms of Service</a>
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-700 font-mono text-[10px] leading-relaxed px-4 pt-4">
          This score provides data intelligence for informational purposes only.
          It does not constitute financial, legal, or operational advice.
        </p>
      </div>
    </div>
  )
}
