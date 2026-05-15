import React from 'react';
import Navbar from '../components/shared/Navbar';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import AlertBanner from '../components/shared/AlertBanner';
import MapboxWrapper from '../components/maps/MapboxWrapper';
import { useBookingStore } from '../store/bookingStore';
import { useTankerStore } from '../store/tankerStore';
import { MapPin, Droplet, Droplets, Clock, ArrowRight, ShieldCheck, CreditCard, HeadphonesIcon, MessageSquare, Truck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import truckImg from '../assets/truck.png';

const BookApp = () => {
  const { setBookingState, selectedQuantity, selectedType } = useBookingStore();
  const tankers = useTankerStore(state => state.tankers);
  const navigate = useNavigate();

  const handleBooking = () => {
    toast.success("Booking confirmed! Your tanker is on the way.", {
      description: "You can track your order in the Track Order page."
    });
    setTimeout(() => {
      navigate('/worker');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* Left Booking Panel */}
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-surface-border flex flex-col h-full">
              <h2 className="text-[28px] font-bold text-content-primary mb-1">Book Water Tanker</h2>
              <p className="text-content-secondary text-sm mb-6">Fast. Reliable. Verified.</p>

              <div className="space-y-4 flex-1">
                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-content-primary">Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue" />
                    <input
                      type="text"
                      placeholder="HSR Layout, Sector 2, Bengaluru"
                      className="w-full pl-9 pr-4 py-3 bg-surface rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all text-sm font-medium"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-content-secondary hover:text-primary-blue">
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid for Quantity & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-primary">Water Quantity</label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue" />
                      <select
                        value={selectedQuantity}
                        onChange={(e) => setBookingState({ selectedQuantity: Number(e.target.value) })}
                        className="w-full pl-9 pr-4 py-3 bg-surface rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-blue/20 appearance-none text-sm font-bold text-content-primary"
                      >
                        <option value="500">500 Liters</option>
                        <option value="1000">1000 Liters</option>
                        <option value="2000">2000 Liters</option>
                        <option value="5000">5000 Liters</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-primary">Delivery Type</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue" />
                      <select
                        value={selectedType}
                        onChange={(e) => setBookingState({ selectedType: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-surface rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-blue/20 appearance-none text-sm font-bold text-content-primary"
                      >
                        <option value="Instant">Instant (Within 2 hrs)</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Alert Card */}
                <div className="bg-[#F0F7FF] border border-[#DCEBFE] rounded-xl p-4 flex gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-content-primary mb-0.5">High demand predicted in your area within 3 days.</p>
                      <p className="text-[11px] text-content-secondary">Book now to ensure on-time delivery.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-content-secondary" />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-content-primary">Special Instructions <span className="text-content-secondary font-normal">(Optional)</span></label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-content-secondary" />
                    <textarea
                      placeholder="E.g., Gate number, landmark, any notes..."
                      className="w-full pl-9 pr-4 py-3 bg-surface rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all resize-none h-[70px] text-sm"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Button fullWidth size="lg" className="group py-4 text-base shadow-premium shadow-primary-blue/20" onClick={handleBooking}>
                    Book Tanker Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="flex flex-wrap justify-center items-center pt-4 px-2 gap-x-2 gap-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-content-secondary font-medium uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Verified Tankers
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 text-[10px] text-content-secondary font-medium uppercase tracking-wider">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Transparent Pricing
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 text-[10px] text-content-secondary font-medium uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> On-time Delivery
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Live Map Section */}
          <div className="flex-1 min-w-0 min-h-[400px] relative rounded-3xl overflow-hidden shadow-soft border border-surface-border bg-slate-50">
            <MapboxWrapper />

            {/* Floating Info Card (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-6 left-6 bg-white p-4 rounded-2xl shadow-premium border border-surface-border min-w-[220px] flex gap-4 z-10"
            >
              <div className="flex-1">
                <h3 className="font-bold text-content-primary mb-2 text-sm">Nearest Tanker</h3>
                <p className="text-xs text-content-secondary mb-1">2.3 km away</p>
                <p className="text-sm font-bold text-primary-blue mb-3">ETA: 18 mins</p>
                <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                  <span className="text-xs font-bold text-content-primary">KA 03 AB 1234</span>
                  <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">★ 4.8</div>
                </div>
              </div>
              <div className="w-20 h-14 bg-blue-50/50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50 p-1">
                <img src={truckImg} alt="Tanker" className="w-[120%] h-auto drop-shadow-md scale-110" />
              </div>
            </motion.div>

            {/* Map Legend (Bottom Right) */}
            <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-premium border border-surface-border min-w-[180px] z-10">
              <h4 className="text-sm font-bold text-content-primary mb-3">Legend</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-content-primary font-medium">
                  <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center border border-blue-100"><Truck className="w-3.5 h-3.5 text-primary-blue" /></div> Available Tanker
                </div>
                <div className="flex items-center gap-3 text-xs text-content-primary font-medium">
                  <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center border border-green-100"><div className="w-2 h-2 rounded-full bg-green-500"></div></div> On Delivery
                </div>
                <div className="flex items-center gap-3 text-xs text-content-primary font-medium">
                  <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center border border-amber-100"><Droplets className="w-3.5 h-3.5 text-amber-500" /></div> Low Water Zone
                </div>
                <div className="flex items-center gap-3 text-xs text-content-primary font-medium">
                  <div className="w-6 h-6 rounded bg-cyan-50 flex items-center justify-center border border-cyan-100"><Droplets className="w-3.5 h-3.5 text-cyan-500" /></div> Reservoir
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEARBY TANKERS SECTION */}
        <div className="mt-4">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-xl font-bold text-content-primary">Nearby Tankers</h3>
            <button className="text-sm font-bold text-primary-blue hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tankers.map(tanker => (
              <Card key={tanker.id} className="flex flex-col relative overflow-hidden p-5 shadow-sm hover:shadow-premium transition-shadow border border-surface-border">
                {tanker.id === "KA-01-AB-1234" && (
                  <div className="absolute top-3 right-3 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded">
                    Recommended
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-20 h-14 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-surface-border p-1">
                    <img src={truckImg} alt="Tanker" className="w-[120%] h-auto drop-shadow-sm scale-110" />
                  </div>
                  <div>
                    <h4 className="font-bold text-content-primary text-sm">{tanker.id}</h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      ★ {tanker.rating} <span className="text-content-secondary font-medium">({tanker.reviews}+)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-content-secondary mb-4 font-medium uppercase tracking-wider">
                  <span>{tanker.distance}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>ETA {tanker.eta}</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-border">
                  <span className="font-bold text-xl text-content-primary">₹{tanker.price}</span>
                  <Button variant="primary" size="sm" className="px-6 font-bold">Select</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* BOTTOM TRUST FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 pb-12">
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-surface-border">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-content-primary mb-0.5">Verified Tankers</h4>
              <p className="text-[11px] text-content-secondary">All tankers are verified by BWSSB</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-surface-border">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-content-primary mb-0.5">Real-time Tracking</h4>
              <p className="text-[11px] text-content-secondary">Track your tanker live on map</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-surface-border">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-content-primary mb-0.5">Secure Payments</h4>
              <p className="text-[11px] text-content-secondary">Safe, transparent & cashless</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-surface-border">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100 shrink-0">
              <HeadphonesIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-content-primary mb-0.5">24/7 Support</h4>
              <p className="text-[11px] text-content-secondary">We're here to help, anytime</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default BookApp;
