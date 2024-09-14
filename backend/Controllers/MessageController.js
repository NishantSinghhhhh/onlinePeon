const sendSMS = async (req, res) => {
    console.log('Received Body:', req.body);   
    
    const { contactNumber, studentName, reason, returnDate, startHour, endHour, className } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        reason,
        returnDate,
        startHour,
        endHour,
        className
    });

    const accountSid = 'ACbe6f170fc617ce0a2d33f112e4cb7a58';
    const authToken = '9d589fdd64071b961f57a5ffdf627f0d';
    const client = require('twilio')(accountSid, authToken);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName}, has applied for an outpass. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Outpass: ${reason}\n- Leave Time: From ${startHour} to ${endHour}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: '+13304605528',
            to: '+919649959730'
        });

        console.log('Message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

const sendWhatsAppMessage = async (req, res) => {
    console.log('Received Body:', req.body);   
    
    const { contactNumber, studentName, reason, returnDate, startHour, endHour, className } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        reason,
        returnDate,
        startHour,
        endHour,
        className
    });

    const accountSid = 'ACbe6f170fc617ce0a2d33f112e4cb7a58';  
    const authToken = '9d589fdd64071b961f57a5ffdf627f0d';     
    const client = require('twilio')(accountSid, authToken);


    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName}, has applied for an outpass. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Outpass: ${reason}\n- Leave Time: From ${startHour} to ${endHour}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+919649959730'
        });

        console.log('WhatsApp message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'WhatsApp message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
};

module.exports = { sendSMS, sendWhatsAppMessage };
