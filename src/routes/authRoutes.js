const express = require("express");
const passport = require("passport");
// ✅ TAMBAHKAN INI - IMPOR GOOGLESTRATEGY
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Import dari controller
const { 
  login, 
  forgotPassword, 
  resetPassword, 
  requestOtp, 
  verifyOtp 
} = require("../controllers/authController");

// Import generateToken dari controller
const { generateToken } = require("../controllers/authController");

const router = express.Router();

// ✅ SEKARANG GoogleStrategy sudah terdefinisi
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

    try {
      const token = generateToken(user._id);
      const isNewUser = user.isNewUserFlag || false;
      
      user.last_login = new Date();
      user.save();
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&isNew=${isNewUser}`);
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  })(req, res, next);
});

module.exports = router;
