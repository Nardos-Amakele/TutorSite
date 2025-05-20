const express = require("express");
const {
  registerStudent,
  searchTeachers,
  getStudentProfile,
  updateStudentProfile,
  bookTeacher,
  cancelBooking,
  completeBooking,
  getTeachers,
  getBookings,
  getResources,
  getAvailableSlots
} = require("../controllers/studentController");
const { auth } = require("../middlewares/auth.middleware");
const { isStudent } = require("../middlewares/role.middleware");

const StudentRouter = express.Router();

// Authentication routes
StudentRouter.post("/register", registerStudent);
StudentRouter.get("/profile", auth, isStudent, getStudentProfile);
StudentRouter.patch("/profile", auth, isStudent, updateStudentProfile);

// Teacher search and booking routes
StudentRouter.get("/teachers", auth, isStudent, getTeachers);
StudentRouter.get("/teachers/search", auth, isStudent, searchTeachers);
StudentRouter.get("/teachers/:userId/slots", auth, isStudent, getAvailableSlots);
StudentRouter.post("/bookings", auth, isStudent, bookTeacher);
StudentRouter.get("/bookings", auth, isStudent, getBookings);
StudentRouter.patch("/bookings/:bookingId/cancel", auth, isStudent, cancelBooking);
StudentRouter.patch("/bookings/:bookingId/complete", auth, isStudent, completeBooking);

// Resource routes
StudentRouter.get("/resources", auth, isStudent, getResources);

module.exports = { StudentRouter };