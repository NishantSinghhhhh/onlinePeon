const { User } = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Outpass} = require('../Models/Outpass'); // Import your Outpass model
const {Leave} = require('../Models/Leave'); // Import your Outpass model
const {PL} = require('../Models/PL'); // Import your Outpass model


const submitPL = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));

        const {
            firstName,
            lastName,
            className,
            rollNumber,
            classesMissed,
            reason,
            startDate,
            endDate,
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!className) missingFields.push('className');
        if (!rollNumber) missingFields.push('rollNumber');
        if (!classesMissed) missingFields.push('classesMissed');
        if (!reason) missingFields.push('reason');
        if (!startDate) missingFields.push('startDate');
        if (!endDate) missingFields.push('endDate');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // Create a new PL instance
        const pl = new PL({
            firstName,
            lastName,
            className,
            rollNumber,
            classesMissed,
            reason,
            startDate,
            endDate,
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

        const {
            firstName,
            lastName,
            registrationNumber,
            reasonForLeave,
            startDate,
            endDate,
            placeOfResidence,
            attendancePercentage,
            contactNumber
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!registrationNumber) missingFields.push('registrationNumber');
        if (!reasonForLeave) missingFields.push('reasonForLeave');
        if (!startDate) missingFields.push('startDate');
        if (!endDate) missingFields.push('endDate');
        if (!placeOfResidence) missingFields.push('placeOfResidence');
        if (!attendancePercentage) missingFields.push('attendancePercentage');
        if (!contactNumber) missingFields.push('contactNumber');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // Create a new leave instance
        const leave = new Leave({
            firstName,
            lastName,
            registrationNumber,
            reasonForLeave,
            startDate,
            endDate,
            placeOfResidence,
            attendancePercentage,
            contactNumber
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
            contactNumber
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
            contactNumber
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
            branch, 
            year, 
            class: userClass, 
            rollNumber, 
            registrationNumber,
            fatherName, 
            fatherPhoneNumber,
            classTeacherName 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !branch || !year || !userClass || !rollNumber || !registrationNumber || !fatherName || !fatherPhoneNumber || !classTeacherName) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

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
            password,
            branch,
            year,
            class: userClass,
            rollNumber,
            registrationNumber,
            fatherName,
            fatherPhoneNumber,
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
        console.error(err); // Log the error to the server console for debugging
        res.status(500).json({
            message: 'Internal server error',
            success: false
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

module.exports = {
    signup,
    login,
    submitOutpass,
    submitLeave,
    submitPL,
};
