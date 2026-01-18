import './Navbar.css'

export default function Navbar({ onNavigate, currentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon">🤖</span>
          AI Hiring SaaS
        </div>
        <ul className="navbar-menu">
          <li>
            <button
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'candidate' ? 'active' : ''}
              onClick={() => onNavigate('candidate', 'candidate')}
            >
              For Candidates
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'recruiter' ? 'active' : ''}
              onClick={() => onNavigate('recruiter', 'recruiter')}
            >
              For Recruiters
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
