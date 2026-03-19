import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const EDGE_COLORS = {
  positive: '#1A6B3C',
  negative: '#C0392B',
  neutral: '#B7950B',
}

function getEdgeColor(edge) {
  if (edge === null || edge === undefined) return '#888'
  if (edge > 0.03) return EDGE_COLORS.positive
  if (edge < -0.03) return EDGE_COLORS.negative
  return EDGE_COLORS.neutral
}

function getActionColor(action) {
  if (!action) return '#888'
  const a = action.toUpperCase()
  if (a === 'MAXIMUM') return '#C0392B'
  if (a === 'HALF_KELLY') return '#D35400'
  if (a === 'SMALL') return '#B7950B'
  return '#888'
}

export default function Markets() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [paperTrading, setPaperTrading] = useState(true)

  useEffect(() => {
    fetchMarkets()
  }, [])

  async function fetchMarkets() {
    try {
      const { data } = await supabase
        .from('prediction_markets')
        .select('*')
        .order('edge', { ascending: false })
      if (data) {
        setMarkets(data)
        // Check if any record has paper_trading_mode set
        const hasPaperFlag = data.some(m => m.paper_trading_mode === true)
        setPaperTrading(hasPaperFlag || data.length === 0)
      }
    } catch (err) {
      console.error('Failed to fetch markets:', err)
    } finally {
      setLoading(false)
    }
  }

  const kalshiMarkets = markets.filter(m => m.platform === 'KALSHI')
  const polyMarkets = markets.filter(m => m.platform === 'POLYMARKET')

  if (loading) return <div className="text-gray-500 font-mono text-sm">Loading markets...</div>

  return (
    <div className="space-y-6">
      {/* Paper Trading Banner */}
      {paperTrading && (
        <div className="bg-red-900/30 border-2 border-red-700 rounded p-4 text-center">
          <div className="text-red-400 font-mono text-sm font-bold tracking-widest uppercase">
            PAPER TRADING MODE
          </div>
          <div className="text-red-400/70 font-mono text-xs mt-1">
            Empirical calibration in progress. No positions recommended.
          </div>
          <div className="text-red-400/50 font-mono text-[10px] mt-1">
            HNI-to-probability mappings are theoretical until 90-day validation is complete.
          </div>
        </div>
      )}

      {/* Regulatory Notice */}
      <div className="bg-yellow-900/20 border border-yellow-800 rounded p-3 text-xs font-mono text-yellow-400">
        US persons — Kalshi contracts only. Polymarket data is for monitoring purposes only.
        This information is provided for audit support and does not constitute advice of any kind.
      </div>

      {/* Kalshi Markets */}
      <div>
        <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">
          Kalshi — Edge Signals
        </h3>
        {kalshiMarkets.length === 0 ? (
          <div className="text-gray-500 font-mono text-sm">No Kalshi markets data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-gold uppercase tracking-widest border-b border-navy-light">
                  <th className="text-left py-2 px-3">Contract</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-right py-2 px-3">Market Price</th>
                  <th className="text-right py-2 px-3">HNI Implied</th>
                  <th className="text-right py-2 px-3">Edge</th>
                  <th className="text-center py-2 px-3">Signal</th>
                  <th className="text-right py-2 px-3">Days</th>
                  <th className="text-right py-2 px-3">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {kalshiMarkets.map((m, i) => (
                  <tr key={i} className="border-b border-navy-mid/50 hover:bg-navy-light/50">
                    <td className="py-2 px-3 text-gray-300 max-w-[200px] truncate" title={m.market_title}>
                      {m.market_title}
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {m.market_type?.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-300">
                      {m.current_probability != null ? `${(m.current_probability * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-gold">
                      {m.hni_implied_probability != null ? `${(m.hni_implied_probability * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold" style={{ color: getEdgeColor(m.edge) }}>
                      {m.edge != null ? `${m.edge > 0 ? '+' : ''}${(m.edge * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          color: paperTrading ? '#888' : getActionColor(m.recommended_action),
                          borderColor: paperTrading ? '#444' : getActionColor(m.recommended_action),
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                      >
                        {paperTrading ? 'MONITOR' : (m.recommended_action || 'MONITOR')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-500">
                      {m.days_to_resolution ?? '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-500">
                      {m.liquidity_usd != null ? `$${m.liquidity_usd.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Polymarket Markets */}
      <div>
        <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">
          Polymarket — Monitoring Only
        </h3>
        {polyMarkets.length === 0 ? (
          <div className="text-gray-500 font-mono text-sm">No Polymarket data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-gold uppercase tracking-widest border-b border-navy-light">
                  <th className="text-left py-2 px-3">Contract</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-right py-2 px-3">Market Price</th>
                  <th className="text-right py-2 px-3">HNI Implied</th>
                  <th className="text-right py-2 px-3">Edge</th>
                  <th className="text-right py-2 px-3">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {polyMarkets.map((m, i) => (
                  <tr key={i} className="border-b border-navy-mid/50 hover:bg-navy-light/50 opacity-70">
                    <td className="py-2 px-3 text-gray-400 max-w-[200px] truncate" title={m.market_title}>
                      {m.market_title}
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {m.market_type?.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-400">
                      {m.current_probability != null ? `${(m.current_probability * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-gold/70">
                      {m.hni_implied_probability != null ? `${(m.hni_implied_probability * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right" style={{ color: getEdgeColor(m.edge), opacity: 0.7 }}>
                      {m.edge != null ? `${m.edge > 0 ? '+' : ''}${(m.edge * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-500">
                      {m.liquidity_usd != null ? `$${m.liquidity_usd.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Methodology Note */}
      <div className="bg-navy-light border border-navy-mid rounded p-4">
        <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-2">
          Edge Calculation Methodology
        </h4>
        <div className="text-gray-500 text-xs font-mono space-y-1">
          <p>Edge = HNI-implied disruption probability minus market price.</p>
          <p>Positive edge: HNI model sees higher disruption risk than the market.</p>
          <p>Negative edge: market prices higher disruption risk than HNI model.</p>
          <p className="pt-2 text-gray-600">
            Signal thresholds (analysis only): SMALL &ge; 3% | HALF_KELLY &ge; 8% | MAXIMUM &ge; 15%
          </p>
          <p className="text-gray-600">
            HNI-to-probability mappings are theoretical and subject to revision
            following 90-day calibration against observed market outcomes.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-gray-700 font-mono text-[10px] leading-relaxed">
        This data is provided for informational and audit support purposes only.
        It does not constitute advice of any kind. Prediction market data is displayed
        for analytical monitoring. US persons should only interact with CFTC-regulated
        platforms (Kalshi). Polymarket data is shown for cross-reference monitoring only.
      </div>
    </div>
  )
}
