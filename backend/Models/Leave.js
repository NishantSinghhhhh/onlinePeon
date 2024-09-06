const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db3 } = require('./db'); // Import your existing database connection

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
        match: /^\d{5,6}$/ // 5 or 6 digits
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
        match: /^\d{10}$/ // Exactly 10 digits
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
                return array.length === 4; // Ensure the array has exactly 4 elements
            },
            message: 'extraDataArray must contain exactly 4 numbers'
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Leave = db3.model('Leave', LeaveSchema);

module.exports = { Leave };
