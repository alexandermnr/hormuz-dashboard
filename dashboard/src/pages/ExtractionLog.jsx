import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const SENTINEL_SIGNALS = ['vessel_count', 'vlcc_ag_east_rate', 'war_risk_premium', 'bandar_abbas_activity']

function getStatus(row) {
  const val = row.raw_value
  const notes = (row.notes || '').toLowerCase()

  if (notes.includes('error') || notes.includes('failed')) return 'ERROR'
  if (val === null || val === undefined || val === '') return 'NULL'
  if (typeof val === 'string' && isNaN(parseFloat(val))) return 'ERROR'

  const numVal = typeof val === 'number' ? val : parseFloat(val)
  if (isNaN(numVal)) return 'ERROR'
  if (numVal === 0 && SENTINEL_SIGNALS.includes(row.signal_name)) return 'SENTINEL ZERO'
  return 'FRESH'
}

function getStatusStyle(status) {
  switch (status) {
    case 'FRESH': return 'bg-emerald-900/20 border-l-2 border-emerald-500/30'
    case 'NULL': return 'bg-red-900/20 border-l-2 border-red-500/40'
    case 'SENTINEL ZERO': return 'bg-amber-900/20 border-l-2 border-amber-500/40'
    case 'ERROR': return 'bg-red-900/30 border-l-2 border-red-500/50'
    default: return ''
  }
}

