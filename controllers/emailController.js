// controllers/emailController.js

const sendEmail = require("../utils/sendEmail");

exports.sendReceiptEmail = async (req, res) => {
  const { email, amount, reference } = req.body;

  const message = `Thank you for your purchase! \n\nPayment Reference: ${reference}\nTotal Amount: ₦${amount / 100}`;

  try {
    await sendEmail(email, "Payment Successful - Bookstore Receipt", message);
    res.status(200).json({ message: "Receipt sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
};
