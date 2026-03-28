import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function formatDate(dateStr) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function getBadge(row) {
  if (!row.composite_hni && row.composite_hni !== 0) {
    return { label: "MISSING", bg: "#3a1a1a", color: "#e05c5c" };
  }
  const date = row.score_date;
  if (date === "2026-03-21") {
    return { label: "VERIFIED EVENT \u2713", bg: "#1a3a1a", color: "#5ce08a" };
  }
  if (date >= "2026-03-25") {
    return { label: "CLEAN BASELINE", bg: "#1a2a3a", color: "#5ca8e0" };
  }
  if (date >= "2026-03-18" && date <= "2026-03-24") {
    return { label: "PARTIAL DATA", bg: "#3a2a1a", color: "#e0a84c" };
  }
  return { label: "MISSING", bg: "#3a1a1a", color: "#e05c5c" };
}

export default function Accuracy() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("hni_scores")
        .select("score_date, composite_hni, status_label, created_at")
        .order("score_date", { ascending: false });

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

        <div style={{ borderBottom: "1px solid #c9a84c", paddingBottom: "20px", marginBottom: "8px" }}>
          <h1 style={{ color: "#c9a84c", fontSize: "22px", fontWeight: "700", letterSpacing: "0.08em", margin: 0 }}>
            HIP LIVE ACCURACY DASHBOARD
          </h1>
          <p style={{ color: "#8a8a9a", fontSize: "13px", marginTop: "8px", lineHeight: "1.5" }}>
            Every HNI score since platform launch. Timestamped. No retroactive adjustments.
          </p>
        </div>

        <div style={{
          backgroundColor: "#0f1520",
          border: "1px solid #1e2a3a",
          borderLeft: "3px solid #c9a84c",
          padding: "16px 20px",
          marginBottom: "28px",
          marginTop: "16px",
          fontSize: "12px",
          color: "#b0b0c0",
          lineHeight: "1.7"
        }}>
          Live scoring began March 18, 2026 during active US-Israel-Iran conflict.
          Calibration period March 18&ndash;24: PARTIAL DATA.
          Clean baseline window begins March 25, 2026.
          One independently verifiable event score: 75.43 on March 21 (Natanz strike day).
        </div>

        {loading && (
          <p style={{ color: "#8a8a9a", fontSize: "13px" }}>Loading accuracy data...</p>
        )}
        {error && (
          <p style={{ color: "#e05c5c", fontSize: "13px" }}>Error loading data: {error}</p>
        )}
        {!loading && !error && rows.length === 0 && (
          <p style={{ color: "#8a8a9a", fontSize: "13px" }}>No score data available.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #c9a84c" }}>
                  {["Date", "HNI Score", "Status Label", "Data Window"].map(h => (
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
                {rows.map((row, i) => {
                  const badge = getBadge(row);
                  return (
                    <tr key={row.score_date || i} style={{
                      borderBottom: "1px solid #1a2030",
                      backgroundColor: i % 2 === 0 ? "#0a0e1a" : "#0d1220"
                    }}>
                      <td style={{ padding: "10px 14px", color: "#e8e8e8", whiteSpace: "nowrap" }}>
                        {formatDate(row.score_date)}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          color: row.composite_hni >= 65 ? "#e05c5c" : row.composite_hni >= 50 ? "#e0a84c" : "#5ce08a",
                          fontWeight: "700",
                          fontSize: "14px"
                        }}>
                          {row.composite_hni !== null && row.composite_hni !== undefined
                            ? Number(row.composite_hni).toFixed(1)
                            : "\u2014"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#b0b0c0" }}>
                        {row.status_label || "\u2014"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: "3px 10px",
                          borderRadius: "3px",
                          fontSize: "11px",
                          fontWeight: "600",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap"
                        }}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ color: "#8a8a9a", fontSize: "11px", marginTop: "16px" }}>
              Showing {rows.length} scoring days. Data intelligence only. Not investment advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
