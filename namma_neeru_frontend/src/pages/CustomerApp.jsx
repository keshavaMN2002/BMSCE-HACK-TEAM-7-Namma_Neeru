import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Button from "../components/shared/Button";
import Card from "../components/shared/Card";
import {
  ArrowRight,
  AlertTriangle,
  Truck,
  Activity,
  Droplet,
  Clock,
  Map,
  BellRing,
  MapPin,
  LocateFixed,
  WifiOff
} from "lucide-react";
import heroImage from "../assets/back-ground.png";
import BengaluruHeatmap from "../components/BengaluruHeatmap";
import { useAlertStore } from "../store/alertStore";
import { motion, AnimatePresence } from "framer-motion";

const Badge = ({ text, className }) => (
  <span className={className}>{text}</span>
);

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

// ── Location status pill shown inside the AI Insights card ───
const LocationPill = ({ status, locationName }) => {
  const states = {
    idle: {
      icon: LocateFixed,
      text: "Detecting location…",
      color: "text-content-secondary bg-slate-100",
    },
    locating: {
      icon: LocateFixed,
      text: "Getting GPS fix…",
      color: "text-blue-600 bg-blue-50",
      animate: true,
    },
    geocoding: {
      icon: MapPin,
      text: "Identifying ward…",
      color: "text-blue-600 bg-blue-50",
      animate: true,
    },
    ready: {
      icon: MapPin,
      text: locationName,
      color: "text-emerald-700 bg-emerald-50",
    },
    error: {
      icon: WifiOff,
      text: "Location unavailable",
      color: "text-red-500 bg-red-50",
    },
  };
  const s = states[status] || states.idle;
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}
    >
      <s.icon className={`w-3.5 h-3.5 ${s.animate ? "animate-pulse" : ""}`} />
      {s.text}
    </span>
  );
};

