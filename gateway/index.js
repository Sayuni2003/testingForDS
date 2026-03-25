/**
 * gateway/index.js — API Gateway Entry Point
 *
 * PURPOSE:
 *   This is the SINGLE ENTRY POINT for all client requests.
 *   The React frontend ONLY talks to this server (port 3000).
 *   The gateway is responsible for:
 *     1. Validating JWT tokens on protected routes
 *     2. Forwarding (proxying) requests to the right microservice
 *
 * WHY A GATEWAY?
 *   Without a gateway, the frontend would need to know the ports and
 *   URLs of every single service. The gateway hides that complexity —
 *   from the frontend's perspective, there is only ONE backend.
 *
 * REQUEST FLOW:
 *   React → Gateway (3000)
 *     → /api/auth/*         → Auth Service (3001)      [PUBLIC]
 *     → /api/patients/*     → Patient Service (3002)   [PROTECTED]
 *     → /api/appointments/* → Appointment Service (3003) [PROTECTED]
 */

require('dotenv').config(); // Load .env variables (PORT, JWT_SECRET, service URLs)

const express = require('express');
const { verifyToken } = require('./middleware/auth');
const { setupRoutes } = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Allow requests from the React frontend (running on a different port)
// Without this, browsers block cross-origin requests (CORS policy)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // Handle pre-flight OPTIONS requests sent by browsers before actual requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

// Simple endpoint to confirm the gateway is alive
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', port: PORT });
});

// ─── PROTECTED ROUTE GUARD ────────────────────────────────────────────────────

/**
 * Apply JWT verification middleware to protected service routes.
 * This runs BEFORE the proxy forwards the request.
 *
 * Note: /api/auth is intentionally excluded — you don't need a token to log in!
 */
app.use('/api/patients', verifyToken);
app.use('/api/appointments', verifyToken);

// ─── PROXY ROUTES ─────────────────────────────────────────────────────────────

// Setup all proxy rules (defined in routes/index.js)
setupRoutes(app, {
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  PATIENT_SERVICE_URL: process.env.PATIENT_SERVICE_URL,
  APPOINTMENT_SERVICE_URL: process.env.APPOINTMENT_SERVICE_URL,
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`   /api/auth/*         → Auth Service (3001)         [PUBLIC]`);
  console.log(`   /api/patients/*     → Patient Service (3002)      [PROTECTED]`);
  console.log(`   /api/appointments/* → Appointment Service (3003)  [PROTECTED]\n`);
});
