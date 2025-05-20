const express = require("express");
const {
  getAllTeachers,
  getAllStudents,
  searchTeachers,
  searchStudents,
  banUserById,
  unbanUserById,
  verifyTeacher,
  removeResource,
  cancelBooking,
  getUserStats,
  viewAllBookings,
  filterBookings
} = require("../controllers/adminController");
const { getResources } = require("../controllers/teacherController");

const { auth } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");


const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.get("/teachers",auth, isAdmin, getAllTeachers);
adminRouter.get("/teachers/search", auth, isAdmin, searchTeachers);
adminRouter.patch("/teachers/:userId/verify", auth, isAdmin, verifyTeacher);

adminRouter.get("/students", auth, isAdmin, getAllStudents);
adminRouter.get("/students/search", auth, isAdmin, searchStudents);

adminRouter.patch("/users/:role/:userId/ban", auth, isAdmin, banUserById);
adminRouter.patch("/users/:role/:userId/unban", auth, isAdmin, unbanUserById);

adminRouter.get("/resources", auth, isAdmin, getResources);
adminRouter.delete("/resources/:userId", auth, isAdmin, removeResource);

adminRouter.get("/bookings", auth, isAdmin, viewAllBookings);
adminRouter.get("/bookings/filter", auth, isAdmin, filterBookings);
adminRouter.patch("/bookings/:userId/cancel", auth, isAdmin, cancelBooking);

adminRouter.get("/stats", auth, isAdmin, getUserStats);

module.exports = { adminRouter };


