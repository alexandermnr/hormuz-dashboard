import React from 'react'

export function getScoreColor(score, status) {
  if (status === 'DATA GAP') return '#888888'
  if (score >= 86) return '#1A6B3C'
  if (score >= 66) return '#B7950B'
  if (score >= 41) return '#D35400'
  return '#C0392B'
}

export default function ScoreDisplay({ score, status, size = 'large' }) {
  const color = getScoreColor(score, status)
  const fontSize = size === 'large' ? '96px' : '64px'

  return (
    <div className="text-center">
      <div
        className="font-mono font-bold leading-none"
        style={{ fontSize, color }}
      >
        {status === 'DATA GAP' ? '—' : Math.round(score)}
      </div>
      <div
        className="mt-2 text-sm font-mono tracking-widest uppercase"
        style={{ color }}
      >
        {status}
      </div>
    </div>
  )
}
