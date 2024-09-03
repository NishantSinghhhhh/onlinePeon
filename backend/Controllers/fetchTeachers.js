const { Outpass } = require('../Models/Outpass');

const fetchOutpassByClass = async (req, res) => {
  try {
    const { className } = req.params; // Use req.params for URL parameters
  
    console.log('Fetch outpasses request received'); // Debug log
    console.log('Requested class name:', className); // Debug log

    if (!className) {
      console.log('Class name is missing'); // Debug log
      return res.status(400).json({
        message: 'Class name is required',
        success: false
      });
    }

    // Capitalize the className
    const capitalizedClassName = className
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
      
    console.log('Capitalized class name:', capitalizedClassName); // Debug log

    // Log the regex pattern used for the search
    const regexPattern = new RegExp(capitalizedClassName, 'i');
    console.log('Regex pattern used for search:', regexPattern); // Debug log

    // Fetch outpasses with the case-insensitive regex pattern
    const outpasses = await Outpass.find({
      className: { $regex: regexPattern }
    }).exec();

    console.log('Fetched outpasses:', outpasses); // Debug log

    if (outpasses.length === 0) {
      console.log('No outpasses found for the specified class'); // Debug log
      return res.status(404).json({
        message: 'No outpasses found for the specified class',
        success: false
      });
    }

    // Successfully fetched outpasses
    console.log('Successfully fetched outpasses'); // Debug log
    res.status(200).json({
      message: 'Outpasses fetched successfully',
      success: true,
      data: outpasses
    });
  } catch (err) {
    // More detailed error logging
    console.error('Error fetching outpasses:', {
      message: err.message,
      stack: err.stack // Include stack trace in logs
    });

    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};

module.exports = { fetchOutpassByClass };
