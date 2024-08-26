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
        classesMissed: Joi.number().min(0).required(),
        reason: Joi.string().min(10).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required().greater(Joi.ref('startDate')), // Ensure endDate is after startDate
        document: Joi.string().pattern(/^data:(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document);base64,([A-Za-z0-9+/=]+)$/)
            .required()
            .messages({
                'string.pattern.base': 'Document must be a valid base64 string with a PDF or Word document MIME type.'
            })
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
        department: Joi.string().valid('COMP', 'ENTC', 'IT', 'Mech').required(),
        classTeacher: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B', 'FE-MECH-A', 'FE-MECH-B',
            'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-IT-A', 'SE-IT-B', 'SE-MECH-A', 'SE-MECH-B',
            'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH-A', 'TE-MECH-B',
            'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH-A', 'BE-MECH-B'
        ).required(),
        counselor: Joi.string().valid(
            'A-1', 'A-2', 'A-3', 'A-4', 'A-5', 'A-6',
            'B-1', 'B-2', 'B-3', 'B-4', 'B-5', 'B-6',
            'C-1', 'C-2', 'C-3', 'C-4', 'C-5', 'C-6',
            'D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6',
            'E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6',
            'F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6',
            'G-1', 'G-2', 'G-3', 'G-4', 'G-5', 'G-6',
            'H-1', 'H-2', 'H-3', 'H-4', 'H-5', 'H-6',
            'I-1', 'I-2', 'I-3', 'I-4', 'I-5', 'I-6',
            'J-1', 'J-2', 'J-3', 'J-4', 'J-5', 'J-6',
            'K-1', 'K-2', 'K-3', 'K-4', 'K-5', 'K-6',
            'L-1', 'L-2', 'L-3', 'L-4', 'L-5', 'L-6',
            'M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'M-6',
            'N-1', 'N-2', 'N-3', 'N-4', 'N-5', 'N-6',
            'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6',
            'P-1', 'P-2', 'P-3', 'P-4', 'P-5', 'P-6',
            'Q-1', 'Q-2', 'Q-3', 'Q-4', 'Q-5', 'Q-6',
            'R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'R-6',
            'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6',
            'T-1', 'T-2', 'T-3', 'T-4', 'T-5', 'T-6',
            'U-1', 'U-2', 'U-3', 'U-4', 'U-5', 'U-6',
            'V-1', 'V-2', 'V-3', 'V-4', 'V-5', 'V-6',
            'W-1', 'W-2', 'W-3', 'W-4', 'W-5', 'W-6',
            'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6',
            'Y-1', 'Y-2', 'Y-3', 'Y-4', 'Y-5', 'Y-6',
            'Z-1', 'Z-2', 'Z-3', 'Z-4', 'Z-5', 'Z-6'
        ).required(),
        staffId: Joi.string().min(5).max(6).pattern(/^\d+$/).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d+$/).required(),
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
