const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

// config
dotenv.config({ path: "src/config/config.env" });
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Route Imports
const product = require("./routes/productRoute");
const partialOrder = require("./routes/partialOrderRoute");
const vendor = require("./routes/vendorRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", vendor);
app.use("/api/v1", user);
app.use("/api/v1", partialOrder);
app.use("/api/v1", order);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
