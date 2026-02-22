require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DATABASE.replace(
  '<username>',
  process.env.DATABASE_USERNAME
).replace('<password>', process.env.DATABASE_PASSWORD);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = client;
