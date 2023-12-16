const jwt = require("jsonwebtoken");

exports.decodeToken = (cookies) => {
  const decodedData = jwt.verify(cookies, process.env.JWT_SECRET);
  return decodedData;
};
