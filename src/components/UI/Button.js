import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  onClick, 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseStyles = 'font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-ocean-blue text-white hover:bg-opacity-90 hover:shadow-lg focus:ring-ocean-blue',
    secondary: 'bg-soft-gold text-ocean-blue hover:bg-opacity-90 hover:shadow-lg focus:ring-soft-gold',
    outline: 'border-2 border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white focus:ring-ocean-blue',
    ghost: 'text-ocean-blue hover:bg-ocean-blue/10 focus:ring-ocean-blue'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const motionProps = {
    whileHover: !disabled ? { scale: 1.05 } : {},
    whileTap: !disabled ? { scale: 0.95 } : {},
    className: buttonClasses
  };

  if (to) {
    const MotionLink = motion(Link);
    return (
      <MotionLink
        to={to}
        {...motionProps}
      >
        {children}
      </MotionLink>
    );
  }

  const MotionButton = motion.button;
  return (
    <MotionButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </MotionButton>
  );
};

export default Button;

