# Beach Point Hotel - Backend API

This is the backend API for the Beach Point Hotel booking system, built with Node.js, Express, and MongoDB.

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   └── database.js   # MongoDB connection
├── controllers/      # Route controllers (business logic)
│   ├── bookingController.js
│   ├── menuController.js
│   ├── roomController.js
│   └── userController.js
├── middleware/       # Custom middleware
│   └── auth.js       # Authentication & authorization
├── models/           # MongoDB models (schemas)
│   ├── Booking.js
│   ├── Menu.js
│   ├── Room.js
│   └── User.js
├── routes/           # API routes
│   ├── adminRoutes.js
│   ├── bookingRoutes.js
│   ├── menuRoutes.js
│   ├── roomRoutes.js
│   └── userRoutes.js
├── scripts/          # Utility scripts
│   └── seedData.js   # Database seeding script
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── server.js         # Main server file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB connection string and other variables

3. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

### MongoDB Setup

#### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<database-name>` in the connection string
7. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beach_point_hotel?retryWrites=true&w=majority
```

#### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string:
```
mongodb://localhost:27017/beach_point_hotel
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/:id/availability` - Check room availability
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:id` - Update room (Admin only)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `GET /api/bookings/reference/:reference` - Get booking by reference
- `POST /api/bookings` - Create booking (Public)
- `PUT /api/bookings/:id` - Update booking (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item (Admin only)
- `PUT /api/menu/:id` - Update menu item (Admin only)
- `DELETE /api/menu/:id` - Delete menu item (Admin only)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (Protected)
- `GET /api/users` - Get all users (Admin only)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (Admin only)

### Health Check
- `GET /api/health` - Check API status

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 🌱 Seeding Database

To populate the database with sample data:

```bash
node scripts/seedData.js
```

This will:
- Clear existing rooms and menu items
- Insert sample rooms and menu items from your dummy data

## 📝 Notes

- All timestamps are automatically managed by Mongoose
- Booking references are auto-generated (format: `BPH-XXXXX-XXXX`)
- Passwords are hashed using bcrypt
- CORS is configured to allow requests from the frontend URL

## 🛠️ Development

- Use `npm run dev` for development with auto-reload (nodemon)
- Use `npm start` for production
- Check server logs for connection status and errors
