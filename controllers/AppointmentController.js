const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const express = require("express");
const mongoose = require("mongoose");

const createAppointment = async (req, res) => {
  const { userId, username, email, desc, date, time, length, booked } =
    req.body;

  try {
    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId); // Log invalid userId
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Convert userId to a valid ObjectId using 'new'
    const validUserId = new mongoose.Types.ObjectId(userId);

    const newAppointment = new Appointment({
      userId: validUserId,
      username,
      email,
      desc,
      date,
      time,
      length,
      booked,
    });

    // Save the new appointment
    await newAppointment.save();

    // Update the User document to include this appointment
    const updatedUser = await User.findByIdAndUpdate(
      validUserId,
      { $push: { appointments: newAppointment._id } },
      { new: true }
    );
    await updatedUser.save();

    // Emit the appointment creation event
    io.emit("appointmentCreated", newAppointment);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Error occurred while creating appointment:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res.status(201).json({ appointments });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const userEditAppointment = async (req, res) => {
  const {
    appointmentId,
    date,
    time,
    username,
    length,
    isCancelled,
    booked,
    desc,
    userId,
  } = req.body;

  try {
    // Validate the appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      console.log("Invalid appointmentId format");
      return res.status(400).json({ message: "Invalid appointmentId format" });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the userId matches
    if (appointment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: User ID does not match" });
    }

    // Create an object with the fields to update
    const updateFields = {
      ...(date && { date }),
      ...(time && { time }),
      ...(username && { username }),
      ...(length && { length }),
      ...(isCancelled !== undefined && { isCancelled }),
      ...(booked !== undefined && { booked }),
      ...(desc && { desc }),
      // userId is not updated here since it must match the existing one
    };

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateFields,
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    // Emit the appointment update event
    io.emit("appointmentUpdated", updatedAppointment);

    res.status(200).json({
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserAppointments = async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await Appointment.find({ userId });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    // Emit the appointment get event
    io.emit("appointmentsGet", appointments);

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Checks if user is admin, if so, deletes any appointment.
// If not, user only deletes their own appointment.
// const deleteAppointment = async (req, res) => {
//   const { user } = req; // Assuming user object is attached to the request via the authMiddleware
//   const { appointmentId } = req.params;

//   try {
//     // Admin can delete any appointment
//     if (user.isAdmin === true) {
//       // Correctly check for boolean true
//       console.log("User is admin, proceeding to delete any appointment");

//       const appointment = await Appointment.findByIdAndDelete(appointmentId);

//       if (!appointment) {
//         console.log("Appointment not found for admin");
//         return res.status(404).json({ message: "Appointment not found" });
//       }

//       console.log("Appointment deleted by admin");
//       return res.status(200).json({ message: "Appointment deleted" });
//     }

//     // Regular user can only delete their own appointment
//     console.log(
//       "User is not admin, checking if they can delete their own appointment"
//     );
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       console.log("Appointment not found for user");
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (appointment.userId.toString() !== user._id.toString()) {
//       console.log("User unauthorized to delete this appointment");
//       return res
//         .status(403)
//         .json({ message: "Unauthorized to delete this appointment" });
//     }

//     console.log("Appointment deleted by user");
//     return res
//       .status(200)
//       .json({ message: "Appointment deleted", appointment: appointment });
//   } catch (error) {
//     console.error("Error deleting appointment:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

const deleteAppointment = async (req, res) => {
  const { user } = req; // Assuming user object is attached to the request via the authMiddleware
  const { appointmentId } = req.params;

  try {
    // Only admin can delete any appointment
    if (user.isAdmin !== true) {
      console.log("Unauthorized: User is not an admin");
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admin can delete appointments" });
    }

    console.log("User is admin, proceeding to delete any appointment");

    // Find and delete the appointment
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      console.log("Appointment not found for admin");
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Emit the deleted appointment to all clients
    global.io.emit("appointmentDeleted", appointment);

    console.log("Appointment deleted by admin");
    return res.status(200).json({
      message: "Appointment deleted",
      appointment: appointment, // Return the deleted appointment
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  userEditAppointment,
  userEditAppointment,
  getUserAppointments,

  deleteAppointment,
};
