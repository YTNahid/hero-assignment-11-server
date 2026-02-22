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

let dbConnection;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      dbConnection = client.db('apex_rentals');
      console.log('Successfully connected to MongoDB... 📑');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  },

  getDb: function () {
    return dbConnection;
  },
};
