// Debug script to check .env file loading
// Run: node debug-env.js

require('dotenv').config();

console.log('🔍 Debugging .env File Configuration\n');
console.log('='.repeat(50));

console.log('\n📋 Raw Environment Variables:');
console.log('EMAIL_SERVICE:', JSON.stringify(process.env.EMAIL_SERVICE));
console.log('EMAIL_USER:', JSON.stringify(process.env.EMAIL_USER));
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 
  JSON.stringify(process.env.EMAIL_PASSWORD.substring(0, 20) + '...') : 'NOT SET');
console.log('EMAIL_FROM:', JSON.stringify(process.env.EMAIL_FROM));
console.log('EMAIL_PORT:', JSON.stringify(process.env.EMAIL_PORT));
console.log('EMAIL_SECURE:', JSON.stringify(process.env.EMAIL_SECURE));

console.log('\n📏 Lengths:');
console.log('EMAIL_USER length:', process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0);
console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);

console.log('\n🔍 Checks:');
console.log('EMAIL_USER has spaces:', process.env.EMAIL_USER ? process.env.EMAIL_USER.includes(' ') : 'N/A');
console.log('EMAIL_PASSWORD has spaces:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.includes(' ') : 'N/A');
console.log('EMAIL_USER starts with:', process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 5) : 'N/A');
console.log('EMAIL_PASSWORD starts with:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.substring(0, 10) : 'N/A');

console.log('\n⚠️  Issues Found:');
let issues = [];

if (!process.env.EMAIL_SERVICE || process.env.EMAIL_SERVICE !== 'brevo') {
  issues.push('❌ EMAIL_SERVICE is not set to "brevo"');
}

if (!process.env.EMAIL_USER) {
  issues.push('❌ EMAIL_USER is not set');
} else if (process.env.EMAIL_USER.includes(' ')) {
  issues.push('⚠️  EMAIL_USER contains spaces (should be trimmed)');
}

if (!process.env.EMAIL_PASSWORD) {
  issues.push('❌ EMAIL_PASSWORD is not set');
} else {
  if (process.env.EMAIL_PASSWORD.includes(' ')) {
    issues.push('❌ EMAIL_PASSWORD contains spaces - THIS WILL CAUSE AUTH FAILURE!');
  }
  if (!process.env.EMAIL_PASSWORD.startsWith('xsmtp')) {
    issues.push('⚠️  EMAIL_PASSWORD does not start with "xsmtp" (should start with xsmtpib- or xsmtpsib-)');
  }
  if (process.env.EMAIL_PASSWORD.length < 50) {
    issues.push('⚠️  EMAIL_PASSWORD seems too short (should be ~80+ characters)');
  }
}

if (!process.env.EMAIL_FROM) {
  issues.push('⚠️  EMAIL_FROM is not set (will use EMAIL_USER)');
}

if (issues.length === 0) {
  console.log('✅ No issues found! Configuration looks good.');
} else {
  issues.forEach(issue => console.log(issue));
}

console.log('\n' + '='.repeat(50));
console.log('\n💡 If EMAIL_PASSWORD has spaces, check your .env file:');
console.log('   - Make sure there are NO spaces before or after the = sign');
console.log('   - Make sure the SMTP key is on a single line');
console.log('   - Make sure there are NO quotes around the value');
