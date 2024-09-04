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
    enum: ['HOD', 'Class Teacher', 'Warden', 'Joint Director', 'Director'],
    required: true
  },
  classAssigned: {
    type: String,
    enum: [
      'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
      'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
      'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
      'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
      'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
    ], // Class options
    required: function() {
      // Only required if the position is 'Class Teacher', 'HOD', or 'Warden'
      return this.position === 'Class Teacher' || this.position === 'HOD' || this.position === 'Warden';
    }
  }
});

// Create and export the Staff model
const Staff = db6.model('Staff', StaffSchema);
module.exports = { Staff };
