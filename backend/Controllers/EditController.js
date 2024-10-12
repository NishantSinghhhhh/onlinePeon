const { Outpass } = require('../Models/Outpass'); // Adjust the path to your Outpass model
const { Leave } = require('../Models/Leave');     // Adjust the path to your Leave model
const mongoose = require('mongoose');              // Import mongoose

const EditOutpass = async (req, res) => {
    try {
        const { id, date, startHour, endHour } = req.body;
        console.log(req.body);

        // if (!mongoose.Types.ObjectId.isValid(outpassId)) {
        //     return res.status(400).json({ message: 'Invalid outpass ID' });
        // }
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
        const { outpassId, date, startHour, endHour } = req.body;
        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(outpassId)) {
            return res.status(400).json({ message: 'Invalid outpass ID' });
        }

        const outpass = await Outpass.findOne({ _id: outpassId });

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

const EditPL = async (req, res) => {
    try {
        const { outpassId, date, startHour, endHour } = req.body;
        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(outpassId)) {
            return res.status(400).json({ message: 'Invalid outpass ID' });
        }

        const outpass = await Outpass.findOne({ _id: outpassId });

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

module.exports = {
    EditOutpass,EditLeave,EditPL
};