const CustomerApp = () => {
  const liveActivities = useAlertStore((state) => state.liveActivities);

  const [aiInsights, setAiInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationName, setLocationName] = useState("");
  const [locationError, setLocationError] = useState("");

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
          }),
        );
      } catch (err) {
        if (!cancelled) {
          setLocationStatus("error");
          setLocationError(
            err.code === 1
              ? "Location permission denied. Please allow access."
              : "Could not determine your location.",
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
        const response = await fetch(
          "http://127.0.0.1:8000/api/ml/high-risk-areas",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ward_name: wardName }),
          },
        );

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

    return () => {
      cancelled = true;
    };
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden">
      <Navbar />

      {/* FULL WIDTH HERO SECTION */}
      <section className="relative w-full h-auto min-h-[500px] lg:h-[600px] flex items-center bg-white overflow-hidden pt-20">
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
            <Badge
              text="SMART WATER FOR BENGALURU"
              className="mb-4 self-start text-[10px] tracking-wider text-primary-blue bg-blue-50 px-3 py-1 rounded-full font-bold uppercase"
            />

            <h1 className="text-[42px] leading-[1.1] font-extrabold text-content-primary mb-6">
              Book Water <br />
              Tankers Instantly <br />
              <span className="text-primary-blue">Across Bengaluru</span>
            </h1>

            <p className="text-content-secondary text-lg mb-8 max-w-md">
              AI-powered tanker booking, live tracking, water crisis prediction
              & real-time alerts.
            </p>

            <div className="flex items-center gap-4 mb-10">
              <NavLink to="/book">
                <Button
                  size="lg"
                  className="px-8 shadow-premium shadow-primary-blue/30 group"
                >
                  Book a Tanker
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/worker">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 bg-white border border-surface-border text-content-primary"
                >
                  Track Live Tankers
                </Button>
              </NavLink>
            </div>
            {/* ── AI CRISIS PREDICTION ── */}
            <div className="flex flex-col gap-6 font-outfit h-full">
              <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-t-4 border-t-primary-blue shadow-premium">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-soft/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-cyan p-2 rounded-xl">
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
                  <LocationPill
                    status={locationStatus}
                    locationName={locationName}
                  />
                </div>

                {/* Body */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  <AnimatePresence mode="wait">
                    {loadingInsights ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                          {locationStatus === "locating" &&
                            "Getting your location…"}
                          {locationStatus === "geocoding" &&
                            "Identifying your ward…"}
                          {locationStatus === "idle" && "Starting…"}
                        </p>
                      </motion.div>
                    ) : locationError ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-3 py-8 text-center"
                      >
                        <WifiOff className="w-8 h-8 text-red-400" />
                        <p className="text-sm text-red-500 font-medium">
                          {locationError}
                        </p>
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                                  {alert.details.subdivision} ·{" "}
                                  {alert.details.service_station}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                alert.risk === "High Risk"
                                  ? "danger"
                                  : alert.risk === "Medium Risk"
                                    ? "warning"
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
                                  alert.risk === "High Risk"
                                    ? "bg-red-500"
                                    : alert.risk === "Medium Risk"
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                }`}
                              />
                            </div>
                            <span className="text-xs font-bold">
                              {alert.confidence}
                            </span>
                          </div>

                          {/* Supply details row */}
                          {alert.details && (
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {[
                                {
                                  label: "Supply",
                                  value: alert.details.days_supply,
                                },
                                {
                                  label: "Hours/day",
                                  value: `${alert.details.supply_hours}h`,
                                },
                                {
                                  label: "Connections",
                                  value:
                                    alert.details.num_connections?.toLocaleString(),
                                },
                              ].map(
                                ({ label, value }) =>
                                  value && (
                                    <span
                                      key={label}
                                      className="text-[10px] bg-white/80 border border-surface-border px-2 py-1 rounded-lg text-content-secondary font-medium"
                                    >
                                      {label}:{" "}
                                      <span className="text-content-primary">
                                        {value}
                                      </span>
                                    </span>
                                  ),
                              )}
                            </div>
                          )}

                          {/* Risk factors */}
                          <div className="bg-white/90 p-3 rounded-xl">
                            <p className="text-[10px] text-content-secondary font-bold uppercase mb-2">
                              Risk Factors
                            </p>
                            <ul className="text-xs text-content-primary space-y-2">
                              {alert.reasons.map((reason, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                      alert.risk === "High Risk"
                                        ? "bg-red-400"
                                        : alert.risk === "Medium Risk"
                                          ? "bg-amber-400"
                                          : "bg-emerald-400"
                                    }`}
                                  />
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

          {/* Right Section (Keeps legend aligned) */}
          <div className="w-full lg:w-7/12 relative mt-10 lg:mt-0">
            {/* Map Legend Overlay */}
            <div className="lg:absolute lg:bottom-12 lg:right-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-soft border border-surface-border w-48 z-10 pointer-events-auto">
              <h4 className="text-xs font-bold text-content-primary mb-3">
                Legend
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                    <Truck className="w-3 h-3 text-primary-blue" />
                  </div>{" "}
                  Available Tankers
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>{" "}
                  On Delivery
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center">
                    <Droplet className="w-3 h-3 text-red-500" />
                  </div>{" "}
                  Low Water Zone
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-medium">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                    <Map className="w-3 h-3 text-primary-blue" />
                  </div>{" "}
                  Reservoirs
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
              <h3 className="font-bold text-content-primary mb-2">
                Instant Tanker Booking
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Book nearby verified tankers in just a few taps. Real-time ETA &
                tracking.
              </p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-2">
                AI Crisis Prediction
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                ML models predict shortages before they happen and send you
                early alerts.
              </p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Droplet className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <h3 className="font-bold text-content-primary mb-2">
                Water Availability
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Track reservoir levels, groundwater status & local water
                availability.
              </p>
            </div>
          </Card>
        </div>

        {/* LIVE OVERVIEW SECTION */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-content-primary mb-4">
            Live Overview
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[300px] items-stretch">
            {/* Left Status Column */}
            <div className="w-full lg:w-3/12 flex flex-col gap-4">
              <Card className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-content-primary mb-1">
                    Bengaluru Water Status
                  </h3>
                  <p className="text-xs text-content-secondary mb-4">
                    Updated just now
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-surface-border">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-content-secondary font-medium">
                        Overall Status
                      </p>
                      <p className="font-bold text-sm text-content-primary">
                        Moderate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-surface-border">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue border border-blue-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-content-secondary font-medium">
                        Avg. Reservoir Capacity
                      </p>
                      <p className="font-bold text-sm text-content-primary">
                        68%
                      </p>
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
                  <h3 className="font-bold text-sm text-content-primary">
                    Water Availability Heatmap
                  </h3>
                  <select className="bg-surface border border-surface-border text-xs font-medium rounded-lg px-2 py-1 outline-none">
                    <option>All Areas</option>
                  </select>
                </div>

                {/* Interactive Bengaluru GeoJSON Heatmap */}
                <div className="flex-1 w-full rounded-xl overflow-hidden border border-surface-border relative">
                  <BengaluruHeatmap />
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 relative z-10">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>{" "}
                    Good
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>{" "}
                    Moderate
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500"></span>{" "}
                    Low
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-secondary">
                    <span className="w-2.5 h-2.5 rounded bg-red-500"></span>{" "}
                    Critical
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Stats Column */}
            <div className="w-full lg:w-3/12 flex flex-col gap-4">
              <Card className="flex-1 p-5 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-content-primary mb-6">
                  Live Tankers
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-[32px] leading-none font-bold text-content-primary mb-1">
                      356
                    </p>
                    <p className="text-[11px] text-content-secondary font-medium">
                      Active Tankers
                    </p>
                  </div>
                  <div>
                    <p className="text-[32px] leading-none font-bold text-content-primary mb-1">
                      23 <span className="text-base font-medium">min</span>
                    </p>
                    <p className="text-[11px] text-content-secondary font-medium">
                      Avg. Delivery Time
                    </p>
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
              <h3 className="font-bold text-content-primary mb-1">
                Need water urgently?
              </h3>
              <p className="text-sm text-content-secondary">
                Request emergency delivery and get priority tanker allocation.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-6 shrink-0"
          >
            Emergency Request
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CustomerApp;
