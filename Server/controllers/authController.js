const bcrypt = require("bcrypt");
const { generateTokens, verifyRefreshToken, blacklistTokens } = require("../Services/tokenService");
const { sendOtpEmail } = require("../Services/emailService");
const { client } = require("../Services/redisClient");
const { StudentModel } = require("../models/StudentModel");
const jwt = require("jsonwebtoken");
const { TeacherModel } = require("../models/TeacherModel");

const loginUser = async (req, res, Model, roleName) => {
  try {
    const { email, password } = req.body;
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).send({ msg: "Not an existing user, please register" });
    if (user.banned) return res.status(403).send({ msg: "Account is banned" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send({ msg: "Wrong credentials" });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);
    res.status(200).send({ msg: `${roleName} login successful`, accessToken, refreshToken, user });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { JAA_access_token, JAA_refresh_token } = req.cookies;
    await blacklistTokens(JAA_access_token, JAA_refresh_token);
    res.clearCookie("accessToken").clearCookie("refreshToken");
    res.status(200).send({ msg: "Logout successful" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const newAccessToken = async (req, res) => {
  try {
    const { JAA_refresh_token } = req.cookies;
    const newAccessToken = await verifyRefreshToken(JAA_refresh_token);
    if (!newAccessToken) return res.status(401).send({ msg: "Invalid or expired refresh token" });

    res.cookie("accessToken", newAccessToken);
    res.status(200).send({ msg: "Token generated", newAccessToken });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await sendOtpEmail(email);
    await client.setex(`otp:${email}`, 300, otp);
    res.send({ msg: "OTP sent to email" });
  } catch (error) {
    res.status(500).send({ msg: "Error sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = await client.get(`otp:${email}`);
    
    if (!storedOtp || otp !== storedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Store verification status with 15-minute expiry
    await client.setex(`verified:${email}`, 900, email);
    
    // Clear OTP after successful verification
    await client.del(`otp:${email}`);

    res.json({
      success: true,
      message: "OTP verification successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    
    // 1. Verify that OTP was recently verified
    const verifiedEmail = await client.get(`verified:${email}`);
    if (!verifiedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please verify your OTP first"
      });
    }

    // 2. Check both models for the user
    const student = await StudentModel.findOne({ email });
    const teacher = await TeacherModel.findOne({ email });
    const user = student || teacher;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3. Update password
    const newHashedPassword = await bcrypt.hash(password, 10);
    const Model = student ? StudentModel : TeacherModel;
    await Model.findByIdAndUpdate(user._id, { password: newHashedPassword });

    // 4. Clear verification data from Redis
    await client.del(`verified:${email}`);
    await client.del(`otp:${email}`);

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message
    });
  }
};

const handleGoogleCallback = async (req, res) => {
  try {
    const { email, displayName: name, picture: avatar } = req.user;
    
    // Check if user exists
    let user = await StudentModel.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new StudentModel({
        email,
        name,
        avatar,
        role: "student",
        isGoogleAuth: true // Flag to identify Google-authenticated users
      });
      await user.save();
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "4d" }
    );

    // Set cookies with secure options
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000 // 4 days
    });

    // Redirect to dashboard with success message
    res.redirect("/dashboard?auth=success");
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect("/login?error=oauth_failed&message=" + encodeURIComponent(error.message));
  }
};

module.exports = {
  loginUser,
  logoutUser,
  newAccessToken,
  sendOtp,
  verifyOtp,
  resetPassword,
  handleGoogleCallback
};
