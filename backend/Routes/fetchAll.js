const express = require('express');
const router = express.Router();
const { fetchAllOutpasses, fetchAllLeaves, fetchAllPLs } = require('../Controllers/fetchAll');

// Fetch all outpasses, leaves, and PLs
router.get('/fetchAllOutpasses', fetchAllOutpasses);
router.get('/fetchAllLeaves', fetchAllLeaves);
router.get('/fetchAllPLs', fetchAllPLs);

module.exports = router;
