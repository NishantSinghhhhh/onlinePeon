const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        rollNumber: Joi.string().length(4).pattern(/^\d+$/).required(), // Exactly 4 digits
        registrationNumber: Joi.string().min(5).max(6).pattern(/^\d+$/).required(), // 5-6 digits
        fatherName: Joi.string().required(),
        fatherPhoneNumber: Joi.string().length(10).pattern(/^\d+$/).required(), // Exactly 10 digits
        class: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
        ).required(),
        classTeacherName: Joi.string().required() // No predefined values, just required
    });

    // Validate the request body
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    // Debugging output
    console.log('Request Body:', req.body);
    console.log('Validation Result:', value);
    
    if (error) {
        console.log('Validation Error:', error.details);

        // Format error messages
        const formattedErrors = error.details.map(err => ({
            field: err.context.key,
            message: err.message
        }));

        return res.status(400).json({
            message: "Bad Request",
            errors: formattedErrors
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
        rollNumber: Joi.string().length(4).pattern(/^\d{4}$/).required(), // New rollNumber validation
        reason: Joi.string().min(10).required(),
        date: Joi.date().iso().required(),
        startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
        endHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
        className: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
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
        registrationNumber: Joi.string().min(5).max(6).pattern(/^\d+$/).required(), // 5 or 6 digits
        rollNumber: Joi.string().length(4).pattern(/^\d{4}$/).required(), // Exactly 4 digits
        reasonForLeave: Joi.string().min(10).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(), // Ensure endDate is after startDate
        placeOfResidence: Joi.string().min(2).max(100).required(),
        attendancePercentage: Joi.number().min(0).max(100).required(),
        contactNumber: Joi.string().length(10).pattern(/^\d{10}$/).required(),
        className: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
        ).required(),
        extraDataArray: Joi.array().items(Joi.number()).length(4).required() // Ensure array has exactly 4 numbers
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
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
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
        staffId: Joi.string().length(5).pattern(/^\d+$/).allow(null)
            .when('position', {
                is: Joi.string().valid('Class Teacher', 'HOD', 'Warden'),
                then: Joi.string().length(5).pattern(/^\d+$/).required(),
                otherwise: Joi.string().allow('')
            })
            .concat(
                Joi.string().length(6).pattern(/^\d+$/).allow(null)
                .when('position', {
                    is: Joi.string().valid('Class Teacher', 'HOD', 'Warden'),
                    then: Joi.string().length(6).pattern(/^\d+$/).required(),
                    otherwise: Joi.string().allow('')
                })
            ),
        contactNumber: Joi.string().length(10).pattern(/^\d+$/).required(),
        position: Joi.string().valid(
            'HOD',
            'Class Teacher',
            'Warden',
            'Joint Director',
            'Director',
            'Principal',
            'Security Guard'
        ).required(),
        classAssigned: Joi.string().valid(
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B', 'FE-MECH', 'FE-ARE',
            'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-IT-A', 'SE-IT-B', 'SE-MECH',
            'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH',
            'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH',
            'FE-WARDEN', 'SE-WARDEN', 'TE-WARDEN', 'BE-WARDEN', ''
        ).when('position', {
            is: Joi.string().valid('Class Teacher', 'Warden'),
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        branchAssigned: Joi.string().valid('ASGE', 'COMP', 'MECH', 'IT', 'ENTC').when('position', {
            is: Joi.string().valid('HOD'),
            then: Joi.required(),
            otherwise: Joi.forbidden()
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
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
