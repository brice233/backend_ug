'use strict';

/**
 * Global Express error handler (4-argument signature).
 * Logs full stack trace to terminal.
 * Returns appropriate status code with consistent error envelope.
 *
 * @param {Error} err - The error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: [],
  });
}

module.exports = errorHandler;
