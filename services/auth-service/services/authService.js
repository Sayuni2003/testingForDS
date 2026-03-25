/**
 * services/authService.js — Business Logic for Authentication
 *
 * PURPOSE:
 *   Contains the actual logic for registering and logging in users.
 *   The controller calls these functions — keeping logic out of the controller
 *   makes code easier to test and reason about.
 *
 * WHY SEPARATE SERVICE LAYER?
 *   Controllers handle HTTP (req/res). Services handle business logic.
 *   This separation means the same logic can be reused in different contexts
 *   (e.g., REST, CLI, tests) without duplicating code.
 *
 * FUNCTIONS:
 *   registerUser(email, password) — creates a new user with a hashed password
 *   loginUser(email, password)    — validates credentials and returns a JWT
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Number of bcrypt "salt rounds" — higher = more secure but slower
// 10 is the recommended balance for most applications
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * registerUser
 *
 * Steps:
 *   1. Check if user already exists (duplicate email)
 *   2. Hash the password with bcrypt
 *   3. Save the new user to MongoDB (auth-db)
 *   4. Return the saved user (without password)
 */
const registerUser = async (email, password) => {
  // Step 1: Prevent duplicate registrations
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  // Step 2: Hash the password — NEVER store plain text passwords
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Step 3: Create and save the user document
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  // Step 4: Return a safe representation (no password field)
  return { id: newUser._id, email: newUser.email };
};

/**
 * loginUser
 *
 * Steps:
 *   1. Find user by email
 *   2. Compare submitted password with the stored hash
 *   3. Sign and return a JWT if credentials are valid
 */
const loginUser = async (email, password) => {
  // Step 1: Find user in the database
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials.'); // vague by design (security)
  }

  // Step 2: bcrypt.compare hashes the input and checks it against the stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  // Step 3: Issue a JWT — this is what the client stores and sends in future requests
  // The payload contains the user's ID and email (avoid sensitive data in JWT payloads)
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' } // token expires in 1 day
  );

  return { token };
};

module.exports = { registerUser, loginUser };
