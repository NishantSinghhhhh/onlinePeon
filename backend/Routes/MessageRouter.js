// file://%20routes/messageRouter.jsconst%20express%20=%20require('express');const%20router%20=%20express.Router();const%20%7B%20sendWhatsAppMessage%20%7D%20=%20require('../Controllers/messageController');//%20Route%20to%20send%20a%20WhatsApp%20messagerouter.post('/send',%20sendWhatsAppMessage);module.exports%20=%20router;// Routes/messageRouter.js
const express = require('express');
const router = express.Router();
const { sendSMS, sendWhatsAppMessage } = require('../Controllers/MessageController');

// Route to send a WhatsApp message
router.post('/send', sendSMS);
router.post('/sendTeacher', sendWhatsAppMessage);

module.exports = router;