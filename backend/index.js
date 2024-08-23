const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./Routes/AuthRouter');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;
const app = express();
const upload = multer({dest:"uploads/"})

app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send("PONG");
});

app.use('/auth', authRoutes);
app.use('/outpass', authRoutes); 
app.use('/products', authRoutes);

app.post('/upload', upload.single('profileimage'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    return res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
