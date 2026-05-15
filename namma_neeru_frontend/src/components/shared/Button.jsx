import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary-blue text-white shadow-soft hover:shadow-premium hover:bg-blue-700',
    secondary: 'bg-primary-cyan text-primary-blue hover:bg-blue-100',
    outline: 'border-2 border-surface-border text-content-primary hover:border-primary-blue',
    ghost: 'text-content-secondary hover:text-content-primary hover:bg-slate-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
};

export default Button;
