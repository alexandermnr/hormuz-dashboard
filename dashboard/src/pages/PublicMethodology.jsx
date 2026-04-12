import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0a1628' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '40px 24px' },
  pageTitle: { fontFamily: 'monospace', fontSize: '11px', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' },
  pageSubtitle: { fontFamily: 'monospace', fontSize: '13px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' },
  card: { borderTop: '1px solid #1a2a40', paddingTop: '24px', marginBottom: '0px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', paddingBottom: '24px' },
  cardHeaderDisabled: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'default', paddingBottom: '24px' },
  cardLeft: { flex: 1 },
  cardLabel: { fontFamily: 'monospace', fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e2e8f0', marginBottom: '6px' },
  cardDesc: { fontFamily: 'monospace', fontSize: '12px', color: '#64748b', lineHeight: '1.6' },
  badgeLive: { fontFamily: 'monospace', fontSize: '10px', color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '3px 10px', borderRadius: '2px', letterSpacing: '0.1em', whiteSpace: 'nowrap', marginLeft: '16px', marginTop: '4px' },
  badgeSoon: { fontFamily: 'monospace', fontSize: '10px', color: '#64748b', backgroundColor: 'rgba(100,116,139,0.1)', border: '1px solid rgba(100,116,139,0.3)', padding: '3px 10px', borderRadius: '2px', letterSpacing: '0.1em', whiteSpace: 'nowrap', marginLeft: '16px', marginTop: '4px' },
  chevron: { fontFamily: 'monospace', fontSize: '14px', color: '#c9a84c', marginLeft: '16px', marginTop: '4px', transition: 'transform 0.2s' },
  content: { paddingBottom: '32px' },
  footer: { borderTop: '1px solid #1a2a40', marginTop: '40px', paddingTop: '24px' },
  footerText: { fontFamily: 'monospace', fontSize: '10px', color: '#64748b', lineHeight: '1.6' },
  backLink: { fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', textDecoration: 'underline' },
}

const mdComponents = {
  h1: ({ children }) => <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#c9a84c', marginBottom: '8px', borderBottom: '1px solid #1a2a40', paddingBottom: '12px' }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '32px', marginBottom: '12px' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0', marginTop: '16px', marginBottom: '4px' }}>{children}</h3>,
  h4: ({ children }) => <h4 style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', marginTop: '12px', marginBottom: '4px' }}>{children}</h4>,
  p: ({ children }) => <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>{children}</p>,
  ul: ({ children }) => <ul style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '12px' }}>{children}</ul>,
  li: ({ children }) => <li style={{ marginBottom: '8px' }}>{children}</li>,
  table: ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '12px', marginBottom: '16px' }}>{children}</table>,
  thead: ({ children }) => <thead>{children}</thead>,
  th: ({ children }) => <th style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', borderBottom: '1px solid #1a2a40' }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: '6px 8px', color: '#cbd5e1', borderBottom: '1px solid #0a1628' }}>{children}</td>,
  code: ({ children }) => <code style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', backgroundColor: '#1a2a40', padding: '2px 6px', borderRadius: '3px' }}>{children}</code>,
  strong: ({ children }) => <strong style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{children}</strong>,
}

