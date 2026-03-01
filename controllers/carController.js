const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const client = require('../config/db');
const { ObjectId } = require('mongodb');
const APIFeatures = require('../utils/APIFeatures');

const db = client.db('apex_rentals');
const carsCollection = db.collection('cars');

// Get All Cars
exports.getAllCars = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(carsCollection, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const result = await features.cursor.toArray();

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      data: result,
    },
  });
});

// Get One Car
exports.getOneCar = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await carsCollection.findOne({ _id: new ObjectId(id) });

  if (!result) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Get My Cars
exports.getMyCars = catchAsync(async (req, res, next) => {
  const baseFilter = { addedBy: req.user };
  const features = new APIFeatures(carsCollection, req.query, baseFilter)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const result = await features.cursor.toArray();

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      data: result,
    },
  });
});

// Add Car
exports.addCar = catchAsync(async (req, res, next) => {
  const {
    carModel,
    dailyRentalPrice,
    availability,
    vehicleRegistrationNumber,
    features,
    description,
    imageUrl,
    location,
  } = req.body;

  const carData = {
    carModel,
    dailyRentalPrice,
    availability,
    vehicleRegistrationNumber,
    features,
    description,
    imageUrl,
    location,
    bookingCount: 0,
    dateAdded: new Date(),
    addedBy: req.user,
  };

  const result = await carsCollection.insertOne(carData);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Update Car
exports.updateCar = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    carModel,
    dailyRentalPrice,
    availability,
    vehicleRegistrationNumber,
    features,
    description,
    imageUrl,
    location,
  } = req.body;

  const updatedCarData = {
    carModel,
    dailyRentalPrice,
    availability,
    vehicleRegistrationNumber,
    features,
    description,
    imageUrl,
    location,
  };

  const result = await carsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedCarData }
  );

  if (result.modifiedCount === 0) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// Delete Car
exports.deleteMyCar = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await carsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});
