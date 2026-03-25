/**
 * services/appointmentService.js — Business Logic for Appointments
 *
 * PURPOSE:
 *   Contains all database operations for the appointment resource.
 *
 * NOTE on service isolation:
 *   This service does NOT call patient-service to validate patientId.
 *   In a simple learning system, we trust the client provides a valid ID.
 *   In production, you'd validate via an event/message bus or an internal API call.
 *
 * FUNCTIONS:
 *   getAllAppointments()     — fetch all appointments from appointment-db
 *   createAppointment(data) — validate and save a new appointment
 */

const Appointment = require('../models/Appointment');

/**
 * getAllAppointments
 * Returns all appointment documents from appointment-db.
 */
const getAllAppointments = async () => {
  const appointments = await Appointment.find();
  return appointments;
};

/**
 * createAppointment
 * Creates and saves a new appointment document.
 *
 * @param {object} data - { patientId, date }
 */
const createAppointment = async (data) => {
  const { patientId, date } = data;

  if (!patientId || !date) {
    throw new Error('patientId and date are required.');
  }

  const appointment = new Appointment({ patientId, date });
  await appointment.save();
  return appointment;
};

module.exports = { getAllAppointments, createAppointment };
