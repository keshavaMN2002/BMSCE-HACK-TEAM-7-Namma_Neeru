import React from 'react';
import { NavLink } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-slate-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-content-primary mb-2 text-center">Page Not Found</h1>
      <p className="text-content-secondary mb-8 text-center max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <NavLink to="/">
        <Button size="lg" className="px-8 shadow-premium shadow-primary-blue/30 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Button>
      </NavLink>
    </div>
  );
};

export default NotFound;
