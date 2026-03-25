/**
 * routes/patientRoutes.js — Route Definitions for Patient Service
 *
 * ENDPOINTS (relative to this service's root):
 *   GET  /patients → list all patients
 *   POST /patients → create a new patient
 *
 * NOTE: The API Gateway strips /api/patients and rewrites to /patients
 */

const express = require('express');
const { getPatients, addPatient } = require('../controllers/patientController');

const router = express.Router();

router.get('/patients', getPatients);
router.post('/patients', addPatient);

module.exports = router;
