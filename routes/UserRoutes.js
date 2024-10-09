const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../middleware/verifiyToken");

// Register a new user
router.post("/signup", UserController.signUp);

// Sign in a user
router.post("/signin", UserController.signIn);

router.get("/getuserappointments/:userId", UserController.getUserAppointments);

// router.get("/:id", UserController.getUser);

// router.get("/getuserwithproducts/:id", UserController.getUserWithProducts);

module.exports = router;
