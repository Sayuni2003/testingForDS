/**
 * services/appointmentService.js — Business Logic for Appointments
 *
 * PURPOSE:
 *   Contains database operations for appointments.
 *   Validates that the patient exists in patient-service BEFORE saving.
 *
 * ─── INTER-SERVICE COMMUNICATION ──────────────────────────────────────────────
 *
 *   Patient data lives in patient-db, owned by patient-service.
 *   Appointment-service cannot query that database directly (DB isolation rule).
 *
 *   Solution: make an HTTP call to patient-service:
 *     GET http://localhost:3002/patients/:id
 *   If patient exists → 200 → proceed to save
 *   If patient doesn't exist → 404 → reject with a clear message
 *   If patient-service is down → network error → return 503
 *
 *   NOTE: This is a DIRECT service-to-service call (bypasses the gateway).
 *   The gateway is for external clients. Internal calls go directly to the port.
 *
 * ─── THE TRADEOFF (real microservices lesson) ─────────────────────────────────
 *
 *   This creates a runtime dependency: if patient-service is down,
 *   appointments cannot be created. This is called a "cascading failure".
 *   Handling it (circuit breakers, retries) is what makes production microservices hard.
 */

const axios = require('axios');
const Appointment = require('../models/Appointment');

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL;

/**
 * getAllAppointments
 */
const getAllAppointments = async () => {
  const appointments = await Appointment.find();
  return appointments;
};

/**
 * createAppointment
 *
 * 1. Call patient-service to verify patient exists
 * 2. Patient not found → throw 404 error
 * 3. Patient-service unreachable → throw 503 error
 * 4. Patient exists → save appointment to appointment-db
 */
const createAppointment = async (data) => {
  const { patientId, date } = data;

  if (!patientId || !date) {
    throw { status: 400, message: 'patientId and date are required.' };
  }

  // ── Validate: does this patient actually exist? ──────────────────────────────
  //
  // We include the INTERNAL_SECRET in the header so patient-service knows
  // this request is coming from a trusted internal service, not an external caller.
  // A 3000ms timeout prevents appointment-service from hanging if patient-service is slow.
  try {
    await axios.get(`${PATIENT_SERVICE_URL}/patients/${patientId}`, {
      headers: { 'x-internal-secret': process.env.INTERNAL_SECRET },
      timeout: 3000, // fail fast — don't wait forever if patient-service is unresponsive
    });
    // Reaching here means patient-service returned 200 — patient exists, proceed

  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Patient ID format is valid but no patient found with that ID
      throw {
        status: 404,
        message: `Patient with ID "${patientId}" does not exist. Add the patient first.`,
      };
    }
    // Network error or timeout — patient-service is down or unreachable
    throw {
      status: 503,
      message: 'Patient service is unavailable. Cannot validate patient. Try again later.',
    };
  }

  // ── Patient verified — create and save the appointment ──────────────────────
  const appointment = new Appointment({ patientId, date });
  await appointment.save();
  return appointment;
};

module.exports = { getAllAppointments, createAppointment };

