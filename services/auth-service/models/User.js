/**
 * models/User.js — Mongoose Schema for a User
 *
 * PURPOSE:
 *   Defines the shape of a user document stored in MongoDB (auth-db).
 *   This schema only lives in auth-service — no other service knows about it.
 *
 * WHY ISOLATED?
 *   Each microservice owns its data. If auth-service is replaced,
 *   other services are unaffected because they never touched this DB.
 *
 * FIELDS:
 *   email    — unique identifier for the user
 *   password — stored as a bcrypt hash (NEVER stored in plain text)
 */

const mongoose = require('mongoose');

// Define the schema — intentionally minimal for clarity
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,   // no two users can share the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stored as bcrypt hash
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// Export the model so services/authService.js can use it
const User = mongoose.model('User', userSchema);

module.exports = User;
