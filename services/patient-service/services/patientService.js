/**
 * services/patientService.js — Business Logic for Patients
 *
 * PURPOSE:
 *   Contains all database operations for the patient resource.
 *   The controller layer calls these functions and handles HTTP responses.
 *
 * FUNCTIONS:
 *   getAllPatients()     — fetch all patients from patient-db
 *   createPatient(data) — validate and save a new patient
 */

const Patient = require('../models/Patient');

/**
 * getAllPatients
 * Returns all patient documents from patient-db.
 */
const getAllPatients = async () => {
  const patients = await Patient.find();
  return patients;
};

/**
 * createPatient
 * Creates and saves a new patient document.
 *
 * @param {object} data - { name, age, condition }
 */
const createPatient = async (data) => {
  const { name, age, condition } = data;

  if (!name || !age || !condition) {
    throw new Error('name, age, and condition are required.');
  }

  const patient = new Patient({ name, age, condition });
  await patient.save();
  return patient;
};

module.exports = { getAllPatients, createPatient };
