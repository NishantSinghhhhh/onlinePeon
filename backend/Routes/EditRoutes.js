const express = require('express');
const router = express.Router();

const { EditOutpass,EditPL,EditLeave } = require("../Controllers/EditController");

// Define the POST route for editing an outpass
router.put("/editOutpass", EditOutpass);
router.put("/editLeave", EditLeave);
router.put("/editPL", EditPL);

module.exports = router;
