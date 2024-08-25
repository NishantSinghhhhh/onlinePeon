const express = require('express');
const { signupValidation, loginValidation, outpassValidation, leaveValidation, plValidation, staffSignupValidation} = require('../Middlewares/AuthValidation');
const { signup, login, submitOutpass, submitLeave,submitPL, signupStaff } = require('../Controllers/AuthController');
// const { submitOutpassRequest } = require('../Controllers/AuthController');
// const {outpassValidation} = require('../Middlewares/outpassValidation');
const router = express.Router(); // Corrected

router.post('/login', loginValidation, login);
router.post('/signUp', signupValidation, signup);
router.post('/signupStaff', staffSignupValidation, signupStaff);
router.post('/outpass', outpassValidation, submitOutpass);
router.post('/leave', leaveValidation, submitLeave);
router.post('/PL', plValidation,submitPL );


module.exports = router; 
