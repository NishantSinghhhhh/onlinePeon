const express = require('express');
const router = express.Router();

const { EditOutpass } = require("../Controllers/EditController");

// Define the POST route for editing an outpass
router.put("/editOutpass", EditOutpass);

module.exports = router;
