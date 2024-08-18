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
        match: /^\d{10}$/ 
    },
});

const Outpass = db2.model('Outpass', OutpassSchema);

module.exports = { Outpass };
