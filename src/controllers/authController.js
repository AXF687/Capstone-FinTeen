const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//regist
exports.register = async (req, res) => {
  try {
    const { nama, email, password, status } = req.body;

    if (!nama || !email || !password || !status) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      profil: {
        status,
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Register berhasil",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        status: user.profil.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};