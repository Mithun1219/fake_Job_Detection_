import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <section style={styles.hero} id="home">
        <div style={styles.heroContent}>
          <div>
            <p style={styles.pill}>AI-powered fraud detection for job posts</p>
            <h1 style={styles.heroTitle}>
              Spot fake job postings{" "}
              <span style={styles.heroGradient}>before candidates apply.</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Paste any job description and our model will classify it as{" "}
              <strong>REAL</strong> or <strong>FAKE</strong> with a confidence
              score and risk signal.
            </p>
            <div style={styles.heroActions}>
              <button
                type="button"
                style={styles.primaryCta}
                onClick={() => navigate("/predict")}
              >
                Check a job post
              </button>
              <button
                type="button"
                style={styles.secondaryCta}
                onClick={() => navigate("/login")}
              >
                Admin dashboard
              </button>
            </div>
            <p style={styles.heroMeta}>
              Trusted by internal teams to protect candidates from scam
              postings.
            </p>
          </div>
          <div style={styles.heroCard}>
            <div style={styles.heroCardHeader}>
              <span style={styles.heroCardBadge}>Live signal</span>
              <span style={styles.heroCardLabel}>Today</span>
            </div>
            <div style={styles.heroCardBody}>
              <div style={styles.metricRow}>
                <span>Predictions today</span>
                <strong>128</strong>
              </div>
              <div style={styles.metricRow}>
                <span>Fake detection rate</span>
                <strong>32%</strong>
              </div>
              <div style={styles.riskPillsRow}>
                <span style={{ ...styles.riskPill, ...styles.riskHigh }}>
                  High risk
                </span>
                <span style={{ ...styles.riskPill, ...styles.riskMedium }}>
                  Medium
                </span>
                <span style={{ ...styles.riskPill, ...styles.riskLow }}>
                  Low
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section} id="features">
        <h2 style={styles.sectionTitle}>Why teams use JobCheck AI</h2>
        <p style={styles.sectionSubtitle}>
          Built for Talent, Security, and Ops teams who want fast signal on job
          posting quality.
        </p>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>ML-powered scoring</h3>
            <p style={styles.cardBody}>
              NLP model trained on thousands of labeled job posts to distinguish
              authentic roles from scams and reposts.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Confidence & risk badge</h3>
            <p style={styles.cardBody}>
              Clear REAL/FAKE signal with confidence percentage and risk color
              coding for quick triage.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Admin analytics</h3>
            <p style={styles.cardBody}>
              SaaS-style dashboard for monitoring prediction volume, fake rate,
              and flagged posts over time.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Audit-friendly history</h3>
            <p style={styles.cardBody}>
              Track historical predictions and flagged posts to support audits
              and continuous model improvement.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt} id="how-it-works">
        <div style={styles.howGrid}>
          <div>
            <h2 style={styles.sectionTitle}>How it works</h2>
            <p style={styles.sectionSubtitle}>
              A simple flow designed to plug into your existing hiring process.
            </p>
            <ol style={styles.stepsList}>
              <li>
                <span style={styles.stepBadge}>1</span>
                Paste the job description, company, and location on the Predict
                page.
              </li>
              <li>
                <span style={styles.stepBadge}>2</span>
                Our ML model scores the post and returns REAL or FAKE with a
                confidence percentage.
              </li>
              <li>
                <span style={styles.stepBadge}>3</span>
                Review the risk badge and, if needed, flag the post for admin
                review.
              </li>
              <li>
                <span style={styles.stepBadge}>4</span>
                Admins monitor trends, export CSVs, and trigger model retrains
                from the dashboard.
              </li>
            </ol>
          </div>
          <div style={styles.howCard}>
            <h3 style={styles.cardTitle}>Designed for scale</h3>
            <p style={styles.cardBody}>
              This frontend is built as a modular SaaS interface with reusable
              cards, protected routes, and role-based navigation. The backend
              ML APIs can be wired in later without changing the core UX.
            </p>
            <div style={styles.tagRow}>
              <span style={styles.tag}>Role-based UI</span>
              <span style={styles.tag}>Protected routes</span>
              <span style={styles.tag}>Recharts analytics</span>
            </div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 JobCheck AI. All rights reserved.</p>
        <p style={styles.footerMeta}>Infosys Springboard Internship Project</p>
      </footer>
    </>
  );
};

