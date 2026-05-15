import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AuthForms = () => {
  const { authMode, selectedRole, setAuthMode, setSelectedRole, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    vehicle: '',
    dl: '',
    officialId: '',
    password: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock User Data based on role
      const mockUser = {
        name: formData.name || (selectedRole === 'official' ? 'Gov Official' : 'User'),
        role: selectedRole === 'official' ? 'BWSSB Official' : selectedRole === 'worker' ? 'Tanker Worker' : 'Customer',
        id: selectedRole === 'official' ? formData.officialId : 'USR-1234'
      };

      login(mockUser);
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Authentication Successful</span>
          <span className="text-sm">Welcome back, {mockUser.name}</span>
        </div>,
        {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
        }
      );
    }, 1200);
  };

  const InputField = ({ label, name, type = 'text', placeholder, required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition-all placeholder:text-slate-400 font-medium"
      />
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header / Back Button */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => setSelectedRole(null)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
            {selectedRole === 'official' ? 'Official Portal' : 
             authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm font-medium text-slate-500 capitalize">
            {selectedRole === 'official' ? 'Secure BWSSB Access' : `${selectedRole} Access`}
          </p>
        </div>
      </div>

      {/* Official specific badge */}
      {selectedRole === 'official' && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-xs font-medium text-indigo-800 leading-relaxed">
            You are accessing a secure government portal. All activities are monitored and logged.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        
        {/* CUSTOMER & WORKER REGISTRATION */}
        {authMode === 'register' && selectedRole !== 'official' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <InputField label="Full Name" name="name" placeholder="Enter your full name" />
            <InputField label="Mobile Number" name="mobile" type="tel" placeholder="+91 98765 43210" />
            <InputField label="Aadhaar Number" name="aadhaar" placeholder="12-digit Aadhaar number" />
            
            {/* WORKER SPECIFIC */}
            {selectedRole === 'worker' && (
              <>
                <InputField label="Vehicle Registration Number" name="vehicle" placeholder="e.g. KA-01-AB-1234" />
                <InputField label="Driving License Number" name="dl" placeholder="Enter DL number" />
                
                <div className="mb-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-bold text-slate-700 mb-1">Upload Documents</p>
                  <p className="text-xs text-slate-500 mb-3">DL and Vehicle Verification PDF/JPG</p>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-primary-blue hover:bg-slate-50 transition-colors">
                    Choose Files
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* CUSTOMER & WORKER LOGIN */}
        {authMode === 'login' && selectedRole !== 'official' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <InputField label="Mobile Number" name="mobile" type="tel" placeholder="+91 98765 43210" />
            <InputField label="Password or OTP" name="password" type="password" placeholder="Enter password or OTP" />
          </motion.div>
        )}

        {/* OFFICIAL LOGIN (Only Login allowed) */}
        {selectedRole === 'official' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <InputField label="Official User ID" name="officialId" placeholder="e.g. BWSSB-EMP-2024" />
            <InputField label="Secure Password" name="password" type="password" placeholder="Enter your portal password" />
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-4 bg-primary-blue text-white font-bold rounded-xl shadow-premium shadow-primary-blue/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              {authMode === 'login' ? 'Secure Login' : 'Complete Registration'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Footer */}
      {selectedRole !== 'official' && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-primary-blue font-bold hover:underline focus:outline-none"
            >
              {authMode === 'login' ? 'Register now' : 'Login instead'}
            </button>
          </p>
        </div>
      )}

    </div>
  );
};

export default AuthForms;
