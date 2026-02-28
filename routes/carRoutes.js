const express = require('express');
const carController = require('../controllers/carController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(carController.getAllCars)
  .post(authController.verifyToken, carController.addCar);

router.get('/myCars', authController.verifyToken, carController.getMyCars);

router.route('/:id').get(carController.getOneCar);

router.use(authController.verifyToken);
router
  .route('/:id')
  .patch(carController.updateCar)
  .delete(carController.deleteMyCar);

module.exports = router;
