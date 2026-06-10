'use strict';

/**
 * Factory that returns middleware validating req.body against a Joi schema.
 * On failure: returns 400 with { success: false, message, errors: [...] }.
 * On success: calls next().
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    return next();
  };
}

module.exports = validate;
