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
            <tr className="border-b border-navy-mid/30"><td className="py-1">0 &ndash; 39</td><td>LOW RISK</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">40 &ndash; 59</td><td>ELEVATED RISK</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">60 &ndash; 74</td><td>HIGH TENSION</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">75 &ndash; 84</td><td>CRITICAL</td></tr>
            <tr><td className="py-1">85 &ndash; 100</td><td>EXTREME</td></tr>
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


      {/* ============================================================ */}
      {/* RED SEA BURDEN INDEX — RSBI */}
      {/* ============================================================ */}

      <section className="border-t border-navy-light pt-6 mt-4">
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Red Sea Burden Index (RSBI)</h2>
        <p className="text-gray-300">
          The Red Sea Burden Index (RSBI) is a daily composite risk score ranging from 0 to 100
          that quantifies maritime security risk and commercial disruption across the Red Sea corridor,
          with primary focus on the Bab el-Mandeb Strait and the approaches to the Suez Canal.
          A higher score indicates higher risk. The RSBI aggregates 13 signals across five analytical
          layers, updated daily at 06:30 UTC. This product is designed for audit support and
          informational purposes only.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Data Sources &amp; Layer Architecture</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-200 mb-1">Layer 1: Conflict &amp; Threat Intelligence (20% weight)</h3>
            <p className="text-gray-400 text-xs">
              GDELT conflict intensity (CAMEO codes 170&ndash;199, Bab el-Mandeb bounding box),
              Houthi attack event count, UKMTO advisory count, MARAD advisory level.
              Captures active hostility intensity and official maritime threat communications.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 2: Maritime Traffic (25% weight)</h3>
            <p className="text-gray-400 text-xs">
              Red Sea vessel count (AIS-derived), IMF PortWatch Bab el-Mandeb transit calls,
              Jeddah port activity index. Monitors physical vessel flow through the corridor.
              Lower traffic produces a higher risk score.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 3: Energy &amp; Commodity Markets (30% weight)</h3>
            <p className="text-gray-400 text-xs">
              Brent&ndash;Dubai spread (EIA + FRED), Red Sea LNG premium, Cape rerouting proxy
              (article volume index). Reflects market pricing of Red Sea route disruption.
              This layer carries the highest composite weight as market prices aggregate
              a broad range of risk information.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 4: Credit Markets (5% weight)</h3>
            <p className="text-gray-400 text-xs">
              Red Sea sovereign credit spread proxy (FRED). Captures financial market stress
              signals specific to Red Sea-adjacent economies. This layer may be retired if data
              returns unavailable for 7 or more consecutive days, with weight redistributed
              proportionally to Layers 2 and 5.
            </p>
          </div>
          <div>
            <h3 className="text-gray-200 mb-1">Layer 5: Insurance &amp; War Risk (20% weight)</h3>
            <p className="text-gray-400 text-xs">
              Lloyd&apos;s Joint War Committee Red Sea listing status, war risk premium
              (Baltic Exchange and Lloyd&apos;s public filings via neural search).
              Reflects underwriter assessment of physical risk in the corridor.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Score Construction</h2>
        <p className="text-gray-300 mb-2">
          Each signal is independently normalized to a 0&ndash;100 scale using predefined min/max
          ranges. A higher normalized value always represents higher risk, regardless of the raw
          signal&apos;s natural direction. All values are clamped to [0, 100].
        </p>
        <p className="text-gray-300 mb-2">
          The composite RSBI is computed as a weighted sum across all active layers.
          Within each layer, signal weights are redistributed proportionally when a signal
          returns no data &mdash; redistribution is layer-scoped only and never crosses layers.
          If an entire layer returns no data, that layer&apos;s weight redistributes proportionally
          to remaining active layers.
        </p>
        <h3 className="text-gray-200 text-xs mt-4 mb-1">Freshness Factor</h3>
        <p className="text-gray-300">
          Each signal carries a freshness multiplier of 1.0 if updated within the past 30 days.
          Signals unchanged for more than 30 days receive a 0.5x weight multiplier.
          If fewer than 4 of 13 signals return valid data, no composite score is produced
          and the record is flagged as PIPELINE_FAILURE.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Status Classification</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-navy-light">
              <th className="text-left py-1">Range</th>
              <th className="text-left py-1">Label</th>
              <th className="text-left py-1">Description</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-navy-mid/30"><td className="py-1">0 &ndash; 39</td><td>LOW RISK</td><td className="text-gray-400">Normal corridor operations</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">40 &ndash; 59</td><td>ELEVATED RISK</td><td className="text-gray-400">Measurable stress in one or more layers</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">60 &ndash; 74</td><td>HIGH TENSION</td><td className="text-gray-400">Significant multi-layer disruption</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">75 &ndash; 84</td><td>CRITICAL</td><td className="text-gray-400">Severe operational disruption</td></tr>
            <tr><td className="py-1">85 &ndash; 100</td><td>EXTREME</td><td className="text-gray-400">Near-total corridor disruption</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Update Frequency</h2>
        <p className="text-gray-300">
          The composite RSBI score is calculated daily at 06:30 UTC. Signal collection runs
          continuously: conflict and advisory signals update every 6 hours; vessel count and
          energy signals update daily; weekly signals (IMF PortWatch, LNG premium, war risk)
          update every Tuesday at 15:00 UTC. The health check runs daily at 07:00 UTC.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Data Classification</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-navy-light">
              <th className="text-left py-1">Classification</th>
              <th className="text-left py-1">Definition</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-navy-mid/30"><td className="py-1">CALIBRATION</td><td className="text-gray-400">April 7&ndash;20, 2026. Not for external citation.</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">CLEAN DATA</td><td className="text-gray-400">April 21, 2026 onward. Basis for all accuracy reporting.</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">MISSING</td><td className="text-gray-400">No score produced. Never cited or interpolated.</td></tr>
            <tr className="border-b border-navy-mid/30"><td className="py-1">CORRUPTED</td><td className="text-gray-400">Known data quality failure. Not for external citation.</td></tr>
            <tr><td className="py-1">PIPELINE_FAILURE</td><td className="text-gray-400">Fewer than 4 of 13 signals available. No score produced.</td></tr>
          </tbody>
        </table>
        <p className="text-gray-400 text-xs mt-3">
          Calibration period active April 7&ndash;20, 2026. The first citable RSBI score
          is April 21, 2026 at 06:30 UTC.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Confirmed Event Definition</h2>
        <p className="text-gray-300">
          A Confirmed Event is a documented episode in which a significant RSBI score movement
          (typically &plusmn;5 points or greater over 48 hours) is corroborated by a verifiable
          primary source. Accepted sources: Associated Press, Reuters, UKMTO advisories,
          and MARAD maritime advisories. Confirmed events are logged manually by EFG analysts
          after source verification. No automated system writes to the confirmed events record.
        </p>
      </section>

      <section>
        <h2 className="text-gold text-xs uppercase tracking-widest mb-3">Methodology Versioning</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-navy-light">
              <th className="text-left py-1">Version</th>
              <th className="text-left py-1">Date</th>
              <th className="text-left py-1">Change</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-navy-mid/30"><td className="py-1">v1.0</td><td>March 2026</td><td className="text-gray-400">HNI methodology published</td></tr>
            <tr><td className="py-1">v1.1</td><td>April 2026</td><td className="text-gray-400">RSBI methodology section added</td></tr>
          </tbody>
        </table>
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
