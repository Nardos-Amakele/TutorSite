const jwt = require('jsonwebtoken');
const { client } = require('../Services/redisClient');
const { newAccessToken } = require('../controllers/authController');
require('dotenv').config();
const { StudentModel } = require("../models/StudentModel");
const { TeacherModel } = require("../models/TeacherModel");

const auth = async (req, res, next) => {
  try {
    // Get tokens from cookies and headers
    const { JAA_access_token, JAA_refresh_token } = req.cookies;
    const access_token = req.headers.authorization?.split(' ')[1] || JAA_access_token;

    if (!access_token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, please login!' 
      });
    }

    // Check if token is blacklisted
    const isTokenBlacklisted = await client.get(access_token);
    if (isTokenBlacklisted) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login again, already logged out' 
      });
    }

    // Verify token
    jwt.verify(
      access_token,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            // Use the existing newAccessToken function
            try {
              if (!JAA_refresh_token) {
                return res.status(401).json({ 
                  success: false, 
                  message: 'Refresh token not found. Please login again.' 
                });
              }

              // Create a mock response object to use with newAccessToken
              const mockRes = {
                cookie: (name, value, options) => {
                  res.cookie(name, value, options);
                },
                status: (code) => ({
                  send: (data) => {
                    if (code === 200 && data.msg === 'Token generated') {
                      // Token was successfully refreshed
                      req.user = {
                        userId: jwt.verify(data.newAccessToken, process.env.JWT_ACCESS_TOKEN_SECRET_KEY).userId
                      };
                      return next();
                    }
                    return res.status(code).json(data);
                  }
                })
              };

              // Call the existing newAccessToken function
              await newAccessToken({ cookies: { JAA_refresh_token } }, mockRes);
            } catch (refreshError) {
              return res.status(500).json({ 
                success: false, 
                message: 'Error refreshing token', 
                error: refreshError.message 
              });
            }
          } else {
            return res.status(401).json({ 
              success: false, 
              message: err.message 
            });
          }
        }

        // Token is valid
        if (payload) {
          // Maintain existing behavior of attaching userId to req.body
          req.body.userId = payload.userId;
          // Also attach to req.user for better organization
          req.user = {
            userId: payload.userId,
            role: payload.role // if role is included in the token
          };
          next();
        } else {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token payload' 
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};

const checkBanStatus = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(); // If no email in request, proceed (for non-login routes)
    }

    // Check both student and teacher models for banned status
    const student = await StudentModel.findOne({ email });
    const teacher = await TeacherModel.findOne({ email });

    const user = student || teacher;
    
    if (user && user.banned) {
      return res.status(403).json({
        success: false,
        message: "This account has been banned. Please contact support for more information."
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking ban status",
      error: error.message
    });
  }
};

module.exports = { auth, checkBanStatus };