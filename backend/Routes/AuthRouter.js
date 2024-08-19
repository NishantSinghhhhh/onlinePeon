const express = require('express');
const { signupValidation, loginValidation, outpassValidation, signupValidation} = require('../Middlewares/AuthValidation');
const { signup, login, submitOutpass, submitLeave } = require('../Controllers/AuthController');
// const { submitOutpassRequest } = require('../Controllers/AuthController');
// const {outpassValidation} = require('../Middlewares/outpassValidation');
const router = express.Router(); // Corrected

router.post('/login', loginValidation, login);
router.post('/signUp', signupValidation, signup);
router.post('/outpass', outpassValidation, submitOutpass);
router.post('/leave', signupValidation, submitLeave);
// hiii
module.exports = router; 
