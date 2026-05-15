import { useTankerStore } from '../store/tankerStore';
import { useAlertStore } from '../store/alertStore';

let simulationInterval = null;

const SIMULATION_ACTIVITIES = [
  "Tanker assigned in Whitefield",
  "Delivery completed in HSR Layout",
  "Water demand increasing in Marathahalli",
  "Reservoir level stable in South Bengaluru",
  "New booking confirmed in Indiranagar"
];

export const startSimulation = () => {
  if (simulationInterval) return;
  
  // Every 5 seconds, simulate movement or activity
  simulationInterval = setInterval(() => {
    // 1. Move a random tanker slightly
    const tankers = useTankerStore.getState().tankers;
    const activeTankers = tankers.filter(t => t.status === "On Delivery");
    
    if (activeTankers.length > 0) {
      const tankerToMove = activeTankers[Math.floor(Math.random() * activeTankers.length)];
      // Add small jitter to lat/lng
      const newLat = tankerToMove.location.lat + (Math.random() - 0.5) * 0.005;
      const newLng = tankerToMove.location.lng + (Math.random() - 0.5) * 0.005;
      
      useTankerStore.getState().updateTankerLocation(tankerToMove.id, { lat: newLat, lng: newLng });
    }
    
    // 2. Add random live activity (10% chance per tick)
    if (Math.random() > 0.9) {
      const randomActivity = SIMULATION_ACTIVITIES[Math.floor(Math.random() * SIMULATION_ACTIVITIES.length)];
      useAlertStore.getState().addLiveActivity({
        id: Date.now(),
        text: randomActivity,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }, 5000);
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};
