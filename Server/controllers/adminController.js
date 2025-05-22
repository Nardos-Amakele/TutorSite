const { StudentModel } = require("../models/StudentModel");
const { TeacherModel } = require("../models/TeacherModel");
const { BookingModel } = require("../models/BookingModel");
const { ResourceModel } = require("../models/ResourceModel"); 
const { AdminModel } = require("../models/AdminModel"); 
const bcrypt = require("bcrypt");

const getAdmins = async (req, res) => {
  try { 
    const admins = await TeacherModel.find({ role: "admin" }, '-__v');
    if (!admins) return res.status(404).send({ msg: "No admins found" });
    res.status(200).send({ admins });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find({}, "-password, -__v");
    res.status(200).send({ teachers });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const searchTeachers = async (req, res) => {
    try {
      const { name, email, banned, verified } = req.query;
      const query = {};
  
      if (name) query.name = { $regex: name, $options: "i" };
      if (email) query.email = { $regex: email, $options: "i" };
      if (banned !== undefined) query.banned = banned === "true";
      if (verified !== undefined) query.verified = verified === "true";

      const teachers = await TeacherModel.find(query).select("-password -__v");
      res.status(200).send({ teachers });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  

  const searchStudents = async (req, res) => {
    try {
      const { name, email, banned } = req.query;
      const query = {};
  
      if (name) query.name = { $regex: name, $options: "i" };
      if (email) query.email = { $regex: email, $options: "i" };
      if (banned !== undefined) query.banned = banned === "true";
  
      const students = await StudentModel.find(query).select("-password -__v");
      res.status(200).send({ students });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find({}, "-password -__v");
    res.status(200).send({ students });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const banUserById = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let userModel = role === "teacher" ? TeacherModel : StudentModel;
    const updatedUser = await userModel.findByIdAndUpdate(userId, { banned: true }, { new: true }, );

    if (!updatedUser) return res.status(404).send({ msg: "User not found" });
    res.status(200).send({ msg: `${role} banned successfully`, user: updatedUser });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const unbanUserById = async (req, res) => {
    try {
      const { userId, role } = req.params;
      if (!["student", "teacher"].includes(role)) return res.status(400).send({ msg: "Invalid role" });
  
      const Model = role === "student" ? StudentModel : TeacherModel;
      const user = await Model.findByIdAndUpdate(userId, { banned: false }, { new: true });
  
      if (!user) return res.status(404).send({ msg: "User not found" });
  
      res.status(200).send({ msg: "User unbanned", user });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };

  
const verifyTeacher = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await TeacherModel.findByIdAndUpdate(userId, { verified: true }, { new: true });
    if (!updated) return res.status(404).send({ msg: "Teacher not found" });

    res.status(200).send({ msg: "Teacher verified", teacher: updated });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const removeResource = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await ResourceModel.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).send({ msg: "Resource not found" });

    res.status(200).send({ msg: "Resource removed" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const { userId } = req.params;
    const booking = await BookingModel.findByIdAndUpdate(userId, { status: "cancelled" }, { new: true });
    if (!booking) return res.status(404).send({ msg: "Booking not found" });

    res.status(200).send({ msg: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};



const getUserStats = async (req, res) => {
  try {
    const studentCount = await StudentModel.countDocuments();
    const teacherCount = await TeacherModel.countDocuments();
    const bookingCount = await BookingModel.countDocuments();
    const activeTeachers = await TeacherModel.countDocuments({ verified: true, banned: false });
    const bannedUsers = await StudentModel.countDocuments({ banned: true }) +
                        await TeacherModel.countDocuments({ banned: true });

    res.status(200).send({
      stats: {
        totalStudents: studentCount,
        totalTeachers: teacherCount,
        activeTeachers,
        totalBookings: bookingCount,
        bannedUsers,
      },
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const viewAllBookings = async (req, res) => {
    try {
      const bookings = await BookingModel.find({}, "-__v")
        .populate("teacher", "name email")
        .populate("student", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).send({ bookings });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };


  const filterBookings = async (req, res) => {
    try {
      const { status, date, userId } = req.query;
      const query = {};
  
      if (status) query.status = status;
      if (date) {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setDate(dayEnd.getDate() + 1);
        query.date = { $gte: dayStart, $lt: dayEnd };
      }
      if (userId) query.teacher = userId;
  
      const bookings = await BookingModel.find({query, }, "-__v")
        .populate("teacher", "name email")
        .populate("student", "name email")
        .sort({ date: -1 });
  
      res.status(200).send({ bookings });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  

  
module.exports = {
    // registerAdmin,
    getAdmins,
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
};
