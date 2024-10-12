const { Outpass } = require('../Models/Outpass'); // Adjust the path to your Outpass model
const mongoose = require('mongoose'); // Import mongoose

const vetoOutpass = async (req, res) => {
    console.log('hello'); // Corrected to log a string

    try {
        const { outpassId } = req.body; // Assuming you send the outpass ID in the request body
        console.log('Outpass ID:', outpassId); // Log the outpass ID

        // Find the Outpass and update its extraDataArray
        const updatedOutpass = await Outpass.findByIdAndUpdate(
            outpassId,
            { extraDataArray: [1, 1, 1, 1] }, // Set extraDataArray to [1, 1, 1, 1]
            { new: true } // Return the updated document
        );

        if (!updatedOutpass) {
            return res.status(404).json({ message: 'Outpass not found' });
        }

        return res.status(200).json({ message: 'Outpass vetoed successfully', updatedOutpass });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    vetoOutpass // Export the vetoOutpass function
};
