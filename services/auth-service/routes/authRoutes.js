/**
 * routes/authRoutes.js — Route Definitions for Auth Service
 *
 * PURPOSE:
 *   Defines which HTTP methods + paths map to which controller functions.
 *   Keeps routing logic separate from business logic.
 *
 * ENDPOINTS (relative to this service's root):
 *   POST /register  → Create a new user account
 *   POST /login     → Authenticate and receive a JWT
 *
 * NOTE:
 *   The API Gateway strips the /api/auth prefix before forwarding here,
 *   so this service only sees /register and /login.
 */

const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// POST /register — create a new account
router.post('/register', register);

// POST /login — authenticate and get a JWT
router.post('/login', login);

module.exports = router;
