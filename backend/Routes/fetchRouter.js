const express = require('express');
const { fetchPendingByRegNo, fetchApprovedByRegNo, fetchDeclinedByRegNo, fetchExpiredByRegNo , fetchTeachers, fetchTeacherById, fetctStudentByRegistrationNum} = require('../Controllers/FetchController');

const router = express.Router();

// Existing routes
router.get('/fetchpending/:regNo', fetchPendingByRegNo);
router.get('/fetchapproved/:regNo', fetchApprovedByRegNo);
router.get('/fetchdeclined/:regNo', fetchDeclinedByRegNo);
router.get('/fetchexpired/:regNo', fetchExpiredByRegNo);
router.get('/fetchTeachers', fetchTeachers)
router.get('/fetchTeacher/:staffId', fetchTeacherById);
router.get('/fetchStudent/:registrationNumber', fetctStudentByRegistrationNum);

module.exports = router;
