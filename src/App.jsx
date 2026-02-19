import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CheckJob from "./pages/CheckJob";
import Login from "./pages/Login";
import FindJobs from "./pages/FindJobs";
import PostJob from "./pages/PostJob";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">

        <nav className="navbar">
          <h2 className="logo">💼 JobShield AI</h2>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/check">Check Job</Link>
            <Link to="/find">Find Jobs</Link>
            <Link to="/login">Login</Link>

            <Link to="/post">
              <button className="post-btn">Post Job</button>
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<CheckJob />} />
          <Route path="/find" element={<FindJobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<PostJob />} />
        </Routes>

      </div>
    </Router>
  );
}
