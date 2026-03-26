/**
 * controllers/patientController.js — HTTP Request Handlers for Patients
 *
 * PURPOSE:
 *   Bridges HTTP requests (from the gateway) to the patientService business logic.
 *   Handles input parsing and response formatting only.
 */

const { getAllPatients, getPatientById, createPatient } = require('../services/patientService');

/**
 * getPatients — GET /patients
 * Returns a list of all patients.
 */
const getPatients = async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * addPatient — POST /patients
 * Expects: { name, age, condition }
 * Returns: 201 + the created patient document
 */
const addPatient = async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * findPatientById — GET /patients/:id
 *
 * Called internally by appointment-service to verify a patient exists.
 * Also exposed through the gateway so the frontend can look up individual patients.
 *
 * Returns: 200 + patient  |  404 if not found  |  500 on error
 */
const findPatientById = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    res.status(200).json(patient);
  } catch (err) {
    // Mongoose throws a CastError if the id format is invalid
    res.status(400).json({ message: 'Invalid patient ID format.' });
  }
};

module.exports = { getPatients, findPatientById, addPatient };
