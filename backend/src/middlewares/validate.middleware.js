const { sendError } = require('../helpers/response.helper');

/**
 * Middleware factory to validate req.body against a Joi schema
 * @param {Joi.ObjectSchema} schema
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join('; ');
      return sendError(res, 400, errorMessage);
    }
    req.body = value;
    next();
  };
};

module.exports = {
  validateBody,
};
