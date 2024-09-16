const express = require('express');
const router = express.Router();
const { checkOutpass, checkLeave } = require('../Controllers/checkController'); // Adjust the path to your controller

// Check outpass by objectId
router.post('/checkOutpass', checkOutpass);

// Check leave by objectId
router.post('/checkLeave', checkLeave);

module.exports = router;
