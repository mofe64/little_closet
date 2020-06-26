const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/vendor/signup', authController.sellerSignUp);
router.post('/customer/signup', authController.customerSignUp);
router.post('/signin', authController.signIn);

module.exports = router;
