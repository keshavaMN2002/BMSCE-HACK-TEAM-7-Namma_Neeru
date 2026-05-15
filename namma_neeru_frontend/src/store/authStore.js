import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isModalOpen: false,
  authMode: 'login', // 'login' | 'register'
  selectedRole: null, // 'customer' | 'worker' | 'official' | null
  user: null, // { name, role, ... } or null if not logged in

  openModal: (mode = 'login') => set({ isModalOpen: true, authMode: mode, selectedRole: null }),
  closeModal: () => set({ isModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  
  // Mock login function
  login: (userData) => set({ user: userData, isModalOpen: false }),
  logout: () => set({ user: null })
}));
