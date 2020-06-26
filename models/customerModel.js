const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a usernamer'],
      unique: [true, 'That username is already taken please try another'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'please provide a valid email'],
    },
    profilePhoto: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password of at least 8 characters'],
      minlength: [8, 'password must be at least 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
    address: {
      type: String,
      required: [true, 'Please provide your addresss'],
    },
    cardDetails: {
      type: String,
    },
    role: {
      type: String,
      default: 'customer',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

customerSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cart',
    select:
      '-__v -productSizes -productImages -productCategory -productDescription',
  });
  next();
});

customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'wishlist',
    select:
      '-__v -productSizes -productImages -productCategory -productDescription',
  });
  next();
});

customerSchema.pre('save', async function (next) {
  //if password hasn't been modified skip to next
  if (!this.isModified('password')) return next();

  //if password was just created or has been modified hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//instance method to check password
customerSchema.methods.checkPassword = async function (
  inputedpassword,
  userpassword
) {
  return await bcrypt.compare(inputedpassword, userpassword);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
