
const express = require('express');
const router = express.Router();
const { updateOutpassStatus } = require('../Controllers/updateController');

// Route to update the status in extraDataArray of an outpass
router.put('/updateOutpass/:id', updateOutpassStatus);

module.exports = router;