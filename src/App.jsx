import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVerification";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AUTH_STORAGE_KEY } from "./constants/auth.js";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/otp", "/dashboard"];
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true",
  );

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(localStorage.getItem(AUTH_STORAGE_KEY) === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(AUTH_STORAGE_KEY) === "true");
  }, [location.pathname]);

  const showNavbar =
    !hideNavbarRoutes.includes(location.pathname) && !isAuthenticated;

  return (
    <div className="min-h-screen bg-[#111111]">
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
