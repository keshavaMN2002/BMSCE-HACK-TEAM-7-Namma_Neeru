import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/Navbar";
import Card from "../components/shared/Card";
import Badge from "../components/shared/Badge";
import AlertBanner from "../components/shared/AlertBanner";
import MapboxWrapper from "../components/maps/MapboxWrapper";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_CRISIS_ALERTS,
} from "../mock/dashboardStats";
import { useAlertStore } from "../store/alertStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Activity,
  Truck,
  AlertTriangle,
  Users,
  Settings,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MapPin,
  LocateFixed,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_CHART_DATA = [
  { day: "14 May", demand: 400, supply: 420 },
  { day: "15 May", demand: 600, supply: 480 },
  { day: "16 May", demand: 850, supply: 600 },
  { day: "17 May", demand: 1100, supply: 750 },
  { day: "18 May", demand: 1300, supply: 800 },
  { day: "19 May", demand: 1400, supply: 900 },
  { day: "20 May", demand: 1550, supply: 1000 },
];

// ── Reverse geocode coords → ward/suburb name via Nominatim ──
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
  });
  const data = await res.json();
  const addr = data.address || {};
  // Nominatim returns suburb / quarter / neighbourhood / city_district for Bengaluru wards
  return (
    addr.suburb ||
    addr.quarter ||
    addr.neighbourhood ||
    addr.city_district ||
    addr.county ||
    addr.city ||
    "Unknown Area"
  );
}

