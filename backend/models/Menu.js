const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Menu item description is required']
  },
  price: {
    type: Number,
    required: [true, 'Menu item price is required'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: String,
    required: [true, 'Menu item category is required'],
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Breakfast', 'Lunch', 'Dinner'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  dietaryInfo: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher']
  }]
}, {
  timestamps: true
});

// Index for search and filtering
menuSchema.index({ name: 'text', description: 'text' });
menuSchema.index({ category: 1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
