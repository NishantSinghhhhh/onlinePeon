const express = require('express');
const router = express.Router();
const {
  sendSMS,
  sendWhatsAppMessage,
  sendSMSInOUt,
  sendLeaveMessageToParents,
  sendLeaveMessageToTeachers,
  sendPLMessageToParents, // Add this
  sendPLMessageToTeachers // Add this
} = require('../Controllers/MessageController');


router.post('/send', sendSMS);
router.post('/sendInOut', sendSMSInOUt);
router.post('/sendTeacher', sendWhatsAppMessage);
router.post('/sendLeaveMessageToParents', sendLeaveMessageToParents);
router.post('/sendLeaveMessageToTeachers', sendLeaveMessageToTeachers);
router.post('/sendPLMessageToParents', sendPLMessageToParents); 
router.post('/sendPLMessageToTeachers', sendPLMessageToTeachers);

module.exports = router;
