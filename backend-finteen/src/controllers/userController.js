const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

// get profil
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// update profil
exports.updateProfile = async (req, res) => {
  try {
    const { saldo_awal, target_bulanan, status, nama, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (email && email !== user.email) {
      if (user.googleId) {
        return res.status(400).json({ message: "Akun Google tidak dapat merubah email." });
      }
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ message: "Email ini sudah digunakan akun lain!" });
      }
      user.email = email;
    }

    if (nama) {
      user.nama = nama;
    }

    if (!user.profil) {
      user.profil = {};
    }

    if (saldo_awal !== undefined) {
      user.profil.saldo_awal = saldo_awal;

      const existingSaldo = await Transaction.findOne({
        user: user._id,
        catatan: "Catatan Sistem: Saldo Awal"
      });

      if (!existingSaldo && saldo_awal > 0) {
        await Transaction.create({
          user: user._id,
          tipe: "pemasukan",
          nominal: saldo_awal,
          kategori: "Saldo Awal",
          catatan: "Catatan Sistem: Saldo Awal",
          tanggal: new Date()
        });
      }
    }

    if (target_bulanan !== undefined) {
      user.profil.target_bulanan = target_bulanan;
    }

    if (status !== undefined) {
      user.profil.status = status;
    }

    user.goal_utama = undefined; 

    await user.save();

    res.json({
      message: "Profile berhasil diperbarui",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { passwordLama, passwordBaru } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (!user.password) {
      return res.status(400).json({ message: "Akun ini terdaftar via Google. Kamu tidak bisa/perlu mengubah password di sini." });
    }

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password lama kamu salah!" });

    user.password = await bcrypt.hash(passwordBaru, 10);
    await user.save();

    res.json({ message: "Password berhasil diubah!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};