const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const OtpVerification = require("../models/OtpVerification"); // 🌟 Model OTP
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.requestOtp = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) return res.status(400).json({ message: "Semua field wajib diisi" });

    // Validasi Domain Gmail
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Pendaftaran wajib menggunakan akun @gmail.com yang valid!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar. Silakan login." });

    // Generate 6 Digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    await OtpVerification.findOneAndDelete({ email }); 
    await OtpVerification.create({
      nama,
      email,
      password: hashedPassword,
      otp: otpCode
    });

    const pesanEmail = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">Verifikasi Akun FinTeen</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Halo <strong>${nama}</strong>,</p>
          <p>Terima kasih telah mendaftar. Untuk menyelesaikan proses pendaftaran, silakan masukkan kode OTP berikut:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #059669; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #ef4444; font-size: 14px;">⚠️ Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun.</p>
        </div>
      </div>
    `;

    await sendEmail({ email: email, subject: "Kode OTP Registrasi FinTeen", message: pesanEmail });

    res.status(200).json({ message: "OTP berhasil dikirim ke email Anda!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email dan OTP wajib diisi" });

    const pendingData = await OtpVerification.findOne({ email, otp });

    if (!pendingData) {
      return res.status(400).json({ message: "Kode OTP salah atau sudah kadaluarsa (lebih dari 5 menit)." });
    }

    const user = await User.create({
      nama: pendingData.nama,
      email: pendingData.email,
      password: pendingData.password,
      profil: {
        status: "pelajar",
        saldo_awal: 0,
        target_bulanan: 0
      }
    });

    await OtpVerification.findByIdAndDelete(pendingData._id);

    const token = generateToken(user._id);

    res.status(201).json({ 
      message: "Register berhasil", 
      token, 
      user: { id: user._id, nama: user.nama, email: user.email, profil: user.profil }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Email tidak ditemukan atau akun terdaftar via Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: "Login berhasil", token, user: { id: user._id, nama: user.nama, email: user.email, profil: user.profil }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email tidak terdaftar" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Halo ${user.nama},\n\nKamu meminta untuk mereset password akun FinTeen kamu.\nSilakan klik link berikut untuk membuat password baru:\n\n${resetUrl}\n\nLink ini hanya berlaku selama 10 menit. Jika kamu tidak memintanya, abaikan email ini.`;

    try {
      await sendEmail({ email: user.email, subject: 'FinTeen - Reset Password', message });
      res.status(200).json({ message: 'Email panduan reset password telah dikirim' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email gagal dikirim. Coba lagi nanti.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kadaluarsa' });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password berhasil diubah. Silakan login dengan password baru.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleCallback = (req, res) => {
  const user = req.user; 
  const token = generateToken(user._id);

  const isNewParam = user.isNewUserFlag ? "&isNew=true" : "";

  user.last_login = new Date();
  user.save();

  res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}${isNewParam}`);
};