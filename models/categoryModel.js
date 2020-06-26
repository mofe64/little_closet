const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please enter the category name'],
  },
  slug: {
    type: String,
  },
});

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.category, { lower: true });
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
