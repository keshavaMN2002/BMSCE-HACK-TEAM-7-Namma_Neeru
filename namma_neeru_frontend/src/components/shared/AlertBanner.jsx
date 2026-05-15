import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const AlertBanner = ({ type = 'info', title, message, confidence }) => {
  const configs = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-primary-blue" />
    }
  };

  const config = configs[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${config.bg} ${config.border} flex items-start gap-3`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold text-sm ${config.text}`}>{title}</h4>
          {confidence && (
            <span className="text-xs font-medium bg-white/50 px-2 py-0.5 rounded text-content-secondary">
              Confidence: {confidence}
            </span>
          )}
        </div>
        <p className="text-sm mt-1 text-content-secondary leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

export default AlertBanner;
