const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
  console.log(`📧 Mencoba mengirim email ke: ${options.email}`);
  console.log(`📧 Subject: ${options.subject}`);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // false untuk port 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    family: 4,
    tls: {
      rejectUnauthorized: false // Bypass SSL validation
    }
  });

  const isHtml = options.message && options.message.includes('<') && options.message.includes('>');

  const message = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    ...(isHtml ? { html: options.message } : { text: options.message })
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`✅ Email berhasil dikirim ke ${options.email}`);
    return info;
  } catch (error) {
    console.error(`❌ Gagal mengirim email:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;
