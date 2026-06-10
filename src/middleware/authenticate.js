'use strict';

const jwt = require('jsonwebtoken');

/**
 * Express middleware that verifies the Authorization: Bearer <token> header.
 * Attaches decoded payload to req.user = { id, email, role }.
 * Returns 401 if token is missing, malformed, or expired.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized', errors: [] });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized', errors: [] });
  }
}

module.exports = authenticate;