const SidebarItem = ({ icon: Icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
      active
        ? "bg-blue-50 text-primary-blue font-medium"
        : "text-content-secondary hover:bg-slate-50 hover:text-content-primary"
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? "text-primary-blue" : ""}`} />
    <span className="text-sm">{label}</span>
  </div>
);

// ── Location status pill shown inside the AI Insights card ───
const LocationPill = ({ status, locationName }) => {
  const states = {
    idle:     { icon: LocateFixed, text: "Detecting location…", color: "text-content-secondary bg-slate-100" },
    locating: { icon: LocateFixed, text: "Getting GPS fix…",    color: "text-blue-600 bg-blue-50",   animate: true },
    geocoding:{ icon: MapPin,      text: "Identifying ward…",   color: "text-blue-600 bg-blue-50",   animate: true },
    ready:    { icon: MapPin,      text: locationName,          color: "text-emerald-700 bg-emerald-50" },
    error:    { icon: WifiOff,     text: "Location unavailable",color: "text-red-500 bg-red-50" },
  };
  const s = states[status] || states.idle;
  return (
    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
      <s.icon className={`w-3.5 h-3.5 ${s.animate ? "animate-pulse" : ""}`} />
      {s.text}
    </span>
  );
};

const DashboardApp = () => {
  const liveActivities = useAlertStore((state) => state.liveActivities);

  const [aiInsights,      setAiInsights]      = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [locationStatus,  setLocationStatus]  = useState("idle");   // idle | locating | geocoding | ready | error
  const [locationName,    setLocationName]    = useState("");
  const [locationError,   setLocationError]   = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // ── Step 1: Get GPS coords ───────────────────────────
      setLocationStatus("locating");
      setLoadingInsights(true);

      let coords;
      try {
        coords = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          })
        );
      } catch (err) {
        if (!cancelled) {
          setLocationStatus("error");
          setLocationError(
            err.code === 1
              ? "Location permission denied. Please allow access."
              : "Could not determine your location."
          );
          setLoadingInsights(false);
        }
        return;
      }

      if (cancelled) return;
      const { latitude, longitude } = coords.coords;

      // ── Step 2: Reverse geocode → ward name ──────────────
      setLocationStatus("geocoding");
      let wardName = "Unknown Area";
      try {
        wardName = await reverseGeocode(latitude, longitude);
      } catch {
        // proceed with Unknown Area; ML endpoint handles it
      }

      if (cancelled) return;
      setLocationName(wardName);
      setLocationStatus("ready");

      // ── Step 3: Call ML endpoint with ward_name ───────────
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ml/high-risk-areas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ward_name: wardName }),
        });

        const data = await response.json();
        if (!cancelled) {
          // Normalise: API returns either a single object or {error:…}
          if (data.error) {
            setLocationError(data.error);
            setAiInsights([]);
          } else {
            // Attach the resolved ward name for display in the card
            setAiInsights([{ ...data, area: wardName }]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setLocationError("Failed to reach prediction service.");
          setAiInsights([]);
        }
      } finally {
        if (!cancelled) setLoadingInsights(false);
      }
    };

    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by this browser.");
      setLoadingInsights(false);
    } else {
      run();
    }

    return () => { cancelled = true; };
  }, []);

  // Manual retry
  const handleRetry = () => {
    setAiInsights([]);
    setLocationError("");
    setLocationStatus("idle");
    setLoadingInsights(true);
    // Re-trigger effect via key trick — simplest: just reload the component state
    // For a real app, extract the effect into a named function and call it here.
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-surface-border bg-white hidden lg:flex flex-col p-4 shrink-0">
          <div className="space-y-1 mt-4">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Activity}        label="Live Monitoring" />
            <SidebarItem icon={Truck}           label="Tankers" />
            <SidebarItem icon={AlertTriangle}   label="Crisis Prediction" />
            <SidebarItem icon={Users}           label="User Management" />
            <SidebarItem icon={Settings}        label="Settings" />
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
            {/* MAP */}
            <Card className="lg:col-span-2 flex flex-col h-full min-h-[500px] p-0 overflow-hidden relative">
              <div className="p-5 border-b border-surface-border flex justify-between items-center bg-white z-10 relative">
                <h3 className="font-bold text-content-primary">Bengaluru Water Status Map</h3>
                <Badge>Live</Badge>
              </div>
              <div className="flex-1 relative">
                <MapboxWrapper />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-premium border border-surface-border text-sm">
                  <h4 className="font-semibold mb-2">Water Status</h4>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-blue-400"></div> Good</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-amber-400"></div> Moderate</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded bg-orange-400"></div> Low</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> Critical</div>
                </div>
              </div>
            </Card>

            {/* ── AI CRISIS PREDICTION ── */}
            <div className="flex flex-col gap-6 font-outfit h-full">
              <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-t-4 border-t-primary-blue shadow-premium">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-soft/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-cyan p-2 rounded-xl">
                      <Sparkles className="w-5 h-5 text-primary-blue" />
                    </div>
                    <h3 className="font-bold text-xl text-content-primary tracking-tight">
                      AI Insights
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-surface-border text-content-secondary shadow-sm">
                    Next 7 Days
                  </span>
                </div>

                {/* Location pill */}
                <div className="mb-4 relative z-10">
                  <LocationPill status={locationStatus} locationName={locationName} />
                </div>

                {/* Body */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  <AnimatePresence mode="wait">
                    {loadingInsights ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10 gap-3 text-content-secondary"
                      >
                        {/* Animated water-drop loader */}
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping" />
                          <div className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <p className="text-sm font-medium">
                          {locationStatus === "locating"  && "Getting your location…"}
                          {locationStatus === "geocoding" && "Identifying your ward…"}
                          {locationStatus === "idle"      && "Starting…"}
                        </p>
                      </motion.div>

                    ) : locationError ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-3 py-8 text-center"
                      >
                        <WifiOff className="w-8 h-8 text-red-400" />
                        <p className="text-sm text-red-500 font-medium">{locationError}</p>
                        <button
                          onClick={handleRetry}
                          className="text-xs px-4 py-2 bg-primary-blue text-white rounded-lg hover:opacity-90 transition"
                        >
                          Retry
                        </button>
                      </motion.div>

                    ) : aiInsights.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-10 text-content-secondary text-sm"
                      >
                        No predictions available
                      </motion.div>

                    ) : (
                      aiInsights.map((alert) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.015 }}
                          className={`border rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm ${
                            alert.risk === "High Risk"
                              ? "bg-red-50/70 border-red-200"
                              : alert.risk === "Medium Risk"
                                ? "bg-amber-50/70 border-amber-200"
                                : "bg-emerald-50/70 border-emerald-200"
                          }`}
                        >
                          {/* Ward name + risk badge */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-content-primary text-[15px]">
                                {alert.area}
                              </h4>
                              {alert.details?.subdivision && (
                                <p className="text-[11px] text-content-secondary mt-0.5">
                                  {alert.details.subdivision} · {alert.details.service_station}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                alert.risk === "High Risk"   ? "danger"
                                : alert.risk === "Medium Risk" ? "warning"
                                : "success"
                              }
                            >
                              {alert.risk}
                            </Badge>
                          </div>

                          {/* Confidence bar */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: alert.confidence }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${
                                  alert.risk === "High Risk"   ? "bg-red-500"
                                  : alert.risk === "Medium Risk" ? "bg-amber-500"
                                  : "bg-emerald-500"
                                }`}
                              />
                            </div>
                            <span className="text-xs font-bold">{alert.confidence}</span>
                          </div>

                          {/* Supply details row */}
                          {alert.details && (
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {[
                                { label: "Supply",       value: alert.details.days_supply },
                                { label: "Hours/day",    value: `${alert.details.supply_hours}h` },
                                { label: "Connections",  value: alert.details.num_connections?.toLocaleString() },
                              ].map(({ label, value }) => value && (
                                <span key={label} className="text-[10px] bg-white/80 border border-surface-border px-2 py-1 rounded-lg text-content-secondary font-medium">
                                  {label}: <span className="text-content-primary">{value}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Risk factors */}
                          <div className="bg-white/90 p-3 rounded-xl">
                            <p className="text-[10px] text-content-secondary font-bold uppercase mb-2">
                              Risk Factors
                            </p>
                            <ul className="text-xs text-content-primary space-y-2">
                              {alert.reasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                    alert.risk === "High Risk"   ? "bg-red-400"
                                    : alert.risk === "Medium Risk" ? "bg-amber-400"
                                    : "bg-emerald-400"
                                  }`} />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          </div>

          {/* DEMAND VS SUPPLY CHART + LIVE FEED — unchanged */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <h3 className="font-bold text-content-primary mb-6">Demand vs Supply Trend</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="demand" name="Demand" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="supply" name="Supply" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-content-primary mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-blue" /> Live Activity Feed
              </h3>
              {liveActivities.length === 0 ? (
                <div className="text-center py-10 text-content-secondary text-sm">Waiting for live updates...</div>
              ) : (
                <div className="space-y-4">
                  {liveActivities.map((activity) => (
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