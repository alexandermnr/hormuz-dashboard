import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// outcome_status is ONLY updated manually by Alex after a confirmed event
// is recorded in confirmed_events table.
// Automated status updates are NOT permitted — this is an integrity rule, not a bug.

export default function Accuracy() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("hni_scores")
        .select("score_date, composite_hni, status_label, created_at")
        .order("score_date", { ascending: false })
        .limit(90);

      if (error) {
        setError(error.message);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    }
    fetchScores();
  }, []);

  return (
    <div style={{
      backgroundColor: "#0a0e1a",
      minHeight: "100vh",
      padding: "40px 24px",
      fontFamily: "'Inter', sans-serif",
      color: "#e8e8e8"
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #c9a84c", paddingBottom: "20px", marginBottom: "8px" }}>
          <h1 style={{ color: "#c9a84c", fontSize: "22px", fontWeight: "700", letterSpacing: "0.08em", margin: 0 }}>
            HIP PREDICTION TRACK RECORD
          </h1>
          <p style={{ color: "#8a8a9a", fontSize: "13px", marginTop: "8px", lineHeight: "1.5" }}>
            Live forward predictions. Timestamped at time of brief. Outcomes recorded against objective thresholds only.
          </p>
        </div>

        {/* Integrity note */}
        <div style={{
          backgroundColor: "#0f1520",
          border: "1px solid #1e2a3a",
          borderLeft: "3px solid #c9a84c",
          padding: "12px 16px",
          marginBottom: "28px",
          marginTop: "16px",
          fontSize: "12px",
          color: "#8a8a9a",
          lineHeight: "1.6"
        }}>
          Outcome, Event, and Days Lead columns are updated manually after a confirmed event is recorded.
          No automated outcome scoring. No retroactive adjustments.
          Rows marked <span style={{ color: "#c9a84c" }}>Pending</span> have not yet resolved.
        </div>

        {/* Table */}
        {loading && (
          <p style={{ color: "#8a8a9a", fontSize: "13px" }}>Loading track record...</p>
        )}
        {error && (
          <p style={{ color: "#e05c5c", fontSize: "13px" }}>Error loading data: {error}</p>
        )}
        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #c9a84c" }}>
                  {["Date", "HNI Score", "Confidence Band", "Outcome", "Event", "Days Lead"].map(h => (
                    <th key={h} style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      color: "#c9a84c",
                      fontWeight: "600",
                      letterSpacing: "0.05em",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.score_date || i} style={{
                    borderBottom: "1px solid #1a2030",
                    backgroundColor: i % 2 === 0 ? "#0a0e1a" : "#0d1220"
                  }}>
                    <td style={{ padding: "10px 14px", color: "#e8e8e8" }}>
                      {row.score_date}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        color: row.composite_hni >= 65 ? "#e05c5c" : row.composite_hni >= 50 ? "#e0a84c" : "#5ce08a",
                        fontWeight: "700",
                        fontSize: "14px"
                      }}>
                        {row.composite_hni !== null ? Number(row.composite_hni).toFixed(1) : "\u2014"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "#8a8a9a" }}>
                      \u00b1TBD
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        backgroundColor: "#1a2030",
                        color: "#c9a84c",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.04em"
                      }}>
                        PENDING
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "#8a8a9a" }}>{"\u2014"}</td>
                    <td style={{ padding: "10px 14px", color: "#8a8a9a" }}>{"\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "#8a8a9a", fontSize: "11px", marginTop: "16px" }}>
              Showing last {rows.length} scoring days. Data intelligence only. Not investment advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
