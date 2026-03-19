import React from 'react'

const SEVERITY_COLORS = {
  CRITICAL: '#C0392B',
  ANOMALY: '#D35400',
  STALE_DATA: '#B7950B',
  BRIEF_HOLD: '#B7950B',
}

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-navy-light border border-navy-mid rounded p-4">
        <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Recent Alerts</h3>
        <p className="text-gray-500 text-xs font-mono">No active alerts</p>
      </div>
    )
  }

  return (
    <div className="bg-navy-light border border-navy-mid rounded p-4">
      <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Recent Alerts</h3>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={alert.id || i} className="flex items-start gap-2 text-xs font-mono">
            <span
              className="shrink-0 mt-0.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: SEVERITY_COLORS[alert.alert_type] || '#888' }}
            />
            <div className="flex-1">
              <span style={{ color: SEVERITY_COLORS[alert.alert_type] || '#888' }}>
                [{alert.alert_type}]
              </span>{' '}
              <span className="text-gray-300">{alert.message}</span>
              <div className="text-gray-600 mt-0.5">
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
