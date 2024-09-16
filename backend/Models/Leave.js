const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db3 } = require('./db');

const LeaveSchema = new Schema({
    firstName: {
        type: String,
        required: true,
       
    },
    lastName: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        match: /^\d{5,6}$/ 
    },
    rollNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ 
    },
    reasonForLeave: {
        type: String,
        required: true,
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
        match: /^\d{10}$/
    },
    className: {
        type: String,
        required: true,
        enum: [
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
        ] 
    },
    extraDataArray: {
        type: [Number],
        required: true,
        validate: {
            validator: function(array) {
                return array.length === 4; 
            },
            message: 'extraDataArray must contain exactly 4 numbers'
        }
    },
    extraValidation: {
        type: [Number],
        default: [0, 0], // Default value of [0, 0]
        validate: {
            validator: function(array) {
                return array.length === 2; // Ensure the array has exactly 2 elements
            },
            message: 'extraValidation must contain exactly 2 numbers'
        }
    },
    outTime: {
        type: String,
        default: '', // Default to empty string if not provided
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates time in HH:MM format
    },
    inTime: {
        type: String,
        default: '', // Default to empty string if not provided
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates time in HH:MM format
    }
}, {
    timestamps: true 
});

const Leave = db3.model('Leave', LeaveSchema);

module.exports = { Leave };
