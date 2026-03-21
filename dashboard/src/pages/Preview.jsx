import React from 'react'

const LAYERS = [
  { id: 'L1', name: 'Diplomatic', weight: '35%', score: 72, detail: 'Rial black market: 580,000/USD. IAEA enrichment: 60% U-235. Anomalous flights: 3 detected.', badge: '▲ ANOMALY — enrichment elevated' },
  { id: 'L3', name: 'Energy', weight: '35%', score: 68, detail: 'CFTC net spec: +142K contracts. Brent-Dubai spread: $2.40.', badge: null },
  { id: 'L5', name: 'Insurance', weight: '15%', score: 74, detail: "Lloyd's JWC: Listed. War risk premium: 0.085%. Underwriters repricing Gulf exposure.", badge: '▲ LEADING — 3-5 weeks ahead of markets' },
  { id: 'L2', name: 'Maritime', weight: '10%', score: 65, detail: 'Vessel count: 42. VLCC AG-East: $18,200/day. Bandar Abbas: normal activity.', badge: null },
  { id: 'L4', name: 'Credit', weight: '5%', score: 61, detail: 'Gulf sovereign CDS: 142bps avg. HY spreads: +180bps.', badge: null },
]

const ASSETS = [
  { asset: 'Crude oil majors', ticker: 'XOM CVX', corr: 'High', pattern: 'Oil spikes follow HNI drops with 2-3 week lag', dir: '▲' },
  { asset: 'Tanker operators', ticker: 'STNG INSW FRO', corr: 'Very High', pattern: 'VLCC rates move with Layer 2 vessel data', dir: '▲' },
  { asset: 'Defense contractors', ticker: 'RTX LMT NOC', corr: 'Moderate', pattern: 'Diplomatic escalation precedes contract awards', dir: '▲' },
  { asset: 'Stablecoin issuers', ticker: 'CRCL', corr: 'Moderate', pattern: 'High oil → inflation → higher rates → reserve income boost', dir: '▲' },
  { asset: 'Shipping insurers', ticker: "Lloyd's vehicles", corr: 'High', pattern: 'Layer 5 war risk premium is their pricing input', dir: '▲' },
]

function getScoreColor(score) {
  if (score >= 86) return '#1A6B3C'
  if (score >= 66) return '#B7950B'
  if (score >= 41) return '#D35400'
  return '#C0392B'
}

