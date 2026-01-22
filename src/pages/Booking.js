import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { roomsAPI, bookingsAPI } from '../services/api';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
// Payment form commented out - payment not required
// import CardPaymentForm, { validateCardDetails } from '../components/Payment/CardPaymentForm';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    fetchAllRooms();
  }, []);

  useEffect(() => {
    if (allRooms.length > 0 && roomId) {
      const room = allRooms.find(r => (r._id || r.id) === roomId);
      if (room) {
        setSelectedRoom(room);
      }
    } else if (allRooms.length > 0 && !selectedRoom) {
      setSelectedRoom(allRooms[0]);
    }
  }, [allRooms, roomId]);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getAll();
      const rooms = response.data || [];
      setAllRooms(rooms);
      
      // Set initial selected room
      if (roomId) {
        const room = rooms.find(r => (r._id || r.id) === roomId);
        if (room) {
          setSelectedRoom(room);
        } else if (rooms.length > 0) {
          setSelectedRoom(rooms[0]);
        }
      } else if (rooms.length > 0) {
        setSelectedRoom(rooms[0]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomChange = (e) => {
    const selectedRoomId = e.target.value;
    const room = allRooms.find(r => (r._id || r.id) === selectedRoomId);
    if (room) {
      setSelectedRoom(room);
      // Update URL without reload
      navigate(`/booking?roomId=${selectedRoomId}`, { replace: true });
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const calculateTotal = () => {
    if (!selectedRoom) {
      return { nights: 0, subtotal: 0, tax: 0, total: 0 };
    }
    const nights = calculateNights();
    const subtotal = selectedRoom.price * nights;
    const tax = subtotal * 0.1;
    return {
      nights,
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Payment validation commented out - payment not required
      // const errs = validateCardDetails(cardDetails);
      // setCardErrors(errs);
      // if (Object.keys(errs).length > 0) return;

      try {
        if (!selectedRoom) {
          alert('Please select a room');
          return;
        }
        
        if (!checkIn || !checkOut) {
          alert('Please select check-in and check-out dates');
          return;
        }
        
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          alert('Please fill in all required guest information');
          return;
        }
        
        const nights = calculateNights();
        const subtotal = selectedRoom.price * nights;
        const tax = subtotal * 0.1;
        const totalPrice = subtotal + tax;

        await bookingsAPI.create({
          roomId: selectedRoom._id || selectedRoom.id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
          guestInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            specialRequests: formData.specialRequests || ''
          },
          subtotal,
          tax,
          totalPrice
        });

        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Booking error:', error);
        const errorMessage = error.message || 'Failed to create booking. Please try again.';
        alert('Error creating booking: ' + errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-beige">
        <p className="text-charcoal/70 text-lg">Loading rooms...</p>
      </div>
    );
  }

  if (allRooms.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-beige">
        <div className="text-center">
          <p className="text-charcoal/70 text-lg mb-4">No rooms available at the moment.</p>
          <Button onClick={() => navigate('/rooms')}>View All Rooms</Button>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-beige">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <FiCheckCircle className="text-6xl text-green-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-ocean-blue mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-charcoal/70 mb-6">
            Your reservation is confirmed — a confirmation email will be sent to {formData.email}
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </motion.div>
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div className="min-h-screen pt-20 pb-20 bg-sand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-8 text-center"
        >
          Book Your Stay
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2].map((s) => (
                  <React.Fragment key={s}>
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step >= s
                            ? 'bg-ocean-blue text-white'
                            : 'bg-gray-200 text-charcoal/50'
                        }`}
                      >
                        {s}
                      </div>
                      <span className={`ml-2 font-medium ${step >= s ? 'text-ocean-blue' : 'text-charcoal/50'}`}>
                        {s === 1 ? 'Dates & Guests' : 'Guest Info & Payment'}
                      </span>
                    </div>
                    {s < 2 && (
                      <div className={`flex-1 h-1 mx-4 ${step > s ? 'bg-ocean-blue' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Room Selection Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Select Room *
                        </label>
                        <select
                          value={selectedRoom ? (selectedRoom._id || selectedRoom.id) : ''}
                          onChange={handleRoomChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue bg-white"
                          required
                        >
                          {allRooms.length === 0 ? (
                            <option value="">Loading rooms...</option>
                          ) : (
                            allRooms.map((room) => (
                              <option key={room._id || room.id} value={room._id || room.id}>
                                {room.name} - ${room.price}/night - {room.maxGuests} Guests - {room.size}
                              </option>
                            ))
                          )}
                        </select>
                        {selectedRoom && (
                          <div className="mt-3 bg-sand-beige p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-ocean-blue">{selectedRoom.name}</h3>
                                <p className="text-sm text-charcoal/70 mt-1">{selectedRoom.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-ocean-blue">${selectedRoom.price}</p>
                                <p className="text-xs text-charcoal/60">per night</p>
                              </div>
                            </div>
                            <div className="flex gap-4 text-sm text-charcoal/70 mt-2">
                              <span>👥 {selectedRoom.maxGuests} Guests</span>
                              <span>📐 {selectedRoom.size}</span>
                            </div>
                            {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {selectedRoom.amenities.slice(0, 4).map((amenity, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-white text-ocean-blue text-xs rounded-full"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Check-in Date */}
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                          <FiCalendar /> Check-in Date
                        </label>
                        <DatePicker
                          selected={checkIn}
                          onChange={(date) => setCheckIn(date)}
                          minDate={minDate}
                          placeholderText="Select check-in date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          required
                        />
                      </div>

                      {/* Check-out Date */}
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                          <FiCalendar /> Check-out Date
                        </label>
                        <DatePicker
                          selected={checkOut}
                          onChange={(date) => setCheckOut(date)}
                          minDate={checkIn || minDate}
                          placeholderText="Select check-out date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          required
                        />
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                          <FiUsers /> Number of Guests
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-ocean-blue hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xl font-semibold w-12 text-center">{guests}</span>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.min(selectedRoom?.maxGuests || 10, guests + 1))}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-ocean-blue hover:text-white transition-colors"
                          >
                            +
                          </button>
                          <span className="text-charcoal/70 text-sm">
                            (Max: {selectedRoom?.maxGuests || 10} guests)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Special Requests
                        </label>
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          placeholder="Any special requests or preferences..."
                        />
                      </div>

                      {/* Payment Section - Commented out as payment is not required */}
                      {/* <div className="pt-2">
                        <div className="mb-3">
                          <h3 className="text-xl font-heading font-bold text-ocean-blue">
                            Payment (Required)
                          </h3>
                          <p className="text-sm text-charcoal/70">
                            To confirm this booking, please complete the card payment.
                          </p>
                        </div>
                        <CardPaymentForm
                          value={cardDetails}
                          onChange={(v) => {
                            setCardDetails(v);
                            if (Object.keys(cardErrors).length > 0) setCardErrors({});
                          }}
                          errors={cardErrors}
                        />
                      </div> */}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </Button>
                  )}
                  <Button type="submit" variant="primary" className="flex-1">
                    {step === 1 ? 'Continue' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-heading font-bold text-ocean-blue mb-6">
                Booking Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Room</span>
                  <span className="font-semibold">{selectedRoom?.name || 'Select a room'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Check-in</span>
                  <span className="font-semibold">
                    {checkIn ? checkIn.toLocaleDateString() : 'Select date'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Check-out</span>
                  <span className="font-semibold">
                    {checkOut ? checkOut.toLocaleDateString() : 'Select date'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Guests</span>
                  <span className="font-semibold">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Nights</span>
                  <span className="font-semibold">{totals.nights}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-charcoal/70">Subtotal</span>
                    <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-charcoal/70">Tax (10%)</span>
                    <span className="font-semibold">${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-ocean-blue pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

