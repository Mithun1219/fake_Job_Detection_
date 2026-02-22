import React from "react";

const MOCK_HISTORY = [
  {
    id: "1",
    company: "Acme Corp",
    location: "Remote",
    label: "REAL",
    confidence: 93,
    createdAt: "2026-02-18 10:24",
  },
  {
    id: "2",
    company: "Global Talent Hub",
    location: "London",
    label: "FAKE",
    confidence: 88,
    createdAt: "2026-02-18 09:57",
  },
  {
    id: "3",
    company: "NeoSoft Labs",
    location: "Bengaluru",
    label: "REAL",
    confidence: 90,
    createdAt: "2026-02-17 17:41",
  },
  {
    id: "4",
    company: "Skyline HR",
    location: "Remote",
    label: "FAKE",
    confidence: 79,
    createdAt: "2026-02-16 14:12",
  },
];

const History = () => {
  return (
    <section style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Prediction history</h1>
          <p style={styles.subtitle}>
            View a history of recent job post predictions. Data is mocked for
            now – wire this table to your backend later.
          </p>
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Prediction</th>
                  <th style={styles.th}>Confidence</th>
                  <th style={styles.th}>Created at</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((row) => (
                  <tr key={row.id}>
                    <td style={styles.td}>{row.company}</td>
                    <td style={styles.tdMuted}>{row.location}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...(row.label === "FAKE"
                            ? styles.statusDanger
                            : styles.statusSuccess),
                        }}
                      >
                        {row.label}
                      </span>
                    </td>
                    <td style={styles.td}>{row.confidence}%</td>
                    <td style={styles.tdMuted}>{row.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    marginBottom: "1.8rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#9ca3af",
    maxWidth: "34rem",
  },
  tableCard: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1.2rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.95)",
    padding: "1.4rem 1.5rem 1.2rem",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem 0.4rem",
    fontWeight: 500,
    color: "#9ca3af",
    borderBottom: "1px solid rgba(31, 41, 55, 0.95)",
  },
  td: {
    padding: "0.55rem 0.4rem",
    color: "#e5e7eb",
    borderBottom: "1px solid rgba(31, 41, 55, 0.85)",
  },
  tdMuted: {
    padding: "0.55rem 0.4rem",
    color: "#9ca3af",
    borderBottom: "1px solid rgba(31, 41, 55, 0.85)",
  },
  status: {
    padding: "0.18rem 0.55rem",
    borderRadius: "999px",
    fontSize: "0.78rem",
  },
  statusDanger: {
    background: "rgba(239, 68, 68, 0.16)",
    color: "#fecaca",
  },
  statusSuccess: {
    background: "rgba(22, 163, 74, 0.18)",
    color: "#bbf7d0",
  },
};

export default History;

