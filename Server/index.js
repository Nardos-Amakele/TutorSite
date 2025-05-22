// Importing all the required dependencies
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const { Connection } = require("./config/db");

// Import routers
const { AuthRouter } = require("./routes/authRoutes");
const { StudentRouter } = require("./routes/studentRoutes");
const { TeacherRouter } = require("./routes/teacherRoutes");
const { adminRouter } = require("./routes/adminRoutes");

// Import error handling middleware
const { errorHandler } = require("./middlewares/errorMiddleware");

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true, // Allow cookies to be sent with requests
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Session configuration
// app.use(
//   expressSession({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production', 
//       httpOnly: true,
//       sameSite: 'strict',
//       maxAge: 24 * 60 * 60 * 1000, 
//     },
//   })
// );

// API Routes
app.use("/auth", AuthRouter);  // Authentication routes
app.use("/student", StudentRouter);  // Student routes
app.use("/teacher", TeacherRouter);  // Teacher routes
app.use("/admin", adminRouter);  // Admin routes

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "success", 
    message: "Server is running", 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server and connect to database
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await Connection();
    console.log(`Server is running on port ${PORT}`);
    console.log("Connection established to database");
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1); // Exit if database connection fails
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});