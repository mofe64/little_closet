const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product must have a name'],
    lowercase: true,
  },
  productDescription: {
    type: String,
    required: [true, 'Product must have a description'],
  },
  productImageMain: {
    type: String,
    required: [true, 'Prpduct must have a main image'],
  },
  productSizes: {
    type: [String],
    enum: {
      values: ['s', 'm', 'l', 'xl'],
      message: 'Size must be either: s, m, l, xl and must be in lowecase',
    },
    lowercase: true,
  },
  productImages: [String],
  productColor: {
    type: String,
    lowercase: true,
  },
  productPrice: {
    type: Number,
    required: [true, 'Product must have a set price'],
    set: (val) => val * 100,
  },
  productCurrency: {
    type: String,
    required: [true, 'Currency product is to be sold in must be stated'],
    lowercase: true,
  },
  productCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
