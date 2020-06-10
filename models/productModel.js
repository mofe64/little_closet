const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product must have a name'],
  },
  productDescription: {
    type: String,
    required: [true, 'Product must have a description'],
  },
  productImageMain: {
    type: String,
    required: [true, 'Prpduct must have a main image'],
  },
  productSize: {
    type: String,
    enum: {
      values: ['s', 'm', 'l', 'xl'],
      message: 'Size must be either: s, m, l, xl and must be in lowecase',
    },
    lowercase: true,
  },
  productImages: [String],
  productColor: {
    type: String,
  },
  productPrice: {
    type: Number,
    required: [true, 'Product must have a set price'],
    set: (val) => val * 100,
  },
  productCurrency: {
    type: String,
    required: [true, 'Currency product is to be sold in must be stated'],
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
