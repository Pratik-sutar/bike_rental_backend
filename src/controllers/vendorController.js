const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Vendor = require("../models/vendorModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { decodeToken } = require("../middleware/decodeToken");

// Register a vendor

exports.registerVendor = catchAsyncErrors(async (req, res, next) => {
  const {
    vendorName,
    companyName,
    areaOfOperation,
    shopNo,
    areaName,
    landmark,
    city,
    pincode,
    state,
    number,
    email,
    password,
    googleMapsCoOrdinates,
  } = req.body;

  const vendor = await Vendor.create({
    vendorName,
    companyName,
    areaOfOperation,
    shopNo,
    areaName,
    landmark,
    city,
    pincode,
    state,
    number,
    email,
    password,
    googleMapsCoOrdinates,
  });

  const vendorWithoutPassword = { ...vendor._doc };
  delete vendorWithoutPassword.password;

  console.log(vendorWithoutPassword);

  sendToken(vendorWithoutPassword, 200, res);
});

// Login vendor
exports.loginVendor = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking if vendor has given password and email

  if (!email || !password) {
    return next(
      res.status(400).json({
        success: false,
        message: "Please enter email and password",
      })
    );
  }

  const vendor = await Vendor.findOne({ email }).select("+password");

  if (!vendor) {
    return next(
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    );
  }

  const isPasswordMatched = await vendor.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    );
  }

  const vendorWithoutPassword = { ...vendor._doc };
  delete vendorWithoutPassword.password;

  console.log(vendorWithoutPassword);

  sendToken(vendorWithoutPassword, 200, res);
});

// Logout vendor

exports.vendorLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "vendor logged out",
  });
});

// Forgot Password

exports.vendorForgotPassword = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findOne({ email: req.body.email });

  if (!vendor) {
    return next(
      res.status(404).json({
        success: false,
        message: "vendor not found",
      })
    );
  }

  // Get reset password tokens

  const resetToken = vendor.getResetPasswordToken();

  await vendor.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset is :- \n ${resetPasswordUrl} 
                    \n If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: vendor.email,
      subject: "Bike rental Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${vendor.email} successfully`,
    });
  } catch (error) {
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpire = undefined;

    await vendor.save({ validateBeforeSave: false });
    // return next(new ErrorHandler(error.message, 500));
    res.status(500).json({ message: " invalid or has expired" });
  }
});

// Reset password

exports.vendorResetPassword = async (req, res, next) => {
  // creating token hash
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const vendor = await Vendor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!vendor) {
      res
        .status(400)
        .json({ message: "Reset password token is invalid or has expired" });
      // return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.status(400).json({ message: "Password dose not match" });

      // return next(new ErrorHandler("Password dose not match", 400));
    }

    vendor.password = req.body.password;
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpire = undefined;

    await vendor.save();

    sendToken(vendor, 200, res);
  } catch (error) {
    console.log("error is **********", error);
  }
};
// Get vendor details

exports.getVendorDetails = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers.cookies;
  const userData = decodeToken(token);
  const vendor = await Vendor.findById(userData.UserId);

  res.status(200).json({
    success: true,
    vendor,
  });
});

// update vendor password

exports.vendorUpdatePassword = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor.id).select("+password");

  const isPasswordMatched = await vendor.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(
      res.status(400).json({
        success: false,
        message: "Invalid Old password",
      })
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      res.status(400).json({
        success: false,
        message: "Password dose not match",
      })
    );
  }

  vendor.password = req.body.newPassword;

  await vendor.save();

  sendToken(vendor, 200, res);
});

// update vendor Profile

exports.vendorUpdateProfile = catchAsyncErrors(async (req, res, next) => {
  const newVendorData = {
    name: req.body.name,
    email: req.body.email,
  };

  const vendor = await Vendor.findByIdAndUpdate(req.vendor.id, newVendorData, {
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all vendors (admin)
exports.getAllVendors = catchAsyncErrors(async (req, res, next) => {
  const vendors = await Vendor.find();

  res.status(200).json({
    success: true,
    vendors,
  });
});

// Get single vendor (admin)
exports.getSingleVendor = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(
      res.status(400).json({
        success: false,
        message: `vendor does not exist with id ${req.params.id}`,
      })
    );
  }

  res.status(200).json({
    success: true,
    vendor,
  });
});

// update vendor Role --Admin

exports.updateVendorRole = catchAsyncErrors(async (req, res, next) => {
  const newVendorData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await Vendor.findByIdAndUpdate(req.params.id, newVendorData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// Delete Vendor --Admin

exports.deleteVendor = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(
      res.status(400).json({
        success: false,
        message: `Vendor does not exist with id ${req.params.id}`,
      })
    );
  }

  if (vendor.role == "admin") {
    return next(
      res.status(400).json({
        success: false,
        message: "Cannot Delete Admin",
      })
    );
  }

  await vendor.remove();

  res.status(200).json({
    success: true,
    message: "Vendor removed successfully",
  });
});
