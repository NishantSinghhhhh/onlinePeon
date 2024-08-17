const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        enum: ['COMP', 'ENTC', 'IT', 'Mech'],
        required: true
    },
    year: {
        type: String,
        enum: ['FE', 'SE', 'TE', 'BE'],
        required: true
    },
    class: {
        type: String,
        enum: ['A', 'B'],
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        match: /^\d{4}$/ // Ensure roll number is exactly 4 digits
    },
    registrationNumber: {
        type: String,
        required: true,
        match: /^\d{5,6}$/ // Ensure registration number is between 5 and 6 digits
    },
    fatherName: {
        type: String,
        required: true,
    },
    fatherPhoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Ensure phone number is exactly 10 digits
    },
    classTeacherName: {
        type: String,
        required: true,
        enum: ['Mr. John Doe', 'Ms. Jane Smith', 'Mr. Albert Brown', 'Ms. Emily Davis'] // List of possible class teachers
    }
});

module.exports = mongoose.model('User', UserSchema);
