const JWT = require('jsonwebtoken');
const Seller = require('../models/sellerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.sellerSignUp = catchAsync(async (req, res, next) => {
  const newSeller = await Seller.create({
    username: req.body.username,
    email: req.body.email,
    profilePhoto: req.body.profilePhoto,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    address: req.body.address,
    bvn: req.body.bvn,
    accountNumber: req.body.accountNumber,
    bank: req.body.bank,
  });
  const token = signToken(newSeller._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newSeller,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide your username and password', 400));
  }

  //find user based on given credentials
  let user;
  if ((await Seller.findOne({ username }).select('+password')) !== null) {
    user = await Seller.findOne({ username }).select('+password');
  }

  //check if puser exists and password entered is correct
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
