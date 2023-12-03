const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  vehicleBrand: {
    type: String,
    required: [true, "please enter vehicle brand"],
  },
  vehicleModel: {
    type: String,
    required: [true, "please enter vehicle model"],
  },
  vehicleCategory: {
    type: String,
    required: [true, "please enter vehicle category"],
  },
  registerationNumber: {
    type: String,
    required: [true, "please enter costumer phone number"],
  },
  vehicleOwnerName: {
    type: String,
    required: [true, "please enter vehicle owner name"],
  },
  vehicleChasisNo: {
    type: String,
    required: [true, "please enter vehicle Chasis number"],
  },
  vehicleEngineNo: {
    type: String,
    required: [true, "please enter vehicle engine number"],
  },
  // vehicleInsuranceValidTill: {
  //   type: Date,
  //   required: [true, "please enter vrhicle insurance validity date"],
  // },
  // vehiclePucValidTill: {
  //   type: Date,
  //   required: [true, "please enter vehicle Pollution ceteficate validity date"],
  // },
  // InsuranceImage: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  // PucImage: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  // RcCardImage: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  rentPerDay: {
    type: Number,
    required: [true, "please enter rent per day"],
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  CreatedAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Product", productSchema);
