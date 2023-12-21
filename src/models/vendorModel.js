const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [50, "Length cannot exceed 30 characters"],
  },
  companyName: {
    type: String,
    required: [true, "Please enter your company name"],
  },
  areaOfOperation: {
    type: String,
    required: [true, "Please enter your area of operation"],
  },

  shopNo: {
    type: String,
    required: [true, "Please enter your shop No or building no"],
  },
  areaName: {
    type: String,
    required: [true, "Please enter your road name or area name"],
  },
  landmark: {
    type: String,
    required: [true, "Please enter your landmark"],
  },
  city: {
    type: String,
    required: [true, "Please enter your city"],
  },
  pincode: {
    type: Number,
    required: [true, "Please enter your area pincode"],
  },
  state: {
    type: String,
    required: [true, "Please enter your state"],
  },
  number: {
    type: String,
    required: [true, "Please enter your phone number"],
    maxLength: [10, "Number should be 10 digit only"],
    minLength: [10, "Number should be 10 digit only"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be at least 8 characters long"],
    select: false,
  },
  googleMapsCoOrdinates: {
    type: String,
    required: [true, "Please enter your area of operation"],
  },
  isReomved: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "vendor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
vendorSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Reset Password

vendorSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPassword to vendor Schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("Vendor", vendorSchema);
