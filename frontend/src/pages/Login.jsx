import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    login({ email: form.email, role: form.role });

    const redirectFrom = location.state?.from?.pathname;
    if (form.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (redirectFrom && redirectFrom !== "/login") {
      navigate(redirectFrom, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Sign in</h1>
            <p style={styles.subtitle}>
              This is a UI-only authentication flow. Use the role selector to
              preview user or admin experiences.
            </p>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="role" style={styles.label}>
                Role (UI only)
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submit,
                opacity: !form.email || !form.password ? 0.7 : 1,
              }}
              disabled={!form.email || !form.password}
            >
              Login
            </button>
          </form>
          <p style={styles.helpText}>
            Admin logins will be redirected to <code>/admin</code>. User logins
            will be redirected to <code>/</code> or the original protected
            route.
          </p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  page: {
    padding: "3.2rem 3rem",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    maxWidth: "420px",
    width: "100%",
  },
  card: {
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: "1.25rem",
    padding: "1.8rem 2rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    boxShadow: "0 20px 55px rgba(15, 23, 42, 0.95)",
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#9ca3af",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  label: {
    fontSize: "0.82rem",
    color: "#9ca3af",
  },
  input: {
    borderRadius: "0.8rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    padding: "0.7rem 0.85rem",
    background: "rgba(15, 23, 42, 0.96)",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
  },
  select: {
    borderRadius: "0.8rem",
    border: "1px solid rgba(31, 41, 55, 0.95)",
    padding: "0.6rem 0.75rem",
    background: "rgba(15, 23, 42, 0.96)",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
  },
  submit: {
    marginTop: "0.6rem",
    width: "100%",
    padding: "0.8rem 1.2rem",
    borderRadius: "0.9rem",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    boxShadow: "0 16px 38px rgba(79, 70, 229, 0.75)",
  },
  helpText: {
    marginTop: "1rem",
    fontSize: "0.8rem",
    color: "#6b7280",
  },
};

export default Login;

