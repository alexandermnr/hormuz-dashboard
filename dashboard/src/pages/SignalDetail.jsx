import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const LAYER_MAP = {
  1: { name: 'Diplomatic', signals: ['rial_black_market', 'diplomatic_flights', 'iaea_enrichment'] },
  2: { name: 'Maritime', signals: ['vessel_count', 'bandar_abbas_activity', 'vlcc_ag_east_rate'] },
  3: { name: 'Energy', signals: ['cftc_net_spec', 'brent_dubai_spread'] },
  4: { name: 'Credit', signals: ['gulf_cds_average', 'credit_spread_proxy'] },
  5: { name: 'Insurance', signals: ['lloyds_jwc_status', 'war_risk_premium'] },
}

export default function SignalDetail() {
  const [signals, setSignals] = useState([])
  const [activeLayer, setActiveLayer] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showReviewOnly, setShowReviewOnly] = useState(false)

  useEffect(() => {
    fetchSignals()
  }, [])

  async function fetchSignals() {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('raw_signals')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
      if (data) setSignals(data)
    } catch (err) {
      console.error('Failed to fetch signals:', err)
    } finally {
      setLoading(false)
    }
  }

  let layerSignals = signals.filter(s =>
    LAYER_MAP[activeLayer]?.signals.includes(s.signal_name)
  )

  if (showReviewOnly) {
    layerSignals = layerSignals.filter(s => s.review_required)
  }

  const reviewCount = signals.filter(s => s.review_required).length
  const prepopCount = signals.filter(s => s.pre_populated).length

  function getAgeHours(createdAt) {
    return ((Date.now() - new Date(createdAt).getTime()) / 3600000).toFixed(1)
  }

  return (
    <div>
      {/* Status Banners */}
      {reviewCount > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3 mb-4 flex items-center justify-between">
          <span className="text-xs font-mono text-yellow-400">
            {reviewCount} signal{reviewCount !== 1 ? 's' : ''} flagged for manual review
          </span>
          <button
            onClick={() => setShowReviewOnly(!showReviewOnly)}
            className="text-xs font-mono text-yellow-400 border border-yellow-700 px-2 py-0.5 rounded hover:bg-yellow-900/50"
          >
            {showReviewOnly ? 'SHOW ALL' : 'SHOW REVIEW ONLY'}
          </button>
        </div>
      )}

      {prepopCount > 0 && (
        <div className="bg-navy-light border border-navy-mid rounded p-2 mb-4 text-xs font-mono text-gray-500">
          {prepopCount} signal{prepopCount !== 1 ? 's' : ''} from Sunday pre-population
        </div>
      )}

      {/* Layer Tabs */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((layer) => {
          const layerReviewCount = signals.filter(s =>
            LAYER_MAP[layer]?.signals.includes(s.signal_name) && s.review_required
          ).length
          return (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-t border-b-2 transition-none relative ${
                activeLayer === layer
                  ? 'bg-navy-light text-gold border-gold'
                  : 'bg-navy text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              L{layer} {LAYER_MAP[layer].name}
              {layerReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-600 text-navy text-[9px] font-bold rounded-full flex items-center justify-center">
                  {layerReviewCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-gray-500 font-mono text-sm">Loading signals...</div>
      ) : layerSignals.length === 0 ? (
        <div className="text-gray-500 font-mono text-sm">
          {showReviewOnly
            ? 'No signals requiring review in this layer'
            : 'No signals in last 24 hours for this layer'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gold uppercase tracking-widest border-b border-navy-light">
                <th className="text-left py-2 px-3">Signal</th>
                <th className="text-right py-2 px-3">Raw Value</th>
                <th className="text-right py-2 px-3">Normalized</th>
                <th className="text-right py-2 px-3">Age (hrs)</th>
                <th className="text-center py-2 px-3">Source</th>
                <th className="text-center py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {layerSignals.map((signal, i) => {
                const ageHours = getAgeHours(signal.created_at)
                const isStale = parseFloat(ageHours) > 8
                const isPrepop = signal.pre_populated
                const needsReview = signal.review_required

                return (
                  <tr
                    key={i}
                    className={`border-b border-navy-mid/50 hover:bg-navy-light/50 ${
                      needsReview ? 'bg-yellow-900/10' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-gray-300">
                      {signal.signal_name}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-300">
                      {signal.raw_value != null ? Number(signal.raw_value).toFixed(2) : '---'}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-300">
                      {signal.normalized_value != null ? Number(signal.normalized_value).toFixed(1) : '---'}
                    </td>
                    <td className={`py-2 px-3 text-right ${isStale ? 'text-red-400' : 'text-gray-400'}`}>
                      {ageHours}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {isPrepop ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                          PREPOP
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-mid text-gray-500 border border-navy-mid">
                          LIVE
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {needsReview ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/40 text-yellow-400 border border-yellow-700">
                          REVIEW
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-600">OK</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {new Date(signal.created_at).toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confidence Legend */}
      <div className="mt-6 bg-navy-light border border-navy-mid rounded p-3 text-[10px] font-mono text-gray-600 space-y-1">
        <div><span className="text-blue-400">PREPOP</span> — Sunday pre-populated signal (researched, not live-scraped)</div>
        <div><span className="text-yellow-400">REVIEW</span> — Low confidence extraction; verify source before relying on value</div>
        <div><span className="text-red-400">Red age</span> — Signal data older than 8 hours (stale)</div>
      </div>
    </div>
  )
}
