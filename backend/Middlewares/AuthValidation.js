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
          registrationNumber: Joi.string().length(5).length(6).pattern(/^\d{5,6}$/).required(),
          reason: Joi.string().min(10).required(),
          date: Joi.date().iso().required(),
          startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
          endHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
          contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
          className: Joi.string().valid(
              'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B', 'FE-MECH', 'FE-ARE',
              'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-IT-A', 'SE-IT-B', 'SE-MECH',
              'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH',
              'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
          ).required(),
          extraDataArray: Joi.array().items(Joi.number()).length(4).required() // Ensures the array has exactly 4 numbers
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
        registrationNumber: Joi.string().min(5).max(6).pattern(/^\d+$/).required(), // Updated for 5 or 6 digits
        reasonForLeave: Joi.string().min(10).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
        placeOfResidence: Joi.string().min(2).max(100).required(),
        attendancePercentage: Joi.number().min(0).max(100).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
        className: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B', 'FE-MECH', 'FE-ARE',
            'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-IT-A', 'SE-IT-B', 'SE-MECH',
            'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH',
            'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
        ).required(),
        extraDataArray: Joi.array().items(Joi.number()).optional() // Optional array of numbers
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

const plValidation = (req, res, next) => {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    // Define the Joi schema
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(50).required(),
        lastName: Joi.string().min(1).max(50).required(),
        className: Joi.string().valid(
            'FE-Comp-A', 'FE-Comp-B', 'FE-IT-A', 'FE-IT-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-Mech-A', 'FE-Mech-B',
            'SE-Comp-A', 'SE-Comp-B', 'SE-IT-A', 'SE-IT-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-Mech-A', 'SE-Mech-B',
            'TE-Comp-A', 'TE-Comp-B', 'TE-IT-A', 'TE-IT-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-Mech-A', 'TE-Mech-B',
            'BE-Comp-A', 'BE-Comp-B', 'BE-IT-A', 'BE-IT-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-Mech-A', 'BE-Mech-B',
            'ARE'
        ).required(),
        rollNumber: Joi.string().pattern(/^\d{4}$/).required(), // Ensuring roll number is exactly 4 digits
        registrationNumber: Joi.string().length(6).max(6).required(), // Registration number must be 5 to 6 characters
        classesMissed: Joi.number().min(0).required(),
        reason: Joi.string().min(10).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required().greater(Joi.ref('startDate')), // Ensure endDate is after startDate
        document: Joi.string().pattern(/^data:(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document);base64,([A-Za-z0-9+/=]+)$/)
            .required()
            .messages({
                'string.pattern.base': 'Document must be a valid base64 string with a PDF or Word document MIME type.'
            }),
        extraDataArray: Joi.array().items(Joi.number().min(0)).length(4).required() // Ensure it is an array of numbers with 4 elements
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
const staffSignupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        staffId: Joi.string().length(6).pattern(/^\d+$/).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d+$/).required(),
        position: Joi.string().valid(
            'HOD', 
            'Class Teacher', 
            'Warden', 
            'Joint Director', 
            'Director'
        ).required(),
        classAssigned: Joi.string().valid(
            'FE-Comp-A', 'FE-Comp-B', 'FE-IT-A', 'FE-IT-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-Mech-A', 'FE-Mech-B',
            'SE-Comp-A', 'SE-Comp-B', 'SE-IT-A', 'SE-IT-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-Mech-A', 'SE-Mech-B',
            'TE-Comp-A', 'TE-Comp-B', 'TE-IT-A', 'TE-IT-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-Mech-A', 'TE-Mech-B',
            'BE-Comp-A', 'BE-Comp-B', 'BE-IT-A', 'BE-IT-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-Mech-A', 'BE-Mech-B',
            'ARE'
        ).when('position', {
            is: Joi.string().valid('Class Teacher', 'HOD', 'Warden'),
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    });

    console.log("Request Body:", req.body);

    const { error } = schema.validate(req.body);

    if (error) {
        console.log("Validation Error Details:", error.details);
        return res.status(400).json({
            message: "Bad Request",
            error: error.details.map(err => ({
                message: err.message,
                path: err.path,
                type: err.type
            }))
        });
    }
    next();
};

const loginStaffValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        staffId: Joi.string().required(), // Staff-specific ID validation
        isStudent: Joi.boolean().valid(false).required() // Ensure isStudent is false for staff
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


module.exports = {
    signupValidation,
    loginValidation,
    outpassValidation,
    leaveValidation ,
    plValidation,
    staffSignupValidation,
    loginStaffValidation
}
