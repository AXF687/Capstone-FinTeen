const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(`📧 Mencoba mengirim email ke: ${options.email}`);
  console.log(`📧 Subject: ${options.subject}`);
  
  // Validasi environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error("❌ SMTP environment variables missing!");
    throw new Error("Konfigurasi SMTP tidak lengkap");
  }
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true untuk port 465
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000, // 10 detik timeout koneksi
    greetingTimeout: 10000,   // 10 detik timeout greeting
  });

  // Cek apakah message berupa HTML
  const isHtml = options.message && options.message.includes('<') && options.message.includes('>');

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    ...(isHtml ? { html: options.message } : { text: options.message })
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`✅ Email berhasil dikirim ke ${options.email}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Gagal mengirim email ke ${options.email}:`, error.message);
    throw new Error(`Email gagal dikirim: ${error.message}`);
  }
};

module.exports = sendEmail;
