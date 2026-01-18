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

    e.preventDefault()
