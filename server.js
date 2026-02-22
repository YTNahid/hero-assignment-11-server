require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
