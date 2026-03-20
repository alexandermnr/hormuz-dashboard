import React from 'react'

const PHASE2 = [
  { name: 'Red Sea / Bab-el-Mandeb', desc: '15% of global trade. Houthi interdiction risk.', badge: 'NEXT' },
  { name: 'Taiwan Strait', desc: 'LNG and semiconductor shipping. PLA activity signals.', badge: null },
  { name: 'Suez Canal', desc: 'Egypt sovereign risk. Red Sea spillover index.', badge: null },
  { name: 'Turkish Straits', desc: 'Black Sea energy corridor. Russia/Ukraine grain exposure.', badge: null },
  { name: 'Panama Canal', desc: 'Drought and capacity risk. US east coast supply chain.', badge: null },
]

const PHASE3 = [
  { name: 'Semiconductor Supply Chain', desc: 'TSMC concentration. ASML export controls. Advanced packaging risk.' },
  { name: 'Critical Minerals', desc: 'Lithium, cobalt, rare earths. Concentration and export restriction index.' },
  { name: 'Battery Supply Chain', desc: 'Nickel, manganese, graphite. EV and defense supply risk.' },
  { name: 'Food and Agriculture', desc: 'Black Sea grain corridor. Fertilizer supply. Water stress index.' },
]

const PHASE4 = [
  { name: 'CBDC and Payment Rails', desc: 'Dollar alternative adoption. SWIFT exclusion risk. Cross-border disruption index.' },
  { name: 'Sovereign Debt Stress', desc: 'Emerging market CDS cascade risk. Contagion early warning.' },
  { name: 'Defense and Sanctions', desc: 'Export control tightening index. Dual-use technology flow disruption.' },
  { name: 'Cyber Infrastructure Risk', desc: 'Cloud concentration risk. Insurance premium leading indicators.' },
]

const GRIT_INDICES = [
  { label: 'Maritime Chokepoints', count: 6 },
  { label: 'Semiconductor Risk', count: 3 },
  { label: 'Critical Minerals', count: 5 },
  { label: 'Food and Agriculture', count: 3 },
  { label: 'Financial Infrastructure', count: 4 },
  { label: 'Defense and Sanctions', count: 3 },
]

function PhaseCard({ name, desc, badge }) {
  return (
    <div className="border border-gray-700 p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-mono text-xs font-bold">{name}</h4>
        {badge && (
          <span className="text-gold font-mono text-[10px] uppercase tracking-wider border border-gold px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white font-mono text-[10px] leading-relaxed">{desc}</p>
    </div>
  )
}

export default function Roadmap() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">Product Roadmap</p>
        <h1 className="text-white font-mono text-xl font-bold mb-2">
          From one strait to the global risk layer
        </h1>
        <p className="text-white font-mono text-xs leading-relaxed max-w-2xl">
          HIP is the proof of concept. The same 5-signal methodology scales to every chokepoint,
          commodity, and systemic risk that moves markets before news does.
        </p>
      </div>

      {/* Phase 1 — Live Now */}
      <div className="border border-gold p-5">
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-3">
          Phase 1 &#8212; Live Now
        </p>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-mono text-sm font-bold">Strait of Hormuz</h3>
            <p className="text-white font-mono text-[10px] mt-1">
              20% of global oil. 5 signal layers. Daily HNI score.
            </p>
          </div>
          <span className="text-navy bg-gold font-mono text-[10px] uppercase tracking-wider px-3 py-1 font-bold">
            Live
          </span>
        </div>
      </div>

      {/* Phase 2 — Chokepoints */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
          Phase 2 &#8212; Chokepoints (Q3&#8211;Q4 2026)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PHASE2.map((item) => (
            <PhaseCard key={item.name} {...item} />
          ))}
        </div>
      </div>

      {/* Phase 3 — Critical Materials */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
          Phase 3 &#8212; Critical Materials (2027)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PHASE3.map((item) => (
            <PhaseCard key={item.name} name={item.name} desc={item.desc} />
          ))}
        </div>
      </div>

      {/* Phase 4 — Financial Infrastructure */}
      <div>
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
          Phase 4 &#8212; Financial Infrastructure (2027&#8211;2028)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PHASE4.map((item) => (
            <PhaseCard key={item.name} name={item.name} desc={item.desc} />
          ))}
        </div>
      </div>

      {/* GRIT Terminal */}
      <div className="border border-gold p-6">
        <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
          The Destination &#8212; Month 12+
        </p>
        <h2 className="text-white font-mono text-lg font-bold mb-2">GRIT Terminal</h2>
        <p className="text-white font-mono text-xs leading-relaxed mb-6 max-w-2xl">
          Global Risk Intelligence Terminal. One institutional platform. Every chokepoint,
          every critical material, every financial infrastructure risk &#8212; scored daily
          using the same 5-signal methodology.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {GRIT_INDICES.map((item) => (
            <div key={item.label} className="border border-gray-700 p-3 text-center">
              <p className="text-gold font-mono text-lg font-bold">{item.count}</p>
              <p className="text-white font-mono text-[10px] uppercase tracking-wider mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <p className="text-white font-mono text-[10px] uppercase tracking-wider">
            Institutional pricing &#8212; annual contract
          </p>
          <p className="text-gold font-mono text-sm font-bold">
            $25,000 &#8211; $100,000 / year
          </p>
        </div>
      </div>
    </div>
  )
}
