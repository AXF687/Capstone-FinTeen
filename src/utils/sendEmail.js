const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  console.log(`📧 Mengirim email ke: ${email}`);
  console.log(`📧 Subject: ${subject}`);

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL, // contoh: onboarding@resend.dev
      to: email,
      subject: subject,
      html: message,
    });

    console.log("✅ Email berhasil dikirim:", response);
    return response;

  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
    throw new Error("Email gagal dikirim");
  }
};

module.exports = sendEmail;
