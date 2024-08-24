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
const upload = multer({dest:"uploads/"})

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        return cb(null, "/uploads");
    },

    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    },

});

const uploads = multer({storage});

app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send("PONG");
});

app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); 
app.use('/products', authRoutes);

app.post('/upload', upload.single('profileimage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Log the full request body
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        // Log details of the uploaded file
        console.log('Uploaded File Details:');
        console.log(`Original Name: ${req.file.originalname}`);
        console.log(`File Name: ${req.file.filename}`);
        console.log(`File Path: ${req.file.path}`);
        console.log(`File Size: ${req.file.size} bytes`);
        console.log(`MIME Type: ${req.file.mimetype}`);

        // Additional details
        console.log('Destination Path:', req.file.destination);

        return res.json({ success: true, message: 'File uploaded successfully.' });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
