// models/DisabledDate.js
const mongoose = require("mongoose");

const DisabledDateSchema = new mongoose.Schema({
  date: {
    type: [String], // Store dates as strings in 'YYYY-MM-DD' format
    required: true,
    unique: true, // Ensure each date is unique
  },
  reason: {
    type: String, // Optional field to store the reason for disabling the date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DisabledDate", DisabledDateSchema);
