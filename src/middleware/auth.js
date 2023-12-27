const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/vendorModel");
const { decodeToken } = require("./decodeToken");

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

exports.authorizeRoles = (roles) => {
  return (req, res, next) => {
    let userData = decodeToken(req.headers.cookies);
    if (roles !== userData.role) {
      return next(
        res.status(403).json({
          message: `Role: ${userData.role} is not allowed to access this resource`,
        })
      );
    }

    next();
  };
};
