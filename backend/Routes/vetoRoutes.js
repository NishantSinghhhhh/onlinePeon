const express = require('express');
const router = express.Router();
const { vetoOutpass } = require('../Controllers/vetoController');

// Route to handle vetoing an outpass
router.put('/OutpassVeto', vetoOutpass);

module.exports = router;
