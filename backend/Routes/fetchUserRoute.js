const express = require('express');
const router = express.Router();
const { findUserByClass } = require('../Controllers/fetchUser');

// Route to fetch users based on className
router.get('/users/:className', findUserByClass);

module.exports = router;
