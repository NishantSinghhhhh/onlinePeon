const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');
const {Staff} = require('../Models/staff')
const fetchPendingByRegNo = async (req, res) => {
  try {
      const { regNo } = req.params;

      // Criteria for matching at least one zero in the array for Outpass and Leave
      const atLeastOneZero = {
          registrationNumber: regNo,
          extraDataArray: { $in: [0] } // Check if there's at least one zero in the array
      };

      // Criteria for matching zero in either the first or second position for PL
      const plWithZeroInFirstOrSecond = [
          {
              $match: {
                  registrationNumber: regNo
              }
          },
          {
              $addFields: {
                  firstElement: { $arrayElemAt: ["$extraDataArray", 0] },
                  secondElement: { $arrayElemAt: ["$extraDataArray", 1] }
              }
          },
          {
              $match: {
                  $or: [
                      { firstElement: 0 }, // Zero in the first position
                      { secondElement: 0 } // Zero in the second position
                  ]
              }
          }
      ];

      // Execute the queries
      const [outpasses, pls, leaves] = await Promise.all([
          Outpass.find(atLeastOneZero).exec(),
          PL.aggregate(plWithZeroInFirstOrSecond).exec(),
          Leave.find(atLeastOneZero).exec()
      ]);

      res.status(200).json({
          outpasses,
          pls,
          leaves
      });
  } catch (err) {
      console.error('Error in fetchPendingByRegNo:', err.message);
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

      // Criteria for approved Outpass and Leave (all elements in extraDataArray must be 1)
      const allOnes = {
          registrationNumber: regNo,
          extraDataArray: { $not: { $elemMatch: { $ne: 1 } } } // Ensure all elements are 1
      };

      // Criteria for approved PL (1 in either the first or second position)
      const plWithOneInFirstOrSecond = [
          {
              $match: {
                  registrationNumber: regNo
              }
          },
          {
              $addFields: {
                  firstElement: { $arrayElemAt: ["$extraDataArray", 0] },
                  secondElement: { $arrayElemAt: ["$extraDataArray", 1] }
              }
          },
          {
              $match: {
                  $or: [
                      { firstElement: 1 }, // 1 in the first position
                      { secondElement: 1 } // 1 in the second position
                  ]
              }
          }
      ];

      // Execute the queries
      const [outpasses, pls, leaves] = await Promise.all([
          Outpass.find(allOnes).exec(),
          PL.aggregate(plWithOneInFirstOrSecond).exec(),
          Leave.find(allOnes).exec()
      ]);

      res.status(200).json({
          outpasses,
          pls,
          leaves
      });
  } catch (err) {
      console.error('Error in fetchApprovedByRegNo:', err.message);
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

      // Criteria for declined Outpass, PL, and Leave (contains -1 in any position of extraDataArray)
      const hasNegativeOne = {
          registrationNumber: regNo,
          extraDataArray: { $elemMatch: { $eq: -1 } } // Check if there's -1 in the array
      };

      // Execute the queries
      const [outpasses, pls, leaves] = await Promise.all([
          Outpass.find(hasNegativeOne).exec(),
          PL.find(hasNegativeOne).exec(),
          Leave.find(hasNegativeOne).exec()
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
const fetchTeacherById = async (req, res) => {
  const { staffId } = req.params;

  console.log(`Received request to fetch teacher with staffId: ${staffId}`);

  try {
    // Query the database to find the teacher by staff ID
    const teacher = await Staff.findOne({ staffId: String(staffId) });

    if (!teacher) {
      console.log(`No teacher found with staffId: ${staffId}`);
      return res.status(404).json({ message: 'Teacher not found' });
    }

    console.log(`Teacher found: ${JSON.stringify(teacher)}`);
    res.status(200).json({ teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  fetchPendingByRegNo,
  fetchApprovedByRegNo,
  fetchDeclinedByRegNo,
  fetchExpiredByRegNo,
  fetchTeachers,
  fetchTeacherById
};