const { Outpass } = require('../Models/Outpass'); // Adjust the path to your Outpass model
const { Leave } = require('../Models/Leave');     // Adjust the path to your Leave model
const mongoose = require('mongoose');              // Import mongoose

const EditOutpass = async (req, res) => {
    try {
        // Log the data coming from the frontend
        console.log("Data from frontend:", req.body);
        
        // Destructure the fields from the request body
        const { outpassId, date, startHour, endHour } = req.body;
        console.log(req.body);

        // Validate the outpassId format
        if (!mongoose.Types.ObjectId.isValid(outpassId)) {
            return res.status(400).json({ message: 'Invalid outpass ID' });
        }

        // Find the outpass using findOne
        const outpass = await Outpass.findOne({ _id: outpassId });

        // Check if the outpass was found
        if (!outpass) {
            return res.status(404).json({ message: 'Outpass not found' });
        }

        // Update the outpass fields
        outpass.date = date;
        outpass.startHour = startHour;
        outpass.endHour = endHour;

        // Save the updated outpass
        const updatedOutpass = await outpass.save();

        // Log the updated outpass for debugging
        console.log("Updated Outpass:", updatedOutpass);

        res.status(200).json({ 
            message: 'Outpass updated successfully',
            updatedOutpass // Optionally return the updated outpass data
        });
    } catch (error) {
        console.error('Error editing outpass:', error);
        res.status(500).json({ message: 'An error occurred while editing the outpass' });
    }
};

module.exports = {
    EditOutpass
};
