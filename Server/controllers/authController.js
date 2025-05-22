const bcrypt = require("bcrypt");
const { generateTokens, verifyRefreshToken, blacklistTokens } = require("../services/tokenService");
const { sendOtpEmail } = require("../services/emailService");
const { client } = require("../services/redisClient");
const { StudentModel } = require("../models/StudentModel");
const { TeacherModel } = require("../models/TeacherModel");
const { AdminModel } = require("../models/AdminModel");
const jwt = require("jsonwebtoken");



const registerUser = async (req, res) => {
  try {
    const { email, password, name, attachments, availability, subjects, hourlyRate, qualification } = req.body;
    const { role } = req.params;

    // Validate role
    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).send({ msg: "Invalid role specified" });
    }

    // Check if user already exists in any model
    const existingStudent = await StudentModel.findOne({ email });
    const existingTeacher = await TeacherModel.findOne({ email });
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingStudent || existingTeacher || existingAdmin) {
      return res.status(400).send({ msg: "User already exists" });
    }

    // Validate teacher attachments
    if (role === "teacher" && (!attachments || attachments.length === 0)) {
      return res.status(400).send({ msg: "Teacher registration requires attachments (certificates/qualifications)" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on role
    let user;
    switch (role) {
      case "student":
        user = new StudentModel({
          email,
          password: hashedPassword,
          name,
          role: "student"
        });
        break;
      case "teacher":
        user = new TeacherModel({
          email,
          password: hashedPassword,
          name,
          qualification,
          role: "teacher",
          attachments, 
          availability: availability || [], 
          subjects: subjects || [],
          hourlyRate: hourlyRate || 0
        });
        break;
      case "admin":
        user = new AdminModel({
          email,
          password: hashedPassword,
          name,
          role: "admin"
        });
        break;
    }

    await user.save();

    // Generate tokens for new user
    const { accessToken, refreshToken } = generateTokens(user._id, user.role, user.email);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    // Set Bearer token in Authorization header
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    res.status(201).send({
      msg: `${role.charAt(0).toUpperCase() + role.slice(1)} registration successful`,
      user: { ...user._doc, password: undefined },
      token: accessToken // Include token in response for client-side storage if needed
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check all user types
    const student = await StudentModel.findOne({ email });
    const teacher = await TeacherModel.findOne({ email });
    const admin = await AdminModel.findOne({ email });
    
    const user = student || teacher || admin;

    if (!user) return res.status(400).send({ msg: "Not an existing user, please register" });
    if (user.banned) return res.status(403).send({ msg: "Account is banned" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send({ msg: "Wrong credentials" });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role, user.email);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    // Set Bearer token in Authorization header
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    res.status(200).send({ 
      msg: "Login successful", 
      user: { ...user._doc, password: undefined },
      token: accessToken // Include token in response for client-side storage if needed
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Get tokens from both cookies and authorization header
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(400).send({ 
        msg: "No tokens found. You might already be logged out." 
      });
    }

    // Blacklist the tokens
    await blacklistTokens(accessToken, refreshToken);

    // Clear the cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    
    res.status(200).send({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ msg: "Error during logout" });
  }
};

const newAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const newAccessToken = await verifyRefreshToken(refreshToken);
    if (!newAccessToken) return res.status(401).send({ msg: "Invalid or expired refresh token" });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
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
    const admin = await AdminModel.findOne({ email});

    const user = student || teacher || admin;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3. Update password
    const newHashedPassword = await bcrypt.hash(password, 10);
    const Model = student ? StudentModel : teacher ? TeacherModel : admin ? AdminModel : null;
    
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
    
    // Check all user types
    let user = await StudentModel.findOne({ email }) || 
               await TeacherModel.findOne({ email }) || 
               await AdminModel.findOne({ email });
    
    let role = "student"; // default role
    let Model = StudentModel; // default model
    
    if (!user) {
      // Determine which model to use based on email domain or other logic
      // For now, defaulting to StudentModel, but you can modify this logic
      Model = StudentModel;
      role = "student";
      
      // Create new user if doesn't exist
      user = new Model({
        email,
        name,
        avatar,
        role,
        isGoogleAuth: true
      });
      await user.save();
    } else {
      // If user exists, determine their role
      if (user instanceof StudentModel) {
        role = "student";
        Model = StudentModel;
      } else if (user instanceof TeacherModel) {
        role = "teacher";
        Model = TeacherModel;
      } else if (user instanceof AdminModel) {
        role = "admin";
        Model = AdminModel;
      }
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role },
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

    // Redirect to appropriate dashboard based on role
    res.redirect(`/${role}/dashboard?auth=success`);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect("/login?error=oauth_failed&message=" + encodeURIComponent(error.message));
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  newAccessToken,
  sendOtp,
  verifyOtp,
  resetPassword,
  handleGoogleCallback,
  registerUser
};
