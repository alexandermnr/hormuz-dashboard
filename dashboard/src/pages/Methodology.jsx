import React from 'react'

export default function Methodology() {
  return (
    <div className="max-w-3xl space-y-8 text-sm font-mono leading-relaxed">
      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Product Description</h2>
        <p className="text-gray-300">
          The Hormuz Navigation Index (HNI) is a daily composite risk score ranging from 0 to 100 that
          quantifies disruption risk in the Strait of Hormuz corridor. A higher score indicates lower
          disruption risk (normalization), while a lower score indicates elevated disruption probability.
          The index aggregates 12 signals across five analytical layers, updated every six hours. This
          product is designed for audit support and informational purposes only.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Data Sources &amp; Layer Architecture</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-200 mb-1">Layer 1: Diplomatic (35% weight)</h3>
            <p className="text-gray-400 text-xs">
              Iranian rial black market rate, diplomatic flight activity in Gulf airspace,
              IAEA enrichment compliance metrics. Captures political intent and diplomatic signaling.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 2: Maritime (10% weight)</h3>
            <p className="text-gray-400 text-xs">
              Strait vessel transit count, Bandar Abbas port activity index, VLCC Arabian Gulf-East
              freight rate. Monitors physical flow through the corridor.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 3: Energy (35% weight)</h3>
            <p className="text-gray-400 text-xs">
              CFTC net speculative positioning in crude futures, Brent-Dubai spread.
              Reflects market pricing of supply disruption probability.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 4: Credit (5% weight)</h3>
            <p className="text-gray-400 text-xs">
              Gulf sovereign CDS average, high-yield credit spread proxy.
              Captures financial market stress signals specific to Gulf counterparties.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 5: Insurance (15% weight)</h3>
            <p className="text-gray-400 text-xs">
              Lloyd&apos;s Joint War Committee listing status, war risk premium for Gulf transits.
              Reflects underwriter assessment of physical risk.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Score Construction</h2>
        <p className="text-gray-300 mb-2">
          Each raw signal is normalized to a 0-100 scale using predefined min/max ranges. Where a
          higher raw value indicates higher risk, the inversion flag produces: normalized = 100 - ((raw - min) / (max - min)) * 100.
          All normalized values are clamped to [0, 100].
        </p>
        <p className="text-gray-300 mb-2">
          Sub-scores within each layer are equally weighted and averaged to produce a layer score.
          The composite HNI is the weighted average of all five layer scores.
        </p>
        <h3 className="text-gray-200 text-xs mt-4 mb-1">Recency-Adjusted Staleness Handling</h3>
        <p className="text-gray-300">
          If any signal&apos;s most recent data point exceeds 8 hours of age, that layer is flagged as
          STALE. Stale layers receive a 40% reduction in their weight contribution, with the reduced
          weight redistributed proportionally among non-stale layers. If all layers are stale, the
          index outputs &ldquo;DATA GAP&rdquo; rather than a potentially misleading composite score. Partial
          staleness appends &ldquo;(PARTIAL DATA)&rdquo; to the status label.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Status Classification</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-navy-light">
              <th className="text-left py-1">Range</th>
              <th className="text-left py-1">Label</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-navy-mid/30"><td className="py-1">86 &ndash; 100</td><td>NORMALIZATION</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">66 &ndash; 85</td><td>ELEVATED RISK</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">41 &ndash; 65</td><td>HIGH TENSION</td></tr>
            <tr><td className="py-1">0 &ndash; 40</td><td>CRITICAL ALERT</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Update Frequency</h2>
        <p className="text-gray-300">
          The composite score is recalculated every 6 hours (00:00, 06:00, 12:00, 18:00 UTC).
          Anomaly detection runs daily at 05:00 UTC. Intelligence briefs are generated daily at
          06:00 UTC following the first score calculation of the day.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Historical Validation</h2>
        <p className="text-gray-400 italic">
          Backtesting against historical Strait of Hormuz disruption events (May 2019 Fujairah tanker
          attacks, June 2019 drone incident, January 2020 Soleimani event) is documented separately
          in the backtest methodology report.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Limitations</h2>
        <ul className="text-gray-300 space-y-2 list-disc list-inside">
          <li>
            Signal coverage is limited to publicly available data sources; classified or proprietary
            intelligence channels are not incorporated.
          </li>
          <li>
            The index is backward-looking by construction — it reflects conditions as of the most recent
            data update and cannot predict sudden escalatory events with no observable precursors.
          </li>
          <li>
            Normalization ranges are calibrated to historical extremes and may require periodic
            recalibration if market or geopolitical regimes shift structurally.
          </li>
        </ul>
      </section>

      <section className="border-t border-navy-light pt-4">
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Legal Disclaimer</h2>
        <p className="text-gray-500 text-xs">
          This product provides data intelligence for informational and audit support purposes only.
          It does not constitute financial, legal, or operational advice. The HNI score and associated
          briefs are analytical outputs based on publicly available data and should not be the sole
          basis for any decision-making. Users assume all responsibility for how this information is applied.
        </p>
      </section>
    </div>
  )
}
