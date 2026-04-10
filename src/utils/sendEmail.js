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