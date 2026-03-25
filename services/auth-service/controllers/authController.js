/**
 * controllers/authController.js — HTTP Request Handlers for Auth
 *
 * PURPOSE:
 *   Handles the HTTP layer — reads req.body, calls the service layer,
 *   and sends the appropriate response back to the gateway.
 *
 * RULE:
 *   Controllers do NOT contain business logic.
 *   They only: parse input → call service → send response.
 */

const { registerUser, loginUser } = require('../services/authService');

/**
 * register — POST /register
 *
 * Expects: { email, password }
 * Returns: 201 + user info on success
 *          400 + error message on failure
 */
const register = async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * login — POST /login
 *
 * Expects: { email, password }
 * Returns: 200 + { token } on success
 *          401 + error message on failure
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await loginUser(email, password);
    // The token is what the React frontend will store in localStorage
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { register, login };
