# Firebase Authentication - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies

**Frontend:**
```bash
npm install firebase
```

**Backend:**
```bash
cd backend
npm install firebase-admin
```

### 2. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it (e.g., "Beach Point Hotel")
4. Click **"Create project"**

### 3. Enable Email/Password Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Click **"Sign-in method"** tab
3. Click **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Click **"Save"**

### 4. Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter email: `admin@beachpointhotel.com`
4. Enter password (save it!)
5. Click **"Add user"**

### 5. Get Frontend Config

1. Firebase Console → ⚙️ **Project settings**
2. Scroll to **"Your apps"** → Click **Web** icon `</>`
3. Register app → Copy the config values

### 6. Get Backend Service Account

1. Firebase Console → ⚙️ **Project settings** → **Service accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file

### 7. Update Environment Variables

**Frontend `.env` (root directory):**
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc
```

**Backend `.env` (backend directory):**

Open the downloaded JSON file and copy its entire content, then paste it as:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...",...}
```

**Important:** The entire JSON must be on one line!

### 8. Test It!

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Go to: `http://localhost:3000/admin/login`
4. Login with the admin email/password you created
5. You should see the admin dashboard!

## 📚 Full Documentation

See `backend/FIREBASE_SETUP.md` for detailed instructions and troubleshooting.

## ⚠️ Important Notes

- Never commit `.env` files to Git
- Never commit the service account JSON file
- Keep your admin password secure
- The service account has admin privileges - protect it!
