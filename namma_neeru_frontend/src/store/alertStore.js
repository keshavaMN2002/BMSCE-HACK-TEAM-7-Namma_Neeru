import { create } from 'zustand';
import { MOCK_CRISIS_ALERTS } from '../mock/dashboardStats';

export const useAlertStore = create((set) => ({
  alerts: MOCK_CRISIS_ALERTS,
  liveActivities: [],
  
  addLiveActivity: (activity) => set((state) => ({
    liveActivities: [activity, ...state.liveActivities].slice(0, 5)
  }))
}));
