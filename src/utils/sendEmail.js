const axios = require('axios');

const sendEmail = async ({ email, subject, message }) => {
  console.log(`📧 Mengirim email ke: ${email} via PHP API`);
  
  try {
    const response = await axios.post(
      'https://kulijowo.com/api/mail/send-email.php',
      { email, subject, message },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EMAIL_API_TOKEN}`
        },
        timeout: 10000
      }
    );
    
    console.log("✅ Email berhasil:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ Error email:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendEmail;
