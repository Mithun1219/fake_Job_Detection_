import React, { useState } from "react";

const MOCK_RESULT = {
  label: "FAKE",
  confidence: 87,
  risk: "high",
};

const Predict = () => {
  const [form, setForm] = useState({
    company: "",
    location: "",
    description: "",
  });
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setIsAnalyzing(true);
    setFlagged(false);

    setTimeout(() => {
      setResult(MOCK_RESULT);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleFlag = () => {
    setFlagged(true);
  };

  const riskStyles =
    result?.risk === "high"
      ? {
          background: "rgba(248, 113, 113, 0.15)",
          color: "#fecaca",
          borderColor: "rgba(248, 113, 113, 0.6)",
        }
      : {
          background: "rgba(22, 163, 74, 0.15)",
          color: "#bbf7d0",
          borderColor: "rgba(34, 197, 94, 0.7)",
        };

  return (
    <section style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Predict job posting risk</h1>
          <p style={styles.subtitle}>
            Paste any job description. When the backend ML model is connected,
            this page will send the text and return a REAL or FAKE prediction
            with confidence.
          </p>
        </div>

        <div style={styles.layout}>
          <form style={styles.form} onSubmit={handleAnalyze}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="company">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Acme Corp"
                value={form.company}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Remote · Bengaluru · London"
                value={form.location}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="description">
                Job description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Paste the full job description here..."
                value={form.description}
                onChange={handleChange}
                rows={9}
                style={styles.textarea}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.analyzeBtn,
                opacity: !form.description.trim() ? 0.6 : 1,
              }}
              disabled={!form.description.trim() || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze job post"}
            </button>
          </form>

          <div style={styles.resultColumn}>
            {!result && (
              <div style={styles.placeholderCard}>
                <h2 style={styles.placeholderTitle}>Result preview</h2>
                <p style={styles.placeholderText}>
                  Run an analysis to see prediction, confidence, and risk level
                  here. You will also be able to flag suspicious posts for
                  admin review.
                </p>
              </div>
            )}

            {result && (
              <div style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <span style={styles.resultLabel}>Prediction</span>
                  <span
                    style={{
                      ...styles.badge,
                      ...(result.label === "FAKE"
                        ? styles.badgeDanger
                        : styles.badgeSuccess),
                    }}
                  >
                    {result.label}
                  </span>
                </div>
                <div style={styles.resultBody}>
                  <div style={styles.resultRow}>
                    <span>Confidence</span>
                    <strong>{result.confidence}%</strong>
                  </div>
                  <div style={styles.resultRow}>
                    <span>Risk level</span>
                    <span style={{ ...styles.riskBadge, ...riskStyles }}>
                      {result.risk === "high" ? "High risk" : "Low risk"}
                    </span>
                  </div>
                  <div style={styles.resultHint}>
                    This is a mock UI. Integrate your ML endpoint to replace
                    this static result with real predictions.
                  </div>
                </div>
                <div style={styles.resultFooter}>
                  <button
                    type="button"
                    style={styles.flagBtn}
                    onClick={handleFlag}
                  >
                    Flag post for review
                  </button>
                  {flagged && (
                    <span style={styles.flaggedText}>
                      Post flagged. It will appear in the admin flagged table
                      (UI only).
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  page: {
    padding: "3.2rem 3rem",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 600,
    marginBottom: "0.6rem",
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#9ca3af",
    maxWidth: "40rem",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.2fr)",
    gap: "2rem",
    alignItems: "flex-start",
  },
  form: {
    background: "rgba(15, 23, 42, 0.95)",
    padding: "1.6rem 1.7rem",
    borderRadius: "1.25rem",
    border: "1px solid rgba(31, 41, 55, 0.9)",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.95)",
  },
  fieldGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    marginBottom: "0.35rem",
    color: "#9ca3af",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.7rem",
    borderRadius: "0.7rem",
    border: "1px solid rgba(31, 41, 55, 0.9)",
    outline: "none",
    background: "rgba(15, 23, 42, 0.95)",
    color: "#e5e7eb",
    fontSize: "0.9rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 0.8rem",
    borderRadius: "0.9rem",
    border: "1px solid rgba(31, 41, 55, 0.9)",
    outline: "none",
    background: "rgba(15, 23, 42, 0.95)",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    resize: "vertical",
  },
  analyzeBtn: {
    marginTop: "0.3rem",
    width: "100%",
    padding: "0.8rem 1.2rem",
    borderRadius: "0.9rem",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1 0%, #22c55e 100%)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    boxShadow: "0 14px 35px rgba(79, 70, 229, 0.6)",
  },
  resultColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  placeholderCard: {
    background: "rgba(15, 23, 42, 0.9)",
    padding: "1.5rem 1.6rem",
    borderRadius: "1.25rem",
    border: "1px dashed rgba(55, 65, 81, 0.9)",
    color: "#9ca3af",
  },
  placeholderTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "#e5e7eb",
  },
  placeholderText: {
    fontSize: "0.9rem",
    lineHeight: 1.6,
  },
  resultCard: {
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.85))",
    padding: "1.5rem 1.6rem",
    borderRadius: "1.25rem",
    border: "1px solid rgba(148, 163, 184, 0.38)",
    boxShadow: "0 22px 55px rgba(15, 23, 42, 0.95)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  resultLabel: {
    fontSize: "0.9rem",
    color: "#9ca3af",
  },
  badge: {
    padding: "0.25rem 0.7rem",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  badgeDanger: {
    background: "rgba(239, 68, 68, 0.18)",
    color: "#fecaca",
  },
  badgeSuccess: {
    background: "rgba(22, 163, 74, 0.18)",
    color: "#bbf7d0",
  },
  resultBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    fontSize: "0.9rem",
    color: "#e5e7eb",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  riskBadge: {
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.78rem",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  resultHint: {
    marginTop: "0.4rem",
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  resultFooter: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  flagBtn: {
    padding: "0.6rem 1rem",
    borderRadius: "999px",
    border: "1px solid rgba(248, 113, 113, 0.7)",
    background: "rgba(127, 29, 29, 0.35)",
    color: "#fecaca",
    fontSize: "0.85rem",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  flaggedText: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
};

export default Predict;

