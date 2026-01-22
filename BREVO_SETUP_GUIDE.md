# Brevo Email Setup Guide - Quick Start

This is a step-by-step guide to set up Brevo (formerly Sendinblue) for sending booking and reservation confirmation emails.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Brevo Account

1. Go to **https://www.brevo.com/**
2. Click **"Sign up free"**
3. Enter your email and create a password
4. Verify your email address (check your inbox)

### Step 2: Get Your SMTP Credentials

1. **Log in to Brevo Dashboard**
   - Go to: https://app.brevo.com/

2. **Navigate to SMTP Settings**
   - Click on your profile icon (top right)
   - Go to **"SMTP & API"** → **"SMTP"** tab
   - Or directly go to: https://app.brevo.com/settings/keys/api

3. **Generate SMTP Key**
   - Click **"Generate a new SMTP key"** button
   - Give it a name: `Beach Point Hotel`
   - Click **"Generate"**
   - **⚠️ IMPORTANT:** Copy the SMTP key immediately (you won't see it again!)
   - It looks like: `xsmtpib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Note Your SMTP Login Email**
   - In the "Your SMTP Settings" section, you'll see a "Login" field
   - It looks like: `a09853001@smtp-brevo.com` (your unique SMTP login)
   - **This is what you need for `EMAIL_USER` in your `.env` file**
   - ⚠️ **Important:** This is NOT your Gmail/account email - it's a special SMTP login provided by Brevo

### Step 3: Verify Sender Email (Recommended)

1. In Brevo dashboard, go to: **Settings** → **Senders**
2. Click **"Add a sender"**
3. Enter your email address (e.g., `noreply@beachpointluxe.com` or your personal email)
4. Click **"Save"**
5. Check your email inbox for verification email
6. Click the verification link
7. Once verified, you can use this email in `EMAIL_FROM`

### Step 4: Update Your Backend `.env` File

Open `backend/.env` and add these lines:

```env
# Brevo Email Configuration
EMAIL_SERVICE=brevo
EMAIL_USER=your-login-email@example.com
EMAIL_PASSWORD=your-smtp-key-here
EMAIL_FROM=noreply@beachpointluxe.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Replace:**
- `your-smtp-login@smtp-brevo.com` → Your SMTP login email (from "Your SMTP Settings" → "Login" field in Brevo dashboard)
- `your-smtp-key-here` → The SMTP key you copied in Step 2
- `noreply@beachpointluxe.com` → Your verified sender email (from Step 3)

**⚠️ Important:** 
- `EMAIL_USER` = Your SMTP login (e.g., `a09853001@smtp-brevo.com`) - NOT your Gmail/account email
- `EMAIL_FROM` = Your verified sender email (e.g., `sithumhansaka2022@gmail.com`)

### Step 5: Install Nodemailer (if not already installed)

```bash
cd backend
npm install nodemailer
```

### Step 6: Test It!

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Make a test booking or reservation** through your frontend

3. **Check the backend console:**
   - ✅ `Booking confirmation email sent: <message-id>` = Success!
   - ❌ `Error sending...` = Check your configuration

4. **Check the recipient's email inbox** (and spam folder)

## 📋 Complete `.env` Example

Here's a complete example of what your `backend/.env` should look like:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/beachpoint-hotel

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Brevo Email Configuration
EMAIL_SERVICE=brevo
EMAIL_USER=a09853001@smtp-brevo.com
EMAIL_PASSWORD=xsmtpsib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
EMAIL_FROM=sithumhansaka2022@gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Firebase (if using)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 🔍 Troubleshooting

### ❌ "Invalid login" or "Authentication failed"

**Problem:** Wrong credentials

**Solution:**
- Make sure `EMAIL_USER` is your Brevo login email (not a sender email)
- Make sure `EMAIL_PASSWORD` is your SMTP key (not your account password)
- SMTP key should start with `xsmtpib-`

### ❌ "Connection timeout"

**Problem:** Network or port issue

**Solution:**
- Check your firewall settings
- Try port 465 with `EMAIL_SECURE=true`
- Make sure you're using `smtp-relay.brevo.com` as the host

### ❌ "Email not received"

**Problem:** Email might be in spam or wrong address

**Solution:**
- Check spam/junk folder
- Verify the recipient email is correct
- Check backend console for errors
- Make sure sender email is verified in Brevo

### ❌ "Sender not verified"

**Problem:** Using unverified sender email

**Solution:**
- Go to Brevo → Settings → Senders
- Verify your sender email
- Use verified email in `EMAIL_FROM`

## 📊 Brevo Free Tier Limits

- **300 emails per day** (free tier)
- **Unlimited contacts**
- **Email templates**
- **Analytics dashboard**

For higher limits, upgrade to a paid plan.

## ✅ Verification Checklist

Before going live, make sure:

- [ ] Brevo account created and verified
- [ ] SMTP key generated and copied
- [ ] Sender email verified in Brevo
- [ ] `.env` file updated with correct credentials
- [ ] Nodemailer installed (`npm install nodemailer`)
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)

## 🎯 Quick Reference

| Setting | Value | Description |
|---------|-------|-------------|
| `EMAIL_SERVICE` | `brevo` | Service identifier |
| `EMAIL_USER` | SMTP login email | From Brevo dashboard → SMTP Settings → Login (e.g., `a09853001@smtp-brevo.com`) |
| `EMAIL_PASSWORD` | SMTP key | Get from Brevo dashboard → SMTP tab |
| `EMAIL_FROM` | Verified email | Your verified sender email (e.g., `sithumhansaka2022@gmail.com`) |
| `EMAIL_PORT` | `587` | TLS port (or `465` for SSL) |
| `EMAIL_SECURE` | `false` | TLS (or `true` for SSL) |

## 📞 Need Help?

- **Brevo Documentation:** https://developers.brevo.com/
- **Brevo Support:** https://help.brevo.com/
- **Check backend console** for detailed error messages

---

**That's it!** Your email service is now configured with Brevo. 🎉
