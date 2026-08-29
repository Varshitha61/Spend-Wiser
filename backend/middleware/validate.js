/**
 * Validation middleware for request body validation
 * Uses Joi schemas to validate incoming requests
 */

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // Return all errors, not just first one
      stripUnknown: true  // Remove unknown properties
    });

    if (error) {
      // Format error messages
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: messages 
      });
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
