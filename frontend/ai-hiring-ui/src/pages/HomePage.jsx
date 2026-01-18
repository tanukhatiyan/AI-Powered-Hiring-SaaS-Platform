import './HomePage.css'

export default function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to AI Hiring SaaS</h1>
          <p>Revolutionizing recruitment with AI-powered candidate matching and bias detection</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => onNavigate('candidate', 'candidate')}>
              I'm a Candidate
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('recruiter', 'recruiter')}>
              I'm a Recruiter
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Smart Resume Parsing</h3>
            <p>Advanced AI to extract and analyze resume information accurately</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Intelligent Matching</h3>
            <p>Semantic matching to find the best job-candidate fit</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Bias Detection</h3>
            <p>Ensure fair and unbiased hiring decisions with our bias checker</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track hiring metrics and candidate insights in real-time</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Resume</h3>
            <p>Candidates upload their resume in PDF or document format</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes the resume and extracts key information</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Job Matching</h3>
            <p>Find matching jobs or candidates with semantic search</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Bias Check</h3>
            <p>Verify hiring decisions are fair and unbiased</p>
          </div>
        </div>
      </section>
    </div>
  )
}
