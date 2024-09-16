const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db6 } = require('./db');

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
    match: /^\d{5,6}$/
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  position: {
    type: String,
    enum: ['HOD', 'Class Teacher', 'Warden', 'Joint Director', 'Director', 'Principal', 'Security Guard'],
    required: true
  },
  classAssigned: {
    type: String,
    enum: [
      'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
      'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
      'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
      'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
      'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH',
      'FE-WARDEN', 'SE-WARDEN', 'TE-WARDEN', 'BE-WARDEN' 
    ],
    required: function() {
      return this.position === 'Class Teacher' || this.position === 'Warden';
    }
  },
  branchAssigned: {
    type: String,
    enum: ['ASGE', 'COMP', 'MECH', 'IT', 'ENTC'],
    required: function() {
      return this.position === 'HOD';
    }
  }
});

// Create and export the Staff model
const Staff = db6.model('Staff', StaffSchema);

module.exports = { Staff };