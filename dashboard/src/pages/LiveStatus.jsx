import React, { useEffect, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { supabase } from '../supabaseClient'
import ScoreDisplay from '../components/ScoreDisplay'
import VelocityArrow from '../components/VelocityArrow'
import LayerBars from '../components/LayerBars'
import AlertsPanel from '../components/AlertsPanel'

export default function LiveStatus() {
  const [latest, setLatest] = useState(null)
  const [history7d, setHistory7d] = useState([])
  const [history30d, setHistory30d] = useState([])
  const [alerts, setAlerts] = useState([])
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [scoresRes, alertsRes, briefRes] = await Promise.all([
        supabase
          .from('hni_scores')
          .select('*')
          .order('score_date', { ascending: false })
          .limit(30),
        supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('daily_briefs')
          .select('primary_driver')
          .order('brief_date', { ascending: false })
          .limit(1),
      ])

      if (scoresRes.data && scoresRes.data.length > 0) {
        setLatest(scoresRes.data[0])
        setHistory7d(scoresRes.data.slice(0, 7).reverse())
        setHistory30d(scoresRes.data.slice(0, 30).reverse())
      }
      if (alertsRes.data) setAlerts(alertsRes.data)
      if (briefRes.data && briefRes.data.length > 0) setBrief(briefRes.data[0])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500 font-mono text-sm p-8">Loading...</div>
  }

  if (!latest) {
    return <div className="text-gray-500 font-mono text-sm p-8">No score data available</div>
  }

  const staleLayers = latest.stale_layers
  const staleList = staleLayers ? staleLayers.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <div className="space-y-6">
      {staleList.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3 text-xs font-mono text-yellow-400">
          PARTIAL DATA — {staleList.map(l => `Layer ${l}`).join(', ')} data is stale
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Block */}
        <div className="bg-navy-light border border-navy-mid rounded p-6 flex flex-col items-center justify-center">
          <ScoreDisplay score={latest.composite_hni} status={latest.status_label} />
          <div className="mt-3">
            <VelocityArrow velocity={latest.score_velocity} />
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono">
            {new Date(latest.score_date).toLocaleDateString()}
          </div>
        </div>

        {/* 7-day Sparkline */}
        <div className="bg-navy-light border border-navy-mid rounded p-4">
          <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">7-Day Trend</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={history7d}>
              <Line
                type="monotone"
                dataKey="composite_hni"
                stroke="#C49A1A"
                strokeWidth={2}
                dot={false}
              />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1B2A4A', border: 'none', fontFamily: 'monospace', fontSize: 11 }}
                labelStyle={{ color: '#C49A1A' }}
                formatter={(val) => [Math.round(val), 'HNI']}
                labelFormatter={(_, payload) => {
                  if (payload?.[0]?.payload?.score_date) return payload[0].payload.score_date
                  return ''
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Layer Bars */}
        <div className="bg-navy-light border border-navy-mid rounded p-4">
          <LayerBars layerScores={latest} />
        </div>
      </div>

      {/* 30-day Chart */}
      <div className="bg-navy-light border border-navy-mid rounded p-4">
        <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">30-Day History</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history30d}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1B2A4A" />
            <XAxis
              dataKey="score_date"
              tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }}
              tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1B2A4A', border: 'none', fontFamily: 'monospace', fontSize: 11 }}
              formatter={(val) => [Math.round(val), 'HNI']}
            />
            <Line type="monotone" dataKey="composite_hni" stroke="#C49A1A" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Driver */}
        {brief?.primary_driver && (
          <div className="bg-navy-light border border-navy-mid rounded p-4">
            <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Primary Driver</h3>
            <p className="text-gray-300 text-sm font-mono">{brief.primary_driver}</p>
          </div>
        )}

        {/* Alerts */}
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  )
}
