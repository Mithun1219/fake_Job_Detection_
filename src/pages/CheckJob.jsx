import { useState } from "react";

export default function CheckJob() {

  const [result, setResult] = useState("");

  const analyze = () => {
    const fake = Math.random() > 0.5;
    setResult(fake ? "⚠️ Fake Job Detected" : "✅ Genuine Job");
  };

  return (
    <div className="page">
      <div className="card">

        <h2>Fake Job Detection</h2>

        <textarea placeholder="Paste job description..." />

        <button onClick={analyze}>Analyze Job</button>

        {result && <h3 style={{marginTop:20}}>{result}</h3>}

      </div>
    </div>
  );
}
