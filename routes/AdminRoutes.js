const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyToken } = require("../middleware/verifiyToken");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// Register a new user

// router.get(
//   "/getappointments",
//   verifyToken,
//   adminMiddleware,
//   AdminController.getAppointments
// );

router.get(
  "/getoneappointment/:appointmentId",
  verifyToken,
  AdminController.getOneAppointment
);

router.patch(
  "/admineditappointment/:appointmentId",
  verifyToken,
  adminMiddleware,
  AdminController.adminEditAppointment
);

router.delete(
  "/admindeleteappointment/:appointmentId",
  verifyToken,
  adminMiddleware,
  AdminController.adminDeleteAppointment
);

router.get(
  "/admingetallusers",
  verifyToken,
  adminMiddleware,
  AdminController.adminGetAllUsers
);

router.post(
  "/admincreatedisableddate",
  verifyToken,
  adminMiddleware,
  AdminController.adminCreateDisabledDate
);

router.get(
  "/admingetdisableddates",
  verifyToken,
  // adminMiddleware,
  AdminController.adminGetDisabledDates
);

router.patch(
  "/adminedituserdetails",
  verifyToken,
  adminMiddleware,
  AdminController.adminEditUserDetails
);

module.exports = router;
