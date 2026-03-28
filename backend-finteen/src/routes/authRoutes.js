const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// 🌟 FIX: Import requestOtp dan verifyOtp menggantikan register
const { login, forgotPassword, resetPassword, googleCallback, requestOtp, verifyOtp } = require("../controllers/authController");
const router = express.Router();

// 🌟 SETUP STRATEGI GOOGLE DENGAN INTENT DETECTOR
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    passReqToCallback: true 
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const intent = req.query.state; 
      const email = profile.emails[0].value;

      let user = await User.findOne({ email });

      if (intent === 'register' && user) {
         return done(null, false, { message: 'email_exists' });
      }

      if (!user) {
        // JIKA USER BARU DIBUAT, TAMBAHKAN FLAG SEMENTARA
        user = await User.create({
          nama: profile.displayName,
          email: email,
          googleId: profile.id,
        });
        user.isNewUserFlag = true; 
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

// 🌟 Endpoint Manual (OTP Menggantikan Register Langsung)
router.post("/register-request", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// 🌟 TANGKAP INTENT DARI FRONTEND
router.get("/google", (req, res, next) => {
  const state = req.query.state || 'login'; // Default ke login
  passport.authenticate("google", { scope: ["profile", "email"], session: false, state })(req, res, next);
});

// 🌟 CUSTOM CALLBACK UNTUK REDIRECT ALERT
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);

    if (!user) {
      if (info && info.message === 'email_exists') {
        // Redirect ke Frontend Login dengan error spesifik
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=email_exists`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }

    // Jika sukses, lanjut ke authController.googleCallback
    req.user = user;
    next();
  })(req, res, next);
}, googleCallback);

module.exports = router;