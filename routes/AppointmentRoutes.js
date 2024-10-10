const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/AppointmentController");
const { verifyToken } = require("../middleware/verifiyToken");

// Register a new user
router.post("/create", verifyToken, AppointmentController.createAppointment);

router.get(
  "/getappointments",
  // verifyToken,
  AppointmentController.getAppointments
);

// Update an existing appointment
router.patch(
  "/usereditappointment",
  // verifyToken,
  AppointmentController.userEditAppointment
);

router.delete(
  "/deleteappointment/:appointmentId",
  verifyToken,
  AppointmentController.deleteAppointment
);

module.exports = router;
