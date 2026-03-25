/**
 * controllers/patientController.js — HTTP Request Handlers for Patients
 *
 * PURPOSE:
 *   Bridges HTTP requests (from the gateway) to the patientService business logic.
 *   Handles input parsing and response formatting only.
 */

const { getAllPatients, createPatient } = require('../services/patientService');

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

module.exports = { getPatients, addPatient };
