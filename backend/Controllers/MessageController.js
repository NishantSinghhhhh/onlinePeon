// Controllers/messageController.js
require('dotenv').config();
const twilio = require('twilio');

// Use environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send an SMS message
const sendSMS = async (req, res) => {
    const { contactNumber } = req.body;  // Get contact number from request body



    try {
        // Send the SMS using Twilio
        const message = await client.messages.create({
            body: "Dear Parent, We would like to inform you that your son/daughter has applied for an outpass. If you were not aware of this request, please discuss it with your child. We will notify you once the request is processed. Thank you.",
            from: twilioPhoneNumber,
            to: contactNumber
        });

        console.log(`Message sent successfully. SID: ${message.sid}`);
        res.status(200).json({ message: 'Message sent successfully', messageId: message.sid });
    } catch (error) {
        console.error('Error sending SMS message:', error);
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

const sendWhatsAppMessage = async (req, res) => {
    const { contactNumber } = req.body;

    if (!contactNumber) {
        return res.status(400).json({ error: 'Contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: "Dear Parent, We would like to inform you that your son/daughter has applied for an outpass. If you were not aware of this request, please discuss it with your child. We will notify you once the request is processed. Thank you.",
            from: `whatsapp:${twilioPhoneNumber}`,
            to: `whatsapp:${contactNumber}`
        });

        console.log(`WhatsApp message sent successfully. SID: ${message.sid}`);
        res.status(200).json({ message: 'WhatsApp message sent successfully', messageId: message.sid });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
};

module.exports = { sendSMS, sendWhatsAppMessage };