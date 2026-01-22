const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('../models/Room');
const Menu = require('../models/Menu');

// Sample room data
const rooms = [
  {
    name: "Ocean View Suite",
    description: "Spacious suite with panoramic ocean views, private balcony, and luxury amenities.",
    price: 350,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
    ],
    amenities: ["Wi-Fi", "Mini Bar", "Ocean View", "Balcony", "King Bed"],
    maxGuests: 2,
    size: "45 sqm",
    isAvailable: true
  },
  {
    name: "Beachfront Villa",
    description: "Luxurious beachfront villa with direct beach access, private pool, and outdoor dining area.",
    price: 650,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
    ],
    amenities: ["Private Pool", "Beach Access", "Kitchen", "Wi-Fi", "Outdoor Dining"],
    maxGuests: 4,
    size: "120 sqm",
    isAvailable: true
  },
  {
    name: "Deluxe Room",
    description: "Elegant room with modern amenities, comfortable king bed, and garden view.",
    price: 220,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea8?w=800"
    ],
    amenities: ["Wi-Fi", "Garden View", "King Bed", "Mini Bar", "TV"],
    maxGuests: 2,
    size: "35 sqm",
    isAvailable: true
  },
  {
    name: "Presidential Suite",
    description: "Ultra-luxurious suite with separate living area, jacuzzi, and premium concierge service.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"
    ],
    amenities: ["Jacuzzi", "Living Room", "Premium Service", "Ocean View", "Butler Service"],
    maxGuests: 4,
    size: "200 sqm",
    isAvailable: true
  }
];

// Sample menu data
const menuItems = [
  {
    name: "Grilled Lobster",
    description: "Fresh Atlantic lobster grilled to perfection with garlic butter",
    price: 45,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600",
    isAvailable: true
  },
  {
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with black truffle and parmesan",
    price: 38,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
    isAvailable: true
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with homemade caesar dressing and croutons",
    price: 18,
    category: "Appetizer",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600",
    isAvailable: true
  },
  {
    name: "Chocolate Soufflé",
    description: "Warm chocolate soufflé with vanilla ice cream",
    price: 22,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
    isAvailable: true
  },
  {
    name: "Wagyu Beef Steak",
    description: "Premium Wagyu beef with roasted vegetables and red wine reduction",
    price: 85,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
    isAvailable: true
  },
  {
    name: "Seafood Platter",
    description: "Assorted fresh seafood with lemon butter sauce",
    price: 65,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Room.deleteMany({});
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert rooms
    const insertedRooms = await Room.insertMany(rooms);
    console.log(`✅ Inserted ${insertedRooms.length} rooms`);

    // Insert menu items
    const insertedMenu = await Menu.insertMany(menuItems);
    console.log(`✅ Inserted ${insertedMenu.length} menu items`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
