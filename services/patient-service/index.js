/**
 * patient-service/index.js — Patient Service Entry Point
 *
 * PURPOSE:
 *   Starts the patient microservice on port 3002.
 *   Connects to its own dedicated database: patient-db.
 *
 * SERVICE BOUNDARY:
 *   This service is the sole owner of patient data.
 *   The API Gateway routes /api/patients/* → here (with JWT already validated).
 *   This service trusts that the gateway has authenticated the request.
 *
 * ENDPOINTS:
 *   GET  /patients → list all patients
 *   POST /patients → add a new patient
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────────────────────────

app.use('/', patientRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'Patient Service is running', port: PORT });
});

// ─── DATABASE + START ────────────────────────────────────────────────────────

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🏥 Patient Service running on http://localhost:${PORT}`);
      console.log(`   GET  /patients → list all patients`);
      console.log(`   POST /patients → add a new patient`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