export default function Preview() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Top Banner */}
      <div className="bg-gold px-4 py-3 text-center">
        <p className="text-navy font-mono text-sm font-bold uppercase tracking-wider">
          Tier 2 Dashboard Preview — Sample Data Only
        </p>
        <p className="text-navy font-mono text-[10px] mt-1">
          This is what subscribers see every day. Real data updates every 6 hours.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Score Card */}
        <div className="border border-gray-700 p-8 text-center">
          <p className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
            HNI — Hormuz Nervousness Index
          </p>
          <div className="font-mono font-bold text-[96px] leading-none" style={{ color: getScoreColor(69) }}>
            69
          </div>
          <div className="mt-2 font-mono text-sm uppercase tracking-widest" style={{ color: getScoreColor(69) }}>
            Elevated Risk
          </div>
          <div className="mt-3 text-white font-mono text-xs">
            <span className="text-green-400">{'▲'}</span> +0.4 vs yesterday
          </div>
          <div className="mt-1 text-white font-mono text-[10px]">Score date: 2026-03-20</div>
        </div>

        {/* Five Layer Cards */}
        <div>
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Signal Layers</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {LAYERS.map((l) => (
              <div key={l.id} className="border border-gray-700 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-white font-mono text-[10px] mr-2">{l.id}</span>
                    <span className="text-white font-mono text-xs font-bold">{l.name}</span>
                    <span className="text-white font-mono text-[10px] ml-2">{l.weight}</span>
                  </div>
                  <span className="font-mono text-lg font-bold" style={{ color: getScoreColor(l.score) }}>
                    {l.score}
                  </span>
                </div>
                <p className="text-white font-mono text-[10px] leading-relaxed mb-2">{l.detail}</p>
                {l.badge && (
                  <p className="text-gold font-mono text-[10px] font-bold">{l.badge}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sample Brief */}
        <div className="border border-gray-700 p-5">
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-3">
            Today's Intelligence Brief — Sample
          </p>
          <p className="text-white font-mono text-xs leading-relaxed mb-4">
            Primary driver: Insurance and diplomatic signals diverging from energy markets.
            Layer 5 insurance signals reached 0.085% war risk premium overnight — a level
            last seen during the 2019 tanker incident. IAEA enrichment readings confirm 60%
            U-235, above the threshold that historically precedes diplomatic escalation within
            4-6 weeks.
          </p>
          <div className="relative">
            <div className="text-white font-mono text-xs leading-relaxed blur-sm select-none" aria-hidden="true">
              The combination of rising insurance premiums and enrichment levels creates a
              compound signal that has historically preceded significant maritime disruption
              events. Layer 2 maritime data shows normal vessel throughput, suggesting markets
              have not yet priced in the insurance-diplomatic divergence. This lag typically
              resolves within 2-3 weeks as commercial underwriters adjust coverage terms.
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gold font-mono text-xs font-bold bg-navy/90 px-4 py-2">
                {'▸'} Full brief: 847 words — Tier 2 subscribers only
              </p>
            </div>
          </div>
        </div>

        {/* Correlated Asset Watchlist */}
        <div className="border border-gray-700 p-5">
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
            Correlated Asset Watchlist
          </p>
          <p className="text-white font-mono text-[10px] mb-4">
            Historical correlations only. Not a recommendation. Subscribers draw their own conclusions from signal data.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-gold font-mono text-[10px] uppercase tracking-wider py-2 pr-3">Asset</th>
                  <th className="text-gold font-mono text-[10px] uppercase tracking-wider py-2 pr-3">Ticker</th>
                  <th className="text-gold font-mono text-[10px] uppercase tracking-wider py-2 pr-3">Correlation</th>
                  <th className="text-gold font-mono text-[10px] uppercase tracking-wider py-2 pr-3">Historical Pattern</th>
                  <th className="text-gold font-mono text-[10px] uppercase tracking-wider py-2">Signal</th>
                </tr>
              </thead>
              <tbody>
                {ASSETS.map((a) => (
                  <tr key={a.ticker} className="border-b border-gray-800">
                    <td className="text-white font-mono text-[10px] py-2 pr-3">{a.asset}</td>
                    <td className="text-white font-mono text-[10px] py-2 pr-3">{a.ticker}</td>
                    <td className="text-white font-mono text-[10px] py-2 pr-3">{a.corr}</td>
                    <td className="text-white font-mono text-[10px] py-2 pr-3">{a.pattern}</td>
                    <td className="text-green-400 font-mono text-xs py-2">{a.dir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Telegram Alert Sample */}
        <div className="border border-gray-700 p-4 max-w-md">
          <div className="bg-[#1a2332] border border-gray-600 rounded p-4 font-mono text-xs text-white leading-relaxed">
            <p>{'\ud83d\udd34'} HIP CRITICAL ALERT</p>
            <p className="mt-1">HNI dropped to 38 — CRITICAL threshold crossed.</p>
            <p>Layer 5: War risk premium spiked +40% in 6 hours.</p>
            <p>Layer 1: Anomalous diplomatic flights detected.</p>
            <p className="mt-1 text-white">Time: 2026-03-20 14:32 UTC</p>
            <p className="text-white">— Hormuz Intelligence Platform</p>
          </div>
          <p className="text-white font-mono text-[10px] mt-2">
            Tier 2+ subscribers receive instant Telegram alerts when HNI crosses CRITICAL threshold
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-6 space-y-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/trial"
              className="inline-block px-8 py-3 bg-gold text-navy font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold/90"
            >
              Start 7-Day Free Trial — $199/mo after
            </a>
            <a
              href="/pricing"
              className="inline-block px-8 py-3 border border-gold text-gold font-mono text-sm font-bold uppercase tracking-wider hover:bg-gold/10"
            >
              View Full Pricing
            </a>
          </div>
          <p className="text-white font-mono text-[10px]">
            No credit card required for trial. Cancel anytime before day 7.
          </p>
        </div>
      </div>
    </div>
  )
}
