/**
 * controllers/appointmentController.js — HTTP Request Handlers for Appointments
 *
 * PURPOSE:
 *   Bridges HTTP requests (from the gateway) to the appointmentService business logic.
 */

const { getAllAppointments, createAppointment } = require('../services/appointmentService');

/**
 * getAppointments — GET /appointments
 * Returns a list of all appointments.
 */
const getAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * addAppointment — POST /appointments
 *
 * Returns:
 *   201 — appointment created
 *   400 — missing fields
 *   404 — patient ID not found in patient-service
 *   503 — patient-service is down (cannot validate)
 */
const addAppointment = async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    // The service throws { status, message } objects for known errors.
    // Fall back to 500 for unexpected errors.
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: err.message || 'Internal server error.' });
  }
};

module.exports = { getAppointments, addAppointment };
