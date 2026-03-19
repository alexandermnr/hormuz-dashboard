import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Briefs() {
  const [briefs, setBriefs] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBriefs()
  }, [])

  async function fetchBriefs() {
    try {
      const { data } = await supabase
        .from('daily_briefs')
        .select('*')
        .order('brief_date', { ascending: false })
        .limit(30)
      if (data) setBriefs(data)
    } catch (err) {
      console.error('Failed to fetch briefs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-gray-500 font-mono text-sm">Loading briefs...</div>

  if (briefs.length === 0) {
    return <div className="text-gray-500 font-mono text-sm">No briefs available</div>
  }

  return (
    <div className="space-y-2">
      {briefs.map((brief) => (
        <div
          key={brief.id || brief.brief_date}
          className="bg-navy-light border border-navy-mid rounded overflow-hidden"
        >
          <button
            onClick={() => setExpanded(expanded === brief.id ? null : brief.id)}
            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-navy-mid/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-mono text-xs">
                {new Date(brief.brief_date).toLocaleDateString()}
              </span>
              {brief.validated && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-800">
                  VALIDATED
                </span>
              )}
              {brief.word_count && (
                <span className="text-gray-600 font-mono text-xs">{brief.word_count}w</span>
              )}
            </div>
            <span className="text-gold text-xs font-mono">
              {expanded === brief.id ? '[-]' : '[+]'}
            </span>
          </button>

          {expanded === brief.id && (
            <div className="px-4 pb-4 border-t border-navy-mid">
              {brief.primary_driver && (
                <div className="mt-3 mb-3 text-xs font-mono text-gold italic">
                  {brief.primary_driver}
                </div>
              )}
              <div className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                {brief.brief_text}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
