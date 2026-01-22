import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/restaurant', label: 'Restaurant' },
    { path: '/check-in', label: 'Check-In' },
    { path: '/admin', label: 'Admin' }
  ];

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? 'bg-white/75 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,31,45,0.18)] border-white/20'
          : 'bg-white/5 backdrop-blur-md shadow-[0_0px_0px_rgba(0,0,0,0)] border-white/10'
      } rounded-b-2xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-heading font-bold text-ocean-blue tracking-wide"
            >
              Beach Point Luxe
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium tracking-[0.08em] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:rounded-full after:bg-soft-gold/80 after:opacity-0 after:scale-x-75 after:origin-center after:transition-all after:duration-300 hover:after:opacity-70 hover:after:scale-x-100 ${
                  location.pathname === link.path
                    ? 'text-ocean-blue'
                    : 'text-charcoal hover:text-ocean-blue'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-soft-gold"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <Link
              to="/booking"
              className="px-6 py-2 bg-ocean-blue text-white rounded-full font-medium tracking-wide transition-all duration-300 hover:bg-opacity-90 hover:shadow-[0_16px_50px_rgba(2,31,45,0.25)] hover:scale-[1.02] active:scale-[0.99]"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-charcoal p-2 rounded-xl transition-colors hover:bg-white/20 active:bg-white/25"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/20 shadow-[0_22px_70px_rgba(2,31,45,0.18)] rounded-b-2xl"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium tracking-wide transition-colors ${
                    location.pathname === link.path
                      ? 'text-ocean-blue'
                      : 'text-charcoal hover:text-ocean-blue'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-2 bg-ocean-blue text-white rounded-full font-medium tracking-wide transition-all duration-300 hover:bg-opacity-90 hover:shadow-[0_16px_50px_rgba(2,31,45,0.22)] active:scale-[0.99]"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

