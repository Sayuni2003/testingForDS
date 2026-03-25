/**
 * src/App.jsx — Root Component / Simple Router
 *
 * PURPOSE:
 *   Controls which page is displayed based on user authentication state.
 *   Uses simple state-based "routing" — no react-router needed.
 *
 * STATE:
 *   isLoggedIn — true if a JWT exists in localStorage
 *   currentPage — 'patients' | 'appointments' (which page to show after login)
 *
 * LOGIC:
 *   - On mount, check localStorage for an existing token
 *   - If token exists: show the app (patients/appointments pages)
 *   - If not: show the login/register page
 */

import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';

function App() {
  // Check if a JWT already exists (user was previously logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('patients');

  useEffect(() => {
    // On app load, check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Called by LoginPage after successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Clear token and return to login screen
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentPage('patients');
  };

  // Not logged in — show the Login/Register page
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Logged in — show the navigation + current page
  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <span className="navbar-brand">🏥 MicroHealth</span>
        <div className="navbar-links">
          <button
            className={currentPage === 'patients' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('patients')}
          >
            Patients
          </button>
          <button
            className={currentPage === 'appointments' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('appointments')}
          >
            Appointments
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        {currentPage === 'patients' && <PatientsPage />}
        {currentPage === 'appointments' && <AppointmentsPage />}
      </main>
    </div>
  );
}

export default App;
