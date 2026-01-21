import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import CandidatePortal from './pages/CandidatePortal'
import RecruiterDashboard from './pages/RecruiterDashboard'
import HomePage from './pages/HomePage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [userRole, setUserRole] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const savedUsername = localStorage.getItem('username')
    if (token && savedUsername) {
      setIsLoggedIn(true)
      setUsername(savedUsername)
      const userType = localStorage.getItem('user_type')
      setUserRole(userType)
    }
  }, [])

  const handleNavigation = (page, role = null) => {
    setCurrentPage(page)
    if (role) setUserRole(role)
  }

  const handleBrowseAsGuest = (role) => {
    setIsGuest(true)
    setUserRole(role)
    if (role === 'candidate') {
      setCurrentPage('candidate')
    } else if (role === 'recruiter') {
      setCurrentPage('recruiter')
    }
  }

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true)
    setUsername(user.username)
    setUserRole(user.user_type)
    setIsGuest(false)
    // Navigate to appropriate portal based on user type
    if (user.user_type === 'candidate') {
      setCurrentPage('candidate')
    } else if (user.user_type === 'recruiter') {
      setCurrentPage('recruiter')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_type')
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setUsername('')
    setUserRole(null)
    setIsGuest(false)
    setCurrentPage('home')
  }

  const handleExitGuest = () => {
    setIsGuest(false)
    setUserRole(null)
    setCurrentPage('home')
  }

  return (
    <div className="app">
      <Navbar 
        onNavigate={handleNavigation} 
        currentPage={currentPage}
        onLoginClick={() => setAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        isGuest={isGuest}
        onBrowseAsGuest={handleBrowseAsGuest}
        onExitGuest={handleExitGuest}
      />
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <main className="main-content">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigation} onBrowseAsGuest={handleBrowseAsGuest} />}
        {currentPage === 'candidate' && (isLoggedIn || isGuest) && <CandidatePortal isGuest={isGuest} />}
        {currentPage === 'recruiter' && (isLoggedIn || isGuest) && <RecruiterDashboard isGuest={isGuest} />}
      </main>
    </div>
  )
}
