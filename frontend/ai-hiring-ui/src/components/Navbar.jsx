import './Navbar.css'

export default function Navbar({ onNavigate, currentPage, onLoginClick, isLoggedIn, username, onLogout, isGuest, onBrowseAsGuest, onExitGuest }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => isGuest ? onExitGuest() : onNavigate('home')}>
          <span className="logo-icon">🤖</span>
          AI Hiring SaaS
        </div>
        <ul className="navbar-menu">
          <li>
            <button
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => isGuest ? onExitGuest() : onNavigate('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'candidate' ? 'active' : ''}
              onClick={() => isLoggedIn ? onNavigate('candidate', 'candidate') : onBrowseAsGuest('candidate')}
            >
              For Candidates {isGuest && '(Guest)'}
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'recruiter' ? 'active' : ''}
              onClick={() => isLoggedIn ? onNavigate('recruiter', 'recruiter') : onBrowseAsGuest('recruiter')}
            >
              For Recruiters {isGuest && '(Guest)'}
            </button>
          </li>
          {isLoggedIn && (
            <li className="user-info">
              <span className="username">👤 {username}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </li>
          )}
          {!isLoggedIn && !isGuest && (
            <>
              <li>
                <button className="guest-btn" onClick={() => onBrowseAsGuest('candidate')}>
                  Browse as Guest
                </button>
              </li>
              <li>
                <button className="login-btn" onClick={onLoginClick}>
                  Login / Register
                </button>
              </li>
            </>
          )}
          {isGuest && !isLoggedIn && (
            <li>
              <button className="exit-guest-btn" onClick={onExitGuest}>Exit Guest Mode</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
