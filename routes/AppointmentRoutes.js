const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/AppointmentController");
const { verifyToken } = require("../middleware/verifiyToken");

// Register a new user
router.post("/create", verifyToken, AppointmentController.createAppointment);
router.get(
  "/getappointments",
  verifyToken,
  AppointmentController.getAppointments
);

// Sign in a user

// router.get("/:id", UserController.getUser);

// router.get("/getuserwithproducts/:id", UserController.getUserWithProducts);

module.exports = router;
