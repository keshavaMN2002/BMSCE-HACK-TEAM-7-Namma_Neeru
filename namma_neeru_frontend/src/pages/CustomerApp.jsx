import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { ArrowRight, AlertTriangle, Truck, Activity, Droplet, Clock, Map, BellRing } from 'lucide-react';
import heroImage from '../assets/back-ground.png';

const Badge = ({ text, className }) => (
  <span className={className}>{text}</span>
);

const CustomerApp = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* FULL WIDTH HERO SECTION */}
      <section className="relative w-full h-auto min-h-[500px] lg:h-[600px] flex items-center bg-white overflow-hidden">
        {/* Background Image covering the entire area */}
        <img 
          src={heroImage} 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
        />
        
        {/* Soft Fade at the bottom to blend into the page */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 flex flex-col lg:flex-row h-full">
          
          {/* Left Panel */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center h-full pt-4 lg:pt-0">
            <Badge text="SMART WATER FOR BENGALURU" className="mb-4 self-start text-[10px] tracking-wider text-primary-blue bg-blue-50 px-3 py-1 rounded-full font-bold uppercase" />
            
            <h1 className="text-[42px] leading-[1.1] font-extrabold text-content-primary mb-6">
              Book Water <br/>
              Tankers Instantly <br/>
              <span className="text-primary-blue">Across Bengaluru</span>
            </h1>
            
            <p className="text-content-secondary text-lg mb-8 max-w-md">
              AI-powered tanker booking, live tracking, water crisis prediction & real-time alerts.
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <NavLink to="/book">
                <Button size="lg" className="px-8 shadow-premium shadow-primary-blue/30 group">
                  Book a Tanker
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/worker">
                <Button variant="outline" size="lg" className="px-8 bg-white border border-surface-border text-content-primary">
                  Track Live Tankers
                </Button>
              </NavLink>
            </div>

            {/* High Risk Alert Card */}
            <div className="max-w-sm border border-red-100 bg-white rounded-2xl p-5 shadow-soft relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[11px] font-bold text-red-500 uppercase tracking-wider">High Risk Alert</h4>
                  </div>
                  <p className="font-bold text-content-primary text-base mt-1">HSR Layout</p>
                  <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                    High chance of water shortage in 4-6 days. Reserve now!
                  </p>
                  <div className="flex items-center text-xs font-bold text-primary-blue mt-3">
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section (Keeps legend aligned) */}
          <div className="w-full lg:w-7/12 relative mt-10 lg:mt-0">
            {/* Map Legend Overlay */}
            <div className="lg:absolute lg:bottom-12 lg:right-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-soft border border-surface-border w-48 z-10 pointer-events-auto">
              <h4 className="text-xs font-bold text-content-primary mb-3">Legend</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center"><Truck className="w-3 h-3 text-primary-blue" /></div> Available Tankers
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-500"></div></div> On Delivery
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center"><Droplet className="w-3 h-3 text-red-500" /></div> Low Water Zone
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center"><Map className="w-3 h-3 text-primary-blue" /></div> Reservoirs
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 lg:mt-8">
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Truck className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-2">Instant Tanker Booking</h3>
              <p className="text-xs text-content-secondary leading-relaxed">Book nearby verified tankers in just a few taps. Real-time ETA & tracking.</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-2">AI Crisis Prediction</h3>
              <p className="text-xs text-content-secondary leading-relaxed">ML models predict shortages before they happen and send you early alerts.</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Droplet className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-2">Water Availability</h3>
              <p className="text-xs text-content-secondary leading-relaxed">Track reservoir levels, groundwater status & local water availability.</p>
            </div>
          </Card>
        </div>

        {/* LIVE OVERVIEW SECTION */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-content-primary mb-4">Live Overview</h2>
          
          <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[300px] items-stretch">
            {/* Left Status Column */}
            <div className="w-full lg:w-3/12 flex flex-col gap-4">
              <Card className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-content-primary mb-1">Bengaluru Water Status</h3>
                  <p className="text-xs text-content-secondary mb-4">Updated just now</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-surface-border">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-content-secondary font-medium">Overall Status</p>
                      <p className="font-bold text-sm text-content-primary">Moderate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-surface-border">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-content-secondary font-medium">Avg. Reservoir Capacity</p>
                      <p className="font-bold text-sm text-content-primary">68%</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-xs font-bold text-primary-blue mt-4 cursor-pointer group w-fit">
                  View Full Report
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
            
            {/* Middle Heatmap Column */}
            <div className="w-full lg:w-6/12">
              <Card className="h-full p-5 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="font-bold text-sm text-content-primary">Water Availability Heatmap</h3>
                  <select className="bg-surface border border-surface-border text-xs font-medium rounded-lg px-2 py-1 outline-none">
                    <option>All Areas</option>
                  </select>
                </div>
                
                {/* CSS Mock Heatmap representing Bengaluru layout */}
                <div className="flex-1 w-full bg-slate-50 rounded-xl border border-surface-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 blur-[20px]" style={{
                    background: 'radial-gradient(circle at 30% 40%, #3B82F6 0%, transparent 40%), radial-gradient(circle at 70% 60%, #F59E0B 0%, transparent 40%), radial-gradient(circle at 60% 80%, #EF4444 0%, transparent 30%), radial-gradient(circle at 40% 70%, #10B981 0%, transparent 40%)'
                  }}></div>
                  <Map className="w-12 h-12 text-slate-300 relative z-10" />
                </div>
                
                <div className="flex items-center justify-center gap-6 mt-4 relative z-10">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Good</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Moderate</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary"><span className="w-2.5 h-2.5 rounded bg-orange-500"></span> Low</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Critical</div>
                </div>
              </Card>
            </div>
            
            {/* Right Stats Column */}
            <div className="w-full lg:w-3/12 flex flex-col gap-4">
              <Card className="flex-1 p-5 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-content-primary mb-6">Live Tankers</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[32px] leading-none font-bold text-content-primary mb-1">356</p>
                    <p className="text-[11px] text-content-secondary font-medium">Active Tankers</p>
                  </div>
                  <div>
                    <p className="text-[32px] leading-none font-bold text-content-primary mb-1">23 <span className="text-base font-medium">min</span></p>
                    <p className="text-[11px] text-content-secondary font-medium">Avg. Delivery Time</p>
                  </div>
                </div>
                
                <div className="flex items-center text-xs font-bold text-primary-blue mt-6 cursor-pointer group w-fit">
                  View on Map
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* EMERGENCY BANNER */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pb-8 lg:pb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 border border-red-200 shrink-0">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-1">Need water urgently?</h3>
              <p className="text-sm text-content-secondary">Request emergency delivery and get priority tanker allocation.</p>
            </div>
          </div>
          <Button variant="outline" className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-6 shrink-0">
            Emergency Request
          </Button>
        </div>

      </main>
      
    </div>
  );
};

export default CustomerApp;
