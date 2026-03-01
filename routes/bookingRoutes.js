const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.verifyToken);

router.route('/').post(bookingController.addBooking);

router.get('/myBookings', bookingController.getMyBookings);
router.patch('/confirm/:id', bookingController.confirmBooking);
router.patch('/cancel/:id', bookingController.cancelBooking);

router.route('/:id').patch(bookingController.updateBooking);

module.exports = router;
