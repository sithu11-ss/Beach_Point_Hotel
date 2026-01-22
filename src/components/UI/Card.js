import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  onClick 
}) => {
  const baseStyles = 'rounded-2xl overflow-hidden';
  const glassStyles = glass ? 'glass backdrop-blur-md bg-white/10' : 'bg-white shadow-lg';
  const hoverStyles = hover ? 'cursor-pointer' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;

