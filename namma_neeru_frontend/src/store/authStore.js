import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isModalOpen: false,
      authMode: 'login', // 'login' | 'register'
      selectedRole: null, // 'customer' | 'worker' | 'official' | null
      user: null, // { name, role, ... } or null if not logged in
      token: null,
      isHydrated: false,
      intendedRoute: null,

      setHydrated: (state) => set({ isHydrated: state }),
      setIntendedRoute: (route) => set({ intendedRoute: route }),

      openModal: (mode = 'login') => set({ isModalOpen: true, authMode: mode, selectedRole: null }),
      closeModal: () => set({ isModalOpen: false }),
      setAuthMode: (mode) => set({ authMode: mode }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      
      // Mock login function
      login: (userData, token = 'mock-jwt-token') => set({ user: userData, token, isModalOpen: false }),
      logout: () => set({ user: null, token: null, intendedRoute: null, selectedRole: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        selectedRole: state.selectedRole, 
        token: state.token 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
