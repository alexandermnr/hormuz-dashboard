import React, { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — Hormuz Intelligence Platform'
  }, [])

  return (
    <div className="min-h-screen bg-navy px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gold font-mono text-xs uppercase tracking-[0.3em] mb-2">
            Hormuz Intelligence Platform
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <h2 className="text-gray-200 font-mono text-lg">Terms of Service</h2>
          <p className="text-gray-500 font-mono text-xs mt-2">
            Version 1.0 — Effective March 19, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm font-mono leading-relaxed">

          {/* Section 1 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              1. Nature of Service
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                The Hormuz Intelligence Platform (&ldquo;HIP&rdquo;), operated by Elite Forensic Group,
                provides data aggregation, signal processing, and intelligence synthesis
                focused on the Strait of Hormuz corridor.
              </p>
              <p>
                All HIP output &mdash; including the Hormuz Navigation Index (HNI) score,
                daily intelligence briefs, signal dashboards, alerts, and prediction market
                monitoring data &mdash; is strictly informational. It is produced for audit
                support and institutional risk monitoring purposes only.
              </p>
              <p className="text-gray-400 border-l-2 border-gold pl-4">
                HIP is not an investment advisory service. HIP does not provide financial
                recommendations or guidance on securities, commodities, or any financial
                instrument. No output from HIP should be interpreted as such.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              2. Forbidden Interpretation Acknowledgment
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                By subscribing to HIP, you explicitly acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  No HNI score, regardless of its level or direction of change, constitutes
                  a recommendation to acquire, dispose of, or maintain any security,
                  commodity, or financial instrument.
                </li>
                <li>
                  No daily intelligence brief, alert, status label, or dashboard element
                  is intended as guidance for any financial decision.
                </li>
                <li>
                  The presence of prediction market data on the HIP dashboard is for
                  analytical monitoring only and does not represent a recommendation
                  to participate in any prediction market contract.
                </li>
                <li>
                  Edge signals, Kelly sizing labels, and implied probability mappings
                  are theoretical analytical outputs displayed for research purposes.
                  They are not instructions or suggestions.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              3. Subscriber Responsibility
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                You are solely responsible for any decisions you make based on, or
                informed by, HIP output. HIP provides data &mdash; you provide the judgment.
              </p>
              <p>
                If you use HIP data as one input among many in your own decision-making
                process, you accept full responsibility for those decisions and their
                outcomes. HIP bears no responsibility for actions taken by subscribers
                or any third party that receives HIP output.
              </p>
              <p>
                You agree not to redistribute, republish, or resell HIP data, briefs,
                or scores without prior written authorization from Elite Forensic Group.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              4. Data Source Disclosure
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                The HNI score aggregates 12 signals across five analytical layers.
                Data sources include:
              </p>

              <div className="bg-navy-light border border-navy-mid rounded p-4 space-y-3">
                <div>
                  <span className="text-gold text-xs">Layer 1 &mdash; Diplomatic</span>
                  <p className="text-gray-400 text-xs mt-1">
                    Iranian rial unofficial exchange rate (Bonbast.com), Gulf airspace
                    flight tracking (adsb.fi ADS-B data), IAEA press releases and
                    enrichment reports (iaea.org).
                  </p>
                </div>
                <div>
                  <span className="text-gold text-xs">Layer 2 &mdash; Maritime</span>
                  <p className="text-gray-400 text-xs mt-1">
                    Strait vessel transit counts (AISstream, MarineTraffic), Bandar Abbas
                    port activity (satellite and shipping intelligence aggregators),
                    VLCC Arabian Gulf&ndash;East freight rates (Hellenic Shipping News, Baltic Exchange).
                  </p>
                </div>
                <div>
                  <span className="text-gold text-xs">Layer 3 &mdash; Energy</span>
                  <p className="text-gray-400 text-xs mt-1">
                    CFTC Commitments of Traders reports (public CFTC data),
                    Brent&ndash;Dubai crude spread (commodity data providers).
                  </p>
                </div>
                <div>
                  <span className="text-gold text-xs">Layer 4 &mdash; Credit</span>
                  <p className="text-gray-400 text-xs mt-1">
                    Gulf sovereign CDS spreads &mdash; UAE, Saudi Arabia, Kuwait (credit data providers),
                    US high-yield credit spread proxy (ICE BofA HY index).
                  </p>
                </div>
                <div>
                  <span className="text-gold text-xs">Layer 5 &mdash; Insurance</span>
                  <p className="text-gray-400 text-xs mt-1">
                    Lloyd&apos;s Joint War Committee listed area status (LMA),
                    war risk insurance premiums for Gulf transits (insurance market monitoring).
                  </p>
                </div>
              </div>

              <p className="text-gray-400">
                All data is sourced from publicly available third-party providers. These
                sources may contain errors, experience delays, or have coverage gaps.
                HIP does not guarantee the accuracy, completeness, or timeliness of any
                third-party data.
              </p>
              <p className="text-gray-400">
                <span className="text-yellow-500">AIS data note:</span> Automatic
                Identification System vessel tracking data is subject to spoofing,
                signal loss, and intentional transponder deactivation. HIP
                cross-validates AISstream data against MarineTraffic where available
                to mitigate this risk, but cannot guarantee complete accuracy of
                vessel position or count data.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              5. Prediction Market Disclaimer
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                The HIP dashboard displays prediction market data from Kalshi
                (CFTC-regulated) and Polymarket (monitoring only). This data is
                presented for analytical context and cross-reference with HNI signals.
              </p>
              <p>
                HNI-implied disruption probabilities are derived from a theoretical
                mapping function that has not been empirically calibrated at launch.
                These probabilities are analytical estimates, not forecasts.
              </p>
              <p className="text-gray-400 border-l-2 border-red-700 pl-4">
                PAPER TRADING MODE is active for a minimum of 90 days from launch.
                During this period, all edge signals and position sizing labels
                (SMALL, HALF_KELLY, MAXIMUM) are displayed for analytical observation
                only. No prediction market activity is recommended. HIP does not
                recommend, suggest, or endorse any prediction market activity at any time.
              </p>
              <p className="text-gray-400">
                US persons: Kalshi is a CFTC-regulated exchange accessible to US
                residents. Polymarket data is displayed for monitoring purposes only
                and should not be accessed for participation by US persons where
                prohibited.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              6. Limitation of Liability
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                HIP and Elite Forensic Group provide this service on an &ldquo;as is&rdquo;
                and &ldquo;as available&rdquo; basis. We make no warranties, express or implied,
                regarding the accuracy, reliability, or fitness for any particular
                purpose of any HIP output.
              </p>
              <p>
                In no event shall HIP, Elite Forensic Group, its officers, directors,
                employees, or affiliates be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of
                or inability to use the service.
              </p>
              <p className="text-gray-200 border-l-2 border-gold pl-4">
                Total liability of HIP and Elite Forensic Group for any claim arising
                from or related to this service is limited to the subscription fees
                you have paid in the 30 days immediately preceding the event giving
                rise to the claim.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              7. Cancellation
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                You may cancel your subscription at any time through your Stripe
                billing portal or by contacting support at alexandermnr@yahoo.com.
              </p>
              <p>
                Upon cancellation, your subscription remains active until the end of
                the current billing period. No refunds are issued for the remaining
                portion of a billing period already in progress.
              </p>
              <p>
                When your subscription period ends, access to the subscriber dashboard,
                daily briefs, and signal data will be terminated. Access to the public
                score page remains available.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              8. Data Handling
            </h3>
            <p className="text-gray-500 text-xs mb-3">
              In compliance with GDPR Article 13 and applicable data protection law.
            </p>
            <div className="text-gray-300 space-y-3">
              <div className="bg-navy-light border border-navy-mid rounded p-4 space-y-3 text-xs">
                <div>
                  <span className="text-gold">Data Controller</span>
                  <p className="text-gray-400 mt-1">
                    Elite Forensic Group. Contact: alexandermnr@yahoo.com
                  </p>
                </div>
                <div>
                  <span className="text-gold">Data Collected</span>
                  <p className="text-gray-400 mt-1">
                    Email address, name (if provided), payment information (processed
                    by Stripe &mdash; HIP does not store card details), subscription tier,
                    account activity timestamps, and communication preferences.
                  </p>
                </div>
                <div>
                  <span className="text-gold">Legal Basis for Processing</span>
                  <p className="text-gray-400 mt-1">
                    Performance of contract (delivering the subscribed service), legitimate
                    interest (service improvement and security), and consent (marketing
                    communications, where applicable).
                  </p>
                </div>
                <div>
                  <span className="text-gold">Data Retention</span>
                  <p className="text-gray-400 mt-1">
                    Subscriber data is retained for the duration of the subscription plus
                    12 months following cancellation, after which it is permanently deleted.
                    Payment records are retained as required by applicable tax and
                    financial reporting obligations.
                  </p>
                </div>
                <div>
                  <span className="text-gold">Your Rights</span>
                  <p className="text-gray-400 mt-1">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 mt-1 space-y-1">
                    <li>Access your personal data held by HIP</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
                    <li>Request portability of your data in a machine-readable format</li>
                    <li>Object to processing based on legitimate interest</li>
                    <li>Withdraw consent for marketing communications at any time</li>
                  </ul>
                </div>
                <div>
                  <span className="text-gold">Data Requests</span>
                  <p className="text-gray-400 mt-1">
                    To exercise any of these rights, contact: alexandermnr@yahoo.com.
                    We will respond within 30 days. If you are unsatisfied with our
                    response, you have the right to lodge a complaint with your local
                    data protection supervisory authority.
                  </p>
                </div>
                <div>
                  <span className="text-gold">Third-Party Processors</span>
                  <p className="text-gray-400 mt-1">
                    Stripe (payment processing), Beehiiv (email delivery), Supabase
                    (data infrastructure), Render (hosting). Each processor operates
                    under its own privacy policy and data processing agreements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h3 className="text-gold text-xs uppercase tracking-widest mb-3">
              9. Terms Version and Changes
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                These terms are version-dated. The current version is <strong>1.0</strong>,
                effective <strong>March 19, 2026</strong>.
              </p>
              <p>
                If we make material changes to these terms, we will notify all active
                subscribers by email at least 14 days before the changes take effect.
                Continued use of HIP after the effective date of updated terms
                constitutes acceptance of those terms.
              </p>
              <p>
                Non-material changes (formatting, clarifications that do not alter
                meaning) may be made without advance notice but will be reflected in
                an updated version date.
              </p>
            </div>
          </section>

          {/* Closing */}
          <section className="border-t border-navy-light pt-8">
            <p className="text-gray-500 text-xs">
              This document provides the complete terms governing your use of the
              Hormuz Intelligence Platform. By subscribing, you confirm that you have
              read, understood, and agreed to these terms.
            </p>
            <p className="text-gray-600 text-xs mt-4">
              Hormuz Intelligence Platform is operated by Elite Forensic Group.
              All output is data intelligence for audit support purposes only.
              It does not constitute financial, legal, or operational advice.
            </p>
            <p className="text-gray-700 text-xs mt-4">
              Contact: alexandermnr@yahoo.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
