const express = require("express");
const {
  registerTeacher,
  addAvailability,
  removeAvailability,
  addSubject,
  removeSubject,
  updateProfile,
  getBookings,
  confirmBooking,
  cancelBooking,
  completeBooking,
  addResource,
  deleteResource,
  getResources
} = require("../controllers/teacherController");
const { auth } = require("../middlewares/auth.middleware");
const { isTeacher } = require("../middlewares/role.middleware");

const TeacherRouter = express.Router();

// Profile management
TeacherRouter.post("/register", registerTeacher);  // No auth needed for registration
TeacherRouter.patch("/profile", auth, isTeacher, updateProfile);

// Availability management
TeacherRouter.post("/availability", auth, isTeacher, addAvailability);
TeacherRouter.delete("/availability", auth, isTeacher, removeAvailability);

// Subject management
TeacherRouter.post("/subjects", auth, isTeacher, addSubject);
TeacherRouter.delete("/subjects", auth, isTeacher, removeSubject);

// Booking management
TeacherRouter.get("/bookings", auth, isTeacher, getBookings);
TeacherRouter.patch("/bookings/:bookingId/confirm", auth, isTeacher, confirmBooking);
TeacherRouter.patch("/bookings/:bookingId/cancel", auth, isTeacher, cancelBooking);
TeacherRouter.patch("/bookings/:bookingId/complete", auth, isTeacher, completeBooking);

// Resource management
TeacherRouter.post("/resources", auth, isTeacher, addResource);
TeacherRouter.delete("/resources/:resourceId", auth, isTeacher, deleteResource);
TeacherRouter.get("/resources", auth, isTeacher, getResources);

module.exports = { TeacherRouter }; 