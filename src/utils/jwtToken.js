// Creating toke and saving in cookie
const jsonwebtoken = require("jsonwebtoken");
const { options } = require("../routes/vendorRoute");

const sendToken = (user, statusCode, res) => {
  //   const token = user.getJWTToken();

  //   // option for cookie
  //   const option = {
  //     expires: new Date(
  //       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  //     ),
  //     httpOnly: true,
  //   };
  var token = jsonwebtoken.sign(
    { UserId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: 24 * 60 * 60 * 1000,
    }
  );
  // res.status(200).json({ message: "Logged Successfully", data:{access_token: token ,role:results[0].Role}})
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
