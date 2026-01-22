# MongoDB Setup Guide

## How to Get Your MongoDB Connection String

### Option 1: MongoDB Atlas (Cloud - Recommended for Development)

MongoDB Atlas is a free cloud database service. Here's how to set it up:

#### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account (it's free!)

#### Step 2: Create a Cluster
1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to you)
4. Click "Create"

#### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `hoteladmin`)
5. Enter a strong password (save this!)
6. Set user privileges to "Atlas admin" or "Read and write to any database"
7. Click "Add User"

#### Step 4: Whitelist Your IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - **Note:** For production, use specific IP addresses
4. Click "Confirm"

#### Step 5: Get Your Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string

It will look like this:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Step 6: Update Connection String
Replace the placeholders:
- `<username>` → Your database username (from Step 3)
- `<password>` → Your database password (from Step 3)
- Add your database name at the end: `...mongodb.net/beach_point_hotel?retryWrites=true&w=majority`

**Final connection string example:**
```
mongodb+srv://hoteladmin:MyPassword123@cluster0.abc123.mongodb.net/beach_point_hotel?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

If you have MongoDB installed locally:

1. Make sure MongoDB is running on your machine
2. Use this connection string:
```
mongodb://localhost:27017/beach_point_hotel
```

## Setting Up Environment Variables

### Step 1: Create .env File
In the `backend` folder, create a file named `.env` (not `.env.example`)

### Step 2: Add Your Variables
Copy this template and fill in your values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beach_point_hotel?retryWrites=true&w=majority

# JWT Secret (Change this to a random string)
# You can generate one at: https://randomkeygen.com/
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 3: Important Notes
- **Never commit `.env` to Git** - it's already in `.gitignore`
- **Keep your JWT_SECRET secure** - use a long random string
- **Replace all placeholder values** with your actual credentials

## Quick Start Checklist

- [ ] Created MongoDB Atlas account (or have local MongoDB running)
- [ ] Created database user in MongoDB Atlas
- [ ] Whitelisted IP address in MongoDB Atlas
- [ ] Copied connection string from MongoDB Atlas
- [ ] Created `.env` file in `backend` folder
- [ ] Added `MONGODB_URI` to `.env` with your connection string
- [ ] Added `JWT_SECRET` to `.env` (random string)
- [ ] Installed backend dependencies: `npm install`
- [ ] Started the server: `npm run dev`

## Testing Your Connection

After setting up, start your server:
```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
```

If you see connection errors, double-check:
1. Your connection string is correct
2. Your username and password are correct
3. Your IP address is whitelisted (for Atlas)
4. MongoDB service is running (for local)

## Need Help?

Common issues:
- **Connection timeout**: Check IP whitelist in MongoDB Atlas
- **Authentication failed**: Verify username and password
- **Network error**: Check your internet connection (for Atlas)
