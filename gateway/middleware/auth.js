/**
 * middleware/auth.js — JWT Validation Middleware
 *
 * PURPOSE:
 *   Protect routes by verifying the JWT token sent by the React frontend.
 *   If the token is valid, the request passes through to the target service.
 *   If not, it immediately returns 401 Unauthorized.
 *
 * HOW IT FITS:
 *   The API Gateway runs this middleware BEFORE proxying requests to
 *   patient-service or appointment-service. Auth routes are excluded
 *   (you can't require a token to register/login).
 *
 * AUTH FLOW:
 *   React → "Authorization: Bearer <token>" header
 *   → This middleware checks the token
 *   → If valid, forwards to the correct service
 *   → If invalid, blocks the request immediately
 */

const jwt = require('jsonwebtoken');

// Load the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * verifyToken — Express middleware function
 *
 * Reads the Authorization header, strips "Bearer ", and verifies the JWT.
 * If valid, attaches the decoded payload to req.user and calls next().
 */
const verifyToken = (req, res, next) => {
  // Read the Authorization header (e.g., "Bearer eyJhbGc...")
  const authHeader = req.headers['authorization'];

  // If no header exists, deny access immediately
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  // The token is the part after "Bearer "
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token format invalid. Use: Bearer <token>' });
  }

  // Verify the token using the shared secret
  // jwt.verify throws if the token is expired or tampered with
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Attach the decoded user info (e.g., userId, email) to the request
    // Downstream services can read this if needed
    req.user = decoded;

    // Pass control to the next middleware (the proxy)
    next();
  });
};

module.exports = { verifyToken };
