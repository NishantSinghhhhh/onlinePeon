const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./Routes/AuthRouter');
// const outpassRoutes = require('./Routes/OutpassRouter'); // Import outpass routes

require('dotenv').config();
// require('./Models/db');

const PORT = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define routes
app.get('/ping', (req, res) => {
    res.send("PONG");
});

// Import and use your routes
app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); // Use outpass routes
app.use('/products', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



