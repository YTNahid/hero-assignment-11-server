const express = require('express');
const cors = require('cors');

const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.send(`<h1>Apex Rentals API</h1>`);
});

app.all(/path: .*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
