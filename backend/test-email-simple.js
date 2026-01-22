// Simple email test - just test sending without all the checks
// Run: node test-email-simple.js

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 Simple Email Test\n');

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
  console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env');
  process.exit(1);
}

console.log('Using:');
console.log('  User:', emailUser);
console.log('  Password:', emailPassword.substring(0, 15) + '...');
console.log('  Length:', emailPassword.length);
console.log('');

// Create transporter - try different configurations
console.log('Trying port 587 (TLS)...\n');

let transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: emailUser.trim(),
    pass: emailPassword.trim()
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Port 587 failed:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔄 Trying port 465 (SSL)...\n');
      
      // Try port 465 with SSL
      transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 465,
        secure: true, // SSL
        auth: {
          user: emailUser.trim(),
          pass: emailPassword.trim()
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      transporter.verify(function(error2, success2) {
        if (error2) {
          console.error('❌ Port 465 also failed:', error2.message);
          console.error('\n💡 Authentication failed on both ports. Check:');
          console.error('   1. EMAIL_USER is your Brevo login email (the one you use to SIGN IN)');
          console.error('   2. EMAIL_PASSWORD is your SMTP key from Brevo dashboard → SMTP & API → SMTP tab');
          console.error('   3. SMTP key starts with "xsmtpib-" or "xsmtpsib-"');
          console.error('   4. No spaces in EMAIL_PASSWORD (check your .env file)');
          console.error('   5. SMTP key is active in Brevo (not deleted/regenerated)');
          console.error('   6. Your Brevo account is activated for transactional emails');
          console.error('\n📝 Next steps:');
          console.error('   - Go to: https://app.brevo.com/settings/keys/api');
          console.error('   - Click "SMTP" tab');
          console.error('   - Generate a NEW SMTP key');
          console.error('   - Copy it EXACTLY (no spaces)');
          console.error('   - Update .env file and restart server');
        } else {
          console.log('✅ Port 465 (SSL) works!');
          console.log('   Update your .env: EMAIL_PORT=465 and EMAIL_SECURE=true');
          sendTestEmail(transporter);
        }
      });
    } else {
      console.error('\n💡 Connection error. Check your internet/firewall.');
    }
  } else {
    console.log('✅ Connection successful!');
    sendTestEmail(transporter);
  }
});

function sendTestEmail(transporter) {
  console.log('\n📨 Sending test email...');
  
  transporter.sendMail({
    from: `"Beach Point Luxe" <${emailUser}>`,
    to: emailUser,
    subject: 'Test Email - Brevo Configuration',
    text: 'This is a test email from your hotel booking system. If you received this, your email configuration is working!'
  }, (error, info) => {
    if (error) {
      console.error('❌ Send failed:', error.message);
    } else {
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', info.messageId);
      console.log('   Check inbox:', emailUser);
    }
  });
}
