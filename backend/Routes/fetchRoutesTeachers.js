const express = require('express');
const router = express.Router();
const { 
  fetchOutpassByClass, 
  fetchLeaveByClass, 
  fetchPLByClass, 
  fetchOutpassByRegistration,
  fetchLeaveByRegistration, 
  fetchPLByRegistration,
  fetchUserByRegistration
} = require('../Controllers/fetchTeachers');


router.get('/fetchOutpasses/:className', fetchOutpassByClass);
router.get('/fetchLeaves/:className', fetchLeaveByClass);
router.get('/fetchPLs/:className', fetchPLByClass);

router.get('/fetchOutpasses/registration/:registrationNumber', fetchOutpassByRegistration);
router.get('/fetchLeaves/registration/:registrationNumber', fetchLeaveByRegistration);
router.get('/fetchPLs/registration/:registrationNumber', fetchPLByRegistration);

router.get('/fetchUser/:registrationNumber', fetchUserByRegistration);

module.exports = router;
