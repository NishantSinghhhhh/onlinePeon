const express = require('express');
const { fetchPendingByRegNo, fetchApprovedByRegNo, fetchDeclinedByRegNo, fetchExpiredByRegNo } = require('../Controllers/FetchController');

const router = express.Router();

// Existing routes
router.get('/fetchpending/:regNo', fetchPendingByRegNo);
router.get('/fetchapproved/:regNo', fetchApprovedByRegNo);
router.get('/fetchdeclined/:regNo', fetchDeclinedByRegNo);

router.get('/fetchexpired/:regNo', fetchExpiredByRegNo);

module.exports = router;
