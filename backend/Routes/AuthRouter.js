const express = require('express');
const { signupValidation, loginValidation, outpassValidation } = require('../Middlewares/AuthValidation');
const { signup, login, submitOutpass  } = require('../Controllers/AuthController');
// const { submitOutpassRequest } = require('../Controllers/AuthController');
// const {outpassValidation} = require('../Middlewares/outpassValidation');
const router = express.Router(); // Corrected

router.post('/login', loginValidation, login);
router.post('/signUp', signupValidation, signup);
router.post('/outpass', outpassValidation, submitOutpass);

module.exports = router; 
