const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const carRouter = require('./routes/carRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'https://apex-rentals-c43dc.firebaseapp.com',
      'https://apex-rentals-c43dc.web.app',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.get('/', (req, res) => {
  res.send(`<h1>Apex Rentals API</h1>`);
});

app.use('/auth', authRouter);
app.use('/cars', carRouter);
app.use('/bookings', bookingRouter);

app.all(/path: .*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
