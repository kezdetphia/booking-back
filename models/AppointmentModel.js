const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    length: {
      type: String,
      required: false,
    },
    isCancelled: {
      type: Boolean,
      required: false,
    },
    booked: {
      type: Boolean,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
