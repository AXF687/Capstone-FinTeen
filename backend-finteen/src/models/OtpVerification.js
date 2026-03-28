const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300
  }
});

module.exports = mongoose.model("OtpVerification", OtpSchema);