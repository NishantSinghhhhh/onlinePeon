const { Outpass } = require('../Models/Outpass');
const { PL } = require('../Models/PL');
const { Leave } = require('../Models/Leave');
const mongoose = require('mongoose'); // Import mongoose

exports.updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id; // Changed from req.params.leaveId
        const { status, position } = req.body;

        console.log("this is running");
        console.log('Received update request:');
        console.log('Leave ID:', leaveId);
        console.log('Status:', status);
        console.log('Position:', position);

        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            console.log('Invalid leave ID');
            return res.status(400).json({ message: 'Invalid leave ID' });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            console.log('Leave not found');
            return res.status(404).json({ message: 'Leave not found' });
        }

        console.log('Before update:', leave.extraDataArray);

        // Validate position
        if (position < 0 || position >= leave.extraDataArray.length) {
            console.log('Position out of bounds');
            return res.status(400).json({ message: 'Position out of bounds' });
        }

        leave.extraDataArray[position] = status;

        console.log('After update:', leave.extraDataArray);

        const savedLeave = await leave.save();
        console.log('Saved leave:', savedLeave);

        res.status(200).json({ message: 'Leave status updated successfully', leave: savedLeave });

    } catch (err) {
        console.error('Error in updateLeaveStatus:', err);
        res.status(500).json({ message: 'Error updating leave status', error: err.message });
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

        // Validate input
        if (!id || position === undefined || status === undefined) {
            console.log('Validation failed: ID, position, or status is missing');
            return res.status(400).json({
                message: 'ID, position, and status are required',
                success: false
            });
        }

        if (typeof position !== 'number' || position < 0 || position > 3) {
            console.log('Validation failed: Position is out of range');
            return res.status(400).json({
                message: 'Position must be between 0 and 3',
                success: false
            });
        }

        if (status !== 1 && status !== -1) {
            console.log('Validation failed: Status is invalid');
            return res.status(400).json({
                message: 'Status must be 1 (approved) or -1 (declined)',
                success: false
            });
        }

        // Fetch the PL document
        const pl = await PL.findById(id);

        if (!pl) {
            console.log(`PL with ID ${id} not found`);
            return res.status(404).json({
                message: 'PL not found',
                success: false
            });
        }

        // Update the PL document
        if (!Array.isArray(pl.extraDataArray)) {
            console.log('PL document does not have an extraDataArray');
            return res.status(500).json({
                message: 'Server error: extraDataArray not found on PL document',
                success: false
            });
        }

        // Ensure extraDataArray is large enough
        if (position >= pl.extraDataArray.length) {
            console.log('Validation failed: Position is out of bounds of extraDataArray');
            return res.status(400).json({
                message: 'Position is out of bounds',
                success: false
            });
        }

        pl.extraDataArray[position] = status;
        await pl.save();

        console.log(`PL with ID ${id} updated successfully`);
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