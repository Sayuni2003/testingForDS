/**
 * appointment-service/index.js — Appointment Service Entry Point
 *
 * PURPOSE:
 *   Starts the appointment microservice on port 3003.
 *   Connects to its own dedicated database: appointment-db.
 *
 * SERVICE BOUNDARY:
 *   This service is the sole owner of appointment data.
 *   The API Gateway routes /api/appointments/* → here (with JWT already validated).
 *
 * ENDPOINTS:
 *   GET  /appointments → list all appointments
 *   POST /appointments → schedule a new appointment
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────────────────────────

app.use('/', appointmentRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'Appointment Service is running', port: PORT });
});

// ─── DATABASE + START ────────────────────────────────────────────────────────

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`📅 Appointment Service running on http://localhost:${PORT}`);
      console.log(`   GET  /appointments → list all appointments`);
      console.log(`   POST /appointments → schedule a new appointment`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
