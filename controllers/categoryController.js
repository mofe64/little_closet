const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    category: req.body.category,
  });
  res.status(201).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return next(new AppError('That category could not be found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  const categoryId = category._id;
  if (!category) {
    return next(new AppError('No Category found with that slug', 404));
  }
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      category: req.body.category,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedCategory,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  res.status(501).json({
    status: 'not implemnted',
    message: 'route not implemented yet',
  });
});
