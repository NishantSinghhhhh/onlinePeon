const { Leave } = require('../Models/Leave'); // Adjust the path according to your project structure
const { Outpass } = require('../Models/Outpass'); // Adjust the path according to your project structure

const fetchLeaves = async (req, res) => {
  try {
    const { date } = req.query; 

    // Debug: Log the incoming request data
    console.log("Fetching leaves with the following parameters:");
    console.log("Date:", date);

    if (!date) {
      console.log("Error: Date is missing in the request");
      return res.status(400).json({ message: 'Date is required' });
    }

    // Convert the provided date to a Date object and set hours to 00:00:00
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    const nextDay = new Date(formattedDate);
    nextDay.setDate(nextDay.getDate() + 1); // Get the next day at midnight

    console.log("Formatted Date (Midnight):", formattedDate.toISOString());

    // Query to match endDate within the date range and validate extraDataArray and extraValidationArray
    const query = {
      endDate: {
        $gte: formattedDate, // Match endDate greater than or equal to the specified date
        $lt: nextDay        // Match endDate less than the next day
      },
      extraDataArray: { $eq: [1, 1, 1, 1] }, // Match exact array [1,1,1,1]
      extraValidation: { $eq: [1, 1] }       // Match exact array [1,1]
    };

    // Debug: Log the constructed query
    console.log("Constructed MongoDB Query:", JSON.stringify(query));

    // Fetch the matching leaves from the database
    const leaves = await Leave.find(query);
    console.log("Found Leaves:", leaves.length);

    if (leaves.length === 0) {
      console.log("No matching leaves found for the provided date and validation arrays");
    }

    // Send the matching leaves data as JSON
    return res.status(200).json(leaves);

  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({ message: 'Error fetching leaves', error });
  }
};

const fetchOutpasses = async (req, res) => {
  try {
    const { date } = req.query; // Get date from query parameters

    // Debug: Log the incoming request data
    console.log("Fetching outpasses with the following parameters:");
    console.log("Date:", date);

    if (!date) {
      console.log("Error: Date is missing in the request");
      return res.status(400).json({ message: 'Date is required' }); // Ensure a date is provided
    }

    // Convert the provided date to a Date object
    const formattedDate = new Date(date);
    console.log("Formatted Date:", formattedDate.toISOString());

    // Set the query to match only the exact date, ignoring the time part
    const query = {
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)), // Start of the day (00:00:00)
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999)), // End of the day (23:59:59)
      },
      extraDataArray: { $eq: [1, 1, 1, 1] }, // Ensure extraDataArray is [1,1,1,1] in the database
      extraValidation: { $eq: [1, 1] }  // Ensure extraValidationArray is [1,1] in the database
    };

    // Debug: Log the constructed query
    console.log("Constructed MongoDB Query:", JSON.stringify(query));

    // Fetch the matching outpasses from the database
    const outpasses = await Outpass.find(query);
    console.log("Found Outpasses:", outpasses.length);

    if (outpasses.length === 0) {
      console.log("No matching outpasses found for the provided date and validation arrays");
    }

    // Send the matching outpasses data as JSON
    return res.status(200).json(outpasses);

  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return res.status(500).json({ message: 'Error fetching outpasses', error });
  }
};
const fetchLateComers = async (req, res) => {
  try {
    const { date } = req.query; // Get date from query parameters

    // Debug: Log the incoming request data
    console.log("Fetching outpasses with the following parameters:");
    console.log("Date:", date);

    if (!date) {
      console.log("Error: Date is missing in the request");
      return res.status(400).json({ message: 'Date is required' }); // Ensure a date is provided
    }

    // Convert the provided date to a Date object
    const formattedDate = new Date(date);
    console.log("Formatted Date:", formattedDate.toISOString());

    // Set the query to match only the exact date, ignoring the time part
    const query = {
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)), // Start of the day (00:00:00)
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999)), // End of the day (23:59:59)
      },
      extraDataArray: { $eq: [1, 1, 1, 1] }, // Ensure extraDataArray is [1,1,1,1]
      extraValidation: { $eq: [1, 1] }  // Ensure extraValidationArray is [1,1]
    };

    // Debug: Log the constructed query
    console.log("Constructed MongoDB Query:", JSON.stringify(query));

    // Fetch the matching outpasses from the database
    const outpasses = await Outpass.find(query);
    console.log("Found Outpasses:", outpasses.length);

    if (outpasses.length === 0) {
      console.log("No matching outpasses found for the provided date and validation arrays");
      return res.status(404).json({ message: 'No matching outpasses found' });
    }

    // Filter outpasses for latecomers (inTime > 21:30)
    const lateComers = outpasses.filter(outpass => {
      // Assuming inTime is a string in "HH:mm" format
      const inTimeParts = outpass.inTime.split(':');
      const inTime = new Date();
      inTime.setHours(inTimeParts[0], inTimeParts[1]);

      const lateCutOff = new Date();
      lateCutOff.setHours(21, 30); // 21:30

      return inTime > lateCutOff; // Check if inTime is greater than 21:30
    });

    console.log("Found Latecomers:", lateComers.length);

    // Send the matching latecomers data as JSON
    return res.status(200).json(lateComers);

  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return res.status(500).json({ message: 'Error fetching outpasses', error });
  }
};

module.exports = {
  fetchOutpasses,
  fetchLeaves,
  fetchLateComers
};
