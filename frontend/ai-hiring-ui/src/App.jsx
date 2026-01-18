import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import CandidatePortal from './pages/CandidatePortal'
import RecruiterDashboard from './pages/RecruiterDashboard'
import HomePage from './pages/HomePage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [userRole, setUserRole] = useState(null)

  const handleNavigation = (page, role = null) => {
    setCurrentPage(page)
    if (role) setUserRole(role)
  }

  return (
    <div className="app">
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      <main className="main-content">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigation} />}
        {currentPage === 'candidate' && <CandidatePortal />}
        {currentPage === 'recruiter' && <RecruiterDashboard />}
      </main>
    </div>
  )
}
