const nodemailer = require("nodemailer");
const dns = require("dns");

// ✅ FORCE IPv4 (Railway gak support IPv6)
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  // ✅ TAMBAHKAN INI
  family: 4, // Force IPv4
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false // Karena pakai custom domain
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
