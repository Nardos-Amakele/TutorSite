const express = require("express");
const {
  loginUser,
  logoutUser,
  newAccessToken,
  sendOtp,
  verifyOtp,
  resetPassword,
  handleGoogleCallback
} = require("../controllers/authController");
const { auth } = require("../middlewares/auth.middleware");
const { checkBanStatus } = require("../middlewares/banCheck.middleware");
const { passport } = require("../config/google_Oauth");

const AuthRouter = express.Router();

// Authentication routes
AuthRouter.post("/login", checkBanStatus, loginUser);
AuthRouter.post("/logout", auth, logoutUser);
AuthRouter.get("/refresh-token", auth, newAccessToken);

AuthRouter.post("/otp/send", checkBanStatus, sendOtp);
AuthRouter.post("/otp/verify", verifyOtp);
AuthRouter.post("/reset-password", checkBanStatus, resetPassword);

// Google OAuth routes
AuthRouter.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account" // Forces Google to show account selection screen
  })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
    session: false,
  }),
  handleGoogleCallback
);

module.exports = { AuthRouter }; 