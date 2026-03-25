/**
 * routes/index.js — Proxy Route Definitions
 *
 * PURPOSE:
 *   Maps incoming gateway paths to the correct microservice.
 *   Uses http-proxy-middleware to forward the full request
 *   (headers, body, method) to the target service.
 *
 * WHY PROXY?
 *   The frontend only knows about port 3000 (the gateway).
 *   The gateway is responsible for routing — services stay hidden
 *   behind the gateway and are not directly exposed to the client.
 *
 * ROUTE MAP:
 *   /api/auth/*         → Auth Service (port 3001)
 *   /api/patients/*     → Patient Service (port 3002)
 *   /api/appointments/* → Appointment Service (port 3003)
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * setupRoutes — attaches proxy middleware to the Express app
 *
 * @param {object} app - the Express app instance
 * @param {object} env - environment variables (service URLs)
 */
const setupRoutes = (app, env) => {
  /**
   * AUTH ROUTES — no JWT check needed (public endpoints)
   * Forwards everything under /api/auth to port 3001
   * Path rewrite: /api/auth/register → /register (auth-service doesn't know about /api/auth prefix)
   */
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: env.AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '' }, // strip the /api/auth prefix
      on: {
        error: (err, req, res) => {
          res.status(502).json({ message: 'Auth service unavailable', error: err.message });
        },
      },
    })
  );

  /**
   * PATIENT ROUTES — protected (JWT middleware is applied in index.js before this)
   * Forwards everything under /api/patients to port 3002
   */
  app.use(
    '/api/patients',
    createProxyMiddleware({
      target: env.PATIENT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/patients': '/patients' },
      on: {
        error: (err, req, res) => {
          res.status(502).json({ message: 'Patient service unavailable', error: err.message });
        },
      },
    })
  );

  /**
   * APPOINTMENT ROUTES — protected (JWT middleware is applied in index.js before this)
   * Forwards everything under /api/appointments to port 3003
   */
  app.use(
    '/api/appointments',
    createProxyMiddleware({
      target: env.APPOINTMENT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/appointments': '/appointments' },
      on: {
        error: (err, req, res) => {
          res.status(502).json({ message: 'Appointment service unavailable', error: err.message });
        },
      },
    })
  );
};

module.exports = { setupRoutes };
