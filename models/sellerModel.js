const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'please provide a username'],
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
    bvn: {
      type: Number,
      required: [true, 'Please provide your bvn'],
    },
    accountNumber: {
      type: Number,
      required: [true, 'please provide your account details'],
    },
    bank: {
      type: String,
      required: [true, 'Please tell us the name of your bank'],
    },
    totalAmountInSale: {
      type: Number,
    },
    totalSalesMade: {
      type: Number,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    dateDeactivated: {
      type: Date,
    },
    role: {
      type: String,
      default: 'vendor',
    },
    inventory: [
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

sellerSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

sellerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'inventory',
    select:
      '-__v -productSizes -productImages -productCategory -productDescription',
  });
  next();
});

sellerSchema.pre('save', async function (next) {
  //if password hasn't been modified skip to next
  if (!this.isModified('password')) return next();

  //if password was just created or has been modified hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//instance method to check password
sellerSchema.methods.checkPassword = async function (
  inputedpassword,
  userpassword
) {
  return await bcrypt.compare(inputedpassword, userpassword);
};

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
