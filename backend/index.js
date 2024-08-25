const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./Routes/AuthRouter');
const { func } = require('joi');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// const uploads = multer({storage});

app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send("PONG");
});

app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); 
app.use('/products', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
