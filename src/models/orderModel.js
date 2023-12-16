const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "Vendor",
    required: true,
  },
  vehicleBrand: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    default: null,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  documentSubmitted: {
    type: String,
    default: null,
  },
  documentNumber: {
    type: String,
    default: null,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dropDate: {
    type: Date,
    required: true,
  },
  numberOfDays: {
    type: Number,
    min: 1,
    default: 1,
    required: true,
  },
  totalOrderAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Requested",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
