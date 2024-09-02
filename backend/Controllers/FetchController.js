const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');

// Fetch pending requests by registration number
const fetchPendingByRegNo = async (req, res) => {
    try {
        const { regNo } = req.params;

        const [outpasses, pls, leaves] = await Promise.all([
            Outpass.find({ registrationNumber: regNo, 'extraDataArray.0': 0 }).exec(),
            PL.find({ registrationNumber: regNo, 'extraDataArray.0': 0 }).exec(),
            Leave.find({ registrationNumber: regNo, 'extraDataArray.0': 0 }).exec()
        ]);

        res.status(200).json({
            outpasses,
            pls,
            leaves
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

// Fetch approved requests by registration number
const fetchApprovedByRegNo = async (req, res) => {
    try {
        const { regNo } = req.params;

        const [outpasses, pls, leaves] = await Promise.all([
            Outpass.find({ registrationNumber: regNo, 'extraDataArray.0': 1 }).exec(),
            PL.find({ registrationNumber: regNo, 'extraDataArray.0': 1 }).exec(),
            Leave.find({ registrationNumber: regNo, 'extraDataArray.0': 1 }).exec()
        ]);

        res.status(200).json({
            outpasses,
            pls,
            leaves
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

const fetchDeclinedByRegNo = async (req, res) => {
  try {
      const { regNo } = req.params;

      const [outpasses, pls, leaves] = await Promise.all([
          Outpass.find({ registrationNumber: regNo, 'extraDataArray.0': 2 }).exec(),
          PL.find({ registrationNumber: regNo, 'extraDataArray.0': 2 }).exec(),
          Leave.find({ registrationNumber: regNo, 'extraDataArray.0': 2 }).exec()
      ]);

      res.status(200).json({
          outpasses,
          pls,
          leaves
      });
  } catch (err) {
      console.error('Error fetching declined requests:', err.message);
      res.status(500).json({
          message: 'Internal server error',
          success: false,
          error: err.message
      });
  }
};
const fetchExpiredByRegNo = async (req, res) => {
  try {
    const { regNo } = req.params;
    
    console.log('Fetching expired items for registration number:', regNo);

    // Get the current date
    const today = new Date();
    console.log('Current date:', today);

    // Fetch expired outpasses
    const outpasses = await Outpass.find({
      registrationNumber: regNo,
      date: { $lt: today }
    }).exec();
    console.log('Fetched outpasses:', outpasses);

    // Fetch expired PLs
    const pls = await PL.find({
      registrationNumber: regNo,
      endDate: { $lt: today }
    }).exec();
    console.log('Fetched PLs:', pls);

    // Fetch expired leaves
    const leaves = await Leave.find({
      registrationNumber: regNo,
      endDate: { $lt: today }
    }).exec();
    console.log('Fetched leaves:', leaves);

    res.status(200).json({
      outpasses,
      pls,
      leaves
    });
  } catch (err) {
    console.error('Error fetching expired requests:', err.message);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  fetchPendingByRegNo,
  fetchApprovedByRegNo,
  fetchDeclinedByRegNo,
  fetchExpiredByRegNo
};