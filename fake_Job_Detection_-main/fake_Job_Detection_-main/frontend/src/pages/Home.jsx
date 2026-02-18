import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1>Detect Fake Job Posts Instantly</h1>
        <p>
          Our NLP-powered AI analyzes job descriptions and predicts whether
          they are real or fake with high accuracy.
        </p>
        <button style={styles.heroBtn}>Check a Job Post</button>
      </section>

      {/* About Section */}
      <section style={styles.section}>
        <h2>About the Project</h2>
        <p>
          Fake job postings are increasing across online platforms.
          This system uses Natural Language Processing and Machine Learning
          to classify job posts as real or fake.
        </p>
      </section>

      {/* Features Section */}
      <section style={styles.featureSection}>
        <h2>Features</h2>
        <div style={styles.cardContainer}>
          <div style={styles.card}>High Accuracy ML Model</div>
          <div style={styles.card}>Prediction Confidence Score</div>
          <div style={styles.card}>Admin Dashboard</div>
          <div style={styles.card}>Export Reports</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 JobCheck AI | Infosys Springboard Internship Project
      </footer>
    </>
  );
};

const styles = {
  hero: {
    textAlign: "center",
    padding: "100px 20px",
    background: "linear-gradient(to right, #1e3a8a, #2563eb)",
    color: "white"
  },
  heroBtn: {
    marginTop: "20px",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    background: "#0f172a",
    color: "white",
    cursor: "pointer"
  },
  section: {
    padding: "60px 20px",
    textAlign: "center"
  },
  featureSection: {
    padding: "60px 20px",
    background: "#f1f5f9",
    textAlign: "center"
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "220px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  footer: {
    padding: "20px",
    textAlign: "center",
    background: "#0f172a",
    color: "white"
  }
};

export default Home;
