// Dummy data for the resort website

export const rooms = [
  {
    id: 1,
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
    size: "45 sqm"
  },
  {
    id: 2,
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
    size: "120 sqm"
  },
  {
    id: 3,
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
    size: "35 sqm"
  },
  {
    id: 4,
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
    size: "200 sqm"
  }
];

export const menuItems = [
  {
    id: 1,
    name: "Grilled Lobster",
    description: "Fresh Atlantic lobster grilled to perfection with garlic butter",
    price: 45,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600"
  },
  {
    id: 2,
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with black truffle and parmesan",
    price: 38,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with homemade caesar dressing and croutons",
    price: 18,
    category: "Appetizer",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600"
  },
  {
    id: 4,
    name: "Chocolate Soufflé",
    description: "Warm chocolate soufflé with vanilla ice cream",
    price: 22,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
  },
  {
    id: 5,
    name: "Wagyu Beef Steak",
    description: "Premium Wagyu beef with roasted vegetables and red wine reduction",
    price: 85,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"
  },
  {
    id: 6,
    name: "Seafood Platter",
    description: "Assorted fresh seafood with lemon butter sauce",
    price: 65,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
  }
];

export const features = [
  {
    id: 1,
    title: "Luxury Accommodations",
    description: "Elegant rooms and suites with premium amenities",
    icon: "🏖️"
  },
  {
    id: 2,
    title: "Fine Dining",
    description: "World-class restaurant with ocean views",
    icon: "🍽️"
  },
  {
    id: 3,
    title: "Spa & Wellness",
    description: "Relax and rejuvenate at our luxury spa",
    icon: "🧘"
  },
  {
    id: 4,
    title: "Beach Access",
    description: "Direct access to pristine private beach",
    icon: "🌊"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    text: "Absolutely stunning resort! The ocean view suite exceeded all expectations.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    text: "Perfect getaway destination. The service was impeccable and the food was divine.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Williams",
    text: "The most luxurious beach resort experience we've ever had. Highly recommended!",
    rating: 5
  }
];

