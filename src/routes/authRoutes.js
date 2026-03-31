const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { login, forgotPassword, resetPassword, requestOtp, verifyOtp } = require("../controllers/authController");
const router = express.Router();

// Google Strategy
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
        user = await User.create({
          nama: profile.displayName,
          email: email,
          googleId: profile.id,
          profil: {
            status: "pelajar",
            saldo_awal: 0,
            target_bulanan: 0
          }
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

// Fungsi generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Routes
router.post("/register-request", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Google Auth Routes
router.get("/google", (req, res, next) => {
  const state = req.query.state || 'login';
  passport.authenticate("google", { scope: ["profile", "email"], session: false, state })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google auth error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }

    if (!user) {
      if (info && info.message === 'email_exists') {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=email_exists`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }

    // ✅ Handle success - generate token dan redirect ke frontend
    try {
      const token = generateToken(user._id);
      const isNewUser = user.isNewUserFlag || false;
      
      // Update last_login
      user.last_login = new Date();
      user.save();
      
      // Redirect ke frontend callback handler
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&isNew=${isNewUser}`);
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  })(req, res, next);
});

module.exports = router;
