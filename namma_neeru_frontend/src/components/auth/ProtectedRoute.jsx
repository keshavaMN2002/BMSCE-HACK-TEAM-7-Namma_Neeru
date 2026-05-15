import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isHydrated, openModal, setIntendedRoute } = useAuthStore();
  const location = useLocation();

  // Show a loading state until Zustand rehydrates from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    // Open modal with intended route remembered
    setTimeout(() => {
      setIntendedRoute(location.pathname);
      openModal('login');
    }, 0);
    // Redirect to home safely without triggering modal continuously
    return <Navigate to="/" replace />;
  }

  // If role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
