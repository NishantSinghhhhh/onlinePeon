const Leave = require('../Models/Leave'); // Assuming Leave is a Mongoose model
const Outpass = require('../Models/Outpass'); // Assuming Outpass is a Mongoose model


const fetchLeavesOutpasses = async (req, res) => {
  const { date } = req.query; 

  console.log(`[fetchLeavesOutpasses] Request received with date: ${date}`);

  try {
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }


    const outpasses = await Outpass.find({ outpassDate: date });
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


module.exports = {
  fetchLeavesOutpasses,

};
