import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          ...styles.nav,
          ...(scrolled ? styles.navScrolled : {}),
        }}
      >
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="3"
                  y1="3"
                  x2="21"
                  y2="21"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 style={styles.logo}>JobCheck AI</h2>
        </div>
        <div style={styles.links}>
          <NavLink to="/" label="Home" currentPath={location.pathname} />
          <NavLink
            to="/predict"
            label="Predict"
            currentPath={location.pathname}
          />
          {isAuthenticated && (
            <NavLink
              to="/history"
              label="History"
              currentPath={location.pathname}
            />
          )}
          {role === "admin" && (
            <NavLink
              to="/admin"
              label="Admin"
              currentPath={location.pathname}
            />
          )}
          {!isAuthenticated ? (
            <Link to="/login" style={styles.button}>
              Login
            </Link>
          ) : (
            <button type="button" style={styles.buttonGhost} onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>
      <style>{hoverStyles}</style>
    </>
  );
};

const NavLink = ({ to, label, currentPath }) => {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      style={{
        ...styles.link,
        color: isActive ? "#f9fafb" : styles.link.color,
      }}
    >
      {label}
    </Link>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 3rem",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: "all 0.3s ease",
    background: "transparent",
  },
  navScrolled: {
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
    padding: "0.75rem 3rem",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.75rem",
  },
  link: {
    textDecoration: "none",
    color: "#94a3b8",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    position: "relative",
  },
  button: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    padding: "0.625rem 1.5rem",
    borderRadius: "999px",
    textDecoration: "none",
    color: "white",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 30px rgba(79, 70, 229, 0.4)",
    border: "none",
    cursor: "pointer",
  },
  buttonGhost: {
    padding: "0.5rem 1.25rem",
    borderRadius: "999px",
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.6)",
    color: "#e5e7eb",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

const hoverStyles = `
  nav a:hover {
    color: #f9fafb !important;
  }
  nav a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #06b6d4);
    transition: width 0.3s ease;
  }
  nav a:hover::after {
    width: 100%;
  }
  button[style*="buttonGhost"]:hover {
    background: rgba(15, 23, 42, 0.8);
  }
`;

export default Navbar;
