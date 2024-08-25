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
            'FE-Comp-A', 'FE-Comp-B', 'FE-IT-A', 'FE-IT-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-Mech-A', 'FE-Mech-B',
            'SE-Comp-A', 'SE-Comp-B', 'SE-IT-A', 'SE-IT-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-Mech-A', 'SE-Mech-B',
            'TE-Comp-A', 'TE-Comp-B', 'TE-IT-A', 'TE-IT-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-Mech-A', 'TE-Mech-B',
            'BE-Comp-A', 'BE-Comp-B', 'BE-IT-A', 'BE-IT-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-Mech-A', 'BE-Mech-B',
            'ARE'
        ],
        minlength: 1,
        maxlength: 50
    },
    rollNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ // Assuming roll number is exactly 4 digits
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
        required: true, // The document is required
    }
}, {
    timestamps: true 
});

const PL = db4.model('PL', PLSchema);

module.exports = { PL };
