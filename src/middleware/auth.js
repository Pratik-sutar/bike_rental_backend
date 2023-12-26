const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/vendorModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.headers.cookies);
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          message: `Role: ${req.user.role} is not allowed to access this resource`,
        })
      );
    }

    next();
  };
};
