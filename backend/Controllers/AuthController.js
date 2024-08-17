const UserModel = require("../Models/User");
const UserModel2 = require("../Models/Outpass")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Outpass = require('../Models/Outpass'); // Import your Outpass model


const submitOutpass = async (req, res) => {
    try {
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
        if (!firstName || !lastName || !registrationNumber || !reason || !date || !startHour || !endHour || !contactNumber) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        // Create a new Outpass document
        const newOutpass = new Outpass({
            firstName,
            lastName,
            registrationNumber,
            reason,
            date,
            startHour,
            endHour,
            contactNumber
        });

        // Save the document to the database
        await newOutpass.save();

        res.status(201).json({
            message: 'Outpass data saved successfully',
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
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        // Create a new user instance
        const userModel = new UserModel({
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
        userModel.password = await bcrypt.hash(password, 10);

        // Save the new user to the database
        await userModel.save();

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

// module.exports = signup;

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
        const user = await UserModel.findOne({ email });
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
    submitOutpass
}