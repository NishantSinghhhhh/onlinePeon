const express = require('express');
const {
  fetchLeavesOutpasses,  // new controller
  fetchLateComers        // new controller
} = require('../Controllers/AdminInOut');

const router = express.Router();


// New routes for fetching leaves/outpasses and late comers
router.get('/leaves-outpasses', fetchLeavesOutpasses); // Route to fetch leaves and outpasses
// router.get('/late-comers', fetchLateComers);           // Route to fetch late comers

module.exports = router;
