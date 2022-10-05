const express = require('express');
const User = require('../models/user');
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');

const router = express.Router();

router.post( '/signup', [
    body('phone')
      .isLength({min:10, max:10})
      .withMessage('Please enter a valid phone Number.')
      .custom((value, { req }) => {
        return User.findOne({ phone: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Phone Number already exists!');
          }
        });
      }),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ],authController.signup);

router.post('/login', authController.login);

router.post('/verify', authController.verify);

module.exports = router;
