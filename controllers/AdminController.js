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

const getAppointmentsPerDay = async (req, res) => {};

module.exports = {
  getAppointments,
  getAppointmentsPerDay,
};
