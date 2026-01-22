# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the admin login system.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "Beach Point Hotel")
   - Enable/disable Google Analytics (optional)
   - Click **"Create project"**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click on **"Sign-in method"** tab
3. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

## Step 3: Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter admin email (e.g., `admin@beachpointhotel.com`)
4. Enter a secure password
5. Click **"Add user"**

## Step 4: Get Firebase Web App Config

1. In Firebase Console, click the **gear icon** ⚙️ → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click **"Web"** icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "Beach Point Hotel Web")
5. Click **"Register app"**
6. Copy the **Firebase configuration object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Get Firebase Admin SDK Service Account

1. In Firebase Console, go to **Project settings** (gear icon ⚙️)
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. A JSON file will be downloaded (e.g., `your-project-firebase-adminsdk-xxxxx.json`)
6. **IMPORTANT**: Keep this file secure! Never commit it to Git.

## Step 6: Update Frontend Environment Variables

Create or update `.env` file in the **root directory** (same level as `package.json`):

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Replace all values** with your actual Firebase config values from Step 4.

## Step 7: Update Backend Environment Variables

Create or update `.env` file in the **backend directory**:

### Option 1: Using Service Account JSON (Recommended)

1. Open the downloaded JSON file from Step 5
2. Copy the entire JSON content
3. Add to `backend/.env`:

```env
# Firebase Admin SDK - Service Account (as JSON string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

**Important**: The entire JSON must be on a single line, or use proper JSON escaping.

### Option 2: Using Individual Variables (Alternative)

If Option 1 doesn't work, you can use individual variables:

```env
# Firebase Admin SDK - Individual Variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

**Note**: For `FIREBASE_PRIVATE_KEY`, keep the `\n` characters as they are (they represent newlines).

## Step 8: Install Dependencies

### Frontend
```bash
npm install firebase
```

### Backend
```bash
cd backend
npm install firebase-admin
```

## Step 9: Test the Setup

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

3. **Test Login**:
   - Navigate to `http://localhost:3000/admin/login`
   - Enter the admin email and password you created in Step 3
   - Click "Sign In"
   - You should be redirected to `/admin` dashboard

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Check that all `REACT_APP_FIREBASE_*` variables in frontend `.env` are correct
- Make sure to restart the React dev server after updating `.env`

### Error: "Firebase Admin initialization error"
- **Solution**: Check that `FIREBASE_SERVICE_ACCOUNT` in backend `.env` is valid JSON
- Make sure the JSON is properly escaped (all on one line or properly formatted)

### Error: "Invalid or expired token"
- **Solution**: Make sure the user is logged in and the token hasn't expired
- Try logging out and logging back in

### Error: "No token provided"
- **Solution**: Make sure the frontend is sending the token in the Authorization header
- Check browser console for errors

## Security Notes

1. **Never commit** `.env` files to Git
2. **Never commit** Firebase service account JSON files
3. The service account has admin privileges - keep it secure
4. Use environment variables in production (not hardcoded values)
5. Consider using Firebase App Check for additional security

## Production Deployment

For production:
1. Set environment variables in your hosting platform (Vercel, Netlify, Heroku, etc.)
2. Use the same variable names as in `.env`
3. Make sure `FIREBASE_SERVICE_ACCOUNT` is properly set in your backend hosting environment

## Support

If you encounter issues:
1. Check Firebase Console for any errors
2. Check browser console for frontend errors
3. Check backend terminal for server errors
4. Verify all environment variables are set correctly
