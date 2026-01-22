import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { menuAPI, reservationsAPI } from '../services/api';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
// Payment form commented out - payment not required
// import CardPaymentForm, { validateCardDetails } from '../components/Payment/CardPaymentForm';
import 'react-datepicker/dist/react-datepicker.css';

const Restaurant = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reservationDate, setReservationDate] = useState(null);
  const [reservationTime, setReservationTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const handleReservation = async (e) => {
    e.preventDefault();
    // Payment validation commented out - payment not required
    // const errs = validateCardDetails(cardDetails);
    // setCardErrors(errs);
    // if (Object.keys(errs).length > 0) return;

    try {
      if (!reservationDate || !reservationTime) {
        alert('Please select date and time');
        return;
      }

      await reservationsAPI.create({
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        date: reservationDate.toISOString(),
        time: reservationTime,
        guests: guests
      });

      setIsReserved(true);
      setTimeout(() => {
        setIsReserved(false);
        setShowReservationForm(false);
        setReservationData({ name: '', email: '', phone: '' });
        setReservationDate(null);
        setReservationTime('');
        setCardDetails({ nameOnCard: '', cardNumber: '', expiry: '', cvc: '' });
        setCardErrors({});
      }, 3000);
    } catch (error) {
      alert('Error creating reservation: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-sand-beige">
      {/* Header */}
      <section className="bg-ocean-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
          >
            Fine Dining Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Savor exquisite cuisine with breathtaking ocean views
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Reservation Button */}
        <div className="text-center mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowReservationForm(!showReservationForm)}
          >
            {showReservationForm ? 'Cancel Reservation' : 'Reserve a Table'}
          </Button>
        </div>

        {/* Reservation Form */}
        <AnimatePresence>
          {showReservationForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <Card className="p-8">
                {isReserved ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-heading font-bold text-ocean-blue mb-2">
                      Reservation Confirmed!
                    </h3>
                    <p className="text-charcoal/70">
                      Payment received. A confirmation email will be sent to {reservationData.email}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReservation}>
                    <h3 className="text-2xl font-heading font-bold text-ocean-blue mb-6">
                      Table Reservation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                          <FiCalendar /> Date
                        </label>
                        <DatePicker
                          selected={reservationDate}
                          onChange={(date) => setReservationDate(date)}
                          minDate={new Date()}
                          placeholderText="Select date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                          <FiClock /> Time
                        </label>
                        <select
                          value={reservationTime}
                          onChange={(e) => setReservationTime(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                          required
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
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
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-ocean-blue hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={reservationData.name}
                          onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={reservationData.email}
                          onChange={(e) => setReservationData({ ...reservationData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={reservationData.phone}
                          onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                        />
                      </div>
                    </div>

                    {/* Payment Section - Commented out as payment is not required */}
                    {/* <div className="mb-6">
                      <div className="mb-3">
                        <h4 className="text-xl font-heading font-bold text-ocean-blue">
                          Payment (Required)
                        </h4>
                        <p className="text-sm text-charcoal/70">
                          To confirm your table reservation, please complete the card payment.
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

                    <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto">
                      Confirm Reservation
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Categories */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-ocean-blue text-white shadow-lg'
                  : 'bg-white text-charcoal hover:bg-ocean-blue hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-charcoal/70 text-lg">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-heading font-semibold text-ocean-blue">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-soft-gold">${item.price}</span>
                    </div>
                    <p className="text-sm text-charcoal/70 mb-2">{item.category}</p>
                    <p className="text-charcoal/60 text-sm">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {!loading && filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal/70 text-lg">No menu items available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;

