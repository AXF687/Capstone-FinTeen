const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tipe: {
    type: String,
    enum: ["pemasukan", "pengeluaran"],
    required: true
  },
  nominal: {
    type: Number,
    required: true
  },
  kategori: {
    type: String,
    required: true
  },
  catatan: {
    type: String
  },
  tanggal: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);