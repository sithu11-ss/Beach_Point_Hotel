const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Room description is required']
  },
  price: {
    type: Number,
    required: [true, 'Room price is required'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Room image is required']
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Must accommodate at least 1 guest']
  },
  size: {
    type: String,
    required: [true, 'Room size is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  roomNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for search functionality
roomSchema.index({ name: 'text', description: 'text' });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
