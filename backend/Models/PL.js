const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db4 } = require('./db'); // Import your existing database connection

const PLSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50 
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50 
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
        ],
        minlength: 1,
        maxlength: 50
    },
    rollNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ // Assuming roll number is exactly 4 digits
    },
    registrationNumber: {
        type: String,
        required: true,
        minlength: 5, // Minimum length of 5 characters
        maxlength: 6 // Maximum length of 6 characters
    },
    classesMissed: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
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
    document: {
        type: String,
        required: true // The document is required
    },
    extraDataArray: {
        type: [Number],
        required: true, // Ensure the array is provided
        validate: [array => array.length === 4, 'ExtraDataArray must contain exactly 4 numbers'] // Validate array length
    }
}, {
    timestamps: true 
});

const PL = db4.model('PL', PLSchema);

module.exports = { PL };
