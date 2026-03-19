import React from 'react'

export default function VelocityArrow({ velocity }) {
  if (velocity === null || velocity === undefined) return null

  const isPositive = velocity > 0
  const color = isPositive ? '#1A6B3C' : '#C0392B'
  const arrow = isPositive ? '\u25B2' : '\u25BC'
  const sign = isPositive ? '+' : ''

  return (
    <span className="font-mono text-lg" style={{ color }}>
      {arrow} {sign}{velocity.toFixed(1)}
    </span>
  )
}
