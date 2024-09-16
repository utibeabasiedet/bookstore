// routes/emailRoutes.js

const express = require("express");
const { sendReceiptEmail } = require("../controllers/emailController");

const router = express.Router();

// Route to send receipt email after successful payment
router.post("/send-receipt", sendReceiptEmail);

module.exports = router;
