import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-slate-700 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition-all placeholder:text-slate-400 font-medium"
    />
  </div>
);

const AuthForms = () => {
  const {
    authMode,
    selectedRole,
    setAuthMode,
    setSelectedRole,
    login,
    intendedRoute,
    setIntendedRoute,
  } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    email: "",
    mobile: "",
    aadhaar: "",
    vehicle: "",
    dl: "",
    dlImage: null, // File object for worker DL upload
    officialId: "",
    password: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData((prev) => ({ ...prev, dlImage: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // ── API calls ──────────────────────────────────────────────

  const registerCustomer = async () => {
    const res = await fetch(`${API_BASE}/auth/customer/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user: formData.user,
        email: formData.email || null,
        mobile: formData.mobile,
        password: formData.password,
      }),
    });
    return res;
  };

  const loginCustomer = async () => {
    const res = await fetch(`${API_BASE}/auth/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // JWT arrives as httpOnly cookie
      body: JSON.stringify({
        mobile: formData.mobile,
        password: formData.password,
      }),
    });
    return res;
  };

  const registerWorker = async () => {
    // Worker registration uses multipart/form-data (has file upload)
    const payload = new FormData();
    payload.append("user", formData.user);
    payload.append("mobile", formData.mobile);
    payload.append("aadhaar", formData.aadhaar);
    payload.append("password", formData.password);
    payload.append("vehicle", formData.vehicle);
    payload.append("dl", formData.dl);
    if (formData.dlImage) {
      payload.append("dl_image", formData.dlImage);
    }

    const res = await fetch(`${API_BASE}/auth/worker/register`, {
      method: "POST",
      credentials: "include",
      body: payload, // No Content-Type header — browser sets multipart boundary
    });
    return res;
  };

  const loginWorker = async () => {
    const res = await fetch(`${API_BASE}/auth/worker/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        mobile: formData.mobile,
        password: formData.password,
      }),
    });
    return res;
  };

  const loginOfficial = async () => {
    const res = await fetch(`${API_BASE}/auth/official/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        officialId: formData.officialId,
        password: formData.password,
      }),
    });
    return res;
  };

  // ── Submit handler ─────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let res;

      if (selectedRole === "official") {
        res = await loginOfficial();
      } else if (selectedRole === "worker") {
        res =
          authMode === "login" ? await loginWorker() : await registerWorker();
      } else {
        res =
          authMode === "login"
            ? await loginCustomer()
            : await registerCustomer();
      }

      const data = await res.json();

      if (!res.ok) {
        // FastAPI returns { detail: "..." } on errors
        const msg =
          typeof data.detail === "string"
            ? data.detail
            : Array.isArray(data.detail)
              ? data.detail.map((d) => d.msg).join(", ") // pydantic validation errors
              : "Something went wrong";
        throw new Error(msg);
      }

      // Registration just succeeded — switch to login
      if (authMode === "register") {
        setAuthMode("login");
        toast.success("Account created! Please log in.");
        return;
      }

      // Login succeeded — cookie is already set by backend
      // Build local user object from response
      const userPayload = data.user ?? data;
      login({
        name: userPayload.user || userPayload.officialId || "User",
        role: userPayload.role,
        id: userPayload.id ?? userPayload.officialId,
        mobile: userPayload.mobile ?? null,
      });

      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Authentication Successful</span>
          <span className="text-sm">
            Welcome, {userPayload.user || userPayload.officialId}
          </span>
        </div>,
        { icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
      );

      if (intendedRoute) {
        navigate(intendedRoute);
        setIntendedRoute(null);
      } else {
        // Role-based default redirect
        if (selectedRole === "official") navigate("/dashboard");
        else if (selectedRole === "worker") navigate("/worker");
        else navigate("/");
      }
    } catch (err) {
      toast.error(
        <div className="flex flex-col">
          <span className="font-bold">Authentication Failed</span>
          <span className="text-sm">{err.message}</span>
        </div>,
        { icon: <XCircle className="w-5 h-5 text-red-500" /> },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => setSelectedRole(null)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
            {selectedRole === "official"
              ? "Official Portal"
              : authMode === "login"
                ? "Welcome Back"
                : "Create Account"}
          </h2>
          <p className="text-sm font-medium text-slate-500 capitalize">
            {selectedRole === "official"
              ? "Secure BWSSB Access"
              : `${selectedRole} Access`}
          </p>
        </div>
      </div>

      {/* Official badge */}
      {selectedRole === "official" && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-xs font-medium text-indigo-800 leading-relaxed">
            You are accessing a secure government portal. All activities are
            monitored and logged.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* CUSTOMER & WORKER — REGISTER */}
        {authMode === "register" && selectedRole !== "official" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InputField
              label="Full Name"
              name="user"
              placeholder="Enter your full name"
              value={formData.user}
              onChange={handleChange}
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email (optional)"
              required={false}
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={handleChange}
            />

            {/* Aadhaar only for worker */}
            {selectedRole === "worker" && (
              <InputField
                label="Aadhaar Number"
                name="aadhaar"
                placeholder="12-digit Aadhaar number"
                value={formData.aadhaar}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Worker extra fields */}
            {selectedRole === "worker" && (
              <>
                <InputField
                  label="Vehicle Registration Number"
                  name="vehicle"
                  placeholder="e.g. KA-01-AB-1234"
                  value={formData.vehicle}
                  onChange={handleChange}
                />
                <InputField
                  label="Driving License Number"
                  name="dl"
                  placeholder="Enter DL number"
                  value={formData.dl}
                  onChange={handleChange}
                />

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Upload DL Document
                  </label>
                  <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-center">
                    <p className="text-sm font-bold text-slate-700 mb-1">
                      {formData.dlImage ? formData.dlImage.name : "Choose File"}
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF or JPG accepted
                    </p>
                    <input
                      type="file"
                      name="dlImage"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* CUSTOMER & WORKER — LOGIN */}
        {authMode === "login" && selectedRole !== "official" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InputField
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </motion.div>
        )}

        {/* OFFICIAL — LOGIN ONLY */}
        {selectedRole === "official" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InputField
              label="Official User ID"
              name="officialId"
              placeholder="e.g. BWSSB-EMP-2024"
              value={formData.officialId}
              onChange={handleChange}
            />
            <InputField
              label="Secure Password"
              name="password"
              type="password"
              placeholder="Enter your portal password"
              value={formData.password}
              onChange={handleChange}
            />
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-4 bg-primary-blue text-white font-bold rounded-xl shadow-premium shadow-primary-blue/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {authMode === "login" ? "Secure Login" : "Complete Registration"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch mode */}
      {selectedRole !== "official" && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="text-primary-blue font-bold hover:underline focus:outline-none"
            >
              {authMode === "login" ? "Register now" : "Login instead"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForms;
