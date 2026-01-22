import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiUsers, FiMaximize2, FiCheck } from 'react-icons/fi';
import { roomsAPI } from '../services/api';
import Button from '../components/UI/Button';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getById(id);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-charcoal/70 text-lg">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-ocean-blue mb-4">Room not found</h2>
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-sand-beige">
      {/* Image Gallery */}
      <section className="relative h-[60vh] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
          className="h-full"
        >
          {(room.images && room.images.length > 0 ? room.images : [room.image]).map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={image}
                  alt={`${room.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-blue/60 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Room Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-heading font-bold text-ocean-blue mb-2">
                    {room.name}
                  </h1>
                  <p className="text-2xl font-semibold text-soft-gold">
                    ${room.price} <span className="text-base text-charcoal/70 font-normal">per night</span>
                  </p>
                </div>
              </div>

              <p className="text-charcoal/70 text-lg mb-6">{room.description}</p>

              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-ocean-blue" size={24} />
                  <div>
                    <p className="text-sm text-charcoal/60">Max Guests</p>
                    <p className="font-semibold text-ocean-blue">{room.maxGuests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMaximize2 className="text-ocean-blue" size={24} />
                  <div>
                    <p className="text-sm text-charcoal/60">Room Size</p>
                    <p className="font-semibold text-ocean-blue">{room.size}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold text-ocean-blue mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FiCheck className="text-soft-gold" />
                      <span className="text-charcoal/70">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 sticky top-24"
            >
              <h3 className="text-2xl font-heading font-bold text-ocean-blue mb-6">
                Book This Room
              </h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-ocean-blue mb-2">
                  ${room.price}
                  <span className="text-base font-normal text-charcoal/70">/night</span>
                </p>
                <p className="text-sm text-charcoal/60">Taxes and fees included</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full mb-4"
                onClick={() => navigate(`/booking?roomId=${room._id || room.id}`)}
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => navigate('/rooms')}
              >
                View All Rooms
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;

