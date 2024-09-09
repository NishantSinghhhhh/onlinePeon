const { Outpass } = require('../Models/Outpass'); // Ensure the correct path is used
 // Assuming you have a model named Outpass
const {Leave} = require('../Models/Leave');      // Assuming you have a model named Leave
const {PL} = require('../Models/PL');            // Assuming you have a model named PL

// Fetch all outpasses
const fetchAllOutpasses = async (req, res) => {
    try {
        const allOutpasses = await Outpass.find();  // Fetch all documents from Outpass collection
        res.status(200).json({
            success: true,
            data: allOutpasses
        });
    } catch (err) {
        console.error('Error fetching all outpasses:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Fetch all leaves
const fetchAllLeaves = async (req, res) => {
    try {
        const allLeaves = await Leave.find();  // Fetch all documents from Leave collection
        res.status(200).json({
            success: true,
            data: allLeaves
        });
    } catch (err) {
        console.error('Error fetching all leaves:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Fetch all PLs
const fetchAllPLs = async (req, res) => {
    try {
        const allPLs = await PL.find();  // Fetch all documents from PL collection
        res.status(200).json({
            success: true,
            data: allPLs
        });
    } catch (err) {
        console.error('Error fetching all PLs:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    fetchAllOutpasses,
    fetchAllLeaves,
    fetchAllPLs
};
