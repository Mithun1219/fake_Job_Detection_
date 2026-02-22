import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const STATS = {
  total: 1240,
  fake: 384,
  real: 856,
  accuracy: 92.4,
};

const PIE_DATA = [
  { name: "Fake", value: STATS.fake },
  { name: "Real", value: STATS.real },
];

const LINE_DATA = [
  { day: "Mon", predictions: 140 },
  { day: "Tue", predictions: 180 },
  { day: "Wed", predictions: 210 },
  { day: "Thu", predictions: 190 },
  { day: "Fri", predictions: 230 },
  { day: "Sat", predictions: 160 },
  { day: "Sun", predictions: 130 },
];

const FLAGGED_POSTS = [
  {
    id: "FP-1021",
    company: "Global Talent Hub",
    title: "Remote Data Entry Associate",
    reason: "Upfront payment requested",
    createdAt: "2026-02-18",
    status: "Under review",
  },
  {
    id: "FP-1018",
    company: "Skyline HR",
    title: "International Account Manager",
    reason: "Suspicious domain + vague JD",
    createdAt: "2026-02-17",
    status: "Flagged",
  },
  {
    id: "FP-1012",
    company: "NeoSoft Labs",
    title: "Junior Software Tester",
    reason: "Unrealistic salary + no company info",
    createdAt: "2026-02-15",
    status: "Dismissed",
  },
];

const PIE_COLORS = ["#f97373", "#4ade80"];

