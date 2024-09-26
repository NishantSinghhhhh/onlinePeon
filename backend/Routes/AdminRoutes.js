const express = require('express');
const {
  fetchLeaves,       // New controller for fetching leaves
  fetchOutpasses,    // New controller for fetching outpasses
  fetchLateComers,
  LateLeaveComers   // New controller for fetching late comers
} = require('../Controllers/AdminInOut');

const router = express.Router();

// Routes for fetching leaves, outpasses, and late comers
router.get('/leaves', fetchLeaves);          // Route to fetch leaves
router.get('/outpasses', fetchOutpasses);    // Route to fetch outpasses
router.get('/late-comers', fetchLateComers); // Route to fetch late comers
router.get('/late-leave-comers', LateLeaveComers)

module.exports = router;
