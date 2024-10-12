const { Outpass } = require('../Models/Outpass'); // Adjust the path to your Outpass model
const { Leave } = require('../Models/Leave');     // Adjust the path to your Leave model
const {PL} = require('../Models/PL')

const mongoose = require('mongoose');              // Import mongoose

const EditOutpass = async (req, res) => {
    try {
        const { id, date, startHour, endHour } = req.body;
        console.log(req.body);

    
        console.log("hii");
        const outpass = await Outpass.findOne({ _id: id });

        if (!outpass) {
            return res.status(404).json({ message: 'Outpass not found' });
        }

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

const EditLeave = async (req, res) => {
    try {
        const { id, startDate, endDate } = req.body;
        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid leave ID' });
        }

        const leave = await Leave.findOne({ _id: id });

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.startDate = startDate;
        leave.endDate = endDate;

        const updatedLeave = await leave.save();


        console.log("Updated Leave:", updatedLeave);

        res.status(200).json({ 
            message: 'Leave updated successfully',
            updatedLeave // Optionally return the updated leave data
        });
    } catch (error) {
        console.error('Error editing leave:', error);
        res.status(500).json({ message: 'An error occurred while editing the leave' });
    }
};

const EditPL = async (req, res) => {
    try {
        const { id, classesMissed, startDate, endDate } = req.body;
        console.log(req.body);

        // Validate the PL ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid PL ID' });
        }

        // Find the PL by ID
        const pl = await PL.findById(id);

        if (!pl) {
            return res.status(404).json({ message: 'PL not found' });
        }

        // Update the PL fields
        pl.classesMissed = classesMissed;
        pl.startDate = startDate;
        pl.endDate = endDate;

        // Save the updated PL
        const updatedPL = await pl.save();

        // Log the updated PL for debugging
        console.log("Updated PL:", updatedPL);

        // Send response back with the updated PL
        res.status(200).json({ 
            message: 'PL updated successfully',
            updatedPL // Optionally return the updated PL data
        });
    } catch (error) {
        console.error('Error editing PL:', error);
        res.status(500).json({ message: 'An error occurred while editing the PL' });
    }
};

module.exports = {
    EditOutpass,EditLeave,EditPL
};
