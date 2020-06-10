const Seller = require('../models/sellerModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.updateSeller = catchAsync(async (req, res, next) => {
  const updatedSeller = await Seller.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true, new: true }
  );
  if (!updatedSeller) {
    return next(new AppError('No Vendor found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedSeller,
    },
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  //add product to inventory
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  //get all products in inventory
});

exports.getProduct = catchAsync(async (req, res, next) => {
  //get single product from inventory
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  //remove product from inventory
});
