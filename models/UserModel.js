const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: false, // Set default value to false
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    usualAppointmentLength: {
      type: String,
      default: 60,
    },
    appointments: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIDs
      ref: "Appointment", // Reference to the Appointment model
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
