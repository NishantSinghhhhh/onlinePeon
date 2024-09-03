const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db6 } = require('./db');

// Define the StaffSchema
const StaffSchema = new Schema({
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
  staffId: {
    type: String,
    required: true,
    match: /^\d{5,6}$/ // Ensure staff ID is between 5 and 6 digits
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Ensure contact number is exactly 10 digits
  },
  position: {
    type: String,
    enum: ['HOD', 'Class Teacher', 'Warden', 'Director', 'Joint Director'],
    required: true
  },
  classAssigned: {
    type: String,
    enum: [
      'FE-Comp-A', 'FE-Comp-B', 'FE-IT-A', 'FE-IT-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-Mech-A', 'FE-Mech-B',
      'SE-Comp-A', 'SE-Comp-B', 'SE-IT-A', 'SE-IT-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-Mech-A', 'SE-Mech-B',
      'TE-Comp-A', 'TE-Comp-B', 'TE-IT-A', 'TE-IT-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-Mech-A', 'TE-Mech-B',
      'BE-Comp-A', 'BE-Comp-B', 'BE-IT-A', 'BE-IT-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-Mech-A', 'BE-Mech-B'
    ], // Example class options
    required: function() {
      return this.position === 'Class Teacher' || this.position === 'HOD' || this.position === 'Warden'; // Only required for specific positions
    }
  }
});

// Create and export the Staff model
const Staff = db6.model('Staff', StaffSchema);
module.exports = { Staff };
