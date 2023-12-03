// const instance = require("../server.js");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const crypto = require("crypto")
// const Payment = require("../models/paymentModel");

// exports.checkout = async (req, res) => {
//   const options = {
//     amount: Number(req.body.amount * 100),
//     currency: "INR",
//   };
//   try{
 
//   const order = await instance.instance.orders.create(options);

//   console.log(order);
//   res.status(200).json({
//     success: true,
//     message: "Order created successfully",
//     order,
//   })
//   }
//   catch(err) {
//     console.log(err);
//   }
// };



// exports.paymentVerification = async (req, res) => {
//   try {
    
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     // Database comes here

//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     });

//     res.redirect(
//       `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
//     );
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }

//   } catch (error) {
//     console.log("checkout error", error);
//   }

// };