const HNI_MD = `## Product Description

The Hormuz Navigation Index (HNI) is a daily composite risk score ranging from 0 to 100 that quantifies disruption risk in the Strait of Hormuz corridor. A higher score indicates lower disruption risk (normalization), while a lower score indicates elevated disruption probability. The index aggregates 12 signals across five analytical layers, updated every six hours. This product is designed for audit support and informational purposes only.

## Data Sources & Layer Architecture

### Layer 1: Diplomatic (35% weight)

Iranian rial black market rate, diplomatic flight activity in Gulf airspace, IAEA enrichment compliance metrics. Captures political intent and diplomatic signaling.

#### IAEA Enrichment Signal — Two-Tier Keyword Scoring

Signal source: Exa neural search across AP, Reuters, Arms Control Association, Al Jazeera, iaea.org — last 7 days.

**Tier 1 — Leading Indicators (1.5x weight, 15 pts each):** Fires 30–60 days before enrichment announcements. Keywords: access denied, additional protocol, undeclared, expelled, monitoring gap, snap inspection, non-compliance, safeguards agreement, cameras removed, seals broken, inspector access. When matched: notes prefixed with "LEADING SIGNAL DETECTED."

**Tier 2 — Standard Indicators (1.0x weight, 10 pts each):** Confirms known enrichment events. Keywords: enrich, uranium, centrifuge, nuclear, iaea, weapons-grade, fissile, heavy water, reprocessing, natanz, fordow, 60%, 90%.

**Scoring:** \`raw_value = (leading_matches × 15) + (standard_matches × 10)\`, capped at 100.

**Rationale:** Leading keywords reflect inspector access restrictions and monitoring gaps that historically precede formal enrichment announcements by 30–60 days. Standard keywords confirm events already in the public domain.

### Layer 2: Maritime (10% weight)

Strait vessel transit count, Bandar Abbas port activity index, VLCC Arabian Gulf-East freight rate. Monitors physical flow through the corridor.

### Layer 3: Energy (35% weight)

CFTC net speculative positioning in crude futures, Brent-Dubai spread. Reflects market pricing of supply disruption probability.

### Layer 4: Credit (5% weight)

Gulf sovereign CDS average, high-yield credit spread proxy. Captures financial market stress signals specific to Gulf counterparties.

### Layer 5: Insurance (15% weight)

Lloyd's Joint War Committee listing status, war risk premium for Gulf transits. Reflects underwriter assessment of physical risk.

## Score Construction

Each raw signal is normalized to a 0–100 scale using predefined min/max ranges. Where a higher raw value indicates higher risk, the inversion flag produces: \`normalized = 100 - ((raw - min) / (max - min)) * 100\`. All normalized values are clamped to [0, 100].

Sub-scores within each layer are equally weighted and averaged to produce a layer score. The composite HNI is the weighted average of all five layer scores.

### Recency-Adjusted Staleness Handling

If any signal's most recent data point exceeds its staleness threshold (6 hours for Layers 1–3, 25 hours for Layers 4–5), that layer is flagged as STALE. If all layers are stale, the index outputs "DATA GAP" rather than a potentially misleading composite score. Partial staleness appends "(PARTIAL DATA)" to the status label.

## Status Classification

| Range | Label |
|-------|-------|
| 0–39 | LOW RISK |
| 40–59 | ELEVATED RISK |
| 60–74 | HIGH TENSION |
| 75–84 | CRITICAL |
| 85–100 | EXTREME |

## Update Frequency

The composite score is recalculated every 6 hours (00:00, 06:00, 12:00, 18:00 UTC). Anomaly detection runs daily at 05:00 UTC. Intelligence briefs are generated daily at 06:00 UTC following the first score calculation of the day.

## Historical Validation

Backtesting against historical Strait of Hormuz disruption events (May 2019 Fujairah tanker attacks, June 2019 drone incident, January 2020 Soleimani event) is documented separately in the backtest methodology report.

## Limitations

- Signal coverage is limited to publicly available data sources; classified or proprietary intelligence channels are not incorporated.
- The index is backward-looking by construction — it reflects conditions as of the most recent data update and cannot predict sudden escalatory events with no observable precursors.
- Normalization ranges are calibrated to historical extremes and may require periodic recalibration if market or geopolitical regimes shift structurally.

## Legal Disclaimer

This product provides data intelligence for informational and audit support purposes only. It does not constitute financial, legal, or operational advice. The HNI score and associated briefs are analytical outputs based on publicly available data and should not be the sole basis for any decision-making. Users assume all responsibility for how this information is applied.
`

const RSBI_MD = `## Product Description

The Red Sea Burden Index (RSBI) is a daily composite risk score ranging from 0 to 100 that quantifies maritime security risk and commercial disruption across the Red Sea corridor, with primary focus on the Bab el-Mandeb Strait and the approaches to the Suez Canal. A higher score indicates higher risk. The RSBI aggregates 13 signals across five analytical layers, updated daily at 06:30 UTC. This product is designed for audit support and informational purposes only.

## Data Sources & Layer Architecture

### Layer 1: Conflict & Threat Intelligence (20% weight)

GDELT conflict intensity (CAMEO codes 170–199, Bab el-Mandeb bounding box), Houthi attack event count, UKMTO advisory count, MARAD advisory level. Captures active hostility intensity and official maritime threat communications.

### Layer 2: Maritime Traffic (25% weight)

Red Sea vessel count (AIS-derived), IMF PortWatch Bab el-Mandeb transit calls, Jeddah port activity index. Monitors physical vessel flow through the corridor. Lower traffic produces a higher risk score.

### Layer 3: Energy & Commodity Markets (30% weight)

Brent–Dubai spread (EIA + FRED), Red Sea LNG premium, Cape rerouting proxy (article volume index). Reflects market pricing of Red Sea route disruption. This layer carries the highest composite weight as market prices aggregate a broad range of risk information.

### Layer 4: Credit Markets (5% weight)

Red Sea sovereign credit spread proxy (FRED). Captures financial market stress signals specific to Red Sea-adjacent economies. This layer may be retired if data returns unavailable for 7 or more consecutive days, with weight redistributed proportionally to Layers 2 and 5.

### Layer 5: Insurance & War Risk (20% weight)

Lloyd's Joint War Committee Red Sea listing status, war risk premium (Baltic Exchange and Lloyd's public filings via neural search). Reflects underwriter assessment of physical risk in the corridor.

## Score Construction

Each signal is independently normalized to a 0–100 scale using predefined min/max ranges. A higher normalized value always represents higher risk, regardless of the raw signal's natural direction. All values are clamped to [0, 100].

The composite RSBI is computed as a weighted sum across all active layers. Within each layer, signal weights are redistributed proportionally when a signal returns no data — redistribution is layer-scoped only and never crosses layers. If an entire layer returns no data, that layer's weight redistributes proportionally to remaining active layers.

### Freshness Factor

Each signal carries a freshness multiplier of 1.0 if updated within the past 30 days. Signals unchanged for more than 30 days receive a 0.5x weight multiplier. If fewer than 4 of 13 signals return valid data, no composite score is produced and the record is flagged as PIPELINE_FAILURE.

## Status Classification

| Range | Label | Description |
|-------|-------|-------------|
| 0–39 | LOW RISK | Normal corridor operations |
| 40–59 | ELEVATED RISK | Measurable stress in one or more layers |
| 60–74 | HIGH TENSION | Significant multi-layer disruption |
| 75–84 | CRITICAL | Severe operational disruption |
| 85–100 | EXTREME | Near-total corridor disruption |

## Update Frequency

The composite RSBI score is calculated daily at 06:30 UTC. Signal collection runs continuously: conflict and advisory signals update every 6 hours; vessel count and energy signals update daily; weekly signals (IMF PortWatch, LNG premium, war risk) update every Tuesday at 15:00 UTC.

## Data Classification

| Classification | Definition |
|----------------|------------|
| CALIBRATION | April 7–20, 2026. Not for external citation or performance attribution. |
| CLEAN DATA | April 21, 2026 onward. Basis for all accuracy analysis and performance reporting. |
| MISSING | No score produced for this date. Never cited, estimated, or interpolated. |
| CORRUPTED | Score produced with known data quality failure. Not for external citation. |
| PIPELINE_FAILURE | Fewer than 4 of 13 signals available. No composite score produced. |

Calibration period active April 7–20, 2026. The first citable RSBI score is April 21, 2026 at 06:30 UTC.

## Confirmed Event Definition

A Confirmed Event is a documented episode in which a significant RSBI score movement (typically ±5 points or greater over 48 hours) is corroborated by a verifiable primary source. Accepted sources: Associated Press, Reuters, UKMTO advisories, and MARAD maritime advisories. Confirmed events are logged manually by analysts after source verification. No automated system writes to the confirmed events record.

## Legal Disclaimer

This product provides data intelligence for informational and audit support purposes only. It does not constitute financial, legal, or operational advice. The RSBI score and associated outputs are analytical outputs based on publicly available data and should not be the sole basis for any decision-making. Users assume all responsibility for how this information is applied.

## AIS Data Limitation Disclosure

*Vessel transit data for the Strait of Hormuz is currently unavailable due to widespread AIS signal disruption during active conflict conditions, consistent with field reporting confirming approximately 50% of Hormuz transits are dark during the present threat environment; vessel count is excluded from composite scoring until the AIS environment normalizes.*
`

