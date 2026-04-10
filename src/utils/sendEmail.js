const https = require('https');
const http = require('http');

const sendEmail = async ({ email, subject, message }) => {
  console.log(`📧 Mengirim email ke: ${email} via PHP API`);
  
  return new Promise((resolve, reject) => {
    const url = new URL('https://kulijowo.com/api/mail/send-email.php');
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_TOKEN}`
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("✅ Email berhasil:", response);
            resolve(response);
          } else {
            console.error("❌ Error email:", response);
            reject(new Error(response.error || 'Failed to send email'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error("❌ Error email:", error);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(JSON.stringify({ email, subject, message }));
    req.end();
  });
};

module.exports = sendEmail;
