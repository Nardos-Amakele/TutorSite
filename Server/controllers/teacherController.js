// File: controllers/teacherController.js
const bcrypt = require("bcrypt");
const { TeacherModel } = require("../models/TeacherModel");
const { BookingModel } = require("../models/BookingModel");
require("dotenv").config();
const {ResourceModel} = require('../models/ResourceModel');


const registerTeacher = async (req, res) => {
    try {
    const { name, email, password, subjects } = req.body;
    if (!name || !email || !password || !subjects)
        return res.status(400).send({ msg: "All fields are required" });

    const exists = await TeacherModel.findOne({ email });
    if (exists) return res.status(400).send({ msg: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new TeacherModel({ name, email, password: hashedPassword, subjects, role: "teacher" });
    await newTeacher.save();

    res.status(201).send({ msg: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const addAvailability = async (req, res) => {
        try {
        const teacherId = req.userId;
        const { date, startTime, endTime } = req.body;
        const dateObj = new Date(date);
        const day = dateObj.toLocaleDateString("en-US", { weekday: "long" })
    
        if (!day || !startTime || !endTime)
            return res.status(400).send({ msg: "day, startTime, and endTime are required" });
    
        const teacher = await TeacherModel.findById(teacherId);
        if (!teacher) return res.status(404).send({ msg: "Teacher not found" });
    
        const exists = teacher.availability.some(
            (slot) => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
        );
    
        if (!exists) {
            teacher.availability.push({ day, startTime, endTime });
            await teacher.save();
        }
    
        res.status(200).send({ msg: "Availability added", availability: teacher.availability });
        } catch (error) {
        res.status(500).send({ msg: error.message });
        }
};


const removeAvailability = async (req, res) => {
        try {
            const teacherId = req.userId;
            const { day, startTime, endTime } = req.body;

            const teacher = await TeacherModel.findById(teacherId);
            if (!teacher) return res.status(404).send({ msg: "Teacher not found" });

            teacher.availability = teacher.availability.filter(
            (slot) => !(slot.day === day && slot.startTime === startTime && slot.endTime === endTime)
            );

            await teacher.save();
            res.status(200).send({ msg: "Availability removed", availability: teacher.availability });
        } catch (error) {
            res.status(500).send({ msg: error.message });
        }
};


const addSubject = async (req, res) => {
    try {
      const teacherId = req.userId;
      const { subjects } = req.body; // Accept an array
  
      const updated = await TeacherModel.findByIdAndUpdate(
        teacherId,
        { $addToSet: { subjects: { $each: subjects } } },
        { new: true }
      );
  
      res.status(200).send({ msg: "Subjects added", teacher: updated });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };

const removeSubject = async (req, res) => {
    try {
      const teacherId = req.userId;
      const { subject } = req.body;
  
      const updated = await TeacherModel.findByIdAndUpdate(
        teacherId,
        { $pull: { subjects: subject } },
        { new: true }
      );
  
      res.status(200).send({ msg: "Subject removed", teacher: updated });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  
const updateProfile = async (req, res) => {
    try {
      const teacherId = req.userId;
      const updates = { ...req.body };
  

      delete updates.attachments;
      delete updates.availability;
      delete updates.bookings;
      delete updates.subjects

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      // ✅ Only update what’s sent, leave other fields untouched
      const updatedTeacher = await TeacherModel.findByIdAndUpdate(
        teacherId,
        { $set: updates },
        { new: true }
      );
  
      res.status(200).send({ msg: "Profile updated", teacher: updatedTeacher });
  
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  

const getBookings = async (req, res) => {
    try {
      const teacherId = req.userId;
      const bookings = await BookingModel.find({ teacher: teacherId })
  
      res.status(200).send({ msg: "Bookings fetched successfully", bookings });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  
const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params.bookingId;
    const confirmedBooking = await BookingModel.findByIdAndUpdate(bookingId, { status: "confirmed" });
    if (!confirmedBooking) return res.status(404).send({ msg: "Booking not found" });
    res.status(200).send({ msg: "Booking confirmed" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params.bookingId;
    const cancelledBooking = await BookingModel.findByIdAndUpdate(bookingId, { status: "cancelled" });
    if (!cancelledBooking) return res.status(404).send({ msg: "Booking not found" });

    res.status(200).send({ msg: "Booking cancelled" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Complete a booking+
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params.bookingId;
    const Completedbooking = await BookingModel.findByIdAndUpdate(bookingId, { status: "completed" });
    if (!Completedbooking) return res.status(404).send({ msg: "Booking not found" });
    res.status(200).send({ msg: "Booking marked as completed" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const addResource = async (req, res) => {
  try {
    const teacherId = req.params.userId;
    const { title, description, subject, link } = req.body;

    if (!title || !link) {
      return res.status(400).send({ msg: "Title and link are required" });
    }

    const newResource = new ResourceModel({
      title,
      description,
      subject,
      link,
      uploadedBy: teacherId
    });

    await newResource.save();
    res.status(201).send({ msg: "Resource added successfully", resource: newResource });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const teacherId = req.params.userId;
    const resourceId = req.params.resourceId;

    const resource = await ResourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).send({ msg: "Resource not found" });
    }

    if (resource.uploadedBy.toString() !== teacherId) {
      return res.status(403).send({ msg: "Not authorized to delete this resource" });
    }

    await Resource.findByIdAndDelete(resourceId);
    res.status(200).send({ msg: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const teacherId = req.params.userId;
    const resources = await ResourceModel.find();

    res.status(200).send({ msg: "Resources fetched successfully", resources });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
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
};
