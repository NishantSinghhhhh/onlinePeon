const Leave = require('../Models/Leave'); // Mongoose model for Leave
const Outpass = require('../Models/Outpass'); // Mongoose model for Outpass

// Controller to fetch leaves and outpasses based on the provided date
const fetchLeavesOutpasses = async (req, res) => {
  const { date } = req.query; // Get the date from query parameters

  console.log(`[fetchLeavesOutpasses] Request received with date: ${date}`);

  try {
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const queryDate = new Date(date); // Convert the date to a JavaScript Date object

    // Find outpasses where the given date matches the 'date' field (for outpass)
    const outpasses = await Outpass.find({
      date: {
        $gte: queryDate.setHours(0, 0, 0, 0),  // Start of the day
        $lt: queryDate.setHours(23, 59, 59, 999), // End of the day
      }
    });

    // Find leaves where the given date falls within the 'startDate' and 'endDate' range
    const leaves = await Leave.find({
      startDate: { $lte: queryDate }, // Leave starts before or on the given date
      endDate: { $gte: queryDate },   // Leave ends after or on the given date
    });

    const data = {
      leaves,
      outpasses,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error(`[fetchLeavesOutpasses] Error: ${error.message}`);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

module.exports = {
  fetchLeavesOutpasses,
};
