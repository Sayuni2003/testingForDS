/**
 * routes/patientRoutes.js — Route Definitions for Patient Service
 *
 * ENDPOINTS (relative to this service's root):
 *   GET  /patients       → list all patients
 *   GET  /patients/:id   → find a single patient by ID (used by appointment-service)
 *   POST /patients       → create a new patient
 *
 * NOTE: The API Gateway strips /api/patients and rewrites to /patients
 */

const express = require('express');
const { getPatients, findPatientById, addPatient } = require('../controllers/patientController');
const { verifyInternalSecret } = require('../middleware/internalAuth');

const router = express.Router();

router.get('/patients', getPatients);
router.get('/patients/:id', verifyInternalSecret, findPatientById); // internal-only: requires x-internal-secret header
router.post('/patients', addPatient);

module.exports = router;
