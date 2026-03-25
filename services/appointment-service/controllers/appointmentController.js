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
 * Expects: { patientId, date }
 * Returns: 201 + the created appointment document
 */
const addAppointment = async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAppointments, addAppointment };
