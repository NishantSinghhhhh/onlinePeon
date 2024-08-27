const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db2 } = require('./db');

const OutpassSchema = new Schema({
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
        match: /^\d{4}$/ // Exactly 4 digits
    },
    reason: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startHour: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Valid time format (HH:mm)
    },
    endHour: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Valid time format (HH:mm)
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Exactly 10 digits
    },
    className: {
        type: String,
        required: true,
        enum: [
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B', 'FE-MECH', 'FE-ARE',
            'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-IT-A', 'SE-IT-B', 'SE-MECH',
            'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH',
            'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH',
        ] // Validate against predefined class names
    }
});

const Outpass = db2.model('Outpass', OutpassSchema);

module.exports = { Outpass };
