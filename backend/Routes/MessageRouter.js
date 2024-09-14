const express = require('express');
const router = express.Router();
const {
  sendSMS,
  sendWhatsAppMessage,
  sendLeaveMessageToParents,
  sendLeaveMessageToTeachers,
  sendPLMessageToParents, // Add this
  sendPLMessageToTeachers // Add this
} = require('../Controllers/MessageController');

// Route to send a standard SMS message
router.post('/send', sendSMS);

// Route to send a WhatsApp message to the teacher
router.post('/sendTeacher', sendWhatsAppMessage);

// Route to send a leave message to parents
router.post('/sendLeaveMessageToParents', sendLeaveMessageToParents);

// Route to send a leave message to teachers
router.post('/sendLeaveMessageToTeachers', sendLeaveMessageToTeachers);

// Route to send a personal leave message to parents
router.post('/sendPLMessageToParents', sendPLMessageToParents); 

// Route to send a personal leave message to teachers
router.post('/sendPLMessageToTeachers', sendPLMessageToTeachers);

module.exports = router;
