const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail', // You can use another service (like SendGrid)
      auth: {
        user: 'yhuteecodes@gmail.com',
        pass: 'fvibayuvamyjvkdq', // Use environment variables for security
      },
    });

    let mailOptions = {
      from: '"Bookstore" uyai bookstore',
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendEmail;
