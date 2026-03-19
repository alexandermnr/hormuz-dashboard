import React from 'react'
import { getScoreColor } from './ScoreDisplay'

const LAYER_NAMES = {
  1: 'Diplomatic',
  2: 'Maritime',
  3: 'Energy',
  4: 'Credit',
  5: 'Insurance',
}

const LAYER_WEIGHTS = {
  1: '35%',
  2: '10%',
  3: '35%',
  4: '5%',
  5: '15%',
}

export default function LayerBars({ layerScores }) {
  if (!layerScores) return null

  return (
    <div className="space-y-2">
      <h3 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Layer Scores</h3>
      {[1, 2, 3, 4, 5].map((layer) => {
        const score = layerScores[`l${layer}_score`] ?? 0
        const color = getScoreColor(score)
        return (
          <div key={layer} className="flex items-center gap-3">
            <div className="w-28 text-xs font-mono text-gray-400 shrink-0">
              L{layer} {LAYER_NAMES[layer]} <span className="text-gray-600">({LAYER_WEIGHTS[layer]})</span>
            </div>
            <div className="flex-1 bg-navy-light rounded h-4 overflow-hidden">
              <div
                className="h-full rounded transition-none"
                style={{
                  width: `${Math.max(score, 1)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="w-8 text-right text-xs font-mono" style={{ color }}>
              {Math.round(score)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
