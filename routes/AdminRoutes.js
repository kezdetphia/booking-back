const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyToken } = require("../middleware/verifiyToken");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// Register a new user

router.get(
  "/getappointments",
  verifyToken,
  adminMiddleware,
  AdminController.getAppointments
);

module.exports = router;
