const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db3 } = require('./db'); // Import your existing database connection

const LeaveSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    registrationNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ // Exactly 4 digits
    },
    reasonForLeave: {
        type: String,
        required: true,
        minlength: 10
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    placeOfResidence: {
        type: String,
        required: true
    },
    attendancePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Exactly 10 digits
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Leave = db3.model('Leave', LeaveSchema);

module.exports = { Leave };
