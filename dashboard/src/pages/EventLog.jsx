import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts'

const CONFLICT_COLORS = { ESCALATING: '#e53e3e', STABLE: '#c9a84c', 'DE-ESCALATING': '#48bb78', UNKNOWN: '#888888' }
const TIMING_COLORS = { PRE_NEWS: '#48bb78', SIMULTANEOUS: '#c9a84c', POST_NEWS: '#e53e3e' }
const ROW_TINTS = { ESCALATING: 'rgba(229,62,62,0.08)', 'DE-ESCALATING': 'rgba(72,187,120,0.08)' }

export default function EventLog() {
  var [entries, setEntries] = useState([])
  var [loading, setLoading] = useState(true)
  var [expanded, setExpanded] = useState({})
  var [dateRange, setDateRange] = useState(7)
  var [filterConflict, setFilterConflict] = useState('')
  var [filterTiming, setFilterTiming] = useState('')

  useEffect(function () {
    fetchData()
  }, [dateRange])

  function fetchData() {
    setLoading(true)
    var cutoff = new Date(Date.now() - dateRange * 86400000).toISOString()
    supabase
      .from('live_event_log')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(function (res) {
        setEntries(res.data || [])
        setLoading(false)
      })
  }

  var filtered = useMemo(function () {
    return entries.filter(function (e) {
      if (filterConflict && e.conflict_state !== filterConflict) return false
      if (filterTiming && e.news_timing !== filterTiming) return false
      return true
    })
  }, [entries, filterConflict, filterTiming])

  var stats = useMemo(function () {
    var daysOnRecord = Math.floor((Date.now() - new Date('2026-03-25').getTime()) / 86400000)
    var preNews = entries.filter(function (e) { return e.news_timing === 'PRE_NEWS' }).length
    var latest = entries[0] || {}
    return {
      daysOnRecord: daysOnRecord,
      totalEntries: entries.length,
      conflictState: latest.conflict_state || 'UNKNOWN',
      preNewsPct: entries.length > 0 ? Math.round(preNews / entries.length * 100) : 0
    }
  }, [entries])

  function toggleExpand(id) {
    setExpanded(function (prev) {
      var next = {}
      for (var k in prev) next[k] = prev[k]
      next[id] = !prev[id]
      return next
    })
  }

  function exportCSV() {
    if (filtered.length === 0) return
    var cols = Object.keys(filtered[0])
    var csv = cols.join(',') + '\n'
    filtered.forEach(function (row) {
      csv += cols.map(function (c) {
        var v = row[c]
        if (v === null || v === undefined) return ''
        var s = typeof v === 'object' ? JSON.stringify(v) : String(v)
        return '"' + s.replace(/"/g, '""') + '"'
      }).join(',') + '\n'
    })
    var blob = new Blob([csv], { type: 'text/csv' })
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.download = 'event_log_' + new Date().toISOString().split('T')[0] + '.csv'
    a.click()
  }

  // Chart data
  var hniChartData = useMemo(function () {
    return filtered.slice().reverse().map(function (e) {
      return { date: (e.entry_time_utc || '').substring(0, 16), hni: e.hni_score }
    })
  }, [filtered])

  var timingChartData = useMemo(function () {
    var byDate = {}
    filtered.forEach(function (e) {
      var d = e.entry_date
      if (!byDate[d]) byDate[d] = { date: d, PRE_NEWS: 0, SIMULTANEOUS: 0, POST_NEWS: 0 }
      if (e.news_timing && byDate[d][e.news_timing] !== undefined) byDate[d][e.news_timing]++
    })
    return Object.values(byDate).sort(function (a, b) { return a.date.localeCompare(b.date) })
  }, [filtered])

  var cellS = { fontFamily: 'monospace', fontSize: '11px', padding: '6px 8px', borderBottom: '1px solid #1a2a40' }
  var headerS = { fontFamily: 'monospace', fontSize: '10px', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 8px', borderBottom: '2px solid #1a2a40' }

  if (loading) {
    return React.createElement('div', { className: 'text-gold font-mono text-sm' }, 'Loading event log...')
  }

  return React.createElement('div', { className: 'space-y-6' },
    // Header
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-gold font-mono text-xs uppercase tracking-widest mb-1' }, 'LIVE EVENT LOG'),
      React.createElement('p', { className: 'text-gray-500 font-mono text-xs' }, 'US-Israel-Iran Conflict | March 2026')
    ),

    // Stat cards
    React.createElement('div', { className: 'grid grid-cols-4 gap-4' },
      [
        ['Days on Record', stats.daysOnRecord],
        ['Total Entries', stats.totalEntries],
        ['Conflict State', stats.conflictState],
        ['Pre-News Signals', stats.preNewsPct + '%']
      ].map(function (item, i) {
        var isConflict = i === 2
        var color = isConflict ? (CONFLICT_COLORS[stats.conflictState] || '#888') : '#c9a84c'
        return React.createElement('div', { key: i, className: 'bg-navy-light border border-navy-mid rounded p-4 text-center' },
          React.createElement('div', { style: { fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold', color: color } }, item[1]),
          React.createElement('div', { className: 'text-gray-500 font-mono text-xs mt-1' }, item[0])
        )
      })
    ),

    // Latest conclusion
    entries[0] && entries[0].conclusion_text && React.createElement('div', {
      style: { border: '1px solid #c9a84c', borderRadius: '6px', padding: '16px', backgroundColor: '#0D1B2A' }
    },
      React.createElement('div', { className: 'text-gold font-mono text-xs uppercase tracking-widest mb-2' },
        'LATEST INTELLIGENCE \u2014 ' + (entries[0].entry_time_utc || '').substring(0, 16) + ' UTC'),
      React.createElement('p', { style: { fontFamily: 'monospace', fontSize: '12px', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' } },
        entries[0].conclusion_text)
    ),

    // Filters
    React.createElement('div', { className: 'flex gap-3 items-center flex-wrap' },
      React.createElement('select', {
        value: dateRange, onChange: function (e) { setDateRange(Number(e.target.value)) },
        className: 'bg-navy-light border border-navy-mid text-gray-300 font-mono text-xs px-3 py-1.5 rounded'
      },
        React.createElement('option', { value: 7 }, 'Last 7 days'),
        React.createElement('option', { value: 14 }, 'Last 14 days'),
        React.createElement('option', { value: 30 }, 'Last 30 days')
      ),
      React.createElement('select', {
        value: filterConflict, onChange: function (e) { setFilterConflict(e.target.value) },
        className: 'bg-navy-light border border-navy-mid text-gray-300 font-mono text-xs px-3 py-1.5 rounded'
      },
        React.createElement('option', { value: '' }, 'All States'),
        ['ESCALATING', 'STABLE', 'DE-ESCALATING', 'UNKNOWN'].map(function (s) {
          return React.createElement('option', { key: s, value: s }, s)
        })
      ),
      React.createElement('select', {
        value: filterTiming, onChange: function (e) { setFilterTiming(e.target.value) },
        className: 'bg-navy-light border border-navy-mid text-gray-300 font-mono text-xs px-3 py-1.5 rounded'
      },
        React.createElement('option', { value: '' }, 'All Timing'),
        ['PRE_NEWS', 'SIMULTANEOUS', 'POST_NEWS'].map(function (s) {
          return React.createElement('option', { key: s, value: s }, s)
        })
      ),
      React.createElement('div', {
        onClick: exportCSV, role: 'button', tabIndex: 0,
        className: 'bg-gold text-navy font-mono text-xs font-bold px-4 py-1.5 rounded cursor-pointer uppercase'
      }, 'Export CSV')
    ),

    // Table
    React.createElement('div', { style: { overflowX: 'auto' } },
      React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        React.createElement('thead', null,
          React.createElement('tr', null,
            ['Date/Time', 'HNI', 'Status', 'Vel', 'Conflict', 'News', 'Tether', 'Wiki', 'Rel', ''].map(function (h) {
              return React.createElement('th', { key: h, style: headerS }, h)
            })
          )
        ),
        React.createElement('tbody', null,
          filtered.map(function (row) {
            var bg = ROW_TINTS[row.conflict_state] || 'transparent'
            if (row.conflict_state === 'ESCALATING' && row.hni_score < 40) bg = 'rgba(229,62,62,0.15)'
            var isExp = expanded[row.id]

            return React.createElement(React.Fragment, { key: row.id },
              React.createElement('tr', { style: { backgroundColor: bg, cursor: 'pointer' }, onClick: function () { toggleExpand(row.id) } },
                React.createElement('td', { style: Object.assign({}, cellS, { color: '#e2e8f0' }) }, (row.entry_time_utc || '').substring(0, 16)),
                React.createElement('td', { style: Object.assign({}, cellS, { color: '#c9a84c', fontWeight: 'bold' }) }, row.hni_score),
                React.createElement('td', { style: Object.assign({}, cellS, { color: '#e2e8f0', fontSize: '10px' }) }, (row.hni_status || '').substring(0, 15)),
                React.createElement('td', { style: Object.assign({}, cellS, { color: row.hni_velocity_24h > 0 ? '#48bb78' : row.hni_velocity_24h < 0 ? '#e53e3e' : '#888' }) },
                  row.hni_velocity_24h !== null ? (row.hni_velocity_24h > 0 ? '+' : '') + row.hni_velocity_24h : '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: CONFLICT_COLORS[row.conflict_state] || '#888' }) }, row.conflict_state || '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: TIMING_COLORS[row.news_timing] || '#888' }) }, row.news_timing || '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: row.capital_flight_signal === 'HIGH' ? '#e53e3e' : '#888' }) }, row.capital_flight_signal || '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: '#888' }) }, row.wiki_edit_velocity || '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: row.relevance_rating === 'HIGH' ? '#c9a84c' : '#888' }) }, row.relevance_rating || '\u2014'),
                React.createElement('td', { style: Object.assign({}, cellS, { color: '#c9a84c' }) }, isExp ? '\u25B2' : '\u25BC')
              ),
              isExp && React.createElement('tr', null,
                React.createElement('td', { colSpan: 10, style: { padding: '12px 16px', backgroundColor: '#0D1B2A', borderBottom: '1px solid #1a2a40' } },
                  React.createElement('div', { className: 'space-y-3' },
                    // Layer scores
                    React.createElement('div', { className: 'flex gap-4' },
                      ['L1', 'L2', 'L3', 'L4', 'L5'].map(function (l, i) {
                        var v = row['layer' + (i + 1) + '_score']
                        return React.createElement('div', { key: l, style: { fontFamily: 'monospace', fontSize: '10px', color: '#888' } },
                          l + ': ', React.createElement('span', { style: { color: '#c9a84c', fontWeight: 'bold' } }, v || '\u2014'))
                      })
                    ),
                    // Conclusion
                    row.conclusion_text && React.createElement('p', { style: { fontFamily: 'monospace', fontSize: '11px', color: '#e2e8f0', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, row.conclusion_text),
                    // Market prices
                    React.createElement('div', { style: { fontFamily: 'monospace', fontSize: '10px', color: '#888' } },
                      'Brent: $' + (row.brent_spot || '\u2014') + ' | OVX: ' + (row.ovx_value || '\u2014') +
                      ' | Curve: ' + (row.curve_state || '\u2014') + ' (' + (row.curve_spread || '\u2014') + ')' +
                      ' | Tether premium: ' + (row.usdt_nobitex_premium || '\u2014') + '%'),
                    // News timing delta
                    row.pre_news_delta_hours !== null && React.createElement('div', { style: { fontFamily: 'monospace', fontSize: '10px', color: TIMING_COLORS[row.news_timing] || '#888' } },
                      'Signal \u2192 News delta: ' + row.pre_news_delta_hours + 'h (' + row.news_timing + ')'),
                    // News links
                    row.news_items && Array.isArray(row.news_items) && row.news_items.length > 0 &&
                    React.createElement('div', { className: 'space-y-1' },
                      row.news_items.slice(0, 5).map(function (n, ni) {
                        return React.createElement('a', { key: ni, href: n.url, target: '_blank', rel: 'noopener noreferrer',
                          style: { display: 'block', fontFamily: 'monospace', fontSize: '10px', color: '#c9a84c', textDecoration: 'underline' } },
                          '[' + (n.credibility_tier || '?') + '] ' + (n.headline || '').substring(0, 80))
                      })
                    )
                  )
                )
              )
            )
          })
        )
      )
    ),

    // Charts
    React.createElement('div', { className: 'space-y-6 mt-6' },
      // HNI Timeline
      React.createElement('div', { className: 'bg-navy-light border border-navy-mid rounded p-4' },
        React.createElement('h3', { className: 'text-gold text-xs font-mono uppercase tracking-widest mb-3' }, 'HNI Score Timeline'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 200 },
          React.createElement(LineChart, { data: hniChartData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#1a2a40' }),
            React.createElement(XAxis, { dataKey: 'date', tick: { fontSize: 9, fill: '#666', fontFamily: 'monospace' } }),
            React.createElement(YAxis, { domain: [0, 100], tick: { fontSize: 9, fill: '#666', fontFamily: 'monospace' } }),
            React.createElement(Tooltip, { contentStyle: { backgroundColor: '#1B2A4A', border: 'none', fontFamily: 'monospace', fontSize: 11 } }),
            React.createElement(Line, { type: 'monotone', dataKey: 'hni', stroke: '#C49A1A', strokeWidth: 2, dot: false })
          )
        )
      ),

      // News Timing Distribution
      React.createElement('div', { className: 'bg-navy-light border border-navy-mid rounded p-4' },
        React.createElement('h3', { className: 'text-gold text-xs font-mono uppercase tracking-widest mb-3' }, 'News Timing Distribution'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 200 },
          React.createElement(BarChart, { data: timingChartData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#1a2a40' }),
            React.createElement(XAxis, { dataKey: 'date', tick: { fontSize: 9, fill: '#666', fontFamily: 'monospace' } }),
            React.createElement(YAxis, { tick: { fontSize: 9, fill: '#666', fontFamily: 'monospace' } }),
            React.createElement(Tooltip, { contentStyle: { backgroundColor: '#1B2A4A', border: 'none', fontFamily: 'monospace', fontSize: 11 } }),
            React.createElement(Legend, { wrapperStyle: { fontFamily: 'monospace', fontSize: 10 } }),
            React.createElement(Bar, { dataKey: 'PRE_NEWS', stackId: 'a', fill: '#48bb78', name: 'Pre-News' }),
            React.createElement(Bar, { dataKey: 'SIMULTANEOUS', stackId: 'a', fill: '#c9a84c', name: 'Simultaneous' }),
            React.createElement(Bar, { dataKey: 'POST_NEWS', stackId: 'a', fill: '#e53e3e', name: 'Post-News' })
          )
        )
      )
    ),

    // Footer
    React.createElement('p', { className: 'text-gray-600 font-mono text-xs italic mt-4' },
      'Clean data begins March 25, 2026. Entries from March 19-24 are calibration period \u2014 excluded from institutional citations. All timestamps UTC.')
  )
}
