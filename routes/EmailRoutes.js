const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifiyToken");
const EmailController = require("../controllers/EmailController");

router.post("/send-email", EmailController.emailSend);

module.exports = router;
