const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, sparse: true }, 
    profil: {
      status: { type: String, enum: ["pelajar", "mahasiswa", "pekerja"] },
      saldo_awal: { type: Number, default: 0 },
      target_bulanan: { type: Number, default: 0 },
    },
    last_login: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
