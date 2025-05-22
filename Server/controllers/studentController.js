const { StudentModel } = require("../models/StudentModel");
const bcrypt = require("bcrypt");
const { TeacherModel } = require("../models/TeacherModel");
const Resource = require('../models/ResourceModel');
const { BookingModel } = require("../models/BookingModel");


const searchTeachers = async (req, res) => {
  try {
    const { subject, name, verified, qualification } = req.query;
    const filter = {};

    if (subject) filter.subjects = { $regex: subject, $options: "i" };
    if (name) filter.name = { $regex: name, $options: "i" };
    if (verified !== undefined) filter.isVerified = verified === "true";
    if (qualification) filter["profile.qualifications"] = { $in: [qualification] };

    const teachers = await TeacherModel.find(filter).select("-password");
    res.status(200).send({ msg: "Filtered teachers fetched", teachers });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.body.userId;
    const student = await StudentModel.findById(studentId).select("-password");
    if (!student) return res.status(404).send({ msg: "Student not found" });
    res.status(200).send({ student });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.body.userId;
    const updates = req.body;

    if (!studentId) {
      return res.status(400).send({ msg: "Student ID is required" });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await StudentModel.findByIdAndUpdate(studentId, updates, { new: true });
    
    if (!updated) {
      return res.status(404).send({ msg: "Student not found" });
    }

    res.status(200).send({ msg: "Profile updated", student: updated });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Rate a teacher
// const rateTeacher = async (req, res) => {
//   try {
//     const { teacherId, rating, comment } = req.body;
//     const studentId = req.userId;

//     const teacher = await TeacherModel.findById(teacherId);
//     if (!teacher) return res.status(404).send({ msg: "Teacher not found" });

//     teacher.ratings = teacher.ratings || [];
//     teacher.ratings.push({
//       student: studentId,
//       rating,
//       comment,
//       date: new Date()
//     });

//     await teacher.save();
//     res.status(200).send({ msg: "Rating submitted" });
//   } catch (error) {
//     res.status(500).send({ msg: error.message });
//   }
// };



const bookTeacher = async (req, res) => {
  try {
    const { teacherId, subject, date, startTime, endTime } = req.body;
    const studentId = req.body.userId;
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    // Validate required fields
    if (!teacherId || !subject || !date || !startTime || !endTime) {
      return res.status(400).send({ msg: "Missing required booking information" });
    }

    // Validate date is not in the past
    if (dateObj < new Date()) {
      return res.status(400).send({ msg: "Cannot book for past dates" });
    }

    // Validate time format
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send({ msg: "Invalid time format. Use HH:MM format (24-hour)" });
    }
    if (start >= end) {
      return res.status(400).send({ msg: "startTime must be before endTime" });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) return res.status(404).send({ msg: "Student not found" });

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) return res.status(404).send({ msg: "Teacher not found" });

    // Verify teacher teaches the subject
    if (!teacher.subjects.includes(subject)) {
      return res.status(400).send({ msg: "Teacher does not teach this subject" });
    }

    // Check for booking conflicts
    const conflict = await BookingModel.findOne({
      teacher: teacherId,
      date: dateObj,
      status: { $in: ["pending", "confirmed"] }, // Only check against active bookings
      $or: [
        {
          "timeSlot.start": { $lt: endTime, $gte: startTime }
        },
        {
          "timeSlot.end": { $gt: startTime, $lte: endTime }
        }
      ]
    });

    if (conflict) {
      return res.status(400).send({ msg: "Teacher already booked for this time slot" });
    }

    const booking = new BookingModel({
      student: studentId,
      teacher: teacherId,
      subject,
      day: dayOfWeek,
      date: dateObj,
      timeSlot: {
        start: startTime,
        end: endTime
      },
      status: "pending",
    });

    await booking.save();

    res.status(201).send({ 
      msg: "Teacher booked successfully", 
      booking: {
        id: booking._id,
        subject: booking.subject,
        date: booking.date.toISOString(),
        timeSlot: booking.timeSlot,
        status: booking.status,
        teacherName: teacher.name,
        teacherEmail: teacher.email
      }
    });

  } catch (error) {
    console.error("Error in bookTeacher:", error);
    res.status(500).send({ msg: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const studentId = req.body.userId;
    const { bookingId } = req.params;

    const booking = await BookingModel.findOne({ 
      _id: bookingId,
      student: studentId,
      status: { $in: ["pending", "confirmed"] } 
    });

    if (!booking) {
      return res.status(404).send({ 
        msg: "Booking not found or not authorized to cancel" 
      });
    }

    const cancelledBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    ).populate("teacher", "name email");

    res.status(200).send({ 
      msg: "Booking cancelled",
      booking: {
        id: cancelledBooking._id,
        subject: cancelledBooking.subject,
        date: cancelledBooking.date.toISOString(),
        timeSlot: cancelledBooking.timeSlot,
        teacherName: cancelledBooking.teacher?.name || "Unknown",
        teacherEmail: cancelledBooking.teacher?.email || "N/A",
        status: cancelledBooking.status
      }
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    res.status(500).send({ msg: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const studentId = req.body.userId;
    const { bookingId } = req.params;

    // Verify booking exists and belongs to student
    const booking = await BookingModel.findOne({ 
      _id: bookingId,
      student: studentId,
      status: "confirmed" // Can only complete confirmed bookings
    });

    if (!booking) {
      return res.status(404).send({ 
        msg: "Booking not found or not authorized to complete" 
      });
    }

    const completedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: "completed" },
      { new: true }
    ).populate("teacher", "name email");

    res.status(200).send({ 
      msg: "Booking marked as completed",
      booking: {
        id: completedBooking._id,
        subject: completedBooking.subject,
        date: completedBooking.date.toISOString(),
        timeSlot: completedBooking.timeSlot,
        teacherName: completedBooking.teacher?.name || "Unknown",
        teacherEmail: completedBooking.teacher?.email || "N/A",
        status: completedBooking.status
      }
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


const getTeachers = async (req, res) => {
  try {
    
    const teachers = await TeacherModel.find({}, "-password")
    res.status(200).send({ msg: "Teachers fetched", teachers });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const studentId = req.body.userId;
    
    if (!studentId) {
      return res.status(400).send({ msg: "Student ID is required" });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    // Get all bookings except declined ones (since they're deleted)
    const bookings = await BookingModel.find({ 
      student: studentId,
      status: { $in: ["pending", "confirmed", "completed", "cancelled"] }
    })
    .populate("teacher", "name email")
    .sort({ date: 1 });

    res.status(200).send({ 
      msg: "Student bookings fetched successfully",
      bookings: bookings.map(booking => ({
        id: booking._id,
        subject: booking.subject,
        date: booking.date.toISOString(),
        timeSlot: {
          start: booking.timeSlot.start,
          end: booking.timeSlot.end
        },
        teacherName: booking.teacher?.name || "Unknown",
        teacherEmail: booking.teacher?.email || "N/A",
        status: booking.status
      }))
    });
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).send({ 
      msg: "Error fetching bookings", 
      error: error.message 
    });
  }
};

const getResources = async (req, res) => {
  try {

    const { subject, userId } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;
    if (userId) filter.uploadedBy = userId;

    const resources = await Resource.ResourceModel.find(filter)

    res.status(200).send({msg: "Resources fetched sucessfully.", Resources: resources });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};






/****************************************************
 *  Needs a second Check
*****************************************************/
const getAvailableSlots = async (req, res) => {
  try {
    const teacherId = req.params.userId;
    const { date } = req.query;

    // 1. Fetch teacher availability
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) return res.status(404).send({ msg: "Teacher not found" });

    let availability = teacher.availability;
    let targetDay;
    let formattedDate = null;

    // 2. If date is provided, filter availability by day
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).send({ msg: "Invalid date format" });
      }
      targetDay = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      formattedDate = dateObj.toISOString().split("T")[0]; // e.g., "2025-05-22"

      // Filter for the specific day
      availability = availability.filter(slot => slot.day === targetDay);
    }

    // 3. Get active bookings (filtered by date if given)
    const activeBookings = await BookingModel.find({
      teacher: teacherId,
      status: { $in: ["pending", "confirmed"] },
      ...(date && { date: new Date(date) })
    });

    // 4. Filter out overlapping slots
    const filteredAvailability = [];

    for (const slot of availability) {
      const bookingsForDay = activeBookings.filter(booking => {
        const bookingDay = booking.date.toLocaleDateString('en-US', { weekday: 'long' });
        return bookingDay === slot.day;
      });

      let availableSlots = [{ start: slot.startTime, end: slot.endTime }];

      bookingsForDay.forEach(booking => {
        availableSlots = subtractTimeSlot(availableSlots, booking.timeSlot);
      });

      availableSlots.forEach(avail => {
        if (timeIsValid(avail.start, avail.end)) {
          filteredAvailability.push({
            day: slot.day,
            date: formattedDate, // Add date field here
            startTime: avail.start,
            endTime: avail.end
          });
        }
      });
    }

    res.status(200).send({
      msg: "Available slots fetched successfully",
      availability: filteredAvailability,
      subjects: teacher.subjects,
      teacherId: teacherId

    });

  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    res.status(500).send({ msg: error.message });
  }
};

// Utility functions (unchanged)
function subtractTimeSlot(availableSlots, bookedSlot) {
  const result = [];

  availableSlots.forEach(slot => {
    if (bookedSlot.end <= slot.start || bookedSlot.start >= slot.end) {
      result.push(slot);
    } else {
      if (bookedSlot.start > slot.start) {
        result.push({ start: slot.start, end: bookedSlot.start });
      }
      if (bookedSlot.end < slot.end) {
        result.push({ start: bookedSlot.end, end: slot.end });
      }
    }
  });

  return result;
}

function timeIsValid(start, end) {
  return start < end;
}


module.exports = {
  getStudentProfile,
  updateStudentProfile,
  searchTeachers,
  bookTeacher,
  cancelBooking,
  completeBooking,
  getTeachers,
  getBookings,
  getResources,
  getAvailableSlots

};

