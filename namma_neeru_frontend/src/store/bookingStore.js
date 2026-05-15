import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  isBooking: false,
  selectedQuantity: 2000,
  selectedType: 'Instant',
  deliveryLocation: null,
  activeBooking: null,
  
  setBookingState: (state) => set((prev) => ({ ...prev, ...state })),
  
  createBooking: (tankerId, details) => set({ 
    activeBooking: { tankerId, ...details, status: 'Confirmed', eta: '18 mins' },
    isBooking: false 
  }),
  
  cancelBooking: () => set({ activeBooking: null })
}));
