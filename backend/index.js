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

        console.log(req.body);
        console.log(req.file);

        return res.json({ success: true, message: 'File uploaded successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
