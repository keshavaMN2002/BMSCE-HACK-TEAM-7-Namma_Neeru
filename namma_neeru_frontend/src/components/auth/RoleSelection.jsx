import React from 'react';
import { Droplets, Truck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const roles = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Book and track water tankers in real time.',
    icon: Droplets,
    color: 'text-primary-blue',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    hoverRing: 'focus-within:ring-primary-blue/30 hover:border-primary-blue/30',
  },
  {
    id: 'worker',
    title: 'Tanker Worker',
    description: 'Accept delivery requests and manage routes.',
    icon: Truck,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    hoverRing: 'focus-within:ring-green-500/30 hover:border-green-500/30',
  },
  {
    id: 'official',
    title: 'BWSSB Official',
    description: 'Monitor city-wide distribution and operations.',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    hoverRing: 'focus-within:ring-indigo-500/30 hover:border-indigo-500/30',
  }
];

const RoleSelection = () => {
  const { setSelectedRole, authMode, setAuthMode } = useAuthStore();

  const handleSelect = (roleId) => {
    // BWSSB Officials cannot register publicly. Force them to login mode.
    if (roleId === 'official' && authMode === 'register') {
      setAuthMode('login');
    }
    setSelectedRole(roleId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className={`group relative text-left p-6 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-premium transition-all duration-300 focus:outline-none focus:ring-4 ${role.hoverRing} hover:-translate-y-1`}
          >
            {/* Absolute Border for idle state */}
            <div className="absolute inset-0 rounded-2xl border border-slate-200 group-hover:border-transparent transition-colors pointer-events-none"></div>
            
            <div className={`w-14 h-14 rounded-2xl ${role.bg} ${role.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-7 h-7 ${role.color}`} />
            </div>
            
            <h3 className="font-extrabold text-slate-900 text-lg mb-2 group-hover:text-primary-blue transition-colors">
              {role.title}
            </h3>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {role.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelection;
