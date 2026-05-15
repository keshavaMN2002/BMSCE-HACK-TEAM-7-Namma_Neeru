import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';
import { useAuthStore } from '../store/authStore';
import { getDefaultRoute } from '../utils/getDefaultRoute';

const Unauthorized = () => {
  const user = useAuthStore(state => state.user);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-content-primary mb-2 text-center">Access Denied</h1>
      <p className="text-content-secondary mb-8 text-center max-w-sm">
        You do not have permission to access this page. Please return to your designated portal.
      </p>
      <NavLink to={user ? getDefaultRoute(user.role) : '/'}>
        <Button size="lg" className="px-8 shadow-premium shadow-primary-blue/30 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Return to Dashboard
        </Button>
      </NavLink>
    </div>
  );
};

export default Unauthorized;
