const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { userName, number, email, password } = req.body;

  const user = await User.create({
    userName,
    number,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking if user has given password and email

  if (!email || !password) {
    return next(
      res.status(400).json({
        success: false,
        message: "Please enter email and password",
      })
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    );
  }

  sendToken(user, 200, res);
});

// Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
});

// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    );
  }

  // Get reset password tokens

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset is :- \n ${resetPasswordUrl} 
                    \n If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "RJ Tech Store Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    // return next(new ErrorHandler(error.message, 500));
    res.status(500).json({ message: " invalid or has expired" });
  }
});

// Reset password

exports.resetPassword = async (req, res, next) => {
  // creating token hash
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Reset password token is invalid or has expired" });
      // return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.status(400).json({ message: "Password dose not match" });

      // return next(new ErrorHandler("Password dose not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.log("error is **********", error);
  }
};
// Get user details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

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

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update user Profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      res.status(400).json({
        success: false,
        message: `User does not exist with id ${req.params.id}`,
      })
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user Role --Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// Delete user --Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      res.status(400).json({
        success: false,
        message: `User does not exist with id ${req.params.id}`,
      })
    );
  }

  if (user.role == "admin") {
    return next(
      res.status(400).json({
        success: false,
        message: "Cannot Delete Admin",
      })
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User removed successfully",
  });
});
