const { StudentModel } = require("../models/StudentModel");
const bcrypt = require("bcrypt");
const { TeacherModel } = require("../models/TeacherModel");
const Resource = require('../models/Resource');

const registerStudent = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).send({ msg: "All fields are required" });

    const isUserPresent = await StudentModel.findOne({ email });
    if (isUserPresent) return res.status(400).send({ msg: "Email already taken, try another email or login" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new StudentModel({ name, email, password: hashedPassword, role: "student" });
    await newUser.save();

    res.status(201).send({ msg: "Registration successful", user: newUser });
  } catch (error) {
    res.status(500).send({ error: "Registration failed", msg: error.message });
  }
};

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
    const studentId = req.userId;
    const student = await StudentModel.findById(studentId).select("-password");
    if (!student) return res.status(404).send({ msg: "Student not found" });
    res.status(200).send({ student });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.userId;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await StudentModel.findByIdAndUpdate(studentId, updates, { new: true });
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
    const { teacherId, subject, date, timeSlot } = req.body;
    const studentId = req.params.userId;
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" })

    if (!teacherId || !subject || !date || !timeSlot?.start || !timeSlot?.end) {
      return res.status(400).send({ msg: "Missing required booking information" });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) return res.status(404).send({ msg: "Student not found" });

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) return res.status(404).send({ msg: "Teacher not found or doesn't teach this subject" });

    const conflict = await BookingModel.findOne({
      teacher: teacherId,
      date: new Date(date),
      $or: [
        {
          "timeSlot.start": { $lt: timeSlot.end, $gte: timeSlot.start }
        },
        {
          "timeSlot.end": { $gt: timeSlot.start, $lte: timeSlot.end }
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
      date: new Date(date),
      timeSlot,
      status: "pending",
    });

    await booking.save();

    res.status(200).send({ msg: "Teacher booked successfully", booking });

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
}; 

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
    const studentId = req.params.userId;
    const bookings = await BookingModel.find({ student: studentId })
    res.status(200).send({ msg: "Student bookings fetched", bookings });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getResources = async (req, res) => {
  try {

    const { subject, userId } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;
    if (userId) filter.uploadedBy = userId;

    const resources = await Resource.find(filter)

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

    // 1. Fetch teacher availability
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) return res.status(404).send({ msg: "Teacher not found" });

    const availability = teacher.availability; // array of slots

    // 2. Fetch active bookings for this teacher (pending or confirmed)
    const activeBookings = await BookingModel.find({
      teacher: teacherId,
      status: { $in: ['pending', 'confirmed'] }
    });

    // 3. Filter out availability slots that overlap active bookings
    // We'll build a new array showing availability minus booked periods
    const filteredAvailability = [];

    for (const slot of availability) {
      // Get all bookings on the same day
      const bookingsForDay = activeBookings.filter(booking => {
        // Assuming booking.date is a Date object
        const bookingDay = booking.date.toLocaleDateString('en-US', { weekday: 'long' });
        return bookingDay === slot.day;
      });

      // Start with full slot as available
      let availableSlots = [{ start: slot.startTime, end: slot.endTime }];

      // For each booking on that day, remove overlapping times from availableSlots
      bookingsForDay.forEach(booking => {
        availableSlots = subtractTimeSlot(availableSlots, booking.timeSlot);
      });

      // If any available slots remain after subtracting booked times, add them
      availableSlots.forEach(avail => {
        if (timeIsValid(avail.start, avail.end)) {
          filteredAvailability.push({
            day: slot.day,
            startTime: avail.start,
            endTime: avail.end
          });
        }
      });
    }

    res.status(200).send({ availability: filteredAvailability });

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


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
    registerStudent,
    searchTeachers,
    getStudentProfile,
    updateStudentProfile,
    getResources,
    // rateTeacher,
    cancelBooking,
    getBookings,
    bookTeacher,
    getTeachers,
    completeBooking,
    getAvailableSlots

};