const styles = {
  hero: {
    padding: "4.5rem 3rem 3rem",
  },
  heroContent: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.4fr)",
    gap: "3rem",
    alignItems: "center",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#a5b4fc",
    marginBottom: "1rem",
    background:
      "linear-gradient(135deg, rgba(30, 64, 175, 0.6), rgba(15, 23, 42, 0.9))",
  },
  heroTitle: {
    fontSize: "2.7rem",
    lineHeight: 1.1,
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#f9fafb",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    maxWidth: "36rem",
    color: "#cbd5f5",
    fontSize: "0.98rem",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  heroActions: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  primaryCta: {
    padding: "0.9rem 1.8rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    boxShadow: "0 14px 35px rgba(79, 70, 229, 0.55)",
  },
  secondaryCta: {
    padding: "0.85rem 1.4rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.7)",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#e5e7eb",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  heroMeta: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  heroCard: {
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.8))",
    borderRadius: "1.5rem",
    padding: "1.5rem 1.75rem",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.27)",
  },
  heroCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  heroCardBadge: {
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    background: "rgba(34, 197, 94, 0.15)",
    color: "#bbf7d0",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  heroCardLabel: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  heroCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#e5e7eb",
  },
  riskPillsRow: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  riskPill: {
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.7rem",
    border: "1px solid transparent",
  },
  riskHigh: {
    background: "rgba(239, 68, 68, 0.18)",
    borderColor: "rgba(248, 113, 113, 0.6)",
    color: "#fecaca",
  },
  riskMedium: {
    background: "rgba(234, 179, 8, 0.18)",
    borderColor: "rgba(250, 204, 21, 0.6)",
    color: "#fef9c3",
  },
  riskLow: {
    background: "rgba(22, 163, 74, 0.2)",
    borderColor: "rgba(34, 197, 94, 0.6)",
    color: "#bbf7d0",
  },
  section: {
    padding: "3.5rem 3rem 3rem",
  },
  sectionAlt: {
    padding: "3.5rem 3rem 3rem",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#f9fafb",
  },
  sectionSubtitle: {
    color: "#9ca3af",
    maxWidth: "34rem",
    fontSize: "0.95rem",
  },
  cardGrid: {
    marginTop: "2.2rem",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "rgba(15, 23, 42, 0.9)",
    borderRadius: "1rem",
    padding: "1.4rem 1.5rem",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.3)",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#e5e7eb",
  },
  cardBody: {
    fontSize: "0.9rem",
    color: "#9ca3af",
    lineHeight: 1.6,
  },
  howGrid: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.7fr) minmax(0, 1.4fr)",
    gap: "2.75rem",
    alignItems: "flex-start",
  },
  stepsList: {
    listStyle: "none",
    padding: 0,
    marginTop: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    color: "#d1d5db",
    fontSize: "0.92rem",
  },
  stepBadge: {
    display: "inline-flex",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "999px",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    marginRight: "0.6rem",
    background:
      "radial-gradient(circle at 30% 0, #a5b4fc 0, #6366f1 60%, #0f172a 100%)",
  },
  howCard: {
    background: "rgba(15, 23, 42, 0.95)",
    borderRadius: "1.25rem",
    padding: "1.6rem 1.7rem",
    boxShadow: "0 20px 55px rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.3)",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1.2rem",
  },
  tag: {
    padding: "0.3rem 0.8rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    fontSize: "0.75rem",
    color: "#e5e7eb",
  },
  footer: {
    borderTop: "1px solid rgba(31, 41, 55, 0.9)",
    padding: "1.5rem 3rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "#9ca3af",
  },
  footerMeta: {
    color: "#6b7280",
  },
};

export default Home;
