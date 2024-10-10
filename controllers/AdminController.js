const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const express = require("express");
const mongoose = require("mongoose");

const getAppointments = async (req, res) => {
  console.log("getAppointments");
  try {
    const appointments = await Appointment.find();

    console.log("appointments", appointments);
    res.status(201).json({ appointments });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

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

  console.log("Received data:", req.body);

  try {
    // Validate the appointmentId

    console.log("app id in bacik", appointmentId);
    console.log("app id type in bacik", typeof appointmentId);

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

    res.status(200).json({
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminDeleteAppointment = async (req, res) => {
  const { appointmentId } = req.params; // Use req.params to get the appointmentId
  console.log("apppp iidd back", appointmentId);

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

module.exports = {
  getAppointments,
  adminEditAppointment,
  adminDeleteAppointment,
  adminGetAllUsers,
};
