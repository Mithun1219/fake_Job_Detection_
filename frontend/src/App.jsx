import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Login from "./pages/Login";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #0f172a 0, #020617 40%, #020617 100%)",
          color: "#e5e7eb",
        }}
      >
        <Navbar />
        <main style={{ paddingTop: "72px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
