const { User } = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Outpass} = require('../Models/Outpass'); // Import your Outpass model
const {Leave} = require('../Models/Leave'); // Import your Outpass model
const {PL} = require('../Models/PL'); // Import your Outpass model
const {Staff} = require('../Models/staff'); // Import your Outpass model
// const { PL } = require('./models/pl'); // Ensure the correct path to the PL model

const submitPL = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));

        // Extract fields from the request body
        const {
            firstName,
            lastName,
            className,
            rollNumber,
            registrationNumber,
            classesMissed,
            reason,
            startDate,
            endDate,
            document,
            extraDataArray // Extract extraDataArray from the request body
        } = req.body;

        // Create a new PL instance with all required fields
        const pl = new PL({
            firstName,
            lastName,
            className,
            rollNumber,
            registrationNumber, // Include registrationNumber in the instance creation
            classesMissed,
            reason,
            startDate,
            endDate,
            document,
            extraDataArray // Include extraDataArray in the instance creation
        });

        // Save the new PL request to the database
        await pl.save();

        res.status(201).json({
            message: 'Personal Leave request submitted successfully',
            success: true
        });
    } catch (err) {
        console.error('Error in submitPL:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const submitLeave = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));

        // Extract fields from the request body
        const {
            firstName,
            lastName,
            registrationNumber,
            reasonForLeave,
            startDate,
            endDate,
            placeOfResidence,
            attendancePercentage,
            contactNumber,
            className,
            extraDataArray // Include extraDataArray
        } = req.body;

        // Create a new leave instance with all required fields
        const leave = new Leave({
            firstName,
            lastName,
            registrationNumber,
            reasonForLeave,
            startDate,
            endDate,
            placeOfResidence,
            attendancePercentage,
            contactNumber,
            className,
            extraDataArray // Include extraDataArray
        });

        // Save the new leave request to the database
        await leave.save();

        res.status(201).json({
            message: 'Leave request submitted successfully',
            success: true
        });
    } catch (err) {
        console.error('Error in submitLeave:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


const submitOutpass = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));

        const {
            firstName,
            lastName,
            registrationNumber,
            reason,
            date,
            startHour,
            endHour,
            contactNumber,
            className, // Added className
            extraDataArray // Added extraDataArray
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!registrationNumber) missingFields.push('registrationNumber');
        if (!reason) missingFields.push('reason');
        if (!date) missingFields.push('date');
        if (!startHour) missingFields.push('startHour');
        if (!endHour) missingFields.push('endHour');
        if (!contactNumber) missingFields.push('contactNumber');
        if (!className) missingFields.push('className'); // Check for className
        if (!extraDataArray) missingFields.push('extraDataArray'); // Check for extraDataArray

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // Create a new outpass instance
        const outpass = new Outpass({
            firstName,
            lastName,
            registrationNumber,
            reason,
            date,
            startHour,
            endHour,
            contactNumber,
            className, // Added className
            extraDataArray // Added extraDataArray
        });

        // Save the new outpass to the database
        await outpass.save();

        res.status(201).json({
            message: 'Outpass submitted successfully',
            success: true
        });
    } catch (err) {
        console.error('Error in submitOutpass:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const signup = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            rollNumber, 
            registrationNumber,
            fatherName, 
            fatherPhoneNumber,
            class: userClass, 
            classTeacherName 
        } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        // Create a new user instance
        const user = new User({
            name,
            email,
            password, // Will be hashed before saving
            rollNumber,
            registrationNumber,
            fatherName,
            fatherPhoneNumber,
            class: userClass,
            classTeacherName
        });

        // Hash the password
        user.password = await bcrypt.hash(password, 10);

        // Save the new user to the database
        await user.save();

        res.status(201).json({
            message: 'SignUp Successful',
            success: true
        });
    } catch (err) {
        console.error('Error during signup:', err.stack); // Log the full error stack
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message // Send error message in response for debugging
        });
    }
};

const login = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Authentication failed, email or password is wrong",
                success: false
            });
        }

        // Compare provided password with stored hashed password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: "Authentication failed, email or password is wrong",
                success: false
            });
        }
// hii
        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });

    } catch (err) {
        console.error('Login error:', err); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const signupStaff = async (req, res) => {
    try {
        // Extract values from the request body
        const {
            name,
            email,
            password,
            staffId,
            contactNumber,
            position,
            classAssigned
        } = req.body;

        // Check if the user already exists
        const existingUser = await Staff.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        // Create a new user instance with required data
        const newStaffData = {
            name,
            email,
            password,
            staffId,
            contactNumber,
            position
        };

        // Only add classAssigned if the position requires it
        if (['Class Teacher', 'HOD', 'Warden'].includes(position)) {
            if (!classAssigned) {
                return res.status(400).json({
                    message: 'Class assigned is required for the position',
                    success: false
                });
            }
            newStaffData.classAssigned = classAssigned;
        }

        const newStaff = new Staff(newStaffData);

        // Hash the password
        newStaff.password = await bcrypt.hash(password, 10);

        // Save the new staff to the database
        await newStaff.save();

        res.status(201).json({
            message: 'SignUp Successful',
            success: true
        });
    } catch (err) {
        console.error('Error during staff signup:', err); // Log detailed error information
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const staffLogin = async (req, res) => {
    try {
        const { staffId, email, password } = req.body;

        if (!email || !password || !staffId) {
            return res.status(400).json({
                message: "Email, password, and staff ID are required",
                success: false
            });
        }

        // Find staff by email and staffId
        const staff = await Staff.findOne({ email, staffId });
        if (!staff) {
            return res.status(403).json({
                message: "Authentication failed, email, password, or staff ID is incorrect",
                success: false
            });
        }

        // Compare provided password with stored hashed password
        const isPassEqual = await bcrypt.compare(password, staff.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: "Authentication failed, email, password, or staff ID is incorrect",
                success: false
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: staff.email, _id: staff._id, staffId: staff.staffId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: staff.name
        });

    } catch (err) {
        console.error('Staff login error:', err); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


module.exports = {
    signup,
    login,
    submitOutpass,
    submitLeave,
    submitPL,
    signupStaff,
    staffLogin
};
