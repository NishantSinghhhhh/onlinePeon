const Leave = require('../Models/Leave'); // Assuming Leave is a Mongoose model
const Outpass = require('../Models/Outpass'); // Assuming Outpass is a Mongoose model
const LateComer = require('../Models/LateComer'); // Assuming LateComer is a Mongoose model

// Controller to fetch leaves and outpasses based on the provided date
const fetchLeavesOutpasses = async (req, res) => {
  const { date } = req.query; // Get the date from query parameters

  console.log(`[fetchLeavesOutpasses] Request received with date: ${date}`);

  try {
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Find outpasses where the given date matches the outpass date
    const outpasses = await Outpass.find({ outpassDate: date });

    // Find leaves where the given date matches the 'endDate' field
    const leaves = await Leave.find({ endDate: date });

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

// Controller to fetch late comers based on the provided date
const fetchLateComers = async (req, res) => {
  const { date } = req.query; // Get the date from query parameters

  console.log(`[fetchLateComers] Request received with date: ${date}`);

  try {
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Find latecomers where the given date matches the 'lateDate' field
    const lateComers = await LateComer.find({ lateDate: date });

    if (!lateComers.length) {
      console.log(`[fetchLateComers] No late comers found for date: ${date}`);
    } else {
      console.log(`[fetchLateComers] Found ${lateComers.length} late comers for date: ${date}`);
    }

    res.status(200).json(lateComers);
  } catch (error) {
    console.error(`[fetchLateComers] Error: ${error.message}`);
    res.status(500).json({ message: 'Error fetching late comers data', error: error.message });
  }
};

module.exports = {
  fetchLeavesOutpasses,
  fetchLateComers,
};
