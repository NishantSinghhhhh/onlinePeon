const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');
const {Staff} = require('../Models/staff')

const fetchOutpassByClass = async (req, res) => {
  try {
    const { className } = req.params;

    console.log('Class name received from front-end:', className);

    if (!className) {
      return res.status(400).json({
        message: 'Class name is required',
        success: false
      });
    }

    // Capitalize the className as required
    const capitalizedClassName = className
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('Capitalized class name:', capitalizedClassName);

    // Create regex pattern to match class name
    const regexPattern = new RegExp(capitalizedClassName, 'i');
    
    // Query to find outpasses by className
    const outpasses = await Outpass.find({
      className: { $regex: regexPattern }
    }).exec();

    if (outpasses.length === 0) {
      return res.status(404).json({
        message: 'No outpasses found for the specified class',
        success: false
      });
    }

    res.status(200).json({
      message: 'Outpasses fetched successfully',
      success: true,
      data: outpasses
    });
  } catch (err) {
    console.error('Error fetching outpasses:', {
      message: err.message,
      stack: err.stack
    });

    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};

const fetchPLByClass = async (req, res) => {
  try {
    const { className } = req.params;

    console.log('Class name received from front-end:', className);

    if (!className) {
      return res.status(400).json({
        message: 'Class name is required',
        success: false
      });
    }

    const capitalizedClassName = className
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('Capitalized class name:', capitalizedClassName);

    const regexPattern = new RegExp(capitalizedClassName, 'i');
    
    const plRecords = await PL.find({
      className: { $regex: regexPattern }
    }).exec();

    if (plRecords.length === 0) {
      return res.status(404).json({
        message: 'No PL records found for the specified class',
        success: false
      });
    }

    res.status(200).json({
      message: 'PL records fetched successfully',
      success: true,
      data: plRecords
    });
  } catch (err) {
    console.error('Error fetching PL records:', {
      message: err.message,
      stack: err.stack
    });

    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};

const fetchLeaveByClass = async (req, res) => {
  try {
    const { className } = req.params;

    console.log('Class name received from front-end:', className);

    if (!className) {
      return res.status(400).json({
        message: 'Class name is required',
        success: false
      });
    }

    // Capitalize the className as required
    const capitalizedClassName = className
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('Capitalized class name:', capitalizedClassName);

    // Create regex pattern to match class name
    const regexPattern = new RegExp(capitalizedClassName, 'i');
    
    // Query to find leave records by className
    const leaveRecords = await Leave.find({
      className: { $regex: regexPattern }
    }).exec();

    if (leaveRecords.length === 0) {
      return res.status(404).json({
        message: 'No leave records found for the specified class',
        success: false
      });
    }

    res.status(200).json({
      message: 'Leave records fetched successfully',
      success: true,
      data: leaveRecords
    });
  } catch (err) {
    console.error('Error fetching leave records:', {
      message: err.message,
      stack: err.stack
    });

    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};

module.exports = { fetchOutpassByClass, fetchPLByClass, fetchLeaveByClass};