function getStatusBadge(status) {
  const colors = {
    'FRESH': 'text-emerald-400',
    'NULL': 'text-red-400',
    'SENTINEL ZERO': 'text-amber-400',
    'ERROR': 'text-red-400',
  }
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider ${colors[status] || 'text-gray-400'}`}>
      {status}
    </span>
  )
}

function bucketKey(dateStr) {
  const d = new Date(dateStr)
  d.setMinutes(Math.floor(d.getMinutes() / 10) * 10, 0, 0)
  return d.toISOString()
}

export default function ExtractionLog() {
  const [rows, setRows] = useState([])
  const [hniScores, setHniScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [countdown, setCountdown] = useState(300)

  // Filters
  const [selectedRun, setSelectedRun] = useState('latest')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [signalFilter, setSignalFilter] = useState('ALL')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [sigRes, hniRes] = await Promise.all([
      supabase
        .from('raw_signals')
        .select('signal_name, raw_value, source_url, created_at, notes')
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('hni_scores')
        .select('score_date, composite_hni, created_at')
        .order('score_date', { ascending: false })
        .limit(50),
    ])
    if (sigRes.data) setRows(sigRes.data)
    if (hniRes.data) setHniScores(hniRes.data)
    setLoading(false)
    setLastRefresh(Date.now())
    setCountdown(300)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [lastRefresh])

  // Group into runs by 10-min buckets
  const runs = useMemo(() => {
    const buckets = {}
    rows.forEach(row => {
      const key = bucketKey(row.created_at)
      if (!buckets[key]) buckets[key] = []
      buckets[key].push(row)
    })
    return Object.entries(buckets)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => ({ key, items, ts: new Date(key) }))
  }, [rows])

  // Signal names for filter
  const signalNames = useMemo(() => {
    return [...new Set(rows.map(r => r.signal_name))].sort()
  }, [rows])

  // Current run
  const currentRun = useMemo(() => {
    if (selectedRun === 'latest') return runs[0]
    return runs.find(r => r.key === selectedRun) || runs[0]
  }, [runs, selectedRun])

  // Filtered rows for current run
  const filteredRows = useMemo(() => {
    if (!currentRun) return []
    return currentRun.items.filter(row => {
      const status = getStatus(row)
      if (statusFilter !== 'ALL' && status !== statusFilter) return false
      if (signalFilter !== 'ALL' && row.signal_name !== signalFilter) return false
      return true
    })
  }, [currentRun, statusFilter, signalFilter])

  // Summary stats for current run
  const runStats = useMemo(() => {
    if (!currentRun) return { fresh: 0, null_: 0, sentinel: 0, error: 0, total: 0 }
    let fresh = 0, null_ = 0, sentinel = 0, error = 0
    currentRun.items.forEach(row => {
      const s = getStatus(row)
      if (s === 'FRESH') fresh++
      else if (s === 'NULL') null_++
      else if (s === 'SENTINEL ZERO') sentinel++
      else if (s === 'ERROR') error++
    })
    return { fresh, null_, sentinel, error, total: currentRun.items.length }
  }, [currentRun])

  // Find HNI score near a run timestamp
  function getHniForRun(runTs) {
    if (!hniScores.length || !runTs) return null
    const runTime = new Date(runTs).getTime()
    for (const hni of hniScores) {
      const hniTime = new Date(hni.created_at || hni.score_date).getTime()
      if (Math.abs(runTime - hniTime) < 30 * 60 * 1000) {
        return hni.composite_hni
      }
    }
    return null
  }

  // Export CSV
  function exportCsv() {
    if (!filteredRows.length) return
    const header = 'timestamp,signal,value,status,source,notes\n'
    const body = filteredRows.map(r =>
      `"${r.created_at}","${r.signal_name}","${r.raw_value ?? ''}","${getStatus(r)}","${(r.source_url || '').replace(/"/g, '""')}","${(r.notes || '').replace(/"/g, '""')}"`
    ).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extraction_log_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const lastExtraction = runs[0]?.ts
  const hniAtRun = getHniForRun(currentRun?.key)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">Internal</p>
        <h1 className="text-white font-mono text-xl font-bold">Extraction Log</h1>
        <p className="text-gray-400 font-mono text-[10px] mt-1">
          Raw signal extraction monitoring — auto-refreshes every 5 minutes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-navy-mid p-4">
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">Last Extraction</p>
          <p className="text-white font-mono text-sm font-bold">
            {lastExtraction ? lastExtraction.toLocaleString() : '—'}
          </p>
        </div>
        <div className="border border-navy-mid p-4">
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">Signals Fresh</p>
          <p className="text-emerald-400 font-mono text-2xl font-bold">{runStats.fresh}</p>
        </div>
        <div className="border border-navy-mid p-4">
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">Signals Failed</p>
          <p className="text-red-400 font-mono text-2xl font-bold">{runStats.null_ + runStats.sentinel + runStats.error}</p>
        </div>
        <div className="border border-navy-mid p-4">
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">Total Runs</p>
          <p className="text-white font-mono text-2xl font-bold">{runs.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedRun}
          onChange={(e) => setSelectedRun(e.target.value)}
          className="bg-navy-light border border-navy-mid text-white font-mono text-[10px] px-3 py-2 focus:border-gold focus:outline-none"
        >
          <option value="latest">Latest Run</option>
          {runs.map(run => (
            <option key={run.key} value={run.key}>
              {run.ts.toLocaleString()} ({run.items.length} signals)
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-navy-light border border-navy-mid text-white font-mono text-[10px] px-3 py-2 focus:border-gold focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="FRESH">FRESH</option>
          <option value="NULL">NULL</option>
          <option value="SENTINEL ZERO">SENTINEL ZERO</option>
          <option value="ERROR">ERROR</option>
        </select>

        <select
          value={signalFilter}
          onChange={(e) => setSignalFilter(e.target.value)}
          className="bg-navy-light border border-navy-mid text-white font-mono text-[10px] px-3 py-2 focus:border-gold focus:outline-none"
        >
          <option value="ALL">All Signals</option>
          {signalNames.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={exportCsv}
          className="border border-gold text-gold font-mono text-[10px] uppercase tracking-wider px-3 py-2 hover:bg-gold/10"
        >
          EXPORT CSV
        </button>

        <span className="text-gray-600 font-mono text-[10px] ml-auto">
          Last refreshed {new Date(lastRefresh).toLocaleTimeString()} — refresh in {Math.floor(countdown / 60)}m {countdown % 60}s
        </span>
      </div>

      {/* Run Summary */}
      {currentRun && (
        <div className="border border-navy-mid px-4 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-gray-400 font-mono text-[10px]">
            Run: {currentRun.ts.toLocaleString()}
          </span>
          <span className="text-emerald-400 font-mono text-[10px]">{runStats.fresh} FRESH</span>
          <span className="text-red-400 font-mono text-[10px]">{runStats.null_} NULL</span>
          <span className="text-amber-400 font-mono text-[10px]">{runStats.sentinel} SENTINEL ZERO</span>
          <span className="text-red-400 font-mono text-[10px]">{runStats.error} ERROR</span>
          {hniAtRun != null && (
            <span className="text-gold font-mono text-[10px] ml-auto">
              HNI at run: {Math.round(hniAtRun)}
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 font-mono text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-mid">
                <th className="text-left text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Timestamp</th>
                <th className="text-left text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Signal</th>
                <th className="text-right text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Value</th>
                <th className="text-center text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Status</th>
                <th className="text-left text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Source</th>
                <th className="text-left text-gray-500 font-mono text-[10px] uppercase tracking-wider py-2 px-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => {
                const status = getStatus(row)
                return (
                  <tr key={i} className={`border-b border-navy-mid/50 ${getStatusStyle(status)}`}>
                    <td className="text-gray-400 font-mono text-[10px] py-2 px-3 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="text-white font-mono text-[10px] py-2 px-3">{row.signal_name}</td>
                    <td className="text-white font-mono text-[10px] py-2 px-3 text-right">
                      {row.raw_value != null ? String(row.raw_value) : '—'}
                    </td>
                    <td className="text-center py-2 px-3">
                      <span title={status === 'SENTINEL ZERO' ? 'Sentinel zero — extraction failed, not a real value' : ''}>
                        {getStatusBadge(status)}
                      </span>
                    </td>
                    <td className="text-gray-500 font-mono text-[10px] py-2 px-3 max-w-[200px] truncate">
                      {row.source_url || '—'}
                    </td>
                    <td className="text-gray-500 font-mono text-[10px] py-2 px-3 max-w-[150px] truncate">
                      {row.notes || '—'}
                    </td>
                  </tr>
                )
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-gray-600 font-mono text-[10px] py-6 text-center">
                    No rows match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
