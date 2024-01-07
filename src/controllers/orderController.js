const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const { decodeToken } = require("../middleware/decodeToken");

// Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers.cookies;
  let userData = decodeToken(token);
  // console.log(userData, "in order controller");
  const {
    vehicleBrand,
    vehicleModel,
    pickupDate,
    dropDate,
    numberOfDays,
    documentNumber,
    documentSubmitted,
    registerationNumber,
    totalOrderAmount,
    customerName,
    customerEmail,
    customerNumber,
    rentPerDay,
    orderStatus,
  } = req.body;

  const order = await Order.create({
    vendor: userData.role === "vendor" ? userData.UserId : req.body.vendor,
    vehicleBrand,
    vehicleModel,
    pickupDate: new Date(pickupDate),
    dropDate: new Date(dropDate),
    numberOfDays,
    documentNumber,
    documentSubmitted,
    registerationNumber,
    totalOrderAmount,
    customerName,
    customerEmail,
    customerNumber,
    rentPerDay,
    orderStatus,
    paidAt: Date.now(),
    user: userData.UserId,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//Get single orders

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found with this id",
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get logged in user orders

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers.cookies;
  // console.log(token, "my order cookie");
  let userData = decodeToken(token);
  const orders = await Order.find({
    $or: [{ user: userData.UserId }, { vendor: userData.UserId }],
  });

  res.status(200).json({
    success: true,
    length: orders.length,
    orders,
  });
});

//Get all orders --Admin

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

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

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers.cookies;
  let userData = decodeToken(token);

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found with this id",
    });
  }
  if (order.orderStatus === "Requested" && userData.role === "vendor") {
    console.log("in vendor confirm order condition");
    order.customerName = req.body.customerName;
    order.customerEmail = req.body.customerEmail;
    order.customerNumber = req.body.customerNumber;
    order.vehicleBrand = req.body.vehicleBrand;
    order.vehicleModel = req.body.vehicleModel;
    order.pickupDate = new Date(req.body.pickupDate);
    order.dropDate = new Date(req.body.dropDate);
    order.numberOfDays = req.body.numberOfDays;
    order.totalOrderAmount = req.body.totalOrderAmount;
    order.documentNumber = req.body.documentNumber;
    order.documentSubmitted = req.body.documentSubmitted;
    order.registerationNumber = req.body.registerationNumber;
    order.orderStatus = "Confirmed";
    order.paidAt = Date.now();
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Requested" && userData.role === "user") {
    console.log("in user condition unconfirmed");
    order.vehicleBrand = req.body.vehicleBrand;
    order.vehicleModel = req.body.vehicleModel;
    order.pickupDate = new Date(req.body.pickupDate);
    order.dropDate = new Date(req.body.dropDate);
    order.numberOfDays = req.body.numberOfDays;
    order.totalOrderAmount = req.body.totalOrderAmount;
    console.log(order, "updated order data");
    console.log(req.body, "recied order data");
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Confirmed" && userData.role === "user") {
    console.log("in user confirmed order condition");
    order.dropDate = new Date(req.body.dropDate);
    order.numberOfDays = req.body.numberOfDays;
    order.totalOrderAmount = req.body.totalOrderAmount;
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Confirmed" && userData.role === "vendor") {
    console.log("in vendor confirmed order condition");
    order.vehicleBrand = req.body.vehicleBrand;
    order.vehicleModel = req.body.vehicleModel;
    order.pickupDate = new Date(req.body.pickupDate);
    order.dropDate = new Date(req.body.dropDate);
    order.numberOfDays = req.body.numberOfDays;
    order.totalOrderAmount = req.body.totalOrderAmount;
    order.documentNumber = req.body.documentNumber;
    order.documentSubmitted = req.body.documentSubmitted;
    order.registerationNumber = req.body.registerationNumber;
    // (order.paidAt = Date.now()),
    console.log(order, "order data");
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  }
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  // console.log(product.stock);

  await product.save({ validateBeforeSave: false });
}

//Delete order --Admin

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found with this id",
    });
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
