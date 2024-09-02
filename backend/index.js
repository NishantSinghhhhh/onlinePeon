const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./Routes/AuthRouter');
const fetchRoutes = require('./Routes/fetchRouter')
const { func } = require('joi');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send("PONG");
});
// app.get('/')
// ../
app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); 
app.use('/fetch', fetchRoutes)
app.use('/products', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
