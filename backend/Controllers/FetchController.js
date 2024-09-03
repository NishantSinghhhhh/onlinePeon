const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');
const {Staff} = require('../Models/staff')

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

    const today = new Date();
    console.log('Current date:', today);

    const outpasses = await Outpass.find({
      registrationNumber: regNo,
      date: { $lt: today }
    }).exec();
    console.log('Fetched outpasses:', outpasses);

    const pls = await PL.find({
      registrationNumber: regNo,
      endDate: { $lt: today }
    }).exec();
    console.log('Fetched PLs:', pls);

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

const fetchTeachers = async (req, res) => {
  try {
    console.log('Fetch teachers request received'); // Debug log

    // Fetching teachers from the database
    const teachers = await Staff.find({ position: 'Class Teacher' });
    
    console.log('Teachers fetched:', teachers); // Debug log

    if (teachers.length === 0) {
      console.log('No class teachers found'); // Debug log
      return res.status(404).json({
        message: 'No Class Teachers found',
        success: false
      });
    }

    res.status(200).json({
      message: 'Class Teachers fetched successfully',
      success: true,
      data: teachers
    });
  } catch (err) {
    console.error('Error fetching teachers:', err); // Debug log
    res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

module.exports = {
  fetchPendingByRegNo,
  fetchApprovedByRegNo,
  fetchDeclinedByRegNo,
  fetchExpiredByRegNo,
  fetchTeachers
};