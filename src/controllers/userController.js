const User = require("../models/User");

// get profil
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// update profil
exports.updateProfile = async (req, res) => {
  try {
    const { pemasukan_bulanan, target_bulanan, goal_utama, status } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (pemasukan_bulanan !== undefined) {
      user.profil.pemasukan_bulanan = pemasukan_bulanan;
    }

    if (target_bulanan !== undefined) {
      user.profil.target_bulanan = target_bulanan;
    }

    if (goal_utama !== undefined) {
      user.goal_utama = goal_utama;
    }

    if (status !== undefined) {
      user.profil.status = status;
    }

    await user.save();

    res.json({
      message: "Profile berhasil diperbarui",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};