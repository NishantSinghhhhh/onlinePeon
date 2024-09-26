const { Outpass } = require('../Models/Outpass'); // Adjust the path to your Outpass model
const { Leave } = require('../Models/Leave');     // Adjust the path to your Leave model

// Check outpass by objectId
const checkOutpass = async (req, res) => {
    const { objectId } = req.body;

    if (!objectId) {
        return res.status(400).json({
            success: false,
            message: 'Object ID is required'
        });
    }

    try {
        const outpass = await Outpass.findById(objectId);

        if (!outpass) {
            return res.status(404).json({
                success: false,
                message: 'Outpass not found'
            });
        }

        // Check if extraDataArray contains [1, 1, 1, 1]
        const isSuccess = outpass.extraDataArray.every(value => value === 1);

        if (isSuccess) {
            res.status(200).json({
                success: true,
                message: 'Outpass check successful'
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'Outpass check failed'
            });
        }
    } catch (err) {
        console.error('Error checking outpass:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const checkLeave = async (req, res) => {
    const { objectId } = req.body;

    if (!objectId) {
        return res.status(400).json({
            success: false,
            message: 'Object ID is required'
        });
    }

    try {
        const leave = await Leave.findById(objectId);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found'
            });
        }

        // Check if extraDataArray contains [0, 0, 1, 0]
        const isSuccess = leave.extraDataArray.every((value, index) => value === [0, 0, 1, 0][index]);

        if (isSuccess) {
            res.status(200).json({
                success: true,
                message: 'Leave check successful'
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'Leave check failed'
            });
        }
    } catch (err) {
        console.error('Error checking leave:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    checkOutpass,
    checkLeave
};
