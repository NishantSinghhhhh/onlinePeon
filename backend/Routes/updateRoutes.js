const express = require('express');
const router = express.Router();
const { updateOutpassStatus, updatePLStatus, updateLeaveStatus } = require('../Controllers/updateController');

// Route to update the status in extraDataArray of an outpass
router.put('/updateOutpass/:id', updateOutpassStatus);

// Route to update the status of a PL (Presumed Leave)
router.put('/updatePL/:id', updatePLStatus);

// Route to update the status of a Leave
router.put('/updateLeave/:id', updateLeaveStatus);

module.exports = router;
