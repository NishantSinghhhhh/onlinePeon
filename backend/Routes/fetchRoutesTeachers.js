const express = require('express');
const router = express.Router();
const { fetchOutpassByClass, fetchLeaveByClass, fetchPLByClass } = require('../Controllers/fetchTeachers');

router.get('/fetchOutpasses/:className', fetchOutpassByClass);

router.get('/fetchLeaves/:className', fetchLeaveByClass);

router.get('/fetchPLs/:className', fetchPLByClass);

module.exports = router;
