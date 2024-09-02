const express = require('express');
const { fetchOutpassesByRegNo } = require('../Controllers/FetchController'); // Import the controller function

const router = express.Router();

// Route to fetch outpasses by registration number
router.get('/fetchoutpasses/:regNo', fetchOutpassesByRegNo);

module.exports = router;
