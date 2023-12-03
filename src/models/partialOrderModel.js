const mongoose = require("mongoose");

const partialOrderSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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
    required: true,
    min: 1,
    default: 1,
  },
  totalOrderAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PartialOrder", partialOrderSchema);
