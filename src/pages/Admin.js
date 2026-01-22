
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCalendar, FiDollarSign, FiEdit, FiLogOut, FiPlus, FiRefreshCw, FiTrash2, FiTrendingUp, FiUsers, FiX } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Card from '../components/UI/Card';
import { bookingsAPI, menuAPI, roomsAPI } from '../services/api';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800';
const DEFAULT_MENU_IMAGE = 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states (NO IMAGE UPLOAD)
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);

  // Delete confirmation states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'room' or 'menu'
  const [itemToDelete, setItemToDelete] = useState(null);

  // Room form data (NO image fields)
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    size: '',
    amenities: '',
    isAvailable: true
  });

  // Menu form data (NO image field)
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isAvailable: true
  });

  // Fetch functions
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getAll();
      setRooms(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
    }
  }, []);

  // Fetch data
  useEffect(() => {
    fetchRooms();
    fetchMenu();
    fetchBookings();
  }, [fetchBookings]);

  // Auto-refresh bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings') {
      // Fetch immediately when tab becomes active
      fetchBookings();
      
      // Set up auto-refresh every 30 seconds when bookings tab is active
      const interval = setInterval(() => {
        fetchBookings();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, fetchBookings]);

  // Room handlers
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const amenitiesArray = roomForm.amenities.split(',').map(a => a.trim()).filter(a => a);
      
      const roomData = {
        ...roomForm,
        price: Number(roomForm.price),
        maxGuests: Number(roomForm.maxGuests),
        amenities: amenitiesArray
      };

      if (editingRoom) {
        await roomsAPI.update(editingRoom._id, roomData);
      } else {
        await roomsAPI.create(roomData);
      }
      
      await fetchRooms();
      resetRoomForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomEdit = (room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      description: room.description,
      price: room.price,
      maxGuests: room.maxGuests,
      size: room.size,
      amenities: room.amenities.join(', '),
      isAvailable: room.isAvailable
    });
    setShowRoomForm(true);
  };

  const handleRoomDelete = (room) => {
    setItemToDelete({ id: room._id, name: room.name });
    setDeleteType('room');
    setShowDeleteModal(true);
  };

  const confirmRoomDelete = async () => {
    try {
      setLoading(true);
      await roomsAPI.delete(itemToDelete.id);
      await fetchRooms();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const resetRoomForm = () => {
    setRoomForm({
      name: '',
      description: '',
      price: '',
      maxGuests: '',
      size: '',
      amenities: '',
      isAvailable: true
    });
    setEditingRoom(null);
    setShowRoomForm(false);
  };

  // Menu handlers
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const menuData = {
        ...menuForm,
        price: Number(menuForm.price)
      };

      if (editingMenu) {
        await menuAPI.update(editingMenu._id, menuData);
      } else {
        await menuAPI.create(menuData);
      }
      
      await fetchMenu();
      resetMenuForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuEdit = (item) => {
    setEditingMenu(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable
    });
    setShowMenuForm(true);
  };

  const handleMenuDelete = (item) => {
    setItemToDelete({ id: item._id, name: item.name });
    setDeleteType('menu');
    setShowDeleteModal(true);
  };

  const confirmMenuDelete = async () => {
    try {
      setLoading(true);
      await menuAPI.delete(itemToDelete.id);
      await fetchMenu();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const resetMenuForm = () => {
    setMenuForm({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      isAvailable: true
    });
    setEditingMenu(null);
    setShowMenuForm(false);
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: FiCalendar, color: 'text-blue-500', change: '+12%' },
    { label: 'Revenue', value: `$${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString()}`, icon: FiDollarSign, color: 'text-green-500', change: '+8%' },
    { label: 'Total Rooms', value: rooms.length, icon: FiUsers, color: 'text-purple-500', change: '+5%' },
    { label: 'Menu Items', value: menuItems.length, icon: FiTrendingUp, color: 'text-orange-500', change: '+3%' }
  ];

  return (
    <div className={`min-h-screen pt-20 pb-20 ${darkMode ? 'bg-charcoal' : 'bg-sand-beige'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-4xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-ocean-blue text-white hover:bg-opacity-90'
              }`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={async () => {
                try {
                  await signOut(auth);
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  navigate('/admin/login');
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError('')} className="float-right">×</button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && itemToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
                setDeleteType(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-2xl p-8 max-w-md w-full ${darkMode ? 'bg-charcoal' : ''}`}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FiTrash2 className="text-red-600" size={32} />
                  </div>
                </div>
                <h3 className={`text-2xl font-heading font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                  Delete {deleteType === 'room' ? 'Room' : 'Menu Item'}?
                </h3>
                <p className={`text-center mb-2 ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                  Are you sure you want to permanently delete
                </p>
                <p className={`text-center font-semibold mb-6 ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                  "{itemToDelete.name}"?
                </p>
                <p className={`text-center text-sm mb-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  ⚠️ This action cannot be undone. The {deleteType === 'room' ? 'room' : 'menu item'} will be permanently deleted.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setItemToDelete(null);
                      setDeleteType(null);
                    }}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (deleteType === 'room') {
                        confirmRoomDelete();
                      } else {
                        confirmMenuDelete();
                      }
                    }}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['dashboard', 'rooms', 'restaurant', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-ocean-blue text-ocean-blue'
                  : 'border-transparent text-charcoal/60 hover:text-ocean-blue'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 ${darkMode ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={`text-3xl ${stat.color}`} />
                      <span className="text-sm font-semibold text-green-500">{stat.change}</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                      {stat.value}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                      {stat.label}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <Card className={`p-6 ${darkMode ? 'bg-white/5' : ''}`}>
              <h2 className={`text-2xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                Recent Bookings
              </h2>
              {loading ? (
                <p className="text-center py-8">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-center py-8 text-charcoal/70">No bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Guest
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Room
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Dates
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Status
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 10).map((booking) => (
                        <tr
                          key={booking._id}
                          className={`border-b ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`py-4 px-4 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                            {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white/80' : 'text-charcoal/70'}`}>
                            {booking.room?.name || 'N/A'}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white/80' : 'text-charcoal/70'}`}>
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'checked-in'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className={`py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                            ${booking.totalPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                Manage Rooms
              </h2>
              <button 
                onClick={() => {
                  resetRoomForm();
                  setShowRoomForm(true);
                }}
                className="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <FiPlus /> Add New Room
              </button>
            </div>

            {/* Room Form Modal */}
            <AnimatePresence>
              {showRoomForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => resetRoomForm()}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-charcoal' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                        {editingRoom ? 'Edit Room' : 'Add New Room'}
                      </h3>
                      <button
                        onClick={resetRoomForm}
                        className="text-charcoal/70 hover:text-charcoal"
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                    <form onSubmit={handleRoomSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Name *</label>
                        <input
                          type="text"
                          required
                          value={roomForm.name}
                          onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Description *</label>
                        <textarea
                          required
                          value={roomForm.description}
                          onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Price ($) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={roomForm.price}
                            onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Max Guests *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={roomForm.maxGuests}
                            onChange={(e) => setRoomForm({ ...roomForm, maxGuests: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Size *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., 45 sqm"
                          value={roomForm.size}
                          onChange={(e) => setRoomForm({ ...roomForm, size: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Amenities (comma separated) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Wi-Fi, Mini Bar, Ocean View"
                          value={roomForm.amenities}
                          onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={roomForm.isAvailable}
                          onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm font-medium text-charcoal">Available</label>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={resetRoomForm}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !showRoomForm ? (
              <p className="text-center py-12">Loading rooms...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <Card key={room._id} className={`p-6 ${darkMode ? 'bg-white/5' : ''}`}>
                    <img
                      src={room.image || DEFAULT_ROOM_IMAGE}
                      alt={room.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = DEFAULT_ROOM_IMAGE;
                      }}
                    />
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-heading font-semibold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                        {room.name}
                      </h3>
                      <span className={`font-bold ${darkMode ? 'text-soft-gold' : 'text-ocean-blue'}`}>
                        ${room.price}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                      {room.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRoomEdit(room)}
                        className="flex-1 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleRoomDelete(room)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {rooms.length === 0 && !loading && (
              <p className="text-center py-12 text-charcoal/70">No rooms added yet. Click "Add New Room" to get started.</p>
            )}
          </motion.div>
        )}

        {/* Restaurant Tab */}
        {activeTab === 'restaurant' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                Manage Menu
              </h2>

              <button
                onClick={() => {
                  resetMenuForm();
                  setShowMenuForm(true);
                }}
                className="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <FiPlus /> Add Menu Item
              </button>
            </div>

            {/* Menu Form Modal */}
            <AnimatePresence>
              {showMenuForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => resetMenuForm()}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white rounded-2xl p-8 max-w-2xl w-full ${darkMode ? 'bg-charcoal' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                        {editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}
                      </h3>
                      <button
                        onClick={resetMenuForm}
                        className="text-charcoal/70 hover:text-charcoal"
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                    <form onSubmit={handleMenuSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Name *</label>
                        <input
                          type="text"
                          required
                          value={menuForm.name}
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Description *</label>
                        <textarea
                          required
                          value={menuForm.description}
                          onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Price ($) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={menuForm.price}
                            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Category *</label>
                          <select
                            required
                            value={menuForm.category}
                            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          >
                            <option value="Appetizer">Appetizer</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={menuForm.isAvailable}
                          onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm font-medium text-charcoal">Available</label>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={resetMenuForm}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : editingMenu ? 'Update Menu Item' : 'Create Menu Item'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !showMenuForm ? (
              <p className="text-center py-12">Loading menu...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item._id} className={`p-6 ${darkMode ? 'bg-white/5' : ''}`}>
                    <img
                      src={item.image || DEFAULT_MENU_IMAGE}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = DEFAULT_MENU_IMAGE;
                      }}
                    />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-charcoal/60'}`}>
                          {item.category}
                        </p>
                      </div>
                      <span className={`font-bold ${darkMode ? 'text-soft-gold' : 'text-ocean-blue'}`}>
                        ${item.price}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMenuEdit(item)}
                        className="flex-1 px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleMenuDelete(item)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {menuItems.length === 0 && !loading && (
              <p className="text-center py-12 text-charcoal/70">No menu items added yet. Click "Add Menu Item" to get started.</p>
            )}
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`p-6 ${darkMode ? 'bg-white/5' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                  All Bookings
                </h2>
                <button
                  onClick={fetchBookings}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-ocean-blue text-white hover:bg-opacity-90'
                  } disabled:opacity-50`}
                  title="Refresh bookings"
                >
                  <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
              {loading ? (
                <p className="text-center py-8">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-center py-8 text-charcoal/70">No bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Reference
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Guest
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Room
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Check-In
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Check-Out
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Status
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white/70' : 'text-charcoal/70'}`}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className={`border-b ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`py-4 px-4 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                            {booking.bookingReference}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                            {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white/80' : 'text-charcoal/70'}`}>
                            {booking.room?.name || 'N/A'}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white/80' : 'text-charcoal/70'}`}>
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className={`py-4 px-4 ${darkMode ? 'text-white/80' : 'text-charcoal/70'}`}>
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'checked-in'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className={`py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-ocean-blue'}`}>
                            ${booking.totalPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* NOTE: Image upload modals removed. Backend sets default images automatically. */}
      </div>
    </div>
  );
};

export default Admin;
