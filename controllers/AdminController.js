const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const DisabledDate = require("../models/DisabledDataModel");
const express = require("express");
const mongoose = require("mongoose");
// const { io } = require("../server");

// const getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find();

//     res.status(201).json({ appointments });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const adminEditAppointment = async (req, res) => {
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
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      console.log("Invalid appointmentId format");
      return res.status(400).json({ message: "Invalid appointmentId format" });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
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

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Failed to update appointment" });
    }

    // Emit the updated appointment to all clients
    io.emit("appointmentUpdated", updatedAppointment);

    res.status(200).json({
      message: "Appointment updated successfully",
      updatedAppointment,
      oldAppointment: appointment,
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminDeleteAppointment = async (req, res) => {
  const { appointmentId } = req.params; // Use req.params to get the appointmentId

  try {
    // Validate the appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      console.log("Invalid appointmentId format");
      return res.status(400).json({ message: "Invalid appointmentId format" });
    }

    // Convert appointmentId to ObjectId
    const objectId = new mongoose.Types.ObjectId(appointmentId);

    // Find and delete the appointment by ID
    const appointment = await Appointment.findByIdAndDelete(objectId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Validate the userId from the appointment
    const userId = appointment.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format");
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the user by userId from the appointment
    const user = await User.findById(userObjectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the appointmentId from the user's appointments array
    user.appointments = user.appointments.filter(
      (id) => id.toString() !== appointmentId
    );

    // Save the updated user document
    await user.save();

    // Emit the deleted appointment to all clients
    global.io.emit("appointmentDeleted", appointment);

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminCreateDisabledDate = async (req, res) => {
  const { date, reason } = req.body;

  try {
    const disabledDate = await DisabledDate.create({ date, reason });

    // Emit the adminCreateDisabledDate
    io.emit("adminCreateDisabledDate", disabledDate);

    res
      .status(201)
      .json({ message: "dates are disabled", disabledDates: disabledDate });
  } catch (err) {
    console.error("Error creating disabled date:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminGetDisabledDates = async (req, res) => {
  try {
    const disabledDates = await DisabledDate.find();

    // Emit the getdisabledDates
    io.emit("adminGetDisabledDate", disabledDates);

    res.status(200).json({ disabledDates });
  } catch (err) {
    console.error("Error fetching disabled dates:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOneAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminEditUserDetails = async (req, res) => {
  const { userId, updateField, updateValue } = req.body; // Add fields for the property to update
  try {
    const user = await User.findById(userId);

    io.emit("admindEditedUserdetails", user);

    if (!user) {
      console.log("No user found");
      return res.status(404).json({ message: "User not found" });
    }

    // Update the specified field
    user[updateField] = updateValue; // Dynamically update the field based on request
    await user.save(); // Save the changes

    res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (err) {
    console.error("Error updating user details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  // getAppointments,
  adminEditAppointment,
  adminDeleteAppointment,
  adminGetAllUsers,
  adminCreateDisabledDate,
  adminGetDisabledDates,
  getOneAppointment,
  adminEditUserDetails,
};
