import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiMaximize2 } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';

const RoomCard = ({ room, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card hover className="h-full">
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={room.image || 'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800'}
            alt={room.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800';
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-ocean-blue font-semibold">${room.price}/night</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-heading font-bold text-ocean-blue mb-2">
            {room.name}
          </h3>
          <p className="text-charcoal/70 mb-4 line-clamp-2">{room.description}</p>
          <div className="flex items-center gap-4 mb-4 text-sm text-charcoal/60">
            <div className="flex items-center gap-1">
              <FiUsers />
              <span>{room.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMaximize2 />
              <span>{room.size}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-sand-beige text-ocean-blue text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
          <Link to={`/rooms/${room._id || room.id}`}>
            <Button variant="primary" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;

