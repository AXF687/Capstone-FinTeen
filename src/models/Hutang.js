const mongoose = require("mongoose");

const HutangSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  totalPinjaman: {
    type: Number,
    required: true
  },
  bungaTahunan: {
    type: Number,
    required: true
  },
  lamaBulan: {
    type: Number,
    required: true
  },
  cicilanPerBulan: {
    type: Number
  },
  totalBayar: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Hutang", HutangSchema);