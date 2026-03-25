/**
 * src/api/axiosInstance.js — Configured Axios Instance
 *
 * PURPOSE:
 *   Creates a reusable axios client pre-configured with:
 *     1. Base URL pointing to the API Gateway (port 3000)
 *     2. A request interceptor that automatically attaches the JWT from localStorage
 *
 * WHY THIS MATTERS:
 *   Without this, every API call would need to manually attach the token header.
 *   The interceptor does this automatically — keep it DRY (Don't Repeat Yourself).
 *
 * AUTH FLOW (frontend side):
 *   1. User logs in → receives JWT
 *   2. JWT is stored in localStorage
 *   3. Every subsequent request goes through this instance
 *   4. The interceptor reads the token and adds: Authorization: Bearer <token>
 *   5. The gateway validates this token before forwarding the request
 */

import axios from 'axios';

// All requests go to the API Gateway (the single entry point for all services)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

/**
 * Request Interceptor
 * Runs before every request — attaches JWT if one exists in localStorage.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Read the token saved during login
    const token = localStorage.getItem('token');
    if (token) {
      // Attach it as a Bearer token in the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
