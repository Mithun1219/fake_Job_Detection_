export default function FindJobs() {
  return (
    <div className="page">

      <div className="card" style={{width:"600px"}}>

        <h2>🔥 Find Your Dream Job</h2>

        <input placeholder="Job title or keyword" />
        <input placeholder="Location" />

        <button>Search Jobs</button>

        <div style={{marginTop:20}}>

          <div className="job-item">
            <h4>Frontend Developer</h4>
            <p>Google • Bangalore • ₹12 LPA</p>
          </div>

          <div className="job-item">
            <h4>Software Engineer</h4>
            <p>Amazon • Hyderabad • ₹15 LPA</p>
          </div>

          <div className="job-item">
            <h4>AI Engineer</h4>
            <p>Microsoft • Chennai • ₹18 LPA</p>
          </div>

        </div>

      </div>

    </div>
  );
}
