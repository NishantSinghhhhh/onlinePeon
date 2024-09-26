const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_CONN;
const mongo_url2 = process.env.MONGO_CONN2;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create multiple database connections and log a message once connected
const db1 = mongoose.createConnection(mongo_url, options);
db1.on('connected', () => console.log('DB1 Connected'));

const db6 = mongoose.createConnection(mongo_url, options);
db6.on('connected', () => console.log('DB6 Connected'));

const db2 = mongoose.createConnection(mongo_url2, options);
db2.on('connected', () => console.log('DB2 Connected'));

const db3 = mongoose.createConnection(mongo_url2, options);
db3.on('connected', () => console.log('DB3 Connected'));

const db4 = mongoose.createConnection(mongo_url2, options);
db4.on('connected', () => console.log('DB4 Connected'));

const db5 = mongoose.createConnection(mongo_url2, options);
db5.on('connected', () => console.log('DB5 Connected'));

// In case of any connection error
db1.on('error', (err) => console.log('DB1 Connection Error:', err));
db6.on('error', (err) => console.log('DB6 Connection Error:', err));
db2.on('error', (err) => console.log('DB2 Connection Error:', err));
db3.on('error', (err) => console.log('DB3 Connection Error:', err));
db4.on('error', (err) => console.log('DB4 Connection Error:', err));
db5.on('error', (err) => console.log('DB5 Connection Error:', err));

module.exports = { db1, db2, db3, db4, db5, db6 };
