import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import RoleSelection from './RoleSelection';
import AuthForms from './AuthForms';

const AuthModal = () => {
  const { isModalOpen, closeModal, selectedRole, setAuthMode, authMode } = useAuthStore();

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, closeModal]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          ></motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white overflow-hidden my-auto z-10"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar relative">
              {/* Dynamic Content */}
              <AnimatePresence mode="wait">
                {!selectedRole ? (
                  <motion.div
                    key="role-selection"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-8 sm:p-12 w-full"
                  >
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        {authMode === 'login' ? 'Welcome Back' : 'Join NammaNeeru'}
                      </h2>
                      <p className="text-slate-500 font-medium">
                        Access the platform based on your account type.
                      </p>
                    </div>
                    
                    <RoleSelection />

                    <div className="mt-10 text-center border-t border-slate-100 pt-6">
                      <p className="text-sm text-slate-500 font-medium">
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button 
                          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                          className="text-primary-blue font-bold hover:underline focus:outline-none"
                        >
                          {authMode === 'login' ? 'Register here' : 'Login here'}
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-forms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 sm:p-12 w-full"
                  >
                    <AuthForms />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
