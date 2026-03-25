/**
 * src/pages/LoginPage.jsx — Login & Register Page
 *
 * PURPOSE:
 *   Allows users to either register a new account or log in with existing credentials.
 *   On successful login, the JWT is saved to localStorage and the parent (App.jsx)
 *   is notified so the app can show protected pages.
 *
 * AUTH FLOW (step by step):
 *   1. User submits the form (email + password)
 *   2. POST request goes to API Gateway: /api/auth/register or /api/auth/login
 *   3. Gateway forwards to Auth Service (port 3001) — no JWT check on auth routes
 *   4. Auth Service:
 *      - Register: hashes password with bcrypt, saves to auth-db, returns success
 *      - Login: verifies password, creates and returns a signed JWT
 *   5. Frontend stores the token: localStorage.setItem('token', token)
 *   6. Calls onLoginSuccess() so App.jsx switches to the protected pages
 */

import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

// onLoginSuccess is a callback from App.jsx — called after a successful login
function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false); // toggle between Login and Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Choose the correct endpoint based on form mode
    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    try {
      const response = await axiosInstance.post(endpoint, { email, password });

      if (isRegister) {
        // Registration successful — switch to login mode
        setMessage('✅ Registered successfully! Please log in.');
        setIsRegister(false);
      } else {
        // Login successful — save the JWT to localStorage
        const { token } = response.data;
        localStorage.setItem('token', token);
        setMessage('✅ Logged in!');
        onLoginSuccess(); // notify App.jsx to show protected pages
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong.';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>{isRegister ? '📝 Register' : '🔐 Login'}</h2>
        <p className="subtitle">
          {isRegister ? 'Create a new account' : 'Sign in to access the system'}
        </p>

        <form onSubmit={handleSubmit} className="form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="toggle-link">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>
            {isRegister ? 'Login here' : 'Register here'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
