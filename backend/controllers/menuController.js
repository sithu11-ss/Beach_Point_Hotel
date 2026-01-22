const Menu = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }
    
    const menuItems = await Menu.find(query).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Admin
exports.createMenuItem = async (req, res) => {
  try {
    // Default image based on category if not provided
    const defaultImages = {
      'Appetizer': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
      'Main Course': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600',
      'Dessert': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
      'Beverage': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
      'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
      'Lunch': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
      'Dinner': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
    };

    const fallback = 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600';
    const imageFromReq = typeof req.body.image === 'string' ? req.body.image.trim() : '';
    const resolvedImage = imageFromReq !== '' ? imageFromReq : (defaultImages[req.body.category] || fallback);

    const menuData = {
      ...req.body,
      image: resolvedImage
    };
    
    const menuItem = await Menu.create(menuData);
    
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Admin
exports.updateMenuItem = async (req, res) => {
  try {
    // If frontend sends empty image string, ignore it (keep existing).
    // If no image provided at all, and existing image is empty, set category-based default.
    const defaultImages = {
      'Appetizer': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
      'Main Course': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600',
      'Dessert': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
      'Beverage': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
      'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
      'Lunch': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
      'Dinner': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
    };
    const fallback = 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600';

    const existing = await Menu.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    const update = { ...req.body };
    if (typeof update.image === 'string' && update.image.trim() === '') {
      delete update.image;
    }

    // If after update the image would still be empty, set default.
    const nextCategory = update.category || existing.category;
    const willHaveImage = (typeof update.image === 'string' && update.image.trim() !== '') || (typeof existing.image === 'string' && existing.image.trim() !== '');
    if (!willHaveImage) {
      update.image = defaultImages[nextCategory] || fallback;
    }

    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete menu item (PERMANENT DELETE)
// @route   DELETE /api/menu/:id
// @access  Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    // Permanently delete menu item from database
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
