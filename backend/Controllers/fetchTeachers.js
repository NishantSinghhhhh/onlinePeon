const { Outpass } = require('../Models/Outpass');

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
    const capitalizedClassName = className
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('Capitalized class name:', capitalizedClassName);

    const regexPattern = new RegExp(capitalizedClassName, 'i');
    
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


module.exports = { fetchOutpassByClass };
