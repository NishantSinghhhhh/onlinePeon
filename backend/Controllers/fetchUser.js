const { User } = require('../Models/User'); // Assuming the User model is in the Models folder

const findUserByClass = async (req, res) => {
  try {
    const { className } = req.params;

    // Debugging: log the incoming className parameter
    console.log(`Received request to find users by class: ${className}`);

    // Check if className exists and is not empty
    if (!className || className.trim() === '') {
      console.warn('No className provided or className is empty.');
      return res.status(400).json({
        message: 'Invalid className parameter',
        success: false,
      });
    }

    // Debugging: log the database query attempt
    console.log(`Attempting to fetch users for class: ${className}`);

    // Find users by 'class' field (as per your schema)
    const users = await User.find({ class: className });

    // Debugging: log the number of users found
    console.log(`Number of users found for class ${className}: ${users.length}`);

    if (users.length === 0) {
      console.warn(`No users found for class: ${className}`);
      return res.status(404).json({
        message: 'No users found for this class',
        success: false,
      });
    }

    // Debugging: log successful user retrieval
    console.log(`Successfully found users for class ${className}. Sending response.`);

    res.status(200).json({
      message: 'Users found',
      success: true,
      data: users,
    });
  } catch (err) {
    // Debugging: log the full error for better understanding
    console.error('Error fetching users by class:', err);

    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message,
    });
  }
};

module.exports = { findUserByClass };
