/**
 * auth-service/index.js — Auth Service Entry Point
 *
 * PURPOSE:
 *   Starts the auth microservice, connects to its own MongoDB database (auth-db),
 *   and listens for HTTP requests forwarded by the API Gateway.
 *
 * WHY ITS OWN DATABASE?
 *   Service isolation is a key microservices principle. If any other service
 *   goes down or is deleted, auth data remains completely unaffected.
 *   auth-db is ONLY accessible by this service.
 *
 * WHAT THIS SERVICE DOES:
 *   - POST /register → create a new user with a hashed password
 *   - POST /login    → verify credentials and return a signed JWT
 */

require('dotenv').config(); // Load PORT, MONGO_URI, JWT_SECRET from .env

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

// Parse incoming JSON bodies (from the gateway's proxied requests)
app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────────────────────────

// Mount auth routes at the root — gateway will strip /api/auth before forwarding
app.use('/', authRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running', port: PORT });
});

// ─── DATABASE + START ────────────────────────────────────────────────────────

/**
 * Connect to MongoDB first, then start the server.
 * This ensures the service won't accept requests before the DB is ready.
 */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
      console.log(`   POST /register → create a new user`);
      console.log(`   POST /login    → authenticate and receive JWT`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if DB connection fails — no point running without a DB
  });
