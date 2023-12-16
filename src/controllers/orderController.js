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
  let { token } = req.cookies;
  let userData = decodeToken(token);
  console.log(userData);
  const {
    vendor,
    vehicleBrand,
    vehicleModel,
    pickupDate,
    dropDate,
    numberOfDays,
    documentNumber,
    documentSubmitted,
    vehicleNumber,
    totalOrderAmount,
  } = req.body;

  const order = await Order.create({
    vendor,
    vehicleBrand,
    vehicleModel,
    pickupDate,
    dropDate,
    numberOfDays,
    documentNumber,
    documentSubmitted,
    vehicleNumber,
    totalOrderAmount,
    paidAt: Date.now(),
    user: userData.id,
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
  let { token } = req.cookies;
  let userData = decodeToken(token);
  // console.log(userData);
  const orders = await Order.find({
    $or: [{ user: userData.id }, { vendor: userData.id }],
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
  let { token } = req.cookies;
  let userData = decodeToken(token);
  const order = await Order.findById(req.params.id);
  const user = await User.findById(userData.id);
  const vendor = await Vendor.findById(userData.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found with this id",
    });
  }
  //  else {
  //   switch (true) {
  //     case order.orderStatus == "Requested" && vendor:
  //       console.log("in vendor confirm order condition");
  //       (order.vehicleBrand = req.body.vehicleBrand),
  //         (order.vehicleModel = req.body.vehicleModel),
  //         (order.pickupDate = req.body.pickupDate),
  //         (order.dropDate = req.body.dropDate),
  //         (order.numberOfDays = req.body.numberOfDays),
  //         (order.totalOrderAmount = req.body.totalOrderAmount),
  //         (order.documentNumber = req.body.documentNumber),
  //         (order.documentSubmitted = req.body.documentSubmitted),
  //         (order.vehicleNumber = req.body.vehicleNumber),
  //         (order.orderStatus = "Confirmed"),
  //         (order.paidAt = Date.now());
  //       await order.save({ validateBeforeSave: false });
  //       res.status(200).json({
  //         success: true,
  //       });
  //       break;

  //     case order.orderStatus == "Requested" && user:
  //       console.log("in user condition");
  //       (order.vehicleBrand = req.body.vehicleBrand),
  //         (order.vehicleModel = req.body.vehicleModel),
  //         (order.pickupDate = req.body.pickupDate),
  //         (order.dropDate = req.body.dropDate),
  //         (order.numberOfDays = req.body.numberOfDays),
  //         (order.totalOrderAmount = req.body.totalOrderAmount),
  //         await order.save({ validateBeforeSave: false });
  //       res.status(200).json({
  //         success: true,
  //       });
  //       break;

  //     case order.orderStatus == "Confirmed" && user:
  //       console.log("in user confirmed order condition");
  //       (order.dropDate = req.body.dropDate),
  //         (order.numberOfDays = req.body.numberOfDays),
  //         (order.totalOrderAmount = req.body.totalOrderAmount),
  //         await order.save({ validateBeforeSave: false });
  //       res.status(200).json({
  //         success: true,
  //       });
  //       break;

  //     case order.orderStatus == "Confirmed" && vendor:
  //       console.log("in vendor confirmed order condition");
  //       (order.vehicleBrand = req.body.vehicleBrand),
  //         (order.vehicleModel = req.body.vehicleModel),
  //         (order.pickupDate = req.body.pickupDate),
  //         (order.dropDate = req.body.dropDate),
  //         (order.numberOfDays = req.body.numberOfDays),
  //         (order.totalOrderAmount = req.body.totalOrderAmount),
  //         (order.documentNumber = req.body.documentNumber),
  //         (order.documentSubmitted = req.body.documentSubmitted),
  //         (order.vehicleNumber = req.body.vehicleNumber),
  //         // (order.paidAt = Date.now()),
  //         await order.save({ validateBeforeSave: false });
  //       res.status(200).json({
  //         success: true,
  //       });
  //       break;
  //   }
  // }

  if (order.orderStatus === "Requested" && vendor) {
    console.log("in vendor confirm order condition");
    (order.vehicleBrand = req.body.vehicleBrand),
      (order.vehicleModel = req.body.vehicleModel),
      (order.pickupDate = req.body.pickupDate),
      (order.dropDate = req.body.dropDate),
      (order.numberOfDays = req.body.numberOfDays),
      (order.totalOrderAmount = req.body.totalOrderAmount),
      (order.documentNumber = req.body.documentNumber),
      (order.documentSubmitted = req.body.documentSubmitted),
      (order.vehicleNumber = req.body.vehicleNumber),
      (order.orderStatus = "Confirmed"),
      (order.paidAt = Date.now());
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Requested" && user) {
    console.log("in user condition");
    (order.vehicleBrand = req.body.vehicleBrand),
      (order.vehicleModel = req.body.vehicleModel),
      (order.pickupDate = req.body.pickupDate),
      (order.dropDate = req.body.dropDate),
      (order.numberOfDays = req.body.numberOfDays),
      (order.totalOrderAmount = req.body.totalOrderAmount),
      await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Confirmed" && user) {
    console.log("in user confirmed order condition");
    (order.dropDate = req.body.dropDate),
      (order.numberOfDays = req.body.numberOfDays),
      (order.totalOrderAmount = req.body.totalOrderAmount),
      await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } else if (order.orderStatus === "Confirmed" && vendor) {
    console.log("in vendor confirmed order condition");
    (order.vehicleBrand = req.body.vehicleBrand),
      (order.vehicleModel = req.body.vehicleModel),
      (order.pickupDate = req.body.pickupDate),
      (order.dropDate = req.body.dropDate),
      (order.numberOfDays = req.body.numberOfDays),
      (order.totalOrderAmount = req.body.totalOrderAmount),
      (order.documentNumber = req.body.documentNumber),
      (order.documentSubmitted = req.body.documentSubmitted),
      (order.vehicleNumber = req.body.vehicleNumber),
      // (order.paidAt = Date.now()),
      await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  }
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  console.log(product.stock);

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
