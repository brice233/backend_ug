'use strict';

/**
 * Factory that returns middleware enforcing specific role(s).
 * Usage: requireRole('admin') or requireRole(['admin', 'moderator'])
 * Returns 403 if req.user.role is not in the allowed roles.
 *
 * @param {string|string[]} roles - The required role(s)
 * @returns {Function} Express middleware
 */
function requireRole(roles) {
  // Normalize to array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden', errors: [] });
    }
    return next();
  };
}

module.exports = requireRole;
