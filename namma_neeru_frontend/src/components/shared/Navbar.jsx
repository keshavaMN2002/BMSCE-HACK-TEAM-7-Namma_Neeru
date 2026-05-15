import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Droplet, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/roles';

const Navbar = () => {
  const { user, openModal, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await fetch("http://127.0.0.1:8000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    logout(); // clear frontend auth state

    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center transition-transform group-hover:scale-105">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-content-primary leading-tight group-hover:text-primary-blue transition-colors">NammaNeeru</h1>
              <p className="text-[10px] text-content-secondary hidden sm:block">Smart Water. Better Bengaluru.</p>
            </div>
          </NavLink>

          {/* Navigation */}
          <div className="hidden md:flex space-x-8">
            {(!user || user.role === ROLES.CUSTOMER) && (
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-blue border-b-2 border-primary-blue pb-5 pt-6' : 'text-content-secondary hover:text-content-primary pt-6 pb-5'}`} end>Home</NavLink>
            )}
            {user?.role === ROLES.CUSTOMER && (
              <NavLink to="/book" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-blue border-b-2 border-primary-blue pb-5 pt-6' : 'text-content-secondary hover:text-content-primary pt-6 pb-5'}`}>Book Tanker</NavLink>
            )}
            {user?.role === ROLES.WORKER && (
              <NavLink to="/worker" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-blue border-b-2 border-primary-blue pb-5 pt-6' : 'text-content-secondary hover:text-content-primary pt-6 pb-5'}`}>Track Order</NavLink>
            )}
            {user?.role === ROLES.OFFICIAL && (
              <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-blue border-b-2 border-primary-blue pb-5 pt-6' : 'text-content-secondary hover:text-content-primary pt-6 pb-5'}`} end>Dashboard</NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-content-secondary hover:text-content-primary hover:bg-slate-100 rounded-full transition-colors relative hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-surface-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                    <User className="w-5 h-5 text-content-secondary" />
                  </div>
                  <div className="hidden sm:block pr-2">
                    <p className="text-sm font-bold text-content-primary leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] text-content-secondary font-medium uppercase tracking-wider leading-none">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 ml-2">
                <button 
                  onClick={() => openModal('login')}
                  className="px-4 py-2 text-sm font-bold text-content-primary hover:text-primary-blue transition-colors rounded-xl hover:bg-blue-50/50"
                >
                  Login
                </button>
                <button 
                  onClick={() => openModal('register')}
                  className="px-5 py-2 text-sm font-bold text-white bg-primary-blue hover:bg-blue-700 transition-colors rounded-xl shadow-sm shadow-primary-blue/30"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
