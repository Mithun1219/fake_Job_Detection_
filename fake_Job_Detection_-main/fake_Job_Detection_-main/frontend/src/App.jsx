import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// Comment these until you create the files
// import Predict from "./pages/Predict";
// import AdminLogin from "./pages/AdminLogin";
// import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Add these routes later when pages are created */}

        {/* 
        <Route path="/predict" element={<Predict />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        */}
      </Routes>
    </>
  );
}

export default App;
