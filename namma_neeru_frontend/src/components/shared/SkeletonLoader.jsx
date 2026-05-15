import React from 'react';

const SkeletonLoader = ({ className = '', type = 'rect' }) => {
  const baseClass = "animate-pulse bg-slate-200";
  
  if (type === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`}></div>;
  }
  
  return <div className={`${baseClass} rounded-lg ${className}`}></div>;
};

export default SkeletonLoader;
