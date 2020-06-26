const Seller = require('../models/sellerModel');
const Product = require('../models/productModel');
//const Category = require('../models/categoryModel');
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
  //create new product
  const newProduct = await Product.create({
    productName: req.body.productName,
    productDescription: req.body.productDescription,
    productImageMain: req.body.productImageMain,
    productSizes: req.body.productSizes,
    productImages: req.body.productImages,
    productPrice: req.body.productPrice,
    productCurrency: req.body.productCurrency,
    productCategory: req.body.productCategory,
  });
  //add product to seller inventory
  const vendor = await Seller.findByIdAndUpdate(
    req.params.id,
    {
      $push: { inventory: newProduct._id },
    },
    {
      runValidators: true,
      new: true,
    }
  );
  const updatedInventory = vendor.inventory;

  res.status(200).json({
    status: 'success',
    productsInInventory: updatedInventory.length,
    data: {
      updatedInventory,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const vendor = await Seller.findById(req.params.id);
  const totalInventory = vendor.inventory;
  if (!vendor) {
    return next(new AppError('No vendor found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    productsInInventory: totalInventory.length,
    data: {
      totalInventory,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const vendor = await Seller.findById(req.params.id);
  const verify = vendor.inventory.some(function (product) {
    return product.equals(req.params.productid);
  });
  if (!verify) {
    return next(
      new AppError(
        `The product associated with product Id is not in current vendor's inventory`,
        404
      )
    );
  }

  const product = await Product.findById(req.params.productid);

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const vendor = await Seller.findById(req.params.id);
  const verify = vendor.inventory.some(function (product) {
    return product.equals(req.params.productid);
  });
  if (!verify) {
    return next(
      new AppError(
        `The product associated with product Id is not in current vendor's inventory`,
        404
      )
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productid,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedProduct) {
    return next(new AppError('No product found with that id', 404));
  }
  const updatedVendor = await Seller.findById(req.params.id);
  const newInventory = updatedVendor.inventory;
  res.status(200).json({
    status: 'success',
    productsInInventory: newInventory.length,
    data: {
      newInventory,
    },
  });
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  const vendor = await Seller.findById(req.params.id);
  const verify = vendor.inventory.some(function (product) {
    return product.equals(req.params.productid);
  });
  if (!verify) {
    return next(
      new AppError(
        `The product associated with product Id is not in current vendor's inventory`,
        404
      )
    );
  }
  const product = await Product.findByIdAndDelete(req.params.productid);
  if (!product) {
    return next(new AppError('No product found with that Id', 404));
  }
  const updatedVendor = await Seller.findByIdAndUpdate(req.params.id, {
    $pull: { inventory: product._id },
  });
  const updatedInventory = updatedVendor.inventory;

  res.status(200).json({
    status: 'success',
    productsInInventory: updatedInventory.length,
    data: {
      updatedInventory,
    },
  });
});

exports.deactivate = catchAsync(async (req, res, next) => {
  const deactivatedVendor = await Seller.findByIdAndUpdate(req.params.id, {
    active: false,
  });

  if (!deactivatedVendor) {
    return next(
      new AppError(
        'No vendor found with that Id, Either vendor does not exist or vendor has already been deactivated'
      )
    );
  }
  res.status(200).json({
    status: 'success',
    message: 'Vendor has successfully been deactivated',
  });
});
