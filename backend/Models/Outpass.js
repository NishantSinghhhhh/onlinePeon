const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {db2 } = require('./db');

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
        match: /^\d{5,6}$/ // Ensure registration number is between 5 and 6 digits
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
    },
    endHour: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Ensure phone number is exactly 10 digits
    },
    // Additional fields if necessary
});


const Outpass = db2.model('Outpass', OutpassSchema);

module.exports = {Outpass};
// module.exports = mongoose.model('Outpass', OutpassSchema);
