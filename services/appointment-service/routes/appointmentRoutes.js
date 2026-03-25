/**
 * routes/appointmentRoutes.js — Route Definitions for Appointment Service
 *
 * ENDPOINTS (relative to this service's root):
 *   GET  /appointments → list all appointments
 *   POST /appointments → create a new appointment
 *
 * NOTE: The API Gateway strips /api/appointments and rewrites to /appointments
 */

const express = require('express');
const { getAppointments, addAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.get('/appointments', getAppointments);
router.post('/appointments', addAppointment);

module.exports = router;
