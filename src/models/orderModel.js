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
  registerationNumber: {
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
    type: String,
    required: true,
  },
  dropDate: {
    type: String,
    required: true,
  },
  numberOfDays: {
    type: Number,
    min: 1,
    default: 1,
    required: true,
  },
  rentPerDay: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerNumber: {
    type: Number,
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
