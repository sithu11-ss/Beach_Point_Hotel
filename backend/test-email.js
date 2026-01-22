// Quick test script to verify Brevo email configuration
// Run: node test-email.js

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('🧪 Testing Brevo Email Configuration...\n');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  console.log('Configuration:');
  console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
  console.log('  EMAIL_USER:', emailUser);
  console.log('  EMAIL_USER length:', emailUser ? emailUser.length : 0);
  console.log('  EMAIL_PASSWORD:', emailPassword ? `${emailPassword.substring(0, 20)}...` : 'NOT SET');
  console.log('  EMAIL_PASSWORD length:', emailPassword ? emailPassword.length : 0);
  console.log('  EMAIL_PASSWORD starts with:', emailPassword ? emailPassword.substring(0, 10) : 'N/A');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || '587');
  console.log('  EMAIL_SECURE:', process.env.EMAIL_SECURE || 'false');
  console.log('');
  
  // Check for common issues
  if (emailPassword && !emailPassword.startsWith('xsmtp')) {
    console.warn('⚠️  WARNING: SMTP key should start with "xsmtpib-" or "xsmtpsib-"');
  }
  if (emailPassword && emailPassword.length < 50) {
    console.warn('⚠️  WARNING: SMTP key seems too short (should be ~80+ characters)');
  }
  if (emailUser && emailUser.includes(' ')) {
    console.warn('⚠️  WARNING: EMAIL_USER contains spaces - this might cause issues');
  }
  if (emailPassword && emailPassword.includes(' ')) {
    console.warn('⚠️  WARNING: EMAIL_PASSWORD contains spaces - this will cause authentication to fail!');
  }
  console.log('');
  
  if (!emailUser || !emailPassword) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASSWORD in .env file');
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: emailUser.trim(),
        pass: emailPassword.trim()
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    console.log('📧 Attempting to connect to Brevo SMTP...');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Beach Point Luxe Resort" <${process.env.EMAIL_FROM || emailUser}>`,
      to: emailUser, // Send to yourself
      subject: 'Test Email - Brevo Configuration',
      html: `
        <h2>✅ Email Configuration Test</h2>
        <p>If you received this email, your Brevo configuration is working correctly!</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: 'If you received this email, your Brevo configuration is working correctly!'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Check your inbox:', emailUser);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔍 Authentication Failed! Possible issues:');
      console.error('   1. SMTP key is incorrect or expired');
      console.error('   2. Login email is wrong');
      console.error('   3. Sender email not verified in Brevo');
      console.error('\n💡 Solutions:');
      console.error('   - Generate a new SMTP key in Brevo dashboard');
      console.error('   - Verify sender email in Brevo → Settings → Senders');
      console.error('   - Make sure EMAIL_USER is your Brevo login email');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔍 Connection Failed!');
      console.error('   - Check your internet connection');
      console.error('   - Check firewall settings');
    }
  }
};

testEmail();
