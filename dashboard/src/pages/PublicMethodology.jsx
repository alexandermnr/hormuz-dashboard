import React from 'react'
import ReactMarkdown from 'react-markdown'

const METHODOLOGY_MD = `# Hormuz Navigation Index (HNI) — Methodology

## Product Description

The Hormuz Navigation Index (HNI) is a daily composite risk score ranging from 0 to 100 that quantifies disruption risk in the Strait of Hormuz corridor. A higher score indicates lower disruption risk (normalization), while a lower score indicates elevated disruption probability. The index aggregates 12 signals across five analytical layers, updated every six hours. This product is designed for audit support and informational purposes only.

## Data Sources & Layer Architecture

### Layer 1: Diplomatic (35% weight)

Iranian rial black market rate, diplomatic flight activity in Gulf airspace, IAEA enrichment compliance metrics. Captures political intent and diplomatic signaling.

#### IAEA Enrichment Signal \u2014 Two-Tier Keyword Scoring

Signal source: Exa neural search across AP, Reuters, Arms Control Association, Al Jazeera, iaea.org \u2014 last 7 days.

**Tier 1 \u2014 Leading Indicators (1.5x weight, 15 pts each):**
Fires 30\u201360 days before enrichment announcements. Keywords: access denied, additional protocol, undeclared, expelled, monitoring gap, snap inspection, non-compliance, safeguards agreement, cameras removed, seals broken, inspector access. When matched: notes prefixed with \u201cLEADING SIGNAL DETECTED.\u201d

**Tier 2 \u2014 Standard Indicators (1.0x weight, 10 pts each):**
Confirms known enrichment events. Keywords: enrich, uranium, centrifuge, nuclear, iaea, weapons-grade, fissile, heavy water, reprocessing, natanz, fordow, 60%, 90%.

**Scoring:** \`raw_value = (leading_matches \u00d7 15) + (standard_matches \u00d7 10)\`, capped at 100.

**Rationale:** Leading keywords reflect inspector access restrictions and monitoring gaps that historically precede formal enrichment announcements by 30\u201360 days. Standard keywords confirm events already in the public domain.

### Layer 2: Maritime (10% weight)

Strait vessel transit count, Bandar Abbas port activity index, VLCC Arabian Gulf-East freight rate. Monitors physical flow through the corridor.

### Layer 3: Energy (35% weight)

CFTC net speculative positioning in crude futures, Brent-Dubai spread. Reflects market pricing of supply disruption probability.

### Layer 4: Credit (5% weight)

Gulf sovereign CDS average, high-yield credit spread proxy. Captures financial market stress signals specific to Gulf counterparties.

### Layer 5: Insurance (15% weight)

Lloyd's Joint War Committee listing status, war risk premium for Gulf transits. Reflects underwriter assessment of physical risk.

## Score Construction

Each raw signal is normalized to a 0\u2013100 scale using predefined min/max ranges. Where a higher raw value indicates higher risk, the inversion flag produces: \`normalized = 100 - ((raw - min) / (max - min)) * 100\`. All normalized values are clamped to [0, 100].

Sub-scores within each layer are equally weighted and averaged to produce a layer score. The composite HNI is the weighted average of all five layer scores.

### Recency-Adjusted Staleness Handling

If any signal\u2019s most recent data point exceeds its staleness threshold (6 hours for Layers 1\u20133, 25 hours for Layers 4\u20135), that layer is flagged as STALE. If all layers are stale, the index outputs \u201cDATA GAP\u201d rather than a potentially misleading composite score. Partial staleness appends \u201c(PARTIAL DATA)\u201d to the status label.

## Status Classification

| Range | Label |
|-------|-------|
| 86\u2013100 | NORMALIZATION |
| 66\u201385 | ELEVATED RISK |
| 41\u201365 | HIGH TENSION |
| 0\u201340 | CRITICAL ALERT |

## Update Frequency

The composite score is recalculated every 6 hours (00:00, 06:00, 12:00, 18:00 UTC). Anomaly detection runs daily at 05:00 UTC. Intelligence briefs are generated daily at 06:00 UTC following the first score calculation of the day.

## Historical Validation

Backtesting against historical Strait of Hormuz disruption events (May 2019 Fujairah tanker attacks, June 2019 drone incident, January 2020 Soleimani event) is documented separately in the backtest methodology report.

## Limitations

- Signal coverage is limited to publicly available data sources; classified or proprietary intelligence channels are not incorporated.
- The index is backward-looking by construction \u2014 it reflects conditions as of the most recent data update and cannot predict sudden escalatory events with no observable precursors.
- Normalization ranges are calibrated to historical extremes and may require periodic recalibration if market or geopolitical regimes shift structurally.

## Legal Disclaimer

This product provides data intelligence for informational and audit support purposes only. It does not constitute financial, legal, or operational advice. The HNI score and associated briefs are analytical outputs based on publicly available data and should not be the sole basis for any decision-making. Users assume all responsibility for how this information is applied.
`

const components = {
  h1: ({ children }) => (
    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#c9a84c', marginBottom: '8px', borderBottom: '1px solid #1a2a40', paddingBottom: '12px' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '32px', marginBottom: '12px' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0', marginTop: '16px', marginBottom: '4px' }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '12px' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '8px' }}>{children}</li>
  ),
  table: ({ children }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '12px', marginBottom: '16px' }}>{children}</table>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  th: ({ children }) => (
    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', borderBottom: '1px solid #1a2a40' }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '6px 8px', color: '#cbd5e1', borderBottom: '1px solid #1a2a40' }}>{children}</td>
  ),
  code: ({ children }) => (
    <code style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', backgroundColor: '#1a2a40', padding: '2px 6px', borderRadius: '3px' }}>{children}</code>
  ),
}

export default function PublicMethodology() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a1628' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <ReactMarkdown components={components}>{METHODOLOGY_MD}</ReactMarkdown>

        <div style={{ borderTop: '1px solid #1a2a40', marginTop: '40px', paddingTop: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#64748b', lineHeight: '1.6' }}>
            Elite Forensic Group {'\u2014'} Data Intelligence Division. This document describes the methodology
            behind the Hormuz Navigation Index. Data intelligence only {'\u2014'} not investment advice.
          </p>
          <p style={{ marginTop: '16px' }}>
            <a href="/public" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', textDecoration: 'underline' }}>
              {'\u2190'} Live Score
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
