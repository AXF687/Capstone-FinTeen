const nodemailer = require("nodemailer");

// ✅ WAJIB ADA INI
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // karena pakai 587
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendEmail = async ({ email, subject, message }) => {
  console.log(`📧 Mengirim email ke: ${email}`);

  try {
    const info = await transporter.sendMail({
      from: `"FinTeen" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
    });

    console.log("✅ Email berhasil:", info.response);
    return info;

  } catch (error) {
    console.error("❌ Error email:", error);
    throw error;
  }
};

module.exports = sendEmail;
