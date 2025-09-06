// utils/mail.js
import nodemailer from 'nodemailer';

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"OTP Support" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `
        <div style="font-family:sans-serif; padding:20px;">
          <h2>Forgot Password OTP</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #2c3e50;">${otp}</h3>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
