const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  newAccessToken,
  sendOtp,
  verifyOtp,
  resetPassword,
  handleGoogleCallback
} = require("../controllers/authController");
const { auth, checkBanStatus } = require("../middlewares/authMiddleware");
const {checkRole} = require('../middlewares/upload');

const { passport } = require("../config/google_Oauth");

const AuthRouter = express.Router();

AuthRouter.post("/register/:role", checkRole, registerUser);
AuthRouter.post("/login", checkBanStatus, loginUser);

AuthRouter.post("/logout", auth, logoutUser);
AuthRouter.get("/refresh-token", auth, newAccessToken);

/////////////////////////////////////////////////
AuthRouter.post("/otp/send", checkBanStatus, sendOtp);
AuthRouter.post("/otp/verify", verifyOtp);
AuthRouter.post("/reset-password", checkBanStatus, resetPassword);

///////////////////////////////////////////////////////

AuthRouter.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account" 
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