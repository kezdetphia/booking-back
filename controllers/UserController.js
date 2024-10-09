const User = require("../models/UserModel");
const Appointment = require("../models/AppointmentModel");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const signUp = async (req, res) => {
  const { username, email, password, passwordRepeat, phoneNumber } = req.body;
  try {
    console.log("Checking if user exists...");
    const isExistingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    console.log("Existing user check result:", isExistingUser);

    if (isExistingUser) {
      if (isExistingUser.email === email) {
        console.log("Email already exists");
        return res.status(400).json({ message: "Email already exists" });
      }
      if (isExistingUser.username === username) {
        console.log("Username already exists");
        return res.status(400).json({ message: "Username already exists" });
      }
      if (isExistingUser.phoneNumber === phoneNumber) {
        console.log("Phone number already exists");
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    if (password.length < 6) {
      console.log("Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    } else if (password !== passwordRepeat) {
      console.log("Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating new user...");
    const newUser = new User({
      phoneNumber,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in signUp:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      console.log("Password is incorrect for user:", email);
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Optional: Set token expiration time
    );

    // Ensure user._doc exists and destructure safely
    const {
      __v,
      updatedAt,
      password: userPassword,
      ...userData
    } = user._doc || {};
    console.log("User authenticated successfully:", userData);

    res
      .status(200)
      .json({ userData: { ...userData }, token, message: "Successful login" });
  } catch (err) {
    console.error("Server error during signIn:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).populate("conversations");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUserAppointments = async (req, res) => {
  const { userId } = req.params;
  console.log("Received userId:", userId);

  try {
    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format");
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Convert userId to a valid ObjectId
    const validUserId = new mongoose.Types.ObjectId(userId);

    // Query by userId
    const appointments = await Appointment.find({ userId: validUserId });

    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for userId:", userId);
      return res.status(404).json({ message: "No appointments found" });
    }

    console.log("Found appointments:", appointments);
    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signUp,
  signIn,
  getUser,
  getUserAppointments,
};
