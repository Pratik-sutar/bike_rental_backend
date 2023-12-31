// Creating toke and saving in cookie
const jsonwebtoken = require("jsonwebtoken");
const { options } = require("../routes/vendorRoute");

const sendToken = (user, statusCode, res) => {
  var token = jsonwebtoken.sign(
    { UserId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: 24 * 60 * 60 * 1000,
    }
  );
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
