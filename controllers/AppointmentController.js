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
      console.log("Invalid userId format");
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Convert userId to a valid ObjectId using 'new'
    const validUserId = new mongoose.Types.ObjectId(userId);
    console.log("Valid UserId:", validUserId);

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

    await newAppointment.save();
    console.log("NEW APP", newAppointment);

    // Update the User document to include this appointment
    await User.findByIdAndUpdate(
      validUserId,
      { $push: { appointments: newAppointment._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

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
    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOneAppointmentOfOneUser = (req, res) => {
  const { appointmendId } = req.params;

  try {
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  userEditAppointment,
  userEditAppointment,
  getUserAppointments,
  getOneAppointmentOfOneUser,
};
