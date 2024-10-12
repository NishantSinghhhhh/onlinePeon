// admin mAZBf8lxFk1JShxa
const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_CONN;
const mongo_url2 = process.env.MONGO_CONN2;

// const mongo_url = 'mongodb+srv://admin:mAZBf8lxFk1JShxa@cluster0.hdhjs.mongodb.net/auth-db?retryWrites=true&w=majority&appName=Cluster0';
// const mongo_url2 = 'mongodb+srv://admin:mAZBf8lxFk1JShxa@cluster0.hdhjs.mongodb.net/Forms?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongo_url)
    .then(() =>{
        console.log('MongoDB Connected...')
    }).catch((err) => {
        console.log('Mngo db connection error', err);
  })

const db1 = mongoose.createConnection(mongo_url, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db6 = mongoose.createConnection(mongo_url, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db2 = mongoose.createConnection(mongo_url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db3 = mongoose.createConnection(mongo_url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db4 = mongoose.createConnection(mongo_url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db5 = mongoose.createConnection(mongo_url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

module.exports = { db1, db2, db3, db4, db5, db6};