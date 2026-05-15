import React, { useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import MapboxWrapper from '../components/maps/MapboxWrapper';
import { useTankerStore } from '../store/tankerStore';
import { SwitchCamera, CheckCircle2, XCircle, Navigation, Clock, ShieldCheck, TrendingUp } from 'lucide-react';

const WorkerApp = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  // Route coordinates for worker view (mock)
  const routeCoords = [
    { lat: 12.9716, lng: 77.5946 },
    { lat: 12.9650, lng: 77.6000 },
    { lat: 12.9500, lng: 77.6100 },
    { lat: 12.9352, lng: 77.6245 }
  ];

  return (
    <div className="min-h-screen bg-surface pb-20">
      <Navbar />
      
      <main className="max-w-md mx-auto sm:max-w-2xl lg:max-w-5xl px-4 py-6 flex flex-col gap-6">
        
        {/* TOP DASHBOARD CARD */}
        <div className="bg-primary-blue rounded-3xl p-6 text-white relative overflow-hidden shadow-premium">
          <div className="absolute -right-10 -bottom-10 opacity-20 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-sm font-medium text-white/80">Today's Earnings</h2>
              <p className="text-4xl font-bold mt-1">₹2,450</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div>
              <p className="text-white/80 text-xs">Completed Orders</p>
              <p className="font-semibold text-lg">8</p>
            </div>
            <div>
              <p className="text-white/80 text-xs">Rating</p>
              <p className="font-semibold text-lg flex items-center gap-1">4.8 <span className="text-yellow-400 text-sm">★</span></p>
            </div>
          </div>
        </div>

        {/* NEW DELIVERY REQUESTS */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-content-primary">New Delivery Requests</h3>
            <span className="text-xs font-medium text-primary-blue">View All</span>
          </div>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary-blue">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-content-primary text-sm">HSR Layout, Sector 2</h4>
                    <p className="text-xs text-content-secondary">2,000 Liters</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-content-secondary">2 min</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-surface-border">
                <div>
                  <p className="text-xs text-content-secondary">Customer</p>
                  <p className="text-sm font-semibold text-content-primary flex items-center gap-2">Aishwarya R. <span className="font-bold">₹650</span></p>
                  <p className="text-xs text-content-secondary mt-0.5">3.2 km away</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="px-3">Decline</Button>
                  <Button variant="primary" size="sm" className="px-6 shadow-premium">Accept</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* LIVE ROUTE MAP */}
        <div>
          <h3 className="font-bold text-content-primary mb-3">Live Map</h3>
          <div className="h-64 rounded-3xl overflow-hidden border border-surface-border shadow-soft relative">
            <MapboxWrapper showRoute routeCoordinates={routeCoords} />
            <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-content-primary border border-surface-border">
              Traffic: Light
            </div>
          </div>
        </div>

        {/* TODAY'S SCHEDULE */}
        <div>
          <h3 className="font-bold text-content-primary mb-3">Today's Schedule</h3>
          <Card>
            <div className="space-y-6 relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-primary-blue border-4 border-white shadow-sm mt-0.5 shrink-0"></div>
                <div className="flex-1 flex justify-between items-center pb-6 border-b border-surface-border">
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">Koramangala 4th Block</h4>
                    <p className="text-xs text-content-secondary">1,000 Liters</p>
                  </div>
                  <Badge variant="success">In Progress</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 mt-0.5 shrink-0"></div>
                <div className="flex-1 flex justify-between items-center pb-6 border-b border-surface-border">
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">Harlur</h4>
                    <p className="text-xs text-content-secondary">2,000 Liters</p>
                  </div>
                  <span className="text-xs font-medium text-primary-blue">Upcoming</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COMPLIANCE */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col justify-center items-center text-center p-4">
            <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="text-sm font-bold">Verified Tanker</h4>
            <p className="text-[10px] text-content-secondary mt-1">Valid till 24 May 2025</p>
          </Card>
          <Card className="flex flex-col justify-center items-center text-center p-4">
            <TrendingUp className="w-8 h-8 text-primary-blue mb-2" />
            <h4 className="text-sm font-bold">92% Completion</h4>
            <p className="text-[10px] text-content-secondary mt-1">Excellent Rate</p>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default WorkerApp;
