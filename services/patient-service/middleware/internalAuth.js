/**
 * middleware/internalAuth.js — Internal Service-to-Service Auth Middleware
 *
 * PURPOSE:
 *   Protects routes that should ONLY be called by other internal services
 *   (not by external clients through the gateway).
 *
 * HOW IT WORKS:
 *   The caller (e.g. appointment-service) must include a shared secret
 *   in the request header: x-internal-secret: <INTERNAL_SECRET>
 *
 *   This patient-service reads that header and compares it to its own
 *   INTERNAL_SECRET env variable. If they match — the call is trusted.
 *   If not — 403 Forbidden.
 *
 * WHY THIS MATTERS:
 *   Without this, ANYONE who knows patient-service runs on port 3002
 *   can hit GET /patients/:id directly, bypassing the gateway entirely.
 *   This middleware ensures only services that know the shared secret can call it.
 */

const verifyInternalSecret = (req, res, next) => {
  const incoming = req.headers['x-internal-secret'];
  const expected = process.env.INTERNAL_SECRET;

  if (!incoming || incoming !== expected) {
    return res.status(403).json({ message: 'Forbidden: invalid or missing internal secret.' });
  }

  next(); // secret matches — allow the request through
};

module.exports = { verifyInternalSecret };
