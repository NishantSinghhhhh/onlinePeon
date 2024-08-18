const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        branch: Joi.string().valid('COMP', 'ENTC', 'IT', 'Mech').required(),
        year: Joi.string().valid('FE', 'SE', 'TE', 'BE').required(),
        class: Joi.string().valid('A', 'B').required(),
        rollNumber: Joi.string().length(4).pattern(/^\d+$/).required(), // Exactly 4 digits
        registrationNumber: Joi.string().min(5).max(6).pattern(/^\d+$/).required(), // 5-6 digits
        fatherName: Joi.string().required(), // Required field for father's name
        fatherPhoneNumber: Joi.string().length(10).pattern(/^\d+$/).required(), // Exactly 10 digits
        classTeacherName: Joi.string().valid('Mr. John Doe', 'Ms. Jane Smith', 'Mr. Albert Brown', 'Ms. Emily Davis').required() // List of possible class teachers
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad Request",
            error: error.details
        });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(100).required(),
      registrationNumber: Joi.string()
          .when('isStudent', { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),
      staffId: Joi.string()
          .when('isStudent', { is: false, then: Joi.required(), otherwise: Joi.forbidden() }),
      isStudent: Joi.boolean() // Make this field optional
    });
  
    const { error } = schema.validate(req.body, { context: { isStudent: req.body.isStudent } });
  
    if (error) {
      return res.status(400).json({
        message: "Bad Request",
        error: error.details
      });
    }
    next();
  };
  

  const outpassValidation = (req, res, next) => {
      const schema = Joi.object({
          firstName: Joi.string().min(2).max(50).required(),
          lastName: Joi.string().min(2).max(50).required(),
          regNumber: Joi.string().length(4).pattern(/^\d{4}$/).required(), // Exactly 4 digits
          reason: Joi.string().min(10).required(), // Minimum 10 characters
          date: Joi.date().iso().required(), // Ensure date is in ISO format (e.g., 2024-08-18T00:00:00.000Z)
          startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Valid time format (HH:mm)
          endHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Valid time format (HH:mm)
          contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(), // Exactly 10 digits
      });
  
      const { error } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
          return res.status(400).json({
              message: "Bad Request",
              error: error.details
          });
      }
      next();
  };
  
module.exports = {
    signupValidation,
    loginValidation,
    outpassValidation
}
