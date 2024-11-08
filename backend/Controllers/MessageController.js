require('dotenv').config();
const twilio = require('twilio');

const sendSOS = async (req, res) =>{
    console.log('Received Body:', req.body);

    const {
        contactNumber,
        studentName,
        reasonForLeave,
        startDate,
        endDate,
        placeOfResidence,
        attendancePercentage,
        className
    } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        reasonForLeave,
        startDate,
        endDate,
        placeOfResidence,
        attendancePercentage,
        className
    });

    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();


    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Teacher contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Teacher,\n\nThis is to inform you that your student, ${studentName}, has applied for an Emergency leave. Below are the details of the Emergency Leave:\n\n- Class: ${className}\n- Reason for Leave: ${reasonForLeave}\n Please take note of this Emergency Leave request, and do contact the child when you get time.\n\nThank you.`,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
           to: `whatsapp:+919649959730`
        });

        console.log('WhatsApp message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'WhatsApp message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
}

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

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName}, has applied for an outpass. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Outpass: ${reason}\n- Leave Time: From ${startHour} to ${endHour}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+919649959730'
        });

        console.log('Message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};


const sendSMSInOUt = async (req, res) => {
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

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName}, is Going Out of the campus. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Outpass: ${reason}\n- Leave Time: From ${startHour} to ${endHour}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: process.env.TWILIO_PHONE_NUMBER,
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

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName}, has applied for an outpass. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Outpass: ${reason}\n- Leave Time: From ${startHour} to ${endHour}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+919649959730`
        });

        console.log('WhatsApp message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'WhatsApp message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
};

const sendLeaveMessageToParents = async(req, res) => {
    console.log('Received Body:', req.body);

    const {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startHour,
        endHour,
        placeOfResidence,
        attendancePercentage,
        className
    } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startHour,
        endHour,
        placeOfResidence,
        attendancePercentage,
        className
    });

    const formattedStartDate = new Date(startHour).toLocaleDateString();
    const formattedEndDate = new Date(endHour).toLocaleDateString();

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName} (Registration Number: ${registrationNumber}, Roll Number: ${rollNumber}), has applied for a leave. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Leave: ${reason}\n- Leave Time: From ${formattedStartDate} to ${formattedEndDate}\n- Place of Residence during the Leave: ${placeOfResidence}\n- Attendance Percentage: ${attendancePercentage}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions or concerns, feel free to contact us.\n\nThank you.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+919649959730`
        });

        console.log('Message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

const sendLeaveMessageToTeachers = async (req, res) => {
    console.log('Received Body:', req.body);

    const {
        contactNumber,
        studentName,
        reasonForLeave,
        startDate,
        endDate,
        placeOfResidence,
        attendancePercentage,
        className
    } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        reasonForLeave,
        startDate,
        endDate,
        placeOfResidence,
        attendancePercentage,
        className
    });

    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();


    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    if (!contactNumber) {
        return res.status(400).json({ error: 'Teacher contact number is required' });
    }

    try {
        const message = await client.messages.create({
            body: `Dear Teacher,\n\nThis is to inform you that your student, ${studentName}, has applied for a leave. Below are the details of the request:\n\n- Class: ${className}\n- Reason for Leave: ${reasonForLeave}\n- Leave Time: From ${formattedStartDate} to ${formattedEndDate}\n- Place of Residence during the leave: ${placeOfResidence}\n- Attendance Percentage: ${attendancePercentage}\n\nPlease take note of this leave request.\n\nThank you.`,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
           to: `whatsapp:+919649959730`
        });

        console.log('WhatsApp message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'WhatsApp message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
};

const sendPLMessageToParents = async (req, res) => {

    console.log('Received Body:', req.body);
    const {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startDate,
        endDate,
        classesMissed,
        className
    } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startDate,
        endDate,
        classesMissed,
        className
    });

    // Convert the ISO date format to a readable format (only date)
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log('Sending message to parent...');
    try {
        const message = await client.messages.create({
            body: `Dear Parent,\n\nWe would like to inform you that your child, ${studentName} (Registration Number: ${registrationNumber}, Roll Number: ${rollNumber}), has requested for Permitted Leave (PL). Here are the details:\n\n- Class: ${className}\n- Reason: ${reason}\n- Student was absent: From ${formattedStartDate} to ${formattedEndDate}\n- Classes Missed: ${classesMissed}\n\nPlease discuss this request with your child if you were not aware of it. If you have any questions, feel free to contact us.\n\nThank you.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+919649959730`
        });

        console.log('Message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending message to parent:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

const sendPLMessageToTeachers = async (req, res) => {
    console.log('Received Body:', req.body);

    const {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startDate,
        endDate,
        classesMissed,
        className
    } = req.body;

    console.log('Form Data:', {
        contactNumber,
        studentName,
        registrationNumber,
        rollNumber,
        reason,
        startDate,
        endDate,
        classesMissed,
        className
    });

    // Convert the ISO date format to a readable format (only date)
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log('Sending message to teacher via WhatsApp...');
    try {
        const message = await client.messages.create({
            body: `Dear Teacher,\n\nThis is to inform you that your student, ${studentName} (Registration Number: ${registrationNumber}, Roll Number: ${rollNumber}), has requested Permitted Leave (PL). Here are the details:\n\n- Class: ${className}\n- Reason: ${reason}\n- The student was absent: From ${formattedStartDate} to ${formattedEndDate}\n- Classes Missed: ${classesMissed}\n\nPlease take note of this leave request.\n\nThank you.`,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+919649959730`
        });

        console.log('Message sent successfully with SID:', message.sid);
        return res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
    } catch (error) {
        console.error('Error sending message to teacher via WhatsApp:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};


module.exports = {
    sendSMS,
    sendWhatsAppMessage,
    sendLeaveMessageToParents,
    sendLeaveMessageToTeachers,
    sendPLMessageToTeachers,
    sendPLMessageToParents,
    sendSMSInOUt,
    sendSOS
};
