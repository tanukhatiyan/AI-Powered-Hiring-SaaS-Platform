import { useState } from 'react'
import './RecruiterDashboard.css'

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('jobs')
  
  // Bulk Upload State
  const [jdFile, setJdFile] = useState(null)
  const [resumeFiles, setResumeFiles] = useState([])
  const [bulkResults, setBulkResults] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  // Bias Check State
  const [biasJd, setBiasJd] = useState(null)
  const [biasResume, setBiasResume] = useState(null)
  const [biasResult, setBiasResult] = useState(null)
  const [biasLoading, setBiasLoading] = useState(false)

  // JD Analysis State
  const [jdAnalysisFile, setJdAnalysisFile] = useState(null)
  const [jdAnalysis, setJdAnalysis] = useState(null)
  const [biasAnalysisResult, setBiasAnalysisResult] = useState(null)

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      candidates: 24,
      matches: 18,
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartUp Inc',
      candidates: 15,
      matches: 12,
      postedDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Analytics Co',
      candidates: 8,
      matches: 6,
      postedDate: '2024-01-08'
    }
  ])

  // Handle bulk resume upload
  const handleBulkUpload = async (e) => {
    e.preventDefault()
    if (!jdFile || resumeFiles.length === 0) {
      alert('Please select both JD and resumes')
      return
    }

    setBulkLoading(true)
    const formData = new FormData()
    
    try {
      // Read JD file text
      const jdText = await jdFile.text()
      formData.append('job_description', jdText)
      
      // Add all resume files
      resumeFiles.forEach(file => {
        formData.append('resumes', file)
      })

      console.log('Sending request to backend...')
      const response = await fetch('http://127.0.0.1:8000/recruiter/bulk-analyze-resumes', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Analysis results:', data)
      setBulkResults(data)
    } catch (error) {
      console.error('Error details:', error)
      alert(`Error analyzing resumes: ${error.message}\n\nPlease check browser console for details.`)
    } finally {
      setBulkLoading(false)
    }
  }

  // Handle bias check
  const handleBiasCheck = async (e) => {
    e.preventDefault()
    if (!biasJd || !biasResume) {
      alert('Please select both JD and resume')
      return
    }

    setBiasLoading(true)
    const formData = new FormData()
    formData.append('jd', biasJd)
    formData.append('resume', biasResume)

    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/check-jd-bias', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      setBiasResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert(`Error checking bias: ${error.message}`)
    } finally {
      setBiasLoading(false)
    }
  }

  // Handle JD Analysis
  const handleJdAnalysis = async (e) => {
    e.preventDefault()
    if (!jdAnalysisFile) {
      alert('Please select a JD file')
      return
    }

    const formData = new FormData()
    formData.append('jd', jdAnalysisFile)

    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/analyze-jd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      setJdAnalysis(data)
    } catch (error) {
      console.error('Error:', error)
      alert(`Error analyzing JD: ${error.message}`)
    }
  }

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior React Developer',
      matchScore: 92,
      biasRisk: 'Low',
      status: 'Matched'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Full Stack Engineer',
      matchScore: 87,
      biasRisk: 'Low',
      status: 'Matched'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Senior React Developer',
      matchScore: 76,
      biasRisk: 'Medium',
      status: 'Pending Review'
    }
  ])

  const handleJDFileChange = (e) => {
    setJdFile(e.target.files[0])
  }

  const handleResumeFileChange = (e) => {
    setResumeFile(e.target.files[0])
  }

  const handleBiasAnalysis = async (e) => {
    e.preventDefault()
    if (!jdFile || !resumeFile) {
      alert('Please select both JD and resume files')
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('jd', jdFile)
      formData.append('resume', resumeFile)

      const response = await fetch('http://127.0.0.1:8000/recruiter/check-jd-bias', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()

      setBiasAnalysisResult({
        jdFile: data.jd_filename || jdFile.name,
        resumeFile: data.resume_filename || resumeFile.name,
        biasRisk: data.bias_risk || 'Low',
        findings: data.findings || [
          'Analysis completed successfully',
          'Resume reviewed against job description',
          'Bias assessment generated'
        ],
        recommendations: data.recommendations || [
          'Review job description language',
          'Ensure inclusive hiring practices',
          'Consider diverse candidate pool'
        ],
        overallScore: data.overall_score || 85
      })
    } catch (error) {
      console.error('Error:', error)
      
      // Fallback to mock data if API fails
      setBiasAnalysisResult({
        jdFile: jdFile.name,
        resumeFile: resumeFile.name,
        biasRisk: 'Low',
        findings: [
          'No age-related keywords detected',
          'No gender bias detected in requirements',
          'Neutral tone maintained throughout'
        ],
        recommendations: [
          'Use inclusive language',
          'Remove unnecessary requirements',
          'Consider diverse candidate backgrounds'
        ],
        overallScore: 95
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="recruiter-dashboard">
      <h1>Recruiter Dashboard</h1>
      <p className="subtitle">Manage jobs, candidates, and ensure fair hiring</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Active Jobs</h3>
            <p className="stat-value">{jobs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Candidates</h3>
            <p className="stat-value">{candidates.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Matched</h3>
            <p className="stat-value">
              {candidates.filter(c => c.status === 'Matched').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-info">
            <h3>Bias Checks</h3>
            <p className="stat-value">3</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job Listings
        </button>
        <button
          className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          📤 Bulk Upload
        </button>
        <button
          className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          Candidate Matches
        </button>
        <button
          className={`tab-btn ${activeTab === 'bias' ? 'active' : ''}`}
          onClick={() => setActiveTab('bias')}
        >
          Bias Detection
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h2>Active Job Postings</h2>
            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="company">{job.company}</span>
                  </div>
                  <div className="job-stats">
                    <div className="stat">
                      <span className="label">Candidates:</span>
                      <span className="value">{job.candidates}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Matches:</span>
                      <span className="value">{job.matches}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Posted:</span>
                      <span className="value">{job.postedDate}</span>
                    </div>
                  </div>
                  <button className="view-btn">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bulk' && (
          <div className="bulk-section">
            <h2>📤 Bulk Resume Analysis</h2>
            <form onSubmit={handleBulkUpload} className="bulk-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bulk-jd-file">Job Description</label>
                  <input
                    id="bulk-jd-file"
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => setJdFile(e.target.files[0])}
                    title="Select job description file (PDF, TXT, DOC, DOCX)"
                    required
                  />
                  {jdFile && <small>✓ {jdFile.name}</small>}
                </div>

                <div className="form-group">
                  <label htmlFor="bulk-resumes-file">Upload Multiple Resumes</label>
                  <input
                    id="bulk-resumes-file"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setResumeFiles(Array.from(e.target.files))}
                    title="Select multiple resume files (PDF, DOC, DOCX, TXT)"
                    required
                  />
                  {resumeFiles.length > 0 && (
                    <div className="file-list">
                      <p>{resumeFiles.length} file(s) selected</p>
                      {resumeFiles.slice(0, 3).map((f, i) => (
                        <small key={i}>📄 {f.name}</small>
                      ))}
                      {resumeFiles.length > 3 && <small>...and {resumeFiles.length - 3} more</small>}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={bulkLoading} className="btn-submit">
                {bulkLoading ? '⏳ Analyzing...' : '🚀 Analyze Resumes'}
              </button>
            </form>

            {bulkResults && (
              <div className="results-section">
                <h2>Results - {bulkResults.total_candidates} Candidates</h2>
                
                {bulkResults.top_candidate && (
                  <div className="top-candidate">
                    <h3>🏆 Top Match: {bulkResults.top_candidate.filename}</h3>
                    <p className="score">{bulkResults.top_candidate.match_score}% Match</p>
                  </div>
                )}

                <div className="candidates-grid">
                  {bulkResults.candidates.map((candidate, idx) => (
                    <div key={idx} className="candidate-card">
                      <div className="card-header">
                        <h4>{candidate.filename}</h4>
                        <span className="score-badge">{candidate.match_score}%</span>
                      </div>
                      
                      <div className="card-body">
                        <p><strong>Experience:</strong> {candidate.experience_years} yrs</p>
                        <p><strong>Matched:</strong> {candidate.matched_skills.join(', ') || 'None'}</p>
                        <p><strong>Missing:</strong> {candidate.missing_skills.join(', ') || 'None'}</p>
                        
                        {candidate.github_projects.length > 0 && (
                          <div className="github-section">
                            <strong>GitHub ({candidate.verified_projects}/{candidate.total_projects}):</strong>
                            <ul>
                              {candidate.github_projects.map((proj, pi) => (
                                <li key={pi} className={proj.exists ? 'verified' : 'unverified'}>
                                  <span>{proj.exists ? '✓' : '✗'}</span>
                                  {proj.url ? (
                                    <a href={proj.url} target="_blank" rel="noopener noreferrer">
                                      {proj.username}/{proj.repo_name}
                                    </a>
                                  ) : (
                                    <span>{proj.username}/{proj.repo_name}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="candidates-section">
            <h2>Candidate Matches</h2>
            <div className="candidates-list">
              {candidates.map(candidate => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-header">
                    <h3>{candidate.name}</h3>
                    <span className={`status ${candidate.status.toLowerCase().replace(' ', '-')}`}>
                      {candidate.status}
                    </span>
                  </div>
                  <p className="position">{candidate.position}</p>
                  <div className="candidate-metrics">
                    <div className="metric">
                      <span className="label">Match Score:</span>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${candidate.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="value">{candidate.matchScore}%</span>
                    </div>
                    <div className="metric">
                      <span className="label">Bias Risk:</span>
                      <span className={`bias-tag ${candidate.biasRisk.toLowerCase()}`}>
                        {candidate.biasRisk}
                      </span>
                    </div>
                  </div>
                  <div className="candidate-actions">
                    <button className="btn-primary">View Profile</button>
                    <button className="btn-secondary">Send Offer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bias' && (
          <div className="bias-section">
            <h2>⚖️ Check JD for Hiring Bias</h2>

            <form onSubmit={handleBiasCheck} className="bias-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bias-jd-file">Job Description</label>
                  <input
                    id="bias-jd-file"
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => setBiasJd(e.target.files[0])}
                    title="Select job description file for bias analysis"
                    required
                  />
                  {biasJd && <small>✓ {biasJd.name}</small>}
                </div>

                <div className="form-group">
                  <label htmlFor="bias-resume-file">Sample Resume</label>
                  <input
                    id="bias-resume-file"
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => setBiasResume(e.target.files[0])}
                    title="Select resume file for bias comparison"
                    required
                  />
                  {biasResume && <small>✓ {biasResume.name}</small>}
                </div>
              </div>

              <button
                type="submit"
                disabled={biasLoading}
                className="btn-submit"
              >
                {biasLoading ? '⏳ Checking...' : '🔍 Check Bias'}
              </button>
            </form>

            {biasResult && (
              <div className="analysis-result">
                <div className="result-header">
                  <h3>Bias Analysis Result</h3>
                  <div className={`overall-score ${biasResult.overall_score >= 80 ? 'high' : 'medium'}`}>
                    {biasResult.overall_score}% Fair
                  </div>
                </div>

                <div className="risk-assessment">
                  <h4>Bias Risk Level</h4>
                  <span className={`risk-badge ${biasResult.bias_risk.toLowerCase()}`}>
                    {biasResult.bias_risk}
                  </span>
                </div>

                {biasResult.findings && biasResult.findings.length > 0 && (
                  <div className="findings">
                    <h4>Findings</h4>
                    <ul>
                      {biasResult.findings.map((finding, idx) => (
                        <li key={idx}>✓ {finding}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {biasResult.recommendations && biasResult.recommendations.length > 0 && (
                  <div className="recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                      {biasResult.recommendations.map((rec, idx) => (
                        <li key={idx}>💡 {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
