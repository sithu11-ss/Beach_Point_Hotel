import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import Button from '../components/UI/Button';
import RoomCard from '../components/UI/RoomCard';
import { roomsAPI, menuAPI } from '../services/api';
import { features, testimonials } from '../data/dummyData';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchMenuItems();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };
  const heroImage =
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2200&auto=format&fit=crop&q=70';

  const gallery = [
    {
      title: 'Sunrise Over The Infinity Edge',
      subtitle: 'A quiet ritual above the tide line',
      image:
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&auto=format&fit=crop&q=70'
    },
    {
      title: 'Private Cabana Service',
      subtitle: 'Silk shade, chilled towels, ocean air',
      image:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&auto=format&fit=crop&q=70'
    },
    {
      title: 'Signature Spa Sanctuary',
      subtitle: 'Mineral therapies, warm stone, calm',
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&auto=format&fit=crop&q=70'
    },
    {
      title: 'Chef’s Table by the Sea',
      subtitle: 'Seasonal tasting with ocean-view seating',
      image:
        'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600&auto=format&fit=crop&q=70'
    }
  ];

  const signatureExperiences = [
    {
      label: 'Gold Hour Cruise',
      title: 'Sunset Champagne Sail',
      description: 'A private catamaran with curated bites and coastal panoramas.'
    },
    {
      label: 'Wellness',
      title: 'Ocean-Temperature Ritual',
      description: 'Thermal contrast therapy inspired by the rhythm of the sea.'
    },
    {
      label: 'Culinary',
      title: 'Chef’s Tasting Journey',
      description: 'Seven courses, local harvest, wine pairing — elegantly paced.'
    },
    {
      label: 'Romance',
      title: 'Candlelit Beach Dinner',
      description: 'White-glove service beneath lanterns and starlight.'
    }
  ];

  const stats = [
    { value: '24/7', label: 'Butler Service' },
    { value: '3', label: 'Oceanfront Pools' },
    { value: '12', label: 'Signature Suites' },
    { value: '5★', label: 'Guest Rating' }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-ocean-blue/55 to-black/70" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="text-center text-white"
            >
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.35em] uppercase text-white/80"
              >
                <span className="h-px w-10 bg-white/50" />
                Coastal Luxury Collection
                <span className="h-px w-10 bg-white/50" />
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-5xl md:text-7xl font-heading font-bold leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
              >
                Beach Point
                <span className="block text-white/95">Luxe Resort</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto"
              >
                Cinematic mornings, oceanfront calm, and suites designed for slow, beautiful time.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/booking">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Book Your Stay
                  </Button>
                </Link>
                <Link to="/rooms">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white/80 text-white hover:bg-white hover:text-ocean-blue"
                  >
                    Explore Suites <FiArrowRight className="inline ml-2" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-4 py-4"
                  >
                    <div className="text-2xl md:text-3xl font-heading font-bold">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-white/80 tracking-wide">
                      {item.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Cinematic Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
          >
            <div className="lg:col-span-5">
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue"
              >
                A Resort Shot Like Cinema
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 text-lg text-charcoal/70 max-w-xl"
              >
                From sunrise rituals to evening candlelight, every space is composed for
                stillness, warmth, and light.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <Link to="/rooms">
                  <Button variant="primary" size="lg">
                    Discover Signature Suites <FiArrowRight className="inline ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {gallery.map((item, idx) => (
                  <motion.div
                    key={`${item.title}-${idx}`}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(2,31,45,0.18)]"
                  >
                    <div className="relative h-64 sm:h-72">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                      <div className="absolute inset-0 ring-1 ring-black/5" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs tracking-[0.3em] uppercase text-white/70">
                        {item.subtitle}
                      </p>
                      <h3 className="mt-2 text-xl font-heading font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-4">
              Signature Suites
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Ocean-facing designs, quiet materials, and details that feel intentionally rare.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room, index) => (
              <RoomCard key={room._id || room.id} room={room} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/rooms">
              <Button variant="outline" size="lg">
                View All Suites <FiArrowRight className="inline ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="py-20 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-5">
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue"
              >
                Signature Experiences
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 text-lg text-charcoal/70 max-w-xl"
              >
                Curated moments that feel effortless — paced to the ocean, finished with
                thoughtful service.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <Link to="/booking">
                  <Button variant="secondary" size="lg">
                    Plan Your Stay
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {signatureExperiences.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_18px_45px_rgba(2,31,45,0.10)] p-6"
                >
                  <p className="text-xs tracking-[0.3em] uppercase text-ocean-blue/70">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-xl font-heading font-bold text-ocean-blue">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-charcoal/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurant Preview Section */}
      <section className="py-20 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-4">
              Fine Dining Experience
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Savor exquisite cuisine with breathtaking ocean views
            </p>
          </motion.div>

          {menuItems.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="pb-12"
            >
              {menuItems.slice(0, 6).map((item) => (
                <SwiperSlide key={item._id || item.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-blue/90 via-ocean-blue/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-white/90 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-soft-gold">
                          ${item.price}
                        </span>
                        <Link to="/restaurant">
                          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-semibold">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <p className="text-charcoal/70">Loading menu items...</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/restaurant">
              <Button variant="primary" size="lg">
                View Menu & Reserve Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Experience the difference of true luxury hospitality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-6xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-heading font-semibold text-ocean-blue mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            variants={stagger}
            className="relative overflow-hidden rounded-[2.5rem] bg-ocean-blue text-white shadow-[0_45px_120px_rgba(2,31,45,0.35)]"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_65%,rgba(255,255,255,0.18),transparent_55%)]" />
            <div className="relative p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                <motion.h3
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-heading font-bold"
                >
                  Your oceanfront chapter starts here.
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-4 text-white/85 text-lg">
                  Secure your preferred dates, choose a suite, and we’ll take care of every
                  detail — quietly, beautifully.
                </motion.p>
              </div>
              <motion.div
                variants={fadeUp}
                className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 lg:justify-self-end"
              >
                <Link to="/booking" className="w-full">
                  <Button variant="secondary" size="lg" className="w-full">
                    Check Availability
                  </Button>
                </Link>
                <Link to="/rooms" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-white/80 text-white hover:bg-white hover:text-ocean-blue"
                  >
                    Compare Suites
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-4">
              Guest Reviews
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-soft-gold fill-current" />
                  ))}
                </div>
                <p className="text-charcoal/70 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-ocean-blue">— {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

