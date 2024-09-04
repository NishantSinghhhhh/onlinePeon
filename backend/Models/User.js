const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db1 } = require('./db');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    rollNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ // Exactly 4 digits
    },
    registrationNumber: {
        type: String,
        required: true,
        match: /^\d{5,6}$/ // 5-6 digits
    },
    fatherName: {
        type: String,
        required: true
    },
    fatherPhoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Exactly 10 digits
    },
    class: {
        type: String,
        required: true,
        enum: [
            'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
            'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
            'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
            'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
            'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
        ] // List of possible classes
    },
    classTeacherName: {
        type: String,
        required: true
        // No predefined values in the schema, just required
    }
});

// Create and export the User model
const User = db1.model('User', UserSchema);
module.exports = { User };
