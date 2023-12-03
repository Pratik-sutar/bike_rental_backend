const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res,next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  // console.log(err, "error is ");

  // wrong mongodb id error
  if (err.name === "Cast") {
    const message = `Resource not found. invalid mongodb : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate user
  if (err.code === 11000) {
    const message = ` ${Object.keys(err.keyValue)} already exist`;

    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "jsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expire error
  if (err.name === "TokenExpireError") {
    const message = ` token has expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
