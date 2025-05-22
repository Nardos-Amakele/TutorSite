const express = require("express");
const {
  getProfile,
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
  getResources,
  pendingBookings,
  declineBooking
} = require("../controllers/teacherController");
const { auth } = require("../middlewares/authMiddleware");
const { isTeacher } = require("../middlewares/roleMiddleware");

const TeacherRouter = express.Router();

// Profile management
// TeacherRouter.post("/register", registerTeacher);  // No auth needed for registration
TeacherRouter.get("/profile", auth, isTeacher, getProfile)
TeacherRouter.patch("/profile", auth, isTeacher, updateProfile); //checked!!

TeacherRouter.patch("/availability/add", auth, isTeacher, addAvailability); //checked!!

TeacherRouter.patch("/availability/remove", auth, isTeacher, removeAvailability); //checked!!

// Subject management
TeacherRouter.patch("/subjects/add", auth, isTeacher, addSubject); //checked!!
TeacherRouter.patch("/subjects/remove", auth, isTeacher, removeSubject); //checked!!

// Booking management
TeacherRouter.get("/bookings", auth, isTeacher, getBookings); //checked!!
TeacherRouter.get("/bookings/pending", auth, isTeacher, pendingBookings); //checked!!


TeacherRouter.patch("/bookings/:bookingId/confirm", auth, isTeacher, confirmBooking);
TeacherRouter.patch("/bookings/:bookingId/cancel", auth, isTeacher, cancelBooking);
TeacherRouter.patch("/bookings/:bookingId/complete", auth, isTeacher, completeBooking);
TeacherRouter.delete("/bookings/:bookingId/decline", auth, isTeacher, declineBooking); //checked!!


// Resource management
TeacherRouter.post("/resources/add", auth, isTeacher, addResource); //checked!!
TeacherRouter.delete("/resources/:resourceId", auth, isTeacher, deleteResource); //checked!!
TeacherRouter.get("/resources", auth, isTeacher, getResources); //checked!!

module.exports = { TeacherRouter }; 