import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const baseStyles = 'bg-surface-card rounded-2xl border border-surface-border p-5 shadow-sm transition-shadow duration-200';
  const hoverStyles = hover ? 'hover:shadow-soft cursor-pointer' : '';

  return (
    <motion.div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
