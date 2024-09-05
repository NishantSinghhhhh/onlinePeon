// Controllers/updateControllers.js
const { Outpass } = require('../Models/Outpass');

exports.updateOutpassStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, position } = req.body; 

        // Validate input
        if (!id || position === undefined || status === undefined) {
            return res.status(400).json({
                message: 'ID, position, and status are required',
                success: false
            });
        }

        // Validate position and status
        if (position < 0 || position > 3) {
            return res.status(400).json({
                message: 'Position must be between 0 and 3',
                success: false
            });
        }
        if (status !== 1 && status !== -1) {
            return res.status(400).json({
                message: 'Status must be 1 (approved) or -1 (declined)',
                success: false
            });
        }

        // Find and update the outpass
        const outpass = await Outpass.findById(id);

        if (!outpass) {
            return res.status(404).json({
                message: 'Outpass not found',
                success: false
            });
        }

        // Update the specified index of the extraDataArray
        outpass.extraDataArray[position] = status;

        // Save the updated document
        await outpass.save();

        res.status(200).json({
            message: 'Outpass updated successfully',
            success: true,
            data: outpass
        });
    } catch (err) {
        console.error('Error updating outpass:', {
            message: err.message,
            stack: err.stack
        });

        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};
