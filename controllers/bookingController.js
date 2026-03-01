const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const client = require('../config/db');
const { ObjectId } = require('mongodb');
// const APIFeatures = require('../utils/APIFeatures');

const db = client.db('apex_rentals');
const carsCollection = db.collection('cars');
const bookingsCollection = db.collection('bookings');

// Get My Bookings
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const userId = req.user;

  const pipeline = [
    {
      $match: {
        userId: userId,
      },
    },
    {
      $lookup: {
        from: 'cars',
        localField: 'carId',
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    {
      $unwind: '$carDetails',
    },
    {
      $sort: {
        bookingDate: 1,
      },
    },
  ];

  const result = await bookingsCollection.aggregate(pipeline).toArray();

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      data: result,
    },
  });
});

// Add Booking
exports.addBooking = catchAsync(async (req, res, next) => {
  const { carId, startDate, endDate, totalPrice } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const car = await carsCollection.findOne({ _id: new ObjectId(carId) });

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  // Check if booking period is valid
  if (startDate > endDate) {
    return next(new AppError('Invalid booking period', 400));
  }

  // Check if car is available for booking in that period
  const alreadyBooked = await bookingsCollection.findOne({
    carId: new ObjectId(carId),
    status: { $ne: 'canceled' },
    startDate: { $lt: end },
    endDate: { $gt: start },
  });

  if (alreadyBooked) {
    return next(
      new AppError('This car is already booked during this time period.', 400)
    );
  }

  const bookingData = {
    carId: new ObjectId(carId),
    userId: req.user,
    bookingDate: new Date(),
    startDate: start,
    endDate: end,
    totalPrice,
    status: 'pending',
  };

  const result = await bookingsCollection.insertOne(bookingData);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Update Booking Time
exports.updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { startDate, endDate } = req.body;

  const updatedBookingData = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };

  const filter = { _id: new ObjectId(id), userId: req.user };

  const result = await bookingsCollection.updateOne(filter, {
    $set: updatedBookingData,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Confirm Booking
exports.confirmBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const filter = { _id: new ObjectId(id), userId: req.user };

  // Check if booking exists
  const booking = await bookingsCollection.findOne(filter);

  if (!booking) {
    return next(new AppError('Booking not found or unauthorized', 404));
  }

  // Check booking status
  if (booking.status === 'confirmed') {
    return next(new AppError('This booking is already confirmed.', 400));
  }

  if (booking.status === 'canceled') {
    return next(new AppError('This booking is canceled.', 400));
  }

  // Update booking status
  const result = await bookingsCollection.updateOne(filter, {
    $set: {
      status: 'confirmed',
    },
  });

  // Increment booking count
  await carsCollection.updateOne(
    { _id: booking.carId },
    { $inc: { bookingCount: 1 } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Cancel Booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const filter = { _id: new ObjectId(id), userId: req.user };

  // Check if booking exists
  const booking = await bookingsCollection.findOne(filter);

  if (!booking) {
    return next(
      new AppError(
        'Booking not found or you do not have permission to cancel it',
        404
      )
    );
  }

  // Check booking status
  if (booking.status === 'confirmed') {
    return next(new AppError('This booking is confirmed.', 400));
  }

  if (booking.status === 'canceled') {
    return next(new AppError('This booking is already canceled.', 400));
  }

  // Update booking status
  const result = await bookingsCollection.updateOne(filter, {
    $set: {
      status: 'canceled',
    },
  });

  // Decrement booking count for car
  await carsCollection.updateOne(
    { _id: booking.carId },
    { $inc: { bookingCount: -1 } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});
