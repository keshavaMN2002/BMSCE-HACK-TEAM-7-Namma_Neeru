import React, { useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import AlertBanner from '../components/shared/AlertBanner';
import MapboxWrapper from '../components/maps/MapboxWrapper';
import { MOCK_DASHBOARD_STATS, MOCK_CRISIS_ALERTS } from '../mock/dashboardStats';
import { useAlertStore } from '../store/alertStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Activity, Truck, AlertTriangle, Users, Settings, Filter, ArrowUpRight, ArrowDownRight, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CHART_DATA = [
  { day: '14 May', demand: 400, supply: 420 },
  { day: '15 May', demand: 600, supply: 480 },
  { day: '16 May', demand: 850, supply: 600 },
  { day: '17 May', demand: 1100, supply: 750 },
  { day: '18 May', demand: 1300, supply: 800 },
  { day: '19 May', demand: 1400, supply: 900 },
  { day: '20 May', demand: 1550, supply: 1000 },
];

const SidebarItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-blue-50 text-primary-blue font-medium' : 'text-content-secondary hover:bg-slate-50 hover:text-content-primary'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-primary-blue' : ''}`} />
    <span className="text-sm">{label}</span>
  </div>
);

const DashboardApp = () => {
  const liveActivities = useAlertStore(state => state.liveActivities);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-surface-border bg-white hidden lg:flex flex-col p-4 shrink-0">
          <div className="space-y-1 mt-4">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Activity} label="Live Monitoring" />
            <SidebarItem icon={Truck} label="Tankers" />
            <SidebarItem icon={AlertTriangle} label="Crisis Prediction" />
            <SidebarItem icon={Users} label="User Management" />
            <SidebarItem icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-content-primary">Overview</h2>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-surface-border shadow-sm text-sm font-medium">
              Today, 20 May 2026
              <Filter className="w-4 h-4 ml-2 text-content-secondary" />
            </div>
          </div>

          {/* TOP METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm text-content-secondary">Total Tankers Active</h3>
              <p className="text-3xl font-bold text-content-primary mt-2">{MOCK_DASHBOARD_STATS.totalTankers}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500 font-medium">
                <ArrowUpRight className="w-4 h-4" /> {MOCK_DASHBOARD_STATS.tankersTrend}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm text-content-secondary">Crisis Zones</h3>
              <p className="text-3xl font-bold text-content-primary mt-2">{MOCK_DASHBOARD_STATS.crisisZones}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-red-500 font-medium">
                <ArrowDownRight className="w-4 h-4" /> {MOCK_DASHBOARD_STATS.crisisZonesTrend}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm text-content-secondary">Avg. Delivery Time</h3>
              <p className="text-3xl font-bold text-content-primary mt-2">{MOCK_DASHBOARD_STATS.avgDeliveryTime}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500 font-medium">
                <ArrowDownRight className="w-4 h-4" /> {MOCK_DASHBOARD_STATS.avgDeliveryTimeTrend}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm text-content-secondary">Total Deliveries</h3>
              <p className="text-3xl font-bold text-content-primary mt-2">{MOCK_DASHBOARD_STATS.totalDeliveries}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500 font-medium">
                <ArrowUpRight className="w-4 h-4" /> {MOCK_DASHBOARD_STATS.totalDeliveriesTrend}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            
            {/* MAIN STATUS MAP (Dominant) */}
            <Card className="lg:col-span-2 flex flex-col h-full min-h-[500px] p-0 overflow-hidden relative">
              <div className="p-5 border-b border-surface-border flex justify-between items-center bg-white z-10 relative">
                <h3 className="font-bold text-content-primary">Bengaluru Water Status Map</h3>
                <Badge>Live</Badge>
              </div>
              <div className="flex-1 relative">
                <MapboxWrapper />
                
                {/* Overlay Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-premium border border-surface-border text-sm">
                  <h4 className="font-semibold mb-2">Water Status</h4>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-blue-400"></div> Good</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-amber-400"></div> Moderate</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-orange-400"></div> Low</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> Critical</div>
                </div>
              </div>
            </Card>

            {/* AI CRISIS PREDICTION */}
            <div className="flex flex-col gap-6 font-outfit h-full">
              <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-t-4 border-t-primary-blue shadow-premium">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-soft/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="flex justify-between items-center mb-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-cyan p-2 rounded-xl">
                      <Sparkles className="w-5 h-5 text-primary-blue" />
                    </div>
                    <h3 className="font-bold text-xl text-content-primary tracking-tight">AI Insights</h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-surface-border text-content-secondary shadow-sm">Next 7 Days</span>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {MOCK_CRISIS_ALERTS.map(alert => (
                    <motion.div 
                      whileHover={{ scale: 1.015 }}
                      key={alert.id} 
                      className={`border rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm ${
                        alert.risk === 'High Risk' 
                          ? 'bg-red-50/70 border-red-200 hover:border-red-400 hover:shadow-[0_4px_20px_-2px_rgba(239,68,68,0.25)]' 
                          : alert.risk === 'Medium Risk'
                            ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400 hover:shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)]'
                            : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 hover:shadow-[0_4px_20px_-2px_rgba(16,185,129,0.25)]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-content-primary text-[15px]">{alert.area}</h4>
                        <Badge variant={alert.risk === 'High Risk' ? 'danger' : alert.risk === 'Medium Risk' ? 'warning' : 'success'}>
                          {alert.risk}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden border border-black/5 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: alert.confidence }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              alert.risk === 'High Risk' ? 'bg-gradient-to-r from-red-500 to-red-400' : alert.risk === 'Medium Risk' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                            }`}
                          ></motion.div>
                        </div>
                        <span className="text-xs font-bold text-content-primary font-mono bg-white/80 px-2 py-0.5 rounded border border-black/5">{alert.confidence} AI Confidence</span>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-black/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2.5">
                          <BrainCircuit className="w-4 h-4 text-primary-blue" />
                          <p className="text-[10px] text-content-secondary font-bold uppercase tracking-widest">Risk Factors</p>
                        </div>
                        <ul className="text-xs text-content-primary space-y-2">
                          {alert.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                                alert.risk === 'High Risk' ? 'bg-red-400' : alert.risk === 'Medium Risk' ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}></span>
                              <span className="leading-relaxed font-medium">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* DEMAND VS SUPPLY CHART */}
            <Card className="lg:col-span-2">
              <h3 className="font-bold text-content-primary mb-6">Demand vs Supply Trend</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="demand" name="Demand" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="supply" name="Supply" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* LIVE ACTIVITY FEED */}
            <Card>
              <h3 className="font-bold text-content-primary mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-blue" /> Live Activity Feed
              </h3>
              
              {liveActivities.length === 0 ? (
                <div className="text-center py-10 text-content-secondary text-sm">
                  Waiting for live updates...
                </div>
              ) : (
                <div className="space-y-4">
                  {liveActivities.map(activity => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 items-start border-l-2 border-primary-blue pl-3 py-1"
                    >
                      <div className="text-xs font-medium text-content-secondary w-12 shrink-0">{activity.time}</div>
                      <p className="text-sm text-content-primary">{activity.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardApp;
