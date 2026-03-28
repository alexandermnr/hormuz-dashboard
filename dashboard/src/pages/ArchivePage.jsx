import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const STATUS_COLORS = {
  'LOW RISK': '#48bb78',
  'ELEVATED RISK': '#c9a84c',
  'HIGH TENSION': '#dd6b20',
  'CRITICAL': '#e53e3e',
  'EXTREME': '#7f1d1d',
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, '0') + ' ' + d.getFullYear()
}

function statusColor(label) {
  if (!label) return '#666666'
  const clean = label.replace(' (PARTIAL DATA)', '')
  return STATUS_COLORS[clean] || '#666666'
}

export default function ArchivePage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchArchive() {
      try {
        const { data, error: fetchErr } = await supabase
          .from('hni_scores')
          .select('score_date,composite_hni,status_label,layer1_score,layer2_score,layer3_score,layer4_score,layer5_score')
          .order('score_date', { ascending: false })
          .limit(30)

        if (fetchErr) throw fetchErr
        setRows(data || [])
      } catch (err) {
        console.error('Archive fetch failed:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchArchive()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#c9a84c' }}>Loading archive...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#e53e3e' }}>Archive temporarily unavailable.</div>
      </div>
    )
  }

  const cellBase = {
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '8px 10px',
    borderBottom: '1px solid #1a2a40',
    whiteSpace: 'nowrap',
  }

  const headerBase = {
    ...cellBase,
    fontSize: '10px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderBottom: '2px solid #1a2a40',
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center px-4 py-12">
      <div style={{ maxWidth: '900px', width: '100%' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gold font-mono text-sm uppercase tracking-[0.3em] mb-2 font-bold">
            Hormuz Risk Monitor {'\u2014'} Score Archive
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#cccccc', marginBottom: '4px' }}>
            30-day public record. Every score timestamped. Updated every 6 hours.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888888', fontStyle: 'italic' }}>
            This is a live audit trail of platform accuracy during the current geopolitical event.
          </p>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...headerBase, textAlign: 'left' }}>Date</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>HNI Score</th>
                <th style={{ ...headerBase, textAlign: 'left', paddingLeft: '16px' }}>Status</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>L1 Dip</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>L2 Mar</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>L3 Ene</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>L4 Cre</th>
                <th style={{ ...headerBase, textAlign: 'right' }}>L5 Ins</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const score = row.composite_hni != null ? Math.round(row.composite_hni) : '—'
                const label = (row.status_label || '').replace(' (PARTIAL DATA)', '')
                return (
                  <tr key={row.score_date}>
                    <td style={{ ...cellBase, color: '#cccccc', textAlign: 'left' }}>{formatDate(row.score_date)}</td>
                    <td style={{ ...cellBase, color: '#c9a84c', fontWeight: 'bold', textAlign: 'right' }}>{score}</td>
                    <td style={{ ...cellBase, color: statusColor(row.status_label), textAlign: 'left', paddingLeft: '16px' }}>{label || '—'}</td>
                    <td style={{ ...cellBase, color: '#999999', fontSize: '11px', textAlign: 'right' }}>{row.layer1_score ?? '—'}</td>
                    <td style={{ ...cellBase, color: '#999999', fontSize: '11px', textAlign: 'right' }}>{row.layer2_score ?? '—'}</td>
                    <td style={{ ...cellBase, color: '#999999', fontSize: '11px', textAlign: 'right' }}>{row.layer3_score ?? '—'}</td>
                    <td style={{ ...cellBase, color: '#999999', fontSize: '11px', textAlign: 'right' }}>{row.layer4_score ?? '—'}</td>
                    <td style={{ ...cellBase, color: '#999999', fontSize: '11px', textAlign: 'right' }}>{row.layer5_score ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center mt-8" style={{ borderTop: '1px solid #1a2a40', paddingTop: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666666', marginBottom: '12px' }}>
            Data intelligence only. Not a prediction or financial advice.
          </p>
          <a href="/public" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', textDecoration: 'underline' }}>
            {'\u2190'} Live Score
          </a>
        </div>
      </div>
    </div>
  )
}
