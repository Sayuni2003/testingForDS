/**
 * services/patientService.js — Business Logic for Patients
 *
 * PURPOSE:
 *   Contains all database operations for the patient resource.
 *   The controller layer calls these functions and handles HTTP responses.
 *
 * FUNCTIONS:
 *   getAllPatients()       — fetch all patients from patient-db
 *   getPatientById(id)    — fetch a single patient by MongoDB _id
 *   createPatient(data)   — validate and save a new patient
 *
 * NOTE on getPatientById:
 *   This is used by appointment-service via an internal HTTP call to verify
 *   that a patient exists before an appointment is created.
 *   This is synchronous inter-service communication — appointment-service
 *   calls patient-service directly (not through the gateway) on its internal port.
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

/**
 * getPatientById
 * Finds a single patient by their MongoDB _id.
 * Returns null if not found — the caller decides what to do with that.
 *
 * @param {string} id - MongoDB _id string
 */
const getPatientById = async (id) => {
  const patient = await Patient.findById(id);
  return patient; // null if not found
};

module.exports = { getAllPatients, getPatientById, createPatient };
