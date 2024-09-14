const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');
const {User} = require('../Models/User')

const fetchUserByRegistration = async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    console.log('Received request for registration number:', registrationNumber);

    if (!registrationNumber) {
      console.error('No registration number provided');
      return res.status(400).json({ error: 'Registration number is required' });
    }

    const user = await User.findOne({ registrationNumber });
    console.log('User search query completed');

    if (!user) {
      console.warn('User not found for registration number:', registrationNumber);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);
    res.json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const fetchOutpassByRegistration = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    console.log('Registration number received from front-end:', registrationNumber);

    if (!registrationNumber) {
      return res.status(400).json({
        message: 'Registration number is required',
        success: false
      });
    }

    const regexPattern = new RegExp(registrationNumber, 'i');
    
    const outpasses = await Outpass.find({
      registrationNumber: { $regex: regexPattern }
    }).exec();

    if (outpasses.length === 0) {
      return res.status(404).json({
        message: 'No outpasses found for the specified registration number',
        success: false
      });
    }

    res.status(200).json({
      message: 'Outpasses fetched successfully',
      success: true,
      data: outpasses
    });
  } catch (err) {
    console.error('Error fetching outpasses by registration number:', {
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

const fetchLeaveByRegistration = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    console.log('Registration number received from front-end:', registrationNumber);

    if (!registrationNumber) {
      return res.status(400).json({
        message: 'Registration number is required',
        success: false
      });
    }

    const regexPattern = new RegExp(registrationNumber, 'i');
    
    const leaves = await Leave.find({
      registrationNumber: { $regex: regexPattern }
    }).exec();

    if (leaves.length === 0) {
      return res.status(404).json({
        message: 'No leaves found for the specified registration number',
        success: false
      });
    }

    res.status(200).json({
      message: 'Leaves fetched successfully',
      success: true,
      data: leaves
    });
  } catch (err) {
    console.error('Error fetching leaves by registration number:', {
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
const fetchPLByRegistration = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    if (!registrationNumber) {
      return res.status(400).json({
        message: 'Registration number is required',
        success: false
      });
    }

    const regexPattern = new RegExp(registrationNumber, 'i');

    const personalLeaves = await PL.find({
      registrationNumber: { $regex: regexPattern }
    }).exec();

    if (personalLeaves.length === 0) {
      return res.status(404).json({
        message: 'No personal leaves found for the specified registration number',
        success: false
      });
    }

    res.status(200).json({
      message: 'Personal leaves fetched successfully',
      success: true,
      data: personalLeaves
    });
  } catch (err) {
    console.error('Error fetching personal leaves by registration number:', {
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

module.exports = { fetchOutpassByClass,
   fetchPLByClass,
    fetchLeaveByClass,
    fetchOutpassByRegistration,
    fetchLeaveByRegistration,
    fetchPLByRegistration,
    fetchUserByRegistration
  };
