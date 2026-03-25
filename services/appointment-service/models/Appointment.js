/**
 * models/Appointment.js — Mongoose Schema for an Appointment
 *
 * PURPOSE:
 *   Defines the shape of an appointment document stored in appointment-db.
 *   This schema ONLY exists in appointment-service.
 *
 * FIELDS:
 *   patientId — the ID of the patient (string reference, not a DB join)
 *   date      — when the appointment is scheduled
 *
 * NOTE:
 *   We store patientId as a plain string, NOT a Mongoose ObjectId ref to patient-db.
 *   That would create cross-service DB coupling, which microservices explicitly avoid.
 *   Each service manages its own data independently.
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true, // ID of the patient from patient-service
    },
    date: {
      type: String,
      required: true, // e.g. "2025-04-10"
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
