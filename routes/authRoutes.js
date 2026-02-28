const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/jwt', authController.createSendToken);
router.post('/logout', authController.logout);

module.exports = router;
