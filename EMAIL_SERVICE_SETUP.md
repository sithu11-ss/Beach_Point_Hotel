# Email Service Setup Guide

This guide will help you set up email functionality for sending booking and reservation confirmation emails.

## Overview

The application uses **Nodemailer** to send confirmation emails when:
- A user books a room
- A user makes a restaurant reservation

## Installation

First, install nodemailer in the backend:

```bash
cd backend
npm install nodemailer
```

## Email Service Options

You have several options for sending emails. Choose the one that best fits your needs:

### Option 1: Brevo (Recommended for Production) ⭐

**Pros:** Free tier (300 emails/day), reliable, easy setup, professional  
**Cons:** Requires account setup

Brevo (formerly Sendinblue) is an excellent choice for production use with a generous free tier.

#### Setup Steps:

1. **Create Brevo Account**
   - Go to: https://www.brevo.com/
   - Sign up for a free account
   - Verify your email address

2. **Get Your SMTP Key**
   - Log in to Brevo dashboard
   - Go to: **Settings** → **SMTP & API** → **SMTP** tab
   - Click **"Generate a new SMTP key"**
   - Give it a name (e.g., "Beach Point Hotel")
   - **Copy the SMTP key** (you'll need this - it looks like: `xsmtpib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ **Important:** This is your SMTP key, NOT your account password!

3. **Get Your Login Email**
   - This is the email address you used to sign up for Brevo
   - Or go to: **Settings** → **Account** to see your login email

4. **Update Backend `.env` file:**

```env
EMAIL_SERVICE=brevo
EMAIL_USER=your-login-email@example.com
EMAIL_PASSWORD=your-smtp-key-here
EMAIL_FROM=noreply@beachpointluxe.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Important Notes:**
- `EMAIL_USER` = Your Brevo login email (the email you use to log in)
- `EMAIL_PASSWORD` = Your SMTP key (NOT your account password)
- `EMAIL_FROM` = The "from" email address (can be your verified sender email in Brevo)
- `EMAIL_PORT` = 587 for TLS (recommended) or 465 for SSL
- `EMAIL_SECURE` = false for port 587, true for port 465

#### Verify Your Sender Email (Optional but Recommended)

1. In Brevo dashboard, go to: **Settings** → **Senders**
2. Click **"Add a sender"**
3. Enter your email address (e.g., `noreply@beachpointluxe.com`)
4. Verify the email by clicking the verification link sent to your inbox
5. Use this verified email in `EMAIL_FROM`

### Option 2: Gmail (Easiest for Development/Testing)

**Pros:** Free, easy to set up, good for testing  
**Cons:** Limited to 500 emails/day, requires app-specific password

#### Setup Steps:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App-Specific Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Beach Point Hotel" as the name
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this)

3. **Update Backend `.env` file:**

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### Option 3: Custom SMTP

Works with most email providers (Gmail, Outlook, Yahoo, custom domains, etc.)

#### For Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

#### For Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### For Custom Domain (e.g., yourdomain.com):
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-email-password
```

### Option 4: Other Professional Email Services

#### SendGrid (Free tier: 100 emails/day)

1. Sign up at: https://sendgrid.com/
2. Create an API key
3. Update `.env`:

```env
EMAIL_SERVICE=sendgrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun (Free tier: 5,000 emails/month)

1. Sign up at: https://www.mailgun.com/
2. Get SMTP credentials from dashboard
3. Update `.env`:

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

#### AWS SES (Pay as you go, very reliable)

1. Set up AWS SES
2. Verify your email/domain
3. Get SMTP credentials
4. Update `.env`:

```env
EMAIL_HOST=email-smtp.region.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

## Environment Variables

Add these to your `backend/.env` file:

### For Brevo (Recommended):
```env
EMAIL_SERVICE=brevo
EMAIL_USER=your-login-email@example.com
EMAIL_PASSWORD=your-smtp-key-from-brevo
EMAIL_FROM=noreply@beachpointluxe.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Brevo Setup:**
- `EMAIL_USER` = Your Brevo login email
- `EMAIL_PASSWORD` = Your SMTP key (get it from Brevo dashboard → Settings → SMTP & API)
- `EMAIL_FROM` = The "from" email address (use a verified sender email)
- `EMAIL_PORT` = 587 (TLS) or 465 (SSL)
- `EMAIL_SECURE` = false for 587, true for 465

### For Gmail:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### For Custom SMTP:
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

**Note:** If you don't set any email variables, the system will use Ethereal Email (test emails only - no real emails sent).

## Testing Email Setup

1. Make sure your `.env` file is configured correctly
2. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Create a test booking or reservation through the frontend
4. Check the backend console for email sending status:
   - ✅ `Booking confirmation email sent: <message-id>` = Success
   - ❌ `Error sending booking confirmation email: <error>` = Check your configuration

## Troubleshooting

### "Invalid login" or "Authentication failed"
- **Gmail:** Make sure you're using an app-specific password, not your regular password
- **Other services:** Verify your username and password are correct

### "Connection timeout"
- Check your firewall settings
- Verify the SMTP host and port are correct
- Some networks block SMTP ports - try a different network

### "Email not received"
- Check spam/junk folder
- Verify the recipient email address is correct
- For Gmail, check if emails are being filtered
- Check backend console for error messages

### "Rate limit exceeded" (Gmail)
- Gmail has a limit of 500 emails/day for free accounts
- Consider upgrading to a professional email service for production

## Production Recommendations

For production use, we recommend:

1. **SendGrid** or **Mailgun** - Easy setup, good free tiers
2. **AWS SES** - Most reliable, pay-as-you-go pricing
3. **Custom domain email** - Professional, uses your own domain

## Email Templates

The email templates are located in:
- `backend/utils/emailService.js`

You can customize the HTML and text templates to match your brand.

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to Git
- Keep your email passwords secure
- Use app-specific passwords when possible
- For production, use environment variables on your hosting platform

## Support

If you encounter issues:
1. Check the backend console for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email service first (like Gmail)
4. Check your email provider's documentation for SMTP settings
