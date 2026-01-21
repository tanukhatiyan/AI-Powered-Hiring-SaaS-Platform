import { useState } from 'react'
import './CandidatePortal.css'

export default function CandidatePortal({ isGuest }) {
  const [file, setFile] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [results, setResults] = useState(null)

  const jobListings = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      salary: '$120k - $150k',
      location: 'New York, NY',
      description: 'We are looking for a Senior React Developer with 5+ years of experience. Must be proficient in React, TypeScript, and Node.js.',
      requirements: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Git']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartUp Inc',
      salary: '$100k - $130k',
      location: 'San Francisco, CA',
      description: 'Full Stack Engineer needed for a fast-growing startup. Experience with React, Python, and AWS required.',
      requirements: ['React', 'Python', 'AWS', 'Docker', 'PostgreSQL']
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Analytics Co',
      salary: '$110k - $140k',
      location: 'Boston, MA',
      description: 'Data Scientist position focused on machine learning models. Python and SQL expertise required.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis']
    }
  ]

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a resume file')
      return
    }
    if (!selectedJob) {
      alert('Please select a job to match against')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 30
      })
    }, 300)

    try {
      const formData = new FormData()
      const job = jobListings.find(j => j.id === parseInt(selectedJob))
      formData.append('job_description', job.description)
      formData.append('resume', file)

      console.log('Sending resume to backend...')
      const response = await fetch('http://127.0.0.1:8000/candidate/match-resume', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error:', errorText)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Analysis result:', data)
      setAnalysisProgress(100)

      setResults({
        message: 'Resume analyzed successfully',
        job: job.title,
        company: job.company,
        skills: data.skills || [],
        experienceYears: data.experience_years || 0,
        matchScore: data.match_score || 0,
        biasRisk: data.bias_risk || 'Low',
        matchedSkills: data.matched_skills || [],
        missingSkills: data.missing_skills || [],
        githubProjects: data.github_projects || [],
        projectsVerified: data.projects_verified || 0
      })
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Full error:', error)
      
      // Fallback to mock data if API fails
      const job = jobListings.find(j => j.id === parseInt(selectedJob))
      setAnalysisProgress(100)
      
      console.log('Using mock data fallback')
      setResults({
        message: `Resume analyzed (Mock - API unavailable: ${error.message})`,
        job: job.title,
        company: job.company,
        skills: ['Python', 'React', 'FastAPI', 'Machine Learning'],
        experienceYears: 3,
        matchScore: 72,
        biasRisk: 'Low',
        matchedSkills: ['Python', 'React', 'Machine Learning'],
        missingSkills: ['TypeScript', 'AWS'],
        githubProjects: [
          {
            username: 'johndoe',
            repo_name: 'ai-project',
            exists: true,
            url: 'https://github.com/johndoe/ai-project',
            stars: 42,
            language: 'Python',
            description: 'Machine learning project for classification'
          },
          {
            username: 'johndoe',
            repo_name: 'web-app',
            exists: true,
            url: 'https://github.com/johndoe/web-app',
            stars: 128,
            language: 'JavaScript',
            description: 'React web application'
          }
        ],
        projectsVerified: 2
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="candidate-portal">
      <h1>Candidate Portal</h1>
      <p className="subtitle">Find your perfect job match</p>

      {isGuest && (
        <div className="guest-notice">
          <p>👤 <strong>You're browsing as a guest.</strong> Please <strong>Login or Register</strong> in the navbar to upload your resume and apply for jobs!</p>
        </div>
      )}

      <div className="portal-container">
        {/* Job Listings Section */}
        <div className="jobs-section">
          <h2>Available Positions</h2>
          <div className="jobs-list">
            {jobListings.map(job => (
              <div
                key={job.id}
                className={`job-listing ${selectedJob === String(job.id) ? 'selected' : ''}`}
                onClick={() => setSelectedJob(String(job.id))}
              >
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="company-name">{job.company}</span>
                </div>
                <p className="location">📍 {job.location}</p>
                <p className="salary">💰 {job.salary}</p>
                <p className="description">{job.description}</p>
                <div className="requirements">
                  <strong>Required Skills:</strong>
                  <div className="skill-tags">
                    {job.requirements.map((req, idx) => (
                      <span key={idx} className="req-tag">{req}</span>
                    ))}
                  </div>
                </div>
                {selectedJob === String(job.id) && (
                  <div className="selection-indicator">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload & Analysis Section */}
        <div className="upload-section">
          <h2>Upload Your Resume</h2>
          {selectedJob && (
            <div className="selected-job-info">
              <p>Matching against: <strong>{jobListings.find(j => j.id === parseInt(selectedJob))?.title}</strong></p>
            </div>
          )}
          
          {isGuest ? (
            <div className="guest-disabled-notice">
              <p>Resume upload is available for registered users only.</p>
              <p>Please login or register to upload your resume and match with jobs.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="file-input-wrapper">
                <label htmlFor="file-input" className="file-label">
                  <div className="file-icon">📄</div>
                  <p>Click to select or drag your resume (PDF or DOC)</p>
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    title="Select your resume file (PDF, DOC, or DOCX format)"
                    disabled={isAnalyzing}
                />
              </label>
              {file && <p className="file-name">✓ Selected: {file.name}</p>}
            </div>

            <button
              type="submit"
              className="analyze-btn"
              disabled={!file || !selectedJob || isAnalyzing}
            >
              {isAnalyzing ? `Analyzing... ${Math.round(analysisProgress)}%` : 'Match Resume'}
            </button>
            </form>
          )}

          {isAnalyzing && (
            <div className="progress-section">
              <h3>Analyzing your resume...</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">{Math.round(analysisProgress)}% complete</p>
            </div>
          )}

          {results && !isAnalyzing && (
            <div className="results-section">
              <h3>Match Results</h3>
              <div className="results-card">
                <div className="result-header">
                  <div className="result-title">
                    <h4>{results.job}</h4>
                    <p>{results.company}</p>
                  </div>
                  <div className={`match-score ${results.matchScore >= 70 ? 'high' : results.matchScore >= 50 ? 'medium' : 'low'}`}>
                    {Math.round(results.matchScore)}%
                  </div>
                </div>

                <div className="result-item">
                  <span className="label">Years of Experience:</span>
                  <span className="value">{results.experienceYears} years</span>
                </div>

                <div className="result-item">
                  <span className="label">Skills Extracted:</span>
                  <div className="skills-list">
                    {results.skills && results.skills.length > 0 ? (
                      results.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <p className="no-data">No skills detected</p>
                    )}
                  </div>
                </div>

                {results.matchedSkills && results.matchedSkills.length > 0 && (
                  <div className="result-item">
                    <span className="label">Matched Skills:</span>
                    <div className="skills-list">
                      {results.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag matched">✓ {skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {results.missingSkills && results.missingSkills.length > 0 && (
                  <div className="result-item">
                    <span className="label">Missing Skills:</span>
                    <div className="skills-list">
                      {results.missingSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag missing">✗ {skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="result-item">
                  <span className="label">Bias Risk Assessment:</span>
                  <span className={`bias-tag ${results.biasRisk.toLowerCase()}`}>
                    {results.biasRisk}
                  </span>
                </div>

                {results.githubProjects && results.githubProjects.length > 0 && (
                  <div className="result-item">
                    <span className="label">GitHub Projects ({results.projectsVerified}/{results.githubProjects.length} Verified):</span>
                    <div className="github-projects">
                      {results.githubProjects.map((proj, idx) => (
                        <div key={idx} className={`github-project ${proj.exists ? 'verified' : 'unverified'}`}>
                          <div className="project-header">
                            <span className="status-badge">{proj.exists ? '✓ Verified' : '✗ Not Found'}</span>
                            {proj.url && (
                              <a href={proj.url} target="_blank" rel="noopener noreferrer" className="project-link">
                                {proj.username}/{proj.repo_name}
                              </a>
                            )}
                            {!proj.url && (
                              <span className="project-name">{proj.username}/{proj.repo_name}</span>
                            )}
                          </div>
                          {proj.exists && (
                            <div className="project-meta">
                              {proj.stars !== undefined && <span>⭐ {proj.stars} stars</span>}
                              {proj.language && <span>💻 {proj.language}</span>}
                            </div>
                          )}
                          {proj.description && (
                            <p className="project-desc">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
