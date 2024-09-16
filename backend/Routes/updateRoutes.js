const express = require('express');
const router = express.Router();
const { updateOutpassStatus, updatePLStatus, updateLeaveStatus, updateOutpassGuard } = require('../Controllers/updateController');

router.put('/updateOutpass/:id', updateOutpassStatus);
router.put('/updatePL/:id', updatePLStatus);
router.put('/updateLeave/:id', updateLeaveStatus);
router.put('/updateOutpass/guard/:id', updateOutpassGuard)
module.exports = router;
