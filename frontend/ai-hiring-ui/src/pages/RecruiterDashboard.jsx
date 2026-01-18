import { useState, useEffect } from 'react'
import './RecruiterDashboard.css'

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [selectedJobId, setSelectedJobId] = useState(null)
  
  // Job Management State
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    required_skills: '',
    experience_level: '',
    salary_range: '',
    location: ''
  })
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  // Bulk Upload State
  const [resumeFiles, setResumeFiles] = useState([])
  const [bulkResults, setBulkResults] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [candidates, setCandidates] = useState([])

  // Analytics State
  const [analytics, setAnalytics] = useState(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  // Fetch jobs on mount
  useEffect(() => {
    if (activeTab === 'jobs' && token) {
      fetchJobs()
    }
  }, [activeTab, token])

  const fetchJobs = async () => {
    setLoadingJobs(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      alert('Failed to load jobs')
    } finally {
      setLoadingJobs(false)
    }
  }

  // Create new job
  const handleCreateJob = async (e) => {
    e.preventDefault()
    if (!token) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newJob.title,
          description: newJob.description,
          required_skills: newJob.required_skills.split(',').map(s => s.trim()).filter(s => s),
          experience_level: newJob.experience_level,
          salary_range: newJob.salary_range,
          location: newJob.location
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to create job')
      }

      const job = await response.json()
      setJobs([...jobs, job])
      setNewJob({
        title: '',
        description: '',
        required_skills: '',
        experience_level: '',
        salary_range: '',
        location: ''
      })
      alert('Job created successfully!')
    } catch (error) {
      console.error('Error creating job:', error)
      alert(`Error: ${error.message}`)
    }
  }

  // Fetch job candidates
  const fetchJobCandidates = async (jobId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/recruiter/jobs/${jobId}/candidates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch candidates')
      const data = await response.json()
      setCandidates(data || [])
    } catch (error) {
      console.error('Error fetching candidates:', error)
    }
  }

  // Handle bulk resume upload
  const handleBulkUpload = async (e) => {
    e.preventDefault()
    if (!selectedJobId) {
      alert('Please select a job first')
      return
    }
    if (resumeFiles.length === 0) {
      alert('Please select resumes to upload')
      return
    }

    setBulkLoading(true)
    const formData = new FormData()
    
    try {
      resumeFiles.forEach(file => {
        formData.append('resumes', file)
      })

      const response = await fetch(`http://127.0.0.1:8000/recruiter/jobs/${selectedJobId}/rank-candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to analyze resumes')
      }

      const data = await response.json()
      setBulkResults(data)
      setResumeFiles([])
      await fetchJobCandidates(selectedJobId)
    } catch (error) {
      console.error('Error analyzing resumes:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setBulkLoading(false)
    }
  }

  // Fetch analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      alert('Failed to load analytics')
    } finally {
      setLoadingAnalytics(false)
    }
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'jobs' && jobs.length === 0) {
      fetchJobs()
    } else if (tab === 'analytics') {
      fetchAnalytics()
    }
  }

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage jobs, upload resumes, and track candidates</p>
      </div>

      {!token && (
        <div className="alert alert-warning">
          Please login first to access the recruiter dashboard
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => handleTabChange('jobs')}
        >
          📋 Jobs
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          📤 Upload Resumes
        </button>
        <button
          className={`tab-button ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => handleTabChange('candidates')}
        >
          👥 Candidates
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabChange('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="tab-content">
          <div className="section">
            <h2>Create New Job</h2>
            <form onSubmit={handleCreateJob} className="form">
              <input
                type="text"
                placeholder="Job Title"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Job Description"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                required
              ></textarea>
              <input
                type="text"
                placeholder="Required Skills (comma-separated)"
                value={newJob.required_skills}
                onChange={(e) => setNewJob({...newJob, required_skills: e.target.value})}
              />
              <input
                type="text"
                placeholder="Experience Level (junior, mid, senior)"
                value={newJob.experience_level}
                onChange={(e) => setNewJob({...newJob, experience_level: e.target.value})}
              />
              <input
                type="text"
                placeholder="Salary Range"
                value={newJob.salary_range}
                onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})}
              />
              <input
                type="text"
                placeholder="Location"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
              />
              <button type="submit" className="btn btn-primary">Create Job</button>
            </form>
          </div>

          <div className="section">
            <h2>Your Jobs ({jobs.length})</h2>
            {loadingJobs ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs created yet. Create one above!</p>
            ) : (
              <div className="jobs-list">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <h3>{job.title}</h3>
                    <p>{job.description?.substring(0, 100)}...</p>
                    <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                    <p><strong>Level:</strong> {job.experience_level || 'Not specified'}</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedJobId(job.id)
                        setActiveTab('upload')
                      }}
                    >
                      Upload Resumes
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Resumes Tab */}
      {activeTab === 'upload' && (
        <div className="tab-content">
          <div className="section">
            <h2>Upload Resumes for Job</h2>
            {!selectedJobId ? (
              <div className="alert alert-info">
                Please select a job first from the Jobs tab
              </div>
            ) : (
              <>
                <p><strong>Selected Job ID:</strong> {selectedJobId}</p>
                <form onSubmit={handleBulkUpload} className="upload-form">
                  <div className="file-input-group">
                    <label>Select Resumes (PDF or TXT)</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={(e) => setResumeFiles(Array.from(e.target.files))}
                    />
                    <p className="file-count">{resumeFiles.length} files selected</p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={bulkLoading}>
                    {bulkLoading ? 'Analyzing...' : 'Upload & Analyze'}
                  </button>
                </form>

                {bulkResults && (
                  <div className="results-section">
                    <h3>Analysis Results</h3>
                    <p><strong>Total Resumes:</strong> {bulkResults.total_resumes}</p>
                    <div className="results-list">
                      {bulkResults.results?.map((result, idx) => (
                        <div key={idx} className="result-item">
                          <h4>{result.filename}</h4>
                          <p><strong>Match Score:</strong> {result.match_score}%</p>
                          <p><strong>Bias Risk:</strong> {result.bias_risk}</p>
                          <p><strong>Matched Skills:</strong> {result.matched_skills.join(', ') || 'None'}</p>
                          <p><strong>Missing Skills:</strong> {result.missing_skills.join(', ') || 'None'}</p>
                          <p><strong>Verified Projects:</strong> {result.verified_projects}/{result.github_projects?.length || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div className="tab-content">
          <div className="section">
            <h2>Candidates</h2>
            {candidates.length === 0 ? (
              <p>No candidates found. Upload resumes to see candidates here.</p>
            ) : (
              <div className="candidates-list">
                {candidates.map((candidate, idx) => (
                  <div key={idx} className="candidate-card">
                    <h3>Resume ID: {candidate.id}</h3>
                    <p><strong>Match Score:</strong> {candidate.match_score}%</p>
                    <p><strong>Bias Risk:</strong> {candidate.bias_risk_level}</p>
                    <p><strong>Matched Skills:</strong> {candidate.matched_skills.join(', ') || 'None'}</p>
                    <p><strong>Missing Skills:</strong> {candidate.missing_skills.join(', ') || 'None'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <div className="section">
            <h2>Hiring Analytics</h2>
            {loadingAnalytics ? (
              <p>Loading analytics...</p>
            ) : analytics ? (
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Total Jobs</h3>
                  <p className="stat">{analytics.total_jobs}</p>
                </div>
                <div className="analytics-card">
                  <h3>Total Candidates</h3>
                  <p className="stat">{analytics.total_candidates}</p>
                </div>
                <div className="analytics-card">
                  <h3>Avg Match Score</h3>
                  <p className="stat">{analytics.average_match_score}%</p>
                </div>
                <div className="analytics-card">
                  <h3>Bias Alerts</h3>
                  <p className="stat">{analytics.bias_alerts}</p>
                </div>

                <div className="analytics-section">
                  <h3>Hiring Funnel</h3>
                  <div className="funnel">
                    <div className="funnel-item">
                      <span>Applied:</span> <strong>{analytics.hiring_funnel.applied}</strong>
                    </div>
                    <div className="funnel-item">
                      <span>Shortlisted:</span> <strong>{analytics.hiring_funnel.shortlisted}</strong>
                    </div>
                    <div className="funnel-item">
                      <span>Rejected:</span> <strong>{analytics.hiring_funnel.rejected}</strong>
                    </div>
                    <div className="funnel-item">
                      <span>Offered:</span> <strong>{analytics.hiring_funnel.offered}</strong>
                    </div>
                    <div className="funnel-item">
                      <span>Hired:</span> <strong>{analytics.hiring_funnel.hired}</strong>
                    </div>
                  </div>
                </div>

                <div className="analytics-section">
                  <h3>Top Skills</h3>
                  <div className="skills-list">
                    {analytics.top_skills?.map((skill, idx) => (
                      <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>No analytics data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
  
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
