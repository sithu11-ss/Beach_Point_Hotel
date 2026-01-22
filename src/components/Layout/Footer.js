import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { path: '/', label: 'Home' },
      { path: '/rooms', label: 'Rooms' },
      { path: '/restaurant', label: 'Restaurant' },
      { path: '/booking', label: 'Book Now' }
    ],
    services: [
      { path: '/check-in', label: 'Check-In' },
      { path: '/check-out', label: 'Check-Out' },
      { path: '/restaurant', label: 'Reservations' },
      { path: '/admin', label: 'Admin' }
    ]
  };

  return (
    <footer className="bg-ocean-blue text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold mb-4">Beach Point Luxe Resort</h3>
            <p className="text-white/80 mb-6 max-w-md">
              Experience luxury like never before at our pristine beachfront resort. 
              Where elegance meets the ocean.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FiFacebook, label: 'Facebook' },
                { icon: FiInstagram, label: 'Instagram' },
                { icon: FiTwitter, label: 'Twitter' },
                { icon: FiMail, label: 'Email' }
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-soft-gold transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-soft-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-soft-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="max-w-md">
            <h4 className="font-heading font-semibold mb-4">Subscribe to Our Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-soft-gold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-soft-gold text-ocean-blue rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>&copy; {currentYear} Beach Point Luxe Resort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

