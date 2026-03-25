/**
 * models/Patient.js — Mongoose Schema for a Patient
 *
 * PURPOSE:
 *   Defines the shape of a patient document stored in patient-db.
 *   This schema ONLY exists in patient-service. No other service accesses it.
 *
 * FIELDS:
 *   name      — the patient's full name
 *   age       — the patient's age (number)
 *   condition — the medical condition being treated
 */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
