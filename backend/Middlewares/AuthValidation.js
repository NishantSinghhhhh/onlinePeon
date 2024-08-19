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
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        registrationNumber: Joi.string().length(4).pattern(/^\d{4}$/).required(),
        reason: Joi.string().min(10).required(),
        date: Joi.date().iso().required(),
        startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
        endHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        console.error('Validation error:', JSON.stringify(error.details, null, 2));
        return res.status(400).json({
            message: "Bad Request",
            error: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }

    console.log('Validation passed. Validated data:', JSON.stringify(value, null, 2));
    next();
};

const leaveValidation = (req, res, next) => {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    // Define the Joi schema
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        registrationNumber: Joi.string().length(4).pattern(/^\d{4}$/).required(),
        reasonForLeave: Joi.string().min(10).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
        placeOfResidence: Joi.string().min(2).max(100).required(),
        attendancePercentage: Joi.number().min(0).max(100).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        console.error('Validation error:', JSON.stringify(error.details, null, 2));
        return res.status(400).json({
            message: "Bad Request",
            error: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }

    console.log('Validation passed. Validated data:', JSON.stringify(value, null, 2));
    next();
};


module.exports = {
    signupValidation,
    loginValidation,
    outpassValidation,
    leaveValidation 
}