const indices = [
  {
    id: 'hni',
    label: 'HORMUZ',
    title: 'Hormuz Navigation Index',
    desc: 'Daily composite risk score for the Strait of Hormuz corridor — diplomatic, maritime, energy, credit, and insurance signals.',
    status: 'LIVE',
    content: HNI_MD,
  },
  {
    id: 'rsbi',
    label: 'RED SEA',
    title: 'Red Sea Burden Index',
    desc: 'Daily composite risk score for the Red Sea / Bab el-Mandeb corridor — conflict, maritime traffic, energy markets, credit, and war risk signals.',
    status: 'LIVE',
    content: RSBI_MD,
  },
  {
    id: 'semi',
    label: 'SEMICONDUCTORS',
    title: 'Semiconductor Supply Chain Stress Index',
    desc: 'Composite index tracking semiconductor supply chain disruption risk across critical manufacturing and logistics nodes.',
    status: 'COMING SOON',
    content: null,
  },
  {
    id: 'food',
    label: 'FOOD SUPPLY',
    title: 'Global Food Supply Chain Cascade Index',
    desc: 'Composite index measuring cascading disruption risk across global food supply chains and critical agricultural export corridors.',
    status: 'COMING SOON',
    content: null,
  },
]

export default function PublicMethodology() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <p style={styles.pageTitle}>Methodology</p>
        <p style={styles.pageSubtitle}>
          Scoring methodology, signal architecture, and data classification for each GRIT Terminal index.
          Click an index to expand its full methodology.
        </p>

        {indices.map((index) => {
          const isOpen = openId === index.id
          const isLive = index.status === 'LIVE'

          return (
            <div key={index.id} style={styles.card}>
              <div
                style={isLive ? styles.cardHeader : styles.cardHeaderDisabled}
                onClick={() => isLive && toggle(index.id)}
              >
                <div style={styles.cardLeft}>
                  <p style={styles.cardLabel}>{index.label}</p>
                  <p style={styles.cardTitle}>{index.title}</p>
                  <p style={styles.cardDesc}>{index.desc}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={isLive ? styles.badgeLive : styles.badgeSoon}>{index.status}</span>
                  {isLive && (
                    <span style={{ ...styles.chevron, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  )}
                </div>
              </div>

              {isOpen && index.content && (
                <div style={styles.content}>
                  <ReactMarkdown components={mdComponents}>{index.content}</ReactMarkdown>
                </div>
              )}
            </div>
          )
        })}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Data Intelligence Division. Methodology v1.1 — April 2026.
            Data intelligence only — not investment advice.
          </p>
          <p style={{ marginTop: '16px' }}>
            <a href="/public" style={styles.backLink}>← Live Score</a>
          </p>
        </div>
      </div>
    </div>
  )
}
