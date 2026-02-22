const dotenv = require('dotenv');
const { connectToServer } = require('./config/db');

dotenv.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToServer();
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
