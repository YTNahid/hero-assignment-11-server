const express = require('express');
const cors = require('cors');
const client = require('./config/dbConnection');

const app = express();

app.use(cors());
app.use(express.json());

// ----- DATABASE
async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB... 📑');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
run().catch(console.dir);

// ----- Routes -----
app.get('/', (req, res) => {
  res.send(`<h1>Hero Assignment 11</h1>`);
});

module.exports = app;
