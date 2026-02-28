const dotenv = require('dotenv');
const client = require('./config/db');

dotenv.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
