const Appointment = require("../models/AppointmentModel");
const express = require("express");
const mongoose = require("mongoose");

const createAppointment = async (req, res) => {
  console.log("aapppppppp");
  const { userId, username, email, desc, date, time, length, booked } =
    req.body;
  console.log("useridddd", userId);
  try {
    console.log("oorerere");

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
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err });
    console.log("errrrrrorrrr");
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

module.exports = {
  createAppointment,
  getAppointments,
};
