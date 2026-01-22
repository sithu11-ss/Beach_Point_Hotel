# Your MongoDB Setup - Ready to Go! 🚀

## ✅ Your Configuration is Ready!

**Your MongoDB Details:**
- Username: `admin`
- Password: `admin123`
- Database: `admin`
- Cluster: `cluster0.hgmrvrq.mongodb.net`

## Step 1: Create .env File

**Option A: Quick Method**
1. In the `backend` folder, find the file `.env.READY`
2. Copy it and rename to `.env` (remove `.READY`)

**Option B: Manual Method**
1. In the `backend` folder, create a new file named `.env` (exactly `.env` - no extension)
2. Copy and paste this content:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration - Already configured!
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.hgmrvrq.mongodb.net/admin?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=beach_point_hotel_jwt_secret_key_2024_change_this_in_production

FRONTEND_URL=http://localhost:3000
```

**✅ No password replacement needed - it's already set!**

## Step 2: Install Dependencies

```bash
cd backend
npm install
```

## Step 3: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
```

## Step 4: Test It

Open your browser:
- http://localhost:5000/api/health
- http://localhost:5000/api/rooms

## ✅ Your Connection String

**Final connection string (already configured):**
```
mongodb+srv://admin:admin123@cluster0.hgmrvrq.mongodb.net/admin?retryWrites=true&w=majority&appName=Cluster0
```

**What's included:**
- Username: `admin`
- Password: `admin123` (already set)
- Database: `admin` (your database name)
- Query parameters: `retryWrites=true&w=majority` (for reliability)
- App name: `Cluster0` (kept from your original)

## 🆘 Troubleshooting

**Connection Error?**
- Verify IP is whitelisted in MongoDB Atlas (Network Access)
  - Go to MongoDB Atlas → Network Access
  - Add IP Address: `0.0.0.0/0` (for development) or your specific IP
- Make sure your MongoDB cluster is running
- Double-check the connection string in `.env` file

**Still having issues?**
- Check `PASSWORD_GUIDE.md` for URL encoding help
- Make sure MongoDB Atlas cluster is running
- Verify your username is `admin` (or change it if different)
