const PartialOrder = require("../models/partialOrderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create new order
exports.newPartialOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    vendor,
    vehicleBrand,
    vehicleModel,
    pickupDate,
    dropDate,
    numberOfDays,
    totalOrderAmount,
  } = req.body;
  console.log("body");
  const order = await PartialOrder.create({
    vendor,
    vehicleBrand,
    vehicleModel,
    pickupDate,
    dropDate,
    numberOfDays,
    totalOrderAmount,
    user: req.user._id,
  });
  console.log("success");
  res.status(201).json({
    success: true,
    order,
  });
  console.log("success 2");
});

//Get single orders

exports.getSinglePartialOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await PartialOrder.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "PartialOrder not found with this id",
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get logged in user orders

exports.myPartialOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await PartialOrder.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Get all orders --Admin

exports.getAllPartialOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await PartialOrder.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Update order status --Admin

exports.updatePartialOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await PartialOrder.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "PartialOrder not found with this id",
    });
  }

  if (order.orderStatus === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "You have already delivered this order",
    });
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  console.log(product.stock);

  await product.save({ validateBeforeSave: false });
}

//Delete order --Admin

exports.deletePartialOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await PartialOrder.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "PartialOrder not found with this id",
    });
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
