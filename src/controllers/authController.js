const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const OtpVerification = require("../models/OtpVerification");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper function untuk email dengan timeout
const sendEmailWithTimeout = async (emailOptions, timeoutMs = 10000) => {
  const emailPromise = sendEmail(emailOptions);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout mengirim email')), timeoutMs);
  });
  return Promise.race([emailPromise, timeoutPromise]);
};

exports.requestOtp = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    
    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Validasi Domain Gmail
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Pendaftaran wajib menggunakan akun @gmail.com yang valid!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar. Silakan login." });
    }

    // Generate 6 Digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hapus OTP lama jika ada
    await OtpVerification.findOneAndDelete({ email }); 
    
    // Simpan data pending
    await OtpVerification.create({
      nama,
      email,
      password: hashedPassword,
      otp: otpCode
    });

    // Template email HTML
    const pesanEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
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
          <p style="margin-top: 20px; font-size: 12px; color: #666;">© ${new Date().getFullYear()} FinTeen. All rights reserved.</p>
        </div>
      </div>
    `;

    // Kirim email dengan timeout 10 detik
    await sendEmailWithTimeout({
      email: email,
      subject: "Kode OTP Registrasi FinTeen",
      message: pesanEmail
    });

    res.status(200).json({ message: "OTP berhasil dikirim ke email Anda!" });
    
  } catch (error) {
    console.error("Request OTP Error:", error.message);
    
    // Hapus data OTP yang baru dibuat jika email gagal
    try {
      await OtpVerification.findOneAndDelete({ email: req.body.email });
    } catch (deleteError) {
      console.error("Gagal menghapus OTP:", deleteError.message);
    }
    
    res.status(500).json({ 
      message: "Gagal mengirim OTP. Periksa koneksi email atau coba lagi nanti.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: "Email dan OTP wajib diisi" });
    }

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
      user: { 
        id: user._id, 
        nama: user.nama, 
        email: user.email, 
        profil: user.profil 
      }
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
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
        profil: user.profil 
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  let user;
  
  try {
    user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 menit

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Reset Password FinTeen</h2>
        <p>Halo ${user.nama},</p>
        <p>Kamu meminta untuk mereset password akun FinTeen kamu.</p>
        <p>Klik link di bawah ini untuk membuat password baru:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Atau copy link ini: <a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #ef4444;">⚠️ Link ini hanya berlaku selama 10 menit.</p>
        <p>Jika kamu tidak memintanya, abaikan email ini.</p>
      </div>
    `;

    // Kirim email dengan timeout 10 detik
    await sendEmailWithTimeout({
      email: user.email,
      subject: 'FinTeen - Reset Password',
      message: message
    });

    res.status(200).json({ message: 'Email panduan reset password telah dikirim' });
    
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    
    // Rollback: Hapus token jika email gagal
    if (user) {
      try {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      } catch (saveError) {
        console.error("Gagal rollback token:", saveError.message);
      }
    }
    
    res.status(500).json({ 
      message: 'Gagal mengirim email reset password. Periksa koneksi email atau coba lagi nanti.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kadaluarsa' });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password berhasil diubah. Silakan login dengan password baru.' });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
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

// ✅ EXPORT generateToken DI SINI
module.exports = {
  requestOtp: exports.requestOtp,
  verifyOtp: exports.verifyOtp,
  login: exports.login,
  forgotPassword: exports.forgotPassword,
  resetPassword: exports.resetPassword,
  googleCallback: exports.googleCallback,
  generateToken: generateToken  // ✅ Export generateToken
};
