# Fix Brevo Authentication Error (535 5.7.8)

## Error Message
```
❌ Error sending booking confirmation email: Error: Invalid login: 535 5.7.8 Authentication failed
```

## Quick Fix Steps

### Step 1: Verify Your Brevo SMTP Key

1. **Log in to Brevo Dashboard**
   - Go to: https://app.brevo.com/
   - Click your profile icon (top right)
   - Go to **"SMTP & API"** → **"SMTP"** tab
   - Or directly: https://app.brevo.com/settings/keys/api

2. **Check Your SMTP Key**
   - You should see your SMTP key listed
   - It should start with: `xsmtpib-`
   - If you don't see it or it's wrong, **generate a new one**:
     - Click **"Generate a new SMTP key"**
     - Name it: `Beach Point Hotel`
     - **Copy it immediately** (you won't see it again!)

### Step 2: Get Your SMTP Login Email

- Go to Brevo Dashboard → **SMTP & API** → **SMTP** tab
- Look at the **"Your SMTP Settings"** section
- Find the **"Login"** field (e.g., `a09853001@smtp-brevo.com`)
- **This is your `EMAIL_USER`** - NOT your Gmail/account email!
- ⚠️ **Important:** Brevo provides a special SMTP login email that's different from your account email

### Step 3: Update Your `.env` File

Open `backend/.env` and make sure it looks exactly like this:

```env
EMAIL_SERVICE=brevo
EMAIL_USER=a09853001@smtp-brevo.com
EMAIL_PASSWORD=xsmtpsib-your-complete-smtp-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**⚠️ Critical:** 
- `EMAIL_USER` = Your SMTP login from Brevo dashboard (e.g., `a09853001@smtp-brevo.com`)
- `EMAIL_FROM` = Your verified sender email (e.g., `sithumhansaka2022@gmail.com`)
- These are DIFFERENT emails!

**Important:**
- ✅ `EMAIL_USER` = Your Brevo login email (the one you use to sign in)
- ✅ `EMAIL_PASSWORD` = Your SMTP key (starts with `xsmtpib-`)
- ✅ No extra spaces before or after the values
- ✅ No quotes around the values
- ✅ Copy the SMTP key exactly as shown (it's very long)

### Step 4: Verify Sender Email in Brevo

1. Go to Brevo Dashboard → **Settings** → **Senders**
2. Make sure your sender email is **verified** (green checkmark)
3. If not verified:
   - Click "Add a sender"
   - Enter your email
   - Check your inbox for verification email
   - Click the verification link

### Step 5: Restart Your Backend Server

After updating `.env`:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

## Common Mistakes

### ❌ Wrong EMAIL_USER
- Using your Gmail/account email instead of SMTP login
- Using a sender email instead of SMTP login
- **Fix:** Use the SMTP login email from Brevo dashboard → SMTP Settings → Login field (e.g., `a09853001@smtp-brevo.com`)

### ❌ Wrong EMAIL_PASSWORD
- Using your Brevo account password instead of SMTP key
- Using an old/expired SMTP key
- Copying the key incorrectly (missing characters, extra spaces)
- **Fix:** Generate a new SMTP key and copy it exactly

### ❌ SMTP Key Format Issues
- Missing the `xsmtpib-` prefix
- Extra spaces or line breaks
- Truncated key (it should be very long, ~64+ characters)
- **Fix:** Copy the entire key in one go, no spaces

### ❌ Sender Email Not Verified
- Using an unverified email in `EMAIL_FROM`
- **Fix:** Verify the sender email in Brevo dashboard

## Test Your Configuration

After fixing, check the backend console when you create a booking. You should see:

```
📧 Configuring Brevo SMTP...
   Host: smtp-relay.brevo.com
   Port: 587
   User: your-email@example.com
   Password: xsmtpib-ab...
✅ Booking confirmation email sent: <message-id>
   To: customer@example.com
```

If you still see authentication errors, double-check:
1. SMTP key is correct (generate a new one if unsure)
2. Login email is correct
3. No extra spaces in `.env` file
4. Restarted the backend server after changes

## Still Not Working?

1. **Generate a fresh SMTP key** in Brevo dashboard
2. **Copy it exactly** (no spaces, no quotes)
3. **Update `.env`** with the new key
4. **Restart backend server**
5. **Try again**

If it still fails, check:
- Backend console for detailed error messages
- Brevo dashboard → Settings → SMTP to see if your key is active
- Make sure you're using the free tier (300 emails/day limit)
