const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./Routes/AuthRouter');
const fetchRoutes = require('./Routes/fetchRouter');
const fetchRoutesTeachers = require('./Routes/fetchRoutesTeachers');
const fetchAll = require('./Routes/fetchAll');
const updateRoutes = require('./Routes/updateRoutes');
const fetchUser = require('./Routes/fetchUserRoute');
const messageRoutes = require('./Routes/MessageRouter'); // Ensure this exports an Express router
const adminInOut = require('./Routes/AdminRoutes');
const EditRoutes = require('./Routes/EditRoutes');
const check = require('./Routes/check')
require('dotenv').config();
require('./Models/db'); // Ensure this file sets up your DB connection

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware configuration
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: [
        "https://online-peon-frontend.vercel.app",
        "http://localhost:3000" // Local development URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


// Define routes
app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); // Verify if this is correct or needs to be different
app.use('/fetch', fetchRoutes);
app.use('/fetch/teachers', fetchRoutesTeachers); // Added subpath for clarity
app.use('/update', updateRoutes);
app.use('/products', authRoutes); // Verify if this is correct or needs to be different
app.use('/fetchAll', fetchAll);
app.use('/fetchUser', fetchUser);
app.use('/message', messageRoutes); // Ensure this is correct
app.use('/check', check); // Ensure this is correct
app.use('/adminInOut',adminInOut )
app.use('/edit',EditRoutes )
// Test route
app.get('/', (req, res) => {
    res.json("PONG");
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
