const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, position } = req.body;

        if (!id || position === undefined || status === undefined) {
            return res.status(400).json({
                message: 'ID, position, and status are required',
                success: false
            });
        }

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

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                message: 'Leave not found',
                success: false
            });
        }
        leave.extraDataArray[position] = status;
        await leave.save();
        

        console.log('Before update:', leave.extraDataArray);

        console.log('After update:', leave.extraDataArray);

        res.status(200).json({
            message: 'Leave updated successfully',
            success: true,
            data: leave
        });
    } catch (err) {
        console.error('Error updating leave:', { message: err.message, stack: err.stack });
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};


exports.updateOutpassStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, position } = req.body;

        if (!id || position === undefined || status === undefined) {
            return res.status(400).json({
                message: 'ID, position, and status are required',
                success: false
            });
        }

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

        const outpass = await Outpass.findById(id);

        if (!outpass) {
            return res.status(404).json({
                message: 'Outpass not found',
                success: false
            });
        }

        outpass.extraDataArray[position] = status;
        await outpass.save();

        res.status(200).json({
            message: 'Outpass updated successfully',
            success: true,
            data: outpass
        });
    } catch (err) {
        console.error('Error updating outpass:', { message: err.message, stack: err.stack });
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

exports.updatePLStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, position } = req.body;

        if (!id || position === undefined || status === undefined) {
            return res.status(400).json({
                message: 'ID, position, and status are required',
                success: false
            });
        }

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

        const pl = await PL.findById(id);

        if (!pl) {
            return res.status(404).json({
                message: 'PL not found',
                success: false
            });
        }

        pl.extraDataArray[position] = status;
        await pl.save();

        res.status(200).json({
            message: 'PL updated successfully',
            success: true,
            data: pl
        });
    } catch (err) {
        console.error('Error updating PL:', { message: err.message, stack: err.stack });
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Removed position

        // Debugging: Log received request parameters
        console.log('Request received with ID:', id);
        console.log('Status received:', status);

        // Validate request parameters
        if (!id || status === undefined) {
            console.log('Validation failed: ID or status missing');
            return res.status(400).json({
                message: 'ID and status are required',
                success: false
            });
        }

        if (status !== 1 && status !== -1) {
            console.log('Validation failed: Invalid status value');
            return res.status(400).json({
                message: 'Status must be 1 (approved) or -1 (declined)',
                success: false
            });
        }

        // Find and update the leave document
        const leave = await Leave.findById(id);

        // Debugging: Log whether the leave was found
        if (!leave) {
            console.log('Leave not found for ID:', id);
            return res.status(404).json({
                message: 'Leave not found',
                success: false
            });
        }

        // Assuming extraDataArray is the field to update
        // If you have a different field or logic, adjust accordingly
        leave.status = status; // Adjust according to your schema
        await leave.save();

        // Debugging: Log successful update
        console.log('Leave updated successfully:', leave);

        res.status(200).json({
            message: 'Leave updated successfully',
            success: true,
            data: leave
        });
    } catch (err) {
        // Debugging: Log the error details
        console.error('Error updating leave:', { message: err.message, stack: err.stack });

        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};
