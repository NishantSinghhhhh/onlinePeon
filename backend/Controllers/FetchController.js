const { Outpass } = require('../Models/Outpass');

const fetchOutpassesByRegNo = async (req, res) => {
    try {
        const { regNo } = req.params;

        // Debugging: Log the incoming registration number
        console.log('Received Registration Number:', regNo);

        // Debugging: Check if the Outpass model is properly loaded
        if (!Outpass) {
            console.error('Outpass model is not defined.');
            return res.status(500).json({ message: 'Internal server error: Outpass model is not defined.' });
        }

        console.log('Outpass model:', Outpass);

        // Debugging: Check if the find method exists on the model
        if (typeof Outpass.find !== 'function') {
            console.error('find method is not a function on the Outpass model.');
            return res.status(500).json({ message: 'Internal server error: find method is not available on Outpass model.' });
        }

        // Perform the database query
        const outpasses = await Outpass.find({ registrationNumber: regNo });

        // Debugging: Log the results from the query
        console.log('Outpasses fetched from the database:', outpasses);

        // Check if any outpasses were found
        if (outpasses.length === 0) {
            console.log('No outpasses found for this registration number.');
            return res.status(404).json({ message: 'No outpasses found for this registration number.' });
        }

        // Respond with the fetched outpasses
        res.json(outpasses);
    } catch (error) {
        // Debugging: Log the error
        console.error('Error fetching outpasses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { fetchOutpassesByRegNo };
