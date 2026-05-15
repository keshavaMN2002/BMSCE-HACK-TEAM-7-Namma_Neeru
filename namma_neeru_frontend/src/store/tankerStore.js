import { create } from 'zustand';
import { MOCK_TANKERS } from '../mock/tankers';

export const useTankerStore = create((set) => ({
  tankers: MOCK_TANKERS,
  selectedTankerId: null,
  
  setSelectedTanker: (id) => set({ selectedTankerId: id }),
  
  updateTankerLocation: (id, newLocation) => set((state) => ({
    tankers: state.tankers.map(t => 
      t.id === id ? { ...t, location: newLocation } : t
    )
  })),
}));