const AdminDashboard = () => {
  const [retrainState, setRetrainState] = useState("idle");

  const handleExportCsv = () => {
    // Dummy export – wire to backend later
    // eslint-disable-next-line no-console
    console.log("Export CSV clicked. Connect to backend export endpoint.");
  };

  const handleRetrain = () => {
    if (retrainState === "running") return;
    setRetrainState("running");
    setTimeout(() => {
      setRetrainState("completed");
      setTimeout(() => setRetrainState("idle"), 2000);
    }, 1200);
  };

  return (
    <section style={styles.page}>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Admin</h2>
            <p style={styles.sidebarSubtitle}>Monitoring & model ops</p>
          </div>
          <nav style={styles.sidebarNav}>
            <div style={{ ...styles.navItem, ...styles.navItemActive }}>
              Overview
            </div>
            <div style={styles.navItem}>Flagged posts</div>
            <div style={styles.navItem}>Model versions</div>
            <div style={styles.navItem}>Settings</div>
          </nav>
          <div style={styles.sidebarFooter}>
            <p style={styles.sidebarHint}>
              This is a front-end only admin experience. Secure it with real
              authentication and authorization later.
            </p>
          </div>
        </aside>

        <main style={styles.main}>
          <div style={styles.mainHeader}>
            <div>
              <h1 style={styles.title}>Analytics dashboard</h1>
              <p style={styles.subtitle}>
                Track prediction volume, fake vs real distribution, and review
                flagged posts.
              </p>
            </div>
            <div style={styles.actionRow}>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={handleExportCsv}
              >
                Export CSV
              </button>
              <button
                type="button"
                style={{
                  ...styles.primaryBtn,
                  opacity: retrainState === "running" ? 0.8 : 1,
                }}
                onClick={handleRetrain}
                disabled={retrainState === "running"}
              >
                {retrainState === "running"
                  ? "Retraining..."
                  : retrainState === "completed"
                  ? "Retrained"
                  : "Retrain model"}
              </button>
            </div>
          </div>

          <section style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total predictions</p>
              <p style={styles.statValue}>{STATS.total.toLocaleString()}</p>
              <p style={styles.statDelta}>+12.3% vs last week</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Fake detections</p>
              <p style={styles.statValue}>{STATS.fake}</p>
              <p style={styles.statDeltaDanger}>+4.8% vs last week</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Real posts</p>
              <p style={styles.statValue}>{STATS.real}</p>
              <p style={styles.statDelta}>+9.1% vs last week</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Model accuracy</p>
              <p style={styles.statValue}>{STATS.accuracy}%</p>
              <p style={styles.statDeltaMuted}>Last validated 2 days ago</p>
            </div>
          </section>

          <section style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Fake vs real distribution</h3>
                <p style={styles.chartSubtitle}>Breakdown of latest dataset</p>
              </div>
              <div style={styles.chartBody}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell
                          // eslint-disable-next-line react/no-array-index-key
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(31, 41, 55, 0.9)",
                        borderRadius: "0.6rem",
                        fontSize: "0.8rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Daily predictions</h3>
                <p style={styles.chartSubtitle}>Volume trend by weekday</p>
              </div>
              <div style={styles.chartBody}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={LINE_DATA}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(55, 65, 81, 0.6)"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(31, 41, 55, 0.9)",
                        borderRadius: "0.6rem",
                        fontSize: "0.8rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predictions"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section style={styles.tableSection}>
            <div style={styles.tableHeader}>
              <div>
                <h3 style={styles.chartTitle}>Flagged posts</h3>
                <p style={styles.chartSubtitle}>
                  Manual flags from the Predict page and automated rules.
                </p>
              </div>
            </div>
            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Company</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Reason</th>
                      <th style={styles.th}>Created</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FLAGGED_POSTS.map((row) => (
                      <tr key={row.id}>
                        <td style={styles.td}>{row.id}</td>
                        <td style={styles.td}>{row.company}</td>
                        <td style={styles.td}>{row.title}</td>
                        <td style={styles.tdMuted}>{row.reason}</td>
                        <td style={styles.tdMuted}>{row.createdAt}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.status,
                              ...(row.status === "Dismissed"
                                ? styles.statusMuted
                                : styles.statusWarning),
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
};

const styles = {
  page: {
    padding: "3.2rem 3rem",
  },
  layout: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    gap: "2rem",
  },
  sidebar: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1.25rem",
    padding: "1.4rem 1.5rem 1.6rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 20px 55px rgba(15, 23, 42, 0.95)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarHeader: {
    marginBottom: "1.4rem",
  },
  sidebarTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#f9fafb",
  },
  sidebarSubtitle: {
    fontSize: "0.84rem",
    color: "#9ca3af",
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  navItem: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.65rem",
    fontSize: "0.86rem",
    color: "#9ca3af",
    cursor: "default",
  },
  navItemActive: {
    background: "rgba(55, 65, 81, 0.9)",
    color: "#e5e7eb",
  },
  sidebarFooter: {
    marginTop: "1.2rem",
  },
  sidebarHint: {
    fontSize: "0.78rem",
    color: "#6b7280",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "1.8rem",
  },
  mainHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },
  title: {
    fontSize: "1.7rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#9ca3af",
  },
  actionRow: {
    display: "flex",
    gap: "0.6rem",
  },
  secondaryBtn: {
    padding: "0.55rem 1rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.7)",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "0.55rem 1.3rem",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: "0.86rem",
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(34, 197, 94, 0.7)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "1rem",
  },
  statCard: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1rem",
    padding: "0.9rem 1rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 16px 42px rgba(15, 23, 42, 0.95)",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#9ca3af",
    marginBottom: "0.3rem",
  },
  statValue: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  statDelta: {
    fontSize: "0.75rem",
    color: "#4ade80",
    marginTop: "0.2rem",
  },
  statDeltaDanger: {
    fontSize: "0.75rem",
    color: "#fb7185",
    marginTop: "0.2rem",
  },
  statDeltaMuted: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.2rem",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1.2rem",
  },
  chartCard: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1.2rem",
    padding: "1.1rem 1.2rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.95)",
  },
  chartHeader: {
    marginBottom: "0.6rem",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  chartSubtitle: {
    fontSize: "0.8rem",
    color: "#6b7280",
  },
  chartBody: {
    marginTop: "0.4rem",
    height: "230px",
  },
  tableSection: {
    marginTop: "0.5rem",
  },
  tableHeader: {
    marginBottom: "0.6rem",
  },
  tableCard: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1.2rem",
    padding: "1.1rem 1.2rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.95)",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.86rem",
  },
  th: {
    textAlign: "left",
    padding: "0.55rem 0.4rem",
    fontWeight: 500,
    color: "#9ca3af",
    borderBottom: "1px solid rgba(31, 41, 55, 0.95)",
  },
  td: {
    padding: "0.5rem 0.4rem",
    color: "#e5e7eb",
    borderBottom: "1px solid rgba(31, 41, 55, 0.85)",
  },
  tdMuted: {
    padding: "0.5rem 0.4rem",
    color: "#9ca3af",
    borderBottom: "1px solid rgba(31, 41, 55, 0.85)",
  },
  status: {
    padding: "0.18rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
  },
  statusWarning: {
    background: "rgba(234, 179, 8, 0.18)",
    color: "#facc15",
  },
  statusMuted: {
    background: "rgba(55, 65, 81, 0.9)",
    color: "#e5e7eb",
  },
};

export default AdminDashboard;

