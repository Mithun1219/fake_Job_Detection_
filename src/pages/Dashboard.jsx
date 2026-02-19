import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">WELCOME BACK 👋</h2>

        <p>Check whether a job is Fake or Real using AI.</p>

        <button onClick={() => navigate("/check-job")}>
          Check Job Now
        </button>
      </div>
    </div>
  );
}
