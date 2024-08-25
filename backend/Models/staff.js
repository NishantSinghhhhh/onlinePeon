const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {db6} = require('./db');


// Function to generate all possible counselor options
const generateCounselorOptions = () => {
  const options = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = [1, 2, 3, 4, 5, 6];

  numbers.forEach(number => {
    letters.forEach(letter => {
      options.push(`${letter}-${number}`);
    });
  });

  return options;
};
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
  department: {
    type: String,
    enum: ['COMP', 'ENTC', 'IT', 'Mech'], // Example departments
    required: true
  },
  classTeacher: {
    type: String,
    enum: [
      'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B',
      'FE-IT-A', 'FE-IT-B', 'FE-MECH-A', 'FE-MECH-B',
      'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
      'SE-IT-A', 'SE-IT-B', 'SE-MECH-A', 'SE-MECH-B',
      'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A', 'TE-ENTC-B',
      'TE-IT-A', 'TE-IT-B', 'TE-MECH-A', 'TE-MECH-B',
      'BE-COMP-A', 'BE-COMP-B', 'BE-ENTC-A', 'BE-ENTC-B',
      'BE-IT-A', 'BE-IT-B', 'BE-MECH-A', 'BE-MECH-B'
    ], // Example class teacher options
    required: true
  },
  counselor: {
    type: String,
    enum: generateCounselorOptions(), // Generate all possible counselor options
    required: true
  },
  staffId: {
    type: String,
    required: true,
    match: /^\d{4,6}$/ // Ensure staff ID is between 5 and 6 digits
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Ensure contact number is exactly 10 digits
  }
});

// Create and export the Staff model
const Staff = db6.model('Staff', StaffSchema);
module.exports = { Staff };
