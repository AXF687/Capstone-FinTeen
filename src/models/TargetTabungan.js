const mongoose = require("mongoose");

const TargetTabunganSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  namaTarget: {
    type: String,
    required: true
  },
  nominalTarget: {
    type: Number,
    required: true
  },
  targetBulan: {
    type: Number,
    required: true
  },
  tabunganSekarang: {
    type: Number,
    default: 0
  },
  perBulan: {
    type: Number
  },
  status: {
    type: String,
    enum: ["realistis", "tidak realistis", "tercapai"]
  }
}, { timestamps: true });

module.exports = mongoose.model("TargetTabungan", TargetTabunganSchema);