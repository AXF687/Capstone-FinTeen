const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 request per IP
  message: {
    message: "Terlalu banyak percobaan login, coba lagi nanti",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // max 3 akun per jam per IP
  message: {
    message: "Terlalu banyak registrasi, coba lagi nanti",
  },
});